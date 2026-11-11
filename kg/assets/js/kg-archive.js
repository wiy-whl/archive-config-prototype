const KG_ENTITY_TYPES = [
  '人员', '案件', '组织机构', '物品', '地址', '事件', '账号', '车辆', '电话', '指标',
  // 示例：默认未配置，便于演示起点页流程
  '证件', '场所', '设备', '银行卡', '邮箱', '资金账户', '虚拟身份', '通联工具'
];

const ArchiveTemplateStore = {
  KEY: 'kg_archive_templates',
  VER_KEY: 'kg_archive_templates_ver',
  DATA_VERSION: '6',
  BIND_KEY: 'kg_archive_entity_bindings',
  BIND_VER_KEY: 'kg_archive_entity_bindings_ver',
  BIND_VERSION: '3',
  ENTITY_TYPES: KG_ENTITY_TYPES,

  getDefault() {
    return [
      // —— 1. 通用人员档案（纵向 + 轨迹 / 财产 / 综合） ——
      {
        id: 'tpl_person',
        name: '通用人员档案',
        entityType: 'person',
        isGeneric: true,
        header: { photo: true, showTags: true },
        pageLayout: 'vertical',
        objectSource: {
          entityType: '人员',
          masterTable: '人员基本信息表',
          idField: '证件号码',
          nameField: '姓名',
          associateField: '证件号码',
          photoField: '照片',
          basicFields: ['性别', '民族', '户籍地址', '现住址'],
          tagField: '人员标签',
          tables: null
        },
        basicInfo: { position: 'left', fields: ['性别', '民族', '户籍地址', '现住址'] },
        tabs: [
          { id: 'overview', name: '总览', enabled: true, type: 'overview' },
          { id: 'track', name: '轨迹', enabled: true, type: 'columns' },
          { id: 'asset', name: '财产', enabled: true, type: 'columns' },
          { id: 'merged', name: '综合信息', enabled: true, type: 'merged' }
        ]
      },

      // —— 2. 案件档案（纵向 + 嫌疑人 Tile / 作案轨迹 / 证据汇总 merged） ——
      {
        id: 'tpl_case',
        name: '案件档案模板',
        entityType: 'case',
        isGeneric: false,
        sourceEntity: '案件',
        header: { photo: false, showTags: true },
        pageLayout: 'vertical',
        objectSource: {
          entityType: '案件',
          masterTable: '案件虚拟数据',
          idField: '案件编号',
          nameField: '案件类型',
          associateField: '案件编号',
          photoField: '',
          basicFields: ['报警时间', '处置状态'],
          tagField: '',
          tables: null
        },
        basicInfo: { position: 'left', fields: ['报警时间', '处置状态'] },
        tabs: [
          { id: 'overview', name: '总览', enabled: true, type: 'overview' },
          { id: 'suspect', name: '涉案人员', enabled: true, type: 'columns' },
          { id: 'track', name: '作案轨迹', enabled: true, type: 'columns' },
          { id: 'merged', name: '证据汇总', enabled: true, type: 'merged' }
        ]
      },

      // —— 3. 车辆档案（横向 + 卡口通行 / 维修） ——
      {
        id: 'tpl_vehicle',
        name: '车辆档案模板',
        entityType: 'vehicle',
        isGeneric: false,
        sourceEntity: '车辆',
        header: { photo: false, showTags: false },
        pageLayout: 'horizontal',
        objectSource: {
          entityType: '车辆',
          masterTable: '车辆主表',
          idField: '车牌号码',
          nameField: '品牌型号',
          associateField: '车牌号码',
          photoField: '',
          basicFields: ['车架号', '发动机号', '年检有效期'],
          tagField: '',
          tables: null
        },
        basicInfo: { position: 'top', fields: ['车架号', '发动机号', '年检有效期'] },
        tabs: [
          { id: 'overview', name: '总览', enabled: true, type: 'overview' },
          { id: 'track', name: '通行轨迹', enabled: true, type: 'columns' },
          { id: 'asset', name: '维修与事故', enabled: true, type: 'columns' }
        ]
      },

      // —— 4. 组织机构档案（纵向 + 所属人员 Tile / 外部关联 Relation） ——
      {
        id: 'tpl_org',
        name: '机构档案模板',
        entityType: 'org',
        isGeneric: false,
        sourceEntity: '组织机构',
        header: { photo: false, showTags: true },
        pageLayout: 'vertical',
        objectSource: {
          entityType: '组织机构',
          masterTable: '组织机构主表',
          idField: '机构编号',
          nameField: '机构名称',
          associateField: '机构编号',
          photoField: '',
          basicFields: ['机构类别', '负责人'],
          tagField: '',
          tables: null
        },
        basicInfo: { position: 'left', fields: ['机构类别', '负责人'] },
        tabs: [
          { id: 'overview', name: '总览', enabled: true, type: 'overview' },
          { id: 'members', name: '所属人员', enabled: true, type: 'columns' },
          { id: 'relation', name: '外部关联', enabled: true, type: 'columns' }
        ]
      },

      // —— 5. 电话账号档案（纵向 + 通联记录 Track / 关联号码 Relation） ——
      {
        id: 'tpl_phone',
        name: '电话账号档案',
        entityType: 'phone',
        isGeneric: true,
        header: { photo: false, showTags: false },
        pageLayout: 'vertical',
        objectSource: {
          entityType: '电话',
          masterTable: '手机号实名登记表',
          idField: '手机号',
          nameField: '手机号',
          associateField: '手机号',
          photoField: '',
          basicFields: ['运营商', '入网时间'],
          tagField: '',
          tables: null
        },
        basicInfo: { position: 'left', fields: ['运营商', '入网时间'] },
        tabs: [
          { id: 'overview', name: '总览', enabled: true, type: 'overview' },
          { id: 'track', name: '通联记录', enabled: true, type: 'columns' },
          { id: 'relation', name: '关联号码', enabled: true, type: 'columns' }
        ]
      }
    ];
  },

  getDefaultBindings() {
    return {
      人员: 'tpl_person',
      案件: 'tpl_case',
      车辆: 'tpl_vehicle',
      组织机构: 'tpl_org',
      电话: 'tpl_phone'
    };
  },

  getAll() {
    const ver = localStorage.getItem(this.VER_KEY);
    const raw = localStorage.getItem(this.KEY);
    if (!raw || ver !== this.DATA_VERSION) {
      const data = this.getDefault();
      this.save(data);
      localStorage.setItem(this.VER_KEY, this.DATA_VERSION);
      return data;
    }
    return JSON.parse(raw);
  },

  save(list) {
    localStorage.setItem(this.KEY, JSON.stringify(list));
  },

  getBindings() {
    const ver = localStorage.getItem(this.BIND_VER_KEY);
    const raw = localStorage.getItem(this.BIND_KEY);
    if (!raw || ver !== this.BIND_VERSION) {
      const data = this.getDefaultBindings();
      this.saveBindings(data);
      return data;
    }
    return JSON.parse(raw);
  },

  saveBindings(map) {
    localStorage.setItem(this.BIND_KEY, JSON.stringify(map));
    localStorage.setItem(this.BIND_VER_KEY, this.BIND_VERSION);
  },

  getBinding(entityType) {
    return this.getBindings()[entityType] || '';
  },

  bindEntity(entityType, tplId) {
    const map = this.getBindings();
    map[entityType] = tplId;
    this.saveBindings(map);
  },

  unbindEntity(entityType) {
    const map = this.getBindings();
    delete map[entityType];
    this.saveBindings(map);
    if (typeof ArchiveEntityConfigStore !== 'undefined') {
      ArchiveEntityConfigStore.remove(entityType);
    }
  },

  entitiesForTemplate(tplId) {
    const map = this.getBindings();
    return Object.keys(map).filter(k => map[k] === tplId);
  },

  getForEntity(entityType) {
    return this.normalizeTemplate(ArchiveEntityConfigStore.getRuntimeTemplate(entityType));
  },

  entityColumnKey(entityType) {
    return ArchiveEntityConfigStore.columnKey(entityType);
  },

  applyBlueprintToEntity(entityType, tplId) {
    return ArchiveEntityConfigStore.applyBlueprint(entityType, tplId);
  },

  syncEntityFromBlueprint(entityType) {
    return ArchiveEntityConfigStore.syncFromBlueprint(entityType);
  },

  isConfigured(tpl) {
    if (!tpl || typeof ArchiveLoad === 'undefined' || !ArchiveLoad.ready(tpl)) return false;
    const tabs = (tpl.tabs || []).filter(t => t.enabled);
    if (tabs.some(t => t.type === 'overview')) return true;
    const cols = ArchiveColumnStore.getForTemplate(tpl.id);
    return tabs.some(tab => {
      const list = cols[tab.id] || [];
      if (tab.type === 'merged') {
        return list.some(c => c.type === 'merged' && ArchiveLoad.normalizeSources(c).length &&
          ArchiveLoad.normalizeSources(c).every(s => s.joinField));
      }
      return list.some(c => c.tableName && c.joinField && (c.displayFields || []).length);
    });
  },

  blankTemplate(entityType) {
    return {
      id: this.generateId(),
      name: '未命名模板',
      entityType: 'person',
      isGeneric: false,
      header: { photo: true, showTags: false },
      pageLayout: 'vertical',
      objectSource: {
        entityType: entityType || '人员',
        masterTable: '',
        idField: '',
        nameField: '',
        basicFields: [],
        tagField: '',
        tables: null
      },
      basicInfo: { position: 'left', fields: [] },
      tabs: [{ id: 'overview', name: '总览', enabled: true, type: 'overview' }]
    };
  },

  /** 规范化模板对象（蓝图或实体副本均可），不回落到其它模板 */
  normalizeTemplate(tpl) {
    if (!tpl || typeof tpl !== 'object') return null;
    if (!tpl.pageLayout) {
      tpl.pageLayout = tpl.basicInfo?.position === 'top' ? 'horizontal' : 'vertical';
    }
    if (!tpl.objectSource) {
      tpl.objectSource = { masterTable: '', idField: '', nameField: '', basicFields: [], tagField: '' };
    }
    tpl.basicInfo = tpl.basicInfo || { position: 'left', fields: [] };
    if (!Array.isArray(tpl.basicInfo.fields) || !tpl.basicInfo.fields.length) {
      tpl.basicInfo.fields = tpl.objectSource.basicFields || [];
    }
    tpl.header = tpl.header || { photo: true, showTags: false };
    tpl.header.showTags = !!tpl.objectSource.tagField;
    return tpl;
  },

  getById(id) {
    if (!id) return null;
    return this.normalizeTemplate(this.getAll().find(t => t.id === id) || null);
  },

  generateId() {
    return 'tpl_' + Date.now().toString(36);
  }
};

