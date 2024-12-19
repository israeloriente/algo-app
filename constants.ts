import { environment } from "@root/environment";

export const Constants = {

  apiAuthorizationLogin: environment.dnnPortalUrl + "/DesktopModules/Carface.Rentals/API/Authorization/Login",

  apiAuthorizationIsAuthenticated: environment.dnnPortalUrl + "/DesktopModules/Carface.Rentals/API/Authorization/IsAuthenticated",

  apiAuthorizationExtendToken: environment.dnnPortalUrl + "/DesktopModules/Carface.Rentals/API/Authorization/ExtendToken",

  apiAuthorizationIsLockedOut: environment.dnnPortalUrl + "/DesktopModules/Carface.Rentals/API/Authorization/IsLockedOut",

  apiAuthorizationIsValidUser: environment.dnnPortalUrl + "/DesktopModules/Carface.Rentals/API/Authorization/IsValidUser",

  apiAuthorizationLogout: environment.dnnPortalUrl + "/DesktopModules/JwtAuth/API/mobile/logout",

  apiAuthorizationGetCurrentUser: environment.dnnPortalUrl + "/DesktopModules/Carface.Rentals/API/Authorization/GetCurrentUser",

  apiAuthorizationSendResetPasswordCode: environment.dnnPortalUrl + "/DesktopModules/Carface.Rentals/API/Authorization/SendResetPasswordCode",

  apiAuthorizationIsResetPasswordCodeValid: environment.dnnPortalUrl + "/DesktopModules/Carface.Rentals/API/Authorization/isResetPasswordCodeValid",

  apiAuthorizationUpdatePassword: environment.dnnPortalUrl + "/DesktopModules/Carface.Rentals/API/Authorization/UpdatePassword",

  apiConfigurationGet: environment.dnnPortalUrl + "/DesktopModules/Carface.Rentals/API/Configuration/Get",

  apiClientLookup: environment.dnnPortalUrl + "/DeskTopModules/Carface.Rentals/API/Client/Lookup",

  apiClientListExtended: environment.dnnPortalUrl + "/DeskTopModules/Carface.Rentals/API/Client/ListExtended",

  apiZoneLookup: environment.dnnPortalUrl + "/DeskTopModules/Carface.Rentals/API/Zone/Lookup",

  apiZoneListExtended: environment.dnnPortalUrl + "/DeskTopModules/Carface.Rentals/API/Zone/ListExtended",

  apiStationLookup: environment.dnnPortalUrl + "/DeskTopModules/Carface.Rentals/API/Station/Lookup",

  apiStationLookupMultiClient: environment.dnnPortalUrl + "/DeskTopModules/Carface.Rentals/API/Station/LookupMultiClient",

  apiStationLookupClients: environment.dnnPortalUrl + "/DeskTopModules/Carface.Rentals/API/Station/LookupClients",

  apiStationLookupByStation: environment.dnnPortalUrl + "/DeskTopModules/Carface.Rentals/API/Station/LookupServices",

  apiStationListExtended: environment.dnnPortalUrl + "/DeskTopModules/Carface.Rentals/API/Station/ListExtended",

  apiStationGetSettings: environment.dnnPortalUrl + "/DeskTopModules/Carface.Rentals/API/Station/GetSettings",

  apiReportCreate: environment.dnnPortalUrl + "/DeskTopModules/Carface.Rentals/API/Report/Create",

  apiServiceLookup: environment.dnnPortalUrl + "/DeskTopModules/Carface.Rentals/API/Service/Lookup",

  apiSpecialServiceTypeLookup: environment.dnnPortalUrl + "/DeskTopModules/Carface.Rentals/API/SpecialServiceType/Lookup",
} as const;
