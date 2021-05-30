import filterRepos from 'utils/filterRepos';


describe('Repo Filter', () => {
    const starredRepos = [
        { id: 0, name: 'repo0' },
        { id: 1, name: 'repo1' },
        { id: 2, name: 'repo2' },
    ];

    const tags = [
        { id: 0, repoId: 0, tagName: 'tag0' },
        { id: 1, repoId: 0, tagName: 'tag1' },
        { id: 2, repoId: 1, tagName: 'tag1' },
    ];


    const allTaggedRepos = [
        { id: 0, name: 'repo0', tags: [{ id: 0, name: 'tag0' }, { id: 1, name: 'tag1' }] },
        { id: 1, name: 'repo1', tags: [{ id: 2, name: 'tag1' }] },
    ];

    const allReposTagged = allTaggedRepos.concat([{ id: 2, name: 'repo2', tags: [] }]);

    const testFilterRepos = (tagName) => {
        return filterRepos(starredRepos, tags, tagName);
    };

    it('Should correctly filter repositories', () => {
        expect(testFilterRepos('tag')).toStrictEqual(allTaggedRepos);
        expect(testFilterRepos('tag1')).toStrictEqual(allTaggedRepos);
        expect(testFilterRepos('ag1')).toStrictEqual([]);
        expect(testFilterRepos('')).toStrictEqual(allReposTagged);
    });
});
