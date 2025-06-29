import { render, screen } from '@testing-library/react';
import { MainLayout } from '@/components/layout/main-layout';
import { ThemeProvider } from '@/contexts/theme-provider';

// Mock the Header component
jest.mock('@/components/layout/header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

// Mock the ToastContainer component
jest.mock('@/components/ui/toast', () => ({
  ToastContainer: () => null,
}));

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    theme: 'dark',
    setTheme: jest.fn(),
  })),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('MainLayout', () => {
  it('should render header and children', () => {
    render(
      <ThemeProvider>
        <MainLayout>
          <div data-testid="content">Test Content</div>
        </MainLayout>
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    const { container } = render(
      <ThemeProvider>
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      </ThemeProvider>
    );
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('min-h-screen', 'flex', 'flex-col', 'bg-background');
    
    const main = container.querySelector('main');
    expect(main).toHaveClass('flex-1');
  });

  it('should render children inside main element', () => {
    render(
      <ThemeProvider>
        <MainLayout>
          <section data-testid="section">Section Content</section>
        </MainLayout>
      </ThemeProvider>
    );
    
    const main = screen.getByRole('main');
    const section = screen.getByTestId('section');
    
    expect(main).toContainElement(section);
  });
});