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
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult Edit(string code)
        {
            TransferEditModel model = new(code);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public JsonResult Edit(TransferModel stocktransfer)
        {
            var msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.Transfer);
            TransferEditModel.Edit(stocktransfer);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public JsonResult EditList(List<TransferModel> transferList, StockTransferInfo info)
        {
            var msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.Transfer);
            TransferEditModel.Edit(transferList, info);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult PrintByCode(string code)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "print";
            TransferEditModel model = new TransferEditModel();
            model.PreparePrint(code);
            return View("Print", model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult List(int SortCol = 0, string SortOrder = "desc", string strfrmdate = "", string strtodate = "", string Keyword = null, int? PageNo = 1)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "transferlist";
            ViewBag.Title = string.Format(Resources.Resource.ListFormat, Resources.Resource.StockTransfer);
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
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult Print(int? start, int? end)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "print";
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
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Transfer(int hasItemOption, int hasIvOnly, int itemId, string location, int qty)
        {
            ViewBag.ParentPage = "item";
            ItemEditModel model = new ItemEditModel(itemId, true, hasItemOption==1,hasIvOnly==1, location, qty);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult ProcessTransferIO(List<TransferModel> TransferList)
        {
            var msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.Transfer);
            TransferEditModel model = new TransferEditModel();
            model.ProcessTransfer(TransferList);
            return Json(new { msg });
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult ProcessTransfer(List<JsStock> JsStockList, List<TransferModel> TransferList)
        {
            var msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.Transfer);
            TransferEditModel model = new TransferEditModel();
            model.ProcessTransfer(JsStockList, TransferList);
            return Json(new { msg });
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult Index(int SortCol = 0, string SortOrder = "desc", string Keyword = null, int? PageNo = 1)
        {
            ViewBag.ParentPage = "item";
            ViewBag.PageName = "transfer";
            int Size_Of_Page = (int)ComInfo.PageLength;
            TransferEditModel model = new();
            model.GetStockList(apId, (int)PageNo, Size_Of_Page, SortCol, SortOrder, Keyword);
            //model.TransferNumber = model.GetTransferNumber();
            return View(model);
        }

    }


}