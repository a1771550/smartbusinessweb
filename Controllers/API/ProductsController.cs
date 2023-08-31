using POSProWeb.Models;
using System.Linq;
using System.Web.Http;

namespace POSProWeb.Controllers.API
{
    public class ProductsController : System.Web.Http.ApiController
    {
        Product[] products = new Product[]
        {
            new Product { Id = 1, Name = "Tomato Soup", Category = "Groceries", Price = 1 },
            new Product { Id = 2, Name = "Yo-yo", Category = "Toys", Price = 3.75M },
            new Product { Id = 3, Name = "Hammer", Category = "Hardware", Price = 16.99M }
        };

        /// <summary>
        /// http://localhost:8888/wapi/products
        /// </summary>
        /// <returns></returns>
        //public IEnumerable<Product> GetAllProducts()
        //{
        //    return products;
        //}

        /// <summary>
        /// http://localhost:8888/wapi/products
        /// </summary>
        public IHttpActionResult GetProducts()
        {
            return Json(products);
        }

        /// <summary>
        /// http://localhost:8888/wapi/products/1
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public IHttpActionResult GetProduct(int id)
        {
            var product = products.FirstOrDefault((p) => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            //return Ok(product);
            return Json(product);
        }

        
    }
}