const ArchiveEntityConfigStore = {
  KEY: 'kg_archive_entity_configs',
  VER_KEY: 'kg_archive_entity_configs_ver',
  DATA_VERSION: '1',

  columnKey(entityType) {
    return 'ent_' + entityType;
  },

  deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  },

  load() {
    const ver = localStorage.getItem(this.VER_KEY);
    const raw = localStorage.getItem(this.KEY);
    if (!raw || ver !== this.DATA_VERSION) {
      const data = {};
      this.save(data);
      localStorage.setItem(this.VER_KEY, this.DATA_VERSION);
      return data;
    }
    try { return JSON.parse(raw) || {}; } catch { return {}; }
  },

  save(map) {
    localStorage.setItem(this.KEY, JSON.stringify(map));
    localStorage.setItem(this.VER_KEY, this.DATA_VERSION);
  },

  get(entityType) {
    return this.load()[entityType] || null;
  },

  put(entityType, cfg) {
    const map = this.load();
    map[entityType] = cfg;
    this.save(map);
  },

  remove(entityType) {
    const map = this.load();
    delete map[entityType];
    this.save(map);
    const cols = ArchiveColumnStore.load();
    delete cols[this.columnKey(entityType)];
    ArchiveColumnStore.save(cols);
  },

  /** 蓝图→实体：只留界面/栏目样式骨架，清空表接入与字段勾选 */
  stripColumnData(col) {
    if (!col || typeof col !== 'object') return col;
    const next = this.deepClone(col);
    delete next.tableName;
    delete next.joinField;
    delete next.displayFields;
    delete next.timeField;
    delete next.dateField;
    delete next.fieldMap;
    delete next.rows;
    delete next.demoRows;
    next.tableName = '';
    next.joinField = '';
    next.displayFields = [];
    if (Array.isArray(next.sources)) {
      next.sources = next.sources.map(() => ({ tableName: '', joinField: '' }));
    }
    return next;
  },

  stripColumnsByTab(columnsByTab) {
    const src = columnsByTab || {};
    const out = {};
    Object.keys(src).forEach((tabId) => {
      const list = Array.isArray(src[tabId]) ? src[tabId] : [];
      out[tabId] = list.map((col) => this.stripColumnData(col));
    });
    return out;
  },

  skeletonObjectSource(entityType, from) {
    return {
      entityType: entityType || from?.entityType || '人员',
      masterTable: '',
      idField: '',
      nameField: '',
      associateField: '',
      basicFields: [],
      tagField: '',
      photoField: '',
      photoMode: from?.photoMode === 'api' ? 'api' : 'table',
      photoTable: '',
      photoApi: '',
      tables: null,
      sourceTables: null
    };
  },

  skeletonHeader(header) {
    const next = this.deepClone(header || { photo: true, showTags: false });
    if (Array.isArray(next.icons)) {
      next.icons = next.icons.map((icon) => ({
        ...icon,
        tableName: '',
        joinField: '',
        fields: []
      }));
    }
    next.showTags = false;
    return next;
  },

  materializeFromBlueprint(entityType, tplId) {
    const source = ArchiveTemplateStore.getById(tplId);
    if (!source || source.id !== tplId) return null;
    const cols = ArchiveColumnStore.getForTemplate(tplId);
    const copy = this.deepClone(source);
    copy.id = this.columnKey(entityType);
    copy.name = entityType + '档案';
    copy.isEntityCopy = true;
    copy.sourceTplId = tplId;
    copy.exported = true;
    // 保留 tabs / pageLayout / 栏目类型与名称；对象来源与表接入留给实体再配
    copy.objectSource = this.skeletonObjectSource(entityType, source.objectSource);
    copy.basicInfo = {
      ...(copy.basicInfo || {}),
      fields: []
    };
    copy.header = this.skeletonHeader(copy.header);
    delete copy.puckLayout;
    ArchiveColumnStore.saveForTemplate(copy.id, this.stripColumnsByTab(cols));
    const cfg = {
      sourceTplId: tplId,
      tpl: copy,
      customized: false,
      standalone: false,
      updatedAt: Date.now()
    };
    this.put(entityType, cfg);
    return cfg;
  },

  ensure(entityType) {
    if (!entityType) return null;
    const existing = this.get(entityType);
    if (existing?.tpl) {
      if (!ArchiveColumnStore.load()[existing.tpl.id]) {
        const from = existing.sourceTplId
          ? this.stripColumnsByTab(ArchiveColumnStore.getForTemplate(existing.sourceTplId))
          : { overview: [] };
        ArchiveColumnStore.saveForTemplate(existing.tpl.id, this.deepClone(from));
      }
      return existing;
    }
    const sourceTplId = ArchiveTemplateStore.getBinding(entityType);
    if (!sourceTplId) return null;
    return this.materializeFromBlueprint(entityType, sourceTplId);
  },

  applyBlueprint(entityType, tplId) {
    if (!entityType || !tplId) return null;
    const before = ArchiveTemplateStore.entitiesForTemplate(tplId);
    const wasUsing = before.includes(entityType);
    const cfg = this.materializeFromBlueprint(entityType, tplId);
    if (!cfg) return null;
    ArchiveTemplateStore.bindEntity(entityType, tplId);
    if (!wasUsing) {
      const list = ArchiveTemplateStore.getAll();
      const tpl = list.find(item => item.id === tplId);
      if (tpl) {
        const base = typeof tpl.useCount === 'number' ? tpl.useCount : before.length;
        tpl.useCount = base + 1;
        ArchiveTemplateStore.save(list);
      }
    }
    return cfg;
  },

  syncFromBlueprint(entityType) {
    const cfg = this.get(entityType);
    const sourceTplId = cfg?.sourceTplId || ArchiveTemplateStore.getBinding(entityType);
    if (!sourceTplId) return null;
    return this.materializeFromBlueprint(entityType, sourceTplId);
  },

  saveRuntime(entityType, tpl, columnsByTab) {
    if (!entityType || !tpl) return;
    const prev = this.get(entityType) || {};
    const nextTpl = this.deepClone(tpl);
    nextTpl.id = this.columnKey(entityType);
    nextTpl.isEntityCopy = true;
    // 独立配置后禁止用残留 sourceTplId 把绑定写回去
    const staySolo = !!prev.standalone && !prev.sourceTplId;
    const sourceTplId = staySolo ? '' : (prev.sourceTplId || ArchiveTemplateStore.getBinding(entityType) || '');
    nextTpl.sourceTplId = sourceTplId;
    if (!sourceTplId) delete nextTpl.sourceTplId;
    nextTpl.objectSource = nextTpl.objectSource || {};
    nextTpl.objectSource.entityType = entityType;
    ArchiveColumnStore.saveForTemplate(nextTpl.id, columnsByTab || {});
    this.put(entityType, {
      sourceTplId: sourceTplId || '',
      tpl: nextTpl,
      customized: true,
      standalone: !sourceTplId,
      updatedAt: Date.now()
    });
    if (sourceTplId) {
      ArchiveTemplateStore.bindEntity(entityType, sourceTplId);
    } else {
      // 只清绑定，不删实体副本（unbindEntity 会 remove 整份配置）
      const binds = ArchiveTemplateStore.getBindings();
      delete binds[entityType];
      ArchiveTemplateStore.saveBindings(binds);
    }
  },

  isCustomized(entityType) {
    const cfg = this.get(entityType);
    return !!(cfg && cfg.customized);
  },

  isStandalone(entityType) {
    const cfg = this.get(entityType);
    if (!cfg?.tpl) return false;
    if (cfg.standalone) return true;
    return !cfg.sourceTplId && !ArchiveTemplateStore.getBinding(entityType);
  },

  /** 不套用模板，直接为实体建空白档案副本 */
  startStandalone(entityType) {
    if (!entityType) return null;
    const blank = ArchiveTemplateStore.blankTemplate(entityType);
    blank.id = this.columnKey(entityType);
    blank.name = entityType + '档案';
    blank.isEntityCopy = true;
    blank.sourceTplId = '';
    blank.exported = true;
    blank.objectSource = blank.objectSource || {};
    blank.objectSource.entityType = entityType;
    ArchiveColumnStore.saveForTemplate(blank.id, { overview: [] });
    const binds = ArchiveTemplateStore.getBindings();
    delete binds[entityType];
    ArchiveTemplateStore.saveBindings(binds);
    const cfg = {
      sourceTplId: '',
      tpl: blank,
      customized: true,
      standalone: true,
      updatedAt: Date.now()
    };
    this.put(entityType, cfg);
    return cfg;
  },

  getRuntimeTemplate(entityType) {
    const cfg = this.ensure(entityType);
    return cfg?.tpl || null;
  }
};

