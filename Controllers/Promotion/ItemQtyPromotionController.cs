using SmartBusinessWeb.Infrastructure;
using PPWLib.Models.Item;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Item
{
    [CustomAuthenticationFilter]
    public class ItemQtyPromotionController : BaseController
    {
        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, int SortCol = 4, string SortOrder = "desc", string Keyword = null)
        {
            ViewBag.ParentPage = "promotion";
            ViewBag.PageName = "itemqtypromotion";
            ViewBag.Title = Resources.Resource.ItemQtyPromotion;
            ItemQtyPromotionEditModel model = new ItemQtyPromotionEditModel(SortCol, SortOrder, Keyword, PageNo);
            model.GetList();
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int proId=0)
        {
            ViewBag.Title = proId == 0 ? string.Format(Resources.Resource.AddFormat, Resources.Resource.ItemQtyPromotion) : string.Format(Resources.Resource.EditFormat, Resources.Resource.ItemQtyPromotion);
            ViewBag.ParentPage = "promotion";
            ViewBag.PageName = "ipedit";
            ItemQtyPromotionEditModel model = new ItemQtyPromotionEditModel(proId);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(ItemQtyPromotionModel model)
        {
            ViewBag.ParentPage = "promotion";
            ViewBag.PageName = "ipedit";
            ItemQtyPromotionEditModel cmodel = new ItemQtyPromotionEditModel();
            if (model.proId == 0)
            {
                cmodel.Add(model);
            }
            else
            {
                cmodel.Edit(model);
            }

            string msg = Resources.Resource.Saved;
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(long Id)
        {
            ViewBag.ParentPage = "promotion";
            ViewBag.PageName = "ipedit";
            ItemQtyPromotionEditModel model = new ItemQtyPromotionEditModel();
            model.Delete(Id);
            return Json("");
        }
    }
}