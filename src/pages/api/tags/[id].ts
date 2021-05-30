import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import prisma from 'lib/prisma';

const deleteTag = async (id: number) => {
    await prisma.tag.delete({ where: { id } });
};

const patchTag = async (tagName: string, id: number) => {
    return await prisma.tag.update({ where: { id }, data: { tagName } });
};

const handler: NextApiHandler = async (req, res) => {
    const session = await getSession({ req });
    const { id } = req.query;

    if (!session)
        res.status(401).send('Unauthorized Access');

    else if (req.method === 'DELETE') {
        try {
            await deleteTag(Number(id));
            res.end();
        } catch (error) {
            res.status(500).json(error);
        }
    }
    else if (req.method === 'PATCH') {
        try {
            const { tagName } = req.body;
            const tag = await patchTag(tagName, Number(id));
            res.status(200).json(tag);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
    res.end();
};

export default handler;