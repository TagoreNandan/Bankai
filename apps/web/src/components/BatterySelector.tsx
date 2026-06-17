export default function BatterySelector() {
    async function setBattery(
        capacity: number
    ) {
        await fetch(
            `http://localhost:8000/config/battery/${capacity}`,
            {
                method: "POST",
            }
        );
    }

    return (
        <select
            onChange={(e) =>
                setBattery(
                    Number(e.target.value)
                )
            }
            className="rounded bg-zinc-900 p-2"
        >
            <option value="3000">
                3000 mAh
            </option>

            <option value="6000" selected>
                6000 mAh
            </option>

            <option value="10000">
                10000 mAh
            </option>
        </select>
    );
}