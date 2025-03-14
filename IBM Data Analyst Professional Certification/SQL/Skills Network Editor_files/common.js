const startAppRegex = /::startApplication(\ )?{([^{}]*)}/
const openFileRegex = /::openFile(\ )?{([^{}]*)}/
const openRewardRegex = /::openReward()/
const openDatabaseRegex = /::openDatabase(\ )?{([^{}]*)}/
const openBigDataRegex = /::openBigDataTool(\ )?{([^{}]*)}/
const openCloudRegex = /::openCloudTool(\ )?{([^{}]*)}/
const openEmbeddableAIRegex = /::openEmbeddableAITool(\ )?{([^{}]*)}/
const pageRegex = /^::page(\ )?{([^{}]*)}$/

const LANGUAGES = new Map([
    ["AB", { native: "Аҧсуа", english: "Abkhaz", rtl: false }],
    ["AA", { native: "Afar", english: "Afar", rtl: false }],
    ["AF", { native: "Afrikaans", english: "Afrikaans", rtl: false }],
    ["AK", { native: "Akan", english: "Akan", rtl: false }],
    ["SQ", { native: "Shqip", english: "Albanian", rtl: false }],
    ["AM", { native: "አማርኛ", english: "Amharic", rtl: false }],
    ["AR", { native: "العربية", english: "Arabic", rtl: true }],
    ["AN", { native: "Aragonés", english: "Aragonese", rtl: false }],
    ["HY", { native: "Հայերեն", english: "Armenian", rtl: false }],
    ["AS", { native: "অসমীয়া", english: "Assamese", rtl: false }],
    ["AV", { native: "Авар мацӀ", english: "Avaric", rtl: false }],
    ["AE", { native: "avesta", english: "Avestan", rtl: false }],
    ["AY", { native: "Aymar aru", english: "Aymara", rtl: false }],
    ["AZ", { native: "Azərbaycan", english: "Azerbaijani", rtl: false }],
    ["BM", { native: "Bamanankan", english: "Bambara", rtl: false }],
    ["BA", { native: "Башҡорт теле", english: "Bashkir", rtl: false }],
    ["EU", { native: "Euskara", english: "Basque", rtl: false }],
    ["BE", { native: "Беларуская", english: "Belarusian", rtl: false }],
    ["BN", { native: "বাংলা", english: "Bengali", rtl: false }],
    ["BH", { native: "भोजपुरी", english: "Bhojpuri", rtl: false }],
    ["BI", { native: "Bislama", english: "Bislama", rtl: false }],
    ["BS", { native: "Bosanski", english: "Bosnian", rtl: false }],
    ["BR", { native: "Brezhoneg", english: "Breton", rtl: false }],
    ["BG", { native: "Български", english: "Bulgarian", rtl: false }],
    ["MY", { native: "မြန်မာစာ", english: "Burmese", rtl: false }],
    ["CA", { native: "Català", english: "Catalan", rtl: false }],
    ["KM", { native: "ភាសាខ្មែរ", english: "Khmer", rtl: false }],
    ["CH", { native: "Chamoru", english: "Chamorro", rtl: false }],
    ["CE", { native: "Нохчийн мотт", english: "Chechen", rtl: false }],
    ["NY", { native: "Chichewa", english: "Chichewa", rtl: false }],
    ["ZH", { native: "中文", english: "Chinese", rtl: false }],
    ["CU", { native: "Словѣньскъ", english: "Church Slavic", rtl: false }],
    ["CV", { native: "Чӑвашла", english: "Chuvash", rtl: false }],
    ["KW", { native: "Kernewek", english: "Cornish", rtl: false }],
    ["CO", { native: "Corsu", english: "Corsican", rtl: false }],
    ["CR", { native: "Nēhiyawēwin", english: "Cree", rtl: false }],
    ["HR", { native: "Hrvatski", english: "Croatian", rtl: false }],
    ["CS", { native: "Čeština", english: "Czech", rtl: false }],
    ["DA", { native: "Dansk", english: "Danish", rtl: false }],
    ["DV", { native: "ދިވެހި", english: "Divehi", rtl: true }],
    ["NL", { native: "Nederlands", english: "Dutch", rtl: false }],
    ["DZ", { native: "རྫོང་ཁ", english: "Dzongkha", rtl: false }],
    ["EN", { native: "English", english: "English", rtl: false }],
    ["EO", { native: "Esperanto", english: "Esperanto", rtl: false }],
    ["ET", { native: "Eesti", english: "Estonian", rtl: false }],
    ["EE", { native: "Eʋegbe", english: "Ewe", rtl: false }],
    ["FO", { native: "Føroyskt", english: "Faroese", rtl: false }],
    ["FJ", { native: "Vosa Vakaviti", english: "Fijian", rtl: false }],
    ["FI", { native: "Suomi", english: "Finnish", rtl: false }],
    ["FR", { native: "Français", english: "French", rtl: false }],
    ["FF", { native: "Pulaar", english: "Fulah", rtl: false }],
    ["GD", { native: "Gàidhlig", english: "Scottish Gaelic", rtl: false }],
    ["GL", { native: "Galego", english: "Galician", rtl: false }],
    ["LG", { native: "Luganda", english: "Ganda", rtl: false }],
    ["KA", { native: "ქართული", english: "Georgian", rtl: false }],
    ["DE", { native: "Deutsch", english: "German", rtl: false }],
    ["KI", { native: "Gikuyu", english: "Kikuyu", rtl: false }],
    ["EL", { native: "Ελληνικά", english: "Greek", rtl: false }],
    ["KL", { native: "Kalaallisut", english: "Greenlandic", rtl: false }],
    ["GN", { native: "Avañe'ẽ", english: "Guarani", rtl: false }],
    ["GU", { native: "ગુજરાતી", english: "Gujarati", rtl: false }],
    ["HT", { native: "Kreyòl ayisyen", english: "Haitian Creole", rtl: false }],
    ["HA", { native: "Hausa", english: "Hausa", rtl: false }],
    ["HE", { native: "עברית", english: "Hebrew", rtl: true }],
    ["HZ", { native: "Otjiherero", english: "Herero", rtl: false }],
    ["HI", { native: "हिन्दी", english: "Hindi", rtl: false }],
    ["HO", { native: "Hiri Motu", english: "Hiri Motu", rtl: false }],
    ["HU", { native: "Magyar", english: "Hungarian", rtl: false }],
    ["IS", { native: "Íslenska", english: "Icelandic", rtl: false }],
    ["IO", { native: "Ido", english: "Ido", rtl: false }],
    ["IG", { native: "Igbo", english: "Igbo", rtl: false }],
    ["ID", { native: "Bahasa Indonesia", english: "Indonesian", rtl: false }],
    ["IA", { native: "Interlingua", english: "Interlingua", rtl: false }],
    ["IE", { native: "Interlingue", english: "Interlingue", rtl: false }],
    ["IU", { native: "ᐃᓄᒃᑎᑐᑦ", english: "Inuktitut", rtl: false }],
    ["IK", { native: "Iñupiaq", english: "Inupiaq", rtl: false }],
    ["GA", { native: "Gaeilge", english: "Irish", rtl: false }],
    ["IT", { native: "Italiano", english: "Italian", rtl: false }],
    ["JA", { native: "日本語", english: "Japanese", rtl: false }],
    ["JV", { native: "ꦧꦱꦗꦮ", english: "Javanese", rtl: false }],
    ["KN", { native: "ಕನ್ನಡ", english: "Kannada", rtl: false }],
    ["KR", { native: "Kanuri", english: "Kanuri", rtl: false }],
    ["KS", { native: "कश्मीरी", english: "Kashmiri", rtl: false }],
    ["KK", { native: "Қазақ тілі", english: "Kazakh", rtl: false }],
    ["RW", { native: "Ikinyarwanda", english: "Kinyarwanda", rtl: false }],
    ["KV", { native: "Коми кыв", english: "Komi", rtl: false }],
    ["KG", { native: "Kikongo", english: "Kongo", rtl: false }],
    ["KO", { native: "한국어", english: "Korean", rtl: false }],
    ["KJ", { native: "Kuanyama", english: "Kwanyama", rtl: false }],
    ["KU", { native: "Kurdî", english: "Kurdish", rtl: false }],
    ["KY", { native: "Кыргызча", english: "Kyrgyz", rtl: false }],
    ["LO", { native: "ພາສາລາວ", english: "Lao", rtl: false }],
    ["LA", { native: "Latina", english: "Latin", rtl: false }],
    ["LV", { native: "Latviešu", english: "Latvian", rtl: false }],
    ["LB", { native: "Lëtzebuergesch", english: "Luxembourgish", rtl: false }],
    ["LI", { native: "Limburgs", english: "Limburgish", rtl: false }],
    ["LN", { native: "Lingála", english: "Lingala", rtl: false }],
    ["LT", { native: "Lietuvių", english: "Lithuanian", rtl: false }],
    ["LU", { native: "Kiluba", english: "Luba-Katanga", rtl: false }],
    ["MK", { native: "Македонски", english: "Macedonian", rtl: false }],
    ["MG", { native: "Malagasy", english: "Malagasy", rtl: false }],
    ["MS", { native: "Bahasa Melayu", english: "Malay", rtl: false }],
    ["ML", { native: "മലയാളം", english: "Malayalam", rtl: false }],
    ["MT", { native: "Malti", english: "Maltese", rtl: false }],
    ["GV", { native: "Gaelg", english: "Manx", rtl: false }],
    ["MI", { native: "Māori", english: "Māori", rtl: false }],
    ["MR", { native: "मराठी", english: "Marathi", rtl: false }],
    ["MH", { native: "Kajin M̧ajeļ", english: "Marshallese", rtl: false }],
    ["RO", { native: "Română", english: "Romanian", rtl: false }],
    ["MN", { native: "Монгол", english: "Mongolian", rtl: false }],
    ["NA", { native: "Ekakairũ Naoero", english: "Nauru", rtl: false }],
    ["NV", { native: "Diné bizaad", english: "Navajo", rtl: false }],
    ["ND", { native: "isiNdebele", english: "Northern Ndebele", rtl: false }],
    ["NG", { native: "Ndonga", english: "Ndonga", rtl: false }],
    ["NE", { native: "नेपाली", english: "Nepali", rtl: false }],
    ["SE", { native: "Sámegiella", english: "Northern Sami", rtl: false }],
    ["NO", { native: "Norsk", english: "Norwegian", rtl: false }],
    ["NB", { native: "Bokmål", english: "Norwegian Bokmål", rtl: false }],
    ["NN", { native: "Nynorsk", english: "Norwegian Nynorsk", rtl: false }],
    ["II", { native: "ꆇꉙ", english: "Nuosu", rtl: false }],
    ["OC", { native: "Occitan", english: "Occitan", rtl: false }],
    ["OJ", { native: "ᐊᓂᔑᓈᐯᒧᐎᓐ", english: "Ojibwa", rtl: false }],
    ["OR", { native: "ଓଡ଼ିଆ", english: "Odia", rtl: false }],
    ["OM", { native: "Afaan Oromoo", english: "Oromo", rtl: false }],
    ["OS", { native: "Ирон æвзаг", english: "Ossetian", rtl: false }],
    ["PI", { native: "पाऴि", english: "Pali", rtl: false }],
    ["PA", { native: "ਪੰਜਾਬੀ", english: "Punjabi", rtl: false }],
    ["PS", { native: "پښتو", english: "Pashto", rtl: true }],
    ["FA", { native: "فارسی", english: "Persian", rtl: true }],
    ["PL", { native: "Polski", english: "Polish", rtl: false }],
    ["PT", { native: "Português", english: "Portuguese", rtl: false }],
    ["QU", { native: "Runa Simi", english: "Quechua", rtl: false }],
    ["RM", { native: "Rumantsch", english: "Romansh", rtl: false }],
    ["RN", { native: "Ikirundi", english: "Rundi", rtl: false }],
    ["RU", { native: "Русский", english: "Russian", rtl: false }],
    ["SM", { native: "Gagana Samoa", english: "Samoan", rtl: false }],
    ["SG", { native: "Sängö", english: "Sango", rtl: false }],
    ["SA", { native: "संस्कृतम्", english: "Sanskrit", rtl: false }],
    ["SC", { native: "Sardu", english: "Sardinian", rtl: false }],
    ["SR", { native: "Српски", english: "Serbian", rtl: false }],
    ["SN", { native: "Shona", english: "Shona", rtl: false }],
    ["SD", { native: "سنڌي", english: "Sindhi", rtl: true }],
    ["SI", { native: "සිංහල", english: "Sinhala", rtl: false }],
    ["SK", { native: "Slovenčina", english: "Slovak", rtl: false }],
    ["SL", { native: "Slovenščina", english: "Slovenian", rtl: false }],
    ["SO", { native: "Soomaali", english: "Somali", rtl: false }],
    ["ST", { native: "Sesotho", english: "Sotho", rtl: false }],
    ["NR", { native: "isiNdebele", english: "Southern Ndebele", rtl: false }],
    ["ES", { native: "Español", english: "Spanish", rtl: false }],
    ["SU", { native: "Basa Sunda", english: "Sundanese", rtl: false }],
    ["SW", { native: "Kiswahili", english: "Swahili", rtl: false }],
    ["SS", { native: "SiSwati", english: "Swati", rtl: false }],
    ["SV", { native: "Svenska", english: "Swedish", rtl: false }],
    ["TL", { native: "Tagalog", english: "Tagalog", rtl: false }],
    ["TY", { native: "Reo Tahiti", english: "Tahitian", rtl: false }],
    ["TG", { native: "Тоҷикӣ", english: "Tajik", rtl: false }],
    ["TA", { native: "தமிழ்", english: "Tamil", rtl: false }],
    ["TT", { native: "Татарча", english: "Tatar", rtl: false }],
    ["TE", { native: "తెలుగు", english: "Telugu", rtl: false }],
    ["TH", { native: "ไทย", english: "Thai", rtl: false }],
    ["BO", { native: "བོད་ཡིག", english: "Tibetan", rtl: false }],
    ["TI", { native: "ትግርኛ", english: "Tigrinya", rtl: false }],
    ["TO", { native: "Lea faka-Tonga", english: "Tongan", rtl: false }],
    ["TS", { native: "Xitsonga", english: "Tsonga", rtl: false }],
    ["TN", { native: "Setswana", english: "Tswana", rtl: false }],
    ["TR", { native: "Türkçe", english: "Turkish", rtl: false }],
    ["TK", { native: "Türkmen", english: "Turkmen", rtl: false }],
    ["TW", { native: "Twi", english: "Twi", rtl: false }],
    ["UG", { native: "ئۇيغۇرچە", english: "Uyghur", rtl: true }],
    ["UK", { native: "Українська", english: "Ukrainian", rtl: false }],
    ["UR", { native: "اردو", english: "Urdu", rtl: true }],
    ["UZ", { native: "Oʻzbek", english: "Uzbek", rtl: false }],
    ["VE", { native: "Tshivenda", english: "Venda", rtl: false }],
    ["VI", { native: "Tiếng Việt", english: "Vietnamese", rtl: false }],
    ["VO", { native: "Volapük", english: "Volapük", rtl: false }],
    ["WA", { native: "Walon", english: "Walloon", rtl: false }],
    ["CY", { native: "Cymraeg", english: "Welsh", rtl: false }],
    ["FY", { native: "Frysk", english: "Western Frisian", rtl: false }],
    ["WO", { native: "Wolof", english: "Wolof", rtl: false }],
    ["XH", { native: "isiXhosa", english: "Xhosa", rtl: false }],
    ["YI", { native: "ייִדיש", english: "Yiddish", rtl: true }],
    ["YO", { native: "Yorùbá", english: "Yoruba", rtl: false }],
    ["ZA", { native: "Saɯ cueŋƅ", english: "Zhuang", rtl: false }],
    ["ZU", { native: "isiZulu", english: "Zulu", rtl: false }]
  ]);

  function bcp47ToISO6391(tag) {
    try {
      const locale = new Intl.Locale(tag);
      return locale.language.toUpperCase();
    } catch (e) {
      console.error("Invalid BCP 47 tag:", tag);
      return null;
    }
  }

