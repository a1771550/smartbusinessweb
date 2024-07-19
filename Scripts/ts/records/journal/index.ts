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


$(function () {
    forjournal = true;
    setFullPage();
    gTblId = "tblJournal";
    gFrmId = "frmJournal";
    initModals();
    triggerMenuByCls("menujournals", 0);
    PageSize = $infoblk.data("pagesize");
    ConfigSimpleSortingHeaders();    
});
