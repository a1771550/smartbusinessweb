$infoblk = $('#infoblk');

$(document).on("click", ".contact", function () {
	console.log("eblastid:", $(this).data("id"));
	const blastId = Number($(this).data("id"));
	$.ajax({
		type: "GET",
		url: '/eBlast/GetContactsByBlastId',
		data: {blastId},
		success: function (data:ICustomer[]) {
			//console.log(data);
			let cusIds: number[] = [];
			if (data && data.length > 0) {
				data.forEach((x) => { cusIds.push(x.cusId!); });
				//console.log(cusIds);
				window.open("/Customer/Index?cusIds=" + cusIds.join(","), "_blank");
			}
		},
		dataType: 'json'
	});
});
$(document).on('click', '.test', function () {
	console.log('id:' + $(this).data('id'));
	eblastId = <number>$(this).data('id');
	openTestEblastModal();
});


$(document).on('click', '.log', function () {
	let Id = $(this).data('id');
	window.open('/eBlast/Log?id=' + Id,'_self');	
})

$(document).on('click', '.start', function () {		
	let Id = $(this).data('id');
	//console.log("Id:", Id);
	//return;
	openWaitingModal();
	$.ajax({
		type: "POST",
		url: '/eBlast/Start',
		data: { Id },
		success: function (data) {
			closeWaitingModal();
			console.log('data:', data);			
			$.fancyConfirm({
				title: '',
				message: data.msg,
				shownobtn: false,
				okButton: closetxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						$('#txtKeyword').trigger("focus");
					}
				}
			});
		},
		dataType: 'json'
	});	
})

$(document).on('click', '.detail', function () {
	let Id = $(this).data('id');
	$.ajax({
		type: "GET",
		url: '/eBlast/Detail',
		data: { Id: Id },
		success: function (data) {
			console.log('data:', data);			
			let html = eblastdetail(data);
			$.fancyConfirm({
				title: '',
				message: html,
				shownobtn: false,
				okButton: closetxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						$('#txtKeyword').trigger("focus");
					}
				}
			});
		},
		dataType: 'json'
	});
});

function eblastdetail(data: IeBlast) {
	let _format = data.blHtml ? htmltxt : texttxt;
	let html = '<h3>' + eblastdetailtxt + '</h3>' + '<ul class="list-group list-group-flush">';
	html += '<li class="list-group-item"><strong>' + formattxt + '</strong>: ' + _format + '</li>';
	html += '<li class="list-group-item"><strong>' + subjecttxt + '</strong>: ' + data.blSubject + '</li>';
	html += '<li class="list-group-item"><strong>' + contenttxt + '</strong>: ' + data.blContent + '</li>';
	html += '<li class="list-group-item"><strong>' + pausesendlabeltxt + '</strong>: ' + data.blPause + '</li>';
	html += '<li class="list-group-item"><strong>' + $infoblk.data('scheduledsendtimetxt') + '</strong>: ' + data.SendTimeDisplay + '</li>';	
	html += '<li class="list-group-item"><strong>' + createtimetxt + '</strong>: ' + data.CreateTimeDisplay + '</li>';
	html += '<li class="list-group-item"><strong>' + modifytimetxt + '</strong>: ' + data.ModifyTimeDisplay + '</li>';
	html += '</ul>';
	return html;
}


$(document).on('click', '.remove', function () {
	let Id = <number>$(this).data('id');
	let token = $('input[name=__RequestVerificationToken]').val();
	$.fancyConfirm({
		title: '',
		message: confirmremove,
		shownobtn: true,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					type: "POST",
					url: '/eBlast/Delete',
					data: { Id: Id, '__RequestVerificationToken': token },
					success: function () {
						window.location.reload();
					},
					dataType: 'json'
				});
			}
		}
	});
});

$('#btnReload').on('click', function (e) {
	e.stopPropagation();
	window.location.href = '/eBlast/Index';
});



$('#btnReload').on('click', function (e) {
	e.stopPropagation();
	$('#txtKeyword').val('');
	window.location.href = `/eBlast/Index`;
});

$(document).on('click', '#btnReset', function () {
	$('#txtKeyword').val('').trigger("focus");
});

$(document).on('click', '#btnSearch', function () {
	keyword = <string>$('#txtKeyword').val();
	if (keyword !== '') {
		openWaitingModal();
		let $sortcol = $('<input>').attr({ type: 'hidden', name: 'Keyword', value: keyword.trim() });
		$('#frmBlast').append($sortcol).trigger("submit");
	}
});

$(document).on('click', '.colheader', function () {
	let $sortcol = $('<input>').attr({ type: 'hidden', name: 'SortCol', value: $(this).data('col') });
	let $keyword = $('<input>').attr({ type: 'hidden', name: 'Keyword', value: $(this).data('keyword') });
	$('#frmBlast').append($sortcol).append($keyword).trigger("submit");
});

$(function () {
	setFullPage();
	let $sortorder = $('#sortorder');
	let $sortcol = $('#sortcol');
	//console.log('sortorder:' + $sortorder.val() + ';sortcol:' + $sortcol.val());
	$target = $('.colheader').eq(<number>$sortcol.val());
	let sortcls = $sortorder.val() === 'desc' ? 'fa fa-sort-up' : 'fa fa-sort-down';
	$target.addClass(sortcls);
	$target = $('.pagination');
	$target.wrap('<nav aria-label="Page navigation"></nav>').find('li').addClass('page-item').find('a').addClass('page-link');
	$('.pagination li').addClass('page-item');

	initModals();	
	triggerMenu(3, 0);

	let keyword = getParameterByName('Keyword');
	if (keyword !== null) {
		$('#txtKeyword').val(keyword);
	}
	$('#txtKeyword').trigger("focus");
});