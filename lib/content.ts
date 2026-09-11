import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import { POSTS as SEED_POSTS, PROJECTS as SEED_PROJECTS, type Post, type Project } from './site';



const DIR = process.env.CONTENT_DIR || path.join(process.cwd(), '.content');
const POSTS_FILE = path.join(DIR, 'posts.json');
const PROJECTS_FILE = path.join(DIR, 'projects.json');


export const UPLOADS_DIR = path.join(DIR, 'uploads');
export const UPLOADS_URL = '/uploads';


async function ensureSeeded(file: string, seed: unknown): Promise<void> {
  try {
    await fs.access(file);
    return;
  } catch {

  }
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.seed`;
  await fs.writeFile(tmp, JSON.stringify(seed, null, 2), 'utf8');
  try {
    await fs.rename(tmp, file);
  } catch {


    try {
      await fs.unlink(tmp);
    } catch {

    }
  }
}

async function readJson<T>(file: string, seed: T): Promise<T> {
  try {
    await ensureSeeded(file, seed);
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw) as T;
  } catch {



    return seed;
  }
}


async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmp, file);
}


export { slugify } from './slugify';


export async function getPosts(): Promise<Post[]> {
  return readJson<Post[]>(POSTS_FILE, SEED_POSTS);
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}


export async function savePost(post: Post): Promise<void> {
  const posts = await getPosts();
  const i = posts.findIndex((p) => p.slug === post.slug);
  if (i >= 0) posts[i] = post;
  else posts.unshift(post);
  await writeJson(POSTS_FILE, posts);
}

export async function deletePost(slug: string): Promise<void> {
  const posts = (await getPosts()).filter((p) => p.slug !== slug);
  await writeJson(POSTS_FILE, posts);
}


export async function getProjects(): Promise<Project[]> {
  return readJson<Project[]>(PROJECTS_FILE, SEED_PROJECTS);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.slug === slug);
}


export async function saveProject(project: Project): Promise<void> {
  const projects = await getProjects();
  const i = projects.findIndex((p) => p.slug === project.slug);
  if (i >= 0) projects[i] = project;
  else projects.unshift(project);
  await writeJson(PROJECTS_FILE, projects);
}

export async function deleteProject(slug: string): Promise<void> {
  const projects = (await getProjects()).filter((p) => p.slug !== slug);
  await writeJson(PROJECTS_FILE, projects);
}
