using Microsoft.Data.SqlClient;
using PPWDAL;
using PPWLib.Models;
using PPWLib.Models.POS.Sales;
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
using ModelHelper = PPWLib.Helpers.ModelHelper;

namespace SmartBusinessWeb.Controllers
{
    [System.Web.Http.AllowAnonymous]
    public class JsonController : Controller
    {
        [System.Web.Http.HttpPost]
        public async Task<HttpResponseMessage> HttpPost(int apId, [FromBody] List<DebugLog> logs)
        {            
            HttpRequestMessage request = new HttpRequestMessage();
            string dbname = GetDbName(apId);
            using var context = new PPWDbContext(dbname);
            foreach(var log in logs)
            {
                ModelHelper.WriteLog(context, log.Message, log.LogType);
            }            
            await context.SaveChangesAsync();
            return request.CreateResponse(System.Net.HttpStatusCode.OK);
        }

        [System.Web.Mvc.AllowAnonymous]
        [System.Web.Mvc.HttpPost]
        public async Task<HttpResponseMessage> PostTest(int apId, FormCollection form)
        {            
            HttpRequestMessage request = new HttpRequestMessage();
            string dbname = GetDbName(apId);
            using var context = new PPWDbContext(dbname);
            ModelHelper.WriteLog(context, form["msg"], form["type"]);
            await context.SaveChangesAsync();
            return request.CreateResponse(System.Net.HttpStatusCode.OK);
        }


        [System.Web.Http.HttpPost]
        public async Task<HttpResponseMessage> CheckOutRetail(int apId, [FromBody] HashSet<long> checkoutIds)
        {
            HttpRequestMessage request = new HttpRequestMessage();
            string dbname = GetDbName(apId);
            using var context = new PPWDbContext(dbname);
            List<RtlSale> retaillist = context.RtlSales.Where(x => x.AccountProfileId == apId && checkoutIds.Any(y => x.rtsUID == y)).ToList();
            foreach (var retail in retaillist)
            {
                retail.rtsCheckout = true;
            }
            await context.SaveChangesAsync();
            return request.CreateResponse(System.Net.HttpStatusCode.OK);
        }

        [System.Web.Http.HttpGet]
        public string GetUploadRetailData(int apId, string strfrmdate, string strtodate, string location, int includeUploaded)
        {
            UploadAbssData data = new UploadAbssData();
            string dbname = GetDbName(apId);
            using var context = new PPWDbContext(dbname);
            ComInfo comInfo = context.ComInfoes.FirstOrDefault(x => x.AccountProfileId == apId);
            if (comInfo != null)
            {
                string DefaultConnection = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString.Replace("_DBNAME_", dbname);
                using var connection = new SqlConnection(DefaultConnection);
                connection.Open();
                DataTransferModel dmodel = new DataTransferModel
                {
                    SelectedLocation = location,
                    includeUploaded = includeUploaded == 1
                };
                dmodel.RetailCheckOutIds = new HashSet<long>();

                #region Date Ranges
                DateTime frmdate, todate;
                HandleDateRanges(strfrmdate, strtodate, out frmdate, out todate);
                #endregion               

                data.sqllist = RetailEditModel.GetUploadSqlList(dmodel.includeUploaded, 2, comInfo, apId, context, connection, frmdate, todate, ref dmodel);
                data.checkoutIds = dmodel.RetailCheckOutIds;
            }
            return System.Text.Json.JsonSerializer.Serialize(data);
        }


        [System.Web.Http.HttpPost]
        public async Task<HttpResponseMessage> CheckOutWS(int apId, [FromBody] HashSet<long> checkoutIds)
        {
            HttpRequestMessage request = new HttpRequestMessage();
            string dbname = GetDbName(apId);
            using var context = new PPWDbContext(dbname);
            List<WholeSale> wslist = context.WholeSales.Where(x => x.AccountProfileId == apId && checkoutIds.Any(y => x.wsUID == y)).ToList();
            foreach (var ws in wslist)
            {
                ws.wsCheckout = true;
            }
            await context.SaveChangesAsync();
            return request.CreateResponse(System.Net.HttpStatusCode.OK);
        }

