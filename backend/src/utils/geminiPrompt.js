/**
 * Generates a comprehensive prompt for Gemini 2.5 Pro to explain trip expenses and settlements
 */
export const generateGeminiPrompt = (tripData) => {
  const { trip, members, expenses, settlement } = tripData;

  const prompt = `You are an expert financial analyst explaining trip expense settlements in a clear, friendly manner.

## TRIP INFORMATION
Trip Name: ${trip.name}
Start Date: ${new Date(trip.startDate).toLocaleDateString()}
Total Members: ${members.length}

## MEMBERS
${members.map((m, i) => `${i + 1}. ${m.name}`).join('\n')}

## TRIP POOL SUMMARY
${tripData.poolSummary ? `
Total Contributions: ₹${tripData.poolSummary.totalContributions}
Total Spent from Pool: ₹${tripData.poolSummary.totalSpentFromPool}
Remaining Balance: ₹${tripData.poolSummary.remainingBalance}

Contributions:
${tripData.poolSummary.contributions.map(c => `  - ${c.member.name}: ₹${c.amount} on ${new Date(c.date).toLocaleDateString()}`).join('\n')}
` : 'No trip pool contributions.'}

## EXPENSES BREAKDOWN
${expenses.map((exp, i) => {
  const splits = exp.splits || [];
  const splitDetails = splits.map(s => {
    const memberName = s.memberName || exp.memberName || 'Unknown';
    if (exp.splitType === 'percentage') {
      return `  - ${memberName}: ${s.percentage}% (₹${s.amount})`;
    }
    return `  - ${memberName}: ₹${s.amount}`;
  }).join('\n');
  
  const paymentInfo = exp.paymentSource === 'tripPool'
    ? 'Paid from: Trip Pool (shared fund)'
    : `Paid by: ${exp.paidByName || 'Unknown'}`;
  
  return `Expense ${i + 1}: ${exp.description}
  Amount: ₹${exp.amount}
  Category: ${exp.category}
  Date: ${new Date(exp.date).toLocaleDateString()}
  ${paymentInfo}
  Split Type: ${exp.splitType}
  Split Details:
${splitDetails || '  - No splits defined'}`;
}).join('\n\n')}

## CALCULATED SETTLEMENT DATA
${settlement.ledger.map(entry => {
  const member = entry.member;
  return `${member.name}:
  - Total Paid: ₹${entry.paid}
  - Total Share: ₹${entry.share}
  - Balance: ₹${entry.balance} ${entry.balance >= 0 ? '(should receive)' : '(owes)'}`;
}).join('\n\n')}

## FINAL TRANSACTIONS (Optimized Settlement)
${settlement.transactions.length > 0 
  ? settlement.transactions.map((tx, i) => `${i + 1}. ${tx.from} → ${tx.to}: ₹${tx.amount}`).join('\n')
  : 'All expenses are already settled! No payments needed.'}

---

## YOUR TASK:
Explain this trip's expense settlement in the EXACT format shown in the example below. DO NOT recalculate the math - just EXPLAIN the calculations that have already been done.

### EXAMPLE FORMAT (Follow this style exactly):

**Members:** Jeevan, Nagesh, Rohit, Akshay

**Expense 1:**
- ₹400 dinner paid by Jeevan
- Split equally among 4 → each owes ₹100
- Jeevan paid 400 but owes 100 → he should receive ₹300

**Expense 2:**
- ₹380 snacks paid by Nagesh
- Split equally among 4 → each owes ₹95
- Nagesh paid 380 but owes 95 → he should receive ₹285

**Now cancellation logic:**
- Nagesh owes Jeevan ₹100 (from dinner)
- Jeevan owes Nagesh ₹95 (from snacks)

**Net:**
- Nagesh → Jeevan : ₹5

**Final settlement:**
Nagesh → Jeevan : ₹5
Rohit → Jeevan : ₹100
Akshay → Jeevan : ₹100
Rohit → Nagesh : ₹95
Akshay → Nagesh : ₹95

---

## REQUIRED OUTPUT FORMAT:

Generate your explanation with these sections:

### 1. **Trip Pool Summary** (if applicable)
Explain total contributions, how much was spent from pool, remaining balance, and return per member.

### 2. **Expense Breakdown**
Explain each expense, who paid (or if from pool), and how it was split.

### 3. **Each Person's Share**
Show what each member paid vs what they owe (excluding pool payments).

### 4. **Balances (Give / Take)**
List who should receive money and who owes money.

### 5. **Debt Cancellation** (if applicable)
Explain how mutual debts cancel each other out.

### 6. **Final Settlement Steps**
List the optimized payment instructions.

### 7. **Pool Returns** (if applicable)
Explain how remaining pool balance will be returned to members.

### 8. **Easy-to-read Summary Paragraph**
A friendly 2-3 sentence summary in plain English.

---

IMPORTANT:
- Use the EXACT calculations provided (do not recalculate)
- Explain the logic clearly
- Use simple, friendly language
- Format with clear sections and bullet points
- Use ₹ symbol for currency
- Be concise but thorough`;

  return prompt;
};

export default generateGeminiPrompt;

