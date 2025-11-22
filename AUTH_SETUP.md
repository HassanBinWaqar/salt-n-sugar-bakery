# Authentication System Setup

## 🔐 Features Implemented

Your Salt N Sugar website now has a complete authentication system with:

### ✅ User Registration (Signup)
- Full name, email, and password fields
- Password confirmation validation
- Minimum 6 character password requirement
- Email uniqueness validation
- Terms and conditions checkbox

### ✅ User Login
- Email and password authentication
- Remember me option
- Forgot password link (UI only)
- Secure JWT token-based sessions

### ✅ Security Features
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: 7-day expiration
- **Input Validation**: Server-side validation
- **Error Handling**: User-friendly error messages

### ✅ UI/UX Features
- Matches website color scheme (coral, mint, cream)
- Responsive design for all devices
- Loading states during authentication
- Error message displays
- Smooth transitions and animations

## 📦 Database Setup

### Option 1: Local MongoDB (Recommended for Development)

1. **Install MongoDB locally**:
   - Download from: https://www.mongodb.com/try/download/community
   - Install and start MongoDB service

2. **The connection is already configured** in `.env.local`:
   ```
   MONGODB_URI=mongodb://localhost:27017/saltnsugar
   ```

### Option 2: MongoDB Atlas (Cloud - Recommended for Production)

1. **Create a free MongoDB Atlas account**:
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free cluster

2. **Get your connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update `.env.local`**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saltnsugar
   ```
   Replace `username`, `password`, and `cluster` with your actual values

## 🚀 How to Use

### Start the Application

```bash
npm run dev
```

### Testing the Authentication

1. **Sign Up**:
   - Navigate to: http://localhost:3000/signup
   - Fill in the registration form
   - Click "Create Account"
   - You'll be automatically logged in and redirected to home

2. **Login**:
   - Navigate to: http://localhost:3000/login
   - Enter your email and password
   - Click "Sign In"
   - You'll be redirected to home

3. **Logout**:
   - Click the "Logout" button in the header
   - You'll be logged out immediately

### Navigation Links

- **Signup Page**: `/signup`
- **Login Page**: `/login`
- **Home Page**: `/`

## 🔧 Configuration

### Environment Variables

Create or update `.env.local` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/saltnsugar

# JWT Secret (Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

⚠️ **Important**: Change `JWT_SECRET` to a strong random string in production!

## 📁 File Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── signup/
│   │       │   └── route.ts        # Signup API endpoint
│   │       └── login/
│   │           └── route.ts        # Login API endpoint
│   ├── login/
│   │   └── page.tsx               # Login page
│   ├── signup/
│   │   └── page.tsx               # Signup page
│   └── layout.tsx                 # Root layout with AuthProvider
├── context/
│   └── AuthContext.tsx            # Authentication state management
├── lib/
│   └── mongodb.ts                 # Database connection
└── models/
    └── User.ts                    # User model schema
```

## 🔑 API Endpoints

### POST `/api/auth/signup`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (201 Created):
```json
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST `/api/auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🛡️ Security Best Practices

1. **JWT Token**: Stored in localStorage (7-day expiration)
2. **Password**: Hashed with bcrypt (10 salt rounds)
3. **Validation**: Both client-side and server-side
4. **HTTPS**: Use HTTPS in production
5. **Environment Variables**: Never commit `.env.local` to git

## 🎨 Design Consistency

The authentication pages match your website's design:
- **Primary Color**: Coral (#FF6B6B)
- **Secondary Colors**: Mint (#C0E6E4), Cream (#FFF8F0)
- **Gradients**: Same as homepage
- **Typography**: Inter font family
- **Components**: Rounded buttons, smooth transitions

## 🔄 User Flow

1. **New User**:
   - Lands on homepage
   - Clicks "Sign Up" in header
   - Fills registration form
   - Gets authenticated automatically
   - Redirected to homepage (logged in)

2. **Returning User**:
   - Lands on homepage
   - Clicks "Login" in header
   - Enters credentials
   - Gets authenticated
   - Redirected to homepage (logged in)

3. **Logged In User**:
   - Sees "Hello, [Name]" in header
   - Can logout anytime
   - Token persists across page refreshes

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error**: `MongooseError: The uri parameter to openUri() must be a string`

**Solution**: Ensure MongoDB is running and `.env.local` has the correct URI.

### JWT Token Issues

**Error**: `JsonWebTokenError: jwt malformed`

**Solution**: Clear localStorage and login again.

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**: 
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill the old dev server and restart
npm run dev
```

## 📚 Additional Features You Can Add

- ✉️ Email verification
- 🔐 Password reset functionality
- 👤 User profile page
- 📸 Profile picture upload
- 🔔 Email notifications
- 🛡️ Two-factor authentication (2FA)
- 📱 OAuth (Google, Facebook login)
- 🔒 Session management
- 📊 User dashboard

## 🎉 Summary

Your authentication system is fully functional with:
- ✅ Secure user registration
- ✅ Secure user login
- ✅ JWT token authentication
- ✅ MongoDB database integration
- ✅ Beautiful UI matching your brand
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

The system is production-ready with proper security measures! 🚀
