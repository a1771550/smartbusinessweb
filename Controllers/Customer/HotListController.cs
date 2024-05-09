using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using PagedList;
using Resources = CommonLib.App_GlobalResources;
using System.Configuration;
using SmartBusinessWeb.Infrastructure;
using PPWLib.Models;
using PPWLib.Models.Customer;

namespace SmartBusinessWeb.Controllers.Customer
{
    [CustomAuthenticationFilter]
    public class HotListController : BaseController
    {
        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public JsonResult AddCustomers(List<string> cusCodes, List<int> IdList)
        {
            var msg = string.Format(Resources.Resource.AddTo, Resources.Resource.HotList);
            msg = string.Concat(msg, "<br>", string.Format(Resources.Resource.WillFormat, Resources.Resource.Email, String.Format(Resources.Resource.SentToFormat, string.Format(Resources.Resource.InChargeFormat, Resources.Resource.SalesPerson))));
            HotListEditModel model = new HotListEditModel();
            model.AddCustomers(cusCodes, IdList);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public JsonResult Edit(HotListModel model)
        {
            var msg = string.Format(Resources.Resource.Saved, Resources.Resource.Attribute);
            HotListEditModel.Save(model);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        public ActionResult Edit(int Id = 0)
        {
            ViewBag.ParentPage = "customer";
            HotListEditModel model = new HotListEditModel();            
            model.Get(Id);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, int SortCol = 0, string SortOrder = "desc", string Keyword = "")
        {
            ViewBag.ParentPage = "customer";
            int Size_Of_Page = int.Parse(ConfigurationManager.AppSettings["PageLength"]);
            var sortColumnIndex = SortCol;
            var sortDirection = SortOrder;
            HotListEditModel model = new HotListEditModel(PageNo, SortCol, SortOrder, Keyword)
            {
                CurrentSortOrder = SortOrder,
                Keyword = Keyword,
                SortCol = SortCol
            };

            model.IdList = model.HotLists.Select(x => x.Id).ToList();
            model.SortOrder = SortOrder == "desc" ? "asc" : "desc";
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult Delete(long Id)
        {
            HotListEditModel.Delete(Id);
            return RedirectToAction("Index");
        }
    }
}