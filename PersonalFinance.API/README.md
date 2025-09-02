# Personal Finance & Budget Management API (.NET Core)

This is the backend for the Personal Finance application, built with .NET 8, Entity Framework Core, and ASP.NET Core Identity. It provides a secure, RESTful API for managing users, transactions, categories, accounts, and budgets.

## Features

*   Secure user registration and login using JWT authentication.
*   Full CRUD operations for Transactions, Categories, Accounts, and Budgets.
*   Per-user data scoping ensures users can only access their own financial data.
*   Dashboard endpoint for aggregated financial reporting (income vs. expense, top spending, budget utilization).
*   Uses AutoMapper for clean mapping between database models and DTOs.

## Technologies Used

*   **.NET 8**
*   **ASP.NET Core Web API**
*   **Entity Framework Core 8** (Code-First)
*   **ASP.NET Core Identity**
*   **MSSQL Server**
*   **JWT (JSON Web Tokens)** for authentication
*   **AutoMapper**

---

## Setup and How to Run Locally

### Prerequisites

*   [.NET 8 SDK](https://dotnet.microsoft.com/download)
*   [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (LocalDB, Express, or full instance)
*   A tool for API testing, like [Postman](https://www.postman.com/downloads/).

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd PersonalFinance.API