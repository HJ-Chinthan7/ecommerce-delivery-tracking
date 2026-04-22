# E-Commerce Delivery Tracking System - Full Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Backend Documentation](#backend-documentation)
4. [Frontend Documentation](#frontend-documentation)
5. [Database Models](#database-models)
6. [API Endpoints](#api-endpoints)
7. [Socket Events](#socket-events)
8. [Authentication & Security](#authentication--security)
9. [Deployment](#deployment)
10. [Demo Account/Login Password ](#Demo--Account/Login--Password)

---

## System Overview

The E-Commerce Delivery Tracking System is a comprehensive platform that manages delivery operations with real-time bus tracking, parcel management, and multiple user roles.

### Key Features:
- **Real-time GPS Tracking**: Live bus location updates using Socket.IO
- **Multi-tier User System**: SuperAdmin, Admin, Driver, and Assigner roles
- **Parcel Management**: Track parcels from creation to delivery
- **Route Management**: Create and manage delivery routes
- **Bus Fleet Management**: Manage bus assignments and status
- **Public Tracking**: Customers can track their parcels
- **Email Notifications**: Integration with email services for alerts

### Technology Stack:

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- Socket.IO for real-time communication
- JWT for authentication
- bcryptjs for password hashing
- Nodemailer for email services

**Frontend:**
- React 19 with Vite
- React Router v7 for navigation
- Socket.IO Client for real-time updates
- Leaflet & React-Leaflet for mapping
- Tailwind CSS for styling
- Axios for API calls

---

## Architecture

### System Architecture Overview
```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React)                       │
│  ┌────────────┐  ┌──────────┐  ┌──────────────┐        │
│  │ Admin      │  │ Driver   │  │ Public User  │        │
│  │ Dashboard  │  │ App      │  │ Tracking     │        │
│  └────────────┘  └──────────┘  └──────────────┘        │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP & WebSocket
┌──────────────────────▼──────────────────────────────────┐
│            Backend (Express.js + Socket.IO)              │
│  ┌──────────────────────────────────────────────┐       │
│  │  Routes & Controllers                        │       │
│  │  ├─ Auth Routes                              │       │
│  │  ├─ Admin Routes                             │       │
│  │  ├─ Driver Routes                            │       │
│  │  ├─ SuperAdmin Routes                        │       │
│  │  ├─ Assigner Routes                          │       │
│  │  ├─ Route Management                         │       │
│  │  └─ Tracking Routes                          │       │
│  └──────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────┐       │
│  │  Middleware                                  │       │
│  │  ├─ Authentication (JWT)                     │       │
│  │  ├─ Role-based Access Control                │       │
│  │  └─ Request Validation                       │       │
│  └──────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────┐       │
│  │  WebSocket Handlers (Socket.IO)              │       │
│  │  ├─ Bus Driver Sockets                       │       │
│  │  └─ All Buses Broadcast                      │       │
│  └──────────────────────────────────────────────┘       │
└──────────────────────┬──────────────────────────────────┘
                       │ MongoDB
┌──────────────────────▼──────────────────────────────────┐
│              MongoDB Database                            │
│  ├─ Users (Admin, Driver, SuperAdmin, Assigner)        │
│  ├─ Buses & Routes                                      │
│  ├─ Parcels & Deliveries                                │
│  ├─ Regions                                             │
│  └─ Codes (Delivery verification)                       │
└──────────────────────────────────────────────────────────┘
```

---

## Backend Documentation

### Directory Structure
```
tracking-backend/
├── app.js                          # Express app configuration
├── server.js                        # Server entry point
├── package.json                     # Dependencies
├── controllers/                     # Business logic handlers
│   ├── adminController.js          # Admin operations
│   ├── driverController.js         # Driver operations
│   ├── superAdminController.js     # SuperAdmin operations
│   ├── routeController.js          # Route management
│   ├── assignerContoller.js        # Parcel assignment logic
│   └── trackingController.js       # Tracking operations
├── models/                          # MongoDB schemas
│   ├── Admin.js
│   ├── Driver.js
│   ├── Bus.js
│   ├── Route.js
│   ├── Parcel.js
│   ├── Region.js
│   ├── SuperAdmin.js
│   ├── Assigner.js
│   └── Code.js
├── routes/                          # API route definitions
│   ├── auth.js                     # Authentication routes
│   ├── admin.js                    # Admin routes
│   ├── driver.js                   # Driver routes
│   ├── superAdmin.js               # SuperAdmin routes
│   ├── assignerRoutes.js           # Assigner routes
│   ├── route.js                    # Route management routes
│   └── tracking.js                 # Tracking routes
├── middleware/                      # Request processing middleware
│   ├── auth.middleware.js          # JWT authentication
│   ├── authAdmin.middleware.js     # Admin role check
│   ├── authAssigner.middleware.js  # Assigner role check
│   └── authSuperAdmin.middleware.js # SuperAdmin role check
├── sockets/                         # WebSocket handlers
│   ├── busDriverSockets.js         # Bus driver specific events
│   └── allBusesSockets.js          # All buses broadcast
├── utils/                           # Utility functions
│   ├── generateToken.js            # JWT token generation (Driver)
│   ├── generateAToken.js           # JWT token generation (Admin)
│   ├── generateSAToken.js          # JWT token generation (SuperAdmin)
│   ├── generateAsToken.js          # JWT token generation (Assigner)
│   └── mailSender.js               # Email sending configuration
└── database/
    └── db.js                       # MongoDB connection
```

### Key Controllers

#### 1. **adminController.js**
Handles admin-related operations:

**Methods:**
- `AdminLogin(email, password, role)` - Admin authentication
- `registerDriver(driverId, name, email, password)` - Register new driver
- `getRegionDrivers()` - Fetch all drivers in admin's region
- `getRegionBuses()` - Fetch all buses in admin's region
- `getRegionParcels(regionId)` - Get parcels for region
- `assignBus(driverId, busId)` - Assign bus to driver
- `assignBusToParcels(parcelIds, busId)` - Assign bus to multiple parcels
- `unassignParcelsFromBus(parcelIds)` - Remove parcels from bus
- `removeParcelsRegion(parcelIds)` - Remove region assignment
- `getUnassignedParcels(regionId)` - Fetch unassigned parcels
- `getAssignedParcels(regionId)` - Fetch assigned parcels
- `getAddressChangedParcels(regionId)` - Fetch parcels with address changes
- `AdminLogout()` - Logout admin user

**Key Functions:**
- Password hashing using bcryptjs
- JWT token generation and validation
- Region-based access control

---

#### 2. **driverController.js**
Handles driver authentication and delivery operations:

**Methods:**
- `driverLogin(email, password)` - Driver authentication
- `driverRegister(driverId, name, email, password, busId, adminId, regionId)` - Register driver
- `driverLogout()` - Logout driver
- `getBusRouteDetails(busId)` - Get route and bus information
- `updateBusStop(busId, data)` - Update current bus stop
- `sendNotification(busId, data)` - Send notifications
- `getBusParcels(busId)` - Get all parcels on bus
- `markDelivered(parcelId, email)` - Mark parcel as delivered
- `generateDeliveryCode(parcelId)` - Generate delivery verification code

**Key Features:**
- GPS location tracking integration
- Real-time bus status updates
- Parcel delivery confirmation
- Verification code generation for secure delivery

---

#### 3. **routeController.js**
Manages delivery routes and bus assignments:

**Methods:**
- `createRoute(name, description, stops, startTimes, endTimes, maxShifts)` - Create new route
- `getRegionRoutes()` - Get all routes in region
- `deleteRoute(routeId)` - Delete a route
- `toggleRouteStatus(id)` - Activate/deactivate route
- `assignBusRoute(busId, routeId)` - Assign bus to route
- `unAssignBusRoute(busId)` - Remove bus from route

**Route Structure:**
```javascript
{
  routeId: String (UUID),
  name: String,
  description: String,
  busStops: [{
    stopId: String (UUID),
    name: String,
    order: Number,
    timings: [String]
  }],
  startTimes: [String],
  endTimes: [String],
  maxshifts: Number,
  regionId: ObjectId,
  isActive: Boolean
}
```

---

#### 4. **superAdminController.js**
Manages system-wide administration:

**Methods:**
- `superAdminLogin(email, password, role)` - SuperAdmin authentication
- `createRegion(name, code, superAdminEmail)` - Create new delivery region
- `createAdmin(name, email, password, regionId)` - Create regional admin
- `createBus(busId, regionId, adminId, routeId)` - Register new bus
- `approveDriver(driverId)` - Approve pending driver registration
- `getAllAdmins()` - List all admins
- `getAllRegions()` - List all regions
- `getAllBuses()` - List all buses
- `getAllDrivers()` - List all drivers
- `superAdminLogout()` - Logout

---

#### 5. **assignerContoller.js**
Manages parcel assignment operations:

**Methods:**
- `loginAssigner(email, password)` - Assigner authentication
- `logoutAssigner()` - Logout assigner
- `getExternalOrders()` - Fetch orders from external e-commerce system
- `getRegions()` - Get available regions
- `assignParcel(orderIds, regionId)` - Assign parcels to region
- `getParcels()` - Get all assigned parcels
- `reassignParcel(parcelData)` - Reassign parcel to different bus
- `getReassignParcels()` - Get parcels available for reassignment

**External Integration:**
- Connects to external e-commerce API: `https://ecomm-doit.onrender.com`
- Fetches orders and creates parcel records
- Syncs delivery status back to order system

---

#### 6. **trackingController.js**
Handles public and internal tracking:

**Methods:**
- `tracking(busId)` - Get current bus location

**Data Source:**
- Uses in-memory storage (memoryStorage.js) for real-time location data
- Updated via Socket.IO events

---

### Models (Database Schemas)

#### **Admin Model**
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  regionId: ObjectId (ref: Region),
  role: String (default: "admin"),
  createdAt: Date,
  updatedAt: Date
}
```
**Methods:**
- `hashPassword(password)` - Static method for password hashing
- `comparePassword(candidatePassword)` - Instance method for verification

---

#### **Driver Model**
```javascript
{
  driverId: String (required, unique),
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  busId: ObjectId (ref: Bus),
  regionId: ObjectId (ref: Region),
  adminId: ObjectId (ref: Admin),
  status: String (enum: ["pending", "approved", "rejected"], default: "pending"),
  createdAt: Date,
  updatedAt: Date
}
```

---

#### **Bus Model**
```javascript
{
  busId: String (required, unique),
  driverId: ObjectId (ref: Driver),
  routeId: ObjectId (ref: Route),
  regionId: ObjectId (ref: Region),
  adminId: ObjectId (ref: Admin),
  parcels: [ObjectId] (ref: Parcel),
  currentLocation: {
    lat: Number,
    lng: Number
  },
  isActive: Boolean (default: false),
  direction: String (enum: ["return", "forward"], default: "forward"),
  status: String (enum: ["pending", "approved", "rejected"], default: "pending"),
  currentBusStop: {
    stopId: String,
    name: String
  },
  nextBusStop: {
    stopId: String,
    name: String
  },
  RouteOrderNo: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

---

#### **Route Model**
```javascript
{
  routeId: String (UUID, unique),
  name: String (required),
  description: String,
  maxshifts: Number (default: 1),
  busStops: [{
    stopId: String (UUID),
    name: String (required),
    order: Number (required),
    timings: [String]
  }],
  startTimes: [String],
  endTimes: [String],
  regionId: ObjectId (ref: Region),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

#### **Parcel Model**
```javascript
{
  orderId: ObjectId (unique, required),
  user: ObjectId (ref: User),
  items: [{
    name: String,
    qty: Number,
    price: Number,
    image: String,
    product: ObjectId (ref: Product)
  }],
  shippingAddress: {
    address: String (required),
    city: String (required),
    district: String (required),
    state: String (required),
    postalCode: String (required),
    country: String (required)
  },
  region: ObjectId (ref: Region),
  busId: ObjectId (ref: Bus),
  createdBy: ObjectId (ref: Assigner),
  assignedBy: ObjectId (ref: Assigner),
  assignedAt: Date,
  status: String (enum: ["pending", "assigned", "in_transit", "delivered", "unassigned", "returned"]),
  isDispatched: Boolean (default: false),
  isAddressChanged: Boolean (default: false),
  deliveredAt: Date,
  expectedDelivery: Date,
  history: [{
    action: String,
    by: ObjectId (ref: Assigner),
    at: Date,
    meta: Object
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

#### **Region Model**
```javascript
{
  name: String (required, unique),
  code: String (required, unique),
  superadminId: ObjectId (ref: SuperAdmin),
  createdAt: Date,
  updatedAt: Date
}
```

---

#### **SuperAdmin Model**
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  role: String (default: "superadmin"),
  createdAt: Date,
  updatedAt: Date
}
```

---

#### **Assigner Model**
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  role: String (enum: ['assigner'], default: 'assigner'),
  createdAt: Date,
  updatedAt: Date
}
```

---

#### **Code Model**
```javascript
{
  parcelId: ObjectId (ref: Parcel),
  code: String,
  type: String,
  used: Boolean,
  createdAt: Date,
  expiresAt: Date
}
```

---

### Middleware

#### **auth.middleware.js**
JWT authentication middleware for driver routes.

**Functionality:**
- Extracts JWT token from Authorization header
- Verifies token signature using JWT_SECRET
- Attaches decoded user data to `req.user`
- Returns 401 if token is missing or invalid

---

#### **authAdmin.middleware.js**
Role-based authentication for admin operations.

**Validates:**
- JWT token presence and validity
- Admin role verification
- Region ID association

---

#### **authAssigner.middleware.js**
Authentication for parcel assigner operations.

---

#### **authSuperAdmin.middleware.js**
Authentication for superadmin-level operations.

---

### Socket Events

#### **Bus Driver Sockets (busDriverSockets.js)**

**Events Handled:**
- `busDriverLogin` - Driver joins bus-specific room
- `busDriverLogout` - Driver leaves bus room
- `disconnect` - Cleanup when driver disconnects

**Room Structure:** `bus_${busId}`

---

#### **All Buses Broadcast (allBusesSockets.js)**

**Events:**
- `updateBusLocation` - Update location for specific bus
- `joinAllBuses` - Client subscribes to all bus updates
- `leaveAllBuses` - Client unsubscribes from all bus updates

**Broadcasting:**
- `bus:location` - Send location updates to bus-specific rooms
- `buses:all` - Broadcast all buses' locations to subscribed clients

---

### API Endpoints

#### **Authentication Routes** (`/api/auth`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/busLogin` | Driver login | `{email, password}` |
| POST | `/registerDriver` | Register new driver | `{driverId, name, email, password, busId, adminId, regionId}` |
| POST | `/driverLogout` | Driver logout | - |

---

#### **Admin Routes** (`/api/admin`)

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/adminLogin` | Admin login | - | `{email, password, role: "admin"}` |
| POST | `/registerDriver` | Register driver | Admin | `{driverId, name, email, password}` |
| GET | `/getRegionDrivers` | Get region drivers | Admin | - |
| GET | `/getRegionBuses/:regionId` | Get region buses | Admin | - |
| GET | `/getRegionParcels/:regionId` | Get region parcels | Admin | - |
| PUT | `/assign-bus` | Assign bus to driver | Admin | `{driverId, busId}` |
| PATCH | `/assign-bus` | Assign bus to parcels | Admin | `{parcelIds, busId}` |
| PATCH | `/unassign-bus` | Unassign parcels | Admin | `{parcelIds}` |
| PATCH | `/remove-region` | Remove region from parcels | Admin | `{parcelIds}` |
| GET | `/parcels/unassigned/:regionId` | Get unassigned parcels | Admin | - |
| GET | `/parcels/assigned/:regionId` | Get assigned parcels | Admin | - |
| GET | `/parcels/address-changed/:regionId` | Get address-changed parcels | Admin | - |
| POST | `/AdminLogout` | Admin logout | Admin | - |

---

#### **Driver Routes** (`/api/driver`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/getBusRouteDetails/:busId` | Get bus and route info | - |
| PATCH | `/updateBusStop/:busId` | Update current bus stop | `{currentStop, nextStop}` |
| POST | `/sendNotification/:busId` | Send delivery notification | `{message}` |
| GET | `/parcels/:busId` | Get bus parcels | - |
| POST | `/users/batch` | Get user details in bulk | `{userIds}` |
| PATCH | `/mark-delivered/:parcelId` | Mark parcel delivered | `{email}` |
| POST | `/generate-code` | Generate delivery code | `{parcelId, type: "delivery"}` |

---

#### **Route Routes** (`/api/route`)

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/createRoute` | Create new route | Admin | `{name, description, stops, startTimes, endTimes, maxShifts}` |
| GET | `/getRegionRoutes` | Get all region routes | Admin | - |
| DELETE | `/deleteRoute/:routeId` | Delete route | Admin | - |
| PATCH | `/toggleRouteStatus/:id` | Toggle route active status | Admin | - |
| PATCH | `/assignBusRoute` | Assign bus to route | Admin | `{busId, routeId}` |
| PATCH | `/unAssignBusRoute/:busId` | Remove route from bus | Admin | - |

---

#### **SuperAdmin Routes** (`/api/superadmin`)

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/superAdminLogin` | SuperAdmin login | - | `{email, password, role: "superadmin"}` |
| POST | `/createregion` | Create region | SuperAdmin | `{name, code, superAdminEmail}` |
| PUT | `/approveDriver/:driverId` | Approve driver | SuperAdmin | - |
| POST | `/createadmin` | Create regional admin | SuperAdmin | `{name, email, password, regionId}` |
| POST | `/createbus` | Create bus | SuperAdmin | `{busId, regionId, adminId, routeId}` |
| GET | `/getalladmins` | Get all admins | SuperAdmin | - |
| GET | `/getallregions` | Get all regions | SuperAdmin | - |
| GET | `/getallbuses` | Get all buses | SuperAdmin | - |
| GET | `/getalldrivers` | Get all drivers | SuperAdmin | - |
| POST | `/superAdminLogout` | SuperAdmin logout | SuperAdmin | - |

---

#### **Assigner Routes** (`/api/assigner`)

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/assignerLogin` | Assigner login | - | `{email, password}` |
| POST | `/assignParcel` | Assign parcels to region | Assigner | `{orderIds, regionId}` |
| GET | `/getParcels` | Get assigned parcels | Assigner | - |
| GET | `/regions` | Get available regions | Assigner | - |
| GET | `/parcels/reassign` | Get reassignable parcels | Assigner | - |
| POST | `/reassignParcel` | Reassign parcel | Assigner | `{parcelData}` |
| POST | `/assignerLogout` | Assigner logout | Assigner | - |

---

#### **Tracking Routes** (`/api/public-tracking`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/getBusLocationtracking/:busId` | Get current bus location | - |

---

---

## Frontend Documentation

### Directory Structure
```
tracking-frontend/
├── src/
│   ├── App.jsx                              # Main application component
│   ├── index.css                            # Global styles
│   ├── main.jsx                             # React entry point
│   ├── AuthContext/                         # Authentication state management
│   │   ├── BusAuthContext.jsx              # Driver authentication context
│   │   ├── AdminAuthContext.jsx            # Admin authentication context
│   │   └── AssignerAuthContext.jsx         # Assigner authentication context
│   ├── components/                          # Reusable UI components
│   │   ├── Home.jsx                        # Homepage/landing page
│   │   ├── BusDriverApp.jsx                # Main driver app container
│   │   ├── BusDriverLogin.jsx              # Driver login page
│   │   ├── BusMap.jsx                      # Real-time bus tracking map
│   │   ├── DeliveriesTable.jsx             # Parcel deliveries table
│   │   ├── RouteInfoPage.jsx               # Route information display
│   │   ├── RouteStops.jsx                  # Bus stops list
│   │   ├── ParcelList.jsx                  # Parcel management list
│   │   ├── ParcelCard.jsx                  # Individual parcel display
│   │   ├── CurrentStatusCard.jsx           # Current delivery status
│   │   ├── PublicBusTracking.jsx           # Public bus tracking page
│   │   ├── ConfirmModal.jsx                # Confirmation dialog
│   │   ├── VerifyModal.jsx                 # Verification dialog
│   │   ├── RightPanel.jsx                  # Side panel component
│   │   ├── Navbar.jsx                      # Navigation bar
│   │   ├── TabsContainer.jsx               # Tab navigation
│   │   ├── admin/                          # Admin dashboard components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── DashboardHeader.jsx
│   │   │   ├── OverviewTab.jsx
│   │   │   ├── DriversTab.jsx
│   │   │   ├── BusesTab.jsx
│   │   │   ├── RoutesTab.jsx
│   │   │   ├── ParcelsTab.jsx
│   │   │   ├── AssignRoute.jsx
│   │   │   ├── AssignForm.jsx
│   │   │   ├── CreateRouteForm.jsx
│   │   │   ├── BusAssignerSection.jsx
│   │   │   ├── BusCard.jsx
│   │   │   ├── BusCardMini.jsx
│   │   │   ├── BusCardParcel.jsx
│   │   │   ├── RouteCard.jsx
│   │   │   ├── RouteCardMini.jsx
│   │   │   ├── RouteList.jsx
│   │   │   ├── ParcelAssignerPageWithTabs.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Tabs.jsx
│   │   │   ├── TabItem.jsx
│   │   │   ├── MessageBox.jsx
│   │   │   └── other admin components
│   │   ├── parcel assigner/                # Parcel assigner components
│   │   │   ├── AssignerLogin.jsx
│   │   │   ├── Assignment.jsx
│   │   │   └── other assigner components
│   │   └── superAdmin/                     # SuperAdmin components
│   │       └── other superadmin components
│   ├── routes/                              # Route definitions
│   │   └── AdminRoutes.jsx                 # Admin routing configuration
│   ├── services/                            # API and socket services
│   │   ├── api.js                          # Axios API client with endpoints
│   │   └── socket.js                       # Socket.IO client configuration
│   └── utils/                               # Utility functions
│       ├── util.js                         # Common utilities
│       └── DancingText.jsx                 # Animated text component
├── public/
│   └── _redirects                          # Netlify routing configuration
├── index.html                               # HTML entry point
├── vite.config.js                          # Vite configuration
├── tailwind.config.js                      # Tailwind CSS configuration
├── postcss.config.js                       # PostCSS configuration
├── eslint.config.js                        # ESLint configuration
├── package.json                            # Dependencies and scripts
├── netlify.toml                            # Netlify deployment config
└── README.md                               # Project readme
```

---

### Key Components

#### **App.jsx**
Main application wrapper that sets up routing and context providers.

**Routes:**
- `/` - Home page
- `/admin/login/*` - Admin login and dashboard
- `/login` - Driver login
- `/driver` - Driver application
- `/track/:parcelId` - Public parcel tracking
- `/assigner-login` - Assigner login
- `/assigner` - Assigner dashboard
- `/parcel-assigner` - Parcel assignment page

**Context Providers:**
- `BusAuthProvider` - Driver authentication
- `AdminAuthProvider` - Admin authentication
- `AssignerAuthProvider` - Assigner authentication

---

#### **BusAuthContext.jsx**
Authentication context for bus drivers.

**State:**
- `driver` - Current driver info
- `isLoggedIn` - Login status
- `token` - JWT token
- `location` - GPS coordinates
- `message` - Status messages

**Methods:**
- `login(credentials)` - Authenticate driver
- `logout()` - Logout and cleanup
- `setLocation(location)` - Update GPS location

**Features:**
- Socket.IO connection management
- Token persistence in localStorage
- Automatic socket reconnection

---

#### **BusMap.jsx**
Real-time interactive map for bus tracking.

**Features:**
- Leaflet/OpenStreetMap integration
- Live bus location updates via Socket.IO
- Custom bus icon with rotation
- Route visualization with polylines
- Bus stop markers
- All buses view mode
- Location refresh controls

**Socket Events:**
- Listens to: `bus:location`, `buses:all`
- Emits: `updateBusLocation`, `joinAllBuses`, `leaveAllBuses`

**Props:**
- `tracking` - Start/stop tracking
- `setTracking` - Update tracking state
- `showAll` - Show all buses on map
- `setShowAll` - Toggle all buses view
- `bus` - Current bus data
- `route` - Current route data

---

#### **DeliveriesTable.jsx**
Displays parcels assigned to a bus for delivery.

**Features:**
- Parcel list with details
- Delivery status tracking
- Mark as delivered functionality
- Delivery code verification
- Address change detection
- Parcel history view

**Functionality:**
- Fetches parcels by bus ID
- Real-time delivery updates
- Generates and verifies delivery codes
- Email confirmation on delivery

---

#### **AdminDashboard.jsx**
Comprehensive admin control panel.

**Tabs:**
- Overview - System statistics
- Drivers - Manage drivers
- Buses - Manage buses
- Routes - Create and manage routes
- Parcels - Track parcels

**Features:**
- Driver registration and approval
- Bus assignment to drivers
- Route creation and management
- Parcel status tracking
- Region-specific filtering

---

#### **BusDriverApp.jsx**
Main container for driver application.

**Tabs:**
- Map View - Real-time tracking map
- Route List - Route and stop information
- Parcels - Deliveries to make

**Features:**
- GPS location integration
- Live map tracking
- Route navigation
- Delivery management
- All buses view toggle

---

#### **Services/api.js**
Centralized API client configuration.

**API Groups:**

```javascript
// Auth API
authAPI.busLogin()
authAPI.registerDriver()
authAPI.driverLogout()

// SuperAdmin API
superAdminAPI.superAdminLogin()
superAdminAPI.createAdmin()
superAdminAPI.approveDriver()
superAdminAPI.createRegion()
superAdminAPI.createBus()
superAdminAPI.superAdminLogout()
superAdminAPI.getAllAdmins()
superAdminAPI.getallDrivers()
superAdminAPI.getAllBuses()
superAdminAPI.getAllRegions()

// Admin API
adminAPI.adminLogin()
adminAPI.adminLogout()
adminAPI.getRegionDrivers()
adminAPI.getRegionBuses()
adminAPI.getRegionParcels()
adminAPI.registerDriver()
adminAPI.assignBus()
adminAPI.createRoute()
adminAPI.getRegionRoutes()
adminAPI.deleteRoute()
adminAPI.toggleRouteStatus()
adminAPI.unAssignBusRoute()
adminAPI.assignBusRoute()
adminAPI.assignBusToParcels()
adminAPI.unassignParcelsFromBus()
adminAPI.removeParcelsRegion()
adminAPI.getUnassignedParcels()
adminAPI.getAssignedParcels()
adminAPI.getAddressChangedParcels()

// Driver API
driverAPI.getBusRouteDetails()
driverAPI.updateBusStop()
driverAPI.sendNotification()

// Public API
publicAPI.getBusLocationtracking()

// Assigner API
assignerAPI.login()
assignerAPI.logout()
assignerAPI.assignParcel()
assignerAPI.getParcels()
assignerAPI.getRegions()
assignerAPI.getReassignParcels()
assignerAPI.reassignParcel()

// Driver Parcels API
driverParcelsAPI.getBusParcels()
driverParcelsAPI.getUsersBatch()
driverParcelsAPI.markDelivered()
driverParcelsAPI.generateDeliveryCode()
driverParcelsAPI.verifyCode()
```

**Interceptors:**
- Request interceptor adds JWT token to Authorization header
- Base URL from environment variable or localhost

---

#### **Services/socket.js**
Socket.IO client configuration.

**Connection Management:**
- `connect()` - Initialize socket connection
- `disconnect()` - Close socket connection
- `isConnected()` - Check connection status

**Events:**

```javascript
// Emit events
busDriverLogin(busId)
busDriverLogout(busId)
updateBusLocation({busId, lat, lon})
joinAllBuses()
leaveAllBuses()

// Listen events
socket.on('bus:location', callback)
socket.on('buses:all', callback)
socket.on('connect', callback)
socket.on('disconnect', callback)
```

---

### Styling & UI

**Tailwind CSS:**
- Custom scrollbars with `.custom-scrollbar`
- Dark theme with zinc and blue colors
- Glass-morphism effects with backdrop blur
- Gradient text animations
- Responsive design (mobile-first)

**Animations (Framer Motion):**
- Page transitions
- Modal animations
- List item staggering
- Location updates smoothing

**Icons:**
- Lucide React for SVG icons
- React Icons for additional icons

---

---

## Authentication & Security

### JWT Token Structure

**Driver Token:**
```javascript
{
  driverId: String,
  email: String,
  _id: ObjectId
}
```

**Admin Token:**
```javascript
{
  _id: ObjectId,
  email: String,
  regionId: ObjectId
}
```

**SuperAdmin Token:**
```javascript
{
  _id: ObjectId,
  email: String
}
```

**Assigner Token:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String
}
```

---

### Security Features

1. **Password Hashing**
   - bcryptjs with 10 salt rounds
   - Passwords never stored in plain text
   - Comparison method for verification

2. **JWT Authentication**
   - Tokens valid for 24 hours
   - HTTP-only cookies for token storage
   - Bearer token in Authorization header

3. **CORS Protection**
   - Whitelist of allowed origins
   - Credentials enabled for cross-origin requests
   - HTTP methods restricted

4. **Role-Based Access Control (RBAC)**
   - Middleware verifies user role
   - Region-scoped data access
   - Endpoint-level authorization

5. **Input Validation**
   - Express-validator for request validation
   - Email format validation
   - Password strength requirements
   - Required field checking

---

## Deployment

### Environment Variables

**Backend (.env)**
```
MONGODB_URI=<MongoDB connection string>
JWT_SECRET=<JWT signing secret>
FRONTEND_URL=<Frontend deployment URL>
PORT=<Server port, default 5002>
NODE_ENV=<production|development>
SENDINGBLUE_API_KEY=<Email service API key>
```

**Frontend (.env.local)**
```
VITE_APP_BASE_URL=<Backend API URL>
```

---

### Development Setup

**Backend:**
```bash
cd tracking-backend
npm install
npm run dev  # Run with nodemon
# or
npm start    # Run without nodemon
```

**Frontend:**
```bash
cd tracking-frontend
npm install
npm run dev   # Start Vite dev server
```

---

### Production Build

**Frontend:**
```bash
npm run build    # Creates optimized build
npm run preview  # Preview production build locally
```

**Deployment Options:**

**Netlify (Frontend):**
- Auto-deploys from GitHub
- Uses `netlify.toml` configuration
- Redirects configured in `public/_redirects`
- Build command: `npm run build`
- Publish directory: `dist`

**Render/Heroku (Backend):**
- Start command: `npm start`
- PORT environment variable
- MongoDB Atlas for database

---

### CORS Configuration

**Allowed Origins:**
- Environment variable `FRONTEND_URL`
- `http://localhost:5174` (dev)
- `http://localhost:5000` (alt dev)
- `https://ecomm-doit.onrender.com`
- `https://real-time-trackingofbuses.netlify.app`

**Allowed Methods:**
- GET, POST, PUT, DELETE, PATCH

**Allowed Headers:**
- Content-Type
- Authorization

---

## Key Features Summary

### Real-time Capabilities
- Live GPS bus tracking
- Instant location updates via Socket.IO
- Real-time parcel status changes
- Live notification delivery

### Parcel Management
- Create and track parcels from external e-commerce system
- Assign parcels to buses and drivers
- Track delivery status
- Generate delivery verification codes
- Support address change scenarios

### Route Management
- Create complex delivery routes
- Define bus stops with timings
- Manage multiple shifts
- Activate/deactivate routes
- Assign buses to routes

### Multi-tier User System
- **SuperAdmin**: System administration
- **Admin**: Regional management
- **Driver**: Delivery operations
- **Assigner**: Parcel assignment

### Integration
- External e-commerce API integration
- Email notifications via Nodemailer
- Real-time WebSocket communication
- RESTful API for all operations

---

## Error Handling

### HTTP Status Codes
- **200/201**: Success
- **400**: Bad request/validation error
- **401**: Unauthorized/invalid credentials
- **403**: Forbidden/insufficient permissions
- **404**: Resource not found
- **500**: Server error

### Error Response Format
```javascript
{
  error: "Error message",
  // or
  message: "Error message",
  // or
  errors: [Array of validation errors]
}
```

---

## Performance Considerations

1. **Database Indexing**
   - Unique indexes on email and ID fields
   - Region-based query optimization

2. **Socket.IO Optimization**
   - Room-based broadcasting to reduce data transfer
   - Selective event subscriptions
   - Connection pooling

3. **Frontend Optimization**
   - Code splitting with React Router
   - CSS minification via Tailwind

4. **API Efficiency**
   - Pagination for large datasets
   - Batch operations for bulk updates

---

## Testing

Testing of all api backend routes useing postman


---

## Future Enhancements


1. Driver performance metrics
2. Customer feedback system
3. Multi-language support

---

## Support & Troubleshooting

### Common Issues

**Connection Issues:**
- Check CORS configuration if frontend cannot reach backend
- Verify MongoDB connection string
- Ensure Socket.IO ports are accessible

**Authentication Issues:**
- Verify JWT_SECRET is consistent
- Check token expiration (24 hours)
- Ensure environment variables are set

**Location Tracking Issues:**
- Verify browser geolocation permissions
- Check browser console for errors
- Ensure Socket.IO connection is active


## Demo Account/Login Password



---



