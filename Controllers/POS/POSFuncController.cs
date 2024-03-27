using SmartBusinessWeb.Infrastructure;
using PPWLib.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using PagedList;
using PPWDAL;
using ModelHelper = PPWLib.Helpers.ModelHelper;
using Newtonsoft.Json;
using CommonLib.Models;
using CommonLib.Helpers;
using System.Xml;
using PPWLib.Models.Item;
using PPWLib.Models.POS.Sales;
using PPWLib.Models.Sales;

namespace SmartBusinessWeb.Controllers
{
	[CustomAuthenticationFilter]
	[SessionExpire]
	public class POSFuncController : BaseController
	{
        [HandleError]
        [CustomAuthorize("retail", "boss", "admin", "superadmin")]
        public ActionResult ExcludedInvoices(int PageNo = 1, int SortCol=0, string SortOrder="desc", string Keyword="")
        {
            ViewBag.ParentPage = "sales";
            ViewBag.PageName = "excludedinvoices";
            ExcludedInvoiceEditModel model = new ExcludedInvoiceEditModel();
			model.GetList(PageNo, SortCol, SortOrder, Keyword);
            return View(model);
        }


        [HandleError]
		[CustomAuthorize("retail", "boss", "admin", "superadmin")]
		public ActionResult PendingInvoices(int? PageNo = 1)
		{
			ViewBag.ParentPage = "sales";
			ViewBag.PageName = "pendinginvoices";
			PendingInvoice model = new PendingInvoice();
			using (var context = new PPWDbContext(Session["DBName"].ToString()))
			{
				model.PendingInvoiceList = (from st in context.MyobLocStocks
											join sl in context.RtlSalesLns
											on st.lstItemCode equals sl.rtlItemCode
											join s in context.RtlSales
											on sl.rtlCode equals s.rtsCode
											where st.lstQuantityAvailable <= 0 && st.AccountProfileId == ComInfo.AccountProfileId
											select new SalesLnView
											{
												rtlCode = sl.rtlCode,
												rtlDate = sl.rtlDate,
												rtsTime = s.rtsTime,
												Item = new ItemModel
												{
													itmCode = st.lstItemCode,
													QuantityAvailable = (int)st.lstQuantityAvailable
												}
											}
								   ).ToList();

			}

			if (Session["PendingInvoices"] != null) model.PendingInvoiceList.AddRange((List<SalesLnView>)Session["PendingInvoices"]);
          

			var GroupedPendingInvoices = model.PendingInvoiceList.GroupBy(x => x.rtlCode).ToList();
			int Size_Of_Page = (int)ComInfo.PageLength;
			int No_Of_Page = (PageNo ?? 1);
			model.PagingList = GroupedPendingInvoices.ToPagedList(No_Of_Page, Size_Of_Page);
			return View(model);
		}

		[HandleError]
		[CustomAuthorize("countpayment", "boss", "admin", "superadmin")]
		public ActionResult Dayends()
		{
			ViewBag.PageName = "dayends";
			using (var context = new PPWDbContext(Session["DBName"].ToString()))
			{
				DayEndsModel model = new DayEndsModel();
				model.DayEndsItems = (from f in context.SysFuncs
									  where f.DayEnds == true && f.DayEndsDisplay == true
									  select new DayEndsItem
									  {
										  Code = f.sfnCode,
										  Name = f.sfnNameEng
									  }).ToList();


				foreach (var item in model.DayEndsItems)
				{
					if (item.Code == "COUNTPAYMENT")
					{
						item.Name = Resources.Resource.CountPayments;
					}
				}
				return View(model);
			}
		}