// Icons
const printerIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6" width=24>
    <path fill-rule="evenodd" d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 0 0 3 3h.27l-.155 1.705A1.875 1.875 0 0 0 7.232 22.5h9.536a1.875 1.875 0 0 0 1.867-2.045l-.155-1.705h.27a3 3 0 0 0 3-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0 0 18 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM16.5 6.205v-2.83A.375.375 0 0 0 16.125 3h-8.25a.375.375 0 0 0-.375.375v2.83a49.353 49.353 0 0 1 9 0Zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 0 1-.374.409H7.232a.375.375 0 0 1-.374-.409l.526-5.784a.373.373 0 0 1 .333-.337 41.741 41.741 0 0 1 8.566 0Zm.967-3.97a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H18a.75.75 0 0 1-.75-.75V10.5ZM15 9.75a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 0-.75-.75H15Z" clip-rule="evenodd" />
</svg>`;

const documentPlusIcon =`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6" width=24>
    <path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM12.75 12a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V18a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V12Z" clip-rule="evenodd" />
    <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
</svg>`;

const documentMinusIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6" width=24>
    <path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM9.75 14.25a.75.75 0 0 0 0 1.5H15a.75.75 0 0 0 0-1.5H9.75Z" clip-rule="evenodd" />
    <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
</svg>`;

const translationIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6" width=24>
    <path fill-rule="evenodd" d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 1 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z" clip-rule="evenodd" />
</svg>`

const tableOfContentsIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6" width=24>
    <path d="M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z" />
</svg>`

const sunIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width=24>
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
</svg>`

const moonIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width=24>
    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
</svg>`

const arrowLeft = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>`;

const arrowRight = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 19.5 21 12m0 0-7.5-7.5M21 12H3" />
</svg>`;

var currentPage;
let asset_library_prefix_url = "";

$.fn.nextUntilWithTextNodes = function (until) {
    var matched = $.map(this, function (elem, i, until) {
        var matched = [];
        while ((elem = elem.nextSibling) && elem.nodeType !== 9) {
            if (elem.nodeType === 1 || elem.nodeType === 3) {
                if (until && jQuery(elem).is(until)) {
                    break;
                }
                matched.push(elem);
            }
        }
        return matched;
    }, until);

    return this.pushStack(matched);
};

function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
}

function setAssetLibraryPrefixUrl(url) {
    asset_library_prefix_url = url;
}

function getStructuredData(metadata) {
    let authors = metadata["author"]
    authors?.forEach(author => {
        // Default to Person if no type is specified
        author["@type"] = "Person" || author["@type"];
    });

    let structuredData = {
        "@context": "http://schema.org/",
        "@type": "Article"
    }

    metadata["headline"] && (structuredData["headline"] = metadata["headline"]);
    metadata["image"] && (structuredData["image"] = metadata["image"]);
    authors && (structuredData["author"] = authors);
    metadata["datePublished"] && (structuredData["datePublished"] = metadata["datePublished"]);

    return structuredData
}

function injectMetadata(metadata) {
    metadata = JSON.parse(metadata);
    let structuredData = getStructuredData(metadata);
    let head = $('head');
    let script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    head.append(script);
}

