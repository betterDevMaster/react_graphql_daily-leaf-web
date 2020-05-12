export const isSuperAdmin = () => {
  const admin = JSON.parse(window.localStorage.getItem('DailyLeaf::Admin'))
  if (admin && admin.role === 'super') {
    return true
  } else {
    return false
  }
}

export const getAdmin = () => {
  const admin = JSON.parse(window.localStorage.getItem('DailyLeaf::Admin'))
  return admin
}
