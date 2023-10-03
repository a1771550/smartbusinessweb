using PPWDAL;
using PPWLib.Helpers;
using PPWLib.Models;
using System;
using System.Linq;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using FileHelper = PPWCommonLib.CommonHelpers.FileHelper;
using CommonLib.Helpers;
using System.Configuration;
using System.Web.Security;
using Helpers = PPWLib.Helpers;

namespace SmartBusinessWeb.Controllers
{
    public class AccountController : BaseController
    {
        [HttpGet]
        public ActionResult Login(string redirectUrl = "")
        {
            Session["CssBSFile"] = @"Content/bs4"; //Content/bootstrap.min.css
            Session["ScriptBSFile"] = @"Scripts/bs4"; //Content/bootstrap.min.css
            ViewBag.Title = Resources.Resource.Login;
            LoginUserModel loginUserModel = new LoginUserModel();
            if (!string.IsNullOrEmpty(redirectUrl))
            {
                loginUserModel.RedirectUrl = redirectUrl;
            }
            return View(loginUserModel);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Login(LoginUserModel model)
        {
            using var context = new PPWDbContext();

            string msg = string.Empty;
            string hash = HashHelper.ComputeHash(model.Password);
            int lang = CultureHelper.CurrentCulture;

            SysUser user = null;

            var _user = context.GetUserByEmail2(model.Email).FirstOrDefault();
            if (_user == null)
            {
                msg = Resources.Resource.InvalidLogin;
                return Json(new { msg });
            }
            else
            {
                model.UserCode = _user.UserCode;              
                model.CompanyCode = _user.CompanyCode;
                model.SelectedShop = _user.shopCode;
                model.SelectedDevice = _user.dvcCode;
                model.AccountProfileId = _user.AccountProfileId;
                model.IsCentral = _user.IsCentral;

                ComInfo comInfo = context.ComInfoes.AsNoTracking().FirstOrDefault(x => x.Id == _user.CompanyId);

                bool isdeploy = (bool)comInfo.IsDeploy;
                if (isdeploy)
                {
                    if (model.LoginMode == "pos")
                    {
                        var icount = context.GetPOSUserSessionCount4(model.surUID, model.SelectedShop).FirstOrDefault();
                        if (icount != null)
                        {
                            int poslic = int.Parse(ConfigurationManager.AppSettings["POSMaxDevicesAllowedInSameTime"]);
                            if ((int)icount.PosUserSessionSum == poslic)
                            {
                                msg = string.Format(Resources.Resource.OnlyDevicesAllowedInSameTime, poslic);
                                return Json(new { msg });
                            }
                        }
                    }
                }

                var _roleuser = context.LoginPCUser7(model.Email, hash, model.SelectedDevice, model.SelectedShop).ToList();//because of multi-roles!
                if (_roleuser != null && _roleuser.Count >= 1)
                {
                    var __user = _roleuser.FirstOrDefault();
                    user = new SysUser
                    {
                        surUID = __user.surUID,
                        surIsActive = __user.surIsActive,
                        UserCode = __user.UserCode,
                        UserName = __user.UserName,
                        UserRole = string.Join(",", _roleuser.Select(x => x.rlCode).ToList()),
                        DisplayName = __user.DisplayName,
                        Email = __user.Email,
                        dvcCode = model.SelectedDevice,
                        shopCode = model.SelectedShop,
                        dvcIP = __user.dvcIP,
                        surNetworkName = __user.surNetworkName,
                        ManagerId = __user.ManagerId,
                        surDesc = __user.surDesc,
                        surNotes = __user.surNotes,
                        AccountProfileId = __user.AccountProfileId,
                        surCreateTime = __user.surCreateTime,
                        surModifyTime = __user.surModifyTime,
                    };
                    Session["ComInfo"] = comInfo;
                    //Response.Write(comInfo.DefaultTaxCode);return null;

                    DeviceModel device = Helpers.ModelHelper.GetDevice(user.surUID, context);//don't move to below
                    if (device != null)
                    {
                        _login(user, context, model, device);
                        msg = "ok";
                        if (string.IsNullOrEmpty(model.RedirectUrl))
                        {
                            if (ApprovalMode)
                            {
                                var Roles = Helpers.ModelHelper.GetUserRoles(user);
                                //if (Roles.Any(x => x == RoleType.SalesManager))
                                //{
                                //    model.RedirectUrl = "/WholeSales/Edit/0?type=order";
                                //}
                                if (Roles.Any(x => x == RoleType.Admin) && !Roles.Any(x => x == RoleType.SalesManager))
                                {
                                    model.RedirectUrl = "/WholeSales/SalesOrderList";
                                }
                                if ((!Roles.Any(x => x == RoleType.Admin) && !Roles.Any(x => x == RoleType.SalesManager)) || Roles.Any(x => x == RoleType.SalesManager))
                                {
                                    // model.RedirectUrl = "/WholeSales/Edit/0?type=order";// ComInfo.comLandingPage;
                                    model.RedirectUrl = ComInfo.comLandingPage;
                                }
                            }
                            else
                            {
                                model.RedirectUrl = ComInfo.comLandingPage;
                            }
                        }

                        return Json(new { msg, iscentral = model.IsCentral, redirecturi = model.RedirectUrl });
                    }
                    else
                    {
                        msg = Resources.Resource.SalesDeviceNotFound;
                        return Json(new { msg });
                    }
                }
                else
                {
                    msg = Resources.Resource.InvalidLogin;
                    return Json(new { msg });
                }
            }
        }


        private void _login(SysUser user, PPWDbContext context, LoginUserModel model, DeviceModel device = null)
        {
            string token = CommonHelper.GenSessionToken();
            DateTime currDate = DateTime.Now.Date;
            DateTime currTime = DateTime.Now;

            Session session;

            string salesprefix = device == null ? "" : device.dvcInvoicePrefix;
            string refundprefix = device == null ? "" : device.dvcRefundPrefix;
            int accountno = device == null ? 0 : (int)device.AccountNo;

            var lastsess = context.GetLastPCSession1(user.AccountProfileId, user.UserName, model.SelectedDevice, model.SelectedShop).FirstOrDefault();

            var appparams = context.GetLoginDataFrmAppParam(user.AccountProfileId).ToList();

            //var enablecashdrawer = context.AppParams.FirstOrDefault(x => x.appParam == "EnableCashDrawerAmt");
            //Session["EnableCashDrawer"] = enablecashdrawer.appVal == "1";
            var enablecashdrawer = appparams[0].ToString() == "1";
            Session["EnableCashDrawer"] = enablecashdrawer;
            //bool enablecheckdayends = context.AppParams.FirstOrDefault(x => x.appParam == "EnableDayendsCheckOnLogout").appVal == "1";
            bool enablecheckdayends = appparams[1].ToString() == "1";

            int accountProfileId = model.AccountProfileId;
            //set sesDvcSeq:
            //user may have unpurposely closed the browser

            int seq;
            if (lastsess != null)
            {
                if (enablecashdrawer)
                {
                    Session["CheckedCashDrawer"] = false;
                    Session["CashDrawerAmt"] = lastsess.sesCashAmtStart;
                }
                int lastseq = lastsess.sesDvcSeq;
                if (lastseq < 3)
                {
                    lastseq++;
                    seq = lastseq;
                }
                else
                {
                    seq = 1;
                }
            }
            else
            {
                seq = 1;
            }

            session = new Session
            {
                sesIsActive = true,
                sesDvc = model.SelectedDevice ?? "",
                sesShop = model.SelectedShop ?? "",
                sesLang = (int)Session["CurrentCulture"],
                UserCode = user.UserCode,
                IsCentral = false,
                sesDateFr = currDate,
                sesTimeFr = currTime,
                sesCreateBy = user.surUID.ToString(),
                sesCreateTime = DateTime.Now,
                sesToken = token,
                AccountNo = accountno,
                AccountProfileId = accountProfileId,
                sesDvcSeq = seq,
                sesSalesPrefix = salesprefix,
                sesRefundPrefix = refundprefix,
                sesIP = CommonHelper.GetIPAddress(),
                sesCheckout = false,
                Email = user.Email,
            };
            context.Sessions.Add(session);
            context.SaveChanges();
            //string printername = context.AppParams.FirstOrDefault(x => x.appParam == "PriorityPrinter").appVal;
            var printername = appparams[2].ToString();

            SessUser sessUser = new SessUser
            {
                UserName = user.UserName,
                UserCode = user.UserCode,
                surUID = user.surUID,
                surIsActive = user.surIsActive,
                EnableCheckDayends = enablecheckdayends,
                NetworkName = user.surNetworkName,
                PrinterName = printername,
                Roles = Helpers.ModelHelper.GetUserRoles(user),
                AccountProfileId = accountProfileId,
                ManagerId = user.ManagerId,
                Device = device,
                SalesGroupId = context.GetSalesGroupId(user.surUID).FirstOrDefault(),              
                Email = user.Email,
                shopCode = user.shopCode,
                dvcCode = user.dvcCode,
            };
            FormsAuthentication.SetAuthCookie(sessUser.UserName, false);
            Session["Session"] = session;
            Session["User"] = sessUser;
            Session["Device"] = device;
            Session["SessionToken"] = token;
            Session["IsCentral"] = model.IsCentral;
            Session["eBlastId"] = 0;
            Session["AccountProfileId"] = model.AccountProfileId;
            Session["DBName"] = user.dbName;
            //Session["ComInfo"] = context.ComInfoes.AsNoTracking().FirstOrDefault(x => x.Id == user.CompanyId);

            MenuHelper.UpdateMenus(context);

            Session["AccessMode"] = model.LoginMode; //ConfigurationManager.AppSettings["defaultCRM"] == "1" ? "crm" : "pos";
        }

        private DeviceModel GetDeviceInfo(LoginUserModel model, PPWDbContext context)
        {
            DeviceModel device = new DeviceModel();

            if (model.CompanyCode.ToLower() == "proview")
            {
                string infotxt = FileHelper.Read(device.DeviceInfoFileName);
                if (!string.IsNullOrEmpty(infotxt))
                {
                    string[] deviceinfo = infotxt.Split(new string[] { ";;" }, StringSplitOptions.None);
                    string hashdevice = deviceinfo[0];
                    string hashshop = deviceinfo[1];

                    if (HashHelper.ComputeHash(model.SelectedDevice) != hashdevice || HashHelper.ComputeHash(model.SelectedShop) != hashshop)
                    {
                        return null;
                    }
                }
            }

            device.dvcShop = model.SelectedShop;
            device.dvcCode = model.SelectedDevice;

            var dev = context.Devices.FirstOrDefault(x => x.CompanyId == ComInfo.Id && x.AccountProfileId == ComInfo.AccountProfileId && x.dvcIsActive);
            //var dev = context.Devices.FirstOrDefault(x => x.dvcIsActive);
            device.dvcUID = dev.dvcUID;
            device.dvcName = dev.dvcName;
            device.AccountNo = (int)dev.AccountNo;
            device.CompanyId = dev.CompanyId;
            device.AccountProfileId = dev.AccountProfileId;
            device.dvcStockLoc = dev.dvcStockLoc;

            device.dvcInvoicePrefix = dev.dvcInvoicePrefix;
            device.dvcRefundPrefix = dev.dvcRefundPrefix;

            device.dvcRtlSalesCode = dev.dvcRtlSalesCode;
            device.dvcRtlRefundCode = dev.dvcRtlRefundCode;
            device.dvcPurchasePrefix = dev.dvcPurchasePrefix;
            device.dvcPsReturnCode = dev.dvcPsReturnCode;
            device.dvcRtlSalesInitNo = dev.dvcRtlSalesInitNo;
            device.dvcRtlRefundInitNo = dev.dvcPsReturnInitNo;
            device.dvcPurchaseInitNo = dev.dvcPurchaseInitNo;
            device.dvcPsReturnInitNo = dev.dvcPsReturnInitNo;
            device.dvcNextRtlSalesNo = dev.dvcNextRtlSalesNo;
            device.dvcNextRefundNo = dev.dvcNextRefundNo;
            device.dvcNextDepositNo = dev.dvcNextDepositNo;
            device.dvcNextPurchaseNo = dev.dvcNextPurchaseNo;
            device.dvcNextPsReturnNo = dev.dvcNextPsReturnNo;

            device.dvcTransferCode = dev.dvcTransferCode;
            device.dvcNextTransferNo = dev.dvcNextTransferNo;
            return device;
        }


        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            string usercode;
            int companyId = 1;
            if (Session != null)
            {
                SessUser user = Session["User"] as SessUser;
                usercode = user==null?"": user.UserCode;
                Session["Session"] = null;
                Session["User"] = null;
                Session["Device"] = null;
                Session["SessionToken"] = null;
                Session["GeneralReports"] = null;
                Session["Reports"] = null;
                Session["ExImViews"] = null;
                Session["CurrentCulture"] = null;
                Session["Menus"] = null;
                Session["EnableCashDrawer"] = null;
                Session["CashDrawerAmt"] = null;
                Session["CheckedCashDrawer"] = null;
                Session["PendingInvoices"] = null;
                Session["IsCentral"] = null;
                Session["eBlastId"] = null;
                Session["AccessMode"] = null;
                Session["ExportFrmShopPageTitle"] = null;
                Session["ImportFrmCentralPageTitle"] = null;
                Session["CssBSFile"] = null;
                Session["ScriptBSFile"] = null;
                Session["ComInfo"] = null;
                Session["GroupedTransferList"] = null;
                Session["DBName"] = null;
            }
            else
            {
                usercode = FileHelper.Read(ConfigurationManager.AppSettings["UserCodeFile"]);
            }

            using (var context = new PPWDbContext())
            {                
                context.CheckoutCurrentPCSession1(usercode, DateTime.Now.Date, companyId, ConfigurationManager.AppSettings["Device"], ConfigurationManager.AppSettings["Shop"]);
                context.SaveChanges();
            }

            FormsAuthentication.SignOut();
            return RedirectToAction("Login", "Account");
        }
    }
}