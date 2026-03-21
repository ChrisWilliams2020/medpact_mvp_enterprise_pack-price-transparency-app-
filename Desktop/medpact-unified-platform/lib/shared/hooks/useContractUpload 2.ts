/**
 * Contract Upload Hook
 */

import { useState } from 'react';
import { ContractService } from '../services/contractService';
import { Contract } from '../types';

export function useContractUpload() {
  const [uploading, setUploading] = useState(false);
  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadContract = async (file: File, practiceId?: string) => {
    setUploading(true);
    setError(null);

    try {
      const result = await ContractService.uploadContract(file, practiceId);
      setContract(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to upload contract');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setContract(null);
    setError(null);
  };

  return { uploadContract, uploading, contract, error, reset };
}
