(function () {
    'use strict';

    window.addEventListener('load', function () {

        let button = document.getElementById('button-questions');
        let inputDiv = document.getElementById('survey-questions');
        let c = 1;

        button.addEventListener('click', function (event) {
            let html = `<p>` + c + `</p>
                        <input type="text"  class="form-control" name="q` + c + `" placeholder="Question" required>
                        <input type="text"  class="form-control" name="o` + c + `" placeholder="Option 1, Option 2, ..." required>
                        <br>`
            inputDiv.insertAdjacentHTML("beforeend", html);
            c ++;            
        }, false);
    });
})();