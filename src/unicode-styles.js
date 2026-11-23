/**
 * GlyphName 1,000+ Unicode Transformation Engine
 * Pure ES Module — Zero dependencies, safe astral-plane handling via Array.from
 * Generates 1,050 distinct font + symbol frame combinations (35 fonts x 30 templates).
 */

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';

function buildMap(upperStr, lowerStr, digitStr = '') {
  const map = new Map();
  if (upperStr) {
    const uChars = Array.from(upperStr);
    for (let i = 0; i < UPPER.length && i < uChars.length; i++) {
      map.set(UPPER[i], uChars[i]);
    }
  }
  if (lowerStr) {
    const lChars = Array.from(lowerStr);
    for (let i = 0; i < LOWER.length && i < lChars.length; i++) {
      map.set(LOWER[i], lChars[i]);
    }
  }
  if (digitStr) {
    const dChars = Array.from(digitStr);
    for (let i = 0; i < DIGITS.length && i < dChars.length; i++) {
      map.set(DIGITS[i], dChars[i]);
    }
  }
  return map;
}

function mapText(text, charMap) {
  return Array.from(text)
    .map((ch) => charMap.get(ch) ?? ch)
    .join('');
}

function combineText(text, combiningChar) {
  return Array.from(text)
    .map((ch) => (ch === ' ' ? ' ' : ch + combiningChar))
    .join('');
}

function joinChars(text, separator) {
  return Array.from(text)
    .filter((ch) => ch !== ' ')
    .join(separator);
}

function toAlternatingCase(text) {
  return Array.from(text)
    .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join('');
}

const MAPS = {
  boldSerif: buildMap(
    '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙',
    '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳',
    '𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗'
  ),
  italicSerif: buildMap(
    '𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍',
    '𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧'
  ),
  boldItalicSerif: buildMap(
    '𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁',
    '𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛'
  ),
  script: buildMap(
    '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵',
    '𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏'
  ),
  boldScript: buildMap(
    '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩',
    '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃'
  ),
  fraktur: buildMap(
    '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ',
    '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷'
  ),
  boldFraktur: buildMap(
    '𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅',
    '𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟'
  ),
  doubleStruck: buildMap(
    '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ',
    '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫',
    '𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'
  ),
  sansBold: buildMap(
    '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭',
    '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇',
    '𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'
  ),
  sansItalic: buildMap(
    '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡',
    '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻'
  ),
  sansBoldItalic: buildMap(
    '𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕',
    '𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝗺𝘯𝘰𝘱𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯'.replace('𝗺𝘯𝘰𝘱', '𝙢𝙣𝙤𝙥')
  ),
  monospace: buildMap(
    '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',
    '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣',
    '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'
  ),
  smallCaps: buildMap(
    'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ',
    'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ'
  ),
  superscript: buildMap(
    'ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ',
    'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ',
    '⁰¹²³⁴⁵⁶⁷⁸⁹'
  ),
  circled: buildMap(
    'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ',
    'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ',
    '⓪①②③④⑤⑥⑦⑧⑨'
  ),
  filledCircled: buildMap(
    '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩',
    '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩',
    '⓿❶❷❸❹❺❻❼❽❾'
  ),
  squared: buildMap(
    '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉',
    '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉'
  ),
  filledSquared: buildMap(
    '🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉',
    '🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉'
  ),
  parenthesized: buildMap(
    '🄐🄑🄒🄓🄔🄕🄖🄗🄘🄙🄚🄛🄜🄝🄞🄟🄠🄡🄢🄣🄤🄥🄦🄧🄨🄩',
    '⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵',
    '0⑴⑵⑶⑷⑸⑹⑺⑻⑼'
  ),
  fullwidth: buildMap(
    'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ',
    'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ',
    '０１２３４５６７８９'
  ),
  stylizedSharp: buildMap(
    'ΛB₵DΣFGΉIJKŁMПӨPQЯƧƬЦVЩXYZ',
    'αв¢∂єƒgнιנкℓмησρqяѕтυνωχуz'
  ),
  runicNordic: buildMap(
    'ȺɃȻĐɆFǤĦƗɈꝀŁM₦Ø₱QɌSŦɄVWXɎƵ',
    'ąɓƈđɇƒǥħɨʝƙłɱɲø₱qɍsŧʉvwxɏƶ'
  ),
  greekMix: buildMap(
    'ΑΒƇƊΕƑƓΗΙЈΚLΜΝΟРQЯЅΤUVWΧΥΖ',
    'αβcδεfghιjκlmnσpqrѕtυνωχyz'
  ),
  upsideDown: buildMap(
    '∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z',
    'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz',
    '0ƖᄅƐㄣϛ9ㄥ86'
  ),
  asianStroke: buildMap(
    '卂乃匚刀乇下呂卄工丿长乚爪几口尸Q尺丂丁凵リ山乂丫乙',
    '卂乃匚刀乇下呂卄工丿长乚爪几口尸Q尺丂丁凵リ山乂丫乙'
  )
};

