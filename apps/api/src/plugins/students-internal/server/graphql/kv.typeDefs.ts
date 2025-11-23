
import { gql } from 'apollo-server-express'
export const typeDefs = gql`
  extend type Query {
    kvGet(key:String!, session:String): String
  }
  extend type Mutation {
    kvSet(key:String!, value:String!, session:String): Boolean
    kvDelete(key:String!, session:String): Boolean
    kvClear(session:String): Boolean
  }
`
