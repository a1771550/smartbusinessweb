$infoblk = $("#infoblk");

let selectedRefundLn = [];
let refundLns: Array<IRefundSales> = [];
priceeditable = false; //item price in refund should not be editable
amteditable = false;
inclusivetax = $infoblk.data("inclusivetax") === "True";
//let selectedRefItem: IRefundBase;

let RefundSales: IRefundSales;
let RefundSalesList: Array<IRefundSales> = [];
let RefundableSalesList: Array<IRefundSales> = [];
let salesrefundlist: Array<ISalesRefundBase> = [];
salesType = SalesType.refund;
let refundsalesln: IRefundSales;
let epaytype: string = "";
checkoutportal = $infoblk.data("checkoutportal");
RefundList = [];
function updateRefRow() {
	$target = $("#tblRefund tbody tr").eq(currentY);
	// console.log("refundsalesln#updaterefrow:", refundsalesln);
	/* if (!inclusivetax) {*/
	//if (enableTax && !inclusivetax) {
	//}
	refundsalesln.rtlSalesAmt = inclusivetax
		? calAmount(
			refundsalesln.qtyToRefund,
			refundsalesln.rtlSellingPrice,
			refundsalesln.rtlLineDiscPc
		)
		: calAmountPlusTax(
			refundsalesln.qtyToRefund,
			refundsalesln.rtlSellingPrice,
			refundsalesln.rtlTaxPc,
			refundsalesln.rtlLineDiscPc
		);
	// console.log("amount#updaterefrow:" + refundsalesln.rtlSalesAmt);

	$target
		.find("td")
		.eq(-2)
		.find(".amount")
		.val(formatnumber(refundsalesln.rtlSalesAmt));

	if (!isNaN(refundsalesln.qtyToRefund)) {
		updateRefund();
	}
}

function updateRefund() {
	const $rows = $("#tblRefund tbody tr");
	// console.log("refundsalesln#updaterefund:", refundsalesln);
	$rows.each(function (i, e) {
		const $seq = $(e).find("td").last().find(".rtlSeq");
		if ($seq.is(":checked")) {
			const itemcode: string = $(e).find(".itemcode").val() as string;

			if ($seq.hasClass("bsv")) {
				refundsalesln.rtlItemCode = itemcode;
				itemOptions = DicItemOptions[itemcode];
				if (
					$seq.hasClass("bat") ||
					$seq.hasClass("batsn") ||
					$seq.hasClass("batvt") ||
					$seq.hasClass("batsnvt")
				) {
					// console.log("batdelid:" + Number($seq.val()));
					popuRefundLn(
						e,
						i,
						Number($seq.data("batdelid")),
						$seq.data("sn"),
						null
					);
				}
				if ($seq.hasClass("sn") || $seq.hasClass("snvt")) {
					// console.log("batdelid:" + Number($seq.val()));
					popuRefundLn(e, i, null, $seq.data("sn"), null);
				}
				if ($seq.hasClass("vt")) {
					console.log("vtdelid:" + Number($seq.val()));
					popuRefundLn(e, i, null, null, Number($seq.data("vtdelid")));
				}


			}
			else {
				refundsalesln.rtlItemCode = itemcode;
				popuRefundLn(e, i, null, null, null);
			}
		}
		else {
			if ($seq.hasClass("bsv")) {
				removeRefundLn(i);
			}
			//console.log("seq:" + Number($seq.val()));
			removeRefundLn(Number($seq.val()));
		}
	});
	// console.log("RefundList#updaterefund:", RefundList);
	//console.log("refundlist:", RefundList);
	let _totalamt = 0;
	$.each(RefundList, function (i, e) {
		console.log("e.amt:", e.amt);
		_totalamt += e.amt;
	});
	console.log("_totalamt:" + _totalamt);
	$("#txtTotal").val(formatnumber(_totalamt));
	focusRefItemCode();
}

function removeRefundLn(rtlSeq: number) {
	//console.log("rtlseq:" + rtlSeq);
	let removedamt = 0;
	if (RefundList.length > 0) {
		let idx = -1;
		$.each(RefundList, function (i, e) {
			console.log("e.rtlseq:" + e.rtlSeq);
			if (e.rtlSeq == rtlSeq) {
				idx = i;
				removedamt = e.amt;
				return false;
			}
		});
		if (idx > -1) {
			RefundList.splice(idx, 1);
		}
	}
	let currenttotal = Number($("#txtTotal").val());
	itotalamt = currenttotal - removedamt;
	$("#txtTotal").val(formatnumber(itotalamt));
}

function popuRefundLn(
	e: HTMLElement,
	rfSeq: number,
	batdelId: number | null,
	sn: string | null,
	vtdelId: number | null
) {
	if (refundsalesln.rtlItemCode !== "") {
		refundsalesln.strsnlist = $(e).data("snlist");
		// refundsalesln.batdelIds = $(e).data("batdelid");
		// refundsalesln.vtdelIds = $(e).data("vtdelid");
		refundsalesln.rtlSeq = Number(
			$(e).find("td:last").find(".rtlSeq").val()
		);
		refundsalesln.rfSeq = rfSeq;
		refundsalesln.rtlDesc = <string>(
			$(e).find("td:eq(1)").find(".itemdesc").text()
		);

		let idx = 6;
		refundsalesln.rtlSellingPrice = Number(
			$(e).find("td").eq(idx).find(".price").val()
		);
		idx++;
		refundsalesln.rtlLineDiscPc = Number(
			$(e).find("td").eq(idx).find(".discpc").val()
		);

		if (enableTax && !inclusivetax) {
			idx++;
			refundsalesln.rtlTaxPc = Number($(e).find("td").eq(idx).find(".taxpc").val());
		}
		idx++;
		refundsalesln.rtlStockLoc = $(e).find("td").eq(idx).text() as string;
		refundsalesln.refundedQty = Number($(e).data("refundedqty"));
		refundsalesln.refundableQty = Number($(e).data("refundableqty"));
		refundsalesln.qtyToRefund = Number(
			$(e).find("td").eq(-3).find(".qtytorefund").val()
		);
		idx++;
		refundsalesln.rtlSalesAmt = Number(
			$(e).find("td").eq(-2).find(".amount").val()
		);

		refundsalesln.batdelId = batdelId;
		refundsalesln.vtdelId = vtdelId;
		refundsalesln.rtlSn = sn;

		genRefund();
	}
}

function genRefund() {
	let refund: IRefundBase = initRefundItem();
	refund.strsnlist = refundsalesln.strsnlist;
	refund.batdelIds = refundsalesln.batdelIds;
	refund.vtdelIds = refundsalesln.vtdelIds;
	refund.itemcode = refundsalesln.rtlItemCode;
	refund.price = refundsalesln.rtlSellingPrice;
	refund.refundedQty = 0;
	refund.refundableQty = -1;
	refund.qtyToRefund = refundsalesln.qtyToRefund;
	refund.amt = refundsalesln.rtlSalesAmt;
	refund.rtlSeq = refundsalesln.rtlSeq;
	refund.rfSeq = refundsalesln.rfSeq;
	refund.discount = refundsalesln.rtlLineDiscPc;
	refund.amtplustax = inclusivetax
		? refundsalesln.rtlSalesAmt
		: refundsalesln.rtlSalesAmt + refundsalesln.rtlTaxAmt;
	refund.taxrate = refundsalesln.rtlTaxPc;
	//refund.isZeroStockItem = false;
	refund.rtlDesc = refundsalesln.rtlDesc;
	refund.batdelId = refundsalesln.batdelId;
	refund.vtdelId = refundsalesln.vtdelId;
	refund.rtlSn = refundsalesln.rtlSn;
	refund.rtlStockLoc = refundsalesln.rtlStockLoc;

	if (RefundList.length === 0) {
		RefundList.push(refund);
	} else {
		$.each(RefundList, function (i, e) {
			if (e.rtlSeq !== refund.rtlSeq) {
				RefundList.push(refund);
				return false;
			}
		});
	}

	//console.log("Refundlist after push:", RefundList);
}

