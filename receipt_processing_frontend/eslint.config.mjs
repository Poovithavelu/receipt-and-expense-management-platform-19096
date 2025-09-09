import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  // Target files
  { files: ["**/*.{js,mjs,cjs,jsx}"] },

  // Base language and globals
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      },
      globals: {
        document: true,
        window: true,
        test: true,
        expect: true
      }
    },
    rules: {
      // Keep codebase clean
      "no-unused-vars": ["error", { varsIgnorePattern: "React|App" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn"
    }
  },

  // Recommended JS rules
  pluginJs.configs.recommended,

  // React specific
  {
    plugins: { react: pluginReact },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react/prop-types": "off"
    }
  }
];
