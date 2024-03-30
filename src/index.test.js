import { organization } from './index';

describe('Organization', () => {
  it('should have a name and a country', () => {
    expect(organization.name).toBe('Acme Gooseberries');
    expect(organization.country).toBe('GB');
  });
});