function adjustCodeBlocks(doc) {
    doc.previewContainer.find("pre").each(function (i) {
        let pre = $(this);

        if (pre.context.nextSibling === null || pre.context.nextSibling.tagName !== 'BUTTON') {
            let lines = pre.find('ol.linenums');

            let content = '';
            let $lineNumbers = $("<ol class='formatted-line-numbers'></ol>");

            let lineIndex = 1
            lines.children('li').each(function (i) {
                // store code block content in a string
                content += (content === '') ? this.textContent : '\n' + this.textContent;

                // create a line number for each line of code
                $lineNumbers.append(`<li>${lineIndex}</li>`);
                lineIndex += 1
            });
            pre.prepend($lineNumbers);

            // if only one-line of code, add inline copy and execute buttons
            if (lines.children().length === 1) {
                pre.context.innerHTML += '<button title="Copy" class="action-code-block copy-code-block one-line"><i class="fa fa-copy" aria-hidden="true"></i><span class="popuptext" id=\"md-code-block-copy-' + i + '\">Copied!</span></button>';
                if (doc.settings.tool_type != "instructional-lab" && pre.find('code.language-bash, code.language-shell').length) pre.context.innerHTML += '<button title="Execute" class="action-code-block execute-code-block one-line"><i class="fa fa-terminal" aria-hidden="true"></i><span class="popuptext" id=\"md-code-block-execute-' + i + '\">Executed!</span></button>';
                pre.css("padding-right", "42px");
            } else {
                pre.context.innerHTML += '<button title="Copy" class="action-code-block copy-code-block multiple-lines"><i class="fa fa-copy" aria-hidden="true"></i><span class="popuptext" id=\"md-code-block-copy-' + i + '\">Copied!</span></button>';
                if (doc.settings.tool_type != "instructional-lab" && pre.find('code.language-bash, code.language-shell').length) pre.context.innerHTML += '<button title="Execute" class="action-code-block execute-code-block multiple-lines"><i class="fa fa-terminal" aria-hidden="true"></i><span class="popuptext" id=\"md-code-block-execute-' + i + '\">Executed!</span></button>';
            };

            // create and bind copy code button
            let copyButton = pre.find('button.action-code-block.copy-code-block');
            copyButton.bind(editormd.mouseOrTouch("click", "touchend"), function () {
                try {
                    navigator.clipboard.writeText(content);
                    let popup = $(`span.popuptext#md-code-block-copy-${i}`);
                    popup.toggleClass("show");
                    setTimeout(function () {
                        popup.toggleClass("show");
                    }, 1500);
                } catch (e) {
                    console.log(e);
                }
            });

            // create and bind execute code button
            let executeButton = pre.find('button.action-code-block.execute-code-block');
            executeButton.bind(editormd.mouseOrTouch("click", "touchend"), function () {
                try {
                    //sending request to the UI with type 'execute_code'
                    requestToUI({ type: "execute_code", command: content })
                    navigator.clipboard.writeText(content);
                    let popup = $(`span.popuptext#md-code-block-execute-${i}`);
                    popup.toggleClass("show");
                    setTimeout(function () {
                        popup.toggleClass("show");
                    }, 1500);
                } catch (e) {
                    console.log(e);
                }
            });
        }
    })
}

function findGetParameter(parameterName) {
    let result = null,
        tmp = [];
    let items = window.location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

function parseDirective(context, required = []) {
    context = context.replace(/[\u2018-\u201B\u275B-\u275C]/g, "'")
    context = context.replace(/[\u201C-\u201F\u275D-\u275E]/g, '"')

    const regexFullMatch = /::\w+(\ )?{([^{}]*)}/;
    const regexKeyValue = /(\w+)="([^"]*)"/g;
    const m = context.match(regexFullMatch);

    if (m) {
        dic = Object.fromEntries(
            Array.from(m[2].matchAll(regexKeyValue), v => [v[1], v[2]])
        );
        const valid = required.every(val => Object.keys(dic).includes(val) && dic[val] != "")
        dic["valid"] = valid
        return dic
    } else {
        return { "valid": false }
    }
}

function isValidPageDirective(context) {
    if (pageRegex.test(context)) {
        const { valid } = parseDirective(context);
        return valid
    }
    return false
}

function removeFrontmatter(markdown) {
    // Use a regular expression to match the front matter
    const frontmatterRegex = /^---[\s\S]*?---\n/;
    return markdown.replace(frontmatterRegex, '').trim();
}

async function setTranslationContent(language) {
    try {
        const jwt = parseJwt(findGetParameter("token"));
        const localesUrl = jwt.locales_url || authorEditor.settings.localesUrl;

        if (!localesUrl) {
            return;
        }

        console.log(`Attempting to set language: ${language}`);
        localStorage.setItem("preferredLanguage", language);

        showLoadingIcon();
        toggleAudioWidget(language);

        const isRtl = LANGUAGES.get(language).rtl;

        const localesData = await fetchJson(localesUrl, "Failed to fetch locales JSON");
        const languageData = localesData.locales[language];
        if (!languageData) throw new Error(`No data found for language: ${language}`);

        const translationData = await fetchMarkdown(languageData.url);
        const markdownContent = removeFrontmatter(translationData);

        authorEditor.cm.setValue(markdownContent)

        updateLanguageSelection(language);
        toggleRtlStyles(isRtl);
        
    } catch (error) {
        console.error("Error:", error);
    }
}

function showLoadingIcon() {
    $('.markdown-body').empty();
    $('.markdown-body').append(`  
<div class="spinner-container">
     <div class="loader"></div> 
</div>`);
}

function toggleAudioWidget(language) {
    if (language !== "EN") {
        $('#audio-widget, #audioToggleButton').addClass('hidden');
    } else {
        $('#audio-widget, #audioToggleButton').removeClass('hidden');
    }
}

function toggleRtlStyles(isRtl) {
    document.body.classList.toggle('rtl', isRtl);
    const progressBar = $('.instruction-progress-bar');
    const progressFill = $('.instruction-progress-fill');
    progressBar.toggleClass('rtl', isRtl);
    progressFill.toggleClass('rtl', isRtl);
}

async function fetchJson(url, errorMessage) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${errorMessage}: ${response.status}`);
    return response.json();
}

async function fetchMarkdown(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch translation Markdown`);
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/markdown")) {
        throw new Error(`Expected Markdown but received ${contentType}`);
    }
    return response.text();
}

function updateLanguageSelection(language) {
    const buttons = $('.dropdown-translation-item-block');
    buttons.each(function () {
        const isSelected = $(this).data('lang') === language;
        $(this).find('span.checkmark').remove();
        if (isSelected) {
            $(this).append(`<span class="checkmark"></span>`);
        }
    });
}


