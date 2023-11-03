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
    public class ItemController : BaseController
    {
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult SaveItemOptions(List<ItemOptionsModel> model)
        {
            string msg = string.Format(Resources.Resource.SavedFormat, Resources.Resource.Item);
            ItemEditModel.SaveItemOptions(model);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("stock", "boss", "admin", "superadmin")]
        public ActionResult ZeroStocks(string salescode, int? PageNo = 1)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "zerostocks";
            PendingInvoices model = new PendingInvoices();
            model.GetZeroStockList(salescode, PageNo);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("stock", "boss", "admin", "superadmin")]
        public ActionResult Stock()
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "stock";

            //int Size_Of_Page = (int)ComInfo.PageLength;

            if (CheckoutPortal.ToLower() == "kingdee") //modelhelper.getitemlist will tell the difference.
            {
                ItemStockEditModel model = new ItemStockEditModel();
                return View("KStock", model);
            }
            else
            {
                StockModel model = new StockModel();
                return View(model);
            }
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int itemId)
        {
            ViewBag.ParentPage = ViewBag.PageName = "item";
            ItemEditModel model = new ItemEditModel(itemId, true);
            return View(model);
        }
        
        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(ItemModel model)
        {
            ViewBag.ParentPage = ViewBag.PageName = "item";

            ItemEditModel.Edit(model);

            string msg = Resources.Resource.ItemSaved;
            return Json(msg);
        }

        //[HandleError]
        //[CustomAuthorize("item", "boss", "admin", "superadmin")]
        //[HttpGet]
        //public ActionResult EditIV(int itemId)
        //{
        //    ViewBag.ParentPage = ViewBag.PageName = "item";
        //    ItemEditModel model = new ItemEditModel(itemId, true);
        //    return View("Edit", model);
        //}

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult EditIV(ItemModel Item = null, ItemVariModel ItemVari = null, List<ItemAttributeModel> AttrList = null)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "item";
            if (Item != null)
            {
                ItemEditModel.EditIV(Item, null, AttrList);
            }
            else
            {
                ItemEditModel.EditIV(null, ItemVari, AttrList);
            }
            string msg = Resources.Resource.ItemSaved;
            return Json(msg);
        }




        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int itemId)
        {
            ViewBag.ParentPage = ViewBag.PageName = "item";
            string msg = ItemEditModel.Delete(itemId);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Detail(int itemId)
        {
            ItemEditModel model = new ItemEditModel(itemId, true);
            return Json(model.Item, JsonRequestBehavior.AllowGet);
        }
    }
}