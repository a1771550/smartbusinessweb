$infoblk = $('#infoblk');

$(document).on('click', '.detail', function () {
	let Id = $(this).data('id');
	$.ajax({
		type: "GET",
		url: '/GraphSettings/Details',
		data: { Id: Id },
		success: function (data) {
			console.log('data:', data);
			let html = graphsettingdetail(data);
			$.fancyConfirm({
				title: '',
				message: html,
				shownobtn: false,
				okButton: closetxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						$('#txtKeyword').focus();
					}
				}
			});
		},
		dataType: 'json'
	});
});


function graphsettingdetail(data: IGraphSettings) {	
	let html = '<h3 class="my-3">' + $infoblk.data('graphsettingsdetailtxt') + '</h3>' + '<ul class="list-group list-group-flush">';
	html += '<li class="list-group-item"><strong>' + appnametxt + '</strong>: ' + data.gsAppName + '</li>';
	html += '<li class="list-group-item"><strong>' + emailtxt + '</strong>: ' + data.gsEmailResponsible + '</li>';
	html += '<li class="list-group-item"><strong>' + clientidtxt + '</strong>: ' + data.gsClientId + '</li>';
	html += '<li class="list-group-item"><strong>' + tenantidtxt + '</strong>: ' + data.gsTenantId + '</li>';
	html += '<li class="list-group-item"><strong>' + redirecturitxt + '</strong>: ' + data.gsRedirectUri + '</li>';
	if (data.gsClientSecretVal !== null) {
		html += '<li class="list-group-item"><strong>' + clientsecretvaltxt + '</strong>: ' + data.gsClientSecretVal + '</li>';
    }
	html += '<li class="list-group-item"><strong>' + createtimetxt + '</strong>: ' + data.CreateTimeDisplay + '</li>';
	html += '<li class="list-group-item"><strong>' + modifytimetxt + '</strong>: ' + data.ModifyTimeDisplay + '</li>';
	html += '</ul>';
	return html;
}