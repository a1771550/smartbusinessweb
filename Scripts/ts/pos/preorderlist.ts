$infoblk = $("#infoblk");
searchmodes = "";
searchmodelist =
    $("#searchmode").length && $("#searchmode").val() !== ""
        ? ($("#searchmode").val() as string).split(",")
        : [];
frmId = "frmPreOrder";

$(document).on("click", "#btnFilter", function (e: JQuery.Event) {
    e.preventDefault();
    if (isapprover) {
        $(`#${frmId}`).trigger("submit");
    } else {
        if (searchmodelist.length === 0) searchmodelist.push("0");
        $("#searchmode").val(searchmodelist.join(","));
        $(`#${frmId}`).trigger("submit");
    }
});
$(document).on("change", "#txtKeyword", function () {
    var keyword = $(this).val() as string;
    if (keyword !== "") {
        $("#searchmode").val(searchmodelist.join(","));
    }
});
$(document).on("change", ".searchmode", function () {
    const _search = $(this).is(":checked");
    const _mode = $(this).val() as string;
    if (_search) {
        searchmodelist.push(_mode);
    } else {
        var idx = searchmodelist.findIndex((x) => x == _mode);
        searchmodelist.splice(idx, 1);
    }
    //console.log(searchmodelist);
    //return;
    $("#searchmode").val(searchmodelist.join(","));
});
$(document).on("click", ".edit", function () {
    //console.log("mode:" + $(this).data("mode")); return false;
    const mode = $(this).data("mode");
    let url = `/POSFunc/Sales?receiptno=${$(this).data("code")}&readonly=${$(this).data("readonly")}&mode=${mode}`;
    window.open(url,
        "_self"
    );
});
$(document).on("click", ".colheader", function () {
    let $sortorder = $("#sortorder").val($(this).data("order"));
    let $sortname = $("#sortname").val($(this).data("category"));
    $(`#${frmId}`)
        .append($sortorder)
        .append($sortname)
        .trigger("submit");
});
$(function () {
    isapprover = $infoblk.data("isapprover") === "True";
    setFullPage();
    //console.log('sortorder:' + $('#currentsortorder').val() + ';sortname:' + $('#sortname').val());
    const filter: any = getParameterByName("filter");
    if (filter !== null && Number(filter) === 1) {
        $(".colheader").each(function (i, e) {
            if ($(e).data("category") == $("#sortname").val()) {
                let sortcls =
                    $("#currentsortorder").val() === "asc"
                        ? "fa fa-sort-down"
                        : "fa fa-sort-up";
                $(e).addClass(sortcls);
                return false;
            }
        });
    } else {
        $(".colheader").each(function (i, e) {
            if ($(e).data("category") == $("#sortname").val()) {
                let sortcls =
                    $("#currentsortorder").val() === "asc"
                        ? "fa fa-sort-up"
                        : "fa fa-sort-down";
                $(e).addClass(sortcls);
                return false;
            }
        });
    }

    initModals();
    $("#txtKeyword").trigger("focus");

    $target = $(".pagination");
    $target
        .wrap('<nav aria-label="Page navigation"></nav>')
        .find("li")
        .addClass("page-item")
        .find("a")
        .addClass("page-link");

    $(".disabled").off("click");

    let keyword = getParameterByName("Keyword");
    if (keyword !== null) {
        $("#txtKeyword").val(keyword);
    }

    batchidx = 5;
    snidx = batchidx + 1;
    vtidx = snidx + 1;
});