import { render, screen, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../AuthContext';
import authService from '../../../services/auth.service';
import type { LoginResponse } from '../../../types/auth';
import userEvent from '@testing-library/user-event';

jest.mock('../../../services/auth.service', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom') as object;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ to, children }: { to: string, children: React.ReactNode }) => (
      <a href={to} onClick={(e) => {
        e.preventDefault();
        mockNavigate(to);
      }}>{children}</a>
    ),
  };
});

describe('Login Component', () => {
  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', async () => {
    renderLogin();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    const mockResponse: LoginResponse = {
      token: 'mock-token',
      user: {
        id: 1,
        email: 'test@example.com',
        fullName: 'Test User',
      },
    };

    (authService.login as jest.MockedFunction<typeof authService.login>)
      .mockResolvedValueOnce(mockResponse);
    
    renderLogin();

    const emailInput = await waitFor(() => screen.getByPlaceholderText(/email/i));
    const passwordInput = await waitFor(() => screen.getByPlaceholderText(/password/i));
    const submitButton = await waitFor(() => screen.getByRole('button', { name: /sign in/i }));

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  }, 30000);

  it('handles login error', async () => {
    const errorMessage = 'Invalid credentials';
    (authService.login as jest.MockedFunction<typeof authService.login>)
      .mockRejectedValueOnce(new Error(errorMessage));

    renderLogin();

    const emailInput = await waitFor(() => screen.getByPlaceholderText(/email/i));
    const passwordInput = await waitFor(() => screen.getByPlaceholderText(/password/i));
    const submitButton = await waitFor(() => screen.getByRole('button', { name: /sign in/i }));

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  }, 30000);

  it('validates required fields', async () => {
    renderLogin();

    const submitButton = await waitFor(() => screen.getByRole('button', { name: /sign in/i }));
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/email/i)).toBeInvalid();
      expect(screen.getByPlaceholderText(/password/i)).toBeInvalid();
    });
  }, 30000);

  it('navigates to register page', async () => {
    renderLogin();

    const registerLink = await waitFor(() => 
      screen.getByRole('link', { name: /don't have an account\? sign up/i })
    );

    await userEvent.click(registerLink);
    expect(mockNavigate).toHaveBeenCalledWith('/register');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  }, 30000);
});
