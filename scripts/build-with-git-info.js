#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to safely execute git commands
function getGitInfo() {
    try {
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
            buildTime: buildTime
        };
    } catch (error) {
        console.warn('Warning: Could not get git information:', error.message);
        return {
            hash: 'dev',
            fullHash: 'development',
            message: 'Development build',
            timestamp: new Date().toISOString(),
            buildTime: new Date().toISOString()
        };
    }
}

// Function to create commit info JSON file
function createCommitInfoFile() {
    const gitInfo = getGitInfo();
    const outputDir = path.join(__dirname, '..', 'public', '.well-known');
    const outputFile = path.join(outputDir, 'commit-info.json');
    
    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write commit info
    fs.writeFileSync(outputFile, JSON.stringify(gitInfo, null, 2));
    console.log('✅ Created commit info file:', outputFile);
    console.log('📝 Commit:', gitInfo.hash);
    console.log('💬 Message:', gitInfo.message);
    console.log('🕒 Build time:', gitInfo.buildTime);
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
    createCommitInfoFile();
    updateHTMLFiles();
    console.log('✨ Git info extraction complete!');
}
