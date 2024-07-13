using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Web
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
               "Track/{blastId}/{cusCode}/{contactName}/{organization}/{phone}/{email}/{companyId}/{imported}/",
new { controller = "Api", action = "ViewTrack" }
               );

            routes.MapRoute(
                null,
                "Track/{blastId}/{cusCode}/",
new { controller = "Api", action = "ViewTrack", contactName = UrlParameter.Optional, organization = UrlParameter.Optional, phone = UrlParameter.Optional, email = UrlParameter.Optional, companyId = UrlParameter.Optional, imported = UrlParameter.Optional }
                );

            routes.MapRoute(
   null,
   "abss-json/{apId}/{strfrmdate}/{strtodate}/{location}/{includeUploaded}/retail",
new { controller = "Json", action = "GetUploadRetailData" },
new { apId = @"\d+", strfrmdate = @"\d+\-\d+\-\d+", strtodate = @"\d+\-\d+\-\d+", location = @"\w+", includeUploaded = @"\d+" }
   );

            routes.MapRoute(
   null,
   "abss-json/{apId}/{strfrmdate}/{strtodate}/{location}/retail",
new { controller = "Json", action = "GetRetailCount" },
new { apId = @"\d+", strfrmdate = @"\d+\-\d+\-\d+", strtodate = @"\d+\-\d+\-\d+", location = @"\w+" }
   );
            //for wholesales
            routes.MapRoute(
  null,
  "abss-json/{apId}/{strfrmdate}/{strtodate}/{location}/{includeUploaded}/ws",
new { controller = "Json", action = "GetUploadWSData" },
new { apId = @"\d+", strfrmdate = @"\d+\-\d+\-\d+", strtodate = @"\d+\-\d+\-\d+", location = @"\w+", includeUploaded = @"\d+" }
  );
            //for wholesales
            routes.MapRoute(
   null,
   "abss-json/{apId}/{strfrmdate}/{strtodate}/{location}/ws",
new { controller = "Json", action = "GetWSCount" },
new { apId = @"\d+", strfrmdate = @"\d+\-\d+\-\d+", strtodate = @"\d+\-\d+\-\d+", location = @"\w+" }
   );

            routes.MapRoute(
   null,
   "abss-json/{apId}/{strfrmdate}/{strtodate}/{location}/{includeUploaded}/po",
new { controller = "Json", action = "GetUploadPoData" },
new { apId = @"\d+", strfrmdate = @"\d+\-\d+\-\d+", strtodate = @"\d+\-\d+\-\d+", location = @"\w+", includeUploaded=@"\d+" }
   );

            routes.MapRoute(
   null,
   "abss-json/{apId}/{strfrmdate}/{strtodate}/{location}/po",
new { controller = "Json", action = "GetPoCount" },
new { apId = @"\d+", strfrmdate = @"\d+\-\d+\-\d+", strtodate = @"\d+\-\d+\-\d+", location = @"\w+" }
   );
			routes.MapRoute(
   null,
   "abss-json/{apId}/gettest",
new { controller = "Json", action = "GetTest" },
new { apId = @"\d+" }
   );

			routes.MapRoute(
   null,
   "abss-json/{apId}/checkoutretail",
new { controller = "Json", action = "CheckOutRetail" },
new { apId = @"\d+" }
   );
            //wholesales
            routes.MapRoute(
   null,
   "abss-json/{apId}/checkoutws",
new { controller = "Json", action = "CheckOutWS" },
new { apId = @"\d+" }
   );

            routes.MapRoute(
   null,
   "abss-json/{apId}/checkoutpo",
new { controller = "Json", action = "CheckOutPo" },
new { apId = @"\d+" }
   );
                        routes.MapRoute(
   null,
   "abss-json/{apId}/httppost",
new { controller = "Json", action = "HttpPost" },
new { apId = @"\d+" }
   );

            routes.MapRoute(
   null,
   "abss-json/{apId}/locations",
new { controller = "Json", action = "PostAbssLocationData" },
new { apId = @"\d+" }
   );
            routes.MapRoute(
    null,
    "abss-json/{apId}/items",
new { controller = "Json", action = "PostAbssItemData" },
new { apId = @"\d+" }
    );
            routes.MapRoute(
   null,
   "abss-json/{apId}/stocks",
new { controller = "Json", action = "PostAbssStockData" },
new { apId = @"\d+" }
   );

			routes.MapRoute(
null,
"abss-json/{apId}/prices",
new { controller = "Json", action = "PostAbssPriceData" },
new { apId = @"\d+" }
);

			routes.MapRoute(
null,
"abss-json/{apId}/accounts",
new { controller = "Json", action = "PostAbssAccountData" },
new { apId = @"\d+" }
);
			routes.MapRoute(
null,
"abss-json/{apId}/jobs",
new { controller = "Json", action = "PostAbssJobData" },
new { apId = @"\d+" }
);

			routes.MapRoute(
null,
"abss-json/{apId}/customers",
new { controller = "Json", action = "PostAbssCustomerData" },
new { apId = @"\d+" }
);
            //customerinfo4abss
            routes.MapRoute(
null,
"abss-json/{apId}/customerinfo4abss",
new { controller = "Json", action = "PostCustomerInfo4AbssData" },
new { apId = @"\d+" }
);
            routes.MapRoute(
null,
"abss-json/{apId}/suppliers",
new { controller = "Json", action = "PostAbssSupplierData" },
new { apId = @"\d+" }
);
            //supplierinfo4abss
            routes.MapRoute(
null,
"abss-json/{apId}/supplierinfo4abss",
new { controller = "Json", action = "PostSupplierInfo4AbssData" },
new { apId = @"\d+" }
);

                         routes.MapRoute(
   null,
   "abss-json/{apId}/posttest",
new { controller = "Json", action = "PostTest" },
new {apId=@"\d+"}
   );

            routes.MapRoute(
         null,
         "alertfollowup/{apId}",
         new { controller = "Api", action = "AlertFollowUp" },
         new { apId = @"\d+" }
     );

            routes.MapRoute(
         null,
         "apitest",
         new { controller = "ApiV2", action = "Test" }       
     );
            routes.MapRoute(
		  null,
		  "POS",
		  new { controller = "Test", action = "POS" }
	  );

			routes.MapRoute(
          null,
          "PrivacyPolicy",
          new { controller = "Default", action = "PrivacyPolicy" }
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
		  "Contact",
		  new { controller = "SimpleContact", action = "GetUserById" }
	  );

			routes.MapRoute(
           null,
           "contacts",
           new { controller = "Api", action = "GetContacts" }
       );

            routes.MapRoute(
                name: null,
                url: "Culture/{Id}",
                defaults: new { controller = "Home", action = "ChangeCurrentCulture" },
 new { Id = @"\d+" }
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
        }
    }
}
