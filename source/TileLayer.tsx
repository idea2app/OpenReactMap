import { FC, useEffect } from 'react';
import { tileLayer } from 'leaflet';
import { useMap } from 'react-leaflet';

/**
 * @see {@link https://github.com/htoooth/Leaflet.ChineseTmsProviders/#providers}
 */
export interface TileLayerProps {
    providerURL?: string;
    type?: 'Normal' | 'Satellite' | 'Terrain';
    data?: 'Map' | 'Annotion' | 'PurplishBlue' | 'Gray' | 'Warm' | 'Hydro';
    vendor?:
        | 'OSM'
        | 'Geoq'
        | 'Google'
        | 'GaoDe'
        | 'Tencent'
        | 'Baidu'
        | 'TianDiTu';
    option?: {
        key?: string;
        maxZoom?: number;
        minZoom: number;
    };
}

export const TileLayer: FC<TileLayerProps> = ({
    providerURL = 'https://unpkg.com/leaflet.chinatmsproviders@3/src/leaflet.ChineseTmsProviders.js',
    type = 'Normal',
    data = 'Map',
    vendor = 'OSM',
    option
}) => {
    const map = useMap();

    useEffect(() => {
        const script = document.createElement('script');

        script.src = providerURL;

        script.onload = () =>
            tileLayer
                // @ts-ignore
                .chinaProvider([vendor, type, data].join('.'), option)
                .addTo(map);

        document.body.append(script);
    }, [map]);

    return <></>;
};

TileLayer.displayName = 'TileLayer';
