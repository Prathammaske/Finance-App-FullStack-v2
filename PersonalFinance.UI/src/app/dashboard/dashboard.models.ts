export interface CategorySpending {
  categoryName: string;
  totalAmount: number;
}

export interface BudgetUtilizationSummary {
  overBudget: number;
  nearBudget: number;
  underBudget: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  pendingTransactionsCount: number;
  topSpendingCategories: CategorySpending[];
  budgetSummary: BudgetUtilizationSummary;
}