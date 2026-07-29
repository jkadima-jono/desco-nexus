import type { Listing } from "@/lib/data";
import type { EvidenceField, InvestmentEvidence } from "@/lib/investment-evidence";
import type { Locale } from "@/lib/i18n";

type ListingText = Pick<Listing, "sector" | "country" | "instrument" | "stage" | "irr" | "summary" | "highlights" | "whyMatch">;
type ListingTranslations = Record<Exclude<Locale, "en">, Record<string, ListingText>>;

const fr = {
  "port-de-ndomba": {
    sector: "Infrastructure", country: "RDC", instrument: "SPV de projet — participation majoritaire de DESCO", stage: "Faisabilité déclarée par le porteur", irr: "Inclus dans l’objectif de TRI de 17,2 % du programme Phase 1 de DESCO Global",
    summary: "Le porteur propose un port fluvial sur la rivière Kasaï pour relier le Grand Kasaï à Kinshasa et aux voies d’exportation. Les travaux envisagés comprennent quai, dragage, postes d’amarrage, entrepôts, silos, services de carburant, douanes et contrôle d’accès numérique. Les preuves de faisabilité, droits, permis, demande, coûts et calendrier ne sont pas publiques.",
    highlights: ["Le porteur déclare disposer d’une étude de faisabilité achevée", "Objectif du porteur : 1 200 emplois de construction et 450 emplois permanents", "Cadre déclaré : normes de performance IFC, plan biodiversité et pacte communautaire ; preuves non publiques"],
    whyMatch: "Infrastructure logistique de la plateforme Kasaï de DESCO Global, destinée à faciliter les exportations des pôles agricole et minier.",
  },
  "port-de-kasenga": {
    sector: "Infrastructure", country: "RDC", instrument: "SPV de projet — participation majoritaire de DESCO", stage: "Structuration", irr: "Inclus dans l’objectif de TRI de 17,2 % du programme Phase 1 de DESCO Global",
    summary: "Le porteur propose un port sur le lac Moero pour soutenir le commerce avec la Zambie et les liaisons vers l’Angola. Il vise 300 000 tonnes par an et une réduction de 40 % du délai de dédouanement ; les études justificatives ne sont pas publiques.",
    highlights: ["Objectif de débit : 300 000 tonnes par an", "Liaison transfrontalière avec la Zambie (Copperbelt) et l’Angola", "Objectif du porteur : réduction de 40 % du délai de dédouanement ; étude non publique"],
    whyMatch: "Actif de corridor régional complémentaire au Port de Ndomba dans la plateforme logistique intégrée de DESCO Global.",
  },
  "comicordia-mining": {
    sector: "Mines", country: "RDC", instrument: "Coentreprise proposée ; conditions publiques non communiquées", stage: "Géologie historique et planification minière conceptuelle", irr: "Non communiqué publiquement",
    summary: "Comicordia propose de passer progressivement d’une activité artisanale à une récupération semi-mécanisée d’or et de diamants près de Luiza et Musefu. Le dossier comprend un rapport géologique de 2017 sur PR 13578, une proposition d’octobre 2024 et une note conceptuelle de coûts. Ces documents indiquent un potentiel et un concept, sans établir de ressource actuelle, de durée de mine confirmée ni d’économie vérifiée indépendamment.",
    highlights: ["Le rapport 2017 couvre PR 13578, décrit comme huit carrés miniers sur environ 6,8 km²", "Les documents historiques évoquent un potentiel aurifère alluvial, éluvial et rocheux, ainsi qu’un potentiel diamantifère", "La note recommande un démarrage progressif et indique que la durée de la mine n’est pas confirmée"],
    whyMatch: "Opportunité Investdesco précoce pour des investisseurs capables de financer les diligences titre, géologie, faisabilité et environnement.",
  },
  "comicordia-agri": {
    sector: "Agriculture", country: "RDC", instrument: "Allocation du pôle Agridesco (30 % du programme Phase 1 de 750 M$)", stage: "Informations d’exploitation fournies", irr: "Inclus dans l’objectif de TRI de 17,2 % du programme Phase 1 de DESCO Global",
    summary: "Plateforme agricole proposée au centre de la RDC, organisant les petits producteurs en réseaux avec crédit d’intrants, mécanisation partagée, stockage et transformation du maïs, manioc et soja, afin de les relier à des accords d’achat proposés à prix transparents.",
    highlights: ["Déclaration du porteur : plus de 50 000 agriculteurs et 25 000 hectares ; preuves et date non publiques", "Déclaration : plus de 40 villages et hausse de revenu de 45 % ; méthode et date non publiques", "Emploi déclaré : 10 000 femmes ; preuve de mesure non publique"],
    whyMatch: "Opportunité agricole nécessitant de valider la portée auprès des agriculteurs, l’accès au foncier, les achats, les sauvegardes et l’impact déclaré.",
  },
  "manioc-plant": {
    sector: "Agriculture", country: "RDC", instrument: "Fonds propres et financement d’équipements", stage: "Pré-construction", irr: "Modèle du porteur : environ 15 444 $ par lot de 2 000 kg ; hypothèses non examinées indépendamment",
    summary: "Les documents décrivent une usine de lyophilisation de quatre hectares près de Kimwenza, alimentée en feuilles de manioc de Mont Ngafula et du Kongo Central. Ils indiquent une conservation d’environ dix ans et une distribution par vendeurs et dépôts ; essais produit, demande et validation ne sont pas publics.",
    highlights: ["Site de 4 hectares avec énergie solaire, chaîne du froid et traitement d’eau", "Produit lyophilisé annoncé stable environ 10 ans", "Distribution fondée sur des vendeuses de marché"],
    whyMatch: "Actif Agridesco de petite taille, avec plan de construction chiffré et canal de distribution identifié.",
  },
  "phardesco-mbuji-mayi": {
    sector: "Santé", country: "RDC", instrument: "IFD et fonds propres à impact (levée initiale de 5 à 10 M$)", stage: "Pré-lancement", irr: "Prévision à 5 ans : seuil de rentabilité EBITDA en année 2 et +3,8 M$ en année 5",
    summary: "Premier Pharmalab Hub proposé par Phardesco : un centre solaire réunissant pharmacie, diagnostic, eau potable et éducation sanitaire dans le Grand Kasaï. Les documents du porteur indiquent environ un pharmacien pour 50 000 habitants contre une référence OMS de 1 pour 2 000.",
    highlights: ["Premier d’un réseau prévu de plus de 10 centres à moyen terme et de plus de 50 d’ici 2035", "Énergie solaire, chaîne du froid et production générique conforme aux BPF envisagée", "Des financeurs potentiels sont cités ; aucune participation ni engagement n’est confirmé"],
    whyMatch: "Plateforme d’accès aux soins en phase initiale, ancrant le pôle Phardesco dans sa région fondatrice.",
  },
  "tilu-pepm-8252": {
    sector: "Mines", country: "RDC", instrument: "Besoin en capital d’exploration non communiqué publiquement", stage: "Données historiques d’exploration — statut actuel du titre non vérifié", irr: "Non communiqué publiquement",
    summary: "Prospect cuivre-cobalt précoce dans le territoire de Manono. Une étude historique rapporte des travaux géochimiques réalisés en 2010 sur PEPM 8252, dont 933 échantillons de sol. Elle recommande cartographie structurale, tranchées et forage avant toute définition de ressource. Propriété, validité et renouvellement du permis n’ont pas été vérifiés indépendamment.",
    highlights: ["L’étude historique rapporte 933 échantillons sur 24 lignes nord-sud", "Elle signale des anomalies cuivre-cobalt ; aucune ressource ni réserve n’est communiquée", "Cartographie, tranchées et forage d’exploration restent recommandés"],
    whyMatch: "Opportunité minière Investdesco précoce pour des investisseurs capables d’évaluer les risques géologiques et de titre avant ressource.",
  },
  "sciress-kolwezi-12423": {
    sector: "Mines", country: "RDC", instrument: "Fonds propres, coentreprise ou financement d’achat proposés, sous réserve de diligence et de conditions définitives", stage: "Exploration avant ressource et acquisition de permis proposée", irr: "Illustration du porteur : TRI cible de 35 % ; aucune ressource conforme, faisabilité ni modèle examiné indépendamment",
    summary: "Scires Mining propose d’acquérir et développer PE 12423, projet d’exploration cobalt-cuivre au Lualaba. Une présentation de décembre 2025 décrit forages, tranchées et échantillonnage historiques et un plan de 45 M$ en deux étapes. Aucune ressource conforme, faisabilité achevée ou modèle financier indépendant n’est communiqué. Transfert du permis, titre, données techniques et pouvoir de transaction restent à vérifier.",
    highlights: ["La présentation décrit six carrés miniers couvrant environ 5,066 km²", "Historique déclaré : quatre sondages carottés, 22 sondages RC, tranchées et 1 334 échantillons de sol", "Une anomalie cuivre de 500 m sur 300 m reste une cible de forage proposée ; aucune ressource conforme n’est communiquée"],
    whyMatch: "Opportunité Investdesco précoce en minerais critiques nécessitant des diligences progressives sur le titre, la ressource, la faisabilité, l’environnement et le commerce.",
  },
} satisfies Record<string, ListingText>;

