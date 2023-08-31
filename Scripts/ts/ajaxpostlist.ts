$infoblk = $('#infoblk');

function initPhoneMailFormData(): IPhoneMailFormData {
    return {
        __RequestVerificationToken: <string>$('input[name=__RequestVerificationToken]').val(),
        PhoneMailList: [],
        model: initCustomer(),
    };
}
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
    //let _formdata: IPhoneMailFormData = initPhoneMailFormData();
    //let testlist: Array<IPhoneMail> = [];
    //let test1: IPhoneMail = initPhoneMail();
    //test1.mail = 'test1@test.com';
    //test1.phone = 'test11111';
    //let test2: IPhoneMail = initPhoneMail();
    //test2.mail = 'test2@test.com';
    //test2.phone = 'test22222';
    //testlist.push(test1);
    //testlist.push(test2);
    //_formdata.PhoneMailList = testlist.slice(0);
    const customer = initCustomer();
    let _formdata: ICustomerFormData = initCustomerFormData(customer);
    AttributeList = [];
    for (var i = 0; i < 30; i++) {
        let attribute: IAttribute = initAttribute(43, `attr${i}`, 'text', 1, 1, 1, `test${i}`, `attId${i}`);
        AttributeList.push(attribute);
    }

    let _customer: ICustomer = initCustomer();
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