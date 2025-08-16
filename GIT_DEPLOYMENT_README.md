# Git Deployment Information System

This project automatically displays GitHub commit information on the website to help developers and users know when the site was last updated and what changes were deployed.

## How It Works

### 1. **Build Script**: `scripts/build-with-git-info.js`
The script extracts Git information during the build process and creates JSON files with commit details.

### 2. **Environment Detection**
- **Local Development**: Uses `git` commands to get current commit info
- **Netlify Production**: Uses Netlify environment variables for build info

### 3. **File Locations**
The script creates commit info files in multiple locations for accessibility:
- `public/.well-known/commit-info.json` (main production location)
- `.well-known/commit-info.json` (root directory)
- `html/.well-known/commit-info.json` (HTML subdirectory)
- `commit-info.json` (root for easy access)

### 4. **Build Process**
The `npm run build` command automatically runs the prebuild script to extract Git information.

## Environment Variables (Netlify)

When deployed to Netlify, the following environment variables are automatically available:
- `NETLIFY=true` - Indicates Netlify build environment
- `COMMIT_REF` - Full Git commit hash
- `COMMIT_MSG` - Commit message
- `BUILD_TIME` - When the build started
- `URL` - Deployed site URL

## Build Commands

- `npm run build`: Production build with commit info extraction
- `npm run prebuild`: Extract Git info and create JSON files
- `npm run dev`: Development server with commit info
- `npm run serve`: Production-like server with commit info

## What Gets Displayed

The Developer Information section shows:
- **Build**: When the current build started
- **Commit**: Short Git commit hash (e.g., `0405d295`)
- **Updated**: When the last commit was made
- **Message**: The actual commit message from Git
- **Environment**: Production or Development

## Troubleshooting

### If commit info shows "Run 'npm run build' to get commit info":
1. Ensure you're in a Git repository
2. Run `npm run build` to extract current Git info
3. Check that the build script has execute permissions

### For Netlify deployments:
1. Ensure the build command is `npm run build`
2. Check Netlify build logs for any errors
3. Verify the `.well-known` directory is being created
4. Check that commit info files are accessible from the deployed site

## File Structure

```
track-attack-running/
├── scripts/
│   └── build-with-git-info.js    # Git info extraction script
├── public/
│   └── .well-known/
│       └── commit-info.json      # Production commit info
├── .well-known/
│   └── commit-info.json          # Root commit info
├── commit-info.json              # Easy access commit info
└── netlify.toml                  # Netlify configuration
```

## Local Development

1. Make changes to your code
2. Commit changes: `git add . && git commit -m "Your commit message"`
3. Run `npm run dev` to start development server
4. The Developer Information section will show current commit details

## Production Deployment

1. Push changes to GitHub: `git push origin main`
2. Netlify automatically triggers a build
3. The build script extracts Git info from Netlify environment
4. Deployed site displays production commit information
5. Users can see exactly what version is deployed and when
