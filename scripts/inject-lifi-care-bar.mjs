import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const stylesheet = '<link rel="stylesheet" href="/lifi-care.css">';
const careBar = `
<aside class="lf-care-bar" aria-label="Little Fight NYC design and care credit">
  <div class="lf-care-bar__inner">
    <a class="lf-care-bar__link" href="https://littlefightnyc.com/" rel="author">
      <span class="lf-tug-stage" aria-hidden="true"><img src="/assets/lifi/mark-orange.svg" width="72" height="48" alt=""></span>
      <span class="lf-care-bar__credit"><span class="lf-care-bar__service">Designed, Built and Cared For By</span><span class="lf-care-bar__brand" translate="no">LittleFightNYC.com</span></span>
    </a>
  </div>
</aside>`;

const count = (source, pattern) => (source.match(pattern) || []).length;

export function injectCareBar(source, file) {
  if (!/<footer\b/i.test(source)) return null;
  if (count(source, /class=["'][^"']*\blf-care-bar\b/i)) throw new Error(`${file}: duplicate care bar`);
  if (!/<\/footer>/i.test(source)) throw new Error(`${file}: footer is not closed`);
  const landmarks = [count(source, /<main\b/gi), count(source, /<\/main>/gi), count(source, /<footer\b/gi), count(source, /<\/footer>/gi)].join('/');
  let output = source.replace(
    /<(div|p)\b[^>]*>(?:(?!<\/\1>)[\s\S])*?Designed,\s*Hosted\s*and\s*Cared\s*For\s*By(?:(?!<\/\1>)[\s\S])*?LittleFightNYC\.com(?:(?!<\/\1>)[\s\S])*?<\/\1>/gi,
    '',
  );
  if (!output.includes('/lifi-care.css')) output = output.replace(/<\/head>/i, `${stylesheet}\n</head>`);
  output = output.replace(/<\/footer>/i, `</footer>${careBar}`);
  const finalLandmarks = [count(output, /<main\b/gi), count(output, /<\/main>/gi), count(output, /<footer\b/gi), count(output, /<\/footer>/gi)].join('/');
  if (finalLandmarks !== landmarks) throw new Error(`${file}: care bar changed main/footer landmarks`);
  if (/Designed,\s*Hosted\s*and\s*Cared\s*For\s*By/i.test(output)) throw new Error(`${file}: legacy care credit remains`);
  for (const marker of ['Designed, Built and Cared For By', 'https://littlefightnyc.com/', '/assets/lifi/mark-orange.svg']) {
    if (!output.includes(marker)) throw new Error(`${file}: missing care-bar marker ${marker}`);
  }
  return output;
}

export async function injectLifiCareBar(directory) {
  const files = (await readdir(directory)).filter(file => file.endsWith('.html')).sort();
  let pages = 0;
  for (const file of files) {
    const target = path.join(directory, file);
    const output = injectCareBar(await readFile(target, 'utf8'), file);
    if (output === null) continue;
    await writeFile(target, output);
    pages += 1;
  }
  if (!pages) throw new Error('No public footer received the Little Fight care bar');
  return { pages };
}
