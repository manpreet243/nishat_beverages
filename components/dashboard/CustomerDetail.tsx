// Implemented the CustomerDetail component.
import React from 'react';
import { Customer, SaleRecord, Salesman, BottleLog } from '../../types';
import { TruckIcon } from '../icons/TruckIcon';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { generateWhatsAppReminderUrl, generateWhatsAppMessageText } from '../../utils/whatsapp';

interface CustomerDetailProps {
    customer: Customer;
    salesHistory: SaleRecord[];
    bottleLogs: BottleLog[];
    salesmen: Salesman[];
    onBack: () => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, salesHistory, bottleLogs, salesmen, onBack }) => {
    
    const getUnpaidBottles = (c: Customer) => {
        return c.bottlesPurchased - c.paidBottles;
    };

    const salesmanName = customer.salesmanId 
        ? salesmen.find(s => s.id === customer.salesmanId)?.name || 'Unknown' 
        : 'Unassigned';

    const handleSendReminder = () => {
        const url = generateWhatsAppReminderUrl(customer);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="printable-area bg-brand-surface rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text-primary">{customer.name}</h1>
                    <p className="text-brand-text-secondary">
                        {`House: ${customer.houseNumber}, Floor: ${customer.floor}, Flat: ${customer.flat}`}
                    </p>
                    <p className="text-brand-text-secondary">Mobile: {customer.mobile}</p>
                    <p className="text-brand-text-secondary mt-1 flex items-center">
                        <TruckIcon className="h-4 w-4 mr-2 text-gray-400"/> 
                        Assigned Salesman: <span className="font-semibold ml-1">{salesmanName}</span>
                    </p>
                </div>
                <button onClick={onBack} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300 no-print">
                    &larr; Back to Customers
                </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 text-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-brand-text-secondary">Total Balance</p>
                    <p className="text-2xl font-semibold text-red-600">PKR {customer.totalBalance.toLocaleString()}</p>
                </div>
                 <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-brand-text-secondary">Bottles Purchased</p>
                    <p className="text-2xl font-semibold text-brand-text-primary">{customer.bottlesPurchased}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-brand-text-secondary">Paid Bottles</p>
                    <p className="text-2xl font-semibold text-green-600">{customer.paidBottles}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-brand-text-secondary">Unpaid Bottles</p>
                    <p className="text-2xl font-semibold text-yellow-600">{getUnpaidBottles(customer)}</p>
                </div>
                 <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-brand-text-secondary">Empty Bottles Out</p>
                    <p className="text-2xl font-semibold text-blue-600">{customer.emptyBottlesOnHand}</p>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 flex justify-end items-center bg-gray-50 no-print mb-8 rounded-lg">
                <button 
                    onClick={handleSendReminder}
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                    <WhatsAppIcon className="h-5 w-5 mr-2" />
                    Send Reminder via WhatsApp
                </button>
            </div>

            {/* History Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Transaction History */}
                 <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-50">
                        <h2 className="text-xl font-bold text-brand-text-primary">Transaction History</h2>
                    </div>
                    <div className="overflow-x-auto max-h-96">
                         <table className="w-full text-sm text-left text-brand-text-secondary">
                            <thead className="text-xs text-brand-text-secondary uppercase bg-gray-100 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Bottles Sold</th>
                                    <th scope="col" className="px-6 py-3">Amount Received (PKR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesHistory.length > 0 ? (
                                    salesHistory.map((sale) => (
                                        <tr key={sale.id} className="bg-white border-b last:border-b-0">
                                            <td className="px-6 py-4">{new Date(sale.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
                                            <td className="px-6 py-4">{sale.bottlesSold}</td>
                                            <td className="px-6 py-4 font-semibold">{sale.amountReceived.toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-10 px-6 text-brand-text-secondary">
                                            No transaction history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottle Log History */}
                 <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-50">
                        <h2 className="text-xl font-bold text-brand-text-primary">Empty Bottle Log</h2>
                    </div>
                    <div className="overflow-x-auto max-h-96">
                         <table className="w-full text-sm text-left text-brand-text-secondary">
                            <thead className="text-xs text-brand-text-secondary uppercase bg-gray-100 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Taken</th>
                                    <th scope="col" className="px-6 py-3">Returned</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bottleLogs.length > 0 ? (
                                    bottleLogs.map((log) => (
                                        <tr key={log.id} className="bg-white border-b last:border-b-0">
                                            <td className="px-6 py-4">{new Date(log.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
                                            <td className="px-6 py-4 font-semibold text-red-600">{log.bottlesTaken}</td>
                                            <td className="px-6 py-4 font-semibold text-green-600">{log.bottlesReturned}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-10 px-6 text-brand-text-secondary">
                                            No bottle transaction history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Reminder Preview for PDF */}
            <div className="mt-8">
                <h3 className="text-xl font-bold text-brand-text-primary mb-2">WhatsApp Reminder Preview</h3>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-brand-text-secondary font-sans">{generateWhatsAppMessageText(customer)}</pre>
                </div>
            </div>

        </div>
    );
};

export default CustomerDetail;