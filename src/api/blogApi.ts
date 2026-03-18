import type { BlogPost } from '../types/blog';

const BLOG_ITEMS: BlogPost[] = [
  {
    id: 'remote-hiring-playbook',
    title: 'The 2026 Remote Hiring Playbook for High-Growth Startups',
    excerpt:
      'A practical framework for finding, vetting, and onboarding top global freelancers without slowing delivery.',
    content:
      'Remote hiring is no longer optional for fast-moving companies. In this guide we break down role scoping, outcomes-based briefs, and interviewing signals that improve hiring quality while lowering cycle time.',
    category: 'Hiring',
    createdAt: '2026-02-18T09:00:00.000Z',
  },
  {
    id: 'freelancer-proposal-checklist',
    title: 'Proposal Checklist: How Freelancers Win Better-Fit Projects',
    excerpt:
      'Use this checklist to write concise proposals that clarify scope, timeline, risk, and outcomes for clients.',
    content:
      'Winning proposals focus on outcomes, not biographies. This article outlines structure, trust signals, and lightweight discovery questions that increase response rate and close speed.',
    category: 'Freelancing',
    createdAt: '2026-01-30T12:30:00.000Z',
  },
  {
    id: 'contract-readiness-guide',
    title: 'Contract Readiness: From Proposal to Kickoff in 48 Hours',
    excerpt:
      'Learn how to standardize scope and handoff steps so clients and freelancers can begin work quickly and safely.',
    content:
      'Most project delays happen between acceptance and kickoff. We provide a lightweight contract-readiness workflow with milestones, acceptance criteria, and communication rhythms.',
    category: 'Operations',
    createdAt: '2025-12-14T16:20:00.000Z',
  },
];

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getBlogPosts(): Promise<{ items: BlogPost[] }> {
  await wait(450);
  return { items: BLOG_ITEMS };
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  await wait(300);
  return BLOG_ITEMS.find((item) => item.id === id) ?? null;
}
