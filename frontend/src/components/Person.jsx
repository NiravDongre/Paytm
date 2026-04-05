

export function Person({icon, username}){
    return <div className="flex gap-x-3">
        <span className="w-[40-px] ml-6 h-[2.4rem] p-3 text-lg flex items-center rounded-full bg-white">
            {icon}
        </span>
        <span className="text-3xl text-white flex items-center font-bold">
            {username}
        </span>
    </div>
}