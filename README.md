## Intial Setup

```sh
yarn install
```

```sh
yarn dev
```

- TypeDefs are like your header files
- Resolvers are like your source files
- Models are the schema that you define for mongoDB

## Mutations

- Api request that allows you to modfy data.
- Used in createPost, createComment, likePost, deleteComment, ... routes

## Queries

- Basic Get requests
- Used in getPost, getPosts, ... routes

For some routes, you'll need to set up authentication header.
These are for routes that require to check if the user is authenticated.
Message me if you're having trouble figuring this out.
