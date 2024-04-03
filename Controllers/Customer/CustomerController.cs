using KingdeeLib.Models.Sales;
using PagedList;
using SmartBusinessWeb.Infrastructure;
using PPWDAL;
using PPWLib.Helpers;
using PPWLib.Models;
using PPWLib.Models.Customer;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ActionLogModel = PPWLib.Models.ActionLogModel;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Customer
{
    [CustomAuthenticationFilter]
    public class CustomerController : BaseController
    {

        [HttpPost]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        public JsonResult AddToEblast(List<int> contactIds)
        {
            var msg = string.Format(Resources.Resource.AreAddedToFormat, Resources.Resource.Contact, Resources.Resource.eBlast);
            ContactEditModel model = new ContactEditModel();
            model.AddToEblast(contactIds);

            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult DeleteRecord(CustomerInfoModel model)
        {
            CustomerEditModel.DeleteRecord(model);
            return Json(Resources.Resource.Removed);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult EditRecord(CustomerInfoModel model)
        {
            SessUser user = Session["User"] as SessUser;
            model = CustomerEditModel.EditRecord(user.UserCode, model);
            return Json(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult SaveRecord(CustomerInfoModel model)
        {
            SessUser user = Session["User"] as SessUser;
            List<CustomerInfoModel> records = CustomerEditModel.SaveRecord(apId, user.UserCode, model);
            return Json(records);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UploadFile(int cusId)
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    List<string> filenamelist = new List<string>();
                    string filedir = string.Format(UploadsCusDir, apId, cusId);//Cus/{0}/{1}
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
                        CustomerInfo cusInfo = new CustomerInfo
                        {
                            cusId = cusId,
                            fileName = filenamelist.FirstOrDefault(),
                            type = "file",
                            CreateBy = user.UserCode,
                            CreateTime = DateTime.Now,
                            AccountProfileId = apId
                        };
                        context.CustomerInfoes.Add(cusInfo);
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
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult RemoveCattr(int cusId, string cattr)
        {
            HashSet<CustomAttribute> cattrlist = CustomAttributeEditModel.Remove(apId, cusId, cattr);
            return Json(cattrlist);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult UpdateGattrName(GlobalAttributeModel gattr)
        {
            CustomAttributeEditModel.UpdateGattrName(apId, ref gattr);
            return Json(gattr);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult SaveAttr(int customerId, List<GlobalAttributeModel> gAttributes, List<CustomAttributeView> cAttributes)
        {
            var msg = string.Format(Resources.Resource.Saved, Resources.Resource.Attribute);
            CustomerEditModel.SaveAttr(apId, customerId, gAttributes, cAttributes);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult UpdateFollowUpDate(int customerId, string followupdate)
        {
            CustomerEditModel model = new CustomerEditModel();
            model.UpdateFollowUpDate(customerId, followupdate);
            var msg = string.Format(Resources.Resource.FollowUpDate, Resources.Resource.SavedOkFormat);
            return Json(msg);
        }

        [HttpPost]
        public ActionResult AdvancedSearch(List<AdvSearchItem> advSearchItems)
        {
            List<CustomerModel> filteredcusList = CustomerEditModel.GetFilteredList(apId, advSearchItems);
            return Json(filteredcusList);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        public ActionResult Index(int SortCol = 4, string SortOrder = "desc", string Keyword = "", int PageNo = 1, int? CheckAll = 0, int SortCol_a = 0, string SortOrder_a = "desc", string Keyword_a = "", int PageNo_a = 1, string cusIds = null)
        {
            ViewBag.ParentPage = ViewBag.PageName = "customer";
            if (string.IsNullOrEmpty(Keyword))
                Keyword = null;
            CustomerEditModel model = new CustomerEditModel
            {
                CurrentSortOrder = SortOrder,
                SortCol = SortCol,
                Keyword = Keyword,
                CheckAll = CheckAll,
                CurrentSortOrder_a = SortOrder_a,
                Keyword_a = Keyword_a,
            };
            List<ActionLogModel> actionloglist = new List<ActionLogModel>();
            List<int> cusIdList = new List<int>();
            var apId = ComInfo.AccountProfileId;

            model.GetList(SortCol, SortOrder, Keyword, null);

            if (cusIds != null)
            {
                var _cusIdList = cusIds.Split(',');
                model.CustomerList = model.CustomerList.Where(x => _cusIdList.Contains(x.cusCustomerID.ToString())).ToList();
            }

            using var context = new PPWDbContext(Session["DBName"].ToString());
            actionloglist = (from a in context.ActionLogs
                             where a.actName.ToLower() == "customerpoints" && a.actType.ToLower() == "edit"
                             select new ActionLogModel
                             {
                                 actName = a.actName,
                                 actType = a.actType,
                                 actUserCode = a.actUserCode,
                                 actOldValue = a.actOldValue,
                                 actNewValue = a.actNewValue,
                                 actRemark = a.actRemark,
                                 actLogTime = a.actLogTime,
                                 actCusCode = a.actCusCode
                             }
                      ).OrderByDescending(x => x.actLogTime).ToList();


            model.SortCol_a = SortCol_a;
            var sortColumnIndex_a = SortCol_a;
            var sortDirection_a = SortOrder_a;
            if (sortColumnIndex_a == 0)
            {
                actionloglist = sortDirection_a == "asc" ? actionloglist.OrderBy(c => c.actUserCode).ToList() : actionloglist.OrderByDescending(c => c.actUserCode).ToList();
            }
            else if (sortColumnIndex_a == 1)
            {
                actionloglist = sortDirection_a == "asc" ? actionloglist.OrderBy(c => c.actLogTime).ToList() : actionloglist.OrderByDescending(c => c.actLogTime).ToList();
            }

            model.SortOrder_a = SortOrder_a == "desc" ? "asc" : "desc";
            model.SortOrder = SortOrder == "desc" ? "asc" : "desc";

            model.PagingCustomerList = model.CustomerList.ToPagedList(PageNo, PageSize);
            model.CusIdList = model.CustomerList.Select(x => x.cusCustomerID).ToHashSet();

            model.ActionLogList = actionloglist.ToPagedList(PageNo_a, PageSize);

            model.GlobalAttrList = CustomerEditModel.GetGlobalAttrList(apId);
            model.GlobalAttrList.Add(new GlobalAttributeModel
            {
                gattrId = "custom",
                attrType = "custom",
                attrName = Resources.Resource.CustomAttribute,
                attrOrder = 34
            });
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int Id = 0, string enqId = null, string referrer = "")
        {
            ViewBag.ParentPage = "customer";
            ViewBag.PageName = "edit";
            var region = CommonLib.Helpers.CultureHelper.GetCountryByIP();
            var comInfo = Session["ComInfo"] as ComInfo;

            CustomerEditModel cmodel = new CustomerEditModel(Id, enqId)
            {
                Referrer = referrer,
                IpCountry = region != null ? region.EnglishName : "Hong Kong",
                enableCRM = (bool)comInfo.enableCRM
            };
            return View(cmodel);

        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Edit(CustomerModel model)
        {
            ViewBag.ParentPage = ViewBag.PageName = "customer";
            CustomerEditModel cmodel = new();

            cmodel.Edit(model);

            string msg = Resources.Resource.CustomerSaved;
            return Json(msg);
        }


        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int customerId)
        {
            ViewBag.ParentPage = ViewBag.PageName = "customer";
            CustomerEditModel.Delete(customerId);
            return Json(new { });
        }


    }
}