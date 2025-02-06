# [Lockscript Vault](https://vault.lockscript.dev)

LockScript Vault is an open-source secure vault for passwords, cards, notes, and pins.

## Tech Stack
- NextJS
- TailwindCSS
- Typescript
- ShadCN
- Prisma
- Zod

## Getting Started

Clone the repository
```bash
git clone git@github.com:Lockscript/Lockscript-Vault
```
```bash
cd Lockscript-Vault
```

Repo is using yarn as a package manager. 

[How To Install Yarn](https://classic.yarnpkg.com/lang/en/docs/install)

Install dependencies
```bash
yarn install
```

### Setup local database (if required)

Start Docker container (requires [Docker](https://docs.docker.com/engine/install/))

```bash
docker compose -f ./local-database.yml up -d
```
Generate database client

```bash
yarn run generate
```
```bash
yarn run push
```

### Start the dev server
```bash
yarn run dev
```


## How to contribute

We accept contributions from the community, but you must follow some rules:

1. Document your changes.
2. Specifically state ANY new dependencies you have added.
3. Test your changes.