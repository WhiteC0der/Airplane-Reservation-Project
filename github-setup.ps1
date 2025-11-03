# Flight Booking System - GitHub Setup Guide
# Run these commands in PowerShell

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Flight Booking System - GitHub Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if git is installed
Write-Host "Step 1: Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed. Please install Git first:" -ForegroundColor Red
    Write-Host "  Download from: https://git-scm.com/" -ForegroundColor Red
    exit
}

Write-Host ""

# Step 2: Check if we're in a git repository
Write-Host "Step 2: Checking repository status..." -ForegroundColor Yellow
$inGitRepo = Test-Path -Path ".git"
if (-not $inGitRepo) {
    Write-Host "✓ Not in a git repository yet" -ForegroundColor Green
    Write-Host ""
    
    # Initialize git repository
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Already in a Git repository" -ForegroundColor Green
}

Write-Host ""

# Step 3: Check .gitignore
Write-Host "Step 3: Checking .gitignore..." -ForegroundColor Yellow
if (Test-Path -Path ".gitignore") {
    Write-Host "✓ .gitignore exists" -ForegroundColor Green
} else {
    Write-Host "✗ .gitignore not found" -ForegroundColor Red
}

Write-Host ""

# Step 4: Check for .env file
Write-Host "Step 4: Checking for sensitive files..." -ForegroundColor Yellow
if (Test-Path -Path "backend\.env") {
    Write-Host "⚠ WARNING: .env file found - make sure it's in .gitignore!" -ForegroundColor Yellow
} else {
    Write-Host "✓ No .env file in backend (good - it shouldn't be committed)" -ForegroundColor Green
}

Write-Host ""

# Step 5: Show files to be committed
Write-Host "Step 5: Files ready for commit:" -ForegroundColor Yellow
Write-Host "--------------------------------------" -ForegroundColor Gray

$filesToAdd = @(
    "backend/",
    "database/",
    "frontend/",
    ".gitignore",
    "LICENSE",
    "README.md",
    "CONTRIBUTING.md"
)

foreach ($file in $filesToAdd) {
    if (Test-Path -Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file (not found)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Create a new repository on GitHub:" -ForegroundColor White
Write-Host "   - Go to https://github.com/new" -ForegroundColor Gray
Write-Host "   - Name: flight-booking-system" -ForegroundColor Gray
Write-Host "   - Description: A full-stack flight booking system" -ForegroundColor Gray
Write-Host "   - Choose Public or Private" -ForegroundColor Gray
Write-Host "   - Don't initialize with README (we have one)" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Run these commands to publish:" -ForegroundColor White
Write-Host ""
Write-Host "   git add ." -ForegroundColor Cyan
Write-Host "   git commit -m 'Initial commit: Flight Booking System'" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git remote add origin https://github.com/YOUR-USERNAME/flight-booking-system.git" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""

Write-Host "3. Update README.md:" -ForegroundColor White
Write-Host "   - Replace YOUR-USERNAME with your GitHub username" -ForegroundColor Gray
Write-Host "   - Add your name and email" -ForegroundColor Gray
Write-Host "   - Add screenshots if you want" -ForegroundColor Gray
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Before committing, make sure:" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✓ No .env file in the commit" -ForegroundColor White
Write-Host "✓ No node_modules folder" -ForegroundColor White
Write-Host "✓ No database dumps or backups" -ForegroundColor White
Write-Host "✓ No personal information or credentials" -ForegroundColor White
Write-Host ""

$response = Read-Host "Do you want to add files now? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host ""
    Write-Host "Adding files to git..." -ForegroundColor Yellow
    git add .
    Write-Host "✓ Files added" -ForegroundColor Green
    Write-Host ""
    Write-Host "Files staged for commit:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    Write-Host "Ready to commit! Run:" -ForegroundColor Green
    Write-Host "git commit -m 'Initial commit: Flight Booking System'" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Setup complete! 🎉" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
