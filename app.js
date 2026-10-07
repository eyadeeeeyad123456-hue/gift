const asset = 'assets/';
const ADMIN_PIN = '20101123';
let currentPin = sessionStorage.getItem('farah-admin-pin') || '';

// قاعدة بيانات التعديلات المتزامنة
let siteData = {
  texts: {},
  stickers: {}
};

const photos = {
  'صغيره': [
    '825258966_2299543287506173_4764145132885408261_n.jpg',
    '825258972_2576381376170290_1151878071424940884_n.jpg',
    '825258974_1831182304722950_8053351857961374434_n.jpg',
    '825261530_1087092110868996_8748091286733964091_n.jpg',
    '825309650_4468810440100516_4066089551324246045_n.jpg',
    '825309667_1639627547717650_1362358262546113247_n.jpg',
    '825311989_954332684398899_6287323255274347419_n.jpg',
    '825873870_1105939751988468_1189325907529937634_n.jpg',
    '827745518_1408194377486119_6003662887613372201_n.jpg',
    '828082730_1795520021705959_2760609300285307612_n.jpg',
    '828615666_2326052084835750_5514655322462417520_n.jpg',
    '828625394_934164572894307_7462032002395253018_n.jpg',
    '829092115_2048406112544624_6136365380017880565_n.jpg',
    '829154364_1446076907624657_201113182553269907_n.jpg',
    '829526998_1706094563823174_3648198057686720409_n.jpg',
    '831165589_2235405660570836_4723092883778456915_n.jpg'
  ],
  coffee: [
    '825309665_1122628673556447_5362245636791843108_n.jpg',
    '825309679_1429901069022303_5791818701526315205_n.jpg',
    '825309692_994911760307055_2195451739668535972_n.jpg',
    '825311939_1123747079998008_6605832145144766819_n.jpg',
    '825311956_27405478305795801_3919308313628834504_n.jpg',
    '825311965_2042455459796474_6828414968851833023_n.jpg',
    '825311965_2109988249886304_5116888112443803107_n.jpg',
    '827855632_1515497343717229_1407617278139939260_n.jpg',
    '827855640_1761729515052895_5991045435999486286_n.jpg',
    '828332624_1859545608804977_4877409582844621129_n.jpg',
    '828710334_1423358769758822_470784756586416331_n.jpg',
    '829097692_1418358972960947_6589868346013363245_n.jpg'
  ],
  matcha: [
    '825256711_973870894997160_9119056252264983112_n.jpg',
    '825311977_1422483036074464_4225643150205917010_n.jpg',
    '825311977_1422483036074464_4225643150205917010_n(1).jpg',
    '825312626_1623272659290187_7409654660169989910_n.jpg',
    '829362578_2640061556439978_1200589869516245765_n.jpg'
  ],
  flowers: [
    '825309745_926683720199054_4135133568343299338_n.jpg',
    '825311027_4381193982104494_8469871729427619356_n.jpg'
  ]
};

const labels = {
  coffee: ['قهوتك المفضلة', 'لحظة كافيين', 'مزاج هادي', 'صباح جميل'],
  matcha: ['أخضر يليق عليك', 'ماتشا وهدوء', 'تفصيلة لطيفة'],
  flowers: ['ورد… بس لك', 'لأنك تحبينه']
};

const defaultCaptions = {
  'صغيره': ['بداية الحكاية', 'كيوت من زمان', 'ضحكة ما تتغير', 'أيام صغيرة', 'يا زين الذكرى']
};

// إنشاء معرض الصور
function makePhotos(folder, el) {
  if (!el || !photos[folder]) return;
  el.innerHTML = '';
  photos[folder].forEach((file, i) => {
    const fig = document.createElement('figure');
    const defaultText = folder === 'صغيره'
      ? defaultCaptions['صغيره'][i % defaultCaptions['صغيره'].length]
      : labels[folder][i % labels[folder].length];
    
    const editKey = `photo-${folder}-${i}`;
    const savedText = siteData.texts[editKey] || localStorage.getItem(`farah-edit-${editKey}`) || defaultText;
    
    fig.className = 'photo';
    fig.style.setProperty('--rot', `${[-3, 2, -1, 3, -2, 1][i % 6]}deg`);
    fig.innerHTML = `
      <img loading="lazy" src="${asset}${folder === 'coffee' ? 'قهوه' : folder === 'matcha' ? 'ماتشا' : folder === 'flowers' ? 'ورد' : 'صغيره'}/${file}" alt="ذكرى فرح">
      <figcaption data-editable data-edit-key="${editKey}">${savedText}</figcaption>
    `;
    el.append(fig);
  });
}

