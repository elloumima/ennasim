const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, PageBreak, PageNumber, TableOfContents
} = require("docx");

const IMG = "/Users/MAEmcPro/Projects/ennasim/assets/images/";
const LOGO_ACCESS = "/Users/MAEmcPro/Projects/ennasim/assets/word/media/image1.png";

const NAVY = "181640";
const ORANGE = "E0644B";
const BLUE = "0277BD";
const RED = "C62828";
const MANGO = "FF8F00";
const GREEN = "2E7D32";
const MUTED = "8D8D98";
const BG_BLUE = "E1F5FE";
const BG_RED = "FFEBEE";
const BG_MANGO = "FFF8E1";
const BG_ORANGE = "FFF0EC";
const BG_GREEN = "E8F5E9";
const BG_PURPLE = "F3E5F5";
const WHITE = "FFFFFF";

function img(name, w, h) {
  return new ImageRun({ type: "jpg", data: fs.readFileSync(IMG + name), transformation: { width: w, height: h }, altText: { title: name, description: name, name: name } });
}
function logo() {
  return new ImageRun({ type: "png", data: fs.readFileSync(LOGO_ACCESS), transformation: { width: 120, height: 120 }, altText: { title: "Alnaseem", description: "Logo", name: "logo" } });
}

const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const cellM = { top: 80, bottom: 80, left: 120, right: 120 };

function p(text, opts = {}) {
  const runs = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true, font: "Montserrat", size: opts.size || 22, color: opts.color }));
    } else {
      runs.push(new TextRun({ text: part, font: "Montserrat", size: opts.size || 22, color: opts.color, bold: opts.bold, italics: opts.italics }));
    }
  }
  return new Paragraph({ spacing: { after: opts.after !== undefined ? opts.after : 160, line: opts.line || 276 }, alignment: opts.align, children: runs });
}

function bigQuote(text) {
  return new Paragraph({ spacing: { before: 300, after: 300 }, indent: { left: 400, right: 400 }, border: { left: { style: BorderStyle.SINGLE, size: 12, color: ORANGE } },
    children: [new TextRun({ text, font: "Montserrat", size: 26, bold: true, color: NAVY, italics: true })] });
}

function bullet(text, ref = "bullets") {
  const runs = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) runs.push(new TextRun({ text: part.slice(2, -2), bold: true, font: "Montserrat", size: 22 }));
    else runs.push(new TextRun({ text: part, font: "Montserrat", size: 22 }));
  }
  return new Paragraph({ numbering: { référence: ref, level: 0 }, spacing: { after: 80, line: 276 }, children: runs });
}

function numbered(text, ref = "numbers") {
  const runs = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) runs.push(new TextRun({ text: part.slice(2, -2), bold: true, font: "Montserrat", size: 22 }));
    else runs.push(new TextRun({ text: part, font: "Montserrat", size: 22 }));
  }
  return new Paragraph({ numbering: { référence: ref, level: 0 }, spacing: { after: 80, line: 276 }, children: runs });
}

function tableRow(cells, headerRow = false) {
  return new TableRow({ children: cells.map(c => new TableCell({
    borders, margins: cellM, width: { size: c.width || 4680, type: WidthType.DXA },
    shading: headerRow ? { fill: NAVY, type: ShadingType.CLEAR } : (c.bg ? { fill: c.bg, type: ShadingType.CLEAR } : undefined),
    children: [new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: c.text, font: "Montserrat", size: 20, bold: headerRow || c.bold, color: headerRow ? WHITE : (c.color || NAVY) })] })]
  }))});
}

function simpleTable(headers, rows, colWidths) {
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  return new Table({ width: { size: totalW, type: WidthType.DXA }, columnWidths: colWidths,
    rows: [
      tableRow(headers.map((h, i) => ({ text: h, width: colWidths[i] })), true),
      ...rows.map(row => tableRow(row.map((c, i) => ({ text: typeof c === "string" ? c : c.text, width: colWidths[i], bold: typeof c === "object" ? c.bold : false, bg: typeof c === "object" ? c.bg : undefined, color: typeof c === "object" ? c.color : undefined }))))
    ]
  });
}

function colorBox(children, bgColor) {
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({ borders: noBorders, margins: { top: 200, bottom: 200, left: 300, right: 300 }, shading: { fill: bgColor, type: ShadingType.CLEAR }, width: { size: 9360, type: WidthType.DXA }, children })] })]
  });
}

function space() { return p("", { after: 40 }); }