		[HandleError]
		[CustomAuthorize("countpayment", "boss", "admin", "superadmin")]
		[HttpPost]
		[ValidateAntiForgeryToken]
		public ActionResult CountPayments(FormCollection formCollection)
		{
			using (var context = new PPWDbContext(Session["DBName"].ToString()))
			{
				DateTime currDate = DateTime.Now.Date;
				DateTime currTime = DateTime.Now;

				//Session currsess = ModelHelper.GetCurrentSession(context); => must not use this method here!!!                
				Session session = Session["Session"] as Session;
				Session currsess = context.Sessions.Where(x => x.AccountProfileId == ComInfo.AccountProfileId && x.UserCode.ToLower() == session.UserCode.ToLower() && x.sesShop.ToLower() == session.sesShop.ToLower() && x.sesDvc.ToLower() == session.sesDvc.ToLower() && x.sesDateFr == currDate && x.sesIsActive && !x.sesCheckout).OrderByDescending(x => x.sesUID).FirstOrDefault();
				string msg = ""; bool success = false;
				if (currsess != null)
				{
					SessionLn sessionLn = null;
					decimal cashamt = 0;
					var sessionId = currsess.sesUID;
					Dictionary<string, DayendCountPay> dicCountPay = new Dictionary<string, DayendCountPay>();
					dicCountPay = JsonConvert.DeserializeObject<Dictionary<string, DayendCountPay>>(formCollection["dicCountPay"]);
					List<SessionLn> sessionlns = new List<SessionLn>();

					foreach (var d in dicCountPay)
					{
						string key = d.Key;
						sessionLn = new SessionLn
						{
							sessionId = sessionId,
							selPayMethod = d.Key,
							selAmtSys = dicCountPay[key].selAmtSys,
							selAmtCount = dicCountPay[key].selAmtCount,
							AccountProfileId = ComInfo.AccountProfileId,
						};
						if (dicCountPay[key].isCash == 1)
						{
							cashamt += dicCountPay[key].selAmtCount;
						}
						sessionlns.Add(sessionLn);
					}

					decimal monthlypaytotal = Convert.ToDecimal(formCollection["monthlypaytotal"]);
					sessionLn = new SessionLn
					{
						sessionId = currsess.sesUID,
						selPayMethod = "MonthlyPay",
						selAmtSys = monthlypaytotal,
						selAmtCount = 0,
						AccountProfileId = ComInfo.AccountProfileId,
					};
					sessionlns.Add(sessionLn);
					context.SessionLns.AddRange(sessionlns);
					currsess.sesTimeTo = currTime;
					currsess.sesDateTo = currDate;
					currsess.sesRmks = formCollection["Notes"];

					var payIds = formCollection["payIds"];
					context.UpdateDayendCounted4Pays(payIds);
					context.SaveChanges();
					Session["Session"] = currsess;

					bool showreport = context.AppParams.FirstOrDefault(x => x.appParam == "ShowReportButtons" && x.AccountProfileId == ComInfo.AccountProfileId).appVal == "1";
					if (showreport)
					{
						DayEndsModel model = new DayEndsModel();
						model.Reports = (from r in context.Reports
										 where r.Id < 4
										 select new ReportView
										 {
											 Code = r.Code,
											 Name = r.Name
										 }
										 ).ToList();
						foreach (var report in model.Reports)
						{
							if (report.Code.ToLower() == "cps")
							{
								report.Name = Resources.Resource.CountPaymentsSummary;
							}
							if (report.Code.ToLower() == "cpd")
							{
								report.Name = Resources.Resource.CountPaymentsDetail;
							}
							if (report.Code.ToLower() == "sis")
							{
								report.Name = Resources.Resource.SessionItemSales;
							}
							if (report.Code.ToLower() == "txd")
							{
								report.Name = Resources.Resource.TransactionDetails;
							}
							if (report.Code.ToLower() == "pmd")
							{
								report.Name = Resources.Resource.PaymentMethodsDetails;
							}
							if (report.Code.ToLower() == "its")
							{
								report.Name = Resources.Resource.ItemSales;
							}
						}

						//model.Reports.AddPG(model.ExImView);
						Session["Reports"] = model.Reports;
						Session["ExImViews"] = model.ExImViews;
					}
					msg = Resources.Resource.PaymentsCounted;
					success = true;
				}
				else
				{
					//TempData["message"] = Resources.Resource.CurrentDayendsInfoNotFound;
					msg = Resources.Resource.CurrentDayendsInfoNotFound;

				}
				return Json(new { msg, success });

			}
		}

		[HandleError]
		[CustomAuthorize("search", "boss", "admin", "superadmin")]
		public ActionResult Search()
		{
			ViewBag.PageName = "search";
			SearchModel model = new SearchModel();
			return View(model);
		}

		

		[HandleError]
		[CustomAuthorize("refund", "boss", "admin", "superadmin")]
		public ActionResult Refund()
		{
			ViewBag.ParentPage = "sales";
			ViewBag.PageName = "refund";
			RefundViewModel model = new RefundViewModel(ComInfo.Currency);
			return View(model);
		}

