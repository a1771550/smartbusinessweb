using CommonLib.App_GlobalResources;
using CommonLib.Helpers;
using CommonLib.Models;
using KingdeeLib.Helpers;
using KingdeeLib.Models;
using KingdeeLib.Models.Sales;
using LumenWorks.Framework.IO.Csv;
using Newtonsoft.Json;
using PPWCommonLib.BaseModels;
using PPWCommonLib.Models;
using PPWDAL;
using PPWLib.Models;
using PPWLib.Models.Item;
using PPWLib.Models.MYOB;
using PPWLib.Models.POS.MYOB;
using PPWLib.Models.Purchase;
using PPWLib.Models.WholeSales;
using PPWMyobLib;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.DirectoryServices.ActiveDirectory;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Printing;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using Helpers = PPWLib.Helpers;
using KItemPriceModel = KingdeeLib.Models.ItemPrice.ItemPriceModel;
using Resources = CommonLib.App_GlobalResources;
using Microsoft.Data.SqlClient;
using Dapper;
using DocumentFormat.OpenXml;
using CommonLib.Models.MYOB;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
//using System.Data.SqlClient;

namespace SmartBusinessWeb.Controllers
{
    [AllowAnonymous]
    public class TestController : Controller
    {
        int AccountProfileId = 1;
        int CompanyId = 1;
        bool NonAbss = false;

        //private ComInfo ComInfo { get { return Session["ComInfo"] as ComInfo; } }
        //protected string CheckoutPortal { get { return ComInfo.DefaultCheckoutPortal; } }
        //private string ConnectionString { get { return string.Format(@"Driver={0};TYPE=MYOB;UID={1};PWD={2};DATABASE={3};HOST_EXE_PATH={4};NETWORK_PROTOCOL=NONET;DRIVER_COMPLETION=DRIVER_NOPROMPT;KEY={5};ACCESS_TYPE=READ;", ComInfo.MYOBDriver, ComInfo.MYOBUID, ComInfo.MYOBPASS, ComInfo.MYOBDb, ComInfo.MYOBExe, ComInfo.MYOBKey); } }
        private string ConnectionString{ get { return Session["DBName"] == null ? ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString.Replace("_DBNAME_", "POSPro") : ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString.Replace("_DBNAME_", Session["DBName"].ToString()); } }
        private string centralbaseUrl = UriHelper.GetAppUrl();
        protected string DateFormat { get { return ConfigurationManager.AppSettings["DateFormat"]; } }

        private static string KingdeeCloudUrl = ConfigurationManager.AppSettings["KingdeeCloudUrl"];
        private static string KingdeeDbId = ConfigurationManager.AppSettings["KingdeeDbId"];
        private static string KingdeeLoginId = ConfigurationManager.AppSettings["KingdeeLoginId"];
        private static string KingdeeLoginPass = ConfigurationManager.AppSettings["KingdeeLoginPass"];
        private static int KingdeeLangId = int.Parse(ConfigurationManager.AppSettings["KingdeeLangId"]);
        private static string KingdeeInvoiceFormId = ConfigurationManager.AppSettings["KingdeeInvoiceFormId"];
        private static string Kingdee_CustomerFormId = ConfigurationManager.AppSettings["Kingdee_CustomerFormId"];
        private static string KingdeeMaterialFormId = ConfigurationManager.AppSettings["KingdeeMaterialFormId"];
        private static string KingdeeInventoryFormId = ConfigurationManager.AppSettings["KingdeeInventoryFormId"];
        private static string Kingdee_ItemPriceListFormId = ConfigurationManager.AppSettings["Kingdee_ItemPriceListFormId"];
        private int startIndex = 0;
        private int pageSize = 10;
        private string CentralApiUrl = ConfigurationManager.AppSettings["CentralApiUrl"];
        private string shopApiUrl = ConfigurationManager.AppSettings["ShopApiUrl"];
        private string kingdeeApiBaseUrl = ConfigurationManager.AppSettings["KingdeeApiBaseUrl"];
        private string CentralBaseUrl = UriHelper.GetAppUrl();
        private string location = "office";
        private string Shop = "office";
        private string device = "P10";
        private int lang = 0;
        private const int apId = 1;
        private const int companyId = 1;
        //private List<string> Shops;
        private string MyobConnectionString { get { return string.Format(@"Driver={0};TYPE=MYOB;UID={1};PWD={2};DATABASE={3};HOST_EXE_PATH={4};NETWORK_PROTOCOL=NONET;DRIVER_COMPLETION=DRIVER_NOPROMPT;KEY={5};ACCESS_TYPE=READ;", ConfigurationManager.AppSettings["MYOBDriver"], ConfigurationManager.AppSettings["MYOBUId"], ConfigurationManager.AppSettings["MYOBPass"], ConfigurationManager.AppSettings["MYOBDb"], ConfigurationManager.AppSettings["MYOBExe"], ConfigurationManager.AppSettings["MYOBKey"]); } }
        protected string UploadsWSDir { get { return ConfigurationManager.AppSettings["UploadsWSDir"]; } }
        protected string UploadsPODir { get { return ConfigurationManager.AppSettings["UploadsPODir"]; } }

        public void SwitchDB(string dbname="POSPro")
        {
            try
            {
                using var context = new PPWDbContext(dbname);
                Response.Write("user count:" + context.SysUsers.Where(x=>x.surIsActive).Count());
            }catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
            
        }
        public void Debug79()
        {
            var stritemcodes = "T0009";
            using var context = new PPWDbContext();
            
            var itemvtInfo = context.GetValidThruInfo12(apId, location, stritemcodes).ToList();
            // Response.Write(itemvtInfo.Count);
            var pocodelist = new List<string>
            {
                "MP100001",
                "MP100002",
                "MP100003",
            };

            Dictionary<string, List<VtQty>> DicItemVtQtyList = new Dictionary<string, List<VtQty>>();
            DicItemVtQtyList[stritemcodes] = new List<VtQty>();

            foreach (var pocode in pocodelist)
            {
                var ivqList = (from item in itemvtInfo
                              where item.piValidThru != null && item.pstCode == pocode
                              //group item by new { item.itmCode, item.piValidThru, item.pstCode, item.vtSeq, item.Id } into itemgroup
                              select new
                              {
                                  PoCode = pocode,
                                  ItemCode = item.itmCode,
                                  vtseq = item.vtSeq,
                                  Seq = item.seq,
                                  ValidThru = CommonHelper.FormatDate((DateTime)item.piValidThru),
                                  vtId = item.Id,
                                  item.vtQty
                              }).ToList();
                ivqList = ivqList.OrderBy(x => x.ItemCode).ToList();

                if (ivqList != null && ivqList.Count() > 0)
                {
                    foreach(var vi in ivqList)
                    {
                        var delqty = 0;
                        if (DicItemVtQtyList.ContainsKey(vi.ItemCode))
                        {
                            var vtqty = new VtQty
                            {
                                pocode = vi.PoCode,
                                vt = vi.ValidThru,
                                itemcode = vi.ItemCode,
                                vtseq = vi.Seq,
                                delqty = delqty,
                                qty = (int)vi.vtQty,
                                sellableqty = (int)vi.vtQty - delqty,
                                vtId = vi.vtId
                            };
                            //if (vtqty.totalqty > 0)
                            DicItemVtQtyList[vi.ItemCode].Add(vtqty);
                        }
                    }
                }
            }

            Response.Write(DicItemVtQtyList[stritemcodes].Count);
        }
        public void Debug78()
        {           
            using var connection = new SqlConnection(ConnectionString);
            connection.Open();
            //GetBatTotalQtyByBatCodes
            var batTotalQtyList = connection.Query<BatTotalQty>(@"EXEC dbo.GetBatTotalQtyByBatCodes @apId=@apId", new { apId }).ToList();
            if (batTotalQtyList.Count > 0)
            {
                Dictionary<string, int> DicBatTotalQty = new Dictionary<string, int>();
                foreach (var item in batTotalQtyList)
                {
                    Response.Write(item.batCode + ":" + item.totalBatQty + "<br>");
                    DicBatTotalQty[item.batCode] = item.totalBatQty;
                }
            }

        }
        public ActionResult Static()
        {
            return Redirect("~/static/unsubscribe_zh.html");
        }
        public void GetHost()
        {
            EmailEditModel model = new EmailEditModel();
            var mailsettings = model.Get(1);
            string host = Request.IsLocal ? string.Concat("http://", UriHelper.GetLocalIPAddress(), @"/Track") : mailsettings.emEmailTrackingURL;
            //http://192.168.123.78/Track
            Response.Write(host);
        }
      

        public void ParseDateTime()
        {
            //DateTime datetimeValue;
            //string dateformat= "yyyy-MM-dd HH:mm:ss"; 
            var dt = DateTime.ParseExact(
              "2023-07-06T03:06:42Z",
              "yyyy-MM-ddTHH:mm:ssZ",
               CultureInfo.InvariantCulture);

            var dateString = CommonHelper.FormatDateTime(dt);

            ////2023-07-06 11:06:42

            //DateTime.TryParseExact(dateString, dateformat, null,
            //                   DateTimeStyles.None, out datetimeValue);
            //Response.Write(datetimeValue);
            //Response.Write(CommonHelper.GetDateFrmString4SQL(dateString));

            using var context = new PPWDbContext();
            var enquiry = new Enquiry
            {
                Id = CommonHelper.GenerateNonce(),
                enSubject = "Test",
                enReceivedDateTime = dateString,
                CreateTime = DateTime.Now,
                ModifyTime = DateTime.Now
            };
            context.Enquiries.Add(enquiry);
            context.SaveChanges();

            Response.Write(dt);//6/7/2023 11:06:42 am
            Response.Write("<br>");
            Response.Write(dateString + "<br>");
        }

        public void DapperQuery()
        {           
            using var connection = new Microsoft.Data.SqlClient.SqlConnection(ConnectionString);
            connection.Open();
            var CurrentOldestDate = connection.QueryFirstOrDefault<string>(@"EXEC dbo.GetEnqOldestDate @apId=@apId", new { apId });
            Response.Write($"CurrentOldestDate: {CurrentOldestDate}");
        }
        public async Task CallGraphAPI()
        {
            string frmdate = CommonHelper.FormatDate(DateTime.Today.AddMonths(-1));
            string todate = CommonHelper.FormatDate(DateTime.Today.Date);
            //var url = $"https://localhost:5001/email/savemailstodb?frmdate={frmdate}&todate={todate}";
            var url = "https://localhost:5001/email/test";
            HttpClient _client = new HttpClient();
            _client.MaxResponseContentBufferSize = int.MaxValue;
            NEVER_EAT_POISON_Disable_CertificateValidation();
            var content = await _client.GetStringAsync(url);
            Response.Write(content);
        }

        //[Obsolete("Do not use this in Production code!!!", true)]
        static void NEVER_EAT_POISON_Disable_CertificateValidation()
        {
            // Disabling certificate validation can expose you to a man-in-the-middle attack
            // which may allow your encrypted message to be read by an attacker
            // https://stackoverflow.com/a/14907718/740639
            ServicePointManager.ServerCertificateValidationCallback =
                delegate (
                    object s,
                    X509Certificate certificate,
                    X509Chain chain,
                    SslPolicyErrors sslPolicyErrors
                )
                {
                    return true;
                };
        }

