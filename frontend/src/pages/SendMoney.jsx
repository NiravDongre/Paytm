import { Amount } from "../components/Amount";
import { Headerline } from "../components/Headerline";
import { InputBox } from "../components/InputBox";
import { PressingButton } from "../components/PressingButton";
import { User } from "../components/User";




export function SendMoney(){
    return <div className="Container flex justify-center h-screen items-center">
        <div className="w-96 h-[26rem] bg-blue-500 rounded-xl">
            <Headerline headline={"Send Money"}/>
            <div className="gap-y-10 mt-20">
            <User icon={"A"} username={"Friend's Name"}/>
            <Amount amount={"$100"}/>
            <InputBox inputer={"Enter Amount"}/>
            <PressingButton label={"Initiate Transfer"}/>
            </div>
        </div>
    </div>
}