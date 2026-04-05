


export function PressingButton({label, onClick}){
    return <div className="flex justify-center">
    <button onClick={onClick} className="bg-white w-80 rounded-md text-xl font-bold mb-8">
        {label}
    </button>
    </div>

}