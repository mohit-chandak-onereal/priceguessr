import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/footer';

describe('Footer', () => {
  it('should render brand section', () => {
    render(<Footer />);
    
    expect(screen.getByText('PriceGuessr')).toBeInTheDocument();
    expect(screen.getByText('Test your market knowledge and become a price guessing master!')).toBeInTheDocument();
  });

  it('should render all play links', () => {
    render(<Footer />);
    
    expect(screen.getByRole('link', { name: 'Quick Game' })).toHaveAttribute('href', '/play');
    expect(screen.getByRole('link', { name: 'Categories' })).toHaveAttribute('href', '/categories');
  });

  it('should render all community links', () => {
    render(<Footer />);
    
    expect(screen.getByRole('link', { name: 'Leaderboard' })).toHaveAttribute('href', '/leaderboard');
    expect(screen.getByRole('link', { name: 'Achievements' })).toHaveAttribute('href', '/achievements');
    expect(screen.getByRole('link', { name: 'Your Stats' })).toHaveAttribute('href', '/stats');
  });

  it('should render all more links', () => {
    render(<Footer />);
    
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms');
  });

  it('should render social links', () => {
    render(<Footer />);
    
    const githubLink = screen.getByLabelText('GitHub');
    const twitterLink = screen.getByLabelText('Twitter');
    
    expect(githubLink).toHaveAttribute('href', 'https://github.com');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com');
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render copyright text', () => {
    render(<Footer />);
    
    expect(screen.getByText('© 2024 PriceGuessr. All rights reserved.')).toBeInTheDocument();
  });

  it('should have correct section headings', () => {
    render(<Footer />);
    
    expect(screen.getByText('Play')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('should apply correct styles', () => {
    const { container } = render(<Footer />);
    
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('border-t', 'border-border-subtle', 'bg-surface/50', 'backdrop-blur-md');
  });
});