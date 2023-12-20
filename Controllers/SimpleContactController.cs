using PPWLib.Models.Contact;
using System.Web.Mvc;
using Resource = CommonLib.App_GlobalResources.Resource;

namespace SmartBusinessWeb.Controllers
{
	[AllowAnonymous]
	public class SimpleContactController : Controller
	{		
		[HttpGet]
		public ActionResult Edit()
		{
			ViewBag.ParentPage = "contact";
			ViewBag.PageName = "edit";
			SimpleContactEditModel model = new SimpleContactEditModel();
			return View(model.Contact);
		}

		[HttpPost]
		[ValidateAntiForgeryToken]
		public JsonResult Edit(SimpleContactModel model)
		{
			SimpleContactEditModel.Edit(model);
			return Json(new { msg = string.Format(Resource.SavedFormat, Resource.Message) });
		}
	}
}