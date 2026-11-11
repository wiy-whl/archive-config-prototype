function showToast(msg) {
  let c = document.querySelector('.toast-container');
  if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
}

function openModal(id) { document.getElementById(id)?.classList.add('show'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('show'); }

const MetadataStore = {
  KEY: 'kg_biz_metadata',

  getDefault() {
    return [
      { id: 'm1', fieldName: '警种', description: '所属警种分类', type: 'enum', listDisplay: true, usedForSearch: true, usedForStats: true, enumOptions: [
        { label: '技侦', value: 'jizhen' }, { label: '刑侦', value: 'xingzhen' }, { label: '治安', value: 'zhian' }, { label: '交警', value: 'jiaojing' }
      ]},
      { id: 'm2', fieldName: '责任人', description: '数据表责任人', type: 'input', listDisplay: true, usedForSearch: true, usedForStats: true },
      { id: 'm3', fieldName: '数据更新时间', description: '用于计算的日期型字段', type: 'date', listDisplay: false, usedForSearch: false, usedForStats: false },
    ];
  },

  getAll() {
    const data = localStorage.getItem(this.KEY);
    const panguData = localStorage.getItem('pangu_biz_metadata');
    if (data) return JSON.parse(data);
    if (panguData) return JSON.parse(panguData);
    return this.getDefault();
  },

  getListDisplayFields() {
    return this.getAll().filter(m => m.listDisplay);
  },

  getById(id) {
    return this.getAll().find(m => m.id === id);
  },

  formatValue(field, value) {
    if (!value && value !== 0) return '-';
    if (field.type === 'enum' && field.enumOptions) {
      const opt = field.enumOptions.find(o => o.value === value || o.label === value);
      return opt ? opt.label : value;
    }
    return value;
  }
};

function renderKgTopHeader() {
  return `
    <header class="kg-top-header">
      <a href="index.html" class="kg-logo">
        <span class="kg-logo-icon">⬡</span>
        <span class="kg-logo-text">高级搜索</span>
      </a>
      <div class="kg-header-right">
        <span>📚 zf物流(管理员) ▾</span>
        <span style="display:flex;align-items:center;gap:8px">
          <span class="kg-user-avatar">A</span> admin
        </span>
      </div>
    </header>
  `;
}

function renderKgSidebar(activePage) {
  const dataPages = ['datasource', 'mapping'];
  const dataExpanded = dataPages.includes(activePage) ? 'expanded' : '';
  const submenuShow = dataPages.includes(activePage) ? 'show' : '';
  const archivePages = ['archive-tpl', 'archive-col'];
  const archiveExpanded = archivePages.includes(activePage) ? 'expanded' : '';
  const archiveSubShow = archivePages.includes(activePage) ? 'show' : '';
  return `
    <aside class="kg-sidebar">
      <nav class="kg-menu">
        <a class="kg-menu-item" href="index.html"><span class="kg-menu-icon">🏠</span> 首页</a>
        <a class="kg-menu-item" href="#"><span class="kg-menu-icon">🔗</span> 知识管理</a>
        <a class="kg-menu-item ${activePage === 'search-app' ? 'active' : ''}" href="search-app-management.html">
          <span class="kg-menu-icon">🔍</span> 应用管理
        </a>
        <div class="kg-menu-group">
          <div class="kg-menu-group-title ${archiveExpanded}" id="archiveMenuToggle">
            <span class="kg-menu-icon">👤</span> 档案配置
            <span class="kg-menu-arrow">▶</span>
          </div>
          <div class="kg-submenu ${archiveSubShow}" id="archiveSubmenu">
            <a class="kg-submenu-item ${activePage === 'archive-tpl' ? 'active' : ''}" href="archive-template.html">档案配置</a>
          </div>
        </div>
        <div class="kg-menu-group">
          <div class="kg-menu-group-title ${dataExpanded}" id="dataMenuToggle">
            <span class="kg-menu-icon">💾</span> 数据管理
            <span class="kg-menu-arrow">▶</span>
          </div>
          <div class="kg-submenu ${submenuShow}" id="dataSubmenu">
            <a class="kg-submenu-item ${activePage === 'datasource' ? 'active' : ''}" href="datasource.html">数据接入</a>
            <a class="kg-submenu-item" href="#">数据目录</a>
            <a class="kg-submenu-item ${activePage === 'mapping' ? 'active' : ''}" href="#">数据映射</a>
          </div>
        </div>
        <a class="kg-menu-item" href="#"><span class="kg-menu-icon">⚙</span> 系统管理</a>
      </nav>
      <div class="kg-sidebar-collapse">☰ 收起导航</div>
    </aside>
  `;
}

function renderKgPageHeader(title) {
  return `<div class="kg-page-header">${title}</div>`;
}

function bindKgSidebar() {
  [['dataMenuToggle', 'dataSubmenu'], ['archiveMenuToggle', 'archiveSubmenu']].forEach(([toggleId, subId]) => {
    const toggle = document.getElementById(toggleId);
    const sub = document.getElementById(subId);
    if (toggle && sub) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('expanded');
        sub.classList.toggle('show');
      });
    }
  });
}