const ArchiveColumnStore = {
  KEY: 'kg_archive_columns',
  VER_KEY: 'kg_archive_columns_ver',
  DATA_VERSION: '3',

  getDefault() {
    return {
      tpl_person: {
        overview: [],
        track: [
          { id: 'col_hotel', name: '旅业住宿', type: 'single',
            tableName: '旅业住宿虚拟数据', joinField: '证件号码',
            displayFields: ['入住时间', '旅馆名称', '房间号', '离店时间'] },
          { id: 'col_flight', name: '民航订票', type: 'single',
            tableName: '民航订票虚拟数据', joinField: '证件号码',
            displayFields: ['航班号', '出发', '到达', '乘机日期'] }
        ],
        asset: [
          { id: 'col_phone', name: '手机', type: 'single',
            tableName: '手机号实名登记表', joinField: '证件号码',
            displayFields: ['手机号', '运营商', '入网时间'] }
        ],
        merged: [
          { id: 'col_merged_track', name: '综合轨迹', type: 'merged',
            sources: [
              { tableName: '民航订票虚拟数据', joinField: '证件号码' },
              { tableName: '旅业住宿虚拟数据', joinField: '证件号码' },
              { tableName: '铁路出行记录', joinField: '证件号码' }
            ],
            displayFields: ['时间', '类型', '地点', '来源表'] }
        ]
      },

      // —— 案件档案栏目 ——
      tpl_case: {
        overview: [],
        suspect: [
          { id: 'col_suspect', name: '涉案人员', type: 'tile',
            tableName: '案件嫌疑人信息虚拟数据', joinField: '案件编号',
            displayFields: ['姓名', '证件号码', '角色', '到案情况'] }
        ],
        track: [
          { id: 'col_alarm', name: '警情记录', type: 'single',
            tableName: '警情虚拟数据', joinField: '案件编号',
            displayFields: ['报警时间', '警情类型', '处置状态'] },
          { id: 'col_seize', name: '查封扣押', type: 'single',
            tableName: '物品主表', joinField: '案件编号',
            displayFields: ['物品名称', '数量', '扣押时间'] }
        ],
        merged: [
          { id: 'col_case_evidence', name: '证据汇总', type: 'merged',
            sources: [
              { tableName: '警情虚拟数据', joinField: '案件编号' },
              { tableName: '旅业住宿虚拟数据', joinField: '证件号码' }
            ],
            displayFields: ['时间', '来源', '类型', '地点'] }
        ]
      },

      // —— 车辆档案栏目 ——
      tpl_vehicle: {
        overview: [],
        track: [
          { id: 'col_checkpoint', name: '卡口通行', type: 'single',
            tableName: '车辆主表', joinField: '车牌号码',
            displayFields: ['通行时间', '卡口名称', '方向', '车速'] },
          { id: 'col_violation', name: '违章记录', type: 'single',
            tableName: '车辆主表', joinField: '车牌号码',
            displayFields: ['违章时间', '违章类型', '地点', '扣分'] }
        ],
        asset: [
          { id: 'col_repair', name: '维修保养', type: 'single',
            tableName: '车辆主表', joinField: '车牌号码',
            displayFields: ['维修时间', '维修厂', '项目', '金额'] },
          { id: 'col_accident', name: '事故档案', type: 'single',
            tableName: '车辆主表', joinField: '车牌号码',
            displayFields: ['事故时间', '事故类型', '责任认定'] }
        ]
      },

      // —— 机构档案栏目 ——
      tpl_org: {
        overview: [],
        members: [
          { id: 'col_staff', name: '在职人员', type: 'tile',
            tableName: '人员基本信息表', joinField: '机构编号',
            displayFields: ['姓名', '证件号码', '职务', '入职时间'] }
        ],
        relation: [
          { id: 'col_partner', name: '合作机构', type: 'relation',
            tableName: '组织机构主表', joinField: '机构编号',
            relatedTable: '组织机构主表', relatedJoinField: '机构编号',
            displayFields: ['机构名称', '合作类型', '开始时间'] },
          { id: 'col_supply', name: '物资供应商', type: 'relation',
            tableName: '组织机构主表', joinField: '机构编号',
            relatedTable: '物品主表', relatedJoinField: '机构编号',
            displayFields: ['供应商名称', '供应品类', '签约日期'] }
        ]
      },

      // —— 电话账号档案栏目 ——
      tpl_phone: {
        overview: [],
        track: [
          { id: 'col_call_in', name: '来电记录', type: 'single',
            tableName: '电话通联虚拟数据', joinField: '主叫号码',
            displayFields: ['通话时间', '被叫号码', '通话时长'] },
          { id: 'col_call_out', name: '去电记录', type: 'single',
            tableName: '电话通联虚拟数据', joinField: '主叫号码',
            displayFields: ['通话时间', '被叫号码', '通话时长'] }
        ],
        relation: [
          { id: 'col_link_phone', name: '关联号码', type: 'relation',
            tableName: '手机号实名登记表', joinField: '手机号',
            relatedTable: '手机号实名登记表', relatedJoinField: '证件号码',
            displayFields: ['手机号', '持有人', '入网时间'] }
        ]
      }
    };
  },

  load() {
    const ver = localStorage.getItem(this.VER_KEY);
    const raw = localStorage.getItem(this.KEY);
    if (!raw || ver !== this.DATA_VERSION) {
      const data = this.getDefault();
      this.save(data);
      localStorage.setItem(this.VER_KEY, this.DATA_VERSION);
      return data;
    }
    return JSON.parse(raw);
  },

  save(map) {
    localStorage.setItem(this.KEY, JSON.stringify(map));
  },

  getForTemplate(tplId) {
    const map = this.load();
    if (!map[tplId]) {
      map[tplId] = { overview: [], track: [], asset: [], merged: [] };
      this.save(map);
    }
    return map[tplId];
  },

  saveForTemplate(tplId, columnsByTab) {
    const map = this.load();
    map[tplId] = columnsByTab;
    this.save(map);
  },

  generateId() {
    return 'col_' + Date.now().toString(36);
  }
};