// ============================
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Montserrat", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 36, bold: true, font: "Montserrat", color: NAVY }, paragraph: { spacing: { before: 400, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 28, bold: true, font: "Montserrat", color: NAVY }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 24, bold: true, font: "Montserrat", color: ORANGE }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: { config: [
    { référence: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { référence: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { référence: "numbers2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  ]},
  sections: [
    // ===== COUVERTURE =====
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 0, right: 0, bottom: 0, left: 0 } } },
      children: [new Table({ width: { size: 12240, type: WidthType.DXA }, columnWidths: [12240],
        rows: [new TableRow({ height: { value: 15840, rule: "exact" }, children: [new TableCell({ borders: noBorders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 12240, type: WidthType.DXA }, verticalAlign: "center", margins: { top: 400, bottom: 400, left: 1200, right: 1200 },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [logo()] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "STRATÉGIE DIGITALE 2026", font: "Montserrat", size: 20, color: ORANGE, bold: true })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "Alnaseem", font: "Montserrat", size: 56, bold: true, color: WHITE })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Sweeten your EVERYDAY", font: "Montserrat", size: 40, bold: true, color: ORANGE })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: "De l'occasionnel à la nécessité", font: "Montserrat", size: 24, color: "AAAAAA", italics: true })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Access Content Agency \u2014 access.tn", font: "Montserrat", size: 18, color: "888888" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Mars 2026 | Confidentiel", font: "Montserrat", size: 16, color: "888888" })] }),
          ]
        })]})]})]},

    // ===== TABLE DES MATIÈRES =====
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 400 }, children: [new TextRun({ text: "Table des mati\u00e8res", font: "Montserrat" })] }),
        new TableOfContents("Sommaire", { hyperlink: true, headingStyleRange: "1-2" }),
      ]
    },

    // ===== CONTENU PRINCIPAL =====
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: ORANGE } }, spacing: { after: 200 }, children: [new TextRun({ text: "Alnaseem \u2014 Sweeten your EVERYDAY  |  Access Content Agency", font: "Montserrat", size: 16, color: MUTED })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" } }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Confidentiel \u2014 Page ", font: "Montserrat", size: 16, color: MUTED }), new TextRun({ children: [PageNumber.CURRENT], font: "Montserrat", size: 16, color: MUTED })] })] }) },
      children: [

// ============================================================
// CHAPITRE 1 — L'ENFER DU RED OCEAN
// ============================================================
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Chapitre 1 \u2014 L'enfer du Red Ocean", font: "Montserrat" })] }),

p("Le marché tunisien de la glace est un marché mur, mais profondement répétitif. Depuis des annees, les memes acteurs \u2014 Selja, Ice Vegas, Eskimo, Paname \u2014 se disputent le même territoire avec les memes armes : des product shots estivaux, des campagnes saisonnieres, et une promesse identique de \u00AB moment plaisir \u00BB."),

p("Le resultat est un **ocean rouge** au sens stratégique du terme : une arène saturée où la différenciation est quasi inexistante, où les budgets publicitaires augmentent pour des resultats décroissants, et où le consommateur ne perçoit aucune difference réelle entre les marques. Pour lui, une glace est une glace \u2014 peu importe l'emballage."),

space(),
new Paragraph({ alignment: AlignmentType.CENTER, children: [img("plv_alnaseem.jpg", 280, 460)] }),
p("Le presentoir actuel Alnaseem en point de vente : un positionnement 100% \u00AB achat impulsif au congelateur \u00BB, identique à tous les concurrents.", { size: 18, color: MUTED, align: AlignmentType.CENTER }),
space(),

p("Si Alnaseem reste positionnée dans cet ocean rouge, elle est condamnee a n'etre qu'**une option parmi d'autres dans un congelateur bonde**. La croissance sera lente, couteuse, et entièrement dependante du budget publicitaire investi chaque été. Des que le thermometre descend \u2014 ou que la fete est finie \u2014 les ventes s'effondrent."),

space(),
bigQuote("\u00AB On se bat pour des parts de voix dans un secteur qui s'arrete de respirer des que le thermometre descend ou que la fete est finie. \u00BB"),
space(),

p("**Les chiffres parlent d'eux-memes :**"),
space(),
simpleTable(
  ["Facteur", "Réalité du Red Ocean", "Impact pour Alnaseem"],
  [
    ["Saisonnalite", "5 mois actifs (mai-sept) sur 12", "7 mois sans dynamique commerciale digitale"],
    ["Concurrence", "5+ marques sur le même message", "Course au budget publicitaire \u2014 le plus riche gagne, pas le plus malin"],
    ["Différenciation", "Tous disent \u00AB plaisir, partage, été \u00BB", "Le consommateur ne voit aucune difference entre les marques"],
    ["Vulnérabilité", "100% météo-dependant + occasion-dependant", "Un été pluvieux ou un contexte economique tendu = saison perdue"],
  ],
  [2200, 3580, 3580]
),

space(),
p("Le constat est limpide : **rester dans le Red Ocean est une impasse stratégique**. Il faut un pivot. Non pas pour abandonner ce terrain \u2014 les fetes et les sorties resteront toujours un moment de consommation de glace \u2014 mais pour ouvrir un **second front** sur un territoire où personne ne se bat encore."),

// ============================================================
// CHAPITRE 2 — LE PIVOT BLUE OCEAN
// ============================================================
new Paragraph({ children: [new PageBreak()] }),
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Chapitre 2 \u2014 Le pivot stratégique : l'invasion du Blue Ocean", font: "Montserrat" })] }),

p("La stratégie que nous proposons ne consiste pas a abandonner le Red Ocean. **Il s'agit de s'en servir comme base arriere**, tout en allant chercher la croissance massive la où personne ne regarde : dans le détournement d'une habitude culturelle profondement ancrée dans le quotidien tunisien."),

space(),
new Paragraph({ alignment: AlignmentType.CENTER, children: [img("clean_finale.jpg", 520, 350)] }),
space(),

new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "L'observation de terrain", font: "Montserrat" })] }),

p("Observons ce qui se passe dans chaque foyer tunisien, chaque jour, apres le repas. Apres un **Kafteji bien piquant**, un **Couscous gras** ou une **Ojja qui brule les papilles**, le Tunisien cherche désespérément a \u00AB laver \u00BB son palais. C'est un reflexe quasi physiologique : la bouche a besoin de fraîcheur, de douceur, d'un contrepoint au gras et au pimente."),

p("Qu'est-ce qu'il choisit aujourd'hui ? Les options sont connues \u2014 et toutes insatisfaisantes :"),

bullet("**Le the post-repas** \u2014 un classique ancré, mais qui arrive en fin de parcours. Avant lui, il manque une etape fraiche."),
bullet("**Le soda** \u2014 present sur la table, mais sans dimension gourmande ni plaisir de degustation."),
bullet("**La mousse au chocolat où le tiramisu** \u2014 delicieux, mais riches. Apres un repas copieux, le palais cherche de la legerete, pas de la lourdeur."),
bullet("**Le fruit** \u2014 sain mais prévisible. Pas d'effet \u00AB wow \u00BB, pas de découverte."),

space(),
p("Ce qui manque dans ce parcours, c'est une etape entre le dernier plat et le the : **un moment de fraîcheur, de douceur et de découverte gustative**. C'est exactement le creneau d'Alnaseem. Pas en remplacement de quoi que ce soit \u2014 mais comme un **ajout qui enrichit la fin du repas**."),

space(),
bigQuote("\u00AB Et si la reponse a cette recherche quotidienne de fraîcheur, c'etait Alnaseem ? \u00BB"),
space(),

new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Le Hijacking culturel \u2014 redéfinir le concurrent", font: "Montserrat" })] }),

p("Voici le changement de paradigme fondamental de cette stratégie : **le concurrent d'Alnaseem n'est plus Selja, Ice Vegas ou Eskimo**. Ces marques jouent dans le Red Ocean \u2014 et nous y restons aussi. Mais sur notre nouveau territoire, nos vrais concurrents sont les rituels post-repas eux-memes :"),

space(),
colorBox([
  p("**Nos vrais concurrents :**", { size: 24, bold: true, color: WHITE }),
  p("", { color: WHITE }),
  bullet("Le **the** \u2014 un classique, mais il arrive en fin de parcours. Avant lui, rien."),
  bullet("Le **soda** \u2014 sur la table, mais sans dimension gourmande"),
  bullet("Le **dessert riche** (mousse, tiramisu) \u2014 gourmand mais pas frais"),
  bullet("Le **fruit** \u2014 sain mais sans surprise"),
  p("", { color: WHITE }),
  p("**Alnaseem s'insere avant tout ca.** Frais, onctueux, avec des saveurs qui nettoient le palais \u2014 un moment de douceur qui préparé la suite. Le the reste le the, mais avant lui, il y a désormais le **\u00AB Clean Finale \u00BB** : le dessert qui libere le palais.", { color: WHITE }),
], NAVY),

space(),
p("Le \u00AB Clean Finale \u00BB, c'est l'idee qu'**Alnaseem ne vend pas du sucre**. Alnaseem vend la fin de la sensation de gras et de sel. La fraîcheur apres le feu. Le point final parfait d'un repas. C'est un positionnement que **personne n'a jamais pris** dans le marché tunisien de la glace \u2014 ni dans celui du dessert en général."),

space(),
bigQuote("\u00AB On ne vend pas du sucre. On vend la fin de la sensation de gras et de sel. On vend le Clean Finale. \u00BB"),

