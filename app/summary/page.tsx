import Image from "next/image";
import combined from "./combined.json";

export default function Summary() {
  const all = combined.reduce((acc, cur) => ({ ...acc, ...cur }), {});

  return (
    <table>
      <thead>
        <tr>
          <th>Case</th>
          <th>Input prompt</th>
          <th colSpan={4}>Actual output</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(all).map(([key, value], index) => (
          <tr key={`${key}-${index}`}>
            <td>{index + 1}</td>
            <td>{key}</td>
            {(value as string[]).map((i) => (
              <td key={i}>
                <Image src={i} width={270} height={270} alt={key} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
