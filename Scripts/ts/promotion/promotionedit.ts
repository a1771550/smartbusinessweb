$infoblk = $("#infoblk");
editmode = Number($("#Id").val()) > 0;
let pro4period: boolean = true; //default true

$(document).on("change", ".protype", function () {
    pro4period = $(this).val() === "period";
    if (pro4period) {
        $("#periodblk").removeClass("hide");
        $("#qtyblk").addClass("hide");
        $(".discpc").trigger("focus");
    } else {
        $("#periodblk").addClass("hide");
        $("#qtyblk").removeClass("hide");
        $("#proQty").trigger("focus");
    }
});

function validatePromotion(): boolean {
    var falsecount = 0;
    promotion = fillPromotion();
    const $proname = $("#proName");
    if (promotion.proName === "") {
        falsecount++;
        $proname.next(".text-danger").removeClass("hide");
    }
    if (promotion.pro4Period) {
        if (promotion.JsDateFrm === "") {
            falsecount++;
            $("#proDateFrm").next(".text-danger").removeClass("hide");
        }
        if (promotion.JsDateTo === "") {
            falsecount++;
            $("#proDateTo").next(".text-danger").removeClass("hide");
        }
        if (promotion.proDiscPc === 0) {
            falsecount++;
            $(".prodiscpc").next(".text-danger").removeClass("hide");
        }
    } else {
        if (promotion.proQty === 0) {
            falsecount++;
            $("#proQty").next(".text-danger").removeClass("hide");
        }

        if (promotion.proPrice === 0 && promotion.proDiscPc === 0) {
            falsecount++;
            $(".pderr").removeClass("hide");
        }

        console.log("falsecount:" + falsecount);
    }
    // console.log("promotion:", promotion);
    return falsecount === 0;
}

$(document).on("click", "#btnSave", function () {
    if (validatePromotion()) {
        // console.log(promotion);
        // return;
        openWaitingModal();
        $.ajax({
            type: "POST",
            url: "/Promotion/Edit",
            data: {
                __RequestVerificationToken: $(
                    "input[name=__RequestVerificationToken]"
                ).val(),
                model: promotion,
            },
            success: function (data) {
                if (data) {
                    window.location.href = "/Promotion/Index";
                }
            },
            dataType: "json",
        });
    }
});

$(document).on("change", ".name", function () {
    const name: string = $(this).val() as string;
    if (name !== "") {
        $(".name").each(function (i, e) {
            if ($(e).val() === "") $(e).val(name);
        });
    }
});
$(document).on("change", ".desc", function () {
    const desc: string = $(this).val() as string;
    if (desc !== "") {
        $(".desc").each(function (i, e) {
            if ($(e).val() === "") $(e).val(desc);
        });
    }
});

$(function () {
    initModals();
    initDatePicker(
        "proDateFrm",
        editmode ? new Date($("#DateFrmDisplay").val() as string) : new Date(),
        false
    );
    initDatePicker(
        "proDateTo",
        editmode ? new Date($("#DateToDisplay").val() as string) : tomorrow,
        true
    );
    //   promotion = fillPromotion();
    $("#proName").trigger("focus");
});