// ============================================================
// CHAPITRE 3 — SWEETEN YOUR EVERYDAY
// ============================================================
new Paragraph({ children: [new PageBreak()] }),
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Chapitre 3 \u2014 La plateforme : \u00AB Sweeten your EVERYDAY \u00BB", font: "Montserrat" })] }),

p("La plateforme de marque \u00AB **Sweeten your EVERYDAY** \u00BB est construite sur un dualisme stratégique délibéré. Elle permet a Alnaseem d'avoir **un pied dans chaque monde** : celui des célébrations (le Red Ocean, où la marque est déjà presente) et celui du rituel quotidien (le Blue Ocean, où tout reste a construire)."),

p("Ce dualisme n'est pas une hesitation. C'est un **Grand Ecart** calculé : Alnaseem adoucit aussi bien les moments exceptionnels de la vie que la fin de chaque repas ordinaire. C'est cette double couverture qui rend la marque **incontournable 365 jours par an**, et non plus 5 mois."),

space(),
new Paragraph({ alignment: AlignmentType.CENTER, children: [img("dualisme.jpg", 520, 290)] }),
space(),

// Dual ocean table
new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [4680, 4680],
  rows: [new TableRow({ children: [
    new TableCell({ borders: noBorders, shading: { fill: BG_RED, type: ShadingType.CLEAR }, width: { size: 4680, type: WidthType.DXA }, margins: { top: 200, bottom: 200, left: 200, right: 200 },
      children: [
        p("**\u00AB Sweetening the Moments \u00BB**", { size: 26, color: RED }),
        p("Pilier Émotionnel \u2014 Le Red Ocean", { size: 18, italics: true, color: MUTED }),
        space(),
        p("Ce pilier couvre toutes les occasions sociales où la glace a traditionnellement sa place : les anniversaires, les pique-niques, les sorties plage, les fetes. La cible est **l'animal social** \u2014 celui qui partage, celebre, et tague ses amis."),
        p("C'est notre base acquise. Nous ne la quittons pas. Nous la consolidons avec un contenu plus engageant, plus viral, et une presence TikTok/Instagram qui n'existe pas encore."),
      ]
    }),
    new TableCell({ borders: noBorders, shading: { fill: BG_BLUE, type: ShadingType.CLEAR }, width: { size: 4680, type: WidthType.DXA }, margins: { top: 200, bottom: 200, left: 200, right: 200 },
      children: [
        p("**\u00AB Sweetening the Routine \u00BB**", { size: 26, color: BLUE }),
        p("Pilier Fonctionnel \u2014 Le Blue Ocean", { size: 18, italics: true, color: MUTED }),
        space(),
        p("Ce pilier est la revolution. Il positionné Alnaseem comme le **rituel d'apres-repas quotidien** : apres le dejeuner, apres le diner, en sortie de bureau. La cible est **le gourmand habitue** \u2014 celui qui cherche son Clean Finale."),
        p("C'est ici que se trouve la croissance. Un marché vierge, sans concurrent, avec une fréquence de consommation potentiellement quotidienne. Le terrain est libre. Il faut y aller maintenant."),
      ]
    }),
  ]})]
}),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "L'arme secrete : des saveurs introuvables en Tunisie", font: "Montserrat" })] }),

p("Ce qui rend le positionnement d'Alnaseem credible et défensible, c'est un avantage produit concret que la concurrence ne possède pas : **un arsenal de saveurs introuvables chez les concurrents tunisiens**. Alors que Selja, Ice Vegas et Eskimo se limitent au trio classique vanille-chocolat-fraise, Alnaseem propose des gouts que le consommateur tunisien n'a jamais goutes en glace locale :"),

space(),
simpleTable(
  ["Saveur", "Format", "Existe chez les concurrents?"],
  [
    [{ text: "Cotton Candy", bold: true }, "Cone Kyroo 120ml", { text: "NON \u2014 exclusivite Alnaseem", color: RED, bold: true }],
    [{ text: "Bubble Gum", bold: true }, "Cone Kyroo 120ml", { text: "NON \u2014 exclusivite Alnaseem", color: RED, bold: true }],
    [{ text: "Banana Peel", bold: true }, "Stick Kyroo 75ml", { text: "NON \u2014 exclusivite Alnaseem", color: RED, bold: true }],
    [{ text: "Mangue", bold: true }, "Waterstick ICY, Molla, Sorbet Gil'ice", { text: "NON \u2014 exclusivite Alnaseem", color: RED, bold: true }],
    [{ text: "Ananas", bold: true }, "Double Layer Twins 64ml", { text: "NON \u2014 exclusivite Alnaseem", color: RED, bold: true }],
    [{ text: "Passion Fruit", bold: true }, "Greek Mango Passion 140g", { text: "NON \u2014 exclusivite Alnaseem", color: RED, bold: true }],
    [{ text: "Caramelo", bold: true }, "Gusto Stick", { text: "NON \u2014 exclusivite Alnaseem", color: RED, bold: true }],
  ],
  [2200, 3660, 3500]
),

space(),
new Paragraph({ alignment: AlignmentType.CENTER, children: [img("saveurs.jpg", 400, 400)] }),
space(),

p("Ces saveurs sont bien plus qu'un avantage produit. Elles sont **l'argument massue du Pilier Fonctionnel** : \u00AB Apres le couscous, le palais a besoin de fraîcheur. Pas de the brulant \u2014 du cotton candy onctueux, de la mangue acidulee, de la banane glacee. Des gouts que vous ne trouverez nulle part ailleurs en Tunisie. \u00BB"),

p("Chaque saveur est aussi un **contenu viral en puissance**. \u00AB Du cotton candy en cone de glace? En Tunisie? Serieusement? \u00BB \u2014 c'est un hook TikTok naturel. Nous avons donc à la fois l'avantage produit (le \u00AB quoi \u00BB) et l'avantage contenu (le \u00AB comment le faire savoir \u00BB)."),

space(),
bigQuote("\u00AB Nous élargissons le territoire d'Alnaseem, passant du parc d'attractions à la table a manger. En proposant de Sweeten your EVERYDAY, nous transformons la fin de chaque repas en une raison d'acheter. \u00BB"),

// ============================================================
// CHAPITRE 4 — LIGNE ÉDITORIALE
// ============================================================
new Paragraph({ children: [new PageBreak()] }),
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Chapitre 4 \u2014 Ligne éditoriale", font: "Montserrat" })] }),

p("La ligne éditoriale est le cadre qui gouverne chaque contenu publie sous le nom Alnaseem. Elle garantit la coherence du message sur toutes les plateformes, a travers tous les formats, et dans le temps. Sans elle, les 110 contenus mensuels que nous produirons risquent de partir dans toutes les directions."),

space(),
colorBox([
  p("**La regle d'or**", { size: 26, bold: true, color: WHITE }),
  p("Chaque contenu publie doit servir l'un des deux piliers de la plateforme \u2014 où les deux. Si un contenu ne parle ni de **\u00AB celebration \u00BB** (Pilier Émotionnel) ni de **\u00AB rituel quotidien / Clean Finale \u00BB** (Pilier Fonctionnel), il n'a pas sa place dans le calendrier editorial.", { color: WHITE }),
], NAVY),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Le ton par pilier", font: "Montserrat" })] }),

