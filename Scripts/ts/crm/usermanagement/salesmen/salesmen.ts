$infoblk = $('#infoblk');
iscrmadmin = $infoblk.data('iscrmadmin') == 'True';
iscrmsalesmanager = $infoblk.data('iscrmsalesmanager') == 'True';

let salesgroupmember: Array<ICrmUser> = [];

function unassignContactFrmGroup(contactId: number, groupId: number) {
    $.ajax({
        type: "GET",
        url: '/Salesmen/GetContactAssignedToSalesPeopleCount',
        data: { contactId,groupId },
        success: function (data) {
            console.log('data:' + data);
            if (data > 0) {
                //contactassignedtogroupconfirmprompttxt
                $.fancyConfirm({
                    title: '',
                    message: contactassignedtogroupconfirmprompttxt,
                    shownobtn: true,
                    okButton: oktxt,
                    noButton: notxt,
                    callback: function (value) {
                        if (value) {
                            closeAssignedContactModal();
                            openWaitingModal();
                            $.ajax({
                                type: "POST",
                                url: '/Salesmen/UnassignContactFrmGroup',
                                data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), contactId, groupId },
                                success: function (data) {
                                    if (data) {
                                        closeWaitingModal();
                                        $.fancyConfirm({
                                            title: '',
                                            message: data,
                                            shownobtn: false,
                                            okButton: oktxt,
                                            noButton: notxt,
                                            callback: function (value) {
                                                if (value) {
                                                    window.location.reload();
                                                }
                                            }
                                        });
                                    }
                                },
                                dataType: 'json'
                            });
                        }
                    }
                });
            }
        },
        dataType: 'json'
    });	

   
}

//unassignContactFrmSalesman(9,25746);
function unassignContactFrmSalesman(salesmanId: number, contactId: number) {
    $.fancyConfirm({
        title: '',
        message: confirmunassigntxt,
        shownobtn: true,
        okButton: oktxt,
        noButton: notxt,
        callback: function (value) {
            if (value) {
                closeAssignedContactModal();
                openWaitingModal();
                $.ajax({
                    type: "POST",
                    url: '/Salesmen/UnassignContactFrmSalesman',
                    data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), contactId, salesmanId },
                    success: function (data) {
                        if (data) {
                            closeWaitingModal();
                            $.fancyConfirm({
                                title: '',
                                message: data,
                                shownobtn: false,
                                okButton: oktxt,
                                noButton: notxt,
                                callback: function (value) {
                                    if (value) {
                                        window.location.reload();
                                    }
                                }
                            });
                        }
                    },
                    dataType: 'json'
                });
            }
        }
    });

}

function selectSales4Assign(salesmanId: number) {
    closeGroupSalesmenModal();
    openWaitingModal();
    $.ajax({
        type: "POST",
        url: '/Salesmen/AssignSalesmanToContact',
        data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), 'salesmanId': salesmanId, 'contactId':selectedContactId },
        success: function (data) {     
            closeWaitingModal();
            if (data) {
                $.fancyConfirm({
                    title: '',
                    message: data,
                    shownobtn: false,
                    okButton: oktxt,
                    noButton: notxt,
                    callback: function (value) {
                        if (value) {
                            window.location.reload();
                        }
                    }
                });
            }
        },
        dataType: 'json'
    });
}

function assignToSales(salesmanId:number,contactId:number) {
    //console.log('contactId:' + contactId);
    selectedContactId = contactId;
    closeAssignedContactModal();
    $.ajax({
        type: "GET",
        url: '/Salesmen/GetSalesGroupMember',
        data: { 'salesmanId': salesmanId },
        success: function (data) {
            console.log(data);
            if (data) {
                salesgroupmember = data;
                pagingRecords(salesgroupmember, 'groupsalesmen');      
            }
        },
        dataType: 'json'
    });
    
}



//unassignEnquiry(9,1242);
function unassignEnquiry(salesmanId: number, enqId: number) {
    $.fancyConfirm({
        title: '',
        message: confirmunassigntxt,
        shownobtn: true,
        okButton: oktxt,
        noButton: notxt,
        callback: function (value) {
            if (value) {
                closeAssignedEnquiryModal();
                openWaitingModal();
                $.ajax({
                    type: "POST",
                    url: '/Enquiry/Unassign',
                    data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), enqId, salesmanId },
                    success: function (data) {
                        if (data) {
                            closeWaitingModal();
                            $.fancyConfirm({
                                title: '',
                                message: data,
                                shownobtn: false,
                                okButton: oktxt,
                                noButton: notxt,
                                callback: function (value) {
                                    if (value) {
                                        window.location.reload();
                                    }
                                }
                            });
                        }
                    },
                    dataType: 'json'
                });
            }
        }
    });	
}


$(document).on('click', '.btngetassignedcontacts', function () {
    selectedSalesmanId = $(this).data('userid');
    console.log(selectedSalesmanId + ';' + $(this).data('managerid'));
    
    $.ajax({
        type: "GET",
        url: '/Salesmen/GetAssignedContactList',
        data: { 'salesmanId':selectedSalesmanId,'managerId': $(this).data('managerid')},
        success: function (data) {
            console.log(data);
            if (data) {
                assignedcontacts = data;
                pagingRecords(assignedcontacts, 'assignedcontacts');
            }
        },
        dataType: 'json'
    });
});
$(document).on('click', '.btngetassignedenquiries', function () {
    selectedSalesmanId = $(this).data('userid');
    //console.log(salesmanId);
    $.ajax({
        type: "GET",
        url: '/Salesmen/GetAssignedEnquiryList',
        data: { 'salesmanId': selectedSalesmanId },
        success: function (data) {
            //console.log(data);
            if (data) {
                assignedenquiries = data;
                pagingRecords(assignedenquiries, 'assignedenquiries');
            }
        },
        dataType: 'json'
    });
});

$(document).on('click', '.btnedit', function () {
    window.location.href = '/Salesmen/Edit?userId=' + $(this).data('userid');
});
$(document).on('click', '.btnremove', function () {
    let userId = $(this).data('userid');
    $.fancyConfirm({
        title: '',
        message: $infoblk.data('confirmremovetxt'),
        shownobtn: true,
        okButton: oktxt,
        noButton: notxt,
        callback: function (value) {
            if (value) {
                window.location.href = '/Salesmen/Delete?userId=' + userId;
            }
        }
    });
});

$(document).ready(function () {    
    initModals();
});
