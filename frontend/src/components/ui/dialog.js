import { useState } from "react";
import { Button } from "./button";

export function Dialog({ triggerText = "Start New", title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{triggerText}</Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                ✖
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}




// export function Dialog({ open, onOpenChange, children }) {
//   return open ? <>{children}</> : null;
// }

export function DialogTrigger({ children, onClick }) {
  return (
    <button onClick={onClick} className="text-sm text-blue-600 hover:underline">
      {children}
    </button>
  );
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
