function portalToast(msg) {
  let c = document.querySelector('.toast-container');
  if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
}

const PORTAL_PROJECT_KEY = 'kg_portal_current_project';

const PORTAL_PROJECTS = [
  { id: 'zhzfxsla_ontology', name: 'zhzfxsla_ontology' },
  { id: 'minhang_kb', name: 'minhang_kb' },
  { id: 'elb_civil', name: 'ELB_Civil_Ontology' },
  { id: 'zlcs', name: 'zlcs' },
  { id: 'zl_mobile', name: 'zl移动', role: '管理员' },
  { id: 'sinograin_final', name: '终版中粮业务本体' },
  { id: 'fujian_ps', name: '福建省厅知识图谱' },
  { id: 'demo_kb', name: 'demo_knowledge_base' }
];

function getCurrentPortalProject() {
  const saved = localStorage.getItem(PORTAL_PROJECT_KEY);
  return PORTAL_PROJECTS.find(p => p.id === saved)
    || PORTAL_PROJECTS.find(p => p.id === 'zl_mobile')
    || PORTAL_PROJECTS[0];
}

function formatProjectDisplayName(project) {
  if (!project) return 'zl移动(管理员)';
  return project.role ? `${project.name}(${project.role})` : project.name;
}

function renderPortalProjectListItems(keyword, activeId) {
  const kw = (keyword || '').trim().toLowerCase();
  const list = PORTAL_PROJECTS.filter(p => {
    if (!kw) return true;
    const hay = `${p.name} ${p.role || ''}`.toLowerCase();
    return hay.includes(kw);
  });
  if (!list.length) {
    return '<div class="portal-project-empty">无匹配项目</div>';
  }
  return list.map(p => `
    <button type="button" class="portal-project-item ${p.id === activeId ? 'active' : ''}" data-project-id="${p.id}">
      <span class="portal-project-item-name">${p.name}</span>
      <span class="portal-project-item-arrow">›</span>
    </button>`).join('');
}

function renderPortalHeader(activeNav) {
  const navs = [
    { id: 'home', label: '首页', href: 'home.html' },
    { id: 'graph', label: '图析', href: '#' },
    { id: 'apps', label: '应用超市', href: '#' },
    { id: 'ai', label: '智能研判', href: '#', arrow: true },
    { id: 'mine', label: '我的', href: '#', arrow: true },
  ];
  const currentProject = getCurrentPortalProject();
  const projectDisplay = formatProjectDisplayName(currentProject);
  return `
    <header class="kg-top-header">
      <a href="home.html" class="kg-logo">
        <span class="kg-logo-icon">⬡</span>
        <span class="kg-logo-text">高级搜索</span>
      </a>
      <nav class="portal-topnav">
        ${navs.map(n => {
          const cls = n.id === activeNav ? 'active' : '';
          if (n.href === '#') {
            return `<span class="portal-topnav-item ${cls}" data-portal-nav="${n.id}">${n.label}${n.arrow ? '<span class="nav-arrow">▾</span>' : ''}</span>`;
          }
          return `<a class="portal-topnav-item ${cls}" href="${n.href}">${n.label}</a>`;
        }).join('')}
      </nav>
      <div class="kg-header-right">
        <div class="portal-project-switch" id="portalProjectSwitch">
          <button type="button" class="portal-project-trigger" id="portalProjectTrigger" aria-expanded="false" aria-haspopup="true">
            <span class="portal-project-stack-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 12l10 5 10-5"/><path d="M2 17l10 5 10-5"/>
              </svg>
            </span>
            <span class="portal-project-name" id="portalProjectName">${projectDisplay}</span>
            <span class="portal-project-switch-icon" aria-hidden="true">⇄</span>
          </button>
          <div class="portal-project-popover" id="portalProjectPopover" hidden>
            <div class="portal-project-popover-title">项目切换</div>
            <div class="portal-project-search-wrap">
              <div class="portal-project-search-inner">
                <input type="text" class="portal-project-search" id="portalProjectSearch" placeholder="搜索项目名称" autocomplete="off">
                <button type="button" class="portal-project-search-clear" id="portalProjectSearchClear" hidden aria-label="清空搜索">×</button>
              </div>
            </div>
            <div class="portal-project-list" id="portalProjectList">
              ${renderPortalProjectListItems('', currentProject.id)}
            </div>
          </div>
        </div>
        <span class="kg-header-user">
          <span class="kg-user-avatar">A</span> admin
        </span>
      </div>
    </header>
  `;
}

