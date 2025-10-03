import { toast } from "sonner";

const style = {
  borderRadius: "8px",
  borderColor: "#404040", // # bg-neutral-700
  backgroundColor: "#171717", // # bg-neutral-900
  color: "#f5f5f5", // # text-neutral-100
};

export const sonnerToastError = (message: string) => {
  return toast.error(message, { style });
};

// TODO
export const sonnerToastPromise = (
  promise: Promise<any>,
  success: (data: any) => string,
  error: (data: any) => string,
  loading: string = "Carregando..."
) => {
  return toast.promise(promise, {
    loading,
    success: (data) => success(data),
    error: (data) => error(data),
    style,
  });
};

// TODO
// export const sonnerToastCustom = () => (
//   <button
//     onClick={() =>
//       toast.custom((t) => (
//         <div
//           style={{
//             backgroundColor: "darkblue",
//             color: "white",
//             padding: "10px",
//             borderRadius: "5px",
//           }}
//         >
//           My fully custom toast!
//           <button onClick={() => toast.dismiss(t)}>Dismiss</button>
//         </div>
//       ))
//     }
//   >
//     Show Headless Toast
//   </button>
// );
