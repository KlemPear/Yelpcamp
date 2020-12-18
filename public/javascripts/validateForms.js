(function() {
    'use strict'

    //fecth all the form we want to apply custom validation to
    const forms = document.querySelectorAll('.validated-form');

    //Loop over them and prevent submit
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function(event){
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        });
})()