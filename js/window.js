function connect(e) {
  $(".nav li").removeClass('active');
  console.log('Connect clicked!');
}

function sweep(e) {
  $(".nav li").removeClass('active');
  console.log('Sweep clicked!');
}

function save(e) {
  $(".nav li").removeClass('active');
  console.log('Save clicked!');
}

addEventListener('DOMContentLoaded', function () {
  document.querySelector('#connect').addEventListener('click', connect);
  document.querySelector('#sweep').addEventListener('click', sweep);
  document.querySelector('#save').addEventListener('click', save);
});
