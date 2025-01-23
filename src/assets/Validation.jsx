
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;


export const validateName = (name) => {
    if (!name.trim()) {
        return { isValid: false, Message: "Name Required!." };
    }
    if (/\d/.test(name)) {
        return { isValid: false, Message: "Name should not contain numbers." };
    }
    return { isValid: true, Message: "" };
}

export const validateEmail = (email) => {
    if (!email.trim()) {
        return { isValid: false, Message: "Email is required!." };
    } else if (!emailRegex.test(email)) {
        return { isValid: false, Message: "Invalid email address." };
    }
    return { isValid: true, Message: "" };
};

export const validatePassword = (password) => {
    if (!password.trim()){
        return { isValid: false, Message: "Password is required!." };
    }
    else if (password.length < 6){
        return { isValid: false, Message: "Password must be at least 6 characters long." };
    }
    return { isValid: true, Message: "" };
}

export const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;

    if (!phone.trim()) {
        return { isValid: false, Message: "Phone number is required!" };
    }
    else if (!phoneRegex.test(phone)) {
        return { isValid: false, Message: "Phone number must be exactly 10 digits." };
    }
    return { isValid: true, Message: "" };
}
