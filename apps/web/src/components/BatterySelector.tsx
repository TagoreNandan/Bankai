export default function BatterySelector() {
    async function setBattery(
        capacity: number
    ) {
        await fetch(
            `https://bankai-oaoj.onrender.com/config/battery/${capacity}`
            {
                method: "POST",
            }
        );
    }

    return (
        <select
            defaultValue="1300"
            onChange={(e) =>
                setBattery(
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