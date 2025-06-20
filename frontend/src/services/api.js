import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// APIクライアントの設定
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// リクエストインターセプター
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default apiClient
