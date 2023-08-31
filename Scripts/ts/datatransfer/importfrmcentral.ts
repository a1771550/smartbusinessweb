$infoblk = $("#infoblk");

$(document).on("click", ".import", function () {
    const type: string = $(this).data("type") as string;
    $.ajax({
        type: "GET",
        url: "/Api/CheckIfFileLocked",
        data: { file: "" },
        success: function (data) {
            // console.log("data:", data);
            // blocked = data === "1";
            // console.log("blocked:", blocked);
            if (data == "1") {
                $.fancyConfirm({
                    title: "",
                    message: abssfilelockedalerttxt,
                    shownobtn: false,
                    okButton: oktxt,
                    noButton: notxt,
                });
            } else {
                switch (type) {
                    case "job":
                        $("#filename").val("Job_");
                        break;
                    case "currency":
                        $("#filename").val("Currency_");
                        break;
                    case "account":
                        $("#filename").val("Account_");
                        break;
                    case "tax":
                        $("#filename").val("Tax_");
                        break;
                    case "customer":
                        $("#filename").val("Customers_");
                        break;
                    case "supplier":
                        $("#filename").val("Suppliers_");
                        break;
                    case "employee":
                        $("#filename").val("Employees_");
                        break;
                    default:
                    case "item":
                        $("#filename").val("Items_");
                        break;
                }

                openWaitingModal();
                $.ajax({
                    type: "POST",
                    url: "/DataTransfer/DoImportFrmCentralAsync",
                    data: $("#frmImport").serialize(),
                    success: function (data) {
                        console.log("returned data:", data);
                        falert($infoblk.data("importdonemsg"), oktxt);
                        closeWaitingModal();
                        switch (type) {
                            case "job":
                                $("#btnImportJob").off("click").prop("disabled", true);
                                break;
                            case "currency":
                                $("#btnImportCurrency").off("click").prop("disabled", true);
                                break;
                            case "account":
                                $("#btnImportAccount").off("click").prop("disabled", true);
                                break;
                            case "tax":
                                $("#btnImportTax").off("click").prop("disabled", true);
                                break;
                            case "customer":
                                $("#btnImportCustomer").off("click").prop("disabled", true);
                                break;
                            case "supplier":
                                $("#btnImportSupplier").off("click").prop("disabled", true);
                                break;
                            case "employee":
                                $("#btnImportEmployee").off("click").prop("disabled", true);
                                break;
                            default:
                            case "item":
                                $("#btnImportItem").off("click").prop("disabled", true);
                                break;
                        }

                        localStorage.removeItem("sessionstartdata");
                    },
                    dataType: "json",
                });
            }
        },
        dataType: "json",
    });
});

$(document).on("change", "#kingdee", function () {
    changeCheckoutPortal("kingdee", "import");
});
$(document).on("change", "#abss", function () {
    changeCheckoutPortal("abss", "import");
});

$(document).on("click", "#btnGetPath", function () {
    openWaitingModal();
    const url = "/DataTransfer/CreateDayendsFolder";
    $.ajax({
        type: "POST",
        url: url,
        data: $("#frmImport").serialize(),
        success: function (data) {
            closeWaitingModal();
            $("#btnGetPath").addClass("isDisabled");
            $("#btnImport").removeClass("isDisabled");
            console.log("returned data:", data);
            $("#importpathmsg").empty().append(data.folder);
        },
        dataType: "json",
    });
});

function bindtable() {
    $("#tblGrid").DataTable({
        pageLength: 10,
        bLengthChange: false,
        sAjaxSource: "/Api/GetImportFileList",
        fnServerParams: function (aoData) {
            aoData.push({
                name: "myobfilename",
                value: $infoblk.data("myobfilename"),
            });
        },
        bServerSide: true,
        bProcessing: true,
        bSearchable: true,
        order: [[1, "desc"]],
        language: {
            emptyTable: nodatafoundtxt,
            processing: `<i class="fa fa-spinner fa-spin fa-3x fa-fw" style="color:#2a2b2b;"></i><span class="sr-only">${loadingtxt}...</span>`,
        },
        columns: [
            {
                data: "Name",
                autoWidth: true,
                searchable: true,
            },
            {
                data: "LastWriteTime",
                autoWidth: true,
                searchable: true,
            },
        ],
        /* columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0
        }],
            select: {
            style: 'os',
                selector: 'td:first-child'
        },*/
        /* order: [[1, 'desc']],*/
        drawCallback: function (settings) { },
    });
}

$(document).on("change", ".chkfile", function () {
    const file = <string>$(this).val();
    if ($(this).is(":checked")) {
        filelist.push(file);
    } else {
        const index = filelist.indexOf(file);
        if (index > -1) {
            filelist.splice(index, 1);
        }
    }
});
