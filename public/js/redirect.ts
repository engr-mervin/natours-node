const redirect = function () {
  setTimeout(() => {
    window.location.href = 'http://localhost:3000/login';
  }, 3000);
};

redirect();
alert('hi');
