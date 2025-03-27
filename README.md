# Formula One Statistics Dashboard

A modern, interactive dashboard for visualizing Formula One driver statistics. Built with Next.js, TypeScript, and Chart.js, this application provides a comprehensive view of F1 driver performance data with interactive visualizations.

## Features

- **Interactive Driver Selection**: Select multiple drivers to compare their statistics across different metrics
- **Dynamic Charts**:
  - Team Distribution: Visualize the distribution of drivers across different F1 teams
  - Win Distribution: Compare win counts among drivers
  - Experience Trend: Analyze the relationship between driver experience and performance
  - Driver Comparison: Radar chart comparing selected drivers across multiple metrics
- **Real-time Updates**: All charts update instantly when selecting or deselecting drivers
- **Responsive Design**: Fully responsive layout that works on desktop and mobile devices
- **Modern UI**: Clean, modern interface with a Formula One-inspired color scheme

## Technologies Used

- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Visualization**: Chart.js with React-ChartJS-2
- **State Management**: React Context API
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/formulaone.git
cd formulaone
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
formulaone/
├── src/
│   ├── app/
│   │   ├── add-driver/     # Add new driver form
│   │   ├── driver-list/    # Main driver list page
│   │   ├── edit-driver/    # Edit driver form
│   │   ├── statistics/     # Statistics dashboard
│   │   └── context/        # React Context for state management
│   ├── components/         # Reusable components
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
└── package.json          # Project dependencies
```

## Features in Detail

### Driver Management
- Add new drivers with detailed statistics
- Edit existing driver information
- View comprehensive driver list

### Statistics Dashboard
- **Team Distribution**: Pie chart showing the distribution of drivers across teams
- **Win Distribution**: Bar chart displaying top 10 drivers by wins
- **Experience Trend**: Line chart showing average races by first season
- **Driver Comparison**: Radar chart comparing selected drivers across:
  - Total Wins
  - Total Races
  - Win Rate

### Interactive Features
- Select multiple drivers to compare their statistics
- All charts update dynamically based on selection
- Responsive layout adapts to different screen sizes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Formula One for the inspiration
- Chart.js for the excellent charting library
- Next.js team for the amazing framework
- All contributors and maintainers of the open-source libraries used in this project
