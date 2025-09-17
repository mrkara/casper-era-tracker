# Casper Era Tracker

A modern, responsive web application that displays live Casper network era information with a beautiful countdown timer and era time calculator.

## Features

✨ **Live Era Information**
- Current era number
- Real-time countdown to next era
- Last switch block timestamp
- Next switch block expected time
- Current block height

🧮 **Era Time Calculator**
- Calculate expected date/time for any future era
- Shows time remaining from now
- Based on 2-hour era duration pattern

🎨 **Modern Design**
- Beautiful gradient background
- Responsive layout for all devices
- Smooth animations and hover effects
- Professional UI with shadcn/ui components

📡 **Smart Data Handling**
- Attempts to fetch live data from CSPR.cloud API
- Falls back to demo mode if CORS prevents direct access
- Auto-refresh every 5 minutes
- Manual refresh button

## Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Beautiful icons
- **CSPR.cloud API** - Casper network data source

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd casper-era-tracker
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
pnpm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
pnpm run preview
```

## Deployment

This application is designed to be easily deployed on free platforms:

### Recommended Platforms

1. **Vercel** (Recommended)
   - Connect your GitHub repository
   - Automatic deployments on push
   - Built-in React support

2. **Netlify**
   - Drag and drop the `dist/` folder
   - Or connect via Git for automatic deployments

3. **GitHub Pages**
   - Use GitHub Actions for automatic deployment
   - Requires setting the correct base path

4. **Railway**
   - Simple deployment with Git integration
   - Automatic HTTPS

### CORS Considerations

The application attempts to fetch live data from the CSPR.cloud API. Due to CORS restrictions in browsers, direct API calls may fail in production. The app gracefully falls back to demo mode in this case.

For production use with live data, consider:
- Setting up a simple backend proxy
- Using serverless functions (Vercel Functions, Netlify Functions)
- Deploying with proper CORS headers

## API Integration

The app uses the CSPR.cloud REST API:

```javascript
// Example API call
const response = await fetch(
  'https://api.cspr.cloud/blocks?is_switch_block=true&order_by=block_height&order_direction=desc&limit=1',
  {
    headers: {
      'accept': 'application/json',
      'Authorization': 'YOUR_API_TOKEN'
    }
  }
)
```

To use live data:
1. Register at [CSPR.build console](https://docs.cspr.cloud/documentation/getting-started)
2. Get your API token
3. Replace the token in `src/App.jsx`

## Era Time Calculator

The calculator uses the following logic:

1. Gets the current era and last switch block time
2. Calculates future era time: `lastSwitchTime + (erasInFuture * 2 hours)`
3. Shows both absolute time and relative time from now
4. Accounts for the 2-hour era duration pattern

## Project Structure

```
casper-era-tracker/
├── public/                 # Static assets
├── src/
│   ├── components/ui/      # shadcn/ui components
│   ├── App.jsx            # Main application component
│   ├── App.css            # Tailwind CSS styles
│   ├── index.css          # Global styles
│   └── main.jsx           # React entry point
├── dist/                  # Production build output
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for any purpose.

## Support

For questions about the Casper network or API, visit:
- [Casper Documentation](https://docs.casper.network/)
- [CSPR.cloud Documentation](https://docs.cspr.cloud/)

---

Built with ❤️ for the Casper community
