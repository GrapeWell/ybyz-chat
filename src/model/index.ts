import { create } from 'zustand'

export const useStore = create((set) => ({
  users: [],
  updateUsers: (newUsers: string[]) => set(() => ({ users: [...newUsers] }))
}))