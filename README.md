# NEXTJS BOILERPLATE

## INSTRUCTIONS

- git clone https://github.com/doom9star/nextjs-boilerplate.git
- ./scripts/setup.sh
- **scripts/vsc.sh** (replace [user], [password], [database])
- **zeus/.env** (replace [user], [password], [database] in DATABASE_URL & fill)
- **apollo/.env** (replace [user], [password], [database] in DATABASE_URL & fill)
- ./scripts/migrate.sh (run initially & whenever you modify **zeus/prisma/schema.prisma**)
- ctrl + shift + p -> Tasks: Run Task -> setup (start)
- ctrl + shift + p -> Tasks: Terminate Task -> setup (stop)

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
