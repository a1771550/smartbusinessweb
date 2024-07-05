abstract class SimpleForm {
	edit = false;
	constructor(edit) {
		this.edit = edit;
	}

	abstract validform(): boolean;
	abstract submitForm();
}
let StartDayEnum = {
	Today: 0,
	CurrentMonth: 1,
	LastWeek: 2,
	LastMonth: 3,
	Last2Month: 4,
	LastWeekToday: 5,
	LastMonthToday: 6,
	ThisYear: 7,
	Beginning: 8,
}
enum SalesOptions {
	Daily = 1,
	Monthly = 0,
	All = 2
}
interface ISalesDate {
	SalesOptions: SalesOptions;
	Day: number | null;
	Year: number;
	Month: number;
	delimeter: string;
	FinancialYear: number | null;
}
enum TriggerReferrer {
	Row,
	Modal
}
let SalesDate: ISalesDate;
interface IDuty {
	DutyOn: string;
	DutyOff: string;
}
interface IReserve {
	Id: number;
	riCode: string;
	cusCode: string;
	riDate: string;
	riRemark: string;
	riCounted: number | null;
	AllSignedUp: boolean;
	Cancelled: boolean;
	PaidOut: boolean;
	ItemNames: string;
	CustomerName: string;
	ReserveDateDisplay: string;
}
interface IReserveLn {
	Id: number;
	riCode: string;
	rilSender: string;
	itmCode: string;
	itmSellingPrice: number;
	reserveQty: number;
	reservedQty: number;
	rilSignedUp_Sender: boolean;
	rilDate: string;
	ivIdList: string;
	poIvId: string;
	ItemNameDesc: string;
	cusCode: any;
	riDate: string;
	Cancelled: boolean;
	riRemark: string;
	PaidOut: boolean;
	CustomerName: string;
	SellingPriceDisplay: string;
}
let forAbssSales: boolean = false;
let forpreorder: boolean = false;
let Reserve: IReserve;
let ReserveLn: IReserveLn;
let ReserveLnList: IReserveLn[] = [];
let JsStockList: Array<IJsStock> = [];
let ReserveCode: string = "";
let sortByName: boolean = false;
let DicCodeLocQty: { [Key: string]: { [Key: string]: number } }; //Dictionary<string, Dictionary < string, int >> DicCodeLocQty;
let DicCodeLocId: { [Key: string]: { [Key: string]: string } };
let DicItemReservedQty: { [Key: string]: number };
interface IEnquiryGroup {
	RemarkDisplay: any;
	CompanyNames: any;
	Id: number;
	egName: string;
	enIds: string;
	Remark: string | null;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
}
interface ICustomerGroup {
	RemarkDisplay: any;
	CustomerNames: any;
	Id: number;
	cgName: string;
	cusCodes: string;
	Remark: string | null;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
}
let CustomerGroup: ICustomerGroup = {} as ICustomerGroup;
let CustomerGroupList: ICustomerGroup[] = [];
let EnquiryGroup: IEnquiryGroup = {} as IEnquiryGroup;
let EnquiryGroupList: IEnquiryGroup[] = [];
interface IPaymentType {
	Id: number;
	pmtCode: string;
	pmtName: string;
	pmtDescription: string | null;
	pmtServiceChargePercent: number | null;
	pmtIsActive: boolean | null;
	pmtIsCash: boolean | null;
	Selected: boolean;
	serviceChargeDisplay: string | null;
}
let PayTypes: IPaymentType[] = [];
let ServiceChargePC: number = 0;
let ServiceChargeAmt: number = 0;

//for myobItem
interface ICodeName {
	Code: string;
	Name: string;
}
let CodeNameList: ICodeName[] = [];

interface ICoupon {
	Id: number;
	cpId: number;//equal to Id;MUST NOT be removed!!!
	cpCode: string;
	cpCompanyName: string;
	cpTitle: string;
	cpHeader: string;
	cpDesc: string;
	cpRemark: string;
	cpFooter: string;
	cpPrice: number;
	cpDiscPc: number | null;
	cpExpiryDate: string;
	cpIssuedQty: number;
	cpIsActive: boolean;
	CouponLines: ICouponLn[];
	JsExpiryDate: string;
	IsAllRedeemed: boolean;
	IsAllVoided: boolean;
}
let Coupon: ICoupon;

interface ICouponLn extends ICoupon {
    IsExpired: boolean;
	cplCode: string;
	cplIsRedeemed: boolean;
	cplIsVoided: boolean;
}
let CouponLn: ICouponLn;
let CouponLines: ICoupon[] = [];

//for myobCustomer & myobSupplier
interface IPhoneNameEmail {
	Phone: string;
	Name: string;
	Email: string;
}
let PhoneNameEmailList: IPhoneNameEmail[] = [];
let Supplier: ISupplier;

let triggerReferrer: TriggerReferrer;
const formatzero = formatnumber(0);
let $norecordfound: any;
let $appInfo = $("#appInfo");
let $txtblk = $(".txtblk");

let isEpay: boolean = false;
let salesman: ISalesman;

let approvalmode: boolean = false;
let reviewmode: boolean = false;
let enableCRM: boolean = false;
let enableWhatsappLnk: boolean = $appInfo.data("enablewhatsapplnk")
	? $appInfo.data("enablewhatsapplnk") === "True"
	: false;
let uploadsizelimit: number = 0;
let uploadsizelimitmb: number = 0;
let gTblId: string = "";
let wstype: string = "";
let psttype: string = "";
let forrejectedinvoice: boolean = false;
let forapprovedinvoice: boolean = false;
let forrejectedpo: boolean = false;
let forapprovedpo: boolean = false;
let forpassedtomanager: boolean = false;
let forpayments: boolean = false;
let recreateOnVoid: number = 0;
let UserName: string = "";
let NamesMatch: boolean = false;
let SelectedCountry: number = 1;
//const searchcustxt:string = $txtblk.data("searchcustxt");
//const searchcustxt:string = $txtblk.data("searchcustxt");
//const searchcustxt:string = $txtblk.data("searchcustxt");
const couponexpiredwarning: string = $txtblk.eq(1).data("couponexpiredwarning");
const couponvoidedwarning: string = $txtblk.data("couponvoidedwarning");
const couponredeemedwarning: string = $txtblk.data("couponredeemedwarning");
const changetxt: string = $txtblk.data("changetxt");
const nocustomersfoundtxt: string = $txtblk.data("nocustomersfound");
const enquirygrouptxt: string = $txtblk.data("enquirygrouptxt");
const emailnotificationtosalesmentxt: string = $txtblk.data("emailnotificationtosalesmentxt");
const salesmentxt: string = $txtblk.data("salesmentxt");
const groupnamerequiredtxt: string = $txtblk.data("groupnamerequiredtxt");
const customergrouptxt: string = $txtblk.data("customergrouptxt");
const reserveitemtxt: string = $txtblk.data("reserveitemtxt");
const paymenttypetxt: string = $txtblk.data("paymenttypetxt");
const duplicatedemailalert: string = $txtblk.data("duplicatedemailalert");
const duplicateditemnamewarning: string = $txtblk.data("duplicateditemnamewarning");
const duplicatednamewarning: string = $txtblk.data("duplicatednamewarning");
const duplicatedphonewarning: string = $txtblk.data("duplicatedphonewarning");
const datanotenough4submittxt: string = $txtblk.data("datanotenough4submittxt");
const allocationmemotxt: string = $txtblk.data("allocationmemotxt");
const discpctxt: string = $txtblk.data("discpctxt");
const costxt: string = $txtblk.data("costxt");
const assettxt: string = $txtblk.data("assettxt");
const incometxt: string = $txtblk.data("incometxt");
const confirmdeposittxt: string = $txtblk.data("confirmdeposittxt");
const numberonlytxt: string = $txtblk.data("numberonlytxt");
const paymentinfoerrtxt: string = $txtblk.data("paymentinfoerrtxt");
const confirmvoidpaymenttxt: string = $txtblk.data("confirmvoidpaymenttxt");
const void4paymenttxt: string = $txtblk.data("void4paymenttxt");
const paginginfoformat: string = $txtblk.data("paginginfoformat");
const reloadtxt: string = $txtblk.data("reloadtxt");
const nexttxt: string = $txtblk.data("nexttxt");
const previoustxt: string = $txtblk.data("previoustxt");
const barcodetxt: string = $txtblk.data("barcodetxt");
const expensetxt: string = $txtblk.data("expensetxt");
const equitytxt: string = $txtblk.data("equitytxt");
const liabilitytxt: string = $txtblk.data("liabilitytxt");
const otherincometxt: string = $txtblk.data("otherincometxt");
const otherexpensetxt: string = $txtblk.data("otherexpensetxt");
const searchtxt: string = $txtblk.data("searchtxt");
const rejectedtxt: string = $txtblk.data("rejectedtxt");
const approvedtxt: string = $txtblk.data("approvedtxt");
const transferdblclickhints: string = $txtblk.data("transferdblclickhints");
const currentbatchtypesellableqtytxt: string = $txtblk.data(
	"currentbatchtypesellableqtytxt"
);
const sequencetxt: string = $txtblk.data("sequencetxt");
const advancedsearchtxt: string = $txtblk.data("advancedsearchtxt");
const sendmail4assignmentprompt: string = $txtblk.data(
	"sendmail4assignmentprompt"
);
const lasteditedbyformat = $txtblk.data("lasteditedbyformat");
const converttocustomertxt: string = $txtblk.data("converttocustomertxt");
const viewfiletxt: string = $txtblk.data("viewfiletxt");
const uploadfiletxt: string = $txtblk.data("uploadfiletxt");
const abssfilelockedalerttxt: string = $txtblk.data("abssfilelockedalerttxt");
const passedinvoicetxt: string = $txtblk.data("passedinvoicetxt");
const passedpotxt: string = $txtblk.data("passedpotxt");
const requestapproval4customertxt: string = $txtblk.data(
	"requestapproval4customertxt"
);
const rejectedcustomertxt: string = $txtblk.data("rejectedcustomertxt");
const approvedcustomertxt: string = $txtblk.data("approvedcustomertxt");
const rejectreasontxt: string = $txtblk.data("rejectreasontxt");
const recreateinvoice4voidtxt: string = $txtblk.data("recreateinvoice4voidtxt");
const confirmvoidinvoicetxt: string = $txtblk.data("confirmvoidinvoicetxt");
const approvedinvoicetxt: string = $txtblk.data("approvedinvoicetxt");
const rejectedinvoicetxt: string = $txtblk.data("rejectedinvoicetxt");
const requestapproval4invoicetxt: string = $txtblk.data(
	"requestapproval4invoicetxt"
);

const recreatepo4voidtxt: string = $txtblk.data("recreatepo4voidtxt");
const confirmvoidpotxt: string = $txtblk.data("confirmvoidpotxt");
const approvedpotxt: string = $txtblk.data("approvedpotxt");
const rejectedpotxt: string = $txtblk.data("rejectedpotxt");
const requestapproval4potxt: string = $txtblk.data("requestapproval4potxt");

const sendtxt: string = $txtblk.data("sendtxt");
const sendwhatsapptxt: string = $txtblk.data("sendwhatsapptxt");
const whatsappapilinktxt: string = $txtblk.data("whatsappapilinktxt");
const customerexpiredbrinredtxt: string = $txtblk.data(
	"customerexpiredbrinredtxt"
);
const customerporequiredtxt: string = $txtblk.data("customerporequiredtxt");
const salestxt: string = $txtblk.data("salestxt");
const recurringordertxt: string = $txtblk.data("recurringordertxt");
const convertdaterequiredtxt: string = $txtblk.data("convertdaterequiredtxt");
const convertdatetxt: string = $txtblk.data("convertdatetxt");

let addMode = false;

const PriceIdx4Sales: number = 9;
const PriceIdx4WsOrder: number = 5;
const PriceIdx4WsInvoice: number = 10;
const PriceIdx4PstOrder: number = 5;
const PriceIdx4PstBill: number = 9;

let eblastId: number;
let user: ISysUser;
let lastppId: number = 1;
let ppId: number = 1;
let current_page = 1;
let records_per_page = 5;
let frmId: string = "";
let ismanager: boolean = false;
let TransferList: Array<IStockTransfer> = [];
let isLocal: boolean = false;
let $infoblk: any;
let cusCode: string;
let batdelqtychange: boolean = false;
let chkbatsnvtchange: boolean = false;
let vtdelqtychange: boolean = false;
let stockTransferCode: string = "";
let isapprover: boolean = false;
let isadmin: boolean = false;
let minDate = "",
	maxDate = "";
const currency: string =
	$infoblk && $infoblk.data("currency") ? $infoblk.data("currency") : "$";
const itemqtypromotiontxt: string = $txtblk.data("itemqtypromotiontxt");
const itemperiodpromotiontxt: string = $txtblk.data("itemperiodpromotiontxt");
const itemvariationtxt: string = $txtblk.data("itemvariationtxt");
const editivtxt: string = $txtblk.data("editivtxt");
const buyingcostrequiredtxt: string = $txtblk.data("buyingcostrequiredtxt");
const abssnamenotmodifiabletxt: string = $txtblk.data(
	"abssnamenotmodifiabletxt"
);
const stockqtyzerooninitnote: string = $txtblk.data("stockqtyzerooninitnote");
const stockqtynotenoughtxt: string = $txtblk.data("stockqtynotenoughtxt");
const unsavedtxt: string = $txtblk.data("unsavedtxt");
const savedtxt: string = $txtblk.data("savedtxt");
const attrnametxt: string = $txtblk.data("attrnametxt");
const separatedbyformat: string = $txtblk.data("separatedbyformat");
const attrvalstxt: string = $txtblk.data("attrvalstxt");
const used4variationstxt: string = $txtblk.data("used4variationstxt");
const visibleonsalespagetxt: string = $txtblk.data("visibleonsalespagetxt");
const valuestxt: string = $txtblk.data("valuestxt");
const customerfollowuptxt: string = $txtblk.data("customerfollowuptxt");
const purchaserequiredmsg: string = $txtblk.data("purchaserequiredmsg");
const itemoptionsinfomissingformat: string = $txtblk.data(
	"itemoptionsinfomissingformat"
);
const batqtymustnotltreceivedqtytxt: string = $txtblk.data(
	"batqtymustnotltreceivedqtytxt"
);
const serialnoqtymustnotltreceivedqtytxt: string = $txtblk.data(
	"serialnoqtymustnotltreceivedqtytxt"
);
const outofstockwslwarningtxt: string = $txtblk.data("outofstockwslwarningtxt");
const removecurrentdeldataconfirmtxt: string = $txtblk.data(
	"removecurrentdeldataconfirmtxt"
);
const newqtygtoriginalqtyindeliveryconfirmtxt: string = $txtblk.data(
	"newqtygtoriginalqtyindeliveryconfirmtxt"
);
const batqtymustnotgtpoqtytxt: string = $txtblk.data("batqtymustnotgtpoqtytxt");
const batqtyrequiredtxt: string = $txtblk.data("batqtyrequiredtxt");
const rowtxt: string = $txtblk.data("rowtxt");
const itemtransactednotdeletable: string = $txtblk.data(
	"itemtransactednotdeletable"
);
const expirydaterequiredtxt: string = $txtblk.data("expirydaterequiredtxt");
const snrequiredtxt: string = $txtblk.data("snrequiredtxt");
const batchrequiredtxt: string = $txtblk.data("batchrequiredtxt");
const expirydatetxt: string = $txtblk.data("expirydatetxt");
const validthrutxt: string = $txtblk.data("validthrutxt");
const noserialnofoundwitemtxt: string = $txtblk.data("noserialnofoundwitemtxt");
const nobatchfoundwitemtxt: string = $txtblk.data("nobatchfoundwitemtxt");
const qtyrequiredtxt: string = $txtblk.data("qtyrequiredtxt");
const nottxt: string = $txtblk.data("nottxt");
const customertermstxt: string = $txtblk.data("customertermstxt");
const remarktxt: string = $txtblk.data("remarktxt");
const receivedqtymustnotgtpoqtyprompt: string = $txtblk.data(
	"receivedqtymustnotgtpoqtyprompt"
);
const serialnoqtymustmatchreceivedqtyprompt: string = $txtblk.data(
	"serialnoqtymustmatchreceivedqtyprompt"
);
const transfertxt: string = $txtblk.data("transfertxt");
const serialnoqtymustmatchreceivedqtytxt: string = $txtblk.data(
	"serialnoqtymustmatchreceivedqtytxt"
);
const receivedqtyrequiredtxt: string = $txtblk.data("receivedqtyrequiredtxt");
const buysellbaseunitstxt: string = $txtblk.data("buysellbaseunitstxt");
const receivedqtytxt: string = $txtblk.data("receivedqtytxt");
const purchasecodetxt: string = $txtblk.data("purchasecodetxt");
const exchangeratetxt: string = $txtblk.data("exchangeratetxt");
const countrytxt: string = $txtblk.data("countrytxt");
const statetxt: string = $txtblk.data("statetxt");
const citytxt: string = $txtblk.data("citytxt");
const websitetxt: string = $txtblk.data("websitetxt");
const supplierdetailtxt: string = $txtblk.data("supplierdetailtxt");
const namerequiredtxt: string = $txtblk.data("namerequiredtxt");
const plsspecifiytaxrate: string = $txtblk.data("plsspecifiytaxrate");
const plsselectatleastonetaxtypetxt: string = $txtblk.data(
	"plsselectatleastonetaxtypetxt"
);
const taxtypetxt: string = $txtblk.data("taxtypetxt");
const logotxt: string = $txtblk.data("logotxt");
const customerpotxt: string = $txtblk.data("customerpotxt");
const deliverydatetxt: string = $txtblk.data("deliverydatetxt");
const contactassignedtogroupconfirmprompttxt: string = $txtblk.data(
	"contactassignedtogroupconfirmprompttxt"
);
const confirmunassigntxt: string = $txtblk.data("confirmunassigntxt");
const groupsalesmentxt: string = $txtblk.data("groupsalesmentxt");
const assigntosalesmantxt: string = $txtblk.data("assigntosalesmantxt");
const assignedenquiriestxt: string = $txtblk.data("assignedenquiriestxt");
const assigntxt: string = $txtblk.data("assigntxt");
const salesgrouptxt: string = $txtblk.data("salesgrouptxt");
const operatorrequiredtxt: string = $txtblk.data("operatorrequiredtxt");
const confirmexportdatatxt: string = $txtblk.data("confirmexportdatatxt");
const confirmexporttxt: string = $txtblk.data("confirmexporttxt");
const assignedcontactstxt: string = $txtblk.data("assignedcontactstxt");
const customattributetxt: string = $txtblk.data("customattributetxt");
const datetxt: string = $txtblk.data("datetxt");
const attrnamerequiredtxt: string = $txtblk.data("attrnamerequiredtxt");
const salesmannametxt: string = $txtblk.data("salesmannametxt");
const contactdetailtxt: string = $txtblk.data("contactdetailtxt");
const uploadfilesizeexceedprompttxt: string = $txtblk.data(
	"uploadfilesizeexceedprompttxt"
);
const contactphoneduplicatedalerttxt: string = $txtblk.data(
	"contactphoneduplicatedalerttxt"
);
const actionlogvaltxt: string = $txtblk.data("actionlogvaltxt");
const filesizeexceedsmaxuploadsizetxt: string = $txtblk.data(
	"filesizeexceedsmaxuploadsizetxt"
);
const onlyfileallowedformattxt: string = $txtblk.data(
	"onlyfileallowedformattxt"
);
const eblasttxt: string = $txtblk.data("eblasttxt");
const testformattxt: string = $txtblk.data("testformattxt");
const confirmremovetxt: string = $txtblk.data("confirmremovetxt");
const confirmtxt: string = $txtblk.data("confirmtxt");
const hotlisttxt: string = $txtblk.data("hotlisttxt");
const customerphoneduplicatederrtxt: string = $txtblk.data(
	"customerphoneduplicatederr"
);
const maxconamelength: number = parseInt($txtblk.data("maxconamelength"));
const organizationtxt = $txtblk.data("organizationtxt");
const lastnametxt = $txtblk.data("lastnametxt");
const firstnametxt = $txtblk.data("firstnametxt");
const desctxt = $txtblk.data("desctxt");
const inchargeformattxt = $txtblk.data("inchargeformattxt");
const callhistorytxt = $txtblk.data("callhistorytxt");
const attributetxt = $txtblk.data("attributetxt");
const removetxt = $txtblk.data("removetxt");
const edittxt = $txtblk.data("edittxt");
const valueformattxt = $txtblk.data("valueformattxt");
const enterfirstformattxt = $txtblk.data("enterfirstformattxt");
const enteratleastoneformattxt = $txtblk.data("enteratleastoneformattxt");
const copiedformattxt = $txtblk.data("copiedformattxt");
const fileformattxt = $txtblk.data("fileformattxt");
const linktxt = $txtblk.data("linktxt");
const clientsecretvaltxt = $txtblk.data("clientsecretvaltxt");
const redirecturitxt = $txtblk.data("redirecturitxt");
const tenantidtxt = $txtblk.data("tenantidtxt");
const clientidtxt = $txtblk.data("clientidtxt");
const appnametxt = $txtblk.data("appnametxt");
const apiformattxt = $txtblk.data("apiformattxt");
const settingsformattxt = $txtblk.data("settingsformattxt");
const office365txt = $txtblk.data("office365txt");
const secretidformattxt = $txtblk.data("secretidformattxt");
const secretvalformattxt = $txtblk.data("secretvalformattxt");
const tenanttxt = $txtblk.data("tenanttxt");
const clienttxt = $txtblk.data("clienttxt");
const idformattxt = $txtblk.data("idformattxt");
const doctxt = $txtblk.data("doctxt");
const customfieldvaltxt = $txtblk.data("customfieldvaltxt");
const assignclientstosalestxt = $txtblk.data("assignclientstosalestxt");
const companynametxt: string = $txtblk.data("companynametxt");
const frmtxt: string = $txtblk.data("frmtxt");
const requiredselecttxt: string = $txtblk.data("requiredselecttxt");
const requiredinputtxt: string = $txtblk.data("requiredinputtxt");
const selectatleastoneitemtxt: string = $txtblk.data("selectatleastoneitemtxt");
const asynctaskmsg: string = $txtblk.data("asynctaskmsg");
const sentactualtxt: string = $txtblk.data("sentactualtxt");
const sendexpectedtxt: string = $txtblk.data("sendexpectedtxt");
const texttxt: string = $txtblk.data("texttxt");
const htmltxt: string = $txtblk.data("htmltxt");
const formattxt: string = $txtblk.data("formattxt");
const pausesendlabeltxt: string = $txtblk.data("pausesendlabeltxt");
const pausesendtxt: string = $txtblk.data("pausesendtxt");
const sendtimetxt: string = $txtblk.data("sendtimetxt");
const eblastdetailtxt: string = $txtblk.data("eblastdetailtxt");
const contenttxt: string = $txtblk.data("contenttxt");
const subjecttxt: string = $txtblk.data("subjecttxt");
const emailtxt: string = $txtblk.data("emailtxt");
const recordtxt: string = $txtblk.data("recordtxt");
const notxt: string = $txtblk.data("notxt");
const oktxt: string = $txtblk.data("oktxt");
const customerrequiredtxt: string = $txtblk.data("customerrequiredtxt");
const onlyalphanumericallowedtxt: string = $txtblk.data(
	"onlyalphanumericallowedtxt"
);
const txtremove: string = $txtblk.data("txtremove");
const roundingstxt: string = $txtblk.data("roundingstxt");
const saleschangetxt: string = $txtblk.data("saleschangetxt");
const remaintxt: string = $txtblk.data("remaintxt");
const plswaittxt: string = $txtblk.data("plswaittxt");
const closetxt: string = $txtblk.data("closetxt");
const canceltxt: string = $txtblk.data("canceltxt");
const searchcustxt: string = $txtblk.data("searchcustxt");
const cashdraweramtprompt: string = $txtblk.data("cashdraweramtprompt");
const paymentrequiredtxt: string = $txtblk.data("paymentrequiredtxt");
const zerostockitemswarning: string = $txtblk.data("zerostockitemswarning");
const errorhere: string = $txtblk.data("errorhere");
const zeropricewarning: string = $txtblk.data("zeropricewarning");
const fulldiscountprompt: string = $txtblk.data("fulldiscountprompt");
const salesinfonotenough: string = $txtblk.data("salesinfonotenough");
const paymentnotenough: string = $txtblk.data("paymentnotenough");
const monthlypaytxt: string = $txtblk.data("monthlypaytxt");
const gt100dispctxt: string = $txtblk.data("gt100dispctxt");
const lt0dispctxt: string = $txtblk.data("lt0dispctxt");
const depositmustnotgteqamtmsg: string = $txtblk.data(
	"depositmustnotgteqamtmsg"
);
const saleschange: string = $txtblk.data("saleschange");
const searchitem: string = $txtblk.data("searchitem");
const selectitemrequired: string = $txtblk.data("selectitemrequired");
const duplicatedserialnowarning: string = $txtblk.data(
	"duplicatedserialnowarning"
);
const duplicatedserialno: string = $txtblk.data("duplicatedserialno");
const serialnorequired: string = $txtblk.data("serialnorequired");
const confirmremove: string = $txtblk.data("confirmremove");
const enterserialno: string = $txtblk.data("enterserialno");
const emptyitemwarning: string = $txtblk.data("emptyitemwarning");
const snqtynotmatchcurrqtywarning: string = $txtblk.data(
	"snqtynotmatchcurrqtywarning"
);
const cashdraweramt: string = $txtblk.data("cashdraweramt");
const confirmnewsales: string = $txtblk.data("confirmnewsales");
const nodatafoundtxt: string = $txtblk.data("nodatafound");
const confirmsubmit: string = $txtblk.data("confirmsubmit");
const confirmmonthlypay: string = $txtblk.data("confirmmonthlypay");
const noncashgtremainamterrmsg: string = $txtblk.data(
	"noncashgtremainamterrmsg"
);
const processpayments: string = $txtblk.data("processpayments");
const description: string = $txtblk.data("description");
const detailtxt: string = $txtblk.data("detailtxt");
const refundqtycantgtsalesqtywarning: string = $txtblk.data(
	"refundqtycantgtsalesqtywarning"
);
const returnqtycantgtpurchaseqtywarning: string = $txtblk.data(
	"returnqtycantgtpurchaseqtywarning"
);
const receiptnorequired: string = $txtblk.data("receiptnorequired");
const devicecoderequired: string = $txtblk.data("devicecoderequired");
const renoorphonerequired: string = $txtblk.data("renoorphonerequired");
const templatepreview: string = $txtblk.data("templatepreview");
const templaterequired: string = $txtblk.data("templaterequired");
const duplicatedsnwarning: string = $txtblk.data("duplicatedsnwarning");
const processrefund: string = $txtblk.data("processrefund");
const itemrefundedinfullqty: string = $txtblk.data("itemrefundedinfullqty");
const itemreturnedinfullqty: string = $txtblk.data("itemreturnedinfullqty");
const refundinfonotenough: string = $txtblk.data("refundinfonotenough");
const returninfonotenough: string = $txtblk.data("returninfonotenough");
const sequencewrongwarning: string = $txtblk.data("sequencewrongwarning");
const confirmnewrefund: string = $txtblk.data("confirmnewrefund");
const confirmnewreturn: string = $txtblk.data("confirmnewreturn");
const invoicefullyrefunded: string = $txtblk.data("invoicefullyrefunded");
const purchasefullyreturnedtxt: string = $txtblk.data(
	"purchasefullyreturnedtxt"
);
const receiptnotxt: string = $txtblk.data("receiptno");
const itemcodetxt: string = $txtblk.data("itemcodetxt");
const batchtxt: string = $txtblk.data("batchtxt");
const serialnotxt: string = $txtblk.data("serialnotxt");
const qtytxt: string = $txtblk.data("qtytxt");
const sellingpricetxt: string = $txtblk.data("sellingpricetxt");
const discountitemheader: string = $txtblk.data("discountitemheader");
const taxitemheader: string = $txtblk.data("taxitemheader");
const amountitemheader: string = $txtblk.data("amountitemheader");
const salesdatetxt: string = $txtblk.data("salesdatetxt");
const refundqtytxt: string = $txtblk.data("refundqtytxt");
const refundamttxt: string = $txtblk.data("refundamttxt");
const refunddatetxt: string = $txtblk.data("refunddatetxt");
const purchasedatetxt: string = $txtblk.data("purchasedatetxt");
const returnqtytxt: string = $txtblk.data("returnqtytxt");
const returnamttxt: string = $txtblk.data("returnamttxt");
const returndatetxt: string = $txtblk.data("returndatetxt");
const qtyavailable: string = $txtblk.data("qtyavailable");
const depositamt: string = $txtblk.data("depositamt");
const depositdate: string = $txtblk.data("depositdate");
const confirmreload: string = $txtblk.data("confirmreload");
const emailformaterr: string = $txtblk.data("emailformaterr");
const salesnorequired: string = $txtblk.data("salesnorequired");
const batchnorequired: string = $txtblk.data("batchnorequired");
const notetxt: string = $txtblk.data("notetxt");
const internalnotetxt: string = $txtblk.data("internalnotetxt");
const customertxt: string = $txtblk.data("customertxt");
const priceleveltxt: string = $txtblk.data("priceleveltxt");
const phonenotxt: string = $txtblk.data("phonenotxt");
const confirmdayendssubmit: string = $txtblk.data("confirmdayendssubmit");
const countpaymentsnotmatchwarning: string = $txtblk.data(
	"countpaymentsnotmatchwarning"
);
const exportedpathmsg: string = $txtblk.data("exportedpathmsg");
const actionhistory: string = $txtblk.data("actionhistory");
const customattributevalue: string = $txtblk.data("customattributevalue");
const savetxt: string = $txtblk.data("savetxt");
const addattributeval: string = $txtblk.data("addattributeval");
const editattribute: string = $txtblk.data("editattribute");
const attnametxt: string = $txtblk.data("attnametxt");
const attvaltxt: string = $txtblk.data("attvaltxt");
const attrnamerequired: string = $txtblk.data("attrnamerequired");
const attrvalsrequired: string = $txtblk.data("attrvalsrequired");
const attrvalrequiredtxt: string = $txtblk.data("attrvalrequiredtxt");
const customattributes: string = $txtblk.data("customattributes");
const defaultattributes: string = $txtblk.data("defaultattributes");
const guestcantaddedmsg: string = $txtblk.data("guestcantaddedmsg");
const activetxt: string = $txtblk.data("activetxt");
const inactivetxt: string = $txtblk.data("inactivetxt");
const yestxt: string = $txtblk.data("yestxt");
const itemnametxt: string = $txtblk.data("itemnametxt");
const nonstocktxt: string = $txtblk.data("nonstocktxt");
const stocktxt: string = $txtblk.data("stocktxt");
const locationtxt: string = $txtblk.data("locationtxt");
const createtimetxt: string = $txtblk.data("createtimetxt");
const modifytimetxt: string = $txtblk.data("modifytimetxt");
const itemcodeduplicatederr: string = $txtblk.data("itemcodeduplicatederr");
const itemexternalcodeuplicatederr: string = $txtblk.data(
	"itemexternalcodeuplicatederr"
);
const clonebasesellingpriceconfirm: string = $txtblk.data(
	"clonebasesellingpriceconfirm"
);
const itemcoderequired: string = $txtblk.data("itemcoderequired");
const itemnamerequired: string = $txtblk.data("itemnamerequired");
const sellingpricerequired: string = $txtblk.data("sellingpricerequired");
const stocklocqtyrequired: string = $txtblk.data("stocklocqtyrequired");
const descriptionrequired: string = $txtblk.data("descriptionrequired");
const itemaccounttxt: string = $txtblk.data("itemaccounttxt");
const selecttxt: string = $txtblk.data("selecttxt");
const assetaccountforiteminventory: string = $txtblk.data(
	"assetaccountforiteminventory"
);
const costofsalesaccount: string = $txtblk.data("costofsalesaccount");
const ibuythisitem: string = $txtblk.data("ibuythisitem");
const iinventorythisitem: string = $txtblk.data("iinventorythisitem");
const incomeaccountfortrackingsales: string = $txtblk.data(
	"incomeaccountfortrackingsales"
);
const isellthisitem: string = $txtblk.data("isellthisitem");
const itemdetailtxt: string = $txtblk.data("itemdetailtxt");
const statustxt: string = $txtblk.data("statustxt");
const cosaccounttxt: string = $txtblk.data("cosaccounttxt");
const incomeaccount4tstxt: string = $txtblk.data("incomeaccount4tstxt");
const assetaccount4inventorytxt: string = $txtblk.data(
	"assetaccount4inventorytxt"
);
const itemtxt: string = $txtblk.data("itemtxt");
const pagetotaltxt: string = $txtblk.data("pagetotaltxt");
const collecttaxtxt: string = $txtblk.data("collecttaxtxt");
const loadingtxt: string = $txtblk.data("loadingtxt");
const salesmandetailtxt: string = $txtblk.data("salesmandetail");
const nametxt: string = $txtblk.data("nametxt");
const devicetxt: string = $txtblk.data("devicetxt");
const shoptxt: string = $txtblk.data("shoptxt");
const managertxt: string = $txtblk.data("managertxt");
const customerlisttxt: string = $txtblk.data("customerlist");
const staffdetailtxt: string = $txtblk.data("staffdetail");
const phonetxt: string = $txtblk.data("phonetxt");
const usernamerequiredtxt: string = $txtblk.data("usernamerequiredtxt");
const passwordrequiredtxt: string = $txtblk.data("passwordrequiredtxt");
const passwordstrengtherrtxt: string = $txtblk.data("passwordstrengtherrtxt");
const confirmpassrequiredtxt: string = $txtblk.data("confirmpassrequiredtxt");
const passconfirmpassnotmatchtxt: string = $txtblk.data(
	"passconfirmpassnotmatchtxt"
);
const customerdetailtxt: string = $txtblk.data("customerdetailtxt");
const codetxt: string = $txtblk.data("codetxt");
const stafftxt: string = $txtblk.data("stafftxt");
const attributelisttxt: string = $txtblk.data("attributelisttxt");
const typetxt: string = $txtblk.data("typetxt");
const valuetxt: string = $txtblk.data("valuetxt");
const isorgantxt: string = $txtblk.data("isorgantxt");
const contacttxt: string = $txtblk.data("contacttxt");
const mobiletxt: string = $txtblk.data("mobiletxt");
const addresstxt: string = $txtblk.data("addresstxt");

