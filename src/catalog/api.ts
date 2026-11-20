import { apiRequest } from "../api/client";
import type {
  CompanionAvailability,
  CompanionDetail,
  CompanionSummary,
  HotelDetail,
  HotelRoomType,
  HotelSummary,
  Pagination,
} from "./types";

function queryString(values: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (value !== undefined && value !== "") params.set(key, String(value));
  const result = params.toString();
  return result ? `?${result}` : "";
}

export function listHotels(filters: { city?: string; countryCode?: string; page?: number } = {}) {
  return apiRequest<{ data: HotelSummary[]; pagination: Pagination }>(`/v1/hotels${queryString({ ...filters, limit: 20 })}`);
}

export function getHotel(hotelId: string) {
  return apiRequest<HotelDetail>(`/v1/hotels/${hotelId}`);
}

export function listHotelRoomTypes(hotelId: string) {
  return apiRequest<{ data: HotelRoomType[] }>(`/v1/hotels/${hotelId}/room-types`);
}

export function listCompanions(filters: { language?: string; serviceArea?: string; page?: number } = {}) {
  return apiRequest<{ data: CompanionSummary[]; pagination: Pagination }>(`/v1/companions${queryString({ ...filters, limit: 20 })}`);
}

export function getCompanion(companionId: string) {
  return apiRequest<CompanionDetail>(`/v1/companions/${companionId}`);
}

export function getCompanionAvailability(companionId: string, serviceId: string, date: string) {
  return apiRequest<CompanionAvailability>(
    `/v1/companions/${companionId}/availability${queryString({ serviceId, date })}`,
  );
}
