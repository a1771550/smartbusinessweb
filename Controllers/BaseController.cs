using CommonLib.Helpers;
using System;
using System.Web.Mvc;
using graph_tutorial.TokenStorage;
using System.Security.Claims;
using System.Web;
using Microsoft.Owin.Security.Cookies;
using graph_tutorial.Models;
using System.Collections.Generic;
using System.Configuration;
using PPWDAL;
using Resources = CommonLib.App_GlobalResources;
using PPWLib.Models;
using Microsoft.Data.SqlClient;

namespace SmartBusinessWeb.Controllers
{
    public abstract class BaseController : Controller
    {
        public string DefaultDbName { get { return ConfigurationManager.AppSettings["DefaultDbName"]; } }
        public string DefaultConnection { get { return Session["DBName"] == null ? ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString.Replace("_DBNAME_", "SmartBusinessWeb_db") : ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString.Replace("_DBNAME_", Session["DBName"].ToString()); } }
        protected ComInfo ComInfo { get { return Session["ComInfo"] as ComInfo; } }
        protected SqlConnection SqlConnection { get { return new SqlConnection(DefaultConnection); } }
        protected int AccountProfileId { get { return ComInfo.AccountProfileId; } }
        protected int apId { get { return ComInfo.AccountProfileId; } }
        protected string DbName { get { return Session["DBName"].ToString(); } }
		protected new SessUser User => Session["User"] as SessUser;
		protected bool NonABSS { get { return ComInfo.DefaultCheckoutPortal.ToLower() == "nonabss"; } }
        protected string CentralBaseUrl = UriHelper.GetAppUrl();
        protected string CentralApiUrl = ConfigurationManager.AppSettings["CentralApiUrl"];
        protected bool IsDeploy { get { return ComInfo == null ? ConfigurationManager.AppSettings["IsDeploy"]=="1":(bool)ComInfo.IsDeploy; } }        
        protected bool EnableCRM { get { return ComInfo == null? ConfigurationManager.AppSettings["enableCRM"] == "1" : (bool)ComInfo.enableCRM; } }       
        protected bool Reserveoriginalsalesmode { get { return ComInfo == null? ConfigurationManager.AppSettings["ReserveOriginalSalesMode"] == "1" : (bool)ComInfo.ReserveOriginalSalesMode; } }
        protected bool ApprovalMode { get { return ComInfo == null ? ConfigurationManager.AppSettings["ApprovalMode"] == "1" : (bool)ComInfo.ApprovalMode; } }
        
        protected string CheckoutPortal { get { return ComInfo.DefaultCheckoutPortal;  } }
        protected int PageSize { get { return ComInfo == null ? int.Parse(ConfigurationManager.AppSettings["PageLength"]): (int)ComInfo.PageLength; } }
        protected string DateFormat { get { return ComInfo == null ? ConfigurationManager.AppSettings["DateFormat"]: ComInfo.DateFormat; } }
        protected string ReceiptLogoDir { get { return ComInfo == null ? ConfigurationManager.AppSettings["ReceiptLogoDir"]: ComInfo.ReceiptLogoDir; } }
        protected string UploadsWSDir { get { return ConfigurationManager.AppSettings["UploadsWSDir"]; } }
        protected string UploadsPODir { get { return ConfigurationManager.AppSettings["UploadsPODir"]; } }
		protected string UploadsPoPaysDir { get { return ConfigurationManager.AppSettings["UploadsPoPaysDir"]; } }
		protected string UploadsCusDir { get { return ConfigurationManager.AppSettings["UploadsCusDir"]; } }
        protected string UploadsSupDir { get { return ConfigurationManager.AppSettings["UploadsSupDir"]; } }
        protected string UploadsEnqDir { get { return ConfigurationManager.AppSettings["UploadsEnqDir"]; } }
        protected DateTime DateTime { get { return DateTime.Now; } }

        protected override void ExecuteCore()
        {
            int culture;
            if (this.Session == null || this.Session["CurrentCulture"] == null)
            {

                int.TryParse(System.Configuration.ConfigurationManager.AppSettings["CultureOnLogin"], out culture);
                this.Session["CurrentCulture"] = culture;
            }
            else
            {
                culture = (int)this.Session["CurrentCulture"];
            }
            // calling CultureHelper class properties for setting  
            CultureHelper.CurrentCulture = culture;
           
            Session["SBToABSSOK"] = Resources.Resource.SBToABSSOK;
            Session["ABSSToSBOK"] = Resources.Resource.ABSSToSBOK;

            base.ExecuteCore();
        }
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (Request.IsAuthenticated)
            {
                // Get the user's token cache
                var tokenStore = new SessionTokenStore(null,
                    System.Web.HttpContext.Current, ClaimsPrincipal.Current);

                if (tokenStore.HasData())
                {
                    // AddPG the user to the view bag
                    ViewBag.User = tokenStore.GetUserDetails();
                }
                else
                {
					// The session has lost data. This happens often when debugging. Log out so the user can log back in
					//Microsoft.Owin.Host.SystemWeb
					Request.GetOwinContext().Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
                    filterContext.Result = RedirectToAction("Index", "Enquiry");
                }
            }

            base.OnActionExecuting(filterContext);
        }

        protected void Flash(string message, string debug = null)
        {
            var alerts = TempData.ContainsKey(Alert.AlertKey) ?
                (List<Alert>)TempData[Alert.AlertKey] :
                new List<Alert>();

            alerts.Add(new Alert
            {
                Message = message,
                Debug = debug
            });

            TempData[Alert.AlertKey] = alerts;
        }

        protected override bool DisableAsyncSupport
		{
			get { return true; }
		}
	}
}