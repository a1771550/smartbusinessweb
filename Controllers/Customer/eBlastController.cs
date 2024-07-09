using SmartBusinessWeb.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using PagedList;
using Resources = CommonLib.App_GlobalResources;
using PPWLib.Models;
using System.Net.Mail;
using System.Text;
using System.Net;
using System.Threading;
using System.Configuration;
using CommonLib.Helpers;
using PPWLib.Models.Customer;
using PPWLib.Models.Customer.eBlast;

namespace SmartBusinessWeb.Controllers.Customer
{
    [CustomAuthenticationFilter]
    [HandleError]
    [CustomAuthorize("customer", "admin", "superadmin")]
    public class eBlastController : BaseController
    {
        [HttpGet]
        public JsonResult GetList()
        {
            eBlastEditModel model = new eBlastEditModel
            {                
                SortCol = 0,               
                SortOrder = "desc",
                Keyword = null,
            };
            model.GetList(null,null);
            return Json(model.eBlastList, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetCustomersByBlastId(int blastId)
        {
            List<CustomerModel> contacts = eBlastEditModel.GetCustomersByBlastId(blastId);
            return Json(contacts, JsonRequestBehavior.AllowGet);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpPost]
        public JsonResult SendTestEmail(int Id, string testemail)
        {
            string msg;
            EmailSettingsEditModel model = new EmailSettingsEditModel();
            var mailsettings = model.Get();
            string host = mailsettings.emEmailTrackingURL;
            int blastId = Id;
            eBlastEditModel emodel = new eBlastEditModel();
            emodel.Get(Id);
            emodel.eBlast.blSendTime = DateTime.Now;
            int okcount = 0;
            int ngcount = 0;
            MailAddress frm = new MailAddress(mailsettings.emEmail, mailsettings.emDisplayName);
            MailAddress to = new MailAddress(testemail, string.Format(Resources.Resource.TestFormat, Resources.Resource.eBlast));
            MailMessage message = new MailMessage(frm, to);
            message.Subject = emodel.eBlast.blSubject;
            message.BodyEncoding = Encoding.UTF8;
            message.IsBodyHtml = true;
            string cname = "testemail";

            //string url = string.Format(@"{6}?blastId={0}&cusCode={1}&contactName={2}&organization={3}&phone={4}&email={5}", blastId, "000000", cname, cname, "123456", testemail, host);
            //Track/{blastId}/{cusCode}/{contactName}/{organization}/{phone}/{email}/{companyId}/{imported}/
            string url = string.Format(@"{8}/{0}/{1}/{2}/{3}/{4}/{5}/{6}/{7}/", blastId, "99999999", cname, cname, "67456475", testemail, "12345", "0", host);
            //url = HttpUtility.UrlEncode(url);
            //url = HttpUtility.UrlDecode(url);
            //url = HttpUtility.HtmlDecode(url);
            //url = new MvcHtmlString(url).ToString();
            string img = "<img src='" + url + "' width='1' height='1'>";
            //img = new MvcHtmlString(img).ToHtmlString();
            string mailbody = emodel.eBlast.blContent;
            message.Body = mailbody.Replace("##NAME##", "testemail").Replace("##IMG##", img).Replace("##EMAIL##", testemail);
            //message.Body = HttpUtility.HtmlDecode(message.Body);
            message.BodyEncoding = Encoding.UTF8;

            using (SmtpClient smtp = new SmtpClient(mailsettings.emSMTP_Server, mailsettings.emSMTP_Port))
            {
                smtp.UseDefaultCredentials = false;
                smtp.EnableSsl = mailsettings.emSMTP_EnableSSL;
                smtp.Credentials = new NetworkCredential(mailsettings.emSMTP_UserName, mailsettings.emSMTP_Pass);
                try
                {
                    smtp.Send(message);
                    okcount++;
                }
                catch (Exception)
                {
                    ngcount++;
                }
            }

            msg = okcount >= 1 ? Resources.Resource.eBlastDone : Resources.Resource.eBlastFail;
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        public ActionResult Log(int Id, int SortCol = 0, string SortOrder = "desc", string Keyword = "", int? PageNo = 1)
        {
            ViewBag.ParentPage = ViewBag.PageName = "customer";
            eBlastEditModel model = new eBlastEditModel();
            model.CurrentSortOrder = SortOrder;
            model.Keyword = Keyword;
            List<eBlastModel> blastlist = new List<eBlastModel>();

            blastlist = model.GeteBlastLogs(Id);
            model.SortCol = SortCol;

            int Size_Of_Page = int.Parse(ConfigurationManager.AppSettings["PageLength"]);
            int No_Of_Page = (PageNo ?? 1);

            if (!string.IsNullOrEmpty(Keyword))
            {
                string keyword = Keyword.ToLower();
                blastlist = blastlist.Where(x => x.blSubject.ToLower().Contains(keyword) || x.blContent.ToLower().Contains(keyword)
                                         ).OrderByDescending(x => x.blSendTime).ThenByDescending(x => x.blFinishTime).ToList();
            }
            var sortColumnIndex = SortCol;
            var sortDirection = SortOrder;

            if (sortColumnIndex == 0)
            {
                blastlist = sortDirection == "asc" ? blastlist.OrderBy(c => c.blSubject).ToList() : blastlist.OrderByDescending(c => c.blSubject).ToList();
            }
            else if (sortColumnIndex == 1)
            {
                blastlist = sortDirection == "asc" ? blastlist.OrderBy(c => c.blSendTime).ToList() : blastlist.OrderByDescending(c => c.blSendTime).ToList();
            }
            else if (sortColumnIndex == 2)
            {
                blastlist = sortDirection == "asc" ? blastlist.OrderBy(c => c.blFinishTime).ToList() : blastlist.OrderByDescending(c => c.blFinishTime).ToList();
            }
            else if (sortColumnIndex == 3)
            {
                blastlist = sortDirection == "asc" ? blastlist.OrderBy(c => c.blSendExpected).ToList() : blastlist.OrderByDescending(c => c.blSendExpected).ToList();
            }
            else if (sortColumnIndex == 4)
            {
                blastlist = sortDirection == "asc" ? blastlist.OrderBy(c => c.blSentActual).ToList() : blastlist.OrderByDescending(c => c.blSentActual).ToList();
            }
            if (SortOrder == "desc")
            {
                model.SortOrder = "asc";
            }
            else
            {
                model.SortOrder = "desc";
            }

            model.eBlastPagingList = blastlist.ToPagedList(No_Of_Page, Size_Of_Page);
            model.Keyword = Keyword;

            model.eBlastId = Id;
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpPost]
        public JsonResult Start(int Id)
        {
            string msg;
            EmailSettingsEditModel model = new EmailSettingsEditModel();
            var mailsettings = model.Get();
            string host = Request.IsLocal ? string.Concat("http://", UriHelper.GetLocalIPAddress(), @"/Track") : mailsettings.emEmailTrackingURL;
            //Response.Write(host);
            //return null;
            //string filename = Server.MapPath("~/Static/edmtemplate.html");

            int blastId = Id;
            eBlastEditModel emodel = new eBlastEditModel();
            emodel.Get(Id);
            var eBlast = emodel.eBlast;
            eBlast.blSendTime = DateTime.Now;

            List<CustomerModel> contacts = eBlastEditModel.GetCustomersByBlastId(blastId);

            int okcount = 0;
            int ngcount = 0;
            MailAddress frm = new MailAddress(mailsettings.emEmail, mailsettings.emDisplayName);
            string cname;
            List<string> sentemaillist = new List<string>();

            List<CustomerEblastModel> cusmessages = new List<CustomerEblastModel>();

            foreach (var customer in contacts)
            {
                if (ngcount >= mailsettings.emMaxEmailsFailed)
                {
                    break;
                }
                var email = customer.cusEmail.Trim();
                if (CommonHelper.IsValidEmail(email))
                {
                    cname = customer.cusName ?? customer.cusContact ?? email;
                    var phone = string.IsNullOrEmpty(customer.cusPhone) ? "NA" : customer.cusPhone;
                    MailAddress to = new MailAddress(email, cname);
                    MailMessage message = new MailMessage(frm, to);
                    message.Subject = eBlast.blSubject;
                    message.BodyEncoding = Encoding.UTF8;
                    message.IsBodyHtml = true;

                    //Track/{blastId}/{cusCode}/{contactName}/{organization}/{phone}/{email}/{companyId}/{imported}/
                    string url = string.Format(@"{8}/{0}/{1}/{2}/{3}/{4}/{5}/{6}/{7}/", blastId, customer.cusCode, customer.cusContact, cname, customer.cusPhone, email, 0, 0, host);
                    //url = HttpUtility.UrlEncode(url);
                    string img = $"<img src=\"{url}\" width=\"1\" height=\"1\">";
                    //string mailbody = System.IO.File.ReadAllText(filename);                                    
                    message.Body = eBlast.blContent.Replace("##NAME##", cname).Replace("##IMG##", img).Replace("##CUSCODE##", customer.cusCode);
                    cusmessages.Add(
                        new CustomerEblastModel
                        {
                            cusEmail = email,
                            mailmessage = message
                        }
                        );
                }
            }

            using (SmtpClient smtp = new SmtpClient(mailsettings.emSMTP_Server, mailsettings.emSMTP_Port))
            {
                smtp.UseDefaultCredentials = false;
                smtp.EnableSsl = mailsettings.emSMTP_EnableSSL;
                smtp.Credentials = new NetworkCredential(mailsettings.emSMTP_UserName, mailsettings.emSMTP_Pass);
                foreach (var cusmessage in cusmessages)
                {
                    try
                    {
                        smtp.Send(cusmessage.mailmessage);
                        okcount++;

                        sentemaillist.Add(cusmessage.cusEmail);
                        cname = "";
                        Thread.Sleep(TimeSpan.FromSeconds((int)eBlast.blPause));
                    }
                    catch (Exception)
                    {
                        ngcount++;
                    }
                }
            }

            eBlast.blSendExpected = contacts.Count;
            eBlast.blSentActual = okcount;
            eBlast.blFinishTime = DateTime.Now;
            eBlast.blSentList = string.Join(",", sentemaillist);
            eBlastEditModel.AddLog(eBlast);

            Session["eBlastId"] = blastId;
            msg = Resources.Resource.eBlastDone;
            return Json(new { msg });
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, int SortCol = 2, string SortOrder = "desc", string Keyword = "", string strfrmdate = "", string strtodate = "")
        {
            ViewBag.ParentPage = "promotion";
            ViewBag.PageName = "eBlast";
            eBlastEditModel model = new eBlastEditModel{
                CurrentSortOrder = SortOrder,
                SortCol = SortCol,
                Keyword = Keyword,
                SortOrder = SortOrder == "desc" ? "asc" : "desc",
                PageSize = PageSize,
            };       

            model.GetList(strfrmdate, strtodate);            

            model.eBlastPagingList = model.eBlastList.ToPagedList(PageNo, PageSize);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Create()
        {
            ViewBag.ParentPage = "eBlast";
            ViewBag.PageName = "add";
            eBlastEditModel model = new eBlastEditModel();
            return View("Edit", model);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Create(eBlastModel model)
        {
            ViewBag.ParentPage = ViewBag.PageName = "customer";
            eBlastEditModel.Add(model);
            string msg = Resources.Resource.Saved;
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int Id)
        {
            ViewBag.ParentPage = "eBlast";
            ViewBag.PageName = "edit";
            eBlastEditModel model = new eBlastEditModel();
            model.eBlast = eBlastEditModel.GetEblastById(Id);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(eBlastModel model)
        {
            ViewBag.ParentPage = ViewBag.PageName = "customer";
            eBlastEditModel.Edit(model);
            string msg = Resources.Resource.Saved;
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int Id)
        {
            ViewBag.ParentPage = ViewBag.PageName = "customer";
            eBlastEditModel.Delete(Id);
            return Json(new { });
        }

        [HandleError]
        [CustomAuthorize("customer", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Detail(int Id)
        {
            eBlastEditModel model = new eBlastEditModel();
            model.Get(Id);           
            return Json(model.eBlast, JsonRequestBehavior.AllowGet);
        }
    }
}