p("Les deux piliers appellent des tonalites differentes, mais qui partagent un socle commun : la **derja tunisienne authentique** (jamais d'arabe litteraire), un registre **gourmand et visuel**, et une marque qui **parle comme les Tunisiens parlent** \u2014 pas comme une entreprise qui fait de la pub."),

space(),
simpleTable(
  ["Pilier Émotionnel (Red Ocean)", "Pilier Fonctionnel (Blue Ocean)"],
  [
    ["Fun, festif, communautaire", "Gourmand, rituel, complice, malin"],
    ["Challenges, partages, tags, humour tunisien", "Taste tests, recettes, \u00AB apres le repas \u00BB"],
    ["Derja spontanee, memes, références pop culture", "Derja + références culinaires TN (couscous, ojja, kafteji)"],
    ["\u00AB Marque ton pote \u00BB, \u00AB Qui vient au parc? \u00BB", "\u00AB El Clean Finale \u00BB, \u00AB Avant el the, Alnaseem \u00BB"],
    ["Musique trending, couleurs vives, montage rapide", "Gros plans textures, slow motion, ASMR food"],
  ],
  [4680, 4680]
),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Ce qu'on dit / ce qu'on ne dit jamais", font: "Montserrat" })] }),

new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [4680, 4680],
  rows: [new TableRow({ children: [
    new TableCell({ borders: noBorders, shading: { fill: BG_GREEN, type: ShadingType.CLEAR }, width: { size: 4680, type: WidthType.DXA }, margins: cellM,
      children: [
        p("**DO \u2014 Ce qu'on dit toujours**", { size: 24, color: GREEN }),
        bullet("\u00AB Sweeten your everyday \u00BB \u2014 le fil conducteur sur tout contenu"),
        bullet("\u00AB Des saveurs qu'on ne trouve nulle part ailleurs en Tunisie \u00BB"),
        bullet("\u00AB Le Clean Finale \u00BB \u2014 apres le kafteji, le couscous, l'ojja"),
        bullet("\u00AB Avant el the, offre-toi un Clean Finale Alnaseem \u00BB"),
        bullet("Derja tunisienne authentique, jamais formelle"),
        bullet("Contenu gourmand : gros plans, slow motion, ASMR"),
      ]
    }),
    new TableCell({ borders: noBorders, shading: { fill: BG_RED, type: ShadingType.CLEAR }, width: { size: 4680, type: WidthType.DXA }, margins: cellM,
      children: [
        p("**DON'T \u2014 Ce qu'on ne dit jamais**", { size: 24, color: RED }),
        bullet("\u00AB Glace de l'été \u00BB comme seul positionnement"),
        bullet("Product shots froids sans mise en scene humaine"),
        bullet("Arabe litteraire ou ton corporate"),
        bullet("Comparaison directe avec Selja, Ice Vegas, etc."),
        bullet("Promos agressives \u00AB ACHETEZ MAINTENANT \u00BB"),
        bullet("Contenu générique interchangeable avec n'importe quelle marque"),
      ]
    }),
  ]})]
}),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Hashtags officiels", font: "Montserrat" })] }),

p("L'architecture de hashtags est structurée pour couvrir les deux piliers, les saveurs, et la communaute :"),
space(),
simpleTable(
  ["Usage", "Hashtags"],
  [
    [{ text: "Plateforme (sur TOUT contenu)", bold: true }, "#SweetenYourEveryday"],
    [{ text: "Clean Finale", bold: true }, "#CleanFinale #ApresLeRepas"],
    [{ text: "Découverte saveurs", bold: true }, "#JamaisGouteCa #TasDejaTeste"],
    [{ text: "Par saveur (rotation)", bold: true }, "#AlnaseemCottonCandy #AlnaseemBanana #AlnaseemMangue #AlnaseemBubbleGum..."],
    [{ text: "Célébrations", bold: true }, "#AlnaseemMoment #SweetMoments"],
  ],
  [3200, 6160]
),

// ============================================================
// CHAPITRE 5 — PLAN MEDIA
// ============================================================
new Paragraph({ children: [new PageBreak()] }),
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Chapitre 5 \u2014 Plan media : le parcours de l'utilisateur", font: "Montserrat" })] }),

p("Le plan media n'est pas une liste de plateformes. C'est un **systeme conçu pour accompagner l'utilisateur** de la première découverte d'Alnaseem jusqu'a son integration dans un rituel quotidien. Chaque plateforme joue un role precis dans ce parcours \u2014 aucune n'est la par hasard."),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Le funnel media \u2014 de la découverte au rituel", font: "Montserrat" })] }),

p("Le parcours d'un utilisateur se décompose en 5 etapes. L'objectif est de l'amener naturellement de \u00AB C'est quoi ce gout? \u00BB jusqu'a \u00AB C'est MON dessert de tous les soirs \u00BB :"),

space(),
simpleTable(
  ["Etape", "Ce que pense l'utilisateur", "Plateforme qui repond"],
  [
    [{ text: "1. DÉCOUVERTE", bold: true, bg: NAVY, color: WHITE }, "\"C'est quoi ce gout?! Ca existe en Tunisie?\"", "TikTok + YouTube Shorts"],
    [{ text: "2. CURIOSITE", bold: true, bg: BLUE, color: WHITE }, "\"Je veux en savoir plus sur cette marque\"", "Instagram Reels + Stories"],
    [{ text: "3. DESIR", bold: true, bg: ORANGE, color: WHITE }, "\"Ce soir, c'est Alnaseem apres le diner\"", "Instagram Feed + Facebook"],
    [{ text: "4. ACHAT", bold: true, bg: GREEN, color: WHITE }, "\"Ou est-ce que je peux trouver ca?\"", "Facebook Ads géolocalisé"],
    [{ text: "5. RITUEL", bold: true, bg: MANGO, color: WHITE }, "\"C'est devenu MON dessert. Je le recommande.\"", "UGC + Communaute #CleanFinale"],
  ],
  [2200, 4080, 3080]
),

space(),
p("L'enjeu est que **chaque contenu pousse l'utilisateur vers l'etape suivante**. Un TikTok ne doit pas essayer de vendre \u2014 il doit creer de la curiosite qui pousse a suivre le compte Instagram. Un post Facebook ne doit pas essayer d'être viral \u2014 il doit convaincre la famille d'acheter ce soir."),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "TikTok \u2014 Le déclencheur de curiosite", font: "Montserrat" })] }),

p("TikTok est la plateforme où l'on touche des personnes qui **ne connaissent pas encore Alnaseem**. C'est le haut du funnel, le point d'entree. Avec 6 millions d'utilisateurs de 18+ en Tunisie et aucune marque de glace sérieusement presente, c'est un terrain vierge."),

