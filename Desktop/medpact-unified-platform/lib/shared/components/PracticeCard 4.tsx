/**
 * Reusable Practice Card Component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Practice } from '../types';
import { PracticeService } from '../services/practiceService';

interface PracticeCardProps {
  practice: Practice;
  onSelect?: (id: string) => void;
  showActions?: boolean;
}

export function PracticeCard({ 
  practice, 
  onSelect, 
  showActions = true
}: PracticeCardProps) {
  const avgRating = PracticeService.calculateAverageRating(practice);
  const ratingColor = PracticeService.getRatingColor(avgRating);

  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader>
        <CardTitle>{practice.name}</CardTitle>
        <p className="text-sm text-gray-600">{practice.specialty}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            📍 {practice.address}, {practice.city}, {practice.state}
          </p>
          <p className="text-sm text-gray-500">📞 {practice.phone}</p>
          {practice.website && (
            <a
              href={practice.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline block"
              onClick={(e) => e.stopPropagation()}
            >
              🌐 Visit Website
            </a>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className={`text-2xl font-bold ${ratingColor}`}>
            {avgRating} ⭐
          </div>
          {practice.distance && (
            <div className="text-sm text-gray-600">
              📏 {PracticeService.formatDistance(practice.distance)}
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center pt-4 border-t">
          <div>
            <p className="text-xs text-gray-500">Google</p>
            <p className="font-bold text-blue-600">{practice.googleRating}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Yelp</p>
            <p className="font-bold text-red-600">{practice.yelpRating}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Healthgrades</p>
            <p className="font-bold text-green-600">{practice.healthgradesRating}</p>
          </div>
        </div>

        {showActions && (
          <Button onClick={() => onSelect?.(practice.id)} className="w-full mt-4">
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
