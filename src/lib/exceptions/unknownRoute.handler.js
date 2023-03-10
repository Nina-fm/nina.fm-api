import { NotFoundException } from "../utils/exception";

/**
 * Pour toutes les autres routes non définies, on retourne une erreur
 */
export const UnknownRoutesHandler = () => {
  throw new NotFoundException(`Route not found`);
};
