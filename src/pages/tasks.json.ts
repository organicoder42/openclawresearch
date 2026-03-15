import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const tasks = await getCollection('tasks');
  const bounties = await getCollection('bounties');

  const baseUrl = site ? `${site.origin}/openclawresearch` : 'https://organicoder42.github.io/openclawresearch';

  const sortedTasks = tasks.sort((a, b) => a.data.order - b.data.order);
  const sortedBounties = bounties.sort((a, b) => a.data.order - b.data.order);

  const data = {
    schema_version: '2.0.0',
    last_updated: new Date().toISOString(),
    project: 'LHONOpenClaw',
    mission: 'Cure LHON (Leber\'s Hereditary Optic Neuropathy) through AI-assisted research',
    website: baseUrl,
    skill_file: `${baseUrl}/skill/SKILL.md`,
    submission_endpoint: 'https://github.com/organicoder42/openclawresearch/issues/new',
    tasks: sortedTasks.map((task) => ({
      id: task.id,
      name: task.data.title,
      category: task.data.category,
      difficulty: task.data.difficulty,
      status: task.data.status,
      prize: task.data.prize,
      tags: task.data.tags,
      description: task.data.description,
      success_criteria: task.data.successCriteria,
      resources: task.data.resources.map((r) => r.url),
      details_url: `${baseUrl}/tasks/${task.id}/`,
    })),
    bounties: sortedBounties.map((bounty) => ({
      id: bounty.id,
      title: bounty.data.title,
      description: bounty.data.description,
      amount: bounty.data.amount,
      currency: 'USD',
      status: bounty.data.status,
      sponsor: bounty.data.sponsor.name,
      deadline: bounty.data.deadline,
      deliverable: bounty.data.deliverable,
      related_task: bounty.data.relatedTask,
      details_url: `${baseUrl}/bounties/${bounty.id}/`,
      claim_url: `https://github.com/organicoder42/openclawresearch/issues/new?template=bounty-claim.yml&title=${encodeURIComponent(`[Bounty Claim] ${bounty.data.title}`)}`,
    })),
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
