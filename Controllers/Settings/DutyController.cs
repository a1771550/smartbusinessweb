using PPWLib.Models.Settings.Duty;
using SmartBusinessWeb.Infrastructure;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Settings
{
    [CustomAuthenticationFilter]
    public class DutyController : BaseController
    {
        [HandleError]
        [CustomAuthorize("othersettings", "boss", "admin", "superadmin")]

        public ActionResult Index(int PageNo = 1, int SortCol = 0, string SortOrder = "desc", string Keyword = null)
        {
            DutyEditModel model = new DutyEditModel { PageNo = PageNo, SortCol = SortCol, SortOrder = SortOrder == "desc" ? "asc" : "desc", Keyword = Keyword };
            model.GetList(PageNo, SortCol, SortOrder, Keyword);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("othersettings", "boss", "admin", "superadmin")]
        public ActionResult Edit(long? Id)
        {
            DutyEditModel model = new DutyEditModel();
            model.Get(Id);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("othersettings", "boss", "admin", "superadmin")]
        [HttpPost]
        public JsonResult Edit(DutyModel Duty)
        {
            DutyEditModel.Edit(Duty);
            return Json(Resources.Resource.Saved);
        }

        [HandleError]
        [CustomAuthorize("othersettings", "boss", "admin", "superadmin")]
        public ActionResult Delete(long Id)
        {
            DutyEditModel.Delete(Id);
            return RedirectToAction("Index");
        }
    }
}