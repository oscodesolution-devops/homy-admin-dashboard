
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
// import { toast } from '@/components/ui/use-toast'

interface Plan {
  _id: string
  type: string
  description: string
  features: string[]
  morningPrice: number
  eveningPrice: number
  servesUpto: number
  extraPersonCharge: number
}

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/plans/get')
      setPlans(response.data.data)
    } catch (error) {
      console.error('Error fetching plans:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to fetch plans. Please try again.",
    //     variant: "destructive",
    //   })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const planData: Record<string, string | number | string[]> = {}

    formData.forEach((value, key) => {
      if (key === 'features') {
        planData[key] = (value as string).split(',').map(feature => feature.trim())
      } else if (key === 'morningPrice' || key === 'eveningPrice' || key === 'servesUpto' || key === 'extraPersonCharge') {
        planData[key] = Number(value)
      } else {
        planData[key] = value as string
      }
    })

    try {
      if (currentPlan) {
        await axios.put(`/plans/update/${currentPlan._id}`, planData,{
            headers:{
              Authorization:`Bearer ${localStorage.getItem('token')}`
            }
          })
        // toast({
        //   title: "Success",
        //   description: "Plan updated successfully",
        // })
      } else {
        await axios.post('/plans/create', planData,{
            headers:{
              Authorization:`Bearer ${localStorage.getItem('token')}`
            }
          })
        // toast({
        //   title: "Success",
        //   description: "Plan created successfully",
        // })
      }
      fetchPlans()
      setIsAddModalOpen(false)
      setIsEditModalOpen(false)
      setCurrentPlan(null)
    } catch (error) {
      console.error('Error saving plan:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to save plan. Please try again.",
    //     variant: "destructive",
    //   })
    }
  }


  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return
    try {
      await axios.delete(`/plans/delete/${id}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
    //   toast({
    //     title: "Success",
    //     description: "Plan deleted successfully",
    //   })
      fetchPlans()
    } catch (error) {
      console.error('Error deleting plan:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to delete plan. Please try again.",
    //     variant: "destructive",
    //   })
    }
  }

  const PlanForm = ({ plan }: { plan?: Plan }) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="type" defaultValue={plan?.type} placeholder="Type" required />
      <Textarea name="description" defaultValue={plan?.description} placeholder="Description" required />
      <Input name="features" defaultValue={plan?.features.join(', ')} placeholder="Features (comma-separated)" required />
      <Input type="number" name="morningPrice" defaultValue={plan?.morningPrice} placeholder="Morning Price" required />
      <Input type="number" name="eveningPrice" defaultValue={plan?.eveningPrice} placeholder="Evening Price" required />
      <Input type="number" name="servesUpto" defaultValue={plan?.servesUpto} placeholder="Serves Up To" required />
      <Input type="number" name="extraPersonCharge" defaultValue={plan?.extraPersonCharge} placeholder="Extra Person Charge" required />
      <Button type="submit" className="w-full">
        {plan ? 'Update Plan' : 'Add Plan'}
      </Button>
    </form>
  )

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Plans Management</h1> */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> Add New Plan
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Plan</DialogTitle>
          </DialogHeader>
          <PlanForm />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Morning Price</TableHead>
            <TableHead>Evening Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan._id}>
              <TableCell>{plan.type}</TableCell>
              <TableCell>{plan.description}</TableCell>
              <TableCell>${plan.morningPrice}</TableCell>
              <TableCell>${plan.eveningPrice}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="icon"
                  className="mr-2"
                  onClick={() => {
                    setCurrentPlan(plan)
                    setIsEditModalOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(plan._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
          </DialogHeader>
          {currentPlan && <PlanForm plan={currentPlan} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

