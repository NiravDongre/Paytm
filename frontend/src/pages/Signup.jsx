import { useState } from "react";
import axios from "axios";
import { Headerline } from "../components/Headerline";
import { InputBox } from "../components/InputBox";
import { PressingButton } from "../components/PressingButton";
import { SubHead } from "../components/SubHead";


export function Signup(){

    const [ firstName, setfirstName ] = useState("");
    const [ lastName, setlastName ] = useState("");
    const [ password, setPassword ] = useState("");

    return <>
    <div className="Container  flex justify-center h-screen items-center">
    <div className="grid w-96 h-[32rem] bg-blue-500 grid-col-1-gap-1 rounded-lg">
    <Headerline headline={"Sign Up"}/>
    <SubHead subline={"Enter your information to create an account"}/>

    <InputBox onChange={e => {
        setfirstName(e.target.value)
    }} name={"First Name"} inputer={"Nirav"} />

    <InputBox onChange={e => {
        setlastName(e.target.value)
    }} name={"Last Name"} inputer={"Dongre"}/>

    <InputBox onChange={e => {
        setPassword(e.target.value)
    }} name={"Password"} inputer={"123456"}/>

    <PressingButton onClick={async () => {
        const response = await axios.post("http://localhost:3000/api/v1/user/signup",{
            firstName,
            lastName,
            password
        })

        localStorage.setItem("token",response.data.token)
    }} label={"Sign Up"}/>

    </div>
    </div>
    </>
}