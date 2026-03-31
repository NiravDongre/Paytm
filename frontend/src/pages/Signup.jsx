import { Headerline } from "../components/Headerline";
import { InputBox } from "../components/InputBox";
import { PressingButton } from "../components/PressingButton";
import { SubHead } from "../components/SubHead";


export function Signup(){
    return <>
    <div className="Container  flex justify-center h-screen items-center ">
    <div className="grid w-96 h-[32rem] bg-blue-500 grid-col-1-gap-1 rounded-lg">
    <Headerline headline={"Sign Up"}/>
    <SubHead subline={"Enter your information to create an account"}/>
    <InputBox name={"First Name"} inputer={"Nirav"} />
    <InputBox name={"Last Name"} inputer={"Dongre"}/>
    <InputBox name={"Password"} inputer={"123456"}/>
    <PressingButton label={"Sign Up"}/>
    </div>
    </div>
    </>
}