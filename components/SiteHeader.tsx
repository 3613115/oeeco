"use client";

import { Search, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SiteHeader() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = query.trim();
    router.push(next ? `/?q=${encodeURIComponent(next)}` : "/");
  }

  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="oeeco home">
        <span className="brand-mark">oe</span>
        <span className="brand-name">oeeco</span>
      </Link>

      <form className="search-shell" onSubmit={handleSearch}>
        <Search size={18} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          placeholder="Search works, creators, tags"
          aria-label="Search works, creators, tags"
        />
      </form>

      <nav className="nav-links" aria-label="Main navigation">
        <Link href="/">Explore</Link>
        <Link href="/latest">Latest</Link>
        <Link href="/rank">Leaderboard</Link>
        <Link href="/upload">
          <Upload size={16} aria-hidden="true" />
          Submit
        </Link>
      </nav>

      <Link className="avatar-button" href="/account" aria-label="My account">
        <Image src="/assets/avatar-neo.png" width={30} height={30} alt="" />
      </Link>
    </header>
  );
}
