import { apiFetch } from './client'

// Farmer API
export const getFarmerProfileApi = () => apiFetch('/api/farmers/me')
export const updateFarmerProfileApi = (data: any) => apiFetch('/api/farmers/me', { method: 'PATCH', body: JSON.stringify(data) })
export const getFarmerLotsApi = () => apiFetch('/api/farmers/me/lots')

// FPO API
export const getFposApi = () => apiFetch('/api/fpos')
export const getFpoFarmersApi = () => apiFetch('/api/fpos/me/farmers')
export const getFpoLotsApi = () => apiFetch('/api/fpos/me/lots')

// Harvest Lot API
export const getLotsApi = (params?: Record<string, string>) => {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  return apiFetch(`/api/lots${query}`)
}
export const createLotApi = (data: any) => apiFetch('/api/lots', { method: 'POST', body: JSON.stringify(data) })
export const updateLotApi = (id: string, data: any) => apiFetch(`/api/lots/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

// Market Intelligence & Analysis API
export const getMarketsApi = () => apiFetch('/api/markets')
export const analyzeMarketApi = (payload: any) => apiFetch('/api/market-intelligence/analyze', { method: 'POST', body: JSON.stringify(payload) })
export const getEvidenceApi = (cropName?: string, location?: string) => {
  const query = cropName ? `?cropName=${encodeURIComponent(cropName)}&location=${encodeURIComponent(location || 'Anand')}` : ''
  return apiFetch(`/api/market-intelligence/evidence${query}`)
}
export const discoverBuyersApi = (queryType?: string, cropName?: string, location?: string) => {
  const queryParams = new URLSearchParams()
  if (queryType) queryParams.append('queryType', queryType)
  if (cropName) queryParams.append('cropName', cropName)
  if (location) queryParams.append('location', location)
  return apiFetch(`/api/market-intelligence/discover-buyers?${queryParams.toString()}`)
}

// Buyer API
export const getBuyersApi = (buyerType?: string) => {
  const query = buyerType ? `?buyerType=${buyerType}` : ''
  return apiFetch(`/api/buyers${query}`)
}

// Offer API
export const getOffersApi = () => apiFetch('/api/offers')
export const createOfferApi = (data: any) => apiFetch('/api/offers', { method: 'POST', body: JSON.stringify(data) })
export const updateOfferStatusApi = (id: string, status: string) => apiFetch(`/api/offers/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })

// Logistics & Tracking API
export const getShipmentsApi = () => apiFetch('/api/logistics/shipments')
export const getShipmentTrackApi = (id: string) => apiFetch(`/api/logistics/shipments/${id}/track`)
export const sendLocationUpdateApi = (id: string, data: any) => apiFetch(`/api/logistics/shipments/${id}/location`, { method: 'POST', body: JSON.stringify(data) })

// Notifications Alert API
export const getAlertsApi = () => apiFetch('/api/alerts')
export const markAlertReadApi = (id: string) => apiFetch(`/api/alerts/${id}/read`, { method: 'PATCH' })

// Admin API
export const getAdminStatsApi = () => apiFetch('/api/admin/dashboard')
export const getAdminUsersApi = (search?: string, role?: string) => {
  const queryParams = new URLSearchParams()
  if (search) queryParams.append('search', search)
  if (role) queryParams.append('role', role)
  return apiFetch(`/api/admin/users?${queryParams.toString()}`)
}
export const updateUserStatusApi = (id: string, status: string) => apiFetch(`/api/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
export const getAuditLogsApi = () => apiFetch('/api/admin/audit-logs')
export const getSystemHealthApi = () => apiFetch('/api/admin/system-health')
