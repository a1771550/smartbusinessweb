$infoblk = $('#infoblk');

$(function () {	
	getRemoteData('/Print/GetPrintHtml', { issales: $infoblk.data('issales'), salesrefundcode: $infoblk.data('salesrefundcode') }, getPrintDataOk, getRemoteDataFail);
});

function getPrintDataOk(data) {	
	//console.log(data.html);
	$('#printblk .container:first').append(data.html);
	setTimeout(function () {
		window.print();
	}, 1000); //allow chrome to load image
}