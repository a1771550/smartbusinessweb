using SmartBusinessWeb.Infrastructure;
using PPWDAL;
using PPWLib.Models.Item;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Item
{
    [CustomAuthenticationFilter]
    public class TransferController : BaseController
    {
        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        public ActionResult Edit(string code)
        {
            TransferEditModel model = new(code);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public JsonResult Edit(TransferModel stocktransfer)
        {
            var msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.Transfer);
            TransferEditModel.Edit(stocktransfer);
            return Json(msg);
        }
       
        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        public ActionResult PrintByCode(string code)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "print";
            TransferEditModel model = new TransferEditModel();
            model.PreparePrint(code);
            return View("Print", model);
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        public ActionResult List(int SortCol = 0, string SortOrder = "asc", string strfrmdate = "", string strtodate = "", string Keyword = null, int? PageNo = 1)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "transferlist";
            //ViewBag.Title = string.Format(Resources.Resource.ListFormat, Resources.Resource.StockTransfer);
            int Size_Of_Page = (int)ComInfo.PageLength;
            TransferEditModel model = new TransferEditModel();
            model.GetTransferList(strfrmdate, strtodate, (int)PageNo, Size_Of_Page, SortCol, SortOrder, Keyword);
            model.Keyword = Keyword;
            return View(model);
        }

        /// <summary>
        /// Print Stock Transfer Slip
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        public ActionResult Print(int? start, int? end)
        {
            ViewBag.ParentPage = "item";           
            TransferEditModel model = new TransferEditModel();
            model.PreparePrint(start, end);
            return View(model);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="hasItemOption"></param>
        /// <param name="hasIvOnly">for those items without batch but with item variations</param>
        /// <param name="itemId"></param>
        /// <param name="location"></param>
        /// <param name="qty"></param>
        /// <returns></returns>
        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Transfer(int itemId, string location, int qty, int hasItemOption = 0, int hasIvOnly = 0)
        {
            ViewBag.ParentPage = "item";
            ItemEditModel model = new ItemEditModel(itemId, true, hasItemOption==1,hasIvOnly==1, location, qty);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult ProcessTransferIOVari(List<TransferLnModel> TransferList)
        {
            var msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.Transfer);
            TransferEditModel model = new TransferEditModel();
            model.ProcessTransfer(TransferList);
            return Json(new { msg });
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult ProcessTransfer(List<JsStock> JsStockList, List<TransferModel> TransferList)
        {
            var msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.Transfer);
            TransferEditModel model = new();
            model.ProcessTransfer(JsStockList, TransferList);
            return Json(new { msg });
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, string SortName = "code", string SortOrder = "asc", string Keyword = null)
        {
            ViewBag.ParentPage = "item";  
            TransferEditModel model = new()
			{
				SortName = SortName,
				SortOrder = (SortOrder == "desc") ? "asc" : "desc",
				Keyword = Keyword,
			};
			model.GetItemList(PageNo, SortName, SortOrder, Keyword);
			return View(model);
        }

    }


}