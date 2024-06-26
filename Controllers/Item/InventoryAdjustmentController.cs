using SmartBusinessWeb.Infrastructure;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using PPWLib.Models.Item;

namespace SmartBusinessWeb.Controllers.Item
{
    [CustomAuthenticationFilter]
    public class InventoryAdjustmentController : BaseController
    {
        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Index(int PageNo = 1, int SortCol = 0, string SortOrder = "desc", string Keyword = "")
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "IA";
            if (string.IsNullOrEmpty(Keyword))
                Keyword = null;

            IAEditModel model = new IAEditModel
            {
                SortCol = SortCol,
                SortOrder = (SortOrder == "desc") ? "asc" : "desc",
                CurrentSortOrder = SortOrder,
                Keyword = Keyword,
                PageNo = PageNo
            };

            model.GetList();
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int Id)
        {
            IAEditModel model = new IAEditModel();
            model.Get(Id);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
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