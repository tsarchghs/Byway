export type UserRef = {
  id: string
  email: string
  name?: string
}

export interface UserProvider {
  getUserById(id: string): Promise<UserRef | null>
}

export interface UserIdentityLink {
  userId: string
}
