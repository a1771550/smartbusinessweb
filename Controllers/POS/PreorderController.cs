using PPWLib.Helpers;
using PPWLib.Models;
using PPWLib.Models.POS.Sales;
using SmartBusinessWeb.Infrastructure;
using System.Collections.Generic;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.POS
{
	[CustomAuthenticationFilter]
	[SessionExpire]
	public class PreorderController : BaseController
	{
		[HandleError]
		[CustomAuthorize("retail", "boss", "admin", "superadmin")]
		public ActionResult Index(string strfrmdate = "", string strtodate = "", int? PageNo = 1, string SortName = "rtsTime", string SortOrder = "desc", string Shop = "", string Device = "", string Keyword = "", int filter = 0, string searchmode = "")
		{
			ViewBag.ParentPage = "sales";
			ViewBag.PageName = "preorderlist";
			PreorderEditModel model = new PreorderEditModel();
			model.GetList(strfrmdate, strtodate, (int)PageNo, SortName, SortOrder, Shop, Device, Keyword, filter, searchmode);
			return View(model);
		}

		[HandleError]
		[CustomAuthorize("retail", "boss", "admin", "superadmin")]
		[HttpGet]
		public ActionResult Edit(long? Id = 0)
		{
			ViewBag.ParentPage = "sales";
			ViewBag.PageName = "preorderlist";
			PreorderEditModel model = new PreorderEditModel();
			model.Get((long)Id);
			return View(model);
		}

		[HandleError]
		[CustomAuthorize("retail", "boss", "admin", "superadmin")]
		[HttpPost]
		public JsonResult Edit(PreSalesModel Sales, List<SalesLnView> SalesLnList, List<PayLnView> Payments)
		//public JsonResult Edit(PreSalesModel Sales)
		{
			string finalsalescode = "";
			ViewBag.ParentPage = "sales";
			ViewBag.PageName = "preorderlist";
			PreorderEditModel model = new PreorderEditModel();
			finalsalescode = model.Edit(Sales, SalesLnList, Payments);
			if (string.IsNullOrEmpty(Sales.authcode))
			{
				return Json(new { msg = "", finalsalescode });
			}
			else
			{
				#region ePayment
				decimal totalpayamt = 0;
				using var context = new PPWDAL.PPWDbContext(ModelHelper.GetDbName(apId));
				//var salescode = Sale.salescode;
				var epayReturn = SalesEditModel.HandleEPayMent(Sales, SalesLnList, ref totalpayamt, context, finalsalescode, apId);
				var _ps = epayReturn.ps;
				if (epayReturn.nodelist != null)
				{
					if (string.IsNullOrEmpty(epayReturn.message))
					{
						if (epayReturn.status == "0")
						{
							if (epayReturn.resultcode != "0")
							{

								if (_ps.NeedQuery && _ps.ErrCode == "USERPAYING")
								{
									return Json(new { msg = "needquery_userpaying", finalsalescode, _ps, epaystatus = -1 });
								}
								else
								{
									return Json(new { msg = Resources.Resource.ePaymentFailed, finalsalescode, _ps, epaystatus = 0 });
								}
							}
							else
							{
								return Json(new { msg = Resources.Resource.ePaymentSuccessful, finalsalescode, epaystatus = 1 });
							}
						}
						else
						{
							return Json(new { msg = Resources.Resource.ePaymentFailed, finalsalescode, _ps, epaystatus = 0 });

						}
					}
					else
					{
						return Json(new { msg = epayReturn.message, finalsalescode, _ps, epaystatus = 0 });
					}
				}
				else
				{
					return Json(new { msg = Resources.Resource.ePaymentFailed, finalsalescode, _ps, epaystatus = 0 });
				}
				#endregion
			}
		}
		[HandleError]
		[CustomAuthorize("retail", "boss", "admin", "superadmin")]
		public ActionResult Delete(long Id)
		{
			PreorderEditModel model = new PreorderEditModel();
			model.Delete(Id);
			return View();
		}
	}
}