function bindPortalHeaderNav() {
  document.querySelectorAll('[data-portal-nav]').forEach(el => {
    el.addEventListener('click', () => portalToast('该模块暂未开放（演示）'));
  });
  bindPortalProjectSwitch();
}

function bindPortalProjectSwitch() {
  const root = document.getElementById('portalProjectSwitch');
  const trigger = document.getElementById('portalProjectTrigger');
  const popover = document.getElementById('portalProjectPopover');
  const search = document.getElementById('portalProjectSearch');
  const searchClear = document.getElementById('portalProjectSearchClear');
  const list = document.getElementById('portalProjectList');
  const nameEl = document.getElementById('portalProjectName');
  if (!root || !trigger || !popover || !list) return;

  const closePopover = () => {
    popover.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    root.classList.remove('open');
  };

  const bindListItems = () => {
    list.querySelectorAll('[data-project-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.projectId;
        localStorage.setItem(PORTAL_PROJECT_KEY, id);
        const proj = getCurrentPortalProject();
        if (nameEl) nameEl.textContent = formatProjectDisplayName(proj);
        closePopover();
        portalToast(`已切换至项目：${proj.name}`);
      });
    });
  };

  const refreshList = (keyword) => {
    const current = getCurrentPortalProject();
    list.innerHTML = renderPortalProjectListItems(keyword, current.id);
    bindListItems();
  };

  const syncSearchClearBtn = () => {
    if (!search || !searchClear) return;
    searchClear.hidden = !search.value.length;
  };

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    if (popover.hidden) {
      popover.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      root.classList.add('open');
      refreshList('');
      if (search) {
        search.value = '';
        syncSearchClearBtn();
        setTimeout(() => search.focus(), 0);
      }
    } else {
      closePopover();
    }
  });

  searchClear?.addEventListener('click', e => {
    e.stopPropagation();
    if (!search) return;
    search.value = '';
    syncSearchClearBtn();
    refreshList('');
    search.focus();
  });

  search?.addEventListener('input', () => {
    syncSearchClearBtn();
    refreshList(search.value);
  });
  search?.addEventListener('click', e => e.stopPropagation());
  popover.addEventListener('click', e => e.stopPropagation());

  document.addEventListener('click', () => {
    if (!popover.hidden) closePopover();
  });

  bindListItems();
}

const OUTPUT_FIELD_TREE = [
  { id: 'pop', name: '人口', children: [
    { id: 'pop_perm', name: '常住人口', fields: [
      { id: 'f_name', name: '姓名' }, { id: 'f_id', name: '证件号码' }, { id: 'f_gender', name: '性别' }, { id: 'f_addr', name: '户籍地址' }
    ]},
    { id: 'pop_float', name: '流动人口', fields: [
      { id: 'f_name', name: '姓名' }, { id: 'f_id', name: '证件号码' }, { id: 'f_temp_addr', name: '暂住地址' }
    ]}
  ]},
  { id: 'track', name: '轨迹', fields: [
    { id: 'f_name', name: '姓名' }, { id: 'f_id', name: '证件号码' }, { id: 'f_dest', name: '前往地' }, { id: 'f_date', name: '出入日期' }
  ]},
  { id: 'comm', name: '通讯', fields: [
    { id: 'f_phone', name: '手机号' }, { id: 'f_caller', name: '主叫号码' }, { id: 'f_callee', name: '被叫号码' }, { id: 'f_call_time', name: '通话时间' }
  ]},
  { id: 'bg', name: '背景', fields: [
    { id: 'f_name', name: '姓名' }, { id: 'f_id', name: '证件号码' }, { id: 'f_case_no', name: '案件编号' }, { id: 'f_case_type', name: '案件类型' }
  ]}
];