const ArchiveFieldCatalog = {
  byName: {
    '人员基本信息表': ['证件号码', '姓名', '性别', '民族', '户籍地址', '现住址', '手机号', '人员标签', '照片'],
    '旅业住宿虚拟数据': ['证件号码', '姓名', '入住时间', '旅馆名称', '房间号', '离店时间'],
    '民航订票虚拟数据': ['证件号码', '姓名', '航班号', '舱位', '出发', '到达', '乘机日期'],
    '铁路出行记录': ['证件号码', '姓名', '车次', '席别', '出发', '到达', '乘车日期'],
    '手机号实名登记表': ['证件号码', '姓名', '手机号', '运营商', '入网时间'],
    '电话通联虚拟数据': ['证件号码', '主叫号码', '被叫号码', '通话时间', '通话时长'],
    '警情虚拟数据': ['证件号码', '姓名', '警情编号', '报警时间', '警情类型', '处置状态'],
    '案件虚拟数据': ['证件号码', '姓名', '案件编号', '案件类型', '角色'],
    '案件嫌疑人信息虚拟数据': ['证件号码', '姓名', '案件编号', '案件类型', '角色']
  },

  fieldsFor(tableName) {
    if (this.byName[tableName]) return this.byName[tableName].slice();
    return ['证件号码', '姓名', '业务字段', '更新时间'];
  },

  suggestJoin(tableName, idField) {
    const fields = this.fieldsFor(tableName);
    if (idField && fields.includes(idField)) return idField;
    return fields.find(f => f === '证件号码' || f === '身份证号') || fields[0] || '';
  }
};

