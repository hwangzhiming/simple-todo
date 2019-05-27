var fs = require('fs');
var content = fs.readFileSync('dist/index.html', 'utf-8');
content = content.replace('<body>', '<body class="popup">');
fs.writeFileSync('dist/popup.html', content, 'utf-8');
