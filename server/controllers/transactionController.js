const Transaction = require("../models/Transaction");

// Add Transaction
const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      amount,
      type,
      category,
      date,
    });

    res.status(201).json({
      success: true,
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Transactions
const getTransactions = async (req, res) => {
    try {
      const transactions = await Transaction.find({
        user: req.user.id,
      }).sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        count: transactions.length,
        transactions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// Update Transaction
const updateTransaction = async (req, res) => {
    try {
      let transaction = await Transaction.findById(req.params.id);
  
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found",
        });
      }
  
      // Check ownership
      if (transaction.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Not authorized",
        });
      }
  
      transaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
  
      res.status(200).json({
        success: true,
        transaction,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // Delete Transaction
const deleteTransaction = async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.params.id);
  
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found",
        });
      }
  
      // Check ownership
      if (transaction.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Not authorized",
        });
      }
  
      await Transaction.findByIdAndDelete(req.params.id);
  
      res.status(200).json({
        success: true,
        message: "Transaction deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  
module.exports = {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
  };