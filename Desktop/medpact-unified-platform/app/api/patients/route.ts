import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json(patients || []);
  } catch (error) {
    console.error('Patients error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const { data: patient, error } = await supabase
      .from('patients')
      .insert([{ ...body, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}
