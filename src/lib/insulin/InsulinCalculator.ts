import { InsulinCalculationInput, InsulinCalculationResult, InsulinProfile } from '../../types/insulin';

export class InsulinCalculator {
  
  static calculateInsulinDose(input: InsulinCalculationInput, insulinOnBoard?: number): InsulinCalculationResult {
    const { 
      current_glucose, 
      target_glucose, 
      carbohydrates, 
      current_time, 
      user_profile 
    } = input;

    console.log('Calculating insulin dose:', input);

    // Get time-appropriate ratios
    const carbRatio = this.getCarbRatioForTime(user_profile, current_time);
    const sensitivityFactor = this.getSensitivityFactorForTime(user_profile, current_time);
    
    // Calculate carbohydrate dose
    const carbDose = this.calculateCarbDose(carbohydrates, carbRatio);
    
    // Calculate correction dose if glucose is provided
    const correctionDose = current_glucose 
      ? this.calculateCorrectionDose(current_glucose, target_glucose, sensitivityFactor)
      : { units: 0, sensitivity_used: sensitivityFactor, glucose_difference: 0 };

    // Use provided IOB or calculate default
    const iobInfo = this.createIOBInfo(user_profile, insulinOnBoard || 0);
    
    // Calculate total dose (subtract IOB)
    const totalBeforeIOB = carbDose.units + correctionDose.units;
    const totalRecommended = Math.max(0, totalBeforeIOB - iobInfo.active_units);
    
    // Safety checks
    const safetyWarnings = this.performSafetyChecks(
      totalRecommended, 
      user_profile, 
      carbohydrates
    );
    
    // Calculate confidence level
    const confidenceLevel = this.calculateConfidenceLevel(
      carbDose.confidence,
      current_glucose !== undefined,
      safetyWarnings.length
    );

    // Generate breakdown text
    const breakdown = this.generateBreakdown(
      carbDose, 
      correctionDose, 
      iobInfo, 
      totalRecommended
    );

    const result: InsulinCalculationResult = {
      carb_dose: carbDose,
      correction_dose: correctionDose,
      insulin_on_board: iobInfo,
      total_recommendation: {
        units: Math.round(totalRecommended * 10) / 10, // Round to 0.1 units
        breakdown,
        safety_warnings: safetyWarnings,
        confidence_level: confidenceLevel,
      },
      adjustment_options: {
        meal_fat_adjustment: 0, // Could be adjusted based on meal analysis
        exercise_planned: false,
        stress_illness: false,
      },
    };

    console.log('Insulin calculation result:', result);
    return result;
  }

  private static getCarbRatioForTime(profile: InsulinProfile, time: string): number {
    const timeRatio = profile.carb_ratios.find(ratio => {
      return time >= ratio.time_start && time < ratio.time_end;
    });
    
    return timeRatio?.ratio || 15; // Default 1:15 ratio
  }

  private static getSensitivityFactorForTime(profile: InsulinProfile, time: string): number {
    const timeSensitivity = profile.sensitivity_factor.find(sensitivity => {
      return time >= sensitivity.time_start && time < sensitivity.time_end;
    });
    
    return timeSensitivity?.factor || 50; // Default 1:50 sensitivity
  }

  private static calculateCarbDose(carbs: number, ratio: number): {
    units: number;
    ratio_used: number;
    confidence: 'high' | 'medium' | 'low';
  } {
    const units = carbs / ratio;
    
    // Confidence based on carb amount (more carbs = more confidence in calculation)
    let confidence: 'high' | 'medium' | 'low' = 'high';
    if (carbs < 10) confidence = 'low';
    else if (carbs < 30) confidence = 'medium';
    
    return {
      units,
      ratio_used: ratio,
      confidence,
    };
  }

  private static calculateCorrectionDose(
    currentGlucose: number, 
    targetGlucose: number, 
    sensitivityFactor: number
  ): {
    units: number;
    sensitivity_used: number;
    glucose_difference: number;
  } {
    const glucoseDifference = currentGlucose - targetGlucose;
    const units = Math.max(0, glucoseDifference / sensitivityFactor);
    
    return {
      units,
      sensitivity_used: sensitivityFactor,
      glucose_difference: glucoseDifference,
    };
  }

  private static createIOBInfo(profile: InsulinProfile, activeUnits: number): {
    active_units: number;
    remaining_action_time: number;
    recent_doses: Array<{
      time: string;
      units: number;
      remaining_activity: number;
    }>;
  } {
    return {
      active_units: Math.round(activeUnits * 10) / 10,
      remaining_action_time: profile.action_profile.duration,
      recent_doses: [], // Will be populated by the service layer
    };
  }

  private static performSafetyChecks(
    totalDose: number, 
    profile: InsulinProfile, 
    carbs: number
  ): string[] {
    const warnings: string[] = [];
    
    // Check maximum single dose
    if (totalDose > profile.safety_limits.max_single_dose) {
      warnings.push(`Dose (${totalDose.toFixed(1)} units) exceeds max single dose limit (${profile.safety_limits.max_single_dose} units)`);
    }
    
    // Check if dose seems too high for carbs
    const expectedDose = carbs / 12; // Rough 1:12 ratio check
    if (totalDose > expectedDose * 2) {
      warnings.push('Calculated dose seems high for the amount of carbohydrates');
    }
    
    // Check if dose is very low
    if (totalDose > 0 && totalDose < 0.5) {
      warnings.push('Calculated dose is very small - consider if dose is needed');
    }
    
    return warnings;
  }

  private static calculateConfidenceLevel(
    carbConfidence: 'high' | 'medium' | 'low',
    hasGlucoseReading: boolean,
    warningCount: number
  ): number {
    let confidence = 85; // Start with high confidence
    
    // Adjust based on carb confidence
    if (carbConfidence === 'medium') confidence -= 10;
    if (carbConfidence === 'low') confidence -= 20;
    
    // Boost confidence if we have glucose reading
    if (hasGlucoseReading) confidence += 5;
    
    // Reduce confidence for each warning
    confidence -= warningCount * 15;
    
    return Math.max(30, Math.min(95, confidence)); // Keep between 30-95%
  }

  private static generateBreakdown(
    carbDose: any,
    correctionDose: any,
    insulinOnBoard: any,
    totalRecommended: number
  ): string {
    let breakdown = `Carb dose: ${carbDose.units.toFixed(1)} units (1:${carbDose.ratio_used} ratio)`;
    
    if (correctionDose.units > 0) {
      breakdown += `\nCorrection: ${correctionDose.units.toFixed(1)} units (${correctionDose.glucose_difference.toFixed(0)} mg/dL above target)`;
    }
    
    if (insulinOnBoard.active_units > 0) {
      breakdown += `\nInsulin on board: -${insulinOnBoard.active_units.toFixed(1)} units`;
    }
    
    breakdown += `\nTotal recommended: ${totalRecommended.toFixed(1)} units`;
    
    return breakdown;
  }

  // Helper method to get current time string
  static getCurrentTimeString(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
}

export default InsulinCalculator;