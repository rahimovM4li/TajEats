# TajEats Project Structure

## Overview
```
tajeats/
├── .github/
│   └── copilot-instructions.md          # AI assistant configuration
├── tajeats-be/                           # Spring Boot Backend
├── tajeats-ui/                           # React Frontend
└── start-all.bat                         # Launch both services
```

## Backend Structure (`tajeats-be/`)

```
tajeats-be/
├── src/
│   ├── main/
│   │   ├── java/com/tajeats/tajeats_backend/
│   │   │   ├── controller/               # REST API Controllers
│   │   │   │   ├── RestaurantController.java
│   │   │   │   ├── DishController.java
│   │   │   │   ├── OrderController.java
│   │   │   │   ├── ReviewController.java
│   │   │   │   ├── CartItemController.java
│   │   │   │   ├── RestaurantImageController.java  # Image upload for restaurants
│   │   │   │   └── DishImageController.java        # Image upload for dishes
│   │   │   │
│   │   │   ├── service/                  # Business Logic Layer
│   │   │   │   ├── RestaurantService.java
│   │   │   │   ├── DishService.java
│   │   │   │   ├── OrderService.java
│   │   │   │   ├── ReviewService.java
│   │   │   │   ├── CartItemService.java
│   │   │   │   ├── ImageStorageService.java          # Interface for storage
│   │   │   │   └── FileSystemImageStorageService.java # Filesystem implementation
│   │   │   │
│   │   │   ├── repository/               # JPA Repositories
│   │   │   │   ├── RestaurantRepository.java
│   │   │   │   ├── DishRepository.java
│   │   │   │   ├── OrderRepository.java
│   │   │   │   ├── ReviewRepository.java
│   │   │   │   └── CartItemRepository.java
│   │   │   │
│   │   │   ├── model/                    # JPA Entities
│   │   │   │   ├── Restaurant.java
│   │   │   │   ├── Dish.java
│   │   │   │   ├── Order.java
│   │   │   │   ├── Review.java
│   │   │   │   └── CartItem.java
│   │   │   │
│   │   │   ├── dto/                      # Data Transfer Objects
│   │   │   │   ├── RestaurantDTO.java
│   │   │   │   ├── DishDTO.java
│   │   │   │   ├── OrderDTO.java
│   │   │   │   ├── ReviewDTO.java
│   │   │   │   ├── CartItemDTO.java
│   │   │   │   └── OrderItemDTO.java
│   │   │   │
│   │   │   ├── config/                   # Configuration Classes
│   │   │   │   └── WebConfig.java        # CORS, static file serving
│   │   │   │
│   │   │   └── TajeatsBackendApplication.java  # Main Spring Boot class
│   │   │
│   │   └── resources/
│   │       ├── application.properties    # DB config, multipart settings
│   │       └── static/                   # Static resources
│   │
│   └── test/
│       └── java/com/tajeats/tajeats_backend/
│           └── TajeatsBackendApplicationTests.java
│
├── uploads/                              # Local image storage (created at runtime)
│   ├── restaurants/                      # Restaurant images
│   ├── dishes/                           # Dish images
│   └── restaurants/logos/                # Restaurant logos
│
├── pom.xml                              # Maven dependencies
├── mvnw, mvnw.cmd                       # Maven wrapper
└── HELP.md

```

### Backend Key Files

#### Controllers (REST API Endpoints)
- **RestaurantController.java** - CRUD for restaurants
- **DishController.java** - CRUD for dishes, filter by restaurant
- **OrderController.java** - CRUD for orders, status updates
- **ReviewController.java** - CRUD for reviews, filter by restaurant
- **RestaurantImageController.java** - Image/logo upload for restaurants
- **DishImageController.java** - Image upload for dishes

#### Services (Business Logic)
- **All services** follow the pattern: `toDTO()`, `toEntity()` private methods
- **ImageStorageService** - Interface for storage abstraction
- **FileSystemImageStorageService** - Local filesystem storage (S3/MinIO ready)

