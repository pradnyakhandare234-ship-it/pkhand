# Demo Register Test (TestCafe)

This project contains a TestCafe test and a Page Object Model (POM) to automate the registration feature on https://demo.automationtesting.in/Register.html

Quick start:

1. Install dependencies:

```powershell
npm install
```

2. Run the test (opens Chrome):

```powershell
npm test
```

Files added:
- `pages/register.page.js` — POM for the register page.
- `tests/register.test.js` — TestCafe test using the POM.
- `tests/fixtures/sample.txt` — fixture file for upload.
- `package.json` — includes `test` script and `testcafe` dev dependency.
