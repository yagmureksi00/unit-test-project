// app.test.js
const { validateRegistration } = require('../app');

// --- SETUP & TEARDOWN (Ödev Gereksinimi) ---
beforeAll(() => {
    console.log("Sistem Testleri Başlatılıyor... Veritabanı bağlantısı simüle edildi.");
});

afterAll(() => {
    console.log("Testler Tamamlandı. Simülasyon ortamı temizlendi.");
});

describe("Yeni Hesap Oluşturma - Birim Testleri (15 Senaryo)", () => {

    // 1. Equivalence Partitioning (Geçerli Sınıf)
    test("1. Tüm veriler kurallara uygun girildiğinde başarılı olmalıdır", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "tony@stark.com", dob: "1970-05-29", password: "Password123!", confirmPassword: "Password123!" };
        expect(validateRegistration(data).isValid).toBe(true);
    });

    // 2. Boundary Value Analysis (Sınır Değer - Geçerli)
    test("2. İsim tam 30 karakter olduğunda kabul edilmelidir", () => {
        const data = { firstName: "A".repeat(30), lastName: "Stark", email: "test@test.com", dob: "2000-01-01", password: "Password123!", confirmPassword: "Password123!" };
        expect(validateRegistration(data).isValid).toBe(true);
    });

    // 3. Boundary Value Analysis (Sınır Değer - Geçersiz)
    test("3. İsim 31 karakter olduğunda hata vermelidir", () => {
        const data = { firstName: "A".repeat(31), lastName: "Stark", email: "test@test.com", dob: "2000-01-01", password: "Password123!", confirmPassword: "Password123!" };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain("İsim 30 karakterden uzun olamaz.");
    });

    // 4. Boundary Value Analysis (Sınır Değer - Geçerli)
    test("4. Soyisim tam 30 karakter olduğunda kabul edilmelidir", () => {
        const data = { firstName: "Tony", lastName: "B".repeat(30), email: "test@test.com", dob: "2000-01-01", password: "Password123!", confirmPassword: "Password123!" };
        expect(validateRegistration(data).isValid).toBe(true);
    });

    // 5. Boundary Value Analysis (Sınır Değer - Geçersiz)
    test("5. Soyisim 31 karakter olduğunda hata vermelidir", () => {
        const data = { firstName: "Tony", lastName: "B".repeat(31), email: "test@test.com", dob: "2000-01-01", password: "Password123!", confirmPassword: "Password123!" };
        expect(validateRegistration(data).isValid).toBe(false);
    });

    // 6. Boundary Value Analysis (Sınır Değer - Tam 16 Yaş)
    test("6. Kullanıcı tam 16 yaşında olduğunda kabul edilmelidir", () => {
        const sixteenYearsAgo = new Date();
        sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() - 16);
        const data = { firstName: "Peter", lastName: "Parker", email: "spider@man.com", dob: sixteenYearsAgo.toISOString().split('T')[0], password: "Password123!", confirmPassword: "Password123!" };
        expect(validateRegistration(data).isValid).toBe(true);
    });

    // 7. Boundary Value Analysis (Sınır Değer - 15 Yaş)
    test("7. Kullanıcı 16 yaşından bir gün bile küçükse hata vermelidir", () => {
        const fifteenYearsAgo = new Date();
        fifteenYearsAgo.setFullYear(fifteenYearsAgo.getFullYear() - 15);
        const data = { firstName: "Peter", lastName: "Parker", email: "spider@man.com", dob: fifteenYearsAgo.toISOString().split('T')[0], password: "Password123!", confirmPassword: "Password123!" };
        expect(validateRegistration(data).isValid).toBe(false);
        expect(result.errors = ["Sisteme kayıt olmak için en az 16 yaşında olmalısınız."]);
    });

    // 8. Boundary Value Analysis (Sınır Değer - Geçerli Şifre Uzunluğu)
    test("8. Şifre tam 8 karakter olduğunda kabul edilmelidir", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "test@test.com", dob: "2000-01-01", password: "Passw12!", confirmPassword: "Passw12!" };
        expect(validateRegistration(data).isValid).toBe(true);
    });

    // 9. Boundary Value Analysis (Sınır Değer - Geçersiz Şifre Uzunluğu)
    test("9. Şifre 7 karakter olduğunda hata vermelidir", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "test@test.com", dob: "2000-01-01", password: "Pass12!", confirmPassword: "Pass12!" };
        expect(validateRegistration(data).isValid).toBe(false);
    });

    // 10. Equivalence Partitioning (Geçersiz Sınıf - Büyük Harf Yok)
    test("10. Şifrede büyük harf olmadığında hata vermelidir", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "test@test.com", dob: "2000-01-01", password: "password123!", confirmPassword: "password123!" };
        expect(validateRegistration(data).isValid).toBe(false);
    });

    // 11. Equivalence Partitioning (Geçersiz Sınıf - Özel Karakter Yok)
    test("11. Şifrede özel karakter olmadığında hata vermelidir", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "test@test.com", dob: "2000-01-01", password: "Password123", confirmPassword: "Password123" };
        expect(validateRegistration(data).isValid).toBe(false);
    });

    // 12. Equivalence Partitioning (Geçersiz Sınıf - Şifre Uyuşmazlığı)
    test("12. Şifreler birbiriyle eşleşmediğinde hata vermelidir", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "test@test.com", dob: "2000-01-01", password: "Password123!", confirmPassword: "BaskaSifre1!" };
        expect(validateRegistration(data).isValid).toBe(false);
    });

    // 13. Equivalence Partitioning (Geçersiz Sınıf - Hatalı E-posta Formatı 1)
    test("13. E-posta adresinde '@' işareti olmadığında hata vermelidir", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "testtest.com", dob: "2000-01-01", password: "Password123!", confirmPassword: "Password123!" };
        expect(validateRegistration(data).isValid).toBe(false);
    });

    // 14. Equivalence Partitioning (Geçersiz Sınıf - Hatalı E-posta Formatı 2)
    test("14. E-posta adresinde uzantı (.com vb.) olmadığında hata vermelidir", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "test@test", dob: "2000-01-01", password: "Password123!", confirmPassword: "Password123!" };
        expect(validateRegistration(data).isValid).toBe(false);
    });

    // 15. Negatif Test (Çoklu Hata Durumu)
    test("15. Birden fazla kural aynı anda ihlal edildiğinde tüm hataları yakalamalıdır", () => {
        const data = { firstName: "A".repeat(35), lastName: "Stark", email: "test", dob: "2020-01-01", password: "123", confirmPassword: "321" };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(2); // İsim, yaş, email, şifre uzunluğu, eşleşme... bir sürü hata dönmeli.
    });
});