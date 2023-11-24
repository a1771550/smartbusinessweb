using PPWCommonLib.CommonModels;
using PPWDAL;
using PPWLib.Helpers;
using PPWLib.Models.Item;
using PPWLib.Models.Quotation;
using SmartBusinessWeb.Infrastructure;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Mvc;
using CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Report
{
	[CustomAuthenticationFilter]
	public class AbssReportController : BaseController
    {
		List<UserEmployee> userEmployees = new List<UserEmployee>();
		private string ItemsLastUpdateTimeDisplay;
		private string StocksLastUpdateTimeDisplay;
		int userId => SessUser.surUID;

		[HandleError]
		[CustomAuthorize("reports", "admin1", "admin", "superadmin")]
		public ActionResult Quotation()
		{
			ViewBag.ParentPage = "abssreports";
			ViewBag.PageName = "quotation";
			ViewBag.Title = Resource.Quotation;
			QuotationEditModel model = new QuotationEditModel();
			//model.GetList();
			return View(model);
		}


		[HandleError]
		[CustomAuthorize("Inventory", "Admin", "SuperAdmin")]
		[RedirectAction]
		public ActionResult ShowInventory()
		{
			ViewBag.PageName = "inventory";
			List<Location> locations = InventoryEditModel.GetLocationFrmDB(apId);
			TempData["Locations"] = locations;
			return View();
		}
		public ActionResult GetInventories(JqueryDatatableParam param)
		{
			var inventories = InventoryEditModel.GetInventoryListFrmDB(apId, Session["PrimaryLocation"].ToString(), ref ItemsLastUpdateTimeDisplay, ref StocksLastUpdateTimeDisplay);

			if (!string.IsNullOrEmpty(param.sSearch))
			{
				inventories = inventories.Where(x => x.ItemName.ToLower().Contains(param.sSearch.ToLower()) || x.ItemNumber.ToLower().Contains(param.sSearch.ToLower())	
											 || x.SellOnOrder.ToString().Contains(param.sSearch.ToLower())
											 || x.PurchaseOnOrder.ToString().Contains(param.sSearch.ToLower())
											 || x.QuantityAvailable.ToString().Contains(param.sSearch.ToLower())
											 || x.LocationName.ToLower().Contains(param.sSearch.ToLower())
											 ).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_6))
			{
				inventories = InventoryEditModel.GetInventoryListFrmDB(apId, param.sSearch_6, ref ItemsLastUpdateTimeDisplay, ref StocksLastUpdateTimeDisplay);
			}
			#region Sorting
			var sortColumnIndex = Convert.ToInt32(HttpContext.Request.QueryString["iSortCol_0"]);
			var sortDirection = HttpContext.Request.QueryString["sSortDir_0"];
			if (sortColumnIndex == 0)
			{
				inventories = sortDirection == "asc" ? inventories.OrderBy(c => c.ItemName).ToList() : inventories.OrderByDescending(c => c.ItemName).ToList();
			}
			else if (sortColumnIndex == 1)
			{
				inventories = sortDirection == "asc" ? inventories.OrderBy(c => c.ItemNumber).ToList() : inventories.OrderByDescending(c => c.ItemNumber).ToList();
			}
			else if (sortColumnIndex == 2)
			{
				inventories = sortDirection == "asc" ? inventories.OrderBy(c => c.QuantityOnHand).ToList() : inventories.OrderByDescending(c => c.QuantityOnHand).ToList();
			}
			else if (sortColumnIndex == 3)
			{
				inventories = sortDirection == "asc" ? inventories.OrderBy(c => c.SellOnOrder).ToList() : inventories.OrderByDescending(c => c.SellOnOrder).ToList();
			}
			else if (sortColumnIndex == 4)
			{
				inventories = sortDirection == "asc" ? inventories.OrderBy(c => c.PurchaseOnOrder).ToList() : inventories.OrderByDescending(c => c.PurchaseOnOrder).ToList();
			}
			else if (sortColumnIndex == 5)
			{
				inventories = sortDirection == "asc" ? inventories.OrderBy(c => c.QuantityAvailable).ToList() : inventories.OrderByDescending(c => c.QuantityAvailable).ToList();
			}
			#endregion

			#region Paging
			var displayResult = inventories.Skip(param.iDisplayStart)
			   .Take(param.iDisplayLength).ToList();
			var totalRecords = inventories.Count();
			#endregion

			return Json(new
			{
				param.sEcho,
				iTotalRecords = totalRecords,
				iTotalDisplayRecords = totalRecords,
				aaData = displayResult,
				ItemsLastUpdateTimeDisplay,
				StocksLastUpdateTimeDisplay
			}, JsonRequestBehavior.AllowGet);
		}

		public ActionResult GetInventoriesM(JqueryDatatableParam param)
		{
			var inventories = InventoryEditModel.GetInventoryListFrmDB(apId, Session["PrimaryLocation"].ToString(), ref ItemsLastUpdateTimeDisplay, ref StocksLastUpdateTimeDisplay);
			// var inventories = ModelHelper.GetInventoryListFrmDB(apId, Session["PrimaryLocation"].ToString());

			if (!string.IsNullOrEmpty(param.sSearch))
			{
				inventories = inventories.Where(x => x.ItemName.ToLower().Contains(param.sSearch.ToLower()) || x.ItemNumber.ToLower().Contains(param.sSearch.ToLower())
											 || x.QuantityOnHand.ToString().Contains(param.sSearch.ToLower())
											 || x.SellOnOrder.ToString().Contains(param.sSearch.ToLower())
											 || x.PurchaseOnOrder.ToString().Contains(param.sSearch.ToLower())
											 || x.QuantityAvailable.ToString().Contains(param.sSearch.ToLower())
											 || x.LocationName.ToLower().Contains(param.sSearch.ToLower())
											 ).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_1))
			{
				inventories = inventories.Where(x => x.LocationIDTxt == Convert.ToString(param.sSearch_1)).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_6))
			{
				inventories = InventoryEditModel.GetInventoryListFrmDB(apId, param.sSearch_6, ref ItemsLastUpdateTimeDisplay, ref StocksLastUpdateTimeDisplay);
				//inventories = ModelHelper.GetInventoryListFrmDB(apId, Session["PrimaryLocation"].ToString());
			}
			//Sorting
			var sortColumnIndex = Convert.ToInt32(HttpContext.Request.QueryString["iSortCol_0"]);
			var sortDirection = HttpContext.Request.QueryString["sSortDir_0"];
			if (sortColumnIndex == 0)
			{
				inventories = sortDirection == "asc" ? inventories.OrderBy(c => c.ItemName).ToList() : inventories.OrderByDescending(c => c.ItemName).ToList();
			}
			else if (sortColumnIndex == 1)
			{
				inventories = sortDirection == "asc" ? inventories.OrderBy(c => c.ItemNumber).ToList() : inventories.OrderByDescending(c => c.ItemNumber).ToList();
			}
			else if (sortColumnIndex == 2)
			{
				inventories = sortDirection == "asc" ? inventories.OrderBy(c => c.QuantityAvailable).ToList() : inventories.OrderByDescending(c => c.QuantityAvailable).ToList();
			}

			//Paging
			var displayResult = inventories.Skip(param.iDisplayStart)
			   .Take(param.iDisplayLength).ToList();
			var totalRecords = inventories.Count();
			return Json(new
			{
				param.sEcho,
				iTotalRecords = totalRecords,
				iTotalDisplayRecords = totalRecords,
				aaData = displayResult,
				ItemsLastUpdateTimeDisplay,
				StocksLastUpdateTimeDisplay
			}, JsonRequestBehavior.AllowGet);
		}


		[HandleError]
		[CustomAuthorize("Quotation", "Admin", "SuperAdmin")]
		[RedirectAction]
		public ActionResult ShowQuotation()
		{
			ViewBag.PageName = "quotation";
			return View();
		}
		public ActionResult GetQuotations(JqueryDatatableParam param)
		{
			var quotations = QuotationHelper.GetQuotationListFrmDB(apId, SessUser.surUID);

			if (!UserHelper.CheckIfARAdmin(SessUser))
			{
				using (var context = new PPWDbContext(DbName))
				{
					userEmployees = context.UserEmployees.Where(x => x.AccountProfileId == apId && x.UserId == userId).ToList();
					if (userEmployees.Count > 0)
					{
						quotations = (from bar in quotations
									  join ue in userEmployees
										  on bar.SalesPersonID equals ue.EmployeeID
									  select bar
											  ).ToList();
					}
				}
			}

			List<UserSalesPerson> userSalesPeople = new List<UserSalesPerson>();
			using (var context = new PPWDbContext(DbName))
			{
				userSalesPeople = context.UserSalesPersons.Where(x => x.AccountProfileId == apId && x.UserId == userId).ToList();
			}

			if (userSalesPeople.Count > 0)
			{
				quotations = (from tp in quotations
							  join usp in userSalesPeople
							  on tp.SalesPersonID equals usp.SalesPersonId
							  select tp
							  ).ToList();
			}

			#region Sorting
			if (!string.IsNullOrEmpty(param.sSearch))
			{
				quotations = quotations.Where(x => x.InvoiceNumber.ToLower().Contains(param.sSearch.ToLower()) || x.InvoiceDate.ToString().Contains(param.sSearch.ToLower())
											 || x.CustomerName.ToLower().Contains(param.sSearch.ToLower())
											 || x.ItemNumber.ToLower().Contains(param.sSearch.ToLower())
											 || x.ItemName.ToLower().Contains(param.sSearch.ToLower())
											 || x.SalesPersonName.ToLower().Contains(param.sSearch.ToLower())
											 || x.Qty.ToString().Contains(param.sSearch.ToLower())
											 || x.TaxInclusiveUnitPrice.ToString().Contains(param.sSearch.ToLower())
											 ).ToList();
			}
			//Sorting:Order No	Sales	Customer	Item Number	Item	SalesPerson Name	Qty	Selling Price

			var sortColumnIndex = Convert.ToInt32(HttpContext.Request.QueryString["iSortCol_0"]);
			var sortDirection = HttpContext.Request.QueryString["sSortDir_0"];
			if (sortColumnIndex == 0)
			{
				quotations = sortDirection == "asc" ? quotations.OrderBy(c => c.InvoiceNumber).ToList() : quotations.OrderByDescending(c => c.InvoiceNumber).ToList();
			}
			else if (sortColumnIndex == 1)
			{
				quotations = sortDirection == "asc" ? quotations.OrderBy(c => c.InvoiceDate).ToList() : quotations.OrderByDescending(c => c.InvoiceDate).ToList();
			}
			else if (sortColumnIndex == 2)
			{
				quotations = sortDirection == "asc" ? quotations.OrderBy(c => c.CustomerName).ToList() : quotations.OrderByDescending(c => c.CustomerName).ToList();
			}
			else if (sortColumnIndex == 3)
			{
				quotations = sortDirection == "asc" ? quotations.OrderBy(c => c.ItemNumber.ToString()).ToList() : quotations.OrderByDescending(c => c.ItemNumber.ToString()).ToList();
			}
			else if (sortColumnIndex == 4)
			{
				quotations = sortDirection == "asc" ? quotations.OrderBy(c => c.ItemName).ToList() : quotations.OrderByDescending(c => c.ItemName).ToList();
			}
			else if (sortColumnIndex == 5)
			{
				quotations = sortDirection == "asc" ? quotations.OrderBy(c => c.SalesPersonName).ToList() : quotations.OrderByDescending(c => c.SalesPersonName).ToList();
			}
			else if (sortColumnIndex == 6)
			{
				quotations = sortDirection == "asc" ? quotations.OrderBy(c => c.Qty).ToList() : quotations.OrderByDescending(c => c.Qty).ToList();
			}
			else if (sortColumnIndex == 7)
			{
				quotations = sortDirection == "asc" ? quotations.OrderBy(c => c.TaxInclusiveUnitPrice).ToList() : quotations.OrderByDescending(c => c.TaxInclusiveUnitPrice).ToList();
			}

			if (!string.IsNullOrEmpty(param.sSearch_8))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_8);
				quotations = quotations.Where(x => x.InvoiceDate >= frmdate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_9))
			{
				DateTime todate = DateTime.Parse(param.sSearch_9);
				quotations = quotations.Where(x => x.InvoiceDate <= todate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_8) && !string.IsNullOrEmpty(param.sSearch_9))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_8);
				DateTime todate = DateTime.Parse(param.sSearch_9);

				quotations = quotations.Where(x => x.InvoiceDate >= frmdate && x.InvoiceDate <= todate).ToList();
			}
			#endregion

			#region Paging
			var displayResult = quotations.Skip(param.iDisplayStart)
			   .Take(param.iDisplayLength).ToList();
			var totalRecords = quotations.Count();
			#endregion

			return Json(new
			{
				param.sEcho,
				iTotalRecords = totalRecords,
				iTotalDisplayRecords = totalRecords,
				aaData = displayResult
			}, JsonRequestBehavior.AllowGet);
		}
		public ActionResult GetQuotationsM(JqueryDatatableParam param)
		{
			int userId = SessUser.surUID;
			var quotations = QuotationHelper.GetQuotationListFrmDB(apId, userId);

			if (!UserHelper.CheckIfARAdmin(SessUser))
			{
				using (var context = new PPWDbContext(DbName))
				{
					userEmployees = context.UserEmployees.Where(x => x.AccountProfileId == apId && x.UserId == userId).ToList();
					if (userEmployees.Count > 0)
					{
						quotations = (from bar in quotations
									  join ue in userEmployees
										  on bar.SalesPersonID equals ue.EmployeeID
									  select bar
											  ).ToList();
					}
				}
			}

			List<UserSalesPerson> userSalesPeople = new List<UserSalesPerson>();
			using (var context = new PPWDbContext(DbName))
			{
				userSalesPeople = context.UserSalesPersons.Where(x => x.AccountProfileId == apId && x.UserId == userId).ToList();
			}

			if (userSalesPeople.Count > 0)
			{
				quotations = (from tp in quotations
							  join usp in userSalesPeople
							  on tp.SalesPersonID equals usp.SalesPersonId
							  select tp
							  ).ToList();
			}


			if (!string.IsNullOrEmpty(param.sSearch))
			{
				quotations = quotations.Where(x => x.InvoiceNumber.ToLower().Contains(param.sSearch.ToLower()) || x.InvoiceDate.ToString().Contains(param.sSearch.ToLower())
											 || x.CustomerName.ToLower().Contains(param.sSearch.ToLower())
											 || x.ItemNumber.ToLower().Contains(param.sSearch.ToLower())
											 || x.ItemName.ToLower().Contains(param.sSearch.ToLower())
											 || x.SalesPersonName.ToLower().Contains(param.sSearch.ToLower())
											 || x.Qty.ToString().Contains(param.sSearch.ToLower())
											 || x.TaxInclusiveUnitPrice.ToString().Contains(param.sSearch.ToLower())
											 ).ToList();
			}
			//Sorting:Order No	Sales	Customer	Item Number	Item	SalesPerson Name	Qty	Selling Price

			var sortColumnIndex = Convert.ToInt32(HttpContext.Request.QueryString["iSortCol_0"]);
			var sortDirection = HttpContext.Request.QueryString["sSortDir_0"];
			if (sortColumnIndex == 0)
			{
				quotations = sortDirection == "asc" ? quotations.OrderBy(c => c.CustomerName).ToList() : quotations.OrderByDescending(c => c.CustomerName).ToList();
			}
			else if (sortColumnIndex == 1)
			{
				quotations = sortDirection == "asc" ? quotations.OrderBy(c => c.ItemName).ToList() : quotations.OrderByDescending(c => c.ItemName).ToList();
			}
			else if (sortColumnIndex == 2)
			{
				quotations = sortDirection == "asc" ? quotations.OrderBy(c => c.TaxInclusiveUnitPrice).ToList() : quotations.OrderByDescending(c => c.TaxInclusiveUnitPrice).ToList();
			}

			if (!string.IsNullOrEmpty(param.sSearch_3))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_3);
				quotations = quotations.Where(x => x.InvoiceDate >= frmdate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_4))
			{
				DateTime todate = DateTime.Parse(param.sSearch_4);
				quotations = quotations.Where(x => x.InvoiceDate <= todate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_3) && !string.IsNullOrEmpty(param.sSearch_4))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_3);
				DateTime todate = DateTime.Parse(param.sSearch_4);

				quotations = quotations.Where(x => x.InvoiceDate >= frmdate && x.InvoiceDate <= todate).ToList();
			}

			//Paging
			var displayResult = quotations.Skip(param.iDisplayStart)
			   .Take(param.iDisplayLength).ToList();
			var totalRecords = quotations.Count();
			return Json(new
			{
				param.sEcho,
				iTotalRecords = totalRecords,
				iTotalDisplayRecords = totalRecords,
				aaData = displayResult
			}, JsonRequestBehavior.AllowGet);
		}


		[HandleError]
		[CustomAuthorize("AccountReceivable", "Admin", "SuperAdmin")]
		[RedirectAction]
		public ActionResult ShowAccountReceivable()
		{
			ViewBag.PageName = "accountreceivable";
			return View();
		}
		public ActionResult GetAccountReceivables(JqueryDatatableParam param)
		{
			List<AccountReceivableView> accountReceivables = ARHelper.GetARListFrmDB(apId);

			if (!UserHelper.CheckIfARAdmin(SessUser))
			{
				using (var context = new PPWDbContext(DbName))
				{
					userEmployees = context.UserEmployees.Where(x => x.AccountProfileId == apId && x.UserId == userId).ToList();
					if (userEmployees.Count > 0)
					{
						var _accountReceivables = (from bar in accountReceivables
												   select bar
											  ).ToList();
						var employees = (from ue in userEmployees
										 select ue
										 ).ToList();
						accountReceivables = new List<AccountReceivableView>();
						foreach (var ac in _accountReceivables)
						{
							foreach (var e in employees)
							{
								if (ac.SalesPerson.ID == e.EmployeeID)
								{
									accountReceivables.Add(ac);
								}
							}
						}
					}
				}
			}

			if (!string.IsNullOrEmpty(param.sSearch))
			{
				accountReceivables = accountReceivables.Where(x => x.CustomerName.ToLower().Contains(param.sSearch.ToLower())
											 || x.InvoiceDate.ToString().Contains(param.sSearch.ToLower())
											 || x.InvoiceNumber.ToLower().Contains(param.sSearch.ToLower())
											 || x.Amount.ToString().Contains(param.sSearch.ToLower())
											 || x.Discount.ToString().Contains(param.sSearch.ToLower())
											 ).ToList();
			}
			foreach (AccountReceivableView ar in accountReceivables)
			{
				if (ar.TermsOfPayment.TermsID == 1)//cash on delivery
				{
					ar.DueDate = ar.InvoiceDate;
				}
				if (ar.TermsOfPayment.TermsID == 3)//30 days
				{
					ar.DueDate = ar.InvoiceDate.AddDays(30);
				}
				if (ar.TermsOfPayment.TermsID == 7)//60 days
				{
					ar.DueDate = ar.InvoiceDate.AddDays(60);
				}

				if (ar.DueDate > DateTime.Now.Date)
				{
					ar.TotalDue = 0;
				}
				else
				{
					ar.TotalDue = ar.Amount;
				}
				ar.AmountApplied = ar.TotalDue - ar.Discount;
			}

			#region Sorting
			//Invoice Date	Due Date	Customer	Amount	Discount	Total Due	Amount Applied
			var sortColumnIndex = Convert.ToInt32(HttpContext.Request.QueryString["iSortCol_0"]);
			var sortDirection = HttpContext.Request.QueryString["sSortDir_0"];
			if (sortColumnIndex == 0)
			{
				accountReceivables = sortDirection == "asc" ? accountReceivables.OrderBy(c => c.InvoiceDate).ToList() : accountReceivables.OrderByDescending(c => c.InvoiceDate).ToList();
			}
			else if (sortColumnIndex == 2)
			{
				accountReceivables = sortDirection == "asc" ? accountReceivables.OrderBy(c => c.CustomerName).ToList() : accountReceivables.OrderByDescending(c => c.CustomerName).ToList();
			}
			else if (sortColumnIndex == 3)
			{
				accountReceivables = sortDirection == "asc" ? accountReceivables.OrderBy(c => c.Amount).ToList() : accountReceivables.OrderByDescending(c => c.Amount).ToList();
			}
			else if (sortColumnIndex == 4)
			{
				accountReceivables = sortDirection == "asc" ? accountReceivables.OrderBy(c => c.Discount).ToList() : accountReceivables.OrderByDescending(c => c.Discount).ToList();
			}
			#endregion

			#region Paging            
			var displayResult = accountReceivables.Skip(param.iDisplayStart)
			   .Take(param.iDisplayLength).ToList();
			var totalRecords = accountReceivables.Count();
			#endregion

			return Json(new
			{
				param.sEcho,
				iTotalRecords = totalRecords,
				iTotalDisplayRecords = totalRecords,
				aaData = displayResult
			}, JsonRequestBehavior.AllowGet);
		}

		public ActionResult GetAccountReceivablesM(JqueryDatatableParam param)
		{
			List<AccountReceivableView> accountReceivables = ARHelper.GetARListFrmDB(apId);

			if (!UserHelper.CheckIfARAdmin(SessUser))
			{
				using (var context = new PPWDbContext(DbName))
				{
					userEmployees = context.UserEmployees.Where(x => x.AccountProfileId == apId && x.UserId == userId).ToList();
					if (userEmployees.Count > 0)
					{
						var _accountReceivables = (from bar in accountReceivables
												   select bar
											  ).ToList();
						var employees = (from ue in userEmployees
										 select ue
										 ).ToList();
						accountReceivables = new List<AccountReceivableView>();
						foreach (var ac in _accountReceivables)
						{
							foreach (var e in employees)
							{
								if (ac.SalesPerson.ID == e.EmployeeID)
								{
									accountReceivables.Add(ac);
								}
							}
						}
					}
				}
			}

			#region Sorting
			if (!string.IsNullOrEmpty(param.sSearch))
			{
				accountReceivables = accountReceivables.Where(x => x.CustomerName.ToLower().Contains(param.sSearch.ToLower())
											 || x.InvoiceDate.ToString().Contains(param.sSearch.ToLower())
											 || x.InvoiceNumber.ToLower().Contains(param.sSearch.ToLower())
											 || x.Amount.ToString().Contains(param.sSearch.ToLower())
											 || x.Discount.ToString().Contains(param.sSearch.ToLower())
											 ).ToList();
			}

			foreach (AccountReceivableView ar in accountReceivables)
			{
				if (ar.TermsOfPayment.TermsID == 1)//cash on delivery
				{
					ar.DueDate = ar.InvoiceDate;
				}
				if (ar.TermsOfPayment.TermsID == 3)//30 days
				{
					ar.DueDate = ar.InvoiceDate.AddDays(30);
				}
				if (ar.TermsOfPayment.TermsID == 7)//60 days
				{
					ar.DueDate = ar.InvoiceDate.AddDays(60);
				}

				if (ar.DueDate > DateTime.Now.Date)
				{
					ar.TotalDue = 0;
				}
				else
				{
					ar.TotalDue = ar.Amount;
				}
				ar.AmountApplied = ar.TotalDue - ar.Discount;
			}
			//Invoice Date	Due Date	Customer	Amount	Discount	Total Due	Amount Applied
			var sortColumnIndex = Convert.ToInt32(HttpContext.Request.QueryString["iSortCol_0"]);
			var sortDirection = HttpContext.Request.QueryString["sSortDir_0"];
			if (sortColumnIndex == 0)
			{
				accountReceivables = sortDirection == "asc" ? accountReceivables.OrderBy(c => c.InvoiceDate).ToList() : accountReceivables.OrderByDescending(c => c.InvoiceDate).ToList();
			}
			else if (sortColumnIndex == 1)
			{
				accountReceivables = sortDirection == "asc" ? accountReceivables.OrderBy(c => c.CustomerName).ToList() : accountReceivables.OrderByDescending(c => c.CustomerName).ToList();
			}
			#endregion

			#region Paging
			var displayResult = accountReceivables.Skip(param.iDisplayStart)
			   .Take(param.iDisplayLength).ToList();
			var totalRecords = accountReceivables.Count();
			#endregion

			return Json(new
			{
				param.sEcho,
				iTotalRecords = totalRecords,
				iTotalDisplayRecords = totalRecords,
				aaData = displayResult
			}, JsonRequestBehavior.AllowGet);
		}


		[HandleError]
		[CustomAuthorize("SalesPersonPerformance", "Admin", "SuperAdmin")]
		[RedirectAction]
		public ActionResult ShowSalesPersonPerformance()
		{
			ViewBag.PageName = "salespersonperformance";
			return View();
		}
		public ActionResult GetSalesPersonPerformances(JqueryDatatableParam param)
		{
			List<SPPView> salesPersonPerformances = SPPHelper.GetSPPListFrmDB(apId);

			if (!UserHelper.CheckIfARAdmin(SessUser))
			{
				using (var context = new PPWDbContext(DbName))
				{
					userEmployees = context.UserEmployees.Where(x => x.AccountProfileId == apId && x.UserId == userId).ToList();
					if (userEmployees.Count > 0)
					{
						salesPersonPerformances = (from bar in salesPersonPerformances
												   join ue in userEmployees
										  on bar.SalesPersonID equals ue.EmployeeID
												   select bar
											  ).ToList();
					}
				}
			}

			if (!string.IsNullOrEmpty(param.sSearch))
			{
				//Invoice Number	Invoice Date	SalesPerson	Total Paid	Outstanding Balance	Tax Inclusive Freight	Total Tax	Total Sales
				salesPersonPerformances = salesPersonPerformances.Where(x => x.InvoiceNumber.ToLower().Contains(param.sSearch.ToLower()) || x.InvoiceDate.ToString().Contains(param.sSearch.ToLower())
											 || x.SalesPersonName.ToLower().Contains(param.sSearch.ToLower())
											 || x.TotalPaid.ToString().Contains(param.sSearch.ToLower())
											 || x.OutstandingBalance.ToString().Contains(param.sSearch.ToLower())
											 || x.Customer.Name.ToLower().Contains(param.sSearch.ToLower())
											 || x.TotalSales.ToString().Contains(param.sSearch.ToLower())
											 || x.InvoiceStatus.ToLower().Contains(param.sSearch.ToLower())
											 ).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_8))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_8);
				salesPersonPerformances = salesPersonPerformances.Where(x => x.InvoiceDate >= frmdate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_9))
			{
				DateTime todate = DateTime.Parse(param.sSearch_9);
				salesPersonPerformances = salesPersonPerformances.Where(x => x.InvoiceDate <= todate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_8) && !string.IsNullOrEmpty(param.sSearch_9))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_8);
				DateTime todate = DateTime.Parse(param.sSearch_9);

				salesPersonPerformances = salesPersonPerformances.Where(x => x.InvoiceDate >= frmdate && x.InvoiceDate <= todate).ToList();
			}

			if (!string.IsNullOrEmpty(param.sSearch_3))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_3);
				salesPersonPerformances = salesPersonPerformances.Where(x => x.InvoiceDate >= frmdate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_4))
			{
				DateTime todate = DateTime.Parse(param.sSearch_4);
				salesPersonPerformances = salesPersonPerformances.Where(x => x.InvoiceDate <= todate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_3) && !string.IsNullOrEmpty(param.sSearch_4))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_3);
				DateTime todate = DateTime.Parse(param.sSearch_4);

				salesPersonPerformances = salesPersonPerformances.Where(x => x.InvoiceDate >= frmdate && x.InvoiceDate <= todate).ToList();
			}
			//Sorting:Invoice Number	Invoice Date	SalesPerson	Total Paid	Outstanding Balance	Tax Inclusive Freight	Total Tax	Total Sales

			var sortColumnIndex = Convert.ToInt32(HttpContext.Request.QueryString["iSortCol_0"]);
			var sortDirection = HttpContext.Request.QueryString["sSortDir_0"];
			if (sortColumnIndex == 0)
			{
				salesPersonPerformances = sortDirection == "asc" ? salesPersonPerformances.OrderBy(c => c.InvoiceDate).ToList() : salesPersonPerformances.OrderByDescending(c => c.InvoiceDate).ToList();
			}
			else if (sortColumnIndex == 1)
			{
				salesPersonPerformances = sortDirection == "asc" ? salesPersonPerformances.OrderBy(c => c.InvoiceNumber).ToList() : salesPersonPerformances.OrderByDescending(c => c.InvoiceNumber).ToList();
			}
			else if (sortColumnIndex == 2)
			{
				salesPersonPerformances = sortDirection == "asc" ? salesPersonPerformances.OrderBy(c => c.Customer.Name).ToList() : salesPersonPerformances.OrderByDescending(c => c.Customer.Name).ToList();
			}
			else if (sortColumnIndex == 3)
			{
				salesPersonPerformances = sortDirection == "asc" ? salesPersonPerformances.OrderBy(c => c.SalesPersonName).ToList() : salesPersonPerformances.OrderByDescending(c => c.SalesPersonName).ToList();
			}
			else if (sortColumnIndex == 4)
			{
				salesPersonPerformances = sortDirection == "asc" ? salesPersonPerformances.OrderBy(c => c.TotalSales).ToList() : salesPersonPerformances.OrderByDescending(c => c.TotalSales).ToList();
			}
			else if (sortColumnIndex == 5)
			{
				salesPersonPerformances = sortDirection == "asc" ? salesPersonPerformances.OrderBy(c => c.TotalPaid).ToList() : salesPersonPerformances.OrderByDescending(c => c.TotalPaid).ToList();
			}
			else if (sortColumnIndex == 6)
			{
				salesPersonPerformances = sortDirection == "asc" ? salesPersonPerformances.OrderBy(c => c.OutstandingBalance).ToList() : salesPersonPerformances.OrderByDescending(c => c.OutstandingBalance).ToList();
			}
			else if (sortColumnIndex == 7)
			{
				salesPersonPerformances = sortDirection == "asc" ? salesPersonPerformances.OrderBy(c => c.InvoiceStatus).ToList() : salesPersonPerformances.OrderByDescending(c => c.InvoiceStatus).ToList();
			}
			//Paging
			var displayResult = salesPersonPerformances.Skip(param.iDisplayStart)
			   .Take(param.iDisplayLength).ToList();
			var totalRecords = salesPersonPerformances.Count();
			return Json(new
			{
				param.sEcho,
				iTotalRecords = totalRecords,
				iTotalDisplayRecords = totalRecords,
				aaData = displayResult
			}, JsonRequestBehavior.AllowGet);
		}
		public ActionResult GetSalesPersonPerformancesM(JqueryDatatableParam param)
		{
			List<SPPView> salesPersonPerformances = SPPHelper.GetSPPListFrmDB(apId);

			if (!UserHelper.CheckIfARAdmin(SessUser))
			{
				using (var context = new PPWDbContext(DbName))
				{
					userEmployees = context.UserEmployees.Where(x => x.AccountProfileId == apId && x.UserId == userId).ToList();
					if (userEmployees.Count > 0)
					{
						salesPersonPerformances = (from bar in salesPersonPerformances
												   join ue in userEmployees
										  on bar.SalesPersonID equals ue.EmployeeID
												   select bar
											  ).ToList();
					}
				}
			}

			if (!string.IsNullOrEmpty(param.sSearch))
			{
				//Invoice Number	Invoice Date	SalesPerson	Total Paid	Outstanding Balance	Tax Inclusive Freight	Total Tax	Total Sales
				salesPersonPerformances = salesPersonPerformances.Where(x => x.InvoiceNumber.ToLower().Contains(param.sSearch.ToLower()) || x.InvoiceDate.ToString().Contains(param.sSearch.ToLower())
											 || x.SalesPersonName.ToLower().Contains(param.sSearch.ToLower())
											 || x.TotalPaid.ToString().Contains(param.sSearch.ToLower())
											 || x.OutstandingBalance.ToString().Contains(param.sSearch.ToLower())
											 || x.Customer.Name.ToLower().Contains(param.sSearch.ToLower())
											 || x.TotalSales.ToString().Contains(param.sSearch.ToLower())
											 || x.InvoiceStatus.ToLower().Contains(param.sSearch.ToLower())
											 ).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_8))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_8);
				salesPersonPerformances = salesPersonPerformances.Where(x => x.InvoiceDate >= frmdate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_9))
			{
				DateTime todate = DateTime.Parse(param.sSearch_9);
				salesPersonPerformances = salesPersonPerformances.Where(x => x.InvoiceDate <= todate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_8) && !string.IsNullOrEmpty(param.sSearch_9))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_8);
				DateTime todate = DateTime.Parse(param.sSearch_9);

				salesPersonPerformances = salesPersonPerformances.Where(x => x.InvoiceDate >= frmdate && x.InvoiceDate <= todate).ToList();
			}

			if (!string.IsNullOrEmpty(param.sSearch_3))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_3);
				salesPersonPerformances = salesPersonPerformances.Where(x => x.InvoiceDate >= frmdate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_4))
			{
				DateTime todate = DateTime.Parse(param.sSearch_4);
				salesPersonPerformances = salesPersonPerformances.Where(x => x.InvoiceDate <= todate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_3) && !string.IsNullOrEmpty(param.sSearch_4))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_3);
				DateTime todate = DateTime.Parse(param.sSearch_4);

				salesPersonPerformances = salesPersonPerformances.Where(x => x.InvoiceDate >= frmdate && x.InvoiceDate <= todate).ToList();
			}
			//Sorting:Invoice Number	Invoice Date	SalesPerson	Total Paid	Outstanding Balance	Tax Inclusive Freight	Total Tax	Total Sales

			var sortColumnIndex = Convert.ToInt32(HttpContext.Request.QueryString["iSortCol_0"]);
			var sortDirection = HttpContext.Request.QueryString["sSortDir_0"];
			if (sortColumnIndex == 0)
			{
				salesPersonPerformances = sortDirection == "asc" ? salesPersonPerformances.OrderBy(c => c.InvoiceDate).ToList() : salesPersonPerformances.OrderByDescending(c => c.InvoiceDate).ToList();
			}
			else if (sortColumnIndex == 1)
			{
				salesPersonPerformances = sortDirection == "asc" ? salesPersonPerformances.OrderBy(c => c.Customer.Name).ToList() : salesPersonPerformances.OrderByDescending(c => c.Customer.Name).ToList();
			}
			else if (sortColumnIndex == 2)
			{
				salesPersonPerformances = sortDirection == "asc" ? salesPersonPerformances.OrderBy(c => c.TotalSales).ToList() : salesPersonPerformances.OrderByDescending(c => c.TotalSales).ToList();
			}
			//Paging
			var displayResult = salesPersonPerformances.Skip(param.iDisplayStart)
			   .Take(param.iDisplayLength).ToList();
			var totalRecords = salesPersonPerformances.Count();
			return Json(new
			{
				param.sEcho,
				iTotalRecords = totalRecords,
				iTotalDisplayRecords = totalRecords,
				aaData = displayResult
			}, JsonRequestBehavior.AllowGet);
		}

		[HandleError]
		[CustomAuthorize("CustomersInvoices", "Admin", "SuperAdmin")]
		[RedirectAction]
		public ActionResult ShowCustomersInvoices()
		{
			ViewBag.PageName = "customersinvoices";
			return View();
		}
		public ActionResult GetCustomersInvoicess(JqueryDatatableParam param)
		{
			List<CIView> customersInvoicess = CIHelper.GetCIListFrmDB(apId);

			if (!UserHelper.CheckIfARAdmin(SessUser))
			{
				using (var context = new PPWDbContext(DbName))
				{
					userEmployees = context.UserEmployees.Where(x => x.AccountProfileId == apId && x.UserId == userId).ToList();
					if (userEmployees.Count > 0)
					{
						customersInvoicess = (from bar in customersInvoicess
											  join ue in userEmployees
									 on bar.SalesPerson.ID equals ue.EmployeeID
											  select bar
											  ).ToList();
					}
				}
			}

			if (!string.IsNullOrEmpty(param.sSearch))
			{
				//Invoice Number	Invoice Date	SalesPerson	Total Paid	Outstanding Balance	Tax Inclusive Freight	Total Tax	Total Sales
				customersInvoicess = customersInvoicess.Where(x => x.InvoiceNumber.ToLower().Contains(param.sSearch.ToLower()) || x.InvoiceDate.ToString().Contains(param.sSearch.ToLower())
											 || x.CustomerName.ToLower().Contains(param.sSearch.ToLower())
											 || x.TotalPaid.ToString().Contains(param.sSearch.ToLower())
											 || x.OutstandingBalance.ToString().Contains(param.sSearch.ToLower())
											 || x.TaxInclusiveFreight.ToString().Contains(param.sSearch.ToLower())
											 || x.TotalTax.ToString().Contains(param.sSearch.ToLower())
											 || x.TotalSales.ToString().Contains(param.sSearch.ToLower())
											 ).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_8))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_8);
				customersInvoicess = customersInvoicess.Where(x => x.InvoiceDate >= frmdate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_9))
			{
				DateTime todate = DateTime.Parse(param.sSearch_9);
				customersInvoicess = customersInvoicess.Where(x => x.InvoiceDate <= todate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_8) && !string.IsNullOrEmpty(param.sSearch_9))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_8);
				DateTime todate = DateTime.Parse(param.sSearch_9);

				customersInvoicess = customersInvoicess.Where(x => x.InvoiceDate >= frmdate && x.InvoiceDate <= todate).ToList();
			}

			if (!string.IsNullOrEmpty(param.sSearch_3))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_3);
				customersInvoicess = customersInvoicess.Where(x => x.InvoiceDate >= frmdate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_4))
			{
				DateTime todate = DateTime.Parse(param.sSearch_4);
				customersInvoicess = customersInvoicess.Where(x => x.InvoiceDate <= todate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_3) && !string.IsNullOrEmpty(param.sSearch_4))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_3);
				DateTime todate = DateTime.Parse(param.sSearch_4);

				customersInvoicess = customersInvoicess.Where(x => x.InvoiceDate >= frmdate && x.InvoiceDate <= todate).ToList();
			}

			//Sorting:Invoice Number	Invoice Date	SalesPerson	Total Paid	Outstanding Balance	Tax Inclusive Freight	Total Tax	Total Sales

			var sortColumnIndex = Convert.ToInt32(HttpContext.Request.QueryString["iSortCol_0"]);
			var sortDirection = HttpContext.Request.QueryString["sSortDir_0"];
			if (sortColumnIndex == 0)
			{
				customersInvoicess = sortDirection == "asc" ? customersInvoicess.OrderBy(c => c.InvoiceNumber).ToList() : customersInvoicess.OrderByDescending(c => c.InvoiceNumber).ToList();
			}
			else if (sortColumnIndex == 1)
			{
				customersInvoicess = sortDirection == "asc" ? customersInvoicess.OrderBy(c => c.InvoiceDate).ToList() : customersInvoicess.OrderByDescending(c => c.InvoiceDate).ToList();
			}
			else if (sortColumnIndex == 2)
			{
				customersInvoicess = sortDirection == "asc" ? customersInvoicess.OrderBy(c => c.CustomerName).ToList() : customersInvoicess.OrderByDescending(c => c.CustomerName).ToList();
			}
			else if (sortColumnIndex == 3)
			{
				customersInvoicess = sortDirection == "asc" ? customersInvoicess.OrderBy(c => c.TotalPaid).ToList() : customersInvoicess.OrderByDescending(c => c.TotalPaid).ToList();
			}
			else if (sortColumnIndex == 4)
			{
				customersInvoicess = sortDirection == "asc" ? customersInvoicess.OrderBy(c => c.OutstandingBalance).ToList() : customersInvoicess.OrderByDescending(c => c.OutstandingBalance).ToList();
			}
			else if (sortColumnIndex == 5)
			{
				customersInvoicess = sortDirection == "asc" ? customersInvoicess.OrderBy(c => c.TaxInclusiveFreight).ToList() : customersInvoicess.OrderByDescending(c => c.TaxInclusiveFreight).ToList();
			}
			else if (sortColumnIndex == 6)
			{
				customersInvoicess = sortDirection == "asc" ? customersInvoicess.OrderBy(c => c.TotalTax).ToList() : customersInvoicess.OrderByDescending(c => c.TotalTax).ToList();
			}
			else if (sortColumnIndex == 7)
			{
				customersInvoicess = sortDirection == "asc" ? customersInvoicess.OrderBy(c => c.TotalSales).ToList() : customersInvoicess.OrderByDescending(c => c.TotalSales).ToList();
			}
			//Paging
			var displayResult = customersInvoicess.Skip(param.iDisplayStart)
			   .Take(param.iDisplayLength).ToList();
			var totalRecords = customersInvoicess.Count();
			return Json(new
			{
				param.sEcho,
				iTotalRecords = totalRecords,
				iTotalDisplayRecords = totalRecords,
				aaData = displayResult
			}, JsonRequestBehavior.AllowGet);
		}
		public ActionResult GetCustomersInvoicessM(JqueryDatatableParam param)
		{
			List<CIView> customersInvoicess = CIHelper.GetCIListFrmDB(apId);

			if (!UserHelper.CheckIfARAdmin(SessUser))
			{
				using (var context = new PPWDbContext(DbName))
				{
					userEmployees = context.UserEmployees.Where(x => x.AccountProfileId == apId && x.UserId == userId).ToList();
					if (userEmployees.Count > 0)
					{
						customersInvoicess = (from bar in customersInvoicess
											  join ue in userEmployees
									 on bar.SalesPerson.ID equals ue.EmployeeID
											  select bar
											  ).ToList();
					}
				}
			}

			if (!string.IsNullOrEmpty(param.sSearch))
			{
				//Invoice Number	Invoice Date	SalesPerson	Total Paid	Outstanding Balance	Tax Inclusive Freight	Total Tax	Total Sales
				customersInvoicess = customersInvoicess.Where(x => x.InvoiceNumber.ToLower().Contains(param.sSearch.ToLower()) || x.InvoiceDate.ToString().Contains(param.sSearch.ToLower())
											 || x.CustomerName.ToLower().Contains(param.sSearch.ToLower())
											 || x.TotalPaid.ToString().Contains(param.sSearch.ToLower())
											 || x.OutstandingBalance.ToString().Contains(param.sSearch.ToLower())
											 || x.TaxInclusiveFreight.ToString().Contains(param.sSearch.ToLower())
											 || x.TotalTax.ToString().Contains(param.sSearch.ToLower())
											 || x.TotalSales.ToString().Contains(param.sSearch.ToLower())
											 ).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_8))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_8);
				customersInvoicess = customersInvoicess.Where(x => x.InvoiceDate >= frmdate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_9))
			{
				DateTime todate = DateTime.Parse(param.sSearch_9);
				customersInvoicess = customersInvoicess.Where(x => x.InvoiceDate <= todate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_8) && !string.IsNullOrEmpty(param.sSearch_9))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_8);
				DateTime todate = DateTime.Parse(param.sSearch_9);

				customersInvoicess = customersInvoicess.Where(x => x.InvoiceDate >= frmdate && x.InvoiceDate <= todate).ToList();
			}

			if (!string.IsNullOrEmpty(param.sSearch_3))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_3);
				customersInvoicess = customersInvoicess.Where(x => x.InvoiceDate >= frmdate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_4))
			{
				DateTime todate = DateTime.Parse(param.sSearch_4);
				customersInvoicess = customersInvoicess.Where(x => x.InvoiceDate <= todate).ToList();
			}
			if (!string.IsNullOrEmpty(param.sSearch_3) && !string.IsNullOrEmpty(param.sSearch_4))
			{
				DateTime frmdate = DateTime.Parse(param.sSearch_3);
				DateTime todate = DateTime.Parse(param.sSearch_4);

				customersInvoicess = customersInvoicess.Where(x => x.InvoiceDate >= frmdate && x.InvoiceDate <= todate).ToList();
			}

			//Sorting:Invoice Number	Invoice Date	SalesPerson	Total Paid	Outstanding Balance	Tax Inclusive Freight	Total Tax	Total Sales

			var sortColumnIndex = Convert.ToInt32(HttpContext.Request.QueryString["iSortCol_0"]);
			var sortDirection = HttpContext.Request.QueryString["sSortDir_0"];
			if (sortColumnIndex == 0)
			{
				customersInvoicess = sortDirection == "asc" ? customersInvoicess.OrderBy(c => c.InvoiceDate).ToList() : customersInvoicess.OrderByDescending(c => c.InvoiceDate).ToList();
			}
			else if (sortColumnIndex == 1)
			{
				customersInvoicess = sortDirection == "asc" ? customersInvoicess.OrderBy(c => c.CustomerName).ToList() : customersInvoicess.OrderByDescending(c => c.CustomerName).ToList();
			}
			else if (sortColumnIndex == 2)
			{
				customersInvoicess = sortDirection == "asc" ? customersInvoicess.OrderBy(c => c.TotalSales).ToList() : customersInvoicess.OrderByDescending(c => c.TotalSales).ToList();
			}
			//Paging
			var displayResult = customersInvoicess.Skip(param.iDisplayStart)
			   .Take(param.iDisplayLength).ToList();
			var totalRecords = customersInvoicess.Count();
			return Json(new
			{
				param.sEcho,
				iTotalRecords = totalRecords,
				iTotalDisplayRecords = totalRecords,
				aaData = displayResult
			}, JsonRequestBehavior.AllowGet);
		}
	}
}