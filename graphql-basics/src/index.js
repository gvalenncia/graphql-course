import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Scalar types in graphql: String, Boolean, Int, float, ID

// User mock data
let users = [
    {id: '1', name: 'german', email: 'gvalencia@gmail.com'},
    {id: '2', name: 'andrew', email: 'andrew@example.com'},
    {id: '3', name: 'sara', email: 'sara@example.com'}
]

// Post mock data
let posts = [
    {id: '10', title: 'My first post', body: 'this is my first post', author: '1'},
    {id: '20', title: 'just another post', body: 'this is just another post body mate', author: '1'},
    {id: '30', title: 'have fun', body: 'remember to have fun while coding', author: '2'}
]

// Comment mock data
let comments = [
    {id: '1', text: 'That is fucking awesome', author: '3', post: '10'},
    {id: '2', text: 'This is amazin mate', author: '3', post: '10'},
    {id: '3', text: 'just remember tis does not work', author: '3', post: '30'},
    {id: '4', text: 'make the one first thatn the other one', author: '3', post: '30'}
]

// Type definitions (Schema)
const typeDefs = `
    type Query {
        comments: [Comment!]!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
    }

    type Mutation {
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User! 
        createPost(data: CreatePostInput): Post!
        createComment(data: CreateCommentInput): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        post: ID!
        author: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers - functions that will be executed for every action or query happening in the api
const  resolvers = {
    Query: {
        comments() {
            return comments
        },
        users(parent, args, ctx, info){
            if(args.query){
                return users.filter((user) => {
                    return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
                })
            } else {
                return users
            }
        },
        posts(parent, args, ctx, info){
            if(args.query){
                return posts.filter((post) => {
                    return post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()) 
                    || post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
                })
            } else {
                return posts
            }
        },
        me(){
            return {
                id: '123456',
                name: 'German',
                email: 'gvalenncia@gmail.com'
            }
        },
        post(){
            return {
                id: '888',
                title: 'new post',
                body: 'asdfasdf'
            }
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info){
            const emailTaken = users.some((user) => {
                return user.email === args.data.email
            })

            if(emailTaken){
                throw new Error('The email is already taken')
            } else {

                const user = {
                    id: uuidv4(),
                    ...args.data
                }

                users.push(user)
                return user
            }
        },
        deleteUser(parent, args, ctx, info){
            const userIndex = users.findIndex((user)=> user.id === args.id)

            if(userIndex === -1){
                throw new Error('User not found')
            } else {
                const deletedUser = users.splice(userIndex, 1)
                posts = posts.filter((post) => {
                    const match = post.author === args.id
                    if(match){
                        comments = comments.filter((comment) => comment.post !== post.id )
                    }
                    return !match
                })
                comments = comments.filter((comment)=> comment.author!== args.id )

                return deletedUser[0]
            }
        },
        createPost(parent, args, ctx, info){
            const userExists = users.some((user) => user.id === args.data.author)
            
            if(!userExists) {
                throw new Error('User not found')
            } else {
                const post = {
                    id: uuidv4(),
                    ...args.data
                }

                posts.push(post)
                return post
            }
        },
        createComment(parent, args, ctx, info){
            const userExists = users.some((user) => user.id === args.data.author)
            const postExists = posts.some((post) => post.id === args.data.post)

            if(!userExists || !postExists){
                throw new Error('The author or the post do not exist')
            } else {
                const comment = {
                    id: uuidv4(),
                    ...args.data
                }

                comments.push(comment)
                return comment
            }

        }
    },
    Post: {
        author(parent, args, ctx, info){
            return users.find((user)=>{
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info){
            return users.find((user)=>{
                return user.id === parent.author
            })
        },
        post(parent, args, ctx,  info){
            return posts.find((post)=>{
                return post.id === parent.post
            })
        }
    },
    User: {
        posts(parent, args, ctx, info){
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    }
}

// Starting the server
const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('up and running!')
})