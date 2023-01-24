import React, { useEffect, useState } from 'react';
import './App.css';
import Select from "react-select";
import { server } from "./AxiosInstance";
import {SelectOption} from "./interfaces/SelectOption";
import {JokeResponse} from "./interfaces/JokeResponse";
import {LanguageResponse} from "./interfaces/LanguageResponse";

function App() {
    const [selectedType, setSelectedType] = useState<any>([]);
    const [jokeTypes, setJokeTypes] = useState<SelectOption[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<number | string>();
    const [languages, setLanguages] = useState<SelectOption[]>([]);
    const [joke, setJoke] = useState<string>("");

    useEffect(() => {
        const fetchJokeTypes = async () => {
            try {
                const response = await server.get("/jokeTypes");
                setJokeTypes(response.data.map((j: JokeResponse) => ({ value: j.jokeTypeId, label: j.jokeType })));
            } catch (error) {
                console.error(error);
            }
        };

        const fetchLanguages = async () => {
            try {
                const response = await server.get("/language");
                setLanguages(response.data.map((l: LanguageResponse) => ({ value: l.languageId, label: l.language })));
            } catch (error) {
                console.error(error);
            }
        };

        fetchJokeTypes();
        fetchLanguages();
    }, []);

    const handleTypeChange = (selected: any) => {
        setSelectedType(selected.map((t: SelectOption) => t.value));
    };

    const handleLanguageChange = (selected: any) => {
        setSelectedLanguage(selected.value);
    };

    const handleGetJoke = async () => {
        try {
            const response = await server.post("/joke", {
                jokeTypes: selectedType,
                language: selectedLanguage,
            });

            setJoke(response.data.joke);
        } catch (error) {
            setJoke("There is no Jokes with this parameters");
        }
    };

    return (
        <div className="App">
            <Select className="select" options={jokeTypes} isMulti={true} onChange={handleTypeChange} />
            <Select className="select" options={languages} onChange={handleLanguageChange} />
            <button className="btn" onClick={handleGetJoke}>Generate New One</button>
            <h1 className="jokeTitle">Joke:</h1>
            <p className="joke">{joke}</p>
        </div>
    );
}

export default App;