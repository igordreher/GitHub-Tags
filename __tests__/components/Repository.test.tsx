import { render, fireEvent, waitFor } from '@testing-library/react';
import Repository from 'components/Repository';
import api from 'services/api';


describe('Repository', () => {
    const repo = {
        id: 1,
        description: "desc",
        name: "owner/repo",
        url: "https://github.com/owner/repo",
        tags: [{ name: "tag1", id: 1 }, { name: "tag2", id: 2 }]
    };

    test('Repository rendered with correct values', () => {
        const { getByText } = render(<Repository>{repo}</Repository>);

        expect(getByText(repo.name)).toHaveAttribute('href', repo.url);
        expect(getByText(repo.description));
        repo.tags.forEach(tag => {
            expect(getByText(tag.name));
        });
        expect(getByText("add @tag"));
    });

    test('Tag is added', async () => {
        const { getByText, getByPlaceholderText } = render(<Repository>{repo}</Repository>);

        api.post = jest.fn(() => Promise.resolve({
            data: { id: 3, tagName: 'new tag', repoId: 1 }
        }) as any);

        const button = getByText('add @tag');
        fireEvent.click(button);
        const input = getByPlaceholderText('tag name');
        fireEvent.change(input, { target: { value: 'new tag' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        await waitFor(() => {
            expect(getByText('new tag'));
            expect(api.post).toBeCalledWith('/tags', { repoId: 1, tagName: 'new tag' });
        });
    });

    test('Tag is deleted', async () => {
        const { getByText, getAllByText } = render(<Repository>{repo}</Repository>);

        api.delete = jest.fn();

        const tag = getByText('tag1');
        fireEvent.click(tag);
        const closeButton = getAllByText('x')[0];
        fireEvent.mouseDown(closeButton);

        await waitFor(() => {
            expect(tag).not.toBeInTheDocument();
            expect(api.delete).toBeCalledWith('/tags/' + 1);
        });
    });

    test('Tag is edited', async () => {
        const { getByText, getByDisplayValue } = render(<Repository>{repo}</Repository>);

        api.patch = jest.fn(() => Promise.resolve({
            data: { id: 1, tagName: 'new value', repoId: 1 }
        }) as any);

        const tag = getByText('tag1');
        fireEvent.click(tag);
        const editableTag = getByDisplayValue('tag1');
        fireEvent.change(editableTag, { target: { value: 'new value' } });
        fireEvent.keyDown(editableTag, { key: 'Enter' });

        await waitFor(() => {
            expect(getByText('new value'));
            expect(api.patch).toBeCalledWith('/tags/' + 1, { tagName: 'new value' });
        });
    });

    test('Tag editing is canceled', () => {
        const { getByText, getByDisplayValue, queryByText } = render(<Repository>{repo}</Repository>);

        api.patch = jest.fn();

        const tag = getByText('tag1');
        fireEvent.click(tag);
        const editableTag = getByDisplayValue('tag1');
        fireEvent.change(editableTag, { target: { value: 'new value' } });
        fireEvent.focusOut(editableTag);

        const editedTag = queryByText('new value');
        expect(editedTag).not.toBeInTheDocument();
        expect(api.patch).not.toBeCalled();
    });
}); 