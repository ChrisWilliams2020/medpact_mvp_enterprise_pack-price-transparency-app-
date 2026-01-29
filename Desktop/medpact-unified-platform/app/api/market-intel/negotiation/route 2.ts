// Negotiation Management API - Payer contract negotiation and playbook management
import { NextRequest, NextResponse } from 'next/server';
import { buildNegotiationPlaybook } from '@/lib/market-intel/negotiation';
import { requireOrgId } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const orgId = await requireOrgId();
    const { searchParams } = new URL(req.url);
    const practiceId = searchParams.get('practiceId');

    if (!practiceId) {
      const practice = await prisma.practice.findFirst({ where: { /* ownerOrgId: orgId */ } });
      if (!practice) return NextResponse.json({ error: 'No practice found' }, { status: 404 });
      const playbook = await buildNegotiationPlaybook(practice.id);
      return NextResponse.json(playbook);
    }

    const playbook = await buildNegotiationPlaybook(practiceId);
    return NextResponse.json(playbook);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
      filteredContracts.map(async (contract) => {
        const playbook = await negotiationStrategies.generatePlaybook(
          contract.payerName,
          contract.contractType,
          contract.currentRate,
          {
            revenue: 1500000, // Mock practice data
            patientVolume: 850,
            qualityMetrics: {},
            competitiveRating: 8.2
          }
        );
        
        return {
          ...playbook,
          contractId: contract.id,
          renewalDate: contract.renewalDate,
          urgency: this.calculateUrgency(contract.renewalDate),
          potentialIncrease: contract.marketRate - contract.currentRate,
          percentageIncrease: ((contract.marketRate - contract.currentRate) / contract.currentRate * 100).toFixed(1)
        };
      })
    );

    // Calculate summary metrics
    const totalPotentialIncrease = playbooks.reduce((sum, p) => sum + p.potentialIncrease, 0);
    const highPotentialContracts = playbooks.filter(p => p.successProbability > 70).length;
    const upcomingRenewals = playbooks.filter(p => p.urgency === 'high').length;

    // Get payer intelligence for the most important contracts
    const payerIntelligence = await Promise.all(
      [...new Set(playbooks.map(p => p.payerName))].slice(0, 3).map(async (payer) => {
        return await negotiationStrategies.getPayerIntelligence(payer);
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        playbooks,
        contracts: filteredContracts,
        summary: {
          totalContracts: contracts.length,
          totalPotentialIncrease,
          averageIncrease: totalPotentialIncrease / playbooks.length,
          highPotentialContracts,
          upcomingRenewals,
          successRate: 72 // Historical success rate percentage
        },
        payerIntelligence: payerIntelligence.slice(0, 3),
        urgentActions: playbooks
          .filter(p => p.urgency === 'high' || p.successProbability > 70)
          .slice(0, 5)
          .map(p => ({
            id: p.id,
            action: `Negotiate ${p.payerName} ${p.contractType} contract`,
            priority: p.urgency,
            potentialValue: p.potentialIncrease,
            deadline: p.renewalDate
          }))
      }
    });

  } catch (error) {
    console.error('Negotiation API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch negotiation data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { practiceId, action, data } = body;

    if (!practiceId || !action) {
      return NextResponse.json(
        { success: false, error: 'Practice ID and action are required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'start_negotiation':
        // Initialize a new negotiation process
        const { contractId, payerName, strategy } = data;
        console.log('Starting negotiation:', { practiceId, contractId, payerName, strategy });
        
        // In a real implementation, this would create negotiation tracking record
        const newNegotiationId = `negotiation-${Date.now()}`;
        
        return NextResponse.json({
          success: true,
          data: {
            message: 'Negotiation process initiated',
            negotiationId: newNegotiationId,
            contractId,
            status: 'preparation',
            nextSteps: [
              'Complete market rate analysis',
              'Gather quality metrics documentation',
              'Schedule initial meeting with payer'
            ],
            timeline: '4-6 weeks estimated completion'
          }
        });

      case 'generate_custom_playbook':
        // Generate a custom negotiation playbook
        const { payerName: customPayer, contractType, currentRate, practiceData } = data;
        
        const customPlaybook = await negotiationStrategies.generatePlaybook(
          customPayer,
          contractType,
          currentRate,
          practiceData
        );

        return NextResponse.json({
          success: true,
          data: {
            playbook: customPlaybook,
            playbookId: `playbook-${Date.now()}`
          }
        });

      case 'update_negotiation_status':
        // Update negotiation progress
        const { negotiationId: updateNegotiationId, status, notes, milestone } = data;
        console.log('Updating negotiation status:', { negotiationId: updateNegotiationId, status, notes, milestone });
        
        return NextResponse.json({
          success: true,
          data: {
            message: 'Negotiation status updated',
            negotiationId: updateNegotiationId,
            status,
            updatedAt: new Date().toISOString()
          }
        });

      case 'schedule_meeting':
        // Schedule negotiation meeting
        const { negotiationId: meetingNegotiationId, meeting } = data;
        console.log('Scheduling meeting:', { negotiationId: meetingNegotiationId, meeting });
        
        return NextResponse.json({
          success: true,
          data: {
            message: 'Meeting scheduled successfully',
            meetingId: `meeting-${Date.now()}`,
            negotiationId: meetingNegotiationId,
            scheduledFor: meeting.date
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Negotiation POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { negotiationId, updates } = body;

    if (!negotiationId) {
      return NextResponse.json(
        { success: false, error: 'Negotiation ID is required' },
        { status: 400 }
      );
    }

    // Handle negotiation updates
    const { 
      currentOffer,
      counterOffer,
      status,
      notes,
      documents,
      nextMeeting 
    } = updates;

    console.log('Updating negotiation:', {
      negotiationId,
      currentOffer,
      counterOffer,
      status,
      notes,
      documents,
      nextMeeting
    });

    // Calculate negotiation progress
    const progressPercentage = this.calculateNegotiationProgress(status);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Negotiation updated successfully',
        negotiationId,
        progress: progressPercentage,
        status,
        updatedAt: new Date().toISOString(),
        nextActions: this.getNextActions(status)
      }
    });

  } catch (error) {
    console.error('Negotiation PUT error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update negotiation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate urgency based on renewal date
function calculateUrgency(renewalDate: Date): 'high' | 'medium' | 'low' {
  const today = new Date();
  const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilRenewal <= 90) return 'high';
  if (daysUntilRenewal <= 180) return 'medium';
  return 'low';
}

// Helper function to calculate negotiation progress
function calculateNegotiationProgress(status: string): number {
  const statusProgress: Record<string, number> = {
    'preparation': 20,
    'initial_contact': 35,
    'proposal_submitted': 50,
    'under_review': 65,
    'negotiating': 80,
    'final_review': 90,
    'completed': 100,
    'stalled': 45
  };
  
  return statusProgress[status] || 0;
}

// Helper function to get next actions based on status
function getNextActions(status: string): string[] {
  const actionMap: Record<string, string[]> = {
    'preparation': [
      'Complete market rate analysis',
      'Gather quality metrics',
      'Prepare negotiation materials'
    ],
    'initial_contact': [
      'Schedule negotiation meeting',
      'Send initial proposal',
      'Confirm stakeholder availability'
    ],
    'proposal_submitted': [
      'Follow up on proposal review',
      'Prepare for questions',
      'Schedule discussion meeting'
    ],
    'negotiating': [
      'Review counter-proposal',
      'Prepare response strategy',
      'Consult with decision makers'
    ],
    'final_review': [
      'Review contract terms',
      'Get legal approval',
      'Prepare for execution'
    ]
  };
  
  return actionMap[status] || ['Contact payer for status update'];
}
