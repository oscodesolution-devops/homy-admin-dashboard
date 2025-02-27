import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import UserCalendar from "@/components/Users/UserCalendar"
import axios from "axios"
import { BadgeCheck, Pencil } from 'lucide-react'
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import customer from "../assets/Profile Boy Icon.svg"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Swal from 'sweetalert2'

const Profile = () => {
  const { userId } = useParams<{ userId: string }>()
  const [user, setUser] = useState<any>(null)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [chef, setChef] = useState<any>(null)
  const [verificationStatus,setVerificationStatus] = useState<string>("")
  const location = useLocation()
  const { role } = location.state || {}
  const navigate = useNavigate()

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
      setVerificationStatus(data.data.chef.verificationStatus)
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

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
  
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to change the verification status to "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!"
    });
  
    if (result.isConfirmed) {
      try {
        await axios.post(`/admin/updateVerificationStatusChef`,{ verificationStatus: newStatus,chefId: userId},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }
        );
  
        setVerificationStatus(newStatus);
  
        Swal.fire({
          title: "Updated!",
          text: "Verification status updated successfully!",
          icon: "success"
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update verification status. Please try again.",
          icon: "error"
        });
      }
    }
  };
  

  const handleDialogClose = () => {
    navigate("/usermanagement")
  }

  if ((!user && !chef) || (!userDetails && !chef)) {
    return (
      <div>
        Loading...
        {!userDetails && (
          <Dialog open={true} onOpenChange={handleDialogClose}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insufficient Data</DialogTitle>
              </DialogHeader>
              <p>Not Enough Data to show. Sorry!</p>
            </DialogContent>
          </Dialog>
        )}
      </div>
    )
  }


  return (
    <main className="p-6 w-full flex justify-center gap-6">
      <div className="max-w-4xl w-full p-6 flex items-center space-x-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={role === "chef" ? chef.profilePicture : customer}
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
              <h2 className="text-2xl font-bold">
                {chef
                  ? `${chef.name}`
                  : `${user.firstName} ${user.lastName}`}
              </h2>
              <BadgeCheck className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-muted-foreground">
              {chef ? "Chef" : user.activePlan?.type || "No active plan"}
            </p>
          </div>
        </div>
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                {!chef && <UserCalendar userId={userId} />}
              </div>
              <div className="space-y-1">
                <Label>Full Name</Label>
                <p>{chef ? chef.name : `${user.firstName} ${user.lastName}`}</p>
              </div>

              <div className="space-y-1">
                <Label>Email</Label>
                <p>{chef ? "N/A" : user.email}</p>
              </div>

              {chef ? (
                <>
                  <div className="space-y-1">
                    <Label>Gender</Label>
                    <p>{chef.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Experience</Label>
                    <p>{chef.experienceYears}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Cuisines</Label>
                    <p>{chef.cuisines.join(", ")}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Status</Label>
                    {/* <p>{chef.verificationStatus}</p> */}
                    <p>
                    <select
                      value={verificationStatus}
                      onChange={handleStatusChange}
                      className="border rounded px-2 "
                    >
                      <option value="Pending">Pending</option>
                      <option value="Verified">Verified</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label>Current Area</Label>
                    <p>{chef.currentArea}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Current City</Label>
                    <p>{chef.currentCity}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Travel Mode</Label>
                    <p>{chef.travelMode}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Resume</Label>
                    <a href={chef.resume} target="_blank" rel="noreferrer">
                      <span className="text-red-500">
                        View Resume
                      </span>
                    </a>
                  </div>
                  <div className="space-y-1">
                    <Label>Character Certificate</Label>
                    <a
                      href={chef.characterCertificate}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="text-red-500">
                        View Certificate
                      </span>
                    </a>
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