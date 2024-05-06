import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Select from "react-select";
import { QUERY_FILES } from "./apollo";

export default function SelectFileName({
  className,
  style,
  onChange,
  disabled,
  value,
}) {
  const [items, setItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    label: "File name",
    value: "File name",
  });
  const [getValueInput, setGetValueInput] = useState(null);
  const [fetchData, { data, loading }] = useLazyQuery(QUERY_FILES);
  useEffect(() => {
    fetchData({
      variables: {
        where: {
          filename: getValueInput ? String(getValueInput) : undefined,
        },
        limit: 5,
      },
    });
  }, [getValueInput]);
  useEffect(() => {
    const results = data?.files?.data || [];
    if (results?.length > 0) {
      const _results = results.map((item) => {
        const object = {
          ...item,
          value: item?._id,
          label: item?.filename,
        };
        return object;
      });
      setItems([{ label: "File name", value: "File name" }, ..._results]);
    } else {
      setItems([]);
    }
  }, [data]);
  useEffect(() => {
    if (!selectedOption) {
      if (value) {
        const result = items?.filter((item) => item?._id === value);
        setSelectedOption(result[0] || null);
      } else {
        setSelectedOption(null);
      }
    }
  }, [items]);
  return (
    <div style={{ minWidth: 200, maxWidth: 200, color: "black" }}>
      <Select
        styles={style}
        className={className}
        isDisabled={disabled}
        value={selectedOption}
        placeholder={loading ? "loading..." : "Select Files"}
        onChange={(res) => {
          if (res.value === "File name") {
            setSelectedOption(res);
            onChange(null);
          } else {
            setSelectedOption(res);
            onChange(res?._id);
            setGetValueInput(getValueInput);
          }
        }}
        onInputChange={(inputValue) => {
          if (inputValue) {
            if (value) {
              if (inputValue === selectedOption?.filename) {
                setGetValueInput(getValueInput);
              } else {
                setGetValueInput(inputValue);
              }
            } else {
              setGetValueInput(inputValue);
            }
          } else {
            setGetValueInput(getValueInput);
          }
        }}
        options={items}
      />
    </div>
  );
}
