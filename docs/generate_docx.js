const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, PageBreak, PageNumber
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
const BG_LIGHT = "F5F7FA";
const BG_BLUE = "E1F5FE";
const BG_RED = "FFEBEE";
const BG_MANGO = "FFF8E1";
const BG_ORANGE = "FFF0EC";
const BG_GREEN = "E8F5E9";
const BG_PURPLE = "F3E5F5";
const WHITE = "FFFFFF";

function img(name, w, h) {
  return new ImageRun({
    type: "jpg",
    data: fs.readFileSync(IMG + name),
    transformation: { width: w, height: h },
    altText: { title: name, description: name, name: name }
  });
}

function logo() {
  return new ImageRun({
    type: "png",
    data: fs.readFileSync(LOGO_ACCESS),
    transformation: { width: 120, height: 120 },
    altText: { title: "Alnaseem", description: "Logo", name: "logo" }
  });
}

const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function heading(text, level) {
  return new Paragraph({ heading: level, children: [new TextRun({ text, font: "Montserrat" })] });
}

function h1(text) { return heading(text, HeadingLevel.HEADING_1); }
function h2(text) { return heading(text, HeadingLevel.HEADING_2); }
function h3(text) { return heading(text, HeadingLevel.HEADING_3); }

function p(text, opts = {}) {
  const runs = [];
  // Support bold fragments with **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true, font: "Montserrat", size: opts.size || 22, color: opts.color }));
    } else {
      runs.push(new TextRun({ text: part, font: "Montserrat", size: opts.size || 22, color: opts.color, bold: opts.bold, italics: opts.italics }));
    }
  }
  return new Paragraph({ spacing: { after: 120 }, alignment: opts.align, children: runs });
}

function bigQuote(text) {
  return new Paragraph({
    spacing: { before: 300, after: 300 },
    indent: { left: 400, right: 400 },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: ORANGE } },
    children: [new TextRun({ text, font: "Montserrat", size: 28, bold: true, color: NAVY, italics: true })]
  });
}

function bulletItem(text, ref = "bullets") {
  const runs = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true, font: "Montserrat", size: 22 }));
    } else {
      runs.push(new TextRun({ text: part, font: "Montserrat", size: 22 }));
    }
  }
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 60 }, children: runs });
}

function numberedItem(text, ref = "numbers") {
  const runs = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true, font: "Montserrat", size: 22 }));
    } else {
      runs.push(new TextRun({ text: part, font: "Montserrat", size: 22 }));
    }
  }
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 60 }, children: runs });
}

function tableRow(cells, headerRow = false) {
  return new TableRow({
    children: cells.map((c, i) => new TableCell({
      borders,
      margins: cellMargins,
      width: { size: c.width || 4680, type: WidthType.DXA },
      shading: headerRow ? { fill: NAVY, type: ShadingType.CLEAR } : (c.bg ? { fill: c.bg, type: ShadingType.CLEAR } : undefined),
      children: [new Paragraph({
        children: [new TextRun({
          text: c.text,
          font: "Montserrat",
          size: 20,
          bold: headerRow || c.bold,
          color: headerRow ? WHITE : (c.color || NAVY)
        })]
      })]
    }))
  });
}

function simpleTable(headers, rows, colWidths) {
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      tableRow(headers.map((h, i) => ({ text: h, width: colWidths[i] })), true),
      ...rows.map(row => tableRow(row.map((c, i) => ({
        text: typeof c === "string" ? c : c.text,
        width: colWidths[i],
        bold: typeof c === "object" ? c.bold : false,
        bg: typeof c === "object" ? c.bg : undefined,
        color: typeof c === "object" ? c.color : undefined
      }))))
    ]
  });
}

function colorBox(text, bgColor) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: noBorders,
        margins: { top: 200, bottom: 200, left: 300, right: 300 },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        width: { size: 9360, type: WidthType.DXA },
        children: typeof text === "string"
          ? [p(text, { size: 22 })]
          : text
      })]
    })]
  });
}

function sectionLabel(text, color = NAVY) {
  return new Paragraph({
    spacing: { before: 100, after: 40 },
    children: [new TextRun({ text: text.toUpperCase(), font: "Montserrat", size: 16, bold: true, color: WHITE })]
  });
}

