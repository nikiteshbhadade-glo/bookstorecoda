# BookSearch App Testing Plan

## Overview

This document outlines a comprehensive testing strategy for the BookSearch application. The plan covers various testing types, required tools, specific test cases, and implementation recommendations to ensure the reliability, performance, and quality of the application.

## Testing Types

### 1. Unit Testing

**Tools to Add:**
- Jest - Testing framework
- React Testing Library - Component testing
- Jest-Redux-Mock - For Redux testing
- MSW (Mock Service Worker) - API mocking

**Configuration Setup:**
```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
```

**Test Cases:**

1. **Redux Slices & Reducers**
   - Test initial state is correctly set
   - Test each action modifies state as expected
   - Test async thunks with mocked API responses
   - Sample tests:
     ```javascript
     // booksSlice.test.js
     test('should handle initial state', () => {
       expect(booksReducer(undefined, { type: 'unknown' })).toEqual({
         searchResults: null,
         currentQuery: '',
         loading: false,
         error: null,
         favorites: [],
       });
     });
     
     test('should handle setSearchResults', () => {
       const mockResults = { docs: [{ title: 'Test Book' }], numFound: 1 };
       const previousState = { searchResults: null, currentQuery: '', loading: false };
       
       expect(
         booksReducer(previousState, setSearchResults({ results: mockResults, query: 'test' }))
       ).toEqual({
         searchResults: mockResults,
         currentQuery: 'test',
         loading: false,
         error: null,
       });
     });
     ```

2. **Custom Hooks**
   - Test `useSearch` hook functionality
   - Test state changes and function calls
   - Sample test:
     ```javascript
     // useSearch.test.js
     test('should update query and trigger search', async () => {
       const { result } = renderHook(() => useSearch());
       
       act(() => {
         result.current.setSearchQuery('harry potter');
       });
       
       expect(result.current.searchQuery).toBe('harry potter');
       
       await act(async () => {
         await result.current.handleSearch({ preventDefault: jest.fn() });
       });
       
       // Verify dispatch was called with correct action
     });
     ```

3. **UI Components**
   - Test rendering of BookCover component
   - Test rendering of search results
   - Test error states and loading skeletons
   - Sample test:
     ```javascript
     // BookCover.test.js
     test('displays placeholder when no cover URL provided', () => {
       render(<BookCover title="Test Book" />);
       
       // Check if placeholder is rendered
       expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('placehold.co'));
     });
     ```

4. **Utility Functions**
   - Test `extractBookId` function with various inputs
   - Test formatting functions
   - Sample test:
     ```javascript
     // utils.test.js
     test('extractBookId should handle different key formats', () => {
       expect(extractBookId('/works/OL12345W')).toBe('OL12345W');
       expect(extractBookId('OL12345W')).toBe('OL12345W');
       expect(extractBookId('')).toBe('');
     });
     ```

### 2. Integration Testing

**Tools:**
- Cypress Component Testing

**Configuration:**
```bash
npm install --save-dev cypress @cypress/react
```

**Test Cases:**

1. **Search Flow Integration**
   - Test search input with Redux dispatch
   - Test search results rendering with mock data
   - Test navigation from results to book detail
   - Sample test:
     ```javascript
     // search-flow.cy.js
     it('should search and display results', () => {
       cy.intercept('GET', 'https://openlibrary.org/search.json*', { fixture: 'searchResults.json' });
       
       cy.mount(<SearchWrapper />);
       cy.get('input[type="search"]').type('harry potter');
       cy.get('button[type="submit"]').click();
       
       // Check if results are displayed
       cy.get('[data-testid="search-results"]').should('exist');
       cy.get('[data-testid="book-item"]').should('have.length.at.least', 1);
     });
     ```

2. **Favorites Management**
   - Test adding book to favorites
   - Test removing from favorites
   - Test persistence of favorites
   - Sample test:
     ```javascript
     // favorites.cy.js
     it('should add and remove favorites', () => {
       cy.mount(<FavoritesTestComponent />);
       
       // Add to favorites
       cy.get('[data-testid="add-favorite"]').first().click();
       cy.get('[data-testid="favorites-count"]').should('contain', '1');
       
       // Remove from favorites
       cy.get('[data-testid="remove-favorite"]').first().click();
       cy.get('[data-testid="favorites-count"]').should('contain', '0');
     });
     ```

3. **API Integration**
   - Test book service with MSW mocked responses
   - Test error handling for API failures
   - Sample test:
     ```javascript
     // bookService.cy.js
     it('should handle API errors gracefully', () => {
       cy.intercept('GET', 'https://openlibrary.org/works/*', {
         statusCode: 404,
         body: { error: 'Not found' }
       });
       
       cy.mount(<BookDetailsWrapper bookId="OL12345W" />);
       
       // Verify error message is displayed
       cy.get('[data-testid="error-message"]').should('exist');
       cy.get('[data-testid="back-button"]').should('exist');
     });
     ```

