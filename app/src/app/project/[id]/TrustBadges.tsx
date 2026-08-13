"use client";

import Button from "@/components/ui/Button";

import { useEffect, useRef, useState } from "react";
import { MECHANISM_LABELS } from "@/lib/verification";
import type { Locale } from "@/lib/i18n";

type Claim = {
  label: string;
  claim: string;
  verificationType: string;
  source: string;
  verifiedBy: string;
  checked: string;
  limitations: string;
};

const TRUST_COPY: Record<Locale, {
  evidenceReviewed: string; identityClaim: string; identityType: string; adminSource: string; fixtureSource: string;
  notIndependent: string; reviewedByAdmin: string; selfReported: string; verificationLimitation: string;
  government: string; involvementType: string; mechanismMissing: string; supportType: string; sponsorSource: string;
  governmentLimitation: string; view: string; dialog: string; close: string;
  labels: [string, string, string, string, string, string, string];
}> = {
  en: {
    evidenceReviewed: "✓ Evidence reviewed", identityClaim: "Sponsor identity and company registration reviewed", identityType: "Identity and company verification",
    adminSource: "Reviewed by a Compass administrator; no external eKYC or registry provider is connected", fixtureSource: "Demo fixture; no external verification provider is connected",
    notIndependent: "Not independently verified", reviewedByAdmin: "Reviewed by an administrator", selfReported: "Self-reported demonstration data",
    verificationLimitation: "A Compass review records the stated evidence and scope. It is not an independent third-party verification.",
    government: "◆ Government involvement", involvementType: "Type of involvement", mechanismMissing: "mechanism not specified", supportType: "Support-mechanism classification",
    sponsorSource: "Sponsor-declared in the listing", governmentLimitation: "An executed support instrument must be reviewed before government involvement can be treated as verified.",
    view: "View verification evidence", dialog: "Verification details", close: "Close verification details",
    labels: ["Claim", "Verification type", "Source", "Reviewed by", "Status", "Limitations", "Sponsor"],
  },
  fr: {
    evidenceReviewed: "✓ Preuves examinées", identityClaim: "Identité du porteur et immatriculation de la société examinées", identityType: "Vérification de l’identité et de la société",
    adminSource: "Examen par un administrateur Compass; aucun prestataire eKYC ou registre externe n’est connecté", fixtureSource: "Données de démonstration; aucun prestataire externe de vérification n’est connecté",
    notIndependent: "Aucune vérification indépendante", reviewedByAdmin: "Examiné par un administrateur", selfReported: "Données de démonstration autodéclarées",
    verificationLimitation: "L’examen Compass consigne les preuves et le périmètre déclarés. Il ne constitue pas une vérification indépendante.",
    government: "◆ Implication publique", involvementType: "Type d’implication", mechanismMissing: "mécanisme non précisé", supportType: "Classification du mécanisme de soutien",
    sponsorSource: "Déclaré par le porteur dans la fiche", governmentLimitation: "L’instrument de soutien signé doit être examiné avant de considérer l’implication publique comme vérifiée.",
    view: "Voir les éléments de vérification", dialog: "Détails de la vérification", close: "Fermer les détails de la vérification",
    labels: ["Déclaration", "Type de vérification", "Source", "Examiné par", "Statut", "Limites", "Porteur"],
  },
  es: {
    evidenceReviewed: "✓ Evidencia revisada", identityClaim: "Identidad del promotor y registro de la sociedad revisados", identityType: "Verificación de identidad y sociedad",
    adminSource: "Revisado por un administrador de Compass; no hay proveedor externo eKYC o registral conectado", fixtureSource: "Datos de demostración; no hay proveedor externo de verificación conectado",
    notIndependent: "Sin verificación independiente", reviewedByAdmin: "Revisado por un administrador", selfReported: "Datos de demostración autodeclarados",
    verificationLimitation: "La revisión de Compass registra la evidencia y el alcance declarados. No es una verificación independiente.",
    government: "◆ Participación pública", involvementType: "Tipo de participación", mechanismMissing: "mecanismo no especificado", supportType: "Clasificación del mecanismo de apoyo",
    sponsorSource: "Declarado por el promotor en la ficha", governmentLimitation: "Debe revisarse el instrumento de apoyo firmado antes de considerar verificada la participación pública.",
    view: "Ver evidencia de verificación", dialog: "Detalles de verificación", close: "Cerrar detalles de verificación",
    labels: ["Declaración", "Tipo de verificación", "Fuente", "Revisado por", "Estado", "Limitaciones", "Promotor"],
  },
  pt: {
    evidenceReviewed: "✓ Evidência analisada", identityClaim: "Identidade do promotor e registo da sociedade analisados", identityType: "Verificação de identidade e sociedade",
    adminSource: "Analisado por um administrador da Compass; não existe fornecedor externo de eKYC ou registo ligado", fixtureSource: "Dados de demonstração; não existe fornecedor externo de verificação ligado",
    notIndependent: "Sem verificação independente", reviewedByAdmin: "Analisado por um administrador", selfReported: "Dados de demonstração autodeclarados",
    verificationLimitation: "A análise da Compass regista a evidência e o âmbito declarados. Não constitui verificação independente.",
    government: "◆ Participação pública", involvementType: "Tipo de participação", mechanismMissing: "mecanismo não especificado", supportType: "Classificação do mecanismo de apoio",
    sponsorSource: "Declarado pelo promotor na ficha", governmentLimitation: "O instrumento de apoio assinado deve ser analisado antes de a participação pública ser considerada verificada.",
    view: "Ver evidência de verificação", dialog: "Detalhes da verificação", close: "Fechar detalhes da verificação",
    labels: ["Declaração", "Tipo de verificação", "Fonte", "Analisado por", "Estado", "Limitações", "Promotor"],
  },
  zh: {
    evidenceReviewed: "✓ 已审查证据", identityClaim: "已审查项目发起方身份及公司注册资料", identityType: "身份与公司核查",
    adminSource: "由 Compass 管理员审查；尚未接入外部电子身份识别或注册机构", fixtureSource: "演示数据；尚未接入外部核查机构",
    notIndependent: "未经独立核实", reviewedByAdmin: "由管理员审查", selfReported: "发起方自行申报的演示数据",
    verificationLimitation: "Compass 审查仅记录所述证据及范围，不构成第三方独立核实。",
    government: "◆ 政府参与", involvementType: "参与形式", mechanismMissing: "未说明机制", supportType: "支持机制分类",
    sponsorSource: "由项目发起方在项目资料中申报", governmentLimitation: "在政府参与被视为已核实前，必须审查已签署的支持文件。",
    view: "查看核查证据", dialog: "核查详情", close: "关闭核查详情",
    labels: ["声明", "核查类型", "来源", "审查人", "状态", "限制", "项目发起方"],
  },
};

