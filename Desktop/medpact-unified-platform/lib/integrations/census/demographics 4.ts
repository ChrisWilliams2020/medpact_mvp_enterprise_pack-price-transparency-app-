// US Census Bureau API Integration
export interface DemographicData {
  zipCode: string;
  population: number;
  medianIncome: number;
  medianAge?: number;
  householdCount?: number;
  employmentRate?: number;
}

export async function getCensusDemographics(zipCode: string) {
  const apiKey = process.env.CENSUS_API_KEY;
  
  if (!apiKey || apiKey === 'your_census_api_key_here') {
    // Return mock data if no API key
    return getMockDemographics(zipCode);
  }

  try {
    const response = await fetch(
      `https://api.census.gov/data/2021/acs/acs5?get=NAME,B01003_001E,B19013_001E,B01002_001E&for=zip%20code%20tabulation%20area:${zipCode}&key=${apiKey}`,
      { next: { revalidate: 604800 } } // Cache for 1 week
    );
    
    if (!response.ok) throw new Error('Census API error');
    
    const data = await response.json();
    
    if (data.length < 2) return getMockDemographics(zipCode);
    
    const [headers, values] = data;
    
    return {
      zipCode,
      population: parseInt(values[1]) || 0,
      medianIncome: parseInt(values[2]) || 0,
      medianAge: parseFloat(values[3]) || 0,
    };
  } catch (error) {
    console.error('Census API error:', error);
    return getMockDemographics(zipCode);
  }
}

function getMockDemographics(zipCode: string): DemographicData {
  return {
    zipCode,
    population: 25000 + Math.floor(Math.random() * 50000),
    medianIncome: 50000 + Math.floor(Math.random() * 50000),
    medianAge: 35 + Math.floor(Math.random() * 15),
    householdCount: 10000 + Math.floor(Math.random() * 20000),
    employmentRate: 0.85 + Math.random() * 0.1,
  };
}

export async function getInsuranceCoverageData(zipCode: string) {
  const apiKey = process.env.CENSUS_API_KEY;
  
  if (!apiKey || apiKey === 'your_census_api_key_here') {
    return getMockInsuranceData(zipCode);
  }

  try {
    // ACS insurance coverage variables
    const response = await fetch(
      `https://api.census.gov/data/2021/acs/acs5?get=B27001_001E,B27001_004E,B27001_007E,B27001_010E&for=zip%20code%20tabulation%20area:${zipCode}&key=${apiKey}`,
      { next: { revalidate: 604800 } }
    );
    
    if (!response.ok) throw new Error('Census API error');
    
    const data = await response.json();
    
    if (data.length < 2) return getMockInsuranceData(zipCode);
    
    const [headers, values] = data;
    
    const total = parseInt(values[1]) || 1;
    
    return {
      total,
      insured: parseInt(values[2]) || 0,
      medicare: parseInt(values[3]) || 0,
      medicaid: parseInt(values[4]) || 0,
      privateInsurance: parseInt(values[2]) - parseInt(values[3]) - parseInt(values[4]),
    };
  } catch (error) {
    console.error('Insurance coverage error:', error);
    return getMockInsuranceData(zipCode);
  }
}

function getMockInsuranceData(zipCode: string) {
  const total = 25000;
  return {
    total,
    insured: Math.floor(total * 0.9),
    medicare: Math.floor(total * 0.18),
    medicaid: Math.floor(total * 0.15),
    privateInsurance: Math.floor(total * 0.57),
  };
}
