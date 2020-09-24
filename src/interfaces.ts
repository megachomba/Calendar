export interface Dispo{
    start: Date;
    end: Date;
    recurrent: boolean;
}
export interface Bien {
    id: string;
    addresse: string;
    disponibilite: Dispo[];
}
export interface Visite {
    date: Date;
    bienId: string;
}
