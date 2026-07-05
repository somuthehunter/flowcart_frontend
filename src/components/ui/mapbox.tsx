import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { FeatureCollection, LineString } from "geojson";
import {
    Crosshair,
    Layers,
    Map as MapIcon,
    Mountain,
    Navigation,
    Satellite,
} from "lucide-react";
import {
    Layer,
    Map,
    Marker,
    NavigationControl,
    Source,
    ViewStateChangeEvent,
} from "react-map-gl/mapbox";

import "mapbox-gl/dist/mapbox-gl.css";

import polyline from "@mapbox/polyline";
import { useTheme } from "next-themes";

export interface MapMarker {
    id: string;
    longitude: number;
    latitude: number;
    icon?: React.ReactNode;
    color?: string;
    tooltip?: React.ReactNode;
    animate?: boolean;
    pulseColor?: string;
}

export interface MapRoute {
    id: string;
    polyline: string;
    color?: string;
    width?: number;
    opacity?: number;
    blur?: number;
}

export interface MapViewState {
    longitude: number;
    latitude: number;
    zoom: number;
}

export interface MapOverlay {
    show: boolean;
    content: React.ReactNode;
}

export interface GenericMapProps {
    // Map Configuration
    mapboxToken: string;
    mapStyle?: string;
    initialViewState?: MapViewState;

    // Markers
    markers?: MapMarker[];

    // Routes
    routes?: MapRoute[];

    // Overlay (for empty states, errors, etc.)
    overlay?: MapOverlay;

    // Callbacks
    onMarkerClick?: (markerId: string) => void;
    onMapMove?: (viewState: MapViewState) => void;
    onMapStyleChange?: (style: string) => void;

    // Aspect ratio
    aspectRatio?: "video" | "square" | "wide";
    minZoom?: 0 | 5 | 10 | 15 | 20;
    maxZoom?: 0 | 5 | 10 | 15 | 20;
    // Additional customization
    className?: string;
    containerClassName?: string;
    showRecenterButton?: boolean;
    showStyleSwitcher?: boolean;
}

// Map style options
const MAP_STYLES = [
    {
        id: "streets",
        label: "Streets",
        url: "mapbox://styles/mapbox/streets-v12",
        icon: MapIcon,
    },
    // {
    //     id: "dark",
    //     label: "Dark",
    //     url: "mapbox://styles/mapbox/dark-v11",
    //     icon: Moon,
    // },
    // {
    //     id: "light",
    //     label: "Light",
    //     url: "mapbox://styles/mapbox/light-v11",
    //     icon: Sun,
    // },
    {
        id: "satellite",
        label: "Satellite",
        url: "mapbox://styles/mapbox/satellite-streets-v12",
        icon: Satellite,
    },
    {
        id: "outdoors",
        label: "Outdoors",
        url: "mapbox://styles/mapbox/outdoors-v12",
        icon: Mountain,
    },
    {
        id: "navigation",
        label: "Navigation",
        url: "mapbox://styles/mapbox/navigation-day-v1",
        icon: Navigation,
    },
];

