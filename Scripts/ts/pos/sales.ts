$infoblk = $("#infoblk");
const formatzero = formatnumber(0);
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
    let html = "";   
    selectedSimpleItemList.forEach((x: ISimpleItem) => {
        let imgpath = x.itmPicFile ? `images/items/${x.itmPicFile}` : `images/default.png`;
        let subtotal: number = x.Qty * (x.itmBaseSellingPrice??0);
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
									<li><span class="subtotal">${formatnumber(subtotal)}</span></li>
									<li><a role="button" class="pos confirm-text removeitem" href="javascript:void(0);" data-id="${x.itmItemID}"><img src="/images/pos/icons/delete-2.svg" alt="img"></a></li>
								</ul>`;
    });    

    $("#productcontent").empty().html(html);
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


function toggleProductCheck(ele:HTMLElement):boolean {    
    $target = $(ele).find(".check-product");
    let show = $target.hasClass("hide");
    if (show) {
        $target.removeClass("hide");
        $target.parent(".productsetimg").parent(".productset").addClass("productsethover");
    } else {
        $target.addClass("hide");
        $target.parent(".productsetimg").parent(".productset").removeClass("productsethover");
    }
    return show;
}

function handleProductCheck(ele: HTMLElement, increment:boolean) {    
    if (selectedSimpleItemList.length > 0) {
        let idx = selectedSimpleItemList.findIndex(x => x.itmItemID == selectedSimpleItem.itmItemID);
        if (increment) {          
            if (idx < 0) selectedSimpleItemList.push(selectedSimpleItem);
        } else {            
            if (idx >= 0) selectedSimpleItemList.splice(idx, 1);
        }        
    } else {
       
        if (increment) {
            selectedSimpleItem = { itmCode: $(ele).data("code"), NameDesc: $(ele).data("namedesc"), itmItemID: Number($(ele).data("id")), Qty: 1, itmBaseSellingPrice: Number($(ele).data("price")), itmPicFile:$(ele).data("file") } as ISimpleItem;
            selectedSimpleItemList.push(selectedSimpleItem);
        }
            
    }
}

$(document).on("click", ".productset.pointer", function () {   
    let increment:boolean = toggleProductCheck(this);
    handleProductCheck(this, increment);
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