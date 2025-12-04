# Alajo Deployment Guide

## Table of Contents
1. [Backend Deployment (cPanel via FTP)](#backend-deployment-cpanel)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Post-Deployment Configuration](#post-deployment-configuration)

---

## Backend Deployment (cPanel)

### Prerequisites
- cPanel hosting account with PHP 8.1+ and MySQL 8.0+
- FTP access credentials
- Domain/subdomain pointed to your cPanel hosting

### Step 1: Prepare the Backend Files

1. **Create a production build locally:**
   ```bash
   cd backend
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

2. **Create a ZIP file of the backend folder:**
   - On Mac/Linux:
     ```bash
     cd ..
     zip -r alajo-backend.zip backend/ -x "backend/node_modules/*" "backend/.git/*" "backend/storage/logs/*" "backend/.env"
     ```
   - On Windows: Right-click the `backend` folder → Send to → Compressed (zipped) folder

### Step 2: Set Up Database on cPanel

1. **Login to cPanel**
2. **Create MySQL Database:**
   - Go to **MySQL Databases**
   - Create a new database: `yourusername_alajo`
   - Create a new user: `yourusername_alajo_user`
   - Set a strong password (save it!)
   - Add the user to the database with **ALL PRIVILEGES**
   - Note down:
     - Database name: `yourusername_alajo`
     - Database user: `yourusername_alajo_user`
     - Database password: (your password)
     - Database host: `localhost`

### Step 3: Upload Files to cPanel

1. **Login to cPanel File Manager**
2. **Navigate to your domain directory:**
   - If using main domain: `/public_html/`
   - If using subdomain (recommended): `/public_html/api/` or create `/home/username/app.alajo.ng/`

3. **Upload the ZIP file:**
   - Click **Upload** button
   - Upload `alajo-backend.zip`
   - Wait for upload to complete

4. **Extract the ZIP file:**
   - Right-click the ZIP file → Extract
   - After extraction, you should see the `backend` folder
   - Move all contents from `backend` folder to the root of your chosen directory
   - Delete the empty `backend` folder and ZIP file

### Step 4: Set Up Document Root

1. **Go to cPanel → Domains (or Addon Domains)**
2. **Edit your domain/subdomain:**
   - Set Document Root to point to the `public` folder
   - Example: `/home/username/app.alajo.ng/public`
   - Save changes

### Step 5: Configure Environment File

1. **In File Manager, navigate to your backend root directory**
2. **Create a new file named `.env`:**
   - Right-click → Create New File → Name it `.env`
   - Right-click `.env` → Edit
   - Copy the contents from `.env.production.example` (shown below)
   - Update the following values:

```env
APP_NAME=Alajo
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://app.alajo.ng

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=yourusername_alajo
DB_USERNAME=yourusername_alajo_user
DB_PASSWORD=your_database_password

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@alajo.ng
MAIL_FROM_NAME="${APP_NAME}"

FRONTEND_URL=https://your-app.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-app.vercel.app
```

3. **Save the file**

### Step 6: Generate Application Key

1. **Go to cPanel → Terminal** (if available) OR use SSH if you have access
2. **Navigate to your backend directory:**
   ```bash
   cd /home/username/app.alajo.ng
   ```
3. **Generate app key:**
   ```bash
   php artisan key:generate
   ```
4. **If Terminal is not available:**
   - Go to this URL in your browser: `https://app.alajo.ng/generate-key.php`
   - Create a file `generate-key.php` in the `public` folder with this content:
   ```php
   <?php
   require __DIR__.'/../vendor/autoload.php';
   $app = require_once __DIR__.'/../bootstrap/app.php';
   $key = 'base64:'.base64_encode(random_bytes(32));
   echo "Generated Key: " . $key . "\n\n";
   echo "Copy this key and add it to your .env file as APP_KEY=" . $key;
   ```
   - Visit the URL, copy the generated key
   - Update your `.env` file with `APP_KEY=base64:xxxxx`
   - **Delete the `generate-key.php` file immediately for security!**

### Step 7: Set Permissions

1. **In File Manager, set folder permissions:**
   - Select `storage` folder → Right-click → Permissions → Set to `755` (or 775)
   - Select `bootstrap/cache` folder → Permissions → Set to `755` (or 775)
   - **Important:** Make sure all subdirectories in `storage` are writable

2. **Alternatively, via Terminal:**
   ```bash
   chmod -R 755 storage
   chmod -R 755 bootstrap/cache
   ```

### Step 8: Run Database Migrations

1. **Via cPanel Terminal (or SSH):**
   ```bash
   cd /home/username/app.alajo.ng
   php artisan migrate --force
   php artisan db:seed --force
   php artisan storage:link
   ```

2. **If Terminal is not available:**
   - Create a file `migrate.php` in the `public` folder:
   ```php
   <?php
   require __DIR__.'/../vendor/autoload.php';
   $app = require_once __DIR__.'/../bootstrap/app.php';
   $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
   $kernel->call('migrate', ['--force' => true]);
   echo "Migrations completed!";
   ```
   - Visit `https://app.alajo.ng/migrate.php`
   - **Delete the file immediately after use!**

### Step 9: Set Up Cron Jobs (Optional but Recommended)

1. **Go to cPanel → Cron Jobs**
2. **Add a new cron job:**
   - **Common Settings:** Once Per Minute (* * * * *)
   - **Command:**
     ```bash
     /usr/bin/php /home/username/app.alajo.ng/artisan schedule:run >> /dev/null 2>&1
     ```

### Step 10: Test the API

1. Visit: `https://app.alajo.ng/api/collectors`
2. You should see a JSON response (empty array `[]` or list of collectors)
3. Visit: `https://app.alajo.ng/docs` to see API documentation

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier works)
- Git repository with your frontend code

