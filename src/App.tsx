import "@picocss/pico";
import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;
const placeholder = "What do engineer cofounders look for in a cofounder?";

function App() {
	const [embedding, setEmbedding] = useState("openai");
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const ask = async () => {
		// const url = `${API_URL}/ask?question=${question}&embedding=${embeddingType}`;
		// fetch(url)
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		console.log(data);
		// 	});
		if (!question.length || isLoading) return;

		setAnswer("");
		setIsLoading(true);
		const url = `${API_URL}/ask`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ question, embedding }),
		});
		const data = await response.json();
		setAnswer(data.answer);
		setIsLoading(false);
	};

	const handleKeyDown = (event: any) => {
		if (event.key === "Enter") {
			event.preventDefault();
			ask();
		} else if (event.key === "Tab" && !question.length) {
			event.preventDefault();
			setQuestion(placeholder);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown, false);
		return () => {
			document.removeEventListener("keydown", handleKeyDown, false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [question]);

	return (
		<div className="App">
			<main className="container">
				<h1>Startup School - Ask Me Anything</h1>

				<label htmlFor="question">
					What do you want to know?
					<textarea
						id="question"
						name="question"
						placeholder="What do engineer cofounders look for in a cofounder?"
						required
						onChange={(e) => setQuestion(e.target.value)}
						maxLength={255}
						value={question}
					></textarea>
				</label>

				<label htmlFor="embedding-type">
					Which embedding model do you want to use?
					<select defaultValue={embedding} onChange={(e) => setEmbedding(e.target.value)}>
						<option value="openai">OpenAI</option>
						<option value="cohere">Cohere.ai</option>
					</select>
				</label>

				<button onClick={ask} disabled={!question.length || isLoading} aria-busy={isLoading}>
					{isLoading ? "Thinking..." : "Ask"}
				</button>

				<br />
				{!!answer.length && (
					<>
						<h2>Answer</h2>
						<p>{answer}</p>
					</>
				)}
			</main>
		</div>
	);
}

export default App;
