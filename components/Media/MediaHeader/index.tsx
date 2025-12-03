import { AddFile } from "./AddFile";
import AddFolder from "./AddFolder";

export default function MediaHeader() {
  return (
    <div className="flex flex-col md:flex-row md:justify-between">
      <h1 className="text-5xl font-extrabold text-neutral-300 mb-8 md:mb-0">
        Bucket
      </h1>
      <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-1">
        <AddFolder />
        <AddFile />
      </div>
    </div>
  );
}