### Step 1: Prepare Frontend for Deployment

1. **Update environment variables:**
   ```bash
   cd frontend
   cp .env.production.example .env.production
   ```

2. **Edit `.env.production`:**
   ```env
   NEXT_PUBLIC_API_URL=https://app.alajo.ng/api
   NEXT_PUBLIC_APP_NAME=Alajo
   ```

### Step 2: Push to GitHub

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

### Step 3: Deploy to Vercel

1. **Go to https://vercel.com and login**

2. **Import Project:**
   - Click **"Add New..."** → **"Project"**
   - Import your Git repository (GitHub, GitLab, or Bitbucket)
   - Select the `alajo` repository

3. **Configure Project:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

4. **Environment Variables:**
   - Click **"Environment Variables"**
   - Add:
     - `NEXT_PUBLIC_API_URL` = `https://app.alajo.ng/api`
     - `NEXT_PUBLIC_APP_NAME` = `Alajo`

5. **Deploy:**
   - Click **"Deploy"**
   - Wait for deployment to complete (2-5 minutes)
   - You'll get a URL like: `https://your-app.vercel.app`

### Step 4: Update Backend CORS Settings

1. **Go back to cPanel File Manager**
2. **Edit your backend `.env` file:**
   ```env
   FRONTEND_URL=https://your-app.vercel.app
   SANCTUM_STATEFUL_DOMAINS=your-app.vercel.app
   ```
3. **Clear cache via Terminal (or create a clear-cache.php file):**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

### Step 5: Configure Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to your project → **Settings** → **Domains**
   - Add your custom domain (e.g., `app.alajo.ng`)
   - Follow the DNS configuration instructions

2. **Update backend `.env` again:**
   ```env
   FRONTEND_URL=https://app.alajo.ng
   SANCTUM_STATEFUL_DOMAINS=app.alajo.ng
   ```

---

## Post-Deployment Configuration

### 1. Create Admin/Collector Accounts

**Via Terminal/SSH:**
```bash
php artisan db:seed --class=AdminCollectorSeeder
```

**Or create manually via database:**
- Go to cPanel → phpMyAdmin
- Select your database
- Go to `users` table
- Add users with `role` = `admin` or `collector`

### 2. Configure Mail Settings

1. **For Gmail:**
   - Enable 2-Factor Authentication on your Google account
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Use this app password in your `.env` file

2. **Update `.env`:**
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-16-digit-app-password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=noreply@alajo.ng
   ```

### 3. Set Up SSL Certificate

1. **In cPanel → SSL/TLS Status**
2. **Run AutoSSL** for your domain/subdomain
3. **Verify HTTPS works** for both frontend and backend

### 4. Test Complete Flow

1. **Test Registration:** Register a new user
2. **Test Login:** Login with the user
3. **Test 2FA:** Enable 2FA and test login
4. **Test Email:** Check if welcome email is received
5. **Test API:** Make sure all API endpoints work
6. **Test File Upload:** Try uploading profile picture (if applicable)

---

## Troubleshooting

### Backend Issues

**500 Internal Server Error:**
- Check `.env` file is configured correctly
- Check folder permissions (storage and bootstrap/cache should be 755 or 775)
- Check error logs in cPanel → Error Log or `storage/logs/laravel.log`

**Database Connection Error:**
- Verify database credentials in `.env`
- Make sure database user has all privileges
- Check if database host is `localhost` or `127.0.0.1`

**API Key Missing:**
- Make sure `APP_KEY` is set in `.env`
- Run `php artisan key:generate`

### Frontend Issues

**API Not Connecting:**
- Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Make sure CORS is configured correctly in backend
- Check browser console for CORS errors

**Build Failed on Vercel:**
- Check build logs for errors
- Make sure all dependencies are in `package.json`
- Check if `frontend` root directory is set correctly

### CORS Errors

**If you see CORS errors:**
1. Update backend `.env`:
   ```env
   FRONTEND_URL=https://your-vercel-app.vercel.app
   SANCTUM_STATEFUL_DOMAINS=your-vercel-app.vercel.app
   ```
2. Clear config cache:
   ```bash
   php artisan config:clear
   ```

---

## Security Checklist

- [ ] `APP_DEBUG=false` in production `.env`
- [ ] Strong database password
- [ ] `.env` file is not publicly accessible
- [ ] SSL certificate is installed and working
- [ ] File permissions are correct (755 for directories, 644 for files)
- [ ] Remove any debug/test files (migrate.php, generate-key.php, etc.)
- [ ] Set up regular database backups
- [ ] Configure firewall rules if available
- [ ] Update `SANCTUM_STATEFUL_DOMAINS` to match your frontend URL

---

## Maintenance

### Updating the Application

1. **Backend Updates:**
   - Make changes locally
   - Test thoroughly
   - Create a new ZIP file
   - Upload and extract to cPanel
   - Run migrations if needed: `php artisan migrate --force`
   - Clear caches: `php artisan config:clear && php artisan cache:clear`

2. **Frontend Updates:**
   - Push changes to GitHub
   - Vercel will automatically deploy
   - Or manually trigger deployment in Vercel dashboard

### Database Backups

1. **Via cPanel → Backup Wizard**
2. **Or use phpMyAdmin → Export**
3. **Schedule regular backups**

---

## Support

- **API Documentation:** `https://app.alajo.ng/docs`
- **Postman Collection:** Download from `/docs.postman`
- **OpenAPI Spec:** Download from `/docs.openapi`

---

**Congratulations! Your Alajo application is now live!** 🎉
