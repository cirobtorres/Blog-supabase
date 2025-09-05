import { useContext } from "react";
import { ProfileContext } from "../providers/ProfileProvider";

export function useProfile() {
  return useContext(ProfileContext);
}