$(document).on("click", "#btnSearchReceipt", function () {
	resetPage();
	device = <string>$("#txtDeviceCode").val();
	rno = <string>$("#txtReceiptNo").val();
	phoneno = <string>$("#txtPhoneNo").val();
	if (rno === "" && phoneno === "") {
		$.fancyConfirm({
			title: "",
			message: renoorphonerequired,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$("#txtReceiptNo").trigger("focus");
				}
			},
		});
		return false;
	} else if (device == "") {
		$.fancyConfirm({
			title: "",
			message: devicecoderequired,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$("#txtDeviceCode").trigger("focus");
				}
			},
		});
		return false;
	} else {
		openWaitingModal();
		getRemoteData(
			"/Api/GetReceipt",
			{ receiptno: rno, devicecode: device, phoneno: phoneno },
			getReceiptOk,
			getRemoteDataFail
		);
	}
});
function getReceiptOk(data) {
	closeWaitingModal();
	// console.log("data:", data);
	if (data.msg != null) {
		$.fancyConfirm({
			title: "",
			message: data.msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$("#txtReceiptNo").val("").trigger("focus");
				}
			},
		});
	} else {
		taxModel = data.taxModel;
		enableTax = taxModel.EnableTax;
		RefundSales = data.sales;
		selectedSalesCode = RefundSales.rtsCode;
		selectedCus = data.customer;
		selectedCusCodeName =selectedCus.cusCode;
		companyinfo = data.companyinfo;
		receipt = data.receipt;
		ItemList = data.items.slice(0);
		snlist = data.snlist.slice(0);
		//console.log("snlist:", snlist);
		cpplList = data.customerpointpricelevels.slice(0);
		RefundSalesList = data.salesLns.slice(0);
		//console.log("RefundSalesList:", RefundSalesList);
		DicPayTypes = data.dicpaytypes;
		isEpay = data.isEpay;

		if (data.refundLns.length > 0) {
			refundLns = data.refundLns.slice(0);
		}
		// console.log("refundLns:", refundLns);

		if (isEpay) {
			$("#partialrefundnote").removeClass("hide");
			epaytype = data.ePayType;
		} else {
			$("#partialrefundnote").addClass("hide");
		}
		var model = data;
		DicItemOptions = Object.assign({}, DicItemOptions, model.DicItemOptions);
		//console.log("dicitemoptions:", DicItemOptions);

		DicItemBatchQty = Object.assign({}, DicItemBatchQty, model.DicItemBatchQty);

		// console.log("dicitembatchqty:", DicItemBatchQty);

		DicItemBatDelQty = Object.assign(
			{},
			DicItemBatDelQty,
			model.DicItemBatDelQty
		);

		DicItemSnos = Object.assign({}, DicItemSnos, model.DicItemSnos);
		// console.log(DicItemSnos);

		DicItemBatSnVtList = Object.assign(
			{},
			DicItemBatSnVtList,
			model.DicItemBatSnVtList
		);
		DicItemSnVtList = Object.assign({}, DicItemSnVtList, model.DicItemSnVtList);
		DicItemVtQtyList = Object.assign(
			{},
			DicItemVtQtyList,
			model.DicItemVtQtyList
		);
		DicItemVtDelQtyList = Object.assign(
			{},
			DicItemVtDelQtyList,
			model.DicItemVtDelQtyList
		);
		if (PoItemBatVQList.length > 0) {
			const newpolist = model.PoItemBatVQList.slice(0);
			const currentpolist = PoItemBatVQList.slice(0);
			const tmplist = [...newpolist, ...currentpolist];
			const filteredpolist = tmplist.filter(
				(value, index, self) =>
					index === self.findIndex((t) => t.id === value.id)
			);
			PoItemBatVQList = filteredpolist.slice(0);
		} else {
			if (model.PoItemBatVQList)
				PoItemBatVQList = model.PoItemBatVQList.slice(0);
		}

		setupForexInfo();
		fillinRefundForm();
	}
}
function fillinRefundForm() {
	$("#txtCustomerCode").val(selectedCusCodeName);
	$("#txtStaticCustomerName").val(selectedCus.cusName);
	if (selectedCusCodeName.toLowerCase() !== "guest") {
		$("#txtPoints").val(selectedCus.cusPointsActive??0);
		$("#txtPhone").val(selectedCus.cusCode);
		if (selectedCus.cusPointsActive == 0) {
			$("#txtPriceLevel").val(cpplList[0].PriceLevelDescription);
			selectedCus.cusPriceLevelID = cpplList[0].PriceLevelID;
		} else {
			$.each(cpplList, function (i, e) {
				/* console.log('customerpoint:' + e.CustomerPoint + ';cuspointactive:' + selectedCus.cusPointsActive);*/
				if (e.CustomerPoint == selectedCus.cusPointsActive) {
					$("#txtPriceLevel").val(cpplList[i].PriceLevelDescription);
					selectedCus.cusPriceLevelID = cpplList[i].PriceLevelID;
					return false;
				}
				if (e.CustomerPoint > (selectedCus.cusPointsActive??0)) {
					if (
						typeof cpplList[i - 1] !== "undefined" &&
						typeof cpplList[i - 1].PriceLevelDescription !== "undefined"
					) {
						$("#txtPriceLevel").val(cpplList[i - 1].PriceLevelDescription);
						selectedCus.cusPriceLevelID = cpplList[i - 1].PriceLevelID;
						return false;
					}
				}
			});
			if (
				(selectedCus.cusPointsActive??0) >
				cpplList[cpplList.length - 1].CustomerPoint
			) {
				$("#txtPriceLevel").val(
					cpplList[cpplList.length - 1].PriceLevelDescription
				);
				selectedCus.cusPriceLevelID =
					cpplList[cpplList.length - 1].PriceLevelID;
			}
		}
	}

	if (RefundSales.rtsRmks !== null) {
		// console.log("remark:" + RefundSales.rtsRmks);
		let $rblk = $("#salesremarkblk");
		$rblk.find("span").text(RefundSales.rtsRmks);
		$rblk.show();
	}

	let html = "",
		salesrefund: ISalesRefundBase;
	$.each(RefundSalesList, function (i, e) {
		let item = $.grep(ItemList, function (ele, idx) {
			return ele.itmCode == e.rtlItemCode;
		})[0];

		let price = e.rtlSellingPrice;
		let taxrate = e.rtlTaxPc ?? 0;
		let batch = e.rtlBatch == null ? "N/A" : e.rtlBatch;
		totalsalesQty += e.rtlQty;

		let refundedamt: number = 0,
			refundedqty: number = 0,
			refunddates: string[] = [];
		if (refundLns.length > 0) {
			$.each(refundLns, function (index, val) {
				if (
					e.rtlCode == val.rtlRefSales &&
					val.rtlItemCode === e.rtlItemCode &&
					val.rtlSeq == e.rtlSeq
				) {

					refundedamt += val.rtlSalesAmt;
					refundedqty += val.rtlQty;
					refunddates.push(val.SalesDateDisplay);
				}
			});
		}

		let refundableqty: number = e.rtlQty - refundedqty;

		if (refundableqty > 0) {
			if (isEpay) {
				//for erefund only:
				itotalamt += e.rtlSalesAmt;
				let refund: IRefundBase = {
					rtlUID: e.rtlUID,
					itemcode: e.rtlItemCode,
					price: price,
					refundedQty: refundedqty,
					refundableQty: refundableqty,
					qtyToRefund: refundableqty,
					discount: e.rtlLineDiscPc,
					amt: e.rtlSalesAmt,
					amtplustax: e.rtlTaxAmt + e.rtlSalesAmt,
					rtlSeq: e.rtlSeq,
					taxrate: e.rtlTaxPc,
					//isZeroStockItem: false,
					rtlDesc: e.rtlDesc,
					rtlRefSales: e.rtlRefSales,
					SalesDateDisplay: e.SalesDateDisplay,
					vtdelIds: e.vtdelIds,
					batdelIds: e.batdelIds,
					strsnlist: e.strsnlist,
					batdelId: e.batdelId,
					vtdelId: e.vtdelId,
					rtlSn: e.rtlSn,
					rfSeq: 0,
					rtlStockLoc: e.rtlStockLoc,
				};
				RefundList.push(refund);
			}
			e.refundedQty = refundedqty;
			e.qtyToRefund = e.refundableQty = refundableqty;

			RefundableSalesList.push(e);
		}

		salesrefund = {
			rtlUID: e.rtlUID,
			salescode: e.rtlCode,
			itemcode: e.rtlItemCode,
			seq: e.rtlSeq,
			desc: item.itmDesc,
			batch: batch,
			qty: e.rtlQty,
			price: price,
			disc: e.rtlLineDiscPc,
			tax: taxrate,
			amt: e.rtlSalesAmt,
			date: e.rtlSalesDate,
			pricetxt: formatnumber(price),
			disctxt: formatnumber(e.rtlLineDiscPc),
			taxtxt: formatnumber(taxrate),
			amttxt: formatnumber(e.rtlSalesAmt),
			datetxt: e.SalesDateDisplay,
			refundedQty: refundedqty,
			refundedAmt: -1 * refundedamt,
			refundedqtyTxt: refundedqty === 0 ? "N/A" : refundedqty.toString(),
			refundedamtTxt:
				refundedamt === 0 ? "N/A" : formatnumber(-1 * refundedamt),
			refundedDates: refunddates.length === 0 ? "N/A" : refunddates.join(),
			vtdelId: e.vtdelId?.toString(),
			batdelId: e.batdelId?.toString(),
			rtlSn: e.rtlSn,
			rtlStockLoc: e.rtlStockLoc,
		};
		salesrefundlist.push(salesrefund);
		// console.log("salesrefundlist:", salesrefundlist);
	});
	// return false;
	//console.log("refundablesaleslist#fillin:", RefundableSalesList);
	// return false;
	$.each(salesrefundlist, function (i, e) {
		//項目代碼	數量	 價格	折扣%	金額	 銷售日期 退貨數量 	退款金額 	退款日期 	詳細
		const vtdelIds: string = e.vtdelId ?? "";
		const batdelIds: string = e.batdelId ?? "";
		// console.log("e.batdelid:" + e.batdelIds);
		html +=
			`<tr data-id=${e.rtlUID} data-batdelid="${batdelIds}" data-vtdelid="${vtdelIds}">` +

			'<td class="text-center flex">' +
			e.itemcode +
			'</td><td class="text-right flex">' +
			e.qty +
			'</td><td class="text-right flex">' +
			e.price +
			'</td><td class="text-right flex">' +
			e.disc +
			'</td><td class="text-right flex">' +
			e.amt +
			'</td><td class="text-center flex">' +
			e.datetxt +
			'</td><td class="text-right flex">' +
			e.refundedqtyTxt +
			'</td><td class="text-right flex">' +
			e.refundedamtTxt +
			'</td><td class="text-center flex">' +
			e.refundedDates +
			'</td><td class="text-center flex">' +
			e.rtlStockLoc +
			'</td><td class="text-center flex"><button type="button" class="btn btn-info flex" onclick="salesDetail(\'' +
			e.itemcode +
			"','" +
			e.rtlUID +
			"')\">" +
			detailtxt +
			"</button></td></tr>";
	});

	let $target = $("#tblsales tbody");
	$target.empty().append(html);
	$target.find("tr").each(function (i, e) {
		$(e)
			.find("td")
			.each(function (idx, ele) {
				$(ele).css({ "text-align": "center" });
			});
	});

	if (RefundableSalesList.length > 0) {
		if (isEpay) {
			$("#tblPay tbody tr").each(function (i, e) {
				let paycode: string = $(e).data("code");
				if (paycode.toLowerCase() === epaytype.toLowerCase()) {
					$(e).find("td:eq(1)").find(".paymenttype").val(itotalamt);
					return false;
				}
			});
		} else {
			genRefundRows();
			const $rows = $("#tblRefund tbody tr");
			if ($rows.length === 1) {
				const $seq = $rows.first().find("td").last().find(".rtlSeq");
				$seq.prop("checked", true).trigger("change");
			}
		}
		//console.log("itotalamt:" + itotalamt);
		if (isEpay || RefundableSalesList.length == 1) { $("#txtTotal").val(formatnumber(itotalamt)); refundsalesln = RefundableSalesList[0]; genRefund(); }

	} else {
		$.fancyConfirm({
			title: "",
			message: invoicefullyrefunded,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$("#txtReceiptNo").trigger("focus");
				}
			},
		});
	}
}