export default function TrustBadges({
  verified,
  verifiedBy,
  verifiedAt,
  verificationNote,
  governmentBacked,
  govMechanism,
  sponsor,
  locale,
}: {
  verified: boolean;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  verificationNote?: string;
  governmentBacked: boolean;
  govMechanism: string | null;
  sponsor: string;
  locale: Locale;
}) {
  const copy = TRUST_COPY[locale];
  const [open, setOpen] = useState<Claim | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(null);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  const claims: Claim[] = [];
  if (verified) {
    claims.push({
      label: copy.evidenceReviewed,
      claim: verificationNote || copy.identityClaim,
      verificationType: copy.identityType,
      source: verifiedBy
        ? copy.adminSource
        : copy.fixtureSource,
      verifiedBy: verifiedBy ? verifiedBy + (verifiedAt ? " · " + new Date(verifiedAt).toLocaleDateString(locale) : "") : copy.notIndependent,
      checked: verifiedBy ? copy.reviewedByAdmin : copy.selfReported,
      limitations: copy.verificationLimitation,
    });
  }
  if (governmentBacked) {
    claims.push({
      label: copy.government,
      claim: copy.involvementType + ": " + (MECHANISM_LABELS[govMechanism ?? ""] ?? copy.mechanismMissing),
      verificationType: copy.supportType,
      source: copy.sponsorSource,
      verifiedBy: copy.notIndependent,
      checked: copy.selfReported,
      limitations: copy.governmentLimitation,
    });
  }
  return (
    <>
      {claims.map((c) => (
        <Button
          key={c.label}
          onClick={(event) => {
            triggerRef.current = event.currentTarget;
            setOpen(c);
          }}
          className="text-gold underline decoration-dotted underline-offset-2 hover:text-white focus-visible:ring-2 focus-visible:ring-gold "
          aria-haspopup="dialog"
          title={copy.view}
        >
          {c.label}
        </Button>
      ))}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={copy.dialog + ": " + open.label}
          className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-6 normal-case tracking-normal"
          onClick={() => setOpen(null)}
        >
          <div
            ref={dialogRef}
            className="bg-white text-charcoal  p-6 max-w-md w-full "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="font-display font-bold text-lg">{open.label}</h2>
              <Button ref={closeRef} onClick={() => setOpen(null)} aria-label={copy.close} className="min-h-11 min-w-11  text-wgray hover:bg-mist hover:text-charcoal text-xl leading-none">×</Button>
            </div>
            <dl className="space-y-2 text-sm font-normal normal-case">
              {[
                [copy.labels[0], open.claim],
                [copy.labels[1], open.verificationType],
                [copy.labels[2], open.source],
                [copy.labels[3], open.verifiedBy],
                [copy.labels[4], open.checked],
                [copy.labels[5], open.limitations],
                [copy.labels[6], sponsor],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-bold uppercase tracking-wider text-wgray">{k}</dt>
                  <dd className="leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </>
  );
}
