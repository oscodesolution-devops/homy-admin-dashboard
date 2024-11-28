import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import UserCalendar from "@/components/Users/UserCalendar"
import axios from "axios"
import { BadgeCheck, Pencil } from 'lucide-react'
import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import customer from "../assets/Profile Boy Icon.svg"

const Profile = () => {
  const { userId } = useParams<{ userId: string }>()
  const [user, setUser] = useState<any>(null)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [chef, setChef] = useState<any>(null)
  const location = useLocation()
  const { role } = location.state || {}

  const fetchUserDetails = async () => {
    try {
      const { data } = await axios.get(`/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      console.log(data)
      setUser(data.data.user)
      setUserDetails(data.data.userDetails)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchChefDetails = async () => {
    try {
      console.log(userId)
      const { data } = await axios.get(`/admin/chef/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      console.log(data)
      setChef(data.data.chef)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUserDetails()
    if (role === "chef") {
      fetchChefDetails()
    }
  }, [])

  if ((!user && !chef) || (!userDetails && !chef)) {
    return <div>Loading...</div>
  }

  return (
    <main className="p-6 w-full flex justify-center gap-6">
      <div className="max-w-4xl w-full p-6 flex items-center space-x-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={role === "chef" ? "/placeholder.svg" : customer}
              alt="Profile"
              className="h-48 w-48 rounded-full object-cover"
            />
            <Button
              size="icon"
              className="absolute bottom-2 right-2 rounded-full"
              variant="secondary"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{chef ? `${chef.firstname} ${chef.lastname}` : `${user.firstName} ${user.lastName}`}</h2>
              <BadgeCheck className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-muted-foreground">{chef ? "Chef" : user.activePlan?.type || "No active plan"}</p>
          </div>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              {role !== "chef" && <UserCalendar userId={userId}/>}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Full Name</Label>
                <p>{chef ? `${chef.firstname} ${chef.lastname}` : `${user.firstName} ${user.lastName}`}</p>
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <p>{chef ? chef.email : user.email}</p>
              </div>
              {chef ? (
                <>
                  <div className="space-y-1">
                    <Label>Experience</Label>
                    <p>{chef.experience} years</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Rating</Label>
                    <p>{chef.rating}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Speciality</Label>
                    <p>{chef.speciality.join(", ")}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Status</Label>
                    <p>{chef.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <Label>Mobile</Label>
                    <p>{user.phoneNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Location</Label>
                    <p>{user.address}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Age</Label>
                    <p>{userDetails.age}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Gender</Label>
                    <p>{userDetails.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Height</Label>
                    <p>{userDetails.height} cm</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Weight</Label>
                    <p>{userDetails.weight} kg</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Activity Level</Label>
                    <p>{userDetails.activityLevel}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Fitness Goals</Label>
                    <p>{userDetails.fitnessGoals.join(", ")}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Dietary Preferences</Label>
                    <p>{userDetails.dietaryPreferences.join(", ")}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Health Conditions</Label>
                    <p>{userDetails.healthCondition.length > 0 ? userDetails.healthCondition.join(", ") : "None"}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Meal Frequency</Label>
                    <p>{userDetails.mealFrequency} meals per day</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Current Plan</Label>
                    <p>{user.activePlan?.type || "No active plan"}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default Profile