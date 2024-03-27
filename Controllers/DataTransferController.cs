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
using PPWLib.Helpers;
using PPWLib.Models.Purchase;
using PPWLib.Models.WholeSales;
using PPWLib.Models.Customer;
using Microsoft.Data.SqlClient;
using PPWLib.Models.POS.Sales;
using PPWLib.Models.Journal;
using CommonLib.Models.MYOB;
using PPWLib.Models.Item;
using PPWCommonLib.Helpers;
using DocumentFormat.OpenXml.Drawing.Diagrams;

namespace SmartBusinessWeb.Controllers
{
    [CustomAuthenticationFilter]
	public class DataTransferController : BaseController
	{
		private string sqlfields4Journal { get { return ModelHelper.sqlfields4Journal; } }
		private string sqlfields4Sales { get { return ModelHelper.sqlfields4Sales; } }
        private string sqlfields4Deposit { get { return ModelHelper.sqlfields4Deposit; } }

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
			using (var context = new PPWDbContext(Session["DBName"].ToString()))
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
			int apId = ComInfo.AccountProfileId;
			DateTime dateTime = DateTime.Now;
			SessUser curruser = Session["User"] as SessUser;

			using var context = new PPWDbContext(Session["DBName"].ToString());
			string AbssConnectionString = GetAbssConnectionString(context, "READ", apId);

			if (filename.StartsWith("SPP_"))
			{
				SPPHelper.SaveSPPsToDB();
			}

			if (filename.StartsWith("CI_"))
			{
				CIHelper.SaveCIsToDB();
			}

			if (filename.StartsWith("AccountReceivable_"))
			{
				ARHelper.SaveARsToDB();
			}

			if (filename.StartsWith("Quotation_"))
			{
				QuotationHelper.SaveQuotationsToDB();
			}

