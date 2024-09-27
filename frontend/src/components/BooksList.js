import axios from "axios";
import React, { useEffect, useState } from "react";
import Tbody from "./Tbody";

export default function BooksList() {
  const [books, setBooks] = useState(
    JSON.parse(localStorage.getItem("book")) || []
  );
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  async function getUrl() {
    const res = await axios("http://localhost:5000/books");
    const data = res.data;
    setBooks(data);
    try {
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }
  useEffect(() => {
    getUrl();
  }, []);
  // get localstorage function
  useEffect(() => {
    localStorage.setItem("book", JSON.stringify(books));
  }, [books]);

  /* post request add function and put request  basic on is edit stat*/

  async function handleAdd(e) {
    e.preventDefault();
    try {
      if (isEdit) {
        if (title === "" || author === "") {
          alert("please fill all field");
        } else {
          // If we are editing, send a PUT request
          await axios.put(`http://localhost:5000/books/${currentBookId}`, {
            title,
            author
          });
          setIsEdit(false);
          setCurrentBookId(null);
        }
      } else {
        if (title === "" || author === "") {
          alert("please fill all field");
        } else {
          // If  adding  book, send a POST request
          await axios.post("http://localhost:5000/books", {
            title,
            author
          });
        }
        getUrl();
        setTitle("");
        setAuthor("");
      }
    } catch (error) {
      console.error("Error adding/updating book:", error);
    }
  }

  /*  */
  /* delete handel delete request */
  async function handleDelete(id) {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this book?"
      );

      if (confirmed) {
        await axios.delete(`http://localhost:5000/books/${id}`);
        getUrl();
      }
    } catch (error) {
      console.log("error while delete", error);
    }
  }

  /* egit funtion put previous value to inputs */
  async function handleuptodate(id) {
    const prevValue = books.find((item) => item.id === id);
    if (prevValue) {
      setIsEdit(true);
      setTitle(prevValue.title);
      setAuthor(prevValue.author);
      setCurrentBookId(id);
    }
  }
  /* //////////////////////////////////////////////////////////////// */
  return (
    <div className="wrapper">
      <form action="" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
        />
        <input
          type="text"
          placeholder="Athour"
          onChange={(e) => {
            setAuthor(e.target.value);
          }}
          value={author}
        />
        <button type="submit"> {!isEdit ? "Add Book" : "Uptodate Book"}</button>
      </form>
      <Tbody />
      {books &&
        books.map((item, index) => {
          const { title, author, id } = item;
          return (
            <ul key={index}>
              <li>{index + 1}</li>

              <li>{title}</li>
              <li>{author}</li>
              <div className="button-div">
                <button onClick={() => handleuptodate(id)}>Edit</button>
                <button onClick={() => handleDelete(id)}>Delete</button>
              </div>
            </ul>
          );
        })}
    </div>
  );
}