const esCopy: Record<string, Pick<ListingText, "summary" | "highlights" | "whyMatch">> = {
  "port-de-ndomba": {
    summary: "El promotor propone un puerto fluvial en el río Kasai para conectar el Gran Kasai con Kinshasa y las rutas de exportación. Las obras previstas incluyen muelle, dragado, atraques, almacenes, silos, combustible, aduanas y control de acceso digital. No se han divulgado públicamente pruebas de viabilidad, derechos, permisos, demanda, costes o ejecución.",
    highlights: ["El promotor declara haber completado un estudio de viabilidad", "Objetivo del promotor: 1.200 empleos de construcción y 450 puestos operativos permanentes", "Marco declarado: Normas de Desempeño IFC, plan de biodiversidad y pacto comunitario; evidencia no pública"],
    whyMatch: "Infraestructura logística de la plataforma Kasai de DESCO Global, destinada a facilitar las exportaciones de los pilares agrícola y minero.",
  },
  "port-de-kasenga": {
    summary: "El promotor propone un puerto en el lago Mweru para apoyar el comercio con Zambia y las conexiones hacia Angola. Sus objetivos incluyen 300.000 toneladas anuales y una reducción del 40 % en el tiempo de despacho fronterizo; los estudios de respaldo no son públicos.",
    highlights: ["Objetivo de capacidad: 300.000 toneladas anuales", "Conexión transfronteriza con Zambia (Copperbelt) y Angola", "Objetivo del promotor: reducir un 40 % el tiempo de despacho; estudio no público"],
    whyMatch: "Activo de corredor comercial regional que complementa el puerto de Ndomba dentro de la plataforma logística integrada de DESCO Global.",
  },
  "comicordia-mining": {
    summary: "Comicordia propone pasar por etapas de la actividad artesanal a la recuperación semimecanizada de oro y diamantes cerca de Luiza y Musefu. El expediente contiene un informe geológico de 2017 sobre PR 13578, una propuesta de octubre de 2024 y un documento conceptual de costes. Indican potencial y un concepto de desarrollo, pero no establecen un recurso actual, una vida útil confirmada ni una economía verificada de forma independiente.",
    highlights: ["El informe de 2017 cubre PR 13578, descrito como ocho cuadrículas mineras sobre unos 6,8 km²", "El material histórico analiza potencial de oro aluvial, eluvial y en roca, además de diamantes", "El documento conceptual recomienda un inicio gradual e indica que la vida de la mina no está confirmada"],
    whyMatch: "Oportunidad Investdesco en fase temprana para inversores capaces de financiar diligencia sobre título, geología, viabilidad y medio ambiente.",
  },
  "comicordia-agri": {
    summary: "Plataforma agrícola propuesta en el centro de la RDC que organiza pequeños productores en redes con crédito de insumos, mecanización compartida, almacenamiento y transformación de maíz, yuca y soja, con la intención de conectarlos a acuerdos de compra propuestos a precios transparentes.",
    highlights: ["Dato del promotor: más de 50.000 agricultores y 25.000 hectáreas; evidencia y fecha no públicas", "Dato del promotor: más de 40 aldeas y aumento de ingresos del 45 %; método y fecha no públicos", "Empleo declarado: 10.000 mujeres; evidencia de medición no pública"],
    whyMatch: "Oportunidad agrícola que exige validar alcance, acceso a la tierra, compra, salvaguardas e impacto declarado.",
  },
  "manioc-plant": {
    summary: "Los materiales describen una planta de liofilización de cuatro hectáreas cerca de Kimwenza, abastecida con hojas de yuca de Mont Ngafula y Kongo Central. Indican una vida útil aproximada de diez años y distribución mediante vendedores y depósitos; las pruebas de producto, demanda y validación no son públicas.",
    highlights: ["Parcela de 4 hectáreas con energía solar, almacenamiento en frío y tratamiento de agua", "Producto liofilizado con vida útil declarada de unos 10 años", "Distribución basada en vendedoras de mercado"],
    whyMatch: "Activo de transformación Agridesco de menor importe, con plan de construcción presupuestado y canal de distribución identificado.",
  },
  "phardesco-mbuji-mayi": {
    summary: "Primer Pharmalab Hub propuesto por Phardesco: un centro solar que integra farmacia, diagnóstico, agua potable y educación sanitaria en el Gran Kasai. Los materiales del promotor indican aproximadamente un farmacéutico por 50.000 personas, frente a una referencia de la OMS de 1 por 2.000.",
    highlights: ["Primero de una red prevista de más de 10 centros a medio plazo y más de 50 para 2035", "Energía solar, cadena de frío y producción genérica en vía GMP previstas", "Se citan posibles financiadores; no se confirma participación ni compromiso"],
    whyMatch: "Plataforma de acceso sanitario en fase inicial que ancla el pilar Phardesco en su región de origen.",
  },
  "tilu-pepm-8252": {
    summary: "Prospecto temprano de cobre-cobalto en Manono. Un estudio histórico informa de trabajos geoquímicos realizados en 2010 en PEPM 8252, con 933 muestras de suelo. Recomienda cartografía estructural, zanjas y perforación antes de definir recursos. La propiedad, validez y renovación del permiso no se han verificado de forma independiente.",
    highlights: ["El estudio informa de 933 muestras de suelo en 24 líneas norte-sur", "Señala anomalías de cobre y cobalto; no se divulga ningún recurso o reserva", "Siguen recomendándose cartografía, zanjas y perforación de exploración"],
    whyMatch: "Oportunidad minera Investdesco temprana para inversores capaces de evaluar riesgo geológico y de título previo a recursos.",
  },
  "sciress-kolwezi-12423": {
    summary: "Scires Mining propone adquirir y desarrollar PE 12423, proyecto de exploración de cobalto-cobre en Lualaba. Una presentación de diciembre de 2025 describe perforaciones, zanjas y muestreo históricos y un plan de capital de 45 M$ en dos etapas. No se divulgan recursos conformes, estudio de viabilidad terminado ni modelo financiero revisado independientemente. La transferencia, el título, los datos y la autoridad de transacción requieren diligencia.",
    highlights: ["La presentación describe seis cuadrículas mineras sobre unos 5,066 km²", "Historial declarado: cuatro sondeos diamantinos, 22 RC, zanjas y 1.334 muestras de suelo", "Una anomalía de cobre de 500 por 300 m sigue siendo objetivo de perforación propuesto; no se divulgan recursos conformes"],
    whyMatch: "Oportunidad Investdesco temprana en minerales críticos que exige diligencia gradual sobre título, recursos, viabilidad, medio ambiente y comercio.",
  },
};

const ptCopy: Record<string, Pick<ListingText, "summary" | "highlights" | "whyMatch">> = {
  "port-de-ndomba": { summary: "O promotor propõe um porto fluvial no rio Kasai para ligar o Grande Kasai a Kinshasa e às rotas de exportação. As obras previstas incluem cais, dragagem, ancoradouros, armazéns, silos, combustível, alfândega e controlo digital de acesso. Não foram divulgadas provas públicas de viabilidade, direitos, licenças, procura, custos ou execução.", highlights: ["O promotor declara ter concluído um estudo de viabilidade", "Meta do promotor: 1.200 funções na construção e 450 postos operacionais permanentes", "Quadro declarado: Padrões de Desempenho IFC, plano de biodiversidade e pacto comunitário; evidência não pública"], whyMatch: "Infraestrutura logística da plataforma Kasai da DESCO Global, destinada a facilitar exportações dos pilares agrícola e mineiro." },
  "port-de-kasenga": { summary: "O promotor propõe um porto no lago Mweru para apoiar o comércio com a Zâmbia e as ligações a Angola. As metas incluem 300.000 toneladas por ano e redução de 40% no tempo de desalfandegamento; os estudos de suporte não são públicos.", highlights: ["Meta de capacidade: 300.000 toneladas por ano", "Ligação transfronteiriça à Zâmbia (Copperbelt) e Angola", "Meta do promotor: redução de 40% no desalfandegamento; estudo não público"], whyMatch: "Ativo de corredor comercial regional que complementa o Porto de Ndomba na plataforma logística integrada da DESCO Global." },
  "comicordia-mining": { summary: "A Comicordia propõe passar por fases da atividade artesanal para a recuperação semimecanizada de ouro e diamantes perto de Luiza e Musefu. O dossiê contém um relatório geológico de 2017 sobre PR 13578, uma proposta de outubro de 2024 e um documento conceptual de custos. Indicam potencial e um conceito, mas não estabelecem recurso atual, vida útil confirmada ou economia verificada independentemente.", highlights: ["O relatório de 2017 cobre PR 13578, descrito como oito quadrículas mineiras em cerca de 6,8 km²", "O material histórico aborda potencial de ouro aluvial, eluvial e em rocha, além de diamantes", "O documento recomenda início faseado e afirma que a vida da mina não está confirmada"], whyMatch: "Oportunidade Investdesco inicial para investidores capazes de financiar diligência sobre título, geologia, viabilidade e ambiente." },
  "comicordia-agri": { summary: "Plataforma agrícola proposta no centro da RDC que organiza pequenos produtores em redes com crédito de insumos, mecanização partilhada, armazenamento e transformação de milho, mandioca e soja, procurando ligá-los a acordos de compra propostos a preços transparentes.", highlights: ["Dado do promotor: mais de 50.000 agricultores e 25.000 hectares; evidência e data não públicas", "Dado do promotor: mais de 40 aldeias e aumento de rendimento de 45%; método e data não públicos", "Emprego declarado: 10.000 mulheres; evidência de medição não pública"], whyMatch: "Oportunidade agrícola que exige validar alcance, acesso à terra, compra, salvaguardas e impacto declarado." },
  "manioc-plant": { summary: "Os materiais descrevem uma fábrica de liofilização de quatro hectares perto de Kimwenza, abastecida com folhas de mandioca de Mont Ngafula e Kongo Central. Indicam validade aproximada de dez anos e distribuição por vendedores e depósitos; testes de produto, procura e validação não são públicos.", highlights: ["Local de 4 hectares com energia solar, armazenamento refrigerado e tratamento de água", "Produto liofilizado com validade declarada de cerca de 10 anos", "Distribuição baseada em vendedoras de mercado"], whyMatch: "Ativo de transformação Agridesco de menor dimensão, com plano de construção orçamentado e canal de distribuição identificado." },
  "phardesco-mbuji-mayi": { summary: "Primeiro Pharmalab Hub proposto pela Phardesco: centro solar que integra farmácia, diagnóstico, água potável e educação sanitária no Grande Kasai. Os materiais do promotor indicam cerca de um farmacêutico por 50.000 pessoas, face à referência OMS de 1 por 2.000.", highlights: ["Primeiro de uma rede prevista de mais de 10 centros a médio prazo e mais de 50 até 2035", "Energia solar, cadeia de frio e produção genérica em trajetória GMP previstas", "São citados potenciais financiadores; não há participação ou compromisso confirmado"], whyMatch: "Plataforma inicial de acesso à saúde que ancora o pilar Phardesco na sua região de origem." },
  "tilu-pepm-8252": { summary: "Prospeção inicial de cobre-cobalto em Manono. Um estudo histórico relata trabalhos geoquímicos de 2010 em PEPM 8252, com 933 amostras de solo. Recomenda cartografia estrutural, trincheiras e perfuração antes de definir recursos. Propriedade, validade e renovação da licença não foram verificadas independentemente.", highlights: ["O estudo relata 933 amostras de solo em 24 linhas norte-sul", "Indica anomalias de cobre e cobalto; não é divulgado recurso ou reserva", "Continuam recomendadas cartografia, trincheiras e perfuração exploratória"], whyMatch: "Oportunidade mineira Investdesco inicial para investidores capazes de avaliar risco geológico e de título pré-recurso." },
  "sciress-kolwezi-12423": { summary: "A Scires Mining propõe adquirir e desenvolver PE 12423, projeto de exploração de cobalto-cobre em Lualaba. Uma apresentação de dezembro de 2025 descreve perfurações, trincheiras e amostragem históricas e um plano de US$45 milhões em duas fases. Não divulga recurso conforme, viabilidade concluída ou modelo financeiro revisto independentemente. Transferência, título, dados e autoridade de transação exigem diligência.", highlights: ["A apresentação descreve seis quadrículas mineiras cobrindo cerca de 5,066 km²", "Histórico declarado: quatro furos diamantados, 22 RC, trincheiras e 1.334 amostras de solo", "Uma anomalia de cobre de 500 por 300 m continua alvo de perfuração proposto; não há recurso conforme divulgado"], whyMatch: "Oportunidade Investdesco inicial em minerais críticos que exige diligência faseada sobre título, recurso, viabilidade, ambiente e comércio." },
};

