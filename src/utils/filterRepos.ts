interface Repository {
    id: number | Number;
}

interface Tag {
    id: number;
    repoId: number;
    tagName: string;
}

export default (starredRepos: Repository[], tags: Tag[], tagName: string) => {
    const regex = RegExp(`^(${tagName}).*`, 'i');

    if (tags.length == 0) return starredRepos;

    const filter = tagName ? starredRepos.filter(repo => {
        return tags.some(tag => {
            return tag.repoId === repo.id && tag.tagName.match(regex);
        });
    }) : starredRepos;

    const taggedRepos = () => {
        return filter.map(repo => {
            const repoTags = [];
            tags.forEach(tag => {
                if (tag.repoId == repo.id)
                    repoTags.push({ name: tag.tagName, id: tag.id });
            });

            return { ...repo, tags: repoTags };
        });
    };
    return taggedRepos();
};