using SmartBusinessWeb.Infrastructure;
using SBLib.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using localhost = Web.localhost;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using System.Data.Entity.Validation;
using DAL;
using ModelHelper = SBLib.Helpers.ModelHelper;
using SBCommonLib.BaseModels;
using CommonLib.Helpers;
using CommonLib.Models;
using SBLib.Models.MYOB;
using FileHelper = SBCommonLib.CommonHelpers.FileHelper;
using SBLib.Helpers;
using SBLib.Models.Purchase;
using SBLib.Models.WholeSales;
using SBLib.Models.Customer;
using Microsoft.Data.SqlClient;
using SBLib.Models.POS.Sales;
using SBLib.Models.Journal;
using CommonLib.Models.MYOB;
using SBLib.Models.Item;
using SBCommonLib.Helpers;
using SalesEditModel = SBLib.Models.AbssReport.SalesEditModel;
using Dapper;

namespace SmartBusinessWeb.Controllers
{
    [CustomAuthenticationFilter]
    public class DataTransferController : BaseController
    {
        private List<CustomerModel> VipList;
        private string dayendsFolder { get; set; }
        private string centralbaseUrl = UriHelper.GetAppUrl();
        private string ShopApiUrl = ConfigurationManager.AppSettings["ShopApiUrl"];

        //protected override bool DisableAsyncSupport
        //{
        //    get { return false; }
        //}

        [HandleError]
        //[CustomAuthorize("datatransfer", "admin", "superadmin")]
        public JsonResult CreateDayendsFolder(DayEndsModel model)
        {
            using (var context = new SBDbContext(Session["DBName"].ToString()))
            {
                Session currsess = ModelHelper.GetCurrentSession(context);
                int lang = currsess.sesLang;
                int apId = currsess.AccountProfileId;
                //central
                if (apId == 0)
                {
                    List<AccountProfileView> accountProfileViews = ModelHelper.GetAccountProfiles(context);
                    foreach (var av in accountProfileViews)
                    {
                        string myobfilename = av.ProfileName;
                        foreach (var shop in model.ShopCodeList)
                        {
                            model.DayendsFolderPathList.Add(FileHelper.CreateDayendFolder(model.mode, myobfilename, shop));
                        }

                    }
                    return Json(new { iscentral = 1, folders = model.DayendsFolderPathList });
                }
                else
                {
                    //var shopcode = currsess.sesShop;
                    var accountProfileView = ModelHelper.GetAccountProfile();
                    string myobfilename = accountProfileView.ProfileName;
                    model.DayendsFolderPath = FileHelper.CreateDayendFolder(model.mode, myobfilename, model.ShopCode);
                    return Json(new { iscentral = 0, folder = model.DayendsFolderPath });
                }
            }
        }

        [HandleError]
        [CustomAuthorize("datatransfer", "admin", "superadmin")]
        public ActionResult DayendsImportFrmCentral()
        {
            //匯入中央資料            
            ViewBag.ParentPage = "dayends";
            DayEndsModel model = new DayEndsModel();
            return View(model);
        }

        /// <summary>
        /// for online mode only
        /// </summary>
        /// <returns></returns>
        [HandleError]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult DoImportFrmCentralAsync(string filename)
        {
            string msg = Resources.Resource.ImportDoneMsg;
            int apId = ComInfo.AccountProfileId;
            DateTime dateTime = DateTime.Now;
            SessUser curruser = Session["User"] as SessUser;

            using var context = new SBDbContext(Session["DBName"].ToString());
            var comInfo = context.GetComInfo(apId).FirstOrDefault();
            string AbssConnectionString = GetAbssConnectionString("READ", comInfo);

            if (filename.StartsWith("Sales_")) SalesEditModel.WriteAbssSalesToDb(context);

            if (filename.StartsWith("SPP_")) SPPHelper.SaveSPPsToDB(context);

            if (filename.StartsWith("CI_")) CIHelper.SaveCIsToDB(context);

            if (filename.StartsWith("AccountReceivable_")) ARHelper.SaveARsToDB(context);

            if (filename.StartsWith("Quotation_")) QuotationHelper.SaveQuotationsToDB(context);

            if (filename.StartsWith("Job_"))
            {
                List<MyobJobModel> joblist = MYOBHelper.GetJobList(AbssConnectionString);
                StringBuilder sb = new StringBuilder();
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        /* remove current records first: */
                        List<MyobJob> jobss = context.MyobJobs.Where(x => x.AccountProfileId == apId).ToList();
                        context.MyobJobs.RemoveRange(jobss);
                        context.SaveChanges();
                        /*********************************/

                        List<MyobJob> newjobs = new List<MyobJob>();

                        foreach (var job in joblist)
                        {
                            newjobs.Add(new MyobJob
                            {
                                JobID = job.JobID,
                                ParentJobID = job.ParentJobID,
                                IsInactive = job.IsInactive,
                                JobName = job.JobName,
                                JobNumber = job.JobNumber,
                                IsHeader = job.IsHeader,
                                JobLevel = job.JobLevel,
                                IsTrackingReimburseable = job.IsTrackingReimburseable,
                                JobDescription = job.JobDescription,
                                ContactName = job.ContactName,
                                Manager = job.Manager,
                                PercentCompleted = job.PercentCompleted,
                                StartDate = job.StartDate,
                                FinishDate = job.FinishDate,
                                CustomerID = job.CustomerID,
                                AccountProfileId = apId,
                                CreateTime = DateTime.Now,
                                ModifyTime = DateTime.Now
                            });
                        }
                        context.MyobJobs.AddRange(newjobs);
                        context.SaveChanges();
                        ModelHelper.WriteLog(context, "Import JobName data from Central done", "ImportFrmCentral");
                        transaction.Commit();
                    }
                    catch (DbEntityValidationException e)
                    {
                        transaction.Rollback();

                        foreach (var eve in e.EntityValidationErrors)
                        {
                            sb.AppendFormat("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                                eve.Entry.Entity.GetType().Name, eve.Entry.State);
                            foreach (var ve in eve.ValidationErrors)
                            {
                                sb.AppendFormat("- Property: \"{0}\", Value: \"{1}\", Error: \"{2}\"",
                ve.PropertyName,
                eve.Entry.CurrentValues.GetValue<object>(ve.PropertyName),
                ve.ErrorMessage);
                            }
                        }
                    }
                }
                if (!string.IsNullOrEmpty(sb.ToString()))
                {
                    using var _context = new SBDbContext(Session["DBName"].ToString());
                    ModelHelper.WriteLog(_context, string.Format("Import JobName data from Central failed:{0}", sb.ToString()), "ExportFrmCentral");
                }

            }

