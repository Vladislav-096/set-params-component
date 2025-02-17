import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

// Типы параметров
type ParamType = "string" | "number" | "select";

// Определение интерфейса параметра
interface Param<T = string | number> {
  id: number;
  name: string;
  type: ParamType;
  options?: T extends string ? string[] : never; // Опции только для select
}

// Интерфейс для значений параметров
interface ParamValue<T = string | number> {
  paramId: number;
  value: T;
}

// Интерфейс структуры Model
interface Model {
  paramValues: ParamValue[];
  colors: string[];
}

const params: Param[] = [
  { id: 1, name: "Назначение", type: "string" },
  { id: 2, name: "Длина", type: "string" },
  { id: 3, name: "Размер", type: "number" },
  {
    id: 4,
    name: "Цвет",
    type: "select",
    options: ["Красный", "Синий", "Зеленый", "Черный", "Белый"],
  },
];

const model: Model = {
  paramValues: [
    { paramId: 1, value: "повседневное" },
    { paramId: 2, value: "макси" },
    { paramId: 3, value: 33 },
  ],
  colors: [],
};

const Layout = () => {
  // Локальное состояние для хранения значений параметров
  const [paramValues, setParamValues] = useState<ParamValue[]>(
    model.paramValues || []
  );

  // Обработчик изменения значений параметров
  const handleChange = (paramId: number, newValue: string | number) => {
    setParamValues((prevValues) => {
      const existingValueIndex = prevValues.findIndex(
        (pv) => pv.paramId === paramId
      );

      if (existingValueIndex !== -1) {
        const updatedValues = [...prevValues];
        updatedValues[existingValueIndex] = { paramId, value: newValue };
        return updatedValues;
      } else {
        return [...prevValues, { paramId, value: newValue }];
      }
    });
  };

  // Метод получения полной модели
  const getModel = (): Model => {
    return {
      paramValues,
      colors: model.colors || [],
    };
  };

  // Рендеринг каждого параметра в зависимости от типа
  const renderParamInput = (param: Param) => {
    const currentValue =
      paramValues.find((pv) => pv.paramId === param.id)?.value || "";

    switch (param.type) {
      case "string":
        return (
          <input
            type="text"
            value={currentValue as string}
            onChange={(e) => handleChange(param.id, e.target.value)}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={currentValue as number}
            onChange={(e) => handleChange(param.id, Number(e.target.value))}
          />
        );
      case "select":
        return (
          <select
            value={currentValue as string}
            onChange={(e) => handleChange(param.id, e.target.value)}
          >
            <option value="">Выберите значение</option>
            {param.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <main>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h2>Редактирование параметров</h2>
        {params.map((param) => (
          <div key={param.id}>
            <label>
              {param.name}:{renderParamInput(param)}
            </label>
          </div>
        ))}
        <button onClick={() => console.log(getModel())}>Получить модель</button>
      </div>
    </main>
  );
};

root.render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);