// Fix sansBoldItalic exact codepoints cleanly
MAPS.sansBoldItalic = buildMap(
  '𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕',
  '𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯'
);

// 35 Distinct Base Font Transforms
export const BASE_FONTS = [
  { id: 'bold-sans', name: 'Bold Sans', category: 'bold', support: 'Universal Bio & Chat', fn: (t) => mapText(t, MAPS.sansBold) },
  { id: 'bold-serif', name: 'Bold Serif', category: 'bold', support: 'Universal Bio & Chat', fn: (t) => mapText(t, MAPS.boldSerif) },
  { id: 'bold-script', name: 'Royal Script', category: 'aesthetic', support: 'Instagram & Discord', fn: (t) => mapText(t, MAPS.boldScript) },
  { id: 'soft-script', name: 'Soft Script', category: 'aesthetic', support: 'Instagram & TikTok', fn: (t) => mapText(t, MAPS.script) },
  { id: 'small-caps', name: 'Small Caps', category: 'minimal', support: 'High Game Compatibility', fn: (t) => mapText(t, MAPS.smallCaps) },
  { id: 'bold-fraktur', name: 'Imperial Gothic', category: 'bold', support: 'Discord & Bio Headers', fn: (t) => mapText(t, MAPS.boldFraktur) },
  { id: 'fraktur', name: 'Medieval Fraktur', category: 'bold', support: 'Bio & Display Names', fn: (t) => mapText(t, MAPS.fraktur) },
  { id: 'double-struck', name: 'Double-Struck', category: 'minimal', support: 'Discord & Web Profiles', fn: (t) => mapText(t, MAPS.doubleStruck) },
  { id: 'monospace', name: 'Typewriter Mono', category: 'minimal', support: 'Universal Bio & Code', fn: (t) => mapText(t, MAPS.monospace) },
  { id: 'sans-bold-italic', name: 'Velocity Italic', category: 'gaming', support: 'Esports & Social Bios', fn: (t) => mapText(t, MAPS.sansBoldItalic) },
  { id: 'sans-italic', name: 'Sleek Sans Italic', category: 'minimal', support: 'Social Bios & Profiles', fn: (t) => mapText(t, MAPS.sansItalic) },
  { id: 'bold-italic-serif', name: 'Editorial Italic', category: 'aesthetic', support: 'Instagram & X Bio', fn: (t) => mapText(t, MAPS.boldItalicSerif) },
  { id: 'italic-serif', name: 'Classic Italic', category: 'aesthetic', support: 'Instagram & X Bio', fn: (t) => mapText(t, MAPS.italicSerif) },
  { id: 'fullwidth', name: 'Vaporwave Wide', category: 'aesthetic', support: 'High Game Compatibility', fn: (t) => mapText(t, MAPS.fullwidth) },
  { id: 'spaced-caps', name: 'Spaced Upper', category: 'minimal', support: 'All Games & Platforms', fn: (t) => Array.from(t.toUpperCase()).join(' ') },
  { id: 'spaced-small-caps', name: 'Airy Small Caps', category: 'minimal', support: 'High Game Compatibility', fn: (t) => Array.from(mapText(t, MAPS.smallCaps)).join(' ') },
  { id: 'tiny-superscript', name: 'Superscript', category: 'minimal', support: 'Free Fire, BGMI & Bio', fn: (t) => mapText(t, MAPS.superscript) },
  { id: 'circled', name: 'Circled Monogram', category: 'decorated', support: 'Universal Unicode', fn: (t) => mapText(t, MAPS.circled) },
  { id: 'filled-circled', name: 'Obsidian Bubbles', category: 'bold', support: 'Social & Chat Apps', fn: (t) => mapText(t, MAPS.filledCircled) },
  { id: 'squared', name: 'Tile Blocks', category: 'decorated', support: 'Social & Chat Apps', fn: (t) => mapText(t, MAPS.squared) },
  { id: 'filled-squared', name: 'Solid Keycaps', category: 'bold', support: 'Discord & Instagram', fn: (t) => mapText(t, MAPS.filledSquared) },
  { id: 'parenthesized', name: 'Parenthesized', category: 'decorated', support: 'Social & Chat Apps', fn: (t) => mapText(t, MAPS.parenthesized) },
  { id: 'stylized-sharp', name: 'Cyber Sharp', category: 'gaming', support: 'High Game Compatibility', fn: (t) => mapText(t, MAPS.stylizedSharp) },
  { id: 'runic-nordic', name: 'Nordic Slash', category: 'gaming', support: 'High Game Compatibility', fn: (t) => mapText(t, MAPS.runicNordic) },
  { id: 'greek-mix', name: 'Hellenic Hybrid', category: 'aesthetic', support: 'High Game Compatibility', fn: (t) => mapText(t, MAPS.greekMix) },
  { id: 'asian-stroke', name: 'Brush Stroke', category: 'gaming', support: 'Gaming & Clan Tags', fn: (t) => mapText(t, MAPS.asianStroke) },
  { id: 'upside-down', name: 'Inverted Mirror', category: 'decorated', support: 'Chat & Bio Accent', fn: (t) => Array.from(mapText(t, MAPS.upsideDown)).reverse().join('') },
  { id: 'strikethrough', name: 'Crossed Out', category: 'decorated', support: 'Universal Combining', fn: (t) => combineText(t, '\u0336') },
  { id: 'double-underline', name: 'Double Underline', category: 'decorated', support: 'Universal Combining', fn: (t) => combineText(t, '\u0333') },
  { id: 'slash-through', name: 'Diagonal Slash', category: 'decorated', support: 'Universal Combining', fn: (t) => combineText(t, '\u0338') },
  { id: 'dot-above', name: 'Staccato Dot', category: 'decorated', support: 'Universal Combining', fn: (t) => combineText(t, '\u0307') },
  { id: 'tilde-overlay', name: 'Wave Tilde', category: 'decorated', support: 'Universal Combining', fn: (t) => combineText(t, '\u0334') },
  { id: 'alternating-case', name: 'Alternating Case', category: 'gaming', support: 'Universal ASCII', fn: (t) => toAlternatingCase(t) },
  { id: 'dot-joined', name: 'Dot Spaced', category: 'minimal', support: 'Universal Unicode', fn: (t) => joinChars(t, '·') },
  { id: 'star-joined', name: 'Star Spaced', category: 'aesthetic', support: 'Universal Unicode', fn: (t) => joinChars(t, '⋆') }
];

