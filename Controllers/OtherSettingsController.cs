using CommonLib.Models;
using PPWCommonLib.CommonModels;
using KingdeeLib.Models;
using KingdeeLib.Models.AccountInfo;
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
using PPWLib.Models.POS.Settings;

namespace SmartBusinessWeb.Controllers
{
    [CustomAuthenticationFilter]
    public class OtherSettingsController : BaseController
    {
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
            ViewBag.PageName = "exchangerate";
            ExchangeRateEditModel model = new ExchangeRateEditModel();
            return View(model);
        }


        [HandleError]
        [CustomAuthorize("othersettings", "boss", "admin", "superadmin")]
        public ActionResult KingdeeAccountInfo()
        {
            ViewBag.ParentPage = "setup";
            ViewBag.PageName = "kingdee";
            KingdeeAccountInfo model = KingdeeAccountInfoEditModel.Get();
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("othersettings", "boss", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult KingdeeAccountInfo(KingdeeAccountInfo model)
        {
            var msg = Resources.Resource.UpdateOkMsg;
            if (ModelState.IsValid)
            {
                model.Msg = msg;
            }
            //        else
            //        {
            //return View(model);
            //        }
            KingdeeAccountInfoEditModel.Update(model);
            //return Json(msg);
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
                    using (var context = new PPWDbContext())
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
            using (var context = new PPWDbContext())
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
                                     CompanyId = os.CompanyId
                                 }).ToList();

                switch (lang)
                {
                    case 2:
                        foreach (var os in otherSettings)
                        {
                            os.DisplayText = os.DisplayText.Split(':')[0];
                        }
                        defaultsalesnotetxt = context.AppParams.FirstOrDefault(x => x.appParam.ToLower() == "defaultsalesnotestxteng" && x.CompanyId == ComInfo.Id).appVal;
                        break;
                    case 1:
                        foreach (var os in otherSettings)
                        {
                            os.DisplayText = os.DisplayText.Split(':')[1];
                        }
                        defaultsalesnotetxt = context.AppParams.FirstOrDefault(x => x.appParam.ToLower() == "defaultsalesnotestxtchs" && x.CompanyId == ComInfo.Id).appVal;
                        break;
                    default:
                    case 0:
                        foreach (var os in otherSettings)
                        {
                            os.DisplayText = os.DisplayText.Split(':')[2];
                        }
                        defaultsalesnotetxt = context.AppParams.FirstOrDefault(x => x.appParam.ToLower() == "defaultsalesnotestxtcht" && x.CompanyId == ComInfo.Id).appVal;
                        break;
                }

                model.OtherSettings = otherSettings;
                model.DefaultSalesNotes = otherSettings.FirstOrDefault(x => x.appParam == "DefaultSalesNotes" && x.CompanyId == ComInfo.Id).appVal == "1";
                if (model.DefaultSalesNotes)
                {
                    model.DefaultSalesNoteTxt = defaultsalesnotetxt;
                }
                model.UseDefaultNote = model.DefaultSalesNotes ? 1 : 0;
                model.EnableLogo = context.AppParams.FirstOrDefault(x => x.appParam.ToLower() == "logoreceipt" && x.CompanyId == ComInfo.Id).appVal == "1";
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
            using (var context = new PPWDbContext())
            {
                foreach (var key in formCollection.AllKeys)
                {
                    AppParam param = context.AppParams.FirstOrDefault(x => x.appParam == key && x.CompanyId == ComInfo.Id);
                    if (param != null)
                    {
                        param.appVal = formCollection[key];
                    }
                }

                var defaultsalesnotes = context.AppParams.FirstOrDefault(x => x.appParam == "DefaultSalesNotes" && x.CompanyId == ComInfo.Id);
                defaultsalesnotes.appVal = formCollection["UseDefaultNote"];
                if (defaultsalesnotes.appVal == "1")
                {
                    string defaultsalesnotetxt = formCollection["DefaultSalesNotesTxt"];
                    AppParam appParam = null;
                    int lang = (int)Session["CurrentCulture"];
                    switch (lang)
                    {
                        case 2:
                            appParam = context.AppParams.FirstOrDefault(x => x.appParam.ToLower() == "defaultsalesnotestxteng" && x.CompanyId == ComInfo.Id);
                            appParam.appVal = defaultsalesnotetxt;
                            break;
                        case 1:
                            appParam = context.AppParams.FirstOrDefault(x => x.appParam.ToLower() == "defaultsalesnotestxtchs" && x.CompanyId == ComInfo.Id);
                            appParam.appVal = defaultsalesnotetxt;
                            break;
                        default:
                        case 0:
                            appParam = context.AppParams.FirstOrDefault(x => x.appParam.ToLower() == "defaultsalesnotestxtcht" && x.CompanyId == ComInfo.Id);
                            appParam.appVal = defaultsalesnotetxt;
                            break;
                    }
                }

                var logoreceipt = context.AppParams.FirstOrDefault(x => x.appParam == "LogoReceipt" && x.CompanyId == ComInfo.Id);
                logoreceipt.appVal = formCollection["LogoReceipt"];

                string defaultcusname = formCollection["DefaultCustomerReceipt"];
                PGCustomer customer = context.PGCustomers.FirstOrDefault(x => x.cusCode == "GUEST" && x.cusIsActive == true);
                if (customer != null)
                {
                    customer.cusName = defaultcusname;
                }

                string defaultrefcusname = formCollection["DefaultCustomerRefund"];
                PGCustomer recustomer = context.PGCustomers.FirstOrDefault(x => x.cusCode == "WALK-IN" && x.cusIsActive == true);
                if (recustomer != null)
                {
                    recustomer.cusName = defaultrefcusname;
                }

                if (formCollection.AllKeys.Contains("TaxType"))
                {
                    var taxtype = context.AppParams.FirstOrDefault(x => x.appParam == "TaxType" && x.CompanyId == ComInfo.Id);
                    taxtype.appVal = formCollection["TaxType"];
                }
                if (formCollection.AllKeys.Contains("InclusiveTaxRate"))
                {
                    var taxrate = context.AppParams.FirstOrDefault(x => x.appParam == "InclusiveTaxRate" && x.CompanyId == ComInfo.Id);
                    taxrate.appVal = formCollection["InclusiveTaxRate"];
                }
               
                context.SaveChanges();
                TempData["message"] = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.OtherSettings);
                return RedirectToAction("Index", "OtherSettings");
            }
        }

    }
}