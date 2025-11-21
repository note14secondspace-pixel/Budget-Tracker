
import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Category, TransactionType, Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { Trash2, Edit2, Filter, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction, importTransactions, t } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterMonth, setFilterMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
  
  // State for delete confirmation modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => {
        const matchesType = filterType === 'all' || tx.type === filterType;
        const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;
        const matchesMonth = tx.date.startsWith(filterMonth);
        return matchesType && matchesCategory && matchesMonth;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, filterCategory, filterMonth]);

  const handleExport = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `budget_tracker_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);

        if (Array.isArray(parsedData)) {
            // Basic validation
            const isValid = parsedData.every((item: any) => 
                item.amount && item.type && item.date
            );

            if (isValid) {
                importTransactions(parsedData as Transaction[]);
                alert(t('import_success'));
            } else {
                alert(t('invalid_file'));
            }
        } else {
            alert(t('invalid_file'));
        }
      } catch (error) {
        console.error('Import error:', error);
        alert(t('invalid_file'));
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <h2 className="text-2xl font-bold">{t('all_transactions')}</h2>
        
        <div className="flex flex-wrap gap-3 items-center">
            {/* Action Buttons */}
            <div className="flex gap-2">
                <button 
                    type="button"
                    onClick={handleExport}
                    className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title={t('export_data')}
                >
                    <Download className="w-4 h-4 me-2" />
                    {t('export_data')}
                </button>
                <button 
                    type="button"
                    onClick={handleImportClick}
                    className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title={t('import_data')}
                >
                    <Upload className="w-4 h-4 me-2" />
                    {t('import_data')}
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".json" 
                    className="hidden" 
                />
            </div>

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 hidden md:block mx-1"></div>

            {/* Month Filter */}
            <input 
                type="month" 
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 text-sm dark:[color-scheme:dark]"
            />
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 items-center">
        <div className="flex items-center text-gray-500">
            <Filter className="w-4 h-4 me-2" />
        </div>
        
        <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm border-none outline-none"
        >
            <option value="all">{t('all_transactions')}</option>
            <option value="income">{t('income')}</option>
            <option value="expense">{t('expense')}</option>
        </select>

        <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm border-none outline-none"
        >
            <option value="all">{t('category')}: {t('all_transactions')}</option>
            {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
            ))}
        </select>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-[300px]">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">{t('no_transactions')}</p>
          </div>
        ) : (
          filteredTransactions.map(tx => (
            <div 
                key={tx.id} 
                className="group bg-white dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center hover:border-primary-light/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${
                    tx.type === 'income' 
                    ? 'bg-gradient-to-br from-green-400 to-green-600' 
                    : 'bg-gradient-to-br from-red-400 to-red-600'
                }`}>
                    {t(`categories.${tx.category}`).charAt(0)}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t(`categories.${tx.category}`)}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tx.note || t(`categories.${tx.category}`)}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                 <span className={`font-bold text-lg ${tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'} {tx.amount.toFixed(2)}
                 </span>
                 
                 {/* Action Buttons */}
                 <div className="flex gap-2">
                    <button 
                        type="button"
                        onClick={() => navigate(`/add?id=${tx.id}`)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title={t('edit')}
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(tx.id); // Trigger custom modal
                        }}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title={t('delete')}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-surface w-full max-w-sm rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-800 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('confirm_delete_title')}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                {t('confirm_delete_message')}
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={() => {
                    if (deleteId) deleteTransaction(deleteId);
                    setDeleteId(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors shadow-lg shadow-red-500/20"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