const SUPER_NAV_TREE = [
  { id: 'person', name: '人员信息', children: [
    { id: 'basic', name: '基本信息', tables: ['常住人口表', '流动人口表', 'FJSXX信息'] },
    { id: 'track_info', name: '轨迹信息', tables: ['民航订票', '铁路出行', '旅馆住宿'] }
  ]},
  { id: 'vehicle', name: '车辆信息', children: [
    { id: 'vehicle_basic', name: '基本信息', tables: ['机动车信息', '违法记录'] }
  ]},
  { id: 'case', name: '案件信息', children: [
    { id: 'case_basic', name: '基本信息', tables: ['案件信息', '嫌疑人信息'] }
  ]}
];

const CatalogScope = {
  getAppId() {
    const q = new URLSearchParams(location.search).get('appId');
    if (q) return q;
    if (typeof SearchAppStore !== 'undefined') {
      const kind = location.pathname.includes('batch-query') ? 'batch_query' : 'super_search';
      const hit = SearchAppStore.getEnabled().find(a => SearchAppStore.getAppKind(a) === kind);
      return hit?.id || (kind === 'batch_query' ? 'app_batch_query' : 'app_super_search');
    }
    return location.pathname.includes('batch-query') ? 'app_batch_query' : 'app_super_search';
  },

  loadCatalog() {
    if (typeof CatalogStore !== 'undefined') {
      return CatalogStore.load(this.getAppId());
    }
    try {
      const raw = localStorage.getItem('kg_app_catalog_' + this.getAppId());
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  },

  getScopedTables() {
    const catalog = this.loadCatalog();
    if (!catalog?.tables?.length) {
      return [
        { id: 'mock1', name: '电话通联虚拟数据', folderId: 'f_ps', count: 120 },
        { id: 'mock2', name: '警情虚拟数据', folderId: 'f_ps', count: 86 }
      ];
    }
    return catalog.tables;
  },

  getCurrentApp() {
    if (typeof SearchAppStore === 'undefined') return null;
    return SearchAppStore.getById(this.getAppId()) || null;
  },

  getScopeMeta() {
    const app = this.getCurrentApp();
    const tables = this.getScopedTables();
    const appName = app?.name || '查询应用';
    return {
      appId: this.getAppId(),
      appName,
      tableCount: tables.length,
      tables,
      label: `当前应用：${appName} · ${tables.length} 张可查表`
    };
  },

  getFolderName(folderId, catalog) {
    const folders = catalog?.folders || [];
    const f = folders.find(x => x.id === folderId);
    return f ? f.name : '编目目录';
  },

  getFolderPath(folderId, catalog) {
    const folders = catalog?.folders || [];
    const parts = [];
    let id = folderId;
    while (id) {
      const f = folders.find(x => x.id === id);
      if (!f) break;
      if (f.id !== 'root') parts.unshift(f.name);
      id = f.parentId;
    }
    return parts.join(' 》 ');
  },

  getFolders() {
    const catalog = this.loadCatalog();
    return catalog?.folders || [];
  }
};

const SearchEngine = {
  detectType(keyword) {
    const k = keyword.trim();
    if (/^1[3-9]\d{9}$/.test(k)) return 'phone';
    if (/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z][A-HJ-NP-Z0-9]{5,6}$/.test(k)) return 'vehicle';
    if (/^\d{15}$|^\d{17}[\dXx]$/.test(k)) return 'id';
    return 'keyword';
  },

  mockRow(keyword, table, fields, idx) {
    const type = this.detectType(keyword);
    const names = ['张三', '李四', '王五', '赵六', '陈七'];
    const name = names[idx % names.length];
    const row = { _tableId: table.id, _table: table.name, _folder: table.folderName || '编目范围' };
    fields.forEach(f => {
      if (f.name === '姓名') row[f.name] = name;
      else if (f.name === '证件号码') row[f.name] = type === 'id' ? keyword : `35010219${String(80000000 + idx).slice(-8)}`;
      else if (f.name === '手机号' || f.name === '主叫号码') row[f.name] = type === 'phone' ? keyword : `138${String(10000000 + idx).slice(-8)}`;
      else if (f.name === '被叫号码') row[f.name] = `139${String(20000000 + idx).slice(-8)}`;
      else if (f.name === '性别') row[f.name] = idx % 2 ? '男' : '女';
      else if (f.name === '前往地') row[f.name] = '北京市';
      else if (f.name === '出入日期') row[f.name] = '2026-07-15';
      else if (f.name === '通话时间') row[f.name] = '2026-07-22 14:30:00';
      else if (f.name === '户籍地址') row[f.name] = '福建省福州市鼓楼区';
      else if (f.name === '暂住地址') row[f.name] = '福建省厦门市思明区';
      else if (f.name === '案件编号') row[f.name] = `AJ${20260000 + idx}`;
      else if (f.name === '案件类型') row[f.name] = '刑事案件';
      else row[f.name] = '—';
    });
    return row;
  },

  search(keywords, outputFields, options = {}) {
    const catalog = CatalogScope.loadCatalog();
    let tables = CatalogScope.getScopedTables().map(t => ({
      ...t,
      folderName: CatalogScope.getFolderName(t.folderId, catalog)
    }));
    const ids = options.tableIds;
    if (ids && ids.length) tables = tables.filter(t => ids.includes(t.id));
    const keys = Array.isArray(keywords) ? keywords : [keywords];
    const fields = outputFields?.length ? outputFields : [
      { id: 'f_name', name: '姓名' }, { id: 'f_id', name: '证件号码' }, { id: 'f_gender', name: '性别' }
    ];
    const fieldNames = fields.map(f => f.name);
    const results = [];
    keys.forEach((kw, ki) => {
      if (!kw?.trim()) return;
      tables.forEach((table, ti) => {
        const hitCount = Math.min(5, Math.max(2, Math.floor(table.count / 10) || 2));
        for (let i = 0; i < hitCount; i++) {
          results.push(this.mockRow(kw.trim(), table, fields, ki * 10 + ti + i));
        }
      });
    });
    return { results, tables: tables.length, keywords: keys.filter(k => k?.trim()).length, fields: fieldNames };
  }
};