const zhCopy: Record<string, Pick<ListingText, "summary" | "highlights" | "whyMatch">> = {
  "port-de-ndomba": { summary: "项目发起方拟在开赛河建设河港，连接大开赛地区、金沙萨及出口通道。拟建内容包括码头墙、疏浚、泊位、仓储、筒仓、燃料服务、海关设施和数字闸口。可行性、权利、许可、需求、成本及交付证据尚未公开披露。", highlights: ["项目发起方称已完成可行性研究", "目标：1,200 个建设岗位及 450 个永久运营岗位", "发起方所述框架包括 IFC 绩效标准、生物多样性计划和社区协议；证据未公开"], whyMatch: "DESCO Global 开赛平台的物流基础设施，拟为农业及采矿业务提供出口通道。" },
  "port-de-kasenga": { summary: "项目发起方拟在姆韦鲁湖建设港口，支持与赞比亚的贸易及通往安哥拉的连接。目标包括年吞吐量 30 万吨及边境清关时间缩短 40%；支持研究尚未公开。", highlights: ["目标吞吐量：每年 30 万吨", "连接赞比亚铜带及安哥拉的跨境通道", "目标：边境清关时间缩短 40%；支持研究未公开"], whyMatch: "与 Ndomba 港互补的区域贸易走廊资产，属于 DESCO Global 综合物流平台。" },
  "comicordia-mining": { summary: "Comicordia 拟分阶段将 Luiza 和 Musefu 附近的手工采金采钻转为半机械化作业。资料包括关于 PR 13578 的 2017 年地质报告、2024 年 10 月投资建议书及概念性成本文件。这些资料显示地质潜力及开发概念，但未确立当前资源量、确认矿山寿命或经独立核验的经济性。", highlights: ["2017 年报告涉及 PR 13578，称其包括八个矿权方格，约 6.8 平方公里", "历史资料讨论冲积、残积及硬岩金潜力，并涉及钻石潜力", "概念文件建议分阶段启动，并称矿山寿命尚未确认"], whyMatch: "Investdesco 早期项目，适合能够在矿山开发前资助矿权、地质、可行性及环境尽调的投资者。" },
  "comicordia-agri": { summary: "拟议的刚果民主共和国中部农业平台，通过投入品信贷、共享机械化、收后仓储及玉米、木薯和大豆加工组织小农网络，计划以透明价格连接拟议承购安排。", highlights: ["发起方称覆盖 5 万多名农户和 2.5 万公顷；计量证据及报告日期未公开", "发起方称覆盖 40 多个村庄并使收入提高 45%；方法及日期未公开", "发起方称直接雇用 1 万名女性；计量证据未公开"], whyMatch: "需核验农户覆盖、土地使用权、承购、保障措施及所述影响的农业项目。" },
  "manioc-plant": { summary: "项目资料描述在 Kimwenza 附近建设四公顷冻干设施，从 Mont Ngafula 和 Kongo Central 的种植户采购木薯叶。资料称产品保质期约十年，并计划通过零售商贩和仓点分销；产品测试、需求及验证证据尚未公开。", highlights: ["4 公顷场地，配备太阳能、冷藏及现场水处理", "冻干产品所述保质期约 10 年", "以女性市场商贩为基础的分销模式"], whyMatch: "规模较小、拟快速进入市场的 Agridesco 加工资产，具有已列成本的建设计划及明确分销渠道。" },
  "phardesco-mbuji-mayi": { summary: "Phardesco 拟建设首个 Pharmalab Hub，为大开赛地区提供太阳能支持的一站式药品零售、诊断、清洁饮水及健康教育。发起方资料称当地约每 5 万人一名药剂师，而其引用的世卫组织基准为每 2,000 人一名。", highlights: ["拟建网络首个中心，中期超过 10 个，2035 年前超过 50 个", "计划配备太阳能、冷链能力及符合 GMP 路径的仿制药生产", "发起方资料列出潜在融资机构，但未确认参与或承诺"], whyMatch: "处于早期阶段的医疗可及性平台，是 Phardesco 在创始地区的核心项目。" },
  "tilu-pepm-8252": { summary: "位于 Manono 的早期铜钴勘探项目。历史技术研究称 2010 年在 PEPM 8252 开展地球化学工作，包括 933 个土壤样本。研究建议在定义矿产资源量前开展构造测绘、探槽及钻探。当前矿权所有权、有效性及续期状态未经独立核验。", highlights: ["历史研究称在 24 条南北向测线上采集 933 个土壤样本", "研究称发现铜钴异常；未披露矿产资源量或储量", "仍建议开展构造测绘、探槽及勘探钻探"], whyMatch: "Investdesco 早期采矿项目，适合能够评估资源量确定前地质及矿权风险的投资者。" },
  "sciress-kolwezi-12423": { summary: "Scires Mining 拟收购并开发 Lualaba 省铜钴勘探项目 PE 12423。2025 年 12 月的发起方材料描述历史钻探、探槽及土壤采样，并提出 4,500 万美元两阶段资本计划。项目尚未披露合规资源量、已完成可行性研究或经独立审阅的财务模型。矿权转让、产权、技术数据及交易授权仍须尽调。", highlights: ["发起方材料称 PE 12423 包括六个矿权方格，约 5.066 平方公里", "发起方所述勘探历史：四个金刚石钻孔、22 个 RC 钻孔、探槽及 1,334 个土壤样本", "北部 500 米乘 300 米铜异常仍是拟议优先钻探目标；未披露合规资源量"], whyMatch: "Investdesco 早期关键矿产项目，需要分阶段核验矿权、资源量、可行性、环境及商业条件。" },
};

const es = Object.fromEntries(Object.entries(fr).map(([id, x]) => [id, {
  ...x,
  sector: x.sector === "Mines" ? "Minería" : x.sector === "Santé" ? "Salud" : x.sector,
  country: "R. D. del Congo",
  instrument: ({
    "port-de-ndomba": "SPV del proyecto — participación mayoritaria de DESCO",
    "port-de-kasenga": "SPV del proyecto — participación mayoritaria de DESCO",
    "comicordia-mining": "Empresa conjunta propuesta; términos públicos no divulgados",
    "comicordia-agri": "Asignación del pilar Agridesco (30 % del programa Fase 1 de 750 M$)",
    "manioc-plant": "Capital y financiación de equipos",
    "phardesco-mbuji-mayi": "IFD y capital de impacto (captación inicial de 5–10 M$)",
    "tilu-pepm-8252": "Necesidad de capital de exploración no divulgada públicamente",
    "sciress-kolwezi-12423": "Capital, empresa conjunta o financiación de compraventa propuestos, sujetos a diligencia y términos definitivos",
  } as Record<string, string>)[id],
  stage: ({
    "port-de-ndomba": "Viabilidad declarada por el promotor", "port-de-kasenga": "Estructuración",
    "comicordia-mining": "Geología histórica y planificación minera conceptual", "comicordia-agri": "Información operativa facilitada",
    "manioc-plant": "Preconstrucción", "phardesco-mbuji-mayi": "Prelanzamiento",
    "tilu-pepm-8252": "Datos históricos de exploración — título actual sin verificar",
    "sciress-kolwezi-12423": "Exploración previa a recursos y adquisición de permiso propuesta",
  } as Record<string, string>)[id],
  irr: ({
    "port-de-ndomba": "Incluido en el objetivo de TIR del 17,2 % del programa Fase 1 de DESCO Global",
    "port-de-kasenga": "Incluido en el objetivo de TIR del 17,2 % del programa Fase 1 de DESCO Global",
    "comicordia-mining": "No divulgado públicamente",
    "comicordia-agri": "Incluido en el objetivo de TIR del 17,2 % del programa Fase 1 de DESCO Global",
    "manioc-plant": "Modelo del promotor: unos 15.444 $ por lote de 2.000 kg; supuestos no revisados independientemente",
    "phardesco-mbuji-mayi": "Previsión a 5 años: equilibrio EBITDA en el año 2 y +3,8 M$ en el año 5",
    "tilu-pepm-8252": "No divulgado públicamente",
    "sciress-kolwezi-12423": "Ilustración del promotor: TIR objetivo del 35 %; sin recursos conformes, viabilidad ni modelo revisado independientemente",
  } as Record<string, string>)[id],
  ...esCopy[id],
}])) as Record<string, ListingText>;

