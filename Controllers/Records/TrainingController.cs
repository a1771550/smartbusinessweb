using CommonLib.App_GlobalResources;
using CommonLib.Helpers;
using Dapper;
using PPWLib.Models.Training;
using SmartBusinessWeb.Infrastructure;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web.Mvc;

namespace SmartBusinessWeb.Controllers.Records
{
	[CustomAuthenticationFilter]
	public class TrainingController : BaseController
    {
		[HttpGet]
		public JsonResult GetTrainings(int pageIndex = 1, int sortCol = 0, string sortDirection = "desc", string keyword = "")
		{
			using var connection = new Microsoft.Data.SqlClient.SqlConnection(DefaultConnection);
			connection.Open();
			if (string.IsNullOrEmpty(keyword)) keyword = null;

            int pageSize = int.Parse(ConfigurationManager.AppSettings["MGTPageSize"]);
            int startIndex = CommonHelper.GetStartIndex(pageIndex, pageSize);

            List<TrainingModel> pagingTrainingList = connection.Query<TrainingModel>(@"EXEC dbo.GetTrainings @apId=@apId,@sortCol=@sortCol,@sortOrder=@sortOrder,@startIndex=@startIndex,@pageSize=@pageSize,@keyword=@keyword", new { apId, sortCol, sortOrder = sortDirection, startIndex, pageSize, keyword }).ToList();
			return Json(new { pagingTrainingList }, JsonRequestBehavior.AllowGet);
		}

		[HttpPost]
		public JsonResult Save(List<TrainingModel> model)
		{
			string msg = string.Format(Resource.Saved, Resource.TrainingRecords);
			TrainingEditModel.Save(model);
			return Json(new { msg });
		}

		[HandleError]
		[CustomAuthorize("reports", "admin", "superadmin")]
		public ActionResult Index(string Keyword = "", string strfrmdate = "", string strtodate = "")
		{
			ViewBag.ParentPage = "records";
			ViewBag.PageName = "training";
			TrainingEditModel model = new TrainingEditModel(strfrmdate, strtodate, Keyword);
			return View(model);
		}
	}
}