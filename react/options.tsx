import * as React from "react";
import * as ReactDOM from "react-dom";

import "./options.scss";

type Tag = {
  name: string;
  selected: boolean;
};

const Options = () => {
  const [tags, setTags] = React.useState([]);
  const [newTag, setNewTag] = React.useState("");

  React.useEffect(() => {
    chrome.storage.sync.get("tags", (data) => {
      setTags(data.tags || []);
    });
  }, []);

  React.useEffect(() => {
    if (tags.length && !tags.find((tag) => tag.selected )) {
      const [firstTag, ...otherTags] = [...tags];
      setTags([{ ...firstTag, selected: true }, ...otherTags]);
    }
    chrome.storage.sync.set({ tags });
  }, [tags]);

  const handleAdd = () => {
    if (newTag && !tags.find((tag) => tag.name === newTag)) {
      const tag: Tag = {
        name: newTag,
        selected: tags.length === 0 || !tags.find((tag) => tag.selected),
      };
      setTags([...tags, tag]);
      setNewTag("");
    }
  };

  const handleDelete = (tagName) => {
    setTags(tags.filter((tag) => tag.name !== tagName));
  };

  const handleSelect = (tagName) => {
    tags?.forEach((tag) => {
      if (tag.name === tagName) {
        tag.selected = true;
      } else {
        tag.selected = false;
      }
      setTags([...tags]);
    });
  };

  const handleEditNewTag = (e) => {
    setNewTag(e.target.value);
  };

  return (
    <div className="frame">
      <div className="center">
        <section className="list-cmp">
          <header>
            <h2>Change Amazon Referal Tag</h2>
          </header>
          <input type="text" value={newTag} onChange={handleEditNewTag} />
          <button type="button" onClick={handleAdd}>
            Add
          </button>
          <ul className="list-cmp__list">
            {tags &&
              tags.length > 0 &&
              tags.map((tag) => (
                <li key={tag.name} className={tag.selected && "selected"}>
                  <div>
                    <label htmlFor={tag.name}>
                      <input
                        type="radio"
                        checked={tag.selected}
                        id={tag.name}
                        value={tag.name}
                        onChange={() => handleSelect(tag.name)}
                      />
                      <span>{tag.name}</span>
                    </label>

                    <span
                      className="delete"
                      onClick={() => handleDelete(tag.name)}
                    >
                      <i className="fa fa-trash"></i>
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

function App() {
  return <Options />;
}

const mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);