#### Entities (Database Models)
```java
Restaurant:
  - id: Long (PK)
  - name, description, category, image, logo
  - rating, reviewCount, deliveryTime, deliveryFee
  - isOpen: Boolean
  - @OneToMany dishes, reviews

Dish:
  - id: Long (PK)
  - name, description, price, image, category
  - isAvailable, isPopular: Boolean
  - @ManyToOne restaurant

Order:
  - id: Long (PK)
  - customerName, customerPhone, customerAddress
  - total, status, createdAt, estimatedDelivery
  - @ManyToOne restaurant
  - @OneToMany items (CartItems)

Review:
  - id: Long (PK)
  - userName, userAvatar, rating, comment, date
  - @ManyToOne restaurant

CartItem:
  - id: Long (PK)
  - quantity
  - @ManyToOne dish, order
```

---

## Frontend Structure (`tajeats-ui/`)

```
tajeats-ui/
├── public/                              # Static assets
├── src/
│   ├── components/                      # Reusable Components
│   │   ├── ui/                         # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (50+ shadcn components)
│   │   │
│   │   ├── layout/                     # Layout Components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── DishCard.tsx               # Dish display with add to cart
│   │   ├── RestaurantCard.tsx         # Restaurant preview card
│   │   ├── ImageUpload.tsx            # ⭐ Reusable image upload with preview
│   │   │
│   │   ├── AddRestaurantDialog.tsx    # ⭐ Create restaurant dialog
│   │   ├── EditRestaurantDialog.tsx   # ⭐ Edit restaurant dialog
│   │   ├── AddDishDialog.tsx          # ⭐ Create dish dialog
│   │   ├── EditDishDialog.tsx         # ⭐ Edit dish dialog
│   │   ├── AddReviewDialog.tsx        # ⭐ Write review with rating
│   │   ├── EditReviewDialog.tsx       # ⭐ Edit existing review
│   │   ├── DeleteConfirmDialog.tsx    # ⭐ Generic delete confirmation
│   │   └── OrderDetailsDialog.tsx     # ⭐ View complete order details
│   │
│   ├── pages/                          # Route Pages
│   │   ├── Landing.tsx                # Home page
│   │   ├── Restaurants.tsx            # Restaurant listings
│   │   ├── RestaurantDetail.tsx       # Restaurant details + menu
│   │   ├── Cart.tsx                   # Shopping cart
│   │   ├── Checkout.tsx               # Checkout form
│   │   ├── OrderStatus.tsx            # Order tracking
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── BecomeRider.tsx
│   │   ├── NotFound.tsx
│   │   │
│   │   ├── admin/                     # Admin Portal
│   │   │   └── AdminDashboard.tsx     # ⭐ Restaurant mgmt, orders, stats
│   │   │
│   │   └── restaurant/                # Restaurant Owner Portal
│   │       └── RestaurantDashboard.tsx # ⭐ Menu mgmt, orders, reviews
│   │
│   ├── contexts/                       # React Context Providers
│   │   ├── DataContext.tsx            # ⭐ Main data provider (API integration)
│   │   ├── CartContext.tsx            # Shopping cart state
│   │   └── AuthContext.tsx            # Authentication state (mock for now)
│   │
│   ├── hooks/                          # Custom React Hooks
│   │   ├── use-toast.tsx
│   │   └── use-mobile.tsx
│   │
│   ├── lib/                            # Utilities & Configuration
│   │   ├── api.ts                     # ⭐ Axios client with interceptors
│   │   ├── mockData.ts                # Type definitions (Restaurant, Dish, etc.)
│   │   ├── sessionManager.ts          # Session ID management
│   │   └── utils.ts                   # Utility functions (cn, etc.)
│   │
│   ├── services/                       # ⭐ API Service Layer
│   │   ├── restaurantService.ts       # Restaurant API calls
│   │   ├── dishService.ts             # Dish API calls
│   │   ├── orderService.ts            # Order API calls
│   │   ├── reviewService.ts           # Review API calls
│   │   ├── cartItemService.ts         # CartItem API calls
│   │   └── imageService.ts            # ⭐ Image upload API calls
│   │
│   ├── types/                          # TypeScript Type Definitions
│   │   └── api.ts                     # ⭐ Backend DTO types (RestaurantDTO, etc.)
│   │
│   ├── App.tsx                         # Main app with routing
│   ├── App.css                         # Global styles
│   ├── main.tsx                        # Entry point with providers
│   └── index.css                       # Tailwind base styles
│
├── components.json                     # shadcn/ui configuration
├── tailwind.config.ts                  # Tailwind CSS config
├── vite.config.ts                      # Vite bundler config
├── tsconfig.json                       # TypeScript config
├── package.json                        # Dependencies
└── README.md

```

