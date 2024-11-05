import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import './CC.css';

export default function Bot() {
    const questions: string[] = [
        "What data structure uses LIFO?",
        "What is the worst-case time complexity of quicksort?",
        "What data structure is used for breadth-first search?",
        "Which algorithm is used for finding the shortest path?",
        "What tree structure is used for binary search?",
        "What data structure stores key-value pairs?",
        "What traversal method uses a stack?",
        "What algorithm is used for minimum spanning tree?",
        "What type of graph has no cycles?",
        "What data structure is a priority queue implemented as?",
        "What is the space complexity of a linked list?",
        "What is the best-case time complexity of insertion sort?",
        "What is the term for a collection of nodes connected by edges?",
        "What structure is used for backtracking algorithms?",
        "What is the average-case time complexity of mergesort?",
        "What type of tree has at most two children?",
        "What is the term for accessing elements by index in an array?",
        "What algorithm is used for searching in a sorted array?",
        "What type of data structure is a deque?",
        "What is the time complexity of accessing the first element in a linked list?",
        "What does BFS stand for?",
        "What is the main drawback of a hash table?",
        "What is the primary operation of a stack?",
        "What data structure is used for recursion?",
        "What is the time complexity of deleting an element from a binary search tree?",
        "What type of sorting is bubble sort?",
        "What is the worst-case time complexity of selection sort?",
        "What is the term for the depth of the deepest node in a tree?",
        "What algorithm is used to find strongly connected components?",
        "What data structure allows insertion and deletion at both ends?"
    ];

    const [question, setQuestion] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number>(0);
    const [divStyle, setDivStyle] = useState<React.CSSProperties>({
        backgroundColor: "rgba(172, 161, 162, 0.5)"
    });

    // Generate a random question on component mount
    useEffect(() => {
        setQuestion(questions[Math.floor(Math.random() * questions.length)]);
    }, []);

    const handleResponseChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setResponse(e.target.value);
    };

    async function generateAns() {
        try {
            setSubmitted(true);
            setAnswer("Loading...");
            const respo = await axios.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyA_CepmyrdZLsTbE9AM3nl4fPo_7N1DdqU",
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `${question} further part is answer of question ${response}. Provide feedback whether it is correct or wrong. If wrong, give the right answer in short. State correctness in the first line, followed by a short explanation.(use correct & wrong words only)`
                                }
                            ]
                        }
                    ]
                }
            );

            const ans = respo.data.candidates[0].content.parts[0].text;
            const firstLine = ans.split('\n')[0];
            setAnswer(ans);

            if (firstLine.toLowerCase().includes("correct")) {
                setDivStyle({ backgroundColor: "rgba(61, 225, 119, 0.8)", color: "black" });
                setScore(prevScore => prevScore + 4); // Increase score by 4
            } else if (firstLine.toLowerCase().includes("wrong")) {
                setDivStyle({ backgroundColor: "rgba(195, 33, 13, 0.8)", color: "white" });
                setScore(prevScore => prevScore - 1); // Decrease score by 1
            } else if (firstLine.toLowerCase().includes("incorrect")) {
                setDivStyle({ backgroundColor: "rgba(195, 33, 13, 0.8)", color: "white" });
                setScore(prevScore => prevScore - 1); // Decrease score by 1
            } else {
                setDivStyle({ backgroundColor: "rgba(172, 161, 162, 1)", color: "black" });
            }
        } catch (error) {
            console.error("Error generating answer:", error);
            setAnswer("Failed to generate answer.");
        }
    }

    function generateNext() {
        setResponse("");
        setQuestion(questions[Math.floor(Math.random() * questions.length)]);
        setAnswer("");
        setSubmitted(false);
    }

    return (
        <div className='container'>
            <div className="score">
                <h4>Score: {score}</h4> {/* Display score */}
            </div>

            <div className={`main ${submitted ? "expanded" : ""}`}>
                <div className="question">
                    <h3>Q. {question}</h3>
                </div>
                <div className={`response ${submitted ? "expanded" : ""}`}>
                    <textarea
                        placeholder='Write answer here'
                        value={response}
                        onChange={handleResponseChange}
                    ></textarea>
                </div>
                <div className="btn-1">
                    <button onClick={generateAns}>Submit</button>
                    <button id='next' onClick={generateNext}>Next</button>
                </div>
                {answer && (
                    <div className="ansP">
                        <div className="answer" style={divStyle}>
                            <p>{answer}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
