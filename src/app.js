// app.js

// 1. SAF MANTIK: HTML'den bağımsız doğrulama motoru (Test edilecek kısım burası)
function validateRegistration(data) {
    const { firstName, lastName, email, dob, password, confirmPassword } = data;
    let errors = [];

    // E-posta Kontrolü
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) errors.push("Lütfen geçerli bir e-posta adresi giriniz.");

    // İsim ve Soyisim Kontrolü
    if (firstName.length > 30) errors.push("İsim 30 karakterden uzun olamaz.");
    if (lastName.length > 30) errors.push("Soyisim 30 karakterden uzun olamaz.");

    // Yaş Kontrolü
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 16) errors.push("Sisteme kayıt olmak için en az 16 yaşında olmalısınız.");

    // Şifre Kontrolleri
    if (password.length < 8) errors.push("Şifre en az 8 karakter uzunluğunda olmalıdır.");
    if (!/[A-Z]/.test(password)) errors.push("Şifre en az bir büyük harf içermelidir.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("Şifre en az bir özel karakter içermelidir.");
    if (password !== confirmPassword) errors.push("Girdiğiniz şifreler birbiriyle eşleşmiyor.");

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