		[HttpPost]
		public ActionResult ProcessRefund(SalesModel Refund, List<SalesViewModel> RefundList, List<PayLnView> Payments)
		{
			SessUser user = (SessUser)Session["User"];
			decimal salestotal = 0;
			string refundcode = "";
			ePayResult eresult = new ePayResult();

			#region JS Properties
			int isepay = Refund.rtsEpay ? 1 : 0;
			int CusID = Refund.CusID;
			string Notes = Refund.rtsRmks;
			int Change = (int)Refund.Change;
			string salescode = Refund.salescode;
			string devicecode = Refund.SelectedDevice;
			string epaytype = Refund.epaytype;
			decimal totalamount = (decimal)Refund.rtsFinalTotal;
			#endregion

			using (var context = new PPWDbContext(Session["DBName"].ToString()))
			{
				using (var transaction = context.Database.BeginTransaction())
				{
					try
					{
						if (isepay == 1)
						{
							#region ePayment
							var device = ModelHelper.GetDevice(user.surUID, context); //don't use session, as no new refundno will be retreived.				
							refundcode = ModelHelper.GetNewRefundCode(devicecode, device, context);
							//totalamount *= -1;
							int refundamt = (bool)ComInfo.ePayTest ? decimal.ToInt32(totalamount/1000) : decimal.ToInt32(totalamount);
							salestotal = (decimal)context.RtlSales.FirstOrDefault(x => x.rtsCode.ToLower() == salescode.ToLower() && x.AccountProfileId == apId).rtsFinalTotal;

							var _ps = context.ePayments.FirstOrDefault(x => x.out_trade_no.ToUpper() == salescode.ToUpper() && x.AccountProfileId == apId);
							if (_ps != null)
							{
								PayService payService = new PayService(_ps.auth_code, _ps.out_trade_no, _ps.body.Split(',').ToList(), decimal.ToInt32(salestotal), ePayMode.Refund);
								payService.OutRefundNo = refundcode;
								payService.RefundFee = refundamt;

								SalesEditModel.GenEpaySignature(ref payService, ePayMode.Refund);


								/* payment xml for reference only:
                                 * string xml = $"<xml><auth_code><![CDATA[{payService.AuthCode}]]></auth_code><body><![CDATA[{payService.Body}]]></body><mch_create_ip><![CDATA[{payService.MachineCreateIP}]]></mch_create_ip><mch_id><![CDATA[{payService.MerchantID}]]></mch_id><nonce_str><![CDATA[{payService.Nonce}]]></nonce_str><out_trade_no><![CDATA[{payService.OutTradeNo}]]></out_trade_no><service><![CDATA[{payService.Service}]]></service><total_fee><![CDATA[{payService.TotalFee}]]></total_fee><sign><![CDATA[{payService.Signature}]]></sign><notify_url><![CDATA[{payService.NotifyUrl}]]></notify_url></xml>";
                                 */
								/*return string.Format("mch_id={0}&nonce_str={1}&op_user_id={7}&out_refund_no={4}&out_trade_no={2}&refund_fee={6}&service={3}&total_fee={5}", payservice.MerchantID, payservice.Nonce, payservice.OutTradeNo, payservice.Service, payservice.OutRefundNo, payservice.TotalFee, payservice.RefundFee, payservice.MerchantID);
                                 */
								string xml = $"<xml><auth_code><![CDATA[{payService.AuthCode}]]></auth_code><body><![CDATA[{payService.Body}]]></body><mch_create_ip><![CDATA[{payService.MachineCreateIP}]]></mch_create_ip><mch_id><![CDATA[{payService.MerchantID}]]></mch_id><nonce_str><![CDATA[{payService.Nonce}]]></nonce_str><op_user_id><![CDATA[{payService.MerchantID}]]></op_user_id><out_refund_no><![CDATA[{payService.OutRefundNo}]]></out_refund_no><out_trade_no><![CDATA[{payService.OutTradeNo}]]></out_trade_no><refund_fee><![CDATA[{payService.RefundFee}]]></refund_fee><service><![CDATA[{payService.Service}]]></service><total_fee><![CDATA[{payService.TotalFee}]]></total_fee><sign><![CDATA[{payService.Signature}]]></sign><notify_url><![CDATA[{payService.NotifyUrl}]]></notify_url></xml>";

								payService.GateWayUrl = ConfigurationManager.AppSettings["RefundGatewayUrl"];
								var xmlDoc = XMLHelper.PostXML(payService.GateWayUrl, xml);

								XmlNodeList nodelist = xmlDoc.SelectNodes("/xml");

								if (nodelist != null)
								{
									PayService ps = SalesEditModel.GetStatusResult(nodelist);
									var status = ps.Status;
									var resultcode = ps.ResultCode;
									var message = ps.Message;

									if (status == "0")
									{
										if (resultcode != "0")
										{
											ps = SalesEditModel.HandleUnSuccessfulResult(context, payService, nodelist, status, resultcode, ePayMode.Refund, apId);
											context.SaveChanges();
											eresult = new ePayResult
											{
												Message = ps.Message,
												Status = 0,
											};
										}
										else
										{
											/*
                                         * transaction_id Yes String(32) The unique trade reference of platform system. 
                                         * out_trade_no Yes String(32) The unique transaction order id of merchant system. 
                                         * out_refund_no Yes String(32) Specifies the internal refund number, which is uniqueinthemerchant system. 
                                         * refund_id Yes String(32) Specifies the internal refund number, which is uniqueintheplatform system. 
                                         * refund_channel Yes String(16) Value : ORIGINAL. The money will refund back to whereit camefrom. 
                                         * refund_fee Yes Int Refund amount. The unit of the fee is the minimal unit of thelocalcurrency. Partial refund can be supported. 
                                         * coupon_refund_fee No Int Coupon refund amount. coupon_refund_fee <= refund_fee. refund_fee - coupon_refund_fee = cash refund amount
                                         */
											ps = nodelist.Cast<XmlNode>()
									.Select(x => new PayService()
									{
										TransactionId = x.SelectSingleNode("transaction_id") != null ? x.SelectSingleNode("transaction_id").InnerText : "",
										OutTradeNo = x.SelectSingleNode("out_trade_no") != null ? x.SelectSingleNode("out_trade_no").InnerText : "",
										OutRefundNo = x.SelectSingleNode("out_refund_no") != null ? x.SelectSingleNode("out_refund_no").InnerText : "",
										RefundID = x.SelectSingleNode("refund_id") != null ? x.SelectSingleNode("refund_id").InnerText : "",
										RefundChannel = x.SelectSingleNode("refund_channel") != null ? x.SelectSingleNode("refund_channel").InnerText : "",
										RefundFee = x.SelectSingleNode("refund_fee") != null ? int.Parse(x.SelectSingleNode("refund_fee").InnerText) : 0,
										CouponRefundFee = x.SelectSingleNode("coupon_refund_fee") != null ? int.Parse(x.SelectSingleNode("coupon_refund_fee").InnerText) : 0,
									})
									.FirstOrDefault();
											eRefund erefund = new eRefund
											{
												out_trade_no = ps.OutTradeNo,
												out_refund_no = ps.OutRefundNo,
												refund_fee = ps.RefundFee,
												refund_id = ps.RefundID,
												refund_channel = ps.RefundChannel,
												refund_status = "SUCCESS",
												coupon_refund_fee = ps.CouponRefundFee,
												CreateTime = DateTime.Now,
												AccountProfileId = apId
											};
											context.eRefunds.Add(erefund);
											context.SaveChanges();
											eresult = new ePayResult
											{
												Message = Resources.Resource.eRefundSuccessful,
												Status = 1,
											};
											HandleNormalRefund(RefundList, CusID, Notes, Payments, Change, salescode, devicecode, isepay, epaytype, context, refundcode, user);
										}
									}
									else
									{
										ps = SalesEditModel.HandleEpayErr(context, payService, nodelist, status, resultcode, ePayMode.Refund, apId);
										context.SaveChanges();
										eresult = new ePayResult
										{
											Message = ps.Message,
											Status = 0,
										};
									}
								}
							}
							else
							{
								eresult = new ePayResult
								{
									Message = Resources.Resource.eRefundFailed,
									Status = 0,
								};
							}
							#endregion
						}
						else
						{
							refundcode = HandleNormalRefund(RefundList, CusID, Notes, Payments, Change, salescode, devicecode, isepay, epaytype, context, "", user);
						}

						transaction.Commit();
						return Json(new { msg = "", refundcode, eresult });

					}
					catch (Exception ex)
					{
						transaction.Rollback();
						throw new Exception(ex.Message);
					}
				}
			}
		}

