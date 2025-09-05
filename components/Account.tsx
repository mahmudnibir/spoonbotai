
import React from 'react';

interface AccountProps {
  onNavigateBack: () => void;
}

const Account: React.FC<AccountProps> = ({ onNavigateBack }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-stone-200 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-4">
        <h2 className="text-3xl font-bold text-emerald-800">Account</h2>
        <button
          onClick={onNavigateBack}
          className="text-sm text-emerald-600 font-semibold hover:text-emerald-800 transition-colors"
        >
          &larr; Back to Generator
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
          <input type="email" id="email" value="user@example.com" disabled className="w-full p-2 bg-stone-100 border border-stone-300 rounded-lg text-stone-500" />
        </div>
         <div>
          {/* Fix: Corrected typo from `cclassName` to `className` */}
          <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">Password</label>
          <button className="w-full p-2 bg-white border border-stone-300 rounded-lg text-stone-800 hover:bg-stone-50 transition-colors">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
