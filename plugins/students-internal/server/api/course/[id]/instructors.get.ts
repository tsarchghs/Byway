export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return [
    { id:`${id}-i1`, name:'Dr. Ada Lovelace', bio:'Computing pioneer and educator.', avatar:'https://i.pravatar.cc/100?img=5' },
    { id:`${id}-i2`, name:'Prof. Alan Turing', bio:'AI and cryptography thought leader.', avatar:'https://i.pravatar.cc/100?img=15' }
  ]
})
