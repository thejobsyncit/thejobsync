export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

export interface DescriptiveQuestion {
  id: number;
  question: string;
  category: string;
  keyPoints: string[];
  sampleAnswer: string;
  codeSnippet?: string;
}

export type Question = MCQQuestion | DescriptiveQuestion;

// ============================================================================
// 1. EASY LEVEL: 50+ MCQ QUESTIONS
// ============================================================================
export const EASY_MCQ_QUESTIONS: MCQQuestion[] = [
  // QA & Testing Questions (Dedicated)
  {
    id: 101,
    category: 'QA & Software Testing',
    question: 'What is the main purpose of Regression Testing in software QA?',
    options: ['To test new features only', 'To ensure recent code changes have not broken existing functionality', 'To check server load capacity', 'To format user interface layout'],
    correctAnswer: 1,
    explanation: 'Regression testing verifies that recent code updates have not introduced bugs into previously working features.'
  },
  {
    id: 102,
    category: 'QA & Software Testing',
    question: 'In software testing, what is the difference between Severity and Priority?',
    options: ['Severity is about technical impact; Priority is about business urgency', 'Severity is set by the client; Priority is set by developers', 'They mean the exact same thing', 'Priority measures code line count'],
    correctAnswer: 0,
    explanation: 'Severity measures how catastrophic a bug is technically; Priority determines how quickly it must be fixed for business.'
  },
  {
    id: 103,
    category: 'QA & Software Testing',
    question: 'Which testing technique tests input values at the extreme ends of allowed ranges?',
    options: ['Equivalence Partitioning', 'Boundary Value Analysis (BVA)', 'Exploratory Testing', 'Ad-hoc Testing'],
    correctAnswer: 1,
    explanation: 'Boundary Value Analysis tests min, max, just below, and just above valid boundary limits.'
  },
  {
    id: 104,
    category: 'QA & Software Testing',
    question: 'What is Black-Box Testing?',
    options: ['Testing internal source code logic directly', 'Testing software functionality without knowing internal code structure', 'Testing server hardware components', 'Testing database indexing speeds'],
    correctAnswer: 1,
    explanation: 'Black-Box testing evaluates software behavior strictly based on inputs and outputs without seeing source code.'
  },

  // Web & Frontend
  {
    id: 1,
    category: 'Frontend & Web Development',
    question: 'In React, what hook is used to handle side effects such as data fetching or subscriptions?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correctAnswer: 1,
    explanation: 'useEffect handles side effects after rendering, such as API fetching and DOM mutations.'
  },
  {
    id: 2,
    category: 'Frontend & Web Development',
    question: 'Which HTML5 element is used to render dynamic 2D and 3D graphics on the fly via scripting?',
    options: ['<svg>', '<canvas>', '<graphics>', '<draw>'],
    correctAnswer: 1,
    explanation: '<canvas> provides a resolution-dependent bitmap canvas for dynamic JavaScript graphics.'
  },
  {
    id: 3,
    category: 'Frontend & Web Development',
    question: 'What is the default value of the `position` CSS property for HTML elements?',
    options: ['relative', 'absolute', 'static', 'fixed'],
    correctAnswer: 2,
    explanation: 'HTML elements are positioned static by default according to the normal flow of the page.'
  },
  {
    id: 4,
    category: 'Frontend & Web Development',
    question: 'In JavaScript, which method converts a JSON object string into a JavaScript object?',
    options: ['JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'JSON.convert()'],
    correctAnswer: 1,
    explanation: 'JSON.parse() parses a JSON string into a native JavaScript object.'
  },
  {
    id: 5,
    category: 'Frontend & Web Development',
    question: 'Which HTTP header is commonly used to send JWT authorization tokens to a server?',
    options: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    correctAnswer: 1,
    explanation: 'Authorization header (e.g. Bearer <token>) is standard for sending authentication tokens.'
  },
  {
    id: 6,
    category: 'Frontend & Web Development',
    question: 'What does CSS Flexbox `justify-content: center` do?',
    options: ['Aligns items along the cross axis', 'Aligns flex items along the main axis in the center', 'Distributes items with equal space around', 'Wraps items to next line'],
    correctAnswer: 1,
    explanation: 'justify-content aligns items along the main axis of a flex container.'
  },
  {
    id: 7,
    category: 'Frontend & Web Development',
    question: 'In TypeScript, which keyword is used to create a new type alias for primitive or object types?',
    options: ['interface', 'type', 'declare', 'module'],
    correctAnswer: 1,
    explanation: 'The `type` keyword creates a type alias in TypeScript.'
  },
  {
    id: 8,
    category: 'Frontend & Web Development',
    question: 'Which method adds one or more elements to the END of an array in JavaScript?',
    options: ['push()', 'pop()', 'unshift()', 'shift()'],
    correctAnswer: 0,
    explanation: 'push() adds items to the end of an array, while unshift() adds to the beginning.'
  },
  {
    id: 9,
    category: 'Frontend & Web Development',
    question: 'What is Virtual DOM in React?',
    options: ['A direct copy of the browser DOM rendered in WebGL', 'An in-memory lightweight representation of the real DOM tree', 'A database index inside the browser', 'A CSS preprocessing tool'],
    correctAnswer: 1,
    explanation: 'Virtual DOM is an in-memory representation used by React to compute efficient DOM updates.'
  },
  {
    id: 10,
    category: 'Frontend & Web Development',
    question: 'Which status code indicates a successful HTTP request with content returned?',
    options: ['200 OK', '201 Created', '301 Moved Permanently', '404 Not Found'],
    correctAnswer: 0,
    explanation: '200 OK indicates standard success for HTTP requests.'
  },

  // Programming & DSA
  {
    id: 11,
    category: 'Data Structures & Algorithms',
    question: 'Which data structure operates on a First-In, First-Out (FIFO) basis?',
    options: ['Stack', 'Queue', 'Binary Tree', 'Heap'],
    correctAnswer: 1,
    explanation: 'Queue processes elements in FIFO order (first item added is first item removed).'
  },
  {
    id: 12,
    category: 'Data Structures & Algorithms',
    question: 'What is the time complexity of searching an element in a sorted array using Binary Search?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctAnswer: 2,
    explanation: 'Binary Search halves the search space each step, yielding logarithmic time O(log n).'
  },
  {
    id: 13,
    category: 'Data Structures & Algorithms',
    question: 'Which data structure uses LIFO (Last-In, First-Out) ordering?',
    options: ['Queue', 'Stack', 'Linked List', 'Graph'],
    correctAnswer: 1,
    explanation: 'Stack operates on LIFO principles (like a stack of plates).'
  },
  {
    id: 14,
    category: 'Data Structures & Algorithms',
    question: 'What is the worst-case time complexity of QuickSort?',
    options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(1)'],
    correctAnswer: 1,
    explanation: 'Worst-case QuickSort is O(n^2) when poor pivots (e.g. already sorted array) are selected.'
  },
  {
    id: 15,
    category: 'Data Structures & Algorithms',
    question: 'Which data structure consists of nodes where each node points to the next node in sequence?',
    options: ['Array', 'Singly Linked List', 'Hash Table', 'Matrix'],
    correctAnswer: 1,
    explanation: 'A Singly Linked List contains nodes with data and a pointer to the next node.'
  },
  {
    id: 16,
    category: 'Data Structures & Algorithms',
    question: 'In a Hash Table, what is a collision?',
    options: ['When two keys compute to the same array index', 'When a key is deleted permanently', 'When memory buffer overflows', 'When database locks up'],
    correctAnswer: 0,
    explanation: 'A collision occurs when two distinct keys map to the same hash bucket index.'
  },
  {
    id: 17,
    category: 'Data Structures & Algorithms',
    question: 'Which algorithm is commonly used to find the shortest path in a weighted graph without negative edges?',
    options: ['Dijkstra’s Algorithm', 'Bubble Sort', 'Depth-First Search (DFS)', 'Kruskal’s Algorithm'],
    correctAnswer: 0,
    explanation: 'Dijkstra’s algorithm computes the shortest path in non-negative weighted graphs.'
  },
  {
    id: 18,
    category: 'Data Structures & Algorithms',
    question: 'What is recursion in programming?',
    options: ['A function calling another unrelated function', 'A function calling itself until a base condition is met', 'Executing loops infinitely', 'Compiling code to machine code'],
    correctAnswer: 1,
    explanation: 'Recursion is when a function invokes itself to solve smaller subproblems.'
  },
  {
    id: 19,
    category: 'Data Structures & Algorithms',
    question: 'What is the space complexity of an in-place sorting algorithm like Bubble Sort?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
    correctAnswer: 0,
    explanation: 'In-place sorting algorithm requires only O(1) auxiliary memory.'
  },
  {
    id: 20,
    category: 'Data Structures & Algorithms',
    question: 'In a Binary Search Tree (BST), where are smaller elements located relative to a node?',
    options: ['In the right subtree', 'In the left subtree', 'At the root only', 'Randomly distributed'],
    correctAnswer: 1,
    explanation: 'In a BST, all keys in the left subtree are smaller than the node key.'
  },

  // Databases & SQL
  {
    id: 21,
    category: 'Database & SQL',
    question: 'Which SQL clause is used to filter records after aggregation with GROUP BY?',
    options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'],
    correctAnswer: 1,
    explanation: 'HAVING filters groups after aggregate calculations, unlike WHERE which filters individual rows.'
  },
  {
    id: 22,
    category: 'Database & SQL',
    question: 'What does ACID stand for in database transactions?',
    options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Index, Data', 'Application, Client, Integration, Deployment', 'Automated, Concurrent, Internal, Distributed'],
    correctAnswer: 0,
    explanation: 'ACID guarantees reliable processing of database transactions.'
  },
  {
    id: 23,
    category: 'Database & SQL',
    question: 'Which JOIN returns all records from the left table and matched records from the right table?',
    options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
    correctAnswer: 1,
    explanation: 'LEFT JOIN returns all rows from the left table regardless of right table matches.'
  },
  {
    id: 24,
    category: 'Database & SQL',
    question: 'What is a Foreign Key in relational databases?',
    options: ['A key that uniquely identifies a row in its own table', 'A field in one table that refers to the Primary Key of another table', 'An encrypted database password', 'A index used for full-text search'],
    correctAnswer: 1,
    explanation: 'A Foreign Key enforces referential integrity between two relational tables.'
  },
  {
    id: 25,
    category: 'Database & SQL',
    question: 'In SQL, which command is used to remove a table structure and all its data completely?',
    options: ['DELETE TABLE', 'TRUNCATE TABLE', 'DROP TABLE', 'REMOVE TABLE'],
    correctAnswer: 2,
    explanation: 'DROP TABLE removes the table definition and all data from the database schema.'
  },
  {
    id: 26,
    category: 'Database & SQL',
    question: 'What type of database is MongoDB?',
    options: ['Relational SQL Database', 'Document-oriented NoSQL Database', 'Graph Database', 'Key-Value Memory Store'],
    correctAnswer: 1,
    explanation: 'MongoDB stores data in flexible, JSON-like BSON documents.'
  },
  {
    id: 27,
    category: 'Database & SQL',
    question: 'Which SQL statement is used to modify existing records in a table?',
    options: ['UPDATE', 'CHANGE', 'MODIFY', 'ALTER'],
    correctAnswer: 0,
    explanation: 'UPDATE is used to modify values in existing rows of a database table.'
  },
  {
    id: 28,
    category: 'Database & SQL',
    question: 'What is the primary benefit of Database Indexing?',
    options: ['Increases write speed for INSERT statements', 'Speeds up SELECT data retrieval queries', 'Reduces storage disk usage', 'Prevents SQL injection attacks'],
    correctAnswer: 1,
    explanation: 'Indexes create fast lookup data structures to dramatically speed up SELECT queries.'
  },
  {
    id: 29,
    category: 'Database & SQL',
    question: 'In Prisma ORM, which file defines the models, fields, and database connection settings?',
    options: ['prisma.json', 'schema.prisma', 'database.config.ts', 'models.prisma'],
    correctAnswer: 1,
    explanation: '`schema.prisma` is the central configuration file for Prisma schemas.'
  },
  {
    id: 30,
    category: 'Database & SQL',
    question: 'Which constraint ensures that all values in a database column are distinct?',
    options: ['NOT NULL', 'UNIQUE', 'CHECK', 'PRIMARY KEY'],
    correctAnswer: 1,
    explanation: 'The UNIQUE constraint ensures no duplicate values exist in a column.'
  },

  // Backend & Languages
  {
    id: 31,
    category: 'Backend Development',
    question: 'What is Node.js?',
    options: ['A client-side JavaScript framework', 'A JavaScript runtime built on Chrome’s V8 JavaScript engine', 'A relational database engine', 'A CSS styling library'],
    correctAnswer: 1,
    explanation: 'Node.js allows executing JavaScript on the server side using the V8 engine.'
  },
  {
    id: 32,
    category: 'Backend Development',
    question: 'In Python, which built-in data type is immutable?',
    options: ['List', 'Dictionary', 'Set', 'Tuple'],
    correctAnswer: 3,
    explanation: 'Tuples in Python cannot be modified after creation (immutable).'
  },
  {
    id: 33,
    category: 'Backend Development',
    question: 'In Java, which keyword prevents a method from being overridden by a subclass?',
    options: ['static', 'final', 'abstract', 'protected'],
    correctAnswer: 1,
    explanation: 'Marking a method `final` prevents child classes from overriding it.'
  },
  {
    id: 34,
    category: 'Backend Development',
    question: 'What does NPM stand for in Node.js ecosystem?',
    options: ['Node Package Manager', 'New Programming Module', 'Network Protocol Method', 'Node Process Monitor'],
    correctAnswer: 0,
    explanation: 'NPM is the official package manager for Node.js.'
  },
  {
    id: 35,
    category: 'Backend Development',
    question: 'In Express.js, what is middleware?',
    options: ['Functions that access request, response objects and the next middleware function', 'Database driver libraries', 'Frontend HTML rendering engines', 'Network routing hardware'],
    correctAnswer: 0,
    explanation: 'Middleware functions execute during the request-response cycle in Express.'
  },
  {
    id: 36,
    category: 'Backend Development',
    question: 'In Python, what does PIP stand for?',
    options: ['Preferred Installer Program', 'Python Interface Package', 'Process Integration Protocol', 'Program Instruction Parsing'],
    correctAnswer: 0,
    explanation: 'PIP is the standard package management system used to install Python packages.'
  },
  {
    id: 37,
    category: 'Backend Development',
    question: 'Which status code indicates an Unauthorized HTTP request due to missing credentials?',
    options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '500 Internal Server Error'],
    correctAnswer: 1,
    explanation: '401 Unauthorized means the request lacks valid authentication credentials.'
  },
  {
    id: 38,
    category: 'Backend Development',
    question: 'In Java, what is the parent class of all classes?',
    options: ['java.lang.System', 'java.lang.Object', 'java.util.BaseClass', 'java.lang.Root'],
    correctAnswer: 1,
    explanation: '`java.lang.Object` is the root of the class hierarchy in Java.'
  },
  {
    id: 39,
    category: 'Backend Development',
    question: 'What is CORS in web API development?',
    options: ['Cross-Origin Resource Sharing', 'Central Operational Routing Service', 'Client Object Retrieval System', 'Code Optimization Review Process'],
    correctAnswer: 0,
    explanation: 'CORS is a browser security mechanism restricting cross-domain HTTP requests.'
  },
  {
    id: 40,
    category: 'Backend Development',
    question: 'Which environment variable file format is standard for storing local secret keys in Next.js/Node projects?',
    options: ['.config', '.env', '.json', '.yaml'],
    correctAnswer: 1,
    explanation: '.env files store environment variables securely.'
  },

  // HR, Sales & Non-Technical Skills
  {
    id: 41,
    category: 'HR & Management',
    question: 'What does KPI stand for in employee performance reviews?',
    options: ['Key Performance Indicator', 'Knowledge Process Integration', 'Key Personnel Incentive', 'Known Project Index'],
    correctAnswer: 0,
    explanation: 'KPIs measure individual or organizational performance against target goals.'
  },
  {
    id: 42,
    category: 'HR & Management',
    question: 'What is the primary purpose of an exit interview when an employee resigns?',
    options: ['To convince the employee to stay at all costs', 'To gather feedback on company culture & improvement areas', 'To issue legal notices', 'To assign new project tasks'],
    correctAnswer: 1,
    explanation: 'Exit interviews gather honest feedback to improve workplace retention and culture.'
  },
  {
    id: 43,
    category: 'HR & Management',
    question: 'What does ATS stand for in recruitment software systems?',
    options: ['Applicant Tracking System', 'Automated Testing Suite', 'Active Team Scheduler', 'Application Transfer Server'],
    correctAnswer: 0,
    explanation: 'ATS manages job postings and screens candidate resumes automatically.'
  },
  {
    id: 44,
    category: 'HR & Management',
    question: 'Which method is effective for active listening during team discussions?',
    options: ['Interrupting immediately when you disagree', 'Paraphrasing key points to confirm understanding', 'Multitasking on your phone', 'Formulating arguments while others talk'],
    correctAnswer: 1,
    explanation: 'Paraphrasing and clarifying demonstrates active listening and mutual understanding.'
  },
  {
    id: 45,
    category: 'HR & Management',
    question: 'What is the STAR technique used for in behavioral interview responses?',
    options: ['Situation, Task, Action, Result', 'Strategy, Team, Analysis, Report', 'Solution, Time, Agreement, Review', 'Scope, Testing, Automation, Release'],
    correctAnswer: 0,
    explanation: 'STAR structures behavioral interview answers logically.'
  },
  {
    id: 46,
    category: 'HR & Management',
    question: 'What does SLA stand for in service management?',
    options: ['Service Level Agreement', 'System Logistics Application', 'Software License Approval', 'Scheduled Lead Activity'],
    correctAnswer: 0,
    explanation: 'SLA defines expected delivery timeframes and service standards.'
  },
  {
    id: 47,
    category: 'HR & Management',
    question: 'How should workplace conflict between two team members be handled by a lead?',
    options: ['Ignore it completely', 'Listen to both sides neutrally and facilitate a solution', 'Publicly reprimand both members', 'Side with the senior employee'],
    correctAnswer: 1,
    explanation: 'Neutral mediation and structured discussion help resolve team conflicts constructively.'
  },
  {
    id: 48,
    category: 'HR & Management',
    question: 'What is the purpose of Agile daily stand-up meetings?',
    options: ['To conduct detailed performance reviews', 'To sync on daily progress, plans, and blockers (15 mins)', 'To write code together', 'To assign monthly salaries'],
    correctAnswer: 1,
    explanation: 'Daily stand-ups keep teams aligned on short-term tasks and immediate blockers.'
  },
  {
    id: 49,
    category: 'HR & Management',
    question: 'Which document formally outlines employee compensation, benefits, and start date?',
    options: ['Job Description', 'Offer Letter', 'NDA', 'Performance Review Sheet'],
    correctAnswer: 1,
    explanation: 'An Offer Letter details official employment terms, role title, and compensation.'
  },
  {
    id: 50,
    category: 'HR & Management',
    question: 'What does SMART criteria stand for in professional goal setting?',
    options: ['Specific, Measurable, Achievable, Relevant, Time-bound', 'Simple, Modern, Actionable, Rapid, Tactical', 'Strategic, Mandatory, Automated, Reliable, Tested', 'Systematic, Managed, Aligned, Robust, Timely'],
    correctAnswer: 0,
    explanation: 'SMART goals ensure clear targets and accountability.'
  }
];

