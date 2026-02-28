export interface KeywordSuggestion {
  category: string;
  keywords: string[];
}

const jobKeywords: Record<string, KeywordSuggestion[]> = {
  'software engineer': [
    {
      category: 'Technical Skills',
      keywords: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'REST APIs', 'Git', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB'],
    },
    {
      category: 'Experience Keywords',
      keywords: ['Full-stack development', 'Backend development', 'API development', 'Database design', 'Code optimization', 'Bug fixing', 'Performance optimization', 'Software architecture'],
    },
    {
      category: 'Soft Skills',
      keywords: ['Problem-solving', 'Team collaboration', 'Communication', 'Agile/Scrum', 'Code review', 'Testing', 'Documentation'],
    },
  ],
  'web developer': [
    {
      category: 'Frontend Skills',
      keywords: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue.js', 'Angular', 'Responsive Design', 'SCSS/SASS', 'Webpack', 'npm'],
    },
    {
      category: 'Backend Skills',
      keywords: ['Node.js', 'Express', 'PHP', 'Python', 'Django', 'REST APIs', 'GraphQL', 'Database design', 'Server-side rendering'],
    },
    {
      category: 'Tools & Platforms',
      keywords: ['Git', 'GitHub', 'GitLab', 'AWS', 'Heroku', 'Firebase', 'Chrome DevTools', 'VS Code'],
    },
    {
      category: 'Experience Keywords',
      keywords: ['Website development', 'Responsive web design', 'SEO optimization', 'Performance tuning', 'Accessibility (A11Y)'],
    },
  ],
  'data scientist': [
    {
      category: 'Programming Languages',
      keywords: ['Python', 'R', 'SQL', 'Scala', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn'],
    },
    {
      category: 'Data Analysis',
      keywords: ['Statistical analysis', 'Predictive modeling', 'Machine learning', 'Deep learning', 'Natural language processing', 'Computer vision', 'Data mining'],
    },
    {
      category: 'Tools & Platforms',
      keywords: ['Jupyter', 'Analytics', 'Tableau', 'Power BI', 'AWS', 'Google Cloud', 'Apache Spark', 'Hadoop', 'Airflow'],
    },
    {
      category: 'Experience Keywords',
      keywords: ['Big data', 'Model deployment', 'Data visualization', 'Research', 'A/B testing', 'Feature engineering'],
    },
  ],
  'product manager': [
    {
      category: 'Core Skills',
      keywords: ['Product strategy', 'Roadmap planning', 'Requirements gathering', 'User research', 'Competitive analysis', 'Market analysis'],
    },
    {
      category: 'Technical Knowledge',
      keywords: ['Agile methodology', 'Scrum', 'OKRs', 'Metrics', 'Analytics', 'SQL basics', 'API knowledge'],
    },
    {
      category: 'Tools',
      keywords: ['Jira', 'Confluence', 'Figma', 'Miro', 'Google Analytics', 'Amplitude', 'Mixpanel'],
    },
    {
      category: 'Experience Keywords',
      keywords: ['Cross-functional leadership', 'Stakeholder management', 'Go-to-market strategy', 'User experience', 'Product launch', 'Customer feedback'],
    },
  ],
  'ux designer': [
    {
      category: 'Design Skills',
      keywords: ['User experience design', 'User interface design', 'Wireframing', 'Prototyping', 'User research', 'Usability testing', 'Information architecture'],
    },
    {
      category: 'Tools',
      keywords: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Framer', 'Miro', 'UserTesting', 'Hotjar'],
    },
    {
      category: 'Technical',
      keywords: ['Responsive design', 'Accessibility', 'CSS understanding', 'Interaction design', 'Mobile design', 'Web design patterns'],
    },
    {
      category: 'Experience Keywords',
      keywords: ['Design systems', 'A/B testing', 'User interviews', 'Persona development', 'Wireframes', 'High-fidelity mockups', 'Design thinking'],
    },
  ],
  'sales executive': [
    {
      category: 'Sales Skills',
      keywords: ['B2B sales', 'B2C sales', 'Sales pipeline management', 'Lead generation', 'Negotiation', 'Closing deals', 'Account management'],
    },
    {
      category: 'Industry Knowledge',
      keywords: ['CRM', 'Salesforce', 'HubSpot', 'Market segmentation', 'Territory management', 'Quota achievement'],
    },
    {
      category: 'Experience Keywords',
      keywords: ['Revenue growth', 'Client relationship', 'Sales forecasting', 'Team leadership', 'Proposal development', 'Presentation skills'],
    },
  ],
  'marketing manager': [
    {
      category: 'Marketing Skills',
      keywords: ['Digital marketing', 'Content marketing', 'Email marketing', 'SEO', 'SEM', 'Social media marketing', 'Brand management', 'Campaign management'],
    },
    {
      category: 'Analytics & Tools',
      keywords: ['Google Analytics', 'Data analysis', 'A/B testing', 'Marketing automation', 'Mailchimp', 'HubSpot', 'Adobe Analytics'],
    },
    {
      category: 'Experience Keywords',
      keywords: ['Lead generation', 'Customer acquisition', 'Conversion optimization', 'Budget management', 'Market research', 'Brand positioning'],
    },
  ],
  'project manager': [
    {
      category: 'Project Management',
      keywords: ['Agile', 'Scrum', 'Waterfall', 'Kanban', 'Stakeholder management', 'Risk management', 'Resource planning', 'Budget management'],
    },
    {
      category: 'Tools',
      keywords: ['Jira', 'Asana', 'Monday.com', 'Microsoft Project', 'Trello', 'Confluence', 'Monday.com'],
    },
    {
      category: 'Experience Keywords',
      keywords: ['Team leadership', 'Schedule management', 'Scope management', 'Quality assurance', 'Vendor management', 'Documentation'],
    },
  ],
  'devops engineer': [
    {
      category: 'Cloud Platforms',
      keywords: ['AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Docker', 'Terraform', 'Ansible', 'CloudFormation'],
    },
    {
      category: 'Tools & Technologies',
      keywords: ['CI/CD', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Linux', 'Bash', 'Python', 'Git', 'Monitoring tools'],
    },
    {
      category: 'Experience Keywords',
      keywords: ['Infrastructure automation', 'Container orchestration', 'Deployment pipeline', 'System administration', 'Performance optimization', 'Security implementation'],
    },
  ],
};

export function getSuggestedKeywords(jobProfile: string): KeywordSuggestion[] {
  if (!jobProfile.trim()) {
    return [];
  }

  const normalized = jobProfile.toLowerCase().trim();

  // Exact match
  if (jobKeywords[normalized]) {
    return jobKeywords[normalized];
  }

  // Partial match
  for (const [key, suggestions] of Object.entries(jobKeywords)) {
    if (key.includes(normalized) || normalized.includes(key) || key.split(' ').some(word => normalized.includes(word))) {
      return suggestions;
    }
  }

  // Default generic suggestions
  return [
    {
      category: 'Technical Skills',
      keywords: ['Problem-solving', 'Technical documentation', 'Research', 'Data analysis'],
    },
    {
      category: 'Soft Skills',
      keywords: ['Communication', 'Team collaboration', 'Time management', 'Leadership'],
    },
    {
      category: 'Tools & Platforms',
      keywords: ['Git', 'JIRA', 'Slack', 'Confluence'],
    },
  ];
}

export const POPULAR_JOB_TITLES = [
  'Software Engineer',
  'Web Developer',
  'Data Scientist',
  'Product Manager',
  'UX Designer',
  'Sales Executive',
  'Marketing Manager',
  'Project Manager',
  'DevOps Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Mobile Developer',
  'QA Engineer',
  'Business Analyst',
];