// ============================
// BUILD DOCUMENT
// ============================

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Montserrat", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Montserrat", color: NAVY },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Montserrat", color: NAVY },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Montserrat", color: ORANGE },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    // ===== COVER PAGE =====
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 0, right: 0, bottom: 0, left: 0 } }
      },
      children: [
        new Table({
          width: { size: 12240, type: WidthType.DXA },
          columnWidths: [12240],
          rows: [new TableRow({
            height: { value: 15840, rule: "exact" },
            children: [new TableCell({
              borders: noBorders,
              shading: { fill: NAVY, type: ShadingType.CLEAR },
              width: { size: 12240, type: WidthType.DXA },
              verticalAlign: "center",
              margins: { top: 400, bottom: 400, left: 1200, right: 1200 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [logo()] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
                  new TextRun({ text: "STRATEGIE DIGITALE 2026", font: "Montserrat", size: 20, color: ORANGE, bold: true })
                ]}),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
                  new TextRun({ text: "Alnaseem", font: "Montserrat", size: 56, bold: true, color: WHITE }),
                ]}),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
                  new TextRun({ text: "Sweeten your EVERYDAY", font: "Montserrat", size: 40, bold: true, color: ORANGE }),
                ]}),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [
                  new TextRun({ text: "De l'occasionnel a la necessite", font: "Montserrat", size: 24, color: "AAAAAA", italics: true }),
                ]}),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
                  new TextRun({ text: "Access Content Agency — access.tn", font: "Montserrat", size: 18, color: "888888" }),
                ]}),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [
                  new TextRun({ text: "Mars 2026 | Confidentiel", font: "Montserrat", size: 16, color: "888888" }),
                ]}),
              ]
            })]
          })]
        })
      ]
    },

    // ===== MAIN CONTENT =====
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({ children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: ORANGE } },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "Alnaseem — Sweeten your EVERYDAY", font: "Montserrat", size: 16, color: MUTED }),
              new TextRun({ text: "\t" }),
              new TextRun({ text: "Access Content Agency", font: "Montserrat", size: 16, color: MUTED }),
            ]
          })
        ]})
      },
      footers: {
        default: new Footer({ children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" } },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Confidentiel — ", font: "Montserrat", size: 16, color: MUTED }),
              new TextRun({ text: "Page ", font: "Montserrat", size: 16, color: MUTED }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Montserrat", size: 16, color: MUTED })
            ]
          })
        ]})
      },
      children: [
        // ===== CHAPTER 1 =====
        h1("Chapitre 1 — L'enfer du Red Ocean"),
        p("Le marche tunisien de la glace est une arene saturee ou tout le monde se bat pour les memes miettes."),
        p(""),
        colorBox([
          p("**Le territoire encombre**", { size: 24, bold: true }),
          p("Selja, Ice Vegas, Eskimo, Paname et les artisans se disputent le meme creneau : le **\"Moment Plaisir\"** — sorties au parc, anniversaires, plage, canicule. C'est une consommation **occasionnelle, meteo-dependante et volatile**. Si Alnaseem reste la, elle n'est qu'une option parmi d'autres dans un congelateur bonde."),
        ], BG_RED),

        p(""),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [img("plv_alnaseem.jpg", 300, 500)] }),
        p("Le presentoir actuel en point de vente — positionne \"achat impulsif\", pas \"dessert\"", { size: 18, color: MUTED, align: AlignmentType.CENTER }),
        p(""),

        bigQuote("\"On se bat pour des parts de voix dans un secteur qui s'arrete de respirer des que le thermometre descend ou que la fete est finie.\""),

        p(""),
        simpleTable(
          ["Facteur", "Realite", "Impact"],
          [
            ["Saisonnalite", "5 mois actifs (mai-sept)", "7 mois sans chiffre d'affaires digital"],
            ["Concurrence", "5+ marques, meme message", "Course au budget — le plus riche gagne"],
            ["Differenciation", "Tous disent \"plaisir, partage, ete\"", "Le consommateur ne voit aucune difference"],
            ["Vulnerabilite", "Meteo + occasion dependant", "Un ete pluvieux = saison perdue"],
          ],
          [2500, 3430, 3430]
        ),

        // ===== CHAPTER 2 =====
        new Paragraph({ children: [new PageBreak()] }),
        h1("Chapitre 2 — Le pivot strategique : l'invasion du Blue Ocean"),
        p("On ne va pas abandonner le Red Ocean. On va s'en servir comme **base arriere**. Mais la croissance massive se trouve dans le detournement d'une habitude culturelle ancree."),
        p(""),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [img("clean_finale.jpg", 550, 370)] }),
        p(""),

        colorBox([
          p("**L'observation de terrain**", { size: 24, bold: true }),
          p("Apres un **Kafteji bien piquant**, un **Couscous gras** ou une **Ojja qui brule**, le Tunisien cherche desesperement a \"laver\" son palais. Qu'est-ce qu'il prend ? Du the. Un soda. Une mousse au chocolat. Parfois une cigarette."),
          p("**Et si la reponse, c'etait Alnaseem ?**", { color: BLUE }),
        ], BG_BLUE),

        p(""),
        colorBox([
          p("**Le Hijacking culturel — nos vrais concurrents**", { size: 24, bold: true, color: WHITE }),
          p("Le concurrent d'Alnaseem n'est plus Selja ou Ice Vegas :", { color: WHITE }),
          p(""),
          bulletItem("Le the post-repas — lourd, chaud, lent a preparer"),
          bulletItem("Le soda qui decape — chimique, gazeux, pas gourmand"),
          bulletItem("La mousse au chocolat — lourde, rajoute du gras au gras"),
          bulletItem("La cigarette — le \"faux digestif\" a eliminer"),
          p(""),
          p("**Alnaseem remplace tout ca. Frais, onctueux, des saveurs qui nettoient le palais. C'est le \"Clean Finale\".**", { color: WHITE, align: AlignmentType.CENTER }),
        ], NAVY),

        p(""),
        bigQuote("\"On ne vend pas du sucre. On vend la fin de la sensation de gras et de sel. On vend le Clean Finale.\""),

        // ===== CHAPTER 3 =====
        new Paragraph({ children: [new PageBreak()] }),
        h1("Chapitre 3 — La plateforme : \"Sweeten your EVERYDAY\""),
        p("Un pied dans chaque monde. L'occasionnel ET la necessite quotidienne."),
        p(""),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [img("dualisme.jpg", 550, 310)] }),
        p(""),

        // Dual ocean table
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 4680],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders: noBorders, shading: { fill: BG_RED, type: ShadingType.CLEAR }, width: { size: 4680, type: WidthType.DXA }, margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [
                  p("\"Sweetening the Moments\"", { size: 26, bold: true, color: RED }),
                  p("Pilier Emotionnel — Le Red Ocean, on y reste", { size: 18, italics: true, color: MUTED }),
                  p(""),
                  bulletItem("**Quand :** Pique-niques, anniversaires, sorties plage, fetes"),
                  bulletItem("**Cible :** L'animal social — celui qui partage et celebre"),
                  bulletItem("**Focus :** Joie partagee, celebration"),
                  bulletItem("**Ton :** Fun, festif, communautaire"),
                ]
              }),
              new TableCell({ borders: noBorders, shading: { fill: BG_BLUE, type: ShadingType.CLEAR }, width: { size: 4680, type: WidthType.DXA }, margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [
                  p("\"Sweetening the Routine\"", { size: 26, bold: true, color: BLUE }),
                  p("Pilier Fonctionnel — Le Blue Ocean, la revolution", { size: 18, italics: true, color: MUTED }),
                  p(""),
                  bulletItem("**Quand :** Apres-dejeuner, apres-diner, sortie de bureau"),
                  bulletItem("**Cible :** Le gourmand habitue — celui qui cherche son rituel"),
                  bulletItem("**Focus :** Le Clean Finale"),
                  bulletItem("**Ton :** Gourmand, rituel, complice, quotidien"),
                ]
              }),
            ]}),
          ]
        }),

        p(""),
        h3("L'arme secrete : des saveurs que personne d'autre n'a"),
        p("Alnaseem possede un arsenal de saveurs **introuvables chez les concurrents tunisiens** :"),
        p(""),
        simpleTable(
          ["Saveur", "Format", "Concurrent?"],
          [
            [{ text: "Cotton Candy", bold: true }, "Cone Kyroo 120ml", { text: "AUCUN", color: RED, bold: true }],
            [{ text: "Bubble Gum", bold: true }, "Cone Kyroo 120ml", { text: "AUCUN", color: RED, bold: true }],
            [{ text: "Banana Peel", bold: true }, "Stick Kyroo 75ml", { text: "AUCUN", color: RED, bold: true }],
            [{ text: "Mangue", bold: true }, "Waterstick ICY, Molla, Sorbet Gil'ice", { text: "AUCUN", color: RED, bold: true }],
            [{ text: "Ananas", bold: true }, "Double Layer Twins 64ml", { text: "AUCUN", color: RED, bold: true }],
            [{ text: "Passion fruit", bold: true }, "Greek Mango Passion 140g", { text: "AUCUN", color: RED, bold: true }],
            [{ text: "Caramelo", bold: true }, "Gusto Stick", { text: "AUCUN", color: RED, bold: true }],
          ],
          [2800, 4060, 2500]
        ),

        p(""),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [img("saveurs.jpg", 450, 450)] }),
        p(""),

        bigQuote("\"Nous elargissons le territoire d'Alnaseem, passant du parc d'attractions a la table a manger. En proposant de Sweeten your EVERYDAY, nous transformons la fin de chaque repas en une raison d'acheter.\""),

        // ===== CHAPTER 4 =====
        new Paragraph({ children: [new PageBreak()] }),
        h1("Chapitre 4 — Ligne editoriale"),

        colorBox([
          p("**Regle d'or**", { size: 26, bold: true, color: WHITE }),
          p("Chaque contenu sert l'un des deux piliers — ou les deux. Pas de contenu qui ne parle ni de \"celebration\" ni de \"rituel quotidien\".", { color: WHITE }),
        ], NAVY),

        p(""),
        h3("Ton par pilier"),
        simpleTable(
          ["Pilier Emotionnel (Red)", "Pilier Fonctionnel (Blue)"],
          [
            ["Fun, festif, communautaire", "Gourmand, rituel, complice, malin"],
            ["Challenges, partages, tags, humour", "Taste tests, recettes, \"apres le repas\""],
            ["\"Marque ton pote\", \"Qui vient?\"", "\"El Clean Finale\", \"Oublie el the\""],
            ["Musique trending, couleurs vives", "Gros plans textures, ASMR food"],
          ],
          [4680, 4680]
        ),

        p(""),
        h3("DO / DON'T"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 4680],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders: noBorders, shading: { fill: BG_GREEN, type: ShadingType.CLEAR }, width: { size: 4680, type: WidthType.DXA }, margins: cellMargins,
                children: [
                  p("**DO**", { size: 24, color: GREEN }),
                  bulletItem("\"Sweeten your everyday\""),
                  bulletItem("\"Des saveurs introuvables en Tunisie\""),
                  bulletItem("\"Le Clean Finale\" apres kafteji/couscous/ojja"),
                  bulletItem("Derja authentique, ASMR food"),
                  bulletItem("Contenu ancre dans la culture TN"),
                ]
              }),
              new TableCell({ borders: noBorders, shading: { fill: BG_RED, type: ShadingType.CLEAR }, width: { size: 4680, type: WidthType.DXA }, margins: cellMargins,
                children: [
                  p("**DON'T**", { size: 24, color: RED }),
                  bulletItem("\"Glace de l'ete\" comme seul message"),
                  bulletItem("Product shots sans mise en scene"),
                  bulletItem("Arabe litteraire"),
                  bulletItem("Comparaison directe avec concurrents"),
                  bulletItem("Promos agressives \"ACHETEZ\""),
                ]
              }),
            ]}),
          ]
        }),

        p(""),
        h3("Hashtags officiels"),
        simpleTable(
          ["Usage", "Hashtags"],
          [
            [{ text: "Plateforme", bold: true }, "#SweetenYourEveryday (sur TOUT contenu)"],
            [{ text: "Clean Finale", bold: true }, "#CleanFinale #ApresLeRepas"],
            [{ text: "Decouverte", bold: true }, "#JamaisGouteCa #TasDejaTeste"],
            [{ text: "Par saveur", bold: true }, "#AlnaseemCottonCandy #AlnaseemBanana #AlnaseemMangue..."],
            [{ text: "Celebrations", bold: true }, "#AlnaseemMoment #SweetMoments"],
          ],
          [3000, 6360]
        ),

        // ===== CHAPTER 5 =====
        new Paragraph({ children: [new PageBreak()] }),
        h1("Chapitre 5 — Plan media : parcours de l'utilisateur"),
        p("Comment une personne decouvre Alnaseem, s'engage, et entre dans le rituel quotidien."),
        p(""),

        h3("Le funnel media"),
        simpleTable(
          ["Etape", "Objectif", "Plateforme"],
          [
            [{ text: "DECOUVERTE", bold: true, bg: NAVY, color: WHITE }, "\"C'est quoi ce gout?\"", "TikTok + YouTube Shorts"],
            [{ text: "CURIOSITE", bold: true, bg: BLUE, color: WHITE }, "\"Je veux en savoir plus\"", "Instagram Reels + Stories"],
            [{ text: "DESIR", bold: true, bg: ORANGE, color: WHITE }, "\"Ce soir, c'est Alnaseem\"", "Instagram Feed + Facebook"],
            [{ text: "ACHAT", bold: true, bg: GREEN, color: WHITE }, "\"Ou je trouve?\"", "Facebook Ads geolocalise"],
            [{ text: "RITUEL", bold: true, bg: MANGO, color: WHITE }, "\"C'est MON dessert\"", "UGC + Communaute #CleanFinale"],
          ],
          [2200, 3580, 3580]
        ),

        p(""),
        h3("TikTok — Le declencheur"),
        simpleTable(
          ["", ""],
          [
            [{ text: "Frequence", bold: true }, "4-5 videos/semaine (20/mois)"],
            [{ text: "Duree", bold: true }, "15-45 secondes"],
            [{ text: "Horaires", bold: true }, "12h-14h + 20h-22h (moments \"dessert\")"],
            [{ text: "Mix mensuel", bold: true }, "6 taste tests / 5 Clean Finale / 3 Kyroo / 4 recettes / 2 celebrations"],
            [{ text: "Optimisation", bold: true }, "Hook 2s, musique trending, CTA commentaire"],
            [{ text: "Objectif M+6", bold: true }, "50K followers"],
          ],
          [2500, 6860]
        ),

        p(""),
        h3("Instagram — La vitrine"),
        simpleTable(
          ["", ""],
          [
            [{ text: "Frequence", bold: true }, "15 feed + 12 Reels + 30 Stories / mois"],
            [{ text: "Horaires", bold: true }, "Feed 11h-13h / Stories 3x/jour / Reels 19h-21h"],
            [{ text: "Optimisation", bold: true }, "Saves > Likes (recettes \"saveable\"), Stickers Stories interactifs"],
            [{ text: "Objectif M+6", bold: true }, "30K followers, >4% engagement"],
          ],
          [2500, 6860]
        ),

        p(""),
        h3("YouTube — Le moteur long terme"),
        simpleTable(
          ["", ""],
          [
            [{ text: "Frequence", bold: true }, "12 Shorts/mois (repurpose) + 2 videos longues/mois"],
            [{ text: "Videos longues", bold: true }, "\"On goute TOUT\" / \"Clean Finale apres le couscous\" / \"Blind test famille\""],
            [{ text: "SEO", bold: true }, "\"glace Tunisie\", \"recette dessert\", \"Alnaseem\" — duree de vie illimitee"],
            [{ text: "Objectif M+6", bold: true }, "1K abonnes, 50K vues/mois"],
          ],
          [2500, 6860]
        ),

        p(""),
        h3("Facebook — Le convertisseur"),
        simpleTable(
          ["", ""],
          [
            [{ text: "Frequence", bold: true }, "20 posts/mois + Ads continus"],
            [{ text: "Mix", bold: true }, "6 engagement / 4 recettes / 4 famille / 3 promos / 2 jeux / 1 humour"],
            [{ text: "Ads funnel", bold: true }, "Awareness (video saveurs) > Engagement (carousel) > Conversion (geolocalise)"],
            [{ text: "Objectif M+6", bold: true }, "+50% reach (base 239K)"],
          ],
          [2500, 6860]
        ),

        p(""),
        h3("Volumes consolides"),
        simpleTable(
          ["Plateforme", "Contenus/mois", "Role funnel"],
          [
            ["TikTok", "20 videos", "Decouverte"],
            ["Instagram", "57 (15 feed + 12 Reels + 30 Stories)", "Curiosite + Desir"],
            ["YouTube", "14 (12 Shorts + 2 longues)", "SEO long terme"],
            ["Facebook", "20 posts + Ads", "Conversion famille"],
            [{ text: "TOTAL", bold: true, bg: BG_BLUE }, { text: "~110 contenus/mois (35 uniques)", bold: true, bg: BG_BLUE }, { text: "Funnel complet", bold: true, bg: BG_BLUE }],
          ],
          [2500, 4360, 2500]
        ),

        // ===== CHAPTER 6 =====
        new Paragraph({ children: [new PageBreak()] }),
        h1("Chapitre 6 — Les 5 piliers de contenu"),
        p(""),
        simpleTable(
          ["Pilier", "%", "Description"],
          [
            [{ text: "Le Clean Finale", bold: true, bg: BG_MANGO }, { text: "25%", bold: true, bg: BG_MANGO }, { text: "Apres le repas, Alnaseem lave le palais. Scenes post-couscous, post-ojja.", bg: BG_MANGO }],
            [{ text: "Decouverte saveurs", bold: true, bg: BG_BLUE }, { text: "25%", bold: true, bg: BG_BLUE }, { text: "Taste tests, blind tests, reactions. Chaque saveur = un contenu.", bg: BG_BLUE }],
            [{ text: "Sweet Moments", bold: true, bg: BG_RED }, { text: "20%", bold: true, bg: BG_RED }, { text: "Fetes, anniversaires, sorties. Fun, celebratif, partageable.", bg: BG_RED }],
            [{ text: "Recettes & Kyroo", bold: true, bg: BG_PURPLE }, { text: "20%", bold: true, bg: BG_PURPLE }, { text: "Recettes dessert + saga Kyroo \"le livreur de dessert\".", bg: BG_PURPLE }],
            [{ text: "Produit & promo", bold: true }, "10%", "Lancements, promos. Maximum 10%."],
          ],
          [2500, 1000, 5860]
        ),

        // ===== CHAPTER 7 =====
        new Paragraph({ children: [new PageBreak()] }),
        h1("Chapitre 7 — Exemples de contenu"),
        p(""),

        h3("TikTok — \"Ba3d el Kafteji — el Clean Finale\""),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [img("clean_finale.jpg", 450, 300)] }),
        p("Table debarrassee, restes de kafteji. \"El palais yektalni.\" Ouvre Alnaseem cotton candy. Premiere cuillere. \"Hadhi mech glace. Hadhi RESET button lel palais.\""),
        p("#CleanFinale #SweetenYourEveryday #fyp", { color: ORANGE }),
        p(""),

        h3("TikTok — \"3 gouts eli ma fammetech fi Tounes\""),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [img("saveurs.jpg", 400, 400)] }),
        p("3 cones : cotton candy, bubble gum, banana peel. \"Le dernier va te choquer.\" Taste test. Notes. \"Enti lehi te5tar?\""),
        p("#JamaisGouteCa #AlnaseemDessert #tunisie", { color: ORANGE }),
        p(""),

        h3("Instagram — \"Oublie el the. Upgrade ton apres-repas.\""),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [img("dessert_famille.jpg", 450, 300)] }),
        p("Assiettes vides de couscous. Bol Alnaseem. Slow motion cuillere. \"Ce soir, le Clean Finale c'est Alnaseem.\""),
        p("#SweetenYourEveryday #CleanFinale", { color: ORANGE }),
        p(""),

        h3("Script YouTube : \"Le Clean Finale apres le Couscous\""),
        colorBox([
          p("**[INTRO 0:00-0:30]** Table : vrai couscous, fume encore. \"On va tester SI une glace peut remplacer el the comme digestif.\"", { color: WHITE }),
          p("**[LE TEST 0:30-4:00]** Chaque personne goute une saveur. Cotton candy : \"El sucre nettoie el gras!\" / Banana : \"Kima menthe mais en version dessert\" / Mangue : \"PARFAIT ba3d el couscous\"", { color: WHITE }),
          p("**[VERDICT 4:00-5:00]** \"La glace remplace el the? OUI. C'est le Clean Finale.\" Tableau : quelle saveur pour quel plat.", { color: WHITE }),
          p("**[OUTRO]** \"C'est quoi TON Clean Finale? Like + abonne-toi.\"", { color: WHITE }),
        ], NAVY),

        // ===== CHAPTER 8 =====
        new Paragraph({ children: [new PageBreak()] }),
        h1("Chapitre 8 — Strategie d'influence"),

        colorBox([
          p("**Le brief unique pour tous les influenceurs :**", { size: 24, color: WHITE }),
          p("\"Mange ton plat prefere. Puis goute Alnaseem. Filme ta reaction. C'est le Clean Finale.\"", { size: 26, bold: true, color: WHITE, align: AlignmentType.CENTER }),
        ], NAVY),

        p(""),
        simpleTable(
          ["Niveau", "Quantite", "Brief", "Profils"],
          [
            [{ text: "Macro (100K-500K)", bold: true }, "2-3 / campagne", "Clean Finale apres plat prefere", "Food creators, lifestyle"],
            [{ text: "Micro (10K-100K)", bold: true }, "10-15 / campagne", "Blind test saveurs en famille", "Food bloggers, mamans, couples"],
            [{ text: "Nano (<10K)", bold: true }, "30-50 / campagne", "Challenge #CleanFinale", "Etudiants, familles, createurs locaux"],
          ],
          [2200, 1700, 3200, 2260]
        ),

        // ===== CHAPTER 9 =====
        new Paragraph({ children: [new PageBreak()] }),
        h1("Chapitre 9 — Phases de deploiement"),
        p(""),

        colorBox([
          p("**Phase 1 — FONDATION** (2 mois)", { size: 26, color: WHITE }),
          p("\"Installer le Clean Finale\" — Timing : Ramadan (le mois ou on pense au dessert post-ftour)", { color: WHITE }),
          p("", { color: WHITE }),
          bulletItem("Setup TikTok + YouTube + refonte Instagram"),
          bulletItem("Charte editoriale \"Sweeten your EVERYDAY\" finalisee"),
          bulletItem("15 influenceurs food identifies"),
          bulletItem("Serie Ramadan : \"Clean Finale apres el ftour\""),
          bulletItem("10 TikToks + 8 Reels + 1 video YouTube longue"),
          bulletItem("5 premieres collabs influenceurs"),
        ], NAVY),

        p(""),
        colorBox([
          p("**Phase 2 — ACCELERATION** (2 mois)", { size: 26 }),
          p("\"Les saveurs dont tout le monde parle\""),
          p(""),
          bulletItem("4-5 TikToks/semaine — taste tests + Clean Finale"),
          bulletItem("Saga Kyroo \"le livreur de dessert\" (1/semaine)"),
          bulletItem("10-15 micro-influenceurs actifs"),
          bulletItem("Ads Facebook drive-to-store par ville"),
          bulletItem("Pilier Sweet Moments pour les fetes de printemps"),
        ], BG_BLUE),

        p(""),
        colorBox([
          p("**Phase 3 — DOMINATION** (4 mois)", { size: 26 }),
          p("\"Alnaseem = LE dessert + LA fete\""),
          p(""),
          bulletItem("Challenge #CleanFinale a grande echelle"),
          bulletItem("Macro-influenceurs + 30-50 nano-influenceurs"),
          bulletItem("Double message ete : Clean Finale + Sweet Moments"),
          bulletItem("Events terrain (degustations, festivals)"),
          bulletItem("4 videos YouTube longues"),
          bulletItem("Bilan + plan automne/hiver"),
        ], BG_MANGO),

        // ===== CHAPTER 10 =====
        new Paragraph({ children: [new PageBreak()] }),
        h1("Chapitre 10 — KPI & objectifs"),
        p(""),
        simpleTable(
          ["KPI", "Actuel", "Phase 1", "Phase 2", "Phase 3"],
          [
            [{ text: "TikTok followers", bold: true }, "0", "2 000", "10 000", { text: "50 000", bold: true, color: GREEN }],
            [{ text: "Instagram followers", bold: true }, "~faible", "3 000", "10 000", { text: "30 000", bold: true, color: GREEN }],
            [{ text: "YouTube abonnes", bold: true }, "0", "100", "400", { text: "1 000", bold: true, color: GREEN }],
            [{ text: "Facebook reach", bold: true }, "Base", "+15%", "+30%", { text: "+50%", bold: true, color: GREEN }],
            [{ text: "Contenus/mois", bold: true }, "~10", "60", "90", { text: "110", bold: true, color: GREEN }],
            [{ text: "Collabs influenceurs", bold: true }, "0", "5", "20", { text: "50+", bold: true, color: GREEN }],
            [{ text: "#CleanFinale mentions", bold: true }, "0", "100", "500", { text: "2000+", bold: true, color: GREEN }],
          ],
          [2200, 1500, 1600, 1600, 2460]
        ),

        // ===== CHAPTER 11 =====
        new Paragraph({ children: [new PageBreak()] }),
        h1("Chapitre 11 — Risques & mitigations"),
        p(""),
        simpleTable(
          ["Risque", "Impact", "Mitigation"],
          [
            ["Concurrent copie le Clean Finale", "Eleve", "Premier occupant + saveurs exclusives = barriere"],
            ["Perception \"marque etrangere\"", "Eleve", "Derja, references culinaires TN, influenceurs locaux"],
            ["Concept pas compris", "Moyen", "Repetition massive + ancrage dans des plats tunisiens reels"],
            ["Concurrent lance TikTok avant", "Moyen", "Notre contenu est plus differencie"],
            ["Creux hiver", "Faible", "On mange du couscous en hiver aussi — le Clean Finale est desaisonnalise"],
          ],
          [3000, 1200, 5160]
        ),

        // ===== CONCLUSION =====
        new Paragraph({ children: [new PageBreak()] }),
        h1("Conclusion — De l'occasionnel a la necessite"),
        p(""),
        bigQuote("\"On ne demande plus la permission d'exister lors d'une fete. On s'impose a table tous les jours.\""),
        p(""),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 4680],
          rows: [new TableRow({ children: [
            new TableCell({ borders: noBorders, shading: { fill: BG_RED, type: ShadingType.CLEAR }, width: { size: 4680, type: WidthType.DXA }, margins: { top: 200, bottom: 200, left: 200, right: 200 },
              children: [
                p("**Ce qu'on garde**", { size: 26, color: RED }),
                bulletItem("Anniversaires, fetes, plage"),
                bulletItem("Plaisir partage, joie collective"),
                bulletItem("Base Facebook 239K"),
                bulletItem("Mascotte Kyroo"),
                p("**Le Red Ocean = notre base arriere**", { size: 20, bold: true, color: RED }),
              ]
            }),
            new TableCell({ borders: noBorders, shading: { fill: BG_BLUE, type: ShadingType.CLEAR }, width: { size: 4680, type: WidthType.DXA }, margins: { top: 200, bottom: 200, left: 200, right: 200 },
              children: [
                p("**Ce qu'on ajoute**", { size: 26, color: BLUE }),
                bulletItem("Le rituel quotidien \"apres le repas\""),
                bulletItem("Le Clean Finale"),
                bulletItem("TikTok + YouTube + Instagram"),
                bulletItem("Les saveurs differenciantes"),
                p("**Le Blue Ocean = notre croissance**", { size: 20, bold: true, color: BLUE }),
              ]
            }),
          ]})]
        }),

        p(""),
        colorBox([
          p("**Prochaines etapes**", { size: 26, bold: true, color: WHITE }),
          numberedItem("**Validation** de la strategie par Alnaseem"),
          numberedItem("**Setup comptes** TikTok + YouTube + refonte Instagram"),
          numberedItem("**Charte editoriale** \"Sweeten your EVERYDAY\" finalisee"),
          numberedItem("**Shortlist influenceurs** : 15 micro + 30 nano"),
          numberedItem("**Production premiers contenus**"),
          numberedItem("**Lancement Phase 1**"),
        ], NAVY),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/Users/MAEmcPro/Projects/ennasim/docs/2026-03-23_strategie_digitale_alnaseem.docx", buffer);
  console.log("DOCX genere avec succes!");
  console.log("Taille:", Math.round(buffer.length / 1024) + "KB");
});
