export default function ExampleFileButton() {
  return (
    <div className=" flex items-center px-6">
      <a
        href="/sample-keyword.csv"
        download="sample-keyword.csv"
        className=" text-grey-300 hover:underline"
      >
        Sample file
      </a>
    </div>
  );
}
