using CommonLib.Models;
using PPWDAL;
using PPWLib.Models.POS.Sales;
using PPWLib.Models.Purchase;
using SmartBusinessWeb.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SmartBusinessWeb.Controllers.Sales
{
    [CustomAuthenticationFilter]
    [SessionExpire]
    public class SalesOrderController : BaseController
    {
        [HttpGet]
        public ActionResult Get(long Id)
        {
            ViewBag.ParentPage = "sales";
            SalesOrderEditInfo model = new SalesOrderEditInfo();
            model.Get(Id);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("retail", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, int SortCol = 5, string SortOrder = "desc", string Shop = "", string Device = "", string Keyword = "", int filter = 0, string searchmode = "")
        {
            ViewBag.ParentPage = "sales";
            ViewBag.PageName = "salesorderlist";
			SalesOrderEditInfo model = new();
			model.GetList(PageNo, SortCol, SortOrder, Shop, Device, Keyword, filter, searchmode);
			return View(model);
        }
    }
}