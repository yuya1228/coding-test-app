"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SearchBox() {
  type Owner = {
    avatar_url: string;
  };

  type Repo = {
    id: number;
    name: string;
    html_url: string;
    owner: Owner;
  };

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Repo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query) {
      alert("リポジトリ名を入力してください！");
      return;
    }

    try {
      const res = await fetch(`/api/search?query=${query}`);
      if (!res.ok) {
        throw new Error("検索に失敗しました");
      }

      const data = await res.json();
      setResults(data.items); // 検索結果を保存
      setError(null); // エラーをリセット
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setResults(null); 
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white p-0.5 mt-2 w-2xs rounded text-black placeholder-gray-400"
            placeholder="リポジトリ名を入力してください"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white rounded-md px-4 py-1 mt-2"
          >
            検索
          </button>
        </div>
      </div>
      {results && (
        <div className="p-6">
          <h1 className="text-2xl mb-4">検索結果</h1>
          <ul className="space-y-4">
            {/* 検索結果のリポジトリを表示 */}
            {results.map((repo) => (
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
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </>
  );
}
