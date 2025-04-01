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
│   │   ├── api/            # Backend REST API
│   │   │   └── drivers/    # Drivers API endpoints
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

### REST API
The application includes a complete REST API for driver data with the following endpoints:

- **GET /api/drivers**: Get all drivers with optional filtering and sorting
  - Query parameters:
    - `team`: Filter by team name
    - `name`: Filter by driver name
    - `minWins`: Filter by minimum number of wins
    - `sortBy`: Field to sort by (name, team, races, wins, firstSeason)
    - `sortOrder`: Sort direction (asc, desc)

- **GET /api/drivers/:id**: Get a specific driver by ID

- **POST /api/drivers**: Add a new driver
  - Required fields in request body:
    - `name`: Driver name
    - `team`: Team name
    - `races`: Number of races
    - `wins`: Number of wins
    - `firstSeason`: First season year

- **PATCH /api/drivers**: Update an existing driver
  - Required fields in request body:
    - `id`: Driver ID
  - Optional fields (any field that needs updating):
    - `name`, `team`, `races`, `wins`, `firstSeason`

- **DELETE /api/drivers**: Delete a driver
  - Query parameters:
    - `id`: Driver ID to delete

### Server-side Validation
The API includes comprehensive validation:

- Required fields validation (name, team)
- Numeric validation for races, wins, and firstSeason
- Business logic validation:
  - First season cannot be in the future
  - Wins cannot exceed races

## Testing

The application includes comprehensive unit tests for both the frontend components and the backend API:

### Frontend Tests

- **Component Tests**: Tests for all major components including:
  - AddDriver form validation
  - EditDriver form functionality
  - Driver list rendering
  - Statistics visualization

### Backend API Tests

- **API Endpoint Tests**: Complete coverage of all API endpoints:
  - GET requests with filtering and sorting
  - POST requests with validation
  - PATCH requests for updating driver data
  - DELETE requests for removing drivers

To run the tests:

```bash
# Run all tests
pnpm test

# Run frontend tests only
pnpm test:frontend

# Run backend tests only
pnpm test:backend

# Run tests with code coverage reporting
pnpm test:coverage

# Run backend tests with code coverage reporting
pnpm test:coverage:backend
```

### Code Coverage

The project is set up with Jest code coverage reporting. When you run tests with the coverage flag, a detailed report will be generated showing:

- **Statement Coverage**: Percentage of statements executed
- **Branch Coverage**: Percentage of control structures (if/else, switch) executed
- **Function Coverage**: Percentage of functions called
- **Line Coverage**: Percentage of executable lines executed

Coverage reports are available in multiple formats:
- **Text**: Displayed in the console after tests run
- **HTML**: Generated in the `coverage/lcov-report` directory (open `index.html` to view)
- **LCOV**: For integration with code coverage tools
- **Clover**: For integration with CI/CD pipelines

The current coverage threshold for the API is:
- Statements: >80%
- Branches: >60%
- Functions: >65%
- Lines: >85%

### Notes on Testing

- The backend API tests use custom mocks for Next.js API route testing
- When running tests, some tests may be skipped as they require additional setup or are in development
- If you encounter issues with tests, try running them individually with `pnpm test -- -t "test name"`

The test suite aims to ensure that:
1. All API endpoints correctly handle valid and invalid data
2. All validation rules are properly enforced
3. Proper HTTP status codes are returned
4. Data persistence works as expected within the application session

## Contributing

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Formula One for the inspiration
- Chart.js for the excellent charting library
- Next.js team for the amazing framework
- All contributors and maintainers of the open-source libraries used in this project
