using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Resource = CommonLib.App_GlobalResources.Resource;
using System.Configuration;
using SBLib.Models;
using SmartBusinessWeb.Infrastructure;
using Dapper;
using DAL;
using System.IO;
using System.Web;
using System;
using CommonLib.Helpers;
using SBLib.Models.Customer;
using SBLib.Models.Customer.Enquiry;

namespace SmartBusinessWeb.Controllers.Customer.Enquiry
{
    [CustomAuthenticationFilter]
    public class EnquiryController : BaseController
    {
        [HttpPost]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        public JsonResult AddToSalesmen(List<int> groupIdList, int salesmanId, bool notification)
        {
            var msg = string.Format(Resource.AreAddedToFormat, Resource.Enquiry, Resource.Salesmen);
            EnquiryEditModel model = new EnquiryEditModel();
            model.AddToSalesmen(groupIdList, salesmanId, notification);
            return Json(msg);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult RemoveFile(string enqId, string filename)
        {
            string msg = string.Format(Resource.FileFormat, Resource.Removed);
            SBCommonLib.Helpers.FileHelper.Remove(enqId, filename, FuncType.Enquiry);
            return Json(msg);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UploadFile(string enqId)
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    List<string> FileList = new List<string>();
                    string filedir = string.Format(UploadsEnqDir, apId, enqId);//Enq/{0}/{1}
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
                        var enqInfo = context.EnquiryInfoes.FirstOrDefault(x => x.fileName == filename && x.AccountProfileId == apId && x.enId == enqId);
                        if (enqInfo == null)
                        {
                            SessUser user = Session["User"] as SessUser;
                            var Id = CommonHelper.GenerateNonce(152, false);                        
                            context.EnquiryInfoes.Add(new EnquiryInfo
                            {
                                Id = Id,
                                enId = enqId,
                                fileName = FileList.FirstOrDefault(),
                                type = "file",
                                CreateBy = user.UserCode,
                                CreateTime = DateTime.Now,
                                AccountProfileId = apId,
                            });
                            context.SaveChanges();
                        }
                        FileList = context.EnquiryInfoes.Where(x => x.enId == enqId && x.AccountProfileId == apId && x.type == "file").Select(x => x.fileName).Distinct().ToList();
                    }                   
                    return Json(new { msg = Resource.UploadOkMsg, FileList });
                }
                catch (Exception ex)
                {
                    return Json(new { msg = "Error occurred. Error details: " + ex.Message });
                }
            }
            else
            {
                return Json(new { msg = Resource.NoFileSelected });
            }
        }


        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult DeleteRecord(EnquiryInfoModel model)
        {
            EnquiryEditModel.DeleteRecord(model);
            return Json(Resource.Removed);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult EditRecord(EnquiryInfoModel model)
        {
            SessUser user = Session["User"] as SessUser;
            model = EnquiryEditModel.EditRecord(user.UserCode, model);
            return Json(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult SaveRecord(EnquiryInfoModel model)
        {
            SessUser user = Session["User"] as SessUser;
            List<EnquiryInfoModel> records = EnquiryEditModel.SaveRecord(user.UserCode, model);
            return Json(records);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        public ActionResult AddToEnquiry(string enqId, int overwrite = 0)
        {
            CustomerEditModel model = new CustomerEditModel();
            model.ConvertFrmEnquiry(apId, enqId, overwrite == 1);
            return RedirectToAction("Index", "CustomerAS");
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Assign(List<string> assignEnqIdList, int salesmanId, int notification)
        {
            var msg = Resource.EnquiryAssigned;
            if ((bool)ComInfo.enableEmail4Assignment && notification == 1)
                msg += "<p>" + Resource.NotificationEmailWillBeSentToSalesperson + "</p>";

            string salesmanname = EnquiryEditModel.AssignEnquiriesToSalesman(assignEnqIdList, salesmanId, apId, notification);
            msg = string.Format(msg, salesmanname);
            return Json(new { msg });
        }

        [HttpGet]
        public JsonResult GetEnquiries(int pageIndex = 1, int sortCol = 8, string sortDirection = "desc", string keyword = "")
        {
            using var connection = new Microsoft.Data.SqlClient.SqlConnection(DefaultConnection);
            connection.Open();
            if (string.IsNullOrEmpty(keyword)) keyword = null;

            int pageSize = int.Parse(ConfigurationManager.AppSettings["MGTPageSize"]);
            int startIndex = CommonHelper.GetStartIndex(pageIndex, pageSize);          

            List<EnquiryModel> pagingEnqList = connection.Query<EnquiryModel>(@"EXEC dbo.GetEnquiries1 @apId=@apId,@sortCol=@sortCol,@sortOrder=@sortOrder,@startIndex=@startIndex,@pageSize=@pageSize,@keyword=@keyword", new { apId, sortCol, sortOrder = sortDirection, startIndex, pageSize, keyword }).ToList();

            return Json(new { pagingEnqList }, JsonRequestBehavior.AllowGet);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        public ActionResult Index()
        {
            ViewBag.ParentPage = "customer";
            ViewBag.PageName = "enquiry";
            EnquiryEditModel model = new EnquiryEditModel();
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        public ViewResult Add()
        {
            ViewBag.ParentPage = "customer";
            ViewBag.PageName = "enquiry";
            EnquiryModel model = new EnquiryModel();
            return View("Edit", model);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        public ViewResult Edit(string Id)
        {
            ViewBag.ParentPage = "customer";
            ViewBag.PageName = "enquiry";
            EnquiryModel model = EnquiryEditModel.Get(Id);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        public JsonResult Edit(EnquiryModel model)
        {
            string msg = string.Format(Resource.Saved, Resource.Enquiry);
            EnquiryEditModel.SaveEnquiry(model);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        public JsonResult Save(List<EnquiryModel> model)
        {
            ViewBag.ParentPage = "customer";
            ViewBag.PageName = "enquiry";
            string msg = string.Format(Resource.Saved, Resource.Enquiry);
            EnquiryEditModel.Save(model);
            return Json(new { msg });
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Delete(string enqId)
        {
            EnquiryEditModel.Delete(enqId);
            return Json(Resource.Removed);
        }
        public ActionResult Error(string message, string debug)
        {
            Flash(message, debug);
            return RedirectToAction("Index");
        }
    }
}