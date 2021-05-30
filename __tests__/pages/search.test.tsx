import { render } from '@testing-library/react';
import Search, { getServerSideProps } from 'pages/search';
import { useSession } from 'next-auth/client';

jest.mock('next-auth/client');

describe('Search page', () => {

    const mockSession = (session: boolean) => {
        const mockedSession = session ? {
            expires: "q",
            user: { name: "Name", image: 'imageLink' },
            id: 1
        } : null;
        (useSession as jest.Mock).mockReturnValue([mockedSession, false]);
    };

    test('Page should redirect if no session', async () => {
        mockSession(false);
        const props = await getServerSideProps(null);
        expect(props).toStrictEqual({ redirect: { permanent: false, destination: '/' } });
    });

    test('Page content if no query', async () => {
        mockSession(true);
        const { getByText } = render(<Search searchResults={null} />);

        expect(getByText('Search for starred repositories by @tags'));
    });
});