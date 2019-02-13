import { GraphQLServer } from 'graphql-yoga'
import { userInfo } from 'os';

// Scalar types in graphql: String, Boolean, Int, float, ID

// Demo user data
const users = [{
    id: '1',
    name: 'plinio',
    email: 'plinio@gmail.com',
    age: 35
},{
    id: '2',
    name: 'Andrew',
    email: 'andrew@example.com'
},
{
    id: '3',
    name: 'Sara',
    email: 'sara@example.com'
}]

// Demo post data
const posts = [{
    id: '1',
    title: 'My first post',
    body: 'This is the body of my first post'
},{
    id: '2',
    title: 'just another post',
    body: 'This is the body of just another post'
},
{
    id: '3',
    title: 'have fun post',
    body: 'do not forget to have fun while coding'
}]

// Type definitions (Schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
    }
`

// Resolvers - functions that will be executed for every action or query happening in the api
const  resolvers = {
    Query: {
        users(parent, args, ctx, info){
            if(args.query) {
                return users.filter((user) => {
                    return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
                })
            } else {
                return users
            }  
        },
        posts(parent , args, ctx, info){
            if(args.query){
                return posts.filter((post) => {
                    return post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()) || post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
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
    }
}

// Startin gthe serer
const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('up and running!')
})