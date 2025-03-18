import { transactions, incomes, expenses,  dashboard, logout } from './icons';

export const navItems = [
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
        link: '/dashboard'
    },
    {
        id: 3,
        title: 'Incomes',
        icon: incomes,
        link: '/dashboard'
    },
    {
        id: 4,
        title: 'Expenses',
        icon: expenses,
        link: '/dashboard'
    },
    {
        id: 5,
        title: 'Log out',
        icon: logout,
        link: '/dashboard'
    }
];
