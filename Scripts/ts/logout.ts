let unauthorized = $("#loginblk").length ? $("#loginblk").data("unauthorized") === 'True' : false;
let enablecheckdayends = $("#loginblk").length ? $("#loginblk").data("enablecheckdayends") === 'True' : false;
$(document).on('click', '#btnLogout', function () {
    if (unauthorized) {
        logout();
    }
    else {
        if (enablecheckdayends) {
            getRemoteData('/Api/CheckIfDayendsDone', {}, checkIfDayendsDoneOk, getRemoteDataFail);
        }
        else {
            logout();
        }
    }
});

function logout() {
    $("#logoutForm").trigger("submit");
}

function checkIfDayendsDoneOk(data) {
    //console.log('checkdayenddata:', data);
    if (data.msg === 'done') {
        $("#logoutForm").trigger("submit");
    }
    else {
        window.location.href = '/POSFunc/Dayends';
    }
}