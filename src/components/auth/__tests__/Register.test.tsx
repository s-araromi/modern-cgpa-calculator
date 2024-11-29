import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import { BrowserRouter } from 'react-router-dom';
import Register from '../Register';
import authService from '../../../services/auth.service';
import type { RegisterResponse } from '../../../types/auth';

jest.mock('../../../services/auth.service', () => ({
  register: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom') as object;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Register Component', () => {
  const renderRegister = () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders registration form', () => {
    renderRegister();

    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('handles successful registration', async () => {
    const mockUser = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const mockResponse: RegisterResponse = {
      token: 'mock-token',
      user: { ...mockUser, id: 1 },
    };

    (authService.register as jest.MockedFunction<typeof authService.register>)
      .mockResolvedValueOnce(mockResponse);

    renderRegister();

    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: mockUser.fullName },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: mockUser.email },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: mockUser.password },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: mockUser.password },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith(mockUser);
      expect(mockNavigate).toHaveBeenCalledWith('/login', {
        state: { message: 'Registration successful! Please login.' },
      });
    });
  });

  it('handles registration error', async () => {
    const errorMessage = 'Email already exists';
    (authService.register as jest.MockedFunction<typeof authService.register>)
      .mockRejectedValueOnce(new Error(errorMessage));

    renderRegister();

    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('validates password match', async () => {
    renderRegister();

    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'differentpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/passwords do not match/i);
    });
  });

  it('validates required fields', () => {
    renderRegister();

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByPlaceholderText(/full name/i)).toBeInvalid();
    expect(screen.getByPlaceholderText(/email/i)).toBeInvalid();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInvalid();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInvalid();
  });

  it('navigates to login page', () => {
    renderRegister();

    fireEvent.click(screen.getByText(/already have an account/i));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
