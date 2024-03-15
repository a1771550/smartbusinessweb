$infoblk = $("#infoblk");


$(function () {    
    setFullPage();
    triggerMenu(2, 0);
    $("h2").addClass("text-center");
    EditItem = $infoblk.data("edititem") == "True";
    codelist = $infoblk.data("codelist").split(",");
    //console.log("codelist:", codelist);
    supcodelist = $infoblk.data("supcodelist").split(",");

    itemEditPageLoad();
});
