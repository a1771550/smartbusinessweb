using PPWDAL;
using PPWLib.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace SmartBusinessWeb.Infrastructure
{
	public class CustomAuthorizeAttribute : AuthorizeAttribute
	{
		private readonly string[] alloweduserfuncs;
		public CustomAuthorizeAttribute(params string[] userfuncs)
		{			
			this.alloweduserfuncs = userfuncs;
		}

		protected override bool AuthorizeCore(HttpContextBase httpContext)
		{
			bool authorize = false;
			SessUser user = (SessUser)httpContext.Session["User"];
			var userCode = user.UserCode;
			if (!string.IsNullOrEmpty(userCode))
			{
				using (var context = new PPWDbContext(HttpContext.Current.Session["DBName"].ToString()))
				{
					List<string> userFuncList = new List<string>();
					
					userFuncList = (from ar in context.AccessRights
									join u in context.SysUsers on ar.UserCode equals u.UserCode
									join r in context.SysFuncs on ar.FuncCode.ToLower() equals r.sfnCode.ToLower()
									where u.UserCode.ToLower() == userCode.ToLower() && ar.AccountProfileId==user.AccountProfileId
									select ar.FuncCode.ToLower()
									  ).Distinct().ToList();
					foreach (var item in userFuncList)
					{
						foreach (var userfunc in alloweduserfuncs)
						{
							if (string.Equals(item, userfunc, StringComparison.InvariantCultureIgnoreCase))
							{
								return true;
							}
						}
					}

				}

			}
			return authorize;
		}

		protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
		{
			filterContext.Result = new RedirectToRouteResult(
			   new RouteValueDictionary
			   {
					{ "controller", "Admin" },
					{ "action", "UnAuthorized" }
			   });
		}
	}
}