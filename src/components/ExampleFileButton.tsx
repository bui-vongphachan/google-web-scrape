"use client";

export default function ExampleFileButton() {
  const onClick = async () => {
    const response = await fetch("/api/fetchGoogle");

    const data = await response.json();

    console.log("response", response);

    console.log("data", data);
    /*     const corsProxyUrl = "https://cors-anywhere.herokuapp.com/";
    const url = `${corsProxyUrl}https://www.google.com/search?q=openai+GPT-3`;

    const response = await fetch(url, {
      headers: { "x-requested-with": "xmlhttprequest" },
    });
    const html = await response.text();

    console.log("html", html); */
  };
  return (
    <div>
      <button onClick={onClick}> Download example file </button>
    </div>
  );
}
