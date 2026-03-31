


export function InputBox({name, inputer}){
    return <div className="pl-8">
        <span className="text-black text-xl font-semibold font-mono">
         {name}
        </span><br />
        <input className="rounded-md w-80 p-3" type="text" placeholder={inputer}/>
    </div>
}