export interface User {
  email: string;
  lastName: string;
  location: string;
  role: "user" | "admin";
  name?: string;
  avatar?: string;
  avatarPublicId?: string;
  authentication?: {
    password: string;
    salt?: string;
    sessionToken?: string;
  };
}
