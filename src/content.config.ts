import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tasks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tasks' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    difficulty: z.enum(['easy', 'moderate', 'advanced']),
    status: z.enum(['open', 'in-progress', 'completed']),
    prize: z.string().nullable(),
    icon: z.string(),
    order: z.number(),
    tags: z.array(z.string()).optional().default([]),
    successCriteria: z.array(z.string()),
    resources: z.array(z.object({
      name: z.string(),
      url: z.string(),
    })),
    sponsorable: z.boolean().optional().default(true),
    suggestedBountyAmount: z.number().optional(),
  }),
});

const bounties = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bounties' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    amount: z.number(),
    status: z.enum(['open', 'claimed', 'completed']),
    sponsor: z.object({
      name: z.string(),
      url: z.string().optional(),
    }),
    deadline: z.string().nullable(),
    relatedTask: z.string().nullable(),
    icon: z.string(),
    order: z.number(),
    deliverable: z.string(),
    claimedBy: z.string().nullable(),
    completedDate: z.string().nullable().optional(),
    resultUrl: z.string().nullable().optional(),
  }),
});

const stakeholders = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stakeholders' }),
  schema: z.object({
    name: z.string(),
    institution: z.string(),
    country: z.string(),
    role: z.enum(['researcher', 'advocate', 'sponsor', 'patient-org', 'clinician']),
    focus: z.array(z.string()),
    publicEmail: z.string().nullable().optional(),
    institutionUrl: z.string().optional(),
    orcid: z.string().optional(),
    website: z.string().optional(),
    recentPubs: z.array(z.object({
      title: z.string(),
      year: z.number(),
      doi: z.string().optional(),
      journal: z.string().optional(),
    })).optional().default([]),
    relevantFindings: z.array(z.string()).optional().default([]),
    outreachStatus: z.enum(['not-contacted', 'drafted', 'sent', 'responded', 'declined']).default('not-contacted'),
    priority: z.enum(['high', 'medium', 'low']).default('medium'),
    bio: z.string().optional(),
    addedDate: z.string(),
    lastVerified: z.string().optional(),
  }),
});

const outreach = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/outreach' }),
  schema: z.object({
    to: z.string(),
    purpose: z.enum(['research-promotion', 'intro-request', 'cross-researcher-intro', 'newsletter-invite', 'sponsor-pitch']),
    subject: z.string(),
    status: z.enum(['draft', 'approved', 'sent', 'responded', 'sent-no-response']).default('draft'),
    draftedBy: z.string(),
    draftedDate: z.string(),
    sentDate: z.string().nullable().optional(),
    attachments: z.array(z.string()).optional().default([]),
    publicExcerpt: z.boolean().optional().default(false),
    response: z.string().nullable().optional(),
  }),
});

const briefs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/briefs' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    publishedDate: z.string(),
    authors: z.array(z.string()),
    topic: z.string(),
    audiences: z.array(z.enum(['researchers', 'clinicians', 'patients', 'sponsors', 'advocates'])),
    relatedFindings: z.array(z.string()).optional().default([]),
    citations: z.array(z.object({
      title: z.string(),
      url: z.string().optional(),
      doi: z.string().optional(),
    })).optional().default([]),
  }),
});

const emailTemplates = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/email-templates' }),
  schema: z.object({
    name: z.string(),
    purpose: z.enum(['research-promotion', 'intro-request', 'cross-researcher-intro', 'newsletter-invite', 'sponsor-pitch']),
    description: z.string(),
    audience: z.array(z.enum(['researchers', 'clinicians', 'patients', 'sponsors', 'advocates'])),
    subject: z.string(),
  }),
});

export const collections = { tasks, bounties, stakeholders, outreach, briefs, emailTemplates };
