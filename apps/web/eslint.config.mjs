import { defineConfig } from 'eslint/config';
import { nextJsConfig } from '@starform/eslint-config/next-js';

const eslintConfig = defineConfig([...nextJsConfig]);

export default eslintConfig;
