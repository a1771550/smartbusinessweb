$infoblk = $("#infoblk");


$(function () {
    //setFullPage();
    $("h2").addClass("text-center");
    forPGItem = false;

    EditItem = $infoblk.data("edititem") == "True";
    codelist = $infoblk.data("codelist").split(",");
    //console.log("codelist:", codelist);
    supcodelist = $infoblk.data("supcodelist").split(",");

    itemEditPageLoad();
});
