// import { json } from "@remix-run/node";

interface CredentialsProps {
  email: string | null;
  password: string | null;
}


function isValidEmail(email: CredentialsProps["email"]) {
  return email && email.includes('@') && email.includes('.');
}

function isValidPassword(password:CredentialsProps["password"]) {
  return password && password.trim().length >= 7;
}

export function validateCredentials(input: CredentialsProps) {
  
  let validationErrors:CredentialsProps  = {
    email: null,
    password: null,
  };

  if (!isValidEmail(input.email)) {
    validationErrors.email = 'Invalid email address.'
  }

  if (!isValidPassword(input.password)) {
    validationErrors.password = 'Invalid password. Must be at least 7 characters long.'
  }

  if (validationErrors.email || validationErrors.password) {
    throw validationErrors;
  }
}