        //public void CallConsole()
        //{
        //    ProcessStartInfo startinfo = new ProcessStartInfo();
        //    string filepath = @"F:\repos\GraphAppOnlyTutorial\bin\Debug\net7.0\GraphAppOnlyTutorial.exe";
        //    string frmdate = CommonHelper.FormatDate(DateTime.Today.AddMonths(-1));
        //    string todate = CommonHelper.FormatDate(DateTime.Today.Date);
        //    startinfo.FileName = filepath;
        //    //startinfo.Arguments = $"{frmdate} {todate}";
        //    //startinfo.CreateNoWindow = true;
        //    startinfo.UseShellExecute = true;
        //    Process myProcess = Process.Start(startinfo);
        //    myProcess.Start();
        //}

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UploadsPost(string wscode)
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    List<string> filenamelist = new List<string>();
                    string filedir = string.Format(UploadsWSDir, apId, wscode);//Uploads/WS/{0}/{1}
                    string dir = "";
                    //string ext = "";
                    //string rand = CommonHelper.GenerateNonce(10);
                    //string file = string.Format("{0}",rand);
                    string filename = string.Empty;
                    HttpFileCollectionBase files = Request.Files;
                    for (int i = 0; i < files.Count; i++)
                    {
                        filename = Path.GetFileName(Request.Files[i].FileName);
                        HttpPostedFileBase _file = files[i];
                        FileInfo fi = new FileInfo(filename);
                        //ext = fi.Extension;
                        dir = string.Concat(@"~/", filedir);
                        var absdir = Server.MapPath(dir);
                        if (!Directory.Exists(absdir))
                        {
                            Directory.CreateDirectory(absdir);
                        }
                        //string fname = Path.Combine(absdir, string.Format(file, ext));
                        string fname = Path.Combine(absdir, filename);
                        _file.SaveAs(fname);
                        filenamelist.Add(filename);
                    }
                    using (var context = new PPWDbContext())
                    {
                        WholeSale wholeSale = context.WholeSales.FirstOrDefault(x => x.wsCode == wscode && x.AccountProfileId == apId);
                        if (wholeSale != null)
                        {
                            wholeSale.UploadFileName = string.Join(",", filenamelist);
                        }
                        context.SaveChanges();
                    }
                    dir = string.Concat(@"/", filedir);
                    //string filepath = Path.Combine(dir, string.Format(file, ext));
                    string filepath = Path.Combine(dir, filename);
                    return Json(new { msg = Resources.Resource.UploadOkMsg, filepath });
                }
                catch (Exception ex)
                {
                    return Json(new { msg = "Error occurred. Error details: " + ex.Message });
                }
            }
            else
            {
                return Json(new { msg = Resources.Resource.NoFileSelected });
            }

            //try
            //{
            //    if (file.ContentLength > 0)
            //    {
            //        string _FileName = Path.GetFileName(file.FileName);
            //        string wscode = "KL000001";
            //        string uploadpath = Server.MapPath($"WS/{apId}/{wscode}");
            //        FileHelper.CreateDirectory(uploadpath);
            //        string _path = Path.Combine(Server.MapPath($"WS/{apId}"), _FileName);
            //        file.SaveAs(_path);
            //    }
            //    ViewBag.Message = "File Uploaded Successfully!!";              
            //}
            //catch
            //{
            //    ViewBag.Message = "File upload failed!!";                
            //}
            //return Json(ViewBag.Message);
        }

        public ActionResult Uploads()
        {
            WholeSalesEditModel model = new WholeSalesEditModel();
            return View(model);
        }

        public void debug76()
        {
            //sql = MyobHelper.CustomerListSql_NoJoin;//Don't join!!! Chances are that customer will be empty if he has no phone record!!!!
            var sql = MyobHelper.CustomerListSql;

            List<MYOBCustomerModel> customerlist = new List<MYOBCustomerModel>();
            Repository rs = new Repository();
            DataSet ds = rs.Query(MyobConnectionString, sql);
            DataTable dt = ds.Tables[0];
            customerlist = (from DataRow dr in dt.Rows
                            select new MYOBCustomerModel()
                            {
                                CustomerID = dr[0] == DBNull.Value ? 0 : Convert.ToInt32(dr[0]),
                                CardRecordID = dr[1] == DBNull.Value ? 0 : Convert.ToInt32(dr[1]),
                                CardIdentification = dr[2].ToString(),
                                Name = dr[3].ToString(),
                                LastName = dr[4].ToString(),
                                FirstName = dr[5].ToString(),
                                IsIndividual = dr[6] == DBNull.Value ? '-' : Convert.ToChar(dr[6]),
                                IsInactive = dr[7] == DBNull.Value ? '-' : Convert.ToChar(dr[7]),
                                CurrencyID = dr[8] == DBNull.Value ? 0 : Convert.ToInt32(dr[8]),
                                Picture = dr[9].ToString(),
                                Notes = dr[10].ToString(),
                                IdentifierID = dr[11].ToString(),
                                CustomList1ID = dr[12] == DBNull.Value ? 0 : Convert.ToInt32(dr[12]),
                                CustomList2ID = dr[13] == DBNull.Value ? 0 : Convert.ToInt32(dr[13]),
                                CustomList3ID = dr[14] == DBNull.Value ? 0 : Convert.ToInt32(dr[14]),
                                CustomField1 = dr[15] == DBNull.Value ? null : Convert.ToString(dr[15]),
                                CustomField2 = dr[16] == DBNull.Value ? null : Convert.ToString(dr[16]),
                                //BRNo = dr[16] == DBNull.Value ? null : Convert.ToString(dr[16]),
                                CustomField3 = dr[17] == DBNull.Value ? null : Convert.ToString(dr[17]),
                                TermsID = dr[18] == DBNull.Value ? 0 : Convert.ToInt32(dr[18]),
                                PriceLevelID = dr[19].ToString(),
                                TaxIDNumber = dr[20].ToString(),
                                TaxCodeID = dr[21] == DBNull.Value ? 0 : Convert.ToInt32(dr[21]),
                                FreightIsTaxed = dr[22] == DBNull.Value ? '-' : Convert.ToChar(dr[22]),
                                CreditLimit = dr[23] == DBNull.Value ? 0 : Convert.ToDecimal(dr[23]),
                                VolumeDiscount = dr[24] == DBNull.Value ? 0 : Convert.ToDecimal(dr[24]),
                                CurrentBalance = dr[25] == DBNull.Value ? 0 : Convert.ToDecimal(dr[25]),
                                TotalDeposits = dr[26] == DBNull.Value ? 0 : Convert.ToDecimal(dr[26]),
                                CustomerSince = dr[27] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(dr[27]),
                                LastSaleDate = dr[28] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(dr[28]),
                                LastPaymentDate = dr[29] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(dr[29]),
                                TotalReceivableDays = dr[30] == DBNull.Value ? 0 : Convert.ToInt32(dr[30]),
                                TotalPaidInvoices = dr[31] == DBNull.Value ? 0 : Convert.ToInt32(dr[31]),
                                HighestInvoiceAmount = dr[32] == DBNull.Value ? 0 : Convert.ToDecimal(dr[32]),
                                HighestReceivableAmount = dr[33] == DBNull.Value ? 0 : Convert.ToDecimal(dr[33]),
                                MethodOfPaymentID = dr[34] == DBNull.Value ? 0 : Convert.ToInt32(dr[34]),
                                PaymentCardNumber = dr[35].ToString(),
                                PaymentNameOnCard = dr[36].ToString(),
                                PaymentExpiryDate = dr[37].ToString(),
                                PaymentNotes = dr[38].ToString(),
                                HourlyBillingRate = dr[39] == DBNull.Value ? 0 : Convert.ToDecimal(dr[39]),
                                SaleLayoutID = dr[40] == DBNull.Value ? '-' : Convert.ToChar(dr[40]),
                                PrintedForm = dr[41].ToString(),
                                IncomeAccountID = dr[42] == DBNull.Value ? 0 : Convert.ToInt32(dr[42]),
                                SalespersonID = dr[43] == DBNull.Value ? 0 : Convert.ToInt32(dr[43]),
                                SaleCommentID = dr[44] == DBNull.Value ? 0 : Convert.ToInt32(dr[44]),
                                DeliveryMethodID = dr[45] == DBNull.Value ? 0 : Convert.ToInt32(dr[45]),
                                ReceiptMemo = dr[46].ToString(),
                                ChangeControl = dr[47].ToString(),
                                OnHold = dr[48] == DBNull.Value ? '-' : Convert.ToChar(dr[48]),
                                InvoiceDeliveryID = dr[49] == DBNull.Value ? '-' : Convert.ToChar(dr[49]),
                                PaymentDeliveryID = dr[50] == DBNull.Value ? '-' : Convert.ToChar(dr[50]),

                                Terms = new MyobTerms
                                {
                                    LatePaymentChargePercent = dr[51] == DBNull.Value ? 0 : Convert.ToDouble(dr[51]),
                                    EarlyPaymentDiscountPercent = dr[52] == DBNull.Value ? 0 : Convert.ToDouble(dr[52]),
                                    TermsOfPaymentID = dr[53] == DBNull.Value ? null : Convert.ToString(dr[53]),
                                    DiscountDays = dr[54] == DBNull.Value ? 0 : Convert.ToInt32(dr[54]),
                                    BalanceDueDays = dr[55] == DBNull.Value ? 0 : Convert.ToInt32(dr[55]),
                                    ImportPaymentIsDue = dr[56] == DBNull.Value ? 0 : Convert.ToInt32(dr[56]),
                                    DiscountDate = dr[57] == DBNull.Value ? null : Convert.ToString(dr[57]),
                                    BalanceDueDate = dr[58] == DBNull.Value ? null : Convert.ToString(dr[58]),
                                },
                                PaymentTermsDesc = dr[59] == DBNull.Value ? null : Convert.ToString(dr[59]),
                                SaleComment = dr[60] == DBNull.Value ? (dr[17] == DBNull.Value ? null : Convert.ToString(dr[17])) : Convert.ToString(dr[60]),
                                //,"GSTIDNumber","FreightTaxCodeID","UseCustomerTaxCode"
                                //GSTIDNumber = dr[61] == DBNull.Value ? 0 : Convert.ToInt32(dr[61]),
                                //FreightTaxCodeID = dr[61] == DBNull.Value ? 0 : Convert.ToInt32(dr[62]),
                                //UseCustomerTaxCode = dr[62] == DBNull.Value ? '-' : Convert.ToChar(dr[63]),
                            }).ToList();

            foreach (var customer in customerlist)
            {
                Response.Write("name:" + customer.Name + ";taxId:" + customer.TaxIDNumber + ";taxcodeID:" + customer.TaxCodeID + ";freightistaxed:" + customer.FreightIsTaxed + "<br>");
            }

        }

        public void Debug75()
        {
            using var context = new PPWDbContext();
            var purchaseitems = context.PurchaseItems.Where(x => x.pstCode == "IP100014").ToList();
            string status = purchaseitems.Any(x => x.IsPartial != null && (bool)x.IsPartial) ? "B" : "O";
            Response.Write(status + "<br>");
            purchaseitems = context.PurchaseItems.Where(x => x.pstCode == "IP100009").ToList();
            status = purchaseitems.Any(x => x.IsPartial != null && (bool)x.IsPartial) ? "B" : "O";
            Response.Write(status + "<br>");
        }

        public void CheckFileLocked(string file = "")
        {
            if (string.IsNullOrEmpty(file))
                file = ConfigurationManager.AppSettings["MYOBDb"];
            FileInfo fileInfo = new FileInfo(file);
            Response.Write(FileHelper.IsFileLocked(fileInfo));
        }
        public void Debug74()
        {
            using var context = new PPWDbContext();
            var admins = context.GetPosAdmin4Notification3(1, 1, Shop).ToList();
            var admin = admins.FirstOrDefault();
            var reviewurl = UriHelper.GetReviewSalesOrderUrl(ConfigurationManager.AppSettings["ReviewSalesOrderBaseUrl"], "WS100015", 0, admin.surUID);
            Response.Write(reviewurl);
        }

        public void Debug72()
        {
            var stritemcodes = string.Join(",", new string[] { "COCA-COLA" });
            using var context = new PPWDbContext();
            var itemvtInfo = context.GetValidThruInfo12(AccountProfileId, location, stritemcodes).ToList();
            var ivqList = from item in itemvtInfo
                          where item.piValidThru != null
                          group item by new { item.itmCode, item.piValidThru, item.pstCode } into itemgroup
                          select new
                          {
                              PoCode = itemgroup.Key.pstCode,
                              ItemCode = itemgroup.Key.itmCode,
                              ValidThru = CommonHelper.FormatDate((DateTime)itemgroup.Key.piValidThru),
                              TotalQty = itemgroup.Sum(x => x.vtQty)
                          };
            ivqList = ivqList.OrderBy(x => x.ItemCode).ToList();
            //Response.Write(ivqList.Count());
            if (ivqList.Count() > 0)
            {
                foreach (var item in ivqList)
                {
                    Response.Write(item.TotalQty + "<br>");
                }
            }
        }
        public void DateTimeParse()
        {
            DateTime datetimeValue;
            var dateString = @"14/04/2023";
            var delimiter = '/';
            //14/04/2023
            var dateformat = delimiter == '/' ? "dd/MM/yyyy" : "dd-MM-yyyy";
            DateTime.TryParseExact(dateString, dateformat, null,
                       DateTimeStyles.None, out datetimeValue);
            Response.Write(datetimeValue);
        }
        public void Debug71()
        {            
            using var connection = new Microsoft.Data.SqlClient.SqlConnection(ConnectionString);
            connection.Open();
            var CustomerList = connection.Query<PGCustomerModel>(@"EXEC dbo.GetCustomerList4Checkout1 @apId=@apId,@companyId=@companyId", new { apId, companyId }).ToList();
            foreach (var customer in CustomerList)
            {
                Response.Write(customer.cusCustomerID);
            }
        }

        public void GetAppUrl()
        {
            Response.Write(string.Concat(UriHelper.GetBaseUrl(), Request.ApplicationPath));
        }
      
        public void Base64()
        {
            Response.Write(HashHelper.Base64Encode("ck_cd730bb508e577f1ec4f2e311a7741a02ebffa8b:cs_55f0bd7dd1b31718e293a2fbb4f012a48d558cb3"));
        }
       
        public void Debug69()
        {
            var context = new PPWDbContext();
            var itemattrlist = context.ItemAttributes.AsNoTracking().Where(x => x.itmCode == "TEST023").ToList();
            var groupedlist = itemattrlist.GroupBy(x => x.itmCode + x.iaName).ToList();
            Response.Write(groupedlist.Count + "<hr>");
            foreach (var group in groupedlist)
            {
                Response.Write(group.Key + "<br>");
            }
        }

        public void UriTest()
        {
            Uri uri = new Uri("http://www.mywebsite.com:80/pages/page1.aspx");
            string requested = uri.Scheme + Uri.SchemeDelimiter + uri.Host + ":" + uri.Port;
            Response.Write("scheme:" + uri.Scheme + ";schemedelimiter:" + Uri.SchemeDelimiter + "<br/>");
            Response.Write(requested + "<br>");
            Response.Write(UriHelper.GetAppUrl() + "<br>");
            Response.Write(string.Format(@"{0}/ReceiptLogo/UNITED/file.png", UriHelper.GetBaseUrl()));
        }

        public void Debug67()
        {
            DeviceModel device = Session["Device"] as DeviceModel;
            Response.Write($"next deposit no:{device.dvcNextDepositNo}");
            var salesno = $"{device.dvcNextDepositNo:000000}";
            var salescode = string.Concat("DE", salesno);
            Response.Write(salescode);
        }

        [HttpGet]
        public JsonResult Debug65()
        {
            using var context = new PPWDbContext();
            DeviceModel device = Session["Device"] as DeviceModel;
            //DeviceModel device = GetDevice(model, context);
            //Response.Write($"next deposit no:{device.dvcNextDepositNo}");
            //var salesno = $"{device.dvcNextDepositNo:000000}";
            //var salescode = string.Concat("DE", salesno);
            //Response.Write(salescode);
            return Json(device, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetReceipt(string receiptno = "")
        {
            using (var context = new PPWDbContext())
            {
                //Session currsess = ModelHelper.GetCurrentSession(context);
                var shop = location;
                //var device = currsess.sesDvc;
                //var lang = 0;


                CentralDataModel model = getReceiptData(context, receiptno, "", lang, 0);

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

        public CentralDataModel getReceiptData(PPWDbContext context = null, string receiptno = "", string phoneno = "", int lang = -1, int refund = 1)
        {
            string checkoutportal = ConfigurationManager.AppSettings["DefaultCheckoutPortal"];
            //var currsess = ModelHelper.GetCurrentSession(context);
            var shop = location;
            //var device = currsess.sesDvc;
            var devicecode = device;
            //lang = lang == -1 ? currsess.sesLang : lang;
            //int apId = currsess.AccountProfileId;
            int salescusId = -1;
            decimal salesamt = 0;
            decimal refundamt = 0;
            decimal payamt = 0;
            PGCustomerModel customer = null;
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
                    customer = new PGCustomerModel
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

                if (checkoutportal == "abss")
                {
                    var _customer = context.SearchCustomer1(apId, salescusId, "").FirstOrDefault();
                    model.hascustomer = _customer != null;
                    if (model.hascustomer)
                    {
                        model.customer = new PGCustomerModel
                        {
                            cusCustomerID = _customer.cusCustomerID,
                            cusCode = _customer.cusCode,
                            cusName = _customer.cusName,
                            cusPointsSoFar = _customer.cusPointsSoFar,
                            cusPointsUsed = _customer.cusPointsUsed,
                            cusPhone = _customer.cusPhone,
                        };

                        Helpers.ModelHelper.getReceiptData1(context, receiptno, refund, shop, devicecode, ref model);

                        var itemcodes = model.salesLns.Select(x => x.rtlItemCode).ToList();
                        var items = (from i in context.MyobItems
                                     where itemcodes.Any(y => y == i.itmCode)
                                     select new ItemModel
                                     {
                                         itmCode = i.itmCode,
                                         itmName = i.itmName,
                                         itmDesc = i.itmDesc,
                                         itmTaxPc = i.itmTaxPc,
                                         itmBaseSellingPrice = i.itmBaseSellingPrice,
                                         itmIsNonStock = i.itmIsNonStock,
                                     }
                                                  ).ToList();

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

                        Helpers.ModelHelper.getReceiptData2(context, lang, shop, device, devicecode, model, receiptno);
                    }
                }
                else
                {
                    var _customer = context.SearchKCustomer(salescusId).FirstOrDefault();
                    model.hascustomer = _customer != null;
                    if (model.hascustomer)
                    {
                        model.kcustomer = new SalesCustomerModel
                        {
                            CustId = _customer.CustId,
                            CustCode = _customer.CustCode,
                            CustName = _customer.CustName,
                            CustPointsSoFar = _customer.CustPointsSoFar,
                            CustPointsUsed = _customer.CustPointsUsed,
                            CustPhone = _customer.CustPhone,
                        };

                        Helpers.ModelHelper.getReceiptData1(context, receiptno, refund, shop, devicecode, ref model);

                        var itemcodes = model.salesLns.Select(x => x.rtlItemCode).ToList();
                        var _items = context.GetKItemsByCodes3(string.Join(",", itemcodes)).ToList();

                        List<ItemModel> items = new List<ItemModel>();
                        if (_items != null)
                        {
                            foreach (var i in _items)
                            {
                                ItemModel item = new ItemModel
                                {
                                    itmCode = i.ItCode,
                                    itmName = i.ItName,
                                    itmDesc = i.ItDesc,
                                    itmTaxPc = i.txRate,
                                    itmBaseSellingPrice = i.ItPrice ?? 0,
                                    itmIsNonStock = !i.ForInventory
                                };
                                items.Add(item);
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

                        Helpers.ModelHelper.getReceiptData2(context, lang, shop, device, devicecode, model, receiptno);
                    }
                }

                model.taxModel = Helpers.ModelHelper.GetTaxInfo(context, checkoutportal);

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


        public void Debug64()
        {
            List<SalesItem> items = new List<SalesItem>();
            using var context = new PPWDbContext();
            var _items = context.GetItemList4Sales15(AccountProfileId, location, startIndex, pageSize, null).ToList();
            foreach (var i in _items)
            {
                var salesitem = new SalesItem
                {
                    itmItemID = i.itmItemID,
                    itmCode = i.itmCode,
                    itmName = i.itmName,
                    itmDesc = i.itmDesc,
                    itmTaxPc = i.itmTaxPc,
                    itmIsNonStock = i.itmIsNonStock,
                    itmSupCode = i.itmSupCode,
                    itmBaseSellingPrice = i.itmBaseSellingPrice,
                    itmLastUnitPrice = i.itmLastUnitPrice,
                    itmLastSellingPrice = i.itmLastSellingPrice,
                    itmUseDesc = i.itmUseDesc,
                    itmIsTaxedWhenSold = i.itmIsTaxedWhenSold,
                    //AccountProfileId = accountProfileId,
                    IncomeAccountID = (int)i.IncomeAccountID,
                    InventoryAccountID = (int)i.InventoryAccountID,
                    ExpenseAccountID = (int)i.ExpenseAccountID,
                    itmSellUnit = i.itmSellUnit,
                    itmBuyUnit = i.itmBuyUnit,
                    //Qty = (int)i.lstQuantityAvailable,
                    //QuantityAvailable = (int)i.lstQuantityAvailable,
                    //lstStockLoc = location,
                    chkBat = i.chkBat,
                    chkSN = i.chkSN,
                    chkVT = i.chkVT,
                };

                Response.Write(salesitem.itmCode + ":" + salesitem.NameDescTxt + ":" + i.itmUseDesc + ":" + i.itmDesc + ":" + i.itmName + "<br>");
                items.Add(salesitem);
            }


        }




        public void Debug59()
        {
            string strfrmdate = null;
            string strtodate = null;
            var SearchDates = new SearchDates();
            CommonHelper.GetSearchDates(strfrmdate, strtodate, ref SearchDates);
            Response.Write(SearchDates.DateFromTxt + ";" + SearchDates.DateToTxt);
        }
        public void Debug58()
        {
            //var filename = "Items_";
            //var url = string.Format(CentralApiUrl, filename, centralbaseUrl);
            //var url = "http://localhost:8888//Api/GetMyobData?filename=Items_";
            //HttpClient _client = new HttpClient();
            //_client.MaxResponseContentBufferSize = int.MaxValue;
            //var content = await _client.GetStringAsync(url);
            //List<AccountModel> accountlist = MYOBHelper.GetAccountList(ConnectionString);
            //DateTime dateTime = DateTime.Now;
            using var context = new PPWDbContext();
            //ComInfo ComInfo = context.ComInfoes.FirstOrDefault(x => x.Id == 1);
            //string ConnectionString = string.Format(@"Driver={0};TYPE=MYOB;UID={1};PWD={2};DATABASE={3};HOST_EXE_PATH={4};NETWORK_PROTOCOL=NONET;DRIVER_COMPLETION=DRIVER_NOPROMPT;KEY={5};ACCESS_TYPE=READ;", ComInfo.MYOBDriver, ComInfo.MYOBUID, ComInfo.MYOBPASS, ComInfo.MYOBDb, ComInfo.MYOBExe, ComInfo.MYOBKey);
            //List<MyobSupplierModel> suplist = MYOBHelper.GetSupplierList(ConnectionString);
            //using (var transaction = context.Database.BeginTransaction())
            //{
            //    try
            //    {
            //        /* remove current records first: */
            //        List<Supplier> suppliers = context.Suppliers.Where(x => x.AccountProfileId == AccountProfileId && x.CompanyId == CompanyId).ToList();
            //        context.Suppliers.RemoveRange(suppliers);
            //        context.SaveChanges();
            //        /*********************************/

            //        List<Supplier> newsuppliers = new List<Supplier>();

            //        foreach (var supplier in suplist)
            //        {
            //            Supplier msupplier = new Supplier();
            //            msupplier.supFirstName = supplier.supFirstName;
            //            msupplier.supId = supplier.supId;
            //            msupplier.supIsIndividual = supplier.supIsIndividual;
            //            msupplier.supIsActive = supplier.supIsActive;
            //            msupplier.supCode = supplier.supCode.StartsWith("*") ? supplier.supCardRecordID.ToString() : supplier.supCode;
            //            msupplier.supName = supplier.supName;
            //            msupplier.supFirstName = supplier.supFirstName;
            //            msupplier.supLastName = supplier.supLastName;
            //            msupplier.supIdentifierID = supplier.supIdentifierID;
            //            msupplier.supCustomField1 = supplier.supCustomField1;
            //            msupplier.supCustomField2 = supplier.supCustomField2;
            //            msupplier.supCustomField3 = supplier.supCustomField3;
            //            msupplier.CreateTime = dateTime;
            //            msupplier.ModifyTime = dateTime;
            //            msupplier.AccountProfileId = AccountProfileId;
            //            msupplier.CompanyId = CompanyId;
            //            msupplier.supAbss = true;
            //            newsuppliers.AddPG(msupplier);
            //        }
            //        context.Suppliers.AddRange(newsuppliers);
            //        Helpers.ModelHelper.WriteLog(context, "Import Supplier data from Central done", "ImportFrmCentral");
            //        context.SaveChanges();
            //        transaction.Commit();
            //    }
            //    catch (DbEntityValidationException e)
            //    {
            //        transaction.Rollback();
            //        StringBuilder sb = new StringBuilder();
            //        foreach (var eve in e.EntityValidationErrors)
            //        {
            //            sb.AppendFormat("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
            //                eve.Entry.Entity.GetType().Name, eve.Entry.State);
            //            foreach (var ve in eve.ValidationErrors)
            //            {
            //                sb.AppendFormat("- Property: \"{0}\", Value: \"{1}\", Error: \"{2}\"",
            //ve.PropertyName,
            //eve.Entry.CurrentValues.GetValue<object>(ve.PropertyName),
            //ve.ErrorMessage);
            //            }
            //        }
            //        Helpers.ModelHelper.WriteLog(context, string.Format("Import Supplier data from Central failed:{0}", sb.ToString()), "ExportFrmCentral");
            //        context.SaveChanges();
            //    }
            //}
            //Response.Write(suplist.Count + ";Done!");

            Helpers.ModelHelper.SaveSuppliersFrmCentral(context, AccountProfileId);
            Response.Write("Done!");
        }

        public void Debug57()
        {
            using var context = new PPWDbContext();
            var list = new Dictionary<string, string>();
            var _ComInfo = context.ComInfoes.FirstOrDefault(x => x.Id == CompanyId);

            Dictionary<string, decimal> exchangeRateToEuro = CommonHelper.GetExchangeRateToEuro();
            string[] currencyoptions = _ComInfo.StockInCurrencyOptions.Split(',');
            foreach (var co in currencyoptions)
            {
                list[co] = CommonHelper.GetExRate(exchangeRateToEuro, co);
            }
            var client = new RestClient("https://api.apilayer.com/currency_data/live?source=MOP&currencies=HKD");
            var request = new RestRequest("https://api.apilayer.com/currency_data/live?source=MOP&currencies=HKD", Method.Get);
            request.AddHeader("apikey", ConfigurationManager.AppSettings["CurrencyApiKey"]);
            RestResponse response = client.Execute(request);
            if (response != null && response.StatusCode == HttpStatusCode.OK)
            {
                CurrencyAPI currencyAPI = JsonConvert.DeserializeObject<CurrencyAPI>(response.Content);
                list["MOP"] = currencyAPI.quotes.MOPHKD.ToString();
            }

            foreach (var key in list.Keys)
            {
                Response.Write("Currenty:" + key + ";Rate:" + list[key] + "<br>");
            }
        }
        public void Debug56()
        {
            using var context = new PPWDbContext();
            var wscode = "WS000014";
            var deliveryitems = context.DeliveryItems.Where(x => x.dlCode == wscode).OrderBy(x => x.itmCode).ToList();
            var itemcodes = deliveryitems.Select(x => x.itmCode).Distinct().ToList();
            var itemInfoes = context.GetItemsByCodes11(apId, string.Join(",", itemcodes), NonAbss).ToList();

            var deliveryItems = new List<DeliveryItemModel>();
            foreach (var item in deliveryitems)
            {
                var itemInfo = itemInfoes.FirstOrDefault(x => x.itmCode == item.itmCode);

                deliveryItems.Add(new DeliveryItemModel
                {
                    dlCode = item.dlCode,
                    seq = item.seq,
                    dlStatus = item.dlStatus,
                    itmCode = item.itmCode,
                    dlBaseUnit = item.dlBaseUnit,
                    dlQty = item.dlQty,
                    dlBatch = item.dlBatch,
                    dlHasSN = item.dlHasSN,
                    dlValidThru = item.dlValidThru,
                    dlUnitPrice = item.dlUnitPrice,
                    dlDiscPc = item.dlDiscPc,
                    dlTaxPc = item.dlTaxPc,
                    dlAmt = item.dlAmt,
                    dlAmtPlusTax = item.dlAmtPlusTax,
                    snoCode = item.snoCode,
                    CreateTime = item.CreateTime,
                    Item = new ItemModel
                    {
                        itmCode = item.itmCode,
                        itmUseDesc = itemInfo.itmUseDesc ?? true,
                        itmName = itemInfo.itmName,
                        itmDesc = itemInfo.itmDesc
                    }
                });
            }

            var groupdelitems = deliveryItems.GroupBy(x => x.itmCode).ToList();
            foreach (var group in groupdelitems)
            {
                Response.Write("<h3>" + group.Key + "</h3>");
                var delitem = group.FirstOrDefault();
                Response.Write("qty:" + group.Sum(x => x.dlQty) + "<br>");
                if (delitem.dlBatch != null)
                {
                    var batchlist = group.Select(x => x.dlBatch).ToArray();
                    Response.Write("batchlist:" + string.Join(",", batchlist) + "<br>");
                }
                if (delitem.dlHasSN)
                {
                    var snlist = group.Select(x => x.snoCode).ToArray();
                    Response.Write("snlist:" + string.Join(",", snlist) + "<br>");
                }
                if (delitem.dlValidThru != null)
                {
                    var vtlist = group.Select(x => x.VtDisplay).ToArray();
                    Response.Write("vtlist:" + string.Join(",", vtlist) + "<br>");
                }
            }
        }

        //        public void Debug55()
        //        {
        //            using var context = new PPWDbContext();
        //            //var wsdate = context.WholeSales.FirstOrDefault().wsDate;
        //            //var wstime = wsdate.AddPG(DateTime.Now.TimeOfDay);
        //            //Response.Write(wstime);
        //            var psilist = context.GetWholeSalesLnListByCode6(1, 1, "WS000001", "order", true).ToList();
        //            var itemcodelist = psilist.Select(x => x.wslItemCode).ToList();
        //            string stritemcodes = string.Join(",", itemcodelist);
        //            var itemvtInfo = context.GetValidThruInfo12(1, 1, "office", stritemcodes).ToList();

        //            var ivqList = from item in itemvtInfo
        //                          where item.piValidThru != null
        //                          group item by new { item.itmCode, item.piValidThru, item.pstCode } into itemgroup
        //                          select new
        //                          {
        //                              ItemCode = itemgroup.Key.itmCode,
        //                              PoCode = itemgroup.Key.pstCode,
        //                              ValidThru = CommonHelper.FormatDate((DateTime)itemgroup.Key.piValidThru),
        //                              TotalQty = itemgroup.Sum(x => x.vtQty)
        //                          };
        //            ivqList = ivqList.OrderBy(x => x.ItemCode).ToList();
        //            foreach (var item in ivqList)
        //            {
        //                Response.Write(item.PoCode + ":" + item.ItemCode + ":" + item.ValidThru + ":" + item.TotalQty + "<br>");
        //            }
        //            /*
        //IP000086:TEST005:31/12/2022:2
        //IP000087:TEST005:31/01/2023:2
        //             */
        //        }

        public void Debug61()
        {
            using var context = new PPWDbContext();
            //string[] itemcodelist = new string[] { "TEST008", "TEST009", "TEST010", "TEST011", "TEST012", "TEST013", "TEST014" };
            string[] itemcodelist = new string[] { "TEST009" };
            string stritemcodes = string.Join(",", itemcodelist);
            var serialInfo = context.GetSerialInfo5(AccountProfileId, "office", stritemcodes, null).ToList();

            if (serialInfo.Count > 0)
            {
                foreach (var serial in serialInfo)
                {
                    var validthru = serial.snoValidThru == null ? "" : CommonHelper.FormatDate((DateTime)serial.snoValidThru);

                    Response.Write(serial.snoItemCode + ":" + serial.snoCode + ":" + serial.snoBatchCode + ":" + validthru + "<br>");
                    /*
TEST008:a1::31/01/2023
TEST008:a2::30/01/2023
TEST008:a3::29/01/2023
TEST008:a4::28/01/2023
TEST009:b1:btest1:12/01/2023
TEST009:b2:btest1:13/01/2023
TEST009:b3:btest1:14/01/2023
TEST009:b4:btest1:15/01/2023
TEST012:c1::
TEST012:c2::
TEST012:c3::
TEST012:c4::
TEST014:d1:btest1:
TEST014:d2:btest1:
TEST014:d3:btest1:
TEST014:d4:btest1:
                     */
                }
            }
        }

        public void Debug62()
        {
            using var context = new PPWDbContext();

            string[] itemcodelist = new string[] { "TEST005" };
            string stritemcodes = string.Join(",", itemcodelist);
            var itemvtInfo = context.GetValidThruInfo12(AccountProfileId, "office", stritemcodes).ToList();

            var ivqList = from item in itemvtInfo
                          where item.piValidThru != null
                          group item by new { item.itmCode, item.piValidThru, item.pstCode } into itemgroup
                          select new
                          {
                              PoCode = itemgroup.Key.pstCode,
                              ItemCode = itemgroup.Key.itmCode,
                              ValidThru = CommonHelper.FormatDate((DateTime)itemgroup.Key.piValidThru),
                              TotalQty = itemgroup.Sum(x => x.vtQty)
                          };
            ivqList = ivqList.OrderBy(x => x.ItemCode).ToList();

            if (ivqList != null && ivqList.Count() > 0)
            {
                var vtdelInfo = context.GetValidThruDeliveryInfo8(stritemcodes, AccountProfileId).ToList();
                foreach (var vi in ivqList)
                {
                    int delqty = 0;

                    if (vtdelInfo.Count > 0)
                    {
                        foreach (var di in vtdelInfo)
                        {
                            var divt = CommonHelper.FormatDate(di.vtValidThru);
                            if (vi.ItemCode == di.vtItemCode && vi.ValidThru == divt)
                            {
                                //delqty = (int)di.TotalVtDelQty;

                                //Response.Write(vi.ItemCode+":"+vi.ValidThru+":"+vi.TotalQty);
                                //if (batdelqty > 0)
                                //{
                                //    var vtdelqty = new VtDelQty
                                //    {
                                //        pocode = vi.PoCode,
                                //        vt = vi.ValidThru,
                                //        totaldelqty = (int)di.TotalVtDelQty
                                //    };
                                //    if (WholeSales.DicItemVtDelQtyList.ContainsKey(di.vtItemCode))
                                //        WholeSales.DicItemVtDelQtyList[di.vtItemCode].AddPG(vtdelqty);
                                //}
                                Response.Write(vi.ItemCode + ":" + vi.ValidThru + ":" + vi.TotalQty + ":" + delqty + "<br>");
                                break;
                            }
                        }
                    }

                    //if (WholeSales.DicItemVtQtyList.ContainsKey(vi.ItemCode))
                    //{
                    //    var vtqty = new VtQty
                    //    {
                    //        pocode = vi.PoCode,
                    //        vt = vi.ValidThru,
                    //        totalqty = (int)vi.TotalQty - batdelqty
                    //    };
                    //    if (vtqty.totalqty > 0)
                    //        WholeSales.DicItemVtQtyList[vi.ItemCode].AddPG(vtqty);
                    //}
                }
            }
        }

        public void Debug54()
        {
            using var context = new PPWDbContext();

            var DicIBVQList = new Dictionary<string, Dictionary<string, List<string>>>();
            var DicItemBVList = new Dictionary<string, Dictionary<string, List<string>>>();
            var DicItemSnVtList = new Dictionary<string, List<SnVt>>();
            var DicItemBatchQty = new Dictionary<string, List<BatchQty>>();

            var DicItemOptions = new Dictionary<string, ItemOptions>();
            //TEST008,TEST009,TEST010,TEST011,TEST012,TEST013,TEST014
            //string[] itemcodelist = new string[] { "TEST008", "TEST009", "TEST010", "TEST011", "TEST012", "TEST013", "TEST014" };
            string[] itemcodelist = new string[] { "TEST009" };
            //string[] itemcodelist = new string[] { "1200", "1300", "1120" };
            string stritemcodes = string.Join(",", itemcodelist);

            var itembtInfo = context.GetBatchVtInfoByItemCodes12(AccountProfileId, "office", stritemcodes).ToList();
            string strbatcodes = string.Join(",", itembtInfo.Select(x => x.batCode).ToList());

            var batdelInfo = context.GetBatchDeliveryInfo12(strbatcodes, stritemcodes, AccountProfileId).ToList();

            var ibqList = from item in itembtInfo
                              //join delitem in batdelInfo
                              //on item.batCode equals delitem.batdelCode
                          where item.batCode != null
                          //group item by new { item.itmCode, item.batCode, item.pstCode } into itemgroup
                          group item by new { item.itmCode, item.batCode } into itemgroup
                          select new
                          {
                              //PoCode = itemgroup.Key.pstCode,
                              ItemCode = itemgroup.Key.itmCode,
                              BatchCode = itemgroup.Key.batCode,
                              //BatQty = itemgroup.Key.batqty,
                              TotalQty = itemgroup.Sum(x => x.batQty)
                          };



            ibqList = ibqList.OrderBy(x => x.ItemCode).ThenBy(x => x.BatchCode).ToList();

            var ibvqList = from item in itembtInfo
                           where item.batCode != null
                           //group item by new { item.itmCode, item.ivBatCode, item.piValidThru } into itemgroup
                           select new
                           {
                               PoCode = item.pstCode,
                               ItemCode = item.itmCode,
                               BatchCode = item.batCode,
                               ValidThru = item.batValidThru == null ? "" : CommonHelper.FormatDate((DateTime)item.batValidThru),
                               BatQty = (int)item.batQty
                           };
            ibvqList = ibvqList.OrderBy(x => x.ItemCode).ThenBy(x => x.BatchCode).ToList();

            var batchcodelist = ibvqList.Select(x => x.BatchCode).Distinct().ToList();

            foreach (var itemcode in itemcodelist)
            {
                DicItemBatchQty[itemcode] = new List<BatchQty>();
                DicItemBVList[itemcode] = new Dictionary<string, List<string>>();
                foreach (var batchcode in batchcodelist)
                {
                    DicItemBVList[itemcode][batchcode] = new List<string>();
                }
            }

            foreach (var item in ibvqList)
            {
                foreach (var kv in DicItemBVList)
                {
                    if (kv.Key == item.ItemCode)
                    {
                        foreach (var k in kv.Value.Keys)
                        {
                            if (k == item.BatchCode)
                            {
                                DicItemBVList[kv.Key][k].Add(item.ValidThru);
                            }
                        }
                    }
                }
                Response.Write(item.PoCode + ":" + item.ItemCode + ":" + item.BatchCode + ":" + item.ValidThru + "; Total BatQty:" + item.BatQty + "<br>");
            }
            /*
IP000012:TEST009:btest1::4
IP000012:TEST011:btest1::2
IP000012:TEST011:btest2::1
IP000012:TEST011:btest3::1
IP000012:TEST013:btest1:12/01/2023:2
IP000012:TEST013:btest2:13/01/2023:1
IP000012:TEST013:btest3:14/01/2023:1
IP000012:TEST014:btest1::4
             */
            Response.Write("<hr>");
            //var DicItemBatchQty = new Dictionary<string, BatchQty>();


            foreach (var item in ibqList)
            {
                int delqty = 0;
                if (batdelInfo.Count > 0)
                {
                    foreach (var di in batdelInfo)
                    {
                        if (item.ItemCode == di.batItemCode && item.BatchCode == di.batCode)
                        {
                            //delqty = (int)di.TotalBatDelQty;
                            break;
                        }
                    }
                }

                DicItemBatchQty[item.ItemCode].Add(new BatchQty
                {
                    batcode = item.BatchCode,
                    //batqty = (int)item.BatQty,
                    batqty = (int)item.TotalQty - delqty
                });
                Response.Write(item.ItemCode + ":" + item.BatchCode + "; Total BatQty:" + item.TotalQty + "<br>");
            }
            /*
TEST009:btest1:4
TEST009:btest2:2
TEST013:btest1:4
TEST013:btest2:1
TEST013:btest3:1
             */

            foreach (var kv in DicItemBatchQty)
            {
                Response.Write("<h3>" + kv.Key + "</h3>");
                foreach (var item in kv.Value)
                {
                    Response.Write("<p>" + item.batcode + "; Remaining BatQty:" + item.batqty + "</p>");
                }
            }
            /*
TEST008
TEST009
btest1:4

btest2:2

TEST013
btest1:4

btest2:1

btest3:1
             */

            Response.Write("<hr>");

            foreach (var kv in DicItemBVList)
            {
                Response.Write("<h3>" + kv.Key + "</h3>");
                foreach (var batch in kv.Value.Keys)
                {
                    Response.Write("<h4>" + batch + "</h4>");
                    foreach (var vt in DicItemBVList[kv.Key][batch])
                    {
                        Response.Write("<p>" + vt + "</p>");
                    }
                }
            }
            /*
TEST008
btest1
btest2
btest3
TEST009
btest1
btest2
btest3
TEST013
btest1
25/12/2022

31/12/2022

btest2
26/12/2022

btest3
27/12/2022
             */
        }

        public void Debug52()
        {
            string test = "CoLastName,SaleDate,ItemNumber,Quantity,Price,Discount,Total,SaleStatus,CardID,AmountPaid,PaymentMethod,PaymentIsDue,DiscountDays,BalanceDueDays,PercentDiscount,PercentMonthlyCharge,DeliveryStatus,CustomersNumber,Job,Comment,SalespersonLastName,Memo,CurrencyCode,ExchangeRate,AddressLine1,AddressLine2,AddressLine3,AddressLine4,DeliveryDate";
            Response.Write(test.Split(',').Length);
        }

        public void Debug51()
        {
            using var context = new PPWDbContext();
            //var listinfo = context.GetStockTransferListByCode1(1, 1, "ST000005").ToList();
            //var variancesum = listinfo.Sum(x => x.stVariance);

            //    Response.Write(variancesum);
            var st = context.StockTransfers.Find(4);
            st.stRemark = "test";
            context.SaveChanges(); //saved! ok!

        }
        public void Debug50()
        {
            using var context = new PPWDbContext();
            var stlist = context.StockTransfers.ToList();
            var newstlist = new List<StockTransfer>();

            foreach (var stock in stlist)
            {
                if (stock.inQty > 0 || stock.outQty > 0)
                {
                    StockTransfer st = new StockTransfer
                    {
                        stSender = stock.stSender,
                        stReceiver = stock.stReceiver,
                        itmCode = stock.itmCode,
                        inQty = stock.inQty,
                        outQty = stock.outQty,
                        stShop = stock.stShop,
                        CreateTime = stock.CreateTime,
                        ModifyTime = stock.ModifyTime
                    };
                    newstlist.Add(st);
                }
            }

            var sendergrouplist = newstlist.GroupBy(x => new { x.stSender, x.itmCode, x.outQty }).ToList();
            var receivergrouplist = newstlist.GroupBy(x => new { x.stReceiver, x.itmCode }).ToList();
            var finallist = new List<TransferModel>();

            foreach (var sender in sendergrouplist)
            {
                foreach (var receiver in receivergrouplist)
                {
                    if (sender.Key.itmCode == receiver.Key.itmCode)
                    {
                        //var outqtylist = sender.Select(x => x.outQty).ToList();

                        finallist.Add(
                            new TransferModel
                            {
                                stSender = sender.Key.stSender,
                                stReceiver = receiver.Key.stReceiver,
                                itmCode = sender.Key.itmCode,
                                outQty = sender.Key.outQty,
                                inQty = sender.Key.outQty,
                            }
                            );
                    }
                }
            }

            var groupsrlist = finallist.GroupBy(x => string.Concat(x.stSender, ":", x.stReceiver)).ToList();
            foreach (var g in groupsrlist)
            {
                var key = g.Key.Split(':');
                var sender = key[0];
                var receiver = key[1];
                //var sender = g.Key[0];
                //var receiver = g.Key[1];
                //var sender = g.Key.stSender;
                //var receiver = g.Key.stReceiver;
                if (!string.IsNullOrEmpty(sender) && !string.IsNullOrEmpty(receiver))
                {
                    Response.Write($"{sender}:{receiver}<hr>");

                    //foreach (var v in finallist)
                    foreach (var v in g)
                    {
                        if (v.stSender == sender && v.stReceiver == receiver && !string.IsNullOrEmpty(v.stSender) && !string.IsNullOrEmpty(v.stReceiver))
                        {
                            Response.Write($"Sender: {v.stSender}; Item: {v.itmCode}; Receiver: {v.stReceiver}; outqty: {v.outQty}; inqty: {v.inQty} <br>");
                        }
                    }
                }
            }
        }
        public void Debug49()
        {
            int itext = 10;
            Response.Write($"{itext:0000}");
        }
        public void DateString()
        {
            CultureInfo enUK = new CultureInfo("en-UK");
            string dateString;
            DateTime dateValue;
            dateString = @"04/10/2022";
            if (DateTime.TryParseExact(dateString, "dd/MM/yyyy", enUK,
                                DateTimeStyles.None, out dateValue))
                Response.Write(string.Format("Converted '{0}' to {1} ({2}).", dateString, dateValue,
                                  dateValue.Kind));
            //Response.Write(CommonHelper.GetDateFrmString4SQL(strdate).ToLongDateString());

        }
        public void Debug48()
        {
            var client = new RestClient("https://api.apilayer.com/currency_data/live?source=MOP&currencies=HKD");
            var request = new RestRequest("https://api.apilayer.com/currency_data/live?source=MOP&currencies=HKD", Method.Get);
            request.AddHeader("apikey", ConfigurationManager.AppSettings["CurrencyApiKey"]);
            RestResponse response = client.Execute(request);
            if (response != null && response.StatusCode == HttpStatusCode.OK)
            {
                CurrencyAPI currencyAPI = JsonConvert.DeserializeObject<CurrencyAPI>(response.Content);
                Response.Write(currencyAPI.quotes.MOPHKD);
            }
            Response.Write("<br>" + response.Content);
        }
        public void ExRate()
        {
            Dictionary<string, decimal> exchangeRateToEuro = CommonHelper.GetExchangeRateToEuro();
            Response.Write(CommonHelper.GetExRate(exchangeRateToEuro, "USD", "HKD")); //7.85
            //Response.Write("<br>");
            //Response.Write(CommonHelper.CurrencyConversion(amount, "USD", "HK"));
        }

        public void Debug47()
        {
            string test = @"I am a beginner in c#. My question is, how can I count the number of characters in a string? Example: in some text i need to find certain letter";
            int icount = 20;
            string showtext = string.Concat(test.Substring(0, icount), " ...");
            Response.Write(showtext);
        }
        public async Task Debug46()
        {
            using var context = new PPWDbContext();
            var cominfo = context.ComInfoes.AsNoTracking().FirstOrDefault();
            var url = string.Format(CentralApiUrl, "Suppliers_", string.Format(cominfo.WebServiceUrl, UriHelper.GetBaseUrl()));
            //Response.Write(url);
            HttpClient _client = new HttpClient();
            _client.MaxResponseContentBufferSize = int.MaxValue;
            var content = await _client.GetStringAsync(url);
            var supplierlist = JsonConvert.DeserializeObject<List<MyobSupplierModel>>(content).ToList();
            foreach (var supplier in supplierlist)
            {
                Response.Write(supplier.supName + "<br>");
            }
            //Response.Write(content);
        }
        public void Debug45()
        {
            using var context = new PPWDbContext();
            var otherSettings = (from os in context.AppParams
                                 where os.appIsActive == true && os.CompanyId == 1
                                 select new OtherSettingsView
                                 {
                                     appUID = os.appUID,
                                     appParam = os.appParam,
                                     appVal = os.appVal,
                                     appIsActive = os.appIsActive,
                                     DisplayText = ""
                                 }).ToList();

        }

        public void Debug44()
        {
            using (var context = new PPWDbContext())
            {
                //var icount = context.GetPOSUserSessionCount3("admin", "P10", "office").FirstOrDefault();
                //if (icount != null)
                //{
                //    int poslic = int.Parse(ConfigurationManager.AppSettings["POSMaxDevicesAllowedInSameTime"]);
                //    if ((int)icount.PosUserSessionSum == poslic)
                //    {
                //        var msg = string.Format(Resources.Resource.OnlyDevicesAllowedInSameTime, poslic);
                //        Response.Write(msg);
                //    }
                //}
                //var _accessrights = context.GetDefaultSalesmanAccessRights("lcm").ToList();
                //Response.Write(_accessrights.Count);
                //var dicARs = Helpers.ModelHelper.GetDicAR(context,2);
                //foreach(var item in dicARs)
                //{
                //    Response.Write(item.Key + ";" + item.Value+"<br>");
                //}
                //var shop = "office";
                //var apId = 1;
                //var users = (from u in context.SysUsers
                //         where u.shopCode.ToLower() == shop && u.AccountProfileId == apId && !(u.UserCode.ToLower().Contains("admin"))
                //         && u.surLicensed == true
                //         select new UserModel
                //         {
                //             surUID = u.surUID,
                //             UserCode = u.UserCode,
                //             UserName = u.UserName,
                //             Email = u.Email,
                //             surIsActive = u.surIsActive,
                //             ManagerId = u.ManagerId,
                //             dvcCode = u.dvcCode,
                //             shopCode = u.shopCode
                //         }
                //                          ).ToList();
                //Response.Write(users.Count);
                //var LicensedUserCount = context.GetLicensedUserCount().FirstOrDefault();
                //var BtnClass = LicensedUserCount >= int.Parse(ConfigurationManager.AppSettings["POSLic"]) ? "linkdisabled" : "";
                //Response.Write(BtnClass);

                //var KSalesmanCode = context.SysUsers.FirstOrDefault(x => x.UserName.ToLower() == "lcm".ToLower()).UserCode;
                //Response.Write(KSalesmanCode);
                string strfrmdate = @"01/09/2022";
                string strtodate = @"13/09/2022";
                string format = DateFormat;
                DateTime frmdate = CommonHelper.ParseDateTime(strfrmdate, format).Date;
                DateTime todate = CommonHelper.ParseDateTime(strtodate, format).Date;
                string shopcode = "office";
                string device = "P10";

                var SalesList = (from s in context.RtlSales
                                     //join u in context.SysUsers
                                     //on s.rtsUpLdLog equals u.UserName
                                 join p in context.RtlPays
              on s.rtsCode equals p.rtpCode
                                 where s.rtsDate >= frmdate && s.rtsDate <= todate && s.rtsType == "RS" && s.rtsSalesLoc.ToLower() == shopcode && p.rtpSalesLoc.ToLower() == shopcode
                                 //&& u.surIsActive == true && u.shopCode.ToLower() == shopcode 
                                 && s.rtsDvc == device
                                 select new SalesModel
                                 {
                                     rtsTime = s.rtsTime,
                                     rtsDate = s.rtsDate,
                                     rtsCode = s.rtsCode,
                                     rtsUpLdLog = s.rtsUpLdLog,
                                     rtsFinalTotal = s.rtsFinalTotal,
                                     payId = p.rtpUID,
                                     Roundings = p.rtpRoundings,
                                     rtsMonthBase = s.rtsMonthBase
                                     //Change = (bool)p.rtpIsChange ? p.rtpPayAmt : null
                                 }
                                            ).OrderBy(x => x.rtsTime).ToList();
                Response.Write(SalesList.Count);
            }
        }
        public void DeviceIP()
        {
            Response.Write(CommonHelper.GetIPAddress());
        }
        public void LocalIP()
        {
            Response.Write(CommonHelper.GetLocalIPAddress());
        }



        public void Hostname()
        {
            //scheme:http;authority:localhost:9000;ab uri:http://localhost:9000/test/hostname
            //Response.Write("scheme:" + Request.Url.Scheme + ";authority:"+Request.Url.Authority+";ab uri:"+Request.Url.AbsoluteUri);

            ////Response.Write("<br>port:"+CommonHelper.GetPortNumber());
            //Response.Write("<br>");

            //string url = Request.Url.AbsoluteUri;

            //Regex r = new Regex(@"^(?<proto>\w+)://[^/]+?(?<port>:\d+)?/",
            //                    RegexOptions.None, TimeSpan.FromMilliseconds(150));
            //Match m = r.Match(url);
            //if (m.Success)
            //    Response.Write(m.Result("${port}"));
            UriBuilder myUri = new UriBuilder(Request.Url.Scheme, Request.Url.Host, UriHelper.GetPortNumber(), @"/POSFunc/Search?receiptno=");
            //http://localhost:9000/POSFunc/Search?receiptno=
            Response.Write(HttpUtility.UrlDecode(myUri.Uri.AbsoluteUri));
            //Response.Write("<br>");
            //var baseurl = string.Format(ConfigurationManager.AppSettings["ReviewSalesOrderBaseUrl"],"SA000001");
            //http://localhost:9000/Account/Login?redirectUrl=/POSFunc/Search?receiptno=SA100001
            // Response.Write(UriHelper.GetReviewSalesOrderUrl(ConfigurationManager.AppSettings["ReviewSalesOrderBaseUrl"], "SA100001"));

        }
        public void Debug42()
        {
            var deliveryAddressId = 3417;
            using (var context = new PPWDbContext())
            {
                var customerinfo = context.CustomerInfo4Abss.Where(x => x.Id == deliveryAddressId).FirstOrDefault();
                var deliveryAddress = string.Concat(customerinfo.StreetLine1, " ", customerinfo.StreetLine2, " ", customerinfo.StreetLine3, " ", customerinfo.StreetLine4, " ", customerinfo.City, " ", customerinfo.State, " ", customerinfo.Country);
                var addr1 = ""; var addr2 = ""; var addr3 = ""; var addr4 = "";
                if (!string.IsNullOrEmpty(deliveryAddress))
                {
                    Response.Write("length:" + deliveryAddress.Length + "<br>");
                    addr1 = deliveryAddress.Length >= 255 ? deliveryAddress.Substring(0, 255) : deliveryAddress.Substring(0, deliveryAddress.Length);
                    if (deliveryAddress.Length > 255 && deliveryAddress.Length <= 510)
                    {
                        addr2 = deliveryAddress.Substring(256, 510);
                    }

                    if (deliveryAddress.Length > 510 && deliveryAddress.Length <= 765)
                    {
                        addr3 = deliveryAddress.Substring(511, 765);
                    }

                    if (deliveryAddress.Length > 765 && deliveryAddress.Length <= 1020)
                    {
                        addr4 = deliveryAddress.Substring(766, 1020);
                    }
                }

                Response.Write(addr1 + " " + addr2 + " " + addr3 + " " + addr4);
            }
        }
        public async Task GetEmployee()
        {
            var dsn = "g3_office";
            var filename = "Employees_";
            var url = string.Format(CentralApiUrl, dsn, filename, CentralBaseUrl);
            HttpClient _client = new HttpClient();
            _client.MaxResponseContentBufferSize = int.MaxValue;
            var content = await _client.GetStringAsync(url);
            var emplist = JsonConvert.DeserializeObject<List<MyobEmployeeModel>>(content);
            Response.Write(emplist.Count);
        }

        public async Task SendMail()
        {
            var idList = "58,59";
            GetSalesManagerInfoByGroupId_Result salesmanager = new GetSalesManagerInfoByGroupId_Result();
            var groupId = 1;
            var contactnamelist = new List<string>();

            using (var context = new PPWDbContext())
            {
                salesmanager = context.GetSalesManagerInfoByGroupId(groupId).FirstOrDefault();

                var _contactlist = context.GetContactListByIDs2(idList).ToList();
                foreach (var contact in _contactlist)
                {
                    var contactname = !string.IsNullOrEmpty(contact.cusName) ? contact.cusName : contact.cusContact;
                    contactnamelist.Add(contactname);
                }
            }

            EmailEditModel model = new EmailEditModel();
            var mailsettings = model.Get();
            int okcount = 0;
            int ngcount = 0;
            MailAddress frm = new MailAddress(mailsettings.emEmail, mailsettings.emDisplayName);

            while (okcount == 0)
            {
                if (ngcount >= mailsettings.emMaxEmailsFailed || okcount > 0)
                {
                    break;
                }

                MailAddress to = new MailAddress(salesmanager.Email, salesmanager.UserName);
                bool addbc = int.Parse(ConfigurationManager.AppSettings["AddBccToDeveloper"]) == 1;
                MailAddress addressBCC = new MailAddress(ConfigurationManager.AppSettings["DeveloperEmailAddress"], ConfigurationManager.AppSettings["DeveloperEmailName"]);
                MailMessage message = new MailMessage(frm, to);
                if (addbc)
                {
                    message.Bcc.Add(addressBCC);
                }
                message.Subject = Resources.Resource.ContactsAssignedGroup;
                message.BodyEncoding = Encoding.UTF8;
                message.IsBodyHtml = true;

                var lilist = "";
                foreach (var contact in contactnamelist)
                {
                    lilist += $"<li>{contact}</li>";
                }
                string mailbody = $"<h3>Hi {salesmanager.UserName}</h3><p>The following contacts are assigned to your group:</p><ul>{lilist}</ul>";
                message.Body = mailbody;

                using (SmtpClient smtp = new SmtpClient(mailsettings.emSMTP_Server, mailsettings.emSMTP_Port))
                {
                    smtp.UseDefaultCredentials = false;
                    smtp.EnableSsl = mailsettings.emSMTP_EnableSSL;
                    smtp.Credentials = new NetworkCredential(mailsettings.emSMTP_UserName, mailsettings.emSMTP_Pass);
                    try
                    {
                        //EmailHelper.NEVER_EAT_POISON_Disable_CertificateValidation();
                        await smtp.SendMailAsync(message);
                        okcount++;
                    }
                    catch (Exception)
                    {
                        ngcount++;
                    }
                }
            }

        }

        public void Debug41()
        {
            var idList = new List<long>();
            idList.Add(58);
            idList.Add(59);
            using (var context = new PPWDbContext())
            {
                var contactnamelist = new List<string>();
                var _contactlist = context.GetContactListByIDs2(string.Join(",", idList)).ToList();
                foreach (var contact in _contactlist)
                {
                    var contactname = !string.IsNullOrEmpty(contact.cusName) ? contact.cusName : contact.cusContact;
                    Response.Write(contactname + "<br>");
                }

            }
        }

        public void JsonTest()
        {
            Response.Write(PPWLib.Helpers.JsonHelper.Test());
        }

        public void Debug40()
        {
            using (var context = new PPWDbContext())
            {
                string[] attrnames = new[] { "Locality", "Industry", "PGCustomer", "Account Software", "Antivirus Software", "Server OS", "Mobile" };
                foreach (var attrname in attrnames)
                {
                    List<string> values = context.CustomAttributeValues.Where(x => x.attrId.Contains(attrname)).Select(x => x.attrValue).Distinct().ToList();
                    GlobalAttribute gatt = context.GlobalAttributes.FirstOrDefault(x => x.attrName == attrname);
                    gatt.attrValue = String.Join("||", values);
                }
                context.SaveChanges();
            }
        }

        public async Task UploadRefund()
        {
            var strfrmdate = @"12/08/2022";
            var strtodate = @"14/08/2022";
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
            using (var context = new PPWDbContext())
            {
                var icount = context.GetSalesRefundCount(frmdate, todate).FirstOrDefault().GetValueOrDefault();
                if (icount > 0)
                {
                    strfrmdate = frmdate.ToString("yyyyMMdd");
                    strtodate = todate.ToString("yyyyMMdd");
                    string url = kingdeeApiBaseUrl + "UploadRefund?strfrmdate=" + strfrmdate + "&strtodate=" + strtodate + "&device=" + "P10" + "&shop=" + "office";
                    HttpClient _client = new HttpClient();
                    _client.MaxResponseContentBufferSize = int.MaxValue;
                    var content = await _client.GetStringAsync(url);
                    Response.Write(content);
                }
            }
        }

        public async Task UploadInvoice()
        {
            var strfrmdate = @"10/08/2022";
            var strtodate = @"12/08/2022";
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
            using (var context = new PPWDbContext())
            {
                var icount = context.GetSalesInvoicesCount(frmdate, todate, false).FirstOrDefault().GetValueOrDefault();
                if (icount > 0)
                {
                    //SessUser user = Session["User"] as SessUser;
                    int iIncludeUploaded = 0;
                    //int lang = CultureHelper.CurrentCulture;
                    int lang = 2;
                    strfrmdate = frmdate.ToString("yyyyMMdd");
                    strtodate = todate.ToString("yyyyMMdd");
                    string url = kingdeeApiBaseUrl + "UploadInvoice?strfrmdate=" + strfrmdate + "&strtodate=" + strtodate + "&device=" + "P10" + "&shop=" + "office" + "&iIncludeUploaded=" + iIncludeUploaded + "&lang=" + lang;
                    HttpClient _client = new HttpClient();
                    _client.MaxResponseContentBufferSize = int.MaxValue;
                    var content = await _client.GetStringAsync(url);
                    Response.Write(content);
                }
                else
                {

                }
            }



        }

        public void PlaceHolder()
        {
            var sJson = "{\"NumberSearch\":\"true\",\"ValidateFlag\":\"true\",\"IsDeleteEntry\":\"true\",\"IsEntryBatchFill\":\"true\",\"NeedUpDateFields\":[],\"NeedReturnFields\":[],\"SubSystemId\":\"\",\"InterationFlags\":\"\",\"Model\":[[0]],\"BatchCount\":0,\"IsVerifyBaseDataField\":\"false\",\"IsAutoAdjustField\":\"false\",\"IgnoreInterationFlag\":\"false\"}".Replace("[0]", "test");

            Response.Write(sJson);
        }

        public async Task Kingdee()
        {
            #region SettleType
            KingdeeQueryType kqtype = KingdeeQueryType.SettleType;
            #endregion

            #region TaxRate
            //KingdeeQueryType kqtype = KingdeeQueryType.TaxRate;
            #endregion

            #region Item
            //KingdeeQueryType kqtype = KingdeeQueryType.Item;
            #endregion

            #region PriceList
            //KingdeeQueryType kqtype = KingdeeQueryType.PriceList;
            #endregion

            #region ItemPrice
            //price id:XSJMB0002
            //KingdeeQueryType kqtype = KingdeeQueryType.ItemPrice;
            #endregion

            #region ItemStock
            //KingdeeQueryType kqtype = KingdeeQueryType.ItemStock;
            #endregion

            #region Stock
            //KingdeeQueryType kqtype = KingdeeQueryType.Stock;
            #endregion

            await query(kqtype);
        }

        private async Task query(KingdeeQueryType kqtype, int startIndex = 0, int pageSize = 10, string orderString = "")
        {
            string url = $"{kingdeeApiBaseUrl}query?kqtype={(int)kqtype}&startIndex={startIndex}&pageSize={pageSize}&orderString={orderString}";
            HttpClient _client = new HttpClient();
            _client.MaxResponseContentBufferSize = int.MaxValue;
            string content = await _client.GetStringAsync(url);
            DateTime dateTime = DateTime.Now;

            if (content != null)
            {
                if (kqtype == KingdeeQueryType.SettleType)
                {
                    Response.Write(content);
                }
                if (kqtype == KingdeeQueryType.TaxRate)
                {
                    var _result = JsonConvert.DeserializeObject<List<List<object>>>(content);
                    if (_result != null)
                    {
                        using (var context = new PPWDbContext())
                        {
                            #region Remove Current Records First
                            context.Database.ExecuteSqlCommand("TRUNCATE TABLE [Kingdee.TaxRate]");
                            await context.SaveChangesAsync();
                            #endregion

                            #region Add Records
                            //FId,FNumber,FName,FDescription,FIsVat,FTaxRate
                            List<Kingdee_TaxRate> txlist = new List<Kingdee_TaxRate>();
                            foreach (var item in _result)
                            {
                                Kingdee_TaxRate tx = new Kingdee_TaxRate
                                {
                                    txId = Convert.ToInt32(item[0]),
                                    txCode = item[1].ToString(),
                                    txName = item[2].ToString(),
                                    txDesc = item[3].ToString(),
                                    txIsVat = Convert.ToBoolean(item[4]),
                                    txRate = Convert.ToDecimal(item[5]),
                                    CreateTime = dateTime,
                                    ModifyTime = dateTime
                                };
                                txlist.Add(tx);
                            }
                            context.Kingdee_TaxRate.AddRange(txlist);
                            await context.SaveChangesAsync();
                            #endregion
                        }
                    }
                }

                if (kqtype == KingdeeQueryType.ItemStock)
                {
                    //FStockId,FMaterialId,FBaseQty,FStockLocId,FStockOrgId,FOwnerId,FKeeperId,FBaseUnitId,FStockUnitId,FMaterialId.FNumber
                    //[[193340,100219,200.0000000000],[193340,100220,200.0000000000]]
                    var _result = JsonConvert.DeserializeObject<List<List<object>>>(content);
                    if (_result != null)
                    {
                        using (var context = new PPWDbContext())
                        {
                            #region Remove Current Records First
                            context.Database.ExecuteSqlCommand("TRUNCATE TABLE [Kingdee.ItemStock]");
                            await context.SaveChangesAsync();
                            #endregion

                            #region Add Records
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
                                    ModifyTime = dateTime
                                };
                                stlist.Add(st);
                            }
                            context.Kingdee_ItemStock.AddRange(stlist);
                            await context.SaveChangesAsync();
                            #endregion
                        }
                    }

                }
                if (kqtype == KingdeeQueryType.Stock)
                {
                    var _result = JsonConvert.DeserializeObject<List<List<object>>>(content);
                    if (_result != null)
                    {
                        using (var context = new PPWDbContext())
                        {
                            #region Remove Current Records First
                            context.Database.ExecuteSqlCommand("TRUNCATE TABLE [Kingdee.Stock]");
                            await context.SaveChangesAsync();
                            #endregion

                            //FStockId,FNumber,FName,FCreateOrgId,FUseOrgId,FCreatorId
                            //[[193135,"CK001","倉庫1",1],[193340,"CK002","倉庫2",1]]
                            List<Kingdee_Stock> stlist = new List<Kingdee_Stock>();
                            //DeviceModel device = Session["Device"] as DeviceModel;
                            var location = ConfigurationManager.AppSettings["Shop"];
                            foreach (var item in _result)
                            {
                                Kingdee_Stock st = new Kingdee_Stock
                                {
                                    stId = Convert.ToInt32(item[0]),
                                    stCode = item[1].ToString(),
                                    stName = item[2].ToString(),
                                    stCreateOrgId = Convert.ToInt32(item[3]),
                                    stUseOrgId = Convert.ToInt32(item[4]),
                                    stCreatorId = Convert.ToInt32(item[5]),
                                    dvcStockLoc = location,
                                    CreateTime = dateTime,
                                    ModifyTime = dateTime
                                };
                                stlist.Add(st);
                            }
                            context.Kingdee_Stock.AddRange(stlist);
                            await context.SaveChangesAsync();
                        }
                    }
                }
                if (kqtype == KingdeeQueryType.Organization)
                {
                    var _result = JsonConvert.DeserializeObject<List<List<object>>>(content);
                    List<Kingdee_Organization> orgs = new List<Kingdee_Organization>();
                    using (var context = new PPWDbContext())
                    {
                        //[[1,"100","蓝海实业集团"],[100035,"101","蓝海通讯公司"]...]
                        foreach (var item in _result)
                        {
                            var org = new Kingdee_Organization
                            {
                                OrgId = Convert.ToInt32(item[0]),
                                OrgCode = item[1].ToString(),
                                OrgName = item[2].ToString(),
                                CreateTime = dateTime,
                                ModifyTime = dateTime
                            };
                            orgs.Add(org);
                        }
                        context.Kingdee_Organization.AddRange(orgs);
                        await context.SaveChangesAsync();
                    }
                }
                if (kqtype == KingdeeQueryType.Item)
                {
                    using (var context = new PPWDbContext())
                    {
                        #region Remove Current Records First
                        context.Database.ExecuteSqlCommand("TRUNCATE TABLE [Kingdee.Item]");
                        await context.SaveChangesAsync();
                        #endregion

                        #region Add Records
                        var _result = JsonConvert.DeserializeObject<List<List<object>>>(content);
                        List<Kingdee_Item> kitems = new List<Kingdee_Item>();
                        foreach (var item in _result)
                        {
                            //FMaterialId,FNumber,FName,FIsInventory,FMaterialGroup,FCreateOrgId,FUseOrgId,FCreatorId,FDescription,FTaxRateId                      
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
                                ItTaxRateId = Convert.ToInt32(item[9]),
                                CreateTime = dateTime,
                                ModifyTime = dateTime,
                            };
                            kitems.Add(kitem);
                        }

                        context.Kingdee_Item.AddRange(kitems);
                        await context.SaveChangesAsync();
                        #endregion
                    }
                }
                if (kqtype == KingdeeQueryType.PriceList)
                {
                    var _result = JsonConvert.DeserializeObject<List<List<object>>>(content);
                    if (_result != null)
                    {
                        using (var context = new PPWDbContext())
                        {
                            #region Remove Current Records First
                            context.Database.ExecuteSqlCommand("TRUNCATE TABLE [Kingdee.PriceList]");
                            await context.SaveChangesAsync();
                            #endregion

                            #region Add Records
                            List<Kingdee_PriceList> pllist = new List<Kingdee_PriceList>();
                            foreach (var item in _result)
                            {
                                Kingdee_PriceList pl = new Kingdee_PriceList
                                {
                                    plId = item[0].ToString(),
                                    plName = item[1].ToString(),
                                    plSaleOrgId = Convert.ToInt32(item[2]),
                                    plUseOrgId = Convert.ToInt32(item[3]),
                                    plCreatorId = Convert.ToInt32(item[4]),
                                    CreateTime = dateTime,
                                    ModifyTime = dateTime
                                };
                                pllist.Add(pl);
                            }
                            context.Kingdee_PriceList.AddRange(pllist);
                            await context.SaveChangesAsync();
                            #endregion
                        }
                    }
                }
                if (kqtype == KingdeeQueryType.ItemPrice)
                {
                    if (!string.IsNullOrEmpty(content))
                    {
                        using (var context = new PPWDbContext())
                        {
                            KingdeeAccountInfo info = KingdeeHelper.GetKingdeeAccountInfo(context);
                            #region Remove current data first
                            var pllists = context.Kingdee_ItemPrice.Where(x => x.plId == info.PriceListId).ToList();
                            if (pllists != null)
                            {
                                context.Kingdee_ItemPrice.RemoveRange(pllists);
                                await context.SaveChangesAsync();
                            }
                            #endregion
                            #region Import data
                            var _result = JsonConvert.DeserializeObject<KItemPriceModel>(content);
                            var itpricelist = _result.Result.Result.SAL_PRICELISTENTRY;
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
                                    ModifyTime = dateTime
                                };
                                itemPrices.Add(ip);
                            }
                            context.Kingdee_ItemPrice.AddRange(itemPrices);
                            await context.SaveChangesAsync();
                            #endregion
                        }
                    }
                }
                if (kqtype == KingdeeQueryType.Customer)
                {
                    var _result = Newtonsoft.Json.JsonConvert.DeserializeObject<List<List<object>>>(content);
                    using (var context = new PPWDbContext())
                    {
                        List<Kingdee_Customer> kcustomers = new List<Kingdee_Customer>();
                        foreach (var customer in _result)
                        {
                            //FCustID,FNumber,FName
                            List<int> custIdlist = new List<int>();
                            int custId = Convert.ToInt32(customer[0]);
                            if (!custIdlist.Any(x => x == custId))
                            {
                                Kingdee_Customer kcustomer = new Kingdee_Customer
                                {
                                    CustId = Convert.ToInt32(customer[0]),
                                    CustCode = customer[1].ToString(),
                                    CustName = customer[2].ToString(),
                                    CreateTime = dateTime,
                                    ModifyTime = dateTime,
                                };
                                kcustomers.Add(kcustomer);
                                custIdlist.Add(custId);
                            }
                        }
                        context.Kingdee_Customer.AddRange(kcustomers);
                        await context.SaveChangesAsync();
                    }
                }
            }
        }

        public void EnumTest()
        {
            Response.Write(RoleType.SalesPerson.ToString());
        }

        public class PhoneMail
        {
            public string phone { get; set; }
            public string mail { get; set; }
        }

        public ActionResult GChartDemo()
        {
            return View();
        }

        private void SetObjectProperty(string propertyName, int value, ref object myclass)
        {
            //some processing on the rest of the code to make sure we actually want to set this value.
            myclass.GetType().GetProperty(propertyName).SetValue(myclass, value, null);
        }





        public ActionResult C3Demo()
        {
            return View();
        }


        public void Debug29()
        {
            var dataTransferMode = DataTransferMode.NoInternet;
            var IsOffLine = (ConfigurationManager.AppSettings["IsPNG"] == "1" && ConfigurationManager.AppSettings["DemoOffline"] == "1") || (ConfigurationManager.AppSettings["IsPNG"] == "1" && dataTransferMode == DataTransferMode.NoInternet) ? 1 : 0;
            Response.Write(IsOffLine);
        }

        public ActionResult SubmitTest(string attrname = "", string attrval = "")
        {
            using (var context = new PPWDbContext())
            {
                TestModel model = new TestModel();
                var list = context.EmailSettings.ToList();
                model.MailList = list;
                model.attrname = attrname;
                model.attrval = attrval;
                return View(model);
            }

        }

        public void Debug28()
        {
            string url = @"http://192.168.123.54:9000/eTrack/ViewResult?blastId=1234&contact=test&email=kevinlau@united.com.hk";
            Response.Write(url + "<hr>");
            url = new MvcHtmlString(url).ToHtmlString();
            Response.Write(url);
        }



        public void Debug25()
        {
            using (var context = new PPWDbContext())
            {
                var model = new EmailModel();
                EmailSetting EmailSetting = context.EmailSettings.FirstOrDefault(x => x.Id == 1 && x.AccountProfileId == 1);
                if (EmailSetting != null)
                {
                    model.Id = EmailSetting.Id;
                    model.emDisplayName = EmailSetting.emDisplayName;
                    model.emEmail = EmailSetting.emEmail;
                    model.emSMTP_Auth = EmailSetting.emSMTP_Auth;
                    model.emSMTP_Server = EmailSetting.emSMTP_Server;
                    model.emSMTP_Pass = EmailSetting.emSMTP_Pass;
                    model.emSMTP_Port = EmailSetting.emSMTP_Port;
                    model.emSMTP_UserName = EmailSetting.emSMTP_UserName;
                    model.emEmailsPerSecond = EmailSetting.emEmailsPerSecond;
                    model.emMaxEmailsFailed = EmailSetting.emMaxEmailsFailed;
                    model.emEmailTrackingURL = EmailSetting.emEmailTrackingURL;
                    model.AccountProfileId = EmailSetting.AccountProfileId;
                    model.CreateTime = EmailSetting.CreateTime;
                    model.ModifyTime = EmailSetting.ModifyTime;
                    model.emOffice365 = EmailSetting.emOffice365;
                    model.iOffice365 = EmailSetting.emOffice365 ? 1 : 0;
                }
                Response.Write(model.emOffice365);
            }
        }


        [HttpGet]
        public ViewResult AjaxPostList()
        {
            return View();
        }





        public void Debug22()
        {
            using (var context = new PPWDbContext())
            {
                var sql = $"Select count(itemID) From MyobItemPrice Where AccountProfileId=1 and (SellingPrice>0 || UnitPrice>0);";
                var mvaliditemscount = context.Database.SqlQuery<int>(sql);
                Response.Write(mvaliditemscount);
            }
        }

        public void Debug21()
        {
            using (var context = new PPWDbContext())
            {
                //var apId = 1;
                //var sql = "Select cusPhone, cusEmail From MyobCustomer Where cusPhone is not null and AccountProfileId=1 and cusIsActive=1 " +
                //    "Union Select cusPhone, cusEmail From PGCustomer Where cusPhone is not null and AccountProfileId=1 and cusIsActive=1;";
                var startIndex = 0;
                var pageSize = 10;
                var accountProfileId = 1;
                var sql = $"Select itmCode,itmName from MyobItem where AccountProfileId={accountProfileId} and itmIsActive=1 Order by itmCode Offset {startIndex} rows Fetch Next {pageSize} rows only";

                try
                {
                    var items = context.Database.SqlQuery<SalesItem>(sql).ToList();
                    foreach (var item in items)
                    {
                        //if (!string.IsNullOrEmpty(email))
                        //{
                        //Response.Write(string.Format("{0}<br>", item.key));
                        //}

                    }
                }
                catch (Exception)
                {

                }

            }
        }

        public void Debug20()
        {
            using (var context = new PPWDbContext())
            {
                var customerlist = (from s in context.RtlSales
                                    join customer in context.MyobCustomers
                                    on s.rtsCusID equals customer.cusCustomerID
                                    select new PGCustomerModel
                                    {
                                        cusFirstName = customer.cusFirstName,
                                        cusIsOrganization = customer.cusIsOrganization,
                                        cusContact = customer.cusContact,
                                        cusCustomerID = customer.cusCustomerID,
                                        cusCode = customer.cusCode,
                                        cusName = customer.cusName,
                                        cusPhone = customer.cusPhone,
                                        cusPointsSoFar = customer.cusPointsSoFar,
                                        cusPointsUsed = customer.cusPointsUsed,
                                        cusPriceLevelID = customer.cusPriceLevelID,
                                        cusIsActive = customer.cusIsActive,
                                        CreateTime = (DateTime)customer.CreateTime,
                                        ModifyTime = customer.ModifyTime,
                                        cusEmail = customer.cusEmail
                                    }
                                    ).ToList();

                var groupedcuslist = customerlist.GroupBy(x => x.cusCustomerID).ToList();
                foreach (var group in groupedcuslist)
                {
                    Response.Write(group.Max(x => x.cusPointsActive));
                }
            }
        }




        public void Debug18()
        {
            var today = DateTime.Today;
            var month = new DateTime(today.Year, today.Month, 1);
            var first = month.AddMonths(-1);
            Response.Write(first.Date.ToString());
            //using (var context = new PPWDbContext())
            //{

            //}
        }


        public void Debug16()
        {
            //string joinedcollist = string.Concat(MyobHelper.ExportCustomerColList, ",", MyobHelper.ExportAddressColList);
            //string joinedcol= string.Concat("CustomerID,CardRecordID,CardIdentification",Environment.NewLine);
            string joinedcol = "CustomerID,CardRecordID,CardIdentification";
            //List<string> snum = new List<string>();
            var joinedcollist = joinedcol.Split(',');
            //int collen = joinedcollist.Length;
            ////Response.Write(collen + "<br>");
            ////collen++;
            //for (int i = 0; i < collen; i++)
            //{
            //    snum.AddPG("{" + i + "}");
            //}
            //string strsnum = string.Join(",", snum);//{0},{1},{2}
            var sb = new StringBuilder();

            //Response.Write(joinedcollist+"<br>");

            try
            {
                //sb.AppendFormat(strsnum, joinedcollist, Environment.NewLine);
                //sb.AppendFormat(strsnum, joinedcollist);

                sb.AppendFormat("{0},{1},{2}", joinedcollist);
                //sb.AppendFormat("{0},{1},{2},{3}", joinedcollist, Environment.NewLine);
                Response.Write(sb.ToString());
            }
            catch (Exception ex)
            {
                Response.Write(ex.Message);
            }


        }

        public void Debug14()
        {

        }

        async Task asyncTask()
        {
            var sw = new Stopwatch();
            sw.Start();
            Response.Write("async: Starting *");
            Task delay = Task.Delay(5000);
            Response.Write(string.Format("async: Running for {0} seconds **", sw.Elapsed.TotalSeconds));
            await delay;
            Response.Write(string.Format("async: Running for {0} seconds ***", sw.Elapsed.TotalSeconds));
            Response.Write("async: Done ****");
        }
        void syncCode()
        {
            var sw = new Stopwatch();
            sw.Start();
            Response.Write("sync: Starting *****");
            Thread.Sleep(5000);
            Response.Write(string.Format("sync: Running for {0} seconds ******", sw.Elapsed.TotalSeconds));
            Response.Write("sync: Done *******");
        }

        public void Debug13()
        {
            //Task delay = asyncTask();
            //syncCode();
            //delay.Wait();
            Response.Write("1");
            System.Threading.Thread.Sleep(TimeSpan.FromSeconds(3));
            Response.Write("debug13 done");
        }

        public void Debug11()
        {
            int accountProfileId = 1;
            using (var context = new PPWDbContext())
            {
                var customerlist = (from c in context.MyobCustomers
                                        //join pl in context.PriceLevels
                                        //on c.cusPriceLevelID equals pl.PriceLevelID
                                        //join ap in context.AccountProfiles
                                        //on c.AccountProfileId equals ap.Id
                                        //where c.cusIsActive == true
                                    where c.AccountProfileId == accountProfileId
                                    //&& ap.Id == accountProfileId
                                    select new PGCustomerModel
                                    {
                                        cusCustomerID = c.cusCustomerID,
                                        cusCode = c.cusCode,
                                        cusName = c.cusName,
                                        cusPhone = c.cusPhone,
                                        cusPointsSoFar = c.cusPointsSoFar,
                                        cusPointsUsed = c.cusPointsUsed,
                                        cusPriceLevelID = c.cusPriceLevelID,
                                        //cusPriceLevelDescription = pl.Description,
                                        cusIsActive = c.cusIsActive,
                                        CreateTime = (DateTime)c.CreateTime,
                                        ModifyTime = c.ModifyTime,
                                        cusEmail = c.cusEmail,
                                        //AccountProfileName = ap.ProfileName,
                                        //AccountProfileId = c.AccountProfileId
                                    }
                             ).ToList();

                foreach (var customer in customerlist)
                {
                    Response.Write(customer.cusName + ";" + customer.cusPhone + "<br>");
                }
            }
        }

        public void Debug10()
        {
            using (var context = new PPWDbContext())
            {
                string[] managercodes = { "hmx", "imc", "ldm", "drj" };

                List<AccessRight> acs = new List<AccessRight>();
                var staffrights = context.AccessRights.Where(x => x.UserCode.ToLower() == "lcm").ToList();

                foreach (var sr in staffrights)
                {
                    foreach (var mc in managercodes)
                    {
                        AccessRight ar = new AccessRight
                        {
                            UserCode = mc,
                            FuncCode = sr.FuncCode
                        };
                        acs.Add(ar);
                    }
                }
                context.AccessRights.AddRange(acs);
                context.SaveChanges();

                var list = context.AccessRights.Where(x => managercodes.Contains(x.UserCode.ToLower())).ToList();
                foreach (var item in list)
                {
                    Response.Write(item.UserCode + ":" + item.FuncCode + "<br>");
                }
            }
        }

        public void Debug9()
        {
            List<string> filedirs = new List<string>();
            var shop = "office";
            var myobfilename = "UT POS LITE GEN3";
            string strfrmdate = "28/03/2022";
            string strtodate = "28/03/2022";
            var filelist = PPWCommonLib.CommonHelpers.FileHelper.GetDayendFileList4Central(shop, myobfilename, strfrmdate, strtodate, ref filedirs);
            foreach (var file in filelist)
            {
                Response.Write(file + "<br>");
            }
            //Response.Write(HashHelper.GenerateNonce());
        }
        public void Debug8()
        {
            /*
             * auth_code=285230095494351364&body=MYOB-P-V22.3-1U,MYOB-P-V22.3-3U&charset=UTF-8&mch_create_ip=192.168.123.78&mch_id=132510000085&nonce_str=14474685057648778187510524683665&notify_url=http://192.168.123.78&out_trade_no=ST000001&service=pay.alipay.native.intl&total_fee=1&key=9841d1c02adb76750c4a05f9b6d57592
             * 
             * <xml><auth_code><![CDATA[285230095494351364]]></auth_code><body><![CDATA[MYOB-P-V22.3-1U,MYOB-P-V22.3-3U]]></body><mch_create_ip><![CDATA[192.168.123.78]]></mch_create_ip><mch_id><![CDATA[132510000085]]></mch_id><nonce_str><![CDATA[32402362718255207266586147715683]]></nonce_str><out_trade_no><![CDATA[ST000001]]></out_trade_no><service><![CDATA[pay.alipay.native.intl]]></service><total_fee><![CDATA[5]]></total_fee><sign><![CDATA[F959678F17BAB91DE267BBB8CBAF6945]]></sign><notify_url><![CDATA[http://192.168.123.78]]></notify_url></xml>
             */
            string authcode = "285230095494351364";
            string salescode = "ST000001";
            List<string> salesitemcodes = new List<string>();
            using (var context = new PPWDbContext())
            {
                salesitemcodes = (from i in context.MyobItems.Where(x => x.AccountProfileId == 2).Take(2)
                                  select i.itmCode
                                    ).ToList();
            }

            int totalpayamt = 5;
            PayService payService = new PayService(authcode, salescode, salesitemcodes, totalpayamt, ePayMode.Payment);

            var signaturestr = Helpers.ModelHelper.BuildSignStr(payService, ePayMode.Payment);
            //payService.Signature = HashHelper.CreateSha256(signaturestr).ToUpper();
            payService.Signature = HashHelper.CreateMD5(signaturestr).ToUpper();
            payService.SignType = SignType.MD5.ToString();

            //string xml = $"<xml><auth_code><![CDATA[{payService.AuthCode}]]></auth_code><body><![CDATA[{payService.Body}]]></body><mch_create_ip><![CDATA[{payService.MachineCreateIP}]]></mch_create_ip><mch_id><![CDATA[{payService.MerchantID}]]></mch_id><nonce_str><![CDATA[{payService.Nonce}]]></nonce_str><out_trade_no><![CDATA[{payService.OutTradeNo}]]></out_trade_no><service><![CDATA[{payService.Service}]]></service><total_fee><![CDATA[{payService.TotalFee}]]></total_fee><sign><![CDATA[{payService.Signature}]]></sign><notify_url><![CDATA[{payService.NotifyUrl}]]></notify_url></xml>";
            string xml = $"<xml><auth_code><![CDATA[285230095494351364]]></auth_code><body><![CDATA[MYOB-P-V22.3-1U,MYOB-P-V22.3-3U]]></body><mch_create_ip><![CDATA[192.168.123.78]]></mch_create_ip><mch_id><![CDATA[132510000085]]></mch_id><nonce_str><![CDATA[32402362718255207266586147715683]]></nonce_str><out_trade_no><![CDATA[ST000001]]></out_trade_no><service><![CDATA[pay.alipay.native.intl]]></service><total_fee><![CDATA[5]]></total_fee><sign><![CDATA[F959678F17BAB91DE267BBB8CBAF6945]]></sign><notify_url><![CDATA[http://192.168.123.78]]></notify_url></xml>";
            //Response.Write(string.Format("{0}<br>{1}<br>{2}<br>{3}", signaturestr, payService.Signature, payService.Body, xml));

            var xmlDoc = XMLHelper.PostXML(payService.GateWayUrl, xml);

            XmlNodeList nodelist = xmlDoc.SelectNodes("/xml");

            /*
             * <xml><appid><![CDATA[-]]></appid>
<charset><![CDATA[UTF-8]]></charset>
<code_img_url><![CDATA[https://pay.wepayez.com/pay/qrcode?uuid=https%3A%2F%2Fqr.alipay.com%2Fxax01604uwq514tivgdi55b0&s=903aee30f5fc33d29d894dcacb13903a]]></code_img_url>
<code_url><![CDATA[https://qr.alipay.com/xax01604uwq514tivgdi55b0]]></code_url>
<mch_id><![CDATA[132510000085]]></mch_id>
<nonce_str><![CDATA[32402362718255207266586147715683]]></nonce_str>
<result_code><![CDATA[0]]></result_code>
<sign><![CDATA[B77A10A6A7F59C2966A2B87C5BA4FC23]]></sign>
<sign_type><![CDATA[MD5]]></sign_type>
<status><![CDATA[0]]></status>
<uuid><![CDATA[13e26a190472c7d1ada7ade1d86270748]]></uuid>
<version><![CDATA[2.0]]></version>
</xml>
             */

            var ps = nodelist
    .Cast<XmlNode>()
    .Select(x => new PayService()
    {
        CodeImgUrl = x.SelectSingleNode("code_img_url").InnerText,
        CodeUrl = x.SelectSingleNode("code_url").InnerText,
        UUId = x.SelectSingleNode("uuid").InnerText
    })
    .FirstOrDefault();

            //Response.Write("ImageUrl:"+ps.CodeImgUrl + ";CodeUrl:" + ps.CodeUrl + ";UUID:" + ps.UUId);
            Response.Redirect(ps.CodeImgUrl);

        }

        public void Debug7()
        {
            using (var context = new PPWDbContext())
            {

                var salesitemcodes = (from i in context.MyobItems.Where(x => x.AccountProfileId == 2).Take(2)
                                      select i.itmCode
                           ).ToList();
                Response.Write(string.Join(",", salesitemcodes) + "<br>");
                string desc = Helpers.ModelHelper.GetItemCodes4PayServices(salesitemcodes);
                Response.Write(desc + ";" + desc.Length + ";" + CommonHelper.GetLocalIPAddress());
            }
        }
        public void Nonce()
        {
            Response.Write(HashHelper.GenerateNonce());
        }
        public void Debug6()
        {
            //int apId = 2;
            //using (var context = new PPWDbContext())
            //{
            //    int latestItemId = Helpers.ModelHelper.GetLatestItemID(context, apId);
            //    Response.Write(latestItemId);
            //}
        }
        public void Debug5()
        {
            using (var context = new PPWDbContext())
            {
                //string device = "p10";
                string location = "office";
                string strfrmdate = "28/03/2022";
                string strtodate = "28/03/2022";
                //int lang = 0;
                int accountprofileId = 1;

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

                var SalesLnViews = (from sl in context.RtlSalesLns
                                    join i in context.MyobItems
                                    on sl.rtlItemCode equals i.itmCode
                                    join s in context.RtlSales
                                on sl.rtlCode equals s.rtsCode
                                    join c in context.PGCustomers
                                    on s.rtsCusID equals c.cusCustomerID

                                    where s.rtsDate >= frmdate && s.rtsDate <= todate && s.rtsType == "RS" && s.rtsCheckout == false
                                    && s.rtsSalesLoc.ToLower() == location
                                    && c.AccountProfileId == accountprofileId && c.cusIsActive == true
                                    && i.AccountProfileId == accountprofileId

                                    select new SalesLnView
                                    {
                                        rtlUID = sl.rtlUID,
                                        rtlCode = sl.rtlCode,
                                        Item = new ItemModel
                                        {
                                            itmCode = i.itmCode,
                                            itmDesc = i.itmDesc,
                                            itmBaseSellingPrice = i.itmBaseSellingPrice,
                                            itmIsNonStock = i.itmIsNonStock
                                        },
                                        dQty = (double)sl.rtlQty,
                                        dLineSalesAmt = (double)sl.rtlSalesAmt,
                                        dLineDiscPc = sl.rtlLineDiscPc == null ? 0 : (double)sl.rtlLineDiscPc,
                                        dPrice = (double)sl.rtlSellingPrice,
                                        rtlDate = sl.rtlDate,
                                        rtlSalesLoc = sl.rtlSalesLoc,
                                        CustomerID = s.rtsCusID,
                                        //CustomerName = c.cusName,
                                        rtlRefSales = sl.rtlRefSales,
                                        SalesPersonName = s.rtsUpLdLog.ToUpper(),
                                        rtlSalesAmt = sl.rtlSalesAmt,
                                    }
                                             ).ToList();
                Response.Write(SalesLnViews.Count);
            }
        }
        public void Debug4()
        {
            using (var context = new PPWDbContext())
            {
                int apId = 1;

                var mergeditems = Helpers.ModelHelper.GetMergedItemList(apId, context);
                var mergedstocks = Helpers.ModelHelper.GetItemStockList(context, true);

                //foreach(var stock in mergedstocks)
                //{
                //    Response.Write(stock.lstStockLoc+"<br>");
                //}

                var Shops = mergedstocks.Select(x => x.lstStockLoc).Distinct().ToArray();

                //foreach (var item in mergeditems)
                //{
                //    if (!item.itmIsNonStock)
                //    {
                //        Response.Write(item.itmCode + "<br>");
                //        foreach(var locqty in item.LocQtyList)
                //        {
                //            Response.Write(locqty.LocCode + ":"+locqty.Qty+"<br>");
                //        }
                //        Response.Write("<hr>");
                //    }

                //}

                //var Shops = mergeditems.Where(x=>!x.itmIsNonStock).Select(x => x.lstStockLoc).Distinct().ToArray();
                foreach (var shop in Shops)
                {
                    Response.Write(shop + "<br>");
                }

                //var items = (from i in mergeditems
                //         where i.itmIsActive == true
                //         select new DistinctItem
                //         {
                //             ItemCode = i.itmCode.Trim(),
                //             ItemName = i.itmName,
                //             ItemDesc = i.itmDesc,
                //             ItemTaxRate = i.itmTaxPc == null ? 0 : (double)i.itmTaxPc,
                //             IsNonStock = i.itmIsNonStock,
                //             ItemSupCode = i.itmSupCode,
                //             StockLoc = i.lstStockLoc,
                //             QuantityAvailable = i.QuantityAvailable
                //         }
                //         ).ToList();
                //Dictionary<DistinctItem, Dictionary<string, int>> DicItemQty = new Dictionary<DistinctItem, Dictionary<string, int>>();
                //foreach (var item in items)
                //{
                //    Dictionary<string, int> dic = new Dictionary<string, int>();
                //    if (!item.IsNonStock)
                //    {
                //        dic[item.StockLoc] = item.QuantityAvailable;
                //    }

                //    DicItemQty.AddPG(item, dic);
                //}

                //Response.Write(Shops.Count());
            }
        }


        public void Debug2(string receiptno = "SA100157")
        {
            var shop = "office";
            var device = "P10";
            var devicecode = device;
            decimal refundamt = 0;

            using (var context = new PPWDbContext())
            {
                var refunds = context.RtlSales.Where(x => (x.rtsRefCode != null && x.rtsRefCode == receiptno) && x.rtsType == "RF" && x.rtsDvc == devicecode && x.rtsSalesLoc == shop).ToList();
                if (refunds.Count > 0)
                {
                    refundamt = (decimal)refunds.Sum(x => x.rtsFinalTotal);
                    Response.Write(refundamt);
                }

            }
        }

        public async Task Debug()
        {
            string device = "P10";
            string shop = "office";
            string filename = "ItemSales_";
            string strfrmdate = "15/01/2022";
            string strtodate = "15/01/2022";
            int lang = 2;
            int accountProfileId = 1;
            //http://localhost:9099/Api/GetShopData?device={0}&amp;shop={1}&amp;filename={2}&amp;strfrmdate={3}&amp;strtodate={4}&amp;lang={5}&amp;accountProfileId={6}
            var url = string.Format(shopApiUrl, device, shop, filename, strfrmdate, strtodate, lang, accountProfileId);
            //http://localhost:9099/Api/GetShopData?device=P10&shop=office&filename=ItemSales_&strfrmdate=15-01-2022&strtodate=15-01-2022&lang=2&accountProfileId=1
            //Response.Write(url);
            HttpClient _client = new HttpClient();
            var content = await _client.GetStringAsync(url);

            //Response.Write(content);
            var shopdatamodel = JsonConvert.DeserializeObject<ShopDataModel>(content);
            var saleslnviews = shopdatamodel.SalesLnViews;
            var stocklist = shopdatamodel.StockList;
            Response.Write("Sales count:" + shopdatamodel.SalesList.Count + ";salesln count:" + saleslnviews.Count + ";stocklist count" + stocklist.Count + ";payln" + shopdatamodel.PayLnViews.Count);

        }

        public void GetMfile()
        {
            string file = @"C:\SmartPOSLiteG3\Uploads\UT POS LITE GEN2\Shops\office\20211216\xxx.csv";
            string myobfilename = file.Split('\\')[3];
            Response.Write(myobfilename);
        }
        public string BasePath()
        {
            string myobfilename = "UT POS LITE GEN2";
            var _dpath = Path.Combine(myobfilename, "Central");
            return Path.Combine(Server.MapPath(@"~/Uploads"), _dpath);
        }
        public string Hash(string pass = "111111")
        {
            return HashHelper.ComputeHash(pass);
        }
        public void SearchItem()
        {
            string keyword = "ac";
            //using(var context=new PPWDbContext())
            //{
            //	var itemlist = ModelHelper.GetItemList(context, keyword);
            //	Response.Write(itemlist.Count);
            //}
            //itemlist = itemlist.Where(x => x.itmCode.ToLower().Contains(keyword) || ((x.itmName != null) && x.itmName.ToLower().Contains(keyword)) || ((x.itmDesc != null) && x.itmDesc.ToLower().Contains(keyword))).ToList();
            string itmcode = "ABSS-V27.3"; string itmname = "ABSS Accounting v27.3"; string itmdesc = "ABSS Accounting v27.3";
            Response.Write(itmcode.ToLower().Contains(keyword));
            Response.Write(itmname.ToLower().Contains(keyword));
            Response.Write(itmdesc.ToLower().Contains(keyword));
        }
        public void ImgUrl()
        {
            /*
			 * HttpContext.Current.Request.Url.Scheme 
    + "://"
    + HttpContext.Current.Request.Url.Authority 
    + HttpContext.Current.Request.ApplicationPath;
			 */
            //string url = string.Concat(Request.Url.Scheme,@"://",Request.Url.Authority, Request.ApplicationPath);

            //Response.Write("Url:" + url);
            Response.Write(Path.Combine(UriHelper.GetAppUrl(), ConfigurationManager.AppSettings["ReceiptLogo"]));
        }
        public void Vip()
        {
            var csvTable = new DataTable();
            string file = @"C:\Users\kevinlau\Documents\SmartPOSLiteG3\Uploads\UT POS LITE GEN2\Shops\office\20211202\Vip_20211202181729.csv";
            //string dsn = ModelHelper.GetDSNbyMyob(file.Split('\\')[6]);
            //string connectionString = string.Format("DSN={0}", dsn);
            using (var csvReader = new CsvReader(new StreamReader(System.IO.File.OpenRead(file)), true))
            {
                csvTable.Load(csvReader);
            }
            var Rows = csvTable.Rows;

            //List<Models.CustomerModel> customers = new List<Models.CustomerModel>();
            if (Rows.Count > 0)
            {
                //List<string> columns = new List<string>();
                //string sql = "INSERT INTO Import_Customer_Cards (CoLastName,CardID,CardStatus,ItemPriceLevel,InvoiceDelivery,Address1Phone1,CustomField3) VALUES(";
                for (int i = 0; i < Rows.Count; i++)
                {
                    var Row = Rows[i];
                    Response.Write("lastname:" + Row[0] + ";cardid:" + Row[1] + ";status:" + Row[2]);
                    Response.Write("<hr>");
                }
            }
        }
        //public void CustomerPoint()
        //{
        //    using (var context = new PPWDbContext())
        //    {
        //        CustomerModel customer = (from c in context.PGCustomers
        //                                  where c.cusCode == "GUEST"
        //                                  select new Models.CustomerModel
        //                                  {
        //                                      cusPointsSoFar = c.cusPointsSoFar,
        //                                      cusPointsUsed = c.cusPointsUsed
        //                                  }
        //                                        ).FirstOrDefault();
        //        Response.Write("active:" + customer.cusPointsActive + ";sofar:" + customer.cusPointsSoFar);
        //    }
        //}
       
        public void DayendsFileList()
        {
            var filelist = PPWCommonLib.CommonHelpers.FileHelper.GetDayendFileList4Shop("UT POS LITE GEN2", "office", @"12/01/2021", @"12/01/2021");
            foreach (var file in filelist)
            {
                Response.Write(file + "<br>");
            }
        }
        public void GetSubDirs()
        {
            string root = @"C:\Users\kevinlau\Documents\SmartPOSLiteG3\Uploads\UT POS LITE GEN2\Shops\office";

            // Get all subdirectories

            string[] subdirectoryEntries = Directory.GetDirectories(root);

            // Loop through them to see if they have any other subdirectories

            foreach (string subdirectory in subdirectoryEntries)
            {
                Response.Write(subdirectory + "<br>");
            }
        }
        public int GetFilesFrmPath()
        {
            string directory = @"C:\Users\kevinlau\Documents\SmartPOSLiteG3\Uploads\Shops\UT POS LITE GEN2";
            var filelist = new DirectoryInfo(directory).GetFiles().ToList();
            return filelist.Count;
        }


        public string DSN()
        {
            string dsn = "poslist_asiapeak_kf";
            string connectionString = string.Format("DSN={0};Driver={{ABSSHK1632}};ACCESS_TYPE=READ;", dsn);
            return connectionString;
        }
        public string Computername()
        {
            //UT-J302YMG5-KEV
            return Environment.MachineName;
        }
        public string Domainname()
        {
            Domain domain = Domain.GetComputerDomain();
            return domain.Name;
        }
        //public void PrintTest(string salescode = "")
        //{
        //	//if (string.IsNullOrEmpty(uploadpath))
        //	//{
        //	//	uploadpath = @"C:\SmartBusinessWeb\Uploads";
        //	//	//uploadpath = Server.MapPath("~/Uploads");
        //	//}

        //	string printername;
        //	string uploadpath;
        //	if (CommonHelper.Computername() == "UT-J302YMG5-KEV")
        //	{
        //		uploadpath = Server.MapPath("~/Uploads");
        //		if (string.IsNullOrEmpty(salescode))
        //		{
        //			salescode = "SA100262";
        //		}

        //		printername = "EPSON TM-T88VI Receipt5";
        //		localhost.Dayends dayends = new localhost.Dayends();
        //		dayends.PrintTest(uploadpath, salescode, printername);
        //	}
        //	else
        //	{
        //		uploadpath = @"C:\SmartBusinessWeb\Uploads";
        //		salescode = "SA100265";
        //		printername = Path.Combine(string.Format(@"\\{0}", CommonHelper.Computername()), "EPSON TM-T88VI Receipt5");
        //		mobile.united.com.hk.Dayends dayends = new mobile.united.com.hk.Dayends();
        //		dayends.PrintTest(uploadpath, salescode, printername);
        //	}
        //}
        public string GetPaths()
        {
            return string.Join(",", CommonHelper.GetPaths());
            //string uploadpath = Server.MapPath(@"~/Uploads");
            //string basepath = Server.MapPath(@"~/");
            //return string.Format("uploadpath:{0}; basepath:{1}",uploadpath,basepath);
        }
        public void PrinterList()
        {
            //EPSON TM-T88VI Receipt5
            var server = new PrintServer();
            Response.Write("<h2>Listing Shared Printers</h2>");
            var queues = server.GetPrintQueues(new[]
            { EnumeratedPrintQueueTypes.Shared, EnumeratedPrintQueueTypes.Connections });
            foreach (var item in queues)
            {
                Response.Write(string.Format("fullname:{0}; name:{1}", item.FullName, item.Name));
                Response.Write("<br>");
            }
            Response.Write("\n<h2>Listing Local Printers Now</h2>");
            queues = server.GetPrintQueues(new[]
            { EnumeratedPrintQueueTypes.Local });
            foreach (var item in queues)
            {
                Response.Write(string.Format("fullname:{0}; name:{1}", item.FullName, item.Name));
                Response.Write("<br>");
            }
            //Console.ReadLine();
        }
        //public void PrintPDF()
        //{
        //	bool islocal = CommonHelper.IsLocal();
        //	if (!islocal)
        //	{
        //		mobile.united.com.hk.Dayends dayends = new mobile.united.com.hk.Dayends();
        //		dayends.PrintPDFAsync(true, "SA100262", "lcm", CommonHelper.GetPaths()[0], CommonHelper.GetPaths()[1], "");
        //	}
        //	else
        //	{
        //		localhost.Dayends dayends = new localhost.Dayends();
        //		dayends.PrintPDFAsync(true, "SA100262", "lcm", CommonHelper.GetPaths()[0], CommonHelper.GetPaths()[1], "");
        //	}
        //}
        public string WsParameter(string salescode)
        {
            localhost.Dayends dayends = new localhost.Dayends();
            return dayends.ParameterTest(salescode);
        }

        public string FilePath()
        {
            string filepath = @"~/Content/printreceipt.css";
            //return filepath;
            return Server.MapPath(filepath);
        }
        public string FormatNumber(decimal amt)
        {
            return CommonHelper.FormatNumber(amt);
        }
        public string ReceiptLogo()
        {
            //C:\Users\kevinlau\Documents\SmartPOSLite\Uploads\ReceiptLogo\logo.png
            return Server.MapPath(@"~/ReceiptLogo/file.png");
        }


        public string GetReceiptHtml(PrintModel model)
        {
            // Initialize StringWriter instance.
            StringWriter stringWriter = new StringWriter();

            // Put HtmlTextWriter in using block because it needs to call Dispose.
            using (HtmlTextWriter writer = new HtmlTextWriter(stringWriter))
            {
                #region Html
                writer.RenderBeginTag(HtmlTextWriterTag.Html);//Html
                #region Head
                writer.RenderBeginTag(HtmlTextWriterTag.Head);//Head

                #region stylesheet
                writer.AddAttribute(HtmlTextWriterAttribute.Href, Server.MapPath(@"~/Content/bootstrap.min.css"));
                writer.AddAttribute(HtmlTextWriterAttribute.Type, "text/css");
                writer.AddAttribute(HtmlTextWriterAttribute.Rel, "stylesheet");
                writer.RenderBeginTag(HtmlTextWriterTag.Link);
                #endregion

                #region stylesheet
                writer.AddAttribute(HtmlTextWriterAttribute.Href, Server.MapPath(@"~/Content/bootstrap-theme.min.css"));
                writer.AddAttribute(HtmlTextWriterAttribute.Type, "text/css");
                writer.AddAttribute(HtmlTextWriterAttribute.Rel, "stylesheet");
                writer.RenderBeginTag(HtmlTextWriterTag.Link);
                #endregion

                #region stylesheet
                string filepath = @"~/Content/printreceipt.css";
                writer.AddAttribute(HtmlTextWriterAttribute.Href, Server.MapPath(filepath));
                writer.AddAttribute(HtmlTextWriterAttribute.Type, "text/css");
                writer.AddAttribute(HtmlTextWriterAttribute.Rel, "stylesheet");
                writer.RenderBeginTag(HtmlTextWriterTag.Link);
                #endregion

                #region scriptfile
                string jqueryjsfile = Server.MapPath(@"~/Scripts/jquery-ui/external/jquery/jquery.js");
                writer.Write(string.Format("<script src='{0}'></script>", jqueryjsfile));
                #endregion
                #region scriptfile
                string bootstrapjsfile = Server.MapPath(@"~/Scripts/bootstrap.min.js");
                writer.Write(string.Format("<script src='{0}'></script>", bootstrapjsfile));
                #endregion

                writer.RenderEndTag();//Head
                #endregion

                #region Body
                writer.RenderBeginTag(HtmlTextWriterTag.Body);//Body

                #region printblk
                writer.AddAttribute(HtmlTextWriterAttribute.Id, "printblk");
                //writer.AddAttribute(HtmlTextWriterAttribute.Class, "container");
                writer.AddStyleAttribute("font-size", "1.2em");
                writer.RenderBeginTag(HtmlTextWriterTag.Div); // Begin #printblk

                writer.AddStyleAttribute("text-align", "center");
                writer.AddStyleAttribute("margin-bottom", "8px");
                writer.RenderBeginTag(HtmlTextWriterTag.Div);

                if (model.UseLogo)
                {
                    writer.AddAttribute(HtmlTextWriterAttribute.Id, "receiptlogo");
                    writer.AddAttribute(HtmlTextWriterAttribute.Src, model.LogoPath);
                    //writer.AddAttribute(HtmlTextWriterAttribute.Class, "py-3");
                    writer.RenderBeginTag(HtmlTextWriterTag.Img);
                    writer.RenderEndTag();
                }

                writer.AddStyleAttribute("font-weight", "700");
                writer.RenderBeginTag(HtmlTextWriterTag.H2);
                writer.Write(model.CompanyName);
                writer.RenderEndTag();

                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.Write(model.CompanyAddr1);
                writer.RenderEndTag();

                if (model.CompanyAddr2 != null)
                {
                    writer.RenderBeginTag(HtmlTextWriterTag.Div);
                    writer.Write(model.CompanyAddr2);
                    writer.RenderEndTag();
                }

                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.Write(model.headertitle);
                writer.RenderEndTag();

                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.Write(model.HeaderMessage);
                writer.RenderEndTag();

                writer.AddStyleAttribute(HtmlTextWriterStyle.TextAlign, "center");
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "py-1");
                writer.RenderBeginTag(HtmlTextWriterTag.H2);
                writer.Write(model.ReceiptTitle);
                writer.RenderEndTag();

                writer.AddAttribute(HtmlTextWriterAttribute.Class, "row mx-1");
                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-left font-weight-bold");
                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.Write(string.Format("{0}-{1}", model.Device.dvcCode, model.Sales.rtsCode));
                writer.RenderEndTag();
                writer.RenderEndTag();

                writer.AddAttribute(HtmlTextWriterAttribute.Class, "row mx-1");
                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-left font-weight-bold");
                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.Write(model.Sales.DateTimeDisplay);
                writer.RenderEndTag();
                writer.RenderEndTag();

                writer.AddAttribute(HtmlTextWriterAttribute.Class, "row mx-1");
                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-left font-weight-bold");
                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.Write(model.UserName);
                writer.RenderEndTag();
                writer.RenderEndTag();


                writer.AddAttribute(HtmlTextWriterAttribute.Class, "row mx-1 my-3");
                writer.RenderBeginTag(HtmlTextWriterTag.Div);

                #region Table
                writer.AddStyleAttribute(HtmlTextWriterStyle.FontSize, "1.2em");
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "table table-borderless");
                writer.RenderBeginTag(HtmlTextWriterTag.Table);

                #region Thead
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "font-weight-bold");
                writer.RenderBeginTag(HtmlTextWriterTag.Thead);

                #region Tr
                writer.RenderBeginTag(HtmlTextWriterTag.Tr);
                if (!string.IsNullOrEmpty(model.itemfield))
                {
                    writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-left bordertopbottom");
                    writer.RenderBeginTag(HtmlTextWriterTag.Th);
                    writer.Write(model.itemfield);
                    writer.RenderEndTag();
                }

                writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right bordertopbottom");
                writer.RenderBeginTag(HtmlTextWriterTag.Th);
                writer.Write(model.qtyheader);
                writer.RenderEndTag();

                writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right bordertopbottom");
                writer.RenderBeginTag(HtmlTextWriterTag.Th);
                writer.Write(model.priceheader);
                writer.RenderEndTag();

                if (model.issales)
                {
                    writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right bordertopbottom");
                    writer.RenderBeginTag(HtmlTextWriterTag.Th);
                    writer.Write(model.discpcheader);
                    writer.RenderEndTag();
                }

                writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right bordertopbottom");
                writer.RenderBeginTag(HtmlTextWriterTag.Th);
                writer.Write(model.amtheader);
                writer.RenderEndTag();

                writer.RenderEndTag();
                #endregion
                writer.RenderEndTag();
                #endregion

                #region Tbody
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "table-borderless");
                writer.RenderBeginTag(HtmlTextWriterTag.Tbody);

                int colspan = model.issales ? 4 : 3;
                if (model.issales)
                {
                    foreach (var item in model.SalesLnViews)
                    {
                        var disc = item.rtlLineDiscPc == 0 ? "-" : CommonHelper.FormatNumber((decimal)item.rtlLineDiscPc);
                        #region Tr
                        writer.RenderBeginTag(HtmlTextWriterTag.Tr);
                        writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-left");
                        writer.RenderBeginTag(HtmlTextWriterTag.Td);
                        writer.Write(item.Item.itmDesc + "<br>" + item.Item.itmCode);
                        writer.RenderEndTag();

                        writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                        writer.RenderBeginTag(HtmlTextWriterTag.Td);
                        writer.Write(item.Qty);
                        writer.RenderEndTag();

                        writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                        writer.RenderBeginTag(HtmlTextWriterTag.Td);
                        writer.Write(CommonHelper.FormatMoney("$", (decimal)item.rtlSellingPrice));
                        writer.RenderEndTag();

                        writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                        writer.RenderBeginTag(HtmlTextWriterTag.Td);
                        writer.Write(disc);
                        writer.RenderEndTag();

                        writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                        writer.RenderBeginTag(HtmlTextWriterTag.Td);
                        writer.Write(CommonHelper.FormatMoney("$", (decimal)item.dLineSalesAmt));
                        writer.RenderEndTag();
                        writer.RenderEndTag();
                        #endregion
                    }
                }
                else
                {
                    foreach (var item in model.RefundLnViews)
                    {
                        var disc = item.rtlLineDiscPc == 0 ? "-" : CommonHelper.FormatNumber((decimal)item.rtlLineDiscPc);
                        #region Tr
                        writer.RenderBeginTag(HtmlTextWriterTag.Tr);
                        writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-left");
                        writer.RenderBeginTag(HtmlTextWriterTag.Td);
                        writer.Write(item.rtlDesc + "<br>" + item.rtlItemCode);
                        writer.RenderEndTag();

                        writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                        writer.RenderBeginTag(HtmlTextWriterTag.Td);
                        writer.Write(item.Qty);
                        writer.RenderEndTag();

                        writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                        writer.RenderBeginTag(HtmlTextWriterTag.Td);
                        writer.Write(CommonHelper.FormatMoney("$", (decimal)item.rtlSellingPrice));
                        writer.RenderEndTag();

                        writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                        writer.RenderBeginTag(HtmlTextWriterTag.Td);
                        writer.Write(CommonHelper.FormatMoney("$", (decimal)item.dLineSalesAmt));
                        writer.RenderEndTag();
                        writer.RenderEndTag();
                        #endregion
                    }
                }

                writer.RenderEndTag();
                #endregion

                #region Tfoot
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "table-borderless font-weight-bold");
                writer.RenderBeginTag(HtmlTextWriterTag.Tfoot);
                #region Tr:remark & subtotal
                writer.RenderBeginTag(HtmlTextWriterTag.Tr);
                #region remark
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-left bordertop");
                writer.RenderBeginTag(HtmlTextWriterTag.Td);
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-center");
                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.RenderBeginTag(HtmlTextWriterTag.H4);
                writer.Write(model.notesheader);
                writer.RenderEndTag();
                writer.RenderBeginTag(HtmlTextWriterTag.Span);
                writer.Write(model.Sales.rtsRmks);
                writer.RenderEndTag();
                writer.RenderEndTag();
                writer.RenderEndTag();
                #endregion
                #region subtotal
                int subcolspan = colspan - 1;
                writer.AddAttribute(HtmlTextWriterAttribute.Colspan, subcolspan.ToString());
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right bordertop");
                writer.RenderBeginTag(HtmlTextWriterTag.Td);
                writer.Write(model.subtotalheader);
                writer.RenderEndTag();
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right bordertop");
                writer.RenderBeginTag(HtmlTextWriterTag.Td);
                writer.Write(CommonHelper.FormatMoney("$", (decimal)model.Sales.rtsLineTotal));
                writer.RenderEndTag();
                #endregion
                writer.RenderEndTag();
                #endregion

                #region Tr:totalamt
                writer.RenderBeginTag(HtmlTextWriterTag.Tr);
                writer.AddAttribute(HtmlTextWriterAttribute.Colspan, colspan.ToString());
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                writer.RenderBeginTag(HtmlTextWriterTag.Td);
                writer.Write(model.totalamtheader);
                writer.RenderEndTag();
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                writer.RenderBeginTag(HtmlTextWriterTag.Td);
                writer.Write(CommonHelper.FormatMoney("$", (decimal)model.Sales.rtsFinalTotal));
                writer.RenderEndTag();
                writer.RenderEndTag();
                #endregion


                if (!model.Sales.rtsMonthBase)
                {
                    foreach (var item in model.Sales.PayLnViews)
                    {
                        if (item.Amount != 0)
                        {
                            var paytype = "";
                            var amt = "";
                            var paymenttype = model.Sales.DicPayTypes.FirstOrDefault(x => x.Key == item.pmtCode);
                            paytype = paymenttype.Value;
                            amt = CommonHelper.FormatMoney("$", item.Amount);
                            #region Tr:paytype & payamt
                            writer.RenderBeginTag(HtmlTextWriterTag.Tr);
                            #region Td
                            writer.AddAttribute(HtmlTextWriterAttribute.Colspan, colspan.ToString());
                            writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                            writer.RenderBeginTag(HtmlTextWriterTag.Td);
                            writer.Write(paytype);
                            writer.RenderEndTag();
                            #endregion
                            #region Td
                            writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                            writer.RenderBeginTag(HtmlTextWriterTag.Td);
                            writer.Write(amt);
                            writer.RenderEndTag();
                            #endregion
                            writer.RenderEndTag();
                            #endregion
                        }
                    }
                }
                else
                {
                    #region Tr
                    writer.RenderBeginTag(HtmlTextWriterTag.Tr);
                    #region Td
                    writer.AddAttribute(HtmlTextWriterAttribute.Colspan, colspan.ToString());
                    writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                    writer.RenderBeginTag(HtmlTextWriterTag.Td);
                    writer.Write(model.monthlypayheader);
                    writer.RenderEndTag();
                    #endregion
                    #region Td
                    writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                    writer.RenderBeginTag(HtmlTextWriterTag.Td);
                    writer.Write("");
                    writer.RenderEndTag();
                    #endregion
                    writer.RenderEndTag();
                    #endregion
                }

                if (model.Sales.Roundings != 0)
                {
                    #region Tr
                    writer.RenderBeginTag(HtmlTextWriterTag.Tr);
                    #region Td
                    writer.AddAttribute(HtmlTextWriterAttribute.Colspan, colspan.ToString());
                    writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                    writer.RenderBeginTag(HtmlTextWriterTag.Td);
                    writer.Write(model.roundingsheader);
                    writer.RenderEndTag();
                    #endregion
                    #region Td
                    writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                    writer.RenderBeginTag(HtmlTextWriterTag.Td);
                    writer.Write(CommonHelper.FormatMoney("$", (decimal)model.Sales.Roundings));
                    writer.RenderEndTag();
                    #endregion
                    writer.RenderEndTag();
                    #endregion
                }

                if (model.Sales.Change != 0)
                {
                    #region Tr
                    writer.RenderBeginTag(HtmlTextWriterTag.Tr);
                    #region Td
                    writer.AddAttribute(HtmlTextWriterAttribute.Colspan, colspan.ToString());
                    writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                    writer.RenderBeginTag(HtmlTextWriterTag.Td);
                    writer.Write(model.changeheader);
                    writer.RenderEndTag();
                    #endregion
                    #region Td
                    writer.AddAttribute(HtmlTextWriterAttribute.Class, "text-right");
                    writer.RenderBeginTag(HtmlTextWriterTag.Td);
                    writer.Write(CommonHelper.FormatMoney("$", (decimal)model.Sales.Change));
                    writer.RenderEndTag();
                    #endregion
                    writer.RenderEndTag();
                    #endregion
                }

                writer.RenderEndTag();
                #endregion

                writer.RenderEndTag();
                #endregion

                writer.RenderEndTag();

                #region Receipt Footer
                writer.AddAttribute(HtmlTextWriterAttribute.Class, "row justify-content-center");
                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                #region footertitle1
                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.Write(model.footertitle1);
                writer.RenderEndTag();
                #endregion
                #region footertitle2
                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.Write(model.footertitle2);
                writer.RenderEndTag();
                #endregion
                #region footertitle3
                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.Write(model.footertitle3);
                writer.RenderEndTag();
                #endregion
                #region footermsg
                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.Write(model.footermsg);
                writer.RenderEndTag();
                #endregion
                writer.RenderEndTag();
                #endregion

                writer.RenderEndTag();

                writer.RenderEndTag(); // End #printblk
                #endregion

                writer.RenderEndTag();
                #endregion
                writer.RenderEndTag();
                #endregion

            }
            // Return the result.
            return stringWriter.ToString();
        }

        private static void AddText(FileStream fs, string value)
        {
            byte[] info = new UTF8Encoding(true).GetBytes(value);
            fs.Write(info, 0, info.Length);
        }


        string[] _words = { "Sam", "Dot", "Perls" };
        //private List<string> ShopNames;

        string GetDivElements()
        {
            // Initialize StringWriter instance.
            StringWriter stringWriter = new StringWriter();

            // Put HtmlTextWriter in using block because it needs to call Dispose.
            using (HtmlTextWriter writer = new HtmlTextWriter(stringWriter))
            {
                // Loop over some strings.
                foreach (var word in _words)
                {
                    // Some strings for the attributes.
                    string classValue = "ClassName";
                    string urlValue = "http://www.dotnetperls.com/";
                    string imageValue = Server.MapPath(@"~/Images/file.png");

                    // The important part:
                    writer.AddAttribute(HtmlTextWriterAttribute.Class, classValue);
                    writer.RenderBeginTag(HtmlTextWriterTag.Div); // Begin #1

                    writer.AddAttribute(HtmlTextWriterAttribute.Href, urlValue);
                    writer.RenderBeginTag(HtmlTextWriterTag.A); // Begin #2

                    writer.AddAttribute(HtmlTextWriterAttribute.Src, imageValue);
                    writer.AddAttribute(HtmlTextWriterAttribute.Width, "60");
                    writer.AddAttribute(HtmlTextWriterAttribute.Height, "60");
                    writer.AddAttribute(HtmlTextWriterAttribute.Alt, "");

                    writer.RenderBeginTag(HtmlTextWriterTag.Img); // Begin #3
                    writer.RenderEndTag(); // End #3

                    writer.Write(word);

                    writer.RenderEndTag(); // End #2
                    writer.RenderEndTag(); // End #1
                }
            }
            // Return the result.
            return stringWriter.ToString();
        }

        public void SaveHtmlFile(string salescode)
        {
            Session["CurrentCulture"] = 0;
            var address = string.Format(@"http://localhost:9999/Print/Index?issales=1&salesrefundcode={0}", salescode);
            WebClient client = new WebClient();
            string reply = client.DownloadString(address);
            string fileName = Path.Combine(Server.MapPath(@"~/Files"), "Test.html");
            System.IO.File.WriteAllText(fileName, reply, Encoding.GetEncoding("big5"));
            //Response.Write(reply);
            //Console.WriteLine(reply);
            //Console.ReadKey();
            //const string fileName = "Foobar.html";

            ////Read HTML from file
            //var content = System.IO.File.ReadAllText(fileName);

            ////Replace all values in the HTML
            //content = content.Replace("{MY_TITLE}", titleTextBox.Text);

            ////Write new HTML string to file
            //System.IO.File.WriteAllText(fileName, content);
        }


        protected string GetUrl(string imagepath)
        {
            string[] splits = Request.Url.AbsoluteUri.Split('/');
            if (splits.Length >= 2)
            {
                string url = splits[0] + "//";
                for (int i = 2; i < splits.Length - 1; i++)
                {
                    url += splits[i];
                    url += "/";
                }
                return url + imagepath;
            }
            return imagepath;
        }

        public ActionResult Index(string name)
        {
            ViewBag.Message = string.Format("Hello {0} to ASP.NET MVC!", name);

            return View();
        }

        public string IPAddr()
        {
            return CommonHelper.GetLocalIPAddress();
        }
        public void ConsoleArgs()
        {
            localhost.Dayends dayends = new localhost.Dayends();
            dayends.ConsoleArgs();
        }


        //public void ExportFrmCentral(string dsn)
        //{
        //	if (!CommonHelper.IsLocal())
        //	{
        //		mobile.united.com.hk.Dayends dayends = new mobile.united.com.hk.Dayends();
        //		dayends.DoExportFrmCentral(dsn, "");
        //	}
        //	else
        //	{
        //		localhost.Dayends dayends = new localhost.Dayends();
        //		dayends.DoExportFrmCentral(dsn, "");
        //	}

        //	Response.Write("done");
        //}

        //public string CheckWS(bool remote = true)
        //{
        //	if (remote)
        //	{
        //		mobile.united.com.hk.Dayends dayends = new mobile.united.com.hk.Dayends();
        //		return dayends.CheckConnected();
        //	}
        //	else
        //	{
        //		localhost.Dayends dayends = new localhost.Dayends();
        //		return dayends.CheckConnected();
        //	}

        //}
        //public void MyobWrite()
        //{
        //	string sql = "INSERT INTO Import_Items (ItemNumber, ItemName) VALUES(('77777', 'TestItem#7'), ('88888', 'TestItem#8'))";
        //	localhost.Dayends dayends = new localhost.Dayends();
        //	dayends.MyobWrite(sql);
        //	//return ws.converttodaysweb(21,10,2021);
        //}

        public void MyobRead(string dsn)
        {
            /*
			 * [SaleID]
	  ,[CardRecordID]
	  ,[InvoiceNumber]
	  ,[CustomerPONumber]
	  ,[IsHistorical]
	  ,[BackorderSaleID]
	  ,[Date]
	  ,[InvoiceDate]
			 */
            string sql = "Select SaleID,CardRecordID,InvoiceNumber,Date,InvoiceDate From Sales";
            Repository rs = new Repository();
            DataSet ds = rs.Query(dsn, sql);
            DataTable dt = ds.Tables[0];
            //Response.Write("count:" + dt.Rows.Count);
            //return;
            var Rows = dt.Rows;
            for (int i = 0; i < Rows.Count; i++)
            {
                Response.Write(Rows[i][0].ToString());
                Response.Write(":");
                Response.Write(Rows[i][1].ToString());
                Response.Write(" ");
                Response.Write(Rows[i][2].ToString());
                Response.Write(" ");
                Response.Write(Rows[i][3].ToString());
                Response.Write(" ");
                Response.Write(Rows[i][4].ToString());
                Response.Write(" ");
                Response.Write(Rows[i][5].ToString());
                Response.Write("<br>");
            }

        }

        public string NullString()
        {
            return CommonHelper.Escape4CSV(null);
        }

        public void TruncateTable()
        {
            using (var context = new PPWDbContext())
            {
                context.Database.ExecuteSqlCommand("TRUNCATE TABLE [CustomerHistory]");
            }

        }
        public void ReadCSVFile()
        {
            var csvTable = new DataTable();
            string filepath = Path.Combine(Server.MapPath(@"~/Uploads/Shops/UT POS LITE GEN2/20211129"), "ItemSales_20211129122253.csv");
            int fieldCount = 0;
            using (var csvReader = new CsvReader(new StreamReader(System.IO.File.OpenRead(filepath)), true))
            {
                csvTable.Load(csvReader);
                fieldCount = csvReader.FieldCount;
            }
            var Rows = csvTable.Rows;

            //Response.Write("fieldcount:" + fieldCount);
            //Response.Write("<hr>");
            string sql = "INSERT INTO Import_Item_Sales(CoLastName,InvoiceNumber,SaleDate,ItemNumber,Quantity,Price,Discount,Total,SaleStatus,Location,CardID,AmountPaid,PaymentMethod,PaymentIsDue,DiscountDays,BalanceDueDays,PercentDiscount,PercentMonthlyCharge,DeliveryStatus,CustomersNumber,Job,Comment,SalespersonLastName,Memo)  VALUES(";
            List<string> values = new List<string>();

            //for (int i = 0; i < Rows.Count; i++)
            //{
            //	for(int j = 0; j < fieldCount; j++)
            //	{
            //		Response.Write(Rows[i][j].ToString());
            //		Response.Write(",");
            //	}

            //	Response.Write("<hr>");
            //}

            for (int i = 0; i < Rows.Count; i++)
            {
                List<string> _values = new List<string>();
                for (int j = 0; j < fieldCount - 1; j++)
                {
                    _values.Add(string.Format("'{0}'", Rows[i][j].ToString()));
                }
                string value = string.Format("({0})", string.Join(",", _values));
                //Response.Write(value);
                values.Add(value);
                //Response.Write(string.Join(",", values));
                //Response.Write("<hr>");
            }

            //string strvalues = string.Join(",", values);
            //Response.Write(strvalues + "<hr>");
            sql += string.Join(",", values) + ")";
            Response.Write(sql);
            /*
			 * INSERT INTO Import_Item_Sales(CoLastName,InvoiceNumber,SaleDate,ItemNumber,Quantity,Price,Discount,Total,SaleStatus,Location,CardID,AmountPaid,PaymentMethod,PaymentIsDue,DiscountDays,BalanceDueDays,PercentDiscount,PercentMonthlyCharge,DeliveryStatus,CustomersNumber,Job,Comment,SalespersonLastName,Memo) VALUES(('GUEST','SZ100475','11-29-2021','ABSS-PP-V22.3-1U','0','5888','0','5888','I','office','GUEST','5888','Cash','0','0','0','0','0','A','','office','Cash','LCM','Cash:5888.00'),('GUEST','SZ100476','11-29-2021','ABSS-PP-V22.3-1U','0','5888','0','5888','I','office','GUEST','5888','Cash','0','0','0','0','0','A','','office','Cash','LCM','Cash:5888.00'))
			 */
        }

        public string GetFileInfoList()
        {
            StringBuilder sb = new StringBuilder();
            List<FileInfo> filelist = PPWCommonLib.CommonHelpers.FileHelper.GetFileInfoList(@"~/Uploads", true);
            foreach (FileInfo fileInfo in filelist)
            {
                sb.AppendFormat("{0};", PPWCommonLib.CommonHelpers.FileHelper.GetFileNameFromPath(fileInfo.Name));
            }
            return sb.ToString();
        }
        public string GetFileList()
        {
            StringBuilder sb = new StringBuilder();
            List<string> filelist = PPWCommonLib.CommonHelpers.FileHelper.GetFileList(@"~/Uploads", true);
            foreach (string path in filelist)
            {
                sb.AppendFormat("{0};", PPWCommonLib.CommonHelpers.FileHelper.GetFileNameFromPath(path));
            }
            return sb.ToString();
        }
        public bool CheckInternet()
        {
            return CommonHelper.CheckForInternetConnection();
        }
        /// <summary>
        /// 轉換BIG5
        /// </summary>
        /// <param name=”strUtf”>輸入UTF-8</param>
        /// <returns></returns>
        [HttpGet]
        public string ConvertBig5()
        {
            string strUtf = EncodingTest();
            Encoding utf81 = Encoding.GetEncoding("utf-8");
            Encoding big51 = Encoding.GetEncoding("big5");
            //Response.ContentEncoding = big51;
            byte[] strUtf81 = utf81.GetBytes(strUtf.Trim());
            byte[] strBig51 = Encoding.Convert(utf81, big51, strUtf81);

            char[] big5Chars1 = new char[big51.GetCharCount(strBig51, 0, strBig51.Length)];
            big51.GetChars(strBig51, 0, strBig51.Length, big5Chars1, 0);
            string tempString1 = new string(big5Chars1);
            return tempString1;
        }

        public string EncodingTest()
        {
            using (var context = new PPWDbContext())
            {
                string test = context.MyobLocStocks.FirstOrDefault().lstSellUnit;
                return test;
            }
        }

        public string GetFile()
        {
            return PPWCommonLib.CommonHelpers.ModelHelper.GetReceiptLogo(ProjectEnum.G3);
        }

        public string Token()
        {
            //something like: 2hGfpIGI2UjCAc+zhUmwRo8zhQx0xCA6
            return CommonHelper.GenSessionToken();
        }

        public ViewResult Fancybox()
        {
            return View();
        }
        // GET: Test
        public string ReadFile(string filename = @"deviceinfo.txt")
        {
            return PPWCommonLib.CommonHelpers.FileHelper.Read(filename);
        }

        public void WriteFile(string device, string shop, string filename = @"deviceinfo.txt")
        {
            string content = string.Concat(HashHelper.ComputeHash(device), @";;", HashHelper.ComputeHash(shop));
            PPWCommonLib.CommonHelpers.FileHelper.Write(filename, content);
        }

        public string HashPass(string pass)
        {
            return HashHelper.ComputeHash(pass);
        }

        public void DateTimeDebug()
        {
            var strstartdate = "2022-06-01";
            //var demodate = CommonHelper.GetDateFrmString4Crm("2022-06-01");
            //    Response.Write(demodate.ToShortDateString());
            var startdate = DateTime.ParseExact(strstartdate, "yyyy-MM-dd", null);
            Response.Write(startdate.ToShortDateString());
        }
    }

    public class TestModel
    {
        public string attrname { get; set; }

        public List<EmailSetting> MailList { get; set; }
        public string attrval { get; set; }
    }

    public class TestViewModel
    {
        public string DocTitle { get; set; }
        public string DocContent { get; set; }
    }
}