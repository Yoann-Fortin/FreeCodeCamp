# Bank Account Management Program

A bank account management system with transaction tracking, developed as part of the [freeCodeCamp JavaScript Algorithms and Data Structures certification](https://www.freecodecamp.org/).

## Features

- Deposit and withdraw with validation
- Transaction history tracking
- List deposits and withdrawals separately
- Balance check

## API

| Method | Description |
|--------|------------|
| `deposit(amount)` | Deposit funds into the account |
| `withdraw(amount)` | Withdraw funds from the account |
| `checkBalance()` | Return the current balance |
| `listAllDeposits()` | Return all deposit amounts |
| `listAllWithdrawals()` | Return all withdrawal amounts |

## Approach

This project follows a **TDD (Test-Driven Development)** workflow using [Vitest](https://vitest.dev/). Each feature is implemented through the Red-Green-Refactor cycle.

### Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Minimal implementation, passes all 22 certification tests |
| `bank/feature/typescript` | Migration to TypeScript |
| `bank/feature/command` | Command pattern: transactions with execute/undo |
| `bank/feature/memento` | Memento pattern: account state snapshots for rollback |
| `bank/feature/chain-of-responsibility` | Chain of Responsibility: validation pipeline |
| `bank/feature/hexagonal` | Hexagonal architecture with patterns integrated |

### Running tests

```bash
npm install
npm test
```

## Tech Stack

- Vanilla JavaScript
- Vitest (testing)
