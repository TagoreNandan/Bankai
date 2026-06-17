export default function BatterySelector() {
    const handleBatteryChange = async (
        capacity: number
    ) => {
        await fetch(
            `${import.meta.env.VITE_API_URL}/config/battery/${capacity}`,
            {
                method: "POST",
            }
        );
    };

    return (
        <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 uppercase font-medium">CAPACITY:</span>
            <select
                defaultValue="1300"
                onChange={(e) =>
                    handleBatteryChange(
                        Number(e.target.value)
                    )
                }
                className="cursor-pointer rounded border border-[#1c2630] bg-[#10161d] px-3 py-1.5 font-mono text-[#00f3ff] outline-none transition-colors hover:border-[#00f3ff]/50"
            >
                <option value="1300">1300 mAh</option>
                <option value="2000">2000 mAh</option>
                <option value="2500">2500 mAh</option>
                <option value="3000">3000 mAh</option>
            </select>
        </div>
    );
}