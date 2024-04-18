using PPWDAL;
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
        public ActionResult Print(int? start, int? end)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "print";
            ReserveEditModel model = new ReserveEditModel();
            model.PreparePrint(start, end);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult ProcessReserve(List<JsStock> JsStockList, ReserveModel Reserve, List<ReserveLineModel> ReserveLnList)
        {
            var msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.Reserve);
            ReserveEditModel model = new ReserveEditModel();
            model.ProcessReserve(JsStockList, Reserve, ReserveLnList);
            return Json(new { msg });
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult List(int SortCol = 0, string SortOrder = "desc", string strfrmdate = "", string strtodate = "", string Keyword = null, int? PageNo = 1)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "transferlist";
            //ViewBag.Title = string.Format(Resources.Resource.ListFormat, Resources.Resource.StockReserve);
            int Size_Of_Page = (int)ComInfo.PageLength;
            ReserveEditModel model = new ReserveEditModel();
            model.GetReserveList(strfrmdate, strtodate, (int)PageNo, Size_Of_Page, SortCol, SortOrder, Keyword);
            model.Keyword = Keyword;
            return View(model);
        }


        // GET: Reserve
        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, int SortCol = 0, string SortOrder = "desc", string Keyword = null)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "transfer";
            int Size_Of_Page = (int)ComInfo.PageLength;
            ReserveEditModel model = new()
            {
                SortCol = SortCol,
                Keyword = Keyword,
                SortOrder = (SortOrder == "desc") ? "asc" : "desc"
            };
            model.GetItemList(apId, PageNo, Size_Of_Page, SortCol, SortOrder, Keyword);
            return View(model);
        }
    }
}