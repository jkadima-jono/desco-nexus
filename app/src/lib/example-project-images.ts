import type { Locale } from "@/lib/i18n";

export type ExampleProjectImage = {
  id: string;
  url: string;
  caption: string;
  isExample: true;
  kind?: "example" | "regional";
};

const CAPTIONS: Record<Exclude<Locale, "en">, Record<string, string>> = {
  fr: {
    "regional-port-de-ndomba": "Image régionale du fleuve en RDC fournie par DESCO. Localisation exacte du projet non confirmée.",
    "regional-port-de-kasenga": "Image régionale du fleuve en RDC fournie par DESCO. Localisation exacte du projet non confirmée.",
    "regional-comicordia-mining": "Image régionale de terrain en RDC fournie par DESCO. Localisation exacte du projet non confirmée.",
    "regional-agridesco-grand-kasai": "Image agricole régionale en RDC fournie par DESCO. Localisation exacte du projet non confirmée.",
    "regional-manioc-plant": "Image agricole régionale en RDC fournie par DESCO. Localisation exacte du projet non confirmée.",
    "example-phardesco-mbuji-mayi": "Concept illustratif de centre de santé. Il ne s’agit ni d’une photographie du projet ni d’une preuve.",
    "regional-tilu-pepm-8252": "Image régionale d’une voie d’accès en RDC fournie par DESCO. Localisation exacte du projet non confirmée.",
    "regional-sciress-kolwezi-12423": "Image régionale de terrain en RDC fournie par DESCO. Localisation exacte du projet non confirmée.",
    "regional-kasaji-kisenge-solar": "Concept illustratif d’infrastructure solaire. Il ne s’agit ni d’une photographie du projet ni d’une preuve du site.",
    "regional-waterdesco-grand-kasai": "Paysage fluvial régional en RDC fourni par DESCO. Localisation exacte du projet et source d’eau non confirmées.",
    "example-ldc-integrated-housing": "Concept illustratif d’infrastructure urbaine. Le rendu et les photographies propres au projet restent à fournir ; cette image ne constitue pas une preuve.",
    "regional-energulf-lotshi": "Concept illustratif d’exploration énergétique. Il ne s’agit ni d’une photographie du bloc de Lotshi ni d’une preuve de licence.",
  },
  es: {
    "regional-port-de-ndomba": "Imagen regional de un río en la RDC facilitada por DESCO. Ubicación exacta del proyecto no confirmada.",
    "regional-port-de-kasenga": "Imagen regional de un río en la RDC facilitada por DESCO. Ubicación exacta del proyecto no confirmada.",
    "regional-comicordia-mining": "Imagen regional de terreno en la RDC facilitada por DESCO. Ubicación exacta del proyecto no confirmada.",
    "regional-agridesco-grand-kasai": "Imagen agrícola regional en la RDC facilitada por DESCO. Ubicación exacta del proyecto no confirmada.",
    "regional-manioc-plant": "Imagen agrícola regional en la RDC facilitada por DESCO. Ubicación exacta del proyecto no confirmada.",
    "example-phardesco-mbuji-mayi": "Concepto ilustrativo de centro sanitario. No es una fotografía del proyecto ni constituye evidencia.",
    "regional-tilu-pepm-8252": "Imagen regional de una vía de acceso en la RDC facilitada por DESCO. Ubicación exacta del proyecto no confirmada.",
    "regional-sciress-kolwezi-12423": "Imagen regional de terreno en la RDC facilitada por DESCO. Ubicación exacta del proyecto no confirmada.",
    "regional-kasaji-kisenge-solar": "Concepto ilustrativo de infraestructura solar. No es una fotografía del proyecto ni constituye evidencia del emplazamiento.",
    "regional-waterdesco-grand-kasai": "Paisaje fluvial regional de la RDC facilitado por DESCO. Ubicación exacta del proyecto y fuente de agua no confirmadas.",
    "example-ldc-integrated-housing": "Concepto ilustrativo de infraestructura urbana. La representación y las fotografías específicas del proyecto están pendientes; no constituye evidencia.",
    "regional-energulf-lotshi": "Concepto ilustrativo de exploración energética. No es una fotografía del bloque Lotshi ni constituye evidencia de la licencia.",
  },
  pt: {
    "regional-port-de-ndomba": "Imagem regional de um rio na RDC fornecida pela DESCO. Localização exata do projeto não confirmada.",
    "regional-port-de-kasenga": "Imagem regional de um rio na RDC fornecida pela DESCO. Localização exata do projeto não confirmada.",
    "regional-comicordia-mining": "Imagem regional de terreno na RDC fornecida pela DESCO. Localização exata do projeto não confirmada.",
    "regional-agridesco-grand-kasai": "Imagem agrícola regional na RDC fornecida pela DESCO. Localização exata do projeto não confirmada.",
    "regional-manioc-plant": "Imagem agrícola regional na RDC fornecida pela DESCO. Localização exata do projeto não confirmada.",
    "example-phardesco-mbuji-mayi": "Conceito ilustrativo de centro de saúde. Não é uma fotografia do projeto nem constitui evidência.",
    "regional-tilu-pepm-8252": "Imagem regional de uma via de acesso na RDC fornecida pela DESCO. Localização exata do projeto não confirmada.",
    "regional-sciress-kolwezi-12423": "Imagem regional de terreno na RDC fornecida pela DESCO. Localização exata do projeto não confirmada.",
    "regional-kasaji-kisenge-solar": "Conceito ilustrativo de infraestrutura solar. Não é uma fotografia do projeto nem constitui evidência do local.",
    "regional-waterdesco-grand-kasai": "Paisagem fluvial regional da RDC fornecida pela DESCO. Localização exata do projeto e fonte de água não confirmadas.",
    "example-ldc-integrated-housing": "Conceito ilustrativo de infraestrutura urbana. A representação e as fotografias específicas do projeto estão pendentes; não constitui evidência.",
    "regional-energulf-lotshi": "Conceito ilustrativo de exploração energética. Não é uma fotografia do bloco Lotshi nem constitui evidência da licença.",
  },
  zh: {
    "regional-port-de-ndomba": "DESCO 提供的刚果民主共和国区域河流图片。项目确切位置尚未确认。",
    "regional-port-de-kasenga": "DESCO 提供的刚果民主共和国区域河流图片。项目确切位置尚未确认。",
    "regional-comicordia-mining": "DESCO 提供的刚果民主共和国区域地貌图片。项目确切位置尚未确认。",
    "regional-agridesco-grand-kasai": "DESCO 提供的刚果民主共和国区域农业图片。项目确切位置尚未确认。",
    "regional-manioc-plant": "DESCO 提供的刚果民主共和国区域农业图片。项目确切位置尚未确认。",
    "example-phardesco-mbuji-mayi": "医疗中心示意图。并非项目实景照片，亦不构成项目证据。",
    "regional-tilu-pepm-8252": "DESCO 提供的刚果民主共和国区域道路图片。项目确切位置尚未确认。",
    "regional-sciress-kolwezi-12423": "DESCO 提供的刚果民主共和国区域地貌图片。项目确切位置尚未确认。",
    "regional-kasaji-kisenge-solar": "太阳能基础设施示意图。并非项目实景照片，亦不构成场址证据。",
    "regional-waterdesco-grand-kasai": "DESCO 提供的刚果民主共和国区域河流景观图片。项目确切位置及水源尚未确认。",
    "example-ldc-integrated-housing": "城市基础设施示意图。项目专属效果图及现场照片尚待提供；本图不构成项目证据。",
    "regional-energulf-lotshi": "能源勘探示意图。并非 Lotshi 区块实景照片，亦不构成许可证证据。",
  },
};

