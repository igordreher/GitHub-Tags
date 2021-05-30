import { render, fireEvent } from '@testing-library/react';
import Repository from 'components/Repository';

describe('Repository', () => {
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
        expect(getByText(repo.description)).toBeDefined();
        repo.tags.forEach(tag => {
            expect(getByText(tag)).toBeDefined();
        });
        expect(getByText("add @tag")).toBeDefined();
    });

    test('Tag is added', () => {
        const { getByText, getByPlaceholderText } = render(<Repository>{repo}</Repository>);

        const button = getByText('add @tag');
        fireEvent.click(button);
        const input = getByPlaceholderText('tag name');
        fireEvent.change(input, { target: { value: 'new tag' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(getByText('new tag')).toBeDefined();
    });

    test('Tag is deleted', () => {
        const { getByText, getAllByText } = render(<Repository>{repo}</Repository>);

        const tag = getByText('tag1');
        fireEvent.click(tag);
        const closeButton = getAllByText('x')[0];
        fireEvent.mouseDown(closeButton);

        expect(tag).not.toBeInTheDocument();
    });

    test('Tag is edited', () => {
        const { getByText, getByDisplayValue } = render(<Repository>{repo}</Repository>);

        const tag = getByText('tag1');
        fireEvent.click(tag);
        const editableTag = getByDisplayValue('tag1');
        fireEvent.change(editableTag, { target: { value: 'new value' } });
        fireEvent.keyDown(editableTag, { key: 'Enter' });

        expect(getByText('new value')).toBeDefined();
    });

    test('Tag editing is canceled', () => {
        const { getByText, getByDisplayValue, queryByText } = render(<Repository>{repo}</Repository>);

        const tag = getByText('tag1');
        fireEvent.click(tag);
        const editableTag = getByDisplayValue('tag1');
        fireEvent.change(editableTag, { target: { value: 'new value' } });
        fireEvent.focusOut(editableTag);

        const editedTag = queryByText('new value');
        expect(editedTag).not.toBeInTheDocument();
    });
}); 