function fixTextAdjacentToDirective(doc) {
    let cm = doc.cm
    let txt = cm.getValue()
    let cursor = cm.getCursor();
    let changeOccured = false;
    let adjustCursor = false;

    //adding extra space below a directive at the beginning of the document when there is some adjacent text below the directive
    let pattern = /^(::\w+(\ )?{([^{}]*)}\n)([^\n])/g
    while (pattern.test(txt)) {
        txt = txt.replace(pattern, '$1\n$4')
        changeOccured = true;
        adjustCursor = true;
    }
    //adding extra space below a directive when there is some adjacent text below the directive
    pattern = /(\n::\w+(\ )?{([^{}]*)}\n)([^\n])/g
    while (pattern.test(txt)) {
        txt = txt.replace(pattern, '$1\n$4')
        changeOccured = true;
        adjustCursor = true;
    }
    //adding extra space above a directive when there is some adjacent text above the directive
    pattern = /([^\n])(\n::\w+(\ )?{([^{}]*)}\n)/g
    while (pattern.test(txt)) {
        txt = txt.replace(pattern, '$1\n$2')
        changeOccured = true;
    }

    //adding extra space below a directive when there is some adjacent text below the directive (In a list)
    pattern = /(\t*[^\n\t])(\n((\t)*)::\w+(\ )?{([^{}]*)}\n)/g
    while (pattern.test(txt)) {
        txt = txt.replace(pattern, '$1\n$3$2')
        changeOccured = true;
    }

    //adding extra space above a directive when there is some adjacent text above the directive (In a list)
    pattern = /(\n((\t)*)::\w+(\ )?{([^{}]*)}\n)(\t*([^\n\t]))/g
    while (pattern.test(txt)) {
        txt = txt.replace(pattern, '$1$2\n$6')
        changeOccured = true;
    }

    if (changeOccured) {
        cm.setValue(txt)
        cm.refresh();
        cm.setCursor(adjustCursor ? cursor.line + 1 : cursor.line, cursor.ch)
    }
    return changeOccured
}

function handleDynamicHeader(doc) {
    let currentlyParsing = false;
    let foundHeader = false;
    doc.previewContainer.find("p").each(function () {
        let tag = $(this);
        let content = tag.context.innerHTML;
        if (content.startsWith("::header") && content.includes("start")) {
            const { fixed, valid } = parseDirective(content, ["fixed"]);
            if (valid && fixed === "false") {
                currentlyParsing = true;
            }
        } else if (content.startsWith("::header") && content.includes("end")) {
            const { valid } = parseDirective(content, []);
            if (valid && currentlyParsing === true) {
                currentlyParsing = false;
                foundHeader = true;
            }
        }
    })
    return foundHeader;
}

function handleStaticHeader(doc) {
    let headerContent = "";
    let stickyHeader = doc.preview.find(".sticky-header");
    stickyHeader.empty();
    let foundHeader = false;
    let markdown = document.getElementsByClassName('editormd-markdown-textarea')[0].innerText;
    let markdownArray = markdown.split("\n");
    let content = "";
    let currentlyParsing = false;
    let codeblocks = markdownArray.forEach(function (line) {
        if (foundHeader) {
            return true;
        }
        if (line && line.length > 0 && line.startsWith("::header") && line.includes("start")) {
            const { fixed, valid } = parseDirective(line, ["fixed"]);
            if (valid && fixed === "true") {
                currentlyParsing = true;
            }

        } else if (line && line.length > 0 && line.startsWith("::header") && line.includes("end")) {
            const { valid } = parseDirective(line, []);
            if (valid && currentlyParsing === true) {
                currentlyParsing = false;
                if (content) {
                    console.log("updating content", content)
                    // if content contain "!" and "(" and "[" and ")" and "]", replace everything in between "(" and ")" with "test"
                    if (content.includes("!") && content.includes("(") && content.includes(")") && content.includes("[") && content.includes("]")) {
                        //get eveything that is between "(" and ")"
                        let contentBetweenParenthesis = content.substring(content.indexOf("(") + 1, content.indexOf(")"));
                        // create a new url by appending contentBetweenParenthesis to the asset_library_prefix_url
                        let newSource = "(" + asset_library_prefix_url + "/" + contentBetweenParenthesis + ")";
                        content = content.replace(/\(.*\)/g, newSource);
                    }
                    stickyHeader.append(editormd.$marked.parse(content));
                    stickyHeader.css("padding-top", "20px");
                    stickyHeader.css("padding-bottom", "20px");
                    foundHeader = true;
                    return true;
                }

            }


        } else if (line && line.length > 0 && currentlyParsing === true) {
            content += line + "\n";
        }
    })
    return foundHeader
}

function cleanStaticHeader(doc) {
    doc.previewContainer.contents().each(function () {
        let tag = $(this);
        let content = tag.context.innerHTML;
        if (pageRegex.test(content)) {
            return false;
        } else {
            tag.remove();
            tag.context.innerHTML = "";
        }
    })
}

function cleanDynamicHeader(doc) {
    let currentlyParsing = false;
    let firstHeaderFound = false;
    let pageFound = false;
    doc.previewContainer.contents().each(function () {
        let tag = $(this);
        let content = tag.context.nodeType == 3 ? "" : tag.context.innerHTML;
        if (pageFound) {
            return false;
        }
        if (pageRegex.test(content)) {
            pageFound = true;
            return false;
        } else if (firstHeaderFound && currentlyParsing === false) {
            tag.remove();
            tag.context.innerHTML = "";
        } else if (content.startsWith("::header") && content.includes("start") && content.includes("false") && firstHeaderFound === false) {
            const { fixed, valid } = parseDirective(content, ["fixed"]);
            if (valid && fixed === "false") {
                currentlyParsing = true;
                tag.remove();
            }
        } else if (content.startsWith("::header") && content.includes("end")) {
            const { valid } = parseDirective(content, []);
            if (valid && currentlyParsing === true) {
                currentlyParsing = false;
                firstHeaderFound = true;
            }
            tag.remove();
        } else if (currentlyParsing === false) {
            tag.remove()
            tag.context.innerHTML = "";
        }
    })

}

function fixEncoding(doc) {
    var Utf8 = {
        decode: function (utftext) {
            return JSON.parse(JSON.stringify(utftext));
        }
    }

    doc.previewContainer.contents().each(function () {
        let tag = $(this);
        let content = tag.context.innerHTML;

        if (content !== undefined) {
            decodedContent = Utf8.decode(content);
            if (content !== decodedContent) {
                tag.context.innerHTML = Utf8.decode(content) + "<i class=\"fa fa-times-circle-o\" style=\"color: red; font-size: 2em; margin-left: 1.25rem;\" title=\"This text contains invalid characters and may not save as expected\"></i>";
            }
        }
    })
}

