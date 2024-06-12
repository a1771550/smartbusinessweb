$infoblk = $("#infoblk");


$(document).on("change", "#chkpass", function () {
	if (editmode) {
		checkpass = $(this).is(":checked");

		if (checkpass) {		
			$("#passblk").removeClass("hide");
			$("#currpass").attr("name", "");
			$("#Password").attr("name", "Password");
		} else {			
			$("#passblk").addClass("hide");
			$("#currpass").attr("name", "Password");
			$("#Password").attr("name", "");
		}
	}
});

function validform_ar(): boolean {
	let msg = "";
	$target = $("#UserName");
	let username = $target.val();
	if (username === "") {
		msg += usernamerequiredtxt + "<br>";
		$target.addClass("focus");
	}

	$target = $("#Email");
	let email = $target.val();
	if (email !== "" && !validateEmail(email)) {
		msg += emailformaterr + "<br>";
		$target.addClass("focus");
	}

	if (checkpass) {
		$target = $("#Password");
		let password = <string>$target.val();
		if (password === "") {
			msg += passwordrequiredtxt + "<br>";
			$target.addClass("focus");
		} else if (password.length < 6 && password.length > 10) {
			msg += passwordstrengtherrtxt + "<br>";
			$target.addClass("focus");
		}

		$target = $("#ConfirmPassword");
		let confirmpass = <string>$target.val();
		if (confirmpass === "") {
			msg += confirmpassrequiredtxt + "<br>";
			$target.addClass("focus");
		} else {
			if (password !== confirmpass) {
				msg += passconfirmpassnotmatchtxt + "<br>";
				$target.addClass("focus");
			}
		}
	}

	if (msg !== "") {
		$.fancyConfirm({
			title: "",
			message: msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(".focus").eq(0).trigger("focus");
				}
			},
		});
	}

	return msg === "";
}
function FillInUser() {
	user = {} as ISysUser;
	user.surUID = Number($("#surUID").val());
	user.UserCode= $("#UserCode").val() as string;
	user.UserName= $("#UserName").val() as string;
	user.Password = $("#Password").val() as string;
	user.Email = $("#Email").val() as string;
	user.ManagerId = Number($("#drpPosAdmin").val());
	user.checkpass = $("#checkpass").is(":checked");
	user.FuncCodes = [];
	$(".chkcode").each(function (i, e) {
		if ($(e).is(":checked")) user.FuncCodes.push($(e).val() as string);
	});
}
$(document).on("click", "#btnSave", function (e) {
	e.preventDefault();
	FillInUser();
	if (validform_ar()) {
		//console.log("user:", user);
		//return;
		openWaitingModal();
		$.ajax({
			type: "POST",
			url: "/AccessRight/Edit",
			data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), model:user },
			success: function (data) {
				if (data) window.location.href = "/AccessRight/Index";
			},
			dataType: "json"
		});

	}
});

$(function () {
	setFullPage();
	initModals();
	triggerMenu(11, 4);

	editmode = Number($("#surUID").val()) > 0;

	if (editmode) {
		$("#chkpassblk").show();
		checkpass = false;		
		$("#passblk").addClass("hide");
		$("#currpass").attr("name", "Password");
		$("#Password").attr("name", "");
	} else {
		$("#chkpassblk").hide();
		$("#passblk").removeClass("hide");
	}

	if ($infoblk.data("debug") == "1") {
		const password = "Pos123456";
		$("#Password").val(password);
		$("#ConfirmPassword").val(password);
	}

	$("#UserName").trigger("focus");
});