const fs = require('fs');
const path = require('path');

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file === 'page.tsx') {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            const mainRegex = /<main[^>]*>([\s\S]*?)<\/main>/;
            const match = content.match(mainRegex);
            if (match) {
                const innerMain = match[1];
                // Check if it's already stripped (so we don't double strip)
                if (!content.includes('return (\n    <>\n')) {
                    content = content.replace(/return \([\s\S]*?\);\n}/, `return (\n    <>\n${innerMain}\n    </>\n  );\n}`);
                    fs.writeFileSync(fullPath, content);
                    console.log(`Stripped layout from ${fullPath}`);
                }
            }
        }
    }
}

processDir('./src/app/(app)');
processDir('./src/app/(admin)');
