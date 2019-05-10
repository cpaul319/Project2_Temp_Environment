$(document).ready(function() {
  /* global moment */

  // blogContainer holds all of our confessions
  var blogContainer = $(".blog-container");
  var confessionCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleConfessionDelete);
  $(document).on("click", "button.edit", handleConfessionEdit);
  // Variable to hold our confessions
  var confessions;

  // The code below handles the case where we want to get blog confessions for a specific user
  // Looks for a query param in the url for user_id
  var url = window.location.search;
  var userId;
  if (url.indexOf("?user_id=") !== -1) {
    userId = url.split("=")[1];
    getConfessions(userId);
  }
  // If there's no userId we just get all confessions as usual
  else {
    getConfessions();
  }


  // This function grabs confessions from the database and updates the view
  function getConfessions(user) {
    userId = user || "";
    if (userId) {
      userId = "/?user_id=" + userId;
    }
    $.get("api/confessions" + userId, function(data) {
      console.log("Confessions", data);
      confessions = data;
      if (!confessions || !confessions.length) {
        displayEmpty(user);
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete confessions
  function deleteConfession(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/confessions/" + id
    })
      .then(function() {
        getConfessions(confessionCategorySelect.val());
      });
  }

  // InitializeRows handles appending all of our constructed confession HTML inside blogContainer
  function initializeRows() {
    blogContainer.empty();
    var confessionsToAdd = [];
    for (var i = 0; i < confessions.length; i++) {
      confessionsToAdd.push(createNewRow(confessions[i]));
    }
    blogContainer.append(confessionsToAdd);
  }

  // This function constructs a confession's HTML
  function createNewRow(confession) {
    var formattedDate = new Date(confession.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newConfessionCard = $("<div>");
    newConfessionCard.addClass("card");
    var newConfessionCardHeading = $("<div>");
    newConfessionCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newConfessionTitle = $("<h2>");
    var newConfessionDate = $("<small>");
    var newConfessionUser = $("<h5>");
    newConfessionUser.text("Written by: " + confession.User.firstname);
    newConfessionUser.css({
      float: "right",
      color: "blue",
      "margin-top":
      "-10px"
    });
    var newConfessionCardBody = $("<div>");
    newConfessionCardBody.addClass("card-body");
    var newConfessionBody = $("<p>");
    newConfessionTitle.text(confession.title + " ");
    newConfessionBody.text(confession.body);
    newConfessionDate.text(formattedDate);
    newConfessionTitle.append(newConfessionDate);
    newConfessionCardHeading.append(deleteBtn);
    newConfessionCardHeading.append(editBtn);
    newConfessionCardHeading.append(newConfessionTitle);
    newConfessionCardHeading.append(newConfessionUser);
    newConfessionCardBody.append(newConfessionBody);
    newConfessionCard.append(newConfessionCardHeading);
    newConfessionCard.append(newConfessionCardBody);
    newConfessionCard.data("confession", confession);
    return newConfessionCard;
  }

  // This function figures out which confession we want to delete and then calls deleteConfession
  function handleConfessionDelete() {
    var currentConfession = $(this)
      .parent()
      .parent()
      .data("confession");
    deleteConfession(currentConfession.id);
  }

  // This function figures out which confession we want to edit and takes it to the appropriate url
  function handleConfessionEdit() {
    var currentConfession = $(this)
      .parent()
      .parent()
      .data("confession");
    window.location.href = "/cms?confession_id=" + currentConfession.id;
  }

  // This function displays a message when there are no confessions
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for User #" + id;
    }
    blogContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No confessions yet" + partial + ", navigate <a href='/cms" + query +
    "'>here</a> in order to get started.");
    blogContainer.append(messageH2);
  }

});
 