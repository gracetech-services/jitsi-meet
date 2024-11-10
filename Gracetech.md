# GraceTech Jitsi Meet SDK

## Notes
React Native SDK has been modified to add `index.js` and `index.d.ts` files so that `index.js` will be imported by SDK users instead of `index.tsx`.
This prevents type errors from the SDK from showing up when importing the SDK into another project and running `tsc` to type check the project.

`index.js` and `index.d.ts` are generated and should be regenerated if `index.tsx` changes.

### Steps to regenerate
- Navigate to `react-native-sdk` directory
- Run `npm run generate-index`
- Delete all generated files except `react-native-sdk/index.js` and `react-native-sdk/index.d.ts`
- Navigate to repo root and run `eslint --fix react-native-sdk/index.js` if needed to fix lint errors
