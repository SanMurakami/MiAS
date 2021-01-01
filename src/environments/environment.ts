// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // FirebaseのWebAPIキーは公開しても大丈夫
  firebase: {
    apiKey: 'AIzaSyD3YdhoJ5sXD8de5Api2LKk7tjMqBu2gUg',
    authDomain: 'misskeyassetstore.firebaseapp.com',
    projectId: 'misskeyassetstore',
    storageBucket: 'misskeyassetstore.appspot.com',
    messagingSenderId: '855951205751',
    appId: '1:855951205751:web:961dd1622a6c3f749e2d72',
    measurementId: 'G-X6QZ36T9DN'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
