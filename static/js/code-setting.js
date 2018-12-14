(function () {
    'use strict';

    window.addEventListener('load', function () {

        document.getElementById('pc').value = sessionStorage.getItem('code');
        
    });
})();