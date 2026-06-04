import Link from "next/link";

export default function NotFound() {
  return (
    <section className="empty-state surface">
      <h1 className="page-title">没有找到这个页面</h1>
      <p>回到广场看看其他作品。</p>
      <Link className="solid-button" href="/">
        回到广场
      </Link>
    </section>
  );
}
