import { POST } from '../route';
import { NextRequest } from 'next/server';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Mock the DynamoDB client
const mockSend = jest.fn();
jest.mock('@aws-sdk/lib-dynamodb', () => ({
  ...jest.requireActual('@aws-sdk/lib-dynamodb'),
  DynamoDBDocumentClient: {
    from: () => ({
      send: (command: any) => mockSend(command),
    }),
  },
}));

// Mock the invokeClaude function
const mockInvokeClaude = jest.fn();
jest.mock('../route', () => ({
  ...jest.requireActual('../route'),
  invokeClaude: (prompt: string) => mockInvokeClaude(prompt),
}));

describe('/api/results/[id]/refine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should refine a plan and return the updated plan', async () => {
    const req = new NextRequest('http://localhost/api/results/123/refine', {
      method: 'POST',
      body: JSON.stringify({ refinementInstruction: 'Make it more concise' }),
    });
    const params = { params: { id: '123' } };

    const mockItem = {
      id: '123',
      aiResponse: { executiveSummary: 'A very long and detailed plan' },
    };
    const mockRefinedPlan = {
      executiveSummary: 'A concise plan',
    };
    const mockUpdatedAttributes = {
        id: '123',
        aiResponse: mockRefinedPlan,
    }

    // Mock the GetCommand
    mockSend.mockResolvedValueOnce({ Item: mockItem });
    // Mock the UpdateCommand
    mockSend.mockResolvedValueOnce({ Attributes: mockUpdatedAttributes });
    // Mock the invokeClaude function
    mockInvokeClaude.mockResolvedValueOnce(mockRefinedPlan);

    const response = await POST(req, params);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockUpdatedAttributes);
    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(mockInvokeClaude).toHaveBeenCalledTimes(1);
  });

  it('should return an error if refinement instruction is missing', async () => {
    const req = new NextRequest('http://localhost/api/results/123/refine', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const params = { params: { id: '123' } };

    const response = await POST(req, params);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe('Missing refinement instruction');
  });
});