const pt = Object.fromEntries(Object.entries(fr).map(([id, x]) => [id, {
  ...x,
  sector: x.sector === "Mines" ? "Mineração" : x.sector === "Santé" ? "Saúde" : x.sector,
  country: "RD Congo",
  instrument: ({
    "port-de-ndomba": "SPV do projeto — participação maioritária da DESCO",
    "port-de-kasenga": "SPV do projeto — participação maioritária da DESCO",
    "comicordia-mining": "Joint venture proposta; termos públicos não divulgados",
    "comicordia-agri": "Alocação do pilar Agridesco (30% do programa Fase 1 de US$ 750 M)",
    "manioc-plant": "Capital próprio e financiamento de equipamentos",
    "phardesco-mbuji-mayi": "IFD e capital de impacto (captação inicial de US$ 5–10 M)",
    "tilu-pepm-8252": "Necessidade de capital de exploração não divulgada publicamente",
    "sciress-kolwezi-12423": "Capital, joint venture ou financiamento de compra propostos, sujeitos a diligência e termos finais",
  } as Record<string, string>)[id],
  stage: ({
    "port-de-ndomba": "Viabilidade declarada pelo promotor", "port-de-kasenga": "Estruturação",
    "comicordia-mining": "Geologia histórica e planeamento mineiro conceptual", "comicordia-agri": "Informação operacional fornecida",
    "manioc-plant": "Pré-construção", "phardesco-mbuji-mayi": "Pré-lançamento",
    "tilu-pepm-8252": "Dados históricos de exploração — título atual não verificado",
    "sciress-kolwezi-12423": "Exploração pré-recurso e aquisição de licença proposta",
  } as Record<string, string>)[id],
  irr: ({
    "port-de-ndomba": "Incluído no objetivo de TIR de 17,2% do programa Fase 1 da DESCO Global",
    "port-de-kasenga": "Incluído no objetivo de TIR de 17,2% do programa Fase 1 da DESCO Global",
    "comicordia-mining": "Não divulgado publicamente",
    "comicordia-agri": "Incluído no objetivo de TIR de 17,2% do programa Fase 1 da DESCO Global",
    "manioc-plant": "Modelo do promotor: cerca de US$15.444 por lote de 2.000 kg; pressupostos não revistos independentemente",
    "phardesco-mbuji-mayi": "Previsão a 5 anos: equilíbrio EBITDA no ano 2 e +US$3,8 M no ano 5",
    "tilu-pepm-8252": "Não divulgado publicamente",
    "sciress-kolwezi-12423": "Ilustração do promotor: TIR alvo de 35%; sem recurso conforme, viabilidade ou modelo revisto independentemente",
  } as Record<string, string>)[id],
  ...ptCopy[id],
}])) as Record<string, ListingText>;

const zh = Object.fromEntries(Object.entries(fr).map(([id, x]) => [id, {
  ...x,
  sector: x.sector === "Mines" ? "采矿" : x.sector === "Santé" ? "医疗健康" : x.sector === "Agriculture" ? "农业" : "基础设施",
  country: "刚果民主共和国",
  instrument: ({
    "port-de-ndomba": "项目 SPV，DESCO 持有多数权益", "port-de-kasenga": "项目 SPV，DESCO 持有多数权益",
    "comicordia-mining": "拟议合资企业；公开交易条款尚未披露", "comicordia-agri": "Agridesco 业务支柱资本分配，占 7.5 亿美元第一阶段计划的 30%",
    "manioc-plant": "股权及设备融资", "phardesco-mbuji-mayi": "开发金融机构及影响力股权，初始融资 500万至1,000 万美元",
    "tilu-pepm-8252": "勘探融资需求尚未公开披露", "sciress-kolwezi-12423": "拟议股权、合资或承购融资，须经尽调并确定最终条款",
  } as Record<string, string>)[id],
  stage: ({
    "port-de-ndomba": "项目发起方报告已开展可行性研究", "port-de-kasenga": "结构设计阶段",
    "comicordia-mining": "历史地质资料及概念性矿山规划", "comicordia-agri": "已提供运营信息",
    "manioc-plant": "建设前阶段", "phardesco-mbuji-mayi": "启动前阶段",
    "tilu-pepm-8252": "历史勘探数据，当前矿权状态未经核验", "sciress-kolwezi-12423": "资源量确定前勘探及拟议矿权收购",
  } as Record<string, string>)[id],
  irr: ({
    "port-de-ndomba": "纳入 DESCO Global 第一阶段计划 17.2% 的目标内部收益率",
    "port-de-kasenga": "纳入 DESCO Global 第一阶段计划 17.2% 的目标内部收益率",
    "comicordia-mining": "尚未公开披露",
    "comicordia-agri": "纳入 DESCO Global 第一阶段计划 17.2% 的目标内部收益率",
    "manioc-plant": "发起方模型：每批投入 2,000 公斤，约 15,444 美元；假设未经独立审阅",
    "phardesco-mbuji-mayi": "五年预测：第 2 年 EBITDA 盈亏平衡，第 5 年 EBITDA 约 380 万美元",
    "tilu-pepm-8252": "尚未公开披露",
    "sciress-kolwezi-12423": "发起方示例：目标内部收益率 35%；未披露合规资源量、可行性研究或独立审阅模型",
  } as Record<string, string>)[id],
  ...zhCopy[id],
}])) as Record<string, ListingText>;

const translations = { fr, es, pt, zh } satisfies ListingTranslations;

export function localizeListing<T extends Listing>(listing: T, locale: Locale): T {
  if (locale === "en") return listing;
  const translated = (translations[locale] as Record<string, ListingText>)[listing.id];
  return translated ? { ...listing, ...translated } : listing;
}

const evidenceLabels: Record<Exclude<Locale, "en">, Record<string, string>> = {
  fr: { "Use of funds": "Utilisation des fonds", "Funding already secured": "Financement déjà obtenu", "Sponsor contribution": "Contribution du porteur", "Legal project entity": "Entité juridique du projet", "Ownership and development rights": "Propriété et droits de développement", "Permits and approvals": "Permis et autorisations", "Revenue and offtake evidence": "Preuves de revenus et d’achat", "Implementation timetable": "Calendrier de mise en œuvre", "Technical evidence": "Preuves techniques", "Development plan": "Plan de développement", "Next technical work": "Prochains travaux techniques", "Development and construction": "Développement et construction", "Commercial and offtake": "Commercial et achats", "Legal, title and permitting": "Juridique, titre et permis", "Financial and currency": "Financier et devise", "Environmental and social": "Environnemental et social", "Geology and resource": "Géologie et ressource", "Commercial and financial": "Commercial et financier" },
  es: { "Use of funds": "Uso de fondos", "Funding already secured": "Financiación obtenida", "Sponsor contribution": "Aportación del promotor", "Legal project entity": "Entidad jurídica", "Ownership and development rights": "Propiedad y derechos de desarrollo", "Permits and approvals": "Permisos y autorizaciones", "Revenue and offtake evidence": "Evidencia de ingresos y compra", "Implementation timetable": "Calendario de ejecución", "Technical evidence": "Evidencia técnica", "Development plan": "Plan de desarrollo", "Next technical work": "Próximos trabajos técnicos", "Development and construction": "Desarrollo y construcción", "Commercial and offtake": "Comercial y compra", "Legal, title and permitting": "Aspectos jurídicos, título y permisos", "Financial and currency": "Finanzas y divisas", "Environmental and social": "Ambiental y social", "Geology and resource": "Geología y recursos", "Commercial and financial": "Comercial y financiero" },
  pt: { "Use of funds": "Utilização dos fundos", "Funding already secured": "Financiamento obtido", "Sponsor contribution": "Contribuição do promotor", "Legal project entity": "Entidade jurídica", "Ownership and development rights": "Propriedade e direitos de desenvolvimento", "Permits and approvals": "Licenças e aprovações", "Revenue and offtake evidence": "Evidência de receitas e compra", "Implementation timetable": "Calendário de execução", "Technical evidence": "Evidência técnica", "Development plan": "Plano de desenvolvimento", "Next technical work": "Próximos trabalhos técnicos", "Development and construction": "Desenvolvimento e construção", "Commercial and offtake": "Comercial e compra", "Legal, title and permitting": "Jurídico, título e licenças", "Financial and currency": "Financeiro e cambial", "Environmental and social": "Ambiental e social", "Geology and resource": "Geologia e recursos", "Commercial and financial": "Comercial e financeiro" },
  zh: { "Use of funds": "资金用途", "Funding already secured": "已落实融资", "Sponsor contribution": "项目发起方出资", "Legal project entity": "项目法律实体", "Ownership and development rights": "所有权及开发权", "Permits and approvals": "许可与批准", "Revenue and offtake evidence": "收入及承购证据", "Implementation timetable": "实施时间表", "Technical evidence": "技术证据", "Development plan": "开发计划", "Next technical work": "后续技术工作", "Development and construction": "开发与建设", "Commercial and offtake": "商业及承购", "Legal, title and permitting": "法律、矿权及许可", "Financial and currency": "财务及汇率", "Environmental and social": "环境与社会", "Geology and resource": "地质与资源量", "Commercial and financial": "商业与财务" },
};

