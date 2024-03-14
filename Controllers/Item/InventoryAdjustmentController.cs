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
        public ActionResult Index(int SortCol = 0, string SortOrder = "desc", string Keyword = "", int? PageNo = 1)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "InventoryAdjustment";
            if (string.IsNullOrEmpty(Keyword))
                Keyword = null;

            InventoryAdjustmentEditModel model = new InventoryAdjustmentEditModel
            {
                SortCol = SortCol,
                SortOrder = (SortOrder == "desc") ? "asc" : "desc",
                Keyword = Keyword,
                PageNo = PageNo
            };

            model.GetList();
            return View(model);
        }

        public ActionResult Edit(int Id)
        {
            InventoryAdjustmentEditModel model = new InventoryAdjustmentEditModel();
            model.Get(Id);
            return View(model);
        }
    }
}