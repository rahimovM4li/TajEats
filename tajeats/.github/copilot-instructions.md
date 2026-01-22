# TajEats - AI Coding Assistant Instructions

## Project Overview
TajEats is a full-stack food delivery application with a React/TypeScript frontend and Spring Boot backend. **Frontend and backend are now FULLY INTEGRATED** - the frontend communicates with the backend via REST APIs with **JWT authentication**, and all data is persisted in PostgreSQL.

## Architecture

### Backend (`tajeats-be/`)
- **Spring Boot 3.5.6** with Java 17 + **Spring Security 6.5.5**
- **JWT Authentication** with 24-hour token expiration (jjwt 0.12.3)
- **PostgreSQL** database on `localhost:4424` (db: `tajeats`, user: `tajeats_user`)
- **Package structure**: `com.tajeats.tajeats_backend.{controller,service,repository,model,dto,security,exception}`
- **Security**: BCrypt password encoding, role-based access control (ADMIN, RESTAURANT_OWNER, CUSTOMER)
- **Entity relationships**: 
  - `User` → Authentication and authorization (separate from customers in orders)
  - `Restaurant` → `OneToMany` → `Dish`, `Review`
  - `Dish` → `ManyToOne` → `Restaurant`
  - `Order` → `ManyToOne` → `Restaurant` and `OneToMany` → `CartItem`
  - `CartItem` → `ManyToOne` → `Dish`, `Order`

**Key patterns:**
- All controllers use `@CrossOrigin(origins = "*")` at `/api/*` endpoints
- Services use manual DTO mapping (private `toDTO()`/`toEntity()` methods in each service)
- Lombok `@Data`, `@Getter`, `@Setter` for reducing boilerplate
- `@RequiredArgsConstructor` for constructor injection
- No ModelMapper or MapStruct - manual field-by-field mapping

### Frontend (`tajeats-ui/`)
- **React 18.3** + **TypeScript** + **Vite** with SWC
- **shadcn/ui** components (Radix UI) + **Tailwind CSS**
- **Path alias**: `@/` → `./src/` (configured in vite.config.ts and tsconfig.json)
- **Context-based state**: `AuthContext` (JWT auth), `CartContext`, `DataContext` (no Redux)
- **React Router v6** with customer/restaurant/admin portals and protected routes
- **API Integration**: Axios-based API client (api.ts) with JWT token injection and session management
- **Services Layer**: Separate service files for each entity (`authService.ts`, `userService.ts`, `restaurantService.ts`, etc.)
- **Token Management**: localStorage-based JWT storage with expiration checking

**Key patterns:**
- UI components import from `@/components/ui/*` (shadcn convention)
- Data flows through context providers that fetch from backend API
- API client with interceptors for session tracking and error handling
- Type definitions in [mockData.ts](tajeats-ui/src/lib/mockData.ts) and [api.ts](tajeats-ui/src/types/api.ts)
- All CRUD operations hit backend REST endpoints
- Image uploads use multipart/form-data with dedicated image controllers

## Development Workflows

### Running the Application
Use [start-all.bat](start-all.bat) to launch both services simultaneously:
```bash
# Backend: mvn spring-boot:run on default port 8080
# Frontend: npm run dev (Vite dev server on port 5173)
```

### Backend Development
- **Build**: `mvn clean install` or `mvn spring-boot:run`
- **DB connection**: Update [application.properties](tajeats-be/src/main/resources/application.properties) for local PostgreSQL
- **JPA**: `spring.jpa.hibernate.ddl-auto=update` (auto-creates tables from entities)
- **Testing**: Run `TajeatsBackendApplicationTests.java` (currently empty context load test)

### Frontend Development
- **Dev server**: `npm run dev` (hot reload enabled)
- **Build**: `npm run build` or `npm run build:dev` (development mode)
- **Adding UI components**: Follow shadcn/ui patterns in [components/ui/](tajeats-ui/src/components/ui/)
- **New pages**: Add to [App.tsx](tajeats-ui/src/App.tsx) routes and create in [pages/](tajeats-ui/src/pages/)

## Critical Conventions

### TypeScript Configuration
- `"noImplicitAny": false` - relaxed for rapid prototyping
- `"strictNullChecks": false` - allows `null`/`undefined` without strict checks
- Use `type` imports: `import type { Restaurant }` for type-only imports

