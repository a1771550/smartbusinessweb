using PPWLib.Models.Promotion.Email;
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
            EmailEditModel model = new EmailEditModel();
            model.Get(Id);
            return Json(model.Email, JsonRequestBehavior.AllowGet);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]

        public ActionResult Index(int PageNo = 1, int SortCol = 2, string SortOrder = "desc", string Keyword = null)
        {
            ViewBag.ParentPage = "promotion";
            EmailEditModel model = new() { PageNo = PageNo, SortCol = SortCol, SortOrder = SortOrder == "desc" ? "asc" : "desc", Keyword = Keyword };
            model.GetList(PageNo, SortCol, SortOrder, Keyword);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        public ActionResult Edit(int Id = 0)
        {
            ViewBag.ParentPage = "promotion";
            EmailEditModel model = new();
            model.Get(Id);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpPost]        
        [ValidateAntiForgeryToken]
        public JsonResult Edit(EmailModel Email)
        {
            EmailEditModel.Edit(Email);
            return Json(Resources.Resource.Saved);
        }


        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int Id = 0)
        {
            EmailEditModel.Delete(Id);
            return RedirectToAction("Index");
        }
    }
}