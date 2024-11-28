import LoginForm from "@/components/Authentication/Login" 
import BrandLogo from "@/assets/Homy.svg"
const Login = () => {
  return (
    <div className="grid grid-cols-2 min-h-screen min-w-screen">
        <img src={BrandLogo} alt="BrandLogo" className="w-full my-auto" />
        <LoginForm/>
    </div>
  )
}

export default Login