interface KPICardProps {
    title: string;
    value: string | number;
}

export default function KPICard({
    title,
    value,
}: KPICardProps) {
    return (
        <div className="rounded-xl border border-cyan-500/30 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-400">
                {title}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-cyan-400">
                {value}
            </h2>
        </div>
    );
}