### Component Structure
- **Functional components** with hooks only (no class components)
- Context providers return typed context: `useCart()`, `useData()`, `useAuth()`
- Firebase included in dependencies but not actively used (see [package.json](tajeats-ui/package.json))

### Backend REST API Pattern
All CRUD controllers follow this template:
```java
@RestController
@RequestMapping("/api/{resource}s")
@CrossOrigin(origins = "*")
public class {Resource}Controller {
    @GetMapping                    // GET /api/{resource}s
    @GetMapping("/{id}")           // GET /api/{resource}s/{id}
    @PostMapping                    // POST /api/{resource}s
    @PutMapping("/{id}")           // PUT /api/{resource}s/{id}
    @DeleteMapping("/{id}")        // DELETE /api/{resource}s/{id}
}
```
Example: [RestaurantController.java](tajeats-be/src/main/java/com/tajeats/tajeats_backend/controller/RestaurantController.java)

### DTO Mapping Pattern
Services contain private methods for entity-DTO conversion:
```java
private RestaurantDTO toDTO(Restaurant r) { /* manual field mapping */ }
private Restaurant toEntity(RestaurantDTO dto) { /* manual field mapping */ }
```
See [RestaurantService.java](tajeats-be/src/main/java/com/tajeats/tajeats_backend/service/RestaurantService.java#L20-L51)

## Important Gotchas

1. **✅ Frontend-Backend Integration Complete**: Frontend now communicates with backend via REST API with JWT authentication
2. **JWT Token Management**: Tokens stored in localStorage, auto-injected in API requests, 24h expiration
3. **User Approval Workflow**: Restaurant owners need admin approval before accessing dashboard
4. **Session Management**: Frontend uses X-Session-ID header for cart tracking (separate from auth)
5. **Entity cycles**: Be careful with JSON serialization of JPA relationships (potential infinite loops)
6. **PostgreSQL port**: Non-standard `4424` instead of `5432`
7. **Image Storage**: Local filesystem storage with interface abstraction for future S3/MinIO migration
8. **Type Conversions**: Frontend uses string IDs, backend uses Long IDs - conversion happens in DataContext
9. **Manual DTO Mapping**: No ModelMapper - all mapping is explicit in service layer
10. **CORS Configuration**: Allows localhost:5173 and localhost:5174 for development
11. **Password Security**: BCrypt with 10 rounds, never store plain text passwords
12. **Role Prefix**: Spring Security requires "ROLE_" prefix in authorities (handled in CustomUserDetailsService)

## When Adding Features

- **New entity**: Create in `model/`, add repository in `repository/`, service in `service/`, DTO in `dto/`, controller in `controller/`
- **New page**: Add route in [App.tsx](tajeats-ui/src/App.tsx), create component in [pages/](tajeats-ui/src/pages/)
- **shadcn component**: Import from `@/components/ui/*` and follow existing usage patterns
- **Backend validation**: Consider adding Spring Validation annotations (`@NotNull`, `@Size`, etc.)
- **CRUD dialogs**: Use existing patterns from EditRestaurantDialog, EditDishDialog, DeleteConfirmDialog
- **API service**: Create new service file in `services/` following existing patterns
- **Image uploads**: Use ImageUpload component and ImageStorageService interface

## Component Library

### Reusable Dialogs
- **AddRestaurantDialog.tsx** - Create new restaurants with image upload
- **EditRestaurantDialog.tsx** - Edit restaurant details and image
- **AddDishDialog.tsx** - Create new dishes with image upload
- **EditDishDialog.tsx** - Edit dish details, price, availability
- **AddReviewDialog.tsx** - Write reviews with star rating and name input
- **EditReviewDialog.tsx** - Edit existing reviews
- **DeleteConfirmDialog.tsx** - Generic delete confirmation (reusable)
- **OrderDetailsDialog.tsx** - View complete order information with timeline
- **ImageUpload.tsx** - Reusable image upload with preview

### Dashboard Components
- **AdminDashboard** - Restaurant management, orders, statistics
- **RestaurantDashboard** - Menu management, orders, reviews for restaurant owners
- **DishCard** - Display dish with add to cart functionality
- **RestaurantCard** - Display restaurant preview on listings

## Code Quality Rules

### ⚠️ CRITICAL: Prevent Syntax Errors
When writing JSX/TSX code:
1. **ALWAYS** carefully type complete JSX expressions without typos
2. **NEVER** insert random characters (like "n") before JSX tags
3. **ALWAYS** match opening/closing tags correctly
4. **DOUBLE-CHECK** bracket placement in conditionals and map functions
5. **USE** proper formatting - one element per line in complex expressions

### Example - CORRECT:
```typescript
{items.length === 0 ? (
  <EmptyState />
) : (
  items.map(item => (
    <Card key={item.id}>
      <Content />
    </Card>
  ))
)}
```

### Example - WRONG (causes build errors):
```typescript
{items.map(item => (n  // ❌ Random "n" character
  <Card key={item.id}>
```

### Multi-line Replacements
When using `replace_string_in_file` or `multi_replace_string_in_file`:
1. Include 3-5 lines of context BEFORE and AFTER the change
2. Match indentation EXACTLY
3. Copy-paste from file content - don't retype
4. Test the replacement mentally before executing

## JWT Authentication System ✅ COMPLETE

### Authentication Flow
1. **Registration**: 
   - Customers: Auto-approved (`isApproved=true`)
   - Restaurant Owners: Require admin approval (`isApproved=false`)
   - Endpoint: `POST /api/auth/register`
   
2. **Login**: 
   - Validates credentials with BCrypt
   - Checks approval status for restaurant owners
   - Returns JWT token (24h expiration) + user info
   - Endpoint: `POST /api/auth/login`
   
3. **Token Usage**:
   - Stored in localStorage (`tajeats_jwt_token`)
   - Injected as `Bearer` token in Authorization header
   - Validated on each protected endpoint
   - Expires after 86400000ms (24 hours)

### Backend Components

#### Security Infrastructure
- **JwtUtil.java** - Token generation/validation using jjwt 0.12.3
  - `generateToken()` - Creates JWT with HS256 signature
  - `validateToken()` - Verifies token and expiration
  - `extractUsername()` - Extracts email from token claims
  - Uses `parser()` API (not deprecated `parserBuilder()`)
  
- **JwtAuthenticationFilter.java** - OncePerRequestFilter
  - Extracts Bearer token from Authorization header
  - Validates token and sets SecurityContext
  - Runs before UsernamePasswordAuthenticationFilter
  
- **CustomUserDetailsService.java** - UserDetailsService implementation
  - Loads user by email
  - Checks approval status for RESTAURANT_OWNER
  - Returns authorities with "ROLE_" prefix
  
- **SecurityConfig.java** - SecurityFilterChain configuration
  - Public endpoints: `/api/auth/**`, GET `/api/restaurants/**`, `/api/dishes/**`, `/api/reviews/**`, POST `/api/orders`
  - CORS: Allows `http://localhost:5173` and `http://localhost:5174`
  - Stateless session management
  - BCrypt password encoder bean

#### User Management
- **User.java** - Entity with JPA annotations
  ```java
  @Entity
  @Table(name = "users")
  - id (Long, auto-generated)
  - email (String, unique, not null)
  - password (String, BCrypt hash)
  - name (String)
  - role (Enum: ADMIN, RESTAURANT_OWNER, CUSTOMER)
  - restaurantId (Long, nullable)
  - isApproved (Boolean)
  - createdAt, updatedAt (LocalDateTime)
  ```

- **UserService.java** - Business logic
  - `registerUser()` - Creates user, sets approval based on role
  - `authenticate()` - Validates credentials, generates JWT
  - `getUserByEmail()` - Retrieves user info
  - `getPendingUsers()` - Returns unapproved restaurant owners
  - `approveUser()` - Sets isApproved=true
  - `rejectUser()` - Deletes user

- **AuthController.java** - REST endpoints
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - Authentication
  - `GET /api/auth/me` - Get current user (requires auth)
  
- **UserController.java** - Admin-only endpoints
  - `GET /api/users/pending` - List pending approvals (`@PreAuthorize("hasRole('ADMIN')")`)
  - `PUT /api/users/{id}/approve` - Approve restaurant owner
  - `DELETE /api/users/{id}/reject` - Reject and delete user

#### DTOs and Exceptions
- **RegisterRequest** - name, email, password, role
- **LoginRequest** - email, password
- **AuthResponse** - token, user (UserDTO), message
- **UserDTO** - id, email, name, role, restaurantId, isApproved, createdAt
- **UserAlreadyExistsException** - Email conflict
- **InvalidCredentialsException** - Wrong credentials
- **AccountPendingApprovalException** - Not approved yet

#### Configuration
```properties
# application.properties
jwt.secret=TajEatsSecretKeyForJWTTokenGenerationAndValidation2026MustBeAtLeast256BitsLong
jwt.expiration=86400000
```

#### Admin Initialization
- **init-admin.sql** - Creates default admin account
  - Email: `admin@tajeats.tj`
  - Password: `Admin123!` (BCrypt: `$2a$10$4p1IKVCo7DhhVHGsN9y7l.HD/jicBEY8G9W3ZrDTeIPjri7zVHNcW`)
  - Role: `ADMIN`
  - Run: `psql -h localhost -p 4424 -U tajeats_user -d tajeats -f src/main/resources/init-admin.sql`

### Frontend Components

#### Token Management
- **tokenManager.ts** - JWT utilities
  - `getToken()` - Retrieves from localStorage
  - `setToken()` - Stores to localStorage
  - `removeToken()` - Clears localStorage
  - `isTokenExpired()` - Checks expiration
  - `decodeToken()` - Parses JWT payload

#### Auth Services
- **authService.ts** - Authentication API calls
  - `login()` - POST /auth/login, returns token + user
  - `register()` - POST /auth/register
  - `getCurrentUser()` - GET /auth/me
  - `logout()` - Client-side only (removes token)
  
- **userService.ts** - User management API (admin only)
  - `getPendingUsers()` - GET /users/pending
  - `approveUser()` - PUT /users/{id}/approve
  - `rejectUser()` - DELETE /users/{id}/reject

#### Context & Protection
- **AuthContext.tsx** - Global auth state
  - Loads token on mount, validates expiration
  - `login()` - Authenticates, saves token, returns user
  - `logout()` - Clears token and state
  - `isAuthenticated` - Checks token validity + approval status
  - Converts backend Role enum to frontend lowercase
  
- **ProtectedRoute.tsx** - Route guard component
  - Checks authentication before rendering
  - Validates user role matches requiredRole
  - Redirects to appropriate login page
  - Checks restaurant owner approval status

#### API Integration
- **api.ts** - Axios interceptor updates
  - Request: Injects `Authorization: Bearer ${token}` header
  - Response: Handles 401/403 errors, redirects to login
  - On 401: Removes token, redirects to /admin/login or /restaurant/login
  - On 403: Checks for "pending approval" message

#### Authentication Pages
- **AdminLogin.tsx** - Admin portal login
  - Validates role === 'admin' from login result
  - Redirects to /admin/dashboard on success
  - Route: `/admin` and `/admin/login`
  
- **RestaurantLogin.tsx** - Restaurant owner login
  - Validates role === 'restaurant'
  - Shows pending approval message if not approved
  - Redirects to /restaurant/dashboard on success
  - Link to /restaurant/register
  
- **RestaurantRegister.tsx** - Restaurant owner registration
  - Form with name, email, password, confirmPassword
  - Password validation: 8+ chars, uppercase, lowercase, number
  - Role: `RESTAURANT_OWNER`
  - Shows blue badge: "Admin Approval Required"
  - Redirects to /restaurant after 2 seconds
  
- **CustomerRegister.tsx** - Customer registration
  - Same validation as restaurant registration
  - Role: `CUSTOMER`
  - Shows green badge: "Instant Activation"
  - Redirects to `/` after 1.5 seconds

#### Admin Dashboard
- **AdminDashboard.tsx** - Added "Pending Approvals" tab
  - Fetches pending users with `getPendingUsers()`
  - Displays table with name, email, registration date
  - Approve button → calls `approveUser()`, shows success toast
  - Reject button → calls `rejectUser()`, shows confirmation
  - Badge counter shows pending count
  - Empty state when no pending users

### Protected Endpoints
**Require Authentication:**
- All `/api/users/**` endpoints (admin only)
- POST/PUT/DELETE `/api/dishes/**` (admin or restaurant owner)
- DELETE `/api/restaurants/**` (admin - planned)

**Public (No Auth Required):**
- GET `/api/restaurants/**`
- GET `/api/dishes/**`
- GET `/api/reviews/**`
- POST `/api/orders`

### Role-Based Access
- **ADMIN**: Full access, user approval, system management
- **RESTAURANT_OWNER**: Manage own restaurant and menu (after approval)
- **CUSTOMER**: Browse, order, review (auto-approved)

### Testing Credentials
**Admin Account:**
- Email: `admin@tajeats.tj`
- Password: `Admin123!`
- Access: http://localhost:5174/admin

**Test Flow:**
1. Start backend: `mvn spring-boot:run`
2. Create admin: Run `init-admin.sql`
3. Start frontend: `npm run dev`
4. Register restaurant owner at `/restaurant/register`
5. Admin logs in, approves from "Pending Approvals" tab
6. Restaurant owner can now login
7. Customer registers at `/register` (instant activation)

## Frontend-Backend Integration ✅ COMPLETE

### Current State: FULLY INTEGRATED
**The frontend and backend are now fully connected:**
- [DataContext.tsx](tajeats-ui/src/contexts/DataContext.tsx) fetches data from backend API
- [api.ts](tajeats-ui/src/lib/api.ts) provides centralized Axios client with interceptors
- Service layer (`restaurantService.ts`, `dishService.ts`, etc.) handles API calls
- All CRUD operations persist to PostgreSQL database
- Session tracking via X-Session-ID header
- Image uploads use multipart/form-data to backend

### API Architecture

#### Base Configuration ([api.ts](tajeats-ui/src/lib/api.ts))
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});
// Interceptors add X-Session-ID header automatically
```

#### Service Layer Pattern
Each entity has a dedicated service file in `src/services/`:
- **restaurantService.ts** - getAll(), getById(), create(), update(), delete()
- **dishService.ts** - getAll(), getByRestaurant(), create(), update(), delete()
- **orderService.ts** - getAll(), getById(), create(), updateStatus()
- **reviewService.ts** - getAll(), getByRestaurant(), create(), update(), delete()

#### DataContext Integration
DataContext uses services and converts between frontend/backend types:
- Frontend: `id: string`, Backend: `id: Long`
- Conversion functions: `convertRestaurantFromAPI()`, `convertDishFromAPI()`, etc.
- State management with useState hooks
- Loading/error states for each entity type

### Image Upload System

#### Backend Components
- **ImageStorageService** (interface) - Abstraction for storage backends
- **FileSystemImageStorageService** - Local filesystem implementation
- **RestaurantImageController** - POST /api/restaurants/{id}/image, /api/restaurants/{id}/logo
- **DishImageController** - POST /api/dishes/{id}/image
- **WebConfig** - Serves static files from /images/** path

#### Frontend Components
- **imageService.ts** - API client for image uploads with FormData
- **ImageUpload.tsx** - Reusable component with preview, validation, remove
- Integrated in AddRestaurantDialog, EditRestaurantDialog, AddDishDialog, EditDishDialog

#### Configuration
```properties
app.storage.base-path=uploads
app.storage.base-url=http://localhost:8080/images
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
```

### Type System

#### Frontend Types ([mockData.ts](tajeats-ui/src/lib/mockData.ts))
```typescript
export interface Restaurant {
  id: string;  // String for frontend compatibility
  name: string;
  image: string;
  // ...
}
```

#### Backend DTOs ([types/api.ts](tajeats-ui/src/types/api.ts))
```typescript
export interface RestaurantDTO {
  id: number;  // Long from backend
  name: string;
  image: string;
  // ...
}
```

#### Conversion in DataContext
```typescript
const convertRestaurantFromAPI = (dto: RestaurantDTO): Restaurant => ({
  id: dto.id.toString(),  // Convert number to string
  name: dto.name,
  // ...
});
```

### Complete Integration Checklist ✅
- [x] GET `/api/restaurants` returns restaurant list
- [x] POST `/api/restaurants` creates new restaurant
- [x] PUT `/api/restaurants/{id}` updates restaurant
- [x] DELETE `/api/restaurants/{id}` deletes restaurant
- [x] Image uploads work for restaurants and dishes
- [x] Frontend displays backend data
- [x] Orders persist to PostgreSQL database
- [x] Reviews create/update/delete work
- [x] Session tracking via X-Session-ID
- [x] Error handling with toast notifications
- [x] Loading states in all contexts
- [x] JWT authentication implemented (login/register)
- [x] Token storage and expiration management
- [x] Protected routes with role validation
- [x] Admin approval workflow for restaurant owners
- [x] User management dashboard (pending approvals)
- [x] Password hashing with BCrypt
- [x] Authorization with @PreAuthorize annotations
- [x] API interceptors for automatic token injection
- [x] Error handling for 401/403 responses

---

**Last Updated:** January 22, 2026  
**Status:** ✅ JWT Authentication System Fully Implemented and Tested
