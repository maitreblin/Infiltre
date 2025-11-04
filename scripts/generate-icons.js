import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Utiliser sharp si disponible, sinon utiliser une solution alternative
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Installation de sharp...');
  console.log('Exécutez: npm install sharp --save-dev');
  process.exit(1);
}

const svgBuffer = fs.readFileSync('./public/icon.svg');

async function generateIcons() {
  try {
    // Générer icon-192.png
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile('./public/icon-192.png');
    console.log('✓ icon-192.png créée');

    // Générer icon-512.png
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile('./public/icon-512.png');
    console.log('✓ icon-512.png créée');

    console.log('\n✅ Toutes les icônes ont été générées avec succès!');
  } catch (error) {
    console.error('Erreur lors de la génération des icônes:', error);
    process.exit(1);
  }
}

generateIcons();

