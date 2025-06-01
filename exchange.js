const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLSchema
} = require('graphql');

const ExchangeRate = require('./models/ExchangeRate');

// 환율정보
const ExchangeInfo = new GraphQLObjectType({
    name: 'ExchangeInfo',
    fields: () => ({
        // 소스통화
        src: { type: GraphQLString },
        // 타겟통화
        tgt: { type: GraphQLString },
        // 환율 
        rate: { type: GraphQLFloat },
        // 기준일, 값이 없으면, 최신일자의 환율을 응답
        date: { type: GraphQLString }
    })
});

// 환율조회
const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        getExchangeRate: {
            type: ExchangeInfo,
            args: {
                src: { type: GraphQLString },
                tgt: { type: GraphQLString },
                date: { type: GraphQLString }
            },
            async resolve(_, args) {
                return await ExchangeRate.findOne({
                    src: args.src,
                    tgt: args.tgt,
                    date: args.date
                }).sort({date: -1});  // 가장 최신 날짜의 환율을 보여주기 위해 정렬  
            }
        }
    }
})

// 환율업데이트정보 Input
const InputUpdateExchangeInfo = new GraphQLInputObjectType({
    name: 'InputUpdateExchangeInfo',
    fields: {
        // 소스통화, krw, usd
        src: { type: GraphQLString },
        // 타겟통화
        tgt: { type: GraphQLString },
        // 환율
        rate: { type: GraphQLFloat },
        // 기준일, 값이 없으면, 최신일자로 등록
        date: { type: GraphQLString }
    }
})

// 환율삭제 Input
const InputDeleteExchangeInfo = new GraphQLInputObjectType({
    name: 'InputDeleteExchangeInfo',
    fields: {
        // 소스통화
        src: { type: GraphQLString },
        // 타겟통화
        tgt: { type: GraphQLString },
        // 기준일
        date: { type: GraphQLString }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // 환율등록, src, tgt, date에 대해서 upsert
        postExchangeRate: {
            type: ExchangeInfo,
            args: {
                info: { type: InputUpdateExchangeInfo }
            },
            async resolve(_, args) {
                const { src, tgt, rate, date } = args.info;
                const nowDate = date || new Date().toISOString().slice(0, 10);  // 날짜가 주어지지 않았으면 현재 날짜 적용 
                
                // src:krw, tgt:usd
                const updated = await ExchangeRate.findOneAndUpdate(
                    { src, tgt, date: nowDate },
                    { src, tgt, rate, date: nowDate },
                    { upsert: true, new: true }
                );

                // src:usd, tgt:krw
                if (src !== tgt) {
                    const reverseRate = 1 / rate;
                    await ExchangeRate.findOneAndUpdate(
                        { src: tgt, tgt: src, date: nowDate },
                        { src: tgt, tgt: src, rate: reverseRate, date: nowDate },
                        { upsert: true, new: true }
                    );
                }
                
                return updated;
            }
        },
        // 환율삭제, 해당일자의 해당 통화간 환율을 삭제
        deleteExchangeRate: {
            type: ExchangeInfo,
            args: {
                info: { type: InputDeleteExchangeInfo }
            },
            async resolve(_, args) {
                const { src, tgt, date } = args.info;
                const deleted = await ExchangeRate.findOneAndDelete(
                    { src, tgt, date }
                );
                return deleted;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});