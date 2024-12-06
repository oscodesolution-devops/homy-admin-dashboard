import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Trash2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
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
  // DialogTrigger,
} from '@/components/ui/dialog'


interface Query {
  _id: string
  name: string
  email: string
  phoneNumber: string
  message: string
  status: string
  createdAt: string
  comment: string;
}

export default function Query() {
  const [queries, setQueries] = useState<Query[]>([])
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [currentQuery, setCurrentQuery] = useState<Query | null>(null)
  const [comment, setComment] = useState('')

  useEffect(() => {
    fetchQueries()
  }, [])

  const fetchQueries = async () => {
    try {
      const response = await axios.get('/query/get',{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      setQueries(response.data.data)
    } catch (error) {
      console.error('Error fetching queries:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to fetch queries. Please try again.",
    //     variant: "destructive",
    //   })
    }
  }

  const handleDelete = async (id: string) => {
    // if (!confirm('Are you sure you want to delete this query?')) return
    console.log("hello")
    try {
      await axios.delete(`/query/delete/${id}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
    //   toast({
    //     title: "Success",
    //     description: "Query deleted successfully",
    //   })
      fetchQueries()
    } catch (error) {
      console.error('Error deleting query:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to delete query. Please try again.",
    //     variant: "destructive",
    //   })
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!currentQuery) return

    try {
      await axios.put(`/query/update/${currentQuery._id}`, { status: 'Responded',comment:comment },{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
    //   toast({
    //     title: "Success",
    //     description: "Comment added successfully",
    //   })
      setIsCommentModalOpen(false)
      fetchQueries()

      // Redirect to email composition
      const mailtoLink = `mailto:${currentQuery.email}?subject=Feedback Response&body=${encodeURIComponent(comment)}`
      window.location.href = mailtoLink
    } catch (error) {
      console.error('Error adding comment:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to add comment. Please try again.",
    //     variant: "destructive",
    //   })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Query Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queries.map((query) => (
            <TableRow key={query._id}>
              <TableCell>{query.name}</TableCell>
              <TableCell>{query.email}</TableCell>
              <TableCell>{query.phoneNumber}</TableCell>
              <TableCell>{query.message}</TableCell>
              <TableCell>{query.status}</TableCell>
              <TableCell>{new Date(query.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{query.comment}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="icon"
                  className="mr-2"
                  onClick={() => {
                    setCurrentQuery(query)
                    setIsCommentModalOpen(true)
                  }}
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(query._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment"
              required
            />
            <Button type="submit" className="w-full">
              Submit Comment
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

