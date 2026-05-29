#!/usr/bin/env node
/* eslint-env es6 */
const { execSync } = require("child_process");
const { version } = require("../package.json");
const fs = require("fs");

console.log(`[postversion] Finalising ${version}`);

function run(cmd) {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

if (!fs.existsSync("./dist")) {
  console.warn(`  [postversion] Dist not found, skipping...`);
  console.warn(`  [postversion] Please re-run node scripts/postversion.js from the root directory of the project.`);
}


// Sentry
run(`sentry-cli releases new "${version}" --org eisenstecken --project angualar-eisenstecken-it`);
run(`sentry-cli releases finalize "${version}" --org eisenstecken --project angualar-eisenstecken-it`);
run(`sentry-cli sourcemaps inject --release "${version}" --org eisenstecken --project angualar-eisenstecken-it ./dist`);
run(`sentry-cli --url https://sentry.kivi.bz.it/ sourcemaps upload --release "${version}" --org eisenstecken --project angualar-eisenstecken-it ./dist`);

console.log(`[postversion] Done. New version: ${version}`);
