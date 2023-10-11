﻿using Azure.Core;
using CommonLib.Models;
using DocumentFormat.OpenXml.Spreadsheet;
using Newtonsoft.Json;
using PPWDAL;
using PPWLib.Helpers;
using PPWLib.Models;
using PPWLib.Models.Item;
using PPWLib.Models.MYOB;
using PPWLib.Models.Purchase;
using PPWLib.Models.WholeSales;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Services.Description;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.Header;

namespace SmartBusinessWeb.Controllers
{
	public class JsonController : Controller
	{
        [System.Web.Http.HttpGet]
        public string GetUploadWSData(int apId, string strfrmdate, string strtodate, string location, int includeUploaded)
        {
            UploadAbssData data = new UploadAbssData();
            string dbname = GetDbName(apId);
            using var context = new PPWDbContext(dbname);
            ComInfo comInfo = context.ComInfoes.FirstOrDefault(x => x.AccountProfileId == apId);
            if (comInfo != null)
            {
                DataTransferModel dmodel = new DataTransferModel
                {
                    SelectedLocation = location,
                    includeUploaded = includeUploaded == 1
                };

                #region Date Ranges
                DateTime frmdate, todate;
                HandleDateRanges(strfrmdate, strtodate, out frmdate, out todate);
                #endregion

                var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString.Replace("_DBNAME_", dbname);

                data.sqllist = WholeSalesEditModel.GetUploadWholeSalesSqlList(includeUploaded, 2, comInfo, onlineModeItem, checkoutIds, approvalmode, apId, context, connection, frmdate, todate, location, null);
                data.checkoutIds = dmodel.PoCheckOutIds;
            }
            return System.Text.Json.JsonSerializer.Serialize(data);
        }

        [System.Web.Http.HttpGet]
        public int GetWSCount(int apId, string strfrmdate, string strtodate, string location)
        {
            string dbname = GetDbName(apId);
            using var context = new PPWDbContext(dbname);
            #region Date Ranges
            DateTime frmdate, todate;
            HandleDateRanges(strfrmdate, strtodate, out frmdate, out todate);
            #endregion
            return (int)context.GetWSCount(apId, location, frmdate, todate).FirstOrDefault();
        }

        [System.Web.Http.HttpGet]
        public int GetRetailCount(int apId, string strfrmdate, string strtodate, string location)
        {
            string dbname = GetDbName(apId);
            using var context = new PPWDbContext(dbname);
            #region Date Ranges
            DateTime frmdate, todate;
            HandleDateRanges(strfrmdate, strtodate, out frmdate, out todate);
            #endregion
            return (int)context.GetRetailCount(apId, location, frmdate, todate).FirstOrDefault();
        }

        [System.Web.Http.HttpPost]
		public async Task<HttpResponseMessage> CheckOutPo(int apId, [FromBody] HashSet<long> checkoutIds)
		{
			HttpRequestMessage request = new HttpRequestMessage();
			string dbname = GetDbName(apId);
			using var context = new PPWDbContext(dbname);
			List<PPWDAL.Purchase> pslist = context.Purchases.Where(x => x.AccountProfileId == apId && checkoutIds.Any(y => x.Id == y)).ToList();
			foreach (var ps in pslist)
			{
				ps.pstCheckout = true;
			}
			await context.SaveChangesAsync();
			return request.CreateResponse(System.Net.HttpStatusCode.OK);
		}

		[System.Web.Http.HttpGet]
		public string GetUploadPoData(int apId, string strfrmdate, string strtodate, string location, int includeUploaded)
		{
			UploadAbssData data=new UploadAbssData();
			string dbname = GetDbName(apId);
			using var context = new PPWDbContext(dbname);
			ComInfo comInfo = context.ComInfoes.FirstOrDefault(x=>x.AccountProfileId== apId);
			if(comInfo!=null)
			{
				DataTransferModel dmodel = new DataTransferModel
				{
					SelectedLocation = location,
					includeUploaded = includeUploaded==1
				};

                #region Date Ranges
                DateTime frmdate, todate;
                HandleDateRanges(strfrmdate, strtodate, out frmdate, out todate);
                #endregion

                var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString.Replace("_DBNAME_", dbname);

				data.sqllist = PurchaseEditModel.GetUploadPurchaseSqlList(apId, ref dmodel, strfrmdate, strtodate, comInfo, context, frmdate, todate, connectionString);
				data.checkoutIds = dmodel.PoCheckOutIds;
			}
			return System.Text.Json.JsonSerializer.Serialize(data);
		}
		[System.Web.Http.HttpGet]
		public int GetPoCount(int apId, string strfrmdate, string strtodate, string location)
		{ 
			string dbname = GetDbName(apId);
			using var context = new PPWDbContext(dbname);
            #region Date Ranges
            DateTime frmdate, todate;
            HandleDateRanges(strfrmdate, strtodate, out frmdate, out todate);
            #endregion
            return (int)context.GetPoCount(apId, location, frmdate, todate).FirstOrDefault();
		}

