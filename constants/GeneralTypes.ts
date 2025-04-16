export type loginData = {
    username: string;
    password: string;
    isClient?: boolean;
}

export type selectOptionType = {
    key: number | string,
    value: string,
    checked?: boolean
}

export type fileTypes = 'image' | 'video' | null;

export type modalCustomProps = {
    open: boolean;
    handleCloseModal: () => void;    
    idUser?: string;
  };

export type InfoCompanyType = {
    id: number;
    idUser: string;
    companyName: string;
    generalDescription: string;
    companyPicture: string;
    typesServices: string;
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

export type weekDays = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';