# 图片素材授权与替换清单

当前项目已按用户确认，将爱奇艺《种地吧》官方页面相关素材和公开成员照片页素材下载为本地 WebP 并接入页面。此前临时接入的 Unsplash 真人田野素材已撤销。

## 当前已接入素材

| 用途 | 本地文件 | 状态 | 来源页面 | 说明 |
| --- | --- | --- | --- | --- |
| 首页首屏桌面群像 | `public/images/hero/iqiyi-zdb-group-hero.webp` | approved | https://www.iqiyi.com/kszt/1gr1a168fhq.html | 十个勤天十位成员群像，1920×1080 |
| 首页首屏移动端群像 | `public/images/hero/iqiyi-zdb-group-hero-mobile.webp` | approved | https://www.iqiyi.com/kszt/1gr1a168fhq.html | 竖版适配图，保留完整群像 |
| 活动封面 | `public/images/activities/iqiyi-zdb-ep50.webp` | approved | https://www.iqiyi.com/kszt/1gr1a168fhq.html | 第50期相关群像缩略图 |
| 活动封面 | `public/images/activities/iqiyi-zdb-wheat-gaze.webp` | approved | https://www.iqiyi.com/kszt/1gr1a168fhq.html | 麦田/收割机相关节目画面 |
| 音乐活动封面 | `public/images/activities/iqiyi-zdb-ep49.webp` | approved | https://www.iqiyi.com/kszt/1gr1a168fhq.html | 第49期合唱相关缩略图 |
| 巡演活动封面 | `public/images/activities/tour-2026-xiamen.webp` | approved | https://www.sina.cn/news/detail/5314394634062485.html | 十个勤天 2026《贰零贰贰》巡回演唱会主视觉 |
| 巡演活动封面 | `public/images/activities/tour-2026-guangzhou.webp` | approved | https://www.sina.cn/news/detail/5315572435782110.html | 十个勤天 2026《贰零贰贰》巡回演唱会主视觉 |
| 单人活动封面 | `public/images/activities/event-luzhuo-shanghai.webp` | approved | https://www.sina.cn/news/detail/5306770928960584.html | 鹭卓个人巡演上海站封面，使用本地成员图适配 |
| 单人活动封面 | `public/images/activities/event-ligengyun-birthday.webp` | approved | https://www.sina.cn/news/detail/5308569403786017.html | 李耕耘 2026 生日会海报 |
| 单人活动封面 | `public/images/activities/event-lihao-hongkong.webp` | approved | https://www.sina.cn/news/detail/5307855005811069.html | 李昊香港演唱会海报 |
| 单人活动封面 | `public/images/activities/event-hehaonan-july.webp` | approved | https://www.sina.cn/news/detail/5315504470496812.html | 何浩楠 2026 年 7 月行程图 |
| 音乐节封面 | `public/images/activities/event-ola-chongqing.webp` | approved | https://www.sina.cn/news/detail/5310083535735675.html | 重庆哦啦音乐节 7 月 12 日阵容图 |
| 成员动态封面 | `public/images/news/iqiyi-zdb-first-photo.webp` | approved | https://www.iqiyi.com/kszt/1gr1a168fhq.html | 十个勤天复刻首张合影相关缩略图 |
| 社区精选封面 | `public/images/news/iqiyi-zdb-wheat-vlog.webp` | approved | https://www.iqiyi.com/kszt/1gr1a168fhq.html | 小麦丰收 vlog 相关缩略图 |
| 成员 01-10 个人介绍照片 | `public/images/members/member-01.webp` 至 `member-10.webp` | approved | 详见 `src/data/imageSources.ts` | 十位成员各自独立照片，统一压缩为 WebP 和 4:5 比例 |
| 食堂卡片品类封面（7 张） | `public/images/canteen/covers/canteen-cover-*.webp` | generated | OpenAI ImageGen，本项目生成 | 家常、鲜蔬海味、烧烤、火锅、主食、甜品和西式简餐的通用品类示意图；不是具体餐厅实拍，页面必须保留“品类示意”标识 |

完整来源台账见 `src/data/imageSources.ts`。

## 仍使用占位图的位置

| 用途 | 当前文件 | 状态 | 说明 |
| --- | --- | --- | --- |
| 图片加载失败占位 | `public/images/placeholders/image-fallback.webp` | placeholder | 图片加载失败时使用 |
| 纸张纹理 | `public/images/textures/paper-grain.webp` | placeholder | 本地生成纹理 |

## 仍需用户确认授权的候选素材

| 候选来源 | 版权方/发布方 | 建议用途 | 替换路径 | 当前处理 |
| --- | --- | --- | --- | --- |
| https://weibo.com/a/hot/7643477903415299_1.html?type=new | 十个勤天官方微博或原发布账号 | 首页十位成员官方群像或成员资料照 | `public/images/hero/group-portrait-official.webp`、`public/images/members/member-*.webp` | 微博公开发布不等于允许下载接入独立网站；未按本次“爱奇艺”确认范围下载 |
| 小红书十个勤天相关笔记 | 原笔记作者、平台或官方账号 | 成员资料照、活动图、粉丝记录图 | 按具体授权文件替换到对应目录 | 当前小红书网页搜索未稳定获得可批量下载原图地址；若后续提供具体链接或素材文件，可继续替换 |

## 替换规则

1. 后续新增用户提供的授权图，先转换为 WebP。
2. 首页群像宽度建议不超过 1920px，移动端单独提供竖版适配图。
3. 成员照片统一替换 `public/images/members/member-01.webp` 至 `member-10.webp`。
4. 替换后同步更新 `src/data/imageSources.ts` 中对应记录的 `status`、`originalSourcePage`、`publisherOrRightsHolder` 和 `licenseNote`。
5. 未确认授权前，不把候选真人照片改为 `approved`。
