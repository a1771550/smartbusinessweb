$infoblk = $("#infoblk");
debug = $infoblk.data("debug") === "True";
isLocal = $infoblk.data("islocal") === "True";
$(document).on("change", "input", function () {
    $("#msg").empty().addClass("hide");
});

$(document).on("change", "#Email", function () {
    if (debug) {
        // if (
        //   $(this).val() == "sunnyy@united.com.hk" ||
        //   $(this).val() == "enquiry@proview-med.com.hk" ||
        //   $(this).val() == "kevinlau@united.com.hk"
        // ) {
        $("#Password").val("Pos123456");
        // } else {
        //   $("#Password").val("123456").trigger("focus");
        // }
        /*  if ($(this).val() !== "") {*/
        $("#btnLogin").trigger("focus");
        //}
    }
    $("#btnLogin").trigger("focus");
});

function validform() {
    $target = $("#Email");
    let useremail = $target.val();
    let msg = "";
    if (useremail === "") {
        msg += $infoblk.data("useremailrequiredtxt") + "<br>";
        $target.trigger("focus");
    }

    $target = $("#Password");
    let password = $target.val();
    if (password === "") {
        msg += $infoblk.data("passwordrequiredtxt") + "<br>";
        $target.trigger("focus");
    } else {
        return true;
    }

    if (msg !== "") {
        $("#msg").removeClass("hide").empty().html(msg);
    }
}

$(document).on("click", "#btnLogin", function () {
    let redirecturl: string =
        getParameterByName("redirectUrl") ?? $infoblk.data("redirecturl");

    if (redirecturl !== "")
        redirecturl = redirecturl
            .concat("&ireadonly=")
            .concat(getParameterByName("ireadonly") ?? "0");
    $("#RedirectUrl").val(redirecturl);
    const url = "/Account/Login";
    //console.log("url:" + url);
    //console.log("redirecturl:" + redirecturl);
    //return false;
    let valid = validform();
    if (valid) {
        openWaitingModal();
        //return false
        $.ajax({
            type: "POST",
            url: url,
            data: $("#frmLogin").serialize(),
            success: function (data) {
                closeWaitingModal();
                //console.log("data:", data);
                //return false;
                if (data.msg === "ok") {
                    window.location.href = data.redirecturi;
                } else {
                    $("#msg").removeClass("hide").empty().text(data.msg);
                    // $.fancyConfirm({
                    //     title: '',
                    //     message: data.msg,
                    //     shownobtn: false,
                    //     okButton: oktxt,
                    //     noButton: canceltxt,
                    //     callback: function (value) {
                    //         if (value) {
                    //             $('#Email').trigger("focus");
                    //         }
                    //     }
                    // });
                }
            },
            dataType: "json",
        });
    }
});

$(document).on("change", "#SelectedShop", function () {
    if ($(this).val() !== "") {
        getRemoteData(
            "/Api/GetDevicesByShop",
            { shop: $(this).val() },
            getDevicesOk,
            getRemoteDataFail
        );
    }
});

function getDevicesOk(data) {
    // console.log(data);
    if (data !== null) {
        let devices = data.devices.slice(0);
        if (devices.length > 0) {
            $target = $("#SelectedDevice");
            $target.empty();
            $.each(devices, function (i, e) {
                $("<option />", { value: e.dvcCode, text: e.dvcName }).appendTo(
                    $target
                );
            });
        }
    }
}

function toggleCRM() {
    if (enableCRM) {
        $("#loginmodeblk").removeClass("hide");
        $("#loginMode").attr("name", "").val("");
    } else {
        $("#loginmodeblk").addClass("hide");
        $("#loginMode").attr("name", "LoginMode").val("pos");
    }
}

$("input").on("keydown", function (event) {
    var keycode = event.key;
    if (Number(keycode) == 13) {
        document.getElementById("btnLogin")!.click();
        return false;
    } else {
        return true;
    }
});

$(function () {
    localStorage.removeItem("sessionstartdata");
    $(".noncentral").show();
    initModals();

    $("#RedirectUrl").val(getParameterByName("redirectUrl") as string);

    var salesmanId = Number(getParameterByName("salesmanId") ?? 0);
    var adminId = Number(getParameterByName("adminId") ?? 0);
    var receiptno = getParameterByName("receiptno");

    if ((salesmanId == 0 && adminId == 0) || receiptno == null) {
        if (isLocal) {
            //$("#Email").val("sunnyy@united.com.hk");
            $("#Email").val("utservice@united.com.hk");
            //$("#Email").val("enquiry@united.com.hk");     
            $("#Password").val("Pos123456");
            $("#btnLogin").trigger("focus");
        } else {
            $("#Email").trigger("focus");
            //$.getJSON('https://api.ipify.org?format=jsonp&callback=?', function (data) {
            //    //console.log(JSON.stringify(data, null, 2));
            //    console.log("debug:", debug);
            //    let ip = data.ip;
            //    console.log("ip:" + ip);
            //    if (debug) {                    
            //        $("#Email").val("sunnyy@united.com.hk");
            //        //$("#Email").val("utservice@united.com.hk");
            //        //$("#Email").val("enquiry@united.com.hk");     
            //        $("#Password").val("Pos123456");
            //        $("#btnLogin").trigger("focus");
            //    } else {
            //        if (ip == "58.177.211.54" || ip == "210.3.183.162") {
            //            $("#Email").val("sunnyy@united.com.hk");
            //            $("#Password").val("Pos123456");
            //            $("#btnLogin").trigger("focus");
            //        } else {
            //            $("#Email").trigger("focus");
            //        }
            //    }
            //});
        }
    }

    if (receiptno != null) {
        $("#Email").val("enquiry@united.com.hk");
        if (salesmanId != 0) {
            $("#Email").val(
                salesmanId === 6 ? "sunnyy@united.com.hk" : "utservice@united.com.hk"
            );
        }
        if (debug) $("#Password").val("Pos123456");

        $("#btnLogin").trigger("focus");
    }
    // var salesmanemail = getParameterByName("salesmanemail");
    // if (salesmanemail != null) {
    //   $("#Email").val(salesmanemail);
    //   $("#Password").val("").trigger("focus");
    // }

    enableCRM = $infoblk.data("enablecrm") == "True";
    toggleCRM();

    $("#loginblk").defaultButton("#btnLogin");
});