const ArchiveEntityTypes = {
  names: KG_ENTITY_TYPES,

  masterTableOf(entityType) {
    const map = {
      人员: '人员基本信息表',
      指标: '指标主表',
      案件: '案件虚拟数据',
      组织机构: '组织机构主表',
      物品: '物品主表',
      地址: '地址主表',
      事件: '事件主表',
      账号: '账号主表',
      车辆: '车辆主表',
      电话: '电话通联虚拟数据'
    };
    return map[entityType] || ((entityType || '实体') + '主表');
  },

  field(name, label, flags = {}) {
    return {
      name,
      label,
      nameRole: !!flags.nameRole,
      idRole: !!flags.idRole,
      joinRole: !!flags.joinRole,
      photoRole: !!flags.photoRole,
      tagRole: !!flags.tagRole,
      tagText: flags.tagText || ''
    };
  },

  preset(entityType) {
    if (entityType === '指标') {
      return [
        {
          key: 'main',
          title: '主',
          fields: [
            this.field('object_key', 'object_key', { nameRole: true, idRole: true, joinRole: true })
          ]
        },
        {
          key: 'indicator',
          title: '指标',
          fields: [
            this.field('object_key', 'object_key', { nameRole: true, idRole: true, joinRole: true }),
            this.field('indicatorCode', '指标编码'),
            this.field('indicatorName', '指标名称'),
            this.field('indicatorCategory', '指标分类'),
            this.field('businessDomain', '业务域'),
            this.field('sourceMethod', '来源方式'),
            this.field('sourceTableCode', '来源表编码'),
            this.field('sourceFieldCode', '来源字段编码')
          ]
        }
      ];
    }
    if (entityType === '人员') {
      return [
        {
          key: 'main',
          title: '主',
          fields: [
            this.field('id_no', '证件号码', { idRole: true, joinRole: true }),
            this.field('name', '姓名', { nameRole: true }),
            this.field('gender', '性别'),
            this.field('nation', '民族'),
            this.field('hukou', '户籍地址'),
            this.field('address', '现住址'),
            this.field('phone', '手机号'),
            this.field('photo', '照片', { photoRole: true }),
            this.field('person_tag', '人员标签', { tagRole: true })
          ]
        }
      ];
    }
    const master = this.masterTableOf(entityType);
    return [
      {
        key: 'main',
        title: '主',
        fields: [
          this.field('id', '实体标识', { idRole: true, joinRole: true }),
          this.field('name', '实体名称', { nameRole: true }),
          this.field('source_table', master)
        ]
      }
    ];
  },

  cloneTables(tables) {
    return JSON.parse(JSON.stringify(tables || []));
  },

  fromTemplate(tpl) {
    const src = tpl?.objectSource || {};
    const entityType = this.names.includes(src.entityType) ? src.entityType : '人员';
    const tables = Array.isArray(src.tables) && src.tables.length
      ? this.cloneTables(src.tables)
      : this.preset(entityType);
    return {
      entityType,
      activeKey: tables.some(t => t.key === 'indicator') ? 'indicator' : (tables[0]?.key || 'main'),
      tables
    };
  }
};

const ArchiveLoad = {
  sourceOf(tpl) {
    const s = tpl?.objectSource || {};
    return {
      masterTable: s.masterTable || '',
      idField: s.idField || '',
      nameField: s.nameField || '',
      basicFields: s.basicFields || [],
      tagField: s.tagField || ''
    };
  },

  ready(tpl) {
    const s = this.sourceOf(tpl);
    return !!(s.masterTable && s.idField && s.nameField);
  },

  personValue(person, field) {
    const map = {
      姓名: person.name,
      证件号码: person.idNo,
      手机号: person.phone,
      性别: person.gender,
      民族: person.nation,
      户籍地址: person.hukou,
      现住址: person.address,
      人员标签: (person.tags || []).join('、'),
      object_key: 'OBJ-10086',
      照片: ''
    };
    return Object.prototype.hasOwnProperty.call(map, field) ? map[field] : '—';
  },

  normalizeSources(col) {
    return (col?.sources || []).map(s => (
      typeof s === 'string'
        ? { tableName: s, joinField: '' }
        : { tableName: s.tableName || '', joinField: s.joinField || '' }
    )).filter(s => s.tableName);
  },

  projectRow(raw, fields) {
    const out = {};
    (fields || []).forEach(f => { out[f] = raw[f] ?? '—'; });
    return out;
  }
};

const ArchiveTableCatalog = {
  list() {
    const byName = new Map();
    const push = (t) => {
      const name = (t && t.name || '').trim();
      if (!name || byName.has(name)) return;
      byName.set(name, {
        id: t.id || t.sourceId || name,
        name,
        lib: t.lib || '',
        group: t.group || ''
      });
    };
    if (typeof CatalogStore !== 'undefined') {
      (CatalogStore.getAssignablePool() || []).forEach(push);
      ['app_super_search', 'app_batch_query'].forEach(appId => {
        (CatalogStore.load(appId).tables || []).forEach(push);
      });
    }
    Object.keys(ArchiveFieldCatalog.byName).forEach(name => push({ name, lib: '档案可用表', group: '' }));
    return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, 'zh'));
  },

  optionLabel(t) {
    const meta = [t.lib, t.group].filter(Boolean).join(' / ');
    return meta ? `${t.name}（${meta}）` : t.name;
  },

  selectOptions(selectedName) {
    const tables = this.list();
    const selected = selectedName || '';
    const extra = selected && !tables.some(t => t.name === selected)
      ? `<option value="${selected.replace(/"/g, '&quot;')}" selected>${selected}（已绑定，目录中已无此表）</option>`
      : '';
    return `<option value="">请选择数据表</option>` + extra + tables.map(t =>
      `<option value="${t.name.replace(/"/g, '&quot;')}" ${t.name === selected ? 'selected' : ''}>${this.optionLabel(t)}</option>`
    ).join('');
  },

  sourceChecks(selectedNames) {
    const picked = new Set(selectedNames || []);
    return this.list().map(t => `
      <label class="archive-source-check">
        <input type="checkbox" class="inline-source-table" value="${t.name.replace(/"/g, '&quot;')}" ${picked.has(t.name) ? 'checked' : ''}>
        <span>${this.optionLabel(t)}</span>
      </label>`).join('');
  }
};

