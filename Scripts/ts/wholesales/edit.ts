﻿$infoblk = $("#infoblk");
enableSN = true;
let recurOrderList: IRecurOrder[] = [];

$(document).on("click", "#btnSaveDraft", function () {
	FillInWholeSales();
	updateWholesales();
	//console.log("WholeSales:", WholeSales);
	// console.log("recurOrder:", recurOrder);
	//console.log("WholeSalesLns:", WholeSalesLns);
	//return;
	openWaitingModal();
	$.ajax({
		type: "POST",
		url: "/WholeSales/SaveDraft",
		data: {
			__RequestVerificationToken: $(
				"input[name=__RequestVerificationToken]"
			).val(),
			model: WholeSales,
			wslnList: WholeSalesLns,
			recurOrder,
		},
		success: function (data) {
			closeWaitingModal();
			if (data) {
				window.location.href = "/WholeSales/Index";
			}
		},
		dataType: "json",
	});
});
$(document).on("change", "#chkDelAddr", function () {
	if ($(this).is(":checked")) {
		$("#txtDelAddr").removeClass('hide').trigger("focus");
		$("#drpDeliveryAddr").hide();
	}
	else {
		$("#txtDelAddr").addClass('hide');
		$("#drpDeliveryAddr").show();
		let $drpaddr = fillInAddressList();
		WholeSales.wsDeliveryAddressId = deliveryAddressId =
			$drpaddr.val() as number;
		$drpaddr.trigger("focus");
	}

});
$(document).on("change", ".delqty", function () {
	currentY = getCurrentY(this);
	//console.log("currentY@delqtychange:" + currentY);
	updateRow(getRowPrice(), getRowDiscPc());
});

function GetRecurOrders(pageIndex) {
	let data = `{cusCode:"${selectedCus.cusCode}",PageNo:${pageIndex},sortName:"${sortName}",sortDirection:"${sortDirection}",sortCol:"${sortCol}"}`;
	if (typeof keyword !== "undefined" && keyword !== "") {
		data = `{cusCode:"${selectedCus.cusCode}",PageNo:${pageIndex},sortName:"${sortName}",sortDirection:"${sortDirection}",sortCol:"${sortCol}",keyword:"${keyword}"}`;
	} else {
		data = `{cusCode:"${selectedCus.cusCode}",PageNo:${pageIndex},sortName:"${sortName}",sortDirection:"${sortDirection}",sortCol:"${sortCol}",keyword:""}`;
	}
	// console.log("data:", data);
	/*return false;*/
	openWaitingModal();
	$.ajax({
		url: "/Api/GetRecurOrdersAjax",
		type: "POST",
		data: data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: OnGetRecurOrderSuccess,
		error: onAjaxFailure,
	});
}
function OnGetRecurOrderSuccess(response) {
	keyword = "";
	closeWaitingModal();
	console.log("response:", response);
	recurOrderList = response.orderlist
		? (response.orderlist as Array<IRecurOrder>).slice(0)
		: [];

	if (recurOrderList != null && recurOrderList.length > 0) {
		fillRecurOrderList(recurOrderList);
		$(".RecurPager").ASPSnippets_Pager({
			ActiveCssClass: "current",
			PagerCssClass: "pager",
			PageIndex: response.PageIndex,
			PageSize: response.PageSize,
			RecordCount: response.RecordCount,
		});
		recurOrder!.Mode = "list";

		$target = $(".colheader").eq(sortCol);
		$target.addClass("fa");
		if (sortDirection.toUpperCase() == "DESC") {
			sortDirection = "ASC";
			$target.removeClass("fa-sort-up").addClass("fa-sort-down");
		} else {
			sortDirection = "DESC";
			$target.removeClass("fa-sort-down").addClass("fa-sort-up");
		}

		openRecurOrderModal();
	} else {
		$.fancyConfirm({
			title: "",
			message: nodatafoundtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					togglePaging("order", false);
				}
			},
		});
	}
}
$(document).on("click", ".RecurPager .page", function () {
	PageNo = Number($(this).attr("page"));
	GetRecurOrders(PageNo);
});
$(document).on("click", "#tblRecurOrder th", function () {
	sortName = $(this).data("category");
	sortCol = Number($(this).data("col"));
	//sortDirection = sortDirection.toUpperCase() == "ASC" ? "DESC" : "ASC";
	PageNo = 1;
	GetRecurOrders(PageNo);
});

function fillRecurOrderList(model: IRecurOrder[]) {
	let html = "";
	$.each(model, function () {
		const order = this;
		// console.log("order:", order);
		html += `<tr class="orderId pointer" data-orderid="${order.wsUID}" data-code="${order.wsCode}">`;
		html += `<td style="width:150px;max-width:150px;">${order.Name}</td>`;
		html += `<td class="small">${order.ItemsNameDesc}</td>`;
		html += `<td style="width:120px;min-width:120px;">${order.LastPostedDateDisplay}</td>`;
		html += `<td class="text-right" style="width:100px;max-width:100px;">${formatnumber(
			order.TotalSalesAmt
		)}</td>`;
		html += `<td style="width:100px;min-width:100px;"><button class="btn btn-danger removeorder" data-id="${order.wsUID}" onclick="removeRecurOrder(${order.wsUID});"><span class="small">${removetxt}</span></td>`;
		html += "</tr>";
	});
	$("#tblRecurOrder tbody").empty().html(html);
}

