# Upload Troubleshooting Guide

## Issues Fixed

I've made several improvements to fix the upload functionality:

### 1. Enhanced Error Handling in `UploadPDFForm.tsx`
- Added proper try-catch blocks around the upload process
- Added validation for `serverData` in upload response
- Improved error messages with specific details
- Better handling of async operations

### 2. Improved `uploadActions.ts`
- Added comprehensive validation for upload response structure
- Better error messages at each step of the process
- Added null/undefined checks for all critical data
- Improved error propagation with detailed messages

### 3. Fixed Return Types
- Ensured all functions return consistent data structures with `success`, `message`, and `data` fields
- Added proper null checks before accessing nested properties

## Common Issues to Check

### 1. **Environment Variables**
Make sure your `.env.local` file contains:
```env
UPLOADTHING_TOKEN=your_token_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
DATABASE_URL=your_database_url
```

### 2. **Authentication**
- Make sure you're logged in with Clerk
- Check if the middleware is allowing access to `/upload` route
- Verify Clerk is properly initialized in your app

### 3. **UploadThing Configuration**
- Verify your UploadThing account is active
- Check if the token is valid
- Ensure the file size limits match (currently set to 32MB in core.ts)

### 4. **Database Connection**
- Verify Prisma is connected to the database
- Run `npx prisma generate` if needed
- Check if the `pdfSummary` table exists

### 5. **API Keys**
- Verify your Google Gemini AI API key is valid
- Check if you have quota remaining on your Gemini API

## Testing Steps

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for any JavaScript errors
   - Check Network tab for failed requests

2. **Check Server Logs**
   - Look at your terminal running `npm run dev`
   - Check for error messages during upload

3. **Test with Small File**
   - Try uploading a very small PDF (< 1MB) first
   - This helps isolate if it's a size/timeout issue

4. **Check Network Request**
   - In browser DevTools Network tab
   - Look for the `/api/uploadthing` POST request
   - Check the response status and data

## Debug Logs

The code now includes extensive console.log statements:
- Upload response structure
- Server data validation
- PDF text extraction
- Summary generation
- Database storage results

Check your browser console and server terminal for these logs to identify where the process is failing.

## Quick Fixes to Try

1. **Restart the dev server**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Clear browser cache and cookies**
   - Especially for Clerk authentication

3. **Regenerate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Check UploadThing Dashboard**
   - Visit https://uploadthing.com/dashboard
   - Verify your app settings and tokens

5. **Test Authentication**
   - Log out and log back in
   - Check if Clerk session is valid

## Still Not Working?

If upload still fails, please provide:
1. Error messages from browser console
2. Error messages from terminal
3. Network request/response details (from DevTools)
4. What step in the upload process is failing

This will help diagnose the specific issue.
