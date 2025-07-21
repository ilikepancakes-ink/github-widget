# GitHub Repository Widget

A clean, minimal web widget that displays the top 5 public repositories for a GitHub user. Built with Next.js and Tailwind CSS, optimized for Vercel deployment.

## Features

- 🎨 Clean, minimal design optimized for 400x350 embedding
- 🌙 Dark mode support
- 📱 Responsive layout
- ⚡ Fast loading with GitHub API
- 🏢 Includes organization repositories where user has commits
- 🚀 Ready for Vercel deployment

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to see the widget

## Embedding

The widget is designed to fit perfectly in a 400x350 pixel window. You can embed it in:
- Websites as an iframe
- Desktop applications
- Portfolio pages
- GitHub profile READMEs

## Customization

To change the GitHub user, edit the `username` prop in `src/app/page.tsx`:

```tsx
<GitHubWidget username="your-github-username" />
```

The widget automatically:
- Fetches user's personal repositories
- Finds organization repositories where the user has made commits
- Displays the top 5 repositories sorted by stars and activity
- Shows organization name for non-personal repositories

## Deploy on Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Deploy with default settings

The widget will be live at your Vercel URL!

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **GitHub API** - Repository data
