# Customer Feedback System

A full-stack customer feedback system built with React, Node.js, Express, and MongoDB. Users can submit feedback, product reviews, and NPS surveys, while admins can view analytics with interactive charts.

## Features

### Frontend (React)
- **Feedback Form**: Public form for users to submit feedback
- **Admin Dashboard**: Protected dashboard to view and manage feedback
- **Analytics Dashboard**: Interactive charts using Chart.js
- **Search & Filter**: Advanced filtering with debounced search
- **Responsive Design**: Built with Tailwind CSS

### Backend (Node.js + Express)
- **RESTful API**: Clean API endpoints for feedback and analytics
- **Authentication**: JWT-based admin authentication
- **Validation**: Input validation with express-validator
- **MongoDB Integration**: Mongoose ODM with optimized schemas

## Tech Stack

- **Frontend**: React 18, React Router DOM, Chart.js, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Validation**: express-validator
- **Styling**: Tailwind CSS

## Project Structure

```
customer-feedback-system/
├── frontend/                 # React frontend
│   ├── public/
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── charts/         # Chart components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── routes/         # Route components
│   │   ├── utils/          # Utility functions
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── db.js          # Database connection
│   │   └── server.js      # Main server file
│   ├── package.json
│   └── env.example
├── package.json             # Root package.json
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd customer-feedback-system
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   **Backend:**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```
   
   **Frontend:**
   ```bash
   cd frontend
   cp env.example .env
   # Edit .env with your backend API URL
   ```

4. **Start the application**
   ```bash
   # From root directory
   npm run dev
   ```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/feedback_system
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_BASE=http://localhost:5000
```

## API Endpoints

### Public Endpoints
- `POST /api/feedback` - Submit feedback

### Protected Endpoints (Admin only)
- `GET /api/feedback` - Get all feedback with filters
- `GET /api/feedback/:id` - Get specific feedback
- `DELETE /api/feedback/:id` - Delete feedback
- `GET /api/analytics` - Get analytics data
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current user profile

## Usage

### For Users
1. Visit the homepage (`/`)
2. Fill out the feedback form
3. Submit your feedback

### For Admins
1. Navigate to `/login`
2. Use admin credentials to log in
3. Access dashboard at `/admin`
4. View analytics at `/analytics`

## Development

### Running Frontend Only
```bash
cd frontend
npm start
```

### Running Backend Only
```bash
cd backend
npm run dev
```

### Running Both
```bash
npm run dev
```

## Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd backend
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
