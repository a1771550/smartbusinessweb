using PagedList;
using SmartBusinessWeb.Infrastructure;
using PPWLib.Models.Item;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Item
{
    public class CategoryController : BaseController
    {
        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public JsonResult SaveDisplayOrder(CategoryModel Category)
        {
            CategoryEditModel.SaveDisplayOrder(Category);
            return Json(Resources.Resource.Saved);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult Index(int SortCol = 3, string SortOrder = "asc", string Keyword = null, int? PageNo = 1)
        {
            ViewBag.Title = Resources.Resource.Category;
            ViewBag.PageName = "category";
            ViewBag.ParentPage = "item";
            CategoryEditModel model = new CategoryEditModel
            {
                CurrentSortOrder = SortOrder,
                Keyword = Keyword,
                SortCol = SortCol,
                SortOrder = SortOrder == "desc" ? "asc" : "desc"
            };
            model.GetList(SortCol, SortOrder, Keyword, true);
            int No_Of_Page = PageNo ?? 1;        
            model.PagingCategoryList = model.Categories.ToPagedList(No_Of_Page, PageSize);
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
            CategoryEditModel emodel = new CategoryEditModel(Id);          
            return View(emodel);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        public ActionResult Edit(CategoryModel model)
        {
            ViewBag.PageName = "category";
            ViewBag.ParentPage = "item";
            CategoryEditModel emodel = new CategoryEditModel();
            emodel.Edit(model);
            return Json("");
            //return RedirectToAction("Index");
        }

		[HandleError]
		[CustomAuthorize("item", "boss", "admin", "superadmin")]
		[HttpPost]
        public JsonResult Delete(int Id)
        {
            CategoryEditModel.Delete(Id);
            return Json(new {msg=Resources.Resource.Removed});
        }
	}
}