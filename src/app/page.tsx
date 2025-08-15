"use client";
import { useState } from "react";
import SearchBox from "./components/SearchBox";
import RepositoryList from "./components/RepositoryList";

export default function Home() {
const [isSearching, setIsSearching] = useState<boolean>(false);
  return (
    <>
      <SearchBox setIsSearching={setIsSearching} />
      {!isSearching && <RepositoryList />}
    </>
  );
}
