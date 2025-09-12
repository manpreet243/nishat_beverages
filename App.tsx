
import React, { useState, useMemo, useEffect } from 'react';
import { View, Customer, Salesman, SaleRecord, Expense, InventoryItem, BottleLog, SalesmanPayment, StockAdjustment } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { BOTTLE_PRICE as DEFAULT_BOTTLE_PRICE } from './constants';
import { showToast } from './utils/toast';
import { mockCustomers, mockSalesmen, mockSales, mockExpenses, mockInventory, mockBottleLogs, mockSalesmanPayments, mockStockAdjustments } from './mockData';

// Component Imports
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import CustomerTable from './components/dashboard/CustomerTable';
import CustomerFilters from './components/dashboard/CustomerFilters';
import DailySales from './components/dashboard/DailySales';
import Expenses from './components/dashboard/Expenses';
import Inventory from './components/dashboard/Inventory';
import DeliverySchedule from './components/dashboard/DeliverySchedule';
import DailyReminders from './components/dashboard/DailyReminders';
import BottleTracking from './components/dashboard/BottleTracking';
import Salesmen from './components/salesmen/Salesmen';
import Reports from './components/dashboard/Reports';
import ClosingReport from './components/dashboard/ClosingReport';
import Settings from './components/dashboard/Settings';
import CustomerDetail from './components/dashboard/CustomerDetail';
import InventoryItemDetail from './components/inventory/InventoryItemDetail';
import SalesmanReport from './components/salesmen/SalesmanReport';

// Auth Components
import LoginChooser from './components/auth/LoginChooser';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import SalesmanLogin from './components/auth/SalesmanLogin';
import SalesmanDashboard from './components/salesman_dashboard/SalesmanDashboard';

// Modal Imports
import AddCustomerModal from './components/customer/AddCustomerModal';
import EditCustomerModal from './components/customer/EditCustomerModal';
import DeleteCustomerModal from './components/customer/DeleteCustomerModal';
import AddSaleModal from './components/customer/AddSaleModal';
import AddExpenseModal from './components/expenses/AddExpenseModal';
import EditExpenseModal from './components/expenses/EditExpenseModal';
import AddInventoryItemModal from './components/inventory/AddInventoryItemModal';
import EditInventoryItemModal from './components/inventory/EditInventoryItemModal';
import AdjustStockModal from './components/inventory/AdjustStockModal';
import DeleteInventoryItemModal from './components/inventory/DeleteInventoryItemModal';
import EditScheduleModal from './components/customer/EditScheduleModal';
import AdjustEmptyBottlesModal from './components/customer/AdjustEmptyBottlesModal';
import AddSalesmanModal from './components/salesmen/AddSalesmanModal';
import AddSalesmanPaymentModal from './components/salesmen/AddSalesmanPaymentModal';
import AddCounterSaleModal from './components/dashboard/AddCounterSaleModal';
import EditSaleModal from './components/sales/EditSaleModal';
import DeleteSaleModal from './components/sales/DeleteSaleModal';

type AuthStatus = 'chooser' | 'admin-login' | 'salesman-login' | 'signup' | 'logged-in';
type UserType = 'admin' | 'salesman';

