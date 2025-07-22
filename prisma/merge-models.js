const fs = require('fs');
const path = require('path');

const SCHEMA_PATH = path.join(__dirname, 'schema.prisma');
const MODELS_DIR = path.join(__dirname, 'models');

// Read the original schema.prisma
const originalSchema = fs.readFileSync(SCHEMA_PATH, 'utf-8');

// Extract generator and datasource blocks
const generatorMatch = originalSchema.match(/generator[\s\S]*?\{[\s\S]*?\}/);
const datasourceMatch = originalSchema.match(/datasource[\s\S]*?\{[\s\S]*?\}/);

let merged = '';
if (generatorMatch) merged += generatorMatch[0] + '\n\n';
if (datasourceMatch) merged += datasourceMatch[0] + '\n\n';

// Read all .prisma files in models directory
const modelFiles = fs.readdirSync(MODELS_DIR).filter(f => f.endsWith('.prisma'));
for (const file of modelFiles) {
  const content = fs.readFileSync(path.join(MODELS_DIR, file), 'utf-8');
  merged += `// --- ${file} ---\n`;
  merged += content.trim() + '\n\n';
}

// Write merged schema back to schema.prisma
fs.writeFileSync(SCHEMA_PATH, merged.trim() + '\n');
console.log('Merged models into schema.prisma'); 