import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/server.ts'],       // your entry file
    format: ['esm'],                // ESM output 
    outDir: 'dist',
    clean: true,                    // clear dist before build
    splitting: false,               // not needed for backend
    sourcemap: false,               // not needed in production
    external: [
        '@prisma/client',
        '../src/generated/prisma'     // custom prisma path
    ]
})