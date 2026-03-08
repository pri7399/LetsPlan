# 🚀 Retirement Planner - Your Path to Financial Freedom

> A powerful, feature-rich retirement planning calculator that helps you visualize your journey to financial independence with precision and confidence.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0.0-646CFF?style=flat&logo=vite)
![Chakra UI](https://img.shields.io/badge/Chakra_UI-2.8.2-319795?style=flat&logo=chakra-ui)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Why This Planner Stands Out

Unlike basic retirement calculators, this tool offers **comprehensive financial modeling** with features you won't find elsewhere:

### 🏖️ **Coast FIRE Modeling** (Unique!)
Plan for early retirement where your portfolio grows untouched for years while you cover expenses from other sources. Watch your wealth compound without withdrawals!

### 🏠 **Real Estate Integration**
Track home purchases as wealth-building assets with automatic 5% annual appreciation - not just expenses!

### 💰 **Lifetime Event Planning**
Add windfalls (inheritance, bonuses, property sales) and major expenses (home, car, education) at any age with automatic tax calculations.

### 📊 **Multi-Phase Investment Strategy**
Configure different asset allocations for:
- **Earning Phase**: Aggressive growth (stocks, midcap, smallcap)
- **Coast Phase**: Balanced growth while retired
- **Withdrawal Phase**: Conservative income generation

### 🎯 **Conservative Planning**
- 2% return reduction for worst-case scenarios
- 12.5% LTCG tax on withdrawals
- 6% inflation adjustment
- 50% expense reduction after age 65
- 30/70 PF split modeling

## 🎨 Features That Make Planning Easy

### 📈 Visual Projections
- **Interactive Bar Chart**: Color-coded savings trajectory (earning → coasting → withdrawal)
- **Year-by-Year Table**: 12 columns including portfolio, real estate, total assets
- **Real-time KPI Cards**: Corpus, coast growth, end savings, longevity

### 💼 Fund Catalog
30+ pre-configured funds across 4 categories:
- Fixed/Debt (EPF, PPF, Gold, Arbitrage)
- Large & Flexi Cap (Parag Parikh, HDFC, Nifty 50, NASDAQ)
- Midcap (HDFC, Kotak, Motilal)
- Smallcap (HDFC, Nippon, Quant)

### 📤 Export Options
- **Excel**: Multi-sheet XLSX with projections, summary, SIP breakdown, approaches
- **CSV**: Simple data export
- **PDF**: Comprehensive summary report with charts

### 🌓 Modern UI
- Dark mode by default (light mode available)
- Responsive design (mobile → laptop → monitor)
- Sticky header and KPI cards
- Collapsible sections for clean navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd retirement-planner

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will open at `http://localhost:3000`

## 📖 How to Use

### 1️⃣ **Configure Your Profile**
- Set current age, retirement age, life expectancy
- Enter current savings and monthly investment
- Define annual step-up percentage

### 2️⃣ **Enable Coast FIRE** (Optional)
- Toggle Coast FIRE mode
- Set coast years (portfolio grows untouched)
- Configure coast phase investment mix

### 3️⃣ **Add Life Events**
- **Windfalls**: Bonus, inheritance, property sale
- **Major Expenses**: Home, car, marriage, education
- Automatic tax calculation (12.5% LTCG)

### 4️⃣ **Set Investment Strategy**
- Choose funds for earning phase
- Configure coast phase allocation (if enabled)
- Set withdrawal phase conservative mix

### 5️⃣ **Analyze Results**
- View projections tab for year-by-year breakdown
- Check SIP tracker for fund allocation
- Review summary for comprehensive report
- Export to Excel/CSV/PDF

## 🧮 Calculation Methodology

### Core Formulas

**Earning Phase:**
```
Ending = Starting × (1 + Return) + Annual_Investment + Windfalls - Withdrawals
```

**Coast Phase:**
```
Ending = Starting × (1 + Coast_Return)
```

**Withdrawal Phase:**
```
Ending = Starting × (1 + Retired_Return) - Inflated_Expenses
```

**Real Estate:**
```
Property_Value = Initial_Value × (1.05)^Years_Held
```

**Blended Returns:**
```
Blended = Σ(Fund_Return × Fund_Share) - 2%
```

### Default Configuration
- Current Age: 28 | Retirement: 46 | Life Expectancy: 80
- Current Savings: ₹8L | Monthly SIP: ₹40K | Step-up: 5%
- Coast Period: 7 years (age 46-53)
- Retirement Expenses: ₹1L/month | Inflation: 6%
- Pre-configured life events: Home (35), Car (40), Windfalls (40, 44)

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 with Hooks
- **Build Tool**: Vite 6.0.0 (lightning fast)
- **UI Library**: Chakra UI 2.8.2 (accessible, themeable)
- **Styling**: Emotion (CSS-in-JS)
- **Charts**: Custom SVG-based visualizations
- **Export**: SheetJS (xlsx), jsPDF, html2canvas
- **Icons**: React Icons (Feather)

## 📁 Project Structure

```
src/
├── App.jsx                    # Main app with state management
├── main.jsx                   # Entry point with theme
├── index.css                  # Global styles
├── components/
│   ├── UI.jsx                 # Reusable components
│   ├── InputsTab.jsx          # All input forms
│   ├── ProjectionTab.jsx      # Chart + year-by-year table
│   ├── SIPTab.jsx             # SIP fund breakdown
│   ├── SummaryTab.jsx         # Comprehensive report
│   └── MethodologyTab.jsx     # Documentation
├── hooks/
│   └── useRetirementCalc.js   # Core calculation engine
└── utils/
    ├── calc.js                # Formatting & fund catalog
    ├── export.js              # XLSX/CSV/PDF export
    └── theme.js               # Color constants
```

## 🎯 Key Highlights

✅ **Unique Coast FIRE modeling** - Plan for early retirement with portfolio growth  
✅ **Real estate tracking** - Home purchases as wealth-building assets  
✅ **Lifetime flexibility** - Add events at any age, not just earning phase  
✅ **Conservative assumptions** - 2% return reduction, realistic tax planning  
✅ **Multi-phase strategy** - Different allocations for each life stage  
✅ **30+ fund options** - Pre-configured with realistic returns  
✅ **Visual projections** - Interactive charts and detailed tables  
✅ **Export everything** - Excel, CSV, PDF with one click  
✅ **Responsive design** - Works on mobile, laptop, and large monitors  
✅ **Dark mode** - Easy on the eyes for long planning sessions  

## 🔮 Future Enhancements

- [ ] Monte Carlo simulation for probability analysis
- [ ] Multiple scenarios comparison
- [ ] Social Security/Pension integration
- [ ] Healthcare cost modeling
- [ ] Tax optimization strategies
- [ ] Goal-based planning (travel, hobbies)
- [ ] Inflation rate variations by category
- [ ] Currency support (USD, EUR, etc.)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this for personal or commercial projects.

## ⚠️ Disclaimer

This calculator provides estimates based on assumptions and historical data. Actual results may vary significantly due to market volatility, inflation changes, and life circumstances. **Always consult with a qualified financial advisor** for personalized advice. Past performance does not guarantee future results.

## 💡 Tips for Best Results

1. **Be Conservative**: Use lower return estimates than historical averages
2. **Plan for Inflation**: 6-7% is realistic for India
3. **Add Buffer**: Keep 2-3 years of expenses as emergency fund
4. **Review Annually**: Update assumptions as life changes
5. **Consider Healthcare**: Medical costs increase faster than general inflation
6. **Tax Planning**: Understand LTCG, STCG, and tax-free limits

---

<div align="center">

**Built with ❤️ for financial independence seekers**

[Report Bug](https://github.com/yourusername/retirement-planner/issues) · [Request Feature](https://github.com/yourusername/retirement-planner/issues)

</div>
