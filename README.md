# LocalLoop Travel Web

LocalLoop 客户端前端，通过 `travel-api` 完成注册、登录、目录浏览、行程草稿和订单流程。

## 前端技术栈

- React 19、TypeScript、Vite 7 和 React Router 7。
- TanStack React Query 管理服务端状态。
- Tailwind CSS 4 与 CSS Variables 管理响应式布局和语义设计令牌。
- 项目内 `src/components/ui` 维护基础 UI；Radix UI 提供复杂交互的无障碍行为。
- React Hook Form + Zod 管理表单状态和校验。
- Lucide React 提供图标，Manrope Variable 由前端自托管。
- Vitest + Testing Library 覆盖逻辑和 UI 模块。

样式入口为 `src/styles/app.css`。颜色、字体、圆角和阴影统一定义在 `src/styles/tokens.css`；页面不应新增硬编码品牌颜色。

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
- 酒店列表、筛选、详情、房型和房价方案。
- 地陪列表、筛选、档案、服务和连续小时档期。
- 本地持久化行程草稿及目录价格预览。
- 创建、查询、倒计时和取消订单；当前不会发起支付。
- 桌面导航与移动端抽屉导航，支持安全区和减少动画偏好。
