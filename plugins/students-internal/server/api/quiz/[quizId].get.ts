export default defineEventHandler(async (event) => {
  const quizId = getRouterParam(event, 'quizId')
  return {
    id: quizId,
    title: 'Knowledge Check',
    questions: [
      { id:'q1', type:'single', text:'Which is a JS framework?', options:['Vue','Python','Go'], correct:'Vue' },
      { id:'q2', type:'multi', text:'Select frontend frameworks', options:['Vue','React','Django'], correct:['Vue','React'] },
      { id:'q3', type:'text', text:'Name a CSS framework', correct:'Tailwind' }
    ]
  }
})
