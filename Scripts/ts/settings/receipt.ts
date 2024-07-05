$infoblk = $("#infoblk");

$(document).on("click", "#btnSave", function () {
    if (validReForm()) {
        $("#frmReceipt").trigger("submit");
    }
});

function validReForm() {
    let msg = "";
    return msg === "";
}

$(function () {
    setFullPage();
    initModals();
    triggerMenuByCls("menusetup", 2);
    $("#CompanyName").trigger("focus");
});