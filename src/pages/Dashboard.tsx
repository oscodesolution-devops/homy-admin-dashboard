import CardCounter from "@/components/Cards/CardCounter"
import Chart from "@/components/Sales/Chart"
import ChartByPeriod from "@/components/Sales/ChartByPeriod"
import TotalSalesChart from "@/components/Sales/TotalSalesChart"
import axios from "axios"
import { FileText, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface data{
  totalUsers:number;
  totalRevenue:number;
  totalOrders:number;
  totalChefs:number;
}

const Dashboard = () => {
  const [data, setData] = useState<data|undefined>(undefined);
  const fetchData = async ()=>{
    try{
      const {data} = await axios.get("/admin/dashboard",{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      console.log(data)
      setData(data.data);
    }catch(error){
      console.log(error);
    }finally{

    }
  }
  useEffect(()=>{
    fetchData();
  },[])
  return (
    <div className="p-2 space-y-6">
        <div className="grid gap-6 grid-cols-3 ">
        <div className="col-span-2">
        <Chart/>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
        <CardCounter title="Total Users" content={data?.totalUsers} icon={Users}/>
        <CardCounter title="Total Orders" content={data?.totalOrders} icon={FileText}/>
        <CardCounter title="Total Chefs" content={data?.totalChefs} icon={Users}/>
        <CardCounter title="Total Revenue" content={data?.totalRevenue} icon={FileText}/>
        </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
        <ChartByPeriod/>
        <TotalSalesChart/>
        </div>

    </div>
  )
}

export default Dashboard