import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const htmlPath = '/home/ubuntu/browser_html/yen0110122009-cell_github_io_gocnhocuaong-web_1787213211238.html';
console.log('source_exists=', existsSync(htmlPath));
if (existsSync(htmlPath)) {
  const html = readFileSync(htmlPath, 'utf8');
  console.log('length=', html.length);
  console.log(html.slice(0, 5000));
}
console.log('\n--- pages ---');
try { console.log(execFileSync('gh', ['api', 'repos/yen0110122009-cell/gocnhocuaong-web/pages'], { encoding: 'utf8' }).slice(0, 3000)); } catch (error) { console.log(String(error)); }
console.log('\n--- runs ---');
try { console.log(execFileSync('gh', ['run', 'list', '--repo', 'yen0110122009-cell/gocnhocuaong-web', '--limit', '3'], { encoding: 'utf8' })); } catch (error) { console.log(String(error)); }
