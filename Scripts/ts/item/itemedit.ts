$infoblk = $("#infoblk");


$(function () {    
    setFullPage();
    triggerMenu(2, 0);
    $("h2").addClass("text-center");
    EditItem = $infoblk.data("edititem") == "True";
    CodeNameList = $infoblk.data("codenamelist");  
    supcodelist = $infoblk.data("supcodelist").split(",");
    itemEditPageLoad();
});
