using SmartBusinessWeb.Infrastructure;
using PPWLib.Models.Item;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Item
{
    [CustomAuthenticationFilter]
    public class PromotionController : BaseController
    {
        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        // GET: Promotion
        public ActionResult Index(int PageNo = 1, int SortCol = 6, string SortOrder = "desc", string Keyword = null)
        {
            ViewBag.ParentPage = "promotion";
            ViewBag.PageName = "promotion";
            ViewBag.Title = Resources.Resource.Promotion;
            PromotionEditModel model = new PromotionEditModel(SortCol, SortOrder, Keyword, PageNo);
            model.GetList();
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int Id = 0)
        {
            ViewBag.Title = Id == 0 ? string.Format(Resources.Resource.AddFormat, Resources.Resource.Promotion) : string.Format(Resources.Resource.EditFormat, Resources.Resource.Promotion);
            ViewBag.ParentPage = "promotion";
            ViewBag.PageName = "proedit";
            PromotionEditModel cmodel = new PromotionEditModel(Id);
            return View(cmodel.Promotion);
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(PromotionModel model)
        {
            ViewBag.ParentPage = "promotion";
            ViewBag.PageName = "proedit";
            PromotionEditModel cmodel = new PromotionEditModel();
            //if(ModelState.IsValid)
            //{
            if (model.Id == 0)
            {
                cmodel.Add(model);
            }
            else
            {
                cmodel.Edit(model);
            }
            //}

            string msg = Resources.Resource.Saved;
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(long Id)
        {
            ViewBag.ParentPage = "promotion";
            ViewBag.PageName = "proedit";
            PromotionEditModel model = new PromotionEditModel();
            model.Delete(Id);
            return Json(new { });
        }
    }
}