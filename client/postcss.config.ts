import { Plugin } from 'postcss';

interface PostCSSConfig {
  plugins: Plugin[];
}

const config: PostCSSConfig = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};

export default config;
