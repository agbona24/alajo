# Alajo Deployment Checklist

## Pre-Deployment Checklist

### Backend Preparation
- [ ] Run `composer install --optimize-autoloader --no-dev` in backend folder
- [ ] Create ZIP file of backend folder (exclude node_modules, .git, .env)
- [ ] Test locally that everything works
- [ ] Database seeders are ready

### cPanel Setup
- [ ] MySQL database created
- [ ] Database user created with password
- [ ] User added to database with ALL PRIVILEGES
- [ ] Domain/subdomain configured
- [ ] SSL certificate installed

### Frontend Preparation
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Environment variables ready

---

## Deployment Steps

### Phase 1: Backend Deployment (30-45 minutes)

1. **Upload Backend** ✓
   - Login to cPanel File Manager
   - Upload ZIP file
   - Extract to correct directory
   - Set document root to `/public` folder

2. **Configure Environment** ✓
   - Create `.env` file
   - Copy from `.env.production.example`
   - Update database credentials
   - Update mail settings
   - Update frontend URL (will get from Vercel later)

3. **Set Permissions** ✓
   ```bash
   chmod -R 755 storage
   chmod -R 755 bootstrap/cache
   ```

4. **Generate App Key** ✓
   - Via Terminal: `php artisan key:generate`
   - OR use generate-key.php helper (delete after use!)

5. **Run Migrations** ✓
   - Via Terminal: `php artisan migrate --force`
   - OR use migrate.php helper (delete after use!)

6. **Seed Database** ✓
   ```bash
   php artisan db:seed --class=AdminCollectorSeeder --force
   php artisan db:seed --class=MemberSeeder --force
   ```

7. **Create Storage Link** ✓
   ```bash
   php artisan storage:link
   ```

8. **Test Backend** ✓
   - Visit: `https://app.alajo.ng/api/collectors`
   - Should return JSON response
   - Visit: `https://app.alajo.ng/docs`
   - Should show API documentation

### Phase 2: Frontend Deployment (15-20 minutes)

1. **Push to GitHub** ✓
   ```bash
   git add .
   git commit -m "Production deployment"
   git push origin main
   ```

2. **Deploy to Vercel** ✓
   - Login to vercel.com
   - Import repository
   - Set root directory to `frontend`
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL` = `https://app.alajo.ng/api`
     - `NEXT_PUBLIC_APP_NAME` = `Alajo`
   - Click Deploy

3. **Get Vercel URL** ✓
   - Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

4. **Update Backend CORS** ✓
   - Go back to cPanel File Manager
   - Edit `.env` file
   - Update:
     ```env
     FRONTEND_URL=https://your-app.vercel.app
     SANCTUM_STATEFUL_DOMAINS=your-app.vercel.app
     ```
   - Clear cache (via Terminal or clear-cache.php)

5. **Test Frontend** ✓
   - Visit your Vercel URL
   - Try to register
   - Try to login
   - Check if API calls work

### Phase 3: Post-Deployment (10-15 minutes)

1. **Setup Cron Jobs** ✓
   - Go to cPanel → Cron Jobs
   - Add: `* * * * * /usr/bin/php /home/username/path/to/artisan schedule:run >> /dev/null 2>&1`

2. **Configure Email** ✓
   - Test welcome email
   - Test 2FA code email
   - Update mail settings if needed

3. **Security Check** ✓
   - [ ] APP_DEBUG=false
   - [ ] Strong passwords set
   - [ ] SSL working on both domains
   - [ ] API only accessible via HTTPS
   - [ ] Remove helper files (generate-key.php, migrate.php, etc.)
   - [ ] Storage permissions correct

4. **Performance Check** ✓
   - [ ] GZIP compression enabled
   - [ ] Caching configured
   - [ ] Images optimized

---

## Quick Commands Reference

### Backend Commands (via cPanel Terminal/SSH)

```bash
# Navigate to backend directory
cd /home/username/app.alajo.ng

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Run migrations
php artisan migrate --force

# Seed database
php artisan db:seed --force

# Generate app key
php artisan key:generate

# Create storage link
php artisan storage:link

# Generate API docs
php artisan scribe:generate

# Check app status
php artisan about
```

### Frontend Commands (Local/Vercel)

```bash
# Build for production
npm run build

# Start production server (local testing)
npm start

# Deploy to Vercel (via CLI)
vercel --prod
```

---

## Troubleshooting Quick Fixes

### Backend 500 Error
```bash
# Check permissions
chmod -R 755 storage bootstrap/cache

# Clear caches
php artisan config:clear
php artisan cache:clear

# Check logs
tail -n 50 storage/logs/laravel.log
```

### Database Connection Error
- Check `.env` DB credentials
- Verify database exists in cPanel
- Test connection in phpMyAdmin

### CORS Error
- Update FRONTEND_URL in backend `.env`
- Update SANCTUM_STATEFUL_DOMAINS
- Run: `php artisan config:clear`

### Email Not Sending
- Check MAIL_* settings in `.env`
- For Gmail: Use App Password, not regular password
- Test with: `php artisan tinker` then `Mail::raw('Test', fn($m) => $m->to('test@example.com')->subject('Test'));`

---

## Important URLs to Save

- **Backend API:** https://app.alajo.ng
- **API Documentation:** https://app.alajo.ng/docs
- **Frontend App:** https://your-app.vercel.app
- **cPanel:** https://alajo.ng:2083
- **Vercel Dashboard:** https://vercel.com/dashboard

---

## Backup Strategy

### Daily Backups (Automated via cPanel)
- Database: Enabled in cPanel Backup Wizard
- Files: Weekly full backup

### Manual Backup Before Updates
```bash
# Database export
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql

# Files backup (via cPanel File Manager)
# Select all files → Compress → Download ZIP
```

---

## Maintenance Commands

### Weekly Maintenance
```bash
# Clear old logs (keep last 7 days)
find storage/logs -name "*.log" -mtime +7 -delete

# Optimize database
php artisan db:table:optimize

# Clear expired sessions
php artisan session:gc
```

### Monthly Maintenance
- Review error logs
- Check disk space
- Update dependencies (test locally first!)
- Review and optimize database queries

---

## Support Contacts

- **Hosting Support:** Contact your cPanel hosting provider
- **Vercel Support:** https://vercel.com/support
- **Developer:** [Your contact info]

---

**Total Estimated Deployment Time: 60-90 minutes**

Good luck with your deployment! 🚀
