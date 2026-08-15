# DSH Browser CDP Plugin

一个面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的浏览器读取插件。它注册 `browser_read_page` 工具，通过 Chrome DevTools Protocol（CDP）在专用 Chrome 会话中打开网页并返回可见正文。

默认只允许访问 `joyspace.jd.com`，避免模型使用已登录浏览器任意访问其他站点。页面正文会作为不可信内容返回，且默认最多读取 20,000 个字符。

## 1. 启动专用 Chrome

现代 Chrome 要求远程调试使用独立的用户数据目录。macOS：

```bash
open -na "Google Chrome" --args \
  --remote-debugging-port=9222 \
  --user-data-dir="$HOME/.dsh-browser-profile"
```

在新窗口中登录 JoySpace。这个目录只供 DSH 使用，不会接管日常 Chrome 会话。

验证 CDP 是否可用：

```bash
curl http://127.0.0.1:9222/json/version
```

## 2. 安装插件

```bash
dsh plugin --profile demo add github:ookami-change/dsh-plugin-starter
dsh --profile demo --dump-config
dsh --profile demo
```

## 3. 使用

向 DSH 输入：

```text
打开并读取 https://joyspace.jd.com/pages/4TorcK3QJQYVxJiGVydy
```

模型会调用：

```json
{
  "url": "https://joyspace.jd.com/pages/4TorcK3QJQYVxJiGVydy"
}
```

工具还支持：

- `selector`：仅读取指定 CSS 节点。
- `wait_ms`：页面加载后额外等待 0–10,000 毫秒，适合 SPA。
- `max_chars`：返回 1–100,000 个字符。

## 配置

编辑 profile 中对应的 Cordis patch，或修改本仓库的 `cordis.patch.yml`：

```yaml
- insert:
    - id: browser-cdp
      name: dsh-plugin-starter
      config:
        cdpEndpoint: http://127.0.0.1:9222
        allowedHosts:
          - joyspace.jd.com
          - '*.example.com'
        navigationTimeoutMs: 30000
        waitAfterLoadMs: 1500
        maxChars: 20000
```

通配规则 `*.example.com` 只匹配子域名，不匹配 `example.com` 本身；不接受全局 `*`。

## 安全边界

- 仅支持 `http` / `https` URL。
- 拒绝 URL 中嵌入的用户名和密码。
- 导航前后都检查域名白名单，阻止跳转到未授权站点。
- 每次调用新建并关闭一个标签页，不修改已有标签页。
- 插件能读取专用 Chrome 会话已登录站点的内容；只应把可信域名加入白名单。

## 开发验证

```bash
npm install
npm test
```
