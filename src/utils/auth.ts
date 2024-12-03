/**
 * Simple password hashing using a basic hash function.
 * In a real application, use a proper hashing library like bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  // This is a mock implementation. In production, use a proper hashing library
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compare a plain text password with a hashed password.
 * In a real application, use the comparison function provided by your hashing library.
 */
export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  // This is a mock implementation. In production, use a proper password comparison
  const hashedPlainPassword = await hashPassword(plainPassword);
  return hashedPlainPassword === hashedPassword;
}

/**
 * Generate a mock JWT token.
 * In a real application, use a proper JWT library.
 */
export function generateToken(userId: string): string {
  // This is a mock implementation. In production, use a proper JWT library
  return `mock-jwt-token-${userId}-${Date.now()}`;
}

/**
 * Verify a mock JWT token.
 * In a real application, use a proper JWT library.
 */
export function verifyToken(token: string): boolean {
  // This is a mock implementation. In production, use a proper JWT verification
  return token.startsWith('mock-jwt-token-');
}
