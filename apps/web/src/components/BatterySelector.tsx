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
        <select
            defaultValue="1300"
            onChange={(e) =>
                handleBatteryChange(
                    Number(e.target.value)
                )
            }
            className="rounded bg-zinc-900 p-2"
        >
            <option value="1300">
                1300 mAh
            </option>

            <option value="2000">
                2000 mAh
            </option>

            <option value="2500">
                2500 mAh
            </option>

            <option value="3000">
                3000 mAh
            </option>
        </select>
    );
}