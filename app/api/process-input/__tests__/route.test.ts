import { POST } from '../route';
import { NextRequest } from 'next/server';
import { S3Client } from '@aws-sdk/client-s3';
import { TextractClient } from '@aws-sdk/client-textract';
import { RekognitionClient } from '@aws-sdk/client-rekognition';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Mock the AWS SDK clients
jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/client-textract');
jest.mock('@aws-sdk/client-rekognition');
jest.mock('@aws-sdk/client-bedrock-runtime');
jest.mock('@aws-sdk/client-dynamodb');

// Mock the invokeClaude function
const mockInvokeClaude = jest.fn();
jest.mock('../route', () => ({
  ...jest.requireActual('../route'),
  invokeClaude: (prompt: string) => mockInvokeClaude(prompt),
}));

describe('/api/process-input', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should process a text input and return a business plan', async () => {
    const req = new NextRequest('http://localhost/api/process-input', {
      method: 'POST',
      body: JSON.stringify({ text: 'A new coffee shop' }),
    });

    // Mock the responses from the LLM
    mockInvokeClaude
      .mockResolvedValueOnce({
        industry: 'Food & Beverage',
        targetAudience: 'Coffee lovers',
        valueProposition: 'High-quality coffee',
      })
      .mockResolvedValueOnce({
        marketingChannels: ['Social Media', 'Local Events'],
        kpis: ['Daily sales', 'Customer satisfaction'],
      })
      .mockResolvedValueOnce({
        executiveSummary: 'A new coffee shop...',
      });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe('Processing complete');
    expect(body.aiResponse).toEqual({
      executiveSummary: 'A new coffee shop...',
      industry: 'Food & Beverage',
      targetAudience: 'Coffee lovers',
      valueProposition: 'High-quality coffee',
      marketingChannels: ['Social Media', 'Local Events'],
      kpis: ['Daily sales', 'Customer satisfaction'],
    });
    expect(mockInvokeClaude).toHaveBeenCalledTimes(3);
  });

  it('should return an error if no input is provided', async () => {
    const req = new NextRequest('http://localhost/api/process-input', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe('No input provided');
  });
});