using PPWLib.Models.Journal;
using SmartBusinessWeb.Infrastructure;
using System.Collections.Generic;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Records
{
	[CustomAuthenticationFilter]
	public class JournalController : BaseController
    {
		[HandleError]
		[CustomAuthorize("reports", "boss", "admin", "superadmin")]
		public ActionResult Index(int sortCol = 5, string SortOrder = "desc", string Keyword = null, int? PageNo = 1)
		{
			ViewBag.Title = Resources.Resource.Journal;
			//ViewBag.ParentPage = "reports";
			ViewBag.PageName = "journal";
			JournalEditModel model = new JournalEditModel
			{
				CurrentSortOrder = SortOrder,
				Keyword = Keyword,
				SortCol = sortCol,
			};
			model.GetList(sortCol, SortOrder, Keyword);
			model.PageNo = PageNo ?? 1;
			model.SortOrder = SortOrder == "desc" ? "asc" : "desc";			
			return View(model);
		}

		[HandleError]
		[CustomAuthorize("reports", "boss", "admin", "superadmin")]
		[HttpGet]
		public ActionResult Edit(string Id = "")
		{
			//ViewBag.ParentPage = "reports";
			ViewBag.PageName = "journal";
			ViewBag.Title = string.IsNullOrEmpty(Id) ? string.Format(Resources.Resource.AddFormat, Resources.Resource.Journal) : string.Format(Resources.Resource.EditFormat, Resources.Resource.Journal);
			JournalEditModel model = new JournalEditModel(Id);
			return View(model);
		}

		[HandleError]
		[CustomAuthorize("reports", "boss", "admin", "superadmin")]
		[HttpPost]
		public ActionResult Edit(JournalModel model, List<JournalLnView> JournalLns)
		{
			ViewBag.ParentPage = "reports";
			ViewBag.PageName = "journal";
			
			JournalEditModel emodel = new JournalEditModel();
			emodel.Edit(model, JournalLns);
			return Json("");
		}

		[HandleError]
		[CustomAuthorize("reports", "boss", "admin", "superadmin")]
		[HttpPost]
		public JsonResult Delete(string Id)
		{
			JournalEditModel.Delete(Id);
			return Json(new { msg = Resources.Resource.Removed });
		}
	}
}