p("Le contenu TikTok s'appuie sur les saveurs différenciantes comme **hooks naturels** : \u00AB Du cotton candy en cone de glace? En Tunisie?! \u00BB \u2014 ce type de contenu génère de la surprise, de la curiosite, et du partage sans nécessiter de budget publicitaire."),

space(),
simpleTable(
  ["Parametre", "Detail"],
  [
    [{ text: "Fréquence", bold: true }, "4-5 videos par semaine, soit 20 par mois"],
    [{ text: "Duree optimale", bold: true }, "15-45 secondes (optimise pour le completion rate)"],
    [{ text: "Horaires de publication", bold: true }, "12h-14h (pause dejeuner) et 20h-22h (apres le diner) \u2014 les moments où on pense au dessert"],
    [{ text: "Mix mensuel", bold: true }, "6 taste tests saveurs / 5 Clean Finale / 3 episodes Kyroo / 4 recettes rapides / 2 célébrations"],
    [{ text: "Optimisation algorithme", bold: true }, "Hook visuel dans les 2 premières secondes. Pas de logo en intro. Musique trending. CTA en commentaire."],
    [{ text: "Objectif à 6 mois", bold: true }, "50 000 followers, 1 video a >100K vues par mois"],
  ],
  [2800, 6560]
),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Instagram \u2014 La vitrine gourmande", font: "Montserrat" })] }),

p("Instagram est la plateforme où l'on **transforme la curiosite en desir**. L'utilisateur qui a decouvert Alnaseem sur TikTok vient ici pour explorer les saveurs, sauvegarder des recettes, et se laisser tenter par les visuels \u00AB Clean Finale \u00BB \u2014 ces plans de tables debarrassees avec un bol de glace qui arrive comme le point final parfait."),

space(),
simpleTable(
  ["Parametre", "Detail"],
  [
    [{ text: "Fréquence", bold: true }, "15 posts feed + 12 Reels + 30 Stories par mois (57 contenus/mois)"],
    [{ text: "Horaires", bold: true }, "Feed : 11h-13h (engagement max) | Stories : 8h, 12h, 20h (3 touchpoints/jour) | Reels : 19h-21h"],
    [{ text: "Optimisation", bold: true }, "Saves > Likes (recettes \u00AB saveable \u00BB). Carousels pour maximiser le temps passe. Reels <30s. Stickers Stories pour les interactions."],
    [{ text: "Objectif à 6 mois", bold: true }, "30 000 followers, taux d'engagement >4%, 500+ saves par mois"],
  ],
  [2800, 6560]
),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "YouTube \u2014 Le moteur de recherche long terme", font: "Montserrat" })] }),

p("YouTube est la plateforme la plus sous-estimee de cette stratégie \u2014 et potentiellement la plus rentable à long terme. Contrairement a TikTok (ou une video à une duree de vie de 48h) et Instagram (ou le contenu est éphémère), **une video YouTube bien référencée génère du trafic pendant des annees**."),

p("L'objectif est de positionnér Alnaseem en tete des resultats de recherche Google pour des requetes comme \u00AB recette dessert glace \u00BB, \u00AB glace Tunisie \u00BB, ou \u00AB avis Alnaseem \u00BB. Ce sont des requetes d'intention d'achat \u2014 la personne cherche activement."),

space(),
simpleTable(
  ["Parametre", "Detail"],
  [
    [{ text: "Fréquence", bold: true }, "12 Shorts par mois (repurpose TikTok) + 2 videos longues (3-7 minutes)"],
    [{ text: "Videos longues", bold: true }, "\u00AB On goûté TOUTES les saveurs Alnaseem \u00BB / \u00AB Le Clean Finale apres le couscous \u00BB / \u00AB Blind test en famille \u00BB / \u00AB 5 recettes dessert avec Alnaseem \u00BB"],
    [{ text: "SEO", bold: true }, "Titres avec mots-cles, miniatures vibrantes, descriptions riches, tags en arabe + francais"],
    [{ text: "Objectif à 6 mois", bold: true }, "1 000 abonnes, 50K vues cumulees par mois, 3 videos dans le top 10 Google"],
  ],
  [2800, 6560]
),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Facebook \u2014 Le convertisseur familial", font: "Montserrat" })] }),

p("Facebook est le socle existant d'Alnaseem (239K likes \u2014 #2 du marché). Sur cette plateforme, l'objectif n'est pas la viralite mais la **conversion** : convaincre la famille que ce soir, le dessert c'est Alnaseem, et lui dire où l'acheter."),

p("La base existante de 239 000 likes est un actif considérable. Le probleme n'est pas la taille de la communaute mais la qualite du contenu : des product shots sans ame, des promos sans engagement. En pivotant le contenu vers le \u00AB dessert en famille \u00BB et les sondages saveurs, on peut réactiver cette communaute dormante."),

space(),
simpleTable(
  ["Parametre", "Detail"],
  [
    [{ text: "Fréquence", bold: true }, "20 posts par mois + campagnes Ads en continu"],
    [{ text: "Mix mensuel", bold: true }, "6 engagement (sondages, votes) / 4 recettes video / 4 moments famille / 3 promos-lancements / 2 jeux-concours / 1 humour derja"],
    [{ text: "Ads funnel", bold: true }, "Awareness (video saveurs, cible large 18-45) \u2192 Engagement (carousel saveurs, retarget) \u2192 Conversion (géolocalisé par ville, drive-to-store)"],
    [{ text: "Objectif à 6 mois", bold: true }, "+50% reach mensuel sur base 239K, engagement rate >3%"],
  ],
  [2800, 6560]
),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Volumes consolides", font: "Montserrat" })] }),

p("Au total, le plan media prévoit environ **110 contenus par mois**, mais seulement **35 contenus uniques** a produire. Le reste est du repurpose intelligent cross-plateforme : un seul tournage génère un TikTok + un Reel Instagram + un YouTube Short + un post Facebook = 4 contenus."),

space(),
simpleTable(
  ["Plateforme", "Contenus/mois", "Role dans le funnel"],
  [
    ["TikTok", "20 videos", "Découverte"],
    ["Instagram", "57 (15 feed + 12 Reels + 30 Stories)", "Curiosite + Desir"],
    ["YouTube", "14 (12 Shorts + 2 longues)", "SEO long terme"],
    ["Facebook", "20 posts + Ads", "Conversion famille"],
    [{ text: "TOTAL", bold: true, bg: BG_BLUE }, { text: "~110 contenus/mois (35 uniques)", bold: true, bg: BG_BLUE }, { text: "Funnel complet", bold: true, bg: BG_BLUE }],
  ],
  [2500, 4360, 2500]
),

// ============================================================
// CHAPITRE 6 — PILIERS DE CONTENU
// ============================================================
new Paragraph({ children: [new PageBreak()] }),
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Chapitre 6 \u2014 Les 5 piliers de contenu", font: "Montserrat" })] }),

p("Tout contenu Alnaseem rentre dans l'un de ces 5 piliers. Cette structure garantit l'équilibre entre les deux piliers de la plateforme et empêche la derive vers le \u00AB tout promotionnel \u00BB qui tue l'engagement."),

