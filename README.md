<div align="center">

# 🧳 TripSplit 

### AI-Powered Trip Expense Management & Settlement Platform

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Smart trip expense tracker with AI-powered summaries, automatic settlement calculations, trip pool management, and beautiful analytics.**

[Features](#-key-features) • [Tech Stack](#-tech-stack) • [Setup](#-end-to-end-setup) • [Usage](#-usage-guide) • [Architecture](#-architecture-overview)

</div>

---

## 🚀 Key Features

<table>
<tr>
<td width="50%">

### 🧳 **Trip Management**
- Create, view, edit & delete trips
- Add/remove trip members
- Track trip start dates
- Activity timeline for all actions

### 💰 **Expense Management**
- Multiple split types:
  - Equal split
  - Split among selected members
  - Percentage-based split
  - Custom manual split
  - Each person pays their own
- Category tracking (Travel, Food, Stay, Shopping, Misc)
- Mark expenses as settled
- Bulk settle/unsettle expenses

</td>
<td width="50%">

### 🏦 **Trip Pool / Advance Contribution**
- Members contribute to shared fund
- Pay expenses directly from pool
- Real-time pool balance tracking
- Proportional returns calculation
- Pool payments excluded from settlement

### 📊 **Smart Settlement**
- Automatic balance calculation
- Minimal transaction optimization
- Who pays whom instructions
- Visual balance cards
- Debt cancellation logic

</td>
</tr>
</table>

### ⚡ **Additional Features**
- 🤖 **AI-Powered Summary** - Google Gemini 2.5 Pro generates human-friendly expense explanations
- 📄 **PDF Export** - Generate complete trip reports
- 📱 **WhatsApp Sharing** - Share settlement via WhatsApp
- 📈 **Category Analytics** - Visual breakdown with icons and progress bars
- 🌓 **Dark/Light Mode** - Beautiful theme switching
- 📱 **Mobile-First Design** - Fully responsive, optimized for all devices
- ⏱️ **Activity Timeline** - Track every action in the trip

---

## 🛠️ Tech Stack

### **Frontend**
<p>
<img src="https://img.shields.io/badge/React_18-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript" />
<img src="https://img.shields.io/badge/Zustand-FF6B6B?style=flat&logo=zustand&logoColor=white" alt="Zustand" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
<img src="https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white" alt="React Router" />
<img src="https://img.shields.io/badge/Recharts-FF6384?style=flat&logo=chart-dot-js&logoColor=white" alt="Recharts" />
<img src="https://img.shields.io/badge/PDF--lib-FF0000?style=flat&logo=adobe-acrobat-reader&logoColor=white" alt="PDF-lib" />
</p>

### **Backend**
<p>
<img src="https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express&logoColor=white" alt="Express" />
<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white" alt="MongoDB" />
<img src="https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white" alt="Mongoose" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript" />
</p>

### **AI & Services**
<p>
<img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=flat&logo=google&logoColor=white" alt="Gemini" />
<img src="https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white" alt="Axios" />
</p>

---

## 📁 Architecture Overview

```mermaid
graph TB
    A[Client - React + Vite] -->|API Calls| B[Express Backend]
    B -->|Data Storage| C[MongoDB]
    B -->|AI Processing| D[Google Gemini 2.5 Pro]
    B -->|Settlement Logic| E[Minimal Transaction Algorithm]
    A -->|State Management| F[Zustand Store]
    A -->|PDF Generation| G[PDF-lib]
    A -->|Charts| H[Recharts]
```

### **Frontend Architecture**
- **React 18** with Vite for fast development
- **Zustand** for lightweight state management
- **React Router** for navigation
- **TailwindCSS** for modern, responsive UI
- **Recharts** for beautiful data visualizations
- **PDF-lib** for trip report generation
- **React Hot Toast** for user notifications
- Mobile-first responsive design with bottom navigation

### **Backend Architecture**
- **Express.js** RESTful API
- **MongoDB + Mongoose** for flexible data modeling
- **Google Gemini 2.5 Pro** for AI-powered summaries
- Settlement algorithm for optimal transaction calculation
- Activity logging for trip timeline
- Pool balance validation and tracking
- All routes mounted under `/api`

---

## 📂 Project Structure

```
root
├─ 🔧 backend/
│  ├─ src/
│  │  ├─ 🎮 controllers/        # Route handlers
│  │  │  ├─ tripController.js
│  │  │  ├─ memberController.js
│  │  │  ├─ expenseController.js
│  │  │  ├─ settlementController.js
│  │  │  ├─ contributionController.js
│  │  │  └─ aiSummaryController.js
│  │  ├─ 📊 models/             # Mongoose schemas
│  │  │  ├─ Trip.js
│  │  │  ├─ Member.js
│  │  │  ├─ Expense.js
│  │  │  └─ AdvanceContribution.js
│  │  ├─ 🛣️ routes/             # Express routers
│  │  │  ├─ tripRoutes.js
│  │  │  ├─ memberRoutes.js
│  │  │  ├─ expenseRoutes.js
│  │  │  ├─ settlementRoutes.js
│  │  │  ├─ contributionRoutes.js
│  │  │  └─ aiSummaryRoutes.js
│  │  ├─ ⚙️ config/             # Database connection
│  │  │  └─ db.js
│  │  ├─ 🛠️ utils/              # Helper functions
│  │  │  ├─ calculateSettlement.js
│  │  │  └─ geminiPrompt.js
│  │  └─ server.js              # Application entry point
│  └─ package.json
│
└─ 💻 frontend/
   ├─ src/
   │  ├─ 🏪 context/            # Zustand store
   │  │  └─ tripStore.js
   │  ├─ 🎨 components/          # Reusable UI components
   │  │  ├─ layout/             # TopBar, BottomNav, Fab
   │  │  ├─ trip/                # TripCard, TripStats, CategoryBreakdown
   │  │  ├─ expenses/            # ExpenseForm, ExpenseList
   │  │  ├─ members/             # MemberList
   │  │  ├─ summary/             # SettlementList, ActivityTimeline, AISummary, PdfExportButton
   │  │  └─ pool/                # PoolSummary, ContributionForm
   │  ├─ 📄 pages/               # Route pages
   │  │  ├─ Home.jsx
   │  │  ├─ CreateTrip.jsx
   │  │  ├─ TripDashboard.jsx
   │  │  ├─ Members.jsx
   │  │  ├─ AddExpense.jsx
   │  │  ├─ Settlement.jsx
   │  │  ├─ Timeline.jsx
   │  │  └─ PoolManagement.jsx
   │  ├─ 🛠️ utils/               # Helper functions
   │  │  ├─ api.js               # Axios instance
   │  │  ├─ format.js            # Currency, date formatting
   │  │  └─ pdf.js               # PDF generation
   │  ├─ 🎣 hooks/               # Custom hooks
   │  │  └─ useDarkMode.js
   │  ├─ App.jsx                 # Main app component
   │  └─ main.jsx                # Entry point
   └─ package.json
```

---

## 🚀 End-to-End Setup

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- ![Node.js](https://img.shields.io/badge/Node.js-18+-43853D?style=flat&logo=node.js&logoColor=white) **Node.js 18+**
- ![MongoDB](https://img.shields.io/badge/MongoDB-Running-4EA94B?style=flat&logo=mongodb&logoColor=white) **MongoDB** (local or cloud)
- ![Google](https://img.shields.io/badge/Google_Gemini-API_Key-4285F4?style=flat&logo=google&logoColor=white) **Google Gemini API key** (for AI summaries)

---

### ⚙️ Backend Setup

1️⃣ **Navigate to backend directory and install dependencies:**
```bash
cd backend
npm install
```

2️⃣ **Create `.env` file** in `backend/` directory (see [Example .env Files](#-example-env-files) below)

3️⃣ **Start development server:**
```bash
npm run dev
```

4️⃣ **Expected output:**
```bash
✅ Connected to MongoDB
✅ Server running on port 5000
```

Routes will be available at: `http://localhost:5000/api/*`

---

### 💻 Frontend Setup

1️⃣ **Navigate to frontend directory and install dependencies:**
```bash
cd frontend
npm install
```

2️⃣ **Create `.env` file** in `frontend/` directory (see [Example .env Files](#-example-env-files) below)

3️⃣ **Start development server:**
```bash
npm run dev
```

4️⃣ **Open your browser:**
```
🌐 http://localhost:5173
```

---

## 📖 Usage Guide

### 🧳 Create a Trip

1. Click **"Create Trip"** on the home page
2. Enter trip name and start date
3. Add members to the trip
4. Start adding expenses!

---

### 💰 Add Expenses

**Multiple Split Types Available:**

1. **Equal Split** - Divide equally among all members
2. **Split Among Selected** - Choose specific members
3. **Percentage Split** - Assign percentage to each member
4. **Custom Split** - Manually set amount per member
5. **Each Person Pays Own** - Individual payments (excluded from settlement)

**Payment Sources:**
- **Paid by Member** - Normal expense, affects settlement
- **From Trip Pool** - Paid from shared fund, doesn't affect member balances

**Features:**
- Category selection (Travel, Food, Stay, Shopping, Misc)
- Date tracking
- Mark as settled to exclude from calculations
- Bulk settle/unsettle multiple expenses

---

### 🏦 Trip Pool Management

**Add Contributions:**
1. Navigate to Trip Dashboard → Click **"Manage"** on Pool card
2. Or go to `/trips/:tripId/pool`
3. Click **"Add Contribution"**
4. Select member, enter amount, date, and optional notes

**Pay from Pool:**
1. When adding expense, select **"From trip pool"** in Payment source
2. System validates available balance
3. Expense is marked as paid from pool
4. Pool balance updates automatically

**View Pool Summary:**
- **Dashboard**: Quick stats card
- **Settlement Page**: Full summary with returns
- **Pool Management**: Complete contribution history

**Returns Calculation:**
- After trip, remaining balance calculated
- Returns proportional to each member's contribution
- Shown in pool summary on Settlement page

---

### 📊 Settlement & Analytics

**Automatic Settlement:**
- System calculates who paid what vs who owes what
- Optimizes to minimal transactions
- Shows clear "who pays whom" instructions

**Category Breakdown:**
- Visual horizontal bar chart
- Icons and percentages
- Progress bars for easy comparison

**Trip Statistics:**
- Total spent
- Per person average
- Settlement status

---

### 🤖 AI-Powered Summary

**Powered by Google Gemini 2.5 Pro:**

1. Navigate to **Settlement** page
2. Click **"Generate AI Summary"**
3. AI analyzes:
   - All expenses and splits
   - Member balances
   - Settlement transactions
   - Trip pool management
   - Debt cancellations
4. Generates human-friendly explanation with:
   - Expense breakdown
   - Each person's share
   - Balances (give/take)
   - Final settlement steps
   - Pool returns (if applicable)

---

### 📄 Export & Share

**PDF Export:**
- Click **"Export PDF"** on Settlement page
- Generates complete trip report with:
  - Trip details
  - All expenses
  - Settlement summary
  - Member balances

**WhatsApp Sharing:**
- Click **"Share via WhatsApp"**
- Opens WhatsApp with formatted settlement message
- Easy sharing with trip members

---

### ⏱️ Activity Timeline

- View all trip activities:
  - Expense additions/edits/deletions
  - Member additions/removals
  - Contribution additions
  - Settlement updates
- Chronological timeline
- Easy to track trip history

---

## 📜 Scripts

### Backend Commands
```bash
npm run dev      # Start development server with nodemon
npm start        # Run production server
```

### Frontend Commands
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🔧 Example .env Files

### `backend/.env`
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/tripsplit

# Google Gemini AI (for AI summaries)
GEMINI_API_KEY=your_gemini_api_key_here

# CORS
FRONTEND_ORIGIN=http://localhost:5173
```

### `frontend/.env`
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

---

## 🎯 API Endpoints

### **Trips**
```
GET    /api/trips              # Get all trips
POST   /api/trips              # Create trip
GET    /api/trips/:id          # Get trip details
PUT    /api/trips/:id          # Update trip
DELETE /api/trips/:id          # Delete trip
```

### **Members**
```
GET    /api/members/:tripId           # Get trip members
POST   /api/members/:tripId           # Add member
DELETE /api/members/:tripId/:memberId  # Remove member
```

### **Expenses**
```
GET    /api/expenses/:tripId                    # Get trip expenses
POST   /api/expenses/:tripId                    # Add expense
PUT    /api/expenses/:tripId/:expenseId         # Update expense
DELETE /api/expenses/:tripId/:expenseId         # Delete expense
PATCH  /api/expenses/:tripId/:expenseId/settled  # Toggle settled status
```

### **Settlement**
```
GET    /api/settlement/:tripId  # Calculate settlement
```

### **Contributions (Trip Pool)**
```
GET    /api/contributions/:tripId                    # Get contributions
POST   /api/contributions/:tripId                    # Add contribution
GET    /api/contributions/:tripId/summary            # Get pool summary
DELETE /api/contributions/:tripId/:contributionId    # Delete contribution
```

### **AI Summary**
```
GET    /api/summary/ai/:tripId  # Generate AI summary
```

---

## 🐛 Troubleshooting

<details>
<summary><b>❌ MongoDB Connection Error</b></summary>

**Solution:**
- Ensure MongoDB is running locally or update `MONGO_URI` in `.env`
- For MongoDB Atlas, use connection string: `mongodb+srv://username:password@cluster.mongodb.net/tripsplit`
</details>

<details>
<summary><b>❌ CORS Error from Frontend</b></summary>

**Solution:**
- Ensure `FRONTEND_ORIGIN` in `backend/.env` matches your frontend URL
- Default: `http://localhost:5173`
- Restart backend server after changing `.env`
</details>

<details>
<summary><b>❌ AI Summary Timeout</b></summary>

**Solution:**
- Check your `GEMINI_API_KEY` is valid
- API calls have 60-second timeout
- Large trips may take longer - wait for response
- Check backend logs for detailed error messages
</details>

<details>
<summary><b>❌ Pool Balance Insufficient</b></summary>

**Solution:**
- Check current pool balance before paying from pool
- Add more contributions if needed
- Pool balance = Total Contributions - Total Spent from Pool
</details>

<details>
<summary><b>❌ Settlement Not Updating</b></summary>

**Solution:**
- Settlement recalculates automatically when expenses change
- Click refresh button on Settlement page
- Ensure expenses are not marked as "settled" if you want them included
- Pool payments are excluded from settlement (by design)
</details>

---

## 🔒 Security Notes

> **⚠️ Important Security Guidelines:**

- ❌ **Never commit** real API keys or secrets to version control
- ✅ Use `.env` files and add them to `.gitignore`
- 🔐 In production:
  - Use **HTTPS** for all communications
  - Configure proper **CORS** settings
  - Use environment-specific secrets
  - Implement rate limiting
  - Add input validation and sanitization
  - Use secure MongoDB connection strings

---

## 🎨 UI/UX Features

- **Mobile-First Design** - Optimized for all screen sizes
- **Dark Mode** - Beautiful theme switching
- **Toast Notifications** - User-friendly feedback for all actions
- **Bottom Navigation** - Easy mobile navigation
- **Floating Action Button** - Quick access to add expense
- **Responsive Cards** - Beautiful, modern card layouts
- **Loading States** - Smooth loading indicators
- **Error Handling** - Clear error messages

---

## 📊 Key Algorithms

### **Settlement Calculation**
- Calculates who paid what vs who owes what
- Optimizes to minimal transactions using greedy algorithm
- Handles debt cancellation automatically
- Excludes:
  - Expenses marked as "settled"
  - Expenses with "eachPaysOwn" split type
  - Expenses paid from trip pool

### **Pool Balance Tracking**
- Real-time balance = Contributions - Expenses from Pool
- Validates balance before allowing pool payments
- Calculates proportional returns based on contribution ratio

---

## 🚧 Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Real-time syncing with Socket.io
- [ ] Offline mode with PWA support
- [ ] Member profile image upload
- [ ] Recurring expenses
- [ ] Budget planning
- [ ] Multi-currency support
- [ ] Email reports
- [ ] Mobile app (React Native)

---

## 📄 License

Personal usage permitted. For commercial usage, follow the original project's license terms.

---

<div align="center">

### 🌟 If you find this project useful, please give it a star!

**Made with 💻 and ☕**

**Happy Trip Splitting! 🧳✈️**

</div>

