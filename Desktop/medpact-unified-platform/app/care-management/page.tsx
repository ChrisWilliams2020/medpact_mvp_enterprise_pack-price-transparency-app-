'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, FileText, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function CareManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            💚 Care Management
          </h1>
          <p className="text-gray-600">
            Streamline patient care coordination and protocols
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle>Patient Protocols</CardTitle>
                  <CardDescription>Standardized care pathways</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Create and manage evidence-based care protocols for common conditions.
              </p>
              <Button>View Protocols</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Care Team Coordination</CardTitle>
                  <CardDescription>Collaborate effectively</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Coordinate care across providers, nurses, and support staff.
              </p>
              <Button>Manage Team</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Clinical Documentation</CardTitle>
                  <CardDescription>Efficient record keeping</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Streamlined documentation tools for accurate clinical records.
              </p>
              <Button>View Documents</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Follow-up Scheduling</CardTitle>
                  <CardDescription>Automated reminders</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Automatic scheduling and reminders for patient follow-ups.
              </p>
              <Button>View Schedule</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
