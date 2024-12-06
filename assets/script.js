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
}