        [System.Web.Http.HttpGet]
        public string GetUploadWSData(int apId, string strfrmdate, string strtodate, string location, int includeUploaded)
        {
            UploadAbssData data = new UploadAbssData();
            string dbname = GetDbName(apId);
            using var context = new PPWDbContext(dbname);
            ComInfo comInfo = context.ComInfoes.FirstOrDefault(x => x.AccountProfileId == apId);
            if (comInfo != null)
            {
                string DefaultConnection = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString.Replace("_DBNAME_", dbname);
                using var connection = new SqlConnection(DefaultConnection);
                connection.Open();
                DataTransferModel dmodel = new DataTransferModel
                {
                    SelectedLocation = location,
                    includeUploaded = includeUploaded == 1
                };
                dmodel.WsCheckOutIds = new HashSet<long>();

                #region Date Ranges
                DateTime frmdate, todate;
                HandleDateRanges(strfrmdate, strtodate, out frmdate, out todate);
                #endregion               

                data.sqllist = WholeSalesEditModel.GetUploadSqlList(dmodel.includeUploaded, 2, comInfo, apId, context, connection, frmdate, todate, ref dmodel);
                data.checkoutIds = dmodel.WsCheckOutIds;
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
        public async Task<HttpResponseMessage> PostAbssCustomerData(int apId, [FromBody] List<MyobCustomer> customers)
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
        public async Task<HttpResponseMessage> PostCustomerInfo4AbssData(int apId, [FromBody] List<CustomerInfo4Abss> customerInfos)
        {
            HttpRequestMessage request = new HttpRequestMessage();
            string dbname = GetDbName(apId);
            using var context = new PPWDbContext(dbname);

            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    List<string> cusCodes = customerInfos.Select(x => x.CusCode).Distinct().ToList();
                    List<CustomerInfo4Abss> _customerInfos = context.CustomerInfo4Abss.Where(x => x.AccountProfileId == apId && cusCodes.Contains(x.CusCode)).ToList();

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
        public async Task<HttpResponseMessage> PostAbssSupplierData(int apId, [FromBody] List<Supplier> suppliers)
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
        public async Task<HttpResponseMessage> PostSupplierInfo4AbssData(int apId, [FromBody] List<SupplierInfo4Abss> supplierInfos)
        {
            HttpRequestMessage request = new HttpRequestMessage();
            string dbname = GetDbName(apId);
            using var context = new PPWDbContext(dbname);

            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    List<string> supCode = supplierInfos.Select(x => x.SupCode).Distinct().ToList();
                    List<SupplierInfo4Abss> _supplierInfos = context.SupplierInfo4Abss.Where(x => x.AccountProfileId == apId && supCode.Contains(x.SupCode)).ToList();

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
        public async Task<HttpResponseMessage> PostAbssLocationData(int apId, [FromBody] List<MyobLocation> locations)
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
        public async Task<HttpResponseMessage> PostAbssItemData(int apId, [FromBody] List<MyobItem> items)
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
        public async Task<HttpResponseMessage> PostAbssStockData(int apId, [FromBody] List<MyobLocStock> stocks)
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

		[System.Web.Http.HttpPost]
		public async Task<HttpResponseMessage> PostAbssPriceData(int apId, [FromBody] List<MyobItemPrice> itemPrices)
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
					List<int> itemPriceIds = itemPrices.Select(x => x.ItemPriceID!).Distinct().ToList();
					List<MyobItemPrice> _itemPrices = context.MyobItemPrices.Where(x => x.AccountProfileId == apId && itemPriceIds.Contains(x.ItemPriceID!)).ToList();
					context.MyobItemPrices.RemoveRange(_itemPrices);
					await context.SaveChangesAsync();
					#endregion
					context.MyobItemPrices.AddRange(itemPrices);
					await context.SaveChangesAsync();
					ModelHelper.WriteLog(context, "Import ItemPrice data from Central done", "ImportFrmCentral");
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
					ModelHelper.WriteLog(context, string.Format("Import itemPrice data from Central failed:{0}", sb.ToString()), "ImportFrmCentral");
					context.SaveChanges();
				}
			}

			return request.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
		}
		[System.Web.Http.HttpPost]
		public async Task<HttpResponseMessage> PostAbssAccountData(int apId, [FromBody] List<Account> accounts)
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
					List<int> accountIds = accounts.Select(x => x.AccountID!).Distinct().ToList();
					List<Account> _accounts = context.Accounts.Where(x => x.AccountProfileId == apId && accountIds.Contains(x.AccountID!)).ToList();
					context.Accounts.RemoveRange(_accounts);
					await context.SaveChangesAsync();
					#endregion
					context.Accounts.AddRange(accounts);
					await context.SaveChangesAsync();
					ModelHelper.WriteLog(context, "Import Account data from Central done", "ImportFrmCentral");
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
					ModelHelper.WriteLog(context, string.Format("Import account data from Central failed:{0}", sb.ToString()), "ImportFrmCentral");
					context.SaveChanges();
				}
			}

			return request.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
		}

		[System.Web.Http.HttpPost]
		public async Task<HttpResponseMessage> PostAbssJobData(int apId, [FromBody] List<MyobJob> jobs)
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
					List<int> jobIds = jobs.Select(x => x.JobID!).Distinct().ToList();
					List<MyobJob> _jobs = context.MyobJobs.Where(x => x.AccountProfileId == apId && jobIds.Contains(x.JobID!)).ToList();
					context.MyobJobs.RemoveRange(_jobs);
					await context.SaveChangesAsync();
					#endregion
					context.MyobJobs.AddRange(jobs);
					await context.SaveChangesAsync();
					ModelHelper.WriteLog(context, "Import MyobJob data from Central done", "ImportFrmCentral");
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
					ModelHelper.WriteLog(context, string.Format("Import job data from Central failed:{0}", sb.ToString()), "ImportFrmCentral");
					context.SaveChanges();
				}
			}

			return request.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
		}
		private static string GetDbName(int apId)
        {
            return ModelHelper.GetDbName(apId);
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