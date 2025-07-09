// We use the '?inline' query to force Vite to import the image as a base64 data URL.
// This is necessary because the React app is embedded as a Django CMS plugin,
// and may be served from a different host or path than the Vite dev server.
import favicon from "@assets/images/favicon.png?inline";
import jsPDF from "jspdf";
import { useCallback } from "react";

function stripHtml(html) {
    if (!html) return "";
    return html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&");
}

export const usePDFGenerator = () => {
    const generatePDF = useCallback(
        (questions, selectedAnswers, executionId, age, sex) => {
            const pdf = new jsPDF({
                unit: "pt",
                format: "a4",
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 40;
            const lineHeight = 16;
            let cursorY = margin;

            const img = new Image();
            img.src = favicon;
            img.onload = () => {
                const logoWidth = 50;
                const logoHeight = (img.height * logoWidth) / img.width;
                pdf.addImage(
                    img,
                    "PNG",
                    margin,
                    cursorY,
                    logoWidth,
                    logoHeight
                );

                cursorY += logoHeight + 20;

                pdf.setFontSize(18);
                pdf.text("Risultati del Quiz", pageWidth / 2, cursorY, {
                    align: "center",
                });
                cursorY += 30;

                pdf.setFontSize(12);
                pdf.setFont(undefined, "bold");
                pdf.text(`ID Esecuzione Test:`, margin, cursorY);
                pdf.setFont(undefined, "normal");
                pdf.text(`${executionId}`, margin + 120, cursorY);

                pdf.setFont(undefined, "bold");
                pdf.text(`Età:`, margin + 200, cursorY);
                pdf.setFont(undefined, "normal");
                pdf.text(`${age ?? "—"}`, margin + 240, cursorY);

                pdf.setFont(undefined, "bold");
                pdf.text(`Sesso:`, margin + 300, cursorY);
                pdf.setFont(undefined, "normal");
                pdf.text(`${sex ?? "—"}`, margin + 350, cursorY);

                cursorY += 24;

                pdf.setFontSize(12);
                questions.forEach((q, idx) => {
                    if (cursorY + 3 * lineHeight > pageHeight - margin) {
                        pdf.addPage();
                        cursorY = margin;
                    }

                    const questionText = stripHtml(q.name);
                    pdf.setFont(undefined, "bold");
                    pdf.text(
                        `Domanda ${idx + 1}: ${questionText}`,
                        margin,
                        cursorY
                    );
                    cursorY += lineHeight;

                    const ans = q.answers.find(
                        (a) => a.id === selectedAnswers[q.id]
                    );
                    const givenText = ans ? stripHtml(ans.text) : "—";
                    pdf.setFont(undefined, "normal");
                    pdf.text(
                        `Risposta fornita: ${givenText}`,
                        margin + 10,
                        cursorY
                    );
                    cursorY += lineHeight;

                    const isCorrect = ans && ans.score === "1.00";
                    pdf.text(
                        `Risultato: ${isCorrect ? "Corretto" : "Sbagliato"}`,
                        margin + 10,
                        cursorY
                    );
                    cursorY += lineHeight + 10;
                });

                pdf.save(`risultati_esecuzione_${executionId}.pdf`);
            };
        },
        []
    );

    return { generatePDF };
};
