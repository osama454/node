document.getElementById("row1").addEventListener("mouseover", function () {
  this.style.animationPlayState = "paused"; // Pauses scrolling on hover
});
document.getElementById("row1").addEventListener("mouseout", function () {
  this.style.animationPlayState = "running"; // Resumes scrolling when not hovered
});
document.getElementById("row2").addEventListener("mouseover", function () {
  this.style.animationPlayState = "paused"; // Pauses scrolling on hover
});
document.getElementById("row2").addEventListener("mouseout", function () {
  this.style.animationPlayState = "running"; // Resumes scrolling when not hovered
});
