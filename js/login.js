async function doLogin() {
            clearAlerts(); clearErrors();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            let valid = true;
            if (!isValidEmail(email)) { showErr('login-email-err', 'E-mail inválido.'); valid = false; }
            if (!password) { showErr('login-password-err', 'Informe a senha.'); valid = false; }
            if (!valid) return;

            setLoading('btn-login', true);
            await fakeAsync(900);

            const user = findUser(email);
            if (!user || user.password !== password) {
                setLoading('btn-login', false);
                setAlert('login-alert', 'error', 'E-mail ou senha incorretos.');
                return;
            }

            setLoading('btn-login', false);
            document.getElementById('welcome-email').textContent = email;
            show('screen-welcome');
        }