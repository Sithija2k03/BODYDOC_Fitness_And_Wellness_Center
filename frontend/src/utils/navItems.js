import { transactions, incomes, expenses, dashboard, salary, logout, inventory, truck,users, booking, doctor } from './icons';
const navItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/dashboard'
    },
    {
        id: 2,
        title: 'Registered Users',
        icon: users,
        link: '/transactions'
    },
    {
        id: 9,
        title: 'Facility Bookings',
        icon: booking,
        link: '/bookings'
    },
    {
        id: 10,
        title: 'Appointments',
        icon: doctor,
        link: '/appointment-display'
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
        link: '/supplier'
    },
    {
        id: 8,
        title: 'Log Out',
        icon: logout,
        link: '/login'
    }
];

export default navItems; // ✅ Added default export
