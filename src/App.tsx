import './App.css'
import Router from '@/router/router'
import axios from 'axios'

axios.defaults.baseURL="https://13.202.22.147/api/v1/"
// axios.defaults.baseURL="http://localhost:3000/api/v1/"

function App() {
  
  return (
    <>
    <Router/>
    </>
  )
}

export default App