let forstock: boolean = false;
let fortransfer: boolean = false;
let stocklocation: string;
let receiptno: string;
let iscrmadmin: boolean;
let iscrmsalesmanager: boolean;
let lang: number = $appInfo.length ? Number($appInfo.data("lang")) : 0;
let debug: boolean = false;

let cusAttrEdit: boolean = false;
let attrEdit: boolean = false;

let graphsettings: IGraphSettings;
let graphsettingslist: Array<IGraphSettings> = [];

let IdList: number[] = [];
let CodeList: string[] = [];
let EnIdList: string[] = [];
let AssignEnqIdList: string[] = [];
let EnIdList4Group: string[] = [];

let gAttributes: Array<IGlobalAttribute> = [];
let gAttribute: IGlobalAttribute;

let cAttributes: ICustomAttribute[] = [];
let cAttribute: ICustomAttribute;

let dicAssignedSalesInfo: { [Key: number]: ISalesman } = {};

let waitingModal: any,
	itemModal: any,
	descModal: any,
	cusModal: any,
	serialModal: any,
	payModal: any,
	changeModal: any,
	printModal: any,
	cashdrawerModal: any,
	previewModal: any,
	actionModal: any,
	comboModal: any,
	accountModal: any,
	dropdownModal: any,
	salesmenModal: any,
	gcomboModal: any,
	docModal: any,
	customerGroupModal: any,
	enquiryGroupModal: any,
	hotlistModal: any,
	testEblastModal: any,
	actionLogValModal: any,
	gAttrFilterModal: any,
	customAttributeModal: any,
	assignedContactModal: any,
	textareaModal: any,
	salesgroupModal: any,
	logoModal: any,
	taxTypeModal: any,
	currencyModal: any,
	purchaseCodeModal: any,
	itemBuySellUnitsModal: any,
	customerTermsModal: any,
	batchModal: any,
	validthruModal: any,
	purchaseBatchModal: any,
	purchaseSerialModal: any,
	customerFollowUpModal: any,
	itemAttrModal: any,
	dateTimeModal: any,
	convertDateModal: any,
	recurOrderModal: any,
	whatsappLinkModal: any,
	currencySettingModal: any,
	uploadFileModal: any,
	viewFileModal: any,
	advancedSearchModal: any,
	contactModal: any,
	poItemVariModal: any,
	itemVariModal: any,
	barcodeModal: any,
	transferModal: any,
	paymentTypeModal: any,
	voidPaymentModal: any,
	reserveModal: any;

let sysdateformat: string = "yyyy-mm-dd";
//let jsdateformat: string = "dd/mm/yy";
let attrId: string;
let attrvalues: string[] = [];
let customerlist: Array<ICustomer> = [];
let staff: ISalesman;
let payurl = "https://pay.wepayez.com/pay/qrcode?uuid={0}&s={1}";
let authcode: string = "";
let fileList: string[] = [];
let $target: JQuery;

let $tr: JQuery;
let taxModel: ITaxModel;
let editmode: boolean = false;
let phonelist: string[] = [];
let maillist: string[] = [];
let supcodelist: string[] = [];
let savemode: string = "text";
let AttributeList: Array<IAttribute> = [];
let keyword: string = "";
let itotalamt: number = 0,
	itotalpay: number = 0;
//ichange: number = 0;
let currentY: number = 0;
let zeroprice: boolean = false;
let zerocost: boolean = false;
let selectedItemCode: string = "";
let selectedItemCodes: string[] = [];
let selectedCusCodeName: string = "";
let selectedSalesLn: ISalesLn | null;
let selectedPreSalesLn: IPreSalesLn | null;
let selectedSimpleSalesLn: ISimpleSalesLn | null;
let selectedCus: ICustomer;
let selectedStockInItem: IStockInItem;
let SelectedPurchaseItem: IPurchaseItem | null;
let selectedWholesalesLn: IWholeSalesLn | null;

let SimpleItemList: ISimpleItem[];
let ItemList: Array<IItem>;
let CusList: Array<ICustomer>;
let contactlist: Array<IContact>;
let seq = 0;
let itemsnlist: Array<IItemSN> = [];
let itemsnbvlist: Array<IItemSnBatVt> = [];

let itemsnvtlist: { [Key: string]: Array<ISnVt> } = {}; //key = itemcode:seq

let Payments: Array<IPayType> = [];
let allownegativestock = false;
//let Sale.Roundings = 0;
let iremain = 0;
let _openSerialModal = false;
let receipt: IReceipt;
let DicPayTypes: { [Key: string]: IPayType } = {};
let DicInvoiceItemSeqSerialNoList: { [Key: string]: ISerialNo[] } = {};
let defaultAttVals: { [Key: string]: string } = {};
let duplicatedSerailNo = false;
let snUsedDate = "";
let receiptlogo = "";
//let monthlypay = 0;
let currentQty = 0;
let nodatafound = false;
let defaultcustomer: ICustomer;
let searchmode = false;
let searchcusmode = false;
let ispostback = false;
let sortName = "";
let sortDirection = "DESC";
let sortCol: number = 0;
let PageNo = 1;
let PageSize: number = 0;
let RecordCount: number = 0;
//let deposit = 0;
let inclusivetax = false,
	inclusivetaxrate = 0;
let chkIdx = -1,
	activeChkIdx = -1,
	activePayIdx = -1,
	paymenttypechange = false,
	chkchange = false;
let CouponInUse = false;
let couponamt = 0;
let form = null,
	currentX = -1;
let selectedSalesCode = "";
let snlist: Array<ISerialNo> = [];
let selectedDepositLn = [];
let RemainList: Array<IDepositRemainItem> = [],
	depositLns: Array<ISalesLn> = [];
let totalsalesQty = 0;
let totalpurchaseQty = 0;
let SalesItemList: Array<ISalesItem> = [];
let DepositItemList: Array<IDepositItem> = [];
let Sales: ISales;
let Deposit: ISales;
let PreSales: IPreSales;
let SalesList: Array<ISalesBase> = [];
let SalesLnList: Array<ISalesLn> = [];
let DepositLnList: Array<ISalesLn> = [];
let PreSalesLnList: IPreSalesLn[] = [];
let SalesOrder: ISimpleSales;
let SimpleSalesLns: ISimpleSalesLn[] = [];
let currentAmt = 0;
let _openItemModal = false;
let rno = "";
let monthbase = 0;
let updateseq = false;
let amteditable = false;
let itotalremainamt = 0;
let cpplList: Array<ICustomerPointPriceLevel> = [];
let priceeditable: boolean;
let disceditable: boolean;
let enableSN: boolean;
let enableTax: boolean;
let printurl: string = "/Print/Index";
let device: string;
let printfields: string;
let phoneno: string;
//let ispng: boolean;
let salesType: SalesType;
let RefundList: Array<IRefundBase> = [];
let dicAttrVals: { [Key: string]: string } = {};
let dicAttrs: { [Key: string]: IAttribute } = {};
let selectedAttribute: IAttribute;
let reload: boolean = false;
let DicAcAccounts: { [Key: string]: Array<IAccount> } = {};
let nonstock: boolean = false;
let isreplacing: boolean = false;
let itemAcId: number = 0;
let selectedItem: IItem | null;
//let seqItem: { [Key: number]: IItem } = {};
let forsales: boolean = false;
let forReservePaidOut: boolean = false;
let forsimplesales: boolean = false;
let forretailcustomer: boolean = false;
let fordeposit: boolean = false;
let forpurchase: boolean = false;
let forpurchasepayments: boolean = false;
let validPayment: boolean = false;
let fordayends: boolean = false;
let forstockin: boolean = false;
let forjournal: boolean = false;
let forIA: boolean = false;
let itemaccountmode: ItemAccountMode;
let accountList: Array<IAccount> = [];
let AcClfID: string = "";
let ItemAccountNumber: string = "";
let dicItemAccount: { [Key: string]: string } = {};
let dicDefaultAttrRequiredTxt: { [Key: string]: string } = {};
let shop: string = $appInfo.data("shop") as string;
let attrvalue: string = "";
let gattrfilteropener: string = "";
interface PayService {
	authCode: string;
	gateWayUrl: string;
	service: string;
	body: string;
	deviceInfo: string;
	merchantID: string;
	merchantKey: string;
	nonce: string;
	outTradeNo: string;
	machineCreateIP: string;
	totalFee: string;
	signature: string;
	notifyUrl: string;
	signType: string;
	resultCode: string;
	salesItemCodes: string[];
}
interface IAccount {
	AccountID: number;
	AccountName: string;
	AccountNumber: string;
	AccountClassificationID: string;
	ACDescription: string;
	AccountProfileId: number;
}

interface IItemAccount {
	accountList: Array<IAccount>;
	PageIndex: number;
	PageSize: number;
	RecordCount: number;
}
enum ItemAccountMode {
	Buy = 1,
	Sell = 2,
	Inventory = 3,
}
interface ISalesGroup {
	Id: number;
	sgName: string;
	sgDesc: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	UserName: string;
}
let salesgroupMemberModal: any;
let DicSalesGroup: { [Key: string]: Array<ISalesGroup> };
let salesgrouplist: Array<ISalesGroup>;
let salesgroup: ISalesGroup;
let assignedEnquiryModal: any;

let stockTransferEditMode: boolean = false;
let groupSalesmenModal: any;
let rejectreason: string = "";
let stocktransfer: IStockTransfer;

if (!Object.entries) {
	Object.entries = function (obj) {
		var ownProps = Object.keys(obj),
			i = ownProps.length,
			resArray = new Array(i); // preallocate the Array
		while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

		return resArray;
	};
}
let forItem: boolean = false;

interface ISalesman extends ISysUser {
	ModifyTimeDisplay: any;
	AssignedCusCodes: string[];
}

interface IePayResult {
	Message: string;
	Status: number;
	ResultCode: string;
	ServiceStatus: string;
}

enum SalesType {
	retail = 0,
	wholesales = 3,
	refund = 1,
	deposit = 2,
	preorder = 4,
	simplesales = 5
}
let SalesStatus = {
	created: "created",
	depositstart: "depositstart",
	depositsettling: "depositsettling",
	depositsettled: "depositsettled",
	prestart: "prestart",
	presettling: "presettling",
	presettled: "presettled",
	voided: "voided",
};

interface IDayendCountPay {
	selPayMethod: string;
	selAmtSys: number;
	selAmtCount: number;
	isCash: number;
}

interface ISalesBase extends IRtlSale {
	itemcode: string | number;
	itemdesc: string;
	itemname: string;
	price: number;
	qty: number;
	discount: number;
	amount: number;
	amountplustax: number;
	seq: number;
	taxrate: number;
	itemsnlist: string[];
	batchcode: string;
	//Item: IItem;
	isZeroStockItem: boolean;
	rtlUID: number;
	rtlItemCode: string | number;
	rtlSellingPrice: number;
	rtlTaxPc: number;
	rtlBatchCode: string;
	rtlQty: number;
	rtlCode: string;
	rtlSeq: number;
	rtlLineDiscPc: number;
	rtlSalesAmt: number;
	SalesDateDisplay: string;
	DepositAmt: number;
	MonthlyPay: number;
	rtsStatus: string;
	TotalRemainAmt: number | null;
	rtsDvc: string;
}
interface IRefundBase {
	rtlUID: number;
	itemcode: string | number;
	price: number;
	refundedQty: number;
	refundableQty: number;
	qtyToRefund: number;
	discount: number;
	amt: number;
	amtplustax: number;
	rtlSeq: number;
	taxrate: number;
	//isZeroStockItem: boolean;
	//itmDesc: string;
	rtlDesc: string;
	rtlRefSales: string;
	//rtlItemCode: string;
	//rtlSalesAmt: number;
	//rtlQty: number;
	SalesDateDisplay: string;
	vtdelIds: string | null;
	batdelIds: string | null;
	strsnlist: string | null;
	batdelId: number | null;
	vtdelId: number | null;
	rtlSn: string | null;
	rfSeq: number;
	rtlStockLoc: string | null;
}
interface IReturnBase {
	itemcode: string | number;
	batchcode: string | null;
	price: number;
	returnedQty: number;
	returnableQty: number;
	qtyToReturn: number;
	discpc: number;
	amount: number;
	amountplustax: number;
	seq: number;
	taxrate: number;
	taxamt: number;
	itmNameDesc: string;
	psRefCode: string;
	PurchaseDateDisplay: string;
	baseUnit: string;
	serialNo: ISerialNo;
	hasSN: boolean;
	JsValidThru: string;
}
interface IRefundSales {
	rtsServiceChargeAmt: number;
	itmNameDesc: string;
	rtlUID: number;
	rtlValidThru: string | null;
	rtsCode: string;
	rtsRmks: string;
	rtlItemCode: string | number;
	rtlSellingPrice: number;
	rtlTaxPc: number;
	rtlBatch: string | null;
	rtlQty: number;
	rtlRefSales: string;
	rtlSeq: number;
	rtlSalesAmt: number;
	SalesDateDisplay: string;
	rtlCode: string;
	rtlLineDiscPc: number;
	rtlSalesDate: string;
	rtlDesc: string;
	SellingPrice: number;
	SellingPriceDisplay: string;
	refundedQty: number;
	refundableQty: number;
	qtyToRefund: number;
	taxModel: ITaxModel;
	rtlTaxIncl: number;
	rtlTaxExcl: number;
	rtlTaxAmt: number;
	rtlSellingPriceMinusInclTax: number;
	vtdelIds: string | null;
	batdelIds: string | null;
	strsnlist: string | null;
	batdelId: number | null;
	vtdelId: number | null;
	rtlSn: string | null;
	rfSeq: number;
	rtlStockLoc: string | null;
}
interface IReturnPurchase {
	pstCode: string;
	pstRemark: string;
	itmCode: string;
	wslUnitPrice: number;
	wslTaxPc: number;
	wslBatch: string;
	wslQty: number;
	pstRefCode: string;
	wslSeq: number;
	wslAmtPlusTax: number;
	PurchaseDateDisplay: string;
	wslDiscPc: number;
	itmNameDesc: string;
	UnitPriceDisplay: string;
	returnedQty: number;
	returnableQty: number;
	taxModel: ITaxModel;
	wslTaxAmt: number;
}
interface ISalesItem {
	remark: string;
	internalnote: string;
	salescode: string;
	itemcode: string | number;
	rtlSeq: number;
	desc: string;
	batch: string;
	qty: number;
	price: number;
	pricetxt: string;
	disc: number;
	disctxt: string;
	tax: number;
	taxtxt: string;
	amt: number;
	amttxt: string;
	date: string;
	depositqty: number;
	depositamt: number;
	depositamttxt: string;
	depositdate: string;
	qtyavailable: number;
	refundqty: number;
	refundqtytxt: string;
	refundamt: number;
	refundamttxt: string;
	refunddate: string;
	snlist: Array<ISerialNo> | string;
	sncodes: string[];
	customerpo: string;
	deliverydatedisplay: string;
	rtlStockLoc: string | null;
}
interface ITaxModel {
	taxType: TaxType;
	taxRate: number;
	inclTaxAmt: number;
	exclTaxAmt: number;
	taxAmt: number;
	tIN: string;
	EnableTax: boolean;
}
enum TaxType {
	Inclusive,
	Exclusive,
}


interface IItemQty {
	itemcode: string;
	qty: number;
}

interface IDepositRemainItem {
	itemcode: string;
	itemdesc: string;
	price: number;
	qty: number;
	amount: number;
	seq: number;
	depositamt: number;
	remainamt: number;
}

interface ICustomerPointPriceLevel {
	id: number;
	priceLevelID: string;
	customerPoint: number;
	PriceLevelDescription: string;
	PriceLevelID: string;
	CustomerPoint: number;
}
interface ICustomer {
	cusCustomerID: number;
	cusCode: string;
	cusName: string;
	cusContact: string | null;
	cusPhone: string;
	cusMobile: string | null;
	cusEmail: string;
	assignedSalesId: number | null;
	cusAddrLocation: number | null;
	cusAddrStreetLine1: string | null;
	cusAddrStreetLine2: string | null;
	cusAddrStreetLine3: string | null;
	cusAddrStreetLine4: string | null;
	cusAddrStreetLine5: string | null;
	cusAddrRegion: string | null;
	cusAddrCity: string | null;
	CityTxt: string | null;
	cusAddrState: string | null;
	cusAddrPostcode: string | null;
	cusAddrCountry: string | null;
	CountryTxt: string | null;
	cusAddrPhone1: string | null;
	cusAddrPhone2: string | null;
	cusAddrPhone3: string | null;
	cusAddrFax: string | null;
	cusAddrWeb: string | null;
	cusPriceLevel: string | null;
	cusPriceLevelID: string | null;
	cusStatusCode: string | null;
	cusRmks: string | null;
	cusDeposit: number | null;
	cusPointsSoFar: number | null;
	cusPointsActive: number | null;
	cusPointsUsed: number | null;
	cusSaleComment: string | null;
	cusTermsID: number | null;
	enqId: string | null;
	LatePaymentChargePercent: number | null;
	EarlyPaymentDiscountPercent: number | null;
	TermsOfPaymentID: string | null;
	PaymentIsDue: number | null;
	DiscountDays: number | null;
	BalanceDueDays: number | null;
	ImportPaymentIsDue: number | null;
	PaymentTermsDesc: string | null;
	abssSalesID: number | null;
	FollowUpDateDisplay: string | null;
	CurrencyID: number | null;
	CurrencyCode: string | null;
	TaxIDNumber: string | null;
	TaxCodeID: number | null;
	GSTIDNumber: number | null;
	FreightTaxCodeID: number | null;
	UseCustomerTaxCode: boolean | null;
	cusStatus: string | null;
	cusReviewUrl: string | null;
	cusSendNotification: boolean | null;
	cusWhatsappPhoneNo: string | null;
	cusUnsubscribe: boolean | null;
	UnsubscribeTime: string | null;
	cusIsActive: boolean;
	cusIsOrganization: boolean;
	TaxPercentageRate: number | null;
	AccountProfileName: string;
	CustomerItems: ICustomerItem[];
	CreateTimeDisplay: string;
	AddressList: IAddressView[];
	IsLastSellingPrice: boolean | null;
	FollowUpDateInfo: ICustomerInfo;
	FollowUpRecordList: ICustomerInfo[];
	cusPriceLevelDescription: string | null;
	ExchangeRate: number | null;
	cusCheckout: boolean;
	statuscls: string | null;
	CustomAttributes: string | null;
	FollowUpStatus: string | null;
	FollowUpStatusDisplay: string | null;
	UploadFileList: string[];
	FileList: string[];
	ImgList: string[];
	SalesPersonName: string | null;
	DefaultCallCode: string | null;
	PhoneDisplay: string | null;
	Phone1Display: string | null;
	Phone2Display: string | null;
	Phone3Display: string | null;
	EmailDisplay: string;
	GlobalAttributeList: IGlobalAttribute[];
	CustomAttributeList: ICustomAttribute[];
}
interface IAddressView {
	Id: number;
	cusCode: string;
	cusAddrLocation: string;
	AccountProfileId: number;
	StreetLine1: string;
	StreetLine2: string;
	StreetLine3: string;
	StreetLine4: string;
	City: string;
	State: string;
	Postcode: string;
	Country: string;
	Phone1: string;
	Phone2: string;
	Phone3: string;
	Fax: string;
	Email: string;
	Salutation: string;
	ContactName: string;
	WWW: string;
}

interface ISimpleItem {
	itmPicFile: string | null;
	QtySellable: number;
	itmItemID: number;
	itmCode: string;
	itmName: string;
	itmDesc: string;
	itmUseDesc: boolean | null;
	itmTaxPc: number | null;
	itmSellUnit: string;
	itmBaseSellingPrice: number | null;

	PLA: number;
	PLB: number;
	PLC: number;
	PLD: number;
	PLE: number;
	PLF: number;

	itmIsTaxedWhenSold: boolean;

	NameDesc: string;

	CategoryName: string;
	discpc: number;

	itmLastSellingPrice: number;
	singleProId: number | null;
	ItemPromotions: IItemPromotion[];
	catId: number;
	SellingPriceDisplay: string;
	//ServiceChargePercent: number | null;
	//ServiceChargeAmt: number | null;
}
interface IItem extends ISimpleItem {
	ItemOptionsDisplay: string | null;
	ItemVariDisplay: string | null;
	itmIsActive: boolean;
	itmIsNonStock: boolean;
	itmIsQtyFractional: boolean;
	itmIsCombo: boolean;
	itmChgCtrl: string;

	itmCode2: string;

	itmUseDesc2: boolean | null;
	chkSN: boolean | null;
	itmSnReusable: boolean | null;
	chkVT: boolean | null;
	itmValidDays: number | null;
	itmValidThru: string | null;
	itmRedeemable: boolean | null;
	itmRedeemValue: number | null;
	chkBat: boolean | null;
	itmBchWillExpire: boolean | null;
	itmCodeSup: string;
	itmNameSup: string;
	itmCodeSup2: string;
	itmNameSup2: string;
	itmSupDiscPc: number | null;
	itmSupCurr: string;
	itmCodeCus: string;
	itmNameCus: string;
	itmSupCode: string;
	itmItemGrp: string;
	itmItemGrp2: string;
	itmSeries: string;
	itmTaxCode: string;

	itmLength: number | null;
	itmWidth: number | null;
	itmHeight: number | null;
	itmBaseUnit: string;
	itmBulkUnit: string;
	itmBulk2BaseUnit: number | null;
	itmBuyUnit: string;

	itmBuy2Unit: string;
	itmSell2Unit: string;
	itmBuy2BaseUnit: number | null;
	itmSell2BaseUnit: number | null;
	itmRrpLocAdj: boolean | null;
	itmRrpTaxExcl: number | null;
	itmRrpTaxIncl: number | null;
	itmRrp2TaxIncl: number | null;
	itmRrpEquVip: number | null;
	itmTopUpVipOK: boolean | null;
	itmSellUnitOnHand: number | null;
	itmSellUnitAvgCost: number | null;
	itmLastSold: string | null;
	itmBuyStdCost: number | null;
	itmBuyLastCost: number | null;
	itmBuyLastTime: string | null;
	itmMinStockQty: number | null;
	itmPicFile: string;
	itmPicPath: string;
	itmRunUnitCost: number | null;
	itmCntOrgCode: string;
	itmCntOrgName: string;
	itmAuthors: string;
	itmCreateBy: string;
	itmCreateTime: string | null;
	itmModifyBy: string;
	itmModifyTime: string | null;
	itmLockBy: string;
	itmLockTime: string | null;
	itmLastUnitPrice: number | null;
	itmUnitCost: number | null;

	itmSellUnitQuantity: number | null;

	itmBaseUnitPrice: number | null;

	itmDSN: string;

	IsActive: number;
	IncomeAccountID: number;
	InventoryAccountID: number;
	ExpenseAccountID: number;

	itmIsBought: boolean;
	itmIsSold: boolean;
	SellingPriceDisplay: string;

	DicItemAccounts: typeof dicItemAccount;
	LocQtyList: Array<ILocQty>;
	SelectedLocation: string;

	itmIsTaxedWhenBought: boolean;
	itmTaxExclusiveLastPurchasePrice: number | null;
	itmTaxInclusiveLastPurchasePrice: number | null;
	itmTaxExclusiveStandardCost: number | null;
	itmTaxInclusiveStandardCost: number | null;
	lstStockLoc: string;
	BaseSellingPrice: number;
	BaseSellingPriceDisplay: string;
	OnHandStock: number;
	AbssQty: number;
	DicItemLocQty: { [Key: string]: { [Key: string]: number } };
	DicItemAbssQty: { [Key: string]: { [Key: string]: number } };
	OutOfBalance: number;
	LocStockIds: string[];
	JsStockList: Array<IJsStock>;
	JsonJsStockList: string;
	DicLocQty: { [Key: string]: number };

	AttrList: IItemAttribute[];
	SelectedAttrList4V: IItemAttribute[];
	itmWeight: number;
	IsModifyAttr: boolean;
	TotalBaseStockQty: number;
	catId: number;
	hasSelectedIvs: boolean;
	hasItemVari: boolean;
}
interface ILocQty {
	LocCode: string;
	Qty: number;
}
interface ISnVt {
	pocode: string;
	sn: string;
	vt: string | null;
	selected: boolean;
}
let snvt: ISnVt;
interface ISerial extends ISnVt {
	seq: number;
	itemcode: string;
}
interface IItemSnBatVt {
	itemcode: string | number;
	batch: string | null;
	seq: number;
	snvtlist: Array<IBatSnVt>;
	validthru: string | null;
}

interface IItemSnSeqVtList {
	itemcode: string;
	seq: number;
	snseqvtlist: Array<ISnBatSeqVt>;
}

interface ISnBatSeqVt {
	sn: string;
	batcode: string | null;
	snseq: number;
	vt: string | null;
	seq: number;
}


interface IItemSnVtList {
	itemcode: string | number;
	seq: number;
	snvtlist: Array<ISnVt>;
}
interface IItemSN {
	itemcode: string | number;
	seq: number;
	serialcodes: Array<string>;
	validthru: string | null;
}
interface IPayType {
	payId: number;
	pmtCode: string;
	Amount: number;
	pmtIsCash: boolean;
	TotalAmt: number;
	couponLnCode: string | null;
}
let PayType: IPaymentType;
interface ICompanyInfo {
	comName: string;
	comAddress1: string;
	comAddress2: string;
}

interface IReceipt {
	HeaderTitle: string;
	HeaderMessage: string;
	FooterTitle1: string;
	FooterTitle2: string;
	FooterTitle3: string;
	FooterMessage: string;
	Template1: string;
	Template2: string;
	Template3: string;
	Template4: string;
	Template5: string;
	Phone: string;
	Website: string;
	Address: string;
	Address1: string;
	Disclaimer: string;
}

interface ISales extends ISalesBase {
	PayAmt: number;
	SettleDateDisplay: string;
	authcode: string;
	rtsInternalRmks: string;
	epaytype: string;
	rtsExRate: number;
	currency: string;
	inclusiveTax: boolean;
	inclusiveTaxRate: number;
	totalAmount: number;
	remainamt: number;
	rtpChange: number;
	rtpRoundings: number;
	totalpay: number;
	rtsCode: string;
	rtsRmks: string;
	Deposit: number;
	deliveryAddressId: number;
	ireviewmode: number;
	selectedPosSalesmanCode: string | null;
	CustomerPO: string | null;
	DeliveryDate: string | null;
	saveAsPending: boolean;
	Mode: string;
	rtsServiceChargePc: number | null;
	rtsServiceChargeAmt: number | null;
}

interface ISalesRefundBase {
	rtlUID: number;
	salescode: string;
	itemcode: string | number;
	seq: number;
	desc: string;
	batch: string;
	qty: number;
	price: number;
	disc: number;
	tax: number;
	amt: number;
	date: string;
	pricetxt: string;
	disctxt: string;
	taxtxt: string;
	amttxt: string;
	datetxt: string;
	refundedQty: number;
	refundedAmt: number;
	refundedDates: string;
	refundedqtyTxt: string;
	refundedamtTxt: string;
	vtdelId: string | undefined;
	batdelId: string | undefined;
	rtlSn: string | null;
	rtlStockLoc: string | null;
}


interface ISerialNo {
	snoUID: number;
	snoRtlSalesCode: string;
	snoRtlSalesSeq: number;
	SalesDateDisplay: string;
	snoItemCode: string;
	snoCode: string;
	snoStatus: string;
	snoStockInCode: string;
	snoStockInSeq: number;
	snoBatchCode: string | null;
	snoValidThru: string | null;
	StockInDateDisplay: string;
	itmNameDesc: string | null;
	wslSellUnit: string | null;
	wslValidThru: Date | null;
	ValidThruDisplay: string | null;
	wslSellingPrice: number | null;
	wslTaxPc: number | null;
	wslTaxAmt: number | null;
	wslLineDiscAmt: number | null;
	wslLineDiscPc: number | null;
	wslSalesAmt: number | null;
	wslUID: number | null;
	snValidThru: string | null;
	snSeq: number | null;
	seq: number;
}

interface JQuery {
	switchClass(arg0: string, arg1: string, arg2: number, arg3: string): any;
	niceSelect(): any;
	printThis(): any;
	doubleScroll(): any;
	ASPSnippets_Pager(arg0: {
		ActiveCssClass: string;
		PagerCssClass: string;
		PageIndex: any;
		PageSize: any;
		RecordCount: any;
	});
	files({ }): any;
	filestyle({ }): any;
	dialog({ }): any;
	datepicker(): any;
	datepicker({ }): any;
	datepicker({ }, any): any;
	datepicker({ }, { }, { }): any;
	datetimepicker(): any;
	datetimepicker({ }): any;
	datetimepicker({ }, { }): any;
	autocomplete({ }): any;
	daterangepicker({ }, { }): any;
	DataTable({ }): any;
	select2(): any;
	select2({ }): any;
	select2({ }, any): any;
	addHook({ }, { }): any;
	pagination({ }): any;
	before({ }): any;
	accordion({ }): any;
	pagination({ }): any;
	//editableSelect({ }): any;
	button(): any;
	button({ }): any;
	button({ }, { }, { }): any;
	defaultButton({ }): any;
}

interface JQueryStatic {
	prev: any;
	datepicker: any;
	fancybox: any;
	fancyAlert: any;
	fancyConfirm: any;
	ajax(
		url: string,
		type: string,
		data: any,
		contentType: string,
		dataType: string,
		success: Function,
		error: Function
	);
	_data: any;
}

function handleOutOfStocks(
	zerostockItemcodes: string,
	salescode: string | null = null
) {
	let zerostockitemcodelist: string[] = zerostockItemcodes.split(",");
	//console.log("zerostockitemcodelist", zerostockitemcodelist);
	let msg = zerostockitemswarning + ":<br>";
	let codelist: Array<string> = [];
	$.each(zerostockitemcodelist, function (i, e: string) {
		if (!codelist.includes(e)) {
			msg += e + "<br>";
		}
		codelist.push(e);
	});
	$.fancyConfirm({
		title: "",
		message: msg,
		shownobtn: false,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				/*  if (forwholesales) {*/
				window.location.href = "/Item/ZeroStocks?rtsCode=" + salescode;
				//} else {
				//    window.open(printurl);
				//    window.location.reload();
				//}
			}
		},
	});
}

