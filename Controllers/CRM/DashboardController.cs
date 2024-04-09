using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using PCDAL;
using PCLib.Models;
using POSLiteG3.Infrastructure;
using System.Configuration;
using POSLiteG3.Models;

namespace POSLiteG3.Controllers.CRM
{
    [CustomAuthenticationFilter]
    public class DashboardController : BaseController
    {
        [HandleError]
        [CustomAuthorize("crm", "admin", "superadmin")]
        public ActionResult Index()
        {             
            Session["AccessMode"] = "crm";
            ViewBag.PageName = "dashboard";
            DashboardModel model = new DashboardModel();
            return View(model);
        }

        [AllowAnonymous]
        public JsonResult Charts()
        {
            DashboardModel model = new();
            return Json(new { CallHistoryStat = model.GetCallHistoryStat() }, JsonRequestBehavior.AllowGet);
        }
    }
}