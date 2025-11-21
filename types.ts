
export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'food'
  | 'transport'
  | 'bills'
  | 'entertainment'
  | 'shopping'
  | 'health'
  | 'salary'
  | 'other';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // ISO Date string
  note?: string;
}

export type LanguageCode = 'en' | 'ar' | 'fr';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface TranslationSchema {
  app_name: string;
  home: string;
  add_transaction: string;
  all_transactions: string;
  settings: string;
  language: string;
  theme: string;
  light_theme: string;
  dark_theme: string;
  system_theme: string;
  amount: string;
  type: string;
  income: string;
  expense: string;
  category: string;
  date: string;
  note: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  total_income: string;
  total_expenses: string;
  net_balance: string;
  recent_transactions: string;
  no_transactions: string;
  import_data: string;
  export_data: string;
  import_success: string;
  invalid_file: string;
  confirm_delete_title: string;
  confirm_delete_message: string;
  categories: Record<Category, string>;
  errors: {
    amount_required: string;
    type_required: string;
  };
}