function contactdetail(data: IContact) {
	let salemanname =
		data.SalesPerson == null ? "N/A" : data.SalesPerson.UserName;
	let contact = data.cusContact ?? "N/A";
	let mobile = data.cusMobile ?? "N/A";
	let _isorgan = data.cusIsOrganization;
	let _isorgantxt = _isorgan ? yestxt : notxt;
	let _cname = data.NameDisplay;
	let html =
		"<h3>" +
		contactdetailtxt +
		"</h3>" +
		'<ul class="list-group list-group-flush">';
	html +=
		'<li class="list-group-item"><strong>' +
		isorgantxt +
		"</strong>: " +
		_isorgantxt +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		nametxt +
		"</strong>: " +
		_cname +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		salesmannametxt +
		"</strong>: " +
		salemanname +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		phonetxt +
		"</strong>: " +
		data.cusCode +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		emailtxt +
		"</strong>: " +
		data.cusEmail +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		contacttxt +
		"</strong>: " +
		contact +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		mobiletxt +
		"</strong>: " +
		mobile +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		createtimetxt +
		"</strong>: " +
		data.CreateTimeDisplay +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		modifytimetxt +
		"</strong>: " +
		data.ModifyTimeDisplay +
		"</li>";

	html += "</tbody></table></li>";

	html += "</ul>";
	return html;
}


function searchItem() {
	if (keyword !== "") {
		let _keyword: string = keyword.toLowerCase();
		selectedItemCode = _keyword;
		openWaitingModal();
		GetItems(1);
	}
}

function getItemAccountMode(mode: string): ItemAccountMode {
	switch (mode.toLowerCase()) {
		default:
		case "buy":
			return ItemAccountMode.Buy;
		case "sell":
			return ItemAccountMode.Sell;
		case "inventory":
			return ItemAccountMode.Inventory;
	}
}

function togglePaging(type: string = "item", show: boolean = true) {
	let $pager: JQuery;
	switch (type) {
		case "Customer":
			$target = $("#tblCus");
			break;
		case "HotList":
			$target = $("#tblHotList");
		case "contact":
			$target = $("#tblContact");
			break;
		case "stock":
			$target = $("#tblStock");
			break;
		case "transfer":
			$target = $("#tblTransfer");
			break;
		default:
		case "item":
			$target = $("#tblItem");
	}
	$pager = $(".Pager");
	let $norecord: JQuery = $target.prev("#norecord");
	if (show) {
		$target.show();
		$norecord.addClass("hide");
		$pager.show();
		$("#tblcontact").hide();
	} else {
		//console.log("here");
		$target.hide();
		$norecord.removeClass("hide");
		$pager.hide();
		$("#tblcontact").show();
	}

	let $tblcustomer: JQuery = $("#tblCustomer");
	if ($tblcustomer.length) {
		$tblcustomer.hide();
	}
	let $pagingblk: JQuery = $("#pagingblk");
	if ($pagingblk.length) {
		$pagingblk.hide();
	}
}

function GetTrainings(pageIndex) {
	$.ajax({
		type: "GET",
		url: "/Training/GetTrainings",
		data: { pageIndex, sortCol, sortDirection, keyword },
		success: function (data) {
			//console.log("data:", data);
			if (data && data.pagingTrainingList) {
				TrainingList = data.pagingTrainingList.slice(0);
				if (TrainingList && TrainingList.length > 0) {

					const totalRecord: number = Math.min(...TrainingList.map(x => x.TotalRecord));

					$target = $("#tblmails .colheader");
					$target.removeClass("fa fa-sort-up fa-sort-down");
					$target = $target.eq(sortCol);
					$target.addClass("fa");
					if (sortDirection.toUpperCase() == "DESC") {
						sortDirection = "ASC";
						$target.addClass("fa-sort-down");
					} else {
						sortDirection = "DESC";
						$target.addClass("fa-sort-up");
					}

					fillInTrainingTable();

					$(".Pager").ASPSnippets_Pager({
						ActiveCssClass: "current",
						PagerCssClass: "pager",
						PageIndex: pageIndex,
						PageSize: PageSize,
						RecordCount: totalRecord,
					});
					$("#totalcount").text(totalRecord);
				}
			}
		},
		dataType: "json",
		error: onAjaxFailure,
	});
}
function GetJobs(pageIndex) {
	$.ajax({
		type: "GET",
		url: "/Job/GetJobs",
		data: { pageIndex, sortCol, sortDirection, keyword },
		success: function (data) {
			//console.log("data:", data);
			if (data && data.pagingJobList) {
				JobList = data.pagingJobList.slice(0);
				if (JobList && JobList.length > 0) {
					const totalRecord: number = Math.min(...JobList.map(x => x.TotalRecord));

					$target = $("#tblmails .colheader");
					$target.removeClass("fa fa-sort-up fa-sort-down");
					$target = $target.eq(sortCol);
					$target.addClass("fa");
					if (sortDirection.toUpperCase() == "DESC") {
						sortDirection = "ASC";
						$target.addClass("fa-sort-down");
					} else {
						sortDirection = "DESC";
						$target.addClass("fa-sort-up");
					}

					fillInJobTable();

					$(".Pager").ASPSnippets_Pager({
						ActiveCssClass: "current",
						PagerCssClass: "pager",
						PageIndex: pageIndex,
						PageSize: PageSize,
						RecordCount: totalRecord,
					});
					$("#totalcount").text(totalRecord);
				}
			}
		},
		dataType: "json",
		error: onAjaxFailure,
	});
}
function GetAttendances(pageIndex) {
	$.ajax({
		type: "GET",
		url: "/Attendance/GetAttendances",
		data: { pageIndex, sortCol, sortDirection, keyword },
		success: function (data) {
			//console.log("data:", data);
			if (data) {
				AttendanceList = data.pagingAttdList.slice(0);
				if (AttendanceList && AttendanceList.length > 0) {
					const totalRecord: number = Math.min(...AttendanceList.map(x => x.TotalRecord));

					$target = $("#tblmails .colheader");
					$target.removeClass("fa fa-sort-up fa-sort-down");
					$target = $target.eq(sortCol);
					$target.addClass("fa");
					if (sortDirection.toUpperCase() == "DESC") {
						sortDirection = "ASC";
						$target.addClass("fa-sort-down");
					} else {
						sortDirection = "DESC";
						$target.addClass("fa-sort-up");
					}

					fillInAttdTable();

					$(".Pager").ASPSnippets_Pager({
						ActiveCssClass: "current",
						PagerCssClass: "pager",
						PageIndex: pageIndex,
						PageSize: PageSize,
						RecordCount: totalRecord,
					});
					$("#totalcount").text(totalRecord);
				}
			}
		},
		dataType: "json",
		error: onAjaxFailure,
	});
}
function GetEnquiries(pageIndex) {
	openWaitingModal();
	//console.log("sortDirection#0:" + sortDirection);
	$.ajax({
		type: "GET",
		url: "/Enquiry/GetEnquiries",
		data: { pageIndex, sortCol, sortDirection, keyword },
		success: function (data) {
			//console.log("data:", data);
			if (data) {
				EnquiryList = data.pagingEnqList.slice(0);
				if (EnquiryList && EnquiryList.length > 0) {
					//const min = Math.min(...myArray.map(item => item.cost))
					const totalRecord: number = Math.min(...EnquiryList.map(x => x.TotalRecord));

					$target = $("#tblmails .colheader");
					$target.removeClass("fa fa-sort-up fa-sort-down");
					$target = $target.eq(sortCol);
					$target.addClass("fa");

					if (sortDirection.toUpperCase() == "DESC") {
						sortDirection = "ASC";
						$target.addClass("fa-sort-down");
					} else {
						sortDirection = "DESC";
						$target.addClass("fa-sort-up");
					}

					//console.log("sortDirection#1:" + sortDirection);

					fillInEnqTable();

					$(".Pager").ASPSnippets_Pager({
						ActiveCssClass: "current",
						PagerCssClass: "pager",
						PageIndex: pageIndex,
						PageSize: PageSize,
						RecordCount: totalRecord,
					});
					$("#totalcount").text(totalRecord);
				}
				closeWaitingModal();
			}
		},
		dataType: "json",
		error: onAjaxFailure,
	});
}
$(document).on("change", "#drpLatestRecordCount", function () {
	sortDirection = sortDirection.toUpperCase() == "DESC" ? "ASC" : "DESC";
	handleMGTmails(1, Number($(this).val()));
});
function GetItems(pageIndex) {
	let type = getParameterByName("type") ?? "";

	shop = $("#drpLocation").length
		? ($("#drpLocation").val() as string)
		: $infoblk.data("location")
			? ($infoblk.data("location") as string)
			: ($infoblk.data("shop") as string);

	let data = { pageIndex: pageIndex, keyword: keyword, location: shop, forsales: forsales, forwholesales: forwholesales, forpurchase: forpurchase, forstock: forstock, fortransfer: fortransfer, forpreorder: forpreorder, type: type };


	openWaitingModal();
	$.ajax({
		url: "/Api/GetItemsAjax",
		type: "GET",
		data: data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: OnSuccess,
		error: onAjaxFailure,
	});
}
function OnSuccess(response) {
	closeWaitingModal();
	var model = response;
	seq = currentY + 1;

	DicItemOptions = response.DicItemOptions;

	if (model.Items.length > 0) {
		ItemList = model.Items.slice(0);

		if (searchItemMode) searchItemMode = false;
		if (ItemList.length === 1) {
			if (searchItemMode) {
				closeItemModal();
			}

			selectedItemCode = ItemList[0].itmCode;
			if (forsales) {
				selectedSalesLn = GetSetSelectedSalesLn();
				selectedSalesLn!.Item = structuredClone(ItemList[0]);
			}
			if (forpreorder) {
				selectedPreSalesLn = GetSetSelectedPreSalesLn();
				selectedPreSalesLn!.Item = structuredClone(ItemList[0]);
			}
			if (forwholesales) {
				selectedWholesalesLn = GetSetSelectedWholeSalesLn();
				selectedWholesalesLn!.Item = structuredClone(ItemList[0]);
			}
			if (forpurchase) {
				SelectedPurchaseItem = GetSetSelectedPurchaseItem();
				SelectedPurchaseItem!.Item = structuredClone(ItemList[0]);
			}

			if (forsales || forpurchase || forwholesales || forpreorder || forIA || forEditReserve) {
				$(".itemcode").off("change");
				if (forEditReserve) populateReserveRow();
				else populateSalesRow();
				$(".itemcode").on("change", handleItemCodeChange);
			}
			else {
				copiedItem = structuredClone(ItemList[0]);
			}
		} else {
			openItemModal();
			writeItems(model.Items);
		}

		$(".Pager").ASPSnippets_Pager({
			ActiveCssClass: "current",
			PagerCssClass: "pager",
			PageIndex: model.PageIndex,
			PageSize: model.PageSize,
			RecordCount: model.RecordCount,
		});
	} else {
		togglePaging("item", false);
	}
}
function GetSetSelectedPreSalesLn(): IPreSalesLn {
	if (PreSalesLnList.length > 0) {
		let idx = PreSalesLnList.findIndex((x) => { return x.rtlSeq == seq; });
		if (idx >= 0) selectedPreSalesLn = PreSalesLnList[idx];
		else {
			initSimpleItem();
			PreSalesLnList.push(selectedPreSalesLn!);
		}
	} else {
		PreSalesLnList = [];
		initSimpleItem();
		PreSalesLnList.push(selectedPreSalesLn!);
	}
	return selectedPreSalesLn!;
}
function initSimpleItem() {
	selectedPreSalesLn = {} as IPreSalesLn;
	selectedPreSalesLn.rtlSeq = seq;
	selectedPreSalesLn.rtlItemCode = selectedItemCode
		? selectedItemCode.toString()
		: getItemCodeBySeq();
}

function GetSetSelectedSalesLn(): ISalesLn {
	if (SalesLnList.length > 0) {
		let idx = SalesLnList.findIndex((x) => { return x.rtlSeq == seq; });
		if (idx >= 0) selectedSalesLn = SalesLnList[idx];
		else {
			selectedSalesLn = initSalesLn();
			SalesLnList.push(selectedSalesLn);
		}
	} else {
		SalesLnList = [];
		selectedSalesLn = initSalesLn();
		SalesLnList.push(selectedSalesLn);
	}
	return selectedSalesLn;
}
function GetSetSelectedWholeSalesLn(): IWholeSalesLn {
	if (WholeSalesLns.length > 0) {
		let idx = WholeSalesLns.findIndex((x) => { return x.wslSeq == seq; });
		if (idx >= 0) selectedWholesalesLn = WholeSalesLns[idx];
		else {
			selectedWholesalesLn = initWholeSalesLn();
			WholeSalesLns.push(selectedWholesalesLn);
		}
	} else {
		selectedWholesalesLn = initWholeSalesLn();
		WholeSalesLns.push(selectedWholesalesLn);
	}
	return selectedWholesalesLn;
}
function GetSetSelectedPurchaseItem(): IPurchaseItem {
	if (Purchase.PurchaseItems.length > 0) {
		let idx = Purchase.PurchaseItems.findIndex((x) => { return x.piSeq == seq; });
		if (idx >= 0) SelectedPurchaseItem = Purchase.PurchaseItems[idx];
		else {
			SelectedPurchaseItem = initPurchaseItem();
			Purchase.PurchaseItems.push(SelectedPurchaseItem);
		}
	} else {
		SelectedPurchaseItem = initPurchaseItem();
		Purchase.PurchaseItems.push(SelectedPurchaseItem);
	}
	return SelectedPurchaseItem;
}

function writeItems(itemList: IItem[]) {
	let html = "";
	$.each(itemList, function () {
		var item = this;
		const itemcode: string = item.itmCode;
		let _qty: number = item.QtySellable;

		let trcls = "itmcode", proId = 0;

		if (forEditReserve) trcls = selectedItemCodes.includes(itemcode) ? "dimrow" : "";

		if (forIA) trcls = item.AbssQty <= 0 ? "" : "itmcode";

		if (!forpurchase) {
			if (item.ItemPromotions.length > 0) {
				if (item.ItemPromotions.find((e) => e.pro4Period)) {
					trcls += " period";
					proId = item.ItemPromotions.find((e) => e.pro4Period)!.proId;
				} else {
					trcls += " nonperiod";
					proId = item.ItemPromotions[0].proId;
				}
			}
		}

		html += `<tr class="${trcls}" data-code="${itemcode}" data-proid="${proId}" data-qty="${_qty}" data-abssqty="${item.AbssQty}">`;
		html += `<td>${itemcode}</td>`;

		var namedesc = handleItemDesc(item.NameDesc);
		html += `<td style="max-width:250px;" title="${item.NameDesc}">${namedesc}</td>`;
		let outofstock: boolean = forsales || forsimplesales || forpreorder || forIA ? false : itemcode.startsWith("/") ? false : _qty <= 0;
		if (!forpurchase) {
			let tdcls = outofstock ? "outofstock" : "";
			let qtydisplay = `${_qty}`;
			if (forIA) qtydisplay = `${_qty} <span class="text-primary font-weight-bold">(${item.AbssQty})</span>`;
			html += `<td class="${tdcls} text-right">${qtydisplay}</td>`;
		}

		let price: number = 0;

		if (forsales || forwholesales || forstock || forpreorder) {
			price = item.itmBaseSellingPrice!;
		}

		if (forpurchase) price = item.itmBuyStdCost!;
		if (forIA) price = item.itmSellUnitAvgCost ?? 0;

		html += `<td style="text-align:rigth;width:100px;max-width:100px;">${formatnumber(price)}</td>`;

		let _chkbated = "",
			_chksned = "",
			_chkexp = "";
		if (DicItemOptions.hasOwnProperty(itemcode)) {
			let itemoptions = DicItemOptions[itemcode];
			if (itemoptions)
				_chkbated = itemoptions.ChkBatch
					? itemoptions.ChkBatch
						? "checked"
						: ""
					: "";
			_chksned = itemoptions.ChkSN ? (itemoptions.ChkSN ? "checked" : "") : "";

			_chkexp = itemoptions.WillExpire
				? itemoptions.WillExpire
					? "checked"
					: ""
				: "";
		}

		let _chkbatcls = _chkbated == "checked" ? "danger" : "";
		let _chksncls = _chksned == "checked" ? "danger" : "";
		let _chkexpcls = _chkexp == "checked" ? "danger" : "";

		let chklist = `<div class="form-check form-check-inline">
        <input class="form-check-input ${_chkbatcls}" type="checkbox" Id="chkBatch" value="1" disabled ${_chkbated}>
        <label class="form-check-label" for="chkBatch">${batchtxt}</label>
    </div>

    <div class="form-check form-check-inline">
        <input class="form-check-input ${_chksncls}" type="checkbox" Id="chkSN" value="1" disabled ${_chksned}>
        <label class="form-check-label" for="chkSN">${serialnotxt}</label>
    </div>

    <div class="form-check form-check-inline">
        <input class="form-check-input ${_chkexpcls}" type="checkbox" Id="chkExpiry" value="1" disabled ${_chkexp}>
        <label class="form-check-label" for="chkExpiry">${expirydatetxt}</label>
    </div>`;

		html += `<td style="width:220px;min-width:220px;">${chklist}</td>`;

		let facls = item.hasItemVari ? "check" : "xmark";
		let displaycls = item.hasItemVari ? "text-success" : "text-danger";
		html += `<td><span class="fa fa-${facls} ${displaycls}"></span></td>`;

		if (!forpurchase && !forEditReserve) {
			seq = currentY + 1;
			let urlist = "";
			if (((forsales || forwholesales) && !outofstock) || forpreorder) urlist = genProUrList(urlist, item);
			html += `<td style="width:250px;min-width:250px;">${urlist}</td>`;
		}

		html += "</tr>";
	});
	$("#tblItem tbody").empty().append(html);
	if (!forpurchase && !forIA) {
		$("#tblItem tbody tr").each(function (i, e) {
			if ($(e).find("td").eq(2).hasClass("outofstock")) {
				$(e).removeClass("itmcode").addClass("outofstock");
			} else if (!$(e).hasClass("dimrow")) {
				$(e).addClass("itmcode").removeClass("outofstock");
			}
		});
	}
}

$(document).on("click", "#tblmails th", function () {
	sortName = $(this).data("category");
	sortCol = Number($(this).data("col"));
	PageNo = 1;
	if (forenquiry) GetEnquiries(PageNo);
	if (forattendance) GetAttendances(PageNo);
	if (forjob) GetJobs(PageNo);
	if (fortraining) GetTrainings(PageNo);
});
$(document).on("click", ".Pager .page", function () {
	PageNo = Number($(this).attr("page"));
	if (forenquiry) GetEnquiries(PageNo);
	else if (forattendance) GetAttendances(PageNo);
	else if (forjob) GetJobs(PageNo);
	else if (fortraining) GetTrainings(PageNo);
	else if (forstock) GetStocks(PageNo);
	else if (forcustomer) GetCustomerGroupList(PageNo);
	else if (forretailcustomer) GetCustomers4Sales(PageNo);
	else GetItems(PageNo);
});
$(document).on("click", "#tblItem th a", function () {
	sortName = $(this).data("category");
	sortDirection = sortDirection == "ASC" ? "DESC" : "ASC";
	/* console.log('sortname:' + sortName + ';sortdir:' + sortDirection);*/
	PageNo = 1;
	GetItems(PageNo);
});
function genProUrList(urlist: string, item: IItem) {
	urlist = "<ul class='nostylelist'>";
	if (ItemVari &&
		ItemVari.ItemPromotions.length > 0 &&
		(forsales || forpreorder || forwholesales)) {
		urlist += genPromotionHtml(ItemVari.ItemPromotions);
	} else if (item.ItemPromotions.length > 0 &&
		(forsales || forpreorder || forwholesales)) {
		urlist += genPromotionHtml(item.ItemPromotions);
	}
	urlist += "</ul>";
	return urlist;
}
function genPromotionHtml(ItemPromotions: IItemPromotion[]) {
	let html = ``;
	$.each(ItemPromotions, function (i, e) {
		//fillItemPromotion(e);
		// console.log("ip:", itemPromotion);
		if (e.pro4Period) {
			html += `<li class="period"><div class="alert alert-success">${itemperiodpromotiontxt}</div>${discountitemheader}:${e.DiscPcDisplay} <button class="btn btn-danger proItem period" data-code="${e.itemCode}" data-proid="${e.proId}" data-type="period">${selecttxt}</button></li>`;
		} else {
			html += `<li class="nonperiod"><div class="alert alert-warning">${itemqtypromotiontxt}</div>${qtytxt}:${e.proQty};${sellingpricetxt}${currency}:${e.PriceDisplay};${discountitemheader}:${e.DiscPcDisplay} <button class="btn btn-danger proItem nonperiod" data-code="${e.itemCode}" data-proid="${e.proId}" data-type="nonperiod">${selecttxt}</button></li>`;
		}
	});
	return html;
}

function fillItemPromotion(e: IItemPromotion) {
	itemPromotion = initItemPromotion();
	itemPromotion.proId = e.proId;
	itemPromotion.DateFrmDisplay = e.DateFrmDisplay;
	itemPromotion.DateToDisplay = e.DateToDisplay;
	itemPromotion.NameDisplay = e.NameDisplay;
	itemPromotion.DescDisplay = e.DescDisplay;
	itemPromotion.IPCreateTimeDisplay = e.IPCreateTimeDisplay;
	itemPromotion.IPModifyTimeDisplay = e.IPModifyTimeDisplay;
	itemPromotion.pro4Period = e.pro4Period;
	itemPromotion.proDiscPc = e.proDiscPc;
	itemPromotion.proPrice = e.proPrice;
	itemPromotion.proQty = e.proQty;
}

function searchCus(_mode: string = "") {
	if (keyword !== "") {
		keyword = keyword.toLowerCase();
	}
	if (_mode === "CustomerAttribute") {
	} else {
		selectedCusCodeName = keyword;
	}
	openWaitingModal();
	searchcusmode = true;
	GetCustomers4Sales(1, _mode);
}

function openCusModal() {
	cusModal.dialog("open");
	$("#txtCustomer").trigger("focus");
}
function closeCusModal() {
	cusModal.dialog("close");
	if (typeof selectedCusCodeName !== "undefined") {
		// console.log("selectedcuscode:" + selectedCusCodeName);
		if (selectedCusCodeName === "GUEST") {
			$("#txtCustomerName").val("GUEST");
		}
	}
	$("#txtCustomer").val("");
	forretailcustomer = !forretailcustomer;
}

function updateRows4Tax() {
	let taxpc: number = GetTaxPc();
	//console.log("here");
	$(`#${gTblId} tbody tr`).each(function (i, e) {
		if ($(e).find(".itemcode").val() !== "") {
			//console.log("taxpc:" + taxpc);
			let $taxpc = $(e).find(".taxpc");
			if ($taxpc.length) {
				$taxpc.off("change");
				$taxpc.data("taxpc", taxpc).val(formatnumber(taxpc));
				$taxpc.on("change", handleTaxChange);
				//console.log("tax trigger change#updateRows");
				$taxpc.trigger("change");
			}
		}
	});

}
function GetTaxPc(): number {
	let taxpc: number = 0;
	if (forsales) {
		if (reviewmode) { //salesorderlist
			taxpc =
				enableTax && selectedCus && selectedSimpleSalesLn!.Item.itmIsTaxedWhenSold
					? selectedCus.TaxPercentageRate!
					: 0;
		} else {
			taxpc =
				enableTax && selectedCus && selectedSalesLn!.Item.itmIsTaxedWhenSold
					? selectedCus.TaxPercentageRate!
					: 0;
		}

	}
	if (forpreorder && selectedPreSalesLn) {
		taxpc =
			enableTax && selectedCus && selectedPreSalesLn!.Item.itmIsTaxedWhenSold
				? selectedCus.TaxPercentageRate!
				: 0;
	}
	if (forwholesales && selectedWholesalesLn) {
		taxpc =
			enableTax &&
				selectedCus &&
				selectedWholesalesLn!.Item.itmIsTaxedWhenSold
				? selectedCus.TaxPercentageRate!
				: 0;
	}
	if (forpurchase && SelectedPurchaseItem) {
		taxpc =
			enableTax &&
				SelectedSupplier &&
				SelectedPurchaseItem!.Item.itmIsTaxedWhenBought
				? SelectedSupplier.TaxPercentageRate!
				: 0;
	}
	//console.log("taxpc:", taxpc);
	return taxpc;
}

function GetCustomers4Sales(pageIndex, mode = "") {
	let data = { pageIndex: pageIndex, mode: mode, keyword: keyword };
	// console.log("data:", data);
	/*return false;*/
	openWaitingModal();
	var callback;

	if (mode === "" || mode == "search") {
		callback = OnGetCustomersSuccess;
	} else if (mode === "attribute") {
		callback = OnSearchCustomersSuccess;
	}

	$.ajax({
		url: "/Api/GetCustomers4Retail",
		type: "GET",
		data: data,
		/*contentType: "application/json; charset=utf-8",*/
		dataType: "json",
		success: callback,
		error: onAjaxFailure,
	});
}
function OnGetCustomersSuccess(response) {
	keyword = "";
	closeWaitingModal();
	// console.log("response:", response);
	var model = response;

	//console.log("modelcustomers:", model.Customers);
	if (model.Customers.length > 0) {
		//togglePaging("Customer", true);

		CusList = model.Customers.slice(0);
		if (CusList.length === 1) {
			selectedCus = structuredClone(CusList[0]);
			//console.log("selectedCus#ongetcustomerssccuess:", selectedCus);
			selectedCusCodeName = selectedCus.cusCode;
			selectCus();
			closeCusModal();
		} else {
			openCusModal();
			_writeCustomers(CusList);
		}

		if (searchcusmode) {
			searchcusmode = false;
		} else {
			$(".Pager").ASPSnippets_Pager({
				ActiveCssClass: "current",
				PagerCssClass: "pager",
				PageIndex: model.PageIndex,
				PageSize: model.PageSize,
				RecordCount: model.RecordCount,
			});
		}
	}
	else {
		$.fancyConfirm({
			title: "",
			message: nocustomersfoundtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(".customer").val("");
					$("#txtCustomerName").val(defaultcustomer.cusName).trigger("focus");
				}
			}
		});
	}
}

function _writeCustomers(_customerlist: Array<ICustomer>) {
	let html = "";
	$.each(_customerlist, function (i, e) {
		html +=
			'<tr class="cuscode" data-code="' +
			e.cusCode +
			'"><td>' +
			e.cusCode +
			"</td><td>" +
			e.cusName +
			"</td></tr>";
	});
	$target = $("#tblCus tbody");
	$target.find("tr.cuscode").remove();
	$target.append(html);
	$target.find(".Pager").empty();
}
function OnSearchCustomersSuccess(response) {
	keyword = "";
	closeWaitingModal();
	//console.log("response:", response);
	var model = response;
	//console.log("modelcustomers:", model.Customers);

	if (model.Customers.length > 0) {
		togglePaging("Customer", true);
		CusList = model.Customers.slice(0);
		//console.log("cuslist:", CusList);
		if (typeof CusList === "undefined") {
			GetCustomers4Sales(1);
		} else {

			var row = $("#tblCus tr:last-child").removeAttr("style").clone(false);
			$("#tblCus tr").not($("#tblCus tr:first-child")).remove();

			$.each(CusList, function () {
				var customer = this;
				row.addClass("cuscode").attr("data-code", customer.cusCustomerID);
				let chktag = `<input type="checkbox" class="chk" data-id="${customer.cusCustomerID}">`;
				let detailtag = `<a href="#" class="btn btn-success detail" role="button" data-id="${customer.cusCustomerID}">${detailtxt}</a></td>`;
				let callhistorytag = `<a href="/CallHistory/Index?customerId=${customer.cusCustomerID}" class="btn btn-outline-warning" role="button"><span class="small">${callhistorytxt}</span></a>`;
				let attrtag = `<a class="btn btn-primary" role="button" href="/CustomerAttribute/Index?customerId=${customer.cusCustomerID}">${attributetxt}</a>`;
				let editremovetag = `<a class="btn btn-info" role="button" href="/Customer/Edit?customerId=${customer.cusCustomerID}"><span class="small">${edittxt}</span></a>
                    <a class="btn btn-danger remove" role="button" href="#" data-id="${customer.cusCustomerID}"><span class="small">${removetxt}</span></a>`;
				let salesman = "N/A";

				$("td", row)
					.eq(0)
					.css({ width: "5px", "max-width": "5px" })
					.addClass("text-center")
					.html(chktag);
				$("td", row)
					.eq(1)
					.css({ width: "110px", "max-width": "110px" })
					.addClass("text-center")
					.html(customer.cusName);
				$("td", row)
					.eq(2)
					.css({ width: "100px", "max-width": "100px" })
					.addClass("text-center")
					.html(customer.cusContact ?? "");
				$("td", row)
					.eq(3)
					.css({ width: "110px", "max-width": "110px" })
					.addClass("text-center")
					.html(customer.cusEmail ?? "");
				$("td", row)
					.eq(4)
					.css({ width: "100px", "max-width": "100px" })
					.addClass("text-center")
					.html(customer.AccountProfileName ?? "");
				$("td", row)
					.eq(5)
					.css({ width: "100px", "max-width": "100px" })
					.addClass("text-center")
					.html(salesman);
				$("td", row)
					.eq(6)
					.css({ width: "70px", "max-width": "70px" })
					.html(detailtag);
				$("td", row)
					.eq(7)
					.css({ width: "90px", "max-width": "90px" })
					.html(callhistorytag);
				$("td", row)
					.eq(8)
					.css({ width: "90px", "max-width": "90px" })
					.html(attrtag);
				$("td", row)
					.eq(9)
					.css({ width: "125px", "max-width": "125px" })
					.html(editremovetag);
				$("#tblCus").append(row);
				row = $("#tblCus tr:last-child").clone(false);
			});
			$(".Pager").ASPSnippets_Pager({
				ActiveCssClass: "current",
				PagerCssClass: "pager",
				PageIndex: model.PageIndex,
				PageSize: model.PageSize,
				RecordCount: model.RecordCount,
			});
		}
		//}
	} else {
		togglePaging("Customer", false);
	}
}

$(document).on("click", "#tblCus th a", function () {
	sortName = $(this).data("category");
	sortDirection = sortDirection == "ASC" ? "DESC" : "ASC";
	/* console.log('sortname:' + sortName + ';sortdir:' + sortDirection);*/
	PageNo = 1;
	GetCustomers4Sales(PageNo);
});

function openItemModal(msg = "") {
	itemModal.find(".warning").text("");
	itemModal.dialog("option", { width: 1250, title: searchitem });
	itemModal.dialog("open");
	$target = $("#txtItem");

	$target.trigger("focus");
	$target.val(selectedItemCode ?? keyword);

	if (msg !== "") {
		itemModal.find(".warning").text(msg);
	}
}

function closeItemModal() {
	keyword = "";
	itemModal.dialog("close");
}

function initAccount(): IAccount {
	return {
		AccountID: 0,
		AccountName: "",
		AccountNumber: "",
		AccountClassificationID: "",
		ACDescription: "",
		AccountProfileId: 0,
	};
}

function saveAttributeVals(edit = true) {
	//closeComboModal();

	let _attform = new attform(edit);
	if (_attform.validform()) {
		_attform.submitForm();
	}
}

function editAttribute(ele, editmode: boolean) {
	let $tr: JQuery = $(ele).parent("td").parent("tr");
	//console.log('tr:', $tr);
	let attrId: string = editmode ? $tr.data("attid") : $tr.data("attname");
	console.log("attid:" + attrId);
	selectedAttribute = fillAttribute($tr);
	console.log("selectedattribute#editattribute:", selectedAttribute);

	if (!$(ele).hasClass("dropdown")) {
		if ($(ele).hasClass("combo")) {
			if (editmode) {
				addValRows(selectedAttribute, dicAttrVals[attrId]);
			} else {
				addValRows(selectedAttribute, defaultAttVals[attrId]);
			}
		} else {
			addValRow(selectedAttribute, $(ele).data("attval"));
		}
	}

	if ($(ele).hasClass("dropdown") || $(ele).hasClass("combo")) {
		if ($(ele).hasClass("combo")) {
			let _ele = $(ele).prev(".form-control");
			console.log("here");
			openDropDownModal(_ele);
		} else {
			openDropDownModal(ele);
		}
	}
	//else {
	//    openComboModal(ele);
	//}
}


