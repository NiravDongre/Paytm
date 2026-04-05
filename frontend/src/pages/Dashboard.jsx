import { InputBox } from "../components/InputBox";

import { Person } from "../components/Person";
import {  Users } from "../components/User";



export function Dashboard(){
    return <div>
      <div className="Header flex justify-between text-3xl shadow-md p-2 font-bold">
        <span>Paytm</span><span>Hello, <span><Person icon={"U"}/></span> </span>
      </div>

      <div className="mt-8 ml-8">
        <span className="text-2xl font-bold">Your Balance $5000</span>
      </div>

      <Users />

    </div>
}