const evidenceUi = {
  fr: { absent: "Non communiqué publiquement" },
  es: { absent: "No divulgado públicamente" },
  pt: { absent: "Não divulgado publicamente" },
  zh: { absent: "尚未公开披露" },
} satisfies Record<Exclude<Locale, "en">, Record<string, string>>;

type EvidenceLocale = Exclude<Locale, "en">;
type EvidenceTranslation = Record<EvidenceLocale, string>;
const evidenceText = new Map<string, EvidenceTranslation>();
function evidence(
  en: string,
  frText: string,
  esText: string,
  ptText: string,
  zhText: string,
) {
  evidenceText.set(en, { fr: frText, es: esText, pt: ptText, zh: zhText });
}

evidence("Sponsor submission", "Soumission du porteur", "Presentación del promotor", "Submissão do promotor", "项目发起方提交资料");
evidence("Sponsor submission; supporting evidence not public", "Soumission du porteur ; preuves justificatives non publiques", "Presentación del promotor; pruebas justificativas no públicas", "Submissão do promotor; provas de suporte não públicas", "项目发起方提交资料；支持证据未公开");
evidence("Sponsor-provided project information and targets", "Informations et objectifs de projet fournis par le porteur", "Información y objetivos del proyecto proporcionados por el promotor", "Informação e metas do projeto fornecidas pelo promotor", "项目发起方提供的项目信息及目标");
evidence("DESCO Global investor materials and project submissions", "Documents investisseurs de DESCO Global et soumissions de projets", "Materiales para inversores de DESCO Global y presentaciones de proyectos", "Materiais para investidores da DESCO Global e submissões de projetos", "DESCO Global 投资者材料及项目提交资料");
evidence("Source date not disclosed on the public record", "Date de la source non communiquée publiquement", "Fecha de la fuente no divulgada públicamente", "Data da fonte não divulgada publicamente", "公开记录未披露来源日期");
evidence("Independent verification not recorded", "Aucune vérification indépendante enregistrée", "No consta verificación independiente", "Não existe registo de verificação independente", "未记录独立核实");

evidence("The sponsor proposes a Kasai River logistics gateway intended to connect regional production with Kinshasa and export markets. The public case depends on evidence of rights, permits, demand, construction cost, financing and phased delivery.", "Le porteur propose une plateforme logistique sur la rivière Kasaï destinée à relier la production régionale à Kinshasa et aux marchés d’exportation. Le dossier public dépend de preuves concernant les droits, permis, demande, coûts de construction, financement et livraison par phases.", "El promotor propone una plataforma logística en el río Kasai para conectar la producción regional con Kinshasa y los mercados de exportación. El caso público depende de pruebas sobre derechos, permisos, demanda, costes de construcción, financiación y ejecución por fases.", "O promotor propõe uma plataforma logística no rio Kasai para ligar a produção regional a Kinshasa e aos mercados de exportação. O caso público depende de provas sobre direitos, licenças, procura, custos de construção, financiamento e execução faseada.", "项目发起方拟建设开赛河物流门户，将区域生产与金沙萨及出口市场连接。公开投资依据取决于权利、许可、需求、建设成本、融资及分阶段交付的证据。");
evidence("The sponsor proposes a Lake Mweru cross-border trade hub. The investment case depends on documented corridor demand, border arrangements, operating rights, capital cost and commercial agreements.", "Le porteur propose un pôle commercial transfrontalier sur le lac Moero. Le dossier d’investissement dépend d’une demande de corridor documentée, des accords frontaliers, des droits d’exploitation, des coûts d’investissement et des accords commerciaux.", "El promotor propone un centro de comercio transfronterizo en el lago Mweru. El caso de inversión depende de demanda documentada del corredor, acuerdos fronterizos, derechos de explotación, coste de capital y acuerdos comerciales.", "O promotor propõe um centro de comércio transfronteiriço no lago Mweru. O caso de investimento depende de procura documentada do corredor, acordos fronteiriços, direitos de exploração, custo de capital e acordos comerciais.", "项目发起方拟建设姆韦鲁湖跨境贸易枢纽。投资依据取决于走廊需求文件、边境安排、运营权、资本成本及商业协议。");
evidence("Comicordia proposes staged mechanisation of gold and diamond activity near Luiza and Musefu. The folder supports a historical geological case and an operating concept, but current title, resource, mine life, feasibility, environmental approvals and transaction authority still require verification.", "Comicordia propose une mécanisation progressive des activités d’or et de diamant près de Luiza et Musefu. Le dossier étaye un historique géologique et un concept d’exploitation, mais le titre actuel, la ressource, la durée de la mine, la faisabilité, les autorisations environnementales et le pouvoir de transaction restent à vérifier.", "Comicordia propone mecanizar por etapas la actividad de oro y diamantes cerca de Luiza y Musefu. El expediente respalda un caso geológico histórico y un concepto operativo, pero aún deben verificarse el título actual, los recursos, la vida de la mina, la viabilidad, las autorizaciones ambientales y la autoridad para la transacción.", "A Comicordia propõe a mecanização faseada da atividade de ouro e diamantes perto de Luiza e Musefu. O dossiê sustenta um caso geológico histórico e um conceito operacional, mas o título atual, o recurso, a vida da mina, a viabilidade, as aprovações ambientais e a autoridade para a transação ainda exigem verificação.", "Comicordia 拟分阶段将 Luiza 和 Musefu 附近的金矿和钻石作业机械化。资料支持历史地质依据和运营概念，但当前矿权、资源量、矿山寿命、可行性、环境批准及交易权限仍须核实。");
evidence("The sponsor proposes an integrated smallholder and processing platform. The case depends on evidence for land access, farmer participation, yields, offtake, operating performance and the allocation of programme-level capital.", "Le porteur propose une plateforme intégrée de petits producteurs et de transformation. Le dossier dépend de preuves sur l’accès au foncier, la participation des agriculteurs, les rendements, les achats, la performance opérationnelle et l’allocation de capital au niveau du programme.", "El promotor propone una plataforma integrada de pequeños productores y transformación. El caso depende de pruebas sobre acceso a la tierra, participación de agricultores, rendimientos, compra, desempeño operativo y asignación de capital del programa.", "O promotor propõe uma plataforma integrada de pequenos produtores e transformação. O caso depende de provas sobre acesso à terra, participação dos agricultores, rendimentos, compra, desempenho operacional e alocação de capital do programa.", "项目发起方拟建设综合小农户及加工平台。投资依据取决于土地使用权、农户参与、产量、承购、运营表现及计划层面资本分配的证据。");
evidence("The sponsor proposes a cassava-leaf processing facility supported by a local sourcing and distribution network. The case depends on validated unit economics, site rights, equipment quotations, demand and working-capital requirements.", "Le porteur propose une usine de transformation de feuilles de manioc soutenue par un réseau local d’approvisionnement et de distribution. Le dossier dépend d’une économie unitaire validée, des droits sur le site, des devis d’équipement, de la demande et des besoins en fonds de roulement.", "El promotor propone una planta de procesamiento de hojas de yuca apoyada por una red local de abastecimiento y distribución. El caso depende de una economía unitaria validada, derechos sobre el emplazamiento, cotizaciones de equipos, demanda y necesidades de capital circulante.", "O promotor propõe uma unidade de processamento de folhas de mandioca apoiada por uma rede local de abastecimento e distribuição. O caso depende de economia unitária validada, direitos sobre o local, cotações de equipamento, procura e necessidades de fundo de maneio.", "项目发起方拟建设木薯叶加工设施，并由本地采购和分销网络支持。投资依据取决于经验证的单位经济性、场地权利、设备报价、需求及营运资金要求。");
evidence("The sponsor proposes an integrated pharmacy, diagnostics, water and health-education hub. The case depends on licensing, demand evidence, procurement and cold-chain capability, operating forecasts and the path to breakeven.", "Le porteur propose un centre intégré de pharmacie, diagnostic, eau et éducation sanitaire. Le dossier dépend des licences, des preuves de demande, des capacités d’achat et de chaîne du froid, des prévisions d’exploitation et du chemin vers le seuil de rentabilité.", "El promotor propone un centro integrado de farmacia, diagnóstico, agua y educación sanitaria. El caso depende de licencias, pruebas de demanda, capacidad de compra y cadena de frío, previsiones operativas y la vía hacia el equilibrio.", "O promotor propõe um centro integrado de farmácia, diagnóstico, água e educação para a saúde. O caso depende de licenças, provas de procura, capacidade de compras e cadeia de frio, previsões operacionais e percurso até ao equilíbrio.", "项目发起方拟建设集药房、诊断、水务及健康教育于一体的中心。投资依据取决于许可、需求证据、采购和冷链能力、运营预测及盈亏平衡路径。");
evidence("The supplied historical geochemical study identifies copper and cobalt anomalies at PEPM 8252 but does not establish a mineral resource. The case depends on current title verification, modern exploration, independent technical review, environmental and social baseline work, and a disclosed funding plan.", "L’étude géochimique historique fournie identifie des anomalies de cuivre et de cobalt sur PEPM 8252, sans établir de ressource minérale. Le dossier dépend de la vérification du titre actuel, d’une exploration moderne, d’un examen technique indépendant, d’études environnementales et sociales de référence et d’un plan de financement communiqué.", "El estudio geoquímico histórico aportado identifica anomalías de cobre y cobalto en PEPM 8252, pero no establece un recurso mineral. El caso depende de verificar el título actual, realizar exploración moderna, revisión técnica independiente, estudios de referencia ambientales y sociales y divulgar un plan de financiación.", "O estudo geoquímico histórico fornecido identifica anomalias de cobre e cobalto em PEPM 8252, mas não estabelece um recurso mineral. O caso depende da verificação do título atual, exploração moderna, análise técnica independente, estudos ambientais e sociais de referência e um plano de financiamento divulgado.", "所提供的历史地球化学研究识别了 PEPM 8252 的铜钴异常，但未确立矿产资源量。投资依据取决于当前矿权核实、现代勘探、独立技术审查、环境与社会基线工作及已披露的融资计划。");
evidence("Scires Mining proposes to acquire and advance PE 12423 through drilling, resource definition, feasibility work and pre-production engineering. The opportunity remains pre-resource: permit transfer, title, historical data, metallurgy, environmental approvals, development costs and transaction terms require independent diligence.", "Scires Mining propose d’acquérir et de faire progresser PE 12423 par forage, définition de ressource, études de faisabilité et ingénierie de préproduction. L’opportunité reste sans ressource définie : transfert du permis, titre, données historiques, métallurgie, autorisations environnementales, coûts de développement et conditions de transaction exigent une diligence indépendante.", "Scires Mining propone adquirir y avanzar PE 12423 mediante perforación, definición de recursos, viabilidad e ingeniería de preproducción. La oportunidad sigue sin recursos definidos: la transferencia del permiso, el título, los datos históricos, la metalurgia, las autorizaciones ambientales, los costes de desarrollo y los términos de transacción requieren diligencia independiente.", "A Scires Mining propõe adquirir e avançar PE 12423 através de perfuração, definição de recursos, viabilidade e engenharia de pré-produção. A oportunidade continua sem recurso definido: transferência da licença, título, dados históricos, metalurgia, aprovações ambientais, custos de desenvolvimento e termos da transação exigem diligência independente.", "Scires Mining 拟收购 PE 12423，并通过钻探、资源量定义、可行性工作及投产前工程推进项目。该机会仍处于资源量确定前阶段：矿权转让、产权、历史数据、冶金、环境批准、开发成本及交易条款均须独立尽调。");

