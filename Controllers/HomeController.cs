using System.Web.Mvc;
using System.Linq;
using Resources = CommonLib.App_GlobalResources;
using PPWDAL;
using ModelHelper = PPWLib.Helpers.ModelHelper;
using PPWCommonLib.CommonHelpers;
using CommonLib.Helpers;

namespace SmartBusinessWeb.Controllers
{
    public class HomeController : BaseController
    {
		// GET: Home
		public ActionResult Index()
		{
            ViewBag.Title = Resources.Resource.SiteName;
            return View();
		}

		public ActionResult ChangeCurrentCulture(int Id)
        {
            //  
            // Change the current culture for this user.  
            //  
            CultureHelper.CurrentCulture = Id;
            //  
            // Cache the new current culture into the user HTTP session.   
            //  
            Session["CurrentCulture"] = Id;
            using(var context = new PPWDbContext(Session["DBName"].ToString()))
			{
                Session currsess = null;
                if (Session["SessionToken"] == null)
				{
                    currsess = ModelHelper.GetCurrentSession(context);
				}
				else
				{
                    string token = (string)Session["SessionToken"];
                    currsess = context.Sessions.FirstOrDefault(x => x.sesToken == token);                    
                }
				if (currsess != null)
				{
                    currsess.sesLang = Id;
                    context.SaveChanges();

                    //update menu
                    PPWLib.Helpers.MenuHelper.UpdateMenus(context);
                }
                else
                {
                    CultureHelper.CurrentCulture = Id;
                }

            }
            

            //  
            // Redirect to the same page from where the request was made!   
            //  
            return Redirect(Request.UrlReferrer.ToString());
        }
    }
}