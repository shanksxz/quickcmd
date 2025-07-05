# Contributing to quickcmd

First off, thank you for considering contributing to `quickcmd`! It's people like you that make open source such a great community. We welcome any type of contribution, not just code.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please make sure to [open an issue](https://github.com/shanksxz/quickcmd/issues/new) and provide as much information as possible. Include the command you ran, what you expected to happen, and what actually happened.

### Suggesting Enhancements

If you have an idea for a new feature or an improvement to an existing one, please [open an issue](https://github.com/shanksxz/quickcmd/issues/new) to discuss it. This allows us to coordinate our efforts and prevent duplication of work.

### Pull Requests

We love pull requests! If you're ready to contribute code, please follow these steps to ensure a smooth process.

## Development Setup

1.  **Fork & Clone**: Fork the repository and clone it to your local machine.
2.  **Install Dependencies**: We use `pnpm` for package management. Navigate to the project directory and run:

    ```bash
    pnpm install
    ```

    This will install all the necessary dependencies to get you started.

3.  **Build the Project**: To compile the TypeScript code, run the build command:
    ```bash
    pnpm build
    ```

## Running Tests

We use `vitest` for testing. Before submitting a pull request, please ensure all tests are passing.

```bash
pnpm test
```

If you add new functionality, please include corresponding tests.

## Code Style and Linting

We use `biome` to enforce a consistent code style and catch common errors. Before committing your changes, please run the linter to format your code and check for issues.

```bash
pnpm format-and-lint:fix
```

This will automatically fix most issues. Please ensure your code is free of any linting errors before submitting a pull request.

## Pull Request Process

1.  **Create a Branch**: Create a new branch for your feature or bug fix.
    ```bash
    git checkout -b feature/your-awesome-feature
    ```
2.  **Make Your Changes**: Write your code and add your tests.
3.  **Ensure Tests Pass**: Run `pnpm test` to make sure everything is working as expected.
4.  **Commit Your Changes**: Use a clear and descriptive commit message.
5.  **Push and Open a PR**: Push your branch to your fork and open a pull request against the `main` branch of the original repository.
6.  **Code Review**: The maintainers will review your code, provide feedback, and merge it when it's ready.

Thank you for your contribution! 