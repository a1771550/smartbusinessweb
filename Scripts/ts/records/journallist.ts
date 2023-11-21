$infoblk = $("#infoblk");

$(document).on("click", ".remove", function () {
    const Id = $(this).data("id");
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
                    url: "/Journal/Delete",
                    data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), Id },
                    success: function (data) {
                        if (data.msg) $("#btnReload").trigger("click");
                    },
                    dataType: "json"
                });
            } else $("#txtKeyword").trigger("focus");
        }
    });
});

$(document).on('click', '#btnReload', function () {
    window.location.href = '/Journal/Index';
});

$(document).on('click', '.colheader', function () {
    $("#sortcol").val($(this).data("col"));
    //let $sortorder = $('<input>').attr({ type: 'hidden', name: 'SortOrder', value: $("#sortorder").val() });
    //let $sortcol = $('<input>').attr({ type: 'hidden', name: 'SortCol', value: $(this).data('col') });
    //let $keyword = $('<input>').attr({ type: 'hidden', name: 'Keyword', value: $(this).data('keyword') });
    $('#frmJournal').trigger("submit");
});

$(function () {
    forjournal = true;
    setFullPage();
    let $sortorder = $("#sortorder");
    let $sortcol = $("#sortcol");
    console.log($sortcol.val() + ";" + $sortorder.val());
    $target = $(".colheader").eq(<number>$sortcol.val());
    let sortcls =
        $sortorder.val() === "desc" ? "fa fa-sort-up" : "fa fa-sort-down";
    $target.addClass(sortcls);

    initModals();
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
