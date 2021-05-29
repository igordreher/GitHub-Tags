import { NextApiHandler, NextApiRequest } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '../../lib/prisma';

export const getTaggedRepos = async (props) => {
    const session = await getSession(props);
    const q = props.query.q as string || '';
    const tagName = q.startsWith('@') ? q.substr(1, -1) : '';

    const tagged = await prisma.taggedRepositories.findMany(
        { where: { userId: session.id, tagName } });

    return tagged;
};

const postTaggedRepo = async (req: NextApiRequest) => {
    const session = await getSession({ req });
    const { repoId, tagName } = req.body;
    const data = { repoId, tagName, userId: session.id as number };
    await prisma.taggedRepositories.create({ data });
};

const tagsHandler: NextApiHandler = async (req, res) => {
    if (req.method === 'post') {
        await postTaggedRepo(req);
        res.status(201);
    }
};

export default tagsHandler;