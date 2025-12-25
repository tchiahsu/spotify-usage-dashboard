export type UserProfile = {
  id: string;
  display_name: string;
  followers: { total: number };
  images: { url: string };
}