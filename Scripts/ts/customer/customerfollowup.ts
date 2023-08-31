$infoblk = $("#infoblk"); 

customerId = $('#CustomerId').length ? Number($('#CustomerId').val()) : Number($("#Customer_cusCustomerID").val());
let customerfollowup: ICustomerFollowUp;

$(document).on("click", ".card-link.wclose", function () {
    let Id = $(this).data("id");
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
                    url: "/Customer/FollowUpDelete",
                    data: {
                        __RequestVerificationToken: $(
                            "input[name=__RequestVerificationToken]"
                        ).val(),
                        Id,
                    },
                    success: function (data) {
                        if (data) {
                            window.location.reload();
                        }
                    },
                    dataType: "json",
                });
            } else {
                $("#txtKeyword").trigger("focus");
            }
        },
    });
});
$(document).on("click", ".card-link.edit", function () {
    //console.log($(this).data('id'));
    customerfollowup = CustomerFollowUpList.find(
        (x) => x.Id == Number($(this).data("id"))
    ) as ICustomerFollowUp;
    customerFollowUpModal.find("textarea").val(customerfollowup.Content);
    openCustomerFollowUpModal();
});

$(document).on("click", "#btnReload", function () {
    window.location.href = `/Customer/FollowUp?customerId=${customerId}`;
});

const searchCusFollowUp = (keyword: string) => {
    window.location.href = `/Customer/FollowUp?customerId=${customerId}&Keyword=${keyword}`;
};
$(document).on("keyup", "#txtKeyword", function (e) {
    if (e.key === "Enter") {
        if ($(this).val()) searchCusFollowUp($(this).val() as string);
    }
});
$(document).on("change", "#txtKeyword", function () {
    if ($(this).val()) searchCusFollowUp($(this).val() as string);
});

const confirmCustomerFollowUp = () => {
    closeCustomerFollowUpModal();
    if (!customerfollowup) customerfollowup = initCustomerFollowUp();
    customerfollowup.Content = customerFollowUpModal
        .find("textarea")
        .val() as string;
    //console.log(customerfollowup);
    //return;
    $.ajax({
        type: "POST",
        url: "/Customer/FollowUpEdit",
        data: {
            __RequestVerificationToken: $(
                "input[name=__RequestVerificationToken]"
            ).val(),
            model: customerfollowup,
        },
        success: function (data) {
            if (data) {
                window.location.reload();
            }
        },
        dataType: "json",
    });
};

$(document).on("click", "#btnAdd", function (e) {
    e.preventDefault();
    openCustomerFollowUpModal();
});

$(document).on("click", "#btnDate", function () {
    openDateTimeModal();
});


$(function () {
    forCustomer = true;
    initModals();
    initDatePicker("strDateTime", $("#strDateTime").data("val"), true, "yy-mm-dd");

    $("#txtKeyword").trigger("focus");

    $target = $(".pagination");
    $target
        .wrap('<nav aria-label="Page navigation"></nav>')
        .find("li")
        .addClass("page-item")
        .find("a")
        .addClass("page-link");
    $(".pagination li").addClass("page-item");

    let keyword = getParameterByName("Keyword");
    if (keyword !== null) {
        $("#txtKeyword").val(keyword);
    }

    let customerFollowUpList = $infoblk.data(
        "jsonpaginlist"
    ) as ICustomerFollowUp[];
    //console.log(customerFollowUpList);
    if (typeof customerFollowUpList === "undefined") {
        CustomerFollowUpList = [];
    } else {
        CustomerFollowUpList = customerFollowUpList.slice(0);
    }
    //console.log(CustomerFollowUpList);

    if (CustomerFollowUpList.length > 0) {
        //let Ids: number[] = [];
        for (let r = 0; r < 5; r++) {
            let html = "";
            for (let i = 3 * r; i < 3 * (r + 1); i++) {
                let c: ICustomerFollowUp = CustomerFollowUpList[i];
                if (c) {
                    let content: string =
                        c.Content.length > 43
                            ? c.Content.substring(0, 43) + "..."
                            : c.Content;
                    html += `<div class="col-12 col-md-4">
                    <div class="card">
<div class="text-right px-2">
        <a href="#" class="card-link small edit" data-id="${c.Id}"><i class="fas fa-edit" data-id="${c.Id}"></i></a>
        <a href="#" class="card-link small wclose" data-id="${c.Id}"><i class="fas fa-window-close" data-id="${c.Id}"></i></a>
</div>
                        <div class="card-body">
							${content} <span class="float-right">${c.ModifyTimeDisplay}</span>
                        </div>
                    </div>
                </div>`;
                    //Ids.push(c.Id);
                }
            }
            $(".data").eq(r).html(html);
        }
    }
});
