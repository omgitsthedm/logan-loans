import assert from 'node:assert/strict';
import test from 'node:test';
import { BUSINESS_ID, PERSON_ID, schemaIdentityIssues } from './schema-identity.mjs';

const url = 'https://logan.loans/programs';
function connectedGraph() {
  return [
    { '@type': 'LocalBusiness', '@id': BUSINESS_ID, name: 'Logan Loans' },
    { '@type': 'Person', '@id': PERSON_ID, name: 'Logan Sullivan', worksFor: { '@type': 'Organization', name: 'Forward Loans LLC' } },
    { '@type': 'WebSite', '@id': 'https://logan.loans/#website', publisher: { '@id': BUSINESS_ID } },
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, publisher: { '@id': BUSINESS_ID }, mainEntity: { '@id': `${url}#service` } },
    { '@type': 'Service', '@id': `${url}#service`, url, provider: { '@id': BUSINESS_ID }, mainEntityOfPage: { '@id': `${url}#webpage` } },
  ];
}
test('connected business, person and service identities remain distinct', () => {
  assert.deepEqual(schemaIdentityIssues(connectedGraph(), url), []);
});
test('an anonymous or legacy business cannot fragment the entity again', () => {
  for (const id of [undefined, 'https://logan.loans/#localbusiness', 'https://logan.loans/#organization', 'https://logan.loans/#org']) {
    const graph = connectedGraph(); graph[0]['@id'] = id;
    assert.ok(schemaIdentityIssues(graph, url).some((message) => message.includes('business')));
  }
});
test('the employer cannot be collapsed into the brand', () => {
  const graph = connectedGraph(); graph[1].worksFor['@id'] = BUSINESS_ID;
  assert.ok(schemaIdentityIssues(graph, url).some((message) => message.includes('Forward Loans')));
});
test('an anonymous provider or publisher breaks the graph', () => {
  const graph = connectedGraph(); graph[4].provider = { '@type': 'Person', name: 'Logan Sullivan' }; delete graph[2].publisher;
  const issues = schemaIdentityIssues(graph, url);
  assert.ok(issues.some((message) => message.includes('provider')));
  assert.ok(issues.some((message) => message.includes('publisher')));
});
test('a service must link to the correct page in both directions', () => {
  const graph = connectedGraph(); graph[4].mainEntityOfPage = { '@id': 'https://logan.loans/wrong#webpage' }; delete graph[3].mainEntity;
  const issues = schemaIdentityIssues(graph, url);
  assert.ok(issues.some((message) => message.includes('own page')));
  assert.ok(issues.some((message) => message.includes('point back')));
});
test('a service-area city keeps postal fields on its address', () => {
  const city = { '@type': 'City', name: 'Beverly Hills', addressRegion: 'CA', addressCountry: 'US' };
  assert.ok(schemaIdentityIssues([city], url).some((message) => message.includes('PostalAddress')));
  assert.deepEqual(schemaIdentityIssues([{ '@type': 'City', name: city.name, address: { '@type': 'PostalAddress', addressRegion: city.addressRegion, addressCountry: city.addressCountry } }], url), []);
});
test('a glossary is a set, not a term belonging to itself', () => {
  const glossary = { '@type': 'DefinedTermSet', '@id': 'https://logan.loans/glossary#termset', inDefinedTermSet: 'https://logan.loans/glossary#termset' };
  assert.ok(schemaIdentityIssues([glossary], url).some((message) => message.includes('DefinedTermSet')));
  delete glossary.inDefinedTermSet;
  assert.deepEqual(schemaIdentityIssues([glossary], url), []);
});
test('the page breadcrumb reference resolves to its actual list', () => {
  const graph = connectedGraph();
  graph[3].breadcrumb = { '@id': `${url}#breadcrumb` };
  assert.ok(schemaIdentityIssues(graph, url).some((message) => message.includes('BreadcrumbList')));
  graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb` });
  assert.deepEqual(schemaIdentityIssues(graph, url), []);
});
test('the service-area business publishes no office address, coordinates, or non-Instagram socials', () => {
  const business = { '@type': 'LocalBusiness', '@id': 'https://logan.loans/#business', name: 'Logan Loans', areaServed: [{ '@type': 'State', name: 'Arizona' }, { '@type': 'State', name: 'California' }], sameAs: ['https://www.instagram.com/logan.loans'] };
  assert.deepEqual(schemaIdentityIssues([business], url), []);
  const withAddress = { ...business, address: { '@type': 'PostalAddress', streetAddress: '11201 N Tatum Blvd #300', postalCode: '85028' } };
  assert.ok(schemaIdentityIssues([withAddress], url).some((message) => message.includes('HQ address')));
  assert.ok(schemaIdentityIssues([{ ...business, geo: { '@type': 'GeoCoordinates', latitude: 33.6373, longitude: -111.977 } }], url).some((message) => message.includes('coordinates')));
  assert.ok(schemaIdentityIssues([{ ...business, sameAs: ['https://www.linkedin.com/in/logansulliv'] }], url).some((message) => message.includes('Instagram')));
});
