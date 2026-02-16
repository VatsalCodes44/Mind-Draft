
# Mind Draft ✍️

A modern, feature-rich blogging platform built with cutting-edge technologies, enabling seamless content creation and community engagement.

![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) ![Hono](https://img.shields.io/badge/-Hono-E36002?style=flat-square&logo=hono&logoColor=white) ![Cloudflare](https://img.shields.io/badge/-Cloudflare-F38020?style=flat-square&logo=cloudflare&logoColor=white)

## 🌟 Overview

Mind Draft is a full-stack blogging platform that empowers users to express their thoughts through beautifully crafted articles. With a powerful text editor, social features, and a serverless architecture, it delivers a smooth and responsive writing experience.

## ✨ Features

### 📝 Content Creation

-   **Rich Text Editor** - Professional-grade editor for creating and formatting blog posts
-   **Draft Management** - Save and edit drafts before publishing
-   **Image Upload** - Add images to your profile and content

### 🤝 Social Features

-   **Like & Share** - Engage with content through likes and share blogs with others
-   **Comments** - Comment on blog posts and participate in discussions
-   **Comment Likes** - Show appreciation for insightful comments
-   **Bookmarks** - Save your favorite blogs for later reading

### 👤 User Profiles

-   **Custom Profiles** - Create and personalize your author profile
-   **Profile Pictures** - Upload and display your profile image
-   **Author Pages** - Showcase all your published content

## 🛠️ Tech Stack

### Frontend

-   **React** - UI library for building interactive interfaces
-   **TypeScript** - Type-safe development
-   **Tailwind CSS** - Utility-first CSS framework for styling

### Backend

-   **Hono** - Lightweight, ultrafast web framework optimized for edge
-   **Prisma** - Next-generation ORM for database management
-   **Zod** - TypeScript-first schema validation

> **Note:** The backend runs on Cloudflare Workers, which uses V8 isolates instead of Node.js. This provides faster cold starts and better performance at the edge.

### Infrastructure

-   **Cloudflare Workers** - Serverless execution environment (V8 isolates, not Node.js)
-   **Postgres** - Database (via Prisma)

## 📦 Project Structure

```
mind-draft/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
│
└── backend/
    ├── src/
    │   ├── routes/         # API routes
    │   ├── controllers/    # Request handlers
    │   ├── middleware/     # Custom middleware
    │   └── utils/          # Helper functions
    └── prisma/
        └── schema.prisma   # Database schema

```

## 🔑 Key Features in Detail

### Text Editor

The integrated rich text editor provides:

-   Formatting options (bold, italic, headings)
-   Lists and code blocks
-   Image embedding
-   Real-time preview

### Engagement System

Users can:

-   Like blog posts to show appreciation
-   Share content across platforms
-   Save posts for later reading
-   Comment and reply to discussions
-   Like individual comments

### Profile Management

-   Customizable user profiles
-   Profile picture upload and management
-   Author bio and information
-   Personal blog collection display

## 🌐 Deployment

### Backend (Cloudflare Workers)

```bash
cd backend

# Deploy to production
wrangler deploy

# Deploy to staging
wrangler deploy --env staging

```

### Frontend

```bash
cd frontend
npm run build

# Deploy to Cloudflare Pages (recommended)
wrangler pages deploy dist

# Or deploy to your preferred hosting service (Vercel, Netlify, etc.)

```

### Environment Variables

Set production secrets using Wrangler:

```bash
wrangler secret put DATABASE_URL
wrangler secret put JWT_SECRET
wrangler secret put CLOUDFLARE_ACCOUNT_ID

```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](https://claude.ai/chat/LICENSE) file for details.



##  Acknowledgments

-   Thanks to all contributors
-   Inspired by modern blogging platforms
-   Built with passion for writing and sharing knowledge

## 📧 Contact

For questions or feedback, reach out at: mahajanvatsal44@gmail.com

----------

**Made with ❤️ and React**
