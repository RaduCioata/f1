import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DriverProvider } from '../../context/DriverContext';
import AddDriver from '../page';
import { useRouter } from 'next/navigation';
import { useDrivers } from '../../context/DriverContext';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../context/DriverContext', () => ({
  useDrivers: jest.fn(),
  DriverProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('AddDriver', () => {
  const mockRouter = {
    push: jest.fn(),
  };
  const mockDriverContext = {
    addDriver: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useDrivers as jest.Mock).mockReturnValue(mockDriverContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the add driver form', () => {
    render(
      <DriverProvider>
        <AddDriver />
      </DriverProvider>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/team/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first season/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/races/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/wins/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add driver/i })).toBeInTheDocument();
  });

  it('displays validation errors for empty fields', async () => {
    render(
      <DriverProvider>
        <AddDriver />
      </DriverProvider>
    );
    
    // Submit form without filling any fields
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    
    // Check for error messages
    await waitFor(() => {
      expect(screen.getByText(/driver name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/team name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/first season is required/i)).toBeInTheDocument();
      expect(screen.getByText(/number of races is required/i)).toBeInTheDocument();
      expect(screen.getByText(/number of wins is required/i)).toBeInTheDocument();
    });
  });

  it('validates first season is not before 1950 or in future', async () => {
    render(
      <DriverProvider>
        <AddDriver />
      </DriverProvider>
    );
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Driver' } });
    fireEvent.change(screen.getByLabelText(/team/i), { target: { value: 'Test Team' } });
    fireEvent.change(screen.getByLabelText(/races/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/wins/i), { target: { value: '5' } });
    
    // Test past date
    fireEvent.change(screen.getByLabelText(/first season/i), { target: { value: '1949' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/first season cannot be before 1950/i)).toBeInTheDocument();
    });
    
    // Test future date
    const futureYear = new Date().getFullYear() + 1;
    fireEvent.change(screen.getByLabelText(/first season/i), { target: { value: futureYear.toString() } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/first season cannot be after/i)).toBeInTheDocument();
    });
  });

  it('validates wins do not exceed races', async () => {
    render(
      <DriverProvider>
        <AddDriver />
      </DriverProvider>
    );
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Driver' } });
    fireEvent.change(screen.getByLabelText(/team/i), { target: { value: 'Test Team' } });
    fireEvent.change(screen.getByLabelText(/first season/i), { target: { value: '2020' } });
    fireEvent.change(screen.getByLabelText(/races/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/wins/i), { target: { value: '11' } });
    
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/number of wins cannot exceed number of races/i)).toBeInTheDocument();
    });
  });

  it('successfully adds driver and redirects', async () => {
    render(
      <DriverProvider>
        <AddDriver />
      </DriverProvider>
    );
    
    const newDriver = {
      name: 'Lewis Hamilton',
      team: 'Mercedes',
      firstSeason: '2007',
      races: '300',
      wins: '103'
    };
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: newDriver.name } });
    fireEvent.change(screen.getByLabelText(/team/i), { target: { value: newDriver.team } });
    fireEvent.change(screen.getByLabelText(/first season/i), { target: { value: newDriver.firstSeason } });
    fireEvent.change(screen.getByLabelText(/races/i), { target: { value: newDriver.races } });
    fireEvent.change(screen.getByLabelText(/wins/i), { target: { value: newDriver.wins } });
    
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    
    await waitFor(() => {
      expect(mockDriverContext.addDriver).toHaveBeenCalledWith({
        name: newDriver.name,
        team: newDriver.team,
        firstSeason: parseInt(newDriver.firstSeason),
        races: parseInt(newDriver.races),
        wins: parseInt(newDriver.wins)
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/driver-list');
    });
  });
}); 