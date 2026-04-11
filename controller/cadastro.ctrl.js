async function doRegister() {
            clearAlerts(); clearErrors();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;

            // Validações
            let valid = true;
            if (!isValidEmail(email)) { showErr('reg-email-err', 'Informe um e-mail válido.'); valid = false; }
            if (password.length < 10) { showErr('reg-password-err', 'Mínimo 10 caracteres.'); valid = false; }
            if (password !== confirm) { showErr('reg-confirm-err', 'As senhas não coincidem.'); valid = false; }
            if (!valid) return;

            // Verifica duplicata
            if (findUser(email)) {
                setAlert('register-alert', 'error', 'Este e-mail já está cadastrado.');
                return;
            }

        }