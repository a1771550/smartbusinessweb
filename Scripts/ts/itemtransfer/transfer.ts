$infoblk = $("#infoblk");
let itemoptions: IItemOptions = $infoblk.data("jsonitemoptions");

let pobatvqlist: IPoBatVQ[] = $infoblk.data("jsonpobatvqlist");
let batchqtylist: IBatchQty[] = $infoblk.data("jsonbatchqtylist");
let batdelqtylist: IBatDelQty[] = $infoblk.data("jsonbatdelqtylist");

let batsnvtlist: IBatSnVt[] = $infoblk.data("jsonbatsnvtlist");

let vtqtylist: IVtQty[] = $infoblk.data("jsonvtqtylist");
let vtdelqtylist: IVtDelQty[] = $infoblk.data("jsonvtdelqtylist");

itemOptions = $infoblk.data("itemoptions");

snvtlist = $infoblk.data("jsonsnvtlist");

$(document).on("click", "#btnSave", function () {
    console.log(TransferList);
    //return;
    if (TransferList.length > 0) {
        $.ajax({
            type: "POST",
            url: "/Transfer/ProcessTransferIO",
            data: {
                __RequestVerificationToken: $(
                    "input[name=__RequestVerificationToken]"
                ).val(),               
                TransferList,
            },
            success: function (data) {
                if (data) {
                    $.fancyConfirm({
                        title: "",
                        message: data.msg,
                        shownobtn: false,
                        okButton: oktxt,
                        noButton: notxt,
                        callback: function (value) {
                            if (value) {
                                window.location.href="/Transfer/Index";
                                window.open("/Transfer/Print", "_blank");
                                //window.location.href = '/Transfer/Print';
                            }
                        },
                    });
                }
            },
            dataType: "json",
        });
    }
});

$(function () {
    initModals();
    //console.log("itemoptions:", itemOptions);
    //console.log("pobatvqlist:", pobatvqlist);
    //console.log("batchqtylist:", batchqtylist);
    //console.log("batdelqtylist:", batdelqtylist);
    //console.log("batsnvtlist:", batsnvtlist);
    //console.log("itemoptions:", itemoptions);
    //console.log("snvtlist:", snvtlist);
    console.log("vtqtylist:", vtqtylist);
    console.log("vtdelqtylist:", vtdelqtylist);

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

    if (itemOptions!.ChkBatch) {
        if ((itemOptions!.ChkSN && itemOptions!.WillExpire) || (itemOptions!.ChkSN && !itemOptions!.WillExpire))//all || bat & sn (no vt)
            $(".tblTransfer").eq(1).find("tbody tr").first().find("td").eq(1).find(".chkbatsnvt").first().trigger("focus");
        if (!itemOptions!.ChkSN && !itemOptions!.WillExpire) //bat only
            $(".tblTransfer").eq(1).find("tbody tr").first().find("td").first().find("input").first().trigger("focus");
        if (!itemOptions!.ChkSN && itemOptions!.WillExpire) //bat & vt (no sn)
            $(".tblTransfer").eq(1).find("tbody tr").first().find("td").last().find("input").first().trigger("focus");
    } else {
        if (itemOptions!.ChkSN && itemOptions!.WillExpire || (itemOptions!.ChkSN && !itemOptions!.WillExpire)) {
            $(".tblTransfer").eq(1).find("tbody tr").first().find("td").eq(1).find(".chksnvt").first().trigger("focus");
        }
        //vt only
        if (!itemOptions!.ChkSN && itemOptions!.WillExpire) {
            $(".tblTransfer").eq(1).find("tbody tr").first().find("td").last().find("input").first().trigger("focus");
             
        }
    }

    TransferList = [];
});