const App: React.FC = () => {
    // Authentication State
    const [authStatus, setAuthStatus] = useState<AuthStatus>('chooser');
    const [userType, setUserType] = useState<UserType | null>(null);
    const [loggedInSalesman, setLoggedInSalesman] = useState<Salesman | null>(null);

    // Data State using Local Storage
    const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', mockCustomers);
    const [salesmen, setSalesmen] = useLocalStorage<Salesman[]>('salesmen', mockSalesmen);
    const [sales, setSales] = useLocalStorage<SaleRecord[]>('sales', mockSales);
    const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', mockExpenses);
    const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('inventory', mockInventory);
    const [bottleLogs, setBottleLogs] = useLocalStorage<BottleLog[]>('bottleLogs', mockBottleLogs);
    const [salesmanPayments, setSalesmanPayments] = useLocalStorage<SalesmanPayment[]>('salesmanPayments', mockSalesmanPayments);
    const [stockAdjustments, setStockAdjustments] = useLocalStorage<StockAdjustment[]>('stockAdjustments', mockStockAdjustments);
    const [bottlePrice, setBottlePrice] = useLocalStorage<number>('bottlePrice', DEFAULT_BOTTLE_PRICE);

    // UI State
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);
    const [selectedSalesman, setSelectedSalesman] = useState<Salesman | null>(null);

    // Modal States
    const [isAddCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
    const [isEditCustomerModalOpen, setEditCustomerModalOpen] = useState(false);
    const [isDeleteCustomerModalOpen, setDeleteCustomerModalOpen] = useState(false);
    const [isAddSaleModalOpen, setAddSaleModalOpen] = useState(false);
    const [isAddExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
    const [isEditExpenseModalOpen, setEditExpenseModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [isAddInventoryItemModalOpen, setAddInventoryItemModalOpen] = useState(false);
    const [isEditInventoryItemModalOpen, setEditInventoryItemModalOpen] = useState(false);
    const [isAdjustStockModalOpen, setAdjustStockModalOpen] = useState(false);
    const [isDeleteInventoryItemModalOpen, setDeleteInventoryItemModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
    const [isEditScheduleModalOpen, setEditScheduleModalOpen] = useState(false);
    const [isAdjustBottlesModalOpen, setAdjustBottlesModalOpen] = useState(false);
    const [isAddSalesmanModalOpen, setAddSalesmanModalOpen] = useState(false);
    const [isAddSalesmanPaymentModalOpen, setAddSalesmanPaymentModalOpen] = useState(false);
    const [isAddCounterSaleModalOpen, setAddCounterSaleModalOpen] = useState(false);
    const [isEditSaleModalOpen, setEditSaleModalOpen] = useState(false);
    const [editingSale, setEditingSale] = useState<SaleRecord | null>(null);
    const [isDeleteSaleModalOpen, setDeleteSaleModalOpen] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState<SaleRecord | null>(null);

    // Customer Filters State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');
    const [dueFilter, setDueFilter] = useState(false);

    // Derived State for Customers View
    const filteredCustomers = useMemo(() => {
        return customers
            .filter(c => {
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch =
                    c.name.toLowerCase().includes(searchLower) ||
                    c.mobile.includes(searchTerm) ||
                    c.totalBalance.toString().includes(searchTerm) ||
                    c.bottlesPurchased.toString().includes(searchTerm);

                const matchesStatus =
                    statusFilter === 'all' ||
                    (statusFilter === 'pending' && c.totalBalance > 0) ||
                    (statusFilter === 'paid' && c.totalBalance <= 0);

                const matchesDue = !dueFilter || c.deliveryDueToday;

                return matchesSearch && matchesStatus && matchesDue;
            })
            .sort((a, b) => b.id - a.id);
    }, [customers, searchTerm, statusFilter, dueFilter]);

    // Handlers
    const handleLogin = (type: UserType, salesman?: Salesman) => {
        setAuthStatus('logged-in');
        setUserType(type);
        if (type === 'salesman' && salesman) {
            setLoggedInSalesman(salesman);
        }
        setActiveView('dashboard');
    };

    const handleLogout = () => {
        setAuthStatus('chooser');
        setUserType(null);
        setLoggedInSalesman(null);
    };

    const handleNavigate = (view: View) => {
        setActiveView(view);
        setSelectedCustomer(null);
        setSelectedInventoryItem(null);
        setSelectedSalesman(null);
    };

    // Customer Handlers
    const handleAddCustomer = (customerData: Omit<Customer, 'id' | 'bottlesPurchased' | 'paidBottles' | 'totalBalance' | 'deliveryDueToday' | 'deliveryDays' | 'emptyBottlesOnHand'>) => {
        const newCustomer: Customer = {
            ...customerData,
            id: Date.now(),
            bottlesPurchased: 0,
            paidBottles: 0,
            totalBalance: 0,
            deliveryDueToday: false, // Default value
            deliveryDays: [],
            emptyBottlesOnHand: 0,
        };
        setCustomers(prev => [...prev, newCustomer]);
        showToast('Customer added successfully!', 'success');
    };

    const handleUpdateCustomer = (updatedCustomer: Customer) => {
        setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
        setEditCustomerModalOpen(false);
        showToast('Customer updated!', 'success');
    };

    const handleDeleteCustomer = () => {
        if (selectedCustomer) {
            const customerId = selectedCustomer.id;
            setCustomers(prev => prev.filter(c => c.id !== customerId));
            setSales(prev => prev.filter(s => s.customerId !== customerId));
            setBottleLogs(prev => prev.filter(b => b.customerId !== customerId));
            setDeleteCustomerModalOpen(false);
            setSelectedCustomer(null);
            showToast('Customer and all related data deleted!', 'success');
        }
    };
    
    // Sale Handlers
    const handleAddSale = (saleData: { customerId: number; customerName: string; bottlesSold: number; amountReceived: number; updateBalance: boolean; salesmanId?: number; bottlesReturned: number; }) => {
        const { customerId, bottlesSold, amountReceived, updateBalance, bottlesReturned, customerName } = saleData;

        // Inventory Check
        const bottleItem = inventory.find(i => i.name.includes('19-Liter'));
        if (!bottleItem || bottleItem.stock < bottlesSold) {
            showToast(`Insufficient stock! Only ${bottleItem?.stock || 0} bottles available.`, 'error');
            setAddSaleModalOpen(false);
            return;
        }

        // Deduct from inventory and create stock adjustment log
        if (bottleItem && bottlesSold > 0) {
            const newStock = bottleItem.stock - bottlesSold;
            setInventory(prev => prev.map(i => i.id === bottleItem.id ? { ...i, stock: newStock } : i));
            const newAdjustment: StockAdjustment = { id: Date.now(), itemId: bottleItem.id, date: new Date().toISOString().split('T')[0], quantityChange: -bottlesSold, reason: `Sale to ${customerName}`, adjustedBy: 'System' };
            setStockAdjustments(prev => [newAdjustment, ...prev]);
        }

        setCustomers(prevCustomers => prevCustomers.map(c => {
            if (c.id === customerId) {
                const cost = bottlesSold * bottlePrice;
                const newBottlesPurchased = c.bottlesPurchased + bottlesSold;
                const newPaidBottles = updateBalance ? c.paidBottles + Math.floor(amountReceived / bottlePrice) : c.paidBottles;
                const newTotalBalance = updateBalance ? c.totalBalance + cost - amountReceived : c.totalBalance;
                const newEmptyBottlesOnHand = (c.emptyBottlesOnHand || 0) - bottlesReturned + bottlesSold;

                return { ...c, bottlesPurchased: newBottlesPurchased, paidBottles: newPaidBottles, totalBalance: newTotalBalance, emptyBottlesOnHand: newEmptyBottlesOnHand };
            }
            return c;
        }));

        const newSale: SaleRecord = { ...saleData, id: Date.now(), date: new Date().toISOString().split('T')[0] };
        setSales(prev => [newSale, ...prev]);

        if(bottlesReturned > 0 || bottlesSold > 0) {
            const newLog: BottleLog = { id: Date.now(), customerId, date: new Date().toISOString().split('T')[0], bottlesTaken: bottlesSold, bottlesReturned };
            setBottleLogs(prev => [newLog, ...prev]);
        }
        showToast('Sale added!', 'success');
    };

    const handleUpdateSale = (updatedSale: SaleRecord) => {
        const originalSale = sales.find(s => s.id === updatedSale.id);
        if (!originalSale) return;

        // Recalculate customer balance if amount received changed
        if (originalSale.amountReceived !== updatedSale.amountReceived && !updatedSale.isCounterSale) {
            const amountDifference = updatedSale.amountReceived - originalSale.amountReceived;
            setCustomers(prev => prev.map(c => {
                if (c.id === updatedSale.customerId) {
                    // a smaller received amount INCREASES balance.
                    return { ...c, totalBalance: c.totalBalance - amountDifference };
                }
                return c;
            }));
        }

        setSales(prev => prev.map(s => s.id === updatedSale.id ? updatedSale : s));
        setEditSaleModalOpen(false);
        showToast('Sale updated successfully!', 'success');
    };
    
    const handleConfirmDeleteSale = () => {
        if (!saleToDelete) return;

        // 1. Revert Inventory
        const bottleItem = inventory.find(i => i.name.includes('19-Liter'));
        if (bottleItem && saleToDelete.bottlesSold > 0) {
            const newStock = bottleItem.stock + saleToDelete.bottlesSold;
            setInventory(prev => prev.map(i => i.id === bottleItem.id ? { ...i, stock: newStock } : i));
            const newAdjustment: StockAdjustment = { id: Date.now(), itemId: bottleItem.id, date: new Date().toISOString().split('T')[0], quantityChange: saleToDelete.bottlesSold, reason: `Sale Reversal (ID: ${saleToDelete.id})`, adjustedBy: 'System' };
            setStockAdjustments(prev => [newAdjustment, ...prev]);
        }

        // 2. Revert Customer Stats
        if (!saleToDelete.isCounterSale) {
            setCustomers(prev => prev.map(c => {
                if (c.id === saleToDelete.customerId) {
                    const cost = saleToDelete.bottlesSold * bottlePrice;
                    const newTotalBalance = c.totalBalance - (cost - saleToDelete.amountReceived);
                    const newBottlesPurchased = c.bottlesPurchased - saleToDelete.bottlesSold;
                    const newEmptyBottlesOnHand = c.emptyBottlesOnHand - saleToDelete.bottlesSold + saleToDelete.bottlesReturned;
                    // Note: paidBottles logic is complex to reverse accurately without a full payment ledger. 
                    // The balance reversal is the most critical part for financial accuracy.
                    return { ...c, totalBalance: newTotalBalance, bottlesPurchased: newBottlesPurchased, emptyBottlesOnHand: newEmptyBottlesOnHand };
                }
                return c;
            }));
        }

        // 3. Delete sale record
        setSales(prev => prev.filter(s => s.id !== saleToDelete.id));
        
        setDeleteSaleModalOpen(false);
        setSaleToDelete(null);
        showToast('Sale deleted and data reverted!', 'success');
    };

    const handleConfirmDeleteItem = () => {
        if(itemToEdit) {
            const itemId = itemToEdit.id;
            setInventory(prev => prev.filter(i => i.id !== itemId));
            setStockAdjustments(prev => prev.filter(sa => sa.itemId !== itemId));
            setDeleteInventoryItemModalOpen(false);
            setItemToEdit(null);
            showToast('Item and history deleted!', 'success');
        }
    };


    // Effect to update delivery-due status daily
    useEffect(() => {
        const today = new Date().toLocaleString('en-us', { weekday: 'long' });
        setCustomers(prev => prev.map(c => ({
            ...c,
            deliveryDueToday: c.deliveryDays.includes(today)
        })));
    }, []); // Runs once on app load

    const renderContent = () => {
        if (!userType || userType === 'admin') {
            switch (activeView) {
                case 'dashboard': return <>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-brand-text-primary">Dashboard Overview</h1>
                        <button onClick={() => setAddCounterSaleModalOpen(true)} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Record Counter Sale</button>
                    </div>
                    <Dashboard customers={customers} sales={sales} expenses={expenses} onNavigate={handleNavigate} onViewCustomer={(c) => { setSelectedCustomer(c); setActiveView('customerDetail'); }} />
                </>;
                case 'customers': return (
                    <>
                        <CustomerFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} dueFilter={dueFilter} onDueFilterChange={setDueFilter} />
                        <CustomerTable
                            customers={filteredCustomers} salesmen={salesmen}
                            onAddCustomer={() => setAddCustomerModalOpen(true)}
                            onAddSale={(c) => { setSelectedCustomer(c); setAddSaleModalOpen(true); }}
                            onViewDetails={(c) => { setSelectedCustomer(c); setActiveView('customerDetail'); }}
                            onEdit={(c) => { setSelectedCustomer(c); setEditCustomerModalOpen(true); }}
                            onDelete={(c) => { setSelectedCustomer(c); setDeleteCustomerModalOpen(true); }}
                        />
                    </>
                );
                case 'customerDetail': return selectedCustomer ? <CustomerDetail customer={selectedCustomer} salesHistory={sales.filter(s => s.customerId === selectedCustomer.id)} bottleLogs={bottleLogs.filter(b => b.customerId === selectedCustomer.id)} salesmen={salesmen} onBack={() => handleNavigate('customers')} /> : <div>No customer selected.</div>;
                case 'sales': return <DailySales sales={sales} salesmen={salesmen} onAddCounterSale={() => setAddCounterSaleModalOpen(true)} onEditSale={(s) => {setEditingSale(s); setEditSaleModalOpen(true)}} onDeleteSale={(s) => {setSaleToDelete(s); setDeleteSaleModalOpen(true)}} />;
                case 'expenses': return <Expenses expenses={expenses} onAddExpense={() => setAddExpenseModalOpen(true)} onEditExpense={(e) => {setEditingExpense(e); setEditExpenseModalOpen(true)}} />;
                case 'inventory': return <Inventory inventory={inventory} onAddItem={() => setAddInventoryItemModalOpen(true)} onEditItem={(i) => {setItemToEdit(i); setEditInventoryItemModalOpen(true)}} onDeleteItem={(i) => {setItemToEdit(i); setDeleteInventoryItemModalOpen(true)}} onAdjustStock={(i) => {setItemToEdit(i); setAdjustStockModalOpen(true)}} onViewDetails={(i) => {setSelectedInventoryItem(i); setActiveView('inventoryDetail')}} />;
                case 'inventoryDetail': return selectedInventoryItem ? <InventoryItemDetail item={selectedInventoryItem} history={stockAdjustments.filter(sa => sa.itemId === selectedInventoryItem.id)} onBack={() => handleNavigate('inventory')} /> : <div>No item selected.</div>;
                case 'schedule': return <DeliverySchedule customers={customers} onEditSchedule={(c) => { setSelectedCustomer(c); setEditScheduleModalOpen(true); }} />;
                case 'reminders': return <DailyReminders customers={customers} />;
                case 'bottleTracking': return <BottleTracking customers={customers} onAdjustBottles={(c) => { setSelectedCustomer(c); setAdjustBottlesModalOpen(true); }} />;
                case 'salesmen': return <Salesmen salesmen={salesmen} onAddSalesman={() => setAddSalesmanModalOpen(true)} onDeleteSalesman={(id) => setSalesmen(salesmen.filter(s => s.id !== id))} onViewReport={(s) => {setSelectedSalesman(s); setActiveView('salesmanReport')}} onAddPayment={(s) => {setSelectedSalesman(s); setAddSalesmanPaymentModalOpen(true)}} />;
                case 'salesmanReport': return selectedSalesman ? <SalesmanReport salesman={selectedSalesman} salesRecords={sales} salesmanPayments={salesmanPayments} customers={customers} onBack={() => handleNavigate('salesmen')} /> : <div>No salesman selected.</div>;
                case 'reports': return <Reports sales={sales} expenses={expenses} customers={customers} />;
                case 'closing': return <ClosingReport sales={sales} expenses={expenses} />;
                case 'settings': return <Settings currentPrice={bottlePrice} onUpdatePrice={setBottlePrice} />;
                default: return <div>Not Found</div>;
            }
        }
        return null;
    };

    if (authStatus === 'chooser') {
        return <LoginChooser onChoose={(type) => setAuthStatus(type === 'admin' ? 'admin-login' : 'salesman-login')} />;
    }
    if (authStatus === 'admin-login') {
        return <Login onLogin={() => handleLogin('admin')} showSignup={() => setAuthStatus('signup')} />;
    }
     if (authStatus === 'salesman-login') {
        return <SalesmanLogin salesmen={salesmen} onLogin={(salesman) => handleLogin('salesman', salesman)} onBack={() => setAuthStatus('chooser')} />;
    }
    if (authStatus === 'signup') {
        return <Signup onSignup={() => handleLogin('admin')} showLogin={() => setAuthStatus('admin-login')} />;
    }
    if (userType === 'salesman' && loggedInSalesman) {
        return <SalesmanDashboard salesman={loggedInSalesman} customers={customers} onLogout={handleLogout} />;
    }

    return (
        <div className="flex h-screen bg-brand-bg">
            <div className="no-print">
                <Sidebar activeView={activeView} onNavigate={handleNavigate} />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="no-print">
                    <Header onLogout={handleLogout} />
                </div>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {renderContent()}
                </main>
            </div>

            {/* Modals */}
            <div className="no-print">
                <AddCustomerModal isOpen={isAddCustomerModalOpen} onClose={() => setAddCustomerModalOpen(false)} onAddCustomer={handleAddCustomer} salesmen={salesmen} />
                <EditCustomerModal isOpen={isEditCustomerModalOpen} onClose={() => setEditCustomerModalOpen(false)} customer={selectedCustomer} onUpdateCustomer={handleUpdateCustomer} salesmen={salesmen} />
                <DeleteCustomerModal isOpen={isDeleteCustomerModalOpen} onClose={() => setDeleteCustomerModalOpen(false)} onConfirm={handleDeleteCustomer} customerName={selectedCustomer?.name || ''} />
                <AddSaleModal isOpen={isAddSaleModalOpen} onClose={() => setAddSaleModalOpen(false)} onAddSale={handleAddSale} customer={selectedCustomer} salesmen={salesmen} bottlePrice={bottlePrice} />

                <AddExpenseModal isOpen={isAddExpenseModalOpen} onClose={() => setAddExpenseModalOpen(false)} onAddExpense={(expense) => { setExpenses(prev => [{ ...expense, id: Date.now() }, ...prev]); showToast('Expense added!', 'success'); }} />
                <EditExpenseModal isOpen={isEditExpenseModalOpen} onClose={() => setEditExpenseModalOpen(false)} expense={editingExpense} onUpdateExpense={(expense) => { setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e)); setEditExpenseModalOpen(false); showToast('Expense updated!', 'success'); }} />
                
                <AddInventoryItemModal isOpen={isAddInventoryItemModalOpen} onClose={() => setAddInventoryItemModalOpen(false)} onAddItem={(item) => { setInventory(prev => [{...item, id: Date.now()}, ...prev]); showToast('Item added!', 'success');}} />
                <EditInventoryItemModal isOpen={isEditInventoryItemModalOpen} onClose={() => setEditInventoryItemModalOpen(false)} item={itemToEdit} onUpdateItem={(item) => { setInventory(prev => prev.map(i => i.id === item.id ? item : i)); setEditInventoryItemModalOpen(false); showToast('Item updated!', 'success');}} />
                <AdjustStockModal isOpen={isAdjustStockModalOpen} onClose={() => setAdjustStockModalOpen(false)} item={itemToEdit} onAdjustStock={(itemId, newStock, quantityChange, reason) => { setInventory(prev => prev.map(i => i.id === itemId ? {...i, stock: newStock} : i)); setStockAdjustments(prev => [{id: Date.now(), itemId, date: new Date().toISOString().split('T')[0], quantityChange, reason, adjustedBy: 'Admin'}, ...prev]); setAdjustStockModalOpen(false); showToast('Stock adjusted!', 'success');}} />
                <DeleteInventoryItemModal isOpen={isDeleteInventoryItemModalOpen} onClose={() => setDeleteInventoryItemModalOpen(false)} itemName={itemToEdit?.name || ''} onConfirm={handleConfirmDeleteItem} />
                
                <EditScheduleModal isOpen={isEditScheduleModalOpen} onClose={() => setEditScheduleModalOpen(false)} customer={selectedCustomer} onSave={(customerId, newSchedule) => { setCustomers(prev => prev.map(c => c.id === customerId ? {...c, deliveryDays: newSchedule} : c)); showToast('Schedule updated!', 'success'); }} />
                <AdjustEmptyBottlesModal isOpen={isAdjustBottlesModalOpen} onClose={() => setAdjustBottlesModalOpen(false)} customer={selectedCustomer} onSave={(customerId, newCount) => { setCustomers(prev => prev.map(c => c.id === customerId ? {...c, emptyBottlesOnHand: newCount} : c)); showToast('Bottle count updated!', 'success'); }} />
                
                <AddSalesmanModal isOpen={isAddSalesmanModalOpen} onClose={() => setAddSalesmanModalOpen(false)} onAddSalesman={(s) => { setSalesmen(prev => [{...s, id: Date.now()}, ...prev]); showToast('Salesman added!', 'success');}}/>
                <AddSalesmanPaymentModal isOpen={isAddSalesmanPaymentModalOpen} onClose={() => setAddSalesmanPaymentModalOpen(false)} salesman={selectedSalesman} onRecordPayment={(salesmanId, amount, date) => { setSalesmanPayments(prev => [{id: Date.now(), salesmanId, amount, date}, ...prev]); setAddSalesmanPaymentModalOpen(false); showToast('Payment recorded!', 'success'); }} />
                
                <AddCounterSaleModal isOpen={isAddCounterSaleModalOpen} onClose={() => setAddCounterSaleModalOpen(false)} onRecordSale={(amount, description) => { const sale: SaleRecord = {id: Date.now(), customerId: 0, customerName: 'Counter Sale', bottlesSold: 0, amountReceived: amount, date: new Date().toISOString().split('T')[0], isCounterSale: true, description, bottlesReturned: 0 }; setSales(prev => [sale, ...prev]); setAddCounterSaleModalOpen(false); showToast('Counter sale recorded!', 'success'); }} />
                <EditSaleModal isOpen={isEditSaleModalOpen} onClose={() => setEditSaleModalOpen(false)} sale={editingSale} onUpdateSale={handleUpdateSale} salesmen={salesmen} />
                <DeleteSaleModal isOpen={isDeleteSaleModalOpen} onClose={() => setDeleteSaleModalOpen(false)} saleInfo={saleToDelete ? `${saleToDelete.customerName} (PKR ${saleToDelete.amountReceived})` : ''} onConfirm={handleConfirmDeleteSale} />
            </div>
        </div>
    );
};

export default App;
