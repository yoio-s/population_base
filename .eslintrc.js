// module.exports = {
//   root: true,
//   env: {
//     node: true,
//   },
//   extends: ['plugin:vue/essential', '@vue/standard'],
//   parserOptions: {
//     parser: 'babel-eslint',
//   },
//   rules: {
//     'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//     'vue/no-v-html': 'off',
//     'comma-dangle': [0, 'never'], // 尾逗号
//     'space-before-function-paren': [0, 'always'], // 函数括号空格
//     // 'indent': [2, 4], // 强制使用一致的缩进
//     // 'eqeqeq': [2, 'always'], // 要求使用 === 和 !==
//     // 'semi': [2, 'never'], // 要求或禁止使用分号代替 ASI
//     // 'quotes': [2, 'single'],  // 强制使用一致的反勾号、双引号或单引号
//   },
// }

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    // '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 'comma-dangle': [0, 'never'], // 尾逗号
    // 'space-before-function-paren': [0, 'always'], // 函数括号空格
  },
}
