import GitHubWidget from '@/components/GitHubWidget';

export default function Home() {
  return (
    <div className="w-[400px] h-[350px] bg-white dark:bg-gray-950 p-3 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="text-center mb-3 flex-shrink-0">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            ilikepancakes-ink
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Top repositories
          </p>
        </div>

        <div className="flex-1 overflow-hidden">
          <GitHubWidget username="ilikepancakes-ink" />
        </div>
      </div>
    </div>
  );
}