### 3. End-to-End Testing

**Tools:**
- Cypress
- Playwright (alternative option)

**Configuration:**
```bash
# If not already installed
npm install --save-dev cypress
```

**Test Cases:**

1. **Complete User Flows**
   - Search for books, view details, add to favorites
   - Navigate between pages using the navbar
   - Sample test:
     ```javascript
     // complete-flow.cy.js
     it('should complete a full user journey', () => {
       // Visit home page
       cy.visit('/');
       
       // Search for a book
       cy.get('input[type="search"]').type('harry potter');
       cy.get('button[type="submit"]').click();
       
       // Verify results page
       cy.url().should('include', '/results?q=harry%20potter');
       cy.get('[data-testid="search-results"]').should('exist');
       
       // Click on a book
       cy.get('[data-testid="book-item"]').first().click();
       
       // Verify book details page
       cy.url().should('include', '/book/');
       
       // Add to favorites
       cy.get('[data-testid="add-favorite"]').click();
       
       // Go to favorites page
       cy.get('[data-testid="favorites-link"]').click();
       cy.url().should('include', '/favorites');
       
       // Verify book is in favorites
       cy.get('[data-testid="book-item"]').should('exist');
     });
     ```

2. **Error Scenarios**
   - Test 404 page
   - Test error boundary behavior
   - Test API failure handling
   - Sample test:
     ```javascript
     // error-scenarios.cy.js
     it('should show 404 page for invalid routes', () => {
       cy.visit('/invalid-route-123456', { failOnStatusCode: false });
       cy.get('[data-testid="404-page"]').should('exist');
     });
     
     it('should handle book not found errors', () => {
       cy.intercept('GET', 'https://openlibrary.org/works/*', {
         statusCode: 404
       });
       
       cy.visit('/book/invalidid123');
       cy.get('[data-testid="error-message"]').should('exist');
     });
     ```

### 4. Performance Testing

**Tools:**
- Lighthouse (Chrome DevTools)
- Next.js Analytics
- WebPageTest

**Test Cases:**

1. **Page Load Performance**
   - Test First Contentful Paint (FCP)
   - Test Largest Contentful Paint (LCP)
   - Test Cumulative Layout Shift (CLS)
   - Sample script:
     ```bash
     # Using Lighthouse CLI
     npm install -g lighthouse
     lighthouse https://your-deployed-app.com --output=json --output-path=./lighthouse-report.json
     ```

2. **Image Optimization**
   - Verify Next.js Image component is optimizing properly
   - Check image load times and formats
   - Manual testing checklist:
     - Confirm WebP/AVIF formats are being served when supported
     - Verify proper sizing based on viewport
     - Check lazy loading behavior

3. **Server-Side Rendering Performance**
   - Test Time to First Byte (TTFB)
   - Compare SSR vs CSR performance
   - Manual testing with Network tab in DevTools

### 5. Accessibility Testing

**Tools:**
- axe-core
- pa11y

**Configuration:**
```bash
npm install --save-dev @axe-core/react pa11y
```

**Test Cases:**

1. **WCAG Compliance**
   - Test color contrast
   - Test semantic HTML
   - Test keyboard navigation
   - Sample test:
     ```javascript
     // a11y.test.js
     import { axe } from 'jest-axe';
     
     test('Homepage has no accessibility violations', async () => {
       const { container } = render(<Home />);
       const results = await axe(container);
       
       expect(results).toHaveNoViolations();
     });
     ```

2. **Screen Reader Compatibility**
   - Test with VoiceOver (macOS) or NVDA (Windows)
   - Check for proper ARIA attributes
   - Manual testing checklist

3. **Keyboard Navigation**
   - Test tab order
   - Test focus states
   - Test interactive elements
   - Sample test:
     ```javascript
     // keyboard.test.js
     test('should navigate search form with keyboard', () => {
       render(<Home />);
       
       // Start by focusing on the first element
       userEvent.tab();
       expect(screen.getByRole('textbox')).toHaveFocus();
       
       // Tab to the search button
       userEvent.tab();
       expect(screen.getByRole('button', { name: /search/i })).toHaveFocus();
     });
     ```

### 6. Cross-browser Testing

**Tools:**
- BrowserStack
- Sauce Labs
- Manual testing with different browsers

**Test Cases:**

1. **Visual Consistency**
   - Test layout across browsers
   - Test responsive design
   - Manual testing checklist

2. **Functional Consistency**
   - Test core functionality in all major browsers
   - Test on different devices
   - Manual testing checklist

## Implementation Plan

### Phase 1: Setup Testing Infrastructure

1. Install and configure Jest and React Testing Library
   ```bash
   npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
   ```

2. Create Jest configuration
   ```javascript
   // jest.config.js
   module.exports = {
     testEnvironment: 'jsdom',
     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
     moduleNameMapper: {
       '^@/(.*)$': '<rootDir>/src/$1',
     },
     testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
     transform: {
       '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
     },
     transformIgnorePatterns: ['/node_modules/'],
   };
   ```

