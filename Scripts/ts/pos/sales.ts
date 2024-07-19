$infoblk = $("#infoblk");

let selectedCatId: number = 3;
let filteredItemList: ISimpleItem[] = [];
function togglePayment(type: string, checked: boolean) {
	type = type.toLowerCase();
	let amt = Number($("#salesamount").data("amt"));
	console.log("type:" + type);
	console.log("checked:", checked);
	isEpay = DicPayTypesChecked["alipay"] || DicPayTypesChecked["wechat"];
	if (isEpay) {
		$(".single__add").removeClass("activee");
		$(".single__add").each(function (i, e) {
			let _type = ($(e).data("type") as string).toLowerCase();
			if (_type == type) {
				if (checked) {
					$(e).addClass("activee");
					$(e).find(".paymenttype").data("amt", amt).val(formatnumber(amt));
					return false;
				}
			}
		});
	} else {
		$(".single__add").each(function (i, e) {
			let _type = ($(e).data("type") as string).toLowerCase();
			if (_type == type) {
				if (checked) {
					$(e).addClass("activee");
				}
				else {
					if ($(".single__add.activee").length > 1)
						$(e).removeClass("activee");
				}
				$(e).find(".paymenttype").val(formatnumber(0));
			} else if (_type == "alipay" || _type == "wechat") {
				$(e).removeClass("activee");
			}
		});

		CouponInUse = DicPayTypesChecked["coupon"];

		if ($(".single__add.activee").length === 1) {
			$(".single__add.activee").first().find(".paymenttype").val(formatnumber(amt));
		} else {
			let remainamt: number = amt;
			if (CouponInUse) {
				if (amt > CouponLn.cpPrice) remainamt = amt - CouponLn.cpPrice;
			}
			$(".single__add.activee").each(function (i, e) {
				if (i == 0) $(e).find(".paymenttype").val(formatnumber(remainamt));
				else {
					if (($(e).data("type") as string).toLowerCase() == "coupon") $(e).find(".paymenttype").val(formatnumber(CouponLn.cpPrice));
					else $(e).find(".paymenttype").val(formatnumber(0));
				}
			});
		}
	}
}

