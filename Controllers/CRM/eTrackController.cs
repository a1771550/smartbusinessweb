using PPWLib.Models;
using SmartBusinessWeb.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PagedList;
using PPWDAL;
using CommonLib.Helpers;
using CommonLib.BaseModels;
using System.Configuration;
using Resources = CommonLib.App_GlobalResources.Resource;
using Dapper;
using PPWLib.Models.Customer;

namespace SmartBusinessWeb.Controllers
{
    [CustomAuthenticationFilter]
    public class eTrackController : BaseController
    {
        public ViewResult Index()
        {
            return View();
        }

        
        //strfrmdate=2023-07-01&strtodate=2023-08-16&blastid=
        [HttpPost]
        public ActionResult AdvancedSearch(List<AdvSearchItem> advSearchItems, eTrackAdvSearchItem eTrackAdvSearchItem)
        {            
            List<eTrackModel> filteredList = eTrackEditModel.GetFilteredList(apId, advSearchItems, eTrackAdvSearchItem);
            return Json(filteredList);
        }


        /// <summary>
        ///		Return a password-protected email-tracking list view with the ViewTrackModel, with the paging parameter (querystring) of page and other filtering parameters. 
        /// </summary>
        /// <param name="pass">a password querystring, without it none can access the list view</param> 
        /// <param name="organization">a filtering parameter</param> 
        /// <param name="viewdate">a filtering parameter in YYMMDD format</param> 
        /// <param name="contactname">a filtering parameter</param>
        /// <param name="blastid">a filtering parameter</param>
        /// <param name="page">a paging parameter</param>
        /// <returns>an email-tracking list view with the ViewTrackModel</returns>
        /// [HandleError]
        [CustomAuthorize("eblast", "boss", "admin", "superadmin")]
        //[HttpGet]
        public ActionResult TrackResult(string pass, string strfrmdate = "", string strtodate = "", string blastid = "", string contactname = "", string organization = "", string viewdate = "", int SortCol = 0, string SortOrder = "desc", string attrName = "", string attrOperator = "", string attrVal = "", int? PageNo = 1, int? PageSize = 0)
        {
            ViewBag.ParentPage = "promotion";
            ViewBag.PageName = "etrack";

            //get the latest password from the table "ViewTokens"
            string token = ConfigurationManager.AppSettings["eTrackToken"];

            //If the URL does not have the password, users cannot view the track result and will be redirected to an unauthorized-warning page.
            if (string.IsNullOrEmpty(pass))
            {
                return RedirectToAction("UnAuthorized", "Admin");
            }

            //check whether the password querystring (pass) equals (case insensitive) the one retrieved from the table mentioned above. Only the two are the same will the users be redirected to the list view of email tracking.
            //if (!string.IsNullOrEmpty(token))
            //{
            if (HttpUtility.UrlEncode(pass).Equals(token, StringComparison.InvariantCultureIgnoreCase))
            {
                //initialize a local variable to store all of the email tracking data                   
                ViewTrackModel model = new ViewTrackModel();
                model.AttrName = attrName;
                model.AttrVal = attrVal;

                model.eTracks = new List<eTrackModel>();
                #region Dates Handling
                DateTime frmdate, todate;
                CommonHelper.DatesHandling(strfrmdate, strtodate, out frmdate, out todate);
                model.DateFromTxt = CommonHelper.FormatDate(frmdate, true);
                model.DateToTxt = CommonHelper.FormatDate(todate, true);
                #endregion

                //List<GetEtracks_Result> _eTracks = new List<GetEtracks_Result>();
                ////List<GetEtrackLogs_Result> _eTracks = new List<GetEtrackLogs_Result>();
                //using (econtext = new eTrackDbContext())
                //{
                /*
                 * SELECT Distinct ContactId,Id,BlastId,Replace(ContactName,'+',' ') as ContactName,ViewDate,Replace(Organization,'+',' ') as Organization,Phone,Email,IP,CreateTime From eTrack Where (ViewDate >= @frmdate and ViewDate <=@todate) Order by ViewDate Desc;
                 */
                //_eTracks = econtext.GetEtracks(frmdate, todate).ToList();
                //_eTracks = econtext.GetEtrackLogs(frmdate, todate).ToList();
                //}               
                using var connection = new Microsoft.Data.SqlClient.SqlConnection(DefaultConnection);
                connection.Open();
                var _eTracks = connection.Query<eTrackModel>(@"EXEC dbo.GetEtracks @apId=@apId,@frmdate=@frmdate,@todate=@todate", new { apId, frmdate, todate }).ToList();
                if (_eTracks != null && _eTracks.Count>0)
                {
                    int apId = 0;
                    using (var context = new PPWDbContext(Session["DBName"].ToString()))
                    {
                        apId = ComInfo.AccountProfileId;
                        model.GlobalAttributeList = CustomerEditModel.GetGlobalAttrList(apId);
                        model.GlobalAttributeList.Add(new GlobalAttributeModel
                        {
                            gattrId = "custom",
                            attrType = "custom",
                            attrName = Resources.CustomAttribute,
                            attrOrder = 34
                        });
                        //model.CustomAttributeList = CustomAttributeEditModel.GetList(Id);
                        //model.GlobalAttributeList = AttributeEditModel.GetGlobalAttributeList(context, apId);
                    }                    
                    //get distinct organizations from the table "eTracks", which store all of the email tracking data
                    model.Organizations = _eTracks.Select(x => x.Organization).Distinct().ToList();
                    //get distinct dates of the ViewData column from the table
                    model.ViewDates = _eTracks.Select(x => x.ViewDate).Distinct().ToList();
                    //get distinct contact names from the table
                    model.ContactNames = _eTracks.Select(x => x.ContactName).Distinct().ToList();
                    //get distinct blast ids from the table
                    model.BlastIds = _eTracks.Select(x => x.BlastId).Distinct().ToList();

                    //If there is a parameter of organization in the URL, filter the tracking data by organization.
                    string[] organs = { };
                    if (!string.IsNullOrEmpty(organization))
                    {
                        organization = HttpUtility.HtmlDecode(organization);
                        organs = organization.Split(',');
                        _eTracks = _eTracks.Where(p => p.Organization != null && organs.Contains(p.Organization.Replace("+", " ").Trim())).Distinct().ToList();
                        _eTracks = _eTracks.GroupBy(x => x.Organization).Select(x => x.FirstOrDefault()).Distinct().ToList();
                    }
                    //If there is a parameter of contact name in the URL, filter the tracking data by contact name.
                    string[] cnames = { };
                    if (!string.IsNullOrEmpty(contactname))
                    {
                        contactname = HttpUtility.HtmlDecode(contactname);
                        cnames = contactname.Split(',');
                        _eTracks = _eTracks.Where(p => cnames.Contains(p.ContactName.Replace("+", " ").Trim())).Distinct().ToList();
                        _eTracks = _eTracks.GroupBy(x => x.ContactName).Select(x => x.FirstOrDefault()).Distinct().ToList();
                    }
                    //If there is a parameter of blast id in the URL, filter the tracking data by blast id.				
                    string[] blastids = { };
                    if (!string.IsNullOrEmpty(blastid))
                    {
                        blastids = blastid.Split(',');
                        _eTracks = _eTracks.Where(p => blastids.Contains(p.BlastId)).Distinct().ToList();
                    }
                    //If there is a parameter of viewdate in the URL, filter the tracking data by year of the ViewDate column.
                    DateTime _date = DateTime.MinValue;
                    List<DateTime> datelist = new List<DateTime>();
                    if (!string.IsNullOrEmpty(viewdate))
                    {
                        var dates = viewdate.Split(',');
                        foreach (var d in dates)
                        {
                            _date = DateTime.Parse(d.Replace("Y", ""));
                            datelist.Add(_date);
                        }

                        _eTracks = _eTracks.Where(p => datelist.Contains(p.ViewDate.Date)).Distinct().ToList();
                    }

                    foreach (var item in _eTracks)
                    {
                        if (!model.eTracks.Any(x => x.ContactId == item.ContactId))
                        {
                            var etrack = new eTrackModel
                            {
                                Id = item.Id,
                                BlastId = item.BlastId,
                                ContactId = item.ContactId,
                                ContactName = item.ContactName,
                                ViewDate = item.ViewDate,
                                Organization = item.Organization,
                                Phone = item.Phone,
                                Email = item.Email,
                                IP = item.IP,
                                //CreateTime = item.CreateTime,
                                //BlastSubject = eBlastEditModel.Get(int.Parse(item.BlastId)).blSubject
                            };
                            model.eTracks.Add(etrack);
                        }
                    }

                    model.eTracks = model.eTracks.OrderByDescending(x => x.ViewDate).ToList();

                    //initialize the PagingInfo model
                    model.PagingInfo = new PagingInfo
                    {
                        CurrentPage = (int)PageNo,
                        ItemsPerPage = (int)PageSize == 0 ? int.Parse(ConfigurationManager.AppSettings["eTrackPageSize"]) : (int)PageSize,
                    };

                    var sortColumnIndex = SortCol;
                    var sortDirection = SortOrder;

                    model.CurrentSortOrder = SortOrder;
                    model.SortCol = SortCol;

                    model.ContactCount = model.eTracks.Select(x => x.ContactName).Distinct().Count();

                    //fill the model with related properties gained from above:
                    model.PagingInfo.TotalItems = model.eTracks.Count();
                    model.CurrentOrganization = organization;
                    model.CurrentContactName = contactname;
                    model.CurrentBlastId = blastid;
                    model.CurrentViewDate = viewdate;
                    model.CurrentToken = pass;

                    model.PagingEtrackList = model.eTracks.ToPagedList(model.PagingInfo.CurrentPage, model.PagingInfo.ItemsPerPage);
                }

                return View(model);
            }
            else
            {
                //if the query string of the password does not equal to the current one, users will not be allowed to access the tracking result page and thus redirected to an unauthorization-warning page.
                return RedirectToAction("UnAuthorized");
            }
            //}
            //else
            //{
            //    ViewTrackModel model = new ViewTrackModel();
            //    model.PagingEtrackList = null;
            //    return View(model);
            //}
        }


