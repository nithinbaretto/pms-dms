/* eslint-disable react-hooks/set-state-in-effect */
import type { ReactElement } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Autocomplete,
  GoogleMap,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { Loader2, MapPin, Search } from "lucide-react";

import { Button } from "../../../../../shared/ui/button";
import { Checkbox } from "../../../../../shared/ui/checkbox";
import { Dialog, DialogContent } from "../../../../../shared/ui/dialog";
import { Input } from "../../../../../shared/ui/input";
import { cn } from "../../../../../shared/ui/utils";
import locationIcon from "../../../../../assets/icons/svg/Location.svg";
import type { Address } from "../types";

type CorrespondenceAddressModalProps = {
  open: boolean;
  permanentAddress: Address;
  initialAddress: Address;
  initialSameAsPermanent?: boolean;
  /** Defaults to correspondence. Permanent mode hides the same-as checkbox. */
  mode?: "correspondence" | "permanent";
  title?: string;
  sameAsLabel?: string;
  onCancel: () => void;
  onSave: (address: Address, sameAsPermanent: boolean) => void;
};

type LatLng = {
  lat: number;
  lng: number;
};

const FALLBACK_CENTER: LatLng = { lat: 19.076, lng: 72.8777 };
const MAP_LIBRARIES: ("places")[] = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const toSingleLine = (address: Address): string => {
  return `${address.addressLine}, ${address.city}, ${address.state} ${address.pincode}`;
};

const isSameAddress = (left: Address, right: Address): boolean => {
  return (
    left.addressLine === right.addressLine &&
    left.city === right.city &&
    left.state === right.state &&
    left.pincode === right.pincode
  );
};

const getAddressComponent = (
  components: google.maps.GeocoderAddressComponent[] | undefined,
  type: string,
): string => {
  return components?.find((item) => item.types.includes(type))?.long_name ?? "";
};

const addressFromPlace = (place: google.maps.places.PlaceResult): Address | null => {
  const location = place.geometry?.location;
  if (!location) {
    return null;
  }

  const components = place.address_components;

  return {
    lat: location.lat(),
    lng: location.lng(),
    addressLine: place.formatted_address?.trim() || place.name?.trim() || "",
    city:
      getAddressComponent(components, "locality") ||
      getAddressComponent(components, "administrative_area_level_2"),
    state: getAddressComponent(components, "administrative_area_level_1"),
    pincode: getAddressComponent(components, "postal_code"),
  };
};

const searchInputClassName =
  "h-9 w-full min-w-0 border-0 bg-transparent p-0 shadow-none outline-none focus-visible:border-transparent focus-visible:ring-0 font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#231f20] placeholder:font-['Mulish',sans-serif] placeholder:text-[14px] placeholder:font-normal placeholder:leading-none placeholder:tracking-normal placeholder:text-[#71859B]";