space(),
simpleTable(
  ["Pilier", "%", "Description"],
  [
    [{ text: "Le Clean Finale", bold: true, bg: BG_MANGO }, { text: "25%", bold: true, bg: BG_MANGO }, { text: "Apres le repas, Alnaseem lave le palais. Scenes post-couscous, post-ojja, post-kafteji. Le rituel quotidien. Ce pilier ancré le Blue Ocean.", bg: BG_MANGO }],
    [{ text: "Découverte & saveurs", bold: true, bg: BG_BLUE }, { text: "25%", bold: true, bg: BG_BLUE }, { text: "\"T'as déjà goûté le cotton candy en cone?\" Taste tests, blind tests, reactions. Chaque saveur = un contenu viral en puissance.", bg: BG_BLUE }],
    [{ text: "Sweet Moments", bold: true, bg: BG_RED }, { text: "20%", bold: true, bg: BG_RED }, { text: "Le pilier émotionnel : fetes, anniversaires, sorties. Fun, célébratif, partageable. Ce pilier maintient le Red Ocean.", bg: BG_RED }],
    [{ text: "Recettes & Kyroo", bold: true, bg: BG_PURPLE }, { text: "20%", bold: true, bg: BG_PURPLE }, { text: "Recettes dessert (coupes, verrines, milkshakes) + saga Kyroo \"le livreur de dessert\". Contenu à forte valeur de save.", bg: BG_PURPLE }],
    [{ text: "Produit & promo", bold: true }, "10%", "Lancements de saveurs, promos ponctuelles. Maximum 10% du contenu \u2014 on inspire, on ne pousse pas."],
  ],
  [2200, 800, 6360]
),

// ============================================================
// CHAPITRE 7 — EXEMPLES
// ============================================================
new Paragraph({ children: [new PageBreak()] }),
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Chapitre 7 \u2014 Exemples concrets de contenu", font: "Montserrat" })] }),

p("Voici des exemples concrets de ce que produira Alnaseem sur chaque plateforme. Ces exemples illustrent comment les deux piliers se traduisent en contenus reels, engageants, et adaptes à chaque audience."),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: "TikTok \u2014 \u00AB Ba3d el Kafteji \u2014 el Clean Finale \u00BB", font: "Montserrat" })] }),
new Paragraph({ alignment: AlignmentType.CENTER, children: [img("clean_finale.jpg", 450, 300)] }),
space(),
p("**Pilier : Clean Finale | Format : TikTok 25 secondes**"),
p("Scene : une table tunisienne apres le repas. Restes de kafteji. La personne dit face camera : \u00AB El palais yektalni. N7ebb 7aja tnadhafli kol chi. \u00BB Elle ouvre un pot Alnaseem cotton candy. Première cuillere. Ferme les yeux. \u00AB Hadhi mech glace. Hadhi RESET button lel palais. \u00BB"),
p("**Hashtags :** #CleanFinale #SweetenYourEveryday #fyp", { color: ORANGE }),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: "TikTok \u2014 \u00AB 3 gouts eli ma fammetech fi Tounes \u00BB", font: "Montserrat" })] }),
new Paragraph({ alignment: AlignmentType.CENTER, children: [img("saveurs.jpg", 380, 380)] }),
space(),
p("**Pilier : Découverte saveurs | Format : TikTok 25 secondes**"),
p("3 cones alignes devant la camera : cotton candy (rose), bubble gum (bleu), banana peel (jaune). \u00AB 3 gouts eli ma fammetech fi 7atta marca okhra fi Tounes. Le dernier va te choquer. \u00BB Taste test un par un. Notes affichees à l'ecran. Le banana peel obtient 10/10. \u00AB Enti lehi te5tar? 9olli fi commentaire. \u00BB"),
p("**Hashtags :** #JamaisGouteCa #AlnaseemDessert #tunisie", { color: ORANGE }),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: "Instagram Reel \u2014 \u00AB Avant el the, le Clean Finale. \u00BB", font: "Montserrat" })] }),
new Paragraph({ alignment: AlignmentType.CENTER, children: [img("dessert_famille.jpg", 450, 300)] }),
space(),
p("**Pilier : Clean Finale | Format : Reel Instagram 15 secondes**"),
p("Plan serre : des assiettes vides de couscous. Des mains qui posent un bol avec des boules Alnaseem (mangue + vanille). Slow motion sur la cuillere qui plonge. Texte overlay : \u00AB Ce soir, le Clean Finale c'est Alnaseem. \u00BB Pas de voix off \u2014 que le visuel et la musique."),
p("**Hashtags :** #SweetenYourEveryday #CleanFinale #FinDeRepas", { color: ORANGE }),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: "Facebook \u2014 \u00AB El 3id bla Alnaseem? Impossible. \u00BB", font: "Montserrat" })] }),
p("**Pilier : Sweet Moments | Format : Post image + sondage**"),
p("Photo : une table de fete tunisienne, des enfants autour de glaces colorees, des ballons. Texte : \u00AB El gout eli lazem ykoun fi KOL fete? Vote : Cotton Candy / Banana / Mangue. Commentaire. \u00BB L'objectif est de génèrer des commentaires massifs (l'algorithme Facebook favorise les posts a haut volume de commentaires)."),
p("**Hashtags :** #SweetMoments #AlnaseemMoment #Fete", { color: ORANGE }),

space(),
new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: "Script YouTube \u2014 \u00AB Le Clean Finale apres le Couscous \u00BB (5 minutes)", font: "Montserrat" })] }),
p("Ce format de video longue est conçu pour le SEO et la reutilisation. Il se positionné sur les requetes \u00AB glace Tunisie \u00BB et \u00AB dessert apres le repas \u00BB."),
space(),
colorBox([
  p("**[INTRO 0:00-0:30]** Une table avec un vrai couscous tunisien qui fume encore. 3 personnes attablees. \u00AB On vient de manger el couscous te3 ommi. El palais ynawwedh. Nhar el yom, on va tester un nouveau rituel : une glace AVANT el the, comme Clean Finale. \u00BB", { color: WHITE }),
  p("", { color: WHITE }),
  p("**[LE TEST 0:30-4:00]** Chaque personne goûté une saveur differente apres le couscous. Reactions filmees en gros plan. Cotton candy : \u00AB El sucre nettoie el gras... ca marche?! \u00BB. Banana peel : \u00AB Kima menthe mais en version dessert. \u00BB. Mangue : \u00AB La acidite te3ha... PARFAIT ba3d el couscous. \u00BB Chaque saveur recoit une note. Graphique à l'ecran.", { color: WHITE }),
  p("", { color: WHITE }),
  p("**[VERDICT 4:00-5:00]** \u00AB La glace avant el the? Franchement... c'est devenu indispensable. C'est frais, c'est doux, ca nettoie le palais. C'est le Clean Finale \u2014 et el the apres, c'est encore meilleur. \u00BB Tableau recapitulatif : quelle saveur pour quel plat tunisien (couscous \u2192 mangue, ojja \u2192 cotton candy, kafteji \u2192 banana peel).", { color: WHITE }),
  p("", { color: WHITE }),
  p("**[OUTRO 5:00-5:30]** \u00AB Jrab w 9olli \u2014 c'est quoi TON Clean Finale? Like + abonne-toi bech matchawedch el prochaine video. \u00BB", { color: WHITE }),
], NAVY),