		private string HandleNormalRefund(List<SalesViewModel> RefundList, int CusID, string Notes, List<PayLnView> Payments, decimal Change, string salescode, string devicecode, int isepay, string epaytype, PPWDbContext context, string refundcode, SessUser user)
		{
			List<RtlSalesLn> SalesLines = new List<RtlSalesLn>();
			List<RtlPayLn> PayLnList = new List<RtlPayLn>();
			Dictionary<string, Dictionary<string, int>> dicItemLocQty = new Dictionary<string, Dictionary<string, int>>();

			var itemcodes = RefundList.Select(x => x.itemcode).Distinct().ToList();
			foreach (var itemcode in itemcodes)
			{
				dicItemLocQty[itemcode] = new Dictionary<string, int>();
			}

			List<PaymentType> PaymentTypes = new List<PaymentType>();
			DeviceModel device = new DeviceModel();
			device = ModelHelper.GetDevice(user.surUID, context); //don't use session, as no new refundno will be retreived.		
			decimal totaldiscpc = 0;
			decimal totaldiscountamt = 0;
			decimal totalamount = 0;
			decimal totaltaxamt = 0;
			decimal finaltotal = 0;
			Session session = ModelHelper.GetCurrentSession(context);
			int apId = session.AccountProfileId;

			if (string.IsNullOrEmpty(refundcode)) refundcode = ModelHelper.GetNewRefundCode(devicecode, device, context);

			TaxModel taxModel = ModelHelper.GetTaxInfo(context);
			var taxableitems = ModelHelper.GetTaxableItemList(context, CheckoutPortal);

			var refsaleslns = context.RtlSalesLns.Where(x => x.rtlCode.ToLower() == salescode.ToLower() && x.AccountProfileId == apId).ToList();

			foreach (SalesViewModel refundln in RefundList)
			{
				var refsalesln = refsaleslns.FirstOrDefault(x => x.rtlSeq == refundln.rtlSeq);
				if (refsalesln != null)
				{
					decimal discountamt = Math.Round(refundln.price * refundln.qtyToRefund * (refundln.discount / 100), 2);
					decimal taxamt = 0;
					decimal excltaxamt = 0;
					decimal incltaxamt = 0;
					decimal taxrate = 0;
					decimal sellingprice = refundln.price;

					if (taxModel.EnableTax)
					{
						if (taxModel.TaxType == TaxType.Inclusive)
						{
							if (taxableitems.Count > 0 && taxableitems.Any(x => x.itmCode.ToLower() == refundln.itemcode.ToLower()))
							{
								sellingprice = PPWCommonLib.CommonHelpers.ModelHelper.GetUnIncluTaxedPrice(refundln.price, taxModel.TaxRate);
								//taxrate = taxModel.TaxRate; MUST NOT UNCOMMENT!!!
								taxamt = incltaxamt = refundln.qtyToRefund * PPWCommonLib.CommonHelpers.ModelHelper.GetIncluTax(refundln.price, taxModel.TaxRate);
								taxrate = CheckoutPortal == "kingdee" ? (decimal)taxableitems.FirstOrDefault(x => x.itmCode == refundln.itemcode).itmTaxPc : taxModel.TaxRate;
							}
						}
						else
						{
							taxrate = refundln.taxrate;
							taxamt = excltaxamt = Math.Round(refundln.price * refundln.qtyToRefund * (refundln.taxrate / 100), 2);
						}
					}

					RtlSalesLn rtlSalesLn = new RtlSalesLn(); //MUST not use object initializer in the loop, otherwise will get error.    
					rtlSalesLn.rtlSalesLoc = refsalesln.rtlSalesLoc;
					rtlSalesLn.rtlStockLoc = refundln.rtlStockLoc;
					rtlSalesLn.rtlDvc = devicecode;
					rtlSalesLn.rtlCode = refundcode;
					rtlSalesLn.rtlRefSales = salescode;
					rtlSalesLn.rtlSeq = refundln.rtlSeq;
					rtlSalesLn.rtlItemCode = refundln.itemcode;
					rtlSalesLn.rtlDesc = refsalesln.rtlDesc;
					rtlSalesLn.rtlLineDiscAmt = discountamt;
					rtlSalesLn.rtlLineDiscPc = refundln.discount;
					rtlSalesLn.rtlTaxPc = refundln.rtlTaxPc;
					rtlSalesLn.rtlQty = -1 * refundln.qtyToRefund;
					rtlSalesLn.rtlTaxAmt = taxamt;
					rtlSalesLn.rtlDate = DateTime.Now;
					rtlSalesLn.rtlSalesAmt = -1 * refundln.amt;
					rtlSalesLn.rtlType = "RF";
					rtlSalesLn.rtlSellingPrice = refundln.price;
					rtlSalesLn.rtlCheckout = false;
					rtlSalesLn.rtlRrpTaxIncl = incltaxamt;
					rtlSalesLn.rtlRrpTaxExcl = excltaxamt;
					rtlSalesLn.rtlSellingPriceMinusInclTax = sellingprice;
					rtlSalesLn.JobID = refsalesln.JobID;
					rtlSalesLn.AccountProfileId = ComInfo.AccountProfileId;

					if (dicItemLocQty.ContainsKey(refundln.itemcode) && dicItemLocQty[refundln.itemcode].ContainsKey(refundln.rtlStockLoc))
					{
						dicItemLocQty[refundln.itemcode][refundln.rtlStockLoc] += refundln.qtyToRefund;
					}
					else
					{
						dicItemLocQty[refundln.itemcode][refundln.rtlStockLoc] = refundln.qtyToRefund;
					}

					SalesLines.Add(rtlSalesLn);

					totaltaxamt += taxamt;

					totaldiscpc += refundln.discount;
					totaldiscountamt += discountamt;
					totalamount += -1 * refundln.amt;
				}

			}

			decimal linetotal = totalamount;
			finaltotal = (taxModel.TaxType == TaxType.Inclusive) ? totalamount : totalamount + totaltaxamt;

			var sales = context.RtlSales.FirstOrDefault(x => x.rtsCode.ToLower() == salescode.ToLower() && x.AccountProfileId == apId);
			if (sales != null)
			{
				string remark = string.IsNullOrEmpty(sales.rtsRmks) ? Notes : string.Concat(sales.rtsRmks, " ", Notes);
				RtlSale rtlSale = new RtlSale
				{
					rtsSalesLoc = sales.rtsSalesLoc,
					rtsDvc = devicecode,
					rtsCode = refundcode,
					rtsRefCode = salescode,
					rtsType = "RF",
					rtsCusID = CusID,
					rtsCurrency = sales.rtsCurrency,
					rtsExRate = sales.rtsExRate,
					rtsLineTotal = linetotal,
					rtsLineTotalPlusTax = finaltotal,
					rtsFinalDisc = totaldiscpc,
					rtsFinalDiscAmt = totaldiscountamt,
					rtsFinalTotal = finaltotal,
					rtsRmks = remark,
					rtsInternalRmks = sales.rtsInternalRmks,
					rtsUpldBy = user.UserName,
					rtsStatus = "created",
					rtsDate = DateTime.Now.Date,
					rtsTime = DateTime.Now,

					rtsMonthBase = false,
					rtsLineTaxAmt = totaltaxamt,
					rtsEpay = isepay == 1,

					rtsDeliveryAddress1 = sales.rtsDeliveryAddress1,
					rtsDeliveryAddress2 = sales.rtsDeliveryAddress2,
					rtsDeliveryAddress3 = sales.rtsDeliveryAddress3,
					rtsDeliveryAddress4 = sales.rtsDeliveryAddress4,

					rtsCustomerPO = sales.rtsCustomerPO,
					rtsDeliveryDate = sales.rtsDeliveryDate,
					rtsSaleComment = sales.rtsSaleComment,
					rtsAllLoc = sales.rtsAllLoc,

					rtsCheckout = false,
					rtsCheckoutPortal = CheckoutPortal,
					AccountProfileId = sales.AccountProfileId,
					rtsCreateTime = DateTime.Now,
				};
				context.RtlSales.Add(rtlSale);
			}


			if (device.dvcCode == devicecode)
			{
				bool minusqtyonrefund = context.AppParams.FirstOrDefault(x => x.appParam == "EnableMinusStockOnRefund" && x.AccountProfileId == apId).appVal == "1";
				if (!minusqtyonrefund)
				{					
                    SalesEditModel.HandleStockQty(context, dicItemLocQty, false);
                    SalesModel sale = new SalesModel
                    {
                        salescode = refundcode,
                        rtsDvc = devicecode,
                        rtsSalesLoc = device.dvcShop
                    };
                    SalesEditModel.HandleSalesItemVariOptions(context, sale, null, null, RefundList);
				}
			}

			RtlPay rtlPay = new RtlPay
			{
				rtpSalesLoc = device.dvcShop,
				rtpDvc = devicecode,
				rtpCode = refundcode,
				rtpSeq = session.sesDvcSeq,
				rtpPayAmt = totalamount,
				rtpDate = DateTime.Now.Date,
				rtpTime = DateTime.Now,
				rtpTxType = "RF",
				rtpChange = Change,
				rtpEpayType = epaytype,
				AccountProfileId = apId,
			};

			context.RtlSalesLns.AddRange(SalesLines);
			//for debug
			//context.SaveChanges();

			//for debug
			//context.SaveChanges();
			rtlPay = context.RtlPays.Add(rtlPay);
			context.SaveChanges();

			long lastpayId = rtlPay.rtpUID;

			foreach (PayLnView payment in Payments)
			{
				if (payment.Amount > 0)
				{
					decimal amt = CommonHelper.RoundDecimal(payment.Amount);
					if (payment.pmtCode.ToLower() == "cash")
					{
						amt -= CommonHelper.RoundDecimal(Change);
					}
					RtlPayLn rtlPayLn = new RtlPayLn
					{
						payId = lastpayId,
						pmtCode = payment.pmtCode,
						Amount = (-1) * CommonHelper.RoundDecimal(amt),
						AmtReceived = CommonHelper.RoundDecimal(payment.Amount),
						rtplCode = refundcode,
						rtplSalesLoc = device.dvcShop,
						rtplDvc = devicecode,
						rtplDate = DateTime.Now.Date,
						rtplTime = DateTime.Now,
						AccountProfileId = apId,
					};
					PayLnList.Add(rtlPayLn);
				}
			}

			context.RtlPayLns.AddRange(PayLnList);

			Device dvc = context.Devices.Find(device.dvcUID);
			if (dvc != null)
			{
				dvc.dvcNextRefundNo += 1;
			}

			context.SaveChanges();
			return refundcode;
		}


