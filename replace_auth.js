const fs = require('fs');
const path = require('path');

const targetFiles = [
  'app/api/employer/candidates/send-email/route.ts',
  'app/api/employer/candidates/save/route.ts',
  'app/api/employer/candidates/route.ts',
  'app/api/employer/invoices/route.ts',
  'app/api/employer/jobs/route.ts',
  'app/api/employer/checkout/verify-payment/route.ts',
  'app/api/employer/checkout/create-order/route.ts'
];

const oldString = `import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.EMPLOYER_JWT_SECRET || 'employer_jwt_secret_gojobsync_2024'
);

async function getEmployerId(req: NextRequest): Promise<string | null> {
  try {
    const token = req.cookies.get('employer_token')?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.employerId as string;
  } catch {
    return null;
  }
}`;

const oldString2 = `import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.EMPLOYER_JWT_SECRET || 'employer_jwt_secret_gojobsync_2024'
);

async function getEmployerId(req: NextRequest): Promise<string | null> {
  try {
    const token = req.cookies.get('employer_token')?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.employerId as string;
  } catch {
    return null;
  }
}`;

// I will just use regex to replace it because formatting might differ slightly
const regex = /import \{ jwtVerify \} from 'jose';[\s\S]*?async function getEmployerId\(req: NextRequest\): Promise<string \| null> \{[\s\S]*?\} catch \{[\s\S]*?return null;[\s\S]*?\}[\s\S]*?\}/;

for (const file of targetFiles) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (regex.test(content)) {
      content = content.replace(regex, `import { getEmployerId } from '@/lib/auth';`);
      fs.writeFileSync(fullPath, content);
      console.log('Replaced in', file);
    } else {
      console.log('Not matched in', file);
    }
  } else {
    console.log('File not found', file);
  }
}
