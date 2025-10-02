# Express React Form - Monorepo

A modern full-stack application for address management using Google Places API. This monorepo contains both the backend API and frontend web application.

## 🏗️ Architecture

This project is built using a monorepo structure with the following technologies:

### Backend (API)
- **Express.js** - Fast, minimalist web framework for Node.js
- **MongoDB** - NoSQL database for data persistence
- **JSON Schema Validator** - Validates both manual and dynamic form submissions
- **TypeScript** - Type-safe development

### Frontend (Web)
- **React** - Component-based UI library
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Google Places API** - Location autocomplete and address validation

## 📁 Project Structure

```
express-react-form/
├── apps/
│   ├── api/                 # Express.js backend
│   │   ├── src/
│   │   │   ├── index.ts     # Server entry point
│   │   │   ├── route.ts     # API routes
│   │   │   └── schema.ts    # JSON schema validators
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                 # React frontend
│       ├── src/
│       │   ├── components/
│       │   │   └── address/ # Address-related components
│       │   ├── utils/       # Utility functions and API clients
│       │   └── types/       # TypeScript type definitions
│       ├── package.json
│       └── vite.config.ts
├── docker-compose.yml       # MongoDB container configuration
├── mongo-init.js           # MongoDB initialization script
├── pnpm-workspace.yaml     # PNPM workspace configuration
└── package.json            # Root package.json
```

## ✨ Features

- **Address Autocomplete** - Real-time address suggestions using Google Places API
- **Form Validation** - Robust client and server-side validation using JSON schemas
- **Debounced Search** - Optimized API calls with input debouncing
- **Type Safety** - End-to-end TypeScript for better development experience
- **Error Handling** - Comprehensive error handling and user feedback
- **Docker Support** - Containerized MongoDB for easy development

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PNPM](https://pnpm.io/) package manager
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) for MongoDB container
- Google Places API key

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd express-react-form
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create `.env` file in `apps/web/`:
   ```env
   VITE_GOOGLE_API_KEY=your_google_places_api_key_here
   ```

   Create `.env` file in `apps/api/`:
   ```env
   MONGODB_URI=mongodb://localhost:27018/express-react-form
   PORT=3001
   ```

### Running the Application

Follow these steps to run the application locally:

#### 1. Open Docker Desktop
Make sure Docker Desktop is running on your machine.

#### 2. Start MongoDB Container
```bash
docker compose up -d
```
This will:
- Spin up a MongoDB container on port 27017
- Initialize the database with the configuration from `mongo-init.js`

#### 3. Start Development Servers
```bash
pnpm run dev
```
This will concurrently start:
- **API Server** on `http://localhost:3001`
- **Web Application** on `http://localhost:5173`

## 📋 API Endpoints

### Addresses
- `POST /v1/addresses` - Create a new address
  - Body: `{ countryCode: string, data: Place }`
  - Response: `{ message: string }`

### Google Places Integration
- The frontend integrates with Google Places API for:
  - Address autocomplete
  - Place details retrieval
  - Address validation

### Screenshots
**Google Places API**
![Auto Complete Form](/images/autocomplete.jpeg)

**Dynamic Form**
![Manual Form](/images/manual.jpeg)

## 📝 License

This project is licensed under the MIT License.
