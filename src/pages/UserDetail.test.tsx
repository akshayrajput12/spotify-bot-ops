import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui/toast';
import UserDetail from './UserDetail';

// Mock the database service
jest.mock('@/lib/database', () => ({
  UsersService: {
    getUserById: jest.fn()
  }
}));

// Mock the useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

const queryClient = new QueryClient();

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
};

describe('UserDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    renderWithProviders(<UserDetail />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('displays user details for akshayrajput2616@gmail.com', async () => {
    // Mock the user data for akshayrajput2616@gmail.com
    const mockUser = {
      id: '49f4762a-821c-40f6-9275-9908ccaad878',
      name: 'Akshay Rajput',
      email: 'akshayrajput2616@gmail.com',
      phone: '+91 XXXX-XXXX-XX',
      location: 'Mumbai, India',
      joinDate: '23/8/2025',
      kycStatus: 'pending',
      walletBalance: 0.00,
      totalTransactions: 47,
      totalPoints: 12450,
      totalPlaytime: '0h 0m',
      averageSession: '45 minutes',
      lastLogin: 'Never',
      accountAge: '7 months',
      spotifyConnected: true,
      accountType: 'Premium User',
      kycDocuments: []
    };

    // Since we're using mock data for this specific user, we don't need to mock the service

    renderWithProviders(<UserDetail />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Check that user details are displayed
    expect(screen.getByText('Akshay Rajput')).toBeInTheDocument();
    expect(screen.getByText('akshayrajput2616@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('Mumbai, India')).toBeInTheDocument();
    expect(screen.getByText('23/8/2025')).toBeInTheDocument();
    expect(screen.getByText('Pending Review')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Premium User')).toBeInTheDocument();
    expect(screen.getByText('₹0.00')).toBeInTheDocument();
    expect(screen.getByText('47')).toBeInTheDocument();
    expect(screen.getByText('12,450')).toBeInTheDocument();
    expect(screen.getByText('0h 0m')).toBeInTheDocument();
    expect(screen.getByText('45 minutes')).toBeInTheDocument();
    expect(screen.getByText('Never')).toBeInTheDocument();
    expect(screen.getByText('7 months')).toBeInTheDocument();
  });
});