# Gupta Kirana Store Backend

## Database Setup

### Prerequisites
- PostgreSQL installed and running
- Database created: `gupta_kirana_store`
- Environment variables set in `.env` file

### Running Migrations and Seeders

To set up the database tables and seed initial data, run:

```bash
# Install dependencies
npm install

# Run migrations to create tables
npm run migrate

# Run seeders to populate tables with sample data
npm run seed
```

### Reset Database

To reset the database (drop all tables, recreate them, and seed data):

```bash
npm run db:reset
```

### Default Users

After running the seeders, you can log in with these credentials:

- Admin User:
  - Email: admin@guptakirana.com
  - Password: admin123

- Regular User:
  - Email: user@example.com
  - Password: user123

## Running the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at http://localhost:5000