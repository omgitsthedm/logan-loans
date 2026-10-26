export const BUSINESS_ID = 'https://logan.loans/#business';
export const PERSON_ID = 'https://logan.loans/#logan-sullivan';
const legacyBusinessIds = new Set([
  'https://logan.loans/#localbusiness',
  'https://logan.loans/#organization',
  'https://logan.loans/#org',
]);
const types = (node) => [].concat(node?.['@type'] || []);
export const isLoganBusiness = (node) => (
  types(node).some((type) => ['Organization', 'LocalBusiness', 'FinancialService'].includes(type))
  && /^Logan Loans(?:$|\s+[—–-])/.test(node.name || '')
);

export function schemaNodes(value, nodes = []) {
  if (!value || typeof value !== 'object') return nodes;
  if (!Array.isArray(value)) nodes.push(value);
  for (const child of Object.values(value)) schemaNodes(child, nodes);
  return nodes;
}

// One business identity, while Logan Sullivan and Forward Loans remain distinct.
export function schemaIdentityIssues(schemas, canonicalUrl) {
  const issues = [];
  const nodes = schemaNodes(schemas);
  const page = nodes.find((node) => types(node).includes('WebPage') && node.url === canonicalUrl);
  if (page?.breadcrumb?.['@id'] && !nodes.some((node) => types(node).includes('BreadcrumbList') && node['@id'] === page.breadcrumb['@id'])) {
    issues.push('WebPage breadcrumb reference has no matching BreadcrumbList');
  }
  for (const node of nodes) {
    if (types(node).includes('City') && ('addressRegion' in node || 'addressCountry' in node)) {
      issues.push('City address fields belong inside a PostalAddress');
    }
    if (types(node).includes('DefinedTermSet') && 'inDefinedTermSet' in node) {
      issues.push('DefinedTermSet cannot use the DefinedTerm membership property');
    }
    if (legacyBusinessIds.has(node['@id'])) issues.push(`Legacy business identity ${node['@id']}`);
    if (isLoganBusiness(node) && node['@id'] !== BUSINESS_ID) issues.push('Logan Loans business lacks its canonical identity');
    if (types(node).includes('Person') && node.name === 'Logan Sullivan' && node['@id'] !== PERSON_ID) {
      issues.push('Logan Sullivan lacks his distinct person identity');
    }
    if (/^Forward Loans/.test(node.name || '') && node['@id'] === BUSINESS_ID) issues.push('Forward Loans must not be merged into the Logan Loans brand');
    if (types(node).includes('WebSite') && node.publisher?.['@id'] !== BUSINESS_ID) issues.push('WebSite publisher is disconnected from the business');
    if (types(node).includes('WebPage') && node['@id']?.startsWith('https://logan.loans/') && node.publisher?.['@id'] !== BUSINESS_ID) {
      issues.push('WebPage publisher is disconnected from the business');
    }
    if (types(node).includes('Service')) {
      if (![BUSINESS_ID, PERSON_ID].includes(node.provider?.['@id'])) issues.push('Service provider is disconnected');
      if (node.url !== canonicalUrl || node.mainEntityOfPage?.['@id'] !== page?.['@id']) issues.push('Service does not point to its own page');
      if (!node['@id'] || page?.mainEntity?.['@id'] !== node['@id']) issues.push('Service page does not point back to its service');
    }
  }
  return issues;
}