            if (filename.StartsWith("Currency_"))
            {
                List<MyobCurrencyModel> emplist = MYOBHelper.GetCurrencyList(AbssConnectionString);
                StringBuilder sb = new StringBuilder();
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        /* remove current records first: */
                        List<MyobCurrency> currencys = context.MyobCurrencies.Where(x => x.AccountProfileId == apId).ToList();
                        context.MyobCurrencies.RemoveRange(currencys);
                        context.SaveChanges();
                        /*********************************/

                        List<MyobCurrency> newcurrencys = new List<MyobCurrency>();

                        foreach (var currency in emplist)
                        {
                            newcurrencys.Add(new MyobCurrency
                            {
                                CurrencyID = currency.CurrencyID,
                                CurrencyCode = currency.CurrencyCode,
                                CurrencyName = currency.CurrencyName,
                                ExchangeRate = currency.ExchangeRate,
                                CurrencySymbol = currency.CurrencySymbol,
                                DigitGroupingSymbol = currency.DigitGroupingSymbol,
                                SymbolPosition = currency.SymbolPosition,
                                DecimalPlaces = currency.DecimalPlaces,
                                NumberDigitsInGroup = currency.NumberDigitsInGroup,
                                DecimalPlaceSymbol = currency.DecimalPlaceSymbol,
                                NegativeFormat = currency.NegativeFormat,
                                UseLeadingZero = currency.UseLeadingZero,
                                AccountProfileId = apId,
                                CreateTime = DateTime.Now,
                                ModifyTime = DateTime.Now
                            });
                        }
                        context.MyobCurrencies.AddRange(newcurrencys);
                        context.SaveChanges();
                        ModelHelper.WriteLog(context, "Import Currency data from Central done", "ImportFrmCentral");
                        transaction.Commit();
                    }
                    catch (DbEntityValidationException e)
                    {
                        transaction.Rollback();

                        foreach (var eve in e.EntityValidationErrors)
                        {
                            sb.AppendFormat("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                                eve.Entry.Entity.GetType().Name, eve.Entry.State);
                            foreach (var ve in eve.ValidationErrors)
                            {
                                sb.AppendFormat("- Property: \"{0}\", Value: \"{1}\", Error: \"{2}\"",
                ve.PropertyName,
                eve.Entry.CurrentValues.GetValue<object>(ve.PropertyName),
                ve.ErrorMessage);
                            }
                        }
                    }
                }
                if (!string.IsNullOrEmpty(sb.ToString()))
                {
                    using var _context = new SBDbContext(Session["DBName"].ToString());
                    ModelHelper.WriteLog(_context, string.Format("Import Currency data from Central failed:{0}", sb.ToString()), "ExportFrmCentral");
                }
            }

            if (filename.StartsWith("Suppliers_")) ModelHelper.SaveSuppliersFrmCentral(context, apId, comInfo);

            if (filename.StartsWith("Employees_")) ModelHelper.SaveEmployeesFrmCentral(apId, context, AbssConnectionString, curruser);

            if (filename.StartsWith("Customers_")) ModelHelper.SaveCustomersFrmCentral(context, AbssConnectionString, apId, comInfo);

            if (filename.StartsWith("Items_")) ModelHelper.SaveItemsFrmCentral(apId, context, AbssConnectionString);

