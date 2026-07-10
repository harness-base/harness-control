# api 测试用例：<主题>

> api 用例对接口来源（契约 / 指定源）的**一一对应**覆盖。本表只管"用例齐不齐、覆盖全不全"，**不管"过没过"**（执行结果另起一段机制）。
> 流程见 `docs/harness/testing-flow-api.md`（testing-flow 总纲的 api 分线）；由 `hc-api-qa` 写、`hc-api-reviewer` 审。产物落 `docs/test-cases/<id>/test-cases.md`，登记 `docs/test-cases/index.yaml`。
>
> **接口来源（硬地板，与 e2e「缺则略」不同——api 无源即停）**：优先级 ① `docs/designs/<id>/api-contract.md`（`hc-tech-design` 产的接口契约）＞ ② 用户指定源（proto / OpenAPI / 路由表 / 现有接口代码）＞ ③ 都没有 → **MUST STOP**：由 `hc-api-qa` 交回总监提醒用户"没接口来源、无法确定测什么"，绝不凭空臆造接口（rule-0008）。
>
> **协议无关、源驱动**：协议（gRPC / HTTP-REST / MQ-event）、鉴权 / 限流等横切、Mock、字段、错误码——全按接口来源里**实际有什么**来覆盖；不硬编任何项目假设（"必须测鉴权""一定是 gRPC"都不行，rule-0015）。契约有 Mock 就用契约 Mock、没有不硬凑。
>
> **api 特性（一一对应，核心）**：接口来源 = 一份「接口清单」（协议无关）+ 每接口列举的「业务异常」（契约各接口的错误响应表）。① 契约每个接口都要有对应用例、全覆盖；② 单接口列的每个业务异常各覆盖一个 case。机检 `test-cases-audit` **双向闭合**：契约接口 / 业务异常 ↔ 用例，缺一个红、引用契约里没有的（臆造）也红。预期锚契约字段的类型 / 约束（rule-0009）——成功逐字段断言、失败断业务异常码且**受控**。
>
> **格式契约（硬闸 `test-cases-audit` 按此解析，照写勿改）**：① 段标题**承重**——EP 声明只在以「接口清单」起始的 `## ` 段内识别、EX 声明只在以「业务异常」起始的 `## ` 段内识别、`covers:` 只在以「用例」/「测试用例」起始的 `## ` 段内识别；写到别处（含围栏代码块）一律**不算**。② EP / EX 声明**一行一个 id**：`- EP-NN：…`（id 紧跟 `- `、紧接冒号）/ `- EX-NN：EP-NN · …`；单行多 id（`- EP-1, EP-2：`）、id 前加文字（`- 接口: EP-2`）、括注都会被判红。③ `covers:` 须**写单行**（`- covers: EP-1, EX-1`），勿折行（covers 行内任意分隔的 id 都会被收）。解析严格 + fail-closed：模糊一律红，不静默放行。

## 接口清单

> 声明段①：从契约「端点索引」誊录（协议无关），每行一个稳定 id `EP-NN`，一一对应契约里的一个接口。**这是覆盖广度的地板**——契约每个接口都要在此声明、且被 ≥1 用例 covers。
> 格式：`- EP-NN：<协议> <method/rpc/topic> <目标> — <用途>`（EP-NN 紧跟 dash、紧接冒号）。协议列取值：HTTP-REST / gRPC / MQ-event / async。

- EP-1：HTTP-REST GET `/v1/items` — 分页列出资源（占位示例，誊录自契约端点索引）<!-- 示例，按契约替换 -->
- EP-2：HTTP-REST POST `/v1/items` — 创建一个资源（占位示例，誊录自契约端点索引）

## 业务异常

> 声明段②：从契约**各接口错误响应表**（= 业务异常列举）誊录，每行一个稳定 id `EX-NN`，绑到它所属的 `EP-NN`。**只誊录契约里约定内的错误**（业务码 / 校验码 / 约定服务态），契约没列的别臆造（臆造会被机检判红）。
> 格式：`- EX-NN：EP-NN · <错误码 / 状态> — <含义 / 触发>`。

- EX-1：EP-1 · 400 `INVALID_QUERY` — 查询参数非法（`page`/`page_size` 越界或 `status` 非枚举）<!-- 示例，对齐 api-contract 错误表 -->
- EX-2：EP-1 · 401 `UNAUTHENTICATED` — 未认证（缺 token 或失效）
- EX-3：EP-1 · 403 `FORBIDDEN` — 无权限（已认证但无权访问该集合）
- EX-4：EP-2 · 422 `VALIDATION_FAILED` — 字段校验不通过（`name` 缺失 / 超长 / 空白，或 `status` 非枚举）
- EX-5：EP-2 · 409 `CONFLICT` — 资源冲突（同集合内 `name` 已存在）
<!-- hc-api-qa：契约里每接口错误表的每一条业务异常都要在此声明一条 EX（如 EP-2 还有 401/403、约定服务态 503 DB_UNAVAILABLE 则一并誊录）；契约没列的别加。 -->