function fixCustomPlugins(doc, rewardsLaunchURL) {
    //setup headers
    let stickyHeader = doc.preview.find(".sticky-header");
    stickyHeader.empty();
    stickyHeader.css("padding-top", "0px");
    stickyHeader.css("padding-bottom", "0px");
    stickyHeader.css("height", "auto");
    dynamicHeaderFound = handleDynamicHeader(doc);
    if (dynamicHeaderFound) {
        //only let the first dynamic header
        cleanDynamicHeader(doc);

    } else {
        //only let the first static header
        handleStaticHeader(doc);
        cleanStaticHeader(doc);
    }
    // setup for pagination custom plugin
    let pages = 0; // running counter of pages
    let header = doc.preview.find('.md-header');
    let pagination = header.find('.pagination');
    let tableOfContents = doc.preview.find('.table-of-contents');
    let pageDirectives = $("p").filter((i, elem) => isValidPageDirective(elem.innerHTML)) //all valid page directives
    $("button.toc").css("visibility", pageDirectives.length <= 0 ? "hidden" : "");

    currentPage = pageDirectives.length <= 0 ? -1 : 0

    tableOfContents.get(0).innerHTML = ""
    pagination.get(0).innerHTML = ""

    if (pageDirectives.length <= 0) {
        doc.previewContainer.append(`<h1>Markdown-based Instructions should include pages</h1><p>Please make sure to include at least one <strong>page</strong> directive in your instructions. Use the <strong>New Page</strong> button from the toolbar to create pages.</p><h3 align="center"> © IBM Corporation ${new Date().getFullYear()}<h3/>`)
    }

    //main renderer logic
    doc.previewContainer.contents().each(function () {
        let tag = $(this);
        let content = tag.context.innerHTML;
        if (startAppRegex.test(content)) {
            const { port, display, name, route, valid } = parseDirective(content, ["port", "display", "name", "route"]);
            if (valid) {
                tag.context.innerHTML =
                    `<button class="plugin" onclick="launchApplication('${port}','${route}','${display}')"><i class = "fa fa-rocket"></i> <span class = "plugin-text">${name}</span></button>`
            }
            else {
                tag.remove()
            }
        } else if (openFileRegex.test(content)) {
            const { path, valid } = parseDirective(content, ["path"]);
            if (valid) {
                const file = path.substring(path.lastIndexOf("/") + 1)
                tag.context.innerHTML =
                    `<button class="plugin" onclick="openFile('${path}')"><i class="fa fa-file-text"></i> <span class="plugin-text">Open <strong>${file}</strong> in IDE</span></button>`
            }
            else {
                tag.remove()
            }
        } else if (openRewardRegex.test(content)) {
            const { valid } = parseDirective(content);
            if (valid) {
                tag.context.innerHTML =
                    `<button class="plugin" 
                        onclick="openReward('${rewardsLaunchURL}')" 
                        ${window.location.href.includes('edit') ? 'disabled style="cursor: not-allowed; opacity: 0.6;"' : ''}
                        title="${window.location.href.includes('edit') ? 'Only clickable for learners or for authors in the test mode' : ''}">
                        <i class="fa fa-gift"></i> 
                        <span class="plugin-text">Start your <strong>IBM Cloud</strong> Trial</span>
                    </button>`
            }
            else {
                tag.remove()
            }
        } else if (openDatabaseRegex.test(content)) {
            const { db, start, valid } = parseDirective(content, ["db", "start"]);
            if (valid) {
                tag.context.innerHTML =
                    `<button class="plugin" onclick="openDataBase('${db}','${start}')"><i class="fa fa-database"></i> <span class="plugin-text">${start === 'true' ? "Open and Start " + db + " in IDE" : "Open " + db + " Page in IDE"}</span></button>`
            }
            else {
                tag.remove()
            }
        } else if (pageRegex.test(content)) {
            const { title, valid } = parseDirective(content);
            if (valid) {
                paginate(tag, title, pages, pageDirectives, pagination, tableOfContents);
                pages++;
            }
            tag.remove()
        } else if (openBigDataRegex.test(content)) {
            const { tool, start, valid } = parseDirective(content, ["tool", "start"]);
            if (valid) {
                tag.context.innerHTML =
                    `<button class="plugin" onclick="openBigData('${tool}','${start}')"><i class="fa fa-tasks"></i> <span class="plugin-text">${start === 'true' ? "Open and Start " + tool + " in IDE" : "Open " + tool + " in IDE"}</span></button>`
            }
            else {
                tag.remove()
            }
        } else if (openCloudRegex.test(content)) {
            const { tool, action, label, valid } = parseDirective(content, ["tool", "action", "label"]);
            if (valid) {
                const actionText = (action === "none") ? `Open ${tool}` : label;
                const text = `${actionText} in IDE`;
                tag.context.innerHTML =
                    `<button class="plugin" onclick="openCloud('${tool}','${action}')"><i class="fa fa-tasks"></i> <span class="plugin-text">${text}</span></button>`
            }
            else {
                tag.remove()
            }
        } else if (openEmbeddableAIRegex.test(content)) {
            const { tool, action, label, valid } = parseDirective(content, ["tool", "action", "label"]);
            if (valid) {
                const actionText = (action === "none") ? `Open ${tool}` : label;
                const text = `${actionText} in IDE`;
                tag.context.innerHTML =
                    `<button class="plugin" onclick="openEmbeddableAI('${tool}','${action}')"><i class="fa fa-tasks"></i> <span class="plugin-text">${text}</span></button>`
            }
            else {
                tag.remove()
            }
        }
    })
    // bind buttons for paginnation after the renderer is done
    fixPaginationBindings(doc)
}

function headerContent() {
    let markdown = document.getElementsByClassName('editormd-markdown-textarea')[0].innerText;
    let foundHeader = false;
    let markdownArray = markdown.split("\n");
    let content = "";
    let currentlyParsing = false;
    let codeblocks = markdownArray.forEach(function (line) {
        if (foundHeader) {
            return content;
        }
        if (line && line.length > 0 && line.startsWith("::header") && line.includes("start")) {
            const { fixed, valid } = parseDirective(line, ["fixed"]);
            if (valid) {
                currentlyParsing = true;
            }

        } else if (line && line.length > 0 && line.startsWith("::header") && line.includes("end")) {
            const { valid } = parseDirective(line, []);
            if (valid && currentlyParsing === true) {
                currentlyParsing = false;
                foundHeader = true;
                return content;
            }


        } else if (line && line.length > 0 && currentlyParsing === true) {
            content += line + "\n";
        }
    })
    return content;

}

