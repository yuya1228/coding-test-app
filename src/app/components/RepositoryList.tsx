"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RepositoryList() {
  type Owner = {
    avatar_url: string;
  };

  type Repo = {
    id: number;
    name: string;
    html_url: string;
    owner: Owner;
  };

  const [repos, setRepos] = useState<Repo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch("/api/repos");
        const data = await res.json();
        setRepos(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
        setError("リポジトリの取得に失敗しました。");
      }
    };
    fetchRepos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">自分のリポジトリ一覧</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-4">
        {repos.map((repo) => (
          <li key={repo.id}>
            <div className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md">
              <Image
                src={repo.owner.avatar_url}
                alt="username"
                width={48}
                height={48}
                className="rounded-full"
              />
              <Link
                href={`/repos/${repo.name}`}
                className="text-lg font-medium"
              >
                {repo.name}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
