using PPWLib.Models.Customer;
using SmartBusinessWeb.Infrastructure;
using System.Web.Mvc;
using PPWLib.Models.Customer.Group;
using Resources = CommonLib.App_GlobalResources;
using DocumentFormat.OpenXml.Office2010.ExcelAc;
using System.Collections.Generic;

namespace SmartBusinessWeb.Controllers.Customer
{
    [CustomAuthenticationFilter]
    public class CustomerGroupController : BaseController
    {
        [HttpGet]
        public JsonResult GetListAjax(int PageNo = 1)
        {
            CustomerGroupEditModel model = new CustomerGroupEditModel();
            model.GetList(PageNo);
            return Json(new { List = model.PagingGroupList, RecordCount = model.GroupList.Count }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Remove(int Id, int PageNo = 1)
        {
            CustomerGroupEditModel model = new CustomerGroupEditModel();
            model.RemoveGroup(Id, PageNo);
            return Json(new { List = model.PagingGroupList, RecordCount = model.GroupList.Count });
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Save(CustomerGroupModel CustomerGroup, List<int> IdList, List<string> CodeList, int PageNo = 1)
        {
            CustomerGroupEditModel model = new CustomerGroupEditModel();
            model.SaveGroup(CustomerGroup, IdList, CodeList, PageNo);
            return Json(new { List = model.PagingGroupList, RecordCount = model.GroupList.Count });
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpGet]      
        public ViewResult Edit(int? Id)
        {
            ViewBag.ParentPage = "customer";
            CustomerGroupEditModel model = new CustomerGroupEditModel();
            model.Get(Id);
            return View(model);
        }
        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(CustomerGroupModel CustomerGroup)
        {
            ViewBag.ParentPage = ViewBag.PageName = "customer";
            CustomerGroupEditModel model = new();
            model.Edit(CustomerGroup);          
            return Json(Resources.Resource.Saved);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, int PageSize = 10, int SortCol = 0, string SortOrder = "desc", string Keyword = "")
        {
            ViewBag.ParentPage = "customer";
            if (string.IsNullOrEmpty(Keyword))
                Keyword = null;
            CustomerGroupEditModel model = new CustomerGroupEditModel
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