$infoblk = $("#infoblk");


$(function () {    
    setFullPage();
    triggerMenu(2, 0);
    $("h2").addClass("text-center");
    EditItem = $infoblk.data("edititem") == "True";
    namelist = $infoblk.data("namelist").split(",");
    codelist = $infoblk.data("codelist").split(",");
    phonelist = $infoblk.data("codelist").split(",");  
    supcodelist = $infoblk.data("supcodelist").split(",");
    itemEditPageLoad();
});