// ============================================================
// CHAPITRE 8 — INFLUENCE
// ============================================================
new Paragraph({ children: [new PageBreak()] }),
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Chapitre 8 \u2014 Stratégie d'influence", font: "Montserrat" })] }),

p("L'influence n'est pas un complement \u2014 c'est un **accelerateur structurel** de la stratégie. En Tunisie, la confiance passe par les personnes, pas par les marques. Un influenceur qui filme sa reaction authentique en goutant du cotton candy pour la première fois a plus d'impact que n'importe quelle publicite."),

p("Le brief est volontairement simple et identique pour tous les niveaux d'influence. Il ne s'agit pas de lire un script \u2014 il s'agit de **vivre le moment** :"),

space(),
colorBox([
  p("**Le brief unique :**", { size: 24, bold: true, color: WHITE }),
  p("\u00AB Mange ton plat prefere. Puis goûté Alnaseem. Filme ta reaction. C'est le Clean Finale. \u00BB", { size: 26, bold: true, color: WHITE, align: AlignmentType.CENTER }),
], NAVY),

space(),
p("Ce brief fonctionne parce qu'il est **authentique par design** : la reaction à une saveur jamais goutee est forcement sincere. Pas besoin de script, pas besoin de mise en scene \u2014 la surprise est réelle."),

space(),
simpleTable(
  ["Niveau", "Volume par campagne", "Brief spécifique", "Profils cibles"],
  [
    [{ text: "Macro (100K-500K)", bold: true }, "2-3 influenceurs", "Le Clean Finale apres leur plat prefere. Reaction face camera.", "Food creators, lifestyle, entertainment"],
    [{ text: "Micro (10K-100K)", bold: true }, "10-15 influenceurs", "Blind test saveurs en famille apres le repas. Deviner les gouts.", "Food bloggers, jeunes mamans, couples"],
    [{ text: "Nano (<10K)", bold: true }, "30-50 influenceurs", "Challenge #CleanFinale : filme ton dessert de ce soir avec Alnaseem.", "Etudiants foodie, familles, createurs locaux"],
  ],
  [2200, 1700, 3200, 2260]
),

space(),
p("**L'objectif cumule sur 6 mois : 50+ collaborations** qui génèrent un effet boule de neige. Chaque collaboration produit du contenu reutilisable (repost sur les comptes Alnaseem), de la credibilite sociale (preuve par les pairs), et de la découverte organique (les followers de l'influenceur decouvrent la marque)."),

// ============================================================
// CHAPITRE 9 — PHASES
// ============================================================
new Paragraph({ children: [new PageBreak()] }),
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Chapitre 9 \u2014 Phases de déploiement", font: "Montserrat" })] }),

p("Le déploiement se fait en 3 phases sur 7-8 mois, avec une montee en puissance progressive qui permet d'ajuster la stratégie en fonction des resultats de chaque phase."),

space(),
colorBox([
  p("**Phase 1 \u2014 FONDATION (2 mois)**", { size: 26, bold: true, color: WHITE }),
  p("\u00AB Installer le Clean Finale dans l'esprit des Tunisiens \u00BB", { color: WHITE, italics: true }),
  p("Le timing idéal est le Ramadan : c'est LE mois où les Tunisiens pensent le plus au dessert post-ftour. Le concept de Clean Finale prend tout son sens quand chaque soir, apres un repas copieux, la question se pose : \u00AB On prend quoi comme dessert? \u00BB", { color: WHITE }),
  p("", { color: WHITE }),
  bullet("Setup comptes TikTok + YouTube, refonte complète Instagram"),
  bullet("Charte éditoriale \u00AB Sweeten your EVERYDAY \u00BB finalisee"),
  bullet("Identification et contact des 15 premiers influenceurs food/famille"),
  bullet("Serie Ramadan : \u00AB Le Clean Finale apres el ftour \u00BB (5-8 recettes)"),
  bullet("Production : 10 TikToks + 8 Reels + 1 video YouTube longue"),
  bullet("5 premières collaborations influenceurs \u00AB Clean Finale \u00BB"),
  bullet("Première campagne Ads awareness Facebook"),
], NAVY),

space(),
colorBox([
  p("**Phase 2 \u2014 ACCÉLÉRATION (2 mois)**", { size: 26, bold: true }),
  p("\u00AB Les saveurs dont tout le monde parle \u00BB", { italics: true }),
  p("La phase 2 capitalise sur l'attention génèree en phase 1. L'objectif est d'amplifier : plus de contenu, plus d'influenceurs, et le lancement de la Saga Kyroo qui construit l'univers de marque."),
  p(""),
  bullet("4-5 TikToks par semaine \u2014 focus taste tests saveurs différenciantes"),
  bullet("Saga Kyroo \u00AB le livreur de dessert \u00BB : 1 episode par semaine"),
  bullet("Serie \u00AB T'as déjà goûté ca en Tunisie? \u00BB (1 saveur par video)"),
  bullet("10-15 micro-influenceurs actifs en simultane"),
  bullet("Story Takeovers Instagram par des influenceurs food"),
  bullet("Lancement des Ads Facebook drive-to-store par ville"),
  bullet("2 videos YouTube longues (review complète + recettes Clean Finale)"),
], BG_BLUE),

space(),
colorBox([
  p("**Phase 3 \u2014 DOMINATION (4 mois)**", { size: 26, bold: true }),
  p("\u00AB Alnaseem = LE dessert + LA fete \u00BB", { italics: true }),
  p("La phase 3 correspond à la saison estivale. C'est le moment de deployer le **double message** : le Clean Finale (Blue Ocean) ET les célébrations (Red Ocean). Alnaseem est sur les deux fronts en même temps \u2014 c'est le Grand Ecart en action."),
  p(""),
  bullet("Challenge #CleanFinale à grande échelle sur TikTok"),
  bullet("Activation des macro-influenceurs (2-3) + 30-50 nano-influenceurs"),
  bullet("Double message été : Clean Finale + Sweet Moments en parallele"),
  bullet("Events terrain (degustations en supermarche, presence festivals)"),
  bullet("Concours \u00AB La meilleure recette Clean Finale \u00BB"),
  bullet("4 videos YouTube longues (best-of, edition speciale ete)"),
  bullet("Bilan complet + preparation du plan automne/hiver (desaisonnalisation totale)"),
], BG_MANGO),

// ============================================================
// CHAPITRE 10 — KPI
// ============================================================
new Paragraph({ children: [new PageBreak()] }),
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Chapitre 10 \u2014 KPI & objectifs", font: "Montserrat" })] }),

