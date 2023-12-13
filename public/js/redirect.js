"use strict";
const redirect = function () {
    setTimeout(() => {
        window.location.href = `${process.env.DEV_URL}/login`;
    }, 3000);
};
redirect();
