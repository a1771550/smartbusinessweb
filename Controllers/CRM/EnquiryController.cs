﻿using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Resource = CommonLib.App_GlobalResources.Resource;
using System.Configuration;
using PPWLib.Models;
using SmartBusinessWeb.Infrastructure;
using Dapper;
using PPWLib.Models.CRM.Enquiry;
using PPWDAL;
using System.IO;
using System.Web;
using System;
using CommonLib.Helpers;

namespace SmartBusinessWeb.Controllers
{
    [CustomAuthenticationFilter]
    public class EnquiryController : BaseController
    {
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UploadFile(string enqId)
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    List<string> filenamelist = new List<string>();
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
                        filenamelist.Add(filename);
                    }
                    using (var context = new PPWDbContext(Session["DBName"].ToString()))
                    {
                        SessUser user = Session["User"] as SessUser;
                        var Id = CommonHelper.GenerateNonce(152, false);
                        EnquiryInfo enqInfo = new EnquiryInfo
                        {
                            Id = Id,
                            enId = enqId,
                            fileName = filenamelist.FirstOrDefault(),
                            type = "file",
                            CreateBy = user.UserCode,
                            CreateTime = DateTime.Now,
                        };
                        context.EnquiryInfoes.Add(enqInfo);
                        context.SaveChanges();
                    }
                    dir = string.Concat(@"/", filedir);
                    //string filepath = Path.Combine(dir, string.Format(file, ext));
                    string filepath = Path.Combine(dir, filename);
                    return Json(new { msg = Resource.UploadOkMsg, filepath });
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
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult DeleteRecord(EnquiryInfoModel model)
        {
            EnquiryEditModel.DeleteRecord(model);
            return Json(Resource.Removed);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult EditRecord(EnquiryInfoModel model)
        {
            SessUser user = Session["User"] as SessUser;
            model = EnquiryEditModel.EditRecord(user.UserCode, model);
            return Json(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult SaveRecord(EnquiryInfoModel model)
        {
            SessUser user = Session["User"] as SessUser;
            List<EnquiryInfoModel> records = EnquiryEditModel.SaveRecord(user.UserCode, model);
            return Json(records);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]   
        public ActionResult AddToContact(string enqId, int overwrite=0)
        {                    
            ContactEditModel model = new ContactEditModel();
            model.ConvertFrmEnquiry(apId, enqId, overwrite == 1);
            return RedirectToAction("Index", "Customer");
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Assign(List<string> assignEnqIdList, int salesmanId, int notification)
        {
            var msg = Resource.EnquiryAssigned;      
            if((bool)ComInfo.enableEmail4Assignment&&notification==1)
                msg += "<p>" + Resource.NotificationEmailWillBeSentToSalesperson + "</p>";

            string salesmanname = EnquiryEditModel.AssignEnquiriesToSalesman(assignEnqIdList, salesmanId, apId, notification);
            msg = string.Format(msg, salesmanname);
            return Json(new { msg });
        }

        [HttpGet]
        public JsonResult GetEnquiries(string frmdate, string todate, int pageIndex=1, int sortCol=8, string sortDirection="desc", string keyword = "")
        {            
            using var connection = new Microsoft.Data.SqlClient.SqlConnection(DefaultConnection);
            connection.Open();
            if (string.IsNullOrEmpty(keyword)) keyword = null;
            //todate = CommonHelper.FormatDate(CommonHelper.GetDateFrmString4SQL(todate).AddDays(-1), DateFormat.YYYYMMDD);
            List<EnquiryModel> enquirylist = connection.Query<EnquiryModel>(@"EXEC dbo.GetEnquiries1 @apId=@apId,@frmdate=@frmdate,@todate=@todate,@keyword=@keyword", new { apId, frmdate, todate, keyword }).ToList();
            int pagesize= int.Parse(ConfigurationManager.AppSettings["EnquiryPageSize"]);
            int skip = (pageIndex - 1) * pagesize;   
            List<EnquiryModel> pagingEnqList = new List<EnquiryModel>();

            #region Sorting
            switch (sortCol)
            {
                case 0:
                    pagingEnqList = sortDirection.ToLower() == "desc" ? enquirylist.OrderByDescending(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList() : enquirylist.OrderBy(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList();
                    break;
                case 1:
                    pagingEnqList = sortDirection.ToLower() == "desc" ? enquirylist.OrderByDescending(x => x.enSubject).ThenByDescending(x=>x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList() : enquirylist.OrderBy(x => x.enSubject).ThenBy(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList();
                    break;
                case 2:
                    pagingEnqList = sortDirection.ToLower() == "desc" ? enquirylist.OrderByDescending(x => x.enFrom).ThenByDescending(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList() : enquirylist.OrderBy(x => x.enFrom).ThenBy(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList();
                    break;
                case 3:
                    pagingEnqList = sortDirection.ToLower() == "desc" ? enquirylist.OrderByDescending(x => x.enEmail).ThenByDescending(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList() : enquirylist.OrderBy(x => x.enEmail).ThenBy(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList();
                    break;
                case 4:
                    pagingEnqList = sortDirection.ToLower() == "desc" ? enquirylist.OrderByDescending(x => x.enPhone).ThenByDescending(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList() : enquirylist.OrderBy(x => x.enPhone).ThenBy(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList();
                    break;
                case 5:
                    pagingEnqList = sortDirection.ToLower() == "desc" ? enquirylist.OrderByDescending(x => x.enOrganization).ThenByDescending(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList() : enquirylist.OrderBy(x => x.enOrganization).ThenBy(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList();
                    break;
                case 6:
                    pagingEnqList = sortDirection.ToLower() == "desc" ? enquirylist.OrderByDescending(x => x.enContact).ThenByDescending(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList() : enquirylist.OrderBy(x => x.enContact).ThenBy(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList();
                    break;
                case 7:
                    pagingEnqList = sortDirection.ToLower() == "desc" ? enquirylist.OrderByDescending(x => x.FollowUpDate).ThenByDescending(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList() : enquirylist.OrderBy(x => x.FollowUpDate).ThenBy(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList();
                    break;                           
                case 9:
                    pagingEnqList = sortDirection.ToLower() == "desc" ? enquirylist.OrderByDescending(x => x.SalesPersonName).ThenByDescending(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList() : enquirylist.OrderBy(x => x.SalesPersonName).ThenBy(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList();
                    break;
                default:
                case 8:
                    pagingEnqList = sortDirection.ToLower() == "desc" ? enquirylist.OrderByDescending(x => x.FollowUpDate).ThenByDescending(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList(): enquirylist.OrderBy(x => x.FollowUpDate).ThenBy(x => x.enReceivedDateTime).Skip(skip).Take(pagesize).ToList();
                    break;
            }
            #endregion

            return Json(new { pagingEnqList, totalRecord=enquirylist.Count }, JsonRequestBehavior.AllowGet);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        public ActionResult Index(string Keyword = "", string strfrmdate = "", string strtodate = "")
        {
            ViewBag.ParentPage = "customer";
            ViewBag.PageName = "enquiry";            
            EnquiryEditModel model = new EnquiryEditModel(strfrmdate, strtodate, Keyword);            
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        public ViewResult Add()
        {
            ViewBag.ParentPage = "customer";
            ViewBag.PageName = "enquiry";
            EnquiryModel model = new EnquiryModel();
            return View("Edit", model);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        public ViewResult Edit(string Id)
        {
            ViewBag.ParentPage = "customer";
            ViewBag.PageName = "enquiry";
            EnquiryModel model = EnquiryEditModel.Get(Id);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
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
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        public JsonResult Save(List<EnquiryModel> model, string frmdate, string todate)
        {
            ViewBag.ParentPage = "customer";
            ViewBag.PageName = "enquiry";
            string msg = string.Format(Resource.Saved, Resource.Enquiry);
            EnquiryEditModel.Save(model, frmdate, todate, apId);
            return Json(new { msg });
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
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