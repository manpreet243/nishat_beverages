import React from 'react';
import { Expense } from '../../types';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';

interface ExpensesProps {
    expenses: Expense[];
    onAddExpense: () => void;
    onEditExpense: (expense: Expense) => void;
}

const Expenses: React.FC<ExpensesProps> = ({ expenses, onAddExpense, onEditExpense }) => {
    return (
        <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-gray-200">
                <h2 className="text-xl font-bold text-brand-text-primary">Expenses Management</h2>
                <button
                    onClick={onAddExpense}
                    className="flex items-center bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-lightblue transition-colors"
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add Expense
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-brand-text-secondary">
                    <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Description</th>
                            <th scope="col" className="px-6 py-3">Amount (PKR)</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length > 0 ? (
                            expenses.map((expense) => (
                                <tr key={expense.id} className="bg-white border-b">
                                    <td className="px-6 py-4">{expense.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-brand-text-primary">{expense.description}</td>
                                    <td className="px-6 py-4 font-semibold">{expense.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => onEditExpense(expense)} className="font-medium text-brand-blue hover:underline">Edit</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 px-6 text-brand-text-secondary">
                                    No expenses recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Expenses;
