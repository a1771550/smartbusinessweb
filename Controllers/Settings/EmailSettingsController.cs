using SBLib.Models;
using SmartBusinessWeb.Infrastructure;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using DAL;

namespace SmartBusinessWeb.Controllers.Settings
{
    [CustomAuthenticationFilter]

    [HandleError]
    [CustomAuthorize("emailsettings", "admin", "superadmin")]
    public class EmailSettingsController : BaseController
    {
        public ActionResult Index()
        {
            ViewBag.ParentPage = "setup";
            ViewBag.PageName = "emailsettings";
            EmailSettingsEditModel model = new EmailSettingsEditModel();
            EmailSettingsModel emailModel = model.Get();         
            emailModel.enableCRM = (bool)ComInfo.enableCRM;
            return View(emailModel);
        }

        [HandleError]
        [CustomAuthorize("emailsettings", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(EmailSettingsModel emailsettings)
        {            
            EmailSettingsEditModel model = new EmailSettingsEditModel();
            model.Edit(emailsettings);
            string msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.EmailSettings);            
            return Json(new { msg });
        }


        [HandleError]
        [CustomAuthorize("emailsettings", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Detail()
        {
            EmailSettingsEditModel emodel = new EmailSettingsEditModel();
            EmailSettingsModel model = emodel.Get();
            return Json(model, JsonRequestBehavior.AllowGet);
        }
    }
}