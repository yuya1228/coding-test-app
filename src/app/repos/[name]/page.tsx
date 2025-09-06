import Image from "next/image";
import Link from "next/link";

export default async function RepoDetail({
  params,
}: {
  params: { name: string };
}) {
  const { name } = params;
  const owner = "yuya1228";
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("リポジトリが見つかりませんでした。");
  }

  const repo = await res.json();

  return (
    <div className="max-w-md mx-auto mt-40 bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Image
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          width={64}
          height={64}
          className="rounded-full border"
        />
        <div>
          <h1 className="text-xl font-bold text-black">
            リポジトリ: {repo.name}
          </h1>
          <p className="text-sm text-gray-500">
            使用言語: {repo.language || "言語未設定"}
          </p>
        </div>
      </div>

      {repo.description && (
        <p className="text-gray-700 text-sm">{repo.description}</p>
      )}

      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500">Star数</p>
          <p className="text-lg font-semibold text-gray-400">
            {repo.stargazers_count}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Watcher数</p>
          <p className="text-lg font-semibold text-gray-400">
            {repo.watchers_count}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Fork数</p>
          <p className="text-lg font-semibold text-gray-400">
            {repo.forks_count}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Issue数</p>
          <p className="text-lg font-semibold text-gray-400">
            {repo.open_issues_count}
          </p>
        </div>
      </div>
      <div className="text-right">
        <Link
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          GitHubで見る →
        </Link>
      </div>
    </div>
  );
}
