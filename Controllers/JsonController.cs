using Newtonsoft.Json;
using PPWDAL;
using PPWLib.Models.Item;
using PPWLib.Models.MYOB;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;

namespace SmartBusinessWeb.Controllers
{
    public class JsonController : Controller
    {
        [System.Web.Http.HttpPost]
        public async Task GetAbssData(int apId, string type, [FromBody] List<MyobItem> items)
        {            
            string dbname;
            switch (apId)
            {
                case 2:
                    dbname = "SB0";
                    break;
                case 3:
                    dbname = "SB1";
                    break;
                default:
                case 1:
                    dbname = "POSPro";
                    break;
            }
            using var context = new PPWDbContext(dbname);
            if (type == "items")
            {
                context.MyobItems.AddRange(items);
                await context.SaveChangesAsync();
            }            
        }
    }
}