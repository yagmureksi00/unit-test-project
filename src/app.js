// app.js

function validateRegistration(data) {
    const { firstName, lastName, email, dob, password, confirmPassword } = data;
    let errors = [];

    // Email Check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) errors.push("Please enter a valid email address.");

    // First and Last Name Checks
    if (firstName.length > 30) errors.push("Name cannot exceed 30 characters.");
    if (lastName.length > 30) errors.push("Surname cannot exceed 30 characters.");

    // Age Check
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 16) errors.push("You must be at least 16 years old to register for the system.");

    // Password Checks
    if (password.length < 8) errors.push("The password must be at least 8 characters long.");
    if (!/[A-Z]/.test(password)) errors.push("The password must contain at least one uppercase letter.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("The password must contain at least one special character.");
    if (password !== confirmPassword) errors.push("The passwords you entered do not match.");

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// 2. ARAYÜZ BAĞLANTISI: Sadece tarayıcıda çalışacak kısım
if (typeof window !== 'undefined') {
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Verileri toplayıp üstteki fonksiyona gönderiyoruz
        const userData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            dob: document.getElementById('dob').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value
        };

        const result = validateRegistration(userData);
        const messageBox = document.getElementById('messageBox');
        messageBox.innerHTML = "";

        if (!result.isValid) {
            result.errors.forEach(error => {
                messageBox.innerHTML += `<p class="error-text">• ${error}</p>`;
            });
        } else {
            messageBox.innerHTML = `<p class="success-text">Kayıt işleminiz başarıyla tamamlandı!</p>`;
            document.getElementById('registerForm').reset();
        }
    });
}

// 3. DIŞA AKTARMA: Test aracının (Node.js/Jest) bu dosyayı okuyabilmesi için
if (typeof module !== 'undefined') {
    module.exports = { validateRegistration };
}