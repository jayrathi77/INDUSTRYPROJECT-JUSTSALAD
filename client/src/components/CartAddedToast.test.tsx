import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CartAddedToast } from './CartAddedToast';

describe('cart added toast', () => {
  it('shows the added product and a cart shortcut after an item is selected', () => {
    render(<MemoryRouter><CartAddedToast/></MemoryRouter>);
    fireEvent(window, new CustomEvent('just-salad:cart-added', { detail: { productName: 'Superfood Salad' } }));
    expect(screen.getByRole('status')).toHaveTextContent('1 item added to cart');
    expect(screen.getByText('Superfood Salad')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View cart/ })).toHaveAttribute('href', '/cart');
  });
});
