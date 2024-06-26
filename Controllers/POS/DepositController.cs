using PPWLib.Models.POS.Sales;
using PPWLib.Models;
using SmartBusinessWeb.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PPWLib.Helpers;
using CommonLib.Models;

namespace SmartBusinessWeb.Controllers.POS
{
    [CustomAuthenticationFilter]
    [SessionExpire]
    public class DepositController : BaseController
    {
        [HandleError]
        [CustomAuthorize("deposit", "admin", "superadmin")]
        public ActionResult Index()
        {
            ViewBag.ParentPage = "sales";
            ViewBag.PageName = "deposit";
            DepositEditModel model = new DepositEditModel();
            return View(model);
        }

        [HttpGet]
        public JsonResult GetDeposit(string receiptno, string phoneno="")
        {
            DepositEditModel model = new DepositEditModel();
            model.Get(receiptno,phoneno);
            if (string.IsNullOrEmpty(model.msg))
            {
                return Json(new { model.Deposit, salesLns = model.DepositLnList, customer = model.Customer, companyinfo = model.ComInfo, dicpaytypes = model.DicPayTypes, items = model.Items, snlist = model.SerialNoList, customerpointpricelevels = model.CustomerPointPriceLevels, taxModel = model.TaxModel, inclusivetax = model.InclusiveTax, inclusivetaxrate = model.InclusiveTaxRate, enableTax = model.EnableTax, model.DicLocation, model.JobList, model.DicCurrencyExRate }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { model.msg }, JsonRequestBehavior.AllowGet);
            }
           
        }

        [HttpPost]
        public ActionResult ProcessRemain(DepositModel Deposit, List<DepositItem> DepositLnList, List<PayLnView> Payments)
        {
            string salescode = ModelHelper.ProcessRemain(Deposit, DepositLnList, Payments);
            return Json(new { msg = "", salescode });
        }


    }
}