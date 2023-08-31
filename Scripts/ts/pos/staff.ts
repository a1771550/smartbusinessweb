$infoblk = $('#infoblk');

$(document).on('click', '.detail', function () {
	let staffId = $(this).data('id');
	$.ajax({
		type: "GET",
		url: '/Staff/Detail',
		data: { staffId: staffId },
		success: function (data) {
			console.log('data:', data);
			let html = staffdetail(data);
			$.fancyConfirm({
				title: '',
				message: html,
				shownobtn: false,
				okButton: oktxt,
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

//function staffdetail(data: ISysUser) {
//	let _statustxt = data.IsActive == 1 ? activetxt : inactivetxt;
	
//	let html = '<h3>' + staffdetailtxt + '</h3>' + '<ul class="list-group list-group-flush">';
//	html += '<li class="list-group-item"><strong>' + statustxt + '</strong>: ' + _statustxt + '</li>';	
//	html += '<li class="list-group-item"><strong>' + nametxt + '</strong>: ' + data.UserName + '</li>';
//	html += '<li class="list-group-item"><strong>' + devicetxt + '</strong>: ' + data.dvcCode + '</li>';
//	html += '<li class="list-group-item"><strong>' + shoptxt + '</strong>: ' + data.shopCode + '</li>';
//	html += '<li class="list-group-item"><strong>' + managertxt + '</strong>: ' + data.ManagerName + '</li>';
//	if (data.CustomerList.length > 0) {
//		html += '<li class="list-group-item"><strong>' + customerlisttxt + '</strong>';
//		html += '<table class="table table-bordered"><thead><tr><th>' + nametxt + '</th><th>' + phonetxt + '</th></tr></thead><tbody>';
//		$.each(data.CustomerList, function (i, e) {
//		html += '<tr><td>' + e.cusName + '</td><td>' + e.cusPhone + '</td></tr>';
//		});		
//		html += '</tbody></table></li>';
//	}

//	//console.log('dicstaffaccount:', dicISysUserAccount);
//	//let cosaccountno: string = data.ExpenseAccountID > 0 ? dicISysUserAccount[data.ExpenseAccountID.toString()] : 'N/A';
//	//html += '<li class="list-group-item"><strong>' + cosaccounttxt + '</strong>: ' + cosaccountno + '</li>';
//	//let incomeaccountno: string = data.IncomeAccountID > 0 ? dicISysUserAccount[data.IncomeAccountID.toString()] : 'N/A';
//	//html += '<li class="list-group-item"><strong>' + incomeaccount4tstxt + '</strong>: ' + incomeaccountno + '</li>';
//	//let stockaccountno: string = data.InventoryAccountID > 0 ? dicISysUserAccount[data.InventoryAccountID.toString()] : 'N/A';
//	//html += '<li class="list-group-item"><strong>' + assetaccount4inventorytxt + '</strong>: ' + stockaccountno + '</li>';
//	//html += '<li class="list-group-item"><strong>' + collecttaxtxt + '</strong>: ' + _collecttaxtxt + '</li>';
//	//html += '<li class="list-group-item"><strong>' + createtimetxt + '</strong>: ' + data.CreateTimeDisplay + '</li>';
//	//html += '<li class="list-group-item"><strong>' + modifytimetxt + '</strong>: ' + data.ModifyTimeDisplay + '</li>';

//	html += '</ul>';
//	//console.log('html:' + html);
//	return html;
//}

$(document).on('change', '#txtKeyword', function () {
	keyword = <string>$(this).val();
	if (keyword !== '') {
		openWaitingModal();
		let $sortcol = $('<input>').attr({ type: 'hidden', name: 'Keyword', value: keyword.trim() });
		$('#frmStaff').append($sortcol).submit();
	}
});

$(document).on('click', '#btnSearch', function () {
	$('#txtKeyword').trigger('change');
});

$(document).ready(function () {
	console.log('sortorder:' + $('#sortorder').val() + ';sortcol:' + $('#sortcol').val());
	$target = $('.colheader').eq(parseInt(<string>$('#sortcol').val()));
	let sortcls = $('#sortorder').val() === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down';
	$target.addClass(sortcls);

	initModals();
	$('#txtKeyword').focus();

	$target = $('.pagination');
	$target.wrap('<nav aria-label="Page navigation"></nav>').find('li').addClass('page-item').find('a').addClass('page-link');

	let keyword = getParameterByName('Keyword');
	if (keyword !== null) {
		$('#txtKeyword').val(keyword);
	}
});

$(document).on('click', '.colheader', function () {
	let $sortcol = $('<input>').attr({ type: 'hidden', name: 'SortCol', value: $(this).data('col') });
	let $keyword = $('<input>').attr({ type: 'hidden', name: 'Keyword', value: $(this).data('keyword') });
	$('#frmStaff').append($sortcol).append($keyword).submit();
});

$(document).on('click', '.remove', function () {
	let staffId = $(this).data('id');
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
					url: '/Salesmen/Delete',
					data: { staffId: staffId, '__RequestVerificationToken': token },
					success: function () {
						window.location.reload();
					},
					dataType: 'json'
				});
			}
		}
	});
});

$(document).on('click', '#btnReload', function () {
	window.location.href = '/Salesmen/Index';
});
