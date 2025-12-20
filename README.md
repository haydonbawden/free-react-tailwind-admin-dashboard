# Contract Reviewer - AI-Powered Legal Contract Analysis

Contract Reviewer is an intelligent contract analysis application built on **React 19, TypeScript, and Tailwind CSS**. It leverages AI to automatically review legal documents, identify risk clauses, and provide actionable recommendations.

This application demonstrates a complete AI-powered SaaS solution with multi-tenant architecture, secure authentication, and real-time document processing capabilities.

![Contract Reviewer Dashboard Preview](./banner.png)

## Overview

> **⚠️ PRODUCTION READINESS:** This application is currently **NOT production ready**. Please review the [Production Readiness Report](./PRODUCTION_READINESS_REPORT.md) for a comprehensive assessment of what needs to be completed before deploying to production. Baseline testing, CI, error boundaries, and authentication guards have been added, but coverage is limited and additional hardening is required before launch.

Contract Reviewer is a well-architected application that combines modern web technologies with AI capabilities to deliver:

- **AI-Powered Analysis**: OpenAI integration for intelligent contract review
- **Multi-Tenant Architecture**: Secure tenant isolation with Supabase RLS
- **Real-Time Processing**: Edge Functions for document processing
- **Interactive PDF Viewer**: Visual overlay of identified risk clauses
- **Comprehensive Dashboard**: Metrics, document management, and analytics

### Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (Auth, Storage, Database, Edge Functions)
- **AI**: OpenAI GPT-4 for contract analysis
- **PDF Processing**: PDF.js for document rendering
- **Deployment**: Vite for optimized builds

## Features

### Core Functionality

- **📄 Document Upload & Storage**: Secure document upload with Supabase Storage
- **🤖 AI Contract Analysis**: Automated clause detection and risk assessment
- **📊 Risk Dashboard**: Real-time metrics and document status tracking
- **🔍 Interactive PDF Viewer**: Visual highlighting of risk clauses on documents
- **📝 Detailed Analysis**: Clause-by-clause breakdown with explanations and recommendations
- **👥 Multi-Tenant Support**: Secure tenant isolation with Row-Level Security (RLS)
- **🔐 Authentication**: Secure user authentication via Supabase Auth
- **⚙️ Settings Management**: User profile and preferences configuration

### UI Components

- **Responsive Dashboard**: Mobile-first design with adaptive layouts
- **Dark Mode**: Full dark mode support with theme persistence
- **Modern UI Components**: Modals, dropdowns, tooltips, badges, and more
- **Data Visualization**: Charts and metrics for analytics
- **Form Elements**: Comprehensive form inputs with validation
- **Document Management**: Table views with sorting and filtering
- **Empty States**: User-friendly empty state components

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 18.x or later (20.x+ recommended)
- **npm** or **yarn**: Package manager
- **Supabase Account**: For backend services (optional for development with mock data)
- **OpenAI API Key**: For AI contract analysis (optional for development with mock data)

### Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/haydonbawden/free-react-tailwind-admin-dashboard.git
   cd free-react-tailwind-admin-dashboard
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

4. **Build for production**:

   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

### Testing & Quality Checks

- **Run tests**: `npm test`
- **Watch mode**: `npm run test:watch`
- **Lint**: `npm run lint`

### Environment Setup

For full functionality with Supabase and OpenAI, you need to configure environment variables:

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Fill in your credentials** in the `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Get your Supabase credentials**:
   - Create a project at [supabase.com](https://supabase.com)
   - Go to Project Settings → API
   - Copy the Project URL and anon/public key

4. **Configure Edge Functions** (for AI features):
   - Set environment variables in Supabase Dashboard
   - Go to Edge Functions → Manage secrets
   - Add: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`

> **Note:** The application can run without environment variables for UI development, but authentication and AI features will not function.

## Architecture

### Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── auth/        # Authentication forms
│   ├── contracts/   # Contract-specific components
│   ├── ui/          # Generic UI components
│   ├── form/        # Form elements
│   └── ...
├── pages/           # Page components
│   ├── Dashboard/   # Dashboard views
│   ├── Documents/   # Document management
│   ├── AuthPages/   # Sign in/up pages
│   └── Settings/    # Settings pages
├── hooks/           # Custom React hooks
├── context/         # React context providers
├── data/            # Mock data and types
└── layout/          # Layout components

supabase/
└── functions/       # Edge Functions
    ├── process_document/    # AI document processing
    ├── generate_report/     # PDF report generation
    └── _shared/            # Shared utilities
```

### Key Technologies

- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first styling with latest features
- **React Router v7**: Client-side routing
- **Supabase**: Backend-as-a-Service
  - Authentication
  - PostgreSQL Database with RLS
  - Storage for documents
  - Edge Functions for serverless compute
- **OpenAI GPT-4**: AI contract analysis
- **PDF.js**: Client-side PDF rendering
- **Vite**: Fast build tool and dev server

### Supabase Edge Functions

The application includes serverless Edge Functions for:

1. **process_document**: Analyzes uploaded contracts using OpenAI
2. **generate_report**: Creates PDF reports from analysis results
3. **analysis**: Additional analysis utilities

These functions use:
- OpenAI API for intelligent contract review
- Chromium for PDF generation
- Supabase SDK for data persistence

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## How It Works

### Document Analysis Flow

1. **Upload**: User uploads a contract document (PDF/DOCX)
2. **Storage**: Document is stored securely in Supabase Storage
3. **Processing**: Edge Function triggers AI analysis
4. **AI Analysis**: OpenAI GPT-4 analyzes the contract:
   - Identifies clauses
   - Assesses risk levels (High/Medium/Low)
   - Provides explanations and recommendations
   - Generates bounding boxes for visual overlays
5. **Storage**: Analysis results stored in PostgreSQL
6. **Display**: User views results with interactive PDF overlay
7. **Report**: Optional PDF report generation

### Multi-Tenant Security

- Row-Level Security (RLS) policies ensure data isolation
- Tenant ID attached to all user sessions
- All queries automatically filtered by tenant
- Secure authentication via Supabase Auth

## Changelog

### Version 2.0.2 - Bug Fixes [December 2025]

#### Security Updates
- Fixed 9 security vulnerabilities in dependencies
- Updated Babel, ESLint, esbuild, and React Router packages
- All dependencies now secure and up-to-date

#### Code Quality Improvements
- Fixed TypeScript `any` type usage across codebase
- Improved type safety in PDF.js integration
- Enhanced error handling in Edge Functions
- Fixed ESLint errors and improved code quality
- Build now completes without warnings or errors

### Version 2.0.2 - [March 25, 2025]

- Upgraded to React 19
- Included overrides for packages to prevent peer dependency errors
- Migrated from react-flatpickr to flatpickr package for React 19 support

### Version 2.0.1 - [February 27, 2025]

- Upgraded to Tailwind CSS v4 for better performance and efficiency
- Updated class usage to match the latest syntax and features
- Replaced deprecated class and optimized styles

### Version 2.0.0 - [February 2025]

A major update with comprehensive redesign and modern React patterns.

#### Major Improvements
- Complete UI redesign with modern React patterns
- AI-powered contract analysis integration
- Multi-tenant architecture with Supabase
- Interactive PDF viewer with overlay highlighting
- Edge Functions for serverless processing
- Enhanced navigation with React Router integration

## Documentation

This project includes comprehensive documentation:

- **[Production Readiness Report](./PRODUCTION_READINESS_REPORT.md)**: Detailed assessment of production readiness with actionable recommendations
- **[UI Audit Report](./UI_AUDIT_REPORT.md)**: Comprehensive accessibility and design system audit

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is released under the MIT License.

## Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Supabase](https://supabase.com/)
- AI analysis by [OpenAI](https://openai.com/)
- PDF rendering by [PDF.js](https://mozilla.github.io/pdf.js/)

## Support

If you find this project helpful, please consider giving it a star ⭐ on GitHub!
