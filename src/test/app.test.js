// app.test.js
const { validateRegistration } = require('../app');

// --- SETUP & TEARDOWN ---
beforeAll(() => {
    console.log("System Tests Initiating... Database connection simulated.");
});

afterAll(() => {
    console.log("Tests Completed. Simulation environment cleared.");
});

describe("New Account Registration - Unit Tests (15 Scenarios)", () => {

    // 1. Equivalence Partitioning (Valid Class)
    test("1. Should succeed when all data is valid", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "tony@stark.com", dob: "1970-05-29", password: "Password123!", confirmPassword: "Password123!" };
        expect(validateRegistration(data).isValid).toBe(true);
    });

    // 2. Boundary Value Analysis (Valid Boundary)
    test("2. Should accept exactly 30 characters for First Name", () => {
        const data = { firstName: "A".repeat(30), lastName: "Stark", email: "test@test.com", dob: "2000-01-01", password: "Password123!", confirmPassword: "Password123!" };
        expect(validateRegistration(data).isValid).toBe(true);
    });

    // 3. Boundary Value Analysis (Invalid Boundary)
    test("3. Should fail when First Name is 31 characters", () => {
        const data = { firstName: "A".repeat(31), lastName: "Stark", email: "test@test.com", dob: "2000-01-01", password: "Password123!", confirmPassword: "Password123!" };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain("Name cannot exceed 30 characters.");
    });

    // 4. Boundary Value Analysis (Valid Boundary)
    test("4. Should accept exactly 30 characters for Last Name", () => {
        const data = { firstName: "Tony", lastName: "B".repeat(30), email: "test@test.com", dob: "2000-01-01", password: "Password123!", confirmPassword: "Password123!" };
        expect(validateRegistration(data).isValid).toBe(true);
    });

    // 5. Boundary Value Analysis (Invalid Boundary)
    test("5. Should fail when Last Name is 31 characters", () => {
        const data = { firstName: "Tony", lastName: "B".repeat(31), email: "test@test.com", dob: "2000-01-01", password: "Password123!", confirmPassword: "Password123!" };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain("Surname cannot exceed 30 characters.");
    });

    // 6. Boundary Value Analysis (Valid - Exact 16 Years)
    test("6. Should accept when user is exactly 16 years old", () => {
        const sixteenYearsAgo = new Date();
        sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() - 16);
        const data = { firstName: "Peter", lastName: "Parker", email: "spider@man.com", dob: sixteenYearsAgo.toISOString().split('T')[0], password: "Password123!", confirmPassword: "Password123!" };
        expect(validateRegistration(data).isValid).toBe(true);
    });

   // 7. Boundary Value Analysis (Sınır Değer - 15 Yaş)
   test("7. If the user is even one day younger than 16, an error should be displayed", () => {
    const fifteenYearsAgo = new Date();
    fifteenYearsAgo.setFullYear(fifteenYearsAgo.getFullYear() - 15);
    const data = { firstName: "Peter", lastName: "Parker", email: "spider@man.com", dob: fifteenYearsAgo.toISOString().split('T')[0], password: "Password123!", confirmPassword: "Password123!" };
    
    // EKSİK OLAN SATIR EKLENDİ
    const result = validateRegistration(data); 
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("You must be at least 16 years old to register for the system."); 
});
    // 8. Boundary Value Analysis (Valid Password Length)
    test("8. Should accept password with exactly 8 characters", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "test@test.com", dob: "2000-01-01", password: "Passw12!", confirmPassword: "Passw12!" };
        expect(validateRegistration(data).isValid).toBe(true);
    });

    // 9. Boundary Value Analysis (Invalid Password Length)
    test("9. Should fail when password is 7 characters", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "test@test.com", dob: "2000-01-01", password: "Pass12!", confirmPassword: "Pass12!" };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain("The password must be at least 8 characters long.");
    });

    // 10. Equivalence Partitioning (Invalid - No Uppercase)
    test("10. Should fail when password has no uppercase letter", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "test@test.com", dob: "2000-01-01", password: "password123!", confirmPassword: "password123!" };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain("The password must contain at least one uppercase letter.");
    });

    // 11. Equivalence Partitioning (Invalid - No Special Character)
    test("11. Should fail when password has no special character", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "test@test.com", dob: "2000-01-01", password: "Password123", confirmPassword: "Password123" };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain("The password must contain at least one special character.");
    });

    // 12. Equivalence Partitioning (Invalid - Password Mismatch)
    test("12. Should fail when passwords do not match", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "test@test.com", dob: "2000-01-01", password: "Password123!", confirmPassword: "Different123!" };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain("The passwords you entered do not match.");
    });

    // 13. Equivalence Partitioning (Invalid Email - No '@')
    test("13. Should fail when email does not contain '@'", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "testtest.com", dob: "2000-01-01", password: "Password123!", confirmPassword: "Password123!" };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain("Please enter a valid email address.");
    });

    // 14. Equivalence Partitioning (Invalid Email - No Domain)
    test("14. Should fail when email has no domain extension", () => {
        const data = { firstName: "Tony", lastName: "Stark", email: "test@test", dob: "2000-01-01", password: "Password123!", confirmPassword: "Password123!" };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain("Please enter a valid email address.");
    });

    // 15. Negative Test (Multiple Errors)
    test("15. Should capture multiple errors when several rules are violated", () => {
        const data = { firstName: "A".repeat(35), lastName: "Stark", email: "test", dob: "2020-01-01", password: "123", confirmPassword: "321" };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(2); 
    });
});