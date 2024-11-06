import { useState, useEffect, ChangeEvent } from "react";
import logoImage from "../assets/logo.svg";
import { TODO_LIST } from "./initial-state";
import { ITodoTypes } from "./types";

import "./index.css";

// Definição da interface do item
interface ItemType {
  id: string;
  ref: string;
  title: string;
  description: JSX.Element;
  status: string;
  required: boolean;
  links?: { name: string; url: string }[];
}

function Todo() {
  const [items, setItems] = useState(TODO_LIST);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [search, setSearch] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchInputValue);
  };

  const handleDeleteTask = (id: string) => {
    const editedItems: ItemType[] = [];
    
    items.map((item) => {
      if (item.id !== id) {
        const updatedItem: ItemType = {
          ...item,
          links: item.links?.map(link => ({
            name: link.name,
            url: link.url || ''  
          })) || []  
        };
  
        editedItems.push(updatedItem);
      }
    });

    setItems(editedItems);
  };
  
  const handleChangeTaskStatus = (id: string, status: ITodoTypes) => {
    const reversedStatus = status === "pending" ? "done" : "pending";
    const editedItems = [];
  
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        editedItems.push({
          ...items[i],
          status: reversedStatus,
        });
      } else {
        editedItems.push(items[i]);
      }
    }
  
    setItems(editedItems);
  };  

  // useEffect(() => {
  //   if (search || items)
  //     setItems((currentItems) => [
  //       ...currentItems,
  //       ...TODO_LIST.filter((item) => item.title.includes(search)),
  //     ]);
  // }, [search, items]);

  useEffect(() => {
    if (search) {
      setItems(TODO_LIST.filter((item) => item.title.includes(search)));
    }
  }, [search]);

  return (
    <main id="page" className="todo">
      <div>
        <img src={logoImage} alt="Cora" title="Cora"></img>
        <h1>Weekly to-do list &#128467;</h1>
        <h2>
          Bem-vindo ao nosso produto <i>fake</i> de <strong>to-do</strong> list
        </h2>
        <p>
          Marque como{" "}
          <strong>
            <u>done</u>
          </strong>{" "}
          as tasks que você conseguir concluir (elas já precisam renderizar com
          o status <strong>done</strong>)
        </p>
        <p className="disclaimer">
          Items obrigatórios marcados com arteristico (<strong>*</strong>)
        </p>
        <div className="todo__wrapper">
          <form className="todo__search" onSubmit={handleSearch}>
            <input
              id="search"
              placeholder="busca por texto..."
              value={searchInputValue}
              onChange={handleChange}
            />
            <button type="submit">buscar</button>
          </form>
          <ul className="todo__list">
            {items.length === 0 && (
              <span>
                <strong>Ops!!!</strong> Nenhum resultado foi encontrado
                &#128533;
              </span>
            )}
            {items.map((item, i) => {
              return (
                <li key={item.id}>
                  <span>
                    {i + 1}
                    {item.required ? "*" : ""}.
                  </span>
                  <div className="todo__content">
                    <h3>
                      {item.title}
                      <span data-type={item.status}>{item.status}</span>
                    </h3>
                    <p>{item.description}</p>
                    {item.links && item.links.length > 0 && (
                      <div className="todo__links">
                        {item.links.map((link) => (
                          <a key={link.name} target="_blank" href={link.url}>
                            {link.name}
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="todo__actions">
                      <button onClick={() => handleDeleteTask(item.id)}>delete</button>
                      <button onClick={() => handleChangeTaskStatus(item.id, item.status as ITodoTypes)}>
                        change to{" "}
                        <strong>
                          <u>{item.status === "done" ? "pending" : "done"}</u>
                        </strong>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
}

export default Todo;
