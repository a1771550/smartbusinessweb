$infoblk = $("#infoblk");
const password = "123456Pos"; //123456Pos;Pos123456

$(function () {
	localStorage.removeItem("sessionstartdata");
	$(".noncentral").show();
	isLocal = $infoblk.data("islocal") === "True";
	initModals();

	$("#RedirectUrl").val(getParameterByName("redirectUrl") as string);

	var salesmanId = Number(getParameterByName("salesmanId") ?? 0);
	var adminId = Number(getParameterByName("adminId") ?? 0);
	var receiptno = getParameterByName("receiptno");

	if ((salesmanId == 0 && adminId == 0) || receiptno == null) {
		if (isLocal) {
			//$("#Email").val("utservice_sb1@united.com.hk");
			//$("#Email").val("sunnyy@united.com.hk");
			//$("#Email").val("utservice@united.com.hk");
			 $("#Email").val("enquiry@united.com.hk");     
			$("#Password").val(password);
			//$("#btnLogin").trigger("click");
		} else {
			$("#Email").trigger("focus");
		}
	}

	if (receiptno != null) {
		$("#Email").val("enquiry@united.com.hk");
		if (salesmanId != 0) {
			$("#Email").val(
				salesmanId === 6 ? "sunnyy@united.com.hk" : "utservice@united.com.hk"
			);
		}
		if (isLocal) $("#Password").val(password);

		$("#btnLogin").trigger("focus");
	}

	$("#apId").val(1);
	$("#loginblk").defaultButton("#btnLogin");
});
$(document).on("change", "input", function () {
	$("#msg").empty().addClass("hide");
});

$(document).on("change", "#Email", function () {
	if (isLocal) $("#Password").val(password);
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
	const url = "/Account/Login";
	let valid = validform();
	if (valid) {
		$.ajax({
			type: "POST",
			url: url,
			data: $("#frmLogin").serialize(),
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

$("input").on("keydown", function (event) {
	var keycode = event.key;
	if (Number(keycode) == 13) {
		document.getElementById("btnLogin")!.click();
		return false;
	} else {
		return true;
	}
});





