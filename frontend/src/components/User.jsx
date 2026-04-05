import { useState } from "react"
import { PressingButton } from "./PressingButton"
import { useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"




export const Users = () => {

    const [user, setUser ] = useState([]);
    const [filter, setFilter] = useState('')

    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/user/bulk?filter=" + filter)
        .then(response => {
            console.log(response.data.user)
            setUser(response.data.user)
        })
    }, [filter])

    return <>
    <div className="font-bold mt-6 text-lg">
        Users
    </div>

    <div className="my-2">
        <input onChange={e => {
            setFilter(e.target.value)
        }} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
    </div>

    <div>
        {user.map(user => <User user={user}/>)}
    </div>
    </>
}


function User({user}){

    const navigate = useNavigate()

    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full w-12 h-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.FirstName[0]}
                </div>
            </div>

            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.FirstName} {user.LastName}
                </div>
            </div> 
        </div>

        <div className="flex flex-col items-center justify-center h-ful">
            <PressingButton onClick={() => {
                navigate("/send?id=" + user._id + "&name=" + user.FirstName)
            }} label={"Send Money"}/>
        </div>
    </div>
}