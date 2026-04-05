


export function InputBox({name, inputer, onChange, onClick, id}){
    return <div className="pl-8">
        <span className="text-black text-xl font-semibold font-mono">
         {name}
        </span><br />
        <input onChange={onChange} onClick={onClick} id="amount" className="rounded-md w-80 p-3" type="number" placeholder={inputer}/>
    </div>
}