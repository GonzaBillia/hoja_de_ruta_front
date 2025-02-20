"use client";
import React, { useState } from "react";
import { useDepositos } from "@/api/deposito/hooks/useDepositos";
import { Deposito } from "@/api/deposito/types/deposito.types";
import useTiposBultos from "@/api/tipos-bulto/hooks/useTiposBulto";
import { TipoBulto } from "@/api/tipos-bulto/types/tiposBulto.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import useCreateQRCode from "@/api/qr-code/hooks/useCreateQRCode";
import useGenerateQRPdf from "@/api/pdf/hooks/useGeneratePDF";
import { GenerateQRPdfPayload } from "@/api/pdf/types/pdf.types";
import TablaGenerica from "@/components/common/table/table";
import { ColumnName } from "@/components/common/table/types/table";

const qrColumnName: ColumnName[] = [
    { key: "code", label: "Código", opcional: false },
];

const QRCodeBatchForm: React.FC = () => {
    // Estado del formulario
    const [selectedDeposito, setSelectedDeposito] = useState<Deposito | null>(null);
    const [selectedTipoBulto, setSelectedTipoBulto] = useState<TipoBulto | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);

    // Hooks para obtener información
    const { data: depositos, isLoading: depositosLoading, error: depositosError } = useDepositos();
    const { data: tiposBulto, isLoading: tiposBultoLoading, error: tiposBultoError } = useTiposBultos();

    // Hook para crear códigos QR
    const { mutate: createQRCode, status: createStatus } = useCreateQRCode();
    // Hook para generar PDF a partir de códigos QR
    const { mutate: generateQRPdf, status: pdfStatus } = useGenerateQRPdf();

    const handleCreateBatch = () => {
        if (!selectedDeposito || !selectedTipoBulto || !quantity) {
            alert("Complete todos los campos");
            return;
        }
        const payload = {
            codigo_deposito: selectedDeposito.codigo,
            deposito_id: selectedDeposito.id,
            tipo_bulto: selectedTipoBulto.codigo,
            tipo_bulto_id: selectedTipoBulto.id,
            cantidad: quantity,
        };
        createQRCode(payload, {
            onSuccess: (codes: string[]) => {
                setGeneratedCodes(codes);
            },
            onError: (error) => {
                console.error("Error al crear códigos QR", error);
            },
        });
    };

    const handleDownloadPdf = () => {
        if (generatedCodes.length === 0) {
            alert("No hay códigos generados para descargar");
            return;
        }
        const payload: GenerateQRPdfPayload = {
            qrCodes: generatedCodes,
        };
        generateQRPdf(payload, {
            onSuccess: (pdfBlob: Blob) => {
                const url = window.URL.createObjectURL(pdfBlob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "qr_codes.pdf";
                link.click();
                window.URL.revokeObjectURL(url);
                setGeneratedCodes([]);
            },
            onError: (error) => {
                console.error("Error generando PDF", error);
            },
        });
    };

    return (
        <div className="p-4 max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-bold text-center">Crear Lote de Códigos QR</h2>

            {/* Selección de Depósito */}
            <div>
                <Label className="block mb-1">Depósito</Label>
                {depositosLoading ? (
                    <p>Cargando depósitos...</p>
                ) : depositosError ? (
                    <p>Error al cargar depósitos</p>
                ) : (
                    <Select
                        value={selectedDeposito ? selectedDeposito.id.toString() : ""}
                        onValueChange={(value) => {
                            const dep = depositos?.find((d) => d.id === Number(value));
                            setSelectedDeposito(dep || null);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione un depósito" />
                        </SelectTrigger>
                        <SelectContent>
                            {depositos?.map((d) => (
                                <SelectItem key={d.id} value={d.id.toString()}>
                                    {d.codigo} - {d.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Selección de Tipo de Bulto */}
            <div>
                <Label className="block mb-1">Tipo de Bulto</Label>
                {tiposBultoLoading ? (
                    <p>Cargando tipos de bulto...</p>
                ) : tiposBultoError ? (
                    <p>Error al cargar tipos de bulto</p>
                ) : (
                    <Select
                        value={selectedTipoBulto ? selectedTipoBulto.id.toString() : ""}
                        onValueChange={(value) => {
                            const tipo = tiposBulto?.find((t) => t.id === Number(value));
                            setSelectedTipoBulto(tipo || null);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione un tipo de bulto" />
                        </SelectTrigger>
                        <SelectContent>
                            {tiposBulto?.map((t) => (
                                <SelectItem key={t.id} value={t.id.toString()}>
                                    {t.codigo} - {t.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Cantidad */}
            <div>
                <Label className="block mb-1">Cantidad de Códigos QR</Label>
                <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full"
                />
            </div>

            {/* Botón para crear el lote */}
            <Button onClick={handleCreateBatch} className="w-full" disabled={createStatus === "pending"}>
                {createStatus === "pending" ? "Creando lote..." : "Crear Lote"}
            </Button>

            {/* Mostrar lista de códigos generados y botón para descargar PDF */}
            {generatedCodes.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold">Códigos Generados:</h3>
                    <TablaGenerica
                        data={generatedCodes.map((code) => ({ code }))}
                        columnNames={qrColumnName}
                        showActions={false}
                        showFilter={false}
                        showPagination={false}
                    />
                    <Button
                        onClick={handleDownloadPdf}
                        className="mt-2 w-full"
                        disabled={pdfStatus === "pending"}
                    >
                        {pdfStatus === "pending" ? "Descargando..." : "Descargar Lote"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default QRCodeBatchForm;
