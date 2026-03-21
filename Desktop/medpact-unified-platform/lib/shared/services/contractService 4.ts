/**
 * Contract Service - Centralized contract operations
 */

import { Contract } from '../types';

export class ContractService {
  static async uploadContract(file: File, practiceId?: string): Promise<Contract> {
    // Mock upload - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      id: '1',
      practice_id: practiceId || '1',
      file_name: file.name,
      file_url: 'https://example.com/contract.pdf',
      status: 'completed',
      created_at: new Date().toISOString()
    };
  }

  static getStatusColor(status: Contract['status']): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'analyzing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  static formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
