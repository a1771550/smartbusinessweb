$infoblk = $("#infoblk");
$target = $("#tblCustomer tbody");

$(document).on("click", ".remove", function () {
    let cusId = $(this).data("id");  
    let token = $("input[name=__RequestVerificationToken]").val();
    $.fancyConfirm({
        title: "",
        message: confirmremove,
        shownobtn: true,
        okButton: oktxt,
        noButton: canceltxt,
        callback: function (value) {
            if (value) {
                $.ajax({
                    type: "POST",
                    url: "/Customer/Delete",
                    data: {
                        customerId: cusId,                       
                        __RequestVerificationToken: token,
                    },
                    success: function () {
                        window.location.reload();
                    },
                    dataType: "json",
                });
            }
        },
    });
});

$(document).on("click", "#btnReload", function () {
    window.location.href = "/Customer/Index";
});

$(document).on("click", "#btnSearch", function () {
    keyword = <string>$("#txtKeyword").val();
    if (keyword !== "") {       
        getCustomers();
    }
});

$(document).on("click", ".colheader", function () {
    let $sortcol = $("<input>").attr({
        type: "hidden",
        name: "SortCol",
        value: $(this).data("col"),
    });
    let $keyword = $("<input>").attr({
        type: "hidden",
        name: "Keyword",
        value: $(this).data("keyword"),
    });

    $("#frmCustomer").append($sortcol).append($keyword).trigger("submit");
});

$(function () {
    $("body")
        .find(".body-content")
        .removeClass("container")
        .addClass("container-fluid");
    let $sortorder = $("#sortorder");
    let $sortcol = $("#sortcol");
    //console.log('sortorder:' + $sortorder.val() + ';sortcol:' + $sortcol.val());
    $target = $(".colheader").eq(<number>$sortcol.val());
    let sortcls =
        $sortorder.val() === "desc" ? "fa fa-sort-up" : "fa fa-sort-down";
    $target.addClass(sortcls);

    initModals();
    triggerMenu(1, 2);

    $("#txtKeyword").trigger("focus");

    $target = $(".pagination");
    $target
        .wrap('<nav aria-label="Page navigation"></nav>')
        .find("li")
        .addClass("page-item")
        .find("a")
        .addClass("page-link");

    let keyword = getParameterByName("Keyword");
    if (keyword !== null) {
        $("#txtKeyword").val(keyword);
    }
    $(".pagination li").addClass("page-item");
});