const miningEvidenceRows: [string, string, string, string, string][] = [
  ["Comicordia/Luiza is described as a registered mining cooperative; legal documents remain subject to diligence", "Comicordia/Luiza est décrite comme une coopérative minière enregistrée ; les documents juridiques restent soumis à diligence", "Comicordia/Luiza se describe como cooperativa minera registrada; los documentos jurídicos siguen sujetos a diligencia", "A Comicordia/Luiza é descrita como cooperativa mineira registada; os documentos jurídicos continuam sujeitos a diligência", "Comicordia/Luiza 被描述为已注册采矿合作社；法律文件仍须尽调"],
  ["The proposal refers to an artisanal mining zone and a lease arrangement for PR 13343; the 2017 geological report concerns PR 13578. The relationship among these rights requires reconciliation", "La proposition mentionne une zone minière artisanale et un bail pour PR 13343 ; le rapport géologique de 2017 concerne PR 13578. Le lien entre ces droits doit être rapproché", "La propuesta menciona una zona minera artesanal y un arrendamiento para PR 13343; el informe geológico de 2017 se refiere a PR 13578. Debe conciliarse la relación entre estos derechos", "A proposta refere uma zona mineira artesanal e um arrendamento para PR 13343; o relatório geológico de 2017 diz respeito a PR 13578. A relação entre estes direitos exige conciliação", "建议书涉及手工采矿区及 PR 13343 的租赁安排；2017 年地质报告涉及 PR 13578。上述权利之间的关系须予核对"],
  ["Historical geological work indicates gold and diamond potential; no current internationally reportable mineral resource or reserve is disclosed", "Les travaux géologiques historiques indiquent un potentiel d’or et de diamant ; aucune ressource ou réserve actuelle publiable selon une norme internationale n’est communiquée", "Los trabajos geológicos históricos indican potencial de oro y diamantes; no se divulga ningún recurso o reserva actual conforme a una norma internacional", "Os trabalhos geológicos históricos indicam potencial de ouro e diamantes; não é divulgado qualquer recurso ou reserva atual reportável segundo norma internacional", "历史地质工作显示金和钻石潜力；未披露当前符合国际报告标准的矿产资源量或储量"],
  ["A staged small-to-medium-scale open-cast concept is described. The source states that mine life is unconfirmed and cost estimates require site validation", "Un concept progressif d’exploitation à ciel ouvert de petite à moyenne taille est décrit. La source indique que la durée de mine n’est pas confirmée et que les coûts exigent une validation sur site", "Se describe un concepto gradual de mina a cielo abierto de pequeña a mediana escala. La fuente indica que la vida de la mina no está confirmada y que los costes requieren validación in situ", "É descrito um conceito faseado de exploração a céu aberto de pequena a média escala. A fonte afirma que a vida da mina não está confirmada e os custos exigem validação no local", "资料描述了分阶段的小至中型露天开采概念。来源称矿山寿命尚未确认，成本估算须经现场验证"],
  ["Permit numbers and contractual rights differ across the supplied documents and require legal reconciliation", "Les numéros de permis et droits contractuels diffèrent selon les documents fournis et exigent un rapprochement juridique", "Los números de permiso y los derechos contractuales difieren entre los documentos y requieren conciliación jurídica", "Os números de licença e os direitos contratuais diferem entre os documentos e exigem conciliação jurídica", "所提供文件中的许可编号和合同权利存在差异，须进行法律核对"],
  ["Historical indications have not been converted into a current independently reported resource or reserve", "Les indications historiques n’ont pas été converties en ressource ou réserve actuelle publiée indépendamment", "Los indicios históricos no se han convertido en un recurso o reserva actual informado de forma independiente", "Os indícios históricos não foram convertidos num recurso ou reserva atual reportado independentemente", "历史迹象尚未转化为当前经独立报告的资源量或储量"],
  ["The mine plan and costs are conceptual; site engineering, equipment quotations and mine scheduling are not disclosed", "Le plan minier et les coûts sont conceptuels ; l’ingénierie du site, les devis d’équipement et le calendrier minier ne sont pas communiqués", "El plan minero y los costes son conceptuales; no se divulgan ingeniería del emplazamiento, cotizaciones de equipos ni calendario minero", "O plano mineiro e os custos são conceptuais; não são divulgados engenharia do local, cotações de equipamento ou calendário mineiro", "矿山计划和成本为概念性；未披露现场工程、设备报价及采矿进度"],
  ["Environmental baseline, impact assessment, closure plan and community agreements are not publicly disclosed", "L’état initial environnemental, l’étude d’impact, le plan de fermeture et les accords communautaires ne sont pas communiqués publiquement", "No se divulgan públicamente la línea base ambiental, la evaluación de impacto, el plan de cierre ni los acuerdos comunitarios", "Não são divulgados publicamente a linha de base ambiental, a avaliação de impacto, o plano de encerramento ou os acordos comunitários", "环境基线、影响评估、关闭计划及社区协议尚未公开披露"],
  ["Public transaction terms, validated operating model, funding plan and offtake evidence are not disclosed", "Les conditions publiques de transaction, le modèle d’exploitation validé, le plan de financement et les preuves d’achat ne sont pas communiqués", "No se divulgan términos públicos de transacción, modelo operativo validado, plan de financiación ni pruebas de compra", "Não são divulgados termos públicos da transação, modelo operacional validado, plano de financiamento ou provas de compra", "未披露公开交易条款、经验证的运营模型、融资计划及承购证据"],
  ["Tilu Mining SPRL is named in the supplied study", "Tilu Mining SPRL est nommée dans l’étude fournie", "Tilu Mining SPRL figura en el estudio aportado", "A Tilu Mining SPRL é identificada no estudo fornecido", "所提供研究中列有 Tilu Mining SPRL"],
  ["The study concerns PEPM 8252; current ownership, renewal and validity are not established by the public record", "L’étude concerne PEPM 8252 ; la propriété actuelle, le renouvellement et la validité ne sont pas établis par le dossier public", "El estudio se refiere a PEPM 8252; el registro público no establece propiedad actual, renovación ni validez", "O estudo diz respeito a PEPM 8252; o registo público não estabelece propriedade atual, renovação ou validade", "研究涉及 PEPM 8252；公开记录未确立当前所有权、续期及有效性"],
  ["The study reports 933 soil samples over 24 survey lines and copper-cobalt anomalies; it does not report a mineral resource or reserve", "L’étude rapporte 933 échantillons de sol sur 24 lignes et des anomalies cuivre-cobalt ; elle ne communique aucune ressource ou réserve minérale", "El estudio informa de 933 muestras de suelo en 24 líneas y anomalías de cobre-cobalto; no informa de recursos o reservas", "O estudo relata 933 amostras de solo em 24 linhas e anomalias de cobre-cobalto; não relata recurso ou reserva", "研究报告在 24 条测线上采集 933 个土壤样本并发现铜钴异常；未报告矿产资源量或储量"],
  ["Structural mapping, trenching and exploration drilling are recommended", "La cartographie structurale, les tranchées et les forages d’exploration sont recommandés", "Se recomiendan cartografía estructural, zanjas y perforación de exploración", "São recomendados mapeamento estrutural, trincheiras e perfuração de exploração", "建议开展构造测绘、探槽及勘探钻探"],
  ["Current permit status and chain of title require verification", "Le statut actuel du permis et la chaîne de titre doivent être vérifiés", "Deben verificarse el estado actual del permiso y la cadena de titularidad", "O estado atual da licença e a cadeia de titularidade exigem verificação", "当前许可状态及权属链须予核实"],
  ["Geochemical anomalies are exploration indicators and do not establish an economic deposit", "Les anomalies géochimiques sont des indicateurs d’exploration et n’établissent pas un gisement économique", "Las anomalías geoquímicas son indicadores de exploración y no establecen un yacimiento económico", "As anomalias geoquímicas são indicadores de exploração e não estabelecem um depósito económico", "地球化学异常仅为勘探指标，并不能确立经济矿床"],
  ["No mine plan, processing route, infrastructure plan or capital estimate is disclosed", "Aucun plan minier, schéma de traitement, plan d’infrastructure ou estimation de capital n’est communiqué", "No se divulga plan minero, ruta de procesamiento, plan de infraestructura ni estimación de capital", "Não é divulgado plano mineiro, rota de processamento, plano de infraestrutura ou estimativa de capital", "未披露矿山计划、加工路线、基础设施计划或资本估算"],
  ["Baseline studies, impact assessment and community agreements are not publicly disclosed", "Les études de référence, l’étude d’impact et les accords communautaires ne sont pas communiqués publiquement", "No se divulgan públicamente estudios de referencia, evaluación de impacto ni acuerdos comunitarios", "Não são divulgados publicamente estudos de referência, avaliação de impacto ou acordos comunitários", "基线研究、影响评估及社区协议尚未公开披露"],
  ["Capital requirement, transaction structure, operating costs and offtake are not disclosed", "Le besoin en capital, la structure de transaction, les coûts d’exploitation et les achats ne sont pas communiqués", "No se divulgan capital requerido, estructura de transacción, costes operativos ni compra", "Não são divulgados capital necessário, estrutura da transação, custos operacionais ou compra", "未披露融资需求、交易结构、运营成本及承购安排"],
];
for (const row of miningEvidenceRows) evidence(...row);

