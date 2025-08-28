// Enums to make our code more readable
export enum TransactionType {
  Income,
  Expense
}

export enum TransactionStatus {
  Cleared,
  Pending
}

// Interface for a transaction being displayed (Read DTO)
export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  title: string;
  description?: string; // Optional property
  date: Date;
  status: TransactionStatus;
  categoryName: string;
  accountName: string;
  categoryId: number;
  accountId: number;
}

// Interface for creating/updating a transaction (Write DTO)
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