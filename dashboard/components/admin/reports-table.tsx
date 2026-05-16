'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronRight, Search } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { DamageReportRow, DamageSeverity, ReportStatus } from '@/lib/types'

const STATUS_LABEL: Record<ReportStatus, string> = {
  bekliyor: 'Bekliyor',
  incelendi: 'İncelendi',
  iletildi: 'İletildi',
}

const SEVERITY_LABEL: Record<DamageSeverity, string> = {
  kritik: 'Kritik',
  orta: 'Orta',
  hafif: 'Hafif',
}

function statusVariant(status: ReportStatus): 'default' | 'secondary' | 'outline' {
  if (status === 'iletildi') return 'default'
  if (status === 'incelendi') return 'secondary'
  return 'outline'
}

function severityClass(severity: DamageSeverity | null): string {
  if (severity === 'kritik') return 'bg-critical-bg text-critical-text border-transparent'
  if (severity === 'orta') return 'bg-medium-bg text-medium-text border-transparent'
  if (severity === 'hafif') return 'bg-low-bg text-low-text border-transparent'
  return ''
}

const columns: ColumnDef<DamageReportRow>[] = [
  {
    accessorKey: 'place_name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Mekan
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-ink">{row.original.place_name}</p>
        <p className="line-clamp-1 text-xs text-ink-muted">
          {row.original.description ?? row.original.ai_analysis ?? '—'}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'severity',
    header: 'Şiddet',
    cell: ({ row }) => {
      const s = row.original.severity
      if (!s) return <span className="text-ink-muted">—</span>
      return (
        <Badge variant="outline" className={severityClass(s)}>
          {SEVERITY_LABEL[s]}
        </Badge>
      )
    },
    filterFn: (row, id, value) => !value || row.getValue(id) === value,
  },
  {
    accessorKey: 'status',
    header: 'Durum',
    cell: ({ row }) => (
      <Badge variant={statusVariant(row.original.status)}>{STATUS_LABEL[row.original.status]}</Badge>
    ),
    filterFn: (row, id, value) => !value || row.getValue(id) === value,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Tarih
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-ink-muted">
        {new Date(row.original.created_at).toLocaleString('tr-TR')}
      </span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Link
        href={`/admin/reports/${row.original.id}`}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'text-crimson hover:text-crimson-dark',
        )}>
        Detay
        <ChevronRight className="ml-1 size-4" />
      </Link>
    ),
  },
]

export function ReportsTable({ data }: { data: DamageReportRow[] }) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 12 } },
  })

  const statusFilter = (table.getColumn('status')?.getFilterValue() as string) ?? 'all'
  const severityFilter = (table.getColumn('severity')?.getFilterValue() as string) ?? 'all'

  const counts = useMemo(
    () => ({
      total: data.length,
      bekliyor: data.filter((r) => r.status === 'bekliyor').length,
      kritik: data.filter((r) => r.severity === 'kritik').length,
    }),
    [data],
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-ink">Hasar Raporları</h1>
          <p className="text-sm text-ink-muted">
            {counts.total} kayıt · {counts.bekliyor} bekliyor · {counts.kritik} kritik
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brown" />
            <Input
              placeholder="Mekan veya açıklama ara..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="rounded-full border-border bg-white pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              table.getColumn('status')?.setFilterValue(v === 'all' ? undefined : v)
            }>
            <SelectTrigger className="w-full rounded-full sm:w-[140px]">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm durumlar</SelectItem>
              <SelectItem value="bekliyor">Bekliyor</SelectItem>
              <SelectItem value="incelendi">İncelendi</SelectItem>
              <SelectItem value="iletildi">İletildi</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={severityFilter}
            onValueChange={(v) =>
              table.getColumn('severity')?.setFilterValue(v === 'all' ? undefined : v)
            }>
            <SelectTrigger className="w-full rounded-full sm:w-[140px]">
              <SelectValue placeholder="Şiddet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm şiddet</SelectItem>
              <SelectItem value="kritik">Kritik</SelectItem>
              <SelectItem value="orta">Orta</SelectItem>
              <SelectItem value="hafif">Hafif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-surface hover:bg-surface">
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="text-brown">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-ink-muted">
                  Kayıt bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-ink-muted">
          Sayfa {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Önceki
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  )
}