function genRefundRows() {
	$target = $("#tblRefund tbody");
	let html = "";
	$.each(RefundableSalesList, function (i, e) {
		const itemcode = e.rtlItemCode;
		if (itemcode in DicItemOptions)
			itemOptions = DicItemOptions[itemcode];
		//console.log("itemOptions:", itemOptions);
		if (itemOptions) {
			if (itemOptions.ChkBatch) {
				const batdelqty = DicItemBatDelQty[e.rtlItemCode].find(
					(x) => x.batcode == e.rtlBatch
				);
				if (batdelqty)
					html += addRefRow(
						e,
						i,
						null,
						batdelqty.batcode,
						batdelqty.batSn ?? "",
						e.rtlValidThru
					);
			}
			else {
				// sn & vt or sn only
				if (itemOptions.ChkSN) {
					$.each(snlist, function (k, v) {
						html += addRefRow(e, k, null, "", v.snoCode, null);
					});
				} else {
					//vt only
					html += addRefRow(e, i, null, "", "", e.rtlValidThru);
				}
			}
		} else {
			html += addRefRow(e, i, null, "", "", null);
		}
	});

	$target.empty().append(html);
}

function addRefRow(
	refundsalesln: IRefundSales | null,
	i: number | null,
	batdelId: string | null,
	batcode: string | null,
	sn: string | null,
	vt: string | null
): string {
	const itemcode: string = refundsalesln?.rtlItemCode as string;


	let html = `<tr data-idx="${i}" data-rtlSeq="${i}" data-taxpc="${refundsalesln?.rtlTaxPc
		}" data-discpc="${refundsalesln?.rtlLineDiscPc}" data-refundedqty="${refundsalesln?.refundedQty
		}" data-refundableqty="${refundsalesln ? refundsalesln.refundableQty : -1
		}" >`;

	html += `<td class="text-center"><input type="text" name="itemcode" class="itemcode flex" value="${itemcode}" /></td>`;
	const itemdesc: string = handleItemDesc(refundsalesln!.itmNameDesc);
	html += `<td><input type="text" class="itemdesc flex text-left" data-itemname="${itemdesc}" title="${refundsalesln!.itmNameDesc}" value="${itemdesc}" /></td>`;
	html += `<td class="text-right"><input type="number" name="refundedqty" class="refundedqty text-right" value="${refundsalesln?.refundedQty}" readonly /></td>`;


	itemOptions = DicItemOptions[itemcode];

	let batdisplay = batcode ?? "";
	let sndisplay = sn ?? "";
	let vtdisplay = vt ?? "";
	if (itemOptions && itemOptions.WillExpire) {
		if (batdelId) {
			vtdisplay = DicItemBatDelQty[itemcode].find(
				(x) => x.batdelId == Number(batdelId)
			)?.VtDisplay as string;
		}

		if (snlist.length > 0) {
			vtdisplay = snlist.find((x) => x.snoCode == sn)?.ValidThruDisplay as string;
		}
	}

	html += `<td><input type="text" class="batch text-center flex" readonly value="${batdisplay}" /></td>`;
	html += `<td><input type="text" class="serialno text-center flex" readonly value="${sndisplay}" /></td>`;
	html += `<td><input type="text" class="validthru text-center flex" readonly value="${vtdisplay}" /></td>`;

	html += `<td class="text-right"><input type="number" name="price" min="0" class="price text-right" value="${refundsalesln?.SellingPriceDisplay}" readonly/></td>`;

	const discpc = refundsalesln?.rtlLineDiscPc ?? 0;
	html += `<td class="text-right"><input type="number" min="0" name="discpc" class="discpc text-right" value="${formatnumber(discpc)}" readonly /></td>`;


	// console.log("inclusivetax:" + inclusivetax);
	if (enableTax && !inclusivetax) {
		const taxpc = refundsalesln?.rtlTaxPc ?? 0;
		html += `<td class="text-right"><input type="number" name="tax" min="0" class="taxpc text-right" value="${formatnumber(
			taxpc
		)}" readonly/></td>`;
	}
	html += `<td class="text-center">${refundsalesln?.rtlStockLoc}</td>`;
	//let qreadonly = isEpay ? 'readonly' : '';
	const qtytorefund: number =
		batdelId || sn ? 1 : (refundsalesln?.qtyToRefund as number);
	html += `<td class="text-right"><input type="number" min="0" name="qtytorefund" class="qtytorefund text-right" value="${qtytorefund}" /></td>`;

	//let areadonly = isEpay ? 'readonly' : amteditable ? '' : 'readonly';
	let areadonly = amteditable ? "" : "readonly";
	// const salesamt: any =
	//   batdelId || sn
	//     ? refundsalesln?.SellingPriceDisplay
	//     : formatnumber(
	//         refundsalesln?.qtyToRefund! * refundsalesln?.rtlSellingPrice!
	//       );

	let salesamt: number = getSalesLnAmt(
		refundsalesln?.qtyToRefund!,
		refundsalesln?.rtlSellingPrice!,
		refundsalesln?.rtlLineDiscPc ?? 0,
		refundsalesln?.rtlTaxAmt ?? 0
	);
	html += `<td class="text-right"><input type="number" name="amount" class="amount text-right" ${areadonly} value="${formatnumber(salesamt)}" /></td>`;

	itotalamt += salesamt;

	const rtlseq = refundsalesln?.rtlSeq;

	let clsDel: string = "";

	console.log(`batdelId:${batdelId};vt:${vt};sn:${sn}`);
	console.log(`(batdelId!=null || vt!=null || sn!=""):`, (batdelId!=null || vt!=null || sn!=""));
	if (batdelId != null || vt != null || sn != "") {
		clsDel = "bsv ";
		if (itemOptions.ChkBatch) {
			clsDel += "bat";
			if (itemOptions.ChkSN) {
				clsDel += "sn";
			}
			if (itemOptions.WillExpire) {
				clsDel += "vt";
			}
		}
		if (itemOptions.ChkSN) {
			if (!itemOptions.ChkBatch) {
				clsDel += "sn";
				if (itemOptions.WillExpire) {
					clsDel += "vt";
				}
			}
		}
		if (itemOptions.WillExpire && !itemOptions.ChkBatch && !itemOptions.ChkSN) {
			clsDel = "vt";
		}
		// const chkDel: string = `${refundsalesln?.rtlSeq} <input class="bsv seq ${clsDel}" name="seq" class="seq" min="1" data-seq="${rtlseq}" type="checkbox" data-batdelid="${batdelId}" data-vtdelid="${vtdelId}" data-sn="${sn}" data-vt="${vt}" value="${rtlseq}">`;
		// html += `<td class="text-center">${chkDel}</td>`;
	}
	// else {
	//   // html += `<td class="text-center"><input type="number" name="seq" class="seq" min="1" readonly data-seq="${rtlseq}" value="${rtlseq}" /></td>`;
	// }
	const chkDel: string = `${refundsalesln?.rtlSeq} <input class="rtlSeq ${clsDel}" name="rtlSeq" class="rtlSeq" min="1" data-rtlSeq="${rtlseq}" type="checkbox" data-batdelid="${batdelId}" data-vtdelid="${vt}" data-sn="${sn}" data-vt="${vt}" value="${rtlseq}">`;
	html += `<td class="text-center">${chkDel}</td>`;
	html += "</tr>";
	return html;
	//$target.append(html);
	//if (!refundsalesln) focusRefItemCode(idx);
}

