# ThyroCheck - Project Structure

## 📂 Complete Folder Structure

```
ThyroCheck/
├── src/                          # Source code directory
│   ├── assets/                   # Static assets
│   │   ├── images/               # Image files (icons, splash screens, etc.)
│   │   └── fonts/                # Custom font files
│   │
│   ├── components/               # Reusable UI components
│   │   ├── Button.js            # Button component
│   │   ├── Card.js              # Card component
│   │   └── index.js             # Component exports
│   │
│   ├── constants/                # App-wide constants
│   │   ├── colors.js            # Color palette
│   │   ├── sizes.js             # Size constants (spacing, fonts, etc.)
│   │   └── index.js             # Constant exports
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useDebounce.js       # Debounce hook example
│   │   └── index.js             # Hook exports
│   │
│   ├── navigation/               # Navigation configuration
│   │   ├── AppNavigator.js       # Main navigation setup
│   │   └── index.js             # Navigation exports
│   │
│   ├── screens/                  # Screen components
│   │   ├── HomeScreen.js        # Home screen example
│   │   └── index.js             # Screen exports
│   │
│   ├── services/                 # API and external services
│   │   ├── api.js               # API service layer
│   │   └── index.js             # Service exports
│   │
│   ├── styles/                   # Global styles
│   │   └── globalStyles.js      # Shared style definitions
│   │
│   ├── types/                    # Type definitions
│   │   └── index.js             # Type exports
│   │
│   └── utils/                    # Utility functions
│       ├── helpers.js           # Helper functions
│       └── index.js             # Utility exports
│
├── App.js                        # Main app entry point
├── app.json                      # Expo configuration
├── index.js                      # App entry point
├── package.json                  # Dependencies and scripts
├── README.md                     # Project documentation
└── .gitignore                    # Git ignore rules
```

## 🎯 Key Features

### ✅ Professional Structure
- Organized by feature/type (components, screens, services, etc.)
- Clear separation of concerns
- Easy to scale and maintain

### ✅ Reusable Components
- Button component with loading/disabled states
- Card component for consistent UI
- All components exported through index files

### ✅ Navigation Setup
- React Navigation configured
- Stack navigator ready
- Easy to add new screens

### ✅ Constants & Styles
- Centralized color palette
- Size constants for consistency
- Global styles for common patterns

### ✅ Services Layer
- API service ready for backend integration
- Error handling included
- Easy to extend

### ✅ Custom Hooks
- Example debounce hook
- Ready for more custom hooks

### ✅ Utilities
- Helper functions for common tasks
- Date formatting, validation, etc.

## 🚀 Next Steps

1. **Add More Screens**: Create new screens in `src/screens/` and add them to the navigator
2. **Customize Components**: Modify existing components or create new ones in `src/components/`
3. **Connect API**: Update `src/services/api.js` with your backend endpoints
4. **Add Features**: Use the established structure to add new features
5. **Styling**: Customize colors and styles in `src/constants/` and `src/styles/`

## 📝 Development Workflow

1. **New Screen**: 
   - Create in `src/screens/`
   - Export in `src/screens/index.js`
   - Add to `src/navigation/AppNavigator.js`

2. **New Component**:
   - Create in `src/components/`
   - Export in `src/components/index.js`
   - Use in screens

3. **API Integration**:
   - Add methods to `src/services/api.js`
   - Use in screens/components

4. **Styling**:
   - Use constants from `src/constants/`
   - Use global styles from `src/styles/globalStyles.js`
   - Add component-specific styles as needed

