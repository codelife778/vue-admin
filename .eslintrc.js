
module.exports = {
    root: true,
    parserOptions: {
      parser: 'babel-eslint',
      sourceType: 'module'
    },
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    extends: ['plugin:vue/recommended', 'eslint:recommended'],
  
    // add your custom rules here
    //it is base on https://github.com/vuejs/eslint-config-vue
    rules: {
      "vue/max-attributes-per-line": [2, {
        "singleline": 15,
        "multiline": {
          "max": 10,
          "allowFirstLine": false
        }
      }],
      "vue/singleline-html-element-content-newline": "on",
      "vue/multiline-html-element-content-newline":"on",
      "vue/name-property-casing": ["error", "PascalCase"],
      "vue/no-v-html": "off",
      'accessor-pairs': 2,
      'arrow-spacing': [2, {
        'before': true,
        'after': true
      }],
      'block-spacing': [0, 'always'],
      'brace-style': [2, '1tbs', {
        'allowSingleLine': true
      }],
      'camelcase': [0, {
        'properties': 'always'
      }],
      'comma-dangle': [2, 'never'],
      'comma-spacing': [2, {
        'before': false,
        'after': true
      }],
      'comma-style': [2, 'last'],
      'constructor-super': 2,
      'curly': [2, 'multi-line'],
      'dot-location': [2, 'property'],
      'eol-last': 2,
      'eqeqeq': ["off", "always", {"null": "ignore"}],
      'generator-star-spacing': [2, {
        'before': true,
        'after': true
      }],
      'handle-callback-err': [2, '^(err|error)$'],
      'indent': [2, 4, {
        'SwitchCase': 1
      }],
      'jsx-quotes': [2, 'prefer-single'],
      'key-spacing': [2, {
        'beforeColon': false,
        'afterColon': true
      }],
      'keyword-spacing': [2, {
        'before': true,
        'after': true
      }],
      'new-cap': [2, {
        'newIsCap': true,
        'capIsNew': false
      }],
      'new-parens': 2,
      'no-array-constructor': 2,
      'no-caller': 2,
      'no-console': 'off',
      'no-class-assign': 2,
      'no-cond-assign': 2,
      'no-const-assign': 2,
      'no-control-regex': 0,
      'no-delete-var': 2,
      'no-dupe-args': 2,
      'no-dupe-class-members': 2,
      'no-dupe-keys': 2,
      'no-duplicate-case': 2,
      'no-empty-character-class': 2,
      'no-empty-pattern': 2,
      'no-eval': 2,
      'no-ex-assign': 2,
      //禁止扩展原生对象 
      'no-extend-native': 2,
      'no-extra-bind': 2,
      //禁止不必要的布尔类型转换
      'no-extra-boolean-cast': 2,
      //禁止额外的括号
      'no-extra-parens': [2, 'functions'],
      //禁止 case 语句落空 
      'no-fallthrough': 2,
      //禁用浮点小数
      'no-floating-decimal': 2,
      'no-func-assign': 2,
      //禁用隐式的eval() 
      'no-implied-eval': 2,
      //禁止在嵌套的语句块中出现变量或 function 声明 
      'no-inner-declarations': [2, 'functions'],
      'no-invalid-regexp': 2,
      //禁止不规则的空白 
      'no-irregular-whitespace': 2,
      'no-iterator': 2,
      //禁用与变量同名的标签 
      'no-label-var': 2,
      //禁用标签语句
      'no-labels': [2, {
        'allowLoop': false,
        'allowSwitch': false
      }],
      //禁用不必要的嵌套块
      'no-lone-blocks': 2,
      //禁止使用 空格 和 tab 混合缩进
      'no-mixed-spaces-and-tabs': 2,
      'no-multi-spaces': 2,
      'no-multi-str': 2,
      //禁止多个空行
      'no-multiple-empty-lines': [2, {
        'max': 1
      }],
      //禁止重新分配本机对象
      'no-native-reassign': 2,
      //不允许对in表达式中的左操作数取反
      'no-negated-in-lhs': 2,
      'no-new-object': 2,
      'no-new-require': 2,
      //禁止 Symbolnew 操作符和 new 一起使用
      'no-new-symbol': 2,
      //禁止原始包装实例
      'no-new-wrappers': 2,
      //禁止将全局对象当作函数进行调用
      'no-obj-calls': 2,
      'no-octal': 2,
      'no-octal-escape': 2,
      //当使用 _dirname 和 _filename 时不允许字符串拼接
      'no-path-concat': 2,
      //禁用__proto__
      'no-proto': 2,
      //禁止重新声明变量 
      'no-redeclare': 2,
      //禁止正则表达式字面量中出现多个空格
      'no-regex-spaces': 2,
      //禁止在返回语句中赋值
      'no-return-assign': [2, 'except-parens'],
      //禁止自身赋值
      'no-self-assign': 2,
      'no-self-compare': 2,
      //不允许使用逗号操作符
      'no-sequences': 2,
      //关键字不能被遮蔽 
      'no-shadow-restricted-names': 2,
      //不允许函数标识符和它们的应用程序之间有空格
      'no-spaced-func': 2,
      //禁用稀疏数组
      'no-sparse-arrays': 2,
      //
      'no-this-before-super': 2,
      //限制可以被抛出的异常
      'no-throw-literal': 2,
      //禁用行尾空白
      'no-trailing-spaces': 2,
      //禁用未声明的变量 
      'no-undef': 2,
      //不允许初始化变量值为
      'no-undef-init': 2,
      //使用令人困惑的多行表达式 
      'no-unexpected-multiline': 2,
      //禁用一成不变的循环条件 无限循环
      'no-unmodified-loop-condition': 2,
      //禁止可以表达为更简单结构的三元操作符
      'no-unneeded-ternary': [2, {
        'defaultAssignment': false
      }],
      'no-unreachable': 2,
      'no-unsafe-finally': 2,
      // 声明未使用
      'no-unused-vars': [2, {
        'vars': 'all',
        'args': 'none'
      }],
      //禁用不必要的 .call() 和 .apply()
      'no-useless-call': 2,
      //禁止在对象中使用不必要的计算属性
      'no-useless-computed-key': 2,
      'no-useless-constructor': 2,
      //禁用不必要的转义
      'no-useless-escape': 0,
      //禁止属性前有空白
      'no-whitespace-before-property': 2,
      //禁用 with 语句
      'no-with': 2,
      //强制函数中的变量在一起声明或分开声明
      'one-var': [2, {
        'initialized': 'never'
      }],
      //运算符换行符
      'operator-linebreak': [2, 'after', {
        'overrides': {
          '?': 'before',
          ':': 'before'
        }
      }],
      //要求或禁止块内填充 
      'padded-blocks': [2, 'never'],
      //强制使用一致的反勾号、双引号或单引号
      'quotes': [2, 'single', {
        'avoidEscape': true,
        'allowTemplateLiterals': true
      }],
      //要求或禁止使用分号代替ASI 自动插入分号
      'semi': [2, 'never'],
      //强制分号前后的间距
      'semi-spacing': [2, {
        'before': false,
        'after': true
      }],
      //
      'space-before-blocks': [2, 'always'],
      //要求或禁止函数圆括号之前有一个空格
      'space-before-function-paren': [2, 'never'],
      //禁止或强制圆括号内的空格 
      'space-in-parens': [2, 'never'],
      //要求中缀操作符周围有空格 
      'space-infix-ops': 2,
      //在一元运算符之前/之后要求或禁止空格
      'space-unary-ops': [2, {
        'words': true,
        'nonwords': false
      }],
      //要求或禁止在注释前有空白 
      'spaced-comment': [2, 'always', {
        'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
      }],
      //强制模板字符串中空格的使用 
      'template-curly-spacing': [2, 'never'],
      //要求调用 isNaN()检查 NaN (use-isnan)
      'use-isnan': 2,
      //强制 typeof 表达式与有效的字符串进行比较
      'valid-typeof': 2,
      //需要把立即执行的函数包裹起来
      'wrap-iife': [2, 'any'],
      //强制在 yield* 表达式中 * 周围使用空格
      'yield-star-spacing': [2, 'both'],
      //要求或者禁止Yoda条件
      'yoda': [2, 'never'],
      //建议使用const
      'prefer-const': 2,
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
      //强制在花括号中使用一致的空格
      'object-curly-spacing': [2, 'always', {
        objectsInObjects: false
      }],
      //禁止或强制在括号内使用空格
      'array-bracket-spacing': [2, 'never'],
      // 闭合标签是否换行
      "vue/html-closing-bracket-newline": ["error", {
        "singleline": "never",
        "multiline": "never"
      }]
    }
  }
  
  