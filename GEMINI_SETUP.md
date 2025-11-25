# Google Gemini AI Integration Setup Guide

## 📍 Where to Add Your Gemini API Key

### Step 1: Get Your API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Add to Backend Environment
Create a `.env` file in the `backend/` directory (if it doesn't exist) and add:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**File Location:** `backend/.env`

**Example:**
```env
MONGO_URI=mongodb://127.0.0.1:27017/tripsplit
PORT=5000
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Restart Backend Server
After adding the API key, restart your backend server:
```bash
cd backend
npm run dev
```

---

## 🎯 How It Works

### Backend Endpoint
- **Route:** `GET /api/summary/ai/:tripId`
- **Controller:** `backend/src/controllers/aiSummaryController.js`
- **Prompt Generator:** `backend/src/utils/geminiPrompt.js`

### Frontend Component
- **Component:** `frontend/src/components/summary/AISummary.jsx`
- **Location:** Settlement/Summary page
- **Usage:** Click "Generate" button to get AI explanation

---

## 📋 What the AI Does

The Gemini AI analyzes:
1. ✅ All trip expenses
2. ✅ All members
3. ✅ All payment splits
4. ✅ Calculated balances
5. ✅ Settlement transactions

And generates:
- 📊 Expense breakdown explanation
- 💰 Each person's share calculation
- ⚖️ Balance summary (who owes/receives)
- 🔄 Debt cancellation logic
- 📝 Final settlement steps
- 📄 Human-friendly summary paragraph

---

## 🔧 Configuration

### Model Used
Currently using: `gemini-1.5-pro`

To change the model, edit `backend/src/controllers/aiSummaryController.js`:
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
```

**Available Models:**
- `gemini-1.5-pro` (Recommended - most capable)
- `gemini-1.5-flash` (Faster, cheaper)
- `gemini-2.0-flash-exp` (Experimental)

---

## 🚨 Error Handling

The system handles:
- ❌ Missing API key → Shows helpful error message
- ❌ Invalid API key → Returns 401 error
- ❌ Rate limits → Returns 429 error with retry suggestion
- ❌ No expenses/members → Returns 400 error with guidance

---

## 📝 Example API Response

```json
{
  "success": true,
  "summary": "**Expense Breakdown**\n\nExpense 1: ₹400 dinner...",
  "trip": {
    "name": "Goa Trip",
    "totalExpense": 5000,
    "memberCount": 4,
    "expenseCount": 5
  }
}
```

---

## ✅ Testing

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Navigate to a trip's Settlement page
4. Click "Generate" in the AI Summary section
5. Wait for AI analysis (5-10 seconds)
6. Read the generated explanation!

---

## 🔒 Security Note

**NEVER commit your `.env` file to Git!**

The `.env` file is already in `.gitignore`. Keep your API key secret and never share it publicly.

