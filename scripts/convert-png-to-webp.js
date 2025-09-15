#!/usr/bin/env node
/**
 * Convert all .png files under public/ to .webp with same relative path.
 */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');

async function* walk(dir) {
  for await (const d of await fsp.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) {
      yield* walk(entry);
    } else if (d.isFile()) {
      yield entry;
    }
  }
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function convertPngToWebp(inputPath, outputPath) {
  await ensureDir(path.dirname(outputPath));
  await sharp(inputPath)
    .webp({ quality: 82 })
    .toFile(outputPath);
}

async function main() {
  const pngFiles = [];
  for await (const file of walk(PUBLIC_DIR)) {
    if (file.toLowerCase().endsWith('.png')) pngFiles.push(file);
  }

  if (pngFiles.length === 0) {
    console.log('No .png files found under', PUBLIC_DIR);
    return;
  }

  console.log(`Found ${pngFiles.length} .png files. Converting to .webp...`);
  let converted = 0;
  for (const input of pngFiles) {
    const output = input.slice(0, -4) + '.webp';
    try {
      // Skip if output exists and is newer than input
      let skip = false;
      try {
        const [inStat, outStat] = [fs.statSync(input), fs.statSync(output)];
        if (outStat.mtimeMs >= inStat.mtimeMs) {
          skip = true;
        }
      } catch {}

      if (!skip) {
        await convertPngToWebp(input, output);
        converted++;
        console.log('Converted:', path.relative(PUBLIC_DIR, input), '->', path.relative(PUBLIC_DIR, output));
      } else {
        // console.log('Up-to-date:', path.relative(PUBLIC_DIR, output));
      }
    } catch (err) {
      console.error('Failed converting', input, err);
    }
  }

  console.log(`Done. Converted ${converted} file(s).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


