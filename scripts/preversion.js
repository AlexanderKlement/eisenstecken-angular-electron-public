#!/usr/bin/env node
/* eslint-env es6 */
const fs = require("fs");
const path = require("path");
const projectDir = process.env.npm_config_local_prefix;
const oldVersion = process.env.npm_old_version;
const newVersion = process.env.npm_new_version;

console.log(`[preversion] Bumping ${oldVersion} → ${newVersion}`);

function replaceVersion(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    console.warn(`  [skip] File not found: ${filePath}`);
    return;
  }
  const original = fs.readFileSync(abs, "utf8");
  const updated = original.replace(oldVersion, newVersion);
  if (original === updated) {
    console.log(`  [unchanged] ${filePath}`);
  } else {
    fs.writeFileSync(abs, updated, "utf8");
    console.log(`  [updated] ${filePath}`);
  }
}

replaceVersion(`${projectDir}/app/package.json`);
replaceVersion(`${projectDir}/src/main.ts`);
replaceVersion(`${projectDir}/app/main.ts`);
console.log(`[preversion] Done.`);
