# SleekFlow Playwright Automation

End-to-end test automation for the [SleekFlow](https://sleekflow.io) signup flow, built with **Playwright + TypeScript** using the Page Object Model (POM) pattern.

## Project Structure

```
├── locators/
│   └── signup.properties       # Element selectors (key=strategy=value)
├── pages/
│   ├── BasePage.ts             # Shared browser interaction methods
│   ├── SignupPage.ts           # Signup flow page object
|   ├── LoginPage.json          # Signin flow page object
│   └── index.ts
├── testdata/
│   ├── signinData.json       # Signin credentials only
│   ├── signupData.json       # Signup credentials only
├── tests/
│   ├── signin.spec.ts      # test suite (happy path and negative case)
│   ├── signup.spec.ts      # test suite (happy path and negative case)
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

# SignIn tests only (Chromium, headless)
npm run test:signin

# Signup tests visible in browser
npm run test:signin:headed

# By browser headless
npm run test:chrome
npm run test:firefox
npm run test:webkit

# Run specific test 
npx playwright test -g "LOG01" --project=chromium
npx playwright test -g "REG01" --project=chromium

# Open HTML report after a run
npm run report
```

## Test Cases

| ID   | Scenario                                                     |
|------|---------------------------------------------------           |
| LOG01 | Login with all field username / email and password is empty |                       
| LOG02 | Login with wrong password                                   |
| LOG03 | Login with valid email and password                         |
| LOG04 | Login with valid email and empty password                   |
| REG01 | signup with invalid format email                            |
| REG02 | signup with empty email                                     |
| REG03 | signup without thick checkbox                               |
| REG04 | signup with existing users                                  |
| REG05 | signup with valid users                                     |
| REG06 | signup with empty password                                  |
| REG07 | signup with password less than minimum characters           |
| REG08 | signup with password only contains lower case and number       |
| REG09 | signup with password only contains lower case and upper case   |
| REG10 | signup with password only contains lower case and special characters |
| REG11 | signup with password only contains upper case and number             |
| REG12 | signup with password only contains upper case and special characters |
| REG13 | signup with password only contains number and special characters     |

SleekFlow's signup form (`https://app.sleekflow.io/en?screen_hint=signup`) uses Auth0 under the hood. The `.properties` file uses `placeholder=` and `role=` strategies which are resilient to class-name changes. If the UI changes, update only `locators/signup.properties` — no TypeScript changes needed.
