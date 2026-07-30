export type ExampleProjectImage = {
  id: string;
  url: string;
  caption: string;
  isExample: true;
  kind?: "example" | "regional";
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
    url: "/project-media/desco-drc/kasaji-kisenge-regional.jpg",
    caption: "DESCO-supplied regional DRC landscape. Exact project location unconfirmed; not evidence of the proposed solar site.",
    isExample: true,
    kind: "regional",
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
    url: "/project-media/desco-drc/energulf-lotshi-regional.jpg",
    caption: "DESCO-supplied regional DRC terrain. Exact relationship to the Lotshi block is unconfirmed; not evidence of the licence area.",
    isExample: true,
    kind: "regional",
  }],
};

export function exampleProjectImages(listingId: string): ExampleProjectImage[] {
  return EXAMPLES[listingId] ?? [];
}