function editAttVals(ele, editmode: boolean) {
	console.log(
		"editmode:" +
		editmode +
		";selectedattribute attid:" +
		selectedAttribute.attrId
	);
	console.log("dicattvals:", dicAttrVals);
	attrvalue = editmode
		? dicAttrVals[selectedAttribute.attrId]
		: defaultAttVals[selectedAttribute.attrName];
	console.log("attvalue:", attrvalue);
	let _val: string = <string>$(ele).val();
	savemode = $(ele).hasClass("combo") ? "combo" : "text";
	console.log("savemode:" + savemode);
	//if (_val !== '') {
	//    let idx = -1;
	//    $.each(attvalues, function (i, e) {
	//        console.log('eleval:' + _val + ';e:' + e);
	//        if (e == $(ele).val()) {
	//            idx = i;
	//            return false;
	//        }
	//    });
	//    console.log('idx:' + idx + ';savemodel:' + savemode);
	//    if (idx === -1) {
	//        if (savemode === 'combo') {
	//            attvalues.push(_val);
	//            //remove old val:
	//            $.each(attvalues, function (i, e) {
	//                if (e == $(ele).data('attval')) {
	//                    idx = i;
	//                    return false;
	//                }
	//            });
	//            if (idx >= 0) {
	//                attvalues.splice(idx, 1);
	//            }
	//        } else {
	//            attvalues[0] = _val;
	//        }
	//    }
	//    console.log('attvalues:', attvalues);
	//} else {
	//    if (savemode === 'text') {
	//        attvalues[0] = '';
	//    } else {
	//        let _oldval = $(ele).data('attval');
	//        let idx = -1;
	//        $.each(attvalues, function (i, e) {
	//            if (e == _oldval) {
	//                idx = i;
	//                return false;
	//            }
	//        });
	//        if (idx >= 0) {
	//            attvalues.splice(idx, 1);
	//        }
	//    }
	//}

	if (editmode) {
		dicAttrVals[selectedAttribute.attrId] = attrvalue;
	} else {
		defaultAttVals[selectedAttribute.attrName] = attrvalue;
	}

	selectedAttribute.attrValue = attrvalue;
}

function addValRows(
	selectedAttribute: IAttribute,
	attvals: string,
	append: boolean = false
) {
	//console.log('addrows');
	console.log("selectedAttribute:", selectedAttribute);
	let attrId = selectedAttribute.attrId;
	$("#attrName").val(selectedAttribute.attrName);
	let plusbtn = `<div class="plus radius float-right" title="${addattributeval}"></div><div class="clearfix"></div>`;
	let row: string = "";
	if (append) {
		console.log("append");
		row += `<div class="row my-2">
            <input type="text" name="attrValue" data-attid="${attrId}" class="form-control combo attval" value="">
        </div>`;
		comboModal.find(".container").append(row);
	} else {
		console.log("notappend");
		row += `<label class="control-label" for="attval" style="margin-left:-.8em;">${attvaltxt}</label>`;
		if (typeof attvals !== "undefined" && attvals.length > 0) {
			$.each(attvals, function (i, attval) {
				row += `<div class="row my-2">
            <input type="text" name="attrValue" data-attid="${attrId}" class="form-control combo attval" data-attval="${attval}" value="${attval}">
        </div>`;
			});
		} else {
			row += `<div class="row my-2">
            <input type="text" name="attrValue" data-attid="${attrId}" class="form-control combo attval" value="">
        </div>`;
		}

		comboModal.find(".container").empty().append(plusbtn).append(row);
	}

	let $attname: JQuery = comboModal.find(".attname");
	console.log("emptyval?" + ($attname.val() === ""));
	if ($attname.val() === "") {
		$attname.trigger("focus");
	} else {
		comboModal
			.find(".container")
			.find(".attval")
			.each(function (i, e) {
				if ($(e).val() === "") {
					$(e).trigger("focus");
					return false;
				}
			});
	}
}

function addValRow(selectedAttribute: IAttribute, attval: string = "") {
	console.log("selectedAttribute:", selectedAttribute);
	let attrId = selectedAttribute.attrId;
	$("#attrName").val(selectedAttribute.attrName);
	let row: string = `<div class="row my-2">
 <label class="control-label" for="attval">${attvaltxt}</label>
            <input type="text" Id="attval" name="attrValue" data-attid="${attrId}" class="form-control text attval" value="${attval}">
        </div>`;
	comboModal.find(".container").empty().append(row);
	comboModal
		.find(".container")
		.find(".attval")
		.each(function (i, e) {
			if ($(e).val() === "") {
				$(e).trigger("focus");
				return false;
			}
		});
}

function openComboModal(ele = null) {
	comboModal.dialog("open");
}
function closeComboModal() {
	comboModal.dialog("close");
	if (reload) {
		window.location.reload();
	}
}

function openChangeModal() {
	changeModal.dialog("option", { width: 500, title: saleschange });
	changeModal.dialog("open");

	switch (salesType) {
		case SalesType.deposit:
			changeModal.find(".totalremainamt").text(formatmoney(itotalremainamt));
			break;
		case SalesType.refund:
		default:
		case SalesType.retail:
			$("#totalsalesamt").text(formatmoney(itotalamt));
			break;
	}

	$("#changeamt").text(formatmoney(Sales.rtpChange));
}

function getTotalPayments(): number {
	let payments: number = 0;
	$("#tblPay tbody tr").each(function (i, e) {
		let $chk = $(e).find(".chkpayment");
		if ($chk.is(":checked")) {
			let $pay = $(e).find(".paymenttype");
			if ($chk.is(":checked")) {
				payments += Number($pay.val());
			}
		}
	});
	return financial(payments);
};

function getPaymentRemain(): number {
	let subtotal = getTotalAmt4Order();
	console.log("subtotal:" + subtotal);
	GetServiceChargeAmt(subtotal);
	Sales.rtsFinalTotal = subtotal + ServiceChargeAmt;
	console.log("Sales.rtsFinalTotal:", Sales.rtsFinalTotal);
	let payments = getTotalPayments();
	console.log("payments:" + payments);
	return financial(Sales.rtsFinalTotal - payments);
}

function setRemain($e: JQuery, amt: number) {
	let type: string = <string>$e.attr("id")?.toString();
	let code: string = $e.attr("id") as string;
	let iscash: boolean = code.toLowerCase() === "cash";

	let _totalpay: number = 0, _totalamt: number = 0;
	if (!forsimplesales) {
		_totalpay = getTotalPayments();
		_totalamt = getTotalAmt4Order();
	}

	if (forsales || forsimplesales) {
		console.log("totalamt:", _totalamt);
		console.log("totalpay:", _totalpay);
		_setRemain(amt, _totalamt, _totalpay, iscash, type, $e);
	} else {
		_setRemain(amt, itotalremainamt, _totalpay, iscash, type, $e);
	}
}

function _setRemain(
	amt: number,
	_totalamt: number,
	_totalpay: number,
	iscash: boolean,
	type: string,
	$e: JQuery
) {
	if (_totalpay > _totalamt) {
		if (!iscash && !CouponInUse) {
			$.fancyConfirm({
				title: "",
				message: noncashgtremainamterrmsg,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						amt -= _totalpay - _totalamt;
						$("#" + type)
							.val(amt.toFixed(2))
							.trigger("focus");
					}
				},
			});
		}
		else {
			let _remain = _totalamt - _totalpay;
			_setremain(_remain, amt);

		}
	} else {
		let _remain = _totalamt - _totalpay;
		_setremain(_remain, amt);
	}
}

function _setremain(_remain: number, _amt: number) {
	if (forsimplesales) {
		let totalpay = 0;
		$(".paymenttype").each(function (i, e) {
			totalpay += Number($(e).val());
		});
		console.log("totalpay:", totalpay);
		_remain = Sales.rtsFinalTotal! - totalpay;
		console.log("_remain:" + _remain);
	} else {
		if (chkIdx >= 0) {
			$tr = $("#tblPay tbody tr").eq(chkIdx);
			if ($tr != null) {
				if (chkchange && !paymenttypechange) {
					if (_amt < 0) {
						$tr.find(".paymenttype").val(formatnumber(0)).trigger("change");
					} else {
						$tr.find(".paymenttype").val(_amt.toFixed(2)).trigger("change");
					}
				}

				if (_amt == _remain) {
					_remain = 0;
				} else if (_amt < 0) {
					_remain += -1 * _amt;
				}

				$("#remainamt").text(formatmoney(_remain));
				if (_remain <= 0) {
					$("#remainblk").removeClass("alert-danger").addClass("alert-success");
					if (_remain < 0) {
						$("#remaintxt").text(saleschangetxt);
						_remain *= -1;
						//console.log('_remain:' + _remain);
						$("#remainamt").text(formatmoney(_remain));
					}
				} else {
					$("#remaintxt").text(remaintxt);
					$("#remainblk").removeClass("alert-success").addClass("alert-danger");
				}
				return;
			}
		}
		if (_remain > 0) {
			$("#remainblk").removeClass("alert-success").addClass("alert-danger");
		} else if (_remain <= 0) {
			if (forsimplesales) {

			}
			$("#remainblk").removeClass("alert-danger").addClass("alert-success");
		}
		//console.log('iremain:' + iremain);
		if (_remain < 0) {
			_remain *= -1;
			$("#remaintxt").text(saleschangetxt);
		}
	}

	$("#remainamt").text(formatmoney(_remain));

	//console.log("remainlt0:", _remain <= 0);
	if (forsimplesales) setRemainDisplay(_remain <= 0);
}
function setRemainDisplay(remainLt0: boolean) {
	//console.log("remainLt0#display:", remainLt0);
	if (remainLt0) {
		$("#remainblk").removeClass("bg-danger").addClass("bg-success");
	} else {
		$("#remainblk").removeClass("bg-success").addClass("bg-danger");
	}
}
function resetPay(partial: boolean = false) {

	payModal.dialog("close");

	if (!partial) {
		Payments = [];
		itotalpay = 0;
		iremain = 0;
		switch (salesType) {
			case SalesType.preorder:
				break;
			case SalesType.refund:
				Refund.MonthlyPay = 0;
				Refund.rtpChange = 0;
				Refund.Deposit = 0;
				Refund.rtpRoundings = 0;
				break;
			default:
			case SalesType.deposit:
			case SalesType.retail:
				Sales.MonthlyPay = 0;
				Sales.rtpChange = 0;
				Sales.Deposit = 0;
				Sales.rtpRoundings = 0;
				break;
		}
	}

	$("#txtPayerCode").val("");
	$(".paymenttype").val(0);
	let $txtRoundings: JQuery = $("#txtRoundings");
	if ($txtRoundings.length) {
		$txtRoundings.val(0);
	}

	//reset the idxs:
	chkIdx = -1;
	activeChkIdx = -1;
	activePayIdx = -1;

	//reset coupon
	CouponInUse = false;
	//reset paymenttypechange & chkchange
	paymenttypechange = false;
	chkchange = false;

	let $monthlypay: JQuery = $("#monthlypay");
	if ($monthlypay.length) {
		$monthlypay.prop("checked", false);
	}
	let $deposit: JQuery = $("#deposit");
	if ($deposit.length) {
		$deposit.prop("checked", false);
	}
}

function GetPaymentsInfo() {
	let _couponamt: number = 0;
	let _totalpay: number = 0;

	if (forsimplesales) {
		$(".paymenttype").each(function (i, e) {
			if ($(e).parent(".single__add").hasClass("activee")) {
				getPaymentInfo($(e).attr("id") as string, Number($(e).val()));
			}

		});
	} else {
		$("#tblPay tbody tr").each(function (i, e) {
			let $chk = $(e).find(".chkpayment");
			if ($chk.is(":checked")) {
				let $pay = $(e).find(".paymenttype");
				let payamt = isEpay ? Number($pay.data("amt")) : Number($pay.val());
				getPaymentInfo($chk.data("type") as string, payamt);
			}

		});
	}
	function getPaymentInfo(typecode: string, amt: number) {
		if (isEpay) {
			if (typecode.toLowerCase() == "wechat" || typecode.toLowerCase() == "alipay") {//to nothing
				console.log("do nothing");
				console.log("amt#e:" + amt);
			}
			else amt = 0;
		}
		//console.log("amt#1:", amt);
		let paytype: IPayType = {
			payId: 0,
			pmtCode: typecode,
			Amount: amt,
			pmtIsCash: typecode.toLowerCase() == "cash",
			couponLnCode: $.isEmptyObject(CouponLn) ? null : CouponLn.cplCode,
			TotalAmt: 0,
		};

		Payments.push(paytype);
		if (typecode.toLowerCase() === "coupon") {
			_couponamt += amt;
		}
		_totalpay += amt;
	}

	return { couponamt: _couponamt, totalpay: _totalpay };
};

$(document).on("change", ".pay", function () {
	currentY = $(this).parent("td").parent("tr").index();
	let $amt = $(this);
	let amt: number = Number($amt.val());
	//let Id: number = Number($amt.data("id"));
	let amterrtxt = $infoblk.data("amterrtxt");
	let amtcls: string = "text-danger";
	//let accountno: string = "";
	//console.log("amt:" + amt);

	if (forpurchase) {
		if (amt > 0) {

			if (amt > Purchase.pstAmount) {
				amtErrWarning();
				return;
			}

			let totalamt: number = 0;
			$(`#${gTblId} tbody tr`).each(function (i, e) {
				$amt = $(e).find("td").eq(4).find(".pay");
				let amt: number = Number($amt.val());
				totalamt += amt;
				$amt.val(formatnumber(amt));
				//$(e).find("td").last().find(".owed").val(Number(Purchase.pstAmount - amt));
			});
			//console.log("totalamt:", totalamt);
			if (totalamt > Purchase.pstAmount) {
				amtErrWarning();
				return;
			}

			purchasePayment.Amount = amt;
			//console.log("Purchase.pstAmount:" + Purchase.pstAmount + ";totalamt:" + totalamt);
			let totalowed: number = Purchase.pstAmount - totalamt;
			//console.log("totalowed:", totalowed);
			if (totalowed <= 0) amtcls = "text-success";
			$("#totalowed").removeClass("text-danger").addClass(amtcls).text(formatnumber(totalowed));
		}
	}
	function amtErrWarning() {
		$.fancyConfirm({
			title: "",
			message: amterrtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$amt.trigger("focus");
				}
			}
		});
	}
});

$(document).on("change", ".chkpayment", function () {
	let checked = $(this).is(":checked");
	$tr = $(this).parent("div").parent("td").parent("tr");
	//console.log("$tr:", $tr);
	chkIdx = $tr.index();

	let type = $(this).data("type") as string;
	DicPayTypesChecked[type.toLowerCase()] = checked;
	DicPayServiceCharge[type].Selected = checked;

	CouponInUse = DicPayTypesChecked["coupon"];
	//console.log("isCoupon:", isCoupon);

	$tr.find(".paymenttype").prop("readonly", !checked);

	if (type.toLowerCase() == "visa" || type.toLowerCase() == "mastercard") {
		if (checked) {
			GetServiceChargeAmt(Sales.rtsFinalTotal!);
			Sales.rtsFinalTotal! += ServiceChargeAmt;
		} else {
			Sales.rtsFinalTotal! -= ServiceChargeAmt;
		}
	}

	if (!checked) $tr.find(".paymenttype").val("0.00");


	setAmtDisplay(Sales!.rtsFinalTotal ?? 0, 0);

	if (CouponInUse && $.isEmptyObject(CouponLn)) {
		openBarCodeModal();
		/*for debug only*/
		if (debug) {
			barcodeModal.find("#txtBarCode").val("FYGoQQ0cg3");
		}
	}

	if ($(".chkpayment:checked").length == 0) {
		DicPayTypesChecked["cash"] = true;
		$(".chkpayment").first().prop("checked", true);
		initCashTxt(Sales!.rtsFinalTotal);
	}
});

$(document).on("change", ".paymenttype", function () {
	if (fordayends) return false;

	let payamt: number = Number($(this).val());
	console.log("payamt:", payamt);
	if (payamt == 0) {
		$(this).val(formatnumber(0));
		if (Sales.Deposit == 0) {
			setRemain($(this), 0);
		}
	}
	if (payamt > 0) {
		if (forsimplesales) populateOrderSummary();
		$(this).val(formatnumber(payamt));
		if (payamt >= 0) {
			/*couponamt = payamt;*/
			if ((Sales && Sales.Deposit == 0) || (PreSales && PreSales.rtsStatus == SalesStatus.presettling)) {
				setRemain($(this), payamt);
			}
		}
	}

});

function confirmPay() {
	//console.log("here");
	let _totalpay: number = 0;
	let _totalamt: number = 0;
	switch (salesType) {
		case SalesType.simplesales:
			//for debug only:
			_totalamt = Sales.rtsFinalTotal!;
			//_totalamt = Number($(".totalamt").first().text());
			break;
		case SalesType.deposit:
			_totalamt = itotalremainamt;
			break;
		case SalesType.refund:
			RefundList.forEach((x) => (_totalamt += x.amt));
			if (isEpay) submitRefund();
			break;
		default:
		case SalesType.retail:
		case SalesType.preorder:
			_totalamt = getTotalAmt4Order();
			//console.log("_totalamt:" + _totalamt);
			break;
	}

	let paymentsInfo = GetPaymentsInfo();
	//console.log("paymentsInfo:", paymentsInfo);
	let _couponamt: number = paymentsInfo.couponamt;
	_totalpay = paymentsInfo.totalpay;

	_totalpay = round(_totalpay, 2);
	_totalamt = round(_totalamt, 2);

	//console.log('totalpay:' + _totalpay + ';totalamt:' + _totalamt);
	if (isNaN(_totalpay)) {
		falert(paymentrequiredtxt, oktxt);
	} else if (_totalpay < _totalamt) {
		switch (salesType) {
			case SalesType.simplesales:
				falert(paymentnotenough, oktxt);
				_totalpay = 0;
				break;
			case SalesType.deposit:
				break;
			case SalesType.refund:
				break;
			case SalesType.preorder:
				//console.log("here");
				submitSales();
				break;
			default:
			case SalesType.retail:
				if (Sales.Deposit == 1) {
					submitSales();
				} else {
					falert(paymentnotenough, oktxt);
					_totalpay = 0;
				}
				break;
		}
	} else if (_totalpay > _totalamt) {
		if (Sales.Deposit == 1) {
			$.fancyConfirm({
				title: "",
				message: depositmustnotgteqamtmsg,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						$("#Cash").trigger("focus");
					}
				},
			});
		} else {
			//console.log("usecoupon:" + usecoupon + ";_couponamt:" + _couponamt);
			if (!CouponInUse) {
				Sales.rtpChange = _totalpay - _totalamt;
				//console.log('ichange:' + ichange + ';ready to open changemodal...');
				openChangeModal();
			} else {
				if (_couponamt < _totalamt) {
					Sales.rtpChange = _totalpay - _totalamt;
					//console.log('ichange:' + ichange + ';ready to open changemodal...');
					openChangeModal();
				}
				if (_couponamt >= _totalamt) {
					resetPay(true);
					if (forsales || forReservePaidOut)
						submitSales();
					if (forsimplesales) SubmitSimpleSales();
					//        break;
					//}
				}
			}
		}
	} else if (_totalpay == _totalamt) {
		switch (salesType) {
			case SalesType.simplesales:
				SubmitSimpleSales();
				break;
			case SalesType.deposit:
				submitRemaining();
				break;
			case SalesType.refund:
				submitRefund();
				break;
			case SalesType.simplesales:
				SubmitSimpleSales();
				break;
			default:
			case SalesType.preorder:
			case SalesType.retail:
				console.log("ready for submitsales");
				submitSales();
				break;
		}
	}
	//}

}

function closeChangeModal() {
	changeModal.dialog("close");
	resetPay(true);
	switch (salesType) {
		case SalesType.deposit:
			submitRemaining();
			break;
		case SalesType.refund:
		default:
		case SalesType.retail:
			submitSales();
			break;
	}
}

function resetPayModal() {
	$("#tblPay tbody tr").each(function (i, e) {
		$(e).find("td").first().find(".chkpayment").prop("checked", false);
	});
}
function openPayModal(totalamt: number = 0) {
	resetPayModal();
	payModal.dialog("option", { width: 600, title: processpayments });
	payModal.dialog("open");

	if (forpreorder) {
		let $deposit: JQuery = $("#deposit");
		$deposit.prop("checked", true);
	}

	setExRateDropDown();

	if (totalamt === 0)
		totalamt = getTotalAmt4Order();

	if (forsales) Sales.rtsFinalTotal = totalamt;

	setForexPayment(totalamt);

	setAmtDisplay(totalamt);

	initCashTxt(totalamt);

	setServiceChargeAmt(totalamt);
}

function setServiceChargeAmt(totalamt: number) {
	$("#tblPay tbody tr").each(function (i, e) {
		let $td = $(e).find(".scpc");
		if ($td.length) {
			let scpc = Number($td.find("input").data("scpc"));
			let scamt = calculateServiceChargeAmt(totalamt, scpc);
			$td.find("input").data("amt", scamt).val(formatnumber(scamt));
		}
	});
}
function setAmtDisplay(totalamt: number, remainamt: number = 0) {
	$("#salesamount").data("amt", totalamt).text(formatmoney(totalamt));
	$("#remainamt").text(formatmoney(remainamt));
}
function initCashTxt(totalamt: number | null) {
	let cashtxt = "";
	if (!totalamt) {
		totalamt = getTotalAmt4Order();
	}
	cashtxt = totalamt.toFixed(2);
	$("#Cash").val(cashtxt);

	DicPayTypesChecked["cash"] = true;
	if (forsales)
		$("#tblPay tbody tr").first().find(".chkpayment").prop("checked", true);

	if (forsimplesales) {
		togglePlusCheck("btnCash");
		togglePayment("cash", true);
	}
}
function togglePayModeTxt() {
	//console.log("check length:", $(".checks:visible").length);
	if ($(".checks:visible").length > 1) {
		$("#singlePayMode").hide();
		$("#multiplePayMode").show();
	} else {
		$("#singlePayMode").show();
		$("#multiplePayMode").hide();
	}
}

function togglePlusCheck(Id: string): boolean {
	$(`#${Id}`).toggleClass("toggle").find(".pluse").toggle();
	let $return = $(`#${Id}`).find(".checks").toggle();
	return $return.is(":visible");
}
function setForexPayment(totalamt: number | null) {
	if (!totalamt) totalamt = getTotalAmt4Order();
	$("#forexPayment").html(formatnumber(totalamt));
}

function closePayModal() {
	payModal.dialog("close");
}

function openCashDrawerModal() {
	cashdrawerModal.dialog("option", { width: 600, title: cashdraweramt });
	cashdrawerModal.dialog("open");
	//disable navlink:
	disableNavLink();

	//ui-dialog-titlebar-close
	$(
		".ui-button.ui-corner-all.ui-widget.ui-button-icon-only.ui-dialog-titlebar-close"
	).hide();
	$("#txtCashDrawerAmt").trigger("focus");
}
function closeCashDrawerModal() {
	if (checkedcashdrawer) {
		cashdrawerModal.dialog("close");
		restoreNavLink();
	} else {
		falert(cashdraweramtprompt, oktxt);
		$("#txtCashDrawerAmt").trigger("focus");
	}
}

function closePrintModal() {
	printModal.dialog("close");
	window.location.href = "/POSFunc/Sales";
}

function closeSerialModal() {
	serialModal.dialog("close");
	resetSerialModal();
}

function openWaitingModal() {
	waitingModal.dialog("open");
}
function closeWaitingModal() {
	waitingModal.dialog("close");
}

function openPreviewModal() {
	previewModal.dialog("open");
}
function closePreviewModal() {
	previewModal.dialog("close");
}

function openActionModal() {
	actionModal.dialog("open");
}
function closeActionModal() {
	actionModal.dialog("close");
}

function openAccountModal() {
	accountModal.dialog("open");
	$("txtKeyword").val("").trigger("focus");
}
function closeAccountModal() {
	accountModal.dialog("close");
}

function validateDropDown(): boolean {
	let $ele: JQuery = $(".select2multiple");
	let none: boolean = $ele.find("option:selected").length === 0;
	let msg = "";
	if (none) {
		msg = selectatleastoneitemtxt;
		$.fancyConfirm({
			title: "",
			message: msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$ele.trigger("focus");
				}
			},
		});
	}

	return msg === "";
}

function openSalesmenModal() {
	salesmenModal.dialog("open");
}
function closeSalesmenModal() {
	salesmenModal.dialog("close");
}

function resetGcomboForm() {
	$target = gcomboModal.find("form");
	$target.empty();
	let ele = `<div class="form-group">
                <input type="text" class="form-control gcombo">
            </div>`;
	$target.html(ele);
}

function openGComboModal() {
	gcomboModal.dialog("open");
	//console.log('gattr#open:', gAttribute);
	/* console.log('attrval:'+ gAttribute.attrValue);*/
	if (gAttribute.attrValue !== "") {
		$target = gcomboModal.find("form");
		$target.empty();
		//console.log("gval:" + gAttribute.attrValue);
		let _vals = gAttribute.attrValue.split("||");
		//console.log('_vals#open:', _vals);
		let html = "";
		$.each(_vals, function (i, e) {
			if (e !== null && e !== "") {
				html += `<div class="form-group">
                <input type="text" class="form-control gcombo" value="${e}">
            </div>`;
			}
		});
		$target.html(html);
	} else {
		resetGcomboForm();
	}

	$("form").find(".form-control:eq(0)").trigger("focus");
}
function closeGComboModal() {
	gcomboModal.dialog("close");
}

function openDocModal() {
	docModal.dialog("open");
}
function closeDocModal() {
	docModal.dialog("close");
}

function openHotListModal() {
	hotlistModal.dialog("open");
}
function closeHotListModal() {
	hotlistModal.dialog("close");
}


function openTestEblastModal() {
	testEblastModal.dialog("open");
}
function closeTestEblastModal() {
	testEblastModal.dialog("close");
}

function openActionLogValModal() {
	actionLogValModal.dialog("open");
}
function closeActionLogValModal() {
	actionLogValModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}


function openGattrFilterModal() {
	gAttrFilterModal.dialog("open");
}
function closeGattrFilterModal() {
	gAttrFilterModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}

function openCustomAttributeModal() {
	customAttributeModal.dialog("open");
	$("#attrName").trigger("focus");
	selectedAttribute = fillAttribute($infoblk);
	console.log("selectedattribute:", selectedAttribute);
}
function closeCustomAttributeModal() {
	customAttributeModal.dialog("close");
}
$(document).on("click", "#btnSaveCustomAttr", function () {
	selectedAttribute.attrType = "text";
	saveAttributeVals(editmode);
});

$(document).on("change", "#attrValue", function () {
	selectedAttribute.attrValue = <string>$(this).val();
});

$(document).on("change", "#attrName", function () {
	selectedAttribute.attrName = <string>$(this).val();
});

function openAssignedContactModal() {
	assignedContactModal.dialog("open");
}
function closeAssignedContactModal() {
	assignedContactModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}


function openAssignedEnquiryModal() {
	assignedEnquiryModal.dialog("open");
}
function closeAssignedEnquiryModal() {
	assignedEnquiryModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}

function initSalesGroup(): ISalesGroup {
	return {
		Id: 0,
		sgName: "",
		sgDesc: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		UserName: "",
	};
}

function openSalesGroupMemberModal() {
	salesgroupMemberModal.dialog("open");
}
function closeSalesGroupMemberModal() {
	salesgroupMemberModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}

function openGroupSalesmenModal() {
	groupSalesmenModal.dialog("open");
}
function closeGroupSalesmenModal() {
	groupSalesmenModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}
function openTextAreaModal(title: string = "") {
	let $txtfield = textareaModal.find("#txtField");
	$txtfield.val("");

	textareaModal.dialog("open");
	if (stockTransferEditMode) {
		textareaModal.dialog({ title: remarktxt });
	} else {
		textareaModal.dialog({ title: title });
	}
	if (forjournal && selectedJournalLn1) {
		$txtfield.val(selectedJournalLn1.AllocationMemo);
	}
	if (forIA && IALs.length > 0) {
		let idx = IALs.findIndex((x) => { return x.Seq == (currentY + 1); });
		if (IALs[idx]) $txtfield.val(IALs[idx].Memo);
	}
}
function closeTextAreaModal() {
	textareaModal.dialog("close");
}

function openSalesGroupModal() {
	salesgroupModal.dialog("open");
}
function closeSalesGroupModal() {
	salesgroupModal.dialog("close");
}
function openLogoModal() {
	logoModal.dialog("open");
}
function closeLogoModal() {
	logoModal.dialog("close");
}
function openTaxTypeModal() {
	taxTypeModal.dialog("open");
}
function closeTaxTypeModal() {
	taxTypeModal.dialog("close");
}

function openCurrencyModal() {
	currencyModal.dialog("open");
}
function closeCurrencyModal() {
	currencyModal.dialog("close");
}
function openPurchaseCodeModal() {
	//purchaseCodeModal.find('#tblCode tbody tr').removeClass('selectedtr');
	purchaseCodeModal.dialog("open");
}
function closePurchaseCodeModal() {
	purchaseCodeModal.dialog("close");
}

function closeDescModal() {
	descModal.dialog("close");
}
function openDescModal(params: any = null, _title: string = description, _width: number = 400) {
	descModal.dialog("option", { width: _width, title: _title });
	descModal.dialog("open");

	if (forcustomer) {
		$("#descModal")
			.empty()
			.append(
				params
			);
	}

	if (forsales && selectedSalesLn) {
		$("#descModal")
			.empty()
			.append(
				"<p style='font-size:larger;'>" + selectedSalesLn!.Item.itmDesc + "</p>"
			);
	}
	if (forrefund && refundsalesln) {
		$("#descModal")
			.empty()
			.append("<p style='font-size:larger;'>" + refundsalesln.rtlDesc + "</p>");
	}
	if (forpurchase && SelectedPurchaseItem) {
		$("#descModal")
			.empty()
			.append(
				"<p style='font-size:larger;'>" + SelectedPurchaseItem!.itmDesc + "</p>"
			);
	}

	if (forwholesales && selectedWholesalesLn) {
		$("#descModal")
			.empty()
			.append(
				"<p style='font-size:larger;'>" + selectedWholesalesLn.wslDesc + "</p>"
			);
	}

	if (forItem || forstock || fortransfer) {
		$("#descModal")
			.empty()
			.append(
				"<p style='font-size:larger;'>" + selectedItem?.NameDesc + "</p>"
			);
	}
}

function openItemBuySellUnitsModal() {
	itemBuySellUnitsModal.dialog("open");
}
function closeItemBuySellUnitsModal() {
	itemBuySellUnitsModal.dialog("close");
}

function openValidthruModal(hasFocusCls: boolean) {
	validthruModal.dialog("open");
	$target = $(".ui-dialog-buttonpane .ui-dialog-buttonset");
	if (hasFocusCls) {
		$target.find(".savebtn").show();
		$target
			.find(".secondarybtn")
			.text(canceltxt)
			.on("click", handleValidthruModalCancel);
	} else {
		$target.find(".savebtn").hide();
		$target
			.find(".secondarybtn")
			.text(closetxt)
			.on("click", closeValidthruModal);
	}
}
function closeValidthruModal() {
	validthruModal.dialog("close");
}

function openPurchaseBatchModal(
	addrow: boolean = false,
	readonly: boolean = false
) {
	//console.log("addrow:", addrow);
	//console.log("readonly:",true);
	purchaseBatchModal.find("#batchLocSeqItem").text(selectedItemCode);
	purchaseBatchModal.dialog("open");
	if (addrow) addPoBatRow(false);
	//console.log("here#openpb");
	purchaseBatchModal
		.find("#tblPbatch tbody tr")
		.find("td")
		.find("input")
		.prop("readonly", readonly);
	if (readonly) {
		$(".savebtn").hide();
		$(".batminus").addClass("disabled");
	}
}
function closePurchaseBatchModal() {
	purchaseBatchModal.dialog("close");
}

function openPurchaseSerialModal(
	addrow: boolean = false,
	readonly: boolean = false
) {
	purchaseSerialModal.find("#serialLocItem").text(selectedItemCode);
	purchaseSerialModal.dialog("open");
	if (addrow) addPoSnRow();
	purchaseSerialModal
		.find("#tblPserial tbody tr")
		.find("td")
		.find("input")
		.prop("readonly", readonly);
	if (readonly) {
		$(".savebtn").hide();
		$(".snminus").addClass("disabled");
	}
}
function closePurchaseSerialModal() {
	purchaseSerialModal.dialog("close");
}

