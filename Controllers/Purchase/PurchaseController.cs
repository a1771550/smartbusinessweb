using CommonLib.Helpers;
using PagedList;
using SmartBusinessWeb.Infrastructure;
using PPWDAL;
using PPWLib.Models;
using PPWLib.Models.Purchase;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using PPWCommonLib.Helpers;

namespace SmartBusinessWeb.Controllers.Purchase
{
    [CustomAuthenticationFilter]
    public class PurchaseController : BaseController
    {
        [HandleError]
        [CustomAuthorize("purchase", "boss", "admin", "superadmin")]
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
                    List<string> filenamelist = new List<string>();
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
                        filenamelist.Add(filename);
                    }
                    using (var context = new PPWDbContext(Session["DBName"].ToString()))
                    {
                        PurchasePayment purchase = context.PurchasePayments.FirstOrDefault(x => x.Id == Id);
                        if (purchase != null)
                        {
                            if (string.IsNullOrEmpty(purchase.fileName))
                            {
                                purchase.fileName = filenamelist.FirstOrDefault();
                            }
                            else
                            {
                                if (!purchase.fileName.Split(',').Any(x => x == filenamelist.FirstOrDefault()))
                                {
                                    filenamelist.Add(purchase.fileName);
                                    purchase.fileName = string.Join(",", filenamelist);
                                }
                            }

                            purchase.ModifyTime = DateTime.Now;
                            context.SaveChanges();
                        }
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

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult RemoveFile(string pstCode, string filename)
        {
            string msg = string.Format(Resources.Resource.FileFormat, Resources.Resource.Removed);
            PPWCommonLib.Helpers.FileHelper.Remove(pstCode, filename, FileType.PurchaseOrder);
            return Json(msg);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UploadFile(string filecode)
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    List<string> filenamelist = new List<string>();
                    string filedir = string.Format(UploadsPODir, apId, filecode);//Uploads/PO/{0}/{1}
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
                        PPWDAL.Purchase purchase = context.Purchases.FirstOrDefault(x => x.pstCode == filecode && x.AccountProfileId == apId);
                        if (purchase != null)
                        {
                            if (string.IsNullOrEmpty(purchase.UploadFileName))
                            {
                                purchase.UploadFileName = filenamelist.FirstOrDefault();
                            }
                            else
                            {
                                if (!purchase.UploadFileName.Split(',').Any(x => x == filenamelist.FirstOrDefault()))
                                {
                                    filenamelist.Add(purchase.UploadFileName);
                                    purchase.UploadFileName = string.Join(",", filenamelist);
                                }
                            }

                            purchase.ModifyTime = DateTime.Now;
                            context.SaveChanges();
                        }
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
        [CustomAuthorize("purchase", "boss", "admin", "superadmin")]
        [HttpGet]
        ///Purchase/Review?mode=edit&receiptno=
        public ActionResult Review(string receiptno, int? ireadonly = 1)
        {
            ViewBag.ParentPage = "purchase";
            ViewBag.PageName = "edit";
            PurchaseEditModel model = new PurchaseEditModel(receiptno, ireadonly);
            return View("Edit", model);
        }

        [HandleError]
        [CustomAuthorize("purchase", "boss", "admin", "superadmin")]
        public ActionResult PurchaseOrderList(string strfrmdate = "", string strtodate = "", int? PageNo = 1, string SortName = "pstPromisedDate", string SortOrder = "desc", string Keyword = "", int filter = 0, string searchmode = "")
        {
            ViewBag.ParentPage = "purchase";
            ViewBag.PageName = "purchaseorderlist";
            PurchaseOrderEditModel model = new();
            model.GetPurchaseOrderList(strfrmdate, strtodate, (int)PageNo, SortName, SortOrder, Keyword, filter, searchmode);
            return View(model);
        }


        [HandleError]
        [CustomAuthorize("purchase", "boss", "admin", "superadmin")]
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
        [CustomAuthorize("purchase", "boss", "admin", "superadmin")]
        public ActionResult Index(string strfrmdate = null, string strtodate = null, int SortCol = 4, string SortOrder = "desc", string Keyword = "", int? PageNo = 1)
        {
            SessUser user = Session["User"] as SessUser;
            ViewBag.ParentPage = "purchase";
            ViewBag.PageName = "purchase";
            PurchaseEditModel model = new PurchaseEditModel
            {
                Keyword = Keyword == "" ? null : Keyword
            };
            model.PSList = model.GetList(user, strfrmdate, strtodate, model.Keyword);
            DoList(SortCol, SortOrder, PageNo, model);
            ViewBag.Title = Resources.Resource.Purchase;
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("purchase", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(long Id, string type)
        {
            ViewBag.ParentPage = "purchase";
            ViewBag.PageName = type;
            PurchaseEditModel model = new PurchaseEditModel(Id, type);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("purchase", "boss", "admin", "superadmin")]
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
        [CustomAuthorize("purchase", "boss", "admin", "superadmin")]
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
                model.PSList = sortDirection == "asc" ? model.PSList.OrderBy(c => c.supCode).ThenBy(c => c.pstPromisedDate).ThenBy(c => c.CreateTime).ToList() : model.PSList.OrderByDescending(c => c.supCode).ThenByDescending(c => c.pstPromisedDate).ThenByDescending(c => c.CreateTime).ToList();
            }
            else if (sortColumnIndex == 2)
            {
                model.PSList = sortDirection == "asc" ? model.PSList.OrderBy(c => c.pstLocStock).ThenBy(c => c.pstPromisedDate).ThenBy(c => c.CreateTime).ToList() : model.PSList.OrderByDescending(c => c.pstLocStock).ThenByDescending(c => c.pstPromisedDate).ThenByDescending(c => c.CreateTime).ToList();
            }
            else if (sortColumnIndex == 3)
            {
                model.PSList = sortDirection == "asc" ? model.PSList.OrderBy(c => c.pstStatus).ThenBy(c => c.pstPromisedDate).ThenBy(c => c.CreateTime).ToList() : model.PSList.OrderByDescending(c => c.pstStatus).ThenByDescending(c => c.pstPromisedDate).ThenByDescending(c => c.CreateTime).ToList();
            }
            else if (sortColumnIndex == 4)
            {
                model.PSList = sortDirection == "asc" ? model.PSList.OrderBy(c => c.pstPurchaseDate).ThenBy(c => c.pstPromisedDate).ThenBy(c => c.CreateTime).ToList() : model.PSList.OrderByDescending(c => c.pstPurchaseDate).ThenByDescending(c => c.pstPromisedDate).ThenByDescending(c => c.CreateTime).ToList();
            }
            else if (sortColumnIndex == 5)
            {
                model.PSList = sortDirection == "asc" ? model.PSList.OrderBy(c => c.pstPromisedDate).ThenBy(c => c.pstPromisedDate).ThenBy(c => c.CreateTime).ToList() : model.PSList.OrderByDescending(c => c.pstPromisedDate).ThenByDescending(c => c.pstPromisedDate).ThenByDescending(c => c.CreateTime).ToList();
            }

            if (SortOrder == "desc")
            {
                model.SortOrder = "asc";
            }
            else
            {
                model.SortOrder = "desc";
            }
            model.PagingPSList = model.PSList.ToPagedList(No_Of_Page, Size_Of_Page);
        }
    }
}