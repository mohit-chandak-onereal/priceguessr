import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/layout/header';
import { AuthProvider } from '@/contexts/auth-context';

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
    return render(
      <AuthProvider>
        <Header />
      </AuthProvider>
    );
  };

  it('should render logo and brand name', () => {
    renderHeader();
    
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('PriceGuessr')).toBeInTheDocument();
  });

  it('should render navigation links on desktop', () => {
    renderHeader();
    
    expect(screen.getByText('Play Now!')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('should have correct link hrefs', () => {
    renderHeader();
    
    const playLink = screen.getByRole('link', { name: 'Play Now!' });
    const logoLink = screen.getByRole('link', { name: /PriceGuessr/i });
    
    expect(playLink).toHaveAttribute('href', '/play');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should render sound toggle button', () => {
    renderHeader();
    
    const soundToggle = screen.getByLabelText(/sounds/i);
    expect(soundToggle).toBeInTheDocument();
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