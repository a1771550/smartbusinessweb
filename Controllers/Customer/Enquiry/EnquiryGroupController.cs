using SmartBusinessWeb.Infrastructure;
using System.Collections.Generic;
using System.Web.Mvc;
using PPWLib.Models.Customer.Enquiry;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Enquiry.Enquiry
{
    [CustomAuthenticationFilter]
    public class EnquiryGroupController : BaseController
    {
        [HttpGet]
        public JsonResult GetListAjax(int PageNo = 1)
        {
            EnquiryGroupEditModel model = new EnquiryGroupEditModel();
            model.GetList(PageNo);
            return Json(new { List = model.PagingGroupList, RecordCount = model.GroupList.Count }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Remove(int Id, int PageNo = 1)
        {
            EnquiryGroupEditModel model = new EnquiryGroupEditModel();
            model.RemoveGroup(Id, PageNo);
            return Json(new { List = model.PagingGroupList, RecordCount = model.GroupList.Count });
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Save(EnquiryGroupModel EnquiryGroup, List<int> IdList, List<string> EnIdList, int PageNo = 1)
        {
            EnquiryGroupEditModel model = new EnquiryGroupEditModel();
            model.SaveGroup(EnquiryGroup, IdList, EnIdList, PageNo);
            return Json(new { List = model.PagingGroupList, RecordCount = model.GroupList.Count });
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpGet]
        public ViewResult Edit(int? Id)
        {
            ViewBag.ParentPage = "customer";
            EnquiryGroupEditModel model = new EnquiryGroupEditModel();
            model.Get(Id);
            return View(model);
        }
        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(EnquiryGroupModel EnquiryGroup)
        {
            ViewBag.ParentPage = ViewBag.PageName = "customer";
            EnquiryGroupEditModel model = new();
            model.Edit(EnquiryGroup);
            return Json(Resources.Resource.Saved);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, int PageSize = 10, int SortCol = 0, string SortOrder = "desc", string Keyword = "")
        {
            ViewBag.ParentPage = "customer";
            if (string.IsNullOrEmpty(Keyword))
                Keyword = null;
            EnquiryGroupEditModel model = new EnquiryGroupEditModel
            {
                CurrentSortOrder = SortOrder,
                SortCol = SortCol,
                Keyword = Keyword,
                SortOrder = SortOrder == "desc" ? "asc" : "desc",
                PageSize = PageSize,
            };

            model.GetList(PageNo, SortCol, SortOrder, Keyword);
            return View(model);
        }
    }
}