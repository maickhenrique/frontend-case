import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";
import { v4 as uuidv4 } from 'uuid'; 

import logoImage from "../assets/logo.svg";
import { TODO_LIST } from "./initial-state";
import { ITodoTypes } from "./types";

import "./index.css";

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
  const [activeIndex, setActiveIndex] = useState(0);

  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  let debounceTimeout: NodeJS.Timeout;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInputValue(value);
  
    if (debounceTimeout) clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
      setItems(
        TODO_LIST.filter((item) =>
          item.title.toLowerCase().includes(value.toLowerCase()) ||
          item.description.props.children
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        )
      );
      setActiveIndex(0);
    }, 900); 
  };
  
  const handleSearch = (event?: React.FormEvent | React.MouseEvent) => {
    if (event) event.preventDefault(); 
    setSearch(searchInputValue);
  };

  const handleDeleteTask = (id: string) => {
    const editedItems: ItemType[] = items
      .filter((item) => item.id !== id)
      .map((item) => ({
        ...item,
        links: item.links?.map(link => ({
          name: link.name,
          url: link.url || ''
        })) || []
      }));

    setItems(editedItems);
  };
  
  
  const handleChangeTaskStatus = (id: string, status: ITodoTypes, index: number) => {
    const reversedStatus = status === "pending" ? "done" : "pending";
  
    const editedItems = items.map((item, i) => {
      if (item.id === id && i === index) {
        return { ...item, status: reversedStatus }; 
      }
      return item; 
    });
  
    setItems(editedItems);
  };
  

  useEffect(() => {
    if (search) {
      const normalizedSearch = search.trim().toLowerCase();

      setItems(
        TODO_LIST.filter((item) => {
          const titleText = item.title.trim().toLowerCase();
          const descriptionText = item.description?.toString().trim().toLowerCase() || "";
          const statusText = item.status.trim().toLowerCase();

          return (
            titleText.includes(normalizedSearch) ||
            descriptionText.includes(normalizedSearch) ||
            statusText.includes(normalizedSearch) ||
            item.links?.some((link) =>
              (link.name.trim().toLowerCase().includes(normalizedSearch) ||
               link.url?.trim().toLowerCase().includes(normalizedSearch))
            )
          );
        })
      );
      setActiveIndex(0);
    } else {
      setItems(TODO_LIST);
    }
  }, [search]);

  useEffect(() => {
    if (itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex, items]);

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowDown") {
      setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
    } else if (event.key === "ArrowUp") {
      setActiveIndex((prevIndex) =>
        prevIndex === 0 ? items.length - 1 : prevIndex - 1
      );
    } else if (event.key === "Enter" && items[activeIndex]) {
      handleChangeTaskStatus(items[activeIndex].id, items[activeIndex].status as ITodoTypes, activeIndex);
    }
  };

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
          Items obrigatórios marcados com asterisco (<strong>*</strong>)
        </p>
        <div className="todo__wrapper">
          <form className="todo__search" onSubmit={handleSearch} tabIndex={0}>
            <input
              id="search"
              placeholder="busca por texto..."
              value={searchInputValue}
              onChange={handleChange}
              tabIndex={0}
            />
            <button type="button" onClick={handleSearch}>buscar</button>
          </form>
          <ul className="todo__list" onKeyDown={handleKeyDown} tabIndex={0}>
            {items.length === 0 && (
              <span>
                <strong>Ops!!!</strong> Nenhum resultado foi encontrado
                &#128533;
              </span>
            )}
            {items.map((item, index) => {
              return (
                <li
                  key={uuidv4()} 
                  className={index === activeIndex ? "active" : ""}
                  style={{ background: index === activeIndex ? "#f0f0f0" : "inherit" }}
                  tabIndex={-1}
                  ref={(el) => (itemRefs.current[index] = el)}
                >
                  <span>
                    {index +1}
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
                        {item.links?.map((link) => (
                          <a key={link.name} target="_blank" href={link.url} tabIndex={0}>
                            {link.name}
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="todo__actions">
                      <button onClick={() => handleDeleteTask(item.id)} tabIndex={0}>delete</button>
                      <button
                        onClick={() => handleChangeTaskStatus(item.id, item.status as ITodoTypes, index)}
                        tabIndex={0}
                      >
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
