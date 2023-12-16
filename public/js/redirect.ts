const redirect = function () {
  setTimeout(() => {
    window.location.href = `${window.location.origin}/login`;
  }, 3000);
};

redirect();
