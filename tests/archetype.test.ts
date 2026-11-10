import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeArchetype } from '@/lib/github';
import { LanguageDistribution, Repository } from '@/types';

test('analyzeArchetype identifies Frontend Architect', () => {
  const languages: LanguageDistribution[] = [
    { name: 'TypeScript', bytes: 60000, percentage: 60, color: '#3178c6' },
    { name: 'CSS', bytes: 25000, percentage: 25, color: '#563d7c' },
    { name: 'HTML', bytes: 15000, percentage: 15, color: '#e34c26' },
  ];
  const repos: Repository[] = [
    {
      name: 'react-ui-components',
      full_name: 'user/react-ui-components',
      description: 'Modern Tailwind and React design system',
      html_url: 'https://github.com/user/react-ui-components',
      stargazers_count: 50,
      forks_count: 5,
      language: 'TypeScript',
      fork: false,
    },
  ];

  const archetype = analyzeArchetype(languages, repos, 'Building UI/UX and web apps');
  assert.equal(archetype.id, 'frontend');
  assert.equal(archetype.label, 'Frontend Architect');
  assert.ok(archetype.dominantLanguages?.includes('TypeScript'));
});

test('analyzeArchetype identifies Backend Specialist', () => {
  const languages: LanguageDistribution[] = [
    { name: 'Go', bytes: 70000, percentage: 70, color: '#00ADD8' },
    { name: 'Rust', bytes: 30000, percentage: 30, color: '#dea584' },
  ];
  const repos: Repository[] = [
    {
      name: 'distributed-kv',
      full_name: 'user/distributed-kv',
      description: 'High throughput distributed database microservice',
      html_url: 'https://github.com/user/distributed-kv',
      stargazers_count: 120,
      forks_count: 12,
      language: 'Go',
      fork: false,
    },
  ];

  const archetype = analyzeArchetype(languages, repos, 'Distributed systems and low latency microservices');
  assert.equal(archetype.id, 'backend');
  assert.equal(archetype.label, 'Backend / Systems Specialist');
});

test('analyzeArchetype identifies AI & Data Specialist', () => {
  const languages: LanguageDistribution[] = [
    { name: 'Python', bytes: 60000, percentage: 60, color: '#3572A5' },
    { name: 'Jupyter Notebook', bytes: 40000, percentage: 40, color: '#DA5B0B' },
  ];
  const repos: Repository[] = [
    {
      name: 'llm-agent-pipeline',
      full_name: 'user/llm-agent-pipeline',
      description: 'Machine learning deep learning torch neural network for data science',
      html_url: 'https://github.com/user/llm-agent-pipeline',
      stargazers_count: 85,
      forks_count: 10,
      language: 'Python',
      fork: false,
    },
  ];

  const archetype = analyzeArchetype(languages, repos, 'AI Researcher & Data Scientist');
  assert.equal(archetype.id, 'ai_data');
  assert.equal(archetype.label, 'AI & Data Specialist');
});

test('analyzeArchetype identifies DevOps & Cloud Engineer', () => {
  const languages: LanguageDistribution[] = [
    { name: 'HCL', bytes: 50000, percentage: 50, color: '#844fba' },
    { name: 'Dockerfile', bytes: 30000, percentage: 30, color: '#384d54' },
    { name: 'Shell', bytes: 20000, percentage: 20, color: '#89e051' },
  ];
  const repos: Repository[] = [
    {
      name: 'terraform-k8s-infra',
      full_name: 'user/terraform-k8s-infra',
      description: 'Kubernetes cluster automation and CI/CD pipelines',
      html_url: 'https://github.com/user/terraform-k8s-infra',
      stargazers_count: 45,
      forks_count: 8,
      language: 'HCL',
      fork: false,
    },
  ];

  const archetype = analyzeArchetype(languages, repos, 'Cloud Infrastructure, SRE & Kubernetes');
  assert.equal(archetype.id, 'devops');
  assert.equal(archetype.label, 'DevOps & Cloud Engineer');
});

test('analyzeArchetype identifies Fullstack when both frontend and backend are prominent', () => {
  const languages: LanguageDistribution[] = [
    { name: 'TypeScript', bytes: 40000, percentage: 40, color: '#3178c6' },
    { name: 'Go', bytes: 40000, percentage: 40, color: '#00ADD8' },
    { name: 'HTML', bytes: 20000, percentage: 20, color: '#e34c26' },
  ];
  const repos: Repository[] = [
    {
      name: 'fullstack-saas',
      full_name: 'user/fullstack-saas',
      description: 'End to end web app with React frontend and Go backend',
      html_url: 'https://github.com/user/fullstack-saas',
      stargazers_count: 60,
      forks_count: 10,
      language: 'TypeScript',
      fork: false,
    },
  ];

  const archetype = analyzeArchetype(languages, repos);
  assert.equal(archetype.id, 'fullstack');
  assert.equal(archetype.label, 'Full-Stack Generalist');
});
