# Casper Era Tracker

A modern, full-stack web application that displays live Casper network era information with real-time countdown timers, dual-mode era calculators, and comprehensive network data visualization.

## ✨ Features

### 🕒 **Live Era Information**
- **Current era number** with real-time updates
- **Live countdown timer** to next era (minutes and seconds)
- **Current block height** from live network state
- **Last switch block** details (timestamp, height, hash)
- **Next switch block** predictions with expected time and block height

### 🧮 **Dual-Mode Era Time Calculator**
- **Era Number Mode**: Enter a future era → get expected date/time
- **Date & Time Mode**: Select a future date/time → get which era will be active
- **Comprehensive results**: Era boundaries, block heights, time calculations
- **Smart era detection** with current era highlighting

### 📊 **Accurate Network Data**
- **Real-time integration** with CSPR.cloud and CSPR.live APIs
- **Correct current era** (not off-by-one from switch blocks)
- **Live block height** (not just switch block height)
- **Block height predictions** using 450 blocks per era formula
- **1-minute API caching** for optimal performance

### 🎨 **Modern Design & UX**
- **Beautiful gradient background** with purple/blue theme
- **Responsive layout** for all devices (mobile, tablet, desktop)
- **Smooth animations** and hover effects
- **Professional UI** with shadcn/ui components
- **Live status indicators** showing data freshness

### 🔒 **Secure Backend Architecture**
- **Flask API proxy** to avoid CORS issues
- **API key protection** (never exposed to frontend)
- **Smart caching system** with 1-minute expiry
- **Graceful fallbacks** to demo mode if APIs unavailable

### 🙏 **API Provider Acknowledgments**
- **Powered by section** with official logos
- **Interactive links** to CSPR.cloud and CSPR.live
- **Proper attribution** for API providers

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Lucide React** - Beautiful, consistent icons

### Backend
- **Flask** - Lightweight Python web framework
- **Python 3.11** - Modern Python with type hints
- **Requests** - HTTP library for API calls
- **CORS handling** - Cross-origin request support

### APIs & Data Sources
- **CSPR.cloud API** - Enterprise blockchain data and switch blocks
- **CSPR.live API** - Real-time network state and current era
- **Smart caching** - 1-minute cache expiry for optimal performance

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** 
- **Python 3.11+**
- **pnpm** (or npm/yarn)
- **pip** for Python dependencies

### Local Development

#### 1. Clone and Setup
```bash
git clone <repository-url>
cd casper-era-tracker
```

#### 2. Install Frontend Dependencies
```bash
pnpm install
```

#### 3. Install Backend Dependencies
```bash
cd backend/
pip install -r requirements.txt
```

#### 4. Configure API Keys
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit .env file and add your CSPR.cloud API key
# CSPR_CLOUD_API_KEY=your_api_key_here
```

#### 5. Start Backend (Terminal 1)
```bash
cd backend/
python app.py
```
Backend will run on `http://localhost:5000`

#### 6. Start Frontend (Terminal 2)
```bash
# In project root
pnpm run dev
```
Frontend will run on `http://localhost:5173`

### Building for Production

```bash
# Build frontend
pnpm run build

# Copy to backend static directory
cp -r dist/* backend/static/
cp public/*.webp backend/static/

# Backend serves both API and frontend
cd backend/
python app.py
```

## 📦 Deployment

### Recommended Platforms

#### **Heroku** (Full-stack - Recommended)
```bash
# Uses included Procfile and runtime.txt
git push heroku main
```

#### **Railway** (Full-stack)
- Connect GitHub repository
- Automatic Python detection
- Environment variables in dashboard

#### **Render** (Full-stack)
- Web service deployment
- Automatic builds from Git
- Built-in environment management

#### **Vercel** (Frontend only)
- Connect GitHub repository
- Automatic React deployments
- Serverless functions for API