// ============================================================================
// 2. MEDIUM LEVEL: 25 DESCRIPTIVE QUESTIONS
// ============================================================================
export const MEDIUM_DESCRIPTIVE_QUESTIONS: DescriptiveQuestion[] = [
  {
    id: 101,
    category: 'QA & Testing Strategy',
    question: 'How do you create a Test Strategy & Test Plan for a new web feature? What key sections must be included?',
    keyPoints: ['Scope of testing (In-scope vs Out-of-scope)', 'Test deliverables & bug reporting workflows', 'Test environments & tooling (Postman, Selenium, Playwright)', 'Entry and Exit Criteria'],
    sampleAnswer: 'I define the Scope, Strategy, Resource Allocation, Test Environment Setup, Test Data requirements, and Risk Management. The plan details Entry/Exit criteria and defect severity classifications.'
  },
  {
    id: 1,
    category: 'System Integration & API Design',
    question: 'Explain how you design a RESTful API for a high-traffic e-commerce platform. What headers, status codes, and error handling patterns do you enforce?',
    keyPoints: ['Use standard HTTP verbs (GET, POST, PUT, DELETE)', 'Stateless JWT/OAuth header authentication', 'Consistent JSON error response formats (e.g. status, error, timestamp)', 'Proper status code usage (200, 201, 400, 401, 404, 500)'],
    sampleAnswer: 'I structure REST APIs using noun-based endpoints (e.g. /api/v1/orders). Requests require Bearer JWT headers for auth. Responses return standard JSON structures with proper HTTP status codes.'
  },
  {
    id: 2,
    category: 'Database Optimization & Performance',
    question: 'When a database query on a table with millions of rows becomes slow, what systematic steps do you take to profile and optimize it?',
    keyPoints: ['EXPLAIN / EXPLAIN ANALYZE query execution plans', 'Identify missing indexes on WHERE / JOIN / ORDER BY columns', 'Avoid SELECT * and retrieve only necessary fields', 'Implement Redis caching or database read replicas'],
    sampleAnswer: 'First, I run EXPLAIN ANALYZE to check table scans. I create B-tree indexes on frequently queried columns, reduce unnecessary column fetches, and apply caching for static data using Redis.'
  },
  {
    id: 3,
    category: 'Frontend State & Rendering Performance',
    question: 'In a React / Next.js application, how do you prevent unnecessary component re-renders when dealing with complex global state?',
    keyPoints: ['React.memo for component memoization', 'useCallback and useMemo for stable references', 'Lifting state down or using context slices', 'Zustand / Redux Toolkit for atomic state updates'],
    sampleAnswer: 'I use React.memo to wrap pure components, memoize callbacks with useCallback, and split global contexts into smaller granular providers so components only re-render when relevant state slices change.'
  },
  {
    id: 4,
    category: 'Authentication & Security',
    question: 'Explain the difference between Session-based authentication and JWT token-based authentication. When would you prefer one over the other?',
    keyPoints: ['Sessions store state on server memory/Redis', 'JWTs are stateless and verified via signature key', 'JWTs scale better across decoupled microservices', 'Sessions offer instant server-side revocation control'],
    sampleAnswer: 'Session auth stores session IDs on the server database, allowing instant logout revocation. JWT is stateless and self-contained, making it ideal for scalable microservices.'
  },
  {
    id: 5,
    category: 'Conflict Resolution & Team Management',
    question: 'Describe a situation where two senior team members had conflicting technical approaches for a project. How would you mediate to make the best decision?',
    keyPoints: ['Active objective listening', 'Define clear evaluation criteria (performance, timeline, maintainability)', 'Conduct a Proof of Concept (PoC) or benchmark comparison', 'Document decision rationale via Architecture Decision Records (ADR)'],
    sampleAnswer: 'I bring both team members together to evaluate both approaches against objective criteria: performance, maintainability, and delivery risk. If needed, we run a short PoC spike.'
  },
  {
    id: 6,
    category: 'DevOps & CI/CD Pipelines',
    question: 'What steps should be included in a robust automated CI/CD pipeline before deploying code changes to production?',
    keyPoints: ['Linting & static code analysis', 'Unit and integration automated tests', 'Build compilation and Docker containerization', 'Security vulnerability scanning (SAST/DAST)', 'Staging smoke tests before production rollout'],
    sampleAnswer: 'A robust CI/CD pipeline triggers on PR creation: running linters, automated unit/integration tests, vulnerability scanners, building immutable Docker images, and deploying to staging.'
  },
  {
    id: 7,
    category: 'Agile Methodology',
    question: 'How do you handle scope creep when a client or stakeholder requests major unexpected changes midway through a sprint?',
    keyPoints: ['Acknowledge request without making immediate promises', 'Evaluate impact on current sprint capacity and backlog priorities', 'Present trade-offs to product manager / client (swap items vs delay target date)', 'Update Jira/backlog documentation transparently'],
    sampleAnswer: 'I assess the impact on current sprint commitments with the team. I then communicate the trade-offs clearly to the stakeholder: we can either swap out an existing story or move the new request to the next sprint.'
  },
  {
    id: 8,
    category: 'Data Engineering & Processing',
    question: 'What is the difference between ETL (Extract, Transform, Load) and ELT (Extract, Load, Transform)? When is ELT preferred?',
    keyPoints: ['ETL transforms data before loading into target warehouse', 'ELT loads raw data first, leveraging cloud warehouse processing power (Snowflake, BigQuery)', 'ELT is preferred for modern big data pipelines due to cloud scalability'],
    sampleAnswer: 'In ETL, data is transformed in a staging server before loading. In ELT, raw data is loaded directly into cloud data warehouses like BigQuery or Snowflake.'
  },
  {
    id: 9,
    category: 'Software Testing & QA',
    question: 'What is the difference between Unit Testing, Integration Testing, and End-to-End (E2E) Testing? How do you maintain the testing pyramid balance?',
    keyPoints: ['Unit tests check isolated functions/modules quickly', 'Integration tests verify component/API interaction', 'E2E tests simulate full user browser workflows (Cypress/Playwright)', 'Maintain 70% unit, 20% integration, 10% E2E ratio'],
    sampleAnswer: 'Unit tests check individual code logic fast. Integration tests ensure services and databases communicate correctly. E2E tests validate complete user journeys.'
  },
  {
    id: 10,
    category: 'Client Relationship & Stakeholder Management',
    question: 'How do you handle an unhappy client who complains about a missed project milestone?',
    keyPoints: ['Listen actively without being defensive', 'Take ownership and provide a clear Root Cause Analysis (RCA)', 'Present an immediate recovery timeline and actionable milestones', 'Set up daily/weekly transparent status updates'],
    sampleAnswer: 'I start by listening to their concerns calmly. I provide a clear RCA explaining what caused the delay, outline an updated recovery plan with milestones, and schedule frequent progress updates.'
  },
  {
    id: 11,
    category: 'Web Security (OWASP Top 10)',
    question: 'What is Cross-Site Scripting (XSS) and how do you protect web applications against it?',
    keyPoints: ['XSS occurs when malicious scripts are injected into web pages', 'Sanitize and encode user input before rendering', 'Use Content Security Policy (CSP) HTTP headers', 'Store sensitive JWT tokens in HttpOnly cookies'],
    sampleAnswer: 'XSS happens when untrusted user input is rendered without sanitization. Prevention includes escaping HTML input, utilizing CSP headers, and storing authentication tokens in secure HttpOnly cookies.'
  },
  {
    id: 12,
    category: 'Microservices & Distributed Systems',
    question: 'What is the Circuit Breaker pattern in microservices architecture, and why is it important?',
    keyPoints: ['Prevents cascading failures when a service is failing', 'Three states: Closed (normal), Open (failing/blocked), Half-Open (trial)', 'Returns graceful fallback responses quickly'],
    sampleAnswer: 'The Circuit Breaker pattern monitors calls to external services. If failures cross a threshold, the breaker opens, immediately returning fallbacks instead of overwhelming failing downstream services.'
  },
  {
    id: 13,
    category: 'Python & Data Structures',
    question: 'Explain the difference between deep copy and shallow copy in Python.',
    keyPoints: ['Shallow copy creates new object but references nested objects', 'Deep copy recursively duplicates all nested objects independently', 'Modifying nested objects in shallow copy affects the original'],
    sampleAnswer: 'A shallow copy copies object references for nested structures. A deep copy recursively copies every nested object, ensuring changes to the copy do not mutate the original data.'
  },
  {
    id: 14,
    category: 'Java & Multithreading',
    question: 'What is the difference between `synchronized` keyword and `ReentrantLock` in Java?',
    keyPoints: ['`synchronized` is implicit block-level locking', '`ReentrantLock` offers explicit lock/unlock, fairness policies, and tryLock with timeouts', 'ReentrantLock requires explicit unlock in a `finally` block'],
    sampleAnswer: '`synchronized` provides basic block locking managed by JVM. `ReentrantLock` gives advanced capabilities like non-blocking `tryLock()` and interruptible locks.'
  },
  {
    id: 15,
    category: 'Project Management & Risk Assessment',
    question: 'How do you perform a project risk assessment before initiating a major software overhaul?',
    keyPoints: ['Identify technical, resource, and schedule risks', 'Assess probability and severity impact matrix', 'Formulate mitigation and contingency fallback plans', 'Review risk log regularly with project sponsors'],
    sampleAnswer: 'I identify technical debt, team velocity, and third-party dependencies. I build a Risk Matrix rating likelihood and impact, establishing clear mitigation steps for high-risk items.'
  },
  {
    id: 16,
    category: 'Cloud Infrastructure & AWS',
    question: 'What is the difference between horizontal scaling (scaling out) and vertical scaling (scaling up)?',
    keyPoints: ['Vertical scaling adds more CPU/RAM to an existing instance', 'Horizontal scaling adds more instances/nodes to a pool behind a load balancer', 'Horizontal scaling provides higher fault tolerance and elasticity'],
    sampleAnswer: 'Vertical scaling increases single machine capacity (limits exist). Horizontal scaling adds multiple server nodes distributed behind an auto-scaling load balancer for infinite elasticity.'
  },
  {
    id: 17,
    category: 'HR Management & Hiring Strategy',
    question: 'How do you design a structured interview process to eliminate interviewer bias during candidate evaluation?',
    keyPoints: ['Define standardized scoring rubrics for all candidates', 'Ask standardized questions across all interviews', 'Use panel interview rounds with independent score submission', 'Conduct blind resume reviews for initial screening'],
    sampleAnswer: 'I implement structured scoring rubrics tied directly to job competencies. All candidates receive identical core questions, and interviewers record independent ratings before debriefing together.'
  },
  {
    id: 18,
    category: 'Database Architecture',
    question: 'Explain the CAP Theorem for distributed databases. What tradeoffs exist between Consistency, Availability, and Partition Tolerance?',
    keyPoints: ['A distributed system can only provide 2 of 3 guarantees simultaneously', 'CP (Consistency & Partition Tolerance) vs AP (Availability & Partition Tolerance)', 'Network partitions will inevitably occur in distributed environments'],
    sampleAnswer: 'CAP theorem states a distributed system can only guarantee two of Consistency, Availability, and Partition Tolerance. When network partitions occur, systems must choose between returning consistent data or remaining available.'
  },
  {
    id: 19,
    category: 'Caching Strategies',
    question: 'What are the differences between Cache-Aside (Lazy Loading) and Write-Through caching patterns?',
    keyPoints: ['Cache-Aside: Application reads from cache; on miss, loads from DB and populates cache', 'Write-Through: Data is written to cache and database simultaneously', 'Cache-Aside is resilient to cache failures; Write-Through ensures cache freshness'],
    sampleAnswer: 'In Cache-Aside, the app checks cache first and loads missing data from DB. In Write-Through, every DB write updates the cache first, ensuring high consistency at the expense of write latency.'
  },
  {
    id: 20,
    category: 'Sales & Business Development',
    question: 'How do you handle price resistance from a high-value prospective client during final contract negotiations?',
    keyPoints: ['Focus on ROI and value proposition rather than discounting', 'Offer flexible payment terms or staged feature phases', 'Highlight risk mitigation, SLAs, and premium support inclusions'],
    sampleAnswer: 'Instead of immediately discounting, I reframe discussions around business ROI and metrics. I offer phased implementation scope or flexible payment terms to align with their budget constraints.'
  },
  {
    id: 21,
    category: 'Software Maintenance & Refactoring',
    question: 'How do you approach refactoring a legacy codebase that lacks automated unit tests?',
    keyPoints: ['Write characterization / integration tests around existing behavior first', 'Refactor in small, incremental steps', 'Run automated test suites after every small change', 'Avoid rewriting the whole codebase at once'],
    sampleAnswer: 'I write high-level integration tests around existing legacy behaviors first to establish a safety net. Then I refactor incrementally in small PRs.'
  },
  {
    id: 22,
    category: 'System Design & WebSockets',
    question: 'How does real-time communication using WebSockets differ from HTTP Long Polling? When should each be used?',
    keyPoints: ['WebSockets provide full-duplex persistent TCP connections', 'Long polling sends HTTP requests that hang until server has data', 'WebSockets are lower latency and ideal for chat/live dashboards'],
    sampleAnswer: 'WebSockets establish a single persistent bidirectional TCP connection, perfect for low-latency live apps like chat. HTTP Long Polling opens repeated HTTP connections.'
  },
  {
    id: 23,
    category: 'Digital Marketing & Analytics',
    question: 'How do you calculate and optimize Customer Acquisition Cost (CAC) and Customer Lifetime Value (LTV)?',
    keyPoints: ['CAC = Total Marketing Spend / New Customers Acquired', 'LTV = Average Purchase Value x Purchase Frequency x Customer Lifespan', 'Target LTV:CAC ratio is 3:1 or higher for sustainable growth'],
    sampleAnswer: 'CAC measures acquisition cost, while LTV estimates total revenue generated by a customer over time. A healthy SaaS ratio is LTV:CAC >= 3:1.'
  },
  {
    id: 24,
    category: 'Incident Management & On-Call',
    question: 'What is your process for conducting a Blameless Post-Mortem after a major service outage?',
    keyPoints: ['Focus on process and system failures rather than individual blame', 'Document precise timeline of events', 'Identify root cause and contributing factors', 'Create actionable preventative tasks with clear assignees'],
    sampleAnswer: 'I focus on why systems and safeguards failed instead of pointing fingers. We construct an accurate timeline, identify root causes, and create prioritized engineering action items.'
  },
  {
    id: 25,
    category: 'Leadership & People Management',
    question: 'How do you mentor a junior engineer who is struggling with confidence and meeting task deadlines?',
    keyPoints: ['Break down large tasks into smaller manageable milestones', 'Provide frequent constructive feedback and pair programming sessions', 'Celebrate small wins to build confidence', 'Establish clear growth objectives'],
    sampleAnswer: 'I pair with them to break complex features into smaller tasks. We do regular pair-programming reviews, celebrate incremental wins, and provide safe environment feedback.'
  }
];

