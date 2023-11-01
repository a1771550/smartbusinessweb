using DocumentFormat.OpenXml.EMMA;
using KingdeeLib.Models.Sales;
using PagedList;
using SmartBusinessWeb.Infrastructure;
using PPWDAL;
using PPWLib.Helpers;
using PPWLib.Models;
using PPWLib.Models.POS.Customer;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using ActionLogModel = PPWLib.Models.ActionLogModel;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Customer
{
    [CustomAuthenticationFilter]
    public class PGCustomerController : BaseController
    {
        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        // GET: PGCustomer
        public ActionResult Index(int SortCol = 3, string SortOrder = "desc", string Keyword = "", int? PageNo = 1)
        {
            ViewBag.ParentPage = "customer";
            ViewBag.PageName = "pgcustomer";
            if (string.IsNullOrEmpty(Keyword))
                Keyword = null;
            CustomerEditModel model = new CustomerEditModel
            {
                CurrentSortOrder = SortOrder,
                Keyword = Keyword,
            };

            List<PGCustomerModel> customerlist = new List<PGCustomerModel>();

            List<SalesCustomerModel> kcustomerlist = new List<SalesCustomerModel>();

            List<ActionLogModel> actionloglist = new List<ActionLogModel>();
            List<int> cusIdList = new List<int>();
            var apId = ComInfo.AccountProfileId;

            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                if (CheckoutPortal.ToLower() == "kingdee")
                {
                    kcustomerlist = SalesCustomerEditModel.GetList(context, -1, PageSize, Keyword).OrderByDescending(x => x.CreateTime).ToList();
                    model.IdList = kcustomerlist.Select(x => x.Id).ToList();
                }
                else
                {
                    customerlist = ModelHelper.GetPGCustomersList(context, Keyword).OrderByDescending(x => x.CreateTime).ToList();
                    model.IdList = customerlist.Select(x => (long)x.cusCustomerID).ToList();
                }
            }

            model.SortCol = SortCol;

            int Size_Of_Page = PageSize;
            int No_Of_Page = PageNo ?? 1;
            var sortColumnIndex = SortCol;
            var sortDirection = SortOrder;

            if (CheckoutPortal.ToLower() == "kingdee")
            {
                if (sortColumnIndex == 0)
                {
                    kcustomerlist = sortDirection == "asc" ? kcustomerlist.OrderBy(c => c.CustName).ToList() : kcustomerlist.OrderByDescending(c => c.CustName).ToList();
                }
                else if (sortColumnIndex == 1)
                {
                    kcustomerlist = sortDirection == "asc" ? kcustomerlist.OrderBy(c => c.CustEmail).ToList() : kcustomerlist.OrderByDescending(c => c.CustEmail).ToList();
                }
            }
            else
            {
                if (sortColumnIndex == 0)
                {
                    customerlist = sortDirection == "asc" ? customerlist.OrderBy(c => c.cusName).ToList() : customerlist.OrderByDescending(c => c.cusName).ToList();
                }
                else if (sortColumnIndex == 1)
                {
                    customerlist = sortDirection == "asc" ? customerlist.OrderBy(c => c.cusContact).ToList() : customerlist.OrderByDescending(c => c.cusContact).ToList();
                }
                else if (sortColumnIndex == 2)
                {
                    customerlist = sortDirection == "asc" ? customerlist.OrderBy(c => c.cusEmail).ToList() : customerlist.OrderByDescending(c => c.cusEmail).ToList();
                }
                else if (sortColumnIndex == 3)
                {
                    customerlist = sortDirection == "asc" ? customerlist.OrderBy(c => c.CreateTime).ToList() : customerlist.OrderByDescending(c => c.CreateTime).ToList();
                }
            }


            if (SortOrder == "desc")
            {
                model.SortOrder = "asc";
            }
            else
            {
                model.SortOrder = "desc";
            }

            if (NonABSS)
            {
                model.PGCustomerList = customerlist.ToPagedList(No_Of_Page, Size_Of_Page);
            }
            else
            {
                if (CheckoutPortal.ToLower() == "kingdee")
                {
                    model.KCustomerList = kcustomerlist.ToPagedList(No_Of_Page, Size_Of_Page);
                }
                else
                {
                    model.PGCustomerList = customerlist.ToPagedList(No_Of_Page, Size_Of_Page);
                }
            }

            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int customerId = 0)
        {
            ViewBag.ParentPage = "customer";
            ViewBag.PageName = "edit";
            //var region = CommonLib.Helpers.CultureHelper.GetCountryByIP();
            //model.IpCountry = "香港";
            var comInfo = Session["ComInfo"] as ComInfo;

            CustomerEditModel cmodel = new CustomerEditModel(customerId,"", true);
            var model = cmodel.PGCustomer;
            //don't move the code below to the construction of CustomerModel!!!                
            //model.IpCountry = region.EnglishName;
            model.IpCountry = "香港";
            model.enableCRM = (bool)comInfo.enableCRM;
            return View("Edit", model);

        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(PGCustomerModel model)
        {
            ViewBag.ParentPage = ViewBag.PageName = "customer";
            CustomerEditModel cmodel = new CustomerEditModel();
            if (model.cusCustomerID == 0)
            {
                cmodel.AddPG(model);
            }
            else
            {
                cmodel.EditPG(model);
            }
            string msg = Resources.Resource.CustomerSaved;
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int customerId, int accountProfileId)
        {
            ViewBag.ParentPage = ViewBag.PageName = "customer";
            CustomerEditModel.Delete(customerId, accountProfileId);
            return Json(new { });
        }
    }
}