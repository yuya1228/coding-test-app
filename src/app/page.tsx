"use client";
import SearchBox from "./components/SearchBox";
import RepositoryList from "./components/RepositoryList";

export default function Home() {
  return (
    <>
      <SearchBox />
      <RepositoryList />
    </>
  );
}
