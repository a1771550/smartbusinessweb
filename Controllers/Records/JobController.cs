using CommonLib.App_GlobalResources;
using Dapper;
using PPWLib.Models.Job;
using SmartBusinessWeb.Infrastructure;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SmartBusinessWeb.Controllers.Records
{
	[CustomAuthenticationFilter]
	public class JobController : BaseController
    {
		[HttpGet]
		public JsonResult GetJobs(string frmdate, string todate, int pageIndex = 1, int sortCol = 0, string sortDirection = "desc", string keyword = "")
		{
			using var connection = new Microsoft.Data.SqlClient.SqlConnection(DefaultConnection);
			connection.Open();
			if (string.IsNullOrEmpty(keyword)) keyword = null;
			//todate = CommonHelper.FormatDate(CommonHelper.GetDateFrmString4SQL(todate).AddDays(-1), DateFormat.YYYYMMDD);
			List<JobModel> joblist = connection.Query<JobModel>(@"EXEC dbo.GetJobs @apId=@apId,@frmdate=@frmdate,@todate=@todate,@keyword=@keyword", new { apId, frmdate, todate, keyword }).ToList();
			int pagesize = int.Parse(ConfigurationManager.AppSettings["JobPageSize"]);
			int skip = (pageIndex - 1) * pagesize;
			List<JobModel> pagingJobList = new List<JobModel>();

			#region Sorting
			switch (sortCol)
			{
				case 1:
					pagingJobList = sortDirection.ToLower() == "desc" ? joblist.OrderByDescending(x => x.joTime).ThenByDescending(x => x.joReceivedDateTime).Skip(skip).Take(pagesize).ToList() : joblist.OrderBy(x => x.joTime).ThenBy(x => x.joReceivedDateTime).Skip(skip).Take(pagesize).ToList();
					break;
				case 2:
					pagingJobList = sortDirection.ToLower() == "desc" ? joblist.OrderByDescending(x => x.joWorkingHrs).ThenByDescending(x => x.joReceivedDateTime).Skip(skip).Take(pagesize).ToList() : joblist.OrderBy(x => x.joWorkingHrs).ThenBy(x => x.joReceivedDateTime).Skip(skip).Take(pagesize).ToList();
					break;
				case 3:
					pagingJobList = sortDirection.ToLower() == "desc" ? joblist.OrderByDescending(x => x.joStaffName).ThenByDescending(x => x.joReceivedDateTime).Skip(skip).Take(pagesize).ToList() : joblist.OrderBy(x => x.joStaffName).ThenBy(x => x.joReceivedDateTime).Skip(skip).Take(pagesize).ToList();
					break;
				case 4:
					pagingJobList = sortDirection.ToLower() == "desc" ? joblist.OrderByDescending(x => x.joClient).ThenByDescending(x => x.joReceivedDateTime).Skip(skip).Take(pagesize).ToList() : joblist.OrderBy(x => x.joClient).ThenBy(x => x.joReceivedDateTime).Skip(skip).Take(pagesize).ToList();
					break;			
				default:
				case 0:
					pagingJobList = sortDirection.ToLower() == "desc" ? joblist.OrderByDescending(x => x.joDate).Skip(skip).Take(pagesize).ToList() : joblist.OrderBy(x => x.joDate).Skip(skip).Take(pagesize).ToList();
					break;
			}
			#endregion

			return Json(new { pagingJobList, totalRecord = joblist.Count }, JsonRequestBehavior.AllowGet);
		}

		[HttpPost]
		public JsonResult Save(List<JobModel> model, string frmdate, string todate)
		{
			string msg = string.Format(Resource.Saved, Resource.JobRecords);
			JobEditModel.Save(model, frmdate, todate, apId);
			return Json(new { msg });
		}

		[HandleError]
		[CustomAuthorize("reports", "boss", "admin", "superadmin")]
		public ActionResult Index(string Keyword = "", string strfrmdate = "", string strtodate = "")
		{
			ViewBag.ParentPage = "records";
			ViewBag.PageName = "job";
			JobEditModel model = new JobEditModel(strfrmdate, strtodate, Keyword);
			return View(model);
		}
	}
}