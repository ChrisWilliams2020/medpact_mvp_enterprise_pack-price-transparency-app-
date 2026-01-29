/**
 * Practice Service - Centralized practice operations
 */

import { Practice, SearchParams } from '../types';

export class PracticeService {
  static async searchPractices(params: SearchParams): Promise<Practice[]> {
    const mockPractices: Practice[] = [
      {
        id: '1',
        name: 'Bay Area Primary Care',
        address: '123 Medical Plaza Dr',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        phone: '(415) 555-0100',
        specialty: 'Internal Medicine',
        googleRating: 4.8,
        yelpRating: 4.5,
        healthgradesRating: 4.7,
        totalReviews: 342,
        distance: 2.3,
        website: 'https://bayareaprimarycare.com',
        lat: 37.7749,
        lng: -122.4194
      },
      {
        id: '2',
        name: 'Golden Gate Family Medicine',
        address: '456 Healthcare Ave',
        city: 'San Francisco',
        state: 'CA',
        zip: '94103',
        phone: '(415) 555-0200',
        specialty: 'Family Medicine',
        googleRating: 4.6,
        yelpRating: 4.3,
        healthgradesRating: 4.5,
        totalReviews: 218,
        distance: 3.1,
        website: 'https://goldengatefamily.com',
        lat: 37.7849,
        lng: -122.4094
      },
      {
        id: '3',
        name: 'Pacific Heights Cardiology',
        address: '789 Heart Center Blvd',
        city: 'San Francisco',
        state: 'CA',
        zip: '94109',
        phone: '(415) 555-0300',
        specialty: 'Cardiology',
        googleRating: 4.9,
        yelpRating: 4.7,
        healthgradesRating: 4.8,
        totalReviews: 456,
        distance: 4.5,
        website: 'https://pacificheightscardio.com',
        lat: 37.7949,
        lng: -122.4294
      },
      {
        id: '4',
        name: 'Mission District Orthopedics',
        address: '321 Bone & Joint Way',
        city: 'San Francisco',
        state: 'CA',
        zip: '94110',
        phone: '(415) 555-0400',
        specialty: 'Orthopedics',
        googleRating: 4.7,
        yelpRating: 4.4,
        healthgradesRating: 4.6,
        totalReviews: 289,
        distance: 5.2,
        website: 'https://missionortho.com',
        lat: 37.7649,
        lng: -122.4394
      },
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockPractices;
  }

  static calculateAverageRating(practice: Practice): number {
    const avg = (practice.googleRating + practice.yelpRating + practice.healthgradesRating) / 3;
    return Math.round(avg * 10) / 10;
  }

  static getRatingColor(rating: number): string {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-orange-600';
  }

  static formatDistance(miles: number): string {
    return `${miles.toFixed(1)} mi`;
  }
}
