const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const filesToProcess = ['App.tsx'];
walk('./src', function(filePath) {
  if (filePath.endsWith('.tsx') && filePath !== 'src/components/Text.tsx') {
    filesToProcess.push(filePath);
  }
});

filesToProcess.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Check if it imports Text from react-native
  if (content.match(/import\s+{([^}]*)\bText\b([^}]*)}\s+from\s+['"]react-native['"]/)) {
    // Remove Text from the react-native import
    content = content.replace(/(import\s+{[^}]*)\bText\b\s*,?\s*([^}]*}\s+from\s+['"]react-native['"])/g, (match, p1, p2) => {
      // Clean up hanging commas
      let replaced = p1 + p2;
      replaced = replaced.replace(/{\s*,/, '{').replace(/,\s*}/, '}').replace(/,\s*,/, ',');
      return replaced;
    });

    // Handle case where import becomes empty `import {} from 'react-native'`
    content = content.replace(/import\s+{\s*}\s*from\s+['"]react-native['"];?\n?/g, '');

    // Figure out relative path to src/components/Text
    let relPath = '';
    if (file === 'App.tsx') {
      relPath = './src/components/Text';
    } else {
      const depth = file.split('/').length - 2; // src/components/Cell.tsx -> depth 1 -> ../
      relPath = depth === 0 ? './components/Text' : '../'.repeat(depth) + 'components/Text';
    }

    // Add new import
    const newImport = `import { Text } from '${relPath}';\n`;
    
    // Insert after the first import or at the top
    if (content.startsWith('import ')) {
      content = content.replace(/^(import .*?\n)/, `$1${newImport}`);
    } else {
      content = newImport + content;
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