// 30 Distinct Frame & Decoration Templates (35 x 30 = 1,050 unique styles)
export const DECORATION_TEMPLATES = [
  { id: 'clean', label: 'Pure Font', category: null, left: '', right: '' },
  { id: 'royal-wings', label: 'Royal Wings', category: 'gaming', left: '꧁༺ ', right: ' ༻꧂' },
  { id: 'pro-brackets', label: 'Pro Brackets', category: 'gaming', left: '『', right: '』' },
  { id: 'katana-cross', label: 'Katana Cross', category: 'gaming', left: '×͜× ', right: ' ×͜×' },
  { id: 'esports-me', label: 'Esports Me', category: 'gaming', left: 'メ', right: 'メ' },
  { id: 'clan-mo', label: 'Clan Crest', category: 'gaming', left: '么 ', right: ' 么' },
  { id: 'sniper-sui', label: 'Sniper Tag', category: 'gaming', left: '亗 ', right: ' 亗' },
  { id: 'heavy-brackets', label: 'Heavy Block', category: 'gaming', left: '【', right: '】' },
  { id: 'blade-wings', label: 'Blade Arrows', category: 'gaming', left: '◥ ', right: ' ◤' },
  { id: 'lightning', label: 'Volt Strike', category: 'gaming', left: '⚡ ', right: ' ⚡' },
  { id: 'skull-squad', label: 'Reaper Guard', category: 'gaming', left: '☠ ', right: ' ☠' },
  { id: 'celestial', label: 'Celestial Ribbon', category: 'aesthetic', left: '✧･ﾟ: ', right: ' :･ﾟ✧' },
  { id: 'botanical', label: 'Botanical Bloom', category: 'aesthetic', left: '✿ ', right: ' ✿' },
  { id: 'crescent', label: 'Crescent Moon', category: 'aesthetic', left: '☾ ', right: ' ☽' },
  { id: 'heart-frame', label: 'Heart Line', category: 'aesthetic', left: '♡ ', right: ' ♡' },
  { id: 'sparkle-duo', label: 'Sparkle Duo', category: 'aesthetic', left: '✦ ', right: ' ✦' },
  { id: 'corner-frame', label: 'Editorial Corner', category: 'aesthetic', left: '「 ', right: ' 」' },
  { id: 'cloud-wave', label: 'Tilde Drift', category: 'aesthetic', left: '〜 ', right: ' 〜' },
  { id: 'sovereign-crown', label: 'Sovereign Crown', category: 'bold', left: '♛ ', right: ' ♛' },
  { id: 'emperor-crown', label: 'Emperor Mark', category: 'bold', left: '♚ ', right: ' ♚' },
  { id: 'diamond-crest', label: 'Diamond Crest', category: 'bold', left: '❖ ', right: ' ❖' },
  { id: 'double-chevron', label: 'Guillemet Frame', category: 'bold', left: '« ', right: ' »' },
  { id: 'star-monarch', label: 'Star Monarch', category: 'bold', left: '★ ', right: ' ★' },
  { id: 'shield-diamond', label: 'Shielded Sigil', category: 'bold', left: '◈ ', right: ' ◈' },
  { id: 'editorial-pipe', label: 'Vertical Bar', category: 'minimal', left: '│ ', right: ' │' },
  { id: 'angle-quotes', label: 'Minimal Angle', category: 'minimal', left: '‹ ', right: ' ›' },
  { id: 'orbit-ring', label: 'Orbit Dot', category: 'minimal', left: '∘ ', right: ' ∘' },
  { id: 'smiley-tsu', label: 'Tsu Accent', category: 'decorated', left: 'ツ ', right: ' ツ' },
  { id: 'starlight-orbit', label: 'Orbit Cross', category: 'decorated', left: '⊹ ', right: ' ⊹' },
  { id: 'floral-rosette', label: 'Rosette Seal', category: 'decorated', left: '❀ ', right: ' ❀' }
];

