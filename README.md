# SleekFlow Playwright Automation

End-to-end test automation for the [SleekFlow](https://sleekflow.io) signup flow, built with **Playwright + TypeScript** using the Page Object Model (POM) pattern.

## Project Structure

```
├── locators/
│   └── signup.properties       # Element selectors (key=strategy=value)
├── pages/
│   ├── BasePage.ts             # Shared browser interaction methods
│   ├── SignupPage.ts           # Signup flow page object
│   └── index.ts
├── testdata/
│   └── signupData.json         # Signup credentials only (no validation strings)
├── tests/
│   └── signup.spec.ts          # 8 test cases: happy path + validation
├── utility/
│   ├── LocatorReader.ts        # Parses .properties → Playwright Locators
│   ├── DataReader.ts           # Reads JSON with dot-notation keys
│   └── index.ts
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## Key Design Decisions

**LocatorReader** — builds the Map once at construction, zero I/O per lookup. Supports 8 selector strategies: `css`, `xpath`, `id`, `text`, `testid`, `placeholder`, `label`, `role`. Role options (`name`, `exact`) are parsed from `role=button[name="Submit" exact=true]` syntax.

**DataReader** — dot-notation traversal (`get('signup.validUser.email')`), typed generics, minimal surface area.

**No validation text in JSON** — inline assertions in the spec file; only credential + company data lives in JSON.

## Prerequisites

- Node.js v18+
- npm

## Setup

```bash
git clone <repo-url>
cd sleekflow-playwright-automation
npm install
npx playwright install
```

## Running Tests

```bash
# All tests, all browsers
npm test

# Signup tests only (Chromium, headless)
npm run test:signup

# Signup tests visible in browser
npm run test:signup:headed

# By browser
npm run test:chrome
npm run test:firefox
npm run test:webkit

# Open HTML report after a run
npm run report
```

## Test Cases

| ID   | Scenario                                          |
|------|---------------------------------------------------|
| SF01 | Signup page loads correctly                       |
| SF02 | Valid credentials → proceeds to step 2            |
| SF03 | Full signup flow completes account creation       |
| SF04 | Invalid email format shows error                  |
| SF05 | Empty email shows error                           |
| SF06 | Empty password shows error                        |
| SF07 | Weak password shows error                         |
| SF08 | Already registered email shows error              |

## Notes on Locators

SleekFlow's signup form (`https://app.sleekflow.io/en?screen_hint=signup`) uses Auth0 under the hood. The `.properties` file uses `placeholder=` and `role=` strategies which are resilient to class-name changes. If the UI changes, update only `locators/signup.properties` — no TypeScript changes needed.
