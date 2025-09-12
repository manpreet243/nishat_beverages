import React from 'react';
import { Customer, Salesman } from '../../types';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { EditIcon } from '../icons/EditIcon';
import { TruckIcon } from '../icons/TruckIcon';

interface CustomerTableProps {
    customers: Customer[];
    salesmen: Salesman[];
    onAddCustomer: () => void;
    onAddSale: (customer: Customer) => void;
    onViewDetails: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, salesmen, onAddCustomer, onAddSale, onViewDetails, onDelete, onEdit }) => {
    
    const getUnpaidBottles = (customer: Customer) => {
        return customer.bottlesPurchased - customer.paidBottles;
    };

    const getSalesmanName = (salesmanId?: number) => {
        if (!salesmanId) return 'Unassigned';
        return salesmen.find(s => s.id === salesmanId)?.name || 'Unknown';
    }

    return (
        <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-gray-200">
                <h2 className="text-xl font-bold text-brand-text-primary">All Clients</h2>
                <button 
                  onClick={onAddCustomer}
                  className="flex items-center bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-lightblue transition-colors"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Add Customer
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-brand-text-secondary">
                    <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Customer Name</th>
                            <th scope="col" className="px-6 py-3">Bottles Purchased</th>
                            <th scope="col" className="px-6 py-3">Paid Bottles</th>
                            <th scope="col" className="px-6 py-3">Unpaid Bottles</th>
                            <th scope="col" className="px-6 py-3">Total Balance (PKR)</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 ? (
                            customers.map((customer) => (
                                <tr key={customer.id} className={`border-b ${customer.deliveryDueToday ? 'bg-red-50' : 'bg-white'}`}>
                                    <th scope="row" className="px-6 py-4 font-medium text-brand-text-primary whitespace-nowrap">
                                        <div className="flex items-center">
                                          {customer.name}
                                          {customer.deliveryDueToday && <span className="ml-2 text-xs font-semibold text-red-700 bg-red-200 px-2 py-0.5 rounded-full">Due Today</span>}
                                        </div>
                                        <div className="text-xs text-brand-text-secondary">House: {customer.houseNumber}, Floor: {customer.floor}, Flat: {customer.flat}</div>
                                        <div className="text-xs text-brand-text-secondary mt-1 flex items-center">
                                            <TruckIcon className="h-4 w-4 mr-1.5 text-gray-400"/>
                                            {getSalesmanName(customer.salesmanId)}
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">{customer.bottlesPurchased}</td>
                                    <td className="px-6 py-4">{customer.paidBottles}</td>
                                    <td className="px-6 py-4">{getUnpaidBottles(customer)}</td>
                                    <td className="px-6 py-4 font-semibold">{customer.totalBalance.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        {customer.totalBalance > 0 ? (
                                            <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Pending</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Paid</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 flex items-center space-x-2">
                                        <button onClick={() => onViewDetails(customer)} className="font-medium text-blue-600 hover:underline">Details</button>
                                        <button onClick={() => onEdit(customer)} title="Edit Customer" className="text-brand-blue hover:text-brand-lightblue">
                                            <EditIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => onAddSale(customer)} className="font-medium text-green-600 hover:underline">Add Sale</button>
                                        <button onClick={() => onDelete(customer)} title="Delete Customer" className="text-red-500 hover:text-red-700">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-10 px-6 text-brand-text-secondary">
                                    No customers found. Try adjusting your search or filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerTable;