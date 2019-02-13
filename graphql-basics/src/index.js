import { GraphQLServer } from 'graphql-yoga'

// Scalar types in graphql: String, Boolean, Int, float, ID

// User mock data
const users = [
    {id: '1', name: 'german', email: 'gvalencia@gmail.com'},
    {id: '2', name: 'andrew', email: 'andrew@example.com'},
    {id: '3', name: 'sara', email: 'sara@example.com'}
]

// Post mock data
const posts = [
    {id: '10', title: 'My first post', body: 'this is my first post', author: '1'},
    {id: '20', title: 'just another post', body: 'this is just another post body mate', author: '1'},
    {id: '30', title: 'have fun', body: 'remember to have fun while coding', author: '2'}
]

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
        author: User!
    }
`

// Resolvers - functions that will be executed for every action or query happening in the api
const  resolvers = {
    Query: {
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
    Post: {
        author(parent, args, ctx, info){
            return users.find((user)=>{
                return user.id === parent.author
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