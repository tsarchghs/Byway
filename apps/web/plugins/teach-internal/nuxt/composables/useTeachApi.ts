import { useMutation, useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

const API = '/api/teach-internal/graphql'

export function useTeachApi() {
  const CREATE_COURSE = gql`
    mutation($teacherId:String!, $title:String!) {
      createCourse(teacherId:$teacherId, title:$title) { id title }
    }
  `
  const CREATE_MODULE = gql`
    mutation($courseId:String!, $title:String!) {
      createModule(courseId:$courseId, title:$title) { id title }
    }
  `
  const CREATE_LESSON = gql`
    mutation($moduleId:String!, $title:String!, $type:String!) {
      createLesson(moduleId:$moduleId, title:$title, type:$type) { id title }
    }
  `
  return { CREATE_COURSE, CREATE_MODULE, CREATE_LESSON }
}
