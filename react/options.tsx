import * as React from "react";
import * as ReactDOM from "react-dom";
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
    chrome.storage.sync.set({ tags });
  }, [tags]);

  const handleAdd = () => {
    if (newTag) {
      const tag: Tag = {
        name: newTag,
        selected: false,
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
  }

  return (
    <div>
      <input type="text" value={newTag} onChange={handleEditNewTag} />
      <button type="button" onClick={handleAdd}>
        Add
      </button>
      {tags && tags.length > 0 && tags.map((tag) => (
        <div key={tag.name}>
          <label>
            <input
              type="radio"
              checked={tag.selected}
              id={tag.name}
              value={tag.name}
              onChange={() => handleSelect(tag.name)}
            />
            {tag.name}
          </label>
          <input
            type="button"
            onClick={() => handleDelete(tag.name)}
            value="Borrar"
          />
        </div>
      ))}
    </div>
  );
};

function App() {
  return <Options />;
}

const mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);
