export interface CustomError extends Error {
  statusText: string;
  // include any other custom properties here
}
