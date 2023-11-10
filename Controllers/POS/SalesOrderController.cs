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
        public ActionResult Get(long salesId)
        {
            ViewBag.ParentPage = "sales";
            SalesOrderEditInfo model = new SalesOrderEditInfo();
            model.Get(salesId);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("retail", "boss", "admin", "superadmin")]
        public ActionResult Index(string strfrmdate = "", string strtodate = "", int? PageNo = 1, string SortName = "rtsTime", string SortOrder = "desc", string Keyword = "", int filter = 0, string searchmode = "")
        {
            ViewBag.ParentPage = "sales";
            ViewBag.PageName = "salesorderlist";
            SalesOrderEditModel model = new();
            model.GetRetailOrderList(strfrmdate, strtodate, (int)PageNo, SortName, SortOrder, Keyword, filter, searchmode);
            return View(model);
        }
    }
}