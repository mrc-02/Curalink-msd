import { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        loading: false
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        loading: false
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true
  })

  // Check if user is logged in
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const { data } = await axios.get('/api/auth/me')
        dispatch({ type: 'LOGIN', payload: data.data })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const { data } = await axios.post('/api/auth/login', { email, password })
      
      localStorage.setItem('token', data.data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`
      
      dispatch({ type: 'LOGIN', payload: data.data.user })
      toast.success('Login successful!')
      return data.data.user
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const { data } = await axios.post('/api/auth/register', userData)
      
      localStorage.setItem('token', data.data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`
      
      dispatch({ type: 'LOGIN', payload: data.data.user })
      toast.success('Registration successful!')
      return data.data.user
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      dispatch({ type: 'LOGOUT' })
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}