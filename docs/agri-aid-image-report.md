# 助农事件图片处理报告

更新日期：2026-07-13

## 当前结论

- 事件总数：36。
- 已建立图片元数据：36 / 36。
- 右侧摘要已有图片：36 / 36，不再使用 SVG 插画作为事件头图。
- 公开报道图片：5 张，均保存为 WebP、宽度不超过 1200px，并在卡片中保留来源入口。
- 用户提供的事件资料图：31 个节点；这些图片标记为“用户提供资料图”，不会冒充独立新闻现场图。
- 加载失败时显示“事件图片待补充”，不会回退到无关群像、麦田图或插画。

## 已导入的公开报道图片

| 本地文件 | 用途 | 来源 | 匹配等级 |
|---|---|---|---|
| `public/assets/agri-aid/events/2023-jinyun-live.webp` | 缙云直播助农 | [360 娱乐公开报道](https://yule.360.com/detail/3411546) | exact |
| `public/assets/agri-aid/events/2025-rikaze-relief.webp` | 日喀则冬衣捐赠 | [中国乡村发展基金会](https://www.cfrd.org.cn/news/news_detail.aspx?articleid=4448) | contextual |
| `public/assets/agri-aid/events/2025-nangqian-saltfield.webp` | 囊谦盐农打开销路 | [囊谦县人民政府](https://www.nangqian.gov.cn/index.php?c=show&id=8757) | contextual |
| `public/assets/agri-aid/events/2026-qiele-jujube-live.webp` | 策勒红枣直播 | [中新网新疆](https://www.xj.chinanews.com.cn/dizhou/2026-04-18/detail-ihfcqyyi3995813.shtml) | exact |
| `public/assets/agri-aid/events/2026-qiele-orchard.webp` | 策勒红枣产地 | [中新网新疆](https://www.xj.chinanews.com.cn/dizhou/2026-04-18/detail-ihfcqyyi3995813.shtml) | contextual |

## 用户提供资料图

其余节点读取 `public/images/agri-aid/crops/` 下的一一对应资料图。完整映射、来源类型、匹配等级和备注统一维护在：

`src/data/agriAidImageSources.ts`

以下三个节点暂时只有同类型或同地区资料图，仍建议后续替换为独立现场图：

- 2025.02.05 赵小童向青少年基金会捐款。
- 2025.03.10 娘拉乡水培大棚。
- 2026.04.07 禾伙人向民勤基地捐赠苏打水。

## 使用规则

- `exact`：图片明确来自对应事件或同一场活动报道。
- `contextual`：图片与地点、农产品或行动类型相关，界面明确标注为资料图。
- `approved`：允许在当前原型中显示，并保留来源信息。
- 外部图片不去水印、不遮挡署名、不作为多个无关事件的通用头图。
- 新图片接入前先更新 `src/data/agriAidImageSources.ts`，不要在组件中硬编码路径。
