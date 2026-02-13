import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfModule = require('pdf-parse');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const docsDir = path.join(__dirname, 'docs');
const files = [
    '1037 SOLO - 食用指南.pdf',
    '1037SOLO 更新日志.pdf'
];

async function extractPdf(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        // Check if pdfModule is the function or if it has a default property
        const pdfParser = typeof pdfModule === 'function' ? pdfModule : pdfModule.default;
        
        if (typeof pdfParser !== 'function') {
            console.error('pdf-parse module is not a function:', pdfModule);
            return '';
        }

        const data = await pdfParser(dataBuffer);
        return data.text;
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return '';
    }
}

async function main() {
    for (const file of files) {
        const filePath = path.join(docsDir, file);
        if (fs.existsSync(filePath)) {
            console.log(`\n--- Content of ${file} ---`);
            const content = await extractPdf(filePath);
            console.log(content);
            console.log(`--- End of ${file} ---\n`);
        } else {
            console.log(`File not found: ${filePath}`);
        }
    }
}

main();
