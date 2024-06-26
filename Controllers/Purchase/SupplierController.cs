using SmartBusinessWeb.Infrastructure;
using PPWLib.Models.Purchase.Supplier;
using System.Web.Mvc;
using PagedList;
using Resources = CommonLib.App_GlobalResources;
using System.Linq;
using PPWDAL;
using PPWLib.Models;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System;

namespace SmartBusinessWeb.Controllers.Purchase
{
    [CustomAuthenticationFilter]
    public class SupplierController : BaseController
    {
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult RemoveFile(string supCode, string filename)
        {
            string msg = string.Format(Resources.Resource.FileFormat, Resources.Resource.Removed);
            PPWCommonLib.Helpers.FileHelper.Remove(supCode, filename, CommonLib.Helpers.FuncType.Supplier);
            return Json(msg);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UploadFile(string supCode)
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    List<string> FileList = new List<string>();
                    string filedir = string.Format(UploadsSupDir, apId, supCode);//Sup/{0}/{1}
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
                        var supInfo = context.SupplierInfoes.FirstOrDefault(x => x.fileName == filename && x.AccountProfileId == apId && x.supCode==supCode);
                        if (supInfo == null)
                        {
                            SessUser user = Session["User"] as SessUser;
                            supInfo = new SupplierInfo
                            {
                                supCode = supCode,
                                fileName = FileList.FirstOrDefault(),
                                type = "file",
                                CreateBy = user.UserCode,
                                CreateTime = DateTime.Now,
                                AccountProfileId = apId
                            };
                            context.SupplierInfoes.Add(supInfo);
                            context.SaveChanges();
                        }
                        
                        FileList = context.SupplierInfoes.Where(x => x.AccountProfileId==apId && x.type=="file" && x.supCode == supCode).Select(x => x.fileName).Distinct().ToList();
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
        [CustomAuthorize("item", "admin", "superadmin")]
        public ActionResult Index(int SortCol = 4, string SortOrder = "desc", string Keyword = "", int PageNo = 1)
        {
            ViewBag.ParentPage = "purchase";
            ViewBag.PageName = "supplier";
            SupplierEditModel model = new SupplierEditModel
            {
                CurrentSortOrder = SortOrder,
                Keyword = Keyword == "" ? null : Keyword,
                SortCol = SortCol,
            };

            model.GetList(SortCol, SortOrder, Keyword, PageNo);
            model.SortOrder = (SortOrder == "desc") ? "asc" : "desc";
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int Id)
        {
            ViewBag.ParentPage = "purchase";
            ViewBag.PageName = "supplieredit";
            SupplierEditModel model = new SupplierEditModel(Id);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(SupplierModel model)
        {
            ViewBag.ParentPage = "purchase";
            ViewBag.PageName = "supplieredit";
            SupplierEditModel.Edit(model);
            string msg = string.Format(Resources.Resource.SavedOkFormat, string.Format(Resources.Resource.PurchaseFormat, Resources.Resource.Stock));
            return Json(msg);
        }

        public JsonResult Detail(int Id)
        {
            SupplierEditModel emodel = new SupplierEditModel(Id);
            emodel.Get(Id);
            return Json(emodel.Supplier, JsonRequestBehavior.AllowGet);
        }

        [HandleError]
        [CustomAuthorize("item", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int Id)
        {
            ViewBag.ParentPage = "purchase";
            ViewBag.PageName = "supplierdelete";
            SupplierEditModel.Delete(Id);
            return Json(new { });
        }
    }
}