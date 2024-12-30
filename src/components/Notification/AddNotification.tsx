'use client'

import { useState } from 'react'
// import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function AddNotificationForm({addNotification}:{addNotification:(formData:any)=>void;}) {
  const [isPending, setIsPending] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '' })

  

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault() // Prevent form submission default behavior
    setIsPending(true)
    addNotification(formData)
    setIsPending(false)

    // if (result.success) {
    //   navigate('.')
    // } else {
    //   // Handle error (e.g., show a toast notification)
    // }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Title
        </label>
        <Input
          id="title"
          name="title"
          placeholder="Enter notification title"
          required
          value={formData.title}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter notification description"
          required
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Notification'}
      </Button>
    </form>
  )
}
