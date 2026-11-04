import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = resolve(process.argv[2]);
const assets = join(directory, 'lf-signature');
await mkdir(assets, { recursive: true });
for (const name of ['signature.css', 'signature.js', 'brand.woff2']) {
  await cp(fileURLToPath(new URL(name, import.meta.url)), join(assets, name));
}
async function install(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) { await install(path); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const html = await readFile(path, 'utf8');
    if (!/<footer\b/i.test(html) || html.includes('src="/lf-signature/signature.js"')) continue;
    const withFallback = html.replace(/<footer\b[\s\S]*?<\/footer>/gi, footer =>
      footer.replace(/href="https:\/\/(?:www\.)?littlefightnyc\.com\/?"/gi, 'href="https://littlefightnyc.com/case-studies/logan-loans/"')
    );
    await writeFile(path, withFallback.replace(/<\/head>/i, '<script defer data-lf-signature src="/lf-signature/signature.js"></script></head>'));
  }
}
await install(directory);
