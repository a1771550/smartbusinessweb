using System.Web.Optimization;

namespace SmartBusinessWeb.App_Start
{
    public class BundleConfig
    {
        //static string btfolder = "bs5";
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundles/maincss").Include(
                "~/Content/bs4/bootstrap.min.css",
                "~/Content/bs4/bootstrap-theme.min.css",
                //"~/Content/DataTables/css/dataTables.bootstrap.css",
                "~/Content/DataTables/css/responsive.bootstrap.min.css"
                ));

            bundles.Add(new ScriptBundle("~/bundles/mainjs").Include(
            "~/Scripts/jquery-{version}.js",
            "~/Scripts/bs4/bootstrap.min.js",
            "~/Scripts/moment.min.js",
            "~/Scripts/respond.min.js",
            "~/Scripts/modernizr-2.8.3.js"
            //,
            //"~/Scripts/DataTables/jquery.dataTables.min.js",
            //"~/Scripts/DataTables/dataTables.select.min.js",
            //"~/Scripts/DataTables/dataTables.bootstrap4.min.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/fancyjpower").Include(
                "~/Scripts/fancybox/jquery.fancybox.min.js",
                "~/Scripts/fancybox/fancybox-plugin.js",
                "~/Scripts/node_modules/jquery-powertip/dist/jquery.powertip.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/webapidemo").Include(
                      "~/Scripts/knockout-{version}.js",
                      "~/Scripts/webapidemo.js"));

            /*
             *  <link rel="stylesheet" type="text/css" href="~/Scripts/jquery-ui/jquery-ui.min.css">
   <link rel="stylesheet" type="text/css" href="~/Scripts/node_modules/jquery-powertip/dist/css/jquery.powertip.min.css" />
    <link rel="stylesheet" type="text/css" href="~/Scripts/fancybox/jquery.fancybox.css" />
             <script src="~/Scripts/jquery-ui/jquery-ui.min.js"></script>
    <script type="text/javascript" src="~/Scripts/node_modules/jquery-powertip/dist/jquery.powertip.min.js"></script>
    
             */
            bundles.Add(new StyleBundle("~/bundles/misccss").Include(
                    "~/Scripts/jquery-ui/jquery-ui.min.css",
                    "~/Scripts/node_modules/jquery-powertip/dist/css/jquery.powertip.min.css",
                    "~/Scripts/fancybox/jquery.fancybox.css"
                    ));

            bundles.Add(new ScriptBundle("~/bundles/miscjs").Include(
                    "~/Scripts/jquery-ui/jquery-ui.min.js",
                     "~/Scripts/node_modules/jquery-powertip/dist/jquery.powertip.min.js",
            "~/Scripts/jquery-default-button.min.js"
                     ));


            bundles.Add(new StyleBundle("~/bundles/logincss").Include(
                "~/Content/bs4/bootstrap.min.css",
                "~/Content/bs4/bootstrap-theme.min.css",
                 "~/Scripts/fancybox/jquery.fancybox.css"
                ));

            bundles.Add(new ScriptBundle("~/bundles/loginjs").Include(
                   "~/Scripts/jquery-3.6.0.js",
                    "~/Scripts/bs4/bootstrap.min.js",
                     "~/Scripts/fancybox/jquery.fancybox.min.js",
                    "~/Scripts/fancybox/fancybox-plugin.js",
                     "~/Scripts/modernizr-2.8.3.js",
            "~/Scripts/jquery-default-button.min.js"
                    ));

            BundleTable.EnableOptimizations = true;
        }
    }

    public class BundlesFormats
    {
        public const string PRINT = @"<link href=""{0}"" rel=""stylesheet"" type=""text/css"" media=""print"" />";
    }
}
