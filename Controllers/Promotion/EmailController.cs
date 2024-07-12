using PPWLib.Models.Promotion;
using SmartBusinessWeb.Infrastructure;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Promotion
{
    [CustomAuthenticationFilter]
    public class EmailController : BaseController
    {
        [HttpGet]
        public JsonResult Get(int Id)
        {
            PromotionalEmailEditModel model = new();
            model.Get(Id);
            return Json(model.Email, JsonRequestBehavior.AllowGet);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]

        public ActionResult Index(int PageNo = 1, int SortCol = 2, string SortOrder = "desc", string Keyword = null)
        {
            ViewBag.ParentPage = "promotion";
            PromotionalEmailEditModel model = new() { PageNo = PageNo, SortCol = SortCol, SortOrder = SortOrder == "desc" ? "asc" : "desc", Keyword = Keyword };
            model.GetList(PageNo, SortCol, SortOrder, Keyword);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        public ActionResult Edit(int Id = 0)
        {
            ViewBag.ParentPage = "promotion";
            PromotionalEmailEditModel model = new();
            model.Get(Id);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpPost]        
        [ValidateAntiForgeryToken]
        public JsonResult Edit(PromotionalEmailModel Email)
        {
            PromotionalEmailEditModel.Edit(Email);
            return Json(Resources.Resource.Saved);
        }


        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int Id = 0)
        {
            PromotionalEmailEditModel.Delete(Id);
            return RedirectToAction("Index");
        }
    }
}