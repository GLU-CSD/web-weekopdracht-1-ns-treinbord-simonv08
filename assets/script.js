const API_KEY = "9620fb65d8fe487ea3e3239b5e04d615";

window.addEventListener("load", function () {
  var minutesEl = document.getElementById("minutes");

  for (var i = 0; i < 60; i++) {
    var minuteEl = document.createElement("div");
    minuteEl.classList.add("minute");
    minuteEl.style.transform =
      "rotate(" + Math.round((i / 60) * 360) + "deg) translateX(80px)";
    minutesEl.appendChild(minuteEl);
  }

  setInterval(render, 1000);
  setTimeout(function () {
    document.body.classList.add("loaded");
  }, 1);

  render();
});

function render() {
  var now = new Date();

  var sec = now.getSeconds();
  var min = now.getMinutes();
  var hour = now.getHours();

  //now = new Date(2018, 1, 20, 12, 0, 0)
  document.getElementById("hand-sec").style.transform =
    "rotate(" + (hour * 360 + min * 360 + ((sec / 60) * 360 + 180)) + "deg)";
  document.getElementById("hand-min").style.transform =
    "rotate(" + (hour * 360 + ((min / 60) * 360 + 180)) + "deg)";
  document.getElementById("hand-hour").style.transform =
    "rotate(" +
    ((min / 60) * (360 / 12) + ((hour % 12) / 12) * 360 + 180) +
    "deg)";

  /////////////////////////////////////////

  fetch(
    "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=Ut",
    {
      method: "GET",
      // Request headers
      headers: {
        "Cache-Control": "no-cache",
        "Ocp-Apim-Subscription-Key": API_KEY,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Network response was not ok. status: " + response.status
        );
      }
      return response.json();
    })
    .then((data) => {
      data.payload.departures.every((element) => {
        if (element.direction == "Zwolle" && element.trainCategory == "SPR") {
          makeBoard(element);
          return false;
        } else {
          return true;
        }
      });
    })
    .catch((err) => console.error(err));
  function makeBoard(data) {
    destination = data.direction;
    track = data.actualTrack;
    trainType = data.trainCategory;
    viaStations = data.routeStations.map((name) => name.mediumName);
    message = data.messages.map((x) => x.message)[0];

    plannedTime = new Date(data.plannedDateTime);
    plannedTime = new Date(plannedTime);

    actualTime = new Date(data.actualDateTime) - new Date(data.plannedDateTime);
    actualTime = new Date(actualTime);

    plannedHour = plannedTime.getHours();
    plannedMin = plannedTime.getMinutes();

    differenceMin = actualTime.getMinutes();

    // track
    document.getElementById("track-number").innerHTML = track;

    // time
    document.getElementById("departure-time").innerHTML =
      plannedHour + ":" + plannedMin;
    if (differenceMin > 0) {
      document.getElementById("extraTime").innerHTML =
        "+" + parseInt(differenceMin);
    }

    // train type
    document.getElementById("train-type").innerHTML =
      trainType == "SPR" ? "Sprinter" : "Intercity";

    // destination
    document.getElementById("final-destination").innerHTML = destination;

    // via stations
    let via = document.getElementById("between-stops");
    via.innerHTML =
      viaStations.slice(0, -1).join(", ") + ", en " + viaStations.slice(-1);

    // message
    document.getElementById("message").innerHTML = "<p>" + message + "</p>";

    // next
    let nextTime =
      plannedMin == 21 ? plannedHour + ":51" : plannedHour + 1 + ":21";
    document.getElementById("next-train-info").innerHTML =
      "Hierna/next: " + nextTime + " SPR Zwolle";
  }
}
