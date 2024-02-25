// Function to generate a random password
export const generateRandomPassword = () => {
  // Define characters to include in the password
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let password = "";

  // Generate a random password of desired length
  const passwordLength = 12; // Change this value to adjust password length
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
};
