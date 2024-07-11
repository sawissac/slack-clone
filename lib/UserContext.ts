import { createContext } from 'react'
import { SupabaseUserResponse, SupabaseUserRoleResponse } from './Store'
import { User } from '@supabase/supabase-js'

export interface UserContextType {
   userLoaded: boolean
   user: User | null
   userRoles: string[]
   signIn: () => void
   signOut: () => void 
}

const UserContext = createContext<Partial<UserContextType>>({})

export default UserContext
