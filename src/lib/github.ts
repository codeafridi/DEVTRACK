import { Octokit } from "octokit";

export function createOctokit(token?: string | null) {
  return new Octokit(token ? { auth: token } : {});
}

export async function fetchUserRepos(username: string, token?: string | null) {
  const octokit = createOctokit(token);
  try {
    const { data } = await octokit.rest.repos.listForUser({
      username,
      sort: "updated",
      per_page: 10,
      type: "owner",
    });
    return data.map((repo) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.updated_at,
    }));
  } catch {
    return [];
  }
}

export async function fetchCommitActivity(
  username: string,
  token?: string | null
) {
  const octokit = createOctokit(token);
  try {
    const { data } = await octokit.rest.search.commits({
      q: `author:${username} committer-date:>${getDateWeeksAgo(12)}`,
      sort: "committer-date",
      order: "desc",
      per_page: 100,
    });

    const weeklyCommits: Record<string, number> = {};
    for (const item of data.items) {
      const date = new Date(item.commit.committer?.date || "");
      const weekStart = getWeekStart(date);
      weeklyCommits[weekStart] = (weeklyCommits[weekStart] || 0) + 1;
    }

    return {
      totalCommits: data.total_count,
      weeklyCommits,
      recentCommits: data.items.slice(0, 10).map((item) => ({
        message: item.commit.message.split("\n")[0],
        date: item.commit.committer?.date,
        repo: item.repository?.full_name,
        url: item.html_url,
      })),
    };
  } catch {
    return { totalCommits: 0, weeklyCommits: {}, recentCommits: [] };
  }
}

function getDateWeeksAgo(weeks: number): string {
  const d = new Date();
  d.setDate(d.getDate() - weeks * 7);
  return d.toISOString().split("T")[0];
}

function getWeekStart(date: Date): string {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split("T")[0];
}
