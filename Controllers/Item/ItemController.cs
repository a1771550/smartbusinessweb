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
using PPWLib.Models.Sales;
using DocumentFormat.OpenXml.EMMA;

namespace SmartBusinessWeb.Controllers.Item
{
    [CustomAuthenticationFilter]
    public class ItemController : BaseController
    {
        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Index(int SortCol = 2, string SortOrder = "desc", string Keyword = "", int? PageNo = 1)
        {
            ViewBag.ParentPage = "Item";
            ViewBag.PageName = "list";
            if (string.IsNullOrEmpty(Keyword))
                Keyword = null;

            ItemEditModel model = new()
            {
                SortCol = SortCol,
                Keyword = Keyword,
                SortOrder = (SortOrder == "desc") ? "asc" : "desc"
            };

            var itemlist = model.GetList(Keyword);

            int Size_Of_Page = PageSize;
            int No_Of_Page = (PageNo ?? 1);
            var sortColumnIndex = SortCol;
            var sortDirection = SortOrder;

            if (sortColumnIndex == 0)
            {
                itemlist = sortDirection == "asc" ? itemlist.OrderBy(c => c.itmCode).ToList() : itemlist.OrderByDescending(c => c.itmCode).ToList();
            }
            else if (sortColumnIndex == 1)
            {
                itemlist = sortDirection == "asc" ? itemlist.OrderBy(c => c.NameDesc).ToList() : itemlist.OrderByDescending(c => c.NameDesc).ToList();
            }
            else if (sortColumnIndex == 2)
            {
                itemlist = sortDirection == "asc" ? itemlist.OrderBy(c => c.itmCreateTime).ToList() : itemlist.OrderByDescending(c => c.itmCreateTime).ToList();
            }
            else if (sortColumnIndex == 3)
            {
                itemlist = sortDirection == "asc" ? itemlist.OrderBy(c => c.itmModifyTime).ToList() : itemlist.OrderByDescending(c => c.itmModifyTime).ToList();
            }
            else if (sortColumnIndex == 4)
            {
                itemlist = sortDirection == "asc" ? itemlist.OrderBy(c => c.itmCheckout).ToList() : itemlist.OrderByDescending(c => c.itmCheckout).ToList();
            }

            model.PagingItemList = itemlist.ToPagedList(No_Of_Page, Size_Of_Page);
            return View(model);
        }


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
        public ActionResult Stock()
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "stock";
            StockModel model = new StockModel();
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int itemId, string referrer)
        {
            ViewBag.ParentPage = ViewBag.PageName = "item";
            ItemEditModel model = new ItemEditModel();
            model.Get(itemId);
            model.Referrer = referrer;
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


        public JsonResult SaveAttr(ItemModel model)
        {
			ItemEditModel.SaveAttr(model);			
			return Json(Resources.Resource.ItemSaved);
		}

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult EditIV(ItemModel Item = null, ItemVariModel ItemVari = null, List<ItemAttributeModel> AttrList = null)
        {
            ViewBag.ParentPage = "item";
           
            if (Item != null) ItemEditModel.EditIV(Item, null, AttrList);			
            else ItemEditModel.EditIV(null, ItemVari, AttrList);
          
            return Json(Resources.Resource.ItemSaved);
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