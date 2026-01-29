import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const userId = 'test-user'; // Temporary: mock user for testing
    
    const body = await req.json();
    const { searchLocation, searchParams, results } = body;

    console.log('📊 Saving search to database...', {
      userId,
      location: searchLocation,
      resultsCount: results.length,
    });

    const { data, error } = await supabase
      .from('market_searches')
      .insert({
        user_id: userId,
        search_location: searchLocation,
        search_params: searchParams,
        results_count: results.length,
        results_data: results,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log('✅ Search saved to database:', data.id);

    return NextResponse.json({
      success: true,
      searchId: data.id,
      message: 'Search saved to database',
    });
  } catch (error: any) {
    console.error('❌ Analytics error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = 'test-user'; // Temporary

    const { data: searches, error } = await supabase
      .from('market_searches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    const userSearches = userId ? searches.filter((s) => s.user_id === userId) : searches;
    const totalSearches = userSearches.length;
    const avgRadius = userSearches.length > 0
      ? Math.round(userSearches.reduce((sum, s) => sum + s.search_params.radius, 0) / userSearches.length)
      : 0;

    const specialtyCounts: Record<string, number> = {};
    userSearches.forEach((s) => {
      const specialty = s.search_params.specialty || 'All';
      specialtyCounts[specialty] = (specialtyCounts[specialty] || 0) + 1;
    });

    const topSpecialty = Object.entries(specialtyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return NextResponse.json({
      totalSearches,
      avgRadius,
      topSpecialty,
      recentSearches: userSearches.slice(0, 10),
      source: 'database',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
