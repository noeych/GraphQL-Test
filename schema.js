const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema
} = require('graphql');

const User = require('./models/User');  // mongoose 모델

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve() {
                return User.find();  // MongoDB에서 전체 사용자 조회
            }
            },
            user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(_, args) {
                return User.findById(args.id);
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Create
        createUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(_, args) {
                const user = new User({
                name: args.name,
                email: args.email,
                age: args.age
                });
                return user.save();
            }
        },
        // Update
        updateUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            async resolve(_, args) {
                return await User.findByIdAndUpdate(
                    args.id,
                    {
                        name: args.name,
                        email: args.email,
                        age: args.age
                    },
                    { new: true }  // 업데이트된 데이터 반환
                );
            }
        },
        // Delete
        deleteUser: {
            type: UserType,
            args: {
                id: {type: GraphQLID}
            },
            async resolve(_, args) {
                return await User.findByIdAndUpdate(args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
