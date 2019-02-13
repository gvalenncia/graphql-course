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

// Comment mock data
const comments = [
    {id: '1', text: 'That is fucking awesome', author: '3'},
    {id: '2', text: 'This is amazin mate', author: '3'},
    {id: '3', text: 'just remember tis does not work', author: '3'},
    {id: '4', text: 'make the one first thatn the other one', author: '3'}
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
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
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
    Post: {
        author(parent, args, ctx, info){
            return users.find((user)=>{
                return user.id === parent.author
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info){
            return users.find((user)=>{
                return user.id === parent.author
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