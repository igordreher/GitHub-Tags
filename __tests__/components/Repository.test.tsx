import { render, fireEvent } from '@testing-library/react';
import Repository from 'components/Repository';

describe('Repository visual', () => {
    const repo = {
        id: 1,
        description: "desc",
        name: "owner/repo",
        url: "https://github.com/owner/repo",
        tags: ["tag1", "tag2"]
    };

    test('Repository rendered with correct values', () => {
        const { getByText } = render(<Repository>{repo}</Repository>);

        expect(getByText(repo.name)).toHaveAttribute('href', repo.url);
        getByText(repo.description);
        repo.tags.forEach(tag => {
            getByText(tag);
        });
        getByText("add @tag");
    });

    test('Tag is added', () => {
        const { getByText, getByPlaceholderText } = render(<Repository>{repo}</Repository>);

        const button = getByText('add @tag');
        fireEvent.click(button);
        const input = getByPlaceholderText('tag name');
        fireEvent.change(input, { target: { value: 'new tag' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        getByText('new tag');
    });

    test('Tag is deleted', () => {
        const { getByText, getAllByText } = render(<Repository>{repo}</Repository>);

        const tag = getByText('tag1');
        fireEvent.click(tag);
        const closeButton = getAllByText('x')[0];
        fireEvent.mouseDown(closeButton);

        expect(tag).not.toBeInTheDocument();
    });
}); 