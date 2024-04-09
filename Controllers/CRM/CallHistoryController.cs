using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SmartBusinessWeb.Models;
using PPWDAL;
using PagedList;
using Resources = CommonLib.App_GlobalResources;
using SmartBusinessWeb.Helpers;
using System.Configuration;
using PPWLib.Models;
using SmartBusinessWeb.Infrastructure;
using PPWLib.Models.CRM;

namespace SmartBusinessWeb.Controllers
{
    [CustomAuthenticationFilter]
    public class CallHistoryController : BaseController
    {
        [HandleError]
        [CustomAuthorize("crm", "boss", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public JsonResult Edit(CallHistoryModel model)
        {
            var msg = string.Format(Resources.Resource.Saved, Resources.Resource.CallHistory);
            CallHistoryEditModel.Save(model);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("crm", "boss", "admin", "superadmin")]
        public ActionResult Edit(int contactId, int Id = 0)
        {
            CallHistoryModel model = new CallHistoryModel(contactId);
            if (Id > 0)
            {
                model = CallHistoryEditModel.Get(Id);
            }

            return View(model);
        }

        [HandleError]
        [CustomAuthorize("crm", "boss", "admin", "superadmin")]
        public ActionResult Index(long contactId, int SortCol = 0, string SortOrder = "desc", string strfrmdate = "",string strtodate = "", int? PageNo = 1)
        {
            ViewBag.ParentPage = "contact";
            ViewBag.PageName = "callhistory";
            CallHistoryEditModel model = new CallHistoryEditModel(contactId, strfrmdate, strtodate);
            model.CurrentSortOrder = SortOrder;
            model.SortCol = SortCol;
            int Size_Of_Page = Properties.Settings.Default.PageSize;
            int No_Of_Page = (PageNo ?? 1);
            var sortColumnIndex = SortCol;
            var sortDirection = SortOrder;
            var callhistory = model.CallHistoryList;
            model.IdList = callhistory.Select(x => x.Id).ToList();

            if (SortOrder == "desc")
            {
                model.SortOrder = "asc";
            }
            else
            {
                model.SortOrder = "desc";
            }
            model.PagingCallHistoryList = callhistory.ToPagedList(No_Of_Page, Size_Of_Page);            
            ContactEditModel cmodel = new ContactEditModel();
            model.Contact = cmodel.Get(contactId,false);
            model.Contact.cusContactID = contactId;
            return View(model);
        }

        public ActionResult Delete(int Id, int contactId)
        {
            CallHistoryEditModel.Delete(Id);
            return RedirectToAction("Index", new {contactId=contactId});
        }
    }
}