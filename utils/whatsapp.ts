import { Customer } from '../types';

export const generateWhatsAppMessageText = (customer: Customer): string => {
    const unpaidBottles = customer.bottlesPurchased - customer.paidBottles;
    const bottlesToReturn = customer.emptyBottlesOnHand || 0;

    const message = `Hello ${customer.name}, this is a friendly reminder from Nishat Beverages.
    
Your Account Summary:
- Remaining Payment: PKR ${customer.totalBalance.toLocaleString()}
- Total Paid Bottles: ${customer.paidBottles}
- Total Unpaid Bottles: ${unpaidBottles > 0 ? unpaidBottles : 0}
- Empty Bottles to Return: ${bottlesToReturn}

Thank you!`;
    
    return message;
};

export const generateWhatsAppReminderUrl = (customer: Customer): string => {
    const message = generateWhatsAppMessageText(customer);
    const encodedMessage = encodeURIComponent(message);
    // In a real scenario, you would use the customer's mobile number.
    // Make sure the mobile number includes the country code, e.g., 923... for Pakistan
    return `https://wa.me/${customer.mobile}?text=${encodedMessage}`;
};