const MapBox = ({
    mapboxToken,
    mapStyle = "mapbox://styles/mapbox/streets-v12",
    initialViewState = {
        longitude: -122.4194,
        latitude: 37.7749,
        zoom: 12,
    },
    markers = [],
    routes = [],
    overlay,
    onMarkerClick,
    onMapMove,
    onMapStyleChange,
    aspectRatio = "video",
    minZoom,
    maxZoom,
    containerClassName = "",
    showRecenterButton = true,
    showStyleSwitcher = true,
}: GenericMapProps) => {
    const [viewState, setViewState] = useState<MapViewState>(initialViewState);
    const [currentMapStyle, setCurrentMapStyle] = useState(mapStyle);
    const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const defaultLightStyle = "mapbox://styles/mapbox/streets-v12";
        const defaultDarkStyle = "mapbox://styles/mapbox/satellite-streets-v12";

        setCurrentMapStyle((prevStyle) => {
            const isDefaultThemeStyle =
                prevStyle === defaultLightStyle ||
                prevStyle === defaultDarkStyle;
            if (isDefaultThemeStyle) {
                return theme === "dark" ? defaultDarkStyle : defaultLightStyle;
            }
            return prevStyle;
        });
    }, [theme]);

    // Update view state when initial view changes
    useEffect(() => {
        setViewState(initialViewState);
    }, [
        initialViewState.longitude,
        initialViewState.latitude,
        initialViewState.zoom,
        initialViewState,
    ]);

    // Convert routes to GeoJSON
    const routesGeoJSON = useMemo(() => {
        return routes.map((route) => {
            const geometry = polyline.toGeoJSON(route.polyline, 6);
            return {
                id: route.id,
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {},
                            geometry: geometry,
                        },
                    ],
                } as FeatureCollection<LineString>,
                style: {
                    color: route.color || "#3b82f6",
                    width: route.width || 7,
                    opacity: route.opacity || 0.95,
                    blur: route.blur || 0.5,
                },
            };
        });
    }, [routes]);

    // Handle map movement
    const handleMapMove = (evt: ViewStateChangeEvent) => {
        setViewState(evt.viewState);
        onMapMove?.(evt.viewState);
    };

    // Handle recenter
    const handleRecenter = () => {
        setViewState(initialViewState);
    };

    // Handle style change
    const handleStyleChange = (styleUrl: string) => {
        setCurrentMapStyle(styleUrl);
        setIsStyleDropdownOpen(false);
        onMapStyleChange?.(styleUrl);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsStyleDropdownOpen(false);
            }
        };

        if (isStyleDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isStyleDropdownOpen]);

    // Get current style info
    const currentStyleInfo = useMemo(
        () =>
            MAP_STYLES.find((s) => s.url === currentMapStyle) || MAP_STYLES[0],
        [currentMapStyle]
    );

    // Aspect ratio classes
    const aspectRatioClass =
        {
            video: "aspect-video",
            square: "aspect-square",
            wide: "aspect-[21/9]",
        }[aspectRatio] || aspectRatio;

    return (
        <div
            className={`border-border/30 bg-muted relative overflow-hidden rounded-xl border ${aspectRatioClass} ${containerClassName}`}>
            <Map
                {...viewState}
                onMove={handleMapMove}
                mapboxAccessToken={mapboxToken}
                mapStyle={currentMapStyle}
                maxZoom={maxZoom}
                minZoom={minZoom}>
                <NavigationControl position="top-right" />

                {/* Map Controls */}
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                    {/* Recenter Button */}
                    {showRecenterButton && (
                        <button
                            onClick={handleRecenter}
                            className="bg-background hover:bg-accent border-border/40 text-foreground flex h-9 w-9 items-center justify-center rounded-lg border shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
                            title="Recenter map"
                            aria-label="Recenter map">
                            <Crosshair className="h-4 w-4" />
                        </button>
                    )}

                    {/* Style Switcher */}
                    {showStyleSwitcher && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() =>
                                    setIsStyleDropdownOpen(!isStyleDropdownOpen)
                                }
                                className="bg-background hover:bg-accent border-border/40 text-foreground flex h-9 items-center gap-1.5 rounded-lg border px-2.5 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
                                title="Change map style"
                                aria-label="Change map style">
                                <currentStyleInfo.icon className="h-4 w-4" />
                                <span className="text-xs font-medium">
                                    {currentStyleInfo.label}
                                </span>
                                <Layers className="h-3 w-3 opacity-60" />
                            </button>

                            {/* Dropdown Menu */}
                            {isStyleDropdownOpen && (
                                <div className="bg-background border-border/40 absolute top-full left-0 mt-2 min-w-[160px] overflow-hidden rounded-lg border shadow-2xl">
                                    {MAP_STYLES.map((style) => {
                                        const Icon = style.icon;
                                        const isActive =
                                            currentMapStyle === style.url;
                                        return (
                                            <button
                                                key={style.id}
                                                onClick={() =>
                                                    handleStyleChange(style.url)
                                                }
                                                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors ${
                                                    isActive
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "text-foreground hover:bg-accent"
                                                }`}>
                                                <Icon className="h-4 w-4" />
                                                <span>{style.label}</span>
                                                {isActive && (
                                                    <div className="bg-primary ml-auto h-1.5 w-1.5 rounded-full" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Render Routes */}
                {routesGeoJSON.map((route) => (
                    <Source
                        key={route.id}
                        id={`route-source-${route.id}`}
                        type="geojson"
                        data={route.data}>
                        <Layer
                            id={`route-layer-${route.id}`}
                            type="line"
                            layout={{
                                "line-join": "round",
                                "line-cap": "round",
                            }}
                            paint={{
                                "line-color": route.style.color,
                                "line-width": route.style.width,
                                "line-opacity": route.style.opacity,
                                "line-blur": route.style.blur,
                            }}
                        />
                    </Source>
                ))}

                {/* Render Markers */}
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        longitude={marker.longitude}
                        latitude={marker.latitude}
                        anchor="bottom"
                        onClick={() => onMarkerClick?.(marker.id)}>
                        <div className="group relative flex flex-col items-center">
                            {/* Pulsing Effect */}
                            {marker.animate && (
                                <div
                                    className={`absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full`}
                                    style={{
                                        backgroundColor:
                                            marker.pulseColor ||
                                            `${marker.color}33`,
                                    }}
                                />
                            )}

                            {/* Marker Body */}
                            <div className="relative z-10 flex flex-col items-center">
                                <div
                                    className="flex h-12 w-12 items-center justify-center rounded-full shadow-xl ring-2 ring-white transition-all duration-300 group-hover:scale-110"
                                    style={{
                                        backgroundColor:
                                            marker.color || "#3b82f6",
                                    }}>
                                    {marker.icon || <div className="h-6 w-6" />}
                                </div>

                                {/* Tooltip */}
                                {marker.tooltip && (
                                    <div className="pointer-events-none absolute bottom-full mb-3 flex translate-y-2 flex-col items-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                        <div className="bg-background/95 text-foreground border-primary/20 rounded-lg border px-3 py-2 text-xs font-medium shadow-2xl ring-1 ring-white/10 backdrop-blur-md">
                                            {marker.tooltip}
                                        </div>
                                        {/* Tooltip Arrow */}
                                        <div className="bg-background border-primary/20 h-2 w-2 -translate-y-1 rotate-45 border-r border-b" />
                                    </div>
                                )}

                                {/* Marker Pointer */}
                                <div
                                    className="mt-1 h-2.5 w-1 rounded-full shadow-lg"
                                    style={{
                                        backgroundColor:
                                            marker.color || "#3b82f6",
                                    }}
                                />
                            </div>
                        </div>
                    </Marker>
                ))}
            </Map>
            {/* Overlay */}
            {overlay?.show && (
                <div className="bg-muted/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[2px]">
                    {overlay.content}
                </div>
            )}

            {/* Missing Token Warning */}
            {!mapboxToken && (
                <div className="from-background/60 to-background/80 absolute inset-0 flex items-center justify-center bg-gradient-to-br backdrop-blur-[2px]">
                    <div className="text-foreground p-4 text-center">
                        <p className="text-destructive text-lg font-semibold">
                            Mapbox Token Missing
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Please provide a valid Mapbox access token
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(MapBox);
