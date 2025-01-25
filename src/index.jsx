import { createElement } from "@/utils/createElement";
import useState from "@/hooks/useState";

export default function App() {
  const [toDoList, setToDoList] = useState([]);
  const [toDo, setToDo] = useState('');

  const addToDoList = () => {
    if (toDo.trim() === '') return;

    setToDoList(prevList => [...prevList, { text: toDo, checked: false }]);
    setToDo('');
  };

  const deleteToDoList = (index) => {
    const newToDoList = toDoList.filter((_, i) => i !== index);
    setToDoList(newToDoList);
  };

  const deleteAllToDoList = () => {
    setToDoList([]);
  };

  const toggleCheck = (index) => {
    const newToDoList = toDoList.map((toDo, i) => {
      if (i === index) {
        return { ...toDo, checked: !toDo.checked };
      }
      return toDo;
    });
    setToDoList(newToDoList);
  };

  return (
    <div className="container">
      <h2>To Do List</h2>
      <input
        type="text"
        placeholder="할 일을 입력하세요"
        value={toDo}
        onChange={(e) => setToDo(e.target.value)}
      />
      <button type="button" onClick={addToDoList}>추가</button>
      {toDoList.map((toDo, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={toDo.checked}
            onChange={() => toggleCheck(index)}
          />
          <span style={{ textDecoration: toDo.checked ? 'line-through' : 'none' }}>
            {toDo.text}
          </span>
          <button type="button" onClick={() => deleteToDoList(index)}>삭제</button>
        </div>
      ))}
      <div>
        <button type="button" onClick={deleteAllToDoList}>전체 삭제</button>
      </div>
    </div>
  );
}