		[HandleError]
		[CustomAuthorize("retail", "boss", "admin", "superadmin")]
		public ActionResult AdvSales(string receiptno = "", string mode = "", string type = "")
		{
			string defaultcheckoutportal = ModelHelper.HandleCheckoutPortal();
			Session["ImportFrmShopPageTitle"] = Resources.Resource.DayendsImportFrmShop;
			Session["ImportFrmCentralPageTitle"] = Resources.Resource.DayendsImportFrmCentral;
			Session["SBToABSSOK"] = Resources.Resource.SBToABSSOK;
			Session["ABSSToSBOK"] = Resources.Resource.ABSSToSBOK;
			ViewBag.DefaultCheckoutPortal = defaultcheckoutportal;
			
			ViewBag.ParentPage = "sales";
			ViewBag.PageName = "advsales";
			SessUser user = Session["User"] as SessUser;
			SalesModel model = new SalesModel(user, receiptno, mode, type);
			return View(model);			
		}

		[HandleError]
		[CustomAuthorize("retail", "boss", "admin", "superadmin")]
		public ActionResult Sales()
		{			
			Session["ImportFrmShopPageTitle"] = Resources.Resource.DayendsImportFrmShop;
			Session["ImportFrmCentralPageTitle"] = Resources.Resource.DayendsImportFrmCentral;
			Session["SBToABSSOK"] = Resources.Resource.SBToABSSOK;
			Session["ABSSToSBOK"] = Resources.Resource.ABSSToSBOK;			

			ViewBag.ParentPage = "sales";
			ViewBag.PageName = "sales";
			SalesModel model = new SalesModel(true);
			return View(model);
		}