p("Les objectifs sont calibrés pour être ambitieux mais realistes, en tenant compte du fait qu'Alnaseem part de quasi-zero sur TikTok, Instagram et YouTube. La base Facebook existante (239K) offre un avantage de démarrage sur cette plateforme."),

space(),
simpleTable(
  ["KPI", "Situation actuelle", "Phase 1 (M+2)", "Phase 2 (M+4)", "Phase 3 (M+7)"],
  [
    [{ text: "TikTok followers", bold: true }, "0", "2 000", "10 000", { text: "50 000", bold: true, color: GREEN }],
    [{ text: "Instagram followers", bold: true }, "~faible", "3 000", "10 000", { text: "30 000", bold: true, color: GREEN }],
    [{ text: "YouTube abonnes", bold: true }, "0", "100", "400", { text: "1 000", bold: true, color: GREEN }],
    [{ text: "Facebook reach mensuel", bold: true }, "Base", "+15%", "+30%", { text: "+50%", bold: true, color: GREEN }],
    [{ text: "Contenus produits/mois", bold: true }, "~10", "60", "90", { text: "110", bold: true, color: GREEN }],
    [{ text: "Collabs influenceurs (cumul)", bold: true }, "0", "5", "20", { text: "50+", bold: true, color: GREEN }],
    [{ text: "Mentions #CleanFinale", bold: true }, "0", "100", "500", { text: "2 000+", bold: true, color: GREEN }],
  ],
  [2400, 1500, 1500, 1500, 2460]
),

// ============================================================
// CHAPITRE 11 — RISQUES
// ============================================================
new Paragraph({ children: [new PageBreak()] }),
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Chapitre 11 \u2014 Risques & mitigations", font: "Montserrat" })] }),

p("Toute stratégie comporte des risques. L'important n'est pas de les eviter mais de les anticiper et de préparer des reponses adaptees. Voici les principaux risques identifiés et les mitigations prévues :"),

space(),
simpleTable(
  ["Risque", "Impact", "Mitigation"],
  [
    [{ text: "Un concurrent copie le positionnement Clean Finale", bold: true }, "Eleve", "L'avantage du premier occupant est considérable : celui qui installe le concept dans l'esprit du public le possède. De plus, les saveurs exclusives d'Alnaseem constituent une barriere à l'entree que les concurrents ne peuvent pas répliquer rapidement."],
    [{ text: "Perception de \"marque etrangere\"", bold: true }, "Eleve", "Le ton 100% derja, les références culinaires ancrées (couscous, kafteji, ojja), et le recours à des influenceurs exclusivement tunisiens creent un ancrage local fort. Le storytelling est tunisien avant tout."],
    [{ text: "Le concept \"apres-repas\" pas compris", bold: true }, "Moyen", "La répétition massive du message Clean Finale sur toutes les plateformes, combinee à l'influence structurée, installera le concept progressivement. Le Ramadan est le moment idéal pour l'ancrer."],
    [{ text: "Un concurrent lance TikTok avant nous", bold: true }, "Moyen", "Meme s'ils y vont en premier, leur contenu sera générique (product shots estivaux). Le notre est fondamentalement différencié (Clean Finale + saveurs exclusives). Le contenu prime sur la chronologie."],
    [{ text: "Creux de consommation en hiver", bold: true }, "Faible", "C'est precisement l'avantage du positionnement Clean Finale : on mange du couscous en hiver aussi. Le concept est désaisonnalisé par nature. Contenus hiver : \u00AB dessert chaud-froid \u00BB (affogato, etc.)."],
  ],
  [2500, 900, 5960]
),

// ============================================================
// CONCLUSION
// ============================================================
new Paragraph({ children: [new PageBreak()] }),
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Conclusion \u2014 De l'occasionnel à la nécessité", font: "Montserrat" })] }),

p("Cette stratégie repose sur une conviction simple : **Alnaseem à tout ce qu'il faut pour devenir la marque de glace #1 en Tunisie**. Le catalogue produit est superieur (199+ produits, 7 saveurs exclusives). La base Facebook est solide (239K). La mascotte Kyroo à un potentiel viral inexploite. Il ne manque qu'une chose : un positionnement qui sort du lot."),

p("\u00AB Sweeten your EVERYDAY \u00BB est ce positionnement. Il permet à Alnaseem d'occuper **deux territoires simultanément** \u2014 celui des célébrations (où tout le monde est déjà) et celui du rituel quotidien (où personne n'est encore). C'est un avantage structurel que la concurrence ne pourra pas répliquer facilement."),

space(),
bigQuote("\u00AB On ne demande plus la permission d'exister lors d'une fete. On s'impose a table tous les jours. \u00BB"),
space(),

new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [4680, 4680],
  rows: [new TableRow({ children: [
    new TableCell({ borders: noBorders, shading: { fill: BG_RED, type: ShadingType.CLEAR }, width: { size: 4680, type: WidthType.DXA }, margins: { top: 200, bottom: 200, left: 200, right: 200 },
      children: [
        p("**Ce qu'on garde**", { size: 26, color: RED }),
        bullet("Les anniversaires, les fetes, la plage"),
        bullet("Le plaisir partage, la joie collective"),
        bullet("La base Facebook de 239K"),
        bullet("La mascotte Kyroo"),
        space(),
        p("**Le Red Ocean = notre base arriere.**", { bold: true, color: RED }),
      ]
    }),
    new TableCell({ borders: noBorders, shading: { fill: BG_BLUE, type: ShadingType.CLEAR }, width: { size: 4680, type: WidthType.DXA }, margins: { top: 200, bottom: 200, left: 200, right: 200 },
      children: [
        p("**Ce qu'on ajoute**", { size: 26, color: BLUE }),
        bullet("Le rituel quotidien \u00AB apres le repas \u00BB"),
        bullet("Le Clean Finale \u2014 le concept qui change tout"),
        bullet("TikTok, YouTube, Instagram \u2014 rebuilds depuis zero"),
        bullet("Les saveurs différenciantes comme arme de communication"),
        space(),
        p("**Le Blue Ocean = notre croissance.**", { bold: true, color: BLUE }),
      ]
    }),
  ]})]
}),

space(),
colorBox([
  p("**Prochaines etapes**", { size: 26, bold: true, color: WHITE }),
  p("", { color: WHITE }),
  numbered("**Validation** de la stratégie par Alnaseem"),
  numbered("**Setup comptes** TikTok + YouTube + refonte Instagram"),
  numbered("**Charte éditoriale** \u00AB Sweeten your EVERYDAY \u00BB finalisee"),
  numbered("**Shortlist influenceurs** : 15 micro food/famille + 30 nano"),
  numbered("**Production premiers contenus** \u2014 taste tests + Clean Finale + Kyroo"),
  numbered("**Lancement Phase 1**"),
], NAVY),

      ]}]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/Users/MAEmcPro/Projects/ennasim/docs/2026-03-23_stratégie_digitale_alnaseem.docx", buffer);
  console.log("DOCX génère! Taille:", Math.round(buffer.length / 1024) + "KB");
});
