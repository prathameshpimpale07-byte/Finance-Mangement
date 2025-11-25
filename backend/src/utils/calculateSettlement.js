const toNumber = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

export const calculateSettlement = (members = [], expenses = []) => {
  const ledger = {};

  members.forEach((member) => {
    ledger[member._id?.toString()] = {
      member,
      paid: 0,
      share: 0,
      balance: 0,
    };
  });

  expenses.forEach((expense) => {
    // Skip 'eachPaysOwn' expenses from settlement calculation
    // Each person already paid their own share, so no settlement needed
    if (expense.splitType === 'eachPaysOwn') {
      return;
    }
    
    // Skip settled expenses - they've already been paid
    if (expense.settled) {
      return;
    }
    
    // Skip expenses paid from trip pool - they don't affect member balances
    if (expense.paymentSource === 'tripPool') {
      return;
    }
    
    const payerId = expense.paidBy?.toString();
    if (!ledger[payerId]) return;
    ledger[payerId].paid += expense.amount;
    (expense.splits || []).forEach((split) => {
      const memberId = split.member?.toString();
      if (!ledger[memberId]) return;
      ledger[memberId].share += split.amount;
    });
  });

  const creditors = [];
  const debtors = [];

  Object.values(ledger).forEach((entry) => {
    entry.balance = toNumber(entry.paid - entry.share);
    if (entry.balance > 0) creditors.push(entry);
    else if (entry.balance < 0) debtors.push(entry);
  });

  const transactions = [];

  creditors.sort((a, b) => b.balance - a.balance);
  debtors.sort((a, b) => a.balance - b.balance);

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(
      Math.abs(debtor.balance),
      Math.abs(creditor.balance)
    );

    if (amount > 0.01) {
      transactions.push({
        from: debtor.member.name,
        to: creditor.member.name,
        amount: toNumber(amount),
      });
    }

    debtor.balance = toNumber(debtor.balance + amount);
    creditor.balance = toNumber(creditor.balance - amount);

    if (Math.abs(debtor.balance) < 0.01) i += 1;
    if (Math.abs(creditor.balance) < 0.01) j += 1;
  }

  return {
    ledger: Object.values(ledger),
    transactions,
  };
};

export default calculateSettlement;