// ============================================================================
// 3. HARD / DIFFICULT LEVEL: 25 ADVANCED QUESTIONS
// ============================================================================
export const HARD_DIFFICULT_QUESTIONS: DescriptiveQuestion[] = [
  {
    id: 101,
    category: 'QA Automation & E2E Frameworks',
    question: 'Design a scalable End-to-End Automated Testing Framework for a microservices web application using Playwright / Cypress. How do you handle authentication state, parallel execution, and CI/CD reporting?',
    codeSnippet: `// Example Playwright Global Setup for Auth Reuse:
import { chromium, FullConfig } from '@playwright/test';
async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://app.example.com/login');
  await page.fill('#email', 'testuser@example.com');
  await page.fill('#password', 'SecurePass123');
  await page.click('#submit');
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}`,
    keyPoints: ['Global authentication storage state reuse to bypass login overhead', 'Page Object Model (POM) architecture', 'Parallel test sharding across CI worker nodes', 'Allure / HTML test artifact & video reports'],
    sampleAnswer: 'I structure the framework using Page Object Model (POM) in TypeScript. Global setup logs in once and saves storageState.json for reuse across test workers, speeding up execution. Tests run in parallel sharded across GitHub Actions matrix nodes with Allure video reports.'
  },
  {
    id: 1,
    category: 'Advanced Algorithms & Coding',
    question: 'Write an efficient function to solve the "Longest Substring Without Repeating Characters" problem. What is its time and space complexity?',
    codeSnippet: `function lengthOfLongestSubstring(s: string): number {
  // Implement optimal Sliding Window approach here
}`,
    keyPoints: ['Sliding Window technique using Map / Set', 'Two pointers (left & right)', 'Time complexity O(N), Space complexity O(min(N, M))'],
    sampleAnswer: `function lengthOfLongestSubstring(s: string): number {
  let map = new Map<string, number>();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right])) {
      left = Math.max(left, map.get(s[right])! + 1);
    }
    map.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`
  },
  {
    id: 2,
    category: 'System Architecture & Concurrency',
    question: 'Design a distributed Rate Limiter for an API gateway supporting 100,000 requests/sec. Which algorithm and storage backend would you choose?',
    keyPoints: ['Token Bucket or Sliding Window Log algorithm', 'Redis with Lua scripts for atomic operations', 'Distributed cluster setup with local memory caching layer'],
    sampleAnswer: 'I would use Redis with Sliding Window Counter algorithm executed via Lua scripts for atomic increments. Local in-memory L1 cache filters most requests before hitting Redis clusters.'
  },
  {
    id: 3,
    category: 'Advanced Database Systems',
    question: 'How do you handle database sharding for a multi-tenant platform with petabytes of data? Explain shard key selection and cross-shard queries.',
    keyPoints: ['Choose high-cardinality shard key (e.g. TenantID / OrgID)', 'Consistent Hashing to minimize rebalancing', 'Avoid cross-shard JOINs by denormalizing or using scatter-gather queries'],
    sampleAnswer: 'I select TenantID as the shard key using Consistent Hashing to distribute tenants evenly. Cross-shard JOINs are eliminated by isolating tenant data into dedicated database shards.'
  },
  {
    id: 4,
    category: 'Microservices & Event-Driven Architecture',
    question: 'How do you guarantee Exactly-Once message processing in an event-driven system using Apache Kafka and databases?',
    keyPoints: ['Transactional Outbox Pattern', 'Idempotent Consumer pattern using unique Message IDs', 'Kafka Producer transactional commits (`enable.idempotence=true`)'],
    sampleAnswer: 'I implement the Transactional Outbox Pattern to save business data and outbox events in a single DB transaction. Consumers enforce idempotency by recording processed Message IDs.'
  },
  {
    id: 5,
    category: 'Advanced Coding & Dynamic Programming',
    question: 'Explain how to solve the "0/1 Knapsack Problem" or "Coin Change" problem using Dynamic Programming. Show state transition formula.',
    codeSnippet: `// DP Transition:
// dp[i] = min(dp[i], dp[i - coin] + 1)`,
    keyPoints: ['Identify subproblems & state representation', 'Memoization (top-down) vs Tabulation (bottom-up)', 'Space optimization from 2D matrix to 1D array'],
    sampleAnswer: 'State dp[w] represents minimum coins needed for amount w. Transition: dp[w] = min(dp[w], dp[w - coin] + 1). We initialize dp array with Infinity and dp[0] = 0, building solutions bottom-up.'
  },
  {
    id: 6,
    category: 'Security Architecture',
    question: 'How do you secure a financial API against Distributed Denial of Service (DDoS), SQL Injection, and OAuth token hijacking?',
    keyPoints: ['Cloudflare / AWS Shield for L3/L4 & L7 DDoS protection', 'Parameterized queries / ORM for SQLi prevention', 'Short-lived JWT access tokens with Refresh Token Rotation & TLS fingerprinting'],
    sampleAnswer: 'DDoS is mitigated via Cloudflare WAF and rate-limiting. SQL injection is prevented by strict ORM/parameterized queries. OAuth tokens use short 15-minute expirations with HTTP-only refresh token rotation.'
  },
  {
    id: 7,
    category: 'High-Performance Systems & Caching',
    question: 'How do you solve Cache Stampede (Thundering Herd Problem) when a hot cache key expires under heavy traffic?',
    keyPoints: ['Mutex / Distributed Locking (Redlock)', 'Probabilistic Early Expiration (XFetch algorithm)', 'Background async cache refresh before actual expiration'],
    sampleAnswer: 'I use Distributed Mutex locking so only one worker query rebuilds the cache while other requests wait or receive stale data. Background tasks refresh cache keys probabilistically.'
  },
  {
    id: 8,
    category: 'Advanced Coding & Data Structures',
    question: 'Implement a Least Recently Used (LRU) Cache using a Doubly Linked List and Hash Map in TypeScript.',
    codeSnippet: `class LRUCache {
  capacity: number;
  map = new Map<number, Node>();
  head = new Node(0, 0);
  tail = new Node(0, 0);
}`,
    keyPoints: ['Hash map maps key -> Node pointer', 'Doubly Linked List maintains usage order', 'All get() and put() operations run in O(1) time'],
    sampleAnswer: `class LRUCache {
  capacity: number;
  map = new Map<number, Node>();
  head = new Node(0, 0);
  tail = new Node(0, 0);

  constructor(capacity: number) {
    this.capacity = capacity;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
}`
  },
  {
    id: 9,
    category: 'Cloud Infrastructure & Disaster Recovery',
    question: 'Design a Multi-Region Active-Active Disaster Recovery architecture for a mission-critical platform with RPO < 1 min and RTO < 5 mins.',
    keyPoints: ['Global DNS Anycast / AWS Route53 Latency Routing', 'Multi-Region database replication (CockroachDB / Aurora Global DB)', 'Stateless microservices deployed across AWS regions'],
    sampleAnswer: 'We deploy stateless services in two AWS regions managed by Route 53 Health Checks. Aurora Global Database handles cross-region replication under 1 second. Automatic Route53 failover meets RTO < 1 min.'
  },
  {
    id: 10,
    category: 'Advanced Front-End Architecture',
    question: 'How do you design a Micro-Frontend architecture for a large enterprise dashboard shared across 5 autonomous teams?',
    keyPoints: ['Module Federation (Webpack 5 / Vite)', 'Shared design system component library via NPM package', 'Independent CI/CD deployment pipelines per domain app', 'Isolated state management & event bus communication'],
    sampleAnswer: 'Using Webpack 5 Module Federation, host app dynamically loads remote micro-frontends at runtime. Each team owns their repo and CI/CD pipeline, communicating across domains via an event-bus pattern.'
  },
  {
    id: 11,
    category: 'Garbage Collection & Memory Management',
    question: 'How does V8 JavaScript Engine handle Garbage Collection? Explain Scavenger (Mark-Sweep & Compact) and memory leak debugging.',
    keyPoints: ['Generational GC: Young Generation vs Old Generation', 'Common memory leaks: global variables, uncleaned event listeners, detached DOM nodes', 'Chrome DevTools Heap Snapshots'],
    sampleAnswer: 'V8 uses Generational GC. Short-lived objects in Young Generation are collected quickly via Scavenge algorithm. Surviving objects move to Old Generation cleaned by Mark-Sweep-Compact.'
  },
  {
    id: 12,
    category: 'Graph Algorithms & Applications',
    question: 'How do you detect cycles in a Directed Graph? Provide the algorithm name and time complexity.',
    keyPoints: ['Kahn’s Algorithm (Topological Sort BFS) using in-degrees', 'DFS with 3 colors (White, Grey, Black)', 'Time complexity O(V + E)'],
    sampleAnswer: 'Using DFS with 3-color marking: if during DFS traversal we hit a Grey (Visiting) node, a back-edge exists indicating a cycle. Alternatively, Kahn’s BFS Topological Sort fails if processed nodes count < V.'
  },
  {
    id: 13,
    category: 'Advanced SQL & Query Planning',
    question: 'What are Window Functions in SQL? Write a query using `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` to find the top 2 highest-paid employees in each department.',
    codeSnippet: `WITH RankedSalary AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) as rnk
  FROM employees
)
SELECT * FROM RankedSalary WHERE rnk <= 2;`,
    keyPoints: ['Window functions perform calculations across related set of rows without collapsing them', 'PARTITION BY defines groups, ORDER BY determines sequence', 'Used for ranking and moving averages'],
    sampleAnswer: `WITH RankedEmployees AS (
  SELECT id, name, salary, department_id,
         ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) as rank
  FROM employees
)
SELECT * FROM RankedEmployees WHERE rank <= 2;`
  },
  {
    id: 14,
    category: 'Operating Systems & Threading',
    question: 'Explain the difference between Process and Thread, Mutex and Semaphore, and User Space vs Kernel Space.',
    keyPoints: ['Process has isolated memory space; Threads share memory within process', 'Mutex is binary lock for mutual exclusion; Semaphore controls N concurrent resources', 'Kernel Space has full hardware access'],
    sampleAnswer: 'Processes have independent virtual address spaces, while threads share memory within a process. Mutex is a locking mechanism for 1 thread; Semaphore manages N resource access slots.'
  },
  {
    id: 15,
    category: 'Enterprise System Architecture',
    question: 'How do you handle Distributed Transactions across 3 microservices using the Saga Pattern (Choreography vs Orchestration)?',
    keyPoints: ['Saga breaks transaction into local sub-transactions with compensating undo actions', 'Choreography: Services listen to events asynchronously', 'Orchestration: Central Orchestrator directs execution flow'],
    sampleAnswer: 'Saga Pattern executes local transactions sequentially. If Service 3 fails, compensating transactions run backwards to undo changes in Service 2 & 1. Orchestration uses a central coordinator.'
  },
  {
    id: 16,
    category: 'DevOps & Kubernetes',
    question: 'How do Kubernetes Deployments handle zero-downtime Rolling Updates and Canaries? Explain Readiness & Liveness probes.',
    keyPoints: ['RollingUpdate strategy replaces Pods incrementally', 'Liveness probe checks if container needs restart; Readiness probe checks if Pod can receive traffic', 'Canary deployments route small % of traffic (e.g. 5%) via Istio'],
    sampleAnswer: 'Kubernetes RollingUpdate replaces pods incrementally. Readiness probes ensure new pods are fully initialized before receiving traffic. Istio service mesh enables Canary routing.'
  },
  {
    id: 17,
    category: 'Compiler & Language Architecture',
    question: 'Explain the difference between Just-In-Time (JIT) compilation and Ahead-Of-Time (AOT) compilation.',
    keyPoints: ['JIT compiles bytecode into native machine code at runtime based on execution hotspots', 'AOT compiles source code into machine binary prior to execution', 'JIT allows adaptive optimization; AOT offers instant cold-start times'],
    sampleAnswer: 'JIT (used in V8/Java) compiles bytecode at runtime, optimizing hot functions dynamically. AOT (used in Go/Rust) compiles everything before execution, providing fast startup.'
  },
  {
    id: 18,
    category: 'Cryptography & Data Security',
    question: 'Explain symmetric vs asymmetric encryption, and how TLS 1.3 performs initial handshake key exchange.',
    keyPoints: ['Symmetric (AES) uses 1 shared secret key for fast bulk data encryption', 'Asymmetric (RSA/ECC) uses public/private key pair', 'TLS 1.3 uses ECDHE (Elliptic Curve Diffie-Hellman) for forward secrecy'],
    sampleAnswer: 'Symmetric encryption (AES) is fast and used for payload data. Asymmetric (ECC/RSA) is used during TLS 1.3 handshake to securely derive a shared symmetric session key using ECDHE key exchange.'
  },
  {
    id: 19,
    category: 'Network Protocols & Performance',
    question: 'What improvements does HTTP/3 bring over HTTP/2? Explain QUIC protocol over UDP.',
    keyPoints: ['HTTP/2 suffers from TCP Head-of-Line (HoL) blocking if a packet drops', 'HTTP/3 uses QUIC protocol over UDP', 'QUIC provides independent stream multiplexing and faster handshakes'],
    sampleAnswer: 'HTTP/2 uses single TCP connection where 1 lost packet blocks all streams. HTTP/3 replaces TCP with QUIC over UDP, ensuring streams remain independent so packet loss on stream A does not stall stream B.'
  },
  {
    id: 20,
    category: 'Big Data & Search Engines',
    question: 'How does Elasticsearch index millions of documents for fast full-text search? Explain Inverted Index.',
    keyPoints: ['Inverted Index maps words/tokens -> document IDs containing them', 'Lucene engine uses Finite State Transducers (FST) and Skip Lists', 'Sharding and replication across Elasticsearch node cluster'],
    sampleAnswer: 'Elasticsearch uses Lucene’s Inverted Index, which tokenizes text and maps each word to a list of matching document IDs. This enables fast term lookups in milliseconds.'
  },
  {
    id: 21,
    category: 'Advanced System Debugging',
    question: 'A Java/Node.js application in production experiences periodic High CPU (100%) and Garbage Collection pauses. How do you debug and resolve it?',
    keyPoints: ['Take thread dumps to find spinning loops', 'Take heap dumps to detect memory leaks & high allocation rates', 'Tune GC parameters or fix object creation in hot loops'],
    sampleAnswer: 'I capture thread dumps during high CPU spikes to pinpoint active spinning threads. I inspect heap dumps to check for high allocation rates in hot loops.'
  },
  {
    id: 22,
    category: 'Scalable System Engineering',
    question: 'Design an Upload & Video Transcoding pipeline (like YouTube) handling 4K uploads from millions of users.',
    keyPoints: ['S3 Direct Upload using Presigned URLs', 'Event Notification (S3 -> SQS) triggers worker cluster', 'FFmpeg transcoding into HLS / DASH adaptive bitrates', 'CDN edge caching (CloudFront)'],
    sampleAnswer: 'Clients upload directly to S3 via Presigned URLs. S3 triggers SQS event queues processed by FFmpeg worker clusters. Transcoded HLS segments are cached on CloudFront CDNs.'
  },
  {
    id: 23,
    category: 'Advanced React Architecture',
    question: 'Explain React Concurrent Mode, Server Components (RSC), and Streaming SSR with Suspense.',
    keyPoints: ['Concurrent Mode allows React to interrupt long renders', 'Server Components execute exclusively on server', 'Streaming SSR sends HTML chunks via HTTP streams'],
    sampleAnswer: 'React Server Components execute on server, reducing JS bundle sizes. Streaming SSR streams HTML chunks to the browser as data resolves.'
  },
  {
    id: 24,
    category: 'Domain-Driven Design (DDD)',
    question: 'What are Entities, Value Objects, Aggregates, and Bounded Contexts in Domain-Driven Design?',
    keyPoints: ['Entity: Object with unique identity that persists over time', 'Value Object: Immutable object defined purely by its attributes', 'Aggregate: Cluster of domain objects treated as single unit', 'Bounded Context: Explicit boundary within which a domain model applies'],
    sampleAnswer: 'Entities have unique IDs (e.g. User). Value Objects are immutable attributes (e.g. Address). Aggregates manage transaction boundaries around related entities.'
  },
  {
    id: 25,
    category: 'Engineering Leadership & Tech Strategy',
    question: 'How do you lead a technical team through migrating a massive monolithic legacy platform to microservices while delivering new product features?',
    keyPoints: ['Strangler Fig Pattern: Incrementally replace monolith functionality with new microservices', 'API Gateway routing traffic between monolith and new services', 'Maintain CI/CD quality gates'],
    sampleAnswer: 'I use the Strangler Fig Pattern to carve out microservices incrementally behind an API Gateway. This allows delivering new business features while safely retiring monolith domains.'
  }
];

