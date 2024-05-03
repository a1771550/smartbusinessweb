using CommonLib.App_GlobalResources;
using CommonLib.Helpers;
using Dapper;
using PPWLib.Models;
using PPWLib.Models.Attendance;
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
	public class AttendanceController : BaseController
    {
		[HttpGet]
		public JsonResult GetAttendances(int pageIndex = 1, int sortCol = 0, string sortDirection = "desc", string keyword = "")
		{
			using var connection = new Microsoft.Data.SqlClient.SqlConnection(DefaultConnection);
			connection.Open();
			if (string.IsNullOrEmpty(keyword)) keyword = null;

            int pageSize = int.Parse(ConfigurationManager.AppSettings["MGTPageSize"]);
            int startIndex = CommonHelper.GetStartIndex(pageIndex, pageSize);

            List<AttendanceModel> pagingAttdList = connection.Query<AttendanceModel>(@"EXEC dbo.GetAttendances @apId=@apId,@sortCol=@sortCol,@sortOrder=@sortOrder,@startIndex=@startIndex,@pageSize=@pageSize,@keyword=@keyword", new { apId, sortCol, sortOrder = sortDirection, startIndex, pageSize, keyword }).ToList();

			return Json(new { pagingAttdList }, JsonRequestBehavior.AllowGet);
		}
		
		[HttpPost]
		public JsonResult Save(List<AttendanceModel> model, string frmdate, string todate)
		{		
			string msg = string.Format(Resource.Saved, Resource.AttendanceRecords);
			AttendanceEditModel.Save(model, frmdate, todate, apId);
			return Json(new { msg });
		}

		[HandleError]
		[CustomAuthorize("reports", "boss", "admin", "superadmin")]
		public ActionResult Index()
        {
			ViewBag.ParentPage = "records";
			ViewBag.PageName = "attendance";
			AttendanceEditModel model = new AttendanceEditModel();
            return View(model);
		}
    }
}