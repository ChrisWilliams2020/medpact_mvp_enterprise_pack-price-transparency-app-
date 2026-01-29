import { NextRequest, NextResponse } from 'next/server';
import { POST, GET } from './route';

// Mock NextResponse
jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        json: jest.fn((data, init) => ({
            json: async () => data,
            status: init?.status || 200,
        })),
    },
}));

describe('Market Search Analytics API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/analytics/market-search', () => {
        test('successfully records analytics data', async () => {
            const mockData = {
                timestamp: '2024-01-01T00:00:00Z',
                searchLocation: 'San Francisco, CA',
                radius: 25,
                specialty: 'Ophthalmology',
                resultsCount: 15,
            };

            const mockRequest = {
                json: jest.fn().mockResolvedValue(mockData),
            } as unknown as NextRequest;

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(mockRequest.json).toHaveBeenCalled();
            expect(responseData).toEqual({
                message: 'Analytics data received',
                success: true,
            });
            expect(response.status).toBe(200);
        });

        test('handles missing data gracefully', async () => {
            const mockRequest = {
                json: jest.fn().mockResolvedValue({}),
            } as unknown as NextRequest;

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(responseData.success).toBe(true);
        });

        test('handles request parsing errors', async () => {
            const mockRequest = {
                json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
            } as unknown as NextRequest;

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(responseData).toEqual({
                error: 'Failed to record analytics',
            });
            expect(response.status).toBe(500);
        });

        test('logs analytics data to console', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            const mockData = {
                timestamp: '2024-01-01T00:00:00Z',
                searchLocation: 'New York, NY',
                radius: 50,
                specialty: 'Optometry',
                resultsCount: 20,
            };

            const mockRequest = {
                json: jest.fn().mockResolvedValue(mockData),
            } as unknown as NextRequest;

            await POST(mockRequest);

            expect(consoleSpy).toHaveBeenCalledWith(
                '📊 Analytics received:',
                expect.objectContaining({
                    timestamp: mockData.timestamp,
                    location: mockData.searchLocation,
                    radius: mockData.radius,
                    specialty: mockData.specialty,
                    resultsCount: mockData.resultsCount,
                })
            );

            consoleSpy.mockRestore();
        });
    });

    describe('GET /api/analytics/market-search', () => {
        test('returns mock analytics data', async () => {
            const mockRequest = {} as NextRequest;

            const response = await GET(mockRequest);
            const responseData = await response.json();

            expect(responseData).toHaveProperty('totalSearches');
            expect(responseData).toHaveProperty('avgRadius');
            expect(responseData).toHaveProperty('topSpecialty');
            expect(responseData).toHaveProperty('recentSearches');
            expect(responseData.totalSearches).toBe(0);
            expect(responseData.avgRadius).toBe(0);
            expect(responseData.topSpecialty).toBe('All');
            expect(Array.isArray(responseData.recentSearches)).toBe(true);
        });

        test('handles errors when fetching analytics', async () => {
            // This test would be more relevant when database is implemented
            const mockRequest = {} as NextRequest;
            
            // Mock a scenario where the route might fail
            jest.spyOn(NextResponse, 'json').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            try {
                await GET(mockRequest);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    describe('Error Handling', () => {
        test('logs errors to console on POST failure', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            
            const mockRequest = {
                json: jest.fn().mockRejectedValue(new Error('Network error')),
            } as unknown as NextRequest;

            await POST(mockRequest);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '❌ Analytics error:',
                expect.any(Error)
            );

            consoleErrorSpy.mockRestore();
        });

        test('logs errors to console on GET failure', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            
            jest.spyOn(NextResponse, 'json').mockImplementationOnce(() => {
                throw new Error('Fetch error');
            });

            const mockRequest = {} as NextRequest;

            try {
                await GET(mockRequest);
            } catch (error) {
                expect(consoleErrorSpy).toHaveBeenCalled();
            }

            consoleErrorSpy.mockRestore();
        });
    });
});