function removeHeaders(cm) {
    let txt = cm.getValue()
    // find the index of ::page in txt
    let index = txt.indexOf("::page");
    // replace the string with new string from index to end
    if (index > -1) {
        txt = txt.substring(index);
    }
    // save the doc and replace it with txt
    cm.setValue(txt);
    cm.save();
}

function fixPaginationBindings(doc) {
    const tableOfContentsMenu = $('.table-of-contents');

    // bind pagination to buttons and links
    $('.pagination').children(".page-item").bind(editormd.mouseOrTouch("click", "touchend"), function () {
        changePage($(this).index() / 2, doc); // exclude page dividers from the index count
        doc.previewContainer.scrollTop(0);
    });
    $('.table-of-contents').children("button").bind(editormd.mouseOrTouch("click", "touchend"), function () {
        changePage($(this).index(), doc);
        tableOfContentsMenu.toggleClass('opened');
        doc.previewContainer.scrollTop(0);
    });
    $('div.page-footer > button.next').bind(editormd.mouseOrTouch("click", "touchend"), function () {
        let currPage = $(this).parents('.page').index();
        changePage(currPage + 1, doc);
        doc.previewContainer.scrollTop(0);
    });
    $('div.page-footer > button.previous').bind(editormd.mouseOrTouch("click", "touchend"), function () {
        let currPage = $(this).parents('.page').index();
        changePage(currPage - 1, doc);
        doc.previewContainer.scrollTop(0);
    });

    // wrap all pages in a parent container
    $(".page").wrapAll('<div class="pages"></div>');
    doc.previewContainer.css("height", "100%");

    // set progress bar
    setProgressBarWidth(currentPage);
    $('.page-divider').css("background-color", doc.previewContainer.css('background-color'));
}

function paginate(tag, title, pages, pageDirectives, pagination, tableOfContents) {
    if (title) {
        tag.after('<h1 class="pageTitle">' + title + '</h1>')
    }
    let allElements = tag.nextUntilWithTextNodes(pageDirectives);

    // create a page link in the progress bar
    if (pages <= currentPage) {
        pagination.append('<li class="page-item active"></li>');
    } else {
        pagination.append('<li class="page-item"></li>');
    };
    pagination.append('<li class="page-divider"></li>');


    // create a corresponding page and an entry in table of contents
    if (pages === currentPage) {
        if (allElements.length != 0) allElements.wrapAll("<div class='page' id=\"page-" + (pages + 1) + "\" />");
        else tag.after("<div class='page' id=\"page-" + (pages + 1) + "\" /></div>")
        tableOfContents.append('<button class="chapter active"><span class="chapter-num">' +
            (pages + 1) + '</span><span class="chapter-title">' + (title ? title : "") + '</span></button >');
    } else {
        if (allElements.length != 0) allElements.wrapAll("<div class='page' id=\"page-" + (pages + 1) + "\" style='display:none;' />");
        else tag.after("<div class='page' id=\"page-" + (pages + 1) + "\" style='display:none;' /></div>")
        tableOfContents.append('<button class="chapter"><span class="chapter-num">' +
            (pages + 1) + '</span><span class="chapter-title">' + (title ? title : "") + '</span></button >');
    };

    let page = $('#page-' + (pages + 1));
    page.append('<div class="page-footer"></div>');
    let footer = page.find('.page-footer');
    const previousButtonHtml = `<button class="previous"></button>`;
    const nextButtonHtml = `<button class="next"></button>`;

    if (pages === 0) {
        if (pageDirectives.length > 1) {
            footer.append('<button class="hidden"></button>');
            footer.append(nextButtonHtml);
        }
    } else if (pages === pageDirectives.length - 1) {
        footer.append(previousButtonHtml);
    } else {
        footer.append(previousButtonHtml);
        footer.append(nextButtonHtml);
    }
}

