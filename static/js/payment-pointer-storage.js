(function () {
    'use strict';

    window.addEventListener('load', function () {

        const form = document.querySelector('form');
        const input = document.getElementById('user');

        form.addEventListener('submit', function (event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
                input.value = '';
            } else {
                storePointer('$ilpsurvey.localtunnel.me/' + input.value);
            }
            form.classList.add('was-validated');
        }, false);
    });

    function storePointer(pointer) {
        sessionStorage.setItem('pointer', pointer);
    }
})();