		[System.Web.Http.HttpPost]
		public async Task<HttpResponseMessage> GetAbssCustomerData(int apId, [FromBody] List<MyobCustomer> customers)
		{
			HttpRequestMessage request = new HttpRequestMessage();
			string dbname = GetDbName(apId);
			using var context = new PPWDbContext(dbname);

			using (var transaction = context.Database.BeginTransaction())
			{
				try
				{
					List<int> customerIds = customers.Select(x => x.cusCustomerID).Distinct().ToList();
					List<MyobCustomer> _customers = context.MyobCustomers.Where(x => x.AccountProfileId == apId && customerIds.Contains(x.cusCustomerID)).ToList();

					#region Backup Customer Point Information 
					Dictionary<string, CustomerPointInfo> DicCusPointInfo = new Dictionary<string, CustomerPointInfo>();
					foreach (var customer in _customers)
					{
						DicCusPointInfo[customer.cusCode] = new CustomerPointInfo
						{
							PointsSoFar = customer.cusPointsSoFar ?? 0,
							PointsActive = customer.cusPointsActive ?? 0,
							PointsUsed = customer.cusPointsUsed ?? 0,
							PriceLevelID = customer.cusPriceLevelID
						};
					}
					#endregion

					#region remove current data first:
					//context.Database.ExecuteSqlCommand("TRUNCATE TABLE [Customer]");                   
					context.MyobCustomers.RemoveRange(_customers);
					await context.SaveChangesAsync();
					#endregion

					foreach (var mcustomer in customers)
					{
						var customerPointInfo = DicCusPointInfo.ContainsKey(mcustomer.cusCode) ? DicCusPointInfo[mcustomer.cusCode] : null;
						if (customerPointInfo != null)
						{
							mcustomer.cusPointsSoFar = customerPointInfo.PointsSoFar;
							mcustomer.cusPointsActive = customerPointInfo.PointsActive;
							mcustomer.cusPointsUsed = customerPointInfo.PointsUsed;
							mcustomer.cusPriceLevelID = customerPointInfo.PriceLevelID;
						}
					}

					context.MyobCustomers.AddRange(customers);
					await context.SaveChangesAsync();


					ModelHelper.WriteLog(context, "Import Customer data from Central done", "ImportFrmCentral");
					await context.SaveChangesAsync();
					transaction.Commit();

					return request.CreateResponse(System.Net.HttpStatusCode.OK);
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
					ModelHelper.WriteLog(context, string.Format("Import customer data from Central failed:{0}", sb.ToString()), "ImportFrmCentral");
					context.SaveChanges();
				}
			}

			return request.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
		}

		[System.Web.Http.HttpPost]
		public async Task<HttpResponseMessage> GetCustomerInfo4AbssData(int apId, [FromBody] List<CustomerInfo4Abss> customerInfos)
		{
			HttpRequestMessage request = new HttpRequestMessage();
			string dbname = GetDbName(apId);
			using var context = new PPWDbContext(dbname);

			using (var transaction = context.Database.BeginTransaction())
			{
				try
				{
					List<long> customerInfoIds = customerInfos.Select(x => x.Id).Distinct().ToList();
					List<CustomerInfo4Abss> _customerInfos = context.CustomerInfo4Abss.Where(x => x.AccountProfileId == apId && customerInfoIds.Contains(x.Id)).ToList();

					#region remove current data first:
					//context.Database.ExecuteSqlCommand("TRUNCATE TABLE [CustomerInfo4Abss]");                   
					context.CustomerInfo4Abss.RemoveRange(_customerInfos);
					await context.SaveChangesAsync();
					#endregion

					context.CustomerInfo4Abss.AddRange(customerInfos);
					await context.SaveChangesAsync();


					ModelHelper.WriteLog(context, "Import CustomerInfo4Abss data from Central done", "ImportFrmCentral");
					context.SaveChanges();
					transaction.Commit();

					return request.CreateResponse(System.Net.HttpStatusCode.OK);
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
					ModelHelper.WriteLog(context, string.Format("Import customerInfo data from Central failed:{0}", sb.ToString()), "ImportFrmCentral");
					context.SaveChanges();
				}
			}

			return request.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
		}

