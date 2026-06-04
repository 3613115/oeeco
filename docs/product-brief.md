# oeeco 产品设计草案

## 定位

oeeco 是一个 AI 创作者作品广场。创作者上传小游戏、网页工具、互动实验和视觉作品，观众可以浏览、试玩、喜欢、收藏、评论和关注创作者。

## 第一版页面

- 首页作品流
- 作品详情页
- 试玩页
- 上传作品页
- 创作者主页
- 热门榜单

## MVP 数据模型

### profiles

- id
- username
- display_name
- avatar_url
- bio
- created_at

### works

- id
- creator_id
- title
- summary
- description
- category
- cover_url
- demo_url
- tool_stack
- status
- views_count
- likes_count
- collections_count
- created_at
- updated_at

### work_tags

- id
- work_id
- tag

### comments

- id
- work_id
- user_id
- body
- created_at

### likes

- id
- work_id
- user_id
- created_at

### collections

- id
- work_id
- user_id
- created_at

## 早期审核规则

- 禁止恶意网页、钓鱼链接和诱导下载。
- 禁止侵犯他人版权、商标、肖像权。
- 禁止色情、仇恨、暴力煽动和诈骗内容。
- 用户上传外链默认进入待审核。
- 被举报作品先隐藏，再由管理员复核。

## 上线步骤

1. 在 GitHub 创建仓库。
2. 将代码推到仓库。
3. 在 Vercel 导入仓库。
4. 在 Supabase 创建项目。
5. 配置环境变量。
6. 在 Namecheap DNS 里把 `oeeco.com` 和 `www.oeeco.com` 指到 Vercel。
7. 在 Supabase Auth 设置 `https://oeeco.com` 和 Vercel preview redirect URL。
