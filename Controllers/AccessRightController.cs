using PPWDAL;
using SmartBusinessWeb.Infrastructure;
using PPWLib.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using ModelHelper = PPWLib.Helpers.ModelHelper;
using CommonLib.Helpers;
using System.Configuration;

namespace SmartBusinessWeb.Controllers
{
    [CustomAuthenticationFilter]
    public class AccessRightController : BaseController
    {
        [HandleError]
        [CustomAuthorize("accessrights", "admin", "superadmin")]
        public ActionResult Index()
        {
            ViewBag.ParentPage = "staff";
            ViewBag.PageName = "accessrights";
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                int apId = ComInfo.AccountProfileId;

                SetupModel model = new SetupModel();
                List<UserModel> users = UserEditModel.GetUserList(ComInfo, context, "pos");
                var currentuser = Session["User"] as SessUser;
                if (currentuser.Role == RoleType.CRMSalesManager)
                {
                    model.Users = currentuser.StaffList;
                }
                else
                {
                    //model.Users = UserEditModel.GetStaffList(users);
                    model.Users = users;
                }
                model.LicensedUserCount = context.GetLicensedUserCount().FirstOrDefault();
                model.BtnClass = model.LicensedUserCount >= (int)ComInfo.POSLic ? "linkdisabled" : "";
                return View(model);
            }
        }