			if (filename.StartsWith("Job_"))
			{
				List<MyobJobModel> joblist = MYOBHelper.GetJobList(AbssConnectionString);
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
						ModelHelper.WriteLog(context, string.Format("Import JobName data from Central failed:{0}", sb.ToString()), "ExportFrmCentral");
						context.SaveChanges();
					}
				}
			}

			if (filename.StartsWith("Currency_"))
			{
				List<MyobCurrencyModel> emplist = MYOBHelper.GetCurrencyList(AbssConnectionString);
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
				ModelHelper.SaveSuppliersFrmCentral(context, apId, ComInfo);
			}

			if (filename.StartsWith("Employees_"))
			{
				ModelHelper.SaveEmployeesFrmCentral(apId, context, AbssConnectionString, curruser);
			}

			if (filename.StartsWith("Customers_"))
			{
				ModelHelper.SaveCustomersFrmCentral(context, AbssConnectionString, apId, ComInfo);
			}

			if (filename.StartsWith("Items_"))
			{
				ModelHelper.SaveItemsFrmCentral(apId, context, AbssConnectionString);
			}

			if (filename.StartsWith("Tax_"))
			{
				AbssConn abssConn = ModelHelper.GetAbssConn(ComInfo);
				List<CommonLib.Models.MYOB.TaxModel> taxlist = MYOBHelper.GetTaxList(abssConn);
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
				List<AccountModel> accountlist = MYOBHelper.GetAccountList(AbssConnectionString);

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
			using (var context = new PPWDbContext(Session["DBName"].ToString()))
			{
				currsess = ModelHelper.GetCurrentSession(context);
				apId = currsess.AccountProfileId;
				lang = currsess.sesLang;
			}

			int ret = 0;
			int excluded = 0;
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
					case "ia":
                        await ExportData4SB(apId, dmodel, "IA_", model.SalesDateFrmTxt, model.SalesDateToTxt, includeUploaded, lang);
                        break;
                    case "journal":
						await ExportData4SB(apId, dmodel, "Journal_", model.SalesDateFrmTxt, model.SalesDateToTxt, includeUploaded, lang);
						break;
					case "supplier":
						await ExportData4SB(apId, dmodel, "Suppliers_", model.SalesDateFrmTxt, model.SalesDateToTxt, includeUploaded, lang);
						break;
					case "purchase":
						await ExportData4SB(apId, dmodel, "Purchase_", model.SalesDateFrmTxt, model.SalesDateToTxt, includeUploaded, lang);
						break;
					case "item":
						filenames = new string[2] { "Items_", "PGLocStocks_" };
						foreach (var filename in filenames)
						{
							await ExportData4SB(apId, dmodel, filename, model.SalesDateFrmTxt, model.SalesDateToTxt, includeUploaded, lang);
						}
						break;
					case "customer":
						//filenames = new string[2] { "Vip_", "Customers_" };
						filenames = new string[1] { "Customers_" };
						foreach (var filename in filenames)
						{
							await ExportData4SB(apId, dmodel, filename, model.SalesDateFrmTxt, model.SalesDateToTxt, includeUploaded, lang);
						}
						break;
					case "wholesales":
						await ExportData4SB(apId, dmodel, "Wholesales_", model.SalesDateFrmTxt, model.SalesDateToTxt, includeUploaded, lang);
						break;
					default:
					case "sales":
						await ExportData4SB(apId, dmodel, "ItemSales_", model.SalesDateFrmTxt, model.SalesDateToTxt, includeUploaded, lang);
                        HandleExcludedOrders(FileType.Retail, dmodel);
                        break;
				}
			}

			if (Session["PendingInvoices"] != null)
			{
				string.Concat(msg, "<br>", Resources.Resource.InvoicesNotIntegratedDueToZeroStock);
				ret = 1;
			}
            if (Session["ExcludedRetailOrderIds"] != null)
            {
                string.Concat(msg, "<br>", Resources.Resource.InvoicesNotIntegratedDueToUnsynsItemCustomers);
                excluded = 1;
            }


            return Json(new { msg, PendingInvoices = ret, ExcludedInvoices=excluded, offlinemode = 0 });
		}

		private async Task ExportData4SB(int accountprofileId, DataTransferModel dmodel, string filename, string strfrmdate = "", string strtodate = "", bool includeUploaded = false, int lang = 0)
        {
			var comInfo = Session["ComInfo"] as ComInfo;
			SessUser curruser = Session["User"] as SessUser;
			OnlineModeItem onlineModeItem = new OnlineModeItem();			
			DateTime dateTime = DateTime.Now;
			string checkoutportal = string.Empty;
			bool approvalmode = (bool)comInfo.ApprovalMode;
			int apId = comInfo.AccountProfileId;

			using var context = new PPWDbContext(Session["DBName"].ToString());
			string ConnectionString = GetAbssConnectionString(context, "READ_WRITE", apId);
		
			using var connection = new SqlConnection(DefaultConnection);
			connection.Open();

            if (filename.StartsWith("IA_"))
            {
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
                #endregion

                var session = ModelHelper.GetCurrentSession(context);
                var location = session.sesShop.ToLower();
                var device = session.sesDvc.ToLower();

                dmodel.RetailCheckOutIds = new HashSet<long>();
                dmodel.SelectedLocation = location;
                dmodel.Device = device;

                List<string> sqllist = IAEditModel.GetUploadSqlList(includeUploaded, comInfo, apId, context, connection, frmdate, todate, ref dmodel);

                if (sqllist.Count > 0)
                {
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
                            ModelHelper.WriteLog(context, string.Format("Export IA data From Shop done; sqllist:{0}; connectionstring:{1}", string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
                            List<InventoryAdjustment> ialist = context.InventoryAdjustments.Where(x => x.AccountProfileId == apId && dmodel.CheckOutIds_IA.Any(y => x.Id == y)).ToList();
                            foreach (var ia in ialist)
                            {
                                ia.Checkout = true;
								ia.ModifyTime = DateTime.Now;
								ia.ModifyBy = SessUser.UserCode;
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
                            ModelHelper.WriteLog(context, string.Format("Export PreSalesModel data From Shop failed: {0}; sql:{1}; connectionstring: {2}", sb, string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
                            context.SaveChanges();
                        }

                    }
                    #endregion
                }
            }

            if (filename.StartsWith("Journal_"))
			{
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
				#endregion

				var session = ModelHelper.GetCurrentSession(context);
				var location = session.sesShop.ToLower();
				var device = session.sesDvc.ToLower();

				dmodel.RetailCheckOutIds = new HashSet<long>();
				dmodel.SelectedLocation = location;
				dmodel.Device = device;

				List<string> sqllist = JournalEditModel.GetUploadSqlList(includeUploaded, comInfo, apId, context, frmdate, todate, ref dmodel);

				if (sqllist.Count > 0)
				{
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
							ModelHelper.WriteLog(context, string.Format("Export PreSalesModel data From Shop failed: {0}; sql:{1}; connectionstring: {2}", sb, string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
							context.SaveChanges();
						}

					}
					#endregion
				}
			}

			if (filename.StartsWith("ItemSales_"))
            {
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
                #endregion

                var session = ModelHelper.GetCurrentSession(context);
                var location = session.sesShop.ToLower();
                var device = session.sesDvc.ToLower();

                dmodel.RetailCheckOutIds = new HashSet<long>();
                dmodel.SelectedLocation = location;
                dmodel.Device = device;				
			
                List<string> sqllist = RetailEditModel.GetUploadSqlList(includeUploaded, lang, comInfo, apId, context, connection, frmdate, todate, ref dmodel);               

                if (sqllist.Count > 0)
                {
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
                            ModelHelper.WriteLog(context, string.Format("Export SalesModel data From Shop done; sqllist:{0}; connectionstring:{1}", string.Join(",", sqllist), ConnectionString), "ExportFrmShop");
                            List<RtlSale> saleslist = context.RtlSales.Where(x => x.AccountProfileId==apId && dmodel.RetailCheckOutIds.Any(y => x.rtsUID == y)).ToList();
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
                            ModelHelper.WriteLog(context, string.Format("Export PreSalesModel data From Shop failed: {0}; sql:{1}; connectionstring: {2}", sb, string.Join(",",sqllist), ConnectionString), "ExportFrmShop");
                            context.SaveChanges();
                        }

                    }
                    #endregion
                }
            }

            if (filename == "Wholesales_")
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

                var session = ModelHelper.GetCurrentSession(context);
                var location = session.sesShop.ToLower();
                var device = session.sesDvc.ToLower();

				dmodel.CheckOutIds_WS = new HashSet<long>();
				dmodel.SelectedLocation = location;
				dmodel.Device = device;

                List<string> sqllist = WholeSalesEditModel.GetUploadSqlList(includeUploaded, lang, comInfo, apId, context, connection, frmdate, todate, ref dmodel);

                if (sqllist.Count > 0)
                {
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
                            List<WholeSale> saleslist = context.WholeSales.Where(x => x.AccountProfileId==apId && dmodel.CheckOutIds_WS.Any(y => x.wsUID == y)).ToList();
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
                            ModelHelper.WriteLog(context, string.Format("Export Wholesales data From Shop failed: {0}; sql:{1}; connectionstring: {2}", sb, string.Join(",",sqllist), ConnectionString), "ExportFrmShop");
                            context.SaveChanges();
                        }

                    }
                    #endregion
                }

            }

            if (filename == "Purchase_")
			{
				List<string> sqllist = PurchaseEditModel.GetUploadPurchaseSqlList(accountprofileId, ref dmodel, strfrmdate, strtodate, comInfo, context);
				
				using (localhost.Dayends dayends = new localhost.Dayends())
				{
					dayends.Url = comInfo.WebServiceUrl;
					dayends.WriteMYOBBulk(ConnectionString, sqllist.ToArray());
				}

				ModelHelper.WriteLog(context, string.Join(",", sqllist), "ExportFrmShop#Purchase");
				List<PPWDAL.Purchase> pslist = context.Purchases.Where(x => x.AccountProfileId==apId && dmodel.PoCheckOutIds.Any(y => x.Id == y)).ToList();
				foreach (var ps in pslist)
				{
					ps.pstCheckout = true;
					ps.ModifyTime = DateTime.Now;
				}

				if(dmodel.CheckOutIds_PoPayLn.Count>0)
				{
					List<PurchasePayment> pplist = context.PurchasePayments.Where(x=>dmodel.CheckOutIds_PoPayLn.Any(y=>x.Id==y)).ToList();
					foreach (var pp in pplist)
					{
						pp.ppCheckout = true;
						pp.ModifyTime = DateTime.Now;
					}
				}

				context.SaveChanges();
			}

			if (filename.StartsWith("Items_"))
			{
				ModelHelper.GetDataTransferData(context, accountprofileId, CheckOutType.Items, ref dmodel);

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
					value = string.Format("(" + strcolumn + ")", item.itmCode, item.itmName, buy, sell, inventory, inventoryacc, incomeacc, expenseacc, "", itemdesc, usedesc, "", "", "", "", "", "", "", item.itmSupCode, "", item.itmBuyUnit, 1, 0, 0, item.itmBaseSellingPrice, item.itmSellUnit, item.itmSellUnitQuantity, taxcode, 0, item.PLA, item.PLB, item.PLC, item.PLD, item.PLE, item.PLF, inactivetxt, item.itmBuyStdCost, comInfo.PrimaryLocation, "");
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

				updateDB(dmodel.CheckOutIds_Item.ToArray(), accountprofileId, CheckOutType.Items);
			}

			if (filename.StartsWith("PGLocStocks_"))
			{
				string sql = "";
				ModelHelper.GetDataTransferData(context, accountprofileId, CheckOutType.PGLocStocks, ref dmodel);
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

				updateDB(dmodel.CheckOutIds_Stock.ToArray(), accountprofileId, CheckOutType.PGLocStocks);
			}

			if (filename.StartsWith("Customers_"))
			{
				WritePGCustomerToABSS(AccountProfileId, ref onlineModeItem, dmodel);
				updateDB(onlineModeItem.checkoutIds.ToArray(), AccountProfileId, CheckOutType.PGCustomers);
				WriteMyobCustomerToABSS(AccountProfileId, ref onlineModeItem, dmodel);
				updateDB(onlineModeItem.checkoutIds.ToArray(), AccountProfileId, CheckOutType.MyobCustomers);
				WriteVipToABSS();
			}

			if (filename == "Suppliers_")
			{
				WriteSupplierToABSS(accountprofileId, ref onlineModeItem, dmodel);
				updateDB(onlineModeItem.checkoutIds.ToArray(), accountprofileId, CheckOutType.Suppliers);
			}

			if (filename.StartsWith("Devices_"))
			{

				ModelHelper.GetDataTransferData(context, accountprofileId, CheckOutType.Device, ref dmodel);
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

			connection.Close();
			connection.Dispose();
			context.Dispose();
		}

		private void HandleExcludedOrders(FileType fileType, DataTransferModel dmodel)
		{
			switch (fileType) 
			{
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

		

		private async Task<bool> ExportData4Kingdee(DayEndsModel model, DataTransferModel dmodel, string filename, string strfrmdate = "", string strtodate = "", bool includePending = false, bool includeUploaded = false, int lang = 0, string salesprefix = "", string refundprefix = "")
		{
			bool bret = false;
			string url;
			HttpClient _client;

			DateTime frmdate, todate;
			CommonHelper.HandlingDateRanges(strfrmdate, strtodate, out frmdate, out todate);

			if (filename.StartsWith("ItemSales_"))
			{
				using (var context = new PPWDbContext(Session["DBName"].ToString()))
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
				using (var context = new PPWDbContext(Session["DBName"].ToString()))
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



		private void updateDB(long[] _checkoutIds, int accountProfileId, CheckOutType checkOutType)
		{
			using (var context = new PPWDbContext(Session["DBName"].ToString()))
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
							supplier.ModifyTime = DateTime.Now;
						}

						break;
					case CheckOutType.MyobCustomers:
						List<MyobCustomer> mcustomers = context.MyobCustomers.Where(x => checkoutIds.Any(y => x.cusCustomerID == y) && x.AccountProfileId == accountProfileId).ToList();
						foreach (var customer in mcustomers)
						{
							customer.cusCheckout = true;
							customer.ModifyTime = DateTime.Now;
						}
						break;
					case CheckOutType.PGCustomers:
						List<PGCustomer> pcustomers = context.PGCustomers.Where(x => checkoutIds.Any(y => x.cusCustomerID == y) && x.AccountProfileId == accountProfileId).ToList();
						foreach (var customer in pcustomers)
						{
							customer.cusCheckout = true;
						}
						break;					
					case CheckOutType.Items:						
						List<MyobItem> mitems = context.MyobItems.Where(x => checkoutIds.Any(y => x.itmItemID == y) && x.AccountProfileId == accountProfileId).ToList();						
						foreach (var item in mitems)
						{
							item.itmCheckout = true;
							item.itmModifyTime = DateTime.Now;
						}
						break;
					default:
					case CheckOutType.ItemSales:
						List<RtlSale> saleslist = context.RtlSales.Where(x => checkoutIds.Any(y => x.rtsUID == y) && x.AccountProfileId == accountProfileId).ToList();
						foreach (var sales in saleslist)
						{
							sales.rtsCheckout = true;
							sales.rtsModifyTime = DateTime.Now;
						}
						break;
				}
				ModelHelper.WriteLog(context, string.Format("checkouttype:{0}; checkoutids:{1}", checkOutType, string.Join(",", checkoutIds)), "ExportFrmShop#checkoutIds");
				context.SaveChanges();
			}
		}



		private void WriteSupplierToABSS(int accountprofileId, ref OnlineModeItem onlineModeItem, DataTransferModel dmodel)
		{
			using var context = new PPWDbContext(Session["DBName"].ToString());

			string ConnectionString = GetAbssConnectionString(context, "READ_WRITE", apId);
			ModelHelper.GetDataTransferData(context, accountprofileId, CheckOutType.Suppliers, ref dmodel);

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

			using (var context = new PPWDbContext(Session["DBName"].ToString()))
			{
				string ConnectionString = GetAbssConnectionString(context, "READ_WRITE", AccountProfileId);
				ModelHelper.GetDataTransferData(context, AccountProfileId, CheckOutType.PGCustomers, ref dmodel);

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
				//string street1ln1 = "";
				//string street1ln2 = "";
				//string street2ln1 = "";
				//string street2ln2 = "";
				//string street3ln1 = "";
				//string street3ln2 = "";
				//string street4ln1 = "";
				//string street4ln2 = "";
				if (customer.AddressList != null && customer.AddressList.Count > 0)
				{
					if (customer.AddressList[0] != null)
					{
						streetln1 = customer.AddressList[0].StreetLine1;
						streetln2 = customer.AddressList[0].StreetLine2;
						streetln1 = CommonHelper.StringToNarrow4SQL(string.Concat(streetln1, streetln2));
					}
					//if (customer.AddressList.Count >= 2 && customer.AddressList[1] != null)
					//{
					//    street1ln1 = customer.AddressList[1].StreetLine1;
					//    street1ln2 = customer.AddressList[1].StreetLine2;
					//    street1ln1 = CommonHelper.StringToNarrow4SQL(string.Concat(street1ln1, street1ln2));
					//}
					//if (customer.AddressList.Count >= 3 && customer.AddressList[2] != null)
					//{
					//    street2ln1 = customer.AddressList[2].StreetLine1;
					//    street2ln2 = customer.AddressList[2].StreetLine2;
					//    street2ln1 = CommonHelper.StringToNarrow4SQL(string.Concat(street2ln1, street2ln2));
					//}
					//if (customer.AddressList.Count >= 4 && customer.AddressList[3] != null)
					//{
					//    street3ln1 = customer.AddressList[3].StreetLine1;
					//    street3ln2 = customer.AddressList[3].StreetLine2;
					//    street3ln1 = CommonHelper.StringToNarrow4SQL(string.Concat(street3ln1, street3ln2));
					//}
					//if (customer.AddressList.Count >= 5 && customer.AddressList[4] != null)
					//{
					//    street4ln1 = customer.AddressList[4].StreetLine1;
					//    street4ln2 = customer.AddressList[4].StreetLine2;
					//    street4ln1 = CommonHelper.StringToNarrow4SQL(string.Concat(street4ln1, street4ln2));
					//}
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

			using (var context = new PPWDbContext(Session["DBName"].ToString()))
			{
				string ConnectionString = GetAbssConnectionString(context, "READ_WRITE", AccountProfileId);
				ModelHelper.GetDataTransferData(context, AccountProfileId, CheckOutType.MyobCustomers, ref dmodel);

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

			using (var context = new PPWDbContext(Session["DBName"].ToString()))
			{
				string ConnectionString = GetAbssConnectionString(context, "READ_WRITE", AccountProfileId);
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
		private string GetAbssConnectionString(PPWDbContext context, string accesstype, int apId)
		{
			return MYOBHelper.GetConnectionString(context, accesstype, apId);
		}
	}
}