$(document).on("change", ".rtlSeq", function () {
	//console.log("here");
	updateRefund();
});

function salesDetail(itemcode, rtlUID) {
	let salesrefund = $.grep(salesrefundlist, function (e, i) {
		return e.itemcode === itemcode && e.rtlUID == rtlUID;
	})[0];
	// console.log("salesrefund:", salesrefund);
	// console.log("salesdate:" + salesrefund.date);

	// console.log("snlist:", snlist);
	let _snlist: ISerialNo[] = $.grep(snlist, function (e, i) {
		return (
			e.snoItemCode === itemcode &&
			e.snoRtlSalesCode === salesrefund.salescode &&
			e.snoRtlSalesSeq == seq &&
			e.SalesDateDisplay == salesrefund.date
		);
	});
	// console.log("_snlist:", _snlist);

	let html = '<ul class="list-group list-group-flush">';
	html += `<li class="list-group-item"><strong>${receiptnotxt}</strong>: ${salesrefund.salescode}</li>`;
	html += `<li class="list-group-item"><strong>${itemcodetxt}</strong>: ${salesrefund.itemcode}</li>`;
	html += `<li class="list-group-item"><strong>${description}</strong>: ${salesrefund.desc}</li>`;
	html += `<li class="list-group-item"><strong>${batchtxt}</strong>: ${salesrefund.batch}</li>`;
	if (_snlist.length > 0) {
		let sncodes: string[] = [];
		$.each(_snlist, function (i, e) {
			sncodes.push(e.snoCode);
		});
		console.log("sncodes:", sncodes);
		html += `<li class="list-group-item"><strong>${serialnotxt}</strong>: ${sncodes.join()}</li>`;
	}
	html += `<li class="list-group-item"><strong>${qtytxt}</strong>: ${salesrefund.qty}</li>`;
	html += `<li class="list-group-item"><strong>${sellingpricetxt}</strong>: ${salesrefund.pricetxt}</li>`;
	html += `<li class="list-group-item"><strong>${discountitemheader}</strong>: ${salesrefund.disctxt}</li>`;
	html += `<li class="list-group-item"><strong>${taxitemheader}</strong>: ${salesrefund.taxtxt}</li>`;
	html += `<li class="list-group-item"><strong>${amountitemheader}</strong>: ${salesrefund.amttxt}</li>`;
	html += `<li class="list-group-item"><strong>${salesdatetxt}</strong>: ${salesrefund.datetxt}</li>`;
	html += `<li class="list-group-item"><strong>${refundqtytxt}</strong>: ${salesrefund.refundedqtyTxt}</li>`;
	html += `<li class="list-group-item"><strong>${refundamttxt}</strong>: ${salesrefund.refundedamtTxt}</li>`;
	html += `<li class="list-group-item"><strong>${refunddatetxt}</strong>: ${salesrefund.refundedDates}</li>`;
	html += "</ul>";
	$.fancyConfirm({
		title: "",
		message: html,
		shownobtn: false,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				focusRefItemCode();
			}
		},
	});
}