// إنشاء الملصقات الإضافية
const transparentFolder = 'assets/هيلو كيتي/صور بدون خلفية/';
const extraStickerConfigs = [
  { id: 'sticker-extra-0', file: '03_هيلو_كيتي_سيلفي_جوال.png', host: '#memories', left: '81%', top: '24%', rot: '-8deg' },
  { id: 'sticker-extra-1', file: '06_رأس_هيلو_كيتي.png', host: '#memories', left: '8%', top: '62%', rot: '10deg' },
  { id: 'sticker-extra-2', file: '07_هيلو_كيتي_حلاوة_شريطة_صفراء.png', host: '#albums', left: '80%', top: '35%', rot: '8deg' },
  { id: 'sticker-extra-3', file: '09_هيلو_كيتي_غمزة_شريطة_جمجمة.png', host: '#albums', left: '6%', top: '75%', rot: '-8deg' },
  { id: 'sticker-extra-4', file: '10_هيلو_كيتي_واقفة_فستان_وردي.png', host: '.notes', left: '75%', top: '9%', rot: '6deg' },
  { id: 'sticker-extra-5', file: '12_هيلو_كيتي_تطل_من_شريطة_وردية.png', host: '#things-sec', left: '10%', top: '16%', rot: '-6deg' },
  { id: 'sticker-extra-6', file: '14_رأس_هيلو_كيتي_مائل.png', host: '#music', left: '9%', top: '70%', rot: '11deg' },
  { id: 'sticker-extra-7', file: '6tbgsi7mg6jbvaqc5pka67rlae_no_bg.png', host: '.voice', left: '78%', top: '12%', rot: '-7deg' },
  { id: 'sticker-extra-8', file: 'CITYPNG_Hello_Kitty_Cute_Red_Bow_no_bg.png', host: '.grown', left: '7%', top: '12%', rot: '8deg' },
  { id: 'sticker-extra-9', file: 'pngtree-hello-kitty-cake_no_bg.png', host: '.letter', left: '80%', top: '12%', rot: '-8deg' }
];

function initExtraStickers() {
  extraStickerConfigs.forEach(({ id, file, host, left, top, rot }) => {
    const parent = document.querySelector(host);
    if (!parent || parent.querySelector(`[data-sticker-id="${id}"]`)) return;
    const sticker = document.createElement('img');
    sticker.className = 'admin-sticker extra-sticker';
    sticker.dataset.stickerId = id;
    sticker.src = transparentFolder + file;
    sticker.alt = 'ملصق Hello Kitty';
    sticker.style.left = left;
    sticker.style.top = top;
    sticker.style.transform = `rotate(${rot})`;
    parent.append(sticker);
  });
}

// الأغاني
const songs = [
  { title: 'The Winner Takes It All', artist: 'ABBA', file: 'ABBA - Winner take it all .mp3', cover: 'https://editorial.universal881.com/wp-content/uploads/2024/08/The-Winner-Takes-It-All-1-ABBA.jpg' },
  { title: 'Circles', artist: 'Mac Miller', file: 'Circles.mp3', cover: 'assets/circles-cover.png' },
  { title: 'Love', artist: 'Keyshia Cole', file: 'Keyshia_Cole_-_Love.mp3', cover: 'https://i1.sndcdn.com/artworks-000121915269-8lladc-t500x500.jpg' }
];

const audio = document.querySelector('#audio');
const music = document.querySelector('.music');
const art = document.querySelector('.album-art');
const title = document.querySelector('.track-title');
const artist = document.querySelector('.track-artist');
const now = document.querySelector('.now-playing');
const play = document.querySelector('.play-toggle');
let chosen = 0;

