using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SmartBusinessWeb.Controllers
{
	[AllowAnonymous]
	public class DefaultController : Controller
    {	
		
		public ActionResult PrivacyPolicy()
		{
			ViewBag.ParentPage = "default";
			ViewBag.PageName = "privacypolicy";
			return View();
		}
	}
}