const BatchQueryStore = {
  KEY: 'kg_batch_query_tasks',

  getDefault() {
    return [
      {
        id: 'bq_demo1',
        name: '2026年7月重点人员批量核查',
        createTime: '2026-07-22 09:15:30',
        creator: 'admin',
        unit: '福建省公安厅',
        status: 'done',
        statusText: '执行完成',
        resultMatched: 100,
        resultTotal: 100,
        progress: 100,
        templateType: 'id',
        outputFields: [{ id: 'f_name', name: '姓名' }, { id: 'f_id', name: '证件号码' }],
        uploadCount: 100,
        appId: 'app_batch_query',
        appName: '批量查询',
        tableCount: 3,
        results: null
      }
    ];
  },

  load() {
    const d = localStorage.getItem(this.KEY);
    return d ? JSON.parse(d) : this.getDefault();
  },

  save(list) {
    localStorage.setItem(this.KEY, JSON.stringify(list));
  },

  generateId() {
    return 'bq_' + Date.now().toString(36);
  }
};

function flattenOutputFields() {
  const list = [];
  OUTPUT_FIELD_TREE.forEach(cat => {
    if (cat.children) {
      cat.children.forEach(sub => {
        (sub.fields || []).forEach(f => {
          if (!list.find(x => x.id === f.id)) list.push({ ...f, category: `${cat.name}/${sub.name}` });
        });
      });
    } else if (cat.fields) {
      cat.fields.forEach(f => {
        if (!list.find(x => x.id === f.id)) list.push({ ...f, category: cat.name });
      });
    }
  });
  return list;
}

function getAllFieldLeaves() {
  const leaves = [];
  OUTPUT_FIELD_TREE.forEach(cat => {
    if (cat.children) {
      cat.children.forEach(sub => {
        (sub.fields || []).forEach(f => leaves.push({ ...f, path: `${cat.name} / ${sub.name}` }));
      });
    } else {
      (cat.fields || []).forEach(f => leaves.push({ ...f, path: cat.name }));
    }
  });
  return leaves;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) o.classList.remove('show'); });
  });
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.close;
      document.getElementById(id)?.classList.remove('show');
    });
  });
});
