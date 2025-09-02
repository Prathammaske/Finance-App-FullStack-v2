
export enum TransactionType {
  Income,
  Expense
}

export enum TransactionStatus {
  Cleared,
  Pending
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  title: string;
  description?: string; 
  date: Date;
  status: TransactionStatus;
  categoryName: string;
  accountName: string;
  categoryId: number;
  accountId: number;
}


export interface CreateOrUpdateTransaction {
  type: TransactionType;
  amount: number;
  title: string;
  description?: string;
  date: Date;
  status: TransactionStatus;
  categoryId: number;
  accountId: number;
}