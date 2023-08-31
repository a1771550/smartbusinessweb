using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using PPWDAL;

namespace POSProWeb.Controllers.API
{
    public class Contacts : System.Web.Http.ApiController
    {       
        // GET api/<controller>
        public IHttpActionResult GetContacts()
        {
            using var context = new PPWDbContext();
            var contacts = context.Contacts.AsNoTracking().ToArray();
            return Json(contacts);
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}