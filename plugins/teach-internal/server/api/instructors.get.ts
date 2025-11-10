export default defineEventHandler(async (event) => {
  return { items: [
    { id:'i1', name:'Dr. Ada Lovelace', email:'ada@example.com', courses: 5 },
    { id:'i2', name:'Prof. Alan Turing', email:'alan@example.com', courses: 3 }
  ] }
})
