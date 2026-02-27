<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MovementsExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths, WithTitle
{
    public function __construct(
        private Collection $movements
    ) {}
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return $this->movements->map(fn($m) => [
            'producto' => $m->product->nombre,
            'tipo'     => ucfirst($m->tipo),
            'cantidad' => $m->cantidad,
            'motivo'   => $m->motivo ?? '-',
            'fecha'    => $m->fecha,
        ]);
    }

    public function headings():array
    {
        return ['Producto', 'Tipo', 'Cantidad', 'Motivo', 'Fecha y Hora'];
    }

    public function styles(Worksheet $sheet)
    {
        $totalRows = $sheet->getHighestRow();

        $sheet->getStyle('A1:E1')->applyFromArray([
            'font' => [
                'bold'  => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size'  => 12,
            ],
            'fill' => [
                'fillType'   => 'solid',
                'startColor' => ['rgb' => '2563EB'],
            ],
            'alignment' => [
                'horizontal' => 'center',
                'vertical'   => 'center',
            ],
        ]);

        for ($i = 2; $i <= $totalRows; $i++) {
            $color = $i % 2 === 0 ? 'EFF6FF' : 'FFFFFF';
            $sheet->getStyle("A{$i}:E{$i}")->applyFromArray([
                'fill' => [
                    'fillType'   => 'solid',
                    'startColor' => ['rgb' => $color],
                ],
            ]);
        }

        $sheet->getStyle("A1:E{$totalRows}")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => 'thin',
                    'color'       => ['rgb' => 'BFDBFE'],
                ],
            ],
        ]);

        return [];
    }

    public function columnWidths():array
    {
        return [
            'A' => 30,
            'B' => 15,
            'C' => 15,
            'D' => 35,
            'E' => 25,
        ];
    }

    public function title():string
    {
        return 'Reporte de Movimientos';
    }
}