function adjustProgressBarWidth() {
    let currentPage = $("div.table-of-contents > button.chapter.active > span.chapter-num").text()
    if (currentPage) {
        setProgressBarWidth(parseInt(currentPage) - 1)
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function setPreviewWatchToolbar(doc) {
    // create header container
    doc.preview.prepend('<div class="sticky-header" style="z-index:1;"></div>');
    doc.preview.prepend('<div class="md-header" style="z-index:1;"></div>');
    let header = doc.preview.find('.md-header');

    // create the toolbar and pagination containers
    header.prepend(
        '<div class="toolbar"></div> \
        <nav class="instruction-progress-bar" aria-label="pagination"> \
            <div class="instruction-progress-fill"></div> \
            <ul class="pagination"></ul> \
        </nav>'
    );
    let toolbar = header.find('.toolbar');

    // populate toolbar
    toolbar.append(`<button class="toc tool-icon" title="Table of Contents">${tableOfContentsIcon}</button>`);
    let toc = toolbar.find('.toc')
    toc.css("visibility", "hidden");
    toc.bind(editormd.mouseOrTouch("click", "touchend"), function () {
        const tableOfContentsMenu = $('.table-of-contents');
        tableOfContentsMenu.toggleClass('opened');

        // dismiss table of contents menu if you click on anything outside of it
        const outsideClickListener = (event) => {
            const target = $(event.target);
            if (!target.closest(this).length && !target.closest(tableOfContentsMenu).length && tableOfContentsMenu.hasClass('opened')) {
                tableOfContentsMenu.toggleClass('opened');
                removeClickListener();
            };
        };
        const removeClickListener = () => {
            document.removeEventListener('click', outsideClickListener);
        }

        if (tableOfContentsMenu.hasClass('opened')) {
            document.addEventListener('click', outsideClickListener);
        } else {
            removeClickListener();
        }
    });

    // Append toolbar buttons
    toolbar.append(`
        <div class="tools">
            ${doc.settings.tool_type == "instructional-lab" ? `<button value="on" class="tool-icon" id="togglePreviewTheme" title="Toggle preview theme">${sunIcon}</button>` : ""}
            <button class="tool-icon" id="print" title="Print instructions">${printerIcon}</button>
            <button class="tool-icon" id="font-up" title="Increase font size">${documentPlusIcon}</button>
            <button class="tool-icon" id="font-down" title="Decrease font size">${documentMinusIcon}</button>
        </div>
    `);

    let toolIcons = toolbar.find('.tools');

    if (toolIcons) {
        toolIcons.find("#print").bind(editormd.mouseOrTouch("click", "touchend"), function () {
            let instructions = '';
            doc.previewContainer.children().each(function () {
                if (!$(this).hasClass("pages")) instructions += $(this)[0].outerHTML;
                else {
                    $(this).find(".page").each(function () {
                        $(this).children().each(function () {
                            if (!$(this).hasClass("page-footer")) instructions += $(this)[0].outerHTML;
                        })
                    })
                }
            });
            const content = window.open('', '', 'height=500, width=500');
            content.document.write('<html>');
            content.document.write('<head>');
            content.document.write(`
                <style>
                    .linenums {
                        list-style-type: none;
                    }

                    .formatted-line-numbers {
                        display: none;
                    }
                    .action-code-block {
                        display: none;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    table, th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                </style>
            `);
            content.document.write('</head>');
            content.document.write('<body >');
            content.document.write(instructions);
            content.document.write('</body></html>');
            content.document.close();
            content.print();
        });
        toolIcons.find("#font-up").bind(editormd.mouseOrTouch("click", "touchend"), function () {
            doc.preview.find("div:not(.toolbar) > *").css('font-size', '+=1');
        });
        toolIcons.find("#font-down").bind(editormd.mouseOrTouch("click", "touchend"), function () {
            doc.preview.find("div:not(.toolbar) > *").css('font-size', '-=1');
        });

        if (doc.settings.tool_type == "instructional-lab") {

            initTheme(toolIcons.find("#togglePreviewTheme")[0], doc);

            toolIcons.find("#togglePreviewTheme").bind(editormd.mouseOrTouch("click", "touchend"), function () {
                if (this.value === "off") {
                    this.value = "on";
                    this.innerHTML = `${sunIcon}`;
                    doc.setPreviewTheme('default');
                } else {
                    this.value = "off";
                    this.innerHTML = `${moonIcon}`;
                    doc.setPreviewTheme('dark');
                }
            });
        }
    };

    // Setup the toolbar for translations
    const jwt = parseJwt(findGetParameter("token"));
    const localesUrl =  jwt.locales_url || authorEditor.settings.localesUrl

    if (localesUrl) {
        fetch(localesUrl)
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch locales JSON");
                return response.json();
            })
            .then(localesData => {
                const jsonData = {
                    primary_locale: localesData.primary_locale,
                    locales: Object.entries(localesData.locales)
                        .map(([language, data]) => ({
                            language,
                            url: data.url,
                            nativeName: LANGUAGES.get(language)?.native || language
                        }))
                        .sort((a, b) => {
                            if (a.language === localesData.primary_locale) return -1;
                            if (b.language === localesData.primary_locale) return 1;
                            return a.nativeName.localeCompare(b.nativeName);
                        })
                        .map(({ nativeName, ...rest }) => rest)
                };

                if (jsonData) {
                    const translationContainer = toolbar.find('.tools').prepend(`
                        <div class="translation-container">
                            <button id="translations" class="tool-icon" aria-label="Translations" title="Change Language">
                                ${translationIcon}
                            </button>
                            <div id="translations-dropdown" class="translations-selected-dropdown hidden" name="translation-dropdown">
                            </div>
                        </div>
                    `);

                    tippy('#translations', {content: (reference) => reference.getAttribute('title')});

                    toolbar.find('#translations-dropdown').append(`
                        <div class="disclaimer">
                            <span>*Translations are machine generated <strong>(BETA)</strong></span>
                        </div>
                    `);

                    for (const locale of jsonData.locales) {
                        toolbar.find('#translations-dropdown').append(`
                            <button type="button"
                                    class="dropdown-translation-item-block"
                                    data-lang="${locale.language}"
                                    onclick="setTranslationContent('${locale.language}')">
                                <span>${LANGUAGES.get(locale.language).native} ${locale.language === jsonData.primary_locale ? '[Original]' : ''}</span>
                                ${locale.language === jsonData.primary_locale ? `<span class="checkmark"></span>` : ''}
                            </button>
                        `);
                    }

                    document.addEventListener('click', function (event) {
                        const container = document.querySelector('.translation-container');
                        const dropdown = document.querySelector('#translations-dropdown');

                        if (!container.contains(event.target) && dropdown.style.display === 'block') {
                            dropdown.style.display = 'none';
                        }
                    });

                    const translationButton = toolbar.find('#translations');
                    translationButton.bind(editormd.mouseOrTouch("click", "touchend"), function (event) {
                        event.stopPropagation();

                        let dropdownContainer = translationContainer.find('#translations-dropdown');

                        dropdownContainer.toggle();
                    });
                }
            })
            .catch(error => console.error("Error fetching or processing locales JSON:", error));
    }

    // create table of contents
    $(header).after('<div class="table-of-contents"></div>');

    tippy('.tool-icon', {content: (reference) => reference.getAttribute('title')});
}

function setProgressBarWidth(pageNumber) {
    if (pageNumber == -1) {
        $('.instruction-progress-fill').css("width", "0px");
    }
    else {
        const rectInfo = $('.page-item')[0].getBoundingClientRect();
        let width;
        if (rectInfo.width) {
            // `width` is available for IE9+
            width = rectInfo.width;
        } else {
            // Calculate width for IE8 and below
            width = rectInfo.right - rectInfo.left;
        }
        let progress = ((pageNumber + 1) * width) + (pageNumber * 2);
        $('.instruction-progress-fill').width(progress.toString() + "px");

    }
}

function initTheme(themeTool, doc) {
    let currentTheme = localStorage.getItem("theme") || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "default");

    if (currentTheme === "dark") {
        themeTool.value = "off";
        themeTool.innerHTML = `${moonIcon}`;
        doc.setPreviewTheme('dark');
    } else {
        themeTool.value = "on";
        themeTool.innerHTML = `${sunIcon}`;
        doc.setPreviewTheme('default');
    }
}

function changePage(chosenPageNumber, doc, scroll = true) {
    // set active class indicators
    $('.pagination').find("li.active").removeClass('active');
    const activePage = $('.pagination').children(".page-item").eq(chosenPageNumber);
    activePage.addClass('active');
    $('.table-of-contents').find("button.active").removeClass('active');
    $('.table-of-contents').children("button").eq(chosenPageNumber).addClass('active');

    setProgressBarWidth(chosenPageNumber);

    // show the active page
    doc.previewContainer.find(`div#page-${currentPage + 1}`).hide();
    doc.previewContainer.find(`div#page-${chosenPageNumber + 1}`).show();

    // store current page number
    currentPage = chosenPageNumber;

    // scroll to corresponding editor line
    if (scroll && !doc.settings.readOnly) {
        let positionOfCurrentPageDirectiveInEditor = doc.cm.charCoords({ line: doc.settings.pageMap[currentPage], ch: 0 }, "local").top + 1;
        doc.cm.scrollTo(null, positionOfCurrentPageDirectiveInEditor)
    }
}

function setVisible(selector, visible) {
    document.querySelector(selector).style.display = visible ? 'block' : 'none';
}
