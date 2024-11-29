import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';
import { AuthProvider } from '../auth/AuthContext';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock user data
const mockUser = {
  id: 1,
  email: 'test@example.com',
  fullName: 'Test User',
};

const mockLogout = jest.fn();

// Mock AuthContext
jest.mock('../auth/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: mockUser,
    logout: mockLogout,
  }),
}));

describe('Dashboard Component', () => {
  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information', () => {
    renderDashboard();
    expect(screen.getByText(`Welcome, ${mockUser.fullName}`)).toBeInTheDocument();
  });

  it('handles logout correctly', async () => {
    renderDashboard();
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await userEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('changes tab and navigates when clicking tab buttons', async () => {
    renderDashboard();
    
    const calculatorButton = screen.getByRole('button', { name: /cgpa calculator/i });
    await userEvent.click(calculatorButton);
    expect(mockNavigate).toHaveBeenCalledWith('/calculator');

    const converterButton = screen.getByRole('button', { name: /cgpa converter/i });
    await userEvent.click(converterButton);
    expect(mockNavigate).toHaveBeenCalledWith('/converter');
  });

  it('displays tooltips on hover', async () => {
    renderDashboard();
    
    const calculatorButton = screen.getByRole('button', { name: /cgpa calculator/i });
    await userEvent.hover(calculatorButton);
    expect(screen.getByText('Calculate your CGPA with course grades and units')).toBeInTheDocument();
  });

  it('highlights active tab', async () => {
    renderDashboard();
    
    const calculatorButton = screen.getByRole('button', { name: /cgpa calculator/i });
    await userEvent.click(calculatorButton);
    expect(calculatorButton).toHaveClass('bg-indigo-600 text-white');

    const converterButton = screen.getByRole('button', { name: /cgpa converter/i });
    await userEvent.click(converterButton);
    expect(converterButton).toHaveClass('bg-indigo-600 text-white');
    expect(calculatorButton).not.toHaveClass('bg-indigo-600 text-white');
  });
});
