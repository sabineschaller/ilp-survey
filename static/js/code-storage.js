(function () {
    'use strict';

    window.addEventListener('load', function () {

        const form = document.querySelector('form');
        const input = document.getElementById('pc');

        form.addEventListener('submit', function (event) {
            sessionStorage.setItem('code', input.value);
        }, false);
    });
})();