import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Centralized JWT Secret
// In production, this MUST come from environment variables.
const getSecret = () => {
  const secret = process.env.EMPLOYER_JWT_SECRET;
  if (!secret) {
    console.warn('WARNING: EMPLOYER_JWT_SECRET is not defined in environment variables. Falling back to default.');
  }
  return new TextEncoder().encode(secret || 'employer_jwt_secret_gojobsync_2024');
};

const JWT_SECRET = getSecret();

/**
 * Extracts and verifies the employer ID from the request cookies.
 * @param req NextRequest
 * @returns string | null (employerId)
 */
export async function getEmployerId(req: NextRequest): Promise<string | null> {
  try {
    const token = req.cookies.get('employer_token')?.value;
    if (!token) return null;
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.employerId as string;
  } catch (error) {
    return null;
  }
}

export { JWT_SECRET };
