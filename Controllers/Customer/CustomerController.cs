using PagedList;
using SmartBusinessWeb.Infrastructure;
using PPWDAL;
using PPWLib.Models;
using PPWLib.Models.Customer;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using CommonLib.App_GlobalResources;
using PPWLib.Helpers;

namespace SmartBusinessWeb.Controllers.Customer
{
    [CustomAuthenticationFilter]
    public class CustomerController : BaseController
    {
        [HttpPost]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        public JsonResult AddToSalesmen(List<int> groupIdList, List<int> salesmanIdList, bool notification)
        {
            var msg = string.Format(Resource.AreAddedToFormat, Resource.Customer, Resource.Salesmen);
            CustomerEditModel model = new CustomerEditModel();
            model.AddToSalesmen(groupIdList, salesmanIdList, notification);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Assign(List<string> CodeList, int salesmanId, int notification)
        {
            var msg = Resource.CustomersAssigned;
            if ((bool)ComInfo.enableEmail4Assignment && notification == 1)
                msg += "<p>" + Resource.NotificationEmailWillBeSentToSalesperson + "</p>";

            string salesmanname = CustomerEditModel.AssignCustomersToSalesman(CodeList, salesmanId, notification);
            msg = string.Format(msg, salesmanname);
            return Json(new { msg });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult RemoveFile(string cusCode, string filename)
        {
            string msg = string.Format(Resources.Resource.FileFormat, Resources.Resource.Removed);
            PPWCommonLib.Helpers.FileHelper.Remove(cusCode, filename, CommonLib.Helpers.FuncType.Customer);
            return Json(msg);
        }


        [HttpPost]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        public JsonResult AddToEblast(List<int> groupIdList, List<int> eblastIdList)
        {
            var msg = string.Format(Resource.AreAddedToFormat, Resource.Customer, Resource.eBlast);
            CustomerEditModel model = new CustomerEditModel();
            model.AddToEblast(groupIdList, eblastIdList);
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
        public ActionResult UploadFile(string cusCode)
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    List<string> FileList = new List<string>();
                    string filedir = string.Format(UploadsCusDir, apId, cusCode);//Cus/{0}/{1}
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
                        var cusInfo = context.CustomerInfoes.FirstOrDefault(x => x.fileName == filename && x.AccountProfileId == apId && x.cusCode == cusCode);
                        if (cusInfo == null)
                        {
                            SessUser user = Session["User"] as SessUser;
                            context.CustomerInfoes.Add(new CustomerInfo
                            {
                                cusCode = cusCode,
                                fileName = FileList.FirstOrDefault(),
                                type = "file",
                                assignedSalesId = user.surUID,
                                CreateBy = user.UserCode,
                                CreateTime = DateTime.Now,
                                AccountProfileId = apId
                            });
                            context.SaveChanges();
                        }
                        FileList = context.CustomerInfoes.Where(x => x.cusCode == cusCode && x.AccountProfileId == apId && x.type == "file").Select(x => x.fileName).Distinct().ToList();
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
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult RemoveCattr(string cusCode, string cattr)
        {
            HashSet<CustomAttribute> cattrlist = CustomAttributeEditModel.Remove(cusCode, cattr);
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

        //SaveGAttr4Combo
        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult SaveGAttr4Combo(string cusCode, GlobalAttributeModel gAttribute)
        {
            var msg = string.Format(Resources.Resource.Saved, Resources.Resource.Attribute);
            CustomerEditModel.SaveGAttr(cusCode, gAttribute);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult SaveGAttr4Txt(string cusCode, GlobalAttributeModel gAttribute)
        {
            var msg = string.Format(Resources.Resource.Saved, Resources.Resource.Attribute);
            CustomerEditModel.SaveGAttr(cusCode, gAttribute);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult SaveCAttr(string cusCode, CustomAttributeModel cAttribute)
        {   
            CustomerEditModel model = new CustomerEditModel();
            model.SaveCAttr(cusCode, cAttribute);
            return Json(new { model.CustomAttributeList });
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult UpdateFollowUpDate(string cusCode, string followupdate)
        {
            CustomerEditModel model = new CustomerEditModel();
            model.UpdateFollowUpDate(cusCode, followupdate);
            var msg = string.Format(Resources.Resource.FollowUpDate, Resources.Resource.SavedOkFormat);
            return Json(msg);
        }

        /// <summary>
        /// Must not use [HttpGet]!!! (due to the parameter type)
        /// </summary>
        /// <param name="advSearchItems"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult AdvancedSearch(List<AdvSearchItem> advSearchItems)
        {
            List<CustomerModel> filteredcusList = CustomerEditModel.GetFilteredList(apId, advSearchItems);
            return Json(filteredcusList);
        }

        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        public ActionResult Index(int PageNo = 1, int PageSize = 10, int SortCol = 4, string SortOrder = "desc", string Keyword = "", int CheckAll = 0, string cusCodes = null)
        {
            ViewBag.ParentPage = "customer";
            if (string.IsNullOrEmpty(Keyword))
                Keyword = null;
            CustomerEditModel model = new CustomerEditModel
            {
                CurrentSortOrder = SortOrder,
                SortCol = SortCol,
                Keyword = Keyword,
                CheckAll = CheckAll,
                SortOrder = SortOrder == "desc" ? "asc" : "desc",
                PageSize = PageSize,
            };

            model.GetList(SortCol, SortOrder, Keyword, null);

            if (cusCodes != null)
            {
                var cusCodeList = cusCodes.Split(',');
                model.CustomerList = model.CustomerList.Where(x => x.AccountProfileId == apId && cusCodeList.Contains(x.cusCode)).ToList();
            }

            model.PagingCustomerList = model.CustomerList.ToPagedList(PageNo, PageSize);
            model.CusIdList = model.CustomerList.Select(x => x.cusCustomerID).ToHashSet();
            model.GlobalAttrList = ModelHelper.GetGlobalAttrList(apId);
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
        public ActionResult Edit(string cusCode = null, string enqId = null, string referrer = "")
        {
            ViewBag.ParentPage = "customer";
            ViewBag.PageName = "edit";
            var region = CommonLib.Helpers.CultureHelper.GetCountryByIP();
            var comInfo = Session["ComInfo"] as ComInfo;

            CustomerEditModel cmodel = new CustomerEditModel(cusCode, enqId)
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
            ViewBag.ParentPage = "customer";
            CustomerEditModel cmodel = new();

            cmodel.Edit(model);
           
            return Json(Resource.CustomerSaved);
        }


        [HandleError]
        [CustomAuthorize("customer", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(string cusCode)
        {
            ViewBag.ParentPage = ViewBag.PageName = "customer";
            CustomerEditModel.Delete(cusCode);
            return Json(new { });
        }


    }
}