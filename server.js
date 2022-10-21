require("dotenv").config()
const { ApolloServer } = require("apollo-server")
const { default: mongoose } = require("mongoose")
const resolvers = require("./graphql/resolvers")
const typeDefs = require("./graphql/typeDefs")
const { ApolloServerPluginLandingPageDisabled } = require("apollo-server-core")

const server = new ApolloServer({
    typeDefs,
    resolvers
    // csrfPrevention: true,
    // plugins: [ApolloServerPluginLandingPageDisabled()],
    // cors: {
    //     origin: "*",
    //     "access-control-request-headers": "content-type"
    // }
})

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongo Connection Successful")
        return server.listen({ port: process.env.PORT })
    })
    .then((res) => {
        console.log("Server running at! :>> ", res.url)
    })
