$(document).ready(function() {

    var confessionInput = $("#message-text");

    var confessionList = $("tbody");
  var confessionContainer = $("#confession-container");

    $(document).on("click", "#save-confession", handleConfessionFormClick);
    console.log("this button works");



    function handleConfessionFormClick(event) {
        event.preventDefault();
        // Don't do anything if the name fields hasn't been filled out
        if (!confessionInput.val().trim().trim()) {
          return;
        }
        // Calling the upsertconfession function and passing in the value of the name input
        upsertConfession({
          confession: confessionInput
            .val()
            .trim()
        });
        console.log("confessioninput" + confessionInput);
      }
      function upsertConfession(confessionData) {
        $.post("/api/confession", confessionData)
          .then(getConfession);


      }
      function createConfessionRow(confessionData) {
        var newTr = $("<tr>");
        newTr.data("confession", confessionData);
        newTr.append("<td>" + confessionData.name + "</td>");
        if (confessionData.Posts) {
          newTr.append("<td> " + confessionData.Posts.length + "</td>");
        } else {
          newTr.append("<td>0</td>");
        }
        // newTr.append("<td><a href='/blog?confession_id=" + confessionData.id + "'>Go to Posts</a></td>");
        // newTr.append("<td><a href='/cms?confession_id=" + confessionData.id + "'>Create a Post</a></td>");
        // newTr.append("<td><a style='cursor:pointer;color:grey' class='delete-confession'>Delete confession</a></td>");
        return newTr;
      }
      function getConfession() {
        $.get("/api/confession", function(data) {
          var rowsToAdd = [];
          for (var i = 0; i < data.length; i++) {
            rowsToAdd.push(createConfessionRow(data[i]));
          }
          renderConfessionList(rowsToAdd);
          confessionInput.val("");
        });
      }
      function renderConfessionList(rows) {
        confessionList.children().not(":last").remove();
        confessionContainer.children(".alert").remove();
        if (rows.length) {
          console.log(rows);
          confessionList.prepend(rows);
        }
        else {
          renderEmpty();
        }
      }
      function renderEmpty() {
        var alertDiv = $("<div>");
        // alertDiv.addClass("alert alert-danger");
        // alertDiv.text("You must create an Author before you can create a Post.");
        confessionContainer.append(alertDiv);
      }
     
      getConfession();

});