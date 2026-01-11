import Trip from '../models/Trip.js';
import Member from '../models/Member.js';
import Expense from '../models/Expense.js';
import AdvanceContribution from '../models/AdvanceContribution.js';
import calculateSettlement from '../utils/calculateSettlement.js';
import { generateGeminiPrompt } from '../utils/geminiPrompt.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Get AI-generated summary explanation for trip expenses and settlement
 */
export const getAISummary = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env file.',
      });
    }

    // Fetch trip data
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const members = await Member.find({ trip: tripId });
    const expenses = await Expense.find({ trip: tripId })
      .populate('paidBy', 'name')
      .populate('splits.member', 'name');
    const contributions = await AdvanceContribution.find({ trip: tripId })
      .populate('member', 'name');

    if (members.length === 0) {
      return res.status(400).json({
        message: 'No members found for this trip. Add members first.',
      });
    }

    if (expenses.length === 0) {
      return res.status(400).json({
        message: 'No expenses found for this trip. Add expenses first.',
      });
    }

    // Calculate settlement
    const { ledger, transactions } = calculateSettlement(members, expenses);

    const totals = {
      totalExpense: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      categoryWise: expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {}),
    };

    // Calculate pool summary
    const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
    const poolExpenses = expenses.filter((e) => e.paymentSource === 'tripPool');
    const totalSpentFromPool = poolExpenses.reduce((sum, e) => sum + e.amount, 0);
    const remainingBalance = totalContributions - totalSpentFromPool;

    const settlement = { ledger, transactions, totals };
    const poolSummary = {
      totalContributions,
      totalSpentFromPool,
      remainingBalance,
      contributions: contributions.map((c) => ({
        member: { name: c.member.name },
        amount: c.amount,
        date: c.date,
      })),
    };

    // Prepare data for Gemini
    const tripData = {
      trip: {
        name: trip.name,
        startDate: trip.startDate,
      },
      members: members.map(m => ({
        _id: m._id,
        name: m.name,
      })),
      expenses: expenses.map(exp => ({
        _id: exp._id,
        description: exp.description,
        amount: exp.amount,
        category: exp.category,
        date: exp.date,
        paidBy: exp.paidBy?._id || exp.paidBy,
        paidByName: exp.paidBy?.name || 'Unknown',
        paymentSource: exp.paymentSource || 'member',
        splitType: exp.splitType,
        splits: (exp.splits || []).map(split => ({
          member: split.member?._id || split.member,
          memberName: split.member?.name || 'Unknown',
          amount: split.amount,
          percentage: split.percentage,
        })),
      })),
      poolSummary,
      settlement: {
        ledger: ledger.map(entry => ({
          member: {
            _id: entry.member._id,
            name: entry.member.name,
          },
          paid: entry.paid,
          share: entry.share,
          balance: entry.balance,
        })),
        transactions: transactions,
      },
    };

    // Generate prompt
    const prompt = generateGeminiPrompt(tripData);

    // Initialize Gemini
    // Note: Valid model names: 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'
    // If 'gemini-2.5-pro' doesn't work, try 'gemini-1.5-pro' instead
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try gemini-2.5-pro first, fallback to gemini-1.5-pro if it fails
    let model;
    try {
      model = genAI.getGenerativeModel({ model:'gemini-2.5-flash-lite' });
    } catch (modelError) {
      console.warn('gemini-2.5-pro not available, falling back to gemini-1.5-pro');
      model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    }

    // Call Gemini API with timeout handling
    console.log('Calling Gemini API...');
    const startTime = Date.now();
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();
    
    const duration = Date.now() - startTime;
    console.log(`Gemini API call completed in ${duration}ms`);

    // Return AI summary
    res.json({
      success: true,
      summary: aiText,
      trip: {
        name: trip.name,
        totalExpense: totals.totalExpense,
        memberCount: members.length,
        expenseCount: expenses.length,
      },
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Handle specific Gemini API errors
    if (error.message?.includes('API key')) {
      return res.status(401).json({
        message: 'Invalid Gemini API key. Please check your GEMINI_API_KEY in .env file.',
      });
    }

    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return res.status(429).json({
        message: 'Gemini API rate limit exceeded. Please try again later.',
      });
    }

    next(error);
  }
};

export default { getAISummary };

