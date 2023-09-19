$infoblk = $("#infoblk");
enableSN = $infoblk.data("enablesn") === "True";
enableTax = $infoblk.data("enabletax") === "True";
priceeditable = $infoblk.data("priceeditable") === "True";
disceditable = $infoblk.data("disceditable") === "True";

$wholesalesDateDisplay = $("#wholesalesDate");
$deliveryDateDisplay = $("#deliveryDate");

DicBatTotalQty = $infoblk.data("jsondicbattotalqty");

PoItemBatVQList = $infoblk.data("jsonpoitembatvqlist");
DicItemBVList = $infoblk.data("jsondicitembvlist");

DicItemBatchQty = $infoblk.data("jsondicitembatchqty");
DicItemBatDelQty = $infoblk.data("jsondicitembatdelqty");

DicItemBatSnVt = $infoblk.data("jsondicitembatsnvt");

DicItemSnBatVtList = $infoblk.data("jsondicitemsnbatvtlist");
DicItemSnVtList = $infoblk.data("jsondicitemsnvtlist");

DicItemVtQtyList = $infoblk.data("jsondicitemvtqtylist");
DicItemVtDelQtyList = $infoblk.data("jsondicitemvtdelqtylist");

DicItemOptions = $infoblk.data("jsondicitemoptions");

let recurOrderList: IRecurOrder[] = [];

$(document).on("change", "#chkDelAddr", function () {
    if ($(this).is(":checked")) {
        $("#txtDelAddr").removeClass('hide').trigger("focus");
        $("#drpDeliveryAddr").hide();
    }
    else {
        $("#txtDelAddr").addClass('hide');
        $("#drpDeliveryAddr").show();
        let $drpaddr = fillInAddressList();
        Wholesales.wsDeliveryAddressId = deliveryAddressId =
            $drpaddr.val() as number;
        $drpaddr.trigger("focus");
    }

});
$(document).on("change", ".delqty", function () {
    currentY = getCurrentY(this);
    console.log("currentY@delqtychange:" + currentY);
    updateRow(getRowPrice(), getRowDiscPc());
});

