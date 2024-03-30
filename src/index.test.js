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

  it('should give title precedence over name', () => {
    const title = 'Acme Gooseberries';
    const name = 'Acme Berries';
    const org = new Organization({ title, name, country: 'GB' });
    expect(org.name).toBe(title);
  });
});
