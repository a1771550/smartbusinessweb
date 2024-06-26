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

namespace SmartBusinessWeb.Controllers.Sales
{
    [CustomAuthenticationFilter]
    public class WholeSalesController : BaseController
    {
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UploadFile(string wsCode)
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    List<string> FileList = new List<string>();
                    string filedir = string.Format(UploadsWSDir, apId, wsCode);//Cus/{0}/{1}
                    string dir = "";
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
                        string fname = Path.Combine(absdir, filename);
                        _file.SaveAs(fname);
                        FileList.Add(filename);
                    }
                    using (var context = new PPWDbContext(Session["DBName"].ToString()))
                    {
                        var wsInfo = context.WholeSalesInfoes.FirstOrDefault(x => x.fileName == filename && x.AccountProfileId == apId && x.wsCode == wsCode);
                        if (wsInfo == null)
                        {
                            SessUser user = Session["User"] as SessUser;
                            context.WholeSalesInfoes.Add(new WholeSalesInfo
                            {
                                wsCode = wsCode,
                                fileName = FileList.FirstOrDefault(),
                                type = "file",
                                CreateBy = user.UserCode,
                                CreateTime = DateTime.Now,
                                AccountProfileId = apId
                            });
                            context.SaveChanges();
                        }
                        FileList = context.WholeSalesInfoes.Where(x => x.wsCode == wsCode && x.AccountProfileId == apId && x.type == "file").Select(x => x.fileName).Distinct().ToList();
                    }
                    return Json(new { msg = Resources.Resource.UploadOkMsg, FileList });
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
        [CustomAuthorize("wholesales", "admin", "superadmin")]
        [HttpGet]
        ///WholeSales/Review?mode=edit&receiptno=
        public ActionResult Review(string receiptno)
        {
            ViewBag.ParentPage = "wholesales";
            ViewBag.PageName = "edit";
            WholeSalesEditModel model = new WholeSalesEditModel(receiptno);
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
        [CustomAuthorize("wholesales", "admin", "superadmin")]
        public ActionResult SalesOrderList(int? PageNo = 1, string SortName = "wsDeliveryDate", string SortOrder = "desc", string Keyword = "", int filter = 0, string searchmode = "")
        {
            ViewBag.ParentPage = "wholesales";
            ViewBag.PageName = "salesorderlist";
            SalesOrderEditModel model = new();
            model.GetWholeSalesOrderList((int)PageNo, SortName, SortOrder, Keyword, filter, searchmode);
            return View(model);
        }


        [HandleError]
        [CustomAuthorize("wholesales", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Delivery(List<DeliveryItemModel> model, WholeSalesModel ws, List<WholeSalesLnModel> wslnList)
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
        [CustomAuthorize("wholesales", "admin", "superadmin")]
        public ActionResult Print(int Id, string type)
        {
            ViewBag.ParentPage = "wholesales";            
            WholeSalesEditModel model = new WholeSalesEditModel(Id, null, type, true);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("wholesales", "admin", "superadmin")]
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
        [CustomAuthorize("wholesales", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(long Id, string type)
        {
            ViewBag.ParentPage = "wholesales";
            ViewBag.PageName = "edit";
            WholeSalesEditModel model = new WholeSalesEditModel(Id, null, type);
            return View(model);
        }


        [HandleError]
        [CustomAuthorize("wholesales", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(WholeSalesModel model, List<WholeSalesLnModel> wslnList, RecurOrder recurOrder)
        {
            ViewBag.ParentPage = "wholesalesedit";
            ViewBag.PageName = "wholesales";
            SalesReturnMsg msg = WholeSalesEditModel.Edit(model, wslnList, recurOrder);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("wholesales", "admin", "superadmin")]
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