const EXAMPLES: Record<string, ExampleProjectImage[]> = {
  "port-de-ndomba": [{
    id: "regional-port-de-ndomba",
    url: "/project-media/desco-drc/port-ndomba-river.jpg",
    caption: "DESCO-supplied regional DRC river image. Exact project location unconfirmed.",
    isExample: true,
    kind: "regional",
  }],
  "port-de-kasenga": [{
    id: "regional-port-de-kasenga",
    url: "/project-media/desco-drc/port-kasenga-river.jpg",
    caption: "DESCO-supplied regional DRC river image. Exact project location unconfirmed.",
    isExample: true,
    kind: "regional",
  }],
  "comicordia-mining": [{
    id: "regional-comicordia-mining",
    url: "/project-media/desco-drc/comicordia-terrain.jpg",
    caption: "DESCO-supplied regional DRC terrain image. Exact project location unconfirmed.",
    isExample: true,
    kind: "regional",
  }],
  "comicordia-agri": [{
    id: "regional-agridesco-grand-kasai",
    url: "/project-media/desco-drc/agridesco-grand-kasai.jpg",
    caption: "DESCO-supplied regional DRC agricultural image. Exact project location unconfirmed.",
    isExample: true,
    kind: "regional",
  }],
  "manioc-plant": [{
    id: "regional-manioc-plant",
    url: "/project-media/desco-drc/manioc-agriculture.jpg",
    caption: "DESCO-supplied regional DRC agricultural image. Exact project location unconfirmed.",
    isExample: true,
    kind: "regional",
  }],
  "phardesco-mbuji-mayi": [{
    id: "example-phardesco-mbuji-mayi",
    url: "/examples/project-healthcare.svg",
    caption: "Illustrative healthcare-hub concept. Not a project photograph or evidence.",
    isExample: true,
  }],
  "tilu-pepm-8252": [{
    id: "regional-tilu-pepm-8252",
    url: "/project-media/desco-drc/tilu-access-road.jpg",
    caption: "DESCO-supplied regional DRC access-road image. Exact project location unconfirmed.",
    isExample: true,
    kind: "regional",
  }],
  "sciress-kolwezi-12423": [{
    id: "regional-sciress-kolwezi-12423",
    url: "/project-media/desco-drc/scires-terrain.jpg",
    caption: "DESCO-supplied regional DRC terrain image. Exact project location unconfirmed.",
    isExample: true,
    kind: "regional",
  }],
  "kasaji-kisenge-solar-50mw": [{
    id: "regional-kasaji-kisenge-solar",
    url: "/examples/project-solar.svg",
    caption: "Illustrative solar-infrastructure concept; not evidence of the proposed site.",
    isExample: true,
  }],
  "waterdesco-grand-kasai": [{
    id: "regional-waterdesco-grand-kasai",
    url: "/project-media/desco-drc/waterdesco-grand-kasai-regional.jpg",
    caption: "DESCO-supplied regional DRC river landscape. Exact project location and water source unconfirmed.",
    isExample: true,
    kind: "regional",
  }],
  "ldc-integrated-housing-drc": [{
    id: "example-ldc-integrated-housing",
    url: "/examples/project-housing.svg",
    caption: "Illustrative urban-infrastructure concept. Project-specific rendering and site photography are pending; this is not evidence.",
    isExample: true,
  }],
  "energulf-lotshi-block": [{
    id: "regional-energulf-lotshi",
    url: "/examples/project-energy-exploration.svg",
    caption: "Illustrative energy-exploration concept; not evidence of the Lotshi block or licence standing.",
    isExample: true,
  }],
};

export function exampleProjectImages(listingId: string): ExampleProjectImage[] {
  return EXAMPLES[listingId] ?? [];
}

export function localizeExampleProjectImageCaption(
  imageId: string,
  englishCaption: string | null,
  locale: Locale,
): string {
  return locale === "en" ? englishCaption ?? "" : CAPTIONS[locale][imageId] ?? englishCaption ?? "";
}