function resetRefRow(refundsalesln: IRefundSales) {
	itotalamt -= refundsalesln.rtlSalesAmt;
	seq = 0;
	refundsalesln = initRefundSales();
}

$(document).on("change", ".qtytorefund", function () {
	currentY = parseInt($(this).parent("td").parent("tr").data("idx")) - 1;
	let qtytorefund: number = parseInt(<string>$(this).val());
	let $tr: JQuery = $(this).parent("td").parent("tr");
	let seq: number = parseInt(<string>$tr.find("td:last").find(".rtlSeq").val());
	//let refunditemcode: string = <string>$tr.find('td:first').find('.itemcode').val();

	//console.log('refunditemcode:' + refunditemcode + ';qtytorefund:' + qtytorefund + ';seq:' + seq);
	// console.log("RefundableSalesList:", RefundableSalesList);

	refundsalesln = $.grep(RefundableSalesList, function (e, i) {
		//return e.rtlItemCode.toString() == refunditemcode.toString() && e.rtlSeq == seq;
		return e.rtlSeq == seq;
	})[0];
	// console.log("refundsalesln#qtychange:", refundsalesln);

	if (refundsalesln !== null) {
		//setRefundQtyInfo();
		refundsalesln.qtyToRefund = qtytorefund;

		if (refundsalesln.qtyToRefund > refundsalesln.refundableQty) {
			$.fancyConfirm({
				title: "",
				message: refundqtycantgtsalesqtywarning,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						// console.log("currenty:" + currentY);
						// let idx = enableTax && !inclusivetax ? 6 : 5;
						// console.log("idx:" + idx);
						$target = $("#tblRefund tbody tr")
							.eq(currentY)
							.find("td")
							.eq(-3)
							.find(".qtytorefund");
						refundsalesln.qtyToRefund = refundsalesln.refundableQty;
						$target.val(refundsalesln.refundableQty);
						$target.trigger("focus");
					}
				},
			});
		} else {
			currentY = parseInt($(this).parent("td").parent("tr").data("idx")) - 1;
			updateRefRow();
		}
	}
});

$(document).on("change", "#txtReceiptNo", function () {
	$("#btnSearchReceipt").trigger("click");
});

$(document).on("change", ".itemcode", function () {
	console.log("itemcode changed");
	resetRefRow(<IRefundSales>refundsalesln);
	seq = Number($(this).parent("td").parent("tr").data("idx"));
	currentY = seq - 1;
	// console.log("currentY#itemcode:" + currentY);
	selectedItemCode = <string>$(this).val();
	// console.log("itemlist:", ItemList);
	if (selectedItemCode !== "") {
		// console.log("selecteditemcode:" + selectedItemCode);
		// console.log("RefundableSalesList#itemcodechange:", RefundableSalesList);
		//return false;
		refundsalesln = RefundableSalesList.filter(
			(x) => x.rtlSeq == seq && x.rtlItemCode == selectedItemCode
		)[0];
		selectRefItem();
	}
});

