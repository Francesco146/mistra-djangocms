import favicon from "@assets/images/favicon.png";
import jsPDF from "jspdf";
import { useCallback } from "react";

export const usePDFGenerator = () => {
    const generatePDF = useCallback((questions, selectedAnswers, quizId) => {
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
            pdf.addImage(img, "PNG", margin, cursorY, logoWidth, logoHeight);

            cursorY += logoHeight + 20;

            pdf.setFontSize(18);
            pdf.text("Risultati del Quiz", pageWidth / 2, cursorY, {
                align: "center",
            });
            cursorY += 30;

            pdf.setFontSize(12);
            questions.forEach((q, idx) => {
                if (cursorY + 3 * lineHeight > pageHeight - margin) {
                    pdf.addPage();
                    cursorY = margin;
                }

                pdf.setFont(undefined, "bold");
                pdf.text(`Domanda ${idx + 1}: ${q.name}`, margin, cursorY);
                cursorY += lineHeight;

                const ans = q.answers.find(
                    (a) => a.id === selectedAnswers[idx]
                );
                const givenText = ans ? ans.text : "—";
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

            pdf.save(`risultati_quiz_${quizId}.pdf`);
        };
    }, []);

    return { generatePDF };
};
