// Define the standardized JSON format for processed data
export interface NormalizedData {
  source: "textract" | "rekognition" | "text";
  fileId: string;
  content: any;
  timestamp: string;
}

// Normalizes data from AWS Textract
export function normalizeTextractOutput(fileId: string, textractData: any[]): NormalizedData {
  const extractedContent = textractData.reduce((acc, item) => {
    const key = Object.keys(item)[0];
    acc[key] = item[key];
    return acc;
  }, {} as Record<string, string>);

  return {
    source: "textract",
    fileId,
    content: extractedContent,
    timestamp: new Date().toISOString(),
  };
}

// Normalizes data from AWS Rekognition
export function normalizeRekognitionOutput(fileId: string, rekognitionData: any[]): NormalizedData {
  const labels = rekognitionData.map(label => ({
    name: label.Name,
    confidence: label.Confidence,
  }));

  return {
    source: "rekognition",
    fileId,
    content: { labels },
    timestamp: new Date().toISOString(),
  };
}

// Normalizes plain text input
export function normalizeTextInput(fileId: string, text: string): NormalizedData {
  return {
    source: "text",
    fileId,
    content: { text },
    timestamp: new Date().toISOString(),
  };
}