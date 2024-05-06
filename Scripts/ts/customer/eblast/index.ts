$infoblk = $("#infoblk");

$(document).on("click", ".customer", function () {
	//console.log("eblastid:", $(this).data("id"));
	const blastId = Number($(this).data("id"));
	$.ajax({
		type: "GET",
		url: "/eBlast/GetCustomersByBlastId",
		data: {blastId},
		success: function (data:ICustomer[]) {
			//console.log(data);
			let cusCodes: string[] = [];
			if (data) {
				if (data.length > 0) {
					data.forEach((x) => { cusCodes.push(x.cusCode); });
					window.open("/Customer/Index?cusCodes=" + cusCodes.join(","), "_blank");
				} else {
					$.fancyConfirm({
						title: "",
						message: nodatafoundtxt,
						shownobtn: false,
						okButton: oktxt,
						noButton: notxt,
						callback: function (value) {
							if (value) {
								$("#txtKeyword").trigger("focus");
							}
						}
					});	

				}				
			}
		},
		dataType: "json"
	});
});
$(document).on("click", ".test", function () {
	console.log("id:" + $(this).data("id"));
	eblastId = <number>$(this).data("id");
	openTestEblastModal();
});


$(document).on("click", ".log", function () {
	let Id = $(this).data("id");
	window.open("/eBlast/Log?id=" + Id,"_self");	
})

$(document).on("click", ".start", function () {
	let Id = $(this).data("id");
	//console.log("Id:", Id);
	//return;
	openWaitingModal();
	$.ajax({
		type: "POST",
		url: "/eBlast/Start",
		data: { Id },
		success: function (data) {
			closeWaitingModal();
			console.log("data:", data);
			$.fancyConfirm({
				title: "",
				message: data.msg,
				shownobtn: false,
				okButton: closetxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						$("#txtKeyword").trigger("focus");
					}
				}
			});
		},
		dataType: "json"
	});
});

$(document).on("click", ".remove", function () {
	let Id = <number>$(this).data("id");
	let token = $("input[name=__RequestVerificationToken]").val();
	$.fancyConfirm({
		title: "",
		message: confirmremove,
		shownobtn: true,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					type: "POST",
					url: "/eBlast/Delete",
					data: { Id: Id, "__RequestVerificationToken": token },
					success: function () {
						window.location.reload();
					},
					dataType: "json"
				});
			}
		}
	});
});

$(document).on("click", "#btnReset", function () {
	$("#txtKeyword").val("").trigger("focus");
});

$(document).on("click", "#btnSearch", function () {
	keyword = <string>$("#txtKeyword").val();
	if (keyword !== "") {
		openWaitingModal();
		let $sortcol = $("<input>").attr({ type: "hidden", name: "Keyword", value: keyword.trim() });
		$("#frmBlast").append($sortcol).trigger("submit");
	}
});

$(function () {
	setFullPage();
	initModals();	
	gTblId = "tbleBlast";
	gFrmId = "frmBlast";
	triggerMenu(3, 0);

	pagesize = $infoblk.data("pagesize");

	ConfigSimpleSortingHeaders();
	
	initDatePickers(StartDayEnum.Beginning, "YYYY-MM-DD");
});