$infoblk = $("#infoblk");

$(document).on("click", "#btnAdd", function () {
    let $ele = $(this);
    let msg = $ele.data("userlicensefullprompt");
    if ($(this).hasClass("linkdisabled")) {
        $.fancyConfirm({
            title: "",
            message: msg,
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    $ele.trigger("focus");
                }
            }
        });
    } else {
        window.location.href = $(this).data("href");
    }
});
$("#btnAdd").hover(function () {
    console.log("hover");
    if ($(this).hasClass("linkdisabled")) {
        $(this).attr("title", $(this).data("userlicensefullprompt"));
    }
});


$(document).on("click", ".btndelete", function () {
	var userId = $(this).data("userid");
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					type: "POST",
					url: "/AccessRight/Delete",
					data: { "__RequestVerificationToken": $("input[name=__RequestVerificationToken]").val(),userId },
					success: function (data) {
						if(data)
							window.location.reload();
					},
					dataType: "json"
				});	
			} else {
				$(".btndelete").eq(0).trigger("focus");
            }
		}
	});
});

$(document).on("click", ".btnedit", function () {
	window.location.href = "/AccessRight/Edit?userId=" + $(this).data("userid");
});	

$(function () {
	setFullPage();
	initModals();
	gTblId = "tblUser";
	gFrmId = "frmUser";
	ConfigSimpleSortingHeaders();
	triggerMenu(11, 0);
});