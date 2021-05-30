import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from "next-auth/adapters";
import prisma from 'lib/prisma';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

const options: NextAuthOptions = {
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            scope: '(read:user)',
        })
    ],
    callbacks: {
        session: async (session, user) => {
            session.id = user.id;
            return Promise.resolve(session);
        }
    },
    adapter: Adapters.Prisma.Adapter({ prisma })
};

export default authHandler;