# Dashboard Testing Guide

This document describes the unit tests created for the dashboard application.

## Test Setup

The testing framework is configured with:

- **Jest** - Test runner
- **React Testing Library** - Component testing utilities
- **ts-jest** - TypeScript support for Jest

### Configuration Files

- `jest.config.js` - Jest configuration
- `jest.setup.js` - Global test setup and mocks

### Test Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Tests are organized by feature/component in `__tests__` directories:

```
app/
├── lib/
│   └── __tests__/
│       ├── api.test.ts
│       ├── auth.test.ts
│       └── utils.test.ts
├── components/
│   └── __tests__/
│       ├── ConfirmModal.test.tsx
│       ├── LoginForm.test.tsx
│       └── SignupForm.test.tsx
└── contexts/
    └── __tests__/
        └── AuthContext.test.tsx
```

## Test Coverage

### Utility Functions (`lib/__tests__/utils.test.ts`)

Tests for utility functions including:

- `formatCurrency` - Currency formatting
- `formatDateToLocal` - Date formatting
- `generateYAxis` - Y-axis label generation for charts
- `generatePagination` - Pagination array generation

**Coverage:**

- ✅ Currency formatting with various inputs
- ✅ Date formatting with different locales
- ✅ Y-axis generation for revenue charts
- ✅ Pagination logic for different page counts

### API Utilities (`lib/__tests__/api.test.ts`)

Tests for API configuration and interceptors:

- Axios instance configuration
- Request interceptor (token injection)
- Response interceptor (401 error handling)

**Coverage:**

- ✅ Base URL configuration
- ✅ Authorization header injection
- ✅ 401 error handling and logout
- ✅ Non-browser environment handling

### Auth Service (`lib/__tests__/auth.test.ts`)

Tests for authentication service methods:

- `login` - User login
- `register` - User registration
- `getProfile` - Fetch user profile
- `logout` - User logout
- `getStoredUser` - Get user from localStorage
- `isAuthenticated` - Check authentication status
- `updateProfile` - Update user profile
- `changePassword` - Change user password

**Coverage:**

- ✅ Successful login with token storage
- ✅ Registration flow
- ✅ Profile fetching
- ✅ Logout functionality
- ✅ LocalStorage interactions
- ✅ Error handling
- ✅ Non-browser environment handling

### Components

#### LoginForm (`components/__tests__/LoginForm.test.tsx`)

Tests for the login form component:

- ✅ Form rendering
- ✅ Input field updates
- ✅ Form submission
- ✅ Loading states
- ✅ Error display
- ✅ Validation requirements

#### SignupForm (`components/__tests__/SignupForm.test.tsx`)

Tests for the signup form component:

- ✅ Form rendering
- ✅ Input field updates
- ✅ Password validation (minimum 6 characters)
- ✅ Form submission
- ✅ Loading states
- ✅ Error display
- ✅ Validation requirements

#### ConfirmModal (`components/__tests__/ConfirmModal.test.tsx`)

Tests for the confirmation modal component:

- ✅ Conditional rendering based on `isOpen`
- ✅ Custom title and message display
- ✅ Confirm action handling
- ✅ Cancel action handling
- ✅ Loading states
- ✅ Button disable states
- ✅ Error handling
- ✅ Custom styling props

### Contexts

#### AuthContext (`contexts/__tests__/AuthContext.test.tsx`)

Tests for the authentication context:

- ✅ Context provider initialization
- ✅ User loading from localStorage
- ✅ Login functionality
- ✅ Registration functionality (with auto-login)
- ✅ Logout functionality
- ✅ Context hook usage validation
- ✅ Error handling

## Mocking Strategy

### API Calls

All API calls are mocked using `jest.mock()`:

- `@/app/lib/auth` - Auth service methods
- `@/app/lib/api` - Axios instance

### Browser APIs

- `localStorage` - Mocked for all tests
- `window.location` - Mocked for navigation tests

### Next.js

- `next/navigation` - Router hooks mocked

## Running Tests

### Install Dependencies

First, make sure all dependencies are installed:

```bash
cd apps/dashboard
pnpm install
```

### Run All Tests

```bash
npm test
```

### Run Specific Test Files

```bash
npm test -- utils.test.ts
npm test -- LoginForm.test.tsx
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

## Test Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Mocking**: External dependencies are properly mocked
3. **Cleanup**: Mocks are cleared between tests
4. **Async Handling**: Proper use of `waitFor` and `act` for async operations
5. **Accessibility**: Tests use accessible queries (labels, roles, etc.)

## Future Test Additions

Consider adding tests for:

- Additional components (BookmarkFormModal, TagFormModal, UserFormModal)
- Additional services (bookmarksService, tagsService, usersService)
- Page components (dashboard pages)
- Custom hooks (if any)
- Integration tests for complete user flows

## Notes

- Tests use React Testing Library's best practices for component testing
- All tests are written in TypeScript for type safety
- Mock functions are properly typed to maintain type safety
- Error cases are thoroughly tested
