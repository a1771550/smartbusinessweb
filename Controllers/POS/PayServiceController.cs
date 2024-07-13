using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;
using System.Xml;
using CommonLib.Helpers;
using SBCommonLib.CommonModels;
using System.IO;
using System.Text;

namespace SmartBusinessWeb.Controllers
{
    public class PayServiceController : Controller
    {
        [HttpPost]
        public ActionResult Send()
        {
            try
            {
                var requestContent = GetRequestContentAsString();
                var document = XMLHelper.XmlDeserializeFromString<PayServiceDTO>(requestContent);

                return new HttpStatusCodeResult(HttpStatusCode.OK);
            }
            catch (System.Exception)
            {
                // logging
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError);
            }
        }

        private string GetRequestContentAsString()
        {
            using (var receiveStream = Request.InputStream)
            {
                using (var readStream = new StreamReader(receiveStream, Encoding.UTF8))
                {
                    return readStream.ReadToEnd();
                }
            }
        }
    }
}