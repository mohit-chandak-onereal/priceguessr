import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/layout/header';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    theme: 'dark',
    setTheme: jest.fn(),
  })),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Header', () => {
  const renderHeader = () => {
    return render(<Header />);
  };

  it('should render logo and brand name', () => {
    renderHeader();
    
    expect(screen.getByText('P')).toBeInTheDocument();
    expect(screen.getByText('PriceGuessr')).toBeInTheDocument();
  });

  it('should render navigation links on desktop', () => {
    renderHeader();
    
    expect(screen.getByText('Play')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should have correct link hrefs', () => {
    renderHeader();
    
    const playLink = screen.getByRole('link', { name: 'Play' });
    const leaderboardLink = screen.getByRole('link', { name: 'Leaderboard' });
    const aboutLink = screen.getByRole('link', { name: 'About' });
    
    expect(playLink).toHaveAttribute('href', '/play');
    expect(leaderboardLink).toHaveAttribute('href', '/leaderboard');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('should render theme toggle button', () => {
    renderHeader();
    
    const themeToggle = screen.getByLabelText('Toggle theme');
    expect(themeToggle).toBeInTheDocument();
  });

  it('should toggle theme when button is clicked', () => {
    const { useTheme } = require('next-themes');
    const mockSetTheme = jest.fn();
    useTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    renderHeader();
    
    const themeToggle = screen.getByLabelText('Toggle theme');
    fireEvent.click(themeToggle);
    
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('should render mobile menu button on mobile', () => {
    renderHeader();
    
    const mobileMenuButton = screen.getByLabelText('Open menu');
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it('should apply glass effect styles', () => {
    const { container } = renderHeader();
    
    const header = container.querySelector('header');
    expect(header).toHaveClass('glass');
  });
});