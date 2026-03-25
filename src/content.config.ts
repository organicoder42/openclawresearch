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

export const collections = { tasks, bounties };