export interface TestCase {
  id: number;
  input: string;
  params: any[];
  expectedOutput: any;
  isHidden: boolean;
  explanation?: string;
}

export interface CodingChallenge {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  roles?: string[];
  description: string;
  functionName: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: {
    Python: string;
    Java: string;
    'C++': string;
    C: string;
    JavaScript: string;
    TypeScript: string;
    SQL?: string;
  };
  referenceSolution: {
    Python: string;
    Java: string;
    'C++': string;
    C: string;
    JavaScript: string;
    TypeScript: string;
    SQL?: string;
    explanation: string;
  };
  testCases: TestCase[];
}

export const CODING_CHALLENGES: CodingChallenge[] = [
  // ============================================================================
  // EASY LEVEL CODING PROBLEMS (Beginner-Friendly, 10-20 Lines Expected Code)
  // ============================================================================
  {
    id: 1,
    title: 'Two Sum Problem',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    roles: ['Full Stack Developer', 'Software Engineer', 'Backend Developer', 'Frontend Developer', 'Python Developer', 'Java Developer', 'Mobile App Developer'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    functionName: 'twoSum',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
    ],
    starterCode: {
      Python: `def twoSum(nums, target):\n    # Write your solution here\n    pass`,
      Java: `public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}`,
      'C++': `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};`,
      C: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your solution here\n    *returnSize = 0;\n    return NULL;\n}`,
      JavaScript: `function twoSum(nums, target) {\n  // Write your solution here\n}`,
      TypeScript: `function twoSum(nums: number[], target: number): number[] {\n  // Write your solution here\n  return [];\n}`
    },
    referenceSolution: {
      Python: `def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []`,
      Java: `public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) {\n                return new int[] { map.get(diff), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`,
      'C++': `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if (map.count(diff)) return {map[diff], i};\n            map[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
      C: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 2;\n    int* res = (int*)malloc(2 * sizeof(int));\n    for (int i = 0; i < numsSize; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] + nums[j] == target) {\n                res[0] = i; res[1] = j;\n                return res;\n            }\n        }\n    }\n    return res;\n}`,
      JavaScript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      TypeScript: `function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff)!, i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      explanation: 'Use a Hash Map to store numbers and their indices while iterating. For each number, check if (target - num) exists in the map in O(n) time complexity.'
    },
    testCases: [
      { id: 1, input: 'nums = [2,7,11,15], target = 9', params: [[2, 7, 11, 15], 9], expectedOutput: [0, 1], isHidden: false },
      { id: 2, input: 'nums = [3,2,4], target = 6', params: [[3, 2, 4], 6], expectedOutput: [1, 2], isHidden: false },
      { id: 3, input: 'nums = [3,3], target = 6', params: [[3, 3], 6], expectedOutput: [0, 1], isHidden: false },
      { id: 4, input: 'nums = [-1,-2,-3,-4,-5], target = -8', params: [[-1, -2, -3, -4, -5], -8], expectedOutput: [2, 4], isHidden: true },
      { id: 5, input: 'nums = [0,4,3,0], target = 0', params: [[0, 4, 3, 0], 0], expectedOutput: [0, 3], isHidden: true },
      { id: 6, input: 'nums = [1000000,500000,500000], target = 1000000', params: [[1000000, 500000, 500000], 1000000], expectedOutput: [1, 2], isHidden: true },
      { id: 7, input: 'nums = [1,5,9,12,15], target = 24', params: [[1, 5, 9, 12, 15], 24], expectedOutput: [2, 4], isHidden: true },
      { id: 8, input: 'nums = [2,5,5,11], target = 10', params: [[2, 5, 5, 11], 10], expectedOutput: [1, 2], isHidden: true }
    ]
  },
  {
    id: 2,
    title: 'Valid Palindrome Check',
    difficulty: 'Easy',
    category: 'Strings & Two Pointers',
    roles: ['Frontend Developer', 'QA / Software Testing', 'QA Lead', 'UI/UX Designer', 'Mobile App Developer'],
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    functionName: 'isPalindrome',
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists of printable ASCII characters.'],
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false' }
    ],
    starterCode: {
      Python: `def isPalindrome(s: str) -> bool:\n    # Write your solution here\n    pass`,
      Java: `public class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your solution here\n        return false;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    bool isPalindrome(string s) {\n        // Write your solution here\n        return false;\n    }\n};`,
      C: `bool isPalindrome(char* s) {\n    // Write your solution here\n    return false;\n}`,
      JavaScript: `function isPalindrome(s) {\n  // Write your solution here\n}`,
      TypeScript: `function isPalindrome(s: string): boolean {\n  // Write your solution here\n  return false;\n}`
    },
    referenceSolution: {
      Python: `def isPalindrome(s: str) -> bool:\n    cleaned = "".join(c.lower() for c in s if c.isalnum())\n    return cleaned == cleaned[::-1]`,
      Java: `public class Solution {\n    public boolean isPalindrome(String s) {\n        String cleaned = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();\n        return cleaned.equals(new StringBuilder(cleaned).reverse().toString());\n    }\n}`,
      'C++': `class Solution {\npublic:\n    bool isPalindrome(string s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !isalnum(s[l])) l++;\n            while (l < r && !isalnum(s[r])) r--;\n            if (tolower(s[l]) != tolower(s[r])) return false;\n            l++; r--;\n        }\n        return true;\n    }\n};`,
      C: `bool isPalindrome(char* s) {\n    int l = 0, r = strlen(s) - 1;\n    while (l < r) {\n        while (l < r && !isalnum(s[l])) l++;\n        while (l < r && !isalnum(s[r])) r--;\n        if (tolower(s[l]) != tolower(s[r])) return false;\n        l++; r--;\n    }\n    return true;\n}`,
      JavaScript: `function isPalindrome(s) {\n  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return cleaned === cleaned.split('').reverse().join('');\n}`,
      TypeScript: `function isPalindrome(s: string): boolean {\n  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return cleaned === cleaned.split('').reverse().join('');\n}`,
      explanation: 'Filter out non-alphanumeric characters, convert to lowercase, and check if the string equals its reverse.'
    },
    testCases: [
      { id: 1, input: 's = "A man, a plan, a canal: Panama"', params: ["A man, a plan, a canal: Panama"], expectedOutput: true, isHidden: false },
      { id: 2, input: 's = "race a car"', params: ["race a car"], expectedOutput: false, isHidden: false },
      { id: 3, input: 's = " "', params: [" "], expectedOutput: true, isHidden: false },
      { id: 4, input: 's = "No \'x\' in Nixon"', params: ["No 'x' in Nixon"], expectedOutput: true, isHidden: true },
      { id: 5, input: 's = "ab_a"', params: ["ab_a"], expectedOutput: true, isHidden: true },
      { id: 6, input: 's = "0P"', params: ["0P"], expectedOutput: false, isHidden: true },
      { id: 7, input: 's = "Was it a car or a cat I saw?"', params: ["Was it a car or a cat I saw?"], expectedOutput: true, isHidden: true },
      { id: 8, input: 's = "12321"', params: ["12321"], expectedOutput: true, isHidden: true }
    ]
  },
  {
    id: 3,
    title: 'Reverse String',
    difficulty: 'Easy',
    category: 'Strings',
    roles: ['Frontend Developer', 'UI/UX Designer', 'Mobile App Developer', 'Software Engineer'],
    description: 'Write a function that reverses a string input.',
    functionName: 'reverseString',
    constraints: ['1 <= s.length <= 10^5'],
    examples: [
      { input: 's = "hello"', output: '"olleh"' },
      { input: 's = "Hannah"', output: '"hannaH"' }
    ],
    starterCode: {
      Python: `def reverseString(s: str) -> str:\n    # Write your solution here\n    pass`,
      Java: `public class Solution {\n    public String reverseString(String s) {\n        // Write your solution here\n        return "";\n    }\n}`,
      'C++': `class Solution {\npublic:\n    string reverseString(string s) {\n        // Write your solution here\n        return "";\n    }\n};`,
      C: `char* reverseString(char* s) {\n    // Write your solution here\n    return s;\n}`,
      JavaScript: `function reverseString(s) {\n  // Write your solution here\n}`,
      TypeScript: `function reverseString(s: string): string {\n  // Write your solution here\n  return "";\n}`
    },
    referenceSolution: {
      Python: `def reverseString(s: str) -> str:\n    return s[::-1]`,
      Java: `public class Solution {\n    public String reverseString(String s) {\n        return new StringBuilder(s).reverse().toString();\n    }\n}`,
      'C++': `class Solution {\npublic:\n    string reverseString(string s) {\n        reverse(s.begin(), s.end());\n        return s;\n    }\n};`,
      C: `char* reverseString(char* s) {\n    int l = 0, r = strlen(s) - 1;\n    while (l < r) {\n        char temp = s[l]; s[l] = s[r]; s[r] = temp;\n        l++; r--;\n    }\n    return s;\n}`,
      JavaScript: `function reverseString(s) {\n  return s.split('').reverse().join('');\n}`,
      TypeScript: `function reverseString(s: string): string {\n  return s.split('').reverse().join('');\n}`,
      explanation: 'Reverse the characters of string using string reversal utilities or two pointers.'
    },
    testCases: [
      { id: 1, input: 's = "hello"', params: ["hello"], expectedOutput: "olleh", isHidden: false },
      { id: 2, input: 's = "Hannah"', params: ["Hannah"], expectedOutput: "hannaH", isHidden: false },
      { id: 3, input: 's = "a"', params: ["a"], expectedOutput: "a", isHidden: false },
      { id: 4, input: 's = "12345"', params: ["12345"], expectedOutput: "54321", isHidden: true },
      { id: 5, input: 's = "TheJobSync"', params: ["TheJobSync"], expectedOutput: "cnySboJehT", isHidden: true },
      { id: 6, input: 's = "racecar"', params: ["racecar"], expectedOutput: "racecar", isHidden: true },
      { id: 7, input: 's = "Open AI"', params: ["Open AI"], expectedOutput: "IA nepO", isHidden: true },
      { id: 8, input: 's = ""', params: [""], expectedOutput: "", isHidden: true }
    ]
  },
  {
    id: 4,
    title: 'Find Maximum Number in Array',
    difficulty: 'Easy',
    category: 'Arrays',
    roles: ['Data Scientist', 'Data Analyst', 'Data Engineer', 'Backend Developer', 'Python Developer'],
    description: 'Given an array of integers `nums`, find and return the maximum element in the array.',
    functionName: 'findMax',
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      { input: 'nums = [3, 7, 2, 9, 5]', output: '9' },
      { input: 'nums = [-10, -5, -2, -20]', output: '-2' }
    ],
    starterCode: {
      Python: `def findMax(nums):\n    # Write your solution here\n    pass`,
      Java: `public class Solution {\n    public int findMax(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    int findMax(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};`,
      C: `int findMax(int* nums, int numsSize) {\n    // Write your solution here\n    return 0;\n}`,
      JavaScript: `function findMax(nums) {\n  // Write your solution here\n}`,
      TypeScript: `function findMax(nums: number[]): number {\n  // Write your solution here\n  return 0;\n}`
    },
    referenceSolution: {
      Python: `def findMax(nums):\n    return max(nums)`,
      Java: `public class Solution {\n    public int findMax(int[] nums) {\n        int maxVal = nums[0];\n        for (int n : nums) if (n > maxVal) maxVal = n;\n        return maxVal;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    int findMax(vector<int>& nums) {\n        return *max_element(nums.begin(), nums.end());\n    }\n};`,
      C: `int findMax(int* nums, int numsSize) {\n    int maxVal = nums[0];\n    for (int i = 1; i < numsSize; i++) {\n        if (nums[i] > maxVal) maxVal = nums[i];\n    }\n    return maxVal;\n}`,
      JavaScript: `function findMax(nums) {\n  return Math.max(...nums);\n}`,
      TypeScript: `function findMax(nums: number[]): number {\n  return Math.max(...nums);\n}`,
      explanation: 'Iterate through the array keeping track of the largest element found so far, or use built-in max function.'
    },
    testCases: [
      { id: 1, input: 'nums = [3, 7, 2, 9, 5]', params: [[3, 7, 2, 9, 5]], expectedOutput: 9, isHidden: false },
      { id: 2, input: 'nums = [-10, -5, -2, -20]', params: [[-10, -5, -2, -20]], expectedOutput: -2, isHidden: false },
      { id: 3, input: 'nums = [42]', params: [[42]], expectedOutput: 42, isHidden: false },
      { id: 4, input: 'nums = [0, 0, 0, 0]', params: [[0, 0, 0, 0]], expectedOutput: 0, isHidden: true },
      { id: 5, input: 'nums = [100, 200, 50, 300, 150]', params: [[100, 200, 50, 300, 150]], expectedOutput: 300, isHidden: true },
      { id: 6, input: 'nums = [-1, 0, 1]', params: [[-1, 0, 1]], expectedOutput: 1, isHidden: true },
      { id: 7, input: 'nums = [5, 4, 3, 2, 1]', params: [[5, 4, 3, 2, 1]], expectedOutput: 5, isHidden: true },
      { id: 8, input: 'nums = [-1000, -2000, -500]', params: [[-1000, -2000, -500]], expectedOutput: -500, isHidden: true }
    ]
  },
  {
    id: 5,
    title: 'Count Vowels in String',
    difficulty: 'Easy',
    category: 'Strings',
    roles: ['Frontend Developer', 'QA / Software Testing', 'QA Lead', 'UI/UX Designer'],
    description: 'Given a string `s`, count and return the total number of vowels (`a`, `e`, `i`, `o`, `u` - case-insensitive) in the string.',
    functionName: 'countVowels',
    constraints: ['0 <= s.length <= 10^5'],
    examples: [
      { input: 's = "hello world"', output: '3' },
      { input: 's = "AEIOU"', output: '5' }
    ],
    starterCode: {
      Python: `def countVowels(s: str) -> int:\n    # Write your solution here\n    pass`,
      Java: `public class Solution {\n    public int countVowels(String s) {\n        // Write your solution here\n        return 0;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    int countVowels(string s) {\n        // Write your solution here\n        return 0;\n    }\n};`,
      C: `int countVowels(char* s) {\n    // Write your solution here\n    return 0;\n}`,
      JavaScript: `function countVowels(s) {\n  // Write your solution here\n}`,
      TypeScript: `function countVowels(s: string): number {\n  // Write your solution here\n  return 0;\n}`
    },
    referenceSolution: {
      Python: `def countVowels(s: str) -> int:\n    vowels = set("aeiouAEIOU")\n    return sum(1 for c in s if c in vowels)`,
      Java: `public class Solution {\n    public int countVowels(String s) {\n        int count = 0;\n        String vowels = "aeiouAEIOU";\n        for (char c : s.toCharArray()) {\n            if (vowels.indexOf(c) != -1) count++;\n        }\n        return count;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    int countVowels(string s) {\n        int count = 0;\n        string vowels = "aeiouAEIOU";\n        for (char c : s) {\n            if (vowels.find(c) != string::npos) count++;\n        }\n        return count;\n    }\n};`,
      C: `int countVowels(char* s) {\n    int count = 0;\n    for (int i = 0; s[i] != '\\0'; i++) {\n        char c = tolower(s[i]);\n        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') count++;\n    }\n    return count;\n}`,
      JavaScript: `function countVowels(s) {\n  const matches = s.match(/[aeiou]/gi);\n  return matches ? matches.length : 0;\n}`,
      TypeScript: `function countVowels(s: string): number {\n  const matches = s.match(/[aeiou]/gi);\n  return matches ? matches.length : 0;\n}`,
      explanation: 'Use regular expression matching or iterate through characters while checking against a vowel set.'
    },
    testCases: [
      { id: 1, input: 's = "hello world"', params: ["hello world"], expectedOutput: 3, isHidden: false },
      { id: 2, input: 's = "AEIOU"', params: ["AEIOU"], expectedOutput: 5, isHidden: false },
      { id: 3, input: 's = "bcdfg"', params: ["bcdfg"], expectedOutput: 0, isHidden: false },
      { id: 4, input: 's = "Programming in TypeScript"', params: ["Programming in TypeScript"], expectedOutput: 6, isHidden: true },
      { id: 5, input: 's = "a quick brown fox jumps over the lazy dog"', params: ["a quick brown fox jumps over the lazy dog"], expectedOutput: 11, isHidden: true },
      { id: 6, input: 's = ""', params: [""], expectedOutput: 0, isHidden: true },
      { id: 7, input: 's = "rhythm"', params: ["rhythm"], expectedOutput: 0, isHidden: true },
      { id: 8, input: 's = "Beautiful Day"', params: ["Beautiful Day"], expectedOutput: 6, isHidden: true }
    ]
  },
  {
    id: 6,
    title: 'Remove Duplicates from Array',
    difficulty: 'Easy',
    category: 'Arrays',
    roles: ['Backend Developer', 'Data Engineer', 'Data Analyst', 'QA / Software Testing', 'Python Developer'],
    description: 'Given an array of numbers `nums`, return a new array with all duplicate values removed while preserving the original relative order.',
    functionName: 'removeDuplicates',
    constraints: ['0 <= nums.length <= 10^5'],
    examples: [
      { input: 'nums = [1, 1, 2]', output: '[1, 2]' },
      { input: 'nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]', output: '[0, 1, 2, 3, 4]' }
    ],
    starterCode: {
      Python: `def removeDuplicates(nums):\n    # Write your solution here\n    pass`,
      Java: `public class Solution {\n    public int[] removeDuplicates(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}`,
      'C++': `class Solution {\npublic:\n    vector<int> removeDuplicates(vector<int>& nums) {\n        // Write your solution here\n        return {};\n    }\n};`,
      C: `int* removeDuplicates(int* nums, int numsSize, int* returnSize) {\n    // Write your solution here\n    *returnSize = 0;\n    return NULL;\n}`,
      JavaScript: `function removeDuplicates(nums) {\n  // Write your solution here\n}`,
      TypeScript: `function removeDuplicates(nums: number[]): number[] {\n  // Write your solution here\n  return [];\n}`
    },
    referenceSolution: {
      Python: `def removeDuplicates(nums):\n    seen = set()\n    res = []\n    for n in nums:\n        if n not in seen:\n            seen.add(n)\n            res.append(n)\n    return res`,
      Java: `public class Solution {\n    public int[] removeDuplicates(int[] nums) {\n        Set<Integer> set = new LinkedHashSet<>();\n        for (int n : nums) set.add(n);\n        return set.stream().mapToInt(Integer::intValue).toArray();\n    }\n}`,
      'C++': `class Solution {\npublic:\n    vector<int> removeDuplicates(vector<int>& nums) {\n        unordered_set<int> st;\n        vector<int> res;\n        for (int n : nums) {\n            if (!st.count(n)) { st.insert(n); res.push_back(n); }\n        }\n        return res;\n    }\n};`,
      C: `int* removeDuplicates(int* nums, int numsSize, int* returnSize) {\n    int* res = (int*)malloc(numsSize * sizeof(int));\n    int k = 0;\n    for (int i = 0; i < numsSize; i++) {\n        int dup = 0;\n        for (int j = 0; j < k; j++) {\n            if (res[j] == nums[i]) { dup = 1; break; }\n        }\n        if (!dup) res[k++] = nums[i];\n    }\n    *returnSize = k;\n    return res;\n}`,
      JavaScript: `function removeDuplicates(nums) {\n  return Array.from(new Set(nums));\n}`,
      TypeScript: `function removeDuplicates(nums: number[]): number[] {\n  return Array.from(new Set(nums));\n}`,
      explanation: 'Use a Set data structure to filter out duplicate elements in O(n) time.'
    },
    testCases: [
      { id: 1, input: 'nums = [1, 1, 2]', params: [[1, 1, 2]], expectedOutput: [1, 2], isHidden: false },
      { id: 2, input: 'nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]', params: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expectedOutput: [0, 1, 2, 3, 4], isHidden: false },
      { id: 3, input: 'nums = [5, 5, 5]', params: [[5, 5, 5]], expectedOutput: [5], isHidden: false },
      { id: 4, input: 'nums = [1, 2, 3]', params: [[1, 2, 3]], expectedOutput: [1, 2, 3], isHidden: true },
      { id: 5, input: 'nums = []', params: [[]], expectedOutput: [], isHidden: true },
      { id: 6, input: 'nums = [-1, -1, 0, 0, 2]', params: [[-1, -1, 0, 0, 2]], expectedOutput: [-1, 0, 2], isHidden: true },
      { id: 7, input: 'nums = [10, 20, 20, 30, 30, 40]', params: [[10, 20, 20, 30, 30, 40]], expectedOutput: [10, 20, 30, 40], isHidden: true },
      { id: 8, input: 'nums = [7]', params: [[7]], expectedOutput: [7], isHidden: true }
    ]
  },
  {
    id: 7,
    title: 'FizzBuzz Problem',
    difficulty: 'Easy',
    category: 'Math & Logic',
    roles: ['Software Engineer', 'Full Stack Developer', 'Python Developer', 'Java Developer', 'QA / Software Testing'],
    description: 'Given an integer `n`, return a string array `ans` (1-indexed) where:\n- `ans[i] == "FizzBuzz"` if `i` is divisible by `3` and `5`.\n- `ans[i] == "Fizz"` if `i` is divisible by `3`.\n- `ans[i] == "Buzz"` if `i` is divisible by `5`.\n- `ans[i] == i` (as a string) if none of the above conditions are true.',
    functionName: 'fizzBuzz',
    constraints: ['1 <= n <= 10^4'],
    examples: [
      { input: 'n = 3', output: '["1","2","Fizz"]' },
      { input: 'n = 5', output: '["1","2","Fizz","4","Buzz"]' }
    ],
    starterCode: {
      Python: `def fizzBuzz(n: int):\n    # Write your solution here\n    pass`,
      Java: `public class Solution {\n    public List<String> fizzBuzz(int n) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}`,
      'C++': `class Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        // Write your solution here\n        return {};\n    }\n};`,
      C: `char** fizzBuzz(int n, int* returnSize) {\n    // Write your solution here\n    *returnSize = 0;\n    return NULL;\n}`,
      JavaScript: `function fizzBuzz(n) {\n  // Write your solution here\n}`,
      TypeScript: `function fizzBuzz(n: number): string[] {\n  // Write your solution here\n  return [];\n}`
    },
    referenceSolution: {
      Python: `def fizzBuzz(n: int):\n    res = []\n    for i in range(1, n + 1):\n        if i % 15 == 0: res.append("FizzBuzz")\n        elif i % 3 == 0: res.append("Fizz")\n        elif i % 5 == 0: res.append("Buzz")\n        else: res.append(str(i))\n    return res`,
      Java: `public class Solution {\n    public List<String> fizzBuzz(int n) {\n        List<String> res = new ArrayList<>();\n        for (int i = 1; i <= n; i++) {\n            if (i % 15 == 0) res.add("FizzBuzz");\n            else if (i % 3 == 0) res.add("Fizz");\n            else if (i % 5 == 0) res.add("Buzz");\n            else res.add(String.valueOf(i));\n        }\n        return res;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        vector<string> res;\n        for (int i = 1; i <= n; i++) {\n            if (i % 15 == 0) res.push_back("FizzBuzz");\n            else if (i % 3 == 0) res.push_back("Fizz");\n            else if (i % 5 == 0) res.push_back("Buzz");\n            else res.push_back(to_string(i));\n        }\n        return res;\n    }\n};`,
      C: `char** fizzBuzz(int n, int* returnSize) {\n    *returnSize = n;\n    char** res = (char**)malloc(n * sizeof(char*));\n    for (int i = 1; i <= n; i++) {\n        res[i-1] = (char*)malloc(10 * sizeof(char));\n        if (i % 15 == 0) strcpy(res[i-1], "FizzBuzz");\n        else if (i % 3 == 0) strcpy(res[i-1], "Fizz");\n        else if (i % 5 == 0) strcpy(res[i-1], "Buzz");\n        else sprintf(res[i-1], "%d", i);\n    }\n    return res;\n}`,
      JavaScript: `function fizzBuzz(n) {\n  const res = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) res.push('FizzBuzz');\n    else if (i % 3 === 0) res.push('Fizz');\n    else if (i % 5 === 0) res.push('Buzz');\n    else res.push(String(i));\n  }\n  return res;\n}`,
      TypeScript: `function fizzBuzz(n: number): string[] {\n  const res: string[] = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) res.push('FizzBuzz');\n    else if (i % 3 === 0) res.push('Fizz');\n    else if (i % 5 === 0) res.push('Buzz');\n    else res.push(String(i));\n  }\n  return res;\n}`,
      explanation: 'Loop from 1 to n checking modulo 15 (FizzBuzz), modulo 3 (Fizz), and modulo 5 (Buzz).'
    },
    testCases: [
      { id: 1, input: 'n = 3', params: [3], expectedOutput: ["1", "2", "Fizz"], isHidden: false },
      { id: 2, input: 'n = 5', params: [5], expectedOutput: ["1", "2", "Fizz", "4", "Buzz"], isHidden: false },
      { id: 3, input: 'n = 15', params: [15], expectedOutput: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"], isHidden: false },
      { id: 4, input: 'n = 1', params: [1], expectedOutput: ["1"], isHidden: true },
      { id: 5, input: 'n = 6', params: [6], expectedOutput: ["1", "2", "Fizz", "4", "Buzz", "Fizz"], isHidden: true },
      { id: 6, input: 'n = 10', params: [10], expectedOutput: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz"], isHidden: true },
      { id: 7, input: 'n = 20', params: [20], expectedOutput: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz","16","17","Fizz","19","Buzz"], isHidden: true },
      { id: 8, input: 'n = 2', params: [2], expectedOutput: ["1", "2"], isHidden: true }
    ]
  },
  {
    id: 8,
    title: 'Valid Parentheses (Easy)',
    difficulty: 'Easy',
    category: 'Stack',
    roles: ['DevOps Engineer', 'Backend Developer', 'Systems Engineer', 'Java Developer'],
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if brackets are closed by the same type of brackets and in the correct order.',
    functionName: 'isValidParentheses',
    constraints: ['1 <= s.length <= 10^4', 's consists of brackets only: ()[]{}'],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    starterCode: {
      Python: `def isValidParentheses(s: str) -> bool:\n    # Write your solution here\n    pass`,
      Java: `public class Solution {\n    public boolean isValidParentheses(String s) {\n        // Write your solution here\n        return false;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    bool isValidParentheses(string s) {\n        // Write your solution here\n        return false;\n    }\n};`,
      C: `bool isValidParentheses(char* s) {\n    // Write your solution here\n    return false;\n}`,
      JavaScript: `function isValidParentheses(s) {\n  // Write your solution here\n}`,
      TypeScript: `function isValidParentheses(s: string): boolean {\n  // Write your solution here\n  return false;\n}`
    },
    referenceSolution: {
      Python: `def isValidParentheses(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top: return False\n        else:\n            stack.append(char)\n    return not stack`,
      Java: `public class Solution {\n    public boolean isValidParentheses(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
      'C++': `class Solution {\npublic:\n    bool isValidParentheses(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c == '(' || c == '{' || c == '[') st.push(c);\n            else {\n                if (st.empty()) return false;\n                char top = st.top(); st.pop();\n                if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false;\n            }\n        }\n        return st.empty();\n    }\n};`,
      C: `bool isValidParentheses(char* s) {\n    char stack[10000];\n    int top = -1;\n    for (int i = 0; s[i] != '\\0'; i++) {\n        if (s[i] == '(' || s[i] == '{' || s[i] == '[') stack[++top] = s[i];\n        else {\n            if (top == -1) return false;\n            char c = stack[top--];\n            if ((s[i] == ')' && c != '(') || (s[i] == '}' && c != '{') || (s[i] == ']' && c != '[')) return false;\n        }\n    }\n    return top == -1;\n}`,
      JavaScript: `function isValidParentheses(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if (c in map) {\n      if (stack.pop() !== map[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}`,
      TypeScript: `function isValidParentheses(s: string): boolean {\n  const stack: string[] = [];\n  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if (c in map) {\n      if (stack.pop() !== map[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}`,
      explanation: 'Use a Stack data structure to push opening brackets and pop to match closing brackets.'
    },
    testCases: [
      { id: 1, input: 's = "()"', params: ["()"], expectedOutput: true, isHidden: false },
      { id: 2, input: 's = "()[]{}"', params: ["()[]{}"], expectedOutput: true, isHidden: false },
      { id: 3, input: 's = "(]"', params: ["(]"], expectedOutput: false, isHidden: false },
      { id: 4, input: 's = "([{}])"', params: ["([{}])"], expectedOutput: true, isHidden: true },
      { id: 5, input: 's = "((("', params: ["((("], expectedOutput: false, isHidden: true },
      { id: 6, input: 's = "])"', params: ["])"], expectedOutput: false, isHidden: true },
      { id: 7, input: 's = "{[]}"', params: ["{[]}"], expectedOutput: true, isHidden: true },
      { id: 8, input: 's = "(("', params: ["(("], expectedOutput: false, isHidden: true }
    ]
  },
  {
    id: 9,
    title: 'Merge Two Sorted Arrays',
    difficulty: 'Easy',
    category: 'Arrays & Two Pointers',
    roles: ['Backend Developer', 'Data Engineer', 'Python Developer', 'Java Developer', 'Mobile App Developer'],
    description: 'Given two sorted arrays `arr1` and `arr2`, merge them into a single sorted array and return it.',
    functionName: 'mergeSortedArrays',
    constraints: ['0 <= arr1.length, arr2.length <= 10^4'],
    examples: [
      { input: 'arr1 = [1, 3, 5], arr2 = [2, 4, 6]', output: '[1, 2, 3, 4, 5, 6]' },
      { input: 'arr1 = [], arr2 = [1]', output: '[1]' }
    ],
    starterCode: {
      Python: `def mergeSortedArrays(arr1, arr2):\n    # Write your solution here\n    pass`,
      Java: `public class Solution {\n    public int[] mergeSortedArrays(int[] arr1, int[] arr2) {\n        // Write your solution here\n        return new int[]{};\n    }\n}`,
      'C++': `class Solution {\npublic:\n    vector<int> mergeSortedArrays(vector<int>& arr1, vector<int>& arr2) {\n        // Write your solution here\n        return {};\n    }\n};`,
      C: `int* mergeSortedArrays(int* arr1, int n1, int* arr2, int n2, int* returnSize) {\n    // Write your solution here\n    *returnSize = 0;\n    return NULL;\n}`,
      JavaScript: `function mergeSortedArrays(arr1, arr2) {\n  // Write your solution here\n}`,
      TypeScript: `function mergeSortedArrays(arr1: number[], arr2: number[]): number[] {\n  // Write your solution here\n  return [];\n}`
    },
    referenceSolution: {
      Python: `def mergeSortedArrays(arr1, arr2):\n    return sorted(arr1 + arr2)`,
      Java: `public class Solution {\n    public int[] mergeSortedArrays(int[] arr1, int[] arr2) {\n        int[] res = new int[arr1.length + arr2.length];\n        int i = 0, j = 0, k = 0;\n        while (i < arr1.length && j < arr2.length) {\n            if (arr1[i] <= arr2[j]) res[k++] = arr1[i++];\n            else res[k++] = arr2[j++];\n        }\n        while (i < arr1.length) res[k++] = arr1[i++];\n        while (j < arr2.length) res[k++] = arr2[j++];\n        return res;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    vector<int> mergeSortedArrays(vector<int>& arr1, vector<int>& arr2) {\n        vector<int> res;\n        int i = 0, j = 0;\n        while (i < arr1.size() && j < arr2.size()) {\n            if (arr1[i] <= arr2[j]) res.push_back(arr1[i++]);\n            else res.push_back(arr2[j++]);\n        }\n        while (i < arr1.size()) res.push_back(arr1[i++]);\n        while (j < arr2.size()) res.push_back(arr2[j++]);\n        return res;\n    }\n};`,
      C: `int* mergeSortedArrays(int* arr1, int n1, int* arr2, int n2, int* returnSize) {\n    *returnSize = n1 + n2;\n    int* res = (int*)malloc((n1 + n2) * sizeof(int));\n    int i = 0, j = 0, k = 0;\n    while (i < n1 && j < n2) {\n        if (arr1[i] <= arr2[j]) res[k++] = arr1[i++];\n        else res[k++] = arr2[j++];\n    }\n    while (i < n1) res[k++] = arr1[i++];\n    while (j < n2) res[k++] = arr2[j++];\n    return res;\n}`,
      JavaScript: `function mergeSortedArrays(arr1, arr2) {\n  return [...arr1, ...arr2].sort((a, b) => a - b);\n}`,
      TypeScript: `function mergeSortedArrays(arr1: number[], arr2: number[]): number[] {\n  return [...arr1, ...arr2].sort((a, b) => a - b);\n}`,
      explanation: 'Use two pointers to compare elements from both sorted arrays and merge them sequentially.'
    },
    testCases: [
      { id: 1, input: 'arr1 = [1, 3, 5], arr2 = [2, 4, 6]', params: [[1, 3, 5], [2, 4, 6]], expectedOutput: [1, 2, 3, 4, 5, 6], isHidden: false },
      { id: 2, input: 'arr1 = [1, 2, 3], arr2 = [4, 5]', params: [[1, 2, 3], [4, 5]], expectedOutput: [1, 2, 3, 4, 5], isHidden: false },
      { id: 3, input: 'arr1 = [], arr2 = [1]', params: [[], [1]], expectedOutput: [1], isHidden: false },
      { id: 4, input: 'arr1 = [5, 10], arr2 = []', params: [[5, 10], []], expectedOutput: [5, 10], isHidden: true },
      { id: 5, input: 'arr1 = [-5, -2, 0], arr2 = [-3, 1, 4]', params: [[-5, -2, 0], [-3, 1, 4]], expectedOutput: [-5, -3, -2, 0, 1, 4], isHidden: true },
      { id: 6, input: 'arr1 = [2, 2], arr2 = [2, 2]', params: [[2, 2], [2, 2]], expectedOutput: [2, 2, 2, 2], isHidden: true },
      { id: 7, input: 'arr1 = [], arr2 = []', params: [[], []], expectedOutput: [], isHidden: true },
      { id: 8, input: 'arr1 = [100], arr2 = [50]', params: [[100], [50]], expectedOutput: [50, 100], isHidden: true }
    ]
  },
  {
    id: 10,
    title: 'Missing Number in Array',
    difficulty: 'Easy',
    category: 'Math & Bit Manipulation',
    roles: ['Data Scientist', 'Data Engineer', 'DevOps Engineer', 'Backend Developer'],
    description: 'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.',
    functionName: 'missingNumber',
    constraints: ['n == nums.length', '1 <= n <= 10^4', '0 <= nums[i] <= n', 'All numbers in nums are unique.'],
    examples: [
      { input: 'nums = [3,0,1]', output: '2', explanation: 'n = 3 since there are 3 numbers, so all numbers are in range [0,3]. 2 is missing.' },
      { input: 'nums = [0,1]', output: '2' }
    ],
    starterCode: {
      Python: `def missingNumber(nums):\n    # Write your solution here\n    pass`,
      Java: `public class Solution {\n    public int missingNumber(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};`,
      C: `int missingNumber(int* nums, int numsSize) {\n    // Write your solution here\n    return 0;\n}`,
      JavaScript: `function missingNumber(nums) {\n  // Write your solution here\n}`,
      TypeScript: `function missingNumber(nums: number[]): number {\n  // Write your solution here\n  return 0;\n}`
    },
    referenceSolution: {
      Python: `def missingNumber(nums):\n    n = len(nums)\n    expected_sum = n * (n + 1) // 2\n    return expected_sum - sum(nums)`,
      Java: `public class Solution {\n    public int missingNumber(int[] nums) {\n        int n = nums.length;\n        int expectedSum = n * (n + 1) / 2;\n        int actualSum = 0;\n        for (int num : nums) actualSum += num;\n        return expectedSum - actualSum;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        int n = nums.size();\n        int expectedSum = n * (n + 1) / 2;\n        int actualSum = 0;\n        for (int num : nums) actualSum += num;\n        return expectedSum - actualSum;\n    }\n};`,
      C: `int missingNumber(int* nums, int numsSize) {\n    int expectedSum = numsSize * (numsSize + 1) / 2;\n    int actualSum = 0;\n    for (int i = 0; i < numsSize; i++) actualSum += nums[i];\n    return expectedSum - actualSum;\n}`,
      JavaScript: `function missingNumber(nums) {\n  const n = nums.length;\n  const expectedSum = (n * (n + 1)) / 2;\n  const actualSum = nums.reduce((acc, curr) => acc + curr, 0);\n  return expectedSum - actualSum;\n}`,
      TypeScript: `function missingNumber(nums: number[]): number {\n  const n = nums.length;\n  const expectedSum = (n * (n + 1)) / 2;\n  const actualSum = nums.reduce((acc, curr) => acc + curr, 0);\n  return expectedSum - actualSum;\n}`,
      explanation: 'Calculate expected sum of range [0, n] using formula n*(n+1)/2 and subtract actual array sum in O(n) time and O(1) space.'
    },
    testCases: [
      { id: 1, input: 'nums = [3,0,1]', params: [[3, 0, 1]], expectedOutput: 2, isHidden: false },
      { id: 2, input: 'nums = [0,1]', params: [[0, 1]], expectedOutput: 2, isHidden: false },
      { id: 3, input: 'nums = [9,6,4,2,3,5,7,0,1]', params: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expectedOutput: 8, isHidden: false },
      { id: 4, input: 'nums = [0]', params: [[0]], expectedOutput: 1, isHidden: true },
      { id: 5, input: 'nums = [1]', params: [[1]], expectedOutput: 0, isHidden: true },
      { id: 6, input: 'nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]', params: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]], expectedOutput: 10, isHidden: true },
      { id: 7, input: 'nums = [0, 2, 3, 4]', params: [[0, 2, 3, 4]], expectedOutput: 1, isHidden: true },
      { id: 8, input: 'nums = [4, 3, 2, 1, 0]', params: [[4, 3, 2, 1, 0]], expectedOutput: 5, isHidden: true }
    ]
  },

  // ============================================================================
  // MEDIUM LEVEL CODING PROBLEMS
  // ============================================================================
  {
    id: 11,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    roles: ['Frontend Developer', 'Full Stack Developer', 'Backend Developer', 'Software Engineer'],
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    functionName: 'lengthOfLongestSubstring',
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with length of 3.' },
      { input: 's = "bbbbb"', output: '1' }
    ],
    starterCode: {
      Python: `def lengthOfLongestSubstring(s: str) -> int:\n    # Write your solution here\n    pass`,
      Java: `public class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n        return 0;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your solution here\n        return 0;\n    }\n};`,
      C: `int lengthOfLongestSubstring(char* s) {\n    // Write your solution here\n    return 0;\n}`,
      JavaScript: `function lengthOfLongestSubstring(s) {\n  // Write your solution here\n}`,
      TypeScript: `function lengthOfLongestSubstring(s: string): number {\n  // Write your solution here\n  return 0;\n}`
    },
    referenceSolution: {
      Python: `def lengthOfLongestSubstring(s: str) -> int:\n    char_set = set()\n    left = max_len = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len`,
      Java: `public class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Set<Character> set = new HashSet<>();\n        int left = 0, maxLen = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (set.contains(s.charAt(right))) {\n                set.remove(s.charAt(left++));\n            }\n            set.add(s.charAt(right));\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_set<char> st;\n        int left = 0, maxLen = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (st.count(s[right])) st.erase(s[left++]);\n            st.insert(s[right]);\n            maxLen = max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n};`,
      C: `int lengthOfLongestSubstring(char* s) {\n    int n = strlen(s), maxLen = 0, left = 0;\n    int lastSeen[256];\n    memset(lastSeen, -1, sizeof(lastSeen));\n    for (int right = 0; right < n; right++) {\n        if (lastSeen[(unsigned char)s[right]] >= left) left = lastSeen[(unsigned char)s[right]] + 1;\n        lastSeen[(unsigned char)s[right]] = right;\n        if (right - left + 1 > maxLen) maxLen = right - left + 1;\n    }\n    return maxLen;\n}`,
      JavaScript: `function lengthOfLongestSubstring(s) {\n  const set = new Set();\n  let left = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) set.delete(s[left++]);\n    set.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      TypeScript: `function lengthOfLongestSubstring(s: string): number {\n  const set = new Set<string>();\n  let left = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) set.delete(s[left++]);\n    set.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      explanation: 'Use a sliding window with two pointers and a Hash Set to store unique characters in O(n) time.'
    },
    testCases: [
      { id: 1, input: 's = "abcabcbb"', params: ["abcabcbb"], expectedOutput: 3, isHidden: false },
      { id: 2, input: 's = "bbbbb"', params: ["bbbbb"], expectedOutput: 1, isHidden: false },
      { id: 3, input: 's = "pwwkew"', params: ["pwwkew"], expectedOutput: 3, isHidden: false },
      { id: 4, input: 's = ""', params: [""], expectedOutput: 0, isHidden: true },
      { id: 5, input: 's = " "', params: [" "], expectedOutput: 1, isHidden: true },
      { id: 6, input: 's = "au"', params: ["au"], expectedOutput: 2, isHidden: true },
      { id: 7, input: 's = "dvdf"', params: ["dvdf"], expectedOutput: 3, isHidden: true },
      { id: 8, input: 's = "anviaj"', params: ["anviaj"], expectedOutput: 5, isHidden: true }
    ]
  },
  {
    id: 12,
    title: 'Merge Overlapping Intervals',
    difficulty: 'Medium',
    category: 'Sorting & Intervals',
    roles: ['DevOps Engineer', 'Backend Developer', 'Data Engineer', 'Software Engineer'],
    description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return an array of non-overlapping intervals.',
    functionName: 'mergeIntervals',
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2'],
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }
    ],
    starterCode: {
      Python: `def mergeIntervals(intervals):\n    # Write your solution here\n    pass`,
      Java: `public class Solution {\n    public int[][] mergeIntervals(int[][] intervals) {\n        // Write your solution here\n        return new int[][]{};\n    }\n}`,
      'C++': `class Solution {\npublic:\n    vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {\n        // Write your solution here\n        return {};\n    }\n};`,
      C: `int** mergeIntervals(int** intervals, int intervalsSize, int* returnSize) {\n    // Write your solution here\n    *returnSize = 0;\n    return NULL;\n}`,
      JavaScript: `function mergeIntervals(intervals) {\n  // Write your solution here\n}`,
      TypeScript: `function mergeIntervals(intervals: number[][]): number[][] {\n  // Write your solution here\n  return [];\n}`
    },
    referenceSolution: {
      Python: `def mergeIntervals(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for interval in intervals:\n        if not merged or merged[-1][1] < interval[0]:\n            merged.append(interval)\n        else:\n            merged[-1][1] = max(merged[-1][1], interval[1])\n    return merged`,
      Java: `public class Solution {\n    public int[][] mergeIntervals(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> merged = new ArrayList<>();\n        for (int[] interval : intervals) {\n            if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) {\n                merged.add(interval);\n            } else {\n                merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], interval[1]);\n            }\n        }\n        return merged.toArray(new int[merged.size()][]);\n    }\n}`,
      'C++': `class Solution {\npublic:\n    vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> merged;\n        for (auto& interval : intervals) {\n            if (merged.empty() || merged.back()[1] < interval[0]) merged.push_back(interval);\n            else merged.back()[1] = max(merged.back()[1], interval[1]);\n        }\n        return merged;\n    }\n};`,
      C: `int** mergeIntervals(int** intervals, int intervalsSize, int* returnSize) {\n    *returnSize = intervalsSize;\n    return intervals;\n}`,
      JavaScript: `function mergeIntervals(intervals) {\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [];\n  for (const interval of intervals) {\n    if (!res.length || res[res.length - 1][1] < interval[0]) {\n      res.push(interval);\n    } else {\n      res[res.length - 1][1] = Math.max(res[res.length - 1][1], interval[1]);\n    }\n  }\n  return res;\n}`,
      TypeScript: `function mergeIntervals(intervals: number[][]): number[][] {\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [];\n  for (const interval of intervals) {\n    if (!res.length || res[res.length - 1][1] < interval[0]) {\n      res.push(interval);\n    } else {\n      res[res.length - 1][1] = Math.max(res[res.length - 1][1], interval[1]);\n    }\n  }\n  return res;\n}`,
      explanation: 'Sort intervals by start time and iterate through merging overlapping end boundaries.'
    },
    testCases: [
      { id: 1, input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', params: [[[1,3],[2,6],[8,10],[15,18]]], expectedOutput: [[1,6],[8,10],[15,18]], isHidden: false },
      { id: 2, input: 'intervals = [[1,4],[4,5]]', params: [[[1,4],[4,5]]], expectedOutput: [[1,5]], isHidden: false },
      { id: 3, input: 'intervals = [[1,4],[2,3]]', params: [[[1,4],[2,3]]], expectedOutput: [[1,4]], isHidden: false },
      { id: 4, input: 'intervals = [[6,8],[1,9]]', params: [[[6,8],[1,9]]], expectedOutput: [[1,9]], isHidden: true },
      { id: 5, input: 'intervals = [[1,4],[5,6]]', params: [[[1,4],[5,6]]], expectedOutput: [[1,4],[5,6]], isHidden: true }
    ]
  },

  // ============================================================================
  // HARD LEVEL CODING PROBLEMS
  // ============================================================================
  {
    id: 13,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: 'Two Pointers & Dynamic Programming',
    roles: ['Data Scientist', 'Software Engineer', 'Backend Developer', 'Full Stack Developer'],
    description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.',
    functionName: 'trap',
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4'],
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }
    ],
    starterCode: {
      Python: `def trap(height):\n    # Write your solution here\n    pass`,
      Java: `public class Solution {\n    public int trap(int[] height) {\n        // Write your solution here\n        return 0;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Write your solution here\n        return 0;\n    }\n};`,
      C: `int trap(int* height, int heightSize) {\n    // Write your solution here\n    return 0;\n}`,
      JavaScript: `function trap(height) {\n  // Write your solution here\n}`,
      TypeScript: `function trap(height: number[]): number {\n  // Write your solution here\n  return 0;\n}`
    },
    referenceSolution: {
      Python: `def trap(height):\n    left, right = 0, len(height) - 1\n    left_max = right_max = water = 0\n    while left < right:\n        if height[left] < height[right]:\n            if height[left] >= left_max: left_max = height[left]\n            else: water += left_max - height[left]\n            left += 1\n        else:\n            if height[right] >= right_max: right_max = height[right]\n            else: water += right_max - height[right]\n            right -= 1\n    return water`,
      Java: `public class Solution {\n    public int trap(int[] height) {\n        int left = 0, right = height.length - 1;\n        int leftMax = 0, rightMax = 0, water = 0;\n        while (left < right) {\n            if (height[left] < height[right]) {\n                if (height[left] >= leftMax) leftMax = height[left];\n                else water += leftMax - height[left];\n                left++;\n            } else {\n                if (height[right] >= rightMax) rightMax = height[right];\n                else water += rightMax - height[right];\n                right--;\n            }\n        }\n        return water;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        int l = 0, r = height.size() - 1;\n        int lMax = 0, rMax = 0, water = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                height[l] >= lMax ? lMax = height[l] : water += lMax - height[l]; l++;\n            } else {\n                height[r] >= rMax ? rMax = height[r] : water += rMax - height[r]; r--;\n            }\n        }\n        return water;\n    }\n};`,
      C: `int trap(int* height, int heightSize) {\n    int l = 0, r = heightSize - 1, lMax = 0, rMax = 0, water = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] >= lMax) lMax = height[l];\n            else water += lMax - height[l]; l++;\n        } else {\n            if (height[r] >= rMax) rMax = height[r];\n            else water += rMax - height[r]; r--;\n        }\n    }\n    return water;\n}`,
      JavaScript: `function trap(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0, water = 0;\n  while (left < right) {\n    if (height[left] < height[right]) {\n      height[left] >= leftMax ? (leftMax = height[left]) : (water += leftMax - height[left]);\n      left++;\n    } else {\n      height[right] >= rightMax ? (rightMax = height[right]) : (water += rightMax - height[right]);\n      right--;\n    }\n  }\n  return water;\n}`,
      TypeScript: `function trap(height: number[]): number {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0, water = 0;\n  while (left < right) {\n    if (height[left] < height[right]) {\n      height[left] >= leftMax ? (leftMax = height[left]) : (water += leftMax - height[left]);\n      left++;\n    } else {\n      height[right] >= rightMax ? (rightMax = height[right]) : (water += rightMax - height[right]);\n      right--;\n    }\n  }\n  return water;\n}`,
      explanation: 'Use two pointers from both ends maintaining leftMax and rightMax to compute trapped water in O(n) time and O(1) space.'
    },
    testCases: [
      { id: 1, input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', params: [[0,1,0,2,1,0,1,3,2,1,2,1]], expectedOutput: 6, isHidden: false },
      { id: 2, input: 'height = [4,2,0,3,2,5]', params: [[4,2,0,3,2,5]], expectedOutput: 9, isHidden: false },
      { id: 3, input: 'height = [3,0,0,2,0,4]', params: [[3,0,0,2,0,4]], expectedOutput: 10, isHidden: true },
      { id: 4, input: 'height = [1,2,3,4,5]', params: [[1,2,3,4,5]], expectedOutput: 0, isHidden: true }
    ]
  },

  // ============================================================================
  // SQL DATABASE QUERY PROBLEMS (Appears across all role assessments)
  // ============================================================================
  {
    id: 14,
    title: 'SQL: Find Second Highest Salary',
    difficulty: 'Easy',
    category: 'Database & SQL',
    roles: ['Full Stack Developer', 'Backend Developer', 'Data Scientist', 'Data Analyst', 'Data Engineer', 'Software Engineer', 'DevOps Engineer', 'QA / Software Testing', 'Python Developer', 'Java Developer', 'Frontend Developer', 'Mobile App Developer'],
    description: 'Write a SQL query to find the second highest salary from the `Employee` table. Return `NULL` as `SecondHighestSalary` if there is no second highest salary.',
    functionName: 'findSecondHighestSalary',
    constraints: ['Employee table contains id (INT) and salary (INT).', 'Query should return a single column named SecondHighestSalary.'],
    examples: [
      { input: 'Employee table: [{id:1, salary:100}, {id:2, salary:200}, {id:3, salary:300}]', output: '200' },
      { input: 'Employee table: [{id:1, salary:100}]', output: 'null' }
    ],
    starterCode: {
      Python: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee;`,
      Java: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee;`,
      'C++': `SELECT MAX(salary) AS SecondHighestSalary FROM Employee;`,
      C: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee;`,
      JavaScript: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee;`,
      TypeScript: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee;`,
      SQL: `-- Write your SQL query below\nSELECT MAX(salary) AS SecondHighestSalary\nFROM Employee;\n`
    },
    referenceSolution: {
      Python: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);`,
      Java: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);`,
      'C++': `SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);`,
      C: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);`,
      JavaScript: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);`,
      TypeScript: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);`,
      SQL: `SELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (SELECT MAX(salary) FROM Employee);`,
      explanation: 'Use a subquery to find the maximum salary, then select the maximum salary that is strictly less than that value.'
    },
    testCases: [
      { id: 1, input: 'Employee: [{salary:100}, {salary:200}, {salary:300}]', params: [], expectedOutput: 200, isHidden: false },
      { id: 2, input: 'Employee: [{salary:100}]', params: [], expectedOutput: null, isHidden: false },
      { id: 3, input: 'Employee: [{salary:500}, {salary:500}, {salary:300}]', params: [], expectedOutput: 300, isHidden: true },
      { id: 4, input: 'Employee: [{salary:1000}, {salary:2000}]', params: [], expectedOutput: 1000, isHidden: true }
    ]
  },
  {
    id: 15,
    title: 'SQL: Customers Who Never Order',
    difficulty: 'Easy',
    category: 'Database & SQL',
    roles: ['Full Stack Developer', 'Backend Developer', 'Data Scientist', 'Data Analyst', 'Data Engineer', 'Software Engineer', 'DevOps Engineer', 'QA / Software Testing', 'Python Developer', 'Java Developer', 'Frontend Developer', 'Mobile App Developer'],
    description: 'Write a SQL query to report all customers from the `Customers` table who never placed any order in the `Orders` table.',
    functionName: 'findCustomersWhoNeverOrder',
    constraints: ['Customers table: id (INT), name (VARCHAR)', 'Orders table: id (INT), customerId (INT)'],
    examples: [
      { input: 'Customers: [{id:1, name:"Joe"}, {id:2, name:"Henry"}], Orders: [{id:1, customerId:2}]', output: '["Joe"]' }
    ],
    starterCode: {
      Python: `SELECT name AS Customers FROM Customers;`,
      Java: `SELECT name AS Customers FROM Customers;`,
      'C++': `SELECT name AS Customers FROM Customers;`,
      C: `SELECT name AS Customers FROM Customers;`,
      JavaScript: `SELECT name AS Customers FROM Customers;`,
      TypeScript: `SELECT name AS Customers FROM Customers;`,
      SQL: `-- Write your SQL query below\nSELECT name AS Customers\nFROM Customers;\n`
    },
    referenceSolution: {
      Python: `SELECT name AS Customers FROM Customers WHERE id NOT IN (SELECT customerId FROM Orders);`,
      Java: `SELECT name AS Customers FROM Customers WHERE id NOT IN (SELECT customerId FROM Orders);`,
      'C++': `SELECT name AS Customers FROM Customers WHERE id NOT IN (SELECT customerId FROM Orders);`,
      C: `SELECT name AS Customers FROM Customers WHERE id NOT IN (SELECT customerId FROM Orders);`,
      JavaScript: `SELECT name AS Customers FROM Customers WHERE id NOT IN (SELECT customerId FROM Orders);`,
      TypeScript: `SELECT name AS Customers FROM Customers WHERE id NOT IN (SELECT customerId FROM Orders);`,
      SQL: `SELECT name AS Customers\nFROM Customers\nWHERE id NOT IN (SELECT customerId FROM Orders WHERE customerId IS NOT NULL);`,
      explanation: 'Use NOT IN subquery or LEFT JOIN ... WHERE Orders.customerId IS NULL to identify customers without associated orders.'
    },
    testCases: [
      { id: 1, input: 'Customers: [{id:1, name:"Joe"}, {id:2, name:"Henry"}], Orders: [{id:1, customerId:2}]', params: [], expectedOutput: ["Joe"], isHidden: false },
      { id: 2, input: 'Customers: [{id:1, name:"Alice"}], Orders: []', params: [], expectedOutput: ["Alice"], isHidden: false },
      { id: 3, input: 'Customers: [{id:1, name:"Sam"}, {id:2, name:"Bob"}], Orders: [{id:1, customerId:1}, {id:2, customerId:2}]', params: [], expectedOutput: [], isHidden: true }
    ]
  },
  {
    id: 16,
    title: 'SQL: Duplicate Emails',
    difficulty: 'Easy',
    category: 'Database & SQL',
    roles: ['Full Stack Developer', 'Backend Developer', 'Data Scientist', 'Data Analyst', 'Data Engineer', 'Software Engineer', 'DevOps Engineer', 'QA / Software Testing', 'Python Developer', 'Java Developer', 'Frontend Developer', 'Mobile App Developer'],
    description: 'Write a SQL query to report all duplicate emails in the `Person` table. Return the column named `Email`.',
    functionName: 'findDuplicateEmails',
    constraints: ['Person table: id (INT), email (VARCHAR)'],
    examples: [
      { input: 'Person: [{id:1, email:"a@b.com"}, {id:2, email:"c@d.com"}, {id:3, email:"a@b.com"}]', output: '["a@b.com"]' }
    ],
    starterCode: {
      Python: `SELECT email AS Email FROM Person;`,
      Java: `SELECT email AS Email FROM Person;`,
      'C++': `SELECT email AS Email FROM Person;`,
      C: `SELECT email AS Email FROM Person;`,
      JavaScript: `SELECT email AS Email FROM Person;`,
      TypeScript: `SELECT email AS Email FROM Person;`,
      SQL: `-- Write your SQL query below\nSELECT email AS Email\nFROM Person;\n`
    },
    referenceSolution: {
      Python: `SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;`,
      Java: `SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;`,
      'C++': `SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;`,
      C: `SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;`,
      JavaScript: `SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;`,
      TypeScript: `SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;`,
      SQL: `SELECT email AS Email\nFROM Person\nGROUP BY email\nHAVING COUNT(email) > 1;`,
      explanation: 'Group records by email address and use HAVING COUNT(email) > 1 to filter duplicate emails.'
    },
    testCases: [
      { id: 1, input: 'Person: [{email:"a@b.com"}, {email:"c@d.com"}, {email:"a@b.com"}]', params: [], expectedOutput: ["a@b.com"], isHidden: false },
      { id: 2, input: 'Person: [{email:"x@y.com"}, {email:"z@w.com"}]', params: [], expectedOutput: [], isHidden: false },
      { id: 3, input: 'Person: [{email:"admin@job.com"}, {email:"admin@job.com"}, {email:"admin@job.com"}]', params: [], expectedOutput: ["admin@job.com"], isHidden: true }
    ]
  }
];

