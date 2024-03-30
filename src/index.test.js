import { Organization, organization } from './index';

describe('Organization', () => {
  it('should have a name and a country', () => {
    expect(organization.name).toBe('Acme Gooseberries');
    expect(organization.country).toBe('GB');
  });

  it('should support a title', () => {
    const org = new Organization({ title: 'Acme Gooseberries', country: 'GB' });
    expect(org.name).toBe('Acme Gooseberries');
  });
});
