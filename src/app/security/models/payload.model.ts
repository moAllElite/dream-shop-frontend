export interface Payload {
  sub: string
  iss: string
  iat: number
  exp: number
  roles: Role[]
}

export interface Role {
  authority: string
}