function initKgLayout(activePage, pageTitle) {
  const top = document.getElementById('topHeader');
  const sidebar = document.getElementById('sidebar');
  const pageHeader = document.getElementById('pageHeader');
  if (top) top.innerHTML = renderKgTopHeader();
  if (sidebar) sidebar.innerHTML = renderKgSidebar(activePage);
  if (pageHeader) pageHeader.innerHTML = renderKgPageHeader(pageTitle);
  bindKgSidebar();
}

function bindModalClose() {
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) o.classList.remove('show'); });
  });
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });
}

document.addEventListener('DOMContentLoaded', bindModalClose);

function withQuery(url, params) {
  if (!url || url === '#') return url;
  const hashIdx = url.indexOf('#');
  const hash = hashIdx >= 0 ? url.slice(hashIdx) : '';
  const base = hashIdx >= 0 ? url.slice(0, hashIdx) : url;
  const [path, existing] = base.split('?');
  const sp = new URLSearchParams(existing || '');
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v == null || v === '') sp.delete(k);
    else sp.set(k, v);
  });
  const q = sp.toString();
  return `${path}${q ? '?' + q : ''}${hash}`;
}

const SearchAppStore = {
  KEY: 'kg_search_apps',
  VER_KEY: 'kg_search_apps_ver',
  DATA_VERSION: '5',
  APP_CATEGORIES: [
    { id: 'bigdata', label: '大数据应用' },
    { id: 'general', label: '通用应用' },
    { id: 'tool', label: '工具软件' }
  ],

  getDefault() {
    return [
      {
        id: 'app_batch_query',
        name: '批量查询',
        description: '基于证件号码、手机号或车牌号批量上传，在数据表配置范围内表输出全部查询结果',
        type: 'builtin',
        appCategory: 'bigdata',
        appKind: 'batch_query',
        enabled: true,
        iconColor: 'blue',
        iconEmoji: '📋',
        portalUrl: 'batch-query.html',
        createTime: '2026-07-01 10:00:00',
        updateTime: '2026-08-12 09:30:00',
        creator: 'admin',
        tableCount: 3
      },
      {
        id: 'app_super_search',
        name: '精确搜',
        description: '输入证件号码、手机号或关键词，在数据表配置范围内精确检索单表或全部可查表',
        type: 'builtin',
        appCategory: 'bigdata',
        appKind: 'super_search',
        enabled: true,
        iconColor: 'green',
        iconEmoji: '🔍',
        portalUrl: 'super-search.html',
        createTime: '2026-07-01 10:00:00',
        updateTime: '2026-08-12 09:30:00',
        creator: 'admin',
        tableCount: 5
      },
      {
        id: 'app_call_analysis',
        name: '话单分析',
        description: '对通话记录进行频次、时段与关联对象分析，辅助研判通讯关系',
        type: 'api',
        appCategory: 'general',
        enabled: true,
        iconColor: 'purple',
        iconEmoji: '📞',
        portalUrl: '',
        apiConfig: { endpoint: 'https://api.example.com/call/analyze', method: 'POST', authType: 'token', token: '***', callbackUrl: '' },
        createTime: '2026-08-01 10:00:00',
        updateTime: '2026-08-18 11:20:00',
        creator: 'admin',
        tableCount: 0
      },
      {
        id: 'app_fund_analysis',
        name: '资金分析',
        description: '面向资金流水的对手方、时段与异常交易分析',
        type: 'api',
        appCategory: 'general',
        enabled: true,
        iconColor: 'orange',
        iconEmoji: '💰',
        portalUrl: '',
        apiConfig: { endpoint: 'https://api.example.com/fund/analyze', method: 'POST', authType: 'token', token: '***', callbackUrl: '' },
        createTime: '2026-08-01 10:10:00',
        updateTime: '2026-08-18 11:20:00',
        creator: 'admin',
        tableCount: 0
      },
      {
        id: 'app_train_schedule',
        name: '列车时刻表查询',
        description: '按车次、站点与日期查询列车时刻与经停信息',
        type: 'api',
        appCategory: 'general',
        enabled: true,
        iconColor: 'blue',
        iconEmoji: '🚄',
        portalUrl: '',
        apiConfig: { endpoint: 'https://api.example.com/train/schedule', method: 'GET', authType: 'none', token: '', callbackUrl: '' },
        createTime: '2026-08-02 09:00:00',
        updateTime: '2026-08-19 15:00:00',
        creator: 'admin',
        tableCount: 0
      },
      {
        id: 'app_flight_schedule',
        name: '航班时刻表',
        description: '按航班号、机场与日期查询航班时刻与航站信息',
        type: 'api',
        appCategory: 'general',
        enabled: true,
        iconColor: 'green',
        iconEmoji: '✈️',
        portalUrl: '',
        apiConfig: { endpoint: 'https://api.example.com/flight/schedule', method: 'GET', authType: 'none', token: '', callbackUrl: '' },
        createTime: '2026-08-02 09:10:00',
        updateTime: '2026-08-19 15:00:00',
        creator: 'admin',
        tableCount: 0
      },
      {
        id: 'app_image_parse',
        name: '图片解析',
        description: '解析图片中的文字、对象与场景信息',
        type: 'api',
        appCategory: 'tool',
        enabled: true,
        iconColor: 'purple',
        iconEmoji: '🖼️',
        portalUrl: '',
        apiConfig: { endpoint: 'https://api.example.com/tool/image-parse', method: 'POST', authType: 'token', token: '***', callbackUrl: '' },
        createTime: '2026-08-05 14:00:00',
        updateTime: '2026-08-20 10:00:00',
        creator: 'admin',
        tableCount: 0
      },
      {
        id: 'app_ocr',
        name: 'OCR识别',
        description: '对证件、票据与截图进行文字识别',
        type: 'api',
        appCategory: 'tool',
        enabled: true,
        iconColor: 'orange',
        iconEmoji: '📝',
        portalUrl: '',
        apiConfig: { endpoint: 'https://api.example.com/tool/ocr', method: 'POST', authType: 'token', token: '***', callbackUrl: '' },
        createTime: '2026-08-05 14:10:00',
        updateTime: '2026-08-20 10:00:00',
        creator: 'admin',
        tableCount: 0
      },
      {
        id: 'app_watermark',
        name: '图片去水印',
        description: '去除图片水印并尽量保留原始画面细节',
        type: 'api',
        appCategory: 'tool',
        enabled: true,
        iconColor: 'blue',
        iconEmoji: '✨',
        portalUrl: '',
        apiConfig: { endpoint: 'https://api.example.com/tool/dewatermark', method: 'POST', authType: 'token', token: '***', callbackUrl: '' },
        createTime: '2026-08-05 14:20:00',
        updateTime: '2026-08-20 10:00:00',
        creator: 'admin',
        tableCount: 0
      },
      {
        id: 'app_pdf2word',
        name: 'pdf转word',
        description: '将 PDF 文档转换为可编辑的 Word 文件',
        type: 'api',
        appCategory: 'tool',
        enabled: true,
        iconColor: 'green',
        iconEmoji: '📄',
        portalUrl: '',
        apiConfig: { endpoint: 'https://api.example.com/tool/pdf2word', method: 'POST', authType: 'token', token: '***', callbackUrl: '' },
        createTime: '2026-08-05 14:30:00',
        updateTime: '2026-08-20 10:00:00',
        creator: 'admin',
        tableCount: 0
      },
      {
        id: 'app_image_enhance',
        name: '图片清晰度提升',
        description: '对模糊、低分辨率图片进行清晰度增强',
        type: 'api',
        appCategory: 'tool',
        enabled: true,
        iconColor: 'purple',
        iconEmoji: '🪄',
        portalUrl: '',
        apiConfig: { endpoint: 'https://api.example.com/tool/enhance', method: 'POST', authType: 'token', token: '***', callbackUrl: '' },
        createTime: '2026-08-05 14:40:00',
        updateTime: '2026-08-20 10:00:00',
        creator: 'admin',
        tableCount: 0
      }
    ];
  },

  getAll() {
    const storedVer = localStorage.getItem(this.VER_KEY);
    const data = localStorage.getItem(this.KEY);
    if (!data || storedVer !== this.DATA_VERSION) {
      const oldList = data ? JSON.parse(data) : [];
      const defaults = this.getDefault();
      const defaultIds = new Set(defaults.map(a => a.id));
      const dropped = new Set(['app_hologram', 'app_graph_analysis']);
      const extras = oldList
        .filter(a => !defaultIds.has(a.id) && !dropped.has(a.id))
        .map(a => this.migrateApp(a));
      const merged = [...defaults, ...extras];
      this.save(merged);
      localStorage.setItem(this.VER_KEY, this.DATA_VERSION);
      return merged;
    }
    return JSON.parse(data).map(a => this.migrateApp(a));
  },

  migrateApp(app) {
    if (!app.appCategory) app.appCategory = this.getAppCategory(app);
    if (app.appCategory === 'bigdata') {
      const kind = this.getAppKind(app);
      if (kind && !app.appKind) app.appKind = kind;
    } else {
      app.appKind = null;
    }
    if (app.id === 'app_super_search' && app.name === '全警通查') app.name = '精确搜';
    return app;
  },

  getAppCategory(app) {
    if (!app) return 'general';
    if (app.appCategory) return app.appCategory;
    if (this.getAppKind(app)) return 'bigdata';
    return 'general';
  },

  getAppCategoryLabel(cat) {
    const hit = this.APP_CATEGORIES.find(c => c.id === cat);
    return hit ? hit.label : '—';
  },

  getCategoryTagClass(cat) {
    return { bigdata: 'tag-blue', general: 'tag-green', tool: 'tag-orange' }[cat] || 'tag-gray';
  },

  countByCategory(list) {
    const counts = { all: list.length, bigdata: 0, general: 0, tool: 0 };
    list.forEach(app => {
      const cat = this.getAppCategory(app);
      if (counts[cat] != null) counts[cat] += 1;
    });
    return counts;
  },

  getAppKind(app) {
    if (!app) return null;
    if (app.appCategory && app.appCategory !== 'bigdata') return null;
    if (app.appKind) return app.appKind;
    if (app.id === 'app_batch_query' || (app.portalUrl || '').includes('batch-query')) return 'batch_query';
    if (app.id === 'app_super_search' || (app.portalUrl || '').includes('super-search')) return 'super_search';
    return null;
  },

  getAppKindLabel(kind) {
    return { batch_query: '批量查询', super_search: '精确搜' }[kind] || '—';
  },

  getPortalUrlByKind(kind) {
    return { batch_query: 'batch-query.html', super_search: 'super-search.html' }[kind] || '';
  },

  buildPortalHref(app) {
    if (!app?.portalUrl) return '#';
    const kind = this.getAppKind(app);
    if (!kind) return app.portalUrl;
    return withQuery(app.portalUrl, { appId: app.id });
  },

  getDefaultIconByKind(kind) {
    return { batch_query: '📋', super_search: '🔍' }[kind] || '📱';
  },

  getDefaultColorByKind(kind) {
    return { batch_query: 'blue', super_search: 'green' }[kind] || 'blue';
  },

  save(list) {
    localStorage.setItem(this.KEY, JSON.stringify(list));
  },

  getById(id) {
    return this.getAll().find(a => a.id === id);
  },

  getEnabled() {
    return this.getAll().filter(a => a.enabled);
  },

  generateId() {
    return 'app_' + Date.now().toString(36);
  },

  getTypeLabel(type) {
    return { builtin: '内置应用', manual: '创建应用', api: '三方应用接入' }[type] || type;
  },

  initDefaults() {
    this.getAll();
  }
};