function removeRecurOrder(orderId: number) {
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					//contentType: 'application/json; charset=utf-8',
					type: "POST",
					url: "/Api/RemoveRecurOrder",
					data: {
						__RequestVerificationToken: $(
							"input[name=__RequestVerificationToken]"
						).val(),
						orderId,
					},
					success: function (data) {
						if (data) {
							recurOrderList.splice(
								recurOrderList.findIndex((v) => { return v.wsUID === orderId; }),
								1
							);
							console.log("recurorderlist after removal:", recurOrderList);
							fillRecurOrderList(recurOrderList);
							openRecurOrderModal();
						}
					},
					dataType: "json",
				});
			} else {
				recurOrderModal.find(".btnsave").trigger("focus");
			}
		},
	});
}

$(document).on("click", "#btnUseRecur", function () {
	if (selectedCus.cusCode.toLowerCase() === "guest") {
		$.fancyConfirm({
			title: "",
			message: customerrequiredtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function () {
				$(".txtCustomerName").first().trigger("focus");
			},
		});
	} else {
		recurOrder = initRecurOrder();
		GetRecurOrders(1);
	}
});

$(document).on("click", "#btnSave", function () {
	handleSubmit4WholeSales();
});

$(document).on("click", "#btnEdit", function () {
	window.location.href = `/WholeSales/Review?receiptno=${WholeSales.wsCode}&mode=editapproved`;
});

$(document).on("click", ".btnSaveRecur", function () {
	if (validateWSIForm()) {
		recurOrder = initRecurOrder();
		recurOrder.Mode = "save";
		$("#deliveryDate").val("");
		openRecurOrderModal();
	}
});

$(document).on("click", ".btnRequestApproval", function () {
	handleSubmit4WholeSales();
});

