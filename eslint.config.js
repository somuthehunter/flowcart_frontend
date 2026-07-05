import js from "@eslint/js";
import eslintPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import eslintPluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    globalIgnores(["dist", ".prototype/**"]),
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            react: eslintPluginReact,
        },
        settings: {
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.json",
                },
            },
        },
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs["recommended-latest"],
            importPlugin.flatConfigs.recommended,
            importPlugin.flatConfigs.typescript,
            reactRefresh.configs.vite,
            eslintPrettier,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        rules: {
            "react/jsx-filename-extension": [
                "error",
                {
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                },
            ],
            // "jsx-a11y/label-has-associated-control": [
            //   "error",
            //   {
            //     "required": {
            //       "some": [
            //         "nesting",
            //         "id"
            //       ]
            //     }
            //   }
            // ],
            // "jsx-a11y/label-has-for": [
            //   "error",
            //   {
            //     "required": {
            //       "some": [
            //         "nesting",
            //         "id"
            //       ]
            //     }
            //   }
            // ],
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": [
                "off",
                {
                    ignoreFunctionTypeParameterNameValueShadow: true,
                },
            ],
            "jsx-quotes": "off",
            "react/jsx-one-expression-per-line": "off",
            "react/jsx-props-no-spreading": "off",
            "react/prop-types": "off",
            "react/forbid-prop-types": "warn",
            "react/no-unused-state": "warn",
            "react/jsx-wrap-multilines": "off",
            "react/no-access-state-in-setstate": "off",
            "react/react-in-jsx-scope": "off",
            "react/no-array-index-key": "off",
            "jsx-a11y/anchor-is-valid": "off",
            "jsx-a11y/anchor-has-content": "off",
            "import/no-extraneous-dependencies": "off",
            "import/no-cycle": "off",
            "linebreak-style": "off",
            "arrow-body-style": "off",
            "comma-dangle": "off",
            "max-len": "off",
            "arrow-parens": "off",
            "object-curly-newline": "off",
            "operator-linebreak": "off",
            "react/jsx-closing-tag-location": "off",
            "no-param-reassign": "off",
            // "indent": [
            //     "error",
            //     4,
            //     {
            //         "SwitchCase": 1,
            //         "FunctionExpression": {
            //             "body": 1,
            //             "parameters": "off"
            //         },
            //         "CallExpression": {
            //             "arguments": "off"
            //         },
            //         "ObjectExpression": "off",
            //         "ArrayExpression": "off",
            //         "ImportDeclaration": "off",
            //         "offsetTernaryExpressions": true,
            //         "flatTernaryExpressions": false,
            //         "ignoreComments": true
            //     }
            // ],
            // "react/jsx-indent": [
            //     "error",
            //     4
            // ],
            // "react/jsx-indent-props": [
            //     "error",
            //     4
            // ],
            "import/no-unresolved": [
                2,
                {
                    amd: true,
                },
            ],
            "no-nested-ternary": "off",
            "react/function-component-definition": [
                2,
                {
                    namedComponents: [
                        "function-declaration",
                        "function-expression",
                        "arrow-function",
                    ],
                    unnamedComponents: [
                        "function-expression",
                        "arrow-function",
                    ],
                },
            ],
            "react/destructuring-assignment": "off",
            "prefer-destructuring": "off",
            quotes: "off",
            "import/prefer-default-export": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-empty-object-type": "warn",
            "@typescript-eslint/no-wrapper-object-types": "warn",
            "no-use-before-define": "off",
            "react/require-default-props": "off",
            "react/no-unescaped-entities": [
                "error",
                {
                    forbid: [">", "}"],
                },
            ],
            "quote-props": [
                "error",
                "as-needed",
                {
                    unnecessary: false,
                },
            ],
            "no-bitwise": [
                "error",
                {
                    allow: ["~", "&", "|"],
                },
            ],
            eqeqeq: ["error", "smart"],
            "no-mixed-operators": [
                "error",
                {
                    groups: [
                        ["+", "-"],
                        ["*", "/", "%", "**"],
                        ["&", "|", "^", "~", "<<", ">>", ">>>"],
                        ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                        ["&&", "||"],
                        ["in", "instanceof"],
                    ],
                    allowSamePrecedence: true,
                },
            ],
            "no-plusplus": "off",
            radix: ["error", "as-needed"],
            "lines-between-class-members": [
                "error",
                "always",
                {
                    exceptAfterSingleLine: true,
                },
            ],
            "import/extensions": "off",
            "eol-last": "off",
        },
    },
]);
