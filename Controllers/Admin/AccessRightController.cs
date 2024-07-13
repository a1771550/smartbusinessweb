using SmartBusinessWeb.Infrastructure;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using SBLib.Models.User;

namespace SmartBusinessWeb.Controllers.Admin
{
    [CustomAuthenticationFilter]
    public class AccessRightController : BaseController
    {
        [HandleError]
        [CustomAuthorize("accessrights", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, int SortCol = 0, string SortOrder = "desc", string Keyword = null)
        {
            ViewBag.ParentPage = "admin";
            ViewBag.PageName = "accessrights";
            UserEditModel model = new UserEditModel
            {
                CurrentSortOrder = SortOrder,
                SortCol = SortCol,
                Keyword = Keyword,
                SortOrder = SortOrder == "desc" ? "asc" : "desc"
            };
            model.GetUserList(PageNo,SortCol,SortOrder,Keyword);
            return View(model);

        }

        [HandleError]
        [CustomAuthorize("accessrights", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int userId = 0)
        {
            UserEditModel model = new UserEditModel();
            model.Get(userId);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("accessrights", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(UserModel model)
        {
            UserEditModel.Edit(model);
            return Json(Resources.Resource.Saved);

        }

        [HandleError]
        [CustomAuthorize("accessrights", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int userId)
        {
            UserEditModel.Delete(userId);
            var msg = Resources.Resource.Removed;
            return Json(msg);
        }
    }
}