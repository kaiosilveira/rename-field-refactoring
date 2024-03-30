import { Organization, organization } from './index';

describe('Organization', () => {
  it('should have a name and a country', () => {
    expect(organization.title).toBe('Acme Gooseberries');
    expect(organization.country).toBe('GB');
  });

  it('should support a title', () => {
    const org = new Organization({ title: 'Acme Gooseberries', country: 'GB' });
    expect(org.title).toBe('Acme Gooseberries');
  });
});
