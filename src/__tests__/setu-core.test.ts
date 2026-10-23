import { describe, it, expect } from 'vitest';
import { generateEmpatheticFallback } from '@/app/api/process-intent/route';

describe('SETU AI Core Logic & Accessibility Tests', () => {
  it('should generate emergency dispatch plan for cardiac or health crisis', () => {
    const prompt = 'My father has acute dizziness and older prescriptions, need medical doctor advice';
    const result = generateEmpatheticFallback(prompt, 0, undefined);

    expect(result).toBeDefined();
    expect(result.urgencyLevel).toBe('URGENT');
    expect(result.category).toBe('MEDICAL');
    expect(result.nearbyServices).toBeDefined();
    expect(result.nearbyServices?.length).toBeGreaterThan(0);
    expect(result.actionPlan?.length).toBeGreaterThan(0);
    expect(result.simulatedApiPayload.targetSystem).toBeDefined();
    expect(result.simulatedApiPayload.dispatchUnits).toBeDefined();
  });

  it('should generate emergency plan for traffic collision or road hazard', () => {
    const prompt = 'Major road accident between two cars, highway blocked, need patrol and emergency';
    const result = generateEmpatheticFallback(prompt, 1, undefined);

    expect(result).toBeDefined();
    expect(result.urgencyLevel).toBe('CRITICAL');
    expect(result.category).toBe('ROAD_SAFETY');
    expect(result.nearbyServices?.some(s => s.type === 'HOSPITAL' || s.type === 'POLICE_FIRE')).toBe(true);
  });

  it('should generate routine advisory for standard non-critical inquiry', () => {
    const prompt = 'Need general neighborhood updates regarding civic waste disposal schedule';
    const result = generateEmpatheticFallback(prompt, 0, undefined);

    expect(result).toBeDefined();
    expect(['ROUTINE', 'NEEDS_ATTENTION']).toContain(result.urgencyLevel);
    expect(result.actionPlan?.length).toBeGreaterThanOrEqual(2);
    expect(result.summary).toBeTruthy();
  });

  it('should ensure simulated API CAD payload includes all critical fields', () => {
    const result = generateEmpatheticFallback('Severe vehicle crash on highway', 0, undefined);

    expect(result.simulatedApiPayload).toHaveProperty('targetSystem');
    expect(result.simulatedApiPayload).toHaveProperty('protocolCode');
    expect(result.simulatedApiPayload).toHaveProperty('priorityQueue');
    expect(result.simulatedApiPayload).toHaveProperty('dispatchUnits');
    expect(result.simulatedApiPayload).toHaveProperty('timestamp');
  });

  it('should include accessible phone numbers and distance estimates for responders', () => {
    const result = generateEmpatheticFallback('Need emergency medical assistance', 0, undefined);
    
    result.nearbyServices?.forEach(service => {
      expect(service.name).toBeTruthy();
      expect(service.distance).toBeTruthy();
      expect(service.phone).toMatch(/^[0-9+]/);
    });
  });
});
