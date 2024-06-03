var isFlipped = false;

function flip() {
  var flipper = document.querySelector('.flipper');
  if (!isFlipped) {
    flipper.style.transform = 'rotateY(180deg)';
    isFlipped = true;
  } else {
    flipper.style.transform = 'rotateY(0deg)';
    isFlipped = false;
  }
}