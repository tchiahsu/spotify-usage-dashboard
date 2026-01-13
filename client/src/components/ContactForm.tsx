import { useState } from 'react';

export default function ContactForm() {
  const [result, setResult] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "8eca2143-ce44-42d2-bcbd-0c0d293b481d");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    setResult(data.success ? "Success! You will be notified when you are given access!" : "An error has occurred. Please try again later.");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col justify-center items-center gap-5 w-full -my-4 mb-2 md:mb-0"
    >
      <div className="flex flex-row gap-3 mt-5 w-full justify-center">
        <input
          type="email"
          name="Spotify Email Address"
          placeholder="Insert Spotify Email Address"
          className="bg-white w-full text-gray-600 px-3 rounded-lg focus:outline-2 focus:ring-0 focus:outline-[#1DB954]"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:scale-105 active:scale-100 cursor-pointer"
        >
          Submit
        </button>
      </div>
      <p className="text-white tracking-wide">{result}</p>
    </form>
  );
}