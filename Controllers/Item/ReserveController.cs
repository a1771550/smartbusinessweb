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
            model.PreparePrint(start, end, (CustomerModel)Session["Customer"]);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult ProcessReserve(List<JsStock> JsStockList, ReserveModel Reserve, List<ReserveLnModel> ReserveLnList)
        {
            var msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.Reserve);
            ReserveEditModel model = new ReserveEditModel();
            model.ProcessReserve(JsStockList, Reserve, ReserveLnList);
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
                Keyword = Keyword,
                SortOrder = (SortOrder == "desc") ? "asc" : "desc"
            };
            model.GetReserveList(PageNo, (int)ComInfo.PageLength, SortCol, SortOrder, Keyword);
            model.Keyword = Keyword;
            return View(model);
        }


        // GET: Reserve
        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, int SortCol = 0, string SortOrder = "desc", string Keyword = null)
        {
            ViewBag.ParentPage = "item";
            ReserveEditModel model = new()
            {
                SortCol = SortCol,
                Keyword = Keyword,
                SortOrder = (SortOrder == "desc") ? "asc" : "desc"
            };
            model.GetItemList(PageNo, (int)ComInfo.PageLength, SortCol, SortOrder, Keyword);
            return View(model);
        }
    }
}