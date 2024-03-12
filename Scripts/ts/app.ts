abstract class SimpleForm {
	edit = false;
	constructor(edit) {
		this.edit = edit;
	}

	abstract validform(): boolean;
	abstract submitform();
}

enum TriggerReferrer {
	Row,
	Modal
}
let triggerReferrer: TriggerReferrer;

let $appInfo = $("#appInfo");
let $txtblk = $("#txtblk");



let salesman: ICrmUser;
let checkoutportal: string =
	$appInfo.length === 0
		? ""
		: ($appInfo.data("checkoutportal") as string).toLowerCase();
let approvalmode: boolean = false;
let reviewmode: boolean = false;
let enableCRM: boolean = false;
let enableWhatsappLnk: boolean = $appInfo.data("enablewhatsapplnk")
	? $appInfo.data("enablewhatsapplnk") === "True"
	: false;
let uploadsizelimit: number = 0;
let uploadsizelimitmb: number = 0;
let gTblName: string = "";
let wstype: string = "";
let psttype: string = "";
let forrejectedinvoice: boolean = false;
let forapprovedinvoice: boolean = false;
let forrejectedpo: boolean = false;
let forapprovedpo: boolean = false;
let forpassedtomanager: boolean = false;
let recreateOnVoid: number = 0;
let UserName: string = "";
let NamesMatch: boolean = false;
//const searchcustxt:string = $txtblk.data("searchcustxt");
//const searchcustxt:string = $txtblk.data("searchcustxt");
//const searchcustxt:string = $txtblk.data("searchcustxt");
//const searchcustxt:string = $txtblk.data("searchcustxt");
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
let customerId: number = 0;
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
const changetxt: string = $txtblk.data("changetxt");
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
let lang: number;
let debug: boolean = false;

let cusAttrEdit: boolean = false;
let attrEdit: boolean = false;

let graphsettings: IGraphSettings;
let graphsettingslist: Array<IGraphSettings> = [];

let IdList: number[] = [];

let gAttributes: Array<IGlobalAttribute> = [];
let gAttribute: IGlobalAttribute;

let cAttributes: ICustomAttribute[] = [];

let dicAssignedSalesInfo: { [Key: number]: ICrmUser } = {};

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
	voidPaymentModal: any;

let sysdateformat: string = "yyyy-mm-dd";
//let jsdateformat: string = "dd/mm/yy";
let attrId: string;
let attrvalues: string[] = [];
let customerlist: Array<ICustomer> = [];
let staff: ICrmUser;
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
let pagelength: number = 0;
let itotalamt: number = 0,
	itotalpay: number = 0;
//ichange: number = 0;
let currentY: number = -1;
let zeroprice: boolean = false;
let zerocost: boolean = false;
let selectedItemCode: string | number,
	selectedCusCodeName: string = "";
let selectedSalesLn: ISalesLn | null;
let selectedPreSalesLn: IPreSalesLn | null;
let selectedSimpleSalesLn: ISimpleSalesLn | null;
let selectedCus: ICustomer;
let selectedStockInItem: IStockInItem;
let selectedPurchaseItem: IPurchaseItem | null;
let selectedWholesalesLn: IWholeSalesLn | null;

let SimpleItemList: ISimpleItem[];
let ItemList: Array<IItem>;
let CusList: Array<ICustomer>;
let contactlist: Array<IContact>;
let seq = 0;
let itemsnlist: Array<IItemSN> = [];
let itemsnbvlist: Array<IItemSnBatVt> = [];

let itemsnvtlist: { [Key: string]: Array<ISnVt> } = {}; //key = itemcode:seq

let Payments: Array<IPaymentType> = [];
let allownegativestock = false;
//let Sale.Roundings = 0;
let iremain = 0;
let _openSerialModal = false;
let companyinfo: ICompanyInfo;
let receipt: IReceipt;
let DicPayTypes: { [Key: string]: IPaymentType } = {}; //Dictionary<IPaymentType>;
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
let pageindex = 1;
//let deposit = 0;
let inclusivetax = false,
	inclusivetaxrate = 0;
let chkIdx = -1,
	activeChkIdx = -1,
	activePayIdx = -1,
	paymenttypechange = false,
	chkchange = false;
let usecoupon = false;
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
let enablelogo: boolean;
let enableSN: boolean;
let enableTax: boolean;
let printurl: string = "/Print/Index";
let device: string;
let printfields: string;
let phoneno: string;
//let ispng: boolean;
let salesType: SalesType;
let RefundList: Array<IRefundBase> = [];
let enablecashdrawer: boolean;
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
let forsimplesales: boolean = false;
let fordeposit: boolean = false;
let forpurchase: boolean = false;
let forpurchasepayments: boolean = false;
let validPayment: boolean = false;
let fordayends: boolean = false;
let forstockin: boolean = false;
let forjournal: boolean = false;
let itemaccountmode: ItemAccountMode;
let AccountProfileId: number;
let accountList: Array<IAccount> = [];
let AcClfID: string = "";
let ItemAccountNumber: string = "";
let dicItemAccount: { [Key: string]: string } = {};
let dicDefaultAttrRequiredTxt: { [Key: string]: string } = {};

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
				window.location.href = "/Item/ZeroStocks?salescode=" + salescode;
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

function customerdetail(data: ICustomer) {
	let _statustxt = data.IsActive == 1 ? activetxt : inactivetxt;
	let staff = typeof data.Staff === "undefined" ? "N/A" : data.Staff.UserName;
	let contact = data.cusContact ?? "N/A";
	let mobile = data.cusMobile ?? "N/A";
	let addr = data.cusAddr ?? "N/A";
	let _isorgan = data.IsOrganization == "1";
	let _isorgantxt = _isorgan ? yestxt : notxt;
	let _cname = _isorgan ? data.cusName : data.cusFirstName + " " + data.cusName;
	let html =
		"<h3>" +
		customerdetailtxt +
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
		statustxt +
		"</strong>: " +
		_statustxt +
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
		stafftxt +
		"</strong>: " +
		staff +
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
		addresstxt +
		"</strong>: " +
		addr +
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

	//console.log('jsonattributelist:', data.JsonAttributeList);

	//html += '<li class="list-group-item"><strong>' + attributelisttxt + '</strong>';
	//html += '<table class="table table-bordered"><thead><tr><th>' + nametxt + '</th><th>' + valuetxt + '</th></tr></thead><tbody>';

	//var attrlist = JSON.parse(data.JsonAttributeList);
	//console.log('attrlist:', attrlist);

	//$.each(attrlist, function (i: string, e: string) {
	//    html += '<tr><td>' + i + '</td><td>' + e.replace('||', ',') + '</td></tr>';
	//})
	html += "</tbody></table></li>";

	html += "</ul>";
	return html;
}

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
		case "customer":
			$target = $("#tblCus");
			$pager = $(".CusPager");
			break;
		case "hotlist":
			$target = $("#tblHotList");
			$pager = $(".Pager");
		case "contact":
			$target = $("#tblContact");
			$pager = $(".ContactPager");
			break;
		case "stock":
			$target = $("#tblStock");
			$pager = $(".StockPager");
			break;
		case "transfer":
			$target = $("#tblTransfer");
			$pager = $(".TransferPager");
			break;
		default:
		case "item":
			$target = $("#tblItem");
			$pager = $(".Pager");
	}
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
let shop: string = "";

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
						PageSize: pagesize,
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
						PageSize: pagesize,
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
						PageSize: pagesize,
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
					const totalRecord: number = Math.min(...EnquiryList.map(x=>x.TotalRecord));

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

					fillInEnqTable();

					$(".Pager").ASPSnippets_Pager({
						ActiveCssClass: "current",
						PagerCssClass: "pager",
						PageIndex: pageIndex,
						PageSize: pagesize,
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
function GetItems(pageIndex) {
	let type = getParameterByName("type") ?? "";

	shop = $("#drpLocation").length
		? ($("#drpLocation").val() as string)
		: $infoblk.data("location")
			? ($infoblk.data("location") as string)
			: ($infoblk.data("shop") as string);
	
	let data = { pageIndex:pageIndex,keyword:keyword,location:shop, forsales:forsales,forwholesales:forwholesales,forpurchase:forpurchase,forstock:forstock,fortransfer:fortransfer,forpreorder:forpreorder,type:type};
		

	openWaitingModal();
	$.ajax({
		url:
			checkoutportal == "kingdee" ? "/Api/GetKItemsAjax" : "/Api/GetItemsAjax",
		type: "GET",
		data: data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: OnSuccess,
		error: onAjaxFailure,
	});
}

let forpreorder: boolean = false;
function OnSuccess(response) {
	closeWaitingModal();
	var model = response;
	seq = currentY + 1;

	DicIvInfo = model.DicIvInfo;

	//merge two objects
	DicItemOptions = Object.assign({}, DicItemOptions, model.DicItemOptions);

	if (forsales || forpreorder || forwholesales || forpurchase) {
		DicItemBatchQty = Object.assign({}, DicItemBatchQty, model.DicItemBatchQty);

		// console.log("dicitembatchqty:", DicItemBatchQty);

		DicItemBatDelQty = Object.assign(
			{},
			DicItemBatDelQty,
			model.DicItemBatDelQty
		);

		DicItemSnos = Object.assign({}, DicItemSnos, model.DicItemSnos);
		// console.log(DicItemSnos);

		DicItemBatSnVtList = Object.assign(
			{},
			DicItemBatSnVtList,
			model.DicItemBatSnVtList
		);
		DicItemSnVtList = Object.assign({}, DicItemSnVtList, model.DicItemSnVtList);
		DicItemVtQtyList = Object.assign(
			{},
			DicItemVtQtyList,
			model.DicItemVtQtyList
		);
		DicItemVtDelQtyList = Object.assign(
			{},
			DicItemVtDelQtyList,
			model.DicItemVtDelQtyList
		);
		//console.log("dicitemvtqtylist:", DicItemVtQtyList);
		//console.log("dicitemvtdelqtylist:", DicItemVtDelQtyList);

		if (PoItemBatVQList) {
			const newpolist = model.PoItemBatVQList.slice(0);
			const currentpolist = PoItemBatVQList.slice(0);
			const tmplist = [...newpolist, ...currentpolist];
			const filteredpolist = tmplist.filter(
				(value, index, self) =>
					index === self.findIndex((t) => t.id === value.id)
			);
			PoItemBatVQList = filteredpolist.slice(0);
		} else {
			if (model.PoItemBatVQList)
				PoItemBatVQList = model.PoItemBatVQList.slice(0);
		}

		DicItemAttrList = Object.assign({}, DicItemAttrList, model.DicItemAttrList);
		DicItemVariations = Object.assign(
			{},
			DicItemVariations,
			model.DicItemVariations
		);

		DicItemGroupedVariations = Object.assign(
			{},
			DicItemGroupedVariations,
			model.DicItemGroupedVariations
		);

		DicBatTotalQty = model.DicBatTotalQty;
		//console.log("DicBatTotalQty#OnSuccess:", DicBatTotalQty);

		DicIvInfo = model.DicIvInfo;
		//console.log("DicIvInfo:", DicIvInfo);
		//console.log("DicItemGroupedVariations", DicItemGroupedVariations);
		DicIvQtyList = model.DicIvQtyList;
		DicIvDelQtyList = model.DicIvDelQtyList;
		//console.log("DicIvQtyList:", DicIvQtyList);
		//console.log("DicIvDelQtyList:", DicIvDelQtyList);
	}

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
				selectedPurchaseItem = GetSetSelectedPurchaseItem();
				selectedPurchaseItem!.Item = structuredClone(ItemList[0]);
			}

			if (forsales || forpurchase || forwholesales || forpreorder) {
				$(".itemcode").off("change");
				populateItemRow();
				$(".itemcode").on("change", handleItemCodeChange);
			} else {
				copiedItem = structuredClone(ItemList[0]);
			}
		} else {
			openItemModal();
			_writeItems(model.Items);
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

	keyword = "";
}
function GetSetSelectedPreSalesLn(): IPreSalesLn {
	if (PreSalesLnList.length > 0) {
		let idx = PreSalesLnList.findIndex((x) => x.rtlSeq == seq);
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
		let idx = SalesLnList.findIndex((x) => x.rtlSeq == seq);
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
		let idx = WholeSalesLns.findIndex((x) => x.wslSeq == seq);
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
		let idx = Purchase.PurchaseItems.findIndex((x) => x.piSeq == seq);
		if (idx >= 0) selectedPurchaseItem = Purchase.PurchaseItems[idx];
		else {
			selectedPurchaseItem = initPurchaseItem();
			Purchase.PurchaseItems.push(selectedPurchaseItem);
		}
	} else {
		selectedPurchaseItem = initPurchaseItem();
		Purchase.PurchaseItems.push(selectedPurchaseItem);
	}
	return selectedPurchaseItem;
}

function _writeItems(itemList: IItem[]) {
	let html = "";
	$.each(itemList, function () {
		var item = this;
		const itemcode: string = item.itmCode;

		let trcls = "",
			proId = 0;

		if (!forpurchase) {
			if (item.ItemPromotions.length > 0) {
				if (item.ItemPromotions.find((e) => e.pro4Period)) {
					trcls = "period";
					proId = item.ItemPromotions.find((e) => e.pro4Period)!.proId;
				} else {
					trcls = "nonperiod";
					proId = item.ItemPromotions[0].proId;
				}
			} else trcls = "";
		}
		let _qty: number = item.Qty;

		html += `<tr class="itmcode ${trcls}" data-code="${itemcode}" data-proid="${proId}" data-qty="${_qty}">`;
		// row.addClass("itmcode").attr("data-code", itemcode);
		html += `<td>${itemcode}</td>`;
		// $("td", row).eq(0).html(itemcode);

		var namedesc = handleItemDesc(item.NameDesc);
		html += `<td style="max-width:250px;" title="${item.NameDesc}">${namedesc}</td>`;
		let outofstock: boolean = forsales||forsimplesales||forpreorder ? false : itemcode.startsWith("/") ? false : _qty <= 0;
		if (!forpurchase && !forpreorder) {
			let tdcls = !outofstock ? "" : "outofstock";
			html += `<td style="text-align:right;width:90px;max-width:90px;" class="${tdcls}">${_qty}</td>`;
		}

		let price: number = 0;
		if (forsales || forwholesales || forstock || forpreorder) {
			price = item.itmBaseSellingPrice!;
		}
		if (forpurchase) {
			price = item.itmBuyStdCost!;
		}

		html += `<td style="text-align:rigth;width:100px;max-width:100px;">${formatnumber(
			price
		)}</td>`;

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

		if (!forpurchase) {
			seq = currentY + 1;
			let urlist = "";
			if (((forsales || forwholesales) && !outofstock) || forpreorder) urlist = genProUrList(urlist, item);
			html += `<td style="width:250px;min-width:250px;">${urlist}</td>`;
		}

		html += "</tr>";
	});
	$("#tblItem tbody").empty().append(html);
	if (!forpurchase) {
		$("#tblItem tbody tr").each(function (i, e) {
			if ($(e).find("td").eq(2).hasClass("outofstock")) {
				$(e).removeClass("itmcode").addClass("outofstock");
			} else {
				$(e).addClass("itmcode").removeClass("outofstock");
			}
		});
	}
}

$(document).on("click", "#tblmails th", function () {
	sortName = $(this).data("category");
	sortCol = Number($(this).data("col"));
	pageindex = 1;
	if (forenquiry) GetEnquiries(pageindex);
	if (forattendance) GetAttendances(pageindex);
	if (forjob) GetJobs(pageindex);
	if (fortraining) GetTrainings(pageindex);
});
$(document).on("click", ".Pager .page", function () {
	pageindex = Number($(this).attr("page"));
	if (forenquiry) GetEnquiries(pageindex);
	if (forattendance) GetAttendances(pageindex);
	if (forjob) GetJobs(pageindex);
	if (fortraining) GetTrainings(pageindex);
	if (forsales || forpreorder || forwholesales || forpurchase)
		GetItems(pageindex);

	if (forstock) GetStocks(pageindex);
});
$(document).on("click", "#tblItem th a", function () {
	sortName = $(this).data("category");
	sortDirection = sortDirection == "ASC" ? "DESC" : "ASC";
	/* console.log('sortname:' + sortName + ';sortdir:' + sortDirection);*/
	pageindex = 1;
	GetItems(pageindex);
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
}

function updateRows() {
	if (selectedCus || SelectedSupplier) {
		//console.log("here");
		$(`#${gTblName} tbody tr`).each(function (i, e) {
			if ($(e).find("td").eq(1).find(".itemcode").val() !== "") {
				//todo: to be verified updaterows
				const taxidx = forpurchase && Purchase.pstStatus !== "order" ? -5 : -4;
				//console.log("selectedCus.TaxPercentageRate:" + selectedCus.TaxPercentageRate);
				const taxpc = forpurchase
					? SelectedSupplier.TaxPercentageRate ?? 0
					: selectedCus.TaxPercentageRate ?? 0;
				//console.log("taxpc:" + taxpc);
				$(e)
					.find("td")
					.eq(taxidx)
					.find(".taxpc")
					.data("taxpc", taxpc)
					.val(formatnumber(taxpc))
					.trigger("change");
			}
		});
	}
}
function GetCustomers4Sales(pageIndex, mode = "") {
	let data = `{pageIndex:${pageIndex},mode:'${mode}'`;
	if (typeof keyword !== "undefined" && keyword !== "") {
		data = `{pageIndex:${pageIndex},mode:'${mode}',keyword:'${keyword}'}`;
		// console.log("data#0:" + data);
	} else {
		data = `{pageIndex:${pageIndex},mode:'${mode}',keyword:''}`;
	}
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
		url: "/Api/GetCustomersAjax4Sales",
		type: "POST",
		data: data,
		contentType: "application/json; charset=utf-8",
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

	// console.log("searchcusmode:" + searchcusmode);
	model.Customers = forMyob
		? model.MyobCustomers.slice(0)
		: model.PGCustomers.slice(0);
	//console.log("modelcustomers:", model.Customers);
	if (model.Customers.length > 0) {
		togglePaging("customer", true);

		CusList = model.Customers.slice(0);
		if (CusList.length === 1) {
			selectedCus = structuredClone(CusList[0]);
			//console.log("selectedCus#ongetcustomerssccuess:", selectedCus);
			selectedCusCodeName = selectedCus.cusCustomerID.toString();
			selectCus();
			closeCusModal();
		} else {
			openCusModal();
			_writeCustomers(CusList);
		}

		if (searchcusmode) {
			// console.log("cuslist length:" + CusList.length);

			// if (CusList.length === 1) {
			//   selectedCus = CusList[0];
			//   // console.log("selectedCus#ongetcustomerssccuess:", selectedCus);
			//   selectedCusCodeName = selectedCus.cusCustomerID.toString();
			//   selectCus();
			//   closeCusModal();
			// } else {
			//   openCusModal();
			//   _writeCustomers(CusList);
			// }
			searchcusmode = false;
		} else {
			// var row = $("#tblCus tr:last-child").removeAttr("style").clone(false);
			// $("#tblCus tr").not($("#tblCus tr:first-child")).remove();

			// $.each(CusList, function () {
			//   var customer = this;
			//   row.addClass("cuscode").attr("data-code", customer.cusCustomerID);
			//   //console.log('customer:', customer);
			//   $("td", row).eq(0).html(customer.cusCode);
			//   $("td", row).eq(1).html(customer.cusName);

			//   $("#tblCus").append(row);
			//   row = $("#tblCus tr:last-child").clone(false);
			// });
			$(".CusPager").ASPSnippets_Pager({
				ActiveCssClass: "current",
				PagerCssClass: "pager",
				PageIndex: model.PageIndex,
				PageSize: model.PageSize,
				RecordCount: model.RecordCount,
			});
			// openCusModal();
		}
	} else {
		togglePaging("customer", false);
	}
}
function _writeCustomers(_customerlist: Array<ICustomer>) {
	let html = "";
	$.each(_customerlist, function (i, e) {
		html +=
			'<tr class="cuscode" data-code="' +
			e.cusCustomerID +
			'"><td>' +
			e.cusCode +
			"</td><td>" +
			e.cusName +
			"</td></tr>";
	});
	$target = $("#tblCus tbody");
	$target.find("tr.cuscode").remove();
	$target.append(html);
	$(".CusPager").empty();
}
function OnSearchCustomersSuccess(response) {
	keyword = "";
	closeWaitingModal();
	console.log("response:", response);
	var model = response;
	console.log("modelcustomers:", model.Customers);

	if (model.Customers.length > 0) {
		togglePaging("customer", true);
		CusList = model.Customers.slice(0);

		console.log("cuslist:", CusList);
		if (typeof CusList === "undefined") {
			GetCustomers4Sales(1);
		} else {
			//let modelcustomerlist: Array<ICustomer> = model.Customers.slice(0);
			//let filteredmodelcuslist: Array<ICustomer> = [];
			//$.each(modelcustomerlist, function (i, e: ICustomer) {
			//    let _customer = $.grep(cuslist, function (v, k) {
			//        return e.cusCustomerID == v.cusCustomerID;
			//    })[0];

			//    if (typeof _customer === 'undefined') {
			//        filteredmodelcuslist.push(e);
			//    }
			//});

			//cuslist = [...cuslist, ...filteredmodelcuslist];
			//console.log('cuslist after merge:', cuslist);

			var row = $("#tblCus tr:last-child").removeAttr("style").clone(false);
			$("#tblCus tr").not($("#tblCus tr:first-child")).remove();

			$.each(CusList, function () {
				var customer = this;
				row.addClass("cuscode").attr("data-code", customer.cusCustomerID);
				let chktag = `<input type="checkbox" class="chk" data-Id="${customer.cusCustomerID}">`;
				let detailtag = `<a href="#" class="btn btn-success detail" role="button" data-Id="${customer.cusCustomerID}">${detailtxt}</a></td>`;
				let callhistorytag = `<a href="/CallHistory/Index?customerId=${customer.cusCustomerID}" class="btn btn-outline-warning" role="button" data-Id="${customer.AccountProfileId}"><span class="small">${callhistorytxt}</span></a>`;
				let attrtag = `<a class="btn btn-primary" role="button" href="/CustomerAttribute/Index?customerId=${customer.cusCustomerID}&AccountProfileId=${customer.AccountProfileId}">${attributetxt}</a>`;
				let editremovetag = `<a class="btn btn-info" role="button" href="/Customer/Edit?customerId=${customer.cusCustomerID}&AccountProfileId=${customer.AccountProfileId}"><span class="small">${edittxt}</span></a>
                    <a class="btn btn-danger remove" role="button" href="#" data-Id="${customer.cusCustomerID}" data-apid="${customer.AccountProfileId}"><span class="small">${removetxt}</span></a>`;
				let salesman =
					customer.SalesPerson == null ? "N/A" : customer.SalesPerson.UserName;
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
					.html(customer.cusContact);
				$("td", row)
					.eq(3)
					.css({ width: "110px", "max-width": "110px" })
					.addClass("text-center")
					.html(customer.cusEmail);
				$("td", row)
					.eq(4)
					.css({ width: "100px", "max-width": "100px" })
					.addClass("text-center")
					.html(customer.AccountProfileName);
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
			$(".CusPager").ASPSnippets_Pager({
				ActiveCssClass: "current",
				PagerCssClass: "pager",
				PageIndex: model.PageIndex,
				PageSize: model.PageSize,
				RecordCount: model.RecordCount,
			});
		}
		//}
	} else {
		togglePaging("customer", false);
	}
}

$(document).on("click", ".CusPager .page", function () {
	pageindex = parseInt(<string>$(this).attr("page"));
	GetCustomers4Sales(pageindex);
});
$(document).on("click", "#tblCus th a", function () {
	sortName = $(this).data("category");
	sortDirection = sortDirection == "ASC" ? "DESC" : "ASC";
	/* console.log('sortname:' + sortName + ';sortdir:' + sortDirection);*/
	pageindex = 1;
	GetCustomers4Sales(pageindex);
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
interface IAccount {
	AccountID: number;
	AccountName: string;
	AccountNumber: string;
	AccountClassificationID: string;
	ACDescription: string;
	AccountProfileId: number;
}

function saveAttributeVals(edit = true) {
	//closeComboModal();

	let _attform = new attform(edit);
	if (_attform.validform()) {
		_attform.submitform();
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

let attrvalue: string = "";
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

	$("#changeamt").text(formatmoney(Sales.Change));
}

const getTotalPayments = (): number => {
	let payments: number = 0;
	$("#tblPay tbody tr").each(function (i, e) {
		let $chk = $(e).find("td").first().find(".chkpayment");
		let $pay = $(e).find("td").eq(1).find(".paymenttype");
		if ($chk.is(":checked")) {
			payments += Number($pay.val()) / exRate;
		}
	});
	return payments;
};

const getPaymentRemain = (): number => {
	let salesamt = getTotalAmt4Order();
	let payments = getTotalPayments();
	return salesamt - payments;
};

function setRemain($e: JQuery, amt: number, forsales: boolean = true) {
	let type: string = <string>$e.attr("id")?.toString();
	//console.log('type:' + type);
	//console.log('DicPayTypes:', DicPayTypes);
	let iscash = false;
	for (const [key, value] of Object.entries(DicPayTypes)) {
		//console.log(`${key}: ${value}`);
		if (key == type) {
			iscash = value.pmtIsCash;
			break;
		}
	}
	//console.log('iscash:' + iscash);
	let _totalpay: number = 0, _totalamt: number = 0;
	if (!forsimplesales) {
		_totalpay = getTotalPayments();
		_totalamt = getTotalAmt4Order();
	}

	if (forsales) {
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
		if (!iscash && !usecoupon) {
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

	} else {
		if (chkIdx >= 0) {
			$tr = $("#tblPay tbody tr").eq(chkIdx);
			if ($tr != null) {
				if (chkchange && !paymenttypechange) {
					if (_amt < 0) {
						$tr.find("td:eq(1)").find(".paymenttype").val(formatnumber(0));
					} else {
						$tr.find("td:eq(1)").find(".paymenttype").val(_amt.toFixed(2));
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
						$("#remaintxt").text(changetxt);
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
			$("#remaintxt").text(changetxt);
		}
	}

	$("#remainamt").text(formatmoney(_remain));

	console.log("remainlt0:", _remain <= 0);
	if (forsimplesales) setRemainDisplay(_remain <= 0);
}
function setRemainDisplay(remainLt0: boolean) {
	console.log("remainLt0#display:", remainLt0);
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
				Refund.Change = 0;
				Refund.Deposit = 0;
				Refund.Roundings = 0;
				break;
			default:
			case SalesType.deposit:
			case SalesType.retail:
				Sales.MonthlyPay = 0;
				Sales.Change = 0;
				Sales.Deposit = 0;
				Sales.Roundings = 0;
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
	usecoupon = false;
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
			getPaymentInfo(e);
		});
	} else {
		$("#tblPay .form-control").each(function (i, e) {
			getPaymentInfo(e);
		});
	}
	function getPaymentInfo(e) {
		if ($(e).val() !== "") {
			let typecode: string = <string>$(e).attr("id");
			let amt: number = parseFloat(<string>$(e).val());
			//console.log("typecode:", typecode);
			//console.log("amt:", amt);
			let paytype: IPaymentType = {
				payId: 0,
				pmtCode: typecode,
				Amount: amt,
				pmtIsCash: typecode.toLowerCase() == "cash",
				TotalAmt: 0,
			};
			Payments.push(paytype);
			if (typecode.toLowerCase() === "coupon") {
				_couponamt += amt;
			}
			_totalpay += amt;
		}
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
			$(`#${gTblName} tbody tr`).each(function (i, e) {
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
	paymenttypechange = false;
	chkchange = true;
	$target = $(this).parent("div").parent("div").parent("td").parent("tr");
	chkIdx = parseInt($target.data("idx"));
	//console.log('chkIdx#chkpaymentchange:' + chkIdx);

	let type = $(this).data("type");
	if (type === "Coupon") {
		usecoupon = $(this).is(":checked");
	}

	if ($(this).is(":checked")) {
		$target.find("td:eq(1)").find(".paymenttype").prop("readonly", false);
		let _remain: number = getPaymentRemain();
		if (_remain >= 0) {
			_setremain(0, _remain);
		}
	} else {
		let _pt: any = $target.find("td:eq(1)").find(".paymenttype").val();
		let _amt = parseFloat(_pt);
		$target.find("td:eq(1)").find(".paymenttype").val(0).prop("readonly", true);
		_setremain(0, -1 * _amt);
	}
});

$(document).on("change", ".paymenttype", function () {
	if (!fordayends) {
		let payamt: number = Number($(this).val());
		//console.log("payamt:" + payamt);

		paymenttypechange = true;
		chkchange = false;

		if (payamt == 0) {
			$(this).val(formatnumber(0));
			if (Sales.Deposit == 0) {
				setRemain($(this), 0);
			}
		} else {
			$(this).val(formatnumber(payamt));
			let amt = payamt / exRate;
			//console.log("amt:" + amt);
			if (amt >= 0) {
				if (Sales && Sales.Deposit == 0) {
					couponamt = amt;
					setRemain($(this), amt);
				}
				if (PreSales && PreSales.rtsStatus == SalesStatus.presettling) {
					couponamt = amt;
					setRemain($(this), amt);
				}
			}
		}
	}
});

function confirmPay() {
	//console.log("here");
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
	let _totalpay: number = paymentsInfo.totalpay;

	_totalpay = round(_totalpay, 2);
	_totalamt = round(_totalamt, 2);

	//console.log('totalpay:' + _totalpay + ';totalamt:' + _totalamt);
	if (isNaN(_totalpay)) {
		falert(paymentrequiredtxt, oktxt);
	} else if (_totalpay < _totalamt) {
		switch (salesType) {
			case SalesType.simplesales:
				submitSimpleSales();
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
			if (!usecoupon) {
				Sales.Change = _totalpay - _totalamt;
				//console.log('ichange:' + ichange + ';ready to open changemodal...');
				openChangeModal();
			} else {
				if (_couponamt < _totalamt) {
					Sales.Change = _totalpay - _totalamt;
					//console.log('ichange:' + ichange + ';ready to open changemodal...');
					openChangeModal();
				}
				if (_couponamt >= _totalamt) {
					resetPay(true);
					if (forsales)
						submitSales();
					if (forsimplesales) submitSimpleSales();
					//        break;
					//}
				}
			}
		}
	} else if (_totalpay == _totalamt) {
		switch (salesType) {
			case SalesType.simplesales:
				submitSimpleSales();
				break;
			case SalesType.deposit:
				submitRemaining();
				break;
			case SalesType.refund:
				submitRefund();
				break;
			case SalesType.simplesales:
				submitSimpleSales();
				break;
			default:
			case SalesType.preorder:
			case SalesType.retail:
				submitSales();
				break;
		}
	}
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

function openPayModal(totalamt: number = 0) {
	payModal.dialog("option", { width: 600, title: processpayments });
	payModal.dialog("open");

	if (forpreorder) {
		let $deposit: JQuery = $("#deposit");
		$deposit.prop("checked", true);
	}

	/*if (!forsimplesales)*/
	setExRateDropDown();

	if (totalamt === 0)
		totalamt = getTotalAmt4Order();

	//console.log("totalamt:" + totalamt);
	/*if (!forsimplesales)*/
	setForexPayment(totalamt);

	initAmtDisplay(totalamt);

	initCashTxt(totalamt);
}
function initAmtDisplay(totalamt: number) {
	$("#salesamount").text(formatmoney(totalamt));
	$("#remainamt").text(formatmoney(0));
}
function initCashTxt(totalamt: number | null) {
	let cashtxt = "";
	if (!totalamt) {
		totalamt = getTotalAmt4Order();
	}
	cashtxt = totalamt.toFixed(2);
	//console.log("cashtxt:" + cashtxt);
	togglePlusCheck("btnCash");
	$("#Cash").val(cashtxt);
}
function togglePayModeTxt() {
	if ($(".checks:visible").length > 1) {
		$("#singlePayMode").hide();
		$("#multiplePayMode").show();
	} else {
		$("#singlePayMode").show();
		$("#multiplePayMode").hide();
	}
}

function togglePlusCheck(Id: string): boolean {
	$(`#${Id}`).find(".pluse").toggle();
	let $return = $(`#${Id}`).find(".checks").toggle();
	return $return.is(":visible");
}
function setForexPayment(totalamt: number | null) {
	if (!totalamt) totalamt = getTotalAmt4Order();
	$("#forexPayment").html(formatnumber(totalamt));
	//initCashTxt(totalamt);
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
		console.log("gval:" + gAttribute.attrValue);
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

let eblastId: number;
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

let gattrfilteropener: string = "";
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

let assignedEnquiryModal: any;
function openAssignedEnquiryModal() {
	assignedEnquiryModal.dialog("open");
}
function closeAssignedEnquiryModal() {
	assignedEnquiryModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}
let DicSalesGroup: { [Key: string]: Array<ISalesGroup> };
let salesgrouplist: Array<ISalesGroup>;
let salesgroup: ISalesGroup;
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
interface ISalesGroup {
	Id: number;
	sgName: string;
	sgDesc: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	UserName: string;
}

let salesgroupMemberModal: any;
function openSalesGroupMemberModal() {
	salesgroupMemberModal.dialog("open");
}
function closeSalesGroupMemberModal() {
	salesgroupMemberModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}

let stockTransferEditMode: boolean = false;
let groupSalesmenModal: any;
function openGroupSalesmenModal() {
	groupSalesmenModal.dialog("open");
}
function closeGroupSalesmenModal() {
	groupSalesmenModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}
function openTextAreaModal() {
	textareaModal.dialog("open");
	if (stockTransferEditMode) {
		textareaModal.dialog({ title: remarktxt });
	}
}
function closeTextAreaModal() {
	textareaModal.dialog("close");
}
let rejectreason: string = "";
let stocktransfer: IStockTransfer;
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
	if (forpurchase && selectedPurchaseItem) {
		$("#descModal")
			.empty()
			.append(
				"<p style='font-size:larger;'>" + selectedPurchaseItem!.itmDesc + "</p>"
			);
	}

	if (forwholesales && selectedWholesalesLn) {
		$("#descModal")
			.empty()
			.append(
				"<p style='font-size:larger;'>" + selectedWholesalesLn.wslDesc + "</p>"
			);
	}

	if (forPGItem || forstock || fortransfer) {
		$("#descModal")
			.empty()
			.append(
				"<p style='font-size:larger;'>" + selectedItem?.NameDesc + "</p>"
			);
	}
}
let forItem: boolean = false;
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
	//if (!forpayments)
	//	window.location.reload();
}

function openViewFileModal() {
	viewFileModal.dialog("open");
}
function closeViewFileModal() {
	viewFileModal.dialog("close");
}

function openDropDownModal(ele: JQuery<any>) {
	dropdownModal.dialog("open");
	//console.log('ele:', ele);
	let _attrname: string = $(ele).data("attrname");
	//console.log('name:' + _attrname);

	dropdownModal.find("#lblattrname").text(_attrname);
	let options: string = "";
	let $dropdown: JQuery = dropdownModal.find(".dropdown");
	$dropdown.data("attrname", _attrname);
	//let _selecttxt: string = `-- ${selecttxt} --`;
	//options += `<option value=''>${_selecttxt}</option>`;

	$dropdown.attr("Id", _attrname);
	let _items: string[] = $(ele).data("attrvalue").split("||");
	$.each(_items, function (i, e) {
		options += `<option value="${e}">${e}</option>`;
	});
	$dropdown.empty().append(options);
}
function closeDropDownModal() {
	dropdownModal.dialog("close");
	if (reload) {
		window.location.reload();
	}
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

		let batcode: string = $(`#${gTblName} tbody tr`)
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
		$.each(selectedPurchaseItem!.batchList, function (i, item) {
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
function initModals() {
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
	barcodeModal = $("#barcodeModal").dialog({
		width: 400,
		title: barcodetxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: closetxt,
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

	if ($("#customerFollowUpModal").length)
		customerFollowUpModal = $("#customerFollowUpModal").dialog({
			width: 400,
			title: customerfollowuptxt,
			autoOpen: false,
			open: function (e) {
				$(e.target)
					.parent()
					.css("background-color", "#fefbf5")
					.find(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix")
					.css("background-color", "#fefbf5");
			},
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: confirmCustomerFollowUp,
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: closeCustomerFollowUpModal,
				},
			],
		});

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
						if (approvalmode && (forsales || forpreorder || forpurchase || forwholesales)) {
							//reject reason:
							rejectreason = <string>(
								$("#textareaModal").find("#txtField").val()
							);
							respondReview("reject");
						}
						if (stockTransferEditMode) {
							var remark = <string>$("#textareaModal").find("#txtField").val();
							$target = $(`#tbl${gTblName} tbody tr`)
								.eq(currentY)
								.find("td")
								.eq(9)
								.find(".remark");
							$target.data("remark", remark);
							if (remark !== "") {
								$target.val("...");
							}
						}
						if (forjournal) {
							if (selectedJournalLn1) {
								selectedJournalLn1.AllocationMemo = <string>(
									$("#textareaModal").find("#txtField").val()
								);
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
					click: closeSalesmenModal,
				},
			],
		});
	}

	if ($("#dropdownModal").length) {
		dropdownModal = $("#dropdownModal").dialog({
			width: 600,
			title: editattribute,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () {
						let $ele = dropdownModal.find(".dropdown");
						let _id: string = <string>$ele.attr("id");
						console.log("_id:" + _id);
						let _val: string = <string>$ele.val();
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
						closeDropDownModal();
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
							fordeposit || forsimplesales
						) {
							confirmPay();
						} else {
							closePayModal();
						}
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

if (!Object.entries) {
	Object.entries = function (obj) {
		var ownProps = Object.keys(obj),
			i = ownProps.length,
			resArray = new Array(i); // preallocate the Array
		while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

		return resArray;
	};
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

function initCrmUser(): ICrmUser {
	return {
		//surUID: 0,
		//surIsActive: false,
		//UserCode: "",
		//UserName: "",
		//Email: "",
		//ManagerId: 0,
		//IsActive: 0,
		//AccountProfileId: 0,
		//AssignedContactIds: [],
		//FirstName: "",
		//LastName: "",
		//surCreateBy: "",
		//CreateTimeDisplay: "",
		//surModifyBy: "",
		//ModifyTimeDisplay: "",
		//surDesc: "",
		//surNotes: "",
		//Password: "",
		//ConfirmPassword: "",
		//checkpass: false,
		//RoleTypes: [RoleType.SalesPerson],
		//GroupMemberList: [],
		//CrmSalesGroupIdList: [],
		//ManagerName: "",
		//CrmSalesGroupMemberIdList: [],
		//SalesGroup: initCrmSalesGroup(),
		//DicSalesGroup: {},
	} as ICrmUser;
}
function initCrmSalesGroup(): ICrmSalesGroup {
	return {
		Id: 0,
		sgName: "",
		sgDesc: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
	};
}
interface ICrmSalesGroup {
	Id: number;
	sgName: string;
	sgDesc: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
}
let crmuser: ICrmUser;
interface ICrmUser extends ISysUser {
	//surUID: number;
	//surIsActive: boolean;
	//UserCode: string;
	//UserName: string;
	//Email: string;
	ManagerId: number;
	//IsActive: number;
	//AccountProfileId: number;
	AssignedContactIds: Array<number>;
	//FirstName: string;
	//LastName: string;
	//surCreateBy: string;
	CreateTimeDisplay: string;
	//surModifyBy: string;
	ModifyTimeDisplay: string | null;
	//surDesc: string | null;
	//surNotes: string | null;
	//Password: string;
	ConfirmPassword: string;
	checkpass: boolean;
	RoleTypes: Array<RoleType>;
	GroupMemberList: Array<ICrmUser>;
	CrmSalesGroupIdList: Array<number>;
	ManagerName: string | null;
	CrmSalesGroupMemberIdList: Array<number>;
	SalesGroup: ICrmSalesGroup;
	DicSalesGroup: { [Key: number]: string };
}

interface IePayResult {
	Message: string;
	Status: number;
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

function initDayendCountPay(): IDayendCountPay {
	return {
		selPayMethod: "",
		selAmtSys: 0,
		selAmtCount: 0,
		isCash: 0,
	};
}

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
	salescode: string;
	TotalRemainAmt: number | null;
	rtsDvc: string;
}
function initRefundItem(): IRefundBase {
	return {
		rtlUID:0,
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
		rtlUID:0,
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
		itmNameDesc:"",
	};
}
interface IRefundSales {
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
function initCustomer(): ICustomer {
	return {
		cusIsActive: false,
		cusChgCtrl: "",
		cusCode: $("#cusCode").val() as string,
		cusName: $("#cusName").val() as string,
		cusTitle: "",
		cusFirstName: "",
		cusSurname: "",
		cusGender: "",
		cusPhone: "",
		cusFax: "",
		cusEmail: $("#cusEmail").val() as string,
		cusAddr: "",
		cusContact: "",
		cusPriceLevel: "",
		cusStatusCode: "",
		cusRmks: "",
		cusStatusAttained: null,
		cusDeposit: null,
		cusPointsSoFar: 0,
		PointsActive: 0,
		cusPointsUsed: 0,
		cusVipNextReset: null,
		CreateBy: "",
		CreateTime: null,
		ModifyBy: "",
		ModifyTime: null,
		cusLockBy: "",
		cusLockTime: null,
		cusPriceLevelID: "",
		cusCustomerID: 0,
		cusTermsID: null,
		cusDSN: "",
		AccountProfileId: 1,
		AccountProfileName: "",
		cusPriceLevelDescription: null,
		salescode: "",
		IsActive: -1,
		Staff: initCrmUser(),
		IsOrganization: "",
		cusMobile: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		cusAddrLocation: 0,
		cusAddrStreetLine1: "",
		cusAddrStreetLine2: "",
		cusAddrStreetLine3: "",
		cusAddrStreetLine4: "",
		cusAddrCity: "",
		cusAddrState: "",
		cusAddrPostcode: "",
		cusAddrCountry: "",
		cusAddrPhone1: "",
		cusAddrPhone2: "",
		cusAddrPhone3: "",
		cusAddrFax: "",
		cusAddrWeb: "",
		Address: initAddress(),
		SalesPerson: initCrmUser(),
		cusIsOrganization: true,
		CustId: 0,
		CustCode: "",
		CustName: "",
		CustPointsSoFar: 0,
		CustPointsUsed: 0,
		CustPhone: "",
		AddressList: [],
		cusSaleComment: "",
		PaymentIsDue: 0,
		BRExpiryDate: "",
		BRNo: "",
		BalanceDueDays: 0,
		IsBRexpired: false,
		cusStatus: "",
		PaymentTermsDesc: "",
		cusPhone1Whatsapp: false,
		cusPhone2Whatsapp: false,
		cusPhone3Whatsapp: false,
		IsLastSellingPrice: false,
		customerItems: [],
		CurrencyID: null,
		CurrencyCode: null,
		TaxIDNumber: null,
		TaxCodeID: 0,
		TaxPercentageRate: 0,
		ExchangeRate: 0,
		JobList: [],
		UploadFileList: [],
		FollowUpDateInfo: {} as ICustomerInfo,
		statuscls: null,
		CustomAttributes: null,
		FollowUpStatusDisplay: null,
		FollowUpDateDisplay: null,
		cusId: null,
		unsubscribe: false,
	};
}

interface ICustomer {
	cusIsActive: boolean;
	cusChgCtrl: string;
	cusCode: string;
	cusName: string;
	cusTitle: string;
	cusFirstName: string;
	cusSurname: string;
	cusGender: string;
	cusPhone: string;
	cusFax: string;
	cusEmail: string;
	cusAddr: string;
	cusContact: string;
	cusPriceLevel: string;
	cusStatusCode: string;
	cusRmks: string;
	cusStatusAttained: string | null;
	cusDeposit: number | null;
	cusPointsSoFar: number;
	PointsActive: number;
	cusPointsUsed: number;
	cusVipNextReset: string | null;
	CreateBy: string;
	CreateTime: string | null;
	ModifyBy: string;
	ModifyTime: string | null;
	cusLockBy: string;
	cusLockTime: string | null;
	cusPriceLevelID: string;
	cusCustomerID: number;
	cusTermsID: number | null;
	cusDSN: string;
	AccountProfileId: number;
	AccountProfileName: string;
	cusPriceLevelDescription: string | null;
	salescode: string;
	IsActive: number;
	Staff: ICrmUser;
	IsOrganization: string;
	cusMobile: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string;
	cusAddrLocation: number;
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
	Address: IAddress;
	SalesPerson: ICrmUser;
	cusIsOrganization: boolean;
	CustId: number;
	CustCode: string;
	CustName: string;
	CustPointsSoFar: number;
	CustPointsUsed: number;
	CustPhone: string;
	AddressList: Array<IAddressView>;
	cusSaleComment: string;
	PaymentIsDue: number;
	BRExpiryDate: string;
	BRNo: string;
	BalanceDueDays: number;
	IsBRexpired: boolean;
	cusStatus: string | null;
	PaymentTermsDesc: string | null;
	cusPhone1Whatsapp: boolean | null;
	cusPhone2Whatsapp: boolean | null;
	cusPhone3Whatsapp: boolean | null;
	IsLastSellingPrice: boolean;
	customerItems: ICustomerItem[];
	CurrencyID: number | null;
	CurrencyCode: string | null;
	TaxIDNumber: string | null;
	TaxCodeID: number | null;
	TaxPercentageRate: number | null;
	ExchangeRate: number | null;
	JobList: IMyobJob[];
	UploadFileList: string[];
	FollowUpDateInfo: ICustomerInfo;
	statuscls: string | null;
	CustomAttributes: string | null;
	FollowUpStatusDisplay: string | null;
	FollowUpDateDisplay: string | null;
	cusId: number | null;
	unsubscribe: boolean;
}
function initAddressView(): IAddressView {
	return {
		Id: 0,
		CusCode: "",
		CusAddrLocation: "",
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
interface IAddressView {
	Id: number;
	CusCode: string;
	CusAddrLocation: string;
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
		Qty: 1,
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
		AccountProfileId: 0,
		itmIsBought: $("#buy").length ? $("#buy").is(":checked") : false,
		itmIsSold: $("#sell").length ? $("#sell").is(":checked") : false,
		SellingPriceDisplay: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
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
		QtySellable: 0,
		hasSelectedIvs: false,
		singleProId: 0,
		hasItemVari: false,
		CategoryName: "",
		discpc: 0,
	};
}

interface ISimpleItem {
	itmPicFile: string | null;
	QtySellable: number;
	Qty: number;
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
}
interface IItem extends ISimpleItem {
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
	AccountProfileId: number;
	itmIsBought: boolean;
	itmIsSold: boolean;
	SellingPriceDisplay: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string;
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

	QtySellable: number;
	hasSelectedIvs: boolean;

	hasItemVari: boolean;
	//itmLastSellingPrice: number;
	//singleProId: number | null;
	//ItemPromotions: IItemPromotion[];
}
interface ILocQty {
	LocCode: string;
	Qty: number;
}

let snvt: ISnVt;
function initSnVt(): ISnVt {
	return {
		pocode: "",
		sn: "",
		vt: "",
		selected: false,
	};
}
interface ISnVt {
	pocode: string;
	sn: string;
	vt: string | null;
	selected: boolean;
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
interface ISerial extends ISnVt {
	seq: number;
	itemcode: string;
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

interface IItemSnBatVt {
	itemcode: string | number;
	batch: string | null;
	seq: number;
	snvtlist: Array<IBatSnVt>;
	validthru: string | null;
}

function initItemSnSeqVtList(): IItemSnSeqVtList {
	return {
		itemcode: "",
		seq: 0,
		snseqvtlist: [],
	};
}
interface IItemSnSeqVtList {
	itemcode: string;
	seq: number;
	snseqvtlist: Array<ISnBatSeqVt>;
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
interface ISnBatSeqVt {
	sn: string;
	batcode: string | null;
	snseq: number;
	vt: string | null;
	seq: number;
}

function initItemSnVtList(): IItemSnVtList {
	return {
		itemcode: "",
		seq: 0,
		snvtlist: [],
	};
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
interface IPaymentType {
	payId: number;
	pmtCode: string;
	Amount: number;
	pmtIsCash: boolean;
	TotalAmt: number;
}
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
	Customer: ICustomer;
	authcode: string;
	rtsInternalRmks: string;
	epaytype: string;
	SelectedDevice: string;
	SelectedShop: string;
	rtsExRate: number;
	currency: string;
	inclusiveTax: boolean;
	inclusiveTaxRate: number;
	totalAmount: number;
	receivedAmount: number;
	receiveAmount: number;
	newSales: string;
	processPayments: string;
	remainamt: number;
	Change: number;
	itemname: string;
	Roundings: number;
	totalpay: number;
	cuscode: string;
	receiptLogo: string;
	enableLogo: boolean;
	enableSerialNo: boolean;
	enableTax: boolean;
	priceEditable: boolean;
	discEditable: boolean;
	defaultCusName: string;
	defaultSalesNotes: boolean;
	defaultSalesNotesTxt: string;
	printReceiptFields: string[];
	strPrintFields: string;
	isZeroStockItem: boolean;
	lang: number;
	dicPayTypes: { [key: string]: string };
	deviceCode: string;
	rtsCode: string;
	rtsRmks: string;
	Deposit: number;
	deliveryAddressId: number;
	ireviewmode: number;
	selectedPosSalesmanCode: string | null;
	CustomerPO: string | null;
	DeliveryDate: string | null;
	saveAsPending: boolean;
	rtsSpecialApproval: boolean;
	rtsGiftOption: number;
	Mode: string;
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
interface IPurchaseReturnBase {
	pstcode: string;
	itemcode: string | number;
	seq: number;
	namedesc: string;
	batchList: Array<IBatch>;
	qty: number;
	price: number;
	discamt: number;
	discpc: number;
	taxamt: number;
	taxpc: number;
	amt: number;
	amtplustax: number;
	date: string;
	pricetxt: string;
	disctxt: string;
	taxtxt: string;
	amttxt: string;
	datetxt: string;
	returnedQty: number;
	returnedAmt: number;
	returnedDates: string;
	returnedqtyTxt: string;
	returnedamtTxt: string;
	serialNoList: Array<ISerialNo>;
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
	ASPSnippets_Pager(arg0: {
		ActiveCssClass: string;
		PagerCssClass: string;
		PageIndex: any;
		PageSize: any;
		RecordCount: any;
	});
	files({ }): any;
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

let customer: ICustomer;
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
	let _statustxt = data.IsActive == 1 ? activetxt : inactivetxt;
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
		TotalRecord:0,
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

interface IEnquiry {
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
	contactId: number;
	attrName: string;
	attrValue: string | null;
	attrType: string | null;
	attrIsDefault: boolean;
	attrIsGlobal: boolean;
	gattrId: string;
}

function plusBtn(
	btncls: string = "secondary",
	additionalcls: string = ""
): string {
	return `<button type="button" class="btn btn-${btncls} ${additionalcls}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
</svg>
              </button>`;
}

let assignedsalesmanEnqIds: number[] = [];
let icheckall: number = 0;
function handleCheckall(checked: boolean) {
	IdList = [];
	if (checked) {
		//console.log("infoblk idlist:", $infoblk.data("idlist"));
		if ($infoblk.data("idlist")) {
			IdList = $infoblk.data("idlist").split(",");
		} else {
			$(".chk").each(function (i, e) {
				IdList.push($(e).data("id"));
			});
		}
	} else {
		IdList = [];
	}

	$("#chkall").prop("checked", checked);
	//console.log("idlist:", IdList);
	icheckall = checked ? 1 : 0;

	//if (forstock) {
	//    if ($(".page").length) {
	//        $(".page").each(function (i, e) {
	//            let href: string = <string>$(e).attr("href");
	//            href += `&CheckAll=${ichecked}`;
	//            $(e).attr("href", href);
	//            console.log("href:"+$(e).attr("href"));
	//        });
	//    }
	//} else {
	if ($(".page-link").length) {
		$(".page-link").each(function (i, e) {
			let href: string = <string>$(e).attr("href");
			href += `&CheckAll=${icheckall}`;
			$(e).attr("href", href);
			console.log("href:" + $(e).attr("href"));
		});
	}
	//}
}
function handleCheckEnqAll(checked: boolean) {
	assignEnqIdList = [];
	if (checked) {
		//console.log("infoblk idlist:", $infoblk.data("idlist"));
		//if ($infoblk.data("idlist")) {
		//    let idlist: string[] = $infoblk.data("idlist").split(",");
		//    assignEnqIdList = idlist.slice(0);
		//} else {
		$(".enqchk").each(function (i, e) {
			assignEnqIdList.push($(e).data("id"));
		});
		//}
	} else {
		assignEnqIdList = [];
	}

	//$("#chkenqall").prop("checked", checked);

	//console.log("assignEnqIdList:", assignEnqIdList);
	//let ichecked = checked ? 1 : 0;

	//if ($(".page-link").length) {
	//    $(".page-link").each(function (i, e) {
	//        let href: string = <string>$(e).attr("href");
	//        href += `&CheckAll=${ichecked}`;
	//        $(e).attr("href", href);
	//        console.log($(e).attr("href"));
	//    });
	//}
}
$(".chk").on("input", function (e) {
	e.stopPropagation();
});
$(document).on("change", ".chk", function (e) {
	let _id: number = <number>$(this).data("id");
	if ($(this).is(":checked")) {
		IdList.push(_id);
	} else {
		let idx = -1;
		$.each(IdList, function (i, e) {
			if (e == _id) {
				idx = i;
				//IdList.splice(i, 1);
				return false;
			}
		});
		if (idx >= 0) {
			IdList.splice(idx, 1);
		}
	}
	//console.log("idlist:", IdList);
});
$(document).on("change", ".enqchk", function (e) {
	let _id: string = <string>$(this).data("id");
	let idx = assignEnqIdList.findIndex(x => x == _id);
	if ($(this).is(":checked")) {
		if (idx < 0)
			assignEnqIdList.push(_id);
	} else {
		if (idx >= 0) {
			assignEnqIdList.splice(idx, 1);
		}
	}
	console.log("assignEnqIdList#change:", assignEnqIdList);
});
function handleChk(checked: boolean) {
	$(".chk").each(function (i, e) {
		if (!$(e).prop("disabled") && checked) {
			$(e).prop("checked", true);
		} else {
			$(e).prop("checked", false);
		}
	});
}
function handleEnqChk(checked: boolean) {
	$(".enqchk").each(function (i, e) {
		if (!$(e).prop("disabled") && checked) {
			$(e).prop("checked", true);
		} else {
			$(e).prop("checked", false);
		}
	});
}

$(document).on("change", "#chkenqall", function () {
	let checked: boolean = $(this).is(":checked");
	handleEnqChk(checked);
	handleCheckEnqAll(checked);
});
$(document).on("change", "#chkall", function () {
	let checked: boolean = $(this).is(":checked");
	//console.log("checked", checked);
	handleChk(checked);
	handleCheckall(checked);
});

function replacebreakline(str: string) {
	return str.replace(/\r?\n/g, "<br>");
}

$(document).on("click", "#dimmedcrm", function () {
	openCrmMarketingMsg($(this).data("msg"));
});

function openCrmMarketingMsg(msg: string) {
	$.fancyConfirm({
		title: "",
		message: msg,
		shownobtn: false,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				$("#dimmedcrm").trigger("focus");
			}
		},
	});
}

function initGraphSettings(): IGraphSettings {
	return {
		Id: 0,
		gsAppName: "",
		gsAuthority: "",
		gsClientId: "",
		gsRedirectUri: "",
		gsTenantId: "",
		gsClientSecretId: "",
		gsClientSecretVal: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		gsEmailResponsible: "",
	};
}
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

function initCallHistory(): ICallHistory {
	return {
		Id: 0,
		chContactId: 0,
		chDateTime: "",
		chStatus: "",
		chDocumentName: "",
		chDocumentLink: "",
		strDateTime: "",
		chDateTimeDisplay: "",
		ContactName: "",
	};
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
let hotlist: IHotList;
let hotlistlist: Array<IHotList>;
function initHotList(ele: JQuery | null): IHotList {
	return ele === null
		? {
			Id: <number>$("#Id").val(),
			hoName: <string>$("#hoName").val(),
			hoSalesmanResponsible: <number>$("#drpSalesmen").val(),
			hoDescription: <string>$("#hoDescription").val(),
			CreateTimeDisplay: <string>$("#CreateTimeDisplay").val(),
			ModifyTimeDisplay: <string>$("#ModifyTimeDisplay").val(),
			SalesPersonName: "",
			SalesmanList: [],
		}
		: {
			Id: <number>$(ele).data("id"),
			hoName: <string>$(ele).data("name"),
			hoSalesmanResponsible: <number>$(ele).data("salesmanresponsible"),
			hoDescription: <string>$(ele).data("desc"),
			CreateTimeDisplay: <string>$(ele).data("createtime"),
			ModifyTimeDisplay: <string>$(ele).data("modifytime"),
			SalesPersonName: <string>$(ele).data("salesmanname"),
			SalesmanList: [],
		};
}
interface IHotList {
	Id: number;
	hoName: string;
	hoSalesmanResponsible: number;
	hoDescription: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	SalesPersonName: string;
	SalesmanList: Array<ICrmUser>;
}

function getGraphAuthority(tenantId: string): string {
	return (<string>$infoblk.data("defaultmsalauthority")).replace(
		"{0}",
		tenantId
	);
}

function initOneDrive(): IOneDrive {
	return {
		Id: "",
		odFileName: "",
		odFileLink: "",
		odFileWebUrl: "",
		odFileType: "",
		odFileSize: 0,
		odRemark: "",
		UploadTimeDisplay: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		folder: {},
		package: {},
	};
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

function pagingRecords(records, containername) {
	var container = $(`#pagination-${containername}`);
	var options = {
		dataSource: records,
		locator: "",
		pageSize: <number>$infoblk.data("pagesize"),
		callback: function (response, pagination) {
			//window.console && console.log(response, pagination);
			if (containername == "enquiry") {
				//populateTblmails(response);
			} else if (containername == "actionlog_contact") {
				populateTblActionLog(response, "contact");
			} else if (containername == "assignedcontacts") {
				populateTblAssignedContacts(response);
			} else if (containername == "assignedenquiries") {
				populateTblAssignedEnquiries(response);
			} else if (containername == "groupsalesmen") {
				populateTblGroupSalesmen(response);
			} else {
				populateTblonedrives(response);
			}
		},
	};

	container.addHook("beforeInit", function () {
		window.console && console.log("beforeInit...");
	});
	container.pagination(options);

	container.addHook("beforePageOnClick", function () {
		window.console && console.log("beforePageOnClick...");
	});

	$("#totalcount").text(records.length);
}

function initGCombo(id: string, _val: string = ""): IGCombo {
	return {
		id: id,
		values: _val === "" ? [] : _val.split("||"),
	};
}
interface IGCombo {
	id: string;
	values: string[];
}

function initStockFilter(
	_pageIndex: number,
	_location: string,
	_keyword: string = ""
): IStockFilter {
	return {
		pageIndex: _pageIndex,
		includeStockInfo: true,
		location: _location,
		keyword: _keyword,
	};
}
interface IStockFilter {
	pageIndex: number;
	includeStockInfo: boolean;
	location: string;
	keyword: string | null;
}

function initCustomerFormData(customer: ICustomer): ICustomerFormData {
	return {
		model: structuredClone(customer),
		addressList: [],
		__RequestVerificationToken: <string>(
			$("input[name=__RequestVerificationToken]").val()
		),
	};
}
function initContactFormData(): IContactFormData {
	return {
		model: initContact(),
		AttributeList: [],
		__RequestVerificationToken: <string>(
			$("input[name=__RequestVerificationToken]").val()
		),
	};
}
interface IBaseFormData {
	__RequestVerificationToken: string;
}
interface ICustomerFormData extends IBaseFormData {
	model: ICustomer;
	addressList: Array<IAddressView>;
}
interface IContactFormData extends IBaseFormData {
	model: IContact;
	AttributeList: Array<IAttribute>;
}

let isorgan: boolean = true;
let _firstname: string = "";
let _lastname: string = "";
let _mobilecount: number = 1;

function fillFullName() {
	let fullname = _firstname + " " + _lastname;
	$("#cusContact").val(fullname);
}

function toggleNames() {
	if (isorgan) {
		$("#namesblk").addClass("hide");
		$("#colastname").show();
		$("#cusName").trigger("focus");
	} else {
		$("#namesblk").removeClass("hide");
		$("#colastname").hide();
		$("#cusFirstName").trigger("focus");
	}
	_firstname = "";
	_lastname = "";
}

let emailsetting: IEmailSetting;
function initEmailSetting(): IEmailSetting {
	return {
		Id: <number>$("#Id").val(),
		emOffice365: <string>$("#emOffice365").val() == "True",
		iOffice365: <number>$("#iOffice365").val(),
		emSMTP_Server: <string>$("#emSMTP_Server").val(),
		emSMTP_Port: <number>$("#emSMTP_Port").val(),
		emSMTP_Auth:
			<string>$("#emOffice365").val() == "True" ||
			<string>$("#emSMTP_Auth").val() == "True",
		emSMTP_UserName: <string>$("#emSMTP_UserName").val(),
		emSMTP_Pass: <string>$("#emSMTP_Pass").val(),
		emSMTP_EnableSSL: $("#emSMTP_EnableSSL").val() == "True",
		emEmailsPerSecond: <number>$("#emEmailsPerSecond").val(),
		emMaxEmailsFailed: <number>$("#emMaxEmailsFailed").val(),
		emEmailTrackingURL: <string>$("#emEmailTrackingURL").val(),
		emEmail: <string>$("#emEmail").val(),
		emDisplayName: <string>$("#emDisplayName").val(),
		AccountProfileId: <number>$("#AccountProfileId").val(),
		emTestEmail: <string>$("#emTestEmail").val(),
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
	};
}

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

function initContact(): IContact {
	return {
		cusContactID: 0,
		AccountProfileId: 0,
		cusIsActive: false,
		cusCode: "",
		cusIsOrganization: false,
		cusName: "",
		cusFirstName: "",
		cusTitle: "",
		cusGender: "",
		cusContact: "",
		cusPhone: "",
		cusMobile: "",
		cusEmail: "",
		cusFax: "",
		cusAddrLocation: 0,
		cusAddrStreetLine1: "",
		cusAddrStreetLine2: "",
		cusAddrStreetLine3: "",
		cusAddrStreetLine4: "",
		cusAddrCity: "",
		cusAddrState: "",
		cusAddrPostcode: "",
		cusAddrCountry: "",
		cusAddrPhone1: "",
		cusAddrPhone2: "",
		cusAddrPhone3: "",
		cusAddrFax: "",
		cusAddrWeb: "",
		cusPriceLevel: "",
		cusPriceLevelID: "",
		cusPointsSoFar: 0,
		cusPointsActive: 0,
		cusPointsUsed: 0,
		CreateBy: "",
		CreateTimeDisplay: "",
		ModifyBy: "",
		ModifyTimeDisplay: "",
		cusCheckout: false,
		SalesPerson: initCrmUser(),
		NameDisplay: "",
		FrmEnquiry: false,
		SelectedType: "",
		Attributes: [],
		AttributeList: [],
		JsonDefaultAttrVals: {},
		OverWrite: false,
		JsonAttributeList: "",
		IsActive: 1,
		IsOrganization: "",
		UnsubscribeTimeDisplay: "",
		DeleteTimeDisplay: "",
		cusEblastSubscribed: false,
		Organization: "",
	};
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
	SalesPerson: ICrmUser;
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

function getDateString(format = "ymd"): string {
	var m = new Date();
	var dateString;
	if (format == "ymd") {
		dateString =
			m.getFullYear() +
			"-" +
			("0" + (m.getMonth() + 1)).slice(-2) +
			"-" +
			("0" + m.getDate()).slice(-2) +
			" " +
			("0" + m.getHours()).slice(-2) +
			":" +
			("0" + m.getMinutes()).slice(-2);
	} else {
		dateString =
			("0" + m.getDate()).slice(-2) +
			" " +
			("0" + (m.getMonth() + 1)).slice(-2) +
			"-" +
			m.getFullYear() +
			"-" +
			("0" + m.getHours()).slice(-2) +
			":" +
			("0" + m.getMinutes()).slice(-2);
	}

	return dateString;
}
let attribute: IAttribute;

function getExtension(filename) {
	var parts = filename.split(".");
	return parts[parts.length - 1];
}

function isExcel(filename) {
	var ext = getExtension(filename);
	switch (ext.toLowerCase()) {
		case "xls":
		case "xlsm":
		//default:
		case "xlsx":
			return true;
	}
	return false;
}

function isImage(filename) {
	var ext = getExtension(filename);
	switch (ext.toLowerCase()) {
		case "jpg":
		case "gif":
		case "bmp":
		case "png":
			//etc
			return true;
	}
	return false;
}

function isVideo(filename) {
	var ext = getExtension(filename);
	switch (ext.toLowerCase()) {
		case "m4v":
		case "avi":
		case "mpg":
		case "mp4":
			// etc
			return true;
	}
	return false;
}

function convertBytesInMB(bytes: number): number {
	return bytes * 1000000;
}

function searchByAttribute(attribute: IAttribute, $frm: JQuery) {
	console.log("attribute:", attribute);
	//return false;
	$frm.append(
		$("<input />")
			.attr("type", "hidden")
			.attr("name", "attrName")
			.attr("value", attribute.attrName)
	);
	$frm.append(
		$("<input />")
			.attr("type", "hidden")
			.attr("name", "attrOperator")
			.attr("value", attribute.operator)
	);
	$frm.append(
		$("<input />")
			.attr("type", "hidden")
			.attr("name", "attrVal")
			.attr("value", attribute.attrValue)
	);
	$frm.trigger("submit");
}

function blinker() {
	$(".blinking").fadeOut(1000);
	$(".blinking").fadeIn(1000);
}
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
function populateTblAssignedEnquiries(response) {
	let dataHtml: string = "";
	$.each(response, function (i, e) {
		dataHtml += `<tr class="enquiry"><td style="width:110px;max-width:110px;">${e.enEmail}</td><td style="width:80px;max-width:80px;">${e.enPhone}</td><td style="width:90px;max-width:90px;">${e.enOrganization}</td><td style="width:80px;max-width:80px;">${e.enContact}</td>`;
		//if (iscrmadmin || iscrmsalesmanager) {
		dataHtml += `<td><button class="btn btn-danger btnunassignenquiry" type="button" data-salesmanid="${selectedSalesmanId}" data-enqid="${e.Id
			}" onclick="unassignEnquiry(${selectedSalesmanId},${e.Id
			});"><span class="small">${$infoblk.data(
				"unassigntxt"
			)}</span></button></td>`;
		//}
	});
	dataHtml += "</tr>";
	$("#tblassignedEnquiries tbody").empty().html(dataHtml);
	openAssignedEnquiryModal();
}
function populateTblAssignedContacts(response: Array<IContact>) {
	let dataHtml: string = "";
	$.each(response, function (i, e) {
		let tdwidth: number = iscrmadmin || iscrmsalesmanager ? 240 : 140;
		dataHtml += `<tr class="contact"><td style="width:160px;max-width:160px;">${e.cusEmail}</td><td style="width:90px;max-width:90px;">${e.cusPhone}</td><td style="width:130px;max-width:130px;">${e.Organization}</td><td style="width:80px;max-width:80px;">${e.cusContact}</td>`;
		if (iscrmadmin || iscrmsalesmanager) {
			dataHtml += `<td style="width:${tdwidth}px;max-width:${tdwidth}px"><button type="button" class="btn btn-primary btnassigntosales mx-2" data-salesmanid="${selectedSalesmanId}" data-contactid="${e.cusContactID
				}" onclick="assignToSales(${selectedSalesmanId},${e.cusContactID
				});"><span class="small">${assigntosalesmantxt}</span></button><button type="button" class="btn btn-danger btnunassigncontact" data-salesmanid="${selectedSalesmanId}" data-contactid="${e.cusContactID
				}" onclick="unassignContactFrmSalesman(${selectedSalesmanId},${e.cusContactID
				});"><span class="small">${$infoblk.data(
					"unassigntxt"
				)}</span></button></td>`;
		}
		dataHtml += `</tr>`;
	});
	$("#tblassignedContacts tbody").empty().html(dataHtml);
	openAssignedContactModal();
}
let selectedContactId: number;
function populateTblGroupSalesmen(response: Array<ICrmUser>) {
	//console.log('response:', response);
	let dataHtml: string = "";
	$.each(response, function (i, e) {
		dataHtml += `<tr class="salesman" data-salesmanid="${e.surUID}" ondblclick="selectSales4Assign(${e.surUID});"><td style="width:100px;max-width:100px;">${e.UserCode}</td><td style="width:120px;max-width:120px;">${e.UserName}</td><td style="width:160px;max-width:160px;">${e.Email}</td><td style="width:100px;max-width:100px;">${e.ManagerName}</td><td style="width:90px;max-width:90px"><button type="button" class="btn btn-primary btnsales mx-2" data-salesmanid="${e.surUID}" onclick="selectSales4Assign(${e.surUID});"><span class="small">${selecttxt}</span></button>`;
		dataHtml += `</td></tr>`;
	});
	$("#tblgroupSalesmen tbody").empty().html(dataHtml);
	openGroupSalesmenModal();
}
function changeCheckoutPortal(portal: string, direction: string) {
	console.log("portal:" + portal);
	let url;
	switch (direction) {
		case "export":
			url = `/DataTransfer/DayendsExportFrmShop?defaultCheckoutPortal=${portal}`;
			break;
		case "import":
			url = `/DataTransfer/DayendsImportFrmCentral?defaultCheckoutPortal=${portal}`;
			break;
		default:
		case "retail":
			url = `/POSFunc/Sales?defaultCheckoutPortal=${portal}`;
			break;
	}
	window.location.href = url;
}

let dicHotListContacts: { [Key: number]: number[] } = {};
let dicEblastContacts: { [Key: number]: number[] } = {};
let CurrentEblastId: number;

let kCustomer: IKingdeeCustomer;
function initKCustomer(): IKingdeeCustomer {
	return {
		Id: 0,
		CustId: 0,
		CustCode: "",
		CustName: "",
		CustCurrency: "",
		CustEmail: "",
		CustPhone: "",
		CustMobile: "",
		CustFax: "",
		CustAddressLine1: "",
		CustAddressLine2: "",
		CustAddressLine3: "",
		CustCity: "",
		CustState: "",
		CustCountry: "",
		CustZip: "",
		CustWebsite: "",
		CustBankName: "",
		CustBankCode: "",
		CustBankAccountName: "",
		CustBankAccountCode: "",
		CustPriceLevel: "",
		CustPriceLevelID: "",
		CustPointsSoFar: 0,
		CustPointsUsed: 0,
		CustPointsActive: 0,
		CustTypeId: "",
		CustTaxTypeCode: "",
		CustTaxRateCode: "",
		CustInvoiceType: 0,
		IsCheckout: false,
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
	};
}
interface IKingdeeCustomer {
	Id: number;
	CustId: number | null;
	CustCode: string;
	CustName: string;
	CustCurrency: string;
	CustEmail: string;
	CustPhone: string;
	CustMobile: string;
	CustFax: string;
	CustAddressLine1: string;
	CustAddressLine2: string;
	CustAddressLine3: string;
	CustCity: string;
	CustState: string;
	CustCountry: string;
	CustZip: string;
	CustWebsite: string;
	CustBankName: string;
	CustBankCode: string;
	CustBankAccountName: string;
	CustBankAccountCode: string;
	CustPriceLevel: string;
	CustPriceLevelID: string;
	CustPointsSoFar: number;
	CustPointsUsed: number;
	CustPointsActive: number;
	CustTypeId: string;
	CustTaxTypeCode: string;
	CustTaxRateCode: string;
	CustInvoiceType: number | null;
	IsCheckout: boolean;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
}

function initKItemStock(): IKItemStock {
	return {
		Id: 0,
		stockId: 0,
		ItemId: 0,
		Qty: 0,
		ItemName: "",
		StockName: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
	};
}
interface IKItemStock {
	Id: number;
	stockId: number;
	ItemId: number;
	Qty: number;
	ItemName: string;
	StockName: string;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string;
}
let stock: string;

let kacctInfo: IKingdeeAccountInfo;
function initKingdeeAccountInfo(): IKingdeeAccountInfo {
	return {
		CloudUrl: "",
		DbId: "",
		LoginId: "",
		LoginPass: "",
		LangId: 0,
		OrgId: 0,
		PriceListId: "",
		EnableTax: false,
		IsPriceInclusiveTax: false,
		PriceInclusiveTaxRate: 0,
		OrgCode: "",
		PriceExclusiveTaxRate: 0,
	};
}
interface IKingdeeAccountInfo {
	CloudUrl: string;
	DbId: string;
	LoginId: string;
	LoginPass: string;
	LangId: number;
	OrgId: number;
	PriceListId: string;
	EnableTax: boolean;
	IsPriceInclusiveTax: boolean;
	PriceInclusiveTaxRate: number | null;
	OrgCode: string;
	PriceExclusiveTaxRate: number | null;
}

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
	PaymentTypes: Array<IPaymentType>;
	DicPayTypes: Array<typeof DicPayType>;
	rtsDeliveryAddressId: number | null;
	DeliveryDateDisplay: string;
	rtsCustomerPO: string;
	KSalesmanCode: string | null;
	rtsSpecialApproval: boolean;
	rtsGiftOption: number;
}

let DicPayType: { [Key: string]: string } = {};
let DicItemSNs: { [Key: string]: Array<ISerialNo> } = {};


interface IPreSales {
	Currency: string;
	NextSalesCode: string;
	authcode: string;
	TotalRemainAmt: number | null;
	PayAmt: number;
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
	lstQuantityAvailable: number;
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
	lstQuantityAvailable: number;
}
function initSalesLn(_seq: number | undefined = 0): ISalesLn {
	//console.log("Sales@initsalseln:", Sales);
	//console.log("salescode#initsalesln:" + Sales.rtsCode);\
	return {
		rtlUID: 0,
		rtlSalesLoc: "",
		rtlDvc: "",
		rtlCode: Sales ? Sales.rtsCode : "",
		rtlDate: "",
		rtlSeq: _seq === undefined || _seq == 0 ? currentY + 1 : _seq,
		rtlRefSales: "",
		rtlReasonCode: "",
		rtlItemCode: selectedItemCode
			? selectedItemCode.toString()
			: getItemCodeBySeq(),
		rtlDesc: "",
		rtlStockLoc: "",
		rtlChkBch: false,
		rtlBatchCode: "",
		rtlItemColor: "",
		rtIsConsignIn: false,
		rtlIsConsignOut: false,
		rtlIsNoCharge: false,
		rtlHasSn: false,
		rtlChkSn: false,
		rtlSnReusable: false,
		rtlTaxCode: "",
		rtlTaxPc: 0,
		rtlSellUnit: "",
		rtlRrpTaxIncl: 0,
		rtlRrpTaxExcl: 0,
		rtlLineDiscAmt: 0,
		rtlLineDiscPc: 0,
		rtlDiscSpreadPc: 0,
		rtlQty: 0,
		rtlTaxAmt: 0,
		rtlSalesAmt: 0,
		rtlIndex1: 0,
		rtlIndex2: 0,
		rtlType: "",
		rtlSellingPrice: 0,
		rtlCheckout: false,
		rtlSellingPriceMinusInclTax: 0,
		rtlParentUID: 0,
		Item: {} as IItem,
		DelItems: [] as IDeliveryItem[],
		SalesDateDisplay: "",
		DepositAmt: 0,
		JsValidThru: "",
		dlCode: "",
		ivIdList: null,
		SelectedIvList: [],
		DicItemSNs: [],
		rtlHasSerialNo: false,
		JobID: 0,
		itemVariList: [],
		batchList: [],
		SettleDateDisplay: "",
	};
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
	surUID: number;
	surIsActive: boolean;
	Password: string;
	UserCode: string;
	UserName: string;
	DisplayName: string;
	dvcCode: string;
	shopCode: string;
	kUserCode: string;
	kUserName: string;
	kSalesOrgId: number | null;
	kSalesGroupId: string;
	kSalesDeptId: string;
	UserRole: string;
	FirstName: string;
	LastName: string;
	Email: string;
	dvcIP: string;
	surNetworkName: string;
	managerId: number;
	surDesc: string | null;
	surNotes: string | null;
	AccountProfileId: number;
	surScope: string;
	surLockBy: string;
	surLockTime: string | null;
	surCreateBy: string;
	surCreateTime: string;
	surModifyBy: string;
	surModifyTime: string | null;
	surIsAbss: boolean;
	abssCardID: string;
	CustomerList: Array<ICustomer>;
	Phone: string | null;
	IsActive: number;
	ManagerName: string | null;
}
interface ISalesman extends ISysUser { }

let salesmanlist: Array<ISalesman> = [];
let selectedPosSalesmanCode: string = "";

let DicCrmSalesGroupMembers: { [Key: number]: Array<number> } = {};
let DicCrmSalesManager: { [Key: string]: number } = {};
let DicCrmGroupSalesmen: { [Key: string]: Array<ISalesman> } = {};

$(document).on("click", ".linkdisabled", function () {
	return false;
});

function initSelectListItem(): ISelectListItem {
	return {
		Disabled: false,
		Selected: false,
		Text: "",
		Value: "",
	};
}
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
	FileList: string[];
	pstAmount: number;
	pstPartialAmt: number | null;
}
function initPurchaseItem(): IPurchaseItem {
	return {
		pstId: 0,
		pstCode: "",
		itmCode: selectedItemCode
			? selectedItemCode.toString()
			: getItemCodeBySeq(),
		piSeq: currentY + 1,
		piBaseUnit: "",
		piQty: 0,
		batchList: [],
		piHasSN: false,
		piValidThru: null,
		piUnitPrice: 0,
		piDiscPc: 0,
		piTaxPc: 0,
		piTaxAmt: 0,
		piAmt: 0,
		piAmtPlusTax: 0,
		piReceivedQty: 1,
		piStatus: "",
		itmName: "",
		itmDesc: "",
		itmUseDesc: false,
		itmNameDesc: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		JsValidThru: "",
		ValidThruDisplay: "",
		snbatseqvtlist: [],
		SerialNoList: [],
		returnedQty: 0,
		returnableQty: 0,
		qtyToReturn: 0,
		pstPurchaseDate: new Date(),
		PurchaseDateDisplay: "",
		piStockLoc: "",
		JobID: 0,
		vtList: [],
		comboIvId: "",
		SelectedIvList: [],
		hasSelectedIvs: false,
		singleProId: 0,
		poItemVariList: [],
		ivBatCode: "",
		Item: initItem(),
	};
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
function getCurrentY(ele) {
	return (
		parseInt(
			$(ele).parent("td").parent("tr").find("td:eq(0)").find("span").text()
		) - 1
	);
}
let ReturnableItemList: Array<IPurchaseItem> = [];

function handleQtyChange(this: any) {
	/*console.log("here");*/
	getRowCurrentY.call(this);
	let _qty: number = Number($(this).val());
	// console.log("_qty:" + _qty);
	if (forsales) {
		const qtysellable: number = Number($(this).data("qtysellable"));
		// console.log("qtysellable:" + qtysellable);
		if (_qty > qtysellable) {
			_qty = qtysellable;
			$(this).val(_qty);
		}
	}
	/*$tr = $(`#${gTblName} tbody tr`).eq(currentY);*/

	let _price: number = Number($tr.find(".price").val());

	let _discpc: number = Number($tr.find(".discpc").val());
	// console.log("price#qty change:" + _price + ";_discpc:" + _discpc);

	if (forpurchase) {
		/*	if (Purchase.pstStatus !== "order"&&Purchase.pstStatus!=="created"&&Purchase.pstStatus!=="draft")*/
		let $received = $tr.find(".received");
		if ($received.length) $received.attr("max", _qty).val(_qty);


		updateRow(_price, _discpc);
		seq = currentY + 1;
		if (Purchase.PurchaseItems.length > 0) {
			$.each(Purchase.PurchaseItems, function (i, e) {
				if (e.piSeq == seq) {
					e.piQty = e.piReceivedQty = _qty;
					selectedPurchaseItem = structuredClone(e);
					// updateRow();
					return false;
				}
			});
		}
	}

	if (forwholesales) {
		if (Wholesales.wsStatus == "invoice")
			$tr.find("td").last().find(".received").attr("max", _qty).val(_qty);

		updateRow(_price, _discpc);

		seq = currentY + 1;
		if (WholeSalesLns.length > 0) {
			$.each(WholeSalesLns, function (i, e) {
				if (e.wslSeq == seq) {
					if (Wholesales.wsStatus == "invoice") {
						e.wslDelQty = _qty;
					} else {
						e.wslQty = _qty;
					}
					selectedWholesalesLn = structuredClone(e);
					return false;
				}
			});
		}
	}

	if (forsales || forpreorder) {
		let $rows = $(`#${gTblName} tbody tr`);
		$tr = $rows.eq(currentY);
		const $price = $tr.find("td").eq(9).find(".price");
		const $discount = $tr.find("td").eq(10).find(".discpc");
		if ($(this).data("proqty")) {
			const proqty: number = Number($(this).data("proqty"));
			// console.log("here");
			if (_qty >= proqty) {
				if ($(this).data("proprice")) {
					const proprice: string = formatnumber($(this).data("proprice"));
					const originalprice = Number($price.val());
					$price
						.data("originalprice", originalprice)
						.val(proprice)
						.trigger("change");
					return false;
				}
				if ($(this).data("prodiscpc")) {
					const prodiscpc: string = formatnumber($(this).data("prodiscpc"));
					const originaldiscpc: number = Number($discount.val());
					$discount
						.data("originaldiscpc", originaldiscpc)
						.val(prodiscpc)
						.trigger("change");
					return false;
				}
			} else {
				if ($(this).data("proprice")) {
					$price
						.val(formatnumber($price.data("originalprice")))
						.trigger("change");
					return false;
				}
				if ($(this).data("prodiscpc")) {
					$discount
						.val(formatnumber($discount.data("originaldiscpc")))
						.trigger("change");
					return false;
				}
			}
		} else {
			if (_qty === 0) {
				$tr.remove();
				$rows = $(`#${gTblName} tbody tr`);
				//console.log(`rows length after remove:${$rows.length}`);
				selectedItemCode = "";
				selectedSalesLn = {} as ISalesLn;
				$.each($rows, function (i, e) {
					//console.log('i:' + i);
					$(e).data("idx", i);
					$(e)
						.find("td:first")
						.find("span")
						.text(i + 1);
				});
				focusItemCode();
				return;
			} else {
				updateRow(_price, _discpc);
			}
		}
	}
}
$(document).on("change", ".qty", function () {
	handleQtyChange.call(this);
});

$(document).on("change", ".location", function (e) {
	handleLocationChange(e);
});

$(document).on("change", ".price", function (e) {
	// console.log("price changed");
	handlePriceChange(e);
});

$(document).on("change", ".discpc", function (e) {
	// console.log("disc changed");
	handleDiscChange(e);
});

$(document).on("change", ".taxpc", function () {
	//console.log("here");
	handleTaxChange.call(this);
});

function handleTaxChange(this: any) {
	currentY = getCurrentY(this);
	//console.log("here");
	//console.log("price:" + getRowPrice());
	//console.log("discpc:" + getRowDiscPc());
	updateRow(getRowPrice(), getRowDiscPc());
}

function getDicItemOptionsVariByCodes(
	itemcodelist: string[],
	$rows: JQuery,
	currentItemCount: number
) {
	var itemcodes = itemcodelist.join();
	$.ajax({
		type: "GET",
		url: "/Api/GetItemOptionsByCodes",
		data: { itemcodes },
		success: function (data: typeof DicItemOptions) {
			DicItemOptions = structuredClone(data);
			$rows.each(function (i, e) {
				let batcls = "";
				let sncls = "";
				let vtinput = "";
				let vtdisabled = "";
				let pointercls = "";
				if (i < currentItemCount) {
					selectedItemCode = $(e)
						.find("td:eq(1)")
						.find(".itemcode")
						.val() as string;
					itemOptions = !$.isEmptyObject(DicItemOptions)
						? DicItemOptions[selectedItemCode]
						: null;
					if (itemOptions) {
						batcls = itemOptions.ChkBatch ? "pobatch pointer focus" : "";
						if (itemOptions.ChkSN) {
							sncls = "posn pointer focus";
						}
						vtdisabled =
							itemOptions.ChkBatch || itemOptions.ChkSN ? "disabled" : "";
						pointercls =
							itemOptions.ChkBatch || itemOptions.ChkSN ? "" : "pointer";
						vtinput = itemOptions.WillExpire
							? `<input type="datetime" class="text-center datepicker validthru ${pointercls} focus " ${vtdisabled} />`
							: "";
					}
				}
				let html = `<td><input type="text" class="text-center ${batcls}" readonly /></td><td data-serialno=""><input type="text" class="text-center ${sncls}" readonly /></td><td class="text-center" data-validthru="">${vtinput}</td>`;

				//itemvari
				let varicls = "";
				if (
					!$.isEmptyObject(DicItemGroupedVariations) &&
					selectedItemCode in DicItemGroupedVariations
				)
					varicls = "povari pointer focus";
				if (
					itemOptions?.ChkBatch &&
					!$.isEmptyObject(DicItemGroupedVariations) &&
					selectedItemCode in DicItemGroupedVariations
				)
					varicls = "povari pointer focus";
				//console.log("DicItemGroupedVariations:", DicItemGroupedVariations);
				html += `<td><input type="text" class="text-center ${varicls}" readonly /></td>`;

				let $cell = $(e).find("td").eq(4);
				$cell.after(html);
				let qty: number = Number($cell.find(".qty").val());
				$(e).append(
					`<td data-received=""><input type="number" min="0" max="${qty}" class="text-right received" style="width:90px!important;" value="${qty}"></td>`
				);

				let seq = ($(e).data("idx") as number) + 1;
				$.each(Purchase.PurchaseItems, function (k, v) {
					if (v.piSeq == seq) {
						v.piReceivedQty = qty;
					}
				});
			});

			selectedItemCode = "";
			$target.find("colgroup").find(".hide").removeClass("hide");
			setValidThruDatePicker();
		},
		dataType: "json",
	});
}

let copiedItem: IItem;


function handleItmCodeSelected(
	el: HTMLElement
) {
	//let comboIvId: string = "";
	//let selectedIvList: IItemVariation[] = [];
	$tr = $(el);
	selectedItemCode = $tr.data("code");
	//console.log("selectedItemCode:" + selectedItemCode); return false;	
	closeItemModal();
	seq = currentY + 1;
	if (forsales || forpreorder || forwholesales || forpurchase) {
		GetSetSelectedLns(null);
	}
	else {
		copiedItem = $.grep(ItemList, function (e: IItem, i: number) {
			return (
				e.itmCode.toString() == selectedItemCode.toString() &&
				e.AccountProfileId == AccountProfileId
			);
		})[0];
		if (typeof copiedItem === "undefined") {
			searchItem();
		}
		copyItemAccount();
		toggleItemCodeChange();
	}

}
$(document).on("dblclick", ".itmcode", function () {
	selectedItemCode = $(this).data("code").toString();
	handleItmCodeSelected(this);
});


$(document).on("click", ".proItem", function (e) {
	handleProItemClick(e);
});


function toggleItemCodeChange(proId: number | null = 0) {
	$(".itemcode").off("change");
	populateItemRow(proId);
	$(".itemcode").on("change", handleItemCodeChange);
}

function handleProItemClick(e: any) {
	e.stopPropagation();
	$target = $(e.target);
	isPromotion = true;
	selectedItemCode = $target.data("code");
	let proId = $target.data("proid");
	//console.log("proId:" + proId);
	//console.log(selectedItemCode);
	closeItemModal();
	seq = currentY + 1;
	if (forsales || forpreorder || forwholesales || forpurchase) {
		GetSetSelectedLns(proId);
	}
}


let itemPromotion: IItemPromotion | null;
let isPromotion: boolean = false;
let selectedProId: number = 0;

function GetSetSelectedLns(proId: any) {
	if (forsales) {
		selectedSalesLn = GetSetSelectedSalesLn();
		selectedSalesLn!.Item = ItemList.find((x) => x.itmCode == selectedItemCode)!;
	}
	if (forpreorder) {
		selectedPreSalesLn = GetSetSelectedPreSalesLn();
		selectedPreSalesLn!.Item = ItemList.find(
			(x) => x.itmCode == selectedItemCode
		)!;
	}
	if (forwholesales) {
		selectedWholesalesLn = GetSetSelectedWholeSalesLn();
		selectedWholesalesLn!.Item = ItemList.find(
			(x) => x.itmCode == selectedItemCode
		)!;
	}
	if (forpurchase) {
		selectedPurchaseItem = GetSetSelectedPurchaseItem();
		selectedPurchaseItem!.Item = ItemList.find(
			(x) => x.itmCode == selectedItemCode
		)!;
	}

	toggleItemCodeChange(proId);
}

function populateItemRow(proId: number | null = 0, triggerChange: boolean = true) {
	//console.log("here");
	//console.log("selectedItemCode:" + selectedItemCode);
	if (!selectedItemCode) return false;

	let $rows = $(`#${gTblName} tbody tr`);
	let $target = $rows.eq(currentY);
	seq = currentY + 1;
	$target.data("qty", 1);

	let qty: number = 1,
		qtysellable: number = 0,
		price: number = 0,
		discpc: number = 0,
		taxrate: number = 0;

	let amount: number = 0;
	let namedesctxt: string;
	let namedesc: string = "";

	selectedProId = proId ?? 0;
	//console.log("selectedSalesLn!.Item:", selectedSalesLn!.Item);
	if (forsales) {
		console.log("selectedSalesLn#popu:", selectedSalesLn);
		discpc = (selectedSalesLn && selectedSalesLn!.rtlLineDiscPc) ?? 0;
		if (reviewmode) { //salesorderlist
			selectedSimpleSalesLn!.rtlSeq = seq;
			selectedSimpleSalesLn!.Item.singleProId = proId;
			taxrate =
				enableTax && selectedCus && selectedSimpleSalesLn!.Item.itmIsTaxedWhenSold
					? selectedCus.TaxPercentageRate!
					: 0;
			namedesc = selectedSimpleSalesLn!.Item.NameDesc;
			qtysellable = selectedSimpleSalesLn!.Item.QtySellable;
		} else {
			selectedSalesLn!.rtlSeq = seq;
			selectedSalesLn!.Item.singleProId = proId;
			taxrate =
				enableTax && selectedCus && selectedSalesLn!.Item.itmIsTaxedWhenSold
					? selectedCus.TaxPercentageRate!
					: 0;
			namedesc = selectedSalesLn!.Item.NameDesc;
			qtysellable = selectedSalesLn!.Item.QtySellable;
		}

	}
	if (forpreorder && selectedPreSalesLn) {
		discpc = selectedPreSalesLn!.rtlLineDiscPc ?? 0;
		selectedPreSalesLn!.rtlSeq = seq;
		selectedPreSalesLn!.Item.singleProId = proId;
		taxrate =
			enableTax && selectedCus && selectedPreSalesLn!.Item.itmIsTaxedWhenSold
				? selectedCus.TaxPercentageRate!
				: 0;
		namedesc = selectedPreSalesLn!.Item.NameDesc;
		qtysellable = selectedPreSalesLn!.Item.QtySellable;
	}
	if (forwholesales && selectedWholesalesLn) {
		discpc = selectedWholesalesLn!.wslLineDiscPc ?? 0;
		selectedWholesalesLn!.wslSeq = seq;
		selectedWholesalesLn!.Item.singleProId = proId;
		taxrate =
			enableTax &&
				selectedCus &&
				selectedWholesalesLn!.Item.itmIsTaxedWhenSold
				? selectedCus.TaxPercentageRate!
				: 0;
		namedesc = selectedWholesalesLn!.Item.NameDesc;
		qtysellable = selectedWholesalesLn!.Item.QtySellable;
	}
	if (forpurchase && selectedPurchaseItem) {
		discpc = selectedPurchaseItem!.piDiscPc ?? 0;
		selectedPurchaseItem!.piSeq = seq;
		taxrate =
			enableTax &&
				SelectedSupplier &&
				selectedPurchaseItem!.Item.itmIsTaxedWhenBought
				? SelectedSupplier.TaxPercentageRate!
				: 0;
		namedesc = selectedPurchaseItem!.Item.NameDesc;
	}

	const rowcls: string = isPromotion ? "promotion" : "";
	$target.find("td").first().addClass(rowcls);

	namedesctxt = handleItemDesc(namedesc);

	let idx = 1;
	$target.find(`td:eq(${idx})`).find(".itemcode").val(selectedItemCode);
	idx++;
	$target
		.find(`td:eq(${idx})`)
		.find(".itemdesc")
		.data("itemname", namedesctxt)
		.attr("title", namedesc)
		.val(namedesctxt);
	idx++;
	if (forpurchase) {
		$target
			.find(`td:eq(${idx})`)
			.find(".baseunit")
			.data("baseunit", selectedPurchaseItem!.Item.itmBuyUnit)
			.val(selectedPurchaseItem!.Item.itmBuyUnit);
	}

	let sellunit = "";
	if (forwholesales) {
		sellunit = selectedWholesalesLn!.Item.itmSellUnit;
	}
	if (forsales) {
		sellunit = reviewmode ? selectedSimpleSalesLn!.Item.itmSellUnit : selectedSalesLn!.Item.itmSellUnit;
	}
	if (forpreorder) {
		sellunit = selectedPreSalesLn!.Item.itmSellUnit;
	}

	$target
		.find(`td:eq(${idx})`)
		.find(".sellunit")
		.data("sellunit", sellunit)
		.val(sellunit);

	// console.log(seqitem!.ItemPromotions);
	let proqty: number = 0;
	let proprice: number | null = 0;
	let prodiscpc: number | null = 0;
	if (isPromotion) {
		//console.log("proId:" + proId);
		if (forsales) {
			if (reviewmode) getItemPromotion(selectedSimpleSalesLn!.Item, proId!);
			else getItemPromotion(selectedSalesLn!.Item, proId!);
		}
		if (forpreorder) {
			getItemPromotion(selectedPreSalesLn!.Item, proId!);
		}
		if (forwholesales) {
			getItemPromotion(selectedWholesalesLn!.Item, proId!);
		}
		proqty = itemPromotion!.proQty!;
		proprice = itemPromotion!.proDiscPc === 0 ? itemPromotion!.proPrice : 0;
		prodiscpc = itemPromotion!.proDiscPc! > 0 ? itemPromotion!.proDiscPc : 0;
	}

	idx++;
	let $qty = $target.find(`td:eq(${idx})`).find(".qty");
	$qty.off("change");
	$qty.val(qty).data({
		proqty: proqty,
		proprice: proprice,
		prodiscpc: prodiscpc,
		qtysellable: qtysellable,
	});
	$qty.on("change", handleQtyChange);

	let batmsg: string = "";
	let snmsg: string = "";
	let vtmsg: string = "";
	let missingtxt: string = "";
	let batcls = "batch";
	let sncls = "serialno";
	let vtcls = "datepicker validthru";
	let pointercls = "";

	itemOptions = DicItemOptions[selectedItemCode];

	//console.log(itemOptions);
	idx++;
	const $bat = $target.find("td").eq(idx).find(".batch");
	idx++;
	const $sn = $target.find("td").eq(idx).find(".serialno");
	idx++;
	const $vt = $target.find("td").eq(idx).find(".validthru");
	idx++;
	const $iv = $target.find("td").eq(idx).find(".vari");

	const readonly =
		!itemOptions.ChkBatch && !itemOptions.ChkSN && !itemOptions.WillExpire
			? ""
			: "readonly";
	const nonitemoptionscls =
		!itemOptions.ChkBatch && !itemOptions.ChkSN && !itemOptions.WillExpire
			? "nonitemoptions"
			: "";

	if ((forsales && !reviewmode) || (forpreorder && PreSales.rtsStatus == SalesStatus.presettling)) {
		$bat.data("type", "bat");
		if (itemOptions.ChkBatch) {
			batcls = `batch pointer focus`;
			//console.log("selectedItemCode:" + selectedItemCode);
			//console.log("DicItemBatchQty[selectedItemCode].length:", DicItemBatchQty[selectedItemCode].length);
			if (DicItemBatchQty[selectedItemCode].length === 0) {
				missingtxt = itemoptionsinfomissingformat.replace("{0}", batchtxt);
				batcls = "itemoptionmissing";
				batmsg = `${missingtxt} ${purchaserequiredmsg}`;
			}
			//console.log("batcls:" + batcls);
			$bat.addClass(batcls);
		}
		else {
			$bat.removeClass("pointer focus");
			if (
				!itemOptions.ChkBatch &&
				!itemOptions.ChkSN &&
				!itemOptions.WillExpire
			)
				$bat.addClass(nonitemoptionscls);
		}
		if (readonly !== "") $bat.prop("readonly", true);
		$bat.prop("title", batmsg);
	}
	else {
		if (reviewmode) {
			if (itemOptions.ChkBatch) $bat.addClass("pointer").val("...");
		} else {
			if (itemOptions.ChkBatch) $bat.addClass("focus");
			else $bat.removeClass("batch pointer");
		}
	}

	if ((forsales && !reviewmode) || (forpreorder && PreSales.rtsStatus == SalesStatus.presettling)) {
		$sn.data("type", "sn");

		if (itemOptions.ChkSN) {
			sncls = `serialno pointer focus`;
			if (itemOptions.ChkBatch) {
				if (DicItemSnVtList[selectedItemCode].length === 0) {
					missingtxt = itemoptionsinfomissingformat.replace(
						"{0}",
						serialnotxt
					);
					sncls = "itemoptionmissing";
					snmsg = `${missingtxt} ${purchaserequiredmsg}`;
				} else {
					sncls = "focus";
				}
			} else {
				if (DicItemSnVtList[selectedItemCode].length === 0) {
					missingtxt = itemoptionsinfomissingformat.replace(
						"{0}",
						serialnotxt
					);
					sncls = "itemoptionmissing";
					snmsg = `${missingtxt} ${purchaserequiredmsg}`;
				}
			}
			$sn.addClass(sncls);
		} else {
			$sn.removeClass("pointer focus");
			if (
				!itemOptions.ChkBatch &&
				!itemOptions.ChkSN &&
				!itemOptions.WillExpire
			)
				$sn.addClass(nonitemoptionscls);
		}

		if (readonly !== "") {
			$sn.prop("readonly", true);
		}
		$sn.prop("title", snmsg);
	}
	else {
		if (reviewmode) {
			if (itemOptions.ChkSN) $sn.addClass("pointer").val("...");
		}
		else {
			if (itemOptions.ChkSN) {
				$sn.addClass("focus");
				if (itemOptions.ChkBatch) $sn.removeClass("pointer");
			} else {
				$sn.removeClass("serialno pointer");
			}
		}
	}

	if ((forsales && !reviewmode) || (forpreorder && PreSales.rtsStatus == SalesStatus.presettling)) {
		$vt.data("type", "vt");

		let vtdisabled = "";
		if (itemOptions.WillExpire) {
			vtdisabled =
				!itemOptions.ChkBatch && !itemOptions.ChkSN
					? "disabled"
					: itemOptions.ChkBatch || itemOptions.ChkSN
						? "disabled"
						: "";
			vtcls = "validthru datepicker focus";
			pointercls =
				itemOptions.ChkBatch || itemOptions.ChkSN ? "" : "pointer";
			if (!(selectedItemCode in DicItemVtQtyList)) {
				missingtxt = itemoptionsinfomissingformat.replace(
					"{0}",
					expirydatetxt
				);
				vtmsg = `${missingtxt} ${purchaserequiredmsg}`;
				vtcls = "itemoptionmissing";
			} else {
				if (
					DicItemVtQtyList[selectedItemCode].length === 0 &&
					!itemOptions.ChkBatch &&
					!itemOptions.ChkSN
				) {
					missingtxt = itemoptionsinfomissingformat.replace(
						"{0}",
						expirydatetxt
					);
					vtmsg = `${missingtxt} ${purchaserequiredmsg}`;
					vtcls = "itemoptionmissing";
				}
			}

			vtcls += ` ${pointercls}`;
		} else {
			$vt.removeClass("pointer focus").datepicker("disable");
			if (
				!itemOptions.ChkBatch &&
				!itemOptions.ChkSN &&
				!itemOptions.WillExpire
			)
				$vt.addClass(nonitemoptionscls);
		}

		if (vtdisabled !== "") $vt.datepicker("disable");

		if (readonly !== "") $vt.prop("readonly", true);

		$vt.addClass(vtcls).prop("title", vtmsg);
	}
	else {
		if (reviewmode) {
			if (itemOptions.WillExpire) $vt.addClass("pointer").val("...").datepicker("disable");
		} else {
			if (itemOptions.WillExpire) {
				if (itemOptions.ChkBatch || itemOptions.ChkSN) {
					$vt.removeClass("pointer").datepicker("disable");
				}
			} else {
				$vt.removeClass("validthru pointer").datepicker("disable");
			}
		}
	}

	idx++;
	if ((forsales && !reviewmode) || (forpreorder && PreSales.rtsStatus == SalesStatus.prestart) || forwholesales) {
		let itemcode = selectedItemCode;
		let ivpointer =
			!itemOptions.ChkBatch && !itemOptions.ChkSN && !itemOptions.WillExpire
				? "pointer"
				: "";
		//console.log("ivpointer:" + ivpointer);
		let ivcls =
			!$.isEmptyObject(DicIvInfo) &&
				itemcode in DicIvInfo &&
				DicIvInfo[itemcode].length > 0
				? `focus ${ivpointer}`
				: "disabled";
		//itemvari
		$iv.addClass(ivcls);
	}
	if (forsales && reviewmode) {
		const vari = selectedSimpleSalesLn!.ivIdList ? "..." : "";
		$iv.addClass("pointer").val(vari);
	}

	if (forsales || forpreorder || forpurchase || forwholesales) {
		if (forpurchase)
			idx =
				editmode && Purchase.pstStatus !== "order"
					? PriceIdx4PstBill
					: PriceIdx4PstOrder;
		if (forwholesales)
			idx =
				editmode && Wholesales.wsStatus == "invoice"
					? PriceIdx4WsInvoice
					: PriceIdx4WsOrder;

		if (forsales || forpreorder) {
			idx = PriceIdx4Sales;
			if (selectedItemCode.toString().startsWith("/")) {
				price = 0;
			} else {
				if (selectedCus.cusCode.toLowerCase() !== "guest") {
					//console.log("selectedCus:", selectedCus);
					if (selectedCus.customerItems) {
						const proItems = selectedCus.customerItems.filter(
							(x) => x.itmCode == selectedItemCode
						);
						const proItem =
							proItems != null && proItems.length ? proItems[0] : null;
						if (proItem == null) {
							//console.log(selectedSalesLn!.Item);
							price = forsales
								? getActualPrice(selectedSalesLn!.Item)
								: getActualPrice(selectedPreSalesLn!.Item);
							$target.find("td").first().removeClass("lastsellingprice");
						} else {
							price = proItem.LastSellingPrice;
							$target.find("td").first().addClass("lastsellingprice");
						}
					} else {
						//console.log(selectedPreSalesLn!.Item.itmBaseSellingPrice);
						price = forsales
							? reviewmode ? getActualPrice(selectedSimpleSalesLn!.Item) : getActualPrice(selectedSalesLn!.Item)
							: getActualPrice(selectedPreSalesLn!.Item);
						$target.find("td").first().removeClass("lastsellingprice");
					}
				} else {
					price = forsales
						? reviewmode ? getActualPrice(selectedSimpleSalesLn!.Item) : getActualPrice(selectedSalesLn!.Item)
						: getActualPrice(selectedPreSalesLn!.Item);
					$target.find("td").first().removeClass("lastsellingprice");
				}
			}
			//price = price * exRate;
			//console.log("price:" + price);
			if (forsales) reviewmode ? selectedSimpleSalesLn!.rtlSellingPrice = price : selectedSalesLn!.rtlSellingPrice = price;
			if (forpreorder) selectedPreSalesLn!.rtlSellingPrice = price;
		}

		if (forpurchase) {
			//console.log("selectedPurchaseItem!.Item:", selectedPurchaseItem!.Item);
			price = Number(selectedPurchaseItem!.Item.itmBuyStdCost);
			//console.log("price#popu:" + price);
			selectedPurchaseItem!.piUnitPrice = price;
		}
		if (forwholesales) {
			price = Number(selectedWholesalesLn!.Item.itmBaseSellingPrice);
			selectedWholesalesLn!.wslSellingPrice = price;
		}

		price = price / exRate;
		let $price = $target
			.find("td")
			.eq(idx)
			.find(".price");
		$price.off("change");
		$price.data("price", price)
			.val(formatnumber(price));
		$price.on("change", handlePriceChange);

		idx++;
		if (isPromotion && proId) {
			//if (forsales) getItemPromotion(selectedSalesLn!.Item, proId);
			//if (forpreorder)
			//	getItemPromotion4SimpleItem(selectedPreSalesLn!.Item, proId);
			if (itemPromotion && itemPromotion.pro4Period) {
				discpc = itemPromotion.proDiscPc!;
			}
		}

		let $discpc = $target.find("td").eq(idx).find(".discpc");
		$discpc.off("change");
		//console.log("formated discpc:" + formatnumber(discpc));
		$discpc.data("discpc", discpc).val(formatnumber(discpc));
		$discpc.on("change", handleDiscChange);
		//console.log("$discpc val:" + $discpc.val());

		//console.log("enableTax:", enableTax);
		if (!enableTax && triggerChange) $discpc.trigger("change");

		idx++;
		if (enableTax && !inclusivetax) {
			let $tax = $target
				.find("td")
				.eq(idx)
				.find(".taxpc");

			$tax.off("change");
			$tax.data("taxpc", taxrate)
				.prop("readonly", true)
				.val(formatnumber(taxrate));
			$tax.on("change", handleTaxChange);

			//console.log("triggerChange:", triggerChange);
			if (triggerChange) $tax.trigger("change");
		}

		if (forsales || forpurchase || forwholesales || forpreorder) {
			amount = calAmountPlusTax(qty, price, taxrate, discpc);
			//console.log("amount:" + amount);
		}

		itotalamt += amount;
		if (typeof itotalamt != "number") {
			alert("itotalamt is not a number type!");
			return false;
		}

		$target
			.find("td")
			.last()
			.find(".amount")
			.data("amt", amount)
			.data("amount", amount)
			.val(formatnumber(amount));
	}

	// updateRow();
	// isPromotion = false;

	selectedItemCode = "";
	selectedSalesLn = null;
	selectedWholesalesLn = null;
	selectedPurchaseItem = null;
	selectedPreSalesLn = null;

	if ($rows.eq($rows.length).length) {
		focusItemCode($rows.length);
	} else if ($rows.eq(currentY + 1).length) {
		if (
			$rows
				.eq(currentY + 1)
				.find("td:eq(1)")
				.find(".itemcode")
				.val() !== ""
		) {
			if (!$rows.eq($rows.length - 1).length) {
				addRow();
			}
		} else {
			focusItemCode(currentY + 1);
		}
	} else {
		addRow();
	}
}

function getItemPromotion(item: IItem | ISimpleItem, proId: number) {
	if (isPromotion && item.ItemPromotions) {
		// console.log("seqitem itempromotions:", seqitem.ItemPromotions);
		itemPromotion = item.ItemPromotions.filter(function (el) {
			return el.proId == proId;
		})[0];
		// console.log(itemPromotion);
	}
}
function addRow() {
	$target = $(`#${gTblName} tbody`);
	let idx = $target.find("tr").length;
	let i = idx + 1;
	let html = "";
	html =
		'<tr class="" data-idx="' +
		idx +
		'" data-amt="0" data-amtplustax="0"><td><span>' +
		i +
		'</span></td><td><input type="text" name="itemcode" class="itemcode text-center flex" /></td><td><input type="text" class="itemdesc small flex text-center" data-itemname="" /></td>';
	if (forpurchase) {
		html += `<td><input type="text" class="baseunit text-right flex" data-baseunit="" /></td>`;
	}
	if (forsales || forwholesales || fordelivery || forpreorder) {
		html += `<td><input type="text" class="sellunit text-right flex" data-sellunit="" /></td>`;
	}
	if (forsales || forwholesales || forpreorder)
		html += `<td><input type="number" data-qty="0" name="qty" class="qty text-right flex" /></td>`;
	else
		html += `<td><input type="number" min="0" data-qty="0" name="qty" class="qty text-right flex" /></td>`;

	if (
		(forwholesales && editmode && Wholesales.wsStatus == "invoice") ||
		fordelivery ||
		(forpurchase &&
			editmode &&
			Purchase.pstStatus !== "order" &&
			Purchase.pstStatus.toLowerCase() !== "requesting" &&
			Purchase.pstStatus.toLowerCase() !== "created" &&
			Purchase.pstStatus.toLowerCase() !== "rejected")
	) {
		html += `<td><input type="text" name="batch" class="batch text-center pointer flex" readonly /></td>`;
	}
	if (forsales)
		html += `<td><input type="text" class="batch text-center flex" /></td>`; //to be added other classes later

	let disabled =
		PreSales && PreSales.rtsStatus == SalesStatus.presettling ? "" : "disabled";
	if (forpreorder) {
		let batcls =
			PreSales.rtsStatus == SalesStatus.presettling ? "batch" : `b ${disabled}`;
		html += `<td><input type="text" class="${batcls} text-center flex"  ${disabled} /></td>`;
	}

	if (
		(forpurchase &&
			editmode &&
			Purchase.pstStatus !== "order" &&
			Purchase.pstStatus.toLowerCase() !== "requesting" &&
			Purchase.pstStatus.toLowerCase() !== "created" &&
			Purchase.pstStatus.toLowerCase() !== "rejected") ||
		(forwholesales && editmode && Wholesales.wsStatus == "invoice") ||
		fordelivery
	) {
		html +=
			'<td><input type="text" name="serailno" readonly class="serialno text-center pointer flex" /></td>';
	}
	if (forsales)
		html += `<td><input type="text" class="serialno text-center flex" /></td>`; //to be added other classes later

	if (forpreorder) {
		let sncls =
			PreSales.rtsStatus == SalesStatus.presettling
				? "serialno"
				: `s ${disabled}`;
		html += `<td><input type="text" class="${sncls} text-center flex" ${disabled} /></td>`;
	}

	if (
		forpurchase &&
		editmode &&
		Purchase.pstStatus !== "order" &&
		Purchase.pstStatus.toLowerCase() !== "requesting" &&
		Purchase.pstStatus.toLowerCase() !== "created" &&
		Purchase.pstStatus.toLowerCase() !== "rejected"
	) {
		html +=
			'<td><input type="datetime" name="validthru" class="validthru small datepicker text-center pointer flex" /></td>';
	}

	let vtcls = "validthru "; //don't add small here!
	if (
		forwholesales &&
		Wholesales.wsStatus != "order" &&
		Wholesales.wsStatus.toLowerCase() !== "requesting" &&
		Wholesales.wsStatus.toLowerCase() !== "created" &&
		Wholesales.wsStatus.toLowerCase() !== "rejected"
	) {
		vtcls += "pointer";
	}
	if (
		forsales ||
		(forwholesales &&
			Wholesales.wsStatus != "order" &&
			Wholesales.wsStatus.toLowerCase() !== "requesting" &&
			Wholesales.wsStatus.toLowerCase() !== "created" &&
			Wholesales.wsStatus.toLowerCase() !== "rejected")
	)
		html += `<td><input type="text" class="${vtcls.trim()} text-center flex" /></td>`;

	if (forpreorder) {
		if (!(PreSales.rtsStatus == SalesStatus.presettling))
			vtcls = `v ${disabled}`;
		html += `<td><input type="text" class="${vtcls.trim()} text-center flex" ${disabled} /></td>`;
	}

	//item variations:
	if (forsales || forpreorder) {
		html += `<td class="text-center"><input type="text" name="vari" class="vari text-center" value="" /></td>`;
	}

	let p_readonly: string = "",
		d_readonly: string = "";
	if (forsales || forpreorder) {
		if (!priceeditable) {
			p_readonly = "readonly";
		}
		if (!disceditable) {
			d_readonly = "readonly";
		}
	}

	if (forsales || forpreorder || forpurchase || forwholesales || fordelivery) {
		html +=
			'<td><input type="number" name="price" min="0" class="price text-right flex" ' +
			p_readonly +
			' /></td><td><input type="number" min="0" name="discpc" class="discpc text-right flex" ' +
			d_readonly +
			" /></td>";
	}

	// console.log("inclusivetax:", inclusivetax);
	if (
		forsales ||
		forpreorder ||
		forpurchase ||
		forwholesales
		// && enableTax && !inclusivetax
	) {
		html +=
			'<td class="text-right"><input type="number" name="tax" min="0" class="taxpc text-right flex" readonly/></td>';
	}

	let locations: string = "";
	for (const [key, value] of Object.entries(DicLocation)) {
		//default primary location:
		let selected: string = key == shop ? "selected" : "";
		locations += `<option value='${key}' ${selected}>${value}</option>`;
	}
	html += `<td><select class="location flex text-center">${locations}</select></td>`;

	//let jobs: string = "";
	//JobList.forEach((x) => jobs += `<option value='${x.JobID}'>${x.job}</option>`);
	html += `<td><select class="job flex text-center">${setJobListOptions(0)}</select></td>`;

	if (forsales || forpreorder || forwholesales)
		html +=
			'<td><input type="number" name="amount" class="amount text-right flex" readonly /></td>';
	else
		html +=
			'<td><input type="number" name="amount" min="0" class="amount text-right flex" readonly /></td>';

	if (
		forpurchase &&
		editmode &&
		Purchase.pstStatus !== "order" &&
		Purchase.pstStatus.toLowerCase() !== "requesting" &&
		Purchase.pstStatus.toLowerCase() !== "created" &&
		Purchase.pstStatus.toLowerCase() !== "rejected"
	) {
		html +=
			'<td><input type="number" name="received" min="0" class="received text-right flex" style="width:90px!important;" /></td>';
	}

	html += "</tr>";

	if (
		(forpurchase &&
			editmode &&
			Purchase.pstStatus !== "order" &&
			Purchase.pstStatus.toLowerCase() !== "requesting" &&
			Purchase.pstStatus.toLowerCase() !== "created" &&
			Purchase.pstStatus.toLowerCase() !== "rejected") ||
		forsales ||
		forpreorder
	) {
		html += `<script>$('.validthru').datepicker({dateFormat: jsdateformat, beforeShow: function () {
            setTimeout(function () {
                $('.ui-datepicker').css('z-index', 99999999999999);
            }, 0);
        }});</script>`;
	}
	$target.append(html);

	if (approvalmode && idx === 0 && $(".itemcode").val() == "") {
		$("#drpSalesman").trigger("focus");
	} else {
		focusItemCode(idx);
	}
}
function setJobListOptions(selectedJobId: number = 0) {
	let jobs: string = `<option value="0">---</option>`;
	MyobJobList.forEach((x) => {
		const selected: string = selectedJobId == x.JobID ? "selected" : "";
		jobs += `<option value='${x.JobID}' ${selected}>${x.JobName}</option>`;
	});
	return jobs;
}
function focusItemCode(idx: number = -1) {
	//console.log('optional idx#focusitemcode:' + idx);
	$target = $(`#${gTblName} tbody tr`);
	if (typeof idx === "undefined") {
		$target.each(function (i, e) {
			let $itemcode = $(e).find("td:eq(1)").find(".itemcode");
			if ($itemcode.val() === "") {
				/* setTimeout(function () {*/
				$itemcode.trigger("focus");
				/*}, 3000);*/
				/* $itemcode.trigger('focus');*/
				//console.log('focus set;i:' + i);
				return false;
			}
		});
	} else {
		//console.log('setting focus...');
		$target.eq(idx).find("td:eq(1)").find(".itemcode").trigger("focus");
	}
}

function fillInDelDetail(arr: string[], title: string) {
	let html = `<h4>${title}</h4><table Id="" class="table table-bordered table-striped table-hover table-condensed">`;
	$.each(arr, function (i, e) {
		html += "<tr>";
		html += `<td>${e}</td>`;
		html += `</tr>`;
	});
	html += "</table>";
	$.fancyConfirm({
		title: "",
		message: html,
		shownobtn: false,
		okButton: oktxt,
		noButton: notxt,
	});
}

$(document).on("dblclick", ".serialno.pointer", function () {
	//console.log("here");
	let hasFocusCls: boolean = $(this).hasClass("focus");

	$tr = $(this).parent("td").parent("tr");
	let idx = forrefund ? 0 : 1;
	selectedItemCode = <string>$tr.find("td").eq(idx).find(".itemcode").val();
	// console.log("selecteditemcode:" + selectedItemCode);
	currentY = $tr.data("idx") as number;
	seq = forrefund ? currentY : currentY + 1;
	// console.log("seq:" + seq);

	if (selectedItemCode === "") {
		$.fancyConfirm({
			title: "",
			message: emptyitemwarning,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$(`#${gTblName} tbody tr`)
						.eq(currentY)
						.find("td:eq(1)")
						.find(".itemcode")
						.trigger("focus");
				}
			},
		});
	} else {
		if (forpurchase || forwholesales || forsales || forpreorder || forrefund) {
			if (forwholesales || forsales || forpreorder || forrefund) {
				itemOptions = DicItemOptions[selectedItemCode];
				if (forwholesales) {
					if (
						Wholesales.wsStatus == "deliver" ||
						Wholesales.wsStatus == "partialdeliver"
					) {
						DeliveryItems = DicSeqDeliveryItems[seq];
					}
					selectedWholesalesLn = WholeSalesLns.find(
						(x) => x.wslSeq == seq
					) as IWholeSalesLn;
				}
			}

			if (forsales || forrefund) {
				if (reviewmode) {
					DeliveryItems = DicSeqDeliveryItems[seq];
					selectedSimpleSalesLn = SimpleSalesLns.find((x) => x.rtlSeq == seq) as ISimpleSalesLn;

					DeliveryItems.forEach((x) => {
						if (x.seq == seq) {
							snvtlist.push({
								pocode: x.pstCode,
								sn: x.snoCode ?? "",
								vt: x.VtDisplay,
							} as ISnVt);
						}
					});
				} else {
					if (DicItemSnVtList && selectedItemCode in DicItemSnVtList)
						snvtlist = DicItemSnVtList[selectedItemCode].slice(0);
					selectedSalesLn = $.grep(SalesLnList, function (e, i) {
						return e.rtlSeq == seq;
					})[0];
				}
			}

			if (forpreorder) {
				if (DicItemSnVtList && selectedItemCode in DicItemSnVtList)
					snvtlist = DicItemSnVtList[selectedItemCode].slice(0);
				selectedPreSalesLn = $.grep(PreSalesLnList, function (e, i) {
					return e.rtlSeq == seq;
				})[0];
			}

			if (editmode) {
				if (forpurchase) {
					toggleSnVt();
					$.each(Purchase.PurchaseItems, function (i, e) {
						if (e.piSeq == seq) {
							selectedPurchaseItem = structuredClone(e);
						}
					});
				}

				if (forwholesales) {
					if (Wholesales.wsStatus == "invoice") {
						snvtlist = DicItemSnVtList[selectedItemCode].slice(0);
					}
					if (
						Wholesales.wsStatus.toLowerCase() === "deliver" ||
						Wholesales.wsStatus.toLowerCase() === "partialdeliver"
					) {
						DeliveryItems.forEach((x) => {
							if (x.seq == seq) {
								snvtlist.push({
									pocode: x.pstCode,
									sn: x.snoCode ?? "",
									vt: x.VtDisplay,
								} as ISnVt);
							}
						});
					}

					//for itemnamedesc display only:
					$.each(WholeSalesLns, function (i, e) {
						if (e.wslSeq == seq) {
							selectedWholesalesLn = structuredClone(e);
						}
					});
				}
			}
			else {
				if (forpurchase) {
					if (purchaseitems.length > 0) {
						$.each(purchaseitems, function (i, e) {
							if (e.piSeq == seq) {
								selectedPurchaseItem = e;
								return false;
							}
						});

						if (selectedPurchaseItem!.piStatus !== "order") {
							$target = $(this)
								.parent("td")
								.parent("tr")
								.find("td:last")
								.find(".received");
							selectedPurchaseItem!.piReceivedQty = <number>$target.val();
							if (selectedPurchaseItem!.piReceivedQty == 0) {
								$.fancyConfirm({
									title: "",
									message: receivedqtyrequiredtxt,
									shownobtn: false,
									okButton: oktxt,
									noButton: notxt,
									callback: function (value) {
										if (value) {
											$target.trigger("focus");
										}
									},
								});
								return false;
							}
						}
					} else {
						selectedPurchaseItem = initPurchaseItem();
						selectedPurchaseItem!.piSeq = currentY + 1;
						selectedPurchaseItem!.itmCode = <string>(
							$(this)
								.parent("td")
								.parent("tr")
								.find("td")
								.eq(1)
								.find(".itemcode")
								.val()
						);
						selectedPurchaseItem!.itmNameDesc = <string>(
							$(this)
								.parent("td")
								.parent("tr")
								.find("td")
								.eq(2)
								.find(".itemdesc")
								.val()
						);
						selectedPurchaseItem!.piQty = <number>(
							$(this)
								.parent("td")
								.parent("tr")
								.find("td")
								.eq(4)
								.find(".qty")
								.val()
						);
					}
				}

				if (forwholesales) {
					selectedWholesalesLn = initWholeSalesLn();
					selectedWholesalesLn.wslSeq = currentY + 1;
					selectedWholesalesLn.wslItemCode = <string>(
						$(this)
							.parent("td")
							.parent("tr")
							.find("td")
							.eq(1)
							.find(".itemcode")
							.val()
					);
					selectedWholesalesLn.itmNameDesc = <string>(
						$(this)
							.parent("td")
							.parent("tr")
							.find("td")
							.eq(2)
							.find(".itemdesc")
							.val()
					);
					$target = $(this)
						.parent("td")
						.parent("tr")
						.find("td")
						.eq(4)
						.find(".qty");
					selectedWholesalesLn.wslQty = <number>$target.val();

					if (selectedWholesalesLn.wslStatus == "open") {
						if (selectedWholesalesLn.wslQty == 0) {
							$.fancyConfirm({
								title: "",
								message: qtyrequiredtxt,
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										$target.trigger("focus");
									}
								},
							});
							return false;
						}
					}
				}
			}
			openSerialModal(hasFocusCls);
		}
	}
});

function openSerialModal(hasFocusCls: boolean) {
	serialModal.dialog("option", {
		width: 1000,
		title: forwholesales ? serialnotxt : enterserialno,
	});
	serialModal.dialog("open");
	_openSerialModal = true;

	$target = $(".ui-dialog-buttonpane .ui-dialog-buttonset");
	if (hasFocusCls) {
		$target.find(".savebtn").show();
		$target
			.find(".secondarybtn")
			.text(canceltxt)
			.on("click", handleSerialModalCancel);
	} else {
		$target.find(".savebtn").hide();
		$target.find(".secondarybtn").text(closetxt).on("click", closeSerialModal);
	}

	//console.log('selecteditemcode:' + selectedItemCode);
	$("#txtStaticItemCode").val(selectedItemCode);

	if (forpurchase) {
		//console.log('selectedpurchasestockitem:', selectedPurchaseItem);
		$("#txtStaticItemName").val(selectedPurchaseItem!.itmNameDesc);
		$("#txtStaticQty").val(selectedPurchaseItem!.piReceivedQty);
	}
	if (forwholesales || forsales || forpreorder || forrefund) {
		//console.log("selectedWholesalesLn:", selectedWholesalesLn);
		if (forwholesales)
			$("#txtStaticItemName").val(selectedWholesalesLn!.itmNameDesc);
		if (forsales) reviewmode ? $("#txtStaticItemName").val(selectedSimpleSalesLn!.Item.NameDesc) : $("#txtStaticItemName").val(selectedSalesLn!.Item.NameDesc);
		if (forpreorder)
			$("#txtStaticItemName").val(selectedPreSalesLn!.itmNameDesc);

		if (
			SeqSnsVtsList.length === 0 ||
			!SeqSnsVtsList.find((x) => x.seq == seq)
		) {
			SeqSnsVtsList.push({
				seq: seq,
				snvtList: [],
			});
		}

		let snqty: number = 0;
		if (DeliveryItems.length > 0) {
			DeliveryItems.forEach((x) => {
				if (x.dlHasSN && x.seq == seq) {
					snqty++;
				}
			});
		}
		$("#txtStaticQty").val(snqty);
	}

	let html: string = "";

	if (forpurchase) {
		if (selectedPurchaseItem!.snbatseqvtlist.length > 0) {
			$.each(selectedPurchaseItem!.snbatseqvtlist, function (i, e) {
				html += writeSN(Purchase.pstCode, hasFocusCls, e.sn, e.vt ?? "");
			});
			selectedPurchaseItem!.snbatseqvtlist = []; //reset to avoid duplicates
		}
	}
	if (
		(forwholesales && Wholesales.wsStatus != "order") ||
		forsales ||
		forpreorder
	) {
		//console.log("here");
		//console.log("snvtlist:", snvtlist);
		if (snvtlist.length > 0) {
			$.each(snvtlist, function (i, e) {
				html += writeSN(e.pocode, hasFocusCls, e.sn, e.vt ?? "");
			});
			snvtlist = []; //reset to avoid duplicates
		}
	}

	$("#tblSerial tbody").empty().append(html);

	if (forwholesales || forsales || forpreorder) {
		$("#txtSearchSN").trigger("focus");
	} else {
		$("#txtSerialNo").val("").trigger("focus");
	}

	let seqtxt = sequencetxt.concat(" ").concat(seq.toString());
	$("#vtseq").text(seqtxt);
}

function writeSN(
	pocode: string,
	hasFocusCls: boolean,
	_sn,
	_validthru = ""
): string {
	if (!itemOptions) return "";
	//console.log("here");
	let _snseq = $("#tblSerial tbody").find("tr").length + 1;
	let html: string = "";

	html = `<tr Id='${_sn}' data-itemcode="${selectedItemCode}" data-sn='${_sn}'>`;

	if (!forwholesales && !forsales && !forpreorder) html += `<td>${_snseq}</td>`;

	html += `<td>${_sn}</td>`;

	if (forwholesales || forsales || forpreorder) {
		if (!itemOptions.WillExpire) _validthru = "N/A";
		html += `<td>${_validthru}</td>`;
		let _checked = "";
		let _disabled = hasFocusCls ? "" : "disabled";

		if (DeliveryItems.length > 0) {
			/*console.log("here");*/
			$.each(DeliveryItems, function (i, v) {
				if (hasFocusCls) {
					if (v.snoCode == _sn) {
						_checked = "checked disabled";
						return false;
					}
				} else {
					if (v.snoCode == _sn && v.seq == seq) {
						_checked = "checked disabled";
						return false;
					}
				}
			});
		}

		html += `<td>${pocode}</td>`;

		html += `<td><input type="checkbox" Id="chksnvt${_sn}" class="chksnvt" data-pocode="${pocode}" data-sn="${_sn}" data-vt="${_validthru}" ${_checked} ${_disabled}></td>`;
	}

	if (!forwholesales && !forsales && !forpreorder)
		html += `<td><a href='#' role='button' class='btn btn-default removesn' data-snseq="${_snseq}" data-vtseq="${seq}" onclick='removeSN("${_sn}",true);'>${txtremove}</a></td>`;

	html += `</tr>`;

	return html;
}

$(document).on("change", "#txtSerialNo", function () {
	let sn = <string>$(this).val();
	$(this).val("");
	if (sn !== "") {
		//console.log('itemsnlist:', itemsnlist);
		if (itemsnlist.length === 0) {
			getRemoteData(
				"/Api/CheckIfDuplicatedSN",
				{ sn: sn },
				checkIfDuplicatedSNOk,
				getRemoteDataFail
			);
		} else {
			let duplicated = false;
			$.each(itemsnlist, function (i, e) {
				$.each(e.serialcodes, function (k, v) {
					if (v.includes(sn)) {
						duplicated = true;
						return false;
					}
				});
			});

			if (duplicated) {
				//console.log('duplicated!');
				$.fancyConfirm({
					title: "",
					message: duplicatedsnwarning,
					shownobtn: false,
					okButton: oktxt,
					noButton: canceltxt,
					callback: function (value) {
						if (value) {
							$("#txtSerialNo").trigger("focus");
							return false;
						}
					},
				});
			} else {
				getRemoteData(
					"/Api/CheckIfDuplicatedSN",
					{ sn: sn },
					checkIfDuplicatedSNOk,
					getRemoteDataFail
				);
			}
		}
	}
});

let checkmat = false;
function checkIfDuplicatedSNOk(data) {
	let sn: string = data.sn.toString();
	duplicatedSerailNo = data.serialno !== null;
	if (!duplicatedSerailNo) {
		if (forpurchase) {
			//resume datepicker
			$("#tblPserial tbody tr").each(function (i, e) {
				$target = $(e).find("td:eq(1)").find(".posn");
				if ($target.val() == sn) {
					$target
						.parent("td")
						.next("td")
						.find(".posnvt")
						.prop("disabled", false);
					return false;
				}
			});
		}
		if (forsales || forpreorder) {
			writeSN("", false, sn);
			let idx = -1;
			let _snqty = 0;

			$.each(itemsnlist, function (i, e: IItemSN) {
				if (
					e.itemcode.toString().toLowerCase() ===
					selectedItemCode.toString().toLowerCase() &&
					e.seq === currentY + 1
				) {
					idx = i;
					return false;
				}
			});
			if (idx === -1) {
				let arrSN: Array<string> = [];
				arrSN.push(sn);
				let objSN: IItemSN = {
					itemcode: selectedItemCode,
					seq: currentY + 1,
					serialcodes: arrSN,
					validthru: "",
				};
				itemsnlist.push(objSN);
				_snqty = arrSN.length;
				//console.log('snqty:' + _snqty + ';currentqty:' + currentQty + ';seq:' + seq);
			} else {
				itemsnlist[idx].serialcodes.push(sn);
				_snqty = itemsnlist[idx].serialcodes.length;
				//console.log('snqty:' + _snqty + ';currentqty:' + currentQty);
			}
			//console.log('itemsnlist:', itemsnlist);
			//}

			$("#txtStaticQty").val(_snqty);
		}

		if (forwholesales) {
			return;
		}
	} else {
		let msg = duplicatedserialnowarning;
		snUsedDate = data.serialno.PurchaseDateDisplay;
		msg = msg
			.replace("{1}", snUsedDate)
			.replace("{0}", data.serialno.snoStockInCode);
		if (forpurchase) {
			//console.log("here");
			$.fancyConfirm({
				title: duplicatedserialno,
				message: msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						//<input type="text" class="form-control text-center posn" value="a1">
						$("#tblPserial tbody tr").each(function (i, e) {
							$target = $(e).find("td:eq(1)").find(".posn");
							if ($target.val() == sn) {
								$target.val("").trigger("focus");
								//resume vt datepicker
								$target
									.parent("td")
									.next("td")
									.find(".posnvt")
									.prop("disabled", false);
								return false;
							}
						});
					}
				},
			});
		}
		if (forwholesales) {
			$.fancyConfirm({
				title: duplicatedserialno,
				message: msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						$(`#${gTblName} tbody tr`).each(function (i, e) {
							$target = $(e).find("td:eq(6)").find(".serialno");
							if ($target.val() == sn) {
								$target.val("").trigger("focus");
								return false;
							}
						});
					}
				},
			});
		}
		//forsales or forpreorder
		if (forsales || forpreorder) {
			let idx = -1;
			$.each(itemsnlist, function (i, e) {
				if (
					e.itemcode.toString().toLowerCase() ===
					selectedItemCode.toString().toLowerCase() &&
					e.seq === currentY + 1
				) {
					idx = i;
					return false;
				}
			});
			if (idx > -1) {
				let index = -1;
				$.each(itemsnlist[idx].serialcodes, function (i, e) {
					if (e.toString() == sn.toString()) {
						index = i;
						return false;
					}
				});
				if (index > -1) {
					itemsnlist[idx].serialcodes.splice(index, 1);
				}
			}
			//console.log('itemsnlist after update:', itemsnlist);
			snUsedDate = data.serialno.SalesDateDisplay;
			msg = msg
				.replace("{1}", snUsedDate)
				.replace("{0}", data.serialno.snoRtlSalesCode);

			$.fancyConfirm({
				title: duplicatedserialno,
				message: msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						$("#txtSerialNo").trigger("focus");
					}
				},
			});
		}

		duplicatedSerailNo = false;
	}
}

let setexpirydateMark: boolean = false;
function confirmSNs() {
	let lnqty: number = 0;
	if (forwholesales || forsales || forpreorder) {
		$("#tblSerial tbody tr").each(function (i, e) {
			$target = $(e).find("td:eq(3)").find(".chksnvt");
			let snvtId = $target.attr("id");
			let pocode = $target.data("pocode");
			let _snvt = {
				pocode: pocode,
				sn: $(e).find("td:eq(0)").text() as string,
				vt: $(e).find("td:eq(1)").text().toString().trim(),
				selected: $target.is(":checked"),
			};

			if (_snvt.selected) {
				//console.log("_snvt.sn:", _snvt.sn);
				let idx = -1;
				$.each(DeliveryItems, function (k, v) {
					//console.log("v.snoCode:" + v.snoCode);
					if (v.snoCode == _snvt.sn) {
						idx = k;
						return false;
					}
				});
				if (idx < 0) {
					deliveryItem = initDeliveryItem();
					deliveryItem.pstCode = _snvt.pocode;
					deliveryItem.dlCode = snvtId as string;
					deliveryItem.seq = seq;
					deliveryItem.dlHasSN = true;
					deliveryItem.snoCode = _snvt.sn;
					deliveryItem.JsVt = _snvt.vt;
					deliveryItem.itmCode = selectedItemCode.toString();
					deliveryItem.dlQty = 1;

					getItemInfo4BatSnVtIv(_snvt.sn);

					DeliveryItems.push(deliveryItem);
				}

				if (snvt.selected && itemOptions && itemOptions.WillExpire) {
					setExpiryDateMark();
				}
			} else {
				let idx = -1;
				$.each(DeliveryItems, function (k, v) {
					if (v.snoCode == _snvt.sn) {
						idx = k;
						return false;
					}
				});
				if (idx >= 0) {
					DeliveryItems.splice(idx, 1);
				}

				if (SeqSnsVtsList.find((x) => x.seq == seq)?.snvtList.length === 0) {
					setSNmark(true);
					removeExpiryDateMark();
				}
			}
		});
	}
	//console.log("selecteditemcode:" + selectedItemCode + ";seq:" + seq);
	lnqty = getSerialNoLnQty();
	//console.log("lnqty#confirmsns:", lnqty);
	let $qty = $(`#${gTblName} tbody tr`)
		.eq(currentY)
		.find("td")
		.eq(4)
		.find(".qty");
	if (lnqty > Number($qty.val())) {
		$.fancyConfirm({
			title: "",
			message: newqtygtoriginalqtyindeliveryconfirmtxt,
			shownobtn: true,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$qty.val(lnqty).trigger("change");
					_confirmSNs(false);
				} else {
					let idx = -1;

					if (
						SeqSnsVtsList &&
						SeqSnsVtsList.find((x) => x.seq == seq) &&
						SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList
					) {
						var snvtlist = SeqSnsVtsList.find(
							(x) => x.seq == seq
						)!.snvtList.slice(0);
						DeliveryItems.forEach((v, k) => {
							snvtlist.every((y) => {
								if (v.snoCode == y.sn) {
									idx = k;
									return false;
								}
							});
						});
						if (idx >= 0) {
							DeliveryItems.splice(idx, 1);
						}

						$("#tblSerial tbody tr").each(function (i, e) {
							let sn = $(e).find("td:eq(0)").text() as string;
							//console.log("sn:" + sn);
							if (snvtlist.find((x) => x.sn == sn)) {
								$(e).find("td:eq(2)").find(".chksnvt").prop("checked", false);
							}
						});

						SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList = [];
					}

					$("#txtStaticQty").val(0);
					$target.addClass("focus-input");

					setSNmark(true);
					removeExpiryDateMark();

					$("#txtSearchSN").trigger("focus");
				}
			},
		});
	} else {
		$qty.val(lnqty).trigger("change");
		_confirmSNs(false);
	}
}

function getSerialNoLnQty(): number {
	//console.log("here");
	let lnqty: number = 0;
	if (
		SeqSnsVtsList &&
		SeqSnsVtsList.find((x) => x.seq == seq) &&
		SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList
	) {
		lnqty = SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList.length;
	}
	return lnqty;
}

function _confirmSNs(setfocus: boolean = true) {
	closeSerialModal();
	_openSerialModal = false;
	setSNmark();
	if (setexpirydateMark) setExpiryDateMark();
	selectedItemCode = "";
	if (setfocus) focusItemCode();
}

interface ISeqSnsVts {
	seq: number;
	snvtList: ISnVt[];
}
let SeqSnsVtsList: ISeqSnsVts[] = [];
//let ItemSnSeqVtList: IItemSnSeqVtList;
//let selectedItemSnVtQtyList: IItemSnSeqVtList[] = [];
let chksnvtchange: boolean = false;
$(document).on("change", ".chksnvt", function () {
	let todelqty: number = getToDelQty();

	$(this).data("rtlseq", seq);
	//let selected: boolean = $(this).is(":checked");
	let sn = $(this).data("sn");
	let vt = $(this).data("vt");

	let ischecked: boolean = $(this).is(":checked");
	$tr = $(this).parent("td").parent("tr");
	chksnvtchange = true;

	snvt = { pocode: "", sn, vt, selected: ischecked };

	if (
		SeqSnsVtsList &&
		SeqSnsVtsList.find((x) => x.seq == seq) &&
		SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList
	) {
		if (snvt.selected) {
			if (!SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList.includes(sn))
				SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList.push(snvt);
		} else {
			let idx = SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList.indexOf(snvt);
			if (idx >= 0)
				SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList.splice(idx, 1);
		}
	}

	let currentsnqty = $("#txtStaticQty").val() as number;
	if (snvt.selected) {
		currentsnqty++;
	} else {
		currentsnqty--;
	}
	$("#txtStaticQty").val(currentsnqty);

	if (currentsnqty == todelqty) {
		$("#tblSerial tbody .chksnvt").prop("disabled", true);
	}
});

$(document).on("change", ".snvalidthru", function () {
	snvt.vt = $(this).val() as string;
});

$(document).on("click", "#btnSearchSN", function () {
	//var requiredsn = serialnorequired;
	let searchsn: string = <string>$("#txtSearchSN").val()?.toString();
	if (searchsn !== "") {
		searchsn = searchsn.trim();
		let found = false;
		if (forsales) {
			$.each(itemsnlist, function (i, e) {
				if (e.serialcodes.includes(searchsn)) {
					window.location.href = "#" + searchsn;
					$("#tblSerial tbody tr").each(function (i, e) {
						if ($(e).prop("Id") === searchsn) {
							$(e).addClass("highlight_row");
							found = true;
							return false;
						}
					});
				}
			});
		}
		if (forwholesales) {
			$.each(snvtlist, function (i, e) {
				if (e.sn == searchsn) {
					window.location.href = "#" + searchsn;
					$("#tblSerial tbody tr").each(function (i, e) {
						if ($(e).prop("Id") === searchsn) {
							$(e).addClass("highlight_row");
							found = true;
							return false;
						}
					});
				}
			});
		}

		if (!found) falert(nodatafoundtxt, oktxt);
	}
});

$(document).on("change", "#txtSearchSN", function () {
	$("#btnSearchSN").trigger("click");
});

function getToDelQty(): number {
	let idx = forwholesales ? 5 : 4;
	let qtycls = forwholesales ? ".delqty" : ".qty";
	return Number(
		$(`#${gTblName} tbody tr`)
			.eq(currentY)
			.find("td")
			.eq(idx)
			.find(qtycls)
			.val()
	);
}

function resetSerialModal() {
	serialModal.find("input").val("");
	if (forwholesales) {
		serialModal.find("input[type=checkbox]").prop("checked", false);
	}
	//console.log('serailmodal inputs cleared');
}

let batchidx = 0;
let snidx = 0;
let vtidx = 0;
function removeSN(_sn: string, needconfirm: boolean) {
	if (needconfirm) {
		$.fancyConfirm({
			title: "",
			message: confirmremove,
			shownobtn: true,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					_removeSN(_sn);
				}
			},
		});
	} else {
		_removeSN(_sn);
	}
}

function _removeSN(_sn: string) {
	//console.log('_sn#_removesn:' + _sn);
	//console.log('itemsnlist before remove:', itemsnlist);
	let idx = -1;
	$.each(itemsnlist, function (i, e) {
		//e.itemcode.toString().toLowerCase() === selectedItemCode.toString().toLowerCase() && e.seq === currentY + 1
		if (
			e.itemcode.toString().toLowerCase() ===
			selectedItemCode.toString().toLowerCase() &&
			e.seq === currentY + 1
		) {
			idx = i;
			return false;
		}
	});
	if (idx > -1) {
		let index = -1;
		$.each(itemsnlist[idx].serialcodes, function (i, e) {
			if (e.toString() == _sn.toString()) {
				index = i;
				return false;
			}
		});
		if (index > -1) {
			itemsnlist[idx].serialcodes.splice(index, 1);
		}
	}
	//console.log('itemsnlist after remove:', itemsnlist);
	setSNmark(true);
	$("#tblSerial tbody tr").each(function (i, e) {
		console.log("edatasn:" + $(e).data("sn"));
		if ($(e).data("sn") == _sn) {
			$(e).remove();
			//console.log("itemsnlist#0:", itemsnlist);
			if (itemsnlist.length > 0) {
				let idx = -1;
				$.each(itemsnlist, function (k, v) {
					$.each(v.serialcodes, function (_i, _e) {
						if (_e == _sn) {
							idx = _i;
							return false;
						}
					});
					if (idx > -1) {
						v.serialcodes.splice(idx, 1);
						return false;
					}
				});
			}
			//console.log("itemsnlist#1:", itemsnlist);
			$("#txtStaticQty").val(itemsnlist.length);
		}
	});
	$("#txtSerialNo").trigger("focus");
}

function setIvMark() {
	let $tr = $(`#${gTblName} tbody tr`);
	let ivcls = ".vari";
	let idx = forwholesales ? 9 : 8;
	$tr
		.eq(currentY)
		.find("td")
		.eq(idx)
		.find(ivcls)
		.removeClass("focus")
		.val("...");
}
function setBatchMark() {
	//console.log("batchidx:", batchidx);//ok
	let $tr = $(`#${gTblName} tbody tr`);
	let batcls = forpurchase ? ".pobatch" : ".batch";
	$tr
		.eq(currentY)
		.find("td")
		.eq(batchidx)
		.find(batcls)
		.removeClass("focus")
		.val("...");
}

function setExpiryDateMark() {
	//console.log("here");
	let $tr = $(`#${gTblName} tbody tr`);
	if (itemOptions && (itemOptions.ChkBatch || itemOptions.ChkSN))
		$tr
			.eq(currentY)
			.find("td")
			.eq(vtidx)
			.find(".validthru")
			.removeClass("focus validthru datepicker pointer")
			.prop("readonly", true)
			.val("...");
	else
		$tr
			.eq(currentY)
			.find("td")
			.eq(vtidx)
			.find(".validthru")
			.removeClass("focus datepicker")
			.prop("readonly", true)
			.val("...");
}

function removeExpiryDateMark() {
	let $tr = $(`#${gTblName} tbody tr`);
	if (forwholesales) {
		$tr
			.eq(currentY)
			.find("td")
			.eq(vtidx)
			.find(".small.pointer")
			.addClass("validthru datepicker focus")
			.prop("readonly", false)
			.val("");
	} else {
		$tr
			.eq(currentY)
			.find("td")
			.eq(vtidx)
			.find(".validthru")
			.addClass("validthru datepicker")
			.prop("readonly", false)
			.val("");
	}

	setValidThruDatePicker();
}

function setSNmark(remove = false) {
	let $tr = $(`#${gTblName} tbody tr`);
	if (forwholesales || forsales || forpreorder) {
		if (itemOptions && itemOptions.ChkBatch && itemOptions.ChkSN)
			$tr
				.eq(currentY)
				.find("td")
				.eq(snidx)
				.find(".serialno")
				.removeClass("serialno pointer focus")
				.val("...");
		if (itemOptions && !itemOptions.ChkBatch && itemOptions.ChkSN)
			$tr
				.eq(currentY)
				.find("td")
				.eq(snidx)
				.find(".serialno")
				.removeClass("focus")
				.val("...");
	} else
		remove
			? $tr.eq(currentY).find("td").eq(snidx).find(".serialno").val("")
			: $tr
				.eq(currentY)
				.find("td")
				.eq(snidx)
				.find(".serialno")
				.removeClass("focus")
				.val("...");
}

function resetSNs() {
	serialModal.dialog("close");
	//console.log("itemsnlist before reset:", itemsnlist);

	if (itemsnlist.length > 0) {
		//console.log(
		//    "selectedItemCode#resetsns:" +
		//    selectedItemCode +
		//    ";currentY#resetsns:" +
		//    currentY
		//);
		let _idx = -1;
		$.each(itemsnlist, function (i, e: IItemSN) {
			//console.log("rtlSeq#resetsns:" + e.seq);
			if (
				e.itemcode.toString() == selectedItemCode.toString() &&
				e.seq === currentY + 1
			) {
				_idx = i;
				return false;
			}
		});
		//console.log("_idx#resetsns:" + _idx);
		if (_idx > -1) {
			let _itemsn: IItemSN = itemsnlist[_idx];
			_itemsn.serialcodes = [];
		}
	}
	//console.log("itemsnlist after reset:", itemsnlist);
	setSNmark(true);
}

function resetRow() {
	//console.log("Here");
	let idx = -1;
	//remove itemsn from itemsnlist, if any:
	$.each(itemsnlist, function (i, e: IItemSN) {
		if (e.seq == currentY + 1) {
			idx = i;
			return false;
		}
	});
	if (idx > -1) {
		itemsnlist.splice(idx, 1);
	}
	//   console.log("updated itemsnlist#resetrow:", itemsnlist);
	idx = -1;

	if (forsales) {
		$.each(SalesLnList, function (i, e) {
			if (e.rtlSeq == currentY + 1) {
				idx = i;
				return false;
			}
		});
		if (idx > -1) {
			SalesLnList.splice(idx, 1);
		}
	}
	if (forpreorder) {
		$.each(PreSalesLnList, function (i, e) {
			if (e.rtlSeq == currentY + 1) {
				idx = i;
				return false;
			}
		});
		if (idx > -1) {
			PreSalesLnList.splice(idx, 1);
		}
	}
	if (forwholesales) {
		$.each(WholeSalesLns, function (i, e) {
			if (e.wslSeq == currentY + 1) {
				idx = i;
				return false;
			}
		});
		if (idx > -1) {
			WholeSalesLns.splice(idx, 1);
		}
	}
	if (forpurchase) {
		$.each(Purchase.PurchaseItems, function (i, e) {
			if (e.piSeq == currentY + 1) {
				idx = i;
				return false;
			}
		});
		if (idx > -1) {
			Purchase.PurchaseItems.splice(idx, 1);
		}
		// console.log("updatedpurchaseitems#resetrow:", Purchase.PurchaseItems);
	}

	$target = $(`#${gTblName} tbody tr`);

	$target.eq(currentY).find("td:eq(2)").find(".itemdesc").val("");

	const unitclsname = forpurchase ? ".baseunit" : ".sellunit";
	$target.eq(currentY).find("td:eq(3)").find(unitclsname).val("");

	//let qty = Number($target.eq(currentY).find("td:eq(4)").find(".qty").val());
	$target.eq(currentY).find("td:eq(4)").find(".qty").val("");

	if (
		forsales ||
		forpreorder ||
		(forpurchase && Purchase.pstStatus !== "order") ||
		(forwholesales && Wholesales.wsStatus == "invoice")
	) {
		idx = 5;
		$target
			.eq(currentY)
			.find("td")
			.eq(idx)
			.find(".batch")
			.removeClass("itemoptionmissing")
			.val("");
		idx++;
		$target
			.eq(currentY)
			.find("td")
			.eq(idx)
			.find(".serialno")
			.removeClass("itemoptionmissing")
			.val("");
		idx++;
		$target
			.eq(currentY)
			.find("td")
			.eq(idx)
			.find(".validthru")
			.removeClass("itemoptionmissing")
			.val("");
	}

	if (forsales || forpreorder) {
		idx++;
		$target.eq(currentY).find("td").eq(idx).empty(); //item varaitions
	}

	//let price = 0;
	//let disc = 0;
	//let taxrate = 0;
	//let amount = 0;
	if (forsales || forpreorder) {
		idx = 9;
	}
	if (
		(forpurchase && Purchase.pstStatus == "order") ||
		(forwholesales && Wholesales.wsStatus == "order")
	) {
		idx = 5;
	}

	const $price = $target.eq(currentY).find("td").eq(idx).find(".price");
	//price = Number($price.val());
	$price.val("");
	idx++;
	const $disc = $target.eq(currentY).find("td").eq(idx).find(".discpc");
	//disc = Number($disc.val());
	$disc.val("");

	if (enableTax && !inclusivetax) {
		idx++;
		const $tax = $target.eq(currentY).find("td").eq(idx).find(".taxpc");
		//taxrate = Number($tax.val());
		$tax.val("");
	}
	idx++;
	const $location = $target.eq(currentY).find("td").eq(idx).find(".location");
	$location.val($location.find("option").eq(1).val() as string);
	idx++;
	const $job = $target.eq(currentY).find("td").eq(idx).find(".job");
	$job.val($job.find("option").first().val() as string);

	const $amount = $target.eq(currentY).find("td").last().find(".amount");
	//amount = Number($amount.val());
	$amount.val("");

	$(`#${gTblName} tbody`).empty();
	if (forsales) {
		if (SalesLnList.length === 0) {
			addRow();
		} else {
			SalesLnList.forEach((x, i) => {
				addRow();
				selectedSalesLn = structuredClone(x);
				selectedItemCode = x.rtlItemCode;
				currentY = i;
				$(`#${gTblName} tbody tr`)
					.eq(currentY)
					.find("td")
					.eq(1)
					.find(".itemcode")
					.val(selectedItemCode);
				populateItemRow(x.Item.singleProId ?? 0);
			});
			selectedItemCode = "";
			selectedSalesLn = {} as ISalesLn;
		}
	}
	if (forpreorder) {
		if (PreSalesLnList.length === 0) {
			addRow();
		} else {
			PreSalesLnList.forEach((x, i) => {
				addRow();
				selectedPreSalesLn = structuredClone(x);
				selectedItemCode = x.rtlItemCode;
				currentY = i;
				$(`#${gTblName} tbody tr`)
					.eq(currentY)
					.find("td")
					.eq(1)
					.find(".itemcode")
					.val(selectedItemCode);
				populateItemRow(x.Item.singleProId ?? 0);
			});
			selectedItemCode = "";
			selectedPreSalesLn = {} as IPreSalesLn;
		}
	}
	if (forwholesales) {
		if (WholeSalesLns.length === 0) {
			addRow();
		} else {
			WholeSalesLns.forEach((x, i) => {
				addRow();
				selectedWholesalesLn = structuredClone(x);
				selectedItemCode = x.wslItemCode;
				currentY = i;
				$(`#${gTblName} tbody tr`)
					.eq(currentY)
					.find("td")
					.eq(1)
					.find(".itemcode")
					.val(selectedItemCode);
				populateItemRow(x.Item.singleProId ?? 0);
			});
			selectedItemCode = "";
			selectedWholesalesLn = {} as IWholeSalesLn;
		}
	}
	if (forpurchase) {
		if (Purchase.PurchaseItems.length === 0) {
			addRow();
		} else {
			Purchase.PurchaseItems.forEach((x, i) => {
				addRow();
				selectedPurchaseItem = structuredClone(x);
				selectedItemCode = x.itmCode;
				currentY = i;
				$(`#${gTblName} tbody tr`)
					.eq(currentY)
					.find("td")
					.eq(1)
					.find(".itemcode")
					.val(selectedItemCode);
				populateItemRow(x.singleProId ?? 0);
			});
			selectedItemCode = "";
			selectedPurchaseItem = {} as IPurchaseItem;
		}
	}

	let totalamt = getTotalAmt4Order();
	$("#txtTotal").val(formatnumber(totalamt));

	focusItemCode();
}

function checkPurchaseItems(): boolean {
	//console.log("here");
	let msg = "";
	let currentItemCount = $(`#${gTblName} tbody tr`).length;
	//console.log("currentitemcount:" + currentItemCount);
	$(`#${gTblName} tbody tr`).each(function (i, e) {
		if (i < currentItemCount) {
			selectedItemCode = $(e)
				.find("td:eq(1)")
				.find(".itemcode")
				.val() as string;
			//console.log('selecteditemcode:' + selectedItemCode);
			if (!$.isEmptyObject(DicItemOptions)) {
				itemOptions = DicItemOptions[selectedItemCode];
				if (itemOptions) {
					//console.log("itemoptions:", itemoptions);
					let idx = 5;
					let $batch = $(e).find("td").eq(idx).find(".batch");
					if (itemOptions.ChkBatch && $batch.val() == "") {
						msg += `${selectedItemCode} ${batchrequiredtxt}<br>`;
						$batch.addClass("focus");
					}
					idx++;
					let $sn = $(e).find("td").eq(idx).find(".posn");
					if (itemOptions.ChkSN && $sn.val() == "") {
						msg += `${selectedItemCode} ${snrequiredtxt}<br>`;
						$sn.addClass("focus");
					}
					idx++;
					let $vt = $(e).find("td").eq(idx).find(".validthru");
					if (itemOptions.WillExpire && $vt.val() == "") {
						msg += `${selectedItemCode} ${expirydaterequiredtxt}<br>`;
						$vt.addClass("focus");
					}
				}
			}
		}
	});
	selectedItemCode = "";

	if (msg !== "") {
		$(`#${gTblName} tbody tr:first`)
			.find("td:last")
			.find(".received")
			.removeClass("focus");
		$.fancyConfirm({
			title: "",
			message: msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
		});
	}

	return msg === "";
}

$(document).on("dblclick", ".itemcode", function () {
	seq = parseInt($(this).parent("td").parent("tr").find("td:eq(0)").text());
	currentY = seq - 1;
	//console.log('seq:' + seq + ';currenty:' + currentY);
	if (forpurchase) {
		if (Purchase.pstStatus !== "order" && checkPurchaseItems()) {
			GetItems(1);
		}
		if (Purchase.pstStatus == "order" || Purchase.pstStatus == "created") {
			GetItems(1);
		}
	} else {
		GetItems(1);
	}
});

function handleLocationChange(event: any) {
	currentY = getCurrentY(event.target);
	updateRow(getRowPrice(), getRowDiscPc());
}

function getRowDiscPc(): number {
	$tr = $(`#${gTblName} tbody tr`).eq(currentY);
	return Number($tr.find(".discpc").val());
}
function getRowPrice(): number {
	$tr = $(`#${gTblName} tbody tr`).eq(currentY);
	return Number($tr.find(".price").val());
}

function handlePriceChange(event: any) {
	// console.log("price change called");
	//console.log("price:" + event.target.value);
	const price: number = Number(event.target.value);
	if (price === 0) {
		zeroprice = true;
	} else {
		zeroprice = false;
	}
	if (price < 0) {
		$(event.target).val(price * -1);
	}
	currentY = getCurrentY(event.target);
	$tr = $(`#${gTblName} tbody tr`).eq(currentY);

	let _discpc: number = Number($tr.find(".discpc").val());
	//console.log("price#p change:" + price + ";discpc#p change:" + _discpc);
	updateRow(price, _discpc);
}
function handleDiscChange(event: any) {
	currentY = getCurrentY(event.target);
	let _discpc: number = Number($(event.target).val());
	//console.log("_discpc#change:" + _discpc);
	$tr = $(`#${gTblName} tbody tr`).eq(currentY);
	let _price: number = 0;

	if (_discpc < 0) {
		$.fancyConfirm({
			title: "",
			message: lt0dispctxt,
			shownobtn: true,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					_price = Number($tr.find(".price").val());
					updateRow(_price, _discpc);
				} else {
					updateRow(_price, 0);
				}
			},
		});
	} else {
		_price = Number($tr.find(".price").val());
		updateRow(_price, _discpc);
	}
}

function updateRow(_price: number = 0, _discount: number = 0) {
	//console.log("_price#updaterow:" + _price + ";_disc:" + _discount);
	$target = $(`#${gTblName} tbody tr`).eq(currentY);
	seq = currentY + 1;

	let qty: number = 0;
	qty = Number($target.find(".qty").val());

	if (forwholesales && Wholesales && Wholesales.wsStatus == "invoice") {
		qty = Number($target.find(".delqty").val());
	}

	let taxrate: number = 0;

	seq = currentY + 1;
	if (_price > 0) {
		// _price = _price * exRate;
	} else {
		if (forsales) {
			if (SalesLnList.length > 0) {
				$.each(SalesLnList, function (i, e) {
					if (e.rtlSeq == seq) {
						selectedSalesLn = structuredClone(e);
						_price = Number(selectedSalesLn!.rtlSellingPrice);
						return false;
					}
				});
			} else {
				_price = selectedSalesLn ? selectedSalesLn!.rtlSellingPrice! : 0;
			}
		}
		if (forpreorder) {
			if (PreSalesLnList.length > 0) {
				$.each(PreSalesLnList, function (i, e) {
					if (e.rtlSeq == seq) {
						selectedPreSalesLn = structuredClone(e);
						_price = Number(selectedPreSalesLn!.rtlSellingPrice);
						return false;
					}
				});
			} else {
				_price = selectedPreSalesLn ? selectedPreSalesLn!.rtlSellingPrice! : 0;
			}
		}
		if (forpurchase) {
			if (Purchase.PurchaseItems.length > 0) {
				$.each(Purchase.PurchaseItems, function (i, e) {
					if (e.piSeq == seq) {
						selectedPurchaseItem = structuredClone(e);
						return false;
					}
				});
			} else {
				_price = selectedPurchaseItem ? selectedPurchaseItem!.piUnitPrice! : 0;
			}
		}

		if (forwholesales) {
			if (WholeSalesLns.length > 0) {
				$.each(WholeSalesLns, function (i, e) {
					if (e.wslSeq == seq) {
						selectedWholesalesLn = structuredClone(e);
						_price = Number(selectedWholesalesLn!.wslSellingPrice);
						return false;
					}
				});
			} else {
				_price = selectedWholesalesLn
					? selectedWholesalesLn!.wslSellingPrice!
					: 0;
			}
		}
	}
	let $price = $target.find(".price");
	$price.off("change");
	//console.log("_price:"+_price);
	$price.val(formatnumber(_price));
	$price.on("change", handlePriceChange);
	//didx = pidx + 1;
	//console.log("disc idx:" + didx);
	if ((forsales || forpreorder) && isPromotion && itemPromotion?.pro4Period) {
		_discount = itemPromotion.proDiscPc!;
	}

	//console.log("_discount#0:" + _discount);
	if (_discount !== 0) {
		let $discount = $target.find(".discpc");
		$discount.off("change");
		$discount.val(formatnumber(_discount));
		$discount.on("change", handleDiscChange);
	} else {
		// console.log("discpc:" + $target.find("td").eq(idx).find(".discpc").val());
		_discount = Number($target.find(".discpc").val());
	}
	//console.log("_discount#1:" + _discount);

	//tidx=didx+1;
	if (enableTax && !inclusivetax) {
		taxrate = Number($target.find(".taxpc").val());
	} else {
		taxrate = 0;
	}

	let newamtplustax: number = 0;
	let newamt: number = 0;

	if (forpurchase && (Purchase.pstStatus !== "order" && Purchase.pstStatus !== "created" && Purchase.pstStatus !== "draft"))
		qty = Number($target.find(".received").val());

	//console.log(
	//  "qty:" + qty + ";price:" + _price + ";tax:" + taxrate + ";disc:" + _discount
	//);
	newamtplustax = calAmountPlusTax(qty, _price, taxrate, _discount);

	if (forsales || forpreorder || forpurchase || forwholesales) {
		newamt = calAmount(qty, _price, _discount);
	}
	//console.log("newamtplustax:" + newamtplustax + ";newamt:" + newamt);

	$target.data("amt", newamt);
	$target.data("amtplustax", newamtplustax);


	//console.log('saleslist#updaterow:', SalesList);
	if (forsales || forpreorder || forpurchase || forwholesales) {
		// console.log("newamtplustax#updaterow:" + newamtplustax);
		//console.log("here");
		_updaterow($target, newamtplustax);
	}

	isPromotion = false;
	itemPromotion = null;
}

function _updaterow($target: JQuery, _amtplustax: number) {
	if (forsales || forpreorder) {
		$("#btnPayment").prop("disabled", false);
	}

	if (forsales || forpreorder || forwholesales) {
		$target
			.find("td")
			.last()
			.find(".amount")
			.val(formatnumber(_amtplustax))
			.data("amount", _amtplustax);
	}

	if (forpurchase) {
		//console.log("here");
		let $amt = $target.find(".amount");
		$amt.off("change");
		$amt.val(formatnumber(_amtplustax));
		$amt.on("change", handleQtyChange);
		updatePurchase();
	}
	//return;
	if (forsales && !reviewmode) {//not for salesorderlist here
		updateSales();
	}
	if (forpreorder) updatePreSales();

	if (forwholesales) {
		//console.log("WholeSalesLns#_updaterow:", WholeSalesLns);
		updateWholesales();
	}
}

let SelectedSupplier: ISupplier;
function handleItemDescDblClick(this: any) {
	getRowCurrentY.call(this);

	if (forrefund) {
		seq = Number(
			$(this)
				.parent("td")
				.parent("tr")
				.find("td")
				.last()
				.find(".rtlSeq")
				.data("rtlseq")
		);
		//console.log("seq:", seq);
		refundsalesln = $.grep(RefundableSalesList, function (e, i) {
			return e.rtlSeq == seq;
		})[0];
	}
	seq = currentY + 1;
	//console.log("seq:" + seq);
	if (forsales) {
		selectedSalesLn = $.grep(SalesLnList, function (e, i) {
			return e.rtlSeq == seq;
		})[0];
	}
	if (forpurchase) {
		selectedPurchaseItem = $.grep(Purchase.PurchaseItems, function (e, i) {
			return e.piSeq == seq;
		})[0];
	}
	if (forwholesales) {
		selectedWholesalesLn = $.grep(WholeSalesLns, function (e, i) {
			return e.wslSeq == seq;
		})[0];
	}
	if (forPGItem || forstock || fortransfer) {
		//selectedItemCode = $(this).parent("tr").find("td").first().text();
		selectedItem = initItem();
		selectedItem.NameDesc = $(this).data("desc") as string;
	}
	openDescModal();
}

function initSupplier(): ISupplier {
	return {
		supId: 0,
		supAbss: false,
		supIsActive: false,
		supIsIndividual: false,
		supCode: "",
		supName: "",
		supTitle: "",
		supFirstName: "",
		supLastName: "",
		supGender: "",
		supPhone: "",
		supMobile: "",
		supEmail: "",
		supNotes: "",
		supContact: "",
		supCardRecordID: 0,
		supIdentifierID: "",
		supCustomField1: "",
		supCustomField2: "",
		supCustomField3: "",
		supAddrLocation: 0,
		supAddrStreetLine1: "",
		supAddrStreetLine2: "",
		supAddrStreetLine3: "",
		supAddrStreetLine4: "",
		supAddrCity: "",
		supAddrState: "",
		supAddrPostcode: "",
		supAddrCountry: "",
		supAddrPhone1: "",
		supAddrPhone2: "",
		supAddrPhone3: "",
		supAddrFax: "",
		supAddrWeb: "",
		supCheckout: false,
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		supPhone1Whatsapp: false,
		supPhone2Whatsapp: false,
		supPhone3Whatsapp: false,
		isABSS: false,
		TaxPercentageRate: 0,
		ExchangeRate: 1,
		JobList: [],
		UploadFileList: [],
	};
}
interface ISupplier {
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
function initStockInItem(): IStockInItem {
	return {
		CompanyId: 0,
		AccountProfileId: 0,
		stCode: "",
		siSeq: 0,
		itmCode: "",
		siBaseUnit: "",
		siQty: 0,
		siBatch: "",
		siHasSN: false,
		siValidThru: new Date(),
		ValidThruDisplay: "",
		siUnitCost: 0,
		siAmt: 0,
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		itmName: "",
		itmUseDesc: false,
		itmDesc: "",
		itmNameDesc: "",
		stLocStock: "",
		SerialNoList: [],
		snlist: [],
		JsValidThru: "",
	};
}
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
let Wholesales: IWholeSale;
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
let gFrmName: string;

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
function resetPage(partial: boolean = false) {
	if (forrefund) {
		if (!partial) {
			$(":input", "#frmCus")
				.not(":button, :submit, :reset, :hidden")
				.val("")
				.prop("checked", false)
				.prop("selected", false);
			$("#tblsales tbody").empty();
		}

		$("#tblRefund tbody").empty();
		//console.log('tblrefund empty');
		$("#txtTotal").val(formatnumber(0));
		$(".paymenttype").val(formatnumber(0));
		$("#refundamount").val(formatnumber(0));
		isEpay = false;
		$("#partialrefundnote").addClass("hide");
		epaytype = "";
		$("#ebtnblk").addClass("hide");

		Payments = [];
		RefundList = [];
		iremain = 0;
		itotalamt = 0;
		refundsalesln = initRefundSales();
		salesrefundlist = [];
		RefundSalesList = [];
		RefundableSalesList = [];
		seq = 0;
		RefundSales = initRefundSales();
		selectedSalesCode = "";
		selectedCusCodeName = "";
		ItemList = [];
		snlist = [];
		cpplList = [];
	}
	if (forreturn) {
	}
}
$(document).on("click", ".colheader", function () {
	let $sortcol = $("<input>").attr({
		type: "hidden",
		name: "SortCol",
		value: $(this).data("col"),
	});
	let $sortorder = $("<input>").attr({
		type: "hidden",
		name: "SortOrder",
		value: $(this).data("order"),
	});
	let $keyword = $("<input>").attr({
		type: "hidden",
		name: "Keyword",
		value: $(this).data("keyword"),
	});
	$(`#frm${gFrmName}`)
		.append($sortcol)
		.append($sortorder)
		.append($keyword)
		.trigger("submit");
});
function GetStocks(pageIndex: number) {
	//let data:IStockFilter = initStockFilter(pageIndex,stocklocation,keyword); //must not use json here!!!
	let includenonstock: number = forsales ? 1 : 0;
	if (!forsales) {
		stocklocation = "";
	}
	//
	let data = { pageIndex: pageIndex, includeStockInfo: 1, location: stocklocation, keyword: keyword, includenonstock: includenonstock, forstock: forstock, fortransfer: fortransfer };
	//console.log('data:', data);
	/*return false;*/
	openWaitingModal();
	$.ajax({
		url: "/Api/GetItemsAjax",
		type: "GET",
		data: data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: OnGetStocksOK,
		error: onAjaxFailure,
	});
}
function OnGetStocksOK(response) {
	//keyword = "";
	closeWaitingModal();
	//console.log('response:', response);
	var model = response;
	//console.log('modelitems:', model.Items);
	let type = forstock ? "stock" : "transfer";
	const primaryLocation: string = model.PrimaryLocation;
	//console.log("primarylocation:" + primaryLocation);

	$("#lastupdatetime").text(model.LatestUpdateTime);

	DicLocItemList = Object.assign({}, model.DicLocItemList);
	DicItemOptions = Object.assign({}, model.DicItemOptions);

	DicIvInfo = Object.assign({}, model.DicIvInfo);

	if (model.Items.length > 0) {
		ItemList = model.Items.slice(0);
		//console.log('itemlist:', itemlist);

		const qtycolwidth: string = "150px";

		let html = "";
		$.each(ItemList, function () {
			var item = this;
			const itemcode = item.itmCode;
			//console.log('item:', item);
			DicStockTransferList[itemcode] = [];

			let itemoption: IItemOptions | null = null;
			if (DicIDItemOptions) {
				itemoption = DicIDItemOptions[item.itmItemID!];
			}

			html += `<tr class="{0}" data-code="${itemcode}" data-jsstocklist="${item.JsonJsStockList}" ondblclick="{1}">`;
			let _checked = icheckall === 1 ? "checked" : "";
			//let _disabled = (itemoption) && itemoption.Disabled ? "disabled" : "";
			let _disabled = _checked !== "" ? "disabled" : "";
			if (forstock)
				html += `<td style="width:10px;max-width:10px;"><input type="checkbox" class="form-check chk" data-Id="${item.itmItemID}" ${_checked} ${_disabled}></td>`;

			if (!fortransfer && enablebuysellunits) {
				html = html
					.replace("{0}", "button")
					.replace("{1}", `HandleStockDblClick("${itemcode}");`);
			}
			//console.log("itemoption:", itemoption);
			let fabatcls = itemoption
				? itemoption.ChkBatch
					? "check-square"
					: "square-o"
				: "square-o";
			let fasncls = itemoption
				? itemoption.ChkSN
					? "check-square"
					: "square-o"
				: "square-o";
			let favtcls = itemoption
				? itemoption.WillExpire
					? "check-square"
					: "square-o"
				: "square-o";

			html += `<td>${itemcode}</td>`;
			html += `<td><span class="text-success"><span class="fa fa-${fabatcls}"></span> <span class="fa fa-${fasncls}"></span> <span class="fa fa-${favtcls}"></span></span></td>`;
			let facls = item.hasItemVari ? "check" : "xmark";
			let displaycls = item.hasItemVari ? "text-success" : "text-danger";
			html += `<td><span class="fa fa-${facls} ${displaycls}"></span></td>`;

			const onhandstock: string =
				item.OnHandStock <= 0
					? `<span class="outofstock">${item.OnHandStock}</span>`
					: item.OnHandStock.toString();
			html += `<td class="itemdesc" data-desc="${item.NameDesc
				}" title="${item.NameDesc}">${handleItemDesc(item.NameDesc)}</td>`;
			html += `<td class="text-right">${onhandstock}<span class="text-info">(${item.AbssQty})</td>`;

			//console.log("shops:", shops);
			$.each(shops, function (i, e) {
				//console.log("sbitem:", sbitem);
				let st: IStockTransfer = initStockTransfer();
				st.itmCode = itemcode;
				st.stShop = e;
				st.stSender = "";
				st.stReceiver = "";
				st.inQty = 0;
				st.outQty = 0;
				let Id: number = 0;
				$.each(item.JsStockList, function (k, v) {
					//console.log('v.loccode:' + v.LocCode);
					if (e == v.LocCode) {
						Id = v.Id;
						return false;
					}
				});
				let diclocqty = item.DicItemLocQty[item.itmCode];
				let dicabssqty = item.DicItemAbssQty[item.itmCode];
				//let splocqty =
				let locqty: number = diclocqty[e] ?? 0;
				let abssqty: number = dicabssqty[e] ?? 0;
				let locqtydisplay: string = "";
				const isprimary = primaryLocation == e ? 1 : 0;

				//for debug only
				//if (itemcode == "ITEMITEM0001" && e=="office") {
				//    //console.log("diclocqty:", diclocqty);
				//    //console.log("locqty:" + locqty);
				//    console.log(itemoption);
				//}
				//if (itemcode == "ABSSP23.9-1U") {
				//    console.log("(itemcode in DicIvInfo):", (itemcode in DicIvInfo));
				//}

				if (locqty <= 0) {
					locqtydisplay = `<span class="danger">${locqty}<span class="text-info">(${abssqty})</span></span>`;
				} else {
					locqtydisplay = `<span>${locqty}<span class="text-info">(${abssqty})</span></span>`;
				}

				//if (itemcode == "ABSSPP23-1U") {
				//    console.log("(itemoption?.ChkBatch || itemoption?.ChkSN || itemoption?.WillExpire):", (itemoption?.ChkBatch || itemoption?.ChkSN || itemoption?.WillExpire));
				//    console.log("(itemcode in DicIvInfo):", (itemcode in DicIvInfo));
				//}

				let readonly =
					itemoption?.ChkBatch ||
						itemoption?.ChkSN ||
						itemoption?.WillExpire ||
						(itemcode in DicIvInfo && DicIvInfo[itemcode].length > 0)
						? "readonly"
						: "";

				//if ((itemoption?.ChkBatch || itemoption?.ChkSN || itemoption?.WillExpire)) readonly = "readonly";
				//else if ((itemcode in DicIvInfo && DicIvInfo[itemcode].length>0)) readonly = "readonly";
				//else readonly = "";
				//else readonly = "readonly";
				//if (itemcode == "ABSSP23.9-1U") console.log("readonly:", readonly);

				//readonly =

				//        ? ""
				//        : (!(itemcode in DicIvInfo))?"": "readonly";
				let inputcls =
					!itemoption?.ChkBatch && !itemoption?.ChkSN && !itemoption?.WillExpire
						? "locqty"
						: "locqty itemoption";
				if (
					itemcode in DicIvInfo &&
					DicIvInfo[itemcode].length > 0 &&
					!itemoption?.ChkBatch &&
					!itemoption?.ChkSN &&
					!itemoption?.WillExpire
				)
					inputcls = "locqty vari";

				let _html = forstock
					? `${locqtydisplay}`
					: `<input type="number" class="${inputcls}" data-isprimary="${isprimary}" data-code="${item.itmCode}" style="width:70%;" data-shop="${e}" data-onhandstock="${item.OnHandStock}" data-Id="${Id}" data-oldval="${locqty}" data-abssqty="${abssqty}" data-itemid="${item.itmItemID}" value="${locqty}" ${readonly} title="${transferdblclickhints}"/>`;

				html += `<td class="text-right" style="width:${qtycolwidth};max-width:${qtycolwidth}">${_html}</td>`;

				DicStockTransferList[item.itmCode].push(st);
			});
			if (fortransfer) {
				let bgcls = item.OutOfBalance >= 0 ? "okbalance" : "outofbalance";
				let _html = `<input type="number" class="balance ${bgcls} btnsmall" style="width:70%;" value="${item.OutOfBalance ?? 0
					}" readonly />`;

				html += `<td style="width:${qtycolwidth};max-width:${qtycolwidth}" class="text-right">${_html}</td>`;
			}
			if (forstock) {
				let _html = `<button class="btn btn-info mr-2 edit btnsmall" type="button" data-Id="${item.itmItemID}" onclick="editItem(${item.itmItemID});"><span class="">${edittxt}</span></button>`;
				html += `<td>${_html}</td>`;
			}
			html += "</tr>";
		});

		$(`#tbl${gTblName} tbody`).empty().html(html);

		let $pager = $(".Pager");
		$pager.ASPSnippets_Pager({
			ActiveCssClass: "current",
			PagerCssClass: "pager",
			PageIndex: model.PageIndex,
			PageSize: model.PageSize,
			RecordCount: model.RecordCount,
		});
	}

	$("#txtStock").trigger("focus");

	togglePaging(type, model.Items.length > 0);
}
function handleItemDesc(itemnamedesc: string): string {
	if (itemnamedesc.length > 40) {
		itemnamedesc = itemnamedesc.substring(0, 25);
		itemnamedesc = itemnamedesc.concat("...");
	}
	return itemnamedesc;
}

function HandleStockDblClick(itemcode: string) {
	selectedItem = initItem();
	selectedItem!.itmCode = itemcode;
	openItemBuySellUnitsModal();
}
let shops: string[] = [];
let devices: string[] = [];
let DicLocQty: { [Key: string]: number } = {};
let DicItemLocQty: { [Key: string]: Array<ILocQty> } = {};
let EditItem: boolean = false;

function editItem(itemId: number) {
	openWaitingModal();
	window.location.href = `/Item/Edit?itemId=${itemId}&referrer=stock`;
}
function removeItem(itemId: number) {
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: nottxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					type: "POST",
					url: "/Item/Delete",
					data: {
						__RequestVerificationToken: $(
							"input[name=__RequestVerificationToken]"
						).val(),
						itemId,
					},
					success: function (data) {
						$.fancyConfirm({
							title: "",
							message: data,
							shownobtn: false,
							okButton: oktxt,
							noButton: notxt,
							callback: function (value) {
								if (value) {
									$("#txtStock").trigger("focus");
								}
							},
						});
					},
					dataType: "json",
				});
			} else {
				$("#txtStock").trigger("focus");
			}
		},
	});
}

function initJsStock(): IJsStock {
	return {
		Id: 0,
		itmCode: "",
		LocCode: "",
		Qty: 0,
	};
}
interface IJsStock {
	Id: number;
	itmCode: string;
	LocCode: string;
	Qty: number;
}
// jquery ready start
$(function () {
	// jQuery code

	//////////////////////// Prevent closing from click inside dropdown
	$(document).on("click", ".dropdown-menu", function (e) {
		e.stopPropagation();
	});

	// make it as accordion for smaller screens
	if (<number>$(window).width() < 992) {
		$(".dropdown-menu a").on("click", function (e) {
			e.preventDefault();
			if ($(this).next(".submenu").length) {
				$(this).next(".submenu").toggle();
			}
			$(".dropdown").on("hide.bs.dropdown", function () {
				$(this).find(".submenu").hide();
			});
		});
	}
}); // jquery end

$(document).on("change", ".stockmode", function () {
	if ($(this).val() == "s") {
		window.location.href = "/Item/Stock";
	} else {
		window.location.href = "/Transfer/Index";
	}
});

function initStockTransfer(): IStockTransfer {
	return {
		Id: 0,
		tmpId: "",
		stCode: stockTransferCode,
		stSender: "",
		stReceiver: "",
		itmCode: "",
		inQty: 0,
		outQty: 0,
		stCounted: 0,
		stVariance: 0,
		stSignedUp_Sender: false,
		stSignedUp_Receiver: false,
		stShop: "",
		stDate: new Date(),
		itmNameDesc: "",
		stChecked: false,
		stRemark: "",
		poIvId: "",
		ivIdList: "",
		CreateTime: new Date(),
		ModifyTime: new Date(),
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
	};
}
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
function convertVarNumToString(inum: any): string {
	if (!isNaN(inum)) {
		return (inum as number).toString();
	}
	return inum;
}

function caller(f) {
	f();
}
function fancyMsg(
	msg: string,
	oktxt: string,
	notxt: string,
	callbackfunc: any = null,
	shownobtn: boolean = false,
	title: string = ""
) {
	//not working! fancyconfirm must not be included in the other function!!!
	$.fancyConfirm({
		title: title,
		message: msg,
		shownobtn: shownobtn,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				if (callbackfunc !== null) {
					caller(callbackfunc);
				}
			}
		},
	});
}
let $deliveryDateDisplay: JQuery;
let $promisedDateDisplay: JQuery;
let $purchaseDateDisplay: JQuery;
let DicCurrencyExRate: { [Key: string]: number } = {};
let DicCurrencySym: { [Key: string]: string } = { "HKD": "$", "GBP": "£", "USD": "$", "CNY": "¥", "EUR": "€" };
let forwholesales: boolean = false;
let fordelivery: boolean = false;
function getExRate(currencyCode: string): number {
	const exrate = $.isEmptyObject(DicCurrencyExRate)
		? 1
		: DicCurrencyExRate[currencyCode];
	//console.log("exrate:" + exrate);
	displayExRate(exrate);
	return exrate;
}
function displayExRate(exrate: number) {
	if (exrate) $("#exratedisplay").text(formatexrate(exrate.toString()));
}
function fillInWholeSale(): IWholeSale {
	batchidx = 6;
	snidx = batchidx + 1;
	vtidx = snidx + 1;
	return {
		wsUID: $("#WholeSales_wsUID").val() as number,
		wsCode: $("#WholeSales_wsCode").val() as string,
		wsCusID: 0,
		wsCusCode: $("#drpCustomer").val() as string,
		wsCustomerPO: $("#wsCustomerPO").val() as string,
		wsCustomerTerms: $("#wsCustomerTerms").val() as string,
		wsSalesLoc: $("#drpLocation").val() as string,
		wsRemark: $("#wsRemark").val() as string,
		AccountProfileId: 0,
		CompanyId: 0,
		wsDate: new Date(),
		WsDateDisplay: <string>$("#WsDateDisplay").val(),
		JsWholesalesDate: $wholesalesDateDisplay.val() as string,
		wsStatus: ($("#WholeSales_wsStatus").val() as string).toLowerCase(),
		wsCurrency: $("#wsCurrency").val() as string,
		wsExRate: getExRate($("#wsCurrency").val() as string),
		wsDeliveryDate: null,
		wsDvc: $("#WholeSales_wsDvc").val() as string,
		wsRefCode: $("#WholeSales_wsRefCode").val() as string,
		wsType: $("#WholeSales_wsType").val() as string,
		wsCusMbr: "",
		wsLineTotal: 0,
		wsLineTotalPlusTax: 0,
		wsFinalDisc: 0,
		wsFinalDiscAmt: 0,
		wsFinalAdj: 0,
		wsFinalTotal: 0,
		wsRmksOnDoc: "",
		wsCarRegNo: "",
		wsUpldBy: "",
		wsUpldTime: "",
		wsUpLdLog: "",
		wsInternalRmks: "",
		wsMonthBase: false,
		wsLineTaxAmt: 0,
		wsDeliveryAddressId: Number($("#wsDeliveryAddressId").val()),
		wsDeliveryAddress1: $("#txtDelAddr").val() as string,
		wsDeliveryAddress2: "",
		wsDeliveryAddress3: "",
		wsDeliveryAddress4: "",
		DeliveryDateDisplay: <string>$("#WholeSales_DeliveryDateDisplay").val(),
		JsDeliveryDate: <string>$deliveryDateDisplay.val(),
		wsReturnDate: "",
		wsSaleComment: "",
		wsCheckout: false,
		wsCheckoutPortal: "",
		WsTimeDisplay: "",
		EnableTax: true,
		InclusiveTax: false,
		ireviewmode: reviewmode ? 1 : 0,
		UseForexAPI: $("#WholeSales_UseForexAPI").val() === "True",
		wsAllLoc: $("#chkAllLoc").is(":checked"),
		UploadFileList: [],
		wsChkManualDelAddr: $("#chkDelAddr").is(":checked"),
		Customer: {} as ICustomer,
		CustomerName: $("#txtCustomerName").val() == null ? null : $("#txtCustomerName").val()!.toString(),
		TrimmedRemark: "",
		CreateBy: ""
	};
}
interface IWholeSale {
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
	wsSaleComment: string;
	wsCheckout: boolean;
	wsCheckoutPortal: string;
	AccountProfileId: number;
	CompanyId: number;
	JsWholesalesDate: string;
	WsDateDisplay: string;
	WsTimeDisplay: string;
	EnableTax: boolean;
	InclusiveTax: boolean;
	wsDate: Date;
	ireviewmode: number;
	UseForexAPI: boolean;
	wsAllLoc: boolean;
	UploadFileList: string[];
	wsChkManualDelAddr: boolean;
	Customer: ICustomer;
	CustomerName: string | null;
	TrimmedRemark: string | null;
	CreateBy: string | null;
}
let WholeSalesLns: IWholeSalesLn[] = [];
function initWholeSalesLn(): IWholeSalesLn {
	return {
		wslUID: 0,
		wslSalesLoc: "",
		wslDvc: "",
		wslCode: "",
		wslDate: "",
		wslSeq: currentY + 1,
		wslRefSales: "",
		wslReasonCode: "",
		wslItemCode: selectedItemCode
			? selectedItemCode.toString()
			: getItemCodeBySeq(),
		wslDesc: "",
		wslStockLoc: "",
		wslChkBch: false,
		wslBatchCode: "",
		wslItemColor: "",
		rtIsConsignIn: false,
		wslIsConsignOut: false,
		wslIsNoCharge: false,
		wslHasSerialNo: false,
		wslHasSn: false,
		wslChkSn: false,
		wslSnReusable: false,
		wslTaxCode: "",
		wslTaxPc: 0,
		wslSellUnit: "",
		wslRrpTaxIncl: 0,
		wslRrpTaxExcl: 0,
		wslLineDiscAmt: 0,
		wslLineDiscPc: 0,
		wslDiscSpreadPc: 0,
		wslQty: 0,
		wslDelQty: 0,
		wslTaxAmt: 0,
		wslSalesAmt: 0,
		wslType: "",
		wslSellingPrice: 0,
		wslCheckout: false,
		wslSellingPriceMinusInclTax: 0,
		AccountProfileId: 0,
		CompanyId: 0,
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		wslStatus: "",
		itmName: "",
		itmNameDesc: "",
		//itmCode: '',
		//itmDesc: '',
		snbvlist: [],
		SerialNoList: [],
		wslValidThru: null,
		ValidThruDisplay: "",
		JsValidThru: "",
		snoUID: 0,
		snvtList: [],
		MissingItemOptions: false,
		Item: {} as IItem,
		JobID: 0,
		comboIvId: "",
		SelectedIvList: [],
		ivIdList: "",
		itemVariList: [],
	};
}
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
	wslItemColor: string;
	rtIsConsignIn: boolean | null;
	wslIsConsignOut: boolean | null;
	wslIsNoCharge: boolean | null;
	wslHasSerialNo: boolean | null;
	wslHasSn: boolean | null;
	wslChkSn: boolean | null;
	wslSnReusable: boolean | null;
	wslTaxCode: string;
	wslTaxPc: number | null;
	wslSellUnit: string;
	wslRrpTaxIncl: number | null;
	wslRrpTaxExcl: number | null;
	wslLineDiscAmt: number | null;
	wslLineDiscPc: number | null;
	wslDiscSpreadPc: number | null;
	wslQty: number | null;
	wslDelQty: number | null;
	wslTaxAmt: number | null;
	wslSalesAmt: number | null;
	wslType: string;
	wslSellingPrice: number | null;
	wslCheckout: boolean | null;
	wslSellingPriceMinusInclTax: number | null;
	AccountProfileId: number;
	CompanyId: number;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	wslStatus: string;
	itmName: string;
	itmNameDesc: string;
	//itmCode: string;
	//itmDesc: string;
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
function initDevice(): IDevice {
	return {
		dvcUID: 0,
		dvcIsActive: false,
		dvcCode: "",
		dvcShop: "",
		dvcNextRtlSalesNo: 0,
		dvcNextRefundNo: 0,
		dvcNextDepositNo: 0,
		dvcNextPurchaseNo: 0,
		dvcNextPsReturnNo: 0,
		dvcNextWholeSalesNo: 0,
		dvcNextWsReturnNo: 0,
		dvcNextRtlSalesNoHold: 0,
		dvcNextRtlQuoNo: 0,
		dvcNextSessionNo: 0,
		dvcName: "",
		dvcShopName: "",
		dvcLastDataChange: "",
		dvcOpStatus: "",
		dvcStockLoc: "",
		dvcPicPath: "",
		dvcMyoDat: "",
		dvcMyoExe: "",
		dvcMyoVer: "",
		dvcXlsPath: "",
		dvcTicketPrinter: "",
		dvcA4Printer: "",
		dvcDisplayPoleConnTo: "",
		dvcDisplayPolePort: "",
		dvcCashDrawerConnTo: "",
		dvcCashDrawerPort: "",
		dvcReceiptPrinter: "",
		dvcDayEndPrinter: "",
		dvcReceiptCopiesCash: 0,
		dvcReceiptCopiesNonCash: 0,
		dvcDefaultCusSales: "",
		dvcDefaultCusRefund: "",
		dvcWcpTermID: "",
		dvcRmks: "",
		dvcShopInfo: "",
		dvcPageHead: "",
		dvcPageFoot: "",
		dvcRtlSalesCode: "",
		dvcRtlRefundCode: "",
		dvcPurchasePrefix: "",
		dvcPsReturnCode: "",
		dvcWholesalesPrefix: "",
		dvcWsReturnCode: "",
		dvcRtlSalesInitNo: "",
		dvcRtlRefundInitNo: "",
		dvcPurchaseInitNo: "",
		dvcPsReturnInitNo: "",
		dvcWholeSalesInitNo: "",
		dvcWsReturnInitNo: "",
		dvcCreateBy: "",
		dvcCreateTime: "",
		dvcModifyBy: "",
		dvcModifyTime: "",
		dvcLockBy: "",
		dvcLockTime: "",
		dvcIP: "",
		dvcInvoicePrefix: "",
		dvcRefundPrefix: "",
		accountNo: 0,
		accountProfileId: 0,
		companyId: 0,
		dvcNextTransferNo: 0,
		dvcTransferCode: "",
	};
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
//let tomorrow = new Date();
//tomorrow.setDate(tomorrow.getDate() + 1);
//function initDatePicker(
//  eleId: string,
//  date: Date | null,
//  showPastDates: boolean = true,
//  dateformat: string = "dd/mm/yy"
//) {
//  $(`#${eleId}`).datepicker({
//    dateFormat: dateformat ?? jsdateformat,
//    //autoOpen:false,
//    beforeShow: function () {
//      setTimeout(function () {
//        $(".ui-datepicker").css("z-index", 99999999999999);
//      }, 0);
//    },
//  });

//  if (date !== null) $(`#${eleId}`).datepicker("setDate", date);

//  if (!showPastDates) $(`#${eleId}`).datepicker("option", { minDate: date });
//  $(`#${eleId}`).datepicker({ autoOpen: false });
//  //$(`#${eleId}`).off("focus");
//}
let NonABSS: boolean = $("#checkoutportal").val() === "nonabss";
//console.log('nonabss:', NonABSS);

function convertCsharpDateStringToJsDate(strdate: string): Date {
	return new Date(Date.parse(strdate));
}
function setValidThruDatePicker() {
	if (forpurchase) {
		$(".validthru").datepicker({
			dateFormat: jsdateformat,
			beforeShow: function () {
				setTimeout(function () {
					$(".ui-datepicker").css("z-index", 99999999999999);
				}, 0);
			},
		});
	} else {
		$(".validthru")
			.not(".focus")
			.datepicker({
				dateFormat: jsdateformat,
				beforeShow: function () {
					setTimeout(function () {
						$(".ui-datepicker").css("z-index", 99999999999999);
					}, 0);
				},
			});
	}

	$(".snvalidthru").datepicker({
		dateFormat: jsdateformat,
		beforeShow: function () {
			setTimeout(function () {
				$(".ui-datepicker").css("z-index", 99999999999999);
			}, 0);
		},
	});
	$(".pobavt").datepicker({
		dateFormat: jsdateformat,
		beforeShow: function () {
			setTimeout(function () {
				$(".ui-datepicker").css("z-index", 99999999999999);
			}, 0);
		},
	});
	$(".posnvt").datepicker({
		dateFormat: jsdateformat,
		beforeShow: function () {
			setTimeout(function () {
				$(".ui-datepicker").css("z-index", 99999999999999);
			}, 0);
		},
	});
}

let $wholesalesDateDisplay: JQuery;
let wholesaleslns: IWholeSalesLn[] = [];
let wholesaleslnswosn: IWholeSalesLn[] = [];

let DicItemBatch: { [Key: string]: string[] } = {};
let SerialNoWoBatchList: string[] = [];

function initPoBatVQ(): IPoBatVQ {
	return {
		pocode: "",
		batchcode: "",
		vt: null,
		batchqty: 0,
	};
}
interface IPoBatVQ extends IBatchVQ {
	pocode: string;
}

let PoItemBatVQList: IPoItemBatVQ[] = [];

function initPoItemBatVQ(): IPoItemBatVQ {
	return {
		id: "",
		pocode: "",
		itemcode: "",
		batchcode: "",
		vt: null,
		batchqty: 0,
	};
}
interface IPoItemBatVQ extends IItemBatchVQ {
	id: string;
	pocode: string;
}

function initItemBatchVQ(): IItemBatchVQ {
	return {
		itemcode: "",
		batchcode: "",
		vt: null,
		batchqty: 0,
	};
}
interface IItemBatchVQ extends IBatchVQ {
	itemcode: string;
}

let DicItemBatchQty: { [Key: string]: Array<IBatchQty> } = {};

function initBatchVQ(): IBatchVQ {
	return {
		batchcode: "",
		vt: null,
		batchqty: 0,
	};
}

interface IBatchVQ {
	batchcode: string;
	vt: string | null;
	batchqty: number;
}

function initBatchQty(): IBatchQty {
	return {
		batcode: "",
		batqty: 0,
		sellableqty: 0,
		itemcode: "",
		delqty: 0,
		seq: 0,
		batId: 0,
		pocode: "",
	};
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

function initBatchVtQty(): IBatchVtQty {
	return {
		batchcode: "",
		validthru: "",
		batchqty: 0,
	};
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

function initItemQtyValidThru(): IPoItemQtyValidThru {
	return {
		PoCode: "",
		ItemCode: "",
		TotalQty: 0,
		LnQty: 0,
		ValidThru: "",
	};
}
interface IPoItemQtyValidThru {
	PoCode: string;
	ItemCode: string;
	TotalQty: number;
	LnQty: number;
	ValidThru: string | null;
}
let DicBatchPoItemQtyValidThru: { [Key: string]: Array<IPoItemQtyValidThru> } =
	{};

function initValidThruBatchSn(): IValidThruBatchSn {
	return {
		ValidThru: null,
		Batch: null,
		SN: null,
	};
}
interface IValidThruBatchSn {
	ValidThru: string | null;
	Batch: string | null;
	SN: string | null;
}
let DicItemValidThruBatchSn: { [Key: string]: Array<IValidThruBatchSn> } = {};

let vtqtyList: Array<IVtQty> = [];
function initVtQty(): IVtQty {
	return {
		vtId: 0,
		vt: "",
		delqty: 0,
		qty: 0,
		pocode: "",
		vtseq: 0,
		itemcode: "",
		sellableqty: 0,
	};
}
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

//function initValidThru(): IValidThru {
//    return {
//        PoValidThru: null,
//        SnValidThru: null,
//    };
//}
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
function initPoBatchQty(): IPoItemBatchVQty {
	return {
		PoCode: "",
		ItemCode: "",
		Batch: null,
		ValidThru: null,
		Qty: 0,
	};
}
interface IPoItemBatchVQty {
	PoCode: string;
	ItemCode: string;
	Batch: string | null;
	ValidThru: string | null;
	Qty: number;
}

function containsObject(obj, list) {
	var i;
	for (i = 0; i < list.length; i++) {
		if (list[i] === obj) {
			return true;
		}
	}
	return false;
}
let DeliveryItems: Array<IDeliveryItem> = [];

function initDeliveryItem(
	$tr: JQuery<HTMLElement> | null = null
): IDeliveryItem {
	if ($tr !== null) {
		let pidx: number = 10; //price index
		let didx: number = pidx + 1;
		let tidx: number = pidx + 2;
		let lidx: number = pidx + 3;
		let jidx: number = pidx + 4;
		let $td = $tr.find("td");
		return {
			Id: 0,
			CompanyId: 0,
			AccountProfileId: 0,
			dlCode: forwholesales ? Wholesales.wsCode : Sales.rtsCode,
			seq: seq,
			batseq: 0,
			snseq: 0,
			vtseq: 0,
			ivseq: 0,
			dlStatus: forwholesales ? Wholesales.wsStatus : Sales.rtsStatus,
			itmCode: $td.eq(1).find(".itemcode").val() as string,
			itmNameDesc: $td.eq(2).find(".itemdesc").val() as string,
			snlist: [],
			dlBaseUnit: $td.eq(3).find(".sellunit").val() as string,
			dlQty: Number($td.eq(5).find(".delqty").val()),
			dlBatch: "",
			dlHasSN: false,
			dlValidThru: null,
			VtDisplay: null,
			JsVt: null,
			dlIvId: null,
			dlUnitPrice: Number($td.eq(pidx).find(".price").val()),
			dlDiscPc: Number($td.eq(didx).find(".discpc").val()),
			dlTaxPc: Number($td.eq(tidx).find(".taxpc").val()),
			dlTaxAmt: 0,
			dlAmt: Number($td.last().find(".amount").val()),
			dlAmtPlusTax: Number($td.last().find(".amount").val()),
			pstCode: "",
			snoCode: "",
			CreateTimeDisplay: "",
			ModifyTimeDisplay: "",
			currentbdq: 0,
			newbdq: 0,
			batqty: 0,
			snvtlist: [],
			vttotalqty: 0,
			newvtqty: 0,
			vtdelqty: 0,
			currentvdq: 0,
			SellingPrice: 0,
			dlBatId: null,
			dlVtId: null,
			dlStockLoc: $td.eq(lidx).find(".location").val() as string,
			JobID: Number($td.eq(jidx).find(".job").val()),
			ivIdList: null,
			ivList: [],
		};
	} else {
		return {
			Id: 0,
			CompanyId: 0,
			AccountProfileId: 0,
			dlCode: "",
			seq: seq,
			batseq: 0,
			snseq: 0,
			vtseq: 0,
			ivseq: 0,
			dlStatus: "",
			itmCode: "",
			itmNameDesc: "",
			snlist: [],
			dlBaseUnit: "",
			dlQty: 0,
			dlBatch: "",
			dlHasSN: false,
			dlValidThru: null,
			VtDisplay: null,
			JsVt: null,
			dlIvId: null,
			dlUnitPrice: 0,
			dlDiscPc: 0,
			dlTaxPc: 0,
			dlTaxAmt: 0,
			dlAmt: 0,
			dlAmtPlusTax: 0,
			pstCode: "",
			snoCode: "",
			CreateTimeDisplay: "",
			ModifyTimeDisplay: "",
			currentbdq: 0,
			newbdq: 0,
			batqty: 0,
			snvtlist: [],
			vttotalqty: 0,
			newvtqty: 0,
			vtdelqty: 0,
			currentvdq: 0,
			SellingPrice: 0,
			dlBatId: null,
			dlVtId: null,
			dlStockLoc: "",
			JobID: 0,
			ivIdList: null,
			ivList: [],
		};
	}
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
	SellingPrice: number;
	dlBatId: number | null;
	dlVtId: number | null;
	dlStockLoc: string;
	JobID: number | null;
	ivIdList: string | null;
	ivList: IPoItemVari[];
}
function initItemOptions(): IItemOptions {
	return {
		ChkBatch: false,
		ChkSN: false,
		WillExpire: false,
		Disabled: false,
	};
}
interface IItemOptions {
	ChkBatch: boolean;
	ChkSN: boolean;
	WillExpire: boolean;
	Disabled: boolean;
}
let itemOptions: IItemOptions | null;
let DicItemOptions: { [Key: string | number]: IItemOptions } = {};

function toggleSnVt() {
	itemOptions = DicItemOptions[selectedItemCode];
	//console.log('itemoptions:', itemOptions);
	if (itemOptions.WillExpire) {
		$("#tblSerial thead tr").find("th:eq(2)").show();
	} else {
		$("#tblSerial thead tr").find("th:eq(2)").hide();
	}
}

function initSnVtPo(): ISnVtPo {
	return {
		pocode: "",
		sn: "",
		vt: "",
		selected: false,
	};
}
interface ISnVtPo extends ISnVt {
	pocode: string;
}
let DicItemSnos: { [Key: string]: string[] } = {};
let DicItemBatSnVtList: { [Key: string]: { [Key: string]: Array<IBatSnVt> } } =
	{};

$(document).on("click", ".snminus", function () {
	$tr = $(this).parent("td").parent("tr");
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				$tr.remove();
			} else {
				$tr.find("td:eq(1)").find(".pserial").trigger("focus");
			}
		},
	});
});
$(document).on("click", ".snplus", function () {
	addPoSnRow(true);
});

function fillSnRow(idx: number, snseqvt: ISnBatSeqVt | null): string {
	let html = "";
	let _seq: number =
		snseqvt === null ? idx + 1 : ((<ISnBatSeqVt>snseqvt).snseq as number);

	html += `<tr data-idx="${idx}" data-itemcode="${selectedItemCode}" data-snseq="${_seq}">`;
	let sn: string = snseqvt === null ? "" : (<ISnBatSeqVt>snseqvt).sn;
	let vt: string =
		snseqvt === null ? "" : ((<ISnBatSeqVt>snseqvt).vt as string);

	html += `<td>${_seq}</td><td><input type="text" class="form-control text-center posn" value="${sn}" /></td>`;

	if (itemOptions && itemOptions.WillExpire) {
		html += `<td><input type="datetime" class="form-control text-center datepicker posnvt small" value="${vt}" /></td>`;
	}

	html += `<td><button type="button" class="btn btn-danger snminus"><i class="fa fa-minus"></i></button></td>`;
	html += `</tr>`;
	return html;
}
function addPoSnRow(plus: boolean = false) {
	$target = purchaseSerialModal.find("#tblPserial tbody");
	let html = "";

	if (plus) {
		html = fillSnRow($(`#tblPserial tbody tr`).length, null);
	} else {
		if (forpurchase) {
			if (selectedPurchaseItem!.snbatseqvtlist.length > 0) {
				let $rows = $target.find("tr");
				let tblSns: string[] = [];
				if ($rows.length > 0) {
					$rows.each(function (i, e) {
						let sn = $(e).find("td:eq(1)").find(".posn").val() as string;
						if (typeof sn !== "undefined") tblSns.push(sn);
					});
					$.each(selectedPurchaseItem!.snbatseqvtlist, function (i, e) {
						//tblSns.includes(e.sn) may happen when sn length !== po quantity
						if (tblSns.length > 0 && tblSns.includes(e.sn)) {
							html = fillSnRow(0, null);
							return false;
						} else {
							html += fillSnRow(i, e);
						}
					});
				} else {
					$.each(selectedPurchaseItem!.snbatseqvtlist, function (i, e) {
						html += fillSnRow(i, e);
					});
				}
			} else {
				//console.log('selectedPurchaseItem!.piReceivedQty:' + selectedPurchaseItem!.piReceivedQty);
				for (let i = 0; i < selectedPurchaseItem!.piReceivedQty; i++) {
					html += fillSnRow(i, null);
				}
			}
		}
	}

	$target.append(html);
	setValidThruDatePicker();
	setSerialFocus($target);
}
function setSerialFocus($target: JQuery) {
	$target.find("tr").each(function (i, e) {
		let $pserial = $(e).find("td").eq(1).find(".posn");
		if ($pserial.val() === "") {
			$pserial.trigger("focus");
			return false;
		}
	});
}

let posnseq: number = 0;
$(document).on("change", ".posn", function () {
	//check if duplicated on the client side:
	let sn = $(this).val() as string;
	if (sn !== "") {
		let samesncount: number = 0;
		$("#tblPserial tbody tr").each(function (i, e) {
			$target = $(e).find("td:eq(1)").find(".posn");
			if ($target.val() == sn) {
				//disable vt datepicker first
				$target.parent("td").next("td").find(".posnvt").prop("disabled", true);
				samesncount++;
				//return false;
			}
		});

		if (samesncount > 1) {
			duplicatedSerailNo = true;
			$(this).val("");
			handleDuplicatedPoSn(duplicatedsnwarning);
			duplicatedSerailNo = false;
		} else {
			if (forpurchase) {
				$.each(Purchase.PurchaseItems, function (i, e) {
					if (e.snbatseqvtlist.length > 0) {
						$.each(e.snbatseqvtlist, function (idx, ele) {
							//console.log('ele.sn:' + ele.sn + ';sn:' + sn + ';equal?' + ele.sn == sn);
							if (ele.sn == sn) {
								duplicatedSerailNo = true;
								return false;
							}
						});
					}
				});
			}

			if (duplicatedSerailNo) {
				$(this).val("");
				handleDuplicatedPoSn(duplicatedsnwarning);
				duplicatedSerailNo = false;
			} else {
				posnseq = Number(
					$(this).parent("td").parent("tr").find("td:first").text()
				);
				//console.log("check server side:");
				//check server side:
				getRemoteData(
					"/Api/CheckIfDuplicatedSN",
					{ sn: sn },
					checkIfDuplicatedSNOk,
					getRemoteDataFail
				);
			}
		}
	}
});

let posnvt: string = "";
$(document).on("change", ".posnvt", function () {
	posnvt = $(this).val() as string;
});

function checkIfPoSnDuplicatedSNOk(data) {
	//console.log(data);
	duplicatedSerailNo = data.serialno !== null;
	if (duplicatedSerailNo) {
		let msg = duplicatedserialnowarning;
		snUsedDate = data.serialno.PurchaseDateDisplay;
		msg = msg
			.replace("{1}", snUsedDate)
			.replace("{0}", data.serialno.snoStockInCode);
		handleDuplicatedPoSn(msg);
	}
}

function handleDuplicatedPoSn(msg: string) {
	$.fancyConfirm({
		title: duplicatedserialno,
		message: msg,
		shownobtn: false,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				$("#tblPserial tbody tr")
					.eq(posnseq)
					.find("td:eq(1)")
					.find(".posn")
					.addClass("focus")
					.trigger("focus");
			}
		},
	});
}
function resetPurchaseSerialModal() {
	$("#tblPserial tbody").empty();
}

let itemSeqSnBatSeqVtList: {
	[Key: string]: { [Key: string]: Array<ISnBatSeqVt> };
} = {};
function _confirmSnVt() {
	closePurchaseSerialModal();
	resetPurchaseSerialModal();
}
function confirmPoSn() {
	let bOk = false;
	let itemcode = forpurchase
		? selectedPurchaseItem!.itmCode
		: selectedSalesLn!.rtlItemCode;
	itemOptions = DicItemOptions[itemcode];
	let msg = "";

	if (itemcode != "") {
		if (typeof itemSeqSnBatSeqVtList[itemcode] === "undefined") {
			itemSeqSnBatSeqVtList[itemcode] = { [seq.toString()]: [] };
		} else if (
			typeof itemSeqSnBatSeqVtList[itemcode][seq.toString()] === "undefined"
		) {
			itemSeqSnBatSeqVtList[itemcode][seq.toString()] = [];
		}

		let $rows = $("#tblPserial tbody tr");
		if ($rows.length === 1) {
			msg = handlePoSn4Confirm($rows, itemcode);
		} else {
			$rows.each(function (i, e) {
				//console.log('here');
				msg = handlePoSn4Confirm($(e), itemcode);
			});
		}
		bOk = msg === "";

		if (bOk) {
			/*Error -234:  Received quantity cannot exceed the Ordered quantity.*/
			if (forpurchase) {
				let snqty = selectedPurchaseItem!.snbatseqvtlist.length;
				if (
					selectedPurchaseItem!.snbatseqvtlist.length >
					selectedPurchaseItem!.piReceivedQty ||
					selectedPurchaseItem!.snbatseqvtlist.length <
					selectedPurchaseItem!.piReceivedQty
				) {
					/*if (selectedPurchaseItem!.snbatseqvtlist.length < selectedPurchaseItem!.piReceivedQty) {*/
					$.fancyConfirm({
						title: "",
						message: serialnoqtymustmatchreceivedqtyprompt,
						shownobtn: false,
						okButton: oktxt,
						noButton: notxt,
						callback: function (value) {
							$target = $(`#${gTblName} tbody tr`)
								.eq(currentY)
								.find("td:last")
								.find(".received");
							if (value) {
								$target.attr("max", snqty).val(snqty).trigger("focus");
								$target.trigger("change");
								_confirmSnVt();
							} else {
								$("#tblPserial tbody tr:last")
									.find("td:eq(1)")
									.find(".posn")
									.trigger("focus");
							}
						},
					});
				} else {
					_confirmSnVt();
				}

				$.each(Purchase.PurchaseItems, function (i, e) {
					if (e.piSeq == seq) {
						e.snbatseqvtlist = selectedPurchaseItem!.snbatseqvtlist.slice(0);
						e.piHasSN = e.snbatseqvtlist.length > 0;
						return false;
					}
				});
			}

			setPoSnMark();

			if (itemOptions.WillExpire) {
				setExpiryDateMark();
			}
			//console.log('purchaseitems#ok:', Purchase.PurchaseItems);
		} else {
			$.fancyConfirm({
				title: "",
				message: msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						$("#tblPserial tbody tr").find(".focus").first().trigger("focus");
					}
				},
			});
		}
	}
}

function handlePoSn4Confirm($tr: JQuery, itemcode: string): string {
	let msg = "";
	$target = $tr.find("td:eq(1)").find(".posn");
	let serialcode: string = $target.val() as string;
	if (serialcode === "") {
		msg += `#${$tr.data("snseq")}${rowtxt} ${snrequiredtxt}<br>`;
		$target.addClass("focus");
	} else {
		getRemoteData(
			"/Api/CheckIfDuplicatedSN",
			{ sn: serialcode },
			checkIfPoSnDuplicatedSNOk,
			getRemoteDataFail
		);
	}
	if (!duplicatedSerailNo) {
		// console.log("here");
		let serial: ISnBatSeqVt = initSnBatSeqVt();
		serial.sn = serialcode;
		serial.snseq = $tr.data("snseq") as number;

		if (itemOptions && itemOptions.ChkBatch && itemOptions.ChkSN) {
			serial.batcode = forpurchase
				? selectedPurchaseItem!.batchList[0].batCode
				: selectedSalesLn!.batchList[0].batCode;
		}

		$target = $tr.find("td:eq(2)").find(".posnvt");
		let validthru: any = $target.val();
		if (validthru) validthru = validthru.toString().trim();
		if (itemOptions && itemOptions.WillExpire) {
			if (validthru === "") {
				msg += `#${serial.snseq}${rowtxt} ${expirydaterequiredtxt}<br>`;
				$target.addClass("focus");
			} else {
				serial.vt = validthru;
			}
		}
		updateUniqueSerial(serial, itemcode);
	}
	return msg;
}

function updateUniqueSerial(serial: ISnBatSeqVt, itemcode: string) {
	if (serial.sn !== "") {
		//console.log("snbatseqvtlist#0:", selectedPurchaseItem!.snbatseqvtlist);
		if (forpurchase) {
			if (selectedPurchaseItem!.snbatseqvtlist.length > 0) {
				let idx = selectedPurchaseItem!.snbatseqvtlist.findIndex(
					(s) => s.snseq === serial.snseq
				);
				if (idx >= 0) {
					selectedPurchaseItem!.snbatseqvtlist[idx] = structuredClone(serial); //update
				} else {
					selectedPurchaseItem!.snbatseqvtlist.push(serial);
				}
			} else {
				selectedPurchaseItem!.snbatseqvtlist.push(serial);
			}
		}

		if (itemSeqSnBatSeqVtList[itemcode][seq.toString()].length > 0) {
			let idx = itemSeqSnBatSeqVtList[itemcode][seq.toString()].findIndex(
				(s) => s.snseq === serial.snseq
			);
			if (idx >= 0) {
				itemSeqSnBatSeqVtList[itemcode][seq.toString()][idx] =
					structuredClone(serial); //update
			} else {
				itemSeqSnBatSeqVtList[itemcode][seq.toString()].push(serial);
			}
		} else {
			itemSeqSnBatSeqVtList[itemcode][seq.toString()].push(serial);
		}
	}
}

function setPoSnMark() {
	let $tr = $(`#${gTblName} tbody tr`);
	$tr
		.eq(currentY)
		.find("td")
		.eq(6)
		.find(".posn")
		.removeClass("focus")
		.val("...");
	/* $(`#${gTblName} tbody tr`).eq(currentY).find('td:eq(5)').find('.posn').removeClass('focus');*/
}

$(document).on("click", ".batminus", function () {
	$tr = $(this).parent("td").parent("tr");
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				$tr.remove();
			} else {
				$tr.find("td:eq(1)").find(".pbatch").trigger("focus");
			}
		},
	});
});
$(document).on("click", ".batplus", function () {
	addPoBatRow(true);
});

function fillBatchRow(index: number | null, batch: IBatch | null): string {
	$target = purchaseBatchModal.find("#tblPbatch tbody");
	//console.log("batch#fill:", batch);
	let html = "";
	let idx = batch === null ? Number(index) : Number(batch.batSeq) - 1;
	let batcode = batch === null ? "" : batch.batCode;
	let vt = batch === null ? "" : batch.BatVtDisplay ?? "N/A";
	let batseq = batch === null ? idx + 1 : batch.batSeq;
	let batqty = batch === null ? 0 : batch.batQty;
	html += `<tr data-idx="${idx}" data-batseq="${batseq}">`;
	html += `<td>${idx + 1
		}</td><td class="text-center"><input type="text" class="form-control pbatch" value="${batcode}" /></td>`;

	if (
		(itemOptions && itemOptions.ChkSN && itemOptions.WillExpire) ||
		(itemOptions && itemOptions.ChkBatch && !itemOptions.WillExpire)
	) {
	} else {
		html += `<td class="text-center"><input type="datetime" class="form-control datepicker pobavt small" value="${vt}" /></td>`;
	}

	if (itemOptions && itemOptions.ChkBatch && !itemOptions.ChkSN)
		html += `<td class="text-right"><input type="number" class="form-control batqty" value="${batqty}" /></td>`;

	if (itemOptions && itemOptions.ChkBatch && itemOptions.ChkSN) {
	} else {
		html += `<td><button type="button" class="btn btn-danger batminus"><i class="fa fa-minus"></i></button></td>`;
	}

	html += `</tr>`;
	return html;
}
function addPoBatRow(isPlus: boolean = true) {
	let html = "";
	if (isPlus) {
		html = fillBatchRow($(`#tblPbatch tbody tr`).length, null);
	} else {
		$target = purchaseBatchModal.find("#tblPbatch tbody");
		if (
			selectedPurchaseItem &&
			selectedPurchaseItem!.batchList &&
			selectedPurchaseItem!.batchList.length > 0
		) {
			if (Purchase.pstStatus !== "order") {
				//console.log("here");
				$.each(selectedPurchaseItem!.batchList, function (i, e) {
					html += fillBatchRow(i, e);
				});
			} else {
				let idx = -1;
				$.each(selectedPurchaseItem!.batchList, function (i, e) {
					if (e.seq == seq) {
						idx = i;
						html += fillBatchRow(i, e);
						return false;
					}
				});
				if (idx < 0) {
					html = fillBatchRow(0, null);
				}
			}
		} else {
			html = fillBatchRow(0, null);
		}
	}
	$target.append(html);
	if (forpurchase) {
		if (Purchase.pstStatus != "opened") {
			setBatchFocus();
			setValidThruDatePicker();
		}
	}
}

function resetPurchaseBatchModal() {
	$("#tblPbatch tbody").empty();
}

function setBatchFocus() {
	$("#tblPbatch tbody tr").each(function (i, e) {
		let $pbat = $(e).find("td").eq(1).find(".pbatch");
		if ($pbat.val() === "") {
			$pbat.trigger("focus");
			return false;
		}
	});
}

function checkBatQty(): boolean {
	let qty = $(`#${gTblName} tbody tr`)
		.eq(currentY)
		.find("td:eq(4)")
		.find(".qty")
		.val() as number;
	let totalbatqty = 0;
	$("#tblPbatch tbody tr").each(function (i, e) {
		let idx = itemOptions && itemOptions.WillExpire ? 3 : 2;
		totalbatqty += Number($(e).find("td").eq(idx).find(".batqty").val());
	});
	//console.log('qty:' + qty + ':totalbatqty:' + totalbatqty);
	if (totalbatqty > qty) {
		$.fancyConfirm({
			title: "",
			message: batqtymustnotgtpoqtytxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(".batqty").addClass("focus");
				}
			},
		});
	}
	return qty >= totalbatqty;
}

function confirmPoBatch() {
	if (itemOptions && !itemOptions.ChkSN && !checkBatQty()) {
		return false;
	}

	let bOk = false;
	itemOptions = DicItemOptions[selectedItemCode];
	let msg = "";

	$("#tblPbatch tbody tr").each(function (i, e) {
		msg += _confirmPoBatch($(e));
	});

	bOk = msg === "";

	if (bOk) {
		closePurchaseBatchModal();
		if (forpurchase) {
			$.each(Purchase.PurchaseItems, function (i, e) {
				//console.log('e.piseq:' + e.piSeq + ';seq:' + seq);
				if (e.piSeq == seq) {
					e.batchList = selectedPurchaseItem!.batchList.slice(0);
					let lnqty = 0;
					$.each(e.batchList, function (k, v) {
						lnqty += v.batQty;
					});
					return false;
				}
			});
		}

		setBatchMark();
		$(`#${gTblName} tbody tr`)
			.eq(currentY)
			.find("td:eq(5)")
			.find(".pobatch")
			.removeClass("focus");
		if (!itemOptions.ChkSN && itemOptions.WillExpire) {
			setExpiryDateMark();
			$(`#${gTblName} tbody tr`)
				.eq(currentY)
				.find("td:eq(7)")
				.find(".validthru")
				.removeClass("focus validthru datepicker")
				.prop("readonly", true);
		}
	} else {
		$.fancyConfirm({
			title: "",
			message: msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$("#tblPbatch tbody tr").find(".focus").first().trigger("focus");
				}
			},
		});
	}
}
function _confirmPoBatch($tr: JQuery): string {
	let msg = "";
	let idx = 1;
	$target = $tr.find("td").eq(idx).find(".pbatch");
	let batchcode: string = $target.val() as string;
	let batch: IBatch = initBatch();
	batch.batItemCode = selectedItemCode.toString();
	batch.batSeq = Number($tr.data("batseq"));

	if (itemOptions && itemOptions.ChkBatch) {
		// console.log("batchcode:" + batchcode);
		if (batchcode === "") {
			msg += `#${seq}${rowtxt} ${batchrequiredtxt}<br>`;
			$target.addClass("focus");
		} else {
			batch.batCode = batchcode;
		}

		if (itemOptions.WillExpire) {
			idx++;
			$target = $tr.find("td").eq(idx).find(".pobavt");
			let validthru: any = $target.val();
			if (validthru) validthru.toString().trim();
			if (itemOptions.WillExpire) {
				if (validthru === "") {
					msg += `#${seq}${rowtxt} ${expirydaterequiredtxt}<br>`;
					$target.addClass("focus");
				} else {
					batch.validthru = validthru;
				}
			}
		}

		if (!itemOptions.ChkSN) {
			idx++;
			$target = $tr.find("td").eq(idx).find(".batqty");
			batch.batQty = Number($target.val());
			if (batch.batQty == 0) {
				msg += `#${seq}${rowtxt} ${batqtyrequiredtxt}<br>`;
				$target.addClass("focus");
			}
		} else {
			batch.batQty = Number(
				$(`#${gTblName} tbody tr`)
					.eq(currentY)
					.find("td")
					.eq(4)
					.find(".qty")
					.val()
			);
		}
	}

	if (msg === "") {
		//console.log("batchlist#0:", selectedPurchaseItem!.batchList);
		if (forpurchase) {
			if (!selectedPurchaseItem)
				selectedPurchaseItem = Purchase.PurchaseItems.find(
					(x) => x.piSeq == seq
				)!;

			let idx = selectedPurchaseItem!.batchList.findIndex(
				(b) => b.batSeq == batch.batSeq
			);
			if (idx >= 0) {
				selectedPurchaseItem!.batchList[idx] = structuredClone(batch); //update
			} else {
				selectedPurchaseItem!.batchList.push(batch);
			}
		}
	}
	return msg;
}

function confirmIvQty() {
	ivdelqtychange = false; //reset ivdelqtychange
	let lnqty: number = 0;

	if (!itemOptions) return false;

	$("#tblIv tbody tr").each(function (i, e) {
		$(e)
			.find("td")
			.first()
			.find(".ivdelqty")
			.each(function (k, v) {
				let newivqty = Number($(v).val());
				if (newivqty > 0) {
					deliveryItem = initDeliveryItem();
					deliveryItem.dlQty = newivqty;
					deliveryItem.seq = seq;
					deliveryItem.pstCode = $(v).data("pocode") as string;
					deliveryItem.dlCode = $(v).data("id") as string;
					deliveryItem.ivIdList = $(v).data("ividlist").toString().trim();
					deliveryItem.itmCode = $(v).data("itemcode") as string;

					deliveryItem.ivseq = Number($(v).data("ivseq"));
					deliveryItem.dlVtId = Number($(v).data("ivid"));

					lnqty += newivqty;
					getItemInfo4BatSnVtIv();

					let idx = -1;
					DeliveryItems.every((d, i) => {
						if (d.dlCode == deliveryItem!.dlCode && d.seq == seq) {
							idx = i;
							//update
							d = structuredClone(deliveryItem) as IDeliveryItem;
							return false;
						}
					});

					if (deliveryItem.dlQty <= 0) {
						DeliveryItems.splice(idx, 1);
					}

					//add
					if (idx < 0) {
						DeliveryItems.push(deliveryItem);
					}
				}
			});
	});

	//console.log("DeliveryItems#confirmivqty:", DeliveryItems);
	//$("#totalivdelqty").data("totalivdelqty", lnqty).val(lnqty);

	let $qty = $(`#${gTblName} tbody tr`)
		.eq(currentY)
		.find("td")
		.eq(4)
		.find(".qty");

	const qty: number = Number($qty.val());

	if (lnqty > qty) {
		//console.log("here");
		$.fancyConfirm({
			title: "",
			message: newqtygtoriginalqtyindeliveryconfirmtxt,
			shownobtn: true,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					if ($qty.val() == "" || $qty.val() == 0) $qty.val(lnqty);

					closeValidthruModal();
					setExpiryDateMark();
				} else {
					lnqty = 0;
					$("#totalivdelqty").data("totalivdelqty", lnqty).val(lnqty);
					$(".ivdelqty").val(0).addClass("focus");

					$("#tblIv tbody tr").each(function (i, e) {
						$(e)
							.find("td")
							.first()
							.find(".ivdelqty")
							.each(function (k, v) {
								let dlCode = $(v).attr("id") as string;
								let idx = -1;
								$.each(DeliveryItems, function (index, ele: IDeliveryItem) {
									if (ele.dlCode == dlCode) {
										idx = index;
										return false;
									}
								});
								if (idx >= 0) DeliveryItems.splice(idx, 1);
							});
					});
				}
			},
		});
	} else {
		closeItemVariModal();
		if (lnqty > 0) {
			$qty.val(lnqty).trigger("change");
			setIvMark();
		}
	}
	console.log(DeliveryItems);
	closeItemVariModal();
}
function confirmPoItemVariQty() {
	let selectedIvIdList: number[] = [];
	poItemVariModal.find(".drpItemAttr").each(function (i, e) {
		selectedIvIdList.push(Number($(e).val()));
	});

	let selectedBatCode: string =
		!itemOptions?.ChkBatch && !itemOptions?.ChkSN && !itemOptions?.WillExpire
			? ""
			: poItemVariModal.find("#batcode").val();

	if (selectedIvIdList.length > 0) {
		$tr = $(`#${gTblName} tbody tr`).eq(currentY);
		$tr.find("td").eq(8).find(".povari").removeClass("focus").val("...");
		const itemcode: string = $tr
			.find("td")
			.eq(1)
			.find(".itemcode")
			.val()!
			.toString();
		const ivqty = Number($tr.find("td").last().find(".received").val());
		const comboId = selectedIvIdList.join(":");
		Purchase.PurchaseItems.forEach((x) => {
			if (x.piSeq == seq) {
				if (
					x.poItemVariList &&
					x.poItemVariList.findIndex((x) => x.ivComboId == comboId) < 0
				) {
					addPoItemVari(
						x,
						comboId,
						ivqty,
						itemcode,
						selectedIvIdList,
						selectedBatCode
					);
				} else {
					addPoItemVari(
						x,
						comboId,
						ivqty,
						itemcode,
						selectedIvIdList,
						selectedBatCode
					);
				}
			}
		});
	}
	//console.log(Purchase.PurchaseItems);
	closePoItemVariModal();
}

function addItemVari(
	x: IDeliveryItem,
	ivqty: number,
	itemcode: string,
	selectedIvIdList: string[]
) {
	x.ivList = [];
	x.ivList.push({
		JsIdList: selectedIvIdList.slice(0),
		seq: currentY + 1,
		ivQty: ivqty,
		itmCode: itemcode,
		batCode: null,
	} as IPoItemVari);

	x.ivIdList = selectedIvIdList.join();
}
function addPoItemVari(
	x: IPurchaseItem,
	comboId: string,
	ivqty: number,
	itemcode: string,
	selectedIvIdList: number[],
	selectedBatCode: string
) {
	x.poItemVariList.push({
		ivComboId: comboId,
		seq: currentY + 1,
		ivQty: ivqty,
		itmCode: itemcode,
		JsIvIdList: selectedIvIdList.slice(0),
		batCode: selectedBatCode,
	} as IPoItemVari);
}
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
function initBatch(): IBatch {
	return {
		Id: 0,
		batCode: "",
		batValidThru: null,
		validthru: null,
		BatVtDisplay: null,
		batSeq: null,
		batItemCode: "",
		batStockInCode: "",
		batStockInDate: null,
		JsStockDate: "",
		batQty: 0,
		seq: seq,
	};
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

function confirmTransferQty() { }

function resetVtQty() {
	$(".delqty").val(0);
}

function confirmVtQty() {
	vtdelqtychange = false; //reset vtdelqtychange
	let lnqty: number = 0;

	if (!itemOptions) return false;

	$("#tblVt tbody tr").each(function (i, e) {
		$(e)
			.find("td")
			.first()
			.find(".vtdelqty")
			.each(function (k, v) {
				let newvtqty = Number($(v).val());
				if (newvtqty > 0) {
					deliveryItem = initDeliveryItem();
					deliveryItem.newvtqty = newvtqty;
					deliveryItem.seq = seq;
					deliveryItem.vttotalqty = parseInt($(v).data("qty"));
					if (deliveryItem.newvtqty > deliveryItem.vttotalqty) {
						deliveryItem.newvtqty = deliveryItem.vttotalqty;
						$(v).val(deliveryItem.newvtqty);
					}
					deliveryItem.pstCode = $(v).data("pocode") as string;
					deliveryItem!.dlQty = deliveryItem!.newvtqty;
					deliveryItem.dlCode = $(v).attr("id") as string;
					deliveryItem.JsVt = $(v).data("vt").toString().trim();
					deliveryItem.itmCode = $(v).data("itemcode") as string;

					deliveryItem.vtseq = Number($(v).data("vtseq"));
					deliveryItem.dlVtId = Number($(v).data("vtid"));

					lnqty += deliveryItem!.newvtqty;
					getItemInfo4BatSnVtIv();

					let idx = -1;
					DeliveryItems.every((d, i) => {
						if (d.dlCode == deliveryItem!.dlCode && d.seq == seq) {
							idx = i;
							//update
							d = structuredClone(deliveryItem) as IDeliveryItem;
							return false;
						}
					});

					if (deliveryItem.dlQty <= 0) {
						DeliveryItems.splice(idx, 1);
					}

					//add
					if (idx < 0) {
						DeliveryItems.push(deliveryItem);
					}
				}
			});
	});

	//console.log("DeliveryItems#confirmvtqty:", DeliveryItems);
	//$("#totalvtdelqty").data("totalvtdelqty", lnqty).val(lnqty);

	let $qty = $(`#${gTblName} tbody tr`)
		.eq(currentY)
		.find("td")
		.eq(4)
		.find(".qty");

	const qty: number = Number($qty.val());

	if (lnqty > qty) {
		//console.log("here");
		$.fancyConfirm({
			title: "",
			message: newqtygtoriginalqtyindeliveryconfirmtxt,
			shownobtn: true,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					if ($qty.val() == "" || $qty.val() == 0) $qty.val(lnqty);

					closeValidthruModal();
					setExpiryDateMark();
				} else {
					lnqty = 0;
					$("#totalvtdelqty").data("totalvtdelqty", lnqty).val(lnqty);
					$(".vtdelqty").val(0).addClass("focus");

					$("#tblVt tbody tr").each(function (i, e) {
						$(e)
							.find("td")
							.first()
							.find(".vtdelqty")
							.each(function (k, v) {
								let dlCode = $(v).attr("id") as string;
								let idx = -1;
								$.each(DeliveryItems, function (index, ele: IDeliveryItem) {
									if (ele.dlCode == dlCode) {
										idx = index;
										return false;
									}
								});
								if (idx >= 0) DeliveryItems.splice(idx, 1);
							});
					});
				}
			},
		});
	} else {
		closeValidthruModal();
		if (lnqty > 0) {
			$qty.val(lnqty).trigger("change");
			setExpiryDateMark();
		}
	}
}

function resetBatchQty() {
	//DicItemSeqDelQty[genItemSeq(selectedItemCode.toString(), seq)] = 0;
	$(".batdelqty").val(0);
}

function confirmBatchSnQty() {
	chkBatSnVtCount = 0; //reset chkBatSnVtCount
	batdelqtychange = false; //reset batdelqtychange
	let lnqty: number = 0;

	if (!itemOptions) return false;

	$("#tblBatch tbody tr").each(function (i, e) {
		let ividlist: string[] = [];
		if (!$.isEmptyObject(DicIvInfo) && selectedItemCode in DicIvInfo) {
			$(e)
				.data("ivids")
				.toString()
				.split(",")
				.forEach((x) => ividlist.push(x));
		}
		if (!itemOptions!.ChkSN) {
			$(e)
				.find("td")
				.eq(1)
				.find(".batdelqty")
				.each(function (k, v) {
					let newbdq = Number($(v).val());
					if (newbdq > 0) {
						deliveryItem = initDeliveryItem();
						deliveryItem.ivIdList = ividlist.join();
						deliveryItem.newbdq = newbdq;
						deliveryItem.seq = seq;
						//console.log("#confirm deliveryItem.seq:", deliveryItem.seq);

						deliveryItem.batqty = parseInt($(v).data("batqty"));
						if (deliveryItem.newbdq > deliveryItem.batqty) {
							deliveryItem.newbdq = deliveryItem.batqty;
							$(v).val(deliveryItem.newbdq);
						}
						deliveryItem!.dlQty = deliveryItem!.newbdq;

						deliveryItem.pstCode = $(v).data("pocode") as string;
						deliveryItem.dlCode = $(v).attr("id") as string;
						deliveryItem.dlBatch = $(v).data("batch") as string;
						deliveryItem.JsVt = $(v).data("batvt").toString().trim();
						deliveryItem.itmCode = selectedItemCode.toString();
						deliveryItem.batseq = $(v).data("batseq") as number;
						deliveryItem.dlBatId = Number($(v).data("batid"));

						lnqty += deliveryItem!.newbdq;
						getItemInfo4BatSnVtIv();

						//console.log(deliveryItem);
						let idx = -1;
						$.each(DeliveryItems, function (index, ele: IDeliveryItem) {
							if (ele.dlCode == deliveryItem!.dlCode && ele.seq == seq) {
								idx = index;
								ele = structuredClone(deliveryItem) as IDeliveryItem; //update current deliveryitem
								return false;
							}
						});

						if (deliveryItem.dlQty <= 0) {
							DeliveryItems.splice(idx, 1);
						}

						//add
						if (idx < 0) DeliveryItems.push(deliveryItem);
					}
				});
		} else {
			//console.log("here");
			$(e)
				.find("td")
				.eq(1)
				.find(".chkbatsnvt")
				.each(function (k, v) {
					$target = $(v);
					let sn: string = $target.val() as string;
					let batId: string = $target.attr("id") as string;
					let batcode: string = $target.data("batcode") as string;
					let vt: string = $target.data("snvt").toString().trim();
					let pocode: string = $target.data("pocode") as string;

					if ($target.is(":checked")) {
						//if (Number($target.data("seq")) == seq) lnqty++;
						//lnqty++;
						//console.log("lnqty#checked", lnqty);
						let idx = -1;
						$.each(DeliveryItems, function (index, ele) {
							if (ele.dlCode == batId) {
								idx = index;
								return false;
							}
						});
						if (idx < 0) {
							deliveryItem = initDeliveryItem();
							deliveryItem.ivIdList = ividlist.join();
							deliveryItem.pstCode = pocode;
							deliveryItem.dlCode = batId;
							deliveryItem.dlBatch = batcode;
							deliveryItem.JsVt = vt;
							deliveryItem.itmCode = selectedItemCode.toString();
							deliveryItem.snoCode = sn;
							deliveryItem.dlHasSN = true;
							deliveryItem.dlQty = 1;
							deliveryItem.seq = seq;

							getItemInfo4BatSnVtIv(sn);

							DeliveryItems.push(deliveryItem);
						}
					} else {
						//lnqty--;
						//console.log("lnqty#unchecked", lnqty);
						let idx = -1;
						$.each(DeliveryItems, function (index, ele) {
							if (ele.dlCode == batId) {
								idx = index;
								return false;
							}
						});
						if (idx >= 0) {
							DeliveryItems.splice(idx, 1);
						}
					}
				});
		}
	});

	DeliveryItems.forEach((x) => {
		if (x.dlHasSN && x.seq == seq) lnqty++;
	});

	let $qty = $(`#${gTblName} tbody tr`)
		.eq(currentY)
		.find("td")
		.eq(5)
		.find(".delqty");

	// console.log("del qty:" + Number($qty.val()) + ";lnqty:" + lnqty);
	if (lnqty > Number($qty.val())) {
		// console.log("here");
		$.fancyConfirm({
			title: "",
			message: newqtygtoriginalqtyindeliveryconfirmtxt,
			shownobtn: true,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					//$qty.val(lnqty).trigger("change");
					$qty.val(lnqty);

					setBatchMark();
					closeBatchModal();
					if (itemOptions && itemOptions.ChkSN) setSNmark(false);
					if (itemOptions && itemOptions.WillExpire) setExpiryDateMark();
					const price = getRowPrice();
					console.log("price:" + price);
					updateRow(price, getRowDiscPc());
				} else {
					lnqty = 0;
					$("#totalbatdelqty").data("totalbatdelqty", lnqty).val(lnqty);
					$(".batdelqty").val(0).addClass("focus");

					$("#tblBatch tbody tr").each(function (i, e) {
						if (itemOptions && !itemOptions.ChkSN) {
							$(e)
								.find("td")
								.eq(1)
								.find(".batdelqty")
								.each(function (k, v) {
									let dlCode = $(v).attr("id") as string;
									let idx = -1;
									$.each(DeliveryItems, function (index, ele: IDeliveryItem) {
										if (ele.dlCode == dlCode) {
											idx = index;
											return false;
										}
									});
									if (idx >= 0) DeliveryItems.splice(idx, 1);
								});
						} else {
							$(e)
								.find("td")
								.eq(1)
								.find(".chkbatsnvt")
								.each(function (k, v) {
									$target = $(v);
									$target.prop("checked", false);
									let sn: string = $target.val() as string;
									let batId: string = $target.attr("id") as string;
									let batcode: string = $target.data("batcode") as string;

									//todo: snvtlist
									//snvtlist =
									//    DicItemSeqBatSnVt[itemseq][
									//        batcode
									//    ].slice(0);
									let idx = -1;
									$.each(snvtlist, function (index, ele) {
										if (ele.sn == sn) {
											idx = index;
											return false;
										}
									});
									if (idx >= 0) {
										snvtlist.splice(idx, 1);
									}

									idx = -1;
									$.each(DeliveryItems, function (index, ele) {
										if (ele.dlCode == batId) {
											idx = index;
											return false;
										}
									});
									if (idx >= 0) {
										DeliveryItems.splice(idx, 1);
									}

									//todo: snvtlist slice
									//DicItemSeqBatSnVt[itemseq][batcode] =
									//    snvtlist.slice(0);

									$target
										.parent("div")
										.addClass("custom-control custom-checkbox");
									$target.addClass("custom-control-input");
									$target.siblings("label").addClass("custom-control-label");
								});
						}
					});
				}
			},
		});
	} else {
		closeBatchModal();
		if (lnqty > 0) {
			//$qty.val(lnqty).trigger("change");
			if ($qty.val() == "" || $qty.val() == 0) $qty.val(lnqty);
			setBatchMark();
			if (itemOptions!.ChkSN) setSNmark(false);
			if (itemOptions!.WillExpire) setExpiryDateMark();

			if (
				!$.isEmptyObject(DicIvInfo) &&
				selectedItemCode in DicIvInfo &&
				DicIvInfo[selectedItemCode].length > 0
			) {
				setIvMark();
			}
		}
	}
}

function getItemInfo4BatSnVtIv(sn: string | null = null) {
	$tr = $(`#${gTblName} tbody tr`).eq(currentY);
	let idx: number = 2;
	deliveryItem!.itmNameDesc = $tr
		.find("td")
		.eq(idx)
		.find(".itemdesc")
		.val() as string;
	idx++;
	deliveryItem!.dlBaseUnit = $tr
		.find("td")
		.eq(idx)
		.find(".sellunit")
		.val() as string;

	idx = forwholesales ? 10 : 9;
	deliveryItem!.dlUnitPrice = Number(
		$tr.find("td").eq(idx).find(".price").data("price")
	);
	//console.log("dlunitprice:" + deliveryItem!.dlUnitPrice);

	idx++;
	deliveryItem!.dlDiscPc = Number(
		$tr.find("td").eq(idx).find(".discpc").data("discpc")
	);

	if (enableTax && !inclusivetax) {
		idx++;
		deliveryItem!.dlTaxPc = Number(
			$tr.find("td").eq(idx).find(".taxpc").data("taxpc")
		);
	}
	idx++;
	deliveryItem!.dlStockLoc = $tr
		.find("td")
		.eq(idx)
		.find(".location")
		.val() as string;
	idx++;
	deliveryItem!.JobID = Number($tr.find("td").eq(idx).find(".job").val());
}

let snvtlist: ISnVt[] = [];

function toggleBatQty() {
	if (itemOptions && itemOptions.ChkBatch && itemOptions.ChkSN) {
		$("#tblPbatch thead tr th").eq(3).hide();
	}
	if (itemOptions && itemOptions.ChkBatch && !itemOptions.ChkSN) {
		$("#tblPbatch thead tr th").eq(3).show();
	}
}

function toggleBatSn() {
	if (!itemOptions) return false;
	if (itemOptions!.ChkBatch) {
		if (itemOptions!.ChkSN) {
			$("#tblBatch thead th:eq(1)").show();
			$("#tblBatch thead th:eq(2)").hide();
		} else {
			$("#tblBatch thead th:eq(1)").hide();
			$("#tblBatch thead th:eq(2)").show();
		}
	} else {
		if (itemOptions!.ChkSN) {
			$("#tblBatch thead th:eq(1)").show();
		} else {
			$("#tblBatch thead th:eq(1)").hide();
		}
	}
}
function fillInPurchase(
	currentStatus: string = "",
): IPurchase {
	$purchaseDateDisplay = $("#purchaseDate");
	$promisedDateDisplay = $("#promisedDate");

	//console.log("Purchase.JsPurchaseDate:" + $purchaseDateDisplay.val() + ";Purchase.JsPromisedDate:" + $promisedDateDisplay.val());

	const exrate =
		$("#pstExRate").val() == null ? 1 : Number($("#pstExRate").val());
	//console.log("exrate#fillinpurchase:" + exrate);
	displayExRate(exrate);
	// console.log("purchasedate:", $purchaseDateDisplay.val());
	// console.log("promiseddate:", $promisedDateDisplay.val());
	batchidx = 5;
	snidx = batchidx + 1;
	vtidx = snidx + 1;
	return {
		Id: Number($("#Id").val()),
		pstCode: <string>$("#pstCode").val(),
		supCode: <string>$("#drpSupplier").val(),
		pstSupplierInvoice: <string>$("#pstSupplierInvoice").val(),
		pstSalesLoc: <string>$("#drpLocation").val(),
		pstAllLoc: $("#chkAllLoc").is(":checked"),
		pstRemark: <string>$("#pstRemark").val(),
		PurchaseItems: [],
		ReturnItems: [],
		PSCodeDisplay: "",
		pstPurchaseDate: new Date(),
		PurchaseDateDisplay: <string>$("#PurchaseDateDisplay").val(),
		JsPurchaseDate: <string>$purchaseDateDisplay.val(),
		pstStatus:
			currentStatus === ""
				? (<string>$("#pstStatus").val()).toLowerCase()
				: currentStatus,
		pstCurrency: <string>$("#pstCurrency").val(),
		pstExRate: exrate,
		pstPromisedDate: null,
		PromisedDateDisplay: <string>$("#PromisedDateDisplay").val(),
		JsPromisedDate: <string>$promisedDateDisplay.val(),

		FileList: [],
		pstAmount: Number($("#pstAmount").val()),
		pstPartialAmt: Number($("#pstPartialAmt").val())
	};
}

let dicItemVtQty: { [Key: string]: Array<IVtQty> } = {};

//let DicItemSeqBatSnVt: {
//    [Key: string]: { [Key: string]: Array<ISnVt> };
//} = {};
let DicItemSnVtList: { [Key: string]: Array<ISnVt> } = {};

let DicSeqDeliveryItems: { [Key: number]: IDeliveryItem[] } = {};

let forproview: boolean = false;

const populateSelectedItem = () => {
	selectedItem!.itmIsActive = $("#isActive").is(":checked");
	selectedItem!.itmItemID = Number($("#itmItemID").val());
	selectedItem!.itmCode = $("#itmCode").val() as string;
	//console.log("itmCode.val:", $("#itmCode").val());
	//console.log("selectedItem.itmcode:" + selectedItem!.itmCode);
	selectedItem!.itmSupCode = $("#itmSupCode").val() as string;
	selectedItem!.itmName = $("#itmName").val() as string;
	selectedItem!.itmDesc = $("#itmDesc").val() as string;
	selectedItem!.itmUseDesc = $("#replacing").is(":checked");
	selectedItem!.itmBaseSellingPrice = Number($("#BaseSellingPrice").val());
	selectedItem!.itmBuyStdCost = Number($("#BuyStdCost").val());
	selectedItem!.chkSN = $("#chkSN").is(":checked");
	selectedItem!.chkVT = $("#chkExpiry").is(":checked");
	selectedItem!.chkBat = $("#chkBatch").is(":checked");
	selectedItem!.itmLength = Number($("#itmLength").val());
	selectedItem!.itmWidth = Number($("#itmWidth").val());
	selectedItem!.itmHeight = Number($("#itmHeight").val());
	selectedItem!.itmBuyUnit = $("#txtBuyUnit").val() as string;
	selectedItem!.itmSellUnit = $("#txtSellUnit").val() as string;
	selectedItem!.itmSellUnitQuantity = Number(
		$("#txtItmSellUnitQuantity").val()
	);

	selectedItem!.PLA = Number($("#PLA").val());
	selectedItem!.PLB = Number($("#PLB").val());
	selectedItem!.PLC = Number($("#PLC").val());
	selectedItem!.PLD = Number($("#PLD").val());
	selectedItem!.PLE = Number($("#PLE").val());
	selectedItem!.PLF = Number($("#PLF").val());
	selectedItem!.IncomeAccountID = $("#IncomeAccountID").length
		? Number($("#IncomeAccountID").data("id"))
		: 0;
	selectedItem!.InventoryAccountID = $("#InventoryAccountID").length
		? Number($("#InventoryAccountID").data("id"))
		: 0;
	selectedItem!.ExpenseAccountID = $("#ExpenseAccountID").length
		? Number($("#ExpenseAccountID").data("id"))
		: 0;
	selectedItem!.itmIsBought = $("#buy").length
		? $("#buy").is(":checked")
		: false;
	selectedItem!.itmIsSold = $("#sell").length
		? $("#sell").is(":checked")
		: false;
	selectedItem!.itmIsNonStock = $("#inventory").length
		? !$("#inventory").is(":checked")
		: false;

	$tr = $("#locationblk table tbody tr").first();
	$tr.find("td").each(function (i, e) {
		let $stqty = $(e).find(".stqty");
		let location: string = $stqty.data("location") as string;
		selectedItem!.DicLocQty[location] = Number($stqty.val());
	});

	selectedItem!.itmWeight = Number($("#itmWeight").val());
	selectedItem!.itmWidth = Number($("#itmWidth").val());
	selectedItem!.itmHeight = Number($("#itmHeight").val());
	selectedItem!.itmLength = Number($("#itmLength").val());

	//ItemVari does not include category
	selectedItem!.catId = Number($("#drpCategory").val());
	if (ItemVariations.length === 0)
		selectedItem!.AttrList =
			ItemAttrList.length > 0 ? ItemAttrList.slice(0) : [];

	if ($(".drpItemAttr").length) {
		let itemcode = $("#itmCode").val() as string;
		$(".drpItemAttr").each(function (i, e) {
			let attr: IItemAttribute = initItemAttr(itemcode);
			attr.Id = Number($(e).attr("id"));
			attr.iaName = $(e).data("name");
			attr.iaValue = $(e).val() as string;
			attr.iaUsed4Variation = true;
			attr.iaShowOnSalesPage = $(e).data("show") == "True";
			selectedItem!.SelectedAttrList4V.push(attr);
		});
	}
};

const populateItemVari = () => {
	//ItemVari does not include category
	ItemVari!.itmIsActive = $("#isActive").is(":checked");
	ItemVari!.itmItemID = Number($("#itmItemID").val());
	ItemVari!.itmCode = $("#itmCode").val() as string;
	ItemVari!.itmSupCode = $("#itmSupCode").val() as string;
	ItemVari!.itmName = $("#itmName").val() as string;
	ItemVari!.itmDesc = $("#itmDesc").val() as string;
	ItemVari!.itmUseDesc = $("#replacing").is(":checked");
	ItemVari!.itmBaseSellingPrice = Number($("#BaseSellingPrice").val());
	ItemVari!.itmBuyStdCost = Number($("#BuyStdCost").val());
	ItemVari!.chkSN = $("#chkSN").is(":checked");
	ItemVari!.chkVT = $("#chkExpiry").is(":checked");
	ItemVari!.chkBat = $("#chkBatch").is(":checked");
	ItemVari!.itmLength = Number($("#itmLength").val());
	ItemVari!.itmWidth = Number($("#itmWidth").val());
	ItemVari!.itmHeight = Number($("#itmHeight").val());
	ItemVari!.itmBuyUnit = $("#txtBuyUnit").val() as string;
	ItemVari!.itmSellUnit = $("#txtSellUnit").val() as string;
	ItemVari!.itmSellUnitQuantity = Number($("#txtItmSellUnitQuantity").val());

	ItemVari!.PLA = Number($("#PLA").val());
	ItemVari!.PLB = Number($("#PLB").val());
	ItemVari!.PLC = Number($("#PLC").val());
	ItemVari!.PLD = Number($("#PLD").val());
	ItemVari!.PLE = Number($("#PLE").val());
	ItemVari!.PLF = Number($("#PLF").val());
	ItemVari!.IncomeAccountID = $("#IncomeAccountID").length
		? Number($("#IncomeAccountID").data("id"))
		: 0;
	ItemVari!.InventoryAccountID = $("#InventoryAccountID").length
		? Number($("#InventoryAccountID").data("id"))
		: 0;
	ItemVari!.ExpenseAccountID = $("#ExpenseAccountID").length
		? Number($("#ExpenseAccountID").data("id"))
		: 0;
	ItemVari!.itmIsBought = $("#buy").length ? $("#buy").is(":checked") : false;
	ItemVari!.itmIsSold = $("#sell").length ? $("#sell").is(":checked") : false;
	ItemVari!.itmIsNonStock = $("#inventory").length
		? !$("#inventory").is(":checked")
		: false;

	$tr = $("#locationblk table tbody tr").first();
	$tr.find("td").each(function (i, e) {
		let $stqty = $(e).find(".stqty");
		let location: string = $stqty.data("location") as string;
		ItemVari!.DicLocQty[location] = Number($stqty.val());
	});

	ItemVari!.itmWeight = Number($("#itmWeight").val());
	ItemVari!.itmWidth = Number($("#itmWidth").val());
	ItemVari!.itmHeight = Number($("#itmHeight").val());
	ItemVari!.itmLength = Number($("#itmLength").val());

	if ($(".drpItemAttr").length) {
		let itemcode = $("#itmCode").val() as string;
		$(".drpItemAttr").each(function (i, e) {
			let attr: IItemAttribute = initItemAttr(itemcode);
			attr.Id = Number($(e).attr("id"));
			attr.iaName = $(e).data("name");
			attr.iaValue = $(e).val() as string;
			attr.iaUsed4Variation = true;
			attr.iaShowOnSalesPage = $(e).data("show") == "True";
			ItemVari!.SelectedAttrList4V.push(attr);
		});
	}
};

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
			if (selectedItem!.itmDesc=="") {
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

	submitform() {
		let url = !EditItem && ItemVariations.length > 0
				? "/Item/EditIV"
				: "/Item/Edit";
		let data = {};

		let returnurl = `/Item/${$infoblk.data("referrer")}`;
		if (ItemVari) {
			
			//console.log('ItemVari:', ItemVari);
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
		//console.log("data:", data);
		//console.log("url:" + url);
		// console.log(this.forPGItem);
		// console.log(returnurl);
		//return false;
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

function getStockQtyAvailable4ItemVari() {
	let totalbasestockqty = Number($infoblk.data("totalbasestockqty"));
	let stockqtyavailable =
		totalbasestockqty - DicIVLocQty[ItemVari!.Id.toString()];
	console.log("stockqtyavailable:" + stockqtyavailable);
	let totallocqty = 0;
	for (const [key, value] of Object.entries(ItemVari!.DicLocQty)) {
		totallocqty += value;
	}
	console.log("totallocqty:" + totallocqty);
	return { stockqtyavailable, totallocqty };
}

function getStockQtyAvailable4Item() {
	let totallocqty = 0;
	// console.log("selectedItem diclocqty:", selectedItem!.DicLocQty);
	for (const [key, value] of Object.entries(selectedItem!.DicLocQty)) {
		totallocqty += value;
	}
	//console.log(
	//  "selectedItem.TotalBaseStockQty:" + selectedItem!.TotalBaseStockQty
	//);
	// console.log("totallocqty:" + totallocqty);
	let totalIvLocQty = 0;
	if (DicIVLocQty) {
		for (const [key, value] of Object.entries(DicIVLocQty)) {
			totalIvLocQty += value;
		}
	}

	// console.log("totalIvLocQty:" + totalIvLocQty);
	let stockqtyavailable = selectedItem!.TotalBaseStockQty - totalIvLocQty;
	return { stockqtyavailable, totallocqty };
}

function searchAccount() {
	keyword = keyword.toLowerCase();
	filteredAccountList = [];
	$.each(accountList, function (i, e) {
		if (
			e.AccountClassificationID.toLowerCase().indexOf(keyword) >= 0 ||
			e.AccountName.toLowerCase().indexOf(keyword) >= 0 ||
			e.AccountNumber.toLowerCase().indexOf(keyword) >= 0 ||
			e.ACDescription.toLowerCase().indexOf(keyword) >= 0
		) {
			filteredAccountList.push(e);
		}
	});
	if (filteredAccountList.length > 0) {
		changeAccountPage(1);
	} else {
		$.fancyConfirm({
			title: "",
			message: nodatafoundtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$("#txtKeyword").val("").trigger("focus");
				}
			},
		});
	}
}
function copyItemAccount() {
	itemAcId = copiedItem.IncomeAccountID;
	$("#IncomeAccountID").data("Id", itemAcId);
	itemaccountmode = ItemAccountMode.Sell;
	selectItemAccount();
	itemAcId = copiedItem.ExpenseAccountID;
	$("#ExpenseAccountID").data("Id", itemAcId);
	itemaccountmode = ItemAccountMode.Buy;
	selectItemAccount();
	itemAcId = copiedItem.InventoryAccountID;
	$("#InventoryAccountID").data("Id", itemAcId);
	itemaccountmode = ItemAccountMode.Inventory;
	selectItemAccount();
	if (selectedItem) {
		selectedItem!.IncomeAccountID = copiedItem.IncomeAccountID;
		selectedItem!.ExpenseAccountID = copiedItem.ExpenseAccountID;
		selectedItem!.InventoryAccountID = copiedItem.InventoryAccountID;
		selectedItem!.itmIsBought = selectedItem!.ExpenseAccountID === 0;
		selectedItem!.itmIsSold = selectedItem!.IncomeAccountID === 0;
		selectedItem!.itmIsNonStock = selectedItem!.InventoryAccountID === 0;
	}
	selectedItemCode = "";
}

$(document).on("click", ".itemaccount", function () {
	$(this).trigger("change");
});
$(document).on("change", ".itemaccount", function () {
	AcClfID = <string>$(this).val();
	itemaccountmode = getItemAccountMode($(this).data("itemaccountmode"));
	//console.log('itemaccountmodel:' + itemaccountmode);
	if (AcClfID !== "") {
		//console.log('itemaccountmodel:', itemaccountmode);
		accountList = DicAcAccounts[AcClfID];
		//console.log('aclist:', accountList);
		changeAccountPage(1);
	}
});

$(document).on("change", ".radaccount", function () {
	closeAccountModal();
	//console.log("here");
	if (forjournal)
		populateAccount4Journal($(this).data("acno"), $(this).data("acname"));
	if (forpurchase)
		populateAccount4Purchase($(this).data("acno"), $(this).data("acname"));
	else {
		itemAcId = $(this).data('acid');
		//console.log("itemAcId:", itemAcId);
		selectItemAccount();
	}
});
function changeAccountPage(page) {
	let _list: Array<IAccount> = [];
	if (filteredAccountList.length > 0) {
		_list = filteredAccountList.slice(0);
	} else {
		_list = accountList.slice(0);
	}

	var page_span = <HTMLElement>document.getElementById("page");

	// Validate page
	if (page < 1) page = 1;
	if (page > numAccountPages()) page = numAccountPages();

	var output = "";
	let currentstartpage = (page - 1) * records_per_page;
	let currentendpage = page * records_per_page;

	for (var i = currentstartpage; i < currentendpage; i++) {
		var e = _list[i];
		if (typeof e !== "undefined")
			output += `<tr><td>${e.AccountNumber}</td><td>${e.AccountName}</td><td>${e.ACDescription}</td><td><input type="radio" class="radaccount" data-acid="${e.AccountID}" data-acno="${e.AccountNumber}" data-acdesc="${e.ACDescription}" data-acname="${e.AccountName}"></td></tr>`;
	}

	accountModal
		.find(".container")
		.find("#tblAccount tbody")
		.empty()
		.html(output);

	if (_list.length > records_per_page) {
		//<div class="Pager"><span id="recordtxt" class="font-weight-bold">項目 <span id="recordrange">1 - 10</span> 共 <span id="recordcount">15</span></span><span>1</span><a style="cursor:pointer" class="page" page="2">2</a><a style="cursor:pointer" class="page" page="2">&gt;</a><a style="cursor:pointer" class="page" page="2">&gt;&gt;</a></div>
		let html = `<div class="Pager"><span Id="recordtxt" class="font-weight-bold">${itemtxt} <span Id="recordrange">${currentstartpage + 1
			} - ${currentendpage}</span> ${pagetotaltxt} <span Id="recordcount">${_list.length
			}</span></span>`;
		for (var i = 0; i < numAccountPages(); i++) {
			if (i === page - 1) {
				html += `<span>${i + 1}</span>`;
			} else {
				html += `<a style="cursor:pointer" class="iapage" data-page="${i + 1
					}">${i + 1}</a>`;
			}
		}
		html += "</div>";
		page_span.innerHTML = html;
	} else {
		page_span.innerHTML = "";
	}

	openAccountModal();
}

$(document).on("change", ".chkitemac", function () {
	let ischecked = $(this).is(":checked");

	if (!NonABSS && !ischecked && $(this).attr("id") == "inventory") {
		$("#drpInventory").prop("selectedIndex", 0);
		$(".accountno").eq(2).val("");
		selectedItem!.InventoryAccountID = 0;
	}

	itemaccountmode = getItemAccountMode(<string>$(this).attr("id"));

	if (itemaccountmode === ItemAccountMode.Buy) {
		selectedItem!.itmIsBought = ischecked;
		if (selectedItem!.itmIsBought) {
			$("#drpCOS").val("COS").trigger("focus");
			$(".accountno").eq(0).val("5-4500");
			selectedItem!.InventoryAccountID = 74;
		}
	}
	if (itemaccountmode === ItemAccountMode.Sell) {
		selectedItem!.itmIsSold = ischecked;
		if (selectedItem!.itmIsSold) {
			$("#drpIncome").val("I").trigger("focus");
			$(".accountno").eq(1).val("4-8000");
			selectedItem!.InventoryAccountID = 116;
		}
	}
	if (itemaccountmode === ItemAccountMode.Inventory) {
		selectedItem!.itmIsNonStock = ischecked;
		if (selectedItem!.itmIsNonStock) {
			$("#drpInventory").val("A").trigger("focus");
			$(".accountno").eq(2).val("1-2400");
			selectedItem!.InventoryAccountID = 117;

			$("#stqty").val(1).prop("disabled", false);
		} else {
			$("#stqty").val(0).prop("disabled", true);
		}
	}
	if (!ischecked) {
		resetAccountRow(true);
	}
});

function getAccountClassificationID() {
	$.each(accountList, function (i, e) {
		if (e.AccountID === itemAcId) {
			AcClfID = e.AccountClassificationID;
			return false;
		}
	});
}
function getAccountList() {
	for (const [key, value] of Object.entries(DicAcAccounts)) {
		$.each(value, function (i, e) {
			if (e.AccountID === itemAcId) {
				accountList = value.slice(0);
				return false;
			}
		});
	}
}
function getItemAccountNumber() {
	$.each(accountList, function (i, e) {
		if (e.AccountID === itemAcId) {
			ItemAccountNumber = e.AccountNumber;
			return false;
		}
	});
}
function fillAccountNumber(_itemaccountmode: string) {
	$(".accountno").each(function (i, e) {
		if (
			<string>$(e).data("itemaccountmode").toLowerCase() === _itemaccountmode
		) {
			$(this).val(ItemAccountNumber);
			$(this).data("Id", itemAcId);
			return false;
		}
	});
}

function selectItemAccount() {
	//console.log('acid:' + itemAcId);
	getAccountList();
	//console.log('accountlist:', accountList);
	let _selected = itemAcId > 0;
	if (itemaccountmode === ItemAccountMode.Buy) {
		if (_selected) {
			getAccountClassificationID();
			getItemAccountNumber();
			fillAccountNumber("buy");
		}
		$("#drpCOS").val(AcClfID);
		$("#buy").prop("checked", _selected);
	}
	if (itemaccountmode === ItemAccountMode.Sell) {
		if (_selected) {
			getAccountClassificationID();
			getItemAccountNumber();
			fillAccountNumber("sell");
		}
		$("#drpIncome").val(AcClfID);
		$("#sell").prop("checked", _selected);
	}
	if (itemaccountmode === ItemAccountMode.Inventory) {
		selectedItem!.InventoryAccountID = itemAcId;
		if (_selected) {
			getAccountClassificationID();
			getItemAccountNumber();
			fillAccountNumber("inventory");
		}
		$("#drpInventory").val(AcClfID);
		$("#inventory").prop("checked", _selected);
	}
}

function resetAccountRow(all: boolean = false) {
	closeAccountModal();
	filteredAccountList = [];
	if (itemaccountmode === ItemAccountMode.Buy) {
		$("#drpCOS").val("");
		if (all) {
			$(".accountno").each(function (i, e) {
				if ($(e).data("itemaccountmode") === "Buy") {
					$(e).val("");
				}
			});
		}
	}
	if (itemaccountmode === ItemAccountMode.Sell) {
		$("#drpIncome").val("");
		if (all) {
			$(".accountno").each(function (i, e) {
				if ($(e).data("itemaccountmode") === "Sell") {
					$(e).val("");
				}
			});
		}
	}
	if (itemaccountmode === ItemAccountMode.Inventory) {
		$("#drpInventory").val("");
		if (all) {
			$(".accountno").each(function (i, e) {
				if ($(e).data("itemaccountmode") === "Inventory") {
					$(e).val("");
				}
			});
		}
	}
}

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

$(document).on("click", "#btnSearchCustomer", function () {
	keyword = (<string>$("#txtCustomer").val()).toLowerCase();
	if (keyword !== "") {
		openWaitingModal();
		searchcusmode = true;
		GetCustomers4Sales(1);
	}
});

$(document).on("click", "#btnSearchItem", function () {
	keyword = (<string>$("#txtItem").val()).toLowerCase();
	if (keyword !== "") {
		openWaitingModal();
		searchmode = true;
		GetItems(1);
	}
});

let DicLocation: { [Key: string]: string } = {};

$(document).on("change", "#tblSales .location", function () {
	console.log("location:" + $(this).val());
});
function initSales(): ISales {
	//NextSalesInvoice
	let salescode = $(".NextSalesInvoice").first().val() as string;
	//console.log("salescode#initsales:" + salescode);
	return {
		authcode: "",
		epaytype: "",
		rtsUID: 0,
		rtsSalesLoc: $("#drpLocation").val()?.toString(),
		rtsDvc: $("#drpDevice").val()?.toString(),
		rtsCode: salescode,
		rtsRefCode: "",
		rtsType: "",
		rtsStatus: "",
		rtsDate: "",
		rtsTime: "",
		rtsCusID: 0,
		rtsCusMbr: "",
		rtsLineTotal: 0,
		rtsLineTotalPlusTax: 0,
		rtsFinalDisc: 0,
		rtsFinalDiscAmt: 0,
		rtsFinalAdj: 0,
		rtsFinalTotal: 0,
		rtsRmks: "",
		rtsRmksOnDoc: "",
		rtsCarRegNo: "",
		rtsUpldBy: "",
		rtsKawadaUpldBy: "",
		rtsUpldTime: null,
		rtsUpLdLog: "",
		rtsInternalRmks: "",
		rtsMonthBase: false,
		rtsLineTaxAmt: 0,
		rtsEpay: false,
		rtsKInvoiceId: 0,
		rtsKInvoiceCode: "",
		rtsDeliveryAddressId: 0,
		rtsDeliveryAddress1: "",
		rtsDeliveryAddress2: "",
		rtsDeliveryAddress3: "",
		rtsDeliveryAddress4: "",
		rtsReviewUrl: "",
		rtsSendNotification: false,
		rtsCustomerPO: "",
		rtsDeliveryDate: null,
		rtsSaleComment: "",
		rtsCheckout: false,
		rtsCheckoutPortal: "",
		rtsParentUID: 0,
		AccountProfileId: 0,
		CompanyId: 0,
		rtsCreateBy: "",
		rtsCreateTime: "",
		rtsModifyBy: "",
		rtsModifyTime: null,
		rtsExRate: 1,
		rtsCurrency: "HKD",
		Roundings: 0,
		Change: 0,
		MonthlyPay: 0,
		Deposit: 0,
		SelectedShop: $("#drpLocation").val()?.toString(),
		SelectedDevice: $("#drpDevice").val()?.toString(),
		deliveryAddressId: 0,
		ireviewmode: 0,
		salescode: salescode,
		selectedPosSalesmanCode: null,
		CustomerPO: null,
		DeliveryDate: null,
		TotalRemainAmt: 0,
		rtsAllLoc: false,
	} as ISales;
}
function initSimpleSales(): ISales {
	let salescode = $("#salescode").text();
	return {
		authcode: "",
		epaytype: "",
		rtsUID: 0,
		rtsSalesLoc: $("#drpLocation").val()?.toString(),
		rtsDvc: $("#drpDevice").val()?.toString(),
		rtsCode: salescode,
		rtsRefCode: "",
		rtsType: "",
		rtsStatus: "",
		rtsDate: "",
		rtsTime: "",
		rtsCusID: defaultcustomer.cusCustomerID,
		rtsCusMbr: "",
		rtsLineTotal: 0,
		rtsLineTotalPlusTax: 0,
		rtsFinalDisc: 0,
		rtsFinalDiscAmt: 0,
		rtsFinalAdj: 0,
		rtsFinalTotal: 0,
		rtsRmks: "",
		rtsRmksOnDoc: "",
		rtsCarRegNo: "",
		rtsUpldBy: "",
		rtsKawadaUpldBy: "",
		rtsUpldTime: null,
		rtsUpLdLog: "",
		rtsInternalRmks: "",
		rtsMonthBase: false,
		rtsLineTaxAmt: 0,
		rtsEpay: false,
		rtsKInvoiceId: 0,
		rtsKInvoiceCode: "",
		rtsDeliveryAddressId: 0,
		rtsDeliveryAddress1: "",
		rtsDeliveryAddress2: "",
		rtsDeliveryAddress3: "",
		rtsDeliveryAddress4: "",
		rtsReviewUrl: "",
		rtsSendNotification: false,
		rtsCustomerPO: "",
		rtsDeliveryDate: null,
		rtsSaleComment: "",
		rtsCheckout: false,
		rtsCheckoutPortal: "",
		rtsParentUID: 0,
		AccountProfileId: 0,
		CompanyId: 0,
		rtsCreateBy: "",
		rtsCreateTime: "",
		rtsModifyBy: "",
		rtsModifyTime: null,
		rtsExRate: 1,
		rtsCurrency: "HKD",
		Roundings: 0,
		Change: 0,
		MonthlyPay: 0,
		Deposit: 0,
		SelectedShop: $("#drpLocation").val()?.toString(),
		SelectedDevice: $("#drpDevice").val()?.toString(),
		deliveryAddressId: 0,
		ireviewmode: 0,
		salescode: salescode,
		selectedPosSalesmanCode: null,
		CustomerPO: null,
		DeliveryDate: null,
		TotalRemainAmt: 0,
		rtsAllLoc: false,
	} as ISales;
}
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
	rtsKawadaUpldBy: string;
	rtsUpldTime: string | null;
	rtsUpLdLog: string;
	rtsInternalRmks: string;
	rtsMonthBase: boolean;
	rtsLineTaxAmt: number | null;
	rtsEpay: boolean;
	rtsKInvoiceId: number | null;
	rtsKInvoiceCode: string;
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
	AccountProfileId: number;
	CompanyId: number;
	rtsCreateBy: string;
	rtsCreateTime: string;
	rtsModifyBy: string;
	rtsModifyTime: string | null;
	rtsExRate: number | null;
	rtsCurrency: string;
	rtsAllLoc: boolean;
}

let chkBatSnVtCount: number = 0;
$(document).on("change", ".validthru.focus", function () {
	if ($(this).val() !== "") $(this).removeClass("focus");
});

function handleBatVtQtyChange(this: any, lastCellCls: string) {
	let qty: number = Number($(this).val());
	let maxqty: number = Number($(this).attr("max"));
	let tblIndex: number = Number($(this).data("tblindex"));
	let tmpId: string = $(this).data("id").toString();
	let itemcode: string = $(this).data("itemcode").toString();
	let receiver: string = $(this).data("shop").toString();
	$tr = $(this).parent("div").parent("td").parent("tr");
	let tridx: number = Number($tr.data("idx"));
	let transferredqty: number = 0;
	if (qty > 0) {
		if (qty > maxqty) {
			qty = maxqty;
			$(this).val(qty);
		}
		transferredqty = qty;
		$(".tblTransfer").each(function (i, e) {
			if (i !== tblIndex) {
				$target =
					lastCellCls === ""
						? $(e)
							.find("tbody tr")
							.eq(tridx)
							.find("td")
							.first()
							.find(".batqtytf")
						: $(e)
							.find("tbody tr")
							.eq(tridx)
							.find("td")
							.last()
							.find(lastCellCls!);
				if (i === 0) {
					//$target.val(maxqty - qty);
				} else {
					if (Number($target.val()) > 0) {
						$target.val(maxqty - qty);
						transferredqty += maxqty - qty;
					}
				}
			}
		});

		if (lastCellCls === "") {
			$(".tblTransfer")
				.first()
				.find("tbody tr")
				.eq(tridx)
				.find("td")
				.first()
				.find(".batqtytf")
				.val(maxqty - transferredqty);
		} else {
			$(".tblTransfer")
				.first()
				.find("tbody tr")
				.eq(tridx)
				.find("td")
				.last()
				.find(lastCellCls)
				.val(maxqty - transferredqty);
		}

		let idx = TransferList.findIndex((x) => x.tmpId == tmpId);
		if (idx >= 0) TransferList.splice(idx, 1);

		TransferList.push({
			tmpId: tmpId,
			itmCode: itemcode,
			stReceiver: receiver,
			stSender: $infoblk.data("primarylocation"),
			inQty: qty,
			outQty: qty,
			stCode: $infoblk.data("stcode"),
		} as IStockTransfer);
		// console.log("TransferList#change:", TransferList);
	}

	if (qty === 0) {
		if (lastCellCls === "") {
			$(".tblTransfer").each(function (i, e) {
				if (i > 0) {
					transferredqty += Number(
						$(e)
							.find("tbody tr")
							.eq(tridx)
							.find("td")
							.first()
							.find(".batqtytf")
							.val()
					);
				}
			});
			$(".tblTransfer")
				.first()
				.find("tbody tr")
				.eq(tridx)
				.find("td")
				.first()
				.find(".batqtytf")
				.val(maxqty - transferredqty);
		} else {
			$(".tblTransfer").each(function (i, e) {
				if (i > 0) {
					transferredqty += Number(
						$(e)
							.find("tbody tr")
							.eq(tridx)
							.find("td")
							.last()
							.find(lastCellCls)
							.val()
					);
				}
			});
			$(".tblTransfer")
				.first()
				.find("tbody tr")
				.eq(tridx)
				.find("td")
				.last()
				.find(lastCellCls)
				.val(maxqty - transferredqty);
		}
	}
}

function handleIvQtyChange(this: any, lastCellCls: string) {
	let qty: number = Number($(this).val());
	let maxqty: number = Number($(this).attr("max"));
	let tblIndex: number = Number($(this).data("tblindex"));
	let poIvId: string = $(this).data("poivid").toString();
	let itemcode: string = $(this).data("itemcode").toString();
	let receiver: string = $(this).data("shop").toString();
	let ivIdList: string = $(this).data("ividlist").toString();
	$tr = $(this).parent("div").parent("td").parent("tr");
	let tridx: number = Number($tr.data("idx"));
	let transferredqty: number = 0;

	if (qty > 0) {
		if (qty > maxqty) {
			qty = maxqty;
			$(this).val(qty);
		}
		transferredqty = qty;
		//console.log("qty:" + qty + ";tridx:" + tridx);
		$(".tblTransfer").each(function (i, e) {
			if (i !== tblIndex) {
				$target = $(e)
					.find("tbody tr")
					.eq(tridx)
					.find("td")
					.last()
					.find(lastCellCls!);
				if (i === 0) {
					// $target.val(maxqty - qty);
				} else {
					if (Number($target.val()) > 0) {
						$target.val(maxqty - qty);
						transferredqty += maxqty - qty;
					}
				}
			}
		});

		$(".tblTransfer")
			.first()
			.find("tbody tr")
			.eq(tridx)
			.find("td")
			.last()
			.find(lastCellCls)
			.val(maxqty - transferredqty);

		let idx = TransferList.findIndex((x) => x.poIvId == poIvId);
		if (idx >= 0) TransferList.splice(idx, 1);

		TransferList.push({
			poIvId: poIvId,
			itmCode: itemcode,
			stReceiver: receiver,
			stSender: $infoblk.data("primarylocation"),
			inQty: qty,
			outQty: qty,
			stCode: $infoblk.data("stcode"),
			ivIdList: ivIdList,
		} as IStockTransfer);
		// console.log("TransferList#change:", TransferList);
	}

	if (qty === 0) {
		$(".tblTransfer").each(function (i, e) {
			if (i > 0) {
				transferredqty += Number(
					$(e)
						.find("tbody tr")
						.eq(tridx)
						.find("td")
						.last()
						.find(lastCellCls)
						.val()
				);
			}
		});
		$(".tblTransfer")
			.first()
			.find("tbody tr")
			.eq(tridx)
			.find("td")
			.last()
			.find(lastCellCls)
			.val(maxqty - transferredqty);
	}
}

$(document).on("change", "#drpShop", function () {
	Sales.SelectedShop = $(this).val() as string;
});
$(document).on("change", "#drpDevice", function () {
	Sales.SelectedDevice = $(this).val() as string;
});

$(document).on("change", "#drpDeliveryAddr", function () {
	Sales.deliveryAddressId = <number>$(this).val();
});

$(document).on("change", "#deposit", function () {
	if ($(this).is(":checked")) {
		Sales.Deposit = 1;
	} else {
		Sales.Deposit = 0;
	}
});
$(document).on("click", "#deposit", function () {
	$.fancyConfirm({
		title: confirmsubmit,
		message: confirmdeposittxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				Sales.Deposit = 1;
				confirmPay();
			} else {
				Sales.Deposit = 0;
			}
		},
	});
});
$(document).on("click", "#monthlypay", function () {
	$.fancyConfirm({
		title: confirmsubmit,
		message: confirmmonthlypay,
		shownobtn: true,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				Sales.MonthlyPay = 1;
				submitSimpleSales();
			} else {
				Sales.MonthlyPay = 0;

			}
		},
	});
});
$(document).on("change", "#monthlypay", function () {
	if ($(this).is(":checked")) {
		$.fancyConfirm({
			title: confirmsubmit,
			message: confirmmonthlypay,
			shownobtn: true,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					Sales.MonthlyPay = 1;
					payModal.find(".paymenttype").prop("disabled", true);
					closePayModal();
					submitSales();
				} else {
					Sales.MonthlyPay = 0;
					$("#monthlypay").prop("checked", false);
					payModal.find(".paymenttype").prop("disabled", false);
				}
			},
		});
	} else {
		Sales.MonthlyPay = 0;
		payModal.find(".paymenttype").prop("disabled", false);
	}
});
function togglePaymentBlk(mode: string, toggleId: string, totalamt: number) {
	if (mode == "open") {
		$(`#${toggleId}`).hide();
		$("#paymentBlk").removeClass("hide");

		if (forpreorder) {
			let $deposit: JQuery = $("#deposit");
			$deposit.prop("checked", true);
		}

		setExRateDropDown();

		if (totalamt === 0)
			totalamt = getTotalAmt4Order();

		//console.log("totalamt:" + totalamt);
		setForexPayment(totalamt);

		initAmtDisplay(totalamt);

		setRemainDisplay(true);

		initCashTxt(totalamt);

		setInputs4NumberOnly("paymenttype");

		populateOrderSummary();

	} else {
		$(`#${toggleId}`).show();
		$("#paymentBlk").addClass("hide");
	}
}
function populateOrderSummary() {
	$("#receiptno").text(Sales.rtsCode);
	//console.log($("#receiptno").text());
	$("#salesdate").text(formatDate());
	$("#salestime").text(formatTime());

	let currencySym = $infoblk.data("currency");

	let subtotal: number = 0, total: number = 0, disc: number = 0;
	let html = "";

	SelectedSimpleItemList.forEach((x: ISimpleItem) => {
		let _subtotal: number = x.Qty * (x.itmBaseSellingPrice ?? 0);
		let _disc: number = _subtotal * x.discpc / 100;
		subtotal += _subtotal;
		disc += _disc;
		html += `<h3>${x.NameDesc} x ${x.Qty} <span>${currencySym}${formatnumber(_subtotal)}</span></h3>`;
	});

	$(".table__single.items").empty().html(html);

	total = subtotal - disc;

	$(".taxamt").text(currencySym + formatnumber(0));
	$(".discamt").text(currencySym + formatnumber(disc));
	$(".totalamt").text(currencySym + formatnumber(total));
}
$(document).on("change", ".batch", function () {
	currentY = getCurrentY(this);
	updateRow();
});

$(document).on("change", "#txtRoundings", function () {
	let _roundings = $(this).val();
	if (_roundings !== "") {
		//minus current roundings first:
		itotalamt -= Sales.Roundings;
		//add new roundings:
		Sales.Roundings = parseFloat(<any>$(this).val());
		itotalamt += Sales.Roundings;
	} else {
		itotalamt -= Sales.Roundings;
		$(this).val(formatnumber(0));
	}
	$("#txtTotal").val(formatnumber(itotalamt));
});

$(document).on("change", "#txtPayerCode", function () {
	authcode = <string>$(this).val();
	if (authcode !== "") {
		$(".chkpayment").prop("checked", false);
		if (authcode.indexOf("2") === 0) {
			//starts with 2
			//alipay
			$("#chkAlipay").prop("checked", true);
			$(".chkpayment").trigger("change");
			$("#Alipay").val(formatnumber(itotalamt));
		}
		if (authcode.indexOf("1") === 0) {
			//starts with 1
			//wechat
			$("#chkWechat").prop("checked", true);
			$(".chkpayment").trigger("change");
			$("#Wechat").val(formatnumber(itotalamt));
		}
		confirmPay();
	}
});

$(document).on("click", "#transactionEpay", function () {
	//for debug only:
	//selectedSalesCode = 'SA100256';
	//printurl += '?issales=1&salesrefundcode=' + selectedSalesCode;
	$.ajax({
		type: "GET",
		url: "/POSFunc/TransactionResult",
		data: { salescode: selectedSalesCode },
		success: function (data) {
			$.fancyConfirm({
				title: "",
				message: data.msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						if (data.status == 1) {
							window.open(printurl);
							window.location.reload();
						} else {
						}
					}
				},
			});
		},
		dataType: "json",
	});
});

$(document).on("click", ".btnPayment", function () {
	if (forsales) {
		if (SalesLnList.length === 0 || $(`#${gTblName} .focus`).length > 0) {
			falert(salesinfonotenough, oktxt);
		} else {
			openPayModal();
		}
	}
	if (fordeposit) {
		if (DepositLnList.length === 0) {
			falert(salesinfonotenough, oktxt);
		} else {
			openPayModel_De();
		}
	}
	if (forpreorder) {
		if (PreSales.rtsUID > 0) openPayModel_De();
		else openPayModal();
	}
});

$(document).on("change", ".itemdesc", function () {
	seq = parseInt($(this).parent("td").parent("tr").find("td:eq(0)").text());
	selectedSalesLn = $.grep(SalesLnList, function (e: ISalesLn, i) {
		return e.rtlSeq == seq;
	})[0];
	//console.log('selectedsalesitem:', selectedSalesLn);
	selectedSalesLn.Item.itmDesc = <string>$(this).val();
});

$(document).on("change", "#drpSalesman", function () {
	selectedPosSalesmanCode = <string>$(this).val();
});

$(document).on("dblclick", "#txtCustomerName", function () {
	GetCustomers4Sales(1);
});

$(document).on("change", "#txtCustomerName", function (e) {
	handleCustomerNameChange(e);
});

$(document).on("dblclick", ".cuscode", function () {
	closeCusModal();
	selectedCusCodeName = $(this).data("code");
	selectedCus = CusList.filter(
		(x) => x.cusCustomerID.toString() == selectedCusCodeName
	)[0];
	if (!selectedCus) {
		$.ajax({
			type: "GET",
			url: "/Api/GetCustomerById",
			data: { customerId: parseInt(selectedCusCodeName) },
			success: function (data: ICustomer) {
				selectedCus = data;
				selectCus();
			},
			dataType: "json",
		});
	} else {
		selectCus();
	}
});
//for transfer
$(document).on("change", ".ivqtytf", function () {
	handleIvQtyChange.call(this, ".ivqtytf");
});
//for transfer
$(document).on("change", ".vtqtytf", function () {
	handleBatVtQtyChange.call(this, ".vtqtytf");
});
//for transfer
$(document).on("change", ".batqtytf", function () {
	handleBatVtQtyChange.call(this, "");
});
//for transfer
$(document).on("change", ".batvtqtytf", function () {
	handleBatVtQtyChange.call(this, ".batvtqtytf");
});
//for transfer
$(document).on("change", ".chkbatsnvttf", function () {
	let ischecked: boolean = $(this).is(":checked");
	let receiver: string = $(this).data("shop").toString();
	//console.log("receiver:" + receiver);
	let itemcode: string = $(this).data("itemcode").toString();
	let tblIndex: number = Number($(this).data("tblindex"));
	//console.log("tblIndex:" + tblIndex);

	let sn = $(this).val()?.toString();

	if (ischecked) {
		$(".tblTransfer")
			.first()
			.find("tbody tr")
			.each(function (i, e) {
				$(e)
					.find("td")
					.eq(1)
					.find(".chkbatsnvttf")
					.each(function (k, v) {
						if ($(v).val()?.toString() == sn) {
							$(v).prop("checked", false);
						}
					});
			});

		$(".tblTransfer").each(function (idx, tbl) {
			//console.log("idx:" + idx+";tblIndex:"+tblIndex);
			if (idx !== tblIndex) {
				//console.log("idx:" + idx);
				$(tbl)
					.find("tbody tr")
					.each(function (i, e) {
						$(e)
							.find("td")
							.eq(1)
							.find(".chkbatsnvttf")
							.each(function (k, v) {
								if ($(v).val()?.toString() == sn) {
									$(v).prop("checked", false);
								}
							});
					});
			}
		});
	} else {
		$(".tblTransfer")
			.first()
			.find("tbody tr")
			.each(function (i, e) {
				$(e)
					.find("td")
					.eq(1)
					.find(".chkbatsnvttf")
					.each(function (k, v) {
						if ($(v).val()?.toString() == sn) {
							$(v).prop("checked", true);
						}
					});
			});
	}

	//console.log("TransferList#change#0:", TransferList);
	//console.log("sn:" + sn);
	let idx = TransferList.findIndex((x) => x.tmpId == sn);
	if (idx >= 0) TransferList.splice(idx, 1);

	TransferList.push({
		tmpId: sn,
		itmCode: itemcode,
		stReceiver: receiver,
		stSender: $infoblk.data("primarylocation"),
		inQty: 1,
		outQty: 1,
		stCode: $infoblk.data("stcode"),
	} as IStockTransfer);
	//console.log("TransferList#change#1:", TransferList);
});

$(document).on("keypress", ".numonly", function (e) {
	return isNumber(e);
});

$(document).on("change", ".chkbatsnvt", function () {
	let idx = forwholesales ? 5 : 4;
	let qtycls = forwholesales ? ".delqty" : ".qty";
	let todelqty: number = Number(
		$(`#${gTblName} tbody tr`)
			.eq(currentY)
			.find("td")
			.eq(idx)
			.find(qtycls)
			.val()
	);

	let ischecked: boolean = $(this).is(":checked");
	$tr = $(this).parent("div").parent("td").parent("tr");
	chkbatsnvtchange = true;

	$target = $tr.find(".currentbattypeqty");
	let currentbattypeqty: number = Number($target.text());
	currentbattypeqty = ischecked ? currentbattypeqty - 1 : currentbattypeqty + 1;
	//if (currentbattypeqty < 0) currentbattypeqty = 0;
	$target.text(currentbattypeqty);

	$target = $tr.find("td.batdelqtytxt").find(".row").find(".batdeledqty");
	let currentdelqty = Number($target.text());
	//console.log("currentdelqty#0:" + currentdelqty);

	if (ischecked) {
		chkBatSnVtCount++;
		currentdelqty++;
		//DicBatDelQty[batcode] = currentdelqty +1;
	} else {
		chkBatSnVtCount--;
		currentdelqty--;
		//DicBatDelQty[batcode] = currentdelqty - 1;
	}

	if (currentdelqty < 0) currentdelqty = 0;
	//console.log("currentdelqty#1:" + currentdelqty);
	$target.text(currentdelqty);

	$("#totalbatdelqty")
		.data("totalbatdelqty", chkBatSnVtCount)
		.val(chkBatSnVtCount);
	// chkBatSnVtCount = 0;
	//console.log("chkBatSnVtCount:" + chkBatSnVtCount);
	if (chkBatSnVtCount == todelqty) {
		$("#tblBatch tbody .chkbatsnvt").prop("disabled", true);
	}
});
$(document).on("change", ".batdelqty", function () {
	$tr = $(this).parent("div").parent("td").parent("tr");

	batdelqtychange = true;
	let newbdq = Number($(this).val());
	//console.log("newbdq#0:" + newbdq);
	const batqty = Number($(this).data("batqty"));

	if (newbdq > batqty) {
		newbdq = batqty;
		$(this).val(newbdq);
	}
	//console.log("newbdq#1:" + newbdq);
	$(this).data("currentbdq", newbdq);

	$target = $tr.find(".currentbattypeqty");
	let currentbattypeqty: number = Number($target.text());
	currentbattypeqty -= newbdq;
	//if (currentbattypeqty < 0) currentbattypeqty = 0;
	$target.text(currentbattypeqty);

	$target = $tr.find("td.batdelqtytxt").find(".row").find(".batdeledqty");
	let currentdelqty = Number($target.text());
	//console.log("currentdelqty:" + currentdelqty);
	newbdq += currentdelqty;

	//console.log("newdelqty#0:" + newdelqty);
	if (newbdq > batqty) {
		let _newdelqty = newbdq - batqty;
		//console.log("_newdelqty:" + _newdelqty);
		$(this).val(_newdelqty);
		newbdq = batqty;
	}
	//console.log("newdelqty#1:" + newdelqty);
	$target.text(newbdq);

	let totalbatdelqty: number = 0;

	$("#tblBatch tbody tr").each(function (i, e) {
		/* console.log("batdelqty:" + Number($(e).find(".batdelqty").val()));*/
		totalbatdelqty += Number($(e).find(".batdelqty").val());
	});
	$("#totalbatdelqty")
		.data("totalbatdelqty", totalbatdelqty)
		.val(totalbatdelqty);
});

$(document).on("change", ".vtdelqty", function () {
	$tr = $(this).parent("div").parent("td").parent("tr");

	vtdelqtychange = true;
	let newvdq = Number($(this).val());
	//console.log("newvdq#0:" + newvdq);
	const vtqty = Number($(this).data("vtqty"));

	if (newvdq > vtqty) {
		newvdq = vtqty;
		$(this).val(newvdq);
	}
	//console.log("newvdq#1:" + newvdq);
	$(this).data("currentvdq", newvdq);

	$target = $tr.find(".currentvttypeqty");
	let currentvttypeqty: number = Number($target.text());
	currentvttypeqty -= newvdq;
	//if (currentvttypeqty < 0) currentvttypeqty = 0;
	$target.text(currentvttypeqty);

	$target = $tr.find("td.vtdelqtytxt");
	let currentdelqty = Number($target.text());
	//console.log("currentdelqty:" + currentdelqty);
	newvdq += currentdelqty;

	//console.log("newdelqty#0:" + newdelqty);
	//if (newvdq > vtqty) {
	//    let _newdelqty = newvdq - vtqty;
	//    //console.log("_newdelqty:" + _newdelqty);
	//    $(this).val(_newdelqty);
	//    newvdq = vtqty;
	//}
	//console.log("newdelqty#1:" + newdelqty);
	$target.text(newvdq);

	let totalvtdelqty: number = 0;

	$("#tblVt tbody tr").each(function (i, e) {
		/* console.log("vtdelqty:" + Number($(e).find(".vtdelqty").val()));*/
		totalvtdelqty += Number($(e).find(".vtdelqty").val());
	});
	$("#totalvtdelqty").data("totalvtdelqty", totalvtdelqty).val(totalvtdelqty);
});

let ivdelqtychange: boolean = false;
//for those items with variations but without batch
$(document).on("change", ".ivdelqty", function () {
	let $ivdelqty = $(this);
	$tr = $ivdelqty.parent("div").parent("td").parent("tr");
	let tridx = $tr.data("idx");

	ivdelqtychange = true;
	let newivdq = Number($ivdelqty.val());
	//console.log("newvdq#0:" + newvdq);
	const ivqty = Number($ivdelqty.data("ivqty"));
	console.log("ivqty:" + ivqty);
	//console.log("newivdq#0:" + newivdq);
	if (newivdq > ivqty) {
		//console.log("here");
		newivdq = ivqty;
		//console.log("newivdq#1:" + newivdq);
		$ivdelqty.val(newivdq);
		//console.log("this val:" + $ivdelqty.val());
		$("#tblIv tbody tr").each(function (i, e) {
			if (Number($(e).data("idx")) !== tridx) {
				$(e).find("td").find(".form-control").prop("readonly", true);
			}
		});
	}
	//console.log("newivdq#1:" + newivdq);
	$ivdelqty.data("currentivdq", newivdq);

	$target = $tr.find(".currentivtypeqty");
	let currentivtypeqty: number = Number($target.text());
	currentivtypeqty -= newivdq;
	//if (currentivtypeqty < 0) currentivtypeqty = 0;
	$target.text(currentivtypeqty);

	$target = $tr.find("td.ivdelqtytxt");
	let currentdelqty = Number($target.text());
	//console.log("currentdelqty:" + currentdelqty);
	newivdq += currentdelqty;

	$target.text(newivdq);

	let totalivdelqty = 0;
	$("#tblIv tbody tr").each(function (i, e) {
		/* console.log("ivdelqty:" + Number($(e).find(".ivdelqty").val()));*/
		totalivdelqty += Number($(e).find(".ivdelqty").val());
	});

	if (totalivdelqty >= ivqty) {
		$(".ivdelqty").prop("readonly", true);
	}

	$("#totalivdelqty").data("totalivdelqty", totalivdelqty).val(totalivdelqty);
});

//for non-itemoptions items only:
$(document).on("change", ".nonitemoptions", function () {
	let val = $(this).val() as string;
	if (val !== "") {
		$tr = $(this).parent("td").parent("tr");
		let type = $(this).data("type") as string;
		let batch: string = "";
		let sn: string = "";
		let vt: string = "";
		switch (type) {
			case "bat":
				batch = val;
				sn = $tr.find("td:eq(6)").find(".serialno").val() as string;
				vt = $tr.find("td:eq(8)").find(".validthru").val() as string;
				break;
			case "sn":
				sn = val;
				getRemoteData(
					"/Api/CheckIfDuplicatedSN",
					{ sn: sn },
					checkIfDuplicatedSNOk,
					getRemoteDataFail
				);
				batch = $tr.find("td:eq(5)").find(".batch").val() as string;
				vt = $tr.find("td:eq(8)").find(".validthru").val() as string;
				break;
			case "vt":
				vt = val;
				batch = $tr.find("td:eq(5)").find(".batch").val() as string;
				sn = $tr.find("td:eq(6)").find(".serialno").val() as string;
				break;
		}

		selectedItemCode = $tr.find("td:eq(1)").find(".itemcode").val() as string;
		currentY = Number($tr.data("idx"));
		seq = currentY + 1;
		let qty: number = Number($tr.find("td:eq(4)").find(".qty").val());
		let dlcode = `${selectedItemCode}_${seq}`;

		const idx =
			DeliveryItems.length > 0
				? DeliveryItems.findIndex((item) => item.dlCode == dlcode)
				: -1;

		if (idx === -1) {
			deliveryItem = initDeliveryItem();
			deliveryItem.dlCode = dlcode;
			deliveryItem.seq = seq;
			deliveryItem.itmCode = selectedItemCode;
		} else {
			deliveryItem = DeliveryItems[idx];
		}
		deliveryItem.dlBatch = batch;
		deliveryItem.dlHasSN = sn !== "";
		deliveryItem.snoCode = sn;
		deliveryItem.JsVt = vt;
		deliveryItem!.dlQty = qty;
		getItemInfo4BatSnVtIv();
		deliveryItem.dlAmtPlusTax = deliveryItem.dlAmt = Number(
			$tr.find("td:last").find(".amount").val()
		);

		if (idx === -1) DeliveryItems.push(deliveryItem);
	}
});

function setInputs4NumberOnly(clsname: string) {
	setInputsFilter(document.getElementsByClassName(clsname)!, function (value) {
		return /^-?[\d,\/.]*$/.test(value);
	}, numberonlytxt);
}

function getTotalAmt4Order(): number {
	let totalamt = 0;
	$(`#${gTblName} tbody tr`).each(function (i, e) {
		if ($(e).find("td").eq(1).find(".itemcode").val() !== "")
			totalamt += Number($(e).find("td").last().find(".amount").val());
	});
	return totalamt / exRate;
}

//for item edit:
$(document).on("change", ".stqty", function () {
	let _qty = 0;
	$(".stqty").each(function (i, e) {
		_qty += Number($(e).val());
	});
	let shop = $(this).data("location");
	if (_qty < 0) {
		$.fancyConfirm({
			title: "",
			message: $infoblk.data("stockqtyerr"),
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(".stqty").eq(0).val(1).trigger("focus");
				}
			},
		});
	} else {
		if (selectedItem) selectedItem!.DicLocQty[shop] = Number($(this).val());
		if (ItemVari) ItemVari!.DicLocQty[shop] = Number($(this).val());
	}
});

$(document).on("change", ".form-control.mobile", function () {
	//text-decoration-underline
	$target = $(this).next(".whatsappphone");
	if ($(this).val() !== "") {
		$target.addClass("pointer text-decoration-underline");
	} else {
		$target.removeClass("pointer text-decoration-underline");
	}
});

$(document).on("click", ".whatsappphone.pointer", function (e) {
	handleWhatsappClick.call(this, e);
});

//popupCenter({url: 'http://www.xtf.dk', title: 'xtf', w: 900, h: 500});
const popupCenter = ({ url, title, w, h }) => {
	// Fixes dual-screen position                             Most browsers      Firefox
	const dualScreenLeft =
		window.screenLeft !== undefined ? window.screenLeft : window.screenX;
	const dualScreenTop =
		window.screenTop !== undefined ? window.screenTop : window.screenY;

	const width = window.innerWidth
		? window.innerWidth
		: document.documentElement.clientWidth
			? document.documentElement.clientWidth
			: screen.width;
	const height = window.innerHeight
		? window.innerHeight
		: document.documentElement.clientHeight
			? document.documentElement.clientHeight
			: screen.height;

	const systemZoom = width / window.screen.availWidth;
	const left = (width - w) / 2 / systemZoom + dualScreenLeft;
	const top = (height - h) / 2 / systemZoom + dualScreenTop;
	const newWindow = window.open(
		url,
		title,
		`
      scrollbars=yes,
      width=${w / systemZoom},
      height=${h / systemZoom},
      top=${top},
      left=${left}
      `
	);

	newWindow!.focus();
};

let CustomerFollowUpList: ICustomerFollowUp[] = [];
const initCustomerFollowUp = (): ICustomerFollowUp => {
	return {
		Id: 0,
		CustomerID: $("#CustomerId").val() as number,
		AccountProfileId: 0,
		CompanyId: 0,
		CustomerCode: "",
		Content: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: null,
		CustomerName: "",
	};
};
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

const initItemAttr = (itemcode): IItemAttribute => {
	return {
		Id: 0,
		tmpId: "",
		itmCode: itemcode,
		iaName: "",
		iaValue: "",
		iaShowOnSalesPage: true,
		iaUsed4Variation: true,
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
	};
};
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

const addItemAttrRow = () => {
	let html = `<div class="row my-2">
                <div class="col-12 col-md-4">
                    <input type="text" class="form-control attrname" placeholder="${attrnametxt}" />
                </div>
                <div class="col-12 col-md-8">
                    <input type="text" class="form-control attrval" placeholder="${attrvalstxt} (${separatedbytxt})" />
                </div>
            </div>`;
	if (itemAttrModal.find(".row").length)
		itemAttrModal.find(".row").last().after(html);
	else itemAttrModal.find(".fa").after(html);

	itemAttrModal.find(".attrname").last().trigger("focus");
};

$(document).on("click", ".fa-plus.attr", function () {
	addItemAttrRow();
});

$(document).on("click", ".fa-plus.open", function () {
	if (ItemAttrList.length === 0) {
		openItemAttrModal();
		if (
			!itemAttrModal.find(".form-control").length ||
			itemAttrModal.find(".form-control").last().val() !== ""
		)
			addItemAttrRow();
	} else {
		populateIaAccordion(true);
	}
});

const updateItemAttr = (tmpId: string, type: string, v: boolean) => {
	for (let i in ItemAttrList) {
		if (ItemAttrList[i].tmpId === tmpId) {
			if (type === "show") ItemAttrList[i].iaShowOnSalesPage = v;
			else ItemAttrList[i].iaUsed4Variation = v;
			break;
		}
	}
};

$(document).on("change", ".chkvonsales", function () {
	updateItemAttr($(this).val() as string, "show", $(this).is(":checked"));
});
$(document).on("change", ".chkused4v", function () {
	updateItemAttr($(this).val() as string, "used", $(this).is(":checked"));
});

let separatedbytxt = separatedbyformat
	? separatedbyformat.replace("{0}", " | ")
	: "";
const populateIaAccordion = (addRow: boolean) => {
	let html: any[] = [];
	html = ItemAttrList.map((c) => {
		if (!c.iaName && !c.iaValue) return false;

		const chkshow = c.iaShowOnSalesPage ? "checked" : "";
		const chkused = c.iaUsed4Variation ? "checked" : "";

		return `
            <h3>${c.iaName}<span class="small danger float-right" data-Id="${c.tmpId}" onclick="toggleAccordionState(1);removeItemAttr(this);" style="background-color:white;border-radius:3px;padding:1px;">${removetxt}</span></h3>
                <div class="row">
                    <div class="col-12 col-md-3">
                        <label>${nametxt}</label>
                        <input type="text" class="form-control attrname" placeholder="${attrnametxt}" value="${c.iaName}" />
                    </div>
                    <div class="col-12 col-md-5">
                        <label>${valuestxt}</label>
                        <input type="text" class="form-control attrval" placeholder="${attrvalstxt} (${separatedbytxt})" value="${c.iaValue}" style="max-width:none;"  />
                    </div>
                    <div class="col-12 col-md-3">
                        <div class="my-1 small">
                            <div class="form-check mb-2">
                              <input class="form-check-input my-auto chkvonsales" type="checkbox" value="${c.tmpId}" ${chkshow}>
                              <label class="form-check-label">
                                ${visibleonsalespagetxt}
                              </label>
                            </div>
                            <div class="form-check">
                              <input class="form-check-input my-auto chkused4v" type="checkbox" value="${c.tmpId}" ${chkused}>
                              <label class="form-check-label">
                                ${used4variationstxt}
                              </label>
                            </div>
                        </div>
                     </div>
                    <div class="col-12 col-md-1 small">

                    </div>
            </div>`;
	});

	if (addRow) {
		let latestId = `attr#${ItemAttrList.length}`;
		html.push(`<h3>${customattributetxt}<span class="small danger float-right" data-Id="${latestId}" onclick="toggleAccordionState(1);removeItemAttr(this);" style="background-color:white;border-radius:3px;padding:1px;">${removetxt}</span></h3>
                <div class="row">
                    <div class="col-12 col-md-3">
                        <label>${nametxt}</label>
                        <input type="text" class="form-control attrname" placeholder="${attrnametxt}" value="" />
                    </div>
                    <div class="col-12 col-md-5">
    <label>${valuestxt}</label>
                        <input type="text" class="form-control attrval" placeholder="${attrvalstxt} (${separatedbytxt})" value="" style="max-width:none;"  />
                    </div>
                    <div class="col-12 col-md-3 small">
                        <div class="my-1">
                            <div class="form-check">
                              <input class="form-check-input my-auto chkvonsales" type="checkbox" value="" checked>
                              <label class="form-check-label">
                                ${visibleonsalespagetxt}
                              </label>
                            </div>
                            <div class="form-check">
                              <input class="form-check-input my-auto chkused4v" type="checkbox" value="" checked>
                              <label class="form-check-label">
                                ${used4variationstxt}
                              </label>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-1">

                    </div>
                </div>`);
	}

	if ($("#itemAttr").find(".row").hasClass("ui-accordion-content")) {
		$("#itemAttr").empty().accordion("destroy");
	}

	$("#itemAttr").append(html);
	$("#itemAttr").accordion({
		collapsible: true,
		active: "none",
		activate: function (event, ui) {
			$(ui.newPanel).find(".form-control").first().trigger("focus");
		},
	});
};

const confirmItemAttr = () => {
	itemAttrModal.find(".row").each(function (i, e) {
		let $ianame = $(e).find("input").eq(0);
		let $iaval = $(e).find("input").eq(1);

		if ($ianame.val() !== "" && $iaval.val() !== "") {
			let tmpId = `attr#${i}`;
			let attr: IItemAttribute = {} as IItemAttribute;
			attr = {
				...attr,
				tmpId,
				itmCode: selectedItem!.itmCode,
				iaName: $ianame.val() as string,
				iaValue: $iaval.val() as string,
				iaUsed4Variation: true,
				iaShowOnSalesPage: true,
			};
			if (!itemAttrTmpIds.includes(tmpId)) {
				ItemAttrList.push(attr);
				itemAttrTmpIds.push(tmpId);
			}
		}
	});

	closeItemAttrModal();

	if (ItemAttrList.length > 0) {
		populateIaAccordion(false);
		$("#btnSaveItemAttr").removeClass("hide");
	}
};

const resetItemAttrModal = () => {
	itemAttrModal.find(".row").remove();
};

$(document).on("click", "#btnSaveItemAttr", function () {
	$target = $("#itemAttr");
	$target.find(".row").each(function (i, e) {
		let $ianame = $(e).find("input").eq(0);
		let $iaval = $(e).find("input").eq(1);
		let isshow = $(e).find(".chkvonsales").is(":checked");
		let isused = $(e).find(".chkused4v").is(":checked");
		let $h3 = $(e).prev("h3");
		let currenth3 = $h3.html();

		if ($ianame.val() !== "" && $iaval.val() !== "") {
			let newh3 = currenth3.replace(
				customattributetxt,
				$ianame.val() as string
			);
			$h3.html(newh3);
			let tmpId = `attr#${i}`;
			let attr: IItemAttribute = {} as IItemAttribute;
			attr = {
				...attr,
				tmpId,
				itmCode: selectedItem!.itmCode,
				iaName: $ianame.val() as string,
				iaValue: $iaval.val() as string,
				iaShowOnSalesPage: isshow,
				iaUsed4Variation: isused,
			};

			if (!itemAttrTmpIds.includes(tmpId)) {
				ItemAttrList.push(attr);
				itemAttrTmpIds.push(tmpId);
			}
		}
	});
	$target.accordion({ active: "none" });
});

const toggleAccordionState = (state: number) => {
	const currentactive = $("#itemAttr").find("h3").hasClass(".ui-state-active");
	if (!currentactive)
		$("#itemAttr").accordion({
			active: "none",
			disabled: state == 1 ? true : false,
		});
};

const removeItemAttr = (ele) => {
	let tmpId = $(ele).data("id") as string;
	let $ianame = $(ele)
		.parent("button")
		.parent("div")
		.prev("div")
		.prev("div")
		.prev("div")
		.find("form-control")
		.first();
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				let idx = ItemAttrList.findIndex((x) => x.tmpId === tmpId);
				if (idx >= 0) {
					ItemAttrList.splice(idx, 1);
				}
				populateIaAccordion(false);
			} else {
				$ianame.trigger("focus");
				toggleAccordionState(0);
			}
		},
	});
};

$(document).on("click", "#btnSaveItem", function () {
	let itemeditfrm: ItemEditFrm = new ItemEditFrm(editmode);
	if (itemeditfrm.validform()) {
		itemeditfrm.submitform();
	}
});

$(document).on("change", "#BaseSellingPrice", function () {
	const sellingprice: number = Number($(this).val());
	const buyingcost: string = formatnumber(sellingprice * 0.6);
	$("#BuyStdCost").val(buyingcost);
});

let ItemVariations: Array<IItemVariation> = [];
let SelectedIVList: Array<IItemVariation> = [];

$(document).on("keypress", "input[type=number]", function (event) {
	return blockSpecialChar(event);
});

function handleWhatsappClick(
	this: any,
	e: JQuery.ClickEvent<Document, undefined, any, any>
) {
	e.preventDefault();
	let lnk = $appInfo.data("whatsappapilnk");
	const txt = $appInfo.data("whatsappapidefaulttxt");
	$target = $(this).hasClass("fa")
		? $(this).next("input")
		: $(this).prev("input");
	let phoneno = ($target.val() as string).trim();
	if (!phoneno.startsWith("852")) {
		phoneno = `852${phoneno}`;
		$target.val(phoneno);
	}
	lnk = lnk.replace("{0}", $target.val()).replace("{1}", txt);
	popupCenter({ url: lnk, title: "", w: 900, h: 500 });
}

function itemEditPageLoad() {
	//forsales = false;
	//forstock = true;
	AccountProfileId = parseInt(<string>$infoblk.data("accountprofileid"));
	initModals();
	$("#itmCode").trigger("focus");
	//console.log('codelist:', codelist);
	DicAcAccounts = $infoblk.data("jsondicacaccounts");
	//console.log('dicacaccounts:', dicAcAccounts);
	editmode = <number>$("#itmItemID").val() > 0;
	if (editmode) {
		ItemVariations = $infoblk.data("jsonitemvariations");
		SelectedIVList = $infoblk.data("jsonselectedivlist");

		//console.log(ItemVariations);
		if (ItemVariations.length === 0) {
			selectedItem = $infoblk.data("jsonitem");
			fillInItemForm(true);
		} else {
			$("#itemattrblk").hide();
			DicIVLocQty = $infoblk.data("jsondicivlocqty");
			// console.log(DicIVLocQty);

			if (!EditItem && SelectedIVList.length) {
				ItemVari = $infoblk.data("jsonitemvari");
				//console.log(ItemVari);
				fillInItemForm(true);
				$("#lblIVStatus").css({ color: "green" }).text(savedtxt);
				ItemVari!.SelectedAttrList4V = [];
			} else {
				//ItemVari = ItemVariations[0];
				selectedItem = $infoblk.data("jsonitem");
				//console.log(selectedItem);
				fillInItemForm(false);
				$("#lblIVStatus")
					.css({ color: "red" })
					.text(unsavedtxt)
					.parent("label")
					.removeClass("alert-info")
					.addClass("alert-danger");
				selectedItem!.SelectedAttrList4V = [];
			}
			$(".drpItemAttr").first().trigger("focus");
		}
		ItemAttrList = []; //only when btnEditItemAttr is clicked is filled the itemattrlist for accordion...
	} else {
		selectedItem = initItem();
		selectedItem!.AccountProfileId = AccountProfileId;
		selectedItem!.itmIsNonStock = false;
		selectedItem!.itmIsActive = true;
		if (!NonABSS) {
			$("#drpInventory").val("A");
			$(".accountno").eq(2).val("1-3000");
			selectedItem!.InventoryAccountID = 117;
		}
		$("#drpCategory").val(1);
	}

	//console.log("selectedItem:", selectedItem);
}

const fillInItemForm = (setDrpItemAttrVal: boolean) => {
	if (setDrpItemAttrVal) {
		$(".drpItemAttr").each(function (i, e) {
			$(e).val(ItemVari!.DicIvNameValList[$(e).data("name")]);
		});
	}

	$("#itmCode").val(selectedItem!.itmCode);
	// console.log("selecteditem.catid:" + selectedItem?.catId);
	$("#drpCategory").val(selectedItem?.catId == 0 ? 1 : selectedItem!.catId);

	$("#itmSupCode").val(selectedItem!.itmSupCode);
	$("#itmName").val(selectedItem!.itmName);
	$("#BaseSellingPrice").val(Number(selectedItem!.itmBaseSellingPrice));
	$("#BuyStdCost").val(Number(selectedItem!.itmBuyStdCost));
	$("#itmDesc").val(selectedItem!.itmDesc);
	$("#replacing").prop("checked", selectedItem!.itmUseDesc);

	$("#PLA").val(selectedItem!.PLA);
	$("#PLB").val(selectedItem!.PLB);
	$("#PLC").val(selectedItem!.PLC);
	$("#PLD").val(selectedItem!.PLD);
	$("#PLE").val(selectedItem!.PLE);
	$("#PLF").val(selectedItem!.PLF);

	$("#itmWeight").val(Number(selectedItem!.itmWeight));
	$("#itmWidth").val(Number(selectedItem!.itmWidth));
	$("#itmHeight").val(Number(selectedItem!.itmHeight));
	$("#itmLength").val(Number(selectedItem!.itmLength));

	$("#txtBuyUnit").val(selectedItem!.itmBuyUnit);
	$("#txtSellUnit").val(selectedItem!.itmSellUnit);
	$("#txtItmSellUnitQuantity").val(Number(selectedItem!.itmSellUnitQuantity));

	if (selectedItem) {
		if (!NonABSS) {
			if (selectedItem!.ExpenseAccountID > 0) {
				itemAcId = selectedItem!.ExpenseAccountID;
				getAccountList();
				getAccountClassificationID();
				getItemAccountNumber();
				fillAccountNumber("buy");
				$("#drpCOS").val(accountList[0].AccountClassificationID);
			}
			if (selectedItem!.IncomeAccountID > 0) {
				itemAcId = selectedItem!.IncomeAccountID;
				getAccountList();
				getAccountClassificationID();
				getItemAccountNumber();
				fillAccountNumber("sell");
				$("#drpIncome").val(accountList[0].AccountClassificationID);
			}
			if (selectedItem!.InventoryAccountID > 0) {
				itemAcId = selectedItem!.InventoryAccountID;
				getAccountList();
				getAccountClassificationID();
				getItemAccountNumber();
				fillAccountNumber("inventory");
				$("#drpInventory").val(accountList[0].AccountClassificationID);
			}
		}

		ItemAttrList = $infoblk.data("jsonattrlist");
		if (ItemAttrList.length) {
			populateIaAccordion(false);
			$(".drpItemAttr").first().trigger("focus");
		} else {
			ItemAttrList = [];
		}
		selectedItem!.SelectedAttrList4V = [];
	}

	$("#chkBatch").prop("checked", selectedItem!.chkBat);
	$("#chkSN").prop("checked", selectedItem!.chkSN);
	$("#chkExpiry").prop("checked", selectedItem!.chkVT);

	$("#isActive").prop("checked", selectedItem!.itmIsActive);

	//fill in values for hidden fields:
	$("#itmItemID").val(Number(selectedItem!.itmItemID));
	$("#ChkSN").val(selectedItem!.chkSN ? "True" : "False");
	$("#ChkBatch").val(selectedItem!.chkBat ? "True" : "False");
	$("#ChkExpiry").val(selectedItem!.chkVT ? "True" : "False");
	$("#codeinuse").val(selectedItem!.itmCode);
	$("#scodeinuse").val(selectedItem!.itmSupCode);
	$("#ReplacingItemNameOnReceipt").val(
		selectedItem!.itmUseDesc ? "True" : "False"
	);
};

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

if ($("#isActive").length) {
	$(document).on("change", "#isActive", function () {
		if (selectedItem) selectedItem!.itmIsActive = $(this).is(":checked");
	});
}
let ItemVari: IItemVariation | null;

$(document).on("change", "#itmCode", function () {
	let code: string = <string>$(this).val();
	if (code !== "") {
		if (code !== $("#codeinuse").val()) {
			if (phonelist.includes(code)) {
				$.fancyConfirm({
					title: "",
					message: itemcodeduplicatederr,
					shownobtn: false,
					okButton: oktxt,
					noButton: canceltxt,
					callback: function (value) {
						if (value) {
							$("#itmCode").trigger("focus");
						}
					},
				});
			} else if (selectedItem) {
				selectedItem!.itmCode = code;
			}
		}
	}
});

$(document).on("change", "#itmSupCode", function () {
	let code: string = <string>$(this).val();
	if (selectedItem && code !== "") {
		selectedItem!.itmSupCode = code;
	}
});

$(document).on("click", "#btnCopyFrm", function () {
	GetItems(1);
});

$(document).on("change", "#itmName", function () {
	let _val: string = <string>$(this).val();
	if (selectedItem && _val !== "") {
		selectedItem!.itmName = _val;
	}
});
$(document).on("change", "#itmDesc", function () {
	let _val: string = <string>$(this).val();
	if (selectedItem && _val !== "") {
		selectedItem!.itmDesc = _val;
	}
});
$(document).on("change", "#BaseSellingPrice", function () {
	let _val: number = <number>$(this).val();
	if (selectedItem) {
		selectedItem!.itmBaseSellingPrice = _val;
	}
	$("#PLA").val(_val);
});
$(document).on("click", "#btnClone", function () {
	let sellingprice: number = <number>$("#BaseSellingPrice").val();
	if (sellingprice > 0) {
		$.fancyConfirm({
			title: "",
			message: clonebasesellingpriceconfirm,
			shownobtn: true,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$(".itemprice").val(sellingprice);
					if (selectedItem)
						selectedItem!.PLA =
							selectedItem!.PLB =
							selectedItem!.PLC =
							selectedItem!.PLD =
							selectedItem!.PLE =
							selectedItem!.PLF =
							sellingprice;
				} else {
					$("#BaseSellingPrice").trigger("focus");
				}
			},
		});
	}
});

$(document).on("click", "#btnBuySellUnits", function () {
	forItem = true;
	openItemBuySellUnitsModal();
});

$(document).on("change", "#isTaxed", function () {
	if (selectedItem) selectedItem!.itmIsTaxedWhenSold = $(this).is(":checked");
	if (ItemVari) ItemVari!.itmIsTaxedWhenSold = $(this).is(":checked");
});

$(document).on("change", "#txtKeyword4Account", function () {
	keyword = <string>$(this).val();
	if (keyword !== "") {
		searchAccount();
	} else {
		filteredAccountList = [];
		changeAccountPage(1);
		resetAccountRow();
	}
});

$(document).on("click", "#btnSearchAccount", function () {
	if (keyword !== "") {
		searchAccount();
	}
});

$(document).on("change", ".positive", function () {
	if (!selectedItem) {
		return;
	}
	let pl: string = <string>$(this).attr("id")?.toLowerCase();
	let plp: number = <number>$(this).val();
	switch (pl) {
		case "plb":
			selectedItem!.PLB = plp;
			break;
		case "plc":
			selectedItem!.PLC = plp;
			break;
		case "pld":
			selectedItem!.PLD = plp;
			break;
		case "ple":
			selectedItem!.PLE = plp;
			break;
		case "plf":
			selectedItem!.PLF = plp;
			break;
		default:
		case "pla":
			selectedItem!.PLA = plp;
			break;
	}
});

$(document).on("change", "#replacing", function () {
	if ($(this).is(":checked")) {
		$("#ReplacingItemNameOnReceipt").val(1);
		isreplacing = true;
	} else {
		$("#ReplacingItemNameOnReceipt").val(0);
		isreplacing = false;
	}
	if (selectedItem) selectedItem!.itmUseDesc = isreplacing;
});

$(document).on("change", "#chkExpiry", function () {
	if ($(this).is(":checked")) {
		$("#ChkExpiry").val(1);
	} else {
		$("#ChkExpiry").val(0);
	}
	if (selectedItem) selectedItem!.chkVT = $(this).is(":checked");
});
$(document).on("change", "#chkSN", function () {
	if ($(this).is(":checked")) {
		$("#ChkSN").val(1);
	} else {
		$("#ChkSN").val(0);
	}
	if (selectedItem) selectedItem!.chkSN = $(this).is(":checked");
});
$(document).on("change", "#chkBatch", function () {
	if ($(this).is(":checked")) {
		$("#ChkBatch").val(1);
	} else {
		$("#ChkBatch").val(0);
	}
	if (selectedItem) selectedItem!.chkBat = $(this).is(":checked");
});
$(document).on("click", ".iapage", function () {
	//console.log('page:' + $(this).data('page'));
	let page = parseInt(<string>$(this).data("page"));
	changeAccountPage(page);
});
function numAccountPages(): number {
	if (filteredAccountList.length > 0) {
		return Math.ceil(filteredAccountList.length / records_per_page);
	} else {
		return Math.ceil(accountList.length / records_per_page);
	}
}
let localStore = window["localStorage"];
$(document).on("click", "#btnEditItemAttr", function () {
	$("#itemattrblk").show();
	ItemAttrList = $infoblk.data("jsonattrlist");
	if (ItemAttrList.length) {
		populateIaAccordion(false);
		$(".drpItemAttr").first().trigger("focus");
	} else {
		ItemAttrList = [];
	}
	selectedItem!.SelectedAttrList4V = [];
	$(this).hide();
});

let forPGItem: boolean = false;
let forMyobItem: boolean = false;

function setExRateDropDown() {
	if (useForexAPI) {
		if (localStore.getItem("apicurrencydata") === null) {
			$.ajax({
				type: "GET",
				url: "https://api.freecurrencyapi.com/v1/latest?apikey=HDs6UlKfcrhu5qov6S1YSjtIF5xlPHeWK7zUw08p&currencies=USD%2CCNY%2CEUR%2CGBP%2CAUD%2CHKD&base_currency=HKD",
				data: {},
				success: function (data) {
					if (data) {
						//console.log("data:", data.data);
						for (const [key, value] of Object.entries(data.data)) {
							const exrate = Number(value);
							//console.log("exrate:", exrate);
							DicCurrencyExRate[key] = exrate;
							_setExRateDropDown(value, key, exrate);
							localStore.setItem(
								"apicurrencydata",
								JSON.stringify(DicCurrencyExRate)
							);
						}

						$("#drpCurrency").niceSelect();
						//currencyModal.find("#tblCurrency tbody").empty().html(html);
					}
				},
				dataType: "json",
			});
		} else {
			DicCurrencyExRate = JSON.parse(
				<string>localStore.getItem("apicurrencydata")
			);
			for (const [key, value] of Object.entries(DicCurrencyExRate)) {
				const exrate = value;
				_setExRateDropDown(value, key, exrate);
			}
			$("#drpCurrency").niceSelect();
		}
	} else {
		//console.log("DicCurrencyExRate:", DicCurrencyExRate);
		for (const [key, value] of Object.entries(DicCurrencyExRate)) {
			const displaytxt = getCurrencyDisplayTxt(key, value);
			$("#drpCurrency").append(
				$("<option>", {
					value: value,
					text: displaytxt,
				})
			);
		}
		$("#drpCurrency").niceSelect();
	}
}

const fillInCurrencyModal = (currcode: string = "") => {
	if (useForexAPI) {
		// console.log("use api");
		$.ajax({
			type: "GET",
			url: "https://api.freecurrencyapi.com/v1/latest?apikey=HDs6UlKfcrhu5qov6S1YSjtIF5xlPHeWK7zUw08p&currencies=USD%2CCNY%2CEUR%2CGBP%2CAUD%2CHKD&base_currency=HKD",
			data: {},
			success: function (data) {
				if (data) {
					//console.log("data:", data.data);
					let html = "";
					for (const [key, value] of Object.entries(data.data)) {
						const exrate = Number(value);
						//console.log("exrate@fill:" + exrate);
						DicCurrencyExRate[key] = exrate;
						html += `<tr class="currency" data-key="${key}" data-value="${exrate}"><td>${key}</td><td>${formatexrate(
							exrate.toString()
						)}</td></tr>`;
					}
					currencyModal.find("#tblCurrency tbody").empty().html(html);
				}
			},
			dataType: "json",
		});
	} else {
		if (currcode === "") {
			let html = "";
			for (const [key, value] of Object.entries(DicCurrencyExRate)) {
				// console.log("key:" + key + ";value:" + value);
				html += `<tr class="currency" data-key="${key}" data-value="${value}"><td>${key}</td><td>${formatexrate(
					value.toString()
				)}</td></tr>`;
			}
			currencyModal.find("#tblCurrency tbody").html(html);
		} else {
			exRate = DicCurrencyExRate[currcode];
			if (forpurchase) {
				if (Purchase) Purchase.pstExRate = exRate;
				$("#pstExRate").val(exRate);
			}
			if (forwholesales) {
				if (Wholesales) Wholesales.wsExRate = exRate;
				$("#wsExRate").val(exRate);
			}
			if (forsales || forpreorder || fordeposit || forrefund) {
				if (Sales) Sales.rtsExRate = exRate;
				if (PreSales) PreSales.rtsExRate = exRate;
				$("#rtsExRate").val(exRate);
			}
		}
	}
};
let DicItemAttrList: { [Key: string]: IItemAttribute[] } = {};

let DicItemVariations: { [Key: string]: IItemVariation[] } = {};
let DicItemGroupedVariations: { [Key: string]: typeof DicItemVariations } = {};

let DicItemVari: { [Key: string]: IItemVariation } = {};

function getCurrencyDisplayTxt(key: string, value: number) {
	return `${DicCurrencySym[key]} ${key} (${formatexrate(value.toString())})`;
}

function _setExRateDropDown(value: any, key: string, exrate: number) {
	let selected = false;
	selected = exRate == value;
	const displaytxt = getCurrencyDisplayTxt(key, value);
	$("#drpCurrency").append(
		$("<option>", {
			value: exrate,
			text: displaytxt,
			selected: selected,
		})
	);
}



function fillInItemModal() {
	$tr
		.find("td:eq(1)")
		.text(ItemVari ? ItemVari!.NameDesc : selectedItem!.NameDesc);
	$tr
		.find("td:eq(2)")
		.text(ItemVari ? ItemVari!.DicLocQty[shop] : selectedItem!.DicLocQty[shop]);
	let _price = 0;
	if (ItemVari) {
		_price =
			Number(ItemVari!.itmBaseSellingPrice) ??
			Number(ItemVari!.itmLastSellingPrice);
	} else {
		_price =
			Number(selectedItem!.itmBaseSellingPrice) ??
			Number(selectedItem!.itmLastSellingPrice);
	}
	$tr.find("td:eq(3)").text(_price);
}
let forCustomer: boolean = false;
function confirmDateTime() {
	let strdate = $("#strDateTime").val();
	if (forCustomer) {
		//$.post("/Customer/UpdateFollowUpDate", {
		//    __RequestVerificationToken: $(
		//        "input[name=__RequestVerificationToken]"
		//    ).val(),
		//    customerId,
		//    followupdate: strdate });
		$.ajax({
			type: "POST",
			url: "/Customer/UpdateFollowUpDate",
			data: {
				__RequestVerificationToken: $(
					"input[name=__RequestVerificationToken]"
				).val(),
				customerId,
				followupdate: strdate,
			},
			success: function (data) {
				if (data) window.location.href = "/Customer/Index";
			},
			dataType: "json",
		});
	}
}

$(document).on("change", "textarea#itmDesc", function () {
	const charcount: number = ($(this).val() as string).length;
	const maxlength: number = Number($(this).attr("maxlength"));
	const msgstyle = charcount > maxlength ? "color:red;" : "color:blue;";
	const html: string = `<span style="${msgstyle}">${charcount}</span>`;
	$("#charcount").html(html);
});

let DicIVLocQty: { [Key: string]: number };

$(document).on("change", "#txtItem", function () {
	if ($(this).val() !== "") $("#btnSearchItem").trigger("click");
	else GetItems(1);
});

function getKeyByValue(object, value) {
	return Object.keys(object).find((key) => object[key] === value);
}

let currencyReferrer: string;
$(document).on("dblclick", ".exrate", function () {
	if (!$(this).hasClass("disabled")) {
		currencyReferrer = $(this).attr("id") as string;
		fillInCurrencyModal();
		openCurrencyModal();
	}
});
let currencyCode: string = "HKD";
$(document).on("click", ".currency", function () {
	$(this).addClass("selectedtr");
	let $currency: JQuery = $(`#${currencyReferrer}`);
	// console.log("$currency:", $currency);
	// console.log(
	//   "currency key:" +
	//     $(this).data("key") +
	//     ";currency val:" +
	//     $(this).data("value")
	// );
	$currency.val($(this).data("key")).trigger("change");
	let $exrate: any;
	if (forsales) $exrate = $("#rtsExRate");
	if (forwholesales) $exrate = $("#wsExRate");
	if (forpurchase) $exrate = $("#pstExRate");
	$exrate.val(<string>$(this).data("value"));
	// console.log("exrateval:" + $exrate.val());
	currencyCode = $(this).data("key") as string;
	closeCurrencyModal();
});
$(document).on("change", ".exrate", function (e) {
	//console.log("exrate changed");
	const cardcode = $(this).val() as string;
	if (cardcode in DicCurrencyExRate) {
		handleExRateChange(cardcode, true);
	}
});

function handleExRateChange(cardcode: string, triggerCardChange: boolean) {
	//let cardcode: string = <string>$(event.target).val();
	$target = $(`#${gTblName} tbody tr`);

	let cardcount: number = 0;
	DicFilteredCards = {};

	if (forpurchase) {
		Purchase.pstCurrency = cardcode;
		exRate = Purchase.pstExRate = DicCurrencyExRate[Purchase.pstCurrency];
		$("#pstExRate").val(exRate);
		//console.log("Purchase.pstextate:" + Purchase.pstExRate);
		currentY = 0;
		$target.each(function (i, e) {
			if ($(e).find("td:eq(1)").find(".itemcode").val() !== "") {
				//console.log("updating row...");
				updateRow(getRowPrice(), getRowDiscPc());
				currentY++;
			}
		});
		currentY = 0;

		if (triggerCardChange) {
			if (SupplierOptionList.length > 0)
				$("#drpSupplier").empty().append(SupplierOptionList.join(""));
			$("#drpSupplier > option").each(function (i, e) {
				const _cardcode = $(e).val() as string;
				var currkey = GetForeignCurrencyFrmCode(_cardcode);
				// console.log("currkey:" + currkey);
				if (currkey && currkey == Purchase.pstCurrency) {
					cardcode = _cardcode;
					if (!(currkey in DicFilteredCards)) {
						cardcount++;
						DicFilteredCards[cardcode] = $(e).text();
					}
				}
			});

			if (cardcount > 0) {
				if (cardcount === 1)
					$("#drpSupplier")
						.val(cardcode)
						.trigger("change")
						.prop("disabled", true);
				else {
					$("#drpSupplier").empty();
					for (const [key, value] of Object.entries(DicFilteredCards)) {
						$("#drpSupplier").append(
							$("<option>", {
								value: key,
								text: value,
							})
						);
					}
					$("#drpSupplier").select2();
				}
			} else {
				$("#drpSupplier").val("").trigger("change").prop("disabled", false);
			}
		}
	}
	if (forwholesales) {
		Wholesales.wsCurrency = cardcode;
		exRate = Wholesales.wsExRate = DicCurrencyExRate[Wholesales.wsCurrency];
		$("#wsExRate").val(exRate);
		//console.log("exrate#0:" + exRate);
		currentY = 0;
		$target.each(function (i, e) {
			if ($(e).find("td:eq(1)").find(".itemcode").val() !== "") {
				updateRow();
				currentY++;
			}
		});
		currentY = 0;

		if (triggerCardChange) {
			$("#drpCustomer").empty().append(CustomerOptionList.join(""));

			$("#drpCustomer > option").each(function (i, e) {
				const _cardcode = $(e).val() as string;
				var currkey = GetForeignCurrencyFrmCode(_cardcode);
				if (currkey && currkey == Wholesales.wsCurrency) {
					cardcode = _cardcode;
					if (!(currkey in DicFilteredCards)) {
						cardcount++;
						DicFilteredCards[cardcode] = $(e).text();
					}
				}
			});
			//console.log("cardcount:" + cardcount);

			if (cardcount > 0) {
				if (cardcount === 1)
					$("#drpCustomer")
						.val(cardcode)
						.trigger("change")
						.prop("disabled", true);
				else {
					$("#drpCustomer").empty();
					for (const [key, value] of Object.entries(DicFilteredCards)) {
						$("#drpCustomer").append(
							$("<option>", {
								value: key,
								text: value,
							})
						);
					}
					$("#drpCustomer").select2();
				}
			} else {
				$("#drpCustomer").val("").trigger("change").prop("disabled", false);
			}
		}
	}
	//console.log("exRate#1:" + exRate);
	displayExRate(exRate);
}

function backUpCardDrpOptions() {
	if (forpurchase) {
		$("#drpSupplier > option").each(function (i, e) {
			DicOriCards[$(e).val() as string] = $(e).text();
		});
	}
	if (forwholesales) {
		$("#drpConsumer > option").each(function (i, e) {
			DicOriCards[$(e).val() as string] = $(e).text();
		});
	}
	// console.log("diccards:", DicOriCards);
}

let DicOriCards: { [Key: string]: string } = {};
let DicFilteredCards: { [Key: string]: string } = {};
function fillInCategory() {
	ItemCategory = {} as ICategory;
	ItemCategory.Id = editmode ? Number($("#Id").val()) : 0;
	ItemCategory.catName = $("#catName").val() as string;
	ItemCategory.catDesc = $("#catDesc").val() as string;
	ItemCategory.catNameTC = $("#catNameTC").val() as string;
	ItemCategory.catDescTC = $("#catDescTC").val() as string;
	ItemCategory.catNameSC = $("#catNameSC").val() as string;
	ItemCategory.catDescSC = $("#catDescSC").val() as string;
	ItemCategory.Removable = editmode ? $("#Removable").val() == "True" : true;
}
let ItemCategory: ICategory;
interface ICategory {
	Id: number;
	catName: string;
	catDesc: string;
	catNameTC: string;
	catDescTC: string;
	catNameSC: string;
	catDescSC: string;
	AccountProfileId: number;
	CompanyId: number;
	CreateTimeDisplay: string;
	ModifyTimeDisplay: string | null;
	Removable: boolean;
}
let $salecomment = $("#cusSaleComment");
let $paymentIsDue = $("#PaymentIsDue");

function getCustomers() {
	openWaitingModal();
	SearchCustomers();
}

let forMyob: boolean = true;
function SearchCustomers() {
	let imyob = forMyob ? 1 : 0;
	$.ajax({
		url: "/Api/SearchCustomersAjax",
		type: "GET",
		data: { pageIndex: 1, keyword: keyword.toLowerCase(), imyob },
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: OnSearchCustomersOK,
		error: onAjaxFailure,
	});
}

function OnSearchCustomersOK(data) {
	closeWaitingModal(); // console.log(data);

	if (data.Customers.length === 0) {
		$("#norecord").removeClass("hide");
		$("#tblCustomer").hide();
		$("#pagingblk").hide();
	} else {
		$("#norecord").addClass("hide");
		$("#pagingblk").hide();
		customerlist = data.Customers.slice(0);
		$target = $("#tblCustomer tbody");
		let html = "";
		$.each(customerlist, function (i, customer) {
			let email =
				customer.cusEmail == null || customer.cusEmail == ""
					? "N/A"
					: customer.cusEmail;
			let cname = customer.cusIsOrganization
				? customer.cusName
				: customer.cusFirstName + " " + customer.cusName;
			html += `<tr>

                <td style="width:110px;max-width:110px;" class="text-center">${cname}</td>
                <td style="width:100px;max-width:100px;" class="text-center">${customer.cusContact}</td>
                <td style="width:110px;max-width:110px;" class="text-center">${email}</td>`;

			if (!NonABSS)
				html += `<td style="width:120px;max-width:120px;" class="text-center">${customer.CreateTimeDisplay}</td>`;
			html += `<td style="width:100px;max-width:100px;" class="text-center">${customer.AccountProfileName}</td>`;

			//<td style="width:70px;max-width:70px;"><a href="#" class="btn btn-success detail" role="button" data-id="${customer.cusCustomerID}">${detailtxt}</a></td>

			html += `<td style="width:125px;max-width:125px;">
                    <a class="btn btn-info" role="button" href="/Customer/Edit?customerId=${customer.cusCustomerID}&AccountProfileId=${customer.AccountProfileId}"><span class="small">${edittxt}</span></a>
                    <a class="btn btn-danger remove" role="button" href="#" data-Id="${customer.cusCustomerID}" data-apid="${customer.AccountProfileId}"><span class="small">${removetxt}</span></a>
                </td>
            </tr>`;
		});

		$target.empty().html(html);
	}
}

function validCusForm() {
	let msg = "";
	// console.log("cuscode:" + customer.cusCode);
	let $cusname = $("#cusName");
	let $cusfname = $("#cusFirstName");
	let $contact = $("#cusContact");
	let $cuscode = $("#cusCode");
	let duplicated = false;
	let $cusemail = $("#cusEmail");
	let emailerr = false;

	if (customer.cusPhone === "") {
		msg += $infoblk.data("customerphonerequired") + "<br>";
	} else {
		if (customer.cusPhone !== <string>$("#phoneinuse").val()!.toString()) {
			if (phonelist.includes(customer.cusPhone)) {
				msg += customerphoneduplicatederrtxt + "<br>";
				duplicated = true;
			}
		}
	}

	if (customer.cusContact === "") {
		msg += $infoblk.data("contactrequired") + "<br>";
	}

	let email = customer.cusEmail;

	if (email !== "") {
		if (!validateEmail(email)) {
			msg += emailformaterr + "<br>";
			emailerr = true;
		}
	}

	console.log("msg:" + msg);
	if (msg !== "") {
		$.fancyConfirm({
			title: "",
			message: msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				console.log("duplicated:" + duplicated);
				if (value) {
					if (_attrmode) {
						if (isorgan && customer.cusName === "") {
							$cusname.addClass("focus");
						}
						if (!isorgan && customer.cusFirstName === "") {
							$cusfname.addClass("focus");
						}
						if (customer.cusCode === "") {
							$cuscode.addClass("focus");
						}
						if (customer.cusContact === "") {
							$contact.addClass("focus");
						}
						if (duplicated) {
							$cuscode.addClass("focus");
						}
						if (emailerr) {
							$cusemail.addClass("focus");
						}
					}
				}
			},
		});
	}
	return msg === "";
}

function fillInCustomer() {
	customer = initCustomer();
	customer.cusCustomerID = <number>$("#cusCustomerID").val();
	customer.cusCode = editmode
		? ($("#cusCode").val() as string)
		: ($("#cusPhone").val() as string);
	// console.log("cuscode:" + customer.cusCode);
	customer.cusName = isorgan
		? <string>$("#cusName").val()
		: <string>$("#cusLastName").val();
	customer.cusPhone = <string>$("#cusPhone").val();
	customer.cusSaleComment = <string>$salecomment.val();
	customer.PaymentIsDue = <number>$paymentIsDue.val();
	customer.BalanceDueDays = <number>$("#BalanceDueDays").val();
	let $points = $("#points");
	let newpoints: number = <number>$points.val();
	let oldpoints: number = <number>$points.data("oldpoints");
	customer.cusPointsSoFar += newpoints - oldpoints;
	customer.cusEmail = <string>$("#cusEmail").val();
	customer.IsActive = <number>$("#IsActive").val();
	customer.AccountProfileId = <number>$("#AccountProfileId").val();
	customer.IsOrganization = <string>$("#IsOrgan").val();
	customer.cusContact = <string>$("#cusContact").val();
	customer.cusFirstName = <string>$("#cusFirstName").val();
	customer.cusAddrCity = <string>$("#cusAddrCity").val();
	customer.cusAddrCountry = <string>$("#cusCountry").val();
	customer.cusAddrWeb = <string>$("#cusAddrWeb").val();

	for (let i = 1; i <= 5; i++) {
		let address: IAddressView = initAddressView();
		address.CusAddrLocation = i.toString();
		address.StreetLine1 = $(`#addr${i}`).find(".address").eq(0).val() as string;
		address.StreetLine2 = $(`#addr${i}`).find(".address").eq(1).val() as string;
		customer.AddressList.push(address);
	}

	customer.cusAddrStreetLine1 = <string>$("#cusAddrStreetLine1").val();
	customer.cusAddrStreetLine2 = <string>$("#cusAddrStreetLine2").val();
	customer.cusAddrStreetLine3 = <string>$("#cusAddrStreetLine3").val();
	customer.cusAddrStreetLine4 = <string>$("#cusAddrStreetLine4").val();

	customer.cusAddrPhone1 = <string>$("#cusAddrPhone1").val();
	customer.cusPhone1Whatsapp = false;
	let $phone2 = $("#cusAddrPhone2");
	if ($phone2.length) {
		customer.cusAddrPhone2 = <string>$("#cusAddrPhone2").val();
		customer.cusPhone2Whatsapp = false;
	}
	let $phone3 = $("#cusAddrPhone3");
	if ($phone3.length) {
		customer.cusAddrPhone3 = <string>$("#cusAddrPhone3").val();
		customer.cusPhone3Whatsapp = false;
	}

	customer.IsLastSellingPrice = $("#IsLastSellingPrice").is(":checked");

	if (editmode) {
		$("#drpCity").val($("#cusCity").val() as string);
	}
	//else {
	//    $("#cusCountry").val("香港");
	//}

	customer.FollowUpDateInfo.type = "date";
	customer.FollowUpDateInfo.status = $(".followup:checked").val() as string;
	customer.FollowUpDateInfo.JsFollowUpDate = $("#followUpDate").val() as string;
	customer.FollowUpDateInfo.Id = Number($("#FollowUpDateInfo_Id").val());

	customer.unsubscribe = $("#chkUnsubscribe").is(":checked");
}

$(document).on("click", ".itemremove", function () {
	let itemId = $(this).data("id");
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					//contentType: 'application/json; charset=utf-8',
					type: "POST",
					url: "/PGItem/Delete",
					data: {
						__RequestVerificationToken: $(
							"input[name=__RequestVerificationToken]"
						).val(),
						itemId,
					},
					success: function (data) {
						window.location.reload();
					},
					dataType: "json",
				});
			} else {
				$("#txtKeyword").trigger("focus");
			}
		},
	});
});
function setFullPage() {
	$("body")
		.find(".body-content")
		.removeClass("container")
		.addClass("container-fluid");
}

let promotion: IPromotion;
function fillPromotion(): IPromotion {
	return {
		Id: Number($("#Id").val()),
		proName: $("#proName").val() as string,
		proDesc: $("#proDesc").val() as string,
		proNameTC: $("#proNameTC").val() as string,
		proDescTC: $("#proDescTC").val() as string,
		proNameSC: $("#proNameSC").val() as string,
		proDescSC: $("#proDescSC").val() as string,
		pro4Period: ($("input[name=protype]:checked").val() as string) === "period",
		JsDateFrm: $("#proDateFrm").length
			? ($("#proDateFrm").val() as string)
			: null,
		JsDateTo: $("#proDateTo").length ? ($("#proDateTo").val() as string) : null,
		proPrice: $("#proPrice").length ? Number($("#proPrice").val()) : null,
		proQty: $("#proQty").length ? Number($("#proQty").val()) : null,
		proDiscPc:
			Number($(".prodiscpc").val()) === 0
				? Number($(".prodiscpc.pd").val())
				: Number($(".prodiscpc").val()),
		IsObsolete: $("#IsObsolete").val() === "True",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: null,
	};
}

function initPromotion(): IPromotion {
	return {
		Id: 0,
		proName: "",
		proDesc: "",
		proNameTC: null,
		proDescTC: null,
		proNameSC: null,
		proDescSC: null,
		pro4Period: false,
		JsDateFrm: null,
		JsDateTo: null,
		proPrice: 0,
		proQty: 0,
		proDiscPc: 0,
		IsObsolete: false,
		CreateTimeDisplay: "",
		ModifyTimeDisplay: null,
	};
}
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
function fillItemPeriodPromotion(): IItemPeriodPromotion {
	var itemperiodpromotion = {
		// Id: Number($("#ItemPromotion_Id").val()),
		proId: Number($("#drpPromotion").val()),
		itemCodes: $("#drpItems").val() as string[],
		itemCode: "",
		proNameDisplay: "",
		proDescDisplay: "",
		JsDateFrm: "",
		JsDateTo: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: null,
		ipIds: $("#ipIds").val() as string,
		DicPromotionItems: {},
	};
	itemperiodpromotion.itemCode = itemperiodpromotion.itemCodes.join(",");
	return itemperiodpromotion;
}
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
function fillItemQtyPromotion(): IItemQtyPromotion {
	var itemqtypromotion = {
		// Id: Number($("#ItemPromotion_Id").val()),
		proId: Number($("#drpPromotion").val()),
		itemCodes: $("#drpItems").val() as string[],
		itemCode: "",
		proNameDisplay: "",
		proDescDisplay: "",
		JsDateFrm: "",
		JsDateTo: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: null,
		ipIds: $("#ipIds").val() as string,
		DicPromotionItems: {},
	};
	itemqtypromotion.itemCode = itemqtypromotion.itemCodes.join(",");
	return itemqtypromotion;
}
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

function initItemPromotion(): IItemPromotion {
	return {
		proId: 0,
		itemCode: "",
		IPCreateTimeDisplay: "",
		IPModifyTimeDisplay: null,
		DateFrmDisplay: null,
		DateToDisplay: null,
		proQty: 0,
		proPrice: 0,
		proDiscPc: 0,
		pro4Period: false,
		NameDisplay: "",
		DescDisplay: "",
		PriceDisplay: "",
		DiscPcDisplay: "",
	};
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
}
function selectCus() {
	selectcus();

	setupForexInfo();

	if (!forsimplesales) {
		let $rows = $(`#${gTblName} tbody tr`);
		//console.log('rows length:' + $rows.length + ';currentY:' + currentY);
		if ($rows.length === 0) {
			addRow();
		} else {
			if ($rows.last().find("td:eq(1)").find(".itemcode").val() !== "") {
				addRow();
			} else {
				focusItemCode($rows.length - 1);
			}
			//reset sales rows:
			resetPay(false); //reset all variables first
			itotalamt = 0;
			//console.log('SalesList#selectCus#1:', SalesList);
			$rows.each(function (i, e) {
				currentY = $(e).data("idx");
				let _seq = currentY + 1;
				//console.log('currentY:' + currentY);
				$target = $rows.eq(currentY);

				let _itemcode: any = $target.find("td:eq(1)").find(".itemcode").val();
				let _selectedItemCode: string = _itemcode.toString();
				//console.log('_selectedItemCode:' + _selectedItemCode);
				if (_selectedItemCode !== "") {
					let salesln: ISalesLn = $.grep(SalesLnList, function (v, k) {
						return (
							v.rtlSeq == _seq && v.Item.itmCode.toString() == _selectedItemCode
						);
					})[0];
					//console.log('salesln:', salesln);

					if (typeof salesln !== "undefined") {
						let price = getActualPrice(salesln!.Item);
						//let qty = salesln.rtlQty;
						let discount = salesln.rtlLineDiscPc as number;
						//let taxrate = salesln.taxrate;
						//console.log('qty:' + qty + ';price:' + price + ';disc:' + discount + ';tax:' + taxrate);
						updateRow(price, discount);
						_selectedItemCode = "";
						currentY = -1;
					}
				}
			});
		}
	}

	$("#txtCustomerName").trigger("focus");

	if (Sales) Sales.rtsCusID = selectedCus.cusCustomerID;
}
let deliveryAddressId: number = 0;
function setupForexInfo() {
	if (!comInfo) comInfo = $infoblk.data("cominfo");
	if ($.isEmptyObject(DicCurrencyExRate))
		DicCurrencyExRate = $infoblk.data("diccurrencyexrate");
	useForexAPI = comInfo.UseForexAPI;
	exRate = 1;
	let currcode = "";
	if (!useForexAPI) currcode = GetForeignCurrencyFrmCode(selectedCus.cusCode!);
	//console.log("currcode:" + currcode);
	if (currcode !== "") {
		$("#rtsCurrency").val(currcode).prop("readonly", true);
		fillInCurrencyModal(currcode);
	}
	displayExRate(exRate);
	$("#rtsExRate").val(1);
}

function selectcus() {
	selectedCusCodeName = selectedCus.cusCustomerID.toString();
	//console.log('selectedcuscodename:' + selectedCusCodeName);
	if (selectedCusCodeName === "") {
		$.fancyConfirm({
			title: "",
			message: customerrequiredtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$("#txtCustomerName").trigger("focus");
				}
			},
		});
	} else {
		if (
			typeof CusList !== "undefined" &&
			CusList.length > 1 &&
			(typeof selectedCus === "undefined" || selectedCus === null)
		) {
			selectedCus = $.grep(CusList, function (n, i) {
				return n.cusCustomerID.toString() == selectedCusCodeName;
			})[0];
		}

		let $drpaddr = fillInAddressList();
		deliveryAddressId = <number>$drpaddr.val();

		selectedCusCodeName = selectedCus.cusCustomerID.toString();

		let $cusname = $("#txtCustomerName");
		$cusname.off("change");
		$cusname.val(selectedCus.cusName);
		$cusname.off("focus").on("change", handleCustomerNameChange);

		if (selectedCus.cusName.toLowerCase() !== "guest") {
			$("#txtPhone").val(selectedCus.cusPhone);
			$("#txtPoints").val(<number>selectedCus.PointsActive);
			//setCustomerPriceLevel();
			$("#txtPriceLevel").val(<string>selectedCus.cusPriceLevelDescription);
			//console.log("cus joblist:", selectedCus.JobList);
			if (enableTax && !inclusivetax) {
				//console.log("here");
				updateRows();
			}
		} else {
			$("#txtPhone").val("");
			$("#txtPoints").val(0);
			$("#txtPriceLevel").val("");
		}

		$(".cuscode").text(selectedCus.cusCode);

		if (!useForexAPI && selectedCus.ExchangeRate)
			exRate = selectedCus.ExchangeRate!;
	}
}

function searchCustomer(_keyword: string) {
	if (_keyword !== "") {
		keyword = _keyword.toLowerCase();
		searchcusmode = true;
		GetCustomers4Sales(1, "search");
	} else {
		falert(onlyalphanumericallowedtxt, oktxt);
	}
}

function getCustomersOk(data) {
	closeWaitingModal();
	keyword = "";
	//console.log('getcustomerok data:', data);
	$(".warning").empty();
	let html = "";
	if (data.Customers.length > 0) {
		CusList = data.Customers.slice(0);
		//console.log('cuslist:', cuslist);
		if (CusList.length === 1) {
			selectedCus = CusList[0];
			selectCus();
		} else if (CusList.length > 1) {
			$.each(CusList, function (i, e) {
				html +=
					'<tr class="cuscode" data-code="' +
					e.cusCode +
					'"><td>' +
					e.cusCode +
					"</td><td>" +
					e.cusName +
					"</td></tr>";
			});

			$("#tblCus tbody").empty().append(html);
			selectCus();
		} else {
			openCusModal();
		}
	} else {
		openCusModal();
	}
}

function handleCustomerNameChange(e: any) {
	// console.log("handlecustomernamechang called");
	//  console.log("SalesList#txtcustomernamechange:", SalesLnList);
	selectedCusCodeName = <string>e.currentTarget.value;
	// console.log("selectedcuscodename#handlenamechange:" + selectedCusCodeName);
	searchCustomer(selectedCusCodeName);
	// selectCus();
}

$(document).on("change", ".itemcode", handleItemCodeChange);
let searchItemMode = false;
function handleItemCodeChange(event: any) {
	// console.log("here");
	const $itemcode = $(event.target);
	currentY =
		parseInt($itemcode.parent("td").parent("tr").find("td:eq(0)").text()) - 1;
	seq = currentY + 1;

	selectedItemCode = <string>$itemcode.val()?.toString();

	if (forsales) selectedSalesLn = GetSetSelectedSalesLn();
	if (forpreorder) selectedPreSalesLn = GetSetSelectedPreSalesLn();
	if (forwholesales) selectedWholesalesLn = GetSetSelectedWholeSalesLn();
	if (forpurchase) selectedPurchaseItem = GetSetSelectedPurchaseItem();

	if (selectedItemCode !== "") {
		searchItemMode = true;
		keyword = selectedItemCode.toString();
		// console.log("here");
		searchItem();
		// }
	} else {
		//console.log("ready for reset row...");
		resetRow();
	}
}

function handleReversePayment(salescode: string) {
	setTimeout(disableReverse, 3000000); //inactivate the link after 15 mins
	$("#reverseEpay").removeClass("isDisabled"); //activate the link
	$.ajax({
		type: "POST",
		url: "/POSFunc/ReversePayment",
		data: { salescode },
		success: function (data) {
			$.fancyConfirm({
				title: "",
				message: data.msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						if (data.epaystatus == 1) {
							window.location.reload();
						} else {
						}
					}
				},
			});
		},
		dataType: "json",
	});
}
function disableTR() {
	$("#transactionEpay").addClass("isDisabled");
}
function disableReverse() {
	$("#reverseEpay").addClass("isDisabled");
}

let salesln: ISalesLn;
let checkedcashdrawer: boolean = false;

function updatePreSales() {
	let totalamt = 0;
	let $rows = $(`#${gTblName} tbody tr`);
	$rows.each(function (i, e) {
		let _seq = i + 1;
		let itemcode: string = $(e)
			.find("td")
			.eq(1)
			.find(".itemcode")
			.val() as string;

		if (itemcode) {
			let presalesln: IPreSalesLn | null;
			if (PreSalesLnList.length === 0) {
				presalesln = {} as IPreSalesLn;
				presalesln.rtlSeq = _seq;
			} else {
				let idx = PreSalesLnList.findIndex((x) => x.rtlSeq == _seq);
				if (idx >= 0) presalesln = PreSalesLnList[idx];
				else {
					presalesln = {} as IPreSalesLn;
					presalesln.rtlSeq = _seq;
				}
			}

			if (presalesln) {
				presalesln.rtlSeq = Number($(e).data("idx")) + 1;
				let idx = 0;
				//presalesln.rtlItemCode = itemcode;
				//let idx = ItemList.findIndex(
				//	(x) => x.itmCode.toString() == presalesln!.rtlItemCode.toString()
				//);

				//if (idx >= 0) {
				//	presalesln.Item = ItemList[idx];
				//}
				presalesln.rtlQty = Number($(e).find("td:eq(4)").find(".qty").val());

				idx = PriceIdx4Sales;
				presalesln.rtlSellingPrice = Number(
					$(e).find("td").eq(idx).find(".price").val()
				);
				idx++;
				presalesln.rtlLineDiscPc = Number(
					$(e).find("td").eq(idx).find(".discpc").val()
				);

				idx++;
				if (enableTax && !inclusivetax) {
					presalesln.rtlTaxPc = Number(
						$(e).find("td").eq(idx).find(".taxpc").val()
					);
				}

				presalesln.rtlSalesLoc = presalesln.rtlStockLoc = <string>(
					$(e).find("td").eq(-3).find(".location").val()
				);
				presalesln.JobID = Number($(e).find("td").eq(-2).find(".job").val());
				//console.log("presalesln.jobid:" + presalesln.JobID);
				const amt: number = Number(
					$(e).find("td").eq(-1).find(".amount").val()
				);
				// console.log("amt:" + amt);
				presalesln.rtlSalesAmt = amt;
				totalamt += amt;
			}

			if (PreSalesLnList.length > 0) {
				let idx = PreSalesLnList.findIndex((x) => x.rtlSeq == _seq);
				if (idx >= 0) {
					PreSalesLnList[idx] = structuredClone(presalesln);
				} else {
					PreSalesLnList.push(presalesln);
				}
			} else {
				PreSalesLnList.push(presalesln);
			}
		}
	});
	//console.log("totalamt#updatesales:" + totalamt);
	$("#txtTotal").val(formatnumber(totalamt));
	//console.log("PreSalesLnList@updatesales:", PreSalesLnList);

	//reset variables:
	isPromotion = !isPromotion;
}

function updateSimpleSales() {
	//Sales.rtsCusID = Number($("#rtsCusID").val());
	Sales.authcode = authcode;
	Sales.rtsCurrency = $("#rtsCurrency").val() as string;
	Sales.rtsExRate = exRate;

	SimpleSalesLns = [];
	$(".product-lists").each(function (i, e) {
		let salesLn: ISimpleSalesLn = {
			rtlItemCode: $(e).data("code"), rtlLineDiscPc: Number($(e).data("discpc")), rtlLineDiscAmt: Number($(e).data("disc")), rtlQty: Number($(e).find(".simpleqty").val()), rtlSellingPrice: Number($(e).data("price")), rtlDesc: $(e).data("desc"), rtlSalesAmt: Number($(e).data("amt")), rtlSalesLoc: comInfo.Shop, rtlStockLoc: comInfo.Shop
		} as ISimpleSalesLn;
		SimpleSalesLns.push(salesLn);
	});
}

function updateSales() {
	let totalamt = 0;
	let $rows = $("#tblSales tbody tr");
	$rows.each(function (i, e) {
		let _seq = i + 1;
		let itemcode: string = $(e)
			.find("td")
			.eq(1)
			.find(".itemcode")
			.val() as string;

		if (itemcode) {
			let salesln: ISalesLn | ISimpleSalesLn;

			if (SalesLnList.length === 0) salesln = initSalesLn(_seq);
			else {
				let idx = SalesLnList.findIndex((x) => x.rtlSeq == _seq);
				if (idx >= 0) salesln = SalesLnList[idx];
				else salesln = initSalesLn(_seq);
			}


			if (salesln! && !editmode) { //not for salesorderlist here
				salesln.rtlSeq = Number($(e).data("idx")) + 1;
				salesln.rtlItemCode = itemcode;
				let idx = ItemList.findIndex(
					(x) => x.itmCode.toString() == salesln!.rtlItemCode.toString()
				);

				if (idx >= 0) {
					salesln.Item = ItemList[idx];
				}

				salesln.rtlQty = Number($(e).find("td:eq(4)").find(".qty").val());

				idx = PriceIdx4Sales;
				salesln.rtlSellingPrice = Number(
					$(e).find("td").eq(idx).find(".price").val()
				);
				idx++;
				salesln.rtlLineDiscPc = Number(
					$(e).find("td").eq(idx).find(".discpc").val()
				);

				idx++;
				if (enableTax && !inclusivetax) {
					salesln.rtlTaxPc = Number(
						$(e).find("td").eq(idx).find(".taxpc").val()
					);
				}

				salesln.rtlSalesLoc = salesln.rtlStockLoc = <string>(
					$(e).find("td").eq(-3).find(".location").val()
				);
				salesln.JobID = Number($(e).find("td").eq(-2).find(".job").val());
				//console.log("salesln.jobid:" + salesln.JobID);
				const amt: number = Number(
					$(e).find("td").eq(-1).find(".amount").val()
				);
				// console.log("amt:" + amt);
				salesln.rtlSalesAmt = amt;
				totalamt += amt;
			}

			if (SalesLnList.length > 0 && !editmode) {//not for salesorderlist here
				let idx = SalesLnList.findIndex((x) => x.rtlSeq == _seq);
				if (idx >= 0) {
					SalesLnList[idx] = structuredClone(salesln! as ISalesLn);
				} else {
					SalesLnList.push(salesln! as ISalesLn);
				}
			} else {
				SalesLnList.push(salesln! as ISalesLn);
			}
		}
	});
	//console.log("totalamt#updatesales:" + totalamt);
	$("#txtTotal").val(formatnumber(totalamt));
	//console.log("SalesLnList@updatesales:", SalesLnList);

	//reset variables:
	isPromotion = !isPromotion;
}
function getItemsDisplayStart() {
	return ItemList.length + 1;
}
interface ICustomerItem {
	cusCode: string;
	itmCode: string;
	LastSellingPrice: number;
	CreateTimeDisplay: string;
	AccountProfileId: number;
	CompanyId: number;
	ModifyTimeDisplay: string | null;
}
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
function fillInAddressList(): JQuery<HTMLElement> {
	let $drpaddr = $("#drpDeliveryAddr");
	$drpaddr.empty();
	// console.log("selectedcus#fillinaddress:", selectedCus);
	if (selectedCus && selectedCus.AddressList) {
		$.each(selectedCus.AddressList, function (i, item) {
			let address: string = `${item.StreetLine1 ?? ""} ${item.StreetLine2 ?? ""
				} ${item.StreetLine3 ?? ""} ${item.StreetLine4 ?? ""} ${item.City ?? ""
				} ${item.State ?? ""} ${item.Country ?? ""}`.trim();
			if (address !== "") {
				$drpaddr.append(
					$("<option>", {
						value: item.Id,
						text: address,
						selected: Wholesales && Wholesales.wsDeliveryAddressId == item.Id,
					})
				);
			}
		});
	}
	return $drpaddr;
}
let today = new Date();
let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

function initRecurOrder(): IRecurOrder {
	return {
		wsUID: 0,
		wsCode: "",
		IsRecurring: 1,
		Name: "",
		TotalSalesAmt: 0,
		LastPostedDate: new Date(),
		LastPostedDateDisplay: "",
		ItemsNameDesc: "",
		Mode: "",
		pstUID: 0,
		pstCode: "",
		rtsUID: 0,
	};
}
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
let currentoldestdate: any;
let pagesize: number;
let resource: string;

function handleMGTmails(pageIndex: number = 1) {
	if (forenquiry) {
		const enquiryacc: string = $infoblk.data("enquiryacc") as string;
		EnquiryList = [];

		let mgtEmail = document.getElementById("mgt-email");		
		/*let _resource = resource.replace("{0}", `${strfrmdate}`).replace("{1}", `${strtodate}`).replace("{2}", `${enquiryacc}`);*/
		let _resource = resource.replace("{0}", `${enquiryacc}`);
		//console.log("_resource:", _resource);

		$("#mgt-email").attr("resource", _resource);

		if (mgtEmail) {
			mgtEmail.addEventListener("dataChange", (e: any) => {
				const response = e.detail.response;
				//console.log("response value:", response.value);
				response.value.forEach((x) => {
					EnquiryList.push(x);
					DicEnqContent[x.id] = `${x.body.content} ReceivedDateTime:${x.receivedDateTime}`;
				});
				parseEnquiries(DicEnqContent);

				if (EnquiryList.length > 0) {
					//console.log("enqIdList:", enqIdList);
					let enqlist: IEnquiry[] = [];
					EnquiryList.forEach((x) => {
						if (!enqIdList.includes(x.id)) {
							enqlist.push(x);
						}
					});
					if (enqlist.length > 0)
						saveEnquiries(enqlist);
				}

				sortCol = 8;
			});

			GetEnquiries(pageIndex);
		}
	}

	if (forattendance) {
		//console.log("here");
		AttendanceList = [];
		const attendanceacc: string = $infoblk.data("attendanceacc") as string;
		//console.log("attendanceacc:", attendanceacc);
		let mgtEmail = document.getElementById("mgt-email");
		
		//let _resource = resource.replace("{0}", `${strfrmdate}`).replace("{1}", `${strtodate}`).replace("{2}", attendanceacc);
		let _resource = resource.replace("{0}", `${attendanceacc}`);

		$("#mgt-email").attr("resource", _resource);

		if (mgtEmail) {
			mgtEmail.addEventListener("dataChange", (e: any) => {
				const response = e.detail.response;
				response.value.forEach((x) => {
					attendance = {
						id: "",
						saId: x.id,
						receivedDateTime: x.receivedDateTime,
						receiveddate: getReceivedDate(x.receivedDateTime),
						saName: "",
						saReceivedDateTime: "",
						saCheckInTime: "",
						saCheckOutTime: "",
						saDate: null,
						DateDisplay: "",
						TotalRecord:0,
					};

					let idx = AttendanceList.findIndex(a => a.saId == x.id);
					if (idx === -1) {
						AttendanceList.push(attendance);
						DicAttdSubject[x.id] = `${x.subject}`;
					}

				});

				parseAttendances(DicAttdSubject);

				if (AttendanceList.length > 0) {
					//console.log("enqIdList:", enqIdList);
					let attdlist: IAttendance[] = [];
					//console.log("AttendanceList#00:", AttendanceList);
					AttendanceList.forEach((x) => {
						if (!attdIdList.includes(x.saId)) {
							//console.log(x.saId);
							attdlist.push(x);
						}
					});
					//console.log("attdlist:", attdlist);
					if (attdlist.length > 0)
						saveAttendances(attdlist);
				}

				sortCol = 0;
			});

			GetAttendances(pageIndex);
		}
	}

	if (forjob) {
		//console.log("here");
		JobList = [];
		const jobacc: string = $infoblk.data("jobacc") as string;
		//console.log("jobacc:", jobacc);
		let mgtEmail = document.getElementById("mgt-email");	
		//let _resource = resource.replace("{0}", `${strfrmdate}`).replace("{1}", `${strtodate}`).replace("{2}", jobacc);
		let _resource = resource.replace("{0}", `${jobacc}`);

		$("#mgt-email").attr("resource", _resource);

		if (mgtEmail) {
			mgtEmail.addEventListener("dataChange", (e: any) => {
				const response = e.detail.response;

				response.value.forEach((x) => {
					job = {
						id: "",
						joStaffName: x.from.emailAddress.name,
						joStaffEmail: x.from.emailAddress.address,
						joId: x.id,
						receivedDateTime: x.receivedDateTime,
						receiveddate: getReceivedDate(x.receivedDateTime),
						joClient: "",
						joTime: "",
						joWorkingHrs: 0,
						joReceivedDateTime: "",
						joAttachements: "",
						joDate: null,
						DateDisplay: "",
						TotalRecord:0,
					};
					//console.log("receivedDateTime:", x.receivedDateTime);
					let idx = JobList.findIndex(a => a.joId == x.id);
					if (idx === -1) {
						JobList.push(job);
						//console.log("subject:" + x.subject);
						DicJobSubject[x.id] = `${x.subject}`;
					}

				});
				//console.log("JobList#mgt:", JobList);
				parseJobs(DicJobSubject);

				if (JobList.length > 0) {
					//console.log("enqIdList:", enqIdList);
					let joblist: IJob[] = [];
					//console.log("JobList#00:", JobList);
					JobList.forEach((x) => {
						if (!attdIdList.includes(x.joId)) {
							//console.log(x.joId);
							joblist.push(x);
						}
					});
					//console.log("joblist:", joblist);
					if (joblist.length > 0)
						saveJobs(joblist);
				}

				sortCol = 0;
			});

			GetJobs(pageIndex);
		}
	}

	if (fortraining) {
		//console.log("here");
		TrainingList = [];
		const trainingacc: string = $infoblk.data("trainingacc") as string;
		//console.log("trainingacc:", trainingacc);
		let mgtEmail = document.getElementById("mgt-email");
		
		//let _resource = resource.replace("{0}", `${strfrmdate}`).replace("{1}", `${strtodate}`).replace("{2}", trainingacc);
		let _resource = resource.replace("{0}", `${trainingacc}`);

		$("#mgt-email").attr("resource", _resource);

		if (mgtEmail) {
			mgtEmail.addEventListener("dataChange", (e: any) => {
				//console.log("e.detail.response:", e.detail.response);
				const response = e.detail.response;

				response.value.forEach((x) => {
					training = {
						id: "",
						trApplicant: "",
						trEmail: "",
						trId: x.id,
						receivedDateTime: x.receivedDateTime,
						receiveddate: getReceivedDate(x.receivedDateTime),
						trCompany: "",
						trIndustry: "",
						trAttendance: 0,
						trIsApproved: (x.subject as string).startsWith("[Confirmed]"),
						trReceivedDateTime: "",
						trPhone: "",
						strDate: "",
						trDate: null,
						DateDisplay: "",
						TotalRecord:0,
					};
					//console.log("receivedDateTime:", x.receivedDateTime);
					let idx = TrainingList.findIndex(a => a.trId == x.id);
					if (idx === -1) {
						TrainingList.push(training);
						//console.log("content:" + x.body.content);
						DicTrainingContent[x.id] = `${x.body.content}`;
					}

				});
				//console.log("TrainingList#mgt:", TrainingList);
				parseTrainings(DicTrainingContent);

				if (TrainingList.length > 0) {
					//console.log("enqIdList:", enqIdList);
					let traininglist: ITraining[] = [];
					//console.log("TrainingList#00:", TrainingList);
					TrainingList.forEach((x) => {
						if (!attdIdList.includes(x.trId)) {
							//console.log(x.joId);
							traininglist.push(x);
						}
					});
					//console.log("traininglist:", traininglist);
					if (traininglist.length > 0)
						saveTrainings(traininglist);
				}

				sortCol = 0;
			});

			GetTrainings(pageIndex);
		}
	}
}
$(document).on("change", ".todate", function () {
	$target = $(this);
	let todate = $target.val();
	//console.log($(this).val());
	let frmdate = $(".frmdate").first().val();
	//console.log(frmdate);
	if (frmdate! > todate!) {
		/*$(this).trigger("select").trigger("focus"); */
		//$("#proDateTo").datepicker("show");
		//setTimeout("$('#proDateTo').focus();", 320);//ok
		setTimeout(function () { $target.trigger("focus"); }, 320);
	}
});

// let jsdateformat: string = "dd/mm/yy";
const jsdateformat: string = "yy-mm-dd";
function getReceivedDate(receivedDateTime: string): string {
	return (receivedDateTime).split("T")[0].trim();
}

function initDatePicker(
	selector: string,
	date: Date = new Date(),
	showPastDates: boolean = true,
	format: string = "",
	setDate: boolean = true,
	showToday: boolean = false,
	isClass: boolean = false
) {
	/*console.log("here");*/
	if (format === "") format = jsdateformat;

	let $ele = isClass ? $(`.${selector}`) : $(`#${selector}`);

	$ele.datepicker({
		dateFormat: format,
		beforeShow: function () {
			setTimeout(function () {
				$(".ui-datepicker").css("z-index", 99999999999999);
			}, 0);
		},
	});

	if (setDate) {
		$ele.datepicker("setDate", date);
	}

	if (!showPastDates) {
		$ele.datepicker("option", {
			minDate: showToday ? new Date() : date,
			autoOpen: false,
		});
	}
}

$(document).on("change", ".gift", function () {
	if (Sales) {
		$(".makeorder").removeClass("disabled");
		Sales.rtsGiftOption = $(this).hasClass("driver") ? 1 : 2;
	}
});

let specialapproval: boolean = false;
let whatsapplnk: string = "https://api.whatsapp.com/send?phone={0}&text={1}";

function confirmConvertDate() {
	$target = convertDateModal.find("#txtConvertDate");
	if ($target.val() == "") {
		$.fancyConfirm({
			title: "",
			message: convertdaterequiredtxt,
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
		closeConvertDateModal();
		const convertdate: string = $target.val() as string;
		$target = $("#txtDeliveryDate");
		let deldate = new Date(convertdate);
		deldate.setDate(deldate.getDate() + 1);
		$target.datepicker("setDate", deldate);
		if (validSalesForm()) {
			_submitSales();
		}
	}
}

let frmsearch: boolean = false;
let frmlist: boolean = false;

$(document).on("click", ".respond", function () {
	if ($(this).hasClass("disabled")) return false;
	let type: string = $(this).data("type");

	if (forcustomer) {
		customerId = $(this).data("id") as number;
		selectedCus = initCustomer();
		selectedCus.cusCode = $(this).data("code");
		selectedCus.cusCustomerID = customerId;
		selectedCus.cusName = $(this).data("name");
	} else {
		if (!receiptno)
			receiptno = frmsearch
				? <string>$("#txtSearch").val()
				: $(this).data("code");
	}
	// console.log("receiptno:" + receiptno);
	// return false;
	if (type == "reject") {
		openTextAreaModal();
		$("#textareaModal").find("#lblField").text(rejectreasontxt);
	} else if (type == "void") {
		$.fancyConfirm({
			title: "",
			message: confirmvoidinvoicetxt,
			shownobtn: true,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$.fancyConfirm({
						title: "",
						message: recreateinvoice4voidtxt,
						shownobtn: true,
						okButton: oktxt,
						noButton: notxt,
						callback: function (value) {
							if (value) {
								recreateOnVoid = 1;
								//forwholesales = true;
							}
							respondReview(type);
							if (forcustomer) window.location.href = "/Customer/Index";
							if (forwholesales)
								window.location.href = "/WholeSales/SalesOrderList";
							if (forpurchase)
								window.location.href = "/Purchase/PurchaseOrderList";
						},
					});
				} else {
					$("#txtSearch").trigger("focus");
				}
			},
		});
	} else {
		respondReview(type);
		// if (forcustomer) window.location.href = "/Customer/Index";
		// if (forsales) window.location.href = "/WholeSales/SalesOrderList";
	}
});

let forsupplier: boolean = false;
let forenquiry: boolean = false;
let forattendance: boolean = false;
let forjob: boolean = false;
let fortraining: boolean = false;
let forcustomer: boolean = false;
let forrejectedcustomer: boolean = false;
let forapprovedcustomer: boolean = false;
$(document).on("click", ".whatspplink", function () {
	let msg: string = "";
	//console.log("forcustomer:" + forcustomer + ";forsales:" + forsales);
	//console.log("customerurl:" + $(this).data("customerurl"));

	if (forcustomer) {
		msg = requestapproval4customertxt;

		if (forrejectedcustomer) msg = rejectedcustomertxt;
		if (forapprovedcustomer) msg = approvedcustomertxt;

		msg = msg
			.replace("{0}", encodeURIComponent(selectedCus.cusName))
			.replace("{1}", $(this).data("customerurl"));
		if (forrejectedcustomer)
			msg = msg.replace("{2}", encodeURIComponent(rejectreason));
	} else {
		//console.log("salesurl:" + $(this).data("salesurl"));

		if (forsales) msg = requestapproval4invoicetxt;
		if (forrejectedinvoice) msg = rejectedinvoicetxt;
		if (forapprovedinvoice) msg = approvedinvoicetxt;
		if (forpassedtomanager) msg = passedinvoicetxt;

		msg = msg
			.replace("{0}", $(this).data("code"))
			.replace("{1}", $(this).data("salesurl"))
			.replace("{2}", encodeURIComponent(selectedCus.cusName));

		if (forrejectedinvoice) msg = msg.replace("{3}", rejectreason);
	}

	//https://api.whatsapp.com/send?phone={0}&amp;text={1}
	let whatsapplnk: string = decodeURIComponent(
		$infoblk.data("whatsapplinkurl") as string
	);
	whatsapplnk = whatsapplnk
		.replace("{0}", $(this).data("phone"))
		.replace("{1}", msg);

	if (enableWhatsappLnk) window.open(whatsapplnk, "_blank");
	closeWhatsappLinkModal();
});

function handleWhatsAppPhone(phone: string) {
	// console.log("original phone:" + phone);
	if (phone !== "") {
		const regex = new RegExp("^\\+{1}852\\d+|^852\\d+");
		if (!regex.test(phone)) {
			// console.log("phone before concat:" + phone);
			phone = "852".concat(phone);
			// console.log("phone after concat:" + phone);
		}
	}
	// console.log("phone to be returned:" + phone);
	return phone;
}

function respondReview(type) {
	openWaitingModal();
	if (forcustomer) {
		$.ajax({
			type: "POST",
			url: "/Api/RespondCustomerReview",
			data: {
				__RequestVerificationToken: $(
					"input[name=__RequestVerificationToken]"
				).val(),
				type,
				customerId,
				usercode: $infoblk.data("usercode"),
				rejectreason,
			},
			success: function (data) {
				closeWaitingModal();
				//console.log('datamsg:' + data.msg);
				//return false;
				if (data) {
					//let html: string = "";
					let msg: string = "";
					if (type == "approve") {
						forapprovedcustomer = true;
						msg = approvedcustomertxt;
					}
					if (type == "reject") {
						forrejectedcustomer = true;
						msg = rejectedcustomertxt;
					}
					//console.log("salesman:", data.salesman);
					//let e: ISalesman = data.salesman;
					//html = `<tr><td>${e.UserName}</td><td><button type="button" class="btn btn-primary whatspplink" data-code="" data-phone="" data-name="" data-customerurl="${data.url}">${sendtxt}</button></td></tr>`;
					if (enableWhatsappLnk) {
						msg = msg
							.replace("{0}", encodeURIComponent(data.customername))
							.replace("{1}", data.url);
						whatsapplnk = whatsapplnk
							.replace("{0}", handleWhatsAppPhone(data.adminphone))
							.replace("{1}", msg);
						window.open(whatsapplnk, "_blank");
					}

					window.location.href = "/Customer/Index";
				}
			},
			dataType: "json",
		});
	}
	if (forwholesales) {
		$.ajax({
			type: "POST",
			url: "/Api/RespondSalesOrderReview",
			data: {
				__RequestVerificationToken: $(
					"input[name=__RequestVerificationToken]"
				).val(),
				type,
				receiptno,
				usercode: $infoblk.data("usercode"),
				rejectreason,
				recreateOnVoid,
			},
			success: function (data) {
				closeWaitingModal();
				if (data) {
					selectedCus = data.customer;
					if (type == "approve") {
						forapprovedinvoice = true;
						$(".btnApprove").prop("disabled", true).off("click");
					}
					if (type == "reject") {
						forrejectedinvoice = true;
						$(".btnReject").prop("disabled", true).off("click");
					}
					if (type == "pass") {
						forpassedtomanager = true;
						$(".btnPass").prop("disabled", true).off("click");
					}
					if (type == "void") {
						$("#btnVoid").prop("disabled", true).off("click");
					}
					let phoneno: string = "";

					if (type == "void") {
						let admins: Array<ISalesman> = data.AdminList;
						phoneno = admins[0].Phone as string;
					} else {
						phoneno = data.salesman.Phone;
					}

					if (enableWhatsappLnk) {
						let msg: string = "";
						msg = requestapproval4invoicetxt;
						if (forrejectedinvoice) msg = rejectedinvoicetxt;
						if (forapprovedinvoice) msg = approvedinvoicetxt;
						if (forpassedtomanager) msg = passedinvoicetxt;

						msg = msg
							.replace("{0}", receiptno)
							.replace("{1}", data.url)
							.replace("{2}", encodeURIComponent(selectedCus.cusName));

						if (forrejectedinvoice)
							msg = msg.replace("{3}", encodeURIComponent(rejectreason));

						whatsapplnk = whatsapplnk
							.replace("{0}", handleWhatsAppPhone(phoneno))
							.replace("{1}", msg);
						window.open(whatsapplnk, "_blank");
					}

					window.location.href = "/WholeSales/SalesOrderList";

					//$("#txtSearch").trigger("focus");
				}
			},
			dataType: "json",
		});
	}
	if (forpurchase) {
		$.ajax({
			type: "POST",
			url: "/Api/RespondPurchaseOrderReview",
			data: {
				__RequestVerificationToken: $(
					"input[name=__RequestVerificationToken]"
				).val(),
				type,
				receiptno,
				usercode: $infoblk.data("usercode"),
				rejectreason,
				recreateOnVoid,
			},
			success: function (data) {
				closeWaitingModal();
				if (data) {
					SelectedSupplier = data.supplier;
					if (type == "approve") {
						forapprovedpo = true;
						$(".btnApprove").prop("disabled", true).off("click");
					}
					if (type == "reject") {
						forrejectedpo = true;
						$(".btnReject").prop("disabled", true).off("click");
					}
					if (type == "pass") {
						forpassedtomanager = true;
						$(".btnPass").prop("disabled", true).off("click");
					}
					if (type == "void") {
						$("#btnVoid").prop("disabled", true).off("click");
					}
					let phoneno: string = "";

					if (type == "void") {
						let admins: Array<ISalesman> = data.AdminList;
						phoneno = admins[0].Phone as string;
					} else {
						phoneno = data.salesman.Phone;
					}

					if (enableWhatsappLnk) {
						let msg: string = "";
						msg = requestapproval4potxt;
						if (forrejectedpo) msg = rejectedpotxt;
						if (forapprovedpo) msg = approvedpotxt;
						if (forpassedtomanager) msg = passedpotxt;

						msg = msg
							.replace("{0}", receiptno)
							.replace("{1}", data.url)
							.replace("{2}", encodeURIComponent(SelectedSupplier.supName));

						if (forrejectedinvoice)
							msg = msg.replace("{3}", encodeURIComponent(rejectreason));

						whatsapplnk = whatsapplnk
							.replace("{0}", handleWhatsAppPhone(phoneno))
							.replace("{1}", msg);
						window.open(whatsapplnk, "_blank");
					}
					window.location.href = "/Purchase/PurchaseOrderList";
				}
			},
			dataType: "json",
		});
	}
}

function submitSimpleSales() {
	updateSimpleSales();
	_submitSimpleSales();
}
function submitSales() {

	if (forsales) {
		updateSales();
		Sales.Roundings = isNumeric(Sales.Roundings) ? Sales.Roundings : 0;
		if (validSalesForm()) {
			_submitSales();
		}
	}
	if (forpreorder) {
		if (!editmode) updatePreSales();
		if (validSalesForm()) {
			//console.log("here");
			_submitSales();
		}
	}
}

function _submitSimpleSales() {
	let url = "/POSFunc/ProcessSales";

	let data = { Sales, SimpleSalesLns, Payments };
	//console.log("data:", data);
	//return false;
	openWaitingModal();
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		success: function (data) {
			closeWaitingModal();
			const salescode = data.finalsalescode!;
			printurl += "?issales=1&salesrefundcode=" + salescode;

			if (typeof data.epaystatus === "undefined") {
				if (data.msg === "") {
					window.open(printurl);
					if (forsimplesales)
						window.location.reload();
					if (forpreorder)
						window.location.href = "/Preorder/Index";
				}
			} else {
				//console.log('epaystatus:' + data.epaystatus);
				if (data.epaystatus == 1) {
					$.fancyConfirm({
						title: "",
						message: data.msg,
						shownobtn: false,
						okButton: oktxt,
						noButton: notxt,
						callback: function (value) {
							if (value) {
								//if (data.zerostockItemcodes !== "") {
								//	handleOutOfStocks(data.zerostockItemcodes);
								//} else {
									window.open(printurl);
									window.location.reload();
								//}
							}
						},
					});
				}
				else {
					if (data.epaystatus == -1) {
						//needquery_userpaying
						openPayModal();
						$("#transactionEpay").removeClass("isDisabled"); //activate the link
						selectedSalesCode = salescode;
						//setTimeout(function () {
						//    handleTransactionResult(data.salescode);
						//}, 15000); //reverse payment after payment api called for 15s.
					} else {
						setTimeout(function () {
							handleReversePayment(salescode);
						}, 15000); //reverse payment after payment api called for 15s.
					}
				}
			}
		},
		dataType: "json",
	});
}
function _submitSales() {
	let url = "";
	if (forsales) {
		url = "/POSFunc/ProcessAdvSales";
		Sales.rtsCusID = selectedCus.cusCustomerID;
		Sales.rtsRmks = $("#txtNotes").val() as string;
		Sales.rtsInternalRmks = $("#txtInternalNotes").val() as string;
		Sales.authcode = authcode;
		// Sale.deliveryAddressId = deliveryAddressId;
		Sales.ireviewmode = reviewmode ? 1 : 0;
		Sales.salescode = receiptno ?? $(".NextSalesInvoice").first().val();
		Sales.selectedPosSalesmanCode = selectedPosSalesmanCode;
		// Sale.CustomerPO = $("#txtCustomerPO").val() as string;
		// Sale.DeliveryDate = $("#txtDeliveryDate").val() as string;
		Sales.rtsCurrency = $("#rtsCurrency").val() as string;
		Sales.rtsExRate = exRate;
		Sales.rtsSalesLoc = $("#drpLocation").val() as string;
		Sales.rtsDvc = $("#drpDevice").val() as string;
		Sales.rtsAllLoc = $("#chkAllLoc").is(":checked");
	}
	if (forpreorder) {
		url = "/Preorder/Edit";
		PreSales.rtsCusID = selectedCus.cusCustomerID;
		PreSales.rtsRmks = $("#txtNotes").val() as string;
		PreSales.rtsInternalRmks = $("#txtInternalNotes").val() as string;
		PreSales.authcode = authcode;
		PreSales.salescode = receiptno ?? $(".NextSalesInvoice").first().val();
		PreSales.rtsCurrency = $("#rtsCurrency").val() as string;
		PreSales.rtsExRate = exRate;
		PreSales.rtsSalesLoc = $("#drpLocation").val() as string;
		PreSales.rtsDvc = $("#drpDevice").val() as string;
		PreSales.rtsAllLoc = $("#chkAllLoc").is(":checked");
	}

	let data = forpreorder
		? { PreSales, PreSalesLnList, Payments, DeliveryItems }
		: { Sales, SalesLnList, Payments, DeliveryItems };
	console.log("data:", data);
	//return false;

	openWaitingModal();
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		success: function (data) {
			closeWaitingModal();
			const salescode = data.finalsalescode!;
			printurl += "?issales=1&salesrefundcode=" + salescode;

			if (typeof data.epaystatus === "undefined") {
				if (data.msg === "") {
					window.open(printurl);
					if (forsales)
						window.location.reload();
					if (forpreorder)
						window.location.href = "/Preorder/Index";
				}
			} else {
				//console.log('epaystatus:' + data.epaystatus);
				if (data.epaystatus == 1) {
					$.fancyConfirm({
						title: "",
						message: data.msg,
						shownobtn: false,
						okButton: oktxt,
						noButton: notxt,
						callback: function (value) {
							if (value) {
								//if (data.zerostockItemcodes !== "") {
								//	handleOutOfStocks(data.zerostockItemcodes);
								//} else {
									window.open(printurl);
									window.location.reload();
								//}
							}
						},
					});
				} else {
					if (data.epaystatus == -1) {
						//needquery_userpaying
						openPayModal();
						$("#transactionEpay").removeClass("isDisabled"); //activate the link
						selectedSalesCode = salescode;
						//setTimeout(function () {
						//    handleTransactionResult(data.salescode);
						//}, 15000); //reverse payment after payment api called for 15s.
					} else {
						setTimeout(function () {
							handleReversePayment(salescode);
						}, 15000); //reverse payment after payment api called for 15s.
					}
				}
			}
		},
		dataType: "json",
	});
}
function validSalesForm(): boolean {
	var msg = "";
	if (forsales && (!SalesLnList || SalesLnList!.length === 0))
		msg += `${salesinfonotenough}<br>`;
	if (forpreorder && (!PreSalesLnList || PreSalesLnList!.length === 0))
		msg += `${salesinfonotenough}<br>`;

	if ($(`#${gTblName} .focus`).length > 0) {
		msg += `${salesinfonotenough}<br>`;
	}
	if (msg !== "") {
		$.fancyConfirm({
			title: "",
			message: msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(".focus").eq(0).trigger("focus");
				}
			},
		});
	}

	return msg === "";
}

$(document).on("change", "#drpDeliveryAddr", function () {
	deliveryAddressId = <number>$(this).val();
});

function handleRecurOrderList(this: any) {
	closeRecurOrderModal();
	let orderId: number = $(this).data("orderid");
	selectedRecurCode = <string>$(this).data("code");
	$.ajax({
		type: "GET",
		url: "/Api/GetRecurOrder",
		data: { orderId },
		success: function (data) {
			let ws = data.sales as IWholeSale;
			//console.log("recurorder data:", data);
			Wholesales = fillInWholeSale();
			Wholesales.wsCode = ws.wsCode;
			Wholesales.wsCusID = ws.wsCusID;
			Wholesales.wsDvc = ws.wsDvc;
			Wholesales.wsSalesLoc = ws.wsSalesLoc;
			Wholesales.wsRefCode = ws.wsRefCode;
			Wholesales.wsAllLoc = ws.wsAllLoc;

			Wholesales.wsDeliveryAddressId = ws.wsDeliveryAddressId;

			Wholesales.wsCustomerPO = ws.wsCustomerPO;
			$("#txtCustomerPO").val(Wholesales.wsCustomerPO);
			// console.log("data customer#orderid:", data.Customer);
			selectedCus = initCustomer();
			selectedCus.cusCustomerID = ws.Customer.cusCustomerID;
			selectedCus.cusName = ws.Customer.cusName;
			selectedCus.cusPhone = ws.Customer.cusPhone;
			selectedCus.cusPriceLevelID = ws.Customer.cusPriceLevelID;
			selectedCus.cusPointsSoFar = ws.Customer.cusPointsSoFar;
			selectedCus.cusPointsUsed = ws.Customer.cusPointsUsed;
			selectedCus.PointsActive = ws.Customer.PointsActive;
			selectedCus.cusPriceLevelDescription =
				ws.Customer.cusPriceLevelDescription;
			selectedCus.AddressList = ws.Customer.AddressList;
			selectedCus.cusCode = ws.Customer.cusCode;
			// console.log("cuscode:" + selectedCus.cusCode);
			selectCus();

			currentY = 0;
			$.each(data.wslns as IWholeSalesLn[], function (i, e) {
				seq = currentY + 1;
				selectedItemCode = e.wslItemCode;
				selectedItem = initItem();
				selectedItem.itmCode = selectedItemCode;
				selectedItem.itmDesc = e.Item.itmDesc;
				selectedItem.itmName = e.Item.itmName;
				selectedItem.itmUseDesc = e.Item.itmUseDesc;
				selectedItem.itmBaseSellingPrice = e.Item.itmBaseSellingPrice;
				selectedItem.itmBaseUnitPrice = e.Item.itmBaseUnitPrice;
				selectedItem.itmSellUnit = e.Item.itmSellUnit;
				selectedItem.NameDesc = e.Item.NameDesc;
				selectedWholesalesLn = structuredClone(e);
				populateItemRow();
				currentY++;
			});
		},
		dataType: "json",
	});
}

function calculateSum(array: Array<any>, property: any) {
	const total = array.reduce((accumulator, object) => {
		return accumulator + object[property];
	}, 0);
	return total;
}

function getSalesLnAmt(
	qty: number,
	price: number,
	discpc: number,
	taxamt: number
): number {
	return qty * price * (1 - discpc) + taxamt;
}

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
//return Json(new { msg, status, phone, salescode, reviewurl });
function handleApprovalMode4Sales(data: ISalesReturnMsg) {
	if (enableWhatsappLnk) {
		var msg = requestapproval4invoicetxt; //訂單 {0} (顧客 {2} ) 正在等待您的批准 ({3})。這裡是鏈接 {1}。
		let remark: string = "";
		remark += `;商品行:${data.saleslnlength}`;

		msg = msg
			.replace("{0}", data.salescode ?? "")
			.replace("{1}", data.reviewurl ?? "")
			.replace("{2}", encodeURIComponent(data.cusname ?? ""))
			.replace("{3}", encodeURIComponent(remark));
		// const phoneno: string = specialapproval ? "85261877187" : "85264622867";

		let whatsapplnk: string = decodeURIComponent(
			$infoblk.data("whatsapplinkurl") as string
		);
		whatsapplnk = whatsapplnk
			.replace("{0}", handleWhatsAppPhone(data.adminphone ?? ""))
			.replace("{1}", msg);
		window.open(whatsapplnk, "_blank");
	}

	window.location.href = "/WholeSales/Edit/0?type=order";
}
function handleApprovalMode4Purchase(data: IPurchaseReturnMsg) {
	if (enableWhatsappLnk) {
		var msg = requestapproval4invoicetxt; //訂單 {0} (顧客 {2} ) 正在等待您的批准 ({3})。這裡是鏈接 {1}。
		let remark: string = "";
		remark += `;商品行:${data.purchaselnlength}`;

		msg = msg
			.replace("{0}", data.purchasecode ?? "")
			.replace("{1}", data.reviewurl ?? "")
			.replace("{2}", encodeURIComponent(data.supname ?? ""))
			.replace("{3}", encodeURIComponent(remark));
		// const phoneno: string = specialapproval ? "85261877187" : "85264622867";

		let whatsapplnk: string = decodeURIComponent(
			$infoblk.data("whatsapplinkurl") as string
		);
		whatsapplnk = whatsapplnk
			.replace("{0}", handleWhatsAppPhone(data.adminphone ?? ""))
			.replace("{1}", msg);
		window.open(whatsapplnk, "_blank");
	}
	window.location.href = "/Purchase/Edit/0?type=order";
}
//A function for formatting a date to yyMMdd
function formatDate(d: Date = new Date(), delimeter: string = "-") {
	//get the month
	//var _month = d.getMonth();
	////get the day
	////convert day to string
	//var day = d.getDate().toString().padStart(2, "0");
	////get the year
	//var _year = d.getFullYear();

	////pull the last two digits of the year
	//const year: string = delimeter === "" ? _year.toString().substring(2) : _year.toString();

	////increment month by 1 since it is 0 indexed
	////converts month to a string
	//const month: string = (_month + 1).toString().padStart(2, "0");

	////return the string "MMddyy"
	//return delimeter === "" ? year + month + day : year + delimeter + month + delimeter + day;
	return strftime(`%Y${delimeter}%m${delimeter}%d`, d);
}
function formatDateTime(d: Date = new Date(), delimeter: string = "-"): string {
	//var _h = d.getHours();
	//var _m = d.getMinutes();
	//var _s = d.getSeconds();
	return strftime(`%Y${delimeter}%m${delimeter}%d ${formatTime(d)}`, d);
}

function formatTime(d: Date = new Date()) {
	return strftime(`%H:%M:%S`, d);
}

let editapproved: boolean = false;
let searchmodes: string = "";
let searchmodelist: string[] =
	$("#searchmode").length && $("#searchmode").val() !== ""
		? ($("#searchmode").val() as string).split(",")
		: [];
let _attrmode: boolean = false;

let currkeys: string[] = []; // ["USD", "CNY", "EUR", "MOP"];
function GetForeignCurrencyFrmCode(cardCode: string): string {
	currkeys = Object.keys(DicCurrencyExRate);
	let currcode = "HKD";
	// console.log("currkeys:", currkeys);
	if (cardCode.length >= 6 && cardCode.startsWith("CAS", 0)) {
		const _currcode = cardCode.substring(3, 6).toUpperCase();
		if (currkeys.includes(_currcode)) currcode = _currcode;
	}
	return currcode;
}

$(document).on("change", "#cusCountry", function () {
	$("#cusAddrCountry").val($(this).val() as string);
});

function fillInCities() {
	var regionfile = approvalmode
		? "/Api/GetCitiesFrmMyobCustomList"
		: "/scripts/hongkong_regions.json";
	$.ajax({
		type: "GET",
		url: regionfile,
		data: {},
		success: function (data) {
			let html = "<option value=''>---</option>";
			//console.log(data.data);
			// console.log("customer city:" + customer.cusAddrCity);
			if (approvalmode) {
				data.map((d: any) => {
					//   console.log(d[1]);
					const region = d.Name;
					const selected = region == customer.cusAddrCity ? "selected" : "";
					html += `<option value="${region}" ${selected}>${region}</option>`;
				});
			} else {
				data.data.map((d: string[]) => {
					//   console.log(d[1]);
					const region = d[1];
					const selected = region == customer.cusAddrCity ? "selected" : "";
					html += `<option value="${region}" ${selected}>${region}</option>`;
				});
			}
			// $.each(data, function (i, e) {});
			_fillInCity(html);
		},
		dataType: "json",
	});
}

function _fillInCity(html: string) {
	$("#drpCity").empty().append(html);
	$("#drpCity").val(customer.cusAddrCity);
}
$(document).on("change", "#drpCity", function () {
	$("#cusAddrCity").val($(this).val() as string);
});
$(document).on("dblclick", ".orderId", function () {
	handleRecurOrderList.call(this);
});
let useForexAPI: boolean = false;
let codelist: string[] = [];

$(document).on("change", "#chkAllLoc", function () {
	if ($(this).is(":checked")) {
		const location = $("#drpLocation").val() as string;
		$(`#${gTblName} tbody tr`)
			.find("td")
			.find(".location")
			.val(location)
			.addClass("disabled")
			.prop("disabled", true);
	} else {
		$(`#${gTblName} tbody tr`)
			.find("td")
			.find(".location")
			.removeClass("disabled")
			.prop("disabled", false);
	}
});
function formatexrate(exrate: string): string {
	return Number.parseFloat(exrate).toFixed(6);
}
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

$(document).on("click", "#btnFile", function () {
	openUploadFileModal();
});

$(document).on("click", "#btnViewFile", function () {
	openViewFileModal();
});
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
function initJournalLnPair(journalno: string) {
	//console.log("currentY#initpair:" + currentY);
	if (currentY % 2 == 0) {
		selectedJournalLn1 = {} as IJournalLn;
		selectedJournalLn1.JournalNumber = journalno;
		selectedJournalLn1.Seq = currentY + 1;
		selectedJournalLn1.AccountNumber = "";
		selectedJournalLn1.AccountName = "";
		selectedJournalLn1.DebitExTaxAmount = 0;
		selectedJournalLn1.CreditExTaxAmount = 0;

		selectedJournalLn2 = {} as IJournalLn;
		selectedJournalLn2.JournalNumber = journalno;
		selectedJournalLn2.Seq = currentY + 2;
		selectedJournalLn2.AccountNumber = "";
		selectedJournalLn2.AccountName = "";
		selectedJournalLn2.DebitExTaxAmount = 0;
		selectedJournalLn2.CreditExTaxAmount = 0;
	}
}
function filterEnquiry(smail: string): boolean {
	//no-reply@hkdigitalsale.com
	//console.log(";smail:" + smail);
	//const bok1 = /^((?!reply)[\s\S])*$/i.test(fmail);
	const bok2 = smail == "autoreply@united.com.hk";
	//console.log("bok2:", bok2);
	//return bok1&&bok2;
	return bok2;
}

function parseEnquiries(DicEnqContent) {
	//console.log('contents:' + contents);
	let regex =
		/.+(From\:[^\<]+).+(Subject\:[^\<]*).+(Company\:[^\<]*).+(Contact Person\:[^\<]*).+(Email\:[^\<]*)\<br\>(Phone\:[^\<]*)?.+(ReceivedDateTime\:[^\<]*)/gim;
	enquiries = [];
	for (const [key, value] of Object.entries(DicEnqContent)) {
		//console.log(value);
		let found = (value as string).matchAll(regex);
		//console.log('found:', found);
		//return false;
		if (found) {
			enquiry = {} as IEnquiry;
			enquiry.id = key;
			for (const m of found) {
				const from = m[1].split(":")[1].trim();

				enquiry.from = parseEmailInString(from, key);
				enquiry.subject = m[2].split(":")[1].trim();
				enquiry.company = m[3].split(":")[1].trim();
				enquiry.contact = m[4].split(":")[1].trim();
				enquiry.email = m[5].split(":")[1].trim();
				enquiry.phone =
					typeof m[6] != "undefined" ? m[6].split(":")[1].trim() : "N/A";
				enquiry.receivedDateTime = m[7].replace("ReceivedDateTime:", "");
				enquiry.receiveddate = m[7].split(":")[1].slice(0, -3).trim();
				enquiry.SalesPersonName = "N/A";
				enquiries.push(enquiry);
			}
		}
	}

	if (enquiries.length > 0) {
		/*  if (EnquiryList.length > 0) {*/
		EnquiryList.forEach((x) => {
			var enquiry = enquiries.find((y) => y.id == x.id);
			//console.log("enquiry:", enquiry);
			if (enquiry) {
				x.from = enquiry.from;
				x.subject = enquiry.subject;
				x.email = enquiry.email;
				x.phone = enquiry.phone;
				x.company = enquiry.company;
				x.contact = enquiry.contact;
				x.receivedDateTime = enquiry.receivedDateTime;
				x.receiveddate = enquiry.receiveddate;
			}
		});
		//} else {
		//    EnquiryList = enquiries.slice(0);
		//}
	}
}

function parseJobs(DicJobSubject) {
	//Late arrival report- Testing arrived at 11:38 ReceivedDateTime:2023-11-13T03:39:04Z
	let regex =
		/([^\-]+)(\-+)(.+)(\s+)(\d+\/+\d+\/+\d+)(\s+)(\d+\:+\d+\s+\-+\s+\d+\:+\d+)/gmi;

	for (const [key, value] of Object.entries(DicJobSubject)) {
		let found = (value as string).matchAll(regex);
		if (found) {
			JobList.forEach((x) => {
				if (x.joId == key) {
					for (const m of found) {
						x.joClient = m[3].trim();
						x.joTime = m[7].trim();
					}
				}
			});
		}
	}
	//console.log("JobList#parse:", JobList);
}

function parseTrainings(DicTrainingContent) {
	/*
	<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></head><body><p><span style=\"font-family:verdana\">Dear </span><span style=\"font-family:verdana\">Fanny Chow</span><span style=\"font-family:verdana\">,<br><br>Thank you for register abss Accounting Software Getting Start Training Course.<br><br>Please find your course details as below:<br>Company: </span><span style=\"font-family:verdana\">Sense-Ware Asia Limited</span><span style=\"font-family:verdana\"><br>Name: </span><span style=\"font-family:verdana\">Fanny Chow</span><span style=\"font-family:verdana\"><br>Industry: </span><span style=\"font-family:verdana\">trading</span><span style=\"font-family:verdana\"><br>Attendance: </span><span style=\"font-family:verdana\">1</span><span style=\"font-family:verdana\"><br>Date: </span><span style=\"font-family:verdana\">2023-11-15</span><span style=\"font-family:verdana\"><br>Time: 9:30 am - 11:30 am (After 11:30 am is Q&amp;A session)<br>Address: Unit 1501, Westlands Center, 20 Westlands Road, Quarry Bay<br><br>Chinese/English notes provided<br><br><br>感謝您註冊 abss 會計軟件入門培訓課程。<br><br>請找到您的課程詳細信息，如下所示：<br>公司: </span><span style=\"font-family:verdana\">Sense-Ware Asia Limited</span><span style=\"font-family:verdana\"><br>名稱: </span><span style=\"font-family:verdana\">Fanny Chow</span><span style=\"font-family:verdana\"><br>行業: </span><span style=\"font-family:verdana\">trading</span><span style=\"font-family:verdana\"><br>出席人數: </span><span style=\"font-family:verdana\">1</span><span style=\"font-family:verdana\"><br>出席日期: </span><span style=\"font-family:verdana\">2023-11-15</span><span style=\"font-family:verdana\"><br>時間: 早上 9:30 至 11:30 (之後 Q&amp;A 為問答環節)<br>地址: 鰂魚涌華蘭路20號華蘭中心15樓1501室<br><br>附送中文/英文筆記<br><br><br><br>United Technologies (Int'l) Ltd.<br>ABSS Hong Kong and Macau Official Technical Service Provider<br>聯訊科技 (國際) 有限公司<br>ABSS 香港及澳門官方指定技術服務供應商<br><br>Email: enquiry@united.com.hk<br>Web: https://united.com.hk<br>Phone: (852) 2960 1002</span></p></body></html>
	*/
	let regex =
		/Company\:[^\<]+\<+[^\>]+\>+[^\>]+\>+([^\<]+)\<+[^\>]+\>+[^\>]+\>+[^\>]+\>+Name\:[^\>]+\>+[^\>]+\>([^\<]+)[^\>]+\>+[^\>]+\>+[^\>]+\>+Industry\:[^\>]+\>+[^\>]+\>+([^\<]+)[^\>]+\>+[^\>]+\>+[^\>]+\>+Attendance\:[^\>]+\>+[^\>]+\>+([^\<]+)[^\>]+\>+[^\>]+\>+[^\>]+\>+Date\:[^\>]+\>+[^\>]+\>+([^\<]+)[^\>]+\>+[^\>]+\>+[^\>]+\>+Time\:([^\(]+)[^\>]+\>+/gmi;

	for (const [key, value] of Object.entries(DicTrainingContent)) {
		let found = (value as string).matchAll(regex);
		if (found) {
			TrainingList.forEach((x) => {
				if (x.trId == key) {
					for (const m of found) {
						x.trCompany = m[1].trim();
						x.trApplicant = m[2].trim();
						x.trIndustry = m[3].trim();
						x.trAttendance = Number(m[4]);
						x.strDate = m[5].trim();
					}
				}
			});
		}
	}
	//console.log("TrainingList#parse:", TrainingList);
}

function parseAttendances(DicAttdSubject) {
	//Late arrival report- Testing arrived at 11:38
	let regex =
		/[^\-]+\-+\s+(.+)\s+arrived\s+at\s+(.+)/gmi;
	for (const [key, value] of Object.entries(DicAttdSubject)) {
		//console.log(value);
		let found = (value as string).matchAll(regex);
		if (found) {
			AttendanceList.forEach((x) => {
				if (x.saId == key) {
					for (const m of found) {
						x.saName = m[1].trim();
						x.saCheckInTime = m[2].trim();
					}
				}
			});
		}
	}
}
function openEnqMail(ele) {
	window.location.href = "mailto:" + $(ele).data("mailto");
}
function parseEmailInString(text, Id): string {
	//console.log("text#0:" + text);
	let stremail = text;
	text = text.replace("&lt;", "<").replace("&gt;", ">");
	//console.log("text#1:" + text);
	var re =
		/(.+)([^\<]+)(\<+)(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))(@)((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))(\>+)/;
	let found = text.match(re);
	//console.log("found:", found);
	if (found) {
		const mailto = `${found[5]}${found[8]}${found[9]}`;
		stremail = `<a onclick="event.stopPropagation();" href="/Enquiry/Edit?Id=${Id}" data-mailto="${mailto}">${found[1]}</a>`;
	}
	return stremail;
}

/* Port of strftime(). Compatibility notes:
 *
 * %c - formatted string is slightly different
 * %D - not implemented (use "%m/%d/%y" or "%d/%m/%y")
 * %e - space is not added
 * %E - not implemented
 * %h - not implemented (use "%b")
 * %k - space is not added
 * %n - not implemented (use "\n")
 * %O - not implemented
 * %r - not implemented (use "%I:%M:%S %p")
 * %R - not implemented (use "%H:%M")
 * %t - not implemented (use "\t")
 * %T - not implemented (use "%H:%M:%S")
 * %U - not implemented
 * %W - not implemented
 * %+ - not implemented
 * %% - not implemented (use "%")
 *
 * strftime() reference:
 * http://man7.org/linux/man-pages/man3/strftime.3.html
 *
 * Day of year (%j) code based on Joe Orost's answer:
 * http://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
 *
 * Week number (%V) code based on Taco van den Broek's prototype:
 * http://techblog.procurios.nl/k/news/view/33796/14863/calculate-iso-8601-week-and-year-in-javascript.html
 */
function strftime(sFormat, date) {
	if (!(date instanceof Date)) date = new Date();
	var nDay = date.getDay(),
		nDate = date.getDate(),
		nMonth = date.getMonth(),
		nYear = date.getFullYear(),
		nHour = date.getHours(),
		aDays = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		],
		aMonths = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		],
		aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
		isLeapYear = function () {
			return (nYear % 4 === 0 && nYear % 100 !== 0) || nYear % 400 === 0;
		},
		getThursday = function () {
			var target = new Date(date);
			target.setDate(nDate - ((nDay + 6) % 7) + 3);
			return target;
		},
		zeroPad = function (nNum, nPad) {
			return ("" + (Math.pow(10, nPad) + nNum)).slice(1);
		};
	return sFormat.replace(/%[a-z]/gi, function (sMatch) {
		return (
			{
				"%a": aDays[nDay].slice(0, 3),
				"%A": aDays[nDay],
				"%b": aMonths[nMonth].slice(0, 3),
				"%B": aMonths[nMonth],
				"%c": date.toUTCString(),
				"%C": Math.floor(nYear / 100),
				"%d": zeroPad(nDate, 2),
				"%e": nDate,
				"%F": date.toISOString().slice(0, 10),
				"%G": getThursday().getFullYear(),
				"%g": ("" + getThursday().getFullYear()).slice(2),
				"%H": zeroPad(nHour, 2),
				"%I": zeroPad(((nHour + 11) % 12) + 1, 2),
				"%j": zeroPad(
					aDayCount[nMonth] + nDate + (nMonth > 1 && isLeapYear() ? 1 : 0),
					3
				),
				"%k": "" + nHour,
				"%l": ((nHour + 11) % 12) + 1,
				"%m": zeroPad(nMonth + 1, 2),
				"%M": zeroPad(date.getMinutes(), 2),
				"%p": nHour < 12 ? "AM" : "PM",
				"%P": nHour < 12 ? "am" : "pm",
				"%s": Math.round(date.getTime() / 1000),
				"%S": zeroPad(date.getSeconds(), 2),
				"%u": nDay || 7,
				"%V": (function () {
					const target: any = getThursday();
					const n1stThu = target.valueOf();
					target.setMonth(0, 1);
					var nJan1 = target.getDay();
					if (nJan1 !== 4) target.setMonth(0, 1 + ((4 - nJan1 + 7) % 7));
					return zeroPad(1 + Math.ceil((n1stThu - target) / 604800000), 2);
				})(),
				"%w": "" + nDay,
				"%x": date.toLocaleDateString(),
				"%X": date.toLocaleTimeString(),
				"%y": ("" + nYear).slice(2),
				"%Y": nYear,
				"%z": date.toTimeString().replace(/.+GMT([+-]\d+).+/, "$1"),
				"%Z": date.toTimeString().replace(/.+\((.+?)\)$/, "$1"),
			}[sMatch] || sMatch
		);
	});
}

$(document).on("click", ".dropdown-item", function () {
	//e.preventDefault();
	//console.log($(this).attr("href"));
	window.location.href = $(this).attr("href") as string;
});

let todayEnquiries: IEnquiry[] = [];
let oldestEnquiries: IEnquiry[] = [];

//handle #drpCustomer/#drpSupplier change as well
$(document).on("change", ".form-control.card", function () {
	const cardcode = GetForeignCurrencyFrmCode($(this).val() as string);
	//console.log(cardcode);
	//$(".exrate").val(cardcode).trigger("change");
	$(".exrate").val(cardcode);
	handleExRateChange(cardcode, false);
});

let daterangechange: boolean = false;
$(document).on("change", ".range", function () {
	daterangechange = true;
});

function handleAssign(salespersonId: number | null) {
	$.ajax({
		type: "GET",
		url: "/Api/GetSalesInfo",
		data: {},
		success: function (data) {
			//console.log(data);
			if (data.length > 0) {
				openSalesmenModal();
				let html = "";
				$.each(data, function (i, e: ICrmUser) {
					let uname = e.UserName;
					let email = formatEmail(e.Email, e.UserName) ?? "N/A";
					let notes = e.surNotes ?? "N/A";
					if (salespersonId != null && salespersonId == e.surUID) {
						html += `<tr data-Id="${e.surUID}" class="selected"><td>${uname}</td><td>${email}</td><td>${notes}</td><td><span class="small">${e.ModifyTimeDisplay}</span></td></tr>`;
					} else {
						html += `<tr data-Id="${e.surUID}" class="pointer" ondblclick="assignSave(${e.surUID});"><td>${uname}</td><td>${email}</td><td>${notes}</td><td><span class="small">${e.ModifyTimeDisplay}</span></td></tr>`;
					}
				});
				$target = $("#tblsalesmen tbody");
				$target.empty().html(html);
			}
		},
		dataType: "json",
	});
}

let trainingIdList: string[] = [];
let jobIdList: string[] = [];
let attdIdList: string[] = [];
let enqIdList: string[] = [];
let assignEnqIdList: string[] = [];
function assignSave(salesmanId: number) {
	closeSalesmenModal();

	//sendmail4assignmentprompt
	$.fancyConfirm({
		title: "",
		message: sendmail4assignmentprompt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			$.ajax({
				type: "POST",
				url: "/Enquiry/Assign",
				data: {
					__RequestVerificationToken: $(
						"input[name=__RequestVerificationToken]"
					).val(),
					assignEnqIdList,
					salesmanId,
					notification: value ? 1 : 0,
				},
				success: function (data) {
					if (data) {
						$.fancyConfirm({
							title: "",
							message: data.msg,
							shownobtn: false,
							okButton: oktxt,
							noButton: notxt,
							callback: function (value) {
								if (value) {
									window.location.reload();
								}
							},
						});
					}
				},
				dataType: "json",
			});
		},
	});
}

let DicIDItemOptions: { [Key: number]: IItemOptions };

let chkSN: boolean = false;
let chkBat: boolean = false;
let chkVT: boolean = false;
$(document).on("change", ".itemoption", function () {
	/* if ($(this).is(":checked")) {*/
	if ($(this).val() === "bat") chkBat = $(this).is(":checked");
	if ($(this).val() === "sn") chkSN = $(this).is(":checked");
	if ($(this).val() === "vt") chkVT = $(this).is(":checked");
	/* } else {*/
	//if ($(this).val() === "bat") chkBat = true;
	//if ($(this).val() === "sn") chkSN = true;
	//if ($(this).val() === "vt") chkVT = true;
	/* }*/
	//if ($("#btnSaveItemOptions").length) {
	//    if ((chkBat || chkSN || chkVT) && IdList.length>0) $("#btnSaveItemOptions").addClass("pointer");
	//    else $("#btnSaveItemOptions").removeClass("pointer");
	//}
});

interface IItemOptionsModel extends IItemOptions {
	itemId: number;
}
$(document).on("click", "#btnSaveItemOptions", function () {
	if (IdList.length > 0 && (chkBat || chkSN || chkVT)) {
		/*//console.log('gonna save');*/
		let model: IItemOptionsModel[] = [];
		IdList.forEach((x) => {
			model.push({
				itemId: x,
				ChkBatch: chkBat,
				ChkSN: chkSN,
				WillExpire: chkVT,
				Disabled: false,
			});
		});
		//console.log("model:", model);
		//return;
		$.ajax({
			//contentType: 'application/json; charset=utf-8',
			type: "POST",
			url: "/Item/SaveItemOptions",
			data: {
				__RequestVerificationToken: $(
					"input[name=__RequestVerificationToken]"
				).val(),
				model,
			},
			success: function (data) {
				if (data) {
					window.location.href = "/Item/Stock";
				}
			},
			dataType: "json",
		});
	}
});

function removeAnchorTag(str: string): string {
	return str.replace(/<\/?a[^>]*>/g, "");
}

function makeId(length) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

const endsWithNumber = (text) => {
	return /\d$/.test(text);
};

$(document).on("click", ".fa-close.record", function () {
	$target = $(this).parent("div").parent(".card").parent(".displayblk");
	let model: ICustomerInfo = {
		Id: Number($target.data("id")),
		cusId,
	} as ICustomerInfo;
	$.ajax({
		//contentType: 'application/json; charset=utf-8',
		type: "POST",
		url: "/Customer/DeleteRecord",
		data: {
			__RequestVerificationToken: $(
				"input[name=__RequestVerificationToken]"
			).val(),
			model,
		},
		success: function (data) {
			if (data) $target.remove();
		},
		dataType: "json",
	});
});

function handleRecordChange(ele) {
	let $entry = $(ele);
	//console.log("entry:", $entry.val());
	$target = $entry.parent(".txtarea");
	let record: string = $entry.val() as string;
	//console.log("record:", record);
	$entry.addClass("hide");
	if (record) {
		let customerInfo: ICustomerInfo = {} as ICustomerInfo;
		let enquiryInfo: IEnquiryInfo = {} as IEnquiryInfo;
		let url: string = "";
		let data: any = {
			__RequestVerificationToken: $(
				"input[name=__RequestVerificationToken]"
			).val(),
		};
		if (forcustomer) {
			customerInfo = {
				Id: Number($target.data("id")),
				followUpRecord: record,
			} as ICustomerInfo;
			url = "/Customer/EditRecord";
			data.model = customerInfo;
		}
		if (forenquiry) {
			enquiryInfo = {
				Id: $target.data("id").toString(),
				followUpRecord: record,
			} as IEnquiryInfo;
			url = "/Enquiry/EditRecord";
			data.model = enquiryInfo;
		}
		//console.log("data:", data);
		//return;
		$.ajax({
			//contentType: 'application/json; charset=utf-8',
			type: "POST",
			url: url,
			data: data,
			success: function (data: IInfoBase) {
				console.log("data:", data);
				if (data) {
					$target.find("p").text(data.followUpRecord!).show();
					$target
						.find("span")
						.text(
							lasteditedbyformat
								.replace("{0}", data.ModifiedBy!)
								.replace("{1}", data.ModifyTimeDisplay!)
						);
				}
			},
			dataType: "json",
		});
	} else {
		$target
			.find("p")
			.text($entry.data("record") as string)
			.show();
	}
}

$(document).on("click", ".fa-edit.record", function () {
	$target = $(this).parent("div").next(".card-body").find(".txtarea");
	let $p = $target.find("p");
	const record = $p.text() as string;
	$p.hide();
	$target.find("input").val(record).removeClass("hide").trigger("focus");
});

function infoCallBackOk(data: IInfoBase[]) {
	if (data) {
		$(".displayblk").hide();
		let html = "";
		data.forEach((x) => {
			let lastedited: string = lasteditedbyformat
				.replace("{0}", x.ModifiedBy!)
				.replace("{1}", x.ModifyTimeDisplay!);
			html += `<div class="displayblk col-12 col-sm-4 mb-1" data-enqid="${x.enId}" data-cusid="${x.cusId}" data-Id="${x.Id}">
                            <div class="card">
                                <div class="text-right small"><span class="fa fa-edit text-info record pointer mr-2"></span><span class="fa fa-close text-danger record pointer"></span></div>
                                <div class="card-body">
                                    <div class="txtarea" data-Id="${x.Id}">
                                        <p class="recorddisplay">${x.followUpRecord}</p>
                                        <input type="text" class="form-control recordentry hide" data-record="${x.followUpRecord}" onchange="handleRecordChange(this);" />
                                        <span class="small d-inline-block lastedited">${lastedited}</span>
                                    </div>
                                </div>
                            </div>
                        </div>`;
		});
		$("#followupRecordBlk .row").append(html);
	}
}
$(document).on("click", ".saverecord", function () {
	$target = $(this)
		.parent(".buttons")
		.parent(".card-body")
		.parent(".card")
		.parent(".recordblk");
	let cusId: number = forcustomer ? Number($target.data("cusid")) : 0;
	let enqId: string = forenquiry ? $target.data("enqid").toString() : "";
	const record: string = $target.find(".record").val() as string;
	if (record) {
		$target.hide();
		let customerInfo: ICustomerInfo = {} as ICustomerInfo;
		let enquiryInfo: IEnquiryInfo = {} as IEnquiryInfo;
		let data: any = {
			__RequestVerificationToken: $(
				"input[name=__RequestVerificationToken]"
			).val(),
		};
		let url: string = "";
		let callback: any = {};
		if (forcustomer) {
			customerInfo = {
				cusId,
				followUpRecord: record,
			} as ICustomerInfo;
			data.model = customerInfo;
			url = cusId > 0 ? "/Customer/SaveRecord" : "";
		}
		if (forenquiry) {
			enquiryInfo = {
				enId: enqId,
				followUpRecord: record,
			} as IEnquiryInfo;
			data.model = enquiryInfo;
			url = enqId != "" ? "/Enquiry/SaveRecord" : "";
		}
		callback = infoCallBackOk;
		$target = $target.parent(".row").parent("#followupRecordBlk");
		$.ajax({
			//contentType: 'application/json; charset=utf-8',
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: "json",
		});
	}
});


interface IInfoBase {
	Id: any;
	cusId: number | null;
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
}
interface ICustomerInfo extends IInfoBase {
	/*Id: number;*/
	CusCode: string;
	CusAddrLocation: number;
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
	//cusId: number;
	//fileName: string;
	//remark: string;
	//type: string;
	//status: string;
	//followUpDate: Date | null;
	//JsFollowUpDate: string | null;
	//followUpRecord: string | null;
	//CreateTimeDisplay: string | null;
	//CreatedBy: string | null;
	//ModifyTimeDisplay: string | null;
	//ModifiedBy: string | null;
}
interface IEnquiryInfo extends IInfoBase {
	Id: string;
	//enId: string;
	enEmail: string;
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
function handleAddRecordClick(this: any) {
	$target = $(this).parent("label").parent("#followupRecordBlk");
	$target
		.find(".recordblk")
		.first()
		.clone()
		.removeClass("hide")
		.appendTo("#followupRecordBlk .row")
		.find(".record")
		.trigger("focus");
}

function confirmAdvancedSearch() {
	if (advancedSearchModal.find(".attrval").val() !== "") {
		closeAdvancedSearchModal();
		let advSearchItems: IAdvSearchItem[] = [];
		advancedSearchModal.find(".row").each(function (i, e) {
			advSearchItems.push({
				gattrId: $(e).find(".attrName").val() as string,
				Operator: $(e).find(".operator").val() as string,
				attrValue: $(e).find(".attrval").val() as string,
			});
		});
		console.log("advSearchItems:", advSearchItems);
		var data = {
			__RequestVerificationToken: $(
				"input[name=__RequestVerificationToken]"
			).val(),
			advSearchItems,
			eTrackAdvSearchItem,
		};
		//return;
		$.ajax({
			//contentType: 'application/json; charset=utf-8',
			type: "POST",
			url: forcustomer ? "/Customer/AdvancedSearch" : "/eTrack/AdvancedSearch",
			data: data,
			success: function (data: ICustomer[] | IeTrack[]) {
				console.log("data:", data);
				IdList = forcustomer
					? (data as ICustomer[]).map((x) => x.cusCustomerID)
					: (data as IeTrack[]).map((x) => Number(x.ContactId));
				console.log("idlist:", IdList);
				$(`#${gTblName}`).data("idlist", IdList.join(","));
				if (data.length > 0) {
					let html = "";
					if (forcustomer) {
						(data as ICustomer[]).forEach((customer) => {
							const email = customer.cusEmail ?? "N/A";
							const cname = customer.cusName;
							html += `<tr class="${customer.statuscls}" data-Id="${customer.cusCustomerID}">
                    <td style="width:110px;max-width:110px;" class="text-center">${cname}</td>
                    <td style="width:100px;max-width:100px;" class="text-center">${customer.cusContact}</td>
                    <td style="width:110px;max-width:110px;" class="text-center">${email}</td>
                    <td style="width:110px;max-width:110px;" class="text-center">${customer.CustomAttributes}</td>
                    <td style="width:110px;max-width:110px;" class="text-center">${customer.CreateTimeDisplay}</td>
                    <td style="width:70px;max-width:70px;" class="text-center">${customer.FollowUpStatusDisplay}</td>
                    <td style="width:110px;max-width:110px;" class="text-center">${customer.FollowUpDateDisplay}</td>

                    <td style="width:120px;max-width:120px;">
                        <a class="btn btn-info btnsmall" role="button" href="/Customer/Edit?customerId=${customer.cusCustomerID}">${edittxt}</a>
                        <a class="btn btn-danger btnsmall remove" role="button" href="#" data-Id="${customer.cusCustomerID}" data-apid="${customer.AccountProfileId}">${removetxt}</a>
                    </td>
                </tr>`;
						});
					}

					if (foretrack) {
						(data as IeTrack[]).forEach((etrack) => {
							const email = etrack.Email ?? "N/A";
							const cname = etrack.ContactName;
							html += `<tr class="${etrack.statuscls}" data-Id="${etrack.ContactId}">
                             <td style="width:110px;max-width:110px;" class="text-left">${etrack.BlastSubject}</td>
                    <td style="width:110px;max-width:110px;" class="text-left">${cname}</td>
                    <td style="width:100px;max-width:100px;" class="text-left">${etrack.Organization}</td>
                    <td style="width:110px;max-width:110px;" class="text-left">${etrack.ViewDateTimeDisplay}</td>
                    <td style="width:110px;max-width:110px;" class="text-left">${etrack.Phone}</td>
                    <td style="width:110px;max-width:110px;" class="text-left">${email}</td>
                    <td style="width:70px;max-width:70px;" class="text-left">${etrack.IP}</td>
                </tr>`;
						});
					}

					$(`#${gTblName}`).show().find("tbody").empty().append(html);
					$("#norecord").addClass("hide");
					//$(`#${gTblName}`).prev(".row").hide();
					//model.ContactCount = model.eTracks.Select(x => x.ContactName).Distinct().Count();
					$("#totalrecord").text(data.length);
					$("#contactcount").text(countUnique(data.map((x) => x.ContactName)));
					$("#iPageSize").trigger("focus");
				} else {
					$(`#${gTblName}`).hide();
					$("#norecord").removeClass("hide");
					//$(`#${gTblName}`).prev(".row").show();
				}
			},
			dataType: "json",
		});
	}
}

function countUnique(iterable) {
	return new Set(iterable).size;
}

$(document).on("change", "#drpCategories", function () {
	const catIds: string = ($(this).val() as string[]).join();
	let currentSelectedItemCodes: string[] = $("#drpItems").val() as string[];

	$.ajax({
		type: "GET",
		url: "/Api/GetItemsByCategories",
		data: { catIds },
		success: function (data: IItem[]) {
			if (data) {
				currentSelectedItemCodes = currentSelectedItemCodes.concat(
					data.map((i) => i.itmCode)
				);
				console.log("currentSelectedItemCodes:", currentSelectedItemCodes);

				$("#drpItems")
					.empty()
					.append(
						data.map(function (i) {
							const selected = currentSelectedItemCodes.includes(i.itmCode);
							return $("<option />", {
								value: i.itmCode,
								text: i.itmName,
								selected: selected,
							});
						})
					);

				$("#drpItems").val(currentSelectedItemCodes);
			}
		},
		dataType: "json",
	});
});

function genItemSeq(itemcode: string, _seq: number): string {
	return itemcode.concat(":").concat(_seq.toString());
}

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

function getTotalBatDelQty() {
	let totalbatdelqty: number = 0;
	if (DeliveryItems.length > 0) {
		DeliveryItems.forEach((x) => {
			if (x.itmCode == selectedItemCode) totalbatdelqty += x.dlQty;
		});
	}
	return totalbatdelqty;
}

const snMatched = (sn1, sn2) => sn1 == sn2;

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
$(document).on("dblclick", ".povari.pointer", function () {
	getRowCurrentY.call(this);
	selectedItemCode = (
		$tr.find(".itemcode").val() as string
	).trim();
	const $bat = $tr.find(".pobatch.pointer");
	if ($bat.hasClass("focus")) {
		$.fancyConfirm({
			title: "",
			message: batchnorequired,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$bat.trigger("focus");
				}
			},
		});
	} else {
		currentY = $tr.index();
		seq = currentY + 1;
		$.each(Purchase.PurchaseItems, function (i, e) {
			if (e.piSeq == seq) {
				selectedPurchaseItem = structuredClone(e);
				return false;
			}
		});
		console.log("selectedPurchaseItem:", selectedPurchaseItem);
		openPoItemVariModal($(this).hasClass("focus"));
	}
});
$(document).on("dblclick", ".pobatch.pointer", function () {
	$target = $(this).parent("td").parent("tr");
	selectedItemCode = (
		$target.find("td:eq(1)").find(".itemcode").val() as string
	).trim();
	currentY = $target.data("idx") as number;
	seq = currentY + 1;

	if (forpurchase) {
		$.each(Purchase.PurchaseItems, function (i, e) {
			if (e.piSeq == seq) {
				selectedPurchaseItem = structuredClone(e);
				return false;
			}
		});
		if (!selectedPurchaseItem) selectedPurchaseItem = initPurchaseItem();
	}

	resetPurchaseBatchModal();
	//console.log("batch model reset");

	if (forpurchase) {
		if (!$.isEmptyObject(DicItemOptions)) {
			itemOptions = DicItemOptions[selectedItemCode];
			if (itemOptions) {
				if (itemOptions.ChkBatch && itemOptions.ChkSN) {
					$("#tblPbatch thead tr th").last().hide();
				} else {
					$("#tblPbatch thead tr th").last().show();
				}

				if (
					(itemOptions.ChkSN && itemOptions.WillExpire) ||
					(itemOptions.ChkBatch && !itemOptions.WillExpire)
				) {
					$("#tblPbatch thead tr th:eq(2)").hide();
				} else {
					$("#tblPbatch thead tr th:eq(2)").show();
				}
			}
		}
	}

	toggleBatQty();

	if (forpurchase)
		openPurchaseBatchModal(
			true,
			Purchase.pstStatus === "opened" ||
			Purchase.pstStatus === "partialreceival"
		);
});

$(document).on("dblclick", ".posn.pointer", function () {
	$tr = $(this).parent("td").parent("tr");
	currentY = $tr.data("idx") as number;
	seq = currentY + 1;
	selectedItemCode = $tr.find("td:eq(1)").find(".itemcode").val() as string;

	if (forpurchase) {
		$.each(Purchase.PurchaseItems, function (i, e) {
			if (e.piSeq == seq) {
				selectedPurchaseItem = structuredClone(e);
				return false;
			}
		});
		if (!selectedPurchaseItem) selectedPurchaseItem = initPurchaseItem();
	}

	resetPurchaseSerialModal();

	itemOptions = DicItemOptions[selectedItemCode];

	let batchList: IBatch[] = forpurchase
		? selectedPurchaseItem!.batchList
		: selectedSalesLn!.batchList;

	if (itemOptions.ChkBatch && itemOptions.ChkSN && batchList.length === 0) {
		$.fancyConfirm({
			title: "",
			message: batchrequiredtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(`#${gTblName} tbody tr`)
						.eq(currentY)
						.find("td:eq(5)")
						.find(".pobatch")
						.addClass("focus")
						.trigger("focus");
				}
			},
		});
	} else {
		if (!itemOptions.WillExpire) {
			$("#tblPserial thead tr th:eq(2)").hide();
		} else {
			$("#tblPserial thead tr th:eq(2)").show();
		}
		if (forpurchase)
			openPurchaseSerialModal(
				true,
				Purchase.pstStatus === "opened" ||
				Purchase.pstStatus === "partialreceival"
			);

		setValidThruDatePicker();
	}
});

$(document).on("change", ".validthru", function () {
	let $validthru = $(this);
	$tr = $validthru.parent("td").parent("tr");
	let seq: number = Number($(this).parent("td").parent("tr").data("idx")) + 1;
	//console.log(seq);
	let validthru: string = <string>$(this).val();

	if (forpurchase) {
		let $validthru = $(this);
		$target = $validthru
			.parent("td")
			.parent("tr")
			.find("td:last")
			.find(".received");
		//console.log('received:' + $target.val());
		if (Number($target.val()) == 0) {
			$.fancyConfirm({
				title: "",
				message: receivedqtyrequiredtxt,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						$validthru.val("");
						$target.trigger("focus");
					}
				},
			});
		} else {
			let seq: number =
				Number($(this).parent("td").parent("tr").data("idx")) + 1;
			let validthru: string = <string>$(this).val();
			//console.log(seq);
			if (Purchase.PurchaseItems.length > 0) {
				$.each(Purchase.PurchaseItems, function (i, e) {
					if (e.piSeq == seq) {
						e.JsValidThru = validthru;
						selectedPurchaseItem = structuredClone(e);
						return false;
					}
				});
			}
		}
	}

	if (forwholesales) {
		$target = $tr.find("td").eq(5).find(".delqty");
		let delqty = Number($target.val());
		//console.log('received:' + $target.val());
		if (delqty == 0) {
			$.fancyConfirm({
				title: "",
				message: qtyrequiredtxt,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						$validthru.val("");
						$target.trigger("focus");
					}
				},
			});
		}
		if (WholeSalesLns.length > 0) {
			$.each(WholeSalesLns, function (i, e) {
				if (e.wslSeq == seq) {
					e.JsValidThru = validthru;
					selectedWholesalesLn = structuredClone(e);
					return false;
				}
			});
			let idx = -1;
			//update
			DeliveryItems.forEach((x, i) => {
				if (x.seq == seq) {
					idx = i;
					x.JsVt = validthru;
					x.dlQty = delqty;
				}
			});
			//add
			if (idx < 0) {
				let deliveryItem: IDeliveryItem = initDeliveryItem();
				deliveryItem.dlCode = `vt${seq}`;
				let idx = 0;
				deliveryItem.seq = seq;
				idx++;
				deliveryItem.itmCode = $tr
					.find("td")
					.eq(idx)
					.find(".itemcode")
					.val() as string;
				idx = 3;
				deliveryItem.dlBaseUnit = $tr
					.find("td")
					.eq(idx)
					.find(".sellunit")
					.val() as string;
				idx = 5;
				deliveryItem.dlQty = Number(
					$tr.find("td").eq(idx).find(".delqty").val()
				);
				idx = 9;
				deliveryItem.SellingPrice = Number(
					$tr.find("td").eq(idx).find(".price").val()
				);
				idx++;
				deliveryItem.dlDiscPc = Number(
					$tr.find("td").eq(idx).find(".discpc").val()
				);
				idx++;
				if (enableTax && !inclusivetax) {
					deliveryItem.dlTaxPc = Number(
						$tr.find("td").eq(idx).find(".taxpc").val()
					);
					idx++;
				}

				deliveryItem.dlStockLoc = $tr
					.find("td")
					.eq(idx)
					.find(".location")
					.val() as string;
				idx++;

				deliveryItem.JobID = Number($tr.find("td").eq(idx).find(".job").val());
				idx++;

				deliveryItem.dlAmt = deliveryItem.dlAmtPlusTax = Number(
					$tr.find("td").eq(idx).find(".amount").val()
				);

				deliveryItem.JsVt = validthru;
				DeliveryItems.push(deliveryItem);
			}
		}
	}

	if (forsales || forpreorder) {
		$target = $validthru
			.parent("td")
			.parent("tr")
			.find("td")
			.eq(4)
			.find(".qty");
		//console.log('received:' + $target.val());
		if (<number>$target.val() == 0) {
			$.fancyConfirm({
				title: "",
				message: qtyrequiredtxt,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						$validthru.val("");
						$target.trigger("focus");
					}
				},
			});
		} else {
			let seq: number =
				<number>$(this).parent("td").parent("tr").data("idx") + 1;
			let validthru: string = <string>$(this).val();
			//console.log(seq);
			if (forsales && SalesLnList.length > 0) {
				$.each(SalesLnList, function (i, e) {
					if (e.rtlSeq == seq) {
						e.JsValidThru = validthru;
						selectedSalesLn = structuredClone(e);
						return false;
					}
				});
			}
			if (forpreorder && PreSalesLnList.length > 0) {
				$.each(PreSalesLnList, function (i, e) {
					if (e.rtlSeq == seq) {
						e.JsValidThru = validthru;
						selectedPreSalesLn = structuredClone(e);
						return false;
					}
				});
			}
		}
	}
});
function setTotalQty4IvModal() {
	let totalivdelqty = 0;
	if (DeliveryItems.length > 0) {
		DeliveryItems.forEach((x) => {
			if (x.seq == seq && x.ivIdList) {
				totalivdelqty += x.dlQty;
			}
		});
	}
	$("#totalivdelqty").data("totalivdelqty", totalivdelqty).val(totalivdelqty);
}
function setTotalQty4VtModal() {
	let totalvtdelqty = 0;
	if (DeliveryItems.length > 0) {
		DeliveryItems.forEach((x) => {
			if (x.seq == seq && x.JsVt) {
				totalvtdelqty += x.dlQty;
			}
		});
	}
	$("#totalvtdelqty").data("totalvtdelqty", totalvtdelqty).val(totalvtdelqty);
}
function setTotalQty4BatModal() {
	let totalbatdelqty = 0;
	if (DeliveryItems.length > 0) {
		DeliveryItems.forEach((x) => {
			if (x.seq == seq && x.dlBatch) {
				totalbatdelqty += x.dlQty;
			}
		});
	}
	$("#totalbatdelqty")
		.data("totalbatdelqty", totalbatdelqty)
		.val(totalbatdelqty);
}

function blockSpecialChar(e) {
	var k;
	document.querySelectorAll("*") ? (k = e.keyCode) : (k = e.which);
	return (
		(k > 64 && k < 91) ||
		(k > 96 && k < 123) ||
		k == 8 ||
		k == 32 ||
		(k >= 48 && k <= 57)
	);
}

function isEmptyTd(td) {
	if (
		td.text == "" ||
		td.text() == "" ||
		td.text == " " ||
		td.text() == " " ||
		td.html() == "&nbsp;" ||
		td.is(":not(:visible)")
	) {
		return true;
	}

	return false;
}

let PoIvInfo: IPoItemVari[] = [];

let DicIvInfo: { [Key: string]: IPoItemVari[] } = {};

let DicIvQtyList: { [Key: string]: IIvQty[] } = {};
let DicIvDelQtyList: { [Key: string]: IIvDelQty[] } = {};

function isNumber(evt) {
	var charCode = evt.which ? evt.which : evt.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
}

function getItemCodeBySeq(): string {
	return $(`#${gTblName} tbody tr`)
		.eq(seq - 1)
		.find("td:eq(1)")
		.find(".itemcode")
		.val()!
		.toString();
}

function openPayModel_De() {
	payModal.dialog("option", { width: 600, title: processpayments });
	payModal.dialog("open");

	setExRateDropDown();
	//console.log("itotalremainamt:" + itotalremainamt);
	setForexPayment(itotalremainamt);

	$("#totalremainamt").text(formatmoney(itotalremainamt));
	$("#remainamt").text(formatmoney(0));
	let cashtxt = itotalremainamt.toFixed(2);
	$("#Cash").val(cashtxt);
}

function formatEmail(email: string, username: string | null = ""): string {
	return `<a class="simplelnk" href="mailto:${email}" target="_blank">${username ?? email
		}</a>`;
}

$(document).on("click", "#btnReload", function () {
	if ($(this).data("reloadurl"))
		window.location.href = $(this).data("reloadurl");
	else window.location.reload();
});

$(document).on("dblclick", ".validthru.pointer", function () {
	//console.log("here");
	$target = $(this).parent("td").parent("tr");
	selectedItemCode = (
		$target.find("td:eq(1)").find(".itemcode").val() as string
	).trim();
	currentY = Number($target.data("idx"));
	seq = currentY + 1;
	const hasFocusCls = $(this).hasClass("focus");
	itemOptions = DicItemOptions[selectedItemCode];
	//console.log("itemOptions:", itemOptions);
	if (!itemOptions) return false;

	if (
		(forwholesales &&
			(Wholesales.wsStatus.toLowerCase() === "deliver" ||
				Wholesales.wsStatus.toLowerCase() === "partialdeliver")) || (forsales && reviewmode)
	) {
		DeliveryItems = DicSeqDeliveryItems[seq].slice(0);
		//console.log("DeliveryItems:", DeliveryItems);
		deliveryItem = DeliveryItems[0];

		let html = `<tr><td class="text-right"><div class="row form-inline justify-content-end mx-1 mb-3">
            <label>
                ${deliveryItem.VtDisplay} (${deliveryItem.pstCode})
             </label>
              <input type="text" class="form-control vtdelqty mx-2" style="max-width:80px;" value="${deliveryItem.dlQty}" readonly>
           </div></td></tr>`;

		openValidthruModal(hasFocusCls);

		let salesloc: string = getSalesLoc();
		validthruModal
			.find("#validthruLocSeqItem")
			.html(
				`${salesloc}:${selectedItemCode} <span class="exsmall">${sequencetxt}:${seq}</span>`
			);
		validthruModal.find("#tblVt tbody").html(html);

		//setTotalQty4VtModal();
	} else {
		let html: string = "";
		if ($.isEmptyObject(DicItemVtQtyList)) return false;
		let vtqtylist: IVtQty[] = DicItemVtQtyList[selectedItemCode];
		//console.log("DicItemVtDelQtyList:", DicItemVtDelQtyList);
		let delvtqtylist: IVtDelQty[] = DicItemVtDelQtyList[selectedItemCode];
		// console.log("vtqtylist:", vtqtylist);
		//console.log("delvtqtylist:", delvtqtylist);

		let pocodelist: string[] = [];
		vtqtylist.forEach((x) => {
			if (!pocodelist.includes(x.pocode)) pocodelist.push(x.pocode);
		});

		pocodelist.forEach((pocode) => {
			$.each(vtqtylist, function (i, e: IVtQty) {
				if (e.pocode == pocode) {
					let vtdelqty: number = 0; //用來計算 已出貨數量 use initially only => will be replaced with DeliveryItems later on
					const vtId: number = e.vtId;
					//console.log("vtId:" + vtId);
					let vtdelqtylist: string = "";
					let vtdeledqtylist: string = "";
					let vtInfoList: string = "";
					let currentvttypeqty: number = 0;
					let totalvtqty: number = e.qty;

					let inCurrDel: boolean = false;
					if (DeliveryItems.length > 0) {
						if (!itemOptions!.ChkBatch && !itemOptions!.ChkSN) {
							inCurrDel = DeliveryItems.some((x) => {
								return (
									!x.dlHasSN &&
									!x.dlBatch &&
									x.dlVtId == vtId &&
									x.pstCode == pocode
								);
							});
						}
					}
					//console.log("inCurrDel:", inCurrDel);
					$.each(delvtqtylist, function (k, ele) {
						if (vtId == ele.vtId) {
							vtdelqty = ele.delqty!;
							return false;
						}
					});
					//console.log("ivtdelqty:", ivtdelqty);
					/**
					 * Get vtdeledqty:已出貨數量
					 */
					let vtdeledqty = 0;
					/*console.log("inCurrDel:", inCurrDel);*/
					if (inCurrDel) {
						if (!itemOptions!.ChkBatch && !itemOptions!.ChkSN) {
							DeliveryItems.forEach((x) => {
								if (
									!x.dlHasSN &&
									!x.dlBatch &&
									x.dlVtId == vtId &&
									x.pstCode == pocode
								) {
									vtdeledqty += x.dlQty;
								}
							});
						}
					} else {
						vtdeledqty += vtdelqty;
					}

					vtdeledqtylist += `<div class="row form-inline justify-content-end mx-1 mb-3">
                    <span class="vtdeledqty">${vtdeledqty}</span></div>`;

					/**
					 * Get currentvttypeqty
					 */
					if (inCurrDel) {
						if (!itemOptions!.ChkBatch && !itemOptions!.ChkSN) {
							let currentvttypedelqty: number = 0;
							DeliveryItems.forEach((x) => {
								if (
									!x.dlHasSN &&
									!x.dlBatch &&
									x.dlVtId == vtId &&
									x.pstCode == pocode
								) {
									currentvttypedelqty += x.dlQty;
								}
							});
							currentvttypeqty = e.qty - vtdelqty - currentvttypedelqty;
						}
					} else {
						currentvttypeqty = e.qty - vtdelqty;
					}

					vtInfoList += `<div class="row form-inline justify-content-end mx-1 mb-3"><span class="currentvttypeqty">${currentvttypeqty}</span>/<span class="totalvtqty">${totalvtqty}</span></div>`;

					let vtdelqtyId = `vtdelqty_${selectedItemCode}_${i}`;
					let currentvdq = 0;
					let vtdisplay = e.vt == "" ? "N/A" : e.vt;
					let vtseq: number = i + 1;

					$.each(DeliveryItems, function (idx, ele) {
						if (
							ele.dlCode == vtdelqtyId &&
							ele.seq == seq &&
							ele.dlVtId == vtId &&
							ele.itmCode == selectedItemCode
						) {
							currentvdq = ele.dlQty;
							return false;
						}
					});

					let disabled =
						!hasFocusCls ||
							Number(vtdelqty) == currentvttypeqty ||
							currentvttypeqty == 0
							? "disabled"
							: "";

					vtdelqtylist += `<div class="row form-inline justify-content-end mx-1 mb-3">
            <label for="${vtdelqtyId}">
                ${vtdisplay} (${pocode})
             </label>
              <input type="text" class="form-control vtdelqty mx-2" Id="${vtdelqtyId}" data-vtseq="${vtseq}" data-itemcode="${selectedItemCode}" data-vtid="${vtId}" data-pocode=${pocode} data-vtqty="${e.qty}" data-vt="${e.vt}" min="0" max="${e.qty}" data-currentvdq="${currentvdq}" ${disabled} style="max-width:80px;" value="${currentvdq}">
           </div>`; //don't use number type here => errorpone!!!

					/**
					 * Display
					 */
					html += "<tr>";
					html += `<td class="text-right">${vtdelqtylist}</td>
<td class="text-right vtdelqtytxt">${vtdeledqtylist}</div></td>
<td class="text-right">
${vtInfoList}
</td>`;
					html += "</tr>";
				}
			});
		});

		validthruModal.find("#tblVt tbody").html(html);
		let salesloc: string = getSalesLoc();

		validthruModal
			.find("#validthruLocItem")
			.html(
				`${salesloc}:${selectedItemCode} <span class="exsmall">${sequencetxt}:${seq}</span>`
			);
		openValidthruModal(hasFocusCls);

		setTotalQty4VtModal();
	}
});
$(document).on("dblclick", ".batch", function () {
	$target = $(this).parent("td").parent("tr");
	selectedItemCode = (
		$target.find("td:eq(1)").find(".itemcode").val() as string
	).trim();
	currentY = Number($target.data("idx"));
	seq = currentY + 1;
	const hasFocusCls = $(this).hasClass("focus");
	itemOptions = DicItemOptions[selectedItemCode];
	//console.log("itemOptions:", itemOptions);
	if (!itemOptions) return false;
	toggleBatSn();

	if (
		(forwholesales &&
			(Wholesales.wsStatus.toLowerCase() === "deliver" ||
				Wholesales.wsStatus.toLowerCase() === "partialdeliver")) || (forsales && reviewmode)
	) {
		DeliveryItems = DicSeqDeliveryItems[seq].slice(0);

		//console.log("DicIvInfo:", DicIvInfo);

		let html: string = "";
		DeliveryItems.forEach((x) => {
			let chksnlist: string = "";
			let batdelqtylist: string = "";
			const batcode: string = x.dlBatch;
			//const iseq: number = x.seq??0;
			//console.log("iseq:" + iseq);

			html += `<tr data-seq="${seq}"><td><label>${batcode}</label></td>`;
			/**
			 * Display
			 */
			//batch && sn(vt)
			if (itemOptions!.ChkSN) {
				let _checked = "checked";
				let _disabled = "disabled";
				let vtdisplay = x.VtDisplay ? x.VtDisplay : "N/A";
				chksnlist += `<div class="form-check">
              <input class="chkbatsnvt" type="checkbox" value="${x.snoCode}" ${_checked} ${_disabled}>
              <label class="" for="chkbatsnvt${x.snoCode}">
                ${x.snoCode} (${vtdisplay}) (${x.pstCode})
              </label>
            </div>`;

				//console.log("batch&sn(vt)");
				html += `<td>${chksnlist}</td>`;
			}
			//batch && vt(no sn) or batch only
			else {
				let disabled = "disabled";
				let vtdisplay = x.VtDisplay ? x.VtDisplay : "N/A";
				batdelqtylist += `<div class="row form-inline justify-content-end mx-1 mb-3">
            <label>
                ${vtdisplay} (${x.pstCode})
             </label>
              <input type="text" class="form-control batdelqty mx-2" ${disabled} style="max-width:80px;" value="${x.dlQty}">
           </div>`;
				//console.log("batch && vt(no sn) or batch only");
				html += `<td class="text-right">${batdelqtylist}</td>`;
			}

			html += "<td><ul class='nostylelist'>";
			let ivlist = "";

			if (
				!$.isEmptyObject(DicItemBatDelQty) &&
				selectedItemCode in DicItemBatDelQty
			) {
				var batdelqty: IBatDelQty = DicItemBatDelQty[selectedItemCode].filter(
					(x) => x.seq == seq && x.batcode == batcode
				)[0];
				//console.log("batdelqty:", batdelqty);
				batdelqty.ivIdList?.split(",").forEach((x) => {
					//console.log("x:" + x);
					if (
						!$.isEmptyObject(DicItemGroupedVariations) &&
						selectedItemCode in DicItemGroupedVariations
					) {
						for (const [k, v] of Object.entries(
							DicItemGroupedVariations[selectedItemCode]
						)) {
							//let iv: IItemVariation = v[0];
							//console.log("v:", v);
							let iv = v.filter((y) => {
								return y.Id == Number(x);
							})[0];
							//console.log("iv:", iv);
							if (iv)
								ivlist += `<li><label>${iv.iaName}:${iv.iaValue}</label></li>`;
						}
					}
				});
			} else {
				//todo:
			}

			html += ivlist + "</ul></td>";

			html += `</tr>`;
		});
		openBatchModal(hasFocusCls);

		let salesloc: string = getSalesLoc();
		batchModal
			.find("#batchLocSeqItem")
			.html(
				`${salesloc}:${selectedItemCode} <span class="exsmall">${sequencetxt}:${seq}</span>`
			);
		batchModal.find("#tblBatch tbody").html(html);

		setTotalQty4BatModal();
	} else {
		if (DicItemBatchQty[selectedItemCode].length > 0) {
			let html: string = "";
			let pbvqlist: IPoBatVQ[] = [];
			let ipoIvList: IPoItemVari[] = [];
			if (
				!$.isEmptyObject(DicIvInfo) &&
				DicIvInfo[selectedItemCode].length > 0
			) {
				ipoIvList = DicIvInfo[selectedItemCode].slice(0);
			}
			//console.log(PoItemBatVQList);
			//console.log("ipoIvList:", ipoIvList);
			$.each(PoItemBatVQList, function (i, e) {
				if (e.itemcode == selectedItemCode) {
					pbvqlist.push({
						pocode: e.pocode,
						batchcode: e.batchcode,
						vt: e.vt,
						batchqty: e.batchqty,
					});
				}
			});

			//console.log("pbvqlist:", pbvqlist);
			let polist: string[] = [];
			pbvqlist.forEach((x) => {
				if (!polist.includes(x.pocode)) polist.push(x.pocode);
			});
			//console.log("polist:", polist);

			let batchqtylist: Array<IBatchQty> = DicItemBatchQty[selectedItemCode];
			let delbatqtylist: Array<IBatDelQty> = DicItemBatDelQty[selectedItemCode];
			//console.log("delbatqtylist:", delbatqtylist);
			//console.log("batchqtylist:", batchqtylist);
			polist.forEach((pocode) => {
				//console.log("pocode:" + pocode);
				let idx = 0;
				$.each(batchqtylist, function (i, e) {
					if (e.pocode == pocode) {
						let ibatdelqty: number = 0; //use initially only => will be replaced with DeliveryItems later on

						const batcode: string = e.batcode;
						//console.log("batcode:" + batcode);
						let ividlist: string[] = [];
						if (ipoIvList.length > 0) {
							ipoIvList.forEach((x) => {
								if (
									x.ivStockInCode == pocode &&
									x.batCode == batcode &&
									x.ivIdList
								) {
									x.ivIdList.split(",").forEach((y) => ividlist.push(y));
								}
							});
						}

						html += `<tr data-idx="${idx}" data-pocode="${pocode}" data-batcode="${batcode}" data-ivids="${ividlist.join()}"><td><label>${batcode}</label></td>`;

						let chksnlist: string = "";
						let batdelqtylist: string = "";
						let batdeledqtylist: string = "";
						let batInfoList: string = "";
						let currentbattypeqty: number = 0;
						const key: string = batcode + ":" + selectedItemCode;
						let totalbatqty: number =
							key in DicBatTotalQty ? DicBatTotalQty[key] : 0;
						//console.log('pbvqlist:', pbvqlist);
						let inCurrDel: boolean = false;
						inCurrDel = getInCurrDel(inCurrDel, batcode, pocode);
						//console.log("inCurrDel:", inCurrDel);
						$.each(pbvqlist, function (k, v) {
							if (v.pocode == pocode && v.batchcode == batcode) {
								$.each(delbatqtylist, function (idx, ele) {
									if (e.batcode == ele.batcode && pocode == ele.pocode) {
										ibatdelqty += ele.batdelqty!;
									}
								});
								//console.log("ibatdelqty:" + ibatdelqty);
								/**
								 * Get batdeledqty:已出貨數量
								 */
								let batdeledqty = 0;
								//let batdeledqty = ibatdelqty;
								//console.log("inCurrDel:", inCurrDel);
								if (inCurrDel) {
									batdeledqty += ibatdelqty;
									//console.log("#inCurrDel batdeledqty#0:" + batdeledqty);
									if (itemOptions!.ChkSN) {
										if (itemOptions!.WillExpire) {
											/* console.log("all");*/
											//all
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													x.JsVt &&
													x.dlHasSN &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													batdeledqty += x.dlQty;
												}
											});
										}
										//batch && sn (no vt)
										else {
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													!x.JsVt &&
													x.dlHasSN &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													batdeledqty += x.dlQty;
												}
											});
										}
									} else {
										if (itemOptions!.WillExpire) {
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													!x.dlHasSN &&
													x.JsVt &&
													x.JsVt &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													batdeledqty += x.dlQty;
												}
											});
										} else {
											//batch only
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													!x.dlHasSN &&
													!x.JsVt &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													batdeledqty += x.dlQty;
												}
											});
										}
									}
								} else {
									if (itemOptions!.ChkSN) {
										if (itemOptions!.WillExpire) {
											//console.log("all");
										} else {
										}
									} else {
										if (itemOptions!.WillExpire) {
										} else {
											//console.log("batch only");
										}
									}
									//console.log("batdeledqty:" + batdeledqty + ";ibatdelqty:" + ibatdelqty);
									if (v.pocode == pocode && v.batchcode == batcode) {
										batdeledqty += ibatdelqty;
									}
								}

								//console.log("batdeledqty:" + batdeledqty);
								batdeledqtylist += `<div class="row form-inline justify-content-end mx-1 mb-3">
                    <span class="batdeledqty">${batdeledqty}</span></div>`;

								/**
								 * Get currentbattypeqty
								 */
								let currentbattypedelqty: number = 0;
								if (inCurrDel) {
									currentbattypedelqty = 0;
									if (itemOptions!.ChkSN) {
										//all
										if (itemOptions!.WillExpire) {
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													x.JsVt &&
													x.dlHasSN &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													currentbattypedelqty += x.dlQty;
												}
											});
											currentbattypeqty =
												v.batchqty - ibatdelqty - currentbattypedelqty;
										}
										//batch && sn (no vt)
										else {
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													!x.JsVt &&
													x.dlHasSN &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													currentbattypedelqty += x.dlQty;
												}
											});
											currentbattypeqty =
												v.batchqty - ibatdelqty - currentbattypedelqty;
										}
									} else {
										currentbattypedelqty = 0;
										if (itemOptions!.WillExpire) {
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													!x.dlHasSN &&
													x.JsVt &&
													x.JsVt &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													currentbattypedelqty += x.dlQty;
												}
											});
										} else {
											//batch only
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													!x.dlHasSN &&
													!x.JsVt &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													currentbattypedelqty += x.dlQty;
												}
											});
										}
										//console.log("currentbattypedelqty:" + currentbattypedelqty);
										currentbattypeqty =
											v.batchqty - ibatdelqty - currentbattypedelqty;
										//console.log("currentbattypeqty:" + currentbattypeqty);
									}
								} else {
									//console.log("v.batchqty:", v.batchqty);
									//console.log("ibatdelqty:", ibatdelqty);
									currentbattypeqty = v.batchqty - ibatdelqty;
								}

								batInfoList += `<div class="row form-inline justify-content-end mx-1 mb-3"><span class="currentbattypeqty">${currentbattypeqty}</span>/<span class="totalbatqty">${totalbatqty}</span></div>`;

								let batdelqtyId = `batdelqty_${selectedItemCode}_${k}`;
								let currentbdq = 0;
								let vtdisplay = v.vt == "" ? "N/A" : v.vt;
								let batseq: number = k + 1;

								$.each(DeliveryItems, function (idx, ele) {
									if (
										ele.dlCode == batdelqtyId &&
										ele.seq == seq &&
										ele.dlBatch == e.batcode &&
										ele.itmCode == selectedItemCode
									) {
										currentbdq = ele.dlQty;
										return false;
									}
								});

								let disabled =
									!hasFocusCls ||
										Number(ibatdelqty) == currentbattypeqty ||
										currentbattypeqty == 0
										? "disabled"
										: "";

								batdelqtylist += `<div class="row form-inline justify-content-end mx-1 mb-3">
            <label for="${batdelqtyId}">
                ${vtdisplay} (${v.pocode})
             </label>
              <input type="text" class="form-control batdelqty mx-2" Id="${batdelqtyId}" data-batseq="${batseq}" data-itemcode="${selectedItemCode}" data-batch="${v.batchcode}" data-pocode=${v.pocode} data-batqty="${v.batchqty}" data-batvt="${v.vt}" min="0" max="${v.batchqty}" data-currentbdq="${currentbdq}" ${disabled} style="max-width:80px;" value="${currentbdq}">
           </div>`;
							}
						}); //don't use number type here => errorpone!!!

						/**
						 * Set Html List
						 */
						//batch && sn(vt)
						if (itemOptions!.ChkSN) {
							//console.log("batch&&sn(vt)");
							let snbatvtlist: Array<IBatSnVt> = [];
							if (batcode in DicItemBatSnVtList[selectedItemCode]) {
								snbatvtlist =
									DicItemBatSnVtList[selectedItemCode][batcode].slice(0);
							}
							//console.log("snbatvtlist:", snbatvtlist);
							$.each(snbatvtlist, function (idx, ele) {
								let _checked = "";
								let _disabled = hasFocusCls ? "" : "disabled";

								if (DeliveryItems.length > 0) {
									let idx = -1;
									DeliveryItems.findIndex((x, i) => {
										if (hasFocusCls) {
											if (x.snoCode == ele.sn) {
												idx = i;
											}
										} else {
											if (x.snoCode == ele.sn && x.seq == seq) {
												idx = i;
											}
										}
									});
									if (idx >= 0) _checked = "checked disabled";
								}

								if (ele.batcode == e.batcode && ele.pocode == pocode) {
									let vtdisplay = ele.vt ? ele.vt : "N/A";
									chksnlist += `<div class="form-check">
              <input class="chkbatsnvt" type="checkbox" value="${ele.sn}" data-itemcode="${selectedItemCode}" data-pocode="${pocode}" data-batcode="${ele.batcode}" data-snvt="${ele.vt}" Id="chkbatsnvt${ele.sn}" ${_checked} ${_disabled}>
              <label class="" for="chkbatsnvt${ele.sn}">
                ${ele.sn} (${vtdisplay}) (${ele.pocode})
              </label>
            </div>`;
								}
							});
						}

						//batch && vt (no sn)
						if (!itemOptions!.ChkSN && itemOptions!.WillExpire) {
							//console.log("batch&&vt(no sn)");
							let snbatvtlist: Array<IBatSnVt> = [];
							if (batcode in DicItemBatSnVtList[selectedItemCode]) {
								snbatvtlist =
									DicItemBatSnVtList[selectedItemCode][batcode].slice(0);
							}
							//console.log("snbatvtlist:", snbatvtlist);
							$.each(snbatvtlist, function (idx, ele) {
								let _checked = "";
								let _disabled = hasFocusCls ? "" : "disabled";

								if (DeliveryItems.length > 0) {
									let idx = -1;
									DeliveryItems.findIndex((x, i) => {
										if (hasFocusCls) {
											if (x.snoCode == ele.sn) {
												idx = i;
											}
										} else {
											if (x.snoCode == ele.sn && x.seq == seq) {
												idx = i;
											}
										}
									});
									if (idx >= 0) _checked = "checked disabled";
								}

								if (ele.batcode == e.batcode && ele.pocode == pocode) {
									let vtdisplay = ele.vt ? ele.vt : "N/A";
									chksnlist += `<div class="form-check">
              <input class="chkbatsnvt" type="checkbox" value="${ele.sn}" data-itemcode="${selectedItemCode}" data-pocode="${pocode}" data-batcode="${ele.batcode}" data-snvt="${ele.vt}" Id="chkbatsnvt${ele.sn}" ${_checked} ${_disabled}>
              <label class="" for="chkbatsnvt${ele.sn}">
                ${ele.sn} (${vtdisplay})
              </label>
            </div>`;
								}
							});
						}

						/**
						 * Display
						 */
						//batch && sn(vt)
						if (itemOptions!.ChkSN) {
							//console.log("batch&sn(vt)");
							html += `<td>${chksnlist}</td>`;
						}
						//batch && vt(no sn) or batch only
						else {
							//console.log("batch && vt(no sn) or batch only");
							html += `<td class="text-right">${batdelqtylist}</td>`;
						}

						let ivlist: string = "";
						if (ipoIvList.length > 0) {
							ivlist = `<ul class="nostylelist">`;
							ipoIvList.forEach((x) => {
								if (x.ivStockInCode == pocode && x.batCode == batcode) {
									ivlist += `<li data-ivcomboids="${x.ivIdList}"><label>${x.iaName}:${x.iaValue}</label></li>`;
								}
							});
							ivlist += `</ul>`;
						}

						html += `<td class="text-right variInfo">${ivlist}</td>`;

						html += `<td class="text-right batdelqtytxt">${batdeledqtylist}</td>`;

						html += `<td class="text-right batInfo">${batInfoList}</td>`;
						html += `</tr>`;
						idx++;
					}
				});
			});

			//change save btn to close btn if !hasFocusCls
			openBatchModal(hasFocusCls);

			let salesloc: string = getSalesLoc();

			batchModal
				.find("#batchLocSeqItem")
				.html(
					`${salesloc}:${selectedItemCode} <span class="exsmall">${sequencetxt}:${seq}</span>`
				);
			batchModal.find("#tblBatch tbody").html(html);

			//hide tr if currentbattypeqty = 0
			//$("#tblBatch tbody tr").eq(1).find("td.batInfo").find(".currentbattypeqty").text();
			$("#tblBatch tbody tr").each(function (i, e) {
				if (
					Number($(e).find("td.batInfo").find(".currentbattypeqty").text()) <= 0
				) {
					$(e).hide();
				}
			});

			batchModal.find(".batdelqty").each(function (i, e) {
				if ($(e).val() == 0) {
					$(e).trigger("focus");
					return false;
				}
			});
		} else {
			$target = $(this);
			$.fancyConfirm({
				title: "",
				message: nobatchfoundwitemtxt,
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

		setTotalQty4BatModal();
	}
});
function getSalesLoc() {
	let salesloc: string = "";
	if (forsales) reviewmode ? salesloc = SalesOrder.rtsSalesLoc : salesloc = Sales.SelectedShop;
	if (forpreorder) salesloc = PreSales.rtsSalesLoc;
	if (forwholesales) salesloc = Wholesales.wsSalesLoc;
	return salesloc;
}

function getInCurrDel(inCurrDel: boolean, batcode: string, pocode: string) {
	if (DeliveryItems.length > 0) {
		if (itemOptions!.ChkSN) {
			//all
			if (itemOptions!.WillExpire) {
				inCurrDel = DeliveryItems.some((x) => {
					return (
						x.seq == seq &&
						x.JsVt &&
						x.dlHasSN &&
						x.dlBatch == batcode &&
						x.pstCode == pocode
					);
				});
			}

			//batch && sn (no vt)
			else {
				inCurrDel = DeliveryItems.some((x) => {
					return (
						x.seq == seq &&
						!x.JsVt &&
						x.dlHasSN &&
						x.dlBatch == batcode &&
						x.pstCode == pocode
					);
				});
			}
		} else {
			//batch && vt (no sn)
			if (itemOptions!.WillExpire) {
				inCurrDel = DeliveryItems.some((x) => {
					return (
						x.seq == seq &&
						!x.dlHasSN &&
						x.JsVt &&
						x.dlBatch == batcode &&
						x.pstCode == pocode
					);
				});
			} else {
				//batch only
				inCurrDel = DeliveryItems.some((x) => {
					return (
						x.seq == seq &&
						!x.dlHasSN &&
						!x.JsVt &&
						x.dlBatch == batcode &&
						x.pstCode == pocode
					);
				});
			}
		}
	}
	return inCurrDel;
}

//for those items with vari but without batch
function addItemVariRow(hasFocusCls: boolean, maxqty: number) {
	if ($.isEmptyObject(DicIvQtyList) || $.isEmptyObject(DicIvDelQtyList) || $.isEmptyObject(DicIvInfo) || !selectedItemCode || !itemOptions) return false;
	//console.log("DicIvQtyList:", DicIvQtyList);
	let html = "";
	//let itemcode = selectedItemCode;
	let ivqtylist: IIvQty[] = DicIvQtyList[selectedItemCode];
	let delivqtylist: IIvDelQty[] = DicIvDelQtyList[selectedItemCode];

	let ivInfo = DicIvInfo[selectedItemCode];
	//console.log("ivInfo:", ivInfo);

	let pocodelist: string[] = [];
	ivqtylist.forEach((x) => {
		if (!pocodelist.includes(x.pocode)) pocodelist.push(x.pocode);
	});

	if (pocodelist.length > 0) {
		pocodelist.forEach((pocode) => {
			ivqtylist.forEach((e: IIvQty, i: number) => {
				if (e.pocode == pocode) {
					let ivdelqty: number = 0; //用來計算 已出貨數量 use initially only => will be replaced with DeliveryItems later on
					const Id = e.Id;
					let ivdelqtylist = "";
					let ivdeledqtylist: string = "";
					let ivInfoList: string = "";
					let currentivtypeqty: number = 0;
					let totalivqty: number = e.qty;

					let inCurrDel: boolean = false;
					if (DeliveryItems.length > 0) {
						if (!itemOptions?.ChkBatch) {
							inCurrDel = DeliveryItems.some((x) => {
								return (
									x.seq == seq &&
									!x.dlBatch &&
									x.dlCode == Id &&
									x.pstCode == pocode
								);
							});
						}
					}
					//console.log("delivqtylist:", delivqtylist);
					$.each(delivqtylist, function (k, ele) {
						if (ele.pocode == pocode) {
							ivdelqty += ele.delqty!;
						}
					});

					let ivdeledqty = 0;
					if (inCurrDel) {
						if (!itemOptions?.ChkBatch) {
							DeliveryItems.forEach((x) => {
								if (
									x.seq == seq &&
									!x.dlBatch &&
									x.dlCode == Id &&
									x.pstCode == pocode
								) {
									ivdeledqty += x.dlQty;
								}
							});
						}
					} else {
						ivdeledqty += ivdelqty;
					}

					ivdeledqtylist += `<div class="row form-inline justify-content-end mx-1 mb-3">
                    <span class="ivdeledqty">${ivdeledqty}</span></div>`;

					/**
					 * Get currentvttypeqty
					 */
					if (inCurrDel) {
						if (!itemOptions!.ChkBatch) {
							let currentivtypedelqty: number = 0;
							DeliveryItems.forEach((x) => {
								if (
									x.seq == seq &&
									!x.dlBatch &&
									x.dlCode == Id &&
									x.pstCode == pocode
								) {
									currentivtypedelqty += x.dlQty;
								}
							});
							currentivtypeqty = e.qty - ivdelqty - currentivtypedelqty;
						}
					} else {
						//console.log("e.qty:" + e.qty + ";ivdelqty:" + ivdelqty);
						currentivtypeqty = e.qty - ivdelqty;
					}

					ivInfoList += `<div class="row form-inline justify-content-end mx-1 mb-3"><span class="currentivtypeqty">${currentivtypeqty}</span>/<span class="totalivqty">${totalivqty}</span></div>`;

					let ivdelqtyId = `ivdelqty_${selectedItemCode}_${i}`;
					let currentivdq = 0;
					let ivdisplay = `<ul class="nostylelist">`;
					let ivseq: number = i + 1;

					if (ivInfo != null && ivInfo.length > 0) {
						ivInfo.forEach((x) => {
							if (x.Id == Id) {
								ivdisplay += `<li><label>${x.iaName}</label>:<label>${x.iaValue}</label></li>`;
							}
						});
						ivdisplay += "</ul>";
					}

					if (DeliveryItems.length > 0) {
						$.each(DeliveryItems, function (idx, ele) {
							if (
								//ele.dlCode == ivdelqtyId &&
								ele.seq == seq &&
								ele.dlCode == Id &&
								ele.itmCode == selectedItemCode
							) {
								currentivdq = ele.dlQty;
								return false;
							}
						});
					}

					let disabled =
						!hasFocusCls ||
							Number(ivdelqty) == currentivtypeqty ||
							currentivtypeqty == 0
							? "disabled"
							: "";

					ivdelqtylist += `<div class="row form-inline justify-content-center mx-1 mb-3">
            <label for="${ivdelqtyId}">
               ${pocode}
             </label>
              <input type="text" class="form-control ivdelqty mx-2" Id="${ivdelqtyId}" data-ivseq="${ivseq}" data-itemcode="${selectedItemCode}" data-Id="${Id}" data-pocode=${pocode} data-ivqty="${maxqty}" data-totalqty="${e.qty}" data-ividlist="${e.ivIdList}" min="0" max="${maxqty}" data-currentivdq="${currentivdq}" ${disabled} style="max-width:80px;" value="${currentivdq}">
           </div>`; //don't use number type here => errorpone!!!

					/**
					 * Display
					 */
					html += `<tr data-idx="${i}" data-maxqty="${maxqty}">`;
					html += `<td class="text-left">${ivdelqtylist}</td>
                    <td class="text-left">${ivdisplay}</td>
<td class="text-right ivdelqtytxt">${ivdeledqtylist}</div></td>
<td class="text-right">
${ivInfoList}
</td>`;
					html += "</tr>";
				}
			});
		});
	}

	$target = itemVariModal.find("#tblIv tbody");
	$target.empty().append(html);
	$("#tblIv tbody tr")
		.find(".ivdelqty")
		.each(function (i, e) {
			if (Number($(e).val()) == 0) {
				setTimeout(function () {
					$(e).trigger("focus");
				}, 1000);
				return false;
			}
		});
}
$(document).on("dblclick", ".vari.pointer", function () {
	const hasFocusCls: boolean = $(this).hasClass("focus");
	$tr = $(this).parent("td").parent("tr");
	let $td = $tr.find("td");
	selectedItemCode = $td.eq(1).find(".itemcode").val() as string;
	let idx = forwholesales ? 5 : 4;
	let qtycls = forwholesales ? ".delqty" : ".qty";
	const maxqty = Number($td.eq(idx).find(qtycls).val());
	currentY = Number($tr.data("idx"));
	seq = currentY + 1;
	itemOptions = DicItemOptions[selectedItemCode];

	if (
		(forwholesales &&
			(Wholesales.wsStatus.toLowerCase() === "deliver" ||
				Wholesales.wsStatus.toLowerCase() === "partialdeliver")) || ((forsales && reviewmode) && (SalesOrder.rtsStatus.toLowerCase() == SalesStatus.created.toString() || SalesOrder.rtsStatus.toLowerCase() == SalesStatus.presettled.toString()))
	) {
		DeliveryItems = DicSeqDeliveryItems[seq].slice(0);
		deliveryItem = DeliveryItems[0];
		//console.log("deliveryItem:", deliveryItem);

		let ivList: string = "<ul class='nostylelist'>";
		if (selectedItemCode in DicIvInfo) {
			let ivInfo = DicIvInfo[selectedItemCode];
			//console.log(ivInfo);
			ivInfo.forEach((x) => {
				if (x.ivIdList == deliveryItem!.ivIdList!) {
					ivList += `<li><label>${x.iaName}</label>:<label>${x.iaValue}</label></li>`;
				}
			});
		}
		ivList += "</ul>";

		let html = `<tr><td class="text-right"><div class="row form-inline justify-content-end mx-1 mb-3">
            <label>
                ${deliveryItem.pstCode}
             </label>
              <input type="text" class="form-control ivdelqty mx-2" style="max-width:80px;" value="${deliveryItem.dlQty}" readonly>
           </div></td><td>${ivList}</td></tr>`;

		itemVariModal.find("#tblIv tbody").html(html);
	} else {
		addItemVariRow(hasFocusCls, maxqty);
	}

	let salesloc: string = getSalesLoc();
	itemVariModal
		.find("#ivLocSeqItem")
		.html(
			`${salesloc}:${selectedItemCode} <span class="exsmall">${sequencetxt}:${seq}</span>`
		);
	openItemVariModal(hasFocusCls);

	setTotalQty4IvModal();
});
function removeEmptyRow() {
	$tr = $(`#${gTblName} tbody tr`).last();
	if ($tr.find("td").eq(1).find(".itemcode").val() === "") $tr.remove();
}
function showMsg(Id: string, msg: string, alertCls: string, timeout: number = 3000, fadeout: number = 1000) {
	$(`#${Id}`).addClass(`small alert alert-${alertCls}`).html(msg);
	setTimeout(function () {
		$(`#${Id}`).fadeOut(fadeout);
	}, timeout);
}
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

$(document).on("click", ".btnVoid", function () {
	if (forpurchase) {
		openVoidPaymentModal();
	}
});

$(document).on("click", ".btnUpload", function () {
	if (forpurchase) {
		ppId = Number($(this).data("id"));
		getPurchasePayment();

		if (purchasePayment) {
			triggerReferrer = ($(this).parent("td").length) ? TriggerReferrer.Row : TriggerReferrer.Modal;
			openUploadFileModal();
		}

	}
});

function addPayRow() {
	let Id: number = lastppId + 1;
	$tr = $(`#${gTblName} tbody tr`).last();
	let lastseq = ($tr.length) ? Number($tr.find("td").first().text()) + 1 : 1;
	//console.log("Id:", Id);
	let strdate: string = formatDate();
	let strdatetime: string = formatDateTime();

	let html = `<tr data-id="${Id}">
	<td class="text-center">${lastseq}</td>
	<td class="text-center"><input type="text" class="form-control text-center chequeno" maxlength="8" /></td>
	<td class="text-center">${populateDrpAccount()}</td>`;
	//<span class="accountno acname" data-accno="@payment.AccountNo">@payment.AccountName</span>
	html += `<td class="text-center"><span class="accountno acname"></span></td>
	<td class="text-right"><input type="number" class="form-control pay text-right" data-id="${Id}" value="${formatnumber(0)}" /></td>
	<td class="text-right"><input type="datetime" class="form-control datepicker ppdate" name="ppDate" value="${strdate}" /></td>
	<td class="text-left text-wrap"></td>
	<td class="text-right">${strdatetime}</td>
	<td class="text-center">${user.UserName}</td>
	<td>
	<button type="button" class="btn btn-success btnsmall80 btnSave mr-1" data-id="${Id}" title="${$infoblk.data("savepaymenttxt")}"><i class="fa fa-save"></i></button>
									<button type="button" class="btn btn-warning btnsmall80 btnUpload mr-1 disabled" data-id="${Id}" title="${uploadfiletxt}"><i class="fa fa-upload"></i></button>
									<button type="button" class="btn btn-danger btnsmall80 btnVoid mr-1 disabled" data-id="${Id}" title="${void4paymenttxt}"><i class="fa fa-trash"></i></button>
								</td>
	`;
	html += `</tr>`;

	$(`#${gTblName} tbody`).append(html);

	initDatePicker("ppdate", today, true, "", true, false, true);

	ppId = Id;
	purchasePayment = { Id } as IPurchasePayment;
}

function updateSelectedPayment() {
	if (forpurchasepayments) {
		getPurchasePayment();
		//console.log("!purchasePayment:", !purchasePayment);
		if (!purchasePayment) {
			validPayment = false; return;
		}
		$(`#${gTblName} tbody tr`).each(function (i, e) {
			let Id: number = Number($(e).data("id"));
			//console.log("Id:" + Id);
			let chequeno: string = $(e).find(".chequeno").val() as string;
			let acno: string = $(e).find(".acname").data("acno") as string;
			let amt: number = Number($(e).find(".pay").val());
			let jsdate: string = $(e).find(".ppdate").val() as string;
			let jstime: string = $(e).find("td").eq(-3).text();

			if (chequeno != "" && acno != "" && amt > 0 && purchasePayment.Id == Id) {
				purchasePayment.pstCode = Purchase.pstCode;
				purchasePayment.supCode = Purchase.supCode;
				purchasePayment.ChequeNo = chequeno.trim();
				purchasePayment.AccountNo = acno.trim();
				purchasePayment.Amount = Number(amt);
				purchasePayment.JsCreateDate = jsdate;
				purchasePayment.JsOpTime = jstime;

				$(e).find("td").last().find(".btnSave").removeClass("disabled");
				validPayment = true;
			} else {
				$(e).find("td").last().find(".btnSave").addClass("disabled");
				validPayment = false;
			}
		});
	}
}
$(document).on("click", ".filelnk", function () {
	popupCenter({
		url: $(this).data("lnk"),
		title: `${$(this).data("name")}`,
		w: "1080",
		h: "900"
	});
});

function getPurchasePayment() {
	if (PurchasePayments.length > 0) {
		purchasePayment = PurchasePayments.find(x => x.Id == ppId)!;
		if (!purchasePayment)
			purchasePayment = { Id: ppId } as IPurchasePayment;
	} else {
		purchasePayment = { Id: ppId } as IPurchasePayment;
	}
}

function handleVoidPayment() {
	if (NamesMatch) {
		voidPaymentModal.find("span").addClass("hide");
		if (forpurchase) {
			//todo:handleVoidPayment
			console.log("handleVoidPayment");
		}
	} else {
		voidPaymentModal.find("span").removeClass("hide");
	}

}

function populateDrpAccount(): string {
	let selectedEQ = addMode ? "" : AcClfID && AcClfID == "EQ" ? "selected" : "";
	let selectedEXP = addMode ? "" : AcClfID && AcClfID == "EXP" ? "selected" : "";
	let selectedL = addMode ? "" : AcClfID && AcClfID == "L" ? "selected" : "";
	let selectedOEXP = addMode ? "" : AcClfID && AcClfID == "OEXP" ? "selected" : "";
	let selectedOI = addMode ? "" : AcClfID && AcClfID == "OI" ? "selected" : "";
	let selectedCOS = addMode ? "" : AcClfID && AcClfID == "COS" ? "selected" : "";
	let selectedI = addMode ? "" : AcClfID && AcClfID == "I" ? "selected" : "";
	let selectedA = addMode ? "" : AcClfID && AcClfID == "A" ? "selected" : "";
	return `<select class="drpAccount form-control flex">
			<option value="">- ${selecttxt} -</option>
			<option value="A" ${selectedA}>${assettxt}</option>
			<option value="L" ${selectedL}>${liabilitytxt}</option>
			<option value="EQ" ${selectedEQ}>${equitytxt}</option>
			<option value="I" ${selectedI}>${incometxt}</option>
			<option value="COS" ${selectedCOS}>${costxt}</option>
			<option value="EXP" ${selectedEXP}>${expensetxt}</option>
			<option value="OI" ${selectedOI}>${otherincometxt}</option>
			<option value="OEXP" ${selectedOEXP}>${otherexpensetxt}</option>
		</select>`;
}
$(document).on("change", ".drpAccount", function () {
	currentY = $(this).parent("td").parent("tr").index();

	if (forjournal) GetSetJournalLnPair();

	AcClfID = $(this).val()!.toString();
	if (AcClfID !== "") {
		accountList = DicAcAccounts[AcClfID];
		changeAccountPage(1);

		if (forjournal) toggleJournalAmt(currentY, true);
	}
});
$(document).on("change", "#txtUserName", function () {
	UserName = $(this).val();
	//console.log("name:", name);
	if (UserName) {
		if (forpurchase) {
			NamesMatch = UserName == $(this).data("name")
			if (NamesMatch) {
				voidPaymentModal.find("span").addClass("hide");
			} else {
				voidPaymentModal.find("span").removeClass("hide");
			}
		}
	} else {
		voidPaymentModal.find("span").removeClass("hide");
	}
});

function setAccName(tr: JQuery<Element>, acno: string, acname: string) {
	let idx = forjournal ? 0 : 2;

	if (forjournal) {
		let $td = tr.find("td").eq(idx);
		$td.find(".drpAccount").remove();
		$td.html(`<input type="text" class="form-control acno" value="${acno}">`);
	}

	idx++;
	//console.log("idx:" + idx);
	//console.log("acname:", tr.find("td").eq(idx).find(".acname"));
	if (forjournal)
		tr.find("td").eq(idx).find(".acname").val(acname);
	if (forpurchase) {
		/*	let acnameno: string = acname.concat(` (${acno})`);*/
		tr.find("td").eq(idx).find(".acname").text(acname.concat(` (${acno})`)).data("acno", acno);
		purchasePayment.AccountNo = acno;
	}
}
function handleUploadedFile(result: any) {
	closeWaitingModal();

	if (forpurchase) {
		populateFileList4Po(result.FileList);
		closeUploadFileModal();
	}
	if (forpurchase && forpurchasepayments) {
		let fileList: string[] = result.FileList;

		if (fileList.length > 0) {

			$("#uploadmsg").fadeIn("slow");

			let paymentId = purchasePayment.Id;
			purchasePayment.fileName = fileList.join();
			//<li class="p-2" data-file="Project_Requirements.pdf"><a href="#" class="filelnk" data-lnk="/Purchase/1/Project_Requirements.pdf"><img src="/images/pdf.jpg" class="thumbnail">Project_Requirements.pdf</a> <i class="fa fa-trash removefile" data-file="Project_Requirements.pdf" data-payid="1"></i></li>
			let html = "";
			fileList.forEach((x) => {
				html += `<li class="p-2" data-file="${x}"><a href="#" class="filelnk" data-lnk="/Purchase/${paymentId}/${x}"><img src="/images/pdf.jpg" class="thumbnail">${x}</a> <i class="fa fa-trash removefile" data-file="${x}" data-payid="${paymentId}"></i></li>`;
			});
			viewFileModal.find(".filelist").empty().append(html);
		}
	}
}

function setInputFilter(textbox: Element, inputFilter: (value: string) => boolean, errMsg: string): void {
	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
		textbox.addEventListener(event, function (this: (HTMLInputElement | HTMLTextAreaElement) & { oldValue: string; oldSelectionStart: number | null, oldSelectionEnd: number | null }) {
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			}
			else if (Object.prototype.hasOwnProperty.call(this, "oldValue")) {
				this.value = this.oldValue;

				if (this.oldSelectionStart !== null &&
					this.oldSelectionEnd !== null) {
					this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
				}
			}
			else {
				this.value = "";
			}
		});
	});
}

function setInputsFilter(textboxes: any, inputFilter: (value: string) => boolean, errMsg: string): void {
	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
		for (let textbox of textboxes) {
			textbox.addEventListener(event, function (this: (HTMLInputElement | HTMLTextAreaElement) & { oldValue: string; oldSelectionStart: number | null, oldSelectionEnd: number | null }) {
				if (inputFilter(this.value)) {
					this.oldValue = this.value;
					this.oldSelectionStart = this.selectionStart;
					this.oldSelectionEnd = this.selectionEnd;
				}
				else if (Object.prototype.hasOwnProperty.call(this, "oldValue")) {
					this.value = this.oldValue;

					if (this.oldSelectionStart !== null &&
						this.oldSelectionEnd !== null) {
						this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
					}
				}
				else {
					this.value = "";
				}
			});
		}
	});
}

function getRowCurrentY(this: any, forTd: boolean = false) {
	$tr = forTd ? $(this).parent("tr") : $(this).parent("td").parent("tr");
	currentY = $tr.index();
}

function getPdfThumbnail(cls: string = ""): string {
	return `<img src="/images/pdf.jpg" class="${cls} thumbnail">`;
}

function getRemoveFileLnk(file: string): string {
	return `<i class="fa fa-trash removefile" data-file="${file}" data-code="${Purchase.pstCode}"></i>`;
}

$(document).on("click", ".filelnk", function () {
	//let url = ($(this).data("lnk") as string).replace("{0}", $(this).data("supcode"));
	popupCenter({
		url: $(this).data("lnk"),
		title: `${$(this).data("name")}`,
		w: "1080",
		h: "900"
	});
});

$(document).on("click", ".removefile", function () {
	let url = "", data = {};
	let file = $(this).data("file");
	if (forpurchase) {
		if ($(this).hasClass("ppay")) {
			url = "/Purchase/RemoveFile4Payment";
			let Id = Number($(this).data("payid"));
			$(this).parent("li").remove();
			data = { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), Id, filename: file };
		} else {
			url = "/Purchase/RemoveFile";
			let idx = Purchase.FileList.findIndex(x => x == file);
			if (idx >= 0) Purchase.FileList.splice(idx, 1);
			populateFileList4Po(Purchase.FileList);
			let pstCode = $(this).data("code");
			data = { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), pstCode, filename: file };
		}
	}

	handleRemoveFile(url, data);
});

function handleRemoveFile(url: string, data: any) {
	openWaitingModal();
	$.ajax({
		//contentType: 'application/json; charset=utf-8',
		type: "POST",
		url: url,
		data: data,
		success: function (data) {
			if (data) {
				closeWaitingModal();
			}
		},
		dataType: "json"
	});
}

function disableEntries() {
	$("input:not([type='file'],[id='txtUserName'],[name='itemdesc'],.ip,.povari)").prop("isadmin", true).prop("disabled", true);
	$("select").prop("disabled", true);
	$("textarea").not("#txtField").prop("isadmin", true).prop("disabled", true);
}