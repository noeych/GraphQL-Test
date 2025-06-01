const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema');

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(5110, () => {
    console.log('Running on http://localhost:5110/graphql');
});

mongoose.connect('mongodb+srv://user:userpassword@cluster.4ocney1.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster')
    .then(() => console.log('MongoDB 연결 완료'))
    .catch(err => console.error('MongoDB 연결 실패:', err));