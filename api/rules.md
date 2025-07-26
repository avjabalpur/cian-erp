# Windsurf Rules for Full-Stack Application Architecture

# Backend Rules for .NET API

## 1. Project Structure
- **Core/Domain/Repositories:** Repository interfaces defining data access contracts.
- **Core/Domain/Services:** Service interfaces defining business logic contracts.
- **Core/DTOs:** Data Transfer Objects for API input/output. Properties should be nullable unless always required, create the folder if there will be multiple DTOs like `UserDto`, `UserFilterDto` etc.
- **Core/Model:** POCOs matching DB tables. PascalCase for C# properties, snake_case for DB columns.
- **Core/Exceptions:** Custom exceptions (e.g., `NotFoundException`, `ValidationException`).
- **Core/Enums:** Enumeration types used throughout the application.
- **Core/Mappers:** AutoMapper profiles for all Model/DTO mappings.
- **Repository:** Implements repository interfaces using Dapper. All SQL logic here.
- **Repository/DbContext:** DapperDbContext for database connection management.
- **Services:** Business logic implementations, orchestrates repositories.
- **Presentation/Controllers:** API endpoints, request handling, and response formatting.
- **Presentation/Middleware:** Custom middleware for cross-cutting concerns.
- **Presentation/Extensions:** Extension methods for service configuration.

## 2. Dependency Direction
- **Core** has no external dependencies except essential libraries.
- **Repository** depends on **Core** and external libs (Dapper, Npgsql).
- **Services** depends on **Core** and **Repository**.
- **Presentation** depends on **Core** and **Services**.

## 3. Naming Conventions
- Interfaces: `I` prefix (e.g., `IUserService`).
- Repositories: `Repository` suffix.
- Services: `Service` suffix.
- Controllers: `Controller` suffix.
- DTOs: `RequestDto`/`ResponseDto` suffix.
- Models: PascalCase, match table names.

## 4. Dapper & Data Access
- Use parameterized queries only (never string interpolation).
- Use `using var connection = _dbContext.GetConnection();` for connection management.
- Write SQL as `const string` in repositories.
- Map all columns explicitly for clarity with proper casing (e.g., `"id" as "Id"`).
- Use `QueryFirstAsync<T>` for single record retrieval.
- Use `QueryMultipleAsync` for retrieving multiple result sets.
- Implement paging with LIMIT and OFFSET.
- Use proper error handling for database operations.

## 5. DTOs & Mapping
- Never expose Core models directly in API responses.
- Use AutoMapper for all Model/DTO conversions.
- Implement PaginatedResult<T> for list responses.
- Use consistent naming for DTOs (e.g., CustomerDto).
- Keep DTOs focused on specific use cases.
- Include validation attributes on DTO properties when needed.
- Register all AutoMapper profiles in DI.

## 6. Dependency Injection
- Register all services, repositories, and DapperDbContext in `Program.cs`.
- Use `AddScoped` for all DI registrations.
- Inject interfaces, not concrete types.

## 7. Exception Handling
- Implement global exception middleware.
- Map exceptions to HTTP status codes:
  - `UnauthorizedAccessException` → 401
  - `ArgumentException` → 400
  - `InvalidOperationException` → 409
  - All others → 500
- Return JSON error responses.

## 8. Authentication & Authorization
- Use JWT Bearer authentication.
- Store JWT key in config; must be at least 32 characters.
- Add `[Authorize]` to controllers/actions for protected endpoints.
- Always hash passwords before storing.
- Registration must check for duplicate emails and validate allowed roles.
- Never expose password hashes in API responses.
- Always validate user input on login/register.
- Implement proper token refresh mechanism.
- Use HTTP-only cookies for enhanced security when possible.

## 9. Testing & Validation
- Add unit/integration tests for services and controllers.
- Use DataAnnotations or FluentValidation for DTO validation.

## 10. Swagger & Documentation
- Enable Swagger and XML comments.
- Document all endpoints and DTOs.

# UI Rules for Next.js/React/TypeScript Architecture

## 1. Project Structure
- **app/(auth):** Protected routes requiring authentication.
- **app/:** Public routes accessible without authentication.
- **app/api:** Backend API routes and handlers.
- **components:** Reusable UI components organized by feature or domain.
- **lib:** Utility functions, helpers, and shared logic.
- **hooks:** Custom React hooks for shared stateful logic.
- **contexts:** React context providers for global state management.
- **types:** TypeScript type definitions and interfaces.
- **static-data:** Static data and constants.
- **styles:** Global styles and theme definitions.

## 2. Component Organization
- Use a feature-based or domain-driven folder structure.
- Separate components into UI (presentational) and container (logic) when appropriate.
- Keep components small and focused on a single responsibility.
- Use composition over inheritance for component reuse.
- Implement proper prop validation with TypeScript interfaces.

## 3. Naming Conventions
- Components: PascalCase (e.g., `CustomerTable.tsx`).
- Hooks: camelCase with 'use' prefix (e.g., `useCustomers.ts`).
- Contexts: PascalCase with 'Context' suffix (e.g., `AuthContext.tsx`).
- Utility functions: camelCase (e.g., `formatDate.ts`).
- Files containing a single component should match the component name.
- TypeScript interfaces: PascalCase with descriptive names (e.g., `CustomerData`).
- Type files: Use `.d.ts` extension for declaration files.

## 4. State Management
- Use React Context API for global state when appropriate.
- Prefer local component state for component-specific data.
- Use React Query for server state management and caching.
- Implement proper loading, error, and success states for async operations.
- Keep state normalized to avoid duplication.

## 5. API Integration
- Create dedicated API client functions in separate files.
- Handle errors consistently with proper error boundaries.
- Implement retry logic for transient failures.
- Use React Query for data fetching, caching, and synchronization.
- Type all API responses and requests using TypeScript interfaces.

## 6. Authentication & Authorization
- Use NextAuth.js for authentication.
- Implement proper route protection with middleware.
- Store tokens securely (HTTP-only cookies preferred).
- Handle session expiration gracefully.
- Implement role-based UI rendering for authorized components.

## 7. Form Handling
- Use React Hook Form for complex forms.
- Implement client-side validation with proper error messages.
- Create reusable form components for common patterns.
- Handle form submission states (loading, success, error).
- Use controlled components for form inputs.

## 8. Styling
- Use Tailwind CSS for utility-first styling.
- Implement consistent theming with CSS variables.
- Create reusable UI components with shadcn/ui.
- Follow responsive design principles.
- Ensure proper dark mode support.

## 9. Performance Optimization
- Implement code splitting with dynamic imports.
- Use Next.js Image component for optimized images.
- Memoize expensive calculations with useMemo and useCallback.
- Implement virtualization for long lists (react-window or similar).
- Use proper keys for list rendering.

## 10. Testing
- Write unit tests for utility functions.
- Implement component tests with React Testing Library.
- Use mock service worker (MSW) for API mocking.
- Test user interactions and accessibility.
- Maintain good test coverage for critical paths.