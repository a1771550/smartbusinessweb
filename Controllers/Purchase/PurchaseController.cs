using PagedList;
using SmartBusinessWeb.Infrastructure;
using DAL;
using SBLib.Models;
using SBLib.Models.Purchase;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Purchase
{
    [CustomAuthenticationFilter]
    public class PurchaseController : BaseController
    {
        [HandleError]
        [CustomAuthorize("purchase", "admin", "superadmin")]
        public ActionResult ExcludedOrders(int PageNo = 1, int SortCol = 0, string SortOrder = "desc", string Keyword = "")
        {
            ViewBag.ParentPage = "purchase";            
            ExcludedOrderEditModel model = new ExcludedOrderEditModel();
            HashSet<long> OrderIds = Session["ExcludedPurchaseOrderIds"] == null ? null : Session["ExcludedPurchaseOrderIds"] as HashSet<long>;
            model.GetList(PageNo, SortCol, SortOrder, Keyword, OrderIds);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("purchase", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult EditPayment(PurchasePaymentModel purchasePayment)
        {
            string msg = string.Format(Resources.Resource.SavedFormat, Resources.Resource.Payment);
            PurchaseEditModel.EditPayment(purchasePayment);
            return Json(msg);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UploadFile4Payment(long Id)
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    List<string> FileList = new List<string>();
                    string filedir = string.Format(UploadsPoPaysDir, Id);//Uploads/PO/{0}
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
                        //string fname = Path.Combine(absdir, string.Format(file, ext));
                        string fname = Path.Combine(absdir, filename);
                        _file.SaveAs(fname);
                        FileList.Add(filename);
                    }
                    using (var context = new SBDbContext(Session["DBName"].ToString()))
                    {
                        PurchasePayment purchase = context.PurchasePayments.FirstOrDefault(x => x.Id == Id);
                        if (purchase != null)
                        {
                            if (string.IsNullOrEmpty(purchase.fileName)) purchase.fileName = FileList.FirstOrDefault();
                            else
                            {
                                var fileList = purchase.fileName.Split(',').ToList();
                                if (!fileList.Any(x => x == FileList.FirstOrDefault()))
                                {
                                    fileList.Add(FileList.FirstOrDefault());
                                    purchase.fileName = string.Join(",", fileList);
                                    FileList = fileList;
                                }
                            }

                            purchase.ModifyTime = DateTime.Now;
                            context.SaveChanges();
                        }
                    }
                    dir = string.Concat(@"/", filedir);
                    //string filepath = Path.Combine(dir, string.Format(file, ext));
                    string filepath = Path.Combine(dir, filename);
                    return Json(new { msg = Resources.Resource.UploadOkMsg, filepath, FileList });
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

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult RemoveFile4Payment(long Id, string filename)
        {
            string msg = string.Format(Resources.Resource.FileFormat, Resources.Resource.Removed);
            SBCommonLib.Helpers.FileHelper.Remove(Id, filename);
            return Json(msg);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult RemoveFile(string pstCode, string filename)
        {
            string msg = string.Format(Resources.Resource.FileFormat, Resources.Resource.Removed);
            SBCommonLib.Helpers.FileHelper.Remove(pstCode, filename, CommonLib.Helpers.FuncType.Purchase);
            return Json(msg);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UploadFile(string pstCode)
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    List<string> FileList = new List<string>();
                    string filedir = string.Format(UploadsPODir, apId, pstCode);//Cus/{0}/{1}
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
                    using (var context = new SBDbContext(Session["DBName"].ToString()))
                    {
                        var pstInfo = context.PurchaseInfoes.FirstOrDefault(x => x.fileName == filename && x.AccountProfileId == apId && x.pstCode == pstCode);
                        if (pstInfo == null)
                        {
                            SessUser user = Session["User"] as SessUser;
                            context.PurchaseInfoes.Add(new PurchaseInfo
                            {
                                pstCode = pstCode,
                                fileName = FileList.FirstOrDefault(),
                                type = "file",
                                CreateBy = user.UserCode,
                                CreateTime = DateTime.Now,
                                AccountProfileId = apId
                            });
                            context.SaveChanges();
                        }
                        FileList = context.PurchaseInfoes.Where(x => x.pstCode == pstCode && x.AccountProfileId == apId && x.type == "file").Select(x => x.fileName).Distinct().ToList();
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
        [CustomAuthorize("purchase", "admin", "superadmin")]
        [HttpGet]
        ///Purchase/Review?mode=edit&receiptno=
        public ActionResult Review(string receiptno, int? ireadonly = 1)
        {
            ViewBag.ParentPage = "purchase";
            PurchaseEditModel model = new PurchaseEditModel(receiptno, ireadonly);
            return View("Edit", model);
        }

        [HandleError]
        [CustomAuthorize("purchase", "admin", "superadmin")]
        public ActionResult PurchaseOrderList(string strfrmdate = "", string strtodate = "", int? PageNo = 1, string SortName = "pstPromisedDate", string SortOrder = "desc", string Keyword = "", int filter = 0, string searchmode = "")
        {
            ViewBag.ParentPage = "purchase";
            ViewBag.PageName = "purchaseorderlist";
            PurchaseOrderEditModel model = new();
            model.GetPurchaseOrderList(strfrmdate, strtodate, (int)PageNo, SortName, SortOrder, Keyword, filter, searchmode);
            return View(model);
        }


        [HandleError]
        [CustomAuthorize("purchase", "admin", "superadmin")]
        public ActionResult Print(long Id, string type, string mode)
        {
            ViewBag.ParentPage = "purchase";
            ViewBag.PageName = "purchase";
            PurchaseEditModel model = new PurchaseEditModel(Id, type, true);
            model.PrintMode = mode;
            return View(model);
        }
        // GET: Purchase
        [HandleError]
        [CustomAuthorize("purchase", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, int SortCol = 4, string SortOrder = "desc", string Keyword = "")
        {
            SessUser user = Session["User"] as SessUser;
            ViewBag.ParentPage = "purchase";           
            PurchaseEditModel model = new PurchaseEditModel
            {
                Keyword = Keyword == "" ? null : Keyword
            };
            model.GetList(user, model.Keyword);
            DoList(SortCol, SortOrder, PageNo, model);
            ViewBag.Title = Resources.Resource.Purchase;
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("purchase", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(long? Id, string type=null)
        {
            ViewBag.ParentPage = "purchase";          
            PurchaseEditModel model = new PurchaseEditModel(Id, type);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("purchase", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(PurchaseModel model, List<PurchaseItemModel> PurchaseItems, RecurOrder recurOrder = null)
        {
            ViewBag.ParentPage = "purchaseedit";
            ViewBag.PageName = "purchase";
            PurchaseReturnMsg msg = PurchaseEditModel.Edit(model, PurchaseItems, recurOrder);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("purchase", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult SaveDraft(PurchaseModel model, List<PurchaseItemModel> PurchaseItems, RecurOrder recurOrder = null)
        {
            ViewBag.ParentPage = "purchaseedit";
            ViewBag.PageName = "purchase";
            PurchaseEditModel.SaveDraft(model, PurchaseItems, recurOrder);
            return Json(Resources.Resource.Saved);
        }

        [HandleError]
        [CustomAuthorize("purchase", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int Id)
        {
            ViewBag.ParentPage = "purchaseedit";
            ViewBag.PageName = "purchase";
            PurchaseEditModel.Delete(Id);
            return Json(new { });
        }

        private void DoList(int SortCol, string SortOrder, int? PageNo, PurchaseEditModel model)
        {
            model.CurrentSortOrder = SortOrder;
            model.SortCol = SortCol;
            int Size_Of_Page = PageSize;
            int No_Of_Page = (PageNo ?? 1);
            var sortColumnIndex = SortCol;
            var sortDirection = SortOrder;
            if (sortColumnIndex == 0)
            {
                model.PSList = sortDirection == "asc" ? model.PSList.OrderBy(c => c.pstCode).ThenBy(c => c.pstPromisedDate).ThenBy(c => c.CreateTime).ToList() : model.PSList.OrderByDescending(c => c.pstCode).ThenByDescending(c => c.pstPromisedDate).ThenByDescending(c => c.CreateTime).ToList();
            }
            else if (sortColumnIndex == 1)
            {
                model.PSList = sortDirection == "asc" ? model.PSList.OrderBy(c => c.supCode).ThenBy(x => x.pstCode).ThenBy(c => c.pstPromisedDate).ThenBy(c => c.CreateTime).ToList() : model.PSList.OrderByDescending(c => c.supCode).ThenByDescending(x => x.pstCode).ThenByDescending(c => c.pstPromisedDate).ThenByDescending(c => c.CreateTime).ToList();
            }
            else if (sortColumnIndex == 2)
            {
                model.PSList = sortDirection == "asc" ? model.PSList.OrderBy(c => c.pstLocStock).ThenBy(x => x.pstCode).ThenBy(c => c.pstPromisedDate).ThenBy(c => c.CreateTime).ToList() : model.PSList.OrderByDescending(c => c.pstLocStock).ThenByDescending(x => x.pstCode).ThenByDescending(c => c.pstPromisedDate).ThenByDescending(c => c.CreateTime).ToList();
            }
            else if (sortColumnIndex == 3)
            {
                model.PSList = sortDirection == "asc" ? model.PSList.OrderBy(c => c.pstStatus).ThenBy(x => x.pstCode).ThenBy(c => c.pstPromisedDate).ThenBy(c => c.CreateTime).ToList() : model.PSList.OrderByDescending(c => c.pstStatus).ThenByDescending(x => x.pstCode).ThenByDescending(c => c.pstPromisedDate).ThenByDescending(c => c.CreateTime).ToList();
            }
            else if (sortColumnIndex == 4)
            {
                model.PSList = sortDirection == "asc" ? model.PSList.OrderBy(c => c.pstPurchaseTime).ThenBy(x => x.pstCode).ThenBy(c => c.pstPromisedDate).ThenBy(c => c.CreateTime).ToList() : model.PSList.OrderByDescending(c => c.pstPurchaseTime).ThenByDescending(x => x.pstCode).ThenByDescending(c => c.pstPromisedDate).ThenByDescending(c => c.CreateTime).ToList();
            }
            else if (sortColumnIndex == 5)
            {
                model.PSList = sortDirection == "asc" ? model.PSList.OrderBy(c => c.pstPromisedDate).ThenBy(x => x.pstCode).ThenBy(c => c.pstPromisedDate).ThenBy(c => c.CreateTime).ToList() : model.PSList.OrderByDescending(c => c.pstPromisedDate).ThenByDescending(x => x.pstCode).ThenByDescending(c => c.pstPromisedDate).ThenByDescending(c => c.CreateTime).ToList();
            }
            model.SortOrder = SortOrder == "desc" ? "asc" : "desc";
            model.PagingPSList = model.PSList.ToPagedList(No_Of_Page, Size_Of_Page);
        }
    }
}