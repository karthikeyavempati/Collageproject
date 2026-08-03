import { InternshipRole, Candidate, StateDistribution, VerificationBatch } from '../types';

export const INITIAL_INTERNSHIPS: InternshipRole[] = [
  {
    id: 'pm-01',
    title: 'Product Design Intern',
    company: 'Acme Corp / Tech Mahindra',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Hybrid',
    stipend: '₹20,000 / month',
    tags: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
    description: 'Lead user-centered product design for civic engagement portals. Collaborate with cross-functional engineering and strategy teams to build seamless corporate UI frameworks.',
    matchScore: 98,
    applicantsCount: 142,
    sector: 'Technology & Business',
    status: 'Open',
    featured: true
  },
  {
    id: 'pm-02',
    title: 'Technical Product Manager',
    company: 'Tech Mahindra Business Practice',
    location: 'New Delhi, India (Hybrid)',
    type: 'Hybrid',
    stipend: '₹25,000 / month',
    tags: ['Agile PM', 'System Architecture', 'Roadmapping', 'API Specs'],
    description: 'Drive implementation of high-throughput enterprise infrastructure services. Manage product lifecycles for citizen service verification systems.',
    matchScore: 94,
    applicantsCount: 315,
    sector: 'Enterprise Tech',
    status: 'Open',
    featured: true
  },
  {
    id: 'pm-03',
    title: 'Enterprise Policy & Analytics Lead',
    company: 'Strategic Policy Cell',
    location: 'New Delhi, India',
    type: 'On-site',
    stipend: '₹22,000 / month',
    tags: ['Data Modeling', 'Policy Research', 'Econometrics', 'Tableau'],
    description: 'Analyze platform-wide scheme rollout metrics and evaluate regional impact metrics for corporate welfare programs.',
    matchScore: 91,
    applicantsCount: 220,
    sector: 'Business Policy',
    status: 'Closing Soon'
  },
  {
    id: 'pm-04',
    title: 'UX / Growth Strategy PM',
    company: 'Digital India Innovation Foundation',
    location: 'Bengaluru, KA (Hybrid)',
    type: 'Hybrid',
    stipend: '₹20,000 / month',
    tags: ['Growth Metrics', 'A/B Testing', 'User Journeys', 'SQL'],
    description: 'Optimize adoption funnels for global enterprise service web platforms and develop data-backed growth experiments.',
    matchScore: 89,
    applicantsCount: 185,
    sector: 'Digital Infrastructure',
    status: 'Open'
  },
  {
    id: 'pm-05',
    title: 'AI Systems & Business Fellow',
    company: 'Ministry of Electronics & IT',
    location: 'Remote',
    type: 'Remote',
    stipend: '₹25,000 / month',
    tags: ['LLM Benchmarking', 'AI Ethics', 'Python', 'MLOps'],
    description: 'Formulate ethical guidelines and benchmarks for sovereign AI deployments in enterprise administration.',
    matchScore: 88,
    applicantsCount: 410,
    sector: 'Artificial Intelligence',
    status: 'Reviewing'
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-01',
    name: 'Ananya Sharma',
    university: 'Delhi University',
    roleFocus: 'Product Strategy & UX',
    experience: 'Fresher',
    aiMatchScore: 98,
    avatarInitials: 'AS',
    appliedDate: '2 hours ago',
    status: 'Shortlisted',
    email: 'ananya.sharma@du.ac.in',
    phone: '+91 98765 43210',
    skills: ['Figma', 'User Journeys', 'Wireframing', 'Agile Methodologies', 'User Interviews'],
    summary: 'Top rank candidate with honors in Design Strategy. Demonstrated leadership in student welfare UI projects and civic hackathons.'
  },
  {
    id: 'cand-02',
    name: 'Rahul Jain',
    university: 'IIT Bombay',
    roleFocus: 'Technical PM',
    experience: '1 Yr',
    aiMatchScore: 94,
    avatarInitials: 'RJ',
    appliedDate: 'Yesterday',
    status: 'Interviewed',
    email: 'rahul.jain@iitb.ac.in',
    phone: '+91 98123 45678',
    skills: ['Python', 'System Architecture', 'SQL', 'Roadmapping', 'API Design'],
    summary: 'Computer Science graduate with prior internship experience in backend service scalability and data pipelines.'
  },
  {
    id: 'cand-03',
    name: 'Meera Kumar',
    university: 'NID Ahmedabad',
    roleFocus: 'UX/Growth PM',
    experience: 'Fresher',
    aiMatchScore: 91,
    avatarInitials: 'MK',
    appliedDate: '3 days ago',
    status: 'Applied',
    email: 'meera.k@nid.edu',
    phone: '+91 97654 32109',
    skills: ['Design Systems', 'Micro-interactions', 'Design Thinking', 'Prototyping'],
    summary: 'Visual communication design specialist focused on accessible UI for low-bandwidth mobile applications.'
  },
  {
    id: 'cand-04',
    name: 'Vikramaditya Roy',
    university: 'IIM Bangalore',
    roleFocus: 'Enterprise Policy & Analytics',
    experience: '1 Yr',
    aiMatchScore: 88,
    avatarInitials: 'VR',
    appliedDate: '4 days ago',
    status: 'Offered',
    email: 'vroy@iimb.ac.in',
    phone: '+91 98989 12345',
    skills: ['Data Analysis', 'Stata', 'Macroeconomics', 'Stakeholder Management'],
    summary: 'MBA candidate specializing in enterprise sector analytics, economic research, and policy roadmap evaluation.'
  }
];

export const STATE_DISTRIBUTIONS: StateDistribution[] = [
  {
    state: 'Maharashtra',
    applications: 245091,
    verifiedPercentage: 88,
    topSectors: ['Tech & Business', 'Enterprise Health', 'Infrastructure'],
    activePartners: 32
  },
  {
    state: 'Delhi NCR',
    applications: 198420,
    verifiedPercentage: 94,
    topSectors: ['Enterprise Policy', 'Digital Services', 'Education'],
    activePartners: 45
  },
  {
    state: 'Karnataka',
    applications: 182300,
    verifiedPercentage: 91,
    topSectors: ['AI Business', 'Software PM', 'Urban Mobility'],
    activePartners: 28
  },
  {
    state: 'Tamil Nadu',
    applications: 154200,
    verifiedPercentage: 86,
    topSectors: ['Electronics', 'Civic Design', 'Renewables'],
    activePartners: 24
  },
  {
    state: 'Uttar Pradesh',
    applications: 210850,
    verifiedPercentage: 79,
    topSectors: ['Rural Tech', 'Skill Development', 'Logistics'],
    activePartners: 38
  }
];

export const VERIFICATION_BATCHES: VerificationBatch[] = [
  {
    id: 'Batch #892-A',
    title: 'Batch #892-A',
    type: 'Technical Document Review',
    priority: 'High',
    count: 1240,
    status: 'Pending',
    zone: 'Zone C (Western)'
  },
  {
    id: 'Batch #891-C',
    title: 'Batch #891-C',
    type: 'Identity & Education Verification',
    priority: 'Standard',
    count: 850,
    status: 'In Review',
    zone: 'Zone A (Northern)'
  },
  {
    id: 'Anomaly Report #12',
    title: 'Anomaly Report #12',
    type: 'Duplicate Aadhaar / University Records Detected',
    priority: 'System',
    count: 12,
    status: 'Pending',
    zone: 'System Central'
  }
];