const sciresRows: [string, string, string, string, string][] = [
  ["Scires Mining is presented as the proposed project owner and operator following acquisition; the acquisition vehicle and executed transfer documents are not disclosed", "Scires Mining est présentée comme futur propriétaire et exploitant après acquisition ; le véhicule d’acquisition et les actes de transfert signés ne sont pas communiqués", "Scires Mining se presenta como futuro propietario y operador tras la adquisición; no se divulgan el vehículo de adquisición ni los documentos de transferencia firmados", "A Scires Mining é apresentada como futura proprietária e operadora após a aquisição; não são divulgados o veículo de aquisição ou os documentos de transferência assinados", "Scires Mining 被描述为收购后的拟议项目所有者及运营方；未披露收购载体及已签署的转让文件"],
  ["The supplied materials state that PE 12423 is to be acquired by Scires Mining. Current ownership, authority to sell, transfer conditions and beneficial ownership require legal verification", "Les documents indiquent que PE 12423 doit être acquis par Scires Mining. La propriété actuelle, le pouvoir de vendre, les conditions de transfert et les bénéficiaires effectifs exigent une vérification juridique", "Los materiales indican que PE 12423 será adquirido por Scires Mining. La propiedad actual, la autoridad para vender, las condiciones de transferencia y la titularidad real requieren verificación jurídica", "Os materiais indicam que PE 12423 será adquirido pela Scires Mining. A propriedade atual, a autoridade para vender, as condições de transferência e os beneficiários efetivos exigem verificação jurídica", "资料称 PE 12423 将由 Scires Mining 收购。当前所有权、出售权限、转让条件及实益所有权须经法律核实"],
  ["The CAMI extract describes PE 12423 over six mining squares, granted 20 March 2018 with stated validity to 19 March 2048. Current standing, encumbrances and transfer approval have not been independently checked", "L’extrait CAMI décrit PE 12423 sur six carrés miniers, accordé le 20 mars 2018 et déclaré valable jusqu’au 19 mars 2048. Le statut actuel, les charges et l’autorisation de transfert n’ont pas été vérifiés indépendamment", "El extracto CAMI describe PE 12423 sobre seis cuadrículas, otorgado el 20 de marzo de 2018 y válido según el documento hasta el 19 de marzo de 2048. No se han verificado independientemente su vigencia, cargas ni aprobación de transferencia", "O extrato CAMI descreve PE 12423 sobre seis quadrículas, concedido em 20 de março de 2018 e declarado válido até 19 de março de 2048. A situação atual, os ónus e a aprovação da transferência não foram verificados independentemente", "CAMI 摘录称 PE 12423 包含六个矿权方格，于 2018 年 3 月 20 日授予，并称有效期至 2048 年 3 月 19 日。当前状态、权利负担及转让批准未经独立核查"],
  ["The sponsor reports historical diamond and RC drilling, trenching and soil sampling with copper and cobalt indications. No compliant mineral resource or reserve is disclosed", "Le porteur rapporte des forages carottés et RC, des tranchées et des échantillons de sol historiques avec des indications de cuivre et cobalt. Aucune ressource ou réserve conforme n’est communiquée", "El promotor informa de perforación diamantina y RC, zanjas y muestreo histórico con indicios de cobre y cobalto. No se divulga recurso o reserva conforme", "O promotor relata perfuração diamantada e RC, trincheiras e amostragem histórica com indícios de cobre e cobalto. Não é divulgado recurso ou reserva conforme", "项目发起方报告了历史金刚石钻探、RC 钻探、探槽及土壤采样，并称有铜钴迹象。未披露合规矿产资源量或储量"],
  ["Sponsor target: acquisition, advanced exploration, resource definition, studies and pre-production work over approximately 30 months before commissioning", "Objectif du porteur : acquisition, exploration avancée, définition de ressource, études et travaux de préproduction sur environ 30 mois avant mise en service", "Objetivo del promotor: adquisición, exploración avanzada, definición de recursos, estudios y trabajos de preproducción durante unos 30 meses antes de la puesta en servicio", "Meta do promotor: aquisição, exploração avançada, definição de recursos, estudos e trabalhos de pré-produção durante cerca de 30 meses antes da entrada em serviço", "项目发起方目标：在投产前约 30 个月内完成收购、高级勘探、资源量定义、研究及投产前工作"],
  ["No executed offtake agreement or independently reviewed revenue case is disclosed", "Aucun accord d’achat signé ni scénario de revenus examiné indépendamment n’est communiqué", "No se divulga acuerdo de compra firmado ni caso de ingresos revisado independientemente", "Não é divulgado acordo de compra assinado ou caso de receitas analisado independentemente", "未披露已签署的承购协议或经独立审查的收入依据"],
  ["The proposed permit acquisition, authority to sell, title standing, encumbrances and regulatory transfer approvals require independent legal verification", "L’acquisition proposée du permis, le pouvoir de vendre, le statut du titre, les charges et les autorisations réglementaires de transfert exigent une vérification juridique indépendante", "La adquisición propuesta del permiso, la autoridad para vender, la vigencia del título, las cargas y las aprobaciones regulatorias de transferencia requieren verificación jurídica independiente", "A aquisição proposta da licença, a autoridade para vender, a situação do título, os ónus e as aprovações regulamentares de transferência exigem verificação jurídica independente", "拟议矿权收购、出售权限、矿权状态、权利负担及监管转让批准须经独立法律核实"],
  ["Historical indications and anomalies do not establish grade continuity, tonnage, metallurgy or an economic resource", "Les indications et anomalies historiques n’établissent ni continuité des teneurs, ni tonnage, ni métallurgie, ni ressource économique", "Los indicios y anomalías históricos no establecen continuidad de ley, tonelaje, metalurgia ni recurso económico", "Os indícios e anomalias históricos não estabelecem continuidade de teor, tonelagem, metalurgia ou recurso económico", "历史迹象和异常不能确立品位连续性、吨位、冶金特征或经济资源量"],
  ["The processing route, mine design, infrastructure scope, schedule and costs remain conceptual pending resource definition and feasibility studies", "Le procédé de traitement, la conception de la mine, les infrastructures, le calendrier et les coûts restent conceptuels dans l’attente de la définition de ressource et des études de faisabilité", "La ruta de procesamiento, el diseño de mina, la infraestructura, el calendario y los costes siguen siendo conceptuales hasta definir recursos y completar la viabilidad", "A rota de processamento, o desenho da mina, a infraestrutura, o calendário e os custos continuam conceptuais até à definição de recursos e aos estudos de viabilidade", "在资源量定义和可行性研究完成前，加工路线、矿山设计、基础设施范围、进度及成本仍为概念性"],
  ["The sponsor budgets for ESIA and community work, but completed studies, approvals, baseline data and agreements are not disclosed", "Le porteur prévoit un budget pour l’ESIA et le travail communautaire, mais les études achevées, autorisations, données de référence et accords ne sont pas communiqués", "El promotor presupuesta la ESIA y el trabajo comunitario, pero no divulga estudios terminados, aprobaciones, datos de referencia ni acuerdos", "O promotor orçamenta a ESIA e o trabalho comunitário, mas não divulga estudos concluídos, aprovações, dados de referência ou acordos", "项目发起方为 ESIA 和社区工作编列预算，但未披露已完成的研究、批准、基线数据及协议"],
  ["The $45 million capital plan and projected returns are sponsor illustrations pending resource definition, feasibility, final transaction terms and independent model review", "Le plan de capital de 45 M$ et les rendements projetés sont des illustrations du porteur, sous réserve de la définition de ressource, de la faisabilité, des conditions finales et d’un examen indépendant du modèle", "El plan de capital de 45 M$ y los rendimientos proyectados son ilustraciones del promotor, pendientes de definición de recursos, viabilidad, términos finales y revisión independiente del modelo", "O plano de capital de US$ 45 milhões e os retornos projetados são ilustrações do promotor, pendentes de definição de recursos, viabilidade, termos finais e análise independente do modelo", "4,500 万美元资本计划及预计回报均为项目发起方示例，仍取决于资源量定义、可行性研究、最终交易条款及独立模型审查"],
];
for (const row of sciresRows) evidence(...row);

