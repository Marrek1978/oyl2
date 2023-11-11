
interface LoginCredentialsProps {
  email: string | null;
  password: string | null;
}



function isValidEmail(email: LoginCredentialsProps["email"]) {
  return email && email.includes('@') && email.includes('.');
}

function isValidPassword(password:LoginCredentialsProps["password"]) {
  return password && password.trim().length >= 7;
}

export function validateCredentials(input: LoginCredentialsProps) {
  
  let validationErrors:LoginCredentialsProps  = {
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


interface ValuesProps{
  title: string | null;
  description: string | null;
}


export function validateValuesInput(input: ValuesProps) {

  let validationErrors: ValuesProps = {
    title: null,
    description: null,
  };

  if (!input.title) {
    validationErrors.title = 'Please enter a value title.'
  }

  if (!input.description) {
    validationErrors.description = 'Please enter a value description.'
  }

  if (validationErrors.title || validationErrors.description) {
    throw validationErrors;
  }
}