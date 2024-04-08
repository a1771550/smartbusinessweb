using PPWDAL;
using PPWLib.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using ModelHelper = PPWLib.Helpers.ModelHelper;
using System.Threading.Tasks;
using System.Configuration;
using System.Net.Http;
using Newtonsoft.Json;
using CentralDataModel = PPWCommonLib.Models.CentralDataModel;
using ShopDataModel = PPWCommonLib.Models.ShopDataModel;
using CommonLib.Helpers;
using FileHelper = PPWCommonLib.CommonHelpers.FileHelper;
using ActionResult = System.Web.Mvc.ActionResult;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Data.Entity.Validation;
using System.Text;
using KingdeeLib.Models.ItemStock;
using KingdeeLib.Helpers;
using CommonLib.App_GlobalResources;
using CommonLib.BaseModels;
using System.Net.Mail;
using System.Net;
using PPWLib.Models.MYOB;
using PPWLib.Helpers;
using PPWLib.Models.Item;
using CommonLib.Models;
using PPWLib.Models.WholeSales;
using Dapper;
using PPWLib.Models.POS.Settings;
using System.Data.Entity;
using CustomerModel = PPWLib.Models.Customer.CustomerModel;
using System.Web;
using System.Data.Entity.Core.Objects;
using PPWLib.Models.Purchase.Supplier;
using PPWCommonLib.BaseModels;
using PPWLib.Models.Purchase;
using ItemModel = PPWLib.Models.Item.ItemModel;
using PPWLib.Models.User;
using CommonLib.Models.MYOB;

namespace SmartBusinessWeb.Controllers
{
    [AllowAnonymous]
    public class ApiController : Controller
    {
        private ComInfo ComInfo { get { return Session["ComInfo"] as ComInfo; } }
        private bool NonABSS { get { return ComInfo.DefaultCheckoutPortal.ToLower() == "nonabss"; } }
        private string ConnectionString { get { return string.Format(@"Driver={0};TYPE=MYOB;UID={1};PWD={2};DATABASE={3};HOST_EXE_PATH={4};NETWORK_PROTOCOL=NONET;DRIVER_COMPLETION=DRIVER_NOPROMPT;KEY={5};ACCESS_TYPE=READ;", ComInfo.MYOBDriver, ComInfo.MYOBUID, ComInfo.MYOBPASS, ComInfo.MYOBDb, ComInfo.MYOBExe, ComInfo.MYOBKey); } }
        private string CentralBaseUrl { get { return UriHelper.GetAppUrl(); } }
        private string CentralApiUrl { get { return ConfigurationManager.AppSettings["CentralApiUrl"]; } }
        private string CentralApiUrl4Receipt { get { return ConfigurationManager.AppSettings["CentralApiUrl4Receipt"]; } }
        private int PageSize { get { return ComInfo == null ? int.Parse(ConfigurationManager.AppSettings["PageLength"]) : (int)ComInfo.PageLength; } }
        private int AccountProfileId { get { return ComInfo == null ? int.Parse(ConfigurationManager.AppSettings["AccountProfileId"]) : (int)Session["AccountProfileId"]; } }
        private int apId { get { return AccountProfileId; } }
        private string DbName { get { return Session["DBName"].ToString(); } }
        private string CheckoutPortal { get { return ComInfo.DefaultCheckoutPortal; } }
        private string DefaultConnection { get { return Session["DBName"] == null ? ConfigurationManager.AppSettings["DefaultConnection"].Replace("_DBNAME_", "SmartBusinessWeb_db") : ConfigurationManager.AppSettings["DefaultConnection"].Replace("_DBNAME_", Session["DBName"].ToString()); } }
        private List<string> Shops;
        private string ShopCode { get; set; }

        public List<string> ShopNames;

        public ApiController()
        {
        }

        [HttpGet]
        public void GetAbssProducts(int apId)
        {
            Response.Write(apId);
        }

        [HttpGet]
        public void DownloadABSSData(int apId = 1)
        {
            using var context = new PPWDbContext(Session["DBName"].ToString());
            var comInfo = context.ComInfoes.AsNoTracking().FirstOrDefault(x => x.AccountProfileId == apId);
            int managerId = context.SysUsers.AsNoTracking().FirstOrDefault(x => x.AccountProfileId == apId && x.UserName == "Manager").surUID;
            string ConnectionString = string.Format(@"Driver={0};TYPE=MYOB;UID={1};PWD={2};DATABASE={3};HOST_EXE_PATH={4};NETWORK_PROTOCOL=NONET;DRIVER_COMPLETION=DRIVER_NOPROMPT;KEY={5};ACCESS_TYPE=READ;", comInfo.MYOBDriver, comInfo.MYOBUID, comInfo.MYOBPASS, comInfo.MYOBDb, comInfo.MYOBExe, comInfo.MYOBKey);
            string iLocked = "1";
            var file = comInfo.MYOBDb;
            FileInfo fileInfo = new FileInfo(file);
            string msg = "";
            if (fileInfo.Exists)
            {
                iLocked = CommonLib.Helpers.FileHelper.IsFileLocked(fileInfo) ? "1" : "0";
            }
            if (iLocked == "1")
            {
                msg = $"Hi {comInfo.contactName}, the ABSS file is being locked, making the ABSS Data Transfer job unsuccessful.";
                SendSimpleEmail(comInfo.contactEmail, comInfo.contactName, msg, "ABSS Data Transfer Failed", context, apId);
                ModelHelper.WriteLog(context, msg, "AutoABSSTransfer");
                return;
            }
            ModelHelper.SaveSuppliersFrmCentral(context, apId, comInfo);
            //ModelHelper.SaveEmployeesFrmCentral(apId, context, ConnectionString, null, managerId);
            ModelHelper.SaveCustomersFrmCentral(context, ConnectionString, apId, comInfo);
            ModelHelper.SaveItemsFrmCentral(apId, context, ConnectionString);

            msg = $"Hi {comInfo.contactName}, the ABSS data is successfully downloaded and saved to the SmartBusiness Database.";
            SendSimpleEmail(comInfo.contactEmail, comInfo.contactName, msg, "ABSS Data Transfer OK", context, apId);
            ModelHelper.WriteLog(context, msg, "AutoABSSTransfer");

            #region Dispose Connections           
            context.Dispose();
            #endregion
        }

        [HttpGet]
        public void UploadSBData(int apId = 1)
        {
            string msg = "";
            using var context = new PPWDbContext(Session["DBName"].ToString());
            var comInfo = context.ComInfoes.AsNoTracking().FirstOrDefault(x => x.AccountProfileId == apId);
            string ConnectionString = string.Format(@"Driver={0};TYPE=MYOB;UID={1};PWD={2};DATABASE={3};HOST_EXE_PATH={4};NETWORK_PROTOCOL=NONET;DRIVER_COMPLETION=DRIVER_NOPROMPT;KEY={5};ACCESS_TYPE=READ_WRITE;", comInfo.MYOBDriver, comInfo.MYOBUID, comInfo.MYOBPASS, comInfo.MYOBDb, comInfo.MYOBExe, comInfo.MYOBKey);

            using var connection = new SqlConnection(DefaultConnection);
            connection.Open();
            var JobList = connection.Query<MyobJobModel>(@"EXEC dbo.GetJobList @apId=@apId", new { apId }).ToList();
            var autoStockReport = connection.QueryFirstOrDefault<OtherSettingsView>(@"CheckEnableAutoStockReport @apId=@apId", new { apId });

            List<string> sqllist = new List<string>();


            #region Retail
            var checkoutIds4rt = new HashSet<long>();
            List<string> sqllist4rt = new List<string>();
            sqllist4rt = ModelHelper.Prepare4UploadSalesOrder(comInfo, apId, context, "", "", false, 2, JobList, ref checkoutIds4rt, true);
            #endregion

            #region WholeSales
            var checkoutIds4ws = new HashSet<long>();
            List<string> sqllist4ws = new List<string>();
            sqllist4ws = ModelHelper.Prepare4UploadSalesOrder(comInfo, apId, context, "", "", false, 2, JobList, ref checkoutIds4ws, false);
            #endregion

            #region Purchase
            var checkoutIds4po = new HashSet<long>();
            List<string> sqllist4po = new List<string>();
            sqllist4po = ModelHelper.Prepare4UploadPurchaseOrder(comInfo, apId, context, connection, "", "", false, ref checkoutIds4po);
            #endregion

            #region Write to MYOB
            sqllist.AddRange(sqllist4rt);
            sqllist.AddRange(sqllist4ws);
            sqllist.AddRange(sqllist4po);
            if (sqllist.Count > 0)
            {
                using (localhost.Dayends dayends = new localhost.Dayends())
                {
                    dayends.Url = comInfo.WebServiceUrl;
                    dayends.WriteMYOBBulk(ConnectionString, sqllist.ToArray());
                }
            }
            #endregion

            #region Write sqllist into Log & update checkoutIds
            if (sqllist4rt.Count > 0)
                WriteLogUpdateCheckoutIds(apId, context, ConnectionString, sqllist4rt, checkoutIds4rt, PosUploadType.Retail);
            if (sqllist4ws.Count > 0)
                WriteLogUpdateCheckoutIds(apId, context, ConnectionString, sqllist4ws, checkoutIds4ws, PosUploadType.WholeSales);
            if (sqllist4po.Count > 0)
                WriteLogUpdateCheckoutIds(apId, context, ConnectionString, sqllist4po, checkoutIds4po, PosUploadType.Purchase);
            #endregion

            #region Send DataTransfer Notification
            if (sqllist.Count > 0)
            {
                msg = $"Hi {comInfo.contactName}, the PreSalesModel and Purchase data is successfully uploaded to ABSS.";
                SendSimpleEmail(comInfo.contactEmail, comInfo.contactName, msg, "ABSS Data Transfer OK", context, apId);
            }
            #endregion


            #region Send Low-Stock Report
            if (autoStockReport.appVal == "1")
            {
                var stocks = context.GetLowStocks(apId).ToList();
                if (stocks.Count > 0)
                {
                    ModelHelper.GetShops(connection, ref Shops, ref ShopNames, apId);
                    var stocklist = "";
                    foreach (var shop in Shops)
                    {
                        var _stocks = stocks.Where(x => x.lstStockLoc.ToLower() == shop.ToLower()).ToList();
                        stocklist += $"<h3>{shop}</h3><hr>";
                        stocklist += "<ul>";
                        foreach (var stock in _stocks)
                        {
                            stocklist += $"<li>Item: {stock.lstItemCode} Qty: {stock.Qty}</li>";
                        }
                        stocklist += "</ul>";
                    }
                    msg = $"Hi {comInfo.contactName}, <p>Here is the report for those items with stock quantity lower than 5:</p> <div>{stocklist}</div>.";
                    SendSimpleEmail(comInfo.contactEmail, comInfo.contactName, msg, "Low-Qty Stock Report", context, apId);
                }
            }
            #endregion

            #region Dispose Connections
            connection.Close();
            connection.Dispose();
            context.Dispose();
            #endregion
        }

        private void WriteLogUpdateCheckoutIds(int apId, PPWDbContext context, string ConnectionString, List<string> sqllist, HashSet<long> checkoutIds, PosUploadType type)
        {
            StringBuilder sb = new StringBuilder();
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    ModelHelper.WriteLog(context, string.Format("Export {2} data From Shop done; sqllist:{0}; connectionstring:{1}", string.Join(",", sqllist), ConnectionString, type.ToString()), "ExportFrmShop");

                    switch (type)
                    {
                        case PosUploadType.WholeSales:
                            List<WholeSale> wslist = context.WholeSales.Where(x => x.AccountProfileId == apId && checkoutIds.Any(y => x.wsUID == y)).ToList();
                            foreach (var sales in wslist)
                            {
                                sales.wsCheckout = true;
                            }
                            context.SaveChanges();
                            break;
                        case PosUploadType.Purchase:
                            List<PPWDAL.Purchase> purchaselist = context.Purchases.Where(x => x.AccountProfileId == apId && checkoutIds.Any(y => x.Id == y)).ToList();
                            foreach (var purchase in purchaselist)
                            {
                                purchase.pstCheckout = true;
                            }
                            context.SaveChanges();
                            break;
                        default:
                        case PosUploadType.Retail:
                            List<RtlSale> saleslist = context.RtlSales.Where(x => x.AccountProfileId == apId && checkoutIds.Any(y => x.rtsUID == y)).ToList();
                            foreach (var sales in saleslist)
                            {
                                sales.rtsCheckout = true;
                            }
                            context.SaveChanges();
                            break;
                    }

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
                using var _context = new PPWDbContext(Session["DBName"].ToString());
                ModelHelper.WriteLog(_context, string.Format("Export PreSalesModel data From Shop failed: {0}; sql:{1}; connectionstring: {2}", sb, string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
            }
        }

        [HttpGet]
        public ActionResult UnsubscribeEblast(int cusid)
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                context.UnsubscribeEblast(apId, cusid);
                context.SaveChanges();
            }
            return Redirect("~/static/unsubscribe_zh.html");
        }

        /// <summary>
        /// Perform email tracking by receiving calls from an email-imbedded image. Get the following data from a URL with querystrings (something like 'http://192.168.123.54:9000/Track/3/22535/testemail/testemail/67456475/kevinlau@united.com.hk/12345/0/') and insert them into MSSQL Database.
        /// </summary>
        /// <param name="blastId"></param>
        /// <param name="contactId"></param>
        /// <param name="contactName"></param>
        /// <param name="organization"></param>
        /// <param name="phone"></param>
        /// <param name="email"></param>
        /// <param name="companyId"></param>
        /// <param name="imported"></param>
        [HttpGet]
        [AllowAnonymous]
        public void ViewTrack(string blastId, string contactId, string contactName, string organization, string phone, string email, string companyId, int imported)
        {
            var blast = eBlastEditModel.Get(int.Parse(blastId));
            using (var econtext = new PPWDbContext(Session["DBName"].ToString()))
            {
                string Id = CommonHelper.GenId();
                //Data Entity for email tracking, including each column of the table "eTracks"
                eTrack log = new eTrack
                {
                    Id = Id,
                    BlastId = blast.blSubject,
                    ContactId = contactId,
                    ContactName = contactName,
                    Organization = organization,
                    Phone = phone,
                    Email = email,
                    CompanyID = companyId,
                    Imported = imported,
                    ViewDate = DateTime.Now,
                    IP = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"],
                    CreateTime = DateTime.Now,
                    AccountProfileId = apId
                };
                //call EntityFramework to insert and save email tracking data into the database             
                econtext.eTracks.Add(log);
                econtext.SaveChanges();
            }
        }