$(document).on("click", "#btnInvoice", function () {
	$(".btnSave").removeClass("hide");
	$(".request").addClass("hide");
	//console.log('invoice clicked');
	if (WholeSales.wsStatus.toLowerCase() === "deliver") {
		$("body").addClass("deliverbg");
		$("#status").text("Deliver");
	}
	else if (WholeSales.wsStatus.toLowerCase() === "partialdeliver") {
		$("body").addClass("partialdeliverbg");
		$("#status").text("PartialDeliver");
	}
	else {
		$("body").addClass("billbg");
		WholeSales.wsStatus = "invoice";
		$("#status").text("Invoice");
		$(this).addClass("disabled").off("click");
	}

	$target = $(`#${gTblId}`);

	let isInvoice: boolean = WholeSales.wsStatus.toLowerCase() === "invoice";
	if (isInvoice) {
		let $theadtr = $target.find("thead tr:first");
		$target.find("colgroup").find(".hide").removeClass("hide");
		$theadtr.find("td.hide").removeClass("hide");
	}

	//remove the last row for invoice
	if (WholeSales.wsStatus.toLowerCase() !== "order") {
		// $target.find("tbody tr:last").remove();
		let idx = -1;
		$target.find("tbody tr").each(function (i, e) {
			if ($(e).find("td").eq(1).find(".itemcode").val() === "") {
				idx = i;
				return false;
			}
		});
		if (idx >= 0) {
			$target.find("tbody tr").eq(idx).remove();
		}
	}

	$target.find("tbody tr").each(function (i, e) {
		const salesln: IWholeSalesLn = WholeSalesLns.filter(
			(x) => x.wslSeq == i + 1
		)[0];
		const orderqty = salesln ? salesln.wslQty : -1;
		let $qty = $(e)
			.find("td")
			.eq(4);
		$qty.find(".qty").prop("readonly", isInvoice);
		$qty.after(
			`<td><input type="number" min="0" max="${orderqty}" data-qty="0" name="delqty" class="delqty text-right flex" value="${orderqty}" /></td>`
		);

		let itemcode: string = $(e)
			.find("td:eq(1)")
			.find(".itemcode")
			.val() as string;

		if (!itemcode) return false;

		let _seq = Number($(e).data("idx")) + 1;
		//console.log("_seq:" + _seq);           
		let batmsg: string = "";
		let snmsg: string = "";
		let vtmsg: string = "";
		let missingtxt: string = "";
		let batinput = "";
		let batcls = "batch";
		let sninput = "";
		let sncls = "serialno";
		let vtinput = "";
		let vtcls = "validthru";
		let pointercls = "";

		let variinput;

		itemOptions = DicItemOptions[itemcode];
		//if (!itemOptions) return false;

		let readonly = "";

		if (itemOptions) {
			if (itemOptions.ChkBatch) {
				batcls = "batch pointer focus";
				if (
					!(itemcode in DicItemBatchQty) ||
					DicItemBatchQty[itemcode].length === 0
				) {
					missingtxt = itemoptionsinfomissingformat.replace("{0}", batchtxt);
					batcls = "itemoptionmissing";
					batmsg = `${missingtxt} ${purchaserequiredmsg}`;
				}
			}

			if (itemOptions.ChkSN) {
				sncls = "serialno pointer focus";
				if (itemOptions.ChkBatch) {
					if (!(itemcode in DicItemBatSnVtList)) {
						missingtxt = itemoptionsinfomissingformat.replace(
							"{0}",
							serialnotxt
						);
						sncls = "itemoptionmissing";
						snmsg = `${missingtxt} ${purchaserequiredmsg}`;
					} else {
						if (DicItemSnVtList[itemcode].length === 0) {
							missingtxt = itemoptionsinfomissingformat.replace(
								"{0}",
								serialnotxt
							);
							sncls = "itemoptionmissing";
							snmsg = `${missingtxt} ${purchaserequiredmsg}`;
						} else {
							sncls = "serialno focus";
						}
					}
				}
				if (itemOptions.WillExpire) {
					if (!(itemcode in DicItemSnVtList)) {
						missingtxt = itemoptionsinfomissingformat.replace(
							"{0}",
							serialnotxt
						);
						sncls = "itemoptionmissing";
						snmsg = `${missingtxt} ${purchaserequiredmsg}`;
					} else {
						if (DicItemSnVtList[itemcode].length === 0) {
							missingtxt = itemoptionsinfomissingformat.replace(
								"{0}",
								serialnotxt
							);
							sncls = "itemoptionmissing";
							snmsg = `${missingtxt} ${purchaserequiredmsg}`;
						}
					}
				}
			}

			let vtdisabled = "";
			if (itemOptions.WillExpire) {
				vtdisabled =
					!itemOptions.ChkBatch && !itemOptions.ChkSN
						? ""
						: itemOptions.ChkBatch || itemOptions.ChkSN
							? "disabled"
							: "";
				vtcls = "validthru focus";
				pointercls = itemOptions.ChkBatch || itemOptions.ChkSN ? "" : "pointer";
				if (!(itemcode in DicItemVtQtyList)) {
					missingtxt = itemoptionsinfomissingformat.replace(
						"{0}",
						expirydatetxt
					);
					vtmsg = `${missingtxt} ${purchaserequiredmsg}`;
					vtcls = "itemoptionmissing";
				} else {
					if (
						DicItemVtQtyList[itemcode].length === 0 &&
						!itemOptions.ChkBatch &&
						!itemOptions.ChkSN
					) {
						missingtxt = itemoptionsinfomissingformat.replace(
							"{0}",
							expirydatetxt
						);
						vtmsg = `${missingtxt} ${purchaserequiredmsg}`;
						vtcls = "itemoptionmissing";
					}
				}
			}
			readonly =
				!itemOptions.ChkBatch && !itemOptions.ChkSN && !itemOptions.WillExpire
					? ""
					: "readonly";
			let nonitemoptionscls =
				!itemOptions.ChkBatch && !itemOptions.ChkSN && !itemOptions.WillExpire
					? "nonitemoptions"
					: "";

			let ivpointer = !itemOptions.ChkBatch && !itemOptions.ChkSN && !itemOptions.WillExpire ? "pointer" : "";
			let ivcls = (!$.isEmptyObject(DicIvInfo) && itemcode in DicIvInfo && DicIvInfo[itemcode].length > 0) ? `vari focus ${ivpointer}` : "disabled";

			batinput = `<input type="text" data-type="bat" class="text-center ${nonitemoptionscls} ${batcls}" title="${batmsg}" ${readonly} />`;
			sninput = `<input type="text" data-type="sn" class="text-center ${nonitemoptionscls} ${sncls}" title="${snmsg}" ${readonly} />`;
			vtinput = `<input type="text" data-type="vt" class="text-center ${nonitemoptionscls} ${vtcls} ${pointercls}" title="${vtmsg}" ${vtdisabled} ${readonly} />`;
			//itemvari
			variinput = `<input type="text" data-type="iv" name="vari" class="text-center ${ivcls}"  />`;
		}

		$(e)
			.find("td")
			.eq(5)
			.after(
				`<td class="text-center">${batinput}</td><td class="text-center">${sninput}</td><td class="text-center">${vtinput}</td><td class="text-center">${variinput}</td>`
			);

		$(e)
			.find("td")
			.eq(-2)
			.find(".job")
			.addClass("disabled")
			.prop("disabled", true);
		$(e)
			.find("td")
			.eq(-3)
			.find(".location")
			.addClass("disabled")
			.prop("disabled", true);

		$.each(WholeSalesLns, function (idx, ele) {
			if (
				ele.wslItemCode.toString().toLowerCase() == itemcode.toLowerCase() &&
				ele.wslSeq == _seq
			) {
				// console.log("missingtxt:" + missingtxt);
				ele.MissingItemOptions = missingtxt !== "";
			}
		});
	});

	$target
		.find("tbody tr:first")
		.find("td")
		.eq(5)
		.find(".delqty")
		.trigger("focus");
	setValidThruDatePicker();
});

