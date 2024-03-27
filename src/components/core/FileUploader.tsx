interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function FileUploader(props: Props) {
  return (
    <div className="flex p-1">
      <label
        htmlFor="file-upload"
        className="relative cursor-pointer bg-white rounded-md font-medium border border-gray-300 hover:border-gray-400 px-4 py-2 inline-flex items-center"
      >
        <span className=" text-gray-700">Choose a file</span>
        <input {...props} id="file-upload" />
      </label>
    </div>
  );
}
