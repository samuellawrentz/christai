// Email validation utility
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Common validation helpers
export const validateRequired = (value: unknown, fieldName: string): string | null => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email || typeof email !== "string") {
    return "Email is required";
  }

  if (!isValidEmail(email)) {
    return "Invalid email format";
  }

  return null;
};

// Add more utilities as needed
// export const formatDate = (date: string | Date) => { ... }
// export const generateId = () => crypto.randomUUID()
