#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to safely execute git commands
function getGitInfo() {
    try {
        // Check if we're in a Netlify build environment
        const isNetlify = process.env.NETLIFY === 'true';
        
        if (isNetlify) {
            // Use Netlify environment variables for build info
            const commitHash = process.env.COMMIT_REF || 'unknown';
            const shortHash = commitHash.substring(0, 8);
            const commitMessage = process.env.COMMIT_MSG || 'Netlify deployment';
            const buildTime = process.env.BUILD_TIME || new Date().toISOString();
            const deployUrl = process.env.URL || 'unknown';
            
            return {
                hash: shortHash,
                fullHash: commitHash,
                message: commitMessage,
                timestamp: buildTime,
                buildTime: buildTime,
                deployUrl: deployUrl,
                environment: 'production'
            };
        } else {
            // Local development - use git commands
            const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
            const shortHash = commitHash.substring(0, 8);
            const commitMessage = execSync('git log -1 --pretty=format:%s', { encoding: 'utf8' }).trim();
            const commitDate = execSync('git log -1 --pretty=format:%cI', { encoding: 'utf8' }).trim();
            const buildTime = new Date().toISOString();
            
            return {
                hash: shortHash,
                fullHash: commitHash,
                message: commitMessage,
                timestamp: commitDate,
                buildTime: buildTime,
                environment: 'development'
            };
        }
    } catch (error) {
        console.warn('Warning: Could not get git information:', error.message);
        return {
            hash: 'unknown',
            fullHash: 'unknown',
            message: 'Build information unavailable',
            timestamp: new Date().toISOString(),
            buildTime: new Date().toISOString(),
            environment: 'unknown'
        };
    }
}

// Function to create commit info JSON file
function createCommitInfoFile() {
    const gitInfo = getGitInfo();
    
    // Create multiple locations to ensure accessibility
    const locations = [
        // Main public directory (accessible from deployed site)
        path.join(__dirname, '..', 'public', '.well-known'),
        // Root directory (for local development)
        path.join(__dirname, '..', '.well-known'),
        // HTML subdirectory (if serving from there)
        path.join(__dirname, '..', 'html', '.well-known')
    ];
    
    locations.forEach(outputDir => {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const outputFile = path.join(outputDir, 'commit-info.json');
        fs.writeFileSync(outputFile, JSON.stringify(gitInfo, null, 2));
        console.log(`✅ Created commit info file: ${outputFile}`);
    });
    
    // Also create a version in the root for easy access
    const rootFile = path.join(__dirname, '..', 'commit-info.json');
    fs.writeFileSync(rootFile, JSON.stringify(gitInfo, null, 2));
    console.log(`✅ Created root commit info file: ${rootFile}`);
    
    console.log('📝 Commit:', gitInfo.hash);
    console.log('💬 Message:', gitInfo.message);
    console.log('🕒 Build time:', gitInfo.buildTime);
    console.log('🌍 Environment:', gitInfo.environment);
}

// Function to update HTML files with current commit info
function updateHTMLFiles() {
    const gitInfo = getGitInfo();
    const htmlFiles = [
        path.join(__dirname, '..', 'index.html'),
        path.join(__dirname, '..', 'html', 'index.html')
    ];
    
    htmlFiles.forEach(htmlFile => {
        if (fs.existsSync(htmlFile)) {
            let content = fs.readFileSync(htmlFile, 'utf8');
            
            // Update any hardcoded commit references
            content = content.replace(
                /<!-- COMMIT_INFO -->[\s\S]*?<!-- END_COMMIT_INFO -->/g,
                `<!-- COMMIT_INFO -->
                <!-- Last updated: ${gitInfo.buildTime} -->
                <!-- Commit: ${gitInfo.hash} -->
                <!-- Environment: ${gitInfo.environment} -->
                <!-- END_COMMIT_INFO -->`
            );
            
            fs.writeFileSync(htmlFile, content);
            console.log(`✅ Updated HTML file: ${htmlFile}`);
        }
    });
}

// Main execution
if (require.main === module) {
    console.log('🚀 Extracting Git commit information...');
    console.log('🌍 Environment:', process.env.NETLIFY ? 'Netlify' : 'Local');
    createCommitInfoFile();
    updateHTMLFiles();
    console.log('✨ Git info extraction complete!');
}