function openCustomerTermsModal() {
	customerTermsModal.dialog("open");
}
function closeCustomerTermsModal() {
	customerTermsModal.dialog("close");
}

function openCustomerFollowUpModal() {
	customerFollowUpModal.dialog("open");
}
function closeCustomerFollowUpModal() {
	customerFollowUpModal.dialog("close");
}

function openItemAttrModal() {
	itemAttrModal.dialog("open");
}
function closeItemAttrModal() {
	itemAttrModal.dialog("close");
	SaveItemAttr();
}
function openDateTimeModal() {
	dateTimeModal.dialog("open");
	$(".ui-dialog-buttonpane .ui-dialog-buttonset")
		.find("button")
		.first()
		.trigger("focus");
}
function closeDateTimeModal() {
	dateTimeModal.dialog("close");
}

function openConvertDateModal() {
	convertDateModal.dialog("open");
}
function closeConvertDateModal() {
	convertDateModal.dialog("close");
}
function openRecurOrderModal() {
	recurOrderModal.dialog("open");
	if (recurOrder!.Mode === "save" || recurOrder!.Mode === "savefrmposted") {
		recurOrderModal.find("#recurnameblk").removeClass("hide");
		recurOrderModal.find("#recurlistblk").addClass("hide");
		recurOrderModal
			.find("#txtRecurName")
			.val(`${formatDate()}${selectedCus.cusName}`)
			.trigger("focus");
		$("#btnMain").button("option", "label", savetxt);
	}
	if (recurOrder!.Mode === "list") {
		recurOrderModal.dialog("option", "width", 800);
		recurOrderModal.find("#recurnameblk").addClass("hide");
		recurOrderModal.find("#recurlistblk").removeClass("hide");
		recurOrderModal.find("#txtRecurKeyword").trigger("focus");
		$("#btnMain").button("option", "label", closetxt);
	}
}
function closeRecurOrderModal() {
	recurOrderModal.dialog("close");
}
function openWhatsappLinkModal() {
	whatsappLinkModal.dialog("open");
}
function closeWhatsappLinkModal() {
	whatsappLinkModal.dialog("close");
	if (forcustomer) window.location.href = "/Customer/Index";
	else window.location.reload();
}

function openUploadFileModal() {
	$("#uploadmsg").hide();
	uploadFileModal.dialog("open");
}
function closeUploadFileModal() {
	uploadFileModal.dialog("close");
}

function openViewFileModal() {
	if (forpurchasepayments) {
		populateFileList4PurchasePayments(UploadedFileList);
	} else {
		//console.log("UploadedFileList#open:", UploadedFileList);
		populateFileList(UploadedFileList);
	}
	viewFileModal.dialog("open");
}
function closeViewFileModal() {
	viewFileModal.dialog("close");
}

function openDropDownModal(ele: any = null) {
	dropdownModal.dialog("open");
	if (forcustomer) {
		if (forhotlist) {
			dropdownModal.find(".form-group").first().find("label").text(hotlisttxt);
		}
		if (foreblast) {
			dropdownModal.find(".form-group").first().find("label").text(eblasttxt);
		}
		if (forassignsalesmen) {
			setUpChkEmailNotification();
		}
	}
	if (forenquiry) {
		if (forassignsalesmen) {
			setUpChkEmailNotification();
		}
	}


	if (ele) {
		let _attrname: string = $(ele).data("attrname");
		dropdownModal.find("label").text(_attrname);
		let options: string = "";
		let $dropdown: JQuery = dropdownModal.find("select");
		$dropdown.data("attrname", _attrname);
		$dropdown.attr("Id", _attrname);
		let _items: string[] = $(ele).data("attrvalue").split("||");
		$.each(_items, function (i, e) {
			options += `<option value="${e}">${e}</option>`;
		});
		$dropdown.empty().append(options);
	}

	function setUpChkEmailNotification() {
		dropdownModal.find(".form-group").first().find("label").text(salesmentxt);

		if (!dropdownModal.find("#chkEmailNotification").length) {
			let html = `<div class="form-check small">
			<input type="checkbox" class="form-check-input" id="chkEmailNotification" checked />
			<label class="form-check-label" for="chkEmailNotification">${emailnotificationtosalesmentxt}</label>
		</div>`;
			dropdownModal.append(html);
		}
	}
}
function closeDropDownModal() {
	dropdownModal.dialog("close");
}

function openCurrencySettingModal() {
	currencySettingModal.dialog("open");
}
function closeCurrencySettingModal() {
	currencySettingModal.dialog("close");
}

function openAdvancedSearchModal() {
	advancedSearchModal.dialog("open");
	$(".attrval").first().trigger("focus");
}
function closeAdvancedSearchModal() {
	advancedSearchModal.dialog("close");
}

function openContactModal() {
	contactModal.dialog("open");
}
function closeContactModal() {
	contactModal.dialog("close");
}

function openBatchModal(hasFocusCls: boolean) {
	//console.log("hasfocuscls:", hasFocusCls);
	batchModal.dialog("open");
	$target = $(".ui-dialog-buttonpane .ui-dialog-buttonset");
	if (hasFocusCls) {
		$target.find(".savebtn").show();
		$target
			.find(".secondarybtn")
			.text(canceltxt)
			.on("click", handleBatchModalCancel);
	} else {
		$target.find(".savebtn").hide();
		$target.find(".secondarybtn").text(closetxt).on("click", closeBatchModal);
	}
}
function closeBatchModal() {
	batchModal.dialog("close");
	chkbatsnvtchange = false;
	batdelqtychange = false;
}

function openTransferModal(hasFocusCls: boolean = false) {
	//console.log("hasfocuscls:", hasFocusCls);
	transferModal.dialog("open");
	$target = $(".ui-dialog-buttonpane .ui-dialog-buttonset");
	if (hasFocusCls) {
		$target.find(".savebtn").show();
		$target
			.find(".secondarybtn")
			.text(canceltxt)
			.on("click", handleTransferModalCancel);
	} else {
		$target.find(".savebtn").hide();
		$target
			.find(".secondarybtn")
			.text(closetxt)
			.on("click", closeTransferModal);
	}
}
function closeTransferModal() {
	transferModal.dialog("close");
	chkbatsnvtchange = false;
	batdelqtychange = false;
}

//for those items without batch
$(document).on("change", ".chkvari", function () {
	const maxqty = Number($(this).data("maxqty"));
	//const ischecked = $(this).is(":checked");
	$target = itemVariModal.find(".chkvari");
	let chklength = 0;
	$target.each(function (i, e) {
		if ($(e).is(":checked")) chklength++;
	});
	$target.prop("disabled", chklength == maxqty);
	//if (ischecked) {
	//    if (chklength == maxqty) {
	//        $target.prop("disabled", true);
	//    }
	//} else {
	//    if (chklength < maxqty) {
	//        $target.prop("disabled", false);
	//    }
	//}
});
//for those items without batch

function addPoItemVariRow(hasFocusCls: boolean) {
	//console.log("hasfocuscls:", hasFocusCls);

	if (!$.isEmptyObject(DicItemGroupedVariations)) {
		var itemcode = selectedItemCode;
		var purchaseItem = Purchase.PurchaseItems.find((x) => x.piSeq == seq);

		//console.log("purchaseItem:", purchaseItem);
		//console.log("purchaseItem.poItemVariList:", purchaseItem!.poItemVariList);

		let batcode: string = $(`#${gTblId} tbody tr`)
			.eq(currentY)
			.find(".pobatch")
			.data("batcode");
		//console.log("batcode:" + batcode);
		//console.log("undefined:", batcode === "undefined");
		let disabled = hasFocusCls ? "" : "disabled";

		let html = "";
		for (const [key, value] of Object.entries(DicItemGroupedVariations)) {
			if (itemcode.toString() === key.toString()) {
				for (const [k, v] of Object.entries(value)) {
					//console.log("v:", v);

					html += `<div class="form-group">`;
					let itemvar: IItemVariation = v[0];
					//console.log("itemvar:", itemvar);

					html += `<label class="my-auto">${itemvar.iaName}</label><select class="drpItemAttr form-control" data-name=${itemvar.iaName} ${disabled}>`;
					$.each(v, function (i, e: IItemVariation) {
						//console.log("here");
						let found: boolean = false;
						if (purchaseItem && purchaseItem.poItemVariList.length > 0) {
							//console.log("hasFocusCls:",hasFocusCls);
							if (hasFocusCls) {
								found = purchaseItem.poItemVariList.some((x) => {
									return x.JsIvIdList && x.JsIvIdList.includes(e.Id);
								});
							} else {
								//console.log("here");
								//console.log("batcode:", batcode);
								//console.log("!undefined?", batcode !== "undefined");
								if (batcode) {
									//console.log("x");
									found = purchaseItem.poItemVariList.some((x) => {
										return (
											x.batCode == batcode &&
											x.ivStockInCode == Purchase.pstCode
										);
									});
								} else {
									console.log("here");
									found = purchaseItem.poItemVariList.some((x) => {
										return x.ivIdList?.split(",").includes(e.Id.toString());
									});
									//console.log("found:", found);
								}
							}
						}
						let selected: string = found ? "selected" : "";
						html += `<option value="${e.Id}" ${selected}>${e.iaValue}</option>`;
					});
					html += `</select>`;
					html += `</div>`;
				}
			}
		}

		poItemVariModal.find(".container").empty().append(html);
	}
}
function openPoItemVariModal(hasFocusCls: boolean = false) {
	//console.log("itemOptions:", itemOptions);
	if (
		!itemOptions?.ChkBatch &&
		!itemOptions?.ChkSN &&
		!itemOptions?.WillExpire
	) {
		poItemVariModal.find(".form-group").first().hide();
	} else {
		$.each(SelectedPurchaseItem!.batchList, function (i, item) {
			// const selected = selectedPurchaseItem!.ivBatCode === item.batCode;
			const selected = true;
			poItemVariModal
				.find("#batcode")
				.empty()
				.append(
					$("<option>", {
						value: item.batCode,
						text: item.batCode,
						selected: selected,
					})
				);
		});
		poItemVariModal.find("#batcode").prop("disabled", true);
	}

	//console.log("hasFocusCls:", hasFocusCls);
	addPoItemVariRow(hasFocusCls);

	poItemVariModal.dialog("open");
	$target = $(".ui-dialog-buttonpane .ui-dialog-buttonset");
	if (hasFocusCls) {
		$target.find(".savebtn").show();
		$target
			.find(".secondarybtn")
			.text(canceltxt)
			.on("click", handlePoItemVariModalCancel);
	} else {
		$target.find(".savebtn").hide();
		$target
			.find(".secondarybtn")
			.text(closetxt)
			.on("click", closePoItemVariModal);
	}
}
function closePoItemVariModal() {
	poItemVariModal.dialog("close");
}

function openItemVariModal(hasFocusCls: boolean = false) {
	//console.log("hasfocuscls:", hasFocusCls);
	itemVariModal.dialog("open");
	$target = $(".ui-dialog-buttonpane .ui-dialog-buttonset");

	if (hasFocusCls) {
		$target.find(".savebtn").show();
		$target
			.find(".secondarybtn")
			.text(canceltxt)
			.on("click", handleItemVariModalCancel);
	} else {
		$target.find(".savebtn").hide();
		$target
			.find(".secondarybtn")
			.text(closetxt)
			.on("click", closeItemVariModal);
	}
}
function closeItemVariModal() {
	itemVariModal.dialog("close");
}

function openBarCodeModal() {
	barcodeModal.dialog("open");
}
function closeBarCodeModal() {
	barcodeModal.dialog("close");
}

function openVoidPaymentModal() {
	voidPaymentModal.dialog("open");
	voidPaymentModal.find("#txtUserName").trigger("focus");
}
function closeVoidPaymentModal() {
	voidPaymentModal.dialog("close");
	UserName = "";
	NamesMatch = false;
}

function resetPaymentTypeModal() {
	paymentTypeModal.find("#pmtName").val("");
	paymentTypeModal.find("#pmtSCR").val("");
}
function openPaymentTypeModal(charge: number = 0) {
	resetPaymentTypeModal();
	setInput4NumberOnly("paytype");
	if (charge) paymentTypeModal.find("#pmtSCR").val(charge);
	paymentTypeModal.dialog("open");
}
function closePaymentTypeModal() {
	paymentTypeModal.dialog("close");
}

function openReserveModal() {
	reserveModal.dialog("open");
}
function closeReserveModal() {
	reserveModal.dialog("close");
}

function resetEnquiryGroupModal() {
	enquiryGroupModal.find(".text-danger").text("");
	enquiryGroupModal.find("#txtRemark").val("");
	enquiryGroupModal.find("#txtGroupName").val("").trigger("focus");
}
function resetCustomerGroupModal() {
	customerGroupModal.find(".text-danger").text("");
	customerGroupModal.find("#txtRemark").val("");
	customerGroupModal.find("#txtGroupName").val("").trigger("focus");
}
function openCustomerGroupModal() {
	resetCustomerGroupModal();
	customerGroupModal.dialog("open");
	GetCustomerGroupList(1);
}
function closeCustomerGroupModal() {
	customerGroupModal.dialog("close");
}

function openEnquiryGroupModal() {
	resetEnquiryGroupModal();
	enquiryGroupModal.dialog("open");
	GetEnquiryGroupList(1);
}
function closeEnquiryGroupModal() {
	enquiryGroupModal.dialog("close");
}
function initModals() {
	if ($("#enquiryGroupModal").length) {
		enquiryGroupModal = $("#enquiryGroupModal").dialog({
			width: 960,
			title: enquirygrouptxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: savetxt,
					class: "savebtn",
					click: handleEnquiryGroupSaved,
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: closeEnquiryGroupModal
				},
			],
		});
	}
	if ($("#customerGroupModal").length) {
		customerGroupModal = $("#customerGroupModal").dialog({
			width: 960,
			title: customergrouptxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: savetxt,
					class: "savebtn",
					click: handleCustomerGroupSaved,
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: closeCustomerGroupModal
				},
			],
		});
	}

	if ($("#reserveModal").length) {
		reserveModal = $("#reserveModal").dialog({
			width: 600,
			title: reserveitemtxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: savetxt,
					class: "savebtn",
					click: handleReserveSaved,
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: closeReserveModal
				},
			],
		});
	}

	if ($("#paymentTypeModal").length) {
		paymentTypeModal = $("#paymentTypeModal").dialog({
			width: 600,
			title: paymenttypetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: savetxt,
					class: "savebtn",
					click: handlePaymentTypeSaved,
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: closePaymentTypeModal
				},
			],
		});
	}

	voidPaymentModal = $("#voidPaymentModal").dialog({
		width: 500,
		title: void4paymenttxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: savetxt,
				class: "savebtn",
				click: handleVoidPayment,
			},
			{
				class: "secondarybtn",
				text: canceltxt,
				click: closeVoidPaymentModal
			},
		],
	});

	if ($("#textareaModal").length) {
		textareaModal = $("#textareaModal").dialog({
			width: 700,
			title: "",
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: function () {
						closeTextAreaModal();
						var remark = <string>$("#textareaModal").find("#txtField").val();

						if (approvalmode && (forsales || forpreorder || forpurchase || forwholesales)) {
							//reject reason:
							rejectreason = remark;
							respondReview("reject");
						}
						if (stockTransferEditMode) {

							$target = $(`#${gTblId} tbody tr`)
								.eq(currentY)
								.find(".remark");
							$target.data("remark", remark);
							if (remark !== "") {
								$target.val("...");
							}
						}
						if (forjournal) {
							if (selectedJournalLn1) {
								if (remark !== "") {
									selectedJournalLn1.AllocationMemo = remark;
									$tr.find(".memo").data("remark", remark).val("...");
								}

							}
						}
						if (forIA) {
							if (remark !== "") {
								if (IALs.length > 0) {
									let idx = IALs.findIndex((x) => { return x.Seq == (currentY + 1); });
									//console.log("idx:" + idx);
									if (IALs[idx]) {
										IALs[idx].Memo = remark;
										//console.log("$tr:", $tr);
										$tr.find(".memo").data("remark", remark).val("...");
									}
								}
							}

						}
					},
				},
				{
					text: canceltxt,
					click: closeTextAreaModal,
				},
			],
		});
	}


	barcodeModal = $("#barcodeModal").dialog({
		width: 400,
		title: barcodetxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: confirmtxt,
				class: "savebtn",
				click: confirmBarCodeClose,
			},
			{
				text: canceltxt,
				class: "secondarybtn",
				click: closeBarCodeModal,
			},
		],
	});

	itemVariModal = $("#itemVariModal").dialog({
		width: 900,
		title: itemvariationtxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				class: "savebtn",
				text: oktxt,
				click: function () {
					confirmIvQty();
				},
			},
			{
				class: "secondarybtn",
				text: canceltxt,
				click: function () {
					handleItemVariModalCancel();
				},
			},
		],
	});

	poItemVariModal = $("#poItemVariModal").dialog({
		width: 400,
		title: itemvariationtxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				class: "savebtn",
				text: oktxt,
				click: function () {
					confirmPoItemVariQty();
				},
			},
			{
				class: "secondarybtn",
				text: canceltxt,
				click: function () {
					handlePoItemVariModalCancel();
				},
			},
		],
	});

	transferModal = $("#transferModal").dialog({
		width: 900,
		title: transfertxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				class: "savebtn",
				text: oktxt,
				click: function () {
					confirmTransferQty();
				},
			},
			{
				class: "secondarybtn",
				text: canceltxt,
				click: function () {
					handleTransferModalCancel();
				},
			},
		],
	});
	batchModal = $("#batchModal").dialog({
		width: 900,
		title: batchtxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				class: "savebtn",
				text: oktxt,
				click: function () {
					confirmBatchSnQty();
				},
			},
			{
				class: "secondarybtn",
				text: canceltxt,
				click: function () {
					handleBatchModalCancel();
				},
			},
		],
	});

	contactModal = $("#contactModal").dialog({
		width: 400,
		title: contacttxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: closetxt,
				class: "secondarybtn",
				click: closeContactModal,
			},
		],
	});

	advancedSearchModal = $("#advancedSearchModal").dialog({
		width: 800,
		title: advancedsearchtxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: oktxt,
				class: "savebtn",
				click: confirmAdvancedSearch,
			},
			{
				text: canceltxt,
				class: "secondarybtn",
				click: closeAdvancedSearchModal,
			},
		],
	});

	currencySettingModal = $("#currencySettingModal").dialog({
		width: 350,
		title: currency,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: closetxt,
				class: "secondarybtn",
				click: closeCurrencySettingModal,
			},
		],
	});

	viewFileModal = $(".viewFileModal").dialog({
		width: 650,
		title: viewfiletxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: closetxt,
				class: "secondarybtn",
				click: closeViewFileModal,
			},
		],
	});

	uploadFileModal = $("#uploadFileModal").dialog({
		width: 400,
		title: uploadfiletxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: closetxt,
				class: "secondarybtn",
				click: closeUploadFileModal,
			},
		],
	});

	whatsappLinkModal = $("#whatsappLinkModal").dialog({
		width: 400,
		title: whatsappapilinktxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: closetxt,
				class: "secondarybtn",
				click: function () {
					closeWhatsappLinkModal();
				},
			},
		],
	});

	recurOrderModal = $("#recurOrderModal").dialog({
		width: 400,
		title: recurringordertxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				id: "btnMain",
				text: recurOrder && recurOrder!.Mode == "list" ? closetxt : oktxt,
				class:
					recurOrder && recurOrder!.Mode == "list" ? "secondarybtn" : "savebtn",
				click: function () {
					closeRecurOrderModal();
					// console.log("recurOrder!.Mode:" + recurOrder!.Mode);
					// return false;
					if (recurOrder!.Mode === "list") {
						handleRecurOrderList();
					} else {
						recurOrder!.IsRecurring = 1;
						recurOrder!.Name = recurOrderModal.find("#txtRecurName").val();
						//console.log('recurorder:', recurOrder);
						//return false;
						if (recurOrder!.Mode === "save") {
							handleSubmit4Wholesales(true);
						}
						if (recurOrder!.Mode === "savefrmposted") {
							openWaitingModal();
							$.ajax({
								type: "POST",
								url: "/WholeSales/SaveRecurOrder",
								data: {
									__RequestVerificationToken: $(
										"input[name=__RequestVerificationToken]"
									).val(),
									RecurOrder: recurOrder,
								},
								success: function (data) {
									if (data) {
										closeWaitingModal();
										$.fancyConfirm({
											title: "",
											message: data,
											shownobtn: false,
											okButton: oktxt,
											noButton: notxt,
											callback: function (value) {
												if (value) {
													$("#txtKeyword").trigger("focus");
												}
											},
										});
									}
								},
								dataType: "json",
							});
						}
					}
				},
			},
			{
				text: canceltxt,
				click: closeRecurOrderModal,
			},
		],
	});

	convertDateModal = $("#convertDateModal").dialog({
		width: 400,
		title: convertdatetxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: oktxt,
				class: "savebtn",
				click: confirmConvertDate,
			},
			{
				text: canceltxt,
				click: closeConvertDateModal,
			},
		],
	});

	if ($("#dateTimeModal").length) {
		dateTimeModal = $("#dateTimeModal").dialog({
			width: 400,
			title: datetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: function () {
						confirmDateTime();
					},
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: function () {
						closeDateTimeModal();
					},
				},
			],
		});
	}
	if ($("#itemAttrModal").length) {
		itemAttrModal = $("#itemAttrModal").dialog({
			width: 550,
			title: customattributetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: function () {
						confirmItemAttr();
					},
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: function () {
						resetItemAttrModal();
						closeItemAttrModal();
					},
				},
			],
		});
	}

	if ($("#customerTermsModal").length)
		customerTermsModal = $("#customerTermsModal").dialog({
			width: 400,
			title: customertermstxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "secondarybtn",
					text: closetxt,
					click: closeCustomerTermsModal,
				},
			],
		});

	if ($("#purchaseSerialModal").length) {
		purchaseSerialModal = $("#purchaseSerialModal").dialog({
			width: 700,
			title: serialnotxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: confirmPoSn,
				},
				{
					class: "secondarybtn",
					text: closetxt,
					click: closePurchaseSerialModal,
				},
			],
		});
	}

	if ($("#purchaseBatchModal").length) {
		purchaseBatchModal = $("#purchaseBatchModal").dialog({
			width: 700,
			title: batchtxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: confirmPoBatch,
				},
				{
					class: "secondarybtn",
					text: closetxt,
					click: closePurchaseBatchModal,
				},
			],
		});
	}

	if ($("#validthruModal").length)
		validthruModal = $("#validthruModal").dialog({
			width: 800,
			title: expirydatetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: function () {
						confirmVtQty();
					},
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: closeValidthruModal,
				},
			],
		});

	if ($("#batchModal").length)
		batchModal = $("#batchModal").dialog({
			width: 900,
			title: batchtxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: function () {
						confirmBatchSnQty();
					},
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: function () {
						handleBatchModalCancel();
					},
				},
			],
		});

	if ($("#itemBuySellUnitsModal").length)
		itemBuySellUnitsModal = $("#itemBuySellUnitsModal").dialog({
			width: 400,
			title: buysellbaseunitstxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () {
						if (selectedItem) {
							selectedItem!.itmBuyUnit = itemBuySellUnitsModal
								.find("#txtBuyUnit")
								.val();
							selectedItem!.itmSellUnit = itemBuySellUnitsModal
								.find("#txtSellUnit")
								.val();
							selectedItem!.itmSellUnitQuantity = <number>(
								itemBuySellUnitsModal.find("#txtItmSellUnitQuantity").val()
							);
						}
						if (ItemVari) {
							ItemVari!.itmBuyUnit = itemBuySellUnitsModal
								.find("#txtBuyUnit")
								.val();
							ItemVari!.itmSellUnit = itemBuySellUnitsModal
								.find("#txtSellUnit")
								.val();
							ItemVari!.itmSellUnitQuantity = <number>(
								itemBuySellUnitsModal.find("#txtItmSellUnitQuantity").val()
							);
						}
						closeItemBuySellUnitsModal();
						if (editmode) {
							let data = {};
							if (selectedItem)
								data = {
									__RequestVerificationToken: $(
										"input[name=__RequestVerificationToken]"
									).val(),
									item: selectedItem,
								};
							if (ItemVari) {
								data = {
									__RequestVerificationToken: $(
										"input[name=__RequestVerificationToken]"
									).val(),
									PGIV: ItemVari,
								};
							}
							$.ajax({
								type: "POST",
								url: "/Api/UpdateItemBuySellUnit",
								data: data,
								success: function (data) {
									$.fancyConfirm({
										title: "",
										message: data,
										shownobtn: false,
										okButton: oktxt,
										noButton: notxt,
									});
								},
								dataType: "json",
							});
						}
					},
				},
				{
					text: canceltxt,
					click: closeItemBuySellUnitsModal,
				},
			],
		});

	if ($("#purchaseCodeModal").length)
		purchaseCodeModal = $("#purchaseCodeModal").dialog({
			width: 400,
			title: purchasecodetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closePurchaseCodeModal,
				},
			],
		});

	if ($("#currencyModal").length)
		currencyModal = $("#currencyModal").dialog({
			width: 400,
			title: exchangeratetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeCurrencyModal,
				},
			],
		});

	if ($("#taxTypeModal").length)
		taxTypeModal = $("#taxTypeModal").dialog({
			width: 400,
			title: taxtypetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					click: function () {
						let checked: boolean = false;
						taxTypeModal.find(".taxtype").each(function (i, e) {
							if ($(e).is(":checked")) {
								checked = true;
								return false;
							}
						});
						if (!checked) {
							$.fancyConfirm({
								title: "",
								message: plsselectatleastonetaxtypetxt,
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										taxTypeModal.find(".taxtype").eq(0).trigger("focus");
									}
								},
							});
						} else {
							if ($("#incTax").is(":checked")) {
								$target = taxTypeModal.find("#txtTaxRate");
								if (<number>$target.val() == 0) {
									$.fancyConfirm({
										title: "",
										message: plsspecifiytaxrate,
										shownobtn: false,
										okButton: oktxt,
										noButton: notxt,
										callback: function (value) {
											if (value) {
												$target.trigger("focus");
											}
										},
									});
								} else {
									closeTaxTypeModal();
								}
							} else {
								closeTaxTypeModal();
							}
						}
					},
				},
				{
					text: canceltxt,
					click: closeTaxTypeModal,
				},
			],
		});

	if ($("#logoModal").length)
		logoModal = $("#logoModal").dialog({
			width: 400,
			title: logotxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeLogoModal,
				},
			],
		});

	if ($("#salesgroupModal").length) {
		salesgroupModal = $("#salesgroupModal").dialog({
			width: 500,
			title: "",
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: canceltxt,
					click: closeSalesGroupModal,
				},
			],
		});
	}


	if ($("#groupSalesmenModal").length) {
		groupSalesmenModal = $("#groupSalesmenModal").dialog({
			width: 700,
			title: groupsalesmentxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeGroupSalesmenModal,
				},
			],
		});
	}

	if ($("#salesgroupMemberModal").length) {
		salesgroupMemberModal = $("#salesgroupMemberModal").dialog({
			width: 700,
			title: salesgrouptxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeSalesGroupMemberModal,
				},
			],
		});
	}

	//assignedEnquiryModal
	if ($("#assignedEnquiryModal").length) {
		assignedEnquiryModal = $("#assignedEnquiryModal").dialog({
			width: 850,
			title: assignedenquiriestxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeAssignedEnquiryModal,
				},
			],
		});
	}

	//assignedContactModal
	if ($("#assignedContactModal").length) {
		assignedContactModal = $("#assignedContactModal").dialog({
			width: 850,
			title: assignedcontactstxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeAssignedContactModal,
				},
			],
		});
	}

	//customAttributeModal
	if ($("#customAttributeModal").length) {
		customAttributeModal = $("#customAttributeModal").dialog({
			width: 450,
			title: customattributetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				//{
				//    text: savetxt,
				//    "class": 'savebtn',
				//    click: function () {

				//    }
				//},
				{
					text: canceltxt,
					click: closeCustomAttributeModal,
				},
			],
		});
	}

	if ($("#gAttrFilterModal").length) {
		gAttrFilterModal = $("#gAttrFilterModal").dialog({
			width: 600,
			title: attributetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () {
						let $drpgattr = $("#drpGattr");
						let attrname = <string>$drpgattr.val();
						if (attrname == "") {
							$.fancyConfirm({
								title: "",
								message: attrnamerequiredtxt,
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										$drpgattr.trigger("focus");
									}
								},
							});
						}
						let $drpoperator = $("#drpOperator");
						let operator = <string>$drpoperator.val();
						if (operator == "") {
							$.fancyConfirm({
								title: "",
								message: operatorrequiredtxt,
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										$drpoperator.trigger("focus");
									}
								},
							});
						}
						let $txtattrval =
							attrname.toLowerCase().indexOf("date") >= 0
								? $("#txtAttrVal_d")
								: $("#txtAttrVal");
						let attrval = <string>$txtattrval.val();
						if (attrval == "") {
							$.fancyConfirm({
								title: "",
								message: attrvalrequiredtxt,
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										$txtattrval.trigger("focus");
									}
								},
							});
						}

						if (attrname !== "" && operator != "" && attrval !== "") {
							let _attribute: IAttribute = initAttribute();
							_attribute.attrName = attrname;
							_attribute.operator = operator;
							_attribute.attrValue = attrval;
							closeGattrFilterModal();
							let $frm;
							if (gattrfilteropener == "contact") {
								$frm = $("#frmContact");
							} else {
								$frm = $("#filterform");
							}
							searchByAttribute(_attribute, $frm);
						}
					},
				},
				{
					text: closetxt,
					click: closeGattrFilterModal,
				},
			],
		});
	}

	if ($("#actionLogValModal").length) {
		actionLogValModal = $("#actionLogValModal").dialog({
			width: 800,
			title: actionlogvaltxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeActionLogValModal,
				},
			],
		});
	}

	if ($("#testEblastModal").length) {
		testEblastModal = $("#testEblastModal").dialog({
			width: 600,
			title: testformattxt.replace("{0}", eblasttxt),
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () {
						closeTestEblastModal();
						$target = $("#testemail");
						var testemail = <string>$target.val();
						if (testemail === "") {
							$.fancyConfirm({
								title: "",
								message: requiredinputtxt.replace("{0}", emailtxt),
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										$target.trigger("focus");
									}
								},
							});
						} else {
							if (validateEmail(testemail)) {
								openWaitingModal();
								$.ajax({
									type: "POST",
									url: "/eBlast/SendTestEmail",
									data: {
										__RequestVerificationToken: $(
											"input[name=__RequestVerificationToken]"
										).val(),
										Id: eblastId,
										testemail: testemail,
									},
									success: function (data) {
										closeWaitingModal();
										$.fancyConfirm({
											title: "",
											message: data,
											shownobtn: false,
											okButton: oktxt,
											noButton: notxt,
											callback: function (value) {
												if (value) {
													$("#txtKeyword").trigger("focus");
												}
											},
										});
									},
									dataType: "json",
								});
							} else {
								$.fancyConfirm({
									title: "",
									message: emailformaterr,
									shownobtn: false,
									okButton: oktxt,
									noButton: notxt,
									callback: function (value) {
										if (value) {
											$target.trigger("focus");
										}
									},
								});
							}
						}
					},
				},
				{
					text: canceltxt,
					click: closeTestEblastModal,
				},
			],
		});
	}

	if ($("#hotlistModal").length) {
		hotlistModal = $("#hotlistModal").dialog({
			width: 800,
			title: hotlisttxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: canceltxt,
					click: closeHotListModal,
				},
			],
		});
	}

	if ($("#docModal").length) {
		docModal = $("#docModal").dialog({
			width: 600,
			title: doctxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () { },
				},
				{
					text: canceltxt,
					click: closeDocModal,
				},
			],
		});
	}

	if ($("#gcomboModal").length) {
		gcomboModal = $("#gcomboModal").dialog({
			width: 600,
			title: customfieldvaltxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () {
						saveGCombo();
					},
				},
				{
					text: canceltxt,
					click: closeGComboModal,
				},
			],
		});
	}

	if ($("#salesmenModal").length) {
		salesmenModal = $("#salesmenModal").dialog({
			width: 800,
			title: assignclientstosalestxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: canceltxt,
					class: "secondarybtn",
					click: closeSalesmenModal,
				},
			],
		});
	}

	if ($("#dropdownModal").length) {
		dropdownModal = $("#dropdownModal").dialog({
			width: 400,
			title: "",
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () {
						$target = dropdownModal.find("select");
						closeDropDownModal();
						if (forcustomer) {
							if (forhotlist) handleHotListCustomers();
							if (foreblast) handleEblastCustomers();
							if (forassignsalesmen) {
								let $chk = $("#chkEmailNotification");
								handleSalesmenCustomers($chk.length > 0 && $chk.is(":checked"));
							}
						}
						if (forenquiry) {
							if (forassignsalesmen) {
								let $chk = $("#chkEmailNotification");
								handleSalesmenEnquiries($chk.length > 0 && $chk.is(":checked"));
							}
						}
						else {
							let _id: string = <string>$target.attr("id");
							console.log("_id:" + _id);
							let _val: string = <string>$target.val();
							if (_val !== "") {
								$target = $("#gattrblk").find(".form-group");
								$.each($target, function (i, e) {
									let _target = $(e).find(".form-control");
									if (_target.data("attrname") == _id) {
										_target.val(_val);
										return false;
									}
								});
							}
						}
					},
				},
				{
					text: canceltxt,
					click: closeDropDownModal,
				},
			],
		});
	}

	if ($("#accountModal").length) {
		accountModal = $("#accountModal").dialog({
			width: 600,
			title: itemaccounttxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: canceltxt,
					click: resetAccountRow,
				},
			],
		});
	}

	if ($("#comboModal").length) {
		comboModal = $("#comboModal").dialog({
			width: 600,
			title: editattribute,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: "",
					class: "savebtn",
					click: function () {
						//saveAttributeVals(edit);
					},
				},
				{
					text: canceltxt,
					click: closeComboModal,
				},
			],
		});
	}

	if ($("#actionModal").length) {
		actionModal = $("#actionModal").dialog({
			width: 960,
			title: actionhistory,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeActionModal,
				},
			],
		});
	}

	if ($("#previewModal").length) {
		previewModal = $("#previewModal").dialog({
			width: 960,
			title: templatepreview,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closePreviewModal,
				},
			],
		});
	}

	if ($("#waitingModal").length) {
		waitingModal = $("#waitingModal").dialog({
			width: 180,
			title: plswaittxt,
			autoOpen: false,
			modal: true,
			buttons: [],
		});
	}

	if ($("#cashdrawerModal").length) {
		cashdrawerModal = $("#cashdrawerModal").dialog({
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeCashDrawerModal,
				},
			],
		});
	}

	if ($("#changeModal").length) {
		changeModal = $("#changeModal").dialog({
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					click: function () {
						closeChangeModal();
					},
				},
			],
		});
	}

	if ($("#payModal").length) {
		payModal = $("#payModal").dialog({
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () {
						if (
							(forsales && !Sales.MonthlyPay) ||
							forpreorder ||
							forrefund ||
							fordeposit || forsimplesales || forReservePaidOut
						) confirmPay();

						closePayModal();
					},
				},
				{
					text: canceltxt,
					class: "secondarybtn",
					click: function () {
						resetPay();
					},
				},
			],
		});
	}

	if ($("#descModal").length) {
		descModal = $("#descModal").dialog({
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: function () {
						descModal.dialog("close");
					},
				},
			],
		});
	}

	if ($("#itemModal").length) {
		itemModal = $("#itemModal").dialog({
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: canceltxt,
					click: function () {
						itemModal.dialog("close");
					},
				},
			],
		});
	}

	if ($("#cusModal").length) {
		cusModal = $("#cusModal").dialog({
			autoOpen: false,
			width: 800,
			title: searchcustxt,
			modal: true,
			buttons: [
				{
					text: canceltxt,
					click: closeCusModal,
				},
			],
		});
	}

	if ($("#serialModal").length) {
		serialModal = $("#serialModal").dialog({
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: function () {
						confirmSNs();
					},
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: closeSerialModal,
				},
			],
		});
	}
}
function handlePoItemVariModalCancel() {
	closePoItemVariModal();
}
function handleItemVariModalCancel() {
	closeItemVariModal();
}
function handleTransferModalCancel() {
	closeTransferModal();
}
function handleValidthruModalCancel() {
	closeValidthruModal();
}
function handleBatchModalCancel() {
	closeBatchModal();
	if (
		batchModal.find(".secondarybtn").text == canceltxt &&
		!chkbatsnvtchange &&
		batdelqtychange
	)
		resetBatchQty();
}
function handleSerialModalCancel() {
	closeSerialModal();
}
function getActualPrice(_item: ISimpleItem): number {
	//console.log('item#getactualprice:', _item);
	//console.log("_item.itmBaseSellingPrice!:" + _item.itmBaseSellingPrice!);
	//console.log("selectedCus.cusPriceLevelID:" + selectedCus.cusPriceLevelID);
	let price = 0;
	if (selectedCus.cusCode.toLowerCase() !== "guest") {
		switch (selectedCus.cusPriceLevelID) {
			case "PLB":
				price = _item.PLB;
				break;
			case "PLC":
				price = _item.PLC;
				break;
			case "PLD":
				price = _item.PLD;
				break;
			case "PLE":
				price = _item.PLE;
				break;
			case "PLF":
				price = _item.PLF;
				break;
			default:
			case "PLA":
			case "BSP":
				price = _item.itmBaseSellingPrice!;
		}
	} else {
		price = _item.itmBaseSellingPrice!;
	}
	if (!price) price = _item.itmBaseSellingPrice!;
	//console.log('price#getactualprice:' + price);
	return price;
	// price = price / exRate;
}