export function getCodingChallenges(
  role: string,
  difficulty: 'Easy' | 'Medium' | 'Hard'
): CodingChallenge[] {
  const normRole = (role || '').toLowerCase();

  // 1. Separate SQL database challenges and programming challenges
  const sqlChallenges = CODING_CHALLENGES.filter(c => c.category === 'Database & SQL');
  const progChallenges = CODING_CHALLENGES.filter(c => c.category !== 'Database & SQL');

  // 2. Filter programming challenges by difficulty tier
  const levelPool = progChallenges.filter(c => c.difficulty === difficulty);

  // 3. Role Domain Mapping Keywords
  const roleKeywords: Record<string, string[]> = {
    frontend: ['frontend', 'web', 'ui/ux', 'javascript', 'react'],
    backend: ['backend', 'python', 'java', 'c++', 'c#', 'api', 'server', 'node', 'database'],
    data: ['data', 'analytics', 'scientist', 'engineer', 'ai', 'machine learning', 'python'],
    devops: ['devops', 'cloud', 'system', 'sysadmin', 'infrastructure', 'security'],
    qa: ['qa', 'testing', 'automation', 'test', 'quality'],
    mobile: ['mobile', 'android', 'ios', 'flutter', 'react native']
  };

  // Determine domain for selected role
  let matchedDomains: string[] = [];
  Object.entries(roleKeywords).forEach(([domain, keywords]) => {
    if (keywords.some(k => normRole.includes(k))) {
      matchedDomains.push(domain);
    }
  });

  // Filter programming challenges matching role domain
  const roleSpecific = levelPool.filter(c => {
    if (!c.roles || c.roles.length === 0) return true;
    const isDirectMatch = c.roles.some(r => {
      const nr = r.toLowerCase();
      return normRole.includes(nr) || nr.includes(normRole);
    });
    if (isDirectMatch) return true;
    const catLower = (c.category || '').toLowerCase();
    return matchedDomains.some(d => catLower.includes(d) || c.roles?.some(r => r.toLowerCase().includes(d)));
  });

  const poolToUse = roleSpecific.length > 0 ? roleSpecific : levelPool;

  // 4. Randomize both pools using Fisher-Yates shuffle
  const shuffledProg = shuffleArray(poolToUse);
  const shuffledSql = shuffleArray(sqlChallenges);

  // 5. Select 2 Role-Tailored Programming Challenges + 1 SQL Query Challenge!
  const selectedProg = shuffledProg.slice(0, 2);
  const selectedSql = shuffledSql.slice(0, 1);

  // Return combined 3 challenges (2 Programming + 1 SQL)
  return [...selectedProg, ...selectedSql];
}

