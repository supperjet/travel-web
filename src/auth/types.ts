export type ImApp = "EMAIL" | "WHATSAPP" | "WECHAT" | "TELEGRAM" | "LINE" | "MESSENGER";
export type UserRole = "CUSTOMER" | "OPERATOR" | "ADMIN";

export interface AuthIdentity {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    profile: {
      firstName: string;
      lastName: string;
      imApp: ImApp;
      imId: string;
      referralSource: string | null;
      communicationsConsent: boolean;
      termsAccepted: boolean;
      consentedAt: string | null;
    };
  };
  roles: UserRole[];
}

export interface RegistrationInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  imApp: ImApp;
  imId: string;
  referralSource?: "SEARCH_ENGINE" | "INSTAGRAM" | "FRIEND_OR_COLLEAGUE" | "HOTEL_CONCIERGE" | "PRESS" | "OTHER";
  communicationsConsent: true;
  termsAccepted: true;
}
