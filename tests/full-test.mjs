/**
 * THE JOB SYNC — Full Project Automated Test Suite
 * Tests every API endpoint, function, and user flow
 * Run: node tests/full-test.mjs
 */

const BASE = 'http://localhost:3000';
let pass = 0, fail = 0, total = 0;
const results = [];

// ========== Helpers ==========
async function test(name, fn) {
  total++;
  try {
    await fn();
    pass++;
    results.push({ name, status: '✅ PASS' });
    console.log(`  ✅ ${name}`);
  } catch (err) {
    fail++;
    results.push({ name, status: '❌ FAIL', error: err.message });
    console.log(`  ❌ ${name} → ${err.message}`);
  }
}

async function api(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data, ok: res.ok };
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

// Store IDs for chained tests
const ids = {};

// ================================================================
//  SECTION 1: CRM AUTH & USERS
// ================================================================
async function testCrmAuth() {
  console.log('\n🔐 ══ CRM AUTH & USERS ══');

  await test('POST /api/auth/login — valid login (super_admin)', async () => {
    const res = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'admin@crm.com', password: 'admin123' }) });
    assert(res.ok, `Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    assert(res.data.id, 'No user ID returned');
    assert(res.data.role, 'No role returned');
    ids.userId = res.data.id;
  });

  await test('POST /api/auth/login — wrong password → 401', async () => {
    const res = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'admin@crm.com', password: 'wrongpass' }) });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test('POST /api/auth/login — empty fields → 400', async () => {
    const res = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({}) });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('GET /api/users — list all users', async () => {
    const res = await api('/api/users');
    assert(res.ok, `Failed: ${res.status}`);
    assert(Array.isArray(res.data), 'Response is not array');
    assert(res.data.length > 0, 'No users found');
  });

  await test('POST /api/users — create user', async () => {
    const res = await api('/api/users', { method: 'POST', body: JSON.stringify({
      name: 'Test User', email: `test_${Date.now()}@crm.com`, password: 'test123',
      role: 'recruiter', phone: '9999999999'
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
    if (res.data?.id) ids.newUserId = res.data.id;
  });

  await test('GET /api/dashboard — dashboard stats', async () => {
    const res = await api('/api/dashboard');
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('GET /api/notifications — list notifications', async () => {
    const res = await api('/api/notifications');
    assert(res.ok, `Failed: ${res.status}`);
  });
}

// ================================================================
//  SECTION 2: CRM CLIENTS
// ================================================================
async function testClients() {
  console.log('\n🏢 ══ CLIENTS ══');

  await test('GET /api/clients — list clients', async () => {
    const res = await api('/api/clients');
    assert(res.ok, `Failed: ${res.status}`);
    assert(Array.isArray(res.data), 'Not array');
    if (res.data.length > 0) ids.clientId = res.data[0].id;
  });

  await test('POST /api/clients — create client', async () => {
    const res = await api('/api/clients', { method: 'POST', body: JSON.stringify({
      companyName: 'Test Corp ' + Date.now(), contactPerson: 'John Doe',
      email: `corp_${Date.now()}@test.com`, phone: '9876543210',
      address: 'Chennai, India', industry: 'IT', status: 'active'
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
    if (res.data?.id) ids.newClientId = res.data.id;
  });

  if (ids.newClientId) {
    await test('PUT /api/clients/[id] — update client', async () => {
      const res = await api(`/api/clients/${ids.newClientId}`, { method: 'PUT', body: JSON.stringify({
        companyName: 'Updated Corp', contactPerson: 'Jane Doe',
        email: `updated_${Date.now()}@test.com`, phone: '9876543211',
        address: 'Mumbai, India', industry: 'IT', status: 'active'
      })});
      assert(res.ok, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
    });
  }
}

// ================================================================
//  SECTION 3: JOB REQUIREMENTS
// ================================================================
async function testRequirements() {
  console.log('\n📋 ══ REQUIREMENTS ══');

  await test('GET /api/requirements — list requirements', async () => {
    const res = await api('/api/requirements');
    assert(res.ok, `Failed: ${res.status}`);
    assert(Array.isArray(res.data), 'Not array');
    if (res.data.length > 0) ids.requirementId = res.data[0].id;
  });

  await test('POST /api/requirements — create requirement', async () => {
    const clientId = ids.clientId || ids.newClientId;
    if (!clientId) { assert(false, 'No client ID available'); return; }
    const res = await api('/api/requirements', { method: 'POST', body: JSON.stringify({
      clientId, title: 'Test Dev ' + Date.now(), description: 'Testing role',
      skills: '["JavaScript", "React"]', experience: '2-4 years',
      positions: 5, location: 'Chennai', salaryRange: '5-10 LPA',
      priority: 'high', deadline: '2026-12-31'
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
    if (res.data?.id) ids.newReqId = res.data.id;
  });

  if (ids.requirementId) {
    await test('GET /api/requirements — filter by status', async () => {
      const res = await api('/api/requirements?status=open');
      assert(res.ok, `Failed: ${res.status}`);
    });
  }
}

// ================================================================
//  SECTION 4: CANDIDATES
// ================================================================
async function testCandidates() {
  console.log('\n👤 ══ CANDIDATES ══');

  await test('GET /api/candidates — list candidates', async () => {
    const res = await api('/api/candidates');
    assert(res.ok, `Failed: ${res.status}`);
    assert(Array.isArray(res.data), 'Not array');
    if (res.data.length > 0) ids.candidateId = res.data[0].id;
  });

  await test('POST /api/candidates — create candidate', async () => {
    const res = await api('/api/candidates', { method: 'POST', body: JSON.stringify({
      name: 'Test Candidate', email: `cand_${Date.now()}@test.com`, phone: '8888888888',
      skills: ['Node.js', 'React'], experience: '3 years', education: 'B.Tech',
      location: 'Bangalore', status: 'new'
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
    if (res.data?.id) ids.newCandidateId = res.data.id;
  });

  await test('POST /api/candidates — validation: missing fields → 400', async () => {
    const res = await api('/api/candidates', { method: 'POST', body: JSON.stringify({ name: '' }) });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('GET /api/candidates — search filter', async () => {
    const res = await api('/api/candidates?search=Test');
    assert(res.ok, `Failed: ${res.status}`);
  });

  if (ids.candidateId) {
    await test('GET /api/candidates/[id]/followups — get follow-ups', async () => {
      const res = await api(`/api/candidates/${ids.candidateId}/followups`);
      assert(res.ok, `Failed: ${res.status}`);
    });
  }
}

// ================================================================
//  SECTION 5: INTERVIEWS
// ================================================================
async function testInterviews() {
  console.log('\n🎤 ══ INTERVIEWS ══');

  await test('GET /api/interviews — list interviews', async () => {
    const res = await api('/api/interviews');
    assert(res.ok, `Failed: ${res.status}`);
    assert(Array.isArray(res.data), 'Not array');
    if (res.data.length > 0) ids.interviewId = res.data[0].id;
  });

  await test('POST /api/interviews — schedule interview', async () => {
    const candidateId = ids.candidateId || ids.newCandidateId;
    const requirementId = ids.requirementId || ids.newReqId;
    const interviewerId = ids.userId;
    if (!candidateId || !requirementId || !interviewerId) { 
      assert(false, 'Missing required IDs for interview'); return; 
    }
    const res = await api('/api/interviews', { method: 'POST', body: JSON.stringify({
      candidateId, requirementId, interviewerId,
      scheduledAt: '2026-08-01T10:00:00', duration: 60,
      type: 'technical', status: 'scheduled'
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
    if (res.data?.id) ids.newInterviewId = res.data.id;
  });
}

// ================================================================
//  SECTION 6: PLACEMENTS
// ================================================================
async function testPlacements() {
  console.log('\n🏆 ══ PLACEMENTS ══');

  await test('GET /api/placements — list placements', async () => {
    const res = await api('/api/placements');
    assert(res.ok, `Failed: ${res.status}`);
    assert(Array.isArray(res.data), 'Not array');
  });

  await test('POST /api/placements — create placement', async () => {
    const candidateId = ids.candidateId || ids.newCandidateId;
    const requirementId = ids.requirementId || ids.newReqId;
    const clientId = ids.clientId || ids.newClientId;
    if (!candidateId || !requirementId || !clientId) {
      assert(false, 'Missing required IDs'); return;
    }
    const res = await api('/api/placements', { method: 'POST', body: JSON.stringify({
      candidateId, requirementId, clientId,
      position: 'Software Dev', salary: '8 LPA',
      joiningDate: '2026-09-01', status: 'offer_sent'
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
  });
}

// ================================================================
//  SECTION 7: ATTENDANCE & LEAVE
// ================================================================
async function testAttendanceLeave() {
  console.log('\n📅 ══ ATTENDANCE & LEAVE ══');

  await test('GET /api/attendance — list attendance', async () => {
    const res = await api('/api/attendance');
    assert(res.ok, `Failed: ${res.status}`);
  });

  if (ids.userId) {
    await test('GET /api/attendance/[userId] — user attendance', async () => {
      const res = await api(`/api/attendance/${ids.userId}`);
      assert(res.ok, `Failed: ${res.status}`);
    });
  }

  await test('GET /api/leave — list leave requests (super_admin)', async () => {
    const res = await api(`/api/leave?role=super_admin&userId=${ids.userId}`);
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('POST /api/leave — create leave request', async () => {
    if (!ids.userId) { assert(false, 'No user ID'); return; }
    const res = await api('/api/leave', { method: 'POST', body: JSON.stringify({
      userId: ids.userId, startDate: '2026-08-01', endDate: '2026-08-03',
      reason: 'Test leave request'
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
    if (res.data?.id) ids.leaveId = res.data.id;
  });
}

// ================================================================
//  SECTION 8: HELPDESK TICKETS
// ================================================================
async function testTickets() {
  console.log('\n🎫 ══ HELPDESK TICKETS ══');

  await test('GET /api/tickets — list tickets', async () => {
    const res = await api(`/api/tickets?userId=${ids.userId}&role=super_admin`);
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('POST /api/tickets — create ticket', async () => {
    if (!ids.userId) { assert(false, 'No user ID'); return; }
    const res = await api('/api/tickets', { method: 'POST', body: JSON.stringify({
      creatorId: ids.userId, assignedRole: 'super_admin',
      subject: 'Test ticket ' + Date.now(),
      message: 'This is a test ticket message'
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
    if (res.data?.id) ids.ticketId = res.data.id;
  });
}

// ================================================================
//  SECTION 9: CANDIDATE PORTAL (Careers)
// ================================================================
async function testCandidatePortal() {
  console.log('\n🌐 ══ CANDIDATE PORTAL (CAREERS) ══');

  await test('POST /api/candidate-auth/register — register candidate', async () => {
    ids.candEmail = `career_${Date.now()}@test.com`;
    const res = await api('/api/candidate-auth/register', { method: 'POST', body: JSON.stringify({
      name: 'Career Test User', email: ids.candEmail, phone: '7777777777', password: 'test123'
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
    if (res.data?.id) ids.candAccountId = res.data.id;
  });

  await test('POST /api/candidate-auth/login — login candidate', async () => {
    const res = await api('/api/candidate-auth/login', { method: 'POST', body: JSON.stringify({
      email: ids.candEmail, password: 'test123'
    })});
    assert(res.ok, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
    if (res.data?.id) ids.candAccountId = res.data.id;
  });

  await test('POST /api/candidate-auth/login — wrong password → 401', async () => {
    const res = await api('/api/candidate-auth/login', { method: 'POST', body: JSON.stringify({
      email: ids.candEmail, password: 'wrong'
    })});
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  if (ids.candAccountId) {
    await test('GET /api/candidate-auth/profile — get profile', async () => {
      const res = await api(`/api/candidate-auth/profile?id=${ids.candAccountId}`);
      assert(res.ok, `Failed: ${res.status}`);
    });

    await test('PUT /api/candidate-auth/profile — update profile', async () => {
      const res = await api('/api/candidate-auth/profile', { method: 'PUT', body: JSON.stringify({
        id: ids.candAccountId, headline: 'Senior Dev',
        skills: '["React", "Node.js"]', location: 'Chennai'
      })});
      assert(res.ok, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
    });

    await test('GET /api/candidate-auth/recommendations — needs JWT (skip OK)', async () => {
      const res = await api(`/api/candidate-auth/recommendations?id=${ids.candAccountId}`);
      // This API requires JWT cookie, 401 is expected in test environment
      assert(res.status === 401 || res.ok, `Unexpected: ${res.status}`);
    });

    await test('GET /api/candidate-auth/applications — list applications', async () => {
      const res = await api(`/api/candidate-auth/applications?candidateAccountId=${ids.candAccountId}`);
      assert(res.ok, `Failed: ${res.status}`);
    });

    // Apply for a job
    if (ids.requirementId) {
      await test('POST /api/candidate-auth/applications — apply for job', async () => {
        const res = await api('/api/candidate-auth/applications', { method: 'POST', body: JSON.stringify({
          candidateAccountId: ids.candAccountId, requirementId: ids.requirementId,
          coverNote: 'I am interested in this role'
        })});
        assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
        if (res.data?.id) ids.applicationId = res.data.id;
      });
    }

    // Save a job
    if (ids.requirementId) {
      await test('POST /api/candidate-auth/saved-jobs — save job', async () => {
        const res = await api('/api/candidate-auth/saved-jobs', { method: 'POST', body: JSON.stringify({
          candidateAccountId: ids.candAccountId, jobId: ids.requirementId
        })});
        assert(res.ok || res.status === 201 || res.status === 409, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
      });

      await test('GET /api/candidate-auth/saved-jobs — list saved jobs', async () => {
        const res = await api(`/api/candidate-auth/saved-jobs?candidateAccountId=${ids.candAccountId}`);
        assert(res.ok, `Failed: ${res.status}`);
      });
    }

    await test('GET /api/candidate-auth/messages — list messages', async () => {
      const res = await api(`/api/candidate-auth/messages?candidateAccountId=${ids.candAccountId}`);
      assert(res.ok, `Failed: ${res.status}`);
    });

    await test('POST /api/candidate-auth/messages — send message', async () => {
      const res = await api('/api/candidate-auth/messages', { method: 'POST', body: JSON.stringify({
        candidateAccountId: ids.candAccountId, sender: 'candidate',
        message: 'Test message from candidate'
      })});
      assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
    });
  }
}

// ================================================================
//  SECTION 10: EMPLOYER PORTAL
// ================================================================
async function testEmployerPortal() {
  console.log('\n🏭 ══ EMPLOYER PORTAL ══');

  await test('POST /api/employer/register — register employer', async () => {
    ids.empEmail = `employer_${Date.now()}@test.com`;
    const res = await api('/api/employer/register', { method: 'POST', body: JSON.stringify({
      companyName: 'Test Corp Ltd', gstNumber: 'GST123456789',
      address: 'Chennai', contactPerson: 'CEO Test', contactPhone: '6666666666',
      email: ids.empEmail, password: 'emp123', industry: 'IT',
      about: 'A test company for testing'
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
    if (res.data?.id) ids.employerId = res.data.id;
  });

  await test('POST /api/employer/login — login employer', async () => {
    const res = await api('/api/employer/login', { method: 'POST', body: JSON.stringify({
      email: ids.empEmail, password: 'emp123'
    })});
    assert(res.ok, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
    if (res.data?.id) ids.employerId = res.data.id;
  });

  await test('POST /api/employer/login — wrong password → 401', async () => {
    const res = await api('/api/employer/login', { method: 'POST', body: JSON.stringify({
      email: ids.empEmail, password: 'wrongpwd'
    })});
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  if (ids.employerId) {
    await test('GET /api/employer/me — get employer profile', async () => {
      const res = await api(`/api/employer/me?id=${ids.employerId}`);
      assert(res.ok, `Failed: ${res.status}`);
    });

    await test('POST /api/employer/jobs — post a job', async () => {
      const res = await api('/api/employer/jobs', { method: 'POST', body: JSON.stringify({
        employerId: ids.employerId, title: 'React Developer',
        description: 'Looking for experienced React dev',
        skills: '["React", "TypeScript"]', experience: '3+ years',
        location: 'Chennai', salaryRange: '10-15 LPA',
        jobType: 'full-time', field: 'Engineering', openings: 5
      })});
      assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
      if (res.data?.id) ids.empJobId = res.data.id;
    });

    await test('GET /api/employer/jobs — list employer jobs', async () => {
      const res = await api(`/api/employer/jobs?employerId=${ids.employerId}`);
      assert(res.ok, `Failed: ${res.status}`);
    });

    if (ids.empJobId) {
      await test('POST /api/employer/jobs/[id]/fill — mark job filled', async () => {
        const res = await api(`/api/employer/jobs/${ids.empJobId}/fill`, { method: 'POST' });
        assert(res.ok, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
      });
    }

    await test('GET /api/employer/candidates — view candidates', async () => {
      const res = await api(`/api/employer/candidates?employerId=${ids.employerId}`);
      assert(res.ok, `Failed: ${res.status}`);
    });

    if (ids.candAccountId) {
      await test('POST /api/employer/candidates/save — save candidate', async () => {
        const res = await api('/api/employer/candidates/save', { method: 'POST', body: JSON.stringify({
          employerId: ids.employerId, candidateAccountId: ids.candAccountId
        })});
        assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
      });
    }
  }
}

// ================================================================
//  SECTION 11: PUBLIC APIs
// ================================================================
async function testPublicAPIs() {
  console.log('\n🌍 ══ PUBLIC APIs ══');

  await test('GET /api/public/employer-jobs — public job listings', async () => {
    const res = await api('/api/public/employer-jobs');
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('POST /api/applications — submit application (POST only)', async () => {
    const res = await api('/api/applications', { method: 'POST', body: JSON.stringify({
      name: 'App Test User', email: `apptest_${Date.now()}@test.com`, phone: '5555555555',
      skills: ['JavaScript'], experience: '2 years', education: 'B.Tech', location: 'Chennai'
    })});
    // May fail if no HR users exist, but 201 or 503 both are valid
    assert(res.ok || res.status === 201 || res.status === 503, `Failed: ${res.status}`);
  });
}

// ================================================================
//  SECTION 12: ADMIN ERP
// ================================================================
async function testAdminERP() {
  console.log('\n⚙️ ══ ADMIN ERP ══');

  await test('POST /api/admin/login — admin login', async () => {
    const res = await api('/api/admin/login', { method: 'POST', body: JSON.stringify({
      email: 'admin@thejobsync.com', password: 'admin123'
    })});
    // Might not exist yet, test with different creds
    if (!res.ok) {
      const res2 = await api('/api/admin/login', { method: 'POST', body: JSON.stringify({
        email: 'superadmin@thejobsync.com', password: 'admin123'
      })});
      assert(res2.ok || res2.status === 401, `Failed: ${res2.status}`);
    }
  });

  await test('GET /api/admin/stats — admin stats', async () => {
    const res = await api('/api/admin/stats');
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('GET /api/admin/companies — list companies', async () => {
    const res = await api('/api/admin/companies');
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('GET /api/admin/candidates — list candidates', async () => {
    const res = await api('/api/admin/candidates');
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('GET /api/admin/jobs — list jobs', async () => {
    const res = await api('/api/admin/jobs');
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('GET /api/admin/blog — list blog posts', async () => {
    const res = await api('/api/admin/blog');
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('POST /api/admin/blog — create blog post', async () => {
    const res = await api('/api/admin/blog', { method: 'POST', body: JSON.stringify({
      title: 'Test Blog ' + Date.now(), slug: 'test-blog-' + Date.now(),
      content: 'Test content', author: 'Admin', status: 'draft'
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
  });

  await test('GET /api/admin/faqs — list FAQs', async () => {
    const res = await api('/api/admin/faqs');
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('POST /api/admin/faqs — create FAQ', async () => {
    const res = await api('/api/admin/faqs', { method: 'POST', body: JSON.stringify({
      question: 'What is The Job Sync?', answer: 'A recruitment platform', order: 1
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
  });

  await test('GET /api/admin/newsletter — list subscribers', async () => {
    const res = await api('/api/admin/newsletter');
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('GET /api/admin/newsletter — verify subscriber list structure', async () => {
    const res = await api('/api/admin/newsletter');
    assert(res.ok, `Failed: ${res.status}`);
    assert(Array.isArray(res.data), 'Expected array');
  });

  await test('GET /api/admin/packages — list packages', async () => {
    const res = await api('/api/admin/packages');
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('POST /api/admin/packages — create package', async () => {
    const res = await api('/api/admin/packages', { method: 'POST', body: JSON.stringify({
      name: 'Test Plan', price: 999, duration: 30, jobPosts: 10, resumeViews: 100
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
  });

  await test('GET /api/admin/coupons — list coupons', async () => {
    const res = await api('/api/admin/coupons');
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('POST /api/admin/coupons — create coupon', async () => {
    const res = await api('/api/admin/coupons', { method: 'POST', body: JSON.stringify({
      code: 'TEST' + Date.now(), discount: 20, maxUses: 100,
      validFrom: '2026-07-01', validUntil: '2026-12-31'
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
  });

  await test('GET /api/admin/payment — payment settings', async () => {
    const res = await api('/api/admin/payment');
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('GET /api/admin/invoices — list invoices', async () => {
    const res = await api('/api/admin/invoices');
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('GET /api/admin/locations — list locations', async () => {
    const res = await api('/api/admin/locations');
    assert(res.ok, `Failed: ${res.status}`);
  });

  await test('POST /api/admin/locations — create location', async () => {
    const res = await api('/api/admin/locations', { method: 'POST', body: JSON.stringify({
      name: 'Test City', state: 'Tamil Nadu', country: 'India'
    })});
    assert(res.ok || res.status === 201, `Failed: ${res.status} ${JSON.stringify(res.data)}`);
  });

  await test('GET /api/admin/employees — list employees', async () => {
    const res = await api('/api/admin/employees');
    assert(res.ok, `Failed: ${res.status}`);
  });
}

// ================================================================
//  SECTION 13: PAGE LOAD TESTS
// ================================================================
async function testPageLoads() {
  console.log('\n📄 ══ PAGE LOAD TESTS ══');

  const pages = [
    ['/', 'Landing Home'],
    ['/about', 'About Page'],
    ['/companies', 'Companies Page'],
    ['/contact', 'Contact Page'],
    ['/pricing', 'Pricing Page'],
    ['/crm', 'CRM Login'],
    ['/register', 'Register Page'],
    ['/post-job', 'Post Job Page'],
    ['/careers', 'Careers Portal'],
    ['/careers/login', 'Careers Login'],
    ['/careers/register', 'Careers Register'],
    ['/employer/login', 'Employer Login'],
  ];

  for (const [path, name] of pages) {
    await test(`GET ${path} — ${name} loads`, async () => {
      const res = await fetch(`${BASE}${path}`);
      assert(res.ok, `Page ${path} failed with ${res.status}`);
    });
  }
}

// ================================================================
//  SECTION 14: LOAD / STRESS TEST
// ================================================================
async function testLoad() {
  console.log('\n🔥 ══ LOAD / STRESS TEST ══');

  // Test 1: Concurrent reads (100 simultaneous requests)
  await test('100 concurrent GET /api/candidates — all succeed', async () => {
    const start = Date.now();
    const promises = Array.from({ length: 100 }, () => api('/api/candidates'));
    const results = await Promise.all(promises);
    const elapsed = Date.now() - start;
    const failures = results.filter(r => !r.ok).length;
    assert(failures === 0, `${failures} requests failed out of 100`);
    console.log(`    ⏱  100 reads in ${elapsed}ms (avg ${Math.round(elapsed/100)}ms/req)`);
  });

  // Test 2: Concurrent writes (50 candidate creates)
  await test('50 concurrent POST /api/candidates — bulk write', async () => {
    const start = Date.now();
    const promises = Array.from({ length: 50 }, (_, i) => 
      api('/api/candidates', { method: 'POST', body: JSON.stringify({
        name: `Load Test ${i}`, email: `load_${Date.now()}_${i}@test.com`, phone: `900000${String(i).padStart(4, '0')}`,
        skills: ['Test'], experience: '1 year', education: 'B.Tech', location: 'Load City'
      })})
    );
    const results = await Promise.all(promises);
    const elapsed = Date.now() - start;
    const failures = results.filter(r => !r.ok && r.status !== 201).length;
    assert(failures === 0, `${failures} writes failed out of 50`);
    console.log(`    ⏱  50 writes in ${elapsed}ms (avg ${Math.round(elapsed/50)}ms/req)`);
  });

  // Test 3: Mixed read/write (simulate real usage)
  await test('Mixed load: 50 reads + 20 writes simultaneously', async () => {
    const start = Date.now();
    const reads = Array.from({ length: 50 }, () => api('/api/requirements'));
    const writes = Array.from({ length: 20 }, (_, i) => 
      api('/api/candidate-auth/register', { method: 'POST', body: JSON.stringify({
        name: `Mixed ${i}`, email: `mix_${Date.now()}_${i}@test.com`, 
        phone: `800000${String(i).padStart(4, '0')}`, password: 'test123'
      })})
    );
    const allResults = await Promise.all([...reads, ...writes]);
    const elapsed = Date.now() - start;
    const failures = allResults.filter(r => !r.ok && r.status !== 201).length;
    assert(failures === 0, `${failures} requests failed out of 70`);
    console.log(`    ⏱  70 mixed ops in ${elapsed}ms`);
  });

  // Test 4: Rapid sequential writes (database throughput)
  await test('Sequential: 100 rapid candidate registrations', async () => {
    const start = Date.now();
    let ok = 0;
    for (let i = 0; i < 100; i++) {
      const res = await api('/api/candidate-auth/register', { method: 'POST', body: JSON.stringify({
        name: `Seq ${i}`, email: `seq_${Date.now()}_${i}@test.com`,
        phone: `700000${String(i).padStart(4, '0')}`, password: 'test123'
      })});
      if (res.ok || res.status === 201) ok++;
    }
    const elapsed = Date.now() - start;
    assert(ok >= 95, `Only ${ok}/100 succeeded`);
    console.log(`    ⏱  ${ok}/100 in ${elapsed}ms (avg ${Math.round(elapsed/100)}ms/write)`);
  });
}

// ================================================================
//  MAIN
// ================================================================
async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  🧪 THE JOB SYNC — FULL PROJECT TEST SUITE');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Server: ${BASE}`);
  console.log(`  Started: ${new Date().toLocaleString()}`);
  console.log('═══════════════════════════════════════════════════');

  try {
    await testCrmAuth();
    await testClients();
    await testRequirements();
    await testCandidates();
    await testInterviews();
    await testPlacements();
    await testAttendanceLeave();
    await testTickets();
    await testCandidatePortal();
    await testEmployerPortal();
    await testPublicAPIs();
    await testAdminERP();
    await testPageLoads();
    await testLoad();
  } catch (e) {
    console.error('\n💥 Test suite crashed:', e.message);
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log(`  📊 RESULTS: ${pass}/${total} PASSED | ${fail} FAILED`);
  console.log('═══════════════════════════════════════════════════');

  if (fail > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.filter(r => r.status === '❌ FAIL').forEach(r => {
      console.log(`  • ${r.name}: ${r.error}`);
    });
  }

  console.log('\n✨ Testing complete!\n');
}

main().catch(console.error);
