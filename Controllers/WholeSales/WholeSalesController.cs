using SmartBusinessWeb.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using PPWLib.Models.WholeSales;
using PagedList;
using PPWLib.Models;
using PPWLib.Models.POS.Sales;
using PPWDAL;
using System.IO;

namespace SmartBusinessWeb.Controllers.WholeSales
{
    [CustomAuthenticationFilter]
    public class WholeSalesController : BaseController
    {
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UploadFile(string filecode)
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    List<string> filenamelist = new List<string>();
                    //string wscode = "WS100054";
                    string filedir = string.Format(UploadsWSDir, apId, filecode);//Uploads/WS/{0}/{1}
                    string dir = "";
                    //string ext = "";
                    //string rand = CommonHelper.GenerateNonce(10);
                    //string file = string.Format("{0}",rand);
                    string filename = string.Empty;
                    HttpFileCollectionBase files = Request.Files;
                    for (int i = 0; i < files.Count; i++)
                    {
                        filename = Path.GetFileName(Request.Files[i].FileName);
                        HttpPostedFileBase _file = files[i];
                        FileInfo fi = new FileInfo(filename);
                        //ext = fi.Extension;
                        dir = string.Concat(@"~/", filedir);
                        var absdir = Server.MapPath(dir);
                        if (!Directory.Exists(absdir))
                        {
                            Directory.CreateDirectory(absdir);
                        }
                        //string fname = Path.Combine(absdir, string.Format(file, ext));
                        string fname = Path.Combine(absdir, filename);
                        _file.SaveAs(fname);
                        filenamelist.Add(filename);
                    }
                    using (var context = new PPWDbContext(Session["DBName"].ToString()))
                    {
                        WholeSale wholeSale = context.WholeSales.FirstOrDefault(x => x.wsCode == filecode && x.AccountProfileId == apId);
                        if (wholeSale != null)
                        {
                            if (string.IsNullOrEmpty(wholeSale.UploadFileName))
                            {
                                wholeSale.UploadFileName = filenamelist.FirstOrDefault();
                            }
                            else
                            {
                                if (!wholeSale.UploadFileName.Split(',').Any(x => x == filenamelist.FirstOrDefault()))
                                {
                                    filenamelist.Add(wholeSale.UploadFileName);
                                    wholeSale.UploadFileName = string.Join(",", filenamelist);
                                }
                            }
                        }
                        context.SaveChanges();
                    }
                    dir = string.Concat(@"/", filedir);
                    //string filepath = Path.Combine(dir, string.Format(file, ext));
                    string filepath = Path.Combine(dir, filename);
                    return Json(new { msg = Resources.Resource.UploadOkMsg, filepath });
                }
                catch (Exception ex)
                {
                    return Json(new { msg = "Error occurred. Error details: " + ex.Message });
                }
            }
            else
            {
                return Json(new { msg = Resources.Resource.NoFileSelected });
            }
        }


        [HandleError]
        [CustomAuthorize("wholesales", "boss", "admin", "superadmin")]
        [HttpGet]
        ///WholeSales/Review?mode=edit&receiptno=
        public ActionResult Review(string receiptno, int? ireadonly = 1)
        {
            ViewBag.ParentPage = "wholesales";
            ViewBag.PageName = "edit";
            WholeSalesEditModel model = new WholeSalesEditModel(receiptno, ireadonly);
            return View("Edit", model);
        }

        [HandleError]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult SaveRecurOrder(RecurOrder recurOrder)
        {
            var msg = string.Format(Resources.Resource.SavedFormat, Resources.Resource.RecurringOrder);
            SalesOrderEditModel model = new();
            model.SaveRecurOrder(recurOrder);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("wholesales", "boss", "admin", "superadmin")]
        public ActionResult SalesOrderList(string strfrmdate = "", string strtodate = "", int? PageNo = 1, string SortName = "wsDeliveryDate", string SortOrder = "desc", string Keyword = "", int filter = 0, string searchmode = "")
        {
            ViewBag.ParentPage = "wholesales";
            ViewBag.PageName = "salesorderlist";
            SalesOrderEditModel model = new();
            model.GetWholeSalesOrderList(strfrmdate, strtodate, (int)PageNo, SortName, SortOrder, Keyword, filter, searchmode);
            return View(model);
        }


        [HandleError]
        [CustomAuthorize("wholesales", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Delivery(List<DeliveryItemModel> model, WholeSalesView ws, List<WholeSalesLnModel> wslnList)
        {
            ViewBag.ParentPage = "wholesales";
            ViewBag.PageName = "wholesales";
            WholeSalesEditModel wemodel = new WholeSalesEditModel();
            wemodel.Delivery(model, ws, wslnList);
            string msg = wemodel.OutOfStockWholeSalesLns != null && wemodel.OutOfStockWholeSalesLns.Count > 0 ? Resources.Resource.ZeroStockItemsWarning : string.Format(Resources.Resource.Delivered, Resources.Resource.WholeSales);
            string[] zerostockItemcodes = wemodel.OutOfStockWholeSalesLns.Select(x => x.itmCode).ToArray();
            return Json(new { msg, ws.wsCode, zerostockItemcodes = zerostockItemcodes.Length > 0 ? string.Join(",", zerostockItemcodes) : "" });
        }

        [HandleError]
        [CustomAuthorize("wholesales", "boss", "admin", "superadmin")]
        public ActionResult Delivery(int Id)
        {
            ViewBag.ParentPage = "wholesales";
            ViewBag.PageName = "wholesales";
            WholeSalesEditModel model = new WholeSalesEditModel(Id, null, 0, "delivery");
            return View(model.WholeSales);
        }

        [HandleError]
        [CustomAuthorize("wholesales", "boss", "admin", "superadmin")]
        public ActionResult Print(int Id, string type)
        {
            ViewBag.ParentPage = "wholesales";
            ViewBag.PageName = "wholesales";
            WholeSalesEditModel model = new WholeSalesEditModel(Id, null, 0, type, true);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("wholesales", "boss", "admin", "superadmin")]
        public ActionResult Index(string strfrmdate = null, string strtodate = null, int SortCol = 4, string SortOrder = "desc", string Keyword = "", int? PageNo = 1)
        {
            var user = Session["User"] as SessUser;
            ViewBag.ParentPage = "wholesales";
            ViewBag.PageName = "list";
            WholeSalesEditModel model = new WholeSalesEditModel();
            model.Keyword = Keyword == "" ? null : Keyword;
            model.GetList(user, strfrmdate, strtodate, model.Keyword);
            if (model.WSList != null && model.WSList.Count > 0)
                DoList(SortCol, SortOrder, PageNo, model);
            ViewBag.Title = Resources.Resource.WholeSales;
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("wholesales", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(long Id, string type)
        {
            ViewBag.ParentPage = "wholesales";
            ViewBag.PageName = "edit";
            WholeSalesEditModel model = new WholeSalesEditModel(Id, null, 0, type);
            //WholeSalesEditModel.Get(Id, null, 0, type);
            return View(model);
        }


        [HandleError]
        [CustomAuthorize("wholesales", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(WholeSalesView model, List<WholeSalesLnModel> wslnList, RecurOrder recurOrder)
        {
            ViewBag.ParentPage = "wholesalesedit";
            ViewBag.PageName = "wholesales";
            SalesReturnMsg msg = WholeSalesEditModel.Edit(model, wslnList, recurOrder);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("wholesales", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(long Id)
        {
            ViewBag.ParentPage = "wholesales";
            ViewBag.PageName = "wholesales";
            WholeSalesEditModel.Delete(Id);
            return Json(new { });
        }

        private void DoList(int SortCol, string SortOrder, int? PageNo, WholeSalesEditModel model)
        {
            model.CurrentSortOrder = SortOrder;
            model.SortCol = SortCol;
            int Size_Of_Page = PageSize;
            int No_Of_Page = (PageNo ?? 1);
            var sortColumnIndex = SortCol;
            var sortDirection = SortOrder;
            if (sortColumnIndex == 0)
            {
                model.WSList = sortDirection == "asc" ? model.WSList.OrderBy(c => c.wsCode).ThenBy(c => c.wsPromisedDate).ToList() : model.WSList.OrderByDescending(c => c.wsCode).ThenByDescending(c => c.wsPromisedDate).ToList();
            }
            else if (sortColumnIndex == 1)
            {
                model.WSList = sortDirection == "asc" ? model.WSList.OrderBy(c => c.wsCusID).ThenBy(c => c.wsCode).ThenBy(c => c.wsPromisedDate).ToList() : model.WSList.OrderByDescending(c => c.wsCusID).ThenByDescending(c => c.wsCode).ThenByDescending(c => c.wsPromisedDate).ToList();
            }
            else if (sortColumnIndex == 2)
            {
                model.WSList = sortDirection == "asc" ? model.WSList.OrderBy(c => c.wsSalesLoc).ThenBy(c => c.wsCode).ThenBy(c => c.wsPromisedDate).ToList() : model.WSList.OrderByDescending(c => c.wsSalesLoc).ThenByDescending(c => c.wsCode).ThenByDescending(c => c.wsPromisedDate).ToList();
            }
            else if (sortColumnIndex == 3)
            {
                model.WSList = sortDirection == "asc" ? model.WSList.OrderBy(c => c.wsStatus).ThenBy(c => c.wsCode).ThenBy(c => c.wsPromisedDate).ToList() : model.WSList.OrderByDescending(c => c.wsStatus).ThenByDescending(c => c.wsCode).ThenByDescending(c => c.wsPromisedDate).ToList();
            }
            else if (sortColumnIndex == 4)
            {
                model.WSList = sortDirection == "asc" ? model.WSList.OrderBy(c => c.wsDate).ThenBy(c => c.wsCode).ThenBy(c => c.wsPromisedDate).ToList() : model.WSList.OrderByDescending(c => c.wsDate).ThenByDescending(c => c.wsCode).ThenByDescending(c => c.wsPromisedDate).ToList();
            }
            else if (sortColumnIndex == 5)
            {
                model.WSList = sortDirection == "asc" ? model.WSList.OrderBy(c => c.wsPromisedDate).ThenBy(c => c.wsCode).ThenBy(c => c.wsPromisedDate).ToList() : model.WSList.OrderByDescending(c => c.wsPromisedDate).ThenByDescending(c => c.wsCode).ThenByDescending(c => c.wsPromisedDate).ToList();
            }

            if (SortOrder == "desc")
            {
                model.SortOrder = "asc";
            }
            else
            {
                model.SortOrder = "desc";
            }
            model.PagingWSList = model.WSList.ToPagedList(No_Of_Page, Size_Of_Page);
        }
    }
}