## 用例

> 每条用例一个稳定 id `TC-n`，用 `covers:` 声明它一一对应覆盖哪个 EP / EX。
> **`covers:` 是覆盖关系的唯一真相源**——硬闸（`test-cases-audit`）据此双向核闭合：每个 EP / 每个 EX 都被 ≥1 用例覆盖（一一对应）、且 covers 不引用未声明的 EP / EX（不臆造）。`covers:` 必须写**单行**。成功 / 边界用例 covers 其 `EP-NN`；失败用例 covers 对应 `EX-NN`。
> 每条字段：covers / 接口(EP) / 类型（正常·边界·异常 + 等价类标注）/ 请求参数（标等价类 · 边界值）/ 预期（成功=逐字段响应 + 状态断言锚契约字段类型/约束 rule-0009；失败=业务异常码断言、受控）/ 数据来源（契约 Mock 或指定源）。

### TC-1：列出资源成功返回分页数据 <!-- 示例：成功用例，covers EP，逐字段断言 -->
- covers: EP-1
- 接口(EP)：EP-1（HTTP-REST GET `/v1/items`）
- 类型：正常（等价类：合法查询——`page`/`page_size` 在界内、`status` 为枚举或不传）
- 请求参数：`page=1`、`page_size=20`、`status=active`（属"合法查询"等价类的代表值）
- 预期（成功·逐字段）：`200 OK`；响应体 `data` 为数组（0–`page_size` 元素），每元素 `id` 匹配 `itm_` + 4 位数字、`name` 长度 1–64、`status` ∈ {`active`,`archived`}、`created_at` 为 ISO-8601 UTC；`meta.total` ≥0、`meta.page`=1、`meta.page_size`=20。逐字段锚契约字段类型 / 约束（rule-0009），不只断状态码。
- 数据来源：契约 GET `/v1/items` 的 200 Mock 样例（`itm_0001`/`itm_0002`）。

### TC-2：查询参数越界受控报错 <!-- 示例：失败用例，covers EX，断业务异常码且受控 -->
- covers: EX-1
- 接口(EP)：EP-1（HTTP-REST GET `/v1/items`）
- 类型：异常（等价类：非法查询——`page_size` 超出 1–100 上界）
- 请求参数：`page=1`、`page_size=101`（属"非法查询"等价类的代表值，越 `page_size` 上界）
- 预期（失败·受控）：`400`，业务码 `INVALID_QUERY`；响应走统一错误外壳 `{ code, message }`。断"业务异常码 = 契约约定值 + 受控 4xx"，**不崩、无裸 5xx**；不锚 `message` 文案。
- 数据来源：契约 GET `/v1/items` 错误表（400 `INVALID_QUERY` 触发条件：`page_size` 越界）。

### TC-3：page_size 取上界边界值 <!-- 示例：边界用例，covers EP，标边界值 -->
- covers: EP-1
- 接口(EP)：EP-1（HTTP-REST GET `/v1/items`）
- 类型：边界（边界值：`page_size=100` = 约束 1–100 的上界；对照另设 101=上界+1 归 TC-2 异常）
- 请求参数：`page=1`、`page_size=100`（= 契约约束 `page_size` 的上界合法值）
- 预期（成功·逐字段）：`200 OK`；`data` 元素数 ≤ 100（不超 `page_size`），`meta.page_size`=100；字段结构同 TC-1 逐字段断言（锚契约约束 rule-0009）。边界内应正常返回、不报错。
- 数据来源：契约 GET `/v1/items` 的 200 Mock 样例 + `page_size` 约束（1–100）。

<!-- ↑ 以上三条为「列表接口」示例（成功 covers EP-1 / 失败 covers EX-1 / 边界 covers EP-1）。hc-api-qa：照此为契约每个 EP 补成功 + 边界、为每个 EX 补对应失败用例，删掉占位、按真实 EP/EX 重填 covers。 -->

> 提示：**一一对应 = 每个 EP、每个 EX 都要有 case**——契约每个接口至少一条成功用例覆盖其 EP，契约每条业务异常至少一条失败用例覆盖其 EX；covers 只引用上方已声明的 EP/EX，不臆造契约里没有的接口 / 错误码（覆盖真不真够、忠不忠于源由 `hc-api-reviewer` + eval 考题 015 判）。
