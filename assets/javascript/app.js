// Initialize Firebase
var config = {
  apiKey: "AIzaSyCgAWPuwUw7EMTiZhCSzc0GZxD8FBD2Om4",
  authDomain: "test-16342.firebaseapp.com",
  databaseURL: "https://test-16342.firebaseio.com",
  projectId: "test-16342",
  storageBucket: "",
  messagingSenderId: "898314074429"
};

firebase.initializeApp(config);

var database = firebase.database();

// Button for adding trucks
$("#add-truck-btn").on("click", function(event) {
  event.preventDefault();

  // Validate form input on submit
  var errors = false;

  $(".errors").remove();

  if ($("#truck-name-input").val() === "") {
    $("#truck-name-input").after(
      "<span class='errors'> Please enter or verify the Truck Name. </span> "
    );
    errors = true;
  }

  if ($("#destination-input").val() === "") {
    $("#destination-input").after(
      "<span class='errors'> Please enter or verify the Destination. </span>"
    );
    errors = true;
  }

  if (
    $("#first-truck-input").val() === "" ||
    $.type($("#first-truck-input").val()) === "string"
  ) {
    $("#first-truck-input").after(
      "<span class='errors'> Please enter or verify the time for First Truck. </span>"
    );
    errors = true;
  }

  if (
    $("#frequency-input").val() === ""
  ) {
    $("#frequency-input").after(
      "<span class='errors'> Please enter or verify the amount for Frequency. </span>"
    );
    errors = true;
  }

  if (errors === true) {
    return false;
  } else {
    
    // Grab user inputs
    var truckName = $("#truck-name-input")
      .val()
      .trim();
    var truckDestination = $("#destination-input")
      .val()
      .trim();
    var truckFirst = $("#first-truck-input")
      .val()
      .trim();
    var truckFrequency = $("#frequency-input")
      .val()
      .trim();

    // Create local temporary object for holding train data
    var newTruck = {
      name: truckName,
      destination: truckDestination,
      first: truckFirst,
      frequency: truckFrequency
    };

    // Push truck data to the database
    database.ref().push(newTruck);

    // Clear all of the text boxes
    $(
      "#truck-name-input, #destination-input, #first-truck-input, #frequency-input"
    ).val("");
  }
});

// Create Firebase event for adding truck to the database
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable
  var truckName = childSnapshot.val().name;
  var truckDestination = childSnapshot.val().destination;
  var truckFirst = childSnapshot.val().first;
  var truckFrequency = childSnapshot.val().frequency;

  // First Time
  var firstTimeConverted = moment(truckFirst, "HH:mm").subtract(1, "years");

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  // Time apart
  var remainder = diffTime % truckFrequency;

  // Minute Until Truck
  var minutesTillTruck = truckFrequency - remainder;

  // Next Truck
  var nextTruck = moment().add(minutesTillTruck, "minutes");
  var arrival = moment(nextTruck).format("hh:mm A");

  // Create the new row and add it to the table
  $("#truck-table > tbody").append(
    "<tr><td>" +
      truckName +
      "</td><td>" +
      truckDestination +
      "</td><td>" +
      truckFrequency +
      " Min </td><td>" +
      arrival +
      "</td><td>" +
      minutesTillTruck +
      "</td></tr>"
  );
});
