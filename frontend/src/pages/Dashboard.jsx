import { useEffect, useState } from "react";
import { InputBox } from "../components/InputBox";
import { useSearchParams } from 'react-router-dom';
import { Person } from "../components/Person";
import {  Users } from "../components/User";
import axios from "axios";



export function Dashboard(){

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id")
  const [ amount, setAmount ] = useState(0);




    return <div>
      <div className="Header flex justify-between text-3xl shadow-md p-2 font-bold">
        <span>Paytm</span><span>Hello, <span><Person icon={"U"}/></span> </span>
      </div>

      <div className="mt-8 ml-8">
        <button onClick={async() => {
      const response = await axios.get(
     "http://localhost:3000/api/v1/account/balance",
     {
     params: {
     id: id
    },
     headers: {
      token: localStorage.getItem("token"),
      "Content-Type": "application/json"
    }
    })
  setAmount(response.data.Balance)

        }} className="text-2xl font-bold">Your Balance {amount}</button>
      </div>

      <Users />

    </div>
}