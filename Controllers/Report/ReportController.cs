using PPWDAL;
using SmartBusinessWeb.Infrastructure;
using PPWLib.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using ModelHelper = PPWLib.Helpers.ModelHelper;
using PPWLib.Models.Item;
using PPWLib.Helpers;

namespace SmartBusinessWeb.Controllers.Report
{
    [CustomAuthenticationFilter]
    public class ReportController : BaseController
    {
        [HandleError]
        [CustomAuthorize("reports", "admin1", "admin", "superadmin")]
        public ActionResult ShowCPS()
        {
            SessUser user = Session["User"] as SessUser;
            ViewBag.ParentPage = "dayends";
            ViewBag.PageName = "CPS";
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                CountPaymentSummary model = new CountPaymentSummary();
                Session session = ModelHelper.GetCurrentSession(context);
                var sessionId = session.sesUID;
                if (session != null)
                {
                    DateTime frmtime = session.sesTimeFr;
                    DateTime totime = (DateTime)session.sesTimeTo;

                    var saleslist = context.RtlSales.Where(x => x.rtsSalesLoc.ToLower() == session.sesShop.ToLower() && x.rtsTime >= frmtime && x.rtsTime <= totime && (x.rtsType == "RS" || x.rtsType == "RF")).ToList();

                    if (saleslist.Count > 0)
                    {
                        //kick out invoices processing deposit remanin:
                        foreach (var item in saleslist.ToList())
                        {
                            if (item.rtsRefCode != null && item.rtsRefCode.StartsWith("DE"))
                            {
                                saleslist.Remove(item);
                            }
                        }
                        model.SalesTotal = (decimal)saleslist.Sum(x => x.rtsFinalTotal);
                        model.MonthlyPayTotal = (decimal)saleslist.Where(x => x.rtsMonthBase == true).Sum(x => x.rtsFinalTotal);
                    }

                    var refunds = context.RtlSales.Where(x => x.rtsSalesLoc.ToLower() == session.sesShop.ToLower() && x.rtsTime >= frmtime && x.rtsTime <= totime && x.rtsType == "RF").ToList();
                    if (refunds.Count > 0)
                    {
                        model.RefundTotal = (decimal)refunds.Sum(x => x.rtsFinalTotal);
                    }



                    model.SessionLnViews = (from sl in context.SessionLns
                                            where sl.sessionId == sessionId
                                            select new SessionLnView
                                            {
                                                selPayMethod = sl.selPayMethod,
                                                selAmtSys = sl.selAmtSys,
                                                selAmtCount = sl.selAmtCount
                                            }
                                            ).ToList();
                    model.TotalExpectedAmt = (decimal)model.SessionLnViews.Sum(x => x.selAmtSys);
                    model.TotalActualAmt = (decimal)model.SessionLnViews.Sum(x => x.selAmtCount);
                    model.TotalDiffAmt = model.TotalExpectedAmt - model.TotalActualAmt;

                    model.Frmtime = frmtime;
                    model.Totime = totime;
                    model.Device = ModelHelper.GetDevice(user.surUID, context);
                }

                return View(model);
            }
        }

