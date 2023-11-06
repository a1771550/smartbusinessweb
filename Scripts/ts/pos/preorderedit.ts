$infoblk = $("#infoblk");
PreSalesLnList = [];
$(function () {
	forpreorder = true;
	setFullPage();
	initModals();

	salesType = SalesType.preorder;
	batchidx = 5;
	snidx = batchidx + 1;
    vtidx = snidx + 1;

    PreSales = $infoblk.data("sales");
    //console.log("PreSales:", PreSales);
    gTblName = "tblSales";

    cpplList = $infoblk.data("customerpointpricelevels");
    
    DicPayTypes = $infoblk.data("dicpaytypes");
	defaultcustomer = $infoblk.data("defaultcustomer");
	taxModel = $infoblk.data("taxmodel");
	inclusivetax = $infoblk.data("inclusivetax")=="True";
	inclusivetaxrate = $infoblk.data("inclusivetaxrate");
    enableTax = $infoblk.data("enabletax") == "True";
    DicLocation = $infoblk.data("diclocation");	
    JobList = $infoblk.data("joblist");

	$(".NextSalesInvoice").val(PreSales.rtsCode);
	$("#txtNotes").val(PreSales.rtsRmks);

    shop = PreSales.rtsSalesLoc;
    device = PreSales.rtsDvc;
    $("#drpLocation").val(shop);
    $("#drpDevice").val(device);

	editmode = PreSales.rtsUID > 0;
    if (editmode) {        
        $("#txtNotes").val(PreSales.rtsRmks);
        $("#txtInternalNotes").val(PreSales.rtsInternalRmks);
       /* $("#txtRoundings").val(formatnumber(PreSales.Roundings));*/
		selectedCus = $infoblk.data("customer");		
		selectCus();
        ItemList = $infoblk.data("items");
        PreSalesLnList = $infoblk.data("saleslnlist");
        DicItemSNs = $infoblk.data("dicitemsns");
        
        itemsnlist = [];
        $.each(PreSalesLnList, function (i, e) {
            //   console.log(e);
            selectedItem = e.Item;
            selectedItemCode = selectedItem.itmCode;
            //   console.log("selecteditemcode#loop:" + selectedItemCode);
            let salesln: ISalesBase = {} as ISalesBase;
            salesln.amount = <number>e.rtlSalesAmt;
            salesln.batchcode = e.rtlBatchCode;
            salesln.discount = <number>e.rtlLineDiscAmt;
            salesln.itemcode = selectedItemCode;
            salesln.itemdesc = e.Item.itmDesc;
            salesln.itemname = e.Item.itmName;
            salesln.price = <number>e.rtlSellingPrice;
            salesln.qty = <number>e.rtlQty;
            salesln.rtlBatchCode = e.rtlBatchCode;
            salesln.rtlItemCode = selectedItemCode;
            salesln.rtlLineDiscPc = <number>e.rtlLineDiscPc;
            salesln.rtlQty = <number>e.rtlQty;
            salesln.rtlSalesAmt = <number>e.rtlSalesAmt;
            salesln.rtlSellingPrice = <number>e.rtlSellingPrice;
            salesln.rtlSeq = <number>e.rtlSeq;
            salesln.rtlTaxPc = <number>e.rtlTaxPc;            

            currentY = i;
            let $tr = $target.eq(currentY);

            let idx = 0;
            idx++;
            $tr.find("td").eq(idx).find(".itemcode").val(selectedItemCode);
            idx++;
            $tr.find("td").eq(idx).find(".itemdesc").val(e.Item.NameDesc);
            idx++;
            $tr.find("td").eq(idx).find(".sellunit").val(e.Item.itmSellUnit);   
            
            idx=4;
            $tr
                .find("td")
                .eq(idx)
                .find(".qty")
                .prop("reaonly", true)
                .val(Number(e.rtlQty));
                //.trigger("change");
            // console.log("qty triggered change@load");

            if (!$.isEmptyObject(DicItemSNs)) {
                for (const [key, value] of Object.entries(DicItemSNs)) {
                    // console.log(`key:${key}: value:${value}`);
                    let keyarr = key.split(":");
                    if (
                        e.rtlCode == keyarr[0] &&
                        e.rtlItemCode == keyarr[1] &&
                        e.rtlSeq == parseInt(keyarr[2])
                    ) {
                        //console.log('matched!');
                        let arrSN: Array<string> = [];
                        $.each(value, function (k, v) {
                            arrSN.push(v.snoCode);
                        });
                        let objSN: IItemSN = {
                            itemcode: selectedItem.itmCode,
                            seq: <number>e.rtlSeq,
                            serialcodes: arrSN,
                        } as IItemSN;
                        //   console.log("objsn#loop:", objSN);
                        itemsnlist.push(objSN);
                        //   console.log("itemsnlist#loop:", itemsnlist);
                    }
                }
            }
           
            if (e.rtlHasSerialNo) {
                setSNmark(false);
            }

            idx = PriceIdx4Sales;
            let $price = $tr.find("td").eq(idx).find(".price");
            $price.val(formatnumber(e.rtlSellingPrice!));
            $price.prop("readonly", !selectedItemCode.startsWith("/"));
            idx++;
            $tr.find("td").eq(idx).find(".discpc").val(formatnumber(e.rtlLineDiscPc ?? 0));
            idx++;
            $tr.find("td").eq(idx).find(".taxpc").val(formatnumber(e.rtlTaxPc ?? 0));
            idx++;
            $tr.find("td").eq(idx).find(".location").prop("disabled",true).val(e.rtlSalesLoc ?? e.rtlStockLoc);
            idx++;
            $tr.find("td").eq(idx).find(".job").prop("disabled", true).val(e.JobID??0);
            $tr
                .find("td")
                .last()
                .find(".amount")
                .val(formatnumber(e.rtlSalesAmt ?? 0));
            // .trigger("change");

            updateRow(e.rtlSellingPrice ?? 0, e.rtlLineDiscPc ?? 0);

            if (PreSalesLnList.length>1)addRow();
                
        });

        $("#txtDepositAmt").val(formatnumber(PreSales.PayAmt));
        itotalremainamt = PreSales.TotalRemainAmt!;
        $("#txtTotalRemain").val(formatnumber(itotalremainamt));

        $(".btnPayment").prop("disabled", (PreSales.rtsRefCode));

	} else {
		if (defaultcustomer !== null) {
			selectedCus = defaultcustomer;
			selectedCusCodeName = defaultcustomer.cusCode;			
			selectCus();
		} else {
			$("#txtCustomerName").trigger("focus");
		}
	}
});