#### **Netlify** (Frontend only)
- Drag and drop `dist/` folder
- Git integration available
- Netlify Functions for API proxy

### Environment Variables

For production deployment, set:
```bash
CSPR_CLOUD_API_KEY=your_cspr_cloud_api_key
FLASK_ENV=production
```

## 🔧 API Integration

### CSPR.cloud API
```javascript
// Switch block data
GET https://api.cspr.cloud/blocks?is_switch_block=true&order_by=block_height&order_direction=desc&limit=1
Authorization: Bearer YOUR_API_KEY
```

### CSPR.live API
```javascript
// Current network state
GET https://api.mainnet.cspr.live/network-state
// No authentication required
```

To get your CSPR.cloud API key:
1. Visit [CSPR.cloud Console](https://console.cspr.cloud/)
2. Register for an account
3. Generate an API token
4. Add to your `.env` file

## 📐 Era Calculations

### Block Height Formula
```
Next Switch Block Height = Last Switch Block Height + 450 blocks
Future Era Block Height = Last Switch Block Height + (Era Difference × 450 blocks)
```

### Time Calculations
```
Era Duration = ~2 hours (7200 seconds)
Future Era Time = Last Switch Block Time + (Era Difference × 2 hours)
```

### Date/Time Mode Logic
1. Calculate time difference from last switch block
2. Determine how many eras have passed
3. Find which era contains the selected datetime
4. Calculate era boundaries and block heights

## 📁 Project Structure

```
casper-era-tracker/
├── public/                     # Static assets and logos
│   ├── cspr_cloud_logo.webp   # CSPR.cloud logo
│   ├── cspr_live_logo.webp    # CSPR.live logo
│   └── favicon.ico            # App icon
├── src/
│   ├── components/ui/         # shadcn/ui components
│   ├── App.jsx               # Main React application
│   ├── App.css               # Tailwind CSS styles
│   └── main.jsx              # React entry point
├── backend/
│   ├── app.py                # Flask API server
│   ├── requirements.txt      # Python dependencies
│   ├── Procfile             # Heroku deployment
│   ├── runtime.txt          # Python version
│   └── static/              # Production frontend files
├── dist/                     # Frontend build output
├── package.json             # Node.js dependencies
└── README.md               # This documentation
```

## 🤖 AI-Generated Content Disclaimer

**Important Notice**: This project contains code and content that was generated with the assistance of artificial intelligence (AI) tools. While the code has been reviewed and tested, users should:

- **Review all code** before using in production environments
- **Test thoroughly** in their specific use cases
- **Verify API integrations** and security implementations
- **Understand the codebase** before making modifications
- **Follow security best practices** when deploying

The AI-generated portions include but are not limited to:
- React component logic and styling
- Flask backend implementation
- API integration patterns
- Documentation and comments
- Configuration files

Users are responsible for ensuring the code meets their security, performance, and functional requirements.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (both frontend and backend)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Test both frontend and backend changes
- Update documentation for new features
- Ensure responsive design works on all devices
- Verify API integrations work correctly

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

```
Copyright 2025 Casper Era Tracker Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

## 🙏 Acknowledgments

This application is made possible by:

- **[CSPR.cloud](https://cspr.cloud/)** - Enterprise-grade blockchain API providing switch block data
- **[CSPR.live](https://cspr.live/)** - Network explorer providing real-time network state
- **[Casper Network](https://casper.network/)** - The underlying blockchain infrastructure
- **[MAKE](https://make.services/)** - The team behind CSPR.cloud and CSPR.live

## 📞 Support

For questions about:
- **Casper Network**: [Casper Documentation](https://docs.casper.network/)
- **CSPR.cloud API**: [CSPR.cloud Documentation](https://docs.cspr.cloud/)
- **This Application**: Open an issue in this repository

---

**Built with ❤️ for the Casper community**

*Providing accurate, real-time era information to help developers, validators, and users navigate the Casper network with confidence.*