const sourceRows: [string, string, string, string, string][] = [
  ["Comicordia investment proposal, October 2024", "Proposition d’investissement Comicordia, octobre 2024", "Propuesta de inversión de Comicordia, octubre de 2024", "Proposta de investimento da Comicordia, outubro de 2024", "Comicordia 投资建议书，2024 年 10 月"],
  ["Comicordia investment proposal and PR 13578 geological report", "Proposition d’investissement Comicordia et rapport géologique PR 13578", "Propuesta de inversión de Comicordia e informe geológico PR 13578", "Proposta de investimento da Comicordia e relatório geológico PR 13578", "Comicordia 投资建议书及 PR 13578 地质报告"],
  ["PR 13578 geological report, October 2017", "Rapport géologique PR 13578, octobre 2017", "Informe geológico PR 13578, octubre de 2017", "Relatório geológico PR 13578, outubro de 2017", "PR 13578 地质报告，2017 年 10 月"],
  ["PR 13578 geological report", "Rapport géologique PR 13578", "Informe geológico PR 13578", "Relatório geológico PR 13578", "PR 13578 地质报告"],
  ["Musefu open-cast mining cost paper", "Note de coûts d’exploitation à ciel ouvert de Musefu", "Documento de costes de minería a cielo abierto de Musefu", "Documento de custos de mineração a céu aberto de Musefu", "Musefu 露天采矿成本文件"],
  ["Folder document review", "Examen des documents du dossier", "Revisión de documentos del expediente", "Análise dos documentos do dossiê", "项目文件夹资料审查"],
  ["Tilu preliminary technical geochemical study", "Étude technique géochimique préliminaire de Tilu", "Estudio técnico geoquímico preliminar de Tilu", "Estudo técnico geoquímico preliminar da Tilu", "Tilu 初步技术地球化学研究"],
  ["Historical study only", "Étude historique uniquement", "Solo estudio histórico", "Apenas estudo histórico", "仅有历史研究"],
  ["Sponsor investment deck, December 2025", "Présentation d’investissement du porteur, décembre 2025", "Presentación de inversión del promotor, diciembre de 2025", "Apresentação de investimento do promotor, dezembro de 2025", "项目发起方投资演示文稿，2025 年 12 月"],
  ["CAMI extract and sponsor investment deck", "Extrait CAMI et présentation d’investissement du porteur", "Extracto CAMI y presentación de inversión del promotor", "Extrato CAMI e apresentação de investimento do promotor", "CAMI 摘录及项目发起方投资演示文稿"],
  ["CAMI cadastral extract printed 21 April 2025", "Extrait cadastral CAMI imprimé le 21 avril 2025", "Extracto catastral CAMI impreso el 21 de abril de 2025", "Extrato cadastral CAMI impresso em 21 de abril de 2025", "CAMI 地籍摘录，打印于 2025 年 4 月 21 日"],
  ["Sponsor investment deck; no compliant resource disclosed", "Présentation du porteur ; aucune ressource conforme communiquée", "Presentación del promotor; no se divulga recurso conforme", "Apresentação do promotor; não é divulgado recurso conforme", "项目发起方演示文稿；未披露合规资源量"],
];
for (const row of sourceRows) evidence(...row);

const provenanceRows: [string, string, string, string, string][] = [
  ["Historical technical material and sponsor proposal", "Documents techniques historiques et proposition du porteur", "Material técnico histórico y propuesta del promotor", "Material técnico histórico e proposta do promotor", "历史技术资料及项目发起方建议书"],
  ["PR 13578 geological report; Comicordia investment proposal; Musefu operating-cost concept", "Rapport géologique PR 13578 ; proposition d’investissement Comicordia ; concept de coûts d’exploitation Musefu", "Informe geológico PR 13578; propuesta de inversión Comicordia; concepto de costes operativos de Musefu", "Relatório geológico PR 13578; proposta de investimento Comicordia; conceito de custos operacionais de Musefu", "PR 13578 地质报告；Comicordia 投资建议书；Musefu 运营成本概念文件"],
  ["October 2017 to October 2024; one concept paper undated", "Octobre 2017 à octobre 2024 ; une note conceptuelle non datée", "Octubre de 2017 a octubre de 2024; un documento conceptual sin fecha", "Outubro de 2017 a outubro de 2024; um documento conceptual sem data", "2017 年 10 月至 2024 年 10 月；一份概念文件未注明日期"],
  ["DESCO folder review recorded; independent verification not recorded", "Examen du dossier DESCO enregistré ; aucune vérification indépendante enregistrée", "Revisión del expediente DESCO registrada; no consta verificación independiente", "Análise do dossiê DESCO registada; não existe registo de verificação independente", "已记录 DESCO 文件夹审查；未记录独立核实"],
  ["Historical exploration study", "Étude historique d’exploration", "Estudio histórico de exploración", "Estudo histórico de exploração", "历史勘探研究"],
  ["Tilu Mining preliminary technical geochemical study", "Étude technique géochimique préliminaire de Tilu Mining", "Estudio técnico geoquímico preliminar de Tilu Mining", "Estudo técnico geoquímico preliminar da Tilu Mining", "Tilu Mining 初步技术地球化学研究"],
  ["Study describes 2010 fieldwork; current title evidence not supplied", "L’étude décrit les travaux de terrain de 2010 ; aucune preuve du titre actuel fournie", "El estudio describe trabajos de campo de 2010; no se aportó evidencia del título actual", "O estudo descreve trabalho de campo de 2010; não foi fornecida prova do título atual", "研究描述了 2010 年现场工作；未提供当前矿权证据"],
  ["Mining-cadastre extract and confidential sponsor investment presentation", "Extrait du cadastre minier et présentation d’investissement confidentielle du porteur", "Extracto del catastro minero y presentación confidencial del promotor", "Extrato do cadastro mineiro e apresentação confidencial do promotor", "矿业地籍摘录及项目发起方保密投资演示文稿"],
  ["CAMI certificate extract for PE 12423; Scires Mining investment deck", "Extrait du certificat CAMI pour PE 12423 ; présentation d’investissement Scires Mining", "Extracto del certificado CAMI de PE 12423; presentación de inversión de Scires Mining", "Extrato do certificado CAMI de PE 12423; apresentação de investimento da Scires Mining", "PE 12423 的 CAMI 证书摘录；Scires Mining 投资演示文稿"],
  ["CAMI extract printed 21 April 2025; sponsor deck dated December 2025", "Extrait CAMI imprimé le 21 avril 2025 ; présentation du porteur datée de décembre 2025", "Extracto CAMI impreso el 21 de abril de 2025; presentación del promotor de diciembre de 2025", "Extrato CAMI impresso em 21 de abril de 2025; apresentação do promotor datada de dezembro de 2025", "CAMI 摘录打印于 2025 年 4 月 21 日；项目发起方演示文稿日期为 2025 年 12 月"],
  ["DESCO source review recorded; independent legal, technical and financial verification not recorded", "Examen des sources DESCO enregistré ; aucune vérification juridique, technique ou financière indépendante enregistrée", "Revisión de fuentes DESCO registrada; no consta verificación jurídica, técnica o financiera independiente", "Análise das fontes DESCO registada; não existe registo de verificação jurídica, técnica ou financeira independente", "已记录 DESCO 来源审查；未记录独立法律、技术及财务核实"],
];
for (const row of provenanceRows) evidence(...row);

function localizeEvidenceField(field: EvidenceField, locale: Exclude<Locale, "en">): EvidenceField {
  const text = evidenceUi[locale];
  const translated = evidenceText.get(field.value)?.[locale];
  return {
    ...field,
    label: evidenceLabels[locale][field.label] ?? field.label,
    value: field.status === "not-disclosed" && field.value === "Not publicly disclosed" ? text.absent : translated ?? field.value,
    source: field.source ? evidenceText.get(field.source)?.[locale] ?? field.source : undefined,
  };
}

export function localizeInvestmentEvidence(evidence: InvestmentEvidence, locale: Locale): InvestmentEvidence {
  if (locale === "en") return evidence;
  return {
    thesis: evidenceText.get(evidence.thesis)?.[locale] ?? evidence.thesis,
    fields: evidence.fields.map((field) => localizeEvidenceField(field, locale)),
    risks: evidence.risks.map((field) => localizeEvidenceField(field, locale)),
    provenance: {
      classification: evidenceText.get(evidence.provenance.classification)?.[locale] ?? evidence.provenance.classification,
      source: evidenceText.get(evidence.provenance.source)?.[locale] ?? evidence.provenance.source,
      sourceDate: evidenceText.get(evidence.provenance.sourceDate)?.[locale] ?? evidence.provenance.sourceDate,
      reviewStatus: evidenceText.get(evidence.provenance.reviewStatus)?.[locale] ?? evidence.provenance.reviewStatus,
    },
  };
}