3. Create Jest setup file
   ```javascript
   // jest.setup.js
   import '@testing-library/jest-dom';
   
   // Mock Next.js router
   jest.mock('next/router', () => ({
     useRouter: () => ({
       push: jest.fn(),
       query: {},
     }),
   }));
   
   // Mock Next.js Image component
   jest.mock('next/image', () => ({
     __esModule: true,
     default: (props) => {
       // eslint-disable-next-line jsx-a11y/alt-text
       return <img {...props} />;
     },
   }));
   ```

4. Add MSW for API mocking
   ```javascript
   // src/mocks/handlers.js
   import { rest } from 'msw';
   
   export const handlers = [
     rest.get('https://openlibrary.org/search.json', (req, res, ctx) => {
       return res(
         ctx.json({
           docs: [
             { 
               key: '/works/OL12345W',
               title: 'Test Book',
               author_name: ['Test Author'],
               cover_i: 12345,
               first_publish_year: 2020,
             }
           ],
           numFound: 1,
         })
       );
     }),
     
     rest.get('https://openlibrary.org/works/:id.json', (req, res, ctx) => {
       const { id } = req.params;
       
       return res(
         ctx.json({
           key: `/works/${id}`,
           title: 'Test Book Details',
           description: 'This is a test book description',
           covers: [12345],
           authors: [{ author: { key: '/authors/OL12345A' } }],
         })
       );
     }),
   ];
   ```

5. Setup Cypress for E2E testing
   ```bash
   npx cypress open
   ```

### Phase 2: Unit Tests

1. Create test files for Redux slices
   - `__tests__/redux/booksSlice.test.js`

2. Create test files for utility functions
   - `__tests__/lib/utils.test.js`

3. Create test files for custom hooks
   - `__tests__/lib/hooks/useSearch.test.js`

4. Create test files for key components
   - `__tests__/components/ui/BookCover.test.js`
   - `__tests__/components/search/SearchResultsClient.test.js`

### Phase 3: Integration Tests

1. Setup Cypress component testing
   - Configure component testing environment
   - Create fixtures for API responses

2. Create integration tests for main features
   - `cypress/component/search-flow.cy.js`
   - `cypress/component/favorites.cy.js`
   - `cypress/component/book-details.cy.js`

### Phase 4: End-to-End Tests

1. Create E2E tests for user flows
   - `cypress/e2e/search.cy.js`
   - `cypress/e2e/favorites.cy.js`
   - `cypress/e2e/navigation.cy.js`
   - `cypress/e2e/error-handling.cy.js`

### Phase 5: Performance & Accessibility

1. Setup Lighthouse CI
   - Configure automated performance testing

2. Setup axe-core for accessibility testing
   - Add to component tests
   - Create specific accessibility test suite

3. Create manual testing checklists
   - Cross-browser testing plan
   - Mobile testing plan

## CI/CD Integration

1. Configure GitHub Actions for automated testing
   ```yaml
   # .github/workflows/test.yml
   name: Run Tests
   
   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]
   
   jobs:
     test:
       runs-on: ubuntu-latest
       
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Run unit tests
           run: npm test
           
         - name: Run E2E tests
           run: npm run test:e2e
   ```

2. Add Lighthouse CI for performance monitoring
   ```yaml
   # .github/workflows/lighthouse.yml
   name: Lighthouse CI
   
   on:
     push:
       branches: [main]
   
   jobs:
     lighthouse:
       runs-on: ubuntu-latest
       
       steps:
         - uses: actions/checkout@v3
         
         - name: Build app
           run: |
             npm ci
             npm run build
             npm run start & npx wait-on http://localhost:3000
             
         - name: Run Lighthouse CI
           uses: treosh/lighthouse-ci-action@v9
           with:
             urls: |
               http://localhost:3000/
               http://localhost:3000/results?q=test
             uploadArtifacts: true
   ```

## Test Coverage Goals

- Unit Tests: 80% coverage of components, hooks, and utilities
- Integration Tests: Cover all major user interactions
- E2E Tests: Cover all critical user flows
- Accessibility: No critical violations, WCAG AA compliance

## Required Package Updates

Update `package.json` scripts section:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:e2e": "cypress run",
  "cy:open": "cypress open"
}
```

## Conclusion

This testing plan provides a comprehensive approach to ensuring the quality, reliability, and performance of the BookSearch application. By implementing this plan, we can:

1. Catch bugs early in the development process
2. Ensure consistent behavior across browsers and devices
3. Maintain good performance and accessibility
4. Build confidence in the application's reliability

The testing approach should evolve with the application, with new test cases added as features are developed or modified.

---

*Note: This testing plan assumes the BookSearch app is already set up with the core functionality described in the projectinfo.md file. The plan focuses on adding testing infrastructure to the existing codebase.*