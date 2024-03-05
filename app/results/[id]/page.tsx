"use server";
import Image from "next/image";
import { revalidateTag } from "next/cache";
import Link from "next/link";
import "./page.css";

async function Images({ id }: { id: string }) {
  const res = await fetch(
    process.env.BACKEND_API + "/get-batch-result?id=" + id,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: ["get-batch-result" + id],
      },
    }
  );

  const {
    data: images,
  }: { data: { [key: string]: Array<string> } | undefined } = await res.json();

  if (!images) {
    await revalidateTag("get-batch-result" + id);
    return (
      <p>Generation in progress (1 min per prompt). Refresh the page later.</p>
    );
  }

  return (
    <>
      <table>
        {Object.keys(images).map((key) => (
          <tr key={key}>
            <td>{key}</td>
            {images[key].map((image) => (
              <td key={image}>
                <Image src={image} width={270} height={270} alt={key} />
              </td>
            ))}
          </tr>
        ))}
      </table>
    </>
  );
}

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <Images id={params.id} />
      <Link href="/">Back to home</Link>
    </div>
  );
}
