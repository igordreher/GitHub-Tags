This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## Getting Started

- In order to run the app locally, you need to create e [GitHub App](https://docs.github.com/en/developers/apps/building-github-apps/authenticating-with-github-apps).
- You need to set the GitHub App's Homepage URL to http://localhost:3000/ and the Authorization callback URL to http://localhost:3000/api/auth/callback, respectively.

When done, create a .env.local file in the root of the folder
replacing with your GitHub App id & secret:

```bash
# .env.local

GITHUB_ID=<Your GitHub App id>
GITHUB_SECRET=<Your GitHub App secret>
NEXTAUTH_URL=http://localhost:3000
```

Run the Docker containers:

```bash
docker-compose up
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.  

### Tests
   
Run tests inside docker container:

```bash
docker exec -it github-tags yarn test
```

To run test locally, you first need to install dependencies:

```bash
npm i
# or
yarn 
```
Then:

```bash
npm run test
# or
yarn test
```

