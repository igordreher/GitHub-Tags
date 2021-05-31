import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/client";

interface Repo {
    id: Number;
    full_name: String;
    description: String;
    svn_url: String;
}

export const getStarredRepos = async (ctx: GetServerSidePropsContext) => {
    const session = await getSession(ctx);
    const q = ctx.query.q as string || '';
    const name = session.user.name.replace(' ', '');
    const { data } = await axios.get<Repo[]>(`https://api.github.com/users/${name}/starred`, {
        headers: {
            'Authorization': process.env.GITHUB_SECRET
        }
    });

    const filter = q.charAt(0) != '@' ? data.filter((repo) => {
        return repo.full_name.toLowerCase().includes(q.toLowerCase() as string);
    }) : data;

    return filter.map((repo) => {
        const { id, description, full_name, svn_url } = repo;
        return { id, description, name: full_name, url: svn_url };
    });
};
