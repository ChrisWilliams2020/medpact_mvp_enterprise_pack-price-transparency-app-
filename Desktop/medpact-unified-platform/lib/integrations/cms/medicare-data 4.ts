// CMS Medicare Provider Data Integration
export interface MedicareProvider {
  npi: string;
  name: string;
  specialty: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber?: string;
  credentials?: string;
}

export async function getMedicareProviders(npi: string) {
  try {
    const response = await fetch(
      `https://data.cms.gov/provider-data/api/1/datastore/query/mj5m-pzi6/0?npi=${npi}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );
    
    if (!response.ok) throw new Error('CMS API error');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('CMS API error:', error);
    return null;
  }
}

export async function searchMedicareProviders(params: {
  firstName?: string;
  lastName?: string;
  state?: string;
  specialty?: string;
  city?: string;
}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.firstName) queryParams.append('first_name', params.firstName);
    if (params.lastName) queryParams.append('last_name', params.lastName);
    if (params.state) queryParams.append('state', params.state);
    if (params.specialty) queryParams.append('specialty', params.specialty);
    if (params.city) queryParams.append('city', params.city);

    const response = await fetch(
      `https://data.cms.gov/provider-data/api/1/datastore/query/mj5m-pzi6/0?${queryParams}`,
      { next: { revalidate: 86400 } }
    );
    
    if (!response.ok) throw new Error('CMS API error');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('CMS search error:', error);
    return [];
  }
}

export async function getHospitalCompareData(hospitalId: string) {
  try {
    const response = await fetch(
      `https://data.cms.gov/provider-data/api/1/datastore/query/xubh-q36u/0?provider_id=${hospitalId}`,
      { next: { revalidate: 86400 } }
    );
    
    if (!response.ok) throw new Error('Hospital Compare API error');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hospital Compare error:', error);
    return null;
  }
}
