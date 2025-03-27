import { render, screen, act } from '@testing-library/react';
import { DriverProvider, useDrivers } from '../DriverContext';
import { ReactNode } from 'react';

// Wrapper component to use the context in tests
const TestComponent = ({ children }: { children: ReactNode }) => {
  return <DriverProvider>{children}</DriverProvider>;
};

// Component to test the context
const TestDriverContext = () => {
  const { drivers, addDriver, updateDriver, deleteDriver, getDriver } = useDrivers();
  return (
    <div>
      <div data-testid="drivers-count">{drivers.length}</div>
      <button onClick={() => addDriver({
        name: 'Test Driver',
        team: 'Test Team',
        firstSeason: 2024,
        races: 10,
        wins: 2
      })}>Add Driver</button>
      <button onClick={() => {
        const driver = drivers[0];
        if (driver) {
          updateDriver(driver.id, {
            ...driver,
            wins: driver.wins + 1
          });
        }
      }}>Update Driver</button>
      <button onClick={() => {
        const driver = drivers[0];
        if (driver) {
          deleteDriver(driver.id);
        }
      }}>Delete Driver</button>
      <div data-testid="driver-list">
        {drivers.map(driver => (
          <div key={driver.id}>
            {driver.name} - {driver.wins} wins
          </div>
        ))}
      </div>
    </div>
  );
};

describe('DriverContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should initialize with empty drivers array', () => {
    render(
      <TestComponent>
        <TestDriverContext />
      </TestComponent>
    );

    expect(screen.getByTestId('drivers-count')).toHaveTextContent('0');
  });

  it('should add a new driver', () => {
    render(
      <TestComponent>
        <TestDriverContext />
      </TestComponent>
    );

    act(() => {
      screen.getByText('Add Driver').click();
    });

    expect(screen.getByTestId('drivers-count')).toHaveTextContent('1');
    expect(screen.getByTestId('driver-list')).toHaveTextContent('Test Driver - 2 wins');
  });

  it('should update an existing driver', () => {
    render(
      <TestComponent>
        <TestDriverContext />
      </TestComponent>
    );

    // First add a driver
    act(() => {
      screen.getByText('Add Driver').click();
    });

    // Then update the driver
    act(() => {
      screen.getByText('Update Driver').click();
    });

    expect(screen.getByTestId('driver-list')).toHaveTextContent('Test Driver - 3 wins');
  });

  it('should delete a driver', () => {
    render(
      <TestComponent>
        <TestDriverContext />
      </TestComponent>
    );

    // First add a driver
    act(() => {
      screen.getByText('Add Driver').click();
    });

    expect(screen.getByTestId('drivers-count')).toHaveTextContent('1');

    // Then delete the driver
    act(() => {
      screen.getByText('Delete Driver').click();
    });

    expect(screen.getByTestId('drivers-count')).toHaveTextContent('0');
  });

  it('should persist drivers in localStorage', () => {
    render(
      <TestComponent>
        <TestDriverContext />
      </TestComponent>
    );

    // Add a driver
    act(() => {
      screen.getByText('Add Driver').click();
    });

    // Get the stored data from localStorage
    const storedData = localStorage.getItem('drivers');
    expect(storedData).toBeTruthy();

    // Parse the stored data
    const parsedData = JSON.parse(storedData || '[]');
    expect(parsedData).toHaveLength(1);
    expect(parsedData[0].name).toBe('Test Driver');
  });

  it('should load drivers from localStorage on mount', () => {
    // First, set up some data in localStorage
    const initialDrivers = [{
      id: '1',
      name: 'Stored Driver',
      team: 'Test Team',
      firstSeason: 2024,
      races: 10,
      wins: 2
    }];
    localStorage.setItem('drivers', JSON.stringify(initialDrivers));

    // Then render the component
    render(
      <TestComponent>
        <TestDriverContext />
      </TestComponent>
    );

    expect(screen.getByTestId('drivers-count')).toHaveTextContent('1');
    expect(screen.getByTestId('driver-list')).toHaveTextContent('Stored Driver - 2 wins');
  });
}); 