### Frontend Key Files

#### Contexts (State Management)
- **DataContext.tsx** - Fetches all data from backend API
  - Provides: restaurants, dishes, orders, reviews
  - Methods: addRestaurant, updateRestaurant, deleteRestaurant, etc.
  - Handles: Loading states, error states, type conversions
- **CartContext.tsx** - Shopping cart state and localStorage persistence
- **AuthContext.tsx** - Mock authentication (TODO: JWT integration)

#### Services (API Layer)
All services follow the same pattern:
```typescript
export const restaurantService = {
  async getAll(): Promise<RestaurantDTO[]>
  async getById(id: number): Promise<RestaurantDTO>
  async create(data: Omit<RestaurantDTO, 'id'>): Promise<RestaurantDTO>
  async update(id: number, data: Partial<RestaurantDTO>): Promise<RestaurantDTO>
  async delete(id: number): Promise<void>
}
```

#### API Client ([api.ts](tajeats-ui/src/lib/api.ts))
```typescript
- Axios instance with base URL: http://localhost:8080/api
- Request interceptor: Adds X-Session-ID header
- Response interceptor: Global error handling (401, 403, 404, 500)
- Timeout: 10 seconds
```

#### Image Upload System
**imageService.ts**
- `uploadRestaurantImage(restaurantId, file)` → POST /api/restaurants/{id}/image
- `uploadRestaurantLogo(restaurantId, file)` → POST /api/restaurants/{id}/logo
- `uploadDishImage(dishId, file)` → POST /api/dishes/{id}/image
- `validateImageFile(file)` → Client-side validation (MIME, size)

**ImageUpload.tsx** Component
- Props: currentImageUrl, onImageUploaded, uploadType, entityId
- Features: FileReader preview, remove button, loading states
- Validation: image/jpeg, image/png, image/webp (max 5MB)

#### Reusable Dialogs
All dialogs follow shadcn/ui patterns with:
- Form validation
- Loading states
- Toast notifications
- Success callbacks
- Optional custom triggers

**Restaurant Dialogs:**
- AddRestaurantDialog: Create + Image upload
- EditRestaurantDialog: Update + Image upload + Switch for isOpen

**Dish Dialogs:**
- AddDishDialog: Create + Image upload
- EditDishDialog: Update + Image upload + Switches for isAvailable/isPopular

**Review Dialogs:**
- AddReviewDialog: Name input + Star rating + Comment (10-500 chars)
- EditReviewDialog: Update rating/comment

**Generic Dialogs:**
- DeleteConfirmDialog: Reusable with custom title/description/onConfirm
- OrderDetailsDialog: Customer info, items, timeline, status badges

#### Dashboards
**AdminDashboard** (Restaurant Management Portal)
- Tabs: Overview, Restaurants, Orders, Users
- Stats: Total orders, revenue, active restaurants, customers
- Features: Add/Edit/Delete restaurants, view orders, charts

**RestaurantDashboard** (Restaurant Owner Portal)
- Tabs: Overview, Orders, Menu, Reviews
- Stats: Today's orders/revenue, total orders, average rating
- Features: Add/Edit/Delete dishes, view reviews, edit/delete reviews