        [HttpGet]
        public JsonResult GetSalesInfo()
        {
            using var connection = new SqlConnection(DefaultConnection);
            connection.Open();
            List<SalesmanModel> salesmanlist = connection.Query<SalesmanModel>(@"EXEC dbo.GetSalesmanList @apId=@apId", new { apId }).ToList();
            return Json(salesmanlist, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetJobs4Customer(string cusCode)
        {
            //GetJobs4Customer            
            using var connection = new SqlConnection(DefaultConnection);
            connection.Open();
            MyobJobModel model = connection.QueryFirstOrDefault<MyobJobModel>(@"EXEC dbo.GetJobs4Customer @apId=@apId,@cusCode=@cusCode", new { apId, cusCode });
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetSupplierInfo(string supCode)
        {
            SupplierModel model = SupplierEditModel.GetSupplierByCode(apId, supCode);
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult RemoveRecurOrder(int orderId)
        {
            string msg = Resource.Removed;
            using var context = new PPWDbContext(Session["DBName"].ToString());
            var order = context.WholeSales.FirstOrDefault(x => x.wsUID == orderId && x.wsType == "TP" && x.wsStatus != "DELETED");
            if (order != null)
            {
                order.wsStatus = "DELETED";
                context.SaveChanges();
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult GetRecurOrdersAjax(string cusCode, int pageIndex = 1, string sortName = "", string sortDirection = "", string keyword = "")
        {
            using var context = new PPWDbContext(Session["DBName"].ToString());
            var startIndex = CommonHelper.GetStartIndex(pageIndex, PageSize);
            keyword = keyword == "" ? keyword = null : keyword;
            var recordCount = context.WholeSales.Where(x => x.wsCusCode == cusCode && x.wsType == "TP" && x.wsStatus != "DELETED").Count();
            var recurringlist = context.GetRecurringOrderList2(ComInfo.Shop, cusCode, startIndex, PageSize, sortName, sortDirection, keyword).ToList();
            if (recurringlist.Count > 0)
            {
                List<RecurOrder> orderlist = new List<RecurOrder>();
                var groupedlist = recurringlist.GroupBy(x => x.wsCode).ToList();
                foreach (var group in groupedlist)
                {
                    string itemnamedesc = string.Join(",", group.Select(x => x.wslDesc).ToList());
                    var item = group.FirstOrDefault();
                    orderlist.Add(
                        new RecurOrder
                        {
                            wsUID = item.wsUID,
                            wsCode = item.wsCode,
                            IsRecurring = 1,
                            Name = item.wsRecurName,
                            TotalSalesAmt = (decimal)item.wsFinalTotal,
                            LastPostedDate = ((DateTime)item.ModifyTime).Date,
                            ItemsNameDesc = itemnamedesc,
                            wsDeliveryDate = (DateTime)item.wsDeliveryDate
                        }
                        );
                }
                return Json(new { orderlist, PageIndex = pageIndex, PageSize, RecordCount = recordCount });
            }
            else
            {
                return Json("");
            }

        }


        [HttpGet]
        public JsonResult GetWhatsAppMsg(int orderId)
        {
            //訂單 AL100098 (顧客 Chan Sek Hung ) 正在等待您的批准 (跟司機;商品行:1)。
            var msg = "";
            using var context = new PPWDbContext(Session["DBName"].ToString());
            var salesorder = context.WholeSales.Find(orderId);
            bool specialapproval = false;
            if (salesorder != null)
            {
                var customername = context.GetCustomerNameById1(apId, salesorder.wsCusID).FirstOrDefault();
                //var giftopval = (int)salesorder.rtsGiftOption;
                var remark = "";
                //if (giftopval == 1)
                //{
                //    remark += "跟司機";
                //}
                //if (giftopval == 2)
                //{
                //    remark += "跟Sales";
                //}
                //if (giftopval == 3)
                //{
                //    remark += "無贈品";
                //}
                //specialapproval = salesorder.rtsSpecialApproval != null && (bool)salesorder.rtsSpecialApproval;
                //if (specialapproval)
                //{
                //    remark += ";特批";
                //}
                msg = string.Concat("訂單 ", salesorder.wsCode, " (顧客 ", customername, " ) 正在等待您的批准 (", remark, ")");
            }
            return Json(new { msg, specialapproval }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult RespondPurchaseOrderReview(string type, string receiptno, string usercode = "", string rejectreason = "", int recreateOnVoid = 0)
        {
            List<SalesmanModel> AdminList = new List<SalesmanModel>();
            string msg = Resource.NoReceiptFound;
            SalesmanModel salesman = null;
            SupplierModel supplier = null;
            string url = "";
            SessUser user = Session["User"] as SessUser;
            bool enableSendMail = (bool)ComInfo.enableEmailNotification;

            if (string.IsNullOrEmpty(usercode))
            {
                usercode = user.UserCode;
            }
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                var purchaseorder = context.PurchaseOrderReviews.FirstOrDefault(x => x.PurchaseOrder.ToLower() == receiptno.ToLower());
                var purchase = context.Purchases.FirstOrDefault(x => x.pstCode.ToLower() == receiptno.ToLower());
                ShopCode = purchase.pstLocStock;

                var _supplier = context.MyobSuppliers.FirstOrDefault(x => x.supCode == purchase.supCode);
                supplier = new SupplierModel
                {
                    supName = _supplier.supName,
                    supId = _supplier.supId
                };

                switch (type)
                {
                    case "void":
                        if (purchaseorder != null)
                        {
                            purchaseorder.IsVoided = true;
                            purchaseorder.PassedToManager = false;
                            purchaseorder.IsApproved = false;
                            purchaseorder.IsRejected = false;
                            purchaseorder.ModifyTime = DateTime.Now;

                            string sendmsg = "";
                            if (recreateOnVoid == 1)
                            {
                                Dictionary<string, string> DicInvoice = new Dictionary<string, string>();
                                var newpurchasecode = ModelHelper.GetNewPurchaseCode(user, context);
                                ObjectParameter newId = new("newId", 0);
                                context.RecreateOrder4Void2(purchase.Id, newpurchasecode, user.UserName, newId, "purchase");
                                context.SaveChanges();

                                var admins = context.GetPosAdmin4Notification4(AccountProfileId, ShopCode).ToList();
                                foreach (var admin in admins)
                                {
                                    url = UriHelper.GetReviewPurchaseOrderUrl(ConfigurationManager.AppSettings["ReviewPurchaseOrderBaseUrl"], newpurchasecode, 0, admin.surUID);
                                    var key = string.Concat(admin.UserName, ":", admin.Email, ":", newpurchasecode);
                                    DicInvoice[key] = url;
                                    AdminList.Add(
                                        new SalesmanModel
                                        {
                                            UserName = admin.UserName,
                                            Email = admin.Email,
                                            Phone = admin.Phone,
                                            surUID = admin.surUID,
                                            UserCode = admin.UserCode
                                        }
                                        );
                                }

                                var adminnames = string.Join(",", admins.Select(x => x.UserName).ToList());
                                sendmsg = string.Format(Resource.NotificationEmailWillBeSentToFormat, adminnames);
                                #region Send Notification Email   
                                if (enableSendMail && ModelHelper.SendNotificationEmail(DicInvoice, 0, true))
                                {
                                    var _purchase = context.Purchases.FirstOrDefault(x => x.pstRefCode == receiptno);
                                    _purchase.pstSendNotification = true;
                                    context.SaveChanges();
                                }
                                #endregion
                            }

                            purchase.pstStatus = "VOIDED";
                            var purchaseItems = context.PurchaseItems.Where(x => x.pstCode == receiptno);
                            foreach (var purchaseItem in purchaseItems)
                            {
                                purchaseItem.piQty = 0;
                                purchaseItem.piStatus = "VOIDED";
                            }
                            ModelHelper.SetNewPurchaseCode(context, false);
                            context.SaveChanges();

                            msg = Resource.PurchaseOrderVoided;
                            if (recreateOnVoid == 1)
                            {
                                msg += "<br>" + sendmsg;
                            }
                        }
                        break;
                    case "pass":
                        if (purchaseorder != null)
                        {
                            purchaseorder.IsVoided = false;
                            purchaseorder.PassedToManager = true;
                            purchaseorder.IsApproved = false;
                            purchaseorder.IsRejected = false;
                            purchaseorder.ModifyTime = DateTime.Now;

                            purchase.pstStatus = "PASSED";
                            var purchaseItems = context.PurchaseItems.Where(x => x.pstCode == receiptno);
                            foreach (var purchaseItem in purchaseItems)
                            {
                                purchaseItem.piStatus = "PASSED";
                            }
                            context.SaveChanges();

                            msg = string.Format(Resource.FormatPassedToFormat, string.Concat(Resource.Invoice, " ", receiptno), Resource.SalesManager);

                            var salesmanager = context.GetPosSalesManager1(ComInfo.AccountProfileId).FirstOrDefault();
                            if (salesmanager != null)
                            {
                                var reviewurl = UriHelper.GetReviewPurchaseOrderUrl(ConfigurationManager.AppSettings["ReviewPurchaseOrderBaseUrl"], receiptno, salesmanager.surUID);
                                url = HttpUtility.UrlEncode(reviewurl);
                                Dictionary<string, string> DicInvoice = new Dictionary<string, string>();
                                DicInvoice[receiptno] = reviewurl;
                                salesman = new SalesmanModel();
                                salesman.surUID = salesmanager.surUID;
                                salesman.UserCode = salesmanager.UserCode;
                                salesman.UserName = salesmanager.UserName;
                                salesman.Email = salesmanager.Email;
                                salesman.Phone = salesmanager.Phone;

                                if (enableSendMail && SendNotificationEmail(DicInvoice, salesman, RespondType.PassToManager, rejectreason))
                                {
                                    purchaseorder = context.PurchaseOrderReviews.FirstOrDefault(x => x.PurchaseOrder.ToLower() == receiptno.ToLower());
                                    purchaseorder.EmailNotified = true;
                                    purchaseorder.ModifyTime = DateTime.Now;
                                    context.SaveChanges();
                                }
                            }
                        }
                        break;
                    case "reject":
                        if (purchaseorder != null)
                        {
                            purchaseorder.IsVoided = false;
                            purchaseorder.IsRejected = true;
                            purchaseorder.IsApproved = false;
                            purchaseorder.RejectedBy = usercode;
                            purchaseorder.ModifyTime = DateTime.Now;
                            purchaseorder.Reason = rejectreason;

                            purchase.pstStatus = "REJECTED";
                            var purchaseItems = context.PurchaseItems.Where(x => x.pstCode == receiptno);
                            foreach (var purchaseItem in purchaseItems)
                            {
                                purchaseItem.piStatus = "REJECTED";
                            }
                            context.SaveChanges();

                            var salesmanname = purchase.CreateBy;
                            //var ksalesmancode = purchase.wsKawadaUpldBy;
                            var __salesman = context.SysUsers.FirstOrDefault(x => x.UserName.ToLower() == salesmanname.ToLower() && x.surIsActive);
                            //var ksalesman = context.SysUsers.FirstOrDefault(x => x.AbssCardID.ToLower() == ksalesmancode.ToLower() && x.surIsAbss);
                            if (__salesman != null)
                            {
                                ///POSFunc/Search?receiptno={0}&amp;salesmanId={1}&amp;adminIds={2}&amp;ksalesmancode={3}  
                                string reviewurl = "";
                                var salesmanId = __salesman.surUID;
                                url = HttpUtility.UrlEncode(UriHelper.GetReviewPurchaseOrderUrl(ConfigurationManager.AppSettings["ReviewPurchaseOrderBaseUrl"], receiptno, salesmanId));
                                msg = string.Format(Resource.RejectedFormat, string.Concat(Resource.Invoice, " ", receiptno));

                                ///POSFunc/Purchase?receiptno={0}&amp;salesmanId={1}&amp;adminId={2}&amp;ksalesmancode={3}
                                reviewurl = UriHelper.GetReviewPurchaseOrderUrl(ConfigurationManager.AppSettings["ReviewPurchaseOrderBaseUrl"], receiptno, salesmanId, 0);
                                Dictionary<string, string> DicInvoice = new Dictionary<string, string>();
                                DicInvoice[receiptno] = reviewurl;
                                salesman = new SalesmanModel();

                                var _salesman = context.SysUsers.Find(salesmanId);
                                if (_salesman != null)
                                {
                                    salesman.surUID = _salesman.surUID;
                                    salesman.UserCode = _salesman.UserCode;
                                    salesman.UserName = _salesman.UserName;
                                    salesman.Email = _salesman.Email;
                                    salesman.Phone = _salesman.Phone;

                                    if (enableSendMail && SendNotificationEmail(DicInvoice, salesman, RespondType.Rejected, rejectreason))
                                    {
                                        purchaseorder = context.PurchaseOrderReviews.FirstOrDefault(x => x.PurchaseOrder.ToLower() == receiptno.ToLower());
                                        purchaseorder.EmailNotified = true;
                                        purchaseorder.ModifyTime = DateTime.Now;
                                        context.SaveChanges();
                                    }
                                }
                            }
                        }
                        break;
                    default:
                    case "approve":
                        if (purchaseorder != null)
                        {
                            purchaseorder.IsVoided = false;
                            purchaseorder.IsApproved = true;
                            purchaseorder.IsRejected = false;
                            purchaseorder.ApprovedBy = usercode;
                            purchaseorder.ModifyTime = DateTime.Now;
                            var salesmanname = purchase.CreateBy;
                            var __salesman = context.SysUsers.FirstOrDefault(x => x.UserName.ToLower() == salesmanname.ToLower() && x.surIsActive);
                            if (__salesman != null)
                            {
                                var salesmanId = __salesman.surUID;
                                url = HttpUtility.UrlEncode(UriHelper.GetReviewPurchaseOrderUrl(ConfigurationManager.AppSettings["ReviewPurchaseOrderBaseUrl"], receiptno, salesmanId, 0, null));
                                msg = string.Format(Resource.ApprovedFormat, string.Concat(Resource.Invoice, " ", receiptno));
                                context.SaveChanges();

                                purchase.pstStatus = "created";
                                var purchaseItems = context.PurchaseItems.Where(x => x.pstCode == receiptno);
                                foreach (var purchaseItem in purchaseItems)
                                {
                                    purchaseItem.piStatus = "created";
                                }
                                context.SaveChanges();

                                var _salesman = context.SysUsers.FirstOrDefault(x => x.UserName.ToLower() == purchase.CreateBy.ToLower());
                                salesman = new SalesmanModel
                                {
                                    surUID = _salesman.surUID,
                                    UserName = _salesman.UserName,
                                    Email = _salesman.Email,
                                    UserCode = _salesman.UserCode,
                                    Phone = _salesman.Phone
                                };
                                Dictionary<string, string> DicInvoice = new Dictionary<string, string>();
                                DicInvoice[receiptno] = url;
                                if (enableSendMail)
                                    SendNotificationEmail(DicInvoice, salesman, RespondType.Approved, null);
                            }
                        }
                        break;
                }
            }

            return Json(new { msg, salesman, url, supplier, AdminList });
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult RespondSalesOrderReview(string type, string receiptno, string usercode = "", string rejectreason = "", int recreateOnVoid = 0)
        {
            List<SalesmanModel> AdminList = new List<SalesmanModel>();
            string msg = Resource.NoReceiptFound;
            SalesmanModel salesman = null;
            CustomerModel customer = null;
            string url = "";
            SessUser user = Session["User"] as SessUser;
            bool enableSendMail = (bool)ComInfo.enableEmailNotification;

            if (string.IsNullOrEmpty(usercode))
            {
                usercode = user.UserCode;
            }
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                var salesorder = context.SalesOrderReviews.FirstOrDefault(x => x.SalesOrder.ToLower() == receiptno.ToLower());
                var sales = context.WholeSales.FirstOrDefault(x => x.wsCode.ToLower() == receiptno.ToLower());
                ShopCode = sales.wsSalesLoc;

                var _customer = context.MyobCustomers.FirstOrDefault(x => x.cusCode == sales.wsCusCode);
                customer = new CustomerModel
                {
                    cusName = _customer.cusName,
                    cusCustomerID = _customer.cusCustomerID
                };

                switch (type)
                {
                    case "void":
                        if (salesorder != null)
                        {
                            salesorder.IsVoided = true;
                            salesorder.PassedToManager = false;
                            salesorder.IsApproved = false;
                            salesorder.IsRejected = false;
                            salesorder.ModifyTime = DateTime.Now;

                            string sendmsg = "";
                            if (recreateOnVoid == 1)
                            {
                                Dictionary<string, string> DicInvoice = new Dictionary<string, string>();
                                var newsalescode = ModelHelper.GetNewWholeSalesCode(user, context);
                                ObjectParameter newId = new("newId", 0);
                                context.RecreateOrder4Void2(sales.wsUID, newsalescode, user.UserName, newId, "wholesales");
                                context.SaveChanges();

                                var admins = context.GetPosAdmin4Notification4(AccountProfileId, ShopCode).ToList();
                                foreach (var admin in admins)
                                {
                                    url = UriHelper.GetReviewSalesOrderUrl(ConfigurationManager.AppSettings["ReviewSalesOrderBaseUrl"], newsalescode, 0, admin.surUID);
                                    var key = string.Concat(admin.UserName, ":", admin.Email, ":", newsalescode);
                                    DicInvoice[key] = url;
                                    AdminList.Add(
                                        new SalesmanModel
                                        {
                                            UserName = admin.UserName,
                                            Email = admin.Email,
                                            Phone = admin.Phone,
                                            surUID = admin.surUID,
                                            UserCode = admin.UserCode
                                        }
                                        );
                                }

                                var adminnames = string.Join(",", admins.Select(x => x.UserName).ToList());
                                sendmsg = string.Format(Resource.NotificationEmailWillBeSentToFormat, adminnames);
                                #region Send Notification Email   
                                if (enableSendMail && ModelHelper.SendNotificationEmail(DicInvoice, 0, true))
                                {
                                    var _sales = context.WholeSales.FirstOrDefault(x => x.wsRefCode == receiptno);
                                    _sales.wsSendNotification = true;
                                    context.SaveChanges();
                                }
                                #endregion
                            }

                            sales.wsStatus = "VOIDED";
                            var saleslns = context.WholeSalesLns.Where(x => x.wslCode == receiptno);
                            foreach (var salesln in saleslns)
                            {
                                salesln.wslQty = 0;
                                salesln.wslStatus = "VOIDED";
                            }
                            ModelHelper.SetNewWholeSalesCode(context, false);
                            context.SaveChanges();

                            msg = Resource.InvoiceVoided;
                            if (recreateOnVoid == 1)
                            {
                                msg += "<br>" + sendmsg;
                            }
                        }
                        break;
                    case "pass":
                        if (salesorder != null)
                        {
                            salesorder.IsVoided = false;
                            salesorder.PassedToManager = true;
                            salesorder.IsApproved = false;
                            salesorder.IsRejected = false;
                            salesorder.ModifyTime = DateTime.Now;

                            sales.wsStatus = "PASSED";
                            var saleslns = context.WholeSalesLns.Where(x => x.wslCode == receiptno);
                            foreach (var salesln in saleslns)
                            {
                                salesln.wslStatus = "PASSED";
                            }
                            context.SaveChanges();

                            msg = string.Format(Resource.FormatPassedToFormat, string.Concat(Resource.Invoice, " ", receiptno), Resource.SalesManager);

                            var salesmanager = context.GetPosSalesManager1(ComInfo.AccountProfileId).FirstOrDefault();
                            if (salesmanager != null)
                            {
                                var reviewurl = UriHelper.GetReviewSalesOrderUrl(ConfigurationManager.AppSettings["ReviewSalesOrderBaseUrl"], receiptno, salesmanager.surUID);
                                url = HttpUtility.UrlEncode(reviewurl);
                                Dictionary<string, string> DicInvoice = new Dictionary<string, string>();
                                DicInvoice[receiptno] = reviewurl;
                                salesman = new SalesmanModel();
                                salesman.surUID = salesmanager.surUID;
                                salesman.UserCode = salesmanager.UserCode;
                                salesman.UserName = salesmanager.UserName;
                                salesman.Email = salesmanager.Email;
                                salesman.Phone = salesmanager.Phone;

                                if (enableSendMail && SendNotificationEmail(DicInvoice, salesman, RespondType.PassToManager, rejectreason))
                                {
                                    salesorder = context.SalesOrderReviews.FirstOrDefault(x => x.SalesOrder.ToLower() == receiptno.ToLower());
                                    salesorder.EmailNotified = true;
                                    salesorder.ModifyTime = DateTime.Now;
                                    context.SaveChanges();
                                }
                            }
                        }
                        break;
                    case "reject":
                        if (salesorder != null)
                        {
                            salesorder.IsVoided = false;
                            salesorder.IsRejected = true;
                            salesorder.IsApproved = false;
                            salesorder.RejectedBy = usercode;
                            salesorder.ModifyTime = DateTime.Now;
                            salesorder.Reason = rejectreason;

                            sales.wsStatus = "REJECTED";
                            var saleslns = context.WholeSalesLns.Where(x => x.wslCode == receiptno);
                            foreach (var salesln in saleslns)
                            {
                                salesln.wslStatus = "REJECTED";
                            }
                            context.SaveChanges();

                            var salesmanname = sales.CreateBy;
                            //var ksalesmancode = sales.wsKawadaUpldBy;
                            var __salesman = context.SysUsers.FirstOrDefault(x => x.AccountProfileId == apId && x.surIsActive && x.UserName.ToLower() == salesmanname.ToLower() && x.surIsActive);
                            //var ksalesman = context.SysUsers.FirstOrDefault(x => x.AbssCardID.ToLower() == ksalesmancode.ToLower() && x.surIsAbss);
                            if (__salesman != null)
                            {
                                ///POSFunc/Search?receiptno={0}&amp;salesmanId={1}&amp;adminIds={2}&amp;ksalesmancode={3}  
                                string reviewurl = "";
                                var salesmanId = __salesman.surUID;
                                url = HttpUtility.UrlEncode(UriHelper.GetReviewSalesOrderUrl(ConfigurationManager.AppSettings["ReviewSalesOrderBaseUrl"], receiptno, salesmanId));
                                msg = string.Format(Resource.RejectedFormat, string.Concat(Resource.Invoice, " ", receiptno));

                                ///POSFunc/Sales?receiptno={0}&amp;salesmanId={1}&amp;adminId={2}&amp;ksalesmancode={3}
                                reviewurl = UriHelper.GetReviewSalesOrderUrl(ConfigurationManager.AppSettings["ReviewSalesOrderBaseUrl"], receiptno, salesmanId, 0);
                                Dictionary<string, string> DicInvoice = new Dictionary<string, string>();
                                DicInvoice[receiptno] = reviewurl;
                                salesman = new SalesmanModel();

                                var _salesman = context.SysUsers.Find(salesmanId);
                                if (_salesman != null)
                                {
                                    salesman.surUID = _salesman.surUID;
                                    salesman.UserCode = _salesman.UserCode;
                                    salesman.UserName = _salesman.UserName;
                                    salesman.Email = _salesman.Email;
                                    salesman.Phone = _salesman.Phone;

                                    if (enableSendMail && SendNotificationEmail(DicInvoice, salesman, RespondType.Rejected, rejectreason))
                                    {
                                        salesorder = context.SalesOrderReviews.FirstOrDefault(x => x.SalesOrder.ToLower() == receiptno.ToLower());
                                        salesorder.EmailNotified = true;
                                        salesorder.ModifyTime = DateTime.Now;
                                        context.SaveChanges();
                                    }
                                }
                            }
                        }
                        break;
                    default:
                    case "approve":
                        if (salesorder != null)
                        {
                            salesorder.IsVoided = false;
                            salesorder.IsApproved = true;
                            salesorder.IsRejected = false;
                            salesorder.ApprovedBy = usercode;
                            salesorder.ModifyTime = DateTime.Now;
                            var salesmanname = sales.CreateBy;
                            var __salesman = context.SysUsers.FirstOrDefault(x => x.AccountProfileId == apId && x.surIsActive && x.UserName.ToLower() == salesmanname.ToLower() && x.surIsActive);
                            if (__salesman != null)
                            {
                                var salesmanId = __salesman.surUID;
                                url = HttpUtility.UrlEncode(UriHelper.GetReviewSalesOrderUrl(ConfigurationManager.AppSettings["ReviewSalesOrderBaseUrl"], receiptno, salesmanId, 0, null));
                                msg = string.Format(Resource.ApprovedFormat, string.Concat(Resource.Invoice, " ", receiptno));
                                context.SaveChanges();

                                sales.wsStatus = "created";
                                var saleslns = context.WholeSalesLns.Where(x => x.wslCode == receiptno);
                                foreach (var salesln in saleslns)
                                {
                                    salesln.wslStatus = "created";
                                }
                                context.SaveChanges();

                                var _salesman = context.SysUsers.FirstOrDefault(x => x.UserName.ToLower() == sales.CreateBy.ToLower());
                                salesman = new SalesmanModel
                                {
                                    surUID = _salesman.surUID,
                                    UserName = _salesman.UserName,
                                    Email = _salesman.Email,
                                    UserCode = _salesman.UserCode,
                                    Phone = _salesman.Phone
                                };
                                Dictionary<string, string> DicInvoice = new Dictionary<string, string>();
                                DicInvoice[receiptno] = url;
                                if (enableSendMail)
                                    SendNotificationEmail(DicInvoice, salesman, RespondType.Approved, null);
                            }
                        }
                        break;
                }
            }

            return Json(new { msg, salesman, url, customer, AdminList });
        }

        private static bool SendNotificationEmail(Dictionary<string, string> DicInvoice, SalesmanModel salesman, RespondType respondType, string rejectreason)
        {
            int okcount = 0;
            int ngcount = 0;

            EmailEditModel model = new EmailEditModel();
            var mailsettings = model.Get();

            MailAddress frm = new MailAddress(mailsettings.emEmail, mailsettings.emDisplayName);

            while (okcount == 0)
            {
                if (ngcount >= mailsettings.emMaxEmailsFailed || okcount > 0)
                {
                    break;
                }

                MailAddress to = new MailAddress(salesman.Email, salesman.UserName);
                bool addbc = int.Parse(ConfigurationManager.AppSettings["AddBccToDeveloper"]) == 1;
                MailAddress addressBCC = new MailAddress(ConfigurationManager.AppSettings["DeveloperEmailAddress"], ConfigurationManager.AppSettings["DeveloperEmailName"]);
                MailMessage message = new MailMessage(frm, to);
                if (addbc)
                {
                    message.Bcc.Add(addressBCC);
                }

                message.Subject = Resource.InvoicePending4Approval;
                message.BodyEncoding = Encoding.UTF8;
                message.IsBodyHtml = true;

                var lilist = "";
                foreach (var item in DicInvoice)
                {
                    lilist += $"<li><a href='{item.Value}' target='_blank'>{item.Key}</a></li>";
                }

                string mailbody = string.Empty;
                if (respondType == RespondType.Rejected)
                {
                    var rejectreasontxt = string.Format(Resource.ReasonForFormat, Resource.Reject);
                    mailbody = $"<h3>Hi {salesman.UserName}</h3><p>The following invoice is pending for your review:</p><ul>{lilist}</ul><h4>{rejectreasontxt}</h4><p>{rejectreason}</p>";
                }
                if (respondType == RespondType.PassToManager)
                {
                    mailbody = $"<h3>Hi {salesman.UserName}</h3><p>The following invoice is pending for your approval:</p><ul>{lilist}</ul>";
                }

                message.Body = mailbody;

                using (SmtpClient smtp = new SmtpClient(mailsettings.emSMTP_Server, mailsettings.emSMTP_Port))
                {
                    smtp.UseDefaultCredentials = false;
                    smtp.EnableSsl = mailsettings.emSMTP_EnableSSL;
                    smtp.Credentials = new NetworkCredential(mailsettings.emSMTP_UserName, mailsettings.emSMTP_Pass);
                    try
                    {
                        smtp.Send(message);
                        okcount++;
                    }
                    catch (Exception)
                    {
                        ngcount++;
                    }
                }
            }
            return okcount > 0;
        }

        private static bool SendSimpleEmail(string receiverEmail, string receiverName, string msg, string subject, PPWDbContext context, int apId)
        {
            int okcount = 0;
            int ngcount = 0;

            //EmailEditModel model = new EmailEditModel();
            //var mailsettings = model.Get();
            EmailSetting mailsettings = context.EmailSettings.FirstOrDefault(x => x.AccountProfileId == apId);
            MailAddress frm = new MailAddress(mailsettings.emEmail, mailsettings.emDisplayName);

            while (okcount == 0)
            {
                if (ngcount >= mailsettings.emMaxEmailsFailed || okcount > 0)
                {
                    break;
                }

                MailAddress to = new MailAddress(receiverEmail, receiverName);
                bool addbc = int.Parse(ConfigurationManager.AppSettings["AddBccToDeveloper"]) == 1;
                MailAddress addressBCC = new MailAddress(ConfigurationManager.AppSettings["DeveloperEmailAddress"], ConfigurationManager.AppSettings["DeveloperEmailName"]);
                MailMessage message = new MailMessage(frm, to);
                if (addbc)
                {
                    message.Bcc.Add(addressBCC);
                }

                message.Subject = subject;
                message.BodyEncoding = Encoding.UTF8;
                message.IsBodyHtml = true;

                message.Body = msg;

                using (SmtpClient smtp = new SmtpClient(mailsettings.emSMTP_Server, mailsettings.emSMTP_Port))
                {
                    smtp.UseDefaultCredentials = false;
                    smtp.EnableSsl = mailsettings.emSMTP_EnableSSL;
                    smtp.Credentials = new NetworkCredential(mailsettings.emSMTP_UserName, mailsettings.emSMTP_Pass);
                    try
                    {
                        smtp.Send(message);
                        okcount++;
                    }
                    catch (Exception)
                    {
                        ngcount++;
                    }
                }
            }
            return okcount > 0;
        }

        [HttpGet]
        public JsonResult GetRecurOrder(long orderId)
        {
            WholeSalesView sales = null;
            List<WholeSalesLnModel> wslns = null;
            using var context = new PPWDbContext(Session["DBName"].ToString());
            var s = context.WholeSales.Find(orderId);
            if (s != null)
            {
                SessUser user = Session["User"] as SessUser;
                //var customer = context.MyobCustomers.FirstOrDefault(x => x.cusCustomerID == s.rtsCusID);
                DeviceModel dev = Session["Device"] as DeviceModel;
                Device device = context.Devices.Find(dev.dvcUID);
                //$"{device.dvcNextPurchaseNo:000000}"
                string nextsalescode = ModelHelper.GetNewSalesCode(user, context);
                sales = new WholeSalesView
                {
                    wsUID = s.wsUID,
                    wsSalesLoc = s.wsSalesLoc,
                    wsDvc = s.wsDvc,
                    wsType = s.wsType,
                    wsCode = nextsalescode,
                    wsDate = s.wsDate,
                    wsTime = s.wsTime,
                    wsLineTotal = s.wsLineTotal,
                    wsLineTotalPlusTax = s.wsLineTotalPlusTax,
                    wsFinalDisc = s.wsFinalDisc,
                    wsFinalDiscAmt = s.wsFinalDiscAmt,
                    wsFinalTotal = s.wsFinalTotal,
                    wsMonthBase = s.wsMonthBase,
                    wsRemark = s.wsRemark,
                    wsRefCode = s.wsCode,
                    wsCusID = s.wsCusID,
                    wsSaleComment = s.wsSaleComment,
                    wsCustomerPO = s.wsCustomerPO,
                    wsDeliveryAddressId = s.wsDeliveryAddressId,
                };

                var customergroup = context.GetCustomer4ApprovalByCusCode2(apId, s.wsCusCode).ToList().GroupBy(x => x.cusCustomerID).ToList(); //one customer may have multiple addresses
                CustomerModel Customer = null;
                foreach (var group in customergroup)
                {
                    var customer = group.FirstOrDefault();
                    Customer = new CustomerModel
                    {
                        cusCustomerID = customer.cusCustomerID,
                        cusCode = customer.cusCode,
                        cusName = customer.cusName,
                        cusPriceLevelID = customer.cusPriceLevelID,
                        cusPointsSoFar = customer.cusPointsSoFar == null ? 0 : (int)customer.cusPointsSoFar,
                        cusPointsUsed = customer.cusPointsUsed == null ? 0 : (int)customer.cusPointsUsed,
                        cusPhone = customer.cusPhone,
                        cusPriceLevelDescription = customer.cusPriceLevelID == "" ? "" : ModelHelper.GetCustomerPriceLevelDescription(context, customer.cusPriceLevelID),
                        cusContact = customer.cusContact,
                        cusSaleComment = customer.cusSaleComment,
                        BRExpiryDate = customer.BRExpiryDate,
                        BRNo = customer.BRNo,
                        AbssSalesID = customer.AbssSalesID,
                        cusAddrWeb = customer.cusAddrWeb,
                    };

                    Customer.AddressList = new List<AddressView>();
                    //ci.StreetLine1,ci.StreetLine2,ci.StreetLine3,ci.StreetLine4,ci.City,ci.State,ci.Postcode,ci.Country,ci.Phone1,ci.Phone2,ci.Phone3
                    foreach (var g in group)
                    {
                        Customer.AddressList.Add(
                            new AddressView
                            {
                                Id = (long)g.Id,
                                StreetLine1 = g.StreetLine1,
                                StreetLine2 = g.StreetLine2,
                                StreetLine3 = g.StreetLine3,
                                StreetLine4 = g.StreetLine4,
                                City = g.City,
                                State = g.State,
                                Country = g.Country,
                                Postcode = g.Postcode,
                                Phone1 = g.Phone1,
                                Phone2 = g.Phone2,
                                Phone3 = g.Phone3
                            }
                            );
                    }
                }

                sales.Customer = Customer;

                var saleslns = context.WholeSalesLns.Where(x => x.wslCode == s.wsCode).ToList();
                wslns = new List<WholeSalesLnModel>();
                foreach (var sl in saleslns)
                {
                    var item = context.MyobItems.FirstOrDefault(x => x.itmCode == sl.wslItemCode);
                    wslns.Add(
                        new WholeSalesLnModel
                        {
                            wslItemCode = sl.wslItemCode,
                            wslUID = sl.wslUID,
                            wslCode = sl.wslCode,
                            wslTaxPc = sl.wslTaxPc,
                            wslRrpTaxIncl = sl.wslRrpTaxIncl,
                            wslRrpTaxExcl = sl.wslRrpTaxExcl,
                            wslLineDiscAmt = sl.wslLineDiscAmt,
                            wslLineDiscPc = sl.wslLineDiscPc,
                            dLineDiscPc = sl.wslLineDiscPc == null ? 0 : (double)sl.wslLineDiscPc,
                            wslSalesAmt = (decimal)sl.wslSalesAmt,
                            wslTaxAmt = sl.wslTaxAmt,
                            dLineSalesAmt = (double)sl.wslSalesAmt,

                            dPrice = (double)sl.wslSellingPrice,
                            wslDate = sl.wslDate,
                            wslSalesLoc = sl.wslSalesLoc,

                            wslSellingPrice = sl.wslSellingPrice,
                            CustomerID = s.wsCusID ?? 0,
                            CustomerCode = s.wsCusCode,
                            wslRefSales = sl.wslRefSales,
                            SalesPersonName = s.CreateBy.ToUpper(),
                            wslDesc = sl.wslDesc,

                            wslHasSerialNo = sl.wslHasSerialNo,
                            wslBatchCode = sl.wslBatchCode,
                            wslSeq = sl.wslSeq,
                            wslQty = sl.wslQty,
                            wslSellingPriceMinusInclTax = sl.wslSellingPriceMinusInclTax,

                            Item = new ItemModel
                            {
                                itmCode = item.itmCode,
                                itmName = item.itmName,
                                itmDesc = item.itmDesc,
                                itmUseDesc = item.itmUseDesc,
                                itmBaseSellingPrice = item.itmBaseSellingPrice,
                                itmBaseUnit = item.itmBaseUnit,
                                itmBaseUnitPrice = item.itmBaseUnitPrice,
                                itmLastSellingPrice = item.itmLastSellingPrice,
                                itmSellUnit = item.itmSellUnit,
                            }
                        }
                        );
                }
            }

            return Json(new { sales, wslns }, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetItemsByCategories(string catIds)
        {
            using var connection = new SqlConnection(DefaultConnection);
            connection.Open();
            List<ItemModel> itemlist = connection.Query<ItemModel>(@"EXEC dbo.GetItemsByCategories @catIds=@catIds", new { catIds }).ToList();
            return Json(itemlist, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetExRateList()
        {
            var exmodel = new ExchangeRateEditModel();
            return Json(exmodel.ExRateList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult PostTest(List<City> cities)
        {
            var citylist = new List<City>();
            foreach (var city in cities)
            {
                citylist.Add(new City
                {
                    Id = city.Id,
                    Name = city.Name + "_test",
                });
            }
            return Json(citylist);
        }

        [HttpPost]
        public JsonResult GetItemVariByAttrs(List<ItemAttributeModel> iattrlist)
        {
            ItemModel myobItem = new ItemModel();
            using var context = new PPWDbContext(Session["DBName"].ToString());
            string itemcode = iattrlist[0].itmCode;
            List<string> comboIvIds = new List<string>();
            string comboIvId = string.Empty;
            foreach (var attr in iattrlist)
            {
                var _iv = context.ItemVariations.FirstOrDefault(x => x.itmCode == itemcode && x.comboIvId == null && x.iaName == attr.iaName && x.iaValue == attr.iaValue && x.AccountProfileId == AccountProfileId);
                if (_iv != null)
                {
                    comboIvIds.Add(_iv.Id.ToString());
                }
            }
            comboIvId = string.Join("|", comboIvIds);
            using var connection = new SqlConnection(DefaultConnection);
            connection.Open();
            var currentIV = connection.QueryFirstOrDefault<ItemVariModel>(@"EXEC dbo.GetItemVari @itemcode=@itemcode,@comboIvId=@comboIvId,@apId=@apId", new { itemcode, comboIvId, apId = AccountProfileId });

            ModelHelper.GetShops(connection, ref Shops, ref ShopNames, apId);

            if (currentIV != null)
            {
                currentIV = ModelHelper.PopulateIV(Shops, context, itemcode, currentIV);
                return Json(new { currentIV });
            }
            else
            {
                myobItem = connection.QueryFirstOrDefault<ItemModel>(@"EXEC dbo.GetMyobItemByCode @itemcode=@itemcode,@apId=@apId", new { itemcode, apId = AccountProfileId });
                ModelHelper.GetLocStock4MyobItem(context, itemcode, Shops, ref myobItem);
                ModelHelper.GetMyobItemPrices(context, itemcode, ref myobItem);
                return Json(new { myobItem });
            }
        }

        [HttpPost]
        public JsonResult JsonTest()
        {
            var obj = new { name = "Kevin Lau", gender = "M" };
            return Json(obj);
        }

        [HttpGet]
        public string ApiTest()
        {
            var obj = new City { Id = 1, Name = "New York" };
            string strobj = System.Text.Json.JsonSerializer.Serialize(obj);
            return strobj;
        }


        [HttpGet]
        public JsonResult GetItemOptionsByCodes(string itemcodes)
        {
            using var context = new PPWDbContext(Session["DBName"].ToString());
            var itemoptions = context.GetItemOptionsByItemCodes6(AccountProfileId, itemcodes).ToList();
            var dicItemOptions = new Dictionary<string, ItemOptions>();
            if (itemoptions.Count > 0)
            {
                foreach (var itemoption in itemoptions)
                {
                    dicItemOptions[itemoption.itmCode] = new ItemOptions
                    {
                        ChkBatch = (bool)itemoption.chkBat,
                        ChkSN = (bool)itemoption.chkSN,
                        WillExpire = (bool)itemoption.chkVT
                    };
                }
            }
            return Json(dicItemOptions, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Angular()
        {
            List<City> cities = new();
            cities.Add(new City()
            {
                Id = 1,
                Name = "test1"
            }
            );
            cities.Add(new City()
            {
                Id = 2,
                Name = "test2"
            });
            return Json(cities, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult UpdateItemBuySellUnit(ItemModel item)
        {
            var msg = string.Format(Resource.Saved, Resource.Item);
            if (item != null)
                ItemEditModel.UpdateBuySellUnit(item);
            return Json(msg);
        }



        [HttpGet]
        public JsonResult GetContactNamesByIds(string contactIds)
        {
            using var context = new PPWDbContext(Session["DBName"].ToString());
            //var contactIdList = string.Join(",", contactIds);
            var contactnames = string.Join(",", context.GetContactNamesByIds(contactIds).ToList());
            return Json(contactnames, JsonRequestBehavior.AllowGet);
        }


        [HandleError]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DoImportFrmABSSAsync()
        {
            //string msg = Resources.Resource.ImportDoneMsg;
            string url = "";
            string dsn = "";
            int accountprofileId = 0;
            string filename = "Customers_";
            var dateTime = DateTime.Now;
            using (var context = new PPWDbContext(Session["DBName"].ToString()))//must be done here! don't merge with the one below!!!
            {
                Session currsess = ModelHelper.GetCurrentSession(context);
                accountprofileId = currsess.AccountProfileId;
                var accountProfileView = ModelHelper.GetAccountProfile(accountprofileId, context);
                dsn = accountProfileView.DsnName;
            }
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                url = string.Format(CentralApiUrl, filename, CentralBaseUrl);
                HttpClient _client = new HttpClient();
                _client.MaxResponseContentBufferSize = int.MaxValue;
                var content = await _client.GetStringAsync(url);
                var cuslist = JsonConvert.DeserializeObject<List<CommonLib.Models.MYOB.MYOBCustomerModel>>(content);
                var currentcodelist = string.Join(",", cuslist.Select(x => x.CardIdentification).ToList());
                StringBuilder sb = new StringBuilder();
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        context.RemoveAbssContacts();
                        context.SaveChanges();

                        List<Contact> newcontacts = new List<Contact>();
                        foreach (var customer in cuslist)
                        {
                            Contact contact = new Contact();
                            contact.cusIsOrganization = customer.IsIndividual == 'N';
                            contact.cusFirstName = customer.FirstName;
                            contact.cusIsActive = customer.IsInactive == 'N';
                            contact.cusPhone = contact.cusCode = customer.CardIdentification.StartsWith("*") ? (customer.AddressList.Count > 0 ? customer.AddressList[0].Phone1 : customer.CardRecordID.ToString()) : customer.CardIdentification;
                            contact.cusName = customer.Name ?? customer.LastName;
                            contact.CreateTime = dateTime;
                            contact.ModifyTime = dateTime;
                            contact.AccountProfileId = accountprofileId;
                            contact.cusABSS = true;

                            if (customer.AddressList.Count > 0)
                            {
                                contact.cusAddrLocation = customer.AddressList[0].Location;
                                contact.cusContact = customer.AddressList[0].ContactName;
                                contact.cusAddrPhone1 = customer.AddressList[0].Phone1;
                                contact.cusEmail = customer.AddressList[0].Email;
                                contact.cusAddrWeb = customer.AddressList[0].WWW;
                                contact.cusAddrCity = customer.AddressList[0].City;
                                contact.cusAddrCountry = customer.AddressList[0].Country;
                                contact.cusAddrStreetLine1 = customer.AddressList[0].StreetLine1;
                                contact.cusAddrStreetLine2 = customer.AddressList[0].StreetLine2;
                                contact.cusAddrStreetLine3 = customer.AddressList[0].StreetLine3;
                                contact.cusAddrStreetLine4 = customer.AddressList[0].StreetLine4;
                            }

                            newcontacts.Add(contact);

                            if (customer.AddressList.Count > 0)
                            {
                                var locationId = customer.AddressList[0].Location;
                                var cuscode = customer.CardIdentification;
                                List<CustomerInfo4Abss> cusinfos = context.CustomerInfo4Abss.Where(x => x.AccountProfileId == accountprofileId && x.cusAddrLocation == locationId && x.cusCode == cuscode).ToList();
                                context.CustomerInfo4Abss.RemoveRange(cusinfos);
                                context.SaveChanges();

                                foreach (var addr in customer.AddressList)
                                {
                                    CustomerInfo4Abss customerInfo = new CustomerInfo4Abss
                                    {
                                        cusCode = customer.CardIdentification,
                                        AccountProfileId = accountprofileId,
                                        cusAddrLocation = addr.Location,
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
                                    context.CustomerInfo4Abss.Add(customerInfo);
                                }
                            }

                        }
                        context.Contacts.AddRange(newcontacts);
                        context.SaveChanges();
                        ModelHelper.WriteLog(context, "Import Customer data from Central done", "ImportFrmCentral");

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
                    using var _context = new PPWDbContext(Session["DBName"].ToString());
                    ModelHelper.WriteLog(_context, string.Format("Import Customer data from Central failed:{0}", sb.ToString()), "ExportFrmCentral");
                }

            }
            return RedirectToAction("ImportFrmABSS", "Contact", new { done = 1 });
        }



        [HttpGet]
        public JsonResult SearchCustomer(string type, string[] parameters)
        {
            var columns = "cusName,cusFirstName,cusIsOrganization";
            if (type == "emailphone")
            {
                var sql = $"Select {columns} From Customer Where cusEmail=@email and cusPhone=@phone";
                using (var context = new PPWDbContext(Session["DBName"].ToString()))
                {
                    var customer = context.Database.SqlQuery<CustomerModel>(sql, new SqlParameter("email", parameters[0]), new SqlParameter("phone", parameters[1])).FirstOrDefault();
                    return Json(customer, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                var searchcol = type == "email" ? "cusEmail" : "cusPhone";
                var sql = $"Select {columns} From Customer Where {searchcol}=@{type}";
                using (var context = new PPWDbContext(Session["DBName"].ToString()))
                {
                    var customer = context.Database.SqlQuery<CustomerModel>(sql, new SqlParameter(type, parameters[0])).FirstOrDefault();
                    return Json(customer, JsonRequestBehavior.AllowGet);
                }
            }

        }


        [HttpGet]
        public JsonResult SearchContact(string type, string[] parameters)
        {
            CustomerModel customer = new CustomerModel();
            //var columns = "cusName,cusFirstName,cusIsOrganization,cusContact";
            if (type == "emailphone")
            {
                //var sql = $"Select {columns} From MyobCustomer Where cusEmail=@email and cusPhone=@phone";
                using (var context = new PPWDbContext(Session["DBName"].ToString()))
                {
                    //var customer = context.Database.SqlQuery<CustomerModel>(sql, new SqlParameter("email", parameters[0]), new SqlParameter("phone", parameters[1])).FirstOrDefault();
                    var _customer = context.SearchContactByEmailPhone(parameters[0], parameters[1]).FirstOrDefault();
                    if (_customer != null)
                    {
                        customer.cusName = _customer.cusName;
                        customer.cusFirstName = _customer.cusFirstName;
                        customer.cusIsOrganization = _customer.cusIsOrganization;
                        customer.cusContact = _customer.cusContact;
                    }
                    return Json(customer, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                //var searchcol = type == "email" ? "cusEmail" : "cusPhone";
                //var sql = $"Select {columns} From MyobCustomer Where {searchcol}=@{type}";
                using (var context = new PPWDbContext(Session["DBName"].ToString()))
                {
                    //var customer = context.Database.SqlQuery<CustomerModel>(sql, new SqlParameter(type, parameters[0])).FirstOrDefault();
                    if (type == "email")
                    {
                        var _customer = context.SearchContactByEmail(parameters[0]).FirstOrDefault();
                        if (_customer != null)
                        {
                            customer.cusName = _customer.cusName;
                            customer.cusFirstName = _customer.cusFirstName;
                            customer.cusIsOrganization = _customer.cusIsOrganization;
                            customer.cusContact = _customer.cusContact;
                        }
                    }
                    else
                    {
                        var _customer = context.SearchContactByPhone(parameters[0]).FirstOrDefault();
                        if (_customer != null)
                        {
                            customer.cusName = _customer.cusName;
                            customer.cusFirstName = _customer.cusFirstName;
                            customer.cusIsOrganization = _customer.cusIsOrganization;
                            customer.cusContact = _customer.cusContact;
                        }
                    }

                    return Json(customer, JsonRequestBehavior.AllowGet);
                }
            }
        }



        [HttpGet]
        public JsonResult GetStaffDetail(int staffId)
        {
            //UserEditModel userEditModel = new UserEditModel();
            UserModel model = UserEditModel.Get(staffId);
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public void UpdateCentralPosDevice(string jsondevicelist, string accountprofileId)
        {
            //using (var context = new G3CentralDbContext())
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                var apId = Convert.ToInt32(accountprofileId);
                var devices = context.Devices.Where(x => x.dvcIsActive == true && x.AccountProfileId == apId).ToList();

                List<DeviceModel> devicelist = JsonConvert.DeserializeObject<List<DeviceModel>>(jsondevicelist);
                foreach (var _device in devices)
                {
                    foreach (var d in devicelist)
                    {
                        if (_device.dvcShop.ToLower() == d.dvcShop.ToLower() && _device.dvcCode.ToLower() == d.dvcCode.ToLower())
                        {
                            _device.dvcIsActive = d.dvcIsActive;
                            _device.dvcNextRtlSalesNo = d.dvcNextRtlSalesNo;
                            _device.dvcNextRefundNo = d.dvcNextRefundNo;
                            _device.dvcNextDepositNo = d.dvcNextDepositNo;
                            _device.dvcModifyTime = DateTime.Now;
                        }
                    }
                }

                context.SaveChanges();
            }
        }


        [HttpGet]
        public JsonResult GetCentralPosData(string receiptno, string phoneno, int lang)
        {
            //using (var context = new G3CentralDbContext())
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                CentralDataModel model = getReceiptData(context, receiptno, phoneno, lang);
                if (model.hassales)
                {
                    if (model.toBeRefunded <= 0)
                    {
                        model.noreceiptFound = 0;
                        model.alreadyRefunded = 1;
                        return Json(model, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        if (model.hascustomer)
                        {
                            return Json(model, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            model.noreceiptFound = 1;
                            return Json(model, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
                else
                {
                    model.noreceiptFound = 1;
                    return Json(model, JsonRequestBehavior.AllowGet);
                }
            }
        }



        [HttpGet]
        public JsonResult GetShopData(string device, string shop, string filename, string strfrmdate, string strtodate, int lang, int accountProfileId)
        {
            if (filename.StartsWith("ItemSales_"))
            {
                device = device.ToLower();
                shop = shop.ToLower();

                List<SerialNoView> SerialNoList = new List<SerialNoView>();
                List<SalesModel> SalesList = new List<SalesModel>();
                List<SalesLnView> SalesLnViews = new List<SalesLnView>();
                List<PayView> PayList = new List<PayView>();
                List<PayLnView> PayLnViews = new List<PayLnView>();
                List<ItemModel> StockList = new List<ItemModel>();

                using (var context = new PPWDbContext(Session["DBName"].ToString()))
                {
                    string accountno = context.ComInfoes.FirstOrDefault().comAccountNo;
                    int year = DateTime.Now.Year;

                    DateTime frmdate;
                    DateTime todate;
                    if (string.IsNullOrEmpty(strfrmdate))
                    {
                        frmdate = new DateTime(year, 1, 1);
                    }
                    else
                    {
                        int mth = int.Parse(strfrmdate.Split('-')[1]);
                        int day = int.Parse(strfrmdate.Split('-')[0]);
                        year = int.Parse(strfrmdate.Split('-')[2]);
                        frmdate = new DateTime(year, mth, day);
                    }
                    if (string.IsNullOrEmpty(strtodate))
                    {
                        todate = new DateTime(year, 12, 31);
                    }
                    else
                    {
                        int mth = int.Parse(strtodate.Split('-')[1]);
                        int day = int.Parse(strtodate.Split('-')[0]);
                        year = int.Parse(strtodate.Split('-')[2]);
                        todate = new DateTime(year, mth, day);
                    }

                    Dictionary<string, string> DicPayTypes = new Dictionary<string, string>();
                    DicPayTypes = PPWCommonLib.CommonHelpers.ModelHelper.GetDicPayTypes(lang, false, context);
                    SalesList = (from s in context.RtlSales
                                 where s.rtsDate >= frmdate && s.rtsDate <= todate && s.rtsSalesLoc.ToLower() == shop && s.rtsDvc.ToLower() == device
                                 && s.AccountProfileId == accountProfileId
                                 select new SalesModel
                                 {
                                     rtsUID = s.rtsUID,
                                     rtsSalesLoc = s.rtsSalesLoc,
                                     rtsDvc = s.rtsDvc,
                                     rtsCode = s.rtsCode,
                                     rtsRefCode = s.rtsRefCode,
                                     rtsType = s.rtsType,
                                     rtsStatus = s.rtsStatus,
                                     rtsDate = s.rtsDate,
                                     rtsTime = s.rtsTime,
                                     rtsCusID = s.rtsCusID,
                                     rtsLineTotal = s.rtsLineTotal,
                                     rtsLineTotalPlusTax = s.rtsLineTotalPlusTax,
                                     rtsFinalDisc = s.rtsFinalDisc,
                                     rtsFinalDiscAmt = s.rtsFinalDiscAmt,
                                     rtsFinalTotal = s.rtsFinalTotal,
                                     rtsRmks = s.rtsRmks,
                                     rtsRmksOnDoc = s.rtsRmksOnDoc,
                                     rtsMonthBase = s.rtsMonthBase,
                                     rtsCheckout = s.rtsCheckout,
                                     rtsLineTaxAmt = s.rtsLineTaxAmt,
                                     Lang = lang,
                                 }
                                ).ToList();
                    foreach (var sales in SalesList)
                    {
                        sales.DicPayTypes = DicPayTypes;
                    }

                    PayList = (from p in context.RtlPays
                               where p.rtpDate >= frmdate && p.rtpDate <= todate && p.rtpDvc.ToLower() == device && p.rtpSalesLoc.ToLower() == shop
                               && p.AccountProfileId == accountProfileId
                               select new PayView
                               {
                                   rtpSalesLoc = p.rtpSalesLoc,
                                   rtpDvc = p.rtpDvc,
                                   rtpCode = p.rtpCode,
                                   rtpDate = p.rtpDate,
                                   rtpTime = p.rtpTime,
                                   rtpSeq = p.rtpSeq,
                                   rtpTxType = p.rtpTxType,
                                   rtpPayAmt = p.rtpPayAmt,
                                   rtpRoundings = p.rtpRoundings,
                                   rtpChange = p.rtpChange,
                               }).ToList();

                    SalesLnViews = (from sl in context.RtlSalesLns
                                    join s in context.RtlSales
                                    on sl.rtlCode equals s.rtsCode
                                    where s.rtsDate >= frmdate && s.rtsDate <= todate && s.rtsSalesLoc.ToLower() == shop && s.rtsDvc.ToLower() == device
                                    && s.AccountProfileId == accountProfileId
                                    select new SalesLnView
                                    {
                                        rtlUID = sl.rtlUID,
                                        rtlSalesLoc = sl.rtlSalesLoc,
                                        rtlDvc = sl.rtlDvc,
                                        rtlCode = sl.rtlCode,
                                        rtlDate = sl.rtlDate,
                                        rtlSeq = sl.rtlSeq,
                                        rtlRefSales = sl.rtlRefSales,
                                        rtlItemCode = sl.rtlItemCode,
                                        rtlDesc = sl.rtlDesc,
                                        rtlBatch = sl.rtlBatch,
                                        rtlHasSn = sl.rtlHasSn,
                                        rtlTaxPc = sl.rtlTaxPc,
                                        rtlRrpTaxIncl = sl.rtlRrpTaxIncl,
                                        rtlRrpTaxExcl = sl.rtlRrpTaxExcl,
                                        rtlLineDiscAmt = sl.rtlLineDiscAmt,
                                        rtlLineDiscPc = sl.rtlLineDiscPc,
                                        rtlQty = sl.rtlQty,
                                        rtlTaxAmt = sl.rtlTaxAmt,
                                        rtlSalesAmt = sl.rtlSalesAmt,
                                        rtlType = sl.rtlType,
                                        rtlSellingPrice = sl.rtlSellingPrice,
                                        Qty = (int)sl.rtlQty,

                                    }
                                        ).ToList();


                    PayLnViews = (from pl in context.RtlPayLns
                                  join p in context.RtlPays
                                  on pl.payId equals p.rtpUID
                                  where p.rtpDate >= frmdate && p.rtpDate <= todate && p.rtpSalesLoc.ToLower() == shop && p.rtpDvc.ToLower() == device
                                  && p.AccountProfileId == accountProfileId && pl.AccountProfileId == accountProfileId
                                  select new PayLnView
                                  {
                                      payId = pl.payId,
                                      Amount = pl.Amount,
                                      pmtCode = pl.pmtCode,
                                      AmtReceived = pl.AmtReceived,
                                      rtplSalesLoc = pl.rtplSalesLoc,
                                      rtplDvc = pl.rtplDvc,
                                      rtplCode = pl.rtplCode,
                                      rtplDate = pl.rtplDate,
                                      rtplTime = pl.rtplTime,
                                  }
                                        ).ToList();

                    StockList = (from st in context.MyobLocStocks
                                 where st.lstStockLoc.ToLower() == shop && st.AccountProfileId == accountProfileId
                                 select new ItemModel
                                 {
                                     lstItemCode = st.lstItemCode,
                                     lstStockLoc = st.lstStockLoc,
                                     lstQuantityAvailable = st.lstQuantityAvailable ?? 0,
                                     lstItemID = st.lstItemID ?? 0,
                                     AccountProfileId = st.AccountProfileId,
                                 }
                                ).ToList();

                    SerialNoList = (from sn in context.SerialNoes
                                    where sn.snoRtlSalesDate >= frmdate && sn.snoRtlSalesDate <= todate && sn.snoRtlSalesLoc.ToLower() == shop && sn.snoRtlSalesDvc.ToLower() == device
                                    select new SerialNoView
                                    {
                                        snoIsActive = sn.snoIsActive,
                                        snoCode = sn.snoCode,
                                        snoStatus = sn.snoStatus,
                                        snoItemCode = sn.snoItemCode,
                                        snoBatchCode = sn.snoBatchCode,
                                        snoRtlSalesLoc = sn.snoRtlSalesLoc,
                                        snoRtlSalesDvc = sn.snoRtlSalesDvc,
                                        snoRtlSalesCode = sn.snoRtlSalesCode,
                                        snoRtlSalesSeq = sn.snoRtlSalesSeq,
                                        snoRtlSalesDate = sn.snoRtlSalesDate,
                                    }
                                    ).ToList();

                }

                ShopDataModel model = new ShopDataModel();
                model.SalesList = SalesList;
                model.SalesLnViews = SalesLnViews;
                model.PayList = PayList;
                model.PayLnViews = PayLnViews;
                model.StockList = StockList;
                model.SerialNoList = SerialNoList;
                return Json(model, JsonRequestBehavior.AllowGet);
            }

            if (filename.StartsWith("Vip_"))
            {
                List<CustomerModel> customers = new List<CustomerModel>();

                using (var context = new PPWDbContext(Session["DBName"].ToString()))
                {
                    customers = (from c in context.MyobCustomers
                                 where c.AccountProfileId == accountProfileId && c.cusIsActive == true
                                 select new CustomerModel
                                 {
                                     cusIsOrganization = c.cusIsOrganization,
                                     cusContact = c.cusContact,
                                     cusAddrPhone1 = c.cusAddrPhone1,
                                     cusAddrPhone2 = c.cusAddrPhone2,
                                     cusAddrPhone3 = c.cusAddrPhone3,
                                     cusAddrStreetLine1 = c.cusAddrStreetLine1,
                                     cusAddrStreetLine2 = c.cusAddrStreetLine2,
                                     cusAddrStreetLine3 = c.cusAddrStreetLine3,
                                     cusAddrStreetLine4 = c.cusAddrStreetLine4,
                                     cusAddrCity = c.cusAddrCity,
                                     cusAddrCountry = c.cusAddrCountry,
                                     cusCode = c.cusCode,
                                     cusName = c.cusName,
                                     cusPhone = c.cusPhone,
                                     cusEmail = c.cusEmail,
                                     cusFax = c.cusFax,
                                     cusPointsSoFar = c.cusPointsSoFar,
                                     cusPointsUsed = c.cusPointsUsed,
                                     cusPriceLevelID = c.cusPriceLevelID,
                                 }
                                                     ).ToList();
                }
                return Json(customers, JsonRequestBehavior.AllowGet);
            }

            if (filename.StartsWith("Devices_"))
            {
                List<DeviceModel> devices = new List<DeviceModel>();

                using (var context = new PPWDbContext(Session["DBName"].ToString()))
                {
                    devices = (from d in context.Devices
                               where d.AccountProfileId == accountProfileId
                               select new DeviceModel
                               {
                                   dvcIsActive = d.dvcIsActive,
                                   dvcCode = d.dvcCode,
                                   dvcName = d.dvcName,
                                   dvcNextRtlSalesNo = d.dvcNextRtlSalesNo,
                                   dvcNextRefundNo = d.dvcNextRefundNo,
                                   dvcNextDepositNo = d.dvcNextDepositNo,
                                   dvcShop = d.dvcShop,
                                   dvcStockLoc = d.dvcStockLoc,
                                   dvcReceiptPrinter = d.dvcReceiptPrinter,
                                   dvcDayEndPrinter = d.dvcDayEndPrinter,
                                   dvcReceiptCopiesCash = d.dvcReceiptCopiesCash,
                                   dvcReceiptCopiesNonCash = d.dvcReceiptCopiesNonCash,
                                   dvcDefaultCusSales = d.dvcDefaultCusSales,
                                   dvcDefaultCusRefund = d.dvcDefaultCusRefund,
                                   dvcShopName = d.dvcShopName,
                                   dvcShopInfo = d.dvcShopInfo,
                                   dvcInvoicePrefix = d.dvcInvoicePrefix,
                                   dvcRefundPrefix = d.dvcRefundPrefix,
                                   AccountNo = (int)d.AccountNo,
                                   AccountProfileId = accountProfileId,
                               }
                                                     ).ToList();
                }
                return Json(devices, JsonRequestBehavior.AllowGet);
            }

            return null;
        }

        [HttpGet]
        public JsonResult GetMyobData(string filename)
        {
            if (filename.StartsWith("Suppliers_"))
            {
                List<SupplierModel> suplist = MYOBHelper.GetSupplierList(ConnectionString);
                var json = Json(suplist, JsonRequestBehavior.AllowGet);
                json.MaxJsonLength = int.MaxValue;
                return json;
            }
            if (filename.StartsWith("Employees_"))
            {
                List<MyobEmployeeModel> emplist = MYOBHelper.GetEmployeeList(ConnectionString);
                var json = Json(emplist, JsonRequestBehavior.AllowGet);
                json.MaxJsonLength = int.MaxValue;
                return json;
            }
            if (filename.StartsWith("Customers_"))
            {
                List<CommonLib.Models.MYOB.MYOBCustomerModel> cuslist = MYOBHelper.GetCustomerList(ConnectionString);
                var json = Json(cuslist, JsonRequestBehavior.AllowGet);
                json.MaxJsonLength = int.MaxValue;
                return json;
            }
            if (filename.StartsWith("Items_"))
            {
                List<MyobItemModel> itemlist = MYOBHelper.GetItemList(ConnectionString);
                var json = Json(itemlist, JsonRequestBehavior.AllowGet);
                json.MaxJsonLength = int.MaxValue;
                return json;
            }
            if (filename.StartsWith("Tax_"))
            {
                AbssConn abssConn = ModelHelper.GetAbssConn(ComInfo);
                List<CommonLib.Models.MYOB.TaxModel> taxlist = MYOBHelper.GetTaxList(abssConn);
                return Json(taxlist, JsonRequestBehavior.AllowGet);
            }
            if (filename.StartsWith("ItemLoc_"))
            {
                List<MyobItemLocModel> itemloclist = MYOBHelper.GetItemLocList(ConnectionString, apId);
                return Json(itemloclist, JsonRequestBehavior.AllowGet);
            }
            if (filename.StartsWith("ItemPrice_"))
            {
                List<MyobItemPriceModel> itemplist = MYOBHelper.GetItemPriceList(ConnectionString);
                var json = Json(itemplist, JsonRequestBehavior.AllowGet);
                json.MaxJsonLength = int.MaxValue;
                return json;
            }
            if (filename.StartsWith("Account_"))
            {
                List<AccountModel> acclist = MYOBHelper.GetAccountList(ConnectionString);
                var json = Json(acclist, JsonRequestBehavior.AllowGet);
                json.MaxJsonLength = int.MaxValue;
                return json;
            }
            if (filename.StartsWith("ACFC_"))
            {
                List<AccountClassificationModel> acclist = MYOBHelper.GetAccountClassificationList(ConnectionString);
                var json = Json(acclist, JsonRequestBehavior.AllowGet);
                json.MaxJsonLength = int.MaxValue;
                return json;
            }
            return null;
        }

        [HttpGet]
        public JsonResult GetDevicesByShop(string shop)
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                List<DeviceModel> deviceModels = new List<DeviceModel>();
                deviceModels = (from d in context.Devices
                                where d.dvcShop == shop
                                select new DeviceModel
                                {
                                    dvcShop = d.dvcShop,
                                    dvcCode = d.dvcCode,
                                    dvcName = d.dvcName
                                }
                                ).ToList();

                return Json(new { devices = deviceModels }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetImportFileList(JqueryDatatableParam param)
        {
            List<FileInfo> filelist = FileHelper.GetFileInfoList(@"~/Uploads", true);
            if (!string.IsNullOrEmpty(param.sSearch))
            {
                filelist = filelist.Where(x => x.Name.ToLower().Contains(param.sSearch.ToLower())
                                            || x.LastWriteTime.ToString().Contains(param.sSearch.ToLower())
                                             ).ToList();
            }
            //Sorting
            var sortColumnIndex = Convert.ToInt32(HttpContext.Request.QueryString["iSortCol_0"]);
            var sortDirection = HttpContext.Request.QueryString["sSortDir_0"];
            if (sortColumnIndex == 0)
            {
                filelist = sortDirection == "asc" ? filelist.OrderBy(c => c.Name).ToList() : filelist.OrderByDescending(c => c.Name).ToList();
            }
            else if (sortColumnIndex == 1)
            {
                filelist = sortDirection == "asc" ? filelist.OrderBy(c => c.LastWriteTime).ToList() : filelist.OrderByDescending(c => c.LastWriteTime).ToList();
            }

            //Paging
            var displayResult = filelist.Skip(param.iDisplayStart)
               .Take(param.iDisplayLength).ToList();
            var totalRecords = filelist.Count();
            return Json(new
            {
                param.sEcho,
                iTotalRecords = totalRecords,
                iTotalDisplayRecords = totalRecords,
                aaData = displayResult
            }, JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        public ActionResult CheckIfDayendsDone()
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                //var token = (string)Session["SessionToken"];				
                Session currsess = ModelHelper.GetCurrentSession(context);
                string msg = string.Empty;
                if (currsess != null)
                {
                    SessUser sessUser = (SessUser)Session["User"];
                    if (currsess.sesCreateBy == sessUser.UserCode)
                    {
                        msg = currsess.sesTimeTo == null ? "notdone" : "done";
                    }
                }

                return Json(new { msg }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult GetDayendPayments()
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                Session currsess = ModelHelper.GetCurrentSession(context);
                string location = currsess.sesShop.ToLower();

                DateTime today = DateTime.Now.Date;
                List<PayLnView> payLnViews = new List<PayLnView>();
                int seq = currsess.sesDvcSeq;
                decimal monthlypaytotal = 0;
                List<RtlPay> monthlypaylist = new List<RtlPay>();
                monthlypaylist = context.RtlPays.Where(x => x.rtpSalesLoc.ToLower() == location && x.rtpPayType == "MonthlyPay").ToList();
                if (monthlypaylist.Count > 0)
                {
                    monthlypaytotal = (decimal)monthlypaylist.Sum(x => x.rtpPayAmt);
                }

                payLnViews = (from pl in context.RtlPayLns
                              join p in context.RtlPays
                              on pl.payId equals p.rtpUID
                              join pt in context.PaymentTypes
                             on pl.pmtCode equals pt.pmtCode
                              where p.rtpDate == today && p.rtpSeq == seq && p.rtpSalesLoc.ToLower() == location && pt.pmtIsActive == true
                              select new PayLnView
                              {
                                  payId = pl.payId,
                                  Amount = pl.Amount,
                                  pmtCode = pl.pmtCode,
                                  pmtIsCash = (bool)pt.pmtIsCash
                              }
                              ).ToList();

                var groupedpaylns = payLnViews.GroupBy(x => x.pmtCode).ToList();
                foreach (var payln in payLnViews)
                {
                    foreach (var group in groupedpaylns)
                    {
                        if (payln.pmtCode == group.Key)
                        {
                            payln.TotalAmt = group.Sum(x => x.Amount);
                        }
                    }
                }

                decimal cashdrawamtstart = 0;
                if (currsess != null)
                {
                    var enablecashdrawer = context.AppParams.FirstOrDefault(x => x.appParam == "EnableCashDrawerAmt");
                    if (enablecashdrawer.appVal == "1")
                    {
                        cashdrawamtstart = currsess.sesCashAmtStart == null ? 0 : (decimal)currsess.sesCashAmtStart;
                    }

                    PayLnView cash = payLnViews.FirstOrDefault(x => x.pmtCode.ToLower() == "cash");

                    if (cash != null)
                    {
                        cash.Amount += cashdrawamtstart;
                    }
                    else
                    {
                        cash = new PayLnView
                        {
                            payId = 0,
                            Amount = cashdrawamtstart,
                            pmtCode = "Cash",
                            pmtIsCash = true,
                            TotalAmt = cashdrawamtstart
                        };
                        payLnViews.Add(cash);
                    }
                }

                return Json(new { payLnViews, cashdrawamtstart, monthlypaytotal }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public ActionResult SearchReceiptBySalesCode(string salescode)
        {
            SearchReceiptModel obj = new SearchReceiptModel();
            List<ItemModel> items = new List<ItemModel>();
            List<CustomerModel> customers = new List<CustomerModel>();
            List<SalesLnView> salesLns = new List<SalesLnView>();
            List<SalesLnView> refundLns = new List<SalesLnView>();
            Dictionary<string, List<SerialNoView>> DicItemSNs = new Dictionary<string, List<SerialNoView>>();

            obj.retmsg = string.Empty;

            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                Session currsess = ModelHelper.GetCurrentSession(context);
                int apId = currsess.AccountProfileId;
                int lang = currsess.sesLang;
                string location = currsess.sesShop.ToLower();
                string device = currsess.sesDvc.ToLower();

                SalesModel sales = null;
                var saleslist = context.RtlSales.Where(x => x.rtsCode == salescode).ToList();

                sales = (from s in context.RtlSales
                         where s.rtsCode.ToLower() == salescode.ToLower() && s.rtsType == "RS" && s.rtsDvc.ToLower() == device && s.rtsSalesLoc.ToLower() == location
                         select new SalesModel
                         {
                             rtsCusID = s.rtsCusID,
                             rtsLineTotalPlusTax = s.rtsLineTotalPlusTax,
                             rtsFinalDiscAmt = s.rtsFinalDiscAmt,
                             rtsFinalTotal = s.rtsFinalTotal,
                             rtsRmks = s.rtsRmks,
                             rtsDate = s.rtsDate,
                             rtsCode = s.rtsCode,
                             rtsInternalRmks = s.rtsInternalRmks,
                             rtsEpay = s.rtsEpay,
                             rtsParentUID = s.rtsParentUID,
                             rtsCustomerPO = s.rtsCustomerPO,
                             rtsDeliveryDate = s.rtsDeliveryDate

                         }).FirstOrDefault();


                List<SerialNoView> snlist = new List<SerialNoView>();
                if (sales != null)
                {
                    snlist = (from se in context.SerialNoes
                              where se.snoIsActive == true && se.snoRtlSalesCode.ToLower() == salescode.ToLower() && se.snoRtlSalesLoc.ToLower() == location && se.snoRtlSalesDvc.ToLower() == device
                              select new SerialNoView
                              {
                                  snoCode = se.snoCode,
                                  snoStatus = se.snoStatus,
                                  snoItemCode = se.snoItemCode,
                                  snoRtlSalesCode = se.snoRtlSalesCode,
                                  snoRtlSalesSeq = se.snoRtlSalesSeq,
                                  snoRtlSalesDate = se.snoRtlSalesDate,
                                  snoRtlSalesDvc = se.snoRtlSalesDvc,
                              }
                                          ).ToList();


                    items = ModelHelper.GetItemList(apId, context);
                    //var mergedcustomers = ModelHelper.GetMergedCustomerList(apId, context);
                    var c = context.MyobCustomers.FirstOrDefault(x => x.cusCustomerID == sales.rtsCusID);
                    CustomerModel customer = null;
                    //foreach (var c in mergedcustomers)
                    //{
                    if (c != null)
                    {
                        customer = new CustomerModel
                        {
                            cusCustomerID = c.cusCustomerID,
                            salescode = sales.rtsCode,
                            cusCode = c.cusCode,
                            cusIsActive = c.cusIsActive,
                            cusName = c.cusName,
                            cusPhone = c.cusPhone,
                            cusFax = c.cusFax,
                            cusPointsSoFar = c.cusPointsSoFar,
                            cusPointsUsed = c.cusPointsUsed,
                            cusPriceLevelID = c.cusPriceLevelID
                        };
                        customers.Add(customer);
                    }
                    //}

                    ModelHelper.GetCustomerPriceLevelDesc(context, ref customers);

                    salesLns = (from sl in context.RtlSalesLns
                                join s in context.RtlSales
                                on sl.rtlCode equals s.rtsCode
                                where s.rtsCode.ToLower() == salescode.ToLower() && s.rtsType == "RS" && s.rtsDvc.ToLower() == device && s.rtsSalesLoc.ToLower() == location
                                select new SalesLnView
                                {
                                    CustomerID = s.rtsCusID,
                                    rtlCode = sl.rtlCode,
                                    rtlItemCode = sl.rtlItemCode,
                                    rtlSeq = sl.rtlSeq,
                                    rtlHasSn = sl.rtlHasSn,
                                    rtlTaxPc = sl.rtlTaxPc,
                                    rtlTaxAmt = sl.rtlTaxAmt,
                                    rtlLineDiscPc = sl.rtlLineDiscPc,
                                    rtlLineDiscAmt = sl.rtlLineDiscAmt,
                                    rtlQty = sl.rtlQty,
                                    rtlSalesAmt = sl.rtlSalesAmt,
                                    rtlSellingPrice = sl.rtlSellingPrice,
                                    rtlDate = sl.rtlDate,
                                    rtlBatch = sl.rtlBatch,
                                    rtsRmks = s.rtsRmks,
                                    rtsInternalRmks = s.rtsInternalRmks,
                                    rtsIsEpay = s.rtsEpay,
                                    rtsCustomerPO = s.rtsCustomerPO,
                                    rtsDeliveryDate = s.rtsDeliveryDate
                                }).ToList();

                    refundLns = (from sl in context.RtlSalesLns
                                 join s in context.RtlSales
                                 on sl.rtlRefSales equals s.rtsCode
                                 where s.rtsRefCode.ToLower() == salescode.ToLower() && s.rtsType == "RF" && s.rtsDvc.ToLower() == device && s.rtsSalesLoc.ToLower() == location
                                 select new SalesLnView
                                 {
                                     CustomerID = s.rtsCusID,
                                     rtlCode = sl.rtlCode,
                                     rtlRefSales = sl.rtlRefSales,
                                     rtlItemCode = sl.rtlItemCode,
                                     rtlSeq = sl.rtlSeq,
                                     rtlQty = sl.rtlQty,
                                     rtlSalesAmt = sl.rtlSalesAmt,
                                     rtlSellingPrice = sl.rtlSellingPrice,
                                     rtlDate = sl.rtlDate,
                                     rtsRmks = s.rtsRmks,
                                     rtsInternalRmks = s.rtsInternalRmks,
                                     rtsIsEpay = s.rtsEpay,
                                     rtsCustomerPO = s.rtsCustomerPO,
                                     rtsDeliveryDate = s.rtsDeliveryDate
                                 }).ToList();


                    foreach (var salesln in salesLns)
                    {
                        foreach (var i in items)
                        {
                            if (salesln.rtlItemCode == i.itmCode)
                            {
                                var item = new ItemModel
                                {
                                    itmCode = i.itmCode,
                                    itmName = i.itmName,
                                    itmDesc = i.itmDesc,
                                    itmTaxPc = i.itmTaxPc,
                                    itmLastSellingPrice = i.itmLastSellingPrice
                                };
                                items.Add(item);
                            }
                        }
                        if (salesln.rtlHasSn == true)
                        {
                            ModelHelper.SetDicItemSNs(salesln, snlist, ref DicItemSNs);
                        }
                    }

                    obj.salesLns = salesLns;
                    obj.refundLns = refundLns;
                    obj.customers = customers;
                    obj.items = items;
                    obj.retmsg = "found";
                    obj.dicItemSNs = DicItemSNs;
                    return Json(obj, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { obj.retmsg }, JsonRequestBehavior.AllowGet);
                }
            }
        }

        [HttpGet]
        public ActionResult SearchReceiptBySerialNo(string serialno)
        {
            SearchReceiptModel obj = new SearchReceiptModel();
            List<ItemModel> items = new List<ItemModel>();
            List<CustomerModel> customers = new List<CustomerModel>();
            List<SalesLnView> salesLns = new List<SalesLnView>();
            List<SalesLnView> refundLns = new List<SalesLnView>();
            obj.retmsg = "";
            List<SerialNoView> snlist = new List<SerialNoView>();
            Dictionary<string, List<SerialNoView>> DicItemSNs = new Dictionary<string, List<SerialNoView>>();

            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                Session currsess = ModelHelper.GetCurrentSession(context);
                int apId = currsess.AccountProfileId;
                int lang = currsess.sesLang;
                var device = currsess.sesDvc.ToLower();
                var location = currsess.sesShop.ToLower();

                serialno = serialno.ToLower();

                var _snlist = context.SerialNoes.Where(se => se.snoIsActive == true && se.snoCode.ToLower().Contains(serialno) && se.snoRtlSalesLoc.ToLower() == location && se.snoRtlSalesDvc.ToLower() == device).ToList();

                snlist = (from se in context.SerialNoes
                          where se.snoIsActive == true && se.snoCode.ToLower().Contains(serialno) && se.snoRtlSalesLoc.ToLower() == location && se.snoRtlSalesDvc.ToLower() == device
                          select new SerialNoView
                          {
                              snoCode = se.snoCode,
                              snoStatus = se.snoStatus,
                              snoItemCode = se.snoItemCode,
                              snoRtlSalesCode = se.snoRtlSalesCode,
                              snoRtlSalesSeq = se.snoRtlSalesSeq,
                              snoRtlSalesDate = se.snoRtlSalesDate,
                              snoRtlSalesDvc = se.snoRtlSalesDvc,
                          }
                      ).ToList();

                if (snlist.Count > 0)
                {
                    List<string> salesitemcodes = new List<string>();
                    salesitemcodes = snlist.Select(x => x.snoRtlSalesCode + ":" + x.snoItemCode).ToList();

                    var _salesLns = context.RtlSalesLns.Where(sl => sl.rtlSalesLoc.ToLower() == location && sl.rtlDvc.ToLower() == device && sl.rtlType == "RS" && sl.rtlHasSn == true && salesitemcodes.Contains(sl.rtlCode + ":" + sl.rtlItemCode)).ToList();

                    salesLns = (from sl in context.RtlSalesLns
                                join s in context.RtlSales
                                on sl.rtlCode equals s.rtsCode
                                where sl.rtlSalesLoc.ToLower() == location && sl.rtlDvc.ToLower() == device && sl.rtlType == "RS" && sl.rtlHasSn == true && salesitemcodes.Contains(sl.rtlCode + ":" + sl.rtlItemCode)
                                select new SalesLnView
                                {
                                    rtlCode = sl.rtlCode,
                                    rtlItemCode = sl.rtlItemCode,
                                    rtlSeq = sl.rtlSeq,
                                    rtlHasSn = sl.rtlHasSn,
                                    rtlTaxPc = sl.rtlTaxPc,
                                    rtlTaxAmt = sl.rtlTaxAmt,
                                    rtlLineDiscPc = sl.rtlLineDiscPc,
                                    rtlLineDiscAmt = sl.rtlLineDiscAmt,
                                    rtlQty = sl.rtlQty,
                                    rtlSalesAmt = sl.rtlSalesAmt,
                                    rtlSellingPrice = sl.rtlSellingPrice,
                                    rtlDate = sl.rtlDate,
                                    rtlBatch = sl.rtlBatch,
                                    rtsRmks = s.rtsRmks,
                                    rtsInternalRmks = s.rtsInternalRmks,
                                    CustomerID = s.rtsCusID,
                                    rtsIsEpay = s.rtsEpay,
                                    rtsCustomerPO = s.rtsCustomerPO,
                                    rtsDeliveryDate = s.rtsDeliveryDate
                                }).ToList();


                    if (salesLns.Count > 0)
                    {
                        items = ModelHelper.GetItemList(apId, context);

                        foreach (var salesln in salesLns)
                        {
                            ModelHelper.SetDicItemSNs(salesln, snlist, ref DicItemSNs);

                            foreach (var i in items)
                            {
                                if (salesln.rtlItemCode == i.itmCode)
                                {
                                    var item = new ItemModel
                                    {
                                        itmCode = i.itmCode,
                                        itmName = i.itmName,
                                        itmDesc = i.itmDesc,
                                        itmTaxPc = i.itmTaxPc,
                                        itmLastSellingPrice = i.itmLastSellingPrice
                                    };
                                    items.Add(item);
                                }
                            }
                        }

                        var _refundLns = (from sl in context.RtlSalesLns
                                          join s in context.RtlSales
                                          on sl.rtlRefSales equals s.rtsCode
                                          join se in context.SerialNoes
                                          on sl.rtlItemCode equals se.snoItemCode
                                          where salesitemcodes.Contains(sl.rtlRefSales + ":" + sl.rtlItemCode) && s.rtsType == "RF" && s.rtsDvc.ToLower() == device && s.rtsSalesLoc.ToLower() == location
                                          select sl
                                          ).ToList();


                        refundLns = (from sl in context.RtlSalesLns
                                     join s in context.RtlSales
                                     on sl.rtlRefSales equals s.rtsCode
                                     join se in context.SerialNoes
                                     on sl.rtlItemCode equals se.snoItemCode
                                     where salesitemcodes.Contains(sl.rtlRefSales + ":" + sl.rtlItemCode) && s.rtsType == "RF" && s.rtsDvc.ToLower() == device && s.rtsSalesLoc.ToLower() == location
                                     select new SalesLnView
                                     {
                                         CustomerID = s.rtsCusID,
                                         rtlCode = sl.rtlCode,
                                         rtlRefSales = sl.rtlRefSales,
                                         rtlItemCode = sl.rtlItemCode,
                                         rtlSeq = sl.rtlSeq,
                                         rtlQty = sl.rtlQty,
                                         rtlSalesAmt = sl.rtlSalesAmt,
                                         rtlSellingPrice = sl.rtlSellingPrice,
                                         rtlDate = sl.rtlDate,
                                         rtsRmks = s.rtsRmks,
                                         rtsInternalRmks = s.rtsInternalRmks,
                                         rtsIsEpay = s.rtsEpay,
                                         rtsCustomerPO = s.rtsCustomerPO,
                                         rtsDeliveryDate = s.rtsDeliveryDate
                                     }).ToList();

                        var custIds = string.Join(",", salesLns.Select(x => x.CustomerID).ToList());
                        var _customers = context.GetCustomersByCusIds(apId, custIds).ToList();
                        foreach (var c in _customers)
                        {
                            foreach (var salesln in salesLns)
                            {
                                if (c.cusCustomerID == salesln.CustomerID)
                                {
                                    customers.Add(new CustomerModel
                                    {
                                        cusCustomerID = c.cusCustomerID??0,
                                        salescode = salesln.rtlCode,
                                        cusCode = c.cusCode,
                                        cusIsActive = c.cusIsActive,
                                        cusName = c.cusName,
                                        cusPhone = c.cusPhone,
                                        cusPointsSoFar = c.cusPointsSoFar,
                                        cusPointsUsed = c.cusPointsUsed,
                                        cusPriceLevelID = c.cusPriceLevelID
                                    });
                                }
                            }
                        }
                    }

                    obj.salesLns = salesLns;
                    obj.refundLns = refundLns; ;
                    obj.customers = customers;
                    obj.items = items;
                    obj.retmsg = "found";
                    obj.dicItemSNs = DicItemSNs;
                    return Json(obj, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { obj.retmsg }, JsonRequestBehavior.AllowGet);
                }
            }

        }

        [HttpGet]
        public ActionResult SearchReceiptByBatchNo(string batchno)
        {
            SearchReceiptModel obj = new SearchReceiptModel();
            List<ItemModel> items = new List<ItemModel>();
            List<CustomerModel> customers = new List<CustomerModel>();
            List<SalesLnView> salesLns = new List<SalesLnView>();
            List<SalesLnView> refundLns = new List<SalesLnView>();
            obj.retmsg = "";
            Dictionary<string, List<SerialNoView>> DicItemSNs = new Dictionary<string, List<SerialNoView>>();

            batchno = batchno.ToLower();

            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                Session currsess = ModelHelper.GetCurrentSession(context);
                int apId = currsess.AccountProfileId;
                int lang = currsess.sesLang;
                string location = currsess.sesShop.ToLower();
                string device = currsess.sesDvc.ToLower();

                var _saleslns = context.RtlSalesLns.Where(sl => sl.rtlBatch.ToLower().Contains(batchno) && sl.rtlType == "RS" && sl.rtlSalesLoc.ToLower() == location && sl.rtlDvc.ToLower() == device).ToList();

                salesLns = (from sl in context.RtlSalesLns
                            join s in context.RtlSales
                            on sl.rtlCode equals s.rtsCode
                            where sl.rtlBatch.ToLower().Contains(batchno) && sl.rtlType == "RS" && sl.rtlSalesLoc.ToLower() == location && sl.rtlDvc.ToLower() == device
                            select new SalesLnView
                            {
                                rtlCode = sl.rtlCode,
                                rtlItemCode = sl.rtlItemCode,
                                rtlSeq = sl.rtlSeq,
                                rtlHasSn = sl.rtlHasSn,
                                rtlTaxPc = sl.rtlTaxPc,
                                rtlTaxAmt = sl.rtlTaxAmt,
                                rtlLineDiscPc = sl.rtlLineDiscPc,
                                rtlLineDiscAmt = sl.rtlLineDiscAmt,
                                rtlQty = sl.rtlQty,
                                rtlSalesAmt = sl.rtlSalesAmt,
                                rtlSellingPrice = sl.rtlSellingPrice,
                                rtlDate = sl.rtlDate,
                                rtlBatch = sl.rtlBatch,
                                rtsRmks = s.rtsRmks,
                                rtsInternalRmks = s.rtsInternalRmks,
                                CustomerID = s.rtsCusID,
                                rtsIsEpay = s.rtsEpay,
                                rtsCustomerPO = s.rtsCustomerPO,
                                rtsDeliveryDate = s.rtsDeliveryDate
                            }).ToList();


                if (salesLns.Count > 0)
                {
                    items = ModelHelper.GetItemList(apId, context);

                    var salescodes = salesLns.Select(x => x.rtlCode).ToList();

                    var _refundLns = (from sl in context.RtlSalesLns
                                      join s in context.RtlSales
                                      on sl.rtlRefSales equals s.rtsCode
                                      where salescodes.Contains(sl.rtlRefSales) && s.rtsType == "RF" && s.rtsDvc.ToLower() == device && s.rtsSalesLoc.ToLower() == location
                                      select sl).ToList();


                    refundLns = (from sl in context.RtlSalesLns
                                 join s in context.RtlSales
                                 on sl.rtlRefSales equals s.rtsCode
                                 where salescodes.Contains(sl.rtlRefSales) && s.rtsType == "RF" && s.rtsDvc.ToLower() == device && s.rtsSalesLoc.ToLower() == location
                                 select new SalesLnView
                                 {
                                     CustomerID = s.rtsCusID,
                                     rtlCode = sl.rtlCode,
                                     rtlRefSales = sl.rtlRefSales,
                                     rtlItemCode = sl.rtlItemCode,
                                     rtlSeq = sl.rtlSeq,
                                     rtlQty = sl.rtlQty,
                                     rtlSalesAmt = sl.rtlSalesAmt,
                                     rtlSellingPrice = sl.rtlSellingPrice,
                                     rtlDate = sl.rtlDate,
                                     rtsRmks = s.rtsRmks,
                                     rtsInternalRmks = s.rtsInternalRmks,
                                     rtsIsEpay = s.rtsEpay,
                                     rtsCustomerPO = s.rtsCustomerPO,
                                     rtsDeliveryDate = s.rtsDeliveryDate
                                 }).ToList();

                    var custIds = string.Join(",", salesLns.Select(x => x.CustomerID).ToList());
                    var _customers = context.GetCustomersByCusIds(apId, custIds).ToList();

                    foreach (var c in _customers)
                    {
                        foreach (var salesln in salesLns)
                        {
                            if (c.cusCustomerID == salesln.CustomerID)
                            {
                                customers.Add(new CustomerModel
                                {
                                    cusCustomerID = c.cusCustomerID??0,
                                    salescode = salesln.rtlCode,
                                    cusCode = c.cusCode,
                                    cusIsActive = c.cusIsActive,
                                    cusName = c.cusName,
                                    cusPhone = c.cusPhone,
                                    cusPointsSoFar = c.cusPointsSoFar,
                                    cusPointsUsed = c.cusPointsUsed,
                                    cusPriceLevelID = c.cusPriceLevelID
                                });
                            }
                        }
                    }

                    var _snlist = (from se in context.SerialNoes
                                   where se.snoIsActive == true && salescodes.Contains(se.snoRtlSalesCode) && se.snoRtlSalesLoc.ToLower() == location && se.snoRtlSalesDvc.ToLower() == device
                                   select se).ToList();

                    List<SerialNoView> snlist = new List<SerialNoView>();

                    snlist = (from se in context.SerialNoes
                              where se.snoIsActive == true && salescodes.Contains(se.snoRtlSalesCode) && se.snoRtlSalesLoc.ToLower() == location && se.snoRtlSalesDvc.ToLower() == device
                              select new SerialNoView
                              {
                                  snoCode = se.snoCode,
                                  snoStatus = se.snoStatus,
                                  snoItemCode = se.snoItemCode,
                                  snoRtlSalesCode = se.snoRtlSalesCode,
                                  snoRtlSalesSeq = se.snoRtlSalesSeq,
                                  snoRtlSalesDate = se.snoRtlSalesDate,
                                  snoRtlSalesDvc = se.snoRtlSalesDvc,
                              }
                                          ).ToList();


                    foreach (var salesln in salesLns)
                    {
                        foreach (var i in items)
                        {
                            if (salesln.rtlItemCode == i.itmCode)
                            {
                                var item = new ItemModel
                                {
                                    itmCode = i.itmCode,
                                    itmName = i.itmName,
                                    itmDesc = i.itmDesc,
                                    itmTaxPc = i.itmTaxPc,
                                    itmLastSellingPrice = i.itmLastSellingPrice
                                };
                                items.Add(item);
                            }
                        }

                        if (salesln.rtlHasSn == true)
                        {
                            ModelHelper.SetDicItemSNs(salesln, snlist, ref DicItemSNs);
                        }
                    }

                    obj.salesLns = salesLns;
                    obj.refundLns = refundLns;
                    obj.customers = customers;
                    obj.items = items;
                    obj.retmsg = "found";
                    obj.dicItemSNs = DicItemSNs;
                    return Json(obj, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { obj.retmsg }, JsonRequestBehavior.AllowGet);
                }
            }
        }

        [HttpGet]
        public ActionResult GetReceiptNo(string keyword)
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                List<string> receiptnolist = new List<string>();
                receiptnolist = context.RtlSales.Where(x => x.rtsCode.ToLower().Contains(keyword.ToLower())).Select(x => x.rtsCode).ToList();
                return Json(new { receiptnolist }, JsonRequestBehavior.AllowGet);
            }
        }

        public CentralDataModel getReceiptData(PPWDbContext context = null, string receiptno = "", string phoneno = "", int lang = -1)
        {
            string checkoutportal = CheckoutPortal;
            var currsess = ModelHelper.GetCurrentSession(context);
            var shop = currsess.sesShop;
            var device = currsess.sesDvc;
            var devicecode = device;
            lang = lang == -1 ? currsess.sesLang : lang;
            int apId = currsess.AccountProfileId;
            int salescusId = -1;
            decimal salesamt = 0;
            decimal refundamt = 0;
            decimal payamt = 0;
            CustomerModel customer = null;
            CentralDataModel model = new CentralDataModel();
            RtlSale _sales = null;

            if (!string.IsNullOrEmpty(receiptno))
            {
                _sales = context.RtlSales.FirstOrDefault(x => x.rtsCode == receiptno && x.rtsType == "RS" && x.rtsDvc == devicecode && x.rtsSalesLoc == shop);
            }
            else
            {
                var _customer = context.SearchCustomer1(apId, 0, phoneno).FirstOrDefault();
                if (_customer != null)
                {
                    customer = new CustomerModel
                    {
                        cusCustomerID = _customer.cusCustomerID,
                        cusCode = _customer.cusCode,
                        cusName = _customer.cusName,
                        cusPointsSoFar = _customer.cusPointsSoFar,
                        cusPointsUsed = _customer.cusPointsUsed,
                        cusPhone = _customer.cusPhone,
                    };
                }
                if (customer != null)
                {
                    _sales = context.RtlSales.FirstOrDefault(x => x.rtsCusID == customer.cusCustomerID && x.rtsType == "RS" && x.rtsDvc == devicecode && x.rtsSalesLoc == shop);
                    receiptno = _sales.rtsCode;
                }
            }

            if (_sales != null)
            {
                salescusId = _sales.rtsCusID;

                var _customer = context.SearchCustomer1(apId, salescusId, "").FirstOrDefault();
                model.hascustomer = _customer != null;
                if (model.hascustomer)
                {
                    model.customer = new CustomerModel
                    {
                        cusCustomerID = _customer.cusCustomerID,
                        cusCode = _customer.cusCode,
                        cusName = _customer.cusName,
                        cusPointsSoFar = _customer.cusPointsSoFar,
                        cusPointsUsed = _customer.cusPointsUsed,
                        cusPhone = _customer.cusPhone,
                    };

                    ModelHelper.getReceiptData1(context, receiptno, shop, devicecode, ref model);

                    var itemcodes = model.salesLns.Select(x => x.rtlItemCode).ToList();
                    var itemoptions = context.GetItemOptionsByItemCodes6(apId, string.Join(",", itemcodes)).ToList();

                    var items = (from i in context.MyobItems
                                     //join ip in context.ItemOptions
                                     //on i.itmItemID equals ip.itemId
                                 where itemcodes.Any(y => y == i.itmCode)
                                 select new ItemModel
                                 {
                                     itmCode = i.itmCode,
                                     itmName = i.itmName,
                                     itmDesc = i.itmDesc,
                                     itmUseDesc = i.itmUseDesc,
                                     itmTaxPc = i.itmTaxPc,
                                     itmBaseSellingPrice = i.itmBaseSellingPrice,
                                     itmIsNonStock = i.itmIsNonStock,
                                 }
                                              ).ToList();
                    foreach (var item in items)
                    {
                        foreach (var itemoption in itemoptions)
                        {
                            if (item.lstItemCode == itemoption.itmCode)
                            {
                                item.chkBat = itemoption.chkBat;
                                item.chkSN = itemoption.chkSN;
                                item.chkVT = itemoption.chkVT;
                                break;
                            }
                        }
                    }


                    foreach (var salesln in model.salesLns)
                    {
                        foreach (var i in items)
                        {
                            if (salesln.rtlItemCode == i.itmCode)
                            {
                                model.items.Add(i);
                            }
                        }
                    }

                    ModelHelper.getReceiptData2(context, lang, shop, device, devicecode, model, receiptno);
                }

                model.taxModel = ModelHelper.GetTaxInfo(context);

                salesamt = (decimal)_sales.rtsFinalTotal;
                var refunds = context.RtlSales.Where(x => (x.rtsRefCode != null && x.rtsRefCode == receiptno) && x.rtsType == "RF" && x.rtsDvc == devicecode && x.rtsSalesLoc == shop).ToList();
                if (refunds.Count > 0)
                {
                    refundamt = (decimal)refunds.Sum(x => x.rtsFinalTotal);
                }

                var pay = context.RtlPays.FirstOrDefault(x => x.rtpCode == receiptno && x.rtpTxType == "RS");
                if (pay != null)
                {
                    payamt = (decimal)pay.rtpPayAmt;
                    model.isEpay = _sales.rtsEpay;
                    if (model.isEpay)
                    {
                        model.ePayType = pay.rtpEpayType;
                    }
                }

                model.toBeRefunded = salesamt - (-1 * refundamt);
                model.remainamt = salesamt - payamt;
            }

            model.hassales = _sales != null;
            model.noreceiptFound = model.hassales ? 0 : 1;
            return model;
        }


        [HttpGet]
        public async Task<ActionResult> GetReceipt(string devicecode, string receiptno = "", string phoneno = "", int refund = 1)
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                Session currsess = ModelHelper.GetCurrentSession(context);
                int apId = currsess.AccountProfileId;
                var shop = currsess.sesShop;
                var device = currsess.sesDvc;
                var lang = currsess.sesLang;

                if (devicecode != device)
                {
                    string url = string.Format(CentralApiUrl4Receipt, shop, devicecode, receiptno, phoneno, lang, refund, CentralBaseUrl);
                    HttpClient _client = new HttpClient();
                    var content = await _client.GetStringAsync(url);
                    var model = JsonConvert.DeserializeObject<CentralDataModel>(content);
                    if (model.noreceiptFound == 1)
                    {
                        return Json(new { msg = Resource.NoReceiptFound }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        if (model.toBeRefunded <= 0)
                        {
                            return Json(new { msg = Resource.AlreadyRefundedFullAmt }, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            if (model.customer != null)
                            {
                                return Json(model, JsonRequestBehavior.AllowGet);
                            }
                            else
                            {
                                return Json(new { msg = Resource.NoReceiptFound }, JsonRequestBehavior.AllowGet);
                            }
                        }
                    }

                }
                else
                {
                    CentralDataModel model = getReceiptData(context, receiptno, phoneno, lang);

                    if (model.noreceiptFound == 0)
                    {
                        if (model.toBeRefunded <= 0)
                        {
                            return Json(new { msg = Resource.AlreadyRefundedFullAmt }, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            if (model.hascustomer)
                            {
                                var itemcodelist = model.items.Select(x => x.itmCode).Distinct().ToHashSet();
                                ModelHelper.GetItemOptionsVariInfo(apId, shop, context, itemcodelist, null, model);

                                model.DicItemOptions = ModelHelper.GetDicItemOptions(apId, context);
                                return Json(model, JsonRequestBehavior.AllowGet);
                            }
                            else
                            {
                                return Json(new { msg = Resource.NoReceiptFound }, JsonRequestBehavior.AllowGet);
                            }
                        }
                    }
                    else
                    {
                        return Json(new { msg = Resource.NoReceiptFound }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
        }

        //[HttpPost]
        [HttpGet]
        public JsonResult GetItemsAjax(int pageIndex = 1, string keyword = "", string location = "", bool forsales = false, bool forwholesales = false, bool forpurchase = false, bool forstock = false, bool fortransfer = false, bool forpreorder = false, string type = "")
        {
            ItemViewModel model = new ItemViewModel();

            using var context = new PPWDbContext(Session["DBName"].ToString());
            int apId = AccountProfileId;
            model.PageIndex = pageIndex;
            model.PageSize = PageSize;
            int startIndex = CommonHelper.GetStartIndex(pageIndex, PageSize);
            if (keyword == "") keyword = null;
            if (location == "") location = null;

            using var connection = new SqlConnection(DefaultConnection);
            connection.Open();

            var stockinfo = context.GetStockInfo6(apId).ToList();

            List<SalesItem> itemlist = ModelHelper.GetItemList(apId, context, stockinfo, startIndex, model.PageSize, out model.RecordCount, keyword, location, type);

            ModelHelper.GetItemPriceLevelList(ref itemlist);
            model.Items = itemlist;

            var itemcodelist = model.Items.Select(x => x.itmCode).Distinct().ToHashSet();
            if (forsales || forpreorder || forwholesales || forpurchase)
            {
                ModelHelper.GetItemOptionsVariInfo(apId, location, context, itemcodelist, model);
            }
            if (forstock || fortransfer)
            {
                model.LatestUpdateTime = CommonHelper.FormatDateTime(stockinfo.Where(x => x.lstModifyTime != null).Select(x => (DateTime)x.lstModifyTime).FirstOrDefault());
                var salesInfos = context.GetSalesInfoByItemCodes1(apId, string.Join(",", itemcodelist)).ToList();

                HashSet<string> locationlist = stockinfo.Select(x => x.lstStockLoc).Distinct().ToHashSet();
                foreach (var loc in locationlist)
                {
                    model.DicLocItemList[loc] = new List<DistinctItem>();
                    //model.DicLocItemQty[loc] = new Dictionary<string, int>();
                }
                foreach (var item in itemlist)
                {
                    var ditem = new DistinctItem
                    {
                        ItemCode = item.itmCode.Trim(),
                        ItemName = item.itmName,
                        ItemDesc = item.itmDesc,
                        ItemTaxRate = item.itmTaxPc == null ? 0 : (double)item.itmTaxPc,
                        IsNonStock = item.itmIsNonStock,
                        ItemSupCode = item.itmSupCode,
                        NameDesc = item.itmUseDesc ? item.itmDesc : item.itmName,
                        chkBat = item.chkBat,
                        chkSN = item.chkSN,
                        chkVT = item.chkVT
                    };
                    foreach (var loc in locationlist)
                    {
                        if (model.DicLocItemList.Keys.Contains(loc))
                        {
                            model.DicLocItemList[loc].Add(ditem);
                        }
                    }
                }

                model.PrimaryLocation = ModelHelper.GetShops(connection, ref Shops, ref ShopNames, apId);
                ModelHelper.GetItemOptionsInfo(context, ref model.DicLocItemList, itemcodelist, Shops, connection);
            }

            var itemcodes = string.Join(",", itemcodelist);
            foreach (var itemcode in itemcodelist)
            {
                model.DicIvInfo[itemcode] = new List<PoItemVariModel>();
            }

            //GetPoItemVariInfo
            model.PoIvInfo = connection.Query<PoItemVariModel>(@"EXEC dbo.GetPoItemVariInfo @apId=@apId,@itemcodes=@itemcodes", new { apId, itemcodes }).ToList();
            ModelHelper.GetDicIvInfo(context, model.PoIvInfo, ref model.DicIvInfo);

            model.DicItemOptions = ModelHelper.GetDicItemOptions(apId, context);

            return Json(model, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult GetKItemsAjax(int pageIndex = 1, int pageSize = 10, string orderBy = "itemName", string direction = "asc", int stockId = 193340, string keyword = "")
        {
            ItemStockEditModel model = new ItemStockEditModel();
            var list = new List<ItemStockModel>();
            model.PageIndex = pageIndex;
            model.PageSize = pageSize;

            int startIndex = CommonHelper.GetStartIndex(pageIndex, pageSize);

            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                var info = KingdeeHelper.GetKingdeeAccountInfo(context);
                if (keyword == "")
                {
                    keyword = null;
                }
                var _list = context.GetKingdeeItemStockInfoPagingList3(info.OrgId, startIndex, pageSize, orderBy, direction, stockId, keyword).ToList();
                if (_list != null)
                {
                    foreach (var item in _list)
                    {
                        var itemstock = new ItemStockModel
                        {
                            Id = item.Id,
                            stId = item.stId,
                            ItId = item.ItId,
                            ItCode = item.ItCode,
                            ItDesc = item.ItDesc,
                            Qty = item.Qty,
                            ItemName = item.ItName,
                            StockName = item.stName,
                            IsSold = item.ForSell,
                            IsStock = item.ForInventory,
                            itmBaseSellingPrice = item.itPrice == null ? 0 : (decimal)item.itPrice,
                            stLocId = item.stLocId,
                            stOrgId = item.stOrgId,
                            stOwnerId = item.stOwnerId,
                            stKeeperId = item.stKeeperId,
                            stBaseUnitId = item.stBaseUnitId,
                            stUnitId = item.stUnitId,
                            CreateTime = item.CreateTime,
                            ModifyTime = item.ModifyTime,
                        };
                        list.Add(itemstock);
                    }
                }
                if (string.IsNullOrEmpty(keyword))
                {
                    model.RecordCount = context.GetKItemStockCount().FirstOrDefault().GetValueOrDefault();
                }
                else
                {
                    model.RecordCount = list.Count;
                }
            }

            model.Items = list;
            return Json(model);
        }

        [HttpPost]
        public ActionResult GetCustomersAjax4Sales(int pageIndex = 1, string keyword = "", string mode = "")
        {
            CustomerViewModel model = new CustomerViewModel();
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                var apId = ModelHelper.GetAccountProfileId(context);
                var pagesize = model.PageSize = PageSize;
                model.PageIndex = pageIndex;
                int startIndex = CommonHelper.GetStartIndex(pageIndex, pagesize);
                if (keyword == "") keyword = null;             

                model.Customers = (string.IsNullOrEmpty(mode) || mode == "search") ? ModelHelper.GetCustomers4Sales(context, pageIndex, pagesize, keyword, true) : ModelHelper.GetCustomerList(false, pageIndex, pagesize, keyword);

                model.RecordCount = (int)context.GetCustomerCount(apId, keyword).FirstOrDefault();
                return Json(model);
            }

        }


        [HttpGet]
        public ActionResult SearchCustomersAjax(int pageIndex = 1, string keyword = "")
        {
            CustomerViewModel model = new CustomerViewModel();
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                var apId = AccountProfileId;
                int pagesize = model.PageSize = PageSize;
                model.PageIndex = pageIndex;

                var customerlist = ModelHelper.GetCustomerList(false, pageIndex, pagesize, keyword);

                model.RecordCount = (int)context.GetCustomerCount(apId, keyword).FirstOrDefault();

                model.Customers = customerlist;

                return Json(model, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpGet]
        public JsonResult GetCustomerByCode(string cusCode)
        {
            using var connection = new SqlConnection(DefaultConnection);
            connection.Open();
            CustomerModel customer = connection.QueryFirstOrDefault<CustomerModel>(@"EXEC dbo.GetCustomerByCode5 @apId=@apId,@cusCode=@cusCode", new { apId, cusCode });

            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                GetCustomerAddressList(context, ref customer);
                //ModelHelper.GetCustomerPriceLevelDesc(context, ref customer);                
            }

            return Json(customer, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetCustomerById(int customerId)
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                var _customer = context.GetCustomerById19(customerId, AccountProfileId).FirstOrDefault();
                CustomerModel customer = new CustomerModel();
                if (_customer != null)
                {
                    customer.cusCustomerID = _customer.cusCustomerID;
                    customer.cusFirstName = _customer.cusFirstName;
                    customer.cusIsOrganization = _customer.cusIsOrganization;
                    customer.cusContact = _customer.cusContact;
                    customer.cusCode = _customer.cusCode;
                    customer.cusName = _customer.cusName;
                    customer.cusPhone = _customer.cusPhone;
                    customer.cusPointsSoFar = _customer.cusPointsSoFar;
                    customer.cusPointsUsed = _customer.cusPointsUsed;
                    customer.cusPriceLevelID = _customer.cusPriceLevelID;
                    customer.cusIsActive = _customer.cusIsActive;
                    customer.CreateTime = _customer.CreateTime;
                    customer.ModifyTime = _customer.ModifyTime;
                    customer.cusEmail = _customer.cusEmail;
                    //customer.AccountProfileId = _customer.AccountProfileId;
                    customer.cusMobile = _customer.cusMobile;
                    customer.BalanceDueDays = _customer.BalanceDueDays;
                    customer.PaymentIsDue = _customer.PaymentIsDue;
                    customer.PaymentTermsDesc = _customer.Description;
                    customer.IsLastSellingPrice = _customer.IsLastSellingPrice;
                    customer.unsubscribe = _customer.unsubscribe;
                    GetCustomerAddressList(context, ref customer);
                    customer.AccountProfileName = _customer.AccountProfileName;
                    ModelHelper.GetCustomerPriceLevelDesc(context, ref customer);
                }
                return Json(customer, JsonRequestBehavior.AllowGet);
            }
        }

        public void GetCustomerAddressList(PPWDbContext context, ref CustomerModel customer)
        {
            var _addresslist = context.GetCustomerAddressList2(AccountProfileId, customer.cusCode).ToList();
            if (_addresslist != null && _addresslist.Count > 0)
            {
                customer.AddressList = new List<AddressView>();
                foreach (var _address in _addresslist)
                {
                    customer.AddressList.Add(new AddressView
                    {
                        Id = _address.Id,
                        cusCode = _address.cusCode,
                        cusAddrLocation = _address.cusAddrLocation,
                        AccountProfileId = _address.AccountProfileId,
                        StreetLine1 = _address.StreetLine1,
                        StreetLine2 = _address.StreetLine2,
                        StreetLine3 = _address.StreetLine3,
                        StreetLine4 = _address.StreetLine4,
                        City = _address.City,
                        State = _address.State,
                        Postcode = _address.Postcode,
                        Country = _address.Country,
                        Phone1 = _address.Phone1,
                        Phone2 = _address.Phone2,
                        Phone3 = _address.Phone3,
                        Fax = _address.Fax,
                        Email = _address.Email,
                        Salutation = _address.Salutation,
                        ContactName = _address.ContactName,
                        WWW = _address.WWW
                    });
                }
            }
        }

        [HttpGet]
        public ActionResult GetSessionStartData()
        {
            int lang = (int)Session["CurrentCulture"];
            SessionStartModel model = ModelHelper.GetSessionStartData(lang, ConfigurationManager.AppSettings["DefaultCheckoutPortal"]);
            var jsondata = Json(new
            {
                //PGCustomers = model.PGCustomers, 
                model.CustomerPointPriceLevels,
                companyinfo = model.CompanyInfo,
                receipt = model.Receipt,
                defaultcustomer = model.DefaultCustomer,
                pagelength = model.PageLength,
                dicpaytypes = model.DicPayTypes,
                enableTax = model.EnableTax,
                inclusivetax = model.InclusiveTax,
                inclusivetaxrate = model.InclusiveTaxRate,
                salesmanlist = model.PosAbssSalesmanList,
                model.DicCurrencyExRate,
                model.UseForexAPI,
                model.JobList
            }, JsonRequestBehavior.AllowGet);
            jsondata.MaxJsonLength = int.MaxValue;
            return jsondata;

        }

        [HttpGet]
        public ActionResult CheckIfDuplicatedSN(string sn)
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                var serialno = (from s in context.SerialNoes
                                where s.snoCode == sn && s.AccountProfileId == AccountProfileId
                                select new SerialNoView
                                {
                                    snoCode = sn,
                                    snoRtlSalesDate = s.snoRtlSalesDate,
                                    snoRtlSalesCode = s.snoRtlSalesCode,
                                    snoStockInCode = s.snoStockInCode,
                                    snoStockInDate = s.snoStockInDate
                                }
                                ).FirstOrDefault();

                return Json(new { serialno, sn }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public JsonResult CheckIfFileLocked(string file = "")
        {
            string iLocked = "1";
            if (string.IsNullOrEmpty(file))
                file = ComInfo.MYOBDb;
            FileInfo fileInfo = new FileInfo(file);
            if (fileInfo.Exists)
            {
                iLocked = CommonLib.Helpers.FileHelper.IsFileLocked(fileInfo) ? "1" : "0";
            }
            return Json(iLocked, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetCitiesFrmMyobCustomList()
        {
            using var context = new PPWDbContext(DbName);
            var customlist = context.MyobCustomLists.Where(x => x.AccountProfileId == apId).ToList();
            var MyobCities = new List<City>();
            foreach (var city in customlist.Where(x => x.CustomListNumber == 2).ToList())
            {
                MyobCities.Add(new City
                {
                    Id = city.CustomListID,
                    Name = city.CustomListText
                });
            }
            return Json(MyobCities, JsonRequestBehavior.AllowGet);
        }
    }

    public class City
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public enum PosUploadType
    {
        Retail = 0,
        WholeSales = 1,
        Purchase = 2
    }
}