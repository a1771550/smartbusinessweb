using PPWDAL;
using SmartBusinessWeb.Infrastructure;
using PPWLib.Models;
using System.Linq;
using System.Web.Mvc;
using Resources = CommonLib.App_GlobalResources;
using CommonLib.Helpers;
using System.Collections.Generic;

namespace SmartBusinessWeb.Controllers
{
    [CustomAuthenticationFilter]
    public class ReceiptController : BaseController
    {
        [HandleError]
        [CustomAuthorize("receipt", "admin1", "boss", "admin", "superadmin")]
        public ActionResult Index()
        {
            ViewBag.ParentPage = "setup";
            ViewBag.PageName = "receipt";
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {
                ReceiptViewModel model = (from r in context.Receipts
                                          where r.deviceCode.ToLower() == ComInfo.Device.ToLower() && r.shopCode.ToLower() == ComInfo.Shop.ToLower() && r.AccountProfileId == ComInfo.AccountProfileId && r.CompanyId == ComInfo.Id
                                          select new ReceiptViewModel
                                          {
                                              Id = r.Id,
                                              HeaderTitle = r.HeaderTitle + ":" + r.HeaderTitleCN + ":" + r.HeaderTitleEng,
                                              HeaderMessage = r.HeaderMessage + ":" + r.HeaderMessageCN + ":" + r.HeaderMessageEng,
                                              FooterMessage = r.FooterMessage + ":" + r.FooterMessageCN + ":" + r.FooterMessageEng,
                                              FooterTitle1 = r.FooterTitle1 + ":" + r.FooterTitle1CN + ":" + r.FooterTitle1Eng,
                                              FooterTitle2 = r.FooterTitle2 + ":" + r.FooterTitle2CN + ":" + r.FooterTitle2Eng,
                                              FooterTitle3 = r.FooterTitle3 + ":" + r.FooterTitle3CN + ":" + r.FooterTitle3Eng,
                                              CompanyAddress = r.CompanyAddress + ":" + r.CompanyAddressCN + ":" + r.CompanyAddressEng,
                                              CompanyAddress1 = r.CompanyAddress1 + ":" + r.CompanyAddress1CN + ":" + r.CompanyAddress1Eng,
                                              CompanyName = r.CompanyName + ":" + r.CompanyNameCN + ":" + r.CompanyNameEng,
                                              CompanyPhone = r.CompanyPhone,
                                              CompanyWebSite = r.CompanyWebSite,
                                              //Disclaimer = r.Disclaimer + ":" + r.DisclaimerCN + ":" + r.DisclaimerEng
                                          }).FirstOrDefault();

                model.Disclaimers = (from ri in context.ReceiptInfoes                                    
                                     where ri.reId == model.Id
                                     select ri.DisclaimerTxt + ":" + ri.DisclaimerTxtCN + ":" + ri.DisclaimerTxtEng).ToList();

                model.PaymentTerms = (from ri in context.ReceiptInfoes                                     
                                      where ri.reId == model.Id
                                      select ri.PaymentTermsTxt + ":" + ri.PaymentTermsTxtCN + ":" + ri.PaymentTermsTxtEng).ToList();

                int lang = CultureHelper.CurrentCulture;

                model.HeaderTitle = model.HeaderTitle.Split(':')[lang];
                model.HeaderMessage = model.HeaderMessage.Split(':')[lang];
                model.FooterMessage = model.FooterMessage.Split(':')[lang];
                model.FooterTitle1 = model.FooterTitle1.Split(':')[lang];
                model.FooterTitle2 = model.FooterTitle2.Split(':')[lang];
                model.FooterTitle3 = model.FooterTitle3.Split(':')[lang];
                model.CompanyAddress = model.CompanyAddress.Split(':')[lang];
                model.CompanyAddress1 = model.CompanyAddress1.Split(':')[lang];
                model.CompanyName = model.CompanyName.Split(':')[lang];

                model.DisclaimerTxtList = new List<string>();
                model.PaymentTermsTxtList = new List<string>();

                foreach (var disclaimer in model.Disclaimers)
                {
                    model.DisclaimerTxtList.Add(disclaimer.Split(':')[lang]);
                }
                foreach (var pt in model.PaymentTerms)
                {
                    model.PaymentTermsTxtList.Add(pt.Split(':')[lang]);
                }

                return View(model);
            }

        }

