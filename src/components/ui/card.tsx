import * as React from "react";
import { cn } from "../../lib/utils";

// Fonte única do estilo base de "card" (Épico FE-8): antes reimplementado
// como `const cardCls = "..."` copiado em 7 telas diferentes. Exportado
// para uso em elementos não-`div` (botões/links que parecem card), onde o
// componente `Card` abaixo não se aplica diretamente.
export const cardBaseClass = "bg-white rounded-2xl border border-border-soft";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(cardBaseClass, className)} {...props} />;
}