            if (filename.StartsWith("Tax_"))
            {
                AbssConn abssConn = ModelHelper.GetAbssConn(comInfo);
                List<CommonLib.Models.MYOB.TaxModel> taxlist = MYOBHelper.GetTaxList(abssConn);
                decimal taxrate = (decimal)taxlist.FirstOrDefault().TaxPercentageRate;
                string taxcode = taxlist.FirstOrDefault().TaxCode;
                StringBuilder sb = new StringBuilder();
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        #region Remove Current Data first:
                        var currentrecords = context.MyobTaxCodes.Count() > 0 ? context.MyobTaxCodes.Where(x => x.AccountProfileId == apId) : null;
                        if (currentrecords != null && currentrecords.Count() > 0)
                        {
                            context.MyobTaxCodes.RemoveRange(currentrecords);
                            context.SaveChanges();
                        }

                        #endregion
                        #region Insert Records:
                        List<MyobTaxCode> newtaxcodes = new List<MyobTaxCode>();
                        foreach (var tax in taxlist)
                        {
                            newtaxcodes.Add(new MyobTaxCode
                            {
                                TaxCodeID = tax.TaxCodeID,
                                TaxCode = tax.TaxCode,
                                TaxCodeDescription = tax.TaxCodeDescription,
                                TaxPercentageRate = tax.TaxPercentageRate,
                                TaxCodeTypeID = tax.TaxCodeTypeID,
                                TaxCollectedAccountID = tax.TaxCollectedAccountID,
                                AccruedDutyAccountID = tax.AccruedDutyAccountID,
                                LinkedCardID = tax.LinkedCardID,
                                AccountProfileId = apId,
                                CreateTime = dateTime
                            });
                        }
                        context.MyobTaxCodes.AddRange(newtaxcodes);
                        context.SaveChanges();
                        #endregion

                        var items = context.MyobItems.Where(x => x.AccountProfileId == apId).ToList();

                        foreach (var item in items)
                        {
                            if (item.itmIsTaxedWhenSold != null && (bool)item.itmIsTaxedWhenSold)
                            {
                                item.itmTaxCode = taxcode;
                                item.itmTaxPc = taxrate;
                            }
                        }

                        ModelHelper.WriteLog(context, "Import Tax data from Central done", "ExportFrmCentral");
                        context.SaveChanges();
                        transaction.Commit();

                    }
                    catch (DbEntityValidationException e)
                    {
                        transaction.Rollback();

                        foreach (var eve in e.EntityValidationErrors)
                        {
                            sb.AppendFormat("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                                eve.Entry.Entity.GetType().Name, eve.Entry.State);
                            foreach (var ve in eve.ValidationErrors)
                            {
                                sb.AppendFormat("- Property: \"{0}\", Value: \"{1}\", Error: \"{2}\"",
                ve.PropertyName,
                eve.Entry.CurrentValues.GetValue<object>(ve.PropertyName),
                ve.ErrorMessage);
                            }
                        }

                    }
                }
                if (!string.IsNullOrEmpty(sb.ToString()))
                {
                    using var _context = new SBDbContext(Session["DBName"].ToString());
                    ModelHelper.WriteLog(_context, string.Format("Import Tax data from Central failed:{0}", sb.ToString()), "ExportFrmCentral");
                }
            }

            if (filename.StartsWith("Account_"))
            {
                List<AccountModel> accountlist = MYOBHelper.GetAccountList(AbssConnectionString);
                StringBuilder sb = new StringBuilder();
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        #region remove current data first
                        List<Account> accounts = context.Accounts.Where(x => x.AccountProfileId == apId).ToList();
                        context.Accounts.RemoveRange(accounts);
                        context.SaveChanges();
                        #endregion

                        List<Account> newaccounts = new List<Account>();
                        foreach (var account in accountlist)
                        {
                            Account ac = new Account();
                            ac.AccountProfileId = apId;
                            ac.AccountName = account.AccountName;
                            ac.AccountNumber = account.AccountNumber;
                            ac.AccountID = account.AccountID;
                            ac.AccountClassificationID = account.AccountClassificationID;
                            ac.AccountTypeID = account.AccountTypeID;
                            ac.AccountLevel = account.AccountLevel;
                            ac.CreateTime = dateTime;
                            newaccounts.Add(ac);
                        }

                        context.Accounts.AddRange(newaccounts);
                        ModelHelper.WriteLog(context, "Import Account data from Central done", "ExportFrmCentral");
                        transaction.Commit();

                    }
                    catch (DbEntityValidationException e)
                    {
                        transaction.Rollback();

                        foreach (var eve in e.EntityValidationErrors)
                        {
                            sb.AppendFormat("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                                eve.Entry.Entity.GetType().Name, eve.Entry.State);
                            foreach (var ve in eve.ValidationErrors)
                            {
                                sb.AppendFormat("- Property: \"{0}\", Value: \"{1}\", Error: \"{2}\"",
                ve.PropertyName,
                eve.Entry.CurrentValues.GetValue<object>(ve.PropertyName),
                ve.ErrorMessage);
                            }
                        }

                    }
                }
                if (!string.IsNullOrEmpty(sb.ToString()))
                {
                    using var _context = new SBDbContext(Session["DBName"].ToString());
                    ModelHelper.WriteLog(_context, string.Format("Import Account data from Central failed:{0}", sb.ToString()), "ExportFrmCentral");
                }
            }

            return Json(new { msg });
        }


        [HandleError]
        [CustomAuthorize("datatransfer", "admin", "superadmin")]
        public ActionResult DayendsImportFrmShop()
        {
            //匯入分店資料
            ViewBag.ParentPage = "dayends";
            ViewBag.PageName = "dayendsimportfrmshop";
            DayEndsModel model = new DayEndsModel();

            if (ConfigurationManager.AppSettings["DemoOffline"] == "1")
            {
                //for debug only:
                model.DataTransferMode = DataTransferMode.NoInternet;
            }
            else
            {
                model.DataTransferMode = CommonHelper.CheckForInternetConnection() == true ? DataTransferMode.Internet : DataTransferMode.NoInternet;
            }

            model.IsOffLine = model.DataTransferMode == DataTransferMode.Internet ? 0 : 1;
            return View(model);
        }

        private static void WriteFileLog(List<string> donefilelist, List<string> failedfilelist, SBDbContext context)
        {
            if (donefilelist.Count > 0)
            {
                List<FileLog> donefilelogs = new List<FileLog>();
                foreach (var donefile in donefilelist)
                {
                    FileLog fileLog = new FileLog
                    {
                        Type = "I",
                        FileName = donefile,
                        Status = "Done",
                        DateTime = DateTime.Now
                    };
                    donefilelogs.Add(fileLog);
                }

                context.FileLogs.AddRange(donefilelogs);

            }
            if (failedfilelist.Count > 0)
            {
                List<FileLog> failedfilelogs = new List<FileLog>();
                foreach (var failedfile in failedfilelist)
                {
                    FileLog fileLog = new FileLog
                    {
                        Type = "I",
                        FileName = failedfile,
                        Status = "Failed",
                        DateTime = DateTime.Now
                    };
                    failedfilelogs.Add(fileLog);
                }

                context.FileLogs.AddRange(failedfilelogs);

            }
        }

        [HandleError]
        [CustomAuthorize("datatransfer", "admin", "superadmin")]
        public ActionResult DayendsExportFrmShop(string defaultCheckoutPortal = "")
        {
            string defaultcheckoutportal = ModelHelper.HandleCheckoutPortal(defaultCheckoutPortal);
            ViewBag.DefaultCheckoutPortal = defaultcheckoutportal;
            //匯出分店資料
            ViewBag.ParentPage = "dayends";
            ViewBag.PageName = "dayendsexportfrmshop";

            DayEndsModel model = new DayEndsModel();
            model.DataTransferMode = CommonHelper.CheckForInternetConnection() == true ? DataTransferMode.Internet : DataTransferMode.NoInternet;
            return View(model);
        }


        /// <summary>
        /// for online mode only
        /// </summary>
        /// <param name="model"></param>
        /// <param name="formCollection"></param>
        /// <returns></returns>
        [HandleError]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult DoExportFrmShopAsync(DayEndsModel model, FormCollection formCollection, string strfrmdate = "", string strtodate = "")
        {
            VipList = new List<CustomerModel>();
            bool includeUploaded = model.IncludeUploaded = formCollection["chkUploaded"] != null;
            string type = formCollection["type"];
            int lang = CultureHelper.CurrentCulture;
            int ret = 0;
            int excludedinvoices = 0;
            int excludedpo = 0;
            int excludedws = 0;
            CultureHelper.CurrentCulture = lang;
            string msg = Resources.Resource.ExportDoneMsg;
            DataTransferModel dmodel = new DataTransferModel
            {
                SelectedLocation = ComInfo.Shop,
                includeUploaded = includeUploaded,
            };

            #region Date Ranges
            int year = DateTime.Now.Year;
            DateTime frmdate;
            DateTime todate;
            if (string.IsNullOrEmpty(strfrmdate))
            {
                //frmdate = new DateTime(year, 1, 1);
                frmdate = DateTime.Today;
            }
            else
            {
                int mth = int.Parse(strfrmdate.Split('/')[1]);
                int day = int.Parse(strfrmdate.Split('/')[0]);
                year = int.Parse(strfrmdate.Split('/')[2]);
                frmdate = new DateTime(year, mth, day);
            }
            if (string.IsNullOrEmpty(strtodate))
            {
                //todate = new DateTime(year, 12, 31);
                todate = DateTime.Today;
            }
            else
            {
                int mth = int.Parse(strtodate.Split('/')[1]);
                int day = int.Parse(strtodate.Split('/')[0]);
                year = int.Parse(strtodate.Split('/')[2]);
                todate = new DateTime(year, mth, day);
            }

            model.DateFromTxt = CommonHelper.FormatDate(frmdate, true);
            model.DateToTxt = CommonHelper.FormatDate(todate, true);
            #endregion

            switch (type)
            {
                case "ia":
                    ExportData4SB(dmodel, "IA_", frmdate, todate, includeUploaded, lang);
                    if (dmodel.CheckOutIds_IA.Count == 0) msg = Resources.Resource.NoExportedDataFrmShop;
                    break;
                case "journal":
                    ExportData4SB(dmodel, "Journal_", frmdate, todate, includeUploaded, lang);
                    if (dmodel.CheckOutIds_Journal.Count == 0) msg = Resources.Resource.NoExportedDataFrmShop;
                    break;
                case "supplier":
                    ExportData4SB(dmodel, "Suppliers_", frmdate, todate, includeUploaded, lang);
                    if (dmodel.CheckOutCodes_Supplier.Count == 0) msg = Resources.Resource.NoExportedDataFrmShop;
                    break;
                case "purchase":
                    ExportData4SB(dmodel, "Purchase_", frmdate, todate, includeUploaded, lang);
                    if (dmodel.PoCheckOutIds.Count == 0) msg = Resources.Resource.NoExportedDataFrmShop;
                    HandleExcludedOrders(FileType.Purchase, dmodel);
                    break;
                case "item":
                    ExportData4SB(dmodel, "Items_", frmdate, todate, includeUploaded, lang);
                    if (dmodel.CheckOutCodes_Item.Count == 0) msg = Resources.Resource.NoExportedDataFrmShop;
                    break;
                case "customer":
                    ExportData4SB(dmodel, "Customers_", frmdate, todate, includeUploaded, lang);
                    if (dmodel.CheckOutCodes_Customer.Count == 0) msg = Resources.Resource.NoExportedDataFrmShop;
                    break;
                case "wholesales":
                    ExportData4SB(dmodel, "Wholesales_", frmdate, todate, includeUploaded, lang);
                    if (dmodel.CheckOutIds_WS.Count == 0) msg = Resources.Resource.NoExportedDataFrmShop;
                    HandleExcludedOrders(FileType.WholeSales, dmodel);
                    break;
                default:
                case "sales":
                    ExportData4SB(dmodel, "ItemSales_", frmdate, todate, includeUploaded, lang);
                    if (dmodel.RetailCheckOutIds.Count == 0) msg = Resources.Resource.NoExportedDataFrmShop;
                    HandleExcludedOrders(FileType.Retail, dmodel);
                    break;
            }

            if (Session["PendingInvoices"] != null)
            {
                msg = string.Concat(msg, "<br>", string.Format(Resources.Resource.InvoicesNotIntegratedDueToZeroStock, ((List<SalesLnView>)Session["PendingInvoices"]).Count));
                ret = 1;
            }
            if (Session["ExcludedRetailOrderIds"] != null)
            {
                msg = string.Concat(msg, "<br>", string.Format(Resources.Resource.InvoicesNotIntegratedDueToUnsynsItemCustomers, ((HashSet<long>)Session["ExcludedRetailOrderIds"]).Count));
                excludedinvoices = 1;
            }
            if (Session["ExcludedPurchaseOrderIds"] != null)
            {
                msg = string.Concat(msg, "<br>", string.Format(Resources.Resource.PurchaseOrdersNotIntegratedDueToUnsynsSuppliers, ((HashSet<long>)Session["ExcludedPurchaseOrderIds"]).Count));
                excludedpo = 1;
            }
            if (Session["ExcludedWSIds"] != null)
            {
                msg = string.Concat(msg, "<br>", string.Format(Resources.Resource.InvoicesNotIntegratedDueToZeroStock, ((HashSet<long>)Session["ExcludedWSIds"]).Count));
                excludedws = 1;
            }

            return Json(new { msg, PendingInvoices = ret, ExcludedInvoices = excludedinvoices, ExcludedPO = excludedpo, ExcludedWS = excludedws, offlinemode = 0 });
        }

        private void ExportData4SB(DataTransferModel dmodel, string filename, DateTime frmdate, DateTime todate, bool includeUploaded = false, int lang = 0)
        { 
            OnlineModeItem onlineModeItem = new OnlineModeItem();
            DateTime dateTime = DateTime.Now;
            string checkoutportal = string.Empty;
            bool approvalmode = (bool)ComInfo.ApprovalMode;

            using var context = new SBDbContext(Session["DBName"].ToString());

            if (SqlConnection.State == ConnectionState.Closed) SqlConnection.Open();
            using (SqlConnection)
            {
                string ConnectionString = GetAbssConnectionString(SqlConnection, "READ_WRITE");

                if (filename.StartsWith("IA_"))
                {
                    var session = ModelHelper.GetCurrentSession(context);
                    var location = session.sesShop.ToLower();
                    var device = session.sesDvc.ToLower();

                    dmodel.RetailCheckOutIds = new HashSet<long>();
                    dmodel.SelectedLocation = location;
                    dmodel.Device = device;

                    List<string> sqllist = IAEditModel.GetUploadSqlList(includeUploaded, ComInfo, apId, context, SqlConnection, frmdate, todate, ref dmodel);

                    if (sqllist.Count > 0)
                    {
                        #region Write to MYOB
                        using (localhost.Dayends dayends = new localhost.Dayends())
                        {
                            dayends.Url = ComInfo.WebServiceUrl;
                            dayends.WriteMYOBBulk(ConnectionString, sqllist.ToArray());
                        }
                        #endregion

                        #region Write sqllist into Log & update checkoutIds
                        StringBuilder sb = new StringBuilder();
                        using (var transaction = context.Database.BeginTransaction())
                        {
                            try
                            {
                                ModelHelper.WriteLog(context, string.Format("Export IA data From Shop done; sqllist:{0}; connectionstring:{1}", string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
                                List<InventoryAdjustment> ialist = context.InventoryAdjustments.Where(x => x.AccountProfileId == apId && dmodel.CheckOutIds_IA.Any(y => x.Id == y)).ToList();
                                foreach (var ia in ialist)
                                {
                                    ia.Checkout = true;
                                    ia.ModifyTime = DateTime.Now;
                                    ia.ModifyBy = User.UserCode;
                                }
                                context.SaveChanges();
                                transaction.Commit();
                            }
                            catch (DbEntityValidationException e)
                            {
                                transaction.Rollback();

                                foreach (var eve in e.EntityValidationErrors)
                                {
                                    sb.AppendFormat("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                                    foreach (var ve in eve.ValidationErrors)
                                    {
                                        sb.AppendFormat("- Property: \"{0}\", Value: \"{1}\", Error: \"{2}\"",
                        ve.PropertyName,
                        eve.Entry.CurrentValues.GetValue<object>(ve.PropertyName),
                        ve.ErrorMessage);
                                    }
                                }
                            }
                        }
                        if (!string.IsNullOrEmpty(sb.ToString()))
                        {
                            using var _context = new SBDbContext(Session["DBName"].ToString());
                            ModelHelper.WriteLog(_context, string.Format("Export PreSalesModel data From Shop failed: {0}; sql:{1}; connectionstring: {2}", sb, string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
                        }

                        #endregion
                    }
                }

                if (filename.StartsWith("Journal_"))
                {
                    var session = ModelHelper.GetCurrentSession(context);
                    var location = session.sesShop.ToLower();
                    var device = session.sesDvc.ToLower();

                    dmodel.RetailCheckOutIds = new HashSet<long>();
                    dmodel.SelectedLocation = location;
                    dmodel.Device = device;

                    List<string> sqllist = JournalEditModel.GetUploadSqlList(includeUploaded, ComInfo, SqlConnection, apId, context, frmdate, todate, ref dmodel);

                    if (sqllist.Count > 0)
                    {
                        #region Write to MYOB
                        using (localhost.Dayends dayends = new localhost.Dayends())
                        {
                            dayends.Url = ComInfo.WebServiceUrl;
                            dayends.WriteMYOBBulk(ConnectionString, sqllist.ToArray());
                        }
                        #endregion

                        #region Write sqllist into Log & update checkoutIds
                        StringBuilder sb = new StringBuilder();
                        using (var transaction = context.Database.BeginTransaction())
                        {
                            try
                            {
                                ModelHelper.WriteLog(context, string.Format("Export Journal data From Shop done; sqllist:{0}; connectionstring:{1}", string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
                                List<Journal> journallist = context.Journals.Where(x => x.AccountProfileId == apId && dmodel.CheckOutIds_Journal.Any(y => x.Id == y)).ToList();
                                foreach (var journal in journallist)
                                {
                                    journal.IsCheckOut = true;
                                    journal.ModifyTime = DateTime.Now;
                                }
                                context.SaveChanges();
                                transaction.Commit();
                            }
                            catch (DbEntityValidationException e)
                            {
                                transaction.Rollback();

                                foreach (var eve in e.EntityValidationErrors)
                                {
                                    sb.AppendFormat("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                                    foreach (var ve in eve.ValidationErrors)
                                    {
                                        sb.AppendFormat("- Property: \"{0}\", Value: \"{1}\", Error: \"{2}\"",
                        ve.PropertyName,
                        eve.Entry.CurrentValues.GetValue<object>(ve.PropertyName),
                        ve.ErrorMessage);
                                    }
                                }
                            }
                        }
                        if (!string.IsNullOrEmpty(sb.ToString()))
                        {
                            using var _context = new SBDbContext(Session["DBName"].ToString());
                            ModelHelper.WriteLog(_context, string.Format("Export PreSalesModel data From Shop failed: {0}; sql:{1}; connectionstring: {2}", sb, string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
                        }

                        #endregion
                    }
                }

                if (filename.StartsWith("ItemSales_"))
                {
                    var session = ModelHelper.GetCurrentSession(context);
                    var location = session.sesShop.ToLower();
                    var device = session.sesDvc.ToLower();

                    dmodel.RetailCheckOutIds = new HashSet<long>();
                    dmodel.SelectedLocation = location;
                    dmodel.Device = device;

                    RetailEditModel model = new RetailEditModel();
                    List<string> sqllist = model.GetUploadSqlList(includeUploaded, lang, ComInfo, apId, context, SqlConnection, frmdate, todate, ref dmodel);

                    if (sqllist.Count > 0)
                    {
                        #region Write to MYOB
                        using (localhost.Dayends dayends = new localhost.Dayends())
                        {
                            dayends.Url = ComInfo.WebServiceUrl;
                            dayends.WriteMYOBBulk(ConnectionString, sqllist.ToArray());
                        }
                        #endregion

                        #region Write sqllist into Log & update checkoutIds
                        StringBuilder sb = new StringBuilder();
                        using (var transaction = context.Database.BeginTransaction())
                        {
                            try
                            {
                                ModelHelper.WriteLog(context, string.Format("Export SalesModel data From Shop done; sqllist:{0}; connectionstring:{1}", string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
                                List<RtlSale> saleslist = context.RtlSales.Where(x => x.AccountProfileId == apId && dmodel.RetailCheckOutIds.Any(y => x.rtsUID == y)).ToList();
                                foreach (var sales in saleslist)
                                {
                                    sales.rtsCheckout = true;
                                }
                                context.SaveChanges();
                                transaction.Commit();
                            }
                            catch (DbEntityValidationException e)
                            {
                                transaction.Rollback();

                                foreach (var eve in e.EntityValidationErrors)
                                {
                                    sb.AppendFormat("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                                    foreach (var ve in eve.ValidationErrors)
                                    {
                                        sb.AppendFormat("- Property: \"{0}\", Value: \"{1}\", Error: \"{2}\"",
                        ve.PropertyName,
                        eve.Entry.CurrentValues.GetValue<object>(ve.PropertyName),
                        ve.ErrorMessage);
                                    }
                                }
                            }
                        }
                        if (!string.IsNullOrEmpty(sb.ToString()))
                        {
                            using var _context = new SBDbContext(Session["DBName"].ToString());
                            ModelHelper.WriteLog(_context, string.Format("Export PreSalesModel data From Shop failed: {0}; sql:{1}; connectionstring: {2}", sb, string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
                        }


                        #endregion
                    }
                }

                if (filename == "Wholesales_")
                {
                    var session = ModelHelper.GetCurrentSession(context);
                    var location = session.sesShop.ToLower();
                    var device = session.sesDvc.ToLower();

                    dmodel.CheckOutIds_WS = new HashSet<long>();
                    dmodel.SelectedLocation = location;
                    dmodel.Device = device;

                    List<string> sqllist = WholeSalesEditModel.GetUploadSqlList4WS(includeUploaded, lang, ComInfo, apId, context, SqlConnection, frmdate, todate, ref dmodel);

                    if (sqllist.Count > 0)
                    {
                        using (localhost.Dayends dayends = new localhost.Dayends())
                        {
                            dayends.Url = ComInfo.WebServiceUrl;
                            dayends.WriteMYOBBulk(ConnectionString, sqllist.ToArray());
                        }

                        #region Write sqllist into Log & update checkoutIds
                        StringBuilder sb = new StringBuilder();
                        using (var transaction = context.Database.BeginTransaction())
                        {
                            try
                            {
                                ModelHelper.WriteLog(context, string.Format("Export Wholesales data From Shop done; sqllist:{0}; connectionstring:{1}", string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
                                List<WholeSale> saleslist = context.WholeSales.Where(x => x.AccountProfileId == apId && dmodel.CheckOutIds_WS.Any(y => x.wsUID == y)).ToList();
                                foreach (var sales in saleslist)
                                {
                                    sales.wsCheckout = true;
                                    sales.ModifyTime = dateTime;
                                }
                                context.SaveChanges();
                                transaction.Commit();
                            }
                            catch (DbEntityValidationException e)
                            {
                                transaction.Rollback();

                                foreach (var eve in e.EntityValidationErrors)
                                {
                                    sb.AppendFormat("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                                    foreach (var ve in eve.ValidationErrors)
                                    {
                                        sb.AppendFormat("- Property: \"{0}\", Value: \"{1}\", Error: \"{2}\"",
                        ve.PropertyName,
                        eve.Entry.CurrentValues.GetValue<object>(ve.PropertyName),
                        ve.ErrorMessage);
                                    }
                                }
                            }
                        }
                        if (!string.IsNullOrEmpty(sb.ToString()))
                        {
                            using var _context = new SBDbContext(Session["DBName"].ToString());
                            ModelHelper.WriteLog(_context, string.Format("Export Wholesales data From Shop failed: {0}; sql:{1}; connectionstring: {2}", sb, string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
                        }
                        #endregion
                    }

                }

                if (filename == "Purchase_")
                {
                    List<string> sqllist = PurchaseEditModel.GetUploadPurchaseSqlList(ref dmodel, ComInfo, context, frmdate, todate);

                    if (sqllist.Count > 0)
                    {
                        using (localhost.Dayends dayends = new localhost.Dayends())
                        {
                            dayends.Url = ComInfo.WebServiceUrl;
                            dayends.WriteMYOBBulk(ConnectionString, sqllist.ToArray());
                        }

                        ModelHelper.WriteLog(context, string.Join(",", sqllist), "ExportFrmShop#Purchase");
                        List<DAL.Purchase> pslist = context.Purchases.Where(x => x.AccountProfileId == apId && dmodel.PoCheckOutIds.Any(y => x.Id == y)).ToList();
                        foreach (var ps in pslist)
                        {
                            ps.pstCheckout = true;
                            ps.ModifyTime = DateTime.Now;
                        }

                        if (dmodel.CheckOutIds_PoPayLn.Count > 0)
                        {
                            List<PurchasePayment> pplist = context.PurchasePayments.Where(x => dmodel.CheckOutIds_PoPayLn.Any(y => x.Id == y)).ToList();
                            foreach (var pp in pplist)
                            {
                                pp.ppCheckout = true;
                                pp.ModifyTime = DateTime.Now;
                            }
                        }

                        context.SaveChanges();
                    }
                }

                if (filename.StartsWith("Items_"))
                {
                    ModelHelper.GetDataTransferData(context, CheckOutType.Items, ref dmodel);

                    if (dmodel.ItemList.Count > 0)
                    {
                        List<string> columns = new List<string>();

                        string sql = MyobHelper.InsertImportItemSql;

                        for (int j = 0; j < MyobHelper.ImportItemColCount; j++)
                        {
                            columns.Add("'{" + j + "}'");
                        }
                        string strcolumn = string.Join(",", columns);

                        List<string> values = new List<string>();
                        foreach (var item in dmodel.ItemList)
                        {
                            string value = "";
                            string buy = item.itmIsBought ? "Y" : "N";
                            string sell = item.itmIsSold ? "Y" : "N";
                            string inventory = item.itmIsNonStock ? "N" : "Y";
                            string usedesc = item.itmUseDesc ? "Y" : "N";
                            string taxcode = item.itmIsTaxedWhenSold == null ? "" : (bool)item.itmIsTaxedWhenSold ? ComInfo.DefaultTaxCode : "";
                            string inactivetxt = item.itmIsActive ? "N" : "Y";
                            string inventoryacc = item.InventoryAccountNo == 0 ? "" : item.InventoryAccountNo.ToString();
                            string incomeacc = item.IncomeAccountNo == 0 ? "" : item.IncomeAccountNo.ToString();
                            string expenseacc = item.ExpenseAccountNo == 0 ? "" : item.ExpenseAccountNo.ToString();
                            //string itemdesc = string.IsNullOrEmpty(item.itmDesc) ? "" : CommonHelper.ConvertUTF8ToASCII(StringHandlingForSQL(CommonHelper.EscapeString(item.itmDesc)));
                            string itemdesc = string.IsNullOrEmpty(item.itmDesc) ? "" : StringHandlingForSQL(CommonHelper.EscapeString(item.itmDesc));
                            /*
                             * ItemNumber,ItemName,Buy,Sell,Inventory,AssetAccount,IncomeAccount,ExpenseAccount,ItemPicture,Description,UseDescriptionOnSale,CustomList1,CustomList2,CustomList3,CustomField1,CustomField2,CustomField3,PrimarySupplier,SupplierItemNumber,TaxWhenBought,BuyUnitMeasure,NumberItemsBuyUnit,ReorderQuantity,MinimumLevel,SellingPrice,SellUnitMeasure,NumberItemsSellUnit,TaxWhenSold,QuantityBreak1,PriceLevelAQtyBreak1,PriceLevelBQtyBreak1,PriceLevelCQtyBreak1,PriceLevelDQtyBreak1,PriceLevelEQtyBreak1,PriceLevelFQtyBreak1,InactiveItem,StandardCost,DefaultShipSellLocation,DefaultReceiveAutoBuildLocation
                             */
                            value = string.Format("(" + strcolumn + ")", item.itmCode, item.itmName, buy, sell, inventory, inventoryacc, incomeacc, expenseacc, "", itemdesc, usedesc, "", "", "", "", "", "", "", item.itmSupCode, "", item.itmBuyUnit, 1, 0, 0, item.itmBaseSellingPrice, item.itmSellUnit, item.itmSellUnitQuantity, taxcode, 0, item.PLA, item.PLB, item.PLC, item.PLD, item.PLE, item.PLF, inactivetxt, item.itmBuyStdCost, ComInfo.PrimaryLocation, "");
                            values.Add(value);
                        }

                        sql += string.Join(",", values) + ")";
                        ModelHelper.WriteLog(context, string.Format("sql:{0}; checkoutids:{1}", sql, string.Join(",", dmodel.CheckOutCodes_Item)), "ExportFrmShop");

                        using (localhost.Dayends dayends = new localhost.Dayends())
                        {
                            dayends.Url = ComInfo.WebServiceUrl;
                            dayends.WriteMYOB(ConnectionString, sql);
                        }

                        updateDB(dmodel.CheckOutCodes_Item.ToArray(), CheckOutType.Items);
                    }
                }

                if (filename.StartsWith("Customers_"))
                {
                    ModelHelper.GetDataTransferData(context, CheckOutType.Customers, ref dmodel);
                    if (dmodel.CustomerList.Count > 0)
                    {
                        WriteMyobCustomerToABSS(ref onlineModeItem, dmodel);
                        updateDB(onlineModeItem.checkoutcodes.ToArray(), CheckOutType.Customers);
                    }
                    //WriteVipToABSS();
                }

                if (filename == "Suppliers_")
                {
                    ModelHelper.GetDataTransferData(context, CheckOutType.Suppliers, ref dmodel);
                    if (dmodel.Supplierlist.Count > 0)
                    {
                        WriteSupplierToABSS(ref onlineModeItem, dmodel);
                        updateDB(onlineModeItem.checkoutcodes.ToArray(), CheckOutType.Suppliers);
                    }
                }
            }
        }

        private void HandleExcludedOrders(FileType fileType, DataTransferModel dmodel)
        {
            switch (fileType)
            {
                case FileType.WholeSales:
                    if (dmodel.ExcludedWSIds.Count > 0) Session["ExcludedWSIds"] = dmodel.ExcludedWSIds;
                    break;
                case FileType.Purchase:
                    if (dmodel.ExcludedPurchaseOrderIds.Count > 0)
                    {
                        Session["ExcludedPurchaseOrderIds"] = dmodel.ExcludedPurchaseOrderIds;
                    }
                    break;

                default:
                case FileType.Retail:
                    if (dmodel.ExcludedRetailOrderIds.Count > 0)
                    {
                        Session["ExcludedRetailOrderIds"] = dmodel.ExcludedRetailOrderIds;
                    }
                    break;
            }

        }

        private static string StringHandlingForSQL(string str)
        {
            return CommonHelper.StringHandlingForSQL(str);
        }




        private void updateDB(string[] _checkoutCodes, CheckOutType checkOutType)
        {
            using (var context = new SBDbContext(Session["DBName"].ToString()))
            {
                List<string> checkoutCodes = new List<string>();
                checkoutCodes = _checkoutCodes.ToList();

                switch (checkOutType)
                {
                    case CheckOutType.Suppliers:
                        List<MyobSupplier> suppliers = context.MyobSuppliers.Where(x => checkoutCodes.Any(y => x.supCode == y) && x.AccountProfileId == apId).ToList();

                        foreach (var supplier in suppliers)
                        {
                            supplier.supCheckout = true;
                            supplier.ModifyTime = DateTime.Now;
                        }

                        break;
                    case CheckOutType.Customers:
                        List<MyobCustomer> mcustomers = context.MyobCustomers.Where(x => checkoutCodes.Any(y => x.cusCode == y) && x.AccountProfileId == apId).ToList();
                        foreach (var customer in mcustomers)
                        {
                            customer.cusCheckout = true;
                            customer.ModifyTime = DateTime.Now;
                        }
                        break;

                    case CheckOutType.Items:
                        List<MyobItem> mitems = context.MyobItems.Where(x => checkoutCodes.Any(y => x.itmCode == y) && x.AccountProfileId == apId).ToList();
                        foreach (var item in mitems)
                        {
                            item.itmCheckout = true;
                            item.itmModifyTime = DateTime.Now;
                        }
                        break;
                    default:
                    case CheckOutType.ItemSales:
                        List<RtlSale> saleslist = context.RtlSales.Where(x => checkoutCodes.Any(y => x.rtsCode == y) && x.AccountProfileId == apId).ToList();
                        foreach (var sales in saleslist)
                        {
                            sales.rtsCheckout = true;
                            sales.rtsModifyTime = DateTime.Now;
                        }
                        break;
                }
                ModelHelper.WriteLog(context, string.Format("checkouttype:{0}; checkoutcodes:{1}", checkOutType, string.Join(",", checkoutCodes)), "ExportFrmShop#checkoutCodes");
            }
        }



        private void WriteSupplierToABSS(ref OnlineModeItem onlineModeItem, DataTransferModel dmodel)
        {
            using var context = new SBDbContext(Session["DBName"].ToString());
            string ConnectionString;
            string sql;
            if (SqlConnection.State == ConnectionState.Closed) SqlConnection.Open();
            using (SqlConnection)
            {
                ConnectionString = GetAbssConnectionString(SqlConnection, "READ_WRITE");
                ModelHelper.GetDataTransferData(context, CheckOutType.Suppliers, ref dmodel);

                List<string> columns = new List<string>();

                sql = MyobHelper.InsertImportSupplierSql;
                int colcount = MyobHelper.ImportSupplierColCount;
                for (int j = 0; j < colcount; j++)
                {
                    columns.Add("'{" + j + "}'");
                }
                string strcolumn = string.Join(",", columns);

                List<string> values = new List<string>();

                foreach (var supplier in dmodel.Supplierlist)
                {
                    string value = "";
                    string cardstatus = supplier.supIsActive ? "N" : "Y";
                    /*
                     * "CoLastName", "CardID", "CardStatus", "Address1Phone1", "CustomField3", "Address1Email", "PaymentIsDue", "DiscountDays", "BalanceDueDays", "Address1ContactName", "Address1AddressLine1", "Address1AddressLine2", "Address1AddressLine3", "Address1AddressLine4", "Address1Phone2", "Address1Phone3", "Address1City", "Address1Country", "Address1Website","RecordID"
                     */
                    supplier.supAddrStreetLine1 = CommonHelper.StringHandleAddress(supplier.supAddrStreetLine1);
                    supplier.supAddrStreetLine2 = CommonHelper.StringHandleAddress(supplier.supAddrStreetLine2);
                    supplier.supAddrStreetLine3 = CommonHelper.StringHandleAddress(supplier.supAddrStreetLine3);
                    supplier.supAddrStreetLine4 = CommonHelper.StringHandleAddress(supplier.supAddrStreetLine4);

                    value = string.Format("(" + strcolumn + ")", StringHandlingForSQL(supplier.supName), StringHandlingForSQL(supplier.supCode), cardstatus, StringHandlingForSQL(supplier.supPhone), "", StringHandlingForSQL(supplier.supEmail), "", "", "", "", supplier.supAddrStreetLine1, supplier.supAddrStreetLine2, supplier.supAddrStreetLine3, supplier.supAddrStreetLine4, StringHandlingForSQL(supplier.supAddrPhone2), StringHandlingForSQL(supplier.supAddrPhone3), StringHandlingForSQL(supplier.CityTxt), StringHandlingForSQL(supplier.CountryTxt), StringHandlingForSQL(supplier.supAddrWeb), supplier.supId);

                    values.Add(value);
                }

                sql += string.Join(",", values) + ")";
                ModelHelper.WriteLog(context, sql, "ExportFrmShop#Supplier");
                onlineModeItem.checkoutcodes = dmodel.CheckOutCodes_Supplier;

                context.SaveChanges();
            }


            using localhost.Dayends dayends = new localhost.Dayends();
            dayends.Url = ComInfo.WebServiceUrl;
            dayends.WriteMYOB(ConnectionString, sql);
        }

        private static void GetMyobSQL4Customer(SBDbContext context, out List<string> values, List<CustomerModel> customerlist)
        {
            List<string> columns = new List<string>();
            List<CustomerPointPriceLevelModel> customerpointpricelevels = new List<CustomerPointPriceLevelModel>();

            values = new List<string>();
            customerpointpricelevels = (
             from cp in context.CustomerPointPriceLevels
             join pl in context.PriceLevels
             on cp.PriceLevelID equals pl.PriceLevelID
             select new CustomerPointPriceLevelModel
             {
                 Id = cp.Id,
                 PriceLevelID = cp.PriceLevelID
             }
             ).ToList();

            int colcount = MyobHelper.ImportCustomer4ApprovalColCount;

            for (int j = 0; j < colcount; j++)
            {
                columns.Add("'{" + j + "}'");
            }
            string strcolumn = string.Join(",", columns);

            foreach (var customer in customerlist)
            {
                if (customerpointpricelevels.Any(x => x.PriceLevelID == customer.cusPriceLevelID))
                {
                    customer.iPriceLevel = customerpointpricelevels.FirstOrDefault(x => x.PriceLevelID == customer.cusPriceLevelID).Id - 1;
                }
                string value = "";
                string deliverystatus = "A";
                string cardstatus = customer.cusIsActive ? "N" : "Y";

                string streetln1 = "";
                string streetln2 = "";

                if (customer.AddressList != null && customer.AddressList.Count > 0)
                {
                    if (customer.AddressList[0] != null)
                    {
                        streetln1 = customer.AddressList[0].StreetLine1;
                        streetln2 = customer.AddressList[0].StreetLine2;
                        streetln1 = CommonHelper.StringToNarrow4SQL(string.Concat(streetln1, streetln2));
                    }
                }

                /*"CoLastName", "CardID", "CardStatus", "ItemPriceLevel", "InvoiceDelivery", "Address1Email", "Address1ContactName", "Address1AddressLine1", "Address1Phone1", "Address1Phone2", "Address1Phone3", "Address1City", "Address1Country", "Address1Website", "PaymentIsDue", "BalanceDueDays", "Address2Website", "RecordID"
				 */
                value = string.Format("(" + strcolumn + ")", CommonHelper.StringToNarrow4SQL(customer.cusName), StringHandlingForSQL(customer.cusCode), cardstatus, customer.iPriceLevel, deliverystatus, StringHandlingForSQL(customer.cusEmail), StringHandlingForSQL(customer.cusContact), streetln1, StringHandlingForSQL(customer.cusAddrPhone1), StringHandlingForSQL(customer.cusAddrPhone2), StringHandlingForSQL(customer.cusAddrPhone3), StringHandlingForSQL(customer.CityTxt), StringHandlingForSQL(customer.CountryTxt), StringHandlingForSQL(customer.cusAddrWeb), customer.PaymentIsDue, customer.Terms.BalanceDueDays, customer.cusPointsActive.ToString(), customer.cusCustomerID);
                values.Add(value);
            }
        }

        private void WriteMyobCustomerToABSS(ref OnlineModeItem onlineModeItem, DataTransferModel dmodel)
        {
            string ConnectionString;
            string sql = MyobHelper.InsertImportCustomer4ApprovalSql.Replace("0", "{0}");
            List<string> sqllist = new List<string>();

            using var context = new SBDbContext(Session["DBName"].ToString());
            if (SqlConnection.State == ConnectionState.Closed) SqlConnection.Open();
            using (SqlConnection)
            {
                ConnectionString = GetAbssConnectionString(SqlConnection, "READ_WRITE");
                ModelHelper.GetDataTransferData(context, CheckOutType.Customers, ref dmodel);

                if (dmodel.CustomerList.Count > 0)
                {
                    List<string> values;
                    GetMyobSQL4Customer(context, out values, dmodel.CustomerList);

                    sql = string.Format(sql, string.Join(",", values));

                    using (localhost.Dayends dayends = new localhost.Dayends())
                    {
                        dayends.WriteMYOB(ConnectionString, sql);
                    }

                    ModelHelper.WriteLog(context, string.Join(",", sqllist), "ExportFrmShop");
                    onlineModeItem.checkoutcodes = dmodel.CheckOutCodes_Customer;
                }
            }
        }

        private string GetAbssConnectionString(string accesstype, GetComInfo_Result comInfo)
        {
            return MYOBHelper.GetConnectionString(accesstype, comInfo);
        }
        private string GetAbssConnectionString(SqlConnection connection, string accesstype)
        {
            return MYOBHelper.GetConnectionString(connection, accesstype, apId);
        }

        private string GetAbssConnectionString(ComInfoModel comInfo, string accesstype)
        {
            return MYOBHelper.GetConnectionString(comInfo, accesstype);
        }
    }
}