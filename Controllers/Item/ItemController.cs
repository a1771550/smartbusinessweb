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
        public ActionResult Index(int PageNo = 1, string SortName = "code", string SortOrder = "asc", string Keyword = null)
        {
            ViewBag.ParentPage = "Item";           
         
            ItemEditModel model = new()
            {
				SortName = SortName,
				SortOrder = (SortOrder == "desc") ? "asc" : "desc",
				CurrentSortOrder = SortOrder,
				Keyword = Keyword,
			};

            model.GetList(PageNo, (int)ComInfo.PageLength, SortName, SortOrder, Keyword);
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
        public ActionResult Stock(int PageNo = 1, string SortName = "code", string SortOrder = "asc", string Keyword = null)
        {
            ViewBag.ParentPage = "item";           
            StockEditModel model = new()
            {
                PageNo = PageNo,
                SortName = SortName,
                SortOrder = (SortOrder == "desc") ? "asc" : "desc",
                Keyword = Keyword,
            };
            model.GetList(PageNo, SortName, SortOrder, Keyword);
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