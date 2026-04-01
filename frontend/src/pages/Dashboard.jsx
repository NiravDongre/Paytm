import { InputBox } from "../components/InputBox";



export function Dashboard(){
    return <div>
      <div className="Header flex justify-between text-3xl shadow-md p-2 font-bold">
        <span>Paytm</span><span>Hello, User</span>
      </div>

      <div className="mt-8 ml-8">
        <span className="text-2xl font-bold">Your Balance $5000</span>
      </div>

      <InputBox className={"w-80"} inputer={"Search"}/>
    </div>
}