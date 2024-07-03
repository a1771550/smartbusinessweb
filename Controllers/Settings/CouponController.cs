using PPWLib.Models.Coupon;
using SmartBusinessWeb.Infrastructure;
using System;
using System.Web.Mvc;
using System.Web.Razor.Tokenizer.Symbols;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Settings
{
    public class CouponController : BaseController
    {
        [HandleError]
        [CustomAuthorize("basicsettings", "admin", "superadmin")]

        public ActionResult Index(int PageNo = 1, int SortCol = 6, string SortOrder = "desc", string Keyword = null)
        {
            ViewBag.ParentPage = "setup";
            CouponEditModel model = new CouponEditModel { PageNo = PageNo, SortCol = SortCol, SortOrder = SortOrder == "desc" ? "asc" : "desc", Keyword = Keyword };
            model.GetList(PageNo, SortCol, SortOrder, Keyword);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("basicsettings", "admin", "superadmin")]
        public ActionResult Edit(int Id = 0, int PageNo = 1, int SortCol = 3, string SortOrder = "desc")
        {
            ViewBag.ParentPage = "setup";
            CouponEditModel model = new CouponEditModel { PageNo = PageNo, SortCol = SortCol, SortOrder = SortOrder == "desc" ? "asc" : "desc" };
            model.Get(Id, PageNo, SortCol, SortOrder);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("basicsettings", "admin", "superadmin")]
        [HttpPost]
        public JsonResult Edit(CouponModel Coupon)
        {
            CouponEditModel.Edit(Coupon);
            return Json(Resources.Resource.Saved);
        }

        [HandleError]
        [CustomAuthorize("basicsettings", "admin", "superadmin")]
        [HttpPost]
        public JsonResult ToggleAllLn(string code, int all, string type)
        {
            CouponEditModel.ToggleAllLn(code, all, type);
            return Json(Resources.Resource.Saved);
        }

        [HandleError]
        [CustomAuthorize("basicsettings", "admin", "superadmin")]
        [HttpPost]
        public JsonResult EditLn(CouponLnModel CouponLn, string type)
        {
            CouponEditModel.EditLn(CouponLn, type);
            return Json(Resources.Resource.Saved);
        }

        [HandleError]
        [CustomAuthorize("basicsettings", "admin", "superadmin")]
        public ActionResult Delete(int Id = 0)
        {
            CouponEditModel.Delete(Id);
            return RedirectToAction("Index");
        }
    }
}