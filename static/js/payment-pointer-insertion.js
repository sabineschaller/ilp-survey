(function () {
    'use strict';

    window.addEventListener('load', function () {

        document.getElementById('pp').value = sessionStorage.getItem('pointer');
        sessionStorage.removeItem('pointer')
        
    });
})();