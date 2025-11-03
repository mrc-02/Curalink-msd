import { format, parseISO, isToday, isTomorrow, isPast, isFuture } from 'date-fns'

// Date formatting
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return ''
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, formatString)
  } catch (error) {
    console.error('Date formatting error:', error)
    return ''
  }
}

export const formatTime = (time) => {
  if (!time) return ''
  try {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  } catch (error) {
    return time
  }
}

export const formatDateTime = (date) => {
  if (!date) return ''
  try {
    return formatDate(date, 'MMM dd, yyyy hh:mm a')
  } catch (error) {
    return ''
  }
}

export const getRelativeDate = (date) => {
  if (!date) return ''
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    if (isToday(parsedDate)) return 'Today'
    if (isTomorrow(parsedDate)) return 'Tomorrow'
    return formatDate(parsedDate, 'MMM dd')
  } catch (error) {
    return ''
  }
}

export const isPastDate = (date) => {
  if (!date) return false
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return isPast(parsedDate)
  } catch (error) {
    return false
  }
}

export const isFutureDate = (date) => {
  if (!date) return false
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return isFuture(parsedDate)
  } catch (error) {
    return false
  }
}

// Name formatting
export const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0)?.toUpperCase() || ''
  const last = lastName?.charAt(0)?.toUpperCase() || ''
  return `${first}${last}`
}

export const getFullName = (user) => {
  if (!user) return ''
  return `${user.firstName || ''} ${user.lastName || ''}`.trim()
}

// Status formatting
export const getStatusColor = (status) => {
  const colors = {
    'Pending': 'yellow',
    'Confirmed': 'blue',
    'Completed': 'green',
    'Cancelled': 'red',
    'No-Show': 'gray',
    'Paid': 'green',
    'Unpaid': 'red',
    'Partially Paid': 'orange',
    'Overdue': 'red'
  }
  return colors[status] || 'gray'
}

export const getStatusBadgeClass = (status) => {
  const classes = {
    'Pending': 'badge-pending',
    'Confirmed': 'badge-confirmed',
    'Completed': 'badge-completed',
    'Cancelled': 'badge-cancelled',
    'No-Show': 'badge-cancelled'
  }
  return classes[status] || 'badge'
}

// Number formatting
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const formatNumber = (num) => {
  if (!num && num !== 0) return '0'
  return new Intl.NumberFormat('en-US').format(num)
}

export const formatPhone = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`
  }
  return phone
}

// Validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/
  return re.test(phone)
}

export const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6
}

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Calculate age
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null
  try {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  } catch (error) {
    return null
  }
}

// Sort functions
export const sortByDate = (a, b, key = 'createdAt', order = 'desc') => {
  const dateA = new Date(a[key])
  const dateB = new Date(b[key])
  return order === 'desc' ? dateB - dateA : dateA - dateB
}

export const sortByName = (a, b, key = 'name', order = 'asc') => {
  const nameA = a[key]?.toLowerCase() || ''
  const nameB = b[key]?.toLowerCase() || ''
  if (order === 'asc') {
    return nameA.localeCompare(nameB)
  }
  return nameB.localeCompare(nameA)
}

// Download helpers
export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToCSV = (data, filename) => {
  if (!data || !data.length) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header]
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    }).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Local storage helpers
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const getLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

// Debounce function
export const debounce = (func, wait = 300) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}