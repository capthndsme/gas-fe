import axios, { AxiosInstance } from 'axios'
const AXIOS_TIMEOUT = 100000

export function useAxiosWithAuth(): AxiosInstance {
  const apiBaseUrl = 'https://gas-be.capthndsme.xyz'

  const token = localStorage.getItem('GasAppToken')
  const userId = localStorage.getItem('GasAppUserId')

  const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    timeout: AXIOS_TIMEOUT,
    validateStatus: () => true,
    headers: {
      Authorization: `Bearer ${token}`,
      "X-user-id": userId
    },
  })

  axiosInstance.interceptors.request.use(
    async (requestConfig) => {
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`
      } else {
        requestConfig.headers.Authorization = ''
      }

      return requestConfig
    },
    (error) => {
      return Promise.reject(new Error(error))
    },
  )

  axiosInstance.interceptors.response.use(async (requestConfig) => {
    requestConfig.headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    }

    return requestConfig
  })

  return axiosInstance
}
