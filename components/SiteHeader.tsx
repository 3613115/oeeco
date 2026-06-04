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
      <Link className="brand" href="/" aria-label="oeeco 首页">
        <span className="brand-mark">oe</span>
        <span className="brand-name">oeeco</span>
      </Link>

      <form className="search-shell" onSubmit={handleSearch}>
        <Search size={18} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          placeholder="搜索作品、创作者、标签"
          aria-label="搜索作品、创作者、标签"
        />
      </form>

      <nav className="nav-links" aria-label="主导航">
        <Link href="/">广场</Link>
        <Link href="/rank">榜单</Link>
        <Link href="/upload">
          <Upload size={16} aria-hidden="true" />
          上传
        </Link>
      </nav>

      <Link className="avatar-button" href="/creators/neo" aria-label="我的主页">
        <Image src="/assets/avatar-neo.png" width={30} height={30} alt="" />
      </Link>
    </header>
  );
}
