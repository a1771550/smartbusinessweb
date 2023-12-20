$infoblk = $("#infoblk");

function openItem(ele, itemName) {
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
    document.getElementById(itemName)!.style.display = "block";
    ele.className += " active";
}

function toggleProductCheck(ele:HTMLElement) {
    selectedSimpleItem = { itmCode: $(ele).data("code"), NameDesc: $(ele).data("namedesc"), itmItemID: Number($(ele).data("id")) } as ISimpleItem;
    $target = $(ele).find(".check-product");
    let show = $target.hasClass("hide");
    if (show) {
        $target.removeClass("hide");
        $target.parent(".productsetimg").parent(".productset").addClass("productsethover");
    } else {
        $target.addClass("hide");
        $target.parent(".productsetimg").parent(".productset").removeClass("productsethover");
    }
}

$(document).on("click", ".productset.pointer", function () {   
    toggleProductCheck(this);
});

$(function () {   
    forsimplesales = true;
    salesType = SalesType.retail;
    setFullPage();
    initModals();

    $("body").css({ "padding-top": "0" });
    lang = Number($("#lang").val());
    if (lang != 2) $(".btn-scanner-set").css({ "letter-spacing": ".7rem" });

    openItem(this, 'SimpleItem');
    $(".tab").find("button").first().addClass("active");

    $(".check-product").addClass("hide");
});