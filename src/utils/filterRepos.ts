interface Repository {
    id: number | Number;
}

interface Tag {
    repoId: number;
    tagName: string;
}

export default (starredRepos: Repository[], tags: Tag[], tagName: string) => {
    const regex = RegExp(`^(${tagName}).*`, 'i');

    if (tags.length == 0) return starredRepos;

    const filter = starredRepos.filter(repo => {
        return tags.some(tag => {
            return tag.repoId === repo.id && tag.tagName.match(regex);
        });
    });

    const tagRepos = () => {
        return filter.map(repo => {
            const repoTags = [];
            tags.forEach(tag => {
                if (tag.repoId == repo.id)
                    repoTags.push(tag.tagName);
            });

            return { ...repo, tags: repoTags };
        });
    };
    return tagRepos();
};