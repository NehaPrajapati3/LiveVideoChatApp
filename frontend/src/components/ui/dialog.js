import React,{ useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

// export function Dialog({ title = "Start Meeting", children }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       <Button onClick={() => setOpen(true)} className="bg-blue-600 text-white">
//         + Start Meeting
//       </Button>

//       {open && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">{title}</h2>
//               <button
//                 onClick={() => setOpen(false)}
//                 className="text-gray-500 hover:text-black"
//               >
//                 ✖
//               </button>
//             </div>

//             <Input placeholder="Meeting Title" className="mb-4" />
//             <Button className="w-full bg-blue-600 text-white">Start Now</Button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
export function Dialog({ children }) {
  return <>{children}</>;
}

export function DialogTrigger({ children, onClick }) {
  return React.cloneElement(children, {
    onClick,
  });
}

export function DialogContent({ children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
        {children}
      </div>
    </div>
  );
}