// import axios from 'axios
import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {
  HotelSearchResponse,
  HotelType,
  PaymentIntentResposne,
  UserType,
} from "../../backend/src/shared/types";
import { BookingFormData } from "./forms/BookingForm/BookingForm";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`/api/users/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }

  return body;
};

export const validateToken = async () => {
  const response = await fetch(`/api/auth/validate-token`, {
    credentials: "include",
  });

  
  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`/api/my-hotels`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`/api/my-hotels/${hotelId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
  const response = await fetch(
    `/api/my-hotels/${hotelFormData.get("hotelId")}`,
    {
      method: "PUT",
      body: hotelFormData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Hotel");
  }

  return response.json();
};

export type SearchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export const searchHotels = async (
  SearchParams: SearchParams
): Promise<HotelSearchResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("destination", SearchParams.destination || "");
  queryParams.append("checkIn", SearchParams.checkIn || "");
  queryParams.append("checkOut", SearchParams.checkOut || "");
  queryParams.append("adultCount", SearchParams.adultCount || "");
  queryParams.append("childCount", SearchParams.childCount || "");
  queryParams.append("page", SearchParams.page || "");

  queryParams.append("maxPrice", SearchParams.maxPrice || "");
  queryParams.append("sortOption", SearchParams.sortOption || "");

  SearchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );

  SearchParams.types?.forEach((type) => queryParams.append("types", type));
  SearchParams.stars?.forEach((star) => queryParams.append("stars", star));

  const response = await fetch(
    `/api/hotels/search?${queryParams}`
  );

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(
    `/api/hotels`);

    if(!response.ok){
      throw new Error("Error fetching hotels")
    }

    return response.json()
}

// export const fetchHotels = async (): Promise<HotelType[]> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/api/hotels`, { withCredentials: true });
//     return response.data;
//   } catch (error) {
//     throw new Error("Error fetching hotels");
//   }
// };


export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`/api/hotels/${hotelId}`);

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const createPaymentIntent = async (
  hotelId: string,
  numberOfNights: string
): Promise<PaymentIntentResposne> => {
  const response = await fetch(
    `/api/hotels/${hotelId}/bookings/payment-intent`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ numberOfNights }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if(!response.ok){
    throw new Error("Error fetching payment intent")
  }

  return response.json()
};

export const createRoomBooking =  async ( formData: BookingFormData) => {
  const response = await fetch(
    `/api/hotels/${formData.hotelId}/bookings`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData)
    })

    if(!response.ok){
      throw new Error("Error booking room")
    }

    // return response.json()
};

export const fetchMyBookings = async (): Promise<HotelType[]> => {
  const response = await fetch(
    `/api/my-booking`, {
      credentials: "include"
    })

    if(!response.ok){
      throw new Error("Unable to fetch bookings")
    }

    return response.json()
}

export const loadRazorpay = async (): Promise<void> => {
  try {
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.head.appendChild(script);
  } catch (error) {
    throw new Error("Error loading Razorpay script");
  }
};

export const createRazorpayOrder = async (
  hotelId: string,
  numberOfNights: number
): Promise<PaymentIntentResposne> => {
  try {
    
    const response = await fetch(
      `/api/hotels/${hotelId}/bookings/payment-intent`,
      {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ numberOfNights }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error creating Razorpay order");
    }

    const { orderId } = await response.json();
    return orderId;
  } catch (error) {
    throw new Error("Error creating Razorpay order");
  }
};