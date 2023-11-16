using SmartBusinessWeb.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SmartBusinessWeb.Controllers.Records
{
	[CustomAuthenticationFilter]
	public class JournalController : BaseController
    {
		[HandleError]
		[CustomAuthorize("reports", "boss", "admin", "superadmin")]
		public ActionResult Index()
        {
            return View();
        }
    }
}