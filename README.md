#Logiface
 Aplicativo para transferes 3.0+

## Dependences Database Parse B4a
- `Moviments => {
    className: string,
    id?: string,
    attributes: {
        chef: string,
        user: User,
        created: Date,
        createdAt: Date,
        updatedAt: Date,
        deleted: boolean,
        originEdestiny: string,
        typeEscanner: string,
        plate: string,
        matriculaEstrangeira: boolean,
        stationName: string,
        zone: string,
        zona: zone,
        station: station,
    }`
    
- `User => {
    className: string,
    id?: string,
    attributes: {
        nome: string,
        username: string,
        email: string,
        job: string,
        typeUser: string,
        password?: string,
        sessionToken?: string,
        createdAt?: Date,
        updatedAt?: Date,
        createdBy: User,
        zone: string,
        zoneP: zone,
        objetivoMensal: number,
    }`
    
- `Zones => {
    className: string,
    id: string,
    attributes: {
        name: string,
        multipla: boolean,
    }
}`
- `stations {
    className: string,
    id: string,
    attributes: {
        available: boolean,
        name: string,
        pendingPlaces: any[],
        places: any[],
        washTypes: any[],
        zona: zone,
        zone: string
    }
   }`
 

## Dados Storage:

- `dayToday: number`
- `currentStation: string`
