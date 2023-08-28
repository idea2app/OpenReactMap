import { Map } from 'leaflet';
import { FC, RefCallback, useEffect } from 'react';
import { useMap } from 'react-leaflet';

export interface MapExposerProps {
    mapRef: RefCallback<Map>;
}

export const MapExposer: FC<MapExposerProps> = ({ mapRef }) => {
    const map = useMap();

    useEffect(() => {
        mapRef(map);
    }, [map]);

    return <></>;
};

MapExposer.displayName = 'MapExposer';
