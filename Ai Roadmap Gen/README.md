# AI Roadmap Generator

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

An AI-powered application that generates personalized, week-by-week learning roadmaps for any skill or goal. Featuring a modern, premium UI with real-time AI generation.

## 🌟 Features

- **Personalized Learning Paths**: Generates custom roadmaps based on your specific goals (e.g., "Become a Machine Learning Engineer in 6 months").
- **Comprehensive Content**: Includes weekly milestones, curated resources, industry-level projects, and quizzes.
- **AI Mentor**: Integrated AI guidance to help you through your learning journey.
- **Modern UI/UX**: Built with a premium aesthetic using glassmorphism, smooth animations, and responsive design.
- **Interactive Elements**: Progress tracking and interactive roadmap visualization.

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Routing**: [React Router](https://reactrouter.com/)
- **Backend/AI**: [Supabase](https://supabase.com/) (Edge Functions)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Ai Roadmap Gen"
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your Supabase credentials and Google Gemini API key:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   
   # For Edge Functions (local development)
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
   *Note: You can get a Gemini API Key from [Google AI Studio](https://aistudio.google.com/).*

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:8080`.

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components (Shadcn, Feature-specific)
├── hooks/          # Custom React hooks
├── pages/          # Application pages (Index, NotFound)
├── lib/            # Utilities and helper functions
├── types/          # TypeScript definitions
└── App.tsx         # Main application component with routing
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