// Helper to shuffle array randomly (Fisher-Yates)
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface ExperienceLevelOption {
  id: 'Intern' | 'Fresher' | 'Experienced' | string;
  title: string;
  badge: string;
  icon: string;
  description: string;
}

export const EXPERIENCE_LEVELS: ExperienceLevelOption[] = [
  {
    id: 'Intern',
    title: 'Intern',
    badge: '🎓 Intern',
    icon: '🎓',
    description: 'Suitable for students looking for internship opportunities.'
  },
  {
    id: 'Fresher',
    title: 'Fresher',
    badge: '💼 Fresher',
    icon: '💼',
    description: 'Suitable for recent graduates or candidates with 0–1 year of experience.'
  },
  {
    id: 'Experienced',
    title: 'Experienced',
    badge: '🚀 Experienced',
    icon: '🚀',
    description: 'Suitable for professionals with more than 1 year of industry experience.'
  }
];

export interface CandidateContext {
  skills?: string[];
  experience?: string;
  headline?: string;
  summary?: string;
  currentRole?: string;
  experienceLevel?: string;
  portfolioUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  leetcodeUrl?: string | null;
  hackerrankUrl?: string | null;
}

export function generateResumeAndPortfolioQuestions(
  role: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  context?: CandidateContext
): Question[] {
  if (!context) return [];

  const candidateQuestions: Question[] = [];
  const skills = context.skills || [];
  const currRole = context.currentRole || context.headline || role;
  const exp = context.experience || 'your practical background';
  const expLvl = context.experienceLevel || 'Fresher';

  // 0. Tailored Experience Level Specific Questions
  if (expLvl === 'Intern') {
    if (difficulty === 'Easy') {
      candidateQuestions.push({
        id: 9501,
        category: 'Internship Fundamentals',
        question: `As an Intern targeting a ${role} role: What is the primary purpose of variable scope (Local vs. Global) in programming?`,
        options: ['To limit access to variables and avoid unexpected side effects', 'To increase disk space usage', 'To force functions to run sequentially', 'To disable variable re-assignment'],
        correctAnswer: 0,
        explanation: 'Local scope restricts variable visibility to its function block, preventing global namespace pollution and side-effects.'
      });
    } else {
      candidateQuestions.push({
        id: 9502,
        category: 'Internship Academic & Project Problem Solving',
        question: `As an Intern applying for ${role}: Walk us through an academic or personal project you built. What core programming concepts and problem-solving steps did you implement?`,
        keyPoints: ['project', 'fundamentals', 'programming', 'academic', 'problem solving', 'logic', 'learning'],
        sampleAnswer: `I designed a project applying fundamental ${role} concepts: structuring modular functions, parsing inputs, handling errors gracefully, and testing core logic through simple unit exercises.`
      });
    }
  } else if (expLvl === 'Experienced') {
    if (difficulty === 'Easy') {
      candidateQuestions.push({
        id: 9503,
        category: 'Production & Architecture Practices',
        question: `As an Experienced ${role}: Which architectural strategy best prevents single-point-of-failure (SPOF) in high-availability backend systems?`,
        options: ['Load balancing with multi-zone redundancy and horizontal scaling', 'Storing all sessions in local memory of a single node', 'Disabling database transactions', 'Running single-threaded synchronous tasks'],
        correctAnswer: 0,
        explanation: 'Horizontal scaling behind load balancers with multi-zone redundant instances ensures zero-downtime fault tolerance.'
      });
    } else {
      candidateQuestions.push({
        id: 9504,
        category: 'Production Debugging & System Architecture',
        question: `As an Experienced ${role}: Describe a complex real-world production incident, system performance bottleneck, or architectural trade-off you navigated. What leadership and technical steps resolved it?`,
        keyPoints: ['production', 'system design', 'architecture', 'debugging', 'performance', 'optimization', 'leadership', 'monitoring'],
        sampleAnswer: `I led the resolution of a production latency bottleneck by analyzing APM telemetry, optimizing heavy SQL queries, introducing caching layers, and refining API architecture under high concurrency.`
      });
    }
  } else {
    // Fresher
    if (difficulty === 'Easy') {
      candidateQuestions.push({
        id: 9505,
        category: 'Fresher Technical & OOP Concepts',
        question: `For an entry-level ${role}: What is Object-Oriented Programming (OOP) Encapsulation?`,
        options: ['Bundling data and methods together while restricting direct access to object state', 'Writing code without using functions', 'Connecting frontend to SQL database directly', 'Running code in background threads'],
        correctAnswer: 0,
        explanation: 'Encapsulation wraps data (attributes) and code (methods) together and hides internal state details using access modifiers.'
      });
    } else {
      candidateQuestions.push({
        id: 9506,
        category: 'Fresher Problem Solving & Resume Projects',
        question: `As a recent graduate / Fresher for ${role}: Explain how you structure data structures (e.g. Arrays, Hash Maps, SQL tables) when tackling entry-level problem solving and building resume projects.`,
        keyPoints: ['data structures', 'oop', 'sql', 'problem solving', 'resume project', 'logic', 'entry level'],
        sampleAnswer: `I choose data structures according to time/space requirements: using Hash Maps for O(1) lookups, Arrays for sequential access, and relational SQL schemas for persistent structured entities in my projects.`
      });
    }
  }

  // 1. Generate questions specifically targeting candidate's resume skills
  if (skills.length > 0) {
    const topSkills = skills.slice(0, 6);
    topSkills.forEach((skill, idx) => {
      const cleanSkill = skill.trim();
      if (!cleanSkill) return;

      if (difficulty === 'Easy') {
        candidateQuestions.push({
          id: 9000 + idx,
          category: `Resume Skill: ${cleanSkill}`,
          question: `Based on your resume skill in ${cleanSkill}: What is a critical design pattern or best practice when building applications with ${cleanSkill}?`,
          options: [
            `Enforcing modularity, input validation, and proper error handling for ${cleanSkill}`,
            `Writing unhandled async promises without try/catch blocks`,
            `Hardcoding API keys and database credentials directly in ${cleanSkill} components`,
            `Disabling browser caching and compression for ${cleanSkill} assets`
          ],
          correctAnswer: 0,
          explanation: `When working with ${cleanSkill}, modular architecture, input sanitization, and structured error handling are fundamental best practices.`
        });
      } else {
        candidateQuestions.push({
          id: 9100 + idx,
          category: `Resume Skill: ${cleanSkill}`,
          question: `Your resume lists expertise in ${cleanSkill}. Walk us through how you leveraged ${cleanSkill} in a project as a ${currRole} (${expLvl} Level), highlighting trade-offs and performance tuning.`,
          keyPoints: [cleanSkill.toLowerCase(), 'architecture', 'performance', 'optimization', 'error handling', 'scale', 'trade-offs'],
          sampleAnswer: `In my project using ${cleanSkill}, I architected modular services/components, optimized asynchronous data fetching and state flow, implemented strict type checking/error boundaries, and improved runtime performance.`
        });
      }
    });
  }

  // 2. Generate questions targeting candidate's GitHub / Portfolio projects
  if (context.githubUrl || context.portfolioUrl) {
    const platformLabel = context.githubUrl ? 'GitHub & Portfolio Projects' : 'Portfolio Showcase';
    if (difficulty === 'Easy') {
      candidateQuestions.push({
        id: 9200,
        category: 'Portfolio & GitHub Projects',
        question: `Reflecting on your ${platformLabel}: What is the primary benefit of enforcing continuous integration (CI) and unit test pipelines on your project repositories?`,
        options: [
          'Automatically catches breaking changes and verifies build integrity before deployment',
          'It increases the database storage footprint',
          'It replaces the need for writing application business logic',
          'It bypasses code review policies'
        ],
        correctAnswer: 0,
        explanation: 'Automated CI pipelines run automated tests to prevent regressions and maintain deployment stability.'
      });
    } else {
      candidateQuestions.push({
        id: 9201,
        category: 'Portfolio & GitHub Projects',
        question: `Based on your ${platformLabel} (${context.githubUrl || context.portfolioUrl}): Detail the end-to-end architecture of a major application featured in your portfolio, explaining API routing, state management, and database choices.`,
        keyPoints: ['portfolio', 'github', 'architecture', 'api', 'state management', 'database', 'deployment', 'rest', 'graphql'],
        sampleAnswer: `My featured project uses a client-server architecture: frontend components manage state efficiently, communicating over REST/GraphQL to backend services connected to a relational/NoSQL database with automated deployment pipelines.`
      });
    }
  }

  // 3. Generate questions targeting candidate's LeetCode / HackerRank profiles
  if (context.leetcodeUrl || context.hackerrankUrl) {
    const platform = context.leetcodeUrl ? 'LeetCode' : 'HackerRank';
    if (difficulty === 'Easy') {
      candidateQuestions.push({
        id: 9300,
        category: `${platform} Coding Profile`,
        question: `Based on your active ${platform} problem solving background: Which data structure provides O(1) average time complexity for insertion, deletion, and lookup?`,
        options: ['Hash Map / Hash Table', 'Binary Search Tree', 'Singly Linked List', 'Array'],
        correctAnswer: 0,
        explanation: 'Hash Tables use hash functions to index keys, enabling O(1) average time complexity for lookup and modification.'
      });
    } else {
      candidateQuestions.push({
        id: 9301,
        category: `${platform} Coding Profile`,
        question: `Given your practice on ${platform}: How do you approach time and space complexity trade-offs (Big-O) when optimizing memory allocation versus CPU execution limits?`,
        keyPoints: ['big-o', 'time complexity', 'space complexity', 'hash map', 'binary search', 'dynamic programming', 'optimization'],
        sampleAnswer: `I analyze Big-O limits early: trading space for time (e.g. using Hash Maps or memoization caches) to reduce runtime from O(N^2) to O(N), or utilizing two-pointer techniques to minimize auxiliary space.`
      });
    }
  }

  // 4. Role & Work Experience Question
  if (context.currentRole || context.experience) {
    if (difficulty !== 'Easy') {
      candidateQuestions.push({
        id: 9400,
        category: 'Candidate Background & Work History',
        question: `In your experience as ${currRole} (${exp}): Describe a high-stress production incident or complex bug you investigated. What diagnostic tools and steps did you use to resolve it?`,
        keyPoints: ['debug', 'production', 'logs', 'root cause', 'hotfix', 'monitoring', 'post-mortem'],
        sampleAnswer: `I checked server logs and APM telemetry, reproduced the issue locally, isolated the bug, deployed a hotfix with regression tests, and set up alert rules to prevent recurrence.`
      });
    }
  }

  return candidateQuestions;
}

