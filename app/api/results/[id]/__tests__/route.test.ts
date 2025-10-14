import { GET } from '../route';
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

describe('/api/results/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a result if found', async () => {
    const req = new NextRequest('http://localhost/api/results/123');
    const params = { params: { id: '123' } };

    const mockItem = {
      id: '123',
      aiResponse: { executiveSummary: 'A great plan' },
    };
    mockSend.mockResolvedValueOnce({ Item: mockItem });

    const response = await GET(req, params);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockItem);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('should return a 404 error if result is not found', async () => {
    const req = new NextRequest('http://localhost/api/results/123');
    const params = { params: { id: '123' } };

    mockSend.mockResolvedValueOnce({ Item: null });

    const response = await GET(req, params);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.message).toBe('Result not found');
  });
});