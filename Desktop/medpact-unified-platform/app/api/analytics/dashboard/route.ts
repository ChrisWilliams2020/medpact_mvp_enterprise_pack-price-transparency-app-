import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get('range') || '30d';

  console.log('🔍 Fetching analytics data...');

  const daysAgo = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);

  try {
    const { data: searches, error } = await supabase
      .from('market_searches')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json({ 
        error: error.message,
        totalSearches: 0,
        avgRadius: 0,
        topSpecialty: 'N/A',
        avgPracticesFound: 0,
        recentSearches: [],
        searchesByDay: [],
        practicesBySpecialty: [],
        topLocations: [],
      }, { status: 200 });
    }

    console.log(`✅ Found ${searches?.length || 0} searches`);

    const totalSearches = searches?.length || 0;
    
    const avgRadius = searches?.length
      ? searches.reduce((sum, s) => sum + (s.search_params?.radius || 10), 0) / searches.length
      : 0;

    const practicesBySpecialty: Record<string, number> = {};
    searches?.forEach((search) => {
      const specialty = search.search_params?.specialty || 'all';
      practicesBySpecialty[specialty] = (practicesBySpecialty[specialty] || 0) + 1;
    });

    const topSpecialty = Object.entries(practicesBySpecialty)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    const avgPracticesFound = searches?.length
      ? searches.reduce((sum, s) => sum + (s.results_count || 0), 0) / searches.length
      : 0;

    const searchesByDay: Record<string, number> = {};
    searches?.forEach((search) => {
      const date = new Date(search.created_at).toISOString().split('T')[0];
      searchesByDay[date] = (searchesByDay[date] || 0) + 1;
    });

    const locationCounts: Record<string, { lat: number; lng: number; count: number }> = {};
    searches?.forEach((search) => {
      if (search.search_location?.lat && search.search_location?.lng) {
        const key = `${search.search_location.lat.toFixed(2)},${search.search_location.lng.toFixed(2)}`;
        if (locationCounts[key]) {
          locationCounts[key].count++;
        } else {
          locationCounts[key] = {
            lat: search.search_location.lat,
            lng: search.search_location.lng,
            count: 1,
          };
        }
      }
    });

    const topLocations = Object.values(locationCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      totalSearches,
      avgRadius: Math.round(avgRadius * 10) / 10,
      topSpecialty,
      avgPracticesFound,
      recentSearches: searches?.slice(0, 50) || [],
      searchesByDay: Object.entries(searchesByDay).map(([date, count]) => ({
        date,
        count,
      })),
      practicesBySpecialty: Object.entries(practicesBySpecialty).map(
        ([specialty, count]) => ({ specialty, count })
      ),
      topLocations,
    });
  } catch (error: any) {
    console.error('❌ Dashboard analytics error:', error);
    return NextResponse.json({ 
      error: error.message,
      totalSearches: 0,
      avgRadius: 0,
      topSpecialty: 'N/A',
      avgPracticesFound: 0,
      recentSearches: [],
      searchesByDay: [],
      practicesBySpecialty: [],
      topLocations: [],
    }, { status: 200 });
  }
}