$(document).on("change", ".totalbatdelqty", function () {
	let maxqty: number = <number>$(this).data("maxqty");
	if (($(this).val() as number) > maxqty) {
		$(this).val(maxqty);
	}
});

function updateWholesales() {
	const isInvoice: boolean = WholeSales.wsStatus == "invoice";
	WholeSales.wsDeliveryAddressId = Number($("#drpDeliveryAddr").val());
	WholeSales.wsSalesLoc = $("#drpLocation").val() as string;
	WholeSales.wsAllLoc = $("#chkAllLoc").is(":checked");

	const $selector = $(`#${gTblId} tbody tr`);
	let salesamt: number = 0;
	$selector.each(function (i, e) {
		const itemoptionmissing: boolean = $(e)
			.find("td")
			.find("input")
			.hasClass("itemoptionmissing");
		const itemcode = $(e).find(".itemcode").val();
		if (!itemcode) return false;

		let seq = parseInt(<string>$(e).find("td:first").text());
		if (WholeSalesLns.length > 0) {
			SelectedWholeSalesLn = WholeSalesLns.filter(
				(x) => x.wslSeq == seq
			)[0];
			if (!SelectedWholeSalesLn) SelectedWholeSalesLn = initWholeSalesLn();
		} else {
			SelectedWholeSalesLn = initWholeSalesLn();
		}
		SelectedWholeSalesLn.wslUID = Number($(e).data("id"));
		SelectedWholeSalesLn.MissingItemOptions = itemoptionmissing;

		SelectedWholeSalesLn.wslStatus = WholeSales.wsStatus;
		SelectedWholeSalesLn.wslItemCode = <string>(
			$(e).find(".itemcode").val()
		);
		SelectedWholeSalesLn.wslSeq = seq;
		SelectedWholeSalesLn.itmNameDesc = <string>(
			$(e).find(".itemdesc").data("itemname")
		);
		SelectedWholeSalesLn.wslDesc = <string>(
			$(e).find(".itemdesc").val()
		);
		SelectedWholeSalesLn.wslSellUnit = <string>(
			$(e).find(".sellunit").val()
		);
		let qty = 0;
		qty = Number($(e).find(".qty").val());
		SelectedWholeSalesLn.wslQty = qty;

		if (isInvoice) {
			SelectedWholeSalesLn.wslDelQty = Number($(e).find(".delqty").val());;
		}

		SelectedWholeSalesLn.wslHasSn =
			SelectedWholeSalesLn.snvtList && SelectedWholeSalesLn.snvtList.length > 0;

		SelectedWholeSalesLn.JsValidThru = $(e).find(".validthru").val() as string ?? "";

		let _price: number = Number($(e).find(".price").val());
		SelectedWholeSalesLn.wslSellingPrice = _price;

		let _discpc: number = Number(
			$(e).find(".discpc").val()
		);
		SelectedWholeSalesLn.wslLineDiscPc = _discpc;

		SelectedWholeSalesLn.wslLineDiscAmt =
			SelectedWholeSalesLn.wslSellingPrice *
			(SelectedWholeSalesLn.wslLineDiscPc / 100) *
			qty;

		if (enableTax && !inclusivetax) {
			SelectedWholeSalesLn.wslTaxPc = Number(
				$(e).find(".taxpc").val()
			);
			SelectedWholeSalesLn.wslTaxAmt =
				SelectedWholeSalesLn.wslSellingPrice *
				(1 - SelectedWholeSalesLn.wslLineDiscPc / 100) *
				(SelectedWholeSalesLn.wslTaxPc / 100) *
				qty;
		}

		SelectedWholeSalesLn.wslStockLoc = $(e)
			.find(".location")
			.val() as string;
		SelectedWholeSalesLn.JobID = Number($(e)
			.find(".job")
			.val());
		let _amt: number = Number($(e).find(".amount").val());
		// console.log("_amt:" + _amt);
		SelectedWholeSalesLn.wslSalesAmt = _amt;
		// console.log(selectedWholesalesLn);
		salesamt += _amt;

		if (WholeSalesLns.length > 0) {
			let idx = -1;
			$.each(WholeSalesLns, function (i, e) {
				//console.log("selectedWholesalesLn!.wslSeq:" + selectedWholesalesLn!.wslSeq + ";e.wlseq:" + e.wslSeq);
				if (e.wslSeq == SelectedWholeSalesLn!.wslSeq) {
					e = structuredClone(SelectedWholeSalesLn)!;
					//console.log("idx#loop:" + idx);
					idx = i;
					return false;
				}
			});
			//console.log("idx:" + idx);
			if (idx === -1) {
				//console.log("push#1");
				WholeSalesLns.push(SelectedWholeSalesLn);
			}
		} else {
			//console.log("push#0");
			WholeSalesLns.push(SelectedWholeSalesLn);
		}

	});

	WholeSales.wsFinalTotal = itotalamt = salesamt;

	$("#txtTotal").val(formatnumber(itotalamt));

	focusItemCode();

	//reset variables:
	isPromotion = !isPromotion;
}

