export class Organization {
  constructor(data) {
    this._title = data.title ?? data.name;
    this._country = data.country;
  }

  get name() {
    return this._title;
  }

  set name(aString) {
    this._title = aString;
  }

  get country() {
    return this._country;
  }

  set country(aCountryCode) {
    this._country = aCountryCode;
  }
}

export const organization = new Organization({ title: 'Acme Gooseberries', country: 'GB' });
