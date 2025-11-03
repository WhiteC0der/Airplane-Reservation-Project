# 🚀 Quick GitHub Publishing Guide

## One-Time Setup (First Time Only)

### 1. Install Git
If you haven't installed Git yet:
- Download from: https://git-scm.com/
- Install with default options
- Restart your terminal after installation

### 2. Configure Git (First Time Only)
```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### 3. Create GitHub Account
- Go to https://github.com/signup
- Create your account (it's free!)

## Publishing Your Project

### Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `flight-booking-system`
   - **Description**: `A full-stack flight booking system with Node.js, Oracle DB, and modern frontend`
   - **Visibility**: Choose **Public** (recommended) or Private
   - **❌ DO NOT** check "Initialize with README" (we already have one)
3. Click **"Create repository"**

### Step 2: Prepare Your Project

Run the setup script in PowerShell:

```powershell
cd "c:\Users\ASUS\OneDrive\Documents\Sql\ATBS"
powershell -ExecutionPolicy Bypass -File github-setup.ps1
```

Or manually check:

```powershell
# Check for .env file (should NOT be committed)
Get-ChildItem -Path . -Recurse -Filter ".env" | Select-Object FullName

# Check .gitignore exists
Test-Path .gitignore
```

### Step 3: Initialize and Commit

```powershell
# Navigate to your project
cd "c:\Users\ASUS\OneDrive\Documents\Sql\ATBS"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Check what will be committed
git status

# Commit your changes
git commit -m "Initial commit: Flight Booking System with Node.js backend and Oracle database"

# Rename branch to main
git branch -M main
```

### Step 4: Connect to GitHub

Replace `YOUR-USERNAME` with your GitHub username:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/flight-booking-system.git
```

Example:
```powershell
git remote add origin https://github.com/john-doe/flight-booking-system.git
```

### Step 5: Push to GitHub

```powershell
git push -u origin main
```

You'll be prompted to login:
- Username: your-github-username
- Password: **Use Personal Access Token** (not your password)

#### Creating Personal Access Token:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Flight Booking System"
4. Select scopes: ✅ **repo** (full control)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password when pushing

### Step 6: Verify

Go to your GitHub repository:
```
https://github.com/YOUR-USERNAME/flight-booking-system
```

You should see all your files! 🎉

## Updating README with Your Info

Before pushing, update these in `README.md`:

1. Replace `YOUR-USERNAME` with your GitHub username (multiple places)
2. Replace `Your Name` with your actual name
3. Update email in the Support section
4. Add your GitHub profile link

Quick find & replace in PowerShell:

```powershell
# Backup original
Copy-Item README.md README.md.backup

# Replace YOUR-USERNAME (do this manually in VS Code or text editor)
```

## Making Future Updates

After making changes to your code:

```powershell
# Check what changed
git status

# Add all changes
git add .

# Or add specific files
git add backend/server.js
git add frontend/index.html

# Commit with descriptive message
git commit -m "Fix: Resolved booking error for authenticated users"

# Push to GitHub
git push
```

## Common Issues & Solutions

### Issue: "remote origin already exists"
```powershell
# Remove and re-add
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/flight-booking-system.git
```

### Issue: "Updates were rejected"
```powershell
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push origin main
```

### Issue: "Permission denied"
- Make sure you're using Personal Access Token, not password
- Check if token has `repo` permissions

### Issue: ".env file committed by mistake"
```powershell
# Remove from git but keep locally
git rm --cached backend/.env
git commit -m "Remove .env file"
git push

# Make sure .env is in .gitignore
```

## Pro Tips

### Add a .gitignore for Node.js
Already created! Check `.gitignore` file.

### Create Meaningful Commits
Good commit messages:
```
✓ "Add: User authentication with JWT"
✓ "Fix: Booking constraint error for new users"
✓ "Update: Improved error handling in API"
✓ "Refactor: Simplified booking controller logic"
```

Bad commit messages:
```
✗ "update"
✗ "fixed stuff"
✗ "asdfasdf"
```

### Check Before Committing
```powershell
# See what will be committed
git status

# See actual changes
git diff

# See staged changes
git diff --staged
```

## Need Help?

- GitHub Docs: https://docs.github.com/
- Git Tutorial: https://git-scm.com/docs/gittutorial
- Create Issue: Your repo → Issues → New Issue

## Checklist Before Publishing

- [ ] Git installed and configured
- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] `.gitignore` file exists
- [ ] No `.env` file in commits
- [ ] No `node_modules` folder
- [ ] README updated with your info
- [ ] All files added and committed
- [ ] Remote origin added
- [ ] Successfully pushed to GitHub

---

**You're ready to go! 🚀**

Run the setup script or follow the steps above to publish your project!
