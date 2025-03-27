import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditDriver from '../page';
import { useRouter, useParams } from 'next/navigation';
import { useDrivers, DriverProvider } from '../../../context/DriverContext';

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn()
}));

// Mock the DriverContext
jest.mock('../../../context/DriverContext', () => ({
  useDrivers: jest.fn(),
  DriverProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('EditDriver', () => {
  const mockRouter = { push: jest.fn() };
  const mockDriver = {
    id: '1',
    name: 'Max Verstappen',
    team: 'Red Bull Racing',
    firstSeason: 2015,
    races: 100,
    wins: 50
  };

  const mockDriverContext = {
    getDriver: jest.fn().mockReturnValue(mockDriver),
    updateDriver: jest.fn(),
    deleteDriver: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useDrivers as jest.Mock).mockReturnValue(mockDriverContext);
    // Mock window.confirm
    window.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders edit driver form with existing data', () => {
    render(
      <DriverProvider>
        <EditDriver />
      </DriverProvider>
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue(mockDriver.name);
    expect(screen.getByLabelText(/team/i)).toHaveValue(mockDriver.team);
    expect(screen.getByLabelText(/first season/i)).toHaveValue(mockDriver.firstSeason);
    expect(screen.getByLabelText(/number of races/i)).toHaveValue(mockDriver.races);
    expect(screen.getByLabelText(/number of wins/i)).toHaveValue(mockDriver.wins);
  });

  it('displays validation errors for empty fields', async () => {
    render(
      <DriverProvider>
        <EditDriver />
      </DriverProvider>
    );
    
    // Clear all fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/team/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/first season/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/number of races/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/number of wins/i), { target: { value: '' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    
    // Check for error messages
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/team is required/i)).toBeInTheDocument();
      expect(screen.getByText(/first season is required/i)).toBeInTheDocument();
      expect(screen.getByText(/races is required/i)).toBeInTheDocument();
      expect(screen.getByText(/wins is required/i)).toBeInTheDocument();
    });
  });

  it('validates first season is not before 1950 or in future', async () => {
    render(
      <DriverProvider>
        <EditDriver params={{ id: '1' }} />
      </DriverProvider>
    );

    // Set future year
    fireEvent.change(screen.getByLabelText(/first season/i), { target: { value: '2026' } });

    fireEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(screen.getByText(/first season cannot be in the future/i)).toBeInTheDocument();
    });
  });

  it('validates wins do not exceed races', async () => {
    render(
      <DriverProvider>
        <EditDriver />
      </DriverProvider>
    );
    
    fireEvent.change(screen.getByLabelText(/number of races/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/number of wins/i), { target: { value: '11' } });
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/wins cannot exceed races/i)).toBeInTheDocument();
    });
  });

  it('successfully updates driver and redirects', async () => {
    render(
      <DriverProvider>
        <EditDriver />
      </DriverProvider>
    );
    
    const updatedDriver = {
      name: 'Lewis Hamilton',
      team: 'Mercedes',
      firstSeason: '2007',
      races: '300',
      wins: '103'
    };
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: updatedDriver.name } });
    fireEvent.change(screen.getByLabelText(/team/i), { target: { value: updatedDriver.team } });
    fireEvent.change(screen.getByLabelText(/first season/i), { target: { value: updatedDriver.firstSeason } });
    fireEvent.change(screen.getByLabelText(/number of races/i), { target: { value: updatedDriver.races } });
    fireEvent.change(screen.getByLabelText(/number of wins/i), { target: { value: updatedDriver.wins } });
    
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    
    await waitFor(() => {
      expect(mockDriverContext.updateDriver).toHaveBeenCalledWith(mockDriver.id, {
        name: updatedDriver.name,
        team: updatedDriver.team,
        firstSeason: parseInt(updatedDriver.firstSeason),
        races: parseInt(updatedDriver.races),
        wins: parseInt(updatedDriver.wins)
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/driver-list');
    });
  });

  it('successfully deletes driver and redirects', async () => {
    render(
      <DriverProvider>
        <EditDriver />
      </DriverProvider>
    );
    
    fireEvent.click(screen.getByRole('button', { name: /delete driver/i }));
    
    await waitFor(() => {
      expect(mockDriverContext.deleteDriver).toHaveBeenCalledWith(mockDriver.id);
      expect(mockRouter.push).toHaveBeenCalledWith('/driver-list');
    });
  });
}); 