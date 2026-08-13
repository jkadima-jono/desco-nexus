"use client";

import Button from "@/components/ui/Button";

import { useEffect } from "react";
import { useI18n } from "@/components/I18nProvider";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useI18n();
  const copy = {
    en: ["Service interruption", "This page could not be loaded.", "No information was submitted. Retry the request, or return to the current project files if the problem continues.", "Retry", "Review project files"],
    fr: ["Interruption du service", "Cette page n’a pas pu être chargée.", "Aucune information n’a été envoyée. Réessayez ou revenez aux dossiers de projets si le problème persiste.", "Réessayer", "Examiner les dossiers"],
    es: ["Interrupción del servicio", "No se pudo cargar esta página.", "No se envió ninguna información. Vuelva a intentarlo o regrese a los expedientes de proyectos si el problema continúa.", "Reintentar", "Revisar expedientes"],
    pt: ["Interrupção do serviço", "Não foi possível carregar esta página.", "Nenhuma informação foi enviada. Tente novamente ou volte aos dossiês de projetos se o problema persistir.", "Tentar novamente", "Analisar dossiês"],
    zh: ["服务中断", "无法加载此页面。", "未提交任何信息。请重试；如问题持续，请返回当前项目文件。", "重试", "查看项目文件"],
  }[locale];
  useEffect(() => {
    console.error("Application route error", error.digest ?? error.name);
  }, [error]);
  return (
    <div className="public-container flex min-h-[55vh] items-center justify-center py-16">
      <div role="alert" className="max-w-xl  border border-charcoal/10 bg-white p-8 text-center ">
        <p className="eyebrow text-brandred">{copy[0]}</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-ink">{copy[1]}</h1>
        <p className="mt-3 text-sm leading-6 text-slate">{copy[2]}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={reset} className="button-primary">{copy[3]}</Button>
          <Button href="/opportunities" className="button-secondary">{copy[4]}</Button>
        </div>
      </div>
    </div>
  );
}
