using PPWLib.Models;
using SmartBusinessWeb.Infrastructure;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using PPWDAL;

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
            EmailEditModel model = new EmailEditModel();
            EmailModel emailModel = model.Get();         
            emailModel.enableCRM = (bool)ComInfo.enableCRM;
            return View(emailModel);
        }

        [HandleError]
        [CustomAuthorize("emailsettings", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(EmailModel emailsettings)
        {            
            EmailEditModel model = new EmailEditModel();
            model.Edit(emailsettings);
            string msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.EmailSettings);            
            return Json(new { msg });
        }


        [HandleError]
        [CustomAuthorize("emailsettings", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Detail()
        {
            EmailEditModel emodel = new EmailEditModel();
            EmailModel model = emodel.Get();
            return Json(model, JsonRequestBehavior.AllowGet);
        }
    }
}