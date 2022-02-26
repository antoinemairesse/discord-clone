// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDxL_ZPetAap5B78Zubkkn13HvhLjNbTNA",
    authDomain: "discord-clone-420ba.firebaseapp.com",
    projectId: "discord-clone-420ba",
    storageBucket: "discord-clone-420ba.appspot.com",
    messagingSenderId: "382208956113",
    appId: "1:382208956113:web:3b45974fb694db8f7757f0"
  }
};

export const defaultPhotoURL: string = "https://firebasestorage.googleapis.com/v0/b/discord-clone-420ba.appspot.com/o/default-server-icon.png?alt=media&token=22b079f4-06b8-456b-a36a-4ce66471aa8a";

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
