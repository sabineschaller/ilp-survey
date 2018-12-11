(function () {
    'use strict';

    window.addEventListener('load', function () {

        const a = document.querySelector('a');
        const url = window.location.pathname;
        const id = url.substring(url.lastIndexOf('/') + 1);

        a.addEventListener('click', function (event) {
            sessionStorage.setItem('surveyId', id);
        }, false);
    });
})();