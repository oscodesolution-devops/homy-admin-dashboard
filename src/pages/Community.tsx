import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Delete } from 'lucide-react';
import AddPostForm from '@/components/Communitypost/AddPost';
import { Button } from '@/components/ui/button';

interface Post {
    _id: string;
    postBy: string | null;
    likes: string[];
    postImage: string;
    postDescription: string;
    createdAt: string;
    updatedAt: string;
}

interface PostData {
    posts: Post[];
    currentPage: number;
    totalPages: number;
    totalPosts: number;
}

interface ApiResponse {
    success: boolean;
    data: PostData;
    error?: Record<string, any>;
    status: {
        code: number;
        message: string;
    };
}

const CommunityPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [showForm]);

    // const createPost = async (formData:any) => {
    //     try {
    //       const response = await axios.post(
    //         '/notifications/create',
    //         { title: formData.title, description: formData.description },
    //         {
    //           headers: {
    //             Authorization: `Bearer ${localStorage.getItem('token')}`,
    //           },
    //         }
    //       )
    //       console.log(response)
    //       if (!response) {
    //         throw new Error('Failed to create notification')
    //       }else{
    //         setShowForm(false);
    //         fetchPosts();
    //       }
    //       return { success: true, message: 'Notification created successfully' }
    //     } catch (error) {
    //       console.error('Error creating notification:', error)
    //       return { success: false, message: 'Failed to create notification' }
    //     }
    //   }
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await axios.get<ApiResponse>('/post/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data.success) {
                setPosts(response.data.data.posts);
            } else {
                setError(response.data.error?.message || 'Failed to fetch community posts');
            }
        } catch (err) {
            setError('Failed to fetch posts');
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id: string) => {
        try {
            await axios.delete<ApiResponse>(`/post/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            fetchPosts();
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-100 h-full flex items-center justify-center">
                <div className="text-gray-600">Loading community posts...</div>
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
                    <AddPostForm  setShowForm={setShowForm}/>
                ) : (<>

                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold">Community Post</h1>
                        <Button onClick={() => setShowForm(true)}>Add Post</Button>
                    </div>
                    

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                {/* <TableHead>Posted By</TableHead> */}
                                <TableHead>Description</TableHead>
                                <TableHead>Likes</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map((post) => (
                                <TableRow key={post._id}>
                                    <TableCell>
                                        <img src={post.postImage} alt="Post" className="w-16 h-16 rounded" />
                                    </TableCell>
                                    {/* <TableCell>{post.postBy || 'Anonymous'}</TableCell> */}
                                    <TableCell>{post.postDescription || 'No description'}</TableCell>
                                    <TableCell>{post.likes.length}</TableCell>
                                    <TableCell>{new Date(post.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Delete
                                            onClick={() => deletePost(post._id)}
                                            className="cursor-pointer text-red-500"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>)}
            </main>
        </div>
    );
};

export default CommunityPage;
