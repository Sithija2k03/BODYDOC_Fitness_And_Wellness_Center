const { addIncome } = require('../controllers/incomes')

const router = require('express').Router()

router.post('/add-income', addIncome)

module.exports = router