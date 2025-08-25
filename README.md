# ETL Pipeline for Phoenix API Data

A serverless ETL (Extract, Transform, Load) pipeline built with AWS Lambda and TypeScript that extracts project and span data from the Phoenix API and stores it in a PostgreSQL database.

## Overview

This ETL pipeline is designed to:
1. **Extract** project and root span data from the Phoenix API using GraphQL queries
2. **Transform** the data into a structured format suitable for analysis
3. **Load** the processed data into a PostgreSQL database for further analysis and annotation

The pipeline consists of multiple AWS Lambda functions that work together to handle different aspects of the data ingestion process.

## Architecture

### Lambda Functions

#### 1. **Entry Lambda** (`src/lambdas/entry/index.ts`)
- **Purpose**: Main orchestrator that fetches all projects and triggers individual project ingestion
- **Endpoint**: `GET /fetchAllProjects`
- **Memory**: 1.5GB
- **Flow**:
  - Fetches Phoenix API key from AWS Secrets Manager
  - Retrieves all projects from Phoenix API
  - Inserts project data into PostgreSQL
  - Triggers individual project ingestion lambdas (async in production, sync in development)

#### 2. **Project Ingestion Lambda** (`src/lambdas/ingestProject/index.ts`)
- **Purpose**: Processes root spans for individual projects
- **Endpoint**: `POST /fetchRootSpans`
- **Memory**: 2GB
- **Flow**:
  - Fetches root spans for a specific project using pagination
  - Processes spans in batches (max 50 iterations, 5-minute timeout)
  - Inserts span data into PostgreSQL
  - Updates project cursor for resuming processing

#### 3. **Database Creation Lambda** (`src/lambdas/dbCreation/index.ts`)
- **Purpose**: Sets up the PostgreSQL database schema
- **Flow**:
  - Drops existing tables (if any)
  - Creates new tables with proper relationships
  - Establishes foreign key constraints

### Database Schema

The pipeline creates the following PostgreSQL tables:

- **`projects`**: Stores project metadata
  - `id`, `name`, `created_at`, `updated_at`, `root_span_count`, `last_cursor`

- **`batches`**: Groups related spans
  - `id`, `project_id`, `name`, `created_at`

- **`root_spans`**: Stores individual span data
  - `id`, `trace_id`, `batch_id`, `input`, `output`, `project_id`, `span_name`, `start_time`, `end_time`, `created_at`

- **`annotations`**: Stores manual annotations for spans
  - `id`, `root_span_id`, `note`, `rating`, `created_at`

- **`categories`**: Defines annotation categories
  - `id`, `text`

- **`annotation_categories`**: Many-to-many relationship between annotations and categories
  - `id`, `annotation_id`, `category_id`

### Shared Components

- **`queryAPI.ts`**: GraphQL client for Phoenix API communication
- **`createDbClient.ts`**: PostgreSQL connection management
- **`getPhoenixKey.ts`**: AWS Secrets Manager integration for API key retrieval
- **`getRDSSecrets.ts`**: Database credentials management

## Prerequisites

- Node.js 22.x
- AWS CLI configured with appropriate permissions
- AWS SAM CLI
- PostgreSQL database (RDS or local)
- Phoenix API access

## Environment Variables

Create an `env.json` file for local development:

```json
{
  "FetchProjects": {
    "NODE_ENV": "development",
    "LOCALPGUSER": "your_db_user",
    "LOCALPGPASSWORD": "your_db_password",
    "LOCALPGDATABASE": "your_db_name",
    "LOCALPGHOST": "localhost",
    "LOCALPGPORT": "5432",
    "PHOENIX_API_KEY": "your_phoenix_api_key",
    "PHOENIX_API_URL": "https://api.phoenix.com",
    "SPAN_INGESTION_FUNCTION_NAME": "ingest-root-span-worker"
  },
  "FetchRootSpans": {
    "NODE_ENV": "development",
    "LOCALPGUSER": "your_db_user",
    "LOCALPGPASSWORD": "your_db_password",
    "LOCALPGDATABASE": "your_db_name",
    "LOCALPGHOST": "localhost",
    "LOCALPGPORT": "5432",
    "PHOENIX_API_KEY": "your_phoenix_api_key",
    "PHOENIX_API_URL": "https://api.phoenix.com"
  }
}
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd etl-pipeline
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Set up environment variables**
   - Copy the `env.json` example above and fill in your values
   - For production, configure AWS Secrets Manager with your credentials

5. **Start local development server**
   ```bash
   npm run dev
   ```

## Usage

### Local Development

1. **Start the local API server**:
   ```bash
   npm run dev
   ```

2. **Initialize the database** (first time only):
   ```bash
   curl -X POST http://localhost:8080/dbCreation
   ```

3. **Fetch all projects and start ingestion**:
   ```bash
   curl -X GET http://localhost:8080/fetchAllProjects
   ```

4. **Process specific project spans**:
   ```bash
   curl -X POST http://localhost:8080/fetchRootSpans \
     -H "Content-Type: application/json" \
     -d '{"projectName": "your-project-name", "lastCursor": ""}'
   ```

## API Endpoints

### Development (Local)
- `GET http://localhost:8080/fetchAllProjects` - Fetch and process all projects
- `POST http://localhost:8080/fetchRootSpans` - Process spans for a specific project
- `POST http://localhost:8080/dbCreation` - Initialize database schema

### Production
- `GET https://your-api-gateway-url/fetchAllProjects` - Fetch and process all projects
- `POST https://your-api-gateway-url/fetchRootSpans` - Process spans for a specific project
