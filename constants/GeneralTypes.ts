export type loginData = {
    username: string;
    password: string;
    isClient?: boolean;
}

export type UserType = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string
}

export type LadaType = {
    id: number;
    code: string;
    lada: string;
}

export type selectOptionType = {
    key: number | string,
    value: string,
    checked?: boolean
}

export type OptionSelectType = {
    value: string | number;
    label: string;
    onSelect: (value:string | number) => void   
}

export type fileTypes = 'image' | 'video' | null;

export type modalCustomProps = {
    open: boolean;
    handleCloseModal: () => void;    
    idUser?: string | number;
    idProvider?: string;
  };

export type InfoCompanyType = {
    id: number;
    idUser: string;
    companyName: string;
    generalDescription: string;
    companyPicture: string;
    typesServices: string;
    facebook?: string;
    instagram?: string;
    webPage?: string;
}

export type TypesServicesType = {
    id: number;
    typeServiceNameEs: string;
    descriptionEs: string;
}

export type UserLocationType = {
    id: string;
    latitude: number;
    longitude: number;
    auxState?: string;
    auxMunicipality?: string;
    reference?: string;
}

export type ProviderType = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    lada: string;
    phone: string;
    profilePictureB64?: string;
    infoCompanyDTO: InfoCompanyType;
    userLocationDTO: UserLocationType;
    typeServices?: string
}


export type DetailProjectType = {
  id: number;
  fileBase64: string;
};

export type ProjectType = {
  id: number;
  nameService: string;
  minPrice?: number;
  maxPrice?: number;
  totalElement?: number;
  catalogUserServiceDetailDTO?: DetailProjectType;
};


export type weekDays = 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes' | 'sábado' | 'domingo';

export type TimeScheduleType = {
    start: string;
    end: string
}

export type SelectedDateCalendarType = {
    dateString: string;
    nameDay: string;
    time: TimeScheduleType;
} 

export type MenuServiceType = {
    id: number;
    nameService: string;
    people: number;
    price: number;
}

export type ScheduleServiceType = {
    id?: number;
    idClient: string;
    idProvider: string;
    scheduleDate: string;
    startTime: string;
    endTime: string;
    nameService: string;
    people: number;
    amount: number;
}


/**
 * @deprecated no se usa por que el cliente no adquiere un plan
 */
export type CatalogPlanDTO = {
    id: number;
    active: boolean;
    name: string;
    duration: number;
    price: number;
}

/**
 * @deprecated no se usa por que el cliente no adquiere un plan
 */
export type UserPlan = {
    id: number;
    idUser: string;
    createdData: string;
    duration: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    catalogPlanDTO: CatalogPlanDTO;
}
