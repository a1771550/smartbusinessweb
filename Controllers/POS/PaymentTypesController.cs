using CommonLib.Helpers;
using PPWCommonLib.CommonHelpers;
using PPWDAL;
using PPWLib.Helpers;
using SmartBusinessWeb.Infrastructure;
using PPWLib.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using PPWLib.Models.Sales;

namespace SmartBusinessWeb.Controllers
{
    [CustomAuthenticationFilter]
    public class PaymentTypesController : BaseController
    {
        [HandleError]
        [CustomAuthorize("paymenttypes", "admin1", "admin", "superadmin")]
        public ActionResult Index()
        {
            ViewBag.ParentPage = "setup";
            ViewBag.PageName = "paymenttypes";
            int lang = (int)Session["CurrentCulture"];
            List<PayTypeModel> model = PaymentTypeHelper.GetList(lang);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("paymenttypes", "admin1", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Create()
        {
            List<PayTypeModel> model = new List<PayTypeModel>();
            TempData["model"] = model;
            return View();
        }

        [HandleError]
        [CustomAuthorize("paymenttypes", "admin1", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult Create(PayTypeModel model)
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                int lang = (int)Session["CurrentCulture"];
                byte displayorder = (byte)context.PaymentTypes.OrderByDescending(x => x.pmtDisplayOrder).Select(x => x.pmtDisplayOrder).FirstOrDefault();
                displayorder++;
                PaymentType paymentType = new PaymentType
                {
                    pmtCode = string.Concat("Type", CommonHelper.GenerateRandomCode()),
                    pmtServiceChargePercent = model.pmtServiceChargePercent,
                    pmtIsActive = model.pmtIsActive,
                    pmtIsCash = model.pmtIsCash,
                    pmtEditable = true,
                    pmtDic = true,
                    pmtPayModalChkBox = true,
                    pmtReport = true,
                    pmtDisplayOrder = displayorder,
                    AccountProfileId = apId,
                    CreateTime = DateTime.Now,
                    CreateBy = User.UserCode
                };
                switch (lang)
                {
                    case 2:
                        paymentType.pmtNameEng = model.pmtName;
                        break;
                    case 1:
                        paymentType.pmtNameCN = model.pmtName;
                        break;
                    default:
                    case 0:
                        paymentType.pmtName = model.pmtName;
                        break;
                }

                context.PaymentTypes.Add(paymentType);
                context.SaveChanges();
                string msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.PaymentType);
                return Json(new { msg });
            }
        }

        [HandleError]
        [CustomAuthorize("paymenttypes", "admin1", "admin", "superadmin")]
        [HttpGet]
        public ActionResult Edit(int Id)
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                PaymentType paymentType = context.PaymentTypes.Find(Id);
                int lang = (int)Session["CurrentCulture"];
                PayTypeModel paymentTypeView = new PayTypeModel
                {
                    Id = paymentType.Id,
                    pmtCode = paymentType.pmtCode,
                    pmtServiceChargePercent = paymentType.pmtServiceChargePercent,
                    pmtIsActive = paymentType.pmtIsActive,
                    pmtIsCash = paymentType.pmtIsCash,
                };
                switch (lang)
                {
                    case 2:
                        paymentTypeView.pmtName = paymentType.pmtNameEng;
                        paymentTypeView.pmtDescription = paymentType.pmtDescriptionEng;
                        break;
                    case 1:
                        paymentTypeView.pmtName = paymentType.pmtNameCN;
                        paymentTypeView.pmtDescription = paymentType.pmtDescriptionCN;
                        break;
                    default:
                    case 0:
                        paymentTypeView.pmtName = paymentType.pmtName;
                        paymentTypeView.pmtDescription = paymentType.pmtDescription;
                        break;
                }

                return View(paymentTypeView);
            }
        }

        [HandleError]
        [CustomAuthorize("paymenttypes", "admin1", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult Edit(PayTypeModel model)
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                PaymentType paymentType = context.PaymentTypes.Find(model.Id);

                if (paymentType != null)
                {
                    paymentType.pmtCode = model.pmtCode;
                    paymentType.pmtIsCash = model.pmtIsCash;
                    paymentType.pmtIsActive = model.pmtIsActive;
                    paymentType.pmtServiceChargePercent = model.pmtServiceChargePercent;
                    paymentType.ModifyBy = User.UserCode;
                    paymentType.ModifyTime = DateTime.Now;

                    int lang = (int)Session["CurrentCulture"];
                    switch (lang)
                    {
                        case 2:
                            paymentType.pmtNameEng = model.pmtNameEng;
                            break;
                        case 1:
                            paymentType.pmtNameCN = model.pmtNameCN;
                            break;
                        default:
                        case 0:
                            paymentType.pmtName = model.pmtName;
                            break;

                    }

                    context.SaveChanges();
                }
                string msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.PaymentType);
                return Json(new { msg });
            }
        }

        [HandleError]
        [CustomAuthorize("paymenttypes", "admin1", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult Delete(int Id)
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                PaymentType paymentType = context.PaymentTypes.Find(Id);
                string msg = string.Empty;
                if (paymentType != null)
                {
                    context.PaymentTypes.Remove(paymentType);
                    context.SaveChanges();
                }
                msg = Resources.Resource.Removed;
                return Json(new { msg });
            }
        }
    }
}