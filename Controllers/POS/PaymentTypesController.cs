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

namespace SmartBusinessWeb.Controllers
{
	[CustomAuthenticationFilter]
	public class PaymentTypesController : BaseController
	{
		[HandleError]
		[CustomAuthorize("paymenttypes", "admin1","admin","superadmin")]
		public ActionResult Index()
		{
			ViewBag.ParentPage = "setup";
			ViewBag.PageName = "paymenttypes";
			using (var context = new PPWDbContext())
			{
				List<PaymentTypeView> model = new List<PaymentTypeView>();
				int lang = (int)Session["CurrentCulture"];
				switch (lang)
				{
					case 1:
						model = (from p in context.PaymentTypes
								 where p.pmtEditable == true
								 select new PaymentTypeView
								 {
									 Id = p.Id,
									 pmtIsActive = p.pmtIsActive,
									 pmtIsCash = p.pmtIsCash,
									 pmtCode = p.pmtCode,
									 pmtName = p.pmtNameCN
								 }).ToList();
						break;
					case 2:
						model = (from p in context.PaymentTypes
								 where p.pmtEditable==true
								 select new PaymentTypeView
								 {
									 Id = p.Id,
									 pmtIsActive = p.pmtIsActive,
									 pmtIsCash = p.pmtIsCash,
									 pmtCode = p.pmtCode,
									 pmtName = p.pmtNameEng
								 }).ToList();
						break;
					default:
					case 0:
						model = (from p in context.PaymentTypes
								 where p.pmtEditable==true
								 select new PaymentTypeView
								 {
									 Id = p.Id,
									 pmtIsActive = p.pmtIsActive,
									 pmtIsCash = p.pmtIsCash,
									 pmtCode = p.pmtCode,
									 pmtName = p.pmtName
								 }).ToList();
						break;
				}

				return View(model);
			}
		}

		[HandleError]
		[CustomAuthorize("paymenttypes", "admin1","admin","superadmin")]
		[HttpGet]
		public ActionResult Create()
		{
			List<PaymentTypeView> model = new List<PaymentTypeView>();
			TempData["model"] = model;
			return View();
		}

		[HandleError]
		[CustomAuthorize("paymenttypes", "admin1","admin","superadmin")]
		[ValidateAntiForgeryToken]
		[HttpPost]
		public ActionResult Create(PaymentTypeView model)
		{
			using (var context = new PPWDbContext())
			{
				int lang = (int)Session["CurrentCulture"];
				byte displayorder = (byte)context.PaymentTypes.OrderByDescending(x => x.pmtDisplayOrder).Select(x => x.pmtDisplayOrder).FirstOrDefault();
				displayorder++;
				PaymentType paymentType = new PaymentType
				{
					pmtCode = string.Concat("Type", CommonHelper.GenerateRandomCode()),
					pmtIsActive = model.pmtIsActive,
					pmtIsCash = model.pmtIsCash,
					pmtEditable = true,
					pmtDic = true,
					pmtPayModalChkBox = true,
					pmtReport = true,
					pmtDisplayOrder = displayorder
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
		[CustomAuthorize("paymenttypes", "admin1","admin","superadmin")]
		[HttpGet]
		public ActionResult Edit(int Id)
		{
			using (var context = new PPWDbContext())
			{
				PaymentType paymentType = context.PaymentTypes.Find(Id);
				int lang = (int)Session["CurrentCulture"];
				PaymentTypeView paymentTypeView = new PaymentTypeView
				{
					Id = paymentType.Id,
					pmtCode = paymentType.pmtCode,
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
		[CustomAuthorize("paymenttypes", "admin1","admin","superadmin")]
		[ValidateAntiForgeryToken]
		[HttpPost]
		public ActionResult Edit(PaymentTypeView model)
		{
			using (var context = new PPWDbContext())
			{
				PaymentType paymentType = context.PaymentTypes.Find(model.Id);			

				if (paymentType != null)
				{
					paymentType.pmtCode = model.pmtCode;
					paymentType.pmtIsCash = model.pmtIsCash;
					paymentType.pmtIsActive = model.pmtIsActive;
					int lang = (int)Session["CurrentCulture"];
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

					context.SaveChanges();
				}
				string msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.PaymentType);
				return Json(new { msg });
			}
		}

		[HandleError]
		[CustomAuthorize("paymenttypes", "admin1","admin","superadmin")]
		[ValidateAntiForgeryToken]
		[HttpPost]
		public ActionResult Delete(int Id)
		{
			using(var context=new PPWDbContext())
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