function setupAudioPlayer() {
  const trackList = document.querySelector('.track-list');
  if (trackList) {
    trackList.innerHTML = songs.map((s, i) => {
      const editKey = `song-${i}`;
      const saved = siteData.texts[editKey] || `${s.title} — ${s.artist}`;
      return `<button data-song="${i}" data-editable data-edit-key="${editKey}">${saved}</button>`;
    }).join('');
  }

  function chooseSong(i) {
    chosen = i;
    const s = songs[i];
    const trackBtn = document.querySelector(`[data-song="${i}"]`);
    const editedLabel = trackBtn?.textContent.split(' — ');
    audio.src = asset + 'اغاني تحبها/' + s.file;
    art.src = s.cover;
    title.textContent = editedLabel?.[0] || s.title;
    artist.textContent = editedLabel?.[1] || s.artist;
    now.textContent = 'الآن تدور الأغنية ♫';
    document.querySelectorAll('[data-song]').forEach(b => b.classList.toggle('active', +b.dataset.song === i));
  }

  chooseSong(0);

  document.querySelectorAll('[data-song]').forEach(b => {
    b.onclick = () => {
      if (document.body.classList.contains('admin-mode')) return;
      chooseSong(+b.dataset.song);
      audio.play().catch(() => {});
    };
  });

  function togglePlay() {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  if (play) play.onclick = togglePlay;
  const vinylBtn = document.querySelector('.vinyl');
  if (vinylBtn) vinylBtn.onclick = togglePlay;

  audio.onplay = () => {
    music?.classList.add('playing');
    if (play) play.textContent = 'إيقاف مؤقت ❚❚';
  };
  audio.onpause = () => {
    music?.classList.remove('playing');
    if (play) play.textContent = 'تشغيل ♫';
  };
  audio.ontimeupdate = () => {
    const prog = document.querySelector('.progress span');
    if (prog) prog.style.width = ((audio.currentTime / audio.duration) * 100 || 0) + '%';
  };
  audio.onended = () => chooseSong((chosen + 1) % songs.length);
}

// التسجيلات الصوتية
const voiceFiles = ['اغنيه.ogg', 'Instagram • الرسائل.ogg'];
let voiceAudio = null;
let activeVoiceButton = null;
let voiceAnimation = null;

function setupVoicePlayer() {
  const container = document.querySelector('.voice-buttons');
  if (!container) return;
  container.innerHTML = voiceFiles.map((x, i) => `
    <button data-voice="${x}">▶ تسجيل ${i + 1}</button>
  `).join('');

  document.querySelectorAll('[data-voice]').forEach(button => {
    button.onclick = () => {
      const isSame = activeVoiceButton === button;
      if (isSame && voiceAudio && !voiceAudio.paused) {
        voiceAudio.pause();
        button.textContent = `▶ ${button.dataset.voice.includes('Instagram') ? 'تسجيل 2' : 'تسجيل 1'}`;
        if (voiceAnimation) voiceAnimation.pause();
        return;
      }
      if (voiceAudio) voiceAudio.pause();
      document.querySelectorAll('[data-voice]').forEach(b => {
        b.textContent = `▶ ${b.dataset.voice.includes('Instagram') ? 'تسجيل 2' : 'تسجيل 1'}`;
      });
      voiceAudio = new Audio(asset + 'تغني/' + button.dataset.voice);
      activeVoiceButton = button;
      button.textContent = '❚❚ إيقاف مؤقت';
      voiceAudio.play().catch(() => {});
      const cassette = document.querySelector('.cassette');
      if (cassette) {
        voiceAnimation = cassette.animate([
          { transform: 'rotate(-5deg)' },
          { transform: 'rotate(-3deg)' },
          { transform: 'rotate(-5deg)' }
        ], { duration: 500, iterations: Infinity });
      }
      voiceAudio.onended = () => {
        button.textContent = `▶ ${button.dataset.voice.includes('Instagram') ? 'تسجيل 2' : 'تسجيل 1'}`;
        if (voiceAnimation) voiceAnimation.cancel();
      };
    };
  });
}

// التعديلات والحفظ في السيرفر والمزامنة السحابية (Supabase & Local)
const body = document.body;
const adminPanel = document.querySelector('.admin-panel');
const syncStatus = document.querySelector('#sync-status');
const saveToast = document.querySelector('#save-toast');
let saveTimeout = null;
let supabaseClient = null;

function showToast(msg) {
  if (!saveToast) return;
  saveToast.textContent = msg;
  saveToast.classList.add('show');
  setTimeout(() => saveToast.classList.remove('show'), 2800);
}

// الإعدادات السحابية الافتراضية المؤكدة لـ Supabase
const DEFAULT_SUPABASE_CONFIG = {
  url: 'https://yxxvsmuvowviakxeitor.supabase.co',
  anonKey: 'sb_publishable_uUkLSKLLog9MOYmwBrDWWQ_71PptEGX',
  tableName: 'site_data',
  recordId: 'farah_scrapbook'
};

const isLocalServer = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' || 
         window.location.port === '4173';
};

// قراءة إعدادات Supabase
function getSupabaseSettings() {
  const local = localStorage.getItem('farah_supabase_config');
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (parsed.url && parsed.anonKey) return parsed;
    } catch (e) {}
  }
  if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey) {
    return window.SUPABASE_CONFIG;
  }
  return DEFAULT_SUPABASE_CONFIG;
}

// تهيئة عميل Supabase
function initSupabase() {
  const cfg = getSupabaseSettings();
  if (cfg && cfg.url && cfg.anonKey && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey);
      return true;
    } catch (e) {
      console.warn('تعذر تهيئة عميل Supabase:', e);
    }
  }
  return false;
}

