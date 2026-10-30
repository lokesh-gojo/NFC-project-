import React, { createContext, useContext, useEffect, useState } from 'react'
import { Profile, Business, BusinessCategory } from '@/types'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { DEMO_PROFILE, DEMO_ADMIN_PROFILE, DEMO_BUSINESS } from '@/services/mockData'
import { getCurrentBusiness } from '@/services/dataService'

interface AuthContextType {
  user: Profile | null
  currentBusiness: Business | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isDemoMode: boolean
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>
  loginAsDemo: (role?: 'business_owner' | 'super_admin') => void
  register: (data: {
    fullName: string
    email: string
    phone?: string
    password?: string
    businessName: string
    category: BusinessCategory
  }) => Promise<{ success: boolean; error?: string; business?: Business }>
  logout: () => Promise<void>
  refreshBusiness: () => Promise<void>
  setCurrentBusiness: (business: Business) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_USER_KEY = 'nexora_session_user'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null)
  const [currentBusiness, setCurrentBusinessState] = useState<Business | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function initAuth() {
      setIsLoading(true)
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle()
            if (profile) {
              setUser(profile as Profile)
              const biz = await getCurrentBusiness(profile.id)
              setCurrentBusinessState(biz)
            }
          }
        } else {
          // Check local stored session
          const savedUser = localStorage.getItem(AUTH_USER_KEY)
          if (savedUser) {
            const parsed = JSON.parse(savedUser)
            setUser(parsed)
            const biz = await getCurrentBusiness(parsed.id)
            setCurrentBusinessState(biz)
          } else {
            // Default to demo owner for instant live review
            setUser(DEMO_PROFILE)
            setCurrentBusinessState(DEMO_BUSINESS)
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
        setUser(DEMO_PROFILE)
        setCurrentBusinessState(DEMO_BUSINESS)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    const client = supabase
    if (isSupabaseConfigured && client) {
      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
          if (profile) {
            setUser(profile as Profile)
            const biz = await getCurrentBusiness(profile.id)
            setCurrentBusinessState(biz)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setCurrentBusinessState(null)
          localStorage.removeItem(AUTH_USER_KEY)
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [])

  const login = async (email: string, password: string = 'password') => {
    setIsLoading(true)
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return { success: false, error: error.message }
        if (data.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
          if (profile) {
            setUser(profile as Profile)
            const biz = await getCurrentBusiness(profile.id)
            setCurrentBusinessState(biz)
            return { success: true }
          }
        }
      }

      // Local mock login
      if (email.toLowerCase().includes('admin')) {
        setUser(DEMO_ADMIN_PROFILE)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_ADMIN_PROFILE))
      } else {
        setUser(DEMO_PROFILE)
        setCurrentBusinessState(DEMO_BUSINESS)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_PROFILE))
      }
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' }
    } finally {
      setIsLoading(false)
    }
  }

  const loginAsDemo = (role: 'business_owner' | 'super_admin' = 'business_owner') => {
    if (role === 'super_admin') {
      setUser(DEMO_ADMIN_PROFILE)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_ADMIN_PROFILE))
    } else {
      setUser(DEMO_PROFILE)
      setCurrentBusinessState(DEMO_BUSINESS)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_PROFILE))
    }
  }

  const register = async (data: {
    fullName: string
    email: string
    phone?: string
    password?: string
    businessName: string
    category: BusinessCategory
  }) => {
    setIsLoading(true)
    try {
      const slug = data.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'biz-' + Math.random().toString(36).substring(2, 7)

      const newProfile: Profile = {
        id: 'u_' + Math.random().toString(36).substring(2, 9),
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        role: 'business_owner',
        created_at: new Date().toISOString()
      }

      const newBiz: Business = {
        id: 'b_' + Math.random().toString(36).substring(2, 9),
        owner_id: newProfile.id,
        name: data.businessName,
        slug,
        category: data.category,
        currency: 'INR',
        currency_symbol: '₹',
        status: 'active',
        is_published: true,
        is_google_review_enabled: true,
        subscription_plan: 'starter',
        onboarding_completed: false,
        created_at: new Date().toISOString()
      }

      if (isSupabaseConfigured && supabase) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password || 'TemporaryPass123!'
        })
        if (authError) return { success: false, error: authError.message }

        if (authData.user) {
          newProfile.id = authData.user.id
          newBiz.owner_id = authData.user.id
          await supabase.from('profiles').insert(newProfile)
          await supabase.from('businesses').insert(newBiz)
        }
      }

      // Save to state and storage
      setUser(newProfile)
      setCurrentBusinessState(newBiz)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newProfile))
      localStorage.setItem('nexora_current_business', JSON.stringify(newBiz))

      // Also append to businesses list
      const bizList: Business[] = JSON.parse(localStorage.getItem('nexora_businesses') || '[]')
      bizList.push(newBiz)
      localStorage.setItem('nexora_businesses', JSON.stringify(bizList))

      return { success: true, business: newBiz }
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setCurrentBusinessState(null)
    localStorage.removeItem(AUTH_USER_KEY)
  }

  const refreshBusiness = async () => {
    if (user) {
      const biz = await getCurrentBusiness(user.id)
      setCurrentBusinessState(biz)
    }
  }

  const setCurrentBusiness = (biz: Business) => {
    setCurrentBusinessState(biz)
    localStorage.setItem('nexora_current_business', JSON.stringify(biz))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        currentBusiness,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'super_admin',
        isDemoMode: !isSupabaseConfigured,
        login,
        loginAsDemo,
        register,
        logout,
        refreshBusiness,
        setCurrentBusiness
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
