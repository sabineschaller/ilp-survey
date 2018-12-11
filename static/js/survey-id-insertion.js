(function () {
    'use strict';

    window.addEventListener('load', function () {

        document.getElementById('pp').innerText = sessionStorage.getItem('pointer');

        document.getElementById('survey-id').href = '/survey/' + sessionStorage.getItem('surveyId');
        sessionStorage.removeItem('surveyId')
        
    });
})();