SearchAppStore.initDefaults();

const CatalogStore = {
  LEGACY_KEY: 'kg_data_catalog',
  POOL_KEY: 'kg_data_catalog_pool',
  APP_KEY_PREFIX: 'kg_app_catalog_',
  VER_KEY: 'kg_app_catalog_ver',
  DATA_VERSION: '1',
  _currentAppId: null,

  getFolderDefaults() {
    return [
      { id: 'root', name: '全部数据', parentId: null, level: 0 },
      { id: 'f_demo', name: '示例数据', parentId: 'root', level: 1 },
      { id: 'f_mfg', name: '制造业', parentId: 'f_demo', level: 2 },
      { id: 'f_tob', name: '烟草', parentId: 'f_demo', level: 2 },
      { id: 'f_pwr', name: '电力', parentId: 'f_demo', level: 2 },
      { id: 'f_nrg', name: '能源', parentId: 'f_demo', level: 2 },
      { id: 'f_fin', name: '金融', parentId: 'f_demo', level: 2 },
      { id: 'f_gov', name: '政务', parentId: 'f_demo', level: 2 },
      { id: 'f_ps', name: '公安', parentId: 'f_demo', level: 2 },
      { id: 'f_lib', name: '图书馆', parentId: 'root', level: 1 }
    ];
  },

  getAssignablePoolDefault() {
    return [
      { id: 'at1', lib: '字典库', group: null, name: 'dict_code_table', metadata: { m1: 'zhian', m2: '王五' } },
      { id: 'at1b', lib: '字典库', group: null, name: 'dict_region_table', metadata: { m1: 'jizhen', m2: '张三' } },
      { id: 'at2', lib: '原始库', group: null, name: 'raw_table_1', metadata: { m1: 'jizhen', m2: '赵六' } },
      { id: 'at2b', lib: '原始库', group: null, name: 'raw_import_log', metadata: { m1: 'xingzhen', m2: '李四' } },
      { id: 'at3', lib: '标准库', group: '公安', name: '电话通联虚拟数据', metadata: { m1: 'jizhen', m2: '张三' } },
      { id: 'at4', lib: '标准库', group: '公安', name: '警情虚拟数据', metadata: { m1: 'xingzhen', m2: '李四' } },
      { id: 'at5', lib: '标准库', group: '公安', name: '旅业住宿虚拟数据', metadata: { m1: 'zhian', m2: '王五' } },
      { id: 'at6', lib: '标准库', group: '公安', name: '案件嫌疑人信息虚拟数据', metadata: { m1: 'jiaojing', m2: '陈七' } },
      { id: 'at7', lib: '标准库', group: '公安', name: '案件虚拟数据', metadata: { m1: 'jizhen', m2: '张怀森' } },
      { id: 'at8', lib: '标准库', group: '公安', name: '民航订票虚拟数据', metadata: { m1: 'xingzhen', m2: '李四' } },
      { id: 'at9', lib: '主题库', group: '制造业', name: 'topic_mfg_output', metadata: { m1: 'jizhen', m2: '张三' } },
      { id: 'at10', lib: '主题库', group: '政务', name: 'topic_gov_service', metadata: { m1: 'zhian', m2: '王五' } },
      { id: 'at11', lib: '主题库', group: '金融', name: 'topic_fin_risk', metadata: { m1: 'xingzhen', m2: '李四' } },
      { id: 'at12', lib: '关系库', group: null, name: 'rel_person_org', metadata: { m1: 'jizhen', m2: '陈七' } },
      { id: 'at13', lib: '关系库', group: null, name: 'rel_case_person', metadata: { m1: 'xingzhen', m2: '张怀森' } },
      { id: 'at14', lib: '关系库', group: null, name: 'rel_org_org', metadata: { m1: 'jiaojing', m2: '赵六' } },
      { id: 'at15', lib: '标签库', group: null, name: 'tag_entity', metadata: { m1: 'zhian', m2: '王五' } },
      { id: 'at16', lib: '标签库', group: null, name: 'tag_event', metadata: { m1: 'jizhen', m2: '张三' } },
      { id: 'at17', lib: '标签库', group: null, name: 'tag_relation', metadata: { m1: 'xingzhen', m2: '李四' } }
    ];
  },

  makeTable(id, name, folderId, count, metadata, extra = {}) {
    return {
      id,
      name,
      folderId,
      count,
      updateTime: extra.updateTime || '2026-07-22 08:23:24',
      desc: extra.desc || '暂无描述',
      metadata: metadata || {},
      sourceId: extra.sourceId || id,
      scopeConfig: extra.scopeConfig || null
    };
  },

  getDefaultTablesForApp(appId) {
    const app = typeof SearchAppStore !== 'undefined' ? SearchAppStore.getById(appId) : null;
    const kind = app ? SearchAppStore.getAppKind(app) : null;
    const idCardMap = {
      batchQueryFields: [
        { fieldId: 'fd2', fieldName: '证件号码', enabled: true, templateType: 'id' }
      ]
    };
    if (kind === 'batch_query' || appId === 'app_batch_query') {
      return [
        this.makeTable('t_bq_hotel', '旅业住宿虚拟数据', 'f_ps_hotel', 45, { m1: 'zhian', m2: '王五' }, { sourceId: 'at5', scopeConfig: { fieldScope: 'all', selectedFieldIds: [], filterMode: 'condition', conditions: [], expression: '', ...idCardMap } }),
        this.makeTable('t_bq_suspect', '案件嫌疑人信息虚拟数据', 'f_ps_case', 32, { m1: 'jiaojing', m2: '陈七' }, { sourceId: 'at6', scopeConfig: { fieldScope: 'all', selectedFieldIds: [], filterMode: 'condition', conditions: [], expression: '', ...idCardMap } }),
        this.makeTable('t_bq_flight', '民航订票虚拟数据', 'f_ps_flight', 28, { m1: 'xingzhen', m2: '李四' }, { sourceId: 'at8', scopeConfig: { fieldScope: 'all', selectedFieldIds: [], filterMode: 'condition', conditions: [], expression: '', ...idCardMap } })
      ];
    }
    return [
      this.makeTable('t_ss_call', '电话通联虚拟数据', 'f_ps', 120, { m1: 'jizhen', m2: '张三' }, { sourceId: 'at3' }),
      this.makeTable('t_ss_case', '警情虚拟数据', 'f_ps', 86, { m1: 'xingzhen', m2: '李四' }, { sourceId: 'at4' }),
      this.makeTable('t_ss_hotel', '旅业住宿虚拟数据', 'f_ps', 45, { m1: 'zhian', m2: '王五' }, { sourceId: 'at5' }),
      this.makeTable('t_ss_aj', '案件虚拟数据', 'f_ps', 32, { m1: 'jizhen', m2: '张怀森' }, { sourceId: 'at7' }),
      this.makeTable('t_ss_book', 'bookMate', 'f_lib', 5, { m1: 'jizhen', m2: '张三' }, { sourceId: 't1' })
    ];
  },

  catalogKey(appId) {
    return this.APP_KEY_PREFIX + (appId || 'default');
  },

  getAssignablePool() {
    let pool;
    try {
      const raw = localStorage.getItem(this.POOL_KEY);
      pool = raw ? JSON.parse(raw) : null;
    } catch (e) {
      pool = null;
    }
    const defaults = this.getAssignablePoolDefault();
    if (!pool || !Array.isArray(pool)) return defaults.map(t => ({ ...t }));
    const ids = new Set(pool.map(t => t.id));
    defaults.forEach(t => {
      if (!ids.has(t.id)) pool.push({ ...t });
    });
    return pool;
  },

  syncAddedFlags(data) {
    const used = new Set();
    (data.tables || []).forEach(t => {
      if (t.sourceId) used.add(t.sourceId);
      if (t.name) used.add(t.name);
    });
    data.assignableTables = (data.assignableTables || []).map(t => ({
      ...t,
      added: used.has(t.id) || used.has(t.name)
    }));
  },

  migrateLegacy(appId) {
    if (localStorage.getItem(this.VER_KEY) === this.DATA_VERSION) return;
    const legacyRaw = localStorage.getItem(this.LEGACY_KEY);
    if (legacyRaw && appId === 'app_super_search' && !localStorage.getItem(this.catalogKey(appId))) {
      try {
        const old = JSON.parse(legacyRaw);
        localStorage.setItem(this.catalogKey(appId), JSON.stringify({
          folders: old.folders || this.getFolderDefaults(),
          tables: (old.tables || []).map(t => ({ ...t, sourceId: t.sourceId || t.id, scopeConfig: t.scopeConfig || null }))
        }));
      } catch (e) { /* ignore */ }
    }
    localStorage.setItem(this.VER_KEY, this.DATA_VERSION);
  },

  load(appId) {
    appId = appId || 'default';
    this._currentAppId = appId;
    this.migrateLegacy(appId);
    let catalog;
    try {
      const raw = localStorage.getItem(this.catalogKey(appId));
      catalog = raw ? JSON.parse(raw) : null;
    } catch (e) {
      catalog = null;
    }
    if (!catalog) {
      catalog = {
        folders: this.getFolderDefaults(),
        tables: this.getDefaultTablesForApp(appId)
      };
      localStorage.setItem(this.catalogKey(appId), JSON.stringify(catalog));
    }
    catalog.tables = (catalog.tables || []).map(t => ({
      ...t,
      metadata: t.metadata && Object.keys(t.metadata).length ? t.metadata : {},
      sourceId: t.sourceId || t.id,
      scopeConfig: t.scopeConfig || null
    }));
    catalog.folders = catalog.folders?.length ? catalog.folders : this.getFolderDefaults();
    if (this.splitDemoTableFolders(catalog)) {
      localStorage.setItem(this.catalogKey(appId), JSON.stringify({
        folders: catalog.folders,
        tables: catalog.tables
      }));
    }
    catalog.assignableTables = this.getAssignablePool();
    this.syncAddedFlags(catalog);
    return catalog;
  },

  save(data, appId) {
    appId = appId || this._currentAppId || 'default';
    this._currentAppId = appId;
    const catalog = {
      folders: data.folders || [],
      tables: data.tables || []
    };
    localStorage.setItem(this.catalogKey(appId), JSON.stringify(catalog));
    if (data.assignableTables) {
      const pool = data.assignableTables.map(t => {
        const { added, ...rest } = t;
        return rest;
      });
      localStorage.setItem(this.POOL_KEY, JSON.stringify(pool));
    }
    if (appId && appId !== 'default' && typeof SearchAppStore !== 'undefined') {
      const list = SearchAppStore.getAll().map(a =>
        a.id === appId ? { ...a, tableCount: catalog.tables.length } : a
      );
      SearchAppStore.save(list);
    }
  },

  generateId(prefix) {
    return prefix + '_' + Date.now().toString(36);
  },

  splitDemoTableFolders(catalog) {
    const plan = [
      ['f_ps_hotel', '旅业', 't_bq_hotel'],
      ['f_ps_case', '案件', 't_bq_suspect'],
      ['f_ps_flight', '民航', 't_bq_flight']
    ];
    let changed = false;
    plan.forEach(([folderId, name, tableId]) => {
      const table = (catalog.tables || []).find(t => t.id === tableId);
      if (!table) return;
      if (!(catalog.folders || []).some(f => f.id === folderId)) {
        catalog.folders.push({ id: folderId, name, parentId: 'f_ps', level: 3 });
        changed = true;
      }
      if (table.folderId !== folderId) {
        table.folderId = folderId;
        changed = true;
      }
    });
    return changed;
  }
};

const FavoriteAppStore = {
  KEY: 'kg_portal_favorite_apps',

  getDefaultIds() {
    return ['app_batch_query', 'app_super_search', 'app_call_analysis', 'app_fund_analysis'];
  },

  loadIds() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) {
        const ids = JSON.parse(raw);
        if (Array.isArray(ids)) return ids;
      }
    } catch (e) { /* ignore */ }
    return null;
  },

  getIds() {
    return this.loadIds() || this.getDefaultIds();
  },

  save(ids) {
    localStorage.setItem(this.KEY, JSON.stringify(ids));
  },

  getApps() {
    const enabledMap = new Map(SearchAppStore.getEnabled().map(a => [a.id, a]));
    return this.getIds()
      .filter(id => enabledMap.has(id))
      .map(id => enabledMap.get(id));
  },

  count() {
    return this.getApps().length;
  }
};
