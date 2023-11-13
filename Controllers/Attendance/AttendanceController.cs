using CommonLib.App_GlobalResources;
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

namespace SmartBusinessWeb.Controllers.Attendance
{
	[CustomAuthenticationFilter]
	public class AttendanceController : BaseController
    {
		[HttpGet]
		public JsonResult GetAttendances(string frmdate, string todate, int pageIndex = 1, int sortCol = 0, string sortDirection = "desc", string keyword = "")
		{
			using var connection = new Microsoft.Data.SqlClient.SqlConnection(DefaultConnection);
			connection.Open();
			if (string.IsNullOrEmpty(keyword)) keyword = null;
			//todate = CommonHelper.FormatDate(CommonHelper.GetDateFrmString4SQL(todate).AddDays(-1), DateFormat.YYYYMMDD);
			List<AttendanceModel> attendancelist = connection.Query<AttendanceModel>(@"EXEC dbo.GetAttendances @apId=@apId,@frmdate=@frmdate,@todate=@todate,@keyword=@keyword", new { apId, frmdate, todate, keyword }).ToList();
			int pagesize = int.Parse(ConfigurationManager.AppSettings["AttendancePageSize"]);
			int skip = (pageIndex - 1) * pagesize;
			List<AttendanceModel> pagingAttdList = new List<AttendanceModel>();

			#region Sorting
			switch (sortCol)
			{				
				case 1:
					pagingAttdList = sortDirection.ToLower() == "desc" ? attendancelist.OrderByDescending(x => x.saName).ThenByDescending(x => x.saReceivedDateTime).Skip(skip).Take(pagesize).ToList() : attendancelist.OrderBy(x => x.saName).ThenBy(x => x.saReceivedDateTime).Skip(skip).Take(pagesize).ToList();
					break;				
				default:
				case 0:
					pagingAttdList = sortDirection.ToLower() == "desc" ? attendancelist.OrderByDescending(x => x.saReceivedDateTime).Skip(skip).Take(pagesize).ToList() : attendancelist.OrderBy(x => x.saReceivedDateTime).Skip(skip).Take(pagesize).ToList();
					break;
			}
			#endregion

			return Json(new { pagingAttdList, totalRecord = attendancelist.Count }, JsonRequestBehavior.AllowGet);
		}

		//[HandleError]
		//[CustomAuthorize("reports", "boss", "admin", "superadmin")]
		[HttpPost]
		//[ValidateAntiForgeryToken]
		//[ValidateInput(false)]
		public JsonResult Save(List<AttendanceModel> model, string frmdate, string todate)
		{		
			string msg = string.Format(Resource.Saved, Resource.AttendanceRecords);
			AttendanceEditModel.Save(model, frmdate, todate, apId);
			return Json(new { msg });
		}

		[HandleError]
		[CustomAuthorize("reports", "boss", "admin", "superadmin")]
		public ActionResult Index(string Keyword = "", string strfrmdate = "", string strtodate = "")
        {
			ViewBag.ParentPage = "generalreports";
			ViewBag.PageName = "attendance";
			AttendanceEditModel model = new AttendanceEditModel(strfrmdate, strtodate, Keyword);
			return View(model);
		}
    }
}