# GraphQL + mongoDB CRUD 구현과제

## Requirements
- npm v11.2.0
- Node.js v22.14.0
- MongoDB Atlas
- Express

## Installation

`
npm install express express-graphql graphql
`

`
npm install mongoose
`

다른 패키지와 의존성 충돌 시 아래 명령어로 강제 설치

`
npm install mongoose --legacy-peer-deps
`


- MongoDB 연결

1. MongoDB Atlas에서 클러스터 생성 후 연결
2. Connect 주소 복사해서 server.js에 입력 (아래 굵은 글씨 수정)
   
   (mongodb+srv://**Username**:**Password**@**Cluster**.mongodb.net/**Database**?retryWrites=true&w=majority&appName=Cluster)

## Run
명령프롬프트 프로젝트 경로에서
`
node server.js
`

1. GraphiQL(<http://localhost:5110/graphql>)에서 처리

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
- 환율 등록 (자동으로 양방향 등록되도록 구현)
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

서버(index.js), Mongoose 모델(ExchangeRate.js), GraphQL 스키마(exchange.js)가 필요하다.
- 서버 파일에서는 Express, Mongodb 연결 수행
- Mongoose 모델 파일에서는 스키마 정
- GraphQL 스키마 파일에서는 User type, Query, Mutation 정의

GraphQL는 아래 구조로 나뉜다:
- Schema: API 구조 정의
- Resolver: API 구현

### Schema
< Query, Mutation >

스키마의 필수 요소로, 사용자가 쓰게 될 기능을 이름, 매개변수, 반환값으로 정의한다.

Query는 GET, Mutation은 POST, DELETE, PUT 기능을 구현한다.

< Object type >

Int, Float, String, Boolean, ID 자료형이 존재한다.

여기서, GraphQL Object type은 재사용이 부적절하기 때문에 별도로 Input type이 존재한다.

Object type 필드에서는 Resolver가 정의되지만, Input type 필드에서는 Resolve 할 수 없다. (이미 명시적인 값을 가지기 때문에)

### Code
기존에 제공된 스키마는 GraphQL SDL 문법이지만, 나는 보다 익숙한 Node.js 코드(Javascript 기반) 문법로 스키마를 작성하였다.


## Reference
1. [Running an Express GraphQL Server](https://www.graphql-js.org/docs/running-an-express-graphql-server/)
2. [[NODE.JS] MONGO DB 연동하기](https://velog.io/@dev_cecy/NODE.JS-MONGO-DB-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0-FEAT.-EXPRESS-MONGOOSE)
3. [GraphQL에서 'input' 타입을 왜 사용할까?](https://velog.io/@cadenzah/graphql-input-type)
