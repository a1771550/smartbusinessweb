using CommonLib.Models;
using PPWDAL;
using PPWLib.Helpers;
using SmartBusinessWeb.Infrastructure;
using PPWLib.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using CommonLib.Helpers;
using PPWLib.Models.Settings;

namespace SmartBusinessWeb.Controllers.Settings
{
    [CustomAuthenticationFilter]
    public class OtherSettingsController : BaseController
    {
        //[HandleError]
        //[CustomAuthorize("othersettings", "boss", "admin", "superadmin")]
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public JsonResult Duty(DutyModel model)
        //{  
        //    DutyEditModel.Save(model);
        //    return Json(string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.Duty));
        //}

        //[HandleError]
        //[CustomAuthorize("othersettings", "boss", "admin", "superadmin")]
        //public ActionResult Duty()
        //{
        //    ViewBag.ParentPage = "setup";          
        //    DutyEditModel model = new DutyEditModel();
        //    model.Get();
        //    return View(model);
        //}

        [HandleError]
        [CustomAuthorize("othersettings", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult ExchangeRate(Dictionary<string,decimal> model, int useapi=0)
        {
            var msg = string.Format(Resources.Resource.SavedOkFormat,Resources.Resource.ExchangeRate);
            msg = string.Concat(msg, " ", Resources.Resource.NextLoginEffectiveRemark);
            ExchangeRateEditModel.Save(model, useapi, apId);
            return Json(msg);
        }

        [HandleError]
        [CustomAuthorize("othersettings", "boss", "admin", "superadmin")]
        public ActionResult ExchangeRate()
        {
            ViewBag.ParentPage = "setup";          
            ExchangeRateEditModel model = new ExchangeRateEditModel();
            return View(model);
        }

        
        [HandleError]
        [CustomAuthorize("othersettings", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UploadLogo()
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    var comInfo = Session["ComInfo"] as ComInfo;
                    string logodir = string.Format(ReceiptLogoDir, comInfo.CompanyCode);//Uploads/ReceiptLogo/{0}/
                    string dir = "";
                    string ext = "";
                    string logo = "logo{0}";
                    HttpFileCollectionBase files = Request.Files;
                    for (int i = 0; i < files.Count; i++)
                    {
                        string filename = Path.GetFileName(Request.Files[i].FileName);
                        HttpPostedFileBase file = files[i];
                        FileInfo fi = new FileInfo(filename);
                        ext = fi.Extension;
                        dir = string.Concat(@"~/", logodir);
                        var absdir = Server.MapPath(dir);
                        if (!Directory.Exists(absdir))
                        {
                            Directory.CreateDirectory(absdir);
                        }
                        string fname = Path.Combine(absdir, string.Format(logo, ext));
                        file.SaveAs(fname);
                    }
                    using (var context = new PPWDbContext(Session["DBName"].ToString()))
                    {
                        AppParam logofile = context.AppParams.FirstOrDefault(x => x.appParam == "ReceiptLogoFileName");
                        string filename = string.Format(logo, ext);
                        logofile.appVal = filename;
                        ComInfo _comInfo = context.ComInfoes.FirstOrDefault(x => x.Id == comInfo.Id);
                        _comInfo.ReceiptLogoUrl = ReceiptHelper.ReceiptLogoUrl(_comInfo.CompanyCode, filename);
                        context.SaveChanges();
                    }
                    dir = string.Concat(@"/", logodir);
                    string imgpath = Path.Combine(dir, string.Format(logo, ext));
                    return Json(new { msg = Resources.Resource.UploadOkMsg, imgpath });
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
        [CustomAuthorize("othersettings", "boss", "admin", "superadmin")]
        public ActionResult Index()
        {
            ViewBag.ParentPage = "setup";
            ViewBag.PageName = "othersettings";
            int apId = ComInfo.AccountProfileId;

            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                OtherSettingsModel model = new OtherSettingsModel();
                model.Device = Session["Device"] as DeviceModel;

                List<OtherSettingsView> otherSettings = new List<OtherSettingsView>();

                foreach (string printer in PrintHelper.InstalledPrinters())
                {
                    model.Printers.Add(printer);
                }
                int lang = (int)Session["CurrentCulture"];
                string defaultsalesnotetxt = string.Empty;
                otherSettings = (from os in context.AppParams
                                 where os.appIsActive == true && os.AccountProfileId == apId
                                 select new OtherSettingsView
                                 {
                                     appUID = os.appUID,
                                     appParam = os.appParam,
                                     appVal = os.appVal,
                                     appIsActive = os.appIsActive,
                                     DisplayText = os.appParamEng.Trim() + ":" + os.appParamChs.Trim() + ":" + os.appParamCht.Trim(),
                                     AccountProfileId = apId,
                                 }).ToList();

                switch (lang)
                {
                    case 2:
                        foreach (var os in otherSettings)
                        {
                            os.DisplayText = os.DisplayText.Split(':')[0];
                        }
                        defaultsalesnotetxt = context.AppParams.FirstOrDefault(x => x.appParam.ToLower() == "defaultsalesnotestxteng" && x.AccountProfileId == apId).appVal;
                        break;
                    case 1:
                        foreach (var os in otherSettings)
                        {
                            os.DisplayText = os.DisplayText.Split(':')[1];
                        }
                        defaultsalesnotetxt = context.AppParams.FirstOrDefault(x => x.appParam.ToLower() == "defaultsalesnotestxtchs" && x.AccountProfileId == apId).appVal;
                        break;
                    default:
                    case 0:
                        foreach (var os in otherSettings)
                        {
                            os.DisplayText = os.DisplayText.Split(':')[2];
                        }
                        defaultsalesnotetxt = context.AppParams.FirstOrDefault(x => x.appParam.ToLower() == "defaultsalesnotestxtcht" && x.AccountProfileId == apId).appVal;
                        break;
                }

                model.OtherSettings = otherSettings.ToList();
                var defaultnotesetting = otherSettings.FirstOrDefault(x => x.appParam == "DefaultSalesNotes" && x.AccountProfileId == apId);
                if (defaultnotesetting != null)
                {
					bool usedefaultnote = defaultnotesetting.appVal == "1";
					model.DefaultSalesNotes = usedefaultnote;
                    if(model.DefaultSalesNotes) model.DefaultSalesNoteTxt = defaultsalesnotetxt;					
					model.UseDefaultNote = model.DefaultSalesNotes ? 1 : 0;
				}
				
                model.EnableLogo = context.AppParams.FirstOrDefault(x => x.appParam.ToLower() == "logoreceipt" && x.AccountProfileId == apId).appVal == "1";
                if (model.EnableLogo)
                {
                    model.ReceiptLogo = PPWCommonLib.CommonHelpers.ModelHelper.GetReceiptLogo(ProjectEnum.G3);
                }
                else
                {
                    model.ReceiptLogo = PPWCommonLib.CommonHelpers.ModelHelper.GetDefaultImg();
                }
                model.DicAcNo = PPWLib.Helpers.ModelHelper.GetDicAcNo(context);
                model.AccountNo = model.DicAcNo[ComInfo.AccountProfileId];
                return View(model);
            }
        }

        [HandleError]
        [CustomAuthorize("othersettings", "boss", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult Edit(FormCollection formCollection)
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                foreach (var key in formCollection.AllKeys)
                {
                    AppParam param = context.AppParams.FirstOrDefault(x => x.appParam == key && x.AccountProfileId == apId);
                    if (param != null)
                    {
                        param.appVal = formCollection[key];
                    }
                }

                var defaultsalesnotes = context.AppParams.FirstOrDefault(x => x.appParam == "DefaultSalesNotes" && x.AccountProfileId == apId);
                defaultsalesnotes.appVal = formCollection["UseDefaultNote"];
                if (defaultsalesnotes.appVal == "1")
                {
                    string defaultsalesnotetxt = formCollection["DefaultSalesNotesTxt"];
                    AppParam appParam = null;
                    int lang = (int)Session["CurrentCulture"];
                    switch (lang)
                    {
                        case 2:
                            appParam = context.AppParams.FirstOrDefault(x => x.appParam.ToLower() == "defaultsalesnotestxteng" && x.AccountProfileId == apId);
                            appParam.appVal = defaultsalesnotetxt;
                            break;
                        case 1:
                            appParam = context.AppParams.FirstOrDefault(x => x.appParam.ToLower() == "defaultsalesnotestxtchs" && x.AccountProfileId == apId);
                            appParam.appVal = defaultsalesnotetxt;
                            break;
                        default:
                        case 0:
                            appParam = context.AppParams.FirstOrDefault(x => x.appParam.ToLower() == "defaultsalesnotestxtcht" && x.AccountProfileId == apId);
                            appParam.appVal = defaultsalesnotetxt;
                            break;
                    }
                }

                var logoreceipt = context.AppParams.FirstOrDefault(x => x.appParam == "LogoReceipt" && x.AccountProfileId == apId);
                logoreceipt.appVal = formCollection["LogoReceipt"];

                string defaultcusname = formCollection["DefaultCustomerReceipt"];
                var customer = context.MyobCustomers.FirstOrDefault(x => x.cusCode == "GUEST" && x.cusIsActive == true);
                if (customer != null)
                {
                    customer.cusName = defaultcusname;
                }

                string defaultrefcusname = formCollection["DefaultCustomerRefund"];
                var recustomer = context.MyobCustomers.FirstOrDefault(x => x.cusCode == "WALK-IN" && x.cusIsActive == true);
                if (recustomer != null)
                {
                    recustomer.cusName = defaultrefcusname;
                }

                if (formCollection.AllKeys.Contains("TaxType"))
                {
                    var taxtype = context.AppParams.FirstOrDefault(x => x.appParam == "TaxType" && x.AccountProfileId == apId);
                    taxtype.appVal = formCollection["TaxType"];
                }
                if (formCollection.AllKeys.Contains("InclusiveTaxRate"))
                {
                    var taxrate = context.AppParams.FirstOrDefault(x => x.appParam == "InclusiveTaxRate" && x.AccountProfileId == apId);
                    taxrate.appVal = formCollection["InclusiveTaxRate"];
                }
               
                context.SaveChanges();
                TempData["message"] = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.OtherSettings);
                return RedirectToAction("Index", "OtherSettings");
            }
        }

    }
}