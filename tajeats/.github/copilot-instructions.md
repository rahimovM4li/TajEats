# TajEats - AI Coding Assistant Instructions

## Project Overview
TajEats is a full-stack food delivery application with a React/TypeScript frontend and Spring Boot backend. **Frontend and backend are now FULLY INTEGRATED** - the frontend communicates with the backend via REST APIs, and all data is persisted in PostgreSQL.

## Architecture

### Backend (`tajeats-be/`)
- **Spring Boot 3.5.6** with Java 17
- **PostgreSQL** database on `localhost:4424` (db: `tajeats`, user: `tajeats_user`)
- **Package structure**: `com.tajeats.tajeats_backend.{controller,service,repository,model,dto}`
- **Entity relationships**: 
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
- **Path alias**: `@/` → `./src/` (configured in [vite.config.ts](tajeats-ui/vite.config.ts) and [tsconfig.json](tajeats-ui/tsconfig.json))
- **Context-based state**: `AuthContext`, `CartContext`, `DataContext` (no Redux)
- **React Router v6** with customer/restaurant/admin portals
- **API Integration**: Axios-based API client ([api.ts](tajeats-ui/src/lib/api.ts)) with session management
- **Services Layer**: Separate service files for each entity (`restaurantService.ts`, `dishService.ts`, etc.)

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

1. **✅ Frontend-Backend Integration Complete**: Frontend now communicates with backend via REST API
2. **Session Management**: Frontend uses X-Session-ID header for tracking user sessions
3. **Entity cycles**: Be careful with JSON serialization of JPA relationships (potential infinite loops)
4. **PostgreSQL port**: Non-standard `4424` instead of `5432`
5. **Image Storage**: Local filesystem storage with interface abstraction for future S3/MinIO migration
6. **Type Conversions**: Frontend uses string IDs, backend uses Long IDs - conversion happens in DataContext
7. **Manual DTO Mapping**: No ModelMapper - all mapping is explicit in service layer

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
