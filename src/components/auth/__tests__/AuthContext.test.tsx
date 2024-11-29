import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../AuthContext';
import authService from '../../../services/auth.service';
import type { User } from '../../../types/auth';

jest.mock('../../../services/auth.service', () => ({
  getCurrentUser: jest.fn(),
}));

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  fullName: 'Test User',
};

const TestComponent = () => {
  const { user, loading, error, logout } = useAuth();

  if (loading) return <div data-testid="loading">Loading...</div>;
  if (error) return <div data-testid="error">{error}</div>;
  if (!user) return <div data-testid="not-logged-in">Not logged in</div>;

  return (
    <div>
      <div data-testid="user-info">Logged in as {user.email}</div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderWithAuth = () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('shows loading state initially', () => {
    (authService.getCurrentUser as jest.MockedFunction<typeof authService.getCurrentUser>)
      .mockImplementationOnce(() => new Promise(() => {}));

    renderWithAuth();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('shows authenticated state when user is logged in', async () => {
    (authService.getCurrentUser as jest.MockedFunction<typeof authService.getCurrentUser>)
      .mockResolvedValueOnce(mockUser);

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent(`Logged in as ${mockUser.email}`);
    }, { timeout: 15000 });
  }, 20000);

  it('shows unauthenticated state when no user is logged in', async () => {
    (authService.getCurrentUser as jest.MockedFunction<typeof authService.getCurrentUser>)
      .mockRejectedValueOnce(new Error('No token found'));

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId('not-logged-in')).toBeInTheDocument();
    });
  });

  it('handles logout correctly', async () => {
    (authService.getCurrentUser as jest.MockedFunction<typeof authService.getCurrentUser>)
      .mockResolvedValueOnce(mockUser);

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent(`Logged in as ${mockUser.email}`);
    });

    fireEvent.click(screen.getByText(/logout/i));

    await waitFor(() => {
      expect(screen.getByTestId('not-logged-in')).toBeInTheDocument();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  it('shows error state when getCurrentUser fails', async () => {
    const errorMessage = 'Failed to get user';
    (authService.getCurrentUser as jest.MockedFunction<typeof authService.getCurrentUser>)
      .mockRejectedValueOnce(new Error(errorMessage));

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
    });
  });
});
