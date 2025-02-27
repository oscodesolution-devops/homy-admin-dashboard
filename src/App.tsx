import './App.css'
import Router from '@/router/router'
import axios from 'axios'

// axios.defaults.baseURL="https://www.admin.thehomy.in/api/v1/"
// axios.defaults.baseURL="https://www.admin.thehomy.in/api/v1/"
axios.defaults.baseURL="http://localhost:3000/api/v1/"


function App() {
  
  return (
    <>
    <Router/>
    </>
  )
}

export default App
// 