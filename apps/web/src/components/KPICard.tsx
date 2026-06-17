interface KPICardProps {
    title: string;
    value: string | number;
}

export default function KPICard({
    title,
    value,
}: KPICardProps) {
    return (
        <div className="rounded-xl border border-[#1c2630] bg-[#10161d] py-2 px-3.5 font-mono transition-all duration-300 hover:border-[#00f3ff]/30">
            <span className="text-[9px] text-zinc-500 uppercase block font-semibold tracking-wider">
                {title}
            </span>

            <h2 className="mt-0.5 text-xl font-extrabold text-[#00f3ff] tracking-tight glow-cyan">
                {value}
            </h2>
        </div>
    );
}