        [HandleError]
        [CustomAuthorize("receipt", "admin1", "boss", "admin", "superadmin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult Edit(ReceiptViewModel model, FormCollection formCollection)
        {
            using (var context = new PPWDbContext(Session["DBName"].ToString()))
            {                
                Receipt receipt = context.Receipts.Find(model.Id);
                int lang = CultureHelper.CurrentCulture;

                receipt.CompanyPhone = model.CompanyPhone;
                receipt.CompanyWebSite = model.CompanyWebSite;

                List<ReceiptInfo> reInfo = new List<ReceiptInfo>();
                if (lang == 0)
                {
                    receipt.HeaderMessage = model.HeaderMessage;
                    receipt.HeaderTitle = model.HeaderTitle;
                    receipt.FooterMessage = model.FooterMessage;
                    receipt.FooterTitle1 = model.FooterTitle1;
                    receipt.FooterTitle2 = model.FooterTitle2;
                    receipt.FooterTitle3 = model.FooterTitle3;
                    receipt.CompanyName = model.CompanyName;
                    receipt.CompanyAddress = model.CompanyAddress;
                    receipt.CompanyAddress1 = model.CompanyAddress1;
                    receipt.Disclaimer = model.Disclaimer;

                    if (string.IsNullOrEmpty(receipt.HeaderMessageCN))
                    {
                        receipt.HeaderMessageCN = model.HeaderMessage;
                    }
                    if (string.IsNullOrEmpty(receipt.HeaderTitleCN))
                    {
                        receipt.HeaderTitleCN = model.HeaderTitle;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterMessageCN))
                    {
                        receipt.FooterMessageCN = model.FooterMessage;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle1CN))
                    {
                        receipt.FooterTitle1CN = model.FooterTitle1;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle2CN))
                    {
                        receipt.FooterTitle2CN = model.FooterTitle2;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle3CN))
                    {
                        receipt.FooterTitle3CN = model.FooterTitle3;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyNameCN))
                    {
                        receipt.CompanyNameCN = model.CompanyName;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyAddressCN))
                    {
                        receipt.CompanyAddressCN = model.CompanyAddress;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyAddress1CN))
                    {
                        receipt.CompanyAddress1CN = model.CompanyAddress1;
                    }
                    if (string.IsNullOrEmpty(receipt.DisclaimerCN))
                    {
                        receipt.DisclaimerCN = model.Disclaimer;
                    }

                    if (string.IsNullOrEmpty(receipt.HeaderMessageEng))
                    {
                        receipt.HeaderMessageEng = model.HeaderMessage;
                    }
                    if (string.IsNullOrEmpty(receipt.HeaderTitleEng))
                    {
                        receipt.HeaderTitleEng = model.HeaderTitle;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterMessageEng))
                    {
                        receipt.FooterMessageEng = model.FooterMessage;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle1Eng))
                    {
                        receipt.FooterTitle1Eng = model.FooterTitle1;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle2Eng))
                    {
                        receipt.FooterTitle2Eng = model.FooterTitle2;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle3Eng))
                    {
                        receipt.FooterTitle3Eng = model.FooterTitle3;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyNameEng))
                    {
                        receipt.CompanyNameEng = model.CompanyName;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyAddressEng))
                    {
                        receipt.CompanyAddressEng = model.CompanyAddress;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyAddress1Eng))
                    {
                        receipt.CompanyAddress1Eng = model.CompanyAddress1;
                    }
                    if (string.IsNullOrEmpty(receipt.DisclaimerEng))
                    {
                        receipt.DisclaimerEng = model.Disclaimer;
                    }

                    int idx = 0;
                    while (formCollection["disclaimer[" + idx + "]"] != null)
                    {
                        reInfo.Add(new ReceiptInfo
                        {
                            reId = model.Id,
                            DisclaimerTxt = formCollection["disclaimer[" + idx + "]"]
                        });
                        idx++;
                    }
                    idx = 0;
                    while (formCollection["paymentterms[" + idx + "]"] != null)
                    {                        
                        reInfo[idx].PaymentTermsTxt = formCollection["paymentterms[" + idx + "]"];
                        idx++;
                    }
                }
                if (lang == 1)
                {
                    receipt.HeaderMessageCN = model.HeaderMessage;
                    receipt.HeaderTitleCN = model.HeaderTitle;
                    receipt.FooterMessageCN = model.FooterMessage;
                    receipt.FooterTitle1CN = model.FooterTitle1;
                    receipt.FooterTitle2CN = model.FooterTitle2;
                    receipt.FooterTitle3CN = model.FooterTitle3;
                    receipt.CompanyNameCN = model.CompanyName;
                    receipt.CompanyAddressCN = model.CompanyAddress;
                    receipt.CompanyAddress1CN = model.CompanyAddress1;
                    receipt.DisclaimerCN = model.Disclaimer;

                    if (string.IsNullOrEmpty(receipt.HeaderMessageEng))
                    {
                        receipt.HeaderMessageEng = model.HeaderMessage;
                    }
                    if (string.IsNullOrEmpty(receipt.HeaderTitleEng))
                    {
                        receipt.HeaderTitleEng = model.HeaderTitle;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterMessageEng))
                    {
                        receipt.FooterMessageEng = model.FooterMessage;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle1Eng))
                    {
                        receipt.FooterTitle1Eng = model.FooterTitle1;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle2Eng))
                    {
                        receipt.FooterTitle2Eng = model.FooterTitle2;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle3Eng))
                    {
                        receipt.FooterTitle3Eng = model.FooterTitle3;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyNameEng))
                    {
                        receipt.CompanyNameEng = model.CompanyName;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyAddressEng))
                    {
                        receipt.CompanyAddressEng = model.CompanyAddress;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyAddress1Eng))
                    {
                        receipt.CompanyAddress1Eng = model.CompanyAddress1;
                    }
                    if (string.IsNullOrEmpty(receipt.DisclaimerEng))
                    {
                        receipt.DisclaimerEng = model.Disclaimer;
                    }

                    if (string.IsNullOrEmpty(receipt.HeaderMessage))
                    {
                        receipt.HeaderMessage = model.HeaderMessage;
                    }
                    if (string.IsNullOrEmpty(receipt.HeaderTitle))
                    {
                        receipt.HeaderTitle = model.HeaderTitle;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterMessage))
                    {
                        receipt.FooterMessage = model.FooterMessage;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle1))
                    {
                        receipt.FooterTitle1 = model.FooterTitle1;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle2))
                    {
                        receipt.FooterTitle2 = model.FooterTitle2;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle3))
                    {
                        receipt.FooterTitle3 = model.FooterTitle3;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyName))
                    {
                        receipt.CompanyName = model.CompanyName;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyAddress))
                    {
                        receipt.CompanyAddress = model.CompanyAddress;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyAddress1))
                    {
                        receipt.CompanyAddress1 = model.CompanyAddress1;
                    }
                    if (string.IsNullOrEmpty(receipt.Disclaimer))
                    {
                        receipt.Disclaimer = model.Disclaimer;
                    }

                    int idx = 0;
                    while (formCollection["disclaimer[" + idx + "]"] != null)
                    {
                        reInfo.Add(new ReceiptInfo
                        {
                            reId = model.Id,
                            DisclaimerTxtCN = formCollection["disclaimer[" + idx + "]"]
                        });
                        idx++;
                    }
                    idx = 0;
                    while (formCollection["paymentterms[" + idx + "]"] != null)
                    {
                        reInfo[idx].PaymentTermsTxtCN = formCollection["paymentterms[" + idx + "]"];
                        idx++;
                    }
                }
                if (lang == 2)
                {
                    receipt.HeaderMessageEng = model.HeaderMessage;
                    receipt.HeaderTitleEng = model.HeaderTitle;
                    receipt.FooterMessageEng = model.FooterMessage;
                    receipt.FooterTitle1Eng = model.FooterTitle1;
                    receipt.FooterTitle2Eng = model.FooterTitle2;
                    receipt.FooterTitle3Eng = model.FooterTitle3;
                    receipt.CompanyNameEng = model.CompanyName;
                    receipt.CompanyAddressEng = model.CompanyAddress;
                    receipt.CompanyAddress1Eng = model.CompanyAddress1;
                    receipt.DisclaimerEng = model.Disclaimer;

                    if (string.IsNullOrEmpty(receipt.HeaderMessageCN))
                    {
                        receipt.HeaderMessageCN = model.HeaderMessage;
                    }
                    if (string.IsNullOrEmpty(receipt.HeaderTitleCN))
                    {
                        receipt.HeaderTitleCN = model.HeaderTitle;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterMessageCN))
                    {
                        receipt.FooterMessageCN = model.FooterMessage;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle1CN))
                    {
                        receipt.FooterTitle1CN = model.FooterTitle1;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle2CN))
                    {
                        receipt.FooterTitle2CN = model.FooterTitle2;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle3CN))
                    {
                        receipt.FooterTitle3CN = model.FooterTitle3;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyNameCN))
                    {
                        receipt.CompanyNameCN = model.CompanyName;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyAddressCN))
                    {
                        receipt.CompanyAddressCN = model.CompanyAddress;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyAddress1CN))
                    {
                        receipt.CompanyAddress1CN = model.CompanyAddress1;
                    }
                    if (string.IsNullOrEmpty(receipt.DisclaimerCN))
                    {
                        receipt.DisclaimerCN = model.Disclaimer;
                    }

                    if (string.IsNullOrEmpty(receipt.HeaderMessage))
                    {
                        receipt.HeaderMessage = model.HeaderMessage;
                    }
                    if (string.IsNullOrEmpty(receipt.HeaderTitle))
                    {
                        receipt.HeaderTitle = model.HeaderTitle;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterMessage))
                    {
                        receipt.FooterMessage = model.FooterMessage;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle1))
                    {
                        receipt.FooterTitle1 = model.FooterTitle1;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle2))
                    {
                        receipt.FooterTitle2 = model.FooterTitle2;
                    }
                    if (string.IsNullOrEmpty(receipt.FooterTitle3))
                    {
                        receipt.FooterTitle3 = model.FooterTitle3;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyName))
                    {
                        receipt.CompanyName = model.CompanyName;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyAddress))
                    {
                        receipt.CompanyAddress = model.CompanyAddress;
                    }
                    if (string.IsNullOrEmpty(receipt.CompanyAddress1))
                    {
                        receipt.CompanyAddress1 = model.CompanyAddress1;
                    }
                    if (string.IsNullOrEmpty(receipt.Disclaimer))
                    {
                        receipt.Disclaimer = model.Disclaimer;
                    }

                    int idx = 0;
                    while (formCollection["disclaimer[" + idx + "]"] != null)
                    {
                        reInfo.Add(new ReceiptInfo
                        {
                            reId = model.Id,
                            DisclaimerTxtEng = formCollection["disclaimer[" + idx + "]"]
                        });
                        idx++;
                    }
                    idx = 0;
                    while (formCollection["paymentterms[" + idx + "]"] != null)
                    {
                        reInfo[idx].PaymentTermsTxtEng = formCollection["paymentterms[" + idx + "]"];
                        idx++;
                    }
                }

                //remove current records first:
                var reinfo = context.ReceiptInfoes.Where(x => x.reId == model.Id).ToList();
                context.ReceiptInfoes.RemoveRange(reinfo);
                context.SaveChanges();
                //add record:
                context.ReceiptInfoes.AddRange(reInfo);

                context.SaveChanges();

                TempData["message"] = string.Format(Resources.Resource.SavedOkFormat, Resources.Resource.ReceiptSettings);
                return RedirectToAction("Index", "Receipt");
            }
        }
    }
}