---

## Data Flow

### Create Restaurant (Example)
```
1. User clicks "Add Restaurant" button
2. AddRestaurantDialog opens with form
3. User fills form and clicks "Create"
4. DataContext.addRestaurant() called
5. restaurantService.create() sends POST /api/restaurants
6. Backend: RestaurantController → RestaurantService → RestaurantRepository
7. Backend saves to PostgreSQL and returns RestaurantDTO
8. Frontend: Converts RestaurantDTO to Restaurant (id: string)
9. Updates restaurants state in DataContext
10. Dialog closes, toast notification shows success
11. User can now upload image with ImageUpload component
12. Image uploads to POST /api/restaurants/{id}/image
13. Backend: RestaurantImageController → FileSystemImageStorageService
14. Image saved to uploads/restaurants/{uuid}.jpg
15. Restaurant entity updated with image URL
16. Frontend refreshes to show new image
```

### Upload Image (Example)
```
1. ImageUpload component mounted with entityId
2. User clicks "Choose File" and selects image
3. Client-side validation: MIME type, file size
4. FileReader creates preview (data URL)
5. User clicks "Upload"
6. imageService creates FormData with file
7. POST /api/restaurants/{id}/image with multipart/form-data
8. Backend: ImageStorageService validates image
9. Backend: Generate UUID filename, save to filesystem
10. Backend: Update entity with public URL
11. Frontend: Receives image URL in response
12. Frontend: Calls onImageUploaded callback
13. Parent component updates state/UI
14. Image accessible at http://localhost:8080/images/restaurants/{uuid}.jpg
```

---

## Configuration Files

### Backend ([application.properties](tajeats-be/src/main/resources/application.properties))
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:4424/tajeats
spring.datasource.username=tajeats_user
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update

# Image Storage
app.storage.base-path=uploads
app.storage.base-url=http://localhost:8080/images
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
```

### Frontend ([vite.config.ts](tajeats-ui/vite.config.ts))
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),  // Path alias
  },
}
```

### Frontend ([tailwind.config.ts](tajeats-ui/tailwind.config.ts))
```typescript
- Custom colors: primary, accent, muted
- Gradients: gradient-primary, gradient-accent
- Animations: fade-in, slide-up
- Glass effects: backdrop-blur, glass class
```

---

## Running the Application

### Development Mode
```bash
# Start both services (Windows)
start-all.bat

# Or manually:
# Terminal 1 (Backend)
cd tajeats-be
mvn spring-boot:run

# Terminal 2 (Frontend)
cd tajeats-ui
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Static Images**: http://localhost:8080/images

### Build for Production
```bash
# Backend
cd tajeats-be
mvn clean package
java -jar target/tajeats-backend-0.0.1-SNAPSHOT.jar

# Frontend
cd tajeats-ui
npm run build
# Serve dist/ folder with any static server
```

---

## Next Steps / TODO

### Authentication & Security
- [ ] Implement JWT authentication
- [ ] Add Spring Security configuration
- [ ] Replace mock login with real backend auth
- [ ] Add password hashing (BCrypt)
- [ ] Implement role-based access control

### Payment Integration
- [ ] Integrate Stripe/PayPal
- [ ] Add payment flow in Checkout page
- [ ] Store payment transactions

### Real-time Features
- [ ] WebSocket for live order tracking
- [ ] Push notifications for order updates
- [ ] Real-time restaurant status updates

### Testing
- [ ] Unit tests for services (JUnit, Jest)
- [ ] Integration tests for controllers
- [ ] E2E tests (Cypress/Playwright)

### Deployment
- [ ] Dockerize backend and frontend
- [ ] Deploy to AWS/Azure/GCP
- [ ] Set up CI/CD pipeline
- [ ] Configure production database
- [ ] Migrate to S3/MinIO for image storage

---

## Notes

⭐ = New/recently added feature
✅ = Fully implemented and tested
🚧 = Work in progress
📝 = Needs documentation
