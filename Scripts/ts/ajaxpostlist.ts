$infoblk = $('#infoblk');

function initPhoneMail(): IPhoneMail {
    return {
        phone: '',
        mail: ''
    };
}
interface IPhoneMail {
    phone: string;
    mail: string;
}
interface IPhoneMailFormData extends IBaseFormData {
    model:ICustomer,
    PhoneMailList:Array<IPhoneMail>,
}

$(document).on('click', '#btnPost', function () {   
    const customer = {} as ICustomer;
    let _formdata: ICustomerFormData = initCustomerFormData(customer);
    AttributeList = [];
    for (var i = 0; i < 30; i++) {
        let attribute: IAttribute = initAttribute(43, `attr${i}`, 'text', 1, 1, 1, `test${i}`, `attId${i}`);
        AttributeList.push(attribute);
    }

    let _customer: ICustomer = {} as ICustomer;
    _customer.cusCustomerID = 43;
    _formdata.model = _customer;
    //_formdata.AttributeList = AttributeList.slice(0);

    console.log('formdata:', _formdata);

    $.ajax({
        type: "POST",
        url: '/Test/AjaxPostList',
        data: _formdata,
        success: function (data) {
            
        },
        dataType: 'json'
    });
});