const CorrespondenceAddressModal = ({
  open,
  permanentAddress,
  initialAddress,
  initialSameAsPermanent,
  mode = "correspondence",
  title,
  sameAsLabel,
  onCancel,
  onSave,
}: CorrespondenceAddressModalProps): ReactElement => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey ?? "",
    libraries: MAP_LIBRARIES,
  });

  const [sameAsPermanent, setSameAsPermanent] = useState(
    initialSameAsPermanent ?? isSameAddress(initialAddress, permanentAddress),
  );
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Address>(initialAddress);
  const [searchQuery, setSearchQuery] = useState("");

  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDraft(initialAddress);
    setSearchQuery("");
    setLocationError(null);
    setSameAsPermanent(
      mode === "permanent"
        ? false
        : (initialSameAsPermanent ?? isSameAddress(initialAddress, permanentAddress)),
    );
  }, [initialAddress, initialSameAsPermanent, mode, open, permanentAddress]);

  const mapCenter = useMemo<LatLng>(() => {
    if (draft.lat && draft.lng) {
      return { lat: draft.lat, lng: draft.lng };
    }

    if (permanentAddress.lat && permanentAddress.lng) {
      return {
        lat: permanentAddress.lat,
        lng: permanentAddress.lng,
      };
    }

    return FALLBACK_CENTER;
  }, [draft.lat, draft.lng, permanentAddress.lat, permanentAddress.lng]);

  const setCoordinates = useCallback((coordinates: LatLng): void => {
    setLocationError(null);
    setDraft((current) => ({
      ...current,
      lat: coordinates.lat,
      lng: coordinates.lng,
      city: "",
      state: "",
      pincode: "",
    }));
  }, []);

  const handlePlaceChanged = (): void => {
    const place = autocompleteRef.current?.getPlace();
    if (!place) {
      return;
    }

    const nextAddress = addressFromPlace(place);
    if (!nextAddress) {
      return;
    }

    setLocationError(null);
    setDraft(nextAddress);
    setSearchQuery(nextAddress.addressLine);
    mapRef.current?.panTo({ lat: nextAddress.lat, lng: nextAddress.lng });
    mapRef.current?.setZoom(16);
  };

  const handleUseCurrentLocation = (): void => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported in this browser.");
      return;
    }

    setIsLocatingUser(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        mapRef.current?.panTo(nextPosition);
        mapRef.current?.setZoom(16);
        setCoordinates(nextPosition);
        setIsLocatingUser(false);
      },
      () => {
        setLocationError(
          "Location permission denied or unavailable. Please allow location access.",
        );
        setIsLocatingUser(false);
      },
      {
        enableHighAccuracy: true,
      },
    );
  };

  const isPermanentMode = mode === "permanent";
  const resolvedAddress = !isPermanentMode && sameAsPermanent ? permanentAddress : draft;

  const handleSave = (): void => {
    onSave(resolvedAddress, isPermanentMode ? false : sameAsPermanent);
  };

  return (
    <Dialog onOpenChange={onCancel} open={open}>
      <DialogContent className="flex max-h-[calc(100vh-3rem)] w-[calc(100%-2rem)] max-w-[590px] flex-col overflow-hidden rounded-[16px] border-none p-0 shadow-[4px_4px_20px_rgba(0,0,0,0.12)]">
        <div className="min-h-0 overflow-y-auto bg-white p-6 md:p-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-[22px] leading-[33px] font-medium text-[#435160]">
                {title ?? (isPermanentMode ? "Permanent Address" : "Correspondence Address")}
              </h2>
              <p className="text-[15px] leading-[22.5px] text-[#435160]">
                Update the address details.
              </p>
            </div>

            {!isPermanentMode ? (
            <div
              className={cn(
                "rounded-[8px] border p-[14px]",
                sameAsPermanent
                  ? "border-[rgba(147,22,30,0.09)] bg-[rgba(147,22,30,0.04)]"
                  : "border-[#eeeeee] bg-white",
              )}
            >
              <label className="flex items-start gap-2">
                <Checkbox
                  checked={sameAsPermanent}
                  className="mt-px border-[#eeeeee] data-[state=checked]:border-[#93161e] data-[state=checked]:bg-[#93161e] data-[state=checked]:text-white"
                  onCheckedChange={(checked) => {
                    const isChecked = Boolean(checked);
                    setSameAsPermanent(isChecked);
                    if (isChecked) {
                      setDraft(permanentAddress);
                    }
                  }}
                />
                <span className="space-y-3">
                  <span className="block text-[13px] leading-[19.5px] text-[#435160]">
                    {sameAsLabel ?? "Same as permanent address"}
                  </span>
                  <span className="block text-[13px] leading-[19.5px] text-[#231f20]">
                    {toSingleLine(permanentAddress)}
                  </span>
                </span>
              </label>
            </div>
            ) : null}

            {isPermanentMode || !sameAsPermanent ? (
              <div className="space-y-3">
                <div className="flex h-9 w-full items-center gap-2 rounded-[8px] border border-[#eeeeee] bg-white px-[14px]">
                  <Search className="size-[14px] shrink-0 text-[#231F20]" strokeWidth={1.75} />
                  <div className="min-w-0 flex-1">
                    {isLoaded ? (
                      <Autocomplete
                        onLoad={(instance) => {
                          autocompleteRef.current = instance;
                        }}
                        onPlaceChanged={handlePlaceChanged}
                        options={{
                          componentRestrictions: { country: "in" },
                          fields: ["address_components", "formatted_address", "geometry", "name"],
                        }}
                      >
                        <input
                          className={searchInputClassName}
                          onChange={(event) => {
                            setSearchQuery(event.target.value);
                          }}
                          placeholder="Search on google map"
                          type="text"
                          value={searchQuery}
                        />
                      </Autocomplete>
                    ) : (
                      <input
                        className={searchInputClassName}
                        onChange={(event) => {
                          setSearchQuery(event.target.value);
                        }}
                        placeholder="Search on google map"
                        type="text"
                        value={searchQuery}
                      />
                    )}
                  </div>
                </div>

                {isLoaded ? (
                  <>
                    <div className="relative h-[220px] overflow-hidden rounded-[8px] border border-[#eeeeee] md:h-[260px]">
                      <GoogleMap
                        center={mapCenter}
                        onClick={(event) => {
                          const lat = event.latLng?.lat();
                          const lng = event.latLng?.lng();

                          if (lat === undefined || lng === undefined) {
                            return;
                          }

                          setCoordinates({ lat, lng });
                        }}
                        mapContainerStyle={mapContainerStyle}
                        onLoad={(mapInstance) => {
                          mapRef.current = mapInstance;
                        }}
                        options={{
                          disableDefaultUI: false,
                          zoomControl: true,
                          streetViewControl: false,
                          mapTypeControl: false,
                          fullscreenControl: false,
                        }}
                        zoom={draft.lat && draft.lng ? 16 : 13}
                      >
                        <MarkerF
                          draggable
                          onDragEnd={(event) => {
                            const lat = event.latLng?.lat();
                            const lng = event.latLng?.lng();

                            if (lat === undefined || lng === undefined) {
                              return;
                            }

                            setCoordinates({ lat, lng });
                          }}
                          position={mapCenter}
                        />
                      </GoogleMap>

                      <div className="pointer-events-none absolute left-2 top-2 rounded-[6px] bg-white/90 px-2 py-1 text-[11px] text-[#435160] shadow-sm">
                        Drag marker to update address
                      </div>

                      <button
                        className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[12px] text-[#93161e] shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={isLocatingUser}
                        onClick={handleUseCurrentLocation}
                        type="button"
                      >
                        {isLocatingUser ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <MapPin className="h-3.5 w-3.5" />
                        )}
                        Use Current Location
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex h-[220px] items-center justify-center rounded-[8px] border border-[#eeeeee] bg-[#f7f8f9] text-[13px] text-[#435160] md:h-[260px]">
                    {loadError || !apiKey ? (
                      "Map is not available right now."
                    ) : (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading map...
                      </>
                    )}
                  </div>
                )}

                {locationError ? (
                  <p className="text-[12px] text-[#93161e]">{locationError}</p>
                ) : null}

                <div className="space-y-1">
                  <label className="text-[12px] leading-[18px] text-[#231f20]">
                    Address Details <span className="text-[#E8402F]">*</span>
                  </label>
                  <Input
                    onChange={(event) => {
                      setDraft((current) => ({
                        ...current,
                        addressLine: event.target.value,
                      }));
                    }}
                    placeholder="Flat No., Floor, Tower"
                    value={draft.addressLine}
                  />
                </div>

                <div className="rounded-[8px] border border-[#eeeeee] bg-white p-[14px]">
                  <p className="inline-flex items-center gap-2 text-[14px] leading-[21px] font-medium text-[#231f20]">
                    <img alt="" className="h-4 w-4 shrink-0" src={locationIcon} />
                    {draft.addressLine || "Selected location"}
                  </p>
                  {(draft.lat || draft.lng) ? (
                    <p className="mt-1 text-[11px] text-[#5a6b7d]">
                      {`Lat: ${draft.lat.toFixed(6)}, Lng: ${draft.lng.toFixed(6)}`}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-6 pt-2">
              <Button
                className="h-9 rounded-[8px] border border-[#eeeeee] bg-white text-[14px] text-[#435160] hover:bg-[#f8f8f8]"
                onClick={onCancel}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className="h-9 rounded-[8px] bg-[#93161e] text-[14px] text-white hover:bg-[#7f141a]"
                onClick={handleSave}
                type="button"
              >
                Save & Continue
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CorrespondenceAddressModal;
