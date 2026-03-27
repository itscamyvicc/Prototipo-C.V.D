document.addEventListener('DOMContentLoaded', function () {

    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');

    if (cpfInput) {
        cpfInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

            e.target.value = value;
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');

            if (value.length > 14) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            } else {
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }

            e.target.value = value;
        });
    }

});
