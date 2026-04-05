


export function PressingButton({label, onClick}) {
  return (
    <div className="px-4">
      <button
        type="button"
        onClick={onClick}
        className="w-full bg-white rounded-md text-xl font-bold py-2 text-center"
     >
        {label || "Initiate Transfer"}
      </button>
    </div>
  )
}