        //Unauthorization-warning Page, for those users without correct password
        public ViewResult UnAuthorized()
        {
            return View();
        }

        /// <summary>
        /// create fake data before the tracking table is filled with real data, mainly for coding development only.
        /// </summary>
        //public string MockData()
        //{
        //    econtext = new PPWDbContext(Session["DBName"].ToString());
        //    for (int i = 0; i < 100; i++)
        //    {
        //        eTrack log = new eTrack
        //        {
        //            BlastId = "Blast " + i,
        //            ContactId = "Contact " + i,
        //            ContactName = RandomString(15),
        //            Organization = RandomString(20),
        //            Email = "test" + i + "@test.com",
        //            Phone = RandomDigits(8),
        //            ViewDate = DateTime.Now,
        //            IP = "127.0.0.1"
        //        };
        //        econtext.eTracks.Add(log);
        //    }
        //    econtext.SaveChanges();
        //    return "done";
        //}


        private static Random random = new Random();
        private static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        private string RandomDigits(int length)
        {
            var random = new Random();
            string s = string.Empty;
            for (int i = 0; i < length; i++)
                s = String.Concat(s, random.Next(10).ToString());
            return s;
        }

        protected override void Dispose(bool disposing)
        {            
            base.Dispose(disposing);
        }
    }

    
}