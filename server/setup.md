
---

# **Sequelize Migration Workflow Guide**

## **Setup**

1. **Navigate to the server directory:**
   ```bash
   cd edusports/server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the `server` directory:
   ```bash
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   DB_HOST=localhost
   ```

4. **Ensure PostgreSQL is installed and running.**

### **PostgreSQL Installation (macOS)**  
If needed, install Homebrew and PostgreSQL:

- **Install Homebrew:**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
- **Install PostgreSQL:**
   ```bash
   brew install postgresql
   ```
- **Start PostgreSQL service:**
   ```bash
   brew services start postgresql
   ```

5. **Create and connect to the database:**
   ```bash
   createdb your_database_name  # Replace with your database name
   psql your_database_name
   ```

6. **Create a new user with a password:**
   ```sql
   CREATE USER your_username WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_username;
   \q  # Exit PostgreSQL
   ```

7. **Test the connection:**
   ```bash
   psql -d your_database_name -U your_username -h localhost
   ```

---

## **Running Migrations**

Apply pending migrations:
```bash
npm run sequelize db:migrate
```

---

## **Creating New Migrations**

Only create migrations after group discussion. 

1. **Generate a migration file:**
   ```bash
   npm run sequelize migration:generate -- --name your-migration-name
   ```

2. **Edit the migration file** in `src/migrations/`, adding schema changes in the `up` function and reversals in `down`.

3. **Commit the migration file** to the repository.

4. **Other teammates can apply it:**
   ```bash
   npm run sequelize db:migrate
   ```

---

## **Rolling Back Migrations**

- **Undo the most recent migration:**
   ```bash
   npm run sequelize db:migrate:undo
   ```

- **Undo all migrations:**
   ```bash
   npm run sequelize db:migrate:undo:all
   ```

---

## **Best Practices**

1. Always use migrations for schema changes.
2. Keep migrations focused on a single change.
3. Test migrations locally before pushing.
4. Provide both `up` and `down` methods for rollbacks.
5. Use descriptive names for migrations.
6. Commit migration files to version control.
7. Never modify existing migrations; create new ones for updates.

---

## **Troubleshooting**

- **"Migration pending" error:** Run:
   ```bash
   npm run sequelize db:migrate
   ```

- **Failed migration:**  
   Undo and retry:
   ```bash
   npm run sequelize db:migrate:undo
   npm run sequelize db:migrate
   ```

- **Database out of sync:**  
   Drop and re-run migrations:
   ```bash
   npm run sequelize db:drop
   npm run sequelize db:create
   npm run sequelize db:migrate
   ```

---

## **Workflow Summary**

1. Pull the latest changes.
2. Check for migrations:  
   ```bash
   git status
   ```
3. Apply migrations:  
   ```bash
   npm run sequelize db:migrate
   ```
4. Make changes to the codebase.
5. For schema changes:
   - Create a migration.
   - Implement and test it.
   - Commit the migration.
6. Push your changes.
7. Other teammates pull changes and run migrations.

---