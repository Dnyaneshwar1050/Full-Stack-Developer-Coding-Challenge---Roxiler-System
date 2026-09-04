# Store Rating Platform - Frontend

A React + Vite frontend for a store rating platform with role-based access control (Admin, Normal User, Store Owner).

## Features

### 🔐 Authentication
- **Login**: Email and password based authentication for all roles
- **Signup**: Registration for normal users
- **JWT Auth**: Token-based authentication stored in localStorage
- **Password Management**: Change password functionality for all authenticated users

### 👤 User Roles & Functionalities

#### Admin
- **Dashboard**: View platform statistics (total users, stores, ratings)
- **Users Management**: View, search, and filter users by name, email, address, role
- **Stores Management**: View stores with ratings, search and filter functionality
- **Add User**: Create new users (admin, normal, store owner)
- **Add Store**: Register new stores
- **Change Password**: Update their account password
- **Sorting**: Sort users and stores by any column (ascending/descending)

#### Normal User
- **Store Listings**: Browse all available stores
- **Search & Filter**: Find stores by name and address
- **Rating System**: Submit ratings (1-5) for stores
- **Update Ratings**: Modify previously submitted ratings
- **View Ratings**: See average store rating and their own rating
- **Change Password**: Update their account password

#### Store Owner
- **Dashboard**: View their store information
- **Ratings Overview**: See list of users who rated their store
- **Average Rating**: View overall store rating
- **Change Password**: Update their account password

## Tech Stack

- **React 19.2.8**: UI library
- **Vite 8.2.2**: Build tool
- **React Router 7.18.3**: Routing
- **Axios 1.20.0**: HTTP client
- **Inline Styles**: No CSS files, pure JSX styling

## Project Structure

```
src/
├── contexts/
│   └── AuthContext.jsx          # Authentication state management
├── components/
│   ├── Navbar.jsx               # Navigation bar
│   └── ProtectedRoute.jsx        # Route protection wrapper
├── services/
│   └── api.js                   # Axios instance with JWT interceptor
├── pages/
│   ├── Login.jsx                # Login form
│   ├── Signup.jsx               # Signup form
│   ├── UpdatePassword.jsx        # Shared password update page
│   ├── Unauthorized.jsx          # 403 error page
│   ├── admin/
│   │   ├── AdminDashboard.jsx   # Admin statistics dashboard
│   │   ├── AdminUsers.jsx       # Users list with filters
│   │   ├── AdminStores.jsx      # Stores list with filters
│   │   ├── AddUser.jsx          # Add new user form
│   │   └── AddStore.jsx         # Add new store form
│   ├── user/
│   │   └── UserStores.jsx       # Store list and rating interface
│   └── storeOwner/
│       └── StoreOwnerDashboard.jsx # Store owner dashboard
├── App.jsx                      # Main routing configuration
└── main.jsx                     # Application entry point
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation
```bash
cd Frontend
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Build for Production
```bash
npm run build
```

## Validation Rules

### Name
- **Min**: 20 characters
- **Max**: 60 characters
- Applied to: User signup, add user, store creation

### Email
- Standard email format validation (name@domain.com)
- Required for all accounts

### Address
- **Max**: 400 characters
- Applied to: User signup, add user, store creation

### Password
- **Length**: 8-16 characters
- **Requirements**: 
  - At least 1 uppercase letter
  - At least 1 special character (!@#$%^&*()_+-=[]{}';:"\\|,.<>/?)
- Applied to: All password fields (login, signup, password change)

### Ratings
- **Range**: 1-5 (Poor to Excellent)
- Can be submitted and updated

## API Integration

The frontend connects to a backend API at `http://localhost:3000/api`. 

### Axios Interceptors
- **Request Interceptor**: Automatically attaches JWT token to all requests
- **Response Interceptor**: Handles 401 errors by redirecting to login

### Key Endpoints (Expected)

**Auth**
- `POST /auth/login` - Login user
- `POST /auth/signup` - Register new user
- `POST /auth/change-password` - Change password

**Admin**
- `GET /admin/stats` - Get dashboard statistics
- `GET /admin/users` - Get all users
- `GET /admin/stores` - Get all stores
- `POST /admin/add-user` - Create new user
- `POST /admin/add-store` - Create new store

**Store (User)**
- `GET /store/list` - Get stores with user ratings
- `POST /rating/submit` - Submit new rating
- `PUT /rating/{storeId}/update` - Update existing rating

**Store Owner**
- `GET /store-owner/dashboard` - Get store ratings data

## Authentication Flow

1. User logs in/signs up with credentials
2. Backend returns JWT token and user data
3. Token and user data stored in localStorage
4. Axios interceptor adds token to Authorization header
5. Protected routes check user role in AuthContext
6. Unauthorized access redirects to /login

## Features & Best Practices

✅ **Simple & Clean Code**: Inline styles, plain useState, no over-engineering
✅ **No Form Libraries**: Manual validation in form handlers
✅ **No CSS Files**: All styling via inline style props
✅ **Role-Based Access**: Protected routes with role checking
✅ **Search & Filter**: Real-time filtering on all list pages
✅ **Sorting**: Clickable column headers for ascending/descending sort
✅ **Error Handling**: User-friendly error messages
✅ **Loading States**: Loading indicators during data fetches
✅ **Responsive Design**: Works on different screen sizes
✅ **User Feedback**: Success/error alerts after actions

## Key Components Explained

### AuthContext
Manages global authentication state including user, token, and methods:
- `login(userData, token)` - Set user and token
- `logout()` - Clear user and token
- `updateUser(updatedUser)` - Update user in state
- `useAuth()` - Hook to access auth context

### ProtectedRoute
Wrapper component that:
- Checks if user is authenticated
- Validates user role if requiredRole is specified
- Redirects to /login if unauthorized
- Shows loading state while checking auth

### API Service
Axios instance with:
- Base URL configuration
- Request interceptor (adds JWT token)
- Response interceptor (handles 401 errors)
- Automatic redirect to login on token expiration

## Troubleshooting

### CORS Errors
Ensure backend is configured to accept requests from `http://localhost:5173`

### Authentication Errors
- Check if token is saved in localStorage
- Verify JWT token is valid and not expired
- Check if Authorization header is properly formatted

### Data Not Loading
- Open browser DevTools Network tab
- Check API response status
- Verify backend is running on `http://localhost:3000`

## Development Notes

- All components use functional React with hooks
- State management is done with useState (no Redux/Context needed for this scale)
- Validation happens inline in form submit handlers
- Styling uses inline objects passed to JSX elements
- No build-time CSS processing is used

## Future Enhancements

- Add pagination for large lists
- Implement rating statistics/charts
- Add user profile pages
- Email notifications for ratings
- Advanced search with multiple filters
- Dark mode support
- Accessibility improvements (ARIA labels, keyboard navigation)
