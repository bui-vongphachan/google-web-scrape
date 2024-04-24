import Authentication from "@/services/authentication";
import FunctionOutput from "@/services/function-output";

export default function validateFileUpload(
  formData: FormData
): FunctionOutput<File | null> {
  const output = new FunctionOutput<File | null>(true, "", null);

  const uploadingFile = formData.get("file") as File | null;

  if (!uploadingFile) {
    output.message = "Please select a file";
    return output;
  }

  output.isError = false;
  output.message = "";
  output.data = uploadingFile;

  return output;
}
