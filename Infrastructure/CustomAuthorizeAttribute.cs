using Dapper;
using Microsoft.Data.SqlClient;
using DAL;
using SBLib.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace SmartBusinessWeb.Infrastructure
{
	public class CustomAuthorizeAttribute : AuthorizeAttribute
	{
        public string DefaultConnection { get { return HttpContext.Current.Session["DBName"] == null ? ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString.Replace("_DBNAME_", "SmartBusinessWeb_db") : ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString.Replace("_DBNAME_", HttpContext.Current.Session["DBName"].ToString()); } }
     
        public SqlConnection SqlConnection { get { return new SqlConnection(DefaultConnection); } }
        private readonly string[] alloweduserfuncs;
		public CustomAuthorizeAttribute(params string[] userfuncs)
		{			
			this.alloweduserfuncs = userfuncs;
		}

		protected override bool AuthorizeCore(HttpContextBase httpContext)
		{
			SessUser user = (SessUser)httpContext.Session["User"];
			var userCode = user.UserCode;
			if (!string.IsNullOrEmpty(userCode))
			{
                if (SqlConnection.State == ConnectionState.Closed) SqlConnection.Open();
                using (SqlConnection) {
					List<string> userFuncList = SqlConnection.Query<string>("EXEC dbo.GetUserAccessRights @apId=@apId,@userCode=@userCode", new {apId = user.AccountProfileId, userCode}).ToList();
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
			return false;
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