function getSnVt(
	_itemsnvtlist: Array<IItemSnBatVt>,
	_itemcode: string | number,
	_seq: number
): IBatSnVt[] {
	let filteredsnvtlist = $.grep(_itemsnvtlist, function (e, i) {
		return e.itemcode.toString() === _itemcode.toString() && e.seq === _seq;
	});
	//console.log('filteredsnvlist:', filteredsnvtlist);
	let snvtlist: Array<IBatSnVt> = [];
	if (filteredsnvtlist.length > 0) {
		snvtlist = filteredsnvtlist[0].snvtlist;
	}
	//console.log('return snvtlist:', snvtlist);
	return snvtlist;
}

function getSncodes(
	_itemsnlist: Array<IItemSN>,
	_itemcode: string | number,
	_seq: number
): string[] {
	let filteredsnlist = $.grep(_itemsnlist, function (e, i) {
		return e.itemcode.toString() === _itemcode.toString() && e.seq === _seq;
	});
	//console.log('filteredsnlist:', filteredsnlist);
	let sncodes: Array<string> = [];
	if (filteredsnlist.length > 0) {
		sncodes = filteredsnlist[0].serialcodes;
	}
	//console.log('return sncode:', sncodes);
	return sncodes;
}

function calAmount(_qty: any, _price: any, _discount: any): number {
	var qty = parseInt(_qty);
	var price = parseFloat(_price);
	var discount = parseFloat(_discount);
	//console.log('qty:' + qty + ';price:' + price + ';discount:' + discount);
	let _amt: number = round(price * qty * (1 - discount / 100), 2);
	return _amt;
}

function calAmountPlusTax(
	qty: number,
	price: number,
	taxrate: number,
	discount: number
): number {
	/* console.log('qty:' + qty + ';price:' + price + ';discount:' + discount + ';taxrate:' + taxrate);*/
	let _amt: number = round(
		price * qty * (1 + taxrate / 100) * (1 - discount / 100),
		2
	);
	return _amt;
}

function formatnumber(amt: number): string {
	return Number(amt).toFixed(2);
}

function formatmoney(amt: number, png: boolean = false): string {
	if (png) {
		return "K" + formatnumber(amt);
	} else {
		// Create our number formatter.
		var formatter = new Intl.NumberFormat("zh-HK", {
			style: "currency",
			currency: currencyCode,
		});
		return formatter.format(amt);
	}
}

function formatmoney4PNG(amt: number): string {
	return "K" + formatnumber(amt);
}

function disableNavLink() {
	$(".nav-link").each(function (i, e) {
		/** @type {HTMLAnchorElement} */
		let ele = $(e);
		let href: string | undefined = ele.attr("href");
		if (typeof href !== "undefined") {
			ele.data("href", href);
		}
		ele.attr("href", "#");
	});
}

function restoreNavLink() {
	$(".nav-link").each(function (i, e) {
		$(e).attr("href", $(e).data("href"));
	});
}

function falert(msg, ok) {
	$.fancyAlert({
		message: msg,
		okButton: ok,
	});
}

$.fancyAlert = function (opts) {
	opts = $.extend(
		true,
		{
			message: "",
			okButton: "OK",
		},
		opts || {}
	);

	$.fancybox.open({
		type: "html",
		src:
			'<div class="fc-content">' +
			"<p>" +
			opts.message +
			"</p>" +
			'<p class="tright">' +
			'<button data-value="1" data-fancybox-close class="btn fancybox-btn">' +
			opts.okButton +
			"</button>" +
			"</p>" +
			"</div>",
		opts: {
			animationDuration: 350,
			animationEffect: "material",
			modal: true,
			baseTpl:
				'<div class="fancybox-container fc-container" role="dialog" tabindex="-1">' +
				'<div class="fancybox-bg"></div>' +
				'<div class="fancybox-inner">' +
				'<div class="fancybox-stage"></div>' +
				"</div>" +
				"</div>",
		},
	});
};

$.fancyConfirm = function (opts) {
	opts = $.extend(
		true,
		{
			title: "Are you sure?",
			message: "",
			okButton: "OK",
			noButton: "Cancel",
			callback: $.noop,
		},
		opts || {}
	);

	let _src = opts.shownobtn
		? '<div class="fc-content">' +
		"<h3>" +
		opts.title +
		"</h3>" +
		"<p>" +
		opts.message +
		"</p>" +
		'<p class="tright">' +
		'<a data-value="0" data-fancybox-close>' +
		opts.noButton +
		"</a>" +
		'<button data-value="1" data-fancybox-close class="btn fancybox-btn">' +
		opts.okButton +
		"</button>" +
		"</p>" +
		"</div>"
		: '<div class="fc-content">' +
		"<h3>" +
		opts.title +
		"</h3>" +
		"<p>" +
		opts.message +
		"</p>" +
		'<p class="tright">' +
		'<button data-value="1" data-fancybox-close class="btn fancybox-btn">' +
		opts.okButton +
		"</button>" +
		"</p>" +
		"</div>";

	$.fancybox.open({
		type: "html",
		src: _src,
		opts: {
			animationDuration: 350,
			animationEffect: "material",
			modal: true,
			baseTpl:
				'<div class="fancybox-container fc-container" role="dialog" tabindex="-1">' +
				'<div class="fancybox-bg"></div>' +
				'<div class="fancybox-inner">' +
				'<div class="fancybox-stage"></div>' +
				"</div>" +
				"</div>",
			afterClose: function (instance, current, e) {
				var button = e ? e.target || e.currentTarget : null;
				var value = button ? $(button).data("value") : 0;

				opts.callback(value);
			},
		},
	});
};


function initDayendCountPay(): IDayendCountPay {
	return {
		selPayMethod: "",
		selAmtSys: 0,
		selAmtCount: 0,
		isCash: 0,
	};
}

function initRefundItem(): IRefundBase {
	return {
		rtlUID: 0,
		itemcode: selectedItemCode,
		price: 0,
		refundedQty: 0,
		refundableQty: 0,
		qtyToRefund: 0,
		discount: 0,
		amt: 0,
		amtplustax: 0,
		rtlSeq: 0,
		taxrate: 0,
		//isZeroStockItem: false,
		rtlDesc: "",
		rtlRefSales: "",
		//rtlItemCode: '',
		//rtlSalesAmt: 0,
		//rtlQty: 0,
		SalesDateDisplay: "",
		vtdelIds: null,
		batdelIds: null,
		strsnlist: null,
		batdelId: 0,
		vtdelId: 0,
		rtlSn: null,
		rfSeq: 0,
		rtlStockLoc: "",
	};
}

function initReturnItem(): IReturnBase {
	return {
		itemcode: "",
		batchcode: "",
		price: 0,
		returnedQty: 0,
		returnableQty: 0,
		qtyToReturn: 0,
		discpc: 0,
		amount: 0,
		amountplustax: 0,
		seq: 0,
		taxrate: 0,
		taxamt: 0,
		itmNameDesc: "",
		psRefCode: "",
		PurchaseDateDisplay: "",
		baseUnit: "",
		serialNo: initSerialNo(),
		hasSN: false,
		JsValidThru: "",
	};
}
function initRefundSales(): IRefundSales {
	return {
		rtlUID: 0,
		rtsCode: "",
		rtsRmks: "",
		rtlItemCode: "",
		rtlSellingPrice: 0,
		rtlTaxPc: 0,
		rtlBatch: "",
		rtlQty: 0,
		rtlRefSales: "",
		rtlSeq: 0,
		rtlSalesAmt: 0,
		SalesDateDisplay: "",
		rtlCode: "",
		rtlLineDiscPc: 0,
		rtlSalesDate: "",
		rtlDesc: "",
		SellingPrice: 0,
		SellingPriceDisplay: "",
		//refundSeq:0,
		refundedQty: 0,
		refundableQty: -1,
		//refundableAmtPlusTax: 0,
		qtyToRefund: 0,
		taxModel: initTaxModel(),
		rtlTaxIncl: 0,
		rtlTaxExcl: 0,
		rtlTaxAmt: 0,
		rtlSellingPriceMinusInclTax: 0,
		vtdelIds: null,
		batdelIds: null,
		strsnlist: null,
		batdelId: 0,
		vtdelId: 0,
		rtlSn: null,
		rfSeq: 0,
		rtlStockLoc: "",
		rtlValidThru: null,
		itmNameDesc: "",
		rtsServiceChargeAmt: 0
	};
}

function initTaxModel(): ITaxModel {
	return {
		taxType: TaxType.Exclusive,
		taxRate: 0,
		inclTaxAmt: 0,
		exclTaxAmt: 0,
		taxAmt: 0,
		tIN: "",
		EnableTax: false,
	};
}


function initSalesItem(): ISalesItem {
	return {
		salescode: "",
		itemcode: "",
		rtlSeq: 0,
		desc: "",
		batch: "",
		qty: 0,
		price: 0,
		pricetxt: "",
		disc: 0,
		disctxt: "",
		tax: 0,
		taxtxt: "",
		amt: 0,
		amttxt: "",
		date: "",
		depositqty: 0,
		depositamttxt: "",
		depositamt: 0,
		depositdate: "",
		qtyavailable: 0,
		refundqty: 0,
		refundqtytxt: "",
		refundamt: 0,
		refundamttxt: "",
		refunddate: "",
		snlist: "",
		sncodes: [],
		remark: "",
		internalnote: "",
		customerpo: "",
		deliverydatedisplay: "",
		rtlStockLoc: "",
	};
}

function initDepositRemainItem(): IDepositRemainItem {
	return {
		itemcode: "",
		itemdesc: "",
		price: 0,
		qty: 0,
		amount: 0,
		seq: 0,
		depositamt: 0,
		remainamt: 0,
	};
}

function initAddressView(): IAddressView {
	return {
		Id: 0,
		cusCode: "",
		cusAddrLocation: "",
		AccountProfileId: 0,
		StreetLine1: "",
		StreetLine2: "",
		StreetLine3: "",
		StreetLine4: "",
		City: "",
		State: "",
		Postcode: "",
		Country: "",
		Phone1: "",
		Phone2: "",
		Phone3: "",
		Fax: "",
		Email: "",
		Salutation: "",
		ContactName: "",
		WWW: "",
	};
}


function initItem(): IItem {
	return {
		itmIsActive: $("#isActive").is(":checked"),
		itmIsNonStock: $("#inventory").length
			? !$("#inventory").is(":checked")
			: false,
		itmIsQtyFractional: false,
		itmIsCombo: false,
		itmChgCtrl: "",
		itmCode: $("#itmCode").val() as string,
		itmCode2: "",
		itmName: $("#itmName").val() as string,
		itmDesc: $("#itmDesc").val() as string,
		itmUseDesc: $("#replacing").is(":checked"),
		itmUseDesc2: false,
		chkSN: $("#chkSN").is(":checked"),
		itmSnReusable: false,
		chkVT: $("#chkExpiry").is(":checked"),
		itmValidDays: 0,
		itmValidThru: "",
		itmRedeemable: false,
		itmRedeemValue: 0,
		chkBat: $("#chkBatch").is(":checked"),
		itmBchWillExpire: false,
		itmCodeSup: "",
		itmNameSup: "",
		itmCodeSup2: "",
		itmNameSup2: "",
		itmSupDiscPc: 0,
		itmSupCurr: "",
		itmCodeCus: "",
		itmNameCus: "",
		itmSupCode: "",
		itmItemGrp: "",
		itmItemGrp2: "",
		itmSeries: "",
		itmTaxCode: "",
		itmTaxPc: 0,
		itmLength: Number($("#itmLength").val()),
		itmWidth: Number($("#itmWidth").val()),
		itmHeight: Number($("#itmHeight").val()),
		itmBaseUnit: "",
		itmBulkUnit: "",
		itmBulk2BaseUnit: 0,
		itmBuyUnit: $("#txtBuyUnit").val() as string,
		itmSellUnit: $("#txtSellUnit").val() as string,
		itmBuy2Unit: "",
		itmSell2Unit: "",
		itmBuy2BaseUnit: 1,
		itmSell2BaseUnit: 1,
		itmRrpLocAdj: false,
		itmRrpTaxExcl: 0,
		itmRrpTaxIncl: 0,
		itmRrp2TaxIncl: 0,
		itmRrpEquVip: 0,
		itmTopUpVipOK: false,
		itmSellUnitOnHand: 0,
		itmSellUnitAvgCost: 0,
		itmLastSold: "",
		itmBuyStdCost: 0,
		itmBuyLastCost: 0,
		itmBuyLastTime: "",
		itmMinStockQty: 0,
		itmPicFile: "",
		itmPicPath: "",
		itmRunUnitCost: 0,
		itmCntOrgCode: "",
		itmCntOrgName: "",
		itmAuthors: "",
		itmCreateBy: "",
		itmCreateTime: "",
		itmModifyBy: "",
		itmModifyTime: "",
		itmLockBy: "",
		itmLockTime: "",
		itmLastUnitPrice: 0,
		itmLastSellingPrice: 0,
		itmSellUnitQuantity:
			Number($("#txtItmSellUnitQuantity").val()) == 0
				? 1
				: Number($("#txtItmSellUnitQuantity").val()),
		itmBaseSellingPrice: 0,
		itmBaseUnitPrice: 0,
		itmUnitCost: 0,
		itmItemID: Number($("#itmItemID").val()),
		itmDSN: "",
		QtySellable: 1,
		PLA: Number($("#PLA").val()),
		PLB: Number($("#PLB").val()),
		PLC: Number($("#PLC").val()),
		PLD: Number($("#PLD").val()),
		PLE: Number($("#PLE").val()),
		PLF: Number($("#PLF").val()),
		IsActive: $("#isActive").is(":checked") ? 1 : 0,
		IncomeAccountID: $("#IncomeAccountID").length
			? Number($("#IncomeAccountID").data("id"))
			: 0,
		InventoryAccountID: $("#InventoryAccountID").length
			? Number($("#InventoryAccountID").data("id"))
			: 0,
		ExpenseAccountID: $("#ExpenseAccountID").length
			? Number($("#ExpenseAccountID").data("id"))
			: 0,

		itmIsBought: $("#buy").length ? $("#buy").is(":checked") : false,
		itmIsSold: $("#sell").length ? $("#sell").is(":checked") : false,
		SellingPriceDisplay: "",
		DicItemAccounts: {},
		LocQtyList: [],
		SelectedLocation: "",
		itmIsTaxedWhenBought: false,
		itmTaxExclusiveLastPurchasePrice: 0,
		itmTaxInclusiveLastPurchasePrice: 0,
		itmTaxExclusiveStandardCost: 0,
		itmTaxInclusiveStandardCost: 0,
		itmIsTaxedWhenSold: false,
		lstStockLoc: "",
		BaseSellingPrice: Number($("#BaseSellingPrice").val()),
		BaseSellingPriceDisplay: "",
		OnHandStock: 0,
		AbssQty: 0,
		DicItemLocQty: {},
		DicItemAbssQty: {},
		OutOfBalance: 0,
		LocStockIds: [],
		JsStockList: [],
		JsonJsStockList: "",
		DicLocQty:
			$infoblk.data("jsondiclocqty") == ""
				? []
				: $infoblk.data("jsondiclocqty"),
		NameDesc: "",
		AttrList:
			$infoblk.data("jsonattrlist") == "" ? [] : $infoblk.data("jsonattrlist"),
		SelectedAttrList4V: [],
		itmWeight: Number($("#itmWeight").val()),
		IsModifyAttr: false,
		TotalBaseStockQty: 0,
		catId: 0,
		ItemPromotions: [],
		hasSelectedIvs: false,
		singleProId: 0,
		hasItemVari: false,
		CategoryName: "",
		discpc: 0,
		ItemOptionsDisplay: "",
		ItemVariDisplay: "",
	};
}

function initSnVt(): ISnVt {
	return {
		pocode: "",
		sn: "",
		vt: "",
		selected: false,
	};
}

function initSerial(): ISerial {
	return {
		pocode: "",
		sn: "",
		seq: 0,
		vt: null,
		itemcode: "",
		selected: false,
	};
}


function initItemSnValidThru(): IItemSnBatVt {
	return {
		itemcode: "",
		batch: "",
		seq: 0,
		snvtlist: [],
		validthru: "",
	};
}
function initBatSnVt(): IBatSnVt {
	return {
		pocode: "",
		sn: "",
		batcode: "",
		vt: "",
		selected: false,
		status: "",
	};
}

function initItemSnSeqVtList(): IItemSnSeqVtList {
	return {
		itemcode: "",
		seq: 0,
		snseqvtlist: [],
	};
}
function initSnBatSeqVt(): ISnBatSeqVt {
	return {
		sn: "",
		batcode: null,
		snseq: 0,
		vt: null,
		seq: seq,
	};
}
function initItemSnVtList(): IItemSnVtList {
	return {
		itemcode: "",
		seq: 0,
		snvtlist: [],
	};
}
function initSerialNo(): ISerialNo {
	return {
		snoUID: 0,
		snoRtlSalesCode: "",
		snoRtlSalesSeq: 0,
		SalesDateDisplay: "",
		snoItemCode: "",
		snoCode: "",
		snoStatus: "",
		snoStockInCode: "",
		snoStockInSeq: 0,
		snoBatchCode: "",
		snoValidThru: "",
		StockInDateDisplay: "",
		itmNameDesc: "",
		wslSellUnit: "",
		wslValidThru: null,
		ValidThruDisplay: "",
		wslSellingPrice: 0,
		wslTaxPc: 0,
		wslTaxAmt: 0,
		wslLineDiscAmt: 0,
		wslLineDiscPc: 0,
		wslSalesAmt: 0,
		wslUID: 0,
		snValidThru: null,
		snSeq: 0,
		seq: seq,
	};
}

function fillAttribute($e: JQuery, attrval: string = ""): IAttribute {
	//console.log('e:', $e);
	return {
		attrId: $e.data("attid"),
		contactId: $e.data("contactid"),
		attrName: $e.data("attname"),
		attrType: $e.data("atttype"),
		attrIsDefault: false,
		attrIsGlobal: false,
		attrOrder: 0,
		iIsDefault: <number>$e.data("isdefault"),
		iIsGlobal: 0,
		AccountProfileId: $e.data("apid"),
		attrValue: attrval,
		CreateTime: "",
		ModifyTime: "",
		Id: "",
		attrValues: "",
		operator: "",
	};
}
function initAttribute(
	_customerId = 0,
	name = "",
	type = "",
	isdefault = 0,
	isglobal = 0,
	apId = 0,
	value: string = "",
	_attrId: string = ""
): IAttribute {
	return {
		attrId: _attrId,
		contactId: _customerId,
		attrName: name,
		attrType: type,
		attrIsDefault: false,
		attrIsGlobal: false,
		iIsDefault: isdefault,
		iIsGlobal: isglobal,
		attrOrder: 0,
		AccountProfileId: apId,
		attrValue: value,
		CreateTime: "",
		ModifyTime: "",
		Id: "",
		attrValues: "",
		operator: "",
	};
}

let Customer: ICustomer;
interface IAttribute {
	attrId: string;
	contactId: number;
	attrName: string;
	attrType: string;
	attrIsDefault: boolean;
	attrIsGlobal: boolean;
	attrOrder: number;
	iIsDefault: number;
	iIsGlobal: number;
	AccountProfileId: number;
	attrValue: string;
	CreateTime: string;
	ModifyTime: string;
	Id: string;
	attrValues: string;
	operator: string;
}
interface IeBlast {
	Id: number;
	blSubject: string;
	blContent: string;
	blHtml: boolean;
	blSendExpected: number;
	blSentActual: number | null;
	accountProfileId: number;
	blSendTime: string | null;
	blPause: number | null;
	blFinishTime: string | null;
	SendTimeDisplay: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
}

let comInfo: IComInfo;
interface IComInfo extends IEmailSetting {
	Shop: string;
	Device: string;
	Devices: any;
	Shops: any;
	UseForexAPI: boolean;
	comLogo: string;
	comName: string;
	comEmail: string;
	comWebsite: string;
	comAddress1: string;
	comAddress2: string;
	comAccountNo: string;
	comPhone: string;
	comFax: string;
	enableTax: boolean;
	inclusivetax: boolean;
	inclusivetaxrate: number;
}


interface IAddress {
	cardRecordID: number;
	phone1: string;
	email: string;
	location: number;
	street: string;
	streetLine1: string;
	streetLine2: string;
	streetLine3: string;
	city: string;
	state: string;
	postcode: string;
	country: string;
	phone2: string;
	phone3: string;
	fax: string;
	salutation: string;
	contactName: string;
	wWW: string;
	streetLine4: string;
}

interface IEblast {
	Id: number;
	blSubject: string;
	blContent: string;
}
let EblastList: IEblast[] = [];

const validateEmail = (email) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};

function round(value: number, precision: number = 1) {
	var multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}

function checkIfInt(n: number): boolean {
	return Number.isInteger(n);
}

function getRemoteData(remote_url, data, callback, callbackFail) {
	$.ajax({
		//async: false,
		//timeout: 30000, //最長等候回應時間
		type: "GET", //提交類型
		url: remote_url, //提交地址
		data: data, //提交內容
		dataType: "json", //返回數據類型
		success: function (data) {
			//請求完成並成功
			if (data !== null) {
				callback(data);
			} else {
				callbackFail();
			}
		},
		error: function (data) {
			//請求返回錯誤信息
			callbackFail();
		},
		beforeSend: function (XHR) {
			//请求開始前执行
		},
		complete: function (XHR, status) {
			//请求完成后最终执行
		},
	});
}

function getRemoteDataFail() {
	falert(errorhere, oktxt);
}

