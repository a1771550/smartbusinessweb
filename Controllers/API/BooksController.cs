using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using POSProWeb.Data;
using POSProWeb.Models;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.ListView;

namespace POSProWeb.Controllers.API
{
    public class BooksController : System.Web.Http.ApiController
    {
        private POSProWebContext db = new POSProWebContext();

        // GET: api/Books
        public List<BookDTO> GetBooks()
        {
            return (from b in db.Books
                    select new BookDTO
                    {
                        Id = b.Id,
                        Title = b.Title,
                        AuthorName = b.Author.Name
                    }
                    ).ToList();

        }

        // GET: api/Books/5
        [ResponseType(typeof(BookDetailDTO))]
        public async Task<IHttpActionResult> GetBook(int id)
        {
            var book = await db.Books.Include(x => x.Author).Select(b =>
             new BookDetailDTO { Id = b.Id, Title = b.Title, AuthorName = b.Author.Name, Genre = b.Genre, Price = b.Price, Year = b.Year }
            ).SingleOrDefaultAsync(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        // PUT: api/Books/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutBook(int id, Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != book.Id)
            {
                return BadRequest();
            }

            db.Entry(book).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Books
        [ResponseType(typeof(BookDTO))]
        public async Task<IHttpActionResult> PostBook(Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Books.Add(book);
            await db.SaveChangesAsync();

            db.Entry(book).Reference(x=>x.Author).Load();
            var dto = new BookDTO
            {
                Id=book.Id,
                AuthorName=book.Author.Name,
                Title=book.Title,
            };

            return CreatedAtRoute("DefaultApi", new { id = book.Id }, dto);
        }

        // DELETE: api/Books/5
        [ResponseType(typeof(Book))]
        public async Task<IHttpActionResult> DeleteBook(int id)
        {
            Book book = await db.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            db.Books.Remove(book);
            await db.SaveChangesAsync();

            return Ok(book);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BookExists(int id)
        {
            return db.Books.Count(e => e.Id == id) > 0;
        }
    }
}