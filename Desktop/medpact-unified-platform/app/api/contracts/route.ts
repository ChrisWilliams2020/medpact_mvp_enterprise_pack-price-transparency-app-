import { NextResponse } from 'next/server';

// Mock healthcare contracts data
const contracts = [
  {
    id: 'CTR-001',
    payerName: 'UnitedHealth',
    serviceLines: ['Cardiology', 'Orthopedics', 'Emergency'],
    currentRate: 125.50,
    marketRate: 148.20,
    expirationDate: '2026-03-15',
    volumeYTD: 15234,
    revenueYTD: 1912567,
    status: 'active',
    negotiationOpportunity: 18.1
  },
  {
    id: 'CTR-002',
    payerName: 'Anthem',
    serviceLines: ['Surgery', 'Imaging', 'Laboratory'],
    currentRate: 98.75,
    marketRate: 115.60,
    expirationDate: '2026-06-30',
    volumeYTD: 12456,
    revenueYTD: 1230345,
    status: 'active',
    negotiationOpportunity: 17.1
  },
  {
    id: 'CTR-003',
    payerName: 'Aetna',
    serviceLines: ['Primary Care', 'Pediatrics'],
    currentRate: 87.50,
    marketRate: 92.30,
    expirationDate: '2026-12-31',
    volumeYTD: 8934,
    revenueYTD: 781725,
    status: 'active',
    negotiationOpportunity: 5.5
  },
  {
    id: 'CTR-004',
    payerName: 'Medicare',
    serviceLines: ['Geriatrics', 'Cardiology', 'Rehabilitation'],
    currentRate: 145.00,
    marketRate: 145.00,
    expirationDate: '2027-01-01',
    volumeYTD: 23456,
    revenueYTD: 3401120,
    status: 'active',
    negotiationOpportunity: 0
  },
  {
    id: 'CTR-005',
    payerName: 'Cigna',
    serviceLines: ['Mental Health', 'Substance Abuse'],
    currentRate: 165.00,
    marketRate: 178.50,
    expirationDate: '2026-04-20',
    volumeYTD: 5678,
    revenueYTD: 937170,
    status: 'expiring_soon',
    negotiationOpportunity: 8.2
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const payer = searchParams.get('payer');

    let filteredContracts = contracts;

    if (status) {
      filteredContracts = filteredContracts.filter(c => c.status === status);
    }

    if (payer) {
      filteredContracts = filteredContracts.filter(c => 
        c.payerName.toLowerCase().includes(payer.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredContracts,
      total: filteredContracts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate contract creation
    const newContract = {
      id: `CTR-${String(contracts.length + 1).padStart(3, '0')}`,
      ...body,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newContract,
      message: 'Contract created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create contract' },
      { status: 500 }
    );
  }
}
