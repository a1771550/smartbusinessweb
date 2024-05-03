using SmartBusinessWeb.Infrastructure;
using PPWLib.Models.Item;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Item
{
    [CustomAuthenticationFilter]
    public class ItemPeriodPromotionController : BaseController
    {
        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, int SortCol = 3, string SortOrder = "desc", string Keyword = null)
        {
            ViewBag.ParentPage = "promotion";
            ViewBag.PageName = "itemperiodpromotion";
            ViewBag.Title = Resources.Resource.ItemPeriodPromotion;
            ItemPeriodPromotionEditModel model = new ItemPeriodPromotionEditModel(SortCol, SortOrder, Keyword, PageNo);
            model.GetList();
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int proId=0)
        {
            ViewBag.Title = proId == 0 ? string.Format(Resources.Resource.AddFormat, Resources.Resource.ItemPricePromotion) : string.Format(Resources.Resource.EditFormat, Resources.Resource.ItemPricePromotion);
            ViewBag.ParentPage = "promotion";
            ViewBag.PageName = "ipedit";
            ItemPeriodPromotionEditModel model = new ItemPeriodPromotionEditModel(proId);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(ItemPeriodPromotionModel model)
        {
            ViewBag.ParentPage = "promotion";
            ViewBag.PageName = "ipedit";
            ItemPeriodPromotionEditModel cmodel = new ItemPeriodPromotionEditModel();
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
            ItemPeriodPromotionEditModel model = new ItemPeriodPromotionEditModel();
            model.Delete(Id);
            return Json("");
        }
    }
}