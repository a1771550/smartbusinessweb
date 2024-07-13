using System.Web.Mvc;
using System.Linq;
using Resources = CommonLib.App_GlobalResources;
using DAL;
using ModelHelper = SBLib.Helpers.ModelHelper;
using SBCommonLib.CommonHelpers;
using CommonLib.Helpers;
using System.Configuration;

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
            CultureHelper.CurrentCulture = Id;
            Session["CurrentCulture"] = Id;
            string dbname = Session["DBName"] == null ? DefaultDbName : Session["DBName"].ToString();

			using (var context = new SBDbContext(dbname))
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
                    SBLib.Helpers.MenuHelper.UpdateMenus(context);
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