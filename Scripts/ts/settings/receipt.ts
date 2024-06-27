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
    triggerMenu(0, 2);
    $("#CompanyName").trigger("focus");
});