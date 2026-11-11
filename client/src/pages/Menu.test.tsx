import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { Menu } from './Menu';
function setup() { render(<QueryClientProvider client={new QueryClient()}><MemoryRouter><Menu/></MemoryRouter></QueryClientProvider>); }
describe('menu', () => {
  it('shows all extracted products by default', () => { setup(); expect(screen.getByText('41 items')).toBeInTheDocument(); });
  it('filters by category and search', () => { setup(); fireEvent.click(within(screen.getByLabelText('Menu categories')).getByRole('button', { name: 'Salads' })); expect(screen.getByText('6 items')).toBeInTheDocument(); fireEvent.change(screen.getByLabelText('Search menu'), { target: { value: 'quinoa' } }); expect(screen.getByText('1 items')).toBeInTheDocument(); });
});
