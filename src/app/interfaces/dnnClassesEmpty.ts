import { CarInfo, Client, ServicesType, Station, User, UserProfileType } from "./dnnClasses";

export const ServicesTypeEmpty = (): ServicesType => {
  return {
    className: "Services",
    id: null,
    createdAt: null,
    updatedAt: null,
    name: null,
  };
};

export const ZoneEmpty = (): any => {
  return {
    className: "Zones",
    Id: null,
    createdAt: null,
    updatedAt: null,
    Name: null,
    IsMultiple: null,
  };
};
export const ClientEmpty = (): Client => {
  return {
    Id: null,
    Label: null,
  };
};

export const StationEmpty = (): Station => {
  return {
    Id: null,
    Label: null,
    Name: null,
    Description: null,
    IsAvailable: null,
    client: ClientEmpty(),
  };
};
export const UserProfileTypeEmpty = (): UserProfileType => {
  return {
    Id: null,
    Label: null,
  };
};

export const UserEmpty = (): User => {
  return {
    Id: null,
    DisplayName: null,
    Email: null,
    Zone: ZoneEmpty(),
    Username: null,
    MobileNumber: null,
    UserProfileType: UserProfileTypeEmpty(),
  };
};

export const CarInfoEmpty = (): CarInfo => {
  return {
    damage: false,
    refuel: false,
  };
};
