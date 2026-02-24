const fs = require('fs');
const path = require('path');

const pagesDir = '/Users/owengarabedian/call-keeper/src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('<aside')) continue;
  
  let activeUserVar = 'userId';
  if (file === 'ControlCenter.tsx' || file === 'Payment.tsx') {
    activeUserVar = 'activeUserId';
  } else if (file === 'Dashboard.tsx') {
    activeUserVar = 'userId';
  }
  
  content = content.replace(/<aside[\s\S]*?<\/aside>/, `<Sidebar activeUserId={${activeUserVar}} />`);
  
  if (!content.includes('import { Sidebar }')) {
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport + 1) + 'import { Sidebar } from "../components/Sidebar";\n' + content.slice(endOfLastImport + 1);
    } else {
      content = 'import { Sidebar } from "../components/Sidebar";\n' + content;
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Processed', file);
}