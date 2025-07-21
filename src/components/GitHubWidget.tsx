'use client';

import { useState, useEffect } from 'react';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  pushed_at: string;
}

interface GitHubEvent {
  type: string;
  repo?: {
    name: string;
  };
}

interface GitHubWidgetProps {
  username: string;
}

export default function GitHubWidget({ username }: GitHubWidgetProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user's public repositories
        const userReposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100`
        );

        if (!userReposResponse.ok) {
          throw new Error(`GitHub API error: ${userReposResponse.status}`);
        }

        const userRepos: Repository[] = await userReposResponse.json();

        // Fetch user's recent events to find organization repositories they've contributed to
        const eventsResponse = await fetch(
          `https://api.github.com/users/${username}/events/public?per_page=100`
        );

        let orgRepos: Repository[] = [];

        if (eventsResponse.ok) {
          const events: GitHubEvent[] = await eventsResponse.json();

          // Extract unique repository names from push events
          const orgRepoNames = new Set<string>();

          events.forEach((event) => {
            if (event.type === 'PushEvent' && event.repo && event.repo.name) {
              // Check if it's not the user's own repository
              if (!event.repo.name.startsWith(`${username}/`)) {
                orgRepoNames.add(event.repo.name);
              }
            }
          });

          // Fetch details for each organization repository
          const orgRepoPromises = Array.from(orgRepoNames).slice(0, 20).map(async (repoName) => {
            try {
              const repoResponse = await fetch(`https://api.github.com/repos/${repoName}`);
              if (repoResponse.ok) {
                const repo = await repoResponse.json();
                // Only include public repositories
                if (!repo.private) {
                  return repo;
                }
              }
            } catch {
              // Ignore individual repo fetch errors
            }
            return null;
          });

          const orgRepoResults = await Promise.all(orgRepoPromises);
          orgRepos = orgRepoResults.filter(repo => repo !== null) as Repository[];
        }

        // Combine user repos and org repos
        const allRepos = [...userRepos, ...orgRepos];

        // Remove duplicates and filter repositories with recent activity
        const uniqueRepos = allRepos
          .filter((repo, index, self) =>
            repo.pushed_at &&
            self.findIndex(r => r.id === repo.id) === index
          )
          .sort((a, b) => {
            // Sort by stars first, then by recent activity
            const starDiff = b.stargazers_count - a.stargazers_count;
            if (starDiff !== 0) return starDiff;
            return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
          })
          .slice(0, 5); // Get top 5

        setRepositories(uniqueRepos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [username]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language: string | null) => {
    const colors: { [key: string]: string } = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      C: '#555555',
      'C#': '#239120',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Dart: '#00B4AB',
      HTML: '#e34c26',
      CSS: '#1572B6',
      Shell: '#89e051',
      Vue: '#2c3e50',
      React: '#61dafb',
    };
    return colors[language || ''] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-3 text-center">
        <div className="text-red-600 dark:text-red-400 text-xs">{error}</div>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-center">
        <div className="text-gray-500 dark:text-gray-400 text-xs">No repositories found</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
      <div className="space-y-2 pr-1">
        {repositories.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {repo.full_name.split('/')[1]}
                </h3>
                {repo.full_name.split('/')[0] !== username && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {repo.full_name.split('/')[0]}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                {repo.stargazers_count > 0 && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{repo.stargazers_count}</span>
                  </div>
                )}
                {repo.language && (
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                    ></div>
                    <span>{repo.language}</span>
                  </div>
                )}
              </div>
            </div>

            {repo.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 leading-relaxed">
                {repo.description}
              </p>
            )}

            <div className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(repo.updated_at)}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
