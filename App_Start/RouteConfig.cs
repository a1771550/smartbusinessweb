using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace SmartBusinessWeb
{
    public class RouteConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "wapi/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");


            //http://192.168.123.54:9000/Track/3/22535/testemail/testemail/67456475/kevinlau@united.com.hk/12345/0/
            routes.MapRoute(
               null,
               "Track/{blastId}/{contactId}/{contactName}/{organization}/{phone}/{email}/{companyId}/{imported}/",
new { controller = "Api", action = "ViewTrack" }
               );

            routes.MapRoute(
                null,
                "Track/{blastId}/{contactId}/",
new { controller = "Api", action = "ViewTrack", contactName = UrlParameter.Optional, organization = UrlParameter.Optional, phone = UrlParameter.Optional, email = UrlParameter.Optional, companyId = UrlParameter.Optional, imported = UrlParameter.Optional }
                );

            routes.MapRoute(
           null,
           "GetItems/{keyword}",
           new { controller = "Api", action = "GetItems" },
           new { keyword = @"\w+" }
       );

            routes.MapRoute(
           null,
           "GetCustomers4Sales/{keyword}",
           new { controller = "Api", action = "GetCustomers4Sales" },
           new { keyword = @"\w+" }
       );

            routes.MapRoute(
           null,
           "contacts",
           new { controller = "Api", action = "GetContacts" }
       );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Account", action = "Login", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: null,
                url: "{action}",
                defaults: new { controller = "Home" }
            );


            routes.MapRoute(
               name: null,
               url: "Culture/{comboId}",
               defaults: new { controller = "Home", action = "ChangeCurrentCulture" },
new { Id = @"\d+" }
           );
        }
    }
}
