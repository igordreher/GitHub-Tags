import { render } from '@testing-library/react';
import Header from 'components/Header';
import { useSession } from 'next-auth/client';

jest.mock('next-auth/client');

describe('Header', () => {
    const mockSession = (session: boolean) => {
        const mockedSession = session ? {
            expires: "q",
            user: { name: "Name", image: 'imageLink' },
            id: 1
        } : null;
        (useSession as jest.Mock).mockReturnValue([mockedSession, false]);
    };

    test('User menu when session', () => {
        mockSession(true);
        const { getByText, getByAltText } = render(<Header />);

        expect(getByAltText('User Avatar')).toBeDefined();
        expect(getByText('Signed in as Name')).toBeDefined();
        expect(getByText('Sign out')).toBeDefined();
    });

    test('Sign in button when no session', () => {
        mockSession(false);
        const { getByText } = render(<Header />);

        expect(getByText('Sign in')).toBeDefined();
    });
});