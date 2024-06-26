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
        public ActionResult Login(string redirectUrl = "", string err = "0")
        {
            Session["CssBSFile"] = @"Content/bs4"; //Content/bootstrap.min.css
            Session["ScriptBSFile"] = @"Scripts/bs4"; //Content/bootstrap.min.css           
            ViewBag.Title = Resources.Resource.Login;
            ViewBag.Err = err;

            LoginUserModel loginUserModel = new LoginUserModel();
            if (!string.IsNullOrEmpty(redirectUrl)) return Redirect(redirectUrl);

            return View(loginUserModel);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Login(LoginUserModel model)
        {
            SysUser user = null;
            string msg = string.Empty;           
            string hash = string.Empty;
            GetUserByEmail3_Result _user = null;

            using (var context = new PPWDbContext("SmartBusinessWeb_db"))
            {
                hash = HashHelper.ComputeHash(model.Password);
                int lang = CultureHelper.CurrentCulture;
                _user = context.GetUserByEmail3(model.Email).FirstOrDefault();
                if (_user == null) return RedirectToAction("Login", new { err = "2" });               
                Session["DBName"] = _user.dbName;
            }

            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
				ComInfo comInfo = context.ComInfoes.AsNoTracking().FirstOrDefault(x => x.AccountProfileId == _user.AccountProfileId);
				
				var _roleuser = context.LoginPCUser8(model.Email, hash, model.SelectedDevice, model.SelectedShop).ToList();//because of multi-roles!
                var roles = _roleuser.Select(x => x.rlCode).Distinct().ToList();
                if (_roleuser != null && _roleuser.Count >= 1)
                {
					Session["AccountProfileId"] = _user.AccountProfileId;
					Session["ComInfo"] = comInfo;

					model.UserCode = _user.UserCode;
					model.CompanyCode = _user.CompanyCode;
					model.SelectedShop = _user.shopCode;
					model.SelectedDevice = _user.dvcCode;
					model.AccountProfileId = _user.AccountProfileId;
					model.IsCentral = _user.IsCentral;

					var __user = _roleuser.FirstOrDefault();
                    user = new SysUser
                    {
                        surUID = __user.surUID,
                        surIsActive = __user.surIsActive,
                        UserCode = __user.UserCode,
                        UserName = __user.UserName,
                        UserRole = string.Join(",", roles),
                        DisplayName = __user.DisplayName,
                        Email = __user.Email,
                        dvcCode = model.SelectedDevice,
                        shopCode = model.SelectedShop,
                        dvcIP = __user.dvcIP,
                        surNetworkName = __user.surNetworkName,
                        ManagerId = __user.ManagerId,
                        surDesc = __user.surDesc,
                        surNotes = __user.surNotes,
                        AccountProfileId = apId,
                        surCreateTime = __user.surCreateTime,
                        surModifyTime = __user.surModifyTime,
                    };
                    

                    var Roles = UserHelper.GetUserRoles(user);
                    bool isadmin = UserHelper.CheckIfAdmin(user);
                    bool issalesmanager = UserHelper.CheckIfSalesManager(user);
                    DeviceModel device = isadmin?null: Helpers.ModelHelper.GetDevice(user.surUID);//don't move to below

                    _login(user, context, model, null);

                    if (isadmin)
                    {
                        model.RedirectUrl = ApprovalMode ? "/OtherSettings/Index" : ComInfo.comLandingPage;
                        return Redirect(model.RedirectUrl);
                    }
                    if (issalesmanager)
                    {
                        model.RedirectUrl = ApprovalMode ? "/WholeSales/SalesOrderList" : ComInfo.comLandingPage;
                        return Redirect(model.RedirectUrl);
                    }
                    else
                    {                       
                        if (device != null)
                        { 
                            if (string.IsNullOrEmpty(model.RedirectUrl)) model.RedirectUrl = ComInfo.comLandingPage;
                            return Redirect(model.RedirectUrl);
                        }
                        else
                        {
                            return RedirectToAction("Login", new { err = "1" });
                        }
                    }
                }
                else
                {
                    return RedirectToAction("Login", new { err = "2" });
                }
            }
        }



        private void _login(SysUser user, PPWDbContext context, LoginUserModel model, DeviceModel device = null)
        {
            string token = CommonHelper.GenSessionToken();
            DateTime currDate = DateTime.Now.Date;
            DateTime currTime = DateTime.Now;
            int apId = model.AccountProfileId;

            Session session;

            string salesprefix = device == null ? "" : device.dvcInvoicePrefix;
            string refundprefix = device == null ? "" : device.dvcRefundPrefix;
            int accountno = device == null ? 0 : (int)device.AccountNo;

            var lastsess = context.GetLastPCSession1(apId, user.UserName, model.SelectedDevice, model.SelectedShop).FirstOrDefault();

            int seq;
            if (lastsess != null)
            {  
                int lastseq = lastsess.sesDvcSeq;
                if (lastseq < 3)
                {
                    lastseq++;
                    seq = lastseq;
                }
                else seq = 1;				
            }
            else seq = 1;			

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
                AccountProfileId = apId,
                sesDvcSeq = seq,
                sesSalesPrefix = salesprefix,
                sesRefundPrefix = refundprefix,
                sesIP = CommonHelper.GetIPAddress(),
                sesCheckout = false,
                Email = user.Email,
            };
            context.Sessions.Add(session);
            context.SaveChanges();
           

            SessUser sessUser = new SessUser
            {
                UserName = user.UserName,
                UserCode = user.UserCode,
                surUID = user.surUID,
                surIsActive = user.surIsActive,
                EnableCheckDayends = true,
                NetworkName = user.surNetworkName,
                PrinterName = "",
                Roles = UserHelper.GetUserRoles(user),
                AccountProfileId = apId,
                ManagerId = user.ManagerId,
                Device = device,
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
          
            MenuHelper.UpdateMenus(context);
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

            var dev = context.Devices.FirstOrDefault(x => x.AccountProfileId == ComInfo.AccountProfileId && x.dvcIsActive);
            //var dev = context.Devices.FirstOrDefault(x => x.dvcIsActive);
            device.dvcUID = dev.dvcUID;
            device.dvcName = dev.dvcName;
            device.AccountNo = (int)dev.AccountNo;
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
            SessUser user = Session["User"] as SessUser;
            if (user == null) { FormsAuthentication.SignOut(); return RedirectToAction("Login", "Account"); }           

            var usercode = user.UserCode;
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                context.CheckoutCurrentPCSession1(usercode, DateTime.Now.Date, apId, ConfigurationManager.AppSettings["Device"], ConfigurationManager.AppSettings["Shop"]);
                context.SaveChanges();
            }
            FormsAuthentication.SignOut();

            if (Session != null)
            {
                Session["Session"] = null;
                Session["User"] = null;
                Session["Device"] = null;
                Session["SessionToken"] = null;
                Session["GeneralReports"] = null;
                Session["Reports"] = null;
                Session["ExImViews"] = null;
                Session["CurrentCulture"] = null;
                Session["Menus"] = null; 
                Session["PendingInvoices"] = null;
                Session["IsCentral"] = null;
                Session["eBlastId"] = null;
                Session["ExportFrmShopPageTitle"] = null;
                Session["ImportFrmCentralPageTitle"] = null;
                Session["CssBSFile"] = null;
                Session["ScriptBSFile"] = null;
                Session["ComInfo"] = null;
                Session["GroupedTransferList"] = null;
                Session["DBName"] = null;
            }

            return RedirectToAction("Login", "Account");
        }
    }
}