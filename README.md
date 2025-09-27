# Casper Era Tracker

A modern, full-stack web application that displays live Casper network era information with real-time countdown timers, dual-mode era calculators, and comprehensive network data visualization.

![Casper Era Tracker Screenshot](https://raw.githubusercontent.com/mrkara/casper-era-tracker/master/docs/screenshot.png)

## ✨ Features

- **Live Era Information**: Current era, block height, and time left to the next era.
- **Dual-Mode Era Calculator**: Predict future eras by era number or date/time.
- **Accurate Network Data**: Combines data from CSPR.cloud and CSPR.live for accuracy.
- **Secure Backend**: Flask API proxy protects API keys and handles CORS.
- **Modern Design**: Responsive and user-friendly interface.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.13+
- pnpm (or npm/yarn)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mrkara/casper-era-tracker.git
    cd casper-era-tracker
    ```

2.  **Install dependencies:**
    ```bash
    # Install frontend dependencies
    pnpm install

    # Install backend dependencies
    cd backend
    pip install -r requirements.txt
    ```

3.  **Configure API Key:**
    ```bash
    # In the backend directory
    cp .env.example .env
    # Edit .env and add your CSPR.cloud API key
    ```

4.  **Run the application:**
    ```bash
    # Start the backend server (in /backend)
    python app.py

    # Start the frontend dev server (in project root)
    pnpm run dev
    ```

## 📚 Documentation

- **[Deployment Guide](DEPLOYMENT.md)**: Instructions for deploying the application to various platforms.
- **[API Integration](docs/API.md)**: Details about the APIs used in the project.
- **[Calculation Logic](docs/CALCULATIONS.md)**: Explanation of the era and block height calculation formulas.
- **[Contributing Guidelines](CONTRIBUTING.md)**: How to contribute to the project.

## 🤖 AI-Generated Content Disclaimer

**Important Notice**: This project contains code and content that was generated with the assistance of artificial intelligence (AI) tools. While the code has been reviewed and tested, users should:

- **Review all code** before using in production environments
- **Test thoroughly** in their specific use cases
- **Verify API integrations** and security implementations
- **Understand the codebase** before making modifications
- **Follow security best practices** when deploying

Users are responsible for ensuring the code meets their security, performance, and functional requirements.

## 📄 License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This application is powered by the fantastic APIs from [CSPR.cloud](https://cspr.cloud/) and [CSPR.live](https://cspr.live/).

---

*Built with ❤️ for the Casper community.*

