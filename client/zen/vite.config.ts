import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server : {
    proxy : {
      '/user/register' : { target: 'http://localhost:8080'},
      '/otp/verification' : { target: 'http://localhost:8080'},
      '/resend/otp' : { target: 'http://localhost:8080'},
      '/user/login' : { target: 'http://localhost:8080'},
      '/get/zenlist/' : { target: 'http://localhost:8080'},
      '/add/tozenlist/' : { target: 'http://localhost:8080'},
        }
  }
})