/**
 * Build the complete catalog of 1,050 unique nickname styles.
 */
export const NICKNAME_STYLES = (() => {
  const catalog = [];
  for (const template of DECORATION_TEMPLATES) {
    for (const font of BASE_FONTS) {
      const category = template.category || font.category;
      const isClean = template.id === 'clean';
      catalog.push({
        id: `${font.id}__${template.id}`,
        name: isClean ? font.name : `${font.name} · ${template.label}`,
        fontName: font.name,
        frameName: template.label,
        category,
        support: font.support,
        transform: (rawText) => {
          const styled = font.fn(rawText);
          return isClean ? styled : `${template.left}${styled}${template.right}`;
        },
        transformBaseOnly: (rawText) => font.fn(rawText)
      });
    }
  }
  return catalog;
})();

// Quick Frame Override Presets for the Toolbar
export const FRAME_PRESETS = [
  { id: 'auto', label: 'Built-In Frames (1,050)', left: '', right: '' },
  { id: 'none', label: 'Strip Frames', left: '', right: '' },
  { id: 'royal-wings', label: '꧁༺ ༻꧂', left: '꧁༺ ', right: ' ༻꧂' },
  { id: 'jp-brackets', label: '『 』', left: '『', right: '』' },
  { id: 'heavy-brackets', label: '【 】', left: '【', right: '】' },
  { id: 'esports-x', label: '×͜× ×͜×', left: '×͜× ', right: ' ×͜×' },
  { id: 'katana-me', label: 'メ メ', left: 'メ', right: 'メ' },
  { id: 'diamond', label: '❖ ❖', left: '❖ ', right: ' ❖' },
  { id: 'stars', label: '★ ★', left: '★ ', right: ' ★' },
  { id: 'crown', label: '♛ ♛', left: '♛ ', right: ' ♛' }
];

