using PPWDAL;
using PagedList;
using SmartBusinessWeb.Infrastructure;
using PPWLib.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using CommonLib.Helpers;
using CommonLib.Models;
using System;
using ModelHelper = PPWLib.Helpers.ModelHelper;
using PPWLib.Models.Item;

namespace SmartBusinessWeb.Controllers.Item
{
    [CustomAuthenticationFilter]
    public class InventoryAdjustmentController : BaseController
    {
        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Index(int SortCol = 0, string SortOrder = "desc", string Keyword = "", int? PageNo = 1)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "IA";
            if (string.IsNullOrEmpty(Keyword))
                Keyword = null;

            IAEditModel model = new IAEditModel
            {
                SortCol = SortCol,
                SortOrder = (SortOrder == "desc") ? "asc" : "desc",
                Keyword = Keyword,
                PageNo = PageNo
            };

            model.GetList();
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int Id)
        {
            IAEditModel model = new IAEditModel();
            model.Get(Id);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(IAModel IA)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "IA";

            IAEditModel.Edit(IA);

            return Json(Resources.Resource.Saved);
        }

    }
}