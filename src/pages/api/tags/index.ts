import { NextApiHandler, NextApiRequest } from 'next';
import { getSession } from 'next-auth/client';
import prisma from 'lib/prisma';

export const getTags = async (ctx) => {
    const session = await getSession(ctx);

    const tagged = await prisma.tag.findMany(
        { where: { userId: session.id } });

    return tagged;
};

const postTag = async (req: NextApiRequest) => {
    const session = await getSession({ req });
    const { repoId, tagName } = req.body;
    const data = { repoId, tagName, userId: session.id as number };
    return await prisma.tag.create({ data });
};

const tagsHandler: NextApiHandler = async (req, res) => {
    const session = await getSession({ req });

    if (!session)
        res.status(401).send('Unauthorized Access');

    if (req.method === 'POST') {
        try {
            const tag = await postTag(req);
            res.status(201).json(tag);
        } catch (error) {
            res.status(500).end();
        }
    }

    res.end();
};

export default tagsHandler;