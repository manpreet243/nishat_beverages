
import React from 'react';
import { BellIcon } from '../icons/BellIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { LogoutIcon } from '../icons/LogoutIcon';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    return (
        <header className="h-20 bg-brand-surface border-b border-gray-200 flex items-center justify-end px-6">
            <div className="flex items-center space-x-6">
                <button className="relative text-brand-text-secondary hover:text-brand-blue">
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center">
                    <UserCircleIcon className="h-10 w-10 text-brand-text-secondary" />
                    <div className="ml-3">
                        <p className="text-sm font-semibold text-brand-text-primary">Admin User</p>
                        <p className="text-xs text-brand-text-secondary">Administrator</p>
                    </div>
                </div>
                <button onClick={onLogout} className="flex items-center text-brand-text-secondary hover:text-red-600 transition-colors">
                    <LogoutIcon className="h-6 w-6 mr-2" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
