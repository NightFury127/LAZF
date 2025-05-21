# Testing Guide for Lazreus Tech

This document provides information on how to run tests for the Lazreus Tech application.

## Testing Setup

The project uses Jest as the testing framework along with React Testing Library for component testing. The testing environment is configured to work with Next.js.

### Test Files Structure

Tests are organized in the `__tests__` directory with the following structure:

```
__tests__/
├── api/                  # API endpoint tests
│   └── health.test.ts    # Health endpoint test
├── components/           # Component tests
│   ├── Button.test.tsx   # Button component test
│   └── UserProfile.test.tsx  # UserProfile component test
└── utils/                # Utility function tests
    └── formatDate.test.ts    # Date formatting utility test
```

## Running Tests

You can run tests using the following npm scripts:

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Writing New Tests

### Component Tests

When writing tests for React components:

1. Import the necessary testing utilities:
   ```typescript
   import { render, screen, fireEvent } from '@testing-library/react';
   import '@testing-library/jest-dom';
   ```

2. Write your test using the Jest `describe` and `it` functions:
   ```typescript
   describe('ComponentName', () => {
     it('should render correctly', () => {
       render(<ComponentName />);
       expect(screen.getByText('Expected Text')).toBeInTheDocument();
     });
   });
   ```

3. Use React Testing Library queries to find elements:
   - `getByText`: Find an element by its text content
   - `getByRole`: Find an element by its ARIA role
   - `getByLabelText`: Find an element by its associated label
   - `getByTestId`: Find an element by its `data-testid` attribute

4. Use Jest assertions to verify the component behavior:
   - `toBeInTheDocument()`: Check if an element is in the document
   - `toHaveTextContent()`: Check if an element has specific text content
   - `toBeDisabled()`: Check if an element is disabled
   - `toHaveClass()`: Check if an element has a specific class

### API Tests

When writing tests for API endpoints:

1. Use `node-mocks-http` to mock the request and response objects:
   ```typescript
   import { createMocks } from 'node-mocks-http';
   import handlerFunction from '../../pages/api/endpoint';
   
   describe('/api/endpoint', () => {
     it('returns expected data', async () => {
       const { req, res } = createMocks({
         method: 'GET',
       });
       
       await handlerFunction(req, res);
       
       expect(res._getStatusCode()).toBe(200);
       expect(JSON.parse(res._getData())).toEqual(expectedData);
     });
   });
   ```

2. Mock any dependencies (like database connections) using Jest's mocking capabilities:
   ```typescript
   jest.mock('@prisma/client', () => ({
     PrismaClient: jest.fn().mockImplementation(() => ({
       user: {
         findMany: jest.fn().mockResolvedValue([/* mock data */]),
       },
       $connect: jest.fn(),
       $disconnect: jest.fn(),
     })),
   }));
   ```

## Mocking External Dependencies

### NextAuth

To mock NextAuth in your tests:

```typescript
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: { user: { name: 'Test User', email: 'test@example.com' } },
    status: 'authenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));
```

### Prisma

To mock Prisma in your tests:

```typescript
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
      }),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  })),
}));
```

## Continuous Integration

Tests are automatically run as part of the CI/CD pipeline defined in `.github/workflows/ci-cd.yml`. The pipeline runs all tests and ensures they pass before deploying the application.

## Improving Test Coverage

The current test coverage is focused on key components and API endpoints. To improve coverage:

1. Add tests for all API endpoints
2. Add tests for all UI components
3. Add tests for utility functions and hooks
4. Add integration tests for key user flows

Use the coverage report (`npm run test:coverage`) to identify areas that need more testing.
