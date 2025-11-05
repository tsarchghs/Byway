// packages/shared-server/src/authBridge.js
export function createContext({ req }) {
  const auth = req.headers.authorization || ''
  const token = auth.replace('Bearer ', '')

  let user = null
  try {
    user = jwt.verify(token, process.env.JWT_SECRET)
  } catch {}

  return { req, prisma, user, token }
}
import fetch from 'node-fetch'

export async function fetchUserProfile(userId, token) {
  console.log('🟢 fetchUserProfile called with:', { userId, token: !!token });

  if (!token) {
    console.error('❌ Missing token for authentication bridge');
    throw new Error('Missing token for authentication bridge');
  }

  const response = await fetch('http://localhost:4000/api/authentication/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `query { me { id email } }`,
    }),
  });

  const data = await response.json();
  console.log('🟢 fetchUserProfile result:', data);
  return data.data?.me;
}