function getParameterByName(name, url = window.location.href): string | null {
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return "";
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function onAjaxFailure(response) {
	alert(response.d);
}

function staffdetail(data: ISysUser) {
	let _statustxt = data.surIsActive ? activetxt : inactivetxt;
	let manager = data.ManagerName ?? "N/A";
	let device = data.dvcCode === "" ? "N/A" : data.dvcCode;
	let html =
		"<h3>" +
		staffdetailtxt +
		"</h3>" +
		'<ul class="list-group list-group-flush">';
	html +=
		'<li class="list-group-item"><strong>' +
		statustxt +
		"</strong>: " +
		_statustxt +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		nametxt +
		"</strong>: " +
		data.UserName +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		devicetxt +
		"</strong>: " +
		device +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		shoptxt +
		"</strong>: " +
		data.shopCode +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		managertxt +
		"</strong>: " +
		manager +
		"</li>";
	if (data.CustomerList.length > 0) {
		html +=
			'<li class="list-group-item"><strong>' + customerlisttxt + "</strong>";
		html +=
			'<table class="table table-bordered"><thead><tr><th>' +
			nametxt +
			"</th><th>" +
			phonetxt +
			"</th></tr></thead><tbody>";
		$.each(data.CustomerList, function (i, e) {
			html += "<tr><td>" + e.cusName + "</td><td>" + e.cusPhone + "</td></tr>";
		});
		html += "</tbody></table></li>";
	}

	//console.log('dicstaffaccount:', dicISysUserAccount);
	//let cosaccountno: string = data.ExpenseAccountID > 0 ? dicISysUserAccount[data.ExpenseAccountID.toString()] : 'N/A';
	//html += '<li class="list-group-item"><strong>' + cosaccounttxt + '</strong>: ' + cosaccountno + '</li>';
	//let incomeaccountno: string = data.IncomeAccountID > 0 ? dicISysUserAccount[data.IncomeAccountID.toString()] : 'N/A';
	//html += '<li class="list-group-item"><strong>' + incomeaccount4tstxt + '</strong>: ' + incomeaccountno + '</li>';
	//let stockaccountno: string = data.InventoryAccountID > 0 ? dicISysUserAccount[data.InventoryAccountID.toString()] : 'N/A';
	//html += '<li class="list-group-item"><strong>' + assetaccount4inventorytxt + '</strong>: ' + stockaccountno + '</li>';
	//html += '<li class="list-group-item"><strong>' + collecttaxtxt + '</strong>: ' + _collecttaxtxt + '</li>';
	//html += '<li class="list-group-item"><strong>' + createtimetxt + '</strong>: ' + data.CreateTimeDisplay + '</li>';
	//html += '<li class="list-group-item"><strong>' + modifytimetxt + '</strong>: ' + data.ModifyTimeDisplay + '</li>';

	html += "</ul>";
	//console.log('html:' + html);
	return html;
}
function initeBlast(): IeBlast {
	return {
		Id: 0,
		blSubject: "",
		blContent: "",
		blHtml: false,
		blSendExpected: 0,
		blSentActual: 0,
		accountProfileId: 0,
		blSendTime: "",
		blPause: 0,
		blFinishTime: "",
		SendTimeDisplay: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
	};
}
function initAddress(): IAddress {
	return {
		cardRecordID: 0,
		phone1: "",
		email: "",
		location: 0,
		street: "",
		streetLine1: "",
		streetLine2: "",
		streetLine3: "",
		city: "",
		state: "",
		postcode: "",
		country: "",
		phone2: "",
		phone3: "",
		fax: "",
		salutation: "",
		contactName: "",
		wWW: "",
		streetLine4: "",
	};
}

function convertStringToDate(
	strdate: string,
	format: string = "yyyy-mm-dd",
	delimeter: string = "-"
) {
	let arr: string[],
		year: number = 1970,
		mth: number = 0,
		day: number = 1;
	if (format === "yyyy-mm-dd" && delimeter === "-") {
		arr = strdate.split("-");
		year = parseInt(arr[0]);
		mth = parseInt(arr[1]) - 1;
		day = parseInt(arr[2]);
	}
	return new Date(year, mth, day);
}

function getNumberFrmString(str: string): number {
	var numsStr = str.replace(/[^0-9]/g, '');
	return parseInt(numsStr);
}
function fillInEnquiry() {
	enquiry = {
		id: <string>$("#Id").val(),
		Id: <string>$("#Id").val(),
		enId: <string>$("#enId").val(),
		from: <string>$("#enFrom").val(),
		subject: <string>$("#enSubject").val(),
		email: <string>$("#enEmail").val(),
		phone: <string>$("#enPhone").val(),
		company: <string>$("#enOrganization").val(),
		contact: <string>$("#enContact").val(),
		enFirstName: null,
		enLastName: null,
		enMobile: <string>$("#enMobile").val(),
		enComment: <string>$("#enComment").val(),
		enAssignedSalesId: <number>$("#enAssignedSalesId").val(),
		receiveddate: "",
		enSubject: <string>$("#enSubject").val(),
		enFrom: <string>$("#enFrom").val(),
		enEmail: <string>$("#enEmail").val(),
		enOrganization: <string>$("#enOrganization").val(),
		enContact: <string>$("#enContact").val(),
		enDateDisplay: "",
		enEdited: false,
		enTransacted: false,
		enAddedToContact: false,
		iEdited: 0,
		iTransacted: 0,
		SalesPersonName: "",
		receivedDateTime: null,
		body: {},
		enPhone: <string>$("#enPhone").val(),
		enDate: null,
		enContent: null,
		enDateFrm: null,
		enDateTo: null,
		enReceivedDateTime: null,
		receivedDtDisplay: null,
		AddedToContactDisplay: "",
		FollowUpDateDisplay: null,
		FollowUpStatus: null,
		FollowUpStatusDisplay: null,
		FollowUpDateInfo: {} as IEnquiryInfo,
		statuscls: null,
		UploadFileList: [],
		TotalRecord: 0,
		emailDisplay: "",
		CustomAttributes: $("#CustomAttributes").val() as string,
	};
	enquiry.FollowUpDateInfo.type = "date";
	enquiry.FollowUpDateInfo.status = $(".followup:checked").val() as string;
	enquiry.FollowUpDateInfo.JsFollowUpDate = $("#followUpDate").val() as string;
	//FollowUpDateInfo_Id
	enquiry.FollowUpDateInfo.Id = $("#FollowUpDateInfo_Id").val() as string;
	if ($infoblk.data("uploadfilelist") !== "") {
		enquiry.UploadFileList = $infoblk
			.data("uploadfilelist")
			.toString()
			.split(",");
		$("#btnViewFile").removeClass("hide");
	}
}
function initGlobalAttribute(
	_Id: string = "",
	_name: string = "",
	_val: string = "",
	_type = "text",
	_order = 0,
	_apId = 1
): IGlobalAttribute {
	return {
		gattrId: _Id,
		attrName: _name,
		attrValue: _val,
		attrType: _type,
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		AccountProfileId: _apId,
		attrOrder: _order,
		combo: initGCombo(_Id, _val),
		oldAttrName: _name,
	};
}
interface IEnquiry {
	CustomAttributes: string | null;
	emailDisplay: string;
	TotalRecord: number;
	UploadFileList: string[];
	id: string;
	Id: string | null;
	enId: string;
	from: string;
	subject: string;
	email: string;
	phone: string;
	company: string;
	contact: string;
	enFirstName: string | null;
	enLastName: string | null;
	enMobile: string | null;
	enComment: string | null;
	enAssignedSalesId: number | null;
	receiveddate: string;
	enSubject: string | null;
	enFrom: string | null;
	enEmail: string | null;
	enOrganization: string | null;
	enContact: string | null;
	enDateDisplay: string | null;
	enEdited: boolean | null;
	enTransacted: boolean | null;
	enAddedToContact: boolean | null;
	iEdited: number;
	iTransacted: number;
	SalesPersonName: string;
	receivedDateTime: any;
	body: any;
	enPhone: string | null;
	enDate: string | null;
	enContent: string | null;
	enReceivedDateTime: string | null;
	enDateFrm: string | null;
	enDateTo: string | null;
	receivedDtDisplay: string | null;
	AddedToContactDisplay: string;
	FollowUpStatus: string | null;
	FollowUpStatusDisplay: string | null;
	FollowUpDateDisplay: string | null;
	FollowUpDateInfo: IEnquiryInfo;
	statuscls: string | null;
}

let onedrivefiles: Array<IOneDrive> = [];
let onedrivefile: IOneDrive;
let enquiries: Array<IEnquiry> = [];
let attendances: Array<IAttendance> = [];
let jobs: Array<IJob> = [];
let enquiry: IEnquiry;
let attendance: IAttendance;
let job: IJob;
let training: ITraining;
let nextLink: string = "";
let contents: string = "";

interface IGlobalAttribute {
	gattrId: string;
	attrName: string;
	attrValue: string;
	attrType: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	AccountProfileId: number;
	attrOrder: number;
	combo: IGCombo;
	oldAttrName: string | null;
}
let apId: number = 0;

interface ICustomAttribute {
	attrId: string;
	cusCode: string;
	attrName: string;
	attrValue: string | null;
	attrValueSelected: string | null;
	attrType: string | null;
	attrIsDefault: boolean;
	attrIsGlobal: boolean;
	gattrId: string;
}
let assignedsalesmanEnqIds: number[] = [];
let icheckall: number = 0;
let EnqCheckedAll: boolean = false;
interface IGraphSettings {
	Id: number;
	gsAppName: string;
	gsAuthority: string;
	gsClientId: string;
	gsRedirectUri: string;
	gsTenantId: string;
	gsClientSecretId: string;
	gsClientSecretVal: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	gsEmailResponsible: string;
}
interface ICallHistory {
	Id: number;
	chContactId: number;
	chDateTime: string;
	chStatus: string;
	chDocumentName: string;
	chDocumentLink: string;
	strDateTime: string | null;
	chDateTimeDisplay: string;
	ContactName: string | null;
}
let HotList: IHotList;
let HotLists: Array<IHotList>;
interface IHotList {
	Id: number;
	hoName: string;
	hoSalesmanResponsible: number;
	hoDescription: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	SalesPersonName: string;
	SalesmanList: Array<ISalesman>;
}

interface IOneDrive {
	Id: string;
	odFileName: string;
	odFileLink: string;
	odFileWebUrl: string;
	odFileType: string;
	odFileSize: number | null;
	odRemark: string;
	UploadTimeDisplay: string | null;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	folder: object;
	package: object;
}


interface IGCombo {
	id: string;
	values: string[];
}
interface IStockFilter {
	pageIndex: number;
	includeStockInfo: boolean;
	location: string;
	keyword: string | null;
}
interface IBaseFormData {
	__RequestVerificationToken: string;
}
interface ICustomerFormData extends IBaseFormData {
	model: ICustomer;
	//addressList: Array<IAddressView>;
}
interface IContactFormData extends IBaseFormData {
	model: IContact;
	AttributeList: Array<IAttribute>;
}

let isorgan: boolean = true;
let _firstname: string = "";
let _lastname: string = "";
let _mobilecount: number = 1;
let emailsetting: IEmailSetting;
interface IEmailSetting {
	Id: number;
	emSMTP_Server: string;
	emSMTP_Port: number;
	emSMTP_Auth: boolean;
	emSMTP_UserName: string;
	emSMTP_Pass: string;
	emSMTP_EnableSSL: boolean;
	emEmailsPerSecond: number | null;
	emMaxEmailsFailed: number | null;
	emEmailTrackingURL: string;
	emEmail: string;
	emDisplayName: string;
	emOffice365: boolean;
	emTestEmail: string;
	iOffice365: number;
	AccountProfileId: number;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
}


interface IContact {
	cusContactID: number;
	AccountProfileId: number;
	cusIsActive: boolean;
	cusCode: string;
	cusIsOrganization: boolean;
	cusName: string;
	cusFirstName: string;
	cusTitle: string;
	cusGender: string;
	cusContact: string;
	cusPhone: string;
	cusMobile: string;
	cusEmail: string;
	cusFax: string;
	cusAddrLocation: number | null;
	cusAddrStreetLine1: string;
	cusAddrStreetLine2: string;
	cusAddrStreetLine3: string;
	cusAddrStreetLine4: string;
	cusAddrCity: string;
	cusAddrState: string;
	cusAddrPostcode: string;
	cusAddrCountry: string;
	cusAddrPhone1: string;
	cusAddrPhone2: string;
	cusAddrPhone3: string;
	cusAddrFax: string;
	cusAddrWeb: string;
	cusPriceLevel: string;
	cusPriceLevelID: string;
	cusPointsSoFar: number | null;
	cusPointsActive: number | null;
	cusPointsUsed: number | null;
	CreateBy: string;
	CreateTimeDisplay: string;
	ModifyBy: string;
	ModifyTimeDisplay: string | null;
	DeleteTimeDisplay: string | null;
	cusCheckout: boolean;
	SalesPerson: ISalesman;
	NameDisplay: string;
	FrmEnquiry: boolean;
	SelectedType: string | null;
	Attributes: Array<IAttribute>;
	AttributeList: Array<IAttribute>;
	JsonDefaultAttrVals: {};
	OverWrite: boolean; //for adding from enquiry
	JsonAttributeList: string;
	IsActive: number;
	IsOrganization: string;
	cusEblastSubscribed: boolean;
	UnsubscribeTimeDisplay: string | null;
	Organization: string | null;
}
let attribute: IAttribute;
let intervalHandler;
let checkpass = false;

let roleTypes: Array<RoleType> = [];
enum RoleType {
	SuperAdmin = 1,
	Admin = 2,
	CRMAdmin = 3,
	CRMSalesManager = 5,
	SalesPerson = 6,
	CRMSalesPerson = 7,
}

let assignedenquiries: Array<IEnquiry> = [];
let assignedcontacts: Array<IContact> = [];
let selectedSalesmanId: number;
let selectedContactId: number;
let DicHotListCustomers: { [Key: number]: string[] } = {};
let DicEblastCustomers: { [Key: number]: string[] } = {};
let CurrentEblastId: number;
let stock: string;
enum RespondType {
	Approve = 1,
	Reject = 2,
	PassToManager = 3,
}
interface ISimpleSales {
	Currency: string;
	NextSalesCode: string;
	authcode: string;
	Roundings: number | null;
	Change: number | null;
	SalesDateDisplay: string;
	SettleDateDisplay: string;
	salescode: string;
	rtsUID: number;
	rtsCusID: number;
	rtsLineTotalPlusTax: number | null;
	rtsFinalDiscAmt: number | null;
	rtsRmks: string;
	rtsExRate: number;
	rtsAllLoc: boolean;
	rtsInternalRmks: string;
	rtsEpay: boolean;
	rtsFinalTotal: number | null;
	rtsDate: string;
	rtsSettleDate: string | null;
	rtsType: string;
	rtsCode: string;
	rtsStatus: string;
	rtsSalesLoc: string;
	rtsDvc: string;
	rtsCurrency: string;
	rtsRefCode: string;
	PayAmt: number;
	ServiceChargePercent: number;
	ServiceChargeAmt: number;
}
interface ISimpleSalesLn {
	rtlUID: number;
	rtlSalesLoc: string;
	rtlDvc: string;
	rtlCode: string;
	rtlDate: string | null;
	rtlSeq: number | null;
	rtlRefSales: string;
	rtlReasonCode: string;
	rtlItemCode: string;
	rtlDesc: string;
	rtlBaseUnit: string;
	rtlStockLoc: string;
	rtlItemColor: string;
	rtIsConsignIn: boolean | null;
	rtlIsConsignOut: boolean | null;
	rtlIsNoCharge: boolean | null;
	rtlSnReusable: boolean | null;
	rtlTaxCode: string;
	rtlTaxPc: number | null;
	rtlSellUnit: string;
	rtlRrpTaxIncl: number | null;
	rtlRrpTaxExcl: number | null;
	rtlLineDiscAmt: number | null;
	rtlLineDiscPc: number | null;
	rtlDiscSpreadPc: number | null;
	rtlTaxAmt: number | null;
	rtlSalesAmt: number | null;
	rtlQty: number | null;
	rtlBatch: string;
	rtlValidThru: string;
	rtlHasSn: boolean | null;
	rtlSn: string;
	rtlIndex1: number | null;
	rtlIndex2: number | null;
	rtlType: string;
	rtlSellingPrice: number | null;
	rtlSellingPriceMinusInclTax: number | null;
	comboIvId: string;
	vtdelIds: string;
	batdelIds: string;
	ivIdList: string;
	JobID: number | null;
	rtsInternalRmks: string;
	rtsEpay: boolean;
	rtsCusID: number;
	rtsRmks: string;
	Item: ISimpleItem;
	DelItems: IDeliveryItem[];
	SalesDateDisplay: string;
	JsValidThru: string | null;
	batchList: IBatch[];
	rtpPayAmt: number | null;
	DepositAmtDisplay: string | null;
	rtpPayType: string | null;
	rtpExRate: number | null;
	itmName: string;
	itmDesc: string;
	itmUseDesc: boolean | null;
	itmNameDesc: string;
	itmCode: string;
	itmTaxPc: number | null;
	itmBaseUnit: string | null;
	itmSellUnit: string | null;
	itmBaseSellingPrice: number | null;
	itmLastSellingPrice: number | null;
	SalesPersonName: string | null;
	itmIsTaxedWhenSold: boolean;
	rtlNote: string | null;
}
interface ISaleOrder {
	rtsUID: number;
	rtsSalesLoc: string;
	rtsDvc: string;
	rtsCode: string;
	rtsRefCode: string;
	rtsType: string;
	rtsStatus: string;
	rtsDate: string;
	rtsTime: string;
	rtsCusID: number;
	rtsCusMbr: string;
	rtsLineTotal: number | null;
	rtsLineTotalPlusTax: number | null;
	rtsFinalDisc: number | null;
	rtsFinalDiscAmt: number | null;
	rtsFinalAdj: number | null;
	rtsFinalTotal: number | null;
	rtsRmks: string;
	rtsRmksOnDoc: string;
	rtsCarRegNo: string;
	rtsUpldBy: string;
	rtsUpldTime: string | null;
	rtsUpLdLog: string;
	rtsInternalRmks: string;
	rtsMonthBase: boolean;
	rtsLineTaxAmt: number | null;
	rtsEpay: boolean;
	rtsKInvoiceId: number | null;
	rtsKInvoiceCode: string;
	rtsDeliveryAddress1: string;
	rtsDeliveryAddress2: string;
	rtsDeliveryAddress3: string;
	rtsDeliveryAddress4: string;
	rtsReviewUrl: string;
	rtsSendNotification: boolean;
	rtsCheckout: boolean;
	rtsCheckoutPortal: string;
	rtsCreateBy: string;
	rtsCreateTime: string;
	rtsModifyBy: string;
	rtsModifyTime: string | null;
	rtsParentUID: number | null;
	Customer: ICustomer;
	SalesLnViews: Array<ISalesLn>;
	PayLnViews: Array<IPayLn>;
	PaymentTypes: Array<IPayType>;
	DicPayTypes: Array<typeof DicPayType>;
	rtsDeliveryAddressId: number | null;
	DeliveryDateDisplay: string;
	rtsCustomerPO: string;
	KSalesmanCode: string | null;
	rtsSpecialApproval: boolean;
	rtsGiftOption: number;
}
interface IPayServiceCharge {
	PayCode: string;
	Selected: boolean;
	//Added: boolean;
	Percentage: number;
}
let DicPayType: { [Key: string]: string } = {};
let DicItemSNs: { [Key: string]: Array<ISerialNo> } = {};
let DicPayServiceCharge: { [Key: string]: IPayServiceCharge } = {};
let DicPayTypesChecked: { [Key: string]: boolean } = {};
interface IPreSales {
	rtsCusCode: string;
	rtsServiceChargeAmt: number;
	rtsServiceChargePc: number;
	Currency: string;
	NextSalesCode: string;
	authcode: string;
	TotalRemainAmt: number | null;
	PayAmt: number;
	SalesDateDisplay: string;
	SettleDateDisplay: string;
	salescode: string;
	rtsUID: number;
	rtsLineTotalPlusTax: number | null;
	rtsFinalDiscAmt: number | null;
	rtsRmks: string;
	rtsExRate: number;
	rtsAllLoc: boolean;
	rtsInternalRmks: string;
	rtsEpay: boolean;
	rtsFinalTotal: number | null;
	rtsDate: string;
	rtsSettleDate: string | null;
	rtsType: string;
	rtsCode: string;
	rtsStatus: string;
	rtsSalesLoc: string;
	rtsDvc: string;
	rtsCurrency: string;
	rtsRefCode: string | null;
}

//for debug use only
interface IPreSalesLn1 {
	rtlUID: number;
	rtlSalesLoc: string;
	rtlCode: string;
	rtlSeq: number | null;
	rtlItemCode: string;
	rtlDesc: string;
	rtlStockLoc: string;
	rtlHasSn: boolean;
	rtlTaxPc: number | null;
	rtlLineDiscPc: number | null;
	rtlQty: number | null;
	rtlSalesAmt: number | null;
	rtlSellingPrice: number | null;
	JobID: number | null;
	rtsUID: number;
	rtsSalesLoc: string;
	rtsDvc: string;
	rtsCode: string;
	rtsRefCode: string;
	rtsType: string;
	rtsStatus: string;
	rtsDate: string;
	rtsCusID: number;
	rtsLineTotalPlusTax: number | null;
	rtsFinalDisc: number | null;
	rtsFinalDiscAmt: number | null;
	rtsFinalTotal: number | null;
	rtsUpldBy: string;
	rtsUpldTime: string | null;
	rtsMonthBase: boolean;
	rtsEpay: boolean;
	rtsReviewUrl: string;
	rtsSendNotification: boolean;
	rtsCheckout: boolean;
	rtsCheckoutPortal: string;
	rtsTime: string;
	rtsRmks: string;
	rtsInternalRmks: string;
	JsValidThru: string;
	cusCode: string;
	itmName: string;
	itmDesc: string;
	itmNameDesc: string;
	itmItemID: number;
	itmUseDesc: boolean;
	itmTaxPc: number | null;
	itmBaseUnit: string;
	itmSellUnit: string;
	itmLastSellingPrice: number | null;
	itmBaseSellingPrice: number;
	rtpPayAmt: number | null;
	rtpPayType: string;
	rtpExRate: number | null;
	cusName: string;
	SalesPersonName: string;
	itmIsTaxedWhenSold: boolean;
	lstQtyAvailable: number;
}
interface IPreSalesLn {
	rtlUID: number;
	rtlSalesLoc: string;
	rtlCode: string;
	rtlSeq: number | null;
	rtlItemCode: string;
	rtlDesc: string;
	rtlStockLoc: string;
	rtlHasSn: boolean;
	rtlTaxPc: number | null;
	rtlLineDiscPc: number | null;
	rtlQty: number | null;
	rtlSalesAmt: number | null;
	rtlSellingPrice: number | null;
	JobID: number | null;
	rtsUID: number;
	rtsSalesLoc: string;
	rtsDvc: string;
	rtsCode: string;
	rtsRefCode: string;
	rtsType: string;
	rtsStatus: string;
	rtsDate: string;
	rtsCusID: number;
	rtsLineTotalPlusTax: number | null;
	rtsFinalDisc: number | null;
	rtsFinalDiscAmt: number | null;
	rtsFinalTotal: number | null;
	rtsUpldBy: string;
	rtsUpldTime: string | null;
	rtsMonthBase: boolean;
	rtsEpay: boolean;
	rtsReviewUrl: string;
	rtsSendNotification: boolean;
	rtsCheckout: boolean;
	rtsCheckoutPortal: string;
	rtsTime: string;
	rtsRmks: string;
	rtsInternalRmks: string;
	JsValidThru: string;
	cusCode: string;
	ItemVariList: IItemVariation[];
	itmName: string;
	itmDesc: string;
	itmNameDesc: string;
	itmItemID: number;
	itmUseDesc: boolean;
	itmTaxPc: number | null;
	itmBaseUnit: string;
	itmSellUnit: string;
	itmLastSellingPrice: number | null;
	itmBaseSellingPrice: number;
	rtpPayAmt: number | null;
	rtpPayType: string;
	rtpExRate: number | null;
	cusName: string;
	SalesPersonName: string;
	Item: ISimpleItem;
	itmIsTaxedWhenSold: boolean;
	lstQtyAvailable: number;
}
interface ISalesLn {
	SettleDateDisplay: string;
	rtlUID: number;
	rtlSalesLoc: string;
	rtlDvc: string;
	rtlCode: string;
	rtlDate: string | null;
	rtlSeq: number | null;
	rtlRefSales: string;
	rtlReasonCode: string;
	rtlItemCode: string;
	rtlDesc: string;
	rtlStockLoc: string;
	rtlChkBch: boolean | null;
	rtlBatchCode: string;
	rtlItemColor: string;
	rtIsConsignIn: boolean | null;
	rtlIsConsignOut: boolean | null;
	rtlIsNoCharge: boolean | null;
	rtlHasSerialNo: boolean | null;
	rtlHasSn: boolean | null;
	rtlChkSn: boolean | null;
	rtlSnReusable: boolean | null;
	rtlTaxCode: string;
	rtlTaxPc: number | null;
	rtlSellUnit: string;
	rtlRrpTaxIncl: number | null;
	rtlRrpTaxExcl: number | null;
	rtlLineDiscAmt: number | null;
	rtlLineDiscPc: number | null;
	rtlDiscSpreadPc: number | null;
	rtlQty: number | null;
	rtlTaxAmt: number | null;
	rtlSalesAmt: number | null;
	rtlIndex1: number | null;
	rtlIndex2: number | null;
	rtlType: string;
	rtlSellingPrice: number | null;
	rtlCheckout: boolean | null;
	rtlSellingPriceMinusInclTax: number | null;
	rtlParentUID: number | null;
	Item: IItem;
	DelItems: IDeliveryItem[];
	SalesDateDisplay: string;
	DepositAmt: number | null;
	JsValidThru: string | null;
	dlCode: string | null;
	ivIdList: string | null;
	SelectedIvList: IItemVariation[];
	DicItemSNs: Array<typeof DicItemSNs>;
	JobID: number | null;
	itemVariList: IPoItemVari[];
	batchList: IBatch[];
}
interface IPayLn {
	Id: number;
	payId: number;
	pmtCode: string;
	amount: number;
	amtReceived: number | null;
	rtplSalesLoc: string;
	rtplDvc: string;
	rtplCode: string;
	rtplDate: string | null;
	rtplTime: string | null;
	rtplParentId: number | null;
}
interface ISysUser {
	RoleIds: number[];
	surUID: number;
	surIsActive: boolean;
	Password: string;
	UserCode: string;
	UserName: string;
	DisplayName: string;
	dvcCode: string;
	shopCode: string;
	UserRole: string;
	FirstName: string;
	LastName: string;
	Email: string;
	dvcIP: string;
	surNetworkName: string;
	ManagerId: number;
	surDesc: string | null;
	surNotes: string | null;
	surScope: string;
	surIsAbss: boolean;
	abssCardID: string;
	CustomerList: Array<ICustomer>;
	Phone: string | null;
	ManagerName: string | null;
	FuncCodes: string[];
	checkpass: boolean;
}

let salesmen: ISalesman[] = [];
let selectedPosSalesmanCode: string = "";

let DicCrmSalesGroupMembers: { [Key: number]: Array<number> } = {};
let DicCrmSalesManager: { [Key: string]: number } = {};
let DicCrmGroupSalesmen: { [Key: string]: Array<ISalesman> } = {};
interface ISelectListItem {
	Disabled: boolean;
	Selected: boolean;
	Text: string;
	Value: string;
}

interface IPurchase {
	Id: number;
	pstCode: string;
	supCode: string;
	pstSupplierInvoice: string;
	pstSalesLoc: string;
	pstRemark: string;
	pstPurchaseDate: Date;
	PurchaseItems: Array<IPurchaseItem>;
	ReturnItems: Array<IReturnItem>;
	PSCodeDisplay: string;
	PurchaseDateDisplay: string;
	pstStatus: string;
	pstPromisedDate: Date | null;
	PromisedDateDisplay: string;
	JsPurchaseDate: string;
	JsPromisedDate: string;
	pstCurrency: string;
	pstExRate: number;
	pstAllLoc: boolean;
	pstAmount: number;
	pstPartialAmt: number | null;
	UploadFileList: string[];
	ImgList: string[];
	FileList: string[];
}

interface IPurchaseItem {
	pstId: number;
	pstCode: string;
	itmCode: string;
	piSeq: number;
	piBaseUnit: string;
	piQty: number;
	batchList: Array<IBatch>;
	piHasSN: boolean;
	piValidThru: Date | null;
	piUnitPrice: number;
	piDiscPc: number | null;
	piTaxPc: number | null;
	piTaxAmt: number | null;
	piAmt: number;
	piAmtPlusTax: number;
	piReceivedQty: number;
	piStatus: string;
	itmName: string;
	itmDesc: string;
	itmUseDesc: boolean;
	itmNameDesc: string;
	ValidThruDisplay: string;
	JsValidThru: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	snbatseqvtlist: Array<ISnBatSeqVt>;
	SerialNoList: Array<ISerialNo>;
	returnedQty: number;
	returnableQty: number;
	qtyToReturn: number;
	pstPurchaseDate: Date;
	PurchaseDateDisplay: string;
	piStockLoc: string;
	JobID: number | null;
	vtList: IValidThru[];
	comboIvId: string | null;
	SelectedIvList: IItemVariation[];
	hasSelectedIvs: boolean;
	singleProId: number | null;
	poItemVariList: IPoItemVari[];
	ivBatCode: string | null;
	Item: IItem;
}
interface IReturnItem extends IPurchaseItem {
	pstReturnDate: Date;
	ReturnDateDisplay: string;
}
let ReturnableItemList: Array<IPurchaseItem> = [];
let copiedItem: IItem;
let itemPromotion: IItemPromotion | null;
let isPromotion: boolean = false;
let selectedProId: number = 0;
interface ISeqSnsVts {
	seq: number;
	snvtList: ISnVt[];
}
let SeqSnsVtsList: ISeqSnsVts[] = [];
let chksnvtchange: boolean = false;
let batchidx = 0;
let snidx = 0;
let vtidx = 0;
interface ISupplier {
	CityTxt: string | null;
	CountryTxt: string | null;
	supId: number;
	supAbss: boolean;
	supIsActive: boolean;
	supIsIndividual: boolean;
	supCode: string;
	supName: string;
	supTitle: string;
	supFirstName: string;
	supLastName: string;
	supGender: string;
	supPhone: string;
	supMobile: string;
	supEmail: string;
	supNotes: string;
	supContact: string | null;
	supCardRecordID: number | null;
	supIdentifierID: string;
	supCustomField1: string;
	supCustomField2: string;
	supCustomField3: string;
	supAddrLocation: number | null;
	supAddrStreetLine1: string;
	supAddrStreetLine2: string;
	supAddrStreetLine3: string;
	supAddrStreetLine4: string;
	supAddrCity: string;
	supAddrState: string;
	supAddrPostcode: string;
	supAddrCountry: string;
	supAddrPhone1: string;
	supAddrPhone2: string;
	supAddrPhone3: string;
	supAddrFax: string;
	supAddrWeb: string;
	supCheckout: boolean | null;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	supPhone1Whatsapp: boolean | null;
	supPhone2Whatsapp: boolean | null;
	supPhone3Whatsapp: boolean | null;
	isABSS: boolean | null;
	TaxPercentageRate: number | null;
	ExchangeRate: number | null;
	JobList: IMyobJob[];
	UploadFileList: string[];
}
interface IStockIn {
	Id: number;
	pstCode: string;
	stCode: string;
	supCode: string;
	stLocStock: string;
	stStatus: string;
	stCurrency: string;
	stExRate: number;
	stRemark: string;
	AccountProfileId: number;
	CompanyId: number;
	CreatedBy: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string;
	StockInItems: Array<IStockInItem>;
	STCodeDisplay: string;
	DicExRate: { [Key: string]: number };
	stStockInDate: Date;
	StockInDateDisplay: string;
	JsStockInDate: string;
}
let SelectedSupplier: ISupplier;

interface IStockInItem {
	CompanyId: number;
	AccountProfileId: number;
	stCode: string;
	siSeq: number;
	itmCode: string;
	siBaseUnit: string;
	siQty: number;
	siBatch: string;
	siHasSN: boolean;
	siValidThru: Date | null;
	ValidThruDisplay: string;
	siUnitCost: number;
	siAmt: number;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	itmName: string;
	itmUseDesc: boolean;
	itmDesc: string;
	itmNameDesc: string;
	stLocStock: string;
	SerialNoList: Array<IStockInItemSerialNo>;
	snlist: string[];
	JsValidThru: string;
}
let Purchase: IPurchase;
let WholeSales: IWholeSales;
let DicExList: { [Key: string]: number } = {};
let exRate: number = 1;
let StockIn: IStockIn;
let stockitem: IStockInItem;
let stockitemlist: Array<IStockInItem> = [];
interface IStockInItemSerialNo {
	snoItemCode: string;
	snoCode: string;
}
let enablebuysellunits: boolean = false;
let forrefund: boolean = false;
let forreturn: boolean = false;
let returnLns: Array<IReturnItem> = [];
let gFrmId: string;

let StockTransferList: Array<IStockTransfer> = [];
let DicStockTransferList: { [Key: string]: Array<IStockTransfer> } = {};
interface IDistinctItem {
	itemCode: string;
	itemName: string;
	itemDesc: string;
	isNonStock: boolean;
	itemTaxRate: number;
	itemSupCode: string;
	nameDescTxt: string;
}
let DicLocItemList: { [Key: string]: IDistinctItem[] } = {};
let checkmat = false;
let setexpirydateMark: boolean = false;
interface IStockTransfer {
	Id: number;
	tmpId: string | null;
	stCode: string;
	stSender: string;
	stReceiver: string;
	itmCode: string;
	itmNameDesc?: string;
	inQty: number;
	outQty: number;
	stCounted?: number;
	stVariance: number;
	stSignedUp_Sender: boolean;
	stSignedUp_Receiver: boolean;
	stShop: string | null;
	stDate: Date;
	stRemark: string | null;
	stChecked: boolean;
	poIvId: string | null;
	ivIdList: string | null;
	CreateTime: Date;
	ModifyTime: Date;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string;
}
let $promisedDateDisplay: JQuery;
let $purchaseDateDisplay: JQuery;
let DicCurrencyExRate: { [Key: string]: number } = {};
let DicCurrencySym: { [Key: string]: string } = { "HKD": "$", "GBP": "£", "USD": "$", "CNY": "¥", "EUR": "€" };
let forwholesales: boolean = false;
let fordelivery: boolean = false;

interface IWholeSales {
	wsUID: number;
	wsSalesLoc: string;
	wsDvc: string;
	wsCode: string;
	wsRefCode: string;
	wsType: string;
	wsStatus: string;
	wsCusID: number | null;
	wsCusCode: string | null;
	wsCusMbr: string;
	wsLineTotal: number | null;
	wsLineTotalPlusTax: number | null;
	wsFinalDisc: number | null;
	wsFinalDiscAmt: number | null;
	wsFinalAdj: number | null;
	wsFinalTotal: number | null;
	wsRemark: string;
	wsRmksOnDoc: string;
	wsCarRegNo: string;
	wsUpldBy: string;
	wsUpldTime: string | null;
	wsUpLdLog: string;
	wsInternalRmks: string;
	wsMonthBase: boolean;
	wsLineTaxAmt: number | null;
	wsDeliveryAddressId: number | null;
	wsDeliveryAddress1: string;
	wsDeliveryAddress2: string;
	wsDeliveryAddress3: string;
	wsDeliveryAddress4: string;
	wsCustomerPO: string;
	wsDeliveryDate: string | null;
	DeliveryDateDisplay: string | null;
	JsDeliveryDate: string | null;
	wsReturnDate: string | null;
	wsCurrency: string;
	wsExRate: number | null;
	wsCustomerTerms: string | null;
	JsWholesalesDate: string;
	WsDateDisplay: string;
	WsTimeDisplay: string;
	wsDate: Date;
	wsAllLoc: boolean;
	wsChkManualDelAddr: boolean;
	Customer: ICustomer;
	CustomerName: string | null;
	TrimmedRemark: string | null;
	UploadFileList: string[];
	FileList: string[];
	ImgList: string[];
}
let WholeSalesLns: IWholeSalesLn[] = [];

interface IWholeSalesLn {
	wslUID: number;
	wslSalesLoc: string;
	wslDvc: string;
	wslCode: string;
	wslDate: string | null;
	wslSeq: number | null;
	wslRefSales: string;
	wslReasonCode: string;
	wslItemCode: string;
	wslDesc: string;
	wslStockLoc: string;
	wslChkBch: boolean | null;
	wslBatchCode: string;
	wslHasSerialNo: boolean | null;
	wslHasSn: boolean | null;
	wslChkSn: boolean | null;
	wslSnReusable: boolean | null;
	wslTaxCode: string;
	wslTaxPc: number | null;
	wslSellUnit: string;
	wslLineDiscAmt: number | null;
	wslLineDiscPc: number | null;
	wslDiscSpreadPc: number | null;
	wslQty: number | null;
	wslDelQty: number | null;
	wslTaxAmt: number | null;
	wslSalesAmt: number | null;
	wslType: string;
	wslSellingPrice: number | null;
	wslSellingPriceMinusInclTax: number | null;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	wslStatus: string;
	itmName: string;
	itmNameDesc: string;
	snbvlist: IBatSnVt[];
	SerialNoList: Array<ISerialNo>;
	wslValidThru: Date | null;
	ValidThruDisplay: string | null;
	JsValidThru: string | null;
	snoUID: number | null;
	snvtList: Array<ISnVt>;
	MissingItemOptions: boolean;
	Item: IItem;
	JobID: number | null;
	comboIvId: string | null;
	SelectedIvList: IItemVariation[];
	ivIdList: string | null;
	itemVariList: IPoItemVari[];
}

interface IWholeSalesReturnItem extends IWholeSalesLn {
	wsCode: string;
	wsReturnDate: string | null;
	ReturnDateDisplay: string;
	SalesDateDisplay: string;
}

interface IDevice {
	dvcUID: number;
	dvcIsActive: boolean;
	dvcCode: string;
	dvcShop: string;
	dvcNextRtlSalesNo: number;
	dvcNextRefundNo: number;
	dvcNextDepositNo: number;
	dvcNextPurchaseNo: number;
	dvcNextPsReturnNo: number;
	dvcNextWholeSalesNo: number;
	dvcNextWsReturnNo: number;
	dvcNextRtlSalesNoHold: number | null;
	dvcNextRtlQuoNo: number | null;
	dvcNextSessionNo: number | null;
	dvcName: string;
	dvcShopName: string;
	dvcLastDataChange: string | null;
	dvcOpStatus: string;
	dvcStockLoc: string;
	dvcPicPath: string;
	dvcMyoDat: string;
	dvcMyoExe: string;
	dvcMyoVer: string;
	dvcXlsPath: string;
	dvcTicketPrinter: string;
	dvcA4Printer: string;
	dvcDisplayPoleConnTo: string;
	dvcDisplayPolePort: string;
	dvcCashDrawerConnTo: string;
	dvcCashDrawerPort: string;
	dvcReceiptPrinter: string;
	dvcDayEndPrinter: string;
	dvcReceiptCopiesCash: number | null;
	dvcReceiptCopiesNonCash: number | null;
	dvcDefaultCusSales: string;
	dvcDefaultCusRefund: string;
	dvcWcpTermID: string;
	dvcRmks: string;
	dvcShopInfo: string;
	dvcPageHead: string;
	dvcPageFoot: string;
	dvcRtlSalesCode: string;
	dvcRtlRefundCode: string;
	dvcPurchasePrefix: string;
	dvcPsReturnCode: string;
	dvcWholesalesPrefix: string;
	dvcWsReturnCode: string;
	dvcRtlSalesInitNo: string;
	dvcRtlRefundInitNo: string;
	dvcPurchaseInitNo: string;
	dvcPsReturnInitNo: string;
	dvcWholeSalesInitNo: string;
	dvcWsReturnInitNo: string;
	dvcCreateBy: string;
	dvcCreateTime: string | null;
	dvcModifyBy: string;
	dvcModifyTime: string | null;
	dvcLockBy: string;
	dvcLockTime: string | null;
	dvcIP: string;
	dvcInvoicePrefix: string;
	dvcRefundPrefix: string;
	accountNo: number | null;
	accountProfileId: number;
	companyId: number;
	dvcNextTransferNo: number;
	dvcTransferCode: string;
}

let NonABSS: boolean = $("#checkoutportal").val() === "nonabss";
let shops: string[] = [];
let devices: string[] = [];
let DicLocQty: { [Key: string]: number } = {};
let DicItemLocQty: { [Key: string]: Array<ILocQty> } = {};
let EditItem: boolean = false;
let wholesaleslns: IWholeSalesLn[] = [];
let wholesaleslnswosn: IWholeSalesLn[] = [];

let DicItemBatch: { [Key: string]: string[] } = {};
let SerialNoWoBatchList: string[] = [];

interface IPoBatVQ extends IBatchVQ {
	pocode: string;
}

let PoItemBatVQList: IPoItemBatVQ[] = [];


interface IPoItemBatVQ extends IItemBatchVQ {
	id: string;
	pocode: string;
}


interface IItemBatchVQ extends IBatchVQ {
	itemcode: string;
}

let DicItemBatchQty: { [Key: string]: Array<IBatchQty> } = {};


interface IBatchVQ {
	batchcode: string;
	vt: string | null;
	batchqty: number;
}


interface IBatchQty {
	batcode: string;
	batqty: number;
	sellableqty: number;
	itemcode: string;
	delqty: number | null;
	seq: number | null;
	batId: number;
	pocode: string;
}


interface IBatchVtQty {
	batchcode: string;
	validthru: string;
	batchqty: number;
}
interface IBatchVt {
	batchcode: string;
	validthru: string;
}
let DicSerialNoValidThru: { [Key: string]: string } = {};


interface IPoItemQtyValidThru {
	PoCode: string;
	ItemCode: string;
	TotalQty: number;
	LnQty: number;
	ValidThru: string | null;
}
let DicBatchPoItemQtyValidThru: { [Key: string]: Array<IPoItemQtyValidThru> } =
	{};


interface IValidThruBatchSn {
	ValidThru: string | null;
	Batch: string | null;
	SN: string | null;
}
let DicItemValidThruBatchSn: { [Key: string]: Array<IValidThruBatchSn> } = {};

let vtqtyList: Array<IVtQty> = [];

interface IVtQty {
	vtId: number;
	vt: string;
	delqty: number;
	qty: number;
	pocode: string;
	vtseq: number;
	itemcode: string | number;
	sellableqty: number;
	// vtId: number;
}

interface IVtDelQty {
	vtId: number;
	vt: string;
	delqty: number;
	pocode: string;
	seq: number;
	itemcode: string | number;
	vtdelId: number;
}
let DicItemVtQtyList: { [Key: string]: Array<IVtQty> } = {};
let DicItemVtDelQtyList: { [Key: string]: Array<IVtDelQty> } = {};
interface IValidThru {
	Id: number;
	vtSeq: number | null;
	vtValidThru: string | null;
	vtItemCode: string;
	vtStockInCode: string;
	vtQty: number | null;
	vtStatus: string;
	vtdelQty: number | null;
	vtStockOutCode: string;
	PoValidThru: string | null;
	SnValidThru: string | null;
	ValidThruDisplay: string | null;
}

let DicBatchQty: { [Key: string]: number } = {};
let DicPoBatchQty: { [Key: string]: typeof DicBatchQty } = {};

let PoItemBatchVQtyList: Array<IPoItemBatchVQty> = [];
interface IPoItemBatchVQty {
	PoCode: string;
	ItemCode: string;
	Batch: string | null;
	ValidThru: string | null;
	Qty: number;
}
interface IDeliveryItem {
	Id: number;
	CompanyId: number;
	AccountProfileId: number;
	dlCode: string;
	seq: number | null;
	batseq: number | null;
	snseq: number | null;
	vtseq: number | null;
	ivseq: number | null;
	dlStatus: string;
	itmCode: string;
	itmNameDesc: string | null;
	snlist: string[];
	dlBaseUnit: string;
	dlQty: number;
	dlBatch: string;
	dlHasSN: boolean;
	dlValidThru: Date | null;
	VtDisplay: string | null;
	JsVt: string | null;
	dlIvId: string | null;
	dlUnitPrice: number;
	dlDiscPc: number | null;
	dlTaxPc: number | null;
	dlTaxAmt: number | null;
	dlAmt: number;
	dlAmtPlusTax: number | null;
	pstCode: string | null;
	snoCode: string | null;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	currentbdq: number;
	newbdq: number;
	batqty: number;
	snvtlist: Array<ISnVt>;
	vttotalqty: number;
	newvtqty: number;
	vtdelqty: number;
	currentvdq: number;
	dlBatId: number | null;
	dlVtId: number | null;
	dlStockLoc: string;
	JobID: number | null;
	ivIdList: string | null;
	ivList: IPoItemVari[];
}
let DeliveryItems: Array<IDeliveryItem> = [];

interface IItemOptions {
	ChkBatch: boolean;
	ChkSN: boolean;
	WillExpire: boolean;
	Disabled: boolean;
}
let itemOptions: IItemOptions | null;
let DicItemOptions: { [Key: string | number]: IItemOptions } = {};


interface ISnVtPo extends ISnVt {
	pocode: string;
}
let DicItemSnos: { [Key: string]: string[] } = {};
let DicItemBatSnVtList: { [Key: string]: { [Key: string]: Array<IBatSnVt> } } =
	{};
let posnseq: number = 0;
let posnvt: string = "";
let itemSeqSnBatSeqVtList: {
	[Key: string]: { [Key: string]: Array<ISnBatSeqVt> };
} = {};
interface IPoItemVari {
	Id: string;
	ivComboId: string;
	ivStockInCode: string;
	ivQty: number | null;
	ivStatus: string;
	seq: number | null;
	itmCode: string;
	itemID: number | null;
	JsIvIdList: number[];
	ivIdList: string | null;
	batCode: string | null;
	iaName: string | null;
	iaValue: string | null;
	JsIdList: string[];
}
interface IBatch {
	Id: number;
	batCode: string;
	batValidThru: Date | null;
	validthru: string | null;
	BatVtDisplay: string | null;
	batSeq: number | null;
	batItemCode: string;
	batStockInCode: string | null;
	batStockInDate: Date | null;
	JsStockDate: string | null;
	batQty: number;
	seq: number;
}
let deliveryItem: IDeliveryItem | null;
let deliveryQty: number = 0;
interface IJsStock {
	Id: string;
	itmCode: string;
	LocCode: string;
	Qty: number;
}

let snvtlist: ISnVt[] = [];
let dicItemVtQty: { [Key: string]: Array<IVtQty> } = {};
let DicItemSnVtList: { [Key: string]: Array<ISnVt> } = {};
let DicSeqDeliveryItems: { [Key: number]: IDeliveryItem[] } = {};
let forproview: boolean = false;
class ItemEditFrm extends SimpleForm {
	constructor(edit) {
		super(edit);
		this.edit = edit;
	}

	validform(): boolean {
		let msg = "";

		if (ItemVari) {
			populateItemVari();
		} else {
			populateSelectedItem();
			console.log("selectedItem:", selectedItem);
		}

		let $itemcode = $("#itmCode");
		//let itemcode = <string>$itemcode.val();
		if (selectedItem!.itmCode === "") {
			msg += itemcoderequired + "<br>";
			$itemcode.addClass("focus");
		} else {
			if (!editmode) {
				if (phonelist.includes(selectedItem!.itmCode)) {
					msg += itemcodeduplicatederr + "<br>";
					$itemcode.addClass("focus");
				}
			}
		}

		let $itemname = $("#itmName");
		if (selectedItem!.itmName === "") {
			msg += itemnamerequired + "<br>";
			$itemname.addClass("focus");
		}

		let $sellingprice = $("#BaseSellingPrice");
		if (selectedItem!.itmBaseSellingPrice == 0) {
			msg += sellingpricerequired + "<br>";
			$sellingprice.addClass("focus");
		}
		const $buyingcost = $("#BuyStdCost");
		if (selectedItem!.itmBuyStdCost == 0) {
			msg += buyingcostrequiredtxt + "<br>";
			$buyingcost.addClass("focus");
		}
		let $desc = $("#itmDesc");
		if (isreplacing) {
			if (selectedItem!.itmDesc == "") {
				msg += descriptionrequired + "<br>";
				$desc.addClass("focus");
			}
		}

		if (selectedItem && editmode) {
			let { stockqtyavailable, totallocqty } = getStockQtyAvailable4Item();
			// console.log("stockqtyavailable:" + stockqtyavailable);
			if (stockqtyavailable < totallocqty) {
				msg = stockqtynotenoughtxt;
			}
		}

		if (ItemVari) {
			let { stockqtyavailable, totallocqty } = getStockQtyAvailable4ItemVari();
			if (stockqtyavailable < totallocqty) {
				msg = stockqtynotenoughtxt;
			}
		}

		if (msg !== "") {
			$.fancyConfirm({
				title: "",
				message: msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						$(".focus:first").trigger("focus");
					}
				},
			});
		}
		return msg === "";
	}

	submitForm() {
		let url = !EditItem && ItemVariations.length > 0
			? "/Item/EditIV"
			: "/Item/Edit";
		let data = {};

		let returnurl = `/Item/${$infoblk.data("referrer")}`;
		if (ItemVari) {
			data = ItemAttrList
				? {
					Item: null,
					ItemVari,
					AttrList: ItemAttrList,
					__RequestVerificationToken: $(
						"input[name=__RequestVerificationToken]"
					).val(),
				}
				: {
					Item: null,
					ItemVari,
					__RequestVerificationToken: $(
						"input[name=__RequestVerificationToken]"
					).val(),
				};
		} else {

			if (!EditItem && ItemVariations.length > 0) {
				//console.log("here");
				data = ItemAttrList
					? {
						ItemVari: null,
						Item: selectedItem,
						AttrList: ItemAttrList,
						__RequestVerificationToken: $(
							"input[name=__RequestVerificationToken]"
						).val(),
					}
					: {
						ItemVari: null,
						Item: selectedItem,
						__RequestVerificationToken: $(
							"input[name=__RequestVerificationToken]"
						).val(),
					};
			} else {
				data = {
					model: selectedItem,
					__RequestVerificationToken: $(
						"input[name=__RequestVerificationToken]"
					).val(),
				};
			}
		}
		openWaitingModal();

		$.ajax({
			type: "POST",
			url: url,
			data: data,
			success: function (data) {
				if (data !== null) {
					window.location.href = returnurl;
				}
			},
			dataType: "json",
		});
	}
}
let filteredAccountList: Array<IAccount> = [];