        [System.Web.Http.HttpPost]
        public async Task<HttpResponseMessage> GetAbssSupplierData(int apId, [FromBody] List<Supplier> suppliers)
        {
            HttpRequestMessage request = new HttpRequestMessage();
            string dbname = GetDbName(apId);
            using var context = new PPWDbContext(dbname);

            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    List<int> supplierIds = suppliers.Select(x => x.supId).Distinct().ToList();
                    List<Supplier> _suppliers = context.Suppliers.Where(x => x.AccountProfileId == apId && supplierIds.Contains(x.supId)).ToList();

                    #region remove current data first:   
                    context.Suppliers.RemoveRange(_suppliers);
                    await context.SaveChangesAsync();
                    #endregion
                 

                    context.Suppliers.AddRange(suppliers);
                    await context.SaveChangesAsync();


                    ModelHelper.WriteLog(context, "Import Supplier data from Central done", "ImportFrmCentral");
                    await context.SaveChangesAsync();
                    transaction.Commit();

                    return request.CreateResponse(System.Net.HttpStatusCode.OK);
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
                    ModelHelper.WriteLog(context, string.Format("Import supplier data from Central failed:{0}", sb.ToString()), "ImportFrmCentral");
                    context.SaveChanges();
                }
            }

            return request.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
        }

        [System.Web.Http.HttpPost]
        public async Task<HttpResponseMessage> GetSupplierInfo4AbssData(int apId, [FromBody] List<SupplierInfo4Abss> supplierInfos)
        {
            HttpRequestMessage request = new HttpRequestMessage();
            string dbname = GetDbName(apId);
            using var context = new PPWDbContext(dbname);

            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    List<long> supplierInfoIds = supplierInfos.Select(x => x.Id).Distinct().ToList();
                    List<SupplierInfo4Abss> _supplierInfos = context.SupplierInfo4Abss.Where(x => x.AccountProfileId == apId && supplierInfoIds.Contains(x.Id)).ToList();

                    #region remove current data first:
                    //context.Database.ExecuteSqlCommand("TRUNCATE TABLE [SupplierInfo4Abss]");                   
                    context.SupplierInfo4Abss.RemoveRange(_supplierInfos);
                    await context.SaveChangesAsync();
                    #endregion

                    context.SupplierInfo4Abss.AddRange(supplierInfos);
                    await context.SaveChangesAsync();


                    ModelHelper.WriteLog(context, "Import SupplierInfo4Abss data from Central done", "ImportFrmCentral");
                    context.SaveChanges();
                    transaction.Commit();

                    return request.CreateResponse(System.Net.HttpStatusCode.OK);
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
                    ModelHelper.WriteLog(context, string.Format("Import supplierInfo data from Central failed:{0}", sb.ToString()), "ImportFrmCentral");
                    context.SaveChanges();
                }
            }

            return request.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
        }


        [System.Web.Http.HttpPost]
		public async Task<HttpResponseMessage> GetAbssLocationData(int apId, [FromBody] List<MyobLocation> locations)
		{
			HttpRequestMessage request = new HttpRequestMessage();
			string dbname = GetDbName(apId);
			using var context = new PPWDbContext(dbname);

			using (var transaction = context.Database.BeginTransaction())
			{
				try
				{
					#region remove current data first:
					//context.Database.ExecuteSqlCommand("TRUNCATE TABLE [Location]");
					List<int> locationIds = locations.Select(x => x.LocationID).Distinct().ToList();
					List<MyobLocation> _locations = context.MyobLocations.Where(x => x.AccountProfileId == apId && locationIds.Contains(x.LocationID)).ToList();
					context.MyobLocations.RemoveRange(_locations);
					await context.SaveChangesAsync();
					#endregion
					context.MyobLocations.AddRange(locations);
					await context.SaveChangesAsync();
					ModelHelper.WriteLog(context, "Import Location data from Central done", "ImportFrmCentral");
					await context.SaveChangesAsync();
					transaction.Commit();

					return request.CreateResponse(System.Net.HttpStatusCode.OK);
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
					ModelHelper.WriteLog(context, string.Format("Import location data from Central failed:{0}", sb.ToString()), "ImportFrmCentral");
					context.SaveChanges();
				}
			}

			return request.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
		}

		[System.Web.Http.HttpPost]
		public async Task<HttpResponseMessage> GetAbssItemData(int apId, [FromBody] List<MyobItem> items)
		{
			HttpRequestMessage request = new HttpRequestMessage();
			string dbname = GetDbName(apId);
			using var context = new PPWDbContext(dbname);

			using (var transaction = context.Database.BeginTransaction())
			{
				try
				{
					#region remove current data first:
					//context.Database.ExecuteSqlCommand("TRUNCATE TABLE [Item]");
					List<int> itemIds = items.Select(x => x.itmItemID).Distinct().ToList();
					List<MyobItem> _items = context.MyobItems.Where(x => x.AccountProfileId == apId && itemIds.Contains(x.itmItemID)).ToList();
					context.MyobItems.RemoveRange(_items);
					context.SaveChanges();
					#endregion

					context.MyobItems.AddRange(items);
					await context.SaveChangesAsync();
					ModelHelper.WriteLog(context, "Import Item data from Central done", "ImportFrmCentral");
					await context.SaveChangesAsync();
					transaction.Commit();

					return request.CreateResponse(System.Net.HttpStatusCode.OK);
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


			return request.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
		}

		[System.Web.Http.HttpPost]
		public async Task<HttpResponseMessage> GetAbssStockData(int apId, [FromBody] List<MyobLocStock> stocks)
		{
			HttpRequestMessage request = new HttpRequestMessage();
			string dbname = GetDbName(apId);
			using var context = new PPWDbContext(dbname);

			using (var transaction = context.Database.BeginTransaction())
			{
				try
				{
					#region remove current data first:
					//context.Database.ExecuteSqlCommand("TRUNCATE TABLE [Item]");
					List<int> stockIds = stocks.Select(x => (int)x.lstItemID!).Distinct().ToList();
					List<MyobLocStock> _stocks = context.MyobLocStocks.Where(x => x.AccountProfileId == apId && stockIds.Contains((int)x.lstItemID!)).ToList();
					context.MyobLocStocks.RemoveRange(_stocks);
					await context.SaveChangesAsync();
					#endregion
					context.MyobLocStocks.AddRange(stocks);
					await context.SaveChangesAsync();
					ModelHelper.WriteLog(context, "Import LocStock data from Central done", "ImportFrmCentral");
					await context.SaveChangesAsync();
					transaction.Commit();

					return request.CreateResponse(System.Net.HttpStatusCode.OK);
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
					ModelHelper.WriteLog(context, string.Format("Import stock data from Central failed:{0}", sb.ToString()), "ImportFrmCentral");
					context.SaveChanges();
				}
			}

			return request.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
		}

		private static string GetDbName(int apId)
		{
			string dbname;
			switch (apId)
			{
				case 2:
					dbname = "SB0";
					break;
				case 3:
					dbname = "SB1";
					break;
				default:
				case 1:
					dbname = "POSPro";
					break;
			}

			return dbname;
		}

        private static void HandleDateRanges(string strfrmdate, string strtodate, out DateTime frmdate, out DateTime todate)
        {
            int year;
            const char delimeter = '-';
            if (string.IsNullOrEmpty(strfrmdate))
            {
                frmdate = DateTime.Today;
            }
            else
            {
                int mth = int.Parse(strfrmdate.Split(delimeter)[1]);
                int day = int.Parse(strfrmdate.Split(delimeter)[0]);
                year = int.Parse(strfrmdate.Split(delimeter)[2]);
                frmdate = new DateTime(year, mth, day);
            }
            if (string.IsNullOrEmpty(strtodate))
            {
                todate = DateTime.Today;
            }
            else
            {
                int mth = int.Parse(strtodate.Split(delimeter)[1]);
                int day = int.Parse(strtodate.Split(delimeter)[0]);
                year = int.Parse(strtodate.Split(delimeter)[2]);
                todate = new DateTime(year, mth, day);
            }
        }
    }

	public class UploadAbssData
	{
		public List<string> sqllist { get; set; }
		public HashSet<long> checkoutIds { get; set; }
	}
}