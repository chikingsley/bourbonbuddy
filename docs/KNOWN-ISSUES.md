# Known Issues

## Jest Configuration with jest-expo

**Status**: In Progress
**Severity**: Medium
**Affects**: Unit tests

### Issue
Jest tests fail with error:
```
TypeError: Object.defineProperty called on non-object
at Object.<anonymous> (node_modules/jest-expo/src/preset/setup.js:47:8)
```

### Root Cause
Compatibility issue between jest-expo preset and the current React Native/Expo SDK 54 configuration.

### Workaround Options

1. **Use Standard Jest Preset** (Recommended for now)
   ```json
   "jest": {
     "preset": "react-native",
     // ... rest of config
   }
   ```

2. **Skip Unit Tests Temporarily**
   - E2E tests with Maestro are functional
   - Can rely on Maestro for testing until jest-expo is fixed

3. **Downgrade jest-expo**
   - Try jest-expo@~53.0.0
   - May lose some Expo-specific features

### Status
- [x] Issue documented
- [ ] Solution identified
- [ ] Fix implemented
- [ ] Tests passing

### Resources
- [jest-expo Issues](https://github.com/expo/expo/tree/main/packages/jest-expo)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)

---

## Other Known Issues

*None at this time*
