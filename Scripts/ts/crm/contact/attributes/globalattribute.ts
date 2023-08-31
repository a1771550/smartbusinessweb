$infoblk = $('#infoblk');

function saveGCombo() {
    $target = gcomboModal.find('form').find('.gcombo');
    //enteratleasttxt
    let valcount = 0;
    gAttribute.combo.values = [];
    $.each($target, function (i, e) {
        let _val = <string>$(e).val();
        if (_val !== '') {
            gAttribute.combo.values.push(_val);
            valcount++;
        }
    });

    if (valcount === 0) {
        $.fancyConfirm({
            title: '',
            message: $infoblk.data('enteratleasttxt'),
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    $target.eq(0).trigger("focus");
                }
            }
        });
    } else {
        closeGComboModal();
    }
    //console.log('gattr:', gAttribute);
    $.each(gAttributes, function (i, e) {
        if (e.gattrId == gAttribute.gattrId) {
            console.log('here');
            e.attrName = gAttribute.attrName;
            e.attrValue = gAttribute.combo.values.join('||');
            $('fieldset').find('.form-group').find(`#${e.gattrId}`).data('attrvalue', e.attrValue).val(e.attrName);

            return false;
        }
    });
    //console.log('gattrs:', gAttributes);
    //saveGattr();

}

function saveGattr(customerId: number) {
    let gattributes:IGlobalAttribute[] = [];
    $("#gattrblk .form-control.attr").each(function (i, e) {
        gattributes.push({
            gattrId: $(e).attr("id") as string,
            attrValue: $(e).val() as string
        } as IGlobalAttribute);
    });

    console.log('gatts#save:', gattributes);
    console.log("cAttributes#save:", cAttributes);
    //return false;
    $.ajax({
        type: "POST",
        url: '/Customer/SaveAttr',
        data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(),customerId, gAttributes:gattributes, cAttributes  },
        success: function (data) {
            if (data) {
                window.location.href = "/Customer/Edit?customerId=" + customerId +"&saveattr=1";
            }            
        },
        dataType: 'json'
    });
}

//$(document).on('change', '#gattrblk .form-control.attr', function () {
//    let _id: string = <string>$(this).attr('id');
//    let _val: string = <string>$(this).val();
//    //console.log('_name:' + _name);
//    $.each(gAttributes, function (i, e) {
//        if (e.gattrId == _id && _val !== '') {
//            e.attrValue = _val;
//            gAttribute = e;
//            return false;
//        }
//    });
//    //console.log('gatt:', gAttribute);
//    //console.log('gatts:', gAttributes);
//});

$(document).on('change', '#gattrblk .form-control.cattr', function () {
    //console.log(customer.cusCustomerID);
    //console.log(apId);
    let val:string= $(this).val() as string;
    if (val) {
        const Id: string = makeId(16);
        let cattr: ICustomAttribute = {
            attrId: Id,
            contactId: customer.cusCustomerID,
            attrName: Id,
            attrValue: val,
            attrType:"custom",
            attrIsDefault: false,
            attrIsGlobal: false,
            gattrId:""
    };
        cAttributes.push(cattr);
    }
});

$(document).on('click', '#btnPlusAttr', function () {
    $target = $("#gattrblk").find('#cattrlist');
    $target.find('.cattr:last').clone().appendTo($target).trigger("focus");
});

$(document).on('click', '#btnMinusAttr', function () {
    $target = $("#gattrblk").find('#cattrlist');
    if ($target.find('.cattr').length > 1) {
        $target.find('.cattr:last').remove();
        $target.find('.cattr:last').trigger("focus");
    }
});

$(document).on('click', '#btnPlus', function () {
    $target = gcomboModal.find('form');
    $target.find('.form-group:last').clone().appendTo($target);
    $target.find('.form-group:last').find('.form-control').val('').trigger("focus");
});

$(document).on('click', '#btnMinus', function () {
    $target = gcomboModal.find('form');
    if ($target.find('.form-group').length > 1) {
        $target.find('.form-group:last').remove();
        $target.find('.form-group:last').find('.form-control').trigger("focus");
    }
});

$(document).on('click', '.border', function () {
    $target = $(this).prev('.combo');
    let _name = <string>$target.val();
    if (_name === '') {
        $.fancyConfirm({
            title: '',
            message: $infoblk.data('entercustomnamefirsttxt'),
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    $target.trigger("focus");
                }
            }
        });
    } else {
        let _id: string = <string>$(this).data('id');
        $.each(gAttributes, function (i, e) {
            //console.log('attrvalue:'+e.attrValue);
            if (e.gattrId == _id) {
                gAttribute = e;
                return false;
            }
        });
        //console.log('gattr#border:', gAttribute);
        //alert(gAttribute.attrValues);
        openGComboModal();

    }
});



function initgattr(_id: string, i: number, t: string, apId: number) {
    $target = $('fieldset').find('.form-group').find(`#${_id}`);
    let _val: string = $target.data('attrvalue');
    let _ga: IGlobalAttribute = initGlobalAttribute(_id, $target.data('attrname'), _val, t, i, apId);
    gAttributes.push(_ga);
}

$(function () {
    //initModals();
    gAttributes = [];
    let apId: number = <number>$infoblk.data('apid');

    let _id: string = '';
    for (let i = 1; i <= 20; i++) {
        _id = `txt${i}`;
        initgattr(_id, i, 'text', apId);
    }
    for (let i = 21; i <= 30; i++) {
        _id = `drp${i}`;
        initgattr(_id, i, 'dropdown', apId);
    }
    //console.log('gattributes#ready:', gAttributes);
});
