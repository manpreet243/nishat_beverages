// Implemented the AddSaleModal component.
import React, { useState, useEffect } from 'react';
import { Customer, Salesman } from '../../types';

interface AddSaleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSale: (saleData: {
        customerId: number;
        customerName: string;
        bottlesSold: number;
        amountReceived: number;
        updateBalance: boolean;
        salesmanId?: number;
        bottlesReturned: number;
    }) => void;
    customer: Customer | null;
    salesmen: Salesman[];
    bottlePrice: number;
}

const AddSaleModal: React.FC<AddSaleModalProps> = ({ isOpen, onClose, onAddSale, customer, salesmen, bottlePrice }) => {
    const [bottlesSold, setBottlesSold] = useState(1);
    const [amountReceived, setAmountReceived] = useState(0);
    const [bottlesReturned, setBottlesReturned] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [updateBalance, setUpdateBalance] = useState(true);
    const [salesmanId, setSalesmanId] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (customer) {
            const cost = bottlesSold * bottlePrice;
            setTotalCost(cost);
        }
    }, [customer, bottlesSold, bottlePrice]);
    
    useEffect(() => {
        if (isOpen && customer) {
             const initialBottles = customer.dailyRequirement || 1;
             setBottlesSold(initialBottles);
             const cost = initialBottles * bottlePrice;
             setTotalCost(cost);
             setAmountReceived(cost);
             setUpdateBalance(true);
             setSalesmanId(customer.salesmanId);
             setBottlesReturned(0);
        }
    }, [isOpen, customer, bottlePrice]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customer) {
            onAddSale({
                customerId: customer.id,
                customerName: customer.name,
                bottlesSold,
                amountReceived,
                updateBalance,
                salesmanId,
                bottlesReturned,
            });
            onClose();
        }
    };

    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Add Sale</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                 <p className="text-brand-text-secondary mb-6">For: <span className="font-semibold text-brand-blue">{customer.name}</span></p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="bottles-sold" className="block text-sm font-medium text-brand-text-secondary">Bottles Sold</label>
                        <input type="number" id="bottles-sold" value={bottlesSold} onChange={e => setBottlesSold(Number(e.target.value))} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                     <div className="p-3 bg-gray-50 rounded-md text-center">
                        <p className="text-sm text-brand-text-secondary">Total Cost ({bottlePrice} PKR/bottle)</p>
                        <p className="text-2xl font-bold text-brand-text-primary">PKR {totalCost.toLocaleString()}</p>
                    </div>
                    <div>
                        <label htmlFor="amount-received" className="block text-sm font-medium text-brand-text-secondary">Amount Received (PKR)</label>
                        <input type="number" id="amount-received" value={amountReceived} onChange={e => setAmountReceived(Number(e.target.value))} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="bottles-returned" className="block text-sm font-medium text-brand-text-secondary">Empty Bottles Returned</label>
                        <input type="number" id="bottles-returned" value={bottlesReturned} onChange={e => setBottlesReturned(Number(e.target.value))} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="salesman" className="block text-sm font-medium text-brand-text-secondary">Salesman</label>
                        <select
                            id="salesman"
                            value={salesmanId || ''}
                            onChange={e => setSalesmanId(e.target.value ? Number(e.target.value) : undefined)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                        >
                            <option value="">None</option>
                            {salesmen.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                     <div className="flex items-center">
                        <input type="checkbox" id="update-balance" checked={updateBalance} onChange={e => setUpdateBalance(e.target.checked)} className="h-4 w-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue" />
                        <label htmlFor="update-balance" className="ml-2 block text-sm text-brand-text-secondary">Update customer's total balance with this transaction</label>
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">Add Sale</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSaleModal;