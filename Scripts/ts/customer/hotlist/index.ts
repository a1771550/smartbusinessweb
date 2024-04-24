$infoblk = $('#infoblk');

$(document).on('click', '.remove', function () {
    let Id: number = Number($(this).data('id'));
    $.fancyConfirm({
        title: '',
        message: confirmremovetxt,
        shownobtn: true,
        okButton: oktxt,
        noButton: notxt,
        callback: function (value) {
            if (value) {
                $.post({
                    url: "/HotList/Delete",
                    data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), 'Id': Id }                    
                }).done(function () {
                    window.location.reload();
                });
            } else {
                $('#txtKeyword').trigger("focus");
            }
        }
    });
});

$('#btnReload').on('click', function (e) {
    e.stopPropagation();
    $('#txtKeyword').val('');
    window.location.href = `/HotList/Index`;
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

    $("#frmHotList")
        .append($sortcol)
        .append($keyword)       
        .trigger("submit");
});
$(function () {
    forhotlist = true;
    setFullPage();
    gTblId = "tblHotList";
    triggerMenu(1, 3);
    initModals();

    let $sortorder = $("#sortorder");
    let $sortcol = $("#sortcol");
    //console.log('sortorder:' + $sortorder.val() + ';sortcol:' + $sortcol.val());
    $target = $(".colheader").eq(<number>$sortcol.val());
    let sortcls =
        $sortorder.val() === "desc" ? "fa fa-sort-up" : "fa fa-sort-down";
    $target.addClass(sortcls);

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

   
    $('#txtKeyword').trigger("focus");
});
