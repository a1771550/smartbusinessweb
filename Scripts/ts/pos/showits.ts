$infoblk = $('#infoblk');

$(document).on('change', '.chkgroup', function () {
	$.ajax({
		type: "POST",
		url: '/Report/ShowITS',
		data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val() },
		success: function (data) {


		},
		dataType: 'json'
	});
});


function doFilter() {
	if (minDate !== '' && maxDate !== '') {
		$('#frmtxd').submit();
	}
}