		[HttpPost]
		public ActionResult ProcessSales(SalesModel Sales, List<SimpleSalesLn> SimpleSalesLns, List<PayLnView> Payments)
		{
			SalesEditModel model = new SalesEditModel();
			decimal totalpayamt = 0;

			using var context = new PPWDbContext(Session["DBName"].ToString());
			string finalsalescode = model.ProcessSimpleSales(context, Sales, SimpleSalesLns, Payments, ref totalpayamt);
			string msg = Resources.Resource.OrderSavedSuccessfully;
			if (string.IsNullOrEmpty(Sales.authcode))
			{
				return Json(new { msg = "", finalsalescode });
			}
			else
			{
				#region ePayment
				var epayReturn = SalesEditModel.HandleEPayMent4SimpleSales(Sales, SimpleSalesLns, ref totalpayamt, context, finalsalescode, apId);
				var _ps = epayReturn.ps;
				if (epayReturn.nodelist != null)
				{
					if (string.IsNullOrEmpty(epayReturn.message))
					{
						if (epayReturn.status == "0")
						{
							if (epayReturn.resultcode != "0")
							{

								if (_ps.NeedQuery && _ps.ErrCode == "USERPAYING")
								{
									return Json(new { msg = "needquery_userpaying", finalsalescode, _ps, epaystatus = -1 });
								}
								else
								{
									return Json(new { msg = Resources.Resource.ePaymentFailed, finalsalescode, _ps, epaystatus = 0 });
								}
							}
							else
							{
								return Json(new { msg = Resources.Resource.ePaymentSuccessful, finalsalescode, epaystatus = 1 });
							}
						}
						else
						{
							return Json(new { msg = Resources.Resource.ePaymentFailed, finalsalescode, _ps, epaystatus = 0 });

						}
					}
					else
					{
						return Json(new { msg = epayReturn.message, finalsalescode, _ps, epaystatus = 0 });
					}
				}
				else
				{
					return Json(new { msg = Resources.Resource.ePaymentFailed, finalsalescode, _ps, epaystatus = 0 });
				}
				#endregion
			}
		}


