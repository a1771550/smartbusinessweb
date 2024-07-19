using SBLib.Models.Journal;
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
        [CustomAuthorize("reports", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, int SortCol = 5, string SortOrder = "desc", string Keyword = null)
        {
            ViewBag.Title = Resources.Resource.Journal;
            ViewBag.PageName = "journal";
            JournalEditModel model = new JournalEditModel
            {
                CurrentSortOrder = SortOrder,
                Keyword = Keyword,
                SortCol = SortCol,
                PageNo = PageNo,
                SortOrder = SortOrder == "desc" ? "asc" : "desc"
            };
            model.GetList(SortCol, SortOrder, Keyword);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("reports", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(string Id = null)
        {
            ViewBag.PageName = "journal";
            ViewBag.Title = string.IsNullOrEmpty(Id) ? string.Format(Resources.Resource.AddFormat, Resources.Resource.Journal) : string.Format(Resources.Resource.EditFormat, Resources.Resource.Journal);
            JournalEditModel model = new JournalEditModel(Id);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("reports", "admin", "superadmin")]
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
        [CustomAuthorize("reports", "admin", "superadmin")]
        [HttpPost]
        public JsonResult Delete(string Id)
        {
            JournalEditModel.Delete(Id);
            return Json(new { msg = Resources.Resource.Removed });
        }
    }
}