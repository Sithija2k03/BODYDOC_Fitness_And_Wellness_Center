import { transactions, incomes, expenses, dashboard, salary, logout, inventory, truck } from './icons';
const navItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/dashboard'
    },
    {
        id: 2,
        title: 'View Transactions',
        icon: transactions,
        link: '/transactions'
    },
    {
        id: 3,
        title: 'Incomes',
        icon: incomes,
        link: '/incomes'
    },
    {
        id: 4,
        title: 'Expenses',
        icon: expenses,
        link: '/expenses'
    },
    {
        id: 5,
        title: 'Salary Payments',
        icon: salary,
        link: '/salaries'
    },
    {
        id: 6,
        title: 'Inventory',
        icon: inventory,
        link: '/inventory'
    },
    {
        id: 7,
        title: 'Suppliers',
        icon: truck,
        link: '/suppliers'
    },
    {
        id: 8,
        title: 'Log Out',
        icon: logout,
        link: '/login'
    }
];

export default navItems; // ✅ Added default export
