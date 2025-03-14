const { addIncome,getIncomes,deleteIncome } = require('../controllers/incomes')
const { addExpense,getExpenses,deleteExpenses } = require('../controllers/expenses')

const router = require('express').Router()

router.post('/add-income', addIncome)
      .get('/get-incomes', getIncomes)
      .delete('/delete-income/:id', deleteIncome)

      .post('/add-expense', addExpense)
      .get('/get-expenses', getExpenses)
      .delete('/delete-expense/:id', deleteExpenses)

module.exports = router