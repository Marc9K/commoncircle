"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React-Leaflet
if (typeof window !== "undefined") {
  delete (Icon.Default.prototype as any)._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

interface MapProps {
  location: string;
  height?: string;
  zoom?: number;
  showNoLocationMessage?: boolean;
}

interface GeocodeResult {
  lat: string;
  lon: string;
  display_name: string;
}

export function Map({
  location,
  height = "200px",
  zoom = 13,
  showNoLocationMessage = false,
}: MapProps) {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const geocodeLocation = async () => {
      if (!location) {
        setError("No location provided");
        setIsLoading(false);
        return;
      }

      try {
        // Using OpenStreetMap Nominatim API for geocoding
        console.log("Geocoding location:", location);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            location
          )}&limit=1`
        );

        if (!response.ok) {
          throw new Error("Geocoding failed");
        }

        const data: GeocodeResult[] = await response.json();

        if (data && data.length > 0) {
          setCoordinates({
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
          });
          setError(null);
        } else {
          setError("Location not found");
        }
      } catch (err) {
        setError("Failed to geocode location");
        console.error("Geocoding error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Set loading state when location changes
    setIsLoading(true);
    setError(null);

    // Debounce the geocoding request by 2 seconds
    const timeoutId = setTimeout(() => {
      geocodeLocation();
    }, 2000);

    // Cleanup timeout if location changes before timeout completes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [location]);

  if (isLoading) {
    return (
      <div
        style={{
          height,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
          border: "1px solid #e9ecef",
          borderRadius: "8px",
        }}
      >
        <div>Loading map...</div>
      </div>
    );
  }

  if (error || !coordinates) {
    return showNoLocationMessage ? <div>No location found</div> : <></>;
  }

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer
        center={[coordinates.lat, coordinates.lon]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lon]}>
          <Popup>{location}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