export const SYMBOL_GROUPS = [
  {
    title: 'Esports & Clan Marks',
    symbols: ['メ', '么', '×͜×', '亗', 'ツ', '父', '々', '◥', '◤', '⚡', '⚔', '☠']
  },
  {
    title: 'Royal & Brackets',
    symbols: ['꧁', '꧂', '༺', '༻', '『', '』', '【', '】', '「', '」', '♛', '♚']
  },
  {
    title: 'Celestial & Aesthetic',
    symbols: ['✧', '✦', '★', '☆', '✿', '❀', '☾', '☽', '❖', '◈', '♡', '❥']
  },
  {
    title: 'Separators & Minimal',
    symbols: ['·', '•', '│', '┃', '—', '⋆', '⊹', '∘', '›', '‹', '»', '«']
  }
];

const IDEA_POOLS = {
  gaming: {
    prefixes: ['Shadow', 'Apex', 'Vortex', 'Phantom', 'Titan', 'Kairo', 'Rogue', 'Viper', 'Obsidian', 'Draco'],
    roots: ['Striker', 'Sniper', 'Blade', 'Reaper', 'Pulse', 'Frost', 'Knight', 'Wolf', 'Hunter', 'Zero']
  },
  aesthetic: {
    prefixes: ['Velvet', 'Lunar', 'Solstice', 'Misty', 'Clover', 'Iris', 'Serein', 'Meadow', 'Aurelia', 'Cloud'],
    roots: ['Whisper', 'Bloom', 'Muse', 'Dusk', 'Echo', 'Petal', 'Loom', 'Haven', 'Aura', 'Drift']
  },
  minimal: {
    prefixes: ['Nox', 'Kael', 'Vex', 'Sora', 'Ryn', 'Zane', 'Lyra', 'Taro', 'Milo', 'Onyx'],
    roots: ['One', 'Arc', 'Lux', 'Core', 'Ray', 'Zen', 'Verge', 'Haze', 'Sol', 'Vibe']
  },
  royal: {
    prefixes: ['Monarch', 'Sovereign', 'Imperium', 'Noble', 'Baron', 'Duke', 'Empress', 'Regal', 'Crown', 'Aegis'],
    roots: ['Valour', 'Crest', 'Reign', 'Throne', 'Sigil', 'Warden', 'Vanguard', 'Atlas', 'Valkyrie', 'Legacy']
  }
};

export function generateRandomIdea(vibe = 'gaming') {
  const pool = IDEA_POOLS[vibe] || IDEA_POOLS.gaming;
  const p = pool.prefixes[Math.floor(Math.random() * pool.prefixes.length)];
  const r = pool.roots[Math.floor(Math.random() * pool.roots.length)];
  return Math.random() > 0.35 ? `${p} ${r}` : p;
}

export function analyzeCompatibility(text) {
  const chars = Array.from(text || '');
  let asciiCount = 0;
  let combiningCount = 0;
  let mathSymbolCount = 0;
  let specialSymbolCount = 0;

  for (const ch of chars) {
    const code = ch.codePointAt(0) || 0;
    if (code >= 0x20 && code <= 0x7e) {
      asciiCount++;
    } else if (code >= 0x0300 && code <= 0x036f) {
      combiningCount++;
    } else if (code >= 0x1d400 && code <= 0x1d7ff) {
      mathSymbolCount++;
    } else {
      specialSymbolCount++;
    }
  }

  const total = chars.length;
  const isAllAscii = asciiCount === total;
  const hasMath = mathSymbolCount > 0;
  const hasCombining = combiningCount > 0;

  let socialStatus = 'Supported';
  let gameStatus = 'Supported';
  let screenReaderNote = 'Reads normally on screen readers.';

  if (hasMath) {
    socialStatus = 'Full Support (Bios & Display)';
    gameStatus = 'Moderate (Some games restrict math blocks)';
    screenReaderNote = 'Mathematical Unicode blocks may be skipped by screen readers; keep a readable handle alongside.';
  } else if (hasCombining) {
    socialStatus = 'Supported (Display Only)';
    gameStatus = 'Limited (Combining marks often stripped in games)';
    screenReaderNote = 'Combining diacritics stack visually; best reserved for short display tags.';
  } else if (specialSymbolCount > 0) {
    socialStatus = 'Full Support';
    gameStatus = 'High Support (Free Fire, BGMI, Discord)';
    screenReaderNote = 'Standard Unicode symbols render cleanly across modern mobile and desktop OS fonts.';
  } else if (isAllAscii) {
    socialStatus = 'Universal Support';
    gameStatus = 'Universal Support';
  }

  return {
    length: total,
    socialStatus,
    gameStatus,
    screenReaderNote
  };
}
