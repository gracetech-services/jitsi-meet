# GraceTech Jitsi Meet SDK

## Notes

React Native SDK has been modified to add generated `index.js` and `index.d.ts` files, which are included in the SDK instead of `index.tsx`.
This prevents typing errors when using the SDK in another project.

`index.js` and `index.d.ts` should be regenerated if `index.tsx` changes and should not be modified by hand.

## Instructions

### Create new SDK version

1. Clone GraceTech gt-jitsisdk repo
2. Navigate to `react-native-sdk` directory in this repo
3. (Optional) Run `git switch <branch name>` to switch to the desired branch from which to create the new version
4. Update version in react-native-sdk `package.json` if not updated already
5. Run `npm pack --pack-destination <path to gt-jitsisdk>/packages/`
6. Rename the created `.tgz` file if desired and commit the file to GitHub

Note: Only commit updated version in `package.json`, do not commit any other changes in this repo when creating a new SDK version.

### Use new SDK version in app

1. Update `@jitsi/react-native-sdk` dependency in app `package.json` with the raw GitHub link to the desired `.tgz` file. Make sure the link references the file from a specific commit and does not reference a branch. For example: `https://github.com/gracetech-services/gt-jitsisdk/raw/314835fb95090505b4c24d422634eb85b988a086/packages/jitsi-react-native-sdk-0.0.0.tgz`

### Update Jitsi SDK for new Expo SDK version

1. Run `npm install -D expo` to install Expo temporarily
2. Run `npx expo install --fix` to fix React Native SDK peer dependency versions. Note: Updating `@types/*` or `typescript` packages may cause typing errors, do not update these packages if desired
3. Run `npx expo-doctor` and fix issues
4. Run `npm uninstall expo` to remove Expo
5. Follow instructions above to create new Jitsi SDK version

### Steps to regenerate index files

-   Navigate to `react-native-sdk` directory
-   Run `npm run generate-index`
-   Delete all other generated files except `react-native-sdk/index.js` and `react-native-sdk/index.d.ts`
-   Navigate to repo root and run `eslint --fix react-native-sdk/index.js` if needed to fix lint errors