        [HandleError]
        [CustomAuthorize("reports", "admin1", "admin", "superadmin")]
        public ActionResult ShowCPD()
        {
            SessUser user = Session["User"] as SessUser;
            ViewBag.ParentPage = "dayends";
            ViewBag.PageName = "CPD";
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                CountPaymentDetail model = new CountPaymentDetail();
                //string token = Session["SessionToken"].ToString();
                //Session session = context.Sessions.FirstOrDefault(x => x.sesToken == token);
                Session session = ModelHelper.GetCurrentSession(context);
                var sessionId = session.sesUID;
                if (session != null)
                {
                    DateTime frmtime = session.sesTimeFr;
                    DateTime totime = (DateTime)session.sesTimeTo;

                    var saleslist = context.RtlSales.Where(x => x.rtsSalesLoc.ToLower() == session.sesShop.ToLower() && x.rtsTime >= frmtime && x.rtsTime <= totime && x.rtsType == "RS").ToList();
                    if (saleslist.Count > 0)
                    {
                        //kick out invoices processing deposit remanin:
                        foreach (var item in saleslist.ToList())
                        {
                            if (item.rtsRefCode != null && item.rtsRefCode.StartsWith("DE"))
                            {
                                saleslist.Remove(item);
                            }
                        }
                        model.SalesTotal = (decimal)saleslist.Sum(x => x.rtsFinalTotal);
                        model.MonthlyPayTotal = (decimal)saleslist.Where(x => x.rtsMonthBase == true).Sum(x => x.rtsFinalTotal);
                    }

                    var refunds = context.RtlSales.Where(x => x.rtsSalesLoc.ToLower() == session.sesShop.ToLower() && x.rtsTime >= frmtime && x.rtsTime <= totime && x.rtsType == "RF").ToList();
                    if (refunds.Count > 0)
                    {
                        model.RefundTotal = (decimal)refunds.Sum(x => x.rtsFinalTotal);
                    }
                    string shopcode = session.sesShop.ToLower();

                    model.SalesList = (from s in context.RtlSales
                                       //join u in context.SysUsers
                                       //on s.rtsUpLdLog equals u.UserCode
                                       join p in context.RtlPays
                                       on s.rtsCode equals p.rtpCode
                                       where s.rtsTime >= frmtime && s.rtsTime <= totime && s.rtsType == "RS" && s.rtsSalesLoc.ToLower() == shopcode && p.rtpSalesLoc.ToLower() == shopcode 
                                            //&& u.surIsActive == true && u.shopCode.ToLower() == shopcode
                                       select new SalesModel
                                       {
                                           rtsTime = s.rtsTime,
                                           rtsCode = s.rtsCode,
                                           rtsUpLdLog = s.rtsUpldBy,
                                           rtsFinalTotal = s.rtsFinalTotal,
                                           payId = p.rtpUID,
                                           rtsMonthBase = s.rtsMonthBase
                                       }
                                            ).ToList();

                    model.RefundList = (from s in context.RtlSales
                                        //join u in context.SysUsers
                                        //on s.rtsUpLdLog equals u.UserCode
                                        join p in context.RtlPays
                                        on s.rtsCode equals p.rtpCode
                                        where s.rtsTime >= frmtime && s.rtsTime <= totime && s.rtsType == "RF" && s.rtsSalesLoc.ToLower() == shopcode && p.rtpSalesLoc.ToLower() == shopcode 
                                        //&& u.surIsActive == true && u.shopCode.ToLower() == shopcode
                                        select new SalesModel
                                        {
                                            rtsTime = s.rtsTime,
                                            rtsCode = s.rtsCode,
                                            rtsUpLdLog = s.rtsUpldBy,
                                            rtsFinalTotal = s.rtsFinalTotal,
                                            payId = p.rtpUID,
                                            rtsMonthBase = s.rtsMonthBase
                                        }
                                            ).ToList();

                    model.PayLnViews = (from pl in context.RtlPayLns
                                        join p in context.RtlPays
                                        on pl.payId equals p.rtpUID
                                        where p.rtpTime >= frmtime && p.rtpTime <= totime && p.rtpSalesLoc.ToLower() == shopcode
                                        select new PayLnView
                                        {
                                            payId = pl.payId,
                                            pmtCode = pl.pmtCode,
                                            Amount = pl.Amount
                                        }
                                        ).ToList();

                    model.GroupedPayAmt = new List<IGrouping<string, PayLnView>>();
                    model.GroupedPayAmt = model.PayLnViews.GroupBy(x => x.pmtCode).ToList();

                    model.DicPayAmt = new Dictionary<string, decimal>();
                    foreach (var group in model.GroupedPayAmt)
                    {
                        model.DicPayAmt.Add(group.Key, group.Sum(x => x.Amount));
                    }

                    foreach (var item in model.SalesList)
                    {
                        foreach (var payln in model.PayLnViews)
                        {
                            if (item.payId == payln.payId)
                            {
                                item.PayLnViews.Add(payln);
                            }
                        }
                    }

                    foreach (var item in model.RefundList)
                    {
                        foreach (var payln in model.PayLnViews)
                        {
                            if (item.payId == payln.payId)
                            {
                                item.PayLnViews.Add(payln);
                            }
                        }
                    }

                    model.TotalPayAmt = model.PayLnViews.Sum(x => x.Amount);

                    model.Frmtime = frmtime;
                    model.Totime = totime;
                    model.Device = ModelHelper.GetDevice(user.surUID, context);
                }

                return View(model);
            }
        }

        [HandleError]
        [CustomAuthorize("reports", "admin1", "admin", "superadmin")]
        public ActionResult ShowSIS()
        {
            SessUser user = Session["User"] as SessUser;
            ViewBag.ParentPage = "dayends";
            ViewBag.PageName = "SIS";
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                SessionItemSales model = new SessionItemSales();
                Session session = ModelHelper.GetCurrentSession(context);
                string location = session.sesShop.ToLower();

                if (session != null)
                {
                    int apId = session.AccountProfileId;
                    var sessionId = session.sesUID;
                    DateTime frmtime = session.sesTimeFr;
                    DateTime totime = (DateTime)session.sesTimeTo;

                    var items = ModelHelper.GetItemList(apId, context);

                    model.SalesLnViews = (from sl in context.RtlSalesLns
                                              //join i in context.MyobItems
                                              //on sl.wslItemCode equals i.itmCode
                                          join s in context.RtlSales
                                          on sl.rtlCode equals s.rtsCode
                                          where s.rtsTime >= frmtime && s.rtsTime <= totime && s.rtsType == "RS" && sl.rtlType == "RS" && s.rtsSalesLoc.ToLower() == location
                                          //&& i.AccountProfileId == session.AccountProfileId
                                          select new SalesLnView
                                          {
                                              rtlCode = sl.rtlCode,
                                              rtlQty = (int)sl.rtlQty,
                                              rtlSalesAmt = sl.rtlSalesAmt,
                                              //Item = new ItemModel
                                              //{
                                              // itmCode = i.itmCode,
                                              // itmDesc = i.itmDesc,
                                              // itmName = i.itmName,
                                              // itmBaseSellingPrice = i.itmBaseSellingPrice
                                              //},
                                              rtlDate = sl.rtlDate,
                                              rtlSellingPrice = sl.rtlSellingPrice,
                                              rtlItemCode = sl.rtlItemCode,
                                              rtlRefSales = sl.rtlRefSales,
                                              rtsTime = s.rtsTime
                                          }
                                            ).OrderBy(x => x.rtsTime).ToList();
                    foreach (var salesln in model.SalesLnViews)
                    {
                        foreach (var i in items)
                        {
                            if (salesln.rtlItemCode == i.itmCode)
                            {
                                salesln.Item = new ItemModel
                                {
                                    itmCode = i.itmCode,
                                    itmDesc = i.itmDesc,
                                    itmName = i.itmName,
                                    itmLastSellingPrice = i.itmLastSellingPrice
                                };
                            }
                        }
                    }

                    model.RefundLnViews = (from sl in context.RtlSalesLns
                                               //join i in context.MyobItems
                                               //on sl.wslItemCode equals i.itmCode
                                           join s in context.RtlSales
                                           on sl.rtlCode equals s.rtsCode
                                           where s.rtsTime >= frmtime && s.rtsTime <= totime && s.rtsType == "RF" && sl.rtlType == "RF" && s.rtsSalesLoc.ToLower() == location
                                           //&& i.AccountProfileId == session.AccountProfileId
                                           select new SalesLnView
                                           {
                                               rtlCode = sl.rtlCode,
                                               rtlQty = (int)sl.rtlQty,
                                               rtlSalesAmt = sl.rtlSalesAmt,
                                               //Item = new ItemModel
                                               //{
                                               // itmCode = i.itmCode,
                                               // itmDesc = i.itmDesc,
                                               // itmName = i.itmName,
                                               // itmBaseSellingPrice = i.itmBaseSellingPrice
                                               //},
                                               rtlDate = sl.rtlDate,
                                               rtlSellingPrice = sl.rtlSellingPrice,
                                               rtlItemCode = sl.rtlItemCode,
                                               rtlRefSales = sl.rtlRefSales,
                                               rtsTime = s.rtsTime
                                           }
                                                                ).OrderBy(x => x.rtsTime).ToList();
                    foreach (var salesln in model.RefundLnViews)
                    {
                        foreach (var i in items)
                        {
                            if (salesln.rtlItemCode == i.itmCode)
                            {
                                salesln.Item = new ItemModel
                                {
                                    itmCode = i.itmCode,
                                    itmDesc = i.itmDesc,
                                    itmName = i.itmName,
                                    itmLastSellingPrice = i.itmLastSellingPrice
                                };
                            }
                        }
                    }

                    //kick out invoices processing deposit remanin:
                    foreach (var item in model.SalesLnViews.ToList())
                    {
                        if (item.rtlRefSales != null && item.rtlRefSales.StartsWith("DE"))
                        {
                            model.SalesLnViews.Remove(item);
                        }
                    }

                    model.Frmtime = frmtime;
                    model.Totime = totime;
                    model.Device = ModelHelper.GetDevice(user.surUID, context);

                    model.GroupedItemSales = model.SalesLnViews.GroupBy(x => x.rtlItemCode).ToList();
                    model.GroupedItemRefunds = model.RefundLnViews.GroupBy(x => x.rtlItemCode).ToList();

                    model.TotalAmt = (decimal)model.SalesLnViews.Sum(x => x.rtlSalesAmt) + (decimal)model.RefundLnViews.Sum(x => x.rtlSalesAmt); //plus, not minus!!!
                    model.TotalQty = (int)model.SalesLnViews.Sum(x => x.rtlQty) + (int)model.RefundLnViews.Sum(x => x.rtlQty); //plus, not minus!!!
                }

                return View(model);
            }
        }

        [HandleError]
        [CustomAuthorize("reports", "admin1", "admin", "superadmin")]
        public ActionResult ShowTXD()
        {
            ViewBag.ParentPage = "generalreports";
            ViewBag.PageName = "TXD";
            TransactionDetail model = ReportHelper.GetTransactionDetail(null, DateFormat);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("reports", "admin1", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ShowTXD(FormCollection formCollection)
        {
            ViewBag.ParentPage = "generalreports";
            ViewBag.PageName = "TXD";
            TransactionDetail model = ReportHelper.GetTransactionDetail(formCollection, DateFormat);    
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("reports", "admin1", "admin", "superadmin")]
        public ActionResult ShowPMD()
        {
            ViewBag.ParentPage = "generalreports";
            ViewBag.PageName = "PMD";
            PaymentMethodDetail model = ReportHelper.GetPaymentMethodDetail(null, DateFormat);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("reports", "admin1", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ShowPMD(FormCollection formCollection)
        {
            ViewBag.ParentPage = "generalreports";
            ViewBag.PageName = "PMD";
            PaymentMethodDetail model = ReportHelper.GetPaymentMethodDetail(formCollection, DateFormat);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("reports", "admin1", "admin", "superadmin")]
        public ActionResult ShowITS()
        {
            ViewBag.ParentPage = "generalreports";
            ViewBag.PageName = "ITS";
            ItemSales model = ReportHelper.GetItemSales(null,DateFormat);
            return View(model);
        }

        [HandleError]
        [CustomAuthorize("reports", "admin1", "admin", "superadmin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ShowITS(FormCollection formCollection)
        {
            ViewBag.ParentPage = "generalreports";
            ViewBag.PageName = "ITS";
            ItemSales model = ReportHelper.GetItemSales(formCollection, DateFormat);
            return View(model);
        }
    }
}