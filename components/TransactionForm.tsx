import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../constants';
import { Category, TransactionType } from '../types';
import { Save, X } from 'lucide-react';

export const TransactionForm: React.FC = () => {
  const { t, addTransaction, editTransaction, transactions } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Category>('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editId) {
      const tx = transactions.find(t => t.id === editId);
      if (tx) {
        setAmount(tx.amount.toString());
        setType(tx.type);
        setCategory(tx.category);
        setDate(tx.date);
        setNote(tx.note || '');
      }
    }
  }, [editId, transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError(t('errors.amount_required'));
      return;
    }

    const txData = {
      amount: parseFloat(amount),
      type,
      category,
      date,
      note
    };

    if (editId) {
      editTransaction(editId, txData);
    } else {
      addTransaction(txData);
    }
    navigate(-1);
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{editId ? t('edit') : t('add_transaction')}</h2>
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-surface p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
        
        {/* Type Switcher */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              type === 'expense' 
                ? 'bg-white dark:bg-gray-700 shadow text-red-600 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            {t('expense')}
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              type === 'income' 
                ? 'bg-white dark:bg-gray-700 shadow text-green-600 dark:text-green-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            {t('income')}
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('amount')}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary-light/50 outline-none transition-all"
            placeholder="0.00"
            step="0.01"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('category')}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary-light/50 outline-none appearance-none"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat} className="bg-white dark:bg-dark-surface">
                {t(`categories.${cat}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('date')}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary-light/50 outline-none dark:[color-scheme:dark]"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('note')}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary-light/50 outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center px-6 py-3 rounded-xl bg-primary-light hover:bg-primary-dark text-white font-medium transition-colors shadow-lg shadow-green-500/20"
          >
            <Save className="w-5 h-5 me-2" />
            {t('save')}
          </button>
        </div>

      </form>
    </div>
  );
};
