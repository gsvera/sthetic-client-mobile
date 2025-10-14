export const REACT_QUERY_KEYS = {
    user: {
        findDuplicatedUser: (key:string) => `get-plan-filter-data-${key}`,
        getDataUser: (key: string) => `get-data-user-${key}`,
        getMyReservation: (key: string) => `get-data-my-reservation-${key}`,
        getVerificationAccount: (key: string) => `get-data-verification-account-${key}`
    },
    userConfig: {
        getLocationByProvider: (key:string) => `get-location-by-provider`,
        getDefaultLocationByUser: (key:string) => `get-location-by-user${key}`,
        configVersion: (key:string) => `get-current-version-${key}`
    },
    plan: {
        getFilterData: (key:string) => `get-plan-filter-data-${key}`,
        getByUser:(key:string) => `get-plan-by-user`
    },
    lada: {
        getFilterData: (key:string) => `get-lada-filter-data-${key}`
    },
    catalogs: {
        typeServices: {
            getByUser: (key: string) => `get-catalogs-type-by-user-${key}`,
            getAll: (key:string) => `get-all-catalogs-type-services-${key}`
        },
        services: {
            getByUserId: (key:string | number | undefined) => `get-catalog-user-service-by-id-${key}`,
            getToEdit: (key:number) => `get-catalog-user-service-to-edit-${key}`,
            getById: (key: number) => `get-catalog-user-service-by-id-${key}`,
            
        },
        coupon: {
            getByCode: (key:string) => `get-coupon-by-code-${key}`
        },
        geo: {
            getAllState: (key: string) => `get-all-geo-state-${key}`,
            getMunicipalityByState: (key: number | undefined) => `get-all-geo-municipality-${key}`
        }   
    },
    calendar: {
        calendarByUser: {
            /**
             * @deprecated getByIdUser no se usa en esta app
             */
            getByIdUser: (key:string | undefined) => `get-calendar-by-user-id-${key}`,
            getTimeCalendarByProvider: (key:string) => `get-time-calendar-by-provider`
        },        
        calendarException: {
            getByUser: (key:string) => `get-calendar-exception-by-user-${key}`
        }
    },
    provider: {
        searchProvider: (key:string) => `search-provider-by-filter-${key}`,
        findProviderByUserId: (key:string | number | undefined) => `find-provider-by-user-id-${key}`,
        getServicesByProvider: (key: string | undefined) => `get-menu-services-by-provide-${key}`,
        getLocation: (key:string) => `get-location-by-provider-${key}`,
        pendingRating: (key: string) => `get-pending-rating-by-provider-${key}`,
        getRatingsByProvider: (key: string) => `get-ratings-by-provider-${key}`,
        getFavoriteProvider: (key: string) => `get-favorite-provider-${key}`,
        getListKeysFavoritesProvider: (key: string) => `get-list-keys-favorites-provider-${key}`
    }
}