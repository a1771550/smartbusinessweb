$infoblk = $("#infoblk");
const formatzero = formatnumber(0);


$(document).on("click", ".btnpayment", function () {
	let Id = $(this).attr("id") as string;
	togglePlusCheck(Id);
	togglePayModeTxt();
});
$(document).on("change", "#txtItemCode", function () {	
	/*console.log("here");*/
	handleProductCheck(null, 0, true);
	populateProductList();
});
function handleProductCheck(ele: HTMLElement | null, discpc: number, increment: boolean) {
	let Id: number = 0;
	if (!ele) {
		//8885010236425;ABSSV28.9
		//console.log("here");
		Id = 5;
		populateSimpleItem();
	} else {
		Id = Number($(ele!).data("id"));
		//console.log("discpc#handle:", discpc);//0
	}

	if (SelectedSimpleItemList.length > 0) {
		let idx = SelectedSimpleItemList.findIndex(x => x.itmItemID == Id);

		if (increment) {
			if (idx < 0) {
				populateSimpleItem();
				SelectedSimpleItemList.push(selectedSimpleItem);
			} else {
				//update discpc:
				SelectedSimpleItemList[idx].discpc = discpc;
			}
		} else {
			if (idx >= 0) SelectedSimpleItemList.splice(idx, 1);
		}
	} else {

		if (increment) {
			populateSimpleItem();
			SelectedSimpleItemList.push(selectedSimpleItem);
		}

	}

	function populateSimpleItem() {
		//console.log("discpc#popu:", discpc);
		//console.log("ele:", ele);
		if (!ele)
			selectedSimpleItem = { itmCode: "ABSSV28.9", NameDesc: "ABSS Accounting v28.9", itmItemID: Id, Qty: 1, itmBaseSellingPrice: 4188, itmPicFile: "abss2p.jpg", discpc } as ISimpleItem;
		else selectedSimpleItem = { itmCode: $(ele!).data("code"), NameDesc: $(ele!).data("namedesc"), itmItemID: Id, Qty: 1, itmBaseSellingPrice: Number($(ele!).data("price")), itmPicFile: $(ele!).data("file"), discpc } as ISimpleItem;

		//console.log("selectedSimpleItem:", selectedSimpleItem);
	}
}
function populateProductList() {
	let subtotal: number = 0, total: number = 0, disc: number = 0;
	let html = "";

	SelectedSimpleItemList.forEach((x: ISimpleItem) => {
		let imgpath = x.itmPicFile ? `images/items/${x.itmPicFile}` : `images/default.png`;
		let _subtotal: number = x.Qty * (x.itmBaseSellingPrice ?? 0);
		//console.log("x.discpc:" + x.discpc);
		let _disc: number = _subtotal * x.discpc / 100;

		subtotal += _subtotal;

		disc += _disc;

		let _amt = _subtotal - _disc;

		html += `<ul class="product-lists" data-code="${x.itmCode}" data-id="${x.itmItemID}" data-discpc="${x.discpc}" data-disc="${_disc}" data-price="${x.itmBaseSellingPrice}" data-namedesc="${x.NameDesc}" data-amt="${_amt}">
									<li>
										<div class="productimg">
											<div class="productimgs">
												<img src="/${imgpath}" alt="${x.NameDesc}">
											</div>
											<div class="productcontet">
												<h4>
													${x.NameDesc}
												</h4>
												<div class="productlinkset">
													<h5>${x.itmCode}</h5>
												</div>
												<div class="increment-decrement">
													<div class="input-groups">
														<input type="button" value="-" class="button-minus dec button operator" data-id="${x.itmItemID}">
														<input type="text" name="child" value="${x.Qty}" class="quantity-field simpleqty" data-id="${x.itmItemID}">
														<input type="button" value="+" class="button-plus inc button operator" data-id="${x.itmItemID}">
													</div>
												</div>
											</div>
										</div>
									</li>
									<li><span class="subtotal">${formatnumber(_amt)}</span></li>
									<li><a role="button" class="pos confirm-text removeitem" href="javascript:void(0);" data-id="${x.itmItemID}"><img src="/images/pos/icons/delete-2.svg" alt="img"></a></li>
								</ul>`;
	});

	$("#productcontent").empty().html(html);
	$("#totalItems").text(SelectedSimpleItemList.length);
	//console.log("subtotal:" + subtotal + ";disc:" + disc);
	total = subtotal - disc;

	$("#subtotal").text(formatnumber(subtotal));
	$("#discount").text(formatnumber(disc));
	$(".totalamt").text(formatnumber(total));
}
$(document).on("click", ".pos.btn-scanner-set", function () {
	openBarCodeModal();
	$("#txtItemCode").trigger("focus");
});


