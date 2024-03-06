using CommonLib.App_GlobalResources;
using CommonLib.Helpers;
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
		public JsonResult GetJobs(int pageIndex = 1, int sortCol = 0, string sortDirection = "desc", string keyword = "")
		{
			using var connection = new Microsoft.Data.SqlClient.SqlConnection(DefaultConnection);
			connection.Open();
			if (string.IsNullOrEmpty(keyword)) keyword = null;

            int pageSize = int.Parse(ConfigurationManager.AppSettings["JobPageSize"]);
            int startIndex = CommonHelper.GetStartIndex(pageIndex, pageSize);

            List<JobModel> pagingJobList = connection.Query<JobModel>(@"EXEC dbo.GetJobs @apId=@apId,@sortCol=@sortCol,@sortOrder=@sortOrder,@startIndex=@startIndex,@pageSize=@pageSize,@keyword=@keyword", new { apId, sortCol, sortOrder = sortDirection, startIndex, pageSize, keyword }).ToList();			

			return Json(new { pagingJobList }, JsonRequestBehavior.AllowGet);
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