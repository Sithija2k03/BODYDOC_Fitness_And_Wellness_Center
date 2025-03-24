const { addIncome,getIncomes,deleteIncome } = require('../controllers/incomes')
const { addExpense,getExpenses,deleteExpenses } = require('../controllers/expenses')
const { createSalary, getAllSalaries, updateSalaryStatus, deleteSalary } = require('../controllers/salary');
const { getEmployeeByRole } = require('../controllers/userController');

const router = require('express').Router()

router.post('/add-income', addIncome)
      .get('/get-incomes', getIncomes)
      .delete('/delete-income/:id', deleteIncome)

      .post('/add-expense', addExpense)
      .get('/get-expenses', getExpenses)
      .delete('/delete-expense/:id', deleteExpenses)

      .post("/create", createSalary)
      .get('/salaries', getAllSalaries)
      .patch('/update-status/:salaryId', updateSalaryStatus)
      .delete('/salary-delete/:salaryId', deleteSalary)

      .get('/getEmployeeByRole', getEmployeeByRole);

module.exports = router