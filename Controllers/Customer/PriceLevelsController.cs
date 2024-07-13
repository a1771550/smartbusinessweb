using DAL;
using SBLib.Helpers;
using SmartBusinessWeb.Infrastructure;
using SBLib.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;

namespace SmartBusinessWeb.Controllers.Customer
{
	[CustomAuthenticationFilter]
	public class PriceLevelsController : BaseController
	{
		[HandleError]
		[CustomAuthorize("pricelevels", "admin1","admin","superadmin")]
		public ActionResult Index()
		{
			ViewBag.ParentPage = "customer";
			ViewBag.PageName = "pricelevels";
			using (var context = new SBDbContext(Session["DBName"].ToString()))
			{
				List<CustomerPointPriceLevelModel> model = new List<CustomerPointPriceLevelModel>();

				model = (from cp in context.CustomerPointPriceLevels
						 join pl in context.PriceLevels
						 on cp.PriceLevelID equals pl.PriceLevelID
						 where cp.AccountProfileId==apId && pl.AccountProfileId==apId
						 select new CustomerPointPriceLevelModel
						 {
							 Id = cp.Id,
							 PriceLevelID = cp.PriceLevelID,
							 CustomerPoint = cp.CustomerPoint,
							 PriceLevelDescription = pl.Description
						 }).ToList();

				return View(model);
			}
		}

		[HandleError]
		[CustomAuthorize("pricelevels", "admin1","admin","superadmin")]
		[ValidateAntiForgeryToken]
		[HttpPost]
		public ActionResult Create(CustomerPointPriceLevelModel model)
		{
			using (var context = new SBDbContext(Session["DBName"].ToString()))
			{				
				CustomerPointPriceLevel cppl = new CustomerPointPriceLevel
				{
					CustomerPoint = model.CustomerPoint,
					PriceLevelID = model.PriceLevelID,
					AccountProfileId = apId,				
				};
				PriceLevel priceLevel = new PriceLevel
				{
					PriceLevelID = model.PriceLevelID,
					Description = model.PriceLevelDescription,
					AccountProfileId = apId,
					CreateTime = DateTime.Now
				};
				context.CustomerPointPriceLevels.Add(cppl);
				context.PriceLevels.Add(priceLevel);
				context.SaveChanges();
				string msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.PriceLevel);
				return Json(new { msg });
			}
		}		

		[HandleError]
		[CustomAuthorize("pricelevels", "admin1","admin","superadmin")]
		[ValidateAntiForgeryToken]
		[HttpPost]
		public ActionResult Edit(CustomerPointPriceLevelModel model)
		{
			using (var context = new SBDbContext(Session["DBName"].ToString()))
			{
				CustomerPointPriceLevel cppl = context.CustomerPointPriceLevels.Find(model.Id);
				string pld = cppl.PriceLevelID;
				PriceLevel pl = context.PriceLevels.FirstOrDefault(x => x.PriceLevelID == pld);
				if (cppl != null)
				{
					cppl.CustomerPoint = model.CustomerPoint;
					cppl.PriceLevelID = model.PriceLevelID;	
				}
				if (pl != null)
				{
					pl.PriceLevelID = model.PriceLevelID;
					pl.Description = model.PriceLevelDescription;
				}
				context.SaveChanges();
				string msg = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.PriceLevel);
				return Json(new { msg });
			}
		}

		[HandleError]
		[CustomAuthorize("pricelevels", "admin1","admin","superadmin")]
		[ValidateAntiForgeryToken]
		[HttpPost]
		public ActionResult Delete(int Id)
		{
			using (var context = new SBDbContext(Session["DBName"].ToString()))
			{
				CustomerPointPriceLevel cppl = context.CustomerPointPriceLevels.Find(Id);
				PriceLevel priceLevel = context.PriceLevels.FirstOrDefault(x => x.AccountProfileId==apId && x.PriceLevelID == cppl.PriceLevelID);
				
				string msg = string.Empty;
				if (cppl != null)
				{
					context.CustomerPointPriceLevels.Remove(cppl);
					if (priceLevel != null)
					{
						context.PriceLevels.Remove(priceLevel);
					}
				}
				context.SaveChanges();
				msg = Resources.Resource.Removed;
				return Json(new { msg });
			}
		}
	}
}