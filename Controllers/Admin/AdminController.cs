﻿using PPWDAL;
using PPWLib.Helpers;
using SmartBusinessWeb.Infrastructure;
using PPWLib.Models;
using System.Linq;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using PPWLib.Models.User;
using PPWLib.Models.Settings;

namespace SmartBusinessWeb.Controllers.Admin
{
    [CustomAuthenticationFilter]
    public class AdminController : BaseController
    {
        [HandleError]
        [CustomAuthorize("syssetup", "admin", "superadmin")]
        public ActionResult Setup()
        {
            ViewBag.PageName = "setup";
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                SetupModel model = new SetupModel();
                Session session = ModelHelper.GetCurrentSession(context);
                int syssetupId = context.SysFuncs.Where(x => x.sfnCode == "SYSSETUP").Select(x => x.sfnUID).FirstOrDefault();
                model.MainFuncs = (from f in context.SysFuncs
                                   where f.sfnParent == syssetupId
                                   select new FuncView
                                   {
                                       sfnCode = f.sfnCode,
                                       DisplayName = string.Empty
                                   }
                                   ).ToList();
                foreach (var func in model.MainFuncs)
                {
                    if (func.sfnCode.ToLower() == "accessrights")
                    {
                        func.DisplayName = Resources.Resource.StaffAR;
                    }
                    if (func.sfnCode.ToLower() == "paymenttypes")
                    {
                        func.DisplayName = Resources.Resource.PaymentType;
                    }
                    if (func.sfnCode.ToLower() == "receipt")
                    {
                        func.DisplayName = Resources.Resource.ReceiptHF;
                    }
                    if (func.sfnCode.ToLower() == "basicsettings")
                    {
                        func.DisplayName = Resources.Resource.BasicSettings;
                    }
                }

                UserEditModel umodel = new();
                umodel.GetUserList();
                model.Users = umodel.Users;
                return View(model);
            }

        }
        public ViewResult UnAuthorized()
        {
            ViewBag.Title = Resources.Resource.UnAuthorizedAccess;
            TempData["UnAuthorized"] = true;
            return View();
        }
    }
}