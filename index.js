const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString, GraphQLSchema, graphql } = require('graphql');
const users = [
    { id: 1, name: "Ishmam", age: "23" },
    { id: 2, name: "Ali", age: "24" },
    { id: 3, name: "Khan", age: "25" },
    { id: 4, name: "Ishmam ALi Khan", age: "23" },
];
const UserType = new GraphQLObjectType({
    name: 'Users',
    description: "............",
    fields: {
        id: {
            type: GraphQLInt
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLString
        },
    }
})
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: "This is First Graphql Program",
        fields: () => ({
            users: {
                type: new GraphQLList(UserType),
                resolve: (parent, args) => {
                    return users;
                }
            },
            user: {
                type: UserType,
                args: {
                    id: {
                        type: GraphQLInt
                    }
                },
                resolve: (parent, { id }) => {
                    const user = users.filter(user => user.id == id)
                    return user[0];
                }
            },
        })
    })
});


const app = express();
app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

app.get('/', (req, res) => {
    const query = `query {users{id name age}}`;
    graphql(schema, "{users{id,name,age}}", query)
        .then(response => {
            res.send(response)
        })
        .catch(error => res.send(error))
});

app.get('/:id', (req, res) => {
    const query = `query {user(id:${req.params.id}){id name age}}`;
    graphql(schema, query)
        .then(response => {
            res.send(response)
        })
        .catch(error => res.send(error))
})

app.listen(3000, () => {
    console.log("Listening at Port No 3000")
})