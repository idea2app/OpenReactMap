import { LeafletEventHandlerFnMap, LeafletMouseEventHandlerFn } from 'leaflet';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { PropsWithChildren, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
    MapContainer,
    MapContainerProps,
    Marker,
    MarkerProps,
    Popup,
    TileLayer,
    Tooltip
} from 'react-leaflet';
import { CamelEventName } from 'web-utility';

import { MapExposer, MapExposerProps } from './MapExposer';
import { OpenReactMapModel } from './model';

export type LeafLetComponent = 'TileLayer' | 'Marker';

export type MapEvent<N extends LeafLetComponent> = {
    [K in keyof LeafletEventHandlerFnMap as `on${N}${Capitalize<
        CamelEventName<K>
    >}`]: LeafletEventHandlerFnMap[K];
};

export interface MarkerMeta extends Pick<MarkerProps, 'position'> {
    tooltip?: string;
    popup?: string;
}

export type OpenReactMapProps = PropsWithChildren<
    Pick<MapContainerProps, 'className' | 'style' | 'center' | 'zoom'> &
        MapEvent<'TileLayer'> &
        MapEvent<'Marker'> &
        Partial<MapExposerProps> & {
            tileLayerURL?: string;
            attribution?: ReactNode;
            renderTileLayer?: (
                eventHandlers: LeafletEventHandlerFnMap
            ) => ReactNode;
            markers?: MarkerMeta[];
            title?: string;
            address?: string;
            onChange?: (
                data: Required<Pick<OpenReactMapProps, 'title' | 'address'>>
            ) => any;
        }
>;

/**
 * Don't forget to load LeafLet's CSS file, such as:
 *
 * ```html
 * <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
 * ```
 */
@observer
export class OpenReactMap extends ObservedComponent<OpenReactMapProps> {
    static displayName = 'OpenReactMap';

    store = new OpenReactMapModel();

    @computed
    get eventHandlerMap() {
        return Object.entries(this.observedProps).reduce(
            (map, [key, value]) => {
                const [_, type, event] =
                    key.match(/^on([A-Z][a-z]+)(.+)/) || [];

                if (type)
                    (map[type as LeafLetComponent] ||= {})[
                        event.toLowerCase() as keyof LeafletEventHandlerFnMap
                    ] = value as (...data: any[]) => any;

                return map;
            },
            {} as Record<LeafLetComponent, LeafletEventHandlerFnMap>
        );
    }

    @computed
    get position(): [number, number] | undefined {
        const [location] = this.store.searchList;

        return location && [+location.lat, +location.lon];
    }

    @computed
    get center() {
        return this.position || this.observedProps.center;
    }

    @computed
    get markers() {
        const { markers = [], address, title = address } = this.observedProps,
            { position } = this;

        return [
            ...markers,
            ...(position ? [{ position, tooltip: title }] : [])
        ];
    }

    componentDidMount() {
        const { address } = this.props;

        if (address) this.store.search(address);
    }

    componentDidUpdate({ address }: Readonly<OpenReactMapProps>) {
        if (this.props.address !== address) this.componentDidMount();
    }

    changeAddress: LeafletMouseEventHandlerFn = async ({
        latlng: { lat, lng }
    }) => {
        const { onChange } = this.props;

        if (!onChange) return;

        const location = await this.store.reverse(lat, lng);

        if (!location) return;

        const {
            country,
            state,
            state_district,
            town,
            village,
            road,
            neighbourhood,
            building,
            house_number,
            amenity
        } = location.address;

        const address = [
            country,
            state,
            state_district,
            town,
            village,
            road,
            neighbourhood,
            building,
            house_number,
            amenity
        ]
            .filter(Boolean)
            .join('');

        onChange({ title: location.display_name, address });
    };

    renderAttribution() {
        return (
            <>
                &copy;
                {this.props.attribution || (
                    <>
                        <a
                            className="mx-1"
                            href="https://www.openstreetmap.org/copyright"
                        >
                            OpenStreetMap
                        </a>
                        contributors
                    </>
                )}
            </>
        );
    }

    renderTileLayer = (eventHandlers: LeafletEventHandlerFnMap) => {
        const URL =
            this.props.tileLayerURL ||
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        return (
            <TileLayer
                attribution={renderToStaticMarkup(this.renderAttribution())}
                url={URL}
                eventHandlers={eventHandlers}
            />
        );
    };

    render() {
        const { center, markers, eventHandlerMap } = this,
            {
                style = { height: '100vh', maxHeight: '100vw' },
                mapRef,
                renderTileLayer = this.renderTileLayer,
                center: _,
                zoom,
                markers: __,
                onChange,
                children,
                ...props
            } = this.props;

        return !onChange && !center ? (
            children || <></>
        ) : (
            <MapContainer
                {...{ style, center, zoom, ...props }}
                doubleClickZoom={!onChange}
                touchZoom={!onChange}
                ref={
                    onChange &&
                    (map => {
                        map?.on('click', this.changeAddress);
                    })
                }
            >
                {mapRef && <MapExposer mapRef={mapRef} />}

                {renderTileLayer(eventHandlerMap.TileLayer)}

                {markers.map(({ position, tooltip, popup }) => (
                    <Marker
                        key={position + ''}
                        position={position}
                        eventHandlers={eventHandlerMap.Marker}
                    >
                        {popup ? (
                            <Popup>{popup}</Popup>
                        ) : (
                            <Tooltip permanent>{tooltip}</Tooltip>
                        )}
                    </Marker>
                ))}
                {children}
            </MapContainer>
        );
    }
}