		[HttpPost]
		public ActionResult ProcessAdvSales(SalesModel Sales, List<SalesLnView> SalesLnList, List<PayLnView> Payments, List<DeliveryItemModel> DeliveryItems)
		{
			SalesEditModel model = new SalesEditModel();
			decimal totalpayamt = 0;

			using var context = new PPWDbContext(Session["DBName"].ToString());
			string finalsalescode = model.ProcessSales(context, Sales, SalesLnList, Payments, ref totalpayamt, DeliveryItems);
			string msg = Resources.Resource.OrderSavedSuccessfully;			
			if (string.IsNullOrEmpty(Sales.authcode))
			{
				return Json(new { msg = "", finalsalescode });
			}
			else
			{
				#region ePayment
				var epayReturn = SalesEditModel.HandleEPayMent(Sales, SalesLnList, ref totalpayamt, context, finalsalescode, apId);
				var _ps = epayReturn.ps;
				if (epayReturn.nodelist != null)
				{
					if (string.IsNullOrEmpty(epayReturn.message))
					{
						if (epayReturn.status == "0")
						{
							if (epayReturn.resultcode != "0")
							{

								if (_ps.NeedQuery && _ps.ErrCode == "USERPAYING")
								{
									return Json(new { msg = "needquery_userpaying", finalsalescode, _ps, epaystatus = -1 });
								}
								else
								{
									return Json(new { msg = Resources.Resource.ePaymentFailed, finalsalescode, _ps, epaystatus = 0 });
								}
							}
							else
							{
								return Json(new { msg = Resources.Resource.ePaymentSuccessful, finalsalescode, epaystatus = 1 });
							}
						}
						else
						{
							return Json(new { msg = Resources.Resource.ePaymentFailed, finalsalescode, _ps, epaystatus = 0 });

						}
					}
					else
					{
						return Json(new { msg = epayReturn.message, finalsalescode, _ps, epaystatus = 0 });
					}
				}
				else
				{
					return Json(new { msg = Resources.Resource.ePaymentFailed, finalsalescode, _ps, epaystatus = 0 });
				}
				#endregion
			}
		}

		
        [HttpPost]
        public JsonResult RefundEpay(string salescode)
        {
            PayService payService = new PayService();

            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                var _ps = context.ePayments.FirstOrDefault(x => x.out_trade_no.ToUpper() == salescode.ToUpper());
                if (_ps != null)
                {
                    payService = new PayService(_ps.auth_code, _ps.out_trade_no, _ps.body.Split(',').ToList(), _ps.total_fee, ePayMode.Refund);
                    SalesEditModel.GenEpaySignature(ref payService, ePayMode.Refund);

                    string xml = $"<xml><auth_code><![CDATA[{payService.AuthCode}]]></auth_code><body><![CDATA[{payService.Body}]]></body><mch_create_ip><![CDATA[{payService.MachineCreateIP}]]></mch_create_ip><mch_id><![CDATA[{payService.MerchantID}]]></mch_id><nonce_str><![CDATA[{payService.Nonce}]]></nonce_str><op_user_id><![CDATA[{payService.MerchantID}]]></op_user_id><out_refund_no><![CDATA[{payService.OutRefundNo}]]></out_refund_no><out_trade_no><![CDATA[{payService.OutTradeNo}]]></out_trade_no><refund_fee><![CDATA[{payService.RefundFee}]]></refund_fee><service><![CDATA[{payService.Service}]]></service><total_fee><![CDATA[{payService.TotalFee}]]></total_fee><sign><![CDATA[{payService.Signature}]]></sign><notify_url><![CDATA[{payService.NotifyUrl}]]></notify_url></xml>";

                    //string xml = $"<xml><auth_code><![CDATA[{payService.AuthCode}]]></auth_code><body><![CDATA[{payService.Body}]]></body><mch_create_ip><![CDATA[{payService.MachineCreateIP}]]></mch_create_ip><mch_id><![CDATA[{payService.MerchantID}]]></mch_id><op_user_id><![CDATA[{payService.MerchantID}]]></op_user_id><nonce_str><![CDATA[{payService.Nonce}]]></nonce_str><out_refund_no><![CDATA[{payService.OutRefundNo}]]></out_refund_no><service><![CDATA[{payService.Service}]]></service><total_fee><![CDATA[{payService.TotalFee}]]></total_fee><refund_fee><![CDATA[{payService.RefundFee}]]></refund_fee><sign><![CDATA[{payService.Signature}]]></sign><notify_url><![CDATA[{payService.NotifyUrl}]]></notify_url></xml>";

                    var xmlDoc = XMLHelper.PostXML(payService.GateWayUrl, xml);

                    XmlNodeList nodelist = xmlDoc.SelectNodes("/xml");

                    if (nodelist != null)
                    {

                        PayService ps = SalesEditModel.GetStatusResult(nodelist);

                        var status = ps.Status;
                        var resultcode = ps.ResultCode;
                        var message = ps.Message;

                        if (string.IsNullOrEmpty(message))
                        {
                            if (status == "0")
                            {
                                if (resultcode == "1")
                                {
                                    SalesEditModel.HandleUnSuccessfulResult(context, payService, nodelist, status, resultcode, ePayMode.Refund, apId);
                                    context.SaveChanges();
                                    return Json(new { msg = Resources.Resource.PaymentRefundFailed, epaystatus = 0 }, JsonRequestBehavior.AllowGet);
                                }
                                else if (resultcode == "0")
                                {
                                    SalesEditModel.HandleSuccessfulResult(context, payService, nodelist, status, resultcode, ePayMode.Refund);
                                    context.SaveChanges();
                                    return Json(new { msg = Resources.Resource.PaymentRefunded, epaystatus = 1 }, JsonRequestBehavior.AllowGet);
                                }
                            }
                            else
                            {
                                return Json(new { msg = Resources.Resource.PaymentRefundFailed, epaystatus = 0 }, JsonRequestBehavior.AllowGet);
                            }
                        }
                        else
                        {
                            return Json(new { msg = message, epaystatus = 0 }, JsonRequestBehavior.AllowGet);
                        }

                    }
                    else
                    {
                        return Json(new { msg = Resources.Resource.PaymentRefundFailed, epaystatus = 0 }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json(new { msg = Resources.Resource.PaymentRefundFailed, epaystatus = 0 }, JsonRequestBehavior.AllowGet);
                }

                return null;
            }
        }

        [HttpPost]
		public JsonResult ReversePayment(string salescode)
		{
			/*
    return string.Format("mch_id={0}&nonce_str={1}&out_trade_no={2}&service={3}", payservice.MerchantID, payservice.Nonce, payservice.OutTradeNo, payservice.Service);
    */
			PayService payService = new PayService();

			using (var context = new PPWDbContext(Session["DBName"].ToString()))
			{
				var _ps = context.ePayments.FirstOrDefault(x => x.out_trade_no.ToUpper() == salescode.ToUpper());
				if (_ps != null)
				{
					payService = new PayService(_ps.auth_code, _ps.out_trade_no, _ps.body.Split(',').ToList(), _ps.total_fee, ePayMode.Reverse);
					SalesEditModel.GenEpaySignature(ref payService, ePayMode.Reverse);

					/* payment for reference:
                     * string xml = $"<xml><auth_code><![CDATA[{payService.AuthCode}]]></auth_code><body><![CDATA[{payService.Body}]]></body><mch_create_ip><![CDATA[{payService.MachineCreateIP}]]></mch_create_ip><mch_id><![CDATA[{payService.MerchantID}]]></mch_id><nonce_str><![CDATA[{payService.Nonce}]]></nonce_str><out_trade_no><![CDATA[{payService.OutTradeNo}]]></out_trade_no><service><![CDATA[{payService.Service}]]></service><total_fee><![CDATA[{payService.TotalFee}]]></total_fee><sign><![CDATA[{payService.Signature}]]></sign><notify_url><![CDATA[{payService.NotifyUrl}]]></notify_url></xml>";
                     */

					string xml = $"<xml><auth_code><![CDATA[{payService.AuthCode}]]></auth_code><body><![CDATA[{payService.Body}]]></body><mch_create_ip><![CDATA[{payService.MachineCreateIP}]]></mch_create_ip><mch_id><![CDATA[{payService.MerchantID}]]></mch_id><nonce_str><![CDATA[{payService.Nonce}]]></nonce_str><out_trade_no><![CDATA[{payService.OutTradeNo}]]></out_trade_no><service><![CDATA[{payService.Service}]]></service><total_fee><![CDATA[{payService.TotalFee}]]></total_fee><sign><![CDATA[{payService.Signature}]]></sign><notify_url><![CDATA[{payService.NotifyUrl}]]></notify_url></xml>";

					var xmlDoc = XMLHelper.PostXML(payService.GateWayUrl, xml);

					XmlNodeList nodelist = xmlDoc.SelectNodes("/xml");

					if (nodelist != null)
					{

						PayService ps = SalesEditModel.GetStatusResult(nodelist);

						var status = ps.Status;
						var resultcode = ps.ResultCode;
						var message = ps.Message;

						if (string.IsNullOrEmpty(message))
						{
							if (status == "0")
							{
								if (resultcode == "1")
								{
									SalesEditModel.HandleUnSuccessfulResult(context, payService, nodelist, status, resultcode, ePayMode.Reverse,apId);
									context.SaveChanges();
									return Json(new { msg = Resources.Resource.PaymentReverseFailed, epaystatus = 0 });
								}
								else if (resultcode == "0")
								{
									SalesEditModel.HandleSuccessfulResult(context, payService, nodelist, status, resultcode, ePayMode.Reverse);
									context.SaveChanges();
									return Json(new { msg = Resources.Resource.PaymentReversed, epaystatus = 1 });
								}
							}
							else
							{
								return Json(new { msg = Resources.Resource.PaymentReverseFailed, epaystatus = 0 });
							}
						}
						else
						{
							return Json(new { msg = message, epaystatus = 0 });
						}

					}
					else
					{
						return Json(new { msg = Resources.Resource.PaymentReverseFailed, epaystatus = 0 });
					}
				}
				else
				{
					return Json(new { msg = Resources.Resource.PaymentReverseFailed, epaystatus = 0 });
				}

				return null;
			}
		}


		[HttpGet]
		public JsonResult TransactionResult(string salescode)
		{
			PayService payService = new PayService();

			using (var context = new PPWDbContext(Session["DBName"].ToString()))
			{
				var _ps = context.ePayments.FirstOrDefault(x => x.out_trade_no.ToUpper() == salescode.ToUpper());
				if (_ps != null)
				{
					payService = new PayService(_ps.auth_code, _ps.out_trade_no, _ps.body.Split(',').ToList(), _ps.total_fee, ePayMode.TransactionResult);
					SalesEditModel.GenEpaySignature(ref payService, ePayMode.TransactionResult);

					/* payment for reference:
                     * string xml = $"<xml><auth_code><![CDATA[{payService.AuthCode}]]></auth_code><body><![CDATA[{payService.Body}]]></body><mch_create_ip><![CDATA[{payService.MachineCreateIP}]]></mch_create_ip><mch_id><![CDATA[{payService.MerchantID}]]></mch_id><nonce_str><![CDATA[{payService.Nonce}]]></nonce_str><out_trade_no><![CDATA[{payService.OutTradeNo}]]></out_trade_no><service><![CDATA[{payService.Service}]]></service><total_fee><![CDATA[{payService.TotalFee}]]></total_fee><sign><![CDATA[{payService.Signature}]]></sign><notify_url><![CDATA[{payService.NotifyUrl}]]></notify_url></xml>";
                     */

					string xml = $"<xml><auth_code><![CDATA[{payService.AuthCode}]]></auth_code><body><![CDATA[{payService.Body}]]></body><mch_create_ip><![CDATA[{payService.MachineCreateIP}]]></mch_create_ip><mch_id><![CDATA[{payService.MerchantID}]]></mch_id><nonce_str><![CDATA[{payService.Nonce}]]></nonce_str><out_trade_no><![CDATA[{payService.OutTradeNo}]]></out_trade_no><service><![CDATA[{payService.Service}]]></service><total_fee><![CDATA[{payService.TotalFee}]]></total_fee><sign><![CDATA[{payService.Signature}]]></sign><notify_url><![CDATA[{payService.NotifyUrl}]]></notify_url></xml>";

					var xmlDoc = XMLHelper.PostXML(payService.GateWayUrl, xml);

					XmlNodeList nodelist = xmlDoc.SelectNodes("/xml");

					if (nodelist != null)
					{
						PayService ps = SalesEditModel.GetStatusResult(nodelist);

						var status = ps.Status;
						var resultcode = ps.ResultCode;
						var message = ps.Message;

						if (string.IsNullOrEmpty(message))
						{
							if (status == "0")
							{
								if (resultcode != "0")
								{
									return Json(new { msg = Resources.Resource.GetTransactionResultFailed, status = 0 }, JsonRequestBehavior.AllowGet);
								}
								else
								{
									ps = SalesEditModel.HandleSuccessfulResult(context, payService, nodelist, status, resultcode, ePayMode.TransactionResult, false);
									return Json(new { msg = ps.TradeState, status = 1 }, JsonRequestBehavior.AllowGet);
								}
							}
							else
							{
								return Json(new { msg = Resources.Resource.GetTransactionResultFailed, status = 0 }, JsonRequestBehavior.AllowGet);
							}
						}
						else
						{
							return Json(new { msg = message, status = 0 }, JsonRequestBehavior.AllowGet);
						}
					}

					else
					{
						return Json(new { msg = Resources.Resource.GetTransactionResultFailed, status = 0 }, JsonRequestBehavior.AllowGet);
					}
				}
				else
				{
					return Json(new { msg = Resources.Resource.GetTransactionResultFailed, status = 0 }, JsonRequestBehavior.AllowGet);
				}
			}
		}
	}
}