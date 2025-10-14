import { POST } from '../route';
import { NextRequest } from 'next/server';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { executeCampaign } from '../../../../../lambda/campaign-manager';

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

// Mock the executeCampaign function
jest.mock('../../../../../lambda/campaign-manager');

describe('/api/results/[id]/approve', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should approve a plan and trigger campaign execution', async () => {
    const req = new NextRequest('http://localhost/api/results/123/approve', {
      method: 'POST',
    });
    const params = { params: { id: '123' } };

    const mockItem = {
      id: '123',
      aiResponse: { executiveSummary: 'A great plan' },
    };
    // Mock the GetCommand
    mockSend.mockResolvedValueOnce({ Item: mockItem });
    // Mock the UpdateCommand
    mockSend.mockResolvedValueOnce({});

    const response = await POST(req, params);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe('Plan approved and campaign execution simulated');
    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(executeCampaign).toHaveBeenCalledWith(mockItem.aiResponse);
  });
});