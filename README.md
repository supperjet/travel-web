# LocalLoop Travel Web

LocalLoop 客户端前端，使用 React、Vite 和 TypeScript，并通过 `travel-api` 完成注册、登录和订单流程。

## 本地开发

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。Vite 会将 `/api`、`/v1`、`/health` 和 `/ready` 代理到测试 API，浏览器因此可以使用同源 Session Cookie。

默认目标为 `https://travel-api-test.chou-test.workers.dev`。需要切换时复制 `.env.example` 为 `.env.local`，修改 `VITE_API_TARGET`。

## 可用命令

- `npm run dev`：在 3000 端口启动本地开发服务器。
- `npm run typecheck`：运行 TypeScript 类型检查。
- `npm test`：运行 Vitest 测试。
- `npm run build`：生成生产构建到 `dist`。
- `npm run check`：依次执行类型检查、测试和生产构建。

## 当前范围

- 注册、登录、退出。
- 读取 `/v1/me` 并展示客户资料和角色。
- 未登录用户的路由保护。
- 酒店、地陪和订单页面将在下一阶段接入。
