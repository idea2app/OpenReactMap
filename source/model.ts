import { HTTPClient } from 'koajax';
import { LatLngTuple } from 'leaflet';
import { computed, observable } from 'mobx';
import { buildURLData } from 'web-utility';

export type CoordinateValue = `${number}.${number}`;

export interface Location {
    place_id: number;
    osm_id: number;
    osm_type: 'relation';
    boundingbox: [
        CoordinateValue,
        CoordinateValue,
        CoordinateValue,
        CoordinateValue
    ];
    lat: CoordinateValue;
    lon: CoordinateValue;
    display_name: string;
    licence: string;
}

export interface PossibleLocation extends Location {
    type: 'administrative';
    class: 'boundary';
    icon: number;
    importance: number;
}

export type Address = Record<
    'ISO3166-2-lvl4' | 'country_code' | 'country',
    string
> &
    Partial<
        Record<
            | 'state'
            | 'state_district'
            | 'town'
            | 'village'
            | 'road'
            | 'neighbourhood'
            | 'building'
            | 'house_number'
            | 'amenity'
            | 'postcode',
            string
        >
    >;
export interface AddressLocation extends Location {
    address: Address;
}

export class OpenReactMapModel {
    nominatimClient = new HTTPClient({
        baseURI: 'https://nominatim.openstreetmap.org',
        responseType: 'json'
    });

    @observable
    accessor currentLocation: LatLngTuple | undefined;

    @observable
    accessor searchList: PossibleLocation[] = [];

    @observable
    accessor reversedAddress: AddressLocation | undefined;

    @computed
    get reversedAddressText() {
        return (
            this.reversedAddress &&
            OpenReactMapModel.addressTextOf(this.reversedAddress)
        );
    }

    /**
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition}
     */
    async locate() {
        const {
            coords: { latitude, longitude }
        } = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true
            })
        );
        return (this.currentLocation = [latitude, longitude]);
    }

    /**
     * @see https://nominatim.org/release-docs/develop/api/Search/
     */
    async search(address: string) {
        const { body } = await this.nominatimClient.get<PossibleLocation[]>(
            `search?${new URLSearchParams({ q: address, format: 'json' })}`
        );
        return (this.searchList = body);
    }

    /**
     * @see https://nominatim.org/release-docs/develop/api/Reverse/
     */
    async reverse(lat: number, lon: number) {
        const { body } = await this.nominatimClient.get<AddressLocation>(
            `reverse?${buildURLData({ lat, lon, format: 'json' })}`
        );
        return (this.reversedAddress = body);
    }

    static addressTextOf({
        address: {
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
        }
    }: AddressLocation) {
        return [
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
            .join(' ');
    }
}
