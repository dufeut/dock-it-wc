import { defineConfig } from "vite";
import { resolve } from "path";
import replace from "@rollup/plugin-replace";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/bundle.ts"),
      name: "Docker",
      fileName: (format) => `lumino-easy.${format}.js`,
      formats: ["es", "iife"],
    },
    rollupOptions: {
      external: [],
      output: {
        compact: true,
        generatedCode: "es2015",
        inlineDynamicImports: true,
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
        unknownGlobalSideEffects: false,
      },
      plugins: [
        replace({
          preventAssignment: true,
          values: {
            "process.env.NODE_ENV": JSON.stringify("production"),
            __DEV__: "false",
          },
        }),
      ],
    },
    minify: "terser",
    terserOptions: {
      ecma: 2020,
      module: true,
      toplevel: true,
      compress: {
        ecma: 2020,
        module: true,
        toplevel: true,
        passes: 5,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.warn",
        ],
        pure_getters: true,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        dead_code: true,
        unused: true,
        hoist_funs: true,
        conditionals: true,
        comparisons: true,
        booleans: true,
        loops: true,
        if_return: true,
        join_vars: true,
        collapse_vars: true,
        reduce_vars: true,
        reduce_funcs: true,
        sequences: true,
        arguments: true,
        evaluate: true,
        negate_iife: true,
        global_defs: {
          DEBUG: false,
          __DEV__: false,
        },
      },
      mangle: {
        module: true,
        toplevel: true,
        properties: {
          regex: /^_[a-z]/,
        },
      },
      format: {
        ecma: 2020,
        comments: false,
      },
    },
    cssMinify: "lightningcss",
    cssCodeSplit: false,
    chunkSizeWarningLimit: 200,
    target: "es2020",
  },
  css: {
    transformer: "lightningcss",
    lightningcss: { minify: true },
  },
  esbuild: {
    treeShaking: true,
    target: "es2020",
  },
});
