'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import AddNotificationForm from '@/components/Notification/AddNotification';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Delete } from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Notification[];
  error?: string;
}

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);
  const createNotification = async (formData:any) => {
    try {
      const response = await axios.post(
        '/notifications/create',
        { title: formData.title, description: formData.description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      console.log(response)
      if (!response) {
        throw new Error('Failed to create notification')
      }else{
        setShowForm(false);
        fetchNotifications();
      }
      return { success: true, message: 'Notification created successfully' }
    } catch (error) {
      console.error('Error creating notification:', error)
      return { success: false, message: 'Failed to create notification' }
    }
  }
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>('/notifications/get', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        setNotifications(response.data.data);
      } else {
        setError(response.data.error || 'Failed to fetch notifications');
      }
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async(id:string)=>{
    try{
      await axios.delete<ApiResponse>(`/notifications/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchNotifications();
    }catch(err){
      console.log(err);
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-100 h-full flex items-center justify-center">
        <div className="text-gray-600">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 h-full flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-full">
      <main className="p-4 md:p-8">
        {showForm ? (
          <AddNotificationForm addNotification={createNotification} />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Notifications</h1>
              <Button onClick={() => setShowForm(true)}>Add Notification</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification._id}>
                    <TableCell>{notification.title}</TableCell>
                    <TableCell>{notification.description}</TableCell>
                    <TableCell>{new Date(notification.createdAt).toLocaleString()}</TableCell>
                    <TableCell><Delete onClick={()=>deleteNotification(notification._id)}/></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </main>
    </div>
  );
};

export default NotificationPage;
