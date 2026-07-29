export type ExampleProjectImage = {
  id: string;
  url: string;
  caption: string;
  isExample: true;
};

const EXAMPLES: Record<string, ExampleProjectImage[]> = {
  "port-de-ndomba": [{
    id: "example-port-de-ndomba",
    url: "/examples/project-port.svg",
    caption: "Replaceable example visual · river-port concept · not project evidence",
    isExample: true,
  }],
  "port-de-kasenga": [{
    id: "example-port-de-kasenga",
    url: "/examples/project-port.svg",
    caption: "Replaceable example visual · cross-border port concept · not project evidence",
    isExample: true,
  }],
  "comicordia-mining": [{
    id: "example-comicordia-mining",
    url: "/examples/project-mining.svg",
    caption: "Replaceable example visual · mining-site concept · not project evidence",
    isExample: true,
  }],
  "comicordia-agri": [{
    id: "example-comicordia-agri",
    url: "/examples/project-agriculture.svg",
    caption: "Replaceable example visual · agricultural platform concept · not project evidence",
    isExample: true,
  }],
  "manioc-plant": [{
    id: "example-manioc-plant",
    url: "/examples/project-agriculture.svg",
    caption: "Replaceable example visual · processing-facility concept · not project evidence",
    isExample: true,
  }],
  "phardesco-mbuji-mayi": [{
    id: "example-phardesco-mbuji-mayi",
    url: "/examples/project-healthcare.svg",
    caption: "Replaceable example visual · community-health hub concept · not project evidence",
    isExample: true,
  }],
  "tilu-pepm-8252": [{
    id: "example-tilu-pepm-8252",
    url: "/examples/project-mining.svg",
    caption: "Replaceable example visual · exploration prospect · not project evidence",
    isExample: true,
  }],
  "sciress-kolwezi-12423": [{
    id: "example-sciress-kolwezi-12423",
    url: "/examples/project-mining.svg",
    caption: "Replaceable example visual · mining permit opportunity · not project evidence",
    isExample: true,
  }],
};

export function exampleProjectImages(listingId: string): ExampleProjectImage[] {
  return EXAMPLES[listingId] ?? [];
}
