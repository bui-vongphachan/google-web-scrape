"use server";

import { redirect } from "next/navigation";
import Authentication from "@/services/authentication";
import FunctionOutput from "@/services/function-output";
import RabbitMQ from "@/services/rabbitmq";
import UploadFile from "@/services/file";
import validateFileUpload from "@/validators/validate-file-upload";
import KeywordList from "@/services/keywordList";

const rabbitMQ = new RabbitMQ();

export default async function submitFileUpload(
  prevState: FunctionOutput<void>,
  formData: FormData
) {
  prevState.message = "";
  prevState.isError = false;

  // Check if file is uploaded
  const validateFileUploadOutput = validateFileUpload(formData);

  if (validateFileUploadOutput.isError || !validateFileUploadOutput.data)
    return validateFileUploadOutput;

  // Get list of keywords
  const file = new UploadFile(validateFileUploadOutput.data, "d");

  const getKeywordsOutput = await file.getKeywords();

  if (getKeywordsOutput.isError) return getKeywordsOutput;

  // Check if user is logged in
  const auth = new Authentication("", "", "");

  const validateAccessTokenOutput = await auth.validateAccessToken();

  if (validateAccessTokenOutput.isError) return validateAccessTokenOutput;

  // Save file
  await file.save();

  const keywordList = new KeywordList(file.keywords, file.id);

  // Remove duplicating keywords
  const removeDuplicatesOutput = await keywordList.removeDuplicates();

  if (removeDuplicatesOutput.isError) return removeDuplicatesOutput;

  // Save keywords
  const saveKeywordsOutput = await keywordList.save();

  if (saveKeywordsOutput.isError) return saveKeywordsOutput;

  // Start RabbitMQ connection
  const connectionOutput = await rabbitMQ.connect();

  if (connectionOutput.isError) return connectionOutput;

  const warmupOutput = await rabbitMQ.warnup();

  if (warmupOutput.isError) return warmupOutput;

  // Publish to RabbitMQ
  const publishOutput = await keywordList.publish(rabbitMQ);

  if (publishOutput.isError) return publishOutput;

  redirect("?message=File uploaded successfully");
}
