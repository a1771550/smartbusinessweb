$infoblk = $("#infoblk");
phonelist = $infoblk.data("codelist").split(",");
supcodelist = $infoblk.data("supcodelist").split(",");
var current_page = 1;
var records_per_page = 5;

$(function () {
    //console.log("here");
  forPGItem = true;
  EditItem = $infoblk.data("edititem") == "True";
  itemEditPageLoad();
});
