const form = document.getElementById('registerForm');
        const pwd = document.getElementById('pwd');;
        const val = document.getElementById('pwdVal');
        const name = document.getElementById('nombre-form');
        const email = document.getElementById('email-form');
        const lastName = document.getElementById('apellido-form');
        const phone = document.getElementById('phone-form')
        const pwdHelp = document.getElementById('pwdhelper');
        const nameHelp = document.getElementById('nameHelper');
        const emailHelp = document.getElementById('emailHelper');
        const lastNameHelp = document.getElementById('lastNameHelper');
        const phoneHelp = document.getElementById('phoneHelper')


        form.addEventListener('submit', (e) => {
            name.classList.remove('is-valid', 'is-invalid');
            email.classList.remove('is-valid', 'is-invalid');
            if (!name.value) {
                e.preventDefault();
                e.stopPropagation();
                name.classList.add('is-invalid')
                nameHelp.style.display = ''
            }
            if (!phone.value) {
                e.preventDefault();
                e.stopPropagation();
                phone.classList.add('is-invalid')
                phoneHelp.style.display = ''
            }
            if (!lastName.value) {
                e.preventDefault();
                e.stopPropagation();
                lastName.classList.add('is-invalid')
                lastNameHelp.style.display = ''
            }
            if (!email.value) {
                e.preventDefault();
                e.stopPropagation();
                email.classList.add('is-invalid')
                emailHelp.style.display = ''
            }

         

            const ok =
                val.value.length >= 4 &&
                val.value.length <= 15 &&
                pwd.value === val.value;
            val.classList.remove('is-valid', 'is-invalid');
            if (ok) {
                val.classList.add('is-valid');
                pwdHelp.style.display = 'none'
            } else {
                e.preventDefault();
                e.stopPropagation();
                val.classList.add('is-invalid');
                pwdHelp.style.display = '';
            }
        });