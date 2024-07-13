using DAL;
using SmartBusinessWeb.Infrastructure;
using System.Collections.Generic;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using SBLib.Models.Item;

namespace SmartBusinessWeb.Controllers.Item
{
    [CustomAuthenticationFilter]
    public class ItemController : BaseController
    {
        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
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
        [CustomAuthorize("stock", "admin", "superadmin")]
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
        [CustomAuthorize("item", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(string referrer, string itemCode=null)
        {
            ViewBag.ParentPage = ViewBag.PageName = "item";
            ItemEditModel model = new ItemEditModel();
            model.Get(itemCode);
            model.Referrer = referrer;
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
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
        [CustomAuthorize("item", "admin", "superadmin")]
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
        [CustomAuthorize("item", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(string itemCode)
        {
            ViewBag.ParentPage = "item";
            string msg = ItemEditModel.Delete(itemCode);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Detail(string itemCode)
        {
            ItemEditModel model = new ItemEditModel(itemCode, true);
            return Json(model.Item, JsonRequestBehavior.AllowGet);
        }
    }
}