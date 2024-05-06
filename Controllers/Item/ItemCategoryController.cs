using PagedList;
using SmartBusinessWeb.Infrastructure;
using PPWLib.Models.Item;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Item
{
    public class ItemCategoryController : BaseController
    {
        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult Index(int SortCol = 2, string SortOrder = "desc", string Keyword = null, int? PageNo = 1)
        {
            ViewBag.Title = Resources.Resource.Category;
            ViewBag.PageName = "category";
            ViewBag.ParentPage = "item";
            ItemCategoryEditModel model = new ItemCategoryEditModel
            {
                CurrentSortOrder = SortOrder,
                Keyword = Keyword,
                SortCol = SortCol,
            };
            model.GetList(SortCol, SortOrder, Keyword);
            int No_Of_Page = PageNo ?? 1;
            model.SortOrder = SortOrder == "desc" ? "asc" : "desc";
            model.PagingCategoryList = model.ItemCategories.ToPagedList(No_Of_Page, PageSize);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int Id = 0)
        {
            ViewBag.PageName = "category";
            ViewBag.ParentPage = "item";
            ViewBag.Title = Id==0?string.Format(Resources.Resource.AddFormat,Resources.Resource.Category): string.Format(Resources.Resource.EditFormat,Resources.Resource.Category);
            ItemCategoryEditModel emodel = new ItemCategoryEditModel(Id);
            var model = emodel.ItemCategory;
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        public ActionResult Edit(ItemCategoryModel model)
        {
            ViewBag.PageName = "category";
            ViewBag.ParentPage = "item";
            ItemCategoryEditModel emodel = new ItemCategoryEditModel();
            emodel.Edit(model);
            return Json("");
            //return RedirectToAction("Index");
        }

		[HandleError]
		[CustomAuthorize("item", "boss", "admin", "superadmin")]
		[HttpPost]
        public JsonResult Delete(int Id)
        {
            ItemCategoryEditModel.Delete(Id);
            return Json(new {msg=Resources.Resource.Removed});
        }
	}
}