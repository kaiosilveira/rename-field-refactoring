[![Continuous Integration](https://github.com/kaiosilveira/rename-field-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/rename-field-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Rename Field

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
class Organization {
  get name() {
    // ...
  }
}
```

</td>

<td>

```javascript
class Organization {
  get title() {
    // ...
  }
}
```

</td>
</tr>
</tbody>
</table>

Naming is one of the hardest things in the programming world. No matter how well we know our problem space and our domain, we will often want to rename bits of code here and there to improve clarity, legibility, and to better reflect our updated understanding. This refactoring helps with these cases.

## Working example

Our working example, extracted from the book, is a simple organization record. It contains a name and a country:

```javascript
export const organization = { name: 'Acme Gooseberries', country: 'GB' };
```

We want to rename `name` to `title`.

### Test suite

The test suite is equally simple: it has a single test that ensures that the organization record contains the name and title, and looks like this:

```javascript
import { organization } from './index';

describe('Organization', () => {
  it('should have a name and a country', () => {
    expect(organization.name).toBe('Acme Gooseberries');
    expect(organization.country).toBe('GB');
  });
});
```

This test will protect against breaking changes going unnoticed. With that, we're ready to start.

### Steps

We start by applying [Encapsulate Record](https://github.com/kaiosilveira/encapsulate-record-refactoring) on `organization`, effectively wrapping it into a class:

```diff
+++ b/src/index.js
@@ -1 +1,24 @@
-export const organization = { name: 'Acme Gooseberries', country: 'GB' };
+export class Organization {
+  constructor(data) {
+    this._name = data.name;
+    this._country = data.country;
+  }
+
+  get name() {
+    return this._name;
+  }
+
+  set name(aString) {
+    this._name = aString;
+  }
+
+  get country() {
+    return this._country;
+  }
+
+  set country(aCountryCode) {
+    this._country = aCountryCode;
+  }
+}
+
+export const organization = new Organization({ name: 'Acme Gooseberries', country: 'GB' });
```

Then, we can internally rename `_name` to `_title`:

```diff
+++ b/src/index.js
@@ -1,15 +1,15 @@
 export class Organization {
   constructor(data) {
-    this._name = data.name;
+    this._title = data.name;
     this._country = data.country;
   }
   get name() {
-    return this._name;
+    return this._title;
   }
   set name(aString) {
-    this._name = aString;
+    this._title = aString;
   }
   get country() {
```

Now, on to the migration phase, we add support for a `title` property provided in the constructor, so callers can gradually migrate to the new version:

```diff
+++ b/src/index.js
@@ -1,6 +1,6 @@
 export class Organization {
   constructor(data) {
-    this._title = data.name;
+    this._title = data.title ?? data.name;
     this._country = data.country;
   }

diff --git a/src/index.test.js b/src/index.test.js
@@ -1,8 +1,13 @@
-import { organization } from './index';
+import { Organization, organization } from './index';
 describe('Organization', () => {
   it('should have a name and a country', () => {
     expect(organization.name).toBe('Acme Gooseberries');
     expect(organization.country).toBe('GB');
   });
+
+  it('should support a title', () => {
+    const org = new Organization({ title: 'Acme Gooseberries', country: 'GB' });
+    expect(org.name).toBe('Acme Gooseberries');
+  });
+
+  it('should give title precedence over name', () => {
+    const title = 'Acme Gooseberries';
+    const name = 'Acme Berries';
+    const org = new Organization({ title, name, country: 'GB' });
+    expect(org.name).toBe(title);
+  });
 });
```

Two tests were introduced with this modification, so we're sure that `title` is being correctly assigned to `name` and that it takes precedence.

Then, we can update caller by caller of `Organization` to provide a `title` instead of `name` when creating an instance of the class:

```diff
diff --git a/src/index.js b/src/index.js
@@ -21,4 +21,4 @@ export class Organization {
   }
 }

-export const organization = new Organization({ name: 'Acme Gooseberries', country: 'GB' });
+export const organization = new Organization({ title: 'Acme Gooseberries', country: 'GB' });

diff --git a/src/index.test.js b/src/index.test.js
@@ -10,11 +10,4 @@ describe('Organization', () => {
     const org = new Organization({ title: 'Acme Gooseberries', country: 'GB' });
     expect(org.name).toBe('Acme Gooseberries');
   });
-
-  it('should give title precedence over name', () => {
-    const title = 'Acme Gooseberries';
-    const name = 'Acme Berries';
-    const org = new Organization({ title, name, country: 'GB' });
-    expect(org.name).toBe(title);
-  });
 });
```

Notice that we removed the test for the precedence of `title` over `name`, since it doesn't make sense anymore.

After all callers are migrated, we're happy to drop support for the `name` prop:

```diff
+++ b/src/index.js
@@ -1,6 +1,6 @@
 export class Organization {
   constructor(data) {
-    this._title = data.title ?? data.name;
+    this._title = data.title;
     this._country = data.country;
   }

```

Finally, we can rename the `name` getter and setter to `title`:

```diff
+++ b/src/index.js
@@ -4,11 +4,11 @@ export class Organization {
     this._country = data.country;
   }
-  get name() {
+  get title() {
     return this._title;
   }
-  set name(aString) {
+  set title(aString) {
     this._title = aString;
   }

diff --git a/src/index.test.js b/src/index.test.js
@@ -2,12 +2,12 @@ import { Organization, organization } from './index';
 describe('Organization', () => {
   it('should have a name and a country', () => {
-    expect(organization.name).toBe('Acme Gooseberries');
+    expect(organization.title).toBe('Acme Gooseberries');
     expect(organization.country).toBe('GB');
   });
   it('should support a title', () => {
     const org = new Organization({ title: 'Acme Gooseberries', country: 'GB' });
-    expect(org.name).toBe('Acme Gooseberries');
+    expect(org.title).toBe('Acme Gooseberries');
   });
 });
```

And that's it for this one!

### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                          | Message                                                                |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [45c572c](https://github.com/kaiosilveira/rename-field-refactoring/commit/45c572cd4479f30630d4f966cb15a9cecca8cb94) | encapsulate `organization` in a class                                  |
| [ddae54a](https://github.com/kaiosilveira/rename-field-refactoring/commit/ddae54ae5b1b7cc4b40072e29c56a6498370232d) | rename internal `_name` to `_title`                                    |
| [ac6cd7c](https://github.com/kaiosilveira/rename-field-refactoring/commit/ac6cd7cf112e8b4d1f86fb6c23a9f895ad17cbc1) | add support for a `title` ctor prop                                    |
| [89b1d16](https://github.com/kaiosilveira/rename-field-refactoring/commit/89b1d16fd1925849daae6d1bd1872eac6c6a380d) | update `Organization` callers to use `title` instead of `name` at ctor |
| [634f01b](https://github.com/kaiosilveira/rename-field-refactoring/commit/634f01b70692abf9d8c0f3571ffcc21c6065a095) | drop support for `name` ctor prop                                      |
| [dcfb77e](https://github.com/kaiosilveira/rename-field-refactoring/commit/dcfb77e2ffbda63055a7fc8a6a14095320c3b861) | rename `name` getter to `title`                                        |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/rename-field-refactoring/commits/main).