// جلب البيانات من Supabase مباشرة
async function fetchFromSupabase(cfg) {
  const url = `${cfg.url}/rest/v1/${cfg.tableName || 'site_data'}?id=eq.${cfg.recordId || 'farah_scrapbook'}&select=*`;
  const res = await fetch(url, {
    headers: {
      'apikey': cfg.anonKey,
      'Authorization': 'Bearer ' + cfg.anonKey
    }
  });
  if (!res.ok) throw new Error('فشل جلب البيانات من Supabase: ' + res.status);
  const rows = await res.json();
  if (Array.isArray(rows) && rows.length > 0 && rows[0].data) {
    return rows[0].data;
  }
  return {};
}

// حفظ البيانات في Supabase مباشرة
async function upsertToSupabase(cfg, dataToSave) {
  const url = `${cfg.url}/rest/v1/${cfg.tableName || 'site_data'}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': cfg.anonKey,
      'Authorization': 'Bearer ' + cfg.anonKey,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      id: cfg.recordId || 'farah_scrapbook',
      data: dataToSave,
      updated_at: new Date().toISOString()
    })
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error('خطأ Supabase: ' + errText);
  }
  return true;
}

// جلب التعديلات (من Supabase أولاً)
async function loadServerData() {
  // 1. قراءة فورية من التخزين المؤقت
  const localCache = localStorage.getItem('farah_cloud_data');
  if (localCache) {
    try {
      siteData = JSON.parse(localCache);
      applyDataToDOM();
    } catch (e) {}
  }

  // 2. إذا كان Supabase مفعلاً (وهو الافتراضي الآن)، نقرأ منه مباشرة
  const cfg = getSupabaseSettings();
  if (cfg && cfg.url && cfg.anonKey) {
    try {
      const cloudData = await fetchFromSupabase(cfg);
      if (cloudData) {
        siteData.texts = cloudData.texts || {};
        siteData.stickers = cloudData.stickers || {};
        localStorage.setItem('farah_cloud_data', JSON.stringify(siteData));
        applyDataToDOM();
        if (syncStatus) syncStatus.textContent = '⚡ متزامن سحابياً (Supabase)';
        return; // اكتمل بنجاح، لا حاجة لطلب السيرفر المحلي
      }
    } catch (err) {
      console.warn('خطأ في جلب بيانات Supabase:', err);
    }
  }

  // 3. إن كان يعمل على سيرفر محلي خاص Node.js ولم نصل لـ Supabase
  if (isLocalServer()) {
    try {
      const res = await fetch('/api/data?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          siteData.texts = data.texts || siteData.texts || {};
          siteData.stickers = data.stickers || siteData.stickers || {};
          localStorage.setItem('farah_cloud_data', JSON.stringify(siteData));
          applyDataToDOM();
          if (syncStatus) syncStatus.textContent = '☁️ متزامن مع السيرفر المحلي';
        }
      }
    } catch (err) {
      if (syncStatus) syncStatus.textContent = '⚠️ يعمل محلياً';
    }
  }
}

// تطبيق البيانات على الواجهة
function applyDataToDOM() {
  // النصوص
  document.querySelectorAll('[data-editable]').forEach(el => {
    const key = el.dataset.editKey;
    if (key && siteData.texts[key] !== undefined) {
      el.innerHTML = siteData.texts[key];
    }
  });

  // الملصقات
  document.querySelectorAll('.admin-sticker').forEach(sticker => {
    const id = sticker.dataset.stickerId;
    if (id && siteData.stickers[id]) {
      const s = siteData.stickers[id];
      sticker.style.right = 'auto';
      sticker.style.bottom = 'auto';
      if (s.left) sticker.style.left = s.left;
      if (s.top) sticker.style.top = s.top;
      if (s.scale) sticker.style.scale = s.scale;
    }
  });
}

// حفظ البيانات في السيرفر أو في Supabase
async function saveToServer(manual = false) {
  if (syncStatus) syncStatus.textContent = 'جاري المزامنة والحفظ... ⏳';
  
  // حفظ محلي فوري
  localStorage.setItem('farah_cloud_data', JSON.stringify(siteData));

  // 1. الحفظ في سحابة Supabase مباشرة
  const cfg = getSupabaseSettings();
  if (cfg && cfg.url && cfg.anonKey) {
    try {
      await upsertToSupabase(cfg, siteData);
      if (syncStatus) syncStatus.textContent = '⚡ متزامن سحابياً (Supabase) ✓';
      if (manual) showToast('تم الحفظ في سحابة Supabase بنجاح ⚡☁️');
      return; // اكتمل بنجاح، لا حاجة لطلب السيرفر المحلي
    } catch (err) {
      console.warn('خطأ أثناء حفظ Supabase:', err);
      if (syncStatus) syncStatus.textContent = '⚠️ تعذر الحفظ السحابي';
      if (manual) showToast('⚠️ تعذر الحفظ السحابي في Supabase');
    }
  }

  // 2. الحفظ عبر السيرفر المحلي إذا كان يعمل على Node.js
  if (isLocalServer()) {
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Pin': currentPin || ADMIN_PIN
        },
        body: JSON.stringify({
          pin: currentPin || ADMIN_PIN,
          texts: siteData.texts,
          stickers: siteData.stickers
        })
      });

      if (res.ok) {
        if (syncStatus) syncStatus.textContent = '☁️ متزامن محلياً (تم الحفظ)';
        if (manual) showToast('تم حفظ التعديلات محلياً بنجاح ☁️');
      }
    } catch (err) {
      if (syncStatus) syncStatus.textContent = '⚠️ تم الحفظ محلياً على هذا الجهاز';
    }
  }
}

function debouncedSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => saveToServer(false), 800);
}

// تهيئة العناصر القابلة للتعديل
function prepareEditable() {
  const isAdmin = body.classList.contains('admin-mode');
  let autoIdx = 0;
  document.querySelectorAll('[data-editable]').forEach(el => {
    if (!el.dataset.editKey) {
      el.dataset.editKey = `auto-${autoIdx++}`;
    }
    const key = el.dataset.editKey;
    if (siteData.texts[key] !== undefined) {
      el.innerHTML = siteData.texts[key];
    }
    el.contentEditable = isAdmin ? 'true' : 'false';
  });
}

// رصد التعديلات في النصوص
document.addEventListener('input', e => {
  const el = e.target.closest('[data-editable]');
  if (el && el.dataset.editKey) {
    siteData.texts[el.dataset.editKey] = el.innerHTML;
    debouncedSave();
  }
});

// نافذة رمز الإدارة (PIN Modal)
const pinDialog = document.querySelector('#admin-pin-dialog');
const pinInput = document.querySelector('#admin-pin-input');
const pinError = document.querySelector('#pin-error-msg');
const pinSubmit = document.querySelector('#submit-pin-btn');
const pinClose = document.querySelector('#close-pin-dialog');

function openPinDialog() {
  if (pinDialog) {
    pinDialog.classList.add('show');
    pinDialog.setAttribute('aria-hidden', 'false');
    if (pinInput) {
      pinInput.value = '';
      pinInput.focus();
    }
    if (pinError) pinError.textContent = '';
  }
}

function closePinDialog() {
  if (pinDialog) {
    pinDialog.classList.remove('show');
    pinDialog.setAttribute('aria-hidden', 'true');
  }
}

if (pinClose) pinClose.onclick = closePinDialog;
if (pinDialog) {
  pinDialog.onclick = e => {
    if (e.target === pinDialog) closePinDialog();
  };
}

function verifyAndEnterAdmin() {
  const entered = (pinInput?.value || '').trim();
  if (entered === ADMIN_PIN) {
    currentPin = ADMIN_PIN;
    sessionStorage.setItem('farah-admin-pin', currentPin);
    closePinDialog();
    enterAdminMode();
    showToast('مرحباً بك في وضع التعديل 🎀✎');
  } else {
    if (pinError) pinError.textContent = 'الرمز غير صحيح، حاول مرة أخرى ❌';
    pinInput?.select();
  }
}

if (pinSubmit) pinSubmit.onclick = verifyAndEnterAdmin;
if (pinInput) {
  pinInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') verifyAndEnterAdmin();
  });
}

function enterAdminMode() {
  adminPanel?.classList.add('open');
  body.classList.add('admin-mode');
  adminPanel?.setAttribute('aria-hidden', 'false');
  prepareEditable();
}

function exitAdminMode() {
  adminPanel?.classList.remove('open');
  body.classList.remove('admin-mode');
  adminPanel?.setAttribute('aria-hidden', 'true');
  prepareEditable();
}

// زر فتح لوحة الإدارة (✎)
document.querySelector('.admin-trigger').onclick = () => {
  if (currentPin === ADMIN_PIN) {
    if (adminPanel?.classList.contains('open')) {
      exitAdminMode();
    } else {
      enterAdminMode();
    }
  } else {
    openPinDialog();
  }
};

// زر إغلاق لوحة الإدارة
document.querySelector('.close-admin').onclick = exitAdminMode;

// زر قفل وضع التعديل
const lockBtn = document.querySelector('#lock-admin');
if (lockBtn) {
  lockBtn.onclick = () => {
    currentPin = '';
    sessionStorage.removeItem('farah-admin-pin');
    exitAdminMode();
    showToast('تم قفل وضع التعديل 🔒');
  };
}

// زر الحفظ اليدوي لجميع الأجهزة
const saveServerBtn = document.querySelector('#save-server-btn');
if (saveServerBtn) {
  saveServerBtn.onclick = () => saveToServer(true);
}

// نافذة إعدادات Supabase
const supabaseDialog = document.querySelector('#supabase-dialog');
const openSupabaseBtn = document.querySelector('#open-supabase-dialog');
const closeSupabaseBtn = document.querySelector('#close-supabase-dialog');
const supabaseUrlInput = document.querySelector('#supabase-url-input');
const supabaseKeyInput = document.querySelector('#supabase-key-input');
const supabaseStatusMsg = document.querySelector('#supabase-status-msg');
const saveSupabaseBtn = document.querySelector('#save-supabase-btn');

if (openSupabaseBtn) {
  openSupabaseBtn.onclick = () => {
    const cfg = getSupabaseSettings() || {};
    if (supabaseUrlInput) supabaseUrlInput.value = cfg.url || '';
    if (supabaseKeyInput) supabaseKeyInput.value = cfg.anonKey || '';
    if (supabaseStatusMsg) {
      supabaseStatusMsg.textContent = supabaseClient ? '✅ Supabase متصل حالياً' : 'ℹ️ أدخل الرابط والمفتاح للاتصال بالسحاب';
      supabaseStatusMsg.style.color = supabaseClient ? '#10b981' : '#6b7280';
    }
    supabaseDialog?.classList.add('show');
    supabaseDialog?.setAttribute('aria-hidden', 'false');
  };
}

if (closeSupabaseBtn) {
  closeSupabaseBtn.onclick = () => {
    supabaseDialog?.classList.remove('show');
    supabaseDialog?.setAttribute('aria-hidden', 'true');
  };
}

if (supabaseDialog) {
  supabaseDialog.onclick = e => {
    if (e.target === supabaseDialog) {
      supabaseDialog.classList.remove('show');
      supabaseDialog.setAttribute('aria-hidden', 'true');
    }
  };
}

if (saveSupabaseBtn) {
  saveSupabaseBtn.onclick = async () => {
    const url = (supabaseUrlInput?.value || '').trim();
    const anonKey = (supabaseKeyInput?.value || '').trim();

    if (!url || !anonKey) {
      if (supabaseStatusMsg) {
        supabaseStatusMsg.textContent = '❌ يرجى إدخال الرابط والمفتاح معاً';
        supabaseStatusMsg.style.color = '#ef4444';
      }
      return;
    }

    if (supabaseStatusMsg) {
      supabaseStatusMsg.textContent = 'جاري اختبار الاتصال بالسحاب... ⏳';
      supabaseStatusMsg.style.color = '#3b82f6';
    }

    try {
      if (!window.supabase) {
        throw new Error('مكتبة Supabase لم تُحمل بعد');
      }
      const testClient = window.supabase.createClient(url, anonKey);
      const { data, error } = await testClient.from('site_data').select('id').limit(1);
      if (error) {
        if (error.code === '42P01') {
          throw new Error('جدول site_data غير موجود! أنشئ الجدول عبر SQL Editor في Supabase.');
        } else {
          throw new Error(error.message || 'خطأ في الاتصال بـ Supabase');
        }
      }

      const newConfig = {
        url,
        anonKey,
        tableName: 'site_data',
        recordId: 'farah_scrapbook'
      };
      localStorage.setItem('farah_supabase_config', JSON.stringify(newConfig));
      supabaseClient = testClient;

      // مزامنة البيانات الحالية فوراً
      await saveToServer(false);

      if (supabaseStatusMsg) {
        supabaseStatusMsg.textContent = '✅ تم الاتصال بنجاح وتفعيل الحفظ السحابي!';
        supabaseStatusMsg.style.color = '#10b981';
      }
      if (syncStatus) syncStatus.textContent = '⚡ متزامن سحابياً (Supabase) ✓';
      showToast('تم تفعيل سحابة Supabase بنجاح ⚡☁️');

      setTimeout(() => {
        supabaseDialog?.classList.remove('show');
        supabaseDialog?.setAttribute('aria-hidden', 'true');
      }, 1500);
    } catch (err) {
      if (supabaseStatusMsg) {
        supabaseStatusMsg.textContent = '❌ ' + (err.message || 'فشل الاتصال');
        supabaseStatusMsg.style.color = '#ef4444';
      }
    }
  };
}

// استعادة النصوص الأصلية
document.querySelector('.reset-data').onclick = async () => {
  if (confirm('هل أنت متأكد من استعادة النصوص الأصلية وإلغاء جميع التعديلات؟')) {
    try {
      await fetch('/api/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Pin': currentPin || ADMIN_PIN
        },
        body: JSON.stringify({ pin: currentPin || ADMIN_PIN })
      });
    } catch (e) {}
    localStorage.removeItem('farah_cloud_data');
    location.reload();
  }
};

// حفظ واسترجاع ملف JSON كنسخة احتياطية
document.querySelector('#export-data').onclick = () => {
  const blob = new Blob([JSON.stringify(siteData, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'farah-scrapbook-backup.json';
  a.click();
};

document.querySelector('#import-data').onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (parsed) {
        siteData = {
          texts: parsed.texts || {},
          stickers: parsed.stickers || {}
        };
        applyDataToDOM();
        await saveToServer(true);
      }
    } catch (err) {
      alert('الملف غير صالح');
    }
  };
  reader.readAsText(file);
};

// تحريك وتكبير الملصقات
let selectedSticker = null;

function saveStickerState(sticker) {
  const id = sticker.dataset.stickerId;
  if (!id) return;
  siteData.stickers[id] = {
    left: sticker.style.left,
    top: sticker.style.top,
    scale: sticker.style.scale || '1'
  };
  debouncedSave();
}

function resizeSelected(delta) {
  if (!selectedSticker) return;
  const current = parseFloat(selectedSticker.style.scale) || 1;
  selectedSticker.style.scale = Math.max(0.4, Math.min(2.5, current + delta));
  saveStickerState(selectedSticker);
}

document.querySelector('#sticker-smaller').onclick = () => resizeSelected(-0.1);
document.querySelector('#sticker-larger').onclick = () => resizeSelected(0.1);

function setupStickerInteractions() {
  document.querySelectorAll('.admin-sticker').forEach(sticker => {
    sticker.addEventListener('pointerdown', event => {
      if (!body.classList.contains('admin-mode')) return;
      selectedSticker = sticker;
      event.preventDefault();
      const parent = sticker.parentElement;
      const box = parent.getBoundingClientRect();
      const startX = event.clientX;
      const startY = event.clientY;
      const initialLeft = sticker.offsetLeft;
      const initialTop = sticker.offsetTop;

      sticker.style.right = 'auto';
      sticker.style.bottom = 'auto';
      sticker.style.left = `${initialLeft}px`;
      sticker.style.top = `${initialTop}px`;
      sticker.setPointerCapture(event.pointerId);

      const move = e => {
        sticker.style.left = `${Math.max(0, Math.min(box.width - sticker.offsetWidth, initialLeft + e.clientX - startX))}px`;
        sticker.style.top = `${Math.max(0, Math.min(box.height - sticker.offsetHeight, initialTop + e.clientY - startY))}px`;
      };

      const up = () => {
        saveStickerState(sticker);
        sticker.removeEventListener('pointermove', move);
        sticker.removeEventListener('pointerup', up);
      };

      sticker.addEventListener('pointermove', move);
      sticker.addEventListener('pointerup', up);
    });

    sticker.addEventListener('wheel', event => {
      if (!body.classList.contains('admin-mode')) return;
      event.preventDefault();
      selectedSticker = sticker;
      resizeSelected(event.deltaY > 0 ? -0.1 : 0.1);
    }, { passive: false });
  });
}

// التحكم برحلة الهدية (Gift Journey)
const giftContent = document.querySelector('#gift-content');
const sadScene = document.querySelector('.choice-scene');
const giftReveal = document.querySelector('.gift-reveal');
const opening = document.querySelector('.opening');
const noBtn = document.querySelector('.no');
const yesBtn = document.querySelector('.yes');
let noPresses = 0;

function showGift() {
  sadScene?.classList.remove('show');
  giftReveal?.classList.add('show');
  giftReveal?.setAttribute('aria-hidden', 'false');
}

function enterGift() {
  giftReveal?.classList.remove('show');
  giftReveal?.setAttribute('aria-hidden', 'true');
  giftContent?.classList.remove('gift-locked');
  const intro = document.querySelector('#intro');
  if (intro) {
    intro.classList.remove('hidden');
    intro.scrollIntoView({ behavior: 'smooth' });
  }
}

if (yesBtn) {
  yesBtn.onclick = () => {
    if (!body.classList.contains('admin-mode')) showGift();
  };
}

// حركة زر "لاا" مع مراعاة شاشات الجوال لعدم الخروج عن الشاشة
function moveNo() {
  const maxOffset = Math.min(window.innerWidth * 0.22, 65);
  const x = Math.random() * (maxOffset * 2) - maxOffset;
  const y = Math.random() * 60 - 30;
  const rot = Math.random() * 16 - 8;
  noBtn.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
}

function dodgeNo() {
  noPresses++;
  opening?.classList.add('no-tried');
  opening?.classList.toggle('start-shown', noPresses % 2 === 0);
  moveNo();
}

if (noBtn) {
  noBtn.onmouseenter = moveNo;
  noBtn.ontouchstart = e => {
    if (body.classList.contains('admin-mode')) return;
    e.preventDefault();
    dodgeNo();
  };
  noBtn.onclick = () => {
    if (body.classList.contains('admin-mode')) return;
    dodgeNo();
    if (noPresses >= 3) {
      sadScene?.classList.add('show');
      sadScene?.setAttribute('aria-hidden', 'false');
    }
  };
}

document.querySelector('.try-yes').onclick = showGift;

// مزحة فتح الهدية
document.querySelector('.open-gift').onclick = () => {
  const card = document.querySelector('.gift-card');
  const line = card.querySelector('.gift-line');
  const subline = card.querySelector('.gift-subline');
  const button = card.querySelector('.open-gift');

  giftReveal.classList.add('pranking');
  card.querySelector('span').textContent = '🎁';
  line.textContent = 'هديتك شرابات 🧦';
  subline.textContent = '';
  button.style.display = 'none';

  setTimeout(() => {
    line.textContent = 'إيش مستنية؟ اطلعي 🎀';
    subline.textContent = '';
  }, 4500);

  setTimeout(() => {
    giftReveal.classList.remove('pranking');
    enterGift();
  }, 8500);
};

// تبويبات الألبومات
function setAlbum(folder) {
  const wall = document.querySelector('.album-wall');
  if (!wall) return;
  wall.dataset.folder = folder;
  makePhotos(folder, wall);
  prepareEditable();
  wall.querySelectorAll('.photo').forEach((p, i) => {
    setTimeout(() => p.classList.add('reveal'), i * 60);
  });
}

document.querySelectorAll('.thing').forEach(x => {
  x.onclick = () => {
    const albums = document.querySelector('#albums');
    if (albums) albums.scrollIntoView({ behavior: 'smooth' });
    setAlbum(x.dataset.scroll);
    document.querySelectorAll('.album-tabs button').forEach(b => {
      b.classList.toggle('active', b.dataset.target === x.dataset.scroll);
    });
  };
});

document.querySelectorAll('.album-tabs button').forEach(x => {
  x.onclick = () => {
    setAlbum(x.dataset.target);
    document.querySelectorAll('.album-tabs button').forEach(b => b.classList.toggle('active', b === x));
  };
});

// تكبير الصور Lightbox
const light = document.querySelector('.lightbox');
document.addEventListener('click', e => {
  if (body.classList.contains('admin-mode')) return;
  const p = e.target.closest('.photo');
  if (!p) return;
  const img = p.querySelector('img');
  const fig = p.querySelector('figcaption');
  if (light && img) {
    light.querySelector('img').src = img.src;
    light.querySelector('p').textContent = fig ? fig.textContent : '';
    light.classList.add('show');
  }
});

if (light) {
  light.querySelector('button').onclick = () => light.classList.remove('show');
  light.onclick = e => {
    if (e.target === light) light.classList.remove('show');
  };
}

// كشف الفيديو الختامي
const revealVideoBtn = document.querySelector('.reveal-video');
if (revealVideoBtn) {
  revealVideoBtn.onclick = () => {
    document.querySelector('.video-before').style.display = 'none';
    const content = document.querySelector('.video-content');
    if (content) {
      content.style.display = 'block';
      const vid = content.querySelector('video');
      if (vid) vid.play().catch(() => {});
    }
  };
}

// مراقبة ظهور عناصر الصور
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.photo').forEach((p, i) => setTimeout(() => p.classList.add('reveal'), i * 80));
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

// بدء التشغيل
(async function init() {
  initExtraStickers();
  makePhotos('صغيره', document.querySelector('.childhood'));
  makePhotos('coffee', document.querySelector('.album-wall'));
  setupAudioPlayer();
  setupVoicePlayer();
  setupStickerInteractions();
  document.querySelectorAll('.photo-wall').forEach(x => observer.observe(x));

  // جلب البيانات من السيرفر وتطبيقها
  await loadServerData();
  prepareEditable();
})();
