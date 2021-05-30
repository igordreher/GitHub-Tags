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
        getByText(repo.description);
        repo.tags.forEach(tag => {
            getByText(tag);
        });
        getByText("add @tag");
        !getByText(repo.id);
    });

    // test('');
}); 