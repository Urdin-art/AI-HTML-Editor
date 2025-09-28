import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SimpleCounter from '../../components/SimpleCounter';

describe('SimpleCounter', () => {
    it('should render the counter and increment on click', () => {
        render(<SimpleCounter />);
        
        expect(screen.getByText('Count: 0')).toBeInTheDocument();

        const button = screen.getByText('Increment');
        fireEvent.click(button);

        expect(screen.getByText('Count: 1')).toBeInTheDocument();
    });
});
