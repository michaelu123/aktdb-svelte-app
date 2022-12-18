This is a frontend for a database. There exists a vue frontend in the repository aktivendb. This here is a rewrite with Svelte-Kit, Tailwind, and Skeleton.
The database is about members and teams and a many-to-many relationship between them.
Note that AllMembers.svelte and AllTeams.svelte, as well as MemberForm.svelte and TeamForm.svelte are very much the inverse of each other, with the words team and member interchanged.
I modified node_modules/@brainandbones/skeleton/utilities/DataTable/DataTable.js a little bit.
The project should be modified to use @skeletonlabs instead of @brainandbones, and there is a different version of DataTable anyway, marked as experimental.

The rest of this README comes from the initial Svelte installation.









# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
