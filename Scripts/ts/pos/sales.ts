$infoblk = $("#infoblk");
const formatzero = formatnumber(0);

$(document).on("change", ".sdiscpc", function () {
	//todo:
	handleProductCheck(this, true);
	populateProductList();
});
$(document).on("click", "#btnClear", function () {
	selectedSimpleItemList = [];
	$("#productcontent").empty();
	$("#totalItems").text(0);

	$("#sumblk").find(".sum").text(formatzero);
});

$(document).on("change", ".simpleqty", function () {
	console.log("qty:" + $(this).val());
});
function populateProductList() {
	let subtotal: number = 0, total: number = 0, disc: number = 0;
	let html = "";

	selectedSimpleItemList.forEach((x: ISimpleItem) => {
		let imgpath = x.itmPicFile ? `images/items/${x.itmPicFile}` : `images/default.png`;
		let _subtotal: number = x.Qty * (x.itmBaseSellingPrice ?? 0);
		console.log("x.discpc:" + x.discpc);
		let _disc: number = _subtotal * x.discpc / 100;
		
		subtotal += _subtotal;

		disc += _disc;

		let _amt = _subtotal - _disc;

		html += `<ul class="product-lists">
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
														<input type="button" value="-" class="button-minus dec button" data-id="${x.itmItemID}" onclick="handleSaleItemQty('-','${x.itmItemID}')">
														<input type="text" name="child" value="${x.Qty}" class="quantity-field simpleqty" data-id="${x.itmItemID}">
														<input type="button" value="+" class="button-plus inc button" data-id="${x.itmItemID}" onclick="handleSaleItemQty('+','${x.itmItemID}')">
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
	$("#totalItems").text(selectedSimpleItemList.length);
	console.log("subtotal:" + subtotal + ";disc:" + disc);
	total = subtotal - disc;

	$("#subtotal").text(formatnumber(subtotal));
	$("#discount").text(formatnumber(disc));
	$("#totalamt").text(formatnumber(total));
}

$(document).on("click", ".pos.btn-scanner-set", function () {
	//todo:
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


function toggleProductCheck(ele: HTMLElement, show:boolean) {
	$target = $(ele).find(".check-product");	
	if (show) {
		$target.removeClass("hide");
		$target.parent(".productsetimg").parent(".productset").addClass("productsethover");
	} else {
		$target.addClass("hide");
		$target.parent(".productsetimg").parent(".productset").removeClass("productsethover");
	}
}

function handleProductCheck(ele: HTMLElement, increment: boolean) {
	let Id: number = Number($(ele).data("id"));
	let discpc: number = Number($(ele).find(".productsetcontent").find(".discount-box").find(".sdiscpc").val());
	console.log("discpc:", discpc);//0
	if (selectedSimpleItemList.length > 0) {
		let idx = selectedSimpleItemList.findIndex(x => x.itmItemID == Id);

		if (increment) {
			if (idx < 0) {
				populateSimpleItem();
				selectedSimpleItemList.push(selectedSimpleItem);
			}
		} else {
			if (idx >= 0) selectedSimpleItemList.splice(idx, 1);
		}
	} else {

		if (increment) {
			populateSimpleItem();
			selectedSimpleItemList.push(selectedSimpleItem);
		}

	}

	function populateSimpleItem() {
		selectedSimpleItem = { itmCode: $(ele).data("code"), NameDesc: $(ele).data("namedesc"), itmItemID: Id, Qty: 1, itmBaseSellingPrice: Number($(ele).data("price")), itmPicFile: $(ele).data("file"), discpc: discpc } as ISimpleItem;
	}
}

$(document).on("click", ".check-product", function () {
	toggleProductCheck(this, false);
	handleProductCheck(this, false);
	populateProductList();
});

$(document).on("click", ".productset.pointer", function () {
	toggleProductCheck(this,true);
	handleProductCheck(this, true);
	populateProductList();
});

$(function () {
	forsimplesales = true;
	salesType = SalesType.retail;
	setFullPage();
	initModals();

	$("body").css({ "padding-top": "0" });
	lang = Number($("#lang").val());
	if (lang != 2) $(".btn-scanner-set").css({ "letter-spacing": ".7rem" });

	openTapContent(this, $infoblk.data("defaultcatname"));
	$(".tab").find("button").first().addClass("active");

	$(".check-product").addClass("hide");
});