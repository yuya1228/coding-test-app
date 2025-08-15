import { NextRequest } from "next/server";
import Image from "next/image";

export default async function RepoDetail({
  params,
}: {
  params: { name: string };
}) {
  const owner = "yuya1228"; // Replace with the actual owner or fetch dynamically
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${params.name}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("リポジトリが見つかりませんでした。");
  }

  const repo = await res.json();

  return (
    <div>
      <h1>{repo.name}</h1>
      <Image
        src={repo.owner.avatar_url}
        alt="username"
        width={48}
        height={48}
        className="rounded-full"
      />
      <p>{repo.description}</p>
      <p>Star数 {repo.stargazers_count}</p>
      <a href={repo.html_url} target="_blank" rel="noreferrer">
        GitHubで見る
      </a>
    </div>
  );
}
