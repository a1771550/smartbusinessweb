using CommonLib.Models.MYOB;
using SBCommonLib.CommonModels;
using SBLib.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SmartBusinessWeb.Controllers
{
    public class AbssController : Controller
    {
        [HttpPost]
        public JsonResult SaveStocks(int selectedProfileId)
        {
            AbssConn abssConn = ModelHelper.GetCompanyProfiles(selectedProfileId);            
            var stocks = MYOBHelper.GetStockList(abssConn);
            ModelHelper.SaveStocksToDB(selectedProfileId, stocks);
            return Json("Done", JsonRequestBehavior.AllowGet);
        }
    }
}