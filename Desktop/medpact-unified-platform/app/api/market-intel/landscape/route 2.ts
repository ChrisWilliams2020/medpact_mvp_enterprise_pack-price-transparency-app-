// Market Landscape API - Geographic practice analysis and competitive intelligence
import { NextRequest, NextResponse } from 'next/server';
import { requireOrgId } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getMarketSnapshot } from '@/lib/market-intel/queries';
import { marketQueries } from '@/lib/market-intel/queries';

export async function GET(req: NextRequest) {
  try {
    const orgId = await requireOrgId();
    const { searchParams } = new URL(req.url);
    const marketId = searchParams.get('marketId');

    if (!marketId) {
      // For now: get latest market for this org
      const latestMarket = await prisma.market.findFirst({
        where: { ownerOrgId: orgId },
        orderBy: { createdAt: 'desc' },
      });
      if (!latestMarket) return NextResponse.json({ error: 'No market found' }, { status: 404 });
      const data = await getMarketSnapshot(latestMarket.id);
      return NextResponse.json(data);
    }

    const data = await getMarketSnapshot(marketId);
    return NextResponse.json(data);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
    const { searchParams } = new URL(req.url);
    const marketId = searchParams.get('marketId');

    if (!marketId) {
      // For now: get latest market for this org
      const latestMarket = await prisma.market.findFirst({
        where: { ownerOrgId: orgId },
        orderBy: { createdAt: 'desc' },
      });
      if (!latestMarket) return NextResponse.json({ error: 'No market found' }, { status: 404 });
      const data = await getMarketSnapshot(latestMarket.id);
      return NextResponse.json(data);
    }

    const data = await getMarketSnapshot(marketId);
    return NextResponse.json(data);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Enhanced landscape analysis endpoint for geographic queries
export async function POST(request: NextRequest) {
  try {
    const orgId = await requireOrgId();
    const body = await request.json();
    const { lat, lng, radius, specialty, analysisType } = body;
    
    // Default to NYC coordinates if not provided
    const latitude = lat || 40.7128;
    const longitude = lng || -74.0060;
    const searchRadius = radius || 25;
    const specialty = searchParams.get('specialty');
    
    // Get practices in the specified area
    let practices = await marketQueries.getPracticesInArea(lat, lng, radius);
    
    // Filter by specialty if specified
    if (specialty) {
      practices = practices.filter(p => 
        p.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    }

    // Get market metrics for the area
    const marketMetrics = await marketQueries.getMarketMetrics(lat, lng, radius);

    // Calculate additional analytics
    const analytics = {
      practiceCount: practices.length,
      averageRevenue: practices.reduce((sum, p) => sum + p.revenue, 0) / practices.length,
      revenueDistribution: {
        low: practices.filter(p => p.revenue < 1000000).length,
        medium: practices.filter(p => p.revenue >= 1000000 && p.revenue < 2000000).length,
        high: practices.filter(p => p.revenue >= 2000000).length
      },
      competitiveDistribution: practices.reduce((acc, p) => {
        const tier = p.competitiveRating >= 8 ? 'high' : 
                    p.competitiveRating >= 6 ? 'medium' : 'low';
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      specialtyBreakdown: practices.reduce((acc, p) => {
        acc[p.specialty] = (acc[p.specialty] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return NextResponse.json({
      success: true,
      data: {
        practices,
        marketMetrics,
        analytics,
        searchCriteria: {
          location: { lat, lng, radius },
          specialty: specialty || 'all'
        }
      }
    });

  } catch (error) {
    console.error('Landscape API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch landscape data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { practiceId, comparison } = body;

    if (!practiceId) {
      return NextResponse.json(
        { success: false, error: 'Practice ID is required' },
        { status: 400 }
      );
    }

    // Get competitive analysis for the specified practice
    const competitiveAnalysis = await marketQueries.getCompetitiveAnalysis(practiceId);

    return NextResponse.json({
      success: true,
      data: competitiveAnalysis
    });

  } catch (error) {
    console.error('Competitive analysis error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate competitive analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