interface IBatDelQty {
	batcode: string;
	batdelqty: number | null;
	batqty: number;
	seq: number | null;
	batId: number;
	batdelId: number;
	itemcode: string;
	pocode: string;
	batSn: string | null;
	batVt: string | null;
	VtDisplay: string | null;
	iaName: string | null;
	iaValue: string | null;
	ivIdList: string | null;
}

let DicItemBatDelQty: { [Key: string]: Array<IBatDelQty> } = {};
let DicLocation: { [Key: string]: string } = {};
interface IRtlSale {
	rtsUID: number;
	rtsSalesLoc: string;
	rtsDvc: string;
	rtsCode: string;
	rtsRefCode: string;
	rtsType: string;
	rtsStatus: string;
	rtsDate: string;
	rtsTime: string;
	rtsCusCode: string;
	rtsLineTotal: number | null;
	rtsLineTotalPlusTax: number | null;
	rtsFinalDisc: number | null;
	rtsFinalDiscAmt: number | null;
	rtsFinalAdj: number | null;
	rtsFinalTotal: number | null;
	rtsRmks: string;
	rtsRmksOnDoc: string;
	rtsUpldBy: string;
	rtsUpldTime: string | null;
	rtsUpLdLog: string;
	rtsInternalRmks: string;
	rtsMonthBase: boolean;
	rtsLineTaxAmt: number | null;
	rtsEpay: boolean;
	rtsDeliveryAddressId: number | null;
	rtsDeliveryAddress1: string;
	rtsDeliveryAddress2: string;
	rtsDeliveryAddress3: string;
	rtsDeliveryAddress4: string;
	rtsReviewUrl: string;
	rtsSendNotification: boolean;
	rtsCustomerPO: string;
	rtsDeliveryDate: string | null;
	rtsSaleComment: string;
	rtsCheckout: boolean;
	rtsCheckoutPortal: string;
	rtsParentUID: number | null;
	rtsExRate: number | null;
	rtsCurrency: string;
	rtsAllLoc: boolean;
}
let chkBatSnVtCount: number = 0;
interface ICustomerFollowUp {
	Id: number;
	CustomerID: number;
	AccountProfileId: number;
	CompanyId: number;
	CustomerCode: string;
	Content: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	CustomerName: string;
}
let ivdelqtychange: boolean = false;
let CustomerFollowUpList: ICustomerFollowUp[] = [];
interface IItemAttribute {
	Id: number;
	tmpId: string;
	itmCode: string | number;
	iaName: string;
	iaValue: string;
	iaShowOnSalesPage: boolean;
	iaUsed4Variation: boolean;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string;
}
let itemAttrTmpIds: string[] = [];
let ItemAttrList: IItemAttribute[] = [];
let separatedbytxt = separatedbyformat
	? separatedbyformat.replace("{0}", " | ")
	: "";
let ItemVariations: Array<IItemVariation> = [];
let SelectedIVList: Array<IItemVariation> = [];
interface IItemVariation {
	Id: number;
	iaId: number;
	iaName: string;
	iaValue: string;
	itmItemID: number;
	AaccountProfileId: number;
	CompanyId: number;
	itmCode: string;
	itmName: string;
	itmUseDesc: boolean;
	itmDesc: string;
	chkBat: boolean | null;
	chkSN: boolean | null;
	chkVT: boolean | null;
	itmWeight: number | null;
	itmLength: number | null;
	itmWidth: number | null;
	itmHeight: number | null;
	IncomeAccountID: number | null;
	ExpenseAccountID: number | null;
	InventoryAccountID: number | null;
	itmIsActive: boolean | null;
	itmSupCode: string;
	itmIsNonStock: boolean;
	itmIsBought: boolean;
	itmIsSold: boolean;
	itmValidThru: string | null;
	itmTaxCode: string;
	itmTaxPc: number | null;
	itmBaseUnit: string;
	itmBuyUnit: string;
	itmSellUnit: string;
	itmTaxExcl: number | null;
	itmTaxIncl: number | null;
	itmBaseSellingPrice: number | null;
	itmLastSellingPrice: number | null;
	itmSellUnitQuantity: number | null;
	itmIsTaxedWhenSold: boolean | null;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	itmCheckout: boolean;
	AttrList: Array<IItemAttribute>;
	SelectedAttrList4V: IItemAttribute[];
	PLA: number;
	PLB: number;
	PLC: number;
	PLD: number;
	PLE: number;
	PLF: number;
	DicLocQty: { [Key: string]: number };
	DicIvNameValList: { [Key: string]: string };
	IsModifyAttr: boolean;
	NameDesc: string;
	itmBuyStdCost: number;
	ItemPromotions: IItemPromotion[];
	QtySellable: number;
}
let ItemVari: IItemVariation | null;

let DicItemAttrList: { [Key: string]: IItemAttribute[] } = {};

let DicItemVariations: { [Key: string]: IItemVariation[] } = {};
let DicItemGroupedVariations: { [Key: string]: typeof DicItemVariations } = {};

let DicItemVari: { [Key: string]: IItemVariation } = {};
let DicIVLocQty: { [Key: string]: number };
let currencyReferrer: string;
let currencyCode: string = "HKD";
let DicOriCards: { [Key: string]: string } = {};
let DicFilteredCards: { [Key: string]: string } = {};

let Category: ICategory;
interface ICategory {
	Id: number;
	catName: string;
	catDesc: string;
	catNameTC: string;
	catDescTC: string;
	catNameSC: string;
	catDescSC: string;
	displayOrder: number;
	Removable: boolean;
}
let $salecomment = $("#cusSaleComment");

let promotion: IPromotion;
interface IPromotion {
	Id: number;
	proName: string;
	proDesc: string;
	proNameTC: string | null;
	proDescTC: string | null;
	proNameSC: string | null;
	proDescSC: string | null;
	pro4Period: boolean;
	JsDateFrm: string | null;
	JsDateTo: string | null;
	proPrice: number | null;
	proQty: number | null;
	proDiscPc: number;
	IsObsolete: boolean;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
}

let itemPeriodPromotion: IItemPeriodPromotion;

interface IItemPeriodPromotion {
	// Id: number;
	proId: number;
	itemCode: string;
	itemCodes: string[];
	proNameDisplay: string;
	proDescDisplay: string;
	JsDateFrm: string;
	JsDateTo: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	ipIds: string;
	DicPromotionItems: { [Key: string]: string[] };
}

let itemQtyPromotion: IItemQtyPromotion;

interface IItemQtyPromotion {
	// Id: number;
	proId: number;
	itemCode: string;
	itemCodes: string[];
	proNameDisplay: string;
	proDescDisplay: string;
	JsDateFrm: string;
	JsDateTo: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	ipIds: string;
	DicPromotionItems: { [Key: string]: string[] };
}
interface IItemPromotion {
	proId: number;
	itemCode: string;
	IPCreateTimeDisplay: string;
	IPModifyTimeDisplay: string | null;
	DateFrmDisplay: string | null;
	DateToDisplay: string | null;
	proQty: number | null;
	proPrice: number | null;
	proDiscPc: number | null;
	pro4Period: boolean;
	NameDisplay: string;
	DescDisplay: string;
	PriceDisplay: string;
	DiscPcDisplay: string;
	proName: string;
	proDesc: string;
	proNameSC: string;
	proDescSC: string;
	proNameTC: string;
	proDescTC: string;
}
let deliveryAddressId: number = 0;
let searchItemMode = false;
let salesln: ISalesLn;
let checkedcashdrawer: boolean = false;

interface ICustomerItem {
	cusCode: string;
	itmCode: string;
	LastSellingPrice: number;
	CreateTimeDisplay: string;
	AccountProfileId: number;
	CompanyId: number;
	ModifyTimeDisplay: string | null;
}

let today = new Date();
let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
let LatestRecordCount: number = 300;

let recurOrder: IRecurOrder | null = null;
interface IRecurOrder {
	wsUID: number | null;
	wsCode: string | null;
	IsRecurring: number;
	Name: string;
	TotalSalesAmt: number;
	LastPostedDate: Date | null;
	LastPostedDateDisplay: string | null;
	ItemsNameDesc: string;
	Mode: string;
	pstCode: string | null;
	pstUID: number | null;
	rtsUID: number | null;
}
let selectedRecurCode: string = "";
let frmdate: any;
let todate: any;
let resource: string;
const jsdateformat: string = "yy-mm-dd";
let whatsapplnk: string = "https://api.whatsapp.com/send?phone={0}&text={1}";
let frmsearch: boolean = false;
let frmlist: boolean = false;
let forsupplier: boolean = false;
let forenquiry: boolean = false;
let forattendance: boolean = false;
let forjob: boolean = false;
let fortraining: boolean = false;
let forcustomer: boolean = false;
let forduty: boolean = false;
let forcustomergroup: boolean = false;
let forenquirygroup: boolean = false;
let forCreateReserve: boolean = false;
let forEditReserve: boolean = false;
let forhotlist: boolean = false;
let foreblast: boolean = false;
let forassignsalesmen: boolean = false;
let forrejectedcustomer: boolean = false;
let forapprovedcustomer: boolean = false;
interface ISalesReturnMsg {
	msg: string | null;
	status: string | null;
	adminphone: string | null;
	salescode: string | null;
	reviewurl: string | null;
	cusname: string | null;
	saleslnlength: number | null;
	ismanager: boolean;
}
interface IPurchaseReturnMsg {
	msg: string;
	purchasecode: string;
	reviewurl: string;
	adminphone: string;
	status: string;
	supname: string;
	purchaselnlength: number;
	adminemail: string;
	ismanager: boolean;
}
let editapproved: boolean = false;
let searchmodes: string = "";
let searchmodelist: string[] =
	$("#searchmode").length && $("#searchmode").val() !== ""
		? ($("#searchmode").val() as string).split(",")
		: [];
let _attrmode: boolean = false;
let currkeys: string[] = []; // ["USD", "CNY", "EUR", "MOP"];
let UseForexAPI: boolean = false;
let codelist: string[] = [];
interface IMyobJob {
	JobID: number;
	ParentJobID: number | null;
	IsInactive: boolean | null;
	JobName: string;
	JobDescription: string;
	JobNumber: string;
	IsHeader: boolean | null;
	JobLevel: number | null;
	IsTrackingReimburseable: boolean | null;
	ContactName: string;
	Manager: string;
	PercentCompleted: number | null;
	StartDate: string | null;
	FinishDate: string | null;
	CustomerID: number | null;
}
let MyobJobList: IMyobJob[] = [];

let CustomerOptionList: string[] = [];
let SupplierOptionList: string[] = [];
let DicEnqContent: { [Key: string]: string } = {};
let DicAttdSubject: { [Key: string]: string } = {};
let DicJobSubject: { [Key: string]: string } = {};
let DicTrainingContent: { [Key: string]: string } = {};

let EnquiryList: IEnquiry[] = [];
let AttendanceList: IAttendance[] = [];
let JobList: IJob[] = [];
let TrainingList: ITraining[] = [];
interface IAttendance {
	TotalRecord: number;
	saId: string;
	receiveddate: string;
	receivedDateTime: string;
	id: string;
	//Id: string;
	//saId: string;
	saName: string;
	saCheckInTime: string;
	saCheckOutTime: string | null;
	saReceivedDateTime: string;
	saDate: Date | null;
	DateDisplay: string;
	//saDateTo: string;
}

let Journal: IJournal;
let JournalLns: IJournalLn[] = [];
let selectedJournalLn1: IJournalLn | null;
let selectedJournalLn2: IJournalLn | null;
interface IJournal {
	Id: string;
	JournalNumber: string;
	strDate: string;
	JournalDate: string;
	Memo: string;
	TaxCode: string;
	ImportDutyAmount: number | null;
	CurrencyCode: string;
	ExchangeRate: number | null;
	Category: string;
	DateDisplay: string;
	IsCheckOut: boolean;
	Inclusive: boolean;
	TotalRecord: number;
}
interface IJournalLn {
	mainId: string;
	JournalDate: string;
	Memo: string;
	Id: number;
	JournalNumber: string;
	Seq: number;
	AccountName: string;
	AccountNumber: string;
	DebitExTaxAmount: number | null;
	DebitIncTaxAmount: number | null;
	CreditExTaxAmount: number | null;
	CreditIncTaxAmount: number | null;
	JobID: number | null;
	JobName: string | null;
	AllocationMemo: string | null;
	DateDisplay: string;
	Inclusive: boolean;
}
interface IJob {
	TotalRecord: number;
	joStaffName: string;
	joStaffEmail: string;
	joClient: string;
	joTime: string;
	joWorkingHrs: number | null;
	joAttachements: string;
	receivedDateTime: string;
	receiveddate: string;
	id: string;
	joId: string;
	joReceivedDateTime: string;
	joDate: Date | null;
	DateDisplay: string;
}
interface ITraining {
	TotalRecord: number;
	trId: string;
	trApplicant: string;
	trCompany: string;
	trEmail: string;
	trIndustry: string;
	trPhone: string;
	trAttendance: number;
	trIsApproved: boolean;
	trReceivedDateTime: string;
	receivedDateTime: string;
	receiveddate: string;
	id: string;
	strDate: string;
	trDate: Date | null;
	DateDisplay: string;
}
let todayEnquiries: IEnquiry[] = [];
let oldestEnquiries: IEnquiry[] = [];
let trainingIdList: string[] = [];
let jobIdList: string[] = [];
let attdIdList: string[] = [];
let DicIDItemOptions: { [Key: number]: IItemOptions };
let chkSN: boolean = false;
let chkBat: boolean = false;
let chkVT: boolean = false;
interface IItemOptionsModel extends IItemOptions {
	itemId: number;
}
interface IInfoBase {
	Id: any;
	cusCode: string | null;
	enId: string | null;
	fileName: string;
	type: string;
	status: string;
	remark: string;
	followUpDate: Date | null;
	JsFollowUpDate: string | null;
	followUpRecord: string | null;
	CreateTimeDisplay: string | null;
	CreatedBy: string | null;
	ModifyTimeDisplay: string | null;
	ModifiedBy: string | null;
	UserName: string | null;
	Email: string | null;
}
interface ICustomerInfo extends IInfoBase {
	cusCode: string;
	cusAddrLocation: number;
	AccountProfileId: number;
	StreetLine1: string;
	StreetLine2: string;
	StreetLine3: string;
	StreetLine4: string;
	City: string;
	State: string;
	Postcode: string;
	Country: string;
	Phone1: string;
	Phone2: string;
	Phone3: string;
	Fax: string;
	Email: string;
	Salutation: string;
	ContactName: string;
	WWW: string;
	Street: string;
	CustomerName: string | null;
}
interface IEnquiryInfo extends IInfoBase {
	Id: string;
	//enId: string;
	enEmail: string;
	CompanyName: string | null;
}
interface IAdvSearchItem {
	gattrId: string;
	Operator: string;
	attrValue: string;
}
let eTrackToken: string = "";
let foretrack: boolean = false;

interface IeTrackAdvSearchItem {
	strfrmdate: string;
	strtodate: string;
	blastId: string;
}
interface IeTrack {
	Id: string;
	BlastId: string;
	BlastSubject: string | null;
	ContactId: string;
	ContactName: string;
	ViewDateTimeDisplay: string;
	Organization: string;
	Phone: string;
	Email: string;
	CompanyID: string | null;
	Imported: number | null;
	IP: string;
	AccountProfileId: number | null;
	statuscls: string | null;
}
let eTrackAdvSearchItem: IeTrackAdvSearchItem = {} as IeTrackAdvSearchItem;
const snMatched = (sn1, sn2) => sn1 == sn2;
interface IItemBatSnVt {
	itemcode: string;
	batcode: string;
	sn: string | null;
	vt: string | null;
}

interface ISeqBatSnsVts {
	seq: number;
	batcode: string;
	snlist: string[];
	vtlist: string[];
}
interface ISeqBatVts {
	seq: number;
	batvts: { [Key: string]: string[] };
}
interface ISeqSnVtList {
	seq: number;
	sn: string;
	vtlist: string[];
}

interface ISeqVt {
	seq: number;
	vt: string;
}


interface IBatSnVt {
	pocode: string;
	batcode: string;
	sn: string | null;
	vt: string | null;
	status: string | null;
	selected: boolean;
}
let DicItemBatSnVt: { [Key: string]: IBatSnVt[] } = {};
let DicBatTotalQty: { [Key: string]: number } = {};
interface IBatTotalQty {
	batCode: string;
	totalBatQty: number;
}
interface IIvQty {
	Id: string;
	ivIdList: string;
	qty: number;
	pocode: string;
	ivseq: number | null;
	itemcode: string;
	delqty: number | null;
	sellableqty: number;
}
interface IIvDelQty extends IIvQty {
	Id: string;
	seq: number;
}

interface IDepositItem extends ISalesLn {
	rtsCode: string;
	rtsCusID: number;
	rtsLineTotalPlusTax: number | null;
	rtsFinalDiscAmt: number | null;
	rtsFinalTotal: number | null;
	rtsRmks: string;
	rtsDate: string;
	rtsInternalRmks: string;
	rtsEpay: boolean;
	rtsSalesLoc: string;
	rtsDvc: string;
	roundings: number | null;
	QtyAvailable: number;
	SettleDate: string;
	DepositAmtDisplay: string;
	DepositQty: number;
	AmtDisplay: string;
	TaxPcDisplay: string;
	DiscPcDisplay: string;
	SellingPriceDisplay: string;
}
let PoIvInfo: IPoItemVari[] = [];
let DicIvInfo: { [Key: string]: IPoItemVari[] } = {};
let DicIvQtyList: { [Key: string]: IIvQty[] } = {};
let DicIvDelQtyList: { [Key: string]: IIvDelQty[] } = {};
let isassignor: boolean;
let SelectedSimpleItemList: ISimpleItem[] = [];
let selectedSimpleItem: ISimpleItem;
interface ISimpleContact {
	Id: number;
	Name: string;
	Phone: string;
	Email: string;
	Message: string;
}

let purchasePayment: IPurchasePayment;
let PurchasePayments: IPurchasePayment[] = [];
interface IPurchasePayment {
	JsOpTime: string;
	Id: number;
	pstCode: string;
	supCode: string;
	Amount: number;
	AccountNo: string;
	AccountName: string;
	ChequeNo: string;
	fileName: string | null;
	ppDate: string;
	ppStatus: string;
	JsCreateDate: string;
	JsModifyDate: string;
	AcClfID: string;
}
let daterangechange: boolean = false;
let UploadedFileList: string[] = [];
//Inventory Adjustment
interface IIA {
	Id: number;
	JournalNumber: string;
	Memo: string;
	IALs: IIAL[];
	iaMemo: string;
	iaId: number;
	JsJournalDate: string;
	JournalDateDisplay: string;
}
//Inventory Adjustment Line
interface IIAL {
	Id: number;
	iaId: number;
	itmCode: string;
	Seq: number | null;
	itemID: number | null;
	lstStockLoc: string;
	Qty: number;
	UnitCost: number;
	Amt: number;
	AccountNumber: string;
	AccountID: number | null;
	JobID: number | null;
	Memo: string;
	NameDesc: string;
	JounralNumber: string;
	JounralDate: Date | null;
}
let IA: IIA;
let IALs: IIAL[] = [];
let SelectedIAL: IIAL;
let eBlastHotListIds: { [Key: number]: number } = {};
