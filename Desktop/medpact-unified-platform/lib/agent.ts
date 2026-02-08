// Unified AI Agent Orchestrator
import { PredictionEngine } from './ai/predictionEngine';
import { securityGuard } from './ai/security-guard';
// Add more AI agent imports as needed

// Unified MedPact AI Agent Orchestrator
import PredictionEngine from './ai/predictionEngine';
import { AISecurityGuard } from './ai/security-guard';


// Proprietary/trade secret guard: never share code, app creation, or dev info
function guardOutput(output: any): any {
  if (typeof output === 'string' && (
    /source code|app creation|development|proprietary|trade secret|internal logic|implementation detail/i.test(output)
  )) {
    return '[REDACTED]';
  }
  if (typeof output === 'object' && output !== null) {
    const guarded = Array.isArray(output) ? [] : {};
    for (const key in output) {
      guarded[key] = guardOutput(output[key]);
    }
    return guarded;
  }
  return output;
}

export const medPactAgent = {
  name: 'MedPactAI',
  persona: 'default',
  setPersona(persona: string) {
    this.persona = persona;
  },
  // AI Prediction methods
  async predictContractRenewal(contractId: string) {
    const result = await PredictionEngine.predictContractRenewal(contractId);
    return guardOutput(result);
  },
  async predictPatientVolume(practiceId: string) {
    const result = await PredictionEngine.predictPatientVolume(practiceId);
    return guardOutput(result);
  },
  async analyzeContractRisk(contractId: string) {
    const result = await PredictionEngine.analyzeContractRisk(contractId);
    return guardOutput(result);
  },
  async generateRecommendations(data: any) {
    // Pass persona to AI logic if supported
    const result = await PredictionEngine.generateRecommendations({ ...data, persona: this.persona });
    return guardOutput(result);
  },

  // Security Guard methods
  sanitizeForAI(input: string) {
    return guardOutput(AISecurityGuard.sanitizeForAI(input));
  },
  isBlockedFromAI(content: string) {
    return guardOutput(AISecurityGuard.isBlockedFromAI(content));
  },
  sanitizeQuery(query: string) {
    return guardOutput(AISecurityGuard.sanitizeQuery(query));
  },
  sanitizeError(error: Error | string) {
    return guardOutput(AISecurityGuard.sanitizeError(error));
  },
  validateRequest(path: string) {
    return guardOutput(AISecurityGuard.validateRequest(path));
  },
  createSafeLog(level: 'info' | 'warn' | 'error', message: string, metadata?: Record<string, any>) {
    return guardOutput(AISecurityGuard.createSafeLog(level, message, metadata));
  },
  async hasAuthorization(userId: string, resource: string) {
    const result = await AISecurityGuard.hasAuthorization(userId, resource);
    return guardOutput(result);
  },

  // Activation placeholder
  activateAll() {
    // All static agents are linked and ready
    return `${this.name} AI agents linked and activated as persona: ${this.persona}`;
  }
};

// Activate all agents on import
medPactAgent.activateAll();
