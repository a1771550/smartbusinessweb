$infoblk = $("#infoblk");
let itemoptions: IItemOptions = $infoblk.data("jsonitemoptions");

let pobatvqlist: IPoBatVQ[] = $infoblk.data("jsonpobatvqlist");
let batchqtylist: IBatchQty[] = $infoblk.data("jsonbatchqtylist");
let batsnvtlist: IBatSnVt[] = $infoblk.data("jsonbatsnvtlist");
snvtlist = $infoblk.data("jsonsnvtlist");

$(document).on("click", "#btnSave", function () {
    //todo: save itemoptions transfer
});

$(function () {
    initModals();
    console.log("pobatvqlist:", pobatvqlist);
    //console.log("batchqtylist:", batchqtylist);
    //console.log("batsnvtlist:", batsnvtlist);
    console.log("itemoptions:", itemoptions);
    console.log("snvtlist:", snvtlist);
    $(".tblTransfer tbody tr").each(function () {
        let tr = $(this);
        let trIsEmpty: boolean = false;

        if (itemoptions.ChkBatch && itemoptions.ChkSN && itemoptions.WillExpire) {
            tr.find("td:gt(0)").each(function () {
                let td = $(this);
                trIsEmpty = td.find("div").length === 0;
            });
        }
        if (itemoptions.ChkBatch && itemoptions.ChkSN && !itemoptions.WillExpire) {
            tr.find("td:eq(1)").each(function () {
                let td = $(this);
                trIsEmpty = td.find("div").length === 0;
            });
        }
        if (itemoptions.ChkBatch && !itemoptions.ChkSN && itemoptions.WillExpire) {
            tr.find("td:eq(2)").each(function () {
                let td = $(this);
                trIsEmpty = td.find("div").length === 0;
            });
        }

        if (trIsEmpty) tr.hide();
    });
});