function GetRecurOrders(pageIndex) {
    let data = `{cusCode:"${selectedCus.cusCode}",pageIndex:${pageIndex},sortName:"${sortName}",sortDirection:"${sortDirection}",sortCol:"${sortCol}"}`;
    if (typeof keyword !== "undefined" && keyword !== "") {
        data = `{cusCode:"${selectedCus.cusCode}",pageIndex:${pageIndex},sortName:"${sortName}",sortDirection:"${sortDirection}",sortCol:"${sortCol}",keyword:"${keyword}"}`;
    } else {
        data = `{cusCode:"${selectedCus.cusCode}",pageIndex:${pageIndex},sortName:"${sortName}",sortDirection:"${sortDirection}",sortCol:"${sortCol}",keyword:""}`;
    }
    // console.log("data:", data);
    /*return false;*/
    openWaitingModal();
    $.ajax({
        url:
            checkoutportal == "abss"
                ? "/Api/GetRecurOrdersAjax"
                : "/Api/GetKRecurOrdersAjax",
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
    pageindex = Number($(this).attr("page"));
    GetRecurOrders(pageindex);
});
$(document).on("click", "#tblRecurOrder th", function () {
    sortName = $(this).data("category");
    sortCol = Number($(this).data("col"));
    //sortDirection = sortDirection.toUpperCase() == "ASC" ? "DESC" : "ASC";
    pageindex = 1;
    GetRecurOrders(pageindex);
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
                                recurOrderList.findIndex((v) => v.wsUID === orderId),
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

$(document).on("click", "#btnEdit", function () {
    window.location.href = `/WholeSales/Review?receiptno=${Wholesales.wsCode}&mode=editapproved`;
});

$(document).on("click", ".btnSaveRecur", function () {
    if (validateWSIForm()) {
        recurOrder = initRecurOrder();
        recurOrder.Mode = "save";
        $deliveryDateDisplay.val("");
        openRecurOrderModal();
    }
});

$(document).on("click", ".btnRequestApproval", function () {
    handleSubmit4Wholesales();
});

$(document).on("click", "#btnInvoice", function () {
    $(".btnSave").removeClass("hide");
    $(".request").addClass("hide");
    //console.log('invoice clicked');
    if (Wholesales.wsStatus.toLowerCase() === "deliver") {
        $("body").addClass("deliverbg");
        $("#status").text("Deliver");
    }
    else if (Wholesales.wsStatus.toLowerCase() === "partialdeliver") {
        $("body").addClass("partialdeliverbg");
        $("#status").text("PartialDeliver");
    }
    else {
        $("body").addClass("billbg");
        Wholesales.wsStatus = "invoice";
        $("#status").text("Invoice");
        $(this).addClass("disabled").off("click");
    }

    $target = $(`#${gTblName}`);
    
    let isInvoice: boolean = Wholesales.wsStatus.toLowerCase() === "invoice";
    if (isInvoice) {       
        let $theadtr = $target.find("thead tr:first");
        $target.find("colgroup").find(".hide").removeClass("hide");
        $theadtr.find("td.hide").removeClass("hide");
    }

    //remove the last row for invoice
    if (Wholesales.wsStatus.toLowerCase() !== "order") {
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
        const salesln: IWholeSalesLn = Wholesales.WholeSalesLns.filter(
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

        if (itemcode !== "") {
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
                        if (!(itemcode in DicItemSnBatVtList)) {
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
                let ivcls = (!$.isEmptyObject(DicIvInfo) && itemcode in DicIvInfo) ? `vari focus ${ivpointer}` : "disabled";     

                batinput = `<input type="text" data-type="bat" class="text-center ${nonitemoptionscls} ${batcls}" title="${batmsg}" ${readonly} />`;
                sninput = `<input type="text" data-type="sn" class="text-center ${nonitemoptionscls} ${sncls}" title="${snmsg}" ${readonly} />`;
                vtinput = `<input type="text" data-type="vt" class="text-center ${nonitemoptionscls} ${vtcls} ${pointercls}" title="${vtmsg}" ${vtdisabled} ${readonly} />`;
                //itemvar
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

            $.each(Wholesales.WholeSalesLns, function (idx, ele) {
                if (
                    ele.wslItemCode.toString().toLowerCase() == itemcode.toLowerCase() &&
                    ele.wslSeq == _seq
                ) {
                    // console.log("missingtxt:" + missingtxt);
                    ele.MissingItemOptions = missingtxt !== "";
                }
            });
        }

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
    const isInvoice: boolean = Wholesales.wsStatus == "invoice";
    Wholesales.wsDeliveryAddressId = Number($("#drpDeliveryAddr").val());
    Wholesales.wsSalesLoc = $("#drpLocation").val() as string;
    Wholesales.wsAllLoc = $("#chkAllLoc").is(":checked");

    Wholesales.WholeSalesLns = [];
    const $selector = $(`#${gTblName} tbody tr`);
    let salesamt: number = 0;
    $selector.each(function (i, e) {
        $tr = $(e);
        const itemoptionmissing: boolean = $tr
            .find("td")
            .find("input")
            .hasClass("itemoptionmissing");
        const itemcode = $tr.find("td:eq(1)").find(".itemcode").val();
        if (itemcode) {
            let seq = parseInt(<string>$tr.find("td:first").text());
            if (Wholesales.WholeSalesLns.length > 0) {
                selectedWholesalesLn = Wholesales.WholeSalesLns.filter(
                    (x) => x.wslSeq == seq
                )[0];
                if (!selectedWholesalesLn) selectedWholesalesLn = initWholeSalesLn();
            } else {
                selectedWholesalesLn = initWholeSalesLn();
            }
            selectedWholesalesLn.wslUID = Number($tr.data("id"));
            selectedWholesalesLn.MissingItemOptions = itemoptionmissing;

            selectedWholesalesLn.wslStatus = Wholesales.wsStatus;
            selectedWholesalesLn.wslItemCode = <string>(
                $tr.find("td:eq(1)").find(".itemcode").val()
            );
            selectedWholesalesLn.wslSeq = seq;
            selectedWholesalesLn.itmNameDesc = <string>(
                $tr.find("td:eq(2)").find(".itemdesc").data("itemname")
            );
            selectedWholesalesLn.wslDesc = <string>(
                $tr.find("td:eq(2)").find(".itemdesc").val()
            );
            selectedWholesalesLn.wslSellUnit = <string>(
                $tr.find("td:eq(3)").find(".sellunit").val()
            );
            let qty = 0;
            qty = Number($tr.find("td:eq(4)").find(".qty").val());
            selectedWholesalesLn.wslQty = qty;

            if (isInvoice) {
                selectedWholesalesLn.wslDelQty = Number($tr.find("td:eq(5)").find(".delqty").val());;
            }

            selectedWholesalesLn.wslHasSn =
                selectedWholesalesLn.snvtList.length > 0;

            let idx = isInvoice ? 8 : 5;
            let _price: number = Number($tr.find("td").eq(idx).find(".price").val());
            selectedWholesalesLn.wslSellingPrice = _price;
            idx++;
            let _discpc: number = Number(
                $tr.find("td").eq(idx).find(".discpc").val()
            );
            selectedWholesalesLn.wslLineDiscPc = _discpc;

            selectedWholesalesLn.wslLineDiscAmt =
                selectedWholesalesLn.wslSellingPrice *
                (selectedWholesalesLn.wslLineDiscPc / 100) *
                qty;

            idx++;
            if (enableTax && !inclusivetax) {
                selectedWholesalesLn.wslTaxPc = Number(
                    $tr.find("td").eq(idx).find(".taxpc").val()
                );
                selectedWholesalesLn.wslTaxAmt =
                    selectedWholesalesLn.wslSellingPrice *
                    (1 - selectedWholesalesLn.wslLineDiscPc / 100) *
                    (selectedWholesalesLn.wslTaxPc / 100) *
                    qty;
            }

            selectedWholesalesLn.wslStockLoc = $tr
                .find("td")
                .eq(-3)
                .find(".location")
                .val() as string;
            selectedWholesalesLn.JobID = Number($tr
                .find("td")
                .eq(-2)
                .find(".job")
                .val());
            let _amt: number = Number($tr.find("td").last().find(".amount").val());
            // console.log("_amt:" + _amt);
            selectedWholesalesLn.wslSalesAmt = _amt;
            // console.log(selectedWholesalesLn);
            salesamt += _amt;

            if (Wholesales.WholeSalesLns.length > 0) {
                let idx = -1;
                $.each(Wholesales.WholeSalesLns, function (i, e) {
                    // console.log("seq:" + seq + ";wlseq:" + e.wslSeq);
                    if (e.wslSeq == selectedWholesalesLn.wslSeq) {
                        e = structuredClone(selectedWholesalesLn);
                        i = idx;
                        return false;
                    }
                });
                if (idx === -1) {
                    Wholesales.WholeSalesLns.push(selectedWholesalesLn);
                }
            } else {
                Wholesales.WholeSalesLns.push(selectedWholesalesLn);
            }
        }
    });

    Wholesales.wsFinalTotal = itotalamt = salesamt;
    // console.log("itotalamt after sum up:" + itotalamt);
    $("#txtTotal").val(formatnumber(itotalamt));
    focusItemCode();
}

function handleSubmit4Wholesales(forRecurOrder: boolean = false) {
    if (validateWSIForm()) {
        //add those itemoptionless items:
        if (Wholesales.wsStatus == "invoice") {
            if ($(`#${gTblName} .focus`).length > 0) {
                let msg = `${salesinfonotenough}<br>`;
                $.fancyConfirm({
                    title: "",
                    message: msg,
                    shownobtn: false,
                    okButton: oktxt,
                    noButton: notxt,
                });
            } else {
                updateWholesales();
                if ($(`#${gTblName} tbody tr`).length > 0) {
                    $(`#${gTblName} tbody tr`).each(function (i, e) {
                        let nonitemoptions = 0;
                        for (let i = 6; i <= 8; i++) {
                            if ($(e).find("td").eq(i).find(".nonitemoptions").length)
                                nonitemoptions++;
                        }
                        if (nonitemoptions > 0) {
                            let deliveryItem: IDeliveryItem = initDeliveryItem();
                            deliveryItem.dlCode = `noio${i}`;
                            let idx = 0;
                            deliveryItem.seq = Number($(e).find("td").eq(idx).text());
                            idx++;
                            deliveryItem.itmCode = $(e)
                                .find("td")
                                .eq(idx)
                                .find(".itemcode")
                                .val() as string;
                            idx = 3;
                            deliveryItem.dlBaseUnit = $(e)
                                .find("td")
                                .eq(idx)
                                .find(".sellunit")
                                .val() as string;
                            idx = 5;
                            deliveryItem.dlQty = Number(
                                $(e).find("td").eq(idx).find(".delqty").val()
                            );
                            idx = 9;
                            deliveryItem.SellingPrice = Number(
                                $(e).find("td").eq(idx).find(".price").val()
                            );
                            idx++;
                            deliveryItem.dlDiscPc = Number(
                                $(e).find("td").eq(idx).find(".discpc").val()
                            );
                            idx++;
                            if (enableTax && !inclusivetax) {
                                deliveryItem.dlTaxPc = Number(
                                    $(e).find("td").eq(idx).find(".taxpc").val()
                                );
                                idx++;
                            }

                            deliveryItem.dlStockLoc = $(e).find("td").eq(idx).find(".location").val() as string;
                            idx++;

                            deliveryItem.JobID = Number($(e).find("td").eq(idx).find(".job").val());
                            idx++;

                            deliveryItem.dlAmt = deliveryItem.dlAmtPlusTax = Number(
                                $(e).find("td").eq(idx).find(".amount").val()
                            );
                            DeliveryItems.push(deliveryItem);
                        }
                    });
                    console.log("DeliveryItems:", DeliveryItems);
                    console.log("WholeSalesLns:", Wholesales.WholeSalesLns);
                   // return false;
                    if (DeliveryItems.length === 0) {
                        $.fancyConfirm({
                            title: "",
                            message: stockqtynotenoughtxt,
                            shownobtn: false,
                            okButton: oktxt,
                            noButton: notxt,
                            callback: function (value) {
                                if (value) {
                                    window.location.href = "/Wholesales/Index";
                                }
                            },
                        });
                    } else {
                        openWaitingModal();
                        $.ajax({
                            type: "POST",
                            url: "/Wholesales/Delivery",
                            data: {
                                __RequestVerificationToken: $(
                                    "input[name=__RequestVerificationToken]"
                                ).val(),
                                model: DeliveryItems,
                                ws: Wholesales,
                            },
                            success: function (data) {
                                closeWaitingModal();
                                if (data.zerostockItemcodes !== "") {
                                    handleOutOfStocks(data.zerostockItemcodes, data.wsCode);
                                } else {
                                    window.location.href = "/Wholesales/Index";
                                }
                            },
                            dataType: "json",
                        });
                    }
                }
            }
        } else {
            Wholesales = fillInWholeSale();
            // console.log(Wholesales.wsExRate);
            updateWholesales();

            console.log("Wholesales:", Wholesales);
            // console.log("recurOrder:", recurOrder);
            //return;
            openWaitingModal();
            $.ajax({
                type: "POST",
                url: "/Wholesales/Edit",
                data: {
                    __RequestVerificationToken: $(
                        "input[name=__RequestVerificationToken]"
                    ).val(),
                    model: Wholesales,
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
                                window.location.href = "/Wholesales/Index";
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
    handleSubmit4Wholesales();
});

function validateWSIForm(): boolean {
    var msg = "";

    if (Wholesales.wsCurrency == "") {
        msg += `${$infoblk.data("currencyrequiredtxt")}<br>`;
        $("#wsCurrency").addClass("focus");
    }

    if (!Wholesales.wsCusCode) {
        msg += `${$infoblk.data("customerrequiredtxt")}<br>`;
        $("#drpCustomer").addClass("focus");
    }
    if (Wholesales.wsSalesLoc == "") {
        msg += `${$infoblk.data("locationrequiredtxt")}<br>`;
        $("#drpLocation").addClass("focus");
    }
    if (Wholesales.WholeSalesLns.length == 0) {
        msg += `${$infoblk.data("emptyitemwarning")}<br>`;
        $("#tblWSI tbody tr")
            .eq(0)
            .find("td:eq(1)")
            .find(".itemcode")
            .addClass("focus");
        focusItemCode(0);
    }

    if (Wholesales.wsStatus == "invoice" && DeliveryItems) {
        let totaldelqty = 0;
        $.each(DeliveryItems, function (i, e) {
            totaldelqty += e.dlQty;
        });
        let totalorderqty = 0;
        $.each(Wholesales.WholeSalesLns, function (i, e) {
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

$wholesalesDateDisplay.on("change", function () {
    Wholesales.JsWholesalesDate = <string>$(this).val();
});
$deliveryDateDisplay.on("change", function () {
    Wholesales.JsDeliveryDate = <string>$(this).val();
});
$(document).on("change", "#drpCustomer", function () {
    Wholesales.wsCusCode = <string>$(this).val();
    if (Wholesales.wsCusCode) {
        $.ajax({
            type: "GET",
            url: "/Api/GetCustomerByCode",
            data: { cusCode: Wholesales.wsCusCode },
            success: function (data: ICustomer) {
                selectedCus = structuredClone(data);
                $("#wsCustomerTerms").val(data.PaymentTermsDesc as string);
                Wholesales.wsCustomerTerms = data.PaymentTermsDesc as string;
                customerTermsModal
                    .find("#paymentIsDue")
                    .val(data.PaymentTermsDesc as string);
                customerTermsModal
                    .find("#balancedueDays")
                    .val(data.BalanceDueDays as number);
                let $drpaddr = fillInAddressList();
                Wholesales.wsDeliveryAddressId = deliveryAddressId =
                    $drpaddr.val() as number;

                let currcode = "";
                if (!useForexAPI)
                    currcode = GetForeignCurrencyFrmCode(Wholesales.wsCusCode!);
                // console.log("currcode:" + currcode);
                if (currcode !== "") {
                    $("#wsCurrency").val(currcode).prop("readonly", true);
                    fillInCurrencyModal(currcode);
                }
                if (!useForexAPI && selectedCus.ExchangeRate)
                    exRate = selectedCus.ExchangeRate;

                //console.log("exRate#drpcustomer change:" + exRate);
                displayExRate(exRate);
                if (enableTax && !inclusivetax) updateRows();
            },
            dataType: "json",
        });
    }
});

$(document).on("change", "#drpLocation", function () {
    Wholesales.wsSalesLoc = <string>$(this).val();
});

$(document).on("change", "#wsRemark", function () {
    Wholesales.wsRemark = <string>$(this).val();
});

$(document).on("change", "#wsCustomerPO", function () {
    Wholesales.wsCustomerPO = <string>$(this).val();
});

$(document).on("click", "#btnReload", function () {
    const Id = $("#wsUID").val();
    window.location.href = `/WholeSales/Edit?Id=${Id}&type=order`;
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

        let idx = 1;
        let itemcode: string = $(e)
            .find("td")
            .eq(idx)
            .find(".itemcode")
            .val() as string;
        
        itemOptions = DicItemOptions[itemcode];
        if (!itemOptions) return false;

        //todo: display vt in modal
        idx = 8;
        if (itemOptions.WillExpire) {
            $target = $(e)
                .find("td")
                .eq(idx)
                .find(".validthru.pointer");

            if (!itemOptions.ChkBatch && !itemOptions.ChkSN) {
                deliveryItem = DicSeqDeliveryItems[seq][0];
                if(deliveryItem)
                    $target.val(deliveryItem!.VtDisplay!);
            }                
            else  $target.val("...");            
        }
        idx--;
        if (itemOptions.ChkSN) {
            $target = $(e)
                .find("td")
                .eq(idx)
                .find(".serialno.pointer");
            $target.val("...");
        }
        idx--;
        if (itemOptions.ChkBatch) {
            $target = $(e)
                .find("td")
                .eq(idx)
                .find(".batch.pointer");
            $target.val("...");           
        }
    });
}

$(function () {
    approvalmode = $infoblk.data("approvalmode") == "True";
    setFullPage();
    forwholesales = true;
    DicLocation = $infoblk.data("jsondiclocation");
    JobList = $infoblk.data("jsonjoblist");
    uploadsizelimit = Number($infoblk.data("uploadsizelimit"));
    //console.log("uploadsizelimit:" + uploadsizelimit);
    uploadsizelimitmb = Number($infoblk.data("uploadsizelimitmb"));
    shop = $infoblk.data("shop") as string;
    initModals();

    gTblName = "tblWSI";
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
        ($("#wsStatus").val() as string).toLowerCase() === "passed"
            ? "requesting"
            : ($("#wsStatus").val() as string);
    let bgcls: string = status.toLowerCase().concat("statusbg");
    $("body").addClass(bgcls);

    editmode = Number($("#wsUID").val()) > 0;
    editapproved =
        getParameterByName("mode") != null &&
        getParameterByName("mode") == "editapproved";

    let _receiptno = getParameterByName("receiptno");
    let readonly: boolean = $infoblk.data("isadmin") === "True";
    //console.log("readonly:", readonly);

    if (_receiptno !== null || editmode) {
        receiptno = selectedSalesCode = _receiptno as string;
        reviewmode = _receiptno !== null && !editmode;
    }
    // console.log("receiptno:" + receiptno);

    if (!editmode)
        $("#wsExRate").val(1);

    if (reviewmode || editmode || editapproved) {
        Wholesales = fillInWholeSale();
        wholesaleslns = $infoblk.data("jsonwholesaleslns");
        //console.log("wholesaleslns:", wholesaleslns);
        DicIvInfo = $infoblk.data("jsondicivinfo");
        //console.log("DicIvInfo:", DicIvInfo);
        //dicitemgroupedvariations
        DicItemGroupedVariations = $infoblk.data("dicitemgroupedvariations");
        //console.log("DicItemGroupedVariations", DicItemGroupedVariations);
        
        if (Wholesales.wsStatus.toLowerCase() === "deliver" || Wholesales.wsStatus.toLowerCase() === "partialdeliver") {
            $("#btnInvoice").trigger("click");
            $("input").prop("readonly", true);
            $("textarea").prop("readonly", true);
            $("select").prop("disabled", true);
            $("#btnblk").find("a").addClass("disabled");
            $("#btnUseRecur").addClass("disabled").off("click");
            //console.log("here");
            readonly = true;
        }

        let html = "";
        let idx = 0;
        $.each(wholesaleslns, function (i, wholesalesln: IWholeSalesLn) {
            wholesalesln.itemVariList = []; //init the list
            const sntxt = wholesalesln.wslHasSn ? "..." : "";
            const batch = wholesalesln.wslBatchCode ?? "";
            wholesalesln.JsValidThru = wholesalesln.ValidThruDisplay ?? "";
            
            const vari = wholesalesln.iaIdList ? "..." : "";
            //console.log("vari:" + vari);

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
                Wholesales.wsStatus.toUpperCase() == "CREATED" ||
                    Wholesales.wsStatus == "order"
                    ? ""
                    : "readonly";
            //console.log("readonly:", _readonly);
            const wslseq: number =
                Wholesales.wsStatus.toLowerCase() == "order" ||
                    Wholesales.wsStatus.toLowerCase() == "created" ||
                    Wholesales.wsStatus.toLowerCase() == "requesting" ||
                    Wholesales.wsStatus.toLowerCase() == "rejected" ||
                    Wholesales.wsStatus.toLowerCase() == "passed"
                    ? wholesalesln.wslSeq!
                    : i + 1;
            //console.log("wslseq:" + wslseq);
            html += `<tr data-idx="${idx}" data-id="${wholesalesln.wslUID}"><td><span>${wslseq}</span></td><td><input type="text" name="itemcode" class="itemcode text-left" value="${wholesalesln.wslItemCode}" readonly></td><td><input type="text" name="itemdesc" class="itemdesc text-left" data-itemname="${wholesalesln.itmName}" value="${wholesalesln.itmNameDesc}" readonly></td><td class="text-right"><input type="text" name="sellunit" class="sellunit text-right" value="${sellunit}" readonly></td><td class="text-right"><input type="number" name="qty" class="qty text-right" value="${wholesalesln.wslQty}" ${_readonly}></td>`;

            if (
                Wholesales.wsStatus.toLowerCase() != "order" &&
                Wholesales.wsStatus.toLowerCase() != "created" &&
                Wholesales.wsStatus.toLowerCase() != "requesting" &&
                Wholesales.wsStatus.toLowerCase() != "rejected" &&
                Wholesales.wsStatus.toLowerCase() != "passed"
            )
                html += `<td class="text-right"><input type="number" name="delqty" class="delqty text-right" value="${wholesalesln.wslDelQty}" ${_readonly}></td>`;

            if (
                Wholesales.wsStatus.toLowerCase() != "order" &&
                Wholesales.wsStatus.toLowerCase() != "created" &&
                Wholesales.wsStatus.toLowerCase() != "requesting" &&
                Wholesales.wsStatus.toLowerCase() != "rejected" &&
                Wholesales.wsStatus.toLowerCase() != "passed"
            ) {
                //console.log("here");
                html += `<td><input type="text" name="batch" class="batch text-center pointer" readonly value="${batch}" /></td><td><input type="text" name="serailno" readonly class="serialno pointer text-center" value="${sntxt}" /></td><td><input type="datetime" name="validthru" class="small validthru pointer datepicker text-center" value="${wholesalesln.JsValidThru}" /></td>`;

                //itemvar
                html += `<td><input type="text" name="vari" class="small vari pointer text-center" value="${vari}" /></td>`;
            }
            html += `<td class="text-right"><input type="number" name="price" class="price text-right" data-price="${wholesalesln.wslSellingPrice}" value="${formattedprice}" readonly></td><td class="text-right"><input type="number" name="discpc" class="discpc text-right" data-discpc="${wholesalesln.wslLineDiscPc}" value="${formatteddiscpc}" ${_readonly}></td>`;
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
            html += `<td><select class="job flex">${getJobListOptions(wholesalesln.JobID ?? 0)}</select></td>`;
            html += `<td class="text-right"><input type="number" name="amount" class="amount text-right" data-amt="${wholesalesln.wslSalesAmt}" value="${formattedamt}" readonly></td>`;
            html += "</tr>";
            idx++;
        });

        Wholesales.WholeSalesLns = structuredClone(wholesaleslns);
        // console.log("html:" + html);
        $target = $(`#${gTblName} tbody`);
        $target.empty().html(html);

        $target = $("#deliveryDate").datepicker();
        $target.each(function () {
            $.datepicker._clearDate(this);
        });
        let deldate = new Date(Wholesales.DeliveryDateDisplay as string);
        // console.log("deldate:" + deldate);
        $target.datepicker("setDate", deldate);
        $target.datepicker("option", { dateFormat: "yy-mm-dd" });

        initDatePicker(
            "wholesalesDate",
            convertCsharpDateStringToJsDate(Wholesales.WholesalesDateDisplay)
        );

        Wholesales.JsWholesalesDate = <string>$wholesalesDateDisplay.val();
        Wholesales.JsDeliveryDate = <string>$deliveryDateDisplay.val();
        selectedCus = $infoblk.data("jscustomer");
        //console.log(selectedCus);
        fillInAddressList();
        if (
            (Wholesales.wsStatus == "order" ||
                Wholesales.wsStatus.toLowerCase() == "created" || Wholesales.wsStatus.toLowerCase() == "rejected" ||
                Wholesales.wsStatus.toLowerCase() == "requesting") && !readonly) {
            addRow();
            $(".btnSave").removeClass("hide");
            if (Wholesales.wsStatus.toLowerCase() == "requesting")
                $("#btnInvoice").hide();

            //console.log("DicBatTotalQty:", DicBatTotalQty);

        } else if (editapproved) {
            $("input").prop("readonly", false);
            $("select").prop("disabled", false);
            $("a").removeClass("disabled");
            $(".btnSave").addClass("hide");
            $(".request").removeClass("hide");
            // Wholesales.wsStatus = approvalmode ? "REQUESTING" : "order";
            Wholesales.wsStatus = "order";
            addRow();
        } else {
            $("input").prop("readonly", readonly).prop("disabled", readonly);
            $("select").prop("disabled", readonly);
            $("textarea").not("#txtField").prop("readonly", readonly);
            //console.log("here");
            fillInDeliveryItems();
        }

        if (getParameterByName("status") && getParameterByName("status") == "invoice")
            $("#btnInvoice").trigger("click");
    } else {
        Wholesales = fillInWholeSale();

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
    useForexAPI = Wholesales.UseForexAPI;

    if (useForexAPI) {
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
                        exRate = getExRate(Wholesales.wsCurrency);
                    }
                }
            },
            dataType: "json",
        });
    } else {
        DicCurrencyExRate = $infoblk.data("jsondiccurrencyexrate");
    }
});