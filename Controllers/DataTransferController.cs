using SmartBusinessWeb.Infrastructure;
using PPWLib.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using MyobItemModel = PPWLib.Models.MYOB.MyobItemModel;
using MYOBCustomerModel = CommonLib.Models.MYOB.MYOBCustomerModel;
using MyobItemPriceModel = PPWLib.Models.MYOB.MyobItemPriceModel;
using MyobItemLocModel = PPWLib.Models.MYOB.MyobItemLocModel;
using MyobLocationModel = PPWLib.Models.MYOB.MyobLocationModel;
using System.Data.Entity.Validation;
using PPWDAL;
using ModelHelper = PPWLib.Helpers.ModelHelper;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using PPWCommonLib.BaseModels;
using CommonLib.Helpers;
using CommonLib.Models;
using PPWLib.Models.MYOB;
using FileHelper = PPWCommonLib.CommonHelpers.FileHelper;
using KingdeeLib.Models;
using KingdeeLib.Models.Sales;
using KItemPriceModel = KingdeeLib.Models.ItemPrice.ItemPriceModel;
using CommonLib.Models.MYOB;
using PPWLib.Helpers;
using PPWLib.Models.Purchase;
using PPWLib.Models.WholeSales;
using PPWLib.Models.POS.Customer;
using PPWLib.Models.Item;

namespace SmartBusinessWeb.Controllers
{
    [CustomAuthenticationFilter]
    public class DataTransferController : BaseController
    {
        const string sqlfields4Sales = "CoLastName,InvoiceNumber,SaleDate,ItemNumber,Quantity,Price,Discount,SaleStatus,Location,CardID,AmountPaid,PaymentMethod,PaymentIsDue,DiscountDays,BalanceDueDays,PercentDiscount,PercentMonthlyCharge,DeliveryStatus,CustomersNumber,Job,SalespersonFirstName,SalespersonLastName,Memo,TaxCode,CurrencyCode,ExchangeRate,AddressLine1,AddressLine2,AddressLine3,AddressLine4";
        const string sqlfields4Deposit = "CoLastName,CardID,CustomersNumber,InvoiceNumber,SaleDate,AccountNumber,Amount,SaleStatus,DeliveryStatus,Memo,SalesPersonLastName,Description,PaymentIsDue,DiscountDays,BalanceDueDays,PercentDiscount,PercentMonthlyCharge";
        private string kingdeeApiBaseUrl = ConfigurationManager.AppSettings["KingdeeApiBaseUrl"];
        private bool SetOrderStatus4Myob { get { return ConfigurationManager.AppSettings["SetOrderStatus4Myob"] == "1"; } }
        private List<MyobCustomerModel> VipList;
        private bool ispng { get { return ConfigurationManager.AppSettings["IsPNG"] == "1"; } }
        private string dayendsFolder { get; set; }
        //{2}/Api/GetMyobData?dsn={0}&amp;filename={1}       
        private string centralbaseUrl = UriHelper.GetAppUrl();
        private string ShopApiUrl = ConfigurationManager.AppSettings["ShopApiUrl"];

        private string[] ShopFileNames { get { return new string[] { "ItemSales_", "Vip_", "PGCustomers_", "PGItems_", "PGLocStocks_" }; } }
        private string[] kShopFileNames { get { return new string[] { "Customers_", "ItemSales_" }; } }
        //private string[] kShopFileNames { get { return new string[] { "ItemSales_" }; } }

        private string[] centralFileNames { get { return new string[] { "Customers_", "Suppliers_", "Items_", "Tax_", "ItemLoc_", "ItemPrice_", "Account_", "ACFC_", "Currency_" }; } }

        protected override bool DisableAsyncSupport
        {
            get { return false; }
        }

        [HandleError]
        //[CustomAuthorize("datatransfer", "boss", "admin", "superadmin")]
        public JsonResult CreateDayendsFolder(DayEndsModel model)
        {
            using (var context = new PPWDbContext())
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
        [CustomAuthorize("datatransfer_down", "boss", "admin", "superadmin")]
        public ActionResult DayendsImportFrmCentral(string defaultCheckoutPortal = "")
        {
            string defaultcheckoutportal = ModelHelper.HandleCheckoutPortal(defaultCheckoutPortal);
            //ViewBag.Title = Session["ImportFrmCentralPageTitle"] = Resources.Resource.DayendsImportFrmCentral;
            ViewBag.DefaultCheckoutPortal = defaultcheckoutportal;

            CultureHelper.CurrentCulture = (int)Session["CurrentCulture"];
            //匯入中央資料            
            ViewBag.ParentPage = "dayends";
            ViewBag.PageName = "dayendsimportfrmcentral";

            DayEndsModel model = new DayEndsModel();

            if (ConfigurationManager.AppSettings["DemoOffline"] == "1")
            {
                model.DataTransferMode = DataTransferMode.NoInternet;
            }
            else
            {
                model.DataTransferMode = CommonHelper.CheckForInternetConnection() == true ? DataTransferMode.Internet : DataTransferMode.NoInternet;
            }

            //for debug only:
            model.DataTransferMode = DataTransferMode.Internet;

            model.IsOffLine = model.DataTransferMode == DataTransferMode.Internet ? 0 : 1;

            if (model.DataTransferMode == DataTransferMode.NoInternet)
            {
                dayendsFolder = FileHelper.GetDayendFolder(0, model.MyobFileName);
                if (!string.IsNullOrEmpty(dayendsFolder))
                {
                    List<FileInfo> filelist = FileHelper.GetFileInfoList(dayendsFolder, true);
                    foreach (FileInfo fileinfo in filelist)
                    {
                        model.FileInfoList.Add(fileinfo);
                    }
                }
            }
            //else
            //{
            //    //to be handled by DoImportFrmCentralAsync
            //}

            return View(model);
        }

        private void popAttribute4Contact(string attname, ref CustomAttribute attribute, Contact contact)
        {
            //string attname = "FollowUpDate";
            const string atttype = "text";
            attribute.attrId = contact.cusContactID + attname + atttype + contact.AccountProfileId;
            attribute.contactId = contact.cusContactID;
            attribute.AccountProfileId = contact.AccountProfileId;
            attribute.CreateTime = DateTime.Now;
            attribute.ModifyTime = DateTime.Now;
            attribute.attrName = attname;
            attribute.attrType = atttype;
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
            string url = "";
            int apId = ComInfo.AccountProfileId;
            DateTime dateTime = DateTime.Now;
            int kqtype = 0;
            SessUser curruser = Session["User"] as SessUser;

            using var context = new PPWDbContext();
            string ConnectionString = GetConnectionString(context, "READ", apId, CompanyId);

            if (CheckoutPortal.ToLower() == "kingdee")
            {
                KingdeeAccountInfo info = null;
                int orgId = 0;
                info = KingdeeLib.Models.AccountInfo.KingdeeAccountInfoEditModel.Get();
                orgId = info.OrgId;
                string content = "";
                if (filename.StartsWith("Customers_"))
                {
                    kqtype = (int)KingdeeQueryType.Customer;
                    url = string.Concat(kingdeeApiBaseUrl, "query?kqtype=", kqtype);
                    //HttpClient _client = new HttpClient();
                    //_client.MaxResponseContentBufferSize = int.MaxValue;
                    //var content = await _client.GetStringAsync(url);
                    if (content != null)
                    {
                        using (var transaction = context.Database.BeginTransaction())
                        {
                            try
                            {
                                #region Remove current data first:
                                //context.Database.ExecuteSqlCommand("TRUNCATE TABLE [Kingdee.PGCustomer]");
                                List<Kingdee_Customer> kcustomers = new List<Kingdee_Customer>();
                                kcustomers = context.Kingdee_Customer.Where(x => x.CompanyId == ComInfo.Id).ToList();
                                if (kcustomers.Count > 0)
                                {
                                    context.Kingdee_Customer.RemoveRange(kcustomers);
                                    context.SaveChanges();
                                    //await context.SaveChangesAsync();
                                }
                                #endregion

                                #region Import data:
                                var _result = JsonConvert.DeserializeObject<List<List<object>>>(content);
                                List<SalesCustomerModel> salesCustomers = new List<SalesCustomerModel>();
                                foreach (var customer in _result)
                                {
                                    SalesCustomerModel salescustomer = new SalesCustomerModel
                                    {
                                        CustId = Convert.ToInt32(customer[0]),
                                        CustCode = customer[1].ToString(),
                                        CustName = customer[2].ToString(),
                                    };
                                    salesCustomers.Add(salescustomer);
                                }
                                salesCustomers = salesCustomers.OrderBy(x => x.CustName).ToList();

                                var groupedCustomers = salesCustomers.GroupBy(x => x.CustCode).ToList();
                                kcustomers = new List<Kingdee_Customer>();
                                foreach (var customers in groupedCustomers)
                                {
                                    var customer = customers.FirstOrDefault();
                                    Kingdee_Customer kcustomer = new Kingdee_Customer
                                    {
                                        CustId = customer.CustId,
                                        CustCode = customer.CustCode,
                                        CustName = customer.CustName,
                                        IsCheckout = true,
                                        CreateTime = dateTime,
                                        ModifyTime = dateTime,
                                        CompanyId = ComInfo.Id
                                    };
                                    kcustomers.Add(kcustomer);
                                }
                                context.Kingdee_Customer.AddRange(kcustomers);
                                context.SaveChanges();
                                #endregion
                                transaction.Commit();
                            }
                            catch (DbEntityValidationException e)
                            {
                                transaction.Rollback();
                                StringBuilder sb = new StringBuilder();
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
                                //throw new Exception(sb.ToString());
                                ModelHelper.WriteLog(context, string.Format("Import PGCustomer data from Central failed:{0}", sb.ToString()), "ImportFrmCentral");
                                context.SaveChanges();
                            }
                        }
                    }
                }
                if (filename.StartsWith("Items_"))
                {
                    kqtype = (int)KingdeeQueryType.Item;
                    url = string.Concat(kingdeeApiBaseUrl, "query?kqtype=", kqtype);
                    //HttpClient _client = new HttpClient();
                    //_client.MaxResponseContentBufferSize = int.MaxValue;
                    //var content = await _client.GetStringAsync(url);
                    if (content != null)
                    {
                        using (var transaction = context.Database.BeginTransaction())
                        {
                            try
                            {
                                #region Remove current data first:
                                //context.Database.ExecuteSqlCommand("TRUNCATE TABLE [Kingdee.Item]");
                                List<Kingdee_Item> kitems = new List<Kingdee_Item>();
                                kitems = context.Kingdee_Item.Where(x => x.CompanyId == ComInfo.Id).ToList();
                                if (kitems.Count > 0)
                                {
                                    context.Kingdee_Item.RemoveRange(kitems);
                                    context.SaveChanges();
                                }
                                #endregion

                                #region Import data:
                                var _result = JsonConvert.DeserializeObject<List<List<object>>>(content);
                                kitems = new List<Kingdee_Item>();
                                foreach (var item in _result)
                                {
                                    Kingdee_Item kitem = new Kingdee_Item
                                    {
                                        ItId = Convert.ToInt32(item[0]),
                                        ItCode = item[1].ToString(),
                                        ItName = item[2].ToString(),
                                        ForSell = true,
                                        ForInventory = Convert.ToBoolean(item[3]),
                                        MaterialGroup = Convert.ToInt32(item[4]),
                                        ItCreateOrgId = Convert.ToInt32(item[5]),
                                        ItUseOrgId = Convert.ToInt32(item[6]),
                                        ItCreatorId = Convert.ToInt32(item[7]),
                                        ItDesc = item[8].ToString(),
                                        CreateTime = dateTime,
                                        ModifyTime = dateTime,
                                        CompanyId = ComInfo.Id
                                    };
                                    kitems.Add(kitem);
                                }
                                context.Kingdee_Item.AddRange(kitems);
                                context.SaveChanges();
                                #endregion

                                #region Handle Stock:
                                kqtype = (int)KingdeeQueryType.ItemStock;
                                url = string.Concat(kingdeeApiBaseUrl, "query?kqtype=", kqtype);
                                //HttpClient _client = new HttpClient();
                                //_client.MaxResponseContentBufferSize = int.MaxValue;
                                //var content = await _client.GetStringAsync(url);
                                if (!string.IsNullOrEmpty(content))
                                {
                                    #region Remove current data first
                                    //context.Database.ExecuteSqlCommand("TRUNCATE TABLE [Kingdee.ItemStock]");
                                    List<Kingdee_ItemStock> kitemstocks = new List<Kingdee_ItemStock>();
                                    kitemstocks = context.Kingdee_ItemStock.Where(x => x.CompanyId == ComInfo.Id).ToList();
                                    if (kitemstocks.Count > 0)
                                    {
                                        context.Kingdee_ItemStock.RemoveRange(kitemstocks);
                                        context.SaveChanges();
                                    }
                                    #endregion

                                    #region Import data
                                    var _stresult = JsonConvert.DeserializeObject<List<List<object>>>(content);
                                    if (_stresult != null)
                                    {
                                        List<Kingdee_ItemStock> stlist = new List<Kingdee_ItemStock>();
                                        foreach (var item in _result)
                                        {
                                            Kingdee_ItemStock st = new Kingdee_ItemStock
                                            {
                                                stId = Convert.ToInt32(item[0]),
                                                ItId = Convert.ToInt32(item[1]),
                                                Qty = Convert.ToInt32(item[2]),
                                                stLocId = Convert.ToInt32(item[3]),
                                                stOrgId = Convert.ToInt32(item[4]),
                                                stOwnerId = Convert.ToInt32(item[5]),
                                                stKeeperId = Convert.ToInt32(item[6]),
                                                stBaseUnitId = Convert.ToInt32(item[7]),
                                                stUnitId = Convert.ToInt32(item[8]),
                                                ItCode = item[9].ToString(),
                                                CreateTime = dateTime,
                                                ModifyTime = dateTime,
                                                CompanyId = ComInfo.Id
                                            };
                                            stlist.Add(st);
                                        }
                                        context.Kingdee_ItemStock.AddRange(stlist);
                                        context.SaveChanges();
                                    }
                                    #endregion
                                }
                                #endregion

                                #region Handle Price:
                                kqtype = (int)KingdeeQueryType.ItemPrice;
                                url = string.Concat(kingdeeApiBaseUrl, "query?kqtype=", kqtype);
                                //HttpClient _client = new HttpClient();
                                //_client.MaxResponseContentBufferSize = int.MaxValue;
                                //var content = await _client.GetStringAsync(url);
                                if (!string.IsNullOrEmpty(content))
                                {
                                    #region Remove current data first
                                    var pllists = context.Kingdee_ItemPrice.Where(x => x.plId == info.PriceListId && x.CompanyId == ComInfo.Id).ToList();
                                    if (pllists != null)
                                    {
                                        context.Kingdee_ItemPrice.RemoveRange(pllists);
                                        context.SaveChanges();
                                    }
                                    #endregion

                                    #region Import data
                                    var _kresult = JsonConvert.DeserializeObject<KItemPriceModel>(content);
                                    var itpricelist = _kresult.Result.Result.SAL_PRICELISTENTRY;
                                    List<Kingdee_ItemPrice> itemPrices = new List<Kingdee_ItemPrice>();
                                    foreach (var item in itpricelist)
                                    {
                                        Kingdee_ItemPrice ip = new Kingdee_ItemPrice
                                        {
                                            plId = info.PriceListId,
                                            ItId = item.MaterialId.Id,
                                            ItCode = item.MaterialId.Number,
                                            ItPrice = item.Price,
                                            ItUnit = item.UnitID.Number,
                                            CreateTime = dateTime,
                                            ModifyTime = dateTime,
                                            CompanyId = ComInfo.Id
                                        };
                                        itemPrices.Add(ip);
                                    }
                                    context.Kingdee_ItemPrice.AddRange(itemPrices);
                                    context.SaveChanges();
                                    #endregion
                                }
                                #endregion
                                transaction.Commit();
                            }
                            catch (DbEntityValidationException e)
                            {
                                transaction.Rollback();
                                StringBuilder sb = new StringBuilder();
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
                                //throw new Exception(sb.ToString());
                                ModelHelper.WriteLog(context, string.Format("Import Item data from Central failed:{0}", sb.ToString()), "ImportFrmCentral");
                                context.SaveChanges();
                            }
                        }
                    }
                }
            }
            else
            {
                if (filename.StartsWith("Job_"))
                {
                    List<MyobJobModel> joblist = MYOBHelper.GetJobList(ConnectionString);
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
                            ModelHelper.WriteLog(context, "Import Job data from Central done", "ImportFrmCentral");
                            transaction.Commit();
                        }
                        catch (DbEntityValidationException e)
                        {
                            transaction.Rollback();
                            StringBuilder sb = new StringBuilder();
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
                            ModelHelper.WriteLog(context, string.Format("Import Job data from Central failed:{0}", sb.ToString()), "ExportFrmCentral");
                            context.SaveChanges();
                        }
                    }
                }

                if (filename.StartsWith("Currency_"))
                {
                    List<MyobCurrencyModel> emplist = MYOBHelper.GetCurrencyList(ConnectionString);
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            /* remove current records first: */
                            List<MyobCurrency> currencys = context.MyobCurrencies.Where(x => x.AccountProfileId == apId && x.CompanyId == ComInfo.Id).ToList();
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
                                    CompanyId = ComInfo.Id,
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
                            StringBuilder sb = new StringBuilder();
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
                            ModelHelper.WriteLog(context, string.Format("Import Currency data from Central failed:{0}", sb.ToString()), "ExportFrmCentral");
                            context.SaveChanges();
                        }
                    }
                }

