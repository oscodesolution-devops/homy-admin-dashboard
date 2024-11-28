import { useState, useEffect } from 'react'
import OrderTable from '@/components/Orders/OrderTable'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'
interface User {
  firstName: string;
  lastName: string;
}

interface Chef {
  firstname: string;
  lastname: string;
}
// Define the shape of an order
interface Order {
  _id: string;
  user: User;
  planID: string;
  totalPeople: number;
  morningMealTime: string;
  eveningMealTime: string;
  chefDayOff: string;
  planStartDate: string;
  baseAmount: number;
  extraPersonAmount: number;
  discountAmount: number;
  totalAmount: number;
  razorpayOrderId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'failed';
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  chef?: Chef;
  __v: number;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

type OrdersResponse = {
  success: boolean
  data: {
    orders: Order[]
  }
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get<OrdersResponse>('/admin/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      console.log(response)
      if (!response.data.success) {
        throw new Error('Failed to fetch orders')
      }
      setOrders(response.data.data.orders)
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    

    fetchOrders()
  }, [])

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading orders: {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders</h1>
      <OrderTable initialOrders={orders} fetchOrders={fetchOrders} />
    </div>
  )
}

export default Orders
