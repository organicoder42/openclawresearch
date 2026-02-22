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
    successCriteria: z.array(z.string()),
    resources: z.array(z.object({
      name: z.string(),
      url: z.string(),
    })),
  }),
});

export const collections = { tasks };