        public ActionResult Edit(int userId = 0)
        {
            ViewBag.PageName = "accessrights";
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                List<SysFunc> funcs = new List<SysFunc>();

                funcs = context.SysFuncs.Where(x => x.sfnSettings == true).ToList();               
                TempData["dicAR"] = ModelHelper.GetDicAR();
                UserEditModel model;

                if (userId > 0)
                {
                    model = (from u in context.SysUsers
                             where u.surUID == userId
                             select new UserEditModel
                             {
                                 surUID = u.surUID,
                                 UserCode = u.UserCode,
                                 UserName = u.UserName,
                                 Email = u.Email,
                                 surIsActive = u.surIsActive,
                                 ManagerId = u.ManagerId,
                             }).FirstOrDefault();
                    model.AccessRights = context.AccessRights.Where(x => x.UserCode == model.UserCode).ToList();
                }
                else
                {
                    model = new UserEditModel(true, context);
                }

                model.PosAdminList = UserEditModel.GetPosAdminList(context);
                return View(model);
            }
        }

        [HandleError]
        [CustomAuthorize("accessrights", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult Create(FormCollection formCollection)
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                var usercode = formCollection["UserCode"];
                if (!context.SysUsers.Any(x => x.UserCode == usercode))
                {
                    string shop = ComInfo.Shop;
                    string device = ComInfo.Device;
                    int apId = ModelHelper.GetAccountProfileId(context);
                    SysUser user = null;
                    int newUserId = context.SysUsers.OrderByDescending(x => x.surUID).FirstOrDefault().surUID + 1;

                    user = new SysUser()
                    {
                        surUID = newUserId,
                        UserCode = usercode,
                        UserName = formCollection["UserName"],
                        Password = HashHelper.ComputeHash(formCollection["Password"]),
                        //surIsActive = formCollection["userstatus"] == "1",
                        surIsActive = true,
                        shopCode = shop,
                        dvcCode = device,
                        ManagerId = -1,
                        AccountProfileId = apId,
                        surScope = "pos",
                        Email = formCollection["Email"],
                        UserRole = "SalesPerson",
                        surIsAbss = false,
                        surLicensed = true,
                        surCreateTime = DateTime,
                        surModifyTime = DateTime
                    };
                    context.SysUsers.Add(user);
                    context.SaveChanges();

                    var roleId = context.SysRoles.Where(x => x.rlCode == "SalesPerson").FirstOrDefault().Id;
                    UserRole userRole = new UserRole
                    {
                        UserId = user.surUID,
                        RoleId = roleId,
                        CreateTime = DateTime,
                        ModifyTime = DateTime
                    };
                    context.UserRoles.Add(userRole);
                    context.SaveChanges();

                    List<string> funcCodes = new List<string>();
                    var dicARs = ModelHelper.GetDicAR(context, CultureHelper.CurrentCulture);
                    for (var i = 0; i < dicARs.Count; i++)
                    {
                        if (formCollection["FuncCodes[" + i + "]"] != null)
                        {
                            funcCodes.Add(formCollection["FuncCodes[" + i + "]"]);
                        }
                    }
                    if (funcCodes.Count > 0)
                    {
                        //remove current accessright first before adding:
                        context.AccessRights.RemoveRange(context.AccessRights.Where(x => x.UserCode == user.UserCode));
                        context.SaveChanges();
                        //add records:
                        List<AccessRight> ars = new List<AccessRight>();
                        foreach (string code in funcCodes)
                        {
                            AccessRight ar = new AccessRight
                            {
                                UserCode = user.UserCode,
                                FuncCode = code,
                                CreateTime = DateTime,
                                ModifyTime = DateTime
                            };
                            ars.Add(ar);
                        }
                        context.AccessRights.AddRange(ars);
                        context.SaveChanges();
                    }
                    //transaction.Commit();
                    //TempData["message"] = string.Format(Resources.Resource.ARsaved, user.UserName);
                    TempData["message"] = Resources.Resource.AddNewlyAddedEmployeeToABSS;
                    return RedirectToAction("Index", "AccessRight");
                }
                else
                {
                    TempData["warning"] = Resources.Resource.DuplicatedUserCode;
                    return RedirectToAction("EditPG", new { userId = 0 });
                }
            }
        }

        [HandleError]
        [CustomAuthorize("accessrights", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(FormCollection formCollection)
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                int userId = int.Parse(formCollection["UserID"]);
                SysUser user = context.SysUsers.Find(userId);
                if (user != null)
                {
                    user.UserName = formCollection["UserName"];
                    user.Email = formCollection["Email"];
                    if (formCollection["icheckpass"] == "1")
                    {
                        user.Password = HashHelper.ComputeHash(formCollection["Password"]);
                    }
                    //user.surIsActive = formCollection["userstatus"] == "1";
                    user.surModifyTime = DateTime;
                }

                List<string> funcCodes = new List<string>();
                var dicARs = ModelHelper.GetDicAR(context, CultureHelper.CurrentCulture);
                for (var i = 0; i < dicARs.Count; i++)
                {
                    if (formCollection["FuncCodes[" + i + "]"] != null)
                    {
                        funcCodes.Add(formCollection["FuncCodes[" + i + "]"]);
                    }
                }

                if (funcCodes.Count == 0)
                {
                    //the user is removed from all access rights
                    context.AccessRights.RemoveRange(context.AccessRights.Where(x => x.UserCode == user.UserCode));
                }
                else
                {
                    //remove current accessright first before adding:
                    context.AccessRights.RemoveRange(context.AccessRights.Where(x => x.UserCode == user.UserCode));
                    List<AccessRight> ars = new List<AccessRight>();
                    foreach (string code in funcCodes)
                    {
                        AccessRight ar = new AccessRight
                        {
                            UserCode = user.UserCode,
                            FuncCode = code,
                            CreateTime = DateTime,
                            ModifyTime = DateTime
                        };
                        ars.Add(ar);
                    }
                    context.AccessRights.AddRange(ars);
                }
                TempData["message"] = string.Format(Resources.Resource.ARsaved, user.UserName);
                context.SaveChanges();
            }
            return RedirectToAction("Index", "AccessRight");
        }

        [HandleError]
        [CustomAuthorize("accessrights", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int userId)
        {
            UserEditModel.Delete(userId);
            var msg = Resources.Resource.Removed;
            return Json(msg);
        }
    }
}