import { ApplicationError } from "@/protocols";

export function cannotEntryError(): ApplicationError {
  return {
    name: "CannotEntryError",
    message: "Cannot entry this activity!",
  };
}
