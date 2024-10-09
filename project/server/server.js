import { ApolloServer } from 'apollo-server'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import typeDefs from './schemaGql.js';
import mongoose from 'mongoose';
import { MONGO_URL, JWT_SECRET } from './config.js';
import jwt from 'jsonwebtoken'; 
mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.connection.on("connected",()=>{
    console.log("connected to mongodb")
})

mongoose.connection.on("error",(err)=>{
    console.log("error connecting",err)
})

import resolvers from './resolvers.js';
import './models/Quotes.js'
import './models/User.js'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req})=>{
        const { authorization } = req.headers;
        if(authorization){
         const {userId} = jwt.verify(authorization,JWT_SECRET)
         return {userId}
        }
    },
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});