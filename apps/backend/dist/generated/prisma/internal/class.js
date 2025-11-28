"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.0.1",
    "engineVersion": "f09f2815f091dbba658cdcd2264306d88bb5bda6",
    "activeProvider": "postgresql",
    "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = \"prisma-client\"\n  output   = \"../generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  PENDING\n  BLOCKED\n}\n\nmodel User {\n  id         String     @id @default(uuid())\n  email      String     @unique\n  name       String?\n  password   String\n  created_at DateTime   @default(now())\n  updated_at DateTime   @updatedAt\n  status     UserStatus @default(PENDING)\n  bookmarks  Bookmark[]\n\n  @@index([email])\n  @@index([id])\n  @@index([status])\n  @@map(\"users\")\n}\n\nmodel Bookmark {\n  id          String   @id @default(cuid())\n  url         String   @unique\n  title       String\n  description String?\n  tags        Tag[]\n  user_id     String\n  user        User     @relation(fields: [user_id], references: [id])\n  embedding   Json?\n  created_at  DateTime @default(now())\n\n  @@index([url])\n  @@index([id])\n  @@index([user_id])\n  @@index([created_at])\n  @@map(\"bookmarks\")\n}\n\nmodel Tag {\n  id         String     @id @default(cuid())\n  name       String     @unique\n  bookmarks  Bookmark[]\n  created_at DateTime   @default(now())\n\n  @@index([name])\n  @@index([id])\n  @@map(\"tags\")\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"UserStatus\"},{\"name\":\"bookmarks\",\"kind\":\"object\",\"type\":\"Bookmark\",\"relationName\":\"BookmarkToUser\"}],\"dbName\":\"users\"},\"Bookmark\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"url\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tags\",\"kind\":\"object\",\"type\":\"Tag\",\"relationName\":\"BookmarkToTag\"},{\"name\":\"user_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BookmarkToUser\"},{\"name\":\"embedding\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"bookmarks\"},\"Tag\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"bookmarks\",\"kind\":\"object\",\"type\":\"Bookmark\",\"relationName\":\"BookmarkToTag\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"tags\"}},\"enums\":{},\"types\":{}}");
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await Promise.resolve().then(() => __importStar(require('node:buffer')));
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await Promise.resolve().then(() => __importStar(require("@prisma/client/runtime/query_compiler_bg.postgresql.js"))),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await Promise.resolve().then(() => __importStar(require("@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.js")));
        return await decodeBase64AsWasm(wasm);
    }
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map