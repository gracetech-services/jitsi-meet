# GraceTech Jitsi Meet SDK

## Instructions

### 1. Create new SDK version

#### 1.1 Prepare
The following steps need to be done only once.：
1. Clone [gracetech-services/gt-jitsisdk](https://github.com/gracetech-services/gt-jitsisdk) Repo
2. Get the local path directory of the above Repo, which will be used in subsequent steps.

#### 1.2 Create 

1. Navigate to `react-native-sdk` directory in this repo
2. (Optional) Run `git switch <branch name>` to switch to the desired branch from which to create the new version
3. Update version in `react-native-sdk/package.json` if not updated already
4. Run `npm pack --pack-destination <path to gt-jitsisdk>/packages/`
5. Rename the created `.tgz` file if desired and commit the file to GitHub

Note: Only commit updated version in `package.json`, do not commit any other changes in this repo when creating a new SDK version.

### 2. Use new SDK version in app

1. Update `@jitsi/react-native-sdk` dependency in app `package.json` with the raw GitHub link to the desired `.tgz` file. Make sure the link references the file from a specific commit and does not reference a branch. For example: `https://github.com/gracetech-services/gt-jitsisdk/raw/314835fb95090505b4c24d422634eb85b988a086/packages/jitsi-react-native-sdk-0.0.0.tgz`

### 3. Update Jitsi SDK for new Expo SDK version

#### 3.1 Update Expo SDK
1. In repo root, Run `npm install -D expo` to install Expo temporarily
2. Run `npx expo install --fix` to fix React Native SDK peer dependency versions. Note: Updating `@types/*` or `typescript` packages may cause typing errors, do not update these packages if desired
3. Run `npx expo-doctor` and fix issues
4. Run `npm uninstall expo` to remove Expo

#### 3.2 Update RNSDK dependencies
1. Navigate to `react-native-sdk` directory in this repo, Run `node update_sdk_dependencies.js`
2. Follow instructions above (1. Create new SDK version) to create new Jitsi SDK version

### 4. Steps to regenerate index files

@Max: Not yet verified

1. Navigate to `react-native-sdk` directory
2. Run `npm run generate-index`
3. Delete all other generated files except `react-native-sdk/index.js` and `react-native-sdk/index.d.ts`
4. Navigate to repo root and run `eslint --fix react-native-sdk/index.js` if needed to fix lint errors
