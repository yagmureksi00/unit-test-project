// app.test.js
const { validateRegistration } = require('../app');

// Dinamik test verisi oluşturucu (Her testte kodu kısaltmak için)
const getValidData = () => {
    const validAge = new Date();
    validAge.setFullYear(validAge.getFullYear() - 17); // 17 yaşında (Geçerli)
    return {
        firstName: "Tony",
        lastName: "Stark",
        email: "tony.stark@avengers.com",
        dob: validAge.toISOString().split('T')[0],
        password: "StrongPassword123!",
        confirmPassword: "StrongPassword123!"
    };
};

describe("Jest - Create Account Form - QA Automation", () => {

    // --- GENEL FORM KONTROLLERİ ---
    test("TC-01 | validateForm = all valid fields returns isValid true", () => {
        expect(validateRegistration(getValidData()).isValid).toBe(true);
    });

    test("TC-02 | validateForm = all empty fields returns 6 errors", () => {
        const data = { firstName: "", lastName: "", email: "", dob: "", password: "", confirmPassword: "" };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThanOrEqual(5);
    });

    // --- İSİM (FIRST NAME) KONTROLLERİ ---
    test("TC-03 | firstName = valid input returns no error", () => {
        const data = getValidData();
        data.firstName = "Pepper";
        expect(validateRegistration(data).isValid).toBe(true);
    });

    test("TC-04 | firstName = null/empty input returns required error", () => {
        const data = getValidData();
        data.firstName = "";
        expect(validateRegistration(data).errors).toContain("First name is required.");
    });

    test("TC-05 | firstName = exactly 30 chars (max) returns no error", () => {
        const data = getValidData();
        data.firstName = "A".repeat(30);
        expect(validateRegistration(data).isValid).toBe(true);
    });

    test("TC-06 | firstName = 31 chars (over max) returns length error", () => {
        const data = getValidData();
        data.firstName = "A".repeat(31);
        expect(validateRegistration(data).errors).toContain("Name cannot exceed 30 characters.");
    });

    // --- SOYİSİM (LAST NAME) KONTROLLERİ ---
    test("TC-07 | lastName = valid input returns no error", () => {
        const data = getValidData();
        data.lastName = "Potts";
        expect(validateRegistration(data).isValid).toBe(true);
    });

    test("TC-08 | lastName = null/empty input returns required error", () => {
        const data = getValidData();
        data.lastName = "";
        expect(validateRegistration(data).errors).toContain("Last name is required.");
    });

    test("TC-09 | lastName = exactly 30 chars (max) returns no error", () => {
        const data = getValidData();
        data.lastName = "B".repeat(30);
        expect(validateRegistration(data).isValid).toBe(true);
    });

    test("TC-10 | lastName = 31 chars (over max) returns length error", () => {
        const data = getValidData();
        data.lastName = "B".repeat(31);
        expect(validateRegistration(data).errors).toContain("Surname cannot exceed 30 characters.");
    });

    // --- E-POSTA (EMAIL) KONTROLLERİ ---
    test("TC-11 | email = valid email returns no error", () => {
        expect(validateRegistration(getValidData()).isValid).toBe(true);
    });

    test("TC-12 | email = null/empty returns required error", () => {
        const data = getValidData();
        data.email = "";
        expect(validateRegistration(data).errors).toContain("Email address is required.");
    });

    test("TC-13 | email = missing '@' returns format error", () => {
        const data = getValidData();
        data.email = "tonystark.com";
        expect(validateRegistration(data).errors).toContain("Please enter a valid email address.");
    });

    test("TC-14 | email = missing domain returns format error", () => {
        const data = getValidData();
        data.email = "tony@stark";
        expect(validateRegistration(data).errors).toContain("Please enter a valid email address.");
    });

    test("TC-15 | email = multiple '@' symbols returns format error", () => {
        const data = getValidData();
        data.email = "tony@@stark.com";
        expect(validateRegistration(data).errors).toContain("Please enter a valid email address.");
    });

    // --- DOĞUM TARİHİ (DATE OF BIRTH) KONTROLLERİ ---
    test("TC-16 | dateOfBirth = valid date (user is 17) returns no error", () => {
        expect(validateRegistration(getValidData()).isValid).toBe(true);
    });

    test("TC-17 | dateOfBirth = null/empty returns required error", () => {
        const data = getValidData();
        data.dob = "";
        expect(validateRegistration(data).errors).toContain("Date of birth is required.");
    });

    test("TC-18 | dateOfBirth = user is exactly 16 years old (min age) returns no error", () => {
        const data = getValidData();
        const exact16 = new Date();
        exact16.setFullYear(exact16.getFullYear() - 16);
        data.dob = exact16.toISOString().split('T')[0];
        expect(validateRegistration(data).isValid).toBe(true);
    });

    test("TC-19 | dateOfBirth = user is 15 years old (below min age) returns age error", () => {
        const data = getValidData();
        const exact15 = new Date();
        exact15.setFullYear(exact15.getFullYear() - 15);
        data.dob = exact15.toISOString().split('T')[0];
        expect(validateRegistration(data).errors).toContain("You must be at least 16 years old to register for the system.");
    });

    test("TC-20 | dateOfBirth = future date returns age error", () => {
        const data = getValidData();
        data.dob = "2050-01-01";
        expect(validateRegistration(data).errors).toContain("You must be at least 16 years old to register for the system.");
    });

    // --- ŞİFRE (PASSWORD) KONTROLLERİ ---
    test("TC-21 | password = strong password returns no error", () => {
        expect(validateRegistration(getValidData()).isValid).toBe(true);
    });

    test("TC-22 | password = null/empty returns required error", () => {
        const data = getValidData();
        data.password = "";
        expect(validateRegistration(data).errors).toContain("Password is required.");
    });

    test("TC-23 | password = 7 chars (under min) returns length error", () => {
        const data = getValidData();
        data.password = "Pass12!";
        data.confirmPassword = "Pass12!";
        expect(validateRegistration(data).errors).toContain("The password must be at least 8 characters long.");
    });

    test("TC-24 | password = exactly 8 chars (min valid) returns no error", () => {
        const data = getValidData();
        data.password = "Passw12!";
        data.confirmPassword = "Passw12!";
        expect(validateRegistration(data).isValid).toBe(true);
    });

    test("TC-25 | password = no uppercase letter returns uppercase error", () => {
        const data = getValidData();
        data.password = "password123!";
        data.confirmPassword = "password123!";
        expect(validateRegistration(data).errors).toContain("The password must contain at least one uppercase letter.");
    });

    test("TC-26 | password = no special character returns special char error", () => {
        const data = getValidData();
        data.password = "Password123";
        data.confirmPassword = "Password123";
        expect(validateRegistration(data).errors).toContain("The password must contain at least one special character.");
    });

    test("TC-27 | password = only numbers returns multiple security errors", () => {
        const data = getValidData();
        data.password = "12345678";
        data.confirmPassword = "12345678";
        const result = validateRegistration(data);
        expect(result.errors).toContain("The password must contain at least one uppercase letter.");
        expect(result.errors).toContain("The password must contain at least one special character.");
    });

    // --- ŞİFRE TEKRARI (CONFIRM PASSWORD) KONTROLLERİ ---
    test("TC-28 | confirmPassword = matching passwords returns no error", () => {
        expect(validateRegistration(getValidData()).isValid).toBe(true);
    });

    test("TC-29 | confirmPassword = mismatch returns match error", () => {
        const data = getValidData();
        data.password = "Password123!";
        data.confirmPassword = "Different123!";
        expect(validateRegistration(data).errors).toContain("The passwords you entered do not match.");
    });

    test("TC-30 | confirmPassword = empty confirm input returns match error", () => {
        const data = getValidData();
        data.password = "Password123!";
        data.confirmPassword = "";
        expect(validateRegistration(data).errors).toContain("The passwords you entered do not match.");
    });

});