import { request } from '@/plugins/request'


// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data
  })
}

// 用户注册
export const register = data => {
  return request({
    method: 'POST',
    url: '/api/users',
    data
  })
}

// 设置用户
export const updateUser = data => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data
  })
}

// 获取用户
export const getCurrentUser = data => {
  return request({
    method: 'GET',
    url: '/api/user',
    data
  })
}

// 获取其他用户
export const getProfiles = username => {
  return request({
    method: 'GET',
    url: `/api/profiles/${username}`,
  })
}

// follow用户
export const followUser = username => {
  return request({
    method: 'POST',
    url: `/api/profiles/${username}/follow`,
  })
}

// follow用户
export const unfollowUser = username => {
  return request({
    method: 'DELETE',
    url: `/api/profiles/${username}/follow`,
  })
}


