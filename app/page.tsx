"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { saveAs } from "file-saver";
import Link from "next/link";

const randomElement = (myArray: Array<string>) =>
  myArray[Math.floor(Math.random() * myArray.length)];

interface Data {
  [key: string]: Array<string>;
}

export default function Home() {
  const [numGen, setNumGen] = useState(2);
  const [textarea, setTextarea] = useState("");
  const [format, setFormat] = useLocalStorage(
    "format",
    "A simple 128x128 grid pixel art image of a Bengal cat in a full-body sitting pose, %Eyes%, with %Clothes%, with %Hat%, with %Mouth%, with %Necklace%, accompanied by %Pet%"
  );
  const [data, setData] = useState<Data>({});
  const [ids, setIds] = useLocalStorage("ids", {});

  useEffect(() => {
    async function getData() {
      const data = await (await fetch(`/example.json`)).json();

      return data as Data;
    }

    getData().then((data) => {
      setData(data);

      if (!format) {
        setFormat(
          "A simple pixel art image of a cat, wearing %Clothes%, %Eyes%, wearing %Hat%, having %Mouth%, wearing %Necklace%, accompanied by %Pet%"
        );
      }
    });
  }, []);

  const generate = () => {
    let testcases = [];

    for (let i = 0; i < numGen; i++) {
      const randomise = Object.keys(data).reduce(
        (acc, cur) => ({ ...acc, [cur]: randomElement(data[cur]) }),
        {} as { [key: string]: string }
      );

      const testcase = Object.keys(data).reduce(
        (acc, cur) => acc.replace(RegExp(`%${cur}%`, "g"), randomise[cur]),
        format
      );

      testcases.push(testcase);
    }

    setTextarea(testcases.join("\n"));
  };

  const generateApi = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify(textarea.split("\n")),
    });

    const { data } = await res.json();

    setIds((prev) => ({ ...prev, [data]: data }));
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 1, marginRight: 20 }}>
          <label>
            Format
            <textarea
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            />
          </label>
          <label>
            Number of generations
            <input
              type="number"
              min={1}
              value={numGen}
              onChange={(e) => setNumGen(Number(e.target.value))}
            />
          </label>
          <br />
          <button onClick={generate}>Generate</button>
          <br />
          <textarea
            rows={30}
            value={textarea}
            onChange={(e) => setTextarea(e.target.value)}
          />
          <br />
          <button
            onClick={() => {
              navigator.clipboard.writeText(textarea);
            }}
          >
            Copy
          </button>
          <br />
          <button
            onClick={() => {
              const json = textarea.split("\n");

              var file = new File([JSON.stringify(json)], "prompts.json", {
                type: "application/json;charset=utf-8",
              });
              saveAs(file);
            }}
          >
            download JSON
          </button>
          <br />
          <button onClick={generateApi}>Send to generate api</button>
        </div>
        <div>
          <h3>Results</h3>
          <ul>
            {Object.keys(ids).map((key) => (
              <li key={key}>
                <Link href={`/results/${key}`}>{key}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