const ArchiveDemoData = {
  inferKind(tableName) {
    const n = tableName || '';
    if (/通联|通讯|电话/.test(n)) return 'call';
    if (/旅业|住宿|旅馆/.test(n)) return 'hotel';
    if (/民航|航班|订票/.test(n)) return 'flight';
    if (/铁路|列车/.test(n)) return 'rail';
    if (/手机|实名/.test(n)) return 'phone';
    if (/嫌疑|案件/.test(n)) return 'case';
    if (/警情/.test(n)) return 'alert';
    return 'generic';
  },

  getPerson(name, idNo, phone) {
    const rawId = (idNo || '').trim();
    const rawPhone = (phone || '').trim();
    const idLooksPhone = /^1[3-9]\d{9}$/.test(rawId);
    const displayPhone = rawPhone || (idLooksPhone ? rawId : '13800138000');
    const displayId = (!idLooksPhone && /^\d{15,18}/.test(rawId))
      ? rawId
      : (rawId && !idLooksPhone ? rawId : '350102198001011234');
    const displayName = (name || '').trim() || '张三';
    return {
      name: displayName,
      idNo: displayId,
      phone: displayPhone,
      gender: '男',
      nation: '汉',
      hukou: '福建省福州市鼓楼区',
      address: '福建省厦门市思明区',
      tags: ['重点人员', '前科'],
      overview: [
        { label: '最近轨迹', value: '2026-07-15 入住厦门思明旅馆' },
        { label: '通联概况', value: `近 30 日主叫 128 次（${displayPhone}）` },
        { label: '关联案件', value: '2 起（嫌疑人）' }
      ]
    };
  },

  mockRaw(tableName, person, idx) {
    const kind = this.inferKind(tableName);
    const i = idx || 0;
    const base = { 姓名: person.name, 证件号码: person.idNo };
    if (kind === 'hotel') {
      return { ...base, 入住时间: i ? '2026-06-02 21:10' : '2026-07-15 18:20', 旅馆名称: i ? '福州鼓楼商务酒店' : '厦门思明旅馆', 房间号: i ? '503' : '1208', 离店时间: i ? '2026-06-03 08:00' : '2026-07-16 10:00' };
    }
    if (kind === 'flight') {
      return { ...base, 航班号: i ? 'CA1802' : 'MF8112', 舱位: 'Y', 出发: '福州长乐', 到达: i ? '上海虹桥' : '北京首都', 乘机日期: i ? '2026-05-18' : '2026-07-12' };
    }
    if (kind === 'rail') {
      return { ...base, 车次: i ? 'G1688' : 'D6206', 席别: '二等座', 出发: '福州', 到达: i ? '深圳北' : '厦门北', 乘车日期: i ? '2026-05-09' : '2026-06-28' };
    }
    if (kind === 'call') {
      return { 主叫号码: person.phone, 被叫号码: `139${String(20000000 + i).slice(-8)}`, 通话时间: i ? '2026-07-10 09:12:00' : '2026-07-22 14:30:00', 通话时长: i ? '00:03:12' : '00:12:08' };
    }
    if (kind === 'phone') {
      return { ...base, 手机号: person.phone, 运营商: '移动', 入网时间: '2018-03-11' };
    }
    if (kind === 'case') {
      return { ...base, 案件编号: `AJ${20260000 + i}`, 案件类型: '刑事案件', 角色: '嫌疑人' };
    }
    if (kind === 'alert') {
      return { ...base, 警情编号: `JQ${20261000 + i}`, 报警时间: '2026-07-08 21:04:00', 警情类型: '纠纷', 处置状态: '已办结' };
    }
    return { ...base, 来源表: tableName, 业务字段: `示例值 ${i + 1}`, 更新时间: '2026-07-22 08:23:24' };
  },

  mockMergedRow(tableName, person, idx) {
    const raw = this.mockRaw(tableName, person, idx);
    const kind = this.inferKind(tableName);
    const summary = {
      call: { 时间: raw.通话时间, 类型: '通联', 地点: `${raw.主叫号码} → ${raw.被叫号码}` },
      hotel: { 时间: raw.入住时间, 类型: '住宿', 地点: raw.旅馆名称 },
      flight: { 时间: raw.乘机日期, 类型: '民航', 地点: `${raw.出发} → ${raw.到达}` },
      rail: { 时间: raw.乘车日期, 类型: '铁路', 地点: `${raw.出发} → ${raw.到达}` },
      phone: { 时间: raw.入网时间, 类型: '手机', 地点: raw.手机号 },
      case: { 时间: '—', 类型: '案件', 地点: raw.案件编号 },
      alert: { 时间: raw.报警时间, 类型: '警情', 地点: raw.警情类型 },
      generic: { 时间: raw.更新时间 || '—', 类型: '业务', 地点: raw.业务字段 || tableName }
    }[kind];
    return { ...summary, 来源表: tableName, raw };
  },

  rowsForColumn(col, person) {
    if (!col) return [];
    if (col.type === 'merged') {
      const sources = ArchiveLoad.normalizeSources(col).filter(s => s.joinField);
      return sources.map((src, i) => {
        const row = this.mockMergedRow(src.tableName, person, i);
        const view = ArchiveLoad.projectRow(row, col.displayFields || ['时间', '类型', '地点', '来源表']);
        view.raw = row.raw;
        view.来源表 = row.来源表;
        return view;
      });
    }
    if (!col.tableName || !col.joinField || !(col.displayFields || []).length) return [];
    return [0, 1].map(i => ArchiveLoad.projectRow(this.mockRaw(col.tableName, person, i), col.displayFields));
  }
};

