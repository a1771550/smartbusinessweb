using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PPWLib.Models;
using PPWDAL;
using PagedList;
using Resources = CommonLib.App_GlobalResources;
using PPWLib.Helpers;
using System.Configuration;
using SmartBusinessWeb.Infrastructure;

namespace SmartBusinessWeb.Controllers
{
    [CustomAuthenticationFilter]
    public class HotListController : BaseController
    {
        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public JsonResult AddContacts(List<int> contactIds, long hotlistId)
        {
            var msg = string.Format(Resources.Resource.Saved, string.Format(Resources.Resource.AddTo,Resources.Resource.HotList));
            msg = string.Concat(msg,"<br>",String.Format(Resources.Resource.WillFormat,Resources.Resource.Email,String.Format(Resources.Resource.SentToFormat,string.Format(Resources.Resource.InChargeFormat, Resources.Resource.SalesPerson))));
            HotListEditModel.AddContacts(contactIds, hotlistId);
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
        public ActionResult Edit(long Id = 0)
        {
            ViewBag.ParentPage = "contact";
            ViewBag.PageName = "hotlist";
            HotListModel model = new HotListModel();            
            if (Id > 0)
            {
                model = HotListEditModel.Get(Id);
            }
            model.SalesmanList = HotListEditModel.GetSalesmanList();
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        public ActionResult Index(int SortCol = 0, string SortOrder = "desc", string Keyword = "",string strfrmdate = "",string strtodate = "", int? PageNo = 1)
        {
            ViewBag.ParentPage = "contact";
            ViewBag.PageName = "hotlist";
            int Size_Of_Page = int.Parse(ConfigurationManager.AppSettings["PageLength"]);
            int No_Of_Page = (PageNo ?? 1);
            var sortColumnIndex = SortCol;
            var sortDirection = SortOrder;
            HotListEditModel model = new HotListEditModel(strfrmdate,strtodate, Keyword);
            model.CurrentSortOrder = SortOrder;
            model.Keyword = Keyword;
            model.SortCol = SortCol;
           
            var hotlist = model.HotListList;
            model.IdList = hotlist.Select(x => x.Id).ToList();
          
            if (SortOrder == "desc")
            {
                model.SortOrder = "asc";
            }
            else
            {
                model.SortOrder = "desc";
            }
            model.PagingHotListList = hotlist.ToPagedList(No_Of_Page, Size_Of_Page);
            model.Keyword = Keyword;
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