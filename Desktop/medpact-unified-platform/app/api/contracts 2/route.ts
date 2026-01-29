import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data: contracts, error } = await supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ contracts: [] });
    }

    return NextResponse.json({ contracts: contracts || [] });
  } catch (error: any) {
    console.error('GET contracts error:', error);
    return NextResponse.json({ contracts: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('contracts')
      .insert([{
        payor_name: body.payor_name,
        contract_type: body.contract_type,
        reimbursement_rate: parseFloat(body.reimbursement_rate),
        effective_date: body.effective_date,
        renewal_date: body.renewal_date,
        notes: body.notes || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ contract: data }, { status: 201 });
  } catch (error: any) {
    console.error('POST contract error:', error);
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Contract ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE contract error:', error);
    return NextResponse.json(
      { error: 'Failed to delete contract' },
      { status: 500 }
    );
  }
}
