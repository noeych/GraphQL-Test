# GraphQL + mongoDB CRUD 구현과제

## Requirements
- npm v11.2.0

- Node.js v22.14.0

- MongoDB Atlas

## Installation

`
npm install express express-graphql graphql
`

`
npm install mongoose
`
## Run
명령프롬프트 프로젝트 경로에서
`
node server.js
`
1. <http://localhost:5110/graphql>에서 처리
- 환율 등록
```graphql
mutation {
  postExchangeRate(info: {
    src: "krw",
    tgt: "usd",
    rate: 0.00072,
    date: "2025-06-01"
  }) {
    src
    tgt
    rate
    date
  }
}
```
- 환율 삭제
``` graphql
mutation {
  deleteExchangeRate(info: {
    src: "krw",
    tgt: "usd",
    date: "2025-06-01"
  }) {
    src
    tgt
    rate
    date
  }
}
````
2. 터미널에서 처리 (윈도우용 명령어)
- 환율 조회
```graphql
curl -X POST http://localhost:5110/graphql -H "Content-Type: application/json" -H "Accept: application/json" -d "{\"query\":\"query { getExchangeRate(src: \\\"krw\\\", tgt: \\\"usd\\\", date: \\\"2025-05-31\\\") { src tgt rate date } }\"}" | jq
```
- 환율 등록
  
환율 등록은 자동으로 양방향 등록되도록 구현되어있음.
```graphql
curl -X POST http://localhost:5110/graphql -H "Content-Type: application/json" -H "Accept: application/json" -d "{\"query\":\"mutation { postExchangeRate(info: { src: \\\"krw\\\", tgt: \\\"usd\\\", rate: 0.00073, date: \\\"2025-06-01\\\" }) { src tgt rate date } }\"}" | jq
```
```graphql
curl -X POST http://localhost:5110/graphql -H "Content-Type: application/json" -H "Accept: application/json" -d "{\"query\":\"mutation { postExchangeRate(info: { src: \\\"usd\\\", tgt: \\\"krw\\\", rate: 1342.11, date: \\\"2025-06-01\\\" }) { src tgt rate date } }\"}" | jq
```
- 환율 삭제
```graphql
curl -X POST http://localhost:5110/graphql -H "Content-Type: application/json" -H "Accept: application/json" -d "{\"query\":\"mutation { deleteExchangeRate(info: { src: \\\"usd\\\", tgt: \\\"krw\\\", date: \\\"2025-06-01\\\" }) { src tgt rate date } }\"}" | jq
```


----

## Research

#### Reference
1. [GraphQL 공식문서 - Running an Express GraphQL Server](https://www.graphql-js.org/docs/running-an-express-graphql-server/)