                if (filename.StartsWith("Suppliers_"))
                {
                    ModelHelper.SaveSuppliersFrmCentral(context, apId, ComInfo.Id);
                }

                if (filename.StartsWith("Employees_"))
                {
                    List<MyobEmployeeModel> emplist = MYOBHelper.GetEmployeeList(ConnectionString);
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            /* remove current records first: */
                            List<MyobEmployee> employees = context.MyobEmployees.Where(x => x.AccountProfileId == apId && x.CompanyId == ComInfo.Id).ToList();
                            context.MyobEmployees.RemoveRange(employees);
                            context.SaveChanges();
                            /*********************************/

                            List<SysUser> users = context.SysUsers.Where(x => x.AccountProfileId == apId && x.surIsAbss && x.CompanyId == ComInfo.Id).ToList();
                            context.SysUsers.RemoveRange(users);
                            context.SaveChanges();
                            /*
                             *  public static string ExportEmployeeColList { get { StringBuilder sb = new StringBuilder(); sb.AppendFormat("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},{13}","EmployeeID","CardRecordID","CardIdentification","Name","LastName","FirstName","IsIndividual","IsInactive","Gender","Notes","IdentifierID","CustomField1", "CustomField2", "CustomField3"); return sb.ToString(); } }
                             */
                            List<MyobEmployee> newemployees = new List<MyobEmployee>();
                            List<SysUser> newusers = new List<SysUser>();
                            int posAdminId = ModelHelper.GetPosAdminID(curruser.Device);
                            string usercode = "";

                            foreach (var employee in emplist)
                            {
                                MyobEmployee memployee = new MyobEmployee();
                                memployee.empFirstName = employee.empFirstName;
                                memployee.empId = employee.empId;
                                memployee.empIsIndividual = employee.empIsIndividual;
                                memployee.empIsActive = employee.empIsActive;
                                memployee.empCode = employee.empCode.StartsWith("*") ? employee.empCardRecordID.ToString() : employee.empCode;
                                memployee.empName = employee.empName;
                                memployee.empFirstName = employee.empFirstName;
                                memployee.empLastName = employee.empLastName;
                                memployee.empGender = employee.empGender;
                                memployee.empIdentifierID = employee.empIdentifierID;
                                memployee.empCustomField1 = employee.empCustomField1;
                                memployee.empCustomField2 = employee.empCustomField2;
                                memployee.empCustomField3 = employee.empCustomField3;
                                memployee.empCreateTime = dateTime;
                                memployee.empModifyTime = dateTime;
                                memployee.AccountProfileId = apId;
                                memployee.CompanyId = ComInfo.Id;

                                if (memployee.empCode.ToLower() != "admin")
                                {
                                    newemployees.Add(memployee);
                                }

                                if (memployee.empCode.ToLower() != "admin")
                                {
                                    usercode = ModelHelper.GetUserCode(context);
                                    AddressModel address = new AddressModel();
                                    string email = "";
                                    if (employee.AddressList.Count > 0)
                                    {
                                        address = employee.AddressList.FirstOrDefault();
                                        email = address.Email;
                                    }
                                    SysUser user = new SysUser
                                    {
                                        surIsActive = employee.empIsActive,
                                        Password = "dNvpjLZKQiDwVnVF5d9voszanZ7xJOLU",
                                        UserCode = usercode,
                                        AbssCardID = employee.empCode.StartsWith("*") ? employee.empCardRecordID.ToString() : employee.empCode,
                                        UserName = employee.empName,
                                        FirstName = employee.empFirstName,
                                        LastName = employee.empLastName,
                                        dvcCode = curruser.Device.dvcCode,
                                        shopCode = curruser.Device.dvcShop,
                                        ManagerId = posAdminId,
                                        surScope = "pos",
                                        AccountProfileId = apId,
                                        UserRole = "SalesPerson",
                                        Email = email,
                                        surIsAbss = true,
                                        surLicensed = false,
                                        surCreateTime = dateTime,
                                        surModifyTime = dateTime,
                                        CompanyId = ComInfo.Id
                                    };
                                    context.SysUsers.Add(user);
                                    context.SaveChanges();
                                    newusers.Add(user);
                                }
                            }
                            context.MyobEmployees.AddRange(newemployees);
                            //context.SysUsers.AddRange(newusers);
                            context.SaveChanges();
                            ModelHelper.WriteLog(context, "Import Employee data from Central done", "ImportFrmCentral");

                            var salesroldId = context.SysRoles.FirstOrDefault(x => x.rlCode.ToLower() == "salesperson").Id;
                            int[] adminrolIds = new int[] { 2, 3, 5, 6, 7 };
                            List<UserRole> newuserroles = new List<UserRole>();
                            foreach (var newuser in newusers)
                            {
                                if (newuser.AbssCardID.ToLower() != "admin")
                                {
                                    ModelHelper.GrantPosUserDefaultAccessRights(newuser, context);
                                    UserRole userRole = new UserRole
                                    {
                                        UserId = newuser.surUID,
                                        RoleId = salesroldId,
                                        CreateTime = dateTime,
                                        ModifyTime = dateTime,
                                    };
                                    newuserroles.Add(userRole);

                                }
                            }
                            context.UserRoles.AddRange(newuserroles);
                            context.SaveChanges();
                            transaction.Commit();
                        }
                        catch (DbEntityValidationException e)
                        {
                            transaction.Rollback();
                            StringBuilder sb = new StringBuilder();
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
                            ModelHelper.WriteLog(context, string.Format("Import Employee data from Central failed:{0}", sb.ToString()), "ExportFrmCentral");
                            context.SaveChanges();
                        }
                    }
                }

                if (filename.StartsWith("Customers_"))
                {
                    List<MyobCustomListModel> customlist = MYOBHelper.GetCustomList4Customer();
                    List<MYOBCustomerModel> cuslist = MYOBHelper.GetCustomerList(ConnectionString);
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            #region Remove Current Data First
                            List<MyobCustomer> customers = context.MyobCustomers.Where(x => x.AccountProfileId == AccountProfileId).ToList();
                            context.MyobCustomers.RemoveRange(customers);

                            List<CustomerInfo4Abss> customerInfos = context.CustomerInfo4Abss.Where(x => x.AccountProfileId == AccountProfileId).ToList();
                            context.CustomerInfo4Abss.RemoveRange(customerInfos);

                            context.MyobCustomLists.RemoveRange(context.MyobCustomLists.Where(x => x.AccountProfileId == AccountProfileId));

                            context.SaveChanges();
                            #endregion

                            Dictionary<int, string> DicCustomList = new Dictionary<int, string>();
                            foreach (var custom in customlist)
                            {
                                if (!DicCustomList.ContainsKey(custom.CustomListID))
                                    DicCustomList[custom.CustomListID] = custom.CustomListText;
                            }

                            Dictionary<string, int> DicTermsOfPayments = new Dictionary<string, int>();
                            var termsofpayments = context.MyobTermsOfPayments.ToList();
                            foreach (var term in termsofpayments)
                            {
                                DicTermsOfPayments[term.TermsOfPaymentID.Trim()] = term.MyobID;
                            }

                            List<MyobCustomer> newcustomers = new List<MyobCustomer>();
                            List<CustomerInfo4Abss> customerInfo4Absses = new List<CustomerInfo4Abss>();

                            foreach (var customer in cuslist)
                            {
                                string cuscode;
                                if (ApprovalMode)
                                {
                                    cuscode = customer.CardIdentification;
                                }
                                else
                                {
                                    if (customer.CardIdentification.StartsWith("*"))
                                    {
                                        cuscode = customer.AddressList.Count > 0 ? customer.AddressList[0].Phone1 : customer.CardRecordID.ToString();
                                    }
                                    else
                                    {
                                        cuscode = customer.CardIdentification;
                                    }
                                }
                                var salecomment = customer.SaleComment;
                                MyobCustomer mcustomer = new MyobCustomer();
                                mcustomer.cusIsOrganization = customer.IsIndividual == 'N';
                                mcustomer.cusFirstName = customer.FirstName;
                                mcustomer.cusCustomerID = customer.CustomerID;
                                mcustomer.cusIsActive = customer.IsInactive == 'N';
                                mcustomer.cusChgCtrl = customer.ChangeControl;
                                mcustomer.cusCode = cuscode;
                                mcustomer.cusPhone = (ApprovalMode) ? (customer.AddressList != null && customer.AddressList.Count > 0) ? customer.AddressList[0].Phone1 : cuscode : cuscode;
                                mcustomer.cusName = customer.Name ?? customer.LastName;
                                mcustomer.cusPriceLevelID = customer.PriceLevelID;
                                mcustomer.CreateTime = dateTime;
                                mcustomer.ModifyTime = dateTime;
                                mcustomer.cusTermsID = customer.TermsID;
                                mcustomer.cusSaleComment = salecomment;
                                //t.LatePaymentChargePercent","t.EarlyPaymentDiscountPercent","t.TermsOfPaymentID","t.DiscountDays","t.BalanceDueDays","t.ImportPaymentIsDue","t.DiscountDate","t.BalanceDueDate","p.Description                                   
                                mcustomer.LatePaymentChargePercent = customer.Terms.LatePaymentChargePercent == null ? 0 : Convert.ToDecimal(customer.Terms.LatePaymentChargePercent);
                                mcustomer.EarlyPaymentDiscountPercent = customer.Terms.EarlyPaymentDiscountPercent == null ? 0 : Convert.ToDecimal(customer.Terms.EarlyPaymentDiscountPercent);
                                mcustomer.TermsOfPaymentID = customer.Terms.TermsOfPaymentID == null ? null : customer.Terms.TermsOfPaymentID.Trim();

                                if (DicTermsOfPayments.ContainsKey(mcustomer.TermsOfPaymentID))
                                    mcustomer.PaymentIsDue = DicTermsOfPayments[mcustomer.TermsOfPaymentID];

                                mcustomer.DiscountDays = customer.Terms.DiscountDays == null ? 0 : customer.Terms.DiscountDays;
                                mcustomer.BalanceDueDays = customer.Terms.BalanceDueDays == null ? 0 : customer.Terms.BalanceDueDays;
                                mcustomer.ImportPaymentIsDue = customer.Terms.ImportPaymentIsDue == null ? 0 : customer.Terms.ImportPaymentIsDue;
                                mcustomer.DiscountDate = customer.Terms.DiscountDate == null ? null : customer.Terms.DiscountDate;
                                mcustomer.BalanceDueDate = customer.Terms.BalanceDueDate == null ? null : customer.Terms.BalanceDueDate;
                                mcustomer.PaymentTermsDesc = customer.PaymentTermsDesc == null ? null : customer.PaymentTermsDesc;

                                mcustomer.AbssSalesID = customer.SalespersonID;
                                mcustomer.cusStatus = "COMPLETE";
                                mcustomer.cusAddrCountry = DicCustomList.ContainsKey(customer.CustomList1ID) ? DicCustomList[customer.CustomList1ID] : null;
                                mcustomer.cusAddrCity = DicCustomList.ContainsKey(customer.CustomList2ID) ? DicCustomList[customer.CustomList2ID] : null;

                                mcustomer.AccountProfileId = AccountProfileId;
                                mcustomer.CurrencyID = customer.CurrencyID;
                                mcustomer.TaxIDNumber = customer.TaxIDNumber;
                                mcustomer.TaxCodeID = customer.TaxCodeID;
                                //mcustomer.GSTIDNumber = customer.GSTIDNumber;
                                //mcustomer.FreightTaxCodeID = customer.FreightTaxCodeID;
                                // mcustomer.UseCustomerTaxCode = customer.UseCustomerTaxCode == 'Y';

                                if (ApprovalMode)
                                {
                                    mcustomer.cusWhatsappPhoneNo = customer.CustomField1;
                                    int points = 0;
                                    if (customer.AddressList.Count >= 3)
                                    {
                                        if (int.TryParse(customer.AddressList[2].WWW, out points))
                                        {
                                            mcustomer.cusPointsActive = mcustomer.cusPointsSoFar = points;
                                        }
                                        else
                                        {
                                            mcustomer.cusPointsActive = mcustomer.cusPointsSoFar = 0;
                                        }
                                    }
                                }
                                else
                                {
                                    int points = 0;
                                    if (int.TryParse(customer.CustomField3, out points))
                                    {
                                        mcustomer.cusPointsActive = mcustomer.cusPointsSoFar = points;
                                    }
                                    else
                                    {
                                        mcustomer.cusPointsActive = mcustomer.cusPointsSoFar = 0;
                                    }
                                }
                                mcustomer.cusPointsUsed = 0;


                                if (customer.AddressList.Count > 0)
                                {
                                    mcustomer.cusAddrLocation = customer.AddressList[0].Location;
                                    mcustomer.cusContact = customer.AddressList[0].ContactName;
                                    mcustomer.cusAddrPhone1 = customer.AddressList[0].Phone1;
                                    mcustomer.cusAddrPhone2 = customer.AddressList[0].Phone2;
                                    mcustomer.cusAddrPhone3 = customer.AddressList[0].Phone3;
                                    mcustomer.cusEmail = customer.AddressList[0].Email;
                                    mcustomer.cusAddrWeb = customer.AddressList[0].WWW;
                                    //mcustomer.cusAddrCity = customer.AddressList[0].City;
                                    //mcustomer.cusAddrCountry = customer.AddressList[0].Country;
                                    mcustomer.cusAddrStreetLine1 = customer.AddressList[0].Street;
                                    mcustomer.cusAddrStreetLine2 = customer.AddressList[0].StreetLine1;
                                    mcustomer.cusAddrStreetLine3 = customer.AddressList[0].StreetLine2;
                                    mcustomer.cusAddrStreetLine4 = customer.AddressList[0].StreetLine3;
                                }

                                newcustomers.Add(mcustomer);

                                if (customer.AddressList.Count > 0)
                                {
                                    foreach (var addr in customer.AddressList)
                                    {
                                        CustomerInfo4Abss customerInfo = new CustomerInfo4Abss
                                        {
                                            CusCode = customer.CardIdentification,
                                            AccountProfileId = AccountProfileId,
                                            CusAddrLocation = addr.Location,
                                            StreetLine1 = addr.StreetLine1,
                                            StreetLine2 = addr.StreetLine2,
                                            StreetLine3 = addr.StreetLine3,
                                            StreetLine4 = addr.StreetLine4,
                                            City = addr.City,
                                            State = addr.State,
                                            Postcode = addr.Postcode,
                                            Country = addr.Country,
                                            Phone1 = addr.Phone1,
                                            Phone2 = addr.Phone2,
                                            Phone3 = addr.Phone3,
                                            Fax = addr.Fax,
                                            Email = addr.Email,
                                            Salutation = addr.Salutation,
                                            ContactName = addr.ContactName,
                                            WWW = addr.WWW
                                        };
                                        customerInfo4Absses.Add(customerInfo);
                                    }
                                }
                            }
                            context.MyobCustomers.AddRange(newcustomers);
                            context.CustomerInfo4Abss.AddRange(customerInfo4Absses);
                            context.SaveChanges();

                            var _customlist = new List<MyobCustomList>();
                            foreach (var item in customlist)
                            {
                                _customlist.Add(new MyobCustomList
                                {
                                    AccountProfileId = AccountProfileId,
                                    CustomListID = item.CustomListID,
                                    CustomListName = item.CustomListName,
                                    CustomListNumber = item.CustomListNumber,
                                    ChangeControl = item.ChangeControl,
                                    CustomListText = item.CustomListText,
                                    CustomListType = item.CustomListType,
                                    CreateTime = dateTime,
                                    ModifyTime = dateTime
                                });
                            }
                            context.MyobCustomLists.AddRange(_customlist);
                            context.SaveChanges();

                            ModelHelper.WriteLog(context, "Import Customer data from Central done", "ImportFrmCentral");
                            transaction.Commit();

                        }
                        catch (DbEntityValidationException e)
                        {
                            transaction.Rollback();
                            StringBuilder sb = new StringBuilder();
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
                            ModelHelper.WriteLog(context, string.Format("Import PGCustomer data from Central failed:{0}", sb.ToString()), "ExportFrmCentral");
                            context.SaveChanges();
                        }
                    }
                }

                if (filename.StartsWith("Items_"))
                {
                    List<MyobLocationModel> locationlist = MYOBHelper.GetLocationList(ConnectionString);

                    List<MyobItemLocModel> itemloclist = MYOBHelper.GetItemLocList(ConnectionString);

                    List<MyobItemModel> itemlist = MYOBHelper.GetItemList(ConnectionString);

                    #region Handle Location                    
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            #region remove current data first:
                            //context.Database.ExecuteSqlCommand("TRUNCATE TABLE [Item]");
                            List<MyobLocation> locations = context.MyobLocations.Where(x => x.AccountProfileId == apId).ToList();
                            context.MyobLocations.RemoveRange(locations);
                            context.SaveChanges();
                            #endregion

                            //LocationID, LocationName,LocationIdentification,IsInactive
                            List<MyobLocation> newlocations = new List<MyobLocation>();
                            foreach (var location in locationlist)
                            {

                                newlocations.Add(new MyobLocation
                                {
                                    LocationID = location.LocationID,
                                    IsInactive = location.IsInactive,
                                    LocationName = location.LocationName,
                                    LocationIdentification = location.LocationIdentification,
                                    AccountProfileId = apId,
                                    CreateTime = dateTime,
                                });
                            }
                            context.MyobLocations.AddRange(newlocations);
                            context.SaveChanges();
                            ModelHelper.WriteLog(context, "Import Location data from Central done", "ImportFrmCentral");
                            transaction.Commit();
                        }
                        catch (DbEntityValidationException e)
                        {
                            transaction.Rollback();
                            StringBuilder sb = new StringBuilder();
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
                            //throw new Exception(sb.ToString());
                            ModelHelper.WriteLog(context, string.Format("Import item data from Central failed:{0}", sb.ToString()), "ImportFrmCentral");
                            context.SaveChanges();
                        }
                    }
                    #endregion

                    #region Handle Item

                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            #region remove current data first:
                            //context.Database.ExecuteSqlCommand("TRUNCATE TABLE [Item]");
                            List<MyobItem> items = context.MyobItems.Where(x => x.AccountProfileId == apId).ToList();
                            context.MyobItems.RemoveRange(items);
                            context.SaveChanges();
                            #endregion

                            List<MyobItem> newitems = new List<MyobItem>();
                            foreach (var item in itemlist)
                            {
                                var pgItem = context.PGItems.Where(x => x.AccountProfileId == apId && x.itmCode == item.ItemNumber).FirstOrDefault();

                                MyobItem _item = new MyobItem
                                {
                                    itmIsActive = item.IsInactive == 'N',
                                    itmName = item.ItemName,
                                    itmCode = item.ItemNumber,
                                    itmDesc = item.ItemDescription,
                                    itmUseDesc = item.UseDescription == 'Y',
                                    itmIsTaxedWhenBought = item.ItemIsTaxedWhenBought == 'Y',
                                    itmIsTaxedWhenSold = item.ItemIsTaxedWhenSold == 'Y',
                                    itmBaseSellingPrice = Convert.ToDecimal(item.BaseSellingPrice),
                                    itmSellUnit = item.SellUnitMeasure,
                                    itmSellUnitQuantity = item.SellUnitQuantity,
                                    itmBuyUnit = item.BuyUnitMeasure,
                                    itmLastUnitPrice = Convert.ToDecimal(item.LastUnitPrice),
                                    itmBuyStdCost = item.TaxExclusiveStandardCost == 0 ? item.TaxInclusiveStandardCost : item.TaxExclusiveStandardCost,
                                    itmTaxExclusiveLastPurchasePrice = item.TaxExclusiveLastPurchasePrice,
                                    itmTaxInclusiveLastPurchasePrice = item.TaxInclusiveLastPurchasePrice,
                                    itmTaxExclusiveStandardCost = item.TaxExclusiveStandardCost,
                                    itmTaxInclusiveStandardCost = item.TaxInclusiveStandardCost,
                                    itmChgCtrl = item.ChangeControl,
                                    itmCreateTime = dateTime,
                                    itmModifyTime = dateTime,
                                    itmItemID = item.ItemID,
                                    AccountProfileId = apId,
                                    itmIsNonStock = item.ItemIsInventoried == 'N',
                                    itmIsSold = item.ItemIsSold == 'Y',
                                    itmIsBought = item.ItemIsBought == 'Y',
                                    itmSupCode = item.SupplierItemNumber,
                                    IncomeAccountID = item.IncomeAccountID,
                                    ExpenseAccountID = item.ExpenseAccountID,
                                    InventoryAccountID = item.InventoryAccountID,
                                };

                                newitems.Add(_item);
                            }
                            context.MyobItems.AddRange(newitems);
                            context.SaveChanges();
                            ModelHelper.WriteLog(context, "Import Item data from Central done", "ImportFrmCentral");
                            transaction.Commit();
                        }
                        catch (DbEntityValidationException e)
                        {
                            transaction.Rollback();
                            StringBuilder sb = new StringBuilder();
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
                            //throw new Exception(sb.ToString());
                            ModelHelper.WriteLog(context, string.Format("Import item data from Central failed:{0}", sb.ToString()), "ImportFrmCentral");
                            context.SaveChanges();
                        }
                    }
                    #endregion

                    #region Handle Stock

                    #region backup & remove current data first
                    //context.Database.ExecuteSqlCommand("TRUNCATE TABLE [LocStock]");
                    List<MyobLocStock> stocks = context.MyobLocStocks.Where(x => x.AccountProfileId == apId).ToList();
                    Dictionary<LocItem, int> DicLocItemQty = new Dictionary<LocItem, int>();
                    foreach(var stock in stocks)
                    {
                        LocItem locitem = new LocItem
                        {
                            LocCode = stock.lstStockLoc,
                            itmCode = stock.lstItemCode
                        };
                        DicLocItemQty[locitem] = stock.lstQuantityAvailable??0;
                    }
                    context.MyobLocStocks.RemoveRange(stocks);
                    context.SaveChanges();
                    #endregion

                    stocks = new List<MyobLocStock>();
                    List<MyobLocStock> newstocks = new List<MyobLocStock>();

                    var activeLocationList = locationlist.Where(x => x.IsInactive != null && !(bool)x.IsInactive).ToList();
                    var addedstockcode = new List<string>();

                    foreach (var item in itemloclist)
                    {
                        var inCurrLoc = itemloclist.Where(x => x.ItemCode == item.ItemCode);
                        if (inCurrLoc.Count() == activeLocationList.Count)
                        {
                            stocks.Add(new MyobLocStock
                            {
                                lstItemLocationID = item.ItemLocationID,
                                lstItemID = item.ItemID,
                                lstItemCode = item.ItemCode,
                                lstStockLoc = item.LocationCode,
                                lstAbssQty = item.QuantityOnHand,
                                lstQuantityAvailable = item.QuantityOnHand,
                                lstCreateTime = dateTime,
                                lstModifyTime = dateTime,
                                AccountProfileId = apId,
                                CompanyId = ComInfo.Id,
                            });
                            addedstockcode.Add(item.ItemCode);
                        }
                    }

                    if (stocks.Count > 0)
                    {
                        context.MyobLocStocks.AddRange(stocks);
                        context.SaveChanges();
                    }

                    //if (addedstockcode.Count > 0)
                    //{
                    var _itemlist = addedstockcode.Count > 0 ? itemlist.Where(x => !addedstockcode.Contains(x.ItemNumber)) : itemlist;
                    long lastId = context.MyobLocStocks.Count() > 0 ? context.MyobLocStocks.Max(x => x.lstItemLocationID) : 0;
                    long newId = lastId + 1;
                    foreach (var loc in activeLocationList)
                    {
                        foreach (var item in _itemlist)
                        {
                            var stock = itemloclist.FirstOrDefault(x => x.LocationCode == loc.LocationIdentification && x.ItemCode == item.ItemNumber);
                            LocItem locitem = new LocItem
                            {
                                LocCode = loc.LocationIdentification,
                                itmCode = item.ItemNumber
                            };
                            int qty = 0;
                            if (DicLocItemQty.Keys.Contains(locitem))
                            {
                                qty = DicLocItemQty[locitem];
                            }
                            newstocks.Add(new MyobLocStock
                            {
                                lstItemLocationID = newId,
                                lstItemID = item.ItemID,
                                lstItemCode = item.ItemNumber,
                                lstStockLoc = loc.LocationIdentification,
                                lstAbssQty = stock == null ? 0 : stock.QuantityOnHand,
                                lstQuantityAvailable = qty,
                                lstCreateTime = dateTime,
                                lstModifyTime = dateTime,
                                AccountProfileId = apId,
                                CompanyId = ComInfo.Id,
                            });
                            newId++;
                        }
                    }
                    context.MyobLocStocks.AddRange(newstocks);
                    context.SaveChanges();
                    //}



                    ModelHelper.WriteLog(context, "Import Item Location data from Central done;added office stock:" + newstocks.Where(x => x.lstStockLoc == "office").Count(), "ExportFrmCentral");
                    context.SaveChanges();

                    #endregion

                    #region Handle Price
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            List<MyobItemPriceModel> itemplist = MYOBHelper.GetItemPriceList(ConnectionString);
                            List<MyobItemPriceModel> filterediplist = new List<MyobItemPriceModel>();
                            foreach (var ip in itemplist)
                            {
                                if (ip.QuantityBreak == 1)
                                {
                                    filterediplist.Add(ip);
                                }
                            }

                            #region remove current data first
                            //context.Database.ExecuteSqlCommand("TRUNCATE TABLE [ItemPrice]");
                            List<MyobItemPrice> itemprices = context.MyobItemPrices.Where(x => x.AccountProfileId == apId && x.CompanyId == ComInfo.Id).ToList();
                            context.MyobItemPrices.RemoveRange(itemprices);
                            context.SaveChanges();
                            #endregion
                            List<MyobItemPrice> newitemprices = new List<MyobItemPrice>();

                            foreach (var item in filterediplist)
                            {
                                MyobItemPrice itemPrice = new MyobItemPrice();
                                itemPrice.ItemPriceID = item.ItemPriceID;
                                itemPrice.ItemID = item.ItemID;
                                itemPrice.QuantityBreak = item.QuantityBreak;
                                itemPrice.QuantityBreakAmount = item.QuantityBreakAmount;
                                itemPrice.PriceLevel = item.PriceLevel.ToString();
                                itemPrice.PriceLevelNameID = item.PriceLevelNameID;
                                itemPrice.SellingPrice = item.SellingPrice;
                                itemPrice.UnitPrice = item.LastUnitPrice;
                                itemPrice.ItemCode = item.ItemCode;
                                itemPrice.ChangeControl = item.ChangeControl;
                                itemPrice.CreateTime = dateTime;
                                itemPrice.ModifyTime = dateTime;
                                itemPrice.AccountProfileId = apId;
                                itemPrice.CompanyId = ComInfo.Id;
                                newitemprices.Add(itemPrice);
                            }

                            context.MyobItemPrices.AddRange(newitemprices);
                            ModelHelper.WriteLog(context, "Import Item Price data from Central done", "ImportFrmCentral");
                            context.SaveChanges();
                            transaction.Commit();

                        }
                        catch (DbEntityValidationException e)
                        {
                            transaction.Rollback();
                            StringBuilder sb = new StringBuilder();
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
                            //throw new Exception(sb.ToString());
                            ModelHelper.WriteLog(context, string.Format("Import itemprice data from Central failed:{0}", sb.ToString()), "ImportFrmCentral");
                            context.SaveChanges();
                        }
                    }

                    #endregion

                    #region Init ItemOption if there isn't any in DB                  
                    var currentItemOptions = context.ItemOptions.Where(x => x.AccountProfileId == apId);
                    List<ItemOption> itemOptions = new List<ItemOption>();
                    foreach (var item in itemlist)
                    {
                        if (!currentItemOptions.Any(x => x.itemId == item.ItemID))
                        {
                            itemOptions.Add(new ItemOption
                            {
                                itemId = item.ItemID,
                                AccountProfileId = apId,
                                chkBat = false,
                                chkSN = false,
                                chkVT = false,
                                itmCode = item.ItemNumber,
                                CreateTime = DateTime.Now,
                            });
                        }
                    }
                    if (itemOptions.Count > 0)
                    {
                        context.ItemOptions.AddRange(itemOptions);
                        context.SaveChanges();
                    }
                    #endregion
                }


                if (filename.StartsWith("Tax_"))
                {
                    List<CommonLib.Models.MYOB.TaxModel> taxlist = MYOBHelper.GetTaxList();
                    decimal taxrate = (decimal)taxlist.FirstOrDefault().TaxPercentageRate;
                    string taxcode = taxlist.FirstOrDefault().TaxCode;

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
                            StringBuilder sb = new StringBuilder();
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
                            ModelHelper.WriteLog(context, string.Format("Import Tax data from Central failed:{0}", sb.ToString()), "ExportFrmCentral");
                            context.SaveChanges();
                        }
                    }
                }


                if (filename.StartsWith("Account_"))
                {
                    List<AccountModel> accountlist = MYOBHelper.GetAccountList(ConnectionString);

                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            #region remove current data first
                            List<Account> accounts = context.Accounts.Where(x => x.AccountProfileId == apId && x.CompanyId == ComInfo.Id).ToList();
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
                                ac.CompanyId = ComInfo.Id;
                                newaccounts.Add(ac);
                            }

                            context.Accounts.AddRange(newaccounts);
                            ModelHelper.WriteLog(context, "Import Account data from Central done", "ExportFrmCentral");
                            context.SaveChanges();
                            transaction.Commit();

                        }
                        catch (DbEntityValidationException e)
                        {
                            transaction.Rollback();
                            StringBuilder sb = new StringBuilder();
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
                            ModelHelper.WriteLog(context, string.Format("Import Account data from Central failed:{0}", sb.ToString()), "ExportFrmCentral");
                            context.SaveChanges();
                        }
                    }
                }
            }


            return Json(new { msg });
        }



        [HandleError]
        [CustomAuthorize("datatransfer_up", "boss", "admin", "superadmin")]
        public ActionResult DayendsImportFrmShop()
        {
            CultureHelper.CurrentCulture = (int)Session["CurrentCulture"];
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

        private static void WriteFileLog(List<string> donefilelist, List<string> failedfilelist, PPWDbContext context)
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
        [CustomAuthorize("datatransfer_down", "boss", "admin", "superadmin")]
        public ActionResult DayendsExportFrmCentral()
        {
            CultureHelper.CurrentCulture = (int)Session["CurrentCulture"];
            //匯出中央資料
            ViewBag.ParentPage = "dayends";
            ViewBag.PageName = "dayendsexportfrmcentral";
            DayEndsModel model = new DayEndsModel();
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("datatransfer_up", "boss", "admin", "superadmin")]
        public ActionResult DayendsExportFrmShop(string defaultCheckoutPortal = "")
        {
            string defaultcheckoutportal = ModelHelper.HandleCheckoutPortal(defaultCheckoutPortal);
            ViewBag.Title = Session["ExportFrmShopPageTitle"] = string.Format(Resources.Resource.DayendsImportFrmShop, defaultcheckoutportal);
            ViewBag.DefaultCheckoutPortal = defaultcheckoutportal;

            CultureHelper.CurrentCulture = (int)Session["CurrentCulture"];
            //匯出分店資料
            ViewBag.ParentPage = "dayends";
            ViewBag.PageName = "dayendsexportfrmshop";

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
            //model.IsOffLine = model.DataTransferMode == DataTransferMode.NoInternet ? 1 : 0;
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
        public async Task<ActionResult> DoExportFrmShopAsync(DayEndsModel model, FormCollection formCollection)
        {
            VipList = new List<MyobCustomerModel>();
            bool includePending = model.IncludePending = formCollection["chkPending"] != null;
            bool includeUploaded = model.IncludeUploaded = formCollection["chkUploaded"] != null;
            string type = formCollection["type"];

            Session currsess = null;
            int apId = 0;
            int lang = -1;
            using (var context = new PPWDbContext())
            {
                currsess = ModelHelper.GetCurrentSession(context);
                apId = currsess.AccountProfileId;
                lang = currsess.sesLang;
            }

            int ret = 0;
            CultureHelper.CurrentCulture = lang;
            string msg = Resources.Resource.ExportDoneMsg;
            DataTransferModel dmodel = new DataTransferModel
            {
                SelectedLocation = formCollection["location"],
                includeUploaded = includeUploaded
            };

            Dictionary<string, bool> dicResult = new Dictionary<string, bool>();
            if (CheckoutPortal.ToLower() == "kingdee")
            {
                foreach (string filename in kShopFileNames)
                {
                    var key = filename.StartsWith("Customers_") ? "customer" : "sales";
                    dicResult[key] = await ExportData4Kingdee(model, dmodel, filename, model.SalesDateFrmTxt, model.SalesDateToTxt, includePending, includeUploaded, lang, currsess.sesSalesPrefix, currsess.sesRefundPrefix);
                }
            }
            else
            {
                string[] filenames;
                switch (type)
                {
                    case "supplier":
                        await ExportData4G3(apId, model, dmodel, "Suppliers_", model.SalesDateFrmTxt, model.SalesDateToTxt, includePending, includeUploaded, lang, currsess.sesSalesPrefix, currsess.sesRefundPrefix);
                        break;
                    case "purchase":
                        await ExportData4G3(apId, model, dmodel, "Purchase_", model.SalesDateFrmTxt, model.SalesDateToTxt, includePending, includeUploaded, lang, currsess.sesSalesPrefix, currsess.sesRefundPrefix);
                        break;
                    case "item":
                        filenames = new string[2] { "Items_", "PGLocStocks_" };
                        foreach (var filename in filenames)
                        {
                            await ExportData4G3(apId, model, dmodel, filename, model.SalesDateFrmTxt, model.SalesDateToTxt, includePending, includeUploaded, lang, currsess.sesSalesPrefix, currsess.sesRefundPrefix);
                        }
                        break;
                    case "customer":
                        //filenames = new string[2] { "Vip_", "Customers_" };
                        filenames = new string[1] { "Customers_" };
                        foreach (var filename in filenames)
                        {
                            await ExportData4G3(apId, model, dmodel, filename, model.SalesDateFrmTxt, model.SalesDateToTxt, includePending, includeUploaded, lang, currsess.sesSalesPrefix, currsess.sesRefundPrefix);
                        }
                        break;
                    case "wholesales":
                        await ExportData4G3(apId, model, dmodel, "Wholesales_", model.SalesDateFrmTxt, model.SalesDateToTxt, includePending, includeUploaded, lang, currsess.sesSalesPrefix, currsess.sesRefundPrefix);
                        break;
                    default:
                    case "sales":
                        await ExportData4G3(apId, model, dmodel, "ItemSales_", model.SalesDateFrmTxt, model.SalesDateToTxt, includePending, includeUploaded, lang, currsess.sesSalesPrefix, currsess.sesRefundPrefix);
                        break;
                }

            }


            if (Session["PendingInvoices"] != null)
            {
                string.Concat(msg, "<br>", Resources.Resource.InvoicesNotIntegratedDueToZeroStock);
                ret = 1;
            }

            return CheckoutPortal == "abss" ? Json(new { msg, PendingInvoices = ret, offlinemode = 0 }) : Json(new { msg, PendingInvoices = ret, offlinemode = 0, result = System.Text.Json.JsonSerializer.Serialize(dicResult) });
        }

        private async Task ExportData4G3(int accountprofileId, DayEndsModel model, DataTransferModel dmodel, string filename, string strfrmdate = "", string strtodate = "", bool includePending = false, bool includeUploaded = false, int lang = 0, string salesprefix = "", string refundprefix = "")
        {
            var comInfo = Session["ComInfo"] as ComInfo;
            SessUser curruser = Session["User"] as SessUser;
            OnlineModeItem onlineModeItem = new OnlineModeItem();
            List<long> checkoutIds = new List<long>();
            DateTime dateTime = DateTime.Now;
            string checkoutportal = string.Empty;
            bool approvalmode = (bool)comInfo.ApprovalMode;
            int apId = comInfo.AccountProfileId;

            using var context = new PPWDbContext();
            string ConnectionString = GetConnectionString(context, "READ_WRITE", apId, CompanyId);

            if (filename.StartsWith("ItemSales_"))
            {
                bool ismultiuser = (bool)comInfo.MyobMultiUser;
                string currencycode = comInfo.DefaultCurrencyCode;
                double exchangerate = (double)comInfo.DefaultExchangeRate;

                #region Local Variables
                string sql = "";
                List<SalesModel> SalesModels = new List<SalesModel>();
                List<SalesModel> RefundModels = new List<SalesModel>();
                List<SalesLnView> SalesLnViews = new List<SalesLnView>();
                List<SalesLnView> RefundLnViews = new List<SalesLnView>();
                List<PayLnView> PayLnViews = new List<PayLnView>();
                List<string> sqllist = new List<string>();
                string accountno = "";
                int groupcount = 0; //for debug use
                //int paytypeamtlistcount = 0; //for debug use
                //int paytypelistcount = 0; // for debug use
                //string paytypeamts = "";
                //string paytypes = "";
                //string salesrefundcode = "";
                //string deposititempo = "Deposit#SA";
                //const string depositdeliverystatus = "P";
                //const string depositdesc = "PGCustomer Deposit";
                //int collength = 24;
                List<MyobJobModel> JobList = new List<MyobJobModel>();
                #endregion

                apId = ModelHelper.GetAccountProfileId(context);
                var session = ModelHelper.GetCurrentSession(context);
                var location = session.sesShop.ToLower();
                var device = session.sesDvc.ToLower();

                var dateformatcode = context.AppParams.FirstOrDefault(x => x.appParam == "DateFormat").appVal;

                accountno = context.ComInfoes.FirstOrDefault().comAccountNo;

                #region Date Ranges
                int year = DateTime.Now.Year;
                DateTime frmdate;
                DateTime todate;
                if (string.IsNullOrEmpty(strfrmdate))
                {
                    frmdate = new DateTime(year, 1, 1);
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
                    todate = new DateTime(year, 12, 31);
                }
                else
                {
                    int mth = int.Parse(strtodate.Split('/')[1]);
                    int day = int.Parse(strtodate.Split('/')[0]);
                    year = int.Parse(strtodate.Split('/')[2]);
                    todate = new DateTime(year, mth, day);
                }
                #endregion

                #region SalesLns

                List<string> salescodes = new List<string>();

                #region SalesModels

                SalesModels = (from s in context.RtlSales
                               where s.rtsDate >= frmdate && s.rtsDate <= todate && s.rtsType == "RS"
                               && s.rtsSalesLoc.ToLower() == location && s.rtsDvc.ToLower() == device && s.AccountProfileId == apId
                               select s
                           ).ToList().
                           Select(s => new SalesModel(lang)
                           {
                               rtsUID = s.rtsUID,
                               rtsCode = s.rtsCode,
                               rtsFinalTotal = s.rtsFinalTotal,
                               rtsMonthBase = s.rtsMonthBase,
                               Lang = lang,
                               rtsRefCode = s.rtsRefCode, //for deposit reference
                               rtsCheckoutPortal = s.rtsCheckoutPortal,
                               rtsDeliveryAddress1 = s.rtsDeliveryAddress1,
                               rtsDeliveryAddress2 = s.rtsDeliveryAddress2,
                               rtsDeliveryAddress3 = s.rtsDeliveryAddress3,
                               rtsDeliveryAddress4 = s.rtsDeliveryAddress4,
                               rtsCheckout = s.rtsCheckout,
                               rtsCurrency = s.rtsCurrency,
                               rtsExRate = s.rtsExRate
                           }
                        ).ToList();
                if (!includeUploaded && SalesModels.Count > 0)
                {
                    SalesModels = SalesModels.Where(x => !x.rtsCheckout).ToList();
                }
                #endregion

                #region RefundModels
                RefundModels = (from s in context.RtlSales
                                where s.rtsDate >= frmdate && s.rtsDate <= todate && s.rtsType == "RF"
                                && s.rtsSalesLoc.ToLower() == location && s.rtsDvc.ToLower() == device && s.AccountProfileId == apId
                                select s
                           ).ToList().
                           Select(s => new SalesModel(lang)
                           {
                               rtsUID = s.rtsUID,
                               rtsCode = s.rtsCode,
                               rtsFinalTotal = s.rtsFinalTotal,
                               rtsRefCode = s.rtsRefCode, //for deposit reference
                               rtsCheckoutPortal = s.rtsCheckoutPortal,
                               rtsDeliveryAddress1 = s.rtsDeliveryAddress1,
                               rtsDeliveryAddress2 = s.rtsDeliveryAddress2,
                               rtsDeliveryAddress3 = s.rtsDeliveryAddress3,
                               rtsDeliveryAddress4 = s.rtsDeliveryAddress4,
                               rtsCheckout = s.rtsCheckout,
                               rtsCurrency = s.rtsCurrency,
                               rtsExRate = s.rtsExRate
                           }
                            ).ToList();
                if (!includeUploaded && RefundModels.Count > 0)
                {
                    RefundModels = RefundModels.Where(x => !x.rtsCheckout).ToList();
                }
                #endregion

                #region SalesLnViews
                if (SalesModels.Count > 0)
                {
                    foreach (var sales in SalesModels)
                    {
                        sales.rtsDeliveryAddress1 = CommonHelper.StringHandleAddress(sales.rtsDeliveryAddress1);
                        sales.rtsDeliveryAddress2 = CommonHelper.StringHandleAddress(sales.rtsDeliveryAddress2);
                        sales.rtsDeliveryAddress3 = CommonHelper.StringHandleAddress(sales.rtsDeliveryAddress3);
                        sales.rtsDeliveryAddress4 = CommonHelper.StringHandleAddress(sales.rtsDeliveryAddress4);
                    }

                    //JobList = ModelHelper.GetJobList(apId);
                    SalesLnViews = (from sl in context.RtlSalesLns
                                    join s in context.RtlSales
                                    on sl.rtlCode equals s.rtsCode
                                    //join j in context.MyobJobs
                                    //on sl.JobID equals j.JobID
                                    where s.rtsDate >= frmdate && s.rtsDate <= todate && s.rtsType == "RS" && s.AccountProfileId == apId
                                    && s.rtsSalesLoc.ToLower() == location && s.rtsDvc.ToLower() == device && sl.AccountProfileId == apId
                                    //&& j.AccountProfileId==apId
                                    select new SalesLnView
                                    {
                                        rtlItemCode = sl.rtlItemCode,
                                        rtlUID = sl.rtlUID,
                                        rtlCode = sl.rtlCode,
                                        dQty = (double)sl.rtlQty,
                                        dLineSalesAmt = (double)sl.rtlSalesAmt,
                                        dLineDiscPc = sl.rtlLineDiscPc == null ? 0 : (double)sl.rtlLineDiscPc,
                                        dPrice = (double)sl.rtlSellingPrice,
                                        rtlDate = sl.rtlDate,
                                        rtlSalesLoc = sl.rtlSalesLoc,
                                        CustomerID = s.rtsCusID,
                                        rtlRefSales = sl.rtlRefSales,
                                        SalesPersonName = s.rtsUpldBy.ToUpper(),
                                        rtlSalesAmt = sl.rtlSalesAmt,
                                        InvoiceStatus = s.rtsStatus,
                                        IsCheckout = s.rtsCheckout,
                                        CheckoutPortal = s.rtsCheckoutPortal,
                                        rtsDeliveryAddress1 = s.rtsDeliveryAddress1,
                                        rtsDeliveryAddress2 = s.rtsDeliveryAddress2,
                                        rtsDeliveryAddress3 = s.rtsDeliveryAddress3,
                                        rtsDeliveryAddress4 = s.rtsDeliveryAddress4,
                                        CompanyId = s.CompanyId,
                                        rtlStockLoc = sl.rtlStockLoc,
                                        JobID = sl.JobID,
                                        rtsCurrency = s.rtsCurrency,
                                        rtsExRate = s.rtsExRate
                                    }
                                    ).ToList();
                    if (!includeUploaded && SalesLnViews.Count > 0)
                    {
                        SalesLnViews = SalesLnViews.Where(x => !x.IsCheckout).ToList();
                    }
                }
                #endregion

                #region RefundLnViews
                if (RefundModels.Count > 0)
                {
                    foreach (var sales in RefundModels)
                    {
                        sales.rtsDeliveryAddress1 = CommonHelper.StringHandleAddress(sales.rtsDeliveryAddress1);
                        sales.rtsDeliveryAddress2 = CommonHelper.StringHandleAddress(sales.rtsDeliveryAddress2);
                        sales.rtsDeliveryAddress3 = CommonHelper.StringHandleAddress(sales.rtsDeliveryAddress3);
                        sales.rtsDeliveryAddress4 = CommonHelper.StringHandleAddress(sales.rtsDeliveryAddress4);
                    }
                    RefundLnViews = (from sl in context.RtlSalesLns
                                     join s in context.RtlSales
                                     on sl.rtlCode equals s.rtsCode
                                     // join j in context.MyobJobs
                                     //on sl.JobID equals j.JobID
                                     where s.rtsDate >= frmdate && s.rtsDate <= todate && s.rtsType == "RF" && s.AccountProfileId == apId
                                     && s.rtsSalesLoc.ToLower() == location && s.rtsDvc.ToLower() == device && sl.AccountProfileId == apId
                                     //&& j.AccountProfileId==apId
                                     select new SalesLnView
                                     {
                                         rtlItemCode = sl.rtlItemCode,
                                         rtlUID = sl.rtlUID,
                                         rtlCode = sl.rtlCode,
                                         dQty = (double)sl.rtlQty,
                                         dLineSalesAmt = (double)sl.rtlSalesAmt,
                                         dPrice = (double)sl.rtlSellingPrice,
                                         rtlDate = sl.rtlDate,
                                         rtlSalesLoc = sl.rtlSalesLoc,
                                         CustomerID = s.rtsCusID,
                                         rtlRefSales = sl.rtlRefSales,
                                         SalesPersonName = s.rtsUpldBy.ToUpper(),
                                         rtlSalesAmt = sl.rtlSalesAmt,
                                         InvoiceStatus = s.rtsStatus,
                                         IsCheckout = s.rtsCheckout,
                                         CheckoutPortal = s.rtsCheckoutPortal,
                                         rtsDeliveryAddress1 = s.rtsDeliveryAddress1,
                                         rtsDeliveryAddress2 = s.rtsDeliveryAddress2,
                                         rtsDeliveryAddress3 = s.rtsDeliveryAddress3,
                                         rtsDeliveryAddress4 = s.rtsDeliveryAddress4,
                                         CompanyId = s.CompanyId,
                                         rtlStockLoc = sl.rtlStockLoc,
                                         JobID = sl.JobID,
                                         rtsCurrency = s.rtsCurrency,
                                         rtsExRate = s.rtsExRate
                                     }
                                    ).ToList();
                    if (!includeUploaded && RefundLnViews.Count > 0)
                    {
                        RefundLnViews = RefundLnViews.Where(x => !x.IsCheckout).ToList();
                    }
                }
                #endregion

                if (SalesLnViews.Count > 0)
                {
                    ModelHelper.GetCustomerItemJob4SalesLn(ref SalesLnViews, ref VipList, context);
                }

                if (RefundLnViews.Count > 0) ModelHelper.GetCustomerItemJob4SalesLn(ref RefundLnViews, ref VipList, context);


                Dictionary<string, string> DicPayTypes = new Dictionary<string, string>();
                DicPayTypes = PPWCommonLib.CommonHelpers.ModelHelper.GetDicPayTypes(ProjectEnum.G3, lang);

                foreach (var sales in SalesModels)
                {
                    sales.DicPayTypes = DicPayTypes;
                }
                foreach (var sales in RefundModels)
                {
                    sales.DicPayTypes = DicPayTypes;
                }
                #endregion

                #region paylns
                if (ApprovalMode)
                {
                    PayLnViews = (from pl in context.RtlPayLns
                                  where salescodes.Any(x => x == pl.rtplCode) && pl.CompanyId == ComInfo.Id
                                  select new PayLnView
                                  {
                                      payId = pl.payId,
                                      Amount = pl.Amount,
                                      pmtCode = pl.pmtCode,
                                      rtplCode = pl.rtplCode,
                                      rtplParentId = pl.rtplParentId,
                                      CompanyId = pl.CompanyId
                                  }
                                    ).ToList();


                    var paylist = (from p in context.RtlPays
                                   where salescodes.Any(x => x == p.rtpCode) && p.CompanyId == ComInfo.Id
                                   select p
                                   ).ToList();

                    foreach (var payln in PayLnViews)
                    {
                        var pay = paylist.FirstOrDefault(x => x.rtpUID == payln.payId && x.CompanyId == payln.CompanyId);
                        payln.rtpCode = pay.rtpCode;
                        payln.rtpPayType = pay.rtpPayType;
                    }
                }
                else
                {
                    PayLnViews = (from pl in context.RtlPayLns
                                  join p in context.RtlPays
                                  on pl.payId equals p.rtpUID
                                  where p.rtpDate >= frmdate && p.rtpDate <= todate && p.rtpSalesLoc.ToLower() == location && p.rtpDvc.ToLower() == device && p.CompanyId == ComInfo.Id && pl.CompanyId == p.CompanyId
                                  select new PayLnView
                                  {
                                      payId = pl.payId,
                                      Amount = pl.Amount,
                                      pmtCode = pl.pmtCode,
                                      rtpCode = p.rtpCode,
                                      rtpPayType = p.rtpPayType,
                                      rtplParentId = pl.rtplParentId,
                                      CompanyId = pl.CompanyId
                                  }
                                    ).ToList();
                }

                #endregion

                //for debug use
                int salesmodelcount = SalesModels.Count();
                int saleslnviewscount = SalesLnViews.Count();
                int paylnviewscount = PayLnViews.Count();

                string invoicestatus = comInfo.DefaultAbssInvoiceStatus;//O:suggested by Kim


                if (SalesLnViews.Count > 0)
                {
                    foreach (var sales in SalesModels)
                    {
                        checkoutIds.Add(sales.rtsUID);
                    }
                    onlineModeItem.checkoutIds = checkoutIds;

                    var GroupedSalesLnList = SalesLnViews.GroupBy(x => x.rtlCode);

                    Dictionary<string, List<PayLnView>> GroupedPayLnList = new Dictionary<string, List<PayLnView>>();
                    //Dictionary<string, double> DicSalesLnAmtList = new Dictionary<string, double>();
                    foreach (var group in GroupedSalesLnList)
                    {
                        var paylnlist = PayLnViews.Where(x => x.rtpCode == group.Key).ToList();
                        GroupedPayLnList.Add(group.Key, paylnlist);
                        //DicSalesLnAmtList[group.Key] = (double)group.Sum(x => x.rtlSalesAmt);
                    }

                    List<string> columns = null;
                    string strcolumn = "";
                    double salespaidamt = 0;
                    string value = "";

                    sqllist = new List<string>();

                    foreach (var group in GroupedSalesLnList)
                    {
                        sql = $"INSERT INTO Import_Item_Sales({sqlfields4Sales})  VALUES(";
                        List<string> values = new List<string>();
                        bool isdeposit = group.FirstOrDefault().rtlCode.StartsWith("DE");

                        if (group.Count() <= 1)
                        {
                            var item = group.FirstOrDefault();
                            GenSql4SalesItem(salesprefix, out checkoutportal, approvalmode, dateformatcode, invoicestatus, out columns, out strcolumn, out salespaidamt, out value, ref values, item, sqlfields4Sales, false, ref sql, GroupedPayLnList);
                        }
                        else
                        {
                            foreach (var item in group)
                            {
                                GenSql4SalesItem(salesprefix, out checkoutportal, approvalmode, dateformatcode, invoicestatus, out columns, out strcolumn, out salespaidamt, out value, ref values, item, sqlfields4Sales, true, ref sql, GroupedPayLnList);
                            }
                            groupcount += group.Count();
                        }

                        sql += string.Join(",", values) + ")";
                        ModelHelper.WriteLog(context, sql, "ExportFrmShop");
                        sqllist.Add(sql);
                        onlineModeItem.DicSQL["sales"] = sql;
                    }

                    #region Write to MYOB
                    using (localhost.Dayends dayends = new localhost.Dayends())
                    {
                        dayends.Url = comInfo.WebServiceUrl;
                        dayends.WriteMYOBBulk(ConnectionString, sqllist.ToArray());
                    }
                    #endregion

                    #region Write sqllist into Log & update checkoutIds
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            ModelHelper.WriteLog(context, string.Format("Export Sales data From Shop done; sqllist:{0}; connectionstring:{1}", string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
                            List<RtlSale> saleslist = context.RtlSales.Where(x => checkoutIds.Any(y => x.rtsUID == y)).ToList();
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
                            StringBuilder sb = new StringBuilder();
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
                            ModelHelper.WriteLog(context, string.Format("Export Sales data From Shop failed: {0}; sql:{1}; connectionstring: {2}", sb, sql, ConnectionString), "ExportFrmShop");
                            context.SaveChanges();
                        }

                    }
                    #endregion

                }


                if (RefundLnViews.Count > 0)
                {
                    foreach (var sales in RefundModels)
                    {
                        checkoutIds.Add(sales.rtsUID);
                    }

                    var GroupedRefundLnList = RefundLnViews.GroupBy(x => x.rtlCode);
                    Dictionary<string, List<PayLnView>> GroupedPayLnList = new Dictionary<string, List<PayLnView>>();
                    Dictionary<string, double> DicSalesLnAmtList = new Dictionary<string, double>();
                    foreach (var group in GroupedRefundLnList)
                    {
                        var paylnlist = PayLnViews.Where(x => x.rtpCode == group.Key).ToList();
                        GroupedPayLnList.Add(group.Key, paylnlist);
                        DicSalesLnAmtList[group.Key] = (double)group.Sum(x => x.rtlSalesAmt);
                    }

                    List<string> columns = null;
                    string strcolumn = "";
                    string value = "";
                    //string refsalescode = "";

                    double refundpaidamt = 0;

                    sqllist = new List<string>();
                    foreach (var group in GroupedRefundLnList)
                    {
                        sql = $"INSERT INTO Import_Item_Sales({sqlfields4Sales})  VALUES(";
                        List<string> values = new List<string>();
                        //rsql = "INSERT INTO Import_Item_Sales(CoLastName,InvoiceNumber,SaleDate,ItemNumber,Quantity,Price,Discount,Total,SaleStatus,Location,CardID,AmountPaid,PaymentMethod,PaymentIsDue,DiscountDays,BalanceDueDays,PercentDiscount,PercentMonthlyCharge,DeliveryStatus,CustomersNumber,Job,Comment,SalespersonLastName,Memo,CurrencyCode,ExchangeRate,AddressLine1,AddressLine2,AddressLine3,AddressLine4,DeliveryDate)  VALUES(";

                        if (group.Count() <= 1)
                        {
                            var item = group.FirstOrDefault();
                            //values = genRefundSQL(salesprefix, refundprefix, approvalmode, currencycode, exchangerate, out paytypeamts, out paytypes, out salesrefundcode, out collength, dateformatcode, invoicestatus, GroupedPayLnList, out columns, out strcolumn, out value, out refsalescode, refundpaidamt, item, false);
                            GenSql4SalesItem(salesprefix, out checkoutportal, approvalmode, dateformatcode, invoicestatus, out columns, out strcolumn, out refundpaidamt, out value, ref values, item, sqlfields4Sales, false, ref sql, GroupedPayLnList);
                        }
                        else
                        {
                            foreach (var item in group)
                            {
                                //values = genRefundSQL(salesprefix, refundprefix, approvalmode, currencycode, exchangerate, out paytypeamts, out paytypes, out salesrefundcode, out collength, dateformatcode, invoicestatus, GroupedPayLnList, out columns, out strcolumn, out value, out refsalescode, refundpaidamt, item, true);
                                GenSql4SalesItem(salesprefix, out checkoutportal, approvalmode, dateformatcode, invoicestatus, out columns, out strcolumn, out refundpaidamt, out value, ref values, item, sqlfields4Sales, false, ref sql, GroupedPayLnList);
                            }
                        }

                        sql += string.Join(",", values) + ")";
                        ModelHelper.WriteLog(context, sql, "ExportFrmShop");
                        sqllist.Add(sql);
                        onlineModeItem.DicSQL["sales"] = sql;

                        #region Write to MYOB
                        using (localhost.Dayends dayends = new localhost.Dayends())
                        {
                            dayends.Url = comInfo.WebServiceUrl;
                            dayends.WriteMYOB(ConnectionString, sql);
                        }
                        #endregion

                    }

                    #region Write sqllist into Log & update checkoutIds
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            ModelHelper.WriteLog(context, string.Format("Export Sales data From Shop done; sqllist:{0}; connectionstring:{1}", string.Join(",", sqllist), ConnectionString), "ExportFrmShop");

                            List<RtlSale> saleslist = context.RtlSales.Where(x => checkoutIds.Any(y => x.rtsUID == y)).ToList();
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
                            StringBuilder sb = new StringBuilder();
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
                            PPWLib.Helpers.ModelHelper.WriteLog(context, string.Format("Export Sales data From Shop failed: {0}; sql:{1}; connectionstring: {2}", sb, sql, ConnectionString), "ExportFrmShop");
                            context.SaveChanges();
                        }

                    }
                    #endregion
                }
            }

            if (filename == "Wholesales_")
            {
                bool ismultiuser = (bool)comInfo.MyobMultiUser;
                string currencycode = comInfo.DefaultCurrencyCode;
                double exchangerate = (double)comInfo.DefaultExchangeRate;

                #region Local Variables
                string sql = "";
                List<WholeSalesModel> SalesModels = new List<WholeSalesModel>();
                List<WholeSalesLnModel> SalesLnViews = new List<WholeSalesLnModel>();
                List<string> sqllist = new List<string>();
                string accountno = "";
                //int groupcount = 0; //for debug use              
                //int collength = 24;

                var session = ModelHelper.GetCurrentSession(context);
                var location = session.sesShop.ToLower();
                var device = session.sesDvc.ToLower();
                var dateformatcode = context.AppParams.FirstOrDefault(x => x.appParam == "DateFormat").appVal;
                accountno = context.ComInfoes.FirstOrDefault().comAccountNo;
                string salescode = string.Empty;
                string wholesalesprefix = context.Devices.FirstOrDefault(x => x.CompanyId == CompanyId && x.AccountProfileId == AccountProfileId).dvcWholesalesPrefix;
                #endregion

                #region Date Ranges
                int year = DateTime.Now.Year;
                DateTime frmdate;
                DateTime todate;
                if (string.IsNullOrEmpty(strfrmdate))
                {
                    frmdate = new DateTime(year, 1, 1);
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
                    todate = new DateTime(year, 12, 31);
                }
                else
                {
                    int mth = int.Parse(strtodate.Split('/')[1]);
                    int day = int.Parse(strtodate.Split('/')[0]);
                    year = int.Parse(strtodate.Split('/')[2]);
                    todate = new DateTime(year, mth, day);
                }
                #endregion

                #region SalesLns  
                //  List<string> approvedsalescodes = new List<string>();
                List<string> reviewedsalescodes = new List<string>();
                //approvedsalescodes = context.SalesOrderReviews.Where(x => x.IsApproved != null && (bool)x.IsApproved).Select(x => x.SalesOrder).ToList();
                List<string> salescodes = new List<string>();
                List<string> reviewcodelist = new List<string>();
                string invoicestatus = comInfo.DefaultAbssInvoiceStatus;//O:suggested by Kim

                if (approvalmode)
                {
                    #region SalesModels
                    var saleslist = (from s in context.WholeSales
                                     where s.wsDate >= frmdate && s.wsDate <= todate && (s.wsStatus.ToLower() == WholeSalesStatus.deliver.ToString() || s.wsStatus.ToLower() == WholeSalesStatus.partialdeliver.ToString())
                                     && s.wsSalesLoc.ToLower() == location && s.wsDvc.ToLower() == device && s.AccountProfileId == apId
                                     //      && approvedsalescodes.Any(x => x == s.wsCode)
                                     select s
                               ).ToList();

                    if (!includeUploaded && saleslist.Count > 0)
                    {
                        saleslist = saleslist.Where(x => !x.wsCheckout).ToList();
                    }

                    /*
                 *  street1ln1 = customer.AddressList[1].StreetLine1;
                        street1ln2 = customer.AddressList[1].StreetLine2;
                        street1ln1 = CommonHelper.StringToNarrow4SQL(string.Concat(street1ln1, street1ln2));
                 */
                    if (saleslist.Count > 0)
                    {
                        foreach (var s in saleslist)
                        {
                            SalesModels.Add(new WholeSalesModel()
                            {
                                wsUID = s.wsUID,
                                wsCode = s.wsCode,
                                wsStatus = s.wsStatus,
                                wsFinalTotal = s.wsFinalTotal,
                                wsMonthBase = s.wsMonthBase,
                                wsRefCode = s.wsRefCode, //for deposit reference
                                wsCheckoutPortal = s.wsCheckoutPortal,
                                wsDeliveryAddress1 = string.IsNullOrEmpty(s.wsDeliveryAddress1) ? string.Empty : CommonHelper.StringHandleAddress(s.wsDeliveryAddress1.Trim()),
                                wsDeliveryAddress2 = string.IsNullOrEmpty(s.wsDeliveryAddress2) ? string.Empty : CommonHelper.StringToNarrow4SQL(s.wsDeliveryAddress2.Trim()),
                                wsDeliveryAddress3 = string.IsNullOrEmpty(s.wsDeliveryAddress3) ? string.Empty : CommonHelper.StringToNarrow4SQL(s.wsDeliveryAddress3.Trim()),
                                wsDeliveryAddress4 = string.IsNullOrEmpty(s.wsDeliveryAddress4) ? string.Empty : CommonHelper.StringToNarrow4SQL(s.wsDeliveryAddress4.Trim()),
                                wsCheckout = s.wsCheckout,
                                CreateBy = s.CreateBy,
                                wsCusID = s.wsCusID,
                                wsCusCode = s.wsCusCode,
                                wsCustomerPO = s.wsCustomerPO,
                                wsDate = s.wsDate,
                                wsTime = s.wsTime,
                                wsDeliveryDate = s.wsDeliveryDate,
                                wsCurrency = s.wsCurrency,
                                wsExRate = s.wsExRate,
                            });
                        }
                    }

                    #endregion

                    #region SalesLnViews
                    if (SalesModels.Count > 0)
                    {
                        var _salescodes = string.Join(",", SalesModels.Select(x => x.wsCode).Distinct().ToList());
                        var _status = string.Join(",", SalesModels.Select(x => x.wsStatus).Distinct().ToList());
                        var saleslnlist = context.GetWholeSalesLnListByCodesStatus3(apId, _salescodes, _status);
                        //foreach (var s in SalesModels)
                        //{
                        //var saleslns = context.WholeSalesLns.Where(x => x.wslCode == s.wsCode && (x.wslStatus.ToLower() == WholeSalesStatus.deliver.ToString() || x.wslStatus.ToLower() == WholeSalesStatus.partialdeliver.ToString()) && x.AccountProfileId == apId).Distinct().ToList();

                        foreach (var sl in saleslnlist)
                        {
                            //var qty = sl.wslStatus == "partialdeliver" ? sl.wslDelQty : sl.wslQty;
                            //double dsalesamt = sl.wslStatus == "partialdeliver" ? (double)sl.wslDelSalesAmt : (double)sl.wslSalesAmt;
                            var qty = sl.wslDelQty;
                            double dsalesamt = sl.wslDelSalesAmt == null ? (double)sl.wslSalesAmt : (double)sl.wslDelSalesAmt;

                            var sales = SalesModels.FirstOrDefault(x => x.wsCode == sl.wslCode);

                            SalesLnViews.Add(new WholeSalesLnModel
                            {
                                wslItemCode = sl.wslItemCode,
                                wslUID = sl.wslUID,
                                wslCode = sl.wslCode,
                                dQty = Convert.ToDouble(qty),
                                dLineSalesAmt = dsalesamt,
                                dLineDiscPc = (double)sl.wslLineDiscPc,
                                wslLineDiscAmt = sl.wslLineDiscAmt,
                                wslDelLineDiscAmt = sl.wslDelLineDiscAmt,
                                wslSalesAmt = sl.wslSalesAmt,
                                wslDelSalesAmt = sl.wslDelSalesAmt,
                                dPrice = (double)sl.wslSellingPrice,
                                wslDate = sl.wslDate,
                                wslSalesLoc = sl.wslSalesLoc,
                                wslStockLoc = sl.wslStockLoc,
                                CustomerID = sales == null ? 0 : sales.wsCusID ?? 0,
                                CustomerCode = sales == null ? "" : sales.wsCusCode,
                                wslRefSales = sl.wslRefSales,
                                SalesPersonName = sales == null ? "" : sales.CreateBy.ToUpper(),
                                InvoiceStatus = sl.wslStatus,
                                wslCheckout = sales == null ? false : sales.wsCheckout,
                                DeliveryAddress1 = sales == null ? "" : string.IsNullOrEmpty(sales.wsDeliveryAddress1) ? string.Empty : sales.wsDeliveryAddress1.Trim(),
                                DeliveryAddress2 = sales == null ? "" : string.IsNullOrEmpty(sales.wsDeliveryAddress2) ? string.Empty : sales.wsDeliveryAddress2.Trim(),
                                DeliveryAddress3 = sales == null ? "" : string.IsNullOrEmpty(sales.wsDeliveryAddress3) ? string.Empty : sales.wsDeliveryAddress3.Trim(),
                                DeliveryAddress4 = sales == null ? "" : string.IsNullOrEmpty(sales.wsDeliveryAddress4) ? string.Empty : sales.wsDeliveryAddress4.Trim(),
                                DeliveryDate = sales == null ? DateTime.Now : sales.wsDeliveryDate,
                                JobID = sl.JobID,
                                CurrencyCode = sales == null ? "" : sales.wsCurrency,
                                ExRate = sales == null ? 1 : sales.wsExRate,
                                CustomerPo = sales == null ? "" : sales.wsCustomerPO,
                            });
                        }
                        //}
                    }
                    #endregion

                    ModelHelper.GetCustomerItemJob4WholeSalesLn(ref SalesLnViews, ref VipList, context);

                    Dictionary<string, string> DicPayTypes = new Dictionary<string, string>();
                    DicPayTypes = PPWCommonLib.CommonHelpers.ModelHelper.GetDicPayTypes(ProjectEnum.G3, lang);

                    foreach (var sales in SalesModels)
                    {
                        sales.DicPayTypes = DicPayTypes;
                    }

                }
                else
                {
                    #region SalesModels
                    SalesModels = (from s in context.WholeSales
                                   where s.wsDate >= frmdate && s.wsDate <= todate && s.wsStatus.ToLower() == "deliver"
                                   && s.wsSalesLoc.ToLower() == location && s.wsDvc.ToLower() == device && s.AccountProfileId == apId
                                   select s
                               ).ToList().
                               Select(s => new WholeSalesModel()
                               {
                                   wsUID = s.wsUID,
                                   wsCode = s.wsCode,
                                   wsFinalTotal = s.wsFinalTotal,
                                   wsMonthBase = s.wsMonthBase,
                                   wsRefCode = s.wsRefCode, //for deposit reference
                                   wsCheckoutPortal = s.wsCheckoutPortal,
                                   wsDeliveryAddress1 = s.wsDeliveryAddress1,
                                   wsDeliveryAddress2 = s.wsDeliveryAddress2,
                                   wsDeliveryAddress3 = s.wsDeliveryAddress3,
                                   wsDeliveryAddress4 = s.wsDeliveryAddress4,
                                   wsCheckout = s.wsCheckout,
                                   CreateBy = s.CreateBy,
                                   wsCusID = s.wsCusID,
                                   wsCustomerPO = s.wsCustomerPO,
                                   wsDate = s.wsDate,
                                   wsTime = s.wsTime,
                                   wsDeliveryDate = s.wsDeliveryDate,
                                   wsCurrency = s.wsCurrency,
                                   wsExRate = s.wsExRate
                               }
                            ).ToList();
                    if (!includeUploaded && SalesModels.Count > 0)
                    {
                        SalesModels = SalesModels.Where(x => !x.wsCheckout).ToList();
                    }
                    #endregion

                    #region SalesLnViews
                    if (SalesModels.Count > 0)
                    {
                        foreach (var s in SalesModels)
                        {
                            var saleslns = context.WholeSalesLns.Where(x => x.wslCode == s.wsCode && x.wslStatus != "order" && x.AccountProfileId == apId && x.CompanyId == CompanyId).ToList();
                            foreach (var sl in saleslns)
                            {
                                //var qty = sl.wslStatus == "partialdeliver" ? sl.wslDelQty : sl.wslQty;
                                //double dsalesamt = sl.wslStatus == "partialdeliver" ? (double)sl.wslDelSalesAmt : (double)sl.wslSalesAmt;
                                var qty = sl.wslDelQty;
                                double dsalesamt = (double)sl.wslDelSalesAmt;

                                SalesLnViews.Add(new WholeSalesLnModel
                                {
                                    wslItemCode = sl.wslItemCode,
                                    wslUID = sl.wslUID,
                                    wslCode = sl.wslCode,
                                    dQty = Convert.ToDouble(qty),
                                    dLineSalesAmt = dsalesamt,
                                    dLineDiscPc = (double)sl.wslLineDiscPc,
                                    wslLineDiscAmt = sl.wslLineDiscAmt,
                                    wslDelLineDiscAmt = sl.wslDelLineDiscAmt,
                                    wslSalesAmt = sl.wslSalesAmt,
                                    wslDelSalesAmt = sl.wslDelSalesAmt,
                                    dPrice = (double)sl.wslSellingPrice,
                                    wslDate = sl.wslDate,
                                    wslSalesLoc = sl.wslSalesLoc,
                                    wslStockLoc = sl.wslStockLoc,
                                    CustomerID = s.wsCusID ?? 0,
                                    CustomerCode = s.wsCusCode,
                                    wslRefSales = sl.wslRefSales,
                                    SalesPersonName = s.CreateBy.ToUpper(),
                                    InvoiceStatus = s.wsStatus,
                                    wslCheckout = s.wsCheckout,
                                    CheckoutPortal = s.wsCheckoutPortal,
                                    DeliveryAddress1 = s.wsDeliveryAddress1,
                                    DeliveryAddress2 = s.wsDeliveryAddress2,
                                    DeliveryAddress3 = s.wsDeliveryAddress3,
                                    DeliveryAddress4 = s.wsDeliveryAddress4,
                                    DeliveryDate = s.wsDeliveryDate,
                                    JobID = sl.JobID,
                                    CurrencyCode = s.wsCurrency,
                                    ExRate = s.wsExRate,
                                    CustomerPo = s.wsCustomerPO
                                });
                            }
                        }
                    }
                    #endregion

                    ModelHelper.GetCustomerItemJob4WholeSalesLn(ref SalesLnViews, ref VipList, context);

                    Dictionary<string, string> DicPayTypes = new Dictionary<string, string>();
                    DicPayTypes = PPWCommonLib.CommonHelpers.ModelHelper.GetDicPayTypes(ProjectEnum.G3, lang);

                    foreach (var sales in SalesModels)
                    {
                        sales.DicPayTypes = DicPayTypes;
                    }
                }
                #endregion


                if (SalesLnViews.Count > 0)
                {
                    foreach (var sales in SalesModels)
                    {
                        checkoutIds.Add(sales.wsUID);
                    }
                    onlineModeItem.checkoutIds = checkoutIds;

                    var GroupedSalesLnList = SalesLnViews.GroupBy(x => x.wslCode);

                    List<string> columns = null;
                    string strcolumn = "";
                    double salespaidamt = 0;
                    //double paytypeamts = 0;
                    //string paytypes = "";
                    string value = "";

                    sqllist = new List<string>();

                    foreach (var group in GroupedSalesLnList)
                    {
                        List<string> values = new List<string>();
                        sql = $"INSERT INTO Import_Item_Sales({sqlfields4Sales})  VALUES(";

                        if (group.Count() <= 1)
                        {
                            var item = group.FirstOrDefault();
                            GenSql4SalesItem(salesprefix, out checkoutportal, approvalmode, dateformatcode, invoicestatus, out columns, out strcolumn, out salespaidamt, out value, ref values, null, sqlfields4Sales, false, ref sql, null, item);
                            //values = GenWholeSalesSQL(onlineModeItem, out checkoutportal, context, ismultiuser, currencycode, exchangerate, out collength, dateformatcode, out salescode, wholesalesprefix, invoicestatus, out columns, out strcolumn, salespaidamt, paytypeamts, paytypes, out value, values, item, false);

                        }
                        else
                        {
                            foreach (var item in group)
                            {
                                GenSql4SalesItem(salesprefix, out checkoutportal, approvalmode, dateformatcode, invoicestatus, out columns, out strcolumn, out salespaidamt, out value, ref values, null, sqlfields4Sales, true, ref sql, null, item);
                                //values = GenWholeSalesSQL(onlineModeItem, out checkoutportal, context, ismultiuser, currencycode, exchangerate, out collength, dateformatcode, out salescode, wholesalesprefix, invoicestatus, out columns, out strcolumn, salespaidamt, paytypeamts, paytypes, out value, values, item, true);
                            }
                        }

                        sql += string.Join(",", values) + ")";
                        onlineModeItem.DicSQL["sales"] = sql;
                        sqllist.Add(sql);
                    }

                    using (localhost.Dayends dayends = new localhost.Dayends())
                    {
                        dayends.Url = comInfo.WebServiceUrl;
                        dayends.WriteMYOBBulk(ConnectionString, sqllist.ToArray());
                    }

                    #region Write sqllist into Log & update checkoutIds
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            ModelHelper.WriteLog(context, string.Format("Export Wholesales data From Shop done; sqllist:{0}; connectionstring:{1}", string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
                            List<WholeSale> saleslist = context.WholeSales.Where(x => checkoutIds.Any(y => x.wsUID == y)).ToList();
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
                            StringBuilder sb = new StringBuilder();
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
                            ModelHelper.WriteLog(context, string.Format("Export Wholesales data From Shop failed: {0}; sql:{1}; connectionstring: {2}", sb, sql, ConnectionString), "ExportFrmShop");
                            context.SaveChanges();
                        }

                    }
                    #endregion
                }
            }

            if (filename == "Purchase_")
            {
                #region Date Ranges
                int year = DateTime.Now.Year;
                DateTime frmdate;
                DateTime todate;
                if (string.IsNullOrEmpty(strfrmdate))
                {
                    frmdate = new DateTime(year, 1, 1);
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
                    todate = new DateTime(year, 12, 31);
                }
                else
                {
                    int mth = int.Parse(strtodate.Split('/')[1]);
                    int day = int.Parse(strtodate.Split('/')[0]);
                    year = int.Parse(strtodate.Split('/')[2]);
                    todate = new DateTime(year, mth, day);
                }
                #endregion

                dmodel.FrmToDate = frmdate;
                dmodel.ToDate = todate;

                var dateformatcode = context.AppParams.FirstOrDefault(x => x.appParam == "DateFormat").appVal;
                List<string> sqllist = new List<string>();

                ModelHelper.GetDataTransferData(context, accountprofileId, ComInfo.Id, CheckOutType.Purchase, ref dmodel);

                #region Handle ItemOptions
                var itemcodes = dmodel.ItemCodes;
                var itemoptions = context.GetItemOptionsByItemCodes6(comInfo.AccountProfileId, string.Join(",", itemcodes)).ToList();
                var stritemcodes = string.Join(",", itemcodes);
                var location = dmodel.SelectedLocation;

                var itembtInfo = context.GetBatchVtInfoByItemCodes12(comInfo.AccountProfileId, location, stritemcodes).ToList();
                var itemvtInfo = context.GetValidThruInfo12(comInfo.AccountProfileId, location, stritemcodes).ToList();

                var ibqList = (from item in itembtInfo
                               where item.batCode != null
                               group item by new { item.itmCode, item.batCode } into itemgroup
                               select new
                               {
                                   ItemCode = itemgroup.Key.itmCode,
                                   BatchCode = itemgroup.Key.batCode,
                                   TotalQty = itemgroup.Sum(x => x.batQty)
                               }).ToList();
                ibqList = ibqList.OrderBy(x => x.ItemCode).ThenBy(x => x.BatchCode).ToList();

                var ivqList = (from item in itemvtInfo
                               where item.piValidThru != null
                               group item by new { item.itmCode, item.piValidThru, item.pstCode } into itemgroup
                               select new
                               {
                                   PoCode = itemgroup.Key.pstCode,
                                   ItemCode = itemgroup.Key.itmCode,
                                   ValidThru = CommonHelper.FormatDate((DateTime)itemgroup.Key.piValidThru),
                                   TotalQty = itemgroup.Sum(x => x.vtQty)
                               }).ToList();
                ivqList = ivqList.OrderBy(x => x.ItemCode).ToList();

                var serialInfo = context.GetSerialInfo5(comInfo.AccountProfileId, location, stritemcodes, null).ToList();
                var ibvqList = (from item in itembtInfo
                                where item.batCode != null
                                //group item by new { item.itmCode, item.piBatch, item.piValidThru } into itemgroup
                                select new
                                {
                                    PoCode = item.pstCode,
                                    ItemCode = item.itmCode,
                                    BatchCode = item.batCode,
                                    ValidThru = item.batValidThru == null ? "" : CommonHelper.FormatDate((DateTime)item.batValidThru),
                                    BatQty = (int)item.batQty
                                }).ToList();
                ibvqList = ibvqList.OrderBy(x => x.ItemCode).ThenBy(x => x.BatchCode).ToList();

                var batchcodelist = ibvqList.Select(x => x.BatchCode).Distinct().ToList();

                var DicItemBatVtList = new Dictionary<string, Dictionary<string, List<string>>>();
                var DicItemSnBatVtList = new Dictionary<string, Dictionary<string, List<SnBatVt>>>();
                var DicItemSnVtList = new Dictionary<string, List<SnVt>>();
                var DicItemVtList = new Dictionary<string, List<string>>();
                foreach (var itemcode in itemcodes)
                {
                    DicItemBatVtList[itemcode] = new Dictionary<string, List<string>>();
                    DicItemSnBatVtList[itemcode] = new Dictionary<string, List<SnBatVt>>();
                    DicItemSnVtList[itemcode] = new List<SnVt>();
                    DicItemVtList[itemcode] = new List<string>();

                    foreach (var batchcode in batchcodelist)
                    {
                        DicItemBatVtList[itemcode][batchcode] = new List<string>();
                        DicItemSnBatVtList[itemcode][batchcode] = new List<SnBatVt>();
                    }
                }
                #endregion

                foreach (var po in dmodel.DicPoPurchaseItemList.Keys)
                {
                    string sql = MyobHelper.InsertImportItemPurchasesSql;
                    sql = sql.Replace("0", "{0}");
                    List<string> values = null;

                    List<string> columns = new List<string>();
                    for (int j = 0; j < MyobHelper.ImportItemPurchasesColCount; j++)
                    {
                        columns.Add("'{" + j + "}'");
                    }
                    string strcolumn = string.Join(",", columns);
                    var purchaseitems = dmodel.DicPoPurchaseItemList[po];
                    //string status = purchaseitems.Any(x => x.IsPartial != null && (bool)x.IsPartial) ? "B" : "O";
                    string status = "O";
                    values = new List<string>();
                    foreach (var purchaseitem in dmodel.DicPoPurchaseItemList[po])
                    {
                        string description = string.Empty;
                        string value = "";
                        purchaseitem.dateformat = dateformatcode == "E" ? @"dd/MM/yyyy" : @"MM/dd/yyyy";
                        var itemoption = itemoptions.FirstOrDefault(x => x.itmCode == purchaseitem.itmCode);

                        string bat = string.Empty;
                        string sn = string.Empty;
                        string vt = string.Empty;
                        string batvt = string.Empty;
                        string snvt = string.Empty;
                        string batsn = string.Empty;

                        string _batvtInfo = string.Empty;
                        List<string> batvtInfo = new List<string>();
                        string _snvtInfo = string.Empty;
                        List<string> snvtInfo = new List<string>();
                        List<string> vtInfo = new List<string>();

                        #region Handle Item Options
                        if (itemoption != null)
                        {
                            if (itemoption.chkBat)
                            {
                                if (ibvqList.Count > 0)
                                {
                                    foreach (var item in ibvqList)
                                    {
                                        string strvt = "";
                                        if (purchaseitem.itmCode == item.ItemCode)
                                        {
                                            foreach (var kv in DicItemBatVtList)
                                            {
                                                if (!(bool)itemoption.chkSN && (bool)itemoption.chkVT)
                                                {
                                                    if (kv.Key == item.ItemCode)
                                                    {
                                                        var vtarr = new List<string>();
                                                        foreach (var k in kv.Value.Keys)
                                                        {
                                                            if (k == item.BatchCode && !string.IsNullOrEmpty(item.ValidThru))
                                                            {
                                                                DicItemBatVtList[kv.Key][k].Add(item.ValidThru);
                                                                vtarr.Add(item.ValidThru);
                                                            }
                                                        }
                                                        if (vtarr.Count > 0)
                                                            strvt = string.Concat(" (", string.Join(",", vtarr), ")");
                                                    }
                                                }
                                            }

                                            bat = string.Concat("[", item.BatchCode, "]");
                                            if (!string.IsNullOrEmpty(strvt))
                                            {
                                                batvt = string.Concat(bat, strvt);
                                            }
                                            //Response.Write(item.PoCode + ":" + item.ItemCode + ":" + bat + ":" + batvt + "<br>");
                                            _batvtInfo = string.IsNullOrEmpty(batvt) ? bat : batvt;
                                            batvtInfo.Add(_batvtInfo);
                                        }
                                    }
                                }
                            }

                            if (itemoption.chkSN)
                            {
                                if (serialInfo.Count > 0)
                                {
                                    foreach (var serial in serialInfo)
                                    {
                                        string strvt = "";
                                        if (purchaseitem.itmCode == serial.snoItemCode)
                                        {
                                            foreach (var kv in DicItemSnVtList)
                                            {
                                                if (!(bool)itemoption.chkBat && (bool)itemoption.chkVT)
                                                {
                                                    if (kv.Key == serial.snoItemCode)
                                                    {
                                                        var vtarr = new List<string>();

                                                        foreach (var v in kv.Value)
                                                        {
                                                            if (!string.IsNullOrEmpty(v.vt))
                                                            {
                                                                DicItemSnVtList[kv.Key].Add(v);
                                                                vtarr.Add(v.vt);
                                                            }
                                                        }
                                                        if (vtarr.Count > 0)
                                                            strvt = string.Concat(" (", string.Join(",", vtarr), ")");
                                                    }
                                                }
                                            }

                                            sn = string.Concat("[", serial.snoCode, "]");
                                            if (!string.IsNullOrEmpty(strvt))
                                            {
                                                snvt = string.Concat(sn, strvt);
                                            }
                                            _snvtInfo = string.IsNullOrEmpty(snvt) ? sn : snvt;
                                            snvtInfo.Add(_snvtInfo);
                                        }
                                    }
                                }
                            }

                            if (itemoption.chkBat && itemoption.chkSN && itemoption.chkVT)
                            {
                                if (ivqList != null && ivqList.Count() > 0)
                                {
                                    foreach (var v in ivqList)
                                    {
                                        vt = string.Concat("[", v.ValidThru, "]");
                                        vtInfo.Add(vt);
                                    }
                                }
                            }
                        }

                        if (batvtInfo.Count > 0)
                        {
                            description = string.Concat(purchaseitem.itmNameDesc, Environment.NewLine, string.Join(",", batvtInfo));
                        }
                        else if (snvtInfo.Count > 0)
                        {
                            description = string.Concat(purchaseitem.itmNameDesc, Environment.NewLine, string.Join(",", snvtInfo));
                        }
                        else if (vtInfo.Count > 0)
                        {
                            description = string.Concat(purchaseitem.itmNameDesc, Environment.NewLine, string.Join(",", vtInfo));
                        }
                        else
                        {
                            description = purchaseitem.itmNameDesc;
                        }
                        #endregion

                        if (description.Length > 255)
                            description = description.Substring(0, 255);
                        string memo = genMemo(purchaseitem.pstCurrency, purchaseitem.pstExRate, Convert.ToDouble(purchaseitem.piAmt), purchaseitem.pstRemark);

                        /*CoLastName,PurchaseNumber,PurchaseDate,SuppliersNumber,DeliveryStatus,ItemNumber,Quantity,Price,Discount,Memo,DeliveryDate,PurchaseStatus,AmountPaid,Ordered,Location,CardID,CurrencyCode,ExchangeRate,TaxCode,Job,PaymentIsDue,DiscountDays,BalanceDueDays,PercentDiscount
                         */
                        value = string.Format("(" + strcolumn + ")", StringHandlingForSQL(purchaseitem.SupplierName), purchaseitem.pstCode, purchaseitem.PurchaseDate4ABSS, StringHandlingForSQL(purchaseitem.pstSupplierInvoice), "A", StringHandlingForSQL(purchaseitem.itmCode), purchaseitem.piQty, purchaseitem.piUnitPrice, purchaseitem.piDiscPc, memo, purchaseitem.PromisedDate4ABSS, status, "0", purchaseitem.piReceivedQty, purchaseitem.piStockLoc, StringHandlingForSQL(purchaseitem.supCode), StringHandlingForSQL(purchaseitem.pstCurrency), purchaseitem.pstExRate, purchaseitem.TaxCode, purchaseitem.JobNumber, purchaseitem.Myob_PaymentIsDue, purchaseitem.Myob_DiscountDays, purchaseitem.Myob_BalanceDueDays, "0");
                        values.Add(value);
                    }
                    sql = string.Format(sql, string.Join(",", values));
                    sqllist.Add(sql);
                }
                //Response.Write(string.Join(",",sqllist));
                //return;
                using (localhost.Dayends dayends = new localhost.Dayends())
                {
                    dayends.Url = comInfo.WebServiceUrl;
                    dayends.WriteMYOBBulk(ConnectionString, sqllist.ToArray());
                }

                ModelHelper.WriteLog(context, string.Join(",", sqllist), "ExportFrmShop#Purchase");
                List<PPWDAL.Purchase> pslist = context.Purchases.Where(x => dmodel.PoCheckOutIds.Any(y => x.Id == y)).ToList();
                foreach (var ps in pslist)
                {
                    ps.pstCheckout = true;
                }
                context.SaveChanges();

            }


            if (filename.StartsWith("Items_"))
            {
                ModelHelper.GetDataTransferData(context, accountprofileId, ComInfo.Id, CheckOutType.Items, ref dmodel);

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
                    string taxcode = item.itmIsTaxedWhenSold == null ? "" : (bool)item.itmIsTaxedWhenSold ? comInfo.DefaultTaxCode : "";
                    string inactivetxt = item.itmIsActive ? "N" : "Y";
                    string inventoryacc = item.InventoryAccountNo == 0 ? "" : item.InventoryAccountNo.ToString();
                    string incomeacc = item.IncomeAccountNo == 0 ? "" : item.IncomeAccountNo.ToString();
                    string expenseacc = item.ExpenseAccountNo == 0 ? "" : item.ExpenseAccountNo.ToString();
                    //string itemdesc = string.IsNullOrEmpty(item.itmDesc) ? "" : CommonHelper.ConvertUTF8ToASCII(StringHandlingForSQL(CommonHelper.EscapeString(item.itmDesc)));
                    string itemdesc = string.IsNullOrEmpty(item.itmDesc) ? "" : StringHandlingForSQL(CommonHelper.EscapeString(item.itmDesc));
                    /*
                     * ItemNumber,ItemName,Buy,Sell,Inventory,AssetAccount,IncomeAccount,ExpenseAccount,ItemPicture,Description,UseDescriptionOnSale,CustomList1,CustomList2,CustomList3,CustomField1,CustomField2,CustomField3,PrimarySupplier,SupplierItemNumber,TaxWhenBought,BuyUnitMeasure,NumberItemsBuyUnit,ReorderQuantity,MinimumLevel,SellingPrice,SellUnitMeasure,NumberItemsSellUnit,TaxWhenSold,QuantityBreak1,PriceLevelAQtyBreak1,PriceLevelBQtyBreak1,PriceLevelCQtyBreak1,PriceLevelDQtyBreak1,PriceLevelEQtyBreak1,PriceLevelFQtyBreak1,InactiveItem,StandardCost,DefaultShipSellLocation,DefaultReceiveAutoBuildLocation
                     */
                    value = string.Format("(" + strcolumn + ")", item.itmCode, item.itmName, buy, sell, inventory, inventoryacc, incomeacc, expenseacc, "", itemdesc, usedesc, "", "", "", "", "", "", "", item.itmSupCode, "", item.itmBuyUnit, 1, 0, 0, item.itmBaseSellingPrice, item.itmSellUnit, item.itmSellUnitQuantity, taxcode, 0, item.PLA, item.PLB, item.PLC, item.PLD, item.PLE, item.PLF, inactivetxt, item.itmBuyStdCost, item.SelectedLocation, "");
                    values.Add(value);
                }

                sql += string.Join(",", values) + ")";
                ModelHelper.WriteLog(context, string.Format("sql:{0}; checkoutids:{1}", sql, string.Join(",", dmodel.CheckOutIds_Item)), "ExportFrmShop");
                context.SaveChanges();

                using (localhost.Dayends dayends = new localhost.Dayends())
                {
                    dayends.Url = comInfo.WebServiceUrl;
                    dayends.WriteMYOB(ConnectionString, sql);
                }

                updateDB(dmodel.CheckOutIds_Item.ToArray(), accountprofileId, ComInfo.Id, CheckOutType.Items);
            }

            if (filename.StartsWith("PGLocStocks_"))
            {
                string sql = "";
                ModelHelper.GetDataTransferData(context, accountprofileId, ComInfo.Id, CheckOutType.PGLocStocks, ref dmodel);
                sql = MyobHelper.InsertImportLocStockSql;
                sql = sql.Replace("0", "{0}");
                List<string> values = new List<string>();
                List<string> columns = new List<string>();
                for (int j = 0; j < MyobHelper.ImportLocStockColCount; j++)
                {
                    columns.Add("'{" + j + "}'");
                }
                string strcolumn = string.Join(",", columns);

                foreach (var item in dmodel.LocStockList)
                {
                    string value = "";
                    value = string.Format("(" + strcolumn + ")", "", item.AdjustmentDate, item.lstStockLoc, item.lstItemCode, item.lstStockLoc, item.QuantityAvailable, 0, 0, item.InventoryAccountNo, "", "", "");
                    values.Add(value);
                }
                sql = string.Format(sql, string.Join(",", values));
                using (localhost.Dayends dayends = new localhost.Dayends())
                {
                    dayends.Url = comInfo.WebServiceUrl;
                    dayends.WriteMYOB(ConnectionString, sql);
                }

                ModelHelper.WriteLog(context, string.Join(",", sql), "ExportFrmShop#Stock");
                context.SaveChanges();

                updateDB(dmodel.CheckOutIds_Stock.ToArray(), accountprofileId, ComInfo.Id, CheckOutType.PGLocStocks);
            }

            if (filename.StartsWith("Customers_"))
            {
                WritePGCustomerToABSS(AccountProfileId, ref onlineModeItem, dmodel);
                updateDB(onlineModeItem.checkoutIds.ToArray(), AccountProfileId, CompanyId, CheckOutType.PGCustomers);
                WriteMyobCustomerToABSS(AccountProfileId, ref onlineModeItem, dmodel);
                updateDB(onlineModeItem.checkoutIds.ToArray(), AccountProfileId, CompanyId, CheckOutType.MyobCustomers);
                WriteVipToABSS();
            }

            if (filename == "Suppliers_")
            {
                WriteSupplierToABSS(accountprofileId, ComInfo.Id, ref onlineModeItem, dmodel);
                updateDB(onlineModeItem.checkoutIds.ToArray(), accountprofileId, ComInfo.Id, CheckOutType.Suppliers);
            }

            if (filename.StartsWith("Devices_"))
            {

                ModelHelper.GetDataTransferData(context, accountprofileId, ComInfo.Id, CheckOutType.Device, ref dmodel);
                var jsondevicelist = JsonConvert.SerializeObject(dmodel.DeviceList);
                var central4device = ConfigurationManager.AppSettings["CentralApiUrl4Device"];

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(CentralBaseUrl);
                    var content = new FormUrlEncodedContent(new[]
                    {
                new KeyValuePair<string, string>("jsondevicelist", jsondevicelist),
                new KeyValuePair<string, string>("accountprofileId", accountprofileId.ToString()),
            });
                    await client.PostAsync(central4device, content);
                    ModelHelper.WriteLog(context, "Device Exported Done", "ExportFrmShop");
                    context.SaveChanges();
                }
            }
        }



        private void GenSql4SalesItem(string salesprefix, out string checkoutportal, bool approvalmode, string dateformatcode, string invoicestatus, out List<string> columns, out string strcolumn, out double salespaidamt, out string value, ref List<string> values, SalesLnView item, string sqlfields, bool groupCountMoreThanOne, ref string sql, Dictionary<string, List<PayLnView>> GroupedPayLnList = null, WholeSalesLnModel wssalesLn = null)
        {
            bool isDeposit = item != null ? item.rtlCode.StartsWith("DE") : false;
            int collength = sqlfields.Split(',').Length;
            if (isDeposit)
            {
                sql = $"Insert Into Import_Service_Sales({sqlfields4Deposit}) Values(";
                collength = sqlfields4Deposit.Split(',').Length;
            }
            checkoutportal = item != null ? item.CheckoutPortal : wssalesLn.CheckoutPortal;
            if (item != null)
                item.dateformat = dateformatcode == "E" ? @"dd/MM/yyyy" : @"MM/dd/yyyy";
            else
                wssalesLn.dateformat = dateformatcode == "E" ? @"dd/MM/yyyy" : @"MM/dd/yyyy";
            //double mthchrpc = 0;
            string deliverystatus = "A";

            //List<string> paytypeamtlist = new List<string>();
            string paytypes = "";
            if (GroupedPayLnList != null)
            {
                List<string> paytypelist = new List<string>();
                foreach (var payln in GroupedPayLnList[item.rtlCode])
                {
                    //paytypeamtlist.Add(string.Format("{0}:{1}", payln.pmtCode, payln.Amount));
                    paytypelist.Add(payln.pmtCode);
                }
                paytypes = string.Join("; ", paytypelist);
            }
            var salesrefundcode = item != null ? item.rtlCode : wssalesLn.wslCode;


            columns = new List<string>();
            for (int j = 0; j < collength; j++)
            {
                columns.Add("'{" + j + "}'");
            }
            strcolumn = string.Join(",", columns);
            string customerpo;
            string memo = "";
            if (item != null)
            {
                salespaidamt = item.rtlRefSales.StartsWith("DE") ? Convert.ToDouble(item.rtlSalesAmt) : 0;
                customerpo = approvalmode ? item.rtsCustomerPO : item.rtlRefSales;
                memo = genMemo(item.rtsCurrency, Convert.ToDouble(item.rtsExRate), salespaidamt, "");
            }
            else
            {
                salespaidamt = 0;
                customerpo = approvalmode ? wssalesLn.CustomerPo : wssalesLn.wslRefSales;
                memo = genMemo(wssalesLn.CurrencyCode, Convert.ToDouble(wssalesLn.ExRate), salespaidamt, "");
            }

            string salesfirstname = "";
            string saleslastname = item != null ? item.SalesPersonName : wssalesLn.SalesPersonName;
            string location = item != null ? item.StockLocationDisplay : wssalesLn.StockLocationDisplay;

            if (isDeposit)
            {
                /*CoLastName,CardID,CustomersNumber,InvoiceNumber,SaleDate,AccountNumber,Amount,SaleStatus,DeliveryStatus,Memo,SalesPersonLastName,Description,PaymentIsDue,DiscountDays,BalanceDueDays,PercentDiscount,PercentMonthlyCharge*/
                value = string.Format(strcolumn, item.CustomerName, StringHandlingForSQL(item.CustomerCode), StringHandlingForSQL(customerpo), salesrefundcode, item.SalesDateDisplay, ComInfo.comAccountNo, item.DepositAmt * -1, "I", "B", StringHandlingForSQL(paytypes), StringHandlingForSQL(salesfirstname), "", item.Myob_PaymentIsDue, item.Myob_DiscountDays, item.Myob_BalanceDueDays, "0", "0");
            }
            else
            {
                /*CoLastName,InvoiceNumber,SaleDate,ItemNumber,Quantity,Price,Discount,SaleStatus,Location,CardID,AmountPaid,PaymentMethod,PaymentIsDue,DiscountDays,BalanceDueDays,PercentDiscount,PercentMonthlyCharge,DeliveryStatus,CustomersNumber,Job,SalespersonFirstName,SalespersonLastName,Memo,TaxCode,CurrencyCode,ExchangeRate,AddressLine1,AddressLine2,AddressLine3,AddressLine4*/
                if (item != null)
                {
                    value = string.Format(strcolumn, item.CustomerName, "", item.SalesDateDisplay, StringHandlingForSQL(item.Item.itmCode), item.dQty, item.dPrice, item.dLineDiscPc, invoicestatus, location, StringHandlingForSQL(item.CustomerCode), salespaidamt, StringHandlingForSQL(paytypes), item.Myob_PaymentIsDue, item.Myob_DiscountDays, item.Myob_BalanceDueDays, "0", "0", deliverystatus, StringHandlingForSQL(customerpo), item.JobNumber, StringHandlingForSQL(salesfirstname), StringHandlingForSQL(saleslastname), StringHandlingForSQL(memo), item.rtlTaxCode, item.rtsCurrency, item.rtsExRate, item.rtsDeliveryAddress1, item.rtsDeliveryAddress2, item.rtsDeliveryAddress3, item.rtsDeliveryAddress4);
                }
                else
                {
                    value = string.Format(strcolumn, wssalesLn.CustomerName, "", wssalesLn.SalesDateDisplay, StringHandlingForSQL(wssalesLn.Item.itmCode), wssalesLn.dQty, wssalesLn.dPrice, wssalesLn.dLineDiscPc, invoicestatus, location, StringHandlingForSQL(wssalesLn.CustomerCode), salespaidamt, StringHandlingForSQL(paytypes), wssalesLn.Myob_PaymentIsDue, wssalesLn.Myob_DiscountDays, wssalesLn.Myob_BalanceDueDays, "0", "0", deliverystatus, StringHandlingForSQL(customerpo), wssalesLn.JobNumber, StringHandlingForSQL(salesfirstname), StringHandlingForSQL(saleslastname), StringHandlingForSQL(memo), wssalesLn.wslTaxCode, wssalesLn.CurrencyCode, wssalesLn.ExRate, wssalesLn.DeliveryAddress1, wssalesLn.DeliveryAddress2, wssalesLn.DeliveryAddress3, wssalesLn.DeliveryAddress4);
                }
            }

            if (groupCountMoreThanOne)
            {
                value = string.Concat("(", value, ")");
            }

            values.Add(value);
            //return values;
        }

        private static string StringHandlingForSQL(string str)
        {
            return CommonHelper.StringHandlingForSQL(str);
        }

        private static string genMemo(string currencycode, double exchangerate, double paytypeamts, string pstRemark)
        {
            return StringHandlingForSQL(string.Concat(currencycode, " ", paytypeamts, $"({exchangerate})", " ", pstRemark));
        }

        private async Task<bool> ExportData4Kingdee(DayEndsModel model, DataTransferModel dmodel, string filename, string strfrmdate = "", string strtodate = "", bool includePending = false, bool includeUploaded = false, int lang = 0, string salesprefix = "", string refundprefix = "")
        {
            bool bret = false;
            string url;
            HttpClient _client;

            DateTime frmdate, todate;
            CommonHelper.HandlingDateRanges(strfrmdate, strtodate, out frmdate, out todate);

            if (filename.StartsWith("ItemSales_"))
            {
                using (var context = new PPWDbContext())
                {
                    var icount = context.GetSalesInvoicesCount(frmdate, todate, includeUploaded).FirstOrDefault().GetValueOrDefault();
                    var device = Session["Device"] as DeviceModel;
                    if (icount > 0)
                    {
                        int iIncludeUploaded = includeUploaded ? 1 : 0;
                        strfrmdate = frmdate.ToString("yyyyMMdd");
                        strtodate = todate.ToString("yyyyMMdd");
                        url = kingdeeApiBaseUrl + "UploadInvoice?strfrmdate=" + strfrmdate + "&strtodate=" + strtodate + "&device=" + device.dvcCode + "&shop=" + device.dvcShop + "&iIncludeUploaded=" + iIncludeUploaded;
                        _client = new HttpClient();
                        _client.MaxResponseContentBufferSize = int.MaxValue;
                        var content = await _client.GetStringAsync(url);
                        bret = bool.Parse(content);
                        if (bret)
                        {
                            model.PendingInvoices = ModelHelper.GetPendingInvoices(context);
                            if (model.PendingInvoices.Count > 0)
                            {
                                Session["PendingInvoices"] = model.PendingInvoices;
                            }
                        }
                    }
                    icount = context.GetSalesRefundCount(frmdate, todate).FirstOrDefault().GetValueOrDefault();
                    if (icount > 0)
                    {
                        strfrmdate = frmdate.ToString("yyyyMMdd");
                        strtodate = todate.ToString("yyyyMMdd");
                        url = kingdeeApiBaseUrl + "UploadRefund?strfrmdate=" + strfrmdate + "&strtodate=" + strtodate + "&device=" + device.dvcCode + "&shop=" + device.dvcShop;
                        _client = new HttpClient();
                        _client.MaxResponseContentBufferSize = int.MaxValue;
                        var content = await _client.GetStringAsync(url);
                        //var bretlist = JsonConvert.DeserializeObject<List<bool>>(content);
                        return content != null;
                    }
                    else
                    {
                        return bret;
                    }
                }
            }

            if (filename.StartsWith("Customers_"))
            {
                using (var context = new PPWDbContext())
                {
                    var icount = context.GetUnCheckoutKCustomerCount(frmdate, todate).FirstOrDefault().GetValueOrDefault();
                    if (icount > 0)
                    {
                        strfrmdate = frmdate.ToString("yyyyMMdd");
                        strtodate = todate.ToString("yyyyMMdd");
                        url = kingdeeApiBaseUrl + "UploadCustomer?strfrmdate=" + strfrmdate + "&strtodate=" + strtodate;
                        _client = new HttpClient();
                        _client.MaxResponseContentBufferSize = int.MaxValue;
                        var content = await _client.GetStringAsync(url);
                        return bool.Parse(content);
                    }
                }
            }
            return false;
        }



        private void updateDB(long[] _checkoutIds, int accountProfileId, int companyId, CheckOutType checkOutType)
        {
            using (var context = new PPWDbContext())
            {
                List<long> checkoutIds = new List<long>();
                checkoutIds = _checkoutIds.ToList();

                switch (checkOutType)
                {
                    case CheckOutType.Suppliers:
                        List<Supplier> suppliers = context.Suppliers.Where(x => checkoutIds.Any(y => x.supId == y) && x.AccountProfileId == accountProfileId).ToList();

                        foreach (var supplier in suppliers)
                        {
                            supplier.supCheckout = true;
                            supplier.IsABSS = true;
                        }

                        break;
                    case CheckOutType.MyobCustomers:
                        List<MyobCustomer> mcustomers = context.MyobCustomers.Where(x => checkoutIds.Any(y => x.cusCustomerID == y) && x.AccountProfileId == accountProfileId).ToList();
                        foreach (var customer in mcustomers)
                        {
                            customer.cusCheckout = true;
                        }
                        break;
                    case CheckOutType.PGCustomers:
                        List<PGCustomer> pcustomers = context.PGCustomers.Where(x => checkoutIds.Any(y => x.cusCustomerID == y) && x.AccountProfileId == accountProfileId).ToList();
                        foreach (var customer in pcustomers)
                        {
                            customer.cusCheckout = true;
                        }
                        break;
                    case CheckOutType.PGLocStocks:
                        List<PGLocStock> stocks = context.PGLocStocks.Where(x => checkoutIds.Any(y => x.lstItemLocationID == y) && x.AccountProfileId == accountProfileId).ToList();
                        foreach (var item in stocks)
                        {
                            item.lstCheckout = true;
                        }
                        break;
                    case CheckOutType.Items:
                        List<PGItem> pitems = context.PGItems.Where(x => checkoutIds.Any(y => x.itmItemID == y) && x.AccountProfileId == accountProfileId).ToList();
                        List<MyobItem> mitems = context.MyobItems.Where(x => checkoutIds.Any(y => x.itmItemID == y) && x.AccountProfileId == accountProfileId).ToList();
                        foreach (var item in pitems)
                        {
                            item.itmCheckout = true;
                        }
                        foreach (var item in mitems)
                        {
                            item.itmCheckout = true;
                        }
                        break;
                    default:
                    case CheckOutType.ItemSales:
                        List<RtlSale> saleslist = context.RtlSales.Where(x => checkoutIds.Any(y => x.rtsUID == y) && x.CompanyId == companyId).ToList();
                        foreach (var sales in saleslist)
                        {
                            sales.rtsCheckout = true;
                        }
                        break;
                }
                ModelHelper.WriteLog(context, string.Format("checkouttype:{0}; checkoutids:{1}", checkOutType, string.Join(",", checkoutIds)), "ExportFrmShop#checkoutIds");
                context.SaveChanges();
            }
        }



        private void WriteSupplierToABSS(int accountprofileId, int companyId, ref OnlineModeItem onlineModeItem, DataTransferModel dmodel)
        {
            using var context = new PPWDbContext();

            string ConnectionString = GetConnectionString(context, "READ_WRITE", apId, CompanyId);
            ModelHelper.GetDataTransferData(context, accountprofileId, companyId, CheckOutType.Suppliers, ref dmodel);

            List<string> columns = new List<string>();

            var sql = MyobHelper.InsertImportSupplierSql;
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
                string firstname = supplier.supIsOrganization ? "" : StringHandlingForSQL(supplier.supFirstName ?? supplier.supName);

                /*
                 * "CoLastName", "CardID", "CardStatus", "Address1Phone1", "CustomField3", "Address1Email", "PaymentIsDue", "DiscountDays", "BalanceDueDays", "Address1ContactName", "Address1AddressLine1", "Address1AddressLine2", "Address1AddressLine3", "Address1AddressLine4", "Address1Phone2", "Address1Phone3", "Address1City", "Address1Country", "Address1Website", "FirstName", "CurrencyCode", "BillingRate"
                 */

                //string address = StringHandleAddress(string.Concat(supplier.supAddrStreetLine1, supplier.supAddrStreetLine2, supplier.supAddrStreetLine3, supplier.supAddrStreetLine4));
                supplier.supAddrStreetLine1 = CommonHelper.StringHandleAddress(supplier.supAddrStreetLine1);
                supplier.supAddrStreetLine2 = CommonHelper.StringHandleAddress(supplier.supAddrStreetLine2);
                supplier.supAddrStreetLine3 = CommonHelper.StringHandleAddress(supplier.supAddrStreetLine3);
                supplier.supAddrStreetLine4 = CommonHelper.StringHandleAddress(supplier.supAddrStreetLine4);

                value = string.Format("(" + strcolumn + ")", StringHandlingForSQL(supplier.supName), StringHandlingForSQL(supplier.supCode), cardstatus, StringHandlingForSQL(supplier.supPhone), "", StringHandlingForSQL(supplier.supEmail), "", "", "", "", supplier.supAddrStreetLine1, supplier.supAddrStreetLine2, supplier.supAddrStreetLine3, supplier.supAddrStreetLine4, StringHandlingForSQL(supplier.supAddrPhone2), StringHandlingForSQL(supplier.supAddrPhone3), StringHandlingForSQL(supplier.supAddrCity), StringHandlingForSQL(supplier.supAddrCountry), StringHandlingForSQL(supplier.supAddrWeb), firstname);

                values.Add(value);
            }

            sql += string.Join(",", values) + ")";
            ModelHelper.WriteLog(context, sql, "ExportFrmShop#Supplier");
            onlineModeItem.checkoutIds = dmodel.CheckOutIds_Supplier;

            context.SaveChanges();

            using localhost.Dayends dayends = new localhost.Dayends();
            dayends.Url = ComInfo.WebServiceUrl;
            dayends.WriteMYOB(ConnectionString, sql);

        }

        private void WritePGCustomerToABSS(int AccountProfileId, ref OnlineModeItem onlineModeItem, DataTransferModel dmodel)
        {
            string sql = MyobHelper.InsertImportCustomer4ApprovalSql.Replace("0", "{0}");
            List<string> sqllist = new List<string>();

            using (var context = new PPWDbContext())
            {
                string ConnectionString = GetConnectionString(context, "READ_WRITE", AccountProfileId, CompanyId);
                ModelHelper.GetDataTransferData(context, AccountProfileId, CompanyId, CheckOutType.PGCustomers, ref dmodel);

                if (dmodel.CustomerList.Count > 0)
                {
                    List<string> values;
                    GetMyobSQL4Customer(context, out values, dmodel.CustomerList);

                    sql = string.Format(sql, string.Join(",", values));
                    sqllist.Add(sql);

                    using (localhost.Dayends dayends = new localhost.Dayends())
                    {
                        dayends.WriteMYOB(ConnectionString, sql);
                    }

                    ModelHelper.WriteLog(context, string.Join(",", sqllist), "ExportFrmShop");
                    onlineModeItem.checkoutIds = dmodel.CheckOutIds_Customer;

                    context.SaveChanges();
                }
            }
        }

        private static void GetMyobSQL4Customer(PPWDbContext context, out List<string> values, List<CustomerModel> customerlist)
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
                string street1ln1 = "";
                string street1ln2 = "";
                string street2ln1 = "";
                string street2ln2 = "";
                string street3ln1 = "";
                string street3ln2 = "";
                string street4ln1 = "";
                string street4ln2 = "";
                if (customer.AddressList != null && customer.AddressList.Count > 0)
                {
                    if (customer.AddressList[0] != null)
                    {
                        streetln1 = customer.AddressList[0].StreetLine1;
                        streetln2 = customer.AddressList[0].StreetLine2;
                        streetln1 = CommonHelper.StringToNarrow4SQL(string.Concat(streetln1, streetln2));
                    }
                    if (customer.AddressList[1] != null)
                    {
                        street1ln1 = customer.AddressList[1].StreetLine1;
                        street1ln2 = customer.AddressList[1].StreetLine2;
                        street1ln1 = CommonHelper.StringToNarrow4SQL(string.Concat(street1ln1, street1ln2));
                    }
                    if (customer.AddressList[2] != null)
                    {
                        street2ln1 = customer.AddressList[2].StreetLine1;
                        street2ln2 = customer.AddressList[2].StreetLine2;
                        street2ln1 = CommonHelper.StringToNarrow4SQL(string.Concat(street2ln1, street2ln2));
                    }
                    if (customer.AddressList[3] != null)
                    {
                        street3ln1 = customer.AddressList[3].StreetLine1;
                        street3ln2 = customer.AddressList[3].StreetLine2;
                        street3ln1 = CommonHelper.StringToNarrow4SQL(string.Concat(street3ln1, street3ln2));
                    }
                    if (customer.AddressList[4] != null)
                    {
                        street4ln1 = customer.AddressList[4].StreetLine1;
                        street4ln2 = customer.AddressList[4].StreetLine2;
                        street4ln1 = CommonHelper.StringToNarrow4SQL(string.Concat(street4ln1, street4ln2));
                    }
                }

                /*"CoLastName", "CardID", "CardStatus", "ItemPriceLevel", "InvoiceDelivery", "Address1Email", "Address1ContactName", "Address1AddressLine1", "Address1Phone1", "Address1Phone2", "Address1Phone3", "Address1City", "Address1Country", "Address1Website", "PaymentIsDue", "BalanceDueDays", "Address2Website"
                 */
                value = string.Format("(" + strcolumn + ")", CommonHelper.StringToNarrow4SQL(customer.cusName), StringHandlingForSQL(customer.cusCode), cardstatus, customer.iPriceLevel, deliverystatus, StringHandlingForSQL(customer.cusEmail), StringHandlingForSQL(customer.cusContact), streetln1, StringHandlingForSQL(customer.cusAddrPhone1), StringHandlingForSQL(customer.cusAddrPhone2), StringHandlingForSQL(customer.cusAddrPhone3), StringHandlingForSQL(customer.cusAddrCity), StringHandlingForSQL(customer.cusAddrCountry), StringHandlingForSQL(customer.cusAddrWeb), customer.PaymentIsDue, customer.Terms.BalanceDueDays, customer.cusPointsActive.ToString());
                values.Add(value);
            }
        }

        private void WriteMyobCustomerToABSS(int AccountProfileId, ref OnlineModeItem onlineModeItem, DataTransferModel dmodel)
        {
            string sql = MyobHelper.InsertImportCustomer4ApprovalSql.Replace("0", "{0}");
            List<string> sqllist = new List<string>();

            using (var context = new PPWDbContext())
            {
                string ConnectionString = GetConnectionString(context, "READ_WRITE", AccountProfileId, CompanyId);
                ModelHelper.GetDataTransferData(context, AccountProfileId, CompanyId, CheckOutType.MyobCustomers, ref dmodel);

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
                    onlineModeItem.checkoutIds = dmodel.CheckOutIds_Customer;
                    context.SaveChanges();
                }
            }
        }

        private void WriteVipToABSS()
        {
            string sql = ApprovalMode ? MyobHelper.InsertImportCustomerBasicSql4Approval : MyobHelper.InsertImportCustomerBasicSql;
            List<string> sqllist = new List<string>();

            using (var context = new PPWDbContext())
            {
                string ConnectionString = GetConnectionString(context, "READ_WRITE", AccountProfileId, CompanyId);
                List<string> columns = new List<string>();

                int colcount = ApprovalMode ? MyobHelper.ImportCustomerBasicColCount4Approval : MyobHelper.ImportCustomerBasicColCount;
                for (int j = 0; j < colcount; j++)
                {
                    columns.Add("'{" + j + "}'");
                }
                string strcolumn = string.Join(",", columns);

                List<string> values = new List<string>();

                var customerpointpricelevels = (
                from cp in context.CustomerPointPriceLevels
                join pl in context.PriceLevels
                on cp.PriceLevelID equals pl.PriceLevelID
                select new CustomerPointPriceLevelModel
                {
                    Id = cp.Id,
                    PriceLevelID = cp.PriceLevelID
                }
                ).ToList();

                if (VipList.Count > 0)
                {
                    var groupedviplist = VipList.GroupBy(x => x.cusCustomerID).ToList();

                    foreach (var group in groupedviplist)
                    {
                        var vip = group.FirstOrDefault();
                        if (customerpointpricelevels.Any(x => x.PriceLevelID == vip.cusPriceLevelID))
                        {
                            vip.iPriceLevel = customerpointpricelevels.FirstOrDefault(x => x.PriceLevelID == vip.cusPriceLevelID).Id - 1;
                        }
                        string value = "";
                        string deliverystatus = "A";
                        string cardstatus = vip.cusIsActive ? "N" : "Y";
                        value = ApprovalMode ? string.Format("(" + strcolumn + ")", StringHandlingForSQL(vip.cusName), StringHandlingForSQL(vip.cusCode), cardstatus, vip.iPriceLevel, deliverystatus, "", StringHandlingForSQL(vip.cusWhatsappPhoneNo)) : string.Format("(" + strcolumn + ")", StringHandlingForSQL(vip.cusName), StringHandlingForSQL(vip.cusCode), cardstatus, vip.iPriceLevel, deliverystatus, "");
                        values.Add(value);
                    }

                    sql += string.Join(",", values) + ")";

                    using (localhost.Dayends dayends = new localhost.Dayends())
                    {
                        dayends.WriteMYOB(ConnectionString, sql);
                    }

                    sqllist.Add(sql);

                    ModelHelper.WriteLog(context, string.Join(",", sqllist), "ExportFrmShop");
                    context.SaveChanges();
                }
            }
        }
        private string GetConnectionString(PPWDbContext context, string accesstype, int apId, int companyId)
        {
            return MYOBHelper.GetConnectionString(context, accesstype, apId, companyId);
        }
    }
}