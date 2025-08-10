# Commit Information Display

This project automatically displays GitHub commit information below the footer on the website. This helps developers and users know when the site was last updated and what changes were deployed.

## How It Works

1. **Build Script**: The `scripts/build-with-git-info.js` script extracts git information during the build process
2. **Environment Variables**: Git commit details are stored in environment variables:
   - `VITE_COMMIT_HASH`: Full commit hash
   - `VITE_COMMIT_MESSAGE`: Commit message
   - `VITE_COMMIT_TIMESTAMP`: When the commit was made
   - `VITE_BUILD_TIME`: When the build was executed
3. **Component**: The `CommitInfo.astro` component displays this information below the footer
4. **Build Process**: The `npm run build` command automatically runs the prebuild script

## What's Displayed

The commit information bar shows:
- **Build Time**: When the current deployment was built
- **Commit Hash**: Shortened commit hash (first 8 characters)
- **Updated Time**: When the source code was last committed
- **Commit Message**: The message from the last commit

## Build Commands

- `npm run dev`: Development server (no commit info)
- `npm run build`: Production build with commit info
- `npm run prebuild`: Extract git info and create .env file
- `npm run preview`: Preview the built site

## Deployment

When deploying to Netlify:
1. The build command runs `npm run build`
2. This automatically extracts the latest git information
3. The commit info is displayed on the live site
4. Users can see exactly when the site was last updated

## Customization

To modify the display:
- Edit `src/components/CommitInfo.astro` for styling and layout
- Modify `scripts/build-with-git-info.js` to extract different git information
- Update the environment variable names if needed

## Troubleshooting

If commit information shows as "unknown":
- Ensure the build is running from a git repository
- Check that the build script has execute permissions
- Verify the .env file is being generated during build
- Check that the environment variables are accessible in the component
