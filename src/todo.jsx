import { useEffect, useReducer, useRef } from "react";

const initialState = {
  items: [],
  inputValue: "",
  updateIndex: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "change": {
      return {
        ...state,
        inputValue: action.payload,
      };
    }
    case "submit": {
      if (state.inputValue === "") return state;

      if (state.updateIndex !== null) {
        const updatedItems = state.items.map((item, index) =>
          index === state.updateIndex ? state.inputValue : item
        );
        return {
          ...state,
          items: updatedItems,
          inputValue: "",
          updateIndex: null,
        };
      } else {
        // Add new item
        localStorage.setItem("inputValue", state.inputValue);
        sessionStorage.setItem("inputValue", state.inputValue);
        return {
          ...state,
          items: [...state.items, state.inputValue],
          inputValue: "",
        };
      }
    }
    case "delete": {
      const filteredItems = state.items.filter(
        (item, index) => index !== action.payload
      );
      return {
        ...state,
        items: filteredItems,
      };
    }
    case "update": {
      return {
        ...state,
        updateIndex: action.payload,
        inputValue: state.items[action.payload],
      };
    }
    default:
      return state;
  }
}

function Todo() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, [state.updateIndex]);

  function onSubmitHandle(e) {
    e.preventDefault();
    dispatch({ type: "submit" });
  }

  function onInputChange(e) {
    dispatch({ type: "change", payload: e.target.value });
  }

  function onHandleDelete(index) {
    dispatch({ type: "delete", payload: index });
  }

  function onHandleUpdate(index) {
    dispatch({ type: "update", payload: index });
  }

  console.log("fdadsf");
  return (
    <div className="main-div">
      <div className="form-div">
        <form onSubmit={onSubmitHandle}>
          <input
            className="input"
            type="text"
            placeholder="input todos"
            value={state.inputValue}
            onChange={onInputChange}
            ref={inputRef}
          />
          <button type="submit">
            {state.updateIndex !== null ? "Update" : "Submit"}
          </button>
        </form>
        <div>
          {state.items.map((itm, index) => (
            <div key={index}>
              {itm}
              <button onClick={() => onHandleDelete(index)}>Delete</button>
              <button onClick={() => onHandleUpdate(index)}>Update</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Todo;
