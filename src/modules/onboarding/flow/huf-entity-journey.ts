/**
 * HUF Entity Details is one shared step for PMS, AIF, and AIF manual.
 * Hidden until backend returns the journey type. Map that type here when APIs are ready.
 */
export const SHOW_HUF_ENTITY_DETAILS = false;

export const isHufEntityJourney = (): boolean => SHOW_HUF_ENTITY_DETAILS;
