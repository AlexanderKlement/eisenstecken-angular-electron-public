#!/usr/bin/env node
/* eslint-env es6 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

// ─── Read current (staged) package.json version ───────────────────────────────
const dialogPath = path.join(root, "src/app/home/info-dialog/info-dialog.component.ts");
const appPkgJson = path.join(root, "app/package.json");
const srcMain = path.join(root, "src/main.ts");
const appMain = path.join(root, "app/main.ts");
const packageJsonPath = path.join(root, "package.json");

function checkExists(path) {
  if (!fs.existsSync(path)) {
    console.error(`[check-version] ❌ Could not find file at:\n  ${path}`);
    process.exit(1);
  }
}

[dialogPath, appPkgJson, srcMain, appMain, packageJsonPath].forEach(file => {
  checkExists(file);
});

const newVersion = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")).version;

// ─── Read version from last commit ───────────────────────────────────────────

let oldVersion;
try {
  const oldPackageJson = execSync("git show HEAD:package.json", { cwd: root }).toString();
  oldVersion = JSON.parse(oldPackageJson).version;
} catch (_) {
  // No previous commit (initial commit) — nothing to check
  process.exit(0);
}

// ─── If version hasn't changed, nothing to validate ──────────────────────────

if (newVersion === oldVersion) {
  process.exit(0);
}

console.log(`[check-version] Version changed: ${oldVersion} → ${newVersion}`);

// ─── Check that patch notes exist for the new version ────────────────────────

function checkContentForVersion(file) {
  const content = fs.readFileSync(file, "utf8");
  if (!content.includes(newVersion)) {
    console.error(`
[check-version] ❌ Aborting commit.

  package.json was bumped to v${newVersion}, but this version is not found in:

    ${file}

  Please add release notes for v${newVersion} before committing in info-dialog.component.ts,
  and use "npm run version:[patch|minor|mayor]" to bump correctly via the version hooks.
`);
    process.exit(1);
  }
}

[dialogPath, appPkgJson, srcMain, appMain].forEach(file => {
  checkContentForVersion(file);
});


console.log(`[check-version] ✅ Patch notes for v${newVersion} found. Proceeding.`);
