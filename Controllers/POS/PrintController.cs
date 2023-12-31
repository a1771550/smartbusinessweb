﻿using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using PPWLib.Models;
using PPWDAL;
using System.Configuration;
using Helpers = PPWLib.Helpers;
using Dapper;

namespace SmartBusinessWeb.Controllers
{
    public class PrintController : BaseController
    {
		[AllowAnonymous]
		public ActionResult Index(int issales, string salesrefundcode)
		{
			TempData["issales"] = issales == 1;
			ViewBag.Title = issales == 1 ? Resources.Resource.Sales : Resources.Resource.Refunds;
            //GetSalesInfo4Print          
            using var connection = new Microsoft.Data.SqlClient.SqlConnection(DefaultConnection);
            connection.Open();
            SalesModel model = connection.QueryFirstOrDefault<SalesModel>(@"EXEC dbo.GetSalesInfo4Print @apId=@apId,@salesrefundcode=@salesrefundcode", new { apId,salesrefundcode });
			return View(model);
		}

		[HttpGet]
		public ActionResult GetPrintHtml(int issales,string salesrefundcode)
		{			
			bool _issales = issales == 1;
			//SessUser user = (SessUser)Session["User"];
			PrintModel model = new PrintModel(_issales,salesrefundcode, ComInfo.Currency);
			return Json(new { html = Helpers.PrintHelper.GetPrintHtml(model) }, JsonRequestBehavior.AllowGet);
		}
	}
}