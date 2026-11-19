(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) n(o);
  new MutationObserver((o) => {
    for (const i of o)
      if (i.type === "childList")
        for (const c of i.addedNodes)
          c.tagName === "LINK" && c.rel === "modulepreload" && n(c);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(o) {
    const i = {};
    return (
      o.integrity && (i.integrity = o.integrity),
      o.referrerPolicy && (i.referrerPolicy = o.referrerPolicy),
      o.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : o.crossOrigin === "anonymous"
          ? (i.credentials = "omit")
          : (i.credentials = "same-origin"),
      i
    );
  }
  function n(o) {
    if (o.ep) return;
    o.ep = !0;
    const i = s(o);
    fetch(o.href, i);
  }
})();
const Vn = {
  "다시 시도해 주세요.": {
    en: "Please try again.",
    ja: "もう一度お試しください。",
    "zh-CN": "请重试。",
  },
  "정리 완료": { en: "Organized", ja: "整理完了", "zh-CN": "整理完成" },
  되돌림: { en: "Undone", ja: "取り消し済み", "zh-CN": "已撤销" },
  실패: { en: "Failed", ja: "失敗", "zh-CN": "失败" },
  "확인 필요": { en: "Needs attention", ja: "確認が必要", "zh-CN": "需要确认" },
  "확인 중": { en: "Checking", ja: "確認中", "zh-CN": "正在检查" },
  "복원 확인 중": {
    en: "Checking restore",
    ja: "復元を確認中",
    "zh-CN": "正在检查恢复",
  },
  "이동 안 됨": { en: "Not moved", ja: "未移動", "zh-CN": "未移动" },
  화분: { en: "Pot", ja: "植木鉢", "zh-CN": "花盆" },
  "/ 25 성장": { en: "/ 25 growth", ja: "/ 25 成長", "zh-CN": "/ 25 成长" },
  "연결 대기": { en: "Not connected", ja: "未接続", "zh-CN": "未连接" },
  "{1} 화분 설정": {
    en: "{1} pot settings",
    ja: "{1} の植木鉢設定",
    "zh-CN": "{1} 花盆设置",
  },
  "폴더를 연결해 주세요": {
    en: "Connect a folder",
    ja: "フォルダーを接続してください",
    "zh-CN": "请关联文件夹",
  },
  "파일 정리": {
    en: "Organize files",
    ja: "ファイルを整理",
    "zh-CN": "整理文件",
  },
  "폴더 연결": {
    en: "Connect folder",
    ja: "フォルダーを接続",
    "zh-CN": "关联文件夹",
  },
  "나의 창틀": { en: "My windowsill", ja: "私の窓辺", "zh-CN": "我的窗台" },
  "정돈된 파일 하나, 자라나는 초록 한 칸.": {
    en: "One tidy file, a little more green.",
    ja: "ファイルをひとつ整理して、緑をひとつ。",
    "zh-CN": "整理一个文件，增添一抹绿意。",
  },
  "작은 정원이 자라고 있어요": {
    en: "Your little garden is growing",
    ja: "小さな庭が育っています",
    "zh-CN": "小花园正在成长",
  },
  "조금씩 정리하고,": {
    en: "Tidy a little,",
    ja: "少しずつ整えて、",
    "zh-CN": "整理一点，",
  },
  "천천히 자라는 하루.": {
    en: "grow a little every day.",
    ja: "ゆっくり育つ毎日。",
    "zh-CN": "每天慢慢成长。",
  },
  "당신이 돌보는 작은 습관이": {
    en: "The small habits you nurture",
    ja: "あなたの小さな習慣が",
    "zh-CN": "你用心坚持的小习惯，",
  },
  "이곳에서는 초록으로 남아요.": {
    en: "leave a little green here.",
    ja: "ここでは緑になります。",
    "zh-CN": "在这里变成绿意。",
  },
  "함께한 지": { en: "Together for", ja: "一緒に過ごして", "zh-CN": "已陪伴" },
  "{3}일": { en: "{3} days", ja: "{3}日", "zh-CN": "{3}天" },
  "문서·사진·보관 식물이 자라는 도트 창틀": {
    en: "Pixel windowsill with growing file plants",
    ja: "ファイルの植物が育つドット絵の窓辺",
    "zh-CN": "文件植物成长的像素窗台",
  },
  "나의 화분": { en: "My pots", ja: "私の植木鉢", "zh-CN": "我的花盆" },
  "파일을 놓아 정리하세요": {
    en: "Drop files to organize",
    ja: "ファイルを置いて整理",
    "zh-CN": "拖入文件即可整理",
  },
  "오늘의 작은 정리": {
    en: "A little tidying today",
    ja: "今日の小さな整理",
    "zh-CN": "今日的小整理",
  },
  "개의 파일이 제자리를 찾았어요": {
    en: "files found their place",
    ja: "個のファイルが所定の場所に",
    "zh-CN": "个文件找到了自己的位置",
  },
  "정리 기록 보기 {14}": {
    en: "View activity {14}",
    ja: "整理履歴を見る {14}",
    "zh-CN": "查看整理记录 {14}",
  },
  "데스크톱에 띄우기": {
    en: "Show on desktop",
    ja: "デスクトップに表示",
    "zh-CN": "显示在桌面",
  },
  "파일을 아래 화분에 놓으면, 연결된 폴더로 정리할 수 있어요.": {
    en: "Drop files on a pot below to organize them into its folder.",
    ja: "下の植木鉢にファイルを置くと、接続先のフォルダーに整理できます。",
    "zh-CN": "将文件拖入下方花盆，即可整理到关联文件夹。",
  },
  "체험 정원이에요. 샘플 파일로 성장과 되돌리기를 경험해 보세요.": {
    en: "This is a demo garden. Try growth and undo with sample files.",
    ja: "体験用の庭です。サンプルで成長と取り消しを試せます。",
    "zh-CN": "这是体验花园。可用示例文件体验成长与撤销。",
  },
  "오늘의 성장을 모두 받았어요. 정리는 계속할 수 있어요.": {
    en: "You have earned all growth for today. Keep tidying if you like.",
    ja: "今日の成長分は獲得済みです。整理は続けられます。",
    "zh-CN": "已获得今日全部成长值，仍可继续整理。",
  },
  "하루 열 번의 정리가 작은 성장으로 이어져요.": {
    en: "Your first ten tidy-ups each day help the garden grow.",
    ja: "1日10回の整理が小さな成長につながります。",
    "zh-CN": "每天前十次整理会带来小小的成长。",
  },
  "정리 기록": { en: "Activity", ja: "整理履歴", "zh-CN": "整理记录" },
  "어디로 옮겼는지, 언제 자랐는지.": {
    en: "Where your files went, and when your garden grew.",
    ja: "移動先と成長の記録。",
    "zh-CN": "记录文件去向与花园成长。",
  },
  "최근 정리": { en: "Recent activity", ja: "最近の整理", "zh-CN": "最近整理" },
  "최대 200개 표시 · 로컬 기록": {
    en: "Up to 200 entries · stored locally",
    ja: "最大200件 · ローカル履歴",
    "zh-CN": "最多200条 · 本地记录",
  },
  "상태 다시 확인": {
    en: "Recheck status",
    ja: "状態を再確認",
    "zh-CN": "重新检查状态",
  },
  "{2} 화분 · {3}": {
    en: "{2} pot · {3}",
    ja: "{2} の植木鉢 · {3}",
    "zh-CN": "{2} 花盆 · {3}",
  },
  "경로와 상태 보기": {
    en: "View paths and status",
    ja: "パスと状態を見る",
    "zh-CN": "查看路径和状态",
  },
  "원래 위치: {4}": {
    en: "Original location: {4}",
    ja: "元の場所: {4}",
    "zh-CN": "原位置：{4}",
  },
  "정리 당시 위치: {5}": {
    en: "Location after organizing: {5}",
    ja: "整理時の場所: {5}",
    "zh-CN": "整理时的位置：{5}",
  },
  되돌리기: { en: "Undo", ja: "取り消す", "zh-CN": "撤销" },
  "아직 정리한 파일이 없어요": {
    en: "No files organized yet",
    ja: "まだ整理したファイルはありません",
    "zh-CN": "尚未整理文件",
  },
  "화분에 파일을 놓으면 첫 번째 기록이 남아요.": {
    en: "Drop a file on a pot to start your first record.",
    ja: "植木鉢にファイルを置くと、最初の履歴が残ります。",
    "zh-CN": "将文件拖入花盆，开始第一条记录。",
  },
  "나의 창틀로": {
    en: "Go to my windowsill",
    ja: "私の窓辺へ",
    "zh-CN": "返回我的窗台",
  },
  "창틀 꾸미기": {
    en: "Appearance & settings",
    ja: "窓辺の設定",
    "zh-CN": "外观与设置",
  },
  "오래 바라보고 싶은, 나만의 작은 자리.": {
    en: "A little space that feels like you.",
    ja: "ずっと眺めたくなる、自分だけの場所。",
    "zh-CN": "让你愿意驻足的小天地。",
  },
  "검색 결과": { en: "Search results", ja: "検索結果", "zh-CN": "搜索结果" },
  "페이지당 파일 수": {
    en: "Files per page",
    ja: "1ページのファイル数",
    "zh-CN": "每页文件数",
  },
  "관리 폴더 전체 검색에 적용해요. 개수를 바꾸면 첫 페이지부터 보여요.": {
    en: "Applies to searches across the managed folder. Changing this returns to page one.",
    ja: "管理フォルダー全体の検索に適用します。変更すると1ページ目に戻ります。",
    "zh-CN": "适用于管理文件夹内的搜索。更改后返回第一页。",
  },
  "앱 폰트": { en: "App font", ja: "アプリのフォント", "zh-CN": "应用字体" },
  "TTF·OTF·WOFF·WOFF2 · 최대 20MB. 이 기기의 앱에만 보관해요. 없는 글자는 기본 폰트로 표시해요. 개인 설정 폰트가 테마 폰트보다 우선하며, 되돌리면 현재 테마 폰트(없으면 기본 폰트)를 사용해요.":
    {
      en: "TTF, OTF, WOFF or WOFF2 · up to 20 MB. Stored on this device only. Missing glyphs use the default font. Your font overrides theme fonts; resetting restores the theme font, or the default if none.",
      ja: "TTF・OTF・WOFF・WOFF2、最大20MB。この端末だけに保存します。未対応文字は標準フォントで表示します。個人フォントがテーマより優先され、リセットするとテーマのフォント、なければ標準に戻ります。",
      "zh-CN":
        "TTF、OTF、WOFF、WOFF2，最大20MB。仅保存在本设备，缺失字符使用默认字体。个人字体优先于主题字体；重置后使用主题字体，没有则使用默认字体。",
    },
  "가나다 작은 창틀 · ABC abc · 0123456789": {
    en: "Little Windowsill · ABC abc · 0123456789",
    ja: "小さな窓辺 · ABC abc · 0123456789",
    "zh-CN": "小小窗台 · ABC abc · 0123456789",
  },
  "화분 바로가기": {
    en: "Pot shortcuts",
    ja: "植木鉢のショートカット",
    "zh-CN": "花盆快捷入口",
  },
  "화분은 1~3개만 표시해요. 개수에 맞춰 선반과 작은 창의 폭도 바뀌고, 직접 조절한 크기는 개수별로 기억해요. 숨긴 화분과 연결되지 않은 폴더도 자동 관리는 계속돼요.":
    {
      en: "Show 1–3 pots. The shelf and widget width adapt, and custom sizes are remembered per pot count. Hidden pots and other managed folders keep being monitored.",
      ja: "表示は1～3鉢。数に合わせて棚と小窓の幅が変わり、手動のサイズも鉢数ごとに保存します。非表示の鉢や他の管理フォルダーも監視を続けます。",
      "zh-CN":
        "可显示1至3个花盆。花架和小窗宽度随数量调整，并分别记住自定义尺寸。隐藏的花盆及其他管理文件夹仍会自动管理。",
    },
  "표시할 화분 수": {
    en: "Number of visible pots",
    ja: "表示する植木鉢の数",
    "zh-CN": "显示花盆数量",
  },
  "창밖의 분위기": {
    en: "Garden atmosphere",
    ja: "窓の外の雰囲気",
    "zh-CN": "窗外氛围",
  },
  "정원 미리보기와 데스크톱 창틀에 적용해요.": {
    en: "Applies to the garden preview and desktop windowsill.",
    ja: "庭のプレビューとデスクトップの窓辺に適用します。",
    "zh-CN": "应用于花园预览和桌面窗台。",
  },
  "움직임 줄이기": {
    en: "Reduce motion",
    ja: "動きを減らす",
    "zh-CN": "减少动态效果",
  },
  "잎과 나비를 멈춰 더 차분하게 감상해요.": {
    en: "Keep leaves and butterflies still for a calmer view.",
    ja: "葉と蝶の動きを止め、落ち着いた眺めにします。",
    "zh-CN": "让叶子和蝴蝶静止，画面更安静。",
  },
  "작은 데스크톱 창틀": {
    en: "Desktop windowsill",
    ja: "デスクトップの小さな窓辺",
    "zh-CN": "桌面小窗台",
  },
  "작업하는 동안 화면 구석에 정원을 놓아두세요.": {
    en: "Keep a garden in the corner while you work.",
    ja: "作業中も画面の隅に庭を置けます。",
    "zh-CN": "工作时将花园放在屏幕角落。",
  },
  "처음처럼 둘러보기": {
    en: "Take the tour again",
    ja: "もう一度使い方を見る",
    "zh-CN": "重新浏览引导",
  },
  "파일 정리와 화분 성장을 다시 알아봐요.": {
    en: "Learn about organizing files and growing pots.",
    ja: "ファイル整理と植木鉢の成長を確認しましょう。",
    "zh-CN": "了解文件整理与花盆成长。",
  },
  "당신의 정원은 이 기기에 머물러요.": {
    en: "Your garden stays on this device.",
    ja: "あなたの庭はこの端末に保存されます。",
    "zh-CN": "你的花园保存在本设备。",
  },
  "프로토타입 v{14} · {15} · 수익화 기능 없음": {
    en: "Prototype v{14} · {15} · No paid features",
    ja: "試作版 v{14} · {15} · 課金機能なし",
    "zh-CN": "原型 v{14} · {15} · 无付费功能",
  },
  "{2}개": { en: "{2}", ja: "{2}個", "zh-CN": "{2}个" },
  "기본 폰트": { en: "Default font", ja: "標準フォント", "zh-CN": "默认字体" },
  "폰트 확인 중…": {
    en: "Checking font…",
    ja: "フォントを確認中…",
    "zh-CN": "正在检查字体…",
  },
  "폰트 파일 가져오기": {
    en: "Import font file",
    ja: "フォントファイルを取り込む",
    "zh-CN": "导入字体文件",
  },
  "기본 폰트로 되돌리기": {
    en: "Reset font",
    ja: "フォントをリセット",
    "zh-CN": "重置字体",
  },
  "폰트 파일 가져오기는 데스크톱 앱에서 사용할 수 있어요.": {
    en: "Font import is available in the desktop app.",
    ja: "フォントの取り込みはデスクトップアプリで利用できます。",
    "zh-CN": "字体导入功能可在桌面应用中使用。",
  },
  "초록빛 아침": { en: "Green morning", ja: "緑の朝", "zh-CN": "绿意清晨" },
  "푸른 저녁": { en: "Blue evening", ja: "青い夕暮れ", "zh-CN": "蓝色傍晚" },
  "따뜻한 낮": { en: "Warm afternoon", ja: "暖かな昼", "zh-CN": "温暖午后" },
  "창틀 열기": { en: "Open windowsill", ja: "窓辺を開く", "zh-CN": "打开窗台" },
  "사용 안내": { en: "Getting started", ja: "使い方", "zh-CN": "使用指南" },
  "폴더 연결과 정리 기록을 로컬 SQLite에 저장해요. 파일을 서버에 보내지 않아요.":
    {
      en: "Folder connections and activity are stored in local SQLite. Your files are not sent to a server.",
      ja: "フォルダー接続と整理履歴をローカルのSQLiteに保存します。ファイルはサーバーに送りません。",
      "zh-CN":
        "文件夹关联和整理记录保存在本地SQLite中，不会将文件发送到服务器。",
    },
  "브라우저 체험은 샘플 기록만 이 브라우저에 저장해요. 실제 파일은 이동하지 않아요.":
    {
      en: "The browser demo stores sample activity in this browser. No real files are moved.",
      ja: "ブラウザー体験はサンプル履歴だけをこのブラウザーに保存します。実際のファイルは移動しません。",
      "zh-CN": "浏览器体验仅保存示例记录，不会移动真实文件。",
    },
  "브라우저 체험": {
    en: "Browser demo",
    ja: "ブラウザー体験",
    "zh-CN": "浏览器体验",
  },
  "작은 창틀에 오신 걸 환영해요": {
    en: "Welcome to Little Windowsill",
    ja: "小さな窓辺へようこそ",
    "zh-CN": "欢迎来到小小窗台",
  },
  "파일을 정리하면,": {
    en: "As you organize files,",
    ja: "ファイルを整理すると、",
    "zh-CN": "整理文件，",
  },
  "당신의 창틀이 자라요.": {
    en: "watch your windowsill grow.",
    ja: "あなたの窓辺が育ちます。",
    "zh-CN": "看窗台慢慢成长。",
  },
  "화분마다 파일을 모아둘 폴더를 연결해요.": {
    en: "Connect each pot to a folder for your files.",
    ja: "植木鉢ごとにファイルを集めるフォルダーを接続します。",
    "zh-CN": "为每个花盆关联存放文件的文件夹。",
  },
  "파일을 놓고, 이동할 위치를 확인해요.": {
    en: "Drop files and check their destination.",
    ja: "ファイルを置き、移動先を確認します。",
    "zh-CN": "拖入文件并确认目标位置。",
  },
  "정리가 끝나면 식물이 조금씩 자라요.": {
    en: "Your plants grow a little after each tidy-up.",
    ja: "整理が終わると植物が少しずつ育ちます。",
    "zh-CN": "整理完成后，植物会慢慢成长。",
  },
  "자리를 비워도 시들지 않아요. 당신의 속도로 돌봐 주세요.": {
    en: "Your plants will not wilt while you are away. Go at your own pace.",
    ja: "留守でも枯れません。自分のペースで育ててください。",
    "zh-CN": "离开时植物也不会枯萎，按自己的节奏照顾即可。",
  },
  "먼저 둘러보기": {
    en: "Explore first",
    ja: "まず見てみる",
    "zh-CN": "先逛一逛",
  },
  "첫 화분 연결하기": {
    en: "Connect my first pot",
    ja: "最初の植木鉢を接続",
    "zh-CN": "关联第一个花盆",
  },
  "{0} 화분": { en: "{0} pot", ja: "{0} の植木鉢", "zh-CN": "{0} 花盆" },
  "성장 {2}점": {
    en: "Growth: {2}",
    ja: "成長 {2}ポイント",
    "zh-CN": "成长值：{2}",
  },
  "화분 이름": { en: "Pot name", ja: "植木鉢の名前", "zh-CN": "花盆名称" },
  "화분 이름은 1~12자로 입력해 주세요.": {
    en: "Enter a pot name of 1–12 characters.",
    ja: "鉢の名前は1〜12文字で入力してください。",
    "zh-CN": "请输入 1 至 12 个字符的花盆名称。",
  },
  "관리 중인 폴더로 바로가기 변경": {
    en: "Link to another managed folder",
    ja: "別の管理フォルダーに切り替える",
    "zh-CN": "切换至其他管理文件夹",
  },
  "관리 폴더 선택": {
    en: "Select managed folder",
    ja: "管理フォルダーを選択",
    "zh-CN": "选择管理文件夹",
  },
  "연결된 폴더": {
    en: "Connected folder",
    ja: "接続先フォルダー",
    "zh-CN": "已关联文件夹",
  },
  "화분은 빠른 접근을 위한 바로가기예요.": {
    en: "Pots are shortcuts for quick access.",
    ja: "植木鉢は素早くアクセスするためのショートカットです。",
    "zh-CN": "花盆是用于快速访问的快捷入口。",
  },
  "바로가기를 바꿔도 이전 폴더의 관리와 버전 이력은 유지돼요.": {
    en: "Changing a shortcut keeps the previous folder managed and preserves its versions.",
    ja: "切り替えても前のフォルダーの管理とバージョン履歴は残ります。",
    "zh-CN": "更改快捷入口后，原文件夹的管理和版本记录仍会保留。",
  },
  "다음 모습까지 {0}점 남았어요.": {
    en: "{0} points until the next stage.",
    ja: "次の姿まであと{0}ポイント。",
    "zh-CN": "距下一阶段还需{0}点。",
  },
  "꽃이 활짝 피었어요. 오늘도 잘 자랐네요.": {
    en: "Your flowers are in full bloom.",
    ja: "花が満開になりました。",
    "zh-CN": "花朵已盛开。",
  },
  "저장 중…": { en: "Saving…", ja: "保存中…", "zh-CN": "正在保存…" },
  "이름 저장": { en: "Save name", ja: "名前を保存", "zh-CN": "保存名称" },
  "아직 연결된 폴더가 없어요.": {
    en: "No folder connected yet.",
    ja: "まだフォルダーが接続されていません。",
    "zh-CN": "尚未关联文件夹。",
  },
  "폴더 열기": {
    en: "Open folder",
    ja: "フォルダーを開く",
    "zh-CN": "打开文件夹",
  },
  "폴더 다시 연결": {
    en: "Reconnect folder",
    ja: "フォルダーを接続し直す",
    "zh-CN": "重新关联文件夹",
  },
  "폴더 선택하기": {
    en: "Choose folder",
    ja: "フォルダーを選ぶ",
    "zh-CN": "选择文件夹",
  },
  "{0} 화분으로 정리": {
    en: "Organize with {0}",
    ja: "{0} の植木鉢で整理",
    "zh-CN": "通过{0}花盆整理",
  },
  "추천 위치와 작업 방식을 확인해 주세요.": {
    en: "Review the suggested destination and action.",
    ja: "おすすめの保存先と操作を確認してください。",
    "zh-CN": "请确认推荐位置和操作方式。",
  },
  "작업 방식": { en: "Action", ja: "操作方法", "zh-CN": "操作方式" },
  "복사 · 원본 유지": {
    en: "Copy · keep original",
    ja: "コピー · 元のファイルを残す",
    "zh-CN": "复制 · 保留原文件",
  },
  "이동 · 원래 위치에서 옮김": {
    en: "Move · change location",
    ja: "移動 · 元の場所から移す",
    "zh-CN": "移动 · 从原位置移出",
  },
  "실행 준비 완료": { en: "Ready", ja: "実行準備完了", "zh-CN": "准备就绪" },
  "목적지 폴더": {
    en: "Destination folder",
    ja: "保存先フォルダー",
    "zh-CN": "目标文件夹",
  },
  "직접 위치를 선택해 주세요": {
    en: "Choose a destination",
    ja: "保存先を選んでください",
    "zh-CN": "请选择目标位置",
  },
  "(관리 루트)": {
    en: "(Managed root)",
    ja: "(管理ルート)",
    "zh-CN": "（管理根目录）",
  },
  "· 추천": { en: "· Suggested", ja: "· おすすめ", "zh-CN": "· 推荐" },
  복사: { en: "Copy", ja: "コピー", "zh-CN": "复制" },
  이동: { en: "Move", ja: "移動", "zh-CN": "移动" },
  "선택 필요": { en: "Choose first", ja: "選択が必要", "zh-CN": "需要选择" },
  건너뜀: { en: "Skipped", ja: "スキップ", "zh-CN": "已跳过" },
  "이번 선택은 추천 학습에서 제외": {
    en: "Do not learn from this choice",
    ja: "この選択をおすすめの学習に使わない",
    "zh-CN": "本次选择不用于推荐学习",
  },
  "원본 내용을 먼저 보관해요. 같은 이름의 파일은 덮어쓰지 않아요.": {
    en: "Original content is saved first. Files with the same name are never overwritten.",
    ja: "元の内容を先に保管します。同名のファイルは上書きしません。",
    "zh-CN": "先保存原始内容，不会覆盖同名文件。",
  },
  "체험용 정리예요. 실제 파일에는 아무 변화가 없어요.": {
    en: "Demo only. Your real files will not change.",
    ja: "体験用です。実際のファイルは変わりません。",
    "zh-CN": "仅为体验，不会更改真实文件。",
  },
  "선택한 위치를 확인하고 있어요…": {
    en: "Checking your selected destination…",
    ja: "選択した保存先を確認中…",
    "zh-CN": "正在检查所选位置…",
  },
  "확인 실패: {0}": {
    en: "Check failed: {0}",
    ja: "確認できませんでした: {0}",
    "zh-CN": "检查失败：{0}",
  },
  "{0}개 파일의 목적지 폴더를 선택해 주세요.": {
    en: "Choose destinations for {0} files.",
    ja: "{0}個のファイルの保存先を選んでください。",
    "zh-CN": "请为{0}个文件选择目标文件夹。",
  },
  "처리 가능한 파일만 실행하고, 위에 안내한 항목은 건너뛰어요.": {
    en: "Only ready files will be processed; the items noted above will be skipped.",
    ja: "処理可能なファイルだけ実行し、上記の項目はスキップします。",
    "zh-CN": "仅处理可执行的文件，上方提示的项目将被跳过。",
  },
  취소: { en: "Cancel", ja: "キャンセル", "zh-CN": "取消" },
  "확인 중…": { en: "Checking…", ja: "確認中…", "zh-CN": "正在检查…" },
  "{0}개 {1}": {
    en: "{1} {0} files",
    ja: "{0}個を{1}",
    "zh-CN": "{1}{0}个文件",
  },
  "체험 정리": { en: "Try organizing", ja: "整理を体験", "zh-CN": "体验整理" },
  "이 폴더의 버전관리를 시작할까요?": {
    en: "Start version tracking for this folder?",
    ja: "このフォルダーのバージョン管理を始めますか？",
    "zh-CN": "开始管理此文件夹的版本吗？",
  },
  "선택한 폴더와 하위 폴더의 기존·신규 파일을 관리해요.": {
    en: "Existing and new files in this folder and its subfolders will be managed.",
    ja: "選択したフォルダーと配下の既存・新規ファイルを管理します。",
    "zh-CN": "管理所选文件夹及子文件夹内的现有和新增文件。",
  },
  "확인한 파일 {1}개 · 원본 크기 합계 {2}MiB · 제외 {3}개": {
    en: "{1} files checked · {2} MiB total · {3} excluded",
    ja: "確認済み{1}個 · 合計{2}MiB · 除外{3}個",
    "zh-CN": "已检查{1}个文件 · 共{2}MiB · 排除{3}个",
  },
  "버전은 이 기기에 보관하며 수정할수록 공간이 늘어요. 기존 파일을 자동 재배치하지 않아요.":
    {
      en: "Versions stay on this device and use more space as files change. Existing files are not automatically rearranged.",
      ja: "バージョンはこの端末に保管し、変更のたびに容量が増えます。既存ファイルは自動で再配置しません。",
      "zh-CN":
        "版本保存在本设备，文件修改会增加占用空间。不会自动重新排列现有文件。",
    },
  "파일당 100MiB · 저장 예산 5GiB. 앱 완전 종료 중의 중간 변경은 기록되지 않아요. 연결·클라우드 경로와 실행 중 DB는 지원하지 않아요.":
    {
      en: "100 MiB per file · 5 GiB storage budget. Intermediate edits while the app is fully closed are not recorded. Linked paths, cloud paths and active databases are unsupported.",
      ja: "1ファイル100MiB、保存予算5GiB。アプリの完全終了中の途中変更は記録しません。リンク先・クラウドのパスと稼働中のDBは非対応です。",
      "zh-CN":
        "单文件100MiB，存储预算5GiB。应用完全退出期间的中间修改不会记录。不支持链接路径、云端路径和运行中的数据库。",
    },
  "목록 확인 완료": {
    en: "File list checked",
    ja: "一覧の確認完了",
    "zh-CN": "文件列表检查完成",
  },
  "일부 경로를 확인하지 못했어요. 부분 관리로 시작해요.": {
    en: "Some paths could not be checked. Start with partial coverage.",
    ja: "一部のパスを確認できませんでした。部分的な管理で開始します。",
    "zh-CN": "部分路径无法检查，将开始部分管理。",
  },
  "제외·보관 불가 확인": {
    en: "Review exclusions and unsaved files",
    ja: "除外・保管不可を確認",
    "zh-CN": "查看排除项和无法保存的文件",
  },
  "버전 저장소 상태를 먼저 확인해 주세요.": {
    en: "Check the version store first.",
    ja: "先にバージョン保存先の状態を確認してください。",
    "zh-CN": "请先检查版本存储状态。",
  },
  나중에: { en: "Later", ja: "あとで", "zh-CN": "稍后" },
  "이 폴더 관리 시작": {
    en: "Start managing folder",
    ja: "このフォルダーの管理を開始",
    "zh-CN": "开始管理此文件夹",
  },
  "파일을 정리하고 있어요": {
    en: "Organizing files",
    ja: "ファイルを整理中",
    "zh-CN": "正在整理文件",
  },
  "파일 상태를 확인하고 있어요": {
    en: "Checking file status",
    ja: "ファイルの状態を確認中",
    "zh-CN": "正在检查文件状态",
  },
  "{0} / {1}개 처리": {
    en: "{0} / {1} files processed",
    ja: "{0} / {1}個を処理",
    "zh-CN": "已处理{0} / {1}个",
  },
  "잠시만 기다려 주세요.": {
    en: "Please wait a moment.",
    ja: "少々お待ちください。",
    "zh-CN": "请稍候。",
  },
  "남은 작업 중지": {
    en: "Stop remaining tasks",
    ja: "残りの処理を中止",
    "zh-CN": "停止剩余任务",
  },
  "창틀이 조금 더 자랐어요": {
    en: "Your windowsill grew a little",
    ja: "窓辺が少し育ちました",
    "zh-CN": "窗台又长大了一点",
  },
  "정리 결과를 확인해 주세요": {
    en: "Review the results",
    ja: "整理結果を確認してください",
    "zh-CN": "请查看整理结果",
  },
  "{1}개 정리 완료": {
    en: "{1} files organized",
    ja: "{1}個の整理完了",
    "zh-CN": "已整理{1}个文件",
  },
  "파일이 연결된 폴더에 자리 잡았어요.": {
    en: "Your files are now in the connected folder.",
    ja: "接続したフォルダーにファイルが収まりました。",
    "zh-CN": "文件已放入关联文件夹。",
  },
  "체험 정리에 성공했어요. 실제 파일은 그대로예요.": {
    en: "Demo complete. Your real files are unchanged.",
    ja: "体験が完了しました。実際のファイルはそのままです。",
    "zh-CN": "体验完成，真实文件未改变。",
  },
  "정리하지 않음": { en: "Not organized", ja: "未整理", "zh-CN": "未整理" },
  "기록 · 되돌리기": {
    en: "Activity & undo",
    ja: "履歴・取り消し",
    "zh-CN": "记录与撤销",
  },
  정원으로: { en: "Back to garden", ja: "庭に戻る", "zh-CN": "返回花园" },
  "앱이 만든 사본을 회수할까요?": {
    en: "Reclaim the copy made by the app?",
    ja: "アプリが作成したコピーを回収しますか？",
    "zh-CN": "收回应用创建的副本吗？",
  },
  "파일을 원래 자리로 돌려놓을까요?": {
    en: "Return the file to its original location?",
    ja: "元の場所にファイルを戻しますか？",
    "zh-CN": "将文件放回原位置吗？",
  },
  "이 정리로 받은 성장 {3}점도 되돌려요.": {
    en: "The {3} growth points from this action will also be reversed.",
    ja: "この整理で得た{3}成長ポイントも取り消します。",
    "zh-CN": "此操作获得的{3}点成长值也将撤销。",
  },
  "원본은 그대로 두고, 수정되지 않은 사본을 회수 폴더로 옮겨요. 사본이 수정되었다면 자동으로 회수하지 않아요.":
    {
      en: "The original stays in place. An unchanged copy moves to the recovery folder. Edited copies are not reclaimed automatically.",
      ja: "元のファイルは残し、未変更のコピーを回収フォルダーへ移します。変更済みのコピーは自動回収しません。",
      "zh-CN":
        "保留原文件，将未修改的副本移至回收文件夹。修改过的副本不会自动收回。",
    },
  "원래 위치에 같은 파일이 있거나 이동 후 수정된 경우에는 자동으로 복원하지 않아요.":
    {
      en: "Automatic undo is unavailable if the original location is occupied or the file was edited after moving.",
      ja: "元の場所に同名ファイルがある場合や移動後に編集された場合、自動では戻しません。",
      "zh-CN": "若原位置已有同名文件，或文件在移动后被修改，则不会自动恢复。",
    },
  "작은 창틀": {
    en: "Little Windowsill",
    ja: "小さな窓辺",
    "zh-CN": "小小窗台",
  },
  "클릭 통과 모드에서는 트레이 메뉴의 ‘창틀 정리 모드’로 돌아올 수 있어요.": {
    en: "In click-through mode, return using Organize mode in the tray menu.",
    ja: "クリック透過モードからは、トレイメニューの整理モードで戻れます。",
    "zh-CN": "在点击穿透模式中，可通过托盘菜单的整理模式返回。",
  },
  "정원 관리 열기": {
    en: "Open garden manager",
    ja: "庭の管理画面を開く",
    "zh-CN": "打开花园管理",
  },
  "정리 모드로 보기": {
    en: "Organize mode",
    ja: "整理モード",
    "zh-CN": "整理模式",
  },
  "클릭 통과로 감상하기": {
    en: "Click-through mode",
    ja: "クリック透過で鑑賞",
    "zh-CN": "点击穿透模式",
  },
  "앱 종료": { en: "Quit app", ja: "アプリを終了", "zh-CN": "退出应用" },
  닫기: { en: "Close", ja: "閉じる", "zh-CN": "关闭" },
  "창틀 크기 조절": {
    en: "Resize windowsill",
    ja: "窓辺のサイズを変更",
    "zh-CN": "调整窗台大小",
  },
  "왼쪽 위로 끌어 크기 조절": {
    en: "Drag up and left to resize",
    ja: "左上にドラッグしてサイズを変更",
    "zh-CN": "向左上拖动调整大小",
  },
  "끌어서 위치 이동": {
    en: "Drag to move",
    ja: "ドラッグして移動",
    "zh-CN": "拖动以移动",
  },
  "작은 도트 창틀": {
    en: "Pixel windowsill",
    ja: "小さなドット絵の窓辺",
    "zh-CN": "像素小窗台",
  },
  "창틀 메뉴": {
    en: "Windowsill menu",
    ja: "窓辺メニュー",
    "zh-CN": "窗台菜单",
  },
  "{4} · 클릭하면 연결 폴더 열기, 파일을 놓으면 정리 미리보기": {
    en: "{4} · Click to open folder, drop files to preview organizing",
    ja: "{4} · クリックでフォルダーを開き、ファイルを置くと整理プレビュー",
    "zh-CN": "{4} · 点击打开文件夹，拖入文件预览整理",
  },
  "{5} 화분 폴더 열기": {
    en: "Open {5} pot folder",
    ja: "{5} の植木鉢フォルダーを開く",
    "zh-CN": "打开{5}花盆文件夹",
  },
  "나의 작은 공간": {
    en: "My little space",
    ja: "私の小さな空間",
    "zh-CN": "我的小天地",
  },
  "작은 정리가": {
    en: "A little tidying",
    ja: "小さな整理が",
    "zh-CN": "小小整理，",
  },
  "초록이 되는 곳.": {
    en: "turns into green.",
    ja: "緑になる場所。",
    "zh-CN": "化作绿意。",
  },
  "서두르지 않아도 괜찮아요. 초록은 조금씩 자라니까요.": {
    en: "Take your time. Green grows little by little.",
    ja: "焦らなくても大丈夫。緑は少しずつ育ちます。",
    "zh-CN": "慢慢来，绿意会一点点成长。",
  },
  "{8} 작은 창틀": {
    en: "{8} Little Windowsill",
    ja: "{8} 小さな窓辺",
    "zh-CN": "{8} 小小窗台",
  },
  "관리 파일·버전": {
    en: "Files & versions",
    ja: "管理ファイル・バージョン",
    "zh-CN": "文件与版本",
  },
  "나의 규칙": { en: "My rules", ja: "私のルール", "zh-CN": "我的规则" },
  테마: { en: "Themes", ja: "テーマ", "zh-CN": "主题" },
  "관리 파일에서 보관 상태 확인": {
    en: "Check saved status in Files",
    ja: "管理ファイルで保管状態を確認",
    "zh-CN": "在文件管理中查看保存状态",
  },
  "샘플 정원 · 실제 파일 변경 없음": {
    en: "Demo garden · no real file changes",
    ja: "サンプルの庭 · 実ファイルの変更なし",
    "zh-CN": "示例花园 · 不修改真实文件",
  },
  "나만의 작은 생태계": {
    en: "My little ecosystem",
    ja: "私だけの小さな生態系",
    "zh-CN": "我的小生态",
  },
  "브라우저 체험 · 실제 파일은 이동하지 않아요": {
    en: "Browser demo · no real files are moved",
    ja: "ブラウザー体験 · 実ファイルは移動しません",
    "zh-CN": "浏览器体验 · 不移动真实文件",
  },
  "이전 정리에서 확인이 필요한 파일이 있어요. 새 파일 정리를 잠시 멈췄어요.": {
    en: "Some files from an earlier action need attention. New actions are paused.",
    ja: "前回の整理に確認が必要なファイルがあります。新しい整理を一時停止しています。",
    "zh-CN": "之前的整理有文件需要确认，已暂停新的整理操作。",
  },
  "다시 확인": { en: "Check again", ja: "再確認", "zh-CN": "重新检查" },
  "기록 보기": { en: "View activity", ja: "履歴を見る", "zh-CN": "查看记录" },
  "화분 바로가기를 바꿨어요.": {
    en: "Pot shortcut updated.",
    ja: "植木鉢のショートカットを変更しました。",
    "zh-CN": "已更改花盆快捷入口。",
  },
  "목적지를 다시 확인해 주세요.": {
    en: "Please check the destination again.",
    ja: "保存先を再確認してください。",
    "zh-CN": "请重新确认目标位置。",
  },
  "화분 이름을 변경했어요.": {
    en: "Pot renamed.",
    ja: "植木鉢の名前を変更しました。",
    "zh-CN": "花盆已重命名。",
  },
  "이름을 확인해 주세요.": {
    en: "Please check the name.",
    ja: "名前を確認してください。",
    "zh-CN": "请检查名称。",
  },
  "화분에 폴더를 연결했어요.": {
    en: "Folder connected to the pot.",
    ja: "植木鉢にフォルダーを接続しました。",
    "zh-CN": "已将文件夹关联到花盆。",
  },
  "폴더 관리를 시작했어요. 첫 버전 보관 상태를 확인해 주세요.": {
    en: "Folder management started. Check the first version status.",
    ja: "フォルダー管理を開始しました。最初のバージョンの保管状態を確認してください。",
    "zh-CN": "已开始管理文件夹，请检查首个版本的保存状态。",
  },
  "정리 작업을 되돌렸어요.": {
    en: "Action undone.",
    ja: "整理を取り消しました。",
    "zh-CN": "已撤销整理操作。",
  },
  "파일 상태를 다시 확인했어요.": {
    en: "File status checked again.",
    ja: "ファイルの状態を再確認しました。",
    "zh-CN": "已重新检查文件状态。",
  },
  "정원 관리에서 폴더를 먼저 연결해 주세요.": {
    en: "Connect a folder in the garden manager first.",
    ja: "先に庭の管理画面でフォルダーを接続してください。",
    "zh-CN": "请先在花园管理中关联文件夹。",
  },
  "작은 창틀을 불러오지 못했어요. {0}": {
    en: "Could not load Little Windowsill. {0}",
    ja: "小さな窓辺を読み込めませんでした。{0}",
    "zh-CN": "无法加载小小窗台。{0}",
  },
  "아직 확인 전": { en: "Not checked yet", ja: "未確認", "zh-CN": "尚未检查" },
  "첫 버전 보관 중": {
    en: "Saving first version",
    ja: "最初のバージョンを保管中",
    "zh-CN": "正在保存首个版本",
  },
  "변경 확인 중": {
    en: "Checking changes",
    ja: "変更を確認中",
    "zh-CN": "正在检查更改",
  },
  "일부 보관 대기/불가": {
    en: "Some files pending or unavailable",
    ja: "一部保管待ち・不可",
    "zh-CN": "部分文件待保存或不可保存",
  },
  "관리 중": { en: "Managed", ja: "管理中", "zh-CN": "管理中" },
  "정기 확인 중": {
    en: "Periodic check",
    ja: "定期確認中",
    "zh-CN": "定期检查中",
  },
  "관리 중단": { en: "Paused", ja: "管理停止中", "zh-CN": "已暂停管理" },
  "저장 지연": { en: "Save delayed", ja: "保存遅延", "zh-CN": "保存延迟" },
  "보관 완료": { en: "Saved", ja: "保管済み", "zh-CN": "已保存" },
  "저장 대기": { en: "Pending save", ja: "保存待ち", "zh-CN": "等待保存" },
  "경로에서 사라짐": {
    en: "Missing from path",
    ja: "パスから消失",
    "zh-CN": "路径中已不存在",
  },
  "교체 전 파일": {
    en: "File before replacement",
    ja: "置き換え前のファイル",
    "zh-CN": "替换前的文件",
  },
  "{거래처}_{날짜}_{문서종류}.pdf": {
    en: "{거래처}_{날짜}_{문서종류}.pdf",
    ja: "{거래처}_{날짜}_{문서종류}.pdf",
    "zh-CN": "{거래처}_{날짜}_{문서종류}.pdf",
  },
  "새싹 · 보관 완료": {
    en: "Sprout · saved",
    ja: "芽 · 保管済み",
    "zh-CN": "嫩芽 · 已保存",
  },
  "마지막으로 확인한 파일 내용이 버전으로 보관됐어요.": {
    en: "The last checked file content is saved as a version.",
    ja: "最後に確認した内容をバージョンとして保管しています。",
    "zh-CN": "最近检查的文件内容已保存为版本。",
  },
  "씨앗 · 보관 대기": {
    en: "Seed · pending",
    ja: "種 · 保管待ち",
    "zh-CN": "种子 · 等待保存",
  },
  "아직 최신 내용의 보관이 끝나지 않았어요.": {
    en: "The latest content has not finished saving yet.",
    ja: "最新の内容はまだ保管が完了していません。",
    "zh-CN": "最新内容尚未保存完成。",
  },
  "씨앗 ! · 확인 필요": {
    en: "Seed ! · attention",
    ja: "種 ! · 要確認",
    "zh-CN": "种子 ! · 需要确认",
  },
  "파일 또는 폴더를 확인하지 못했어요. 최근 보관 버전과 현재 내용은 다를 수 있어요.":
    {
      en: "The file or folder could not be checked. The last saved version may differ from the current content.",
      ja: "ファイルやフォルダーを確認できません。最新の保管版と現在の内容が異なる可能性があります。",
      "zh-CN": "无法检查文件或文件夹，最近保存的版本可能与当前内容不同。",
    },
  "씨앗 Ⅱ · 관리 중단": {
    en: "Seed Ⅱ · paused",
    ja: "種 Ⅱ · 管理停止",
    "zh-CN": "种子 Ⅱ · 已暂停",
  },
  "기존 버전은 남아 있지만 새로운 변경은 수집하지 않아요.": {
    en: "Existing versions remain, but new changes are not collected.",
    ja: "既存のバージョンは残りますが、新しい変更は収集しません。",
    "zh-CN": "保留已有版本，但不再收集新的更改。",
  },
  "빈 씨앗 · 이력만 보관": {
    en: "Empty seed · history only",
    ja: "空の種 · 履歴のみ保管",
    "zh-CN": "空种子 · 仅保留记录",
  },
  "삭제되거나 교체된 파일이에요. 남아 있는 버전을 복원할 수 있어요.": {
    en: "This file was deleted or replaced. Remaining versions can be restored.",
    ja: "削除または置き換えられたファイルです。残ったバージョンを復元できます。",
    "zh-CN": "此文件已删除或被替换，可恢复保留的版本。",
  },
  "처음 쓴 메모": {
    en: "My first note",
    ja: "最初のメモ",
    "zh-CN": "第一条笔记",
  },
  "{8} {9}개 중 {10}개 보관 완료": {
    en: "{10} of {9} {8} files saved",
    ja: "{8} {9}個中{10}個を保管済み",
    "zh-CN": "{8}{9}个文件中已保存{10}个",
  },
  "{11}개 중 {12}개": {
    en: "{12} of {11}",
    ja: "{11}個中{12}個",
    "zh-CN": "{11}个中已保存{12}个",
  },
  "관리 상태 확인 필요": {
    en: "Check management status",
    ja: "管理状態の確認が必要",
    "zh-CN": "需要检查管理状态",
  },
  전체: { en: "Total", ja: "全体", "zh-CN": "总计" },
  확인된: { en: "Discovered", ja: "確認済み", "zh-CN": "已发现" },
  "+ 폴더": { en: "+ Folder", ja: "+ フォルダー", "zh-CN": "+ 文件夹" },
  "폴더 추가": {
    en: "Add folder",
    ja: "フォルダーを追加",
    "zh-CN": "添加文件夹",
  },
  설정: { en: "Settings", ja: "設定", "zh-CN": "设置" },
  "관리가 중단되어 있어요.": {
    en: "Management is paused.",
    ja: "管理を停止しています。",
    "zh-CN": "管理已暂停。",
  },
  "전체 범위를 확인 중이거나 일부 파일이 보관 대기 중이에요.": {
    en: "Checking the full scope, or some files are awaiting storage.",
    ja: "全体を確認中、または一部のファイルが保管待ちです。",
    "zh-CN": "正在检查完整范围，或部分文件仍在等待保存。",
  },
  "선택한 폴더 설정": {
    en: "Selected folder settings",
    ja: "選択中のフォルダー設定",
    "zh-CN": "所选文件夹设置",
  },
  "제외 규칙 적용 후 보관 완료 개수 · 미보관 {4}개 · 제외 {5}개 · 마지막 검사 {6}":
    {
      en: "Saved count after exclusions · {4} unsaved · {5} excluded · Last scan {6}",
      ja: "除外後の保管数 · 未保管{4}個 · 除外{5}個 · 最終確認{6}",
      "zh-CN":
        "排除规则应用后的保存数量 · 未保存{4}个 · 排除{5}个 · 最近检查{6}",
    },
  "화분 바로가기 설정": {
    en: "Pot shortcut settings",
    ja: "植木鉢ショートカット設定",
    "zh-CN": "花盆快捷入口设置",
  },
  "바로가기를 바꿔도 기존 폴더 관리는 계속돼요.": {
    en: "Changing the shortcut keeps the previous folder managed.",
    ja: "切り替えても以前のフォルダー管理は続きます。",
    "zh-CN": "更改快捷入口不会停止原文件夹的管理。",
  },
  "지금 확인": { en: "Check now", ja: "今すぐ確認", "zh-CN": "立即检查" },
  "관리 다시 시작": {
    en: "Resume management",
    ja: "管理を再開",
    "zh-CN": "恢复管理",
  },
  "· 연결됨": { en: "· Connected", ja: "· 接続済み", "zh-CN": "· 已关联" },
  "관리할 폴더를 연결해 주세요": {
    en: "Connect a folder to manage",
    ja: "管理するフォルダーを接続",
    "zh-CN": "请关联要管理的文件夹",
  },
  "화분은 빠른 접근을 위한 바로가기예요. 관리 폴더는 화분 개수와 관계없이 추가할 수 있어요.":
    {
      en: "Pots are shortcuts. Add managed folders independently of the pot count.",
      ja: "植木鉢はショートカットです。鉢数に関係なく管理フォルダーを追加できます。",
      "zh-CN": "花盆是快捷入口，管理文件夹的数量不受花盆数量限制。",
    },
  "관리 폴더 추가": {
    en: "Add managed folder",
    ja: "管理フォルダーを追加",
    "zh-CN": "添加管理文件夹",
  },
  "예시로 사용법 보기": {
    en: "Learn with an example",
    ja: "例で使い方を見る",
    "zh-CN": "通过示例了解用法",
  },
  "앱 소개": { en: "Introduction", ja: "アプリ紹介", "zh-CN": "应用介绍" },
  "보관 상태": { en: "Storage status", ja: "保管状態", "zh-CN": "保存状态" },
  "첫 파일 정리": {
    en: "First tidy-up",
    ja: "初めての整理",
    "zh-CN": "首次整理",
  },
  "이전 버전": {
    en: "Previous versions",
    ja: "以前のバージョン",
    "zh-CN": "历史版本",
  },
  "규칙과 작은 창": {
    en: "Rules & widget",
    ja: "ルールと小窓",
    "zh-CN": "规则与小窗",
  },
  "파일을 정리하고, 바뀐 내용도 보관해요.": {
    en: "Organize files and keep their changes.",
    ja: "ファイルを整理し、変更した内容も保管します。",
    "zh-CN": "整理文件，也保存修改内容。",
  },
  "화분에 파일을 놓으면 넣어둘 폴더를 추천해요.": {
    en: "Drop files on a pot to get folder suggestions.",
    ja: "植木鉢にファイルを置くと保存先を提案します。",
    "zh-CN": "拖入花盆即可获得目标文件夹推荐。",
  },
  "관리 폴더에서 생성·수정한 파일의 버전을 자동 보관해요.": {
    en: "Versions of files created or edited in managed folders are saved automatically.",
    ja: "管理フォルダーで作成・編集したファイルのバージョンを自動保管します。",
    "zh-CN": "自动保存管理文件夹内新建和修改的文件版本。",
  },
  "나의 파일명 규칙과 일치하지 않는 파일을 확인해요.": {
    en: "Find files that do not follow your naming rules.",
    ja: "自分の命名ルールに合わないファイルを確認できます。",
    "zh-CN": "找出不符合命名规则的文件。",
  },
  "내 폴더 연결하기": {
    en: "Connect my folder",
    ja: "自分のフォルダーを接続",
    "zh-CN": "关联我的文件夹",
  },
  "예시로 먼저 보기": {
    en: "Try an example first",
    ja: "まず例で試す",
    "zh-CN": "先试用示例",
  },
  "어느 폴더를 관리할까요?": {
    en: "Which folder would you like to manage?",
    ja: "どのフォルダーを管理しますか？",
    "zh-CN": "想管理哪个文件夹？",
  },
  "선택한 폴더와 하위 폴더의 기존·신규 파일을 관리해요. 범위·제외·용량을 확인한 뒤 시작해요.":
    {
      en: "Manage existing and new files in this folder and its subfolders. Review scope, exclusions and size before starting.",
      ja: "フォルダー配下の既存・新規ファイルを管理します。範囲・除外・容量を確認して開始します。",
      "zh-CN":
        "管理此文件夹及子文件夹中的现有和新增文件。开始前请检查范围、排除项和容量。",
    },
  "화분은 바로가기예요. 관리 폴더는 화분 개수와 관계없이 추가할 수 있어요. 처음 등록한 내용부터 보관해요.":
    {
      en: "Pots are shortcuts; managed folders are independent of the pot count. Version history starts when you register a folder.",
      ja: "植木鉢はショートカットで、管理フォルダー数は鉢数と無関係です。登録時の内容から保管します。",
      "zh-CN":
        "花盆是快捷入口，管理文件夹数量不受花盆限制。从首次注册时的内容开始保存。",
    },
  "{0} 화분에 연결": {
    en: "Connect to {0} pot",
    ja: "{0} の植木鉢に接続",
    "zh-CN": "关联到{0}花盆",
  },
  "보관 상태를 먼저 확인해요": {
    en: "Check storage status first",
    ja: "まず保管状態を確認",
    "zh-CN": "先检查保存状态",
  },
  "파일 상세 우측 상단의 표시로 상태를 알 수 있어요. 마우스를 올리거나 클릭하면 뜻을 볼 수 있어요.":
    {
      en: "The mark at the top right of file details shows its status. Hover or click to learn more.",
      ja: "ファイル詳細の右上のマークで状態が分かります。マウスを重ねるかクリックすると説明を表示します。",
      "zh-CN": "文件详情右上角的标记显示状态。悬停或点击可查看含义。",
    },
  "표시는 실제 보관 상태예요. 화분의 성장 점수와는 관계없어요.": {
    en: "These marks show actual storage status, independent of plant growth.",
    ja: "これは実際の保管状態です。植木鉢の成長ポイントとは別です。",
    "zh-CN": "标记表示实际保存状态，与花盆成长值无关。",
  },
  "실제 보관 상태 보기": {
    en: "View actual storage status",
    ja: "実際の保管状態を見る",
    "zh-CN": "查看实际保存状态",
  },
  "화분에 파일을 놓아보세요": {
    en: "Drop a file onto a pot",
    ja: "植木鉢にファイルを置いてみましょう",
    "zh-CN": "将文件拖入花盆",
  },
  "파일 선택 버튼도 같은 기능이에요. 추천 위치를 확인하고 복사 또는 이동을 고르세요.":
    {
      en: "The file picker works the same way. Check the suggestion, then choose copy or move.",
      ja: "ファイル選択ボタンでも同じ操作ができます。提案先を確認し、コピーか移動を選びます。",
      "zh-CN": "选择文件按钮具有相同功能。确认推荐位置后，选择复制或移动。",
    },
  "원본은 그대로 두고 사본을 만들어요.": {
    en: "Keep the original and create a copy.",
    ja: "元のファイルを残してコピーを作ります。",
    "zh-CN": "保留原文件并创建副本。",
  },
  "원래 위치에서 선택한 폴더로 옮겨요.": {
    en: "Move from the original location to the selected folder.",
    ja: "元の場所から選択したフォルダーへ移します。",
    "zh-CN": "从原位置移至所选文件夹。",
  },
  "추천이 모호하면 직접 폴더를 고를 수 있어요. 안내의 ‘다음’은 파일을 실행하지 않아요.":
    {
      en: "If the suggestion is unclear, choose a folder yourself. Next in this guide does not run file actions.",
      ja: "提案が曖昧なら自分で保存先を選べます。ガイドの「次へ」はファイル操作を実行しません。",
      "zh-CN":
        "推荐不明确时可自行选择文件夹。引导中的“下一步”不会执行文件操作。",
    },
  "파일 정리 화면 열기": {
    en: "Open file organizer",
    ja: "ファイル整理画面を開く",
    "zh-CN": "打开文件整理页面",
  },
  "이전 내용을 찾고 복원해요": {
    en: "Find and restore earlier content",
    ja: "以前の内容を探して復元",
    "zh-CN": "查找并恢复历史内容",
  },
  "정리 기록 → 되돌리기": {
    en: "Activity → Undo",
    ja: "整理履歴 → 取り消す",
    "zh-CN": "整理记录 → 撤销",
  },
  "는 정리한 위치를 되돌리는 기능이에요.": {
    en: "returns files to their previous location.",
    ja: "で整理前の場所に戻せます。",
    "zh-CN": "可将文件放回整理前的位置。",
  },
  "관리 파일·버전 → 파일 선택 → 버전 이력 → 다른 이름으로 복원": {
    en: "Files & versions → Select file → Version history → Restore as new file",
    ja: "管理ファイル・バージョン → ファイル選択 → バージョン履歴 → 別名で復元",
    "zh-CN": "文件与版本 → 选择文件 → 版本记录 → 恢复为新文件",
  },
  "은 예전 내용을 별도 파일로 꺼내요.": {
    en: "retrieves earlier content as a separate file.",
    ja: "で以前の内容を別ファイルとして取り出せます。",
    "zh-CN": "可将历史内容提取为单独文件。",
  },
  "이 버전에서는 현재 파일을 덮어쓰지 않는 별도 복원을 제공해요. 앱 완전 종료 중의 중간 편집은 보관되지 않아요.":
    {
      en: "This version restores to a separate file without overwriting the current one. Intermediate edits while the app is fully closed are not saved.",
      ja: "現在のファイルを上書きせず別ファイルに復元します。完全終了中の途中編集は保管しません。",
      "zh-CN":
        "当前版本恢复为单独文件，不覆盖现有文件。应用完全退出期间的中间编辑不会保存。",
    },
  "파일 버전 이력 열기": {
    en: "Open version history",
    ja: "バージョン履歴を開く",
    "zh-CN": "打开版本记录",
  },
  "내 규칙을 보고, 작은 창을 꾸며요": {
    en: "Review your rules and decorate the widget",
    ja: "ルールを確認して小窓を飾る",
    "zh-CN": "查看规则并装饰小窗",
  },
  "테마 나누기": { en: "Theme sharing", ja: "テーマ共有", "zh-CN": "主题分享" },
  "에서 ID/PW로 가입하면 무료 테마를 받고 공유할 수 있어요. 받은 테마는 설치 후 적용을 누르세요. 파일 관리와 설치한 테마 사용에는 로그인이 필요하지 않아요.":
    {
      en: "lets you register with an ID and password to get and share free themes. Install, then apply. File management and installed themes work without login.",
      ja: "ではIDとパスワードで登録し、無料テーマを入手・共有できます。インストール後に適用してください。ファイル管理と導入済みテーマにはログイン不要です。",
      "zh-CN":
        "中可使用账号密码注册，免费获取和分享主题。安装后再应用。文件管理和已安装主题无需登录。",
    },
  "같은 패턴을 확인하고 내 규칙으로 사용할 수 있어요.": {
    en: "Review repeated patterns and use them as your rules.",
    ja: "共通パターンを確認し、自分のルールにできます。",
    "zh-CN": "查看重复模式并设为自己的规则。",
  },
  "일치·불일치·판단 보류·규칙 없음·예외를 나눠 봐요. 규칙에 맞지 않아도 버전은 보관돼요.":
    {
      en: "See matching, nonmatching, uncertain, no-rule and exception files. Versions are saved even when names do not match.",
      ja: "一致・不一致・保留・ルールなし・例外に分けて確認できます。不一致でもバージョンは保管します。",
      "zh-CN":
        "分别查看匹配、不匹配、待定、无规则和例外文件。不符合规则也会保存版本。",
    },
  "작은 창 위에 마우스를 올리면 이동·크기 조절·관리 버튼이 보여요. 숨기거나 관리 창을 닫아도 앱이 실행 중이면 관리가 계속돼요.":
    {
      en: "Hover over the widget for move, resize and manage controls. Management continues while the app runs, even if its windows are hidden or closed.",
      ja: "小窓にマウスを重ねると移動・サイズ変更・管理の操作が表示されます。ウィンドウを隠す・閉じる場合もアプリの実行中は管理を続けます。",
      "zh-CN":
        "悬停小窗可显示移动、调整大小和管理按钮。只要应用仍在运行，隐藏或关闭窗口也会继续管理。",
    },
  "앱 완전 종료 중에는 기록되지 않아요.": {
    en: "Nothing is recorded while the app is fully closed.",
    ja: "アプリの完全終了中は記録しません。",
    "zh-CN": "应用完全退出期间不会记录。",
  },
  "나의 규칙 보기": {
    en: "View my rules",
    ja: "私のルールを見る",
    "zh-CN": "查看我的规则",
  },
  "작은 창 열기": { en: "Open widget", ja: "小窓を開く", "zh-CN": "打开小窗" },
  "원하는 주제를 선택하거나 처음부터 따라 해보세요.": {
    en: "Choose a topic or follow the guide from the start.",
    ja: "好きな項目を選ぶか、最初から順に試してください。",
    "zh-CN": "选择感兴趣的主题，或从头开始跟随引导。",
  },
  "사용 안내 단계": {
    en: "Guide steps",
    ja: "ガイドの手順",
    "zh-CN": "引导步骤",
  },
  "가이드 종료는 이미 시작한 폴더 관리를 중단하지 않아요. 안내 완료와 파일 보관 완료는 별개예요.":
    {
      en: "Closing the guide does not stop folder management. Completing the guide does not mean all files are saved.",
      ja: "ガイドを終了してもフォルダー管理は停止しません。ガイド完了と保管完了は別です。",
      "zh-CN": "结束引导不会停止文件夹管理。完成引导不代表文件已全部保存。",
    },
  "예시 체험 · 실제 파일은 변경되지 않아요": {
    en: "Demo · real files are unchanged",
    ja: "体験用 · 実ファイルは変更しません",
    "zh-CN": "示例体验 · 不修改真实文件",
  },
  "예시 파일: 메모.txt · v{0}": {
    en: "Sample: note.txt · v{0}",
    ja: "例: メモ.txt · v{0}",
    "zh-CN": "示例：笔记.txt · v{0}",
  },
  "예시 메모 내용": {
    en: "Sample note content",
    ja: "サンプルメモの内容",
    "zh-CN": "示例笔记内容",
  },
  "예시 저장": { en: "Save sample", ja: "サンプルを保存", "zh-CN": "保存示例" },
  "이전 예시를 다른 이름으로 복원": {
    en: "Restore previous sample as new file",
    ja: "前のサンプルを別名で復元",
    "zh-CN": "将上一示例恢复为新文件",
  },
  "예시 닫기": { en: "Close demo", ja: "体験を閉じる", "zh-CN": "关闭示例" },
  "예시 복원본: {0} · 현재 메모는 유지돼요.": {
    en: "Restored sample: {0} · Your current note stays unchanged.",
    ja: "復元した例: {0} · 現在のメモはそのままです。",
    "zh-CN": "已恢复示例：{0} · 当前笔记保持不变。",
  },
  뒤로: { en: "Back", ja: "戻る", "zh-CN": "返回" },
  "나중에 설정": { en: "Set up later", ja: "あとで設定", "zh-CN": "稍后设置" },
  다음: { en: "Next", ja: "次へ", "zh-CN": "下一步" },
  "가이드 마치기": {
    en: "Finish guide",
    ja: "ガイドを終了",
    "zh-CN": "完成引导",
  },
  "나의 파일명 규칙": {
    en: "My naming rules",
    ja: "私の命名ルール",
    "zh-CN": "我的命名规则",
  },
  "나의 이름 습관을 확인하고, 맞지 않는 파일을 찾아보세요.": {
    en: "Discover your naming habits and find files that do not match.",
    ja: "命名の習慣を確認し、合わないファイルを探しましょう。",
    "zh-CN": "了解自己的命名习惯，找出不符合规则的文件。",
  },
  "브라우저는 예시 체험이에요": {
    en: "This browser is a demo",
    ja: "ブラウザーは体験用です",
    "zh-CN": "浏览器中为示例体验",
  },
  "실제 폴더 감시·Git 버전 보관은 데스크톱 앱에서 사용할 수 있어요.": {
    en: "Real folder monitoring and Git version storage are available in the desktop app.",
    ja: "実際のフォルダー監視とGitバージョン保管はデスクトップアプリで利用できます。",
    "zh-CN": "实际文件夹监控和Git版本保存可在桌面应用中使用。",
  },
  "예시 체험 열기": { en: "Open demo", ja: "体験を開く", "zh-CN": "打开示例" },
  "저장소 다시 확인": {
    en: "Recheck storage",
    ja: "保存先を再確認",
    "zh-CN": "重新检查存储",
  },
  "파일 검색": { en: "Search files", ja: "ファイル検索", "zh-CN": "搜索文件" },
  "관리 폴더 전체에서 파일명·경로 검색": {
    en: "Search names and paths across the managed folder",
    ja: "管理フォルダー全体で名前・パスを検索",
    "zh-CN": "在管理文件夹内搜索文件名和路径",
  },
  "{3} · {4}개 버전 · {5}": {
    en: "{3} · {4} versions · {5}",
    ja: "{3} · {4}バージョン · {5}",
    "zh-CN": "{3} · {4}个版本 · {5}",
  },
  대기: { en: "Pending", ja: "待機中", "zh-CN": "等待中" },
  "현재 폴더 경로": {
    en: "Current folder path",
    ja: "現在のフォルダーパス",
    "zh-CN": "当前文件夹路径",
  },
  "전체 하위 폴더 검색 결과 · {0}개{1}": {
    en: "All subfolders · {0} results{1}",
    ja: "全サブフォルダーの検索結果 · {0}件{1}",
    "zh-CN": "全部子文件夹搜索结果 · {0}项{1}",
  },
  "· {0}–{1} 표시": {
    en: "· showing {0}–{1}",
    ja: "· {0}–{1}を表示",
    "zh-CN": "· 显示{0}–{1}",
  },
  "검색 결과가 없어요.": {
    en: "No results found.",
    ja: "検索結果がありません。",
    "zh-CN": "未找到结果。",
  },
  "검색 결과 페이지": {
    en: "Search pages",
    ja: "検索結果ページ",
    "zh-CN": "搜索结果分页",
  },
  "{3} / {4} 페이지 · {5}개씩": {
    en: "Page {3} / {4} · {5} per page",
    ja: "{3} / {4}ページ · 各{5}件",
    "zh-CN": "第{3} / {4}页 · 每页{5}项",
  },
  이전: { en: "Previous", ja: "前へ", "zh-CN": "上一页" },
  "{1}페이지": { en: "Page {1}", ja: "{1}ページ", "zh-CN": "第{1}页" },
  "폴더 깊이별 탐색": {
    en: "Browse folder levels",
    ja: "階層別にフォルダーを探す",
    "zh-CN": "按文件夹层级浏览",
  },
  "{0}단계 {1}": {
    en: "Level {0} {1}",
    ja: "{0}階層 {1}",
    "zh-CN": "第{0}层 {1}",
  },
  "폴더 {0} · 파일 {1}": {
    en: "{0} folders · {1} files",
    ja: "フォルダー{0} · ファイル{1}",
    "zh-CN": "{0}个文件夹 · {1}个文件",
  },
  "비어 있는 폴더예요.": {
    en: "This folder is empty.",
    ja: "空のフォルダーです。",
    "zh-CN": "此文件夹为空。",
  },
  "파일 상세": { en: "File details", ja: "ファイル詳細", "zh-CN": "文件详情" },
  "버전 이력": {
    en: "Version history",
    ja: "バージョン履歴",
    "zh-CN": "版本记录",
  },
  "표시 사용 안내": {
    en: "About status marks",
    ja: "状態マークの説明",
    "zh-CN": "状态标记说明",
  },
  "보관 대기": { en: "Awaiting storage", ja: "保管待ち", "zh-CN": "等待保存" },
  "최근 보관 {0}": {
    en: "Last saved {0}",
    ja: "最終保管 {0}",
    "zh-CN": "最近保存 {0}",
  },
  "첫 버전을 기다려요": {
    en: "Waiting for first version",
    ja: "最初のバージョンを待機中",
    "zh-CN": "正在等待首个版本",
  },
  "현재 파일 열기": {
    en: "Open current file",
    ja: "現在のファイルを開く",
    "zh-CN": "打开当前文件",
  },
  "경로 사건·관찰 공백": {
    en: "Path events & monitoring gaps",
    ja: "パスの出来事・監視の空白",
    "zh-CN": "路径事件与监控空档",
  },
  "무결성 정보": {
    en: "Integrity details",
    ja: "整合性情報",
    "zh-CN": "完整性信息",
  },
  "커밋: {4}": { en: "Commit: {4}", ja: "コミット: {4}", "zh-CN": "提交：{4}" },
  "다른 이름으로 복원": {
    en: "Restore as new file",
    ja: "別名で復元",
    "zh-CN": "恢复为新文件",
  },
  "아직 확정된 내용 버전이 없어요.": {
    en: "No confirmed content versions yet.",
    ja: "まだ確定した内容バージョンはありません。",
    "zh-CN": "尚无已确认的内容版本。",
  },
  현재: { en: "Current", ja: "現在", "zh-CN": "当前" },
  "이름을 분석하고 있어요.": {
    en: "Analyzing names.",
    ja: "名前を分析中です。",
    "zh-CN": "正在分析名称。",
  },
  일치: { en: "Matches", ja: "一致", "zh-CN": "匹配" },
  불일치: { en: "Does not match", ja: "不一致", "zh-CN": "不匹配" },
  "판단 보류": { en: "Uncertain", ja: "判断保留", "zh-CN": "待定" },
  "규칙 없음": { en: "No rule", ja: "ルールなし", "zh-CN": "无规则" },
  예외: { en: "Exception", ja: "例外", "zh-CN": "例外" },
  "적용 중인 규칙": {
    en: "Active rules",
    ja: "適用中のルール",
    "zh-CN": "使用中的规则",
  },
  "내 규칙 직접 만들기": {
    en: "Create my rule",
    ja: "自分のルールを作る",
    "zh-CN": "创建我的规则",
  },
  "적용할 하위 폴더 (전체 경로)": {
    en: "Subfolder to apply to (full path)",
    ja: "適用するサブフォルダー (フルパス)",
    "zh-CN": "应用到子文件夹（完整路径）",
  },
  "파일명 형식": {
    en: "Filename pattern",
    ja: "ファイル名の形式",
    "zh-CN": "文件名格式",
  },
  "{텍스트} · {거래처} · {문서종류} · {날짜} · {번호} 사용 가능. 날짜는 YYYY-MM-DD 또는 YYYYMMDD예요.":
    {
      en: "Tokens: {텍스트}, {거래처}, {문서종류}, {날짜}, {번호}. Keep these token names; dates use YYYY-MM-DD or YYYYMMDD.",
      ja: "トークン: {텍스트}・{거래처}・{문서종류}・{날짜}・{번호}。この表記のまま使います。日付はYYYY-MM-DDまたはYYYYMMDDです。",
      "zh-CN":
        "可用标记：{텍스트}、{거래처}、{문서종류}、{날짜}、{번호}。请保留这些标记名称，日期使用YYYY-MM-DD或YYYYMMDD。",
    },
  "발견한 이름 패턴": {
    en: "Detected naming patterns",
    ja: "見つかった命名パターン",
    "zh-CN": "发现的命名模式",
  },
  "규칙 점검": { en: "Rule check", ja: "ルールの確認", "zh-CN": "规则检查" },
  "{5} · 형식의 일치 여부이며 내용의 정확도가 아니에요.": {
    en: "{5} · Matches the format, not the accuracy of the content.",
    ja: "{5} · 形式の一致であり、内容の正確さではありません。",
    "zh-CN": "{5} · 仅判断格式是否匹配，不判断内容是否准确。",
  },
  "학습한 정리 습관": {
    en: "Learned organizing habits",
    ja: "学習した整理の習慣",
    "zh-CN": "学到的整理习惯",
  },
  "성공한 목적지 선택을 반영해요. 같은 내용의 반복 복사는 학습 근거를 늘리지 않아요.":
    {
      en: "Learns from successful destination choices. Copying identical content repeatedly does not add evidence.",
      ja: "成功した保存先の選択を反映します。同じ内容の繰り返しコピーは根拠を増やしません。",
      "zh-CN": "根据成功的目标位置选择学习。重复复制相同内容不会增加学习依据。",
    },
  "파일·버전·직접 만든 이름 규칙은 유지돼요.": {
    en: "Files, versions and your custom naming rules stay unchanged.",
    ja: "ファイル・バージョン・自作ルールはそのままです。",
    "zh-CN": "文件、版本和自定义命名规则保持不变。",
  },
  "{1} · 기준 v{2}": {
    en: "{1} · based on v{2}",
    ja: "{1} · 基準v{2}",
    "zh-CN": "{1} · 基于v{2}",
  },
  "사용 중지": { en: "Disable", ja: "無効にする", "zh-CN": "停用" },
  "발견한 패턴을 승인하거나 내 규칙을 입력해 보세요.": {
    en: "Approve a detected pattern or enter your own rule.",
    ja: "見つかったパターンを承認するか、自分のルールを入力してください。",
    "zh-CN": "确认发现的模式，或输入自己的规则。",
  },
  "이 범위의 내 규칙으로 사용": {
    en: "Use as my rule for this scope",
    ja: "この範囲の自分のルールにする",
    "zh-CN": "设为此范围的规则",
  },
  "{1} · 독립 표본 {2}개": {
    en: "{1} · {2} independent samples",
    ja: "{1} · 独立サンプル{2}件",
    "zh-CN": "{1} · {2}个独立样本",
  },
  "내 규칙으로 사용": {
    en: "Use as my rule",
    ja: "自分のルールにする",
    "zh-CN": "设为我的规则",
  },
  "독립 표본 5개 이상인 새 패턴이 없어요. 직접 규칙을 지정할 수도 있어요.": {
    en: "No new patterns with at least 5 independent samples. You can define a rule yourself.",
    ja: "独立サンプル5件以上の新しいパターンはありません。手動でも設定できます。",
    "zh-CN": "没有独立样本达到5个的新模式，也可以手动定义规则。",
  },
  "점검 가능한 {0}개 중 {1}개 일치 · {2}%": {
    en: "{1} of {0} checkable files match · {2}%",
    ja: "確認可能な{0}件中{1}件一致 · {2}%",
    "zh-CN": "可检查的{0}个文件中{1}个匹配 · {2}%",
  },
  "아직 적용할 규칙이 없어요.": {
    en: "No rules to apply yet.",
    ja: "まだ適用するルールはありません。",
    "zh-CN": "尚无可应用的规则。",
  },
  "{4} · {5}버전": {
    en: "{4} · {5} versions",
    ja: "{4} · {5}バージョン",
    "zh-CN": "{4} · {5}个版本",
  },
  "예외 해제": {
    en: "Remove exception",
    ja: "例外を解除",
    "zh-CN": "取消例外",
  },
  "예외로 지정": {
    en: "Mark as exception",
    ja: "例外にする",
    "zh-CN": "设为例外",
  },
  "→ {1} · 근거 가중치 {2}": {
    en: "→ {1} · evidence weight {2}",
    ja: "→ {1} · 根拠の重み{2}",
    "zh-CN": "→ {1} · 依据权重{2}",
  },
  "아직 학습한 선택이 없어요.": {
    en: "No learned choices yet.",
    ja: "まだ学習した選択はありません。",
    "zh-CN": "尚无学到的选择。",
  },
  "이 루트 추천 학습 초기화": {
    en: "Reset suggestions for this root",
    ja: "このルートの学習をリセット",
    "zh-CN": "重置此根目录的推荐学习",
  },
  "사용 안내를 마쳤어요. 실제 보관 상태는 관리 화면에서 확인해 주세요.": {
    en: "Guide complete. Check actual storage status in the file manager.",
    ja: "ガイドが完了しました。実際の保管状態は管理画面で確認してください。",
    "zh-CN": "引导完成。请在文件管理中检查实际保存状态。",
  },
  "홈에서 사용 안내를 다시 열 수 있어요.": {
    en: "You can reopen the guide from home.",
    ja: "ホームから使い方を開き直せます。",
    "zh-CN": "可从首页重新打开使用指南。",
  },
  "화분 바로가기를 바꿨어요. 기존 폴더 관리도 계속돼요.": {
    en: "Shortcut updated. The previous folder stays managed.",
    ja: "ショートカットを変更しました。以前のフォルダーも管理を続けます。",
    "zh-CN": "快捷入口已更改，原文件夹仍继续管理。",
  },
  "다른 이름으로 복원했어요: {0}": {
    en: "Restored as a new file: {0}",
    ja: "別名で復元しました: {0}",
    "zh-CN": "已恢复为新文件：{0}",
  },
  "추천 학습을 초기화했어요. 파일과 버전은 그대로예요.": {
    en: "Suggestions reset. Files and versions are unchanged.",
    ja: "おすすめの学習をリセットしました。ファイルとバージョンはそのままです。",
    "zh-CN": "已重置推荐学习，文件和版本保持不变。",
  },
  "테마 글꼴을 읽지 못해 기존 글꼴을 사용해요.": {
    en: "Could not read the theme font. Keeping the previous font.",
    ja: "テーマのフォントを読めないため以前のフォントを使います。",
    "zh-CN": "无法读取主题字体，继续使用原字体。",
  },
  "테마를 읽지 못했어요. 내 테마에서 다시 선택해 주세요.": {
    en: "Could not load the theme. Select it again in My themes.",
    ja: "テーマを読み込めませんでした。マイテーマで選び直してください。",
    "zh-CN": "无法加载主题，请在我的主题中重新选择。",
  },
  "연결하지 못했어요.": {
    en: "Could not connect.",
    ja: "接続できませんでした。",
    "zh-CN": "无法连接。",
  },
  "그림을 불러오지 못했어요 · 상세에서 다시 확인": {
    en: "Could not load image · try again in details",
    ja: "画像を読み込めません · 詳細で再確認",
    "zh-CN": "无法加载图片 · 请在详情中重试",
  },
  "로그인됨 · 무료 이용": {
    en: "Signed in · free access",
    ja: "ログイン済み · 無料利用",
    "zh-CN": "已登录 · 免费使用",
  },
  "{0} 님": { en: "{0}", ja: "{0} さん", "zh-CN": "{0}" },
  "로그인되어 있어요. 무료 테마를 받고 공유할 수 있어요.": {
    en: "You are signed in. Get and share free themes.",
    ja: "ログイン済みです。無料テーマを入手・共有できます。",
    "zh-CN": "已登录，可获取和分享免费主题。",
  },
  로그아웃: { en: "Sign out", ja: "ログアウト", "zh-CN": "退出登录" },
  "계정 화면": { en: "Account", ja: "アカウント画面", "zh-CN": "账号页面" },
  "아이디: 영문·숫자·밑줄 3~32자 (대소문자 구분 없음)": {
    en: "ID: 3–32 letters, numbers or underscores (case insensitive)",
    ja: "ID: 英数字・下線の3～32文字 (大文字小文字を区別しません)",
    "zh-CN": "账号：3至32位字母、数字或下划线（不区分大小写）",
  },
  "비밀번호: 10~128자{9}": {
    en: "Password: 10–128 characters{9}",
    ja: "パスワード: 10～128文字{9}",
    "zh-CN": "密码：10至128个字符{9}",
  },
  "파일 관리에는 로그인이 필요 없어요. 앱을 완전히 종료하면 다시 로그인해 주세요. 비밀번호 찾기는 아직 지원하지 않아요.":
    {
      en: "No login is needed for file management. Sign in again after fully quitting the app. Password recovery is not available yet.",
      ja: "ファイル管理にはログイン不要です。アプリを完全終了した後は再ログインしてください。パスワード再設定はまだ利用できません。",
      "zh-CN":
        "文件管理无需登录。应用完全退出后需重新登录，目前尚不支持找回密码。",
    },
  로그인: { en: "Sign in", ja: "ログイン", "zh-CN": "登录" },
  회원가입: { en: "Create account", ja: "新規登録", "zh-CN": "注册" },
  "처음 오셨나요?": {
    en: "New here?",
    ja: "初めてですか？",
    "zh-CN": "第一次来？",
  },
  "다시 만나 반가워요": {
    en: "Welcome back",
    ja: "おかえりなさい",
    "zh-CN": "欢迎回来",
  },
  "무료 회원가입": {
    en: "Create a free account",
    ja: "無料アカウント登録",
    "zh-CN": "免费注册",
  },
  "아이디를 만들면 테마를 무료로 받고 나눌 수 있어요.": {
    en: "Create an ID to get and share themes for free.",
    ja: "IDを作ると無料テーマを入手・共有できます。",
    "zh-CN": "创建账号即可免费获取和分享主题。",
  },
  "가입한 아이디와 비밀번호로 로그인하세요.": {
    en: "Sign in with your ID and password.",
    ja: "登録済みのIDとパスワードでログインしてください。",
    "zh-CN": "使用已注册的账号和密码登录。",
  },
  아이디: { en: "User ID", ja: "ユーザーID", "zh-CN": "账号" },
  비밀번호: { en: "Password", ja: "パスワード", "zh-CN": "密码" },
  "비밀번호 확인": {
    en: "Confirm password",
    ja: "パスワードの確認",
    "zh-CN": "确认密码",
  },
  "· 확인란에 한 번 더 입력해 주세요.": {
    en: "· Enter it again to confirm.",
    ja: "· 確認欄にもう一度入力してください。",
    "zh-CN": "· 请再次输入以确认。",
  },
  "가입하는 중…": {
    en: "Creating account…",
    ja: "登録中…",
    "zh-CN": "正在注册…",
  },
  "로그인하는 중…": {
    en: "Signing in…",
    ja: "ログイン中…",
    "zh-CN": "正在登录…",
  },
  "가입하고 시작하기": {
    en: "Create account & start",
    ja: "登録して始める",
    "zh-CN": "注册并开始",
  },
  로그인하기: { en: "Sign in", ja: "ログインする", "zh-CN": "登录" },
  "테마 제작 안내": {
    en: "Theme creation guide",
    ja: "テーマ制作ガイド",
    "zh-CN": "主题制作指南",
  },
  "처음 만드는 테마": {
    en: "Your first theme",
    ja: "初めてのテーマ制作",
    "zh-CN": "制作第一个主题",
  },
  "안내 닫기": { en: "Close guide", ja: "ガイドを閉じる", "zh-CN": "关闭指南" },
  "읽었어요 · 파일 선택": {
    en: "Understood · choose file",
    ja: "確認しました · ファイル選択",
    "zh-CN": "已了解 · 选择文件",
  },
  "테마 탐색과 설치는 데스크톱 앱에서 사용할 수 있어요.": {
    en: "Browse and install themes in the desktop app.",
    ja: "テーマの閲覧と導入はデスクトップアプリで利用できます。",
    "zh-CN": "可在桌面应用中浏览和安装主题。",
  },
  "내 취향을 담아 만들어 보세요": {
    en: "Create something that feels like you",
    ja: "自分好みのテーマを作りましょう",
    "zh-CN": "制作属于你的主题",
  },
  "그림 넣기 → 색상·글꼴 → 미리보기·공유": {
    en: "Add images → Colors & font → Preview & share",
    ja: "画像を追加 → 色・フォント → プレビュー・共有",
    "zh-CN": "添加图片 → 颜色与字体 → 预览与分享",
  },
  "테마 만들기": {
    en: "Create theme",
    ja: "テーマを作る",
    "zh-CN": "创建主题",
  },
  "코드 없이 만들고, 공유할 때만 로그인해요.": {
    en: "No code needed. Sign in only to share.",
    ja: "コードは不要。共有するときだけログインします。",
    "zh-CN": "无需代码，仅分享时需要登录。",
  },
  "이미 만든 테마 파일 올리기": {
    en: "Upload an existing theme package",
    ja: "作成済みのテーマをアップロード",
    "zh-CN": "上传已有主题文件",
  },
  "제작 매뉴얼": {
    en: "Creation manual",
    ja: "制作マニュアル",
    "zh-CN": "制作手册",
  },
  "그림과 폰트를 직접 만들었거나 재배포 권한이 있어요.": {
    en: "I created these images and fonts or have permission to redistribute them.",
    ja: "画像とフォントは自作、または再配布の許可があります。",
    "zh-CN": "这些图片和字体由我制作，或我拥有再分发权限。",
  },
  "테마 업로드": {
    en: "Upload theme",
    ja: "テーマをアップロード",
    "zh-CN": "上传主题",
  },
  "로그인하면 업로드할 수 있어요.": {
    en: "Sign in to upload.",
    ja: "ログインするとアップロードできます。",
    "zh-CN": "登录后即可上传。",
  },
  "업로드가 잠시 닫혀 있어요.": {
    en: "Uploads are temporarily closed.",
    ja: "アップロードは一時停止中です。",
    "zh-CN": "上传功能暂时关闭。",
  },
  "검사 후 무료 목록에 공개돼요.": {
    en: "After validation, it will be published in the free catalog.",
    ja: "検査後に無料一覧へ公開されます。",
    "zh-CN": "检查通过后将发布至免费主题列表。",
  },
  "미리보기를 읽지 못했어요.": {
    en: "Could not load preview.",
    ja: "プレビューを読み込めませんでした。",
    "zh-CN": "无法加载预览。",
  },
  "로그인했어요. 목록을 불러오지 못했지만 제작 중인 내용은 유지돼요.": {
    en: "Signed in. The catalog did not load, but your draft is safe.",
    ja: "ログインしました。一覧は読み込めませんでしたが、制作中の内容は残っています。",
    "zh-CN": "已登录。列表加载失败，但制作中的内容已保留。",
  },
  "로그인이 만료됐어요. 다시 로그인하면 만든 내용을 공유할 수 있어요.": {
    en: "Your session expired. Sign in again to share your draft.",
    ja: "ログインの期限が切れました。再ログインすると制作中の内容を共有できます。",
    "zh-CN": "登录已过期，重新登录即可分享制作的内容。",
  },
  "아이디는 영문·숫자·밑줄로 3~32자를 입력해 주세요.": {
    en: "Use 3–32 letters, numbers or underscores for your ID.",
    ja: "IDは英数字・下線で3～32文字にしてください。",
    "zh-CN": "账号请输入3至32位字母、数字或下划线。",
  },
  "비밀번호를 10~128자로 입력해 주세요.": {
    en: "Use 10–128 characters for your password.",
    ja: "パスワードは10～128文字にしてください。",
    "zh-CN": "密码请输入10至128个字符。",
  },
  "비밀번호가 서로 달라요. 확인란을 다시 입력해 주세요.": {
    en: "Passwords do not match. Check the confirmation field.",
    ja: "パスワードが一致しません。確認欄を入力し直してください。",
    "zh-CN": "两次密码不一致，请重新输入确认密码。",
  },
  "가입 완료! 자동으로 로그인했어요. 모든 테마를 무료로 이용하세요.": {
    en: "Account created! You are signed in. All themes are free.",
    ja: "登録完了！自動でログインしました。全テーマを無料で利用できます。",
    "zh-CN": "注册成功，已自动登录。所有主题均可免费使用。",
  },
  "로그인했어요. 무료 테마를 받고 공유할 수 있어요.": {
    en: "Signed in. Get and share free themes.",
    ja: "ログインしました。無料テーマを入手・共有できます。",
    "zh-CN": "已登录，可获取和分享免费主题。",
  },
  "로그인은 완료됐지만 테마 목록을 불러오지 못했어요. 목록 새로고침을 눌러주세요.":
    {
      en: "Signed in, but the catalog did not load. Refresh the list.",
      ja: "ログインは完了しましたが一覧を読み込めませんでした。一覧を更新してください。",
      "zh-CN": "登录成功，但主题列表加载失败。请刷新列表。",
    },
  "로그인 서버에 연결하지 못했어요. 다시 시도해 주세요.": {
    en: "Could not reach the sign-in server. Please try again.",
    ja: "ログインサーバーに接続できませんでした。再試行してください。",
    "zh-CN": "无法连接登录服务器，请重试。",
  },
  "이미 사용": { en: "Already in use", ja: "使用済み", "zh-CN": "已被使用" },
  "가입한 아이디라면 로그인 화면을 이용해 주세요.": {
    en: "Already registered? Use the sign-in tab.",
    ja: "登録済みのIDならログイン画面を使ってください。",
    "zh-CN": "如已注册，请使用登录页面。",
  },
  "로그아웃했어요. 설치한 테마는 계속 사용할 수 있어요.": {
    en: "Signed out. Installed themes remain available.",
    ja: "ログアウトしました。導入済みのテーマは引き続き使えます。",
    "zh-CN": "已退出登录，仍可使用已安装的主题。",
  },
  "로그인과 업로드 상태를 확인해 주세요.": {
    en: "Check your sign-in and upload status.",
    ja: "ログインとアップロードの状態を確認してください。",
    "zh-CN": "请检查登录和上传状态。",
  },
  "공유 권한을 확인해 주세요.": {
    en: "Please confirm redistribution rights.",
    ja: "共有する権利を確認してください。",
    "zh-CN": "请确认分享权限。",
  },
  "무료 테마로 공유했어요. 목록에서 확인할 수 있어요.": {
    en: "Shared as a free theme. Find it in the catalog.",
    ja: "無料テーマとして共有しました。一覧で確認できます。",
    "zh-CN": "已分享为免费主题，可在列表中查看。",
  },
  "선택한 곳에 적용했어요. 직전 모습으로 되돌릴 수 있어요.": {
    en: "Applied to your selection. You can undo this appearance change.",
    ja: "選んだ場所に適用しました。直前の見た目に戻せます。",
    "zh-CN": "已应用至所选位置，可恢复为之前的外观。",
  },
  "직전 모습으로 돌아왔어요.": {
    en: "Restored the previous appearance.",
    ja: "直前の見た目に戻しました。",
    "zh-CN": "已恢复之前的外观。",
  },
  "설치했어요. 원하는 곳을 골라 적용해 주세요.": {
    en: "Installed. Choose where to apply it.",
    ja: "インストールしました。適用先を選んでください。",
    "zh-CN": "已安装，请选择应用位置。",
  },
  "메인 화면": { en: "Main window", ja: "メイン画面", "zh-CN": "主窗口" },
  "작은 화분": { en: "Desktop pot", ja: "小さな植木鉢", "zh-CN": "桌面花盆" },
  글꼴: { en: "Font", ja: "フォント", "zh-CN": "字体" },
  "{3} 상세 보기": { en: "{3} details", ja: "{3} の詳細", "zh-CN": "{3}详情" },
  "{6} 미리보기": {
    en: "{6} preview",
    ja: "{6} のプレビュー",
    "zh-CN": "{6}预览",
  },
  "미리보기 불러오는 중": {
    en: "Loading preview",
    ja: "プレビューを読み込み中",
    "zh-CN": "正在加载预览",
  },
  무료: { en: "Free", ja: "無料", "zh-CN": "免费" },
  "사용 중": { en: "In use", ja: "使用中", "zh-CN": "使用中" },
  설치됨: { en: "Installed", ja: "導入済み", "zh-CN": "已安装" },
  "내 기기에 보관됨": {
    en: "Saved on this device",
    ja: "この端末に保存済み",
    "zh-CN": "已保存在本设备",
  },
  "이미 설치한 테마 · 다시 받기 가능": {
    en: "Already installed · available to download again",
    ja: "導入済み · 再ダウンロード可能",
    "zh-CN": "已安装 · 可重新下载",
  },
  "화면과 지원 범위 확인하기": {
    en: "Explore appearance and supported areas",
    ja: "見た目と対応範囲を確認",
    "zh-CN": "查看外观和支持范围",
  },
  "선택해서 미리 보고 적용해요": {
    en: "Select to preview and apply",
    ja: "選択してプレビュー・適用",
    "zh-CN": "选择后预览并应用",
  },
  "테마 미리보기 범위": {
    en: "Preview area",
    ja: "プレビュー範囲",
    "zh-CN": "预览范围",
  },
  "미리보기는 현재 사용 중인 모습을 바꾸지 않아요.": {
    en: "Previewing does not change your current appearance.",
    ja: "プレビューでは現在の見た目は変わりません。",
    "zh-CN": "预览不会更改当前外观。",
  },
  "다시 불러오기": { en: "Reload", ja: "再読み込み", "zh-CN": "重新加载" },
  "이 테마의 모습을 확인하고 있어요…": {
    en: "Loading this theme…",
    ja: "テーマの見た目を確認中…",
    "zh-CN": "正在加载此主题…",
  },
  "글꼴 포함": { en: "Font included", ja: "フォント付き", "zh-CN": "包含字体" },
  "가나다, 나만의 작은 공간": {
    en: "Hello, my little space",
    ja: "こんにちは、私の小さな空間",
    "zh-CN": "你好，我的小天地",
  },
  "기본 글꼴로 표시한 문구 예시예요.": {
    en: "Sample text shown in the default font.",
    ja: "標準フォントによる文例です。",
    "zh-CN": "此示例文本使用默认字体显示。",
  },
  "테마 글꼴 {0}은 설치 후 명시적으로 선택할 때 적용해요. 개인 업로드 글꼴이 우선해요.":
    {
      en: "Theme font {0} is applied only when explicitly selected after installation. Your uploaded font takes priority.",
      ja: "テーマフォント{0}は導入後に明示的に選んだときに適用します。個人のフォントが優先されます。",
      "zh-CN": "安装后需主动选择才会应用主题字体{0}，个人上传字体优先。",
    },
  "관리 파일": { en: "Managed files", ja: "管理ファイル", "zh-CN": "管理文件" },
  "파일 하나, 초록 한 칸.": {
    en: "One file, a little green.",
    ja: "ファイルひとつ、緑ひとつ。",
    "zh-CN": "一个文件，一抹绿意。",
  },
  "메인 화면 정원 예시": {
    en: "Main window garden preview",
    ja: "メイン画面の庭の例",
    "zh-CN": "主窗口花园预览",
  },
  "업무 화면 예시": {
    en: "Example workspace",
    ja: "作業画面の例",
    "zh-CN": "工作界面示例",
  },
  "작은 화분 미리보기": {
    en: "Desktop pot preview",
    ja: "小さな植木鉢のプレビュー",
    "zh-CN": "桌面花盆预览",
  },
  "작업을 가리지 않는 작은 자리": {
    en: "A little space that stays out of your way",
    ja: "作業を邪魔しない小さな場所",
    "zh-CN": "不遮挡工作的小天地",
  },
  "지원 범위와 권리 안내": {
    en: "Compatibility & rights",
    ja: "対応範囲と権利",
    "zh-CN": "支持范围与权利说明",
  },
  "제작자 표기: {8}": {
    en: "Creator: {8}",
    ja: "制作者: {8}",
    "zh-CN": "创作者：{8}",
  },
  "라이선스: {9}": {
    en: "License: {9}",
    ja: "ライセンス: {9}",
    "zh-CN": "许可证：{9}",
  },
  "파일 관리와 버전 보관에는 영향을 주지 않아요.": {
    en: "Does not affect file management or version storage.",
    ja: "ファイル管理とバージョン保管には影響しません。",
    "zh-CN": "不会影响文件管理和版本保存。",
  },
  "강조 색상": {
    en: "Accent color",
    ja: "アクセントカラー",
    "zh-CN": "强调色",
  },
  "조용한 모습으로 사용해요": {
    en: "Keep the view calm",
    ja: "落ち着いた見た目で使う",
    "zh-CN": "使用安静的外观",
  },
  "강조 색상 {0}": {
    en: "Accent color {0}",
    ja: "アクセントカラー {0}",
    "zh-CN": "强调色 {0}",
  },
  "테마 기본색": {
    en: "Theme default color",
    ja: "テーマの標準色",
    "zh-CN": "主题默认颜色",
  },
  "발견한 작은 풍경": {
    en: "A little scene to discover",
    ja: "見つけた小さな風景",
    "zh-CN": "发现的小风景",
  },
  "로컬 테마": { en: "Local theme", ja: "ローカルテーマ", "zh-CN": "本地主题" },
  "지원 범위 확인 중": {
    en: "Checking compatibility",
    ja: "対応範囲を確認中",
    "zh-CN": "正在检查支持范围",
  },
  "v{0} · 앱 {1} 이상": {
    en: "v{0} · requires app {1} or later",
    ja: "v{0} · アプリ{1}以降",
    "zh-CN": "v{0} · 需要应用{1}或更新版本",
  },
  "지금은 모든 테마를 무료로 즐겨요.": {
    en: "All themes are currently free.",
    ja: "現在、すべてのテーマが無料です。",
    "zh-CN": "目前所有主题均免费。",
  },
  "다시 받기": {
    en: "Download again",
    ja: "もう一度入手",
    "zh-CN": "重新下载",
  },
  "무료로 받기": { en: "Get for free", ja: "無料で入手", "zh-CN": "免费获取" },
  "받기가 잠시 닫혀 있어요.": {
    en: "Downloads are temporarily closed.",
    ja: "ダウンロードは一時停止中です。",
    "zh-CN": "下载功能暂时关闭。",
  },
  "받은 뒤 내 테마에서 적용할 수 있어요.": {
    en: "After downloading, apply it from My themes.",
    ja: "入手後、マイテーマから適用できます。",
    "zh-CN": "下载后可在我的主题中应用。",
  },
  "받을 때만 로그인해요. 고른 테마는 유지돼요.": {
    en: "Sign in only to download. Your selection will stay.",
    ja: "入手時だけログインします。選んだテーマは保持します。",
    "zh-CN": "仅下载时需要登录，所选主题会保留。",
  },
  "적용할 곳": { en: "Apply to", ja: "適用先", "zh-CN": "应用到" },
  "선택하지 않은 곳과 내 업로드 글꼴은 유지해요.": {
    en: "Unselected areas and your uploaded font stay unchanged.",
    ja: "未選択の場所と個人のフォントは変わりません。",
    "zh-CN": "未选择的区域和个人上传字体保持不变。",
  },
  "이 테마 관리": {
    en: "Manage this theme",
    ja: "このテーマを管理",
    "zh-CN": "管理此主题",
  },
  "삭제하면 사용 중인 해당 범위는 기본 모습으로 바뀌어요. 이전 모습으로 되돌리기 기록도 지워져요.":
    {
      en: "Deleting resets its active areas to the default appearance and clears the previous-appearance undo record.",
      ja: "削除すると使用中の範囲が標準に戻り、直前の見た目に戻す履歴も消えます。",
      "zh-CN":
        "删除后，正在使用的对应区域恢复默认外观，并清除之前外观的撤销记录。",
    },
  "도 바꾸기": { en: "also", ja: "も変更", "zh-CN": "也更改" },
  "선택한 곳에 적용하기": {
    en: "Apply to selected areas",
    ja: "選んだ場所に適用",
    "zh-CN": "应用到所选区域",
  },
  "에 사용 중": { en: "in use", ja: "で使用中", "zh-CN": "正在使用" },
  "선택됨 · 아직 적용하지 않았어요": {
    en: "Selected · not applied yet",
    ja: "選択済み · まだ未適用",
    "zh-CN": "已选择 · 尚未应用",
  },
  "직전 모습으로 되돌리기": {
    en: "Restore previous appearance",
    ja: "直前の見た目に戻す",
    "zh-CN": "恢复之前的外观",
  },
  "이 기기에서 삭제": {
    en: "Delete from this device",
    ja: "この端末から削除",
    "zh-CN": "从本设备删除",
  },
  "오늘의 책상에 어울리는 작은 풍경을 찾아보세요.": {
    en: "Find a little scene for your desk today.",
    ja: "今日の机に合う、小さな風景を探しましょう。",
    "zh-CN": "为今天的桌面寻找一处小风景。",
  },
  "테마 페이지": { en: "Themes page", ja: "テーマページ", "zh-CN": "主题页面" },
  "연결 상태": { en: "Connection status", ja: "接続状態", "zh-CN": "连接状态" },
  "내 테마": { en: "My themes", ja: "マイテーマ", "zh-CN": "我的主题" },
  "테마 만들고 나누기": {
    en: "Create & share a theme",
    ja: "テーマを作って共有",
    "zh-CN": "制作并分享主题",
  },
  님: { en: "· account", ja: "さん", "zh-CN": "· 账号" },
  둘러보기: { en: "Explore", ja: "見つける", "zh-CN": "浏览" },
  "처리 중이에요…": { en: "Working…", ja: "処理中…", "zh-CN": "正在处理…" },
  "← 내 테마 목록": {
    en: "← My themes",
    ja: "← マイテーマ一覧",
    "zh-CN": "← 我的主题列表",
  },
  "← 테마 둘러보기": {
    en: "← Explore themes",
    ja: "← テーマを探す",
    "zh-CN": "← 浏览主题",
  },
  "내 화면에서는 어떻게 보일까요?": {
    en: "How will it look on your screen?",
    ja: "自分の画面ではどう見える？",
    "zh-CN": "在你的屏幕上会是什么样子？",
  },
  "취향을 살짝 더한 뒤 적용해요.": {
    en: "Make it yours before applying.",
    ja: "好みを加えてから適用しましょう。",
    "zh-CN": "按喜好调整后再应用。",
  },
  "테마 찾기": { en: "Find themes", ja: "テーマを検索", "zh-CN": "查找主题" },
  "현재 페이지에서 이름·제작자 검색": {
    en: "Search this page by name or creator",
    ja: "このページの名前・制作者を検索",
    "zh-CN": "在当前页搜索名称或创作者",
  },
  "설치한 테마 이름 검색": {
    en: "Search installed theme names",
    ja: "導入済みのテーマ名を検索",
    "zh-CN": "搜索已安装主题名称",
  },
  "설치한 테마는 오프라인에서도 사용해요.": {
    en: "Installed themes work offline too.",
    ja: "導入済みのテーマはオフラインでも使えます。",
    "zh-CN": "已安装的主题也可离线使用。",
  },
  "모든 테마 무료 · 최신 등록순": {
    en: "All themes free · newest first",
    ja: "全テーマ無料 · 新着順",
    "zh-CN": "所有主题免费 · 按最新发布排序",
  },
  "목록 새로고침": {
    en: "Refresh list",
    ja: "一覧を更新",
    "zh-CN": "刷新列表",
  },
  "받은 파일 설치": {
    en: "Install downloaded file",
    ja: "入手したファイルを導入",
    "zh-CN": "安装已下载文件",
  },
  "찾는 테마가 없어요": {
    en: "No matching themes",
    ja: "一致するテーマがありません",
    "zh-CN": "未找到匹配的主题",
  },
  "아직 받은 테마가 없어요": {
    en: "No themes downloaded yet",
    ja: "まだ入手したテーマはありません",
    "zh-CN": "尚未下载主题",
  },
  "등록된 테마가 없어요": {
    en: "No themes published yet",
    ja: "まだ登録されたテーマはありません",
    "zh-CN": "尚无已发布主题",
  },
  "작은 풍경을 불러오고 있어요": {
    en: "Loading little scenes",
    ja: "小さな風景を読み込み中",
    "zh-CN": "正在加载小风景",
  },
  "둘러보기에서 테마를 받거나, 가진 테마 파일을 설치해 보세요.": {
    en: "Explore and download themes, or install a theme file you already have.",
    ja: "一覧からテーマを入手するか、持っているファイルを導入してください。",
    "zh-CN": "可浏览并下载主题，或安装已有的主题文件。",
  },
  "검색어를 바꿔 보세요.": {
    en: "Try a different search.",
    ja: "検索語を変えてください。",
    "zh-CN": "请尝试其他搜索词。",
  },
  "연결되지 않으면 목록 새로고침을 눌러주세요.": {
    en: "If disconnected, try refreshing the list.",
    ja: "接続できない場合は一覧を更新してください。",
    "zh-CN": "连接失败时请刷新列表。",
  },
  "{1} 페이지": { en: "Page {1}", ja: "{1}ページ", "zh-CN": "第{1}页" },
  "기본 창틀로 돌아가기": {
    en: "Restore default windowsill",
    ja: "標準の窓辺に戻す",
    "zh-CN": "恢复默认窗台",
  },
  "연결 전": { en: "Not connected", ja: "未接続", "zh-CN": "未连接" },
  "· 대체 경로 사용 중": {
    en: "· Using fallback connection",
    ja: "· 代替経路を使用中",
    "zh-CN": "· 正在使用备用连接",
  },
  "폰트를 읽지 못했어요. 다른 TTF·OTF·WOFF·WOFF2 파일을 선택해 주세요.": {
    en: "Could not read the font. Choose another TTF, OTF, WOFF or WOFF2 file.",
    ja: "フォントを読めませんでした。別のTTF・OTF・WOFF・WOFF2を選んでください。",
    "zh-CN": "无法读取字体，请选择其他TTF、OTF、WOFF或WOFF2文件。",
  },
  "저장한 폰트를 불러오지 못해 기본 폰트를 사용해요. 파일을 다시 가져와 주세요.":
    {
      en: "Could not load your saved font. Using the default; please import the font again.",
      ja: "保存済みフォントを読み込めず標準を使っています。再度取り込んでください。",
      "zh-CN": "无法加载已保存字体，正在使用默认字体。请重新导入。",
    },
  "나의 작은 창틀": {
    en: "My little windowsill",
    ja: "私の小さな窓辺",
    "zh-CN": "我的小小窗台",
  },
  "아직 저장하지 않은 테마예요. 제작 화면을 닫을까요?": {
    en: "This theme has unsaved changes. Close the creator?",
    ja: "未保存のテーマです。制作画面を閉じますか？",
    "zh-CN": "主题尚未保存，关闭制作页面吗？",
  },
  "그림은 8MB 이하로 선택해 주세요.": {
    en: "Choose an image up to 8 MB.",
    ja: "8MB以下の画像を選んでください。",
    "zh-CN": "请选择不超过8MB的图片。",
  },
  "테마 이름을 1~60자로 입력해 주세요.": {
    en: "Enter a theme name with 1–60 characters.",
    ja: "テーマ名を1～60文字で入力してください。",
    "zh-CN": "主题名称请输入1至60个字符。",
  },
  "글꼴을 함께 나누려면 2단계에서 라이선스 TXT도 선택해 주세요.": {
    en: "To share a font, add its license TXT in step 2.",
    ja: "フォントを共有する場合は、手順2でライセンスTXTも選んでください。",
    "zh-CN": "分享字体时，请在第2步添加许可证TXT文件。",
  },
  "내 창틀": { en: "My windowsill", ja: "私の窓辺", "zh-CN": "我的窗台" },
  "테마가 5MB를 넘어요. 그림이나 글꼴 크기를 줄여 주세요.": {
    en: "The theme exceeds 5 MB. Reduce image or font size.",
    ja: "テーマが5MBを超えています。画像やフォントを小さくしてください。",
    "zh-CN": "主题超过5MB，请减小图片或字体大小。",
  },
  "어떤 그림을 올려볼까요?": {
    en: "Which image would you like to use?",
    ja: "どんな画像を使いますか？",
    "zh-CN": "想使用什么图片？",
  },
  "기본 도트 화분으로 시작해도 좋아요. 사진을 넣으면 작은 창틀의 화분 자리 전체를 바꿔요.":
    {
      en: "Start with the default pixel pot, or add an image to replace the whole pot area.",
      ja: "標準のドット絵から始められます。画像を入れると植木鉢の領域全体を置き換えます。",
      "zh-CN": "可从默认像素花盆开始，也可添加图片替换整个花盆区域。",
    },
  "그림 놓는 곳": {
    en: "Image drop area",
    ja: "画像を置く場所",
    "zh-CN": "图片拖放区域",
  },
  "사진이나 그림을 여기에 놓으세요": {
    en: "Drop a photo or illustration here",
    ja: "写真やイラストをここに置く",
    "zh-CN": "将照片或插画拖到这里",
  },
  "PNG · JPG · WebP / 8MB 이하": {
    en: "PNG · JPG · WebP / up to 8 MB",
    ja: "PNG · JPG · WebP / 8MB以下",
    "zh-CN": "PNG · JPG · WebP / 不超过8MB",
  },
  "그림 선택": { en: "Choose image", ja: "画像を選択", "zh-CN": "选择图片" },
  "크기는 자동으로 맞춰요. 사진 배경도 함께 표시돼요. 배경 없는 그림은 투명 PNG를 골라 주세요.":
    {
      en: "Images resize automatically, including their background. Choose a transparent PNG for no background.",
      ja: "サイズは自動調整します。背景も表示されます。背景なしには透過PNGを選んでください。",
      "zh-CN": "自动调整尺寸并保留图片背景。无需背景时请选择透明PNG。",
    },
  "기본 그림으로 돌아가기": {
    en: "Restore default art",
    ja: "標準の画像に戻す",
    "zh-CN": "恢复默认图片",
  },
  "성장할 때 그림도 바꾸고 싶어요": {
    en: "Use different images as plants grow",
    ja: "成長段階ごとに画像を変える",
    "zh-CN": "随成长阶段更换图片",
  },
  "선택하지 않은 단계는 위 그림을 사용해요. 한 장만 넣으면 모든 화분과 성장단계에 같은 그림이 보여요.":
    {
      en: "Unselected stages use the shared image. One image applies to every pot and growth stage.",
      ja: "未選択の段階には共通の画像を使います。1枚なら全植木鉢・全成長段階で同じ画像になります。",
      "zh-CN":
        "未选择的阶段使用通用图片。只添加一张时，所有花盆和成长阶段均使用同一图片。",
    },
  "기본 도트 그림을 사용하고 있어요": {
    en: "Using the default pixel art",
    ja: "標準のドット絵を使用中",
    "zh-CN": "正在使用默认像素图",
  },
  "{0} 그림": { en: "{0} image", ja: "{0}の画像", "zh-CN": "{0}图片" },
  "공통 그림 사용": {
    en: "Using shared image",
    ja: "共通の画像を使用",
    "zh-CN": "使用通用图片",
  },
  "이 단계 그림 제거": {
    en: "Remove image for this stage",
    ja: "この段階の画像を削除",
    "zh-CN": "移除此阶段图片",
  },
  "좋아하는 분위기를 골라요": {
    en: "Choose your atmosphere",
    ja: "好きな雰囲気を選ぶ",
    "zh-CN": "选择喜欢的氛围",
  },
  "글자와 카드 색상은 읽기 좋게 자동으로 맞춰 드려요.": {
    en: "Text and card colors adjust automatically for readability.",
    ja: "文字とカードの色は読みやすく自動調整します。",
    "zh-CN": "文字和卡片颜色会自动调整，确保易于阅读。",
  },
  "배경 색상": { en: "Background color", ja: "背景色", "zh-CN": "背景色" },
  "글꼴도 바꾸기 · 선택 사항": {
    en: "Change font · optional",
    ja: "フォント変更 · 任意",
    "zh-CN": "更改字体 · 可选",
  },
  "없으면 기본 글꼴을 사용해요. 다른 사람에게도 나눌 수 있는 글꼴만 넣어 주세요.":
    {
      en: "Leave blank for the default font. Only include fonts you may redistribute.",
      ja: "指定しなければ標準フォントを使います。再配布できるフォントだけを選んでください。",
      "zh-CN": "不添加则使用默认字体。请仅添加可再分发的字体。",
    },
  "글꼴 파일": { en: "Font file", ja: "フォントファイル", "zh-CN": "字体文件" },
  "글꼴 라이선스 파일": {
    en: "Font license file",
    ja: "フォントのライセンスファイル",
    "zh-CN": "字体许可证文件",
  },
  초록빛: { en: "Green", ja: "緑", "zh-CN": "绿意" },
  보랏빛: { en: "Purple", ja: "紫", "zh-CN": "紫色" },
  밤하늘: { en: "Night sky", ja: "夜空", "zh-CN": "夜空" },
  "기본 글꼴 · 별도 파일이 필요 없어요": {
    en: "Default font · no file required",
    ja: "標準フォント · ファイル不要",
    "zh-CN": "默认字体 · 无需文件",
  },
  "글꼴과 함께 받은 라이선스 TXT · 32KB 이하": {
    en: "License TXT supplied with font · up to 32 KB",
    ja: "フォント付属のライセンスTXT · 32KB以下",
    "zh-CN": "字体附带的许可证TXT · 不超过32KB",
  },
  "기본 글꼴 사용": {
    en: "Use default font",
    ja: "標準フォントを使う",
    "zh-CN": "使用默认字体",
  },
  "이대로 나눠볼까요?": {
    en: "Ready to share?",
    ja: "このテーマを共有しますか？",
    "zh-CN": "准备好分享了吗？",
  },
  "테마 이름": { en: "Theme name", ja: "テーマ名", "zh-CN": "主题名称" },
  "메인 화면 색상 · 작은 창틀 그림{1}을 함께 담아요. 미리보기의 폴더와 파일은 예시예요.":
    {
      en: "Includes main window colors and desktop pot art{1}. Preview folders and files are examples.",
      ja: "メイン画面の色と小窓の画像{1}を含みます。プレビューのファイルやフォルダーは例です。",
      "zh-CN": "包含主窗口颜色和小窗台图片{1}。预览中的文件夹和文件为示例。",
    },
  가격: { en: "Price", ja: "価格", "zh-CN": "价格" },
  "그림·글꼴을 직접 만들었거나 재배포 권한이 있어요.": {
    en: "I made these images and fonts, or have redistribution rights.",
    ja: "画像・フォントは自作、または再配布の権利があります。",
    "zh-CN": "图片和字体由我制作，或我拥有再分发权限。",
  },
  "공유하면 다른 회원이 무료로 받을 수 있어요. 원본 사진은 따로 올리지 않고, 맞춤 크기의 테마 그림만 전송해요.":
    {
      en: "Members can download shared themes for free. Only resized theme art is sent, not the original photo separately.",
      ja: "共有したテーマは会員が無料で入手できます。元の写真は別送せず、調整済みのテーマ画像だけを送ります。",
      "zh-CN":
        "分享后其他会员可免费下载。仅发送调整尺寸后的主题图片，不单独上传原照片。",
    },
  "· 글꼴": { en: "· font", ja: "· フォント", "zh-CN": "· 字体" },
  "제작 중인 내용은 그대로 유지돼요. 내 파일로 저장은 로그인 없이 할 수 있어요.":
    {
      en: "Your draft stays here. Saving a file does not require login.",
      ja: "制作中の内容はそのまま残ります。ファイル保存にはログイン不要です。",
      "zh-CN": "制作内容会保留，保存文件无需登录。",
    },
  "아이디: 영문·숫자·밑줄 3~32자 / 비밀번호: 10~128자": {
    en: "ID: 3–32 letters, numbers or underscores / Password: 10–128 characters",
    ja: "ID: 英数字・下線3～32文字 / パスワード: 10～128文字",
    "zh-CN": "账号：3至32位字母、数字或下划线 / 密码：10至128个字符",
  },
  "공유하려면 로그인해 주세요": {
    en: "Sign in to share",
    ja: "共有するにはログイン",
    "zh-CN": "登录后分享",
  },
  "가입하고 계속하기": {
    en: "Create account & continue",
    ja: "登録して続ける",
    "zh-CN": "注册并继续",
  },
  "로그인하고 계속하기": {
    en: "Sign in & continue",
    ja: "ログインして続ける",
    "zh-CN": "登录并继续",
  },
  "{0} 님의 테마로 공유해요.": {
    en: "Sharing as {0}.",
    ja: "{0}さんのテーマとして共有します。",
    "zh-CN": "以{0}的主题进行分享。",
  },
  "나만의 분위기를 한 걸음씩": {
    en: "Your own atmosphere, step by step",
    ja: "自分だけの雰囲気を一歩ずつ",
    "zh-CN": "一步步打造专属氛围",
  },
  "제작 화면 닫기": {
    en: "Close theme creator",
    ja: "制作画面を閉じる",
    "zh-CN": "关闭主题制作器",
  },
  "테마를 공유했어요": {
    en: "Theme shared",
    ja: "テーマを共有しました",
    "zh-CN": "主题已分享",
  },
  "{0} · 모든 회원에게 무료로 공개됐어요.": {
    en: "{0} · Published free for all members.",
    ja: "{0} · 全会員に無料公開しました。",
    "zh-CN": "{0} · 已向所有会员免费公开。",
  },
  "테마 목록에서 받아 내 창틀에 적용해 보세요.": {
    en: "Download from the catalog and apply to your windowsill.",
    ja: "一覧から入手して窓辺に適用してください。",
    "zh-CN": "可从主题列表下载并应用到窗台。",
  },
  "목록으로 돌아가기": {
    en: "Back to catalog",
    ja: "一覧に戻る",
    "zh-CN": "返回列表",
  },
  "테마 제작 단계": {
    en: "Theme creation steps",
    ja: "テーマ制作の手順",
    "zh-CN": "主题制作步骤",
  },
  "테마 미리보기": {
    en: "Theme preview",
    ja: "テーマのプレビュー",
    "zh-CN": "主题预览",
  },
  "메인 프로그램 예시": {
    en: "Main app preview",
    ja: "メインアプリの例",
    "zh-CN": "主应用预览",
  },
  "조금씩 정리하는 하루": {
    en: "A little tidying each day",
    ja: "少しずつ整理する毎日",
    "zh-CN": "每天整理一点",
  },
  "우측 하단의 작은 창틀": {
    en: "Desktop corner windowsill",
    ja: "画面右下の小さな窓辺",
    "zh-CN": "右下角的小窗台",
  },
  "작은 창틀 그림 미리보기": {
    en: "Windowsill art preview",
    ja: "窓辺の画像プレビュー",
    "zh-CN": "窗台图片预览",
  },
  "화분 개수": { en: "Pot count", ja: "植木鉢の数", "zh-CN": "花盆数量" },
  "성장 단계": { en: "Growth stage", ja: "成長段階", "zh-CN": "成长阶段" },
  "그림의 배경 제거·도트 변환은 하지 않아요. 실제 표시 개수는 연결한 화분 수를 따라가요.":
    {
      en: "No automatic background removal or pixel conversion. Actual pot count follows your connected pots.",
      ja: "背景除去・ドット絵変換は行いません。実際の表示数は接続した植木鉢に従います。",
      "zh-CN":
        "不会自动去除背景或转换为像素图。实际显示数量取决于已关联的花盆。",
    },
  "그림 넣기": { en: "Add images", ja: "画像を追加", "zh-CN": "添加图片" },
  "색상·글꼴": {
    en: "Colors & font",
    ja: "色・フォント",
    "zh-CN": "颜色与字体",
  },
  "미리보기·공유": {
    en: "Preview & share",
    ja: "プレビュー・共有",
    "zh-CN": "预览与分享",
  },
  "내 파일로 저장": {
    en: "Save as file",
    ja: "ファイルに保存",
    "zh-CN": "保存为文件",
  },
  "무료로 공유하기": {
    en: "Share for free",
    ja: "無料で共有",
    "zh-CN": "免费分享",
  },
  "내 기기에 설치": {
    en: "Install on my device",
    ja: "この端末にインストール",
    "zh-CN": "安装到本设备",
  },
  "현재 업로드가 잠시 닫혀 있어요. 내 파일로 저장해 주세요.": {
    en: "Uploads are closed for now. Save your theme as a file.",
    ja: "アップロードは一時停止中です。ファイルに保存してください。",
    "zh-CN": "上传暂时关闭，请将主题保存为文件。",
  },
  "2MB 이하 TTF, OTF, WOFF, WOFF2 글꼴을 선택해 주세요.": {
    en: "Choose a TTF, OTF, WOFF or WOFF2 font up to 2 MB.",
    ja: "2MB以下のTTF・OTF・WOFF・WOFF2を選んでください。",
    "zh-CN": "请选择不超过2MB的TTF、OTF、WOFF或WOFF2字体。",
  },
  "이 글꼴을 읽을 수 없어요. 다른 글꼴을 선택해 주세요.": {
    en: "Could not read this font. Choose another one.",
    ja: "このフォントを読めません。別のものを選んでください。",
    "zh-CN": "无法读取此字体，请选择其他字体。",
  },
  "라이선스는 32KB 이하 TXT 파일로 넣어 주세요.": {
    en: "Choose a license TXT file up to 32 KB.",
    ja: "32KB以下のライセンスTXTを選んでください。",
    "zh-CN": "请选择不超过32KB的许可证TXT文件。",
  },
  "라이선스는 UTF-8 텍스트로 저장해 주세요.": {
    en: "Save the license as UTF-8 text.",
    ja: "ライセンスはUTF-8で保存してください。",
    "zh-CN": "请将许可证保存为UTF-8文本。",
  },
  "내용이 있는 라이선스 TXT 파일을 선택해 주세요.": {
    en: "Choose a nonempty license TXT file.",
    ja: "内容のあるライセンスTXTを選んでください。",
    "zh-CN": "请选择非空的许可证TXT文件。",
  },
  "아이디와 비밀번호 입력 조건을 확인해 주세요.": {
    en: "Check the ID and password requirements.",
    ja: "IDとパスワードの条件を確認してください。",
    "zh-CN": "请检查账号和密码的输入要求。",
  },
  "비밀번호 확인이 일치하지 않아요.": {
    en: "Password confirmation does not match.",
    ja: "確認用のパスワードが一致しません。",
    "zh-CN": "确认密码不一致。",
  },
  "선택한 글꼴의 라이선스 TXT를 넣거나 기본 글꼴을 선택해 주세요.": {
    en: "Add the font license TXT, or use the default font.",
    ja: "フォントのライセンスTXTを追加するか標準フォントを使ってください。",
    "zh-CN": "请添加字体许可证TXT，或使用默认字体。",
  },
  "로그인과 공유 권한을 확인해 주세요.": {
    en: "Check your login and sharing rights.",
    ja: "ログインと共有権限を確認してください。",
    "zh-CN": "请检查登录状态与分享权限。",
  },
  "테마 파일을 저장했어요. 앱의 받은 파일 설치에서 사용할 수 있어요.": {
    en: "Theme file saved. Use Install downloaded file in the app.",
    ja: "テーマを保存しました。アプリのファイル導入で使えます。",
    "zh-CN": "主题文件已保存，可通过应用中的安装已下载文件使用。",
  },
  "내 기기에 설치했어요. 제작 화면을 닫고 적용을 눌러 주세요.": {
    en: "Installed on this device. Close the creator and apply the theme.",
    ja: "この端末に導入しました。制作画面を閉じて適用してください。",
    "zh-CN": "已安装到本设备，请关闭制作器后应用主题。",
  },
  "연결이 끊겼어요.": {
    en: "Connection lost.",
    ja: "接続が切れました。",
    "zh-CN": "连接已断开。",
  },
  "공유 결과가 불확실하면 목록을 확인한 뒤 다시 시도해 주세요.": {
    en: "If unsure whether sharing succeeded, check the catalog before retrying.",
    ja: "共有結果が不明なら、一覧を確認してから再試行してください。",
    "zh-CN": "如不确定是否分享成功，请先检查列表再重试。",
  },
  "코드를 몰라도 괜찮아요.": {
    en: "No coding needed.",
    ja: "コードの知識は不要です。",
    "zh-CN": "不需要懂代码。",
  },
  "에서 세 단계만 따라오세요.": {
    en: "guides you through three steps.",
    ja: "の3つの手順を進めてください。",
    "zh-CN": "中只需跟随三个步骤。",
  },
  "기본 도트 화분으로 시작하거나 사진을 골라요. 크기는 자동으로 맞춰요. 배경 없는 그림은 투명 PNG를 선택해 주세요.":
    {
      en: "Start with the default pixel pot or choose a photo. Images resize automatically; use a transparent PNG for no background.",
      ja: "標準のドット絵か写真を選びます。サイズは自動調整。背景なしには透過PNGを選んでください。",
      "zh-CN":
        "从默认像素花盆开始或选择照片。尺寸自动调整，无背景图片请选择透明PNG。",
    },
  "색상·글꼴 고르기": {
    en: "Choose colors & font",
    ja: "色・フォントを選ぶ",
    "zh-CN": "选择颜色与字体",
  },
  "좋아하는 분위기나 색을 선택해요. 글자색은 읽기 좋게 자동으로 맞춰요. 글꼴은 선택 사항이고, 함께 공유하려면 재배포 라이선스도 넣어 주세요.":
    {
      en: "Choose colors or a mood. Text contrast adjusts automatically. Fonts are optional; include a redistribution license to share one.",
      ja: "雰囲気や色を選びます。文字色は自動調整します。フォントは任意で、共有時には再配布ライセンスも必要です。",
      "zh-CN":
        "选择氛围或颜色，文字颜色自动调整。字体可选，分享字体时需附再分发许可证。",
    },
  "미리보고 공유하기": {
    en: "Preview & share",
    ja: "プレビューして共有",
    "zh-CN": "预览并分享",
  },
  "메인 화면과 작은 창틀을 확인하고 이름을 붙여요. 내 파일로 저장하거나, 로그인해서 무료로 공유할 수 있어요.":
    {
      en: "Check the main window and widget, then name your theme. Save a file, or sign in to share for free.",
      ja: "メイン画面と小窓を確認して名前を付けます。ファイル保存、またはログインして無料共有できます。",
      "zh-CN": "确认主窗口和小窗台并命名，可保存为文件，或登录后免费分享。",
    },
  "한 장만 넣으면 모든 화분과 성장단계에 같은 그림이 보여요. 성장에 따라 바꾸려면 ‘성장할 때 그림도 바꾸고 싶어요’를 열어 단계별 그림을 넣어 주세요.":
    {
      en: "One image appears on all pots and growth stages. To vary it with growth, open the stage image options and choose each image.",
      ja: "1枚なら全植木鉢・全成長段階で同じ画像です。成長ごとに変えるには段階別の画像設定を開いて選択してください。",
      "zh-CN":
        "仅一张图片时用于所有花盆和成长阶段。若想随成长变化，请打开分阶段图片选项逐一添加。",
    },
  "사진의 배경 제거·도트 변환은 자동으로 하지 않아요. 제작 중인 내용은 화면을 열어둔 동안 유지돼요. 앱이나 탭을 닫기 전에는 ‘내 파일로 저장’을 눌러 주세요.":
    {
      en: "Background removal and pixel conversion are not automatic. Your draft lasts while the creator stays open. Save a file before closing the app or tab.",
      ja: "背景除去やドット絵変換は自動ではありません。制作内容は画面を開いている間だけ残ります。アプリやタブを閉じる前にファイル保存してください。",
      "zh-CN":
        "不会自动去除背景或转换像素图。制作内容仅在页面打开期间保留，关闭应用或标签页前请保存为文件。",
    },
  "이미 만든 .silltheme 파일이 있다면 ‘이미 만든 테마 파일 올리기’를 이용하세요. 그림과 글꼴을 다른 사람에게 나눌 권한이 있어야 해요. 지금은 모든 테마가 무료예요.":
    {
      en: "Use package upload for an existing .silltheme file. You need rights to redistribute its images and fonts. All themes are currently free.",
      ja: "既存の.sillthemeはファイルのアップロードを利用してください。画像・フォントの再配布権が必要です。現在は全テーマ無料です。",
      "zh-CN":
        "已有.silltheme文件可使用文件上传。需拥有图片和字体的再分发权限，目前所有主题均免费。",
    },
  "표시 언어": { en: "Display language", ja: "表示言語", "zh-CN": "显示语言" },
  "언어를 바꾸면 메인 화면과 작은 창에 바로 적용돼요. 파일명과 폴더명은 바뀌지 않아요.":
    {
      en: "Changes apply immediately to the main window and widget. File and folder names stay unchanged.",
      ja: "メイン画面と小窓にすぐ反映します。ファイル名とフォルダー名は変わりません。",
      "zh-CN": "更改会立即应用至主窗口和小窗，文件名和文件夹名保持不变。",
    },
  씨앗: { en: "Seed", ja: "種", "zh-CN": "种子" },
  새싹: { en: "Sprout", ja: "芽", "zh-CN": "嫩芽" },
  "푸른 잎": { en: "Green leaves", ja: "青々とした葉", "zh-CN": "绿叶" },
  "활짝 핀 꽃": { en: "Full bloom", ja: "満開", "zh-CN": "盛开" },
  무성함: { en: "Lush", ja: "茂る", "zh-CN": "茂盛" },
  꽃피움: { en: "Bloom", ja: "開花", "zh-CN": "开花" },
  "작은 창틀 열기": {
    en: "Open Little Windowsill",
    ja: "小さな窓辺を開く",
    "zh-CN": "打开小小窗台",
  },
  "창틀 정리 모드": {
    en: "Windowsill organize mode",
    ja: "窓辺の整理モード",
    "zh-CN": "窗台整理模式",
  },
  "창틀 숨기기": {
    en: "Hide windowsill",
    ja: "窓辺を隠す",
    "zh-CN": "隐藏窗台",
  },
  종료: { en: "Quit", ja: "終了", "zh-CN": "退出" },
  "정원 관리 · 파일 정리": {
    en: "Garden manager · organize files",
    ja: "庭の管理・ファイル整理",
    "zh-CN": "花园管理 · 整理文件",
  },
  "크기: 왼쪽 위 모서리를 드래그": {
    en: "Resize: drag the top-left corner",
    ja: "サイズ変更: 左上の角をドラッグ",
    "zh-CN": "调整大小：拖动左上角",
  },
  "작은 기본 크기로 ({0} × 100)": {
    en: "Reset to compact size ({0} × 100)",
    ja: "小さな標準サイズへ ({0} × 100)",
    "zh-CN": "恢复紧凑尺寸（{0} × 100）",
  },
  "작은 창틀 · 정원": {
    en: "Little Windowsill · garden",
    ja: "小さな窓辺 · 庭",
    "zh-CN": "小小窗台 · 花园",
  },
  "공유할 테마 선택": {
    en: "Choose theme to share",
    ja: "共有するテーマを選択",
    "zh-CN": "选择要分享的主题",
  },
  "받은 테마 파일 설치": {
    en: "Install a downloaded theme file",
    ja: "入手したテーマファイルを導入",
    "zh-CN": "安装已下载的主题文件",
  },
  "창틀 테마": {
    en: "Windowsill theme",
    ja: "窓辺のテーマ",
    "zh-CN": "窗台主题",
  },
  "화분에 연결할 폴더 선택": {
    en: "Choose a folder for this pot",
    ja: "植木鉢に接続するフォルダーを選択",
    "zh-CN": "选择此花盆要关联的文件夹",
  },
  "정리할 파일 선택": {
    en: "Choose files to organize",
    ja: "整理するファイルを選択",
    "zh-CN": "选择要整理的文件",
  },
  "이전 버전을 다른 이름으로 복원": {
    en: "Restore previous version as a new file",
    ja: "以前のバージョンを別名で復元",
    "zh-CN": "将历史版本恢复为新文件",
  },
  "이 이름으로 복원": {
    en: "Restore with this name",
    ja: "この名前で復元",
    "zh-CN": "以此名称恢复",
  },
  "앱에서 사용할 폰트 선택": {
    en: "Choose an app font",
    ja: "アプリのフォントを選択",
    "zh-CN": "选择应用字体",
  },
  폰트: { en: "Font", ja: "フォント", "zh-CN": "字体" },
  "앱에 담긴 기본 테마": {
    en: "Included themes",
    ja: "アプリの標準テーマ",
    "zh-CN": "内置主题",
  },
  "로그인 없이 바로 적용해요 · 항상 무료": {
    en: "Apply without signing in · Always free",
    ja: "ログイン不要ですぐ適用 · いつでも無料",
    "zh-CN": "无需登录即可应用 · 永久免费",
  },
  "함께 나누는 테마": {
    en: "Community themes",
    ja: "みんなのテーマ",
    "zh-CN": "社区主题",
  },
  애니메이션: { en: "Animated", ja: "アニメーション", "zh-CN": "动画" },
  "기본 제공": { en: "Included", ja: "標準搭載", "zh-CN": "内置" },
  "폴더 순서를 저장했어요.": {
    en: "Folder order saved.",
    ja: "フォルダーの順序を保存しました。",
    "zh-CN": "文件夹顺序已保存。",
  },
  "카드를 끌어 순서를 바꿔요. 키보드: Alt + 왼쪽·오른쪽 화살표": {
    en: "Drag cards to reorder. Keyboard: Alt + Left/Right arrow",
    ja: "カードをドラッグして並べ替えます。キーボード: Alt + 左右矢印",
    "zh-CN": "拖动卡片排序。键盘：Alt + 左右方向键",
  },
  "전체 목적지": {
    en: "Destination for all",
    ja: "すべての保存先",
    "zh-CN": "所有文件的目标位置",
  },
  "파일마다 선택": {
    en: "Choose per file",
    ja: "ファイルごとに選択",
    "zh-CN": "逐个选择",
  },
  "모든 파일에 같은 위치를 적용해요.": {
    en: "Use the same destination for every file.",
    ja: "すべてのファイルに同じ保存先を適用します。",
    "zh-CN": "为所有文件设置相同的目标位置。",
  },
  "원본 보관 및 이력 저장 중": {
    en: "Protecting original and saving history",
    ja: "元ファイルと履歴を保存中",
    "zh-CN": "正在保存原文件及历史记录",
  },
  "파일 복사·이동 중": {
    en: "Copying or moving file",
    ja: "ファイルをコピー・移動中",
    "zh-CN": "正在复制或移动文件",
  },
  "정리 기록 저장 중": {
    en: "Saving operation history",
    ja: "整理履歴を保存中",
    "zh-CN": "正在保存整理记录",
  },
  "작업을 취소했어요.": {
    en: "Operation canceled.",
    ja: "操作をキャンセルしました。",
    "zh-CN": "操作已取消。",
  },
  "작업 기록을 찾지 못했어요.": {
    en: "Task record not found.",
    ja: "作業記録が見つかりません。",
    "zh-CN": "找不到任务记录。",
  },
  "이미 처리했거나 확인이 필요한 작업이에요.": {
    en: "This task is already handled or needs review.",
    ja: "処理済み、または確認が必要な作業です。",
    "zh-CN": "此任务已处理或需要检查。",
  },
  "연결 폴더가 바뀌었어요. 파일을 다시 선택해 주세요.": {
    en: "The linked folder changed. Select the file again.",
    ja: "連携フォルダーが変わりました。ファイルを選び直してください。",
    "zh-CN": "关联文件夹已更改，请重新选择文件。",
  },
  "원본이 바뀌었어요. 파일을 다시 선택해 주세요.": {
    en: "The source changed. Select the file again.",
    ja: "元ファイルが変わりました。選び直してください。",
    "zh-CN": "源文件已更改，请重新选择。",
  },
  "이 폴더의 버전관리를 먼저 시작해 주세요.": {
    en: "Start version management for this folder first.",
    ja: "先にこのフォルダーのバージョン管理を開始してください。",
    "zh-CN": "请先开启此文件夹的版本管理。",
  },
  "진행 중": { en: "In progress", ja: "処理中", "zh-CN": "进行中" },
  취소됨: { en: "Canceled", ja: "キャンセル済み", "zh-CN": "已取消" },
  중단됨: { en: "Interrupted", ja: "中断", "zh-CN": "已中断" },
  "재시도 기록으로 연결": {
    en: "Linked to retry",
    ja: "再試行記録に接続",
    "zh-CN": "已关联重试记录",
  },
  "정리 {0} / {1}": {
    en: "Organizing {0} / {1}",
    ja: "整理 {0} / {1}",
    "zh-CN": "整理 {0} / {1}",
  },
  "파일 상태 확인 중": {
    en: "Checking files",
    ja: "ファイルを確認中",
    "zh-CN": "正在检查文件",
  },
  "보관 검사 {0}개 폴더": {
    en: "Checking {0} folders for versions",
    ja: "{0}フォルダーの保存を確認中",
    "zh-CN": "正在检查 {0} 个文件夹的版本",
  },
  "작업 상태": { en: "Task status", ja: "作業状況", "zh-CN": "任务状态" },
  "작업 상태 열기": {
    en: "Open task status",
    ja: "作業状況を開く",
    "zh-CN": "打开任务状态",
  },
  "대기 {0}개": { en: "{0} waiting", ja: "{0}件待機", "zh-CN": "{0} 项等待" },
  "확인 {0}건": {
    en: "{0} to review",
    ja: "{0}件要確認",
    "zh-CN": "{0} 项待检查",
  },
  "중지 요청됨 · 현재 보관 작업이 끝나면 남은 파일을 멈춰요.": {
    en: "Stop requested. Remaining files will stop after the current save finishes.",
    ja: "停止を要求しました。現在の保存が終わると残りを停止します。",
    "zh-CN": "已请求停止，当前保存完成后将停止剩余文件。",
  },
  "보관 순서를 기다리거나 원본을 저장하고 있어요. 현재 파일·Git 작업은 안전하게 마친 뒤 넘어가요.":
    {
      en: "Waiting for a save slot or saving the source. The current file and Git work must finish safely.",
      ja: "保存の順番待ち、または元ファイルを保存中です。現在のファイル・Git処理を安全に終えて進みます。",
      "zh-CN":
        "正在等待保存或保存源文件。当前文件和 Git 操作安全完成后才会继续。",
    },
  "현재 파일 작업을 기다리고 있어요. 이 창을 닫아도 작업은 계속돼요.": {
    en: "Waiting for the current file operation. Work continues if you close this panel.",
    ja: "現在のファイル処理を待っています。この画面を閉じても作業は続きます。",
    "zh-CN": "正在等待当前文件操作，关闭此面板后任务仍会继续。",
  },
  "다시 확인·목적지 선택": {
    en: "Review and choose destination",
    ja: "再確認・保存先を選択",
    "zh-CN": "重新检查并选择目标",
  },
  "중지 요청됨": {
    en: "Stop requested",
    ja: "停止を要求済み",
    "zh-CN": "已请求停止",
  },
  "보관 상태 다시 확인": {
    en: "Recheck version storage",
    ja: "保存状態を再確認",
    "zh-CN": "重新检查版本保存",
  },
  "자동 버전 보관": {
    en: "Automatic versions",
    ja: "自動バージョン保存",
    "zh-CN": "自动版本保存",
  },
  "파일 확인 {0} / {1}": {
    en: "Files checked {0} / {1}",
    ja: "ファイル確認 {0} / {1}",
    "zh-CN": "已检查文件 {0} / {1}",
  },
  "보관 검사 대기": {
    en: "Waiting for version check",
    ja: "保存確認を待機中",
    "zh-CN": "等待版本检查",
  },
  "보관 {0} / {1}": {
    en: "Stored {0} / {1}",
    ja: "保存 {0} / {1}",
    "zh-CN": "已保存 {0} / {1}",
  },
  "이 폴더 다시 확인": {
    en: "Recheck folder",
    ja: "このフォルダーを再確認",
    "zh-CN": "重新检查文件夹",
  },
  "진행·대기": {
    en: "Active and waiting",
    ja: "処理中・待機",
    "zh-CN": "进行中与等待",
  },
  "확인할 작업": {
    en: "Tasks to review",
    ja: "確認する作業",
    "zh-CN": "待检查的任务",
  },
  "이전 작업의 상태 확인이 필요해요.": {
    en: "A previous task needs review.",
    ja: "以前の作業の確認が必要です。",
    "zh-CN": "需要检查之前的任务。",
  },
  "확인이 필요한 정리 작업이 없어요.": {
    en: "No organization tasks need review.",
    ja: "確認が必要な整理作業はありません。",
    "zh-CN": "没有需要检查的整理任务。",
  },
  "최근 처리 기록": {
    en: "Recent activity",
    ja: "最近の処理記録",
    "zh-CN": "最近处理记录",
  },
  "최근 100개 · 확인할 작업 우선 표시. 완료 기록은 정리 기록에서도 볼 수 있어요.":
    {
      en: "Up to 100 recent items, prioritizing review. Completed work is also in history.",
      ja: "最大100件、要確認を優先表示。完了した作業は整理履歴でも確認できます。",
      "zh-CN":
        "最多显示 100 项，优先显示待检查任务。完成记录也可在整理记录中查看。",
    },
  "재시도는 현재 파일과 목적지를 다시 확인해요. 확인창에서 실행해야 복사·이동해요.":
    {
      en: "Retry checks the current file and destination again. Copy or move starts only after confirmation.",
      ja: "再試行では現在のファイルと保存先を再確認します。確認画面で実行するとコピー・移動します。",
      "zh-CN":
        "重试会重新检查当前文件和目标位置。只有在确认窗口执行后才会复制或移动。",
    },
  "접어 두기": {
    en: "Minimize panel",
    ja: "画面を閉じる",
    "zh-CN": "收起面板",
  },
  "정리 결과를 작업 상태에서 확인해 주세요.": {
    en: "View the result in Task status.",
    ja: "作業状況で整理結果を確認してください。",
    "zh-CN": "请在任务状态中查看整理结果。",
  },
  "한 번에 파일·폴더 1~20개를 넣어 주세요.": {
    en: "Add 1–20 files or folders at a time.",
    ja: "一度にファイル・フォルダーを1～20個追加してください。",
    "zh-CN": "每次请添加 1–20 个文件或文件夹。",
  },
  "탐색 항목이 너무 많아요. 더 작은 폴더로 나누어 주세요.": {
    en: "Too many entries. Split into smaller folders.",
    ja: "項目が多すぎます。小さいフォルダーに分けてください。",
    "zh-CN": "项目过多，请拆分为更小的文件夹。",
  },
  "폴더 깊이 제한으로 제외했어요.": {
    en: "Excluded: folder depth limit.",
    ja: "階層の上限により除外しました。",
    "zh-CN": "已排除：文件夹层级超限。",
  },
  "연결 경로는 제외했어요.": {
    en: "Linked paths are excluded.",
    ja: "リンクされたパスは除外しました。",
    "zh-CN": "已排除链接路径。",
  },
  "정리할 폴더 안에 목적지 관리 폴더가 있어요. 다른 폴더를 선택해 주세요.": {
    en: "The destination is inside the source folder. Select another folder.",
    ja: "元フォルダー内に保存先があります。別のフォルダーを選択してください。",
    "zh-CN": "目标位置在源文件夹中，请选择其他文件夹。",
  },
  "기본 제외 항목이에요.": {
    en: "Excluded by default.",
    ja: "既定の除外項目です。",
    "zh-CN": "默认排除的项目。",
  },
  "파일이 200개를 넘어요. 더 작은 폴더로 나누어 주세요.": {
    en: "More than 200 files. Split into smaller folders.",
    ja: "ファイルが200件を超えています。小さいフォルダーに分けてください。",
    "zh-CN": "文件超过 200 个，请拆分为更小的文件夹。",
  },
  "일반 파일이 아니어서 제외했어요.": {
    en: "Excluded: not a regular file.",
    ja: "通常のファイルではないため除外しました。",
    "zh-CN": "已排除：非常规文件。",
  },
  "접근할 수 없어 제외했어요.": {
    en: "Excluded: access unavailable.",
    ja: "アクセスできないため除外しました。",
    "zh-CN": "无法访问，已排除。",
  },
  "정리할 파일이 없어요. 빈 폴더나 제외 항목만 있는지 확인해 주세요.": {
    en: "No files to organize. Check for empty folders or excluded entries.",
    ja: "整理するファイルがありません。空フォルダーや除外項目を確認してください。",
    "zh-CN": "没有可整理的文件，请检查空文件夹或排除项目。",
  },
  "정리 방식을 선택해 주세요.": {
    en: "Choose an organization method.",
    ja: "整理方法を選択してください。",
    "zh-CN": "请选择整理方式。",
  },
  "폴더 안 파일 {0}개": {
    en: "{0} files in folders",
    ja: "フォルダー内のファイル {0}件",
    "zh-CN": "文件夹中有 {0} 个文件",
  },
  "정리 방식": {
    en: "Organization method",
    ja: "整理方法",
    "zh-CN": "整理方式",
  },
  "폴더 구조 유지": {
    en: "Keep folder structure",
    ja: "フォルダー構造を維持",
    "zh-CN": "保留文件夹结构",
  },
  "파일명으로 추천 분류": {
    en: "Suggest by filename",
    ja: "ファイル名で分類を提案",
    "zh-CN": "按文件名推荐分类",
  },
  "넣을 위치": { en: "Destination", ja: "保存先", "zh-CN": "目标位置" },
  "선택한 폴더 이름부터 하위 구조를 유지해요. 새 폴더는 실행할 때 만들어요.": {
    en: "Keeps the selected folder name and its subfolders. New folders are created only when you execute.",
    ja: "選択したフォルダー名と下位構造を維持します。新しいフォルダーは実行時に作成します。",
    "zh-CN": "保留所选文件夹名称及子目录结构，新文件夹仅在执行时创建。",
  },
  "빈 폴더 {0}개 · 제외 경로 {1}개": {
    en: "{0} empty folders · {1} excluded paths",
    ja: "空フォルダー {0}個・除外パス {1}個",
    "zh-CN": "{0} 个空文件夹 · {1} 个排除路径",
  },
  "제외 이유 보기 · 최대 30개": {
    en: "View exclusion reasons · up to 30",
    ja: "除外理由を見る・最大30件",
    "zh-CN": "查看排除原因 · 最多 30 项",
  },
  "목록을 확인한 시점의 파일만 정리해요. 빈 폴더는 옮기지 않고, 이동 후 원본 폴더도 자동 삭제하지 않아요.":
    {
      en: "Only files found during preview are organized. Empty folders are not moved and source folders are not automatically deleted.",
      ja: "確認時点のファイルのみ整理します。空フォルダーは移動せず、元フォルダーも自動削除しません。",
      "zh-CN": "仅整理预览时发现的文件。不移动空文件夹，也不自动删除源文件夹。",
    },
  "폴더와 파일을 확인하고 있어요.": {
    en: "Checking folders and files.",
    ja: "フォルダーとファイルを確認しています。",
    "zh-CN": "正在检查文件夹和文件。",
  },
  "폴더 정리": {
    en: "Organize folder",
    ja: "フォルダーを整理",
    "zh-CN": "整理文件夹",
  },
  "정리할 폴더 선택": {
    en: "Select folders to organize",
    ja: "整理するフォルダーを選択",
    "zh-CN": "选择要整理的文件夹",
  },
  "보관 공간": { en: "Version storage", ja: "保存容量", "zh-CN": "版本存储" },
  "내 파일": { en: "My files", ja: "マイファイル", "zh-CN": "我的文件" },
  "파일 이름 규칙": {
    en: "Filename rules",
    ja: "ファイル名ルール",
    "zh-CN": "文件名规则",
  },
  "화면 설정": { en: "Appearance", ja: "表示設定", "zh-CN": "外观设置" },
  "(전체 폴더)": {
    en: "(All folders)",
    ja: "（全フォルダー）",
    "zh-CN": "（全部文件夹）",
  },
  "기술 정보": { en: "Technical details", ja: "技術情報", "zh-CN": "技术信息" },
  "위치 변경·보관하지 못한 기간": {
    en: "Location changes and capture gaps",
    ja: "場所の変更・保存できなかった期間",
    "zh-CN": "位置变更与未保存时段",
  },
  "보관 한도를 다시 선택해 주세요.": {
    en: "Choose a storage limit again.",
    ja: "保存上限を選び直してください。",
    "zh-CN": "请重新选择存储上限。",
  },
  "보관 공간을 정리하고 있어요.": {
    en: "Storage optimization is in progress.",
    ja: "保存領域を整理中です。",
    "zh-CN": "正在整理存储空间。",
  },
  "저장소를 먼저 확인해 주세요.": {
    en: "Check the storage first.",
    ja: "先に保存先を確認してください。",
    "zh-CN": "请先检查存储。",
  },
  "압축에 필요한 임시 공간이 부족해요. 디스크 여유 공간을 먼저 확보해 주세요.":
    {
      en: "Not enough temporary space for compression. Free up disk space first.",
      ja: "圧縮用の一時領域が不足しています。ディスクの空き容量を確保してください。",
      "zh-CN": "压缩所需临时空间不足，请先释放磁盘空间。",
    },
  "디스크 여유 공간이 부족해요. 기존 버전을 유지하고 새 보관은 기다려요.": {
    en: "Disk space is low. Existing versions remain; new captures wait.",
    ja: "ディスク容量が不足しています。既存の版を維持し、新しい保存は待機します。",
    "zh-CN": "磁盘空间不足。保留已有版本，等待保存新版本。",
  },
  "확인할 수 없음": {
    en: "Unavailable",
    ja: "確認できません",
    "zh-CN": "无法确认",
  },
  "압축 완료 · {0} 줄었어요.": {
    en: "Compression complete · {0} saved.",
    ja: "圧縮完了・{0}削減しました。",
    "zh-CN": "压缩完成 · 节省 {0}。",
  },
  "한도를 저장했어요. 보관 대기 파일을 다시 확인해요.": {
    en: "Limit saved. Checking files waiting to be captured.",
    ja: "上限を保存しました。保存待ちのファイルを再確認します。",
    "zh-CN": "已保存上限，正在重新检查待保存文件。",
  },
  "저장소를 확인하지 못했어요.": {
    en: "Could not check storage.",
    ja: "保存先を確認できませんでした。",
    "zh-CN": "无法检查存储。",
  },
  "보관 공간 관리는 데스크톱 앱에서 사용할 수 있어요.": {
    en: "Storage management is available in the desktop app.",
    ja: "保存容量の管理はデスクトップアプリで使えます。",
    "zh-CN": "存储管理可在桌面应用中使用。",
  },
  "사용량을 확인하고 있어요.": {
    en: "Checking storage usage.",
    ja: "使用量を確認しています。",
    "zh-CN": "正在检查使用量。",
  },
  "새로 확인": { en: "Refresh", ja: "再確認", "zh-CN": "刷新" },
  "이전 내용을 보관하는 데 쓰는 이 컴퓨터의 공간이에요.": {
    en: "Space on this computer used to keep earlier file contents.",
    ja: "以前のファイル内容を保存する、このコンピューター上の領域です。",
    "zh-CN": "用于保存文件历史内容的本机空间。",
  },
  "보관 한도 {0} 중 사용": {
    en: "Used out of a {0} storage limit",
    ja: "保存上限{0}のうち使用",
    "zh-CN": "已使用，上限为 {0}",
  },
  "보관 공간 사용률": {
    en: "Storage usage",
    ja: "保存容量の使用率",
    "zh-CN": "存储使用率",
  },
  "한도 내 남은 공간": {
    en: "Remaining within limit",
    ja: "上限までの残り",
    "zh-CN": "上限内剩余空间",
  },
  "디스크 여유 공간": {
    en: "Free disk space",
    ja: "ディスク空き容量",
    "zh-CN": "磁盘可用空间",
  },
  "보관된 버전": {
    en: "Saved versions",
    ja: "保存済みの版",
    "zh-CN": "已保存版本",
  },
  "공간이 부족하면 새 버전 보관이 멈춰요. 기존 버전은 남아 있어요.": {
    en: "New captures pause when space runs out. Existing versions remain.",
    ja: "容量が不足すると新しい保存は停止します。既存の版は残ります。",
    "zh-CN": "空间不足时暂停保存新版本，已有版本仍然保留。",
  },
  "마지막 확인 기준": {
    en: "As of the last check",
    ja: "最終確認時点",
    "zh-CN": "以上次检查为准",
  },
  "보관 한도": { en: "Storage limit", ja: "保存上限", "zh-CN": "存储上限" },
  "한도는 디스크 공간을 미리 예약하지 않아요. 파일 처리 중에는 임시 공간도 필요해요.":
    {
      en: "A limit does not reserve disk space. Processing also needs temporary space.",
      ja: "上限を設定しても容量は予約されません。処理には一時領域も必要です。",
      "zh-CN": "上限不会预留磁盘空间，处理文件还需要临时空间。",
    },
  "최대 보관 공간": {
    en: "Maximum storage",
    ja: "最大保存容量",
    "zh-CN": "最大存储空间",
  },
  "현재 사용량보다 작아요. 기록은 유지하고 새 보관은 대기해요.": {
    en: "Below current usage. History remains; new captures wait.",
    ja: "現在の使用量を下回ります。記録を維持し、新しい保存は待機します。",
    "zh-CN": "低于当前使用量。保留记录，新保存将等待。",
  },
  "기존 기록은 유지돼요. 새 한도 안에서 변경 내용을 계속 보관해요.": {
    en: "Existing history remains. Changes continue to be saved within the new limit.",
    ja: "既存の記録は残ります。新しい上限内で変更を保存します。",
    "zh-CN": "保留已有记录，在新上限内继续保存变更。",
  },
  "한도 변경": { en: "Change limit", ja: "上限を変更", "zh-CN": "更改上限" },
  "기록을 유지하며 압축": {
    en: "Compress while keeping history",
    ja: "記録を維持して圧縮",
    "zh-CN": "保留记录并压缩",
  },
  "기록 유지하며 압축": {
    en: "Compress, keep history",
    ja: "記録を残して圧縮",
    "zh-CN": "保留记录并压缩",
  },
  "모든 버전과 되돌리기 기록을 유지하며 저장 형식만 정리해요. 줄어드는 용량은 파일 내용에 따라 달라요.":
    {
      en: "Keeps every version and undo record while optimizing storage. Savings depend on file contents.",
      ja: "すべての版と取り消し記録を維持して保存形式を最適化します。削減量は内容により異なります。",
      "zh-CN": "保留所有版本和撤销记录，仅优化存储格式。节省量取决于文件内容。",
    },
  "진행 중에는 새 보관이 순서를 기다려요. 압축에는 추가 디스크 공간이 필요해요.":
    {
      en: "New captures wait during compression, which needs extra disk space.",
      ja: "圧縮中は新しい保存が待機します。追加のディスク領域が必要です。",
      "zh-CN": "压缩期间新保存将等待，压缩需要额外磁盘空间。",
    },
  "보관 공간을 확인하거나 정리하고 있어요. 다른 화면을 사용해도 계속돼요.": {
    en: "Checking or optimizing storage. You can keep using other screens.",
    ja: "保存領域を確認・整理中です。ほかの画面を使っても継続します。",
    "zh-CN": "正在检查或整理存储空间，可继续使用其他页面。",
  },
  "용량 구성과 보관 원칙": {
    en: "Storage breakdown and policy",
    ja: "容量の内訳と保存方針",
    "zh-CN": "空间构成与保存规则",
  },
  "버전 기록 {0} · 보관 대기 {1} · 목록과 기타 {2}": {
    en: "History {0} · Pending {1} · Catalog and other {2}",
    ja: "履歴{0}・保存待ち{1}・一覧など{2}",
    "zh-CN": "历史记录 {0} · 待保存 {1} · 目录和其他 {2}",
  },
  "보관 기간으로 이전 버전을 자동 삭제하지 않아요. 이 컴퓨터의 기록이므로 디스크 고장에 대비한 외부 백업은 따로 필요해요.":
    {
      en: "Older versions are not automatically deleted by age. These are local records; disk failure protection needs a separate external backup.",
      ja: "保存期間で以前の版を自動削除しません。ローカル記録のため、故障対策には別途外部バックアップが必要です。",
      "zh-CN":
        "不会按保存时间自动删除旧版本。本机记录无法防范磁盘故障，需要另做外部备份。",
    },
  "작은 화분부터, 가볍게 시작해요": {
    en: "Start with a little pot",
    ja: "小さな鉢から始めましょう",
    "zh-CN": "从一个小花盆开始",
  },
  "컴퓨터를 꾸미고, 파일의 이전 내용도 쉽게 찾아보세요.": {
    en: "Decorate your desktop and easily find earlier file contents.",
    ja: "デスクトップを飾って、以前のファイル内容も簡単に探せます。",
    "zh-CN": "装扮桌面，轻松找回文件历史内容。",
  },
  "기본 모습으로 시작": {
    en: "Start with the default look",
    ja: "標準の見た目で始める",
    "zh-CN": "使用默认外观开始",
  },
  "폴더 연결 없이 작은 창부터 열어요.": {
    en: "Open the little window without connecting a folder.",
    ja: "フォルダーを連携せず、小さなウィンドウを開きます。",
    "zh-CN": "无需关联文件夹，先打开小窗口。",
  },
  "파일 정리 시작": {
    en: "Start organizing files",
    ja: "ファイル整理を始める",
    "zh-CN": "开始整理文件",
  },
  "폴더 하나를 고르고 보관 범위를 확인해요.": {
    en: "Pick a folder and review what will be saved.",
    ja: "フォルダーを選び、保存範囲を確認します。",
    "zh-CN": "选择一个文件夹，确认保存范围。",
  },
  "실제 파일을 건드리지 않고 연습해요.": {
    en: "Practice without changing real files.",
    ja: "実際のファイルを変更せずに練習します。",
    "zh-CN": "练习操作，不改动真实文件。",
  },
  "파일 관리와 기본 테마는 로그인 없이 사용할 수 있어요.": {
    en: "File management and default themes work without signing in.",
    ja: "ファイル管理と標準テーマはログインなしで使えます。",
    "zh-CN": "文件管理和默认主题无需登录即可使用。",
  },
  "이 말은 무슨 뜻인가요?": {
    en: "What do these words mean?",
    ja: "この言葉の意味は？",
    "zh-CN": "这些词是什么意思？",
  },
  "폴더를 빠르게 여는 바로가기예요. 숨겨도 파일 관리는 계속돼요.": {
    en: "A shortcut to open a folder. Hiding it does not stop file management.",
    ja: "フォルダーを開くショートカットです。非表示でも管理は続きます。",
    "zh-CN": "快速打开文件夹的快捷方式，隐藏后文件管理仍会继续。",
  },
  "선택한 폴더와 그 안의 하위 폴더예요. 기존 파일과 새로 만든 파일의 변경을 확인해요.":
    {
      en: "The selected folder and its subfolders. Changes to existing and new files are checked.",
      ja: "選択したフォルダーとその下位フォルダーです。既存・新規ファイルの変更を確認します。",
      "zh-CN": "所选文件夹及其子文件夹，会检查已有和新建文件的变更。",
    },
  "파일 내용이 달라졌을 때 보관한 이전 모습이에요. 앱이 실행 중일 때 확인하고 저장해요.":
    {
      en: "A saved state when file contents change. Checked and saved while the app is running.",
      ja: "内容が変わったときに保存した状態です。アプリの実行中に確認・保存します。",
      "zh-CN": "文件内容改变时保存的历史状态，应用运行时检查并保存。",
    },
  "복사·이동한 위치를 되돌려요. 바뀐 파일 내용의 복원과는 달라요.": {
    en: "Reverses a copy or move. This differs from restoring earlier file contents.",
    ja: "コピー・移動を取り消します。以前の内容の復元とは異なります。",
    "zh-CN": "撤销复制或移动，与恢复历史文件内容不同。",
  },
  "이전 내용 꺼내기": {
    en: "Retrieve earlier contents",
    ja: "以前の内容を取り出す",
    "zh-CN": "提取历史内容",
  },
  "보관된 내용을 다른 이름의 파일로 꺼내요. 현재 파일을 덮어쓰지 않아요.": {
    en: "Saves earlier contents under a different name without overwriting the current file.",
    ja: "別名のファイルに取り出します。現在のファイルは上書きしません。",
    "zh-CN": "将历史内容另存为不同名称的文件，不覆盖当前文件。",
  },
  "내 파일 → 파일 선택 → 버전 이력 → 다른 이름으로 복원": {
    en: "My files → Select a file → Version history → Restore under another name",
    ja: "マイファイル → ファイル選択 → バージョン履歴 → 別名で復元",
    "zh-CN": "我的文件 → 选择文件 → 版本历史 → 以其他名称恢复",
  },
  "파일 이름 규칙 보기": {
    en: "View filename rules",
    ja: "ファイル名ルールを見る",
    "zh-CN": "查看文件名规则",
  },
  "보관 기록 압축 중": {
    en: "Compressing saved history",
    ja: "保存記録を圧縮中",
    "zh-CN": "正在压缩保存记录",
  },
  "파일 전달 완료": {
    en: "File transfer complete",
    ja: "ファイルの転送が完了しました",
    "zh-CN": "文件传输完成",
  },
  "파일 관리 완료": {
    en: "File management complete",
    ja: "ファイル管理が完了しました",
    "zh-CN": "文件管理完成",
  },
  "파일 보관 확인 필요": {
    en: "Version storage needs attention",
    ja: "バージョン保存の確認が必要です",
    "zh-CN": "版本保存需要检查",
  },
  "보관 완료 {0}개 · 확인 필요 {1}개": {
    en: "Saved {0} · Needs attention {1}",
    ja: "保存完了{0}件・確認が必要{1}件",
    "zh-CN": "已保存 {0} 个 · 需要检查 {1} 个",
  },
  "{0}개 복사·이동 완료. 버전 보관은 백그라운드에서 계속돼요.": {
    en: "{0} files transferred. Version storage continues in the background.",
    ja: "{0}件の転送が完了しました。バージョン保存はバックグラウンドで続きます。",
    "zh-CN": "已传输 {0} 个文件，版本保存在后台继续。",
  },
  "파일 전달 완료 · 버전 보관은 백그라운드에서 계속돼요.": {
    en: "Transfer complete · Version storage continues in the background.",
    ja: "転送完了・バージョン保存はバックグラウンドで続きます。",
    "zh-CN": "传输完成 · 版本保存在后台继续。",
  },
  "파일을 먼저 복사·이동하고 버전은 백그라운드에서 보관해요. 같은 이름은 덮어쓰지 않아요. 보관 전 수정·삭제된 중간 내용은 남지 않을 수 있어요.":
    {
      en: "Files are transferred first, then versions are saved in the background. Existing names are never overwritten. Intermediate contents edited or deleted before capture may not be saved.",
      ja: "先にコピー・移動し、バージョンはバックグラウンドで保存します。同名ファイルは上書きしません。保存前に編集・削除した途中の内容は残らない場合があります。",
      "zh-CN":
        "先复制或移动，再在后台保存版本。不覆盖同名文件。保存前修改或删除的中间内容可能无法保留。",
    },
  "백그라운드 보관 {0}개": {
    en: "Background storage: {0}",
    ja: "バックグラウンド保存{0}件",
    "zh-CN": "后台保存 {0} 个",
  },
  "파일 전달 후 버전 보관": {
    en: "Version storage after transfer",
    ja: "転送後のバージョン保存",
    "zh-CN": "传输后的版本保存",
  },
  "복사·이동은 끝났어요. 보관 실패 시 파일을 다시 옮기지 않고 보관만 재시도해요.":
    {
      en: "Transfer is complete. If saving fails, retry storage without transferring again.",
      ja: "コピー・移動は完了しました。保存に失敗した場合は再転送せず、保存だけを再試行します。",
      "zh-CN": "复制或移动已完成。保存失败时仅重试保存，不再传输文件。",
    },
  "백그라운드 보관 중": {
    en: "Saving in the background",
    ja: "バックグラウンドで保存中",
    "zh-CN": "正在后台保存",
  },
  "버전 보관 완료": {
    en: "Versions saved",
    ja: "バージョン保存完了",
    "zh-CN": "版本已保存",
  },
  "보관 확인 필요": {
    en: "Storage needs attention",
    ja: "保存の確認が必要",
    "zh-CN": "保存需要检查",
  },
  "보관 전 되돌림": {
    en: "Undone before capture",
    ja: "保存前に取り消し",
    "zh-CN": "保存前已撤销",
  },
  "보관만 재시도": {
    en: "Retry storage only",
    ja: "保存のみ再試行",
    "zh-CN": "仅重试保存",
  },
  "보관을 다시 시작해요.": {
    en: "Storage queued again.",
    ja: "保存を再開します。",
    "zh-CN": "重新开始保存。",
  },
  "다시 보관할 작업을 선택해 주세요.": {
    en: "Select a failed storage task.",
    ja: "再保存する作業を選択してください。",
    "zh-CN": "请选择需要重试保存的任务。",
  },
  "보관 전에 되돌린 작업이에요.": {
    en: "This transfer was undone before capture.",
    ja: "保存前に取り消した転送です。",
    "zh-CN": "此传输在保存前已撤销。",
  },
  "버전 보관에 실패했어요.": {
    en: "Version storage failed.",
    ja: "バージョン保存に失敗しました。",
    "zh-CN": "版本保存失败。",
  },
  "관리 폴더가 중단되었어요. 다시 연결한 뒤 보관을 재시도해 주세요.": {
    en: "Folder management is paused. Reconnect it and retry storage.",
    ja: "フォルダー管理が停止しています。再連携して保存を再試行してください。",
    "zh-CN": "文件夹管理已暂停，请重新关联后重试保存。",
  },
  "파일 전달은 끝났지만 보관 공간이 부족해요. 공간을 확보하고 보관만 다시 시도해 주세요.":
    {
      en: "Transfer is complete, but storage is full. Free space and retry storage only.",
      ja: "転送は完了しましたが保存領域が不足しています。空きを確保して保存のみ再試行してください。",
      "zh-CN": "传输已完成，但保存空间不足。释放空间后仅重试保存。",
    },
  "전달한 파일이 다른 파일로 교체되었어요. 기존 파일의 보관을 완료하지 못했어요.":
    {
      en: "The transferred file was replaced. Its version could not be saved.",
      ja: "転送したファイルが別のファイルに置き換わり、保存を完了できませんでした。",
      "zh-CN": "传输的文件已被替换，无法完成原文件的版本保存。",
    },
  "보관 중 파일이 교체되었어요. 파일 상태를 확인해 주세요.": {
    en: "The file was replaced during capture. Check its state.",
    ja: "保存中にファイルが置き換わりました。状態を確認してください。",
    "zh-CN": "保存期间文件被替换，请检查文件状态。",
  },
  "전달 후 변경된 현재 내용을 보관했어요. 보관 전 중간 내용은 남아 있지 않을 수 있어요.":
    {
      en: "Saved the current contents edited after transfer. Intermediate contents before capture may be unavailable.",
      ja: "転送後に変更された現在の内容を保存しました。保存前の途中の内容は残っていない場合があります。",
      "zh-CN": "已保存传输后修改的当前内容，保存前的中间内容可能不可用。",
    },
  "변경 내용 비교": {
    en: "Compare changes",
    ja: "変更内容を比較",
    "zh-CN": "比较更改",
  },
  "비교할 버전": {
    en: "Version to compare",
    ja: "比較するバージョン",
    "zh-CN": "比较版本",
  },
  "비교 중…": { en: "Comparing…", ja: "比較中…", "zh-CN": "正在比较…" },
  "변경 내용 보기": {
    en: "View changes",
    ja: "変更内容を見る",
    "zh-CN": "查看更改",
  },
  "비교하려면 보관된 버전이 두 개 이상 필요해요.": {
    en: "At least two saved versions are needed.",
    ja: "比較には保存済みバージョンが2つ以上必要です。",
    "zh-CN": "至少需要两个已保存的版本。",
  },
  "보관된 UTF-8 텍스트만 비교해요. 현재 파일은 바뀌지 않아요.": {
    en: "Compare saved UTF-8 text. The current file is unchanged.",
    ja: "保存済みUTF-8テキストを比較します。現在のファイルは変更しません。",
    "zh-CN": "仅比较已保存的 UTF-8 文本，不修改当前文件。",
  },
  "변경 없는 {0}줄 생략": {
    en: "{0} unchanged lines hidden",
    ja: "未変更の{0}行を省略",
    "zh-CN": "已隐藏 {0} 行未更改内容",
  },
  "추가 {0}줄 · 삭제 {1}줄": {
    en: "Added {0} lines · Removed {1} lines",
    ja: "追加{0}行・削除{1}行",
    "zh-CN": "新增 {0} 行 · 删除 {1} 行",
  },
  추가: { en: "Added", ja: "追加", "zh-CN": "新增" },
  삭제: { en: "Removed", ja: "削除", "zh-CN": "删除" },
  유지: { en: "Unchanged", ja: "変更なし", "zh-CN": "未更改" },
  "두 버전의 내용이 같아요.": {
    en: "Both versions have identical contents.",
    ja: "両バージョンの内容は同じです。",
    "zh-CN": "两个版本的内容相同。",
  },
  "줄바꿈 방식이 달라요. 줄 내용은 정규화해서 비교했어요.": {
    en: "Line endings differ. Line contents were normalized for comparison.",
    ja: "改行形式が異なります。行の内容は正規化して比較しました。",
    "zh-CN": "换行格式不同，已标准化后比较行内容。",
  },
  "변경한 부분만 보기": {
    en: "Show changed sections",
    ja: "変更部分だけ表示",
    "zh-CN": "仅显示更改部分",
  },
  "전체 줄 보기": {
    en: "Show all lines",
    ja: "すべての行を表示",
    "zh-CN": "显示全部行",
  },
  "버전 변경 내용": {
    en: "Version changes",
    ja: "バージョンの変更内容",
    "zh-CN": "版本更改内容",
  },
  "비교하지 못했어요. 다시 시도해 주세요.": {
    en: "Could not compare. Please retry.",
    ja: "比較できませんでした。再試行してください。",
    "zh-CN": "无法比较，请重试。",
  },
  "텍스트 비교는 버전당 256KiB까지 지원해요.": {
    en: "Text comparison supports up to 256 KiB per version.",
    ja: "テキスト比較は各バージョン256KiBまで対応します。",
    "zh-CN": "文本比较支持每个版本最多 256KiB。",
  },
  "텍스트 비교는 버전당 1,500줄까지 지원해요.": {
    en: "Text comparison supports up to 1,500 lines per version.",
    ja: "テキスト比較は各バージョン1,500行まで対応します。",
    "zh-CN": "文本比较支持每个版本最多 1,500 行。",
  },
  "UTF-8 텍스트만 비교할 수 있어요. 다른 인코딩은 별도로 열어 확인해 주세요.": {
    en: "Only UTF-8 text can be compared. Open other encodings separately.",
    ja: "UTF-8テキストのみ比較できます。他の文字コードは別途開いて確認してください。",
    "zh-CN": "仅支持比较 UTF-8 文本，其他编码请另行打开查看。",
  },
  "바이너리 내용은 텍스트로 비교하지 않아요.": {
    en: "Binary contents cannot be compared as text.",
    ja: "バイナリ内容はテキスト比較できません。",
    "zh-CN": "二进制内容不能作为文本比较。",
  },
  "같은 파일에 보관된 버전 두 개를 선택해 주세요.": {
    en: "Select two saved versions of the same file.",
    ja: "同じファイルの保存済みバージョンを2つ選んでください。",
    "zh-CN": "请选择同一文件的两个已保存版本。",
  },
  "이 파일 형식은 내용 비교를 지원하지 않아요. 다른 이름으로 복원해 확인해 주세요.":
    {
      en: "This format does not support comparison. Restore under another name to inspect it.",
      ja: "この形式は内容比較に未対応です。別名で復元して確認してください。",
      "zh-CN": "此格式不支持内容比较，请以其他名称恢复后查看。",
    },
  "보관 내용을 확인하지 못했어요.": {
    en: "Could not read the saved contents.",
    ja: "保存内容を確認できませんでした。",
    "zh-CN": "无法读取已保存内容。",
  },
  "정리 위치 추천": {
    en: "Destination recommendations",
    ja: "整理先のおすすめ",
    "zh-CN": "推荐整理位置",
  },
  "직접 만든 분류 규칙을 먼저 보고, 같은 확장자의 선택 이력과 이름을 함께 확인해요. 자동으로 파일을 옮기지는 않아요.":
    {
      en: "Your routing rules take priority, followed by past choices for the same extension and filename matches. Files are never moved automatically.",
      ja: "作成した分類ルールを優先し、同じ拡張子の選択履歴と名前を確認します。自動移動はしません。",
      "zh-CN":
        "优先使用您创建的分类规则，再参考同扩展名的选择历史与名称，不会自动移动文件。",
    },
  "파일명으로 추천 시험": {
    en: "Test a filename",
    ja: "ファイル名で試す",
    "zh-CN": "用文件名测试推荐",
  },
  "추천 확인": {
    en: "Check recommendations",
    ja: "おすすめを確認",
    "zh-CN": "查看推荐",
  },
  "규칙이 충돌해요. 직접 위치를 선택해 주세요.": {
    en: "Rules conflict. Choose a destination yourself.",
    ja: "ルールが競合しています。保存先を選んでください。",
    "zh-CN": "规则冲突，请手动选择位置。",
  },
  "추천 근거가 뚜렷해요. 실행 전 위치를 확인해 주세요.": {
    en: "There is clear supporting evidence. Check the destination before running.",
    ja: "明確な根拠があります。実行前に保存先を確認してください。",
    "zh-CN": "推荐依据明确，请在执行前确认位置。",
  },
  "추천 근거가 부족해요. 직접 위치를 선택해 주세요.": {
    en: "There is insufficient evidence. Choose a destination yourself.",
    ja: "根拠が不足しています。保存先を選んでください。",
    "zh-CN": "推荐依据不足，请手动选择位置。",
  },
  "새 폴더명 후보": {
    en: "New folder name ideas",
    ja: "新しいフォルダー名候補",
    "zh-CN": "新文件夹名称候选",
  },
  "파일명 단어에서 만든 후보예요. 폴더를 자동으로 만들지는 않아요.": {
    en: "Ideas based on filename words. No folders are created automatically.",
    ja: "ファイル名の単語から作った候補です。フォルダーは自動作成しません。",
    "zh-CN": "根据文件名中的词语生成候选，不会自动创建文件夹。",
  },
  "분류 규칙 추가": {
    en: "Add routing rule",
    ja: "分類ルールを追加",
    "zh-CN": "添加分类规则",
  },
  "분류 규칙 수정": {
    en: "Edit routing rule",
    ja: "分類ルールを編集",
    "zh-CN": "修改分类规则",
  },
  중지됨: { en: "Disabled", ja: "停止中", "zh-CN": "已停用" },
  수정: { en: "Edit", ja: "編集", "zh-CN": "修改" },
  "다시 사용": { en: "Enable", ja: "再開", "zh-CN": "重新启用" },
  "파일명에 포함할 단어": {
    en: "Words in the filename",
    ja: "ファイル名に含む単語",
    "zh-CN": "文件名包含的词语",
  },
  "쉼표로 구분한 단어가 모두 들어간 파일에 적용해요.": {
    en: "All comma-separated words must appear in the filename.",
    ja: "カンマ区切りの単語すべてを含むファイルに適用します。",
    "zh-CN": "文件名须包含所有用逗号分隔的词语。",
  },
  "확장자 · 비워 두면 전체": {
    en: "Extension · Leave blank for all",
    ja: "拡張子・空欄ならすべて",
    "zh-CN": "扩展名 · 留空表示全部",
  },
  "추천할 폴더": {
    en: "Recommended destination",
    ja: "おすすめの保存先",
    "zh-CN": "推荐文件夹",
  },
  "규칙 저장": { en: "Save rule", ja: "ルールを保存", "zh-CN": "保存规则" },
  "분류 규칙을 저장했어요.": {
    en: "Routing rule saved.",
    ja: "分類ルールを保存しました。",
    "zh-CN": "已保存分类规则。",
  },
  "규칙을 확인해 주세요.": {
    en: "Check the rule.",
    ja: "ルールを確認してください。",
    "zh-CN": "请检查规则。",
  },
  "분류 규칙의 조건과 폴더를 확인해 주세요.": {
    en: "Check the rule conditions and folder.",
    ja: "分類ルールの条件とフォルダーを確認してください。",
    "zh-CN": "请检查分类条件和文件夹。",
  },
  "이름 단어는 쉼표로 최대 5개, 확장자는 pdf처럼 입력해 주세요.": {
    en: "Enter up to five comma-separated words and an extension such as pdf.",
    ja: "名前の単語はカンマ区切りで5個まで、拡張子はpdfのように入力してください。",
    "zh-CN": "最多输入五个逗号分隔的词语，扩展名格式如 pdf。",
  },
  "관리 폴더 안의 목적지를 선택해 주세요.": {
    en: "Choose a destination inside the managed folder.",
    ja: "管理フォルダー内の保存先を選んでください。",
    "zh-CN": "请选择管理文件夹内的目标位置。",
  },
  "수정할 분류 규칙을 찾지 못했어요.": {
    en: "The routing rule to edit was not found.",
    ja: "編集する分類ルールが見つかりません。",
    "zh-CN": "找不到要修改的分类规则。",
  },
  "분류 규칙을 확인해 주세요.": {
    en: "Check the routing rule.",
    ja: "分類ルールを確認してください。",
    "zh-CN": "请检查分类规则。",
  },
  "직접 만든 분류 규칙과 일치해요.": {
    en: "Matches your routing rule.",
    ja: "作成した分類ルールと一致しています。",
    "zh-CN": "符合您创建的分类规则。",
  },
  "같은 확장자의 비슷한 이름을 정리한 이력을 반영했어요.": {
    en: "Based on earlier choices for similar names with the same extension.",
    ja: "同じ拡張子の似た名前を整理した履歴を反映しました。",
    "zh-CN": "参考了相同扩展名的类似名称整理历史。",
  },
  "파일명과 폴더명의 단어가 일치해요.": {
    en: "Filename and folder name words match.",
    ja: "ファイル名とフォルダー名の単語が一致しています。",
    "zh-CN": "文件名与文件夹名称的词语匹配。",
  },
  "경로가 아닌 파일명 하나를 입력해 주세요.": {
    en: "Enter a filename, not a path.",
    ja: "パスではなくファイル名を1つ入力してください。",
    "zh-CN": "请输入一个文件名，而不是路径。",
  },
  "분류 규칙이 충돌해요. 목적지를 직접 선택해 주세요.": {
    en: "Routing rules conflict. Choose a destination yourself.",
    ja: "分類ルールが競合しています。保存先を選んでください。",
    "zh-CN": "分类规则冲突，请手动选择目标位置。",
  },
  "거래처_계약서_20260926.pdf": {
    en: "client_contract_20260926.pdf",
    ja: "取引先_契約書_20260926.pdf",
    "zh-CN": "客户_合同_20260926.pdf",
  },
  "계약서, 거래처": {
    en: "contract, client",
    ja: "契約書, 取引先",
    "zh-CN": "合同, 客户",
  },
  "첫 사용 진행": {
    en: "Getting started",
    ja: "初めての利用状況",
    "zh-CN": "首次使用进度",
  },
  "첫 정리, 여기서 이어가요": {
    en: "Continue your first tidy-up",
    ja: "最初の整理を続けましょう",
    "zh-CN": "继续首次整理",
  },
  "첫 버전 보관": {
    en: "First version saved",
    ja: "最初のバージョン保存",
    "zh-CN": "保存首个版本",
  },
  "아직 전": { en: "Not yet", ja: "未完了", "zh-CN": "尚未完成" },
  "먼저 폴더 하나만 연결해 보세요. 하위 폴더도 함께 관리해요.": {
    en: "Connect one folder to begin. Its subfolders are included.",
    ja: "まずフォルダーを1つ接続しましょう。サブフォルダーも管理します。",
    "zh-CN": "先连接一个文件夹，其子文件夹也会纳入管理。",
  },
  "보관 상태에 확인할 내용이 있어요. 내 파일에서 먼저 살펴보세요.": {
    en: "Some saved-file statuses need attention. Check My files first.",
    ja: "保存状況の確認が必要です。まずマイファイルをご確認ください。",
    "zh-CN": "有保存状态需要确认，请先查看我的文件。",
  },
  "빈 폴더도 괜찮아요. 파일을 만들거나 넣으면 첫 버전을 보관해요.": {
    en: "An empty folder is fine. Create or add a file to save its first version.",
    ja: "空のフォルダーでも大丈夫です。ファイルを作成・追加すると最初のバージョンを保存します。",
    "zh-CN": "空文件夹也可以。创建或放入文件后会保存首个版本。",
  },
  "첫 버전을 보관하고 있어요. 기다리는 동안에도 파일을 정리할 수 있어요.": {
    en: "Saving the first versions. You can organize files while you wait.",
    ja: "最初のバージョンを保存中です。待っている間もファイルを整理できます。",
    "zh-CN": "正在保存首个版本，等待时也可以整理文件。",
  },
  "첫 버전이 보관됐어요. 파일 하나를 복사해 정리해 보세요.": {
    en: "Your first version is saved. Try organizing one file by copying it.",
    ja: "最初のバージョンを保存しました。ファイルを1つコピーして整理してみましょう。",
    "zh-CN": "首个版本已保存，试着复制并整理一个文件。",
  },
  "첫 정리가 끝났어요. 파일 상세에서 버전 이력과 변경 비교를 확인해 보세요.": {
    en: "Your first tidy-up is done. Open file details to explore history and compare changes.",
    ja: "最初の整理が完了しました。ファイル詳細で履歴と変更内容を確認しましょう。",
    "zh-CN": "首次整理已完成。在文件详情中查看版本历史和更改比较。",
  },
  "파일 하나 정리하기": {
    en: "Organize one file",
    ja: "ファイルを1つ整理",
    "zh-CN": "整理一个文件",
  },
  "확인한 파일": {
    en: "Checked files",
    ja: "確認済みファイル",
    "zh-CN": "已确认文件",
  },
  "현재 확인된 파일": {
    en: "Files found so far",
    ja: "現在確認したファイル",
    "zh-CN": "目前已找到的文件",
  },
  "{0} {1}개 중 {2}개 보관": {
    en: "{0}: {2} of {1} saved",
    ja: "{0}：{1}個中{2}個保存",
    "zh-CN": "{0}：{1} 个中已保存 {2} 个",
  },
  "첫 폴더 연결하기": {
    en: "Connect your first folder",
    ja: "最初のフォルダーを接続",
    "zh-CN": "连接首个文件夹",
  },
  "보관 상태 확인": {
    en: "Check saved status",
    ja: "保存状況を確認",
    "zh-CN": "查看保存状态",
  },
  "버전 이력 확인하기": {
    en: "Explore version history",
    ja: "バージョン履歴を確認",
    "zh-CN": "查看版本历史",
  },
  "안내 이어보기": {
    en: "Continue the guide",
    ja: "ガイドを続ける",
    "zh-CN": "继续指南",
  },
  "시작 안내 닫기": {
    en: "Dismiss getting started",
    ja: "開始ガイドを閉じる",
    "zh-CN": "关闭入门指南",
  },
  "안내를 닫아도 파일 관리는 계속돼요. 설정에서 다시 볼 수 있어요.": {
    en: "File management continues after dismissal. Reopen the guide in Settings.",
    ja: "ガイドを閉じてもファイル管理は続きます。設定から再度確認できます。",
    "zh-CN": "关闭指南后文件管理仍会继续，可在设置中重新查看。",
  },
  "내용을 바꾼 뒤 저장하면 새 버전이 생겨요.": {
    en: "Change the text, then save to create a new version.",
    ja: "内容を変更して保存すると新しいバージョンが作成されます。",
    "zh-CN": "修改内容后保存即可生成新版本。",
  },
  "메모를 바꾸고 저장한 뒤, 이전 내용을 다른 이름으로 꺼내 보세요.": {
    en: "Edit and save the note, then restore the previous contents under another name.",
    ja: "メモを編集して保存し、以前の内容を別の名前で復元してみましょう。",
    "zh-CN": "修改并保存笔记，再将之前的内容恢复为另一个文件名。",
  },
  "버전 이력에서 두 버전을 골라 변경 내용을 비교할 수도 있어요. UTF-8 텍스트의 추가·삭제 줄을 보여줘요.":
    {
      en: "You can also select two saved versions to compare added and removed lines in UTF-8 text.",
      ja: "保存済みの2つのバージョンを選び、UTF-8テキストの追加・削除行を比較できます。",
      "zh-CN": "也可以选择两个已保存版本，比较 UTF-8 文本的新增和删除行。",
    },
  "파일당 100MiB까지 보관해요. 보관 한도는 설정의 보관 공간에서 확인하고 바꿀 수 있어요. 앱 완전 종료 중의 중간 변경은 기록되지 않아요. 연결·클라우드 경로와 실행 중 DB는 지원하지 않아요.":
    {
      en: "Files up to 100 MiB are supported. Check or change your storage limit in Settings → Storage. Intermediate edits while the app is fully closed are not recorded. Linked/cloud paths and active databases are unsupported.",
      ja: "1ファイル100MiBまで保存します。上限は設定の保存容量で確認・変更できます。アプリ終了中の途中の変更は記録されません。リンク・クラウドのパスと稼働中のDBは非対応です。",
      "zh-CN":
        "支持每个文件最多 100MiB。可在设置的存储空间中查看或修改上限。应用完全关闭期间的中间修改不会记录。不支持链接路径、云端路径和正在运行的数据库。",
    },
  "{0}일": { en: "{0} days", ja: "{0}日", "zh-CN": "{0}天" },
  "정리 기록 보기": {
    en: "View organization history",
    ja: "整理履歴を見る",
    "zh-CN": "查看整理记录",
  },
  홈: { en: "Home", ja: "ホーム", "zh-CN": "首页" },
  "파일은 제자리에, 책상에는 작은 여유.": {
    en: "A place for your files. A little calm on your desk.",
    ja: "ファイルは定位置に、デスクにはゆとりを。",
    "zh-CN": "文件各归其位，桌面多一份从容。",
  },
  "정리할 파일을 여기에 놓으세요": {
    en: "Drop files here to organize",
    ja: "整理するファイルをここにドロップ",
    "zh-CN": "将要整理的文件拖到这里",
  },
  "추천 위치를 확인하고, 복사 또는 이동해요.": {
    en: "Review the suggested folder, then copy or move.",
    ja: "おすすめの場所を確認して、コピーまたは移動します。",
    "zh-CN": "确认推荐位置后，复制或移动。",
  },
  "정리할 화분": {
    en: "Destination pot",
    ja: "整理先の鉢",
    "zh-CN": "目标花盆",
  },
  "나의 도트 창틀": {
    en: "My pixel windowsill",
    ja: "マイピクセル窓辺",
    "zh-CN": "我的像素窗台",
  },
  "함께한 지 {8}": {
    en: "Together for {8}",
    ja: "一緒に過ごして {8}",
    "zh-CN": "已相伴 {8}",
  },
  "폴더 연결 필요": {
    en: "Connect a folder",
    ja: "フォルダーの接続が必要",
    "zh-CN": "需要连接文件夹",
  },
  "폴더 선택": {
    en: "Choose folder",
    ja: "フォルダーを選択",
    "zh-CN": "选择文件夹",
  },
  "먼저 파일을 옮기고, 버전은 백그라운드에서 보관해요.": {
    en: "Files transfer first. Versions are saved in the background.",
    ja: "ファイルを先に転送し、バージョンはバックグラウンドで保存します。",
    "zh-CN": "先传输文件，再在后台保存版本。",
  },
  "실제 파일을 바꾸지 않는 체험 화면이에요.": {
    en: "This demo does not change your files.",
    ja: "実際のファイルは変更しない体験画面です。",
    "zh-CN": "这是不会更改实际文件的体验页面。",
  },
  "테마 둘러보기": {
    en: "Explore themes",
    ja: "テーマを見る",
    "zh-CN": "浏览主题",
  },
  "내 파일 보기": {
    en: "View my files",
    ja: "マイファイルを見る",
    "zh-CN": "查看我的文件",
  },
  "첫 파일을 정리하면 여기에 기록이 남아요.": {
    en: "Your first organized file will appear here.",
    ja: "初めて整理したファイルの記録がここに残ります。",
    "zh-CN": "整理第一个文件后，记录会显示在这里。",
  },
  "환경 설정": { en: "Preferences", ja: "環境設定", "zh-CN": "偏好设置" },
  "설정 분류": {
    en: "Settings categories",
    ja: "設定カテゴリー",
    "zh-CN": "设置分类",
  },
  "화면과 글꼴": {
    en: "Appearance and fonts",
    ja: "画面とフォント",
    "zh-CN": "外观与字体",
  },
  "파일과 보관": {
    en: "Files and storage",
    ja: "ファイルと保存",
    "zh-CN": "文件与存储",
  },
  "언어와 도움말": {
    en: "Language and help",
    ja: "言語とヘルプ",
    "zh-CN": "语言与帮助",
  },
  "테마와 별개로 원하는 글꼴을 고를 수 있어요.": {
    en: "Choose a font independently of your theme.",
    ja: "テーマとは別に好きなフォントを選べます。",
    "zh-CN": "可以独立于主题选择喜欢的字体。",
  },
  "앱에 사용할 글꼴": {
    en: "App font",
    ja: "アプリのフォント",
    "zh-CN": "应用字体",
  },
  "설정에서 고른 글꼴이 테마보다 우선해요.": {
    en: "Your font preference overrides the theme font.",
    ja: "設定で選んだフォントがテーマより優先されます。",
    "zh-CN": "设置中选择的字体优先于主题字体。",
  },
  "내 글꼴 가져오기 · 라이선스": {
    en: "Import a font · Licenses",
    ja: "フォントの読み込み・ライセンス",
    "zh-CN": "导入字体 · 许可证",
  },
  "TTF·OTF·WOFF·WOFF2 · 최대 20MB": {
    en: "TTF · OTF · WOFF · WOFF2 · Up to 20 MB",
    ja: "TTF・OTF・WOFF・WOFF2・最大20MB",
    "zh-CN": "TTF · OTF · WOFF · WOFF2 · 最大20MB",
  },
  "기본 글꼴 5종은 SIL OFL 1.1로 제공돼요. 상업적 이용과 앱 재배포가 가능하며 라이선스 원문을 함께 포함해요.":
    {
      en: "The five bundled fonts use SIL OFL 1.1. Commercial use and app redistribution are allowed under the included licenses.",
      ja: "同梱の5書体はSIL OFL 1.1で提供されます。同梱ライセンスに従って商用利用・アプリへの再配布が可能です。",
      "zh-CN":
        "内置的五款字体采用 SIL OFL 1.1，可按随附许可证进行商业使用和应用再分发。",
    },
  "테마 글꼴 따르기": {
    en: "Follow theme font",
    ja: "テーマのフォントを使う",
    "zh-CN": "跟随主题字体",
  },
  "시스템 기본 글꼴": {
    en: "System default",
    ja: "システム標準",
    "zh-CN": "系统默认字体",
  },
  "가져온 글꼴 삭제": {
    en: "Remove imported font",
    ja: "読み込んだフォントを削除",
    "zh-CN": "删除导入的字体",
  },
  "내가 쓰기 편한 작은 창틀.": {
    en: "Make your windowsill work for you.",
    ja: "自分に合った小さな窓辺に。",
    "zh-CN": "让小窗台更适合自己。",
  },
  "버전 보관과 용량": {
    en: "Version storage and capacity",
    ja: "バージョン保存と容量",
    "zh-CN": "版本存储与容量",
  },
  "보관 상태와 남은 공간을 확인해요.": {
    en: "Check saved status and available space.",
    ja: "保存状況と空き容量を確認します。",
    "zh-CN": "查看保存状态和剩余空间。",
  },
  "나의 이름 규칙과 추천을 살펴봐요.": {
    en: "Review your naming rules and suggestions.",
    ja: "名前のルールとおすすめを確認します。",
    "zh-CN": "查看命名规则和推荐。",
  },
  "도움이 필요할 때": {
    en: "When you need help",
    ja: "困ったときは",
    "zh-CN": "需要帮助时",
  },
  "처음부터 둘러보기": {
    en: "Take the tour again",
    ja: "最初から見てみる",
    "zh-CN": "重新浏览指南",
  },
  "폴더별 보기": {
    en: "Browse folders",
    ja: "フォルダー別に見る",
    "zh-CN": "按文件夹浏览",
  },
  "앱에 포함된 글꼴로 미리 보여드려요.": {
    en: "Previewing the bundled font.",
    ja: "同梱フォントでプレビューしています。",
    "zh-CN": "正在预览内置字体。",
  },
  "기본 글꼴로 표시한 예시예요.": {
    en: "Example shown in the default font.",
    ja: "標準フォントで表示した例です。",
    "zh-CN": "此示例使用默认字体。",
  },
  "선택하지 않은 곳은 유지해요. 설정에서 고른 글꼴이 테마보다 우선해요.": {
    en: "Unselected areas stay unchanged. Your font preference overrides the theme font.",
    ja: "未選択の場所は変わりません。設定で選んだフォントが優先されます。",
    "zh-CN": "未选择的区域保持不变。设置中选择的字体优先于主题字体。",
  },
  "오늘의 창틀": {
    en: "Your windowsill today",
    ja: "今日の窓辺",
    "zh-CN": "今日窗台",
  },
  "관리 중인 파일과 최근 정리를 한눈에 확인해요.": {
    en: "Your managed files and recent activity at a glance.",
    ja: "管理中のファイルと最近の整理をひと目で確認します。",
    "zh-CN": "一览管理中的文件和最近整理记录。",
  },
  "관리 폴더": {
    en: "Managed folders",
    ja: "管理フォルダー",
    "zh-CN": "管理文件夹",
  },
  "범위 확인 중": {
    en: "Checking scope",
    ja: "対象を確認中",
    "zh-CN": "正在检查范围",
  },
  "전체 개수 확인 전": {
    en: "Total unknown",
    ja: "合計数は未確認",
    "zh-CN": "总数待确认",
  },
  "일부 미보관": {
    en: "Partially saved",
    ja: "一部未保管",
    "zh-CN": "部分未保存",
  },
  "파일 없음": {
    en: "No files",
    ja: "ファイルなし",
    "zh-CN": "没有文件",
  },
  "{0}/{1}개 보관": {
    en: "{0}/{1} saved",
    ja: "{0}/{1} 件保管",
    "zh-CN": "已保存 {0}/{1} 项",
  },
  "{0}개 보관": {
    en: "{0} saved",
    ja: "{0} 件保管",
    "zh-CN": "已保存 {0} 项",
  },
  "제외 {0}개": {
    en: "{0} excluded",
    ja: "{0} 件除外",
    "zh-CN": "已排除 {0} 项",
  },
  "폴더를 끌거나 Alt 키와 방향키를 눌러 순서를 바꿔요.": {
    en: "Drag folders or use Alt and the arrow keys to reorder them.",
    ja: "フォルダーをドラッグするか、Alt キーと矢印キーで並べ替えます。",
    "zh-CN": "拖动文件夹或使用 Alt 和方向键可调整顺序。",
  },
  "보관한 파일": {
    en: "Saved files",
    ja: "保存したファイル",
    "zh-CN": "已保存文件",
  },
  "정리한 파일": {
    en: "Organized files",
    ja: "整理したファイル",
    "zh-CN": "已整理文件",
  },
  "첫 정리 다시 해보기": {
    en: "Replay the first tidy-up",
    ja: "最初の整理をもう一度",
    "zh-CN": "重玩首次整理",
  },
  "첫 정리 튜토리얼": {
    en: "First tidy-up tutorial",
    ja: "初めての整理チュートリアル",
    "zh-CN": "首次整理教程",
  },
  "폴더를 연결하고 파일 하나를 정리해 보세요.": {
    en: "Connect a folder and organize one file.",
    ja: "フォルダーを接続し、ファイルを1つ整理しましょう。",
    "zh-CN": "连接文件夹并整理一个文件。",
  },
  "튜토리얼 시작": {
    en: "Start tutorial",
    ja: "チュートリアルを開始",
    "zh-CN": "开始教程",
  },
  "한 번만 따라 하면 다음부터는 내 방식대로.": {
    en: "Follow along once, then make it your own.",
    ja: "一度試したら、次からは自分のペースで。",
    "zh-CN": "跟着做一次，之后按自己的方式来。",
  },
  "튜토리얼 건너뛰기": {
    en: "Skip tutorial",
    ja: "チュートリアルをスキップ",
    "zh-CN": "跳过教程",
  },
  "튜토리얼 진행": {
    en: "Tutorial progress",
    ja: "チュートリアルの進行",
    "zh-CN": "教程进度",
  },
  "언제든 건너뛸 수 있어요. 완료하거나 건너뛰면 자동으로 다시 나타나지 않아요.":
    {
      en: "You can skip at any time. Finishing or skipping stops automatic reminders.",
      ja: "いつでもスキップできます。完了またはスキップ後は自動表示されません。",
      "zh-CN": "随时可以跳过。完成或跳过后不会自动再次出现。",
    },
  "완료하고 홈으로": {
    en: "Finish and go home",
    ja: "完了してホームへ",
    "zh-CN": "完成并返回首页",
  },
  "보관에 실패했어요. 작업 상태에서 보관만 재시도할 수 있어요.": {
    en: "Saving failed. Retry saving from Task status.",
    ja: "保存に失敗しました。作業状況から保存だけ再試行できます。",
    "zh-CN": "保存失败。可以在任务状态中仅重试保存。",
  },
  "보관 확인으로": {
    en: "Check saved status",
    ja: "保存状況の確認へ",
    "zh-CN": "查看保存状态",
  },
  "보관 확인": { en: "Check saving", ja: "保存を確認", "zh-CN": "确认保存" },
  "파일을 모아둘 폴더를 골라요": {
    en: "Choose a folder for your files",
    ja: "ファイルをまとめるフォルダーを選びます",
    "zh-CN": "选择存放文件的文件夹",
  },
  "파일 하나를 선택해 정리해요": {
    en: "Choose one file to organize",
    ja: "ファイルを1つ選んで整理します",
    "zh-CN": "选择一个文件进行整理",
  },
  "첫 정리를 완료했어요!": {
    en: "Your first tidy-up is complete!",
    ja: "最初の整理が完了しました！",
    "zh-CN": "首次整理完成！",
  },
  "파일 전달 완료, 버전을 보관하고 있어요": {
    en: "File transferred. Saving its version.",
    ja: "転送完了。バージョンを保存中です",
    "zh-CN": "文件传输完成，正在保存版本",
  },
  "하위 폴더도 함께 관리해요. 폴더를 선택한 뒤 범위를 확인하고 관리 시작을 눌러 주세요.":
    {
      en: "Subfolders are included. Choose a folder, review its scope, then start managing.",
      ja: "サブフォルダーも管理します。選択後に範囲を確認し、管理を開始してください。",
      "zh-CN": "子文件夹也会纳入管理。选择文件夹，确认范围后开始管理。",
    },
  "추천 위치를 확인하고 복사 또는 이동을 선택하세요. 처음에는 원본을 유지하는 복사를 권해요.":
    {
      en: "Review the destination, then choose copy or move. For your first try, copy keeps the original.",
      ja: "保存先を確認しコピーか移動を選びます。初回は原本が残るコピーがおすすめです。",
      "zh-CN": "确认位置后选择复制或移动。初次尝试建议复制以保留原文件。",
    },
  "전달과 보관은 별개예요. 이 파일의 보관이 끝나면 튜토리얼을 마칠 수 있어요.":
    {
      en: "Transfer and version saving are separate. Finish the tutorial once this file is saved.",
      ja: "転送と保存は別です。このファイルの保存後にチュートリアルを完了できます。",
      "zh-CN": "传输与版本保存是独立步骤。此文件保存完成后即可结束教程。",
    },
  "오류 기록 보내기": {
    en: "Share error records",
    ja: "エラー記録を共有",
    "zh-CN": "分享错误记录",
  },
  "문제가 생기면 진단 파일을 저장해 개발자에게 전달해 주세요.": {
    en: "If something goes wrong, save a diagnostic file and share it with the developer.",
    ja: "問題が起きたら診断ファイルを保存し、開発者へ渡してください。",
    "zh-CN": "遇到问题时，请保存诊断文件并发送给开发者。",
  },
  "진단 파일 만들기": {
    en: "Create diagnostic file",
    ja: "診断ファイルを作成",
    "zh-CN": "创建诊断文件",
  },
  "설치한 앱에서 사용할 수 있어요.": {
    en: "Available in the installed app.",
    ja: "インストールしたアプリで利用できます。",
    "zh-CN": "请在已安装的应用中使用。",
  },
  "앱 버전, 운영체제, 오류 코드와 발생 순서를 담아요.": {
    en: "Includes app version, operating system, error codes and event order.",
    ja: "アプリのバージョン、OS、エラーコードと発生順を含みます。",
    "zh-CN": "包含应用版本、操作系统、错误代码及发生顺序。",
  },
  "파일 내용·이름·경로·계정·비밀번호·토큰은 포함하지 않아요. 자동 전송하지 않아요.":
    {
      en: "No file contents, names, paths, accounts, passwords or tokens. Nothing is sent automatically.",
      ja: "ファイル内容・名前・パス・アカウント・パスワード・トークンは含みません。自動送信しません。",
      "zh-CN": "不包含文件内容、名称、路径、账户、密码或令牌。不会自动发送。",
    },
  "최근 14일, 최대 3MiB를 이 기기에 기록하고 최근 500건까지 내보내요.": {
    en: "Keeps up to 3 MiB locally for 14 days and exports the latest 500 events.",
    ja: "この端末に14日間、最大3MiBを記録し、最新500件まで書き出します。",
    "zh-CN": "在本机保留最近14天、最多3MiB的记录，并导出最近500条事件。",
  },
  "디스크에 기록하지 못했어요. 현재 실행 중 메모리에 남은 기록을 포함해요.": {
    en: "Could not write to disk. Includes records still in memory from this session.",
    ja: "ディスクに保存できませんでした。今回の実行中にメモリに残った記録を含みます。",
    "zh-CN": "无法写入磁盘。将包含本次运行中仍保留在内存里的记录。",
  },
  "저장할 내용 확인": {
    en: "Review contents",
    ja: "保存内容を確認",
    "zh-CN": "查看保存内容",
  },
  "진단 파일 저장": {
    en: "Save diagnostic file",
    ja: "診断ファイルを保存",
    "zh-CN": "保存诊断文件",
  },
  "진단 파일을 저장했어요. 개발자에게 직접 전달해 주세요.": {
    en: "Diagnostic file saved. Share it with the developer yourself.",
    ja: "診断ファイルを保存しました。開発者へ直接渡してください。",
    "zh-CN": "诊断文件已保存，请自行发送给开发者。",
  },
  "저장을 취소했어요.": {
    en: "Saving canceled.",
    ja: "保存をキャンセルしました。",
    "zh-CN": "已取消保存。",
  },
  "진단 파일 저장 창을 먼저 닫아 주세요.": {
    en: "Close the diagnostic save dialog first.",
    ja: "診断ファイルの保存画面を先に閉じてください。",
    "zh-CN": "请先关闭诊断文件保存窗口。",
  },
  "진단 내용을 다시 확인해 주세요.": {
    en: "Review the diagnostic contents again.",
    ja: "診断内容をもう一度確認してください。",
    "zh-CN": "请重新查看诊断内容。",
  },
  "앱 기록 폴더 밖에 저장해 주세요.": {
    en: "Save outside the app data folder.",
    ja: "アプリの記録フォルダーの外に保存してください。",
    "zh-CN": "请保存在应用记录文件夹之外。",
  },
  "같은 이름의 파일이 있어요. 다른 이름으로 저장해 주세요.": {
    en: "A file with this name exists. Choose another name.",
    ja: "同じ名前のファイルがあります。別名で保存してください。",
    "zh-CN": "同名文件已存在，请使用其他名称。",
  },
  "화면 문구": { en: "Screen wording", ja: "画面の文言", "zh-CN": "界面文字" },
  "화면 문구 바꾸기": {
    en: "Customize wording",
    ja: "画面の文言を変更",
    "zh-CN": "自定义界面文字",
  },
  "화분을 폴더로, 오늘의 창틀을 나만의 제목으로 바꿔요.": {
    en: "Call pots folders, or give your windowsill a title of your own.",
    ja: "鉢をフォルダーと呼んだり、窓辺を好きな見出しに変更できます。",
    "zh-CN": "可以将花盆改称文件夹，或为窗台设置自己的标题。",
  },
  "내 화면의 제목과 표시 이름을 바꿔요. 실제 파일·폴더 이름이나 경로는 바뀌지 않아요.":
    {
      en: "Change screen titles and labels. Actual file and folder names and paths stay the same.",
      ja: "画面の見出しと表示名を変更します。実際のファイル名・フォルダー名・パスは変わりません。",
      "zh-CN": "修改界面标题和显示名称，不会更改实际文件、文件夹名称或路径。",
    },
  "바꿀 문구": {
    en: "Label to edit",
    ja: "変更する文言",
    "zh-CN": "要修改的文字",
  },
  "내 문구": { en: "My wording", ja: "自分の文言", "zh-CN": "我的文字" },
  "비워 두면 기본 문구를 사용해요. 테마·언어를 바꿔도 직접 쓴 문구는 유지돼요.":
    {
      en: "Leave blank for the default. Your wording stays when themes or languages change.",
      ja: "空欄は初期値を使います。テーマや言語を変えても自分の文言は残ります。",
      "zh-CN": "留空使用默认文字。切换主题或语言时，自定义文字会保留。",
    },
  "이 문구 기본값": {
    en: "Reset this label",
    ja: "この文言を初期値に",
    "zh-CN": "恢复此项默认",
  },
  "모두 기본값": {
    en: "Reset all labels",
    ja: "すべて初期値に",
    "zh-CN": "全部恢复默认",
  },
  "문구 저장": { en: "Save wording", ja: "文言を保存", "zh-CN": "保存文字" },
  "이 기기에만 저장해요. 안전 안내·오류·복사/이동 버튼의 의미는 유지해요.": {
    en: "Saved on this device only. Safety messages, errors and copy/move controls keep their meaning.",
    ja: "この端末だけに保存します。安全案内・エラー・コピー/移動操作の意味は維持します。",
    "zh-CN": "仅保存在本机。安全提示、错误及复制/移动按钮的含义保持不变。",
  },
  "문구의 길이와 사용할 수 없는 문자를 확인해 주세요.": {
    en: "Check the label length and unsupported characters.",
    ja: "文言の長さと使用できない文字を確認してください。",
    "zh-CN": "请检查文字长度及不支持的字符。",
  },
  "문구를 저장했어요.": {
    en: "Wording saved.",
    ja: "文言を保存しました。",
    "zh-CN": "文字已保存。",
  },
  미리보기: { en: "Preview", ja: "プレビュー", "zh-CN": "预览" },
  "진행 중인 작업": {
    en: "Work in progress",
    ja: "進行中の作業",
    "zh-CN": "正在进行的任务",
  },
  "진행 중인 작업이 없어요": {
    en: "No work in progress",
    ja: "進行中の作業はありません",
    "zh-CN": "当前没有任务",
  },
  "새 작업이 시작되면 여기에서 확인해요.": {
    en: "New work appears here.",
    ja: "新しい作業をここで確認できます。",
    "zh-CN": "新任务会显示在这里。",
  },
  "다른 작업을 계속해도 괜찮아요.": {
    en: "You can keep working.",
    ja: "ほかの作業を続けられます。",
    "zh-CN": "可以继续其他工作。",
  },
  "파일은 제자리에 있어요.": {
    en: "Your files are in place.",
    ja: "ファイルは元の場所にあります。",
    "zh-CN": "文件仍在原处。",
  },
  "열려 있는 파일": {
    en: "Open files",
    ja: "開いているファイル",
    "zh-CN": "已打开的文件",
  },
  "열림 상태 확인 불가": {
    en: "Open status unavailable",
    ja: "開閉状態を確認できません",
    "zh-CN": "无法确认打开状态",
  },
  "앱에서 연 기록 · 실제 열림 여부는 확인할 수 없어요.": {
    en: "Opened from this app · current open status is unavailable.",
    ja: "このアプリで開いた記録 · 現在の開閉状態は確認できません。",
    "zh-CN": "本应用的打开记录 · 无法确认当前是否仍打开。",
  },
  "앱에서 파일을 열면 여기에 남아요.": {
    en: "Files opened from this app appear here.",
    ja: "このアプリで開いたファイルが表示されます。",
    "zh-CN": "从本应用打开的文件会显示在此处。",
  },
  "최근 작업한 파일": {
    en: "Recently worked on",
    ja: "最近作業したファイル",
    "zh-CN": "最近处理的文件",
  },
  "최근 버전 보관 · 파일별 최신 기록": {
    en: "Recent saved versions · latest entry per file",
    ja: "最近のバージョン保存 · ファイルごとの最新記録",
    "zh-CN": "最近保存的版本 · 每个文件的最新记录",
  },
  "파일의 첫 버전을 보관하면 여기에 보여요.": {
    en: "Files appear after their first version is saved.",
    ja: "初回バージョンを保存すると表示されます。",
    "zh-CN": "保存首个版本后会显示在这里。",
  },
  "목록을 불러오지 못했어요. 다시 확인해 주세요.": {
    en: "Could not load the list. Please try again.",
    ja: "一覧を読み込めませんでした。もう一度確認してください。",
    "zh-CN": "无法加载列表，请重试。",
  },
  "파일 상세를 불러오는 중": {
    en: "Loading file details", ja: "ファイルの詳細を読み込み中", "zh-CN": "正在加载文件详情",
  },
  "파일 목록을 불러오는 중": {
    en: "Loading files", ja: "ファイル一覧を読み込み中", "zh-CN": "正在加载文件列表",
  },
  "표시 기준": {
    en: "About this list",
    ja: "表示について",
    "zh-CN": "显示依据",
  },
  "상태 보기": { en: "View status", ja: "状態を見る", "zh-CN": "查看状态" },
  "화분 설정": { en: "Pot settings", ja: "鉢の設定", "zh-CN": "花盆设置" },
  "내 관리 폴더": {
    en: "My managed folders",
    ja: "管理フォルダー",
    "zh-CN": "我的管理文件夹",
  },
  "개 관리": { en: "managed", ja: "個を管理", "zh-CN": "个已管理" },
  "관리 폴더를 연결하면 카드로 보여요.": {
    en: "Connect a managed folder to see its card.",
    ja: "管理フォルダーを接続するとカードが表示されます。",
    "zh-CN": "连接管理文件夹后将显示卡片。",
  },
  "공간 현황": {
    en: "Storage overview",
    ja: "容量の状況",
    "zh-CN": "空间概况",
  },
  "폴더별 사용량": {
    en: "Size by folder",
    ja: "フォルダー別の容量",
    "zh-CN": "各文件夹用量",
  },
  "확인된 용량": {
    en: "Measured so far",
    ja: "確認済み容量",
    "zh-CN": "已确认的容量",
  },
  "원본 관리 파일의 최근 확인 용량 · 버전 보관소와 달라요.": {
    en: "Last measured source file sizes · separate from version storage.",
    ja: "管理元ファイルの最終確認容量 · バージョン保存先とは別です。",
    "zh-CN": "原始管理文件的最近确认容量 · 与版本存储不同。",
  },
  "디스크 여유": {
    en: "Free disk space",
    ja: "ディスク空き容量",
    "zh-CN": "磁盘剩余空间",
  },
  "앱 보관소가 있는 디스크": {
    en: "Disk containing app storage",
    ja: "アプリ保存先のディスク",
    "zh-CN": "应用存储所在磁盘",
  },
  "조회할 수 없는 정보는 확인 중으로 표시해요.": {
    en: "Unavailable information is shown as checking.",
    ja: "取得できない情報は確認中と表示します。",
    "zh-CN": "无法获取的信息显示为确认中。",
  },
  "남은 보관 한도": {
    en: "Remaining storage allowance",
    ja: "保存上限の残り",
    "zh-CN": "剩余存储额度",
  },
  "최근 확인": { en: "Last checked", ja: "最終確認", "zh-CN": "最近确认" },
  "파일 내용은 이 컴퓨터에 머물러요.": {
    en: "File contents stay on this computer.",
    ja: "ファイルの内容はこのパソコン内に保存されます。",
    "zh-CN": "文件内容保存在此电脑上。",
  },
  "앱에서 연 파일의 기록을 보여요. 외부 프로그램에서 지금 열려 있는지는 확인할 수 없어요.":
    {
      en: "Shows files opened from this app. Their current open status in other programs is unavailable.",
      ja: "このアプリで開いたファイルの記録です。外部アプリで現在開いているかは確認できません。",
      "zh-CN": "显示本应用打开过的文件，无法确认外部程序中目前是否仍打开。",
    },
  "파일을 누르면 상세에서 다시 열거나 버전을 확인할 수 있어요.": {
    en: "Select a file to reopen it or review versions in its details.",
    ja: "ファイルを選ぶと詳細から再度開いたりバージョンを確認できます。",
    "zh-CN": "点击文件后可在详情中重新打开或查看版本。",
  },
  "버전 보관": {
    en: "Version saved",
    ja: "バージョン保存",
    "zh-CN": "保存版本",
  },
  복원: { en: "Restored", ja: "復元", "zh-CN": "恢复" },
  "연결할 관리 폴더": {
    en: "Managed folder to connect",
    ja: "接続する管理フォルダー",
    "zh-CN": "要关联的管理文件夹",
  },
  "폴더를 고른 뒤 아래 버튼을 눌러 연결을 완료해 주세요.": {
    en: "Choose a folder, then use the button below to confirm the connection.",
    ja: "フォルダーを選び、下のボタンで接続を確定してください。",
    "zh-CN": "选择文件夹后，点击下方按钮确认关联。",
  },
  "현재 연결된 폴더": {
    en: "Currently connected folder",
    ja: "現在接続中のフォルダー",
    "zh-CN": "当前关联的文件夹",
  },
  "다른 폴더 선택": {
    en: "Choose another folder",
    ja: "別のフォルダーを選択",
    "zh-CN": "选择其他文件夹",
  },
  "이 폴더로 연결": {
    en: "Connect this folder",
    ja: "このフォルダーに接続",
    "zh-CN": "关联此文件夹",
  },
  "연결 중…": { en: "Connecting…", ja: "接続中…", "zh-CN": "正在关联…" },
  확인: { en: "OK", ja: "確認", "zh-CN": "确认" },
  "이 폴더 정리": {
    en: "Organize this folder",
    ja: "このフォルダーを整理",
    "zh-CN": "整理此文件夹",
  },
  "정리 계획": {
    en: "Organizing plans",
    ja: "整理プラン",
    "zh-CN": "整理计划",
  },
  "목록 확인 중": {
    en: "Checking files",
    ja: "一覧を確認中",
    "zh-CN": "正在检查文件",
  },
  "추천 분석 중": {
    en: "Finding locations",
    ja: "保存先を分析中",
    "zh-CN": "正在分析位置",
  },
  일시정지: { en: "Pause", ja: "一時停止", "zh-CN": "暂停" },
  "파일 이동 중": {
    en: "Moving files",
    ja: "ファイルを移動中",
    "zh-CN": "正在移动文件",
  },
  "이동 처리 완료": {
    en: "Moves processed",
    ja: "移動処理完了",
    "zh-CN": "移动处理完成",
  },
  "일부 확인 필요": {
    en: "Some items need attention",
    ja: "一部確認が必要",
    "zh-CN": "部分项目需要确认",
  },
  "분석 실패": { en: "Analysis failed", ja: "分析に失敗", "zh-CN": "分析失败" },
  "이동 제안": { en: "Suggested moves", ja: "移動候補", "zh-CN": "建议移动" },
  "복구 확인 필요": {
    en: "Recovery needs review",
    ja: "復旧の確認が必要",
    "zh-CN": "需要确认恢复",
  },
  "이동 완료": { en: "Moved", ja: "移動完了", "zh-CN": "已移动" },
  "내 파일로": {
    en: "Back to my files",
    ja: "マイファイルへ",
    "zh-CN": "返回我的文件",
  },
  "하위 폴더 포함": {
    en: "Include subfolders",
    ja: "サブフォルダーを含む",
    "zh-CN": "包含子文件夹",
  },
  "추천 위치 확인": {
    en: "Find suggested locations",
    ja: "保存先候補を確認",
    "zh-CN": "查看建议位置",
  },
  "목록 확인": { en: "Files found", ja: "一覧確認", "zh-CN": "已检查文件" },
  "변경 제안": { en: "Suggested changes", ja: "変更候補", "zh-CN": "修改建议" },
  "확인하고 계속": {
    en: "Review and continue",
    ja: "確認して続行",
    "zh-CN": "确认并继续",
  },
  "남은 항목 검토": {
    en: "Review remaining items",
    ja: "残りを確認",
    "zh-CN": "检查剩余项目",
  },
  "새로 분석": { en: "Analyze again", ja: "再分析", "zh-CN": "重新分析" },
  "추천 항목 전체 선택": {
    en: "Select all suggestions",
    ja: "候補をすべて選択",
    "zh-CN": "选择所有建议",
  },
  "선택 해제": { en: "Clear selection", ja: "選択を解除", "zh-CN": "取消选择" },
  "현재 계획의 모든 페이지에 적용해요.": {
    en: "Applies to all pages in this plan.",
    ja: "このプランの全ページに適用します。",
    "zh-CN": "应用于本计划的所有页面。",
  },
  "위치 직접 선택": {
    en: "Choose a location",
    ja: "保存先を選択",
    "zh-CN": "自行选择位置",
  },
  "위치 선택": {
    en: "Choose location",
    ja: "保存先を選択",
    "zh-CN": "选择位置",
  },
  "분석한 항목부터 표시해요. 화면을 닫아도 계속돼요.": {
    en: "Results appear as they are analyzed. You can leave this screen.",
    ja: "分析できた項目から表示します。画面を閉じても続きます。",
    "zh-CN": "分析结果会逐步显示。关闭此页面也会继续。",
  },
  "이 목록에 표시할 항목이 없어요.": {
    en: "No items in this view.",
    ja: "表示する項目はありません。",
    "zh-CN": "此列表中没有项目。",
  },
  "목적지 폴더 검색": {
    en: "Find a destination folder",
    ja: "保存先フォルダーを検索",
    "zh-CN": "搜索目标文件夹",
  },
  "폴더 이름 또는 경로": {
    en: "Folder name or path",
    ja: "フォルダー名またはパス",
    "zh-CN": "文件夹名称或路径",
  },
  "최대 50개 표시 · 검색으로 좁혀 주세요.": {
    en: "Up to 50 folders shown. Search to narrow the list.",
    ja: "最大50件表示。検索で絞り込めます。",
    "zh-CN": "最多显示50个。请搜索以缩小范围。",
  },
  개씩: { en: "per page", ja: "件ずつ", "zh-CN": "个/页" },
  "확인하지 못한 항목을 제외하고 진행": {
    en: "Continue without unchecked items",
    ja: "未確認の項目を除いて続行",
    "zh-CN": "排除未确认项目后继续",
  },
  "선택한 파일을 이동해요. 버전 보관은 백그라운드에서 진행돼요.": {
    en: "Selected files will be moved. Versions are saved in the background.",
    ja: "選択したファイルを移動し、バックグラウンドでバージョンを保存します。",
    "zh-CN": "将移动所选文件，并在后台保存版本。",
  },
  "선택한 {0}개 이동": {
    en: "Move {0} selected files",
    ja: "選択した{0}件を移動",
    "zh-CN": "移动所选的{0}个文件",
  },
  "이 폴더 안의 파일에 어울리는 위치를 추천해요. 확인하고 선택한 파일만 같은 관리 폴더 안에서 이동해요.":
    {
      en: "Find suitable locations for files in this folder. Only files you select will move within the same managed folder.",
      ja: "このフォルダー内のファイルに適した保存先を提案します。確認して選んだファイルだけを同じ管理フォルダー内で移動します。",
      "zh-CN":
        "为此文件夹中的文件推荐合适位置。仅在同一管理文件夹内移动您确认并选择的文件。",
    },
  "분석만으로 파일을 옮기지 않아요. 다른 위치에 있는 파일을 가져오는 기능이 아니에요.":
    {
      en: "Analysis does not move files or import files from elsewhere.",
      ja: "分析だけではファイルを移動しません。別の場所からの取り込み機能ではありません。",
      "zh-CN": "仅分析不会移动文件，也不会从其他位置导入文件。",
    },
  "관리 폴더 정리 시작": {
    en: "Organize a managed folder",
    ja: "管理フォルダーの整理を開始",
    "zh-CN": "开始整理管理文件夹",
  },
  "관리 폴더 안에서 정리해요": {
    en: "Organize within managed folders",
    ja: "管理フォルダー内で整理",
    "zh-CN": "在管理文件夹内整理",
  },
  "폴더 안 정리": {
    en: "Organize folder contents",
    ja: "フォルダー内を整理",
    "zh-CN": "整理文件夹内容",
  },
  "관리 폴더 안에서 추천을 확인해요": {
    en: "Review suggestions in your folder",
    ja: "管理フォルダー内の候補を確認",
    "zh-CN": "查看管理文件夹内的建议",
  },
  "내 파일에서 폴더 정리": {
    en: "Organize from My files",
    ja: "マイファイルで整理",
    "zh-CN": "从我的文件中整理",
  },
  "내 파일에서 이 폴더 정리를 누르고 추천 위치를 확인하세요. 이동할 항목을 직접 선택해요. 정리할 파일이 없으면 건너뛰어도 괜찮아요.":
    {
      en: "Choose Organize this folder in My files and review the locations. Select what to move. You may skip if there is nothing to organize.",
      ja: "マイファイルでこのフォルダーを整理を選び、候補を確認します。移動対象を選んでください。対象がなければスキップできます。",
      "zh-CN":
        "在我的文件中选择整理此文件夹并查看建议位置。自行选择移动项目；没有需要整理的文件时可以跳过。",
    },
  "확인하지 못한 항목 {0}개가 있어요. 연결 경로·권한·깊이 제한 등을 확인해 주세요. 해당 항목은 실행하지 않아요.":
    {
      en: "{0} items could not be checked. Check links, permissions, and depth limits. These items will not be moved.",
      ja: "{0}件を確認できませんでした。リンク・権限・階層制限を確認してください。これらは移動しません。",
      "zh-CN":
        "有{0}个项目无法确认。请检查链接、权限和目录层级限制。这些项目不会被移动。",
    },
  "직접 선택한 위치예요.": {
    en: "You selected this location.",
    ja: "自分で選んだ保存先です。",
    "zh-CN": "这是您自行选择的位置。",
  },
  "같은 이름의 파일이 있어요.": {
    en: "A file with the same name exists.",
    ja: "同じ名前のファイルがあります。",
    "zh-CN": "存在同名文件。",
  },
  "분석 후 파일이나 폴더가 바뀌었어요. 위치를 다시 확인해 주세요.": {
    en: "The file or folder changed after analysis. Review its location again.",
    ja: "分析後にファイルまたはフォルダーが変わりました。保存先を確認してください。",
    "zh-CN": "分析后文件或文件夹已更改。请重新确认位置。",
  },
  "폴더를 연결하고 관리 폴더 안을 정리해 보세요.": {
    en: "Connect a folder and organize its contents.",
    ja: "フォルダーを接続して中を整理しましょう。",
    "zh-CN": "连接文件夹并整理其中内容。",
  },
  "내 파일에서 폴더를 선택하고 이 폴더 정리를 누르세요. 하위 폴더 포함 여부를 정한 뒤 추천 위치를 확인해요.":
    {
      en: "Choose a folder in My files, then Organize this folder. Set whether to include subfolders and review suggestions.",
      ja: "マイファイルでフォルダーを選び、このフォルダーを整理を押します。サブフォルダーの範囲と候補を確認します。",
      "zh-CN":
        "在我的文件中选择文件夹并点击整理此文件夹。设置是否包含子文件夹，然后确认建议位置。",
    },
  "이동할 항목을 선택해야 실제로 옮겨요. 분석만으로 파일을 변경하지 않아요. 같은 위치에 있는 파일은 유지해요.":
    {
      en: "Files only move after selection. Analysis does not change files. Files already in the right location stay there.",
      ja: "選択した項目だけ移動します。分析では変更しません。同じ場所のファイルはそのままです。",
      "zh-CN": "仅移动选定项目。分析不会修改文件。已在相同位置的文件将保留。",
    },
  "파일을 이동한 뒤 버전 보관은 백그라운드에서 계속돼요. 안내의 다음은 파일을 실행하지 않아요.":
    {
      en: "Version saving continues after the move. Next in this guide does not move files.",
      ja: "移動後もバックグラウンドで保存します。ガイドの次へではファイルを移動しません。",
      "zh-CN": "移动后版本保存会在后台继续。指南中的下一步不会移动文件。",
    },
  "내 파일에서 관리 폴더를 정리하면 기록이 남아요.": {
    en: "Organize a managed folder in My files to create a record.",
    ja: "マイファイルで管理フォルダーを整理すると記録が残ります。",
    "zh-CN": "在我的文件中整理管理文件夹后会留下记录。",
  },
  "내 파일에서 폴더를 고르고 추천 위치를 확인해요.": {
    en: "Choose a folder in My files and review suggested locations.",
    ja: "マイファイルでフォルダーを選び、候補を確認します。",
    "zh-CN": "在我的文件中选择文件夹并查看建议位置。",
  },
  "{3} · 클릭하면 연결 폴더 열기": {
    en: "{3} · Click to open the linked folder",
    ja: "{3} · クリックして接続先を開く",
    "zh-CN": "{3} · 点击打开关联文件夹",
  },
  "{4} 화분 폴더 열기": {
    en: "Open folder for {4}",
    ja: "{4}のフォルダーを開く",
    "zh-CN": "打开{4}的文件夹",
  },
  선택: { en: "Select", ja: "選択", "zh-CN": "选择" },
  페이지: { en: "Page", ja: "ページ", "zh-CN": "页" },
  "새 폴더 승인 필요": {
    en: "Approve new folder",
    ja: "新規フォルダーの承認待ち",
    "zh-CN": "待批准新文件夹",
  },
  제외: { en: "Excluded", ja: "除外", "zh-CN": "排除" },
  "이번에는 유지": {
    en: "Keep this time",
    ja: "今回はそのまま",
    "zh-CN": "此次保留",
  },
  "이동 중": { en: "Moving", ja: "移動中", "zh-CN": "移动中" },
  "내 폴더 구조 활용": {
    en: "Use my folder structure",
    ja: "既存のフォルダー構成を使用",
    "zh-CN": "使用现有文件夹结构",
  },
  "승인한 규칙과 과거 선택을 활용해요.": {
    en: "Use approved rules and past choices.",
    ja: "承認したルールと過去の選択を使います。",
    "zh-CN": "使用已批准的规则和过往选择。",
  },
  "파일 종류로 나누기": {
    en: "Group by file type",
    ja: "ファイルの種類で分ける",
    "zh-CN": "按文件类型分类",
  },
  "문서·이미지·영상·음악·압축으로 나눠요.": {
    en: "Group documents, images, video, audio and archives.",
    ja: "文書・画像・動画・音声・圧縮に分けます。",
    "zh-CN": "分为文档、图像、视频、音频和压缩文件。",
  },
  "이름의 단어로 나누기": {
    en: "Group by words in names",
    ja: "名前の単語で分ける",
    "zh-CN": "按名称中的词语分类",
  },
  "단어와 목적지를 직접 연결해요.": {
    en: "Map words to folders.",
    ja: "単語と保存先を指定します。",
    "zh-CN": "将词语与目标文件夹关联。",
  },
  "날짜로 나누기": {
    en: "Group by date",
    ja: "日付で分ける",
    "zh-CN": "按日期分类",
  },
  "파일명 속 날짜를 연도와 월로 나눠요.": {
    en: "Use the year and month in filenames.",
    ja: "名前の日付を年と月で分けます。",
    "zh-CN": "按文件名日期的年月分类。",
  },
  문서: { en: "Documents", ja: "文書", "zh-CN": "文档" },
  이미지: { en: "Images", ja: "画像", "zh-CN": "图像" },
  영상: { en: "Video", ja: "動画", "zh-CN": "视频" },
  음악: { en: "Audio", ja: "音声", "zh-CN": "音频" },
  압축: { en: "Archives", ja: "圧縮", "zh-CN": "压缩" },
  "정리 진행 보기": {
    en: "View organizing progress",
    ja: "整理状況を見る",
    "zh-CN": "查看整理进度",
  },
  "범위 확인": { en: "Check scope", ja: "範囲の確認", "zh-CN": "确认范围" },
  "기준 고르기": {
    en: "Choose criteria",
    ja: "基準を選択",
    "zh-CN": "选择分类依据",
  },
  "결과 확인 후 이동": {
    en: "Review, then move",
    ja: "確認してから移動",
    "zh-CN": "确认后移动",
  },
  "정리할 범위": {
    en: "Scope to organize",
    ja: "整理する範囲",
    "zh-CN": "整理范围",
  },
  "현재 보고 있는 위치": {
    en: "Current location",
    ja: "現在の表示場所",
    "zh-CN": "当前查看的位置",
  },
  "검색어와 현재 페이지는 정리 범위를 제한하지 않아요.": {
    en: "Search and page filters do not limit this scope.",
    ja: "検索語やページは整理範囲を制限しません。",
    "zh-CN": "搜索条件和当前页不会限制整理范围。",
  },
  "프로젝트·앱 경로 보호": {
    en: "Protect project and app paths",
    ja: "プロジェクト・アプリのパスを保護",
    "zh-CN": "保护项目和应用路径",
  },
  "해제하면 경로를 참조하는 프로젝트가 영향을 받을 수 있어요.": {
    en: "Turning this off can affect projects that reference file paths.",
    ja: "解除するとパスを参照するプロジェクトに影響する場合があります。",
    "zh-CN": "关闭后可能影响引用文件路径的项目。",
  },
  "그대로 둘 하위 폴더 · 한 줄에 하나": {
    en: "Subfolders to keep · one per line",
    ja: "そのままにするサブフォルダー・1行に1つ",
    "zh-CN": "保留的子文件夹·每行一个",
  },
  "어떤 기준으로 나눌까요?": {
    en: "How should files be grouped?",
    ja: "どの基準で分けますか？",
    "zh-CN": "按什么依据分类？",
  },
  목적지: { en: "Destination", ja: "保存先", "zh-CN": "目标位置" },
  "이름에 포함할 단어": {
    en: "Word in filename",
    ja: "名前に含む単語",
    "zh-CN": "文件名包含的词语",
  },
  "목적지 하위 폴더": {
    en: "Destination subfolder",
    ja: "保存先サブフォルダー",
    "zh-CN": "目标子文件夹",
  },
  "단어 추가": { en: "Add word", ja: "単語を追加", "zh-CN": "添加词语" },
  "파일명 날짜 YYYY-MM-DD 또는 YYYYMMDD만 사용해요. 날짜가 없거나 여러 개면 직접 확인해요.":
    {
      en: "Use filename dates in YYYY-MM-DD or YYYYMMDD. Missing or multiple dates need review.",
      ja: "名前のYYYY-MM-DDまたはYYYYMMDDを使います。日付なし・複数は確認が必要です。",
      "zh-CN":
        "仅使用文件名中的YYYY-MM-DD或YYYYMMDD。无日期或多个日期需手动确认。",
    },
  "현재 배치를 정답으로 학습하지 않아요. 모호한 파일은 직접 확인해요.": {
    en: "Current placement is not learned as correct. Ambiguous files need review.",
    ja: "現在の配置を正解として学習しません。不明なファイルは確認します。",
    "zh-CN": "不会将当前存放位置学为正确答案。不明确的文件需手动确认。",
  },
  "목적지는 관리 폴더 기준 상대 경로예요. 없는 폴더는 미리보기에서 생성 승인이 필요해요.":
    {
      en: "Destinations are relative to the managed folder. Approve new folders in the preview.",
      ja: "保存先は管理フォルダーからの相対パスです。新規作成はプレビューで承認します。",
      "zh-CN": "目标位置相对于管理文件夹。新文件夹需在预览中批准创建。",
    },
  "이 범위에서 다음에도 이 기준 사용": {
    en: "Remember these criteria for this scope",
    ja: "この範囲で次回もこの基準を使用",
    "zh-CN": "在此范围内记住分类依据",
  },
  "체크하지 않으면 이번만 정리하고 추천 학습에 남기지 않아요.": {
    en: "Unchecked means this time only, without learning preferences.",
    ja: "オフなら今回のみで、推薦の学習に残しません。",
    "zh-CN": "未选中时仅用于此次整理，不记录到推荐学习。",
  },
  "먼저 예상 결과를 확인해요. 분석만으로 파일을 옮기지 않아요.": {
    en: "Review the preview first. Analysis does not move files.",
    ja: "まず結果を確認します。分析だけでは移動しません。",
    "zh-CN": "先确认预览结果。分析不会移动文件。",
  },
  "예상 결과 보기": {
    en: "Preview results",
    ja: "結果をプレビュー",
    "zh-CN": "预览结果",
  },
  "다음에도 사용": {
    en: "Remember for next time",
    ja: "次回も使用",
    "zh-CN": "下次也使用",
  },
  "이번만 정리": {
    en: "This time only",
    ja: "今回のみ",
    "zh-CN": "仅此次整理",
  },
  "목적지별 보기": {
    en: "View by destination",
    ja: "保存先別に表示",
    "zh-CN": "按目标位置查看",
  },
  "새 폴더": { en: "New folder", ja: "新規フォルダー", "zh-CN": "新文件夹" },
  개: { en: "items", ja: "件", "zh-CN": "项" },
  "승인 전에는 만들거나 옮기지 않아요.": {
    en: "Nothing is created or moved before approval.",
    ja: "承認前には作成・移動しません。",
    "zh-CN": "批准前不会创建或移动。",
  },
  "생성 승인 취소": {
    en: "Revoke folder approval",
    ja: "作成承認を取り消す",
    "zh-CN": "撤销创建批准",
  },
  "폴더 생성 승인": {
    en: "Approve folder creation",
    ja: "フォルダー作成を承認",
    "zh-CN": "批准创建文件夹",
  },
  "폴더 이름을 확인해 주세요.": {
    en: "Check the folder name.",
    ja: "フォルダー名を確認してください。",
    "zh-CN": "请检查文件夹名称。",
  },
  "관리 폴더 안의 일반 하위 폴더 이름을 입력해 주세요.": {
    en: "Enter a valid subfolder inside the managed folder.",
    ja: "管理フォルダー内の有効なサブフォルダー名を入力してください。",
    "zh-CN": "请输入管理文件夹内的有效子文件夹名称。",
  },
  "정리 기준을 선택해 주세요.": {
    en: "Choose organizing criteria.",
    ja: "整理基準を選んでください。",
    "zh-CN": "请选择整理依据。",
  },
  "정리 범위와 이름 단어를 확인해 주세요.": {
    en: "Check the scope and filename words.",
    ja: "範囲と名前の単語を確認してください。",
    "zh-CN": "请检查范围和文件名词语。",
  },
  "이름 단어를 입력해 주세요.": {
    en: "Enter a filename word.",
    ja: "名前の単語を入力してください。",
    "zh-CN": "请输入文件名词语。",
  },
  "이름 단어와 목적지를 한 개 이상 지정해 주세요.": {
    en: "Add at least one word and destination.",
    ja: "単語と保存先を1つ以上指定してください。",
    "zh-CN": "请至少指定一个词语和目标位置。",
  },
  "확장자에 따른 파일 종류 기준이에요.": {
    en: "File type determined by extension.",
    ja: "拡張子によるファイル種別です。",
    "zh-CN": "根据扩展名确定文件类型。",
  },
  "분류할 수 없는 파일 형식이에요. 직접 확인해 주세요.": {
    en: "Unknown file type. Choose a location.",
    ja: "不明なファイル形式です。保存先を確認してください。",
    "zh-CN": "未知文件类型。请手动确认位置。",
  },
  "내가 지정한 이름 단어와 일치해요.": {
    en: "Matches a word you specified.",
    ja: "指定した名前の単語と一致します。",
    "zh-CN": "与您指定的名称词语匹配。",
  },
  "이름 단어가 여러 목적지와 일치해요.": {
    en: "Words match multiple destinations.",
    ja: "単語が複数の保存先に一致します。",
    "zh-CN": "词语与多个目标位置匹配。",
  },
  "지정한 이름 단어가 없어요.": {
    en: "No specified words matched.",
    ja: "指定した単語がありません。",
    "zh-CN": "未匹配指定词语。",
  },
  "파일명에 날짜가 없거나 여러 개예요.": {
    en: "The filename has no date or multiple dates.",
    ja: "名前に日付がないか、複数あります。",
    "zh-CN": "文件名中没有日期或有多个日期。",
  },
  "파일명 날짜가 올바르지 않아요.": {
    en: "The filename date is invalid.",
    ja: "名前の日付が無効です。",
    "zh-CN": "文件名中的日期无效。",
  },
  "파일명에 있는 유효한 날짜의 연도와 월이에요.": {
    en: "Year and month from a valid filename date.",
    ja: "名前の有効な日付の年と月です。",
    "zh-CN": "文件名有效日期的年份和月份。",
  },
  "보호하거나 그대로 두기로 한 범위예요.": {
    en: "This scope is protected or kept in place.",
    ja: "保護または維持する範囲です。",
    "zh-CN": "此范围已受保护或设为保留。",
  },
  "프로젝트 보호 범위로는 옮기지 않아요.": {
    en: "Files do not move into protected projects.",
    ja: "保護されたプロジェクトへは移動しません。",
    "zh-CN": "不会移动到受保护的项目范围。",
  },
  "내 파일에서 폴더를 선택하고 설정 옆의 폴더 정리를 누르세요. 범위와 기준을 고른 뒤 예상 결과를 확인해요.":
    {
      en: "In My files, choose a folder and click Organize folder beside Settings. Choose the scope and criteria, then review the preview.",
      ja: "マイファイルでフォルダーを選び、設定の隣のフォルダー整理を押します。範囲と基準を選び、予測結果を確認します。",
      "zh-CN":
        "在我的文件中选择文件夹，点击设置旁的整理文件夹。选择范围和分类标准，再查看预览。",
    },
  "내 파일의 설정 옆에서 폴더 정리를 누르세요. 기준과 예상 결과를 확인하고 이동할 항목을 직접 선택해요. 정리할 파일이 없으면 건너뛰어도 괜찮아요.":
    {
      en: "In My files, click Organize folder beside Settings. Review the criteria and preview, then select files to move. You can skip if there is nothing to organize.",
      ja: "マイファイルで設定の隣のフォルダー整理を押します。基準と予測結果を確認し、移動する項目を選びます。整理するものがなければスキップできます。",
      "zh-CN":
        "在我的文件中点击设置旁的整理文件夹。检查分类标准和预览，手动选择要移动的文件。没有要整理的文件时可以跳过。",
    },
  "그대로 둘 폴더는 목적지로 선택할 수 없어요.": {
    en: "A protected folder cannot be selected as a destination.",
    ja: "保護するフォルダーは保存先に選択できません。",
    "zh-CN": "不能选择保留的文件夹作为目标。",
  },
  "파일 관리 상태": {
    en: "File management status",
    ja: "ファイル管理状態",
    "zh-CN": "文件管理状态",
  },
  "관리 해제": { en: "Stop managing", ja: "管理を解除", "zh-CN": "停止管理" },
  "관리 해제한 파일": {
    en: "Unmanaged file",
    ja: "管理を解除したファイル",
    "zh-CN": "已停止管理的文件",
  },
  "관리 해제한 파일이에요.": {
    en: "This file is no longer managed.",
    ja: "管理を解除したファイルです。",
    "zh-CN": "此文件已停止管理。",
  },
  "자동 관리와 일반 목록에서 제외했어요. 보관된 버전은 여기서 확인하거나 복원할 수 있어요.":
    {
      en: "Excluded from automatic management and the main list. You can view or restore saved versions here.",
      ja: "自動管理と通常の一覧から除外しました。保存済みバージョンはここで確認・復元できます。",
      "zh-CN": "已从自动管理和常规列表中排除。可以在此查看或恢复已保存版本。",
    },
  "다시 관리": {
    en: "Resume management",
    ja: "管理を再開",
    "zh-CN": "恢复管理",
  },
  "계속 관리": { en: "Keep managing", ja: "管理を続ける", "zh-CN": "继续管理" },
  "계속 관리 중 · 파일을 기다려요": {
    en: "Still managed · waiting for the file",
    ja: "管理を継続中・ファイルを待っています",
    "zh-CN": "仍在管理 · 等待文件",
  },
  "이 파일을 계속 관리할까요?": {
    en: "Keep managing this file?",
    ja: "このファイルの管理を続けますか？",
    "zh-CN": "继续管理此文件吗？",
  },
  "현재 경로에 파일이 없어요. 계속 관리하면 파일이 돌아왔을 때 다시 확인해요. 기존 보관본은 남아 있어요.":
    {
      en: "The file is missing from its path. Keep managing to check it when it returns. Saved versions remain available.",
      ja: "現在のパスにファイルがありません。管理を続けると、戻った際に再確認します。保存済みバージョンは残っています。",
      "zh-CN":
        "当前路径中没有此文件。继续管理将在文件返回时重新检查。已保存版本仍然保留。",
    },
  "관리 해제 확인": {
    en: "Confirm stop managing",
    ja: "管理解除を確認",
    "zh-CN": "确认停止管理",
  },
  "목록과 자동 관리에서 제외해요. 같은 경로의 파일이 다시 생겨도 다시 관리하기 전에는 보관하지 않아요. 실제 파일과 기존 버전은 삭제하지 않으며 보관 공간도 줄지 않아요.":
    {
      en: "Exclude this path from the list and automatic management until you resume. Files and saved versions are not deleted; storage usage will not decrease.",
      ja: "再開するまで、このパスを一覧と自動管理から除外します。ファイルや保存済みバージョンは削除されず、保存容量も減りません。",
      "zh-CN":
        "恢复管理前，将从列表和自动管理中排除此路径。不会删除实际文件或已保存版本，也不会减少存储用量。",
    },
  "관리를 해제했어요. 보관본은 관리 해제 목록에 남아 있어요.": {
    en: "Management stopped. Saved versions remain in the unmanaged list.",
    ja: "管理を解除しました。保存済みバージョンは解除済み一覧に残ります。",
    "zh-CN": "已停止管理。已保存版本仍保留在停止管理列表中。",
  },
  "관리 선택을 저장했어요.": {
    en: "Your management choice was saved.",
    ja: "管理の選択を保存しました。",
    "zh-CN": "已保存管理选择。",
  },
  "관리 상태별 파일 목록": {
    en: "Files by management status",
    ja: "管理状態別ファイル一覧",
    "zh-CN": "按管理状态列出文件",
  },
  "{0} · {1}개{2}": {
    en: "{0} · {1} files{2}",
    ja: "{0} · {1}件{2}",
    "zh-CN": "{0} · {1}个文件{2}",
  },
  "{4} · 클릭하면 연결 폴더 열기": {
    en: "{4} · Click to open the linked folder",
    ja: "{4} · クリックして接続フォルダーを開く",
    "zh-CN": "{4} · 点击打开关联文件夹",
  },
  "화분에 폴더를 먼저 연결해 주세요.": {
    en: "Connect a folder to this pot first.",
    ja: "先に鉢へフォルダーを接続してください。",
    "zh-CN": "请先为花盆关联文件夹。",
  },
  "파일을 연결된 화분 위에 놓아 주세요.": {
    en: "Drop files onto a connected pot.",
    ja: "ファイルを接続済みの鉢にドロップしてください。",
    "zh-CN": "请将文件拖放到已关联的花盆上。",
  },
  "진행 중인 확인을 마친 뒤 다시 놓아 주세요.": {
    en: "Finish the current review before dropping more files.",
    ja: "確認を終えてから、もう一度ドロップしてください。",
    "zh-CN": "请完成当前确认后再拖放文件。",
  },
  "파일을 다시 놓아 주세요.": {
    en: "Please drop the files again.",
    ja: "ファイルをもう一度ドロップしてください。",
    "zh-CN": "请重新拖放文件。",
  },
  "데스크톱 앱에서 파일을 정리해 주세요.": {
    en: "Use the desktop app to organize files.",
    ja: "デスクトップアプリでファイルを整理してください。",
    "zh-CN": "请在桌面应用中整理文件。",
  },
  "파일을 확인한 뒤 관리 화면에서 복사·이동을 선택해 주세요.": {
    en: "After checking the files, choose Copy or Move in the main window.",
    ja: "ファイル確認後、管理画面でコピー・移動を選んでください。",
    "zh-CN": "检查文件后，请在管理界面选择复制或移动。",
  },
  "미보관·제외": {
    en: "Unsaved / excluded",
    ja: "未保存・除外",
    "zh-CN": "未保存／排除",
  },
  "최근 검사에서 보관하지 못했거나 제외한 항목이에요. 제외 폴더는 폴더 한 개로 표시하며, 내부 파일과 아직 확인하지 못한 범위는 모두 나열하지 않아요.":
    {
      en: "Items not saved or excluded in the latest scan. Excluded folders appear as one item; their contents and unscanned areas are not fully listed.",
      ja: "前回の確認で保存できなかった項目や除外した項目です。除外フォルダーは1件として表示し、内部や未確認の範囲はすべて列挙しません。",
      "zh-CN":
        "显示最近扫描中未保存或被排除的项目。排除文件夹按一项显示，不会完整列出其内部文件和未扫描范围。",
    },
  "폴더 범위": {
    en: "Folder scope",
    ja: "フォルダー範囲",
    "zh-CN": "文件夹范围",
  },
  "규칙 제외": {
    en: "Excluded by rule",
    ja: "ルールで除外",
    "zh-CN": "规则排除",
  },
  미보관: { en: "Not saved", ja: "未保存", "zh-CN": "未保存" },
  "자동 보관 제외 규칙에 해당해요.": {
    en: "Excluded by an automatic backup rule.",
    ja: "自動保存の除外ルールに該当します。",
    "zh-CN": "符合自动保存排除规则。",
  },
  "아직 확인·보관을 마치지 못했어요.": {
    en: "Checking and saving have not finished yet.",
    ja: "確認・保存はまだ完了していません。",
    "zh-CN": "尚未完成检查和保存。",
  },
  "사용자가 자동 관리를 해제했어요.": {
    en: "Automatic management was stopped by the user.",
    ja: "ユーザーが自動管理を解除しました。",
    "zh-CN": "用户已停止自动管理。",
  },
  "목록 한도에 도달해 이 폴더의 나머지 항목은 확인하지 못했어요.": {
    en: "The listing limit was reached; the remaining items in this folder were not checked.",
    ja: "一覧の上限に達したため、このフォルダーの残りの項目は未確認です。",
    "zh-CN": "已达到列表上限，未检查此文件夹中的剩余项目。",
  },
  "읽기 권한 또는 경로를 확인해 주세요.": {
    en: "Check read permissions or the path.",
    ja: "読み取り権限またはパスを確認してください。",
    "zh-CN": "请检查读取权限或路径。",
  },
  "파일 10,000개 한도로 나머지 항목은 확인하지 못했어요.": {
    en: "The 10,000-file limit prevented checking the remaining items.",
    ja: "ファイル10,000件の上限により残りの項目は未確認です。",
    "zh-CN": "由于一万个文件的限制，未检查剩余项目。",
  },
  "연결·권한 또는 지원하지 않는 파일 형식을 확인해 주세요.": {
    en: "Check links, permissions or an unsupported file type.",
    ja: "リンク・権限・未対応のファイル形式を確認してください。",
    "zh-CN": "请检查链接、权限或不支持的文件类型。",
  },
  "관리 폴더 기록 삭제": {
    en: "Delete managed folder records",
    ja: "管理フォルダーの記録を削除",
    "zh-CN": "删除管理文件夹记录",
  },
  "파일 관리 기록 삭제": {
    en: "Delete file management records",
    ja: "ファイル管理の記録を削除",
    "zh-CN": "删除文件管理记录",
  },
  "관리 기록 삭제": {
    en: "Delete management records",
    ja: "管理記録を削除",
    "zh-CN": "删除管理记录",
  },
  "관리 기록 삭제 확인": {
    en: "Confirm management record deletion",
    ja: "管理記録の削除を確認",
    "zh-CN": "确认删除管理记录",
  },
  "실제 파일과 폴더는 그대로 두고, 앱의 관리 기록과 보관 버전을 삭제해요.": {
    en: "Delete the app's management records and saved versions while keeping actual files and folders.",
    ja: "実際のファイルとフォルダーを残し、アプリの管理記録と保存済みバージョンを削除します。",
    "zh-CN": "保留实际文件和文件夹，删除应用的管理记录及保存版本。",
  },
  "폴더 연결과 관련 정리·버전 이력을 삭제해요. 폴더 안의 실제 파일은 삭제하지 않아요.":
    {
      en: "Remove the folder connection and related organizing and version history. Actual files in the folder are kept.",
      ja: "フォルダーの接続と関連する整理・バージョン履歴を削除します。フォルダー内の実際のファイルは削除しません。",
      "zh-CN":
        "删除文件夹连接及相关整理和版本历史。文件夹中的实际文件不会被删除。",
    },
  "같은 경로의 관리 기록과 관련 정리·버전 이력을 삭제하고 자동 관리에서 제외해요. 원본 파일은 삭제하지 않아요.":
    {
      en: "Delete management records and related organizing and version history for this path, and stop automatic management. The original file is kept.",
      ja: "同じパスの管理記録と関連する整理・バージョン履歴を削除し、自動管理から除外します。元のファイルは削除しません。",
      "zh-CN":
        "删除相同路径的管理记录及相关整理和版本历史，并停止自动管理。原文件不会被删除。",
    },
  "삭제한 버전은 앱에서 복원할 수 없어요. 다른 파일의 보관 이력은 유지해요.": {
    en: "Deleted versions cannot be restored in the app. Other files' saved history is kept.",
    ja: "削除したバージョンはアプリで復元できません。他のファイルの保存履歴は維持します。",
    "zh-CN": "删除的版本无法在应用中恢复。其他文件的保存历史将保留。",
  },
  "원본 유지하고 기록 삭제": {
    en: "Keep originals and delete records",
    ja: "元のファイルを残して記録を削除",
    "zh-CN": "保留原文件并删除记录",
  },
  "기록 삭제 중…": {
    en: "Deleting records…",
    ja: "記録を削除中…",
    "zh-CN": "正在删除记录…",
  },
  "관리 기록을 삭제했어요. 실제 파일과 폴더는 그대로예요.": {
    en: "Management records were deleted. Actual files and folders are unchanged.",
    ja: "管理記録を削除しました。実際のファイルとフォルダーはそのままです。",
    "zh-CN": "已删除管理记录。实际文件和文件夹保持不变。",
  },
  "관리 기록을 삭제했어요. 원본은 그대로이며 보관 공간 정리는 다음 시작 때 다시 시도해요.":
    {
      en: "Records were deleted and originals are unchanged. Storage cleanup will retry on next launch.",
      ja: "記録を削除し、元のファイルはそのままです。保存領域の整理は次回起動時に再試行します。",
      "zh-CN": "已删除记录，原文件保持不变。存储空间清理将在下次启动时重试。",
    },
  "관리 기록과 보관 버전을 삭제했어요. 원본은 그대로이며, 다시 관리하면 새 이력을 시작해요.":
    {
      en: "Management records and saved versions were deleted. The original remains; resuming management starts new history.",
      ja: "管理記録と保存済みバージョンを削除しました。元のファイルはそのままで、管理を再開すると新しい履歴を開始します。",
      "zh-CN":
        "已删除管理记录和保存版本。原文件保持不变，重新管理将开始新的历史。",
    },
  "진행 중인 작업을 마친 뒤 기록을 삭제해 주세요.": {
    en: "Finish the current task before deleting records.",
    ja: "進行中の作業が完了してから記録を削除してください。",
    "zh-CN": "请等待当前任务完成后再删除记录。",
  },
  "저장소를 다시 확인한 뒤 기록을 삭제해 주세요.": {
    en: "Check the storage again before deleting records.",
    ja: "保存領域を再確認してから記録を削除してください。",
    "zh-CN": "请重新检查存储后再删除记录。",
  },
  "관리 기록을 삭제하고 있어요. 잠시 기다려 주세요.": {
    en: "Deleting management records. Please wait.",
    ja: "管理記録を削除しています。しばらくお待ちください。",
    "zh-CN": "正在删除管理记录，请稍候。",
  },
  "폴더 정리 작업을 마치거나 중단한 뒤 기록을 삭제해 주세요.": {
    en: "Finish or pause folder organization before deleting records.",
    ja: "フォルダー整理を完了または中断してから記録を削除してください。",
    "zh-CN": "请完成或暂停文件夹整理后再删除记录。",
  },
  "삭제할 관리 기록을 다시 선택해 주세요.": {
    en: "Select the management records to delete again.",
    ja: "削除する管理記録を選び直してください。",
    "zh-CN": "请重新选择要删除的管理记录。",
  },
  "삭제할 관리 기록을 찾지 못했어요.": {
    en: "The management records to delete were not found.",
    ja: "削除する管理記録が見つかりませんでした。",
    "zh-CN": "未找到要删除的管理记录。",
  },
  "이전 기록 삭제를 먼저 완료해 주세요.": {
    en: "Complete the previous record deletion first.",
    ja: "前の記録削除を先に完了してください。",
    "zh-CN": "请先完成上一次记录删除。",
  },
  "보관 중인 작업을 마친 뒤 기록을 삭제해 주세요.": {
    en: "Finish saving pending work before deleting records.",
    ja: "保存中の作業が完了してから記録を削除してください。",
    "zh-CN": "请等待保存任务完成后再删除记录。",
  },
  "기록 저장소 상태가 바뀌었어요. 삭제 복구를 확인해 주세요.": {
    en: "The record store changed. Check deletion recovery.",
    ja: "記録の保存状態が変わりました。削除の復旧を確認してください。",
    "zh-CN": "记录存储状态已改变，请检查删除恢复。",
  },
  "기록 삭제됨": {
    en: "Records deleted",
    ja: "記録削除済み",
    "zh-CN": "记录已删除",
  },
  "기록 없음": { en: "No records", ja: "記録なし", "zh-CN": "无记录" },
  "저장된 버전이 없어요": {
    en: "No saved versions",
    ja: "保存済みバージョンはありません",
    "zh-CN": "没有保存版本",
  },
  "기록 삭제를 백그라운드에서 진행해요. 다른 화면을 사용해도 괜찮아요.": {
    en: "Record deletion is running in the background. You can use other screens.",
    ja: "記録の削除をバックグラウンドで進めます。他の画面を利用できます。",
    "zh-CN": "正在后台删除记录。您可以使用其他页面。",
  },
  "진행 중인 보관을 마친 뒤 기록 삭제를 시작해요.": {
    en: "Record deletion will start after the current save finishes.",
    ja: "進行中の保存が終わった後、記録の削除を開始します。",
    "zh-CN": "当前保存完成后将开始删除记录。",
  },
  "관리 기록을 백그라운드에서 삭제하고 있어요.": {
    en: "Deleting management records in the background.",
    ja: "管理記録をバックグラウンドで削除しています。",
    "zh-CN": "正在后台删除管理记录。",
  },
  "기록 삭제를 마무리하고 보관 공간을 정리하고 있어요.": {
    en: "Finishing record deletion and cleaning up storage.",
    ja: "記録の削除を仕上げ、保存領域を整理しています。",
    "zh-CN": "正在完成记录删除并清理存储空间。",
  },
  "기록 삭제를 완료하지 못했어요. 작업 상태를 확인해 주세요.": {
    en: "Record deletion could not finish. Check the task status.",
    ja: "記録の削除を完了できませんでした。作業状態を確認してください。",
    "zh-CN": "未能完成记录删除。请检查任务状态。",
  },
  "다른 화면을 사용해도 계속돼요. 기록 변경 작업은 완료 후 사용할 수 있어요.": {
    en: "It continues while you use other screens. Record changes are available when it finishes.",
    ja: "他の画面を利用しても続きます。記録の変更は完了後に利用できます。",
    "zh-CN": "使用其他页面时仍会继续。完成后即可更改记录。",
  },
  "기록 삭제 작업이 중단됐어요. 다시 확인해 주세요.": {
    en: "Record deletion was interrupted. Please check again.",
    ja: "記録の削除が中断されました。再度確認してください。",
    "zh-CN": "记录删除已中断。请重新检查。",
  },
  "파일 관리 메뉴": {
    en: "File management menu",
    ja: "ファイル管理メニュー",
    "zh-CN": "文件管理菜单",
  },
  "다른 이름으로 저장": {
    en: "Save As",
    ja: "名前を付けて保存",
    "zh-CN": "另存为",
  },
  저장: { en: "Save", ja: "保存", "zh-CN": "保存" },
  "독립 표본": {
    en: "Independent samples",
    ja: "独立サンプル",
    "zh-CN": "独立样本",
  },
  폴더: { en: "Folders", ja: "フォルダー", "zh-CN": "文件夹" },
  "폴더별 표본 합계": {
    en: "Sum of folder samples",
    ja: "フォルダー別サンプルの合計",
    "zh-CN": "各文件夹样本总数",
  },
  "범위 보기": { en: "View scopes", ja: "範囲を見る", "zh-CN": "查看范围" },
  "이름 규칙 살펴보기": {
    en: "Browse naming rules",
    ja: "名前のルールを確認",
    "zh-CN": "浏览命名规则",
  },
  "이름·경로·패턴 검색": {
    en: "Search names, paths or patterns",
    ja: "名前・パス・パターンを検索",
    "zh-CN": "搜索名称、路径或模式",
  },
  "모든 폴더": {
    en: "All folders",
    ja: "すべてのフォルダー",
    "zh-CN": "所有文件夹",
  },
  "폴더 필터는 선택한 폴더 바로 아래 파일에 적용돼요.": {
    en: "The folder filter includes only files directly inside that folder.",
    ja: "フォルダーフィルターは直下のファイルだけが対象です。",
    "zh-CN": "文件夹筛选仅包含该文件夹中的直接文件。",
  },
  "같은 패턴을 묶었어요. 범위를 확인한 뒤 폴더별로 승인해 주세요.": {
    en: "Identical patterns are grouped. Review the scope and approve each folder separately.",
    ja: "同じパターンをまとめました。範囲を確認し、フォルダーごとに承認してください。",
    "zh-CN": "已合并相同模式。请确认范围后逐个文件夹批准。",
  },
  "모든 패턴 보기": {
    en: "All patterns",
    ja: "すべてのパターン",
    "zh-CN": "所有模式",
  },
  "조건에 맞는 새 패턴이 없어요.": {
    en: "No new patterns match these filters.",
    ja: "条件に合う新しいパターンはありません。",
    "zh-CN": "没有符合条件的新模式。",
  },
  "불일치·판단 보류를 먼저 보여요. 규칙 없는 파일은 오류가 아니에요.": {
    en: "Mismatches and uncertain results appear first. Files without a rule are not errors.",
    ja: "不一致と判断保留を先に表示します。ルールのないファイルはエラーではありません。",
    "zh-CN": "优先显示不匹配和待判断项。没有规则的文件不是错误。",
  },
  "형식의 일치 여부이며 내용의 정확도가 아니에요.": {
    en: "This checks the name format, not the accuracy of its contents.",
    ja: "名前の形式の一致を確認します。内容の正確さではありません。",
    "zh-CN": "此项检查名称格式是否匹配，不判断内容准确性。",
  },
  "확인이 필요한 파일이 없어요. 다른 상태를 선택해 목록을 볼 수 있어요.": {
    en: "No files need attention. Select another status to view its files.",
    ja: "確認が必要なファイルはありません。他の状態を選ぶと一覧を表示できます。",
    "zh-CN": "没有需要确认的文件。选择其他状态可查看列表。",
  },
  "조건에 맞는 파일이 없어요.": {
    en: "No files match these filters.",
    ja: "条件に合うファイルはありません。",
    "zh-CN": "没有符合条件的文件。",
  },
  "패턴 페이지": {
    en: "Pattern pages",
    ja: "パターンのページ",
    "zh-CN": "模式分页",
  },
  "점검 페이지": { en: "Check pages", ja: "点検のページ", "zh-CN": "检查分页" },
  "관리 파일 용량": {
    en: "Managed file size",
    ja: "管理ファイル容量",
    "zh-CN": "受管理文件大小",
  },
  "연결된 로컬 드라이브인지 확인해 주세요.": {
    en: "Check that the local drive is connected.",
    ja: "ローカルドライブの接続を確認してください。",
    "zh-CN": "请确认本地驱动器已连接。",
  },
  "관리 폴더는 로컬 NTFS 또는 exFAT 드라이브에서 사용할 수 있어요.": {
    en: "Managed folders support local NTFS and exFAT drives.",
    ja: "管理フォルダーはローカルのNTFSまたはexFATドライブで利用できます。",
    "zh-CN": "管理文件夹支持本地 NTFS 和 exFAT 驱动器。",
  },
  "파일 정리는 NTFS에서 지원해요. exFAT 폴더는 버전 보관과 다른 이름으로 복원을 사용할 수 있어요.":
    {
      en: "File organization requires NTFS. exFAT folders support version storage and restoration under another name.",
      ja: "ファイル整理はNTFSに対応しています。exFATフォルダーではバージョン保存と別名での復元を利用できます。",
      "zh-CN": "文件整理需要 NTFS。exFAT 文件夹支持版本保存和以其他名称恢复。",
    },
  "바로가기 설정": {
    en: "Shortcut settings",
    ja: "ショートカット設定",
    "zh-CN": "快捷方式设置",
  },
  "관리 작업": {
    en: "Management actions",
    ja: "管理操作",
    "zh-CN": "管理操作",
  },
  "기존 보관 버전과 원본 파일은 유지해요.": {
    en: "Saved versions and original files are kept.",
    ja: "保存済みバージョンと元のファイルは保持されます。",
    "zh-CN": "保留已保存的版本和原始文件。",
  },
  "새로운 파일 변경의 자동 보관을 중단해요.": {
    en: "Stop automatically saving new file changes.",
    ja: "今後のファイル変更の自動保存を停止します。",
    "zh-CN": "停止自动保存新的文件更改。",
  },
  연결됨: { en: "Connected", ja: "接続済み", "zh-CN": "已连接" },
  "상세 닫기": { en: "Close details", ja: "詳細を閉じる", "zh-CN": "关闭详情" },
  "보관 상태 설명": {
    en: "Explain storage status",
    ja: "保存状態の説明",
    "zh-CN": "保存状态说明",
  },
  "제외 규칙 적용 후 보관 완료 개수 · 미보관 {3}개 · 제외 {4}개 · 마지막 검사 {5}":
    {
      en: "Saved count after exclusions · {3} unsaved · {4} excluded · Last scan {5}",
      ja: "除外後の保管数 · 未保管{3}個 · 除外{4}個 · 最終確認{5}",
      "zh-CN":
        "排除规则应用后的保存数量 · 未保存{3}个 · 排除{4}个 · 最近检查{5}",
    },
};
let rt = "ko";
function eo(e) {
  if (typeof e != "string") return "ko";
  const t = e.toLowerCase().replace(/_/g, "-");
  return t === "en" || t.startsWith("en-")
    ? "en"
    : t === "ja" || t.startsWith("ja-")
      ? "ja"
      : t === "zh" || t === "zh-cn" || t === "zh-sg" || t.startsWith("zh-hans")
        ? "zh-CN"
        : "ko";
}
function to(e) {
  return ((rt = eo(e)), rt);
}
function Fe() {
  return rt === "ko"
    ? "ko-KR"
    : rt === "en"
      ? "en-US"
      : rt === "ja"
        ? "ja-JP"
        : "zh-CN";
}
function ao() {
  return rt;
}
function a(e) {
  return rt === "ko"
    ? e
    : e.replace(/[^<>"'\n]+/g, (t) => {
        const s = t.trim(),
          n = Object.hasOwn(Vn, s) ? Vn[s] : void 0;
        return n
          ? t.slice(0, t.indexOf(s)) + n[rt] + t.slice(t.indexOf(s) + s.length)
          : t;
      });
}
function m(e, ...t) {
  const s = e.reduce((n, o, i) => n + (i ? `{${i - 1}}` : "") + o, "");
  return a(s).replace(/\{(\d+)\}/g, (n, o) =>
    Number(o) < t.length ? String(t[Number(o)] ?? "") : n,
  );
}
function no(e) {
  (to(e),
    (document.documentElement.lang = ao()),
    (document.title = a("작은 창틀")));
}
function Cs(e = "ko") {
  return [
    ["ko", "한국어"],
    ["en", "English"],
    ["ja", "日本語"],
    ["zh-CN", "简体中文"],
  ]
    .map(
      ([t, s]) =>
        `<option value="${t}" ${e === t ? "selected" : ""}>${s}</option>`,
    )
    .join("");
}
function Gn(e) {
  if (document.querySelector("dialog.management-dialog"))
    return Promise.resolve(!1);
  const t = document.createElement("dialog");
  ((t.className = "management-dialog"),
    t.setAttribute("aria-labelledby", "management-dialog-title"),
    t.setAttribute("aria-describedby", "management-dialog-description"));
  const s = document.createElement("h2");
  ((s.id = "management-dialog-title"), (s.textContent = e.title));
  const n = document.createElement("div");
  n.id = "management-dialog-description";
  const o = document.createElement("strong");
  ((o.className = "management-target"), (o.textContent = e.path), n.append(o));
  for (const d of e.messages) {
    const r = document.createElement("p");
    ((r.textContent = d), n.append(r));
  }
  const i = document.createElement("footer"),
    c = document.createElement("button"),
    u = document.createElement("button");
  return (
    (c.className = "button outline"),
    (c.textContent = a("취소")),
    (c.id = "management-dialog-cancel"),
    (c.autofocus = !0),
    (u.className = `button ${e.danger ? "management-danger" : "primary"}`),
    (u.textContent = e.action),
    (u.id = "management-dialog-confirm"),
    i.append(c, u),
    t.append(s, n, i),
    document.body.append(t),
    new Promise((d) => {
      let r = !1;
      const f = (b) => {
        r || ((r = !0), t.close(), t.remove(), d(b));
      };
      ((c.onclick = () => f(!1)),
        (u.onclick = () => f(!0)),
        t.addEventListener("cancel", (b) => {
          (b.preventDefault(), f(!1));
        }),
        t.addEventListener("keydown", (b) => {
          (b.stopPropagation(),
            b.key === "Tab" &&
              (b.preventDefault(),
              (document.activeElement === c ? u : c).focus()));
        }),
        t.showModal(),
        c.focus());
    })
  );
}
function wt(e) {
  const t = e.querySelector("summary"),
    s = e.querySelector(".file-management-options");
  if (
    (t == null || t.setAttribute("aria-expanded", String(e.open)),
    !s || !e.open)
  )
    return;
  s.style.translate = "";
  const n = s.getBoundingClientRect(),
    o =
      n.left < 8
        ? 8 - n.left
        : n.right > innerWidth - 8
          ? innerWidth - 8 - n.right
          : 0,
    i =
      n.bottom > innerHeight - 8
        ? Math.max(8 - n.top, innerHeight - 8 - n.bottom)
        : 0;
  s.style.translate = `${o}px ${i}px`;
}
function ws() {
  document.querySelectorAll(".file-management-menu").forEach(wt);
}
document.addEventListener(
  "toggle",
  (e) => {
    e.target instanceof HTMLDetailsElement &&
      e.target.matches(".file-management-menu") &&
      wt(e.target);
  },
  !0,
);
window.addEventListener("resize", ws);
document.addEventListener("click", (e) => {
  e.target.closest(".file-management-menu") ||
    document.querySelectorAll(".file-management-menu[open]").forEach((t) => {
      ((t.open = !1), wt(t));
    });
});
document.addEventListener("keydown", (e) => {
  var c;
  const t = e.target.closest(".file-management-menu");
  if (!t) return;
  const s = t.querySelector("summary"),
    n = Array.from(t.querySelectorAll('[role="menuitem"]:not(:disabled)'));
  if (e.target === s && ["Enter", " "].includes(e.key)) {
    (e.preventDefault(),
      e.stopImmediatePropagation(),
      (t.open = !t.open),
      wt(t),
      t.open && ((c = n[0]) == null || c.focus()));
    return;
  }
  if (e.key === "Escape" && t.open) {
    (e.preventDefault(),
      e.stopImmediatePropagation(),
      (t.open = !1),
      wt(t),
      s.focus());
    return;
  }
  if (e.key === "Tab") {
    ((t.open = !1), wt(t));
    return;
  }
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key) || !n.length)
    return;
  (e.preventDefault(), e.stopImmediatePropagation(), (t.open = !0), wt(t));
  const o = n.indexOf(document.activeElement),
    i =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? n.length - 1
          : e.key === "ArrowDown"
            ? (o + 1) % n.length
            : o < 0
              ? n.length - 1
              : (o - 1 + n.length) % n.length;
  n[i].focus();
});
function ys(e, t = [], s = "ko") {
  const n = new Map(t.map((o, i) => [o, i]));
  return [...e].sort(
    (o, i) =>
      (n.get(o.id) ?? 1 / 0) - (n.get(i.id) ?? 1 / 0) ||
      o.path.localeCompare(i.path, s, { numeric: !0 }),
  );
}
function so(e, t, s) {
  const n = e.indexOf(t),
    o = e.indexOf(s);
  if (n < 0 || o < 0 || n === o) return [...e];
  const i = [...e];
  return (i.splice(n, 1), i.splice(o, 0, t), i);
}
function oo(e, t, s) {
  let n = "",
    o = !1,
    i = !1,
    c;
  const u = () => Array.from(e.querySelectorAll("[data-root-order]")),
    d = (v) => {
      var T;
      return (T = v.target) == null ? void 0 : T.closest("[data-root-order]");
    },
    r = () => {
      ((n = ""),
        c == null || c.remove(),
        (c = void 0),
        document.body.classList.remove("root-sorting"),
        u().forEach((v) =>
          v.classList.remove(
            "order-dragging",
            "order-target",
            "order-before",
            "order-after",
          ),
        ),
        s());
    };
  async function f(v, T) {
    if (!i) {
      i = !0;
      try {
        await t(
          so(
            u().map((I) => I.dataset.root),
            v,
            T,
          ),
        );
      } finally {
        i = !1;
      }
    }
  }
  let b;
  const j = (v) => {
    var T;
    return (T = document.elementFromPoint(v.clientX, v.clientY)) == null
      ? void 0
      : T.closest("[data-root-order]");
  };
  return (
    e.addEventListener("pointerdown", (v) => {
      const T = d(v);
      !T ||
        i ||
        v.button !== 0 ||
        (b = { id: v.pointerId, x: v.clientX, y: v.clientY, source: T });
    }),
    e.addEventListener("pointermove", (v) => {
      if (
        !b ||
        b.id !== v.pointerId ||
        (!n && Math.hypot(v.clientX - b.x, v.clientY - b.y) < 6)
      )
        return;
      if (!n) {
        ((n = b.source.dataset.root), e.setPointerCapture(v.pointerId));
        const l = b.source.getBoundingClientRect();
        ((c = b.source.cloneNode(!0)),
          c.classList.remove("selected"),
          c.classList.add("root-order-ghost"),
          c.removeAttribute("data-root-order"),
          c.removeAttribute("data-action"),
          c.removeAttribute("id"),
          c.setAttribute("aria-hidden", "true"),
          (c.tabIndex = -1),
          (c.style.width = l.width + "px"),
          (c.style.height = l.height + "px"),
          document.body.append(c),
          b.source.classList.add("order-dragging"),
          document.body.classList.add("root-sorting"));
      }
      c &&
        ((c.style.left = v.clientX - 30 + "px"),
        (c.style.top = v.clientY - 25 + "px"));
      const T = j(v),
        I = u(),
        h = I.indexOf(b.source) < I.indexOf(T);
      (I.forEach((l) => {
        (l.classList.toggle(
          "order-target",
          l === T && l !== (b == null ? void 0 : b.source),
        ),
          l.classList.toggle("order-after", l === T && h),
          l.classList.toggle(
            "order-before",
            l === T && !h && l !== (b == null ? void 0 : b.source),
          ));
      }),
        v.preventDefault());
    }),
    e.addEventListener(
      "pointerup",
      (v) => {
        if (!b || b.id !== v.pointerId || ((b = void 0), !n)) return;
        const T = n,
          I = j(v);
        ((o = !0),
          setTimeout(() => (o = !1), 0),
          e.hasPointerCapture(v.pointerId) &&
            e.releasePointerCapture(v.pointerId),
          I && e.contains(I) && f(T, I.dataset.root),
          r());
      },
      !0,
    ),
    e.addEventListener("pointercancel", () => {
      ((b = void 0), r());
    }),
    e.addEventListener(
      "keydown",
      (v) => {
        v.key === "Escape" && n && (v.preventDefault(), (b = void 0), r());
      },
      !0,
    ),
    e.addEventListener("lostpointercapture", () => {
      ((b = void 0), n && r());
    }),
    e.addEventListener(
      "click",
      (v) => {
        o && (v.preventDefault(), v.stopImmediatePropagation());
      },
      !0,
    ),
    e.addEventListener("keydown", (v) => {
      const T = d(v);
      if (!T || !v.altKey) return;
      const arrows = T.classList.contains("managed-folder-row")
        ? ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
        : ["ArrowLeft", "ArrowRight"];
      if (!arrows.includes(v.key)) return;
      v.preventDefault();
      const I = u().map((z) => z.dataset.root),
        h = I.indexOf(T.dataset.root),
        l = h + (["ArrowUp", "ArrowLeft"].includes(v.key) ? -1 : 1);
      if (l < 0 || l >= I.length) return;
      const g = T.dataset.root;
      f(g, I[l]).then(() => {
        var z;
        return (z = u().find((A) => A.dataset.root === g)) == null
          ? void 0
          : z.focus();
      });
    }),
    () => !!n
  );
}
const D = (e) =>
    String(e ?? "").replace(
      /[&<>"']/g,
      (t) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[t],
    ),
  oa = (e) => e.split(/[\\/]/).pop() || e;
function io(e) {
  var n;
  const t = (n = e.managed) == null ? void 0 : n.recordJob;
  if (!t) return "";
  const s = {
    queued: "진행 중인 보관을 마친 뒤 기록 삭제를 시작해요.",
    deleting: "관리 기록을 백그라운드에서 삭제하고 있어요.",
    compacting: "기록 삭제를 마무리하고 보관 공간을 정리하고 있어요.",
    done: t.cleanupPending
      ? "관리 기록을 삭제했어요. 원본은 그대로이며 보관 공간 정리는 다음 시작 때 다시 시도해요."
      : "관리 기록을 삭제했어요. 실제 파일과 폴더는 그대로예요.",
    failed: "기록 삭제를 완료하지 못했어요. 작업 상태를 확인해 주세요.",
  };
  return `<div class="record-job" role="status" data-record-phase="${D(t.phase)}"><span>${D(a(s[t.phase] || s.queued))}${e.managed.deleting ? `<small>${D(a("다른 화면을 사용해도 계속돼요. 기록 변경 작업은 완료 후 사용할 수 있어요."))}</small>` : ""}${t.error ? `<small>${D(a(t.error))}</small>` : ""}</span>${t.phase === "failed" ? `<button class="button outline" data-action="ws-retry">${D(a("다시 확인"))}</button>` : ""}</div>`;
}
const Qn = new Set([
    "failed",
    "canceled",
    "skipped",
    "not_moved",
    "interrupted",
  ]),
  ro = {
    queued: "대기",
    running: "진행 중",
    completed: "정리 완료",
    failed: "실패",
    canceled: "취소됨",
    skipped: "건너뜀",
    not_moved: "이동 안 됨",
    interrupted: "중단됨",
    needs_review: "확인 필요",
    retried: "재시도 기록으로 연결",
    undone: "되돌림",
  };
function zs(e) {
  var c, u, d, r, f, b;
  const t = ((c = e.tasks) == null ? void 0 : c.counts) || {},
    s = ((u = e.managed) == null ? void 0 : u.roots) || [],
    n = [
      "failed",
      "skipped",
      "not_moved",
      "interrupted",
      "needs_review",
    ].reduce((j, v) => j + (t[v] || 0), 0),
    o = e.ops.filter((j) =>
      ["needs_review", "undo_planned"].includes(j.status),
    ).length,
    i = s.filter((j) => j.active && ["initial", "scanning"].includes(j.status));
  return {
    attention:
      Math.max(n, o) +
      ((d = e.managed) != null && d.error ? 1 : 0) +
      s.filter((j) => j.error).length +
      (((r = e.aftercare) == null ? void 0 : r.counts.failed) || 0),
    waiting: Math.max(
      0,
      (((f = e.progress) == null ? void 0 : f.total) || 0) -
        (((b = e.progress) == null ? void 0 : b.current) || 0) -
        1,
    ),
    active: i,
  };
}
function lo(e) {
  var c, u, d, r, f;
  const t = zs(e),
    s = e.progress,
    n =
      (((c = e.aftercare) == null ? void 0 : c.counts.queued) || 0) +
      (((u = e.aftercare) == null ? void 0 : u.counts.running) || 0),
    o =
      (d = e.organize) == null
        ? void 0
        : d.find((b) =>
            ["indexing", "analyzing", "executing"].includes(b.state),
          ),
    i = o
      ? a(
          o.state === "executing"
            ? "파일 이동 중"
            : o.state === "indexing"
              ? "목록 확인 중"
              : "추천 분석 중",
        )
      : s
        ? m`정리 ${s.current} / ${s.total}`
        : e.busy
          ? a("파일 상태 확인 중")
          : n
            ? m`백그라운드 보관 ${n}개`
            : t.active.length
              ? m`보관 검사 ${t.active.length}개 폴더`
              : (r = e.managed) != null && r.storageWorking
                ? a("보관 기록 압축 중")
                : a("작업 상태");
  return `<button class="task-bar ${s || n || t.active.length || ((f = e.managed) != null && f.storageWorking) ? "is-active" : ""}" data-action="tasks-open" aria-label="${D(a("작업 상태 열기"))}"><span class="task-dot"></span><span>${D(i)}</span>${t.waiting ? `<small>${D(m`대기 ${t.waiting}개`)}</small>` : ""}${t.attention ? `<small class="task-attention">${D(m`확인 ${t.attention}건`)}</small>` : `<small>${D(a("자세히 보기"))}</small>`}<span aria-hidden="true">⌃</span></button>`;
}
function xn(e, t = Date.now()) {
  const s = e.progress;
  return s
    ? s.cancelRequested
      ? a("중지 요청됨 · 현재 보관 작업이 끝나면 남은 파일을 멈춰요.")
      : !s.phaseAt || t - s.phaseAt < 15e3
        ? ""
        : s.phase === "원본 보관 및 이력 저장 중"
          ? a(
              "보관 순서를 기다리거나 원본을 저장하고 있어요. 현재 파일·Git 작업은 안전하게 마친 뒤 넘어가요.",
            )
          : a(
              "현재 파일 작업을 기다리고 있어요. 이 창을 닫아도 작업은 계속돼요.",
            )
    : "";
}
function co(e, t = !1) {
  var j, v, T, I, h;
  const s = e.busy || t ? "disabled" : "",
    n = e.progress,
    o = ((j = e.tasks) == null ? void 0 : j.items) || [],
    i = ((v = e.managed) == null ? void 0 : v.roots) || [],
    c = o.filter((l) => ["running", "queued"].includes(l.status)),
    u = o.filter((l) => Qn.has(l.status) || l.status === "needs_review"),
    d = o.filter((l) => !c.includes(l) && !u.includes(l)),
    r = (l, g, z = "") =>
      `<button class="button small outline" data-action="${l}" ${z}>${D(a(g))}</button>`,
    f = (l) => {
      var g;
      return `<article class="task-row"><div><strong>${D(l.name || oa(l.source))}</strong><span>${D(((g = e.plants[l.plant]) == null ? void 0 : g.name) || "")} · ${D(a(ro[l.status] || l.status))}</span>${l.reason ? `<p>${D(a(l.reason))}</p>` : ""}</div>${Qn.has(l.status) && !l.rootId && e.native && e.tasks ? r("task-retry", "다시 확인·목적지 선택", `data-task="${D(l.id)}" ${s}`) : l.status === "needs_review" ? r("task-check", "상태 다시 확인", s) : ""}</article>`;
    },
    b = e.ops.filter(
      (l) =>
        ["needs_review", "undo_planned"].includes(l.status) &&
        !o.some((g) => g.operation === l.id),
    );
  return `<div class="task-center">${
    (T = e.organize) != null && T.length
      ? `<section><h3>${D(a("정리 계획"))}</h3>${e.organize
          .slice(0, 5)
          .map(
            (l) =>
              `<article class="task-row"><div><strong>${D(oa(l.scope))}</strong><small>${D(a({ indexing: "목록 확인 중", analyzing: "추천 분석 중", executing: "파일 이동 중", review: "추천 확인", done: "이동 처리 완료", partial: "일부 확인 필요", paused: "일시정지", failed: "분석 실패" }[l.state] || l.state))}</small></div>${r("dash-root", "내 파일 보기", `data-root="${D(l.root)}"`)}</article>`,
          )
          .join("")}</section>`
      : ""
  }${n ? `<section class="task-current"><span class="eyebrow">${D(a("진행 중"))}</span><h3>${D(n.name)}</h3><p>${D(a(n.phase || "파일 상태 확인 중"))} · ${n.current} / ${n.total}</p><p class="task-wait" data-task-wait role="status">${D(xn(e))}</p>${r("cancel", n.cancelRequested ? "중지 요청됨" : "남은 작업 중지", n.cancelRequested ? "disabled" : "")}</section>` : e.busy ? `<p role="status">${D(a("파일 상태 확인 중"))}</p>` : ""}
  ${(I = e.managed) != null && I.error ? `<p class="inline-warning">${D(a(e.managed.error))}</p>${r("task-scan-retry", "보관 상태 다시 확인", s)}` : ""}
  ${(h = e.aftercare) != null && h.items.length ? `<details data-disclosure="tasks-aftercare" open><summary>${D(a("파일 전달 후 버전 보관"))}</summary><p>${D(a("복사·이동은 끝났어요. 보관 실패 시 파일을 다시 옮기지 않고 보관만 재시도해요."))}</p>${e.aftercare.items.map((l) => `<article class="task-row"><div><strong>${D(oa(l.destination))}</strong><span>${D(a({ queued: "보관 대기", running: "백그라운드 보관 중", completed: "버전 보관 완료", failed: "보관 확인 필요", superseded: "보관 전 되돌림" }[l.status] || l.status))}</span>${l.reason ? `<p>${D(a(l.reason))}</p>` : ""}</div>${l.status === "failed" ? r("aftercare-retry", "보관만 재시도", `data-task="${D(l.id)}" ${s}`) : ""}</article>`).join("")}</details>` : ""}
  ${i.length ? `<details data-disclosure="tasks-roots" ${i.some((l) => l.error || ["initial", "scanning"].includes(l.status)) ? "open" : ""}><summary>${D(a("자동 버전 보관"))}</summary>${i.map((l) => `<article class="task-row"><div><strong>${D(oa(l.path))}</strong><span>${D(l.active ? (l.status === "scanning" ? m`파일 확인 ${l.processed || 0} / ${l.total || 0}` : l.status === "initial" ? a("보관 검사 대기") : m`보관 ${l.stored || 0} / ${l.total || 0}`) : a("관리 중단"))}</span>${l.error ? `<p>${D(a(l.error))}</p>` : ""}</div>${l.active && l.error ? r("task-scan", "이 폴더 다시 확인", `data-root="${D(l.id)}" ${s}`) : ""}</article>`).join("")}</details>` : ""}
  ${c.length ? `<h3>${D(a("진행·대기"))}</h3>${c.map(f).join("")}` : ""}
  <h3>${D(a("확인할 작업"))}</h3>${u.map(f).join("")}${b.map((l) => `<article class="task-row"><div><strong>${D(oa(l.source))}</strong><p>${D(a(l.error.replace("UNDO:", "") || "이전 작업의 상태 확인이 필요해요."))}</p></div>${r("task-check", "상태 다시 확인", s)}</article>`).join("")}${!u.length && !b.length ? `<p class="subtle">${D(a("확인이 필요한 정리 작업이 없어요."))}</p>` : ""}
  ${d.length ? `<details data-disclosure="tasks-done"><summary>${D(a("최근 처리 기록"))}</summary>${d.map(f).join("")}</details>` : ""}
  <p class="subtle">${D(a("최근 100개 · 확인할 작업 우선 표시. 완료 기록은 정리 기록에서도 볼 수 있어요."))}</p><p class="subtle">${D(a("재시도는 현재 파일과 목적지를 다시 확인해요. 확인창에서 실행해야 복사·이동해요."))}</p></div>`;
}
const E = (e) =>
    String(e ?? "").replace(
      /[&<>"']/g,
      (t) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[t],
    ),
  Ba = (e) => e.split(/[\\/]/).pop() || e,
  Kn = (e) =>
    e
      ? new Date(e).toLocaleString(Fe(), {
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : a("아직 확인 전"),
  Oa = (e) => Number(e || 0).toLocaleString(Fe()),
  ca = (e) =>
    e == null
      ? a("확인 중")
      : e < 1024
        ? `${e} B`
        : e < 1024 ** 2
          ? `${(e / 1024).toFixed(1)} KiB`
          : e < 1024 ** 3
            ? `${(e / 1024 ** 2).toFixed(1)} MiB`
            : `${(e / 1024 ** 3).toFixed(1)} GiB`;
let Yt = { sizes: [], recent: [], opened: [] },
  Wt = !1;
async function ho(e, t) {
  if (!t.native || !e.manage) {
    ((Yt = { sizes: [], recent: [], opened: [] }), (Wt = !1));
    return;
  }
  try {
    ((Yt = await e.manage("dashboard")), (Wt = !1));
  } catch {
    ((Yt = { sizes: [], recent: [], opened: [] }), (Wt = !0));
  }
}
const Ae = (e, t, s = "", n = "outline", o = !1) =>
  `<button class="${n === "dash-pot-link" ? n : "button " + n}" data-action="${e}" ${s}>${E(o ? t : a(t))}</button>`;
function Et(e, t) {
  var s;
  return (
    ((e == null ? void 0 : e.plant) != null &&
      ((s = t.plants.find((n) => n.id === e.plant)) == null
        ? void 0
        : s.name)) ||
    Ba((e == null ? void 0 : e.path) || "")
  );
}
function Ma(e) {
  return `<div class="dash-meter" aria-hidden="true"><i style="width:${Math.min(100, Math.max(0, e))}%"></i></div>`;
}
function _n(e) {
  const t = Yt.sizes.find((o) => o.root === e.id),
    s = !Wt && e.total === 0 && e.total_known && e.active && !e.error,
    n =
      s ||
      (!Wt &&
        !!e.total_known &&
        !e.error &&
        !!e.active &&
        (t == null ? void 0 : t.measured) === (t == null ? void 0 : t.files) &&
        (t == null ? void 0 : t.files) === e.total &&
        !["scanning", "initial", "unavailable"].includes(e.status));
  return {
    display: s ? "0 B" : ca(t != null && t.measured ? t.bytes : void 0),
    complete: n,
  };
}
function uo(e, t) {
  var v, T, I, h, l, g, z, A, $, C;
  const s = ys(
      ((v = e.managed) == null ? void 0 : v.roots) || [],
      e.settings.managedRootOrder,
      Fe(),
    ),
    n = (T = e.managed) == null ? void 0 : T.storage,
    o = zs(e),
    i = e.progress,
    c =
      (((I = e.aftercare) == null ? void 0 : I.counts.running) || 0) +
      (((h = e.aftercare) == null ? void 0 : h.counts.queued) || 0),
    u =
      !!i ||
      e.busy ||
      c > 0 ||
      o.active.length > 0 ||
      ((l = e.managed) == null ? void 0 : l.storageWorking),
    d = o.active[0],
    r = i
      ? i.phase || a("파일 상태 확인 중")
      : e.busy
        ? a("파일 상태 확인 중")
        : c
          ? a("백그라운드 보관 중")
          : d
            ? a("변경 확인 중")
            : (g = e.managed) != null && g.storageWorking
              ? a("보관 기록 압축 중")
              : a("진행 중인 작업이 없어요"),
    f = (i == null ? void 0 : i.current) ?? (d == null ? void 0 : d.processed),
    b = (i == null ? void 0 : i.total) ?? (d == null ? void 0 : d.total),
    j = (S, w = !1) =>
      S.length
        ? S.slice(0, 3)
            .map((F) => {
              const R = s.find((U) => U.id === F.root);
              return `<button class="dash-file" data-action="dash-file" data-root="${E(F.root)}" data-file="${E(F.id)}"><span class="dash-file-icon" aria-hidden="true">▤</span><span class="dash-file-text"><strong>${E(Ba(F.path))}</strong><small>${E(Et(R, e))}</small></span><span class="dash-file-meta">${w ? E(a("열림 상태 확인 불가")) : `v${F.version} · ${E(F.kind === "restore" ? a("복원") : a("버전 보관"))}`}<small>${E(Kn(w ? F.opened : F.created))}</small></span></button>`;
            })
            .join("")
        : `<p class="dash-empty">${E(a(Wt ? "목록을 불러오지 못했어요. 다시 확인해 주세요." : w ? "앱에서 파일을 열면 여기에 남아요." : "파일의 첫 버전을 보관하면 여기에 보여요."))}</p>`;
  return `<div class="dash-home"><div class="section-heading"><div><span class="eyebrow" data-ui-label="homeEyebrow">${E(((z = e.settings.uiLabels) == null ? void 0 : z.overviewEyebrow) || "MY LITTLE WINDOWSILL")}</span><h1 data-ui-label="homeTitle">${E(((A = e.settings.uiLabels) == null ? void 0 : A.overviewTitle) || a("홈"))}</h1><p data-ui-label="homeDescription">${E((($ = e.settings.uiLabels) == null ? void 0 : $.overviewDescription) || a("파일은 제자리에, 책상에는 작은 여유."))}</p></div>${Ae("widget", "작은 창틀 열기")}</div>
 <div class="dash-top"><section class="panel dash-pots"><div class="dash-head"><h2 data-ui-label="sceneTitle">${E(a("나의 작은 창틀"))}</h2>${Ae("dash-plants", "화분 설정", "", "small outline")}</div><div class="dash-scene" style="--dash-scene-width:${Math.max(100, t.length * 77)}px"><canvas id="hero" aria-label="${E(a("나의 도트 창틀"))}"></canvas><div class="dash-pot-links">${t
   .map((S) => {
     const w = s.find((F) => F.path === S.folder);
     return Ae(
       w ? "dash-root" : "plant",
       S.name,
       w
         ? `data-root="${E(w.id)}" data-drop-plant="${S.id}"`
         : `data-id="${S.id}" data-drop-plant="${S.id}"`,
       "dash-pot-link",
       !0,
     );
   })
   .join(
     "",
   )}</div></div><div class="dash-pot-foot"><span data-ui-label="shortcutsTitle">${E(a("화분 바로가기"))}</span>${Ae("nav", "테마 둘러보기", 'data-page="themes"', "small outline")}</div></section>
 <section class="panel dash-running"><div class="dash-head"><h2>${E(a("진행 중인 작업"))}${u ? '<span class="dash-live" aria-hidden="true"></span>' : ""}</h2>${Ae("tasks-open", "상태 보기", "", "small outline")}</div><div class="dash-task-body"><strong>${E(a(r))}</strong><p>${E((i == null ? void 0 : i.name) || (d ? Et(d, e) : c ? m`백그라운드 보관 ${c}개` : a("새 작업이 시작되면 여기에서 확인해요.")))}</p>${u && b ? `<div class="dash-task-count">${Oa(f || 0)} / ${Oa(b)}</div>${Ma(((f || 0) / b) * 100)}` : ""}<div class="dash-task-foot"><span>${E(a(u ? "다른 작업을 계속해도 괜찮아요." : "파일은 제자리에 있어요."))}</span>${o.attention ? Ae("tasks-open", m`확인 ${o.attention}건`, "", "small outline") : ""}</div></div></section></div>
 <div class="dash-files"><section class="panel" aria-label="dashboard-opened"><div class="dash-head"><h2>${E(a("열려 있는 파일"))}</h2>${Ae("dash-open-info", "표시 기준", "", "small outline")}</div><p class="dash-list-note">${E(a("앱에서 연 기록 · 실제 열림 여부는 확인할 수 없어요."))}</p><div class="dash-file-list">${j(Yt.opened, !0)}</div></section><section class="panel" aria-label="dashboard-recent"><div class="dash-head"><h2 data-ui-label="organizedMetric">${E(a("최근 작업한 파일"))}</h2>${Ae("nav", "내 파일", 'data-page="files"', "small outline")}</div><p class="dash-list-note">${E(a("최근 버전 보관 · 파일별 최신 기록"))}</p><div class="dash-file-list">${j(Yt.recent)}</div></section></div>
 <section><div class="dash-section-head"><h2 data-ui-label="folderMetric">${E(a("내 관리 폴더"))} <small>${s.length}</small></h2>${Ae("ws-connect", "관리 폴더 추가", `data-id="-1" ${!e.native || e.busy ? "disabled" : ""}`, "small outline")}</div>${
   s.length
     ? `<div class="dash-folder-grid">${s
         .map((S, w) => {
           const F = Math.min(S.total, S.stored),
             R = S.error || !S.active,
             U = _n(S);
           return `<button class="dash-folder-card" data-action="dash-root" data-root="${E(S.id)}" aria-label="${E(Et(S, e))} · ${E(a("내 파일"))}"><span class="dash-folder-icon shade-${w % 3}" aria-hidden="true"></span><span class="dash-folder-name">${E(Et(S, e))}</span><small class="dash-folder-basename">${E(Ba(S.path) === Et(S, e) ? a("자동 버전 보관") : Ba(S.path))}</small><span class="dash-folder-count"><strong>${Oa(F)}</strong><span data-ui-label="savedMetric">${E(a("개 관리"))}</span><small>/ ${S.total_known ? Oa(S.total) : E(a("확인 중"))}</small></span><span class="dash-folder-size" title="${E(a("원본 관리 파일의 최근 확인 용량 · 버전 보관소와 달라요."))}"><span>${E(a(U.complete ? "관리 파일 용량" : "확인된 용량"))}</span><strong>${E(U.display)}</strong></span>${Ma(S.total ? (F / S.total) * 100 : 0)}<span class="dash-folder-foot"><span>${E(a(S.active ? (R ? "관리 상태 확인 필요" : S.status === "scanning" || S.status === "initial" ? "변경 확인 중" : F < S.total ? "일부 보관 대기/불가" : "보관 완료") : "관리 중단"))}</span><span>↗</span></span></button>`;
         })
         .join("")}</div>`
     : `<div class="panel dash-empty">${E(a("관리 폴더를 연결하면 카드로 보여요."))}</div>`
 }</section>
 <section class="dash-storage"><div class="dash-section-head"><h2>${E(a("공간 현황"))}</h2>${Ae("nav", "보관 공간", 'data-page="storage"', "small outline")}</div><div class="dash-capacity"><div><h3>${E(a("폴더별 사용량"))}</h3><div class="dash-usage-list">${
   s.length
     ? s
         .map((S) => {
           const w = _n(S);
           return `<div class="dash-usage"><span>${E(Et(S, e))}</span><strong>${E(w.display)}</strong>${!w.complete && S.total > 0 ? `<small>${E(a("확인된 용량"))}</small>` : ""}</div>`;
         })
         .join("")
     : E(a("아직 확인 전"))
 }</div><p>${E(a("원본 관리 파일의 최근 확인 용량 · 버전 보관소와 달라요."))}</p></div><div><h3>${E(a("디스크 여유"))}</h3><strong class="dash-capacity-number">${E(ca(n == null ? void 0 : n.free))}</strong><small>${E(a("앱 보관소가 있는 디스크"))}</small>${(n == null ? void 0 : n.diskTotal) != null && (n == null ? void 0 : n.free) != null ? Ma(((n.diskTotal - n.free) / n.diskTotal) * 100) : ""}<p>${n != null && n.diskTotal ? `${E(a("전체"))} ${E(ca(n.diskTotal))}` : E(a("조회할 수 없는 정보는 확인 중으로 표시해요."))}</p></div><div><h3>${E(a("남은 보관 한도"))}</h3><strong class="dash-capacity-number">${E(ca(n == null ? void 0 : n.remaining))}</strong><small>${E(a("보관 한도"))} ${E(ca((C = e.managed) == null ? void 0 : C.budget))}</small>${n ? Ma((n.used / n.budget) * 100) : ""}<p>${E(a("최근 확인"))} ${E(Kn(n == null ? void 0 : n.checked))}</p></div></div></section>
 <div class="dash-bottom"><span>${E(a("파일 내용은 이 컴퓨터에 머물러요."))}</span>${Ae("nav", "정리 기록 보기", 'data-page="history"', "small outline")}</div></div>`;
}
function po(e, t) {
  let s = !1;
  const n = (i) => {
      var c, u;
      return (u = (c = i.target) == null ? void 0 : c.closest) == null
        ? void 0
        : u.call(c, "[data-drop-plant]");
    },
    o = () =>
      e
        .querySelectorAll(".file-drop-hover")
        .forEach((i) => i.classList.remove("file-drop-hover"));
  const receive = (files, i) => {
    o();
    if (!files.length) return;
    i.preventDefault();
    const target = n(i);
    if (!target) {
      t.notice("파일을 연결된 화분 위에 놓아 주세요.");
      return;
    }
    if (s || t.blocked()) {
      t.notice("진행 중인 확인을 마친 뒤 다시 놓아 주세요.");
      return;
    }
    const plant = Number(target.dataset.dropPlant);
    if (!Number.isInteger(plant) || plant < 0 || plant > 2) return;
    s = true;
    t.receive(files, plant)
      .catch(error => t.notice(error instanceof Error ? error.message : "파일을 다시 놓아 주세요."))
      .finally(() => { s = false; });
  };
  e.addEventListener("garden-native-drop", (i) => {
    if (i.detail.phase === "drop") receive([{ token: i.detail.token }], i);
    else if (!s && !t.blocked()) n(i)?.classList.add("file-drop-hover");
  });
  e.addEventListener("dragover", (i) => {
    var d;
    if (
      !Array.from(
        ((d = i.dataTransfer) == null ? void 0 : d.types) || [],
      ).includes("Files")
    )
      return;
    (i.preventDefault(), o());
    const c = n(i),
      u = !!c && !s && !t.blocked();
    (i.dataTransfer && (i.dataTransfer.dropEffect = u ? "copy" : "none"),
      u && c.classList.add("file-drop-hover"));
  });
  e.addEventListener("dragleave", o);
  e.addEventListener("drop", (i) => receive(Array.from(i.dataTransfer?.files ?? []), i));
}
const ta = [
  ["homeTitle", "홈", 60],
  ["homeEyebrow", "MY LITTLE WINDOWSILL", 60],
  ["homeDescription", "파일은 제자리에, 책상에는 작은 여유.", 160],
  ["overviewEyebrow", "AT A GLANCE", 60],
  ["overviewTitle", "오늘의 창틀", 60],
  ["overviewDescription", "관리 중인 파일과 최근 정리를 한눈에 확인해요.", 160],
  ["folderMetric", "관리 폴더", 60],
  ["savedMetric", "보관한 파일", 60],
  ["organizedMetric", "정리한 파일", 60],
  ["sceneTitle", "나의 작은 창틀", 60],
  ["shortcutsTitle", "화분 바로가기", 60],
  ["shortcutNoun", "화분", 30],
  ["recentTitle", "최근 정리", 60],
  ["brandTitle", "작은 창틀", 60],
  ["sidebarCaption", "나의 작은 공간", 60],
  ["topCaption", "나만의 작은 생태계", 60],
  ["filesTitle", "내 파일", 60],
  ["themesTitle", "테마", 60],
  ["settingsTitle", "설정", 60],
  ["historyTitle", "정리 기록", 60],
];
function fo(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    throw Error("INVALID_LABELS");
  const t = {};
  for (const [s, n] of Object.entries(e)) {
    const o = ta.find((i) => i[0] === s);
    if (
      !o ||
      typeof n != "string" ||
      Array.from(n).length > o[2] ||
      /[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/.test(n)
    )
      throw Error("INVALID_LABELS");
    n.trim() && (t[o[0]] = n.trim());
  }
  return t;
}
let At = {},
  $t = ta[0][0],
  et = !1,
  _a = "";
const ia = (e) =>
  String(e ?? "").replace(
    /[&<>"']/g,
    (t) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        t
      ],
  );
function mo(e, t = {}) {
  e.querySelectorAll("[data-ui-label]").forEach((s) => {
    const n = s.dataset.uiLabel;
    Object.hasOwn(t, n) && typeof t[n] == "string" && (s.textContent = t[n]);
  });
}
function go(e = {}) {
  ((At = { ...e }), ($t = ta[0][0]), (_a = ""));
}
function vo() {
  const e = ta.find((t) => t[0] === $t);
  return m`<p>내 화면의 제목과 표시 이름을 바꿔요. 실제 파일·폴더 이름이나 경로는 바뀌지 않아요.</p><label for="ui-label-key">바꿀 문구</label><select id="ui-label-key" ${et ? "disabled" : ""}>${ta.map(([t, s]) => `<option value="${t}" ${t === $t ? "selected" : ""}>${ia(a(s))}</option>`).join("")}</select><label for="ui-label-value">내 문구</label><input id="ui-label-value" maxlength="${e[2]}" value="${ia(At[e[0]] || "")}" placeholder="${ia(a(e[1]))}" ${et ? "disabled" : ""}><p class="subtle">비워 두면 기본 문구를 사용해요. 테마·언어를 바꿔도 직접 쓴 문구는 유지돼요.</p><p class="label-preview"><span>미리보기</span><strong id="ui-label-preview">${ia(At[e[0]] || a(e[1]))}</strong></p><p role="alert">${ia(_a)}</p><div class="workspace-actions"><button class="button outline" data-action="labels-reset-one" ${et ? "disabled" : ""}>이 문구 기본값</button><button class="button outline" data-action="labels-reset-all" ${et ? "disabled" : ""}>모두 기본값</button><button class="button primary" data-action="labels-save" ${et ? "disabled" : ""}>문구 저장</button></div><p class="subtle">이 기기에만 저장해요. 안전 안내·오류·복사/이동 버튼의 의미는 유지해요.</p>`;
}
function In(e) {
  if (e.id === "ui-label-key") return (($t = e.value), !0);
  if (e.id === "ui-label-value") {
    At[$t] = e.value;
    const t = document.getElementById("ui-label-preview");
    t && (t.textContent = e.value || a(ta.find((s) => s[0] === $t)[1]));
  }
  return !1;
}
async function bo(e, t, s) {
  if (et) return !1;
  if (e === "labels-reset-one") return (delete At[$t], s(), !1);
  if (e === "labels-reset-all") return ((At = {}), s(), !1);
  if (e !== "labels-save") return !1;
  try {
    ((et = !0), (_a = ""), s());
    let n;
    try {
      n = fo(At);
    } catch {
      throw Error(a("문구의 길이와 사용할 수 없는 문자를 확인해 주세요."));
    }
    return (await t.setting("uiLabels", n), !0);
  } catch (n) {
    return (
      (_a = n instanceof Error ? n.message : a("다시 시도해 주세요.")),
      !1
    );
  } finally {
    ((et = !1), s());
  }
}
const Xn = (e) =>
  String(e ?? "").replace(
    /[&<>"']/g,
    (t) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        t
      ],
  );
function No(e) {
  return m`<div class="setting-row"><div><h3>오류 기록 보내기</h3><p>문제가 생기면 진단 파일을 저장해 개발자에게 전달해 주세요.</p></div><button class="button outline" data-action="diagnostics-preview" ${e ? "" : "disabled"}>진단 파일 만들기</button></div>${e ? "" : m`<p class="subtle">설치한 앱에서 사용할 수 있어요.</p>`}`;
}
function Co(e, t) {
  return m`<p>앱 버전, 운영체제, 오류 코드와 발생 순서를 담아요.</p><p class="subtle">파일 내용·이름·경로·계정·비밀번호·토큰은 포함하지 않아요. 자동 전송하지 않아요.</p><p class="subtle">최근 14일, 최대 3MiB를 이 기기에 기록하고 최근 500건까지 내보내요.</p>${e.storageAvailable ? "" : m`<p role="alert">디스크에 기록하지 못했어요. 현재 실행 중 메모리에 남은 기록을 포함해요.</p>`}<details class="diagnostic-details"><summary>저장할 내용 확인</summary><pre class="diagnostic-json" tabindex="0">${Xn(e.text)}</pre></details>${t ? `<p role="alert">${Xn(t)}</p>` : ""}`;
}
function wo(e, t = window) {
  const s = (n, o) => {
    var i;
    try {
      const c = o;
      (i = e.diagnostics) == null ||
        i
          .call(e, n, {
            kind:
              typeof (c == null ? void 0 : c.name) == "string"
                ? c.name
                : "Error",
            stack:
              typeof (c == null ? void 0 : c.stack) == "string"
                ? c.stack.slice(0, 12e3)
                : "",
          })
          .catch(() => {});
    } catch {}
  };
  (t.addEventListener("error", (n) => s("renderer-error", n.error)),
    t.addEventListener("unhandledrejection", (n) =>
      s("renderer-rejection", n.reason),
    ));
}
function yo(e) {
  var d, r;
  const t = e.tutorial,
    s = (((d = e.managed) == null ? void 0 : d.roots) || []).filter(
      (f) => f.active,
    ),
    n = e.plants.find((f) => f.folder && s.some((b) => b.path === f.folder)),
    o =
      (t == null ? void 0 : t.status) === "active"
        ? (e.ops || []).filter(
            (f) =>
              f.status === "completed" &&
              f.created >= t.startedAt &&
              !t.baseline.includes(f.id),
          )
        : [],
    i = o.find((f) => {
      var b;
      return (((b = e.aftercare) == null ? void 0 : b.items) || []).some(
        (j) =>
          j.operation === f.id &&
          j.status === "completed" &&
          !j.kind.startsWith("undo"),
      );
    }),
    c = i || o[0],
    u = c
      ? (((r = e.aftercare) == null ? void 0 : r.items) || []).find(
          (f) => f.operation === c.id && !f.kind.startsWith("undo"),
        )
      : null;
  return {
    plant: n,
    operation: c,
    job: u,
    step: s.length ? (c ? 2 : 1) : 0,
    complete: !!i,
  };
}
function zo(e) {
  var u, d;
  const t = yo(e),
    s = t.step;
  if (!(((u = e.tutorial) == null ? void 0 : u.status) === "active"))
    return m`<section class="panel tutorial"><h1>첫 정리 튜토리얼</h1><p>폴더를 연결하고 관리 폴더 안을 정리해 보세요.</p><button class="button primary" data-action="tutorial-start">튜토리얼 시작</button></section>`;
  const o = ["폴더 연결", "폴더 안 정리", "보관 확인"],
    i = [
      "파일을 모아둘 폴더를 골라요",
      "관리 폴더 안에서 추천을 확인해요",
      t.complete
        ? "첫 정리를 완료했어요!"
        : "파일 전달 완료, 버전을 보관하고 있어요",
    ],
    c = [
      "하위 폴더도 함께 관리해요. 폴더를 선택한 뒤 범위를 확인하고 관리 시작을 눌러 주세요.",
      "내 파일의 설정 옆에서 폴더 정리를 누르세요. 기준과 예상 결과를 확인하고 이동할 항목을 직접 선택해요. 정리할 파일이 없으면 건너뛰어도 괜찮아요.",
      "전달과 보관은 별개예요. 이 파일의 보관이 끝나면 튜토리얼을 마칠 수 있어요.",
    ];
  return m`<section class="tutorial-shell"><div class="section-heading"><div><span class="eyebrow">FIRST LITTLE QUEST</span><h1>첫 정리 튜토리얼</h1><p>한 번만 따라 하면 다음부터는 내 방식대로.</p></div><button class="button outline" data-action="tutorial-skip">튜토리얼 건너뛰기</button></div><ol class="tutorial-steps" aria-label="튜토리얼 진행">${o.map((r, f) => `<li class="${f === s ? "current" : f < s ? "done" : ""}" ${f === s ? 'aria-current="step"' : ""}><span>${f < s ? "✓" : f + 1}</span>${a(r)}</li>`).join("")}</ol><section class="panel tutorial-stage" aria-live="polite"><span class="quest-mark" aria-hidden="true">${t.complete ? "✦" : String(s + 1).padStart(2, "0")}</span><h2>${a(i[s])}</h2><p>${a(c[s])}</p>${s === 0 ? m`<button class="button primary" data-action="ws-connect" data-id="0" data-quick="1">폴더 선택</button>` : s === 1 ? m`<button class="button primary" data-action="nav" data-page="files" ${e.busy || e.blocked ? "disabled" : ""}>내 파일에서 폴더 정리</button>` : t.complete ? m`<button class="button primary" data-action="tutorial-finish">완료하고 홈으로</button>` : m`<button class="button outline" data-action="tasks-open">보관 상태 확인</button>`}${((d = t.job) == null ? void 0 : d.status) === "failed" ? m`<p role="alert">보관에 실패했어요. 작업 상태에서 보관만 재시도할 수 있어요.</p>` : ""}<small>언제든 건너뛸 수 있어요. 완료하거나 건너뛰면 자동으로 다시 나타나지 않아요.</small></section></section>`;
}
const jo = {
    default: `Copyright 2021 The Gowun Dodum Project Authors (https://github.com/yangheeryu/Gowun-Dodum)


This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded, 
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
`,
    flowers: `Copyright 2021 The Gowun Batang Project Authors (https://github.com/yangheeryu/Gowun-Batang)


This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded, 
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
`,
    files: `Copyright (c) 2010, NHN Corporation (http://www.nhncorp.com),
with Reserved Font Name Nanum, Naver Nanum, NanumGothic, Naver 
NanumGothic, NanumMyeongjo, Naver NanumMyeongjo, NanumBrush, Naver
NanumBrush, NanumPen, Naver NanumPen.

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded, 
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
`,
    runner: `Copyright © 2017 IBM Corp. with Reserved Font Name "Plex"

This Font Software is licensed under the SIL Open Font License, Version 1.1.

This license is copied below, and is also available with a FAQ at: http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded, 
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
`,
    night: `Copyright (c) 2010, NHN Corporation (http://www.nhncorp.com),
with Reserved Font Name Nanum, Naver Nanum, NanumGothic, Naver NanumGothic, NanumMyeongjo, 
Naver NanumMyeongjo, NanumBrush, Naver NanumBrush, NanumPen, Naver NanumPen
 
This Font Software is licensed under the SIL Open Font License, Version 1.1.
 
This license is copied below, and is also available with a FAQ at: http://scripts.sil.org/OFL
 
SIL OPEN FONT LICENSE
Version 1.1 - 26 February 2007
 
PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide development of collaborative font projects,
to support the font creation efforts of academic and linguistic communities, and to provide a free and open framework 
in which fonts may be shared and improved in partnership with others.
 
The OFL allows the licensed fonts to be used, studied, modified and redistributed freely as long as they are not sold 
by themselves. 
The fonts, including any derivative works, can be bundled, embedded, redistributed and/or sold with any software provided 
that any reserved names are not used by derivative works. 
The fonts and derivatives, however, cannot be released under any other type of license.
The requirement for fonts to remain under this license does not apply to any document created using the fonts or their derivatives.

 

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright Holder(s) under this license and clearly marked as such. 
 This may include source files, build scripts and documentation.
 
"Reserved Font Name" refers to any names specified as such after the copyright statement(s).
 
"Original Version" refers to the collection of Font Software components as distributed by the Copyright Holder(s).
 
"Modified Version" refers to any derivative made by adding to, deleting, or substituting ? in part or in whole ? 
 any of the components of the Original Version, by changing formats or by porting the Font Software to a new environment.
 
"Author" refers to any designer, engineer, programmer, technical writer or other person who contributed to the Font Software.
 

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining a copy of the Font Software, to use, study, copy, merge, 
embed, modify, redistribute, and sell modified and unmodified copies of the Font Software, subject to the following conditions:
 
1) Neither the Font Software nor any of its individual components,in Original or Modified Versions, 
    may be sold by itself.
 
2) Original or Modified Versions of the Font Software may be bundled, redistributed and/or sold with any software, 
    provided that each copy contains the above copyright notice and this license. These can be included either as stand-alone text files, 
    human-readable headers or in the appropriate machine-readable metadata fields within text or binary files as long as those fields 
    can be easily viewed by the user.
 
3) No Modified Version of the Font Software may use the Reserved Font Name(s) unless explicit written 
    permission is granted by the corresponding Copyright Holder. This restriction only applies to the primary font name as presented 
    to the users.
 
4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font Software shall not be used to promote, endorse or advertise 
    any Modified Version, except to acknowledge the contribution(s) of the Copyright Holder(s) and the Author(s) or with their explicit 
    written permission.
 
5) The Font Software, modified or unmodified, in part or in whole, must be distributed entirely under this license, and must not be distributed 
    under any other license. The requirement for fonts to remain under this license does not apply to any document created using 
    the Font Software.


 
TERMINATION
This license becomes null and void if any of the above conditions are not met.

 

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. 
IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE 
OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.
`,
  },
  Aa = [
    {
      id: "default",
      family: "Gowun Dodum",
      file: "GowunDodum-Regular.ttf",
      license: "gowundodum-OFL.txt",
      source:
        "https://raw.githubusercontent.com/google/fonts/23e54b51ddffbc7713c583748e3bd86f62b1fa4a/ofl/gowundodum/GowunDodum-Regular.ttf",
      sha256:
        "a6e457933227483a11758fd0947bc74422a106d46f0bf057fdaa5af94a30067d",
    },
    {
      id: "flowers",
      family: "Gowun Batang",
      file: "GowunBatang-Regular.ttf",
      license: "gowunbatang-OFL.txt",
      source:
        "https://raw.githubusercontent.com/google/fonts/23e54b51ddffbc7713c583748e3bd86f62b1fa4a/ofl/gowunbatang/GowunBatang-Regular.ttf",
      sha256:
        "466c593e7147412e748af4856d5ad14709b5a860bdf62b9c2546f2c5874e9849",
    },
    {
      id: "files",
      family: "Nanum Gothic",
      file: "NanumGothic-Regular.ttf",
      license: "nanumgothic-OFL.txt",
      source:
        "https://raw.githubusercontent.com/google/fonts/23e54b51ddffbc7713c583748e3bd86f62b1fa4a/ofl/nanumgothic/NanumGothic-Regular.ttf",
      sha256:
        "76f45ef4a6bcff344c837c95a7dcc26e017e38b5846d5ae0cdcb5b86be2e2d31",
    },
    {
      id: "runner",
      family: "IBM Plex Sans KR",
      file: "IBMPlexSansKR-Regular.ttf",
      license: "ibmplexsanskr-OFL.txt",
      source:
        "https://raw.githubusercontent.com/google/fonts/23e54b51ddffbc7713c583748e3bd86f62b1fa4a/ofl/ibmplexsanskr/IBMPlexSansKR-Regular.ttf",
      sha256:
        "53750379270312368cf7641901f43a98dd892e3d9d5798cf25cdc245c85c71c0",
    },
    {
      id: "night",
      family: "Nanum Myeongjo",
      file: "NanumMyeongjo-Regular.ttf",
      license: "nanummyeongjo-OFL.txt",
      source:
        "https://raw.githubusercontent.com/google/fonts/23e54b51ddffbc7713c583748e3bd86f62b1fa4a/ofl/nanummyeongjo/NanumMyeongjo-Regular.ttf",
      sha256:
        "7ed9e8653a8ed04285d51dc343ffea6eb3d9c73afc27383ea8929ee4ffd03205",
    },
  ];
[...Aa.map((e) => e.id)];
function js(e) {
  return (
    e.native &&
    (e.guide ? e.guide.status !== "completed" : !e.settings.onboarded)
  );
}
function Ao(e) {
  return js(e) && (!e.guide || e.guide.status === "not_started");
}
function $o() {
  return m`<h2>작은 화분부터, 가볍게 시작해요</h2><p class="guide-lead">컴퓨터를 꾸미고, 파일의 이전 내용도 쉽게 찾아보세요.</p><div class="welcome-options"><button class="welcome-choice" data-action="ws-start-look"><span>01</span><strong>기본 모습으로 시작</strong><small>폴더 연결 없이 작은 창부터 열어요.</small></button><button class="welcome-choice" data-action="tutorial-start"><span>02</span><strong>관리 폴더 정리 시작</strong><small>폴더 하나를 고르고 보관 범위를 확인해요.</small></button><button class="welcome-choice" data-action="ws-demo"><span>03</span><strong>예시로 먼저 보기</strong><small>실제 파일을 건드리지 않고 연습해요.</small></button></div><p>파일 관리와 기본 테마는 로그인 없이 사용할 수 있어요.</p>`;
}
function To() {
  const e = [
    ["화분", "폴더를 빠르게 여는 바로가기예요. 숨겨도 파일 관리는 계속돼요."],
    [
      "관리 폴더",
      "선택한 폴더와 그 안의 하위 폴더예요. 기존 파일과 새로 만든 파일의 변경을 확인해요.",
    ],
    [
      "버전",
      "파일 내용이 달라졌을 때 보관한 이전 모습이에요. 앱이 실행 중일 때 확인하고 저장해요.",
    ],
    [
      "되돌리기",
      "복사·이동한 위치를 되돌려요. 바뀐 파일 내용의 복원과는 달라요.",
    ],
    [
      "이전 내용 꺼내기",
      "보관된 내용을 다른 이름의 파일로 꺼내요. 현재 파일을 덮어쓰지 않아요.",
    ],
  ];
  return `<details class="glossary" data-disclosure="glossary"><summary>${a("이 말은 무슨 뜻인가요?")}</summary><dl>${e.map(([t, s]) => `<dt>${a(t)}</dt><dd>${a(s)}</dd>`).join("")}</dl></details>`;
}
const Ra = (e) =>
  String(e ?? "").replace(
    /[&<>"']/g,
    (t) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        t
      ],
  );
function ko(e, t = !1) {
  var n;
  if (!((n = e.inventory) != null && n.folders)) return "";
  const s = e.inventory;
  return m`<section class="folder-import-options"><strong>폴더 안 파일 ${e.rows.length}개</strong><label for="plan-layout">정리 방식</label><select id="plan-layout" ${t ? "disabled" : ""}><option value="structure" ${e.layout === "structure" ? "selected" : ""}>폴더 구조 유지</option><option value="recommend" ${e.layout === "recommend" ? "selected" : ""}>파일명으로 추천 분류</option></select>${e.layout === "structure" ? m`<label for="plan-base">넣을 위치</label><select id="plan-base" ${t ? "disabled" : ""}>${(e.targetFolders || [e.folder]).map((o) => `<option value="${Ra(o)}" ${o === e.base ? "selected" : ""}>${Ra(o.replace(e.folder, "") || a("(전체 폴더)"))}</option>`).join("")}</select><p>선택한 폴더 이름부터 하위 구조를 유지해요. 새 폴더는 실행할 때 만들어요.</p>` : ""}<p>빈 폴더 ${s.empty}개 · 제외 경로 ${s.excluded}개</p>${s.issues.length ? `<details><summary>${a("제외 이유 보기 · 최대 30개")}</summary>${s.issues.map((o) => `<p>${Ra(o.path)} · ${Ra(a(o.reason))}</p>`).join("")}</details>` : ""}<small>목록을 확인한 시점의 파일만 정리해요. 빈 폴더는 옮기지 않고, 이동 후 원본 폴더도 자동 삭제하지 않아요.</small></section>`;
}
function As(e) {
  return `<svg class="root-pot" viewBox="0 0 24 28" aria-hidden="true" shape-rendering="crispEdges"><path fill="#547447" d="M11 5h2v10h-2zM5 3h5v3h3v3H8V7H5zM14 1h5v4h-3v3h-3V4h1z"/><path fill="${["#a77347", "#507e8e", "#aa8b46"][e ?? -1] || "#84917c"}" d="M4 14h16v4H4zM6 18h12v8H6z"/><path fill="#e7cfac" d="M7 15h10v2H7zM8 19h3v5H8z"/></svg>`;
}
const So = (e) =>
    String(e ?? "").replace(
      /[&<>"']/g,
      (t) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[t],
    ),
  Q = So,
  $s = () => ({ main: !1, widget: !0, font: !1, accent: null, reduced: !0 }),
  k = {
    tab: "browse",
    selected: null,
    remote: !0,
    preview: null,
    previewError: "",
    query: "",
    surface: "widget",
    draft: $s(),
    authOpen: !1,
  },
  ue = (e, t, s = "", n = !1) =>
    `<button class="button ${n ? "primary" : "outline"}" data-action="tm-${e}" ${s}>${t}</button>`,
  Xa = { main: "메인 화면", widget: "작은 화분", font: "글꼴" };
function Za(e, t) {
  return Object.keys(Xa)
    .filter((s) => {
      var n;
      return ((n = e.selection) == null ? void 0 : n[s]) === t;
    })
    .map((s) => a(Xa[s]));
}
function Ts(e, t, s) {
  return `<div class="tm-grid">${e
    .map((n) => {
      var i;
      const o = t && !n.builtin;
      return m`<button class="tm-card ${((i = k.selected) == null ? void 0 : i.id) === n.id ? "selected" : ""}" data-action="tm-select" data-theme-id="${Q(n.id)}" data-remote="${o}" aria-label="${Q(n.title)} 상세 보기"><span class="tm-art"><canvas data-theme-preview="${Q(n.id)}" data-remote="${o}" aria-label="${Q(n.title)} 미리보기"></canvas><span class="tm-preview-status">미리보기 불러오는 중</span></span><span class="tm-card-copy"><strong>${Q(n.title)}</strong><span>${o ? a("무료") : Za(s, n.id).length ? a("사용 중") : ["runner", "fireflies"].includes(n.builtin) ? a("애니메이션") : n.builtin ? a("기본 제공") : a("설치됨")}</span></span><small>${Q(n.creator || a("내 기기에 보관됨"))}${o ? "" : " · v" + Q(n.version)}</small><small class="tm-card-scope">${o ? (s.installed.some((c) => c.id === n.digest) ? a("이미 설치한 테마 · 다시 받기 가능") : a("화면과 지원 범위 확인하기")) : Q(Za(s, n.id).join(" · ") || a("선택해서 미리 보고 적용해요"))}</small></button>`;
    })
    .join("")}</div>`;
}
function Fo() {
  var o, i;
  const e = k.preview,
    t = e == null ? void 0 : e.manifest,
    s = k.draft,
    n = t == null ? void 0 : t.ui;
  return m`<div class="tm-preview-panel"><nav class="tm-preview-tabs" aria-label="테마 미리보기 범위">${["widget", "main", "font"].map((c) => ue("surface", a(Xa[c]), `data-surface="${c}" aria-pressed="${k.surface === c}" ${c === "main" && t && !n ? "disabled" : ""} ${c === "font" && t && !e.hasFont ? "disabled" : ""}`)).join("")}</nav>${k.previewError ? `<div class="tm-empty" role="alert">${Q(k.previewError)}${ue("retry-preview", a("다시 불러오기"))}</div>` : e ? (k.surface === "font" ? m`<div class="tm-font-example" style="font-family:${e.builtin ? Q(t.assets.font.family) : "inherit"}"><span>글꼴 포함</span><h3>가나다, 나만의 작은 공간</h3><p>ABC abc · 0123456789</p><small>${Q(((o = t.assets.font) == null ? void 0 : o.family) || ((i = t.assets.font) == null ? void 0 : i.path) || "")}<br>${e.builtin ? a("앱에 포함된 글꼴로 미리 보여드려요.") : a("기본 글꼴로 표시한 예시예요.")} ${a("설정에서 고른 글꼴이 테마보다 우선해요.")}</small></div>` : k.surface === "main" && n ? m`<div class="tm-main-example" style="--preview-bg:${Q(n.background)};--preview-panel:${Q(n.panel)};--preview-accent:${Q(s.accent || n.accent)};--preview-text:${Q(n.text)};--preview-sidebar:${Q(n.sidebar)}"><aside>작은 창틀<br><b>나의 창틀</b><span>관리 파일</span></aside><section><small>MY LITTLE SPACE</small><h3>나의 작은 공간</h3><div>파일 하나, 초록 한 칸.</div><canvas data-detail-preview aria-label="메인 화면 정원 예시"></canvas></section></div>` : a('<div class="tm-desktop-example"><div class="tm-work-example"><span>업무 화면 예시</span><div><i></i><i></i><i></i><i></i></div></div><canvas data-detail-preview aria-label="작은 화분 미리보기"></canvas><small>작업을 가리지 않는 작은 자리</small></div>')) : a('<div class="tm-empty" role="status">이 테마의 모습을 확인하고 있어요…</div>')}<p class="tm-caption">미리보기는 현재 사용 중인 모습을 바꾸지 않아요.</p></div>`;
}
function Eo(e, t, s) {
  const n = k.selected,
    o = k.preview,
    i = o == null ? void 0 : o.manifest,
    c = k.draft;
  return m`<div class="tm-detail"><div>${Fo()}${!k.remote && o ? m`<section class="tm-tuning"><div class="tm-tuning-row"><strong>강조 색상</strong><div class="tm-swatches">${["#355b45", "#69438b", "#805339", "#245a78"].map((u) => m`<button aria-label="강조 색상 ${u}" aria-pressed="${c.accent === u}" data-action="tm-accent" data-color="${u}" style="--swatch:${u}"></button>`).join("")}${ue("accent", a("테마 기본색"), 'data-color=""')}</div></div><label class="tm-check"><input type="checkbox" id="tm-reduced" ${c.reduced ? "checked" : ""}> 움직임 줄이기 <small>조용한 모습으로 사용해요</small></label></section>` : ""}</div><aside class="tm-product"><span class="eyebrow">${k.remote ? a("발견한 작은 풍경") : "MY COLLECTION"}</span><h2>${Q(n.title)}</h2><p>by ${Q(n.creator || (i == null ? void 0 : i.creatorLabel) || a("로컬 테마"))}</p><div class="tm-scope-tags">${i ? m`${i.ui ? a("<span>메인 화면</span>") : ""}<span>작은 화분</span>${o.hasFont ? a("<span>글꼴 포함</span>") : ""}` : a("지원 범위 확인 중")}</div><p class="tm-compat">${i ? m`v${Q(i.version)} · 앱 ${Q(i.compatibility.minAppVersion)} 이상<br>${Q(i.compatibility.supportedOS.map((u) => ({ win32: "Windows", darwin: "macOS", linux: "Linux" })[u] || u).join(" · "))}` : ""}</p>${k.remote ? m`<div class="tm-price">무료</div><p>지금은 모든 테마를 무료로 즐겨요.</p>${ue("download", e.installed.some((u) => u.id === n.digest) ? a("다시 받기") : a("무료로 받기"), `data-theme-id="${Q(n.id)}" ${t || s.downloads === !1 ? "disabled" : ""}`, !0)}<small>${s.downloads === !1 ? a("받기가 잠시 닫혀 있어요.") : e.user ? a("받은 뒤 내 테마에서 적용할 수 있어요.") : a("받을 때만 로그인해요. 고른 테마는 유지돼요.")}</small>` : m`<h3>적용할 곳</h3><div class="tm-scopes">${["main", "widget", "font"].map((u) => `<label><input id="tm-scope-${u}" type="checkbox" ${c[u] ? "checked" : ""} ${!o || (u === "main" && !(i != null && i.ui)) || (u === "font" && !(o != null && o.hasFont)) ? "disabled" : ""}> ${a(Xa[u])}${u === "font" ? a("도 바꾸기") : ""}</label>`).join("")}</div><p class="tm-caption">선택하지 않은 곳은 유지해요. 설정에서 고른 글꼴이 테마보다 우선해요.</p>${ue("apply", a("선택한 곳에 적용하기"), `data-theme-id="${Q(n.id)}" ${t || !o || (!c.main && !c.widget && !c.font) ? "disabled" : ""}`, !0)}<p class="tm-used" role="status">${Za(e, n.id).length ? Q(Za(e, n.id).join(" · ")) + a("에 사용 중") : a("선택됨 · 아직 적용하지 않았어요")}</p>${ue("undo", a("직전 모습으로 되돌리기"), !e.canUndo || t ? "disabled" : "")}<details class="tm-removal"><summary>이 테마 관리</summary><p>삭제하면 사용 중인 해당 범위는 기본 모습으로 바뀌어요. 이전 모습으로 되돌리기 기록도 지워져요.</p>${ue("remove", a("이 기기에서 삭제"), `data-theme-id="${Q(n.id)}" ${t ? "disabled" : ""}`)}</details>`}<details><summary>지원 범위와 권리 안내</summary><p>제작자 표기: ${Q((i == null ? void 0 : i.creatorLabel) || n.creator || a("확인 중"))}<br>라이선스: ${Q((i == null ? void 0 : i.licenseId) || a("확인 중"))}<br>파일 관리와 버전 보관에는 영향을 주지 않아요.</p></details></aside></div>`;
}
function xo(e, t, s, n, o, i, c) {
  var b;
  const u = k.selected,
    d = k.tab === "library" ? [...(e.builtins || []), ...e.installed] : t,
    r = k.query.normalize("NFC").toLocaleLowerCase(),
    f = d.filter((j) =>
      (j.title + " " + (j.creator || ""))
        .normalize("NFC")
        .toLocaleLowerCase()
        .includes(r),
    );
  return m`<div class="tm-experience"><header class="tm-heading"><div><span class="eyebrow">LITTLE SCENES, YOUR OWN SPACE</span><h1 data-ui-label="themesTitle">${k.tab === "library" ? a("내 테마") : a("테마")}</h1><p>오늘의 책상에 어울리는 작은 풍경을 찾아보세요.</p></div><div>${ue("share", a("테마 만들고 나누기"))}${ue("account", e.user ? Q(e.user) + a(" 님") : a("로그인"))}</div></header><nav class="tm-tabs" aria-label="테마 페이지">${ue("browse", a("둘러보기"), `aria-pressed="${k.tab === "browse"}"`)}${ue("library", a("내 테마 ") + (e.installed.length + (((b = e.builtins) == null ? void 0 : b.length) || 0)), `aria-pressed="${k.tab === "library"}"`)}</nav><p class="theme-feedback" role="status">${s ? a("처리 중이에요…") : Q(c)}</p>${k.tab === "share" ? "" : u ? `${ue("back", k.tab === "library" ? a("← 내 테마 목록") : a("← 테마 둘러보기"))}<div class="tm-selected-heading"><h2>${Q(u.title)}</h2><span>${k.remote ? a("내 화면에서는 어떻게 보일까요?") : a("취향을 살짝 더한 뒤 적용해요.")}</span></div>${Eo(e, s, o)}` : m`<div class="tm-toolbar"><label class="tm-search">테마 찾기<input id="tm-search" type="search" placeholder="${k.tab === "browse" ? a("현재 페이지에서 이름·제작자 검색") : a("설치한 테마 이름 검색")}" value="${Q(k.query)}"></label><span>${k.tab === "library" ? a("설치한 테마는 오프라인에서도 사용해요.") : a("모든 테마 무료 · 최신 등록순")}</span>${k.tab === "browse" ? ue("refresh", a("목록 새로고침"), s ? "disabled" : "") : ue("import", a("받은 파일 설치"), s ? "disabled" : "")}</div>${(k.tab === "browse" ? Io(e, r) : "") + (f.length ? Ts(f, k.tab === "browse", e) : `<div class="tm-empty"><strong>${r ? a("찾는 테마가 없어요") : k.tab === "library" ? a("아직 받은 테마가 없어요") : a(n ? "등록된 테마가 없어요" : "작은 풍경을 불러오고 있어요")}</strong><p>${k.tab === "library" ? a("둘러보기에서 테마를 받거나, 가진 테마 파일을 설치해 보세요.") : a(r ? "검색어를 바꿔 보세요." : "연결되지 않으면 목록 새로고침을 눌러주세요.")}</p></div>`)}${k.tab === "browse" && n ? m`<div class="tm-pagination">${ue("prev", a("이전"), i === 1 || s ? "disabled" : "")}<span>${i} 페이지</span>${ue("next", a("다음"), t.length < 20 || s ? "disabled" : "")}</div>` : ""}${k.tab === "library" ? `<div class="tm-library-footer">${ue("reset", a("기본 창틀로 돌아가기"), s ? "disabled" : "")}${ue("undo", a("직전 모습으로 되돌리기"), !e.canUndo || s ? "disabled" : "")}</div>` : ""}`}<details class="tm-connection"><summary>연결 상태</summary><p>${Q(e.connection || a("연결 전"))} · ${Q(e.endpoint || "https://littlepot.log2u.me:18472")}${e.fallback ? a(" · 대체 경로 사용 중") : ""}</p></details></div>`;
}
function Io(e, t) {
  const s = (e.builtins || []).filter((n) =>
    n.title.normalize("NFC").toLocaleLowerCase().includes(t),
  );
  return s.length
    ? '<section class="tm-builtins"><h2>' +
        a("앱에 담긴 기본 테마") +
        "</h2><p>" +
        a("로그인 없이 바로 적용해요 · 항상 무료") +
        "</p>" +
        Ts(s, !1, e) +
        '</section><h2 class="tm-community-title">' +
        a("함께 나누는 테마") +
        "</h2>"
    : "";
}
const ha = (e) => (e >= 25 ? 3 : e >= 10 ? 2 : e >= 3 ? 1 : 0),
  ks = (e) => a(["씨앗", "새싹", "푸른 잎", "활짝 핀 꽃"][ha(e)]),
  Zn = (e) => [3, 10, 25].find((t) => t > e),
  Oo = [
    ["#783e2d", "#b76845", "#d48b5b", "#edb581"],
    ["#365463", "#527d8a", "#7eabb1", "#c0d7cd"],
    ["#776040", "#a8894b", "#d2b366", "#ebd596"],
  ],
  Ss = (e) => 54 + 110 * Math.max(1, Math.min(3, e));
function Ha(e, t) {
  const s = t().count || 3,
    n = Ss(s);
  ((e.width = n), (e.height = t().tiny ? 150 : 180));
  const o = e.getContext("2d");
  o.imageSmoothingEnabled = !1;
  let i = !0,
    c = 0,
    u = 0;
  const d = (h, l, g, z, A) => {
    ((o.fillStyle = A), o.fillRect(Math.round(h), Math.round(l), g, z));
  };
  function r(h, l, g, z, A) {
    for (let $ = -z; $ <= z; $ += 2) {
      const C = Math.floor(g * Math.sqrt(Math.max(0, 1 - ($ * $) / (z * z))));
      C && d(h - C, l + $, C * 2, 2, A);
    }
  }
  function f(h, l, g, z, A = !1) {
    (r(h, l, g, z, "#355643"),
      r(h + 1, l - 2, g - 2, z - 2, A ? "#91ad58" : "#698c4c"),
      d(h - 2, l - 3, Math.max(3, g), 2, A ? "#bbcb78" : "#a0b669"));
  }
  function b(h, l, g = !1) {
    (r(h, l - 4, 4, 4, "#8c8657"),
      r(h - 4, l, 4, 4, g ? "#e5b4ae" : "#f5ecce"),
      r(h + 4, l, 4, 4, g ? "#eccac0" : "#fffbdf"),
      r(h, l + 4, 4, 4, "#f5e4c9"),
      r(h, l - 4, 4, 4, "#fffae1"),
      d(h - 2, l - 2, 5, 5, "#d7a457"),
      d(h - 1, l - 2, 2, 2, "#f5d37a"));
  }
  function j(h, l, g, z) {
    const A = t().reduced ? 0 : Math.round(Math.sin(z + l) * 1),
      [$, C, S, w] = Oo[l];
    if (
      (r(h + 2, 146, 29, 4, "#5c4c3e44"),
      d(h - 18, 119, 36, 5, $),
      d(h - 21, 115, 42, 6, $),
      d(h - 19, 116, 38, 3, w),
      d(h - 17, 124, 34, 17, C),
      d(h - 14, 141, 28, 5, $),
      d(h - 15, 124, 7, 17, S),
      d(h + 12, 124, 4, 15, $),
      d(h - 8, 142, 17, 2, S),
      d(h - 17, 112, 34, 3, "#5b4637"),
      d(h - 13, 112, 8, 1, "#ac8a62"),
      d(h - 5, 127, 11, 11, "#e6d7b5"),
      d(h - 3, 129, 7, 1, $),
      d(h - 3, 132, l === 0 ? 5 : 7, 1, C),
      l === 1 && d(h - 1, 133, 5, 3, "#769162"),
      g === 0)
    ) {
      (d(h - 3, 108, 6, 4, "#9c714c"),
        d(h, 104, 2, 7, "#638a45"),
        f(h + 4, 104, 5, 3, !0));
      return;
    }
    if (g === 1) {
      (d(h, 90, 3, 23, "#4f7042"),
        f(h - 8 + A, 95, 10, 5),
        f(h + 7 + A, 87, 9, 5, !0),
        f(h - 4, 81, 5, 5, !0));
      return;
    }
    if (l === 0) {
      for (const [F, R] of [
        [0, -45],
        [-13, -34],
        [16, -37],
        [-24, -15],
        [25, -17],
        [-7, -23],
        [9, -11],
      ])
        (d(h + Math.round(F / 3), 87 + Math.round(R / 4), 3, 25, "#49663c"),
          f(h + F + A, 110 + R, 13, 7, F >= 0));
      (f(h + A, 55, 7, 11, !0), g === 3 && (b(h - 10, 69), b(h + 19, 85, !0)));
    } else if (l === 1)
      for (const [F, R] of [
        [-21, -23],
        [-9, -45],
        [12, -38],
        [23, -14],
        [2, -20],
      ])
        (d(h + F, 112 + R, 2, -R, "#5c7b48"),
          f(h + F - 3, 106 + R / 2, 8, 4, F >= 0),
          g === 3
            ? b(h + F + A, 110 + R, F < -10)
            : f(h + F, 110 + R, 6, 4, !0));
    else
      (d(h - 3, 88, 7, 25, "#705540"),
        d(h + 2, 74, 6, 22, "#866044"),
        d(h + 6, 70, 18, 4, "#705540"),
        d(h - 20, 88, 24, 4, "#705540"),
        f(h - 17 + A, 82, 24, 9),
        f(h + 18, 64, 23, 9, !0),
        f(h + 4, 52, 19, 8, !0),
        f(h + 26, 86, 13, 7),
        g === 3 &&
          (d(h - 20, 78, 3, 3, "#e3bd70"), d(h + 17, 60, 3, 3, "#e3bd70")));
  }
  function v(h, l, g) {
    const z = g.custom.manifest.palette.surface;
    if (h === "fireflies") {
      g.backdrop &&
        (d(0, 0, n, 180, z),
        r(n - 35, 33, 17, 17, "#edf5dd"),
        r(n - 30, 29, 14, 14, z));
      const $ = g.reduced ? 0 : l;
      for (let C = 0; C < s; C++) {
        const S = 82 + 110 * C + Math.round(Math.sin($ * 0.65 + C) * 7),
          w = 91 + Math.round(Math.sin($ * 1.1 + C * 2) * 6),
          F = ha(g.xp[C] || 0);
        (r(S, w + 9, 24, 24, "#e9d48818"), r(S, w + 9, 17, 19, "#f2d88126"));
        const R = g.reduced ? 13 : 11 + Math.round(Math.sin($ * 5 + C) * 4);
        (r(S - R, w - 5, R, 8, "#accdc1"),
          r(S + R, w - 5, R, 8, "#c5dfcf"),
          r(S - R, w - 7, Math.max(4, R - 3), 4, "#edf5e1"),
          r(S + R, w - 7, Math.max(4, R - 3), 4, "#f5f7df"),
          r(S, w + 9, 10, 15, "#6d876c"),
          r(S, w + 11, 8, 11, "#edca78"),
          d(S - 5, w + 6, 4, 11, "#fff0b2"),
          d(S - 6, w + 21, 12, 2, "#b6a661"),
          r(S, w - 7, 8, 7, "#497260"),
          d(S - 4, w - 8, 2, 2, "#f1f3d7"),
          d(S + 3, w - 8, 2, 2, "#f1f3d7"),
          d(S - 5, w - 17, 2, 5, "#497260"),
          d(S + 4, w - 17, 2, 5, "#497260"),
          d(S - 7, w - 19, 3, 3, "#bed18f"),
          d(S + 5, w - 19, 3, 3, "#d9dda0"));
        for (let U = 0; U < F + 3; U++) {
          const Me = $ * 0.35 + U * 2.1 + C,
            ze = S + Math.round(Math.cos(Me) * (28 + U * 3)),
            ge = w + Math.round(Math.sin(Me) * 26) - 8;
          (d(ze, ge, 2, 2, U % 2 ? "#b3c8a7" : "#d3b96d"),
            U === 0 &&
              (d(ze - 2, ge + 1, 6, 1, "#e6d78b"),
              d(ze, ge - 2, 2, 6, "#e6d78b")));
        }
      }
      return;
    }
    if (g.backdrop) {
      if (
        (d(0, 0, n, 180, z),
        d(
          7,
          7,
          n - 14,
          140,
          h === "night" ? "#353e61" : h === "flowers" ? "#fff0ed" : "#edf3e6",
        ),
        h === "night")
      ) {
        (r(n - 42, 35, 15, 15, "#f9e6b4"), r(n - 36, 30, 13, 13, "#353e61"));
        for (let $ = 20; $ < n - 15; $ += 29) {
          const C = 20 + (($ * 13) % 60);
          (d($, C, 2, 6, "#e0d8bd"), d($ - 2, C + 2, 6, 2, "#e0d8bd"));
        }
        for (let $ = 10; $ < n - 10; $ += 15)
          d($, 117 - ($ % 32), 12, 40, "#293453");
      } else {
        r(n - 38, 32, 12, 12, h === "flowers" ? "#f0c891" : "#f4d992");
        for (let $ = 15; $ < n - 16; $ += 38)
          (d($, 95 + ($ % 17), 32, 48, h === "files" ? "#c3d5e9" : "#cddcb5"),
            d(
              $ + 7,
              90 + ($ % 17),
              18,
              9,
              h === "files" ? "#d4e2ef" : "#dce6c9",
            ));
        (d(21, 27, 25, 3, "#ffffff"), d(27, 23, 15, 4, "#ffffff"));
      }
      (d(5, 5, 4, 142, h === "night" ? "#727493" : "#c5bba4"),
        d(n - 9, 5, 4, 142, h === "night" ? "#727493" : "#c5bba4"),
        d(9, 5, n - 18, 3, h === "night" ? "#9696ae" : "#e4d7bc"));
    }
    const A =
      h === "night"
        ? "#787396"
        : h === "files"
          ? "#69849c"
          : h === "flowers"
            ? "#bb8790"
            : "#879c67";
    (d(9, 148, n - 18, 5, A),
      d(
        13,
        153,
        n - 26,
        9,
        h === "night"
          ? "#504e72"
          : h === "files"
            ? "#425c77"
            : h === "flowers"
              ? "#986574"
              : "#5c7650",
      ),
      d(21, 162, 7, 10, A),
      d(n - 28, 162, 7, 10, A));
    for (let $ = 0; $ < s; $++) {
      const C = 82 + 110 * $,
        S = ha(g.xp[$] || 0);
      if (h === "files") {
        (d(C - 29, 94, 23, 7, "#bc9053"), d(C - 31, 101, 62, 44, "#b68a4a"));
        for (let w = 0; w < 3; w++) {
          const F = C - 21 + w * 12,
            R = 82 - w * 7;
          (d(F, R, 27, 48, "#617a91"), d(F + 2, R + 2, 23, 44, "#f7f2dd"));
          for (let U = 0; U < 3; U++)
            d(F + 6, R + 14 + U * 6, 13, 2, "#bdc8c9");
        }
        (d(C - 29, 111, 58, 32, "#e0b56d"),
          d(C - 24, 116, 48, 23, "#ecc991"),
          d(C - 11, 122, 23, 10, "#fff5d9"),
          d(C - 7, 126, 15, 2, "#8597a4"),
          d(C + 20, 134, 12, 12, "#5b896a"),
          d(C + 23, 138, 3, 4, "#eaf6df"),
          d(C + 26, 136, 4, 3, "#eaf6df"));
      } else if (h === "runner") {
        const w = g.reduced ? 0 : Math.floor(l * 7) % 4,
          F = w % 2 ? 1 : 0,
          R = 99 - F;
        (d(C - 40, 139, 80, 7, "#c58b66"), d(C - 40, 143, 80, 2, "#f6e4bb"));
        const U = g.reduced ? 0 : Math.floor(l * 22) % 20;
        for (let ge = C - 38; ge < C + 38; ge += 20)
          d(ge - U + 12, 140, 8, 1, "#fff4dc");
        const Me = [
          [-13, 12],
          [0, 6],
          [13, -12],
          [6, 0],
        ][w];
        (r(C, R - 18, 8, 8, "#e8b888"),
          d(C - 8, R - 25, 15, 5, "#584d44"),
          d(C + 5, R - 19, 2, 2, "#36423a"),
          d(C - 7, R - 29, 16, 5, "#dd8662"),
          d(C + 7, R - 25, 7, 3, "#dd8662"),
          d(C - 7, R - 7, 15, 24, "#60847e"),
          d(C - 3, R - 4, 7, 12, "#f5ead1"),
          d(C - 1, R - 1, 3, 6, "#c89358"),
          d(C - 5, R + 17, 5, 12, "#3c5564"),
          d(C + 3, R + 17, 5, 12, "#3c5564"));
        for (let ge = 0; ge < 2; ge++) {
          const na = Me[ge];
          (d(
            C + (ge ? 3 : -5) + Math.min(0, na),
            R + 27,
            Math.abs(na) + 5,
            5,
            "#3c5564",
          ),
            d(C + (ge ? 3 : -5) + na, R + 31, 9, 4, "#f4e4c5"));
        }
        const ze = w < 2 ? 1 : -1;
        (d(C - 13, R - 2, 6, 15, "#e8b888"),
          d(C - 16, R + (ze > 0 ? 8 : -2), 9, 4, "#e8b888"),
          d(C + 8, R - 5, 6, 13, "#e8b888"),
          d(C + 12, R + (ze > 0 ? -7 : 4), 8, 4, "#e8b888"),
          d(C + 31, 119, 3, 20, "#65744e"),
          d(C + 34, 119, 12, 8, "#ddaa65"));
      } else {
        const w = h === "night" ? "#8585b2" : "#c97c91";
        (d(C - 21, 116, 42, 6, w),
          d(C - 17, 122, 34, 23, w),
          d(C - 12, 126, 6, 16, h === "night" ? "#b4b1d2" : "#ecc1c4"),
          d(C - 18, 143, 36, 3, h === "night" ? "#585875" : "#995a73"));
        for (let F = 0; F < S + 2; F++) {
          const R = (F % 2 ? -1 : 1) * (5 + F * 4),
            U = 91 - F * 8;
          (d(C + R, U, 2, 116 - U, "#5b8056"),
            f(C + R + (F % 2 ? -5 : 5), U + 15, 7, 3, !0),
            b(C + R, U, h === "flowers"));
        }
        h === "night"
          ? (d(C - 4, 129, 8, 8, "#f5dfa3"), d(C, 127, 2, 12, "#f5dfa3"))
          : (d(C - 5, 129, 10, 8, "#f8e7c9"), d(C - 2, 131, 4, 4, "#b87989"));
      }
    }
    h !== "runner" &&
      (d(25, 141, 13, 5, h === "night" ? "#a8a1bf" : "#809780"),
      d(28, 135, 7, 6, h === "night" ? "#eee0a5" : "#a8ba91"));
  }
  function T(h) {
    var g;
    const l = t();
    if (
      (o.setTransform(1, 0, 0, 1, 0, 0),
      o.clearRect(0, 0, n, 180),
      l.tiny && o.translate(0, -30),
      (g = l.custom) != null && g.builtin && l.custom.builtin !== "default")
    ) {
      v(l.custom.builtin, h, l);
      return;
    }
    if (l.custom && !l.custom.builtin) {
      const { manifest: z, image: A } = l.custom;
      l.backdrop &&
        (d(0, 0, n, 180, z.palette.surface || "#f7f5ef"),
        d(9, 8, n - 18, 138, z.palette.surfaceAlt || "#eaf0de"));
      const $ = (C, S, w, F = 16) =>
        o.drawImage(A, C[0], C[1], F, 26, S, w, F, 26);
      $(z.shelf.left, 9, 148);
      for (let C = 25; C < n - 25; C += 16)
        $(z.shelf.repeat, C, 148, Math.min(16, n - 25 - C));
      $(z.shelf.right, n - 25, 148);
      for (let C = 0; C < s; C++) {
        const S = z.plants[C],
          w = S.stages[ha(l.xp[C] || 0)],
          F =
            l.reduced || l.tiny || z.motion.preset === "none"
              ? 0
              : Math.round(
                  Math.sin(((h * 1e3) / z.motion.periodMs) * Math.PI * 2 + C) *
                    z.motion.amplitudePx,
                );
        o.drawImage(A, w[0], w[1], 64, 112, 82 + 110 * C - 32 + F, 34, 64, 112);
      }
      return;
    }
    if (l.backdrop) {
      const z = l.theme === "evening";
      (d(0, 0, n, 180, z ? "#717c8e" : "#dce7da"),
        d(9, 8, n - 18, 143, z ? "#8897a4" : "#e9eddf"),
        r(n - 79, 40, 18, 18, z ? "#ece3c5" : "#f4e6af"));
      for (let A = 10; A < n - 9; A += 6) {
        const $ = 90 + Math.round(12 * Math.sin(A / 44) + 4 * Math.cos(A / 18));
        d(A, $, 6, 59, z ? "#6a8280" : "#c5d6c1");
        const C = 115 + Math.round(10 * Math.cos(A / 30));
        d(A, C, 6, 32, z ? "#536e68" : "#afc8ac");
      }
      for (const [A, $, C] of [
        [50, 34, 24],
        [128, 23, 31],
        [221, 42, 21],
      ])
        A + C < n - 10 &&
          (d(A, $, C, 4, "#ffffff70"), d(A + 5, $ - 3, C - 12, 3, "#ffffff60"));
      (d(5, 5, 4, 141, "#c5b9a0"),
        d(n - 9, 5, 4, 141, "#c5b9a0"),
        d(9, 5, n - 18, 3, "#d1c8b2"));
      for (let A = 1; A < s; A++)
        d(Math.round((n * A) / s), 8, 3, 129, "#d2ceb990");
      (d(32, 0, 2, 38, "#696553"),
        d(26, 37, 14, 3, "#867452"),
        d(22, 40, 22, 5, "#bb9c60"),
        d(25, 45, 16, 2, "#eed699"));
      for (let A = 9; A < 63; A += 10)
        (d(n - 23, A, 2, 12, "#5e7450"),
          f(n - 26 + (((A / 10) | 0) % 2 ? 5 : -4), A + 6, 6, 3));
    }
    (d(11, 148, n - 22, 4, "#ccac78"),
      d(9, 152, n - 18, 6, "#a67d50"),
      d(13, 158, n - 26, 5, "#805a3e"),
      d(21, 164, 8, 10, "#876344"),
      d(n - 30, 164, 8, 10, "#876344"));
    for (let z = 20; z < n - 14; z += 42)
      d(z, 154, Math.min(27, n - 14 - z), 1, "#d0a675");
    for (let z = 0; z < s; z++) j(82 + 110 * z, z, ha(l.xp[z] || 0), h);
    if (
      (d(28, 137, 13, 10, "#709080"),
      d(27, 136, 14, 3, "#9caf93"),
      d(40, 137, 6, 3, "#597863"),
      d(44, 134, 3, 5, "#597863"),
      d(24, 132, 4, 8, "#709080"),
      d(n - 40, 137, 13, 8, "#9e8062"),
      d(n - 42, 135, 7, 8, "#ba9b77"),
      d(n - 41, 134, 5, 2, "#6c5b48"),
      d(n - 43, 138, 2, 2, "#3d463a"),
      d(n - 46, 139, 4, 2, "#d0a766"),
      d(n - 31, 140, 8, 3, "#725f4a"),
      d(n - 37, 145, 1, 3, "#645745"),
      !l.tiny && l.xp.some((z) => z >= 10))
    ) {
      const z = Math.round(
          n * 0.64 + (l.reduced ? 0 : Math.sin(h / 2) * Math.min(38, n * 0.1)),
        ),
        A = l.reduced ? 43 : Math.round(35 + Math.cos(h / 1.5) * 8),
        $ = l.reduced || Math.sin(h * 6) > 0 ? 5 : 2;
      (d(z - $, A - 3, $, 6, "#dfb765"),
        d(z + 2, A - 4, $, 7, "#edce83"),
        d(z, A - 2, 2, 7, "#746748"));
    }
  }
  function I(h) {
    i &&
      (!document.hidden && h - u > 65 && (T(h / 1e3), (u = h)),
      (c = requestAnimationFrame(I)));
  }
  return (
    T(0),
    t().reduced
      ? () => {
          i = !1;
        }
      : ((c = requestAnimationFrame(I)),
        () => {
          ((i = !1), cancelAnimationFrame(c));
        })
  );
}
const Mo = `<p>코드를 몰라도 괜찮아요. <strong>테마 만들기</strong>에서 세 단계만 따라오세요.</p>\r
<ol><li><strong>그림 넣기</strong><p>기본 도트 화분으로 시작하거나 사진을 골라요. 크기는 자동으로 맞춰요. 배경 없는 그림은 투명 PNG를 선택해 주세요.</p></li><li><strong>색상·글꼴 고르기</strong><p>좋아하는 분위기나 색을 선택해요. 글자색은 읽기 좋게 자동으로 맞춰요. 글꼴은 선택 사항이고, 함께 공유하려면 재배포 라이선스도 넣어 주세요.</p></li><li><strong>미리보고 공유하기</strong><p>메인 화면과 작은 창틀을 확인하고 이름을 붙여요. 내 파일로 저장하거나, 로그인해서 무료로 공유할 수 있어요.</p></li></ol>\r
<p>한 장만 넣으면 모든 화분과 성장단계에 같은 그림이 보여요. 성장에 따라 바꾸려면 ‘성장할 때 그림도 바꾸고 싶어요’를 열어 단계별 그림을 넣어 주세요.</p>\r
<p>사진의 배경 제거·도트 변환은 자동으로 하지 않아요. 제작 중인 내용은 화면을 열어둔 동안 유지돼요. 앱이나 탭을 닫기 전에는 ‘내 파일로 저장’을 눌러 주세요.</p>\r
<p>이미 만든 .silltheme 파일이 있다면 ‘이미 만든 테마 파일 올리기’를 이용하세요. 그림과 글꼴을 다른 사람에게 나눌 권한이 있어야 해요. 지금은 모든 테마가 무료예요.</p>\r
`,
  ra = {
    manifest: {
      formatVersion: 1,
      themeId: "local:sample-garden",
      version: "1.0.0",
      title: "개발 검사용 작은 숲",
      creatorLabel: "작은 창틀 개발",
      licenseId: "sample-personal-v1",
      compatibility: {
        rendererApi: 1,
        minAppVersion: "0.3.0",
        supportedOS: ["win32", "darwin", "linux"],
      },
      palette: { surface: "#F7F5EF", surfaceAlt: "#EAF0DE", accent: "#355B45" },
      layout: { preset: "windowsill-v1" },
      assets: {
        atlas: {
          path: "assets/atlas.png",
          sha256:
            "16f7b913b8dcc8598b05cdcd710c37b550bd8c5330233f79000a821bd0fd68c9",
          width: 512,
          height: 512,
        },
      },
      plants: [
        {
          asset: "atlas",
          size: [64, 112],
          anchor: [32, 112],
          stages: [
            [0, 0],
            [0, 112],
            [0, 224],
            [0, 336],
          ],
        },
        {
          asset: "atlas",
          size: [64, 112],
          anchor: [32, 112],
          stages: [
            [64, 0],
            [64, 112],
            [64, 224],
            [64, 336],
          ],
        },
        {
          asset: "atlas",
          size: [64, 112],
          anchor: [32, 112],
          stages: [
            [128, 0],
            [128, 112],
            [128, 224],
            [128, 336],
          ],
        },
      ],
      shelf: {
        asset: "atlas",
        left: [192, 0, 16, 26],
        repeat: [208, 0, 16, 26],
        right: [224, 0, 16, 26],
      },
      motion: { preset: "none", amplitudePx: 0, periodMs: 4e3 },
    },
    atlas:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAK1UlEQVR4nO3WsXEaYRhFURWmSIoVugigCTehChxQ5jpnCBgHPIt7zsyf793kfW9vEPbn96/jJ7/1/wOAH2k94A4AABhYD7gDAAAG1gPuAACAgfWAOwAAYGA94A4AABhYD7gDAAAG1gPuAACAgfWAOwAAYGA94A4AABhYD7gDAAAG1gPuAACAgfWAOwAAYGA94A4AABhYD7gDAAAG1gPuAACAgfWAOwAAYGA94A4AABhYD7gDAAAG1gPuAACAgfWAOwAAYGA94A4AABhYD7gDAAAG1gPuAACAgfWAOwAAYGA94A4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJO31/HM9+695b+dj9AVn0A9Lf7AbLqA6C/3Q+QVR8A/e1+gKz6AOhv9wNk1QdAf7sfIKs+APrb/QBZ9QHQ3+4HyKoPgP52P0BWfQD0t/sBsuoDoL/dD5BVHwD97X4AHvB5fj/uvfV3PYv+dj9AVn0A9Lf7AbLqA6C/3Q+QVR8A/e1+gKz6AOhv9wNk1QdAf7sfIKs+APrb/QBZ9QHQ3+4HyKoPgP52P0BWfQD0t/sBsuoDoL/dD5BVHwD97X6ArPoA6G/3A2TVB0B/ux8gqz4A+tv9AFn1AdDf7gd4CdfLx7F8+vUDMFAfAP3tfoCs+gDob/cDZNUHQH+7HyCrPgD62/0AWfUB0N/uB8iqD4D+dj9AVn0A9Lf7AbLqA6C/3Q+QVR8A/e1+gKz6AOhv9wNk1QdAf7sfIKs+APrb/QBZ9QHQ3+4HyKoPgP52P0BWfQD0t/sBsuoDoL/dD5BVHwD97X6ArPoA6G/3A2TVB0B/ux8gqz4A+tv9AFn1AdDf7gfIqg+A/nY/QFZ9APS3+wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOCfnL6/jme+de8t/e1+gKz6AOhv9wNk1QdAf7sfIKs+APrb/QBZ9QHQ3+4HyKoPgP52P0BWfQD0t/sBsuoDoL/dD5BVHwD97X6ArPoA6G/3A2TVB0B/ux8gqz4A+tv9AFn1AdDf7gfIqg+A/nY/QFZ9APS3+wGy6gOgv90PkFUfAP3tfoCs+gDob/cDZNUHQH+7HyCrPgD62/0APODz/H7ce+vvehb97X6ArPoA6G/3A2TVB0B/ux8gqz4A+tv9AFn1AdDf7gfIqg+A/nY/QFZ9APS3+wGy6gOgv90PkFUfAP3tfoCs+gDob/cDZNUHQH+7HyCrPgD62/0AWfUB0N/uB8iqD4D+dj9AVn0A9Lf7AbLqA6C/3Q+QVR8A/e1+gKz6AOhv9wNk1QdAf7sfIKs+APrb/QAv4Xr5OJZPv34ABuoDoL/dD5BVHwD97X6ArPoA6G/3A2TVB0B/ux8gqz4A+tv9AFn1AdDf7gfIqg+A/nY/QFZ9APS3+wGy6gOgv90PkFUfAP3tfoCs+gDob/cDZNUHQH+7HyCrPgD62/0AWfUB0N/uB8iqD4D+dj9AVn0A9Lf7AbLqA6C/3Q+QVR8A/e1+gKz6AOhv9wNk1QdAf7sfIKs+APrb/QBZ9QHQ3+4HyKoPgP52PwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGScvr+OZ7517y397X6ArPoA6G/3A2TVB0B/ux8gqz4A+tv9AFn1AdDf7gfIqg+A/nY/QFZ9APS3+wGy6gOgv90PkFUfAP3tfoCs+gDob/cDZNUHQH+7HyCrPgD62/0AWfUB0N/uB8iqD4D+dj9AVn0A9Lf7AbLqA6C/3Q+QVR8A/e1+gKz6AOhv9wNk1QdAf7sfIKs+APrb/QBZ9QHQ3+4HyKoPgP52P0BWfQD0t/sBsuoDoL/dD5BVHwD97X6ArPoA6G/3A2TVB0B/ux8gqz4A+tv9ADzg8/x+3Hvr73oW/e1+gKz6AOhv9wNk1QdAf7sfIKs+APrb/QBZ9QHQ3+4HyKoPgP52P0BWfQD0t/sBsuoDoL/dD5BVHwD97X6ArPoA6G/3A2TVB0B/ux8gqz4A+tv9AFn1AdDf7gfIqg+A/nY/QFZ9APS3+wGy6gOgv90PkFUfAP3tfoCs+gDob/cDZNUHQH+7HyCrPgD62/0AWfUB0N/uB8iqD4D+dj9AVn0A9Lf7AbLqA6C/3Q/wEq6Xj2P59OsHYKA+APrb/QBZ9QHQ3+4HyKoPgP52P0BWfQD0t/sBsuoDoL/dD5BVHwD97X6ArPoA6G/3A2TVB0B/ux8gqz4A+tv9AFn1AdDf7gfIqg+A/nY/QFZ9APS3+wGy6gOgv90PkFUfAP3tfoCs+gDob/cDZNUHQH+7HyCrPgD62/0AWfUB0N/uB8iqD4D+dj9AVn0A9Lf7AbLqA6C/3Q+QVR8A/e1+gKz6AOhv9wMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/sdP31/HMt+69pb/dD5BVHwD97X6ArPoA6G/3A2TVB0B/ux8gqz4A+tv9AFn1AdDf7gfIqg+A/nY/QFZ9APS3+wGy6gOgv90PkFUfAP3tfoCs+gDob/cDZNUHQH+7HyCrPgD62/0AWfUB0N/uB8iqD4D+dj9AVn0A9Lf7AbLqA6C/3Q+QVR8A/e1+gKz6AOhv9wNk1QdAf7sfIKs+APrb/QBZ9QHQ3+4HyKoPgP52P0BWfQD0t/sBsuoDoL/dD5BVHwD97X6ArPoA6G/3A2TVB0B/ux8gqz4A+tv9AFn1AdDf7gfIqg+A/nY/QFZ9APS3+wGy6gOgv90PkFUfAP3tfoCs+gDob/cDZNUHQH+7H4AHfJ7fj3tv/V3Por/dD5BVHwD97X6ArPoA6G/3A2TVB0B/ux8gqz4A+tv9AFn1AdDf7gfIqg+A/nY/QFZ9APS3+wGy6gOgv90PkFUfAP3tfoCs+gDob/cDZNUHQH+7HyCrPgD62/0AWfUB0N/uB8iqD4D+dj9AVn0A9Lf7AbLqA6C/3Q+QVR8A/e1+gKz6AOhv9wNk1QdAf7sfIKs+APrb/QBZ9QHQ3+4HyKoPgP52P0BWfQD0t/sBsuoDoL/dD5BVHwD97X6ArPoA6G/3A2TVB0B/ux/gJVwvH8fy6dcPwEB9APS3+wGy6gOgv90PkFUfAP3tfoCs+gDob/cDZNUHQH+7HyCrPgD62/0AWfUB0N/uB8iqD4D+dj9AVn0A9Lf7AbLqA6C/3Q+QVR8A/e1+gKz6AOhv9wNk1QdAf7sfIKs+APrb/QBZ9QHQ3+4HyKoPgP52P0BWfQD0t/sBsuoDoL/dD5BVHwD97X6ArPoA6G/3A2TVB0B/ux8gqz4A+tv9AFn1AdDf7gcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHh9fwG+w6EemaaySQAAAABJRU5ErkJggg==",
  },
  yn = new TextEncoder(),
  Ro = Array.from({ length: 256 }, (e, t) => {
    for (let s = 0; s < 8; s++) t = t & 1 ? 3988292384 ^ (t >>> 1) : t >>> 1;
    return t >>> 0;
  });
function Fs(e) {
  let t = 4294967295;
  for (const s of e) t = Ro[(t ^ s) & 255] ^ (t >>> 8);
  return (t ^ 4294967295) >>> 0;
}
function Ja(e) {
  const t = new Uint8Array(e.reduce((n, o) => n + o.length, 0));
  let s = 0;
  for (const n of e) (t.set(n, s), (s += n.length));
  return t;
}
async function Jn(e) {
  return Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", e)),
    (t) => t.toString(16).padStart(2, "0"),
  ).join("");
}
function Lo(e) {
  let t = 0;
  const s = [],
    n = [];
  for (const [u, d] of e) {
    const r = typeof d == "string" ? yn.encode(d) : d,
      f = yn.encode(u),
      b = new Uint8Array(30),
      j = new Uint8Array(46),
      v = new DataView(b.buffer),
      T = new DataView(j.buffer),
      I = Fs(r);
    (v.setUint32(0, 67324752, !0),
      v.setUint16(4, 20, !0),
      v.setUint32(14, I, !0),
      v.setUint32(18, r.length, !0),
      v.setUint32(22, r.length, !0),
      v.setUint16(26, f.length, !0),
      T.setUint32(0, 33639248, !0),
      T.setUint16(4, 20, !0),
      T.setUint16(6, 20, !0),
      T.setUint32(16, I, !0),
      T.setUint32(20, r.length, !0),
      T.setUint32(24, r.length, !0),
      T.setUint16(28, f.length, !0),
      T.setUint32(42, t, !0),
      s.push(b, f, r),
      n.push(j, f),
      (t += 30 + f.length + r.length));
  }
  const o = Ja(n),
    i = new Uint8Array(22),
    c = new DataView(i.buffer);
  return (
    c.setUint32(0, 101010256, !0),
    c.setUint16(8, e.length, !0),
    c.setUint16(10, e.length, !0),
    c.setUint32(12, o.length, !0),
    c.setUint32(16, t, !0),
    Ja([...s, o, i])
  );
}
function hn(e, t) {
  const s = yn.encode(e),
    n = new Uint8Array(12 + t.length),
    o = new DataView(n.buffer);
  return (
    o.setUint32(0, t.length),
    n.set(s, 4),
    n.set(t, 8),
    o.setUint32(8 + t.length, Fs(Ja([s, t]))),
    n
  );
}
async function Do(e) {
  const { width: t, height: s } = e,
    n = e.getContext("2d").getImageData(0, 0, t, s).data,
    o = new Uint8Array((t * 4 + 1) * s);
  for (let d = 0; d < s; d++)
    o.set(n.subarray(d * t * 4, (d + 1) * t * 4), d * (t * 4 + 1) + 1);
  const i = new Uint8Array(
      await new Response(
        new Blob([o]).stream().pipeThrough(new CompressionStream("deflate")),
      ).arrayBuffer(),
    ),
    c = new Uint8Array(13),
    u = new DataView(c.buffer);
  return (
    u.setUint32(0, t),
    u.setUint32(4, s),
    c.set([8, 6, 0, 0, 0], 8),
    Ja([
      new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
      hn("IHDR", c),
      hn("IDAT", i),
      hn("IEND", new Uint8Array()),
    ])
  );
}
const zn = (e) => [1, 3, 5].map((t) => parseInt(e.slice(t, t + 2), 16)),
  es = (e) =>
    zn(e)
      .map(
        (t) => (
          (t /= 255),
          t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4
        ),
      )
      .reduce((t, s, n) => t + s * [0.2126, 0.7152, 0.0722][n], 0);
function La(e, t) {
  const s = es(e),
    n = es(t);
  return (Math.max(s, n) + 0.05) / (Math.min(s, n) + 0.05);
}
const un = (e, t, s) =>
  "#" +
  zn(e)
    .map((n, o) =>
      Math.round(n * (1 - s) + zn(t)[o] * s)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
function Po(e, t) {
  const s = La(e, "#000000") >= La(e, "#ffffff") ? "#000000" : "#ffffff",
    n = s === "#000000" ? "#ffffff" : "#000000",
    o = un(e, n, 0.18),
    i = un(e, n, 0.08);
  return {
    background: e,
    panel: o,
    sidebar: i,
    text: s,
    muted: s,
    border: un(e, s, 0.25),
    accent: t,
    accentText: La(t, "#000000") >= La(t, "#ffffff") ? "#000000" : "#ffffff",
  };
}
function Bo(e) {
  const t = new DataView(e.buffer, e.byteOffset, e.byteLength),
    s = (i, c) => String.fromCharCode(...e.subarray(i, i + c));
  let n, o;
  if (e.length >= 24 && s(1, 3) === "PNG" && e[0] === 137)
    ((n = t.getUint32(16)), (o = t.getUint32(20)));
  else if (e[0] === 255 && e[1] === 216) {
    let i = 2;
    for (; i + 4 < e.length && e[i++] === 255;) {
      for (; e[i] === 255;) i++;
      const c = e[i++];
      if (c === 218 || c === 217) break;
      const u = t.getUint16(i);
      if (u < 2 || i + u > e.length) break;
      if ([192, 193, 194].includes(c) && u >= 7) {
        ((o = t.getUint16(i + 3)), (n = t.getUint16(i + 5)));
        break;
      }
      i += u;
    }
  } else if (e.length >= 30 && s(0, 4) === "RIFF" && s(8, 4) === "WEBP") {
    const i = s(12, 4),
      c = (u) => e[u] + e[u + 1] * 256 + e[u + 2] * 65536;
    if (i === "VP8X") {
      if (e[20] & 2)
        throw Error("움직이는 WebP 대신 정지 이미지를 선택해 주세요.");
      ((n = 1 + c(24)), (o = 1 + c(27)));
    } else
      i === "VP8 " && s(23, 3) === "*"
        ? ((n = t.getUint16(26, !0) & 16383), (o = t.getUint16(28, !0) & 16383))
        : i === "VP8L" &&
          e[20] === 47 &&
          ((n = 1 + (((e[22] & 63) << 8) | e[21])),
          (o = 1 + (((e[24] & 15) << 10) | (e[23] << 2) | (e[22] >> 6))));
  }
  if (!n || !o) throw Error("PNG, JPG 또는 WebP 그림을 선택해 주세요.");
  if (n > 8192 || o > 8192 || n * o > 16e6)
    throw Error(
      "그림이 너무 커요. 가로·세로 8,192px, 전체 1,600만 픽셀 이하로 줄여 주세요.",
    );
  return { width: n, height: o };
}
function Ho(e) {
  let t = "";
  for (let s = 0; s < e.length; s += 16384)
    t += String.fromCharCode(...e.subarray(s, s + 16384));
  return btoa(t);
}
const Le = (e) =>
    String(e ?? "").replace(
      /[&<>"']/g,
      (t) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[t],
    ),
  ts = ["씨앗", "새싹", "무성함", "꽃피움"],
  Uo = `
.tc{box-sizing:border-box;width:min(1060px,96vw);max-height:94vh;padding:0;border:1px solid #d5ded2;border-radius:20px;background:#f8f8f3;color:#263e33;font:15px/1.6 system-ui;box-shadow:0 24px 90px #13281b44}.tc::backdrop{background:#162b2566}.tc *{box-sizing:border-box}.tc header{display:flex;justify-content:space-between;align-items:center;padding:20px 28px;border-bottom:1px solid #dce3d9}.tc h2,.tc h3,.tc p{margin:0 0 12px}.tc header h2{font-size:21px;margin:0}.tc small,.tc .hint{font-size:13px;color:#57695d}.tc button,.tc input,.tc select,.tc textarea{font:inherit}.tc button{cursor:pointer;border:1px solid #c5d2c0;border-radius:9px;padding:10px 16px;color:#294632;background:white}.tc button:hover{background:#edf3e8}.tc button:disabled{cursor:default;opacity:.5}.tc button:focus-visible,.tc input:focus-visible,.tc select:focus-visible{outline:3px solid #749f65;outline-offset:3px}.tc .primary{background:#355b45;color:white;border-color:#355b45}.tc .steps{display:flex;gap:8px;padding:20px 28px 0}.tc .steps button{flex:1;text-align:left;padding:10px 12px;background:transparent}.tc .steps [aria-current=step]{background:#e8f0df;border-color:#789569;font-weight:700}.tc .layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:30px;padding:24px 28px}.tc .editor{min-width:0}.tc label{display:block;font-weight:600;margin:16px 0 6px}.tc label span{font-weight:400}.tc input[type=text],.tc input[type=password],.tc input[type=file],.tc textarea,.tc select{display:block;max-width:100%;width:100%;border:1px solid #c5d2c0;border-radius:8px;padding:10px;background:white;color:#263e33;margin:6px 0}.tc input[type=color]{height:44px;width:100%;border:1px solid #c5d2c0;border-radius:8px;padding:4px;background:white;cursor:pointer}.tc input[type=checkbox]{width:18px;height:18px;vertical-align:middle;margin-right:8px}.tc .drop{border:2px dashed #adc29e;border-radius:14px;padding:24px 18px;background:#f0f5e9;text-align:center}.tc .drop.drag{background:#dfebd3;border-color:#496d35}.tc .drop strong{display:block;font-size:18px;margin-bottom:4px}.tc details{margin:18px 0;border-top:1px solid #dce3d9;padding-top:12px}.tc summary{cursor:pointer;font-weight:600}.tc .row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.tc .presets{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}.tc .presets button{padding:8px 12px}.tc .preset-dot{display:inline-block;width:13px;height:13px;border-radius:50%;margin-right:6px;border:1px solid #999}.tc .preview{background:#edf0e8;border-radius:16px;padding:20px;align-self:start;position:sticky;top:12px}.tc .preview h3{font-size:14px}.tc .mock{border:1px solid #c5d2c0;border-radius:10px;overflow:hidden;font-size:12px}.tc .mock-top{padding:9px 12px;border-bottom:1px solid var(--tc-border)}.tc .mock-body{display:grid;grid-template-columns:85px 1fr;min-height:160px}.tc .mock-nav{padding:16px 8px;background:var(--tc-sidebar)}.tc .mock-main{padding:16px;background:var(--tc-bg);color:var(--tc-text)}.tc .mock-card{padding:12px;background:var(--tc-panel);border:1px solid var(--tc-border);border-radius:8px;margin-top:12px}.tc .mock-action{display:inline-block;padding:5px 10px;border-radius:5px;background:var(--tc-accent);color:var(--tc-accentText);margin-top:8px}.tc .preview canvas{display:block;max-width:100%;height:auto;margin:16px auto;image-rendering:pixelated}.tc .desk{padding:10px;border-radius:10px;background:repeating-conic-gradient(#e3e8df 0% 25%,#f8faf5 0% 50%) 50%/16px 16px}.tc .preview .row label{flex:1;font-size:12px;font-weight:400;margin:8px 0}.tc .preview select{font-size:13px;padding:6px}.tc .status{margin:0 28px 12px;color:#9c3529;font-weight:600;min-height:24px}.tc footer{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;border-top:1px solid #dce3d9;padding:18px 28px;background:#fffef9;position:sticky;bottom:0}.tc .auth{border:1px solid #c5d2c0;border-radius:12px;padding:16px;margin:16px 0;background:white}.tc .done{text-align:center;padding:50px 24px}.tc .done strong{display:block;font-size:26px;margin:16px}.tc .done .mark{font-size:40px}.tc .filename{overflow-wrap:anywhere;font-size:13px}.tc [hidden]{display:none!important}@media(max-width:720px){.tc{width:96vw;max-height:96vh;border-radius:12px}.tc .layout{grid-template-columns:1fr;padding:18px;gap:20px}.tc header,.tc footer{padding:16px 18px}.tc .steps{padding:16px 18px 0}.tc .steps button{font-size:12px;padding:8px}.tc .preview{position:static}.tc .status{margin-left:18px;margin-right:18px}}
`,
  as = (e) =>
    new Promise((t, s) => {
      const n = new Image();
      ((n.onload = () => t(n)),
        (n.onerror = () =>
          s(Error("그림을 읽을 수 없어요. 다른 파일을 선택해 주세요."))),
        (n.src = e));
    }),
  Yo = (e) =>
    new Promise((t, s) => {
      const n = new FileReader();
      ((n.onload = () => t(n.result)),
        (n.onerror = () => s(Error("파일을 읽지 못했어요."))),
        n.readAsDataURL(e));
    });
async function Wo(e = {}) {
  var Wn, qn;
  const t = e.translate || ((O) => O),
    s =
      e.localize ||
      ((O, ...x) => O.reduce((Y, Z, ne) => Y + (ne ? x[ne - 1] : "") + Z, ""));
  if (document.querySelector("dialog.tc")) return;
  if (!document.getElementById("theme-creator-style")) {
    const O = document.createElement("style");
    ((O.id = "theme-creator-style"),
      (O.textContent = Uo),
      document.head.append(O));
  }
  const n = document.activeElement,
    o = document.createElement("dialog");
  ((o.className = "tc"),
    o.setAttribute("aria-label", t("테마 만들기")),
    document.body.append(o));
  const i = await as(ra.atlas),
    c = document.createElement("canvas");
  c.width = c.height = 512;
  let u = 0,
    d = 0,
    r = "#f7f5ef",
    f = "#355b45",
    b = null,
    j = [null, null, null, null],
    v = null,
    T = null,
    I = null,
    h = t("나의 작은 창틀"),
    l = 1,
    g = 1,
    z = !1,
    A = !1,
    $ = !1,
    C = "",
    S = !1,
    w = !1,
    F = "login",
    R = "",
    U = ((Wn = e.getAccount) == null ? void 0 : Wn.call(e)) || {
      user: null,
      uploads: !0,
    };
  const Me = "creator:" + crypto.randomUUID(),
    ze = () => Po(r, f);
  function ge() {
    const O = c.getContext("2d");
    (O.clearRect(0, 0, 512, 512),
      O.drawImage(i, 0, 0),
      (O.imageSmoothingEnabled = !0));
    for (let x = 0; x < 4; x++) {
      const Y = j[x] || b;
      if (Y)
        for (let Z = 0; Z < 3; Z++) {
          const ne = Z * 64,
            Ge = x * 112;
          O.clearRect(ne, Ge, 64, 112);
          const L = Math.min(64 / Y.img.width, 112 / Y.img.height),
            G = Y.img.width * L,
            re = Y.img.height * L;
          O.drawImage(Y.img, ne + (64 - G) / 2, Ge + 112 - re, G, re);
        }
    }
  }
  function na(O) {
    const x = 164 + (l - 1) * 110;
    ((O.width = x), (O.height = 150));
    const Y = O.getContext("2d");
    Y.imageSmoothingEnabled = !1;
    const Z = (ne, Ge, L = 16) =>
      Y.drawImage(c, ne[0], ne[1], L, 26, Ge, 118, L, 26);
    Z(ra.manifest.shelf.left, 9);
    for (let ne = 25; ne < x - 25; ne += 16)
      Z(ra.manifest.shelf.repeat, ne, Math.min(16, x - 25 - ne));
    Z(ra.manifest.shelf.right, x - 25);
    for (let ne = 0; ne < l; ne++)
      Y.drawImage(c, ne * 64, g * 112, 64, 112, 50 + 110 * ne, 4, 64, 112);
  }
  function ln() {
    if (w) return;
    ge();
    const O = o.querySelector(".preview");
    if (!O) return;
    const x = ze();
    for (const [Y, Z] of Object.entries(x))
      O.style.setProperty("--tc-" + (Y === "background" ? "bg" : Y), Z);
    ((O.querySelector(".mock").style.color = x.text),
      (O.querySelector(".mock").style.background = x.panel),
      (O.querySelector(".mock").style.fontFamily = T
        ? `"${T.family}", system-ui`
        : "system-ui"),
      na(O.querySelector("canvas")));
  }
  function dn() {
    A ||
      ($ &&
        !S &&
        !confirm(t("아직 저장하지 않은 테마예요. 제작 화면을 닫을까요?"))) ||
      ((w = !0),
      T && document.fonts.delete(T),
      o.close(),
      o.remove(),
      n == null || n.focus());
  }
  o.addEventListener("cancel", (O) => {
    (O.preventDefault(), dn());
  });
  function Ia(O) {
    C = O;
    const x = o.querySelector(".status");
    x && (x.textContent = O);
  }
  async function sa(O) {
    if (!(A || S)) {
      ((A = !0), Ia(""));
      for (const x of o.querySelectorAll("button,input,select"))
        x.disabled = !0;
      try {
        await O();
      } catch (x) {
        C = x.message || t("다시 시도해 주세요.");
      } finally {
        ((A = !1), w || Re(!1));
      }
    }
  }
  async function Yn(O, x) {
    O &&
      (await sa(async () => {
        if (O.size > 8 * 1024 * 1024)
          throw Error(t("그림은 8MB 이하로 선택해 주세요."));
        const Y = new Uint8Array(await O.arrayBuffer());
        Bo(Y);
        const Z = await as(await Yo(O));
        if (w) return;
        const ne = { img: Z, name: O.name };
        (x < 0 ? (b = ne) : (j[x] = ne), ($ = !0));
      }));
  }
  async function Xs() {
    if (!h.trim() || h.trim().length > 60 || /[\x00-\x1f\x7f]/.test(h))
      throw Error(t("테마 이름을 1~60자로 입력해 주세요."));
    if (v && !I)
      throw Error(
        t("글꼴을 함께 나누려면 2단계에서 라이선스 TXT도 선택해 주세요."),
      );
    ge();
    const O = await Do(c),
      x = structuredClone(ra.manifest);
    ((x.formatVersion = 2),
      (x.themeId = Me),
      (x.version = "1.0.0"),
      (x.title = h.trim()),
      (x.creatorLabel = U.user || t("내 창틀")),
      (x.licenseId = "creator-authorized-sharing"),
      (x.compatibility.minAppVersion = "0.4.0"),
      (x.ui = ze()),
      (x.palette = {
        surface: x.ui.background,
        surfaceAlt: x.ui.panel,
        accent: x.ui.accent,
      }),
      (x.assets.atlas.sha256 = await Jn(O)));
    const Y = [
      ["manifest.json", ""],
      ["assets/atlas.png", O],
    ];
    (v &&
      ((x.assets.font = {
        path: "assets/font." + v.ext,
        sha256: await Jn(v.bytes),
        family: v.name,
        licenseId: "Included font license",
        licensePath: "licenses/font.txt",
      }),
      Y.push([x.assets.font.path, v.bytes], ["licenses/font.txt", I.bytes])),
      (Y[0][1] = JSON.stringify(x)));
    const Z = Lo(Y);
    if (Z.length > 5 * 1024 * 1024)
      throw Error(t("테마가 5MB를 넘어요. 그림이나 글꼴 크기를 줄여 주세요."));
    return Z;
  }
  function Zs() {
    return u === 0
      ? s`<h3>어떤 그림을 올려볼까요?</h3><p class="hint">기본 도트 화분으로 시작해도 좋아요. 사진을 넣으면 작은 창틀의 화분 자리 전체를 바꿔요.</p><div class="drop" tabindex="0" role="group" aria-label="그림 놓는 곳"><strong>사진이나 그림을 여기에 놓으세요</strong><span class="hint">PNG · JPG · WebP / 8MB 이하</span><label>그림 선택<input data-image="-1" type="file" accept="image/png,image/jpeg,image/webp"></label><span class="filename">${Le((b == null ? void 0 : b.name) || t("기본 도트 그림을 사용하고 있어요"))}</span></div><p class="hint">크기는 자동으로 맞춰요. 사진 배경도 함께 표시돼요. 배경 없는 그림은 투명 PNG를 골라 주세요.</p><button data-do="reset-art">기본 그림으로 돌아가기</button><details><summary>성장할 때 그림도 바꾸고 싶어요</summary><p class="hint">선택하지 않은 단계는 위 그림을 사용해요. 한 장만 넣으면 모든 화분과 성장단계에 같은 그림이 보여요.</p>${ts
          .map((O, x) => {
            var Y;
            return s`<label>${t(O)} 그림<input data-image="${x}" type="file" accept="image/png,image/jpeg,image/webp"></label><span class="filename">${Le(((Y = j[x]) == null ? void 0 : Y.name) || t("공통 그림 사용"))}</span>${j[x] ? s`<button data-clear="${x}">이 단계 그림 제거</button>` : ""}`;
          })
          .join("")}</details>`
      : u === 1
        ? s`<h3>좋아하는 분위기를 골라요</h3><p class="hint">글자와 카드 색상은 읽기 좋게 자동으로 맞춰 드려요.</p><div class="presets">${[
            [t("초록빛"), "#f7f5ef", "#355b45"],
            [t("보랏빛"), "#f3f0fa", "#69438b"],
            [t("밤하늘"), "#202b39", "#a5c8f0"],
          ]
            .map(
              ([O, x, Y]) =>
                `<button data-preset="${x},${Y}"><span class="preset-dot" style="background:${Y}"></span>${O}</button>`,
            )
            .join(
              "",
            )}</div><label>배경 색상<input id="tc-background" type="color" value="${r}"></label><label>강조 색상<input id="tc-accent" type="color" value="${f}"></label><details ${v ? "open" : ""}><summary>글꼴도 바꾸기 · 선택 사항</summary><p class="hint">없으면 기본 글꼴을 사용해요. 다른 사람에게도 나눌 수 있는 글꼴만 넣어 주세요.</p><label>글꼴 파일<input id="tc-font" type="file" accept=".ttf,.otf,.woff,.woff2"></label><span class="filename">${Le((v == null ? void 0 : v.fileName) || t("기본 글꼴 · 별도 파일이 필요 없어요"))}</span><label>글꼴 라이선스 파일<input id="tc-license" type="file" accept=".txt,text/plain"></label><span class="filename">${Le((I == null ? void 0 : I.name) || t("글꼴과 함께 받은 라이선스 TXT · 32KB 이하"))}</span>${v ? t('<button data-do="remove-font">기본 글꼴 사용</button>') : ""}</details>`
        : s`<h3>이대로 나눠볼까요?</h3><label>테마 이름<input id="tc-title" type="text" maxlength="60" value="${Le(h)}"></label><p class="hint">메인 화면 색상 · 작은 창틀 그림${v ? t(" · 글꼴") : ""}을 함께 담아요. 미리보기의 폴더와 파일은 예시예요.</p><p>가격 <strong>무료</strong></p><label><input id="tc-rights" type="checkbox" ${z ? "checked" : ""}>그림·글꼴을 직접 만들었거나 재배포 권한이 있어요.</label><p class="hint">공유하면 다른 회원이 무료로 받을 수 있어요. 원본 사진은 따로 올리지 않고, 맞춤 크기의 테마 그림만 전송해요.</p>${U.user ? s`<p class="hint">${Le(U.user)} 님의 테마로 공유해요.</p>` : s`<div class="auth"><h3>${t(F === "register" ? "무료 회원가입" : "공유하려면 로그인해 주세요")}</h3><p class="hint">제작 중인 내용은 그대로 유지돼요. 내 파일로 저장은 로그인 없이 할 수 있어요.</p><div class="row"><button data-auth-mode="login" aria-pressed="${F === "login"}">로그인</button><button data-auth-mode="register" aria-pressed="${F === "register"}">회원가입</button></div><form id="tc-auth"><label>아이디<input name="id" type="text" value="${Le(R)}" maxlength="32" autocomplete="username" required></label><label>비밀번호<input name="password" type="password" minlength="10" maxlength="128" autocomplete="${F === "register" ? "new-password" : "current-password"}" required></label>${F === "register" ? t('<label>비밀번호 확인<input name="confirm" type="password" autocomplete="new-password" required></label>') : ""}<p class="hint">아이디: 영문·숫자·밑줄 3~32자 / 비밀번호: 10~128자</p><button type="submit">${t(F === "register" ? "가입하고 계속하기" : "로그인하고 계속하기")}</button></form></div>`}`;
  }
  function Re(O = !0) {
    var x;
    if (
      ((o.innerHTML = s`<header><div><small>나만의 분위기를 한 걸음씩</small><h2>테마 만들기</h2></div><button data-do="close" aria-label="제작 화면 닫기">닫기</button></header>${S ? s`<div class="done"><span class="mark">🌱</span><strong>테마를 공유했어요</strong><p>${Le(h)} · 모든 회원에게 무료로 공개됐어요.</p><p class="hint">테마 목록에서 받아 내 창틀에 적용해 보세요.</p><button class="primary" data-do="close">목록으로 돌아가기</button></div>` : s`<nav class="steps" aria-label="테마 제작 단계">${[t("그림 넣기"), t("색상·글꼴"), t("미리보기·공유")].map((Y, Z) => `<button data-step="${Z}" ${Z > d ? "disabled" : ""} ${Z === u ? 'aria-current="step"' : ""}>${Z + 1}. ${Y}</button>`).join("")}</nav><div class="layout"><div class="editor" tabindex="-1">${Zs()}</div><aside class="preview" aria-label="테마 미리보기"><h3>메인 프로그램 예시</h3><div class="mock"><div class="mock-top">작은 창틀</div><div class="mock-body"><div class="mock-nav">나의 창틀<br><br>관리 파일<br><br>테마 나누기</div><div class="mock-main"><strong>조금씩 정리하는 하루</strong><div class="mock-card">나의 화분<br><span class="mock-action">파일 정리</span></div></div></div></div><h3 style="margin-top:20px">우측 하단의 작은 창틀</h3><div class="desk"><canvas aria-label="작은 창틀 그림 미리보기"></canvas></div><div class="row"><label>화분 개수<select id="tc-count">${[1, 2, 3].map((Y) => s`<option value="${Y}" ${l === Y ? "selected" : ""}>${Y}개</option>`).join("")}</select></label><label>성장 단계<select id="tc-stage">${ts.map((Y, Z) => `<option value="${Z}" ${g === Z ? "selected" : ""}>${t(Y)}</option>`).join("")}</select></label></div><p class="hint">그림의 배경 제거·도트 변환은 하지 않아요. 실제 표시 개수는 연결한 화분 수를 따라가요.</p></aside></div><p class="status" role="alert">${Le(C)}</p><footer><button data-do="back" ${u === 0 ? "disabled" : ""}>이전</button><div class="row">${u < 2 ? t('<button class="primary" data-do="next">다음</button>') : s`<button data-do="save">내 파일로 저장</button>${e.onInstall ? t('<button data-do="install">내 기기에 설치</button>') : ""}<button class="primary" data-do="publish" ${!U.user || !z || U.uploads === !1 ? "disabled" : ""}>무료로 공유하기</button>`}</div>${u === 2 && U.uploads === !1 ? t('<span class="hint">현재 업로드가 잠시 닫혀 있어요. 내 파일로 저장해 주세요.</span>') : ""}</footer>`}`),
      S)
    ) {
      o.querySelectorAll("[data-do=close]").forEach((Y) => (Y.onclick = dn));
      return;
    }
    (ln(), Js(), O && ((x = o.querySelector(".editor")) == null || x.focus()));
  }
  function Js() {
    (o.querySelectorAll("[data-step]").forEach(
      (L) =>
        (L.onclick = () => {
          ((u = Number(L.dataset.step)), (C = ""), Re());
        }),
    ),
      o
        .querySelectorAll("[data-image]")
        .forEach(
          (L) => (L.onchange = () => Yn(L.files[0], Number(L.dataset.image))),
        ),
      o.querySelectorAll("[data-clear]").forEach(
        (L) =>
          (L.onclick = () => {
            ((j[Number(L.dataset.clear)] = null), ($ = !0), Re(!1));
          }),
      ));
    const O = o.querySelector(".drop");
    if (O) {
      O.addEventListener("garden-native-drop", async (event) => {
        event.stopPropagation();
        if (event.detail.phase === "hover") {
          O.classList.add("drag");
          return;
        }
        O.classList.remove("drag");
        try {
          await Yn(await y.readDroppedImage(event.detail), -1);
        } catch (error) {
          ce(error instanceof Error ? error.message : a("파일을 다시 놓아 주세요."));
        }
      });
      for (const L of ["dragenter", "dragover"])
        O.addEventListener(L, (G) => {
          (G.preventDefault(), G.stopPropagation(), O.classList.add("drag"));
        });
      (O.addEventListener("dragleave", () => O.classList.remove("drag")),
        O.addEventListener("drop", (L) => {
          (L.preventDefault(),
            L.stopPropagation(),
            O.classList.remove("drag"),
            Yn(L.dataTransfer.files[0], -1));
        }));
    }
    o.querySelectorAll("[data-preset]").forEach(
      (L) =>
        (L.onclick = () => {
          (([r, f] = L.dataset.preset.split(",")), ($ = !0), Re(!1));
        }),
    );
    for (const L of ["background", "accent"]) {
      const G = o.querySelector("#tc-" + L);
      G &&
        (G.oninput = () => {
          (L === "background" ? (r = G.value) : (f = G.value), ($ = !0), ln());
        });
    }
    for (const [L, G] of [
      ["count", (re) => (l = re)],
      ["stage", (re) => (g = re)],
    ])
      o.querySelector("#tc-" + L).onchange = (re) => {
        (G(Number(re.target.value)), ln());
      };
    const x = o.querySelector("#tc-title");
    x &&
      (x.oninput = () => {
        ((h = x.value), ($ = !0));
      });
    const Y = o.querySelector("#tc-rights");
    Y &&
      (Y.onchange = () => {
        ((z = Y.checked),
          (o.querySelector("[data-do=publish]").disabled =
            !z || !U.user || U.uploads === !1));
      });
    const Z = o.querySelector("#tc-font");
    Z &&
      (Z.onchange = () =>
        sa(async () => {
          const L = Z.files[0];
          if (!L) return;
          const G = L.name.split(".").pop().toLowerCase();
          if (
            !["ttf", "otf", "woff", "woff2"].includes(G) ||
            L.size > 2 * 1024 * 1024
          )
            throw Error(
              t("2MB 이하 TTF, OTF, WOFF, WOFF2 글꼴을 선택해 주세요."),
            );
          const re = new Uint8Array(await L.arrayBuffer()),
            je = new FontFace(
              "CreatorPreview" + crypto.randomUUID().replaceAll("-", ""),
              re.buffer,
            );
          try {
            await je.load();
          } catch {
            throw Error(
              t("이 글꼴을 읽을 수 없어요. 다른 글꼴을 선택해 주세요."),
            );
          }
          (T && document.fonts.delete(T),
            (T = je),
            document.fonts.add(je),
            (v = {
              bytes: re,
              ext: G,
              name: "My theme font",
              fileName: L.name,
            }),
            (I = null),
            ($ = !0));
        }));
    const ne = o.querySelector("#tc-license");
    (ne &&
      (ne.onchange = () =>
        sa(async () => {
          const L = ne.files[0];
          if (!L) return;
          if (L.size > 32768)
            throw Error(t("라이선스는 32KB 이하 TXT 파일로 넣어 주세요."));
          const G = new Uint8Array(await L.arrayBuffer());
          let re;
          try {
            re = new TextDecoder("utf8", { fatal: !0 }).decode(G);
          } catch {
            throw Error(t("라이선스는 UTF-8 텍스트로 저장해 주세요."));
          }
          if (!re.trim() || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(re))
            throw Error(t("내용이 있는 라이선스 TXT 파일을 선택해 주세요."));
          ((I = { bytes: G, name: L.name }), ($ = !0));
        })),
      o.querySelectorAll("[data-auth-mode]").forEach(
        (L) =>
          (L.onclick = () => {
            ((F = L.dataset.authMode), Re(!1));
          }),
      ));
    const Ge = o.querySelector("#tc-auth");
    (Ge &&
      (Ge.onsubmit = (L) => {
        L.preventDefault();
        const G = new FormData(Ge),
          re = String(G.get("id") || "").trim(),
          je = String(G.get("password") || "");
        if (!/^[a-z0-9_]{3,32}$/i.test(re) || je.length < 10 || je.length > 128)
          return Ia(t("아이디와 비밀번호 입력 조건을 확인해 주세요."));
        if (F === "register" && je !== G.get("confirm"))
          return Ia(t("비밀번호 확인이 일치하지 않아요."));
        ((R = re),
          sa(async () => {
            U = await e.onAuth(F, re, je);
          }));
      }),
      o.querySelectorAll("[data-do]").forEach(
        (L) =>
          (L.onclick = () => {
            const G = L.dataset.do;
            if (G === "close") return dn();
            if (G === "reset-art")
              return (
                (b = null),
                (j = [null, null, null, null]),
                ($ = !0),
                Re(!1)
              );
            if (G === "remove-font")
              return (
                T && document.fonts.delete(T),
                (v = T = I = null),
                ($ = !0),
                Re(!1)
              );
            if (G === "next" || G === "back")
              return u === 1 && G === "next" && v && !I
                ? Ia(
                    t(
                      "선택한 글꼴의 라이선스 TXT를 넣거나 기본 글꼴을 선택해 주세요.",
                    ),
                  )
                : ((u += G === "next" ? 1 : -1),
                  (d = Math.max(u, d)),
                  (C = ""),
                  Re());
            sa(async () => {
              var je;
              if (G === "publish" && (!U.user || !z))
                throw Error(t("로그인과 공유 권한을 확인해 주세요."));
              const re = await Xs();
              if (G === "save") {
                const ct = URL.createObjectURL(
                    new Blob([re], { type: "application/zip" }),
                  ),
                  cn = document.createElement("a");
                ((cn.href = ct),
                  (cn.download = "my-windowsill.silltheme"),
                  cn.click(),
                  setTimeout(() => URL.revokeObjectURL(ct), 3e4),
                  ($ = !1),
                  (C = t(
                    "테마 파일을 저장했어요. 앱의 받은 파일 설치에서 사용할 수 있어요.",
                  )));
              }
              if (
                (G === "install" &&
                  (await e.onInstall(Ho(re)),
                  ($ = !1),
                  (C = t(
                    "내 기기에 설치했어요. 제작 화면을 닫고 적용을 눌러 주세요.",
                  ))),
                G === "publish")
              ) {
                try {
                  await e.onPublish(re);
                } catch (ct) {
                  throw (
                    ct.status === 401 && (U = { ...U, user: null }),
                    ct.status
                      ? ct
                      : Error(
                          (ct.message || t("연결이 끊겼어요.")) +
                            t(
                              " 공유 결과가 불확실하면 목록을 확인한 뒤 다시 시도해 주세요.",
                            ),
                        )
                  );
                }
                ((S = !0),
                  ($ = !1),
                  await ((je = e.onDone) == null ? void 0 : je.call(e)));
              }
            });
          }),
      ));
  }
  (Re(!1),
    o.showModal(),
    (qn = o.querySelector("[data-image]")) == null || qn.focus());
}
const Da = (e) =>
  String(e ?? "").replace(
    /[&<>"']/g,
    (t) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        t
      ],
  );
let de,
  se,
  xe,
  _ = { installed: [], active: null, user: null },
  On = [],
  lt = {},
  Es = !1,
  gt = !1,
  ua = 1,
  Ot = "",
  Mt = "",
  Te = "",
  Ze = "",
  $a = !1,
  ut = "login",
  $e = "",
  xt = "",
  Ee = "",
  vt = !1,
  xs = null,
  Ua,
  Ya = !1,
  qt = !1,
  ns = !1;
const Is = [
  "background",
  "panel",
  "sidebar",
  "text",
  "muted",
  "border",
  "accent",
  "accentText",
];
function qo() {
  delete document.documentElement.dataset.externalTheme;
  for (const e of Is)
    document.documentElement.style.removeProperty("--theme-" + e);
  (document.documentElement.style.removeProperty("--theme-font"),
    Ua && document.fonts.delete(Ua),
    (Ua = void 0));
}
function Vo(e, t, s) {
  ((de = e), (se = t), (xe = s));
}
function Mn(e) {
  (e.id === "theme-id" && (Mt = e.value),
    e.id === "theme-password" && (Te = e.value),
    e.id === "theme-confirm" && (Ze = e.value),
    e.id === "theme-rights" && ($a = e.checked),
    e.id === "tm-search" && ((k.query = e.value), se()),
    e.id === "tm-reduced" && ((k.draft.reduced = e.checked), se()),
    e.id.startsWith("tm-scope-") &&
      ((k.draft[e.id.slice(9)] = e.checked), se()));
}
let Os = !1,
  la = "",
  Ms = !1,
  ss = !1;
const ht = new Map(),
  It = new Map(),
  pn = new Map();
function Rs(e) {
  const t = It.get(e);
  if (t) return Promise.resolve(t);
  let s = pn.get(e);
  if (!s) {
    const n = new Image();
    ((n.src = e),
      (s = n
        .decode()
        .then(
          () => (
            It.size >= 60 && It.delete(It.keys().next().value),
            It.set(e, n),
            n
          ),
        )
        .finally(() => pn.delete(e))),
      pn.set(e, s));
  }
  return s;
}
async function Ls(e, t) {
  const s = (t ? "remote:" : "local:") + e;
  return (
    ht.has(s) ||
      (ht.size >= 60 && ht.delete(ht.keys().next().value),
      ht.set(
        s,
        de.themes("preview", e, t).catch((n) => {
          throw (ht.delete(s), n);
        }),
      )),
    ht.get(s)
  );
}
async function Go(e) {
  var s, n, o, i, c;
  Os = !!((s = e.settings) != null && s.reducedMotion);
  const t = JSON.stringify(e.themes);
  if (t !== la && ((la = t), !!de.themes))
    try {
      const u = await de.themes("active");
      if (t !== la) return;
      const d = (u == null ? void 0 : u.applied) || {},
        r = (u == null ? void 0 : u.selection) || {},
        f = d.widget,
        b = d.main,
        j = d.font;
      let v = null,
        T;
      f &&
        (v = {
          manifest: f.manifest,
          builtin: f.builtin,
          image: f.builtin ? void 0 : await Rs(f.atlas),
        });
      const I = Aa.find(
        (l) => (j == null ? void 0 : j.font) === "bundled:" + l.id,
      );
      if (
        (I && (await document.fonts.load(`14px "${I.family}"`)),
        j != null && j.font && !I)
      )
        try {
          const l = Uint8Array.from(atob(j.font), (g) => g.charCodeAt(0));
          T = await new FontFace("WindowsillThemeFont", l.buffer).load();
        } catch {
          xe(a("테마 글꼴을 읽지 못해 기존 글꼴을 사용해요."));
        }
      if (t !== la) return;
      (qo(),
        (xs = v),
        (Ms = f
          ? (((o = (n = r.overrides) == null ? void 0 : n.widget) == null
              ? void 0
              : o.reduced) ?? !1)
          : !1));
      const h = new URLSearchParams(location.search).has("widget") ? f : b;
      if (h != null && h.manifest.ui) {
        for (const g of Is)
          document.documentElement.style.setProperty(
            "--theme-" + g,
            h.manifest.ui[g],
          );
        const l =
          (c =
            (i = r.overrides) == null
              ? void 0
              : i[
                  new URLSearchParams(location.search).has("widget")
                    ? "widget"
                    : "main"
                ]) == null
            ? void 0
            : c.accent;
        (l &&
          (document.documentElement.style.setProperty("--theme-accent", l),
          document.documentElement.style.setProperty(
            "--theme-accentText",
            "#ffffff",
          )),
          (document.documentElement.dataset.externalTheme = "true"));
      }
      (I &&
        document.documentElement.style.setProperty(
          "--theme-font",
          JSON.stringify(I.family),
        ),
        T &&
          (document.fonts.add(T),
          (Ua = T),
          document.documentElement.style.setProperty(
            "--theme-font",
            "WindowsillThemeFont",
          )));
    } catch {
      ((la = ""),
        xe(a("테마를 읽지 못했어요. 내 테마에서 다시 선택해 주세요.")));
    }
}
function pa() {
  return xs;
}
function jn() {
  return Ms;
}
async function Qo() {
  de.themes &&
    ((_ = await de.themes("local")),
    ss ||
      ((ss = !0),
      pt()
        .then(() => se())
        .catch((e) => {
          ((Ot = e instanceof Error ? e.message : a("연결하지 못했어요.")),
            se());
        })));
}
let An = [];
function Ds() {
  for (const e of An) e();
  An = [];
}
function Ko() {
  var i;
  Ds();
  const e = k.surface,
    t = document.querySelector(".tm-removal");
  t && (t.hidden = !!((i = k.selected) != null && i.builtin));
  function s(c, u, d = !1) {
    const r = (b) => {
      var v;
      if (!c.isConnected) return;
      An.push(
        Ha(c, () => ({
          xp: [12],
          count: 1,
          backdrop: d ? e === "main" : !0,
          tiny: d && e === "widget",
          reduced:
            !["runner", "fireflies"].includes(u.builtin) ||
            (d && k.draft.reduced) ||
            Os,
          custom: { manifest: u.manifest, image: b, builtin: u.builtin },
        })),
      );
      const j =
        (v = c.parentElement) == null
          ? void 0
          : v.querySelector(".tm-preview-status");
      j && (j.textContent = "");
    };
    if (u.builtin) return (r(), Promise.resolve());
    const f = It.get(u.atlas);
    return f ? (r(f), Promise.resolve()) : Rs(u.atlas).then(r);
  }
  const n = Array.from(document.querySelectorAll("[data-theme-preview]"));
  (async () => {
    var c;
    for (const u of n)
      if (u.isConnected)
        try {
          const d = await Ls(
            u.dataset.themePreview,
            u.dataset.remote === "true",
          );
          u.isConnected && (await s(u, d));
        } catch {
          if (u.isConnected) {
            const d =
              (c = u.parentElement) == null
                ? void 0
                : c.querySelector(".tm-preview-status");
            d &&
              (d.textContent = a(
                "그림을 불러오지 못했어요 · 상세에서 다시 확인",
              ));
          }
        }
  })();
  const o = document.querySelector("[data-detail-preview]");
  o && k.preview && s(o, k.preview, !0).catch(() => {});
}
const Ye = (e, t, s = "") =>
  `<button class="button outline" data-action="tm-${e}" ${gt ? "disabled" : ""} ${s}>${t}</button>`;
function _o() {
  const e = ut === "register",
    t = (s, n, o, i = "text") =>
      `<label for="theme-${s}">${n}<input id="theme-${s}" type="${i}" autocomplete="${s === "id" ? "username" : e ? "new-password" : "current-password"}" maxlength="${s === "id" ? 32 : 128}" value="${Da(o)}" aria-invalid="${Ee === s}" aria-describedby="theme-auth-hint theme-auth-feedback" ${vt ? "disabled" : ""}></label>`;
  return `<section class="panel theme-account" aria-busy="${vt}">${_.user ? m`<span class="auth-eyebrow">로그인됨 · 무료 이용</span><h2>${Da(_.user)} 님</h2><p id="theme-auth-feedback" class="auth-success" role="status">${Da(xt || a("로그인되어 있어요. 무료 테마를 받고 공유할 수 있어요."))}</p>${Ye("logout", a("로그아웃"))}` : m`<nav class="auth-tabs" aria-label="계정 화면">${Ye("mode-login", a("로그인"), `aria-pressed="${!e}"`)}${Ye("mode-register", a("회원가입"), `aria-pressed="${e}"`)}</nav><span class="auth-eyebrow">${a(e ? "처음 오셨나요?" : "다시 만나 반가워요")}</span><h2>${a(e ? "무료 회원가입" : "로그인")}</h2><p>${a(e ? "아이디를 만들면 테마를 무료로 받고 나눌 수 있어요." : "가입한 아이디와 비밀번호로 로그인하세요.")}</p><form id="theme-auth-form" novalidate><fieldset class="auth-fields" ${vt ? "disabled" : ""}><div class="theme-auth-fields">${t("id", a("아이디"), Mt)}${t("password", a("비밀번호"), Te, "password")}${e ? t("confirm", a("비밀번호 확인"), Ze, "password") : ""}</div><p id="theme-auth-hint" class="subtle">아이디: 영문·숫자·밑줄 3~32자 (대소문자 구분 없음)<br>비밀번호: 10~128자${e ? a(" · 확인란에 한 번 더 입력해 주세요.") : ""}</p><p id="theme-auth-feedback" class="auth-feedback" role="alert">${Da($e)}</p><button type="submit" class="button primary auth-submit" ${vt ? "disabled" : ""}>${a(vt ? (e ? "가입하는 중…" : "로그인하는 중…") : e ? "가입하고 시작하기" : "로그인하기")}</button></fieldset></form><p class="subtle">파일 관리에는 로그인이 필요 없어요. 앱을 완전히 종료하면 다시 로그인해 주세요. 비밀번호 찾기는 아직 지원하지 않아요.</p>`}</section>`;
}
function Xo() {
  return Ya
    ? m`<section class="panel theme-account theme-guide" id="theme-guide" aria-label="테마 제작 안내"><div class="detail-heading"><h2>처음 만드는 테마</h2>${Ye("guide-close", a("안내 닫기"))}</div>${a(Mo)}${Ye(qt ? "guide-next" : "guide-close", a(qt ? "읽었어요 · 파일 선택" : "안내 닫기"), qt && (!_.user || !lt.uploads) ? "disabled" : "")}</section>`
    : "";
}
function Zo() {
  const e = document.getElementById("theme-legacy");
  return (
    e && (ns = e.open),
    de.themes
      ? xo(_, On, gt, Es, lt, ua, Ot) +
        (k.authOpen
          ? '<div class="tm-auth-wrap" id="tm-account">' +
            Ye("account-close", a("닫기")) +
            _o() +
            "</div>"
          : "") +
        (k.tab === "share"
          ? a(
              '<section class="panel theme-account tm-share"><h2>내 취향을 담아 만들어 보세요</h2><p>그림 넣기 → 색상·글꼴 → 미리보기·공유</p>',
            ) +
            Ye("create", a("테마 만들기")) +
            a(
              '<p>코드 없이 만들고, 공유할 때만 로그인해요.</p><details id="theme-legacy" ',
            ) +
            (ns ? "open" : "") +
            a("><summary>이미 만든 테마 파일 올리기</summary>") +
            Ye("guide", a("제작 매뉴얼")) +
            '<label class="once-option"><input type="checkbox" id="theme-rights" ' +
            ($a ? "checked" : "") +
            " " +
            (_.user ? "" : "disabled") +
            a("> 그림과 폰트를 직접 만들었거나 재배포 권한이 있어요.</label>") +
            Ye(
              "upload",
              a("테마 업로드"),
              !_.user || !lt.uploads || !$a ? "disabled" : "",
            ) +
            "<p>" +
            (_.user
              ? lt.uploads === !1
                ? a("업로드가 잠시 닫혀 있어요.")
                : a("검사 후 무료 목록에 공개돼요.")
              : a("로그인하면 업로드할 수 있어요.")) +
            "</p></details></section>" +
            Xo()
          : "")
      : a(
          '<section class="panel settings-panel"><h1 data-ui-label="themesTitle">테마</h1><p>테마 탐색과 설치는 데스크톱 앱에서 사용할 수 있어요.</p></section>',
        )
  );
}
async function fn(e, t) {
  var n, o, i;
  const s = (t ? On : [...(_.builtins || []), ..._.installed]).find(
    (c) => c.id === e,
  );
  if (s) {
    ((k.selected = s),
      (k.remote = t),
      (k.preview = null),
      (k.previewError = ""),
      (k.surface = "widget"),
      se());
    try {
      const c = await Ls(e, t);
      if (((n = k.selected) == null ? void 0 : n.id) !== e || k.remote !== t)
        return;
      k.preview = c;
      const u =
        (i = (o = _.selection) == null ? void 0 : o.preferences) == null
          ? void 0
          : i[e];
      k.draft = {
        ...$s(),
        main: !!c.manifest.ui,
        font: !!c.hasFont,
        accent: (u == null ? void 0 : u.accent) || null,
        reduced:
          (u == null ? void 0 : u.reduced) ??
          !["runner", "fireflies"].includes(c.builtin),
      };
    } catch (c) {
      k.previewError =
        c instanceof Error ? c.message : a("미리보기를 읽지 못했어요.");
    }
    se();
  }
}
async function pt() {
  const e = await de.themes("browse", ua);
  ((_ = e), (On = e.themes), (lt = e.policy), (Es = !0));
}
async function Ps(e, t) {
  var o, i, c, u, d, r, f, b, j, v, T, I;
  if (gt || !de.themes) return;
  const s = e.slice(3),
    n = t.dataset.themeId;
  if (["browse", "library", "share"].includes(s)) {
    ((k.tab = s), (k.selected = null), (k.query = ""), se());
    return;
  }
  if (s === "back") {
    ((k.selected = null), se());
    return;
  }
  if (s === "account" || s === "account-close") {
    ((k.authOpen = s === "account"),
      se(),
      (o = document.getElementById("theme-id")) == null || o.focus());
    return;
  }
  if (s === "select") {
    await fn(n, t.dataset.remote === "true");
    return;
  }
  if (s === "retry-preview") {
    await fn(k.selected.id, k.remote);
    return;
  }
  if (s === "surface") {
    ((k.surface = t.dataset.surface), se());
    return;
  }
  if (s === "accent") {
    ((k.draft.accent = t.dataset.color || null), se());
    return;
  }
  if (s === "download" && !_.user) {
    ((k.authOpen = !0),
      (xt = ""),
      se(),
      (i = document.getElementById("theme-id")) == null || i.focus(),
      (c = document.getElementById("tm-account")) == null ||
        c.scrollIntoView({ block: "center" }));
    return;
  }
  if (s === "create") {
    await Wo({
      translate: a,
      localize: m,
      getAccount: () => ({ user: _.user, uploads: lt.uploads !== !1 }),
      onAuth: async (h, l, g) => {
        _ = await de.themes(h, l, g);
        try {
          await pt();
        } catch {
          xe(
            a(
              "로그인했어요. 목록을 불러오지 못했지만 제작 중인 내용은 유지돼요.",
            ),
          );
        }
        return (se(), { user: _.user, uploads: lt.uploads !== !1 });
      },
      onInstall: async (h) => {
        ((_ = await de.themes("install-created", h)), se());
      },
      onPublish: async (h) => {
        let l = "";
        for (let g = 0; g < h.length; g += 16384)
          l += String.fromCharCode(...h.subarray(g, g + 16384));
        try {
          return await de.themes("publish-created", btoa(l), !0);
        } catch (g) {
          throw (
            (_ = await de.themes("local")),
            _.user
              ? g
              : Object.assign(
                  new Error(
                    a(
                      "로그인이 만료됐어요. 다시 로그인하면 만든 내용을 공유할 수 있어요.",
                    ),
                  ),
                  { status: 401 },
                )
          );
        }
      },
      onDone: async () => {
        (await pt(), se());
      },
    });
    return;
  }
  if (s === "guide" || s === "guide-close") {
    ((Ya = s === "guide"),
      (qt = !1),
      se(),
      (u = document.getElementById("theme-guide")) == null ||
        u.scrollIntoView({ block: "start" }));
    return;
  }
  if (s === "upload" && !_.guideSeen) {
    ((Ya = qt = !0),
      se(),
      (d = document.getElementById("theme-guide")) == null ||
        d.scrollIntoView({ block: "start" }));
    return;
  }
  if (s === "mode-login" || s === "mode-register") {
    ((ut = s === "mode-login" ? "login" : "register"),
      (Te = ""),
      (Ze = ""),
      ($e = ""),
      (Ee = ""),
      se(),
      (r = document.getElementById("theme-id")) == null || r.focus());
    return;
  }
  if (s === "auth-submit") {
    if (
      ((Mt =
        ((f = document.getElementById("theme-id")) == null
          ? void 0
          : f.value) ?? Mt),
      (Te =
        ((b = document.getElementById("theme-password")) == null
          ? void 0
          : b.value) ?? Te),
      (Ze =
        ((j = document.getElementById("theme-confirm")) == null
          ? void 0
          : j.value) ?? Ze),
      ($e = ""),
      (Ee = ""),
      /^[a-z0-9_]{3,32}$/i.test(Mt.trim())
        ? Te.length < 10 || Te.length > 128
          ? (($e = a("비밀번호를 10~128자로 입력해 주세요.")),
            (Ee = "password"))
          : ut === "register" &&
            Te !== Ze &&
            (($e = a("비밀번호가 서로 달라요. 확인란을 다시 입력해 주세요.")),
            (Ee = "confirm"))
        : (($e = a("아이디는 영문·숫자·밑줄로 3~32자를 입력해 주세요.")),
          (Ee = "id")),
      $e)
    ) {
      (se(), (v = document.getElementById("theme-" + Ee)) == null || v.focus());
      return;
    }
    ((gt = vt = !0), (xt = ""), se());
    try {
      ((_ = await de.themes(ut, Mt.trim(), Te)),
        (Te = Ze = ""),
        (xt = a(
          ut === "register"
            ? "가입 완료! 자동으로 로그인했어요. 모든 테마를 무료로 이용하세요."
            : "로그인했어요. 무료 테마를 받고 공유할 수 있어요.",
        )),
        (ut = "login"),
        (k.authOpen = !1),
        xe(xt));
      try {
        (await pt(), (Ot = ""));
      } catch {
        Ot = a(
          "로그인은 완료됐지만 테마 목록을 불러오지 못했어요. 목록 새로고침을 눌러주세요.",
        );
      }
    } catch (h) {
      (($e =
        h instanceof Error
          ? h.message
          : a("로그인 서버에 연결하지 못했어요. 다시 시도해 주세요.")),
        $e.includes("이미 사용") &&
          ((Ee = "id"),
          ($e += a(" 가입한 아이디라면 로그인 화면을 이용해 주세요."))));
    } finally {
      ((gt = vt = !1),
        se(),
        k.authOpen
          ? (I = document.getElementById(
              Ee ? "theme-" + Ee : "theme-auth-feedback",
            )) == null || I.scrollIntoView({ block: "nearest" })
          : (T = document.querySelector(".tm-selected-heading")) == null ||
            T.scrollIntoView({ block: "start" }));
    }
    return;
  }
  ((gt = !0), (Ot = ""), se());
  try {
    if (s === "refresh") await pt();
    else if (s === "logout") {
      try {
        await de.themes("logout");
      } finally {
        ((_ = await de.themes("local")),
          ($a = !1),
          (xt = ""),
          ($e = ""),
          (ut = "login"),
          (Te = Ze = ""));
      }
      xe(a("로그아웃했어요. 설치한 테마는 계속 사용할 수 있어요."));
    } else if (s === "prev" || s === "next")
      ((ua = Math.max(1, ua + (s === "next" ? 1 : -1))), await pt());
    else if (s === "upload" || s === "guide-next") {
      if (!_.user || !lt.uploads)
        throw Error(a("로그인과 업로드 상태를 확인해 주세요."));
      if (!$a) throw Error(a("공유 권한을 확인해 주세요."));
      s === "guide-next" &&
        ((_ = await de.themes("guide-seen")), (Ya = qt = !1));
      const h = await de.themes("upload", !0);
      (h != null &&
        h.theme &&
        xe(a("무료 테마로 공유했어요. 목록에서 확인할 수 있어요.")),
        (ua = 1),
        await pt());
    } else if (s === "apply")
      ((_ = await de.themes("apply", n, k.draft)),
        xe(a("선택한 곳에 적용했어요. 직전 모습으로 되돌릴 수 있어요.")));
    else if (s === "undo")
      ((_ = await de.themes("undo")), xe(a("직전 모습으로 돌아왔어요.")));
    else {
      const h = new Set(_.installed.map((l) => l.id));
      if (
        ((_ = await de.themes(
          s === "reset" ? "activate" : s,
          s === "reset" ? null : n,
        )),
        s === "download" || s === "import")
      ) {
        const l =
          _.installed.find((g) => !h.has(g.id)) ||
          _.installed.find((g) => {
            var z;
            return g.id === ((z = k.selected) == null ? void 0 : z.digest);
          });
        ((k.tab = "library"),
          (k.selected = null),
          l && (await fn(l.id, !1)),
          xe(a("설치했어요. 원하는 곳을 골라 적용해 주세요.")));
      }
      s === "remove" && (k.selected = null);
    }
  } catch (h) {
    ((Ot = h instanceof Error ? h.message : a("다시 시도해 주세요.")),
      (_ = await de.themes("local")));
  } finally {
    ((gt = !1), se());
  }
}
let Wa = "",
  qa,
  Ta = "";
function os() {
  (document.documentElement.style.removeProperty("--custom-font"),
    qa && document.fonts.delete(qa),
    (qa = void 0));
}
async function Bs(e) {
  const t = Uint8Array.from(atob(e), (s) => s.charCodeAt(0));
  try {
    return await new FontFace("WindowsillUserFont", t.buffer).load();
  } catch {
    throw Error(
      a("폰트를 읽지 못했어요. 다른 TTF·OTF·WOFF·WOFF2 파일을 선택해 주세요."),
    );
  }
}
async function Jo(e) {
  if (!e.font) return;
  const t = await e.font("pick");
  t &&
    (await Bs(t.data),
    await e.font("install", t.token),
    await e.setting("fontChoice", "custom"),
    (Wa = ""),
    (Ta = ""));
}
async function ei(e, t) {
  var o;
  const s =
      t.settings.fontChoice || (t.settings.customFont ? "custom" : "theme"),
    n = s + ":" + (((o = t.settings.customFont) == null ? void 0 : o.id) || "");
  if (n !== Wa) {
    Ta = "";
    try {
      const i = Aa.find((u) => u.id === s);
      let c;
      if (
        (i && (await document.fonts.load(`14px "${i.family}"`)),
        s === "custom" && t.settings.customFont && e.font)
      ) {
        const u = await e.font("read");
        if (!u || u.id !== t.settings.customFont.id) throw Error();
        c = await Bs(u.data);
      }
      (os(),
        (Wa = n),
        i
          ? document.documentElement.style.setProperty(
              "--custom-font",
              JSON.stringify(i.family),
            )
          : s === "system"
            ? document.documentElement.style.setProperty(
                "--custom-font",
                '"Segoe UI", "Malgun Gothic", sans-serif',
              )
            : c &&
              (document.fonts.add(c),
              (qa = c),
              document.documentElement.style.setProperty(
                "--custom-font",
                "WindowsillUserFont",
              )));
    } catch {
      ((Ta = a(
        "저장한 폰트를 불러오지 못해 기본 폰트를 사용해요. 파일을 다시 가져와 주세요.",
      )),
        os(),
        (Wa = ""));
    }
  }
}
const ti = {
  plants: [
    { id: 0, name: "문서", folder: "체험 정원 / 문서", xp: 12 },
    { id: 1, name: "사진", folder: "체험 정원 / 사진", xp: 25 },
    { id: 2, name: "보관", folder: "체험 정원 / 보관", xp: 4 },
  ],
  days: 7,
  total: 0,
  today: 0,
  ops: [],
  busy: !1,
  blocked: !1,
  progress: null,
  native: !1,
  platform: "browser",
  canClickThrough: !1,
  version: "0.6.19",
  settings: { theme: "sage", reducedMotion: !1, onboarded: !0 },
};
function ai() {
  let e = structuredClone(ti);
  try {
    const i = JSON.parse(localStorage.getItem("windowsill-demo-v1") || "null");
    ["0.1.0", "0.6.2", "0.6.12", "0.6.19"].includes(
      i == null ? void 0 : i.version,
    ) && (e = i);
  } catch {}
  e.version = "0.6.19";
  const t = new Set(),
    s = new Map(),
    n = () => {
      localStorage.setItem("windowsill-demo-v1", JSON.stringify(e));
      for (const i of t) i();
    };
  function o(i, c) {
    if (i.length > 20) throw Error("한 번에 20개까지 정리할 수 있어요.");
    const u = e.plants[c];
    if (!u.folder) throw Error("화분에 폴더를 먼저 연결해 주세요.");
    const d = {
      id: crypto.randomUUID(),
      plant: c,
      folder: u.folder,
      rows: i.map((r) => ({
        name: r,
        source: `체험 파일 / ${r}`,
        destination: `${u.folder} / ${r}`,
        status: "ready",
        reason: "",
      })),
    };
    return (s.set(d.id, d), d);
  }
  return {
    state: async () => structuredClone(e),
    renamePlant: async (i, c) => {
      const u = c.trim();
      if (
        !e.plants[i] ||
        !u ||
        Array.from(u).length > 12 ||
        /[\u0000-\u001f\u007f]/.test(u)
      )
        throw Error("화분 이름은 1~12자로 입력해 주세요.");
      ((e.plants[i].name = u), n());
    },
    bind: async (i, c) => {
      ((e.plants[i].name = c), (e.plants[i].folder = `체험 정원 / ${c}`), n());
    },
    pick: async (i) =>
      o(["오늘의 기록.txt", "아이디어 메모.md", "읽고 싶은 이야기.pdf"], i),
    drop: async (i, c) =>
      o(
        i.map((u) => u.name),
        c,
      ),
    execute: async (i) => {
      const c = s.get(i);
      if (!c) throw Error("파일을 다시 선택해 주세요.");
      (s.delete(i),
        (e.busy = !0),
        n(),
        await new Promise((d) => setTimeout(d, 450)));
      const u = c.rows.map((d) => {
        const r = e.today < 10 ? 1 : 0;
        ((e.today += r), (e.plants[c.plant].xp += r), e.total++);
        const f = {
          ...d,
          id: crypto.randomUUID(),
          plant: c.plant,
          status: "completed",
          error: "",
          reward: r,
          created: Date.now(),
        };
        return (e.ops.unshift(f), { ...d, id: f.id, status: "completed" });
      });
      return ((e.busy = !1), n(), { id: i, rows: u });
    },
    undo: async (i) => {
      const c = e.ops.find((u) => u.id === i);
      if (!c || c.status !== "completed")
        throw Error("되돌릴 수 없는 기록이에요.");
      ((c.status = "undone"),
        (e.plants[c.plant].xp -= c.reward),
        e.total--,
        n());
    },
    recover: async () => e,
    cancel: async () => {},
    setting: async (i, c) => {
      ((e.settings[i] = c), n());
    },
    openFolder: async () => {
      throw Error("브라우저 체험에서는 실제 폴더를 열지 않아요.");
    },
    widget: async () => {
      window.open(
        `${location.pathname}?widget=1`,
        "garden-widget",
        "width=180,height=100",
      );
    },
    manager: async () => {
      window.open(location.pathname, "garden-manager");
    },
    view: async () => {},
    quit: async () => {},
    subscribe: (i) => (t.add(i), () => t.delete(i)),
  };
}
const q = (e) =>
    String(e ?? "").replace(
      /[&<>"']/g,
      (t) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[t],
    ),
  da = (e, t, s = "", n = !1) =>
    `<button class="button ${n ? "primary" : "outline"}" data-action="ws-rules-${e}" ${s}>${q(t)}</button>`,
  is = (e) => e.normalize("NFC").toLocaleLowerCase(),
  rs = (e) => e.replace(/[\\/][^\\/]+$/, "");
let fa = "",
  bt = "",
  tt = "",
  He = 1,
  Ue = 1,
  Je = "attention";
function Rn() {
  ((fa = ""), (bt = ""), (tt = ""), (He = Ue = 1), (Je = "attention"));
}
function ni(e, t) {
  return ["ws-rules-query", "ws-rules-folder"].includes(e)
    ? (e === "ws-rules-query" ? (fa = t) : (bt = t),
      (He = Ue = 1),
      (tt = ""),
      !0)
    : !1;
}
function si(e, t) {
  return e.startsWith("rules-")
    ? (e === "rules-filter" &&
        ((Je = t.dataset.filter || "attention"), (Ue = 1)),
      e === "rules-family" && ((tt = t.dataset.family || ""), (He = 1)),
      e === "rules-candidates-page" &&
        (He = Math.max(1, Number(t.dataset.page) || 1)),
      e === "rules-checks-page" &&
        (Ue = Math.max(1, Number(t.dataset.page) || 1)),
      !0)
    : !1;
}
function oi(e) {
  const t = (...l) => !fa || l.some((g) => is(g).includes(is(fa))),
    s = e.candidates
      .map((l, g) => ({ ...l, index: g }))
      .filter(
        (l) => (!bt || l.scope === bt) && t(l.template, l.scope, ...l.examples),
      ),
    n = new Map();
  for (const l of s) {
    const g = n.get(l.template) || [];
    (g.push(l), n.set(l.template, g));
  }
  const o = [...n]
      .map(([l, g]) => ({
        template: l,
        items: g,
        count: g.reduce((z, A) => z + A.count, 0),
      }))
      .sort(
        (l, g) =>
          g.count - l.count ||
          l.template.length - g.template.length ||
          l.template.localeCompare(g.template),
      ),
    i = tt
      ? (n.get(tt) || []).sort(
          (l, g) => g.count - l.count || l.scope.localeCompare(g.scope),
        )
      : o,
    c = Math.max(1, Math.ceil(i.length / 8));
  He = Math.min(He, c);
  const u = e.rows.filter(
      (l) => (!bt || rs(l.path) === bt) && t(l.name, l.path),
    ),
    d = {
      attention: "확인 필요",
      all: "전체",
      match: "일치",
      mismatch: "불일치",
      review: "판단 보류",
      none: "규칙 없음",
      exception: "예외",
    },
    r = { all: u.length, attention: 0 };
  for (const l of u)
    ((r[l.status] = (r[l.status] || 0) + 1),
      ["mismatch", "review"].includes(l.status) && r.attention++);
  const f = (r.match || 0) + (r.mismatch || 0),
    b = u.filter(
      (l) =>
        Je === "all" ||
        (Je === "attention"
          ? ["mismatch", "review"].includes(l.status)
          : l.status === Je),
    ),
    j = Math.max(1, Math.ceil(b.length / 20));
  Ue = Math.min(Ue, j);
  const v = (l, g, z, A) =>
      `<nav class="rules-pagination" aria-label="${q(a(l === "candidates" ? "패턴 페이지" : "점검 페이지"))}">${da(l + "-page", a("이전"), `data-page="${g - 1}" ${g === 1 ? "disabled" : ""}`)}<span role="status">${g} / ${z} · ${q(a("전체"))} ${A}</span>${da(l + "-page", a("다음"), `data-page="${g + 1}" ${g === z ? "disabled" : ""}`)}</nav>`,
    T = [
      ...new Set([
        ...e.candidates.map((l) => l.scope),
        ...e.rows.map((l) => rs(l.path)),
      ]),
    ].sort(),
    I = i
      .slice((He - 1) * 8, He * 8)
      .map((l) =>
        tt
          ? `<article class="managed-row rule-candidate"><div><strong>${q(l.template)}</strong><small>${q(l.scope)}</small><small>${q(a("독립 표본"))} ${l.count} · ${q(l.examples.join(", "))}</small></div><button class="button outline" data-action="ws-approve-candidate" data-index="${l.index}">${q(a("내 규칙으로 사용"))}</button></article>`
          : `<article class="managed-row rule-family"><div><strong>${q(l.template)}</strong><small>${q(a("폴더"))} ${l.items.length} · ${q(a("폴더별 표본 합계"))} ${l.count}</small><small>${q(l.items[0].examples.join(", "))}</small></div>${da("family", a("범위 보기"), `data-family="${q(l.template)}"`)}</article>`,
      )
      .join(""),
    h = b
      .slice((Ue - 1) * 20, Ue * 20)
      .map(
        (l) =>
          `<article class="managed-row rule-check"><div><strong>${q(l.name)}</strong><small>${q(l.path)}</small><small>${q(a(l.reason))}</small></div><span>${q(a(d[l.status] || l.status))}</span>${l.rule ? `<button class="button outline" data-action="ws-exception" data-file="${q(l.id)}" data-enabled="${l.status === "exception" ? "0" : "1"}">${q(a(l.status === "exception" ? "예외 해제" : "예외로 지정"))}</button>` : ""}</article>`,
      )
      .join("");
  return `<section class="panel workspace-panel rules-browser"><h2>${q(a("이름 규칙 살펴보기"))}</h2><div class="rules-filters"><label>${q(a("이름·경로·패턴 검색"))}<input id="ws-rules-query" type="search" value="${q(fa)}"></label><label>${q(a("폴더 범위"))}<select id="ws-rules-folder"><option value="">${q(a("모든 폴더"))}</option>${T.map((l) => `<option value="${q(l)}" ${bt === l ? "selected" : ""}>${q(l === e.root.path ? a("관리 폴더") : l.slice(e.root.path.length + 1))}</option>`).join("")}</select></label></div><p class="subtle">${q(a("폴더 필터는 선택한 폴더 바로 아래 파일에 적용돼요."))}</p></section>
 <section class="panel workspace-panel rules-candidates"><h2>${q(a("발견한 이름 패턴"))} <small>${o.length}</small></h2><p>${q(a("같은 패턴을 묶었어요. 범위를 확인한 뒤 폴더별로 승인해 주세요."))}</p>${tt ? `<div class="workspace-actions">${da("family", a("모든 패턴 보기"))}<strong>${q(tt)}</strong></div>` : ""}${I || `<p>${q(a("조건에 맞는 새 패턴이 없어요."))}</p>`}${v("candidates", He, c, i.length)}</section>
 <section class="panel workspace-panel rules-checks"><h2>${q(a("규칙 점검"))}</h2>${f ? `<p class="rules-match-rate">${q(a("일치"))} ${r.match || 0} / ${f} · ${Math.round(((r.match || 0) / f) * 100)}%</p>` : ""}<p>${q(a("불일치·판단 보류를 먼저 보여요. 규칙 없는 파일은 오류가 아니에요."))}</p><p class="subtle">${q(a("형식의 일치 여부이며 내용의 정확도가 아니에요."))}</p><div class="workspace-actions">${Object.entries(
   d,
 )
   .map(([l, g]) =>
     da(
       "filter",
       `${a(g)} ${r[l] || 0}`,
       `data-filter="${l}" aria-pressed="${Je === l}"`,
       Je === l,
     ),
   )
   .join(
     "",
   )}</div>${h || `<p class="rules-empty">${q(a(Je === "attention" ? "확인이 필요한 파일이 없어요. 다른 상태를 선택해 목록을 볼 수 있어요." : "조건에 맞는 파일이 없어요."))}</p>`}${v("checks", Ue, j, b.length)}</section>`;
}
const ee = (e) =>
    String(e ?? "").replace(
      /[&<>"']/g,
      (t) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[t],
    ),
  at = (e) => e.split(/[\\/]/).pop() || e,
  $n = {
    new_folder: "새 폴더 승인 필요",
    excluded: "제외",
    indexing: "목록 확인 중",
    analyzing: "추천 분석 중",
    review: "추천 확인",
    paused: "일시정지",
    executing: "파일 이동 중",
    done: "이동 처리 완료",
    partial: "일부 확인 필요",
    failed: "분석 실패",
    suggested: "이동 제안",
    keep: "이번에는 유지",
    blocked: "확인 필요",
    needs_review: "복구 확인 필요",
    completed: "이동 완료",
    undone: "되돌림",
    queued: "대기",
    running: "이동 중",
  };
let ve,
  Rt,
  ma = !1,
  Tt = "",
  st = "",
  ga = !1,
  Ce = "",
  X = null,
  va = [],
  we = [0],
  Ln = "changes",
  Tn = 20,
  Nt = "",
  ka = "",
  Dn = [],
  fe = !1,
  yt = !1,
  Sa = "";
const Hs = {
    existing: ["내 폴더 구조 활용", "승인한 규칙과 과거 선택을 활용해요."],
    type: ["파일 종류로 나누기", "문서·이미지·영상·음악·압축으로 나눠요."],
    name: ["이름의 단어로 나누기", "단어와 목적지를 직접 연결해요."],
    date: ["날짜로 나누기", "파일명 속 날짜를 연도와 월로 나눠요."],
  },
  Fa = () => ({
    mode: "existing",
    remember: !1,
    protect: !0,
    exclusions: [],
    targets: {
      documents: "문서",
      images: "이미지",
      video: "영상",
      audio: "음악",
      archives: "압축",
    },
    terms: [{ word: "", folder: "" }],
  });
let ae = Fa(),
  Lt = "",
  kn = "",
  Vt = "",
  Us = !0,
  ls,
  Ys = !1;
function ii(e, t) {
  ((ve = e), (Rt = t));
}
function Ws() {
  return ma;
}
async function ri(e, t) {
  var n, o;
  Ys = ((n = e.tutorial) == null ? void 0 : n.status) === "active";
  const s = (o = e.managed) == null ? void 0 : o.roots.find((i) => i.id === t);
  ((Lt = (s == null ? void 0 : s.path) || ""),
    (Us = !!(s != null && s.active)),
    Tt !== t &&
      ((Tt = t),
      (ma = !1),
      (Ce = ""),
      (X = null),
      (we = [0]),
      (Nt = ""),
      (Sa = "")),
    (Tn = e.settings.searchPageSize || 20),
    !(!ve.manage || !t) &&
      ((va = await ve.manage("organize-list", t)),
      Ce &&
        (X = await ve.manage("organize-page", Ce, {
          after: we.at(-1),
          size: Tn,
          filter: Ln,
          destination: Vt,
        }))));
}
const he = (e, t, s = "", n = !1) =>
  `<button class="button ${n ? "primary" : "outline"}" data-action="ws-org-${e}" ${s}>${a(t)}</button>` +
  (e === "close" && Ys
    ? `<button class="button outline" data-action="nav" data-page="tutorial">${a("첫 정리 튜토리얼")}</button>`
    : "");
function li() {
  const e = va.find((t) =>
    ["indexing", "analyzing", "executing"].includes(t.state),
  );
  return he(
    e ? "job" : "open",
    e ? "정리 진행 보기" : "폴더 정리",
    e ? `data-job="${ee(e.id)}"` : Us ? "" : "disabled",
    !0,
  );
}
function di() {
  return `<div class="organize-entry">${va.length ? `<details data-disclosure="organize-jobs"><summary>${a("정리 계획")} ${va.length}</summary>${va.map((e) => `<button class="organize-job" data-action="ws-org-job" data-job="${ee(e.id)}"><strong>${ee(at(e.scope))}</strong><span>${a($n[e.state] || e.state)}</span></button>`).join("")}</details>` : ""}</div>`;
}
function ci() {
  return `<ol class="organize-steps"><li>${a("범위 확인")}</li><li>${a("기준 고르기")}</li><li>${a("결과 확인 후 이동")}</li></ol><div class="organize-setup"><section class="organize-scope"><h3>${a("정리할 범위")}</h3><label for="org-scope">${a("현재 보고 있는 위치")}</label><select id="org-scope">${[...new Set([kn, Lt])].map((e) => `<option value="${ee(e)}" ${st === e ? "selected" : ""}>${ee(e === Lt ? at(e) : at(Lt) + " / " + e.slice(Lt.length + 1))}</option>`).join("")}</select><label class="organize-check"><input id="org-recursive" type="checkbox" ${ga ? "checked" : ""}>${a("하위 폴더 포함")}</label><p>${a("검색어와 현재 페이지는 정리 범위를 제한하지 않아요.")}</p><label class="organize-check"><input id="org-protect" type="checkbox" ${ae.protect ? "checked" : ""}>${a("프로젝트·앱 경로 보호")}</label><small>${a("해제하면 경로를 참조하는 프로젝트가 영향을 받을 수 있어요.")}</small><label for="org-exclusions">${a("그대로 둘 하위 폴더 · 한 줄에 하나")}</label><textarea id="org-exclusions" placeholder="project/archive">${ee(
    ae.exclusions.join(`
`),
  )}</textarea></section><section><h3>${a("어떤 기준으로 나눌까요?")}</h3><div class="organize-policies">${Object.entries(
    Hs,
  )
    .map(
      ([e, [t, s]]) =>
        `<button class="organize-policy" data-action="ws-org-policy" data-mode="${e}" aria-pressed="${ae.mode === e}"><strong>${a(t)}</strong><small>${a(s)}</small></button>`,
    )
    .join("")}</div>${
    ae.mode === "type"
      ? `<div class="organize-targets">${Object.entries(Fa().targets)
          .map(
            ([e, t]) =>
              `<label>${a(t)}<input data-policy-target="${e}" value="${ee(ae.targets[e])}" aria-label="${a(t)} ${a("목적지")}"></label>`,
          )
          .join("")}</div>`
      : ae.mode === "name"
        ? `<div class="organize-terms">${ae.terms.map((e, t) => `<div><input data-term-word="${t}" value="${ee(e.word)}" placeholder="${a("이름에 포함할 단어")}"><span>→</span><input data-term-folder="${t}" value="${ee(e.folder)}" placeholder="${a("목적지 하위 폴더")}">${he("term-remove", "삭제", `data-index="${t}"`)}</div>`).join("")}${he("term-add", "단어 추가")}</div>`
        : ae.mode === "date"
          ? `<p class="organize-policy-note">${a("파일명 날짜 YYYY-MM-DD 또는 YYYYMMDD만 사용해요. 날짜가 없거나 여러 개면 직접 확인해요.")}</p>`
          : `<p class="organize-policy-note">${a("현재 배치를 정답으로 학습하지 않아요. 모호한 파일은 직접 확인해요.")}</p>`
  }<p class="subtle">${a("목적지는 관리 폴더 기준 상대 경로예요. 없는 폴더는 미리보기에서 생성 승인이 필요해요.")}</p><label class="organize-check"><input id="org-remember" type="checkbox" ${ae.remember ? "checked" : ""}>${a("이 범위에서 다음에도 이 기준 사용")}</label><small>${a("체크하지 않으면 이번만 정리하고 추천 학습에 남기지 않아요.")}</small></section></div><div class="organize-confirm"><p>${a("먼저 예상 결과를 확인해요. 분석만으로 파일을 옮기지 않아요.")}</p>${he("start", "예상 결과 보기", fe ? "disabled" : "", !0)}</div>`;
}
function hi() {
  var i, c, u, d;
  const e = X == null ? void 0 : X.job,
    t = (e == null ? void 0 : e.state) === "review",
    s = e && ["indexing", "analyzing", "executing"].includes(e.state),
    n = (X == null ? void 0 : X.counts) || {},
    o = (r) =>
      r === e.root_path
        ? at(r)
        : r.startsWith(e.root_path)
          ? r.slice(e.root_path.length + 1)
          : r;
  return m`<section class="panel organize-panel"><div class="organize-heading"><div><span class="eyebrow">FOLDER ORGANIZE</span><h2>폴더 정리</h2><p>${ee(e ? at(e.root_path) + (e.scope === e.root_path ? "" : " / " + e.scope.slice(e.root_path.length + 1)) : at(st))}</p></div>${he("close", "내 파일로")}</div>${Sa ? `<p role="alert" class="inline-warning">${ee(Sa)}</p>` : ""}${
    e
      ? ` <div class="organize-status" role="status"><strong>${a($n[e.state] || e.state)}</strong><span>${a("목록 확인")} ${e.observed} · ${a("이동 제안")} ${n.suggested || 0} · ${a("유지")} ${n.keep || 0} · ${a("확인 필요")} ${(n.review || 0) + (n.blocked || 0) + (n.failed || 0) + (n.needs_review || 0) + (n.new_folder || 0)}</span></div>
 ${e.policy ? `<p class="organize-policy-note">${a(((i = Hs[JSON.parse(e.policy).mode]) == null ? void 0 : i[0]) || "내 폴더 구조 활용")} · ${JSON.parse(e.policy).remember ? a("다음에도 사용") : a("이번만 정리")} · ${a("제외")} ${n.excluded || 0}</p>` : ""}
 ${(c = X.groups) != null && c.length ? `<label for="org-group">${a("목적지별 보기")}</label><select id="org-group"><option value="">${a("전체")}</option>${X.groups.map((r) => `<option value="${ee(r.destination)}" ${Vt === r.destination ? "selected" : ""}>${ee(o(r.destination))} · ${r.n}</option>`).join("")}</select>` : ""}
 ${
   t
     ? (u = X.folders) == null
       ? void 0
       : u
           .filter((r) => r.n > 0)
           .map(
             (r) =>
               `<div class="organize-new-folder"><div><strong>${a("새 폴더")} · ${ee(o(r.path))}</strong><small>${r.n}${a("개")} · ${a("승인 전에는 만들거나 옮기지 않아요.")}</small></div>${he("folder-approve", r.approved ? "생성 승인 취소" : "폴더 생성 승인", `data-path="${ee(r.path)}" data-approved="${r.approved ? "0" : "1"}" ${fe ? "disabled" : ""}`)}</div>`,
           )
           .join("")
     : ""
 }
 ${e.issues ? m`<p class="inline-warning">확인하지 못한 항목 ${e.issues}개가 있어요. 연결 경로·권한·깊이 제한 등을 확인해 주세요. 해당 항목은 실행하지 않아요.</p>` : ""}
 ${e.error ? `<p class="inline-warning">${ee(e.error)}</p>` : ""}
 <div class="organize-toolbar">${["changes", "all", "issues"].map((r) => he("filter", { changes: "변경 제안", all: "전체", issues: "확인 필요" }[r], `data-filter="${r}" aria-pressed="${Ln === r}"`)).join("")}${s ? he("pause", "일시정지", fe ? "disabled" : "") : e.state === "paused" ? he("resume", "확인하고 계속", fe ? "disabled" : "") : ["done", "partial"].includes(e.state) ? he("review", "남은 항목 검토") : ""}${he("reset", "새로 분석", s || fe ? "disabled" : "")}</div>
 ${t ? `<div class="organize-selection">${he("all", "추천 항목 전체 선택", fe ? "disabled" : "")}${he("none", "선택 해제", fe ? "disabled" : "")}<strong>${a("선택")} ${X.selected}</strong><small>${a("현재 계획의 모든 페이지에 적용해요.")}</small></div>` : ""}
 <div class="organize-list">${X.items.map((r) => `<article class="organize-row"><div class="organize-file">${t && r.state === "suggested" ? he("select", r.selected ? "☑" : "☐", `data-item="${ee(r.id)}" data-selected="${r.selected ? "0" : "1"}" aria-pressed="${!!r.selected}" aria-label="${ee(at(r.source))} ${a("선택")}" ${fe ? "disabled" : ""}`) : '<span class="organize-dot">·</span>'}<div><strong>${ee(at(r.source))}</strong><small>${ee(o(r.source.slice(0, Math.max(r.source.lastIndexOf("/"), r.source.lastIndexOf("\\")))))}</small></div></div><div class="organize-target"><span>→ ${r.destination ? ee(o(r.destination)) : a("위치 직접 선택")}</span><small>${a($n[r.state] || r.state)} · ${ee(a(r.reason))}</small></div>${t && ["suggested", "review", "blocked", "failed", "keep", "new_folder"].includes(r.state) ? he("destination", "위치 선택", `data-item="${ee(r.id)}" ${fe ? "disabled" : ""}`) : ""}${r.operation && r.state === "completed" ? he("undo", "되돌리기", `data-operation="${ee(r.operation)}" ${fe ? "disabled" : ""}`) : ""}</article>`).join("") || `<p class="organize-empty">${a(s ? "분석한 항목부터 표시해요. 화면을 닫아도 계속돼요." : "이 목록에 표시할 항목이 없어요.")}</p>`}</div>
 ${Nt ? `<div class="organize-picker"><label for="org-folder-query">${a("목적지 폴더 검색")}</label><input id="org-folder-query" value="${ee(ka)}" placeholder="${a("폴더 이름 또는 경로")}"><div>${Dn.map((r) => he("choose", ee(o(r)), `data-path="${ee(r)}" ${fe ? "disabled" : ""}`)).join("") || a("검색 결과가 없어요.")}</div><small>${a("최대 50개 표시 · 검색으로 좁혀 주세요.")}</small>${he("picker-close", "닫기")}</div>` : ""}
 <div class="organize-pagination">${he("prev", "이전", we.length < 2 || fe ? "disabled" : "")}<span>${we.length} ${a("페이지")} · ${Tn}${a("개씩")}</span>${he("next", "다음", !X.hasNext || fe ? "disabled" : "")}</div>
 ${t ? `<div class="organize-confirm">${e.issues ? `<label><input id="org-partial" type="checkbox" ${yt ? "checked" : ""}>${a("확인하지 못한 항목을 제외하고 진행")}</label>` : ""}<p>${a("선택한 파일을 이동해요. 버전 보관은 백그라운드에서 진행돼요.")}</p>${he("approve", m`선택한 ${X.selected}개 이동`, fe || !X.selected || (e.issues && !yt) ? "disabled" : "", !0)}</div>` : ""}
 ${["done", "partial", "paused", "executing"].includes(e.state) ? `<p class="organize-result">${a("이동 완료")} ${n.completed || 0} · ${a("버전 보관 완료")} ${((d = X.stored.find((r) => r.status === "completed")) == null ? void 0 : d.n) || 0} · ${a("보관 대기")} ${X.stored.filter((r) => ["queued", "running"].includes(r.status)).reduce((r, f) => r + f.n, 0)}</p>` : ""}`
      : ci() + di()
  }</section>`;
}
async function ui(e, t, s) {
  if (!fe) {
    ((Sa = ""), (fe = !0));
    try {
      e === "open"
        ? ((ma = !0),
          (st = kn = s || Lt),
          (Ce = ""),
          (X = null),
          (we = [0]),
          (yt = !1),
          (Vt = ""),
          (ga = !1),
          (ae = (await ve.manage("organize-policy", Tt, st)) || Fa()),
          ae.terms.length || (ae.terms = [{ word: "", folder: "" }]))
        : e === "close"
          ? ((ma = !1), (Nt = ""))
          : e === "start"
            ? ((Ce = await ve.manage("organize-start", Tt, {
                scope: st,
                recursive: ga,
                policy: {
                  ...ae,
                  terms: ae.terms.filter(
                    (n) => n.word.trim() || n.folder.trim(),
                  ),
                },
              })),
              (we = [0]))
            : e === "job"
              ? ((Ce = t.dataset.job),
                (we = [0]),
                (Vt = ""),
                (ma = !0),
                (yt = !1))
              : e === "reset"
                ? ((st = kn = X.job.scope),
                  (ga = !!X.job.recursive),
                  (ae = X.job.policy ? JSON.parse(X.job.policy) : Fa()),
                  (Vt = ""),
                  (Ce = ""),
                  (X = null),
                  (we = [0]),
                  (yt = !1))
                : e === "policy"
                  ? (ae.mode = t.dataset.mode)
                  : e === "term-add"
                    ? ae.terms.length < 30 &&
                      ae.terms.push({ word: "", folder: "" })
                    : e === "term-remove"
                      ? ae.terms.splice(Number(t.dataset.index), 1)
                      : e === "folder-approve"
                        ? await ve.manage("organize-folder-approve", Ce, {
                            path: t.dataset.path,
                            approved: t.dataset.approved === "1",
                            revision: X.job.revision,
                          })
                        : e === "filter"
                          ? ((Ln = t.dataset.filter), (we = [0]))
                          : e === "next"
                            ? we.push(X.next)
                            : e === "prev"
                              ? we.length > 1 && we.pop()
                              : ["all", "none", "select"].includes(e)
                                ? await ve.manage("organize-select", Ce, {
                                    item:
                                      e === "select" ? t.dataset.item : null,
                                    selected:
                                      e === "all" ||
                                      (e === "select" &&
                                        t.dataset.selected === "1"),
                                    revision: X.job.revision,
                                  })
                                : e === "destination"
                                  ? ((Nt = t.dataset.item),
                                    (ka = ""),
                                    (Dn = await ve.manage(
                                      "organize-folders",
                                      Tt,
                                      ka,
                                    )))
                                  : e === "picker-close"
                                    ? (Nt = "")
                                    : e === "choose"
                                      ? (await ve.manage(
                                          "organize-destination",
                                          Ce,
                                          {
                                            item: Nt,
                                            destination: t.dataset.path,
                                            revision: X.job.revision,
                                          },
                                        ),
                                        (Nt = ""))
                                      : e === "approve"
                                        ? await ve.manage(
                                            "organize-approve",
                                            Ce,
                                            {
                                              revision: X.job.revision,
                                              acceptPartial: yt,
                                            },
                                          )
                                        : [
                                              "pause",
                                              "resume",
                                              "review",
                                            ].includes(e)
                                          ? await ve.manage(`organize-${e}`, Ce)
                                          : e === "undo" &&
                                            (await ve.undo(t.dataset.operation),
                                            await ve.manage(
                                              "organize-review",
                                              Ce,
                                            ));
    } catch (n) {
      Sa = n instanceof Error ? n.message : a("다시 시도해 주세요.");
    } finally {
      ((fe = !1), await Rt());
    }
  }
}
async function pi(e) {
  (e.id === "org-scope" &&
    ((st = e.value),
    (ae = (await ve.manage("organize-policy", Tt, st)) || Fa()),
    await Rt()),
    e.id === "org-group" && ((Vt = e.value), (we = [0]), await Rt()),
    e.id === "org-protect" && (ae.protect = e.checked),
    e.id === "org-remember" && (ae.remember = e.checked),
    e.id === "org-exclusions" &&
      (ae.exclusions = e.value
        .split(/\r?\n/)
        .map((t) => t.trim())
        .filter(Boolean)),
    e.dataset.policyTarget && (ae.targets[e.dataset.policyTarget] = e.value),
    e.dataset.termWord !== void 0 &&
      (ae.terms[Number(e.dataset.termWord)].word = e.value),
    e.dataset.termFolder !== void 0 &&
      (ae.terms[Number(e.dataset.termFolder)].folder = e.value),
    e.id === "org-recursive" && (ga = e.checked),
    e.id === "org-partial" && ((yt = e.checked), await Rt()),
    e.id === "org-folder-query" &&
      ((ka = e.value),
      clearTimeout(ls),
      (ls = setTimeout(() => {
        (async () => {
          try {
            ((Dn = await ve.manage("organize-folders", Tt, ka)), await Rt());
          } catch {}
        })();
      }, 200))));
}
const Dt = (e) =>
  String(e ?? "").replace(
    /[&<>"']/g,
    (t) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        t
      ],
  );
let Gt = "",
  Qt = "",
  Kt = "",
  Ea = null,
  aa = "",
  We = !1,
  en = !1,
  Pt = 0;
function ba() {
  ((Gt = ""),
    (Qt = ""),
    (Kt = ""),
    (Ea = null),
    (aa = ""),
    (We = !1),
    (en = !1),
    Pt++);
}
function fi(e) {
  const t = e.versions;
  if (t.length < 2)
    return `<p class="subtle">${a("비교하려면 보관된 버전이 두 개 이상 필요해요.")}</p>`;
  Gt !== e.file.id && (ba(), (Gt = e.file.id), (Qt = t[1].id), (Kt = t[0].id));
  const s = (n) =>
    t
      .map(
        (o) =>
          `<option value="${Dt(o.id)}" ${n === o.id ? "selected" : ""}>v${o.seq}</option>`,
      )
      .join("");
  return m`<section class="version-comparison"><h3>변경 내용 비교</h3><div class="compare-picker"><label>이전 버전<select id="ws-compare-from" ${We ? "disabled" : ""}>${s(Qt)}</select></label><span aria-hidden="true">→</span><label>비교할 버전<select id="ws-compare-to" ${We ? "disabled" : ""}>${s(Kt)}</select></label><button class="button outline" data-action="ws-compare-run" ${We || Qt === Kt ? "disabled" : ""}>${a(We ? "비교 중…" : "변경 내용 보기")}</button></div><p class="subtle">보관된 UTF-8 텍스트만 비교해요. 현재 파일은 바뀌지 않아요.</p>${aa ? `<p role="alert">${Dt(a(aa))}</p>` : ""}${Ea ? mi(Ea, en) : ""}</section>`;
}
function mi(e, t = !1) {
  const s = new Set();
  e.rows.forEach((c, u) => {
    if (c.kind !== "equal")
      for (
        let d = Math.max(0, u - 3);
        d <= Math.min(e.rows.length - 1, u + 3);
        d++
      )
        s.add(d);
  });
  let n = 0;
  const o = [],
    i = () => {
      n &&
        (o.push(`<div class="diff-gap">${Dt(m`변경 없는 ${n}줄 생략`)}</div>`),
        (n = 0));
    };
  return (
    e.rows.forEach((c, u) => {
      if (!t && !s.has(u)) {
        n++;
        return;
      }
      (i(),
        o.push(
          `<div class="diff-line ${Dt(c.kind)}"><span class="diff-number">${c.oldLine ?? ""}</span><span class="diff-number">${c.newLine ?? ""}</span><b aria-label="${Dt(a(c.kind === "add" ? "추가" : c.kind === "remove" ? "삭제" : "유지"))}">${c.kind === "add" ? "+" : c.kind === "remove" ? "−" : " "}</b><code>${Dt(c.text) || " "}</code></div>`,
        ));
    }),
    i(),
    m`<div class="diff-result"><p><strong>v${e.from.seq} → v${e.to.seq}</strong> · ${m`추가 ${e.added}줄 · 삭제 ${e.removed}줄`}</p>${e.identical ? m`<p>두 버전의 내용이 같아요.</p>` : ""}${e.lineEndingChanged ? m`<p>줄바꿈 방식이 달라요. 줄 내용은 정규화해서 비교했어요.</p>` : ""}<button class="button small outline" data-action="ws-compare-context">${a(t ? "변경한 부분만 보기" : "전체 줄 보기")}</button><div class="diff-lines" tabindex="0" role="region" aria-label="${a("버전 변경 내용")}">${o.join("")}</div></div>`
  );
}
async function gi(e, t, s) {
  if (e === "compare-context") {
    ((en = !en), await s());
    return;
  }
  if (We || !Gt || !t.manage) return;
  const n = ++Pt,
    o = Gt,
    i = Qt,
    c = Kt;
  ((We = !0), (aa = ""), await s());
  try {
    const u = await t.manage("compareVersions", o, i, c);
    n === Pt && Gt === o && (Ea = u);
  } catch (u) {
    n === Pt &&
      (aa =
        u instanceof Error
          ? u.message
          : a("비교하지 못했어요. 다시 시도해 주세요."));
  } finally {
    (n === Pt && (We = !1), await s());
  }
}
async function vi(e, t, s) {
  (e === "ws-compare-from" ? (Qt = t) : (Kt = t),
    Pt++,
    (We = !1),
    (Ea = null),
    (aa = ""),
    await s());
}
const be = (e) =>
  String(e ?? "").replace(
    /[&<>"']/g,
    (t) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        t
      ],
  );
let tn = "",
  Na = "",
  _t = "",
  Xt = "",
  Zt = "",
  an = "",
  Bt = !1,
  zt = !1,
  nt = "",
  ke = null,
  ft = 0;
function bi(e, t) {
  var o;
  tn !== e &&
    ((tn = e),
    (Na = ""),
    (_t = ""),
    (Xt = ""),
    (Zt = t.root.path),
    (an = ""),
    (Bt = !1),
    (zt = !1),
    (nt = ""),
    (ke = null),
    ft++);
  const s = t.routing || [],
    n = t.folders || [t.root.path];
  return m`<section class="panel workspace-panel routing-panel"><h2>정리 위치 추천</h2><p>직접 만든 분류 규칙을 먼저 보고, 같은 확장자의 선택 이력과 이름을 함께 확인해요. 자동으로 파일을 옮기지는 않아요.</p><div class="route-test"><label for="ws-route-filename">파일명으로 추천 시험</label><input id="ws-route-filename" value="${be(an)}" placeholder="거래처_계약서_20260926.pdf" maxlength="200"><button class="button outline" data-action="ws-route-test" ${zt ? "disabled" : ""}>추천 확인</button></div>${
    ke
      ? m`<div class="route-preview" role="status"><strong>${ke.confidence === "conflict" ? a("규칙이 충돌해요. 직접 위치를 선택해 주세요.") : ke.confidence === "clear" ? a("추천 근거가 뚜렷해요. 실행 전 위치를 확인해 주세요.") : a("추천 근거가 부족해요. 직접 위치를 선택해 주세요.")}</strong>${ke.candidates
          .map((i) => {
            var c;
            return `<p><b>${be(i.folder.replace(t.root.path, "") || a("(전체 폴더)"))}</b><small>${be(a(i.reason))}${(c = i.matches) != null && c.length ? " · " + be(i.matches.join(", ")) : ""}</small></p>`;
          })
          .join(
            "",
          )}${(o = ke.folderNames) != null && o.length ? m`<details><summary>새 폴더명 후보</summary><p>${ke.folderNames.map(be).join(" · ")}</p><small>파일명 단어에서 만든 후보예요. 폴더를 자동으로 만들지는 않아요.</small></details>` : ""}</div>`
      : ""
  }${nt ? `<p role="status">${be(a(nt))}</p>` : ""}<div class="workspace-actions"><button class="button primary" data-action="ws-route-new">분류 규칙 추가</button></div>${s.map((i) => m`<article class="managed-row"><div><strong>${i.keywords.map(be).join(" + ")}${i.extension ? " · ." + be(i.extension) : ""}</strong><small>→ ${be(i.folder.replace(t.root.path, "") || a("(전체 폴더)"))}</small><span>${i.enabled ? a("사용 중") : a("중지됨")}</span></div><div class="workspace-actions"><button class="button small outline" data-action="ws-route-edit" data-id="${be(i.id)}">수정</button><button class="button small outline" data-action="ws-route-toggle" data-id="${be(i.id)}" ${zt ? "disabled" : ""}>${i.enabled ? a("사용 중지") : a("다시 사용")}</button></div></article>`).join("")}${Bt ? m`<div class="route-editor"><h3>${a(Na ? "분류 규칙 수정" : "분류 규칙 추가")}</h3><label for="ws-route-keywords">파일명에 포함할 단어</label><input id="ws-route-keywords" value="${be(_t)}" placeholder="계약서, 거래처" maxlength="204"><small>쉼표로 구분한 단어가 모두 들어간 파일에 적용해요.</small><label for="ws-route-extension">확장자 · 비워 두면 전체</label><input id="ws-route-extension" value="${be(Xt)}" placeholder="pdf" maxlength="13"><label for="ws-route-folder">추천할 폴더</label><select id="ws-route-folder">${n.map((i) => `<option value="${be(i)}" ${Zt === i ? "selected" : ""}>${be(i.replace(t.root.path, "") || a("(전체 폴더)"))}</option>`).join("")}</select><div class="workspace-actions"><button class="button primary" data-action="ws-route-save" ${zt ? "disabled" : ""}>규칙 저장</button><button class="button outline" data-action="ws-route-cancel">취소</button></div></div>` : ""}</section>`;
}
function Ni(e, t) {
  (e === "ws-route-keywords" && (_t = t),
    e === "ws-route-extension" && (Xt = t),
    e === "ws-route-folder" && (Zt = t),
    e === "ws-route-filename" && ((an = t), (ke = null)));
}
async function Ci(e, t, s, n, o) {
  if (!zt) {
    if (e === "route-new")
      ((Na = ""),
        (_t = ""),
        (Xt = ""),
        (Zt = s.root.path),
        (Bt = !0),
        (nt = ""));
    else if (e === "route-cancel") Bt = !1;
    else if (e === "route-edit") {
      const i = s.routing.find((c) => c.id === t.dataset.id);
      i &&
        ((Na = i.id),
        (_t = i.keywords.join(", ")),
        (Xt = i.extension),
        (Zt = i.folder),
        (Bt = !0),
        (nt = ""));
    } else {
      const i = ++ft,
        c = tn;
      ((zt = !0), (nt = ""), await o());
      try {
        if (e === "route-test") {
          const u = await n.manage("testRecommendation", c, an);
          i === ft && tn === c && (ke = u);
        }
        if (
          (e === "route-save" &&
            (await n.manage("saveRouting", c, {
              id: Na,
              keywords: _t,
              extension: Xt,
              folder: Zt,
            }),
            i === ft &&
              ((Bt = !1), (ke = null), (nt = "분류 규칙을 저장했어요."))),
          e === "route-toggle")
        ) {
          const u = s.routing.find((d) => d.id === t.dataset.id);
          (await n.manage("toggleRouting", c, u.id, !u.enabled),
            i === ft && (ke = null));
        }
      } catch (u) {
        i === ft &&
          (nt = u instanceof Error ? u.message : "규칙을 확인해 주세요.");
      } finally {
        i === ft && (zt = !1);
      }
    }
    await o();
  }
}
const Qe = (e) =>
  e === null
    ? a("확인할 수 없음")
    : e < 1024 ** 2
      ? `${Math.ceil(e / 1024)} KiB`
      : e < 1024 ** 3
        ? `${(e / 1024 ** 2).toLocaleString(Fe(), { maximumFractionDigits: 1 })} MiB`
        : `${(e / 1024 ** 3).toLocaleString(Fe(), { maximumFractionDigits: 2 })} GiB`;
let Ca = null,
  kt = 0,
  Va = !1,
  ot = "";
let archiveDestination = null;
const ds = (e) =>
  String(e ?? "").replace(
    /[&<>"']/g,
    (t) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        t
      ],
  );
async function wi(e, t) {
  if (!(!t.native || !e.manage) && !Ca && !ot)
    try {
      ((Ca = await e.manage("storage")), (kt = Ca.budget / 1024 ** 3));
    } catch (s) {
      ot = s instanceof Error ? s.message : a("저장소를 확인하지 못했어요.");
    }
}
async function yi(e, t, s) {
  if (!(Va || !t.manage)) {
    ((Va = !0), (ot = ""), await s());
    try {
      const n = await t.manage(
        e === "compact"
          ? "storage-compact"
          : e === "budget"
            ? "storage-budget"
            : "storage",
        kt,
      );
      ((Ca = n),
        e === "compact" && (ot = m`압축 완료 · ${Qe(n.saved)} 줄었어요.`),
        e === "budget" &&
          (ot = a("한도를 저장했어요. 보관 대기 파일을 다시 확인해요.")),
        e === "refresh" && (kt = n.budget / 1024 ** 3));
    } catch (n) {
      ot = n instanceof Error ? n.message : a("저장소를 확인하지 못했어요.");
    } finally {
      ((Va = !1), await s());
    }
  }
}
async function changeArchiveLocation(action, api, redraw) {
  if (Va) return;
  if (action === "location-cancel") {
    archiveDestination = null;
    await redraw();
    return;
  }
  Va = true;
  ot = "";
  try {
    await redraw();
    if (action === "location-pick") {
      archiveDestination = await api.manage("storage-pick-directory");
    } else if (action === "location-move" && archiveDestination) {
      const token = archiveDestination.token;
      archiveDestination = null;
      await redraw();
      Ca = await api.manage("storage-move", token);
      ot = a("기존 버전을 새 보관 위치로 옮겼어요.");
    }
  } catch (error) {
    ot = error instanceof Error ? error.message : a("저장소를 확인하지 못했어요.");
  } finally {
    Va = false;
    await redraw();
  }
}
function archiveLocationPanel(storage, disabled) {
  if (!storage.location) return "";
  return m`<section class="panel storage-panel">
    <h2>버전 보관 위치</h2>
    <p class="path-box">${ds(storage.location)}</p>
    <p>선택한 드라이브나 폴더 안에 보관소를 만들어요. 기존 버전도 함께 옮겨요.</p>
    <button type="button" class="button outline" data-action="ws-storage-location-pick" ${disabled}>위치 선택</button>
    ${archiveDestination ? m`<div><p class="path-box">${ds(archiveDestination.path)}</p>
      <button type="button" class="button primary" data-action="ws-storage-location-move" ${disabled}>이 위치로 보관소 옮기기</button>
      <button type="button" class="button outline" data-action="ws-storage-location-cancel" ${disabled}>취소</button>
    </div>` : ""}
    ${storage.locationCleanupPending ? m`<p role="status">새 보관 위치를 사용 중이에요. 이전 보관소의 공간 정리는 다음 실행 때 다시 시도해요.</p>` : ""}
  </section>`;
}
function zi(e) {
  kt = Number(e);
}
function ji(e) {
  var i;
  const t = Ca,
    s = Va || ((i = e.managed) == null ? void 0 : i.storageWorking),
    n = s ? "disabled" : "";
  if (!e.native)
    return m`<h1>보관 공간</h1><p>보관 공간 관리는 데스크톱 앱에서 사용할 수 있어요.</p>`;
  if (!t)
    return m`<h1>보관 공간</h1><p role="status">${ds(ot || a("사용량을 확인하고 있어요."))}</p><button class="button outline" data-action="ws-storage-refresh" ${n}>새로 확인</button>`;
  const o = Math.min(100, Math.round((t.used / t.budget) * 100));
  return m`<div class="section-heading"><div><span class="eyebrow">YOUR FILES, KEPT CLOSE</span><h1>보관 공간</h1><p>이전 내용을 보관하는 데 쓰는 이 컴퓨터의 공간이에요.</p></div><button class="button outline" data-action="ws-storage-refresh" ${n}>새로 확인</button></div><section class="panel storage-panel"><div class="storage-total"><strong>${Qe(t.used)}</strong><span>보관 한도 ${Qe(t.budget)} 중 사용</span></div><progress max="100" value="${o}" aria-label="보관 공간 사용률"></progress><div class="storage-stats"><div><span>한도 내 남은 공간</span><strong>${Qe(t.remaining)}</strong></div><div><span>디스크 여유 공간</span><strong>${Qe(t.free)}</strong></div><div><span>보관된 버전</span><strong>${t.versions}</strong></div></div>${o >= 80 || (t.free !== null && t.free < 256 * 1024 ** 2) ? m`<p class="inline-warning">공간이 부족하면 새 버전 보관이 멈춰요. 기존 버전은 남아 있어요.</p>` : ""}<small>${new Date(t.checked).toLocaleTimeString(Fe())} · ${a("마지막 확인 기준")}</small></section>${archiveLocationPanel(t, n)}<section class="panel storage-panel"><h2>보관 한도</h2><p>한도는 디스크 공간을 미리 예약하지 않아요. 파일 처리 중에는 임시 공간도 필요해요.</p><label for="storage-budget">최대 보관 공간</label><select id="storage-budget" ${n}>${[1, 2, 5, 10, 20, 50].map((c) => `<option value="${c}" ${kt === c ? "selected" : ""}>${c} GiB</option>`).join("")}</select><p class="storage-impact">${kt * 1024 ** 3 <= t.used ? a("현재 사용량보다 작아요. 기록은 유지하고 새 보관은 대기해요.") : a("기존 기록은 유지돼요. 새 한도 안에서 변경 내용을 계속 보관해요.")}</p><button class="button primary" data-action="ws-storage-budget" ${n} ${kt === t.budget / 1024 ** 3 ? "disabled" : ""}>한도 변경</button></section><section class="panel storage-panel"><h2>기록을 유지하며 압축</h2><p>모든 버전과 되돌리기 기록을 유지하며 저장 형식만 정리해요. 줄어드는 용량은 파일 내용에 따라 달라요.</p><p>진행 중에는 새 보관이 순서를 기다려요. 압축에는 추가 디스크 공간이 필요해요.</p><button class="button outline" data-action="ws-storage-compact" ${n}>기록 유지하며 압축</button>${s ? m`<p role="status">보관 공간을 확인하거나 정리하고 있어요. 다른 화면을 사용해도 계속돼요.</p>` : ""}<p role="status">${ds(ot)}</p><details><summary>용량 구성과 보관 원칙</summary><p>버전 기록 ${Qe(t.repo)} · 보관 대기 ${Qe(t.pending)} · 목록과 기타 ${Qe(t.other)}</p><p>보관 기간으로 이전 버전을 자동 삭제하지 않아요. 이 컴퓨터의 기록이므로 디스크 고장에 대비한 외부 백업은 따로 필요해요.</p></details></section>`;
}
const M = (e) =>
    String(e ?? "").replace(
      /[&<>"']/g,
      (t) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[t],
    ),
  H = (e, t, s = "", n = !1) =>
    `<button class="button ${n ? "primary" : "outline"}" data-action="ws-${e}" ${s}>${t}</button>`,
  Ga = (e) => (e ? new Date(e).toLocaleString(Fe()) : a("아직 확인 전")),
  it = (e) => e.split(/[\\/]/).pop(),
  nn = {
    initial: "첫 버전 보관 중",
    scanning: "변경 확인 중",
    partial: "일부 보관 대기/불가",
    active: "관리 중",
    polling: "정기 확인 중",
    paused: "관리 중단",
    unavailable: "확인 필요",
    delayed: "저장 지연",
    stored: "보관 완료",
    pending: "저장 대기",
    deleted: "경로에서 사라짐",
    replaced: "교체 전 파일",
  };
let le = "",
  Ht = [],
  Sn = [],
  qe = "",
  Pe = null,
  J = null,
  Ve = "",
  Pn = "{거래처}_{날짜}_{문서종류}.pdf",
  xa = "",
  pe = 1,
  Ut = 20,
  Pa;
const cs = (e) => e.normalize("NFC").toLocaleLowerCase();
let wa = !1,
  dt = !1,
  Jt = !1,
  De = !1,
  Se = "managed",
  mn = !1;
const hs = (e) =>
    new Date(e).toLocaleString(Fe(), {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  qs = {
    stored: {
      label: "새싹 · 보관 완료",
      description: "마지막으로 확인한 파일 내용이 버전으로 보관됐어요.",
    },
    pending: {
      label: "씨앗 · 보관 대기",
      description: "아직 최신 내용의 보관이 끝나지 않았어요.",
    },
    attention: {
      label: "씨앗 ! · 확인 필요",
      description:
        "파일 또는 폴더를 확인하지 못했어요. 최근 보관 버전과 현재 내용은 다를 수 있어요.",
    },
    forgotten: {
      label: "기록 삭제됨",
      description:
        "관리 기록과 보관 버전을 삭제했어요. 원본은 그대로이며, 다시 관리하면 새 이력을 시작해요.",
    },
    paused: {
      label: "씨앗 Ⅱ · 관리 중단",
      description: "기존 버전은 남아 있지만 새로운 변경은 수집하지 않아요.",
    },
    archived: {
      label: "빈 씨앗 · 이력만 보관",
      description:
        "삭제되거나 교체된 파일이에요. 남아 있는 버전을 복원할 수 있어요.",
    },
  };
function Vs(e) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${e === "stored" ? '<path d="M12 21V11M12 14C5 14 3 10 4 5c6 0 8 3 8 9Zm0-4c0-5 3-7 8-7 1 5-3 9-8 9"/>' : '<path d="M5 18C1 10 7 5 15 7c3 8-2 16-10 11Z"/>'}${e === "attention" ? '<path d="M20 5v6M20 15h.01"/>' : e === "paused" ? '<path d="M18 6v9M22 6v9"/>' : e === "pending" ? '<path d="m7 16 5-6"/>' : ""}</svg>`;
}
function Ai() {
  return `<ul class="status-legend">${Object.entries(qs)
    .map(
      ([e, t]) =>
        `<li><span class="file-status-mark ${e}">${Vs(e)}</span><div><strong>${a(t.label)}</strong><p>${a(t.description)}</p></div></li>`,
    )
    .join("")}</ul>`;
}
let Ke = null,
  Qa = !1,
  sn = 1,
  on = "처음 쓴 메모",
  gn = "처음 쓴 메모",
  Gs = "처음 쓴 메모",
  Fn = !1,
  W,
  _e,
  Ne,
  Xe,
  Qs,
  Ct,
  ya = "";
function $i(e, t) {
  (za(e), (ya = t));
}
let browserRequest = 0;
let browserListing = null;
let detailRequest = 0;
let openingFile = null;
let preparedTimeline = null;
function activeFileRequest() {
  return openingFile?.request === detailRequest && openingFile.root === le ? openingFile : null;
}
let columnFiles = new Map();
let columnReads = new Map();
let columnErrors = new Set();
function za(e) {
  ++browserRequest;
  ++detailRequest;
  browserListing = null;
  columnFiles = new Map();
  columnReads = new Map();
  columnErrors = new Set();
  Ht = [];
  Sn = [];
  (Rn(),
    (ya = ""),
    (Se = "managed"),
    (De = !1),
    ba(),
    (pe = 1),
    (le = e),
    (qe = ""),
    (J = null),
    (Ve = ""),
    (xa = ""),
    (dt = !1),
    (Jt = !1));
}
function Ti(e) {
  (({ api: W, notify: _e, redraw: Ne, navigate: Xe, connect: Qs } = e),
    ii(W, Ne));
}
async function ki(e, t) {
  var o, i;
  if (((Ct = t), e === "storage")) {
    await wi(W, t);
    return;
  }
  const s =
    ([10, 20, 50, 100].includes(t.settings.searchPageSize || 20) &&
      t.settings.searchPageSize) ||
    20;
  s !== Ut && ((Ut = s), (pe = 1));
  const n = ((o = t.managed) == null ? void 0 : o.roots) || [];
  if (
    (n.some((c) => c.id === le) ||
      (Rn(),
      (pe = 1),
      (le = ((i = n[0]) == null ? void 0 : i.id) || ""),
      (J = null),
      (qe = "")),
    !(!t.native || !le || !W.manage))
  ) {
    if (e === "files") {
      const root = n.find(item => item.id === le);
      await ri(t, root.id);
      if (Ws() || root.id !== le) return;
      const request = ++browserRequest;
      const folders = await W.manage("browseFolders", root.id);
      if (request !== browserRequest || root.id !== le) return;
      Sn = folders;
      if (!Sn.includes(qe)) qe = root.path;
      const linkedFile = ya;
      const file = linkedFile || J?.file.id;
      ya = "";
      if (file) {
        const detail = detailRequest;
        const previous = J;
        const timeline = await W.manage("timeline", file);
        if (request !== browserRequest || root.id !== le) return;
        if (detail === detailRequest && J === previous && timeline?.file.root === root.id) {
          J = timeline;
          if (linkedFile) qe = vn(timeline.file.path);
        }
      }
      await loadBrowserListing();
    }
    e === "rules" && (Pe = await W.manage("analyze", le));
  }
}
async function loadBrowserListing() {
  const request = ++browserRequest;
  const root = le;
  const view = Se;
  const scoped = !!Ct.managed.folderColumns && view === "managed" && !Ve.trim();
  const folder = qe;
  let rows = scoped
    ? await W.manage("folder-column-files", root, folder)
    : view === "attention"
      ? await W.manage("attention-files", root)
      : await W.manage("files", root, view === "unmanaged" ? "unmanaged" : "managed");
  if (request !== browserRequest || root !== le || view !== Se) return;
  if (view === "missing") rows = rows.filter(row => ["deleted", "replaced"].includes(row.status));
  Ht = rows;
  browserListing = { root, view, scoped, folder };
  columnReads = new Map();
  columnFiles = new Map();
  columnErrors = new Set();
  if (scoped) {
    const base = Ct.managed.roots.find(item => item.id === root).path;
    for (const path of browserPath(base, folder)) columnFiles.set(path, []);
    for (const row of rows) columnFiles.get(vn(row.path))?.push(row);
  }
}
function readFolderColumn(path) {
  const files = columnFiles;
  const reads = columnReads;
  if (files.has(path)) return Promise.resolve(files.get(path));
  if (reads.has(path)) return reads.get(path);
  const root = le;
  const promise = W.manage("folder-column-files", root, path, "direct").then(rows => {
    if (files === columnFiles && root === le) {
      files.set(path, rows);
      if (files.size > 16) {
        const base = Ct.managed.roots.find(item => item.id === root)?.path;
        const visible = new Set(browserPath(base, qe));
        for (const key of files.keys()) {
          if (files.size <= 16) break;
          if (key !== path && !visible.has(key)) files.delete(key);
        }
      }
    }
    return rows;
  }).finally(() => reads.delete(path));
  reads.set(path, promise);
  return promise;
}
function managedFolderStatus(root, total, stored) {
  if (!root.active || root.status === "paused") return ["paused", "관리 중단"];
  if (root.status === "delayed") return ["warning", "저장 지연"];
  if (root.error || root.status === "unavailable") return ["error", "확인 필요"];
  if (root.status === "initial") {
    return ["progress", total === null ? "범위 확인 중" : "첫 버전 보관 중"];
  }
  if (["scanning", "polling"].includes(root.status)) {
    return ["progress", nn[root.status]];
  }
  if (root.status === "partial" || (total !== null && stored < total)) {
    return ["warning", "일부 미보관"];
  }
  if (total === null) return ["progress", "범위 확인 중"];
  return total === 0 ? ["empty", "파일 없음"] : ["complete", "보관 완료"];
}
function managedFolderPicker(state) {
  const number = new Intl.NumberFormat(Fe());
  const percent = new Intl.NumberFormat(Fe(), { style: "percent" });
  const folders = ys(state.managed.roots, state.settings.managedRootOrder, Fe());
  return `<section class="managed-folders" aria-label="${a("관리 폴더")}">
    <div class="root-pot-list managed-folder-list">${folders.map((root) => {
      const stored = Math.max(0, Number(root.stored) || 0);
      const total = [true, 1].includes(root.total_known) && Number.isFinite(root.total)
        && root.total >= stored ? root.total : null;
      const [tone, label] = managedFolderStatus(root, total, stored);
      const status = a(label);
      const name = it(root.path) || root.path;
      const selected = root.id === le;
      const percentSaved = total > 0 ? Math.floor(stored * 100 / total) : null;
      const counts = total === null
        ? m`${number.format(stored)}개 보관`
        : m`${number.format(stored)}/${number.format(total)}개 보관`;
      return `<button id="managed-folder-${M(root.id)}" class="root-pot-card managed-folder-row ${selected ? "selected" : ""}" data-root-order draggable="false" aria-describedby="root-order-help" data-action="ws-root-select" data-root="${M(root.id)}" aria-pressed="${selected}" title="${M(root.path)} · ${M(status)}">
        <span class="managed-folder-name">${root.plant == null ? `<span class="managed-folder-icon" aria-hidden="true">${oe("folder")}</span>` : As(root.plant)}<strong>${M(name)}</strong></span>
        <span class="managed-folder-status" data-tone="${tone}"><span aria-hidden="true" class="managed-folder-dot"></span>${M(status)}</span>
        <span class="managed-folder-count"><span>${counts}</span>${total === null ? `<span>${a("전체 개수 확인 전")}</span>` : percentSaved === null ? "" : `<strong>${percent.format(percentSaved / 100)}</strong>`}</span>
        ${percentSaved === null ? "" : `<progress class="managed-folder-progress" aria-hidden="true" value="${stored}" max="${total}"></progress>`}
      </button>`;
    }).join("")}</div>
    ${H("connect", a("폴더 추가"), 'data-id="-1"')}
    <span class="sr-only" id="root-order-help">${a("폴더를 끌거나 Alt 키와 방향키를 눌러 순서를 바꿔요.")}</span>
  </section>`;
}
function managedFolderHeader(root) {
  return `<header class="managed-folder-header">
    <div class="managed-folder-title">
      <h2>${M(it(root.path) || root.path)}</h2>
      <p title="${M(root.path)}">${M(root.path)}</p>
    </div>
    <div class="managed-folder-actions">
      ${H("root-settings", a("설정"), `aria-expanded="${wa}" ${wa ? 'aria-controls="root-settings"' : ""}`)}
      ${li()}
    </div>
  </header>${root.error ? `<p class="managed-folder-error" role="status">${M(root.error)}</p>` : ""}`;
}
function Si(e, t) {
  const n =
    !!t.error ||
    !t.total_known ||
    ["initial", "partial", "unavailable", "delayed", "paused"].includes(t.status);
  return m`<section class="root-hub" aria-label="관리 폴더 선택"><div class="root-hub-top"><div class="root-pot-list">${ys(
    e.managed.roots,
    e.settings.managedRootOrder,
    Fe(),
  )
    .map(
      (o) =>
        m`<button class="root-pot-card ${o.id === le ? "selected" : ""}" data-root-order draggable="false" aria-describedby="root-order-help" data-action="ws-root-select" data-root="${M(o.id)}" aria-pressed="${o.id === le}" title="${M(o.path)} · ${M(a(nn[o.status] || o.status))}"><span class="root-pot-heading">${As(o.plant)}<strong>${M(it(o.path) || o.path)}</strong>${o.error || !o.active || (!o.total_known && o.status !== "initial") ? a('<span class="root-alert" aria-label="관리 상태 확인 필요">!</span>') : ""}</span><small class="root-count">${o.total_known ? m`${o.total}개 중 ${Math.min(o.total, o.stored)}개` : m`${o.stored}개 보관`}</small></button>`,
    )
    .join(
      "",
    )}</div><span id="root-order-help" class="sr-only">${a("카드를 끌어 순서를 바꿔요. 키보드: Alt + 왼쪽·오른쪽 화살표")}</span><div class="root-hub-actions">${H("connect", a("+ 폴더"), a('data-id="-1" aria-label="폴더 추가"'))}${H("root-settings", a("설정"), `aria-expanded="${wa}" aria-controls="root-settings"`)}</div></div>${n ? `<div class="root-notice" role="status">${M(t.error || (t.status === "initial" ? a("첫 버전 보관 중") : t.active ? a("전체 범위를 확인 중이거나 일부 파일이 보관 대기 중이에요.") : a("관리가 중단되어 있어요.")))}</div>` : ""}${wa ? Fi(e, t) : ""}</section>`;
}
function Fi(e, t, inFiles = !1) {
  const heading = inFiles ? "" : `<p class="root-full-path">${M(t.path)}</p><div class="root-status-line"><span class="pill">${M(a(nn[t.status] || t.status))}</span></div>`;
  const summary = inFiles ? m`제외 ${t.excluded}개` : m`제외 규칙 적용 후 보관 완료 개수 · 미보관 ${Math.max(0, t.total - t.stored)}개 · 제외 ${t.excluded}개 · 마지막 검사 ${Ga(t.scanned)}`;
  return m`<section class="panel workspace-panel compact-root-settings" id="root-settings"><h2>선택한 폴더 설정</h2>${heading}<div class="workspace-actions">${H("scan", a("지금 확인"))}</div><p class="subtle">${summary}</p><h3>바로가기 설정</h3><div class="shortcut-options" role="group" aria-label="${a("바로가기 설정")}">${e.plants.map((s) => H("shortcut", `<span class="shortcut-name">${s.id + 1}. ${M(s.name)}</span><span class="shortcut-state">${t.plant === s.id ? "✓ " + a("연결됨") : "&nbsp;"}</span>`, `data-id="${s.id}" title="${M(s.name)}" aria-pressed="${t.plant === s.id}" aria-disabled="${t.plant === s.id}"`)).join("")}</div><p class="subtle">바로가기를 바꿔도 기존 폴더 관리는 계속돼요.</p><section class="root-management-actions" aria-label="${a("관리 작업")}"><h3>관리 작업</h3><div class="management-action-row"><div><strong>${a(t.active ? "관리 중단" : "관리 다시 시작")}</strong><p>기존 보관 버전과 원본 파일은 유지해요.</p></div>${H("active", a(t.active ? "관리 중단" : "관리 다시 시작"), `id="root-active-button" data-active="${t.active ? "0" : "1"}"`)}</div>${Di("root")}</section></section>`;
}
function Ei(e) {
  return m`<section class="panel workspace-panel"><h2>관리할 폴더를 연결해 주세요</h2><p>화분은 빠른 접근을 위한 바로가기예요. 관리 폴더는 화분 개수와 관계없이 추가할 수 있어요.</p><div class="workspace-actions">${H("connect", a("관리 폴더 추가"), 'data-id="-1"', !0)}</div>${H("guide", a("예시로 사용법 보기"))}</section>`;
}
function xi(e) {
  var i;
  const t = Ke ?? ((i = e.guide) == null ? void 0 : i.step) ?? 0,
    s = Number.isInteger(t) && t >= 0 && t <= 5 ? t : 0,
    n = [
      a("앱 소개"),
      a("폴더 연결"),
      a("보관 상태"),
      a("첫 파일 정리"),
      a("이전 버전"),
      a("규칙과 작은 창"),
    ],
    o = [
      $o(),
      m`<h2>어느 폴더를 관리할까요?</h2><p>선택한 폴더와 하위 폴더의 기존·신규 파일을 관리해요. 범위·제외·용량을 확인한 뒤 시작해요.</p><p>화분은 바로가기예요. 관리 폴더는 화분 개수와 관계없이 추가할 수 있어요. 처음 등록한 내용부터 보관해요.</p>${e.plants.map((c) => H("connect", m`${M(c.name)} 화분에 연결`, `data-id="${c.id}"`)).join("")}`,
      m`<h2>보관 상태를 먼저 확인해요</h2><p>파일 상세 우측 상단의 표시로 상태를 알 수 있어요. 마우스를 올리거나 클릭하면 뜻을 볼 수 있어요.</p>${Ai()}<p>표시는 실제 보관 상태예요. 화분의 성장 점수와는 관계없어요.</p>${H("files", a("실제 보관 상태 보기"))}`,
      m`<h2>관리 폴더 안에서 정리해요</h2><p>내 파일에서 폴더를 선택하고 설정 옆의 폴더 정리를 누르세요. 범위와 기준을 고른 뒤 예상 결과를 확인해요.</p><p>이동할 항목을 선택해야 실제로 옮겨요. 분석만으로 파일을 변경하지 않아요. 같은 위치에 있는 파일은 유지해요.</p><p>파일을 이동한 뒤 버전 보관은 백그라운드에서 계속돼요. 안내의 다음은 파일을 실행하지 않아요.</p>${H("files", a("내 파일 보기"))}`,
      m`<h2>이전 내용을 찾고 복원해요</h2><p><strong>정리 기록 → 되돌리기</strong>는 정리한 위치를 되돌리는 기능이에요.</p><p><strong>내 파일 → 파일 선택 → 버전 이력 → 다른 이름으로 복원</strong>은 예전 내용을 별도 파일로 꺼내요.</p><p>버전 이력에서 두 버전을 골라 변경 내용을 비교할 수도 있어요. UTF-8 텍스트의 추가·삭제 줄을 보여줘요.</p><p>이 버전에서는 현재 파일을 덮어쓰지 않는 별도 복원을 제공해요. 앱 완전 종료 중의 중간 편집은 보관되지 않아요.</p>${H("files", a("파일 버전 이력 열기"))}`,
      m`<h2>내 규칙을 보고, 작은 창을 꾸며요</h2><p><strong>테마</strong>에서 ID/PW로 가입하면 무료 테마를 받고 공유할 수 있어요. 받은 테마는 설치 후 적용을 누르세요. 파일 관리와 설치한 테마 사용에는 로그인이 필요하지 않아요.</p><p><code>{거래처}_{날짜}_{문서종류}.pdf</code> 같은 패턴을 확인하고 내 규칙으로 사용할 수 있어요.</p><p>일치·불일치·판단 보류·규칙 없음·예외를 나눠 봐요. 규칙에 맞지 않아도 버전은 보관돼요.</p><p>작은 창 위에 마우스를 올리면 이동·크기 조절·관리 버튼이 보여요. 숨기거나 관리 창을 닫아도 앱이 실행 중이면 관리가 계속돼요. <strong>앱 완전 종료 중에는 기록되지 않아요.</strong></p><div class="workspace-actions">${H("rules", a("파일 이름 규칙 보기"))}${H("widget", a("작은 창 열기"))}</div>`,
    ];
  return (
    m`<div class="section-heading"><div><span class="eyebrow">START SMALL</span><h1>사용 안내</h1><p>원하는 주제를 선택하거나 처음부터 따라 해보세요.</p></div></div>` +
    `<section class="panel settings-panel language-panel"><label for="app-language">Language · ${a("표시 언어")}</label><select id="app-language">${Cs(e.settings.language)}</select></section>` +
    m`<section class="panel workspace-panel"><nav class="guide-progress" aria-label="사용 안내 단계">${n.map((c, u) => H("step", `${u + 1}. ${c}`, `data-step="${u}" aria-current="${u === s ? "step" : "false"}"`, u === s)).join("")}</nav>${o[s]}${To()}${Qa ? m`<div class="demo-box"><strong>예시 체험 · 실제 파일은 변경되지 않아요</strong><p>예시 파일: 메모.txt · v${sn}</p><p>메모를 바꾸고 저장한 뒤, 이전 내용을 다른 이름으로 꺼내 보세요.</p><label for="ws-demo-text">예시 메모 내용</label><textarea id="ws-demo-text">${M(on)}</textarea><div class="workspace-actions">${H("demo-save", a("예시 저장"))}${H("demo-restore", a("이전 예시를 다른 이름으로 복원"), sn < 2 ? "disabled" : "", !1)}${H("demo-close", a("예시 닫기"))}</div>${Fn ? m`<p>예시 복원본: ${M(Gs)} · 현재 메모는 유지돼요.</p>` : ""}</div>` : ""}<div class="guide-footer">${s ? H("step", a("뒤로"), `data-step="${s - 1}"`) : ""}${H("defer", a("나중에 설정"))}${s < 5 ? H("step", a("다음"), `data-step="${s + 1}"`, !0) : H("complete", a("가이드 마치기"), "", !0)}</div><p class="subtle">가이드 종료는 이미 시작한 폴더 관리를 중단하지 않아요. 안내 완료와 파일 보관 완료는 별개예요.</p></section>`
  );
}
function Ii(e, t) {
  var u, d;
  if (e === "storage") return ji(t);
  if (e === "help") return xi(t);
  const s = a(e === "rules" ? "나의 파일명 규칙" : "내 파일"),
    n = `<div class="section-heading ${e === "files" ? "files-heading" : ""}"><div>${e === "rules" ? '<span class="eyebrow">YOUR FILES, YOUR HISTORY</span>' : ""}<h1 data-ui-label="${e === "files" ? "filesTitle" : ""}">${s}</h1>${e === "rules" ? a("<p>나의 이름 습관을 확인하고, 맞지 않는 파일을 찾아보세요.</p>") : ""}</div>${H("guide", a("사용 안내"))}</div>`;
  if (!t.native)
    return (
      n +
      m`<section class="panel workspace-panel"><h2>브라우저는 예시 체험이에요</h2><p>실제 폴더 감시·Git 버전 보관은 데스크톱 앱에서 사용할 수 있어요.</p>${H("demo", a("예시 체험 열기"))}</section>`
    );
  const o =
    (u = t.managed) != null && u.error
      ? `<div class="recovery-banner"><span>${M(t.managed.error)}</span>${H("retry", a("저장소 다시 확인"))}</div>`
      : "";
  if (!((d = t.managed) != null && d.roots.length)) return n + o + Ei();
  const i = t.managed.roots.find((r) => r.id === le) || t.managed.roots[0];
  if (e === "rules") return n + o + Si(t, i) + Bi(i);
  const hasDetail = !!(J || activeFileRequest());
  const workspace = Ws() ? hi() : m`<div class="file-workbench ${hasDetail ? "has-detail" : ""} ${J && dt ? "has-history" : ""}"><section class="panel workspace-panel folder-panel"><label class="search-label" for="ws-search">파일 검색</label><input id="ws-search" value="${M(Ve)}" placeholder="관리 폴더 전체에서 파일명·경로 검색">${Oi()}${Mi(i)}</section>${hasDetail ? Pi() : ""}</div>`;
  return `${n}${o}<div class="managed-files-layout">${managedFolderPicker(t)}<div class="managed-files-content">${managedFolderHeader(i)}${wa ? Fi(t, i, !0) : ""}${workspace}</div></div>`;
}
function vn(path) {
  const i = Ct?.platform === "darwin" ? path.lastIndexOf("/") : Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
  if (i === 0 || (i === 2 && path[1] === ":")) return path.slice(0, i + 1);
  return path.slice(0, Math.max(0, i));
}
function Oi() {
  return `<div class="workspace-actions file-view-tabs" aria-label="${a("파일 관리 상태")}">${[
    ["managed", "관리 중"],
    ["attention", "미보관·제외"],
    ["missing", "경로에서 사라짐"],
    ["unmanaged", "관리 해제"],
  ]
    .map(([e, t]) =>
      H(
        "file-view",
        a(t),
        `data-view="${e}" aria-pressed="${Se === e}"`,
        Se === e,
      ),
    )
    .join(
      "",
    )}</div>${Se === "attention" ? `<p class="file-view-help">${a("최근 검사에서 보관하지 못했거나 제외한 항목이에요. 제외 폴더는 폴더 한 개로 표시하며, 내부 파일과 아직 확인하지 못한 범위는 모두 나열하지 않아요.")}</p>` : ""}`;
}
function us(e) {
  const t = it(e.path),
    s = (activeFileRequest()?.id || J?.file.id) === e.id;
  return Se === "attention"
    ? `<${e.id ? 'button type="button"' : "div"} class="managed-row attention-row" ${e.id ? `data-action="ws-timeline" data-file="${M(e.id)}" aria-pressed="${s}"` : ""}><span class="file-summary"><strong>${M(t)}</strong><small>${M(e.path)}</small><span class="attention-reason">${M(a(e.reason))}</span></span><span class="file-state">${a(e.kind === "directory" ? "폴더 범위" : e.management === "off" ? "관리 해제" : e.reason === "자동 보관 제외 규칙에 해당해요." ? "규칙 제외" : "미보관")}</span></${e.id ? "button" : "div"}>`
    : m`<button type="button" class="managed-row browser-file ${s ? "selected" : ""}" data-action="ws-timeline" data-file="${M(e.id)}" aria-pressed="${s}" aria-label="${M(t)} · ${e.version_count}개 버전 · ${M(a(e.management === "off" ? "관리 해제" : nn[e.status] || e.status))}" title="${M(e.path)}${e.error ? " — " + M(e.error) : ""}"><svg class="file-glyph" viewBox="0 0 20 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 2h9l5 5v15H3zM12 2v6h5M6 12h8M6 16h8"/></svg><span class="file-summary"><strong>${M(t)}</strong>${Ve || Se !== "managed" ? `<small>${M(e.path)}</small>` : ""}</span>${e.status !== "stored" || e.management === "off" ? `<span class="file-state">${M(a(e.management === "off" ? "관리 해제" : nn[e.status] || e.status))}</span>` : ""}<span class="file-version">${e.status === "forgotten" ? a("기록 없음") : e.version_count ? "v" + e.version_count : a("대기")}</span></button>`;
}
function browserPath(base, folder) {
  const path = [];
  for (let p = folder; p && base && p.length > base.length; p = vn(p)) path.unshift(p);
  return [base, ...path];
}
function browserBreadcrumbs(t) {
  return m`<nav class="folder-breadcrumbs" aria-label="현재 폴더 경로">${t.map((i, c) => H("folder", M(c ? it(i) : it(t[0]) || t[0]), `data-path="${M(i)}" aria-current="${c === t.length - 1 ? "location" : "false"}"`)).join('<span aria-hidden="true">›</span>')}</nav>`;
}
function columnState(path) {
  if (!browserListing?.scoped || columnFiles.has(path)) return "ready";
  return columnErrors.has(path) ? "error" : "loading";
}
function updateFolderColumns(root, moveToSelection) {
  const list = document.querySelector(".folder-columns");
  if (!list) return;
  const paths = browserPath(root.path, qe);
  gs = "";
  if (moveToSelection) {
    const nav = list.previousElementSibling;
    const hadFocus = nav.contains(document.activeElement);
    nav.outerHTML = browserBreadcrumbs(paths);
    if (hadFocus) list.previousElementSibling.lastElementChild?.focus({ preventScroll: true });
    const workbench = list.closest(".file-workbench");
    workbench.querySelector("#version-details")?.remove();
    workbench.classList.remove("has-detail", "has-history");
    const file = list.querySelector(".browser-file.selected");
    if (file) {
      file.classList.remove("selected");
      file.setAttribute("aria-pressed", "false");
    }
  }
  for (const [depth, path] of paths.entries()) {
    const column = list.children[depth];
    const current = depth === paths.length - 1;
    const next = paths[depth + 1];
    if (column?.dataset.path !== path) {
      while (list.children.length > depth) list.lastElementChild.remove();
      list.insertAdjacentHTML("beforeend", browserColumn(path, depth, next, current));
      continue;
    }
    if (column.dataset.state !== columnState(path)) {
      column.outerHTML = browserColumn(path, depth, next, current);
      continue;
    }
    column.classList.toggle("current", current);
    const old = column.querySelector(".folder-entry.selected");
    if (old && old.dataset.path !== next) {
      old.classList.remove("selected");
      old.setAttribute("aria-pressed", "false");
    }
    if (next && old?.dataset.path !== next) {
      const selected = column.querySelector(`.folder-entry[data-path="${CSS.escape(next)}"]`);
      selected?.classList.add("selected");
      selected?.setAttribute("aria-pressed", "true");
    }
  }
  while (list.children.length > paths.length) list.lastElementChild.remove();
  if (moveToSelection) list.scrollLeft = list.scrollWidth;
}
async function selectBrowserFolder(path) {
  const root = Ct.managed.roots.find(item => item.id === le);
  if (!root) return;
  ++detailRequest;
  ++browserRequest;
  qe = path;
  J = null;
  columnErrors.delete(path);
  if (browserListing?.root !== le || browserListing.view !== Se) {
    await Ne();
    return;
  }
  browserListing.folder = path;
  updateFolderColumns(root, true);
  if (!browserListing.scoped || columnFiles.has(path)) return;
  const cache = columnFiles;
  try {
    await readFolderColumn(path);
  } catch {
    if (cache === columnFiles) columnErrors.add(path);
  }
  if (ie === "files" && le === root.id && browserPath(root.path, qe).includes(path) &&
      !Ve.trim() && Se === "managed" && cache === columnFiles)
    updateFolderColumns(root, false);
}
function browserColumn(i, c, next, current) {
  const u = Sn.filter(path => path !== i && vn(path) === i);
  const d = browserListing?.scoped ? columnFiles.get(i) || [] : Ht.filter(row => vn(row.path) === i);
  const state = columnState(i);
  return m`<section class="folder-column ${current ? "current" : ""}" data-path="${M(i)}" data-state="${state}" aria-busy="${state === "loading"}" aria-label="${m`${c + 1}단계 ${M(it(i))}`}"><header><small>${state === "ready" ? m`폴더 ${u.length} · 파일 ${d.length}` : M(it(i))}</small></header><div class="folder-entries">${u.map((r) => `<button class="folder-entry ${next === r ? "selected" : ""}" data-action="ws-folder" data-path="${M(r)}" aria-pressed="${next === r}" title="${M(r)}"><span aria-hidden="true">▸</span><span>${M(it(r))}</span><span aria-hidden="true">›</span></button>`).join("")}${d.map(us).join("")}${state !== "ready" ? `<p class="folder-empty" role="status">${a(state === "loading" ? "파일 목록을 불러오는 중" : "목록을 불러오지 못했어요. 다시 확인해 주세요.")}</p>` : !u.length && !d.length ? a('<p class="folder-empty">비어 있는 폴더예요.</p>') : ""}</div></section>`;
}
function Mi(e) {
  const t = browserPath(e.path, qe);
  if (Ve.trim() || Se !== "managed") {
    const query = cs(Ve.trim());
    const collator = new Intl.Collator(Fe(), { numeric: true });
    const i = Ht.filter((f) => !query || cs(f.path).includes(query)).sort(
        (f, b) =>
          collator.compare(f.path, b.path) ||
          String(f.id || "").localeCompare(String(b.id || "")),
      ),
      c = Math.max(1, Math.ceil(i.length / Ut));
    pe = Math.min(Math.max(1, pe), c);
    const u = (pe - 1) * Ut,
      d = i.slice(u, u + Ut),
      r = Array.from(
        { length: Math.min(5, c) },
        (f, b) => Math.max(1, Math.min(pe - 2, c - 4)) + b,
      );
    return m`<p id="search-result-count" class="search-result-count" role="status" tabindex="-1">${a(Ve.trim() ? "전체 하위 폴더 검색 결과" : "관리 상태별 파일 목록")} · ${i.length}개${i.length ? m` · ${u + 1}–${u + d.length} 표시` : ""}</p><div class="managed-list">${d.map(us).join("") || a("<p>검색 결과가 없어요.</p>")}</div>${i.length ? m`<nav class="search-pagination" aria-label="검색 결과 페이지">${H("page", a("이전"), `data-page="${pe - 1}" ${pe === 1 ? "disabled" : ""}`)}${r.map((f) => H("page", String(f), m`data-page="${f}" aria-label="${f}페이지" ${f === pe ? 'aria-current="page"' : ""}`, f === pe)).join("")}${H("page", a("다음"), `data-page="${pe + 1}" ${pe === c ? "disabled" : ""}`)}<small>${pe} / ${c} 페이지 · ${Ut}개씩</small></nav>` : ""}`;
  }
  return m`<div class="folder-view-label">폴더별 보기</div>` + browserBreadcrumbs(t) +
    m`<div class="folder-columns" aria-label="폴더 깊이별 탐색">${t.map((path, depth) =>
      browserColumn(path, depth, t[depth + 1], depth === t.length - 1)).join("")}</div>`;
}
function Ri(e) {
  const t = e.file.management === "off",
    s = `data-file="${M(e.file.id)}"`;
  return `<details class="file-management-menu" data-disclosure="file-menu-${M(e.file.id)}"><summary id="file-management-trigger" aria-haspopup="menu" aria-expanded="false" aria-label="${a("파일 관리 메뉴")}" title="${a("파일 관리 메뉴")}">⋯</summary><div class="file-management-options" role="menu" aria-label="${a("파일 관리 메뉴")}">${t ? H("resume-management", a("다시 관리"), s + ' role="menuitem"') : H("ask-unmanage", a("관리 해제"), s + ' role="menuitem"')}${e.file.status === "forgotten" ? "" : H("ask-delete-records", a("관리 기록 삭제"), 'data-kind="file" role="menuitem"')}</div></details>`;
}
function Li(e) {
  const t = ["deleted", "replaced"].includes(e.file.status),
    s = e.file.management === "off",
    n = `data-file="${M(e.file.id)}"`;
  return (
    (s
      ? `<div class="file-management-note"><strong>${a("관리 해제한 파일")}</strong><p>${a(e.file.status === "forgotten" ? "관리 기록과 보관 버전을 삭제했어요. 원본은 그대로이며, 다시 관리하면 새 이력을 시작해요." : "자동 관리와 일반 목록에서 제외했어요. 보관된 버전은 여기서 확인하거나 복원할 수 있어요.")}</p></div>`
      : t
        ? `<div class="file-management-note"><strong>${a(e.file.management === "keep" ? "계속 관리 중 · 파일을 기다려요" : "이 파일을 계속 관리할까요?")}</strong><p>${a("현재 경로에 파일이 없어요. 계속 관리하면 파일이 돌아왔을 때 다시 확인해요. 기존 보관본은 남아 있어요.")}</p>${e.file.management === "keep" ? "" : H("keep-management", a("계속 관리"), n)}</div>`
        : "") +
    (De
      ? `<div class="file-management-note" role="group" aria-label="${a("관리 해제 확인")}"><p>${a("목록과 자동 관리에서 제외해요. 같은 경로의 파일이 다시 생겨도 다시 관리하기 전에는 보관하지 않아요. 실제 파일과 기존 버전은 삭제하지 않으며 보관 공간도 줄지 않아요.")}</p><div class="file-confirm-actions">${H("stop-management", a("관리 해제 확인"), n)}${H("cancel-unmanage", a("취소"))}</div></div>`
      : "")
  );
}
function Di(e, t) {
  return `<section class="record-delete"><div><h3>${a("관리 폴더 기록 삭제")}</h3><p>${a("실제 파일과 폴더는 그대로 두고, 앱의 관리 기록과 보관 버전을 삭제해요.")}</p></div>${H("ask-delete-records", a("관리 기록 삭제"), `id="root-delete-button" data-kind="${e}"`)}</section>`;
}
function Pi() {
  const pending = activeFileRequest();
  if (pending) return m`<section class="panel workspace-panel file-details minimal-detail" id="version-details" aria-label="파일 상세" aria-busy="true"><div class="minimal-detail-heading"><h2>${M(pending.name)}</h2>${H("close-detail", "×", a('aria-label="상세 닫기" title="상세 닫기"'))}</div><p class="subtle" role="status">${a("파일 상세를 불러오는 중")}</p></section>`;
  const e = J,
    t = e.versions[0],
    s = Ct.managed.roots.find((i) => i.id === e.file.root),
    n =
      e.file.status === "forgotten"
        ? "forgotten"
        : e.file.management === "off"
          ? "paused"
          : ["deleted", "replaced"].includes(e.file.status)
            ? "archived"
            : s != null && s.active
              ? e.file.error || ["unavailable", "delayed"].includes(s.status)
                ? "attention"
                : e.file.status === "stored" && t
                  ? "stored"
                  : "pending"
              : "paused",
    o = qs[n];
  return m`<section class="panel workspace-panel file-details minimal-detail" id="version-details" aria-label="파일 상세"><div class="minimal-detail-heading"><h2 title="${M(it(e.file.path))}">${M(it(e.file.path))}</h2><button class="file-status-mark ${n}" data-action="ws-toggle-status" aria-label="${a("보관 상태 설명")}: ${a(o.label)}" title="${a("보관 상태 설명")}: ${a(o.description)}" aria-expanded="${Jt}" aria-controls="file-status-description">${Vs(n)}</button>${Ri(e)}${H("close-detail", "×", a('aria-label="상세 닫기" title="상세 닫기"'))}</div>${Jt ? `<div class="file-status-description" id="file-status-description"><strong>${a(o.label)}</strong><p>${a(o.description)}</p>${e.file.error ? `<p>${M(e.file.error)}</p>` : ""}${H("status-guide", a("표시 사용 안내"))}</div>` : ""}<p class="file-latest"><strong>${e.file.status === "forgotten" ? a("기록 삭제됨") : t ? "v" + t.seq : a("보관 대기")}</strong>${e.file.status === "forgotten" ? a("<span>저장된 버전이 없어요</span>") : t ? m`<span>최근 보관 ${hs(t.created)}</span>` : a("<span>첫 버전을 기다려요</span>")}</p><div class="file-detail-actions">${H("open-file", a("현재 파일 열기"), `data-file="${M(e.file.id)}" ${["deleted", "replaced", "forgotten"].includes(e.file.status) ? "disabled" : ""}`, !0)}${H("open-folder", a("폴더 열기"), `data-file="${M(e.file.id)}" ${e.file.status === "forgotten" ? "disabled" : ""}`)}</div>${Li(e)}<button class="history-disclosure" data-action="ws-toggle-history" aria-expanded="${dt}" aria-controls="file-version-history"><span>버전 이력 <small>${e.versions.length}</small></span><span aria-hidden="true">${dt ? "⌃" : "⌄"}</span></button>${dt ? m`<div id="file-version-history">${fi(e)}${e.versions.length ? e.versions.map((i) => m`<article class="managed-row"><div><strong>v${i.seq} · ${hs(i.created)}</strong></div>${H("restore", a("복원"), `data-version="${M(i.id)}"`)}</article>`).join("") : a("<p>아직 확정된 내용 버전이 없어요.</p>")}<details data-disclosure="events-${M(e.file.id)}"><summary>위치 변경·보관하지 못한 기간</summary>${e.events.map((i) => `<p>${Ga(i.created)} · ${M(i.kind)} · ${M(i.status)}<small>${M(i.old_path)} → ${M(i.path)}</small></p>`).join("")}${e.gaps.map((i) => `<p class="inline-warning">${Ga(i.start)} ~ ${i.end ? Ga(i.end) : a("현재")}: ${M(i.reason)}</p>`).join("")}</details></div>` : ""}</section>`;
}
function Bi(e) {
  return Pe
    ? bi(le, Pe) +
        m`<section class="panel workspace-panel"><h2>적용 중인 규칙</h2>${Pe.rules.length ? Pe.rules.map((t) => m`<div class="managed-row"><div><strong>${M(t.template)}</strong><small>${M(t.scope)} · 기준 v${t.revision}</small></div>${H("disable-rule", a("사용 중지"), `data-rule="${M(t.id)}"`)}</div>`).join("") : a("<p>발견한 패턴을 승인하거나 내 규칙을 입력해 보세요.</p>")}<details data-disclosure="rule-editor"><summary>내 규칙 직접 만들기</summary><label for="ws-scope">적용할 하위 폴더 (전체 경로)</label><input id="ws-scope" value="${M(xa || e.path)}"><label for="ws-template">파일명 형식</label><input id="ws-template" value="${M(Pn)}"><p class="subtle">{텍스트} · {거래처} · {문서종류} · {날짜} · {번호} 사용 가능. 날짜는 YYYY-MM-DD 또는 YYYYMMDD예요.</p>${H("approve-custom", a("이 범위의 내 규칙으로 사용"), "", !0)}</details></section>${oi(Pe)}<section class="panel workspace-panel"><h2>학습한 정리 습관</h2><p>성공한 목적지 선택을 반영해요. 같은 내용의 반복 복사는 학습 근거를 늘리지 않아요.</p>${Pe.habits.map((t) => m`<p><code>${M(t.pattern)}</code><small>→ ${M(t.folder)} · 근거 가중치 ${t.count.toFixed(1)}</small></p>`).join("") || a("<p>아직 학습한 선택이 없어요.</p>")}${H("reset-learning", a("이 루트 추천 학습 초기화"))}<p class="subtle">파일·버전·직접 만든 이름 규칙은 유지돼요.</p></section>`
    : a("<p>이름을 분석하고 있어요.</p>");
}
function updateFileDetailPanel(fileId) {
  const workbench = document.querySelector(".file-workbench");
  if (!workbench) return;
  gs = "";
  const selected = workbench.querySelector('[data-action="ws-timeline"][aria-pressed="true"]');
  if (selected?.dataset.file !== fileId) {
    selected?.setAttribute("aria-pressed", "false");
    selected?.classList.remove("selected");
    const row = workbench.querySelector(`[data-action="ws-timeline"][data-file="${CSS.escape(fileId)}"]`);
    row?.setAttribute("aria-pressed", "true");
    row?.classList.add("selected");
  }
  workbench.classList.add("has-detail");
  workbench.classList.toggle("has-history", !!J && dt);
  const panel = workbench.querySelector("#version-details");
  if (panel) panel.outerHTML = Pi();
  else workbench.insertAdjacentHTML("beforeend", Pi());
}
const browserActions = new Set(["ws-folder", "ws-page", "ws-timeline", "ws-toggle-history",
  "ws-toggle-status", "ws-close-detail", "ws-root-settings", "ws-root-select", "ws-file-view"]);
async function Hi(e, t) {
  var n, o, i, c, u, d;
  if (
    ((o =
      (n = t.closest) == null ? void 0 : n.call(t, ".file-management-menu")) ==
      null || o.removeAttribute("open"),
    !e.startsWith("ws-"))
  )
    return !1;
  if (mn) return !0;
  const s = e.slice(3);
  if (s.startsWith("org-")) return (await ui(s.slice(4), t, qe), !0);
  if (s.startsWith("compare-")) return (await gi(s, W, Ne), !0);
  if (s.startsWith("route-")) return (await Ci(s, t, Pe, W, Ne), !0);
  if (si(s, t)) {
    await Ne();
    const r = document.querySelector(
      ".rules-" +
        (["rules-checks-page", "rules-filter"].includes(s)
          ? "checks"
          : "candidates") +
        " h2",
    );
    return (
      r &&
        ((r.tabIndex = -1),
        r.focus({ preventScroll: !0 }),
        r.scrollIntoView({ block: "nearest" })),
      !0
    );
  }
  if (s === "page") {
    const r = Number(t.dataset.page);
    Number.isInteger(r) && r > 0 && (++detailRequest, (pe = r), (J = null));
  } else if (s === "connect") Qs(Number(t.dataset.id), t.dataset.quick === "1");
  else if (["files", "rules", "garden", "storage"].includes(s)) Xe(s);
  else if (s === "guide") ((Ke = 0), Xe("help"));
  else if (s === "resume-guide") ((Ke = null), (Qa = !1), Xe("help"));
  else if (s === "start-look")
    (await W.widget(),
      W.manage
        ? await W.manage("guide", { step: 0, status: "completed" })
        : await W.setting("onboarded", !0),
      Xe("garden"));
  else if (s.startsWith("storage-location-")) await changeArchiveLocation(s.slice(8), W, Ne);
  else if (s.startsWith("storage-")) await yi(s.slice(8), W, Ne);
  else if (s === "widget") await W.widget();
  else if (s === "step")
    ((Ke = Number(t.dataset.step)),
      W.manage &&
        js(Ct) &&
        (await W.manage("guide", { step: Ke, status: "in_progress" })));
  else if (s === "defer" || s === "complete")
    (W.manage
      ? await W.manage("guide", {
          step: Ke ?? ((i = Ct.guide) == null ? void 0 : i.step) ?? 0,
          status: s === "complete" ? "completed" : "deferred",
        })
      : await W.setting("onboarded", !0),
      _e(
        a(
          s === "complete"
            ? "사용 안내를 마쳤어요. 실제 보관 상태는 관리 화면에서 확인해 주세요."
            : "홈에서 사용 안내를 다시 열 수 있어요.",
        ),
      ),
      Xe("garden"));
  else if (s === "demo") ((Qa = !0), (Ke = 4), Xe("help"));
  else if (s === "demo-save") {
    if (on === gn)
      return (_e(a("내용을 바꾼 뒤 저장하면 새 버전이 생겨요.")), !0);
    ((Gs = gn), (gn = on), sn++, (Fn = !1));
  } else if (s === "demo-restore") sn > 1 && (Fn = !0);
  else if (s === "demo-close") Qa = !1;
  else if (s === "folder") {
    await selectBrowserFolder(t.dataset.path);
    return true;
  }
  else if (s === "file-view")
    (++detailRequest, (Se = t.dataset.view), (pe = 1), (J = null), (De = !1));
  else if (s === "ask-unmanage") De = !0;
  else if (s === "cancel-unmanage") De = !1;
  else if (s === "close-detail") (++detailRequest, (De = !1), (J = null), ba());
  else if (s === "toggle-history") dt = !dt;
  else if (s === "toggle-status") Jt = !Jt;
  else if (s === "status-guide") ((Ke = 2), Xe("help"));
  else if (s === "root-select") za(t.dataset.root);
  else if (s === "root-settings") wa = !wa;
  else if (s === "ask-delete-records" && W.manage) {
    const r = t.dataset.kind === "root" ? "root" : "file",
      f =
        r === "root"
          ? Ct.managed.roots.find((T) => T.id === le)
          : J == null
            ? void 0
            : J.file;
    if (!f) return !0;
    const b = { kind: r, id: f.id, path: f.path },
      j = r === "root" ? "root-delete-button" : "file-management-trigger",
      v = await Gn({
        title: a("관리 기록 삭제"),
        path: b.path,
        action: a("관리 기록 삭제"),
        danger: !0,
        messages: [
          a(
            r === "root"
              ? "폴더 연결과 관련 정리·버전 이력을 삭제해요. 폴더 안의 실제 파일은 삭제하지 않아요."
              : "같은 경로의 관리 기록과 관련 정리·버전 이력을 삭제하고 자동 관리에서 제외해요. 원본 파일은 삭제하지 않아요.",
          ),
          a(
            "삭제한 버전은 앱에서 복원할 수 없어요. 다른 파일의 보관 이력은 유지해요.",
          ),
        ],
      });
    if (
      ((c = document.getElementById(j)) == null ||
        c.focus({ preventScroll: !0 }),
      !v)
    )
      return !0;
    mn = !0;
    try {
      (await W.manage("delete-records", b.kind, b.id),
        (J = null),
        ba(),
        (De = !1),
        (wa = !1),
        _e(
          a(
            "기록 삭제를 백그라운드에서 진행해요. 다른 화면을 사용해도 괜찮아요.",
          ),
        ));
    } finally {
      ((mn = !1), await Ne());
    }
    return !0;
  } else if (W.manage)
    if (["stop-management", "keep-management", "resume-management"].includes(s))
      (await W.manage(
        "file-management",
        t.dataset.file,
        s === "stop-management"
          ? "stop"
          : s === "keep-management"
            ? "keep"
            : "resume",
      ),
        (De = !1),
        s !== "keep-management" && (J = null),
        _e(
          a(
            s === "stop-management"
              ? "관리를 해제했어요. 보관본은 관리 해제 목록에 남아 있어요."
              : "관리 선택을 저장했어요.",
          ),
        ));
    else if (s === "scan") await W.manage("scan", le);
    else if (s === "retry") await W.manage("retry");
    else if (s === "active") {
      const r = le,
        f = t.dataset.active === "1",
        b = Ct.managed.roots.find((j) => j.id === r);
      if (!b) return !0;
      if (!f) {
        const j = await Gn({
          title: a("관리 중단"),
          path: b.path,
          action: a("관리 중단"),
          messages: [
            a("새로운 파일 변경의 자동 보관을 중단해요."),
            a("기존 보관 버전과 원본 파일은 유지해요."),
          ],
        });
        if (
          ((u = document.getElementById("root-active-button")) == null ||
            u.focus({ preventScroll: !0 }),
          !j)
        )
          return !0;
      }
      await W.manage("active", r, f);
    } else if (s === "timeline") {
      const request = ++detailRequest;
      if (J?.file.id !== t.dataset.file) ((De = !1), ba(), (dt = !1), (Jt = !1));
      const file = t.dataset.file;
      const prepared = preparedTimeline?.root === le && preparedTimeline.id === file ? preparedTimeline : null;
      preparedTimeline = null;
      J = null;
      openingFile = { request, root: le, id: file, name: t.querySelector("strong")?.textContent || "" };
      if (!prepared?.value) updateFileDetailPanel(file);
      try {
        const timeline = prepared?.value || await (prepared?.read || W.manage("timeline", file));
        if (detailRequest !== request || ie !== "files" || openingFile?.root !== le) return true;
        J = timeline;
      } finally {
        if (openingFile?.request === request) openingFile = null;
        if (!J && request === detailRequest && ie === "files") K();
      }
      updateFileDetailPanel(file);
    }
    else if (s === "open-file") await W.manage("openFile", t.dataset.file);
    else if (s === "open-folder")
      await W.manage("openFileFolder", t.dataset.file);
    else if (s === "shortcut") {
      if (t.getAttribute("aria-disabled") === "true") return !0;
      (await W.manage("shortcut", le, Number(t.dataset.id)),
        _e(a("화분 바로가기를 바꿨어요. 기존 폴더 관리도 계속돼요.")));
    } else if (s === "restore") {
      const r = await W.manage("restore", t.dataset.version);
      r && _e(m`다른 이름으로 복원했어요: ${r.destination}`);
    } else if (s === "approve-custom") {
      const r = Ct.managed.roots.find((f) => f.id === le);
      await W.manage("approveRule", le, xa || r.path, Pn);
    } else if (s === "approve-candidate") {
      const r = Pe.candidates[Number(t.dataset.index)];
      await W.manage("approveRule", le, r.scope, r.template);
    } else
      s === "disable-rule"
        ? await W.manage("disableRule", t.dataset.rule)
        : s === "exception"
          ? await W.manage(
              "exception",
              t.dataset.file,
              t.dataset.enabled === "1",
            )
          : s === "reset-learning" &&
            (await W.manage("resetLearning", le),
            _e(a("추천 학습을 초기화했어요. 파일과 버전은 그대로예요.")));
  if (s !== "timeline" || ie !== "files") {
    if (ie === "files" && browserActions.has(e) && s !== "root-select" && s !== "file-view") K();
    else await Ne();
  }
  if (s === "page") {
    const r = document.querySelector(".search-result-count");
    r &&
      ((r.tabIndex = -1),
      r.focus({ preventScroll: !0 }),
      r.scrollIntoView({ block: "nearest", behavior: "instant" }));
  }
  if (s === "timeline") {
    const detail = document.getElementById("version-details");
    if (detail && detail.getBoundingClientRect().top > detail.previousElementSibling.getBoundingClientRect().top)
      detail.scrollIntoView({ block: "start", behavior: "instant" });
  }
  return !0;
}
async function Bn(e) {
  var t, s, n;
  if (
    e.id.startsWith("org-") ||
    ((t = e.dataset) == null ? void 0 : t.policyTarget) !== void 0 ||
    ((s = e.dataset) == null ? void 0 : s.termWord) !== void 0 ||
    ((n = e.dataset) == null ? void 0 : n.termFolder) !== void 0
  ) {
    await pi(e);
    return;
  }
  if (e.id.startsWith("ws-compare-")) {
    await vi(e.id, e.value, Ne);
    return;
  }
  if (e.id.startsWith("ws-route-")) {
    Ni(e.id, e.value);
    return;
  }
  if (e.id === "storage-budget") {
    (zi(e.value), await Ne());
    return;
  }
  if (ni(e.id, e.value)) {
    (clearTimeout(Pa),
      e.id === "ws-rules-query"
        ? (Pa = setTimeout(() => {
            Ne();
          }, 180))
        : await Ne());
    return;
  }
  (e.id === "ws-root" &&
    (Rn(),
    (pe = 1),
    (le = e.value),
    (J = null),
    (xa = ""),
    (qe = ""),
    (Ve = ""),
    await Ne()),
    e.id === "ws-search" &&
      (Ve !== e.value && (++detailRequest, (pe = 1), (J = null)),
      (Ve = e.value),
      clearTimeout(Pa),
      (Pa = setTimeout(async () => {
        if (ie !== "files") return;
        try {
          if (!browserListing || browserListing.root !== le || browserListing.view !== Se ||
              (browserListing.scoped && (Ve.trim() || browserListing.folder !== qe)))
            await loadBrowserListing();
          K();
        } catch (error) {
          ce(String(error));
        }
      }, 180))),
    e.id === "ws-scope" && (xa = e.value),
    e.id === "ws-template" && (Pn = e.value),
    e.id === "ws-demo-text" && (on = e.value));
}
const y = window.garden || ai();
wo(y);
let Ie = !1,
  ea = !1,
  Ka = "screen",
  mt = !1;
const me = new URLSearchParams(location.search).has("widget"),
  te = document.querySelector("#app"),
  Ui = oo(
    te,
    async (e) => {
      var t;
      try {
        (await ((t = y.manage) == null ? void 0 : t.call(y, "rootOrder", e)),
          ce(a("폴더 순서를 저장했어요.")));
      } catch (s) {
        ce(s instanceof Error ? s.message : a("다시 시도해 주세요."));
      } finally {
        await ye();
      }
    },
    () => {
      N && K();
    },
  );
let N,
  ie = new URLSearchParams(location.search).get("page") || "garden",
  Ft = 0,
  p = null,
  bn = null,
  Oe = null,
  En = !1,
  jt = !1,
  St = null;
te.addEventListener("compositionstart", (e) => {
  St = e.target;
});
te.addEventListener("compositionend", (e) => {
  St = null;
  const t = e.target;
  (t.id === "plant-name" && p && (p.name = t.value),
    In(t),
    Mn(t),
    Bn(t),
    t.id !== "ws-search" && jt && setTimeout(() => K(), 0));
});
function Hn() {
  ((Oe = null),
    setTimeout(() => {
      jt && !Oe && ((jt = !1), K());
    }, 0));
}
te.addEventListener("focusin", (e) => {
  !En && e.target instanceof HTMLSelectElement && (Oe = e.target);
});
te.addEventListener("pointerdown", (e) => {
  e.target instanceof HTMLSelectElement && (Oe = e.target);
});
te.addEventListener("focusout", (e) => {
  e.target === Oe && Hn();
});
te.addEventListener(
  "change",
  (e) => {
    e.target instanceof HTMLSelectElement && Hn();
  },
  !0,
);
let ja = [],
  ps,
  Nn = !1,
  Cn = !1;
const B = (e) =>
    String(e ?? "").replace(
      /[&<>"']/g,
      (t) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[t],
    ),
  fs = {
    leaf: '<path d="M12 20v-9M12 14C4 14 3 9 4 4c6 0 9 3 8 8M12 10c0-5 4-7 8-7 1 5-2 9-8 9"/>',
    home: '<path d="m3 11 9-7 9 7M6 10v10h12V10M10 20v-6h4v6"/>',
    history: '<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7M12 7v6l4 2"/>',
    settings:
      '<path d="m9 3-.5 2.5-2 1.2L4 6l-2 3.5 2 1.8v2.4l-2 1.8L4 19l2.5-.7 2 1.2L9 22h4l.5-2.5 2-1.2 2.5.7 2-3.5-2-1.8v-2.4l2-1.8L18 6l-2.5.7-2-1.2L13 3Z" transform="translate(1 -.5)"/><circle cx="12" cy="12" r="3"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    folder: '<path d="M3 6h7l2 3h9v11H3z"/>',
    window:
      '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6h1m2 0h1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    file: '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 4h6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    undo: '<path d="M8 5 3 10l5 5M4 10h10a6 6 0 0 1 0 12"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
    dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
  };
function oe(e) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${fs[e] || fs.leaf}</svg>`;
}
const P = (e, t, s = "", n = "") =>
  `<button data-action="${e}" class="button ${s}" ${n}>${t}</button>`;
function ce(e) {
  var s;
  (s = document.querySelector(".toast")) == null || s.remove();
  const t = document.createElement("div");
  ((t.className = "toast"),
    t.setAttribute("role", "status"),
    (t.textContent = e),
    document.body.append(t),
    clearTimeout(ps),
    (ps = setTimeout(() => t.remove(), 6500)));
}
async function V(e) {
  try {
    (await e(), await ye());
  } catch (t) {
    (ce(t instanceof Error ? t.message : a("다시 시도해 주세요.")), await ye());
  }
}
async function ye() {
  if (Nn) {
    Cn = !0;
    return;
  }
  Nn = !0;
  try {
    if (
      ((N = await y.state()),
      no(N.settings.language),
      await ei(y, N),
      await Go(N),
      !me && ie === "themes" && (await Qo()),
      !me && y.takeReview)
    ) {
      const e = await y.takeReview();
      e && (p = { type: "plan", plan: e });
    }
    (me || (await ki(ie, N), ie === "garden" && (await ho(y, N))), K());
  } finally {
    ((Nn = !1), Cn && ((Cn = !1), ye()));
  }
}
function showPage(page) {
  ie = page || "garden";
  p = null;
  K();
  return ye();
}
function Yi(e) {
  return new Date(e).toLocaleString(Fe(), {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function Un(e) {
  return e.split(/[\\/]/).pop() || e;
}
const Wi = {
  completed: "정리 완료",
  undone: "되돌림",
  failed: "실패",
  needs_review: "확인 필요",
  planned: "확인 중",
  undo_planned: "복원 확인 중",
  not_moved: "이동 안 됨",
};
function Be() {
  return N.plants.slice(0, N.settings.visiblePlants || 3);
}
function qi() {
  return Be()
    .map(
      (e, t) => m`<article class="plant-card ${Ft === t ? "selected" : ""}" >
    <div class="plant-card-top"><span class="plant-number">0${t + 1}</span><span class="pill ${e.folder ? "" : "muted"}">${e.folder ? ks(e.xp) : a("연결 대기")}</span>${P("plant", oe("dots"), "icon-only", m`data-id="${t}" aria-label="${B(e.name)} 화분 설정"`)}</div>
    <h3>${B(e.name)} <span data-ui-label="shortcutNoun">화분</span></h3>
    <button class="folder-line" data-action="plant" data-id="${t}">${oe("folder")}<span>${e.folder ? B(Un(e.folder)) : a("폴더를 연결해 주세요")}</span></button>
    <div class="growth-track"><i style="width:${Math.min(100, (e.xp / 25) * 100)}%"></i></div>
    <div class="card-footer"><span>${e.xp}<small> / 25 성장</small></span>${P(e.folder ? "shortcut-files" : "plant", a(e.folder ? "내 파일 보기" : "폴더 연결"), "small", `data-id="${t}"`)}</div>
  </article>`,
    )
    .join("");
}
function Vi() {
  return uo(N, Be());
}
function Gi() {
  return m`<div class="section-heading"><div><span class="eyebrow">LITTLE MOMENTS</span><h1 data-ui-label="historyTitle">정리 기록</h1><p>어디로 옮겼는지, 언제 자랐는지.</p></div>${P("recover", oe("history") + a("상태 다시 확인"), "outline")}</div><section class="panel history-panel"><div class="subheading"><h2 data-ui-label="recentTitle">최근 정리</h2><span>최대 200개 표시 · 로컬 기록</span></div>${
    N.ops.length
      ? `<div class="history-list">${N.ops
          .map((e) => {
            var t, s, n;
            return m`<article class="history-row"><div class="file-symbol history-pot">${As(e.plant)}</div><div class="file-info"><strong>${B(Un(e.source))}</strong><span>${B(((t = N.plants[e.plant]) == null ? void 0 : t.name) || ((n = (s = N.managed) == null ? void 0 : s.roots.find((o) => e.destination.startsWith(o.path))) == null ? void 0 : n.path.split(/[\\/]/).pop()) || a("관리 폴더"))} 화분 · ${Yi(e.created)}</span><details><summary>경로와 상태 보기</summary><p>원래 위치: ${B(e.source)}</p><p>정리 당시 위치: ${B(e.destination)}</p>${e.error ? `<p>${B(e.error.replace("UNDO:", ""))}</p>` : ""}</details></div><span class="pill ${e.status === "completed" ? "" : "muted"}">${a(Wi[e.status] || B(e.status))}</span>${e.status === "completed" ? P("undo-open", oe("undo") + a("되돌리기"), "small outline", `data-op="${B(e.id)}" ${N.busy || N.blocked ? "disabled" : ""}`) : ""}</article>`;
          })
          .join("")}</div>`
      : m`<div class="empty-state">${oe("folder")}<h3>아직 정리한 파일이 없어요</h3><p>내 파일에서 관리 폴더를 정리하면 기록이 남아요.</p>${P("nav", a("나의 창틀로"), "primary", 'data-page="garden"')}</div>`
  }</section>`;
}
function Qi() {
  return `<section class="panel settings-panel language-panel"><h2>Language / 언어</h2><label for="app-language">${a("표시 언어")}</label><select id="app-language">${Cs(N.settings.language)}</select><p>${a("언어를 바꾸면 메인 화면과 작은 창에 바로 적용돼요. 파일명과 폴더명은 바뀌지 않아요.")}</p></section>`;
}
function Ki() {
  const e = ([t, s, n]) =>
    `<button class="nav-item ${ie === t ? "active" : ""}" data-action="nav" data-page="${t}">${oe(s)}<span data-ui-label="${{ garden: "homeTitle", files: "filesTitle", themes: "themesTitle", settings: "settingsTitle", history: "historyTitle" }[t] || ""}">${t === "rules" && n === "파일 이름 규칙" ? '<span class="rule-label-line">파일 이름</span><span class="rule-label-line">규칙</span>' : n}</span>${ie === t ? "<i></i>" : ""}</button>`;
  return (
    [
      ["garden", "home", a("홈")],
      ["files", "folder", a("내 파일")],
      ["themes", "leaf", a("테마")],
    ]
      .map(e)
      .join("") +
    `<details class="nav-settings" data-disclosure="settings-nav" ${["settings", "storage", "rules", "help"].includes(ie) ? "open" : ""}><summary>${oe("settings")}${a("설정")}</summary>${[
      ["settings", "settings", a("환경 설정")],
      ["storage", "folder", a("보관 공간")],
      ["rules", "file", a("파일 이름 규칙")],
      ["help", "leaf", a("사용 안내")],
    ]
      .map(e)
      .join("")}</details>`
  );
}
function _i() {
  const e =
      N.settings.fontChoice || (N.settings.customFont ? "custom" : "theme"),
    t = m`<nav class="settings-tabs" aria-label="설정 분류">${[
      ["screen", a("화면과 글꼴")],
      ["files", a("파일과 보관")],
      ["help", a("언어와 도움말")],
    ]
      .map(
        ([n, o]) =>
          `<button data-action="settings-tab" data-tab="${n}" aria-pressed="${Ka === n}">${o}</button>`,
      )
      .join("")}</nav>`,
    s = m`<section class="panel settings-panel"><h2>글꼴</h2><p>테마와 별개로 원하는 글꼴을 고를 수 있어요.</p><label for="font-choice">앱에 사용할 글꼴</label><select id="font-choice"><option value="theme" ${e === "theme" ? "selected" : ""}>${a("테마 글꼴 따르기")}</option><option value="system" ${e === "system" ? "selected" : ""}>${a("시스템 기본 글꼴")}</option>${Aa.map((n) => `<option value="${n.id}" ${e === n.id ? "selected" : ""}>${B(n.family)}</option>`).join("")}${N.settings.customFont ? `<option value="custom" ${e === "custom" ? "selected" : ""}>${B(N.settings.customFont.name)}</option>` : ""}</select><div class="font-preview">가나다 작은 창틀 · ABC abc · 0123456789</div><p>설정에서 고른 글꼴이 테마보다 우선해요.</p><details class="font-more"><summary>내 글꼴 가져오기 · 라이선스</summary><div class="workspace-actions">${P("font-import", a(ea ? "폰트 확인 중…" : "폰트 파일 가져오기"), "outline", `${ea || !y.font ? "disabled" : ""}`)}${P("font-reset", a("가져온 글꼴 삭제"), "outline", `${ea || !N.settings.customFont ? "disabled" : ""}`)}</div><p>TTF·OTF·WOFF·WOFF2 · 최대 20MB</p><p>기본 글꼴 5종은 SIL OFL 1.1로 제공돼요. 상업적 이용과 앱 재배포가 가능하며 라이선스 원문을 함께 포함해요.</p>${Aa.map((n) => `<details class="font-license"><summary>${B(n.family)} · OFL 1.1</summary><pre>${B(jo[n.id])}</pre></details>`).join("<br>")}</details>${Ta ? `<p role="alert">${B(Ta)}</p>` : ""}</section>`;
  return (
    m`<div class="section-heading"><div><span class="eyebrow">MAKE IT YOURS</span><h1 data-ui-label="settingsTitle">설정</h1><p>내가 쓰기 편한 작은 창틀.</p></div></div>` +
    t +
    (Ka === "screen"
      ? m`<section class="panel settings-panel"><div class="setting-row"><div><h2>화면 문구</h2><p>화분을 폴더로, 오늘의 창틀을 나만의 제목으로 바꿔요.</p></div><button class="button outline" data-action="labels-open">화면 문구 바꾸기</button></div></section>` +
        s +
        m`<section class="panel settings-panel"><h2>화분 바로가기</h2><p>화분은 1~3개만 표시해요. 개수에 맞춰 선반과 작은 창의 폭도 바뀌고, 직접 조절한 크기는 개수별로 기억해요. 숨긴 화분과 연결되지 않은 폴더도 자동 관리는 계속돼요.</p><label for="visible-plants">표시할 화분 수</label><select id="visible-plants">${[1, 2, 3].map((n) => m`<option value="${n}" ${(N.settings.visiblePlants || 3) === n ? "selected" : ""}>${n}개</option>`).join("")}</select><h2>창밖의 분위기</h2><p>정원 미리보기와 데스크톱 창틀에 적용해요.</p><div class="themes">${[
          ["sage", a("초록빛 아침")],
          ["evening", a("푸른 저녁")],
          ["cream", a("따뜻한 낮")],
        ]
          .map(
            ([n, o]) =>
              `<button class="theme ${N.settings.theme === n ? "active" : ""}" data-action="theme" data-theme="${n}"><div class="theme-swatch ${n}"><i></i><b></b></div><span>${o}</span>${N.settings.theme === n ? oe("check") : ""}</button>`,
          )
          .join(
            "",
          )}</div><div class="setting-row"><div><h3>움직임 줄이기</h3><p>잎과 나비를 멈춰 더 차분하게 감상해요.</p></div><button class="switch ${N.settings.reducedMotion ? "on" : ""}" role="switch" aria-checked="${N.settings.reducedMotion}" aria-label="움직임 줄이기" data-action="motion"><i></i></button></div><div class="setting-row"><div><h3>작은 데스크톱 창틀</h3><p>작업하는 동안 화면 구석에 정원을 놓아두세요.</p></div>${P("widget", oe("window") + a("창틀 열기"), "outline")}</div></section>`
      : Ka === "files"
        ? m`<section class="panel settings-panel"><h2>검색 결과</h2><label for="search-page-size">페이지당 파일 수</label><select id="search-page-size">${[10, 20, 50, 100].map((n) => m`<option value="${n}" ${(N.settings.searchPageSize || 20) === n ? "selected" : ""}>${n}개</option>`).join("")}</select><p>관리 폴더 전체 검색에 적용해요. 개수를 바꾸면 첫 페이지부터 보여요.</p><div class="setting-row"><div><h3>버전 보관과 용량</h3><p>보관 상태와 남은 공간을 확인해요.</p></div>${P("nav", a("보관 공간"), "outline", 'data-page="storage"')}</div><div class="setting-row"><div><h3>파일 이름 규칙</h3><p>나의 이름 규칙과 추천을 살펴봐요.</p></div>${P("nav", a("파일 이름 규칙"), "outline", 'data-page="rules"')}</div></section>`
        : Qi() +
          m`<section class="panel settings-panel"><h2>도움이 필요할 때</h2><div class="workspace-actions">${P("tutorial-start", a("첫 정리 다시 해보기"), "outline")}${P("nav", a("사용 안내"), "outline", 'data-page="help"')}${P("nav", a("정리 기록 보기"), "outline", 'data-page="history"')}</div>${No(!!y.diagnostics)}<p>v${B(N.version)} · ${B(N.platform)}</p></section>`)
  );
}
function ms() {
  var o, i, c, u, d, r, f, b, j, v, T, I;
  if (!p) return "";
  let e = "",
    t = "",
    s = "";
  const n = N.plants[p.id ?? Ft];
  if (p.type === "dash-plants")
    ((t = a("화분 설정")),
      (e = '<div class="plant-grid">' + qi() + "</div>"),
      (s = P("close", a("닫기"), "outline")));
  else if (p.type === "dash-open-info")
    ((t = a("열려 있는 파일")),
      (e = m`<p>앱에서 연 파일의 기록을 보여요. 외부 프로그램에서 지금 열려 있는지는 확인할 수 없어요.</p><p>파일을 누르면 상세에서 다시 열거나 버전을 확인할 수 있어요.</p>`),
      (s = P("close", a("닫기"), "outline")));
  else if (p.type === "labels")
    ((t = a("화면 문구 바꾸기")),
      (e = vo()),
      (s = P("close", a("닫기"), "outline")));
  else if (p.type === "diagnostics")
    ((t = a("진단 파일 만들기")),
      (e = Co(p.result, p.error)),
      (s =
        P("close", a("닫기"), "outline", Ie ? "disabled" : "") +
        P(
          "diagnostics-export",
          a(Ie ? "저장 중…" : "진단 파일 저장"),
          "primary",
          Ie ? "disabled" : "",
        )));
  else if (p.type === "intro")
    ((t = a("작은 창틀에 오신 걸 환영해요")),
      (e = a(
        '<div class="intro-art"><canvas id="intro-scene"></canvas></div><p class="intro-lead">파일을 정리하면,<br>당신의 창틀이 자라요.</p><ol class="intro-steps"><li><b>01</b><span>화분마다 파일을 모아둘 폴더를 연결해요.</span></li><li><b>02</b><span>내 파일에서 폴더를 고르고 추천 위치를 확인해요.</span></li><li><b>03</b><span>정리가 끝나면 식물이 조금씩 자라요.</span></li></ol><p class="subtle">자리를 비워도 시들지 않아요. 당신의 속도로 돌봐 주세요.</p>',
      )),
      (s =
        P("intro-later", a("먼저 둘러보기"), "outline") +
        P("intro-start", a("첫 화분 연결하기 ") + oe("arrow"), "primary")));
  else if (p.type === "plant" || p.type === "bind") {
    t = m`${n.name} 화분`;
    const h = (((o = N.managed) == null ? void 0 : o.roots) || []).find(
        (A) => A.path === n.folder,
      ),
      l = p.shortcutRoot ?? (h == null ? void 0 : h.id) ?? "",
      g = (((i = N.managed) == null ? void 0 : i.roots) || []).find(
        (A) => A.id === l,
      ),
      z = !!g && (g.plant == null || g.plant === n.id);
    ((e = m`<div class="pot-detail"><span class="large-leaf">${oe("leaf")}</span><div><span class="eyebrow">${ks(n.xp)}</span><h3>성장 ${n.xp}점</h3><p>${Zn(n.xp) ? m`다음 모습까지 ${Zn(n.xp) - n.xp}점 남았어요.` : a("꽃이 활짝 피었어요. 오늘도 잘 자랐네요.")}</p></div></div><label class="field-label" for="plant-name">화분 이름</label><form id="plant-name-form" class="plant-name-editor"><input id="plant-name" maxlength="24" value="${B(p.name ?? n.name)}" autocomplete="off" aria-describedby="plant-name-help" ${p.updating || p.linking ? "disabled" : ""}>${P("rename-plant", p.updating ? a("저장 중…") : a("이름 저장"), "primary", `type="submit" ${p.updating || p.linking ? "disabled" : ""}`)}</form><p id="plant-name-help" class="subtle">${a("화분 이름은 1~12자로 입력해 주세요.")}</p>${p.error ? `<p role="alert" class="plan-feedback">${B(p.error)}</p>` : ""}<label class="field-label" for="shortcut-root">연결할 관리 폴더</label><select id="shortcut-root" aria-describedby="shortcut-help" data-plant="${n.id}" ${p.linking ? "disabled" : ""}><option value="">관리 폴더 선택</option>${(((c = N.managed) == null ? void 0 : c.roots) || []).map((A) => `<option value="${B(A.id)}" ${A.id === l ? "selected" : ""} ${A.plant !== null && A.plant !== n.id ? "disabled" : ""}>${B(A.path)}</option>`).join("")}</select><p id="shortcut-help" class="subtle">폴더를 고른 뒤 아래 버튼을 눌러 연결을 완료해 주세요.</p><label class="field-label">현재 연결된 폴더</label><div class="path-box shortcut-current">${oe("folder")}<span>${n.folder ? B(n.folder) : a("아직 연결된 폴더가 없어요.")}</span>${n.folder ? P("open-folder", a("폴더 열기"), "small outline", `data-id="${n.id}"`) : ""}</div><p class="subtle">화분은 빠른 접근을 위한 바로가기예요.<br>바로가기를 바꿔도 이전 폴더의 관리와 버전 이력은 유지돼요.</p>`),
      (s =
        P(
          "bind",
          oe("folder") + a("다른 폴더 선택"),
          "outline",
          `data-id="${n.id}" ${p.linking ? "disabled" : ""}`,
        ) +
        P(
          "confirm-shortcut",
          p.linking
            ? a("연결 중…")
            : (g == null ? void 0 : g.path) === n.folder
              ? a("확인")
              : a("이 폴더로 연결"),
          "primary",
          `data-id="${n.id}" ${!z || p.linking || p.updating || p.linking ? "disabled" : ""}`,
        )));
  } else if (p.type === "plan") {
    const h = p.plan,
      l = h.rows.filter((w) => w.status === "ready").length;
    t = m`${N.plants[h.plant].name} 화분으로 정리`;
    const g = h.mode || "move",
      z = [
        ...new Set([
          h.folder,
          ...h.rows.flatMap((w) => {
            var F;
            return ((F = w.recommendation) == null ? void 0 : F.folders) || [];
          }),
        ]),
      ],
      A = h.rows.every((w) => {
        var F;
        return (
          w.destinationFolder ===
          ((F = h.rows[0]) == null ? void 0 : F.destinationFolder)
        );
      })
        ? (u = h.rows[0]) == null
          ? void 0
          : u.destinationFolder
        : "",
      $ =
        N.native && h.layout !== "structure" && h.rows.length > 1
          ? m`<div class="plan-bulk"><label for="plan-bulk">전체 목적지</label><select id="plan-bulk" ${p.updating || p.linking ? "disabled" : ""}><option value="">파일마다 선택</option>${z.map((w) => `<option value="${B(w)}" ${w === A ? "selected" : ""}>${B(w.replace(h.folder, "") || a("(전체 폴더)"))}</option>`).join("")}</select><small>모든 파일에 같은 위치를 적용해요.</small></div>`
          : "";
    e = m`<p>추천 위치와 작업 방식을 확인해 주세요.</p>${N.native ? m`<label class="field-label" for="plan-mode">작업 방식</label><select id="plan-mode" ${p != null && p.updating ? "disabled" : ""}><option value="copy" ${g === "copy" ? "selected" : ""}>복사 · 원본 유지</option><option value="move" ${g === "move" ? "selected" : ""}>이동 · 원래 위치에서 옮김</option></select>` : ""}${ko(h, p.updating)}<div class="path-box">${oe("folder")}<span>${B(h.folder)}</span></div>${$}<div class="preview-list">${h.rows
      .map((w, F) => {
        var R;
        return `<div class="preview-row">${oe("file")}<div><strong>${B(w.relative || w.name)}</strong><span>${B(w.reason || a("실행 준비 완료"))}</span>${
          w.recommendation
            ? m`<label for="destination-${F}">목적지 폴더</label><select id="destination-${F}" data-destination="${F}" ${p != null && p.updating ? "disabled" : ""}><option value="">직접 위치를 선택해 주세요</option>${[
                ...new Set([
                  ...w.recommendation.candidates.map((U) => U.folder),
                  ...w.recommendation.folders,
                ]),
              ]
                .map((U) => {
                  var Me;
                  return `<option value="${B(U)}" ${U === (w.destinationFolder ?? w.destination.slice(0, w.destination.lastIndexOf(N.platform === "win32" ? "\\" : "/"))) ? "selected" : ""}>${B(U.replace(h.folder, "") || a("(전체 폴더)"))}${((Me = w.recommendation.candidates.find((ze) => ze.folder === U)) == null ? void 0 : Me.score) > 0 ? a(" · 추천") : ""}</option>`;
                })
                .join(
                  "",
                )}</select><small>${B((R = w.recommendation.candidates[0]) == null ? void 0 : R.reason)}</small>`
            : ""
        }<small>${B(w.destination)}</small></div><span class="pill ${w.status === "ready" ? "" : "muted"}">${w.status === "ready" ? a(g === "copy" ? "복사" : "이동") : w.status === "choose" ? a("선택 필요") : a("건너뜀")}</span></div>`;
      })
      .join(
        "",
      )}</div>${N.native ? m`<label class="once-option"><input id="plan-once" type="checkbox" ${p != null && p.updating ? "disabled" : ""} ${h.once ? "checked" : ""}> 이번 선택은 추천 학습에서 제외</label>` : ""}<p class="subtle">${N.native ? a("파일을 먼저 복사·이동하고 버전은 백그라운드에서 보관해요. 같은 이름은 덮어쓰지 않아요. 보관 전 수정·삭제된 중간 내용은 남지 않을 수 있어요.") : a("체험용 정리예요. 실제 파일에는 아무 변화가 없어요.")}</p>`;
    const C = h.rows.filter((w) => w.status === "choose").length,
      S = p.updating
        ? a("선택한 위치를 확인하고 있어요…")
        : p.error
          ? m`확인 실패: ${p.error}`
          : C
            ? m`${C}개 파일의 목적지 폴더를 선택해 주세요.`
            : l
              ? h.rows.some((w) => w.status === "skipped")
                ? a(
                    "처리 가능한 파일만 실행하고, 위에 안내한 항목은 건너뛰어요.",
                  )
                : ""
              : [...new Set(h.rows.map((w) => w.reason).filter(Boolean))].join(
                  " ",
                );
    (S && (e += `<p class="plan-feedback" role="status">${B(S)}</p>`),
      (s =
        P("close", a("취소"), "outline") +
        P(
          "execute",
          p.updating
            ? a("확인 중…")
            : m`${l}개 ${N.native ? a(g === "copy" ? "복사" : "이동") : a("체험 정리")}`,
          "primary",
          l &&
            !p.updating &&
            !p.error &&
            !h.rows.some((w) => w.status === "choose")
            ? ""
            : "disabled",
        )));
  } else if (p.type === "manage-root") {
    const h = p.result;
    ((t = a("이 폴더의 버전관리를 시작할까요?")),
      (e = m`<div class="path-box">${B(h.folder)}</div><p>선택한 폴더와 하위 폴더의 기존·신규 파일을 관리해요.</p><p>확인한 파일 ${h.count}개 · 원본 크기 합계 ${(h.bytes / 1024 / 1024).toFixed(1)}MiB · 제외 ${h.excluded}개</p><p>${h.complete ? a("목록 확인 완료") : a("일부 경로를 확인하지 못했어요. 부분 관리로 시작해요.")}</p>${h.issues.length ? m`<details><summary>제외·보관 불가 확인</summary>${h.issues.map((l) => `<p>${B(l)}</p>`).join("")}</details>` : ""}<p>버전은 이 기기에 보관하며 수정할수록 공간이 늘어요. 기존 파일을 자동 재배치하지 않아요.</p><p class="subtle">파일당 100MiB까지 보관해요. 보관 한도는 설정의 보관 공간에서 확인하고 바꿀 수 있어요. 앱 완전 종료 중의 중간 변경은 기록되지 않아요. 연결·클라우드 경로와 실행 중 DB는 지원하지 않아요.</p>${h.gitReady ? "" : a('<p class="inline-warning">버전 저장소 상태를 먼저 확인해 주세요.</p>')}`),
      (s =
        P("close", a("나중에"), "outline") +
        P(
          "confirm-root",
          a("이 폴더 관리 시작"),
          "primary",
          h.gitReady && !p.linking ? "" : "disabled",
        )));
  } else if (p.type === "tasks")
    ((t = a("작업 상태")),
      (e = co(N, mt)),
      (s = P("close", a("닫기"), "outline")));
  else if (p.type === "working" || p.type === "collecting")
    ((t = a(
      p.type === "collecting"
        ? "폴더와 파일을 확인하고 있어요."
        : "파일을 정리하고 있어요",
    )),
      (e = `<div class="working"><span class="spinner"></span><h3>${B(((d = N.progress) == null ? void 0 : d.name) || a("파일 상태를 확인하고 있어요"))}</h3><p role="status">${B(a(((r = N.progress) == null ? void 0 : r.phase) || ""))}</p><p>${N.progress ? m`${N.progress.current} / ${N.progress.total}개 처리` : a("잠시만 기다려 주세요.")}</p></div>`),
      (e += `<p class="task-wait" data-task-wait role="status">${B(xn(N))}</p>`),
      (s =
        P("close", a("접어 두기"), "outline") +
        P(
          "cancel",
          a(
            (f = N.progress) != null && f.cancelRequested
              ? "중지 요청됨"
              : "남은 작업 중지",
          ),
          "outline",
          (b = N.progress) != null && b.cancelRequested ? "disabled" : "",
        )));
  else if (p.type === "result") {
    const h = p.result.rows,
      l = h.filter((g) => g.status === "completed").length;
    ((t = a(l ? "파일 전달 완료" : "정리 결과를 확인해 주세요")),
      (e = m`<div class="result-badge">${oe(l ? "check" : "file")}</div><h3 class="result-title">${l}개 정리 완료</h3><p class="center">${N.native ? a("파일 전달 완료 · 버전 보관은 백그라운드에서 계속돼요.") : a("체험 정리에 성공했어요. 실제 파일은 그대로예요.")}</p><div class="preview-list">${h.map((g) => `<div class="preview-row">${oe("file")}<div><strong>${B(g.name)}</strong><span>${B(g.reason || (g.status === "completed" ? a("정리 완료") : a("정리하지 않음")))}</span></div></div>`).join("")}</div>`),
      (s =
        P("result-history", a("기록 · 되돌리기"), "outline") +
        P(
          "nav",
          a(
            ((j = N.tutorial) == null ? void 0 : j.status) === "active"
              ? "보관 확인으로"
              : "정원으로",
          ),
          "primary",
          `data-page="${((v = N.tutorial) == null ? void 0 : v.status) === "active" ? "tutorial" : "garden"}"`,
        )));
  } else if (p.type === "undo") {
    const h = p.result,
      l = N.ops.find((z) => z.id === h),
      g = (l == null ? void 0 : l.mode) === "copy";
    ((t = a(
      g ? "앱이 만든 사본을 회수할까요?" : "파일을 원래 자리로 돌려놓을까요?",
    )),
      (e = m`<p><strong>${B(l && Un(l.source))}</strong></p><div class="path-box">${oe("undo")}<span>${B(g ? (l == null ? void 0 : l.destination) : l == null ? void 0 : l.source)}</span></div><p>이 정리로 받은 성장 ${(l == null ? void 0 : l.reward) || 0}점도 되돌려요.</p><p class="subtle">${a(g ? "원본은 그대로 두고, 수정되지 않은 사본을 회수 폴더로 옮겨요. 사본이 수정되었다면 자동으로 회수하지 않아요." : "원래 위치에 같은 파일이 있거나 이동 후 수정된 경우에는 자동으로 복원하지 않아요.")}</p>`),
      (s =
        P("close", a("취소"), "outline") +
        P("undo-confirm", a("되돌리기"), "primary")));
  } else
    p.type === "menu" &&
      ((t = a("작은 창틀")),
      (e = m`<div class="menu-list">${P("manager", a("정원 관리 열기"))}${P("widget", a("정리 모드로 보기"))}${P("click-through", a("클릭 통과로 감상하기"), "", N.canClickThrough ? "" : "disabled")}<p class="subtle">클릭 통과 모드에서는 트레이 메뉴의 ‘창틀 정리 모드’로 돌아올 수 있어요.</p>${P("quit", a("앱 종료"), "outline")}</div>`));
  return `<div class="modal-backdrop"><section class="modal ${(I = (T = p.plan) == null ? void 0 : T.inventory) != null && I.folders ? "folder-review" : ""}" role="dialog" aria-busy="${p.updating ? "true" : "false"}" aria-modal="true" aria-labelledby="modal-title"><header><h2 id="modal-title">${t}</h2>${P("close", oe("close"), "icon-only", a('aria-label="닫기"'))}</header><div class="modal-content">${e}</div>${s ? `<footer>${s}</footer>` : ""}</section></div>`;
}
function Ks() {
  const list = document.querySelector(".root-pot-list");
  const selected = list?.querySelector(".root-pot-card.selected");
  if (!selected) return;
  if (selected.offsetLeft < list.scrollLeft) list.scrollLeft = selected.offsetLeft;
  else if (selected.offsetLeft + selected.offsetWidth > list.scrollLeft + list.clientWidth)
    list.scrollLeft = selected.offsetLeft + selected.offsetWidth - list.clientWidth;
}
window.addEventListener("resize", () => requestAnimationFrame(Ks));
let gs = "",
  vs = "",
  bs;
function Ns(e) {
  const t = JSON.stringify([
    N.settings.uiLabels,
    N.settings.language,
    N.themes,
    N.settings.theme,
    N.settings.reducedMotion,
    jn(),
    Be().map((s) => s.xp),
  ]);
  if (e === gs && t === vs && bs === pa()) return !1;
  for (const s of ja) s();
  return (
    (ja = []),
    Ds(),
    (te.innerHTML = e),
    (gs = e),
    (vs = t),
    (bs = pa()),
    !0
  );
}
function K() {
  var b, j, v, T, I;
  if (!N) return;
  if (Ui()) {
    jt = !0;
    return;
  }
  if (St != null && St.isConnected) {
    jt = !0;
    return;
  }
  if (Oe != null && Oe.isConnected && document.activeElement === Oe) {
    jt = !0;
    return;
  }
  jt = !1;
  const e = new Map(
      Array.from(te.querySelectorAll("details[data-disclosure]")).map((h) => [
        h.dataset.disclosure,
        h.open,
      ]),
    ),
    t = !!p && p === bn,
    s = t
      ? (b = te.querySelector(".modal-content")) == null
        ? void 0
        : b.scrollTop
      : void 0;
  if (
    (p == null ? void 0 : p.type) === "plan" &&
    bn === p &&
    te.querySelector(".modal-backdrop")
  )
    return;
  const n = Be().length,
    o = Ss(n);
  for (const [h, l] of Object.entries({
    "plant-count": n,
    "scene-width": o,
    "scene-ratio": o / 150,
    "hero-width": `${o * 1.2}px`,
    "scene-inset": `${(27 / o) * 100}%`,
  }))
    document.documentElement.style.setProperty(`--${h}`, String(l));
  const i =
      (j = document.querySelector(".root-pot-card.selected")) == null
        ? void 0
        : j.dataset.root,
    c = Array.from(
      document.querySelectorAll(
        ".folder-columns,.folder-entries,.root-pot-list,.dash-file-list,.dash-usage-list",
      ),
    ).map((h) => {
      var l;
      return {
        key:
          h.className +
          ((l = h.parentElement) == null
            ? void 0
            : l.getAttribute("aria-label")),
        x: h.scrollLeft,
        y: h.scrollTop,
      };
    }),
    u = (v = document.activeElement) == null ? void 0 : v.id,
    d =
      document.activeElement instanceof HTMLInputElement
        ? document.activeElement.selectionStart
        : null;
  if (
    ((document.body.className = `${me ? "widget-body" : ""} theme-${N.settings.theme}`),
    document.documentElement.classList.toggle("widget-html", me),
    me)
  ) {
    if (
      !Ns(
        m`<div class="widget"><header class="widget-toolbar"><button class="widget-resize" aria-label="창틀 크기 조절" title="왼쪽 위로 끌어 크기 조절">⌜</button><span class="widget-drag" title="끌어서 위치 이동">${oe("leaf")}</span>${P("manager", oe("window"), "icon-only", a('aria-label="정원 관리 열기" title="정원 관리 열기"'))}${P("menu", oe("dots"), "icon-only", a('aria-label="창틀 메뉴" title="창틀 메뉴"'))}</header><div class="widget-scene"><canvas id="widget-scene" aria-label="작은 도트 창틀"></canvas><div class="widget-targets">${Be()
          .map(
            (l) =>
              m`<button style="left:${((82 + 110 * l.id) / o) * 100}%;width:${(64 / o) * 100}%" data-action="widget-pick" data-drop-plant="${l.id}" data-id="${l.id}" title="${B(l.name)} · 클릭하면 연결 폴더 열기" aria-label="${B(l.name)} 화분 폴더 열기"></button>`,
          )
          .join("")}</div></div></div>${ms()}`,
      )
    )
      return;
    const h = document.querySelector("#widget-scene");
    ja.push(
      Ha(h, () => {
        var l;
        return {
          xp: Be().map((g) => g.xp),
          count: Be().length,
          reduced:
            N.settings.reducedMotion ||
            jn() ||
            !["runner", "fireflies"].includes(
              (l = pa()) == null ? void 0 : l.builtin,
            ),
          backdrop: !1,
          tiny: !0,
          custom: pa(),
        };
      }),
    );
  } else {
    if (
      !Ns(
        m`<div class="app-shell"><aside class="sidebar"><a class="brand" aria-label="작은 창틀" href="#" data-action="nav" data-page="garden"><span class="brand-symbol">${oe("leaf")}</span><span><span data-ui-label="brandTitle">작은 창틀</span><small>LITTLE WINDOWSILL</small></span></a><div class="nav-label" data-ui-label="sidebarCaption">나의 작은 공간</div><nav>${Ki()}</nav><div class="sidebar-bottom"><div class="little-quote">작은 정리가<br>초록이 되는 곳.</div><span class="local-status"><i></i>${N.native ? a("관리 파일에서 보관 상태 확인") : a("샘플 정원 · 실제 파일 변경 없음")}</span><small>PROTOTYPE ${B(N.version)}</small></div></aside><main><div class="topbar"><span data-ui-label="topCaption">${N.native ? a("나만의 작은 생태계") : a("브라우저 체험 · 실제 파일은 이동하지 않아요")}</span><span class="topbar-right">${oe("leaf")} SLOW & GROW</span></div><div class="page-content">${io(N)}${N.blocked && !N.busy ? m`<div class="recovery-banner"><span>이전 정리에서 확인이 필요한 파일이 있어요. 새 파일 정리를 잠시 멈췄어요.</span>${P("recover", a("다시 확인"), "small")}${P("nav", a("기록 보기"), "small", 'data-page="history"')}</div>` : ""}${ie === "tutorial" ? zo(N) : ["files", "rules", "help", "storage"].includes(ie) ? Ii(ie, N) : ie === "history" ? Gi() : ie === "settings" ? _i() : ie === "themes" ? Zo() : Vi()}<footer class="page-footer"><span>서두르지 않아도 괜찮아요. 초록은 조금씩 자라니까요.</span><span>${oe("leaf")} ${a("작은 창틀")}</span></footer></div>${lo(N)}</main></div>${ms()}`,
      )
    )
      return;
    const h = document.querySelector("#hero");
    h &&
      ja.push(
        Ha(h, () => ({
          xp: Be().map((l) => l.xp),
          count: Be().length,
          backdrop: !1,
          theme: N.settings.theme,
          reduced: N.settings.reducedMotion || jn(),
          custom: pa(),
        })),
      );
  }
  (mo(te, N.settings.uiLabels), !me && ie === "themes" && Ko());
  const r = document.querySelector("#intro-scene");
  if (
    (r &&
      ja.push(
        Ha(r, () => ({
          xp: [12, 25, 25],
          backdrop: !0,
          reduced: N.settings.reducedMotion,
        })),
      ),
    u)
  ) {
    En = !0;
    const h = document.getElementById(u);
    (h == null || h.focus({ preventScroll: !0 }),
      h instanceof HTMLInputElement &&
        d !== null &&
        ["text", "search", "url", "tel", "password"].includes(h.type) &&
        h.setSelectionRange(d, d),
      (En = !1));
  }
  (p &&
    !t &&
    !u &&
    ((T = document.querySelector(".modal button")) == null ||
      T.focus({ preventScroll: !0 })),
    document
      .querySelectorAll(
        ".folder-columns,.folder-entries,.root-pot-list,.dash-file-list,.dash-usage-list",
      )
      .forEach((h) => {
        const l = c.find((g) => {
          var z;
          return (
            g.key ===
            h.className +
              ((z = h.parentElement) == null
                ? void 0
                : z.getAttribute("aria-label"))
          );
        });
        l && ((h.scrollLeft = l.x), (h.scrollTop = l.y));
      }),
    i !==
      ((I = document.querySelector(".root-pot-card.selected")) == null
        ? void 0
        : I.dataset.root) && Ks(),
    (bn = p),
    te.querySelectorAll("details[data-disclosure]").forEach((h) => {
      e.has(h.dataset.disclosure) && (h.open = e.get(h.dataset.disclosure));
    }),
    ws());
  const f = te.querySelector(".modal-content");
  f && s !== void 0 && (f.scrollTop = s);
}
function savePlantName(form) {
  const dialog = p;
  if (!dialog || !["plant", "bind"].includes(dialog.type) || dialog.updating || dialog.linking) return;
  const input = form?.querySelector("#plant-name");
  if (!input || St === input) return;
  const name = input.value;
  dialog.name = name;
  dialog.updating = true;
  dialog.error = "";
  K();
  V(async () => {
    try {
      const state = await y.renamePlant(dialog.id, name);
      const plant = N.plants.find((entry) => entry.id === dialog.id);
      const saved = state?.plants?.find((entry) => entry.id === dialog.id);
      if (plant) plant.name = saved?.name ?? name.trim();
      if (p === dialog) {
        p = null;
        K();
        ce(a("화분 이름을 변경했어요."));
      }
    } catch (error) {
      if (p === dialog) {
        dialog.updating = false;
        dialog.error = error instanceof Error ? a(error.message) : a("이름을 확인해 주세요.");
        K();
      }
    }
  });
}
te.addEventListener("submit", (e) => {
  if (e.target.id === "plant-name-form") {
    e.preventDefault();
    savePlantName(e.target);
  } else if (e.target.id === "theme-auth-form") {
    e.preventDefault();
    V(() => Ps("tm-auth-submit", e.target));
  }
});
te.addEventListener("input", (e) => {
  St ||
    e.isComposing ||
    (e.target.id === "plant-name" && p && (p.name = e.target.value),
    In(e.target),
    Mn(e.target),
    Bn(e.target));
});
te.addEventListener("change", (e) => {
  var d, r, f, b, j;
  if (e.target.id === "app-language") {
    V(() => y.setting("language", e.target.value));
    return;
  }
  const t = e.target;
  if (t.id === "ui-label-key") {
    (In(t), K());
    return;
  }
  if (t.id === "theme-rights") {
    (Mn(t), K());
    return;
  }
  if (t.id === "shortcut-root" && p && !p.linking) {
    ((p.shortcutRoot = t.value), (p.error = ""), K());
    return;
  }
  if (t.id === "search-page-size") {
    V(() => y.setting("searchPageSize", Number(t.value)));
    return;
  }
  if (t.id === "home-destination") {
    ((Ft = Number(t.value)), K());
    return;
  }
  if (t.id === "font-choice") {
    V(() => y.setting("fontChoice", t.value));
    return;
  }
  if (t.id === "visible-plants") {
    V(() => y.setting("visiblePlants", Number(t.value)));
    return;
  }
  if (t.id === "ws-root" || t.id === "storage-budget") {
    V(() => Bn(t));
    return;
  }
  if (
    !(p != null && p.plan) ||
    p.updating ||
    !y.revise ||
    !(
      t.id === "plan-mode" ||
      t.id === "plan-once" ||
      t.id === "plan-bulk" ||
      t.id === "plan-layout" ||
      t.id === "plan-base" ||
      t.hasAttribute("data-destination")
    ) ||
    (t.id === "plan-bulk" && !t.value)
  )
    return;
  const s = p.plan,
    n = {};
  (s.rows.forEach((v, T) => {
    var I;
    n[v.source] =
      t.id === "plan-bulk"
        ? t.value
        : ((I = document.getElementById(`destination-${T}`)) == null
            ? void 0
            : I.value) || "";
  }),
    (d = s.inventory) != null &&
      d.folders &&
      (n.__base =
        ((r = document.getElementById("plan-base")) == null
          ? void 0
          : r.value) ||
        s.base ||
        s.folder));
  const o =
      ((f = document.getElementById("plan-layout")) == null
        ? void 0
        : f.value) || s.layout,
    i =
      ((b = document.getElementById("plan-mode")) == null ? void 0 : b.value) ||
      "copy",
    c =
      ((j = document.getElementById("plan-once")) == null
        ? void 0
        : j.checked) || !1,
    u = {
      type: "plan",
      updating: !0,
      plan: {
        ...s,
        mode: i,
        once: c,
        rows: s.rows.map((v) => ({ ...v, destinationFolder: n[v.source] })),
      },
    };
  ((p = u),
    K(),
    V(async () => {
      try {
        const v = await y.revise(s.id, i, n, c, o);
        p === u && (p = { type: "plan", plan: v });
      } catch (v) {
        p === u &&
          (p = {
            ...u,
            updating: !1,
            error:
              v instanceof Error
                ? v.message
                : a("목적지를 다시 확인해 주세요."),
          });
      }
    }));
});
function prepareFolderColumn(button) {
  if (ie === "files" && button?.isConnected && browserListing?.scoped && browserListing.root === le)
    readFolderColumn(button.dataset.path).catch(() => {});
}
let folderHoverTimer;
te.addEventListener("pointerover", event => {
  const button = event.target.closest(".folder-entry");
  if (button && !button.contains(event.relatedTarget) && !event.buttons) {
    clearTimeout(folderHoverTimer);
    folderHoverTimer = setTimeout(() => {
      if (button.matches(":hover") && !columnReads.size) prepareFolderColumn(button);
    }, 80);
  }
});
te.addEventListener("pointerdown", event => {
  if (event.button !== 0 || ie !== "files") return;
  prepareFolderColumn(event.target.closest(".folder-entry"));
  const file = event.target.closest('[data-action="ws-timeline"]');
  if (!file) return;
  const entry = { root: le, id: file.dataset.file };
  preparedTimeline = entry;
  entry.read = W.manage("timeline", entry.id).then(value => (entry.value = value));
  entry.read.catch(() => { if (preparedTimeline === entry) preparedTimeline = null; });
  setTimeout(() => { if (preparedTimeline === entry) preparedTimeline = null; }, 1000);
});
te.addEventListener("focusin", event => prepareFolderColumn(event.target.closest(".folder-entry")));
te.addEventListener("click", (e) => {
  var i, c, u, d;
  const t = te.querySelector(".file-management-menu[open]");
  t && !e.target.closest(".file-management-menu") && (t.open = !1);
  const s = e.target.closest("[data-action]");
  if (!s || (e.preventDefault(), s.disabled)) return;
  const n = s.dataset.action,
    o = Number(s.dataset.id ?? Ft);
  if (n === "dash-root" || n === "dash-file") {
    (n === "dash-file"
      ? $i(s.dataset.root, s.dataset.file)
      : za(s.dataset.root),
      (ie = "files"),
      (p = null),
      ye());
    return;
  }
  if (n === "dash-plants" || n === "dash-open-info") {
    ((p = { type: n }), K());
    return;
  }
  if (n === "labels-open") {
    (go(N.settings.uiLabels), (p = { type: "labels" }), K());
    return;
  }
  if (n != null && n.startsWith("labels-")) {
    V(async () => {
      (await bo(n, y, K)) && ((p = null), ce(a("문구를 저장했어요.")));
    });
    return;
  }
  if (n === "diagnostics-preview") {
    if (Ie || !y.diagnostics) return;
    ((Ie = !0),
      (async () => {
        try {
          p = { type: "diagnostics", result: await y.diagnostics("preview") };
        } catch (r) {
          ce(r instanceof Error ? r.message : a("다시 시도해 주세요."));
        } finally {
          ((Ie = !1), K());
        }
      })());
    return;
  }
  if (n === "diagnostics-export") {
    if (Ie || (p == null ? void 0 : p.type) !== "diagnostics" || !y.diagnostics)
      return;
    const r = p;
    ((Ie = !0),
      K(),
      (async () => {
        try {
          (await y.diagnostics("export", r.result.token)).saved
            ? (p === r && (p = null),
              ce(a("진단 파일을 저장했어요. 개발자에게 직접 전달해 주세요.")))
            : ce(a("저장을 취소했어요."));
        } catch (f) {
          p === r &&
            (r.error =
              f instanceof Error ? f.message : a("다시 시도해 주세요."));
        } finally {
          ((Ie = !1), K());
        }
      })());
    return;
  }
  if (!(n === "close" && Ie)) {
    if (
      n === "tutorial-start" ||
      n === "tutorial-skip" ||
      n === "tutorial-finish"
    ) {
      V(async () => {
        var r;
        (await ((r = y.manage) == null
          ? void 0
          : r.call(y, "tutorial", n.slice(9))),
          (p = null),
          (ie = n === "tutorial-start" ? "tutorial" : "garden"));
      });
      return;
    }
    if (n != null && n.startsWith("tm-")) {
      V(() => Ps(n, s));
      return;
    }
    if (n != null && n.startsWith("ws-")) {
      if (ie === "files" && browserActions.has(n)) Hi(n, s).catch(error => ce(String(error)));
      else V(() => Hi(n, s));
      return;
    }
    if (n === "settings-tab") ((Ka = s.dataset.tab || "screen"), K());
    else if (n === "tasks-open") ((p = { type: "tasks" }), K());
    else if (n === "task-retry") {
      if (mt || !y.taskRetry) return;
      ((mt = !0),
        K(),
        V(async () => {
          try {
            p = { type: "plan", plan: await y.taskRetry(s.dataset.task) };
          } finally {
            mt = !1;
          }
        }));
    } else if (n === "aftercare-retry")
      V(async () => {
        var r;
        (await ((r = y.manage) == null
          ? void 0
          : r.call(y, "aftercare-retry", s.dataset.task)),
          ce(a("보관을 다시 시작해요.")));
      });
    else if (
      n === "task-check" ||
      n === "task-scan" ||
      n === "task-scan-retry"
    ) {
      if (mt) return;
      ((mt = !0),
        K(),
        V(async () => {
          var r, f;
          try {
            (n === "task-check"
              ? await y.recover()
              : n === "task-scan"
                ? await ((r = y.manage) == null
                    ? void 0
                    : r.call(y, "scan", s.dataset.root))
                : await ((f = y.manage) == null ? void 0 : f.call(y, "retry")),
              ce(a("파일 상태를 다시 확인했어요.")));
          } finally {
            mt = !1;
          }
        }));
    } else if (n === "nav")
      showPage(s.dataset.page);
    else if (n === "font-import" || n === "font-reset") {
      if (ea || !y.font) return;
      ((ea = !0),
        K(),
        V(async () => {
          try {
            n === "font-import"
              ? await Jo(y)
              : (await y.font("reset"), await y.setting("fontChoice", "theme"));
          } finally {
            ea = !1;
          }
        }));
    } else if (n === "plant")
      ((Ft = o), (p = { type: "plant", id: o, name: N.plants[o].name }), K());
    else if (n === "rename-plant") savePlantName(s.form);
    else if (n === "shortcut-files") {
      const r =
        (i = N.managed) == null
          ? void 0
          : i.roots.find((f) => {
              var b;
              return f.path === ((b = N.plants[o]) == null ? void 0 : b.folder);
            });
      (r && za(r.id), (ie = "files"), (p = null), ye());
    } else if (n === "pick" || n === "widget-pick")
      me
        ? V(() => (N.plants[o].folder ? y.openFolder(o) : y.manager()))
        : ((ie = "files"), (p = null), ye());
    else if (n === "close") ((p = null), K());
    else if (n === "confirm-shortcut") {
      const r = p;
      if (!r || r.linking || r.updating || !y.manage) return;
      const f = N.plants[o],
        b =
          r.shortcutRoot ??
          ((u = (((c = N.managed) == null ? void 0 : c.roots) || []).find(
            (v) => v.path === f.folder,
          )) == null
            ? void 0
            : u.id),
        j = (((d = N.managed) == null ? void 0 : d.roots) || []).find(
          (v) => v.id === b,
        );
      if (!j || (j.plant != null && j.plant !== o)) return;
      if (j.path === f.folder) {
        ((p = null), K());
        return;
      }
      ((r.linking = !0),
        (r.error = ""),
        K(),
        V(async () => {
          try {
            (await y.manage("shortcut", j.id, o),
              p === r && ((p = null), ce(a("화분 바로가기를 바꿨어요."))));
          } catch (v) {
            p === r &&
              ((r.linking = !1),
              (r.error =
                v instanceof Error ? v.message : a("다시 시도해 주세요.")));
          }
        }));
    } else if (n === "bind")
      V(async () => {
        const r = await y.bind(
          o,
          (p == null ? void 0 : p.name) || N.plants[o].name,
        );
        r !== null &&
          (r != null && r.token
            ? (p = { type: "manage-root", result: r })
            : ((p = null), ce(a("화분에 폴더를 연결했어요."))));
      });
    else if (n === "confirm-root") {
      const dialog = p;
      if (dialog?.type !== "manage-root" || dialog.linking) return;
      dialog.linking = true;
      K();
      V(async () => {
        try {
          const root = await y.manage("confirmRoot", dialog.result.token);
          za(typeof root === "string" ? root : root.id);
          if (p === dialog) p = null;
          ie = N.tutorial?.status === "active" ? "tutorial" : "files";
          K();
          ce(a("폴더 관리를 시작했어요. 첫 버전 보관 상태를 확인해 주세요."));
        } finally {
          dialog.linking = false;
        }
      });
    } else if (n === "execute") {
      const r = p == null ? void 0 : p.plan;
      if (!r) return;
      ((p = { type: "working" }),
        K(),
        V(async () => {
          try {
            const f = await y.execute(r.id);
            (p == null ? void 0 : p.type) === "working"
              ? (p = { type: "result", result: f })
              : ce(a("정리 결과를 작업 상태에서 확인해 주세요."));
          } catch (f) {
            throw ((p = null), f);
          }
        }));
    } else if (n === "result-history") ((ie = "history"), (p = null), K());
    else if (n === "undo-open")
      ((p = { type: "undo", result: s.dataset.op }), K());
    else if (n === "undo-confirm") {
      const r = p == null ? void 0 : p.result;
      V(async () => {
        (await y.undo(r), (p = null), ce(a("정리 작업을 되돌렸어요.")));
      });
    } else
      n === "widget"
        ? V(() => y.widget())
        : n === "manager"
          ? V(() => y.manager())
          : n === "open-folder"
            ? V(() => y.openFolder(o))
            : n === "theme"
              ? V(async () => {
                  (y.themes && (await y.themes("activate", null)),
                    await y.setting("theme", s.dataset.theme));
                })
              : n === "motion"
                ? V(() => y.setting("reducedMotion", !N.settings.reducedMotion))
                : n === "intro"
                  ? ((p = null), (ie = "help"), ye())
                  : n === "intro-start" || n === "intro-later"
                    ? V(async () => {
                        (await y.setting("onboarded", !0),
                          (p =
                            n === "intro-start"
                              ? { type: "bind", id: 0, name: N.plants[0].name }
                              : null));
                      })
                    : n === "recover"
                      ? V(async () => {
                          (await y.recover(),
                            ce(a("파일 상태를 다시 확인했어요.")));
                        })
                      : n === "cancel"
                        ? V(() => y.cancel())
                        : n === "menu"
                          ? me && y.widgetMenu
                            ? y.widgetMenu()
                            : ((p = { type: "menu" }), K())
                          : n === "click-through"
                            ? V(async () => {
                                ((p = null), await y.view(!0));
                              })
                            : n === "quit" && V(() => y.quit());
  }
});
te.addEventListener("pointerdown", (e) => {
  if (!y.widgetGesture || e.button !== 0) return;
  const handle = e.target.closest(".widget-resize, .widget-drag");
  if (!handle) return;
  e.preventDefault();
  y.widgetGesture(handle.matches(".widget-resize") ? "resize" : "move")
    .catch((error) => ce(String(error)));
});
te.addEventListener("contextmenu", (e) => {
  me && y.widgetMenu && (e.preventDefault(), y.widgetMenu());
});
document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", (e) => e.preventDefault());
po(te, {
  blocked: () => !!N.busy || !!N.blocked || !!p,
  notice: (e) => ce(a(e)),
  receive: async (e, t) => {
    var s;
    if (!((s = N.plants[t]) != null && s.folder)) {
      ce(a("화분에 폴더를 먼저 연결해 주세요."));
      return;
    }
    if (!N.native) {
      ce(a("데스크톱 앱에서 파일을 정리해 주세요."));
      return;
    }
    ((Ft = t),
      me
        ? ce(a("파일을 확인한 뒤 관리 화면에서 복사·이동을 선택해 주세요."))
        : ((p = { type: "collecting" }), K()),
      await V(async () => {
        try {
          const n = await y.drop(e, t);
          me || (p = n ? { type: "plan", plan: n } : null);
        } catch (n) {
          throw (me || (p = null), n);
        }
      }));
  },
});
document.addEventListener("keydown", (e) => {
  var t;
  if (
    !document.querySelector("dialog.management-dialog[open]") &&
    !(St || e.isComposing)
  ) {
    if (e.key === "Escape") {
      const s = te.querySelector(".file-management-menu[open]");
      if (s) {
        ((s.open = !1), (t = s.querySelector("summary")) == null || t.focus());
        return;
      }
    }
    if (e.key === "Escape" && Oe) {
      Hn();
      return;
    }
    if (p && (e.key === "Escape" && ((p = null), K()), e.key === "Tab")) {
      const s = Array.from(
        document.querySelectorAll(
          ".modal button:not(:disabled), .modal input, .modal select, .modal a, .modal summary",
        ),
      );
      if (!s.length) return;
      const n = s[0],
        o = s[s.length - 1];
      e.shiftKey && document.activeElement === n
        ? (e.preventDefault(), o.focus())
        : !e.shiftKey &&
          document.activeElement === o &&
          (e.preventDefault(), n.focus());
    }
  }
});
let wn = !1;
Ti({
  api: y,
  notify: ce,
  redraw: ye,
  navigate: (e) => {
    ((ie = e), (p = null));
  },
  connect: (e, t) => {
    if (t) {
      if (wn) return;
      ((wn = !0),
        V(async () => {
          try {
            const s = await y.bind(e, N.plants[e].name);
            s != null && s.token && (p = { type: "manage-root", result: s });
          } finally {
            wn = !1;
          }
        }));
    } else
      e === -1
        ? V(async () => {
            const s = await y.bind(-1, "");
            s != null && s.token && (p = { type: "manage-root", result: s });
          })
        : ((Ft = e), (p = { type: "bind", id: e, name: N.plants[e].name }));
  },
});
async function Xi() {
  var e, t;
  ((N = await y.state()),
    !me && ((e = N.tutorial) == null ? void 0 : e.status) === "active"
      ? (ie = "tutorial")
      : !me && Ao(N)
        ? (ie = "help")
        : !me && !N.native && !N.settings.onboarded && (p = { type: "intro" }),
    y.subscribe(() => {
      ye();
    }),
    (t = y.onNavigate) == null ||
      t.call(y, showPage),
    await ye());
}
Xi().catch((e) => {
  te.textContent = m`작은 창틀을 불러오지 못했어요. ${String(e)}`;
});
Vo(y, K, ce);
setInterval(() => {
  if (!N || me) return;
  const e = xn(N);
  document.querySelectorAll("[data-task-wait]").forEach((t) => {
    t.textContent !== e && (t.textContent = e);
  });
}, 1e3);
