import { NextApiHandler, NextApiRequest } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '../../lib/prisma';

export const getTags = async (ctx, tagName: string) => {
    const session = await getSession(ctx);

    const tagged = await prisma.tag.findMany(
        { where: { userId: session.id, tagName } });

    return tagged;
};

const postTag = async (req: NextApiRequest) => {
    const session = await getSession({ req });
    const { repoId, tagName } = req.body;
    const data = { repoId, tagName, userId: session.id as number };
    await prisma.tag.create({ data });
};

const tagsHandler: NextApiHandler = async (req, res) => {
    if (req.method === 'POST') {
        await postTag(req);
        res.status(201);
    }
};

export default tagsHandler;