$(document).on("click", ".btnpayment", function () {
	let Id = $(this).attr("id") as string;
	let type = $(this).data("type") as string;
	let checked = false;
	//if ($(".btnpayment.toggle").length == 1 && type.toLowerCase() == "cash") return;

	checked = togglePlusCheck(Id);

	DicPayTypesChecked[type.toLowerCase()] = checked;
	DicPayServiceCharge[type].Selected = checked;

	isEpay = DicPayTypesChecked["wechat"] || DicPayTypesChecked["alipay"];
	CouponInUse = DicPayTypesChecked["coupon"];

	if (checked) {

		$(this).addClass("toggle");

		if (isEpay) {
			$(".btnpayment").not(this).removeClass("toggle");
			$(".btnpayment").not(this).find(".checks").hide();

			$(".btnpayment").each(function (i, e) {
				let _id = $(e).attr("id") as string;
				if (_id != Id) {
					$(e).removeClass("toggle");
					$(e).find(".checks").hide();
					let _type = ($(e).data("type") as string).toLowerCase();
					if (_type == "cash" || (_type == "alipay" || _type == "wechat")) {
						if (!($(e).find(".pluse").is(":visible"))) $(e).find(".pluse").show();
					}
				}
			});

			$("#txtPayerCode").prop("readonly", false).trigger("focus");
		}
		else {
			$(".btnpayment").each(function (i, e) {
				let type = ($(e).data("type") as string).toLowerCase();
				if (type == "alipay" || type == "wechat") {
					$(e).removeClass("toggle");
					$(e).find(".checks").hide();
					if (!($(e).find(".pluse").is(":visible"))) $(e).find(".pluse").show();
				}
			});
			$("#txtPayerCode").prop("readonly", true);
		}
	}
	else {
		$(this).removeClass("toggle");
	}

	if (CouponInUse && $.isEmptyObject(CouponLn)) {
		openBarCodeModal();
		/*for debug only*/
		if (debug) {
			barcodeModal.find("#txtBarCode").val("VYwGYNc7Zo");
		}
	} else {
		togglePayment(type, checked);
		togglePayModeTxt();
		populateOrderSummary();
	}

	if ($(".btnpayment.toggle").length == 0) {
		$(".single__add").removeClass("activee");
		DicPayTypesChecked["cash"] = true;
		togglePlusCheck("btnCash");
		togglePayment("cash", true);
		togglePayModeTxt();
		populateOrderSummary();
	}
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
		let idx = SelectedSimpleItemList.findIndex(x => { return x.itmItemID == Id; });
		//console.log("idx:" + idx);
		if (increment) {
			if (idx < 0) {
				populateSimpleItem();
				SelectedSimpleItemList.push(selectedSimpleItem);
			} else {
				//update discpc & price:
				SelectedSimpleItemList[idx].discpc = discpc;
				SelectedSimpleItemList[idx].itmBaseSellingPrice = Number($(ele!).data("price"));
				//console.log("qtysellable#0:" + SelectedSimpleItemList[idx].QtySellable);
				if (selectedItemCode == SelectedSimpleItemList[idx].itmCode) SelectedSimpleItemList[idx].QtySellable += 1;
				//console.log("qtysellable#1:" + SelectedSimpleItemList[idx].QtySellable);
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
		//console.log("ele.price:", $(ele!).data("price"));
		if (!ele)
			selectedSimpleItem = { itmCode: "ABSSV28.9", NameDesc: "ABSS Accounting v28.9", itmItemID: Id, QtySellable: 1, itmBaseSellingPrice: 4188, itmPicFile: "abss2p.jpg", discpc } as ISimpleItem;
		else selectedSimpleItem = { itmCode: $(ele!).data("code"), NameDesc: $(ele!).data("namedesc"), itmItemID: Id, QtySellable: 1, itmBaseSellingPrice: Number($(ele!).data("price")), itmPicFile: $(ele!).data("file"), discpc } as ISimpleItem;
		//console.log("selectedSimpleItem:", selectedSimpleItem);
	}
}
function populateProductList() {
	let subtotal: number = 0, total: number = 0, disc: number = 0;
	let html = "";

	SelectedSimpleItemList.forEach((x: ISimpleItem) => {
		let imgpath = x.itmPicFile ? `images/items/${x.itmPicFile}` : `images/default.png`;
		let _subtotal: number = x.QtySellable * (x.itmBaseSellingPrice ?? 0);
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
											<div class="productcontent">
												<h5>
													${x.NameDesc}
												</h5>
												<div class="productlinkset">
													<h5>${x.itmCode}</h5>
												</div>
												<textarea class="form-control note"></textarea>
												<div class="increment-decrement">
													<div class="input-groups">
														<input type="button" value="-" class="button-minus dec button operator" data-id="${x.itmItemID}">
														<input type="text" name="child" value="${x.QtySellable}" class="quantity-field simpleqty" data-qtysellable="${x.QtySellable}" data-id="${x.itmItemID}">
														<input type="button" value="+" class="button-plus inc button operator" data-id="${x.itmItemID}">
													</div>
												</div>
											</div>
										</div>
									</li>
									<li><span class="subtotal">${$infoblk.data("currency")} ${formatnumber(_amt)}</span></li>
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

$(document).on("click", "#btnConfirmPay", function () {
	confirmPay();
});
$(document).on("click", "#btnCheckout", function () {
	Sales.rtsFinalTotal = Number($(this).find(".totalamt").text());

	if (Sales.rtsFinalTotal > 0) {
		//console.log("cusid:" + Sales.rtsCusID);
		if (Sales.rtsCusCode) {
			togglePaymentBlk("open", "salesBlk", Sales.rtsFinalTotal);
		}
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
$(document).on("click", "#btnClear", function () {
	SelectedSimpleItemList = [];
	$("#productcontent").empty();
	$("#totalItems").text(0);

	$("#sumblk").find(".sum").text(formatzero);
});
$(document).on("click", ".operator", function () {
	let Id: number = Number($(this).data("id"));
	let idx = SelectedSimpleItemList.findIndex(x => { return x.itmItemID == Id; });

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

	SelectedSimpleItemList[idx].QtySellable = qty;
	//console.log("qty:", qty);
	populateProductList();
});
function handleDiscPcChange(this: any) {
	let discpc: number = Number($(this).val());
	//console.log("discpc#change:", discpc);//10
	handleProductCheck(this, discpc, true);
	populateProductList();
}

function openTapContent(tapName, Id) {
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
	//ele.className += " active";

	//selectedCatId = Id;
	filteredItemList = [];
	if (SimpleItemList) {
		SimpleItemList.forEach((x) => {
			//console.log("x.catId:" + x.catId);
			if (x.catId == Id) filteredItemList.push(x);
		});
		//console.log("filteredItemList:", filteredItemList);
		$(".productblk").empty().append(populateProductBlk(filteredItemList));
	}
}

function toggleProductCheck(ele: HTMLElement, show: boolean) {
	if (show) {
		$target = $(ele).find(".check-product");
		$target.removeClass("hide");
		$target.parent(".productsetimg").parent(".productset").addClass("productsethover");
	} else {
		$target = $(ele);
		$target.addClass("hide");
		$target.parent(".productsetimg").parent(".productset").removeClass("productsethover");
	}
}
function handleRemoveItem(this: any) {
	toggleProductCheck(this, false);
	let discpc: number = Number($(this).parent(".productsetimg").parent(".productset").find(".productsetcontent").find(".discount-box").find(".sdiscpc").val());
	handleProductCheck(this, discpc, false);
	populateProductList();
}
$(document).on("click", ".removeitem", function (e) {
	e.stopPropagation();
	handleRemoveItem.call(this);
});

$(document).on("click", ".check-product", function (e) {
	e.stopPropagation();
	//console.log("check-product click");
	handleRemoveItem.call(this);
});

$(document).on("click", ".productset.pointer", function (e) {
	e.stopPropagation();
	//console.log("productset click");
	handleProductSelected.call(this);
});
$(document).on("change", ".sdiscpc", function () {
	handleDiscPcChange.call(this);
});
$(document).on("change", ".itmprice", function () {
	let price = Number($(this).val());
	//console.log("price:", price);
	let $parent = $(this).parent(".price-box").parent("h6").parent(".productsetcontent");
	//console.log("$parent:", $parent);
	let $discpc = $parent.find(".sdiscpc");
	//console.log("$discpc:", $discpc);
	$discpc.data("price", price).trigger("change");

	let $pricebox = $(this).parent(".price-box");	
	let html = `<h6><span class="itmprice">$${formatnumber(price)}</span></h6>`;
	$pricebox.replaceWith(html);
});
$(document).on("dblclick", ".itmprice", function () {
	let $parent = $(this).parent("h6").parent("div");
	let html = `<div class="price-box">
													<label class="small">${currency}</label>
													 <input type="text" class="number itmprice small flex" data-id="${$(this).data("id")}" data-namedesc="${$(this).data("namedesc")}" data-code="${$(this).data("code")}" data-price="${$(this).data("price")}" data-file="${$(this).data("file")}" value="${formatnumber($(this).data("price")??0)}" />
												</div>`;

	$(this).replaceWith(html);
	$parent.find(".itmprice").trigger("focus");
});

function handleProductSelected(this: any) {
    toggleProductCheck(this, true);
    let discpc: number = Number($(this).find(".productsetcontent").find(".discount-box").find(".sdiscpc").val());
    handleProductCheck(this, discpc, true);
    populateProductList();
}

function populateProductBlk(itemList: ISimpleItem[]): string {
	let html = "";
	itemList.forEach((item) => {
		//console.log("item:", item);
		html += `<div class="col-lg-3 col-sm-6 d-flex ">
									<div class="productset flex-fill pointer" id="${item.itmCode}" data-id="${item.itmItemID}" data-namedesc="${item.NameDesc}" data-code="${item.itmCode}" data-price="${item.itmBaseSellingPrice}" data-file="${item.itmPicFile}">
										<div class="productsetimg">
											<img src="/images/items/${item.itmPicFile}" alt="${item.NameDesc}">
											<h6>${qtytxt}: ${item.QtySellable}</h6>

											<div class="check-product hide" data-id="${item.itmItemID}" data-namedesc="${item.NameDesc}" data-code="${item.itmCode}" data-price="${item.itmBaseSellingPrice}" data-file="${item.itmPicFile}">
												<i class="fa fa-check"></i>
											</div>
										</div>
										<div class="productsetcontent">
											<h5>${item.CategoryName}</h5>
											<h4><span class="itmnamedesc">${item.NameDesc}</span></h4>
											<h6><span class="itmprice">$${item.SellingPriceDisplay}</span></h6>
											<div class="discount-box">

												<label class="small" for="discount">${discpctxt}:</label>

												<input type="number" class="sdiscpc small flex" name="discpc" min="0" data-id="${item.itmItemID}" data-namedesc="${item.NameDesc}" data-code="${item.itmCode}" data-price="${item.itmBaseSellingPrice}" data-file="${item.itmPicFile}">

											</div>
										</div>
									</div>
								</div>`;
	});

	return html;
}
$(document).on("change", "#searchItem", function (e) {
	e.preventDefault();
	e.stopPropagation();

	keyword = $(this).val() as string;
	//console.log("keyword:", keyword);
	//if(!filteredItemList)
		filteredItemList = [];
	if (keyword != "") {
		//console.log("SimpleItemList:", SimpleItemList);
		SimpleItemList.forEach((x) => {			
			if (x.itmCode.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 || x.NameDesc.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) filteredItemList.push(x);
		});
		//console.log("filteredItemList#keyword:", filteredItemList);		
		if (filteredItemList.length === 0) {
			//console.log("ready to show norecord");
			$norecordfound.removeClass("hide");
			//console.log("filteredItemList:", filteredItemList);
		} else {
			$(".tab.small").find("button").removeClass("active");
			$(".tab_content").find(".page-header").find(".page-title").find("h4").text("");
			$(".productblk").empty().append(populateProductBlk(filteredItemList));

			if (filteredItemList.length == 1) {
				selectedItemCode = filteredItemList[0].itmCode;
				//if (!(selectedItemCode in DicSelectedItemCount)) DicSelectedItemCount[selectedItemCode] += 1;
				console.log(filteredItemList);
				$(".productset").each(function () {
					if ($(this).data("code") == selectedItemCode) {
						handleProductSelected.call(this);
						return false;
					}
						
				});
			}
		}
	}
	else {
		if (filteredItemList.length === 0) {
			filteredItemList = $infoblk.data("filtereditemlist");			
			$(".productblk").empty().append(populateProductBlk(filteredItemList));
			initTapContent();
		}
	}
});

$(document).on("change", "#txtPhone", function (e) {
	if ($(this).val()) selectedCusCodeName = $(this).val();
	searchCustomer(selectedCusCodeName);
});
function initTapContent() {
	openTapContent($infoblk.data("defaultcatname"), selectedCatId);
	$(".tab").find("button").first().addClass("active");
}
function initInfoVariables4SimpleSales() {
	comInfo = $infoblk.data("cominfo");
	PayTypes = $infoblk.data("paytypes");
	//console.log("PayTypes:", PayTypes);
	DicPayTypes = $infoblk.data("dicpaytypes");
	//console.log("DicPayTypes:", DicPayTypes);
	DicPayServiceCharge = $infoblk.data("dicpayservicecharge");
	//console.log("DicPayServiceCharge:", DicPayServiceCharge);
	DicCurrencyExRate = $infoblk.data("diccurrencyexrate");
	defaultcustomer = $infoblk.data("defaultcustomer");
	SimpleItemList = $infoblk.data("itemlist");
	filteredItemList = $infoblk.data("filtereditemlist");
	//console.log("SimpleItemList:", SimpleItemList);
	//console.log("filteredItemList:", filteredItemList);
	selectedCatId = Number($infoblk.data("defaultcatid"));
	debug = $infoblk.data("debug") == "1";
	DicPayTypesChecked = $infoblk.data("dicpaytypeschecked");
}
$(function () {
	forsimplesales = true;
	salesType = SalesType.simplesales;
	setFullPage();
	initModals();
	triggerMenuByCls("menusales", 0);
	initInfoVariables4SimpleSales();

	$("#rtsExRate").val(1);
	displayExRate(1);

	$("body").css({ "padding-top": "0" });
	lang = Number($("#lang").val());
	if (lang != 2) $(".btn-scanner-set").css({ "letter-spacing": ".7rem" });

	initTapContent();

	Sales = initSimpleSales();
	$("#txtCustomerName").val(defaultcustomer.cusName);
	selectedCus = defaultcustomer;

	$norecordfound = $("#norecordfound");

	if (SimpleItemList.length == 0)
		$norecordfound.show();
	else $norecordfound.hide();

	setInputs4NumberOnly(["number", "paymenttype"]);

	$("#searchItem").trigger("focus");
});