function handleSubmit4WholeSales(forRecurOrder: boolean = false) {
	if (validateWSIForm()) {
		//add those itemoptionless items:
		if (WholeSales.wsStatus == "invoice") {
			//console.log("ready to updatewholesales#invoice");
			updateWholesales();
			if ($(`#${gTblId} .focus`).length > 0) {
				let msg = `${salesinfonotenough}<br>`;
				$.fancyConfirm({
					title: "",
					message: msg,
					shownobtn: false,
					okButton: oktxt,
					noButton: notxt,
				});
			} else {
				if ($(`#${gTblId} tbody tr`).length > 0) {

					$(`#${gTblId} tbody tr`).each(function (i, e) {
						//	const itemcode: string = $(e).find(".itemcode").val()!.toString();
						//todo:handle ItemVari
						//	if (!(itemcode in DicIvInfo) || DicIvInfo[itemcode].length === 0) {

						let nonitemoptions = $(e).find(".nonitemoptions").length;

						if (nonitemoptions > 0) {
							let deliveryItem: IDeliveryItem = initDeliveryItem();
							deliveryItem.dlCode = `noio${i}`;

							deliveryItem.seq = Number($(e).find("td").first().text());

							deliveryItem.itmCode = $(e)
								.find(".itemcode")
								.val() as string;

							deliveryItem.dlBaseUnit = $(e)
								.find(".sellunit")
								.val() as string;

							deliveryItem.dlQty = Number(
								$(e).find(".delqty").val()
							);

							deliveryItem.dlUnitPrice = Number(
								$(e).find(".price").val()
							);

							deliveryItem.dlDiscPc = Number(
								$(e).find(".discpc").val()
							);

							if (enableTax && !inclusivetax) {
								deliveryItem.dlTaxPc = Number(
									$(e).find(".taxpc").val()
								);

							}

							deliveryItem.dlStockLoc = $(e).find(".location").val() as string;

							deliveryItem.JobID = Number($(e).find(".job").val());

							deliveryItem.dlAmt = deliveryItem.dlAmtPlusTax = Number(
								$(e).find("td").last().find(".amount").val()
							);
							DeliveryItems.push(deliveryItem);
						}

					});
					//console.log("DeliveryItems:", DeliveryItems);
					//console.log("WholeSalesLns:", WholeSalesLns);
					//return false;
					if (DeliveryItems.length === 0) {
						$.fancyConfirm({
							title: "",
							message: stockqtynotenoughtxt,
							shownobtn: false,
							okButton: oktxt,
							noButton: notxt,
							callback: function (value) {
								if (value) {
									window.location.href = "/WholeSales/Index";
								}
							},
						});
					} else {
						openWaitingModal();
						$.ajax({
							type: "POST",
							url: "/WholeSales/Delivery",
							data: {
								__RequestVerificationToken: $(
									"input[name=__RequestVerificationToken]"
								).val(),
								model: DeliveryItems,
								ws: WholeSales,
								wslnList: WholeSalesLns
							},
							success: function (data) {
								closeWaitingModal();
								if (data.zerostockItemcodes !== "") {
									handleOutOfStocks(data.zerostockItemcodes, data.wsCode);
								} else {
									window.location.href = "/WholeSales/Index";
								}
							},
							dataType: "json",
						});
					}
				}
			}
		}
		else {
			FillInWholeSales();
			updateWholesales();
			//console.log("WholeSales:", WholeSales);
			// console.log("recurOrder:", recurOrder);
			//console.log("WholeSalesLns:", WholeSalesLns);
			//return;
			openWaitingModal();
			$.ajax({
				type: "POST",
				url: "/WholeSales/Edit",
				//url: "/Test/Edit",
				data: {
					__RequestVerificationToken: $(
						"input[name=__RequestVerificationToken]"
					).val(),
					model: WholeSales,
					wslnList: WholeSalesLns,
					recurOrder,
				},
				success: function (data: ISalesReturnMsg) {
					closeWaitingModal();
					if (data) {
						if (forRecurOrder) {
							$.fancyConfirm({
								title: "",
								message: data.msg,
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										window.location.reload();
									}
								},
							});
						} else {
							if (approvalmode && !data.ismanager) {
								handleApprovalMode4Sales(data);
							} else {
								window.location.href = "/WholeSales/Index";
							}
						}
					}
				},
				dataType: "json",
			});
		}
	}
}

$(document).on("click", ".btnSave", function () {
	handleSubmit4WholeSales();
});

