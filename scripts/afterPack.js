const fs = require('fs');
const path = require('path');
 
exports.default = async function afterPack({ appOutDir, packager }) {
  const appName = packager.appInfo.productFilename;
  const contentsDir = path.join(
    appOutDir,
    `${appName}.app`,
    'Contents'
  );
 
  if (!fs.existsSync(contentsDir)) return;
 
  // Remove any non-binary files directly inside Contents/ that would break codesign for mac
  const unsignableFiles = ['LICENSE', 'LICENSE.txt', 'LICENSE.md', 'NOTICE', 'CREDITS'];
  
  for (const file of unsignableFiles) {
    const filePath = path.join(contentsDir, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Removed unsignable file before signing: Contents/${file}`);
    }
  }
};