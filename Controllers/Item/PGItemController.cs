using PagedList;
using SmartBusinessWeb.Infrastructure;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using PPWLib.Models.Item;

namespace SmartBusinessWeb.Controllers.Item
{
    [CustomAuthenticationFilter]
    public class PGItemController : BaseController
    {
        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int itemId = 0)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "pgitem";
            PGItemEditModel model = new PGItemEditModel(itemId,true);
            return View(model);
        }
        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(PGItemModel model)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "pgitem";
            if (model.itmItemID == 0)
            {
                PGItemEditModel.Add(model);
            }
            else
            {
                PGItemEditModel.Edit(model);
            }
            string msg = Resources.Resource.ItemSaved;
            return Json(msg);
        }

        
        // GET: PG
        public ActionResult Index(int SortCol = 2, string SortOrder = "desc", string Keyword = "", int? PageNo = 1)
        {
            ViewBag.ParentPage = "Item";
            ViewBag.PageName = "pglist";
            if (string.IsNullOrEmpty(Keyword))
                Keyword = null;

            PGItemEditModel model = new PGItemEditModel
            {
                SortCol = SortCol,
                Keyword = Keyword
            };
            if (SortOrder == "desc")
            {
                model.SortOrder = "asc";
            }
            else
            {
                model.SortOrder = "desc";
            }

            var pgitemlist = model.GetList(Keyword);

            int Size_Of_Page = PageSize;
            int No_Of_Page = (PageNo ?? 1);
            var sortColumnIndex = SortCol;
            var sortDirection = SortOrder;

            if (sortColumnIndex == 0)
            {
                pgitemlist = sortDirection == "asc" ? pgitemlist.OrderBy(c => c.itmCode).ToList() : pgitemlist.OrderByDescending(c => c.itmCode).ToList();
            }
            else if (sortColumnIndex == 1)
            {
                pgitemlist = sortDirection == "asc" ? pgitemlist.OrderBy(c => c.NameDescTxt).ToList() : pgitemlist.OrderByDescending(c => c.NameDescTxt).ToList();
            }
            else if (sortColumnIndex == 2)
            {
                pgitemlist = sortDirection == "asc" ? pgitemlist.OrderBy(c => c.itmCreateTime).ToList() : pgitemlist.OrderByDescending(c => c.itmCreateTime).ToList();
            }
            else if (sortColumnIndex == 3)
            {
                pgitemlist = sortDirection == "asc" ? pgitemlist.OrderBy(c => c.itmModifyTime).ToList() : pgitemlist.OrderByDescending(c => c.itmModifyTime).ToList();
            }

            model.PagingPGItemList = pgitemlist.ToPagedList(No_Of_Page, Size_Of_Page);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int itemId)
        {
            ViewBag.ParentPage = ViewBag.PageName = "item";
            string msg = PGItemEditModel.Delete(itemId);
            return Json(msg);
        }
    }
}