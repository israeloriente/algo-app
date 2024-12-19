export const environment: Environment = {
  production: false,
  staging: false,
  defaultLanguage: "pt",
  VERSION: require("package.json").version,
  APP_NAME: require("package.json").name,
  appUrl: "https://logiface.herokuapp.com/",
  transferBucket: "starface-transfers-test", // starface-transfers
  checkinBucket: "starface-check-in-test", // starface-checkin
  dnnPortalUrl: "http://dnndev.me",
  linktreeUrl: "https://linktr.ee/carface",
  aws: {
    accessKey: "",
    secretAccessKey: "",
    region: "",
  },
};

/** Interface to be used in environment.ts
 *
 * @member {boolean} production is a boolean that indicates if the app is in production mode.
 * @member {boolean} staging is a boolean that indicates if the app is in staging mode.
 * @member {string} defaultLanguage is the default language of the app.
 * @member {string} APP_NAME is the name of the app.
 * @member {string} VERSION is the version of the app.
 * @member {string} appUrl is the URL of the app.
 * @member {string} bucketName is the name of the bucket s3 to deploy transfer images.
 * @member {interface} Parse provides Parse server credentials.
 */
export interface Environment {
  production: boolean;
  staging: boolean;
  defaultLanguage: "pt";
  APP_NAME: string;
  VERSION: string;
  appUrl: string;
  checkinBucket: string;
  transferBucket: string;
  dnnPortalUrl: string;
  linktreeUrl: string;
  aws: {
    accessKey: string;
    secretAccessKey: string;
    region: string;
  };
}
