import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (order matters for foreign keys)
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.companyLead.deleteMany();
  await prisma.ticketMessage.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.jobRequirement.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // ==================== USERS ====================
  const users = await Promise.all([
    prisma.user.create({ data: { id: 'user-1', name: 'Rajesh Kumar', email: 'superadmin@crm.com', password: 'admin123', role: 'super_admin', phone: '+91 98765 43210', department: 'Management', isActive: true } }),
    prisma.user.create({ data: { id: 'user-2', name: 'Priya Sharma', email: 'itadmin@crm.com', password: 'admin123', role: 'it_admin', phone: '+91 98765 43211', department: 'IT', isActive: true } }),
    prisma.user.create({ data: { id: 'user-3', name: 'Arun Patel', email: 'admin@crm.com', password: 'admin123', role: 'admin', phone: '+91 98765 43212', department: 'Operations', isActive: true } }),
    prisma.user.create({ data: { id: 'user-4', name: 'Sneha Reddy', email: 'crm@crm.com', password: 'admin123', role: 'placement_coordinator', phone: '+91 98765 43213', department: 'CRM', isActive: true } }),
    prisma.user.create({ data: { id: 'user-5', name: 'Vikram Singh', email: 'recruiter@crm.com', password: 'admin123', role: 'recruiter', phone: '+91 98765 43214', department: 'Recruitment', isActive: true } }),
    prisma.user.create({ data: { id: 'user-6', name: 'Deepika Nair', email: 'interviewer@crm.com', password: 'admin123', role: 'interviewer', phone: '+91 98765 43215', department: 'Technical', isActive: true } }),
    prisma.user.create({ data: { id: 'user-7', name: 'Kavitha Menon', email: 'hr@crm.com', password: 'admin123', role: 'hr', phone: '+91 98765 43216', department: 'Human Resources', isActive: true } }),
    prisma.user.create({ data: { id: 'user-8', name: 'TechCorp Solutions', email: 'client@crm.com', password: 'admin123', role: 'client', phone: '+91 98765 43217', department: 'Client', isActive: true } }),
    prisma.user.create({ data: { id: 'user-9', name: 'Rahul Verma', email: 'dev@crm.com', password: 'admin123', role: 'developer', phone: '+91 98765 43218', department: 'Development', isActive: true } }),
    prisma.user.create({ data: { id: 'user-10', name: 'Anita Gupta', email: 'tester@crm.com', password: 'admin123', role: 'tester', phone: '+91 98765 43219', department: 'QA', isActive: true } }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // ==================== CLIENTS ====================
  const clients = await Promise.all([
    prisma.client.create({ data: { id: 'client-1', companyName: 'TechCorp Solutions', contactPerson: 'Amit Joshi', email: 'amit@techcorp.com', phone: '+91 98765 11111', address: 'Bangalore, Karnataka', industry: 'IT Services', website: 'https://techcorp.com', status: 'active', notes: 'Premium client, long-term partnership' } }),
    prisma.client.create({ data: { id: 'client-2', companyName: 'InnovateTech Pvt Ltd', contactPerson: 'Meera Kapoor', email: 'meera@innovatetech.in', phone: '+91 98765 22222', address: 'Hyderabad, Telangana', industry: 'Software Development', website: 'https://innovatetech.in', status: 'active', notes: 'Fast-growing startup, multiple requirements' } }),
    prisma.client.create({ data: { id: 'client-3', companyName: 'GlobalFinance Inc', contactPerson: 'Suresh Menon', email: 'suresh@globalfinance.com', phone: '+91 98765 33333', address: 'Mumbai, Maharashtra', industry: 'Banking & Finance', website: 'https://globalfinance.com', status: 'active', notes: 'Requires candidates with BFSI experience' } }),
    prisma.client.create({ data: { id: 'client-4', companyName: 'HealthPlus Systems', contactPerson: 'Dr. Ramesh', email: 'ramesh@healthplus.com', phone: '+91 98765 44444', address: 'Chennai, Tamil Nadu', industry: 'Healthcare IT', status: 'active' } }),
    prisma.client.create({ data: { id: 'client-5', companyName: 'EduLearn Technologies', contactPerson: 'Pooja Mehta', email: 'pooja@edulearn.com', phone: '+91 98765 55555', address: 'Pune, Maharashtra', industry: 'EdTech', status: 'inactive', notes: 'Paused requirements temporarily' } }),
    prisma.client.create({ data: { id: 'client-6', companyName: 'CloudNine Infra', contactPerson: 'Karthik R', email: 'karthik@cloudnine.io', phone: '+91 98765 66666', address: 'Bangalore, Karnataka', industry: 'Cloud Infrastructure', website: 'https://cloudnine.io', status: 'active' } }),
  ]);
  console.log(`✅ Created ${clients.length} clients`);

  // ==================== JOB REQUIREMENTS ====================
  const requirements = await Promise.all([
    prisma.jobRequirement.create({ data: { id: 'req-1', clientId: 'client-1', title: 'Senior React Developer', description: 'Looking for an experienced React developer with 5+ years experience in building large-scale applications.', skills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'GraphQL']), experience: '5-8 years', positions: 3, filledPositions: 1, location: 'Bangalore', salaryRange: '₹18-25 LPA', status: 'in_progress', priority: 'high', assignedRecruiters: JSON.stringify(['user-5']), deadline: '2025-08-15' } }),
    prisma.jobRequirement.create({ data: { id: 'req-2', clientId: 'client-2', title: 'Full Stack Engineer', description: 'Need full stack engineers proficient in MERN stack for product development.', skills: JSON.stringify(['MongoDB', 'Express', 'React', 'Node.js']), experience: '3-5 years', positions: 5, filledPositions: 2, location: 'Hyderabad', salaryRange: '₹12-18 LPA', status: 'open', priority: 'urgent', assignedRecruiters: JSON.stringify(['user-5']), deadline: '2025-07-30' } }),
    prisma.jobRequirement.create({ data: { id: 'req-3', clientId: 'client-3', title: 'Java Backend Developer', description: 'Experienced Java developer with Spring Boot and microservices architecture knowledge.', skills: JSON.stringify(['Java', 'Spring Boot', 'Microservices', 'AWS']), experience: '4-7 years', positions: 2, filledPositions: 0, location: 'Mumbai', salaryRange: '₹15-22 LPA', status: 'open', priority: 'medium', assignedRecruiters: JSON.stringify([]), deadline: '2025-09-01' } }),
    prisma.jobRequirement.create({ data: { id: 'req-4', clientId: 'client-4', title: 'DevOps Engineer', description: 'DevOps engineer with expertise in CI/CD, Docker, Kubernetes, and cloud platforms.', skills: JSON.stringify(['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Terraform']), experience: '3-6 years', positions: 2, filledPositions: 1, location: 'Chennai', salaryRange: '₹14-20 LPA', status: 'in_progress', priority: 'high', assignedRecruiters: JSON.stringify(['user-5']), deadline: '2025-08-01' } }),
    prisma.jobRequirement.create({ data: { id: 'req-5', clientId: 'client-1', title: 'UI/UX Designer', description: 'Creative UI/UX designer with strong portfolio and experience in design systems.', skills: JSON.stringify(['Figma', 'Adobe XD', 'Design Systems', 'Prototyping']), experience: '2-5 years', positions: 1, filledPositions: 0, location: 'Bangalore', salaryRange: '₹10-15 LPA', status: 'open', priority: 'low', assignedRecruiters: JSON.stringify([]), deadline: '2025-09-15' } }),
    prisma.jobRequirement.create({ data: { id: 'req-6', clientId: 'client-6', title: 'Python Data Engineer', description: 'Data engineer skilled in Python, Spark, and data pipeline development.', skills: JSON.stringify(['Python', 'Apache Spark', 'SQL', 'Airflow', 'AWS']), experience: '4-7 years', positions: 3, filledPositions: 0, location: 'Bangalore', salaryRange: '₹16-24 LPA', status: 'open', priority: 'high', assignedRecruiters: JSON.stringify(['user-5']), deadline: '2025-08-20' } }),
    prisma.jobRequirement.create({ data: { id: 'req-7', clientId: 'client-2', title: 'QA Automation Engineer', description: 'QA engineer with Selenium, Cypress, and API testing experience.', skills: JSON.stringify(['Selenium', 'Cypress', 'REST API Testing', 'Java']), experience: '2-4 years', positions: 2, filledPositions: 2, location: 'Hyderabad', salaryRange: '₹8-14 LPA', status: 'closed', priority: 'medium', assignedRecruiters: JSON.stringify(['user-5']), deadline: '2025-06-30' } }),
  ]);
  console.log(`✅ Created ${requirements.length} requirements`);

  // ==================== CANDIDATES ====================
  const candidates = await Promise.all([
    prisma.candidate.create({ data: { id: 'cand-1', name: 'Arjun Krishnan', email: 'arjun.k@gmail.com', phone: '+91 99876 11111', skills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'GraphQL']), experience: '6 years', education: 'B.Tech Computer Science, IIT Madras', currentCompany: 'Infosys', currentRole: 'Senior Developer', expectedSalary: '₹22 LPA', location: 'Bangalore', status: 'shortlisted', appliedFor: 'req-1' } }),
    prisma.candidate.create({ data: { id: 'cand-2', name: 'Neha Sharma', email: 'neha.s@gmail.com', phone: '+91 99876 22222', skills: JSON.stringify(['MongoDB', 'Express', 'React', 'Node.js', 'Python']), experience: '4 years', education: 'MCA, Delhi University', currentCompany: 'TCS', currentRole: 'Full Stack Developer', expectedSalary: '₹16 LPA', location: 'Delhi', status: 'interview_scheduled', appliedFor: 'req-2' } }),
    prisma.candidate.create({ data: { id: 'cand-3', name: 'Sanjay Gupta', email: 'sanjay.g@gmail.com', phone: '+91 99876 33333', skills: JSON.stringify(['Java', 'Spring Boot', 'Microservices', 'AWS', 'Docker']), experience: '5 years', education: 'B.E. IT, BITS Pilani', currentCompany: 'Wipro', currentRole: 'Backend Developer', expectedSalary: '₹20 LPA', location: 'Mumbai', status: 'new', appliedFor: 'req-3' } }),
    prisma.candidate.create({ data: { id: 'cand-4', name: 'Ritu Desai', email: 'ritu.d@gmail.com', phone: '+91 99876 44444', skills: JSON.stringify(['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'AWS']), experience: '4 years', education: 'B.Tech CS, NIT Trichy', currentCompany: 'Cognizant', currentRole: 'DevOps Engineer', expectedSalary: '₹18 LPA', location: 'Chennai', status: 'selected', appliedFor: 'req-4' } }),
    prisma.candidate.create({ data: { id: 'cand-5', name: 'Manish Tiwari', email: 'manish.t@gmail.com', phone: '+91 99876 55555', skills: JSON.stringify(['React', 'Next.js', 'TypeScript', 'Tailwind CSS']), experience: '7 years', education: 'M.Tech CS, IISc Bangalore', currentCompany: 'Flipkart', currentRole: 'Senior Frontend Engineer', expectedSalary: '₹28 LPA', location: 'Bangalore', status: 'offered', appliedFor: 'req-1' } }),
    prisma.candidate.create({ data: { id: 'cand-6', name: 'Swathi Iyer', email: 'swathi.i@gmail.com', phone: '+91 99876 66666', skills: JSON.stringify(['Python', 'Apache Spark', 'SQL', 'Airflow', 'GCP']), experience: '5 years', education: 'B.Tech CS, VIT', currentCompany: 'Amazon', currentRole: 'Data Engineer', expectedSalary: '₹24 LPA', location: 'Hyderabad', status: 'new', appliedFor: 'req-6' } }),
    prisma.candidate.create({ data: { id: 'cand-7', name: 'Rohit Malhotra', email: 'rohit.m@gmail.com', phone: '+91 99876 77777', skills: JSON.stringify(['Selenium', 'Cypress', 'API Testing', 'Java', 'Python']), experience: '3 years', education: 'B.Tech IT, Anna University', currentCompany: 'HCL', currentRole: 'QA Engineer', expectedSalary: '₹12 LPA', location: 'Hyderabad', status: 'joined', appliedFor: 'req-7' } }),
    prisma.candidate.create({ data: { id: 'cand-8', name: 'Preethi Rajan', email: 'preethi.r@gmail.com', phone: '+91 99876 88888', skills: JSON.stringify(['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'HTML/CSS']), experience: '3 years', education: 'B.Des, NID Ahmedabad', currentCompany: 'Freshworks', currentRole: 'UI/UX Designer', expectedSalary: '₹14 LPA', location: 'Chennai', status: 'new', appliedFor: 'req-5' } }),
    prisma.candidate.create({ data: { id: 'cand-9', name: 'Kiran Naidu', email: 'kiran.n@gmail.com', phone: '+91 99876 99999', skills: JSON.stringify(['React', 'Vue.js', 'Node.js', 'PostgreSQL']), experience: '4 years', education: 'B.Tech CS, JNTU', currentCompany: 'Accenture', currentRole: 'Software Engineer', expectedSalary: '₹15 LPA', location: 'Hyderabad', status: 'interviewed', appliedFor: 'req-2' } }),
    prisma.candidate.create({ data: { id: 'cand-10', name: 'Divya Krishnamurthy', email: 'divya.k@gmail.com', phone: '+91 99876 10101', skills: JSON.stringify(['Java', 'Kotlin', 'Spring Boot', 'Microservices']), experience: '6 years', education: 'M.Tech, IIT Bombay', currentCompany: 'Razorpay', currentRole: 'Senior Backend Developer', expectedSalary: '₹25 LPA', location: 'Bangalore', status: 'shortlisted', appliedFor: 'req-3' } }),
  ]);
  console.log(`✅ Created ${candidates.length} candidates`);

  // ==================== INTERVIEWS ====================
  const interviews = await Promise.all([
    prisma.interview.create({ data: { id: 'int-1', candidateId: 'cand-2', requirementId: 'req-2', interviewerId: 'user-6', scheduledAt: '2025-07-05T10:00:00', duration: 60, type: 'technical', status: 'scheduled' } }),
    prisma.interview.create({ data: { id: 'int-2', candidateId: 'cand-1', requirementId: 'req-1', interviewerId: 'user-6', scheduledAt: '2025-07-03T14:00:00', duration: 45, type: 'technical', status: 'scheduled' } }),
    prisma.interview.create({ data: { id: 'int-3', candidateId: 'cand-5', requirementId: 'req-1', interviewerId: 'user-6', scheduledAt: '2025-06-20T11:00:00', duration: 60, type: 'technical', status: 'completed', feedback: 'Excellent technical skills, strong system design knowledge. Highly recommended.', rating: 5, recommendation: 'select' } }),
    prisma.interview.create({ data: { id: 'int-4', candidateId: 'cand-4', requirementId: 'req-4', interviewerId: 'user-6', scheduledAt: '2025-06-22T15:00:00', duration: 45, type: 'technical', status: 'completed', feedback: 'Good knowledge of CI/CD and cloud platforms. Can improve on Kubernetes.', rating: 4, recommendation: 'select' } }),
    prisma.interview.create({ data: { id: 'int-5', candidateId: 'cand-9', requirementId: 'req-2', interviewerId: 'user-6', scheduledAt: '2025-06-25T10:30:00', duration: 60, type: 'technical', status: 'completed', feedback: 'Average technical skills. Needs more experience with backend systems.', rating: 3, recommendation: 'hold' } }),
    prisma.interview.create({ data: { id: 'int-6', candidateId: 'cand-7', requirementId: 'req-7', interviewerId: 'user-6', scheduledAt: '2025-05-15T09:00:00', duration: 45, type: 'technical', status: 'completed', feedback: 'Strong automation skills, good knowledge of testing frameworks.', rating: 4, recommendation: 'select' } }),
  ]);
  console.log(`✅ Created ${interviews.length} interviews`);

  // ==================== PLACEMENTS ====================
  const placements = await Promise.all([
    prisma.placement.create({ data: { id: 'plc-1', candidateId: 'cand-5', requirementId: 'req-1', clientId: 'client-1', position: 'Senior React Developer', salary: '₹25 LPA', joiningDate: '2025-07-15', status: 'offer_accepted' } }),
    prisma.placement.create({ data: { id: 'plc-2', candidateId: 'cand-4', requirementId: 'req-4', clientId: 'client-4', position: 'DevOps Engineer', salary: '₹18 LPA', joiningDate: '2025-07-20', status: 'joining_confirmed' } }),
    prisma.placement.create({ data: { id: 'plc-3', candidateId: 'cand-7', requirementId: 'req-7', clientId: 'client-2', position: 'QA Automation Engineer', salary: '₹12 LPA', joiningDate: '2025-06-15', status: 'joined' } }),
  ]);
  console.log(`✅ Created ${placements.length} placements`);

  // ==================== NOTIFICATIONS ====================
  const notifications = await Promise.all([
    prisma.notification.create({ data: { userId: 'user-5', title: 'New Requirement Assigned', message: 'You have been assigned to "Python Data Engineer" requirement by CloudNine Infra.', type: 'info', isRead: false, link: '/requirements' } }),
    prisma.notification.create({ data: { userId: 'user-6', title: 'Interview Scheduled', message: 'Interview with Neha Sharma for Full Stack Engineer role on July 5, 2025.', type: 'info', isRead: false, link: '/interviews' } }),
    prisma.notification.create({ data: { userId: 'user-7', title: 'Candidate Selected', message: 'Ritu Desai has been selected for DevOps Engineer at HealthPlus Systems.', type: 'success', isRead: false, link: '/placements' } }),
    prisma.notification.create({ data: { userId: 'user-1', title: 'Monthly Report Ready', message: 'June 2025 recruitment report is ready for review.', type: 'info', isRead: true, link: '/reports' } }),
    prisma.notification.create({ data: { userId: 'user-3', title: 'Requirement Deadline Approaching', message: 'Full Stack Engineer requirement deadline is July 30, 2025.', type: 'warning', isRead: false, link: '/requirements' } }),
  ]);
  console.log(`✅ Created ${notifications.length} notifications`);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