function validateWSIForm(): boolean {
	var msg = "";

	if (WholeSales.wsCurrency == "") {
		msg += `${$infoblk.data("currencyrequiredtxt")}<br>`;
		$("#WholeSales_wsCurrency").addClass("focus");
	}

	if (!WholeSales.wsCusCode) {
		msg += `${$infoblk.data("customerrequiredtxt")}<br>`;
		$("#drpCustomer").addClass("focus");
	}
	if (WholeSales.wsSalesLoc == "") {
		msg += `${$infoblk.data("locationrequiredtxt")}<br>`;
		$("#drpLocation").addClass("focus");
	}
	if (WholeSalesLns.length == 0) {
		msg += `${$infoblk.data("emptyitemwarning")}<br>`;
		$("#tblWSI tbody tr")
			.eq(0)
			.find(".itemcode")
			.addClass("focus");
		focusItemCode(0);
	}

	if (WholeSales.wsStatus == "invoice" && DeliveryItems) {
		let totaldelqty = 0;
		$.each(DeliveryItems, function (i, e) {
			totaldelqty += e.dlQty;
		});
		let totalorderqty = 0;
		$.each(WholeSalesLns, function (i, e) {
			totalorderqty += e.wslQty!;
		});
		if (totaldelqty > totalorderqty) {
			msg += `${$infoblk.data("delqtymustnotgtorderqtytxt")}<br>`;
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
				}
			},
		});
	}
	return msg === "";
}

$(document).on("dblclick", "#wsCustomerTerms", function () {
	openCustomerTermsModal();
});

$(document).on("change", "#wholesalesDate", function () {
	WholeSales.JsWholesalesDate = <string>$(this).val();
});
$(document).on("change", "#deliveryDate", function () {
	WholeSales.JsDeliveryDate = <string>$(this).val();
});

$(document).on("change", "#drpCustomer", function () {
	WholeSales.wsCusCode = <string>$(this).val();
	if (WholeSales.wsCusCode) {
		$.ajax({
			type: "GET",
			url: "/Api/GetCustomerByCode",
			data: { cusCode: WholeSales.wsCusCode },
			success: function (data: ICustomer) {
				selectedCus = structuredClone(data);
				$("#wsCustomerTerms").val(data.PaymentTermsDesc as string);
				WholeSales.wsCustomerTerms = data.PaymentTermsDesc as string;
				customerTermsModal
					.find("#paymentIsDue")
					.val(data.PaymentTermsDesc as string);
				customerTermsModal
					.find("#balancedueDays")
					.val(data.BalanceDueDays as number);
				let $drpaddr = fillInAddressList();
				WholeSales.wsDeliveryAddressId = deliveryAddressId =
					$drpaddr.val() as number;

				let currcode = "";
				if (!UseForexAPI)
					currcode = GetForeignCurrencyFrmCode(WholeSales.wsCusCode!);
				// console.log("currcode:" + currcode);
				if (currcode !== "") {
					$("#wsCurrency").val(currcode).prop("readonly", true);
					fillInCurrencyModal(currcode);
				}
				if (!UseForexAPI && selectedCus.ExchangeRate)
					exRate = selectedCus.ExchangeRate;

				//console.log("exRate#drpcustomer change:" + exRate);
				displayExRate(exRate);
				if (enableTax && !inclusivetax) updateRows4Tax();
			},
			dataType: "json",
		});
	}
});

$(document).on("change", "#drpLocation", function () {
	WholeSales.wsSalesLoc = <string>$(this).val();
});

$(document).on("change", "#wsRemark", function () {
	WholeSales.wsRemark = <string>$(this).val();
});

$(document).on("change", "#wsCustomerPO", function () {
	WholeSales.wsCustomerPO = <string>$(this).val();
});

$(document).on("click", "#btnReload", function () {
	const Id = $("#WholeSales_wsUID").val();
	let invoicepara = "";
	if (WholeSales.wsStatus == "invoice") invoicepara = "&status=invoice";
	window.location.href = `/WholeSales/Edit?Id=${Id}${invoicepara}`;
});

function fillInDeliveryItems() {
	DicSeqDeliveryItems = $infoblk.data(
		"jsondicseqdeliveryitems"
	) as typeof DicSeqDeliveryItems;
	//console.log("DicDeliveryItems#fillin:", DicDeliveryItems);
	$("#tblWSI tbody tr").each(function (i, e) {
		//console.log("e:", $(e));
		let seq = i + 1;
		//console.log("seq:" + seq);		
		let itemcode: string = $(e)
			.find(".itemcode")
			.val() as string;

		itemOptions = DicItemOptions[itemcode];
		if (!itemOptions) return false;


		if (itemOptions.WillExpire) {
			$target = $(e)
				.find(".validthru.pointer");

			if (!itemOptions.ChkBatch && !itemOptions.ChkSN) {
				deliveryItem = DicSeqDeliveryItems[seq][0];
				if (deliveryItem)
					$target.val(deliveryItem!.VtDisplay!);
			}
			else $target.val("...");
		}

		if (itemOptions.ChkSN) {
			$target = $(e)
				.find(".serialno.pointer");
			$target.val("...");
		}

		if (itemOptions.ChkBatch) {
			$target = $(e)
				.find(".batch.pointer");
			$target.val("...");
		}
	});
}