$(document).on("click", "#btnCheckout", function () {
	let amt = Number($(this).find("#totalamt").text());
	//console.log("amt:" + amt);
	//return false;
	if (amt == 0) amt = 5000;
	togglePaymentBlk("open", "salesBlk", amt); return false;


	if (amt > 0) {
	//	console.log("cusid:" + Sales.rtsCusID);
		if (Sales.rtsCusID > 0) //openPayModal(amt);
			togglePaymentBlk("open", "salesBlk",amt);
		else {
			$.fancyConfirm({
				title: "",
				message: customerrequiredtxt,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						$("#txtCustomerName").trigger("focus");
					}
				}
			});
		} 
	}
});
$(document).on("change", ".sdiscpc", function () {
	let discpc: number = Number($(this).val());
	//console.log("discpc#change:", discpc);//10
	handleProductCheck(this, discpc, true);
	populateProductList();
});
$(document).on("click", "#btnClear", function () {
	SelectedSimpleItemList = [];
	$("#productcontent").empty();
	$("#totalItems").text(0);

	$("#sumblk").find(".sum").text(formatzero);
});
$(document).on("click", ".operator", function () {
	let Id: number = Number($(this).data("id"));
	let idx = SelectedSimpleItemList.findIndex(x => x.itmItemID == Id);

	let qty: number = 0;
	//console.log("id:" + $(this).data("id"));
	if ($(this).hasClass("dec")) {
		$target = $(this).next(".simpleqty");
		qty = Number($target.val());
		qty--;
	} else {
		$target = $(this).prev(".simpleqty");
		qty = Number($target.val());
		qty++;
	}
	if (qty < 0) qty = 0;

	SelectedSimpleItemList[idx].Qty = qty;
	//console.log("qty:", qty);
	populateProductList();
});
function openTapContent(ele, tapName) {
	// Declare all variables
	var i, tab_content, tablinks;

	// Get all elements with class="tab_content" and hide them
	tab_content = document.getElementsByClassName("tab_content");
	for (i = 0; i < tab_content.length; i++) {
		tab_content[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(tapName)!.style.display = "block";
	ele.className += " active";
}

function toggleProductCheck(ele: HTMLElement, show: boolean) {
	$target = $(ele).find(".check-product");
	if (show) {
		$target.removeClass("hide");
		$target.parent(".productsetimg").parent(".productset").addClass("productsethover");
	} else {
		$target.addClass("hide");
		$target.parent(".productsetimg").parent(".productset").removeClass("productsethover");
	}
}



$(document).on("click", ".check-product", function () {
	toggleProductCheck(this, false);
	let discpc: number = Number($(this).parent(".productsetimg").parent(".productset").find(".productsetcontent").find(".discount-box").find(".sdiscpc").val());
	handleProductCheck(this, discpc, false);
	populateProductList();
});

$(document).on("click", ".productset.pointer", function () {
	toggleProductCheck(this, true);
	let discpc: number = Number($(this).find(".productsetcontent").find(".discount-box").find(".sdiscpc").val());
	handleProductCheck(this, discpc, true);
	populateProductList();
});

$(function () {
	forsimplesales = true;
	salesType = SalesType.simplesales;
	setFullPage();
	initModals();

	comInfo = $infoblk.data("cominfo");
	DicPayTypes = $infoblk.data("dicpaytypes");
	DicCurrencyExRate = $infoblk.data("diccurrencyexrate");

	$("#rtsExRate").val(1);
	displayExRate(1);

	$("body").css({ "padding-top": "0" });
	lang = Number($("#lang").val());
	if (lang != 2) $(".btn-scanner-set").css({ "letter-spacing": ".7rem" });

	openTapContent(this, $infoblk.data("defaultcatname"));
	$(".tab").find("button").first().addClass("active");

	$(".check-product").addClass("hide");

	Sales = initSimpleSales();
});