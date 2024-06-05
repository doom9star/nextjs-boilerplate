# NEXTJS BOILERPLATE

## INSTRUCTIONS

- git clone https://github.com/doom9star/nextjs-boilerplate.git
- chmod +x scripts/setup.sh
- ./scripts/setup.sh
- zeus --> .env.development (replace user, password, database)
- zeus --> .env (fill)
- apollo --> .env.development (replace user, password, database)
- apollo --> .env (fill)
- ./scripts/migrate.sh (migrations - (whenever zeus/prisma is modified))
- ctrl + shift + p --> Tasks: Run Task --> setup (start)
- ctrl + shift + p --> Tasks: Terminate Task --> setup (stop)

## STACK

- Zeus

  - **NextJS** &nbsp;-&nbsp; Framework
  - **TypeScript** &nbsp;-&nbsp; Language
  - **TailwindCSS** &nbsp;-&nbsp; Styling
  - **TRPC** &nbsp;-&nbsp; Communication
  - **Ant Design** &nbsp;-&nbsp; UI
  - **PostgreSQL** &nbsp;-&nbsp; Database
  - **Prisma** &nbsp;-&nbsp; ORM
  - **JWT** &nbsp;-&nbsp; Authentication
  - **Cloudinary** &nbsp;-&nbsp; File Storage

- Apollo
  - **Express** &nbsp;-&nbsp; Framework
  - **Redis** &nbsp;-&nbsp; Caching
  - **Socket.IO** &nbsp;-&nbsp; Real-Time Communication
  - **BullMQ** &nbsp;-&nbsp; Background Task Manager