function selectRefItem() {
	console.log("selecteditemcode:" + selectedItemCode);
	if (selectedItemCode === "") {
		$.fancyConfirm({
			title: "",
			message: selectitemrequired,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$("#tblRefund tbody tr")
						.eq(currentY)
						.find("td:first")
						.find(".itemcode")
						.trigger("focus");
				}
			},
		});
	} else {
		// console.log("RefundableSalesList#selectrefitem:", RefundableSalesList);
		//return false;
		// console.log("refundLns:", refundLns);
		// console.log("enableTax:" + enableTax + ";inclusivetax:" + inclusivetax);

		if (RefundableSalesList.length > 0) {
			// console.log("RefundableSalesList#selectrefitem:", RefundableSalesList);
			// return false;
			// console.log("refundablesaleslist length>0");

			// let idx = enableTax && !inclusivetax ? 6 : 5;
			// $refundableQty = $target.find("td").eq(idx).find(".qtytorefund");
			console.log("rtlSeq:" + seq);
			//return false;
			// console.log("refundsalesln#selectrefitem:", refundsalesln);
			if (seq > 0) {
				if (refundsalesln.refundableQty === 0) {
					$.fancyConfirm({
						title: "",
						message: itemrefundedinfullqty,
						shownobtn: false,
						okButton: oktxt,
						noButton: canceltxt,
						callback: function (value) {
							if (value) {
								resetPage(true);
								addRefRow(null, null, null, null, null, null);
								$target.find("td:first").find(".itemcode").trigger("focus");
							}
						},
					});
				}
				seq = 0;
				
			} else {
				let refundsaleslns: Array<IRefundSales> = [];

				refundsaleslns = $.grep(RefundableSalesList, function (e, i) {
					return e.rtlItemCode.toString() === selectedItemCode.toString();
				});
				// console.log("refundsaleslns:", refundsaleslns);

				if (refundsaleslns.length > 0) {
					// refundsalesln = refundsaleslns[0];

					if (refundsaleslns.length === 1) {
						if (refundsalesln.refundableQty === 0) {
							$.fancyConfirm({
								title: "",
								message: itemrefundedinfullqty,
								shownobtn: false,
								okButton: oktxt,
								noButton: canceltxt,
								callback: function (value) {
									if (value) {
										resetPage(true);
										addRefRow(null, null, null, null, null, null);
										$target.find("td:first").find(".itemcode").trigger("focus");
									}
								},
							});
						} else {
							$("#btnRefund")
								.prop("disabled", false)
								.css({ cursor: "pointer" });
							//console.log('here');
							//return false;
						}
					} else {
						$target.find("td:last").find(".rtlSeq").trigger("focus");
						$("#btnRefund").prop("disabled", true).css({ cursor: "default" });
						$target.find("td").eq(-3).find(".qtytorefund").val(0);
						//discpc = 0;
						//taxpc = 0;
					}

					$.each(refundsaleslns, function (i, e) {
						// console.log("e.batdelids:", e.batdelIds);
						if (e.batdelIds) {
							const batdelIds = e.batdelIds.split(",");
							$.each(batdelIds, function (k, v) {
								// console.log("v:" + v);
								fillInRefundRow(e, refundsaleslns.length === 1, v, null);
							});
						} else {
							fillInRefundRow(e, refundsaleslns.length === 1, null, null);
						}
					});
				} else {
					$.fancyConfirm({
						title: "",
						message: itemrefundedinfullqty,
						shownobtn: false,
						okButton: oktxt,
						noButton: canceltxt,
						callback: function (value) {
							if (value) {
								resetPage(true);
								addRefRow(null, null, null, null, null, null);
								$target.find("td:first").find(".itemcode").trigger("focus");
							}
						},
					});
				}
			}
			// console.log("rows length:" + $rows.length);
			// console.log("has row#0?" + $rows.eq($rows.length).length);
			// console.log("has row#1?" + $rows.eq(currentY + 1).length);
			let $refundableQty: JQuery;
			// console.log("currenty:" + currentY);
			let $rows = $("#tblRefund tbody tr");
			$target = $rows.eq(currentY);
			$refundableQty = $target.find("td").eq(-3).find(".qtytorefund");
			if ($rows.eq($rows.length).length) {
				// console.log("here#0");
				if (refundsalesln.refundableQty === 0) {
					$refundableQty.trigger("focus");
				} else {
					focusRefItemCode($rows.length);
				}
			} else if ($rows.eq(currentY + 1).length) {
				// console.log("here#1");
				if (
					$rows
						.eq(currentY + 1)
						.find("td:first")
						.find(".itemcode")
						.val() !== ""
				) {
					if (seq === 0) {
						addRefRow(null, null, null, null, null, null);
					} else {
						if (refundsalesln.refundableQty === 0) {
							$refundableQty.trigger("focus");
						} else {
							focusRefItemCode($rows.length);
						}
					}
				} else {
					if (refundsalesln.refundableQty === 0) {
						$refundableQty.trigger("focus");
					} else {
						focusRefItemCode(currentY + 1);
					}
				}
			} else {
				// console.log("here#2");
				if ($target.find("td:last").find(".rtlSeq").val() != "") {
					if (RefundableSalesList.length > 1) {
						addRefRow(null, null, null, null, null, null);
						if (refundsalesln.refundableQty === 0) {
							$refundableQty.trigger("focus");
						}
					}
				}
			}
		}
	}
}

function fillInRefundRow(
	refundsalesln: IRefundSales,
	refundsalslnlengthEq1: boolean,
	batdelId: string | null,
	vtdelId: string | null
) {
	//console.log("batdelId:" + batdelId);

	fillInRowData(refundsalesln);

	const itemcode: string = refundsalesln.rtlItemCode.toString();
	$target.find("td:eq(0)").find(".itemcode").val(itemcode);
	$target.find("td:eq(1)").find(".itemdesc").text(refundsalesln.rtlDesc);

	console.log("refundsalslnlengthEq1:", refundsalslnlengthEq1);

	if (refundsalslnlengthEq1) {
		$target
			.find(".refundedqty")
			.val(refundsalesln.refundedQty);
	} else {
		$target.find(".refundedqty").val("");
	}

	let batmsg: string = "";
	let snmsg: string = "";
	let vtmsg: string = "";
	let vtcls = "datepicker validthru";


	itemOptions = DicItemOptions[itemcode];
	const nonitemoptionscls =
		!itemOptions.ChkBatch && !itemOptions.ChkSN && !itemOptions.WillExpire
			? "nonitemoptions"
			: "";

	let idx = 3;
	const $bat = $target.find("td").eq(idx).find(".batch");

	$bat.data("type", "bat");

	$bat.prop("title", batmsg);

	idx++;
	const $sn = $target.find("td").eq(idx).find(".serialno");
	$sn.data("type", "sn");

	$sn.prop("title", snmsg);

	idx++;
	const $vt = $target.find("td").eq(idx).find(".validthru");
	$vt.data("type", "vt");
	$vt.addClass(vtcls).prop("title", vtmsg);

	idx = 6;
	$target
		.find("td")
		.eq(idx)
		.find(".price")
		.val(formatnumber(refundsalesln.rtlSellingPrice));

	idx++;
	let _disc: any = refundsalslnlengthEq1
		? formatnumber(refundsalesln.rtlLineDiscPc)
		: "";
	$target.find("td").eq(idx).find(".discpc").val(_disc);

	if (refundsalslnlengthEq1) {
		idx = enableTax && !inclusivetax ? 8 : 7;

		$target
			.find("td")
			.eq(idx)
			.find(".taxpc")
			.val(formatnumber(refundsalesln.rtlTaxPc));

		const $refundableQty = $target.find("td").eq(-3).find(".qtytorefund");
		$refundableQty.val(refundsalesln.refundableQty);

		if (batdelId || vtdelId) {
			const clsDel = batdelId ? "bat" : "vt";
			const chkDel: string = `<input class="form-check-input ${clsDel}" type="checkbox" value="${batdelId}">
  <label class="form-check-label">${refundsalesln.rtlSeq}</label>`;
			$target.find("td").last().find(".rtlSeq").val(chkDel);
		} else {
			$target.find("td").last().find(".rtlSeq").val(refundsalesln.rtlSeq);
		}
		// return false;
		updateRefRow();
	} else {
		$target.find("td").eq(-2).find(".amount").val(formatnumber(0));
	}
}

