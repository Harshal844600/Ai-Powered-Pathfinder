export interface WeekPlan {
  week: number;
  title: string;
  topics: string[];
  exercises: string[];
  mini_project: string;
  key_outcomes: string[];
}

export interface Project {
  month: number;
  title: string;
  problem_statement: string;
  tech_stack: string[];
  dataset_links: string[];
  steps: string[];
  portfolio_impact: string;
}

export interface Resource {
  title: string;
  url: string;
  description?: string;
  free?: boolean;
}

export interface Quiz {
  week: number;
  mcqs: { question: string; options: string[]; correct: number }[];
  coding_questions: { question: string; hint: string }[];
  mini_challenge: string;
}

export interface Roadmap {
  goal: string;
  difficulty?: string;
  commitment?: string;
  duration: string;
  summary: string;
  tech_stack_overview?: string[];
  weekly_plan: WeekPlan[];
  projects: Project[];
  resources: {
    youtube: Resource[];
    courses: Resource[];
    documentation: Resource[];
    github_repos: Resource[];
  };
  quizzes: Quiz[];
}
