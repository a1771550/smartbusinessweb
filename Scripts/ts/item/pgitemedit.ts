$infoblk = $("#infoblk");
phonelist = $infoblk.data("codelist").split(",");
supcodelist = $infoblk.data("supcodelist").split(",");

$(function () {
    //console.log("here");
  forPGItem = true;
  EditItem = $infoblk.data("edititem") == "True";
  itemEditPageLoad();
});
