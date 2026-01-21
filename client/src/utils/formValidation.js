// Form validation utility functions

/**
 * Validates name fields (first name, last name)
 * Must be 2-50 characters, alphabetic with spaces and hyphens allowed
 */
export const validateName = (name) => {
    if (!name || name.trim().length === 0) return false;
    const nameRegex = /^[a-zA-Z\s\-]{2,50}$/;
    return nameRegex.test(name.trim());
};

/**
 * Validates email format
 */
export const validateEmail = (email) => {
    if (!email || email.trim().length === 0) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

/**
 * Validates Philippine phone number format
 * Must be 10-11 digits
 */
export const validatePhoneNumber = (phone) => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validates SSS number format
 * Format: XX-XXXXXXX-X (10 digits total)
 * Also accepts 10 digits without dashes
 */
export const validateSSS = (sss) => {
    if (!sss || sss.trim().length === 0) return true; // Optional field
    const sssRegex = /^\d{2}-\d{7}-\d{1}$/;
    const sssNoHyphen = /^\d{10}$/;
    return sssRegex.test(sss) || sssNoHyphen.test(sss);
};

/**
 * Validates PhilHealth number format
 * Format: XX-XXXXXXXXX-X (12 digits total)
 * Also accepts 12 digits without dashes
 */
export const validatePhilHealth = (philhealth) => {
    if (!philhealth || philhealth.trim().length === 0) return true; // Optional field
    const philhealthRegex = /^\d{2}-\d{9}-\d{1}$/;
    const philhealthNoHyphen = /^\d{12}$/;
    return philhealthRegex.test(philhealth) || philhealthNoHyphen.test(philhealth);
};

/**
 * Validates TIN (Tax Identification Number) format
 * Format: XXX-XXX-XXX or XXX-XXX-XXX-XXX (9-12 digits)
 * Also accepts 9-12 digits without dashes
 */
export const validateTIN = (tin) => {
    if (!tin || tin.trim().length === 0) return true; // Optional field
    const tinRegex = /^\d{3}-\d{3}-\d{3}(-\d{3})?$/;
    const tinNoHyphen = /^\d{9,12}$/;
    return tinRegex.test(tin) || tinNoHyphen.test(tin);
};

/**
 * Validates Pag-ibig number format
 * Format: XXXX-XXXX-XXXX (12 digits total)
 * Also accepts 12 digits without dashes
 */
export const validatePagibig = (pagibig) => {
    if (!pagibig || pagibig.trim().length === 0) return true; // Optional field
    const pagibigRegex = /^\d{4}-\d{4}-\d{4}$/;
    const pagibigNoHyphen = /^\d{12}$/;
    return pagibigRegex.test(pagibig) || pagibigNoHyphen.test(pagibig);
};

/**
 * Validates that the person is at least 18 years old
 */
export const validateAge = (birthdate) => {
    if (!birthdate) return true; // Optional field
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age >= 18;
};

/**
 * Validates that a date is not in the future
 */
export const validateFutureDate = (date) => {
    if (!date) return true; // Optional field
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate <= today;
};

/**
 * Validates password strength
 * Must be at least 8 characters
 */
export const validatePassword = (password) => {
    if (!password) return false;
    return password.length >= 8;
};

/**
 * Validates address field
 * Must be 10-200 characters
 */
export const validateAddress = (address) => {
    if (!address || address.trim().length === 0) return true; // Optional field
    const length = address.trim().length;
    return length >= 10 && length <= 200;
};

/**
 * Validates general text field
 * Must be 2-100 characters
 */
export const validateTextField = (text) => {
    if (!text || text.trim().length === 0) return true; // Optional field
    const length = text.trim().length;
    return length >= 2 && length <= 100;
};
