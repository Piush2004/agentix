const fs = require('fs');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/return \([\s\S]*?\);\n}/);
    if (match) {
        // Find the index of the end of the match
        const index = match.index + match[0].length;
        const goodContent = content.substring(0, index) + '\n';
        fs.writeFileSync(filePath, goodContent);
        console.log('Fixed ' + filePath);
    } else {
        console.log('Target not found in ' + filePath);
    }
}

fixFile('./src/app/(app)/workspace/page.tsx');
fixFile('./src/app/admin/dashboard/page.tsx');
