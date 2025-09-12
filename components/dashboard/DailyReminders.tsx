import React, { useMemo } from 'react';
import { Customer } from '../../types';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { BellIcon } from '../icons/BellIcon';
import { generateWhatsAppReminderUrl } from '../../utils/whatsapp';

interface DailyRemindersProps {
    customers: Customer[];
}

const DailyReminders: React.FC<DailyRemindersProps> = ({ customers }) => {
    
    const customersWithPendingBalance = useMemo(() => {
        return customers
            .filter(c => c.totalBalance > 0)
            .sort((a, b) => b.totalBalance - a.totalBalance);
    }, [customers]);

    const handleWhatsAppReminder = (customer: Customer) => {
        const url = generateWhatsAppReminderUrl(customer);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary mb-6">Daily Reminders</h1>
            <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-brand-text-primary flex items-center">
                        <BellIcon className="h-6 w-6 mr-3 text-yellow-500" />
                        Customers with Pending Balances
                    </h2>
                    <p className="text-sm text-brand-text-secondary mt-1">
                        Here is a list of all customers with an outstanding amount.
                    </p>
                </div>
                {customersWithPendingBalance.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {customersWithPendingBalance.map(customer => (
                            <li key={customer.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50">
                                <div className="mb-2 sm:mb-0">
                                    <p className="font-semibold text-brand-text-primary">{customer.name}</p>
                                    <p className="text-sm text-brand-text-secondary">
                                        Balance: <span className="font-bold text-red-500">PKR {customer.totalBalance.toLocaleString()}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleWhatsAppReminder(customer)}
                                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm"
                                >
                                    <WhatsAppIcon className="h-5 w-5 mr-2" />
                                    Send Detailed Reminder
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center p-10">
                        <p className="text-brand-text-secondary">
                            Great! No customers have a pending balance right now.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyReminders;