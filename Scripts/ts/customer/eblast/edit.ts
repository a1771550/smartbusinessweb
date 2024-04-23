$infoblk = $('#infoblk');
let ishtml: boolean;

function toggleContentBlk() {
    if (ishtml) {
        $('#htmlblk').show();
        $('#textblk').hide();
    } else {
        $('#htmlblk').hide();
        $('#textblk').show();
    }
}

$(document).on('change', '.format', function () {
    if ($(this).val() == 'html') {
        $('#blHtml').val(1);       
    } else {
        $('#blHtml').val(0);
    }  
    ishtml = $(this).val() == 'html';
    console.log(ishtml + ';' + $('#blHtml').val());
    toggleContentBlk();
});

$(function () {       
    initModals();   
    editmode = $('#Id').length == 1;
    if (editmode) {
        ishtml = $('#blHtml').val() === 'True';
        toggleContentBlk();
    } else {
        $('#textblk').hide();
        $('#blHtml').val(1);
        ishtml = true;
    }

    $('#blSubject').trigger("focus");

    $('.datetimepicker').datetimepicker({        
    });
});