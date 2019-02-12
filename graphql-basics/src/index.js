import { GraphQLServer } from 'graphql-yoga'

// Type definitions (Schema)
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`

// Resolvers - functions that will be executed for every action or query happening in the api
const  resolvers = {
    Query: {
        hello() {
            return 'hello, this is my first query!'
        },
        name() {
            return 'German'
        },
        location(){
            return 'Bogota'
        },
        bio(){
            return 'Superman'
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