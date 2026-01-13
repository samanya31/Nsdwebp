# Quick Setup Guide - Fix Supabase Saving Issue

## Problem
You can enter form details but Supabase is not saving them. You'll see 406 errors in the console.

## Solution: Create the Database Table

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `lqqtgqmexmkzbjevalsm`

### Step 2: Open SQL Editor
1. Click **SQL Editor** in the left sidebar
2. Click **New Query**

### Step 3: Run the SQL Script
1. Copy the **entire contents** of `SUPABASE_SETUP.sql` file
2. Paste it into the SQL Editor
3. Click **Run** (or press `Ctrl+Enter`)

### Step 4: Verify It Worked
You should see a success message. The table `applications` should now be created.

### Step 5: Test
1. Go back to your application
2. Fill out the Personal Details form
3. Click "Save Draft"
4. Check the console - you should see data saving successfully (no more 406 errors)

## Alternative: Check if Table Exists

If you want to verify the table was created:
1. In Supabase Dashboard, go to **Table Editor**
2. You should see a table called `applications`
3. Click on it to see its structure

## Troubleshooting

**If you still see errors:**
- Make sure you're logged into the correct Supabase project
- Check that the `.env` file has the correct URL: `https://lqqtgqmexmkzbjevalsm.supabase.co`
- Restart your dev server after making changes

**Note:** Until you create the table, your data will be saved to `localStorage` as a backup, so you won't lose anything!