$(function () {
	forwholesales = true;
	initVariablesFrmInfoblk();

	setFullPage();
	initModals();

	gTblId = "tblWSI";
	itotalamt = 0;
	$(".datepicker").datepicker({
		dateFormat: jsdateformat,
		beforeShow: function () {
			setTimeout(function () {
				$(".ui-datepicker").css("z-index", 99999999999999);
			}, 0);
		},
	});
	const status: string =
		($("#WholeSales_wsStatus").val() as string).toLowerCase() === "passed"
			? "requesting"
			: ($("#WholeSales_wsStatus").val() as string);
	let bgcls: string = status.toLowerCase().concat("statusbg");
	$("body").addClass(bgcls);

	FillInWholeSales();

	let _receiptno = getParameterByName("receiptno");
	let readonly: boolean = $infoblk.data("ismanager") === "True";
	//console.log("readonly:", readonly);
	editmode = WholeSales.wsStatus != "draft" && !reviewmode;
	if (_receiptno !== null) {
		receiptno = selectedSalesCode = _receiptno as string;
		reviewmode = _receiptno !== null;
	}
	
	editapproved =
		getParameterByName("mode") != null &&
		getParameterByName("mode") == "editapproved";

	if (!editmode)
		$("#WholeSales_wsExRate").val(1);

	if (reviewmode||editmode||editapproved) {
		wholesaleslns = $infoblk.data("jsonwholesaleslns");

		if (WholeSales.wsStatus.toLowerCase() === "deliver" || WholeSales.wsStatus.toLowerCase() === "partialdeliver") {
			$("#btnInvoice").trigger("click");
			$("input").prop("readonly", true);
			$("textarea").prop("readonly", true);
			$("select").prop("disabled", true);
			$("#btnblk").find("a").addClass("disabled");
			$("#btnUseRecur").addClass("disabled").off("click");
			//console.log("here");
			readonly = true;
		}
		//console.log("here");
		let html = "";
		let idx = 0;
		$.each(wholesaleslns, function (i, wholesalesln: IWholeSalesLn) {
			wholesalesln.itemVariList = []; //init the list
			const status = WholeSales.wsStatus.toLowerCase();
			const sntxt = wholesalesln.wslHasSn ? "..." : "";
			const batch = wholesalesln.wslBatchCode ?? "";
			wholesalesln.JsValidThru = wholesalesln.ValidThruDisplay ?? "";

			const vari = wholesalesln.ivIdList ? "..." : "";

			const formattedprice: string = formatnumber(
				wholesalesln.wslSellingPrice as number
			);
			const formatteddiscpc: string = formatnumber(
				<number>wholesalesln.wslLineDiscPc
			);
			const formattedtaxpc: string = formatnumber(
				<number>wholesalesln.wslTaxPc
			);
			const formattedamt: string = formatnumber(<number>wholesalesln.wslSalesAmt);
			const sellunit: string = wholesalesln.wslSellUnit ?? "N/A";
			const _readonly: string =
				status.toUpperCase() == "CREATED" ||
					status == "order" || editmode
					? ""
					: "readonly";
			//console.log("readonly:", _readonly);
			const wslseq: number =
				status == "order" ||
					status == "created" ||
					status == "requesting" ||
					status == "rejected" ||
					status == "passed"
					? wholesalesln.wslSeq!
					: i + 1;
			//console.log("wslseq:" + wslseq);
			html += `<tr data-idx="${idx}" data-id="${wholesalesln.wslUID}"><td><span>${wslseq}</span></td><td><input type="text" name="itemcode" class="itemcode text-left" value="${wholesalesln.wslItemCode}" ${_readonly}></td><td><input type="text" name="itemdesc" class="itemdesc text-left" data-itemname="${wholesalesln.itmName}" value="${wholesalesln.itmNameDesc}" readonly></td><td class="text-right"><input type="text" name="sellunit" class="sellunit text-right" value="${sellunit}" readonly></td><td class="text-right"><input type="number" name="qty" class="qty text-right" value="${wholesalesln.wslQty}" ${_readonly}></td>`;

			if (
				status != "order" &&
				status != "created" &&
				status != "requesting" &&
				status != "rejected" &&
				status != "passed"
			) {
				html += `<td class="text-right"><input type="number" name="delqty" class="delqty text-right" value="${wholesalesln.wslDelQty}" ${_readonly}></td>`;
				html += `<td class="text-center"><input type="text" name="batch" class="text-center batch pointer" readonly value="${batch}" /></td><td class="text-center"><input type="text" name="serailno" readonly class="text-center serialno pointer" value="${sntxt}" /></td><td class="text-center"><input type="datetime" name="validthru" class="small text-center validthru pointer datepicker" value="${wholesalesln.ValidThruDisplay}" title="${wholesalesln.ValidThruDisplay}" /></td>`;
				//itemvari
				html += `<td class="text-center"><input type="text" name="vari" class="text-center vari pointer" value="${vari}" /></td>`;
			}

			html += `<td class="text-right"><input type="number" name="price" class="price text-right" data-price="${wholesalesln.wslSellingPrice}" value="${formattedprice}"  ${_readonly}></td><td class="text-right"><input type="number" name="discpc" class="discpc text-right" data-discpc="${wholesalesln.wslLineDiscPc}" value="${formatteddiscpc}" ${_readonly}></td>`;
			if (enableTax && !inclusivetax) {
				html += `<td class="text-right"><input type="number" name="taxpc" class="taxpc text-right" data-taxpc="${wholesalesln.wslTaxPc}" value="${formattedtaxpc}" ${_readonly}></td>`;
			}
			let locations: string = "";
			for (const [key, value] of Object.entries(DicLocation)) {
				//default primary location:
				let selected: string =
					key == wholesalesln.wslStockLoc ? "selected" : "";
				locations += `<option value='${key}' ${selected}>${value}</option>`;
			}
			html += `<td><select class="location flex">${locations}</select></td>`;
			//console.log("wholesalesln.JobID:" + wholesalesln.JobID);
			html += `<td><select class="job flex">${setJobListOptions(wholesalesln.JobID ?? 0)}</select></td>`;
			html += `<td class="text-right"><input type="number" name="amount" class="amount text-right" data-amt="${wholesalesln.wslSalesAmt}" value="${formattedamt}" readonly></td>`;
			html += "</tr>";
			idx++;
		});

		WholeSalesLns = structuredClone(wholesaleslns);
		// console.log("html:" + html);
		$target = $(`#${gTblId} tbody`);
		$target.empty().html(html);

		$target = $("#deliveryDate").datepicker();
		$target.each(function () {
			$.datepicker._clearDate(this);
		});
		let deldate = new Date(WholeSales.DeliveryDateDisplay as string);
		// console.log("deldate:" + deldate);
		$target.datepicker("setDate", deldate);
		$target.datepicker("option", { dateFormat: "yy-mm-dd" });

		initDatePicker(
			"wholesalesDate",
			convertCsharpDateStringToJsDate(WholeSales.WsDateDisplay)
		);

		WholeSales.JsWholesalesDate = <string>$("#wholesalesDate").val();
		WholeSales.JsDeliveryDate = <string>$("#deliveryDate").val();
		selectedCus = $infoblk.data("jscustomer");
		//console.log(selectedCus);
		fillInAddressList();
		if (
			(WholeSales.wsStatus == "order" ||
				WholeSales.wsStatus.toLowerCase() == "created" || WholeSales.wsStatus.toLowerCase() == "rejected" ||
				WholeSales.wsStatus.toLowerCase() == "requesting") && !readonly) {
			addRow();
			$(".btnSave").removeClass("hide");
			if (WholeSales.wsStatus.toLowerCase() == "requesting")
				$("#btnInvoice").hide();

			//console.log("DicBatTotalQty:", DicBatTotalQty);

		} else if (editapproved) {
			$("input").prop("readonly", false);
			$("select").prop("disabled", false);
			$("a").removeClass("disabled");
			$(".btnSave").addClass("hide");
			$(".request").removeClass("hide");
			// Wholesales.wsStatus = approvalmode ? "REQUESTING" : "order";
			WholeSales.wsStatus = "order";
			addRow();
		} else {
			$("input").prop("readonly", readonly).prop("readonly", readonly);
			$("select").prop("disabled", readonly);
			$("textarea").not("#txtField").prop("readonly", readonly);
			//console.log("here");
			fillInDeliveryItems();
		}

		if (getParameterByName("status") && getParameterByName("status") == "invoice")
			$("#btnInvoice").trigger("click");
	} else {
		$("#drpLocation").val(shop);
		initDatePicker("deliveryDate", tomorrow, false, "", true, true);
		// initDatePicker("promisedDate", tomorrow);
		initDatePicker("wholesalesDate", new Date());
		addRow();
	}

	$("#drpCustomer > option").each(function (i, e) {
		CustomerOptionList.push(`<option value="${$(e).val()}">${$(e).text()}</option>`);
	});
	//console.log("CustomerOptionList:", CustomerOptionList);

	$("#drpCustomer").select2().trigger("focus");

	backUpCardDrpOptions();

	if (UseForexAPI) {
		$.ajax({
			type: "GET",
			url: "https://api.freecurrencyapi.com/v1/latest?apikey=HDs6UlKfcrhu5qov6S1YSjtIF5xlPHeWK7zUw08p&currencies=USD%2CCNY%2CEUR%2CGBP%2CAUD%2CHKD&base_currency=HKD",
			data: {},
			success: function (data) {
				if (data) {
					// console.log("data:", data.data);
					let html = "";
					for (const [key, value] of Object.entries(data.data)) {
						const exrate = 1 / Number(value);
						DicCurrencyExRate[key] = exrate;
						html += `<tr class="currency" data-key="${key}" data-value="${exrate}"><td>${key}</td><td>${formatexrate(
							exrate.toString()
						)}</td></tr>`;
					}
					currencyModal.find("#tblCurrency tbody").empty().html(html);
					//   console.log("DicCurrencyExRate:", DicCurrencyExRate);
					if (editmode) {
						exRate = getExRate(WholeSales.wsCurrency);
					}
				}
			},
			dataType: "json",
		}); ``
	} else {
		DicCurrencyExRate = $infoblk.data("jsondiccurrencyexrate");
	}

	setInput4NumberOnly("number");

	let idx = (!reviewmode && !editmode) ? 0 : 2;
	triggerMenuByCls("menuwholesales", idx);
});