const ArchivePresent = {
  icon(kind) {
    const paths = {
      flight: '<path d="M3 13.2 21 7l-6.2 12-2.6-5.3L7.8 16z"/>',
      rail: '<rect x="5" y="3.5" width="14" height="12.5" rx="2"/><path d="M5 10h14M4 21h16"/>',
      hotel: '<path d="M4 20V9l8-4 8 4v11"/><path d="M9 20v-5h6v5"/>',
      phone: '<rect x="8" y="2.5" width="8" height="19" rx="2"/>',
      call: '<path d="M7 3h3l1 4-2 2c1 2 3 4 5 5l2-2 4 1v3c-4 1-10-2-13-7S6 4 7 3z"/>',
      case: '<path d="M14 8 8 14M9.2 6.2 17.8 14.8M4 20h8"/>',
      alert: '<path d="M12 4 3.3 19h17.4z"/><path d="M12 10v4"/>',
      merged: '<path d="M4 6h16M4 12h10M4 18h13"/>',
      generic: '<path d="M4 6h16v12H4z"/>'
    };
    return `<svg class="arch-ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">${paths[kind] || paths.generic}</svg>`;
  },

  pick(row, names) {
    for (const n of names) {
      if (row && row[n] != null && row[n] !== '') return row[n];
    }
    return '—';
  },

  kindOf(col, row) {
    if (row?.类型) {
      const t = String(row.类型);
      if (/民航|航班/.test(t)) return 'flight';
      if (/铁路|列车/.test(t)) return 'rail';
      if (/住宿|旅/.test(t)) return 'hotel';
      if (/通联|电话/.test(t)) return 'call';
      if (/手机/.test(t)) return 'phone';
      if (/案件/.test(t)) return 'case';
      if (/警情/.test(t)) return 'alert';
    }
    const table = col.tableName || row?.来源表 || '';
    return ArchiveDemoData.inferKind(table);
  },

  modeOf(col) {
    if (col.view === 'table' || col.view === 'card' || col.view === 'chart') return col.view;
    if (col.present === 'table') return 'table';
    if (col.present === 'card') return 'card';
    if (col.type === 'merged') return 'card';
    const kind = ArchiveDemoData.inferKind(col.tableName);
    return ['flight', 'rail', 'hotel', 'phone', 'call'].includes(kind) ? 'card' : 'table';
  },

  renderChart(rows, col) {
    const valueKey = col.valueField || Object.keys(rows[0] || {}).find(k => k !== 'raw' && !Number.isNaN(Number(rows[0][k])));
    const labelKey = col.categoryField || Object.keys(rows[0] || {}).find(k => k !== 'raw' && k !== valueKey);
    const max = Math.max(...rows.map(r => Number(r[valueKey]) || 0), 1);
    return `<div class="arch-present-list">${rows.map(r => {
      const n = Number(r[valueKey]) || 0;
      const width = Math.round((n / max) * 100);
      return `<article class="arch-leg"><div style="flex:1"><div class="arch-leg-meta"><span>${r[labelKey] ?? '—'}</span><strong>${n || '—'}</strong></div><div style="height:6px;border-radius:99px;background:#e8eef8;margin-top:6px"><i style="display:block;height:6px;border-radius:99px;background:#1677ff;width:${width}%"></i></div></div></article>`;
    }).join('')}</div>`;
  },

  keepManual(input) {
    const key = input.getAttribute('data-manual-key');
    const field = input.getAttribute('data-manual-field');
    if (!key || !field) return;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch { saved = {}; }
    saved[field] = input.value;
    localStorage.setItem(key, JSON.stringify(saved));
  },

  renderManual(col) {
    const key = `kg_manual_rows:${col.id || col.name || 'col'}`;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch { saved = {}; }
    const fields = col.displayFields || [];
    const inputs = fields.map(name => `<label style="display:flex;flex-direction:column;gap:4px;font-size:12px;color:#667">${name}<input data-manual-key="${key}" data-manual-field="${name}" value="${String(saved[name] || '').replace(/"/g, '&quot;')}" placeholder="录入" style="height:32px;border:1px solid #e8ecf2;border-radius:4px;padding:0 8px" oninput="ArchivePresent.keepManual(this)"></label>`).join('');
    return `<form class="arch-manual" data-manual-form="${key}" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-top:10px">${inputs}</form>`;
  },

  sourceNames(col) {
    if (!col || col.type === 'merged') return [];
    const names = [];
    const map = Array.isArray(col.fieldMap) ? col.fieldMap.filter(item => item.display !== false) : [];
    map.forEach(item => {
      const table = item.sourceTable || col.tableName;
      if (table && !names.includes(table)) names.push(table);
    });
    if (!names.length && col.tableName) names.push(col.tableName);
    return names;
  },

  sourceLink(col, idx) {
    if (!this.sourceNames(col).length) return '';
    return `<a class="btn-link" data-source-col="${col.id}" data-source-idx="${idx}">查看</a>`;
  },

  renderTable(rows, col) {
    if (!rows?.length) return '<p class="archive-hint">暂无数据</p>';
    const keys = Object.keys(rows[0]).filter(k => k !== 'raw');
    const hasRaw = rows.some(r => r.raw);
    const canSource = this.sourceNames(col).length > 0;
    return `
      <div class="super-table-wrap">
        <table class="data-table">
          <thead><tr>${keys.map(k => `<th>${k}</th>`).join('')}${hasRaw ? '<th>操作</th>' : ''}${canSource ? '<th>来源</th>' : ''}</tr></thead>
          <tbody>
            ${rows.map((r, i) => `
              <tr>
                ${keys.map(k => `<td>${r[k] ?? '—'}</td>`).join('')}
                ${hasRaw ? `<td><a class="btn-link" data-raw-col="${col.id}" data-raw-idx="${i}">详情</a></td>` : ''}
                ${canSource ? `<td><a class="btn-link" data-source-col="${col.id}" data-source-idx="${i}">查看</a></td>` : ''}
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  },

  renderCard(row, col, idx) {
    const view = Object.assign({}, row, row.raw || {});
    const kind = this.kindOf(col, row);
    const hasRaw = !!row.raw;
    const detail = hasRaw ? `<a class="btn-link" data-raw-col="${col.id}" data-raw-idx="${idx}">详情</a>` : '';
    if (kind === 'flight' || kind === 'rail') {
      const code = this.pick(view, ['航班号', '车次']);
      let from = this.pick(view, ['出发']);
      let to = this.pick(view, ['到达']);
      if ((from === '—' || to === '—') && view.地点) {
        const parts = String(view.地点).split(/\s*[→\-–]\s*/);
        if (parts.length === 2) { from = parts[0]; to = parts[1]; }
      }
      const when = this.pick(view, ['乘机日期', '乘车日期', '时间']);
      const route = from !== '—' || to !== '—'
        ? `${from}<span class="arch-leg-arrow">${this.icon(kind)}</span>${to}`
        : this.pick(view, ['舱位', '席别', '地点']);
      return `
        <article class="arch-leg arch-leg-${kind}">
          <div class="arch-leg-ico">${this.icon(kind)}</div>
          <div>
            <div class="arch-leg-meta"><span>${kind === 'flight' ? '航班' : '列车'}</span><strong>${code === '—' ? (kind === 'flight' ? '民航' : '铁路') : code}</strong><time>${when}</time></div>
            <div class="arch-leg-route">${route}</div>
            ${detail}
            ${this.sourceLink(col, idx)}
          </div>
        </article>`;
    }
    if (kind === 'hotel') {
      const room = this.pick(view, ['房间号']);
      const leave = this.pick(view, ['离店时间']);
      const sub = [room !== '—' ? `房间 ${room}` : '', leave !== '—' ? `离店 ${leave}` : ''].filter(Boolean).join(' · ');
      return `
        <article class="arch-leg arch-leg-hotel">
          <div class="arch-leg-ico">${this.icon('hotel')}</div>
          <div>
            <div class="arch-leg-meta"><span>住宿</span><strong>${this.pick(view, ['旅馆名称', '地点'])}</strong><time>${this.pick(view, ['入住时间', '时间'])}</time></div>
            ${sub ? `<div class="arch-leg-place">${sub}</div>` : ''}
            ${detail}
            ${this.sourceLink(col, idx)}
          </div>
        </article>`;
    }
    if (kind === 'phone') {
      return `
        <article class="arch-tile">
          <div class="arch-leg-ico">${this.icon('phone')}</div>
          <div>
            <em>手机号</em>
            <strong>${this.pick(view, ['手机号', '地点'])}</strong>
            <span>${this.pick(view, ['运营商'])} · ${this.pick(view, ['入网时间', '时间'])}</span>
            ${this.sourceLink(col, idx)}
          </div>
        </article>`;
    }
    const keys = Object.keys(row).filter(k => k !== 'raw');
    return `
      <article class="arch-leg arch-leg-${kind}">
        <div class="arch-leg-ico">${this.icon(kind)}</div>
        <div>
          <div class="arch-leg-meta"><span>${this.pick(view, ['类型', '来源表']) || '记录'}</span><time>${this.pick(view, ['时间', '更新时间'])}</time></div>
          <div class="arch-leg-place">${this.pick(view, ['地点', '业务字段'])}</div>
          <div class="arch-leg-kv">${keys.slice(0, 4).map(k => `<span>${k} ${row[k] ?? '—'}</span>`).join('')}</div>
          ${detail}
          ${this.sourceLink(col, idx)}
        </div>
      </article>`;
  },

  render(rows, col, opts = {}) {
    const mode = this.modeOf(col);
    let body = '';
    if (!rows?.length) {
      body = `<p class="${opts.compact ? 'archive-preview-placeholder' : 'archive-hint'}">对齐字段和展示字段配齐后，按入口标识加载。</p>`;
    } else if (mode === 'table') {
      body = this.renderTable(rows, col);
    } else if (mode === 'chart') {
      body = this.renderChart(rows, col);
    } else {
      body = `<div class="arch-present-list">${rows.map((r, i) => this.renderCard(r, col, i)).join('')}</div>`;
    }
    if (col.allowManual) body += this.renderManual(col);
    return body;
  },

  glyph(name) {
    const body = {
      person: '<circle cx="12" cy="8" r="3.4"/><path d="M5.2 20c1.1-3.3 3.6-5 6.8-5s5.7 1.7 6.8 5"/>',
      id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2"/><path d="M14 10h5M14 14h4"/>',
      phone: '<rect x="8" y="2.5" width="8" height="19" rx="2"/><path d="M11 18.5h2"/>',
      home: '<path d="M4 11 12 4l8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
      car: '<path d="M4 16h16l1-4.5-3.2-4H7.2L3 11.5z"/><circle cx="7.5" cy="16.5" r="1.6"/><circle cx="16.5" cy="16.5" r="1.6"/>',
      house: '<path d="M4 11 12 3l8 8v10H4z"/><path d="M9 21v-7h6v7"/>',
      wallet: '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M3 10h18"/><circle cx="16.5" cy="14.5" r="1.1"/>',
      map: '<path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2z"/><path d="M9 4v14M15 6v14"/>',
      alert: '<path d="M12 4 3.3 19h17.4z"/><path d="M12 10v4M12 17h.01"/>',
      shield: '<path d="M12 3 5 6v6c0 4.6 3.2 7.6 7 9.5 3.8-1.9 7-4.9 7-9.5V6z"/>',
      camera: '<path d="M4 8h3.2L9 5h6l1.8 3H20v11H4z"/><circle cx="12" cy="13.5" r="3.2"/>',
      graph: '<path d="M4 19h16"/><path d="M7 16v-5M12 16V8M17 16v-8"/>',
      clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>',
      file: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>',
      tag: '<path d="M3.8 12.5 11.5 4.8H20v8.5l-7.7 7.7z"/><circle cx="16" cy="8.2" r="1.1"/>',
      chat: '<path d="M5 5h14v10H8l-3 3.8z"/>',
      badge: '<circle cx="12" cy="9" r="5.2"/><path d="M8.5 13.5 7 21l5-2.2L17 21l-1.5-7.5"/>',
      gavel: '<path d="M14 8 8 14"/><path d="M9.2 6.2 17.8 14.8"/><path d="M4 20h8"/><path d="M16.5 5.5l2 2"/>',
      fingerprint: '<path d="M12 4.8a6 6 0 0 1 6 6V13"/><path d="M8.2 11a3.8 3.8 0 0 1 7.6 0v5"/><path d="M10 12.2v5.2M14 11.5v6"/><path d="M7 14.5v2.2"/>',
      plane: '<path d="M3 13.2 21 7l-6.2 12-2.6-5.3L7.8 16z"/><path d="M10.2 11.4 21 7"/>',
      train: '<rect x="5" y="3.5" width="14" height="12.5" rx="2.2"/><path d="M5 10h14M8 16v2.5M16 16v2.5M4 21h16"/><circle cx="9" cy="13" r="0.9"/><circle cx="15" cy="13" r="0.9"/>',
      hotel: '<path d="M4 20V9l8-4 8 4v11"/><path d="M9 20v-5h6v5"/><path d="M8 11h.01M12 11h.01M16 11h.01"/>',
      ship: '<path d="M3 16h18l-2 4H5z"/><path d="M6 16 8 8h8l2 8"/><path d="M12 8V5"/>'
    }[name];
    if (!body) return '';
    return `<svg class="archive-tab-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">${body}</svg>`;
  },

  renderOverview(person, source) {
    const fields = source.basicFields || [];
    const chips = person.overview || [];
    return `
      <div class="arch-overview">
        ${chips.length ? `<div class="arch-overview-chips">${chips.map(c => `<div class="arch-chip"><em>${c.label}</em><strong>${c.value}</strong></div>`).join('')}</div>` : ''}
        <div class="arch-overview-fields">
          ${fields.map(f => `<div class="archive-kv"><span>${f}</span><span>${ArchiveLoad.personValue(person, f)}</span></div>`).join('') || '<p class="archive-hint">未配置基础信息字段。</p>'}
        </div>
      </div>`;
  }
};
