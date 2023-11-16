using CommonLib.App_GlobalResources;
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
		public JsonResult GetTrainings(string frmdate, string todate, int pageIndex = 1, int sortCol = 0, string sortDirection = "desc", string keyword = "")
		{
			using var connection = new Microsoft.Data.SqlClient.SqlConnection(DefaultConnection);
			connection.Open();
			if (string.IsNullOrEmpty(keyword)) keyword = null;
			//todate = CommonHelper.FormatDate(CommonHelper.GetDateFrmString4SQL(todate).AddDays(-1), DateFormat.YYYYMMDD);
			List<TrainingModel> traininglist = connection.Query<TrainingModel>(@"EXEC dbo.GetTrainings @apId=@apId,@frmdate=@frmdate,@todate=@todate,@keyword=@keyword", new { apId, frmdate, todate, keyword }).ToList();
			int pagesize = int.Parse(ConfigurationManager.AppSettings["TrainingPageSize"]);
			int skip = (pageIndex - 1) * pagesize;
			List<TrainingModel> pagingTrainingList = new List<TrainingModel>();

			#region Sorting
			switch (sortCol)
			{
				case 2:
					pagingTrainingList = sortDirection.ToLower() == "desc" ? traininglist.OrderByDescending(x => x.trApplicant).ThenByDescending(x => x.trDate).Skip(skip).Take(pagesize).ToList() : traininglist.OrderBy(x => x.trApplicant).ThenBy(x => x.trDate).Skip(skip).Take(pagesize).ToList();
					break;
				case 1:
					pagingTrainingList = sortDirection.ToLower() == "desc" ? traininglist.OrderByDescending(x => x.trCompany).ThenByDescending(x => x.trDate).Skip(skip).Take(pagesize).ToList() : traininglist.OrderBy(x => x.trCompany).ThenBy(x => x.trDate).Skip(skip).Take(pagesize).ToList();
					break;
				case 3:
					pagingTrainingList = sortDirection.ToLower() == "desc" ? traininglist.OrderByDescending(x => x.trEmail).ThenByDescending(x => x.trDate).Skip(skip).Take(pagesize).ToList() : traininglist.OrderBy(x => x.trEmail).ThenBy(x => x.trDate).Skip(skip).Take(pagesize).ToList();
					break;
				case 4:
					pagingTrainingList = sortDirection.ToLower() == "desc" ? traininglist.OrderByDescending(x => x.trIndustry).ThenByDescending(x => x.trDate).Skip(skip).Take(pagesize).ToList() : traininglist.OrderBy(x => x.trIndustry).ThenBy(x => x.trDate).Skip(skip).Take(pagesize).ToList();
					break;
				case 5:
					pagingTrainingList = sortDirection.ToLower() == "desc" ? traininglist.OrderByDescending(x => x.trAttendance).ThenByDescending(x => x.trDate).Skip(skip).Take(pagesize).ToList() : traininglist.OrderBy(x => x.trAttendance).ThenBy(x => x.trDate).Skip(skip).Take(pagesize).ToList();
					break;
				case 6:
					pagingTrainingList = sortDirection.ToLower() == "desc" ? traininglist.OrderByDescending(x => x.trIsApproved).ThenByDescending(x => x.trDate).Skip(skip).Take(pagesize).ToList() : traininglist.OrderBy(x => x.trIsApproved).ThenBy(x => x.trDate).Skip(skip).Take(pagesize).ToList();
					break;
				default:
				case 0:
					pagingTrainingList = sortDirection.ToLower() == "desc" ? traininglist.OrderByDescending(x => x.trDate).Skip(skip).Take(pagesize).ToList() : traininglist.OrderBy(x => x.trDate).Skip(skip).Take(pagesize).ToList();
					break;
			}
			#endregion

			return Json(new { pagingTrainingList, totalRecord = traininglist.Count }, JsonRequestBehavior.AllowGet);
		}

		[HttpPost]
		public JsonResult Save(List<TrainingModel> model, string frmdate, string todate)
		{
			string msg = string.Format(Resource.Saved, Resource.TrainingRecords);
			TrainingEditModel.Save(model, frmdate, todate, apId);
			return Json(new { msg });
		}

		[HandleError]
		[CustomAuthorize("reports", "boss", "admin", "superadmin")]
		public ActionResult Index(string Keyword = "", string strfrmdate = "", string strtodate = "")
		{
			ViewBag.ParentPage = "records";
			ViewBag.PageName = "training";
			TrainingEditModel model = new TrainingEditModel(strfrmdate, strtodate, Keyword);
			return View(model);
		}
	}
}