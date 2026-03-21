import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

export async function GET(request: NextRequest) {
  try {
    console.log('💰 Fetching revenue opportunities...');
    const supabase = await getSupabaseClient();
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log('🔐 Session:', session?.user?.id || 'No session');

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('revenue_opportunities')
      .select('*')
      .order('estimated_revenue', { ascending: false });

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log('✅ Revenue opportunities fetched:', data?.length || 0);
    return NextResponse.json({ opportunities: data });
  } catch (error: any) {
    console.error('💥 Revenue opportunities API error:', error.message, error);
    return NextResponse.json({ 
      error: error.message,
      details: error.toString() 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('💰 Adding revenue opportunity...');
    const supabase = await getSupabaseClient();
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('📝 Opportunity data:', body);

    const { data, error } = await supabase
      .from('revenue_opportunities')
      .insert({
        user_id: session.user.id,
        ...body,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Insert error:', error);
      throw error;
    }

    console.log('✅ Opportunity added:', data.id);
    return NextResponse.json({ opportunity: data });
  } catch (error: any) {
    console.error('💥 Add opportunity error:', error.message, error);
    return NextResponse.json({ 
      error: error.message,
      details: error.toString() 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('💰 Updating revenue opportunity...');
    const supabase = await getSupabaseClient();
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    console.log('📝 Updating opportunity:', id, updates);

    const { data, error } = await supabase
      .from('revenue_opportunities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Update error:', error);
      throw error;
    }

    console.log('✅ Opportunity updated:', data.id);
    return NextResponse.json({ opportunity: data });
  } catch (error: any) {
    console.error('💥 Update opportunity error:', error.message, error);
    return NextResponse.json({ 
      error: error.message,
      details: error.toString() 
    }, { status: 500 });
  }
}
