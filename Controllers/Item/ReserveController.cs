using PPWDAL;
using PPWLib.Models.Customer;
using PPWLib.Models.Item;
using SmartBusinessWeb.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Item
{
    [CustomAuthenticationFilter]
    public class ReserveController : BaseController
    {
		[HandleError]
		[CustomAuthorize("item", "boss", "admin", "superadmin")]
		[ValidateAntiForgeryToken]
		[HttpPost]
		public JsonResult Cancel(int Id)
		{
            ReserveEditModel.Cancel(Id);
			return Json(string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.Reserve));
		}
		
		[HandleError]
		[CustomAuthorize("item", "boss", "admin", "superadmin")]
		public ActionResult Edit(string code)
		{
			ReserveEditModel model = new(code);
			return View(model);
		}

		[HandleError]
		[CustomAuthorize("item", "boss", "admin", "superadmin")]
		[ValidateAntiForgeryToken]
		[HttpPost]
		public JsonResult EditOrder(ReserveModel Reserve)
		{			
			ReserveEditModel.EditOrder(Reserve);
			return Json(string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.Reserve));
		}

		[HandleError]
		[CustomAuthorize("item", "boss", "admin", "superadmin")]
		[ValidateAntiForgeryToken]
		[HttpPost]
		public JsonResult EditLines(List<ReserveLnModel> ReserveLnList)
		{	
			ReserveEditModel.EditLines(ReserveLnList);
			return Json(Resources.Resource.Saved);
		}

		[HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult PrintByCode(string code)
        {
            ViewBag.ParentPage = "item";
            ReserveEditModel model = new ReserveEditModel();
            model.PreparePrint(code);
            return View("Print", model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult Print(int? start, int? end)
        {
            ViewBag.ParentPage = "item";          
            ReserveEditModel model = new ReserveEditModel();              
            model.PreparePrint(null,start, end);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult ProcessReserve(ReserveModel Reserve, List<ReserveLnModel> ReserveLnList)
        {
            var msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.Reserve);
            ReserveEditModel model = new ReserveEditModel();
            model.ProcessReserve(Reserve, ReserveLnList);
            return Json(new { msg });
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult List(int PageNo = 1, int SortCol = 0, string SortOrder = "desc", string Keyword = null)
        {
            ViewBag.ParentPage = "item";
            ReserveEditModel model = new()
            {
                SortCol = SortCol,
				SortOrder = (SortOrder == "desc") ? "asc" : "desc",
				CurrentSortOrder = SortOrder,
				Keyword = Keyword,                
            };
            model.GetReserveList(PageNo, (int)ComInfo.PageLength, SortCol, SortOrder, Keyword);          
            return View(model);
        }


        // GET: Reserve
        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, string SortName = "code", string SortOrder = "desc", string Keyword = null)
        {
            ViewBag.ParentPage = "item";
            ReserveEditModel model = new()
            {
                SortName = SortName,
				SortOrder = (SortOrder == "desc") ? "asc" : "desc",
				CurrentSortOrder = SortOrder,
				Keyword = Keyword,                
            };
            model.GetItemList(PageNo, (int)ComInfo.PageLength, SortName, SortOrder, Keyword);
            return View(model);
        }
    }
}