// Function to fetch questions for interview session (50 MCQs for Easy, 25 for Medium, 25 for Hard)
export function getQuestionsForInterview(
  role: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  requestedCount?: number,
  candidateContext?: CandidateContext
): Question[] {
  const count = requestedCount || (difficulty === 'Easy' ? 50 : 25);
  let sourcePool: Question[] = [];

  if (difficulty === 'Easy') {
    sourcePool = EASY_MCQ_QUESTIONS;
  } else if (difficulty === 'Medium') {
    sourcePool = MEDIUM_DESCRIPTIVE_QUESTIONS;
  } else {
    sourcePool = HARD_DIFFICULT_QUESTIONS;
  }

  // Generate dynamic Candidate Resume & Portfolio Questions
  const personalizedQuestions = generateResumeAndPortfolioQuestions(role, difficulty, candidateContext);

  // Shuffle standard question pool
  const shuffledStandard = shuffleArray(sourcePool);

  // Place personalized resume/portfolio questions at the beginning of the interview!
  const mergedPool = [...personalizedQuestions, ...shuffledStandard];
  return mergedPool.slice(0, Math.min(count, mergedPool.length));
}

// Function to lookup full original question details (description, constraints, examples, options) by title/question text
export function lookupQuestionDetails(questionKey: string | undefined): {
  title?: string;
  description?: string;
  constraints?: string[];
  examples?: { input: string; output: string; explanation?: string }[];
  options?: string[];
  referenceSolution?: any;
} {
  if (!questionKey || typeof questionKey !== 'string') return {};

  const cleanKey = questionKey.toLowerCase().trim();

  // 1. Search in CODING_CHALLENGES
  const challenge = CODING_CHALLENGES.find(c => {
    const titleLower = (c.title || '').toLowerCase().trim();
    const descLower = (c.description || '').toLowerCase().trim();
    return (
      (titleLower.length > 3 && (cleanKey.includes(titleLower) || titleLower.includes(cleanKey))) ||
      (descLower.length > 5 && (cleanKey.includes(descLower) || descLower.includes(cleanKey)))
    );
  });

  if (challenge) {
    return {
      title: challenge.title,
      description: challenge.description,
      constraints: challenge.constraints || [],
      examples: challenge.examples || [],
      referenceSolution: challenge.referenceSolution
    };
  }

  // 2. Search in EASY_MCQ_QUESTIONS
  const mcq = EASY_MCQ_QUESTIONS.find(m => {
    const qLower = (m.question || '').toLowerCase().trim();
    return qLower.length > 5 && (cleanKey.includes(qLower) || qLower.includes(cleanKey));
  });

  if (mcq) {
    return {
      title: mcq.question,
      description: mcq.question,
      options: mcq.options || []
    };
  }

  // 3. Search in MEDIUM_DESCRIPTIVE_QUESTIONS
  const descQ = MEDIUM_DESCRIPTIVE_QUESTIONS.find(d => {
    const qLower = (d.question || '').toLowerCase().trim();
    return qLower.length > 5 && (cleanKey.includes(qLower) || qLower.includes(cleanKey));
  });

  if (descQ) {
    return {
      title: descQ.question,
      description: descQ.question
    };
  }

  // 4. Search in HARD_DIFFICULT_QUESTIONS
  const hardQ = HARD_DIFFICULT_QUESTIONS.find(h => {
    const qLower = (h.question || '').toLowerCase().trim();
    return qLower.length > 5 && (cleanKey.includes(qLower) || qLower.includes(cleanKey));
  });

  if (hardQ) {
    return {
      title: hardQ.question,
      description: hardQ.question
    };
  }

  return {};
}



