# oeeco

oeeco 是一个面向 AI/Codex 创作者的作品展示与试玩平台。创作者可以发布小游戏、网页工具、互动实验和视觉作品，观众可以浏览、试玩、喜欢、收藏、评论和关注创作者。

当前工程已经迁移为 Next.js，可直接部署到 Vercel。

## 功能

- 首页作品流
- 分类、搜索、推荐/热门/最新排序
- 作品详情页
- iframe 试玩页
- 上传作品表单，本地草稿预览
- 创作者主页
- 热门榜单
- Supabase 客户端与数据库 SQL 草案

## 本地开发

```powershell
npm install
npm run dev
```

这台电脑如果全局 `node` 或 `npm` 不可用，可以用项目里的 helper：

```powershell
powershell -ExecutionPolicy Bypass -File C:\oeeco\scripts\dev.ps1
```

访问：

```txt
http://127.0.0.1:3000
```

## 环境变量

复制 `.env.example` 为 `.env.local`，填入 Supabase 项目的公开配置：

```txt
NEXT_PUBLIC_SITE_URL=https://oeeco.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

不要把 `service_role` 密钥放到前端环境变量里。

## Supabase

在 Supabase SQL Editor 运行：

```txt
supabase/schema.sql
```

建议建立两个 public storage bucket：

- `avatars`
- `covers`

## 部署

1. 推送到 GitHub。
2. Vercel 导入 GitHub 仓库。
3. 在 Vercel 设置环境变量。
4. 在 Vercel 添加 `oeeco.com` 和 `www.oeeco.com`。
5. 在 Namecheap 按 Vercel 提示配置 DNS。
6. 在 Supabase Auth 里设置 Site URL 和 Redirect URLs。