function fillInRowData(refundsalesln: IRefundSales) {
	$target.data("snlist", snlist.map((x) => x.snoCode).join());
	// console.log("refundsalesln:", refundsalesln);
	// console.log("refundsalesln.batdelIds:", refundsalesln.batdelIds);
	$target.data("batdelids", refundsalesln.batdelIds);
	$target.data("vtdelids", refundsalesln.vtdelIds);
	$target.data("rtlSeq", refundsalesln.rtlSeq);
	$target.data("refundedqty", refundsalesln.refundedQty);
	$target.data("refundableqty", refundsalesln.refundableQty);
	$target.data("taxpc", refundsalesln.rtlTaxPc);
	$target.data("discpc", refundsalesln.rtlLineDiscPc);
}

function submitRefund() {
	if (Refund.Change > 0) {
		$("#changeModal").dialog("close");
	}
	Refund.rtsRmks = <string>$("#txtNotes").val();
	Refund.rtsCode = rno;
	Refund.SelectedDevice = $("#txtDeviceCode").val() as string;
	Refund.rtsEpay = isEpay;
	Refund.rtsFinalTotal = itotalamt;
	Refund.epaytype = epaytype;
	Refund.rtsCusCode = selectedCus.cusCode;

	if (RefundList.length > 0) {
		const url = "/POSFunc/ProcessRefund";
		openWaitingModal();
		$.ajax({
			type: "POST",
			url: url,
			data: { Refund, RefundList, Payments },
			success: function (data) {
				closeWaitingModal();
				console.log("returned data:", data);
				let _url = printurl + "?issales=0&salesrefundcode=" + data.refundcode;

				if (isEpay) {
					let epayresult: IePayResult = data.eresult;
					if (epayresult.Status == 0) {
						$.fancyConfirm({
							title: "",
							message: epayresult.Message,
							shownobtn: false,
							okButton: oktxt,
							noButton: notxt,
							callback: function (value) {
								if (value) {
								}
							},
						});
					}
					if (epayresult.Status == 1) {
						$.fancyConfirm({
							title: "",
							message: epayresult.Message,
							shownobtn: false,
							okButton: oktxt,
							noButton: notxt,
							callback: function (value) {
								if (value) {
									window.open(_url);
									window.location.reload();
								}
							},
						});
					}
				} else {
					window.open(_url);
					window.location.reload();
				}
			},
			dataType: "json",
		});
	}
}

function focusRefItemCode(idx: number = -1) {
	$target = $("#tblRefund tbody tr");
	if (idx === -1) {
		$target.each(function (i, e) {
			let $itemcode = $(e).find("td:eq(0)").find(".itemcode");
			if ($itemcode.val() === "") {
				$itemcode.trigger("focus");
				// console.log("focus set;i:" + i);
				return false;
			}
		});
	} else {
		$target.eq(idx).find("td:eq(0)").find(".itemcode").trigger("focus");
	}
}

function openRefPayModal() {
	payModal.dialog("option", { width: 500, title: processrefund });
	payModal.dialog("open");
	// console.log("itotalamt#paymodal:" + itotalamt);
	let totalamt = 0;
	RefundList.forEach(x => totalamt += x.amt);

	setExRateDropDown();
	setForexPayment(totalamt);

	$("#refundamount").text(formatmoney(totalamt));
	let _amt: number = round(totalamt, 2);
	if (isEpay) {
		let $target = $("#tblPay tbody tr");
		$target.each(function (i, e) {
			if ($(e).data("code").toLowerCase() != epaytype.toLowerCase()) {
				$(e).remove();
			} else {
				if (RefundableSalesList.length === 1) {
					$(e).find("td:eq(1)").find(".paymenttype").val(formatnumber(_amt));
				}
			}
		});
	} else {
		$("#Cash").val(formatnumber(_amt));
	}
}

$(document).on("click", "#btnNewRefund", function () {
	if (RefundSalesList.length > 0 && confirm(confirmnewrefund)) {
		window.location.reload();
	}
});

$(document).on("click", "#btnRefund", function () {
	if (RefundList.length === 0) {
		$.fancyConfirm({
			title: "",
			message: refundinfonotenough,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$("#tblRefund tbody tr")
						.eq(currentY)
						.find("td:first")
						.find(".itemcode")
						.trigger("focus");
				}
			},
		});
	}
	else {
		if (isEpay) {
			confirmPay();
		} else {
			openRefPayModal();
		}
	}

});

let Refund: ISales;

$(document).off("dblclick", ".itemcode");

$(function () {
	forrefund = true;
	setFullPage();
	initModals();
	triggerMenu(0, 2);

	comInfo = $infoblk.data("cominfo");
	exRate = 1;
	DicCurrencyExRate = $infoblk.data("diccurrencyexrate");
	UseForexAPI = comInfo.UseForexAPI;
	$("#rtsExRate").val(1);
	displayExRate(1);

	Refund = initSales();

	$("#txtDeviceCode").trigger("focus");
});
