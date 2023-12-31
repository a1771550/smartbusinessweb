﻿using SmartBusinessWeb.Infrastructure;
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
        public ActionResult UploadFile(int supId)
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    List<string> filenamelist = new List<string>();
                    string filedir = string.Format(UploadsSupDir, apId, supId);//Sup/{0}/{1}
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
                        filenamelist.Add(filename);
                    }
                    using (var context = new PPWDbContext(Session["DBName"].ToString()))
                    {
                        SessUser user = Session["User"] as SessUser;
                        SupplierInfo supInfo = new SupplierInfo
                        {
                            supId = supId,
                            fileName = filenamelist.FirstOrDefault(),
                            type = "file",
                            CreateBy = user.UserCode,
                            CreateTime = DateTime.Now,
                            AccountProfileId = apId
                        };
                        context.SupplierInfoes.Add(supInfo);
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
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        public ActionResult Index(int SortCol = 4, string SortOrder = "desc", string Keyword = "", int? PageNo = 1)
        {
            ViewBag.ParentPage = "purchase";
            ViewBag.PageName = "supplier";
            SupplierEditModel model = new SupplierEditModel
            {
                CurrentSortOrder = SortOrder,
                Keyword = Keyword == "" ? null : Keyword,
                SortCol = SortCol,
            };
            int Size_Of_Page = PageSize;
            int No_Of_Page = (PageNo ?? 1);
            var sortColumnIndex = SortCol;
            var sortDirection = SortOrder;

            model.GetList();

            if (sortColumnIndex == 0)
            {
                model.SupplierList = sortDirection == "asc" ? model.SupplierList.OrderBy(c => c.supName).ToList() : model.SupplierList.OrderByDescending(c => c.supName).ToList();
            }
            else if (sortColumnIndex == 1)
            {
                model.SupplierList = sortDirection == "asc" ? model.SupplierList.OrderBy(c => c.supEmail).ToList() : model.SupplierList.OrderByDescending(c => c.supEmail).ToList();
            }
            else if (sortColumnIndex == 2)
            {
                model.SupplierList = sortDirection == "asc" ? model.SupplierList.OrderBy(c => c.supPhone).ToList() : model.SupplierList.OrderByDescending(c => c.supPhone).ToList();
            }
            else if (sortColumnIndex == 3)
            {
                model.SupplierList = sortDirection == "asc" ? model.SupplierList.OrderBy(c => c.supContact).ToList() : model.SupplierList.OrderByDescending(c => c.supContact).ToList();
            }
            else if (sortColumnIndex == 4)
            {
                model.SupplierList = sortDirection == "asc" ? model.SupplierList.OrderBy(c => c.CreateTime).ToList() : model.SupplierList.OrderByDescending(c => c.CreateTime).ToList();
            }

            if (SortOrder == "desc")
            {
                model.SortOrder = "asc";
            }
            else
            {
                model.SortOrder = "desc";
            }

            model.PagingSupplierList = model.SupplierList.ToPagedList(No_Of_Page, Size_Of_Page);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int Id)
        {
            ViewBag.ParentPage = "purchase";
            ViewBag.PageName = "supplieredit";
            SupplierEditModel model = new SupplierEditModel(Id);
            return View(model.Supplier);
        }

        [HandleError]
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
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
        [CustomAuthorize("item", "boss", "admin", "superadmin")]
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