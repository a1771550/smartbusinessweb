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

namespace SmartBusinessWeb.Controllers.POS
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
        [CustomAuthorize("retail", "boss", "admin", "superadmin")]
        public ActionResult Index(string strfrmdate = "", string strtodate = "", int? PageNo = 1, string SortName = "rtsTime", string SortOrder = "desc", string Shop = "", string Device = "", string Keyword = "", int filter = 0, string searchmode = "")
        {
            ViewBag.ParentPage = "sales";
            ViewBag.PageName = "salesorderlist";
			SalesOrderEditInfo model = new();
			model.GetList(strfrmdate, strtodate, (int)PageNo, SortName, SortOrder, Shop, Device, Keyword, filter, searchmode);
			return View(model);
        }
    }
}