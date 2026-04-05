import { Amount } from "../components/Amount";
import { Headerline } from "../components/Headerline";
import { InputBox } from "../components/InputBox";
import { PressingButton } from "../components/PressingButton";
import { Person } from "../components/Person";
import { useSearchParams } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";



export function SendMoney(){
    const [searchParams] = useSearchParams();
    const [ amount, setAmount ] = useState(0)
    const id = searchParams.get("id");
    const name = searchParams.get("name")

    console.log(id)
    
    return <div className="Container flex justify-center h-screen items-center">
        <div className="w-96 h-[26rem] bg-blue-500 rounded-xl">
            <Headerline headline={"Send Money"}/>
            <div className="gap-y-10 mt-20">
            <Person icon={name[0]} username={name}/>
            <Amount/>
            <InputBox onChange={e => {
                setAmount(e.target.value)
            }} inputer={"Enter Amount"}/>
            <PressingButton onClick={() => {
                axios.post("http://localhost:3000/api/v1/account/transfer",{
                    to: id,
                    amount: amount
                },{
                    headers: {
                        token: localStorage.getItem("token"),
                        "Content-Type": "application/json"
                    }
                })
            }} label={"Initiate Transfer"}/>
            </div>
        </div>
    </div>
}